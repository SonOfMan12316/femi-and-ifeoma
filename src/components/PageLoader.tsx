"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

/**
 * Premium full-screen loading overlay shown on initial page load.
 *
 * - Appears immediately from SSR HTML (opacity: 1 by default).
 * - Fades out once `window.load` fires (all critical resources ready).
 * - Removed from DOM after the fade transition completes.
 * - Respects prefers-reduced-motion: removed instantly, no animation.
 * - Does not trap focus (aria-hidden, pointer-events removed on exit).
 * - 3-second safety net prevents permanent block on slow connections.
 */
export function PageLoader() {
  const [hiding, setHiding]   = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hide = () => {
      if (prefersReduced) {
        setRemoved(true);
        return;
      }
      setHiding(true);
      // Match the CSS transition duration (700 ms) before removing from DOM
      setTimeout(() => setRemoved(true), 720);
    };

    if (document.readyState === "complete") {
      hide();
      return;
    }

    window.addEventListener("load", hide, { once: true });
    const fallback = setTimeout(hide, 3000);

    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(fallback);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden="true"
      aria-live="off"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        pointerEvents: hiding ? "none" : "auto",
        opacity: hiding ? 0 : 1,
        transition: "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="loader-content flex flex-col items-center gap-0">
        {/* Logo */}
        <Logo size={72} priority />

        {/* Brand name */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "10.5px",
            fontWeight: 500,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(176, 56, 37, 0.45)",
          }}
        >
          Fémi &amp; Ifeoma
        </p>

        {/* Loading text */}
        <p
          style={{
            marginTop: "6px",
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(176, 56, 37, 0.28)",
          }}
        >
          Preparing your visit
        </p>

        {/* Thin sweep line */}
        <div
          style={{
            marginTop: "28px",
            width: "48px",
            height: "1px",
            backgroundColor: "rgba(176, 56, 37, 0.10)",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <div
            className="loader-sweep"
            style={{
              width: "40%",
              height: "100%",
              backgroundColor: "rgba(176, 56, 37, 0.35)",
              borderRadius: "9999px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
