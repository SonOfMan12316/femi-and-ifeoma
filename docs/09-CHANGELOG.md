# Fémi & Ifeoma Cat Café — Changelog

Track every meaningful change made during the branding migration. Claude should append to this file after completing each phase.

Format: `## [version or date] — [Phase/description]`

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
