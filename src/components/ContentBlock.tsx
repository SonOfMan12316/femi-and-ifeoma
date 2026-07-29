import { FadeImage } from "@/components/FadeImage";
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
    <section id={id} className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {image ? (
          <Reveal>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand md:aspect-[5/6]">
              <FadeImage
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        ) : null}

        <Reveal className={!image ? "md:col-span-2 md:mx-auto md:max-w-2xl md:text-center" : ""}>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange">
            {eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-brick">
            {title}
          </h2>
          <p className="mt-5 text-[16.5px] font-light leading-[1.8] text-[var(--ink-muted)]">
            {body}
          </p>
          <a
            href={ctaHref}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-9 inline-flex items-center rounded-xl bg-brick px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange hover:shadow-[0_6px_16px_rgba(176,56,37,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brick/30 focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
