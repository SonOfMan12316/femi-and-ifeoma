# Fémi & Ifeoma Cat Café — Booking & Membership Data Model

**Status:** Proposed — design only, no backend code yet.
**Depends on:** `07-ARCHITECTURE.md` (Backend Stack: Node.js, PostgreSQL/Supabase).
**Feeds into:** Phase 4 — Booking Flow, and a new Phase 6 — Membership & Retention (see `06-TASKS.md`).

---

## Goal

Every completed booking should create (or update) a **member** record automatically — no separate sign-up step. This gives the café:

1. A single source of truth per guest (name, email, phone, visit history) for email/campaign tools.
2. A way for returning guests to be recognised — e.g. walk in and use the workspace — without re-entering their details or re-booking as if new.
3. A foundation that supports both paid café-visit plans (Solo Pass, Duo Pass, etc.) and lighter-weight workspace check-ins, on the same member record.

This document defines the schema. It does not implement the backend — that's tracked separately once Phase 4 kicks off in code.

---

## Design principles

- **Booking creates membership, not the other way round.** No registration form. The first successful booking (matched by email, falling back to phone) creates the member row.
- **One member, many bookings.** A member is looked up by email (primary) or phone (secondary) on every new booking so repeat guests merge into the same row instead of creating duplicates.
- **Plans live in the database, not just `site.ts`.** `src/lib/site.ts` stays as the static, deploy-time copy the frontend renders today. Once the backend exists, `plans` becomes the read replica of the `plans` table so pricing/copy can change without a redeploy. Until then, the two are kept manually in sync — flagged in the impact section below.
- **Workspace use is a visit, not always a purchase.** A member with any confirmed booking history is entitled to use the workspace without buying a new pass. This is modeled as a lightweight `visits` row a staff member logs at the door (looked up by email/phone), separate from the `bookings` table that tracks paid, scheduled sessions.
- **Everything needed for email/campaigns lives on `members`.** No join required to pull a mailing list.

---

## Tables

### `plans`
Mirrors the plan cards on `/book-your-visit` (Solo Pass, Duo Pass, Trio Pass, VIP Group Pass, PlayDate, plus any future limited-time passes like the Sip & Paint event).

```sql
CREATE TABLE plans (
  id              TEXT PRIMARY KEY,        -- e.g. 'solo-pass', matches site.ts Plan.id
  name            TEXT NOT NULL,
  duration_mins   INTEGER NOT NULL,
  price_kobo      INTEGER NOT NULL,
  per_person      BOOLEAN NOT NULL DEFAULT TRUE,
  guest_count     INTEGER,                 -- fixed party size for passes like Duo/Trio/VIP
  description     TEXT NOT NULL,
  schedule        TEXT,                    -- e.g. 'Every Wednesday' for recurring, non-daily plans
  booking_type    TEXT NOT NULL DEFAULT 'cafe_visit'
                  CHECK (booking_type IN ('cafe_visit', 'workspace', 'event')),
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `members`
```sql
CREATE TABLE members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  email             TEXT NOT NULL UNIQUE,
  phone             TEXT,
  marketing_opt_in  BOOLEAN NOT NULL DEFAULT TRUE,   -- surfaced as a checkbox at booking; see Open Questions
  total_visits      INTEGER NOT NULL DEFAULT 0,      -- incremented on each confirmed booking or logged visit
  first_visit_at    TIMESTAMPTZ,
  last_visit_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_phone ON members (phone);
```

### `bookings`
Paid, scheduled sessions against a plan.

```sql
CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id           UUID NOT NULL REFERENCES members(id),
  plan_id             TEXT NOT NULL REFERENCES plans(id),
  booking_date        DATE NOT NULL,
  time_slot           TEXT NOT NULL,          -- e.g. '11:00 AM'
  party_size          INTEGER NOT NULL DEFAULT 1,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  amount_kobo         INTEGER NOT NULL,       -- plan.price_kobo * party_size at time of booking
  payment_reference   TEXT UNIQUE,            -- Paystack ref, e.g. 'FI-<timestamp>'
  payment_status      TEXT NOT NULL DEFAULT 'pending'
                      CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_member ON bookings (member_id);
CREATE INDEX idx_bookings_date   ON bookings (booking_date);
```

### `visits`
A physical check-in, whether or not it's tied to a paid booking. This is what lets a returning member use the workspace without buying a new pass — staff (or a future self-serve kiosk) logs a visit against an existing member.

```sql
CREATE TABLE visits (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id    UUID NOT NULL REFERENCES members(id),
  booking_id   UUID REFERENCES bookings(id),   -- null for a workspace-only walk-in
  visit_type   TEXT NOT NULL DEFAULT 'cafe_visit'
               CHECK (visit_type IN ('cafe_visit', 'workspace')),
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_visits_member ON visits (member_id);
```

---

## Membership auto-creation flow

1. Guest completes a booking (name, email, phone, plan, date/time) and pays via Paystack.
2. On the Paystack webhook confirming payment:
   - Look up `members` by `email`. If found, update `first_name`/`last_name`/`phone` if changed, bump `total_visits`, set `last_visit_at`.
   - If not found, `INSERT` a new `members` row.
   - Insert the `bookings` row with `payment_status = 'paid'`, `status = 'confirmed'`, linked to `member_id`.
3. Confirmation email sent to `members.email` (Resend/Nodemailer, per `07-ARCHITECTURE.md`).

## Workspace / repeat-visit flow

1. Returning guest arrives without a new booking.
2. Staff looks up the member by email or phone (simple search screen — admin panel is already Phase 2 on the roadmap in `11-PROJECT_SPEC.md`).
3. Staff logs a `visits` row (`visit_type = 'workspace'`, `booking_id = null`).
4. `members.total_visits` and `last_visit_at` update from the same trigger/logic used for bookings.

## Email / campaign export

Because everything lives on `members`, a mailing list is just:

```sql
SELECT first_name, last_name, email, total_visits, last_visit_at
FROM members
WHERE marketing_opt_in = TRUE;
```

Segments (e.g. "visited once, never came back," "VIP Group Pass regulars") are queries joining `members` to `bookings`/`visits` — no schema change needed to add new segments later.

---

## Open questions (confirm with owner before implementation)

1. **Marketing consent:** should `marketing_opt_in` default to opted-in (current proposal) or require an explicit checkbox at booking? Nigerian data-protection practice (NDPR) generally expects an affirmative opt-in, not a pre-checked box — recommend defaulting to `FALSE` and adding a checkbox, pending confirmation.
2. **Workspace access rules:** is workspace use free for anyone with ≥1 past booking, or only for specific plans (e.g. Solo Pass mentions "free high-speed Wi-Fi" already)? Affects whether `visits` needs an eligibility check.
3. **Duplicate guests without email:** phone-only guests (no email captured) — is phone enough to create a member, or is email mandatory? Current schema makes `email` `NOT NULL UNIQUE`; if some guests won't have email, this needs relaxing.
4. **Cancellation/refund policy** (already flagged as unconfirmed in `11-PROJECT_SPEC.md`) feeds directly into the `bookings.status`/`payment_status` state machine above.

---

## Relationship to `07-ARCHITECTURE.md`

This supersedes the placeholder `Booking.js` / `TimeSlot.js` models listed there with `bookings`, `members`, `plans`, and `visits`. `07-ARCHITECTURE.md` should be updated to reference this file once backend implementation actually begins (tracked as a Phase 4/6 task in `06-TASKS.md`).
