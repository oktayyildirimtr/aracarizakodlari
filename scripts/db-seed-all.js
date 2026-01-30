/**
 * Tüm OBD-II kodlarını (fault-codes-data) DB'ye ekler. Zaten var olan kodları atlar.
 * Önce npm run db:seed (ve gerekirse db:migrate) çalıştırılmış olmalı.
 */
import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';
import { getAllObd2Codes } from './fault-codes-data.js';
import { TOP_30_CODES } from './top-codes.js';

const dbPath = join(process.cwd(), 'data', 'ariza.db');

const EXPERT = 'Kod tek başına hangi parçanın arızalı olduğunu söylemez; araç ve ölçüm farklı sonuçlar çıkarabilir. OBD-II okuma ve gerekli kontroller için mutlaka yetkili servise gidin.';
const DRIVE = 'Kısa mesafe, düşük yükle kullanılabilir. Uzun yol ya da ağır yük önerilmez; en kısa sürede teşhis yaptırın.';

if (!existsSync(dbPath)) {
  console.error('Veritabanı yok. Önce: npm run db:init && npm run db:migrate && npm run db:seed');
  process.exit(1);
}

const db = new Database(dbPath);
const topSet = new Set(TOP_30_CODES);
const insert = db.prepare(
  `INSERT INTO fault_codes (code, title_tr, description_tr, expert_opinion_tr, drive_safe_tr, noindex, sitemap_include, category, description_en, updated_at)
   VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, datetime('now'))`
); // sitemap_include: 1 = top 30 (sayfada göster), 0 = DB'de tut, sayfada gösterme

const exists = db.prepare('SELECT 1 FROM fault_codes WHERE code = ?');
const updateDesc = db.prepare('UPDATE fault_codes SET description_tr = ?, description_en = ? WHERE code = ?');
const codes = getAllObd2Codes();
let added = 0;
let updated = 0;

for (const row of codes) {
  if (exists.get(row.code)) {
    updateDesc.run(row.description_tr, row.description_en || null, row.code);
    updated++;
    continue;
  }
  const sitemapInclude = topSet.has(row.code) ? 1 : 0;
  insert.run(row.code, row.title_tr, row.description_tr, EXPERT, DRIVE, sitemapInclude, row.category || null, row.description_en || null);
  added++;
}

db.close();
console.log(`Tamamlandı. ${added} yeni arıza kodu eklendi${updated ? `, ${updated} mevcut kodun açıklaması güncellendi` : ''} (toplam ${codes.length} kod işlendi).`);
