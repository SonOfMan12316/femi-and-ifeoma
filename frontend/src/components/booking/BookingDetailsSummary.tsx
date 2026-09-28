"use client";

import type { Plan } from "@/lib/site";
import { CalendarIcon, ClockIcon, CupIcon, LaptopIcon, UsersIcon } from "./icons";

/** "Monday 28 September" — no year, no commas. */
function formatDayMonth(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * What the guest is about to pay for, shown beside the form.
 *
 * Every row that reflects an earlier choice carries a "Change" link back to
 * the step that set it — a summary that can't be corrected just makes people
 * use the browser's back button, which loses the held booking.
 */
export function BookingDetailsSummary({
  plan,
  selectedDate,
  timeWindow,
  partySize,
  total,
  onChange,
}: {
  plan: Plan;
  selectedDate: string;
  timeWindow: string;
  partySize: number;
  total: number;
  onChange: () => void;
}) {
  const PlanIcon = plan.wholeDay ? LaptopIcon : CupIcon;

  const changeLink = (
    <button
      type="button"
      onClick={onChange}
      className="rounded text-[13px] text-[var(--booking-accent)] underline-offset-2 transition-opacity duration-150 hover:underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] focus-visible:ring-offset-1"
    >
      Change
    </button>
  );

  const row = (
    icon: React.ReactNode,
    text: string,
    action?: React.ReactNode,
  ) => (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="shrink-0 text-[var(--booking-muted)]">{icon}</span>
        <span className="truncate text-[14px] text-[var(--ink)]">{text}</span>
      </span>
      {action}
    </div>
  );

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--booking-peach)] text-[var(--booking-icon)]"
          aria-hidden
        >
          <PlanIcon />
        </span>
        <p className="text-[15px] font-medium text-[var(--ink)]">{plan.name}</p>
      </div>

      <div className="mt-5">
        {row(<CalendarIcon className="h-4 w-4" />, formatDayMonth(selectedDate), changeLink)}
        {row(<ClockIcon />, timeWindow)}
        {row(
          <UsersIcon />,
          `${partySize} ${partySize === 1 ? "guest" : "guests"}`,
          changeLink,
        )}
      </div>

      <div className="mt-5 border-t border-[var(--booking-border)] pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[13px] text-[var(--booking-muted)]">
            ₦{plan.price.toLocaleString("en-NG")} × {partySize}{" "}
            {partySize === 1 ? "guest" : "guests"}
          </span>
          <span className="text-[14px] text-[var(--ink)]">
            ₦{total.toLocaleString("en-NG")}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-[var(--booking-border)] pt-3">
          <span className="text-[15px] font-medium text-[var(--ink)]">Total</span>
          <span className="text-[20px] font-medium text-[var(--ink)]">
            ₦{total.toLocaleString("en-NG")}
          </span>
        </div>
      </div>
    </div>
  );
}
