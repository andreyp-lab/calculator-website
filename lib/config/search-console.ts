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
   *
   * הדרך המהירה ביותר (ללא token): https://www.bing.com/webmasters →
   *   "Import from Google Search Console" → התחברות לחשבון Google → ייבוא בקליק אחד.
   *   במסלול זה אין צורך למלא את השדה הזה כלל.
   *
   * לחלופין (meta tag): Bing Webmaster → הוסף אתר → "Meta Tag" → העתק את ה-content
   *   לכאן, והערך ייכנס אוטומטית ל-<head> דרך app/layout.tsx (metadata.other['msvalidate.01']).
   *
   * הערה: זחילת Bing כבר מכוסה — /api/indexnow מגיש את כל ה-URLs ל-Bing/IndexNow.
   * אימות ה-Webmaster נחוץ רק לצפייה בדוחות ביצועים, לא לאינדוקס עצמו.
   */
  bing: '',
} as const;
