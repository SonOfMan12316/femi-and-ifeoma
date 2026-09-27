import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Plan } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import { MembersService } from "../members/members.service";
import { EmailService } from "../email/email.service";
import { liveBookingWhere } from "../availability/availability.service";
import { holdMinutes, slotCapacity } from "../common/capacity.config";
import { CreateBookingDto } from "./dto/create-booking.dto";
import {
  ALL_DAY,
  CLOSED_WEEKDAYS,
  CLOSE_WHOLE_DAY,
  PLAN_WEEKDAYS,
  SLOT_VALUES,
  WEEKDAY_NAMES,
  calendarWeekday,
  isWholeDayPlan,
  lagosToday,
  parseCalendarDate,
} from "../common/schedule";

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly members: MembersService,
    private readonly email: EmailService,
  ) {}

  /**
   * Step 1 of the flow in 12-BOOKING_MEMBERSHIP_SCHEMA.md: create a *pending*
   * booking that holds its seats, before the guest is sent to Paystack.
   *
   * No member row is created here — membership is granted on confirmed payment
   * (DEC-019), so abandoned checkouts never end up on the mailing list.
   */
  async create(dto: CreateBookingDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
    if (!plan || !plan.active) {
      throw new BadRequestException(`Unknown or inactive plan "${dto.planId}"`);
    }

    const date = parseCalendarDate(dto.bookingDate);
    // Whole-day passes have no start time — they all share the ALL_DAY key so
    // a day's co-workers still group into one count.
    const timeSlot = isWholeDayPlan(plan) ? ALL_DAY : dto.timeSlot;

    if (!timeSlot || (timeSlot !== ALL_DAY && !SLOT_VALUES.includes(timeSlot))) {
      throw new BadRequestException(`${plan.name} needs a valid time slot.`);
    }

    await this.assertDateIsBookable(date, plan, timeSlot);

    // Fixed-size passes set the party size themselves. Trusting the client
    // would let someone book a group pass for six at the two-guest price.
    const partySize = plan.guestCount ?? dto.partySize;

    // There is no per-slot limit (DEC-021) — the café absorbs demand and
    // manages it on the floor. An optional SLOT_CAPACITY can reinstate one.
    const capacity = slotCapacity();
    if (capacity !== null) {
      const booked = await this.liveGuestCount(date, timeSlot);
      const remaining = capacity - booked;
      if (partySize > remaining) {
        throw new ConflictException({
          code: "SLOT_FULL",
          message:
            remaining <= 0
              ? "That time slot just filled up. Please pick another time."
              : `Only ${remaining} space${remaining === 1 ? "" : "s"} left in that time slot.`,
          remaining: Math.max(0, remaining),
        });
      }
    }

    // Price comes from the plans table, never from the browser (DEC-018).
    const amountKobo = plan.perPerson ? plan.priceKobo * partySize : plan.priceKobo;

    return this.prisma.booking.create({
      data: {
        planId: plan.id,
        bookingDate: date,
        timeSlot,
        partySize,
        amountKobo,
        status: "pending",
        paymentStatus: "pending",
        paymentReference: `FI-${randomUUID()}`,
        holdExpiresAt: new Date(Date.now() + holdMinutes() * 60_000),
        guestFirstName: dto.firstName.trim(),
        guestLastName: dto.lastName.trim(),
        guestEmail: dto.email.trim().toLowerCase(),
        guestPhone: dto.phone?.trim(),
        marketingOptIn: dto.marketingOptIn ?? false,
      },
      include: { plan: true },
    });
  }

  /** Guests already booked into one slot. Reporting, and the optional cap. */
  private async liveGuestCount(date: Date, timeSlot: string) {
    const result = await this.prisma.booking.aggregate({
      _sum: { partySize: true },
      where: { bookingDate: date, timeSlot, ...liveBookingWhere(new Date()) },
    });
    return result._sum.partySize ?? 0;
  }

  /** Opening-hours and per-plan schedule rules. */
  private async assertDateIsBookable(date: Date, plan: Plan, timeSlot: string) {
    if (date < lagosToday()) {
      throw new BadRequestException("That date has already passed.");
    }
    if (CLOSED_WEEKDAYS.has(calendarWeekday(date))) {
      throw new BadRequestException("We're closed on Sundays.");
    }

    const planWeekday = PLAN_WEEKDAYS[plan.id];
    if (planWeekday !== undefined && calendarWeekday(date) !== planWeekday) {
      throw new BadRequestException(
        `${plan.name} runs on ${WEEKDAY_NAMES[planWeekday]}s only.`,
      );
    }

    const closure = await this.prisma.slotClosure.findFirst({
      where: { date, timeSlot: { in: [CLOSE_WHOLE_DAY, timeSlot] } },
    });
    if (closure) {
      throw new BadRequestException(closure.reason ?? "That time isn't available.");
    }
  }

  /**
   * Step 2: the single confirmation path, shared by the Paystack webhook and
   * the browser callback. Idempotent — a replayed webhook must not double-count
   * a member's visits, so an already-confirmed booking returns untouched.
   */
  async confirmByReference(paymentReference: string, amountPaidKobo: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { paymentReference },
      include: { plan: true },
    });
    if (!booking) {
      throw new NotFoundException(`No booking for payment reference "${paymentReference}"`);
    }

    if (booking.paymentStatus === "paid") {
      this.logger.log(`Booking ${booking.id} already confirmed; ignoring replay`);
      return booking;
    }

    if (amountPaidKobo < booking.amountKobo) {
      this.logger.error(
        `Underpayment on ${paymentReference}: paid ${amountPaidKobo}, expected ${booking.amountKobo}`,
      );
      throw new BadRequestException("Payment amount does not match the booking.");
    }

    const member = await this.members.upsertOnVisit({
      firstName: booking.guestFirstName,
      lastName: booking.guestLastName,
      email: booking.guestEmail,
      phone: booking.guestPhone ?? undefined,
      marketingOptIn: booking.marketingOptIn,
    });

    const confirmed = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          memberId: member.id,
          status: "confirmed",
          paymentStatus: "paid",
          holdExpiresAt: null,
        },
        include: { plan: true, member: true },
      });
      await tx.visit.create({
        data: { memberId: member.id, bookingId: booking.id, visitType: "cafe_visit" },
      });
      return updated;
    });

    // A bounced email must never fail a paid booking.
    void this.email.sendBookingConfirmation(confirmed).catch((err) => {
      this.logger.error(`Confirmation email failed for ${confirmed.id}: ${String(err)}`);
    });

    return confirmed;
  }

  /** Payment failed or was abandoned — free the seats straight away. */
  async release(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException(`Booking "${id}" not found`);
    if (booking.status !== "pending") return booking;

    return this.prisma.booking.update({
      where: { id },
      data: { status: "expired", holdExpiresAt: null },
    });
  }

  /**
   * Marks abandoned checkouts (browser closed mid-payment) as `expired` so they
   * stop appearing as pending arrivals on the staff day sheet. With no capacity
   * cap this frees nothing — it is bookkeeping, not correctness.
   */
  async sweepExpiredHolds() {
    const { count } = await this.prisma.booking.updateMany({
      where: { status: "pending", holdExpiresAt: { lt: new Date() } },
      data: { status: "expired", holdExpiresAt: null },
    });
    if (count > 0) this.logger.log(`Released ${count} expired booking hold(s)`);
    return count;
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { plan: true, member: true },
      orderBy: [{ bookingDate: "desc" }, { timeSlot: "asc" }],
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { plan: true, member: true },
    });
    if (!booking) throw new NotFoundException(`Booking "${id}" not found`);
    return booking;
  }
}
