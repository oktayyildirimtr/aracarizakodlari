-- OBD-II Arıza Kodları Programatik SEO Sitesi
-- SQLite şeması

CREATE TABLE IF NOT EXISTS fault_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  title_tr TEXT NOT NULL,
  title_en TEXT,
  description_tr TEXT NOT NULL,
  description_en TEXT,
  expert_opinion_tr TEXT NOT NULL,
  expert_opinion_en TEXT,
  drive_safe_tr TEXT NOT NULL,
  drive_safe_en TEXT,
  noindex INTEGER NOT NULL DEFAULT 0,
  sitemap_include INTEGER NOT NULL DEFAULT 1,
  category TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS symptoms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fault_code_id INTEGER NOT NULL,
  text_tr TEXT NOT NULL,
  text_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (fault_code_id) REFERENCES fault_codes(id)
);

CREATE TABLE IF NOT EXISTS causes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fault_code_id INTEGER NOT NULL,
  text_tr TEXT NOT NULL,
  text_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (fault_code_id) REFERENCES fault_codes(id)
);

CREATE TABLE IF NOT EXISTS solutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fault_code_id INTEGER NOT NULL,
  text_tr TEXT NOT NULL,
  text_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (fault_code_id) REFERENCES fault_codes(id)
);

CREATE TABLE IF NOT EXISTS affected_brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fault_code_id INTEGER NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(fault_code_id, brand, model),
  FOREIGN KEY (fault_code_id) REFERENCES fault_codes(id)
);

CREATE TABLE IF NOT EXISTS estimated_costs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fault_code_id INTEGER NOT NULL UNIQUE,
  min_try INTEGER NOT NULL,
  max_try INTEGER NOT NULL,
  min_usd INTEGER,
  max_usd INTEGER,
  notes_tr TEXT,
  notes_en TEXT,
  FOREIGN KEY (fault_code_id) REFERENCES fault_codes(id)
);

CREATE TABLE IF NOT EXISTS faq (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fault_code_id INTEGER NOT NULL,
  question_tr TEXT NOT NULL,
  question_en TEXT,
  answer_tr TEXT NOT NULL,
  answer_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (fault_code_id) REFERENCES fault_codes(id)
);

CREATE TABLE IF NOT EXISTS related_codes (
  fault_code_id INTEGER NOT NULL,
  related_code TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (fault_code_id, related_code),
  FOREIGN KEY (fault_code_id) REFERENCES fault_codes(id)
);

CREATE INDEX IF NOT EXISTS idx_symptoms_fault_code ON symptoms(fault_code_id);
CREATE INDEX IF NOT EXISTS idx_causes_fault_code ON causes(fault_code_id);
CREATE INDEX IF NOT EXISTS idx_solutions_fault_code ON solutions(fault_code_id);
CREATE INDEX IF NOT EXISTS idx_affected_brands_fault_code ON affected_brands(fault_code_id);
CREATE INDEX IF NOT EXISTS idx_faq_fault_code ON faq(fault_code_id);
CREATE INDEX IF NOT EXISTS idx_related_codes_fault_code ON related_codes(fault_code_id);
