/**
 * Build sonrası sitemap üretir. Multi-language: /tr/ ve /en/
 *
 * Kullanım: npm run build (build komutu bu scripti çalıştırır)
 */

import Database from 'better-sqlite3';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const dist = join(root, 'dist');
const dbPath = join(root, 'data', 'ariza.db');

const SITE = 'https://www.obdfaultcode.com';
const BATCH = process.env.ARIZA_BATCH_LIMIT
  ? parseInt(process.env.ARIZA_BATCH_LIMIT, 10)
  : null;

function collectUrls() {
  const staticUrls = [
    SITE + '/',
    SITE + '/tr',
    SITE + '/en',
    SITE + '/tr/kodlar',
    SITE + '/en/codes',
    SITE + '/tr/hakkimizda',
    SITE + '/en/about',
    SITE + '/tr/iletisim',
    SITE + '/en/contact',
    SITE + '/tr/gizlilik-politikasi',
    SITE + '/en/privacy-policy',
    SITE + '/tr/cerez-bildirimi',
    SITE + '/en/cookie-policy',
    SITE + '/tr/kullanim-kosullari',
    SITE + '/en/terms-of-service',
  ];

  if (!existsSync(dbPath)) {
    console.warn('generate-sitemap: data/ariza.db yok, statik sayfalar ekleniyor.');
    return staticUrls;
  }

  const db = new Database(dbPath, { readonly: true });
  const limit = BATCH != null && BATCH > 0 ? BATCH : null;
  const fcSql = limit
    ? 'SELECT code FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code LIMIT ?'
    : 'SELECT code FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code';
  const codes = (limit ? db.prepare(fcSql).all(limit) : db.prepare(fcSql).all()).map((r) => r.code);
  db.close();

  const urls = [...staticUrls];
  for (const code of codes) {
    urls.push(SITE + '/tr/' + code.toLowerCase() + '-nedir');
    urls.push(SITE + '/en/' + code.toLowerCase() + '-meaning');
  }

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
  writeFileSync(join(dist, 'sitemap.xml'), index, 'utf8');
  console.log('Sitemap yazıldı: dist/sitemap.xml, dist/sitemap-index.xml, dist/sitemap-0.xml (' + urls.length + ' URL)');
}

writeSitemap();
