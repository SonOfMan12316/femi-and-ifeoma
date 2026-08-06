# Fémi & Ifeoma Cat Café — Architecture

## Project Structure

```
femiandifeoma/
├── frontend/                  # Client-facing website
│   ├── public/
│   │   ├── fonts/             # Self-hosted brand fonts
│   │   │   ├── lets-coogi/
│   │   │   ├── neue-haas-grotesk/
│   │   │   ├── cormorant-garamond/
│   │   │   └── knicknack/
│   │   ├── icons/
│   │   │   └── brand/         # SVG brand motifs (paw, cat-face, oval-badge, whiskers)
│   │   └── images/            # Static images
│   │
│   ├── src/
│   │   ├── styles/
│   │   │   ├── tokens.css     # ALL CSS variables — source of truth
│   │   │   ├── base.css       # Reset + body/html defaults
│   │   │   ├── typography.css # Type scale and heading styles
│   │   │   └── utilities.css  # Optional utility classes
│   │   │
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── CatCard/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Badge/
│   │   │   ├── SectionLabel/
│   │   │   ├── Accordion/
│   │   │   └── BookingCalendar/
│   │   │
│   │   ├── sections/          # Page sections (non-reusable)
│   │   │   ├── Hero/
│   │   │   ├── BrandStory/
│   │   │   ├── MeetTheCats/
│   │   │   ├── HowItWorks/
│   │   │   └── Testimonials/
│   │   │
│   │   ├── pages/             # Page-level components
│   │   │   ├── Home/
│   │   │   ├── About/
│   │   │   ├── OurCats/
│   │   │   ├── FAQs/
│   │   │   ├── HouseRules/
│   │   │   └── Booking/
│   │   │
│   │   └── utils/             # Helpers, formatters, etc.
│   │
│   └── package.json
│
├── backend/                   # API / server
│   ├── routes/
│   │   ├── bookings.js        # POST /bookings, GET /bookings
│   │   ├── availability.js    # GET /availability?date=
│   │   └── cats.js            # GET /cats (if dynamic)
│   ├── models/
│   │   ├── Booking.js
│   │   └── TimeSlot.js
│   ├── middleware/
│   └── server.js
│
└── docs/                      # This folder
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
    └── 11-PROJECT_SPEC.md
```

---

## Frontend Stack

| Concern | Technology | Notes |
|---|---|---|
| Framework | React / Next.js | SSR for SEO (booking pages need indexing) |
| Styling | CSS Modules or Tailwind + tokens.css | Tokens always via CSS variables |
| Fonts | Self-hosted @font-face | Avoid Google Fonts — brand fonts aren't there |
| Images | Next/Image or native `<img loading="lazy">` | WebP format, srcset for responsive |
| Animations | CSS transitions + optional Framer Motion | Minimal — purposeful only |
| Routing | Next.js App Router | Pages: /, /about, /our-cats, /faqs, /house-rules, /book |

---

## Backend Stack

| Concern | Technology | Notes |
|---|---|---|
| Runtime | Node.js | |
| Framework | Express.js or Fastify | |
| Database | PostgreSQL or Supabase | Bookings, availability, cat profiles |
| Auth | None required (public booking form) | Admin panel may need auth later |
| Payments | Paystack (Nigeria-native) | Primary payment gateway for Lagos |
| Email | Resend or Nodemailer | Booking confirmations |

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
# Frontend
NEXT_PUBLIC_API_URL=

# Backend
DATABASE_URL=
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
RESEND_API_KEY=
PORT=
NODE_ENV=
```

---

## Deployment

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development | |
| Staging | Pre-launch testing | Mirror production data |
| Production | Live site | femiandifeomacatcafe.com |

Frontend: Vercel (recommended for Next.js)
Backend: Railway or Render
Database: Supabase or Neon (managed Postgres)
