/**
 * סימולטור הערכת מס לסוף שנת המס - עוסק פטור / עוסק מורשה
 *
 * מבוסס על קובץ Google Sheets:
 * "סימולטור לסוף שנת מס" - מקבץ של:
 *   - תחזית הכנסות חודשית (12 חודשים)
 *   - הוצאות מוכרות (מלאות / חלקיות)
 *   - הפקדה לפנסיה + קרן השתלמות (ניכוי + זיכוי)
 *   - ביטוח לאומי + דמי בריאות
 *   - חישוב מס הכנסה לפי מדרגות
 *   - השוואת מקדמות ב.ל. ששולמו בפועל
 *
 * שימוש:
 *   const result = simulateYearEndTax({
 *     businessType: 'authorized',
 *     monthlyRevenue: [1000, 1000, 1000, ...],
 *     recognizedExpenses: 200,
 *     monthlyPensionDeposit: 62,
 *     monthlyStudyFundDeposit: 62,
 *     creditPoints: 2.25,
 *     bituachLeumiAdvancesPaid: 200,
 *     donations: 0,
 *   });
 *
 * שיעורי ניכוי / זיכוי לפנסיה לעצמאי 2026:
 *   - תקרת הכנסה מזכה: 232,800 ₪/שנה
 *   - תקרת ניכוי: 11% (עד 25,608 ₪)
 *   - תקרת זיכוי: 5.5% (עד 12,804 ₪) - שיעור הזיכוי 35%
 *
 * שיעורי ניכוי לקרן השתלמות לעצמאי:
 *   - תקרת הכנסה קובעת: 293,397 ₪/שנה
 *   - שיעור ניכוי: 4.5% (עד 13,203 ₪)
 *
 * ביטוח לאומי לעצמאי - חלק ניכוי הכרה כהוצאה: 52%
 *
 * מקור: רשות המסים, ביטוח לאומי, כל-זכות
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
  VAT_2026,
} from '@/lib/constants/tax-2026';

export type BusinessType = 'exempt' | 'authorized'; // עוסק פטור / עוסק מורשה
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface YearEndTaxInput {
  /** סוג העסק */
  businessType: BusinessType;
  /** רבעון נוכחי (לצורך השוואת מקדמות) */
  currentQuarter: Quarter;
  /** הכנסות חודשיות (ללא מע"מ) - 12 חודשים */
  monthlyRevenue: number[];
  /** סה"כ הוצאות מוכרות שנתי (בש"ח) - לאחר התאמת אחוז הכרה */
  recognizedExpenses: number;
  /** הפקדה חודשית לפנסיה (ש"ח) */
  monthlyPensionDeposit: number;
  /** הפקדה חודשית לקרן השתלמות (ש"ח) */
  monthlyStudyFundDeposit: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** תרומות שנתיות לעמותות מוכרות (זיכוי 35%) */
  donations?: number;
  /** מקדמות ביטוח לאומי ששולמו בפועל עד מועד החישוב */
  bituachLeumiAdvancesPaid: number;
  /** מקדמות מס הכנסה ששולמו בפועל עד מועד החישוב */
  incomeTaxAdvancesPaid: number;
}

export interface YearEndTaxResult {
  /** חזיה שנתית של מחזור (ללא מע"מ) */
  annualRevenue: number;
  /** סה"כ הכנסה כולל מע"מ (לעוסק מורשה) */
  annualRevenueIncludingVat: number;
  /** מע"מ עסקאות שנתי משוער */
  vatOutput: number;
  /** הוצאות מוכרות שנתיות */
  annualRecognizedExpenses: number;
  /** הכנסה חייבת ראשונית (לפני ניכויים) */
  initialTaxableIncome: number;
  /** ניכוי פנסיה */
  pensionDeduction: number;
  /** ניכוי קרן השתלמות */
  studyFundDeduction: number;
  /** סכום ב.ל. שנדרש לשלם */
  bituachLeumiRequired: number;
  /** ניכוי ב.ל. (52% מהסכום ששולם) */
  bituachLeumiDeduction: number;
  /** סה"כ ניכויים */
  totalDeductions: number;
  /** הכנסה חייבת סופית */
  finalTaxableIncome: number;
  /** מס הכנסה ברוטו לפני זיכויים */
  grossIncomeTax: number;
  /** זיכוי נקודות זיכוי */
  creditPointsValue: number;
  /** זיכוי פנסיה */
  pensionCredit: number;
  /** זיכוי תרומות (35% מהתרומות) */
  donationsCredit: number;
  /** סה"כ זיכויים */
  totalCredits: number;
  /** מס נטו לשלם */
  netIncomeTax: number;
  /** הפרש מקדמות מס הכנסה: + = לשלם, - = החזר */
  incomeTaxAdvancesDiff: number;
  /** הפרש מקדמות ב.ל.: + = לשלם, - = החזר */
  bituachLeumiAdvancesDiff: number;
  /** שיעור מס מצרפי (מס + ב.ל. / מחזור) */
  effectiveTaxRate: number;
  /** המלצות אופטימיזציה */
  recommendations: string[];
  /** פירוט רבעוני של מחזור */
  quarterlyRevenue: Record<Quarter, number>;
}

