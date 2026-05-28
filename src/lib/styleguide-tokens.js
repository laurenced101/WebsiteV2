// Shared token-editor helpers for the styleguide and its pop-out editor.
//
// The /styleguide page (host) and /styleguide-editor page (pop-out) run in two
// separate browser windows that talk over window.opener (same origin). This
// module is the pure, DOM-free vocabulary they both need — breakpoint tiers,
// the alias-set definitions, and small value helpers — so the two pages can't
// drift out of sync. Anything that touches the DOM lives in the pages, not here.

export const STORE_KEY = 'sg-token-overrides';

// The four tested breakpoint tiers, in token-suffix form. Mirrors the media
// queries at the bottom of tokens.css (Large 1800+, Desktop ≤1799, Tablet
// ≤1279, Mobile ≤800). Order = large→mobile for stable iteration in export.
export const TIERS = ['large', 'desktop', 'tablet', 'mobile'];

// Which tier a viewport width falls in. Single source of the thresholds so the
// host indicator and the editor's "currently editing" badge never disagree.
export function tierFor(width) {
  if (width >= 1800) return 'large';
  if (width >= 1280) return 'desktop';
  if (width >= 801) return 'tablet';
  return 'mobile';
}

export const TIER_LABELS = {
  large: 'Large Desktop',
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};
export const tierLabel = (key) => TIER_LABELS[key] || key;

// Type roles that carry a full alias set (color / weight / leading / tracking).
export const ROLES = ['display', 'h1', 'h2', 'h3', 'body', 'caption', 'label'];

// Primitive option-lists the per-role aliases point at.
export const LEADING_PRIMS = ['--leading-tight', '--leading-snug', '--leading-normal', '--leading-loose'];
export const TRACKING_PRIMS = ['--tracking-tight', '--tracking-normal', '--tracking-wide'];
export const COLOR_PRIMS = ['--color-primary', '--ink', '--grey-mid', '--grey-light', '--surface'];
export const WEIGHT_PRIMS = ['--font-weight-light', '--font-weight-regular', '--font-weight-medium', '--font-weight-semibold', '--font-weight-bold'];

export const LEADING_ALIASES = ROLES.map((r) => `--leading-${r}`);
export const TRACKING_ALIASES = ROLES.map((r) => `--tracking-${r}`);
export const TEXT_ALIASES = ROLES.map((r) => `--text-${r}`);
export const WEIGHT_ALIASES = ROLES.map((r) => `--weight-${r}`);

// Used by the host's on-page "alias → primitive" readouts and the editor's
// export (which alias set maps onto which primitives).
export const ALIAS_SETS = [
  { aliases: LEADING_ALIASES, prims: LEADING_PRIMS },
  { aliases: TRACKING_ALIASES, prims: TRACKING_PRIMS },
  { aliases: TEXT_ALIASES, prims: COLOR_PRIMS },
  { aliases: WEIGHT_ALIASES, prims: WEIGHT_PRIMS },
];

// Which primitive an alias currently points at. `readVal` is injected so this
// can read whichever window's computed styles the caller cares about. Robust to
// either getComputedStyle behavior: a custom property reading back as "var(--x)"
// (literal) or as the resolved value of --x. Tries the literal name, then value.
export function aliasTarget(readVal, aliasName, prims) {
  const raw = readVal(aliasName);
  const m = raw.match(/var\(\s*(--[\w-]+)\s*\)/);
  if (m) return m[1];
  return prims.find((p) => readVal(p) === raw) || prims[0];
}

// Friendly option label: drop the family prefix (--leading-/--tracking-/--color-
// /--font-weight-) or just the leading -- so --leading-tight → "tight", --ink → "ink".
export const shortName = (p) => p.replace(/^--(leading-|tracking-|color-|font-weight-)?/, '');

export const isHex = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);
