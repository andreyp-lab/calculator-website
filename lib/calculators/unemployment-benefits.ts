/**
 * מחשבון דמי אבטלה - ביטוח לאומי 2026
 *
 * זכאות:
 * - עובד שכיר שאיבד את עבודתו
 * - גיל 20-67 (גיל פרישה)
 * - 12 חודשי תשלומים ל-ב.ל. ב-18 חודשים אחרונים
 *   (בעלי משפחה: 9 חודשים ב-12 חודשים אחרונים)
 * - פוטר (לא התפטר — אלא אם הגשת מוצדקת)
 * - רשום בשירות התעסוקה
 *
 * חישוב שיעורים (לפי יחס שכר לשכר ממוצע במשק):
 * - עד 60% מהשכר הממוצע: 80% מהשכר
 * - 60-80%: 60%
 * - מעל 80%: 50%
 *
 * תקרות יומיות (2026):
 * - ימים 1-125: 550.76 ₪/יום
 * - יום 126 ואילך: 367.17 ₪/יום (2/3 מהתקרה)
 *
 * תקופת זכאות לפי גיל:
 * - 20-25 ללא ילדים: 50 ימים
 * - 20-25 עם ילדים / 25-28: 100 ימים
 * - 28-35: 138 ימים
 * - 35-45 עם ילדים / 45+: 175 ימים
 * - 35-45 ללא ילדים: 138 ימים
 *
 * תקופת המתנה: 5 ימים (לאחריהם מתחיל התשלום)
 * תקופת המתנה אחרי התפטרות מרצון: 90 ימים
 *
 * מקור: btl.gov.il, עדכון 2026-05-15
 */

// ============================================================
// קבועים
// ============================================================

/** שכר ממוצע במשק 2026 (₪/חודש) */
export const AVERAGE_NATIONAL_WAGE_2026 = 13_769;

/** תקרה יומית — ימים 1-125 (₪) */
export const DAILY_CAP_FIRST_125 = 550.76;

/** תקרה יומית — מיום 126 ואילך (₪) */
export const DAILY_CAP_AFTER_125 = 367.17;

/** ימי המתנה לאחר פיטורים */
export const WAITING_DAYS_DISMISSAL = 5;

/** ימי המתנה לאחר התפטרות (ללא עילה) */
export const WAITING_DAYS_RESIGNATION = 90;

/** ימי תשלום עד לתקרה מופחתת */
export const FULL_RATE_DAYS = 125;

/** מספר חודשים לתקופת הפניה (בדיקת ותק) */
export const LOOKBACK_MONTHS = 18;

/** מינימום חודשי תשלום ב-18 חודשים לזכאות רגילה */
export const MIN_MONTHS_REGULAR = 12;

/** מינימום חודשי תשלום ב-12 חודשים לזכאות בעלי משפחה */
export const MIN_MONTHS_FAMILY = 9;

/** גיל פרישה (גברים) */
export const RETIREMENT_AGE = 67;

/** גיל מינימלי לזכאות */
export const MIN_AGE = 20;

/** יחס לסיווג שכר נמוך (עד 60%) */
export const BRACKET_LOW_RATIO = 0.6;

/** יחס לסיווג שכר בינוני (60%-80%) */
export const BRACKET_MID_RATIO = 0.8;

/** שיעור תשלום לשכר נמוך (עד 60%) */
export const RATE_LOW = 0.8;

/** שיעור תשלום לשכר בינוני (60%-80%) */
export const RATE_MID = 0.6;

/** שיעור תשלום לשכר גבוה (80%+) */
export const RATE_HIGH = 0.5;

/** ימי עבודה מקובלים בחודש לחישוב שכר יומי */
export const WORK_DAYS_PER_MONTH = 30;

/** שנים לשמירת ימי זכאות עבור אבטלה חוזרת */
export const REUSE_YEARS = 4;

// ============================================================
// Types
// ============================================================

export type ResignationReason =
  | 'none'
  | 'qualified_spouse_relocation'
  | 'qualified_health'
  | 'qualified_working_conditions'
  | 'qualified_contract_end'
  | 'qualified_harassment';

export type AgeGroup = 'under25' | '25to28' | '28to35' | '35to45' | 'above45';

