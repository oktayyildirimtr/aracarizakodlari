/**
 * Tek bir arıza kodunu JSON dosyasından okuyup veritabanına ekler.
 * Kullanım: node scripts/add-fault-code.js <path-to.json>
 *
 * JSON formatı: db-seed.js içindeki fault code yapısına uyumlu olmalı.
 * Örnek alanlar: code, title_tr, description_tr, expert_opinion_tr, drive_safe_tr,
 * symptoms[], causes[], solutions[], affected_brands[], estimated_cost{}, faq[], related_codes[].
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'ariza.db');
const db = new Database(dbPath);

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error('Kullanım: node scripts/add-fault-code.js <path-to.json>');
  process.exit(1);
}

const raw = readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(raw);

const now = new Date().toISOString();
const insert = (table, row) => {
  const keys = Object.keys(row);
  const placeholders = keys.map(() => '?').join(', ');
  db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`).run(...keys.map((k) => row[k]));
};

try {
  const existing = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get(data.code);
  if (existing) {
    console.error(`Arıza kodu ${data.code} zaten mevcut.`);
    process.exit(1);
  }

  insert('fault_codes', {
    code: data.code,
    title_tr: data.title_tr,
    description_tr: data.description_tr,
    expert_opinion_tr: data.expert_opinion_tr,
    drive_safe_tr: data.drive_safe_tr,
    noindex: data.noindex ?? 0,
    sitemap_include: data.sitemap_include ?? 1,
    category: data.category ?? null,
    description_en: data.description_en ?? null,
    updated_at: now,
  });

  const id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get(data.code).id;

  (data.symptoms || []).forEach((text, i) => {
    insert('symptoms', { fault_code_id: id, text_tr: text, sort_order: i + 1 });
  });
  (data.causes || []).forEach((text, i) => {
    insert('causes', { fault_code_id: id, text_tr: text, sort_order: i + 1 });
  });
  (data.solutions || []).forEach((text, i) => {
    insert('solutions', { fault_code_id: id, text_tr: text, sort_order: i + 1 });
  });
  (data.affected_brands || []).forEach(({ brand, model }, i) => {
    insert('affected_brands', { fault_code_id: id, brand, model, sort_order: i + 1 });
  });
  if (data.estimated_cost) {
    insert('estimated_costs', {
      fault_code_id: id,
      min_try: data.estimated_cost.min_try,
      max_try: data.estimated_cost.max_try,
      notes_tr: data.estimated_cost.notes_tr ?? null,
    });
  }
  (data.faq || []).forEach(({ question_tr, answer_tr }, i) => {
    insert('faq', { fault_code_id: id, question_tr, answer_tr, sort_order: i + 1 });
  });
  (data.related_codes || []).forEach((code, i) => {
    db.prepare('INSERT INTO related_codes (fault_code_id, related_code, sort_order) VALUES (?, ?, ?)').run(id, code, i + 1);
  });

  console.log(`Arıza kodu ${data.code} eklendi.`);
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  db.close();
}
