import Image from "next/image";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/BookingFlow";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Book Your Visit · ${site.fullName}`,
  description: `Reserve your spot at ${site.fullName}. ${site.price} per person for a ${site.sessionLength} with the cats, the lounge, and a complimentary drink.`,
};

export default function BookYourVisitPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[48vh] items-end overflow-hidden bg-brick">
          <div className="absolute inset-0">
            <Image
              src="/uploads/about-photo.webp"
              alt="Inside Fémi & Ifeoma Cat Café"
              fill
              priority
              className="object-cover opacity-70"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 w-full px-6 pb-16 md:pb-20">
            <div className="mx-auto max-w-5xl">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-orange">
                ★ Reservations required ★
              </p>
              <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-light leading-tight text-white">
                Book Your Visit
              </h1>
            </div>
          </div>
        </section>

        {/* Booking flow */}
        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10 text-center text-[12px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              Select Appointment
            </p>
            <BookingFlow />
          </div>
        </section>

        {/* Info */}
        <section className="border-t border-[var(--ink-line)] bg-white px-6 pb-20 pt-16">
          <div className="mx-auto grid max-w-3xl gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="mb-5 text-[12px] uppercase tracking-[0.14em] text-orange">
                Hours &amp; Location
              </h3>
              <p className="text-[15px] font-light leading-relaxed text-[var(--ink-muted)]">
                {site.hours}
                <br />
                {site.closed}
              </p>
              <p className="mt-4 text-[15px] font-light text-[var(--ink-muted)]">{site.location}</p>
            </div>
            <div>
              <h3 className="mb-5 text-[12px] uppercase tracking-[0.14em] text-orange">
                Cancellation Policy
              </h3>
              <p className="text-[15px] font-light leading-relaxed text-[var(--ink-muted)]">
                Please reschedule or cancel at least 24 hours before your session so we can open the
                slot for someone else.
              </p>
              <p className="mt-4 text-[15px] font-light text-[var(--ink-muted)]">
                Questions?{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="underline decoration-orange/50 underline-offset-4 hover:text-orange"
                >
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
