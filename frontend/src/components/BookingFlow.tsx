"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { site, plans, type Plan } from "@/lib/site";
import { Button } from "@/components/Button";
import { PassCard } from "@/components/PassCard";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingSummary } from "@/components/booking/BookingSummary";
import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  CupIcon,
  LaptopIcon,
  LockIcon,
  Minus,
  Plus,
  Spinner,
} from "@/components/booking/icons";
import { BookingDetailsSummary } from "@/components/booking/BookingDetailsSummary";
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

/** Field-level validation. Returns a message, or null when the field is fine. */
function validateField(key: keyof Info, info: Info): string | null {
  switch (key) {
    case "firstName":
      return info.firstName.trim() ? null : "Please enter your first name.";
    case "lastName":
      return info.lastName.trim() ? null : "Please enter your last name.";
    case "email":
      if (!info.email.trim()) return "Please enter your email address.";
      // Deliberately loose: the only authority on whether an address works is
      // whether mail reaches it, and strict patterns reject valid addresses.
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())
        ? null
        : "That doesn't look like an email address.";
    case "phone":
      if (!info.phone.trim()) return "Please enter a phone number.";
      return info.phone.replace(/\D/g, "").length >= 10
        ? null
        : "That phone number looks too short.";
    case "agreed":
      return info.agreed ? null : "Please agree to the house rules to continue.";
    default:
      return null;
  }
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

  // Which fields the guest has left, so errors appear on blur rather than
  // scolding them mid-typing.
  const [touched, setTouched] = useState<Partial<Record<keyof Info, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
      if (submitting || !selectedDate || !selectedSlot) return;

      setSubmitAttempted(true);
      const firstInvalid = (["firstName", "lastName", "email", "phone", "agreed"] as const).find(
        (key) => validateField(key, info) !== null,
      );
      if (firstInvalid) {
        // Take the guest to the problem rather than leaving them to hunt for it.
        const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
        return;
      }

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

    const total = plan.perPerson ? plan.price * partySize : plan.price;
    const timeWindow = plan.wholeDay
      ? (selectedSlot?.label ?? "All day, 10 AM – 8 PM")
      : (selectedSlot?.label ?? "");

    /** An error is only shown once the guest has left the field, or tried to submit. */
    const errorFor = (key: keyof Info) =>
      touched[key] || submitAttempted ? validateField(key, info) : null;

    const fields = [
      { key: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
      { key: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
      { key: "email", label: "Email", type: "email", autoComplete: "email" },
      {
        key: "phone",
        label: "Phone number",
        type: "tel",
        autoComplete: "tel",
        inputMode: "tel" as const,
        placeholder: "0802 345 6789",
      },
    ] as const;

    const agreedError = errorFor("agreed");

    return (
      <div className="step-enter" data-direction={stepDirection}>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

        <div className="overflow-hidden rounded-2xl border border-[var(--booking-border)] bg-white shadow-[var(--shadow-sm)]">

          {/* ── Header: back · progress ── */}
          <div className="flex items-center gap-4 border-b border-[var(--booking-border)] px-5 py-4">
            <button
              type="button"
              onClick={() => goToStep("datetime", "back")}
              aria-label="Back to choosing a date"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--booking-border)] text-[var(--ink)] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-[var(--booking-peach)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] focus-visible:ring-offset-2"
            >
              <ArrowLeft />
            </button>

            <ol className="flex items-center gap-2 text-[13px]">
              <li className="flex items-center gap-1.5 text-[var(--booking-muted)]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--booking-accent)] text-white">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
                Date
              </li>
              <li aria-hidden className="text-[var(--booking-muted)]">›</li>
              <li className="font-medium text-[var(--booking-accent)]" aria-current="step">
                Your details
              </li>
            </ol>
          </div>

          {/* Summary sits above the form on mobile (order-first) and beside it
              on desktop, where it sticks while the form scrolls. */}
          <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr]">
            <div className="order-2 md:order-1">
              <form ref={formRef} onSubmit={handlePay} noValidate className="px-5 py-6 md:px-6">
                <h2 className="text-[16px] font-medium text-[var(--ink)]">Your details</h2>
                <p className="mt-1 text-[13px] text-[var(--booking-muted)]">
                  We&apos;ll send your booking confirmation here.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {fields.map((field) => {
                    const error = errorFor(field.key);
                    return (
                      <div key={field.key}>
                        <label
                          htmlFor={field.key}
                          className="mb-1.5 block text-[13px] text-[var(--ink)]"
                        >
                          {field.label} <span className="text-[var(--booking-accent)]">*</span>
                        </label>
                        <input
                          id={field.key}
                          data-field={field.key}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          inputMode={"inputMode" in field ? field.inputMode : undefined}
                          placeholder={"placeholder" in field ? field.placeholder : undefined}
                          value={info[field.key]}
                          aria-invalid={error ? true : undefined}
                          aria-describedby={error ? `${field.key}-error` : undefined}
                          onChange={(e) =>
                            setInfo((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          onBlur={() => setTouched((t) => ({ ...t, [field.key]: true }))}
                          className="booking-input"
                        />
                        {error && (
                          <p id={`${field.key}-error`} className="mt-1.5 text-[12px] text-[var(--error)]">
                            {error}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Whole box is the control — a 18px checkbox is a small target. */}
                <label
                  data-field="agreed"
                  tabIndex={-1}
                  className={`mt-5 flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-150 ease-[var(--ease-out)] ${
                    agreedError
                      ? "border-[var(--error)] bg-white"
                      : "border-[var(--booking-border)] bg-[var(--booking-panel)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={info.agreed}
                    onChange={(e) => {
                      setInfo((prev) => ({ ...prev, agreed: e.target.checked }));
                      setTouched((t) => ({ ...t, agreed: true }));
                    }}
                    aria-invalid={agreedError ? true : undefined}
                    aria-describedby={agreedError ? "agreed-error" : undefined}
                    className="booking-check mt-0.5"
                  />
                  <span className="text-[13px] font-light leading-relaxed text-[var(--ink-muted)]">
                    I agree to behave gently around the cats, follow house rules, and understand that{" "}
                    {site.fullName} is not liable for injuries caused by my own actions.
                  </span>
                </label>
                {agreedError && (
                  <p id="agreed-error" className="mt-1.5 text-[12px] text-[var(--error)]">
                    {agreedError}
                  </p>
                )}

                {submitError && (
                  <p className="mt-5 rounded-xl border border-[var(--error)] px-4 py-3 text-[13px] text-[var(--error)]">
                    {submitError}
                  </p>
                )}

                {/* Desktop: button only — the total is already in the summary.
                    Mobile: the bar sticks to the viewport with the total beside it. */}
                <div className="sticky bottom-0 -mx-5 mt-6 flex items-center justify-between gap-4 border-t border-[var(--booking-border)] bg-white px-5 py-4 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-6">
                  <p className="text-[14px] text-[var(--ink)] md:hidden">
                    Total{" "}
                    <span className="font-medium">₦{total.toLocaleString("en-NG")}</span>
                  </p>
                  <button
                    type="submit"
                    className="ml-auto flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--booking-accent)] px-6 text-[15px] font-medium text-white transition-opacity duration-150 ease-[var(--ease-out)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--booking-accent)] focus-visible:ring-offset-2 disabled:opacity-60"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner />
                        Processing…
                      </>
                    ) : (
                      <>
                        <LockIcon />
                        Continue to payment
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="order-1 border-b border-[var(--booking-border)] bg-[var(--booking-panel)] md:order-2 md:border-b-0 md:border-l">
              <div className="md:sticky md:top-24">
                {selectedDate && (
                  <BookingDetailsSummary
                    plan={plan}
                    selectedDate={selectedDate}
                    timeWindow={timeWindow}
                    partySize={partySize}
                    total={total}
                    onChange={() => goToStep("datetime", "back")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
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
