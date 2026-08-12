import type { ReactNode } from "react";
import { FadeImage } from "@/components/FadeImage";

/**
 * Base card component. Spec: docs/03-COMPONENT_GUIDELINES.md § Cards.
 *
 * - No glassmorphism (no backdrop-filter)
 * - Rounded corners, soft shadow — no border
 * - Optional top image (4/3 aspect, fills top)
 * - Optional label (orange uppercase eyebrow above heading)
 */

type CardProps = {
  label?: string;
  heading?: string;
  children?: ReactNode;
  image?: { src: string; alt: string };
  className?: string;
};

export function Card({ label, heading, children, image, className = "" }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-3xl bg-white shadow-[0_2px_16px_rgba(12,12,12,0.08)] transition-all duration-[280ms] ease-out hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(12,12,12,0.13)] ${className}`}
    >
      {image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <FadeImage src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
        </div>
      )}
      <div className="p-6">
        {label && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange">{label}</p>
        )}
        {heading && (
          <h3 className="font-display text-xl leading-tight tracking-tight text-black">{heading}</h3>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
