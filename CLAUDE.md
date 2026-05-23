# WebsiteV2 — laurence-dawes.design rebuild

Fresh rebuild of the personal portfolio at laurence-dawes.design. Runs on **Super.so** with **Notion** as the CMS. The old site (separate Super project + `laurenced101/Website` repo) stays live untouched while this new stack is built in parallel.

## Working agreement

- **Source of truth:** all code lives in `laurenced101/WebsiteV2` on GitHub.
- **Where work happens:** Claude Code.
- **Branches:**
  - `main` is stable/live. Super pulls stylesheet `<link>` tags from GitHub Pages off `main`.
  - `dev` is for active work. Merged into `main` when ready to ship.
- **Distribution:** GitHub Pages serves files from `main` / repo root. Super loads them via `<link>` tags in its code injection.

## File structure

### File-naming

- `css/tokens.css` — design tokens (`:root` custom properties). One place to change padding, type, color.
- `css/base.css` — base/reset layer applied site-wide. Typography, callouts, navbar, footer, buttons, layout widths.
- `css/page-*.css` — page-specific CSS (e.g. `page-home.css`, `page-projects.css`). Used only when a page has substantial unique styling.
- `js/site.js` — site-wide JavaScript. Currently provides reveal-on-scroll (h1s + blue buttons) and smooth scroll-to-top (pink buttons). Plain vanilla JS, two independent IIFEs.
- `js/page-*.js` — page-specific JS (e.g. `page-projects.js` for the gallery card rebuild).

### Super wiring split

- **Site-wide files** (`tokens.css`, `base.css`, `site.js`) — wired into Super's site-wide code injection. Load on every page.
- **Page-specific files** (`page-*.css`, `page-*.js`) — wired into Super's per-page code injection. Load only on the relevant page.

### Convention

Files are created when they earn their place. No empty placeholder files; `page-*.css` and `page-*.js` are added as we tackle those pages.

## Breakpoints

Tested against a STYLEGUIDE Notion page across four breakpoints:

| Name           | Range            |
| -------------- | ---------------- |
| Large Desktop  | 1800px+          |
| Desktop        | max 1799px       |
| Tablet         | max 1279px       |
| Mobile         | max 800px        |

Every change is verified across all four before rolling out to real pages.

## Out of scope (for Claude)

- Anything inside Super itself — `<link>` wiring into Super's code injection is done manually by Laurence.
- The old `laurenced101/Website` repo and the old Super project.

## Development Tasks DB (Notion)

All work on this repo is tracked in the **Development Tasks** database in Notion:

- Parent page: https://www.notion.so/laurence-dawes/Development-Tasks-36912c70512f80e0bde7e922988b074b
- Data source ID: `8ef12c70-512f-821d-9aa7-07d88b6b0869`
- Project root (Notion): https://www.notion.so/laurence-dawes/Website-V2-36212c70512f802b8b24cf573c3771f2

At the start of each session, query the DB for any active tickets (Status = `In progress` or `Not started`, Priority = P0/P1/P2/P3) and surface them before doing anything else.

## Working rules

- **Status flow** — Pick up a task → set Status `In progress`. Code ready for review → flip Status to `For Review` (don't wait for Laurence to finish testing). If sent back, move to `In progress` and iterate. Never set `Done` — Laurence sets that after he's satisfied.
- **Priority filter** — Only act on P0/P1/P2/P3. `For Later` = parked; don't suggest or start these unprompted.
- **Notes column** — Always check it for scope. If a task references the Figma file (key `hMcQtp2El14m8o0jQfF6Yk` — Website-V2), inspect the relevant frame/node first.
- **Active codebase** — `laurenced101/WebsiteV2` (this repo). Do NOT touch `laurenced101/Website` — that's the live site, kept untouched until cutover.
- **Branching** — Work on `dev`. `main` is live (Super's stylesheet link points there). Merge `dev` → `main` only when ready to ship.
- **Testing** — Verify all CSS changes on the STYLEGUIDE Notion page across all four breakpoints (Large Desktop 1800+, Desktop ≤1799, Tablet ≤1279, Mobile ≤800) before they touch real content pages.

## Logging work back to Notion

When closing a task, set "Added by" appropriately (`Claude Code` for tickets Claude Code created itself; leave alone if Laurence added it), flip Status to `For Review`, and add a brief summary in "Review Notes (Claude)" describing what changed and any caveats Laurence should know during review.

## End-of-session checklist

Run through these in order **only when Laurence explicitly says "wrap up"** (or equivalent — "let's close out", "end of session", etc.). Do not run proactively when the session feels done; wait for the cue. Surface each item explicitly — don't assume, ask if anything is ambiguous.

1. **Uncommitted work** — Run `git status`. If there are changes, summarize what changed and ask whether to commit. Wait for explicit approval before staging or committing — never commit unprompted. If approved, draft the commit message at that point. Group commits logically (don't lump unrelated changes into one).

2. **Cache buster** — For each file family changed this session (CSS pair `tokens.css` + `base.css` lockstep / JS `site.js` standalone), ask Laurence for the current `?v=N` in Super and tell him the new N to set. **Never recall N from memory** — it lives in Super's code injection (out of repo scope) and goes stale.

3. **Notion ticket** — For any ticket moved to `In progress` this session: confirm the code is ready, then flip Status to `For Review` and fill "Review Notes (Claude)" with what changed and any caveats Laurence should watch for during testing. Never set `Done` — that's Laurence's call.

4. **Memory sweep** — Review the session for:
   - new feedback (corrections + confirmed approaches),
   - new project facts (initiatives, decisions, deadlines),
   - new references (external systems, docs, URLs),
   - stale memories to update or remove.

   Save anything durable; skip ephemeral task state.

5. **Hand-off summary** — One short paragraph: what changed, what's pending Laurence's action (testing, Super wiring, ticket review), and what the next session should pick up.
