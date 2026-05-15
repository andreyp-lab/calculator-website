/**
 * מחשבון ביטוח לאומי + דמי בריאות לעצמאי - ישראל 2026
 *
 * מקיף:
 * - שיטת שתי המדרגות (מופחת / מלא)
 * - השוואה לשכיר
 * - הטבת מס (52% הוצאה מוכרת)
 * - תיאום שנתי (החזר / תשלום)
 * - תחזית זכאות פנסיה
 * - חישוב עבודה משולבת (גם שכיר + גם עצמאי)
 *
 * מקורות:
 * - ביטוח לאומי: https://www.btl.gov.il
 * - כל-זכות: https://www.kolzchut.org.il
 * - רשות המסים: https://www.gov.il/he/departments/israel_tax_authority
 *
 * אומת: מאי 2026
 */

import {
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
  SOCIAL_SECURITY_EMPLOYEE_2026,
} from '@/lib/constants/tax-2026';

// ============================================================
// קבועים
// ============================================================

export const BL_SE_RATES_2026 = {
  /** תקרה מופחת (60% שכר ממוצע) */
  reducedThreshold: 7_522,
  /** תקרה מקסימלית */
  fullThreshold: 51_910,
  /** שיעורים מופחתים */
  reducedRate: {
    bl: SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.nationalInsurance, // 2.87%
    health: SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.healthInsurance, // 3.23%
    total: SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.total, // 6.10%
  },
  /** שיעורים מלאים */
  fullRate: {
    bl: SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.nationalInsurance, // 12.83%
    health: SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.healthInsurance, // 5.17%
    total: SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.total, // 18.00%
  },
  /** חלק מוכר כהוצאה לעצמאי */
  deductiblePercent: 0.52,
  /** תשלום מינימום חודשי (גם בהכנסה 0) */
  minimumMonthlyPayment: 184,
  /** ריבית פיגורים חודשית (ב.ל.) */
  lateInterestMonthly: 0.015,
} as const;

// ============================================================
// טיפוסים
// ============================================================

export type PaymentFrequency = 'monthly' | 'quarterly';

export interface BLInput {
  /** הכנסה חייבת חודשית (לאחר הוצאות מוכרות) */
  monthlyIncome: number;
  /** תדירות תשלום */
  paymentFrequency: PaymentFrequency;
  /** גיל */
  age: number;
  /** עובד גם כשכיר? */
  hasOtherEmployment?: boolean;
  /** הכנסה חודשית מעסקת שכיר (לצורך תיאום) */
  otherEmploymentIncome?: number;
  /** שנות תשלום לב.ל. (לתחזית פנסיה) */
  yearsContributing?: number;
  /** גיל פרישה צפוי */
  expectedRetirementAge?: number;
}

export interface BLTierBreakdown {
  /** חלק הכנסה בשיעור מופחת (עד 7,522) */
  reducedTierIncome: number;
  /** סכום ב.ל. על החלק המופחת */
  reducedTierBL: number;
  /** סכום בריאות על החלק המופחת */
  reducedTierHealth: number;
  /** סכום כולל על החלק המופחת */
  reducedTierTotal: number;
  /** חלק הכנסה בשיעור מלא (7,523-51,910) */
  fullTierIncome: number;
  /** סכום ב.ל. על החלק המלא */
  fullTierBL: number;
  /** סכום בריאות על החלק המלא */
  fullTierHealth: number;
  /** סכום כולל על החלק המלא */
  fullTierTotal: number;
  /** חלק הכנסה מעל התקרה (0%) */
  exemptIncome: number;
}

export interface BLComparisonToEmployee {
  /** ב.ל. חודשי של שכיר באותה הכנסה */
  employeeMonthly: number;
  /** ב.ל. שנתי של שכיר */
  employeeAnnual: number;
  /** הפרש חודשי (עצמאי יקר יותר) */
  differenceMonthly: number;
  /** הפרש שנתי */
  differenceAnnual: number;
  /** הפרש כאחוז מהכנסה */
  differencePercent: number;
  /** הסבר: מדוע עצמאי משלם יותר */
  explanation: string;
}

