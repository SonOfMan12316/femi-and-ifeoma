"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { faqs } from "@/lib/site";

export function Faqs() {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <section id="faqs" className="scroll-mt-24 bg-sand px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-12 text-center">
          <p className="mb-3 text-[13px] uppercase tracking-[0.14em] text-orange">
            FAQs
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight text-brick">
            Are you curious?
          </h2>
          <p className="mt-4 text-[17px] font-light leading-relaxed text-[var(--ink-muted)]">
            Of course you are. You are part cat. Here are answers to life&apos;s
            most pressing café questions.
          </p>
        </Reveal>

        <div className="border-t border-[var(--ink-line)]">
          {faqs.map((faq, index) => {
            const open = openId === index;
            return (
              <Reveal key={faq.question} delayMs={index * 40}>
                <div className="border-b border-[var(--ink-line)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : index)}
                  >
                    <span className="font-display text-[20px] text-brick md:text-[22px]">
                      {faq.question}
                    </span>
                    <span className="text-[22px] text-orange" aria-hidden>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open ? (
                    <p className="pb-5 text-[16px] font-light leading-relaxed text-[var(--ink-muted)]">
                      {faq.answer}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
