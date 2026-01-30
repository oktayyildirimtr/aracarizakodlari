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
if (exists('P0171')) {
  console.log('Örnek veri zaten mevcut. Tekrar eklemek için önce npm run db:reset çalıştırın.');
  db.close();
  process.exit(0);
}

// --- P0171 ---
insert('fault_codes', {
  code: 'P0171',
  title_tr: 'P0171 Arıza Kodu: Karışım Çok Yoksul (Bank 1)',
  description_tr: `P0171, Bank 1 tarafında hava-yakıt karışımının çok yoksul (az yakıtlı) kaldığını bildirir. Bank 1, motorun silindir 1 tarafıdır; V motorlarda genelde egzoz manifoldunun o tarafı. ECU, bu tarafta karışımın gereğinden az yakıtlı kaldığını görünce kodu yazar.

Lambda zenginleştirme tarafına sinyal verse de hedef orana ulaşılamıyorsa P0171 devreye girer. Uzun süreli yakıt trim belli bir eşiği aşınca kayıt düşer; özellikle kısmi yük ve sabit hızda sürerken sık görülür.

Kod tek başına "şu parça bozuk" demez; karışımı yoksul bırakan bir sebebe işaret eder. Hava kaçağı, kirli ya da arızalı MAF, düşük yakıt basıncı, tıkalı enjektör veya egzoz kaçağı akla gelir. Sebebi netleştirmek için profesyonel ölçüm şart.`,
  expert_opinion_tr: `Önce basitleri eliyoruz: hava filtresi, vakum hortumları, emme contaları. Ardından MAF ve lambda canlı veriyle izlenir. Sıklıkla hava kaçağı veya kirli MAF çıkıyor; temizlik veya conta değişimiyle halloluyor. Yakıt basıncı ve enjektör dengesine de bakılıyor. "Kodu sildir, yola devam" demiyoruz; altta yatan neden giderilmezse kod yine gelir, motor da uzun vadede zarar görebilir.`,
  drive_safe_tr: `Kısa mesafe, düşük yükle kullanılabilir. Yoksul karışım uzun süre devam ederse katalizör ve lambda ziyan görebilir, performans ve emisyon bozulur. Uzun yol, ağır yük, yüksek devir önerilmez. En kısa sürede atölyede teşhis ve gerekirse onarım yaptırın.`,
  noindex: 0,
  sitemap_include: 1,
  category: 'Motor ve hava-yakıt',
  description_en: 'System Too Lean (Bank 1)',
  updated_at: now,
});

const p0171Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0171').id;

insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Motor arıza lambasının yanması (MAL)', sort_order: 1 });
insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Rölantide veya hızlanmada titreme, düzensiz çalışma', sort_order: 2 });
insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Yakıt tüketiminde artış veya performans kaybı', sort_order: 3 });
insert('symptoms', { fault_code_id: p0171Id, text_tr: 'Motorun zenginleştirme yapmasına rağmen karışımın yoksul kalması', sort_order: 4 });

