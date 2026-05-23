# Session 5 — spacing / line-height / letter-spacing mismatch report

Inventory of every hardcoded spacing, line-height, and letter-spacing value that
does **not** exactly match a Session 5 token. These were left as raw values on
purpose (no auto-conforming — a visual shift on a 2px-off value is still a visual
shift). This list is for a follow-up triage session: decide per entry whether to
nudge the value onto the scale (accepting the visual change) or to extend the
scale to cover it.

Exact-match values were already refactored to tokens this session and are **not**
listed here.

Scale references:
- **Spacing primitives:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (px)
- **Line-height primitives:** tight 1.05 · snug 1.2 · normal 1.5 · loose 1.7
- **Letter-spacing primitives:** tight −0.02em · normal 0 · wide 0.08em
- Line-height / letter-spacing are reported against the **role alias** the element
  maps to (role = the `--font-size-*` token the element consumes), with that
  alias's current starting value.

---

## Spacing (padding / margin / gap)

`0` values are left as `0` (not a scale value). Mixed shorthands had their
matching values tokenized in place; only the non-matching values appear below.

| File:line | Property (selector) | Value | Nearest token(s) |
| --- | --- | --- | --- |
| src/pages/experience.astro:93 | column-gap (.index-grid, global) | 20px | --space-16 (16px) / --space-24 (24px) — Δ4px each |
| src/pages/experience.astro:97 | column-gap (.index-grid ≤900px) | 14px | --space-12 (12px) / --space-16 (16px) — Δ2px each |
| src/pages/experience.astro:104 | padding (.statement .wrap) | 80px | --space-64 (64px) / --space-96 (96px) — Δ16px each |
| src/pages/experience.astro:104 | padding (.statement .wrap) | 70px | --space-64 (64px) — Δ6px |
| src/pages/experience.astro:112 | padding (.section .wrap) | 56px | --space-48 (48px) / --space-64 (64px) — Δ8px each |
| src/pages/experience.astro:114 | padding (.section.clients .wrap) | 56px | --space-48 (48px) / --space-64 (64px) — Δ8px each |
| src/pages/experience.astro:118 | margin-bottom (.section-label) | 28px | --space-24 (24px) / --space-32 (32px) — Δ4px each |
| src/pages/experience.astro:125 | gap (.discipline) | 10px | --space-8 (8px) / --space-12 (12px) — Δ2px each |
| src/pages/experience.astro:151 | padding (.index .wrap) | 90px | --space-96 (96px) — Δ6px |
| src/pages/experience.astro:153 | padding-bottom (.index-head) | 18px | --space-16 (16px) — Δ2px |
| src/pages/experience.astro:155 | gap (.index-head) | 10px | --space-8 (8px) / --space-12 (12px) — Δ2px each |
| src/pages/experience.astro:161 | padding (.index-col-head) | 18px | --space-16 (16px) — Δ2px |
| src/components/Navbar.astro:35 | gap (.nav-buttons) | 18px | --space-16 (16px) — Δ2px |
| src/components/Navbar.astro:37 | padding (.nav-btn) | 6px | --space-4 (4px) / --space-8 (8px) — Δ2px each |
| src/components/Navbar.astro:37 | padding (.nav-btn) | 14px | --space-12 (12px) / --space-16 (16px) — Δ2px each |
| src/components/Footer.astro:22 | padding (.footer) | 44px | --space-48 (48px) — Δ4px |
| src/components/Footer.astro:26 | gap (.footer-content) | 10px | --space-8 (8px) / --space-12 (12px) — Δ2px each |
| src/components/ProjectRow.astro:108 | padding (.panel-inner) | 40px | --space-32 (32px) / --space-48 (48px) — Δ8px each |
| src/components/ProjectRow.astro:108 | padding (.panel-inner) | 200px | --space-128 (128px) — Δ72px (off-scale; layout indent for absolute brand col) |
| src/components/ProjectRow.astro:114 | margin-bottom (.panel-text) | 18px | --space-16 (16px) — Δ2px |
| src/components/ProjectRow.astro:121 | margin-left (.panel-meta span strong) | 6px | --space-4 (4px) / --space-8 (8px) — Δ2px each |
| src/components/ProjectRow.astro:126 | padding-left (.panel-inner ≤900px) | 150px | --space-128 (128px) — Δ22px (off-scale; layout indent) |
| src/components/Slideshow.astro:63 | margin-bottom (.slideshow-controls) | 28px | --space-24 (24px) / --space-32 (32px) — Δ4px each |

