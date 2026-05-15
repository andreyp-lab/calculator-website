/**
 * מחשבון מס שבח על מכירת דירה ורווחי הון - ישראל 2026
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
 * ניירות ערך (מס רווחי הון):
 * - 25% על רווח ריאלי
 * - הצמדה למדד לניירות שנרכשו לפני 2003
 *
 * מקור: רשות המסים - מיסוי מקרקעין, חוק מיסוי מקרקעין, סעיף 91 לפקודת מס הכנסה
 */

// ============================================================
// קבועים
// ============================================================

export const FIRST_HOME_EXEMPTION_CAP_2026 = 5_008_000;
export const STANDARD_TAX_RATE = 0.25;
export const HIGH_INCOME_SURTAX = 0.05; // מס יסף
export const LINEAR_CUTOFF_YEAR = 2014; // 1.1.2014

/**
 * מדד המחירים לצרכן (CPI) ממוצע שנתי - ישראל
 * בסיס: 2020 = 100
 * מקור: הלשכה המרכזית לסטטיסטיקה
 */
export const CPI_INDEX_BY_YEAR: Record<number, number> = {
  1990: 30.2,
  1991: 35.6,
  1992: 39.8,
  1993: 43.1,
  1994: 47.0,
  1995: 49.8,
  1996: 52.7,
  1997: 55.3,
  1998: 57.4,
  1999: 57.8,
  2000: 59.0,
  2001: 59.4,
  2002: 61.2,
  2003: 60.8,
  2004: 61.2,
  2005: 61.9,
  2006: 62.8,
  2007: 64.3,
  2008: 67.5,
  2009: 68.5,
  2010: 70.3,
  2011: 73.0,
  2012: 74.9,
  2013: 75.9,
  2014: 76.4,
  2015: 75.6,
  2016: 75.5,
  2017: 76.0,
  2018: 77.4,
  2019: 78.7,
  2020: 78.3,
  2021: 80.3,
  2022: 86.0,
  2023: 91.2,
  2024: 95.0,
  2025: 98.0,
  2026: 100.0,
};

/**
 * חישוב אינפלציה מצטברת בין שנה לשנה לפי מדד CPI
 * @returns אחוז עליית מדד (לדוג' 0.15 = 15%)
 */
export function getCumulativeInflation(purchaseYear: number, saleYear: number): number {
  const startCPI = CPI_INDEX_BY_YEAR[purchaseYear] ?? CPI_INDEX_BY_YEAR[1990];
  const endCPI = CPI_INDEX_BY_YEAR[saleYear] ?? CPI_INDEX_BY_YEAR[2026];
  return Math.max(0, (endCPI - startCPI) / startCPI);
}

// ============================================================
// טיפוסים
// ============================================================

export type CapitalGainsScenario = 'first-home' | 'investment' | 'inherited';

/** הוצאות מוכרות מפורטות */
export interface DetailedExpenses {
  /** שכ"ט עו"ד ברכישה (₪) */
  lawyerAtPurchase: number;
  /** שכ"ט עו"ד במכירה (₪) */
  lawyerAtSale: number;
  /** עמלת תיווך (₪) */
  realtorFee: number;
  /** מס רכישה ששולם (₪) */
  purchaseTaxPaid: number;
  /** הוצאות שיפוץ / השבחה (₪) */
  renovations: number;
  /** היטל השבחה ששולם (₪) */
  bettermentLevy: number;
  /** פרסום ושיווק (₪) */
  marketing: number;
  /** ריבית משכנתא (חלק יחסי מוכר) (₪) */
  mortgageInterest: number;
  /** הוצאות אחרות (₪) */
  other: number;
}

export function totalExpenses(exp: DetailedExpenses): number {
  return (
    exp.lawyerAtPurchase +
    exp.lawyerAtSale +
    exp.realtorFee +
    exp.purchaseTaxPaid +
    exp.renovations +
    exp.bettermentLevy +
    exp.marketing +
    exp.mortgageInterest +
    exp.other
  );
}

