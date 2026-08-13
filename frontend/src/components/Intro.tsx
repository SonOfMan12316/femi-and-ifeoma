import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Intro() {
  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-[13px] uppercase tracking-[0.14em] text-orange">
          {site.tagline}
        </p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-tight text-brick">
          Sink into a quiet corner with a Maine Coon on your lap and Lagos
          moving on without you.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] font-light leading-relaxed text-[var(--ink-muted)]">
          Work, unwind, and meet the cats of Fémi &amp; Ifeoma, Nigeria&apos;s
          first cat café.
        </p>
        <a
          href="/book-your-visit"
          className="mt-10 inline-block border border-brick px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-brick transition-colors hover:bg-brick hover:text-white"
        >
          Book Your Visit
        </a>
      </Reveal>

      <Reveal className="mx-auto mt-16 max-w-5xl">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src="/uploads/about-photo.webp"
            alt="Inside Fémi & Ifeoma Cat Café"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </div>
      </Reveal>
    </section>
  );
}
