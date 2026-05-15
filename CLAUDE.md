# WebsiteV2 — laurence-dawes.design rebuild

Fresh rebuild of the personal portfolio at laurence-dawes.design. Runs on **Super.so** with **Notion** as the CMS. The old site (separate Super project + `laurenced101/Website` repo) stays live untouched while this new stack is built in parallel.

## Working agreement

- **Source of truth:** all code lives in `laurenced101/WebsiteV2` on GitHub.
- **Where work happens:** Claude Code.
- **Branches:**
  - `main` is stable/live. Super pulls stylesheet `<link>` tags from GitHub Pages off `main`.
  - `dev` is for active work. Merged into `main` when ready to ship.
- **Distribution:** GitHub Pages serves files from `main` / repo root. Super loads them via `<link>` tags in its code injection.

## File layout

- `css/tokens.css` — design tokens (`:root` custom properties). The single, clearly-marked place to adjust padding, type, colors, etc.
- `css/base.css` — base/reset layer applied on top of Super's default layout CSS. Site is rebuilt incrementally here.

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