**Note:** the two large `.panel-inner` left-paddings (200px / 150px) are a
layout indent that clears the absolutely-positioned brand column — they're
spacing by property but layout-structural by intent. Probably better resolved as
a dedicated layout token than forced onto the spacing scale.

---

## Line-height

| File:line | Property (selector) | Value | Role alias → current value |
| --- | --- | --- | --- |
| src/pages/experience.astro:107 | line-height (.statement h1) | 1 | --leading-h1 → 1.05 (tight) — Δ0.05 |
| src/pages/experience.astro:108 | line-height (.statement p) | 1.4 | --leading-h2 → 1.2 (snug); value sits between snug and normal (1.5) |
| src/pages/experience.astro:134 | line-height (.stat-num) | 1 | --leading-display → 1.05 (tight) — Δ0.05 |
| src/pages/experience.astro:135 | line-height (.stat-label) | 1.4 | --leading-caption → 1.5 (normal) — Δ0.1 |
| src/components/Footer.astro:28 | line-height (.footer-content p) | 22px | --leading-label → 1.05 (tight) — **fixed px, not a ratio**; needs a unit decision before it can map to a unitless primitive |
| src/components/ProjectRow.astro:77 | line-height (.row-title) | 1.3 | --leading-h3 → 1.2 (snug) — Δ0.1 |
| src/components/ProjectRow.astro:112 | line-height (.panel-text) | 1.6 | --leading-body → 1.5 (normal) — Δ0.1 |

**Note:** several values cluster ~0.1 above their role's starting primitive
(stat-label 1.4 vs 1.5, row-title 1.3 vs 1.2, panel-text 1.6 vs 1.5). Triage
could either re-point the role aliases at a closer primitive (or add one) or
accept the small shift onto the existing scale.

---

## Letter-spacing

Role = the `--font-size-*` token the element consumes. Most of these are
uppercase micro-labels (role `label`, alias `--tracking-label` = 0.08em = wide).
Their hardcoded values are **px-based** while the primitive is **em-based**, so
the mismatch is partly a unit choice — see closing note.

| File:line | Property (selector) | Value | Role alias → current value |
| --- | --- | --- | --- |
| src/components/Navbar.astro:33 | letter-spacing (.logo) | 4.32px | --tracking-body → 0 (normal) — off-scale; wide logotype tracking |
| src/components/Navbar.astro:34 | letter-spacing (.logo .light) | 7.92px | --tracking-body → 0 (normal) — off-scale; wide logotype tracking |
| src/components/Footer.astro:28 | letter-spacing (.footer-content p) | 0.24px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/components/ProjectRow.astro:58 | letter-spacing (.brand-text) | 0.8px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/components/ProjectRow.astro:79 | letter-spacing (.row-discipline) | 0.72px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/components/ProjectRow.astro:118 | letter-spacing (.panel-meta) | 0.72px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/pages/experience.astro:117 | letter-spacing (.section-label) | 0.96px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/pages/experience.astro:144 | letter-spacing (.logo-cell) | 1px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/pages/experience.astro:164 | letter-spacing (.index-col-head) | 0.96px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/pages/experience.astro:171 | letter-spacing (.bottom-note) | 0.96px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/components/Slideshow.astro:76 | letter-spacing (.slideshow-counter) | 0.72px | --tracking-label → 0.08em (≈0.88px @ 11px) |
| src/components/Slideshow.astro:83 | letter-spacing (.slideshow-status) | 0.96px | --tracking-label → 0.08em (≈0.88px @ 11px) |

**Note:** the label-role values all sit in a tight 0.72–1px band, and
`--tracking-wide` (0.08em ≈ 0.88px at the 11px label size) lands right in the
middle of it. If triage is willing to accept em-based tracking (which scales with
font-size) or to add a px-based label primitive, most of these twelve could
collapse onto a single token. The two `.logo` values are deliberately much wider
and are a separate, off-scale case.
