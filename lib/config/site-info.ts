import type { Metadata } from 'next';

/**
 * site-info.ts
 * -------------
 * פרטי האתר המשמשים בדפי חוק (פרטיות, תנאי שימוש, נגישות).
 * מלא את הפרטים החסרים לפני הפעלה מסחרית.
 */

export const SITE_INFO = {
  name: 'חשבונאי - FinCalc',
  domain: 'cheshbonai.co.il',
  url: 'https://cheshbonai.co.il',

  // פרטי בעל האתר
  owner: {
    name: 'אנדרי פלטונוב',
    type: 'private' as const, // 'private' | 'company'
    address: 'נס ציונה',
    email: 'andrey.platonov28@gmail.com',
  },

  legal: {
    jurisdictionCity: 'תל אביב', // העיר שבה הסמכות
    privacyLastUpdated: '29.9.2026',
    termsLastUpdated: '17.5.2026',
    accessibilityLastUpdated: '29.9.2026',
  },

  contact: {
    email: 'andrey.platonov28@gmail.com',
    accessibilityEmail: 'andrey.platonov28@gmail.com', // אותו אימייל - אין רכז נדרש
    contactPage: '/contact',
  },

  hosting: {
    provider: 'Vercel Inc.',
    providerUrl: 'https://vercel.com',
    privacyPolicyUrl: 'https://vercel.com/legal/privacy-policy',
    location: 'ארצות הברית (US)',
  },
} as const;

/** Fill missing social fields from a page's own metadata, preserving explicit
 * values and null blocks without guessing a URL for a shared layout. */
export function withPageSocialMetadata(metadata: Metadata): Metadata {
  const pageTitle = metadata.title;
  const title = typeof pageTitle === 'string'
    ? pageTitle
    : pageTitle && ('absolute' in pageTitle ? pageTitle.absolute : pageTitle.default);
  const canonical = metadata.alternates?.canonical;
  if (!title || !canonical) return metadata;

  const url = typeof canonical === 'string' || canonical instanceof URL
    ? canonical
    : canonical.url;

  return {
    ...metadata,
    openGraph: metadata.openGraph === null ? null : {
      title,
      description: metadata.description ?? undefined,
      url,
      type: 'website',
      locale: 'he_IL',
      siteName: 'חשבונאי',
      images: ['/opengraph-image'],
      ...metadata.openGraph,
    },
    twitter: metadata.twitter === null ? null : {
      card: 'summary_large_image',
      title,
      description: metadata.description ?? undefined,
      images: ['/opengraph-image'],
      ...metadata.twitter,
    },
  };
}
