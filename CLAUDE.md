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
- `js/site.js` — site-wide JavaScript (reveal animations, footer fixes, etc.).
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
