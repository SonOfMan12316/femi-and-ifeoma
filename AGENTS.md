<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Added manually. Keep outside the nextjs-agent-rules markers above, which
     are regenerated and will overwrite anything placed between them. -->

# Commit messages

Conventional Commits, `type: summary`, **no scope**.

```
feat: add whole-day booking path for the Co-Work Space pass
fix: use Paystack's `ref` key so payments match their booking
docs: record DEC-021 removing the per-slot capacity cap
```

The summary is a short, specific sentence saying **what changed and where or
why** — not a vague phrase. It should be useful to someone reading `git log`
six months from now with no memory of the work.

| Bad | Good |
| --- | --- |
| `fix: bug fix` | `fix: reject bookings on Sundays, which the café is closed` |
| `feat: booking` | `feat: track guests per time slot for the staff day sheet` |
| `refactor: cleanup` | `refactor: move slot definitions into common/schedule.ts` |
| `style: css` | `style: gate hover transforms so taps don't stick on touch` |

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` ·
`build` · `ci` · `chore` · `revert`

Add a `BREAKING CHANGE:` footer when a change breaks an existing contract — an
API response shape, a database column, an environment variable, a public
component prop:

```
feat: return availability per plan rather than per date

BREAKING CHANGE: GET /availability now requires a planId query parameter;
callers omitting it get hourly slots, which is wrong for whole-day passes.
```
