# Fémi & Ifeoma Cat Café — Component Guidelines

Every component should feel like it belongs to the same warm, playful, slightly-editorial world. If it looks like it could be on any generic café website, it's not on-brand.

---

## Navbar

**Behaviour:** Sticky, transparent over hero → solid on scroll.

**Structure:**
- Left: Logo (full wordmark — not icon-only). Logo must be large enough to read "Cat Café" subtitle. Min width: 140px.
- Centre: Nav links (desktop)
- Right: CTA button ("Book a Visit") + optional social icon

**Tokens:**
- Background (solid state): `var(--color-cream)` or `var(--color-white)`
- Text: `var(--text-primary)`
- Active/hover link: `var(--color-orange)` — no underline, colour shift only
- CTA Button: see Button styles below
- Font: `var(--font-body)`, `var(--font-medium)`, `var(--text-sm)`
- Letter spacing: `var(--tracking-wide)` on nav links

**DO NOT:**
- Use glassmorphism / blur backgrounds on the navbar
- Make the logo tiny — it must be clearly readable at a glance
- Show hover states with orange block backgrounds (subtle colour only)

**Mobile:** Hamburger menu. Drawer slides from right. Cream background. Links stack vertically. Close icon top-right.

---

## Logo Usage Rules

- Always use the approved SVG file — never retype or recreate the wordmark in CSS
- Always include the "CAT CAFÉ" subtitle below the main wordmark
- Minimum size: 120px wide (web), never smaller
- Clear space: at least the height of the letter "F" on all sides
- Never rotate, stretch, or change the colour outside the approved colourways
- Never place orange logo on orange background
- On photo backgrounds: always use white logo with sufficient contrast

---

## Buttons

### Primary (CTA)
```
Background: var(--color-orange)
Text: var(--color-white)
Font: var(--font-body), var(--font-semibold), var(--text-sm)
Letter-spacing: var(--tracking-wide)
Padding: 14px 28px
Border-radius: var(--border-radius-full)  ← pill shape
Hover: background darkens ~10% (e.g. #d94e1e), subtle scale(1.02)
Transition: var(--duration-normal)
```

### Secondary (Outlined)
```
Background: transparent
Border: 2px solid var(--color-orange)
Text: var(--color-orange)
Same radius, padding, font as primary
Hover: fill with var(--color-orange), text becomes white
```

### Ghost (On Dark Backgrounds)
```
Background: transparent
Border: 2px solid var(--color-white)
Text: var(--color-white)
Hover: fill white, text becomes var(--color-orange)
```

**DO NOT:**
- Use box shadows on buttons unless in a card context
- Use square corners — always pill or generous radius
- Use orange text buttons without a border (invisible on cream backgrounds)

---

## Cards

Used for: cat profiles, menu items, events, testimonials.

```
Background: var(--color-white) or var(--color-cream)
Border-radius: var(--border-radius-lg)  ← 24px
Padding: var(--space-6)
Shadow: var(--shadow-md)
Hover: var(--shadow-lg) + translateY(-2px)
Transition: var(--duration-normal)
```

**Card image:** fills top of card, border-radius only on top corners. Aspect ratio: 4/3.

**Card label:** small uppercase text, `var(--color-orange)`, `var(--tracking-wider)`, `var(--text-xs)`, `var(--font-medium)`.

**DO NOT:**
- Use glassmorphism cards (no backdrop-filter)
- Float cards over hero images with positioning hacks
- Use card borders — shadows only

---

## Hero Section

**Structure:**
- Full-width, full-viewport-height (100svh)
- Background: `var(--color-cream)` (brand cream — not white, not pure beige)
- Headline: `var(--font-display)` (Let's Coogi), large scale
- Sub-copy: `var(--font-body)`, `var(--text-lg)`, muted
- CTA: Primary button
- Brand photography of cats, warmly lit

**Headline:** Must immediately explain the proposition. Suggested:
> "Enjoy coffee in the company of cats."
or
> "Lagos's first cat café — relax, purr, and connect."

**DO NOT:**
- Leave the hero copy vague ("Welcome" is not a headline)
- Overlay glassmorphism cards with hours/facts on the hero image
- Use stark white backgrounds in the hero

---

## Footer

**Background:** `var(--color-black)` — #0C0C0C (near black)
**Text:** `var(--color-white)` with `var(--text-muted)` for secondary info
**Accent:** `var(--color-orange)` for links and highlights

**Structure (top to bottom):**
1. Logo (white version, large and prominent)
2. Tagline: "Relax, Purr & Community"
3. Three-column layout:
   - Column 1: Navigation links
   - Column 2: Visit info (hours, address)
   - Column 3: Social links + contact
4. Bottom bar: © 2024 Fémi & Ifeoma Cat Café | Designed by [designer]

**Link hover:** `var(--color-orange)`, no underline until hover
**Section dividers:** `rgba(255,255,255,0.08)` thin border

**DO NOT:**
- Use orange backgrounds in the footer
- Show hover highlights that reveal orange "block" backgrounds behind links
- Make the logo small in the footer — it should be a statement

---

## Typography Components

### Section Label
```
Font: var(--font-body)
Weight: var(--font-semibold)
Size: var(--text-xs)
Color: var(--color-orange)
Letter-spacing: var(--tracking-wider)
Transform: uppercase
```

### Section Heading
```
Font: var(--font-display)  OR  var(--font-editorial)
Size: var(--text-3xl) to var(--text-5xl)
Color: var(--text-primary)
Leading: var(--leading-tight)
```

### Body Copy
```
Font: var(--font-body)
Size: var(--text-base) to var(--text-lg)
Color: var(--text-primary)
Leading: var(--leading-relaxed)
```

---

## Forms & Inputs

### Input Field
```
Background: var(--color-white)
Border: 1.5px solid var(--border-color)
Border-radius: var(--border-radius-md)
Padding: 14px 16px
Font: var(--font-body), var(--text-base)
Focus: border-color becomes var(--color-orange), subtle outline ring (orange 20% opacity)
```

### Select / Dropdown
Same as input. Custom dropdown — do not use default browser select styling.

---

## Badges & Tags

```
Background: var(--color-orange) or var(--color-mint)
Text: var(--color-white) or var(--color-teal)
Padding: 4px 12px
Border-radius: var(--border-radius-full)
Font: var(--font-body), var(--font-semibold), var(--text-xs)
Letter-spacing: var(--tracking-wide)
```

---

## Cat Profile Cards

Unique component for "Meet our Cats" section.

```
Image: circular or rounded square, full-bleed
Name: var(--font-display), var(--text-xl), var(--color-black)
Breed/personality: var(--font-body), var(--text-sm), var(--text-muted)
Accent: small paw icon in var(--color-orange)
Card bg: var(--color-cream)
```

---

## Booking / Calendar UI

- Clean, not clinical
- Selected date: `var(--color-orange)` background, white text
- Available: `var(--color-cream)` background
- Unavailable: greyed out, no pointer events
- Time slot pills: outlined → filled on select
- Confirm CTA: Primary button

---

## Photo / Imagery Guidelines

- Always feature real cats in warm, natural light
- Interior shots should show the café environment
- Avoid stock-looking "café" photography — it should feel real and lived-in
- Colour grade: warm tones, slightly golden. Avoid cool/blue filters.
- Overlaid text on photos: always white logo, always check contrast
- Circular image crops are on-brand for cat profiles and social avatars
