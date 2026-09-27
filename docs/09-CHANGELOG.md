# Fémi & Ifeoma Cat Café — Changelog

Track every meaningful change made during the branding migration. Claude should append to this file after completing each phase.

Format: `## [version or date] — [Phase/description]`

---

## [2026-09-26] — Booking card redesign; nav/footer alignment; Our Cats removed

**Booking card** — the service header and calendar were two separate boxes; they are now one card (white, 16px radius, 1px border, soft shadow).
- Header: round outline back button, a peach icon tile (laptop for Co-Work, cup for the café pass), plan name, and a friendly duration — **"Full day, 10 hours"** rather than "600 minutes @ ₦6,000". Guests moved into a pill stepper on the right, with min/max enforced by disabled buttons.
- Body: 57/43 split — calendar left, summary panel right on a grey ground with a left border; stacks to one column under `sm`.
- Calendar rewritten: month/year sentence case, round nav buttons with **previous disabled on the current month**, `Su Mo Tu…` labels, 40px circular day cells. Unavailable days are struck through rather than merely dimmed; today carries an inset orange ring; selected is solid orange. Every cell is a real `<button>` with a full-date `aria-label` and visible focus ring.
- Summary panel: empty state pulls opening hours from `site.hours` rather than hardcoding them. Selected state shows the date as "Saturday 26 September", the time window, a price line, and a pill Continue with an arrow.
- Hourly plans inject their time-slot list into the same panel a day pass uses for its fixed window, so one panel serves both plan shapes.
- All booking logic, data fetching, state and props unchanged. Dead code removed: the old `Calendar` (98 lines) and its now-orphaned `DAYS` / `MONTHS` / `toDateStr` helpers.

**Nav and footer aligned to the page.** Footer moved from `max-w-3xl` centred to `max-w-6xl px-6` with `justify-between`, matching the nav and the `About`/`ContentBlock` sections.

**Two project-rule violations found and fixed in the footer.** It imported `Logo` but never rendered it, so CLAUDE.md rule 7 ("use the white logo in the footer") had not held for some time — restored at 170px with `brightness-0 invert`. The brand tagline **"Relax, Purr & Community"** was absent from the entire codebase despite rule 7 and an earlier changelog entry claiming it shipped; added to `site.ts` as `brandTagline` (distinct from `tagline`, the positioning line) and rendered in orange beneath the logo.

**Our Cats page removed.** `/our-cats` deleted and dropped from the nav, which is now Home + Book Your Visit. `Cats.tsx` remains in the repo but is now unrendered.

**AGENTS.md** — added a Conventional Commits convention (`type: summary`, no scope, specific summaries, `BREAKING CHANGE:` footer), placed outside the generated `nextjs-agent-rules` markers so a regeneration cannot overwrite it.

Verified: build and lint clean (0 errors), `/` and `/book-your-visit` both 200, booking card renders both plans.

---

## [2026-09-26] — Navigation simplified; FAQs folded into the landing page

The site is essentially a single page with two real sub-pages, so the nav was carrying links that only scrolled you down the page you were already on.

- **Nav trimmed from six links to three** — Home, Book Your Visit, Our Cats. Removed "About Us" (`/#about`), "House Rules" (`/#rules`) and "FAQs". All three are homepage sections a visitor scrolls past anyway. Each section keeps its `id`, so existing deep links still resolve.
- **FAQs moved onto the landing page**, between House Rules and the footer. `/faqs` deleted — keeping both would have served identical content at two URLs, which search engines treat as duplication.
- **`ContentBlock`'s CTA is now optional.** The "What in the world is a cat café?" block used to link to `/faqs`; with the answers sitting directly below it on the same page, a button pointing away made no sense, and repointing it at booking would have put two identical CTAs in consecutive blocks. Its closing line changed from "Click below for answers..." to "Scroll on — we answer life's most pressing questions further down," so the copy matches what the page now does.

Verified: build and lint clean, `/` `/book-your-visit` `/our-cats` all 200, `/faqs` correctly 404, and the homepage renders moments → visit → about → rules → faqs → footer.

---

## [2026-09-26] — Full-site motion audit (improve-animations) and fixes

Audited all eight categories across every page. Findings vetted at their `file:line`, planned into `plans/001`–`005`, then executed.

