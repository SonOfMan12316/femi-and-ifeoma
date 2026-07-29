import Image from "next/image";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative flex min-h-[93vh] flex-col justify-end overflow-hidden">

      {/*
        Image wrapper — Ken Burns transform only.
        The <img> itself has NO opacity animation so the browser
        creates its GPU compositing layer at device pixel density
        (full Retina resolution) rather than CSS pixel density.
        will-change: transform pre-promotes the layer before the
        animation starts, locking in native-resolution rasterisation.
      */}
      <div className="hero-image-zoom absolute inset-0">
        <Image
          src="/uploads/E89AFD51-5318-4497-AEF4-605D8B4395EB 2.jpg"
          alt="Cat at Femi & Ifeoma Cat Café"
          fill
          priority
          quality={95}
          className="object-cover"
          style={{ objectPosition: "20% center" }}
          sizes="100vw"
        />
      </div>

      {/* Static gradient overlay — always present, no animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent" />

      {/*
        Black cover that fades OUT on load.
        This is what creates the page-load reveal effect — not
        an opacity animation on the image. After 1.6s it reaches
        opacity: 0 and stops interfering entirely.
      */}
      <div className="hero-cover absolute inset-0 bg-black" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 md:pb-28">
        <div className="max-w-[580px]">

          <h1 className="hero-animate hero-animate-delay-1 font-display text-[clamp(3rem,6.5vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.025em] text-white">
            A slow hour<br /> with cats.
          </h1>

          <p className="hero-animate hero-animate-delay-2 mt-6 text-[16.5px] font-light leading-[1.75] text-white/65">
            {site.sessionLength} for {site.price} per person, lounge access
            and a welcome drink included.
          </p>

        </div>
      </div>
    </section>
  );
}