const QUARTER_MAP: Record<number, Quarter> = {
  1: 'Q1', 2: 'Q1', 3: 'Q1',
  4: 'Q2', 5: 'Q2', 6: 'Q2',
  7: 'Q3', 8: 'Q3', 9: 'Q3',
  10: 'Q4', 11: 'Q4', 12: 'Q4',
};

// ============================================================
// קבועים לסימולטור (2026)
// ============================================================
export const SIMULATOR_CONSTANTS_2026 = {
  // פנסיה לעצמאי
  pension: {
    eligibleIncomeCeiling: 232_800,
    deductionRate: 0.11,
    creditRate: 0.055,
    creditTaxRate: 0.35, // שיעור הזיכוי
    minDepositTier1Income: 75_216,
    minDepositTier1Rate: 0.0445,
    minDepositTier2Rate: 0.1255,
    minDepositTier2Income: 150_432,
  },
  // קרן השתלמות לעצמאי
  studyFund: {
    eligibleIncomeCeiling: 293_397,
    deductionRate: 0.045,
    deductionCap: 13_203,
    taxExemptCap: 20_520,
    monthlyExemptCap: 1_710,
  },
  // ביטוח לאומי לעצמאי - מדרגות חודשיות
  bituachLeumi: {
    reducedMonthlyCeiling: 7_522,
    fullMonthlyCeiling: 50_695,
    deductibleAsExpense: 0.52, // 52% מהסכום ששולם מוכר כהוצאה
  },
  // תרומות
  donations: {
    creditRate: 0.35,
  },
} as const;

/**
 * חישוב מס הכנסה לפי מדרגות 2026
 */
function calculateIncomeTaxByBrackets(taxableIncome: number): number {
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (taxableIncome <= prev) break;
    const inBracket = Math.min(taxableIncome, b.upTo) - prev;
    tax += inBracket * b.rate;
    if (taxableIncome <= b.upTo) break;
    prev = b.upTo;
  }
  return tax;
}

/**
 * חישוב ביטוח לאומי + דמי בריאות לעצמאי על בסיס שנתי
 * מדרגות חודשיות לפי הקובץ:
 *   - עד 7,522 ש"ח/חודש: 4.47% ב.ל. + 3.23% בריאות = 7.70%
 *   - 7,522-50,695 ש"ח/חודש: 12.83% ב.ל. + 5.17% בריאות = 18.00%
 */
export function calculateBituachLeumiAnnual(annualTaxableIncome: number): number {
  const monthlyIncome = annualTaxableIncome / 12;
  const c = SIMULATOR_CONSTANTS_2026.bituachLeumi;

  const reducedPart = Math.min(monthlyIncome, c.reducedMonthlyCeiling);
  const fullPart = Math.max(
    0,
    Math.min(monthlyIncome, c.fullMonthlyCeiling) - c.reducedMonthlyCeiling,
  );

  const reducedRate =
    SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.total; // 6.10% - לשנת 2026 (לוקח את העדכון)
  const fullRate = SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.total; // 18.00%

  // הקובץ המקורי השתמש ב-7.70% מופחת, ובוצעה התאמה ל-2026 לפי tax-2026.ts
  // נשתמש בערכים מקובץ הקבועים 2026
  const monthlyAmount = reducedPart * reducedRate + fullPart * fullRate;
  return monthlyAmount * 12;
}

/**
 * חישוב ניכוי פנסיה מקסימלי לעצמאי
 */
