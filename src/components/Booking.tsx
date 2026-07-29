import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Booking() {
  return (
    <section
      id="book"
      className="scroll-mt-24 bg-brick px-6 py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="mb-4 text-[13px] uppercase tracking-[0.14em] text-orange">
              Book Your Visit
            </p>
            <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-white/65">
              ★ Reservations are required ★
            </p>
            <div className="mt-6 font-display text-[clamp(3.5rem,10vw,6rem)] italic leading-none text-orange">
              {site.price}
            </div>
            <p className="mt-3 text-[16px] font-light text-white/65">
              per person · {site.sessionLength}
            </p>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block rounded-lg bg-brick px-9 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange"
            >
              Book Your Visit
            </a>
          </Reveal>

          <Reveal className="flex flex-col gap-8">
            <div>
              <h3 className="mb-2 text-[12px] uppercase tracking-[0.12em] text-white/50">
                Hours
              </h3>
              <p className="text-[17px] font-light">
                {site.hours}
                <br />
                {site.closed}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-[12px] uppercase tracking-[0.12em] text-white/50">
                What&apos;s included
              </h3>
              <ul className="m-0 list-none space-y-2 p-0 text-[16px] font-light">
                <li>Full access to the lounge and all resident cats</li>
                <li>Use of the workstation for the full session</li>
                <li>Complimentary drink on arrival</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-[12px] uppercase tracking-[0.12em] text-white/50">
                Find us
              </h3>
              <p className="text-[16px] font-light text-white/85">
                {site.location}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
