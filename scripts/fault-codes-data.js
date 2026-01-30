/**
 * Tüm OBD-II P0xxx arıza kodları (SAE). P0171, P0420, P0300 db-seed'de olduğu için atlanır.
 * description_en: dtcmapping gist / SAE–ISO uyumlu gerçek İngilizce tanımlar.
 * description_tr: Gerçek tanım varsa Türkçeye çevrilir; yoksa aralık bazlı genel açıklama kullanılır.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { translateEnToTr } from './dtc-translate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SKIP = new Set(['P0171', 'P0420', 'P0300']);

/** Gist dtcmapping'ten alınan gerçek İngilizce tanımlar (kaynak: wzr1337/dtcmapping, SAE/ISO uyumlu). */
const FALLBACK_EN = {
  P0100: 'Mass or Volume Air flow Circuit Malfunction',
  P0171: 'System Too Lean (Bank 1)',
  P0172: 'System Too Rich (Bank 1)',
  P0300: 'Random/Multiple Cylinder Misfire Detected',
  P0420: 'Catalyst System Efficiency Below Threshold (Bank 1)',
  P0430: 'Catalyst System Efficiency Below Threshold (Bank 2)',
  P0400: 'Exhaust Gas Recirculation Flow Malfunction',
  P0401: 'Exhaust Gas Recirculation Flow Insufficient Detected',
  P0500: 'Vehicle Speed Sensor Malfunction',
  P0700: 'Transmission Control System Malfunction',
};

function loadDtcmapping() {
  const p = join(__dirname, '..', 'data', 'dtcmapping-p0xxx.json');
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}

const DTC_MAP = { ...FALLBACK_EN, ...loadDtcmapping() };

/**
 * Kategori eşlemesi SAE J2012 / ISO 15031-6 ve obd-codes.com'a göredir.
 */
const RANGES = [
  { start: 100, end: 199, category: 'Hava-yakıt ölçüm', title: 'Hava-yakıt ölçüm / devre', desc: 'MAF, MAP veya lambda sensörü kaynaklı olabilir; debi ve karışım ölçümü akla gelir. Doğru teşhis için serviste ölçüm yaptırmanız gerekir.' },
  { start: 200, end: 299, category: 'Hava-yakıt ölçüm', title: 'Enjektör devreleri', desc: 'Tıkanıklık, kablo arızası veya ECU sinyali sık görülür. Enjektörler ve bağlantıları yetkili serviste kontrol edilmelidir.' },
  { start: 300, end: 399, category: 'Ateşleme ve misfire', title: 'Ateşleme / silindir ateşleme atlaması', desc: 'Buji, bobin veya ateşleme sırası sorunları olabilir. Misfire ciddiye alınmalı; profesyonel ölçüm ve tamir önerilir.' },
  { start: 400, end: 499, category: 'Egzoz ve emisyon', title: 'Yardımcı emisyon kontrolleri', desc: 'EGR, katalizör veya buhar depolama sistemi akla gelir. Emisyonla ilgili bu kodlar için serviste teşhis şart.' },
  { start: 500, end: 599, category: 'Hız ve rölanti', title: 'Hız / rölanti / giriş sinyalleri', desc: 'Hız sensörü, rölanti valfi veya ilgili giriş sinyalleri kontrol edilmeli. Teşhis atölye ortamında yapılmalıdır.' },
  { start: 600, end: 699, category: 'ECU ve çıkışlar', title: 'ECU / bilgisayar çıkış devreleri', desc: 'Sensör beslemesi veya aktüatör devreleri söz konusu olabilir. Elektrik kontrolleri mutlaka uzman serviste yapılmalı.' },
  { start: 700, end: 799, category: 'Şanzıman', title: 'Şanzıman', desc: 'Vites kutusu, tork konvertörü, yağ veya elektrovalfler düşünülür. Şanzıman kodları için özel ekipman gerekir; servise gidin.' },
  { start: 800, end: 899, category: 'Şanzıman', title: 'Şanzıman', desc: 'Vites kutusu ve ilgili bileşenler ön plandadır. Kesin neden ölçümle anlaşılır; kendi başınıza müdahale risklidir.' },
  { start: 900, end: 999, category: 'Şanzıman', title: 'Şanzıman / diğer güç aktarım', desc: 'Güç aktarımı veya debriyaj / vites tarafı işaret eder. Teşhis ve onarım yetkili atölyede yapılmalıdır.' },
];

function* generateAll() {
  for (const r of RANGES) {
    for (let i = r.start; i <= r.end; i++) {
      const code = 'P' + String(i).padStart(4, '0');
      if (SKIP.has(code)) continue;

      const description_en = DTC_MAP[code] || null;
      let description_tr;

      if (description_en) {
        const translated = translateEnToTr(description_en);
        description_tr = translated || `${code} bu sistemle ilgili bir arızaya işaret eder. ${r.desc}`;
      } else {
        description_tr = `${code} bu sistemle ilgili bir arızaya işaret eder. ${r.desc}`;
      }

      yield {
        code,
        title_tr: `${code} Arıza Kodu: ${r.title}`,
        description_tr,
        category: r.category,
        description_en,
      };
    }
  }
}

export function getAllObd2Codes() {
  return [...generateAll()];
}
