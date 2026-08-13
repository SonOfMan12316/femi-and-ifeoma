# Fémi & Ifeoma Cat Café — Frontend

Next.js + TypeScript + Tailwind site for Nigeria's first cat café. Part of a two-app monorepo — see the root `README.md` and `../backend/` for the booking/membership API.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Self-hosted brand fonts (Let's Coogi, Neue Haas Grotesk Display Pro, Knicknack) + Cormorant Garamond via `next/font/google`

## Booking

`/book-your-visit` runs a custom booking flow (`src/components/BookingFlow.tsx`) — plan selection, calendar, Paystack checkout — against the plans defined in `src/lib/site.ts`. Those plans currently duplicate `../backend/prisma/seed.ts`; once the backend is deployed this should fetch `GET /plans` instead (see `docs/08-DECISIONS.md` DEC-013).
