# Fémi & Ifeoma Cat Café — Architecture

**Repo shape (as of 2026-08-11, DEC-014):** a plain two-folder monorepo — `frontend/` and `backend/` are two fully independent codebases (own `package.json`, own `node_modules`, own deploy target). No npm workspaces or shared tooling between them by design — the owner explicitly wanted the backend to not live inside the frontend's Next.js app.

## Project Structure

```
femi-and-ifeoma/
├── frontend/                  # Next.js site — see frontend/README.md
│   ├── public/
│   │   ├── fonts/             # Self-hosted brand fonts
│   │   ├── uploads/           # Photography
│   │   └── cursors/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # Nav, Footer, Hero, BookingFlow, MomentsGallery, etc.
│   │   └── lib/site.ts         # Static content: cats, faqs, houseRules, plans (see note below)
│   └── package.json
│
├── backend/                    # NestJS API — see backend/README.md
│   ├── prisma/
│   │   ├── schema.prisma       # Mirrors docs/12-BOOKING_MEMBERSHIP_SCHEMA.md
│   │   └── seed.ts             # Loads the 5 plans
│   ├── src/
│   │   ├── plans/               # GET /plans
│   │   ├── members/             # Lookup + marketing export
│   │   ├── bookings/            # Create/confirm — "booking creates membership"
│   │   ├── visits/               # Workspace check-in flow
│   │   ├── prisma/               # PrismaService (Supabase Postgres)
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── docs/                        # This folder
    ├── 01-BRAND_SUMMARY.md
    ├── 02-DESIGN_TOKENS.md
    ├── 03-COMPONENT_GUIDELINES.md
    ├── 04-UI_AUDIT.md
    ├── 05-IMPLEMENTATION_PLAN.md
    ├── 06-TASKS.md
    ├── 07-ARCHITECTURE.md
    ├── 08-DECISIONS.md
    ├── 09-CHANGELOG.md
    ├── 10-CLAUDE_PROMPT.md
    ├── 11-PROJECT_SPEC.md
    └── 12-BOOKING_MEMBERSHIP_SCHEMA.md
```

**Note on `frontend/src/lib/site.ts` `plans`:** this is currently the source of truth the frontend renders from directly. Once the backend is deployed, the frontend should fetch `GET /plans` instead of hardcoding — until then, a change to pricing/plans must be made in *both* `site.ts` and `backend/prisma/seed.ts` to stay in sync (flagged in DEC-013).

---

## Frontend Stack

| Concern | Technology | Notes |
|---|---|---|
| Framework | React / Next.js (App Router) | SSR for SEO (booking pages need indexing) |
| Styling | Tailwind + CSS variables (`globals.css`) | Tokens always via CSS variables |
| Fonts | Self-hosted @font-face (Let's Coogi, Neue Haas, Knicknack) + `next/font/google` (Cormorant Garamond) | Avoid raw Google Fonts CDN requests — see DEC-002/DEC-008 |
| Images | Next/Image or native `<img loading="lazy">` | WebP format |
| Payments | Paystack inline.js, embedded in `BookingFlow.tsx` | Client-side checkout; confirmation should call the backend's `POST /bookings/:id/confirm` (not yet wired — currently only calls `setStep("confirmed")` locally) |
| Deploy | Vercel | |

---

## Backend Stack

| Concern | Technology | Notes |
|---|---|---|
| Runtime | Node.js | |
| Framework | **NestJS** | Chosen over Express/Fastify per the owner — see DEC-014 |
| ORM | **Prisma** | Type-safe queries + migrations; schema at `backend/prisma/schema.prisma` |
| Database | **Supabase Postgres** | Free tier; chosen over Neon/self-hosted per the owner — see DEC-014. No Mongo, per explicit instruction |
| Auth | None yet | Staff-facing endpoints (`/members/lookup`, `/members/marketing-export`) are unauthenticated — flagged as a gap in `backend/README.md`, needs an admin login before this ships |
| Payments | Paystack | Webhook signature verification not yet implemented — flagged as a `TODO` in `bookings.controller.ts` |
| Email | Resend or Nodemailer | Not yet implemented |
| Deploy | Render (free web service tier) or Fly.io | Render's own free Postgres expires after 30 days — use Supabase for the database regardless of where the API is hosted |

See `docs/12-BOOKING_MEMBERSHIP_SCHEMA.md` for the full data model and the "booking creates membership" flow.

---

## API Endpoints (Planned)

```
GET  /api/availability?date=YYYY-MM-DD
     → Returns available time slots for that date

POST /api/bookings
     → Creates a booking
     → Body: { name, email, phone, date, timeSlot, partySize }
     → Returns: bookingId, confirmationCode

GET  /api/bookings/:id
     → Returns booking details (for confirmation page)

GET  /api/cats
     → Returns list of resident cats with name, breed, personality, photo

GET  /api/availability/blocked-dates
     → Returns array of fully-booked or closed dates
```

**Implemented so far** (`backend/src/`, actual routes — no `/api` prefix currently set):

```
GET  /health
GET  /plans
GET  /plans/:id
POST /bookings
POST /bookings/:id/confirm
GET  /bookings
GET  /bookings/:id
GET  /members
GET  /members/lookup?q=
GET  /members/marketing-export
POST /visits/check-in
```

The planned `/api/availability*` endpoints above are not built yet — bookings can currently be created for any date/time slot with no capacity check (tracked in `06-TASKS.md` Phase 4).

---

## Naming Conventions

- Components: PascalCase (`CatCard`, `BookingCalendar`)
- CSS variables: `--kebab-case` with category prefix (`--color-orange`, `--font-body`, `--space-4`)
- Files: kebab-case (`booking-calendar.css`, `cat-card.jsx`)
- API routes: kebab-case plural nouns (`/bookings`, `/time-slots`)
- Database tables: snake_case (`bookings`, `time_slots`, `cats`)

---

## Environment Variables

```
# Frontend (frontend/.env.local — not yet created, currently unused)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_PAYSTACK_KEY=

# Backend (backend/.env — see backend/.env.example)
DATABASE_URL=
PAYSTACK_SECRET_KEY=
PORT=
CORS_ORIGINS=
```

---

## Deployment

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | `frontend/` on :3000, `backend/` on :4000 |
| Staging | Pre-launch testing | Mirror production data |
| Production | Live site | femiandifeomacatcafe.com |

Frontend: Vercel (recommended for Next.js)
Backend: Render free web-service tier (or Fly.io) — see DEC-014
Database: Supabase Postgres — see DEC-014
