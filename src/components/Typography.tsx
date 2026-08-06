import type { ElementType, ReactNode } from "react";

/**
 * Typography design system — three-font hierarchy
 *
 * Font roles (see brand guide):
 * - Coogi (--font-display): Brand moments, major headlines — use sparingly
 * - Neue Haas (--font-body): Primary UI font — most frequent
 * - Knicknack (--font-playful): Accent font for labels, eyebrows, quotes
 *
 * Weight constraints:
 * - Neue Haas ships: 300, 400, 500, 700 (no 600 semibold)
 * - Coogi ships: 400 only
 * - Knicknack ships: 400, 700
 */

type DisplayTitleProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function DisplayTitle({
  children,
  as: Tag = "h1",
  className = "",
}: DisplayTitleProps) {
  return (
    <Tag
      className={`font-display text-[clamp(2.8rem,6vw,4.5rem)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-black ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

type SectionHeadingProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function SectionHeading({
  children,
  as: Tag = "h2",
  className = "",
}: SectionHeadingProps) {
  return (
    <Tag
      className={`font-display text-[clamp(2rem,4vw,3rem)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-black ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

type SectionLabelProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function SectionLabel({
  children,
  as: Tag = "p",
  className = "",
}: SectionLabelProps) {
  return (
    <Tag
      className={`font-playful text-[11px] font-bold uppercase tracking-[var(--tracking-label)] text-orange ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

type BodyTextProps = {
  children: ReactNode;
  as?: ElementType;
  size?: "sm" | "base" | "lg";
  className?: string;
};

export function BodyText({
  children,
  as: Tag = "p",
  size = "base",
  className = "",
}: BodyTextProps) {
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  return (
    <Tag
      className={`font-body ${sizeClasses[size]} leading-[var(--leading-relaxed)] text-black ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