**HIGH — fixed**
- **`transition: all`** in `Nav.tsx`, `Hero.tsx` (×3) and `ContentBlock.tsx` — transitioned unintended properties off the GPU. Now each names its properties.
- **Ungated `:hover` transforms** in `Hero.tsx` (×3), `Cats.tsx` (×2), `ContentBlock.tsx` (×2) and `Footer.tsx`. On touch, a tap fires a synthetic hover and the element **stayed lifted after the finger left**. All now route through pointer-gated `.hover-lift` / `.group-zoom` classes.
- **Reduced motion was zeroing everything** — `.reveal` and `.hero-animate` had `transition: none` / `animation: none`, so content popped in with no bridge at all. The standard is gentler, not zero: both now fade over 200ms with `transform: none`. Movement is what reduced motion asks us to drop, not feedback. The infinite loader sweep and the 28s Ken Burns stay fully disabled — correctly.

**MEDIUM — fixed**
- **Easing consolidated.** `cubic-bezier(0.22, 1, 0.36, 1)` was hand-typed in 9 places (including an unspaced variant) alongside the new `--ease-out`. Two imperceptibly different curves, neither authoritative. All now `var(--ease-out)`; zero literals remain.
- **Hover durations** of 700ms (`ContentBlock`) and 420/360ms (`Cats`) brought to 250ms — past ~300ms a hover reads as lag rather than response.

**Reported, not fixed**
- `Card.tsx` and the `Select` in `FormField.tsx` are **dead components** — nothing imports them. They carry the same `transition: all` and ungated-hover defects, but no user sees them. Worth deleting rather than fixing.
- `MomentsGallery.tsx` excluded at the owner's request. For the record it still has 500ms hover durations and ungated hover transforms.

Verified: build and lint clean, all four routes 200, and the pointer gates, consolidated tokens and reduced-motion fades confirmed in the CSS actually served.

---

## [2026-09-26] — Motion pass + booking pass-card redesign

Audited with Emil Kowalski's `find-animation-opportunities` skill, which gates every candidate on frequency, purpose, speed and function. Most candidates were rejected; the surviving ones were all the same defect — **state changing with no bridge**.

**Motion tokens** (`globals.css`) — one vocabulary: `--ease-out`, `--ease-in-out`, `--ease-drawer`, plus `--duration-press/collapse/step/drawer`. Durations sit at the unhurried end of each budget to match "calm over chaos"; nothing bounces.

**Implemented**
- **FAQ accordion** — answers teleported in/out via conditional render. Now `grid-template-rows: 0fr → 1fr` + opacity, 220ms. Always mounted (a transition needs both states); `aria-hidden` when closed. The +/− glyph swap became a single rotating `+`.
- **Booking step transitions** — the four steps swapped with no bridge. Forward drifts up, Back drifts down, 260ms.
- **Button press feedback** — `:active` scale(0.97) at 160ms, deliberately near-imperceptible for its frequency tier. Also fixed two standing violations: `transition-all` (now names its properties) and an **ungated `:hover` transform** (touch fired false hovers, leaving buttons stuck hovered).
- **Mobile nav drawer** — conditional render → collapse at 280ms on the iOS drawer curve, links staggered 30ms behind the panel. `inert` when closed.
- **House Rules** — whole list arrived at once; items now stagger 60ms via a new `.stagger-child` pattern (wrapping each `<li>` in `Reveal` would have put a `<div>` between `<ol>` and `<li>`).

**Rejected, with reasons** — stat counters (Delight is only permitted at the rare/first-time tier, not an occasional homepage section); route transitions (every approach adds real delay to navigation); nav scroll state and hero (already correct); **the gallery, left untouched at the owner's request** — it already had masonry, a lightbox and a scroll-driven per-tile stagger.

**PassCard** (`components/PassCard.tsx`) — new reusable component for the plan step, built to survive catalogue changes. 22px radius, soft shadow, no hard border; selection is a warm accent ring + tint + a checkmark badge scaling from 0.8 (never 0). Whole card is the control. Price is the heaviest element on the card; Continue uses the shared `Button` primary with a proper disabled state instead of a grey block that read as broken.

