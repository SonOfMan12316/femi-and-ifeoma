# Fémi & Ifeoma Cat Café — Decision Log

This file records all significant design and engineering decisions made during the project. When a decision is made, add it here with the date, rationale, and status. This prevents revisiting the same question twice.

---

## Format

```
### DEC-XXX — [Short title]
Date: YYYY-MM-DD
Status: Accepted | Proposed | Superseded | Rejected
Decision: [What was decided]
Rationale: [Why]
Alternatives considered: [What else was on the table]
Impact: [What this affects]
```

---

## Decisions

### DEC-001 — Use CSS Custom Properties for All Design Tokens
Date: 2024-08-03
Status: Accepted
Decision: All colours, fonts, spacing, radii, and shadows are stored as CSS variables in a single `tokens.css` file at `:root`.
Rationale: Brand colours may change or need seasonal updates. CSS variables make this a one-line change rather than a find-and-replace across the codebase. Also makes theming (e.g. dark mode) straightforward in future.
Alternatives considered: Hardcoding values directly, using a JS theme object only.
Impact: All components must reference tokens, never hardcoded values.

---

### DEC-002 — Self-Host Brand Fonts
Date: 2024-08-03
Status: Accepted
Decision: Let's Coogi, Neue Haas Grotesk, Cormorant Garamond, and Knicknack are self-hosted via `@font-face` in `/public/fonts/`.
Rationale: These fonts are not available on Google Fonts. Relying on CDNs adds latency and a potential failure point. Self-hosting gives full control over font-display, subsetting, and preloading.
Alternatives considered: Loading from Adobe Fonts CDN (requires paid subscription and external dependency).
Impact: Font files must be included in repo. Legal font licensing must be confirmed for each typeface.

---

### DEC-003 — Remove All Glassmorphism from UI
Date: 2024-08-03
Status: Accepted
Decision: No `backdrop-filter: blur()`, frosted glass effects, or semi-transparent cards overlaid on images. Specifically removes the floating glassmorphism cards (hours, "First cat café in Lagos") from the hero section.
Rationale: Glassmorphism is not in the brand guide. It is a trend that conflicts with the warm, intentional, editorial identity. The brand guide uses solid colour blocks, not glass effects.
Alternatives considered: Keeping subtle blur on hero overlays.
Impact: Hero redesign required. Information previously in glassmorphism cards should move to a dedicated section below.

---

### DEC-004 — Orange on Hover = Colour Only, No Block Background
Date: 2024-08-03
Status: Accepted
Decision: Hover states on navigation links and footer links change the text colour to `var(--color-orange)` only. No orange background block or highlight appears.
Rationale: The orange block hover is visually aggressive and uncharacteristic of the brand's warmth. The brand guide shows no such effect on any navigation component.
Alternatives considered: Keeping orange highlight, adding underline animation instead.
Impact: All nav link and footer link hover states must be audited and updated.

---

### DEC-005 — Paystack as Payment Gateway
Date: 2024-08-03
Status: Proposed (confirm with client)
Decision: Use Paystack for all payment processing.
Rationale: Paystack is the dominant payment gateway in Nigeria with the best UX for local users, support for Nigerian bank accounts, USSD payments, and mobile money.
Alternatives considered: Stripe (poor support for Nigerian cards), Flutterwave (viable alternative — confirm client preference).
Impact: Backend requires Paystack SDK and webhook handling.

---

### DEC-006 — Footer Background is Near-Black, Not Pure Black
Date: 2024-08-03
Status: Accepted
Decision: Footer uses `#0C0C0C` (near-black from brand palette), not `#000000`.
Rationale: Brand guide explicitly specifies `#0C0C0C` as the dark colour. Pure black feels harsher and less on-brand.
Alternatives considered: Dark teal footer (`#3E6C61`).
Impact: Footer background token set to `--color-black: #0C0C0C`.

---

### DEC-007 — Logo Must Always Include "CAT CAFÉ" Subtitle
Date: 2024-08-03
Status: Accepted
Decision: The full logo wordmark (Fémi & Ifeoma + CAT CAFÉ) is used in the navbar and footer. The icon-only oval paw badge may be used as a favicon or small avatar.
Rationale: The café name alone does not communicate what the business is. The "CAT CAFÉ" subtitle is part of the brand identity and necessary for first-time visitors.
Alternatives considered: Using icon-only in navbar on mobile (acceptable as a fallback if viewport too narrow, but full wordmark preferred on desktop).
Impact: Logo SVG file must include subtitle. Minimum width in navbar: 140px.

