/**
 * The café's opening schedule, in one place.
 *
 * Slot *keys* are canonical 24h strings ("10:00"). Labels are only for display
 * — they're sent to the frontend so it never has to reconstruct them, but the
 * database only ever stores the key. Changing a label is safe; changing a key
 * orphans existing bookings.
 */

export type TimeSlot = { value: string; label: string };

/** Sessions start hourly; the last one ends at 8 PM (DEC-020). */
export const TIME_SLOTS: TimeSlot[] = [
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
];

/**
 * Whole-day passes (Co-Work Space) aren't tied to a start time — the guest
 * books a date and comes when they like. They still need *a* value in
 * `bookings.time_slot`, so they share this sentinel. Grouping by it gives a
 * natural per-day count without a separate table or a nullable column.
 */
export const ALL_DAY = "all-day";
export const ALL_DAY_LABEL = "All day (10 AM – 8 PM)";

export const SLOT_VALUES = TIME_SLOTS.map((slot) => slot.value);

/** Every value `bookings.time_slot` may legitimately hold. */
export const BOOKABLE_SLOT_VALUES = [...SLOT_VALUES, ALL_DAY];

/** Sentinel used by SlotClosure.timeSlot to close an entire day. */
export const CLOSE_WHOLE_DAY = "*";

/** Open Monday–Saturday. 0 = Sunday. */
export const CLOSED_WEEKDAYS = new Set([0]);

/**
 * Plans pinned to a single weekday, keyed by plan id. Empty since PlayDate
 * ("Every Wednesday") was retired in DEC-020 — kept because the rule is
 * cheap to carry and limited-run plans are likely to come back.
 */
export const PLAN_WEEKDAYS: Record<string, number> = {};

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** A plan booked by date alone, with no start time. */
export function isWholeDayPlan(plan: { bookingType: string }): boolean {
  return plan.bookingType === "workspace";
}

/**
 * Parse a "YYYY-MM-DD" calendar date into the UTC-midnight Date that Prisma's
 * `@db.Date` round-trips losslessly.
 *
 * Deliberately *not* `new Date(str)` on a full timestamp: the café is in Lagos
 * (UTC+1), so parsing "2026-10-02T00:00" in server-local time and storing it
 * would land on 2026-10-01 for any server west of Lagos. A calendar date has no
 * timezone — we pin it to UTC midnight and never apply an offset to it again.
 */
export function parseCalendarDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) throw new Error(`Expected a YYYY-MM-DD date, got "${value}"`);
  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

/** Inverse of parseCalendarDate — "YYYY-MM-DD" from a @db.Date value. */
export function formatCalendarDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Day of week (0 = Sunday) for a calendar date, read in UTC to match storage. */
export function calendarWeekday(date: Date): number {
  return date.getUTCDay();
}

/**
 * Today in Africa/Lagos, as a UTC-midnight calendar date. Used for "is this
 * date in the past" — which must follow the café's clock, not the server's.
 */
export function lagosToday(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parseCalendarDate(parts);
}
