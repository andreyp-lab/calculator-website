/**
 * search-console.ts
 * ------------------
 * קודי אימות לכלי מנהלי חיפוש.
 *
 * כיצד למלא:
 *  1. Google Search Console → הוסף נכס → בחר "Tag HTML" → העתק את ה-content
 *     (רק הערך, ללא "google-site-verification=")
 *  2. Bing Webmaster Tools → הוסף אתר → בחר "Meta Tag" → העתק את ה-content
 *
 * לאחר מילוי – עדכן גם את הערכים ב-app/layout.tsx
 * (metadata.verification.google ו-metadata.other['msvalidate.01'])
 */
export const SEARCH_CONSOLE = {
  /**
   * Google Search Console verification code.
   * Example: 'abc123xyz456' (without "google-site-verification=" prefix)
   * Register at: https://search.google.com/search-console
   */
  google: 'Ec8f1CxhD0ZFZbsl7RWpCNIxYDWOtV5D7RpasmxX1uA',

  /**
   * Bing Webmaster Tools verification code.
   * Example: 'ABC123DEF456...'
   * Register at: https://www.bing.com/webmasters
   */
  bing: '',
} as const;
