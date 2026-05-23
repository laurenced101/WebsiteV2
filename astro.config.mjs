import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://laurence-dawes.design',
  output: 'static',
  // Stopgap: no index page exists yet, so the bare root would 404.
  // Forward / → /experience until the HOME page is built.
  redirects: {
    '/': '/experience',
  },
});
