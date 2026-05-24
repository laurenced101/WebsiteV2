// Maps a stored Notion image path (e.g. "/src/assets/notion/covers/<id>.webp",
// written by scripts/fetch-projects.mjs) to the build-optimized asset Astro's
// <Image> needs.
//
// import.meta.glob eagerly imports every fetched image so Astro/Sharp processes
// them at build time (resize, modern formats, hashed filenames). The glob keys
// are project-root-relative and match exactly what the fetch script stores, so
// resolveImage() is a direct lookup. Returns undefined for a missing/unknown
// path — callers should guard (e.g. only render <Image> when truthy).
const modules = import.meta.glob(
  '/src/assets/notion/**/*.{webp,png,jpg,jpeg,avif,gif}',
  { eager: true },
);

export function resolveImage(path) {
  if (!path) return undefined;
  return modules[path]?.default;
}
