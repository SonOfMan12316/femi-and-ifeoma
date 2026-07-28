import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { cats } from "@/lib/site";

export function Cats() {
  return (
    <section id="cats" className="scroll-mt-24 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-[13px] uppercase tracking-[0.14em] text-orange">
            Our Cats
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight text-brick">
            Meet the residents
          </h2>
          <p className="mt-4 text-[17px] font-light leading-relaxed text-[var(--ink-muted)]">
            Six personalities, one very good couch. Hover to hear what they
            think of you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat, index) => (
            <Reveal key={cat.id} delayMs={index * 60}>
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                  <Image
                    src={cat.photo}
                    alt={`${cat.name}, ${cat.breed}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-orange/95 p-8 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="font-display text-[20px] italic leading-snug text-white">
                      &ldquo;{cat.quote}&rdquo;
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-display text-[26px] italic text-brick">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                    {cat.breed}
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
