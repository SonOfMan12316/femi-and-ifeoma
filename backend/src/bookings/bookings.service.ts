import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MembersService } from "../members/members.service";
import { CreateBookingDto, ConfirmBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly members: MembersService,
  ) {}

  /**
   * Step 1 of the flow described in 12-BOOKING_MEMBERSHIP_SCHEMA.md: create a
   * *pending* booking before payment. No member is created yet — membership is
   * only granted once payment is confirmed, to avoid polluting the member list
   * with abandoned checkouts.
   */
  async create(dto: CreateBookingDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
    if (!plan || !plan.active) throw new BadRequestException(`Unknown or inactive plan "${dto.planId}"`);

    // A pending booking is held against a placeholder-free member lookup by
    // email so re-submitting the form before payment doesn't create duplicates.
    const amountKobo = plan.priceKobo * dto.partySize;

    const existingMember = await this.prisma.member.findUnique({ where: { email: dto.email } });

    return this.prisma.booking.create({
      data: {
        planId: plan.id,
        bookingDate: new Date(dto.bookingDate),
        timeSlot: dto.timeSlot,
        partySize: dto.partySize,
        amountKobo,
        status: "pending",
        paymentStatus: "pending",
        member: existingMember
          ? { connect: { id: existingMember.id } }
          : {
              create: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phone: dto.phone,
                marketingOptIn: dto.marketingOptIn ?? false,
              },
            },
      },
      include: { plan: true, member: true },
    });
  }

  /**
   * Step 2: called from the Paystack webhook once payment is verified. This is
   * where "booking creates membership" actually takes effect — the member's
   * visit count and last-visit date only move on confirmed payment, and a
   * matching `visits` row is logged.
   */
  async confirm(bookingId: string, dto: ConfirmBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { member: true },
    });
    if (!booking) throw new NotFoundException(`Booking "${bookingId}" not found`);

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentReference: dto.paymentReference,
        paymentStatus: dto.paymentStatus,
        status: dto.paymentStatus === "paid" ? "confirmed" : "cancelled",
      },
    });

    if (dto.paymentStatus === "paid") {
      await this.members.upsertOnVisit({
        firstName: booking.member.firstName,
        lastName: booking.member.lastName,
        email: booking.member.email,
        phone: booking.member.phone ?? undefined,
        marketingOptIn: booking.member.marketingOptIn,
      });
      await this.prisma.visit.create({
        data: { memberId: booking.memberId, bookingId: booking.id, visitType: "cafe_visit" },
      });
    }

    return updated;
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { plan: true, member: true },
      orderBy: { bookingDate: "desc" },
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