insert('causes', { fault_code_id: p0171Id, text_tr: 'Emme manifoldu, vakum hortumları veya contalarda hava kaçağı', sort_order: 1 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Kirli, hasarlı veya arızalı kütle hava debisi (MAF) sensörü', sort_order: 2 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Düşük yakıt basıncı, zayıf yakıt pompası veya tıkalı filtre', sort_order: 3 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Tıkanmış veya kirlenmiş enjektörler', sort_order: 4 });
insert('causes', { fault_code_id: p0171Id, text_tr: 'Egzoz kaçağı (özellikle lambda öncesi)', sort_order: 5 });

insert('solutions', { fault_code_id: p0171Id, text_tr: 'Vakum ve emme sisteminde hava kaçağı kontrolü; kaçak varsa conta, hortum veya manifold tamiri', sort_order: 1 });
insert('solutions', { fault_code_id: p0171Id, text_tr: 'MAF sensörünün temizlenmesi veya gerekirse değiştirilmesi', sort_order: 2 });
insert('solutions', { fault_code_id: p0171Id, text_tr: 'Yakıt basıncı ve yakıt filtresi kontrolü; pompa veya filtre değişimi', sort_order: 3 });
insert('solutions', { fault_code_id: p0171Id, text_tr: 'Enjektör temizliği veya değişimi', sort_order: 4 });

insert('affected_brands', { fault_code_id: p0171Id, brand: 'Opel', model: 'Astra', sort_order: 1 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Volkswagen', model: 'Golf', sort_order: 2 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Ford', model: 'Focus', sort_order: 3 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Renault', model: 'Megane', sort_order: 4 });
insert('affected_brands', { fault_code_id: p0171Id, brand: 'Fiat', model: 'Linea', sort_order: 5 });

insert('estimated_costs', { fault_code_id: p0171Id, min_try: 500, max_try: 3500, notes_tr: 'Sebebe göre değişir; basit MAF temizliği veya conta değişimiyle 500–1500 TL, pompa/enjektör işlemleriyle 2000–3500 TL aralığı görülebilir.' });

insert('faq', { fault_code_id: p0171Id, question_tr: 'P0171 arıza kodu neden olur?', answer_tr: 'Bank 1 tarafında karışım sürekli yoksul kalıyor. Hava kaçağı, MAF, düşük yakıt basıncı veya enjektör sorunları sık nedenler arasında.', sort_order: 1 });
insert('faq', { fault_code_id: p0171Id, question_tr: 'P0171 ile araç kullanılır mı?', answer_tr: 'Kısa mesafe, hafif yükle kullanılabilir. Uzun süre oyalanmak katalizör ve sensörlere zarar verir; teşhis ve onarımı geciktirmeyin.', sort_order: 2 });
insert('faq', { fault_code_id: p0171Id, question_tr: 'P0171 ve P0174 birlikte çıkarsa ne yapmalı?', answer_tr: 'İki bankta da yoksul karışım var. Çoğunlukla ortak nedenler (yakıt basıncı, filtre, MAF) devrededir; tek taraflı hava kaçağı daha seyrek.', sort_order: 3 });

insert('related_codes', { fault_code_id: p0171Id, related_code: 'P0174', sort_order: 1 });
insert('related_codes', { fault_code_id: p0171Id, related_code: 'P0172', sort_order: 2 });
insert('related_codes', { fault_code_id: p0171Id, related_code: 'P0300', sort_order: 3 });

// --- P0420 ---
insert('fault_codes', {
  code: 'P0420',
  title_tr: 'P0420 Arıza Kodu: Katalizör Verimliliği Eşiğin Altında',
  description_tr: `P0420, bank 1 katalizörünün verimliliğinin eşiğin altında kaldığını söyler. ECU, katalitik konvertörün egzozdaki zararlı maddeleri yeterince düşüremediğini görünce bu kodu yazar.

Katalizör, ön ve arka lambda sinyalleriyle dolaylı izlenir. Arka lambda çıkıştaki oksijeni ölçer; verimli katalizörde sinyal ön sensöre göre daha sakin ve stabil olur. Bu fark belli eşiğin altına inince P0420 düşer.

"Katalizör bitti" demek değildir. Arka lambda hatalı ölçüm yapabiliyor; egzoz kaçağı, yanlış takılmış lambda veya motorun aşırı zengin/yoksul çalışması da kodu tetikleyebilir. Önce bunlar elenmeli, gerekirse katalizör değişimi düşünülmeli.`,
  expert_opinion_tr: `Önce egzoz kaçağı ve lambdalara bakıyoruz. Arka lambda bazen ağır cevap veriyor ya da yanlış ölçüyor; sensör değişimiyle düzelen çok araç var. Karışım düzgün değilse (P0171, P0172 vb.) önce onu hallediyoruz; yoksa yeni katalizörü de yıpratırsınız. Gerçekten katalizör ölmüşse değişim şart. Müşteriye önce teşhis bedelini, sonra olası onarım seçeneklerini net söylüyoruz.`,
  drive_safe_tr: `Araç kullanılabilir; fakat emisyon limitleri aşılabilir, muayenede kalma ihtimali var. Performans çoğu zaman ciddi etkilenmez. Katalizör ileride tıkanırsa egzoz geri basıncı artar, güç düşer. En kısa sürede teşhis ve gerekiyorsa onarım yaptırın.`,
  noindex: 0,
  sitemap_include: 1,
  category: 'Egzoz ve emisyon',
  description_en: 'Catalyst System Efficiency Below Threshold (Bank 1)',
  updated_at: now,
});

const p0420Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0420').id;

insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Motor arıza lambasının yanması', sort_order: 1 });
insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Egzozdan çürük yumurta benzeri koku (kükürt)', sort_order: 2 });
insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Yakıt tüketiminde hafif artış', sort_order: 3 });
insert('symptoms', { fault_code_id: p0420Id, text_tr: 'Emisyon testinde yüksek HC/CO değerleri', sort_order: 4 });

insert('causes', { fault_code_id: p0420Id, text_tr: 'Aşınmış veya tıkanmış katalitik konvertör', sort_order: 1 });
insert('causes', { fault_code_id: p0420Id, text_tr: 'Arka lambda (O2) sensörünün arızalı veya yanlış çalışması', sort_order: 2 });
insert('causes', { fault_code_id: p0420Id, text_tr: 'Egzoz sistemi kaçağı (lambda öncesi veya sonrası)', sort_order: 3 });
insert('causes', { fault_code_id: p0420Id, text_tr: 'Motorun sürekli zengin veya yoksul çalışması (P0171, P0172 vb.)', sort_order: 4 });

insert('solutions', { fault_code_id: p0420Id, text_tr: 'Egzoz kaçağı ve lambda sensörlerinin kontrolü; gerekirse arka lambda değişimi', sort_order: 1 });
insert('solutions', { fault_code_id: p0420Id, text_tr: 'Karışım arıza kodları varsa önce onların giderilmesi', sort_order: 2 });
insert('solutions', { fault_code_id: p0420Id, text_tr: 'Katalizörün gerçekten verimsiz olduğu tespit edilirse orijinal veya kaliteli yedek katalizör değişimi', sort_order: 3 });

insert('affected_brands', { fault_code_id: p0420Id, brand: 'Volkswagen', model: 'Golf', sort_order: 1 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Opel', model: 'Astra', sort_order: 2 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Toyota', model: 'Corolla', sort_order: 3 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Honda', model: 'Civic', sort_order: 4 });
insert('affected_brands', { fault_code_id: p0420Id, brand: 'Ford', model: 'Focus', sort_order: 5 });

insert('estimated_costs', { fault_code_id: p0420Id, min_try: 1500, max_try: 15000, notes_tr: 'Sadece arka lambda değişimi 1500–3000 TL civarı. Katalizör değişimi araç ve orijinal/yedek parçaya göre 5000–15000 TL aralığında seyreder.' });

insert('faq', { fault_code_id: p0420Id, question_tr: 'P0420 kesinlikle katalizör mü demek?', answer_tr: 'Hayır. Arka lambda, egzoz kaçağı veya karışım arızaları da bu kodu yazdırabilir. Önce onlar elenmeli, ardından katalizör değişimi gündeme gelmeli.', sort_order: 1 });
insert('faq', { fault_code_id: p0420Id, question_tr: 'P0420 ile araç kullanmak zararlı mı?', answer_tr: 'Kısa vadede motora ciddi zarar vermez; emisyon artar, muayenede takılma riski var. Katalizör iyice tıkanırsa performans düşer.', sort_order: 2 });
insert('faq', { fault_code_id: p0420Id, question_tr: 'P0420 onarımı ne kadar sürer?', answer_tr: 'Lambda değişimi birkaç saat; katalizör değişimi parça teminine göre bir günü bulabilir.', sort_order: 3 });

insert('related_codes', { fault_code_id: p0420Id, related_code: 'P0430', sort_order: 1 });
insert('related_codes', { fault_code_id: p0420Id, related_code: 'P0171', sort_order: 2 });
insert('related_codes', { fault_code_id: p0420Id, related_code: 'P0172', sort_order: 3 });

// --- P0300 ---
insert('fault_codes', {
  code: 'P0300',
  title_tr: 'P0300 Arıza Kodu: Rastgele / Çoklu Silindir Ateşleme Arızası',
  description_tr: `P0300, rastgele ya da çoklu silindirde ateşleme atlaması (misfire) tespit edildiğini söyler. ECU, birden fazla silindirde veya tek bir silindire net atfedilemeyen atlamalar gördüğünde bu kodu yazar.

P0301–P0312 tek silindire özelken, P0300 ya çok silindiri kapsar ya da kaynağın net olmadığı durumlara denk gelir. Misfire, o silindirde yakıtın düzgün ateşlenmemesi veya yanmaması demek; güç kaybı, titreşim, emisyon artışı ve katalizöre zarar riski getirir.

Buji, bobin, yakıt (pompa, filtre, enjektör), karışım (vakum kaçağı, MAF), sıkıştırma (segment, supap) veya ateşleme sırası hataları akla gelir. Teşhis tecrübe ve uygun ekipman ister.`,
  expert_opinion_tr: `Önce buji ve bobinlere bakıyoruz; birçok araçta buji bitmesi veya bobin arızası çıkıyor. Yakıt basıncı ve enjektör dengesi de mutlaka kontrol ediliyor. P0171, P0172 gibi karışım kodları varsa önce onları çözüyoruz. P0301 vb. tek silindir kodları varsa o silindire odaklanıyoruz. "Rölantide titriyor, gaza yatmıyor" gibi şikayetleri dinleyip ona göre yol çiziyoruz.`,
  drive_safe_tr: `P0300 varken kullanmak önerilmez. Misfire katalizörü yıpratır, emisyonu artırır, performansı düşürür. Ağır yük ve yüksek devir riski büyütür. En kısa sürede teşhis ve onarım yaptırın.`,
  noindex: 0,
  sitemap_include: 1,
  category: 'Ateşleme ve misfire',
  description_en: 'Random/Multiple Cylinder Misfire Detected',
  updated_at: now,
});

const p0300Id = db.prepare('SELECT id FROM fault_codes WHERE code = ?').get('P0300').id;

insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Motor arıza lambasının yanması (bazen titreşimle birlikte)', sort_order: 1 });
insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Rölantide veya hızlanmada motor titremesi, düzensiz çalışma', sort_order: 2 });
insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Güç kaybı, gaz tepkisinde zayıflama', sort_order: 3 });
insert('symptoms', { fault_code_id: p0300Id, text_tr: 'Yakıt tüketiminde artış', sort_order: 4 });

insert('causes', { fault_code_id: p0300Id, text_tr: 'Aşınmış veya arızalı bujiler, bobinler veya buji kabloları', sort_order: 1 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Zayıf yakıt basıncı, kirli filtre veya arızalı enjektörler', sort_order: 2 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Hava kaçağı veya MAF arızası (P0171, P0172 vb.)', sort_order: 3 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Düşük sıkıştırma (aşınmış segment, yanmış supap)', sort_order: 4 });
insert('causes', { fault_code_id: p0300Id, text_tr: 'Ateşleme sırası hatası veya crankshaft sensörü arızası', sort_order: 5 });

insert('solutions', { fault_code_id: p0300Id, text_tr: 'Buji ve bobin kontrolü; aşınmışsa değişimi', sort_order: 1 });
insert('solutions', { fault_code_id: p0300Id, text_tr: 'Yakıt basıncı, filtre ve enjektör kontrolü; gerekirse temizlik veya değişim', sort_order: 2 });
insert('solutions', { fault_code_id: p0300Id, text_tr: 'Vakum kaçağı ve MAF kontrolü; karışım kodları varsa önce onların giderilmesi', sort_order: 3 });
insert('solutions', { fault_code_id: p0300Id, text_tr: 'Sıkıştırma ölçümü; mekanik arıza varsa motor açımı gerekebilir', sort_order: 4 });

insert('affected_brands', { fault_code_id: p0300Id, brand: 'Opel', model: 'Astra', sort_order: 1 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Volkswagen', model: 'Golf', sort_order: 2 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Ford', model: 'Focus', sort_order: 3 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Renault', model: 'Clio', sort_order: 4 });
insert('affected_brands', { fault_code_id: p0300Id, brand: 'Fiat', model: 'Egea', sort_order: 5 });

insert('estimated_costs', { fault_code_id: p0300Id, min_try: 800, max_try: 6000, notes_tr: 'Buji-bobin değişimi 800–2500 TL; yakıt sistemi veya enjektör işlemleri 2000–4000 TL; mekanik işler daha yüksek olabilir.' });

insert('faq', { fault_code_id: p0300Id, question_tr: 'P0300 neden tehlikeli olabilir?', answer_tr: 'Misfire, yakıtın katalizörde yanmasına sebep olabilir; katalizör aşırı ısınır, hasar görür. Performans düşer, emisyon artar.', sort_order: 1 });
insert('faq', { fault_code_id: p0300Id, question_tr: 'P0300 ile araç kullanılır mı?', answer_tr: 'Kullanılmamalı. Zorunluysa kısa mesafe, düşük devir ve yükle gidin; ardından en kısa sürede atölyeye gidin.', sort_order: 2 });
insert('faq', { fault_code_id: p0300Id, question_tr: 'P0300 ve P0171 birlikte çıkarsa ne yapmalı?', answer_tr: 'Önce karışımı (P0171) düzeltin. Yoksul karışım sık sık misfire üretir; P0171 hallolunca P0300 da gidebilir.', sort_order: 3 });

insert('related_codes', { fault_code_id: p0300Id, related_code: 'P0171', sort_order: 1 });
insert('related_codes', { fault_code_id: p0300Id, related_code: 'P0301', sort_order: 2 });
insert('related_codes', { fault_code_id: p0300Id, related_code: 'P0420', sort_order: 3 });

db.close();
console.log('Örnek veri eklendi: P0171, P0420, P0300');
