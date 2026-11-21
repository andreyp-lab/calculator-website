/**
 * תעריפי חשמל ומים ביתיים 2026 — נתונים ידניים ממקור רשמי בלבד (אין למשוך אוטומטית).
 * מע"מ מגיע מ-`VAT_2026.standard` ב-tax-2026.ts; כל המספרים כאן הם ללא מע"מ.
 *
 * חשמל — רשות החשמל, ספר התעריפים (מהדורת יולי 2026), הטבלה "תעריף אחיד, ביתי":
 *   https://www.gov.il/BlobFolder/generalpage/tarriffbook/he/sefer_tariff_07_2026.pdf
 *   הטבלאות מתעדכנות בתחילת כל חצי שנה (1 בינואר ו-1 ביולי) לפי החלטה 72806.
 *   לא אומת: המרת תשלום הקיבולת (₪ לקו"א לשנה) לגודל חיבור ביתי, ותעריף תעו"ז וולונטרי.
 *
 * מים וביוב — רשות המים, ספר התעריפים בתוקף מ-1.1.2026 (גרסה 3, 16.2.2026):
 *   https://www.gov.il/BlobFolder/reports/rates_general1/he/taarif_ספר תעריפים ינואר 2026 - גרסה 3.pdf
 *   התעריף הביתי כולל ביוב (צרכני תאגידי מים). לא אומת: שינוי אפשרי באמצע 2026, ותעריפי 2027.
 */

export const ELECTRICITY_HOUSEHOLD_2026 = {
  /** אגורות לקוט"ש, ללא מע"מ — תעריף אחיד, בתוקף מ-1.7.2026 */
  agorotPerKwh: 53.83,
  /** תשלום קבוע לשירותי צרכנות, ₪ לחשבון דו־חודשי ללא מע"מ — חד־פאזי: חלוקה 9.97 + אספקה 15.60 */
  fixedPerBillSinglePhase: 25.57,
  /** תלת־פאזי מתחת ל-3×100A: חלוקה 11.56 + אספקה 15.53 */
  fixedPerBillThreePhase: 27.09,
  /** תשלום קיבולת ₪ לקו"א לשנה ללא מע"מ — מ-1.7.2026 */
  capacityPerKvaYear: 6.18,
  /** הנחה לנהנים מגמלאות רווחה (סעיף 2(א4) לחוק הבטחת הכנסה) על 400 קוט"ש ראשונים בחודש */
  welfareDiscountPct: 50,
  welfareDiscountKwhPerMonth: 400,
  validFrom: '2026-07-01',
  verifiedAt: '2026-11-20',
  sourceUrl: 'https://www.gov.il/BlobFolder/generalpage/tarriffbook/he/sefer_tariff_07_2026.pdf',
} as const;

export const WATER_HOUSEHOLD_2026 = {
  /** ₪ למ"ק, ללא מע"מ, כולל ביוב — כמות מוכרת (עד המכסה) */
  quotaPricePerM3: 7.21,
  /** ₪ למ"ק, ללא מע"מ, כולל ביוב — מעבר למכסה */
  aboveQuotaPricePerM3: 13.24,
  /** מכסה: 3.5 מ"ק לנפש לחודש, ולא פחות מ-7 מ"ק לחודש ליחידת דיור */
  quotaM3PerPersonPerMonth: 3.5,
  minQuotaM3PerMonth: 7,
  validFrom: '2026-01-01',
  verifiedAt: '2026-11-20',
  sourceUrl:
    'https://www.gov.il/BlobFolder/reports/rates_general1/he/taarif_%D7%A1%D7%A4%D7%A8%20%D7%AA%D7%A2%D7%A8%D7%99%D7%A4%D7%99%D7%9D%20%D7%99%D7%A0%D7%95%D7%90%D7%A8%202026%20-%20%D7%92%D7%A8%D7%A1%D7%94%203.pdf',
} as const;