export const defaultDetailedExpenses: DetailedExpenses = {
  lawyerAtPurchase: 0,
  lawyerAtSale: 0,
  realtorFee: 0,
  purchaseTaxPaid: 0,
  renovations: 0,
  bettermentLevy: 0,
  marketing: 0,
  mortgageInterest: 0,
  other: 0,
};

// ============================================================
// קלט חישוב נדל"ן
// ============================================================

export interface CapitalGainsInput {
  /** שווי מכירה (₪) */
  salePrice: number;
  /** שווי רכישה מקורי (₪) */
  purchasePrice: number;
  /** הוצאות מוכרות (עו"ד, תיווך, שיפוצים, מס רכישה) - סה"כ */
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
  /** האם להשתמש במדד CPI אוטומטי לפי שנים */
  useAutoCPI?: boolean;
}

// ============================================================
// פלט חישוב נדל"ן
// ============================================================

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
  /** שנים לפני 2014 */
  yearsBefore2014: number;
  /** שנים אחרי 2014 */
  yearsAfter2014: number;
  /** סה"כ שנות אחזקה */
  totalYears: number;
  /** שיעור מס אפקטיבי מתוך כלל הרווח */
  effectiveTaxRate: number;
  /** הסבר */
  explanation: string;
}

// ============================================================
// חישוב מס שבח נדל"ן - הפונקציה הראשית
// ============================================================

export function calculateCapitalGainsTax(input: CapitalGainsInput): CapitalGainsResult {
  const sale = Math.max(0, input.salePrice);
  const purchase = Math.max(0, input.purchasePrice);
  const expenses = Math.max(0, input.recognizedExpenses);

  // שבח כולל = שווי מכירה - שווי רכישה - הוצאות
  const grossGain = sale - purchase - expenses;

  const totalYears = Math.max(0, input.saleYear - input.purchaseYear);
  const yearsAfter2014 = Math.max(0, input.saleYear - LINEAR_CUTOFF_YEAR);
  const yearsBefore2014 = Math.max(0, Math.min(totalYears, LINEAR_CUTOFF_YEAR - input.purchaseYear));

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
      yearsBefore2014,
      yearsAfter2014,
      totalYears,
      effectiveTaxRate: 0,
      explanation: 'אין שבח - שווי המכירה לא עולה על העלויות',
    };
  }

  // שבח אינפלציוני (פטור)
  const inflationPct = input.useAutoCPI
    ? getCumulativeInflation(input.purchaseYear, input.saleYear)
    : input.inflationCumulativePct / 100;
  const inflationGain = purchase * inflationPct;
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
      yearsBefore2014,
      yearsAfter2014,
      totalYears,
      effectiveTaxRate: 0,
      explanation: `פטור מלא ממס שבח לדירה יחידה (עד תקרת ${FIRST_HOME_EXEMPTION_CAP_2026.toLocaleString()} ₪)`,
    };
  }

  // 2. חישוב לינארי מוטב (דירות שנרכשו לפני 2014)
  let taxableGain = realGain;
  let taxablePct = 1;
  let appliedLinearMethod = false;

  if (input.purchaseYear < LINEAR_CUTOFF_YEAR) {
    appliedLinearMethod = true;
    if (totalYears > 0) {
      taxablePct = Math.max(0, yearsAfter2014 / totalYears);
    } else {
      taxablePct = 0;
    }
    taxableGain = realGain * taxablePct;
  }

  // 3. שיעור המס
  let taxRate = STANDARD_TAX_RATE;
  if (input.hasHighIncome) {
    taxRate += HIGH_INCOME_SURTAX;
  }

  const taxAmount = taxableGain * taxRate;
  const netToSeller = sale - taxAmount;
  const effectiveTaxRate = grossGain > 0 ? taxAmount / grossGain : 0;

  let explanation = `מס ${(taxRate * 100).toFixed(0)}% על שבח ריאלי של ${realGain.toLocaleString()} ₪`;
  if (appliedLinearMethod) {
    explanation = `חישוב לינארי מוטב: ${yearsBefore2014} שנים לפני 2014 (פטור) + ${yearsAfter2014} שנים אחרי 2014 (חייב) = ${(taxablePct * 100).toFixed(1)}% מהשבח חייב במס`;
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
    yearsBefore2014,
    yearsAfter2014,
    totalYears,
    effectiveTaxRate,
    explanation,
  };
}

