/**
 * מחשבון שווי עסק (Business Valuation)
 *
 * 3 שיטות הערכת שווי:
 *
 * 1. EBITDA Multiple (מקובל ב-M&A)
 *    שווי = EBITDA × מכפיל ענפי
 *    מכפילים טיפוסיים בישראל 2026:
 *    - שירותים מקצועיים: 3-5x
 *    - מסחר: 2-4x
 *    - תעשייה: 4-6x
 *    - היי-טק SaaS: 6-12x (לפי ARR)
 *    - תיירות/מסעדנות: 2-3x
 *
 * 2. DCF - Discounted Cash Flow
 *    שווי = סכום של [תזרים שנתי / (1+r)^n] לתקופה + Terminal Value
 *
 * 3. Revenue Multiple
 *    שווי = הכנסות שנתיות × מכפיל הכנסות (מקובל בעיקר ב-SaaS)
 */

export type IndustryType =
  | 'services'
  | 'trade'
  | 'manufacturing'
  | 'tech-saas'
  | 'tech-product'
  | 'restaurant'
  | 'real-estate'
  | 'other';

export interface BusinessValuationInput {
  annualRevenue: number;
  ebitda: number; // רווח לפני מס, ריבית, פחת
  netProfit: number;
  industry: IndustryType;
  /** קצב צמיחה שנתי צפוי באחוזים */
  growthRate: number;
  /** תקופת תחזית בשנים (לרוב 5) */
  yearsToProject: number;
  /** שיעור היוון (Discount Rate / WACC) באחוזים */
  discountRate: number;
  /** מכפיל EBITDA (אופציונלי - אם לא מסופק, ייקבע לפי ענף) */
  customMultiple?: number;
}

export interface BusinessValuationResult {
  /** שווי לפי DCF */
  dcfValue: number;
  /** שווי לפי מכפיל EBITDA */
  ebitdaMultipleValue: number;
  /** שווי לפי מכפיל הכנסות */
  revenueMultipleValue: number;
  /** ממוצע משוקלל */
  averageValue: number;
  /** טווח שווי */
  range: { low: number; high: number };
  /** מכפיל בשימוש */
  appliedMultiple: number;
  /** Terminal Value (שווי בסוף התחזית) */
  terminalValue: number;
  /** הסבר על דירוג */
  valuationLabel: string;
}

const INDUSTRY_MULTIPLES: Record<IndustryType, { ebitda: number; revenue: number; label: string }> =
  {
    services: { ebitda: 4, revenue: 1, label: 'שירותים מקצועיים' },
    trade: { ebitda: 3, revenue: 0.5, label: 'מסחר' },
    manufacturing: { ebitda: 5, revenue: 1.2, label: 'תעשייה וייצור' },
    'tech-saas': { ebitda: 8, revenue: 4, label: 'היי-טק / SaaS' },
    'tech-product': { ebitda: 6, revenue: 2, label: 'היי-טק מוצרים' },
    restaurant: { ebitda: 2.5, revenue: 0.7, label: 'מסעדנות / תיירות' },
    'real-estate': { ebitda: 6, revenue: 3, label: 'נדל"ן / השכרה' },
    other: { ebitda: 4, revenue: 1, label: 'אחר' },
  };

export function calculateBusinessValuation(
  input: BusinessValuationInput,
): BusinessValuationResult {
  const revenue = Math.max(0, input.annualRevenue);
  const ebitda = Math.max(0, input.ebitda);
  const netProfit = Math.max(0, input.netProfit);
  const growth = input.growthRate / 100;
  const discount = Math.max(0.05, input.discountRate / 100);
  const years = Math.max(1, Math.min(10, input.yearsToProject));
  const industry = INDUSTRY_MULTIPLES[input.industry];

  // 1. EBITDA Multiple
  const appliedMultiple = input.customMultiple ?? industry.ebitda;
  const ebitdaMultipleValue = ebitda * appliedMultiple;

  // 2. Revenue Multiple
  const revenueMultipleValue = revenue * industry.revenue;

  // 3. DCF
  // מניחים שתזרים מזומנים פנוי (FCF) = רווח נקי × 0.85 (קירוב)
  // מהוונים את 5 שנים של FCF צומח + Terminal Value
  const fcfBase = netProfit * 0.85;
  let dcfSum = 0;
  let lastFcf = fcfBase;
  for (let n = 1; n <= years; n++) {
    lastFcf = fcfBase * Math.pow(1 + growth, n);
    dcfSum += lastFcf / Math.pow(1 + discount, n);
  }
  // Terminal Value: Gordon Growth Model
  // TV = FCF_(n+1) / (r - g)  (אם g < r)
  const terminalGrowth = Math.min(growth, 0.03); // מוגבל ל-3% לטווח הארוך
  const terminalFcf = lastFcf * (1 + terminalGrowth);
  const terminalValue =
    discount > terminalGrowth
      ? terminalFcf / (discount - terminalGrowth) / Math.pow(1 + discount, years)
      : 0;
  const dcfValue = dcfSum + terminalValue;

  // ממוצע משוקלל - DCF: 40%, EBITDA: 40%, Revenue: 20%
  const averageValue =
    dcfValue * 0.4 + ebitdaMultipleValue * 0.4 + revenueMultipleValue * 0.2;

  // טווח: ±20%
  const range = {
    low: averageValue * 0.8,
    high: averageValue * 1.2,
  };

  // תווית הערכה
  let valuationLabel = 'הערכה כללית';
  if (averageValue > 50_000_000) valuationLabel = 'עסק גדול - מומלץ הערכה מקצועית';
  else if (averageValue > 10_000_000) valuationLabel = 'עסק בינוני';
  else if (averageValue > 1_000_000) valuationLabel = 'עסק קטן';
  else valuationLabel = 'עסק בהקמה / מיקרו';

  return {
    dcfValue,
    ebitdaMultipleValue,
    revenueMultipleValue,
    averageValue,
    range,
    appliedMultiple,
    terminalValue,
    valuationLabel,
  };
}

export function getIndustryLabel(industry: IndustryType): string {
  return INDUSTRY_MULTIPLES[industry].label;
}

export const INDUSTRIES_LIST = Object.entries(INDUSTRY_MULTIPLES).map(([key, val]) => ({
  key: key as IndustryType,
  ...val,
}));
