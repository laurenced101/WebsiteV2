# /experience conform plan (approved)

Execution checklist for wiring `/experience` + its components to consume the token
system. Approved decisions are baked in below. **Ground rule:** intentional visual
changes are OK here (unlike Session 5's exact-match-only rule) — the point is to make
the page match the tuned tokens. Build + visually review all four breakpoints after.

Already done (do NOT redo): font-size aliases are fully consumed; `.wrap` consumes
the layout tokens. This pass is colour / weight / leading / tracking / measure +
the spacing-mismatch snaps.

## Per-element token mapping

Apply each element's **role** tokens (role = the `--font-size-*` it already uses):
`--text-<role>` (colour), `--weight-<role>`, `--leading-<role>`, `--tracking-<role>`.
Measure is applied **only** to the two full-width prose blocks (see below) — not to
short labels or items inside multi-column rows (a measure cap there just over-narrows).

### Deliberate exceptions (do NOT conform these props — keep explicit)
- **`.statement p`** (h2 size, intro prose): keep colour inheriting `--ink` (NOT
  `--text-h2`/blue); keep `line-height: 1.4` (NOT `--leading-h2`/snug). DO apply
  `--weight-h2`, `--tracking-h2`, and `max-width: var(--measure-h2)`.
- **`.discipline-num`** (caption size): keep `color: var(--color-primary)` (NOT
  `--text-caption`/grey).
- **`.footer-content p`**: keep `line-height: 22px` (deliberate generous spacing;
  the unitless leading scale would crush it). Apply `--text-label`, `--weight`,
  `--tracking-label`.
- **`.logo` / `.logo .light`** (Navbar): keep the wide `4.32px` / `7.92px` tracking
  (deliberate logotype); do not map to `--tracking-*`.

### Measure (max line width) — apply to these two only
- `.statement p` → `max-width: var(--measure-h2)` (85%)
- `.panel-text` → replace `max-width: 680px` with `max-width: var(--measure-body)`
  (100% → **cap removed**, approved).

### Weight note
- `.stat-num` → `--weight-display` = **semibold** (was medium) — approved, visible
  bump on the big stat numbers.

### Leading conforms (snap to role alias, all ≤0.1 shift)
`.statement h1` →`--leading-h1`; `.stat-num`→`--leading-display`;
`.stat-label`→`--leading-caption`; `.row-title`→`--leading-h3`;
`.panel-text`→`--leading-body`. (`.discipline-desc`, `.index-head .sub` already done.)

### Tracking conforms (label-role → `--tracking-label`, ~0.9px → 0.08em, scales)
`.section-label`, `.index-col-head`, `.bottom-note`, `.logo-cell`, `.row-discipline`,
`.brand-text`, `.panel-meta`, `.slideshow-counter`, `.slideshow-status`,
`.footer-content p`. (`.logo` excepted above.)

### Colour conforms (`--text-<role>`, mostly no-op)
All text elements → their `--text-<role>`, EXCEPT the exceptions above.
Note `.logo-cell` literal `#adadad` → `--text-label` (slightly darker grey).

## Spacing-mismatch snaps (from notes/session5-mismatches.md)

Snap these to nearest token:
- `.section-label` margin-bottom 28 → `--space-24`
- `.discipline` gap 10 → `--space-12`; `.index-head` gap 10 → `--space-12`
- `.index-head` padding-bottom 18 → `--space-16`; `.index-col-head` 18 → `--space-16`
- `.index .wrap` padding `… 0 90px` → `… 0 var(--space-96)`
- `.index-grid` column-gap 20 → `--space-24`; ≤900px 14 → `--space-12`
- `.nav-buttons` gap 18 → `--space-16`; `.nav-btn` padding `6px 14px` → `var(--space-8) var(--space-16)`
- `.footer` padding `0 0 44px` → `0 0 var(--space-48)`; `.footer-content` gap 10 → `--space-12`
- `.panel-text` margin-bottom 18 → `--space-16`
- `.panel-meta strong` margin-left 6 → `--space-8`
- `.slideshow-controls` margin-bottom 28 → `--space-24`

Approved judgment calls:
- **`.statement .wrap` padding `80px 0 70px`** → `var(--space-96) 0 var(--space-64)`
- **`.section .wrap` / `.section.clients .wrap` `56px`** → `--space-48`
- **`.panel-inner` left indent `200px` / `150px`** → **leave raw px** (structural —
  clears the absolute brand column; revisit as a dedicated `--indent` layout token later)

## Order
1. experience.astro, then ProjectRow / Navbar / Footer / Slideshow.
2. Build; review all four breakpoints.
3. Then (separate, with Laurence) the general layout edits — TBD after he sees the
   conformed page.
