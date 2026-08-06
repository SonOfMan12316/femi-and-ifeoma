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

_Add new decisions below as they are made during implementation._