// ============================================================
// חישוב לינארי מפורט - עמוד "מס לינארי"
// ============================================================

export interface LinearTaxInput {
  salePrice: number;
  purchasePrice: number;
  recognizedExpenses: number;
  purchaseYear: number;
  saleYear: number;
  hasHighIncome: boolean;
  useAutoCPI: boolean;
  inflationCumulativePct: number;
}

export interface LinearTaxResult {
  grossGain: number;
  inflationGain: number;
  realGain: number;
  totalYears: number;
  yearsBefore2014: number;
  yearsAfter2014: number;
  pctBefore2014: number;
  pctAfter2014: number;
  gainBefore2014: number; // פטור
  gainAfter2014: number; // חייב במס
  taxRate: number;
  taxAmount: number;
  netToSeller: number;
  effectiveTaxRate: number;
  /** לעומת מס מלא ללא לינארי */
  taxWithoutLinear: number;
  savingFromLinear: number;
  breakdown: Array<{
    period: string;
    years: number;
    pct: number;
    gain: number;
    taxable: boolean;
    tax: number;
  }>;
}

export function calculateLinearTax(input: LinearTaxInput): LinearTaxResult {
  const sale = Math.max(0, input.salePrice);
  const purchase = Math.max(0, input.purchasePrice);
  const expenses = Math.max(0, input.recognizedExpenses);
  const grossGain = Math.max(0, sale - purchase - expenses);

  const totalYears = Math.max(1, input.saleYear - input.purchaseYear);
  const yearsBefore2014 = Math.max(0, Math.min(totalYears, LINEAR_CUTOFF_YEAR - input.purchaseYear));
  const yearsAfter2014 = Math.max(0, Math.min(totalYears, input.saleYear - LINEAR_CUTOFF_YEAR));

  const inflationPct = input.useAutoCPI
    ? getCumulativeInflation(input.purchaseYear, input.saleYear)
    : input.inflationCumulativePct / 100;
  const inflationGain = purchase * inflationPct;
  const realGain = Math.max(0, grossGain - inflationGain);

  const pctBefore2014 = totalYears > 0 ? yearsBefore2014 / totalYears : 0;
  const pctAfter2014 = totalYears > 0 ? yearsAfter2014 / totalYears : 0;

  const gainBefore2014 = realGain * pctBefore2014;
  const gainAfter2014 = realGain * pctAfter2014;

  const taxRate = STANDARD_TAX_RATE + (input.hasHighIncome ? HIGH_INCOME_SURTAX : 0);
  const taxAmount = gainAfter2014 * taxRate;
  const netToSeller = sale - taxAmount;
  const effectiveTaxRate = grossGain > 0 ? taxAmount / grossGain : 0;
  const taxWithoutLinear = realGain * taxRate;
  const savingFromLinear = Math.max(0, taxWithoutLinear - taxAmount);

  const breakdown = [];
  if (yearsBefore2014 > 0) {
    breakdown.push({
      period: `${input.purchaseYear}–2013 (לפני רפורמה)`,
      years: yearsBefore2014,
      pct: pctBefore2014,
      gain: gainBefore2014,
      taxable: false,
      tax: 0,
    });
  }
  if (yearsAfter2014 > 0) {
    breakdown.push({
      period: `2014–${input.saleYear} (אחרי רפורמה)`,
      years: yearsAfter2014,
      pct: pctAfter2014,
      gain: gainAfter2014,
      taxable: true,
      tax: gainAfter2014 * taxRate,
    });
  }

  return {
    grossGain,
    inflationGain,
    realGain,
    totalYears,
    yearsBefore2014,
    yearsAfter2014,
    pctBefore2014,
    pctAfter2014,
    gainBefore2014,
    gainAfter2014,
    taxRate,
    taxAmount,
    netToSeller,
    effectiveTaxRate,
    taxWithoutLinear,
    savingFromLinear,
    breakdown,
  };
}