export interface UnemploymentEligibilityInput {
  /** גיל המבקש */
  age: number;
  /** האם יש ילדים מתחת לגיל 18 */
  hasChildren: boolean;
  /** האם הפסקת עבודה הייתה פיטורים (false = התפטרות) */
  wasDismissed: boolean;
  /** סיבת התפטרות (אם רלוונטי) */
  resignationReason?: ResignationReason;
  /** חודשי תשלומים ל-ב.ל. ב-18 חודשים אחרונים */
  insuredMonthsIn18: number;
  /** האם זה מקרה אבטלה חוזרת (תוך 4 שנים) */
  isPriorClaim?: boolean;
  /** ימי זכאות שנשארו מתביעה קודמת */
  remainingDaysFromPrior?: number;
}

export interface UnemploymentPayInput {
  /** שכר ברוטו ממוצע ב-6 חודשים אחרונים (₪/חודש) */
  averageMonthlySalary: number;
  /** גיל */
  age: number;
  /** האם יש ילדים מתחת לגיל 18 */
  hasChildren: boolean;
}

export interface UnemploymentWorkIncomeInput {
  /** שכר ברוטו ממוצע ב-6 חודשים אחרונים */
  averageMonthlySalary: number;
  /** הכנסה מעבודה חלקית במהלך האבטלה (₪/חודש) */
  partTimeIncome: number;
  /** אחוז משרה בעבודה החלקית */
  partTimePercent: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  waitingDays: number;
  ageGroup: AgeGroup;
  maxEntitlementDays: number;
  notes: string[];
}

export interface PayCalculationResult {
  dailySalary: number;
  wageRatio: number;
  bracket: string;
  benefitRate: number;
  dailyBenefitFirst125: number;
  dailyBenefitAfter125: number;
  monthlyEquivalentFirst125: number;
  monthlyEquivalentAfter125: number;
  maxDays: number;
  first125Days: number;
  remainingDays: number;
  totalFirst125: number;
  totalAfter125: number;
  totalGross: number;
  isCapped: boolean;
  capNote?: string;
  recommendations: string[];
}

export interface WorkIncomeResult {
  isEntitledToPartialBenefit: boolean;
  partialDailyBenefit: number;
  reduction: number;
  explanation: string;
}

export interface PaymentScheduleItem {
  weekNumber: number;
  label: string;
  dailyRate: number;
  daysInPeriod: number;
  periodPayment: number;
  cumulativePayment: number;
}

// ============================================================
// Core helpers
// ============================================================

function getAgeGroup(age: number): AgeGroup {
  if (age < 25) return 'under25';
  if (age < 28) return '25to28';
  if (age < 35) return '28to35';
  if (age < 45) return '35to45';
  return 'above45';
}

/**
 * מחשב את תקופת הזכאות המרבית לפי גיל ומצב משפחתי
 */
export function calculateMaxDays(age: number, hasChildren: boolean): number {
  const group = getAgeGroup(age);
  switch (group) {
    case 'under25':
      return hasChildren ? 100 : 50;
    case '25to28':
      return 100;
    case '28to35':
      return 138;
    case '35to45':
      return hasChildren ? 175 : 138;
    case 'above45':
      return 175;
  }
}

/**
 * קובע את שיעור דמי האבטלה לפי יחס השכר לממוצע הארצי
 */
export function calculateBenefitRate(
  averageMonthlySalary: number,
  nationalAverage: number = AVERAGE_NATIONAL_WAGE_2026,
): { rate: number; bracket: string; wageRatio: number } {
  const wageRatio = averageMonthlySalary / nationalAverage;

  if (wageRatio <= BRACKET_LOW_RATIO) {
    return {
      rate: RATE_LOW,
      bracket: `עד 60% מהשכר הממוצע (עד ${Math.round(nationalAverage * BRACKET_LOW_RATIO).toLocaleString('he-IL')} ₪)`,
      wageRatio,
    };
  }
  if (wageRatio <= BRACKET_MID_RATIO) {
    return {
      rate: RATE_MID,
      bracket: `60-80% מהשכר הממוצע (${Math.round(nationalAverage * BRACKET_LOW_RATIO).toLocaleString('he-IL')}–${Math.round(nationalAverage * BRACKET_MID_RATIO).toLocaleString('he-IL')} ₪)`,
      wageRatio,
    };
  }
  return {
    rate: RATE_HIGH,
    bracket: `מעל 80% מהשכר הממוצע (מעל ${Math.round(nationalAverage * BRACKET_MID_RATIO).toLocaleString('he-IL')} ₪)`,
    wageRatio,
  };
}

