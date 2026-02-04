# OBD-II Arıza Kodları – Programatik SEO Sitesi

Türkçe OBD-II arıza kodu sayfaları üreten, AdSense uyumlu, statik programatik SEO projesi. Astro (SSG), SQLite ve minimal CSS ile kuruludur.

## Özellikler

- **Dil:** Türkçe
- **Framework:** Astro (static output)
- **Veritabanı:** SQLite (build-time)
- **Hosting hedefi:** Cloudflare Pages
- **SEO:** Meta, canonical, Schema.org FAQ, sitemap, robots.txt, internal linking
- **E-E-A-T:** Yazar bilgisi, bilgilendirme uyarısı, son güncelleme tarihi
- **AdSense:** Reklam alanı placeholder’ları (içerik öncelikli)
- **İndeksleme:** `noindex` / `sitemap_include` ve batch limit ile yapılandırılabilir
- **Top 30:** Şimdilik sadece en çok aranan 30 arıza kodu sayfada gösterilir; diğerleri DB'de tutulur (`npm run db:set-top-codes`)
- **Tüm kodlar:** `/kodlar` sayfasında liste, arama ve kategori filtresi
- **Kategori:** Her kod için `category` (örn. Motor ve hava-yakıt, Egzoz ve emisyon)
- **Kurumsal / yasal:** Hakkımızda, Gizlilik politikası, Çerez bildirimi, Kullanım koşulları (TR/EN), İletişim (e-posta + form); çerez onay banner’ı
- **Domain:** www.obdfaultcode.com (SITE_URL, sitemap, robots.txt)
- **İletişim formu:** Formspree kullanmak için `.env` içinde `PUBLIC_CONTACT_FORM_ACTION=https://formspree.io/f/YOUR_ID` tanımlayın; yoksa form mailto ile açılır.

## Proje Yapısı

