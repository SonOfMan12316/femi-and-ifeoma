"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { navLinks, site } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink-line)] bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="/" aria-label={site.fullName}>
          <Logo size={130} priority />
        </a>

        <div className="hidden items-center gap-7 text-[12px] uppercase tracking-[0.08em] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-brick transition-colors hover:text-orange"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--ink-line)] bg-white px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={`m-${link.label}`}
                href={link.href}
                className="text-[14px] uppercase tracking-[0.06em] text-brick"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/book-your-visit"
              className="mt-2 inline-block bg-orange px-5 py-3 text-center text-[12px] font-medium uppercase tracking-[0.08em] text-white"
              onClick={() => setOpen(false)}
            >
              Book Your Visit
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