**Self-review fixed three of my own defects:** the plan step animated its container *and* staggered its cards, so both competed — the cards now carry the entrance alone; an `inert` type-cast hack was unnecessary on React 19; and Tailwind's arbitrary-variant syntax for compound media queries emitted invalid CSS (`(hover:hover)and(pointer:fine)`), which 500'd every page — replaced with plain `.hover-lift` / `.hover-grow` classes.

**Not built:** no discount/strike-through price. The "strikethrough" reported on the price is the **Naira sign** — `₦` is an N with two strokes through it. There is no discount in the data, and rendering one would display a price that does not exist.

Verified: build and lint clean; all four routes 200; motion tokens, the pointer gate and the reduced-motion variants confirmed present in the served CSS.

---

## [2026-09-26] — Two-plan catalogue, whole-day passes, and the capacity cap removed

**Plans cut to two (DEC-020)**
- **Solo Pass for the Cat Cafe** ₦30,000 · 60 min · per person
- **Co-Work Space** ₦6,000 · per person, per day · booked by date with no start time
- PlayDate, Duo, Trio and VIP Group Pass **deactivated, not deleted** — confirmed bookings reference them by foreign key. Verified: those bookings still resolve their plan names.

**Hours extended to 8 PM (DEC-020)** — hourly sessions now start 10:00 through 19:00 (was 10:00–16:00). Published hours updated in `site.ts`, `Hero.tsx`, `Footer.tsx`.

**Whole-day passes** — `bookingType = "workspace"` drives a separate path. `GET /availability?planId=` returns one all-day entry instead of hourly slots; bookings share an `"all-day"` sentinel in `time_slot`, so co-workers group into one per-day count with no schema change. The booking form skips the time picker and auto-selects the single option.

**Capacity cap removed (DEC-021)** — no more 409 `SLOT_FULL`; the Serializable transaction guarding it is gone with it. Counting is untouched: the staff day sheet still reports confirmed and pending guests per slot. Guests no longer see "4 of 6 left". `capacity`/`remaining` are omitted from responses rather than reported as meaningless numbers.

**Copy** — homepage body, booking-page metadata and the plans FAQ rewritten for the two-plan catalogue.

**Verified against the live database:** four bookings of 5 guests all accepted into a single 11:00 slot (20 total, previously rejected at 6), slot still reports `booked: 20, available: true`; Co-Work day pass books as `all-day` at ₦12,000 for two; both apps build and lint clean.

**Outstanding:** `Testimonials.tsx` quotes a "VIP Group Pass" customer and a "PlayDate regular" — retired plans. Left alone deliberately: these are attributed quotes, not marketing copy, so the owners should decide.

---

## [2026-09-26] — First live payment; three bugs found and fixed

The first real test payment (VIP Group Pass, ₦140,000, Paystack test mode) **succeeded on Paystack but was never recorded**, surfacing three distinct faults.

**1. Paystack Inline takes `ref`, not `reference`** — `BookingFlow.tsx`
Wiring the server-generated reference introduced `reference:` where the original code had `ref:`. Paystack doesn't error on an unknown key — it silently minted its own reference (`T303564008266689`), so verification looked up a transaction that had never existed. Fixed, with a comment so it isn't reintroduced.
The callback's own reference is now also sent to `POST /bookings/:id/verify` and treated as the authority, so a dropped reference can no longer strand a real payment.

**2. Any Paystack error was reported as a connectivity failure** — `payments.service.ts`
`fetchTransaction()` mapped every non-OK response to "Could not reach Paystack", so a 400 *"Transaction reference not found"* read as a network problem and sent the investigation the wrong way. Now: `fetch` throwing is unreachable, 5xx is unavailable-and-retryable, and 4xx surfaces Paystack's actual message.

**3. Neon cold starts failed requests outright** — new `prisma-retry.interceptor.ts`
Neon suspends an idle compute; the first query after that lost the race and threw `P1001`. This broke availability calls, which is why the calendar rendered with **every date disabled and no explanation**. A global interceptor now retries once on `P1001`/`P1002` only — codes that mean no connection was established, so no write can have landed and a retry cannot duplicate a booking.
The calendar also no longer fails silently: it shows the error with a "Try again" link, and a "Loading available dates…" line while the month is in flight.

**Reconciliation:** the stranded ₦140,000 booking was recovered through the fixed verify path — now `confirmed/paid` under Paystack's reference, with the member and visit rows created. Re-verifying does not double-count visits.

