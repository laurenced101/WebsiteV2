// Build-time fetcher: pulls the EXPERIENCE page's project data from the
// "Projects V2" Notion DB, downloads each project's Cover + Logo image into
// public/notion/, and writes src/data/projects.generated.js in the exact shape
// the template (ProjectRow.astro) consumes.
//
// Runs automatically before `npm run dev` / `npm run build` / `npm start`
// (predev / prebuild / prestart hooks). Re-downloads everything every run —
// no caching layer yet (per the Session 2 brief).
//
// Env: NOTION_API_KEY — a Notion internal-integration token with the Projects
// V2 database shared to it. Loaded from .env locally; injected via project
// settings on Vercel.
//
// Output shape (one record), matching the hardcoded src/data/projects.js:
//   { brand, brandLogoPath, title, desc, discipline, year, role, body, images }

import { Client } from '@notionhq/client';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// --- paths ---------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const MEDIA_DIR = join(ROOT, 'public', 'notion');     // gitignored download tree
const COVERS_DIR = join(MEDIA_DIR, 'covers');
const LOGOS_DIR = join(MEDIA_DIR, 'logos');
const OUT_FILE = join(ROOT, 'src', 'data', 'projects.generated.js');

// Public URL prefixes (what the browser requests; mirror MEDIA_DIR layout).
const COVERS_URL = '/notion/covers';
const LOGOS_URL = '/notion/logos';

const DATA_SOURCE_ID = '36912c70-512f-806b-a11d-000bce36d341';

// --- helpers -------------------------------------------------------------

// Best-effort .env load. On Vercel there's no .env (vars are injected), so a
// missing file is fine — swallow that case only.
function loadEnv() {
  try {
    process.loadEnvFile(join(ROOT, '.env'));
  } catch (err) {
    if (err?.code !== 'ENOENT') throw err;
  }
}

// rich_text / title property -> plain string (preserves embedded newlines).
const plain = (prop) =>
  (prop?.rich_text ?? prop?.title ?? []).map((t) => t.plain_text).join('').trim();

// First sentence of a block of text, for the short row blurb. Falls back to
// the whole (first paragraph) if no sentence terminator is found.
function firstSentence(text) {
  if (!text) return '';
  const firstPara = text.split('\n').find((l) => l.trim()) ?? text;
  const m = firstPara.match(/^[\s\S]*?[.!?](?=\s|$)/);
  return (m ? m[0] : firstPara).trim();
}

// Parse the "Project Details" property — line-based "Key: value" pairs like:
//   With: Magic Leap / For: Bose / Role: Design Director / When: 2025
// Returns { role, year } (either may be '').
function parseDetails(text) {
  const out = { role: '', year: '' };
  for (const line of (text || '').split('\n')) {
    const m = line.match(/^\s*([^:]+):\s*(.+?)\s*$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const value = m[2].trim();
    if (key === 'role') out.role = value;
    else if (key === 'when') out.year = value;
  }
  return out;
}

// First downloadable file URL from a Notion "files" property, or null.
function fileUrl(prop) {
  const f = prop?.files?.[0];
  if (!f) return null;
  return f.type === 'external' ? f.external?.url : f.file?.url ?? null;
}

// Derive a file extension from a (signed) URL's path, defaulting to .webp.
function extFromUrl(url, fallback = '.webp') {
  try {
    const path = new URL(url).pathname;
    const dot = path.lastIndexOf('.');
    if (dot === -1) return fallback;
    const ext = path.slice(dot).toLowerCase();
    return /^\.[a-z0-9]{2,5}$/.test(ext) ? ext : fallback;
  } catch {
    return fallback;
  }
}

// Download a URL to disk, returning the public path to reference.
async function download(url, destDir, basename, urlPrefix) {
  const ext = extFromUrl(url, destDir === LOGOS_DIR ? '.png' : '.webp');
  const filename = `${basename}${ext}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status} ${res.statusText} for ${basename}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(destDir, filename), buf);
  return `${urlPrefix}/${filename}`;
}

// --- main ----------------------------------------------------------------

async function main() {
  loadEnv();
  const token = process.env.NOTION_API_KEY;
  if (!token) {
    throw new Error(
      'NOTION_API_KEY is not set. Add it to .env locally (and to the Vercel ' +
        'project env settings for deploys). It must be an internal-integration ' +
        'token with the "Projects V2" database shared to it.',
    );
  }

  const notion = new Client({ auth: token });

  // Query: visible rows only, manually-curated order first then newest-created.
  // @notionhq/client v5 is data-source-centric — query the collection, not the DB.
  const query = {
    data_source_id: DATA_SOURCE_ID,
    filter: { property: 'Hidden', checkbox: { equals: false } },
    sorts: [
      { property: 'Sort Order', direction: 'ascending' },
      { timestamp: 'created_time', direction: 'descending' },
    ],
  };

  const rows = [];
  let cursor;
  do {
    const page = await notion.dataSources.query({ ...query, start_cursor: cursor });
    rows.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);

  console.log(`[fetch-projects] ${rows.length} visible project(s) from Notion.`);

  // Fresh media tree each run so removed/hidden rows don't leave orphans.
  await rm(MEDIA_DIR, { recursive: true, force: true });
  await mkdir(COVERS_DIR, { recursive: true });
  await mkdir(LOGOS_DIR, { recursive: true });

  const projects = [];
  for (const row of rows) {
    const p = row.properties;
    const brand = plain(p['Name']);
    const title = plain(p['Project Title']);
    const description = plain(p['Description']);
    const { role, year } = parseDetails(plain(p['Project Details']));

    const coverSrc = fileUrl(p['Cover']);
    const logoSrc = fileUrl(p['Logo']);

    const images = coverSrc
      ? [await download(coverSrc, COVERS_DIR, row.id, COVERS_URL)]
      : [];
    const brandLogoPath = logoSrc
      ? await download(logoSrc, LOGOS_DIR, row.id, LOGOS_URL)
      : null;

    if (!coverSrc) console.warn(`[fetch-projects] no Cover for "${brand} — ${title}"`);

    projects.push({
      brand,
      brandLogoPath,
      title,
      desc: firstSentence(description),
      discipline: p['Project Type']?.select?.name ?? '',
      year,
      role,
      body: description,
      images,
    });
  }

  const banner =
    '// AUTO-GENERATED by scripts/fetch-projects.mjs — do not edit by hand.\n' +
    '// Sourced from the "Projects V2" Notion DB at build time. Regenerate with\n' +
    '// `npm run fetch:projects` (also runs automatically before dev/build).\n\n';
  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${banner}export const projects = ${JSON.stringify(projects, null, 2)};\n`);

  const withLogo = projects.filter((p) => p.brandLogoPath).length;
  console.log(
    `[fetch-projects] wrote ${projects.length} project(s) to ${OUT_FILE.replace(ROOT + '/', '')} ` +
      `(${withLogo} with logo, ${projects.length - withLogo} wordmark-only).`,
  );
}

main().catch((err) => {
  console.error('[fetch-projects] FAILED:', err.message);
  process.exit(1);
});
