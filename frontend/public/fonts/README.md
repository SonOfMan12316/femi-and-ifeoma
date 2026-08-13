# Brand Fonts — Installed

Self-hosted brand fonts (see DEC-002 in `docs/08-DECISIONS.md`). All `@font-face`
declarations live in `src/app/globals.css`.

## Installed Fonts

### 1. Let's Coogi (Display font)
- **Usage:** Logo, headlines, expressive moments
- **File:** `Let's Coorgi.ttf`
- **Weights:** Regular (400)
- **Token:** `--font-display`
- **Note:** Bold (700) not supplied — browser synthesises if needed

### 2. Neue Haas Grotesk Display Pro (Body font)
- **Usage:** Body copy, nav, buttons, forms
- **Files:** `NeueHaasDisplayLight.ttf`, `NeueHaasDisplayRoman.ttf`, `NeueHaasDisplayMediu.ttf`, `NeueHaasDisplayBold.ttf`
- **Weights:** Light (300), Roman (400), Medium (500), Bold (700)
- **Tokens:** `--font-body`, `--font-sans`
- **Note:** Semibold (600) not supplied — browser synthesises if needed

### 3. Knicknack (Playful font)
- **Usage:** Promotional copy, banners, social
- **Files:** `Knicknack Regular.woff2`, `Knicknack Bold.woff2`
- **Weights:** Regular (400), Bold (700)
- **Token:** `--font-playful`

### 4. Cormorant Garamond (Editorial font)
- **Usage:** Editorial pull quotes, long-form
- **Source:** `next/font/google` (self-hosted at build)
- **Token:** `--font-editorial`

## Outstanding Optimisation

Let's Coogi and Neue Haas ship as TTF, which is significantly larger than WOFF2
(~100KB per Neue Haas weight). Converting these to WOFF2 is tracked in Phase 5 QA
alongside font preloading. Knicknack is already WOFF2.

## Font Display Strategy

All fonts use `font-display: swap` so text renders immediately with the system
font, then swaps to the brand font when loaded. This prevents invisible text
during loading (FOIT).