---

### DEC-008 — Cormorant Garamond via next/font/google, Not Manual @font-face
Date: 2026-08-04
Status: Accepted
Decision: Cormorant Garamond is loaded through `next/font/google` rather than downloading the files into `/public/fonts/` with a hand-written `@font-face` block.
Rationale: `next/font/google` downloads the font at build time and serves it from our own origin, so it satisfies the self-hosting requirement of DEC-002 — there is no runtime request to Google. It additionally gives automatic subsetting, `size-adjust` fallback metrics to prevent layout shift, and preload hints for free. Verified in the build output: the compiled CSS resolves to `--font-cormorant:"Cormorant Garamond", "Cormorant Garamond Fallback"` with local woff2 files and `font-display: swap`.
Alternatives considered: Downloading woff2 files manually into `/public/fonts/` (more control over subsetting, but loses automatic fallback metrics and requires maintaining the `@font-face` block by hand). The three commercial fonts still require this manual route since they are not on Google Fonts.
Impact: DEC-002 should be read as "served from our own origin", not "files committed to the repo". Only Let's Coogi, Neue Haas Grotesk Display Pro, and Knicknack need files in `/public/fonts/`.

---

### DEC-009 — Unavailable Commercial Fonts Fall Back to Poppins
Date: 2026-08-04
Status: Accepted
Decision: `--font-display`, `--font-body`, and `--font-playful` are defined now and resolve to Poppins (the font already loaded in the project) until the licensed files are delivered. The token names do not change when the real fonts land — only the value on the right-hand side does.
Rationale: Components being built in Phase 2 and 3 need font tokens to reference today. The alternative — components hardcoding Poppins directly — would mean auditing and rewriting every component when the licensed fonts arrive, which is exactly the find-and-replace problem DEC-001 exists to prevent. Defining the tokens up front makes font installation a three-line change in `globals.css`.
Alternatives considered: Leaving the tokens undefined until the files arrive (blocks Phase 2 component work, or invites hardcoding). Substituting a closer free lookalike per font (adds a second migration later, and a wrong-but-plausible typeface is harder to spot than an obviously-provisional one).
Impact: The site is intentionally off-brand typographically until the font files are supplied. This is visible and expected, not a bug. Components must reference the tokens, never Poppins directly. Phase 1 cannot fully close until the files are delivered — tracked as ⛔ in `06-TASKS.md`, with installation steps in `public/fonts/README.md`.

---

### DEC-010 — Section Labels Use 0.22em Tracking
Date: 2026-08-06
Status: Accepted
Decision: The small uppercase eyebrow label above each section heading uses `--tracking-label: 0.22em`, exposed as a token in `globals.css`.
Rationale: The value was already established by the sections built in Phase 2 and was being repeated as a magic number in each component. Promoting it to a token keeps every eyebrow optically identical and makes a future adjustment one line. Recorded retroactively — `globals.css` referenced this decision number before the entry existed.
Alternatives considered: Leaving the value inline per component (drifts over time), or folding it into Tailwind's `tracking-widest` (0.1em — visibly too tight for 11px uppercase text).
Impact: Section eyebrows reference `--tracking-label`. Existing components using a literal `0.22em` are correct but should migrate to the token when touched.

---

### DEC-011 — Gallery Uses CSS Multi-Column Masonry, Not Grid Spans
Date: 2026-08-07
Status: Accepted
Decision: `MomentsGallery` lays out with CSS multi-column (`columns-1 sm:columns-2 lg:columns-3` plus `break-inside-avoid`) rather than CSS Grid with row spans.
Rationale: The brief required varied image heights that fill space with no awkward gaps. Grid with `grid-auto-flow: dense` and per-tile row spans was tried first and left visible holes wherever a tall tile could not be back-filled — grid rows are shared across columns, so one tall tile pushes its whole row. Multi-column flows tiles independently down each column, so heights pack naturally. True CSS `grid-template-rows: masonry` is not yet broadly supported, and a JS masonry library would add a dependency and a layout-shift-on-load problem for a purely presentational need.
Alternatives considered: CSS Grid with dense auto-flow and row spans (rejected — gaps). A JS masonry library such as Masonry or react-masonry-css (rejected — dependency weight, reflow after images load). A fixed uniform grid (rejected — the brief explicitly wants organic, varied sizing).
Impact: Tiles must set their aspect ratio individually and carry `break-inside-avoid`. Reading order runs down each column rather than across rows, which is acceptable for a gallery where no tile depends on its neighbour. Column count changes at the `sm` and `lg` breakpoints only.

