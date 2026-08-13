# Fémi & Ifeoma — Booking & Membership API

NestJS + Prisma + Postgres (Supabase). Standalone backend — see `/docs/12-BOOKING_MEMBERSHIP_SCHEMA.md` for the full schema design and rationale, and `/docs/08-DECISIONS.md` DEC-014 for why this stack.

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL from your Supabase project + PAYSTACK_SECRET_KEY
npm run prisma:migrate # creates tables from prisma/schema.prisma
npm run prisma:seed    # loads the 5 plans (mirrors frontend/src/lib/site.ts)
npm run dev            # http://localhost:4000
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/plans` | List active plans |
| GET | `/plans/:id` | One plan |
| POST | `/bookings` | Create a pending booking (upserts the member if new) |
| POST | `/bookings/:id/confirm` | Called on payment confirmation — flips the booking to `confirmed`, bumps the member's visit count, logs a `visit` row |
| GET | `/bookings` | List bookings |
| GET | `/bookings/:id` | One booking |
| GET | `/members` | List members |
| GET | `/members/lookup?q=` | Staff lookup by email or phone (workspace check-in flow) |
| GET | `/members/marketing-export` | Opted-in members for email/campaign tools |
| POST | `/visits/check-in` | Log a workspace visit for an existing member (no new booking) |

## Not yet implemented

- Paystack webhook signature verification on `POST /bookings/:id/confirm` (currently trusts the payload — flagged with a `TODO` in `bookings.controller.ts`)
- Auth / admin login for the staff lookup and marketing-export endpoints (currently open — fine for local development only)
- Availability checks against existing bookings when creating a new one

## Stack rationale

NestJS + Supabase Postgres, chosen over Express/Fastify and Mongo/Neon — see DEC-014 in `/docs/08-DECISIONS.md`.
