# Siteyi Yayınlama – Adım Adım Rehber

Bu rehber, projeyi sıfırdan yayına almak için gereken adımları özetler.

---

## Adım 1: Ortamı Kontrol Et

Terminal’de şunları çalıştır:

```bash
node -v   # v20 veya üzeri olmalı
npm -v    # 9 veya 10 çıktısı yeterli
```

Eksikse: **KURULUM.md** dosyasındaki 1–4. adımları uygula (Xcode araçları, Homebrew, Node.js).

---

## Adım 2: Proje Dizinine Geç

```bash
cd ~/Desktop/arizakodlariprojem
```

---

## Adım 3: Bağımlılıkları Yükle

```bash
npm install
```

---

## Adım 4: Veritabanını Hazırla

**Sadece 3 örnek kodla (P0171, P0420, P0300):**

```bash
npm run db:reset
```

**Tüm OBD-II kodlarıyla, en çok aranan 30’u sitede göstermek için:**

```bash
npm run fetch-dtcmapping    # İsteğe bağlı
npm run db:prepare          # Veritabanı oluşturur
git add data/ariza.db
git commit -m "Veritabanı eklendi (Cloudflare için)"
```

---

## Adım 5: Yerelde Test Et

```bash
npm run build
npm run preview
```

Tarayıcıda **http://localhost:4321** açılırsa build doğru çalışıyor demektir. Çıkmak için **Ctrl + C**.

---

## Adım 6: Domain’i Ayarla

Siteyi hangi adreste yayınlayacaksan, `src/lib/seo.ts` içindeki `SITE_URL` değerini güncelle:

```ts
export const SITE_URL = 'https://senin-domain.com';
```

Henüz domain yoksa Cloudflare/Netlify’ın verdiği adresi kullanabilirsin (örn. `https://arizakodlari.pages.dev`).

---

## Adım 7: GitHub’a Yükle

1. https://github.com adresinde hesap aç (yoksa).
2. Yeni repo oluştur (ör. `arizakodlari`), README ekleme.
3. Terminal’de:

```bash
cd ~/Desktop/arizakodlariprojem
git init
git add .
git commit -m "İlk commit - OBD-II arıza kodları sitesi"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/arizakodlari.git
git push -u origin main
```

`KULLANICI_ADIN` yerine kendi GitHub kullanıcı adını yaz.

---

## Adım 8: Cloudflare Pages ile Yayınla

1. **Cloudflare hesabı:** https://dash.cloudflare.com → Sign up (ücretsiz).
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. GitHub’dan `arizakodlari` reposunu seç.
4. **Build ayarları:**
   - **Framework preset:** None
   - **Build command:** (veritabanı repoda olduğu için sadece build yeterli)
     ```bash
     npm run build
     ```
   - **Build output directory:** `dist`
   - **Root directory:** (boş bırak)
5. **Environment variables** (Settings → Environment variables):
   - `NODE_VERSION` = `20`
6. **Save and Deploy** ile yayınla.

İlk build 3–5 dakika sürebilir. Başarılı olursa `https://proje-adi.pages.dev` adresinde site yayında olur.

---

## Adım 9: Özel Domain Bağlama (İsteğe Bağlı)

1. Cloudflare Pages projesinde **Custom domains**.
2. **Set up a custom domain** → domain adını gir (örn. `arizakodlari.com`).
3. Domain sağlayıcında (GoDaddy, Namecheap vb.) Cloudflare’in verdiği nameserver’ları kaydet.
4. `src/lib/seo.ts` ve `robots.txt` içindeki `SITE_URL` / sitemap adresini bu domain’e güncelle, ardından yeniden build al ve deploy et.

---

## Özet Komut Sırası (Yayın Öncesi)

| Sıra | Komut |
|------|--------|
| 1 | `cd ~/Desktop/arizakodlariprojem` |
| 2 | `npm install` |
| 3 | `npm run fetch-dtcmapping` (isteğe bağlı) |
| 4 | `npm run db:prepare` |
| 5 | `git add data/ariza.db && git commit -m "Veritabanı eklendi"` |
| 6 | `npm run build` (yerelde test) |
| 7 | GitHub’a push |
| 8 | Cloudflare Pages’e bağla ve deploy et |

---

## Sorun Çıkarsa

- **"unable to open database file":** Veritabanı repoda olmalı. Build command sadece `npm run build` olsun. Yerelde `npm run db:prepare` yapıp `data/ariza.db` commit et. Veritabanı yolları `process.cwd()` ile ayarlandı; Cloudflare build ortamıyla uyumlu olmalı. Hata sürerse Cloudflare’de **Root directory** boş bırakıldığından ve **Build command**’ın proje kökünde çalıştığından emin ol.
- **Build hatası:** `better-sqlite3` hatası alırsan Node 20 kullandığından emin ol; Cloudflare’de `NODE_VERSION=20` ayarlı olsun.
- **Sayfa bulunamadı:** `dist` klasörü doğru publish edildiyse sorun olmaz; Cloudflare’de **Build output directory** `dist` olmalı.
- **Domain açılmıyor:** DNS propagasyonu 24–48 saat sürebilir; Cloudflare durumunu kontrol et.