```
├── data/
│   ├── ariza.db          # SQLite DB (db:init + db:seed ile oluşturulur)
│   └── dtcmapping-p0xxx.json  # (isteğe bağlı) fetch-dtcmapping ile indirilen P0xxx tanımları
├── public/
│   ├── bg.jpg            # Araç/dashboard arka plan görseli (Unsplash)
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   ├── schema.sql        # Veritabanı şeması
│   ├── db-init.js        # Tabloları oluşturur
│   ├── db-seed.js        # Örnek veri (P0171, P0420, P0300)
│   ├── db-reset.js       # DB siler, init+migrate+seed çalıştırır
│   ├── db-migrate.js     # Yeni sütunlar (örn. category) ekler
│   ├── db-seed-all.js    # Tüm P0xxx OBD-II kodlarını ekler (mevcut olanları atlar)
│   ├── db-set-top-codes.js # Sadece en çok aranan 30 kodu sayfada gösterir (diğerleri DB'de kalır)
│   ├── top-codes.js      # En çok aranan 30 arıza kodu listesi (FIXD/Capital One kaynaklı)
│   ├── fetch-dtcmapping.js # İnternetten P0xxx DTC tanımlarını indirir (dtcmapping gist)
│   ├── fault-codes-data.js # P0xxx kod listesi (SAE), her kod için dtcmapping’ten gerçek Türkçe açıklama
│   ├── dtc-translate.js    # OBD-II İngilizce tanımlarını Türkçeye çevirir
│   └── add-fault-code.js # JSON’dan tek arıza kodu ekler
├── src/
│   ├── components/       # AdPlaceholder, AuthorBio, CookieConsent, Disclaimer, FaultCodeContent, ...
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── db.ts         # SQLite erişim, getIndexedFaultCodes, getFaultCodeDetail, ...
│   │   ├── seo.ts        # Meta, canonical, FAQ schema
│   │   ├── slugs.ts      # faultCodeSlug, brandModelSlug
│   │   └── indexing.ts
│   ├── pages/
│   │   ├── index.astro   # Ana sayfa
│   │   ├── kodlar.astro  # Tüm kodlar, arama, kategori filtresi
│   │   ├── hakkimizda.astro
│   │   ├── gizlilik-politikasi.astro
│   │   ├── cerez-bildirimi.astro
│   │   ├── iletisim.astro
│   │   ├── [slug].astro  # /p0171-nedir, /opel-astra-p0171, ...
│   │   └── 404.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Kurulum

**Mac’te sıfırdan (Node, Homebrew vb. hiçbir şey yokken) kurmak ve yayınlamak için:** [KURULUM.md](./KURULUM.md) dosyasındaki adımları uygula.

1. **Bağımlılıklar**

   ```bash
   npm install
   ```

2. **Veritabanı**

   ```bash
   npm run db:reset
   ```

   Bu komut `data/ariza.db` oluşturur, şemayı uygular, migration çalıştırır ve örnek arıza kodlarını (P0171, P0420, P0300) ekler.

   **Tüm OBD-II P0xxx kodlarını eklemek için** (isteğe bağlı):

   ```bash
   npm run db:seed-all
   ```

   `db:seed-all`, `fault-codes-data` içindeki yüzlerce kodu ekler; zaten var olanları atlar. Önce `db:reset` veya en azından `db:init` + `db:migrate` + `db:seed` çalıştırılmış olmalı. Yeni eklenen kodlardan sadece en çok aranan 30'u otomatik olarak sayfada gösterilir. Mevcut DB'de tüm kodlar görünüyorsa, sadece top 30'a dönmek için: `npm run db:set-top-codes`

   **Gerçek İngilizce tanımlar (SAE/ISO uyumlu):** İnternetteki DTC kaynakları kullanılır. `fault-codes-data` önce `data/dtcmapping-p0xxx.json` dosyasına bakar; yoksa gömülü fallback tanımlar (P0100, P0171, P0300, P0420 vb.) kullanılır. Tam set için:

   ```bash
   npm run fetch-dtcmapping
   ```

   Bu komut [dtcmapping gist](https://gist.github.com/wzr1337/8af2731a5ffa98f9d506537279da7a0e) içindeki P0xxx tanımlarını indirip `data/dtcmapping-p0xxx.json` olarak kaydeder. Ardından `db:seed-all` çalıştırıldığında her kod için benzersiz Türkçe açıklama (gerçek tanımdan çevrilir) ve İngilizce resmi tanım kullanılır. P0101 ile P0102 artık farklı açıklamalara sahiptir. Mevcut kodların hem `description_tr` hem `description_en` alanları güncellenir.

3. **Geliştirme sunucusu**

   ```bash
   npm run dev
   ```

4. **Production build**

   ```bash
   npm run build
   ```

   Build öncesi `data/ariza.db` mevcut olmalı. Önce `npm run db:reset` çalıştırın.

5. **Önizleme**

   ```bash
   npm run preview
   ```

## URL Yapısı

- **Ana sayfa:** `/`
- **Tüm kodlar:** `/kodlar` (liste, arama, kategori filtresi; örn. `/kodlar?q=P0171&cat=...`)
- **Arıza kodu:** `/{code}-nedir` (örn. `/p0171-nedir`, `/p0420-nedir`)
- **Marka / model:** `/{brand}-{model}-{code}` (örn. `/opel-astra-p0171`, `/volkswagen-golf-p0420`)

## Yeni Arıza Kodu Eklemek

1. **Seed’e ekleyerek:** `scripts/db-seed.js` içine yeni `fault_codes` + ilişkili tabloları ekleyip `npm run db:reset` çalıştırın.

2. **JSON ile:** Örnek yapıda bir JSON dosyası hazırlayıp:

   ```bash
   npm run add-fault-code -- path/to/yeni-kod.json
   ```

   `add-fault-code` script’i `db-seed.js` ile uyumlu alanları bekler:  
   `code`, `title_tr`, `description_tr`, `expert_opinion_tr`, `drive_safe_tr`,  
   `symptoms[]`, `causes[]`, `solutions[]`, `affected_brands[]`,  
   `estimated_cost{}`, `faq[]`, `related_codes[]`.

   Örnek JSON yapısı:

   ```json
   {
     "code": "P0172",
     "title_tr": "P0172 Arıza Kodu: Karışım Çok Zengin (Bank 1)",
     "description_tr": "Paragraf metni...",
     "expert_opinion_tr": "Uzman görüşü...",
     "drive_safe_tr": "Kullanım uyarısı...",
     "symptoms": ["Belirti 1", "Belirti 2"],
     "causes": ["Neden 1"],
     "solutions": ["Çözüm 1"],
     "affected_brands": [{"brand": "Opel", "model": "Astra"}],
     "estimated_cost": {"min_try": 500, "max_try": 2000, "notes_tr": "Açıklama."},
     "faq": [{"question_tr": "Soru?", "answer_tr": "Cevap."}],
     "related_codes": ["P0171", "P0174"]
   }
   ```

## Batch Limit (İndeksleme Stratejisi)

Sayfa üretimini sınırlamak için:

```bash
ARIZA_BATCH_LIMIT=50 npm run build
```

Örneğin ilk 50 arıza koduna ait sayfalar (ve ilgili marka/model sayfaları) üretilir. Varsayılan: limit yok.

## noindex / Sitemap

- `fault_codes.noindex = 1` olan kodlar için sayfa üretilmez.
- `sitemap_include = 0` olanlar da sayfa üretimine alınmaz.
- Sitemap build sonrası `scripts/generate-sitemap.js` ile oluşturulur (`dist/sitemap.xml`).
- `public/robots.txt` içinde `Sitemap: https://www.obdfaultcode.com/sitemap.xml` tanımlıdır.

