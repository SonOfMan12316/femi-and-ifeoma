/**
 * Booking limits.
 *
 * There is deliberately **no cap on guests per time slot** (DEC-021). The
 * owners chose to accept whatever demand arrives and manage it on the floor
 * rather than have the site refuse bookings. Per-slot counts are still
 * recorded and surfaced on the staff day sheet — the café needs to know how
 * many people are coming at 11 AM, it just doesn't need the site to say no.
 *
 * Set SLOT_CAPACITY to a positive number to reinstate a hard limit; leaving it
 * unset (the default) means unlimited.
 */

/** Hard per-slot guest limit, or null for unlimited. */
export function slotCapacity(): number | null {
  const raw = Number(process.env.SLOT_CAPACITY);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : null;
}

/**
 * How long a pending (unpaid) booking is held before the sweeper marks it
 * `expired`. With no capacity cap this no longer reserves anything — it just
 * stops abandoned checkouts sitting as `pending` forever and polluting the
 * day sheet.
 */
export function holdMinutes(): number {
  const raw = Number(process.env.BOOKING_HOLD_MINUTES);
  return Number.isFinite(raw) && raw > 0 ? raw : 10;
}

/**
 * How far ahead a booking must be made, in minutes. 0 means a slot is bookable
 * right up to its start time; 30 would close the 11:00 slot at 10:30.
 *
 * Kept at 0 by default — the café has not asked for a cutoff, and guessing one
 * would silently turn away guests who are already on their way.
 */
export function leadMinutes(): number {
  const raw = Number(process.env.BOOKING_LEAD_MINUTES);
  return Number.isFinite(raw) && raw >= 0 ? raw : 0;
}
