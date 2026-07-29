import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { cats } from "@/lib/site";

// One-line personality per cat — displayed beneath breed
const traits: Record<string, string> = {
  sid:      "Fan favourite",
  purrson:  "Gentle giant",
  biscuit:  "Professional napper",
  chaos:    "Loveable menace",
  honey:    "Always purring",
  midnight: "Surprisingly warm",
};

export function Cats() {
  return (
    <section id="cats" className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">

        {/* ── Section header ── */}
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange">
            Our Cats
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-brick">
            Meet the residents
          </h2>
          <p className="mt-5 text-[16.5px] font-light leading-[1.8] text-[var(--ink-muted)]">
            Six personalities, one very good couch, and the occasional
            standoff over the best window seat.
          </p>
        </Reveal>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat, index) => (
            <Reveal key={cat.id} delayMs={index * 70}>
              <article className="group cursor-default transition-transform duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px]">

                {/* Photo */}
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand transition-shadow duration-[360ms] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.13),0_4px_12px_rgba(0,0,0,0.06)]"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}
                >
                  <Image
                    src={cat.photo}
                    alt={`${cat.name}, ${cat.breed}`}
                    fill
                    className="object-cover transition-transform duration-[420ms] ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Text */}
                <div className="mt-5 px-0.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[20px] font-bold leading-none tracking-[-0.015em] text-brick">
                      {cat.name}
                    </h3>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange/70">
                      {traits[cat.id]}
                    </span>
                  </div>
                  <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-brick/35">
                    {cat.breed}
                  </p>
                  <p className="mt-3 text-[13.5px] font-light italic leading-[1.65] text-brick/52">
                    &ldquo;{cat.quote}&rdquo;
                  </p>
                </div>

              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
