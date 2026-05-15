/**
 * מחשבון בונוס שנתי מקיף - 2026
 *
 * מכסה:
 * - חישוב נטו בונוס (מס שולי + ב.ל.)
 * - אומדן החזר מס בסוף שנה
 * - השוואה: בונוס חד-פעמי vs העלאת שכר
 * - שלוש שיטות ניכוי מס (חודש אחד / פריסה / דחייה)
 * - משכורת 13 (חישוב ייעודי)
 * - בונוס מבוסס ביצועים (% משכר / סכום קבוע)
 * - אופציות / RSU סעיף 102 (מסלול הוני vs רגיל)
 * - השוואת שנים 2024/2025/2026
 *
 * מקור: רשות המסים, ביטוח לאומי 2026
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_EMPLOYEE_2026,
} from '@/lib/constants/tax-2026';

// ============================================================
// טיפוסים ומדרגות היסטוריות
// ============================================================

export type TaxYear = '2024' | '2025' | '2026';

export const TAX_BRACKETS_2024 = [
  { upTo: 84_120, rate: 0.10 },
  { upTo: 120_720, rate: 0.14 },
  { upTo: 193_800, rate: 0.20 },
  { upTo: 269_280, rate: 0.31 },
  { upTo: 560_280, rate: 0.35 },
  { upTo: 721_560, rate: 0.47 },
  { upTo: Infinity, rate: 0.50 },
] as const;

export const TAX_BRACKETS_2025 = TAX_BRACKETS_2024;

function getBrackets(year: TaxYear) {
  if (year === '2026') return TAX_BRACKETS_2026;
  return TAX_BRACKETS_2024;
}

// ============================================================
// פונקציות עזר פנימיות
// ============================================================

/**
 * חישוב מס הכנסה שנתי לפי מדרגות
 */
function calcAnnualTax(
  annualIncome: number,
  creditPoints: number,
  year: TaxYear = '2026',
): number {
  const brackets = getBrackets(year);
  let remaining = annualIncome;
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (remaining <= 0) break;
    const sz = (b.upTo === Infinity ? remaining : b.upTo - prev);
    const chunk = Math.min(remaining, sz);
    tax += chunk * b.rate;
    remaining -= chunk;
    if (b.upTo !== Infinity) prev = b.upTo;
  }
  const creditAmount = creditPoints * CREDIT_POINT_2026.annual;
  return Math.max(0, tax - creditAmount);
}

/**
 * מדרגה שולית לפי הכנסה שנתית
 */
function getMarginalRate(annualIncome: number, year: TaxYear = '2026'): number {
  const brackets = getBrackets(year);
  for (const b of brackets) {
    if (annualIncome <= b.upTo) return b.rate;
  }
  return brackets[brackets.length - 1].rate;
}

/**
 * ב.ל. + בריאות על סכום חודשי
 */
function calcMonthlySS(monthly: number): number {
  const { reducedThresholdMonthly, maxThresholdMonthly, reducedRate, fullRate } =
    SOCIAL_SECURITY_EMPLOYEE_2026;
  const capped = Math.min(monthly, maxThresholdMonthly);
  if (capped <= reducedThresholdMonthly) return capped * reducedRate.total;
  return (
    reducedThresholdMonthly * reducedRate.total +
    (capped - reducedThresholdMonthly) * fullRate.total
  );
}

/**
 * ב.ל. על בונוס: ההפרש בין SS שנתי עם בונוס לבלי בונוס.
 *
 * גישה: מחלקים את הבונוס על פני 12 חודשים לצורך חישוב ב.ל. —
 * זה מייצג את ניכוי הב.ל. השנתי הנוסף שנגרם בגלל הבונוס.
 * (בפועל ב.ל. חודשי, אבל לצורך חישוב ההשפעה השנתית — שיטה זו נכונה)
 */
function calcSSOnBonus(grossBonus: number, monthlyBaseSalary: number): number {
  const baseSS = calcMonthlySS(monthlyBaseSalary) * 12;
  // הבונוס מחולק ל-12 לצורך חישוב ב.ל. הנוסף
  const avgMonthlyWithBonus = monthlyBaseSalary + grossBonus / 12;
  const withBonusSS = calcMonthlySS(avgMonthlyWithBonus) * 12;
  return Math.max(0, withBonusSS - baseSS);
}

// ============================================================
// 1. חישוב נטו בונוס (שיטה 1: חיוב חד-פעמי)
// ============================================================

export interface BonusNetInput {
  /** סכום הבונוס ברוטו (₪) */
  grossBonus: number;
  /** משכורת חודשית רגילה ברוטו (₪) */
  monthlyBaseSalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** שנת מס */
  taxYear?: TaxYear;
  /** האם להפריש לפנסיה מהבונוס (6%) */
  pensionDeductionEnabled?: boolean;
  /** האם להפריש לקרן השתלמות מהבונוס (2.5%) */
  studyFundDeductionEnabled?: boolean;
}

