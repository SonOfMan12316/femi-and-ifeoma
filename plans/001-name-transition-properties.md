# 001 — Replace `transition: all` with named properties

Commit: e08b7ec · Severity: HIGH · Category: Performance

## Why
`transition: all` transitions every animatable property, including layout
properties the author never intended, and forces work off the GPU. It is an
automatic finding in any animation review.

## Files and exact changes

**frontend/src/components/Nav.tsx:20** — only the shadow changes between the
scrolled and unscrolled states.
```
- className={`sticky top-0 z-50 transition-all duration-300 ${
+ className={`sticky top-0 z-50 transition-[box-shadow] duration-300 ease-[var(--ease-out)] ${
```

**frontend/src/components/Hero.tsx:100, 128, 156** — three identical info pills.
```
- className="bg-white rounded-[22px] px-6 py-6 transition-all duration-300 hover:-translate-y-1"
+ className="hover-lift bg-white rounded-[22px] px-6 py-6 transition-[transform,box-shadow] duration-[250ms] ease-[var(--ease-out)]"
```
(`hover-lift` already exists in globals.css and carries the -2px translate,
pointer-gated. Drop the `hover:-translate-y-1` — the class replaces it.)

**frontend/src/components/ContentBlock.tsx:63**
```
- transition-all duration-200 hover:-translate-y-0.5
+ hover-lift transition-[transform,background-color,box-shadow] duration-200 ease-[var(--ease-out)]
```

## Do not
- Touch `MomentsGallery.tsx` (owner asked for the gallery to be left alone).
- Touch `Card.tsx` — dead component, see plan 004.

## Verify
`npm run build` clean; hover each hero pill and the ContentBlock button and
confirm the lift still happens on desktop.
