/**
 * Sitemap ve listede görünecek kod sayısını ayarlar. İlk N kod (code sırasına göre) sitemap_include=1 olur, diğerleri DB'de kalır (sitemap_include=0).
 * Daha fazla kod eklemek için: ARIZA_VISIBLE_CODES=300 npm run db:set-top-codes
 */
import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';

const VISIBLE_LIMIT = process.env.ARIZA_VISIBLE_CODES ? parseInt(process.env.ARIZA_VISIBLE_CODES, 10) : 200;
const dbPath = join(process.cwd(), 'data', 'ariza.db');

if (!existsSync(dbPath)) {
  console.error('Veritabanı bulunamadı. Önce npm run db:init && npm run db:seed çalıştırın.');
  process.exit(1);
}

const db = new Database(dbPath);

db.prepare('UPDATE fault_codes SET sitemap_include = 0').run();
const codes = db.prepare('SELECT code FROM fault_codes WHERE noindex = 0 ORDER BY code LIMIT ?').all(VISIBLE_LIMIT);
const setOne = db.prepare('UPDATE fault_codes SET sitemap_include = 1 WHERE code = ?');
let updated = 0;
for (const row of codes) {
  setOne.run(row.code);
  updated++;
}
db.close();

console.log(`${updated} kod sitemap_include=1 yapıldı (limit: ${VISIBLE_LIMIT}). Diğer kodlar DB'de duruyor.`);
console.log('Daha fazla eklemek için: ARIZA_VISIBLE_CODES=300 npm run db:set-top-codes');
