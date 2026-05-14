/**
 * מחשבון נטו לעצמאי - 2026
 *
 * השאלה הפשוטה: "כמה כסף ישאר לי ביד מכל הכנסה?"
 *
 * החישוב:
 *   מחזור (ללא מע"מ)
 *   - הוצאות מוכרות
 *   = הכנסה חייבת
 *   - ניכוי פנסיה (עד 11% מההכנסה המזכה)
 *   - ניכוי קרן השתלמות (עד 4.5% עד תקרה 13,203 ₪)
 *   - ניכוי 52% מב.ל.
 *   = הכנסה חייבת סופית
 *   → מס לפי מדרגות - זיכויים (נקודות + פנסיה)
 *   - ב.ל. + בריאות
 *   = נטו (לפני הוצאות עסקיות שכבר שולמו)
 *
 * הערה חשובה:
 *   "נטו" כאן = הכנסה חייבת - מס - ב.ל. - הפקדות פנסיוניות
 *   ההוצאות העסקיות **לא** מופחתות בסופ"ש כי הן יצאו לעסק עצמו.
 *
 * מקור: רשות המסים, ביטוח לאומי, חוק החיסכון הפנסיוני לעצמאיים
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
  VAT_2026,
} from '@/lib/constants/tax-2026';

export type BusinessType = 'exempt' | 'authorized';
export type InputPeriod = 'monthly' | 'annual';

export interface SelfEmployedNetInput {
  /** סוג העסק */
  businessType: BusinessType;
  /** תקופת הקלט (חודשי / שנתי) */
  inputPeriod: InputPeriod;
  /** הכנסה (בהתאם ל-inputPeriod) - ללא מע"מ */
  revenue: number;
  /** הוצאות מוכרות (בהתאם ל-inputPeriod) */
  recognizedExpenses: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** הפקדה חודשית לפנסיה (₪) */
  monthlyPensionDeposit: number;
  /** הפקדה חודשית לקרן השתלמות (₪) */
  monthlyStudyFundDeposit: number;
}

export interface SelfEmployedNetResult {
  /** מחזור שנתי (ללא מע"מ) */
  annualRevenue: number;
  /** מע"מ עסקאות שנתי (אם עוסק מורשה) */
  annualVat: number;
  /** הוצאות מוכרות שנתיות */
  annualExpenses: number;
  /** הכנסה חייבת ראשונית */
  initialTaxableIncome: number;
  /** ניכוי פנסיה */
  pensionDeduction: number;
  /** ניכוי קרן השתלמות */
  studyFundDeduction: number;
  /** ביטוח לאומי + בריאות שנתי */
  bituachLeumi: number;
  /** ניכוי ב.ל. (52%) */
  bituachLeumiDeduction: number;
  /** הכנסה חייבת סופית */
  finalTaxableIncome: number;
  /** מס הכנסה ברוטו (מדרגות) */
  grossIncomeTax: number;
  /** זיכוי נקודות זיכוי */
  creditPointsValue: number;
  /** זיכוי פנסיה */
  pensionCredit: number;
  /** מס הכנסה נטו */
  netIncomeTax: number;
  /** הפקדות שנתיות לפנסיה */
  annualPensionDeposit: number;
  /** הפקדות שנתיות לקרן השתלמות */
  annualStudyFundDeposit: number;
  /** נטו שנתי (אחרי מס + ב.ל. + הפקדות) */
  annualNet: number;
  /** נטו חודשי */
  monthlyNet: number;
  /** שיעור מס מצרפי (מס + ב.ל. / הכנסה חייבת) */
  effectiveTaxRate: number;
  /** "הוצאות חובה" שנתיות (מס + ב.ל., לא כולל פנסיה) */
  totalMandatoryDeductions: number;
  /** פירוט לתצוגה */
  breakdown: {
    label: string;
    value: number;
    type: 'income' | 'deduction' | 'tax' | 'net';
  }[];
}

// ============================================================
// קבועים (זהים לסימולטור הסוף-שנתי)
// ============================================================
const PENSION = {
  eligibleIncomeCeiling: 232_800,
  deductionRate: 0.11,
  creditRate: 0.055,
  creditTaxRate: 0.35,
} as const;

const STUDY_FUND = {
  eligibleIncomeCeiling: 293_397,
  deductionRate: 0.045,
  deductionCap: 13_203,
} as const;

const BL_DEDUCTIBLE = 0.52;

