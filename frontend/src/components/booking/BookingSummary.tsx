"use client";

import type { ReactNode } from "react";
import { site, type Plan } from "@/lib/site";
import { ArrowRight, CalendarIcon } from "./icons";

/** "Saturday 26 September" — no year, no commas. */
export function formatDayMonth(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Right-hand panel of the booking card: what you've chosen, what it costs,
 * and the way forward.
 *
 * `slotPicker` is injected rather than rendered here so hourly plans can drop
 * their time-slot list into the same place a whole-day pass shows its fixed
 * window — one panel, two plan shapes, no branching on plan type in two files.
 */
export function BookingSummary({
  plan,
  selectedDate,
  timeWindow,
  partySize,
  total,
  canContinue,
  onContinue,
  slotPicker,
}: {
  plan: Plan;
  selectedDate: string | null;
  /** Fixed window for a day pass, or the chosen slot's label. */
  timeWindow: string | null;
  partySize: number;
  total: number;
  canContinue: boolean;
  onContinue: () => void;
  slotPicker?: ReactNode;
}) {
  if (!selectedDate) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-14 text-center">
        <CalendarIcon className="h-7 w-7 text-[var(--booking-accent)]" />
        <p className="mt-4 text-[15px] font-medium text-[var(--ink)]">Pick a day</p>
        <p className="mt-2 max-w-[22ch] text-[13px] leading-relaxed text-[var(--booking-muted)]">
          {/* Hours come from site config so this can never drift from the
              rest of the site. */}
          Open {site.hours.replace(/\s*\(GMT\+1\)\s*$/, "").replace("–", "to")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <p className="text-[12px] text-[var(--booking-muted)]">
        {plan.wholeDay ? "Your day pass" : "Your visit"}
      </p>
      <p className="mt-1 text-[15px] font-medium text-[var(--ink)]">
        {formatDayMonth(selectedDate)}
      </p>
      {timeWindow && (
        <p className="mt-1 text-[13px] text-[var(--booking-muted)]">{timeWindow}</p>
      )}

      {slotPicker && <div className="mt-5">{slotPicker}</div>}

      <div className="mt-6 border-t border-[var(--booking-border)] pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[13px] text-[var(--booking-muted)]">
            ₦{plan.price.toLocaleString("en-NG")} × {partySize}{" "}
            {partySize === 1 ? "guest" : "guests"}
          </span>
          <span className="text-[15px] font-medium text-[var(--ink)]">
            ₦{total.toLocaleString("en-NG")}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[var(--booking-accent)] text-[14px] font-medium text-white transition-[opacity,background-color] duration-150 ease-[var(--ease-out)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
