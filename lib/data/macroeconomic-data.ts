/**
 * נתוני מקרו עדכניים - FinCalc
 *
 * עדכון אוטומטי דרך ISR (revalidate כל 6 שעות).
 * עדכון ידני: שינוי ערכים כאן + push → אתר מתעדכן אוטומטית.
 *
 * תאריך עדכון אחרון: 2026-05-21
 *
 * מקורות:
 * - בנק ישראל: https://www.boi.org.il/he/economic-roles/markets/interest-rates/
 * - הלשכה המרכזית לסטטיסטיקה: https://www.cbs.gov.il/he/Statistics/
 * - ביטוח לאומי: https://www.btl.gov.il
 * - משרד האנרגיה: https://www.gov.il/he/departments/ministry_of_energy
 */

export const MACRO_DATA = {
  primeRate: {
    value: 5.5,              // % ריבית פריים נוכחית
    boiBaseRate: 4.0,        // % ריבית בנק ישראל (ריבית בסיס)
    bankSpread: 1.5,         // % מרווח בנקאי סטנדרטי (פריים = בסיס + 1.5%)
    lastUpdated: '2026-05-21',
    source: 'בנק ישראל',
    sourceUrl: 'https://www.boi.org.il/he/economic-roles/markets/interest-rates/interest-rates-of-bank-of-israel/',
    nextScheduledDecision: '2026-07-08', // לוח החלטות בנק ישראל
    historicalRates: [
      // 12 חודשים אחרונים - עבור גרף היסטורי
      { month: '2025-06', boiRate: 4.5, primeRate: 6.0 },
      { month: '2025-07', boiRate: 4.5, primeRate: 6.0 },
      { month: '2025-08', boiRate: 4.25, primeRate: 5.75 },
      { month: '2025-09', boiRate: 4.25, primeRate: 5.75 },
      { month: '2025-10', boiRate: 4.25, primeRate: 5.75 },
      { month: '2025-11', boiRate: 4.0, primeRate: 5.5 },
      { month: '2025-12', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-01', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-02', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-03', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-04', boiRate: 4.0, primeRate: 5.5 },
      { month: '2026-05', boiRate: 4.0, primeRate: 5.5 },
    ],
  },

  inflation: {
    annualRate: 2.8,         // % שינוי שנתי ב-12 חודשים אחרונים
    monthlyRate: 0.2,        // % שינוי חודשי אחרון
    cpiIndex: 105.3,         // מדד המחירים לצרכן (בסיס 2022=100)
    lastUpdated: '2026-05-15',
    source: 'הלשכה המרכזית לסטטיסטיקה (למס)',
    sourceUrl: 'https://www.cbs.gov.il/he/Statistics/Pages/generators/notify1.aspx?Type=1',
    historicalRates: [
      { month: '2025-06', annualRate: 3.5, monthlyRate: 0.4 },
      { month: '2025-07', annualRate: 3.2, monthlyRate: 0.3 },
      { month: '2025-08', annualRate: 3.0, monthlyRate: 0.2 },
      { month: '2025-09', annualRate: 3.1, monthlyRate: 0.3 },
      { month: '2025-10', annualRate: 2.9, monthlyRate: 0.1 },
      { month: '2025-11', annualRate: 2.8, monthlyRate: 0.0 },
      { month: '2025-12', annualRate: 3.0, monthlyRate: 0.3 },
      { month: '2026-01', annualRate: 2.9, monthlyRate: 0.1 },
      { month: '2026-02', annualRate: 2.7, monthlyRate: -0.1 },
      { month: '2026-03', annualRate: 2.6, monthlyRate: 0.2 },
      { month: '2026-04', annualRate: 2.7, monthlyRate: 0.3 },
      { month: '2026-05', annualRate: 2.8, monthlyRate: 0.2 },
    ],
  },

  averageWage: {
    monthly: 13_200,         // ₪ שכר ממוצע חודשי (ברוטו)
    quarterly: 13_200,       // ₪ (אותו ערך - לרבעון אחרון)
    lastUpdated: '2026-04-01',
    reportPeriod: 'Q1 2026', // הרבעון שמדווח
    source: 'הלשכה המרכזית לסטטיסטיקה / ביטוח לאומי',
    sourceUrl: 'https://www.btl.gov.il/Publications/actuarial_pub/Pages/sk2026.aspx',
    historicalWages: [
      { quarter: 'Q1 2025', wage: 12_650 },
      { quarter: 'Q2 2025', wage: 12_780 },
      { quarter: 'Q3 2025', wage: 12_900 },
      { quarter: 'Q4 2025', wage: 13_050 },
      { quarter: 'Q1 2026', wage: 13_200 },
    ],
  },

  fuelPrices: {
    gasoline95: 7.45,        // ₪/ליטר - בנזין 95 אוקטן
    gasoline98: 7.85,        // ₪/ליטר - בנזין 98 אוקטן
    diesel: 6.95,            // ₪/ליטר - סולר
    electric: 0.55,          // ₪/kWh - עלות טעינה ביתית (תעריף משק)
    lastUpdated: '2026-05-01',
    source: 'משרד האנרגיה והתשתיות',
    sourceUrl: 'https://www.gov.il/he/departments/ministry_of_energy',
  },

  ironSwordsBonuses: {
    generalGrant: 5_000,     // ₪ מענק כללי (חד-פעמי)
    dailyGrant: 280,         // ₪/יום מענק יומי (לגיוסים)
    returnToWorkGrant: 5_000,// ₪ מענק חזרה לעבודה
    lastUpdated: '2026-05-21',
    status: 'active' as 'active' | 'suspended' | 'updated',
    source: 'ביטוח לאומי',
    sourceUrl: 'https://www.btl.gov.il/Benefits/OperationIronSwords/Pages/default.aspx',
    notes: 'הזכאות מותנית בתקופת הגיוס ובמעמד המבוטח',
  },

  avgMortgageRate: {
    value: 4.8,              // % ריבית משכנתא ממוצעת (מסלולים מעורבים)
    lastUpdated: '2026-05-21',
    source: 'בנק ישראל — דוח ריביות משכנתא',
    sourceUrl: 'https://www.boi.org.il/information/interestrates/mortgage/',
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
