import { defineConfig } from 'astro/config';

// https://astro.build/config
// Sitemap: build sonrası scripts/generate-sitemap.js ile üretiliyor (@astrojs/sitemap _routes reduce hatası nedeniyle)
export default defineConfig({
  site: 'https://arizakodlari.com',
  output: 'static',
  integrations: [],
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
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
