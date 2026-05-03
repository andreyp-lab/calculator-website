/**
 * מחשבון תמחור שעת עבודה - לפרילנסר/יועץ/עצמאי
 *
 * הנוסחה הבסיסית:
 * תעריף שעתי = (שכר חודשי רצוי + הוצאות חודשיות) / שעות לחיוב × (1 + רווח%)
 *
 * הסבר על המושגים:
 * - שעות עבודה: סך השעות שאתה זמין לעבוד בחודש (כולל ניהול עסק, מכירות, לימוד)
 * - שעות לחיוב (Billable Hours): רק שעות שאפשר לחייב לקוחות עליהן
 *   בפועל, אצל פרילנסרים זה בד"כ 60-75% משעות העבודה
 * - הוצאות חודשיות: שכ"ד משרד, ביטוחים, תוכנות, תקשורת, רואה חשבון וכו'
 * - מרווח רווח: רזרבה לתקופות חלשות, חופשה, מחלה, השקעה בעצמך
 *
 * ערכי ברירת מחדל מבוססי נתוני שוק 2026:
 * - שכר חודשי רצוי: 15,000 ₪ (מקביל לשכר מקצועי בינוני)
 * - שעות עבודה: 160 (משרה מלאה)
 * - שעות לחיוב: 120 (75%)
 * - הוצאות: 5,000 ₪
 * - רווח: 25%
 */

export interface HourlyRateInput {
  /** שכר חודשי רצוי (נטו או ברוטו, החישוב הוא לעלות מינימלית) */
  monthlySalary: number;
  /** סך שעות העבודה החודשיות (כולל פעילות לא נחיבת) */
  workingHours: number;
  /** סך שעות שניתן לחייב עליהן לקוחות */
  billableHours: number;
  /** הוצאות חודשיות קבועות של העסק */
  monthlyOverhead: number;
  /** מרווח רווח באחוזים */
  profitMargin: number;
  /** האם להוסיף מע"מ (ברירת מחדל: false) */
  addVat?: boolean;
  /** שיעור מע"מ (ברירת מחדל: 18%) */
  vatRate?: number;
}

export interface HourlyRateResult {
  /** עלות בסיס לשעה (לפני רווח) */
  baseCostPerHour: number;
  /** מרווח הרווח בשקלים לשעה */
  profitPerHour: number;
  /** תעריף שעתי מומלץ ללא מע"מ */
  hourlyRate: number;
  /** תעריף שעתי כולל מע"מ */
  hourlyRateWithVat: number;
  /** תעריף יומי משוער (8 שעות) */
  dailyRate: number;
  /** הכנסה חודשית מקסימלית (אם כל שעות החיוב מנוצלות) */
  monthlyRevenue: number;
  /** רווח חודשי משוער */
  monthlyProfit: number;
  /** אחוז שעות לחיוב מתוך שעות העבודה */
  utilizationRate: number;
  /** האם הקלט תקין */
  isValid: boolean;
  /** הודעת אזהרה אם הקלט בעייתי */
  warning?: string;
}

export function calculateHourlyRate(input: HourlyRateInput): HourlyRateResult {
  const monthlySalary = Math.max(0, input.monthlySalary);
  const workingHours = Math.max(0, input.workingHours);
  const billableHours = Math.max(0, input.billableHours);
  const monthlyOverhead = Math.max(0, input.monthlyOverhead);
  const profitMargin = Math.max(0, input.profitMargin);
  const vatRate = input.vatRate ?? 0.18;

  // ולידציה
  let warning: string | undefined;
  let isValid = true;

  if (billableHours <= 0) {
    return {
      baseCostPerHour: 0,
      profitPerHour: 0,
      hourlyRate: 0,
      hourlyRateWithVat: 0,
      dailyRate: 0,
      monthlyRevenue: 0,
      monthlyProfit: 0,
      utilizationRate: 0,
      isValid: false,
      warning: 'יש להזין מספר חיובי של שעות לחיוב',
    };
  }

  if (billableHours > workingHours) {
    warning = 'שעות לחיוב לא יכולות להיות גבוהות יותר משעות העבודה הכוללות';
    isValid = false;
  }

  // עלות בסיס לשעה (כיסוי שכר + הוצאות)
  const baseCostPerHour = (monthlySalary + monthlyOverhead) / billableHours;

  // הוספת מרווח רווח
  const profitMultiplier = 1 + profitMargin / 100;
  const hourlyRate = baseCostPerHour * profitMultiplier;
  const profitPerHour = hourlyRate - baseCostPerHour;

  // תעריף עם מע"מ
  const hourlyRateWithVat = hourlyRate * (1 + vatRate);

  // תעריפים נגזרים
  const dailyRate = hourlyRate * 8;
  const monthlyRevenue = hourlyRate * billableHours;
  const monthlyProfit = monthlyRevenue - monthlySalary - monthlyOverhead;

  // אחוז ניצול
  const utilizationRate = workingHours > 0 ? (billableHours / workingHours) * 100 : 0;

  return {
    baseCostPerHour,
    profitPerHour,
    hourlyRate,
    hourlyRateWithVat,
    dailyRate,
    monthlyRevenue,
    monthlyProfit,
    utilizationRate,
    isValid,
    warning,
  };
}

/**
 * המלצות תמחור לפי תחום (₪/שעה ב-2026, נתוני שוק כלליים)
 * נתונים אלה הם הערכה כללית בלבד ואינם תחליף לבדיקה ספציפית
 */
export const INDUSTRY_BENCHMARKS_2026 = {
  juniorDeveloper: { min: 150, max: 250, label: 'מפתח תוכנה ג\'וניור' },
  midDeveloper: { min: 250, max: 400, label: 'מפתח תוכנה מתקדם' },
  seniorDeveloper: { min: 400, max: 700, label: 'מפתח תוכנה סניור' },
  designer: { min: 200, max: 400, label: 'מעצב גרפי / UI/UX' },
  marketingConsultant: { min: 300, max: 600, label: 'יועץ שיווק' },
  accountant: { min: 250, max: 500, label: 'רואה חשבון' },
  lawyer: { min: 400, max: 1200, label: 'עורך דין' },
  managementConsultant: { min: 500, max: 1500, label: 'יועץ ניהולי' },
  copywriter: { min: 150, max: 350, label: 'קופירייטר' },
  translator: { min: 100, max: 250, label: 'מתרגם' },
} as const;
