import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/uploads/femi-and-ifeoma.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />
      <div className="absolute inset-0 bg-brick/55" />

      <div className="relative z-10 w-full px-6 py-20 md:px-16 md:py-28">
        <div className="max-w-xl">
          <p className="hero-animate hero-animate-delay-1 mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-orange">
            ★ Reservations required ★
          </p>
          <h1 className="hero-animate hero-animate-delay-2 text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.1] text-white">
            Come spend time with our cats in a cozy, playful atmosphere.
          </h1>
          <p className="hero-animate hero-animate-delay-3 mt-5 text-[14px] font-light text-white/70">
            {site.tagline} &middot; {site.location}
          </p>
          <div className="hero-animate hero-animate-delay-4 mt-10">
            <a
              href="/book-your-visit"
              className="inline-block bg-orange px-10 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-brick"
            >
              Book Your Visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
