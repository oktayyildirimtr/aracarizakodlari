/**
 * Build sonrası sitemap üretir. Multi-language: /tr/ ve /en/
 *
 * Kullanım: npm run build (build komutu bu scripti çalıştırır)
 */

import Database from 'better-sqlite3';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const dist = join(root, 'dist');
const dbPath = join(root, 'data', 'ariza.db');

const SITE = 'https://obdfaultcode.com';
const BATCH = process.env.ARIZA_BATCH_LIMIT
  ? parseInt(process.env.ARIZA_BATCH_LIMIT, 10)
  : null;

/** Ensure URL has trailing slash to match canonical (sitemap must match canonical exactly). */
function withTrailingSlash(url) {
  return url.endsWith('/') ? url : url + '/';
}

function collectUrls() {
  const staticUrls = [
    SITE + '/',
    withTrailingSlash(SITE + '/tr'),
    withTrailingSlash(SITE + '/en'),
    withTrailingSlash(SITE + '/tr/kodlar'),
    withTrailingSlash(SITE + '/en/codes'),
    withTrailingSlash(SITE + '/tr/hakkimizda'),
    withTrailingSlash(SITE + '/en/about'),
    withTrailingSlash(SITE + '/tr/iletisim'),
    withTrailingSlash(SITE + '/en/contact'),
    withTrailingSlash(SITE + '/tr/gizlilik-politikasi'),
    withTrailingSlash(SITE + '/en/privacy-policy'),
    withTrailingSlash(SITE + '/tr/cerez-bildirimi'),
    withTrailingSlash(SITE + '/en/cookie-policy'),
    withTrailingSlash(SITE + '/tr/kullanim-kosullari'),
    withTrailingSlash(SITE + '/en/terms-of-service'),
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
    urls.push(withTrailingSlash(SITE + '/tr/' + code.toLowerCase() + '-nedir'));
    urls.push(withTrailingSlash(SITE + '/en/' + code.toLowerCase() + '-meaning'));
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
  const lastmod = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const urlset = urls
    .map((loc) => `  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

  writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf8');
  [ 'sitemap-index.xml', 'sitemap-0.xml' ].forEach((f) => {
    const p = join(dist, f);
    if (existsSync(p)) unlinkSync(p);
  });
  console.log('Sitemap yazıldı: dist/sitemap.xml (' + urls.length + ' URL)');
}

writeSitemap();
