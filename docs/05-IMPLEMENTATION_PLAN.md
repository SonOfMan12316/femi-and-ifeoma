# Fémi & Ifeoma Cat Café — Implementation Plan

This plan sequences the branding migration from tokens → global styles → components → pages → QA. Each phase must be completed before the next begins. Claude should update `06-TASKS.md` after completing each task.

---

## Phase 1 — Brand Foundation (Do this first, nothing else)

All visual work depends on this being correct.

1. Install fonts:
   - Let's Coogi (primary display)
   - Neue Haas Grotesk Display Pro (body/UI)
   - Cormorant Garamond (editorial)
   - Knicknack (playful/social)
   - Self-host via `@font-face` or load from CDN if available

2. Create design token file (`tokens.css` or equivalent):
   - All colours from `02-DESIGN_TOKENS.md`
   - All font families
   - Type scale
   - Spacing scale
   - Border radii
   - Shadows
   - Animation durations

3. Apply tokens globally:
   - Replace all hardcoded colour values with token references
   - Set `body` background to `var(--bg-primary)`
   - Set `body` font to `var(--font-body)`
   - Set `color` to `var(--text-primary)`

4. **Verify:** Site renders in brand cream background with correct fonts before proceeding.

---

## Phase 2 — Global Components

Work on these in order. Each should be a reusable component.

1. **Navbar**
   - Increase logo to min 140px wide
   - Remove orange hover block on links
   - Implement cream solid background on scroll
   - Style CTA as pill button
   - Mobile drawer menu

2. **Footer**
   - Dark background (#0C0C0C)
   - White logo (large)
   - Tagline below logo
   - Three-column layout
   - Orange accent on links
   - Remove orange block hover on links

3. **Buttons**
   - Primary: orange pill
   - Secondary: outlined pill
   - Ghost: white outlined (for dark sections)
   - Apply transitions

4. **Typography components**
   - Section label (uppercase orange)
   - Section heading (Let's Coogi)
   - Body copy (Neue Haas)

5. **Cards**
   - Base card (white/cream, rounded, shadow)
   - No glassmorphism

6. **Form inputs**
   - Text input (rounded, orange focus)
   - Select dropdown (custom)

---

## Phase 3 — Pages (in order)

### Home Page
1. Hero section
   - Cream background
   - On-brand headline
   - Remove glassmorphism cards
   - Brand cat photography
   - Primary CTA button

2. Brand story section ("Relax, Purr & Community")
   - Orange section label
   - Let's Coogi heading
   - Body copy using brand voice

3. "Meet our Cats" section
   - Cat profile cards
   - Circular/rounded imagery
   - Paw accent

4. How it works / Booking preview
   - Steps or simple visual
   - CTA to booking page

5. Testimonials / Social proof

### About Page
- Brand story expanded
- Team introduction
- Mission and values
- Brand photography

### Our Cats Page
- Full grid of cat profiles
- Filter by personality (optional)

### FAQs Page
- Accordion component
- Brand-appropriate styling

### House Rules Page
- Clear, friendly tone
- On-brand typography

---

## Phase 4 — Booking Flow

1. Date picker / calendar
   - Orange selected state
   - Cream available dates
   - Greyed unavailable

2. Time slot selection
   - Pill buttons
   - Orange selected state

3. Booking form
   - Name, email, party size, special requests
   - Input components from Phase 2

4. Confirmation page
   - Success state with brand illustration/motif
   - Summary of booking
   - "Add to calendar" link

5. Payment integration (if applicable)
   - Confirm gateway
   - Style payment form with tokens

---

## Phase 5 — QA & Polish

1. **Accessibility audit**
   - Colour contrast on all text (WCAG AA minimum)
   - Keyboard navigation
   - Focus states visible
   - Alt text on all images
   - Semantic HTML (h1 → h2 → h3 hierarchy)

2. **Responsive testing**
   - Mobile (375px, 390px)
   - Tablet (768px)
   - Desktop (1280px, 1440px)
   - Wide (1920px)

3. **Performance audit**
   - Lighthouse score > 85 on mobile
   - Images: WebP format, lazy-loaded
   - Fonts: preloaded, font-display: swap
   - No layout shift (CLS < 0.1)

4. **Cross-browser testing**
   - Chrome, Safari, Firefox, Edge
   - iOS Safari (critical for Nigerian mobile users)

5. **Brand consistency review**
   - Screenshot every page
   - Compare against brand guide
   - Check logo usage, colour accuracy, font rendering

6. **Copy review**
   - All copy matches brand voice
   - No placeholder text remaining
   - All cat puns intentional and on-brand

---

## Milestone Summary

| Milestone | Deliverable | Gate |
|---|---|---|
| Phase 1 complete | Token file, fonts installed | Site renders in brand cream |
| Phase 2 complete | All global components built | Navbar + Footer approved |
| Phase 3 complete | All pages implemented | Content review sign-off |
| Phase 4 complete | Booking flow end-to-end | Booking works in staging |
| Phase 5 complete | QA passed | Lighthouse 85+, no brand issues |