export interface BonusNetResult {
  grossBonus: number;
  /** מס שולי בפועל */
  effectiveMarginalRate: number;
  /** מס מדרגות שנגזר מהבונוס */
  incomeTaxOnBonus: number;
  /** ביטוח לאומי + בריאות */
  socialSecurityOnBonus: number;
  /** ניכוי פנסיה (אם מופעל) */
  pensionDeduction: number;
  /** ניכוי קרן השתלמות (אם מופעל) */
  studyFundDeduction: number;
  /** סך ניכויים */
  totalDeductions: number;
  /** נטו לכיס */
  netBonus: number;
  /** % נטו מברוטו */
  netPercentage: number;
  /** מדרגה שולית שנכנסים אליה */
  marginalBracketRate: number;
  /** % מס אפקטיבי על הבונוס */
  effectiveTaxRate: number;
  /** הסבר קצר */
  explanation: string;
}

export function calculateBonusNet(input: BonusNetInput): BonusNetResult {
  const gross = Math.max(0, input.grossBonus);
  const monthlyBase = Math.max(0, input.monthlyBaseSalary);
  const year = input.taxYear ?? '2026';
  const annualBase = monthlyBase * 12;
  const annualWithBonus = annualBase + gross;

  // מס לפני ואחרי הבונוס - ההפרש = מס על הבונוס
  const taxBefore = calcAnnualTax(annualBase, input.creditPoints, year);
  const taxAfter = calcAnnualTax(annualWithBonus, input.creditPoints, year);
  const incomeTaxOnBonus = Math.max(0, taxAfter - taxBefore);

  const effectiveMarginalRate = gross > 0 ? incomeTaxOnBonus / gross : 0;
  const marginalBracketRate = getMarginalRate(annualWithBonus, year);

  // ב.ל. — שיטה: הבונוס משולם בחודש אחד (כל הבונוס + שכר = שכר החודש)
  // כלומר: מחשבים SS(שכר+בונוס) - SS(שכר) × 12
  const ssOnBonus = calcSSOnBonus(gross, monthlyBase);

  const pension = input.pensionDeductionEnabled ? gross * 0.06 : 0;
  const studyFund = input.studyFundDeductionEnabled ? gross * 0.025 : 0;

  const totalDeductions = incomeTaxOnBonus + ssOnBonus + pension + studyFund;
  const netBonus = Math.max(0, gross - totalDeductions);
  const netPercentage = gross > 0 ? (netBonus / gross) * 100 : 0;
  const effectiveTaxRate = gross > 0 ? (incomeTaxOnBonus / gross) * 100 : 0;

  const marginalPct = Math.round(marginalBracketRate * 100);
  const explanation =
    gross === 0
      ? 'הכנס סכום בונוס לחישוב'
      : `הבונוס ממוסה בשיעור שולי של ${Math.round(effectiveMarginalRate * 100)}% ` +
        `(מדרגת ${marginalPct}%) — ` +
        `מס ${Math.round(incomeTaxOnBonus).toLocaleString('he-IL')} ₪ + ` +
        `ב.ל. ${Math.round(ssOnBonus).toLocaleString('he-IL')} ₪`;

  return {
    grossBonus: gross,
    effectiveMarginalRate,
    incomeTaxOnBonus,
    socialSecurityOnBonus: ssOnBonus,
    pensionDeduction: pension,
    studyFundDeduction: studyFund,
    totalDeductions,
    netBonus,
    netPercentage,
    marginalBracketRate,
    effectiveTaxRate,
    explanation,
  };
}

// ============================================================
// 2. שלוש שיטות ניכוי — השוואה
// ============================================================

export type WithholdingMethod = 'current_month' | 'annual_spread' | 'defer_next_year';

export interface WithholdingMethodResult {
  method: WithholdingMethod;
  label: string;
  description: string;
  estimatedWithheld: number;  // מה שינוכה בפועל (ניכוי במקור)
  estimatedActualTax: number; // המס האמיתי בסוף שנה
  estimatedRefund: number;    // החזר מס משוער
  netImmediately: number;     // מה שמקבלים מיד
  netAfterRefund: number;     // מה שמקבלים בסוף (אחרי החזר)
  pros: string[];
  cons: string[];
}

export interface ThreeMethodsInput extends BonusNetInput {
  /** חודשים שנותרו בשנת המס (1-12) */
  monthsRemainingInYear?: number;
  /** נקודות זיכוי שנה הבאה (לחישוב דחייה) */
  nextYearCreditPoints?: number;
  /** שכר חודשי שנה הבאה (לחישוב דחייה) */
  nextYearMonthlySalary?: number;
}

