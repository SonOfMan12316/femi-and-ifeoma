import type { Plan } from "@/lib/site";

/**
 * A selectable pass option in the booking flow.
 *
 * Built as its own component because the catalogue changes — it has already
 * gone from five plans to two (DEC-020), and limited-run passes are likely to
 * return. Anything plan-shaped should render through here.
 *
 * Interaction: the whole card is the control. Selecting a pass is the only
 * action available at this step, so a separate button inside a clickable card
 * would be a second target for the same job.
 */
export function PassCard({
  plan,
  selected,
  onSelect,
  index,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  /** Position in the list, for the staggered entrance. */
  index: number;
}) {
  const priceLabel = `₦${plan.price.toLocaleString("en-NG")}`;
  const unit = plan.wholeDay
    ? "per person, per day"
    : plan.perPerson
      ? "per person"
      : plan.guestCount
        ? `for ${plan.guestCount} guests`
        : "";
  const duration = plan.wholeDay ? "All day · 10 AM – 8 PM" : `${plan.durationMins} minutes`;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        // Soft card floating on the page — generous radius, no hard stroke.
        "stagger-item group relative w-full rounded-[22px] px-7 py-7 text-left md:px-9 md:py-8",
        "transition-[background-color,box-shadow,transform] duration-[220ms] ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--accent-ring),var(--shadow-md)]",
        // Selection is a warm ring and a richer tint, never a black outline.
        selected
          ? "bg-[var(--accent-tint-2)] shadow-[var(--accent-ring),var(--accent-glow)]"
          : "bg-sand shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        // Lift is pointer-gated: on touch a tap fires a false hover and the
        // card would stay raised after the finger leaves.
        "hover-lift",
        "active:translate-y-0 active:scale-[0.995] active:duration-[var(--duration-press)]",
        "motion-reduce:transform-none motion-reduce:transition-none",
      ].join(" ")}
      style={{ animationDelay: `${(index + 1) * 100}ms` }}
    >
      {/* Selected badge — corner-anchored so it reads as a stamp on the card. */}
      {selected && (
        <span
          className="badge-in absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-white shadow-[var(--shadow-sm)] md:right-6 md:top-6"
          aria-hidden
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" strokeWidth="2.5">
            <path d="M5 10.5l3.5 3.5L15 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      <div className="pr-10">
        <h2 className="font-display text-[20px] font-semibold leading-tight text-brick md:text-[22px]">
          {plan.name}
        </h2>

        {/* Price carries the most weight on the card — it's what the eye is
            looking for. Duration sits beside it as secondary detail. */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[26px] font-semibold leading-none tracking-[-0.01em] text-brick md:text-[30px]">
            {priceLabel}
          </span>
          {unit && <span className="text-[13px] text-[var(--ink-soft)]">{unit}</span>}
        </div>

        <p className="mt-1.5 text-[13px] uppercase tracking-[0.08em] text-orange">{duration}</p>

        <p className="mt-4 text-[14.5px] font-light leading-[1.75] text-[var(--ink-muted)]">
          {plan.description}
        </p>
      </div>
    </button>
  );
}
