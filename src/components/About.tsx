import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 grid min-h-[640px] grid-cols-1 md:grid-cols-2">
      <div className="relative min-h-[420px] bg-brick md:min-h-0">
        <Image
          src="/uploads/about-photo.webp"
          alt="Inside Fémi & Ifeoma Cat Café"
          fill
          className="object-cover opacity-85"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <Reveal className="absolute inset-x-10 bottom-10 font-display text-[26px] italic leading-[1.4] text-white">
          &ldquo;A café where the cats set the pace, and everyone else slows
          down to match.&rdquo;
        </Reveal>
      </div>

      <div className="flex flex-col justify-center gap-8 bg-sand px-8 py-20 md:px-16">
        <Reveal className="text-[13px] uppercase tracking-[0.14em] text-orange">
          About Fémi &amp; Ifeoma
        </Reveal>
        <Reveal>
          <h2 className="font-display m-0 text-[40px] font-medium leading-[1.2] text-brick">
            Nigeria&apos;s first cat café, built for slow afternoons.
          </h2>
        </Reveal>
        <Reveal>
          <p className="m-0 max-w-[460px] text-[16px] font-light leading-[1.75] text-[var(--ink-muted)]">
            Founded by {site.founder}, Fémi &amp; Ifeoma brings together a
            family of international cats — British Shorthairs, Maine Coons,
            Persians and more — in a calm, considered space to work, read, or
            simply sit still for once.
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-2 grid grid-cols-2 gap-7">
            {[
              { value: "6", label: "Resident cats" },
              { value: "6", label: "Days open weekly" },
              { value: "1st", label: "In Nigeria" },
              { value: "Lagos", label: "Home base" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-[36px] italic text-orange">
                  {stat.value}
                </div>
                <div className="text-[13px] uppercase tracking-[0.05em] text-[var(--ink-soft)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
