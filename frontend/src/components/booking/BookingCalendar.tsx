"use client";

import type { MonthAvailability } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "./icons";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "YYYY-MM-DD" from calendar parts — the key the API speaks. */
function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * The booking calendar.
 *
 * Availability is entirely server-decided — past dates, Sundays, staff
 * closures and anything else all arrive as `open: false`. This component never
 * decides what is bookable; it only renders what it was told.
 */
export function BookingCalendar({
  value,
  onChange,
  month,
  onMonthChange,
  availability,
  loading,
  error,
  onRetry,
}: {
  value: string | null;
  onChange: (dateStr: string) => void;
  month: { year: number; month: number };
  onMonthChange: (next: { year: number; month: number }) => void;
  availability: MonthAvailability | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const firstDow = new Date(month.year, month.month, 1).getDay();
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
  const cells = Array.from({ length: firstDow + daysInMonth }, (_, i) =>
    i < firstDow ? null : i - firstDow + 1,
  );

  const byDate = new Map(availability?.days.map((d) => [d.date, d]) ?? []);

  // Nothing before the current month is bookable, so there's nowhere to go back to.
  const now = new Date();
  const atCurrentMonth =
    month.year === now.getFullYear() && month.month === now.getMonth();

  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());

  function shift(delta: number) {
    const next = new Date(month.year, month.month + delta, 1);
    onMonthChange({ year: next.getFullYear(), month: next.getMonth() });
  }

  const navButton =
    "flex h-8 w-8 items-center justify-center rounded-full border border-[var(--booking-border)] text-[var(--ink)] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-[var(--booking-peach)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[15px] font-medium text-[var(--ink)]">
          {MONTHS[month.month]} {month.year}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={atCurrentMonth}
            aria-label="Previous month"
            className={navButton}
          >
            <ChevronLeft />
          </button>
          <button type="button" onClick={() => shift(1)} aria-label="Next month" className={navButton}>
            <ChevronRight />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[var(--booking-accent)] px-4 py-3 text-[13px] text-[var(--booking-accent)]">
          <p>{error}</p>
          <button type="button" onClick={onRetry} className="mt-2 underline">
            Try again
          </button>
        </div>
      )}
      {loading && !availability && (
        <p className="mb-4 text-[13px] text-[var(--booking-muted)]">Loading available dates…</p>
      )}

      <div
        className={`grid grid-cols-7 justify-items-center gap-y-1 transition-opacity duration-150 ${
          loading ? "opacity-50" : ""
        }`}
      >
        {WEEKDAYS.map((d) => (
          <div key={d} className="flex h-8 w-10 items-center justify-center text-[12px] text-[var(--booking-muted)]">
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="h-10 w-10" />;

          const dateStr = toDateStr(month.year, month.month, day);
          const info = byDate.get(dateStr);
          // Until availability loads, nothing is clickable — better than
          // offering a date the café turns out to be closed on.
          const available = info?.open ?? false;
          const selected = value === dateStr;
          const isToday = dateStr === todayStr;

          const fullDate = new Date(month.year, month.month, day).toLocaleDateString("en-NG", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          });

          return (
            <button
              key={day}
              type="button"
              disabled={!available}
              aria-label={available ? fullDate : `${fullDate} — unavailable`}
              aria-pressed={selected}
              title={info?.closedReason}
              onClick={() => onChange(dateStr)}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full text-[14px]",
                "transition-colors duration-150 ease-[var(--ease-out)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] focus-visible:ring-offset-1",
                selected
                  ? "bg-[var(--booking-accent)] text-white"
                  : available
                    ? "text-[var(--ink)] hover:bg-[var(--booking-peach)]"
                    : // Struck through so an unavailable day reads as ruled
                      // out, not merely unemphasised.
                      "cursor-default text-[var(--booking-muted)] line-through",
                isToday && !selected ? "ring-1 ring-inset ring-[var(--booking-accent)]" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
