/**
 * Mevcut veritabanına yeni sütunlar ekler. db-init sonrası veya güncelleme sonrası çalıştırın.
 */
import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'ariza.db');

if (!existsSync(dbPath)) {
  console.log('Veritabanı yok; db-migrate atlanıyor.');
  process.exit(0);
}

const db = new Database(dbPath);
const cols = db.prepare('PRAGMA table_info(fault_codes)').all().map((r) => r.name);

if (!cols.includes('category')) {
  db.exec('ALTER TABLE fault_codes ADD COLUMN category TEXT');
  console.log('fault_codes.category eklendi.');
} else {
  console.log('fault_codes.category zaten mevcut.');
}

if (!cols.includes('description_en')) {
  db.exec('ALTER TABLE fault_codes ADD COLUMN description_en TEXT');
  console.log('fault_codes.description_en eklendi.');
}
if (!cols.includes('title_en')) {
  db.exec('ALTER TABLE fault_codes ADD COLUMN title_en TEXT');
  console.log('fault_codes.title_en eklendi.');
}
if (!cols.includes('expert_opinion_en')) {
  db.exec('ALTER TABLE fault_codes ADD COLUMN expert_opinion_en TEXT');
  console.log('fault_codes.expert_opinion_en eklendi.');
}
if (!cols.includes('drive_safe_en')) {
  db.exec('ALTER TABLE fault_codes ADD COLUMN drive_safe_en TEXT');
  console.log('fault_codes.drive_safe_en eklendi.');
}

const faqCols = db.prepare('PRAGMA table_info(faq)').all().map((r) => r.name);
if (!faqCols.includes('question_en')) {
  db.exec('ALTER TABLE faq ADD COLUMN question_en TEXT');
  console.log('faq.question_en eklendi.');
}
if (!faqCols.includes('answer_en')) {
  db.exec('ALTER TABLE faq ADD COLUMN answer_en TEXT');
  console.log('faq.answer_en eklendi.');
}

const costCols = db.prepare('PRAGMA table_info(estimated_costs)').all().map((r) => r.name);
if (!costCols.includes('notes_en')) {
  db.exec('ALTER TABLE estimated_costs ADD COLUMN notes_en TEXT');
  console.log('estimated_costs.notes_en eklendi.');
}
if (!costCols.includes('min_usd')) {
  db.exec('ALTER TABLE estimated_costs ADD COLUMN min_usd INTEGER');
  console.log('estimated_costs.min_usd eklendi.');
}
if (!costCols.includes('max_usd')) {
  db.exec('ALTER TABLE estimated_costs ADD COLUMN max_usd INTEGER');
  console.log('estimated_costs.max_usd eklendi.');
}

['symptoms', 'causes', 'solutions'].forEach((tbl) => {
  const tblCols = db.prepare(`PRAGMA table_info(${tbl})`).all().map((r) => r.name);
  if (!tblCols.includes('text_en')) {
    db.exec(`ALTER TABLE ${tbl} ADD COLUMN text_en TEXT`);
    console.log(`${tbl}.text_en eklendi.`);
  }
});

db.close();
console.log('Migration tamamlandı.');
