/**
 * מחשבון מס שבח על מכירת דירה - ישראל 2026
 *
 * שיעורי 2026:
 * - מס שבח ריאלי: 25% (סטנדרטי)
 * - מס יסף נוסף 5% למקבלי הכנסות גבוהות (סה"כ 30%)
 *
 * פטור לדירה יחידה (תושב ישראל):
 * - תקרת פטור: 5,008,000 ₪ (2026)
 * - לא נוצל פטור דומה ב-18 חודשים אחרונים
 *
 * חישוב לינארי מוטב (לדירות שנרכשו לפני 1.1.2014):
 * - שבח לפני 2014 → פטור מלא
 * - שבח אחרי 2014 → 25%
 *
 * נוסחה:
 * שבח = שווי מכירה - שווי רכישה - הוצאות מוכרות - אינפלציה
 * מס = שבח ריאלי × 25% (או חישוב לינארי לדירות ישנות)
 *
 * מקור: רשות המסים - מיסוי מקרקעין, חוק מיסוי מקרקעין
 */

export type CapitalGainsScenario = 'first-home' | 'investment' | 'inherited';

export interface CapitalGainsInput {
  /** שווי מכירה (₪) */
  salePrice: number;
  /** שווי רכישה מקורי (₪) */
  purchasePrice: number;
  /** הוצאות מוכרות (עו"ד, תיווך, שיפוצים, מס רכישה) */
  recognizedExpenses: number;
  /** שנת רכישה */
  purchaseYear: number;
  /** שנת מכירה */
  saleYear: number;
  /** סוג העסקה */
  scenario: CapitalGainsScenario;
  /** האם תושב ישראל */
  isResident: boolean;
  /** האם השתמש בפטור דירה יחידה ב-18 חודש האחרונים */
  usedExemptionRecently: boolean;
  /** האם בעל הכנסות גבוהות (חייב במס יסף) */
  hasHighIncome: boolean;
  /** מדד אינפלציה מצטבר באחוזים מהרכישה ועד המכירה (משוער) */
  inflationCumulativePct: number;
}

export interface CapitalGainsResult {
  /** שבח כולל (לפני התאמה) */
  grossGain: number;
  /** שבח אינפלציוני (פטור) */
  inflationGain: number;
  /** שבח ריאלי (חייב במס) */
  realGain: number;
  /** האם זכאי לפטור מלא לדירה יחידה */
  fullExemption: boolean;
  /** חישוב לינארי מוטב? (דירה לפני 2014) */
  appliedLinearMethod: boolean;
  /** אחוז שבח חייב במס (אם לינארי) */
  taxablePct: number;
  /** שבח חייב במס (לאחר חישוב לינארי) */
  taxableGain: number;
  /** שיעור המס שיוטל */
  taxRate: number;
  /** סכום המס לתשלום */
  taxAmount: number;
  /** הכנסה נטו למוכר */
  netToSeller: number;
  /** הסבר */
  explanation: string;
}

const FIRST_HOME_EXEMPTION_CAP_2026 = 5_008_000;
const STANDARD_TAX_RATE = 0.25;
const HIGH_INCOME_SURTAX = 0.05; // מס יסף

export function calculateCapitalGainsTax(input: CapitalGainsInput): CapitalGainsResult {
  const sale = Math.max(0, input.salePrice);
  const purchase = Math.max(0, input.purchasePrice);
  const expenses = Math.max(0, input.recognizedExpenses);

  // שבח כולל = שווי מכירה - שווי רכישה - הוצאות
  const grossGain = sale - purchase - expenses;

  if (grossGain <= 0) {
    return {
      grossGain: 0,
      inflationGain: 0,
      realGain: 0,
      fullExemption: false,
      appliedLinearMethod: false,
      taxablePct: 0,
      taxableGain: 0,
      taxRate: 0,
      taxAmount: 0,
      netToSeller: sale,
      explanation: 'אין שבח - שווי המכירה לא עולה על העלויות',
    };
  }

  // שבח אינפלציוני (פטור)
  const inflationGain = purchase * (input.inflationCumulativePct / 100);
  const realGain = Math.max(0, grossGain - inflationGain);

  // 1. בדיקת פטור דירה יחידה
  if (
    input.scenario === 'first-home' &&
    input.isResident &&
    !input.usedExemptionRecently &&
    sale <= FIRST_HOME_EXEMPTION_CAP_2026
  ) {
    return {
      grossGain,
      inflationGain,
      realGain,
      fullExemption: true,
      appliedLinearMethod: false,
      taxablePct: 0,
      taxableGain: 0,
      taxRate: 0,
      taxAmount: 0,
      netToSeller: sale,
      explanation: `פטור מלא ממס שבח לדירה יחידה (עד תקרת ${FIRST_HOME_EXEMPTION_CAP_2026.toLocaleString()} ₪)`,
    };
  }

  // 2. חישוב לינארי מוטב (דירות שנרכשו לפני 2014)
  let taxableGain = realGain;
  let taxablePct = 1;
  let appliedLinearMethod = false;

  if (input.purchaseYear < 2014) {
    appliedLinearMethod = true;
    const totalYears = input.saleYear - input.purchaseYear;
    const yearsAfter2014 = input.saleYear - 2014;
    taxablePct = Math.max(0, yearsAfter2014 / totalYears);
    taxableGain = realGain * taxablePct;
  }

  // 3. שיעור המס
  let taxRate = STANDARD_TAX_RATE;
  if (input.hasHighIncome) {
    taxRate += HIGH_INCOME_SURTAX;
  }

  const taxAmount = taxableGain * taxRate;
  const netToSeller = sale - taxAmount;

  let explanation = `מס ${(taxRate * 100).toFixed(0)}% על שבח ריאלי של ${realGain.toLocaleString()} ₪`;
  if (appliedLinearMethod) {
    explanation = `חישוב לינארי מוטב - רק ${(taxablePct * 100).toFixed(1)}% מהשבח חייב במס (יתר השבח לפני 2014 = פטור)`;
  }

  return {
    grossGain,
    inflationGain,
    realGain,
    fullExemption: false,
    appliedLinearMethod,
    taxablePct,
    taxableGain,
    taxRate,
    taxAmount,
    netToSeller,
    explanation,
  };
}