function calculateIncomeTaxBrackets(taxableIncome: number): number {
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

function calculateBituachLeumi(annualIncome: number): number {
  const monthly = annualIncome / 12;
  const reducedCeiling = 7_522;
  const fullCeiling = SOCIAL_SECURITY_SELF_EMPLOYED_2026.maxThresholdMonthly;

  const reducedPart = Math.min(monthly, reducedCeiling);
  const fullPart = Math.max(0, Math.min(monthly, fullCeiling) - reducedCeiling);

  const monthlyAmount =
    reducedPart * SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.total +
    fullPart * SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.total;

  return monthlyAmount * 12;
}

function calculatePensionDeductionAndCredit(
  annualPension: number,
  annualTaxableIncome: number,
): { deduction: number; credit: number } {
  const eligible = Math.min(annualTaxableIncome, PENSION.eligibleIncomeCeiling);
  const maxDeduction = eligible * PENSION.deductionRate;
  const maxCreditBase = eligible * PENSION.creditRate;

  const deduction = Math.min(annualPension, maxDeduction);
  const remaining = Math.max(0, annualPension - deduction);
  const creditBase = Math.min(remaining, maxCreditBase);
  const credit = creditBase * PENSION.creditTaxRate;

  return { deduction, credit };
}

function calculateStudyFundDeduction(
  annualDeposit: number,
  annualIncome: number,
): number {
  const eligible = Math.min(annualIncome, STUDY_FUND.eligibleIncomeCeiling);
  const max = Math.min(eligible * STUDY_FUND.deductionRate, STUDY_FUND.deductionCap);
  return Math.min(annualDeposit, max);
}

/**
 * חישוב מלא של הנטו לעצמאי
 */
export function calculateSelfEmployedNet(
  input: SelfEmployedNetInput,
): SelfEmployedNetResult {
  // 1. המרה לבסיס שנתי
  const factor = input.inputPeriod === 'monthly' ? 12 : 1;
  const annualRevenue = Math.max(0, input.revenue) * factor;
  const annualExpenses = Math.max(0, input.recognizedExpenses) * factor;

  // 2. מע"מ (לעוסק מורשה - לא חלק מהנטו)
  const annualVat =
    input.businessType === 'authorized' ? annualRevenue * VAT_2026.standard : 0;

  // 3. הכנסה חייבת ראשונית
  const initialTaxableIncome = Math.max(0, annualRevenue - annualExpenses);

  // 4. הפקדות פנסיוניות
  const annualPensionDeposit = Math.max(0, input.monthlyPensionDeposit) * 12;
  const annualStudyFundDeposit = Math.max(0, input.monthlyStudyFundDeposit) * 12;

  // 5. ניכויים
  const { deduction: pensionDeduction, credit: pensionCredit } =
    calculatePensionDeductionAndCredit(annualPensionDeposit, initialTaxableIncome);

  const studyFundDeduction = calculateStudyFundDeduction(
    annualStudyFundDeposit,
    initialTaxableIncome,
  );

  // 6. ב.ל. + ניכוי
  const bituachLeumi = calculateBituachLeumi(initialTaxableIncome);
  const bituachLeumiDeduction = bituachLeumi * BL_DEDUCTIBLE;

  // 7. הכנסה חייבת סופית
  const finalTaxableIncome = Math.max(
    0,
    initialTaxableIncome - pensionDeduction - studyFundDeduction - bituachLeumiDeduction,
  );

  // 8. מס הכנסה
  const grossIncomeTax = calculateIncomeTaxBrackets(finalTaxableIncome);
  const creditPointsValue =
    Math.max(0, input.creditPoints) * CREDIT_POINT_2026.annual;
  const netIncomeTax = Math.max(0, grossIncomeTax - creditPointsValue - pensionCredit);

  // 9. נטו - מה שנשאר ביד
  // נטו = הכנסה חייבת - מס - ב.ל. - הפקדות פנסיוניות
  const annualNet =
    initialTaxableIncome -
    netIncomeTax -
    bituachLeumi -
    annualPensionDeposit -
    annualStudyFundDeposit;

  const monthlyNet = annualNet / 12;

  // 10. שיעור מס מצרפי
  const totalMandatoryDeductions = netIncomeTax + bituachLeumi;
  const effectiveTaxRate =
    initialTaxableIncome > 0 ? totalMandatoryDeductions / initialTaxableIncome : 0;

  // 11. פירוט לויזואליזציה
  const breakdown = [
    { label: 'מחזור', value: annualRevenue, type: 'income' as const },
    { label: 'הוצאות מוכרות', value: -annualExpenses, type: 'deduction' as const },
    { label: 'מס הכנסה', value: -netIncomeTax, type: 'tax' as const },
    { label: 'ביטוח לאומי + בריאות', value: -bituachLeumi, type: 'tax' as const },
    { label: 'הפקדה לפנסיה', value: -annualPensionDeposit, type: 'deduction' as const },
    { label: 'הפקדה לקרן השתלמות', value: -annualStudyFundDeposit, type: 'deduction' as const },
    { label: 'נטו שנתי ביד', value: annualNet, type: 'net' as const },
  ];

  return {
    annualRevenue,
    annualVat,
    annualExpenses,
    initialTaxableIncome,
    pensionDeduction,
    studyFundDeduction,
    bituachLeumi,
    bituachLeumiDeduction,
    finalTaxableIncome,
    grossIncomeTax,
    creditPointsValue,
    pensionCredit,
    netIncomeTax,
    annualPensionDeposit,
    annualStudyFundDeposit,
    annualNet,
    monthlyNet,
    effectiveTaxRate,
    totalMandatoryDeductions,
    breakdown,
  };
}
