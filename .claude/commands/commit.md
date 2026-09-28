---
name: commit
description: Split the working tree into several small, related commits instead of one large one. Groups changed files by concern — frontend UI, backend modules, Prisma schema, docs, config — so unrelated work never lands in the same commit. Use when the user asks to commit, wants changes broken into separate commits, or has a large uncommitted working tree.
---

# Commit in related groups

One commit describes one change. A working tree holding a booking-flow
redesign, a backend capacity change and a docs update is **three** commits, not
one — even when the user asks for "a commit".

## Why this matters here

This repo is two independent codebases (`frontend/`, `backend/`) that deploy
separately, plus a documentation set in `docs/` that is the project's memory.
A reviewer reads commits to answer "what changed and why". Mixing concerns
destroys that: a Prisma migration buried inside a CSS commit cannot be
reviewed, reverted, or cherry-picked on its own — and in this project, backend
changes can be reverted independently of the frontend that calls them.

## Procedure

### 1. Read the tree before touching it

```
git status --short
git diff --stat
git diff            # and git diff --cached if anything is staged
```

Never group from filenames alone. `lib/site.ts` holds brand copy, plan data
*and* nav links — three different concerns in one file. `BookingFlow.tsx`
routinely holds both UI and API-wiring changes. Read the diff.

### 2. Classify every changed file into a group

Work these out from the diff, not from a fixed list. These recur in this repo:

| Group | Typical contents |
| --- | --- |
| Frontend UI | `frontend/src/components/*`, `frontend/src/app/*`, `globals.css` |
| Shared frontend primitives | `Button.tsx`, `Reveal.tsx`, `Typography.tsx`, motion tokens in `globals.css` |
| Frontend data layer | `frontend/src/lib/api.ts`, `frontend/src/lib/site.ts` |
| Backend module | One of `backend/src/{bookings,plans,members,visits,availability,payments,admin,email}/` |
| Database | `backend/prisma/schema.prisma`, `backend/prisma/migrations/*`, `seed.ts` |
| Docs | `docs/*.md`, `plans/*.md`, `CLAUDE.md`, `AGENTS.md` |
| Config / environment | `.env.example`, `next.config.ts`, `eslint.config.mjs`, `package.json` |

Splitting rules:

- **Different concern → different commit.** Restyling the booking card and
  changing what the booking API returns are two commits.
- **Frontend and backend are always separate commits.** They deploy
  independently; a combined commit cannot be rolled back on one side.
- **A Prisma schema change and its migration belong together** — the schema
  without the migration leaves the database out of sync, and neither is
  independently useful.
- **Shared primitives go in their own commit** when the change outlives the
  feature that prompted it. A new `Button` variant is reusable; it is not part
  of a booking-flow commit.
- **`site.ts` almost always needs `git add -p`.** A single edit session can
  touch plan pricing, nav links and FAQ copy — unrelated concerns in one file.
- Keep each commit independently buildable. If the frontend does not compile
  without a backend type change, order the backend first.

### 3. Documentation entries ride with their change

`CLAUDE.md` rule 8 requires updating `docs/06-TASKS.md` and
`docs/09-CHANGELOG.md` after each task, and `docs/08-DECISIONS.md` when a
decision was made. Those entries **describe** the change, so they go in the
same commit as the code they describe — not a trailing `docs:` commit that
leaves the changelog briefly lying about what shipped.

A standalone documentation edit — fixing a typo, rewriting a guide, adding a
convention — is its own `docs:` commit.

### 4. Confirm the plan before committing

Show the grouping and wait for approval:

```
1. feat: add whole-day booking path for the Co-Work Space pass
   backend/src/common/schedule.ts
   backend/src/availability/*
   backend/src/bookings/bookings.service.ts
   docs/08-DECISIONS.md  (DEC-020)

2. feat: redesign the booking card as a single merged panel
   frontend/src/components/booking/*
   frontend/src/components/BookingFlow.tsx

3. docs: add Conventional Commits convention to AGENTS.md
   AGENTS.md
```

Committing is hard to undo once pushed. Get agreement first.

### 5. Commit each group

Stage **only** that group's files, by explicit path:

```
git add backend/src/availability backend/src/common/schedule.ts
git commit -m "..."
```

**Never** `git add -A`, `git add .`, or `git commit -a`. They defeat the entire
point of this skill.

After each commit run `git status --short` to confirm the rest of the tree is
still uncommitted and the grouping held.

## Message format

Conventional Commits, **no scope** — see `AGENTS.md`:

```
<type>: <specific summary of what changed and where or why>

<why, when the diff does not make it obvious>

BREAKING CHANGE: <only when a contract breaks>
```

`type` is one of `feat` `fix` `docs` `style` `refactor` `perf` `test` `build`
`ci` `chore` `revert`.

The summary is a sentence, not a label. `fix: bug fix` is useless six months
later; `fix: use Paystack's ref key so payments match their booking` is not.

Reference decision records by id in the body where one applies — `DEC-021` —
so the commit points at the reasoning rather than repeating it.

Append the trailer this environment requires:

```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

## When a group touches shared primitives

`Button.tsx`, `Reveal.tsx`, `Logo.tsx`, `FormField.tsx` and the token blocks in
`globals.css` reach every page. Before staging one:

```
git diff -- frontend/src/components/Button.tsx
```

Confirm the default path is unchanged — new props optional, existing variants
untouched, and any class moved out of a base string still applied in the
default branch. A change that alters existing behaviour is not a feature
commit; call it out in the message and list the affected call sites.

Token changes in `globals.css` deserve particular care: a renamed or retimed
`--ease-*` / `--duration-*` variable silently changes motion everywhere.

## Before the first commit

- **Check the branch.** `git branch --show-current`. Never commit to `main` —
  branch first.
- **Run the checks for each side you are committing**, and report failures
  rather than committing over them. If a failure is pre-existing, say so
  explicitly and let the user decide.

  ```
  cd frontend && npx tsc --noEmit && npx eslint src && npm run build
  cd backend  && npm run lint && npm run build
  ```

  Note: `npm run build` in `frontend/` has passed while the dev server returned
  500s, so a green build alone is not proof the page renders. Check
  `localhost:3000` too when the change is visual.

- **Look for secrets.** `backend/.env` holds a live `DATABASE_URL` with a
  password and a `PAYSTACK_SECRET_KEY`. It is gitignored — confirm it stayed
  that way, and never stage a `.env`. `.env.example` carries placeholders only
  and is safe.
- Check for stray debug output and scratch files. Temporary scripts belong in
  the scratchpad directory, not the repo.

## Do not

- Combine unrelated changes because they are small.
- Commit generated output — `frontend/.next/`, `backend/dist/`,
  `tsconfig.tsbuildinfo` — or editor files.
- Push. Only push when the user asks.
- Amend or rebase commits you did not create in this session without asking.
