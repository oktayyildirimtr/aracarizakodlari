/**
 * Build sonrası sitemap üretir. Google SEO uyumlu sitemap index + alt sitemap yapısı.
 *
 * Üretilen dosyalar (dist/):
 * - sitemap.xml           → Sitemap index (yalnızca alt sitemaplere referans)
 * - sitemap-pages.xml     → Statik / öncelikli sayfalar (ana sayfa, /en, /tr, iletişim, vb.)
 * - sitemap-en-codes.xml  → İngilizce OBD kod sayfaları (lastmod/priority/changefreq yok)
 * - sitemap-tr-codes.xml  → Türkçe OBD kod sayfaları (lastmod/priority/changefreq yok)
 *
 * Tüm URL'ler: HTTPS, www yok, trailing slash yok (canonical ile uyumlu).
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

/** URL'de trailing slash olmamalı (trailingSlash: never; canonical ile aynı). */
function url(path) {
  const p = path.replace(/^\//, '').trim().replace(/\/+$/, '');
  return p ? `${SITE}/${p}` : SITE + '/';
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Statik sayfalar (sitemap-pages.xml). "/" dahil edilmez — root noindex; /en tek canonical homepage. */
function getStaticPageUrls() {
  return [
    url('en'),
    url('tr'),
    url('en/codes'),
    url('tr/kodlar'),
    url('en/about'),
    url('tr/hakkimizda'),
    url('en/contact'),
    url('tr/iletisim'),
    url('en/privacy-policy'),
    url('tr/gizlilik-politikasi'),
    url('en/cookie-policy'),
    url('tr/cerez-bildirimi'),
    url('en/terms-of-service'),
    url('tr/kullanim-kosullari'),
  ];
}

/** Sitemap index'te child sitemap'lerin lastmod'u = üretim tarihi. */
function getIndexLastmod() {
  return new Date().toISOString().slice(0, 10);
}

/** DB'den sitemap'e dahil edilecek kod listesi. */
function getSitemapCodes() {
  if (!existsSync(dbPath)) return [];
  const db = new Database(dbPath, { readonly: true });
  const limit = BATCH != null && BATCH > 0 ? BATCH : null;
  const sql = limit
    ? 'SELECT code FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code LIMIT ?'
    : 'SELECT code FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code';
  const rows = limit ? db.prepare(sql).all(limit) : db.prepare(sql).all();
  db.close();
  return rows.map((r) => r.code);
}

// --- Sitemap index (sitemap.xml) ---
function writeSitemapIndex(lastmod) {
  const entries = [
    { loc: `${SITE}/sitemap-pages.xml` },
    { loc: `${SITE}/sitemap-en-codes.xml` },
    { loc: `${SITE}/sitemap-tr-codes.xml` },
  ];
  const body = entries
    .map((e) => `  <sitemap>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
  writeFileSync(join(dist, 'sitemap.xml'), xml, 'utf8');
}

// --- Static pages (sitemap-pages.xml): only <loc>, no lastmod ---
function writeSitemapPages() {
  const urls = getStaticPageUrls();
  const urlset = urls.map((loc) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
  writeFileSync(join(dist, 'sitemap-pages.xml'), xml, 'utf8');
  return urls.length;
}

// --- Code sitemaps: only <loc>; optional hreflang alternate ---
function writeSitemapEnCodes(codes) {
  const ns = ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  const urlEntries = codes.map((code) => {
    const loc = url(`en/${code.toLowerCase()}-meaning`);
    const altTr = url(`tr/${code.toLowerCase()}-nedir`);
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(loc)}"/>
    <xhtml:link rel="alternate" hreflang="tr" href="${escapeXml(altTr)}"/>
  </url>`;
  });
  const urlset = urlEntries.join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${ns}>
${urlset}
</urlset>
`;
  writeFileSync(join(dist, 'sitemap-en-codes.xml'), xml, 'utf8');
  return codes.length;
}

function writeSitemapTrCodes(codes) {
  const ns = ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  const urlEntries = codes.map((code) => {
    const loc = url(`tr/${code.toLowerCase()}-nedir`);
    const altEn = url(`en/${code.toLowerCase()}-meaning`);
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="${escapeXml(loc)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(altEn)}"/>
  </url>`;
  });
  const urlset = urlEntries.join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${ns}>
${urlset}
</urlset>
`;
  writeFileSync(join(dist, 'sitemap-tr-codes.xml'), xml, 'utf8');
  return codes.length;
}

function run() {
  if (!existsSync(dist)) {
    console.warn('generate-sitemap: dist/ yok. Önce npm run build çalıştır.');
    process.exitCode = 1;
    return;
  }

  const lastmod = getIndexLastmod();
  writeSitemapIndex(lastmod);

  const pageCount = writeSitemapPages();
  const codes = getSitemapCodes();
  const enCount = writeSitemapEnCodes(codes);
  const trCount = writeSitemapTrCodes(codes);

  // Eski tek dosyalı sitemap veya farklı isimli index dosyaları varsa kaldır (çakışma olmasın)
  const legacy = ['sitemap-index.xml', 'sitemap-0.xml'];
  legacy.forEach((f) => {
    const p = join(dist, f);
    if (existsSync(p)) unlinkSync(p);
  });

  console.log('Sitemap index: dist/sitemap.xml');
  console.log('  sitemap-pages.xml:  ' + pageCount + ' URL');
  console.log('  sitemap-en-codes.xml: ' + enCount + ' URL');
  console.log('  sitemap-tr-codes.xml: ' + trCount + ' URL');
}

run();
