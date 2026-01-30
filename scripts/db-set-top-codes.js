/**
 * Sadece en çok aranan 30 arıza kodunu sayfada gösterir.
 * Diğer tüm kodlar sitemap_include=0 yapılır, DB'de kalır.
 * Top 30 kodlar sitemap_include=1 olur.
 */
import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TOP_30_CODES } from './top-codes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'ariza.db');

if (!existsSync(dbPath)) {
  console.error('Veritabanı bulunamadı. Önce npm run db:init && npm run db:seed çalıştırın.');
  process.exit(1);
}

const db = new Database(dbPath);

// Tüm kodları gizle
const hideAll = db.prepare('UPDATE fault_codes SET sitemap_include = 0');
hideAll.run();
console.log(`Tüm kodlar sitemap_include=0 yapıldı.`);

// Top 30'u göster (DB'de varsa)
let activated = 0;
const activate = db.prepare('UPDATE fault_codes SET sitemap_include = 1 WHERE code = ?');
for (const code of TOP_30_CODES) {
  const r = activate.run(code);
  if (r.changes > 0) activated++;
}

db.close();
console.log(`${activated} kod sitemap_include=1 yapıldı (toplam ${TOP_30_CODES.length} hedefleniyor).`);
console.log('Şimdilik sadece bu kodlar ana sayfa, /kodlar ve sitemap\'te görünecek.');