// ============================================================
// חישוב הצמדה למדד (אינדקסציה)
// ============================================================

export interface IndexLinkageResult {
  originalPrice: number;
  indexedPrice: number;
  inflationAmount: number;
  inflationPct: number;
  purchaseCPI: number;
  saleCPI: number;
}

export function applyIndexLinkage(
  originalPrice: number,
  purchaseYear: number,
  saleYear: number,
): IndexLinkageResult {
  const purchaseCPI = CPI_INDEX_BY_YEAR[purchaseYear] ?? CPI_INDEX_BY_YEAR[1990];
  const saleCPI = CPI_INDEX_BY_YEAR[saleYear] ?? CPI_INDEX_BY_YEAR[2026];
  const inflationPct = Math.max(0, (saleCPI - purchaseCPI) / purchaseCPI);
  const inflationAmount = originalPrice * inflationPct;
  const indexedPrice = originalPrice + inflationAmount;
  return {
    originalPrice,
    indexedPrice,
    inflationAmount,
    inflationPct,
    purchaseCPI,
    saleCPI,
  };
}

// ============================================================
// ניכוי הוצאות מוכרות
// ============================================================

export interface ExpenseDeductionResult {
  expenses: DetailedExpenses;
  totalExpenses: number;
  taxSavingFromExpenses: number; // 25% מהוצאות = חיסכון מס
}

export function applyExpenseDeductions(
  expenses: DetailedExpenses,
  taxRate: number = STANDARD_TAX_RATE,
): ExpenseDeductionResult {
  const total = totalExpenses(expenses);
  return {
    expenses,
    totalExpenses: total,
    taxSavingFromExpenses: total * taxRate,
  };
}

// ============================================================
// חישוב ירושה
// ============================================================

export interface InheritedPropertyInput {
  salePrice: number;
  /** שווי שנרכש ע"י הנפטר */
  deceasedPurchasePrice: number;
  recognizedExpenses: number;
  /** שנת רכישה ע"י הנפטר */
  deceasedPurchaseYear: number;
  saleYear: number;
  /** האם נורש מבן/בת זוג */
  inheritedFromSpouse: boolean;
  hasHighIncome: boolean;
  useAutoCPI: boolean;
  inflationCumulativePct: number;
}

export interface InheritedPropertyResult {
  grossGain: number;
  inflationGain: number;
  realGain: number;
  isExempt: boolean;
  appliedLinearMethod: boolean;
  taxablePct: number;
  taxableGain: number;
  taxRate: number;
  taxAmount: number;
  netToSeller: number;
  effectiveTaxRate: number;
  explanation: string;
}

