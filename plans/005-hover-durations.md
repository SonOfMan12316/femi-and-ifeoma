# 005 — Bring hover durations inside budget

Commit: e08b7ec · Severity: MEDIUM · Category: Easing & duration

## Why
Hover feedback should land in 150–250ms. Longer and the element feels like it
is lagging behind the cursor rather than responding to it.

| File:line | Current | Target |
| --- | --- | --- |
| `ContentBlock.tsx:41` | `duration-700` on image zoom | `duration-[250ms]` |
| `Cats.tsx:49` | `duration-[420ms]` on image zoom | `duration-[250ms]` |
| `Cats.tsx:42` | `duration-[360ms]` on shadow | `duration-[250ms]` |
| `Cats.tsx:38` | `duration-[360ms]` on lift | `duration-[250ms]` |

## Do not
Touch `MomentsGallery.tsx` (500ms hovers) — owner asked for the gallery to be
left alone. Note the inconsistency but leave it.

## Feel-check
Duration is the one thing that cannot be judged from code. After changing,
hover a cat card and an image block: the zoom should feel like it is tracking
the cursor, not catching up to it. If 250ms feels abrupt against this brand's
unhurried tone, 300ms is the ceiling — do not exceed it.
