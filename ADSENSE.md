# Google AdSense Onay Rehberi

Bu dokümanda sitenin AdSense onayı için yapılması gerekenler ve projede zaten mevcut olanlar özetlenir.

## Projede Mevcut Olanlar ✓

- **robots.txt** – `public/robots.txt` mevcut; tüm botlara izin verir, sitemap linki içerir
- **Sitemap** – Build sonrası `dist/sitemap-index.xml` ve `dist/sitemap-0.xml` oluşturulur
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

Sitemap: https://obdfaultcode.com/sitemap-index.xml
```

Bu yapı AdSense için uygundur; özel engelleme gerekmez.

## Yapılmaması Gerekenler

- Reklamları içeriğin önüne koymak (sayfa başı 2–3 reklam yeterli)
- Tıklama tuzağı veya yanıltıcı linkler
- Yetişkin, şiddet veya yasadışı içerik
- Boş veya “Yapım aşamasında” sayfalar
