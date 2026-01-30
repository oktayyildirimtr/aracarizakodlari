/**
 * Mevcut veritabanına yeni sütunlar ekler. db-init sonrası veya güncelleme sonrası çalıştırın.
 */
import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'ariza.db');

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
} else {
  console.log('fault_codes.description_en zaten mevcut.');
}

db.close();
console.log('Migration tamamlandı.');
