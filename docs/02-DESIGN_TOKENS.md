# Fémi & Ifeoma Cat Café — Design Tokens

All tokens below should be implemented as CSS custom properties (variables) in a single `:root` block. This makes global colour changes trivial and keeps the design system consistent.

---

## Colours

### Core Palette

```css
:root {
  /* Primary — Brand Orange (30% usage) */
  --color-orange:        #F85E28;
  --color-orange-rgb:    248, 94, 40;

  /* Deep Teal (15% usage) */
  --color-teal:          #3E6C61;
  --color-teal-rgb:      62, 108, 97;

  /* Mint / Light Teal (15% usage) */
  --color-mint:          #CCFCEE;
  --color-mint-rgb:      204, 252, 238;

  /* Warm Cream / Background (30% usage) */
  --color-cream:         #FFF0E9;
  --color-cream-rgb:     255, 240, 233;

  /* Near Black (10% usage) */
  --color-black:         #0C0C0C;
  --color-black-rgb:     12, 12, 12;

  /* Pure White */
  --color-white:         #FFFFFF;
}
```

### Semantic Tokens

```css
:root {
  /* Backgrounds */
  --bg-primary:          var(--color-cream);
  --bg-accent:           var(--color-orange);
  --bg-dark:             var(--color-teal);
  --bg-light:            var(--color-mint);
  --bg-surface:          var(--color-white);

  /* Text */
  --text-primary:        var(--color-black);
  --text-on-orange:      var(--color-white);
  --text-on-teal:        var(--color-white);
  --text-on-mint:        var(--color-teal);
  --text-on-cream:       var(--color-black);
  --text-accent:         var(--color-orange);
  --text-muted:          rgba(12, 12, 12, 0.55);

  /* Borders */
  --border-color:        rgba(12, 12, 12, 0.12);
  --border-radius-sm:    8px;
  --border-radius-md:    16px;
  --border-radius-lg:    24px;
  --border-radius-xl:    40px;
  --border-radius-full:  9999px;

  /* Shadows */
  --shadow-sm:   0 1px 3px rgba(12, 12, 12, 0.08);
  --shadow-md:   0 4px 16px rgba(12, 12, 12, 0.10);
  --shadow-lg:   0 8px 32px rgba(12, 12, 12, 0.12);
}
```

### Colour Tints (for backgrounds and hover states)

Orange tints (mix with white):
- 90% → salmon-peach
- 70% → light peach
- 50% → very light peach
- 30% → near cream

Teal tints:
- 90% → muted dark teal
- 70% → mid teal-grey
- 50% → sage
- 30% → near white-grey

Mint tints:
- All tints are near white — use sparingly for section backgrounds

---

## Typography

### Font Stack

```css
:root {
  /* Primary — logo, headlines, expressive moments */
  --font-display:    'Lets Coogi', 'Knicknack', cursive;

  /* Editorial — premium campaigns, menus, pull quotes */
  --font-editorial:  'Cormorant Garamond', Georgia, serif;

  /* Body / UI — body copy, nav, buttons, forms */
  --font-body:       'Neue Haas Grotesk Display Pro', 'Inter', system-ui, sans-serif;

  /* Playful / Social — promotional copy, banners */
  --font-playful:    'Knicknack', cursive;
}
```

### Type Scale

```css
:root {
  --text-xs:    0.75rem;   /* 12px — labels, captions */
  --text-sm:    0.875rem;  /* 14px — small body, meta */
  --text-base:  1rem;      /* 16px — body copy */
  --text-lg:    1.125rem;  /* 18px — large body */
  --text-xl:    1.25rem;   /* 20px — sub-headings */
  --text-2xl:   1.5rem;    /* 24px — section headings */
  --text-3xl:   1.875rem;  /* 30px — page headings */
  --text-4xl:   2.25rem;   /* 36px — hero sub-headings */
  --text-5xl:   3rem;      /* 48px — hero headings */
  --text-6xl:   3.75rem;   /* 60px — display / billboard */
}
```

### Font Weights

```css
:root {
  --font-regular:    400;
  --font-medium:     500;
  --font-semibold:   600;
  --font-bold:       700;
}
```

### Line Heights

```css
:root {
  --leading-tight:   1.2;
  --leading-snug:    1.35;
  --leading-normal:  1.5;
  --leading-relaxed: 1.65;
}
```

### Letter Spacing

```css
:root {
  --tracking-tight:  -0.02em;
  --tracking-normal: 0em;
  --tracking-wide:   0.06em;   /* uppercase labels */
  --tracking-wider:  0.1em;    /* badges, tags */
}
```

---

## Spacing

Base unit: 4px

```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;
  --space-24:  96px;
  --space-32:  128px;
}
```

---

## Animation

```css
:root {
  --duration-fast:    150ms;
  --duration-normal:  250ms;
  --duration-slow:    400ms;
  --ease-default:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Iconography / Motifs

Brand uses cat-specific graphic elements. These should be SVG and stored in `/public/icons/brand/`:

- `paw.svg` — filled paw print (used in logo mark, badges, accents)
- `whiskers.svg` — whisker strokes from logo
- `cat-face.svg` — simplified cartoon cat illustration (used on passport, socks, tote)
- `oval-badge.svg` — paw-in-oval logomark

These are NOT generic icons. They are brand motifs and should always appear in brand colours.
