import Image from "next/image";

function PawPrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="5" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="8" cy="2.5" r="1.5" fill="currentColor" />
      <circle cx="11" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="3.5" cy="7" r="1.5" fill="currentColor" />
      <ellipse cx="8" cy="9" rx="3" ry="3.5" fill="currentColor" />
    </svg>
  );
}

function CatFaceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9 L1 6 L3 7.5 Z" fill="currentColor" />
      <path d="M13 9 L15 6 L13 7.5 Z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 4 L7.5 7.5 L10 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M7.5 1.5c-2 0-3.5 1.5-3.5 3.5 0 2.5 3.5 7.5 3.5 7.5s3.5-5 3.5-7.5c0-2-1.5-3.5-3.5-3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="7.5" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M1.5 1.5 L8 1.5 L13.5 7 L9 11.5 L3.5 6 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="5.5" cy="4" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function Hero() {
  return (
    <>
      <section className="relative bg-[var(--cream)] overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">

          <div className="grid gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16 items-center">

            {/* LEFT COLUMN */}
            <div className="order-2 lg:order-1">

              {/* Wordmark */}
              <div className="w-full max-w-[480px]">
                <Image
                  src="/uploads/femi-and-ifeoma-wordmark.png"
                  alt="Fémi & Ifeoma Cat Café"
                  width={581}
                  height={429}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Body copy */}
              <p className="mt-6 text-[17px] font-normal leading-[1.6] text-[var(--black)] max-w-[420px]" style={{ fontFamily: "var(--font-body)" }}>
                A cozy cat café in Lagos where good coffee, happy cats, and great company come together.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">

                {/* Primary Button */}
                <a
                  href="/book-your-visit"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--orange)] px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-all duration-250 hover:brightness-90"
                >
                  <PawPrintIcon />
                  Book a Visit
                </a>

                {/* Secondary Button */}
                <a
                  href="/our-cats"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--orange)] bg-transparent px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--orange)] transition-all duration-250 hover:bg-[var(--orange)] hover:text-white [&>svg]:hover:text-white"
                >
                  <CatFaceIcon />
                  Meet the Cats
                </a>
              </div>

              {/* Info Pills */}
              <div className="mt-7 flex flex-wrap gap-2.5">

                {/* Hours Pill */}
                <div className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-black/[0.12] bg-white px-4 py-2.5">
                  <ClockIcon />
                  <div className="text-[12px] font-medium leading-tight text-[var(--black)]">
                    Mon – Sat<br />10AM – 5PM
                  </div>
                </div>

                {/* Location Pill */}
                <div className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-black/[0.12] bg-white px-4 py-2.5">
                  <LocationPinIcon />
                  <div className="text-[12px] font-medium leading-tight text-[var(--black)]">
                    Surulere,<br />Lagos
                  </div>
                </div>

                {/* Price Pill */}
                <div className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-black/[0.12] bg-white px-4 py-2.5">
                  <PriceTagIcon />
                  <div className="text-[12px] font-medium leading-tight text-[var(--black)]">
                    ₦30,000<br />60 min session
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="relative order-1 lg:order-2">

              {/* Cat Image */}
              <div className="relative w-full max-w-[600px] mx-auto lg:mx-0">
                <Image
                  src="/uploads/femi-and-ifeoma-removebg-preview.png"
                  alt="Femi and Ifeoma cats"
                  width={800}
                  height={800}
                  priority
                  className="w-full h-auto object-contain object-bottom"
                  style={{ maxHeight: "340px" }}
                />
              </div>

              {/* Femi Label - Desktop only */}
              <div className="absolute left-[15%] top-[10%] hidden lg:block">
                <p className="font-serif italic text-[22px] text-[var(--orange)]" style={{ fontFamily: "Georgia, serif" }}>
                  Femi
                </p>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="ml-2">
                  <path
                    d="M5 5 Q10 15, 20 20"
                    stroke="var(--orange)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M20 20 L18 16 M20 20 L16 19"
                    stroke="var(--orange)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Ifeoma Label - Desktop only */}
              <div className="absolute right-[15%] top-[10%] hidden lg:block">
                <p className="font-serif italic text-[22px] text-[var(--orange)]" style={{ fontFamily: "Georgia, serif" }}>
                  Ifeoma
                </p>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="mr-2">
                  <path
                    d="M25 5 Q20 15, 10 20"
                    stroke="var(--orange)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M10 20 L12 16 M10 20 L14 19"
                    stroke="var(--orange)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

            </div>

          </div>

        </div>

        {/* Wave SVG at bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full" style={{ marginBottom: "-1px" }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>

      </section>

      {/* Tagline Section */}
      <section className="bg-white py-10 text-center px-6">
        <div className="mx-auto max-w-xl">

          {/* Paw Print Icon */}
          <div className="mb-3 inline-flex text-[var(--orange)]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="9" cy="6" r="2.5" fill="currentColor" />
              <circle cx="14" cy="4.5" r="2.5" fill="currentColor" />
              <circle cx="19" cy="6" r="2.5" fill="currentColor" />
              <circle cx="6" cy="12" r="2.5" fill="currentColor" />
              <ellipse cx="14" cy="15.5" rx="5" ry="6" fill="currentColor" />
            </svg>
          </div>

          {/* Main Tagline */}
          <h2 className="text-[17px] font-semibold text-[var(--black)]" style={{ fontFamily: "var(--font-body)" }}>
            Relax. Purr. Connect.
          </h2>

          {/* Subtext */}
          <p className="mt-1.5 text-[14px] font-normal text-black/55" style={{ fontFamily: "var(--font-body)" }}>
            Coffee for you, comfort for them.
          </p>

        </div>
      </section>
    </>
  );
}
