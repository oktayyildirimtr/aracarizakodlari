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

const EXPERT_TR = 'Kod tek başına hangi parçanın arızalı olduğunu söylemez; araç ve ölçüm farklı sonuçlar çıkarabilir. OBD-II okuma ve gerekli kontroller için mutlaka yetkili servise gidin.';
const DRIVE_TR = 'Kısa mesafe, düşük yükle kullanılabilir. Uzun yol ya da ağır yük önerilmez; en kısa sürede teşhis yaptırın.';
const EXPERT_EN = 'The code alone does not identify the faulty part; vehicle and measurement can yield different results. Have OBD-II reading and necessary checks done at a qualified workshop.';
const DRIVE_EN = 'Short trips at low load are acceptable. Long journeys or heavy loads are not recommended; get a diagnosis as soon as possible.';

if (!existsSync(dbPath)) {
  console.error('Veritabanı yok. Önce: npm run db:init && npm run db:migrate && npm run db:seed');
  process.exit(1);
}

const db = new Database(dbPath);
const topSet = new Set(TOP_30_CODES);
const insert = db.prepare(
  `INSERT INTO fault_codes (code, title_tr, title_en, description_tr, description_en, expert_opinion_tr, expert_opinion_en, drive_safe_tr, drive_safe_en, noindex, sitemap_include, category, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, datetime('now'))`
);

const exists = db.prepare('SELECT 1 FROM fault_codes WHERE code = ?');
const updateDesc = db.prepare(
  `UPDATE fault_codes SET description_tr = ?, description_en = ?, title_en = ?, expert_opinion_en = ?, drive_safe_en = ? WHERE code = ?`
);
const codes = getAllObd2Codes();
let added = 0;
let updated = 0;

for (const row of codes) {
  const titleEn = row.description_en ? `${row.code} OBD2 Error Code - ${row.description_en}` : `${row.code} OBD2 Error Code`;
  if (exists.get(row.code)) {
    updateDesc.run(
      row.description_tr,
      row.description_en || null,
      titleEn,
      EXPERT_EN,
      DRIVE_EN,
      row.code
    );
    updated++;
    continue;
  }
  const sitemapInclude = topSet.has(row.code) ? 1 : 0;
  insert.run(
    row.code,
    row.title_tr,
    titleEn,
    row.description_tr,
    row.description_en || null,
    EXPERT_TR,
    EXPERT_EN,
    DRIVE_TR,
    DRIVE_EN,
    sitemapInclude,
    row.category || null
  );
  added++;
}

db.close();
console.log(`Tamamlandı. ${added} yeni arıza kodu eklendi${updated ? `, ${updated} mevcut kodun açıklaması güncellendi` : ''} (toplam ${codes.length} kod işlendi).`);
