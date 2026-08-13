"use client";

import Image from "next/image";
import { useState } from "react";
import type { ComponentProps } from "react";

type FadeImageProps = ComponentProps<typeof Image>;

/**
 * Wraps Next/Image with an opacity fade-in once the image fully loads.
 *
 * Uses inline styles for the opacity/transition so it doesn't conflict
 * with Tailwind utility classes (e.g. transition-transform) on the same element.
 * The container's background colour acts as a skeleton while the image loads.
 *
 * Respects prefers-reduced-motion via the CSS media query in globals.css;
 * the transition duration collapses to 0ms for reduced-motion users.
 */
export function FadeImage({ style, onLoad, ...props }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        // var(--img-fade-duration) collapses to 0s when prefers-reduced-motion is set
        transition: "opacity var(--img-fade-duration, 0.65s) cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onLoad={(e) => {
        setLoaded(true);
        if (typeof onLoad === "function") onLoad(e);
      }}
    />
  );
}
