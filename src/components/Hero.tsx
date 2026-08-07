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
      <section className="relative bg-[var(--cream)] overflow-hidden min-h-screen flex items-center">

        {/* Radial glows */}
        <div
          className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.6) 0%, transparent 60%)"
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-25"
          style={{
            background: "radial-gradient(circle at 70% 40%, rgba(255,255,255,0.5) 0%, transparent 60%)"
          }}
          aria-hidden="true"
        />

        <div className="relative w-full mx-auto max-w-[1400px] px-8 pt-16 pb-44 lg:pb-52 xl:px-16">

          <div className="grid gap-14 lg:grid-cols-[45fr_55fr] lg:gap-20 items-center">

            {/* LEFT COLUMN */}
            <div className="space-y-7">

              {/* Wordmark */}
              <div className="w-full max-w-[380px]">
                <img
                  src="/uploads/logo.png"
                  alt="Fémi & Ifeoma Cat Café"
                  width={581}
                  height={429}
                  fetchPriority="high"
                  className="w-full h-auto"
                />
              </div>

              {/* Tagline */}
              <div className="max-w-[520px]">
                <h1
                  className="text-[30px] lg:text-[34px] font-normal leading-[1.15] text-[var(--black)] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Where every moment purrs<div className="mb-4 inline-flex text-[var(--orange)]">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <ellipse cx="16" cy="21.5" rx="7.9" ry="6.4" fill="currentColor" />
                    <ellipse cx="7.2" cy="13.8" rx="3.2" ry="4" fill="currentColor" />
                    <ellipse cx="13" cy="8.4" rx="3.1" ry="4.3" fill="currentColor" />
                    <ellipse cx="19" cy="8.4" rx="3.1" ry="4.3" fill="currentColor" />
                    <ellipse cx="24.8" cy="13.8" rx="3.2" ry="4" fill="currentColor" />
                  </svg>
                </div>
                </h1>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">

                {/* Open Hours Card */}
                <div
                  className="bg-white rounded-[22px] px-6 py-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex flex-col items-start gap-3">
                    <div className="text-[var(--orange)]">
                      <ClockIcon />
                    </div>
                    <div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/40 mb-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Open
                      </div>
                      <div
                        className="text-[15px] font-medium leading-tight text-[var(--black)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Mon – Sat<br />10AM – 5PM
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div
                  className="bg-white rounded-[22px] px-6 py-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex flex-col items-start gap-3">
                    <div className="text-[var(--orange)]">
                      <LocationPinIcon />
                    </div>
                    <div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/40 mb-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Location
                      </div>
                      <div
                        className="text-[15px] font-medium leading-tight text-[var(--black)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Surulere<br />Lagos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Card */}
                <div
                  className="bg-white rounded-[22px] px-6 py-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex flex-col items-start gap-3">
                    <div className="text-[var(--orange)]">
                      <PriceTagIcon />
                    </div>
                    <div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/40 mb-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Session
                      </div>
                      <div
                        className="text-[15px] font-medium leading-tight text-[var(--black)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        ₦30,000<br />60 Minutes
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="relative flex items-center justify-center lg:justify-end lg:-mr-4 xl:-mr-10">

              {/* Hero Photo */}
              <figure className="relative w-full max-w-[620px] m-0">

                {/* Glow behind photo */}
                <div
                  className="absolute -inset-10 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(255,255,255,0.55) 0%, transparent 72%)"
                  }}
                  aria-hidden="true"
                />

                <img
                  src="/uploads/WhatsApp Image 2026-08-07 at 10.34.29 (1).jpeg"
                  alt="Café cats gathered on their climbing tower in the lounge"
                  width={960}
                  height={1280}
                  fetchPriority="high"
                  className="relative w-full rounded-[28px] aspect-[5/6] object-cover"
                  style={{
                    objectPosition: "center 34%",
                    boxShadow:
                      "0 32px 64px -24px rgba(12,12,12,0.20), 0 10px 28px -16px rgba(12,12,12,0.10)"
                  }}
                />

              </figure>

            </div>

          </div>

        </div>

        {/* Wave SVG at bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full leading-[0]" style={{ marginBottom: "-1px" }}>
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block w-full h-[90px] lg:h-[110px] xl:h-[120px]"
            aria-hidden="true"
          >
            <path
              d="M0,44 C180,14 360,14 540,44 C720,74 900,74 1080,44 C1260,14 1350,14 1440,32 L1440,121 L0,121 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>

      </section>
    </>
  );
}
