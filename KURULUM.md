# Mac’te Sıfırdan Kurulum ve Yayınlama Rehberi

Bilgisayarında hiçbir şey kurulu değilse, bu adımları sırayla uygula. Hepsi Terminal üzerinden çalışacak.

---

## 1. Xcode Command Line Tools (geliştirici araçları)

Terminal’i aç (**Spotlight** → “Terminal” yaz → Enter) ve şunu çalıştır:

```bash
xcode-select --install
```

Açılan pencerede **“Yükle”** de. Kurulum birkaç dakika sürebilir. Bu araçlar, ileride Node eklentileri (ör. `better-sqlite3`) derlemek için gerekli.

---

## 2. Homebrew (paket yöneticisi)

Homebrew yoksa yükle:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Kurulum bitince ekranda gösterilen **“Next steps”** komutlarını çalıştır. Genelde şuna benzer (Apple Silicon Mac’te):

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Intel Mac’te `/usr/local` yolunu kullanabilir; ekrandaki talimatı uygula. Sonra Terminal’i kapatıp yeniden aç.

Kontrol:

```bash
brew --version
```

---

## 3. Node.js (LTS sürümü)

Proje Node 20+ istiyor. Homebrew ile:

```bash
brew install node@20
```

Kurulumdan sonra PATH’e ekle (Apple Silicon):

```bash
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

Intel Mac’te genelde `/usr/local/opt/node@20/bin` kullanılır; gerekirse `brew info node@20` çıktısına bak.

Kontrol:

```bash
node -v   # v20.x.x benzeri
npm -v    # 10.x.x benzeri
```

---

## 4. Git (versiyon kontrolü)

Genelde Xcode araçlarıyla gelir. Yoksa:

```bash
brew install git
git --version
```

---

## 5. Projeyi hazırlama

Proje zaten `Desktop/arizakodlariprojem` içindeyse doğrudan oraya geç. Değilse (ör. başka bilgisayardan geldiyse) projeyi indirip aç.

```bash
cd ~/Desktop/arizakodlariprojem
```

Şu an bu klasörde olduğundan emin ol.

---

## 6. Bağımlılıkları yükleme

```bash
npm install
```

İlk seferde birkaç dakika sürebilir. Hata alırsan (ör. `better-sqlite3` derleme hatası) 1. adımdaki Xcode Command Line Tools’un kurulu olduğundan emin ol.

---

## 7. Veritabanını oluşturma

```bash
npm run db:reset
```

Bu komut:

- `data/ariza.db` dosyasını oluşturur  
- Örnek arıza kodlarını (P0171, P0420, P0300 vb.) ekler  

Çıktıda “Veritabanı oluşturuldu” ve “Örnek veri eklendi” benzeri mesajlar görülmeli.

---

## 8. Geliştirme sunucusunu çalıştırma

```bash
npm run dev
```

Tarayıcıda **http://localhost:4321** adresini aç. Ana sayfa, arıza kodları ve marka/model sayfaları buradan görülebilir.

Durdurmak için Terminal’de **Ctrl + C**.

---

## 9. Production build (yayına hazır çıktı)

```bash
npm run build
```

Bu, `dist/` klasöründe statik site üretir. Yayınlarken bu klasörü (veya build çıktısını) kullanacaksın.

---

## 10. Yayınlama seçenekleri

### A) Cloudflare Pages (önerilen, ücretsiz)

1. **Cloudflare hesabı:** https://dash.cloudflare.com → Sign up.
2. **Pages:** Sol menüden **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Projeyi GitHub’a atıyorsan repo’yu seç. GitHub’da proje yoksa önce:

   ```bash
   cd ~/Desktop/arizakodlariprojem
   git init
   git add .
   git commit -m "Initial commit"
   ```

   Sonra https://github.com/new adresinden **yeni repo** oluştur (ör. `arizakodlari`). “Create repository” sonrası gösterilen komutlara benzer şekilde:

   ```bash
   git remote add origin https://github.com/KULLANICI_ADIN/arizakodlari.git
   git branch -M main
   git push -u origin main
   ```

   `KULLANICI_ADIN` yerine kendi GitHub kullanıcı adını yaz. GitHub hesabın yoksa https://github.com üzerinden ücretsiz aç.

4. **Build ayarları (Cloudflare Pages):**
   - **Framework preset:** None (veya Astro seçiliyse Astro)
   - **Build command:**  
     ```bash
     npm run db:reset && npm run build
     ```
   - **Build output directory:** `dist`
   - **Root directory:** (boş bırak, proje kökü)
   - **Environment variables:**  
     - `NODE_VERSION` = `20`  
     (Cloudflare’de Node sürümü Environment Variables’dan ayarlanıyorsa)

5. **Deploy** tetikle. İlk build uzun sürebilir.

Cloudflare, `better-sqlite3` gibi native modüllerle bazen uyumsuzluk yaşayabilir. Hata alırsan **B** veya **C** seçeneklerini dene.

---

### B) Netlify (ücretsiz)

1. https://app.netlify.com → Sign up.
2. **Add new site** → **Import an existing project** → GitHub ile repo’yu bağla.
3. **Build settings:**
   - **Build command:**  
     ```bash
     npm run db:reset && npm run build
     ```
   - **Publish directory:** `dist`
   - **Base directory:** (boş)
4. **Environment variables:**  
   - `NODE_VERSION` = `20`  
   (Netlify’da Vars sekmesinden)
5. **Deploy** çalıştır.

---

### C) Vercel (ücretsiz)

1. https://vercel.com → Sign up.
2. **Add New** → **Project** → GitHub repo’yu seç.
3. **Framework Preset:** Astro.
4. **Build Command:**  
   ```bash
   npm run db:reset && npm run build
   ```
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`
7. **Deploy** et.

---

### D) Manuel: `dist` dosyalarını herhangi bir hosta yükleme

Build’i kendin alıp, statik host (ör. kendi sunucun, shared hosting “public_html” vb.) kullanabilirsin:

```bash
npm run db:reset
npm run build
```

Ardından `dist/` içeriğini FTP/SFTP veya host panelindeki “Dosya yükle” ile yükle. Ana dizin, `dist` içindeki `index.html` ve diğer dosyaların olduğu yer olmalı.

---

## 11. Domain ve `robots.txt` / sitemap

- **Domain:** Cloudflare / Netlify / Vercel’de custom domain ekleyebilirsin.  
- Projede `site: 'https://aracarizakodlari.pages.dev'` varsa, yayında kullandığın domain’e göre `astro.config.mjs` içindeki `site` ve `src/lib/seo.ts` içindeki `SITE_URL` değerlerini güncelle.  
- `robots.txt` ve sitemap build sırasında otomatik üretilir; `dist` ile birlikte yayına gider.

---

## 12. Özet komut listesi (tekrar)

| Adım | Komut |
|------|--------|
| Xcode araçları | `xcode-select --install` |
| Homebrew | `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` |
| Node 20 | `brew install node@20` + PATH ayarı |
| Proje dizini | `cd ~/Desktop/arizakodlariprojem` |
| Bağımlılıklar | `npm install` |
| Veritabanı | `npm run db:reset` |
| Geliştirme | `npm run dev` → http://localhost:4321 |
| Build | `npm run build` → `dist/` |

Takıldığın adımda hata mesajını (ve mümkünse Terminal çıktısını) paylaşırsan, bir sonraki adımı birlikte netleştirebiliriz.
