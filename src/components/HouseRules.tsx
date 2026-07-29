import { Reveal } from "@/components/Reveal";
import { houseRules } from "@/lib/site";

export function HouseRules() {
  return (
    <section id="rules" className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">

        <Reveal className="mb-14 text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange">
            House Rules
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-brick">
            Keep the lounge calm for everyone
          </h2>
          <p className="mt-5 text-[16.5px] font-light leading-[1.8] text-[var(--ink-muted)]">
            A few simple rules so guests and cats can share the same slow pace.
          </p>
        </Reveal>

        <Reveal>
          <ol className="m-0 list-none space-y-0 p-0">
            {houseRules.map((rule, index) => (
              <li
                key={rule}
                className="flex gap-5 border-b border-[var(--ink-line)] py-5 text-[16px] font-light leading-[1.7] text-[var(--ink-muted)] first:pt-0 last:border-b-0"
              >
                <span className="w-7 shrink-0 font-display text-[18px] font-semibold italic text-orange/70 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </Reveal>

      </div>
    </section>
  );
}
