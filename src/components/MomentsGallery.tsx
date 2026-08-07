"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FadeImage } from "@/components/FadeImage";

type GalleryImage = {
  src: string;
  alt: string;
  ratio: "tall" | "portrait" | "square" | "landscape";
};

const images: GalleryImage[] = [
  {
    src: "/uploads/WhatsApp Image 2026-07-27 at 18.47.50.jpeg",
    alt: "The café lounge on a quiet afternoon",
    ratio: "tall",
  },
  {
    src: "/uploads/WhatsApp Image 2026-07-27 at 18.47.50 (1).jpeg",
    alt: "One of the residents surveying the lounge",
    ratio: "portrait",
  },
  {
    src: "/uploads/IMG_2813.webp",
    alt: "Inside the café on a bright afternoon",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_2815.webp",
    alt: "A quiet corner of the lounge",
    ratio: "portrait",
  },
  {
    src: "/uploads/IMG_2889.webp",
    alt: "One of the resident cats at ease",
    ratio: "square",
  },
  {
    src: "/uploads/IMG_2926.webp",
    alt: "The café floor between sessions",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_2981.webp",
    alt: "A cat settling into a favourite spot",
    ratio: "portrait",
  },
  {
    src: "/uploads/IMG_6118.webp",
    alt: "An afternoon at the café",
    ratio: "landscape",
  },
  {
    src: "/uploads/IMG_6130.webp",
    alt: "The lounge set up for guests",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_6565.webp",
    alt: "A café cat taking in the room",
    ratio: "portrait",
  },
  {
    src: "/uploads/IMG_6620.webp",
    alt: "Time spent together in the café",
    ratio: "square",
  },
  {
    src: "/uploads/IMG_6621.webp",
    alt: "A resident cat mid-afternoon",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_6684.webp",
    alt: "A slow moment in the lounge",
    ratio: "portrait",
  },
  {
    src: "/uploads/IMG_6690.webp",
    alt: "The café in the middle of a session",
    ratio: "square",
  },
  {
    src: "/uploads/IMG_6715.webp",
    alt: "One of the cats close up",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_6754.webp",
    alt: "Guests and cats sharing the space",
    ratio: "portrait",
  },
  {
    src: "/uploads/IMG_6774.webp",
    alt: "A cat perched above the lounge",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_6783.webp",
    alt: "A warm corner of the café",
    ratio: "square",
  },
  {
    src: "/uploads/IMG_6785.webp",
    alt: "An everyday scene at the café",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_6844.webp",
    alt: "A café cat at rest",
    ratio: "portrait",
  },
  {
    src: "/uploads/IMG_7026.webp",
    alt: "The lounge later in the day",
    ratio: "tall",
  },
  {
    src: "/uploads/IMG_7061.webp",
    alt: "Another moment with the residents",
    ratio: "square",
  },
];

const aspectRatios: Record<GalleryImage["ratio"], string> = {
  tall: "3 / 4",
  portrait: "4 / 5",
  square: "1 / 1",
  landscape: "4 / 3",
};

/* ─── Per-image animation config ─────────────────────────────────────────────
   Computed once at module level so it's deterministic between server and client.
   col / row are based on the 3-column desktop layout for stagger purposes.
────────────────────────────────────────────────────────────────────────────── */
const ROTATIONS = [-1.4, 1.1, -0.7, 0.9, -1.1] as const;

const ITEM_CONFIG = images.map((_, i) => {
  const v = (i * 13 + 7) % 11; // deterministic 0-10 spread
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    /* When this tile starts (as fraction of sectionProgress 0→1) */
    delay: 0.10 + row * 0.07 + col * 0.025,
    /* How quickly this tile runs relative to section progress */
    speed: 1.0 + (v % 5) * 0.04,
    /* Starting visual state */
    startScale: 0.62 + (v % 5) * 0.016,       // 0.620 – 0.684
    startY: 28 + row * 6 + (v % 4) * 4,        // 28 – 70px drop
    startX: col === 0 ? -(6 + v % 4)            // left col: pull left
           : col === 2 ? (6 + v % 4)            // right col: pull right
           : (v % 3 - 1) * 3,                   // centre col: subtle wobble
    startRot: ROTATIONS[v % 5],                 // ±0.7° – ±1.4°
  };
});

