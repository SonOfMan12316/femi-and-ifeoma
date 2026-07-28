import { Reveal } from "@/components/Reveal";
import { houseRules } from "@/lib/site";

export function HouseRules() {
  return (
    <section id="rules" className="scroll-mt-24 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-12 text-center">
          <p className="mb-3 text-[13px] uppercase tracking-[0.14em] text-orange">
            House Rules
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight text-brick">
            Keep the lounge calm for everyone
          </h2>
          <p className="mt-4 text-[17px] font-light leading-relaxed text-[var(--ink-muted)]">
            A few simple rules so guests and cats can share the same slow pace.
          </p>
        </Reveal>

        <Reveal>
          <ol className="m-0 list-none space-y-4 p-0">
            {houseRules.map((rule, index) => (
              <li
                key={rule}
                className="flex gap-4 border-b border-[var(--ink-line)] pb-4 text-[16px] font-light leading-relaxed text-[var(--ink-muted)]"
              >
                <span className="font-display text-[20px] italic text-orange">
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