---

### DEC-012 — Gallery Photography Converted HEIC → WebP, with `mdls` as the Orientation Probe
Date: 2026-08-07
Status: Accepted
Decision: iPhone HEIC photography is converted to WebP before it enters the repo, via `sips -s format png` (lossless intermediate) → `sips -r 90` where rotation is required → `cwebp -q 82 -resize 0 1600`. The true display orientation of a source file is read with `mdls -name kMDItemOrientation -raw` plus `kMDItemPixelWidth` / `kMDItemPixelHeight`, never with `sips -g orientation`.
Rationale: HEIC has no browser support outside Safari — Chrome, Firefox and Edge cannot decode it, so a HEIC file cannot be referenced from a `src` attribute at all. Sources were also 1–3MB each; WebP at q82 brings them to 116–254KB. The orientation rule was learned the hard way: `sips -g orientation` returns `<nil>` for these files and `sips`'s HEIC decode silently drops the EXIF rotation flag, so 19 portrait photos were emitted as landscape pixel data rotated 90° counter-clockwise and shipped to the gallery on their side. `mdls` reads the display orientation Finder itself uses and correctly reported 19 portrait (`orient=1`) against one genuine landscape (`orient=0`, `IMG_6118`). The resize axis matters for the same reason: `-resize 1600 0` caps width, which for a portrait source caps the *short* edge; `-resize 0 1600` caps the long edge.
Alternatives considered: Referencing HEIC directly (rejected — unsupported in every browser but Safari). Converting to JPEG (rejected — larger at equal quality, and a JPEG intermediate would have made the pipeline double-lossy). ImageMagick or sharp (neither installed on this machine). Trusting `sips -g orientation` (rejected — demonstrably returns `<nil>` and produced the rotation bug).
Impact: Only WebP derivatives are referenced from components. Aspect-ratio buckets in `MomentsGallery` must be assigned from the *corrected* dimensions — tiles crop with `object-cover`, so a portrait image typed `landscape` is hard-cropped rather than distorted. The 19 corrected files are 1200x1600 (exactly 3:4, so `tall` is the zero-crop bucket); `IMG_6118` is 1600x1200. The original `.HEIC` files remain in `public/uploads/` (~30MB) and should be moved out of the deployed directory.

---

