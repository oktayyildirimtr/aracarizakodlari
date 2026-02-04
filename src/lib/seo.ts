export const SITE_URL = 'https://obdfaultcode.com';
export const SITE_NAME = 'OBD-II Arıza Kodları';

export interface MetaInput {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
}

export function buildMeta(input: MetaInput) {
  const title = input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`;
  const canonical = input.canonical ? (input.canonical.startsWith('http') ? input.canonical : `${SITE_URL}${input.canonical}`) : undefined;
  return {
    title,
    description: input.description,
    canonical: canonical ?? SITE_URL + '/',
    noindex: input.noindex ?? false,
  };
}

export function siteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: 'OBD-II arıza kodları Türkçe rehberi. P0xxx kodlarının anlamı, hangi araçlarda görüldüğü ve tahmini onarım maliyetleri.',
        inLanguage: 'tr-TR',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/kodlar?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };
}

export function faqSchema(faq: { question_tr: string; answer_tr: string }[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question_tr,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer_tr,
      },
    })),
  };
}

/** Arıza kodu sayfaları için Article schema */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    dateModified: opts.dateModified,
    inLanguage: 'tr-TR',
  };
}

/** Breadcrumb schema */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  if (items.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
