"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/82 shadow-[0_1px_12px_rgba(176,56,37,0.08)] backdrop-blur-xl"
          : "border-b border-[var(--ink-line)] bg-white/96 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
        <a href="/" aria-label={site.fullName}>
          <Logo size={60} priority />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 text-[11.5px] font-medium uppercase tracking-[0.09em] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-brick/60 transition-colors duration-200 hover:text-brick"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-brick transition-colors hover:bg-brick/5 lg:hidden"
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
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-[var(--ink-line)] bg-white/98 px-6 py-6 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={`m-${link.label}`}
                href={link.href}
                className="text-[13.5px] font-medium uppercase tracking-[0.08em] text-brick/60 transition-colors hover:text-brick"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