export interface PensionProjection {
  /** שנות תרומה עתידיות נותרות */
  yearsRemaining: number;
  /** תשלום חודשי ממוצע לב.ל. */
  avgMonthlyContribution: number;
  /** הערכת קצבה חודשית (מאוד גסה - רק לצורך אינדיקציה) */
  estimatedMonthlyPension: number;
  /** גיל זכאות לקצבת זקנה */
  retirementAge: number;
  /** האם עומד בדרישת שנות ביטוח מינימלית */
  meetsMinimumYears: boolean;
  /** שנות ביטוח מינימום לזכאות */
  minimumYearsRequired: number;
}

export interface AnnualReconciliation {
  /** הכנסה שנתית שהוצהרה/הוערכה */
  estimatedAnnualIncome: number;
  /** ב.ל. ששולם לפי ההערכה */
  paidBL: number;
  /** הכנסה שנתית בפועל */
  actualAnnualIncome: number;
  /** ב.ל. אמיתי לפי הכנסה בפועל */
  actualBL: number;
  /** הפרש: + = לשלם, - = החזר */
  difference: number;
  /** סוג הסדרה */
  refundOrPayment: 'refund' | 'payment' | 'balanced';
  /** ריבית פיגורים אם תשלום יאוחר ב-3 חודשים */
  interestIfLate3Months: number;
  /** המלצה */
  recommendation: string;
}

export interface BLResult {
  // --- חודשי ---
  monthlyTotal: number;
  monthlyBL: number;
  monthlyHealth: number;
  // --- שנתי ---
  annualTotal: number;
  annualBL: number;
  annualHealth: number;
  // --- פירוט מדרגות ---
  tierBreakdown: BLTierBreakdown;
  // --- אחוז אפקטיבי ---
  effectiveRate: number;
  // --- הטבת מס ---
  taxDeductibleAmount: number; // 52% מהסכום השנתי
  /** חסכון במס (לפי שיעור מס שולי שניתן) */
  taxSavingAmount: number;
  netCostAfterTax: number;
  // --- לוח תשלומים ---
  paymentPerInstallment: number;
  installmentsPerYear: number;
  installmentMonths: string[]; // שמות החודשים לתשלום
  // --- השוואה לשכיר ---
  comparisonToEmployee: BLComparisonToEmployee;
  // --- המלצות ---
  recommendations: string[];
  // --- האם מינימום ---
  isMinimumApplied: boolean;
}

// ============================================================
// פונקציות חישוב בסיסיות
// ============================================================

/**
 * חישוב ב.ל. + בריאות לפי מדרגות על הכנסה חודשית
 */
export function calculateBLByTier(monthlyIncome: number): {
  reduced: { income: number; bl: number; health: number; total: number };
  full: { income: number; bl: number; health: number; total: number };
  exempt: { income: number };
  monthlyTotal: number;
  monthlyBL: number;
  monthlyHealth: number;
} {
  const income = Math.max(0, monthlyIncome);
  const { reducedThreshold, fullThreshold, reducedRate, fullRate } = BL_SE_RATES_2026;

  // חלק מדרגה מופחת: עד 7,522
  const reducedIncome = Math.min(income, reducedThreshold);
  const reducedBL = reducedIncome * reducedRate.bl;
  const reducedHealth = reducedIncome * reducedRate.health;
  const reducedTotal = reducedIncome * reducedRate.total;

  // חלק מדרגה מלאה: 7,522 - 51,910
  const fullIncome = Math.max(0, Math.min(income, fullThreshold) - reducedThreshold);
  const fullBL = fullIncome * fullRate.bl;
  const fullHealth = fullIncome * fullRate.health;
  const fullTotal = fullIncome * fullRate.total;

  // חלק פטור: מעל 51,910
  const exemptIncome = Math.max(0, income - fullThreshold);

  const monthlyBL = reducedBL + fullBL;
  const monthlyHealth = reducedHealth + fullHealth;
  const monthlyTotal = reducedTotal + fullTotal;

  return {
    reduced: { income: reducedIncome, bl: reducedBL, health: reducedHealth, total: reducedTotal },
    full: { income: fullIncome, bl: fullBL, health: fullHealth, total: fullTotal },
    exempt: { income: exemptIncome },
    monthlyTotal,
    monthlyBL,
    monthlyHealth,
  };
}

/**
 * חישוב ב.ל. לשכיר - לצורך השוואה
 */
