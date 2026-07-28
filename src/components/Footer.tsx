import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--ink-line)] bg-white px-6 py-14 text-brick">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <Logo size={64} />
          <div>
            <div className="font-display text-[22px] italic">{site.fullName}</div>
            <p className="mt-2 max-w-sm text-[15px] font-light leading-relaxed text-[var(--ink-muted)]">
              {site.location}
              <br />
              {site.hours}
              <br />
              {site.closed}
            </p>
          </div>
        </div>

        <div className="text-[14px] font-light leading-relaxed text-[var(--ink-muted)] md:text-right">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brick underline decoration-orange/50 underline-offset-4 hover:text-orange"
          >
            @femiandifeoma
          </a>
          <p className="mt-3">
            Tip: put Fémi &amp; Ifeoma into Google Maps when you visit Lagos.
          </p>
          <p className="mt-6 text-[13px]">© 2026 {site.fullName}</p>
        </div>
      </div>
    </footer>
  );
}
