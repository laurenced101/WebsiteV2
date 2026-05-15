# WebsiteV2

Source of truth for [laurence-dawes.design](https://laurence-dawes.design) — a personal portfolio rebuilt on **Super.so** with **Notion** as the CMS.

This repo hosts the site's CSS, served via **GitHub Pages** and pulled into Super through `<link>` tags in its code injection.

## Layout

- `css/tokens.css` — design tokens (`:root` custom properties). One place to change padding, type, color.
- `css/base.css` — base/reset layer applied over Super's default layout CSS.

## Branches

- `main` — stable/live. Super pulls from here.
- `dev` — active work, merged into `main` when ready.

See [CLAUDE.md](./CLAUDE.md) for the full working agreement and breakpoint targets.