### DEC-013 — Real Plans Replace Single Fixed Price; Internal Booking Flow Is the Primary CTA
Date: 2026-08-11
Status: Accepted
Decision: The site's booking surfaces (`Booking.tsx` homepage teaser and `/book-your-visit`) now use five standing plans copied from the Kindly booking page (PlayDate, Solo Pass, Duo Pass, Trio Pass, VIP Group Pass) instead of one fixed ₦30,000/60-minute price. The "Sip & Paint" event passes on Kindly are excluded — they're a dated, one-off International Cat Day promotion, not a standing plan. The homepage "Book Your Visit" CTA now links to the internal `/book-your-visit` flow (custom calendar + Paystack) instead of out to the external Kindly link.
Rationale: The owner asked to bring the Kindly plans into the site and "kick off the booking flow" — i.e. build toward the custom Phase 4 flow rather than depending on an external booking tool long-term. Sending the primary CTA to the internal flow (which now has real plans and pricing) rather than an external site keeps the guest on-brand and lets the eventual membership/retention system (see `12-BOOKING_MEMBERSHIP_SCHEMA.md`) capture every booking — an external Kindly booking would not.
Alternatives considered: Keeping the external Kindly link as the CTA and only listing plan names as reference copy (rejected — defeats the purpose of building an in-house booking + membership system). Including the Sip & Paint passes as standing plans (rejected — they're explicitly dated to one Saturday and would mislead guests booking weeks out).
Impact: `site.ts` gains a `plans` array and `plansFromPrice`; `site.bookingUrl` is no longer referenced from the homepage CTA (still defined, in case it's needed elsewhere). `BookingFlow.tsx` gains a plan-selection step before date/time. Any future plan changes should be made in `site.ts` until the backend in `12-BOOKING_MEMBERSHIP_SCHEMA.md` exists, at which point `plans` should be fetched from the database instead of hardcoded.

---

### DEC-014 — Backend Stack: NestJS + Prisma + Supabase Postgres, Plain Two-Folder Monorepo
Date: 2026-08-11
Status: Accepted — database choice superseded by DEC-015 (Supabase → Neon); framework and repo layout still stand
Decision: The repo is split into `frontend/` (existing Next.js app, moved as-is) and `backend/` (new NestJS API), as two fully independent codebases — no npm workspaces, no shared root `package.json`, no shared tooling. The backend uses NestJS as the framework, Prisma as the ORM, and Supabase Postgres as the database.
Rationale: The owner asked explicitly for (1) the backend to not live inside the Next.js app's folder structure, (2) no MongoDB, (3) something free/low-cost to run and genuinely scalable rather than a quick prototype, and (4) to be presented options with pros/cons rather than have a stack silently chosen. Framework, database, and repo-wiring options were presented; the owner chose NestJS, Supabase, and a plain two-folder split (not npm workspaces) directly.
Alternatives considered (presented to the owner):
  - **Framework:** Express (more standard, larger community, more boilerplate for validation) and Fastify (faster, built-in schema validation, smaller community) were offered alongside NestJS. NestJS itself brings structure (modules/DI) similar to what a growing booking + membership system needs, and was the owner's explicit pick over the two presented options.
  - **Database:** Neon (true scale-to-zero serverless Postgres, no bundled extras) was offered alongside Supabase (500MB/50k MAU free tier, bundled auth + storage for a future admin panel, pauses after 1 week idle). Supabase was chosen for the bundled auth/storage headroom.
  - **Repo wiring:** npm workspaces (shared root install, shared types package) was offered alongside a plain two-folder split. The owner chose the plain split — simpler mental model, fully independent deploys, at the cost of the `Plan` shape currently being duplicated between `frontend/src/lib/site.ts` and `backend/prisma/seed.ts` until the frontend is wired to fetch from the API.
Impact: `package.json`, `src/`, `public/`, and all Next.js config moved from repo root into `frontend/`. `.gitignore` rewritten to cover both folders with `**/` patterns. New `backend/` scaffolded: NestJS modules for `plans`, `members`, `bookings`, `visits` implementing the flow in `12-BOOKING_MEMBERSHIP_SCHEMA.md`; Prisma schema mirrors that doc's SQL. Verified: `backend` installs, lints clean, and `nest build` succeeds in this environment. `npx prisma generate` could not be verified here — the sandbox cannot reach `binaries.prisma.sh` to download the query engine — so run `npm install && npx prisma generate` in a normal environment before first use.

---

### DEC-015 — Neon Replaces Supabase as the Postgres Host
Date: 2026-09-24
Status: Accepted (supersedes the database half of DEC-014)
Decision: The backend's Postgres is hosted on Neon, not Supabase. `schema.prisma` is unchanged — it was already `provider = "postgresql"` — so the switch is two environment variables (`DATABASE_URL` pooled, `DIRECT_URL` for migrations).
Rationale: Setting Supabase up produced connection errors before a single migration ran; its free tier routes through a transaction-mode pooler on an IPv4 shim that interacts badly with Prisma's migration engine, and the project pauses after a week idle. Neon was already the runner-up in DEC-014 and was rejected then only for Supabase's bundled auth/storage — neither of which is used by anything built so far. MongoDB was reconsidered at the owner's suggestion and rejected: the per-slot capacity rule depends on counting seats and inserting a booking atomically, which Postgres gives via a Serializable transaction and Mongo would require hand-rolled atomic counters to approximate.
Alternatives considered: Staying on Supabase and debugging the pooler (rejected — the bundled features that justified it are unused). MongoDB Atlas with Prisma's mongodb provider (rejected — loses relational constraints and transactional capacity checks; would require rewriting the schema and all four service modules). MongoDB with Mongoose (rejected — same, plus discarding the working Prisma layer).
Impact: `.env.example` rewritten for Neon. `07-ARCHITECTURE.md` and `12-BOOKING_MEMBERSHIP_SCHEMA.md` no longer reference Supabase. If a future admin panel needs hosted auth, it will need its own provider rather than inheriting Supabase's — an accepted trade, since admin auth is still an open task.

---

### DEC-016 — Slot Capacity Is Six Guests, Counted as the Sum of Party Sizes
Date: 2026-09-24
Status: Accepted
Decision: Each time slot holds a maximum of six guests. Capacity is consumed by the *sum of party sizes*, not the number of bookings — one Trio Pass takes three of the six. The cap is read from `SLOT_CAPACITY` (default 6), and the seven slots are defined once in `backend/src/common/schedule.ts` as canonical 24h keys (`"10:00"`…`"16:00"`) with separate display labels.
Rationale: The owners set six per day as the limit, clarified as six guests per time slot. Counting bookings instead of guests would let six Duo Passes put twelve people in a room sized for six. Canonical keys matter because the previous code stored the display string (`"11:00 AM"`) in the database — changing a label would have orphaned every existing booking.
Alternatives considered: Six bookings per slot regardless of party size (rejected — doesn't bound the room). A day-wide cap of six (rejected — would cap the café at six guests across all seven slots). A per-slot capacity column on a `slots` table (deferred — a single env-backed number covers today's need; `SlotClosure` already handles one-off exceptions).
Impact: New `SlotClosure` model lets staff close a whole day (`timeSlot = "*"`) or one slot. `GET /availability` and `GET /availability/month` expose live remaining counts, and `BookingFlow.tsx` greys out full dates and slots instead of offering every Mon–Sat slot unconditionally. The VIP Group Pass (5 guests) leaves only one seat in its slot — intentional, and visible in the UI.

---

### DEC-017 — Pending Bookings Hold Their Seats for Ten Minutes
Date: 2026-09-24
Status: Accepted
Decision: A booking is created as `pending` with a `hold_expires_at` ten minutes out *before* the guest is sent to Paystack. Pending bookings count against capacity only while the hold is live. Paystack's `onClose` releases the hold immediately via `POST /bookings/:id/release`; a five-minute interval sweeps any that were abandoned without it, flipping them to a new `expired` status.
Rationale: Without a hold, two guests can both pass the capacity check while one is inside the Paystack iframe, and both pay for the same last seat. Refunding a cat café booking is a manual, awkward conversation — preventing the double-sell is worth holding a seat briefly.
Alternatives considered: Creating the booking only after payment (rejected — that is exactly the double-sell). An indefinite hold (rejected — one abandoned checkout would block a seat forever). A shorter two-minute hold (rejected — a guest entering card details and waiting on an OTP can easily exceed it).
Impact: `BookingStatus` gains `expired`. Capacity counting lives in one shared predicate, `seatsTakenWhere()` in `availability.service.ts`, used by both the availability read path and the write-time check so they cannot drift apart. The capacity check and the insert run inside a Serializable transaction with one retry, so two simultaneous requests for the last seat produce exactly one booking and one 409.

---

### DEC-018 — Payment Amounts Are Computed Server-Side; Group Passes Are Flat-Priced
Date: 2026-09-24
Status: Accepted
Decision: The booking amount is calculated by the backend from the `plans` table and returned to the browser, which passes it to Paystack unchanged along with a server-generated reference. Payment is confirmed only after the server verifies the transaction with Paystack — either via the signed webhook or by calling `GET /transaction/verify/:reference`. Separately, Duo/Trio/VIP Group Passes are corrected to `perPerson: false`: their prices are totals for the whole party, not per head.
Rationale: The previous flow computed `plan.price * 100 * qty` in the browser and trusted Paystack's `callback` as proof of payment. Both are client-controlled — anyone could book a VIP Group Pass for ₦1 by editing the value in devtools, or reach the success screen without paying at all. The flat-pricing fix came out of the same review: with `perPerson: true` and a quantity of 2, a ₦58,000 Duo Pass was charging ₦116,000 for what the plan description calls a two-guest package.
Alternatives considered: Keeping the client-side amount and verifying it only in the webhook (rejected — the guest would already have been charged the wrong amount). Trusting the Paystack callback alone (rejected — it is a browser callback, not an attestation).
Impact: `POST /bookings` returns `amountKobo` and `paymentReference`. Fixed-size passes also force `partySize` to the plan's `guestCount`, so the party size and the price can never disagree. `perPerson: false` is set in both `frontend/src/lib/site.ts` and `backend/prisma/seed.ts`; the quantity stepper is replaced by a "N guests included" label for those plans. The webhook verifies `x-paystack-signature` as an HMAC-SHA512 over the raw request body, which required `rawBody: true` in `main.ts`.

---

### DEC-019 — Membership Is Granted on Confirmed Payment, Not on Form Submit
Date: 2026-09-24
Status: Accepted
Decision: Guest details are stored on the booking row itself (`guest_first_name`, `guest_last_name`, `guest_email`, `guest_phone`, `marketing_opt_in`) and `bookings.member_id` is nullable. The `members` row is created or updated only when payment is confirmed.
Rationale: `12-BOOKING_MEMBERSHIP_SCHEMA.md` states membership follows a completed booking, and the scaffolded `bookings.service.ts` carried a comment saying exactly that — while the code underneath created a `Member` on form submit. Every abandoned checkout would have landed a real person on the mailing list, which is both wrong data and an NDPR problem given `marketing_opt_in`.
Alternatives considered: Creating the member immediately and deleting it on abandonment (rejected — races with the guest retrying, and leaves tombstones). Keeping guest details only in memory until payment (rejected — a pending booking would have no contact information if staff needed to follow up).
Impact: Confirmation runs through one idempotent method, `confirmByReference()`, shared by the webhook and the browser-callback path, so a replayed webhook cannot double-count `total_visits`. A pending booking now carries enough contact detail for staff to chase a failed payment.

---

### DEC-020 — Two Plans Only: Solo Pass and Co-Work Space; Hours Extended to 8 PM
Date: 2026-09-26
Status: Accepted (supersedes the plan catalogue in DEC-013)
Decision: The five plans from Kindly are cut to two, per the owners. **Solo Pass for the Cat Cafe** (₦30,000, 60 minutes, per person) and a new **Co-Work Space** (₦6,000 per person, per day). PlayDate, Duo Pass, Trio Pass and VIP Group Pass are **deactivated, not deleted** (`active = false`). Co-Work is a *whole-day pass*: booked by date with no start time. Booking hours extend from 10 AM–5 PM to **10 AM–8 PM**, so hourly sessions now start 10:00 through 19:00.
Rationale: The owners supplied the final catalogue as a two-item list. Deactivating rather than deleting is required, not stylistic — confirmed bookings reference `trio-pass` and `vip-group-pass` by foreign key, and deleting those rows would orphan real customers' history. Co-Work's own copy contradicted itself ("60 mins | ₦6,000 per person" in the header, "₦6,000/day" in the body); the owner confirmed it is a day rate, which is also how a co-working space actually operates. The 8 PM extension follows from Co-Work's stated hours, and was applied to all plans rather than only Co-Work, on the owner's instruction.
Alternatives considered: Deleting the retired plans (rejected — breaks existing bookings). Pricing Co-Work per 60-minute slot (rejected — eight hours of work would cost ₦48,000, clearly not the intent). Extending hours for Co-Work only (rejected by the owner in favour of extending everything, which keeps one slot list and one set of published hours).
Impact: `bookingType = "workspace"` now drives a distinct booking path — `GET /availability?planId=` returns a single all-day entry instead of hourly slots, and whole-day bookings share the `"all-day"` sentinel in `bookings.time_slot` so a day's co-workers still group into one count without a nullable column or a second table. The booking form skips the time picker for these plans and auto-selects the single option. Published hours updated in `site.ts`, `Hero.tsx` and `Footer.tsx`; plan copy rewritten on the homepage, the booking page metadata and the FAQ. **Outstanding:** `Testimonials.tsx` still quotes a "VIP Group Pass" customer and a "PlayDate regular" — attributed quotes, so they need the owners' call rather than a silent rewrite.

---

### DEC-021 — No Cap on Bookings Per Time Slot
Date: 2026-09-26
Status: Accepted (supersedes DEC-016)
Decision: The six-guests-per-slot limit is removed. Any number of guests may book any time slot; the site never refuses a booking on capacity grounds. Per-slot guest counts are still recorded and surfaced on the staff day sheet. `SLOT_CAPACITY` remains as an optional escape hatch — set it to a positive number to reinstate a hard limit — but is unset by default.
Rationale: The founder's instruction was explicit: no maximum number of people per slot, because the café would rather see the real demand and work out how to handle it on the floor than have the website turn guests away. Tracking was always the actual requirement — knowing how many people are coming at 11 AM — and that is untouched. Refusing bookings was an assumption layered on top of it.
Alternatives considered: A soft warning to staff above a threshold (deferred — worth revisiting once there is real demand data, but not asked for). Keeping the cap high rather than removing it (rejected — an arbitrary number that still produces a confusing rejection).
Impact: `POST /bookings` no longer returns 409 `SLOT_FULL` unless a cap is explicitly configured, and the Serializable transaction that guarded the capacity check is gone with it — there is no longer a race to lose. Guests no longer see "4 of 6 left"; slots show times only, since a remaining count is meaningless without a limit. Seat holds survive but now serve only to mark abandoned checkouts `expired` so they stop appearing as pending arrivals. `capacity`/`remaining` are omitted from availability responses when no cap is set, rather than reported as misleading numbers. The reversal costs little: the counting, the day sheet, and the hold sweeper — the parts the café actually uses — were all reusable.

---

_Add new decisions below as they are made during implementation._
