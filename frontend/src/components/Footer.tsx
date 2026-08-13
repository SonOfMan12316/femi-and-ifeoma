import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

/* All social icons share one 18×18 box so sizing stays consistent. */

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="13.15" cy="4.85" r="0.85" fill="currentColor" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2.25c-2.35 0-4.25 1.9-4.25 4.25 0 3.19 4.25 9.25 4.25 9.25s4.25-6.06 4.25-9.25c0-2.35-1.9-4.25-4.25-4.25Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="6.5" r="1.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="14" height="10" rx="2.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.75 5.5 9 10l6.25-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const socials = [
  {
    label: "Instagram",
    href: site.instagram,
    external: true,
    icon: <IconInstagram />,
  },
  {
    label: "Find us on Google Maps",
    href: site.mapsUrl,
    external: true,
    icon: <IconMap />,
  },
  {
    label: `Email ${site.email}`,
    href: `mailto:${site.email}`,
    external: false,
    icon: <IconMail />,
  },
];

const label = "text-[10px] font-medium uppercase tracking-[var(--tracking-label)] text-white/30";
const value = "text-[14px] font-light leading-[1.7] text-white/60";
const link =
  "text-[14px] font-light leading-[1.7] text-white/60 transition-colors duration-[250ms] ease-out hover:text-orange";

export function Footer() {
  return (
    <footer className="bg-black">
      <div className="mx-auto max-w-3xl p-6 text-center">

        {/* ── Address · Hours · Contact ── */}
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
          <div>
            <h3 className={label}>Address</h3>
            <p className={`mt-4 ${value}`}>
              {site.address}
              <br />
              {site.addressCity}
            </p>
            <p className="mt-3">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] font-light text-white/60 transition-colors duration-[250ms] ease-out hover:text-orange"
              >
                <IconMap />
                Find us on Maps
              </a>
            </p>
          </div>

          <div>
            <h3 className={label}>Opening Hours</h3>
            <p className={`mt-4 ${value}`}>
              Monday – Saturday
              <br />
              10 AM – 5 PM
            </p>
            <p className="mt-2 text-[12px] font-light text-white/30">{site.closed}</p>
          </div>

          <div>
            <h3 className={label}>Contact</h3>
            <p className="mt-4">
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
            </p>
            <p className="mt-1">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={link}>
                {site.phone}
              </a>
            </p>
          </div>
        </div>

        {/* ── Social ── */}
        <ul className="mt-4 flex items-center justify-center gap-8">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                aria-label={social.label}
                {...(social.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex text-white/40 transition-[color,transform] duration-[250ms] ease-out hover:-translate-y-0.5 hover:text-orange motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Copyright ── */}
        <div className="mt-4 border-t border-white/[0.08] pt-10">
          <p className="text-[12px] font-light text-white/30">
            © 2026 {site.fullName}
          </p>
        </div>

      </div>
    </footer>
  );
}