export function compareWithholdingMethods(input: ThreeMethodsInput): WithholdingMethodResult[] {
  const gross = Math.max(0, input.grossBonus);
  const monthlyBase = Math.max(0, input.monthlyBaseSalary);
  const year = input.taxYear ?? '2026';
  const monthsLeft = Math.max(1, Math.min(12, input.monthsRemainingInYear ?? 6));
  const annualBase = monthlyBase * 12;

  // ---- שיטה 1: חיוב חודש נוכחי (המדרגה השולית הגבוהה ביותר) ----
  const taxBefore = calcAnnualTax(annualBase, input.creditPoints, year);
  const taxAfter = calcAnnualTax(annualBase + gross, input.creditPoints, year);
  const actualTaxM1 = Math.max(0, taxAfter - taxBefore);
  const ssM1 = calcSSOnBonus(gross, monthlyBase);
  // מעסיק בד"כ מנכה לפי מדרגה שולית פשוטה (לא הפרש מדויק)
  const marginalRate = getMarginalRate(annualBase + gross, year);
  const withheldM1 = gross * marginalRate + ssM1;
  const refundM1 = Math.max(0, withheldM1 - actualTaxM1 - ssM1);
  const netM1immediate = gross - withheldM1;
  const netM1total = gross - actualTaxM1 - ssM1;

  // ---- שיטה 2: פריסה על פני השנה (חלוקה ל-12) ----
  // כל חודש מתווסף gross/12 לשכר — מס על הסכום הנמוך יותר
  const monthlyBonus = gross / 12;
  const annualSalaryWithSpread = annualBase + gross;
  const taxSpread = Math.max(0, calcAnnualTax(annualSalaryWithSpread, input.creditPoints, year) - taxBefore);
  const ssM2 = calcSSOnBonus(gross, monthlyBase); // בסך הכל זהה
  // ניכוי בכל חודש בערך טוב יותר כי מדרגות נחשבות חודשי
  // בפועל המעסיק מנכה לפי הפרש המס — קרוב יותר לאמיתי
  const withheldM2 = taxSpread + ssM2;
  const refundM2 = 0; // פריסה מדויקת — כמעט ללא החזר
  const netM2immediate = gross - withheldM2;
  const netM2total = netM2immediate;

  // ---- שיטה 3: דחייה לשנה הבאה ----
  const nextYearCPs = input.nextYearCreditPoints ?? input.creditPoints;
  const nextYearSalary = input.nextYearMonthlySalary ?? monthlyBase;
  const nextYearAnnualBase = nextYearSalary * 12;
  const taxNextBefore = calcAnnualTax(nextYearAnnualBase, nextYearCPs, year);
  const taxNextAfter = calcAnnualTax(nextYearAnnualBase + gross, nextYearCPs, year);
  const actualTaxM3 = Math.max(0, taxNextAfter - taxNextBefore);
  const ssM3 = calcSSOnBonus(gross, nextYearSalary);
  const netM3total = gross - actualTaxM3 - ssM3;

  return [
    {
      method: 'current_month',
      label: 'ניכוי חד-פעמי (חודש נוכחי)',
      description: 'הבונוס מצטרף לשכר חודש אחד — ניכוי במקור לפי המדרגה השולית הגבוהה',
      estimatedWithheld: withheldM1,
      estimatedActualTax: actualTaxM1,
      estimatedRefund: refundM1,
      netImmediately: Math.max(0, netM1immediate),
      netAfterRefund: Math.max(0, netM1total),
      pros: ['מיידי — הכסף בחשבון עם תשלום הבונוס', 'פשוט מבחינת מעסיק'],
      cons: [
        'ניכוי גבוה במקור — תזרים מידי נמוך',
        'צריך להגיש שומה לקבל החזר (בד"כ)',
        `ניכוי שוטף: ${Math.round(marginalRate * 100)}% מס + ב.ל.`,
      ],
    },
    {
      method: 'annual_spread',
      label: 'פריסה שנתית (חלוקה ל-12)',
      description: 'הבונוס נפרס על 12 חודשים — כל חודש מתווסף ${Math.round(monthlyBonus).toLocaleString()} ₪',
      estimatedWithheld: withheldM2,
      estimatedActualTax: taxSpread,
      estimatedRefund: refundM2,
      netImmediately: Math.max(0, netM2immediate),
      netAfterRefund: Math.max(0, netM2total),
      pros: [
        'ניכוי מדויק יותר — כמעט ללא החזר/תוספת',
        'תזרים חלק לאורך השנה',
        'מס שולי נמוך יותר אם חלק הבונוס בחודש נמוך',
      ],
      cons: ['דורש הסכמת מעסיק', 'מקבלים את הכסף בהדרגה ולא מיד', 'לא תמיד אפשרי מבחינת הנהלת חשבונות'],
    },
    {
      method: 'defer_next_year',
      label: 'דחייה לשנה הבאה',
      description: 'הבונוס ישולם בינואר — כנגד שנת מס חדשה',
      estimatedWithheld: actualTaxM3 + ssM3,
      estimatedActualTax: actualTaxM3,
      estimatedRefund: 0,
      netImmediately: 0,
      netAfterRefund: Math.max(0, netM3total),
      pros: [
        'מועיל אם שנה הבאה ההכנסה השנתית תהיה נמוכה יותר',
        'מועיל אם יש תוספת זיכויים בשנה הבאה (ילד חדש וכו\')',
        'מנצל מדרגות מס מחדש',
      ],
      cons: [
        'הכסף מגיע מאוחר',
        'אין ודאות ששנה הבאה מס יהיה נמוך יותר',
        'דורש הסכמת מעסיק',
      ],
    },
  ];
}

