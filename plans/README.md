# Animation plans

From the `improve-animations` audit on e08b7ec. Ordered by leverage.

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | Name transition properties (`transition: all`) | HIGH | DONE |
| 002 | Pointer-gate hover transforms | HIGH | DONE |
| 003 | Reduced motion: gentler, not zero | HIGH | DONE |
| 004 | Consolidate easing tokens | MEDIUM | DONE |
| 005 | Hover durations inside budget | MEDIUM | DONE |

All five executed and verified 2026-09-26: build + lint clean, all four routes 200,
and the gates, tokens and reduced-motion fades confirmed present in the served CSS.

**Dependencies:** 002 depends on the `.hover-lift` / `.hover-grow` classes
already in `globals.css`. 001 and 002 touch the same lines in `Hero.tsx` and
`ContentBlock.tsx` — apply 001 first, or apply both together.

**Deliberately not planned**
- `MomentsGallery.tsx` — excluded by the owner. For the record it carries
  500ms hover durations (finding 005) and ungated hover transforms (002).
- `Card.tsx` and the `Select` in `FormField.tsx` — **dead components**, nothing
  imports them. They carry the same defects but no user sees them. Worth
  deleting rather than fixing.