export function calculateInheritedProperty(input: InheritedPropertyInput): InheritedPropertyResult {
  const sale = Math.max(0, input.salePrice);
  const purchase = Math.max(0, input.deceasedPurchasePrice);
  const expenses = Math.max(0, input.recognizedExpenses);
  const grossGain = Math.max(0, sale - purchase - expenses);

  // ירושה מבן/בת זוג - פטור בדרך כלל
  if (input.inheritedFromSpouse) {
    return {
      grossGain,
      inflationGain: 0,
      realGain: grossGain,
      isExempt: true,
      appliedLinearMethod: false,
      taxablePct: 0,
      taxableGain: 0,
      taxRate: 0,
      taxAmount: 0,
      netToSeller: sale,
      effectiveTaxRate: 0,
      explanation:
        'ירושה מבן/בת זוג: פטור ממס שבח בהתאם לסעיף 4(ב) לחוק מיסוי מקרקעין',
    };
  }

  if (grossGain <= 0) {
    return {
      grossGain: 0,
      inflationGain: 0,
      realGain: 0,
      isExempt: false,
      appliedLinearMethod: false,
      taxablePct: 0,
      taxableGain: 0,
      taxRate: 0,
      taxAmount: 0,
      netToSeller: sale,
      effectiveTaxRate: 0,
      explanation: 'אין שבח',
    };
  }

  const inflationPct = input.useAutoCPI
    ? getCumulativeInflation(input.deceasedPurchaseYear, input.saleYear)
    : input.inflationCumulativePct / 100;
  const inflationGain = purchase * inflationPct;
  const realGain = Math.max(0, grossGain - inflationGain);

  const totalYears = Math.max(1, input.saleYear - input.deceasedPurchaseYear);
  const yearsAfter2014 = Math.max(0, input.saleYear - LINEAR_CUTOFF_YEAR);

  let appliedLinearMethod = false;
  let taxablePct = 1;
  let taxableGain = realGain;

  if (input.deceasedPurchaseYear < LINEAR_CUTOFF_YEAR) {
    appliedLinearMethod = true;
    taxablePct = totalYears > 0 ? Math.max(0, yearsAfter2014 / totalYears) : 0;
    taxableGain = realGain * taxablePct;
  }

  const taxRate = STANDARD_TAX_RATE + (input.hasHighIncome ? HIGH_INCOME_SURTAX : 0);
  const taxAmount = taxableGain * taxRate;
  const netToSeller = sale - taxAmount;
  const effectiveTaxRate = grossGain > 0 ? taxAmount / grossGain : 0;

  let explanation = `ירושה מצד שלישי: מחושב על בסיס תאריך רכישת המוריש (${input.deceasedPurchaseYear}). מס ${(taxRate * 100).toFixed(0)}%`;
  if (appliedLinearMethod) {
    explanation += ` עם חישוב לינארי מוטב - ${(taxablePct * 100).toFixed(1)}% חייב במס`;
  }

  return {
    grossGain,
    inflationGain,
    realGain,
    isExempt: false,
    appliedLinearMethod,
    taxablePct,
    taxableGain,
    taxRate,
    taxAmount,
    netToSeller,
    effectiveTaxRate,
    explanation,
  };
}

// ============================================================
// מס רווחי הון - ניירות ערך (מניות / אגח)
// ============================================================

export type SecuritiesType = 'stocks' | 'bonds' | 'etf' | 'crypto' | 'options';

export interface SecuritiesGainInput {
  /** סכום השקעה מקורי (₪) */
  purchaseAmount: number;
  /** סכום מכירה (₪) */
  saleAmount: number;
  /** שנת רכישה */
  purchaseYear: number;
  /** שנת מכירה */
  saleYear: number;
  /** סוג נייר ערך */
  securitiesType: SecuritiesType;
  /** האם תושב ישראל */
  isResident: boolean;
  /** האם בעל הכנסות גבוהות (מס יסף) */
  hasHighIncome: boolean;
  /** האם מסחר יומי (דיי-טריידינג) */
  isDayTrading: boolean;
  /** האם חשבון פנסיוני / קרן השתלמות (פטור ממס) */
  isTaxSheltered: boolean;
  /** האם להפעיל הצמדה למדד (רלוונטי לפני 2003) */
  applyIndexation: boolean;
  /** דיבידנדים שהתקבלו (₪) */
  dividendsReceived: number;
  /** מס שנוכה במקור על דיבידנדים (₪) */
  dividendsTaxWithheld: number;
}

export interface SecuritiesGainResult {
  grossProfit: number;
  inflationAdjustment: number;
  realProfit: number;
  taxRate: number;
  taxOnCapitalGain: number;
  taxOnDividends: number;
  totalTax: number;
  netProfit: number;
  effectiveReturnPct: number;
  isDayTradingTreatedAsIncome: boolean;
  isTaxSheltered: boolean;
  explanation: string;
  breakdown: Array<{ label: string; amount: number; note?: string }>;
}