// ============================================================
// Main calculation functions
// ============================================================

/**
 * בדיקת זכאות מקיפה לדמי אבטלה
 */
export function calculateEligibility(input: UnemploymentEligibilityInput): EligibilityResult {
  const reasons: string[] = [];
  const notes: string[] = [];

  // בדיקת גיל
  const ageOk = input.age >= MIN_AGE && input.age < RETIREMENT_AGE;
  if (!ageOk) {
    if (input.age < MIN_AGE)
      reasons.push(`גיל ${input.age} נמוך מגיל המינימום (${MIN_AGE})`);
    else
      reasons.push(`גיל ${input.age} מעל גיל הפרישה (${RETIREMENT_AGE})`);
  }

  // בדיקת ותק ביטוחי
  // בעלי ילדים / בני זוג: 9 חודשים ב-12 האחרונים
  const isFamily = input.hasChildren;
  const minMonths = isFamily ? MIN_MONTHS_FAMILY : MIN_MONTHS_REGULAR;
  const insuredOk = input.insuredMonthsIn18 >= minMonths;

  if (!insuredOk) {
    reasons.push(
      `לא מספיק חודשי ביטוח: נדרש ${minMonths} חודשים ב-18 האחרונים, יש ${input.insuredMonthsIn18}`,
    );
  } else {
    notes.push(
      `ותק ביטוחי: ${input.insuredMonthsIn18} חודשים מתוך ${minMonths} נדרשים — תקין`,
    );
  }

  // בדיקת סיבת הפסקה
  let waitingDays = 0;
  if (!input.wasDismissed) {
    const reason = input.resignationReason ?? 'none';
    const qualifiedReasons: ResignationReason[] = [
      'qualified_spouse_relocation',
      'qualified_health',
      'qualified_working_conditions',
      'qualified_contract_end',
      'qualified_harassment',
    ];
    if (!qualifiedReasons.includes(reason)) {
      waitingDays = WAITING_DAYS_RESIGNATION;
      notes.push(
        `התפטרות ללא עילה מוצדקת: תקופת המתנה של ${WAITING_DAYS_RESIGNATION} ימים לפני קבלת דמי אבטלה`,
      );
    } else {
      notes.push('התפטרות מסיבה מוצדקת — אין תקופת המתנה נוספת');
    }
  } else {
    waitingDays = WAITING_DAYS_DISMISSAL;
    notes.push(`פיטורים: תקופת המתנה של ${WAITING_DAYS_DISMISSAL} ימים`);
  }

  // אבטלה חוזרת
  if (input.isPriorClaim && (input.remainingDaysFromPrior ?? 0) > 0) {
    notes.push(
      `אבטלה חוזרת: נשארו ${input.remainingDaysFromPrior} ימי זכאות מתביעה קודמת שניתן לנצלם`,
    );
  }

  const ageGroup = getAgeGroup(input.age);
  const maxEntitlementDays = ageOk ? calculateMaxDays(input.age, input.hasChildren) : 0;
  const isEligible = ageOk && insuredOk;

  return {
    isEligible,
    reasons,
    waitingDays,
    ageGroup,
    maxEntitlementDays,
    notes,
  };
}

/**
 * חישוב גובה דמי האבטלה, תקופה ופירוט מלא
 */