export function calculateEmployeeBL(monthlyIncome: number): number {
  const income = Math.max(0, monthlyIncome);
  const cap = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const threshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const cappedIncome = Math.min(income, cap);

  const reducedPart = Math.min(cappedIncome, threshold);
  const fullPart = Math.max(0, cappedIncome - threshold);

  return (
    reducedPart * SOCIAL_SECURITY_EMPLOYEE_2026.reducedRate.total +
    fullPart * SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total
  );
}

/**
 * חישוב מינימום ב.ל. (לאפס הכנסה)
 */
export function calculateMinimumBL(): number {
  return BL_SE_RATES_2026.minimumMonthlyPayment;
}

/**
 * תחזית קצבת זקנה (הערכה גסה בלבד - לא תחליף לחישוב רשמי)
 * ב.ל. מחשב קצבה לפי "נקודות ביטוח" - כאן מתבצע אומדן פשוט
 */
export function projectPensionEntitlement(
  yearsContributing: number,
  avgMonthlyContribution: number,
): PensionProjection {
  const minimumYearsRequired = 5;
  const meetsMinimumYears = yearsContributing >= minimumYearsRequired;

  // אומדן גס: קצבת זקנה בסיסית + תוספת לפי שנות ביטוח
  // קצבת בסיס (2026): ~1,772 ₪/חודש
  // תוספת לכל שנת ביטוח: ~80 ₪ (אומדן)
  const baseMonthlyPension = 1_772;
  const additionPerYear = 80;
  const estimatedMonthlyPension = meetsMinimumYears
    ? Math.min(baseMonthlyPension + yearsContributing * additionPerYear, 6_000)
    : 0;

  return {
    yearsRemaining: Math.max(0, 45 - yearsContributing), // הערכה ל-45 שנות עבודה
    avgMonthlyContribution,
    estimatedMonthlyPension,
    retirementAge: 67, // גיל פרישה לגברים (לנשים: 65)
    meetsMinimumYears,
    minimumYearsRequired,
  };
}

/**
 * חישוב תיאום שנתי - הפרש בין הוערך לבפועל
 */
export function calculateAnnualReconciliation(
  estimatedMonthlyIncome: number,
  actualMonthlyIncome: number,
): AnnualReconciliation {
  const estimatedAnnualIncome = estimatedMonthlyIncome * 12;
  const actualAnnualIncome = actualMonthlyIncome * 12;

  const estimatedResult = calculateBLByTier(estimatedMonthlyIncome);
  const actualResult = calculateBLByTier(actualMonthlyIncome);

  const paidBL = estimatedResult.monthlyTotal * 12;
  const actualBL = actualResult.monthlyTotal * 12;
  const difference = actualBL - paidBL;

  const refundOrPayment: 'refund' | 'payment' | 'balanced' =
    difference > 50 ? 'payment' : difference < -50 ? 'refund' : 'balanced';

  // ריבית על הפרש לתשלום אם מאוחר ב-3 חודשים
  const interestIfLate3Months =
    difference > 0 ? difference * BL_SE_RATES_2026.lateInterestMonthly * 3 : 0;

  let recommendation = '';
  if (refundOrPayment === 'payment') {
    recommendation = `יש לשלם הפרש של ${Math.round(difference).toLocaleString('he-IL')} ₪ לב.ל. עד מרץ. עיכוב יגרור ריבית פיגורים.`;
  } else if (refundOrPayment === 'refund') {
    recommendation = `מגיע לך החזר של ${Math.round(-difference).toLocaleString('he-IL')} ₪ מב.ל. - יש להגיש טופס 1300 לקבלת ההחזר.`;
  } else {
    recommendation = 'המקדמות ששולמו תואמות את ההכנסה בפועל. אין צורך בפעולה.';
  }

  return {
    estimatedAnnualIncome,
    paidBL,
    actualAnnualIncome,
    actualBL,
    difference,
    refundOrPayment,
    interestIfLate3Months,
    recommendation,
  };
}

/**
 * חישוב ב.ל. לעצמאי שעובד גם כשכיר
 * (ב.ל. מחושב על הכנסה משני המקורות יחד, אך מנוכה מה שנגבה כבר מהשכר)
 */
