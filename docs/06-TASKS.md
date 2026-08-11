# Fémi & Ifeoma Cat Café — Task Tracker

**Instructions for Claude:** Update this file after every completed task. Mark completed with ✅, in-progress with 🔄, blocked with ⛔, and not started with ⬜. Never work on two tasks simultaneously. Do not skip tasks within a phase.

---

## Phase 1 — Brand Foundation

- ✅ Install Let's Coogi font — self-hosted TTF, @font-face + token wired, verified via build
- ✅ Install Neue Haas Grotesk Display Pro font — self-hosted TTF (4 weights), @font-face + token wired, verified via build
- ✅ Install Cormorant Garamond font — loaded via `next/font/google` (self-hosted at build), `--font-editorial` token wired
- ✅ Install Knicknack font — self-hosted WOFF2, @font-face + token wired, verified via build
- ✅ Create brand colour tokens in `globals.css` — #F85E28, #3E6C61, #CCFCEE, #FFF0E9, #0C0C0C
- ✅ Apply tokens globally — body bg = cream, body text = near-black, orange corrected
- ✅ Verify: site renders in cream background (#FFF0E9)
- ✅ Font family tokens added — `--font-body`, `--font-display`, `--font-editorial`, `--font-playful` (three fall back to Poppins until licensed files land)

**Phase 1 Gate:** Colours ✅ · Editorial font ✅ · Display/body/playful fonts ✅

---

## Phase 2 — Global Components

- ✅ Navbar: increase logo size to 140px wide
- ✅ Navbar: remove orange block hover on links (colour-only transition)
- ✅ Navbar: solid cream background (glassmorphism/blur removed)
- ⬜ Navbar: pill CTA button (Book a Visit) — desktop right, mobile drawer bottom (added 2026-08-04, since removed from `Nav.tsx` — reinstate or retire)
- ✅ Navbar: mobile drawer menu (exists, colours corrected)
- ✅ Footer: dark (#0C0C0C) background
- ✅ Footer: white logo (160px, brightness-0 invert)
- ✅ Footer: tagline "Relax, Purr & Community" in orange
- ✅ Footer: four-column layout (brand / visit / explore / connect)
- ✅ Footer: link hover is colour-only (white or orange, no block)
- ✅ Hero: glassmorphism cards removed — replaced with clean brand copy
- ⬜ Button: primary (orange pill) — add as reusable component
- ⬜ Button: secondary (outlined pill)
- ⬜ Button: ghost (white outlined)
- ⬜ Typography: section label component
- ⬜ Typography: section heading component
- ⬜ Card: base card component (no glassmorphism)
- ⬜ Form: text input (rounded, orange focus)
- ⬜ Form: custom select dropdown

**Phase 2 Gate:** Navbar ✅ · Footer ✅ · Hero ✅ · Shared components ⬜

---

## Phase 3 — Pages

### Home Page
- ✅ Hero: glassmorphism cards removed
- ✅ Hero: on-brand headline — now "Where every moment purrs" in `--font-display` (Let's Coogi)
- ✅ Hero: brand photography (existing photo kept)
- ✅ Hero: CTAs removed — "Book a Visit" lives in the navbar and was not duplicated
- ⬜ Brand story section
- ✅ Moments at the Café gallery — supersedes "Meet our Cats" on the homepage (29 images, masonry + lightbox)
- ⬜ How it works / Booking preview
- ⬜ Testimonials section

### About Page
- ⬜ Brand story expanded
- ⬜ Team section
- ⬜ Mission and values

### Our Cats Page
- ⬜ Cat profile grid
- ⬜ Cat profile card component

### FAQs Page
- ⬜ Accordion component
- ⬜ Brand styling applied

### House Rules Page
- ⬜ Content in brand voice
- ⬜ On-brand typography

**Phase 3 Gate:** ✅ All pages complete and copy-reviewed.

---

## Phase 4 — Booking Flow

- ✅ Date picker (brand colours) — exists in `BookingFlow.tsx`, brand-styled
- ✅ Time slot selection (pill buttons) — exists in `BookingFlow.tsx`
- ✅ Booking form — exists in `BookingFlow.tsx`
- ✅ Confirmation / success page — exists in `BookingFlow.tsx`
- ✅ Payment integration styled — Paystack inline, styled with tokens
- ✅ Real plans wired in (5 plans from Kindly: PlayDate, Solo/Duo/Trio/VIP Group Pass) — added 2026-08-11 (DEC-013)
- ⬜ Backend: persist bookings to a real database (currently front-end only — Paystack succeeds but nothing is stored server-side)
- ⬜ Backend: booking confirmation email (Resend/Nodemailer, per `07-ARCHITECTURE.md`)
- ⬜ Availability: replace static Mon–Sat/all-time-slots-open logic with real capacity checks

**Phase 4 Gate:** ✅ Booking works end-to-end in staging environment (blocked on backend persistence above).

---

## Phase 6 — Membership & Retention (backend)

Added 2026-08-11 at the owner's request: every booking should auto-create a member so guests don't re-register to return or use the workspace, and so the café can retain guest data for email/campaigns. Schema designed in `12-BOOKING_MEMBERSHIP_SCHEMA.md` — no backend code yet.

- ✅ Design data model doc (`members`, `bookings`, `plans`, `visits` tables) — `12-BOOKING_MEMBERSHIP_SCHEMA.md`
- ⬜ Confirm open questions with owner (marketing opt-in default, workspace eligibility rules, email-optional guests, cancellation policy)
- ⬜ Stand up Postgres/Supabase instance
- ⬜ Implement `POST /api/bookings` to upsert `members` + insert `bookings` on Paystack webhook confirmation
- ⬜ Staff lookup screen for workspace check-ins (logs a `visits` row against an existing member)
- ⬜ Email/campaign export query or integration (Resend audience sync)

**Phase 6 Gate:** ✅ A booking creates/updates a member record end-to-end in staging; a returning member can be looked up by email or phone.

---

## Phase 5 — QA

- ⬜ Colour contrast audit (WCAG AA)
- ⬜ Keyboard navigation test
- ⬜ Alt text on all images
- ⬜ Semantic HTML audit
- ⬜ Mobile (375px) responsive test
- ⬜ Tablet (768px) responsive test
- ⬜ Desktop (1280px) responsive test
- ⬜ Lighthouse audit (target: 85+ mobile)
- ⬜ Images converted to WebP
- ⬜ Font preloading configured
- ⬜ Cross-browser: Chrome, Safari, Firefox, Edge
- ⬜ iOS Safari test
- ⬜ Brand consistency screenshot review
- ⬜ Copy review (brand voice + no placeholders)

**Phase 5 Gate:** ✅ Lighthouse 85+, no brand inconsistencies, no accessibility failures.

---

## Completed Tasks Log

| Task | Completed | Notes |
|---|---|---|
| Brand colour tokens (globals.css) | 2026-08-03 | Orange #F85E28, cream #FFF0E9, teal #3E6C61, mint #CCFCEE, black #0C0C0C |
| Apply tokens globally | 2026-08-03 | Body bg = cream, body text = near-black |
| Navbar: logo size → 140×46px | 2026-08-03 | Was 60px |
| Navbar: remove glassmorphism | 2026-08-03 | Removed backdrop-blur-xl and backdrop-blur-md |
| Navbar: link hover = colour only | 2026-08-03 | hover:text-orange, no block background |
| Footer: dark background #0C0C0C | 2026-08-03 | Was --sand (light cream) |
| Footer: white logo 160×52px | 2026-08-03 | brightness-0 invert on existing JPG |
| Footer: tagline in orange | 2026-08-03 | "Relax, Purr & Community" |
| Footer: link hover = colour only | 2026-08-03 | hover:text-white or hover:text-orange |
| Hero: removed glassmorphism cards | 2026-08-03 | Removed two backdrop-blur-2xl floating cards |
| Hero: brand headline + CTAs | 2026-08-03 | Pill buttons, info pills for hours/price/location |
| Cormorant Garamond font installed | 2026-08-04 | via next/font/google, --font-editorial token wired |
| Font tokens scaffolded | 2026-08-04 | --font-body, --font-display, --font-playful (fall back to Poppins until files arrive) |
| Body font token wired | 2026-08-04 | Changed from hardcoded Poppins to var(--font-body) |
| Navbar: CTA button added | 2026-08-04 | "Book a Visit" pill — desktop right, mobile drawer bottom |
| Let's Coogi font installed | 2026-08-06 | Self-hosted TTF (400), `--font-display` wired |
| Neue Haas Grotesk Display Pro installed | 2026-08-06 | Self-hosted TTF — Light 300, Roman 400, Medium 500, Bold 700. `--font-body` / `--font-sans` wired |
| Knicknack font installed | 2026-08-06 | Self-hosted WOFF2 — Regular 400, Bold 700. `--font-playful` wired |
| Moments at the Café gallery | 2026-08-07 | Replaced "Our Cats" on the homepage. Multi-column masonry + lightbox (DEC-011) |
| Hero simplified | 2026-08-07 | Both CTAs and body copy removed; tagline moved in and promoted to `<h1>` on `--font-display` |
| Gallery expansion — 20 photographs | 2026-08-07 | 21 HEIC supplied, one byte-identical duplicate skipped. Gallery 9 → 29 images |
| HEIC → WebP conversion pipeline | 2026-08-07 | `sips` PNG intermediate → `cwebp -q 82`. 1–3MB sources → 116–254KB (DEC-012) |
| Fix: converted images rotated 90° | 2026-08-07 | 19 portrait files re-run with `sips -r 90`; orientation now probed with `mdls`, not `sips -g` |
| Gallery aspect-ratio buckets reconciled | 2026-08-07 | 8 tall / 6 portrait / 5 square / 1 landscape, assigned from corrected 1200x1600 dimensions |
| Fix: five gallery tiles mis-cropped by `object-cover` | 2026-08-07 | Measured all 29 sources with PIL. Re-bucketed `WhatsApp…18.47.50.jpeg` and `IMG_5550.jpg` (landscape → tall), `about-photo.webp` (portrait → landscape), `IMG_5561.jpg` (square → tall), `E89AFD51…2.jpg` (tall → landscape). No image files touched — nothing was rotated |