**Also:** `start:prod` ran `node dist/main` but `nest build` emits `dist/src/main.js` — production start would have failed on deploy. Fixed.

---

## [2026-09-24] — Booking backend: real persistence, per-slot capacity, verified payments

**Database (DEC-015)**

- Postgres host switched from Supabase to Neon. `schema.prisma` unchanged; `.env.example` rewritten with pooled `DATABASE_URL` + `DIRECT_URL`.

**Capacity tracking (DEC-016, DEC-017)**

- `backend/src/common/schedule.ts`: the seven time slots defined once, as canonical 24h keys (`"10:00"`) with separate display labels. Replaces the display strings that were previously written to the database.
- `backend/src/common/capacity.config.ts`: `SLOT_CAPACITY` (default 6 guests per slot) and `BOOKING_HOLD_MINUTES` (default 10).
- New `availability` module: `GET /availability?date=`, `GET /availability/month?year=&month=`, `GET /availability/slots`. Live per-slot `booked` / `remaining` / `available`.
- New `SlotClosure` model — close a whole day (`timeSlot = "*"`) or a single slot.
- `BookingStatus` gains `expired`; `Booking` gains `hold_expires_at` and a `(booking_date, time_slot)` index.
- `BookingsService.create()` rewritten: Serializable transaction around the capacity check + insert, one retry on write conflict, 409 `SLOT_FULL` when the slot can't fit the party. Rejects past dates, Sundays, closures, and PlayDate on a non-Wednesday.
- `POST /bookings/:id/release` frees seats on Paystack `onClose`; a 5-minute interval sweeps abandoned holds.

**Payments (DEC-018)**

- New `payments` module. `POST /payments/paystack/webhook` verifies `x-paystack-signature` (HMAC-SHA512 over the raw body, constant-time compare) — resolves the `TODO` that sat in `bookings.controller.ts`. `main.ts` now bootstraps with `rawBody: true`.
- `POST /bookings/:id/verify` calls Paystack's verify API server-side for the browser-callback path; idempotent with the webhook.
- The unauthenticated `POST /bookings/:id/confirm` is removed.
- **Fixed a live billing bug:** Duo/Trio/VIP Group Passes were `perPerson: true`, so a ₦58,000 Duo Pass booked for 2 charged ₦116,000. Corrected to `perPerson: false` in `site.ts` and `seed.ts`; fixed-size passes now force `partySize` to the plan's `guestCount`.
- Amounts and references are generated server-side; the browser no longer decides what to charge.

**Membership (DEC-019)**

- Guest details move onto the booking row; `member_id` is nullable. Members are created/updated only on confirmed payment, via one idempotent `confirmByReference()` shared by both confirmation paths.

**Email**

- New `email` module — Resend over plain `fetch`, no SDK dependency. Confirmation to the guest plus a copy to the café. No-ops with a warning when `RESEND_API_KEY` is unset; failures are logged and swallowed so a bounced email can never fail a paid booking.

**Staff tracking**

- `GET /admin/bookings?date=` — per-slot confirmed/pending guest counts, remaining capacity, guest list, and day revenue. Guarded by `x-admin-key` (placeholder until real admin auth).

**Frontend**