// ============================================================
// 3. החזר מס משוער בסוף שנה
// ============================================================

export interface RefundEstimateInput {
  /** שכר חודשי ממוצע בשנה */
  avgMonthlySalary: number;
  /** בונוסים כולל שנקבלו */
  totalBonusReceived: number;
  /** מס שנוכה בפועל מהבונוסים */
  taxWithheldOnBonus: number;
  /** מס שנוכה מהשכר השנתי */
  taxWithheldOnSalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** הפקדות פנסיה מהבונוס (לא כולל הטבת מס פנסיה) */
  pensionFromBonus?: number;
  /** שנת מס */
  taxYear?: TaxYear;
}

export interface RefundEstimateResult {
  annualIncome: number;
  actualAnnualTax: number;
  totalWithheld: number;
  estimatedRefund: number;
  isRefund: boolean;
  /** "קרוב לוודאי תקבל" / "אולי תשלם תוספת" */
  verdict: string;
  /** % סבירות לקבלת החזר (אומדן) */
  refundProbability: number;
  tips: string[];
}

export function calculateYearEndRefund(input: RefundEstimateInput): RefundEstimateResult {
  const year = input.taxYear ?? '2026';
  const annualSalary = input.avgMonthlySalary * 12;
  const annualIncome = annualSalary + input.totalBonusReceived;
  const actualAnnualTax = calcAnnualTax(annualIncome, input.creditPoints, year);
  const totalWithheld = (input.taxWithheldOnSalary ?? 0) + (input.taxWithheldOnBonus ?? 0);
  const estimatedRefund = totalWithheld - actualAnnualTax;
  const isRefund = estimatedRefund > 0;

  const refundProbability = isRefund
    ? Math.min(95, 60 + (estimatedRefund / annualIncome) * 500)
    : 20;

  const verdict = isRefund
    ? `קרוב לוודאי תקבל החזר של כ-${Math.round(estimatedRefund).toLocaleString('he-IL')} ₪`
    : `ייתכן תשלום תוספת מס של כ-${Math.round(-estimatedRefund).toLocaleString('he-IL')} ₪`;

  const tips: string[] = [];
  if (isRefund && estimatedRefund > 500) {
    tips.push('הגש בקשה להחזר מס בטופס 135 — ניתן לעשות באופן מקוון.');
    tips.push('החזר מס ניתן לתבוע עד 6 שנים אחורה.');
  }
  if (!isRefund) {
    tips.push('הפקדה לפנסיה מהבונוס מפחיתה את ההכנסה החייבת.');
    tips.push('אם יש לך הוצאות מוכרות (נכות, תרומות) — ניצול נקודות זיכוי יפחית חוב.');
  }
  if (input.creditPoints < 2.25) {
    tips.push('בדוק שאתה מנצל את נקודות הזיכוי המגיעות לך (ילדים, השכלה, עולה).');
  }

  return {
    annualIncome,
    actualAnnualTax,
    totalWithheld,
    estimatedRefund,
    isRefund,
    verdict,
    refundProbability,
    tips,
  };
}

// ============================================================
// 4. השוואה: בונוס חד-פעמי vs העלאת שכר
// ============================================================

export interface BonusVsRaiseInput {
  /** סכום הבונוס ברוטו (₪) */
  grossBonus: number;
  /** שכר חודשי נוכחי (₪) */
  currentMonthlySalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** חודשים שנותרו בשנה */
  monthsRemaining?: number;
  /** שנת מס */
  taxYear?: TaxYear;
}

export interface BonusVsRaiseResult {
  bonus: {
    grossAmount: number;
    taxPaid: number;
    ssPaid: number;
    netReceived: number;
    netPercentage: number;
  };
  raise: {
    monthlyIncrease: number;
    netMonthlyIncrease: number;
    netForRemainingYear: number;
    netPercentage: number;
    annualNetValue: number;
  };
  difference: {
    bonusIsHigherBy: number;
    raiseWinsAfterMonths: number | null;
    recommendation: string;
  };
}

