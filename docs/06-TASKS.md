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
- ✅ Navbar: pill CTA button (Book a Visit) — desktop right, mobile drawer bottom
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
- ✅ Hero: on-brand headline ("Relax, Purr & Community")
- ✅ Hero: brand photography (existing photo kept)
- ✅ Hero: primary + ghost CTA buttons
- ⬜ Brand story section
- ⬜ Meet our Cats section
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

- ⬜ Date picker (brand colours)
- ⬜ Time slot selection (pill buttons)
- ⬜ Booking form
- ⬜ Confirmation / success page
- ⬜ Payment integration styled

**Phase 4 Gate:** ✅ Booking works end-to-end in staging environment.

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
