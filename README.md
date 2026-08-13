# Fémi & Ifeoma Cat Café

Nigeria's first cat café — website + booking system. Two independent apps, no shared tooling (see `docs/08-DECISIONS.md` DEC-014):

```
frontend/   Next.js site — brand pages, booking flow, Paystack checkout
backend/    NestJS API — plans, bookings, members/retention (Supabase Postgres)
docs/       Living project documentation — read this first
```

## Getting started

```bash
# Frontend
cd frontend && npm install && npm run dev      # http://localhost:3000

# Backend
cd backend && npm install
cp .env.example .env                            # fill in DATABASE_URL, PAYSTACK_SECRET_KEY
npm run prisma:migrate && npm run prisma:seed
npm run dev                                      # http://localhost:4000
```

## Documentation

Everything about this project — brand, design tokens, component rules, task tracker, architecture, decisions, changelog, and the booking/membership data model — lives in `docs/`. Start with `docs/06-TASKS.md` for current status and `docs/08-DECISIONS.md` for why things are built the way they are.
