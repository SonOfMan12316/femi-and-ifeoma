import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Shared button styling. Spec: docs/03-COMPONENT_GUIDELINES.md § Buttons.
 *
 * - Pill radius always (never square corners)
 * - No box shadows outside a card context
 * - Colours come from tokens, never hardcoded hex
 */
/*
 * `transition-colors,transform,box-shadow` rather than `transition-all`:
 * naming the properties stops the browser transitioning things we never
 * intended (and never animating layout properties by accident).
 *
 * The press scale is deliberately slight. Buttons are pressed many times a
 * day, and at that frequency motion has to be near-imperceptible or it starts
 * to feel like lag. 160ms, no bounce — it settles rather than snapping back.
 */
const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-bold uppercase tracking-[var(--tracking-wide)] " +
  "transition-[color,background-color,border-color,transform,box-shadow] duration-[250ms] ease-[var(--ease-out)] " +
  "active:scale-[0.97] active:duration-[var(--duration-press)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  // Orange fill with refined shadow and subtle lift on hover
  primary:
    "hover-grow bg-orange text-white focus-visible:ring-orange focus-visible:ring-offset-cream",
  // Outlined orange, fills on hover
  secondary:
    "border-2 border-orange bg-transparent text-orange hover:bg-orange hover:text-white focus-visible:ring-orange focus-visible:ring-offset-cream",
  // For dark/photographic backgrounds: outlined white, fills to orange text
  ghost:
    "border-2 border-white bg-transparent text-white hover:bg-white hover:text-orange focus-visible:ring-white focus-visible:ring-offset-transparent",
};

type CommonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

export type ButtonProps = AnchorProps | NativeButtonProps;

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorProps)}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as NativeButtonProps;

  return (
    <button className={classes} type={type} {...buttonRest}>
      {children}
    </button>
  );
}
