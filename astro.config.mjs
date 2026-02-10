import { defineConfig } from 'astro/config';

// https://astro.build/config
// Sitemap: build sonrası scripts/generate-sitemap.js ile üretiliyor (@astrojs/sitemap _routes reduce hatası nedeniyle)
//
// URL & redirect policy (do not change without review):
// - trailingSlash: handled by Astro; site uses non–trailing-slash URLs (/en, /tr, /en/contact).
// - HTTP→HTTPS and www handling: done by Cloudflare (e.g. "Redirect from HTTP to HTTPS" template).
// - Do not add extra redirect rules in Astro or in _redirects that could cause redirect loops.
// - Canonicals and internal links must stay slash-free and match this config.
export default defineConfig({
  site: 'https://obdfaultcode.com',
  base: '/',
  output: 'static',
  integrations: [],
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  vite: {
    ssr: {
      external: ['better-sqlite3'],
    },
    optimizeDeps: {
      exclude: ['better-sqlite3'],
    },
  },
});
