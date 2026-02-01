/**
 * Top 20 kodlara genel belirti, neden ve çözüm ekler.
 * P0171, P0420, P0300 zaten db-seed'de detaylı; atlanır.
 * Diğer 17 koda kategori bazlı TR+EN içerik eklenir.
 */
import Database from 'better-sqlite3';
import { join } from 'path';
import { TOP_30_CODES } from './top-codes.js';

const SKIP = new Set(['P0171', 'P0420', 'P0300']);
const dbPath = join(process.cwd(), 'data', 'ariza.db');
const db = new Database(dbPath);

const getRange = (code) => {
  const n = parseInt(code.slice(1), 10);
  if (n >= 100 && n <= 299) return 'airfuel';
  if (n >= 300 && n <= 399) return 'ignition';
  if (n >= 400 && n <= 499) return 'emission';
  if (n >= 500 && n <= 599) return 'speed';
  if (n >= 600 && n <= 699) return 'ecu';
  if (n >= 700 && n <= 999) return 'transmission';
  return 'general';
};

const CONTENT = {
  airfuel: {
    symptoms_tr: ['Motor arıza lambası', 'Rölantide titreme', 'Yakıt tüketiminde değişim'],
    symptoms_en: ['Check engine light on', 'Rough idle', 'Change in fuel consumption'],
    causes_tr: ['MAF veya MAP sensör arızası', 'Vakum kaçağı', 'Lambda sensörü hatası'],
    causes_en: ['MAF or MAP sensor fault', 'Vacuum leak', 'Oxygen sensor fault'],
    solutions_tr: ['Sensör ve bağlantıları kontrol et', 'Vakum hattını kontrol et', 'Profesyonel teşhis yaptır'],
    solutions_en: ['Check sensor and connections', 'Check vacuum lines', 'Have professional diagnosis'],
  },
  ignition: {
    symptoms_tr: ['Motor arıza lambası', 'Rölantide titreşim', 'Güç kaybı'],
    symptoms_en: ['Check engine light on', 'Engine vibration at idle', 'Loss of power'],
    causes_tr: ['Buji veya bobin arızası', 'Yakıt sistemi sorunu', 'Ateşleme sırası hatası'],
    causes_en: ['Spark plug or coil fault', 'Fuel system issue', 'Ignition timing error'],
    solutions_tr: ['Buji ve bobinleri kontrol et', 'Yakıt basıncını ölç', 'Teşhis cihazı ile kod analizi'],
    solutions_en: ['Check spark plugs and coils', 'Test fuel pressure', 'Diagnostic scan for code analysis'],
  },
  emission: {
    symptoms_tr: ['Motor arıza lambası', 'Egzoz kokusu', 'Emisyon testinde takılma'],
    symptoms_en: ['Check engine light on', 'Exhaust odor', 'Failing emission test'],
    causes_tr: ['Katalizör veya O2 sensörü', 'EGR sistemi arızası', 'Egzoz kaçağı'],
    causes_en: ['Catalyst or O2 sensor', 'EGR system fault', 'Exhaust leak'],
    solutions_tr: ['Lambda sensörlerini kontrol et', 'EGR valfini temizle/değiştir', 'Egzoz kaçağını gider'],
    solutions_en: ['Check oxygen sensors', 'Clean or replace EGR valve', 'Repair exhaust leak'],
  },
  speed: {
    symptoms_tr: ['Motor arıza lambası', 'Rölanti düzensizliği', 'Hız göstergesi hatası'],
    symptoms_en: ['Check engine light on', 'Erratic idle', 'Speedometer issue'],
    causes_tr: ['Hız sensörü arızası', 'Gaz kelebeği sorunu', 'Rölanti valfi arızası'],
    causes_en: ['Vehicle speed sensor fault', 'Throttle body issue', 'Idle control valve fault'],
    solutions_tr: ['Hız sensörünü kontrol et', 'Gaz kelebeği temizliği', 'Rölanti valfini kontrol et'],
    solutions_en: ['Check vehicle speed sensor', 'Clean throttle body', 'Check idle control valve'],
  },
  ecu: {
    symptoms_tr: ['Motor arıza lambası', 'Aktüatör veya sensör davranış bozukluğu'],
    symptoms_en: ['Check engine light on', 'Actuator or sensor misbehaviour'],
    causes_tr: ['ECU çıkış devresi arızası', 'Sensör besleme sorunu', 'Kablo/konnektör arızası'],
    causes_en: ['ECU output circuit fault', 'Sensor supply issue', 'Wiring/connector fault'],
    solutions_tr: ['Elektrik kontrolleri yaptır', 'ECU tanılaması yaptır'],
    solutions_en: ['Have electrical checks performed', 'Have ECU diagnosis performed'],
  },
  transmission: {
    symptoms_tr: ['Motor arıza lambası', 'Vites geçiş sorunu', 'Şanzıman uyarı lambası'],
    symptoms_en: ['Check engine light on', 'Shift quality issue', 'Transmission warning light'],
    causes_tr: ['Şanzıman yağı veya sensör', 'Tork konvertörü', 'Valf gövdesi arızası'],
    causes_en: ['Transmission fluid or sensor', 'Torque converter', 'Valve body fault'],
    solutions_tr: ['Şanzıman yağını kontrol et', 'Profesyonel şanzıman teşhisi'],
    solutions_en: ['Check transmission fluid', 'Professional transmission diagnosis'],
  },
  general: {
    symptoms_tr: ['Motor arıza lambası'],
    symptoms_en: ['Check engine light on'],
    causes_tr: ['Sensör veya aktüatör arızası'],
    causes_en: ['Sensor or actuator fault'],
    solutions_tr: ['OBD-II ile teşhis yaptır'],
    solutions_en: ['Have OBD-II diagnosis performed'],
  },
};

const top20 = TOP_30_CODES.slice(0, 20).filter((c) => !SKIP.has(c));

for (const code of top20) {
  const row = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get(code);
  if (!row) continue;
  const existing = db.prepare('SELECT 1 FROM symptoms WHERE fault_code_id = ?').get(row.id);
  if (existing) continue;

  const range = getRange(code);
  const c = CONTENT[range] || CONTENT.general;

  for (let i = 0; i < c.symptoms_tr.length; i++) {
    db.prepare('INSERT INTO symptoms (fault_code_id, text_tr, text_en, sort_order) VALUES (?, ?, ?, ?)').run(row.id, c.symptoms_tr[i], c.symptoms_en[i], i + 1);
  }
  for (let i = 0; i < c.causes_tr.length; i++) {
    db.prepare('INSERT INTO causes (fault_code_id, text_tr, text_en, sort_order) VALUES (?, ?, ?, ?)').run(row.id, c.causes_tr[i], c.causes_en[i], i + 1);
  }
  for (let i = 0; i < c.solutions_tr.length; i++) {
    db.prepare('INSERT INTO solutions (fault_code_id, text_tr, text_en, sort_order) VALUES (?, ?, ?, ?)').run(row.id, c.solutions_tr[i], c.solutions_en[i], i + 1);
  }
  console.log(`${code} belirti/neden/çözüm eklendi.`);
}

db.close();
console.log('Top 20 seed tamamlandı.');
