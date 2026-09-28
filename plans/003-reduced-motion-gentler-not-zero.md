# 003 — Reduced motion should be gentler, not zero

Commit: e08b7ec · Severity: HIGH · Category: Accessibility

## Why
`frontend/src/app/globals.css` currently disables motion outright for reduced-
motion users:
```css
.reveal { opacity: 1; transform: none; transition: none; }
.hero-animate { animation: none; opacity: 1; }
```
The standard is **fewer and gentler animations, not zero** — keep transitions
that aid comprehension, remove position changes. As written, a reduced-motion
user gets content that pops in with no bridge at all, which is a harsher
experience than a plain fade. Reduced motion means less *movement*, not less
*feedback*.

## Change
In the `@media (prefers-reduced-motion: reduce)` block, replace the
movement-and-fade removals with fade-only equivalents. Keep `transform: none`
(that is the movement); restore a short opacity transition.

```css
.reveal {
  opacity: 0;
  transform: none;
  transition: opacity 200ms var(--ease-out);
}
.reveal.is-visible { opacity: 1; }

.hero-animate {
  opacity: 0;
  transform: none;
  animation: step-fade 200ms var(--ease-out) forwards;
}
```
`step-fade` is an existing opacity-only keyframe in this file — reuse it, do
not define another.

Leave these as-is, they are correctly zeroed: `.hero-image-zoom` (28s Ken Burns
is pure decoration), `.hero-cover`, `.loader-sweep` (an infinite loop is
exactly what reduced-motion users are protecting themselves from).

## Verify
DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Reload the
homepage: sections should **fade** in on scroll without sliding. Nothing should
translate.