export function calculateBLWithOtherEmployment(
  seMonthlyIncome: number,
  employmentMonthlyIncome: number,
): {
  selfEmployedBL: number;
  employeePortionAlreadyPaid: number;
  netAdditionalBL: number;
  note: string;
} {
  // ב.ל. על ה-SE בלבד
  const seBL = calculateBLByTier(seMonthlyIncome);

  // ב.ל. שכבר שולם כשכיר (מנוכה ממשכורת)
  const employeeAlreadyPaid = calculateEmployeeBL(employmentMonthlyIncome);

  // במקרה של כפל עיסוקים - ב.ל. נחשב לפי הכנסה כוללת אך לרוב נגבה בנפרד
  // לצורך חישוב זה נציג את שני החלקים
  const netAdditionalBL = Math.max(0, seBL.monthlyTotal - employeeAlreadyPaid * 0.1);

  return {
    selfEmployedBL: seBL.monthlyTotal,
    employeePortionAlreadyPaid: employeeAlreadyPaid,
    netAdditionalBL,
    note: 'במקרה של עיסוק משולב, מומלץ לפנות לב.ל. לתיאום - ייתכן שישנה חפיפה בתשלומים.',
  };
}

// ============================================================
// פונקציית חישוב ראשית
// ============================================================

/**
 * חישוב מלא של ביטוח לאומי + בריאות לעצמאי
 */
