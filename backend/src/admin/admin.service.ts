import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { slotCapacity } from "../common/capacity.config";
import { ALL_DAY, ALL_DAY_LABEL, TIME_SLOTS, parseCalendarDate } from "../common/schedule";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The café's day sheet: who is coming, at what time, and how many.
   *
   * This is the whole point of tracking now that bookings are uncapped
   * (DEC-021) — the site never refuses anyone, so staff need to see the real
   * numbers ahead of time to plan for them. Confirmed and pending are reported
   * separately so an unpaid checkout is never mistaken for an arrival.
   */
  async daySheet(dateStr: string) {
    const date = parseCalendarDate(dateStr);
    const capacity = slotCapacity();

    const bookings = await this.prisma.booking.findMany({
      where: {
        bookingDate: date,
        status: { in: ["pending", "confirmed", "completed", "no_show"] },
      },
      include: { plan: { select: { name: true } } },
      orderBy: [{ timeSlot: "asc" }, { createdAt: "asc" }],
    });

    const now = new Date();
    const live = bookings.filter(
      (b) => b.status !== "pending" || (b.holdExpiresAt !== null && b.holdExpiresAt > now),
    );

    // Whole-day (Co-Work) bookings sit in their own row rather than being
    // spread across every hour.
    const template = [...TIME_SLOTS, { value: ALL_DAY, label: ALL_DAY_LABEL }];

    const slots = template.map((slot) => {
      const forSlot = live.filter((b) => b.timeSlot === slot.value);
      const confirmedGuests = forSlot
        .filter((b) => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, b) => sum + b.partySize, 0);
      const pendingGuests = forSlot
        .filter((b) => b.status === "pending")
        .reduce((sum, b) => sum + b.partySize, 0);

      return {
        ...slot,
        confirmedGuests,
        pendingGuests,
        totalGuests: confirmedGuests + pendingGuests,
        ...(capacity !== null
          ? {
              capacity,
              remaining: Math.max(0, capacity - confirmedGuests - pendingGuests),
            }
          : {}),
        bookings: forSlot.map((b) => ({
          id: b.id,
          name: `${b.guestFirstName} ${b.guestLastName}`,
          email: b.guestEmail,
          phone: b.guestPhone,
          plan: b.plan.name,
          partySize: b.partySize,
          amountKobo: b.amountKobo,
          status: b.status,
          paymentStatus: b.paymentStatus,
          reference: b.paymentReference,
        })),
      };
    });

    return {
      date: dateStr,
      capacityPerSlot: capacity,
      totals: {
        confirmedGuests: slots.reduce((sum, s) => sum + s.confirmedGuests, 0),
        pendingGuests: slots.reduce((sum, s) => sum + s.pendingGuests, 0),
        bookings: live.length,
        revenueKobo: live
          .filter((b) => b.paymentStatus === "paid")
          .reduce((sum, b) => sum + b.amountKobo, 0),
      },
      slots,
    };
  }
}