export function calculateDailyPay(input: UnemploymentPayInput): PayCalculationResult {
  const { averageMonthlySalary, age, hasChildren } = input;
  const dailySalary = averageMonthlySalary / WORK_DAYS_PER_MONTH;
  const { rate, bracket, wageRatio } = calculateBenefitRate(averageMonthlySalary);
  const maxDays = calculateMaxDays(age, hasChildren);

  const computedDaily = dailySalary * rate;
  const dailyBenefitFirst125 = Math.min(computedDaily, DAILY_CAP_FIRST_125);
  const dailyBenefitAfter125 = Math.min(computedDaily, DAILY_CAP_AFTER_125);

  const isCapped = computedDaily > DAILY_CAP_FIRST_125;
  const capNote = isCapped
    ? `התשלום הוגבל לתקרה: ${DAILY_CAP_FIRST_125.toFixed(2)} ₪/יום (שכר מחושב: ${computedDaily.toFixed(2)} ₪/יום)`
    : undefined;

  const first125Days = Math.min(maxDays, FULL_RATE_DAYS);
  const remainingDays = Math.max(0, maxDays - FULL_RATE_DAYS);

  const totalFirst125 = first125Days * dailyBenefitFirst125;
  const totalAfter125 = remainingDays * dailyBenefitAfter125;
  const totalGross = totalFirst125 + totalAfter125;

  const monthlyEquivalentFirst125 = dailyBenefitFirst125 * WORK_DAYS_PER_MONTH;
  const monthlyEquivalentAfter125 = dailyBenefitAfter125 * WORK_DAYS_PER_MONTH;

  // המלצות
  const recommendations: string[] = [];
  if (wageRatio <= BRACKET_LOW_RATIO) {
    recommendations.push('שכרך ביחס לממוצע נמוך — אתה זכאי לשיעור גבוה של 80%, שהוא תחליף משמעותי לשכר.');
  }
  if (isCapped) {
    recommendations.push('שכרך גבוה ולכן דמי האבטלה מוגבלים לתקרה. שקול חיסכון פרטי לתקופות אבטלה.');
  }
  if (maxDays <= 100) {
    recommendations.push(
      'תקופת הזכאות שלך קצרה יחסית — כדאי להתחיל לחפש עבודה מיד ולרשום כל פעילות בשירות התעסוקה.',
    );
  }
  if (remainingDays > 0) {
    recommendations.push(
      `שים לב: מיום ${FULL_RATE_DAYS + 1} ואילך (${remainingDays} ימים) התשלום היומי יורד ל-${dailyBenefitAfter125.toFixed(2)} ₪.`,
    );
  }
  recommendations.push('דמי אבטלה חייבים במס הכנסה — ייתכן שתצטרך לשלם הפרש בסוף השנה.');

  return {
    dailySalary,
    wageRatio,
    bracket,
    benefitRate: rate,
    dailyBenefitFirst125,
    dailyBenefitAfter125,
    monthlyEquivalentFirst125,
    monthlyEquivalentAfter125,
    maxDays,
    first125Days,
    remainingDays,
    totalFirst125,
    totalAfter125,
    totalGross,
    isCapped,
    capNote,
    recommendations,
  };
}

/**
 * חישוב עבודה חלקית במהלך אבטלה
 * לפי ביטוח לאומי: אם מרוויחים מעל 50% מהשכר הממוצע — אין זכאות
 * אם פחות — זכאים להשלמה יחסית
 */
export function calculateWorkIncomeDuringUnemployment(
  input: UnemploymentWorkIncomeInput,
): WorkIncomeResult {
  const { averageMonthlySalary, partTimeIncome, partTimePercent } = input;

  // שכר ממוצע ב.ל. לחישוב סף
  const halfNationalAverage = AVERAGE_NATIONAL_WAGE_2026 * 0.5;

  // אם ההכנסה עולה על 50% מהשכר הממוצע הארצי — אין זכאות
  if (partTimeIncome >= halfNationalAverage) {
    return {
      isEntitledToPartialBenefit: false,
      partialDailyBenefit: 0,
      reduction: 0,
      explanation: `הכנסתך מעבודה (${partTimeIncome.toLocaleString('he-IL')} ₪) עולה על 50% מהשכר הממוצע (${halfNationalAverage.toLocaleString('he-IL')} ₪) — לא זכאי לדמי אבטלה בתקופה זו.`,
    };
  }

  // יחס משרה בעבודה החדשה
  const employmentRatio = Math.min(partTimePercent / 100, 1);
  // הפחתה יחסית מדמי האבטלה
  const { rate } = calculateBenefitRate(averageMonthlySalary);
  const fullDailyBenefit = Math.min(
    (averageMonthlySalary / WORK_DAYS_PER_MONTH) * rate,
    DAILY_CAP_FIRST_125,
  );

  const reduction = fullDailyBenefit * employmentRatio;
  const partialDailyBenefit = Math.max(0, fullDailyBenefit - reduction);

  return {
    isEntitledToPartialBenefit: true,
    partialDailyBenefit,
    reduction,
    explanation: `עובד ב-${partTimePercent}% משרה — דמי האבטלה מופחתים ב-${partTimePercent}%. תקבל ${partialDailyBenefit.toFixed(2)} ₪/יום (במקום ${fullDailyBenefit.toFixed(2)} ₪/יום).`,
  };
}

