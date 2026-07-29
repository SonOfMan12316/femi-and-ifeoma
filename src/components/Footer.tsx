import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

function IconPin() {
  return (
    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true" className="mt-[2px] shrink-0">
      <path
        d="M6.5 1C3.74 1 1.5 3.24 1.5 6C1.5 9.75 6.5 14 6.5 14C6.5 14 11.5 9.75 11.5 6C11.5 3.24 9.26 1 6.5 1Z"
        stroke="currentColor" strokeWidth="1.2" fill="none"
      />
      <circle cx="6.5" cy="6" r="1.75" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-[2px] shrink-0">
      <circle cx="7" cy="7" r="5.75" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4.5V7L8.75 8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1.5" y="1.5" width="11" height="11" rx="3.25" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10.25" cy="3.75" r="0.65" fill="currentColor" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M1 3.5L5 1.5L9 3.5L13 1.5V10.5L9 12.5L5 10.5L1 12.5V3.5Z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"
      />
      <path d="M5 1.5V10.5M9 3.5V12.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true" className="mt-[1px] shrink-0">
      <rect x="1" y="1" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 3.5L7.5 7.5L14 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--sand)]">
      <div className="mx-auto max-w-6xl px-6">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-14 py-20 md:py-24 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-10">

          {/* Brand */}
          <div className="max-w-xs">
            <Logo width={120} height={40} />
            <p className="mt-6 text-[20px] font-bold tracking-[-0.015em] text-brick">
              {site.fullName}
            </p>
            <p className="mt-2.5 text-[14px] font-light leading-[1.75] text-brick/55">
              Lagos's first cat café. A calm, considered space to slow
              down, breathe, and spend an hour with cats.
            </p>
          </div>

          {/* Visit */}
          <div>
            <h3 className="mb-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-brick/35">
              Visit
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-2.5 text-brick/55">
                <IconPin />
                <span className="text-[13.5px] font-light leading-[1.65]">
                  {site.location}
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-brick/55">
                <IconClock />
                <div className="text-[13.5px] font-light leading-[1.65]">
                  <span className="block">Mon – Sat</span>
                  <span className="block">10 AM – 5 PM</span>
                  <span className="mt-1.5 block text-[12px] text-brick/35">
                    {site.closed}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-brick/35">
              Explore
            </h3>
            <nav aria-label="Footer explore links">
              <ul className="space-y-3.5">
                {[
                  { href: "/book-your-visit", label: "Book a Visit" },
                  { href: "/our-cats",        label: "Our Cats"    },
                  { href: "/faqs",            label: "FAQs"        },
                  { href: "/#rules",          label: "House Rules" },
                  { href: "/#about",          label: "About Us"    },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[13.5px] font-light text-brick/55 transition-colors duration-200 hover:text-brick"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-brick/35">
              Connect
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13.5px] font-light text-brick/55 transition-colors duration-200 hover:text-orange"
                >
                  <IconInstagram />
                  @femiandifeoma
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Fémi+and+Ifeoma+Cat+Café+Surulere+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13.5px] font-light text-brick/55 transition-colors duration-200 hover:text-orange"
                >
                  <IconMap />
                  Find us on Maps
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 text-[13.5px] font-light text-brick/55 transition-colors duration-200 hover:text-orange"
                >
                  <IconMail />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-2 border-t border-brick/10 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] font-light text-brick/35">
            © 2026 {site.fullName}
          </p>
          <p className="text-[12px] font-light text-brick/28">
            Designed with care in Lagos, Nigeria
          </p>
        </div>

      </div>
    </footer>
  );
}
