/**
 * Sitemap ve listede görünecek kod sayısını ayarlar. Kodlar tüm aralıklardan (P01xx–P09xx)
 * dengeli seçilir; böylece sadece "hava-yakıt ölçüm" değil, ateşleme, egzoz, şanzıman vb. de görünür.
 * Daha fazla kod: ARIZA_VISIBLE_CODES=300 npm run db:set-top-codes
 */
import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';

const VISIBLE_LIMIT = process.env.ARIZA_VISIBLE_CODES ? parseInt(process.env.ARIZA_VISIBLE_CODES, 10) : 200;
const dbPath = join(process.cwd(), 'data', 'ariza.db');

/** OBD-II P0xxx aralık önekleri (fault-codes-data.js ile uyumlu). Her aralıktan kod seçilir. */
const RANGE_PREFIXES = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09'];

if (!existsSync(dbPath)) {
  console.error('Veritabanı bulunamadı. Önce npm run db:init && npm run db:seed çalıştırın.');
  process.exit(1);
}

const db = new Database(dbPath);

db.prepare('UPDATE fault_codes SET sitemap_include = 0').run();

const perRange = Math.ceil(VISIBLE_LIMIT / RANGE_PREFIXES.length);
const selByPrefix = db.prepare(
  'SELECT code FROM fault_codes WHERE noindex = 0 AND code LIKE ? ORDER BY code LIMIT ?'
);

const collected = [];
for (const prefix of RANGE_PREFIXES) {
  const rows = selByPrefix.all(prefix + '%', perRange);
  for (const r of rows) collected.push(r.code);
}

// Kod sırasına göre sıralayıp tam limit kadar al (bazen fazla olabilir)
collected.sort();
const codes = collected.slice(0, VISIBLE_LIMIT);

const setOne = db.prepare('UPDATE fault_codes SET sitemap_include = 1 WHERE code = ?');
for (const code of codes) {
  setOne.run(code);
}
db.close();

console.log(`${codes.length} kod sitemap_include=1 yapıldı (limit: ${VISIBLE_LIMIT}, tüm aralıklardan).`);
console.log('Daha fazla eklemek için: ARIZA_VISIBLE_CODES=300 npm run db:set-top-codes');
