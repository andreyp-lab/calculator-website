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

  // למילוי על ידי בעל האתר:
  owner: {
    name: '[יש למלא - שם פרטי + משפחה / שם חברה]',
    type: 'private' as const, // 'private' | 'company'
    address: '[יש למלא - כתובת]',
    email: 'andrey.platonov28@gmail.com', // ברירת מחדל - לעדכן
  },

  legal: {
    jurisdictionCity: 'תל אביב', // העיר שבה הסמכות
    privacyLastUpdated: '17.5.2026',
    termsLastUpdated: '17.5.2026',
    accessibilityLastUpdated: '17.5.2026',
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
