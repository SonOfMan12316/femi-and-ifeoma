"use client";

import Script from "next/script";
import { useState } from "react";
import { site, plans, type Plan } from "@/lib/site";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = "plan" | "datetime" | "info" | "confirmed";

type Info = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agreed: boolean;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM",  "2:00 PM",  "3:00 PM", "4:00 PM",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isAvailableDay(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0=Sun
  return d >= today && dow >= 1 && dow <= 6; // Mon–Sat
}

function formatDate(year: number, month: number, day: number): string {
  return new Date(year, month, day).toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Calendar({
  value,
  onChange,
}: {
  value: { year: number; month: number; day: number } | null;
  onChange: (d: { year: number; month: number; day: number }) => void;
}) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const firstDow = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = Array.from({ length: firstDow + daysInMonth }, (_, i) =>
    i < firstDow ? null : i - firstDow + 1,
  );

  function prev() {
    setView((v) => {
      const m = v.month === 0 ? 11 : v.month - 1;
      const y = v.month === 0 ? v.year - 1 : v.year;
      return { year: y, month: m };
    });
  }
  function next() {
    setView((v) => {
      const m = v.month === 11 ? 0 : v.month + 1;
      const y = v.month === 11 ? v.year + 1 : v.year;
      return { year: y, month: m };
    });
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={prev} className="px-2 py-1 text-brick hover:text-orange">
          ‹
        </button>
        <span className="text-[14px] font-medium text-brick">
          {MONTHS[view.month]} {view.year}
        </span>
        <button type="button" onClick={next} className="px-2 py-1 text-brick hover:text-orange">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-[11px] uppercase tracking-wide text-[var(--ink-soft)]">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const available = isAvailableDay(view.year, view.month, day);
          const selected =
            value?.year === view.year &&
            value?.month === view.month &&
            value?.day === day;
          return (
            <button
              key={day}
              type="button"
              disabled={!available}
              onClick={() => onChange({ year: view.year, month: view.month, day })}
              className={`rounded-full py-2 text-[13px] transition-colors ${
                selected
                  ? "bg-brick text-white"
                  : available
                    ? "text-brick hover:bg-sand"
                    : "cursor-default text-[var(--ink-soft)] opacity-30"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function BookingFlow() {
  const [step, setStep] = useState<Step>("plan");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedDate, setSelectedDate] = useState<{
    year: number; month: number; day: number;
  } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [info, setInfo] = useState<Info>({
    firstName: "", lastName: "", email: "", phone: "", agreed: false,
  });

  // ── Step: plan ──────────────────────────────────────────────────────────

  if (step === "plan") {
    return (
      <div className="flex flex-col gap-4">
        {plans.map((plan) => {
          const selected = selectedPlan?.id === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setSelectedPlan(plan);
                setQty(1);
              }}
              className={`w-full border px-8 py-6 text-left transition-colors ${
                selected ? "border-brick bg-sand" : "border-[var(--ink-line)] bg-sand hover:border-brick"
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-[18px] font-semibold text-brick">{plan.name}</h2>
                  <p className="mt-1 text-[13px] text-[var(--ink-muted)]">
                    {plan.durationMins} minutes @ ₦{plan.price.toLocaleString("en-NG")}
                    {plan.perPerson ? " per person" : ""}
                    {plan.schedule ? ` · ${plan.schedule}` : ""}
                  </p>
                  <p className="mt-3 text-[14px] font-light leading-relaxed text-[var(--ink-muted)]">
                    {plan.description}
                  </p>
                </div>
                <span
                  className={`mt-1 shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.08em] ${
                    selected ? "border-brick bg-brick text-white" : "border-[var(--ink-line)] text-[var(--ink-muted)]"
                  }`}
                >
                  {selected ? "Selected" : "Select"}
                </span>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          disabled={!selectedPlan}
          onClick={() => setStep("datetime")}
          className="mt-2 self-end rounded-lg bg-brick px-8 py-3 text-[12px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    );
  }

  if (!selectedPlan) {
    // Guard: steps below require a plan. Should be unreachable since "datetime"
    // can only be reached via the plan step's Continue button.
    setStep("plan");
    return null;
  }

  // ── Step: datetime ──────────────────────────────────────────────────────

  if (step === "datetime") {
    return (
      <div className="flex flex-col gap-6">
        {/* Selected plan summary */}
        <div className="border border-[var(--ink-line)] bg-sand px-8 py-6">
          <button
            type="button"
            onClick={() => setStep("plan")}
            className="mb-4 flex items-center gap-2 text-[12px] uppercase tracking-wide text-[var(--ink-muted)] hover:text-brick"
          >
            ‹ Back
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium text-brick">{selectedPlan.name}</p>
              <p className="mt-0.5 text-[13px] text-[var(--ink-muted)]">
                {selectedPlan.durationMins} minutes @ ₦{selectedPlan.price.toLocaleString("en-NG")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[var(--ink-muted)]">Qty:</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ink-line)] text-brick hover:bg-sand"
              >
                −
              </button>
              <span className="w-6 text-center text-[14px] font-medium text-brick">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ink-line)] text-brick hover:bg-sand"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Calendar + time slots */}
        <div className="border border-[var(--ink-line)] bg-sand p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Calendar value={selectedDate} onChange={(d) => { setSelectedDate(d); setSelectedTime(null); }} />

            {selectedDate ? (
              <div>
                <p className="mb-4 text-[13px] font-medium text-brick">
                  {formatDate(selectedDate.year, selectedDate.month, selectedDate.day)}
                </p>
                <div className="flex flex-col gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-lg border px-4 py-3 text-left text-[14px] transition-colors ${
                        selectedTime === slot
                          ? "border-brick bg-brick text-white"
                          : "border-[var(--ink-line)] text-brick hover:border-brick"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-[14px] text-[var(--ink-soft)]">
                Select a date to see available times
              </div>
            )}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-8 flex items-center justify-between border-t border-[var(--ink-line)] pt-6">
              <p className="text-[14px] text-[var(--ink-muted)]">
                {formatDate(selectedDate.year, selectedDate.month, selectedDate.day)} at {selectedTime}
              </p>
              <button
                type="button"
                onClick={() => setStep("info")}
                className="rounded-lg bg-brick px-8 py-3 text-[12px] font-medium uppercase tracking-[0.1em] text-white hover:bg-orange"
              >
                Select &amp; Continue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Step: info ──────────────────────────────────────────────────────────

  if (step === "info") {
    const plan = selectedPlan;

    function handlePay(e: React.FormEvent) {
      e.preventDefault();
      if (!info.agreed) return;

      const handler = (window as Window & { PaystackPop?: { setup: (config: Record<string, unknown>) => { openIframe: () => void } } }).PaystackPop?.setup({
        key: site.paystackPublicKey,
        email: info.email,
        amount: plan.price * 100 * qty,
        currency: "NGN",
        ref: `FI-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: "Name", variable_name: "name", value: `${info.firstName} ${info.lastName}` },
            { display_name: "Plan", variable_name: "plan", value: plan.name },
            { display_name: "Date", variable_name: "date", value: selectedDate ? formatDate(selectedDate.year, selectedDate.month, selectedDate.day) : "" },
            { display_name: "Time", variable_name: "time", value: selectedTime ?? "" },
            { display_name: "Quantity", variable_name: "qty", value: String(qty) },
          ],
        },
        callback: () => setStep("confirmed"),
        onClose: () => {},
      });
      handler?.openIframe();
    }

    return (
      <>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

        {/* Booking summary */}
        <div className="mb-4 border border-[var(--ink-line)] bg-sand px-8 py-6">
          <button
            type="button"
            onClick={() => setStep("datetime")}
            className="mb-4 flex items-center gap-2 text-[12px] uppercase tracking-wide text-[var(--ink-muted)] hover:text-brick"
          >
            ‹ Back
          </button>
          <p className="text-[13px] font-medium text-brick">{selectedPlan.name}</p>
          <p className="mt-0.5 text-[13px] text-[var(--ink-muted)]">
            {selectedPlan.durationMins} minutes @ ₦{selectedPlan.price.toLocaleString("en-NG")} &middot; Qty: {qty}
          </p>
          {selectedDate && (
            <p className="mt-0.5 text-[13px] text-[var(--ink-muted)]">
              {formatDate(selectedDate.year, selectedDate.month, selectedDate.day)} at {selectedTime}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="border border-[var(--ink-line)] bg-sand px-8 py-8">
          <p className="mb-6 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Your Information
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            {(
              [
                { label: "First Name", key: "firstName", type: "text" },
                { label: "Last Name",  key: "lastName",  type: "text" },
                { label: "Email",      key: "email",     type: "email" },
                { label: "Phone",      key: "phone",     type: "tel" },
              ] as const
            ).map(({ label, key, type }) => (
              <div key={key}>
                <label className="mb-1.5 block text-[12px] uppercase tracking-wide text-[var(--ink-muted)]">
                  {label} <span className="text-orange">*</span>
                </label>
                <input
                  type={type}
                  required
                  value={info[key]}
                  onChange={(e) => setInfo((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--ink-line)] bg-white px-4 py-3 text-[14px] text-brick outline-none focus:border-brick"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3">
            <input
              id="agreed"
              type="checkbox"
              checked={info.agreed}
              onChange={(e) => setInfo((prev) => ({ ...prev, agreed: e.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-brick"
            />
            <label htmlFor="agreed" className="text-[13px] font-light leading-relaxed text-[var(--ink-muted)]">
              I agree to behave gently around the cats, follow house rules, and understand that{" "}
              {site.fullName} is not liable for injuries caused by my own actions.
            </label>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--ink-line)] pt-6">
            <p className="text-[15px] font-medium text-brick">
              Total: ₦{selectedPlan.price.toLocaleString("en-NG")} &times; {qty} ={" "}
              ₦{(selectedPlan.price * qty).toLocaleString("en-NG")}
            </p>
            <button
              type="submit"
              disabled={!info.agreed}
              className="rounded-lg bg-brick px-10 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </>
    );
  }

  // ── Step: confirmed ─────────────────────────────────────────────────────

  return (
    <div className="border border-[var(--ink-line)] bg-sand px-8 py-16 text-center">
      <p className="text-[32px]">🐾</p>
      <h2 className="mt-4 text-[24px] font-semibold text-brick">You&apos;re booked!</h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] font-light leading-relaxed text-[var(--ink-muted)]">
        A confirmation has been sent to <strong>{info.email}</strong>. We can&apos;t wait to see you
        {selectedDate
          ? ` on ${formatDate(selectedDate.year, selectedDate.month, selectedDate.day)} at ${selectedTime}`
          : ""}.
      </p>
      <button
        type="button"
        onClick={() => {
          setStep("plan");
          setSelectedPlan(null);
          setSelectedDate(null);
          setSelectedTime(null);
          setQty(1);
          setInfo({ firstName: "", lastName: "", email: "", phone: "", agreed: false });
        }}
        className="mt-8 rounded-lg border border-brick px-8 py-3 text-[12px] uppercase tracking-wide text-brick hover:bg-brick hover:text-white"
      >
        Book Another Visit
      </button>
    </div>
  );
}
