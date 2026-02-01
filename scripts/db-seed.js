import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(process.cwd(), 'data', 'ariza.db');
const db = new Database(dbPath);

const insert = (table, row) => {
  const keys = Object.keys(row);
  const placeholders = keys.map(() => '?').join(', ');
  db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`).run(...keys.map((k) => row[k]));
};

const now = new Date().toISOString();

const exists = (code) => db.prepare('SELECT 1 FROM fault_codes WHERE code = ?').get(code);
const updateFaultEn = db.prepare(
  'UPDATE fault_codes SET title_en = ?, expert_opinion_en = ?, drive_safe_en = ? WHERE code = ?'
);
const updateCostEn = db.prepare('UPDATE estimated_costs SET notes_en = ?, min_usd = ?, max_usd = ? WHERE fault_code_id = ?');
const updateFaqEn = db.prepare('UPDATE faq SET question_en = ?, answer_en = ? WHERE fault_code_id = ? AND sort_order = ?');
const updateSymptomEn = db.prepare('UPDATE symptoms SET text_en = ? WHERE fault_code_id = ? AND sort_order = ?');
const updateCauseEn = db.prepare('UPDATE causes SET text_en = ? WHERE fault_code_id = ? AND sort_order = ?');
const updateSolutionEn = db.prepare('UPDATE solutions SET text_en = ? WHERE fault_code_id = ? AND sort_order = ?');

if (exists('P0171')) {
  const p0171Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0171').id;
  updateFaultEn.run('P0171 OBD2 Error Code: System Too Lean (Bank 1)', 'Check air filter, vacuum hoses, and intake gaskets first. Then monitor MAF and oxygen sensors with live data. Air leaks or dirty MAF are common causes; cleaning or gasket replacement often fixes it. Fuel pressure and injector balance should also be checked. Do not ignore the code—the underlying cause must be fixed.', 'Short trips at low load are acceptable. Extended lean running can damage the catalyst and oxygen sensors, affecting performance and emissions. Avoid long journeys, heavy loads, or high revs. Have it diagnosed and repaired as soon as possible.', 'P0171');
  updateCostEn.run('Costs vary by cause; simple MAF cleaning or gasket replacement 500–1500 TL; fuel pump or injector work 2000–3500 TL range.', 15, 100, p0171Id);
  updateSymptomEn.run('Check engine light (MIL) on', p0171Id, 1);
  updateSymptomEn.run('Rough idle or hesitation during acceleration', p0171Id, 2);
  updateSymptomEn.run('Increased fuel consumption or loss of power', p0171Id, 3);
  updateSymptomEn.run('Engine enriches mixture but remains lean', p0171Id, 4);
  updateCauseEn.run('Air leak in intake manifold, vacuum hoses, or gaskets', p0171Id, 1);
  updateCauseEn.run('Dirty, damaged, or faulty mass air flow (MAF) sensor', p0171Id, 2);
  updateCauseEn.run('Low fuel pressure, weak fuel pump, or clogged filter', p0171Id, 3);
  updateCauseEn.run('Clogged or dirty fuel injectors', p0171Id, 4);
  updateCauseEn.run('Exhaust leak (especially before oxygen sensor)', p0171Id, 5);
  updateSolutionEn.run('Check intake and vacuum system for air leaks; repair gasket, hose, or manifold if needed', p0171Id, 1);
  updateSolutionEn.run('Clean or replace MAF sensor', p0171Id, 2);
  updateSolutionEn.run('Check fuel pressure and filter; replace pump or filter if faulty', p0171Id, 3);
  updateSolutionEn.run('Clean or replace injectors', p0171Id, 4);
  updateFaqEn.run('What causes P0171?', 'Bank 1 mixture is consistently lean. Air leaks, MAF, low fuel pressure, or injector issues are common causes.', p0171Id, 1);
  updateFaqEn.run('Can I drive with P0171?', 'Short trips at light load are okay. Delaying diagnosis can damage the catalyst and sensors; get it fixed soon.', p0171Id, 2);
  updateFaqEn.run('What if P0171 and P0174 appear together?', 'Both banks show lean mixture. Shared causes (fuel pressure, filter, MAF) are common; single-sided air leaks are rarer.', p0171Id, 3);
  console.log('P0171 EN içeriği güncellendi.');
}
if (exists('P0420')) {
  const p0420Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0420').id;
  updateFaultEn.run('P0420 OBD2 Error Code: Catalyst System Efficiency Below Threshold (Bank 1)', 'Check exhaust leaks and oxygen sensors first. Rear O2 sensors often fail or respond slowly; replacing them fixes many vehicles. If mixture codes (P0171, P0172) exist, fix those first—otherwise a new catalyst can be damaged. If the catalyst is truly worn out, replacement is required.', 'The vehicle can be driven; emissions may exceed limits and you might fail inspection. Performance is often not severely affected. If the catalyst clogs, exhaust backpressure increases and power drops. Get it diagnosed and repaired soon.', 'P0420');
  updateCostEn.run('Rear O2 sensor only: around 1500–3000 TL. Catalyst replacement: 5000–15000 TL depending on vehicle and parts.', 50, 500, p0420Id);
  updateSymptomEn.run('Check engine light on', p0420Id, 1);
  updateSymptomEn.run('Rotten egg smell from exhaust (sulphur)', p0420Id, 2);
  updateSymptomEn.run('Slight increase in fuel consumption', p0420Id, 3);
  updateSymptomEn.run('High HC/CO readings in emission test', p0420Id, 4);
  updateCauseEn.run('Worn or clogged catalytic converter', p0420Id, 1);
  updateCauseEn.run('Faulty or incorrect rear oxygen (O2) sensor', p0420Id, 2);
  updateCauseEn.run('Exhaust system leak (before or after oxygen sensor)', p0420Id, 3);
  updateCauseEn.run('Engine running consistently rich or lean (P0171, P0172, etc.)', p0420Id, 4);
  updateSolutionEn.run('Check exhaust leaks and oxygen sensors; replace rear O2 sensor if needed', p0420Id, 1);
  updateSolutionEn.run('Fix mixture fault codes first if present', p0420Id, 2);
  updateSolutionEn.run('Replace catalyst with OEM or quality aftermarket if confirmed inefficient', p0420Id, 3);
  updateFaqEn.run('Does P0420 always mean the catalyst?', 'No. Rear O2 sensor, exhaust leaks, or mixture faults can also trigger this code. Rule those out before replacing the catalyst.', p0420Id, 1);
  updateFaqEn.run('Is it harmful to drive with P0420?', 'Short term it does not seriously harm the engine; emissions rise and you may fail inspection. If the catalyst clogs, performance drops.', p0420Id, 2);
  updateFaqEn.run('How long does P0420 repair take?', 'O2 sensor replacement: a few hours. Catalyst replacement: up to a day depending on parts availability.', p0420Id, 3);
  console.log('P0420 EN içeriği güncellendi.');
}
if (exists('P0300')) {
  const p0300Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0300').id;
  updateFaultEn.run('P0300 OBD2 Error Code: Random/Multiple Cylinder Misfire Detected', 'Check spark plugs and ignition coils first; worn plugs or faulty coils are common. Fuel pressure and injector balance must be checked. If mixture codes (P0171, P0172) exist, fix those first. Single-cylinder codes (P0301 etc.) focus on that cylinder. Listen to symptoms like rough idle or lack of power.', 'Driving with P0300 is not recommended. Misfire damages the catalyst, increases emissions, and reduces performance. Heavy load or high revs increase risk. Get it diagnosed and repaired as soon as possible.', 'P0300');
  updateCostEn.run('Plug/coil replacement 800–2500 TL; fuel system or injector work 2000–4000 TL; mechanical repairs may cost more.', 25, 150, p0300Id);
  updateSymptomEn.run('Check engine light on (sometimes with flashing)', p0300Id, 1);
  updateSymptomEn.run('Engine roughness at idle or during acceleration', p0300Id, 2);
  updateSymptomEn.run('Loss of power, weak throttle response', p0300Id, 3);
  updateSymptomEn.run('Increased fuel consumption', p0300Id, 4);
  updateCauseEn.run('Worn or faulty spark plugs, coils, or plug wires', p0300Id, 1);
  updateCauseEn.run('Low fuel pressure, dirty filter, or faulty injectors', p0300Id, 2);
  updateCauseEn.run('Air leak or MAF fault (P0171, P0172, etc.)', p0300Id, 3);
  updateCauseEn.run('Low compression (worn rings, burned valve)', p0300Id, 4);
  updateCauseEn.run('Ignition timing error or crankshaft sensor fault', p0300Id, 5);
  updateSolutionEn.run('Inspect and replace spark plugs and coils if worn', p0300Id, 1);
  updateSolutionEn.run('Check fuel pressure, filter, and injectors; clean or replace as needed', p0300Id, 2);
  updateSolutionEn.run('Check for vacuum leaks and MAF; fix mixture codes first if present', p0300Id, 3);
  updateSolutionEn.run('Perform compression test; engine rebuild may be needed if mechanical fault', p0300Id, 4);
  updateFaqEn.run('Why is P0300 dangerous?', 'Misfire can cause unburned fuel to burn in the catalyst; it overheats and gets damaged. Performance drops and emissions rise.', p0300Id, 1);
  updateFaqEn.run('Can I drive with P0300?', 'Not recommended. If necessary, short distance at low revs and light load only; then get to a shop as soon as possible.', p0300Id, 2);
  updateFaqEn.run('What if P0300 and P0171 appear together?', 'Fix the mixture (P0171) first. Lean mixture often causes misfire; fixing P0171 may clear P0300 as well.', p0300Id, 3);
  console.log('P0300 EN içeriği güncellendi.');
}
if (exists('P0171')) {
  console.log('Örnek veri zaten mevcut. Yeni ekleme yapılmadı (EN güncellemesi uygulandı).');
  db.close();
  process.exit(0);
}

// --- P0171 ---
insert('fault_codes', {
  code: 'P0171',
  title_tr: 'P0171 Arıza Kodu: Karışım Çok Yoksul (Bank 1)',
  title_en: 'P0171 OBD2 Error Code: System Too Lean (Bank 1)',
  description_tr: `P0171, Bank 1 tarafında hava-yakıt karışımının çok yoksul (az yakıtlı) kaldığını bildirir. Bank 1, motorun silindir 1 tarafıdır; V motorlarda genelde egzoz manifoldunun o tarafı. ECU, bu tarafta karışımın gereğinden az yakıtlı kaldığını görünce kodu yazar.

Lambda zenginleştirme tarafına sinyal verse de hedef orana ulaşılamıyorsa P0171 devreye girer. Uzun süreli yakıt trim belli bir eşiği aşınca kayıt düşer; özellikle kısmi yük ve sabit hızda sürerken sık görülür.

Kod tek başına "şu parça bozuk" demez; karışımı yoksul bırakan bir sebebe işaret eder. Hava kaçağı, kirli ya da arızalı MAF, düşük yakıt basıncı, tıkalı enjektör veya egzoz kaçağı akla gelir. Sebebi netleştirmek için profesyonel ölçüm şart.`,
  expert_opinion_tr: `Önce basitleri eliyoruz: hava filtresi, vakum hortumları, emme contaları. Ardından MAF ve lambda canlı veriyle izlenir. Sıklıkla hava kaçağı veya kirli MAF çıkıyor; temizlik veya conta değişimiyle halloluyor. Yakıt basıncı ve enjektör dengesine de bakılıyor. "Kodu sildir, yola devam" demiyoruz; altta yatan neden giderilmezse kod yine gelir, motor da uzun vadede zarar görebilir.`,
  expert_opinion_en: 'Check air filter, vacuum hoses, and intake gaskets first. Then monitor MAF and oxygen sensors with live data. Air leaks or dirty MAF are common causes; cleaning or gasket replacement often fixes it. Fuel pressure and injector balance should also be checked. Do not ignore the code—the underlying cause must be fixed.',
  drive_safe_tr: `Kısa mesafe, düşük yükle kullanılabilir. Yoksul karışım uzun süre devam ederse katalizör ve lambda ziyan görebilir, performans ve emisyon bozulur. Uzun yol, ağır yük, yüksek devir önerilmez. En kısa sürede atölyede teşhis ve gerekirse onarım yaptırın.`,
  drive_safe_en: 'Short trips at low load are acceptable. Extended lean running can damage the catalyst and oxygen sensors, affecting performance and emissions. Avoid long journeys, heavy loads, or high revs. Have it diagnosed and repaired as soon as possible.',
  noindex: 0,
  sitemap_include: 1,
  category: 'Motor ve hava-yakıt',
  description_en: 'System Too Lean (Bank 1)',
  updated_at: now,
});

const p0171Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0171').id;

insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Motor arıza lambasının yanması (MAL)', text_en: 'Check engine light (MIL) on', sort_order: 1 });
insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Rölantide veya hızlanmada titreme, düzensiz çalışma', text_en: 'Rough idle or hesitation during acceleration', sort_order: 2 });
insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Yakıt tüketiminde artış veya performans kaybı', text_en: 'Increased fuel consumption or loss of power', sort_order: 3 });
insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Motorun zenginleştirme yapmasına rağmen karışımın yoksul kalması', text_en: 'Engine enriches mixture but remains lean', sort_order: 4 });

insert('causes', { fault_code_id: p0171Id, text_tr: 'Emme manifoldu, vakum hortumları veya contalarda hava kaçağı', text_en: 'Air leak in intake manifold, vacuum hoses, or gaskets', sort_order: 1 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Kirli, hasarlı veya arızalı kütle hava debisi (MAF) sensörü', text_en: 'Dirty, damaged, or faulty mass air flow (MAF) sensor', sort_order: 2 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Düşük yakıt basıncı, zayıf yakıt pompası veya tıkalı filtre', text_en: 'Low fuel pressure, weak fuel pump, or clogged filter', sort_order: 3 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Tıkanmış veya kirlenmiş enjektörler', text_en: 'Clogged or dirty fuel injectors', sort_order: 4 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Egzoz kaçağı (özellikle lambda öncesi)', text_en: 'Exhaust leak (especially before oxygen sensor)', sort_order: 5 });

insert('solutions', { fault_code_id: p0171Id, text_tr: 'Vakum ve emme sisteminde hava kaçağı kontrolü; kaçak varsa conta, hortum veya manifold tamiri', text_en: 'Check intake and vacuum system for air leaks; repair gasket, hose, or manifold if needed', sort_order: 1 });
insert('solutions', { fault_code_id: p0171Id, text_tr: 'MAF sensörünün temizlenmesi veya gerekirse değiştirilmesi', text_en: 'Clean or replace MAF sensor', sort_order: 2 });
insert('solutions', { fault_code_id: p0171Id, text_tr: 'Yakıt basıncı ve yakıt filtresi kontrolü; pompa veya filtre değişimi', text_en: 'Check fuel pressure and filter; replace pump or filter if faulty', sort_order: 3 });
insert('solutions', { fault_code_id: p0171Id, text_tr: 'Enjektör temizliği veya değişimi', text_en: 'Clean or replace injectors', sort_order: 4 });

insert('affected_brands', { fault_code_id: p0171Id, brand: 'Opel', model: 'Astra', sort_order: 1 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Volkswagen', model: 'Golf', sort_order: 2 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Ford', model: 'Focus', sort_order: 3 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Renault', model: 'Megane', sort_order: 4 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Fiat', model: 'Linea', sort_order: 5 });

insert('estimated_costs', { fault_code_id: p0171Id, min_try: 500, max_try: 3500, min_usd: 15, max_usd: 100, notes_tr: 'Sebebe göre değişir; basit MAF temizliği veya conta değişimiyle 500–1500 TL, pompa/enjektör işlemleriyle 2000–3500 TL aralığı görülebilir.', notes_en: 'Costs vary by cause; simple MAF cleaning or gasket replacement 500–1500 TL; fuel pump or injector work 2000–3500 TL range.' });

insert('faq', { fault_code_id: p0171Id, question_tr: 'P0171 arıza kodu neden olur?', question_en: 'What causes P0171?', answer_tr: 'Bank 1 tarafında karışım sürekli yoksul kalıyor. Hava kaçağı, MAF, düşük yakıt basıncı veya enjektör sorunları sık nedenler arasında.', answer_en: 'Bank 1 mixture is consistently lean. Air leaks, MAF, low fuel pressure, or injector issues are common causes.', sort_order: 1 });
insert('faq', { fault_code_id: p0171Id, question_tr: 'P0171 ile araç kullanılır mı?', question_en: 'Can I drive with P0171?', answer_tr: 'Kısa mesafe, hafif yükle kullanılabilir. Uzun süre oyalanmak katalizör ve sensörlere zarar verir; teşhis ve onarımı geciktirmeyin.', answer_en: 'Short trips at light load are okay. Delaying diagnosis can damage the catalyst and sensors; get it fixed soon.', sort_order: 2 });
insert('faq', { fault_code_id: p0171Id, question_tr: 'P0171 ve P0174 birlikte çıkarsa ne yapmalı?', question_en: 'What if P0171 and P0174 appear together?', answer_tr: 'İki bankta da yoksul karışım var. Çoğunlukla ortak nedenler (yakıt basıncı, filtre, MAF) devrededir; tek taraflı hava kaçağı daha seyrek.', answer_en: 'Both banks show lean mixture. Shared causes (fuel pressure, filter, MAF) are common; single-sided air leaks are rarer.', sort_order: 3 });

insert('related_codes', { fault_code_id: p0171Id, related_code: 'P0174', sort_order: 1 });
insert('related_codes', { fault_code_id: p0171Id, related_code: 'P0172', sort_order: 2 });
insert('related_codes', { fault_code_id: p0171Id, related_code: 'P0300', sort_order: 3 });

// --- P0420 ---
insert('fault_codes', {
  code: 'P0420',
  title_tr: 'P0420 Arıza Kodu: Katalizör Verimliliği Eşiğin Altında',
  title_en: 'P0420 OBD2 Error Code: Catalyst System Efficiency Below Threshold (Bank 1)',
  description_tr: `P0420, bank 1 katalizörünün verimliliğinin eşiğin altında kaldığını söyler. ECU, katalitik konvertörün egzozdaki zararlı maddeleri yeterince düşüremediğini görünce bu kodu yazar.

Katalizör, ön ve arka lambda sinyalleriyle dolaylı izlenir. Arka lambda çıkıştaki oksijeni ölçer; verimli katalizörde sinyal ön sensöre göre daha sakin ve stabil olur. Bu fark belli eşiğin altına inince P0420 düşer.

"Katalizör bitti" demek değildir. Arka lambda hatalı ölçüm yapabiliyor; egzoz kaçağı, yanlış takılmış lambda veya motorun aşırı zengin/yoksul çalışması da kodu tetikleyebilir. Önce bunlar elenmeli, gerekirse katalizör değişimi düşünülmeli.`,
  expert_opinion_tr: `Önce egzoz kaçağı ve lambdalara bakıyoruz. Arka lambda bazen ağır cevap veriyor ya da yanlış ölçüyor; sensör değişimiyle düzelen çok araç var. Karışım düzgün değilse (P0171, P0172 vb.) önce onu hallediyoruz; yoksa yeni katalizörü de yıpratırsınız. Gerçekten katalizör ölmüşse değişim şart. Müşteriye önce teşhis bedelini, sonra olası onarım seçeneklerini net söylüyoruz.`,
  expert_opinion_en: 'Check exhaust leaks and oxygen sensors first. Rear O2 sensors often fail or respond slowly; replacing them fixes many vehicles. If mixture codes (P0171, P0172) exist, fix those first—otherwise a new catalyst can be damaged. If the catalyst is truly worn out, replacement is required.',
  drive_safe_tr: `Araç kullanılabilir; fakat emisyon limitleri aşılabilir, muayenede kalma ihtimali var. Performans çoğu zaman ciddi etkilenmez. Katalizör ileride tıkanırsa egzoz geri basıncı artar, güç düşer. En kısa sürede teşhis ve gerekiyorsa onarım yaptırın.`,
  drive_safe_en: 'The vehicle can be driven; emissions may exceed limits and you might fail inspection. Performance is often not severely affected. If the catalyst clogs, exhaust backpressure increases and power drops. Get it diagnosed and repaired soon.',
  noindex: 0,
  sitemap_include: 1,
  category: 'Egzoz ve emisyon',
  description_en: 'Catalyst System Efficiency Below Threshold (Bank 1)',
  updated_at: now,
});

const p0420Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0420').id;

insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Motor arıza lambasının yanması', text_en: 'Check engine light on', sort_order: 1 });
insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Egzozdan çürük yumurta benzeri koku (kükürt)', text_en: 'Rotten egg smell from exhaust (sulphur)', sort_order: 2 });
insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Yakıt tüketiminde hafif artış', text_en: 'Slight increase in fuel consumption', sort_order: 3 });
insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Emisyon testinde yüksek HC/CO değerleri', text_en: 'High HC/CO readings in emission test', sort_order: 4 });

insert('causes', { fault_code_id: p0420Id, text_tr: 'Aşınmış veya tıkanmış katalitik konvertör', text_en: 'Worn or clogged catalytic converter', sort_order: 1 });
insert('causes', { fault_code_id: p0420Id, text_tr: 'Arka lambda (O2) sensörünün arızalı veya yanlış çalışması', text_en: 'Faulty or incorrect rear oxygen (O2) sensor', sort_order: 2 });
insert('causes', { fault_code_id: p0420Id, text_tr: 'Egzoz sistemi kaçağı (lambda öncesi veya sonrası)', text_en: 'Exhaust system leak (before or after oxygen sensor)', sort_order: 3 });
insert('causes', { fault_code_id: p0420Id, text_tr: 'Motorun sürekli zengin veya yoksul çalışması (P0171, P0172 vb.)', text_en: 'Engine running consistently rich or lean (P0171, P0172, etc.)', sort_order: 4 });

insert('solutions', { fault_code_id: p0420Id, text_tr: 'Egzoz kaçağı ve lambda sensörlerinin kontrolü; gerekirse arka lambda değişimi', text_en: 'Check exhaust leaks and oxygen sensors; replace rear O2 sensor if needed', sort_order: 1 });
insert('solutions', { fault_code_id: p0420Id, text_tr: 'Karışım arıza kodları varsa önce onların giderilmesi', text_en: 'Fix mixture fault codes first if present', sort_order: 2 });
insert('solutions', { fault_code_id: p0420Id, text_tr: 'Katalizörün gerçekten verimsiz olduğu tespit edilirse orijinal veya kaliteli yedek katalizör değişimi', text_en: 'Replace catalyst with OEM or quality aftermarket if confirmed inefficient', sort_order: 3 });

insert('affected_brands', { fault_code_id: p0420Id, brand: 'Volkswagen', model: 'Golf', sort_order: 1 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Opel', model: 'Astra', sort_order: 2 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Toyota', model: 'Corolla', sort_order: 3 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Honda', model: 'Civic', sort_order: 4 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Ford', model: 'Focus', sort_order: 5 });

insert('estimated_costs', { fault_code_id: p0420Id, min_try: 1500, max_try: 15000, min_usd: 50, max_usd: 500, notes_tr: 'Sadece arka lambda değişimi 1500–3000 TL civarı. Katalizör değişimi araç ve orijinal/yedek parçaya göre 5000–15000 TL aralığında seyreder.', notes_en: 'Rear O2 sensor only: around 1500–3000 TL. Catalyst replacement: 5000–15000 TL depending on vehicle and parts.' });

insert('faq', { fault_code_id: p0420Id, question_tr: 'P0420 kesinlikle katalizör mü demek?', question_en: 'Does P0420 always mean the catalyst?', answer_tr: 'Hayır. Arka lambda, egzoz kaçağı veya karışım arızaları da bu kodu yazdırabilir. Önce onlar elenmeli, ardından katalizör değişimi gündeme gelmeli.', answer_en: 'No. Rear O2 sensor, exhaust leaks, or mixture faults can also trigger this code. Rule those out before replacing the catalyst.', sort_order: 1 });
insert('faq', { fault_code_id: p0420Id, question_tr: 'P0420 ile araç kullanmak zararlı mı?', question_en: 'Is it harmful to drive with P0420?', answer_tr: 'Kısa vadede motora ciddi zarar vermez; emisyon artar, muayenede takılma riski var. Katalizör iyice tıkanırsa performans düşer.', answer_en: 'Short term it does not seriously harm the engine; emissions rise and you may fail inspection. If the catalyst clogs, performance drops.', sort_order: 2 });
insert('faq', { fault_code_id: p0420Id, question_tr: 'P0420 onarımı ne kadar sürer?', question_en: 'How long does P0420 repair take?', answer_tr: 'Lambda değişimi birkaç saat; katalizör değişimi parça teminine göre bir günü bulabilir.', answer_en: 'O2 sensor replacement: a few hours. Catalyst replacement: up to a day depending on parts availability.', sort_order: 3 });

insert('related_codes', { fault_code_id: p0420Id, related_code: 'P0430', sort_order: 1 });
insert('related_codes', { fault_code_id: p0420Id, related_code: 'P0171', sort_order: 2 });
insert('related_codes', { fault_code_id: p0420Id, related_code: 'P0172', sort_order: 3 });

// --- P0300 ---
insert('fault_codes', {
  code: 'P0300',
  title_tr: 'P0300 Arıza Kodu: Rastgele / Çoklu Silindir Ateşleme Arızası',
  title_en: 'P0300 OBD2 Error Code: Random/Multiple Cylinder Misfire Detected',
  description_tr: `P0300, rastgele ya da çoklu silindirde ateşleme atlaması (misfire) tespit edildiğini söyler. ECU, birden fazla silindirde veya tek bir silindire net atfedilemeyen atlamalar gördüğünde bu kodu yazar.

P0301–P0312 tek silindire özelken, P0300 ya çok silindiri kapsar ya da kaynağın net olmadığı durumlara denk gelir. Misfire, o silindirde yakıtın düzgün ateşlenmemesi veya yanmaması demek; güç kaybı, titreşim, emisyon artışı ve katalizöre zarar riski getirir.

Buji, bobin, yakıt (pompa, filtre, enjektör), karışım (vakum kaçağı, MAF), sıkıştırma (segment, supap) veya ateşleme sırası hataları akla gelir. Teşhis tecrübe ve uygun ekipman ister.`,
  expert_opinion_tr: `Önce buji ve bobinlere bakıyoruz; birçok araçta buji bitmesi veya bobin arızası çıkıyor. Yakıt basıncı ve enjektör dengesi de mutlaka kontrol ediliyor. P0171, P0172 gibi karışım kodları varsa önce onları çözüyoruz. P0301 vb. tek silindir kodları varsa o silindire odaklanıyoruz. "Rölantide titriyor, gaza yatmıyor" gibi şikayetleri dinleyip ona göre yol çiziyoruz.`,
  expert_opinion_en: 'Check spark plugs and ignition coils first; worn plugs or faulty coils are common. Fuel pressure and injector balance must be checked. If mixture codes (P0171, P0172) exist, fix those first. Single-cylinder codes (P0301 etc.) focus on that cylinder. Listen to symptoms like rough idle or lack of power.',
  drive_safe_tr: `P0300 varken kullanmak önerilmez. Misfire katalizörü yıpratır, emisyonu artırır, performansı düşürür. Ağır yük ve yüksek devir riski büyütür. En kısa sürede teşhis ve onarım yaptırın.`,
  drive_safe_en: 'Driving with P0300 is not recommended. Misfire damages the catalyst, increases emissions, and reduces performance. Heavy load or high revs increase risk. Get it diagnosed and repaired as soon as possible.',
  noindex: 0,
  sitemap_include: 1,
  category: 'Ateşleme ve misfire',
  description_en: 'Random/Multiple Cylinder Misfire Detected',
  updated_at: now,
});

const p0300Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0300').id;

insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Motor arıza lambasının yanması (bazen titreşimle birlikte)', text_en: 'Check engine light on (sometimes with flashing)', sort_order: 1 });
insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Rölantide veya hızlanmada motor titremesi, düzensiz çalışma', text_en: 'Engine roughness at idle or during acceleration', sort_order: 2 });
insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Güç kaybı, gaz tepkisinde zayıflama', text_en: 'Loss of power, weak throttle response', sort_order: 3 });
insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Yakıt tüketiminde artış', text_en: 'Increased fuel consumption', sort_order: 4 });

insert('causes', { fault_code_id: p0300Id, text_tr: 'Aşınmış veya arızalı bujiler, bobinler veya buji kabloları', text_en: 'Worn or faulty spark plugs, coils, or plug wires', sort_order: 1 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Zayıf yakıt basıncı, kirli filtre veya arızalı enjektörler', text_en: 'Low fuel pressure, dirty filter, or faulty injectors', sort_order: 2 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Hava kaçağı veya MAF arızası (P0171, P0172 vb.)', text_en: 'Air leak or MAF fault (P0171, P0172, etc.)', sort_order: 3 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Düşük sıkıştırma (aşınmış segment, yanmış supap)', text_en: 'Low compression (worn rings, burned valve)', sort_order: 4 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Ateşleme sırası hatası veya crankshaft sensörü arızası', text_en: 'Ignition timing error or crankshaft sensor fault', sort_order: 5 });

insert('solutions', { fault_code_id: p0300Id, text_tr: 'Buji ve bobin kontrolü; aşınmışsa değişimi', text_en: 'Inspect and replace spark plugs and coils if worn', sort_order: 1 });
insert('solutions', { fault_code_id: p0300Id, text_tr: 'Yakıt basıncı, filtre ve enjektör kontrolü; gerekirse temizlik veya değişim', text_en: 'Check fuel pressure, filter, and injectors; clean or replace as needed', sort_order: 2 });
insert('solutions', { fault_code_id: p0300Id, text_tr: 'Vakum kaçağı ve MAF kontrolü; karışım kodları varsa önce onların giderilmesi', text_en: 'Check for vacuum leaks and MAF; fix mixture codes first if present', sort_order: 3 });
insert('solutions', { fault_code_id: p0300Id, text_tr: 'Sıkıştırma ölçümü; mekanik arıza varsa motor açımı gerekebilir', text_en: 'Perform compression test; engine rebuild may be needed if mechanical fault', sort_order: 4 });

insert('affected_brands', { fault_code_id: p0300Id, brand: 'Opel', model: 'Astra', sort_order: 1 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Volkswagen', model: 'Golf', sort_order: 2 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Ford', model: 'Focus', sort_order: 3 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Renault', model: 'Clio', sort_order: 4 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Fiat', model: 'Egea', sort_order: 5 });

insert('estimated_costs', { fault_code_id: p0300Id, min_try: 800, max_try: 6000, notes_tr: 'Buji-bobin değişimi 800–2500 TL; yakıt sistemi veya enjektör işlemleri 2000–4000 TL; mekanik işler daha yüksek olabilir.', notes_en: 'Plug/coil replacement 800–2500 TL; fuel system or injector work 2000–4000 TL; mechanical repairs may cost more.' });

insert('faq', { fault_code_id: p0300Id, question_tr: 'P0300 neden tehlikeli olabilir?', question_en: 'Why is P0300 dangerous?', answer_tr: 'Misfire, yakıtın katalizörde yanmasına sebep olabilir; katalizör aşırı ısınır, hasar görür. Performans düşer, emisyon artar.', answer_en: 'Misfire can cause unburned fuel to burn in the catalyst; it overheats and gets damaged. Performance drops and emissions rise.', sort_order: 1 });
insert('faq', { fault_code_id: p0300Id, question_tr: 'P0300 ile araç kullanılır mı?', question_en: 'Can I drive with P0300?', answer_tr: 'Kullanılmamalı. Zorunluysa kısa mesafe, düşük devir ve yükle gidin; ardından en kısa sürede atölyeye gidin.', answer_en: 'Not recommended. If necessary, short distance at low revs and light load only; then get to a shop as soon as possible.', sort_order: 2 });
insert('faq', { fault_code_id: p0300Id, question_tr: 'P0300 ve P0171 birlikte çıkarsa ne yapmalı?', question_en: 'What if P0300 and P0171 appear together?', answer_tr: 'Önce karışımı (P0171) düzeltin. Yoksul karışım sık sık misfire üretir; P0171 hallolunca P0300 da gidebilir.', answer_en: 'Fix the mixture (P0171) first. Lean mixture often causes misfire; fixing P0171 may clear P0300 as well.', sort_order: 3 });

insert('related_codes', { fault_code_id: p0300Id, related_code: 'P0171', sort_order: 1 });
insert('related_codes', { fault_code_id: p0300Id, related_code: 'P0301', sort_order: 2 });
insert('related_codes', { fault_code_id: p0300Id, related_code: 'P0420', sort_order: 3 });

db.close();
console.log('Örnek veri eklendi: P0171, P0420, P0300');