## AdSense

- Reklam alanları **placeholder** olarak bırakıldı (JS enjeksiyonu yok).
- Yerleşim: above-the-fold + içerik içi 1–2 alan.
- AdSense onayı sonrası placeholder’lar kendi reklam kodlarınızla değiştirilebilir.
- İçerik öncelikli, agresif reklam yok.

## Deploy (Cloudflare Pages)

1. Projeyi Git ile bağlayın.
2. Build komutları:
   - **Build command:** `npm run db:reset && npm run build`
   - **Output directory:** `dist`
   - **Root directory:** (proje kökü)
3. Node.js ortamı kullanıldığından, Cloudflare Pages’te **Node.js build** etkin olmalı (ve `better-sqlite3` için uygun build image).

Alternatif: yerel veya CI’da `npm run db:reset && npm run build` çalıştırıp yalnızca `dist` çıktısını deploy etmek (tam statik).

## Veritabanı Şeması (Özet)

- `fault_codes`: code, title_tr, description_tr, expert_opinion_tr, drive_safe_tr, noindex, sitemap_include, updated_at
- `symptoms`, `causes`, `solutions`: fault_code_id, text_tr, sort_order
- `affected_brands`: fault_code_id, brand, model, sort_order
- `estimated_costs`: fault_code_id, min_try, max_try, notes_tr
- `faq`: fault_code_id, question_tr, answer_tr, sort_order
- `related_codes`: fault_code_id, related_code, sort_order

## Mimari notlar

- **SSG + SQLite:** Tüm sayfalar build time’da üretilir. SQLite yalnızca `astro build` sırasında okunur; deploy edilen çıktı tamamen statik HTML + CSS (+ varsa minimal JS). Cloudflare Pages’te runtime DB yok.
- **Tek dinamik rota:** `[slug].astro` hem `/{code}-nedir` hem `/{brand}-{model}-{code}` formatını kapsar. `getStaticPaths` ile tüm olası slug’lar üretilir; yönlendirme veya runtime parse yok.
- **İçerik şablonu:** `FaultCodeContent.astro` talep edilen 10 bölümü (anlam, araçlar, belirtiler, nedenler, çözümler, kullanım, maliyet, uzman görüşü, SSS, ilgili kodlar) tek yerden render eder. Arıza ve marka/model sayfaları aynı bileşeni kullanır.
- **Reklamlar:** Sadece placeholder div’ler. AdSense onayı sonrası bu alanlar kendi reklam snippet’lerinizle değiştirilebilir; ekstra JS veya framework gerekmez.
- **Batch / noindex:** `ARIZA_BATCH_LIMIT` ile sayfa sayısı sınırlanabilir. `noindex` / `sitemap_include` alanları ile hangi kodların sayfa üretimine ve sitemap’e dahil edileceği kontrol edilir.
- **İlgili kodlar:** Sadece veritabanında sayfası olan arıza kodlarına internal link verilir; `related_codes` tablosundaki referanslar buna göre filtrelenir.