/**
 * בניית לוח תשלומים שבועי/דו-שבועי לתקופת האבטלה
 */
export function buildPaymentSchedule(
  dailyBenefitFirst125: number,
  dailyBenefitAfter125: number,
  maxDays: number,
  waitingDays: number = WAITING_DAYS_DISMISSAL,
): PaymentScheduleItem[] {
  const schedule: PaymentScheduleItem[] = [];
  const paidDays = Math.max(0, maxDays - waitingDays);
  const biweekly = 14;
  let cumulative = 0;
  let daysPaid = 0;
  let week = 1;

  while (daysPaid < paidDays) {
    const periodStart = daysPaid + 1;
    const periodEnd = Math.min(daysPaid + biweekly, paidDays);
    const daysInPeriod = periodEnd - daysPaid;

    // כמה ימים בתקופה זו נמצאים בתוך ה-125 הראשונים
    const daysAtFull = Math.max(0, Math.min(daysInPeriod, FULL_RATE_DAYS - daysPaid));
    const daysAtReduced = daysInPeriod - daysAtFull;

    const periodPayment =
      daysAtFull * dailyBenefitFirst125 + daysAtReduced * dailyBenefitAfter125;
    cumulative += periodPayment;

    const dailyRate = daysPaid < FULL_RATE_DAYS ? dailyBenefitFirst125 : dailyBenefitAfter125;

    schedule.push({
      weekNumber: week,
      label: `ימים ${periodStart + waitingDays}–${periodEnd + waitingDays}`,
      dailyRate,
      daysInPeriod,
      periodPayment,
      cumulativePayment: cumulative,
    });

    daysPaid += daysInPeriod;
    week++;
  }

  return schedule;
}

/**
 * חישוב מס הכנסה משוער על דמי אבטלה
 * (דמי אבטלה חייבים במס כהכנסה מעבודה)
 */
export function estimateTaxOnBenefits(
  totalBenefits: number,
  otherIncomeThisYear: number = 0,
): {
  taxableAmount: number;
  estimatedTax: number;
  effectiveTaxRate: number;
  note: string;
} {
  const totalIncome = totalBenefits + otherIncomeThisYear;
  // מדרגות מס 2026 (משוערות)
  let tax = 0;
  if (totalIncome > 698_280) {
    tax += (totalIncome - 698_280) * 0.5;
    totalIncome <= 0; // suppress lint — intentional cascade
    tax += (698_280 - 502_920) * 0.47;
    tax += (502_920 - 323_520) * 0.35;
    tax += (323_520 - 240_840) * 0.31;
    tax += (240_840 - 84_120) * 0.2;
    tax += 84_120 * 0.1;
  } else if (totalIncome > 502_920) {
    tax += (totalIncome - 502_920) * 0.47;
    tax += (502_920 - 323_520) * 0.35;
    tax += (323_520 - 240_840) * 0.31;
    tax += (240_840 - 84_120) * 0.2;
    tax += 84_120 * 0.1;
  } else if (totalIncome > 323_520) {
    tax += (totalIncome - 323_520) * 0.35;
    tax += (323_520 - 240_840) * 0.31;
    tax += (240_840 - 84_120) * 0.2;
    tax += 84_120 * 0.1;
  } else if (totalIncome > 240_840) {
    tax += (totalIncome - 240_840) * 0.31;
    tax += (240_840 - 84_120) * 0.2;
    tax += 84_120 * 0.1;
  } else if (totalIncome > 84_120) {
    tax += (totalIncome - 84_120) * 0.2;
    tax += 84_120 * 0.1;
  } else {
    tax += totalIncome * 0.1;
  }

  // חישוב המס רק על ההכנסות האחרות (ללא דמי האבטלה) — ללא רקורסיה
  let taxOnOtherOnly = 0;
  if (otherIncomeThisYear > 0) {
    const o = otherIncomeThisYear;
    if (o > 698_280) {
      taxOnOtherOnly += (o - 698_280) * 0.5 + (698_280 - 502_920) * 0.47 + (502_920 - 323_520) * 0.35 + (323_520 - 240_840) * 0.31 + (240_840 - 84_120) * 0.2 + 84_120 * 0.1;
    } else if (o > 502_920) {
      taxOnOtherOnly += (o - 502_920) * 0.47 + (502_920 - 323_520) * 0.35 + (323_520 - 240_840) * 0.31 + (240_840 - 84_120) * 0.2 + 84_120 * 0.1;
    } else if (o > 323_520) {
      taxOnOtherOnly += (o - 323_520) * 0.35 + (323_520 - 240_840) * 0.31 + (240_840 - 84_120) * 0.2 + 84_120 * 0.1;
    } else if (o > 240_840) {
      taxOnOtherOnly += (o - 240_840) * 0.31 + (240_840 - 84_120) * 0.2 + 84_120 * 0.1;
    } else if (o > 84_120) {
      taxOnOtherOnly += (o - 84_120) * 0.2 + 84_120 * 0.1;
    } else {
      taxOnOtherOnly += o * 0.1;
    }
  }
  const taxOnBenefitsOnly = Math.max(0, tax - taxOnOtherOnly);

  return {
    taxableAmount: totalBenefits,
    estimatedTax: taxOnBenefitsOnly,
    effectiveTaxRate: totalBenefits > 0 ? taxOnBenefitsOnly / totalBenefits : 0,
    note: 'הערכה בלבד — ביטוח לאומי מנכה מס מראש. ייתכן הפרש בדוח השנתי.',
  };
}

