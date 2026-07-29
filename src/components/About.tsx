import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

const stats = [
  { value: "6", label: "Resident cats" },
  { value: "6", label: "Days open" },
  { value: "1st", label: "In Lagos" },
  { value: "Lagos", label: "Home base" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">

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

          <Reveal className="flex flex-col justify-center">
            <p className="text-[16.5px] font-light leading-[1.8] text-brick/70">
              Founded by {site.founder}, Fémi &amp; Ifeoma brings together a family of
              international cats: British Shorthairs, Maine Coons, Persians and more,
              in a calm, considered space to work, read, or simply sit still for once.
            </p>
          </Reveal>
        </div>

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

      </div>
    </section>
  );
}
