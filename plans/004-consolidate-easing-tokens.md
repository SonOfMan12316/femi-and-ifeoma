# 004 — Consolidate hand-typed easing curves onto tokens

Commit: e08b7ec · Severity: MEDIUM · Category: Cohesion & tokens

## Why
`cubic-bezier(0.22, 1, 0.36, 1)` is hand-typed in 6 places, plus an unspaced
7th (`Cats.tsx:38`). It now sits alongside `--ease-out:
cubic-bezier(0.23, 1, 0.32, 1)` added during the motion pass. Two curves that
differ imperceptibly, neither authoritative, is a consolidation finding — and
CLAUDE.md rule 3 requires values come from tokens, not literals.

## Change
`--ease-out` in `frontend/src/app/globals.css` is the canonical curve. Replace
every literal with `var(--ease-out)`:

- `globals.css`: `.reveal` transition (×2 properties), `.hero-animate` animation
- `Cats.tsx:38`: `ease-[cubic-bezier(0.22,1,0.36,1)]` → `ease-[var(--ease-out)]`

Do NOT change `cubic-bezier(0.4, 0, 0.6, 1)` on `.loader-sweep` — that is a
deliberate symmetric ease for an infinite loop, not an entrance curve.

## Scope boundary
This is a substitution, not a retiming. Do not change any duration.

## Verify
`grep -rn "cubic-bezier(0.22" frontend/src` returns nothing.
`npm run build` clean. Scroll the homepage — reveals should look unchanged.