- New `frontend/src/lib/api.ts` — typed client with an `ApiError` that surfaces the 409.
- `BookingFlow.tsx` wired to the API: calendar greys out closed and fully-booked dates from `/availability/month`; slot pills show "4 of 6 left" / "Fully booked" and disable when the party won't fit; submitting reserves the seats *before* opening Paystack; a 409 bounces back to the slot picker with refreshed counts; the callback verifies server-side before showing the confirmation.
- Liability checkbox and its copy unchanged.
- `frontend/.env.example` added (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_PAYSTACK_KEY`).

**Verified against the live Neon database (2026-09-24)**

- Migration `20260924222120_capacity` applied; 5 plans seeded.
- Empty slot reports 6 of 6 free. A Trio Pass booking drops it to 3 — capacity counts guests, not bookings.
- Trio Pass charged ₦85,000, not ₦255,000 — confirms the `perPerson` fix.
- Filling a slot to 6 returns 409 `SLOT_FULL`; a Duo Pass is refused with 1 seat left while a Solo Pass fits.
- **Race test:** two simultaneous requests for the last seat → exactly one 201, one 409, slot lands on 6/6. The Serializable transaction holds.
- Seat holds: booking 4 seats drops remaining to 2; once the hold lapses the seats return automatically. `POST /bookings/:id/release` frees them immediately.
- Rejected as expected: Sundays, past dates, PlayDate on a non-Wednesday (and accepted on a Wednesday), a party of 8, and a display label (`"11:00 AM"`) where a slot key belongs.
- Webhook with a bad signature → 401. Admin day sheet → 503 with no key configured, 401 with a wrong key, correct per-slot guest list with the right key.
- Test data removed afterwards: 13 bookings deleted, 5 plans retained, no members or visits created.

**Also fixed:** `start:prod` ran `node dist/main`, but `nest build` emits to `dist/src/main.js` — production start would have failed on deploy. Corrected to `node dist/src/main`.

Not yet exercised: the Paystack payment leg (needs test keys) and confirmation email (needs `RESEND_API_KEY`).

---

## [2026-08-12] — Phase 2 & 3 complete: Shared components + homepage sections

**Phase 2 — all shared components built**

- `Nav.tsx`: "Book a Visit" pill CTA added — desktop right, mobile drawer bottom (uses `Button` component)
- `Button.tsx`: all three variants confirmed — primary (orange fill), secondary (outlined orange), ghost (white outlined); pill radius, no box shadows
- `Typography.tsx`: `DisplayTitle`, `SectionHeading`, `SectionLabel`, `BodyText` confirmed
- `Card.tsx`: new reusable base card — rounded-3xl, soft shadow, optional top image + label + heading; no glassmorphism
- `FormField.tsx`: `TextInput` (rounded-xl, orange focus ring) + custom `Select` (animated chevron, outside-click dismiss, orange active state)

**Phase 3 — homepage sections + all pages**

- `Booking.tsx` added to homepage (How it works / Booking preview) — dark-background teaser with plans and CTA
- `Testimonials.tsx` created — 3-card grid on cream, Cormorant Garamond blockquotes, avatar initials
- `About.tsx` expanded — brand story paragraphs, stats grid, mission & values (3-col), founder/team blurb
- Our Cats page, FAQs page confirmed complete; HouseRules and About are homepage anchor sections (`#about`, `#rules`) per nav

Verified: `npm run build` clean (0 errors).

---

## [2026-08-11] — Repo Split into frontend/ + backend/, NestJS Backend Scaffolded

**Monorepo restructure (DEC-014)**

- Moved the entire existing Next.js app — `src/`, `public/`, `package.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `README.md` — into `frontend/` via `git mv` (renames preserved in git history)
- Rewrote root `.gitignore` with `**/`-prefixed patterns so one file covers both `frontend/` and `backend/` (node_modules, build output, `.env*`, tsbuildinfo)
- Verified `frontend/` still builds cleanly from its new location: `npm run lint` → 0 errors, 5 baseline warnings; `npx tsc --noEmit` → clean

**New `backend/` — NestJS + Prisma + Supabase Postgres**

- Framework, database, and repo-wiring options (Express/Fastify, Supabase/Neon, npm workspaces/plain split) were presented with pros/cons; the owner chose NestJS, Supabase, and a plain two-folder split (DEC-014)
- `prisma/schema.prisma` mirrors `12-BOOKING_MEMBERSHIP_SCHEMA.md`: `Plan`, `Member`, `Booking`, `Visit` models
- Modules: `plans` (read), `members` (lookup, marketing export, the `upsertOnVisit` method that implements "booking creates membership"), `bookings` (create pending → confirm on payment, which is what actually triggers the member upsert + a `visits` row), `visits` (workspace check-in for an existing member, no new booking required)
- `prisma/seed.ts` loads the same 5 plans as `frontend/src/lib/site.ts` — the two are manually kept in sync until the frontend fetches from `GET /plans` instead of hardcoding
- `.env.example` documents `DATABASE_URL` (Supabase), `PAYSTACK_SECRET_KEY`, `PORT`, `CORS_ORIGINS`

**Known gaps (flagged in `backend/README.md` and `06-TASKS.md` Phase 6, not yet built)**

- No Paystack webhook signature verification yet — `POST /bookings/:id/confirm` trusts its payload
- No auth on `/members/lookup` or `/members/marketing-export`
- No availability/capacity checking on booking creation
- Frontend `BookingFlow.tsx` still only talks to Paystack directly — not yet wired to call the new backend

Verified: `npm install` succeeds in `backend/`; `npx nest build` and `npx eslint "src/**/*.ts"` both clean. `npx prisma generate` could **not** be verified in this sandbox — outbound access to `binaries.prisma.sh` (Prisma's engine download host) is blocked here. Run `npm install && npx prisma generate` in a normal environment before first use.

---

## [2026-08-11] — Phase 4 kickoff: Real Plans Wired into Booking Flow

**Five standing plans added, sourced from the Kindly booking page**

- Added a typed `Plan[]` to `site.ts` (`plans`): PlayDate (90 min, ₦10,000pp, every Wednesday), Solo Pass (60 min, ₦30,000pp), Duo Pass (60 min, ₦58,000pp, 2 guests), Trio Pass (60 min, ₦85,000pp, 3 guests), VIP Group Pass (60 min, ₦140,000pp, 5 guests) — copied from `app.kindlybook.com/book-business/femiandifeoma`
- Deliberately excluded the "Sip & Paint" / "Sip & Paint (Duo Pass)" listings — those are a dated, one-off International Cat Day event (Sat 8 Aug), not a standing plan (see DEC-013)
- Added `plansFromPrice` (lowest per-person price) for "From ₦X" copy across the site

**`BookingFlow` (on `/book-your-visit`) — new plan-picker step**

- Replaced the old single hardcoded `SESSION` (fixed ₦30,000/60 min) with a new first step listing all five plans as selectable cards
- Date/time, guest details, and Paystack payment steps now read price and duration from the selected plan instead of a hardcoded constant
- "Book Another Visit" on the confirmation screen resets back to the plan step, not a stale "select" step

**Homepage `Booking` teaser and copy updated**

- Headline price replaced with "From ₦10,000" plus a row of plan-name chips
- "Book Your Visit" CTA now points at the internal `/book-your-visit` flow (which has the real plans + Paystack) instead of linking out to Kindly externally (see DEC-013)
- FAQ answer, hero booking blurb, and `/book-your-visit` page metadata updated from the single fixed price to plan-aware copy

**New doc: booking & membership data model (design only)**

- Added `12-BOOKING_MEMBERSHIP_SCHEMA.md` — Postgres schema for `plans`, `members`, `bookings`, `visits`. A confirmed booking auto-creates/updates a `members` row (matched by email) so guests don't re-register to return or to use the workspace. No backend code yet — tracked as a new Phase 4/6 task.

Verified: `npm run lint` and `npm run build`.

---

## [2026-08-07] — Gallery Expansion: 20 New Photographs (HEIC → WebP)

**Gallery grows from 9 to 29 images**

- Client supplied 21 iPhone `.HEIC` files. `IMG_6785 (1).HEIC` is byte-identical to `IMG_6785.HEIC` (both 1,704,123 bytes) and was skipped, so 20 unique photographs were added
- All 20 converted to WebP before entering the repo — HEIC cannot be decoded by Chrome, Firefox or Edge, so it cannot be referenced from a `src` attribute. Pipeline: `sips -s format png` (lossless intermediate) → `cwebp -q 82 -resize 0 1600`. Sources were 1–3MB each; the WebP derivatives are 116–254KB (see DEC-012)
- The 9 original tiles are untouched. `step()` in the lightbox wraps modulo `images.length`, so keyboard and arrow navigation picked up all 29 with no change

**Fix: converted images shipped rotated 90° counter-clockwise**

- `sips`'s HEIC decode silently drops the EXIF rotation flag, and `sips -g orientation` returns `<nil>` for these files. 19 portrait photographs were therefore emitted as landscape pixel data lying on their side
- Corrected with `sips -r 90` inserted between the PNG and WebP steps, and the resize axis changed from `-resize 1600 0` (caps width — the *short* edge on a portrait source) to `-resize 0 1600` (caps the long edge)
- Orientation is now probed with `mdls -name kMDItemOrientation -raw` plus `kMDItemPixelWidth` / `kMDItemPixelHeight`, which reports the display orientation Finder itself uses. It found 19 portrait against one genuine landscape (`IMG_6118`)
- Verified on disk: all 19 corrected files measure 1200x1600; `IMG_6118` remains 1600x1200

**Aspect-ratio buckets reconciled to the corrected dimensions**

- Tiles crop with `object-cover`, so a portrait photograph typed `landscape` is hard-cropped rather than distorted. The initial 7 landscape / 6 portrait / 7 square distribution was assigned from the rotated dimensions and would have cropped almost every new tile
- Redistributed to 8 `tall` / 6 `portrait` / 5 `square` / 1 `landscape`. The corrected files are exactly 3:4, so `tall` is the zero-crop bucket; `landscape` (4/3) is now reserved solely for `IMG_6118`
- Heights still vary across the three columns, so the masonry packs without gaps per DEC-011

**Known compromises**

- Alt text is truthful café-context description rather than per-photograph detail. Worth a pass with the photographs open
- The original `.HEIC` files (~30MB) remain in `public/uploads/` and would deploy as dead weight. They should be moved outside the served directory

Verified: `npm run lint` → 0 errors, 5 warnings (baseline match). `npm run build` → TypeScript passes, 8/8 static pages generated.

---

## [2026-08-07] — Phase 3: Moments Gallery + Hero Simplification

**New: `MomentsGallery` replaces the "Our Cats" section on the homepage**

- Photography-led section titled "Moments at the Café" — tells the café's story rather than profiling individual cats
- Responsive CSS multi-column masonry (1 / 2 / 3 columns) with `break-inside-avoid`; tiles flow down each column so varied heights pack without gaps (see DEC-011)
- Nine images across four aspect ratios (`3/4`, `4/5`, `1/1`, `4/3`) so column heights vary organically
- 24px radii, `--shadow-md` resting → `--shadow-lift` on hover, `-translate-y-1` lift, `scale-[1.04]` image zoom
- Staggered scroll reveal via `Reveal` (`delayMs` keyed to column index)
- All tiles lazy-loaded through `FadeImage`
- Lightbox: `role="dialog"` + `aria-modal`, Escape / ← / → keyboard nav, body scroll-lock with previous-overflow restore, image counter. No glassmorphism on the controls (DEC-003)

**Hero simplified**

- Removed both hero CTAs ("Meet the Cats", "Our Story") — "Book a Visit" already lives in the navbar and was not duplicated
- Removed the hero body copy ("Where coffee, cats and calm come together." / "Escape the noise…")
- Moved the paw icon, "Where every moment purrs." and "Relax, Purr & Community 😻" into the hero's left column, in the slot the body copy vacated. The standalone white tagline section below the hero was deleted
- The tagline is now the hero's primary heading, so it was promoted `<h2>` → `<h1>` (verified: no other `<h1>` on the homepage). Left-aligned on cream — the old section's `text-center` and `bg-white` were dropped
- Tagline set in `--font-display` (Let's Coogi) at 30/34px weight 400 so the script face reads cleanly. Subtext stays on `--font-body` for legibility at 15px
- Hero now carries wordmark, tagline, three info cards (hours / location / session), lifestyle photo, and the bottom wave only

**Fixes**

- `Nav.tsx` logo now uses `next/link` instead of a bare `<a href="/">`, clearing the `@next/next/no-html-link-for-pages` lint error
- Added the missing `--shadow-sm` / `--shadow-md` / `--shadow-lg` tokens (documented but absent from `globals.css`) plus `--shadow-lift`

Verified: `npm run lint` → 0 errors, 5 warnings (all pre-existing or intentional `<img>` usage). `npm run build` → TypeScript passes, 8/8 static pages generated.

---

## [2026-08-04] — Phase 1: Typography System Complete

- Installed Cormorant Garamond via `next/font/google` (self-hosted at build time)
- Wired `--font-editorial` token to Cormorant Garamond with serif fallbacks
- Added `--font-body`, `--font-display`, `--font-playful` tokens (fall back to Poppins until commercial font files arrive)
- Changed body font-family from hardcoded Poppins to `var(--font-body)` token
- Created `public/fonts/` directory with README.md documenting installation steps for Let's Coogi, Neue Haas Grotesk Display Pro, and Knicknack
- Build verified: TypeScript passes, production build successful

Phase 1 status: **Colours ✅ · Editorial font ✅ · Display/body/playful fonts awaiting licensed files**

---

## [2026-08-06] — Phase 1: Brand Fonts Installed (Unblocked)

- Licensed font files received and self-hosted from `public/fonts/`
- **Let's Coogi** — TTF, Regular 400. `--font-display` now resolves to the real face
- **Neue Haas Grotesk Display Pro** — TTF, Light 300 / Roman 400 / Medium 500 / Bold 700. `--font-body` and `--font-sans` now resolve to the real face
- **Knicknack** — WOFF2, Regular 400 / Bold 700. `--font-playful` now resolves to the real face
- All faces declared with `font-display: swap` to avoid FOIT
- Poppins fallback no longer relied on for brand typography
- Rewrote `public/fonts/README.md` from installation instructions to installed-state reference
- Build verified: TypeScript passes, production build successful
- Noted for Phase 5: Let's Coogi and Neue Haas are TTF (~100KB per weight) — convert to WOFF2 alongside font preloading

Phase 1 status: **Colours ✅ · All four fonts ✅ — Phase 1 gate cleared**

---

## [2026-08-04] — Phase 2: Navbar CTA Button

- Added "Book a Visit" pill CTA to navbar, right-aligned on desktop (`lg:` and up)
- Added matching CTA to the bottom of the mobile drawer, closes drawer on tap
- Styled per 03-COMPONENT_GUIDELINES.md primary button spec: orange fill, white semibold uppercase text, full pill radius, `brightness-90` + `scale(1.02)` on hover
- Completes the navbar structure from the guidelines: logo left · links centre · CTA right

---

## [2026-08-03] — Phase 1 & 2 Partial: Brand Colour Tune-up

- Updated `globals.css`: correct brand tokens (#F85E28, #FFF0E9, #3E6C61, #CCFCEE, #0C0C0C)
- Fixed body background from white → cream #FFF0E9
- Fixed body text from --brick (#b03825) → near-black #0C0C0C
- Removed glassmorphism from Navbar (backdrop-blur-xl/md gone)
- Navbar logo increased from 60px → 140×46px
- Navbar link hover corrected to colour-only (orange)
- Footer background changed from --sand → #0C0C0C near-black
- Footer logo: white (brightness-0 invert), 160×52px
- Footer tagline "Relax, Purr & Community" added in orange
- Footer link hover corrected to colour-only (white/orange, no block)
- Hero: removed two glassmorphism floating cards (backdrop-blur-2xl)
- Hero: replaced with text-based hero — brand headline, pill CTAs, info pills

---

## [2024-08-03] — Documentation Created

- Created `01-BRAND_SUMMARY.md` — full brand overview extracted from brand guide
- Created `02-DESIGN_TOKENS.md` — complete CSS variable system
- Created `03-COMPONENT_GUIDELINES.md` — per-component brand rules
- Created `04-UI_AUDIT.md` — current site vs brand guide, action items
- Created `05-IMPLEMENTATION_PLAN.md` — phased roadmap
- Created `06-TASKS.md` — living task checklist
- Created `07-ARCHITECTURE.md` — frontend/backend structure
- Created `08-DECISIONS.md` — decision log (7 decisions recorded)
- Created `09-CHANGELOG.md` — this file
- Created `10-CLAUDE_PROMPT.md` — Claude system prompt for project
- Created `11-PROJECT_SPEC.md` — product requirements document

---

_Append future changes below:_

```
## [YYYY-MM-DD] — Phase 1: Brand Foundation
- Installed fonts: Let's Coogi, Neue Haas Grotesk, Cormorant Garamond, Knicknack
- Created tokens.css with full CSS variable system
- Updated body background to #FFF0E9
- Removed all hardcoded colour values

## [YYYY-MM-DD] — Phase 2: Global Components
- Rebuilt Navbar with correct logo size and hover states
- Rebuilt Footer with dark background and white logo
- Created Button component (primary, secondary, ghost)
- Created Card component (no glassmorphism)
- Created Input and Select components

## [YYYY-MM-DD] — Phase 3: Pages
- (Log each page as completed)

## [YYYY-MM-DD] — Phase 4: Booking Flow
- (Log booking components)

## [YYYY-MM-DD] — Phase 5: QA
- Lighthouse score: [X]/100 mobile, [X]/100 desktop
- All WCAG AA contrast checks passed
- Cross-browser: Chrome ✅, Safari ✅, Firefox ✅, Edge ✅, iOS Safari ✅
```
