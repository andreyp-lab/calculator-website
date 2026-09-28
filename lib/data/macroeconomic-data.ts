/**
 * נתוני מקרו עדכניים - FinCalc
 *
 * ערכים ידניים. ISR טוען מחדש את הקובץ לאחר פריסה אך אינו מושך נתונים מהמקורות.
 *
 * תאריך אימות אחרון לערכים שאומתו: 2026-09-28
 *
 * מקורות:
 * - בנק ישראל: https://www.boi.org.il/he/economic-roles/markets/interest-rates/
 * - הלשכה המרכזית לסטטיסטיקה: https://www.cbs.gov.il/he/Statistics/
 * - ביטוח לאומי: https://www.btl.gov.il
 * - משרד האנרגיה: https://www.gov.il/he/departments/ministry_of_energy
 */

export const MACRO_DATA = {
  primeRate: {
    value: 4.75,             // % פריים: ריבית בנק ישראל 3.25% + 1.5%
    boiBaseRate: 3.25,
    bankSpread: 1.5,         // % מרווח בנקאי סטנדרטי (פריים = בסיס + 1.5%)
    lastUpdated: '2026-09-28',
    source: 'בנק ישראל',
    sourceUrl: 'https://www.boi.org.il/he/economic-roles/markets/interest-rates/interest-rates-of-bank-of-israel/',
    nextScheduledDecision: '2026-10-21',
    historicalRates: [
      // ערכי סוף חודש מאז אוגוסט 2025, עבור גרף היסטורי
      { month: '2025-08', boiRate: 4.5, primeRate: 6.0 },
      { month: '2025-09', boiRate: 4.5, primeRate: 6.0 },
      { month: '2025-10', boiRate: 4.5, primeRate: 6.0 },
      { month: '2025-11', boiRate: 4.25, primeRate: 5.75 },
      { month: '2025-12', boiRate: 4.25, primeRate: 5.75 },
      { month: '2026-01', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-02', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-03', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-04', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-05', boiRate: 3.75, primeRate: 5.25 }, // הורדה ראשונה 2026
      { month: '2026-06', boiRate: 3.75, primeRate: 5.25 },
      { month: '2026-07', boiRate: 3.5, primeRate: 5.0 },  // הורדה שנייה 6.7.2026
      { month: '2026-08', boiRate: 3.5, primeRate: 5.0 },
      { month: '2026-09', boiRate: 3.25, primeRate: 4.75 },
    ],
  },

  inflation: {
    annualRate: 1.5,         // % שינוי שנתי — בנק ישראל, 28.9.2026
    lastUpdated: '2026-09-28',
    source: 'בנק ישראל (השינוי השנתי לפי נתוני הלמ"ס)',
    sourceUrl: 'https://www.boi.org.il/',
  },

  averageWage: {
    monthly: 13_769,         // ₪ שכר ממוצע לפי סעיף 2 לחוק הביטוח הלאומי, 1.1.2026
    lastUpdated: '2026-09-28',
    reportPeriod: '2026, סעיף 2 לחוק הביטוח הלאומי',
    source: 'ביטוח לאומי',
    sourceUrl: 'https://www.btl.gov.il/Mediniyut/GeneralData/Pages/שכר ממוצע.aspx',
  },

  fuelPrices: {
    gasoline95: 7.75,        // ₪/ליטר - מחיר מרבי 95 בשירות עצמי מ-7.9.2026
    gasoline98: 7.85,        // ₪/ליטר - הנחת דוגמה בלבד, לא מחיר בפיקוח
    diesel: 6.95,            // ₪/ליטר - הנחת דוגמה בלבד, לא מחיר בפיקוח
    electric: 0.55,          // ₪/kWh - הנחת דוגמה בלבד
    lastUpdated: '2026-09-07',
    source: 'משרד האנרגיה והתשתיות',
    sourceUrl: 'https://www.gov.il/he/pages/fuel-september-7-2026',
  },
} as const;

/** Helper: פורמט תאריך עברי */
export function formatHebrewDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  const months = [
    '', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
  ];
  return `${parseInt(day)} ${months[parseInt(month)]} ${year}`;
}

/** Helper: ימים עד ההחלטה הבאה */
export function daysUntilNextDecision(): number {
  const next = new Date(MACRO_DATA.primeRate.nextScheduledDecision);
  const today = new Date();
  const diff = next.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
