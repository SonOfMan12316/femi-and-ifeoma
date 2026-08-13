# Fémi & Ifeoma Cat Café — Changelog

Track every meaningful change made during the branding migration. Claude should append to this file after completing each phase.

Format: `## [version or date] — [Phase/description]`

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
