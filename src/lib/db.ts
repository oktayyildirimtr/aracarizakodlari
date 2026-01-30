import Database from 'better-sqlite3';
import { join } from 'path';

let db: Database.Database | null = null;

function getDbPath(): string {
  return join(process.cwd(), 'data', 'ariza.db');
}

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(getDbPath(), { readonly: true });
  }
  return db;
}

export interface FaultCode {
  id: number;
  code: string;
  title_tr: string;
  description_tr: string;
  expert_opinion_tr: string;
  drive_safe_tr: string;
  noindex: number;
  sitemap_include: number;
  category: string | null;
  description_en: string | null;
  updated_at: string;
}

export interface Symptom {
  id: number;
  text_tr: string;
  sort_order: number;
}

export interface Cause {
  id: number;
  text_tr: string;
  sort_order: number;
}

export interface Solution {
  id: number;
  text_tr: string;
  sort_order: number;
}

export interface AffectedBrand {
  id: number;
  brand: string;
  model: string;
  sort_order: number;
}

export interface EstimatedCost {
  min_try: number;
  max_try: number;
  notes_tr: string | null;
}

export interface FaqItem {
  id: number;
  question_tr: string;
  answer_tr: string;
  sort_order: number;
}

export interface FaultCodeDetail extends FaultCode {
  symptoms: Symptom[];
  causes: Cause[];
  solutions: Solution[];
  affected_brands: AffectedBrand[];
  estimated_cost: EstimatedCost | null;
  faq: FaqItem[];
  related_codes: string[];
}

export function getAllFaultCodes(): FaultCode[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM fault_codes ORDER BY code').all() as FaultCode[];
  return rows;
}

const BATCH_LIMIT = typeof process !== 'undefined' && process.env.ARIZA_BATCH_LIMIT
  ? parseInt(process.env.ARIZA_BATCH_LIMIT, 10)
  : null;

/** Sitemap'e dahil edilecek, noindex olmayan kodlar. ARIZA_BATCH_LIMIT ile sınırlanabilir. */
export function getIndexedFaultCodes(): FaultCode[] {
  const database = getDb();
  const sql = BATCH_LIMIT != null && BATCH_LIMIT > 0
    ? 'SELECT * FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code LIMIT ?'
    : 'SELECT * FROM fault_codes WHERE noindex = 0 AND sitemap_include = 1 ORDER BY code';
  const rows = (BATCH_LIMIT != null && BATCH_LIMIT > 0
    ? database.prepare(sql).all(BATCH_LIMIT)
    : database.prepare(sql).all()) as FaultCode[];
  return rows;
}

export function getFaultCodeByCode(code: string): FaultCode | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM fault_codes WHERE code = ?').get(code) as FaultCode | undefined;
  return row ?? null;
}

export function getFaultCodeDetail(code: string): FaultCodeDetail | null {
  const fc = getFaultCodeByCode(code);
  if (!fc) return null;

  const database = getDb();
  const symptoms = database
    .prepare('SELECT id, text_tr, sort_order FROM symptoms WHERE fault_code_id = ? ORDER BY sort_order, id')
    .all(fc.id) as Symptom[];
  const causes = database
    .prepare('SELECT id, text_tr, sort_order FROM causes WHERE fault_code_id = ? ORDER BY sort_order, id')
    .all(fc.id) as Cause[];
  const solutions = database
    .prepare('SELECT id, text_tr, sort_order FROM solutions WHERE fault_code_id = ? ORDER BY sort_order, id')
    .all(fc.id) as Solution[];
  const affected_brands = database
    .prepare('SELECT id, brand, model, sort_order FROM affected_brands WHERE fault_code_id = ? ORDER BY sort_order, brand, model')
    .all(fc.id) as AffectedBrand[];
  const costRow = database
    .prepare('SELECT min_try, max_try, notes_tr FROM estimated_costs WHERE fault_code_id = ?')
    .get(fc.id) as { min_try: number; max_try: number; notes_tr: string | null } | undefined;
  const faq = database
    .prepare('SELECT id, question_tr, answer_tr, sort_order FROM faq WHERE fault_code_id = ? ORDER BY sort_order, id')
    .all(fc.id) as FaqItem[];

  const relatedRows = database
    .prepare('SELECT related_code FROM related_codes WHERE fault_code_id = ? ORDER BY sort_order, related_code')
    .all(fc.id) as { related_code: string }[];
  const existingCodes = new Set(
    (database.prepare('SELECT code FROM fault_codes').all() as { code: string }[]).map((r) => r.code)
  );
  const related_codes = relatedRows.map((r) => r.related_code).filter((c) => existingCodes.has(c));

  return {
    ...fc,
    symptoms,
    causes,
    solutions,
    affected_brands,
    estimated_cost: costRow ? { min_try: costRow.min_try, max_try: costRow.max_try, notes_tr: costRow.notes_tr } : null,
    faq,
    related_codes,
  };
}

export interface BrandModelRow {
  brand: string;
  model: string;
  code: string;
  fault_code_id: number;
}

/** Tüm brand-model-code kombinasyonları (sayfa üretimi için). ARIZA_BATCH_LIMIT fault code sayısını sınırlar. */
export function getAllBrandModelPages(): BrandModelRow[] {
  const database = getDb();
  const codes = getIndexedFaultCodes().map((c) => c.code);
  if (codes.length === 0) return [];
  const placeholders = codes.map(() => '?').join(',');
  const rows = database
    .prepare(
      `SELECT ab.brand, ab.model, fc.code, fc.id AS fault_code_id
       FROM affected_brands ab
       JOIN fault_codes fc ON fc.id = ab.fault_code_id
       WHERE fc.noindex = 0 AND fc.sitemap_include = 1 AND fc.code IN (${placeholders})
       ORDER BY ab.brand, ab.model, fc.code`
    )
    .all(...codes) as BrandModelRow[];
  return rows;
}

export function getBrandModelDetail(brand: string, model: string, code: string): FaultCodeDetail | null {
  const detail = getFaultCodeDetail(code);
  if (!detail) return null;
  const has = detail.affected_brands.some(
    (b) => b.brand.toLowerCase() === brand.toLowerCase() && b.model.toLowerCase() === model.toLowerCase()
  );
  return has ? detail : null;
}

/** Slug'dan brand, model, code parse. Örn: opel-astra-p0171 -> { brand: 'Opel', model: 'Astra', code: 'P0171' } */
export function parseBrandModelSlug(slug: string): { brand: string; model: string; code: string } | null {
  const lower = slug.toLowerCase();
  const match = lower.match(/^(.+)-(p\d{4})$/);
  if (!match) return null;
  const [, brandModel, code] = match;
  const parts = brandModel.split('-');
  if (parts.length < 2) return null;
  const model = parts.pop()!;
  const brand = parts.join('-');
  const title = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { brand: title(brand), model: title(model), code: code.toUpperCase() };
}

