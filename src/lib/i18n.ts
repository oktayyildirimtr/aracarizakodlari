/**
 * i18n: URL structure, UI strings, hreflang helpers
 * Languages: tr (default), en
 */

export const SITE_URL = 'https://aracarizakodlari.pages.dev';

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
    nav: { home: string; codes: string; about: string; contact: string };
    footer: { disclaimer: string; cookies: string; privacy: string; cookieNotice: string };
    home: { title: string; lead1: string; lead2: string; searchLabel: string; searchPlaceholder: string; codesTitle: string; viewAll: string; moreCodes: string };
    codes: { title: string; lead: string; searchLabel: string; categoryLabel: string; all: string; count: string };
    faultCode: { meaning: string; officialDef: string; driveSafe: string; cost: string; costNote: string; expert: string; faq: string; related: string };
    disclaimer: string;
    expertFallbackEn: string;
    driveSafeFallbackEn: string;
    costFallbackEn: string;
  }
> = {
  tr: {
    siteName: 'OBD-II Arıza Kodları',
    nav: { home: 'Ana sayfa', codes: 'Tüm kodlar', about: 'Hakkımızda', contact: 'İletişim' },
    footer: {
      disclaimer: 'OBD-II arıza kodları hakkında bilgilendirme amaçlı içerikler. Profesyonel teşhis yerine geçmez.',
      cookies: 'Sitemizde çerezler kullanılabilir.',
      privacy: 'Gizlilik politikası',
      cookieNotice: 'Çerez bildirimi',
    },
    home: {
      title: 'OBD-II Arıza Kodları Rehberi',
      lead1: 'Motor arıza lambası yandığında okunan OBD-II kodları neye işaret eder? Bu sitede kod bazlı Türkçe açıklamalar ve Türkiye için tahmini onarım maliyetlerini bulabilirsiniz.',
      lead2: 'İçerikler yalnızca bilgilendirme içindir; teşhis ve onarım için mutlaka yetkili servise gidin.',
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
      symptoms: 'Yaygın belirtiler',
      causes: 'Olası nedenler',
      fix: 'Nasıl giderilir?',
      officialDef: 'Resmi tanım (İngilizce, SAE/ISO uyumlu):',
      driveSafe: 'Bu şekilde araç kullanılır mı?',
      cost: 'Türkiye için tahmini onarım maliyeti',
      costNote: 'Bu kod için genel bir maliyet aralığı verilememektedir; sebep ve araca göre değişir. Bir serviste teşhis yaptırmanız önerilir.',
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
    nav: { home: 'Home', codes: 'All codes', about: 'About', contact: 'Contact' },
    footer: {
      disclaimer: 'OBD-II error code content is for information only. Not a substitute for professional diagnosis.',
      cookies: 'This site may use cookies.',
      privacy: 'Privacy policy',
      cookieNotice: 'Cookie notice',
    },
    home: {
      title: 'OBD-II Error Codes Guide',
      lead1: 'When your check engine light comes on, OBD-II codes tell you what the issue might be. Find code definitions, explanations, and repair cost estimates for Turkey.',
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
export const ROUTES: Record<Lang, { home: string; codes: string; about: string; contact: string; privacy: string; cookieNotice: string }> = {
  tr: { home: 'tr', codes: 'tr/kodlar', about: 'tr/hakkimizda', contact: 'tr/iletisim', privacy: 'tr/gizlilik-politikasi', cookieNotice: 'tr/cerez-bildirimi' },
  en: { home: 'en', codes: 'en/codes', about: 'en/about', contact: 'en/contact', privacy: 'en/privacy-policy', cookieNotice: 'en/cookie-policy' },
};

/** Fault code slug suffix per language */
export const FAULT_SLUG: Record<Lang, string> = { tr: '-nedir', en: '-meaning' };

/** Build fault code URL path (e.g. tr/p0171-nedir or en/p0171-meaning) */
export function faultCodePath(code: string, lang: Lang): string {
  return `${lang}/${code.toLowerCase()}${FAULT_SLUG[lang]}`;
}

/** Build full fault code URL */
export function faultCodeUrl(code: string, lang: Lang): string {
  return `${SITE_URL}/${faultCodePath(code, lang)}`;
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
  };

  const page = parts[1] || '';
  return routeMap[page] ?? ROUTES[targetLang].home;
}

/** Build hreflang alternate URLs for a page */
export function getHreflangUrls(path: string, lang: Lang): { lang: string; url: string }[] {
  const trPath = lang === 'tr' ? path : getAlternatePath(path, 'tr');
  const enPath = lang === 'en' ? path : getAlternatePath(path, 'en');
  return [
    { lang: 'tr', url: `${SITE_URL}/${trPath}` },
    { lang: 'en', url: `${SITE_URL}/${enPath}` },
    { lang: 'x-default', url: `${SITE_URL}/${trPath}` },
  ];
}
