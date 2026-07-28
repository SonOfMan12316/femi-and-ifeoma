import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type ContentBlockProps = {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image?: { src: string; alt: string };
  reverse?: boolean;
  external?: boolean;
};

export function ContentBlock({
  id,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  image,
  reverse = false,
  external = false,
}: ContentBlockProps) {
  return (
    <section id={id} className="scroll-mt-24 bg-white px-6 py-16 md:py-24">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {image ? (
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        ) : null}

        <Reveal className={!image ? "md:col-span-2 md:mx-auto md:max-w-2xl md:text-center" : ""}>
          <p className="mb-3 text-[13px] uppercase tracking-[0.14em] text-orange">
            {eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight text-brick">
            {title}
          </h2>
          <p className="mt-5 text-[17px] font-light leading-relaxed text-[var(--ink-muted)]">
            {body}
          </p>
          <a
            href={ctaHref}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-8 inline-block bg-orange px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-brick"
          >
            {ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