export function calculatePensionDeduction(
  annualPensionDeposit: number,
  annualTaxableIncome: number,
): { deduction: number; credit: number } {
  const p = SIMULATOR_CONSTANTS_2026.pension;
  const eligibleIncome = Math.min(annualTaxableIncome, p.eligibleIncomeCeiling);

  const maxDeduction = eligibleIncome * p.deductionRate;
  const maxCreditBase = eligibleIncome * p.creditRate;

  const deduction = Math.min(annualPensionDeposit, maxDeduction);
  const remainingForCredit = Math.max(0, annualPensionDeposit - deduction);
  const creditBase = Math.min(remainingForCredit, maxCreditBase);
  const credit = creditBase * p.creditTaxRate;

  return { deduction, credit };
}

/**
 * חישוב ניכוי קרן השתלמות לעצמאי
 */
export function calculateStudyFundDeduction(
  annualStudyFundDeposit: number,
  annualTaxableIncome: number,
): number {
  const s = SIMULATOR_CONSTANTS_2026.studyFund;
  const eligibleIncome = Math.min(annualTaxableIncome, s.eligibleIncomeCeiling);
  const maxDeduction = Math.min(eligibleIncome * s.deductionRate, s.deductionCap);
  return Math.min(annualStudyFundDeposit, maxDeduction);
}

/**
 * חישוב מצטבר עד הרבעון הנוכחי (כמה היה צריך לשלם עד עכשיו)
 */
function quarterMultiplier(quarter: Quarter): number {
  return { Q1: 0.25, Q2: 0.5, Q3: 0.75, Q4: 1.0 }[quarter];
}

/**
 * הסימולטור הראשי
 */
