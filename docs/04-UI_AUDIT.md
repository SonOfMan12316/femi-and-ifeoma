# Fémi & Ifeoma Cat Café — UI Audit

This document compares the current website against the brand guide. Each section identifies what exists, what the brand guide requires, and exactly what needs to change.

Priority levels: 🔴 Critical | 🟡 Important | 🟢 Nice to have

---

## Global / Site-wide

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Background colour | White/light grey | Warm Cream (#FFF0E9) | Replace `background: white` with `--bg-primary` token | 🔴 |
| Primary font | Unknown sans-serif | Neue Haas Grotesk (body), Let's Coogi (display) | Install and configure font stack | 🔴 |
| Primary colour | Orange (shade TBC) | #F85E28 exactly | Update all colour references to token | 🔴 |
| Secondary colour | None visible | #3E6C61 Teal | Add teal as a design element | 🟡 |
| CSS variables | Likely none | Full token system required | Create `:root` token file | 🔴 |

---

## Navbar

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Logo size | Too small | Prominent, readable including "CAT CAFÉ" subtitle | Increase logo size, min 140px wide | 🔴 |
| Background | White or transparent | Cream (#FFF0E9) when solid | Update navbar background | 🔴 |
| Link hover state | Orange background block appears | Subtle colour change only (no orange block) | Remove hover background, use colour-only transition | 🔴 |
| Nav font | Unknown | Neue Haas Grotesk, medium weight, small caps/uppercase with tracking | Update font and letter-spacing | 🟡 |
| CTA button | Exists but styling TBC | Pill-shaped, orange, white text | Update to pill shape with brand radius | 🟡 |
| Mobile nav | Unknown | Drawer from right, cream background | Audit and rebuild if needed | 🟡 |

---

## Hero Section

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Background | Dark image / unclear | Warm cream (#FFF0E9) | Replace with brand cream background | 🔴 |
| Hero headline | Vague or absent | Clear proposition ("Lagos's first cat café") | Write and implement on-brand headline | 🔴 |
| Glassmorphism cards | Hours/info cards floating on image | NOT in brand guide — remove | Remove glassmorphism entirely | 🔴 |
| Hero typography | Unknown | Let's Coogi for headline | Install and apply display font | 🔴 |
| Cat photography | Present | Warm, natural lighting; real café environment | Review and replace if needed | 🟡 |

---

## About / Story Section

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Brand story | May be absent or thin | "Relax, Purr & Community" narrative | Write full brand story section using brand copy | 🟡 |
| Section label | Unknown | Uppercase orange label above heading | Add section label component | 🟡 |
| Typography | Unknown | Let's Coogi heading + Neue Haas body | Apply font tokens | 🔴 |

---

## Cat Section ("Meet Our Cats")

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Cat cards | Unknown | Circular/rounded image, name in display font, paw accent | Build cat profile card component | 🟡 |
| Section background | Unknown | Cream or mint for contrast | Apply brand background | 🟡 |

---

## Booking UI

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Calendar / date picker | Unknown | Orange selected state, cream available, pill time slots | Custom booking UI with brand tokens | 🔴 |
| Form inputs | Unknown | Rounded, orange focus state | Apply input component guidelines | 🔴 |
| CTA | Unknown | Primary pill button | Update to brand button | 🔴 |

---

## Footer

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Background | Unknown (likely light) | Near black (#0C0C0C) | Change footer to dark background | 🔴 |
| Logo | Unknown | White version, large and prominent | Use white SVG logo, increase size | 🔴 |
| Link hover | Orange block appears | Orange text only, no block highlight | Remove hover background effect | 🔴 |
| Tagline | Absent? | "Relax, Purr & Community" | Add tagline below logo | 🟡 |
| Social links | Present | Orange accent, white icons | Style with brand tokens | 🟡 |
| Layout | Unknown | Three-column: nav / visit info / social+contact | Restructure if needed | 🟡 |
| Bottom bar | Unknown | Copyright + attribution line | Add or update | 🟢 |

---

## Typography (Global)

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Display/heading font | Generic | Let's Coogi | Install font, apply to h1–h3 | 🔴 |
| Body font | Generic | Neue Haas Grotesk | Install font, apply globally | 🔴 |
| Section labels | Absent | Uppercase, orange, tracked | Add label component | 🟡 |
| Type scale | Ad hoc | Defined scale (see tokens) | Apply consistent scale | 🟡 |

---

## Colours (Global)

| Element | Current | Brand Guide | Action Required | Priority |
|---|---|---|---|---|
| Primary orange | May be wrong shade | #F85E28 exactly | Update to exact hex | 🔴 |
| Background | White | #FFF0E9 Warm Cream | Update site background | 🔴 |
| Teal | Not used | #3E6C61 — 15% usage | Introduce teal in section backgrounds, accents | 🟡 |
| Mint | Not used | #CCFCEE — 15% usage | Use for soft section backgrounds | 🟢 |
| Black | Standard #000000 | #0C0C0C near-black | Update text and footer to near-black | 🟡 |

---

## Quick Win Checklist

These can be fixed in minutes and will have immediate visual impact:

- [ ] Replace `background: white` with `background: #FFF0E9` globally
- [ ] Update primary colour to `#F85E28`
- [ ] Remove orange block highlight on navbar link hover
- [ ] Remove glassmorphism/blur effects from hero
- [ ] Increase logo size in navbar
- [ ] Change footer background to `#0C0C0C`
- [ ] Use white logo SVG in footer
- [ ] Apply pill border-radius to all CTA buttons
