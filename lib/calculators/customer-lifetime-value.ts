/**
 * Customer Lifetime Value (CLV) - שווי לקוח לטווח ארוך
 *
 * המדד המרכזי בכל עסק שירותים/SaaS/Subscription/Retail.
 *
 * נוסחה בסיסית:
 *   CLV = (ARPU × Margin × Lifespan) - CAC
 *   או: CLV = (ARPU × Margin) / Churn_Rate - CAC
 *
 * מטריקות מפתח:
 * - ARPU (Average Revenue Per User) = ARR / לקוחות
 * - LTV/CAC ratio - "הזהב": 3+ = בריא, 1 = מפסיד
 * - Payback period - כמה חודשים עד שהלקוח מחזיר את עלות הגיוס
 * - Churn Rate - אחוז עזיבה חודשי/שנתי
 *
 * Benchmarks תעשייתיים (LTV/CAC):
 * - SaaS B2B: 3-5x = בריא, 5+x = מצוין
 * - E-commerce: 2-3x
 * - Mobile apps: 2-4x
 * - שירותים מקצועיים: 4-10x
 */

export interface CLVInput {
  /** ערך הזמנה ממוצעת (₪) */
  averageOrderValue: number;
  /** רכישות בשנה ממוצעת ללקוח */
  purchasesPerYear: number;
  /** אורך חיים ממוצע של לקוח (שנים) */
  customerLifespanYears: number;
  /** שיעור רווח גולמי באחוזים */
  grossMargin: number;
  /** עלות גיוס לקוח (CAC) - ₪ */
  customerAcquisitionCost: number;
  /** Churn Rate חודשי באחוזים (אופציונלי - אם מסופק, מחליף lifespan) */
  monthlyChurnRate?: number;
}

export interface CLVResult {
  /** הכנסה כוללת לאורך חיי הלקוח */
  totalRevenuePerCustomer: number;
  /** רווח גולמי כולל ללקוח */
  grossProfitPerCustomer: number;
  /** CLV נקי (אחרי CAC) */
  clv: number;
  /** יחס LTV/CAC */
  ltvCacRatio: number;
  /** תקופת החזר השקעה (חודשים) */
  paybackMonths: number;
  /** ARPU - הכנסה ממוצעת ללקוח/חודש */
  monthlyArpu: number;
  /** דירוג בריאות העסק */
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  /** הסבר על הדירוג */
  ratingLabel: string;
  /** המלצה */
  recommendation: string;
  /** Churn שמתורגם ל-Lifespan */
  effectiveLifespan: number;
}

export function calculateCLV(input: CLVInput): CLVResult {
  const aov = Math.max(0, input.averageOrderValue);
  const purchasesPerYear = Math.max(0, input.purchasesPerYear);
  const margin = Math.max(0, Math.min(100, input.grossMargin)) / 100;
  const cac = Math.max(0, input.customerAcquisitionCost);

  // אם churn מסופק, חישוב lifespan ממנו (1 / monthly_churn)
  let lifespan: number;
  if (input.monthlyChurnRate !== undefined && input.monthlyChurnRate > 0) {
    const monthlyChurn = input.monthlyChurnRate / 100;
    lifespan = 1 / monthlyChurn / 12; // חודשים → שנים
  } else {
    lifespan = Math.max(0.1, input.customerLifespanYears);
  }

  const annualRevenue = aov * purchasesPerYear;
  const totalRevenue = annualRevenue * lifespan;
  const grossProfit = totalRevenue * margin;
  const clv = grossProfit - cac;

  const ltvCacRatio = cac > 0 ? grossProfit / cac : 0;
  const monthlyGrossProfit = (annualRevenue * margin) / 12;
  const paybackMonths = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : Infinity;
  const monthlyArpu = annualRevenue / 12;

  // דירוג
  let rating: CLVResult['rating'] = 'poor';
  let ratingLabel = '';
  let recommendation = '';

  if (ltvCacRatio >= 5) {
    rating = 'excellent';
    ratingLabel = 'מצוין - יחס LTV/CAC של 5+ הוא יוצא דופן';
    recommendation = 'אפשר להגדיל את תקציב השיווק בבטחה - כל ₪ מושקע מחזיר 5+ ₪';
  } else if (ltvCacRatio >= 3) {
    rating = 'good';
    ratingLabel = 'טוב - יחס בריא לעסק יציב';
    recommendation = 'יחס תקין, אפשר לשקול הגדלת רכישת לקוחות';
  } else if (ltvCacRatio >= 1) {
    rating = 'fair';
    ratingLabel = 'בינוני - העסק רווחי אך לא יעיל';
    recommendation = 'יש לעבוד על הגדלת LTV (Upsell, Retention) או הקטנת CAC';
  } else {
    rating = 'poor';
    ratingLabel = 'מפסיד - עלות הגיוס גבוהה מהרווח מהלקוח';
    recommendation = 'דחוף לבחון מחדש את מודל העסק - אתה מפסיד על כל לקוח';
  }

  return {
    totalRevenuePerCustomer: totalRevenue,
    grossProfitPerCustomer: grossProfit,
    clv,
    ltvCacRatio,
    paybackMonths,
    monthlyArpu,
    rating,
    ratingLabel,
    recommendation,
    effectiveLifespan: lifespan,
  };
}