export function calculateSecuritiesGain(input: SecuritiesGainInput): SecuritiesGainResult {
  const purchase = Math.max(0, input.purchaseAmount);
  const sale = Math.max(0, input.saleAmount);
  const grossProfit = sale - purchase;
  const dividends = Math.max(0, input.dividendsReceived);
  const dividendsTaxWithheld = Math.max(0, input.dividendsTaxWithheld);

  // פטור לחשבון פנסיוני / קרן השתלמות
  if (input.isTaxSheltered) {
    return {
      grossProfit,
      inflationAdjustment: 0,
      realProfit: grossProfit,
      taxRate: 0,
      taxOnCapitalGain: 0,
      taxOnDividends: 0,
      totalTax: 0,
      netProfit: grossProfit + dividends,
      effectiveReturnPct: purchase > 0 ? (grossProfit + dividends) / purchase : 0,
      isDayTradingTreatedAsIncome: false,
      isTaxSheltered: true,
      explanation: 'חשבון פנסיוני / קרן השתלמות: פטור ממס רווחי הון',
      breakdown: [
        { label: 'רווח הון', amount: grossProfit },
        { label: 'דיבידנדים', amount: dividends },
        { label: 'מס', amount: 0, note: 'פטור - חשבון מוגן מס' },
      ],
    };
  }

  if (grossProfit <= 0 && dividends <= 0) {
    return {
      grossProfit,
      inflationAdjustment: 0,
      realProfit: grossProfit,
      taxRate: 0,
      taxOnCapitalGain: 0,
      taxOnDividends: 0,
      totalTax: 0,
      netProfit: grossProfit + dividends,
      effectiveReturnPct: purchase > 0 ? grossProfit / purchase : 0,
      isDayTradingTreatedAsIncome: false,
      isTaxSheltered: false,
      explanation: 'אין רווח - אין מס',
      breakdown: [{ label: 'הפסד הון', amount: grossProfit }],
    };
  }

  // הצמדה למדד (רלוונטי לניירות שנרכשו לפני 2003)
  let inflationAdjustment = 0;
  if (input.applyIndexation && input.purchaseYear < 2003 && grossProfit > 0) {
    const inflationPct = getCumulativeInflation(input.purchaseYear, input.saleYear);
    inflationAdjustment = purchase * inflationPct;
  }
  const realProfit = Math.max(0, grossProfit - inflationAdjustment);

  // שיעור מס: 25% רגיל, 30% עם מס יסף
  // דיי-טריידינג: מחויב כהכנסה רגילה (עד 50% + 17% ביטוח לאומי)
  const isDayTradingTreatedAsIncome = input.isDayTrading;
  let taxRate = STANDARD_TAX_RATE;
  if (input.hasHighIncome) taxRate += HIGH_INCOME_SURTAX;

  let taxOnCapitalGain = 0;
  if (realProfit > 0) {
    if (isDayTradingTreatedAsIncome) {
      // שיעור מס הכנסה ממוצע ~ 35% לסוחר יומי עם הכנסות גבוהות (+ ביטוח לאומי)
      taxOnCapitalGain = realProfit * 0.35;
    } else {
      taxOnCapitalGain = realProfit * taxRate;
    }
  }

  // מס על דיבידנדים: 25% (לתושב ישראל)
  const dividendTaxRate = input.hasHighIncome ? 0.30 : 0.25;
  const dividendsTaxDue = dividends * dividendTaxRate;
  const taxOnDividends = Math.max(0, dividendsTaxDue - dividendsTaxWithheld);

  const totalTax = taxOnCapitalGain + taxOnDividends;
  const netProfit = grossProfit + dividends - totalTax;
  const effectiveReturnPct = purchase > 0 ? netProfit / purchase : 0;

  let explanation = `מס רווחי הון: ${(taxRate * 100).toFixed(0)}% על רווח ריאלי של ₪${realProfit.toLocaleString()}`;
  if (isDayTradingTreatedAsIncome) {
    explanation = 'מסחר יומי: מחויב כהכנסה רגילה (~35%) + ביטוח לאומי';
  } else if (input.applyIndexation && inflationAdjustment > 0) {
    explanation += `. הצמדה למדד: ₪${Math.round(inflationAdjustment).toLocaleString()} הופחת`;
  }

  const breakdown: Array<{ label: string; amount: number; note?: string }> = [
    { label: 'רווח ברוטו', amount: grossProfit },
  ];
  if (inflationAdjustment > 0) {
    breakdown.push({ label: 'ניכוי הצמדה למדד', amount: -inflationAdjustment, note: 'רכישה לפני 2003' });
  }
  breakdown.push({ label: 'רווח ריאלי חייב', amount: realProfit });
  if (taxOnCapitalGain > 0) {
    breakdown.push({
      label: isDayTradingTreatedAsIncome ? 'מס הכנסה (דיי-טריידינג)' : `מס רווחי הון ${(taxRate * 100).toFixed(0)}%`,
      amount: -taxOnCapitalGain,
    });
  }
  if (dividends > 0) {
    breakdown.push({ label: 'דיבידנדים', amount: dividends });
    breakdown.push({ label: `מס דיבידנד ${(dividendTaxRate * 100).toFixed(0)}%`, amount: -taxOnDividends });
  }
  breakdown.push({ label: 'רווח נטו', amount: netProfit });

  return {
    grossProfit,
    inflationAdjustment,
    realProfit,
    taxRate,
    taxOnCapitalGain,
    taxOnDividends,
    totalTax,
    netProfit,
    effectiveReturnPct,
    isDayTradingTreatedAsIncome,
    isTaxSheltered: false,
    explanation,
    breakdown,
  };
}

