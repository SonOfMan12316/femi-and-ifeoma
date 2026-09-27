/**
 * Thin client for the booking API (backend/, NestJS on :4000).
 *
 * Everything that costs money or consumes a seat is decided server-side — this
 * module only carries requests and surfaces errors. In particular the payment
 * amount comes back from the server and is never computed here.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly remaining?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** The slot filled up between loading availability and submitting. */
  get isSlotFull() {
    return this.status === 409;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("We couldn't reach the booking system. Check your connection.", 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? "Something went wrong. Please try again.");
    throw new ApiError(message, response.status, body?.code, body?.remaining);
  }

  return response.json() as Promise<T>;
}

// ─── Availability ────────────────────────────────────────────────────────────

export type SlotAvailability = {
  value: string;
  label: string;
  /** Guests already booked. Reporting only — there is no cap (DEC-021). */
  booked: number;
  available: boolean;
  /** Only present if a hard SLOT_CAPACITY is configured on the server. */
  capacity?: number;
  remaining?: number;
  closedReason?: string;
};

export type DayAvailability = {
  date: string;
  open: boolean;
  closedReason?: string;
  capacityPerSlot: number | null;
  slots: SlotAvailability[];
};

export type MonthAvailability = {
  year: number;
  month: number;
  capacityPerSlot: number | null;
  days: { date: string; open: boolean; booked: number; closedReason?: string }[];
};

/**
 * `planId` matters: whole-day passes (Co-Work) come back as a single all-day
 * entry rather than hourly slots.
 */
export function getDayAvailability(date: string, planId?: string) {
  const query = planId ? `?date=${date}&planId=${encodeURIComponent(planId)}` : `?date=${date}`;
  return request<DayAvailability>(`/availability${query}`);
}

/** `month` is 1-indexed here, unlike JavaScript's Date. */
export function getMonthAvailability(year: number, month: number) {
  return request<MonthAvailability>(`/availability/month?year=${year}&month=${month}`);
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export type CreateBookingInput = {
  planId: string;
  bookingDate: string; // YYYY-MM-DD
  /** Canonical 24h key, e.g. "11:00". Omitted for whole-day passes. */
  timeSlot?: string;
  partySize: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  marketingOptIn?: boolean;
};

export type Booking = {
  id: string;
  planId: string;
  bookingDate: string;
  timeSlot: string;
  partySize: number;
  /** Authoritative amount, in kobo, computed from the plans table. */
  amountKobo: number;
  paymentReference: string;
  status: string;
  paymentStatus: string;
};

export function createBooking(input: CreateBookingInput) {
  return request<Booking>("/bookings", { method: "POST", body: JSON.stringify(input) });
}

/**
 * Confirms payment server-side against Paystack. Idempotent with the webhook.
 *
 * `paystackReference` is the reference Paystack reports in its callback. It
 * should equal the one we generated, but it is the authority if it doesn't —
 * it names the transaction that actually exists on Paystack's side.
 */
export function verifyBooking(id: string, paystackReference?: string) {
  return request<Booking>(`/bookings/${id}/verify`, {
    method: "POST",
    body: JSON.stringify(paystackReference ? { paystackReference } : {}),
  });
}

/** Guest closed the payment modal — hand the held seats back immediately. */
export function releaseBooking(id: string) {
  return request<Booking>(`/bookings/${id}/release`, { method: "POST" });
}
