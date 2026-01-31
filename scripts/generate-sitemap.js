/**
 * Build sonrası sitemap üretir. Astro @astrojs/sitemap ile _routes reduce hatası
 * alındığı için özel script kullanıyoruz.
 *
 * Kullanım: npm run build (build komutu bu scripti çalıştırır)
 */

import Database from 'better-sqlite3';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = process.cwd();
const dist = join(root, 'dist');
const dbPath = join(root, 'data', 'ariza.db');

const SITE = 'https://aracarizakodlari.pages.dev';
const BATCH = process.env.ARIZA_BATCH_LIMIT
  ? parseInt(process.env.ARIZA_BATCH_LIMIT, 10)
  : null;

function toSlug(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function collectUrls() {
  if (!existsSync(dbPath)) {
    console.warn('generate-sitemap: data/ariza.db yok, statik sayfalar ekleniyor.');
    return [
      SITE + '/',
      SITE + '/kodlar',
      SITE + '/hakkimizda',
      SITE + '/gizlilik-politikasi',
      SITE + '/cerez-bildirimi',
      SITE + '/iletisim',
    ];
  }

  const db = new Database(dbPath, { readonly: true });
  const limit = BATCH != null && BATCH > 0 ? BATCH : null;
  const fcSql = limit
    ? 'SELECT code FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code LIMIT ?'
    : 'SELECT code FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code';
  const codes = (limit ? db.prepare(fcSql).all(limit) : db.prepare(fcSql).all()).map((r) => r.code);

  const urls = [
    SITE + '/',
    SITE + '/kodlar',
    SITE + '/hakkimizda',
    SITE + '/gizlilik-politikasi',
    SITE + '/cerez-bildirimi',
    SITE + '/iletisim',
  ];

  for (const code of codes) {
    urls.push(SITE + '/' + code.toLowerCase() + '-nedir');
  }

  if (codes.length === 0) {
    db.close();
    return [...new Set(urls)];
  }

  const ph = codes.map(() => '?').join(',');
  const rows = db.prepare(
    `SELECT ab.brand, ab.model, fc.code FROM affected_brands ab
     JOIN fault_codes fc ON fc.id = ab.fault_code_id
     WHERE fc.noindex = 0 AND fc.sitemap_include = 1 AND fc.code IN (${ph})
     ORDER BY ab.brand, ab.model, fc.code`
  ).all(...codes);

  for (const r of rows) {
    urls.push(SITE + '/' + toSlug(r.brand) + '-' + toSlug(r.model) + '-' + r.code.toLowerCase());
  }

  db.close();
  return [...new Set(urls)];
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function writeSitemap() {
  if (!existsSync(dist)) {
    console.warn('generate-sitemap: dist/ yok. Önce npm run build çalıştır.');
    process.exitCode = 1;
    return;
  }

  const urls = collectUrls();
  const urlset = urls
    .map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`)
    .join('\n');

  const sitemap0 = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

  const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(SITE + '/sitemap-0.xml')}</loc>
  </sitemap>
</sitemapindex>
`;

  writeFileSync(join(dist, 'sitemap-0.xml'), sitemap0, 'utf8');
  writeFileSync(join(dist, 'sitemap-index.xml'), index, 'utf8');
  console.log('Sitemap yazıldı: dist/sitemap-index.xml, dist/sitemap-0.xml (' + urls.length + ' URL)');
}

writeSitemap();