export function compareBonusVsRaise(input: BonusVsRaiseInput): BonusVsRaiseResult {
  const gross = Math.max(0, input.grossBonus);
  const monthlyBase = Math.max(0, input.currentMonthlySalary);
  const year = input.taxYear ?? '2026';
  const monthsLeft = Math.max(1, Math.min(12, input.monthsRemaining ?? 6));
  const annualBase = monthlyBase * 12;

  // --- בונוס ---
  const taxBefore = calcAnnualTax(annualBase, input.creditPoints, year);
  const taxAfter = calcAnnualTax(annualBase + gross, input.creditPoints, year);
  const taxOnBonus = Math.max(0, taxAfter - taxBefore);
  const ssOnBonus = calcSSOnBonus(gross, monthlyBase);
  const netBonus = Math.max(0, gross - taxOnBonus - ssOnBonus);
  const bonusNetPct = gross > 0 ? (netBonus / gross) * 100 : 0;

  // --- העלאת שכר: אותו סכום מחולק ל-12 חודשים ---
  const monthlyRaise = gross / 12;
  const newMonthly = monthlyBase + monthlyRaise;
  const annualNew = newMonthly * 12;
  const taxNew = calcAnnualTax(annualNew, input.creditPoints, year);
  const annualTaxIncrease = Math.max(0, taxNew - taxBefore);
  const monthlyTaxIncrease = annualTaxIncrease / 12;
  const ssBefore = calcMonthlySS(monthlyBase);
  const ssAfter = calcMonthlySS(newMonthly);
  const monthlySSIncrease = ssAfter - ssBefore;
  const netMonthlyRaise = monthlyRaise - monthlyTaxIncrease - monthlySSIncrease;
  const netForRemaining = netMonthlyRaise * monthsLeft;
  const raiseNetPct = monthlyRaise > 0 ? (netMonthlyRaise / monthlyRaise) * 100 : 0;
  const annualNetRaiseValue = netMonthlyRaise * 12;

  // --- השוואה ---
  const bonusIsBetter = netBonus - netForRemaining;
  // מתי ההעלאה "מנצחת"? כאשר netMonthlyRaise × חודשים > netBonus
  const raiseWinsAfterMonths =
    netMonthlyRaise > 0 ? Math.ceil(netBonus / netMonthlyRaise) : null;

  let recommendation: string;
  if (netBonus > annualNetRaiseValue) {
    recommendation = `הבונוס החד-פעמי עדיף בשנה הראשונה (${Math.round(netBonus).toLocaleString('he-IL')} ₪ לעומת ${Math.round(annualNetRaiseValue).toLocaleString('he-IL')} ₪). אבל ההעלאה צוברת יתרון מהשנה השנייה.`;
  } else if (annualNetRaiseValue > netBonus) {
    recommendation = `העלאת שכר עדיפה כבר בשנה הראשונה (${Math.round(annualNetRaiseValue).toLocaleString('he-IL')} ₪ לעומת ${Math.round(netBonus).toLocaleString('he-IL')} ₪). מומלץ להעדיף העלאת שכר.`;
  } else {
    recommendation = 'ערכם שקול — שקול את ההשפעה על הזכויות הסוציאליות (פנסיה, פיצויים).';
  }

  return {
    bonus: {
      grossAmount: gross,
      taxPaid: taxOnBonus,
      ssPaid: ssOnBonus,
      netReceived: netBonus,
      netPercentage: bonusNetPct,
    },
    raise: {
      monthlyIncrease: monthlyRaise,
      netMonthlyIncrease: Math.max(0, netMonthlyRaise),
      netForRemainingYear: Math.max(0, netForRemaining),
      netPercentage: raiseNetPct,
      annualNetValue: Math.max(0, annualNetRaiseValue),
    },
    difference: {
      bonusIsHigherBy: bonusIsBetter,
      raiseWinsAfterMonths,
      recommendation,
    },
  };
}

// ============================================================
// 5. משכורת 13 (חישוב ייעודי)
// ============================================================

export type ThirteenthSalaryConvention =
  | 'full_month'      // שכר חודש מלא
  | 'half_month'      // חצי חודש
  | 'proportional'    // יחסי לפי ותק בשנה
  | 'custom';         // סכום מותאם

export interface ThirteenthSalaryInput {
  /** שכר חודשי ברוטו (₪) */
  monthlySalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** אמנת חישוב */
  convention: ThirteenthSalaryConvention;
  /** חודשים עבד בשנה (לפרופורציה) */
  monthsWorkedThisYear?: number;
  /** סכום מותאם (רלוונטי רק ל-custom) */
  customAmount?: number;
  /** האם כוללת זכויות סוציאליות (פנסיה, פיצויים) */
  includesSocialRights?: boolean;
  /** שנת מס */
  taxYear?: TaxYear;
}

export interface ThirteenthSalaryResult {
  grossAmount: number;
  convention: string;
  /** הסבר על הכינוי */
  conventionNote: string;
  taxOnAmount: number;
  ssOnAmount: number;
  netAmount: number;
  netPercentage: number;
  /** השפעה על זכויות סוציאליות */
  socialRightsNote: string;
  /** אם הוחלט שאין משכורת 13 — מה יכולה הייתה להיות ההשפעה */
  opportunityCost: string;
}

