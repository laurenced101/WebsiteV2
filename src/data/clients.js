// Curated "Selected partners & clients" logo wall for /experience.
// The wall renders in THIS order, so reorder the array to reorder the wall.
// `file` must match the exact filename in src/assets/clients/ — case-sensitive
// on the Vercel/Linux build (e.g. LEGO.webp, magic-leap.webp). Pre-treated
// transparent webp with the gradient baked in (see that folder's README).
//
// Optional per-logo controls:
//   scale        — multiplies the in-cell size caps (for delicate marks).
//   hideOnMobile — drop from the ≤800 grid (keeps it a clean 3×3).
export const clients = [
  { name: 'Disney', file: 'Disney.webp' },
  { name: 'Meta', file: 'Meta.webp' },
  { name: 'LEGO', file: 'LEGO.webp' },
  { name: 'Google', file: 'Google.webp' },
  { name: 'Snap', file: 'Snap.webp' },
  { name: 'Amazon', file: 'Amazon.webp' },
  { name: 'Magic Leap', file: 'magic-leap-dark.webp', scale: 1.4 },
  { name: 'Niantic', file: 'Niantic.webp' },
  { name: 'Bose', file: 'Bose.webp' },
  { name: 'Qualcomm', file: 'Qualcomm.webp', hideOnMobile: true },  // 10th — dropped on mobile for a clean 3×3 (#23)
];
