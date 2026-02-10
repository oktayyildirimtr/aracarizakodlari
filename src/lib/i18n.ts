/**
 * i18n: URL structure, UI strings, hreflang helpers
 * Languages: tr (default), en
 */

export const SITE_URL = 'https://obdfaultcode.com';

/**
 * Fixed base domain for canonical URLs only. Must NEVER be derived from:
 * - request.url.origin
 * - Astro.url.origin
 * - headers().get("host") or any request headers
 * - environment variables or runtime host detection
 * Canonical host is always this literal; path is computed from route/pathname only.
 */
export const CANONICAL_BASE = 'https://obdfaultcode.com';

/**
 * Normalizes a route path (pathname only) to a stable form without leading/trailing slashes.
 * Strips .html when build.format is 'file' so canonicals stay slash-free and extension-free.
 * No query or hash. Use only the path segment of the URL, never the host.
 */
export function normalizeRoutePath(pathname: string): string {
  let p = pathname.replace(/^\//, '').trim().replace(/\/+$/, '');
  if (p.endsWith('.html')) p = p.slice(0, -5);
  return p;
}

/**
 * Builds the canonical URL for a page. Single source of truth for canonical output.
 * Path is normalized (no leading/trailing slashes). Output has NO trailing slash (trailingSlash: never).
 * Only Layout.astro may emit <link rel="canonical">.
 * - Host: always CANONICAL_BASE (fixed; never from request/headers/env).
 * - Always https, never www, no trailing slash in output.
 * - path: current page's exact route path only (e.g. "tr/p0141-nedir", "en/p0174-meaning"). No query or hash.
 */
export function getCanonicalUrl(path: string): string {
  const p = normalizeRoutePath(path);
  const base = CANONICAL_BASE.replace(/\/+$/, '');
  return p === '' ? `${base}/` : `${base}/${p}`;
}

/** Contact email displayed on site and used in schema */
export const CONTACT_EMAIL = 'contact@obdfaultcode.com';

export type Lang = 'tr' | 'en';

export const LANGUAGES: Lang[] = ['tr', 'en'];

export const DEFAULT_LANG: Lang = 'tr';

export const LANG_NAMES: Record<Lang, string> = {
  tr: 'Türkçe',
  en: 'English',
};

/** Kategori TR -> EN çevirisi (DB'deki category değerleri) */
export const CATEGORY_EN: Record<string, string> = {
  'Hava-yakıt ölçüm': 'Air-fuel metering',
  'Motor ve hava-yakıt': 'Engine and air-fuel',
  'Ateşleme ve misfire': 'Ignition and misfire',
  'Egzoz ve emisyon': 'Exhaust and emissions',
  'Hız ve rölanti': 'Speed and idle',
  'ECU ve çıkışlar': 'ECU and outputs',
  'Şanzıman': 'Transmission',
};

export function getCategoryDisplay(category: string | null, lang: Lang): string | null {
  if (!category) return null;
  return lang === 'en' && CATEGORY_EN[category] ? CATEGORY_EN[category] : category;
}

/** UI strings per language */
export const UI: Record<
  Lang,
  {
    siteName: string;
    nav: { home: string; codes: string; about: string; contact: string; terms: string };
    footer: { disclaimer: string; cookies: string; privacy: string; cookieNotice: string; terms: string };
    cookieBanner: { title: string; message: string; accept: string; reject: string; learnMore: string };
    home: { title: string; lead1: string; lead2: string; searchLabel: string; searchPlaceholder: string; codesTitle: string; viewAll: string; moreCodes: string };
    codes: { title: string; lead: string; searchLabel: string; categoryLabel: string; all: string; count: string };
    faultCode: { meaning: string; symptoms: string; causes: string; fix: string; officialDef: string; driveSafe: string; cost: string; costNote: string; expert: string; faq: string; related: string };
    disclaimer: string;
    expertFallbackEn: string;
    driveSafeFallbackEn: string;
    costFallbackEn: string;
  }
> = {
  tr: {
    siteName: 'OBD-II Arıza Kodları',
    nav: { home: 'Ana sayfa', codes: 'Tüm kodlar', about: 'Hakkımızda', contact: 'İletişim', terms: 'Kullanım koşulları' },
    footer: {
      disclaimer: 'OBD-II arıza kodları hakkında bilgilendirme amaçlı içerikler bulunmaktadır. Sorunun gerçek çözümü için mutlaka yetkili servise gidiniz.',
      cookies: 'Sitemizde çerezler kullanılabilir.',
      privacy: 'Gizlilik politikası',
      cookieNotice: 'Çerez bildirimi',
      terms: 'Kullanım koşulları',
    },
    cookieBanner: {
      title: 'Çerezler',
      message: 'Sitemiz deneyiminizi iyileştirmek ve trafik analizi için çerezler kullanabilir.',
      accept: 'Kabul et',
      reject: 'Reddet',
      learnMore: 'Çerez bildirimi',
    },
    home: {
      title: 'OBD-II Arıza Kodları Rehberi',
      lead1: 'Motor arıza lambası yandığında okunan OBD-II kodları neye işaret eder? Bu sitede, karşılaşılan hata kodlarına göre açıklamalar ve sorunun çözümü için tahmini onarım maliyetlerini bulabilirsiniz.',
      lead2: 'İçerikler yalnızca bilgilendirme içindir; teşhis ve onarım için mutlaka yetkili servise gidiniz.',
      searchLabel: 'Arıza kodu ara',
      searchPlaceholder: 'Kod veya anahtar kelime (örn. P0171)',
      codesTitle: 'Arıza kodları',
      viewAll: 'Tüm kodları listele ve ara',
      moreCodes: 'kod daha → Tüm kodlar',
    },
    codes: {
      title: 'Tüm arıza kodları',
      lead: 'Koda tıklayarak detay sayfasına gidebilir; arama veya kategoriyle filtreleyebilirsiniz.',
      searchLabel: 'Ara (kod veya başlık)',
      categoryLabel: 'Kategori',
      all: 'Tümü',
      count: 'kod listeleniyor.',
    },
    faultCode: {
      meaning: 'Arıza kodu ne anlama gelir?',
      symptoms: 'En sık görülen belirtiler',
      causes: 'Olası nedenler',
      fix: 'Nasıl giderilir?',
      officialDef: 'Resmi tanım (İngilizce, SAE/ISO uyumlu):',
      driveSafe: 'Bu şekilde araç kullanılır mı?',
      cost: 'Tahmini onarım maliyeti',
      costNote: 'İşçilik maliyetleri ve yedek parça fiyatları, başvurduğunuz servise göre değişebilir.',
      expert: 'Uzman görüşü',
      faq: 'Sık sorulan sorular',
      related: 'İlgili arıza kodları',
    },
    disclaimer: 'Bu sitedeki bilgiler genel bilgilendirme amaçlıdır. Araçlarınıza özel teşhis ve onarım için yetkili bir servise başvurunuz.',
    expertFallbackEn: '',
    driveSafeFallbackEn: '',
    costFallbackEn: '',
  },
  en: {
    siteName: 'OBD-II Error Codes',
    nav: { home: 'Home', codes: 'All codes', about: 'About', contact: 'Contact', terms: 'Terms of service' },
    footer: {
      disclaimer: 'OBD-II error code content is for information only. Not a substitute for professional diagnosis.',
      cookies: 'This site may use cookies.',
      privacy: 'Privacy policy',
      cookieNotice: 'Cookie notice',
      terms: 'Terms of service',
    },
    cookieBanner: {
      title: 'Cookies',
      message: 'This site may use cookies to improve your experience and for analytics.',
      accept: 'Accept',
      reject: 'Reject',
      learnMore: 'Cookie notice',
    },
    home: {
      title: 'OBD-II Error Codes Guide',
      lead1: 'When your check engine light comes on, OBD-II codes tell you what the issue might be. Find code definitions, explanations, and repair cost estimates.',
      lead2: 'Content is for information only. Always have your vehicle diagnosed by a qualified technician.',
      searchLabel: 'Search error codes',
      searchPlaceholder: 'Code or keyword (e.g. P0171)',
      codesTitle: 'Error codes',
      viewAll: 'List and search all codes',
      moreCodes: 'more codes → All codes',
    },
    codes: {
      title: 'All OBD-II error codes',
      lead: 'Click a code to see details. Use search or category to filter.',
      searchLabel: 'Search (code or title)',
      categoryLabel: 'Category',
      all: 'All',
      count: 'codes listed.',
    },
    faultCode: {
      meaning: 'What does this error code mean?',
      symptoms: 'Common symptoms',
      causes: 'What causes it?',
      fix: 'How to fix',
      officialDef: 'Official definition (SAE/ISO compliant):',
      driveSafe: 'Is it safe to drive?',
      cost: 'Estimated repair cost',
      costNote: 'Repair costs vary by cause and vehicle. Have a technician diagnose the issue.',
      expert: 'Expert opinion',
      faq: 'Frequently asked questions',
      related: 'Related error codes',
    },
    disclaimer: 'Information on this site is for general guidance only. Consult a qualified technician for diagnosis and repair.',
    expertFallbackEn: 'Have the vehicle diagnosed by a qualified technician. Do not ignore a check engine light—it may indicate an issue affecting emissions or performance.',
    driveSafeFallbackEn: 'Address the issue before extended driving. A lit check engine light can indicate problems that may worsen or affect safety.',
    costFallbackEn: 'Costs vary by vehicle and root cause. Get a professional diagnosis for an accurate estimate.',
  },
};

/** Route paths per language (without leading slash) */
export const ROUTES: Record<Lang, { home: string; codes: string; about: string; contact: string; privacy: string; cookieNotice: string; terms: string }> = {
  tr: { home: 'tr', codes: 'tr/kodlar', about: 'tr/hakkimizda', contact: 'tr/iletisim', privacy: 'tr/gizlilik-politikasi', cookieNotice: 'tr/cerez-bildirimi', terms: 'tr/kullanim-kosullari' },
  en: { home: 'en', codes: 'en/codes', about: 'en/about', contact: 'en/contact', privacy: 'en/privacy-policy', cookieNotice: 'en/cookie-policy', terms: 'en/terms-of-service' },
};

/** Fault code slug suffix per language */
export const FAULT_SLUG: Record<Lang, string> = { tr: '-nedir', en: '-meaning' };

/** Build fault code URL path (e.g. tr/p0171-nedir or en/p0171-meaning) */
export function faultCodePath(code: string, lang: Lang): string {
  return `${lang}/${code.toLowerCase()}${FAULT_SLUG[lang]}`;
}

/** Build full fault code URL (canonical form with trailing slash) */
export function faultCodeUrl(code: string, lang: Lang): string {
  return getCanonicalUrl(faultCodePath(code, lang));
}

/** Parse fault code from slug. Returns code or null. */
export function parseFaultSlug(slug: string, lang: Lang): string | null {
  const suffix = FAULT_SLUG[lang];
  if (!slug.endsWith(suffix)) return null;
  const code = slug.slice(0, -suffix.length).toUpperCase();
  return /^P\d{4}$/i.test(code) ? code : null;
}

/** Get alternate path for language switcher. currentPath e.g. "tr/p0171-nedir" (no leading slash) */
export function getAlternatePath(currentPath: string, targetLang: Lang): string {
  const clean = currentPath.replace(/^\/+/, '');
  const parts = clean.split('/').filter(Boolean);
  const lang = parts[0] as Lang;
  if (lang !== 'tr' && lang !== 'en') return ROUTES[targetLang].home;

  const slug = parts.slice(1).join('/');
  const code = parseFaultSlug(slug, lang);
  if (code) return faultCodePath(code, targetLang);

  const routeMap: Record<string, string> = {
    'kodlar': targetLang === 'tr' ? 'tr/kodlar' : 'en/codes',
    'codes': targetLang === 'tr' ? 'tr/kodlar' : 'en/codes',
    'hakkimizda': targetLang === 'tr' ? 'tr/hakkimizda' : 'en/about',
    'about': targetLang === 'tr' ? 'tr/hakkimizda' : 'en/about',
    'iletisim': targetLang === 'tr' ? 'tr/iletisim' : 'en/contact',
    'contact': targetLang === 'tr' ? 'tr/iletisim' : 'en/contact',
    'gizlilik-politikasi': targetLang === 'tr' ? 'tr/gizlilik-politikasi' : 'en/privacy-policy',
    'privacy-policy': targetLang === 'tr' ? 'tr/gizlilik-politikasi' : 'en/privacy-policy',
    'cerez-bildirimi': targetLang === 'tr' ? 'tr/cerez-bildirimi' : 'en/cookie-policy',
    'cookie-policy': targetLang === 'tr' ? 'tr/cerez-bildirimi' : 'en/cookie-policy',
    'kullanim-kosullari': targetLang === 'tr' ? 'tr/kullanim-kosullari' : 'en/terms-of-service',
    'terms-of-service': targetLang === 'tr' ? 'tr/kullanim-kosullari' : 'en/terms-of-service',
  };

  const page = parts[1] || '';
  return routeMap[page] ?? ROUTES[targetLang].home;
}

/** Build hreflang alternate URLs for a page (canonical form, no trailing slash per trailingSlash: never) */
export function getHreflangUrls(path: string, lang: Lang): { lang: string; url: string }[] {
  const trPath = lang === 'tr' ? path : getAlternatePath(path, 'tr');
  const enPath = lang === 'en' ? path : getAlternatePath(path, 'en');
  return [
    { lang: 'tr', url: getCanonicalUrl(trPath) },
    { lang: 'en', url: getCanonicalUrl(enPath) },
    { lang: 'x-default', url: getCanonicalUrl(trPath) },
  ];
}