// ============================================================
// Backward-compatible wrapper (keeps old interface working)
// ============================================================

export interface UnemploymentBenefitsInput {
  /** שכר ברוטו ממוצע 6 חודשים אחרונים (₪/חודש) */
  averageMonthlySalary: number;
  /** גיל */
  age: number;
  /** האם יש ילדים מתחת לגיל 18 */
  hasChildren: boolean;
  /** מספר ימי עבודה ב-18 חודשים אחרונים (לזכאות) */
  workDaysIn18Months: number;
}

export interface UnemploymentBenefitsResult {
  isEligible: boolean;
  dailyBenefit: number;
  reducedDailyBenefit: number; // מהיום ה-126
  maxDays: number;
  totalEstimate: number;
  averageWageBracket: string;
  benefitRate: number;
  notes: string[];
}

/** Backward-compatible entry point */
export function calculateUnemploymentBenefits(
  input: UnemploymentBenefitsInput,
): UnemploymentBenefitsResult {
  const notes: string[] = [];

  const MIN_WORK_DAYS_FOR_ELIGIBILITY = 360; // 12 × 30
  if (input.workDaysIn18Months < MIN_WORK_DAYS_FOR_ELIGIBILITY) {
    notes.push('לא צבר מספיק ימי עבודה (נדרש 360 לפחות)');
  }
  if (input.age < MIN_AGE || input.age >= RETIREMENT_AGE) {
    notes.push(`הגיל אינו בטווח הזכאות (${MIN_AGE}-${RETIREMENT_AGE})`);
  }

  const isEligible =
    input.workDaysIn18Months >= MIN_WORK_DAYS_FOR_ELIGIBILITY &&
    input.age >= MIN_AGE &&
    input.age < RETIREMENT_AGE;

  if (!isEligible) {
    return {
      isEligible: false,
      dailyBenefit: 0,
      reducedDailyBenefit: 0,
      maxDays: 0,
      totalEstimate: 0,
      averageWageBracket: '',
      benefitRate: 0,
      notes,
    };
  }

  const payResult = calculateDailyPay({
    averageMonthlySalary: input.averageMonthlySalary,
    age: input.age,
    hasChildren: input.hasChildren,
  });

  notes.push(...payResult.recommendations);

  return {
    isEligible: true,
    dailyBenefit: payResult.dailyBenefitFirst125,
    reducedDailyBenefit: payResult.dailyBenefitAfter125,
    maxDays: payResult.maxDays,
    totalEstimate: payResult.totalGross,
    averageWageBracket: payResult.bracket,
    benefitRate: payResult.benefitRate,
    notes,
  };
}
