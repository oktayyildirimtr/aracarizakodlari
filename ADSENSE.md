# Google AdSense Onay Rehberi

Bu dokümanda sitenin AdSense onayı için yapılması gerekenler ve projede zaten mevcut olanlar özetlenir.

## Projede Mevcut Olanlar ✓

- **robots.txt** – `public/robots.txt` mevcut; tüm botlara izin verir, sitemap linki içerir
- **Sitemap** – Build sonrası `dist/sitemap.xml` (index), `dist/sitemap-0.xml` oluşturulur; her URL’de `lastmod` vardır
- **Gizlilik Politikası** – TR ve EN, AdSense / DoubleClick / opt-out linkleri ile güncellendi
- **Çerez Bildirimi** – TR ve EN, reklam çerezleri açıklaması mevcut
- **Hakkımızda** – Site amacı ve içerik açıklaması
- **İletişim** – Kullanıcıların ulaşabileceği iletişim sayfası
- **ads.txt** – `public/ads.txt` mevcut; onay sonrası Google satırı eklenir
- **Reklam alanları** – Onay sonrası FaultCodeContent içine 3 reklam yuvası (above, mid, below) eklenecek; şu an kaldırıldı
- **HTTPS** – Site `https://www.obdfaultcode.com` üzerinden servis edilmeli

## AdSense Başvurusu Öncesi Kontrol Listesi

1. [ ] **Site yayında mı?** – www.obdfaultcode.com canlı ve HTTPS ile erişilebilir olmalı
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
   - AdSense başvurusunda site URL’i: `https://www.obdfaultcode.com`
   - Gerekirse `Layout.astro` head içine verilen meta etiketini ekle

3. **Reklam kodlarını ekle**
   - AdSense > Reklamlar > Reklam birimleri’nden kod al
   - `src/components/FaultCodeContent.astro` içinde şu konumlara reklam snippet'leri ekle: (1) başlık/meta sonrası, (2) Belirtiler/Nedenler/Çözümler bölümlerinden sonra, (3) Uzman görüşü bölümünden sonra (Disclaimer öncesi). İstersen `.ad-slot` div'leri ve `src/styles/global.css` içinde `.ad-slot` stilini tekrar ekleyip snippet'leri bu div'lere koyabilirsin.

## robots.txt Örneği (Mevcut)

```
User-agent: *
Allow: /

Sitemap: https://www.obdfaultcode.com/sitemap.xml
```

Bu yapı AdSense için uygundur; özel engelleme gerekmez.

## Google Search Console – Sitemap

Sitemap “geçersiz” uyarısı alıyorsan:

1. **Gönderilecek adres:** Taraf özelliğin `https://www.obdfaultcode.com` ise sadece **`sitemap.xml`** yaz (veya tam adres: `https://www.obdfaultcode.com/sitemap.xml`). `sitemap-index.xml` veya `sitemap-0.xml` değil.
2. **Site canlı mı?** Tarayıcıda `https://www.obdfaultcode.com/sitemap.xml` açılıyor ve XML görünüyorsa sitemap yayında demektir.
3. **Domain eşleşmesi:** Search Console’daki mülk (property) adresi, sitemap’teki adreslerle aynı olmalı (ikisi de www’li veya ikisi de www’siz).
4. **Yeniden deploy:** Kodu güncelledikten sonra `npm run build` çalıştırıp `dist` klasörünü tekrar yayına al; böylece güncel `sitemap.xml` ve `sitemap-0.xml` sunulur.

## Yapılmaması Gerekenler

- Reklamları içeriğin önüne koymak (sayfa başı 2–3 reklam yeterli)
- Tıklama tuzağı veya yanıltıcı linkler
- Yetişkin, şiddet veya yasadışı içerik
- Boş veya “Yapım aşamasında” sayfalar