export function calculate13thSalary(input: ThirteenthSalaryInput): ThirteenthSalaryResult {
  const year = input.taxYear ?? '2026';
  const monthlyBase = Math.max(0, input.monthlySalary);
  const monthsWorked = Math.max(1, Math.min(12, input.monthsWorkedThisYear ?? 12));

  let grossAmount: number;
  let convention: string;
  let conventionNote: string;

  switch (input.convention) {
    case 'full_month':
      grossAmount = monthlyBase;
      convention = 'שכר חודש מלא';
      conventionNote = 'תשלום שווה לשכר חודשי מלא — הנפוץ ביותר בשוק הפרטי';
      break;
    case 'half_month':
      grossAmount = monthlyBase * 0.5;
      convention = 'חצי חודש';
      conventionNote = 'תשלום של חצי משכורת חודשית — נפוץ בחלק מחוזי עבודה';
      break;
    case 'proportional':
      grossAmount = (monthlyBase * monthsWorked) / 12;
      convention = `יחסי (${monthsWorked} חודשים)`;
      conventionNote = `מחושב לפי ${monthsWorked} חודשי עבודה בשנה — (${monthlyBase.toLocaleString('he-IL')} × ${monthsWorked} ÷ 12)`;
      break;
    case 'custom':
      grossAmount = Math.max(0, input.customAmount ?? monthlyBase);
      convention = 'סכום מותאם';
      conventionNote = 'סכום שנקבע בחוזה אישי';
      break;
  }

  const annualBase = monthlyBase * 12;
  const taxBefore = calcAnnualTax(annualBase, input.creditPoints, year);
  const taxAfter = calcAnnualTax(annualBase + grossAmount, input.creditPoints, year);
  const taxOnAmount = Math.max(0, taxAfter - taxBefore);
  const ssOnAmount = calcSSOnBonus(grossAmount, monthlyBase);
  const netAmount = Math.max(0, grossAmount - taxOnAmount - ssOnAmount);
  const netPercentage = grossAmount > 0 ? (netAmount / grossAmount) * 100 : 0;

  const socialRightsNote = input.includesSocialRights
    ? 'משכורת 13 כוללת בחוזה — משפיעה על בסיס שכר לפנסיה ולפיצויים'
    : 'משכורת 13 לא נחשבת לבסיס שכר לפנסיה ולפיצויים (אלא אם כתוב אחרת בחוזה)';

  const opportunityCost = `אם הסכום ${Math.round(netAmount).toLocaleString('he-IL')} ₪ היה מושקע ב-7% שנתי: ` +
    `לאחר 10 שנים — כ-${Math.round(netAmount * Math.pow(1.07, 10)).toLocaleString('he-IL')} ₪`;

  return {
    grossAmount,
    convention,
    conventionNote,
    taxOnAmount,
    ssOnAmount,
    netAmount,
    netPercentage,
    socialRightsNote,
    opportunityCost,
  };
}

// ============================================================
// 6. בונוס מבוסס ביצועים
// ============================================================

export type PerformanceBonusType = 'percentage_of_salary' | 'fixed' | 'target_based';

export interface PerformanceBonusInput {
  /** שכר חודשי בסיסי (₪) */
  monthlySalary: number;
  /** סוג הבונוס */
  bonusType: PerformanceBonusType;
  /** % מהשכר השנתי (למצב percentage_of_salary) */
  bonusPercentageOfSalary?: number;
  /** סכום קבוע (למצב fixed) */
  fixedAmount?: number;
  /** יעד (₪) ו-% עמידה (למצב target_based) */
  targetAmount?: number;
  achievementPercentage?: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** שנת מס */
  taxYear?: TaxYear;
}

export interface PerformanceBonusResult {
  grossBonus: number;
  bonusAsPercentOfAnnualSalary: number;
  taxOnBonus: number;
  ssOnBonus: number;
  netBonus: number;
  netPercentage: number;
  scenarios: {
    label: string;
    achievementPct: number;
    grossBonus: number;
    netBonus: number;
  }[];
}

export function calculatePerformanceBonus(input: PerformanceBonusInput): PerformanceBonusResult {
  const year = input.taxYear ?? '2026';
  const monthlyBase = Math.max(0, input.monthlySalary);
  const annualBase = monthlyBase * 12;

  let grossBonus: number;

  switch (input.bonusType) {
    case 'percentage_of_salary':
      grossBonus = annualBase * ((input.bonusPercentageOfSalary ?? 10) / 100);
      break;
    case 'fixed':
      grossBonus = Math.max(0, input.fixedAmount ?? 0);
      break;
    case 'target_based': {
      const target = Math.max(0, input.targetAmount ?? 0);
      const achievement = Math.max(0, Math.min(200, input.achievementPercentage ?? 100)) / 100;
      grossBonus = target * achievement;
      break;
    }
    default:
      grossBonus = 0;
  }

  const taxBefore = calcAnnualTax(annualBase, input.creditPoints, year);
  const taxAfter = calcAnnualTax(annualBase + grossBonus, input.creditPoints, year);
  const taxOnBonus = Math.max(0, taxAfter - taxBefore);
  const ssOnBonus = calcSSOnBonus(grossBonus, monthlyBase);
  const netBonus = Math.max(0, grossBonus - taxOnBonus - ssOnBonus);
  const netPercentage = grossBonus > 0 ? (netBonus / grossBonus) * 100 : 0;
  const bonusAsPercentOfAnnualSalary = annualBase > 0 ? (grossBonus / annualBase) * 100 : 0;

  // תרחישים לפי % עמידה ביעד
  const achievementLevels = [50, 75, 100, 125, 150];
  const scenarios = achievementLevels.map((pct) => {
    let scenarioGross: number;
    if (input.bonusType === 'target_based') {
      scenarioGross = (input.targetAmount ?? 0) * (pct / 100);
    } else if (input.bonusType === 'percentage_of_salary') {
      scenarioGross = annualBase * ((input.bonusPercentageOfSalary ?? 10) / 100) * (pct / 100);
    } else {
      scenarioGross = grossBonus * (pct / 100);
    }
    const tB = calcAnnualTax(annualBase, input.creditPoints, year);
    const tA = calcAnnualTax(annualBase + scenarioGross, input.creditPoints, year);
    const scenarioTax = Math.max(0, tA - tB);
    const scenarioSS = calcSSOnBonus(scenarioGross, monthlyBase);
    const scenarioNet = Math.max(0, scenarioGross - scenarioTax - scenarioSS);
    return {
      label: `${pct}% עמידה ביעד`,
      achievementPct: pct,
      grossBonus: scenarioGross,
      netBonus: scenarioNet,
    };
  });

  return {
    grossBonus,
    bonusAsPercentOfAnnualSalary,
    taxOnBonus,
    ssOnBonus,
    netBonus,
    netPercentage,
    scenarios,
  };
}

