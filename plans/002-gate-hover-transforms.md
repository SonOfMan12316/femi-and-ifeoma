# 002 — Pointer-gate every hover transform

Commit: e08b7ec · Severity: HIGH · Category: Accessibility

## Why
On a touch device, tapping an element fires a synthetic `:hover`. Any hover
that moves the element **stays applied after the finger lifts**, so cards and
buttons sit permanently raised until something else is tapped. Hover motion
must be gated to real pointers.

The gate already exists in `frontend/src/app/globals.css`:
```css
@media (hover: hover) and (pointer: fine) {
  .hover-lift:hover { transform: translateY(-2px); }
  .hover-grow:hover { transform: scale(1.02); }
}
```
Do NOT write this as a Tailwind arbitrary variant
(`[@media(hover:hover)and(pointer:fine)]:hover:...`) — Tailwind emits it
without spaces around `and`, which is invalid CSS and 500s every page.

## Files
Replace the raw hover transform with the class, keeping all other classes:

| File:line | Remove | Add |
| --- | --- | --- |
| `Hero.tsx:100,128,156` | `hover:-translate-y-1` | `hover-lift` |
| `Cats.tsx:38` | `hover:-translate-y-[5px]` | `hover-lift` |
| `ContentBlock.tsx:63` | `hover:-translate-y-0.5` | `hover-lift` |

For the two image zooms (`Cats.tsx:49`, `ContentBlock.tsx:41`) the transform is
on a child via `group-hover:scale-[1.04]`. Add a gated group rule to globals.css
rather than a per-element class:
```css
@media (hover: hover) and (pointer: fine) {
  .group:hover .group-zoom { transform: scale(1.04); }
}
@media (prefers-reduced-motion: reduce) {
  .group:hover .group-zoom { transform: none; }
}
```
then swap `group-hover:scale-[1.04]` for `group-zoom` on those two elements.

## Do not
Touch `MomentsGallery.tsx` or `Card.tsx`.

## Verify
`npm run build`; in Chrome DevTools device-emulation mode, tap a cat card and
confirm it does not remain lifted.