// ============================================================
// פטור דירה יחידה - חישוב מפורט
// ============================================================

export interface FirstHomeExemptionInput {
  salePrice: number;
  purchasePrice: number;
  recognizedExpenses: number;
  purchaseYear: number;
  saleYear: number;
  isResident: boolean;
  usedExemptionRecently: boolean;
  ownershipMonths: number; // חודשי אחזקה
  hasHighIncome: boolean;
  useAutoCPI: boolean;
  inflationCumulativePct: number;
}

export interface FirstHomeExemptionResult {
  isEligible: boolean;
  ineligibilityReasons: string[];
  grossGain: number;
  inflationGain: number;
  realGain: number;
  taxIfNoExemption: number;
  savingFromExemption: number;
  netToSeller: number;
  explanation: string;
}

export function calculateFirstHomeExemption(input: FirstHomeExemptionInput): FirstHomeExemptionResult {
  const sale = Math.max(0, input.salePrice);
  const purchase = Math.max(0, input.purchasePrice);
  const expenses = Math.max(0, input.recognizedExpenses);
  const grossGain = Math.max(0, sale - purchase - expenses);

  const inflationPct = input.useAutoCPI
    ? getCumulativeInflation(input.purchaseYear, input.saleYear)
    : input.inflationCumulativePct / 100;
  const inflationGain = purchase * inflationPct;
  const realGain = Math.max(0, grossGain - inflationGain);

  const taxRate = STANDARD_TAX_RATE + (input.hasHighIncome ? HIGH_INCOME_SURTAX : 0);
  const taxIfNoExemption = realGain * taxRate;

  const ineligibilityReasons: string[] = [];

  if (!input.isResident) {
    ineligibilityReasons.push('לא תושב ישראל');
  }
  if (input.usedExemptionRecently) {
    ineligibilityReasons.push('נוצל פטור דירה יחידה ב-18 חודשים האחרונים');
  }
  if (sale > FIRST_HOME_EXEMPTION_CAP_2026) {
    ineligibilityReasons.push(
      `שווי מכירה (${sale.toLocaleString()} ₪) עולה על תקרת הפטור (${FIRST_HOME_EXEMPTION_CAP_2026.toLocaleString()} ₪)`,
    );
  }
  if (input.ownershipMonths < 18) {
    ineligibilityReasons.push(`אחזקה של ${input.ownershipMonths} חודשים בלבד (נדרש 18+)`);
  }

  const isEligible = ineligibilityReasons.length === 0;
  const savingFromExemption = isEligible ? taxIfNoExemption : 0;
  const netToSeller = isEligible ? sale : sale - taxIfNoExemption;

  let explanation = '';
  if (isEligible) {
    explanation = `זכאי לפטור מלא! חיסכון של ${savingFromExemption.toLocaleString()} ₪ מס שבח`;
  } else {
    explanation = `לא זכאי לפטור: ${ineligibilityReasons.join('; ')}`;
  }

  return {
    isEligible,
    ineligibilityReasons,
    grossGain,
    inflationGain,
    realGain,
    taxIfNoExemption,
    savingFromExemption,
    netToSeller,
    explanation,
  };
}