// ============================================================
// 7. אופציות / RSU — סעיף 102 פקודת מס הכנסה
// ============================================================

export type Section102Track = 'capital' | 'ordinary';

export interface StockOption102Input {
  /** מספר אופציות / RSU */
  numberOfUnits: number;
  /** מחיר מימוש (₪ ליחידה) — 0 לRSU */
  exercisePrice: number;
  /** מחיר שוק בעת מימוש / רכישה (₪ ליחידה) */
  marketPriceAtExercise: number;
  /** מחיר שוק בעת מכירה (₪ ליחידה) — לחישוב רווח הון לאחר מכן */
  marketPriceAtSale?: number;
  /** מסלול מס */
  track: Section102Track;
  /** שנות וסטינג */
  vestingYears: number;
  /** % וסטינג שהושלם */
  vestedPercentage: number;
  /** נקודות זיכוי (למסלול רגיל) */
  creditPoints?: number;
  /** הכנסה שנתית אחרת (₪) — למסלול רגיל */
  otherAnnualIncome?: number;
  /** שנת מס */
  taxYear?: TaxYear;
}

export interface VestingScheduleEntry {
  year: number;
  vestedUnits: number;
  cumulativeVested: number;
  cumulativeVestedPct: number;
}

export interface StockOption102Result {
  numberOfUnits: number;
  vestedUnits: number;
  exercisePrice: number;
  marketPriceAtExercise: number;
  totalGrossValue: number;
  gainAtExercise: number;
  track: Section102Track;
  trackLabel: string;
  taxOnGain: number;
  taxRate: number;
  netGain: number;
  netPercentage: number;
  /** רווח הון אחרי מכירה (אם market price at sale > exercise price) */
  additionalCapitalGain?: number;
  additionalTaxOnSale?: number;
  netFromSale?: number;
  vestingSchedule: VestingScheduleEntry[];
  keyRules: string[];
  warnings: string[];
}

