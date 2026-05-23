# legacy-super/ — deprecated

This folder holds the **old Super-targeting code** from when laurence-dawes.design
ran on **Notion + Super**. It is kept for reference only and is **no longer wired
into anything**. The live design now lives natively in the Astro project at the
repo root (`src/`).

## Why it's here

On the old stack, Notion held the content, Super rendered Notion's DOM with default
chrome, and this CSS/JS layer overrode that DOM to produce the actual design. The
Astro migration removes that asymmetry — the design is now expressed directly in
Astro components, so the override layer is obsolete.

## What's in here

- `css/tokens.css` — the original design-token system (`:root` custom properties).
  The reusable tokens (primary color, layout widths/margins, type scale) were ported
  into `src/styles/tokens.css`. The Super-only presets (Notion callout widths, button
  style presets, navbar/footer chrome tokens) were **not** ported — they only existed
  to style Notion's DOM.
- `css/base.css` — the Super/Notion override layer. Targets `.super-navbar`,
  `.notion-root`, `.notion-button`, etc. with heavy `!important` overrides. **Do not
  port these** — the problem they solved (fighting Notion's DOM) no longer exists.
- `js/site.js` — site-wide JS for the Super build: reveal-on-scroll (h1s + blue
  buttons via WAAPI) and smooth scroll-to-top (pink buttons). Tied to the Super/Notion
  DOM and marker classes (`.ln-blue-button`). Reference only.

## Do not

- Re-wire any of this into the Astro site.
- Port the `!important` overrides from `base.css`.
- Assume these files reflect current design decisions — the Astro `src/` is the source
  of truth now.
