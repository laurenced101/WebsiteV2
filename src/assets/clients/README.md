# Client / partner logos

Pre-treated logo assets for the "Selected partners & clients" wall on `/experience`.
This is a **curated** set (independent of the project logos pulled from Notion).

## How to add a logo

1. Export from Figma as a **transparent PNG** with the gradient baked in
   (these are raster, not SVG — the gradient can't be a CSS tint).
2. Size **~2–3× display size** (≈400–600px on the long edge is plenty). Astro
   downsizes, converts to WebP, and generates a responsive `srcset` at build, so
   they stay crisp on retina without hand-optimising.
3. Name the file by brand in **kebab-case**: `lego.png`, `magic-leap.png`,
   `morgan-stanley.png`, `black-eyed-peas.png`, etc.
4. Drop it in this folder.

## Order

The wall renders in the order listed in the manifest (`src/data/clients.js`),
**not** alphabetically or by filename — so the order is curated to match the
approved layout. Update the manifest to add / remove / reorder.

Rendered contained + centred in each cell, solid (no hover, no greyscale).
