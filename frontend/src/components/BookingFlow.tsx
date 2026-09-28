"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { site, plans, type Plan } from "@/lib/site";
import { Button } from "@/components/Button";
import { PassCard } from "@/components/PassCard";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { ArrowLeft, CupIcon, LaptopIcon, Minus, Plus } from "@/components/booking/icons";
import {
  ApiError,
  createBooking,
  getDayAvailability,
  getMonthAvailability,
  releaseBooking,
  verifyBooking,
  type Booking,
  type DayAvailability,
  type MonthAvailability,
  type SlotAvailability,
} from "@/lib/api";

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

/**
 * Not a capacity limit — bookings are uncapped (DEC-021). This only stops a
 * mis-click from submitting a party of 400; anything genuinely large should be
 * a phone call to the café.
 */
const MAX_PARTY_SIZE = 20;


// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateStr(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/** Party size for a plan: fixed passes ignore the quantity stepper entirely. */
function partySizeFor(plan: Plan, qty: number): number {
  return plan.guestCount ?? qty;
}

/**
 * Duration in the terms a guest thinks in. Minutes are the storage unit, not
 * a readable one — "600 minutes" is a day.
 */
function formatDuration(plan: Plan): string {
  if (plan.wholeDay) {
    const hours = Math.round(plan.durationMins / 60);
    return `Full day, ${hours} hours`;
  }
  if (plan.durationMins < 60) return `${plan.durationMins} minutes`;
  const hours = plan.durationMins / 60;
  if (Number.isInteger(hours)) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${Math.floor(hours)} hr ${plan.durationMins % 60} min`;
}

/** Display total, mirroring the backend's amount calculation (DEC-018). */
function totalFor(plan: Plan, qty: number): number {
  return plan.perPerson ? plan.price * qty : plan.price;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SlotList({
  day,
  loading,
  error,
  selected,
  onSelect,
}: {
  day: DayAvailability | null;
  loading: boolean;
  error: string | null;
  selected: string | null;
  onSelect: (slot: SlotAvailability) => void;
}) {
  if (loading) {
    return <p className="text-[14px] text-[var(--ink-soft)]">Checking availability…</p>;
  }
  if (error) {
    return <p className="text-[14px] text-orange">{error}</p>;
  }
  if (!day) return null;
  if (!day.open) {
    return (
      <p className="text-[14px] text-[var(--ink-soft)]">
        {day.closedReason ?? "We're closed that day."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {day.slots.map((slot) => {
        // There is no per-slot limit (DEC-021), so a slot is bookable unless
        // staff have closed it. Remaining counts only appear if the café has
        // reinstated a cap server-side.
        const fits = slot.available;
        const isSelected = selected === slot.value;
        const note = slot.closedReason
          ? slot.closedReason
          : slot.remaining !== undefined && slot.capacity !== undefined
            ? slot.remaining === 0
              ? "Fully booked"
              : `${slot.remaining} of ${slot.capacity} left`
            : null;

        return (
          <button
            key={slot.value}
            type="button"
            disabled={!fits}
            onClick={() => onSelect(slot)}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-[14px] transition-colors ${
              isSelected
                ? "border-brick bg-brick text-white"
                : fits
                  ? "border-[var(--ink-line)] text-brick hover:border-brick"
                  : "cursor-not-allowed border-[var(--ink-line)] text-[var(--ink-soft)] opacity-50"
            }`}
          >
            <span>{slot.label}</span>
            {note && (
              <span className={`text-[12px] ${isSelected ? "text-white/80" : "text-[var(--ink-soft)]"}`}>
                {note}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function BookingFlow() {
  const [step, setStep] = useState<Step>("plan");
  // Drives the step transition's direction (see .step-enter in globals.css).
  const [stepDirection, setStepDirection] = useState<"forward" | "back">("forward");

  /** Every step change goes through here so the animation always matches. */
  const goToStep = useCallback((next: Step, direction: "forward" | "back" = "forward") => {
    setStepDirection(direction);
    setStep(next);
  }, []);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotAvailability | null>(null);
  const [info, setInfo] = useState<Info>({
    firstName: "", lastName: "", email: "", phone: "", agreed: false,
  });

  const today = new Date();
  const [viewMonth, setViewMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [monthData, setMonthData] = useState<MonthAvailability | null>(null);
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthError, setMonthError] = useState<string | null>(null);

  const [dayData, setDayData] = useState<DayAvailability | null>(null);
  const [dayLoading, setDayLoading] = useState(false);
  const [dayError, setDayError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const partySize = selectedPlan ? partySizeFor(selectedPlan, qty) : qty;

  // Month availability drives which dates are clickable at all.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setMonthLoading(true);
      setMonthError(null);
      try {
        const data = await getMonthAvailability(viewMonth.year, viewMonth.month + 1);
        if (!cancelled) setMonthData(data);
      } catch (err) {
        if (!cancelled) {
          setMonthData(null);
          setMonthError((err as ApiError).message);
        }
      } finally {
        if (!cancelled) setMonthLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [viewMonth]);

  // Guards against a slow response for an earlier date overwriting a newer one.
  const latestDayRequest = useRef<string | null>(null);

  /** Slot counts move between visits, so they're always fetched fresh. */
  const loadDay = useCallback(async (dateStr: string, forPlan: Plan) => {
    latestDayRequest.current = dateStr;
    setDayLoading(true);
    setDayError(null);
    try {
      const data = await getDayAvailability(dateStr, forPlan.id);
      if (latestDayRequest.current !== dateStr) return;
      setDayData(data);
      // A whole-day pass offers a single option — choosing it for the guest
      // saves a pointless click on a list of one.
      if (forPlan.wholeDay && data.open && data.slots.length === 1 && data.slots[0].available) {
        setSelectedSlot(data.slots[0]);
      }
    } catch (err) {
      if (latestDayRequest.current === dateStr) {
        setDayData(null);
        setDayError((err as ApiError).message);
      }
    } finally {
      if (latestDayRequest.current === dateStr) setDayLoading(false);
    }
  }, []);

  function reset() {
    goToStep("plan", "back");
    setSelectedPlan(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setQty(1);
    setConfirmed(null);
    setSubmitError(null);
    setInfo({ firstName: "", lastName: "", email: "", phone: "", agreed: false });
  }

  // ── Step: plan ──────────────────────────────────────────────────────────

  if (step === "plan") {
    // No `.step-enter` on this container: the staggered cards below are the
    // entrance, and animating the wrapper at the same time made both read as
    // mush. The eyebrow and Continue join the same stagger instead.
    return (
      <div className="flex flex-col gap-4">
        <p
          className="stagger-item mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]"
        >
          Select appointment
        </p>

        {plans.map((plan, index) => (
          <PassCard
            key={plan.id}
            plan={plan}
            index={index}
            selected={selectedPlan?.id === plan.id}
            onSelect={() => {
              setSelectedPlan(plan);
              setQty(plan.guestCount ?? 1);
            }}
          />
        ))}

        {/*
          Full width on mobile where it's the only action; right-aligned on
          desktop. Disabled until a pass is chosen — the shared Button's
          disabled state dims it rather than colouring it grey, which would
          read as broken instead of "not yet".
        */}
        <Button
          variant="primary"
          disabled={!selectedPlan}
          onClick={() => goToStep("datetime")}
          className="stagger-item mt-2 w-full sm:w-auto sm:self-end"
          style={{ animationDelay: `${(plans.length + 1) * 100}ms` }}
        >
          Continue
        </Button>
      </div>
    );
  }

  if (!selectedPlan) {
    // Guard: steps below require a plan. Unreachable in practice — "datetime"
    // is only reachable through the plan step's Continue button.
    return null;
  }

  const plan = selectedPlan;
  const fixedParty = plan.guestCount !== undefined;

  // ── Step: datetime ──────────────────────────────────────────────────────

  if (step === "datetime") {
    const total = plan.perPerson ? plan.price * partySize : plan.price;
    const PlanIcon = plan.wholeDay ? LaptopIcon : CupIcon;
    // Whole-day passes have one fixed window; hourly plans show whichever
    // slot the guest has chosen.
    const timeWindow = plan.wholeDay
      ? (selectedSlot?.label ?? "All day, 10 AM – 8 PM")
      : (selectedSlot?.label ?? null);

    const iconButton =
      "flex h-8 w-8 items-center justify-center rounded-full border border-[var(--booking-border)] text-[var(--ink)] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-[var(--booking-peach)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] focus-visible:ring-offset-2";
    const stepperButton =
      "flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--ink)] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-[var(--booking-peach)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] disabled:cursor-not-allowed disabled:opacity-40";

    return (
      <div className="step-enter" data-direction={stepDirection}>
        <div className="overflow-hidden rounded-2xl border border-[var(--booking-border)] bg-white shadow-[var(--shadow-sm)]">

          {/* ── Header: back · plan · guests ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--booking-border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToStep("plan", "back")}
                aria-label="Back to passes"
                className={iconButton}
              >
                <ArrowLeft />
              </button>

              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--booking-peach)] text-[var(--booking-icon)]"
                aria-hidden
              >
                <PlanIcon />
              </span>

              <div>
                <p className="text-[15px] font-medium text-[var(--ink)]">{plan.name}</p>
                <p className="text-[13px] text-[var(--booking-muted)]">
                  {formatDuration(plan)}
                </p>
              </div>
            </div>

            {fixedParty ? (
              <span className="text-[13px] text-[var(--booking-muted)]">
                {plan.guestCount} guests included
              </span>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-[var(--booking-panel)] py-1 pl-4 pr-1">
                <span className="text-[13px] text-[var(--booking-muted)]">Guests</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="One fewer guest"
                  className={stepperButton}
                >
                  <Minus />
                </button>
                <span
                  className="w-5 text-center text-[14px] font-medium text-[var(--ink)]"
                  aria-live="polite"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(MAX_PARTY_SIZE, q + 1))}
                  disabled={qty >= MAX_PARTY_SIZE}
                  aria-label="One more guest"
                  className={stepperButton}
                >
                  <Plus />
                </button>
              </div>
            )}
          </div>

          {/* ── Body: calendar · summary ── */}
          <div className="grid grid-cols-1 sm:grid-cols-[57fr_43fr]">
            <div className="p-5">
              <BookingCalendar
                value={selectedDate}
                onChange={(dateStr) => {
                  setSelectedDate(dateStr);
                  setSelectedSlot(null);
                  setDayData(null);
                  void loadDay(dateStr, plan);
                }}
                month={viewMonth}
                onMonthChange={setViewMonth}
                availability={monthData}
                loading={monthLoading}
                error={monthError}
                onRetry={() => setViewMonth((m) => ({ ...m }))}
              />
            </div>

            <div className="border-t border-[var(--booking-border)] bg-[var(--booking-panel)] sm:border-l sm:border-t-0">
              <BookingSummary
                plan={plan}
                selectedDate={selectedDate}
                timeWindow={timeWindow}
                partySize={partySize}
                total={total}
                canContinue={Boolean(selectedDate && selectedSlot)}
                onContinue={() => { setSubmitError(null); goToStep("info"); }}
                slotPicker={
                  plan.wholeDay ? undefined : (
                    <SlotList
                      day={dayData}
                      loading={dayLoading}
                      error={dayError}
                      selected={selectedSlot?.value ?? null}
                      onSelect={setSelectedSlot}
                    />
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: info ──────────────────────────────────────────────────────────

  if (step === "info") {
    /**
     * Order matters: reserve the seats *first*, then pay. Creating the booking
     * up front is what stops two people paying for the same last seat, and it
     * is where the authoritative amount comes from — the browser no longer
     * decides what to charge.
     */
    async function handlePay(e: React.FormEvent) {
      e.preventDefault();
      if (!info.agreed || !selectedDate || !selectedSlot || submitting) return;

      setSubmitting(true);
      setSubmitError(null);

      let booking: Booking;
      try {
        booking = await createBooking({
          planId: plan.id,
          bookingDate: selectedDate,
          timeSlot: plan.wholeDay ? undefined : selectedSlot.value,
          partySize,
          firstName: info.firstName,
          lastName: info.lastName,
          email: info.email,
          phone: info.phone,
          marketingOptIn: false,
        });
      } catch (err) {
        const apiError = err as ApiError;
        setSubmitting(false);
        setSubmitError(apiError.message);
        if (apiError.isSlotFull) {
          // Someone took the slot while this guest was filling in the form.
          setSelectedSlot(null);
          if (selectedDate) void loadDay(selectedDate, plan);
          goToStep("datetime", "back");
        }
        return;
      }

      const paystack = (
        window as Window & {
          PaystackPop?: { setup: (config: Record<string, unknown>) => { openIframe: () => void } };
        }
      ).PaystackPop;

      if (!paystack) {
        setSubmitting(false);
        setSubmitError("The payment window couldn't load. Please refresh and try again.");
        void releaseBooking(booking.id).catch(() => {});
        return;
      }

      const handler = paystack.setup({
        key: site.paystackPublicKey,
        email: info.email,
        // Both from the server — never recomputed here (DEC-018).
        amount: booking.amountKobo,
        // Paystack Inline v1 calls this `ref`, NOT `reference`. Passing the
        // wrong key doesn't error — Paystack silently mints its own reference
        // and the booking can never be matched to the payment.
        ref: booking.paymentReference,
        currency: "NGN",
        metadata: {
          custom_fields: [
            { display_name: "Booking ID", variable_name: "booking_id", value: booking.id },
            { display_name: "Name", variable_name: "name", value: `${info.firstName} ${info.lastName}` },
            { display_name: "Plan", variable_name: "plan", value: plan.name },
            { display_name: "Date", variable_name: "date", value: formatDateStr(selectedDate) },
            { display_name: "Time", variable_name: "time", value: selectedSlot.label },
            { display_name: "Guests", variable_name: "party_size", value: String(partySize) },
          ],
        },
        // Paystack's callback isn't proof of payment — the server asks Paystack
        // directly before we show a confirmation.
        callback: (response?: { reference?: string }) => {
          void verifyBooking(booking.id, response?.reference)
            .then((result) => {
              setConfirmed(result);
              goToStep("confirmed");
            })
            .catch((err: ApiError) => {
              setSubmitError(
                `${err.message} If you were charged, email ${site.email} with reference ${booking.paymentReference}.`,
              );
            })
            .finally(() => setSubmitting(false));
        },
        onClose: () => {
          setSubmitting(false);
          // Hand the seats straight back rather than making the next guest
          // wait out the hold window.
          void releaseBooking(booking.id).catch(() => {});
        },
      });

      handler.openIframe();
    }

    return (
      <div className="step-enter" data-direction={stepDirection}>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

        {/* Booking summary */}
        <div className="mb-4 border border-[var(--ink-line)] bg-sand px-8 py-6">
          <button
            type="button"
            onClick={() => goToStep("datetime", "back")}
            className="mb-4 flex items-center gap-2 text-[12px] uppercase tracking-wide text-[var(--ink-muted)] hover:text-brick"
          >
            ‹ Back
          </button>
          <p className="text-[13px] font-medium text-brick">{plan.name}</p>
          <p className="mt-0.5 text-[13px] text-[var(--ink-muted)]">
            {plan.wholeDay
              ? `Day pass @ ₦${plan.price.toLocaleString("en-NG")} per person`
              : `${plan.durationMins} minutes @ ₦${plan.price.toLocaleString("en-NG")}`}{" "}
            &middot; {partySize} guest{partySize === 1 ? "" : "s"}
          </p>
          {selectedDate && selectedSlot && (
            <p className="mt-0.5 text-[13px] text-[var(--ink-muted)]">
              {formatDateStr(selectedDate)}
              {plan.wholeDay ? ` · ${selectedSlot.label}` : ` at ${selectedSlot.label}`}
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

          {submitError && (
            <p className="mt-6 rounded-lg border border-orange px-4 py-3 text-[13px] text-orange">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-[var(--ink-line)] pt-6">
            <p className="text-[15px] font-medium text-brick">
              Total: ₦{totalFor(plan, qty).toLocaleString("en-NG")}
            </p>
            <button
              type="submit"
              disabled={!info.agreed || submitting}
              className="rounded-lg bg-brick px-10 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Holding your spot…" : "Continue to Payment"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── Step: confirmed ─────────────────────────────────────────────────────

  return (
    <div className="step-enter rounded-[22px] bg-sand px-8 py-16 text-center shadow-[var(--shadow-sm)]">
      <p className="text-[32px]">🐾</p>
      <h2 className="mt-4 text-[24px] font-semibold text-brick">You&apos;re booked!</h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] font-light leading-relaxed text-[var(--ink-muted)]">
        A confirmation has been sent to <strong>{info.email}</strong>. We can&apos;t wait to see you
        {selectedDate && selectedSlot
          ? plan.wholeDay
            ? ` on ${formatDateStr(selectedDate)} — come any time between 10 AM and 8 PM`
            : ` on ${formatDateStr(selectedDate)} at ${selectedSlot.label}`
          : ""}.
      </p>
      {confirmed && (
        <p className="mt-3 text-[12px] uppercase tracking-wide text-[var(--ink-soft)]">
          Reference: {confirmed.paymentReference}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg border border-brick px-8 py-3 text-[12px] uppercase tracking-wide text-brick hover:bg-brick hover:text-white"
      >
        Book Another Visit
      </button>
    </div>
  );
}