export function simulateYearEndTax(input: YearEndTaxInput): YearEndTaxResult {
  // 1. מחזור שנתי
  const monthly = (input.monthlyRevenue || []).slice(0, 12);
  while (monthly.length < 12) monthly.push(0);
  const annualRevenue = monthly.reduce((a, b) => a + (b || 0), 0);

  // מע"מ
  const isVatRegistered = input.businessType === 'authorized';
  const vatOutput = isVatRegistered ? annualRevenue * VAT_2026.standard : 0;
  const annualRevenueIncludingVat = annualRevenue + vatOutput;

  // פירוט רבעוני
  const quarterlyRevenue: Record<Quarter, number> = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  monthly.forEach((amt, i) => {
    const q = QUARTER_MAP[i + 1];
    quarterlyRevenue[q] += amt || 0;
  });

  // 2. הכנסה חייבת ראשונית
  const annualRecognizedExpenses = Math.max(0, input.recognizedExpenses);
  const initialTaxableIncome = Math.max(0, annualRevenue - annualRecognizedExpenses);

  // 3. ניכוי פנסיה + זיכוי
  const annualPension = Math.max(0, input.monthlyPensionDeposit) * 12;
  const { deduction: pensionDeduction, credit: pensionCredit } =
    calculatePensionDeduction(annualPension, initialTaxableIncome);

  // 4. ניכוי קרן השתלמות
  const annualStudyFund = Math.max(0, input.monthlyStudyFundDeposit) * 12;
  const studyFundDeduction = calculateStudyFundDeduction(
    annualStudyFund,
    initialTaxableIncome,
  );

  // 5. ביטוח לאומי
  const bituachLeumiRequired = calculateBituachLeumiAnnual(initialTaxableIncome);
  // 52% מהסכום שהיה צריך להיות משולם מוכר כהוצאה (אומדן לסוף שנה)
  const bituachLeumiDeduction =
    bituachLeumiRequired * SIMULATOR_CONSTANTS_2026.bituachLeumi.deductibleAsExpense;

  const totalDeductions = pensionDeduction + studyFundDeduction + bituachLeumiDeduction;
  const finalTaxableIncome = Math.max(0, initialTaxableIncome - totalDeductions);

  // 6. מס הכנסה
  const grossIncomeTax = calculateIncomeTaxByBrackets(finalTaxableIncome);

  // 7. זיכויים
  const creditPointsValue = Math.max(0, input.creditPoints) * CREDIT_POINT_2026.annual;
  const donations = Math.max(0, input.donations || 0);
  const donationsCredit = donations * SIMULATOR_CONSTANTS_2026.donations.creditRate;
  const totalCredits = creditPointsValue + pensionCredit + donationsCredit;

  const netIncomeTax = Math.max(0, grossIncomeTax - totalCredits);

  // 8. הפרשי מקדמות (לפי הרבעון הנוכחי)
  const qMul = quarterMultiplier(input.currentQuarter);
  const incomeTaxRequiredByNow = netIncomeTax * qMul;
  const bituachRequiredByNow = bituachLeumiRequired * qMul;

  const incomeTaxAdvancesDiff = incomeTaxRequiredByNow - (input.incomeTaxAdvancesPaid || 0);
  const bituachLeumiAdvancesDiff =
    bituachRequiredByNow - (input.bituachLeumiAdvancesPaid || 0);

  // 9. שיעור מס מצרפי
  const totalBurden = netIncomeTax + bituachLeumiRequired + vatOutput;
  const effectiveTaxRate = annualRevenue > 0 ? totalBurden / annualRevenue : 0;

  // 10. המלצות
  const recommendations: string[] = [];

  // פנסיה - הצעת אופטימיזציה
  const maxPensionDeductionAvailable =
    Math.min(initialTaxableIncome, SIMULATOR_CONSTANTS_2026.pension.eligibleIncomeCeiling) *
    SIMULATOR_CONSTANTS_2026.pension.deductionRate;
  if (annualPension < maxPensionDeductionAvailable - 100) {
    const gap = maxPensionDeductionAvailable - annualPension;
    recommendations.push(
      `יש לך עוד מקום של ${Math.round(gap).toLocaleString('he-IL')} ₪/שנה בניכוי פנסיה - שווה לשקול הגדלה`,
    );
  }

  // קרן השתלמות - הצעת אופטימיזציה
  const maxStudyDeductionAvailable = Math.min(
    initialTaxableIncome * SIMULATOR_CONSTANTS_2026.studyFund.deductionRate,
    SIMULATOR_CONSTANTS_2026.studyFund.deductionCap,
  );
  if (annualStudyFund < maxStudyDeductionAvailable - 100 && initialTaxableIncome > 30_000) {
    const gap = maxStudyDeductionAvailable - annualStudyFund;
    recommendations.push(
      `קרן השתלמות לעצמאי: עוד ${Math.round(gap).toLocaleString('he-IL')} ₪/שנה זכאי לניכוי + פטור ממס רווחי הון`,
    );
  }

  // הפרש מקדמות
  if (incomeTaxAdvancesDiff > 0) {
    recommendations.push(
      `חוסר במקדמות מס הכנסה: ${Math.round(incomeTaxAdvancesDiff).toLocaleString('he-IL')} ₪ - להשלים עד סוף הרבעון`,
    );
  } else if (incomeTaxAdvancesDiff < -1000) {
    recommendations.push(
      `שילמת מקדמות יתר של ${Math.round(-incomeTaxAdvancesDiff).toLocaleString('he-IL')} ₪ - אפשר להפחית בהמשך`,
    );
  }

  if (bituachLeumiAdvancesDiff > 0) {
    recommendations.push(
      `חוסר במקדמות ב.ל.: ${Math.round(bituachLeumiAdvancesDiff).toLocaleString('he-IL')} ₪`,
    );
  }

  // עוסק פטור - תקרת מחזור
  if (input.businessType === 'exempt' && annualRevenue > VAT_2026.smallBusinessThreshold) {
    recommendations.push(
      `חרגת מתקרת עוסק פטור (${VAT_2026.smallBusinessThreshold.toLocaleString('he-IL')} ₪) - חובה לעבור לעוסק מורשה`,
    );
  } else if (
    input.businessType === 'exempt' &&
    annualRevenue > VAT_2026.smallBusinessThreshold * 0.85
  ) {
    recommendations.push(
      `אתה קרוב לתקרת עוסק פטור - שווה לתכנן מעבר לעוסק מורשה`,
    );
  }

  // שיעור מס מצרפי גבוה
  if (effectiveTaxRate > 0.4) {
    recommendations.push(
      'שיעור מס מצרפי גבוה - שווה לבחון מעבר לחברה בע"מ (ראה מחשבון "חברה vs עוסק")',
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('המצב שלך נראה תקין - המשך לעקוב אחר ההכנסות וההוצאות');
  }

  return {
    annualRevenue,
    annualRevenueIncludingVat,
    vatOutput,
    annualRecognizedExpenses,
    initialTaxableIncome,
    pensionDeduction,
    studyFundDeduction,
    bituachLeumiRequired,
    bituachLeumiDeduction,
    totalDeductions,
    finalTaxableIncome,
    grossIncomeTax,
    creditPointsValue,
    pensionCredit,
    donationsCredit,
    totalCredits,
    netIncomeTax,
    incomeTaxAdvancesDiff,
    bituachLeumiAdvancesDiff,
    effectiveTaxRate,
    recommendations,
    quarterlyRevenue,
  };
}
