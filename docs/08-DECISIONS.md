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

_Add new decisions below as they are made during implementation._