export function calculateBituachLeumiSelfEmployed(
  input: BLInput,
  marginalTaxRate: number = 0.31,
): BLResult {
  const { monthlyIncome, paymentFrequency, age } = input;
  const safeIncome = Math.max(0, monthlyIncome);

  // --- חישוב מדרגות ---
  const tiers = calculateBLByTier(safeIncome);

  // --- חישוב חודשי ---
  let monthlyTotal = tiers.monthlyTotal;
  const isMinimumApplied = monthlyTotal < BL_SE_RATES_2026.minimumMonthlyPayment && safeIncome > 0;
  if (isMinimumApplied) {
    monthlyTotal = BL_SE_RATES_2026.minimumMonthlyPayment;
  }
  // הכנסה 0 - תשלום מינימום
  const noIncome = safeIncome === 0;
  const effectiveMonthly = noIncome ? BL_SE_RATES_2026.minimumMonthlyPayment : monthlyTotal;

  const monthlyBL = noIncome
    ? BL_SE_RATES_2026.minimumMonthlyPayment * 0.47
    : tiers.monthlyBL;
  const monthlyHealth = noIncome
    ? BL_SE_RATES_2026.minimumMonthlyPayment * 0.53
    : tiers.monthlyHealth;

  // --- שנתי ---
  const annualTotal = effectiveMonthly * 12;
  const annualBL = monthlyBL * 12;
  const annualHealth = monthlyHealth * 12;

  // --- שיעור אפקטיבי ---
  const effectiveRate = safeIncome > 0 ? effectiveMonthly / safeIncome : 0;

  // --- הטבת מס ---
  const taxDeductibleAmount = annualTotal * BL_SE_RATES_2026.deductiblePercent;
  const taxSavingAmount = taxDeductibleAmount * marginalTaxRate;
  const netCostAfterTax = annualTotal - taxSavingAmount;

  // --- לוח תשלומים ---
  const installmentsPerYear = paymentFrequency === 'monthly' ? 12 : 4;
  const paymentPerInstallment = annualTotal / installmentsPerYear;
  const installmentMonths =
    paymentFrequency === 'quarterly'
      ? ['מרץ', 'יוני', 'ספטמבר', 'דצמבר']
      : ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  // --- השוואה לשכיר ---
  const employeeMonthly = calculateEmployeeBL(safeIncome);
  const employeeAnnual = employeeMonthly * 12;
  const differenceMonthly = effectiveMonthly - employeeMonthly;
  const differenceAnnual = annualTotal - employeeAnnual;
  const differencePercent = safeIncome > 0 ? differenceMonthly / safeIncome : 0;

  const comparisonToEmployee: BLComparisonToEmployee = {
    employeeMonthly,
    employeeAnnual,
    differenceMonthly,
    differenceAnnual,
    differencePercent,
    explanation:
      'עצמאי משלם הן את חלק העובד והן את חלק המעסיק (משולב בשיעור אחד גבוה יותר), ולכן תשלומיו גבוהים משמעותית מאלו של שכיר.',
  };

  // --- פירוט מדרגות ---
  const tierBreakdown: BLTierBreakdown = {
    reducedTierIncome: tiers.reduced.income,
    reducedTierBL: tiers.reduced.bl,
    reducedTierHealth: tiers.reduced.health,
    reducedTierTotal: tiers.reduced.total,
    fullTierIncome: tiers.full.income,
    fullTierBL: tiers.full.bl,
    fullTierHealth: tiers.full.health,
    fullTierTotal: tiers.full.total,
    exemptIncome: tiers.exempt.income,
  };

  // --- המלצות ---
  const recommendations: string[] = [];

  if (safeIncome < BL_SE_RATES_2026.reducedThreshold) {
    recommendations.push(
      `ההכנסה שלך נמוכה מ-${BL_SE_RATES_2026.reducedThreshold.toLocaleString('he-IL')} ₪/חודש - אתה משלם רק בשיעור המופחת (6.10%).`,
    );
  }

  if (safeIncome > BL_SE_RATES_2026.fullThreshold * 0.8 && safeIncome < BL_SE_RATES_2026.fullThreshold) {
    recommendations.push(
      `אתה מתקרב לתקרה של ${BL_SE_RATES_2026.fullThreshold.toLocaleString('he-IL')} ₪ - הכנסה מעל התקרה פטורה מב.ל.`,
    );
  }

  if (safeIncome > BL_SE_RATES_2026.fullThreshold) {
    recommendations.push(
      `ההכנסה שלך מעל התקרה (${BL_SE_RATES_2026.fullThreshold.toLocaleString('he-IL')} ₪/חודש) - הב.ל. מחושב רק עד התקרה. ${Math.round(tiers.exempt.income).toLocaleString('he-IL')} ₪ פטורים.`,
    );
  }

  const annualTaxSaving = taxSavingAmount;
  if (annualTaxSaving > 500) {
    recommendations.push(
      `חסכון מס שנתי מהטבת ה-52%: ${Math.round(annualTaxSaving).toLocaleString('he-IL')} ₪ - עלות אפקטיבית של הב.ל. היא ${Math.round(netCostAfterTax).toLocaleString('he-IL')} ₪ בשנה.`,
    );
  }

  if (paymentFrequency === 'quarterly') {
    recommendations.push(
      `תשלום רבעוני: ${Math.round(paymentPerInstallment).toLocaleString('he-IL')} ₪ בחודשי מרץ/יוני/ספטמבר/דצמבר. הפרש כסף בחשבון עד מועד התשלום.`,
    );
  } else {
    recommendations.push(
      `תשלום חודשי: ${Math.round(paymentPerInstallment).toLocaleString('he-IL')} ₪/חודש - תשלום חודשי מפחית "הלם" תזרימי בעת התשלום.`,
    );
  }

  if (input.hasOtherEmployment) {
    recommendations.push(
      'יש לך עסקת כפל עיסוקים - פנה לב.ל. לתיאום תשלומים. ייתכן חיוב כפול שניתן להימנע ממנו.',
    );
  }

  if (age >= 60) {
    recommendations.push(
      'בגיל 60+ שווה לבדוק זכאות לקצבת אזרח ותיק ולהבין את ההשפעה של שנות הביטוח הצבורות.',
    );
  }

  if (safeIncome === 0) {
    recommendations.push(
      `גם ללא הכנסה, עצמאי משלם מינימום ${BL_SE_RATES_2026.minimumMonthlyPayment} ₪/חודש כדי לשמור על זכויות (מילואים, פציעת עבודה, לידה).`,
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('המצב שלך תקין - המשך לשלם מקדמות ב.ל. בזמן.');
  }

  return {
    monthlyTotal: effectiveMonthly,
    monthlyBL,
    monthlyHealth,
    annualTotal,
    annualBL,
    annualHealth,
    tierBreakdown,
    effectiveRate,
    taxDeductibleAmount,
    taxSavingAmount,
    netCostAfterTax,
    paymentPerInstallment,
    installmentsPerYear,
    installmentMonths,
    comparisonToEmployee,
    recommendations,
    isMinimumApplied,
  };
}
