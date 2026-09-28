import { Injectable } from "@nestjs/common";
import { Prisma, BookingStatus, Plan } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { slotCapacity } from "../common/capacity.config";
import {
  ALL_DAY,
  ALL_DAY_LABEL,
  CLOSED_WEEKDAYS,
  CLOSE_WHOLE_DAY,
  TIME_SLOTS,
  calendarWeekday,
  formatCalendarDate,
  isWholeDayPlan,
  lagosToday,
  parseCalendarDate,
} from "../common/schedule";

export type SlotAvailability = {
  value: string;
  label: string;
  /** How many guests are already booked. Reporting only — not a limit (DEC-021). */
  booked: number;
  available: boolean;
  /** Present only if a hard SLOT_CAPACITY has been configured. */
  capacity?: number;
  remaining?: number;
  closedReason?: string;
};

export type DayAvailability = {
  date: string;
  open: boolean;
  closedReason?: string;
  capacityPerSlot: number | null;
  slots: SlotAvailability[];
};

/**
 * Statuses that represent a live booking. `pending` counts only while its hold
 * is unexpired; `cancelled`, `no_show` and `expired` never count.
 */
const LIVE_STATUSES: BookingStatus[] = ["pending", "confirmed", "completed"];

/**
 * Predicate for "this booking is live right now". Shared by the availability
 * read path and the admin day sheet so the two can never disagree about how
 * many people are coming.
 */
export function liveBookingWhere(now: Date): Prisma.BookingWhereInput {
  return {
    status: { in: LIVE_STATUSES },
    OR: [
      { status: { in: ["confirmed", "completed"] } },
      { status: "pending", holdExpiresAt: { gt: now } },
    ],
  };
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Bookable times for one date.
   *
   * Whole-day plans (Co-Work) collapse to a single "all day" entry — they're
   * booked by date, with no start time. Everything else gets the hourly slots.
   */
  async forDate(dateStr: string, plan?: Plan | null): Promise<DayAvailability> {
    const date = parseCalendarDate(dateStr);
    const capacity = slotCapacity();
    const wholeDay = plan ? isWholeDayPlan(plan) : false;
    const template = wholeDay
      ? [{ value: ALL_DAY, label: ALL_DAY_LABEL }]
      : TIME_SLOTS;

    const closedReason = await this.dayClosedReason(date);
    if (closedReason) {
      return {
        date: dateStr,
        open: false,
        closedReason,
        capacityPerSlot: capacity,
        slots: template.map((slot) => ({
          ...slot,
          booked: 0,
          available: false,
          closedReason,
        })),
      };
    }

    // One grouped query for the whole day rather than one per slot.
    const grouped = await this.prisma.booking.groupBy({
      by: ["timeSlot"],
      _sum: { partySize: true },
      where: { bookingDate: date, ...liveBookingWhere(new Date()) },
    });
    const bookedBySlot = new Map(grouped.map((row) => [row.timeSlot, row._sum.partySize ?? 0]));

    const closures = await this.prisma.slotClosure.findMany({ where: { date } });
    const closureBySlot = new Map(closures.map((c) => [c.timeSlot, c.reason ?? "Closed"]));

    return {
      date: dateStr,
      open: true,
      capacityPerSlot: capacity,
      slots: template.map((slot) => {
        const booked = bookedBySlot.get(slot.value) ?? 0;
        const slotClosure = closureBySlot.get(slot.value);
        // Without a configured cap every open slot stays bookable however
        // many people have already booked it (DEC-021).
        const remaining = capacity === null ? null : Math.max(0, capacity - booked);

        return {
          ...slot,
          booked,
          available: !slotClosure && (remaining === null || remaining > 0),
          ...(capacity !== null ? { capacity, remaining: remaining ?? 0 } : {}),
          ...(slotClosure ? { closedReason: slotClosure } : {}),
        };
      }),
    };
  }

  /**
   * Which days of a month are bookable at all. With no capacity cap this is
   * purely the calendar — past dates, Sundays, and staff closures.
   */
  async forMonth(year: number, month: number) {
    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 1));
    const today = lagosToday();

    const [grouped, closures] = await Promise.all([
      this.prisma.booking.groupBy({
        by: ["bookingDate"],
        _sum: { partySize: true },
        where: { bookingDate: { gte: monthStart, lt: monthEnd }, ...liveBookingWhere(new Date()) },
      }),
      this.prisma.slotClosure.findMany({
        where: { date: { gte: monthStart, lt: monthEnd }, timeSlot: CLOSE_WHOLE_DAY },
      }),
    ]);

    const bookedByDate = new Map(
      grouped.map((row) => [formatCalendarDate(row.bookingDate), row._sum.partySize ?? 0]),
    );
    const closedDates = new Map(
      closures.map((c) => [formatCalendarDate(c.date), c.reason ?? "Closed"]),
    );

    const days: {
      date: string;
      open: boolean;
      booked: number;
      closedReason?: string;
    }[] = [];

    for (
      let cursor = new Date(monthStart);
      cursor < monthEnd;
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    ) {
      const dateStr = formatCalendarDate(cursor);
      const reason =
        cursor < today
          ? "Date has passed"
          : CLOSED_WEEKDAYS.has(calendarWeekday(cursor))
            ? "Closed on Sundays"
            : closedDates.get(dateStr);

      days.push({
        date: dateStr,
        open: !reason,
        booked: bookedByDate.get(dateStr) ?? 0,
        ...(reason ? { closedReason: reason } : {}),
      });
    }

    return { year, month, capacityPerSlot: slotCapacity(), days };
  }

  /**
   * Why the café is shut on this date, or null if it's open. Ordering matters:
   * past dates and Sundays are structural; a SlotClosure is an ad-hoc override.
   */
  private async dayClosedReason(date: Date): Promise<string | null> {
    if (date < lagosToday()) return "Date has passed";
    if (CLOSED_WEEKDAYS.has(calendarWeekday(date))) return "Closed on Sundays";

    const closure = await this.prisma.slotClosure.findUnique({
      where: { date_timeSlot: { date, timeSlot: CLOSE_WHOLE_DAY } },
    });
    return closure ? (closure.reason ?? "Closed") : null;
  }
}
