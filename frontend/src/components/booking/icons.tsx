/**
 * Inline icons for the booking card. Kept local and minimal rather than
 * pulling in an icon library for six glyphs — all stroke-based on a 24-grid,
 * so they inherit `currentColor` and line up at any size.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowLeft({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ArrowRight({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronLeft({ className = "h-4 w-4" }: IconProps) {
  return <ArrowLeft className={className} />;
}

export function ChevronRight({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function Minus({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M6 12h12" />
    </svg>
  );
}

export function Plus({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

export function CalendarIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

/** Co-Work Space — a laptop. */
export function LaptopIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </svg>
  );
}

/** Cat café visit — a cup. */
export function CupIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M7 3v2M11 3v2" />
    </svg>
  );
}
