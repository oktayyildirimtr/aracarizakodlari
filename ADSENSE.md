# Google AdSense Onay Rehberi

Bu dokümanda sitenin AdSense onayı için yapılması gerekenler ve projede zaten mevcut olanlar özetlenir.

## Projede Mevcut Olanlar ✓

- **robots.txt** – `public/robots.txt` mevcut; tüm botlara izin verir, sitemap linki içerir
- **Sitemap** – Build sonrası yalnızca `dist/sitemap.xml` oluşturulur (tüm URL’ler tek dosyada, `lastmod` dahil)
- **Gizlilik Politikası** – TR ve EN, AdSense / DoubleClick / opt-out linkleri ile güncellendi
- **Çerez Bildirimi** – TR ve EN, reklam çerezleri açıklaması mevcut
- **Hakkımızda** – Site amacı ve içerik açıklaması
- **İletişim** – Kullanıcıların ulaşabileceği iletişim sayfası
- **ads.txt** – `public/ads.txt` mevcut; onay sonrası Google satırı eklenir
- **Reklam alanları** – Onay sonrası FaultCodeContent içine 3 reklam yuvası (above, mid, below) eklenecek; şu an kaldırıldı
- **HTTPS** – Site `https://obdfaultcode.com` üzerinden servis edilmeli

## AdSense Başvurusu Öncesi Kontrol Listesi

1. [ ] **Site yayında mı?** – obdfaultcode.com canlı ve HTTPS ile erişilebilir olmalı
2. [ ] **İçerik yeterli mi?** – En az 15–20 kaliteli sayfa (mevcut: 30+ arıza kodu sayfası)
3. [ ] **Orijinal içerik mi?** – Tüm metinler özgün, kopyalanmış değil
4. [ ] **Navigasyon net mi?** – Ana sayfa, Hakkımızda, İletişim, Gizlilik, Çerez linkleri görünür
5. [ ] **Mobil uyumlu mu?** – Viewport meta ve responsive CSS mevcut

## Onay Sonrası Yapılacaklar

1. **ads.txt güncelle**
   - AdSense > Hesap > Ads.txt sayfasından satırı kopyala
   - `public/ads.txt` içindeki yorumları sil, Google satırını ekle
   - Örnek: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`

2. **Site doğrulama**
   - AdSense başvurusunda site URL’i: `https://obdfaultcode.com`
   - Gerekirse `Layout.astro` head içine verilen meta etiketini ekle

3. **Reklam kodlarını ekle**
   - AdSense > Reklamlar > Reklam birimleri’nden kod al
   - `src/components/FaultCodeContent.astro` içinde şu konumlara reklam snippet'leri ekle: (1) başlık/meta sonrası, (2) Belirtiler/Nedenler/Çözümler bölümlerinden sonra, (3) Uzman görüşü bölümünden sonra (Disclaimer öncesi). İstersen `.ad-slot` div'leri ve `src/styles/global.css` içinde `.ad-slot` stilini tekrar ekleyip snippet'leri bu div'lere koyabilirsin.

## robots.txt Örneği (Mevcut)

```
User-agent: *
Allow: /

Sitemap: https://obdfaultcode.com/sitemap.xml
```

Bu yapı AdSense için uygundur; özel engelleme gerekmez.

## Google Search Console – Sitemap (Adım Adım)

Siten **obdfaultcode.com**, **http://obdfaultcode.com** ve **https://obdfaultcode.com** olarak açılıyor. GSC ve sitemap’in geçerli olması için **tek canonical adres** kullan: **https://obdfaultcode.com**. Proje zaten buna göre ayarlı.

### 1. Yönlendirmeleri kur (önemli)

Diğer adresler canonical’e yönlensin ki Google tek adresi görsün:

- **Cloudflare kullanıyorsan:** Dashboard → **Rules** → **Redirect Rules** → **Create rule**
  - **Name:** `www → canonical`
  - **When:** `(http.host eq "www.obdfaultcode.com")` (www’li istekler → canonical’e yönlendir)
  - **Then:** Dynamic redirect → URL: `https://obdfaultcode.com${uri.path}` → Status: **301**.  
  Ayrıca **SSL/TLS** → **Edge Certificates** içinde **“Always Use HTTPS”** açık olsun (http → https).
- **Netlify:** Domain settings → Add domain alias `obdfaultcode.com` → “Redirect to https://obdfaultcode.com” ve “Force HTTPS” açık olsun.

### 2. GSC’de tek mülk kullan

- **Mülk ekle:** Search Console → **Mülk ekle** → **URL öneki** → tam olarak: **`https://obdfaultcode.com`**  
  (Sonunda `/` veya yol olmasın; `http://` yazma.)
- **Doğrula:** HTML etiket, HTML dosyası veya DNS ile doğrula.
- **Sitemap ekle:** Sol menü **Sitemaps** → “Yeni sitemap ekle” alanına sadece **`sitemap.xml`** yaz → **Gönder**.  
  Tam URL: `https://obdfaultcode.com/sitemap.xml`

### 3. “Geçersiz” devam ederse

- GSC’de **başka mülk ekleme** (http://obdfaultcode.com veya https://obdfaultcode.com). Sitemap yalnızca **https://obdfaultcode.com** mülküne eklenir.
- Tarayıcıda **https://obdfaultcode.com/sitemap.xml** açılıyor mu kontrol et; XML listesi görünmeli.
- Yönlendirmeleri kurduktan sonra birkaç dakika bekle, sonra GSC’de “Sitemap’i test et” / “Yeniden getir” dene.

## Yapılmaması Gerekenler

- Reklamları içeriğin önüne koymak (sayfa başı 2–3 reklam yeterli)
- Tıklama tuzağı veya yanıltıcı linkler
- Yetişkin, şiddet veya yasadışı içerik
- Boş veya “Yapım aşamasında” sayfalar
