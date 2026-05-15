# WebsiteV2

Source of truth for [laurence-dawes.design](https://laurence-dawes.design) — a personal portfolio rebuilt on **Super.so** with **Notion** as the CMS.

This repo hosts the site's CSS, served via **GitHub Pages** and pulled into Super through `<link>` tags in its code injection.

## Layout

- `css/tokens.css` — design tokens (`:root` custom properties). One place to change padding, type, color.
- `css/base.css` — base/reset layer applied site-wide. Typography, callouts, navbar, footer, buttons, layout widths.
- `css/page-*.css` — page-specific CSS, added as pages get substantial unique styling.
- `js/site.js` — site-wide JavaScript.
- `js/page-*.js` — page-specific JS, added per page when needed.

`tokens.css`, `base.css`, and `site.js` are wired into Super's **site-wide** code injection. The `page-*` files are wired into Super's **per-page** code injection.

## Branches

- `main` — stable/live. Super pulls from here.
- `dev` — active work, merged into `main` when ready.

See [CLAUDE.md](./CLAUDE.md) for the full working agreement and breakpoint targets.