export function calculateStockOption102(input: StockOption102Input): StockOption102Result {
  const year = input.taxYear ?? '2026';
  const totalUnits = Math.max(0, input.numberOfUnits);
  const vestedPct = Math.max(0, Math.min(100, input.vestedPercentage)) / 100;
  const vestedUnits = Math.round(totalUnits * vestedPct);
  const exercisePrice = Math.max(0, input.exercisePrice);
  const marketPrice = Math.max(0, input.marketPriceAtExercise);

  const totalGrossValue = vestedUnits * marketPrice;
  const gainAtExercise = vestedUnits * Math.max(0, marketPrice - exercisePrice);

  let taxOnGain: number;
  let taxRate: number;
  let trackLabel: string;

  if (input.track === 'capital') {
    // מסלול הוני: 25% מס רווחי הון (+ 3% מס יסף אם מעל 721,560)
    taxRate = 0.25;
    taxOnGain = gainAtExercise * taxRate;
    trackLabel = 'מסלול הוני (25%) — סעיף 102(ב)(2)';
  } else {
    // מסלול רגיל: הכנסת עבודה — מס שולי
    const otherIncome = Math.max(0, input.otherAnnualIncome ?? 0);
    const creditPoints = input.creditPoints ?? 2.25;
    const taxBefore = calcAnnualTax(otherIncome, creditPoints, year);
    const taxAfter = calcAnnualTax(otherIncome + gainAtExercise, creditPoints, year);
    taxOnGain = Math.max(0, taxAfter - taxBefore);
    taxRate = gainAtExercise > 0 ? taxOnGain / gainAtExercise : 0;
    trackLabel = `מסלול רגיל (הכנסת עבודה) — מס שולי ${Math.round(taxRate * 100)}%`;
  }

  const netGain = Math.max(0, gainAtExercise - taxOnGain);
  const netPercentage = gainAtExercise > 0 ? (netGain / gainAtExercise) * 100 : 0;

  // רווח הון נוסף אחרי מכירה (שלב ב')
  let additionalCapitalGain: number | undefined;
  let additionalTaxOnSale: number | undefined;
  let netFromSale: number | undefined;

  if (input.marketPriceAtSale !== undefined) {
    const salePrice = Math.max(0, input.marketPriceAtSale);
    additionalCapitalGain = vestedUnits * Math.max(0, salePrice - marketPrice);
    additionalTaxOnSale = additionalCapitalGain * 0.25; // רווח הון 25%
    netFromSale = Math.max(0, additionalCapitalGain - additionalTaxOnSale);
  }

  // לוח וסטינג (cliff אחרי שנה 1, ואז רבעוני — מודל נפוץ בהייטק)
  const vestingYears = Math.max(1, input.vestingYears);
  const vestingSchedule: VestingScheduleEntry[] = [];
  // cliff: 25% בתום שנה 1, אחר כך שווה בכל שנה
  let cumulative = 0;
  for (let y = 1; y <= vestingYears; y++) {
    const yearPct = 1 / vestingYears;
    const yearUnits = Math.round(totalUnits * yearPct);
    cumulative += yearUnits;
    vestingSchedule.push({
      year: y,
      vestedUnits: yearUnits,
      cumulativeVested: Math.min(cumulative, totalUnits),
      cumulativeVestedPct: Math.round((Math.min(cumulative, totalUnits) / totalUnits) * 100),
    });
  }

  const keyRules = [
    'מסלול הוני (102ב2): מחייב החזקה של 24 חודשים לפחות מהקצאה (Lock-up)',
    'מסלול רגיל: אין חובת Lock-up, אך מס גבוה יותר',
    'RSU (יחידות מגבלות): מחיר מימוש = 0, כל הרווח הוא הכנסת עבודה / רווח הון',
    'מס יסף 3%: חל על הכנסה / רווח הוני מעל 721,560 ₪ שנתי',
    'הנאמן (Trustee): בחברה ציבורית, המניות מוחזקות דרך נאמן לצורך זכאות למסלול הוני',
  ];

  const warnings: string[] = [];
  if (input.track === 'capital' && input.vestedPercentage < 100) {
    warnings.push('בדוק שחלפו 24 חודשים מההקצאה לפני מימוש — אחרת תמוסה כהכנסת עבודה!');
  }
  if (marketPrice < exercisePrice) {
    warnings.push('מחיר שוק נמוך ממחיר מימוש — האופציות "מתחת למים" (Underwater), אין רווח.');
  }
  if (gainAtExercise > 300_000) {
    warnings.push('רווח גבוה — שקול ייעוץ מס לפני מימוש; ייתכן מס יסף 3% נוסף.');
  }

  return {
    numberOfUnits: totalUnits,
    vestedUnits,
    exercisePrice,
    marketPriceAtExercise: marketPrice,
    totalGrossValue,
    gainAtExercise,
    track: input.track,
    trackLabel,
    taxOnGain,
    taxRate,
    netGain,
    netPercentage,
    additionalCapitalGain,
    additionalTaxOnSale,
    netFromSale,
    vestingSchedule,
    keyRules,
    warnings,
  };
}

// ============================================================
// 8. השוואת שנים — 2024/2025/2026
// ============================================================

export interface YearComparisonBonusInput {
  grossBonus: number;
  monthlyBaseSalary: number;
  creditPoints: number;
}

export interface YearComparisonBonusResult {
  year: TaxYear;
  netBonus: number;
  taxOnBonus: number;
  marginalRate: number;
  netPercentage: number;
}

export function compareYears(input: YearComparisonBonusInput): YearComparisonBonusResult[] {
  const years: TaxYear[] = ['2024', '2025', '2026'];
  return years.map((year) => {
    const result = calculateBonusNet({
      grossBonus: input.grossBonus,
      monthlyBaseSalary: input.monthlyBaseSalary,
      creditPoints: input.creditPoints,
      taxYear: year,
    });
    return {
      year,
      netBonus: result.netBonus,
      taxOnBonus: result.incomeTaxOnBonus,
      marginalRate: result.effectiveMarginalRate,
      netPercentage: result.netPercentage,
    };
  });
}

// ============================================================
// 9. חישוב נטו לפי גדלי בונוס — לגרף
// ============================================================

export interface BonusCurvePoint {
  grossBonus: number;
  netBonus: number;
  netPercentage: number;
  effectiveMarginalRate: number;
}

export function calculateBonusCurve(
  monthlyBaseSalary: number,
  creditPoints: number,
  maxBonus: number = 200_000,
  steps: number = 20,
): BonusCurvePoint[] {
  const stepSize = maxBonus / steps;
  const points: BonusCurvePoint[] = [];
  for (let i = 1; i <= steps; i++) {
    const grossBonus = Math.round(stepSize * i);
    const result = calculateBonusNet({
      grossBonus,
      monthlyBaseSalary,
      creditPoints,
    });
    points.push({
      grossBonus,
      netBonus: result.netBonus,
      netPercentage: result.netPercentage,
      effectiveMarginalRate: result.effectiveMarginalRate,
    });
  }
  return points;
}
