import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

const stats = [
  { value: "6", label: "Resident cats" },
  { value: "6", label: "Days open" },
  { value: "1st", label: "In Lagos" },
  { value: "Lagos", label: "Home base" },
];

const values = [
  {
    id: "calm",
    label: "Calm over chaos",
    body: "Lagos moves fast. We built a room specifically so you don't have to.",
  },
  {
    id: "community",
    label: "Cat people welcome",
    body: "Whether you're here to work, rest, or make a new feline friend — you belong here.",
  },
  {
    id: "care",
    label: "The cats come first",
    body: "Every visiting hour, every rule, every design choice is made with resident cat welfare in mind.",
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">

        {/* ── Brand story ── */}
        <Reveal>
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange">
            About Fémi &amp; Ifeoma
          </p>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 md:gap-20">
          <Reveal>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-brick">
              Nigeria&apos;s first cat café, built for slow afternoons.
            </h2>
          </Reveal>

          <Reveal className="flex flex-col justify-center gap-5">
            <p className="text-[16.5px] font-light leading-[1.8] text-brick/70">
              Founded by {site.founder}, Fémi &amp; Ifeoma brings together a family of
              international cats — British Shorthairs, Maine Coons, Persians and more —
              in a calm, considered space to work, read, or simply sit still for once.
            </p>
            <p className="text-[16.5px] font-light leading-[1.8] text-brick/70">
              The name comes from the cats themselves. Every resident has a story.
              Every visit is a chapter.
            </p>
          </Reveal>
        </div>

        {/* ── Stats ── */}
        <Reveal>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-8 py-8">
                <div className="text-[38px] font-bold leading-none tracking-[-0.02em] text-orange">
                  {s.value}
                </div>
                <div className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-brick/35">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Mission & values ── */}
        <Reveal className="mt-20 border-t border-[var(--ink-line)] pt-16">
          <p className="mb-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange">
            What we stand for
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.id} delayMs={i * 70}>
                <div>
                  <h3 className="mb-3 font-display text-[1.25rem] leading-tight tracking-tight text-brick">
                    {v.label}
                  </h3>
                  <p className="text-[15px] font-light leading-[1.75] text-brick/65">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* ── Team ── */}
        <Reveal className="mt-20 border-t border-[var(--ink-line)] pt-16">
          <p className="mb-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange">
            The humans behind it
          </p>
          <div className="flex flex-col gap-2 md:max-w-xl">
            <h3 className="font-display text-[1.5rem] leading-tight tracking-tight text-brick">
              Jason &amp; the team
            </h3>
            <p className="mt-3 text-[15.5px] font-light leading-[1.8] text-brick/65">
              {site.founder} started Fémi &amp; Ifeoma because Lagos needed a slower
              room. A place where the Wi-Fi is fast and the cats are faster — at finding
              the best lap to sit on. The team is small, the lounge is warm, and the cats
              run things.
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