/* ─── Easing ─────────────────────────────────────────────────────────────── */
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function MomentsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef     = useRef<number | null>(null);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isOpen = lightboxIndex !== null;

  const close = useCallback(() => setLightboxIndex(null), []);
  const step  = useCallback((delta: number) => {
    setLightboxIndex((prev) =>
      prev === null ? prev : (prev + delta + images.length) % images.length,
    );
  }, []);

  /* ── Scroll-driven animation (direct DOM — no React re-renders per frame) ── */
  const animate = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rm   = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = section.getBoundingClientRect();
    const vh   = window.innerHeight;

    /*
      sectionProgress:
        0.0 → section top just crossed the bottom of the viewport (entering)
        1.0 → user has scrolled 1.5 viewport-heights from that entry point
      This means the full assembly completes in a satisfying ~1.5× vh of scroll.
    */
    const scrolled         = vh - rect.top;
    const sectionProgress  = rm ? 1 : Math.min(1, Math.max(0, scrolled / (vh * 1.5)));

    /* ── Header: leads the masonry by a beat ── */
    const hdr = headerRef.current;
    if (hdr) {
      if (rm) {
        hdr.style.opacity   = "1";
        hdr.style.transform = "none";
      } else {
        const hp  = Math.min(1, sectionProgress / 0.20);
        const he  = easeOutCubic(hp);
        hdr.style.opacity   = he.toFixed(3);
        hdr.style.transform = `translateY(${(32 * (1 - he)).toFixed(1)}px)`;
      }
    }

    /* ── Tiles: scroll-driven assembly ── */
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const cfg = ITEM_CONFIG[i];

      if (rm) {
        el.style.opacity   = "1";
        el.style.transform = "none";
        return;
      }

      /*
        Each tile has its own normalised progress 0→1 based on:
          – a start delay (earlier rows start sooner)
          – a slight individual speed variation
          – a fixed animation window of 0.28 of sectionProgress
      */
      const rawP = (sectionProgress * cfg.speed - cfg.delay) / 0.28;
      const imgP = Math.min(1, Math.max(0, rawP));
      const e    = easeOutCubic(imgP);

      const scale = (cfg.startScale + (1 - cfg.startScale) * e).toFixed(4);
      const ty    = (cfg.startY   * (1 - e)).toFixed(1);
      const tx    = (cfg.startX   * (1 - e)).toFixed(1);
      const rot   = (cfg.startRot * (1 - e)).toFixed(3);

      el.style.transform = `translateY(${ty}px) translateX(${tx}px) rotate(${rot}deg) scale(${scale})`;
      el.style.opacity   = e.toFixed(3);
    });
  }, []);

  /* Attach scroll listener once, drive animation via rAF */
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    /* Also re-run on resize so rotations stay consistent after orientation change */
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    /* Compute immediately so the initial state is correct on mount */
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  /* Lightbox: scroll-lock + keyboard */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowRight")  step(1);
      if (e.key === "ArrowLeft")   step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, step]);

  return (
    <section
      ref={sectionRef}
      id="moments"
      className="scroll-mt-24 bg-white px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="mx-auto mb-20 max-w-2xl text-center"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--orange)" }}
          >
            Gallery
          </p>
          <h2
            className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--black)" }}
          >
            Moments at the Café
          </h2>
          <p
            className="mt-5 text-[17px] leading-[1.7]"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)" }}
          >
            Every visit is filled with coffee, conversations, playful cats, and
            unforgettable moments.
          </p>
        </div>

        {/* ── Masonry grid ───────────────────────────────────────────────── */}
        <div className="columns-2 gap-2 lg:columns-3">
          {images.map((image, index) => (
            <div
              key={image.src}
              ref={(el) => { itemRefs.current[index] = el; }}
              className="mb-2 break-inside-avoid"
              style={{
                opacity: 0,
                willChange: "transform, opacity",
                transformOrigin: "center center",
              }}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`View larger: ${image.alt}`}
                className="group relative block w-full overflow-hidden rounded-[20px] shadow-[var(--shadow-md)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                style={{ aspectRatio: aspectRatios[image.ratio] }}
              >
                <FadeImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  unoptimized
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={close}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 px-6"
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-250 ease-out hover:bg-white/30"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous image"
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-250 ease-out hover:bg-white/30 md:left-8"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Image */}
          <figure className="relative m-0" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-h-[84vh] w-auto max-w-full rounded-[20px]"
            />
          </figure>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next image"
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-250 ease-out hover:bg-white/30 md:right-8"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Counter */}
          <p
            className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-medium text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}
