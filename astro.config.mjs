import { defineConfig } from 'astro/config';

// https://astro.build/config
// Sitemap: build sonrası scripts/generate-sitemap.js ile üretiliyor (@astrojs/sitemap _routes reduce hatası nedeniyle)
export default defineConfig({
  site: 'https://arizakodlari.com',
  base: '/',
  output: 'static',
  integrations: [],
  trailingSlash: 'never',
  compressHTML: true,
  build: {
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
