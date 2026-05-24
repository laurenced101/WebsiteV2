import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://laurence-dawes.design',
  output: 'static',
  // Self-hosted fonts (replaces the render-blocking Google Fonts <link>).
  // Astro downloads + optimizes the files at build, serves them same-origin
  // (hashed, immutably cached), and — via the <Font> component in <head> —
  // emits the @font-face CSS, a preload link for the primary family, and an
  // automatic metric-adjusted fallback (optimizedFallbacks, on by default) so
  // text doesn't reflow when the webfont swaps in (kills the font-swap CLS).
  // Space Grotesk is a variable font → one file covers the whole 300–700 range.
  // Space Mono is styleguide-only; its @font-face is declared but only fetched
  // on pages that actually reference --font-space-mono.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: ['300 700'],
      styles: ['normal'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Mono',
      cssVariable: '--font-space-mono',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
});
