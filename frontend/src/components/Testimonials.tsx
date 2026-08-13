import { Reveal } from "@/components/Reveal";

const testimonials = [
  {
    id: "1",
    quote: "I came in for an hour and stayed for three. The cats found me first — then I found the best afternoon I've had in Lagos.",
    name: "Adaeze O.",
    detail: "Solo Pass",
  },
  {
    id: "2",
    quote: "Brought my whole team here for a birthday and nobody wanted to leave. The cats were the colleagues we never knew we needed.",
    name: "Tunde B.",
    detail: "VIP Group Pass",
  },
  {
    id: "3",
    quote: "The PlayDate Wednesday session is my mid-week reset. The cats are unbothered. I aspire to be them.",
    name: "Fatima A.",
    detail: "PlayDate regular",
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">

        <Reveal className="mb-14 text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange">
            What guests say
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-black">
            Straight from the lounge
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delayMs={i * 80}>
              <figure className="flex h-full flex-col justify-between rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(12,12,12,0.07)]">
                <blockquote className="font-editorial text-[1.15rem] leading-[1.65] text-black/75 before:mr-1 before:font-display before:text-[2rem] before:leading-none before:text-orange before:content-['\201C']">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange/10 text-[13px] font-bold text-orange">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[14px] font-medium text-black">{t.name}</p>
                    <p className="text-[12px] font-light text-black/45">{t.detail}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
