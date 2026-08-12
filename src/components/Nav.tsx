"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { navLinks, site } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 shadow-[0_1px_12px_rgba(12,12,12,0.08)]"
          : "bg-cream/95"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label={site.fullName}>
          <Logo width={210} height={60} priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-[11.5px] font-medium uppercase tracking-[0.09em] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-black/50 transition-colors duration-[250ms] ease-out hover:text-orange"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA + Mobile hamburger */}
        <div className="flex items-center gap-3">
          <Button href="/book-your-visit" className="hidden lg:inline-flex">
            Book a Visit
          </Button>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-black transition-colors hover:bg-black/5 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path d="M0 1H18M0 6H18M0 11H18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-[var(--ink-line)] bg-cream px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={`m-${link.label}`}
                href={link.href}
                className="text-[13.5px] font-medium uppercase tracking-[0.08em] text-black/60 transition-colors hover:text-orange"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-8 border-t border-[var(--ink-line)] pt-6">
            <Button href="/book-your-visit" className="w-full justify-center" onClick={() => setOpen(false)}>
              Book a Visit
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
