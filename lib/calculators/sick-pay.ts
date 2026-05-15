/**
 * חוק דמי מחלה - חישוב מקיף
 *
 * מבוסס על:
 * - חוק דמי מחלה, התשל"ו-1976
 * - חוק דמי מחלה (היעדרות בשל מחלת ילד), התשנ"ג-1993
 * - פסיקת בית הדין לעבודה (עדכון 2026)
 *
 * עדכון: 2026-05-15
 */

// ============================================================
// קבועים
// ============================================================

/** מספר ימי עבודה ממוצע בחודש (לפי 22 ימי עבודה) */
export const SICK_PAY_WORK_DAYS_PER_MONTH = 22;

/** צבירה חודשית (1.5 ימים לחודש) */
export const SICK_DAYS_ACCRUAL_PER_MONTH = 1.5;

/** צבירה שנתית (18 ימים לשנה) */
export const SICK_DAYS_ACCRUAL_PER_YEAR = 18;

/** תקרת ימי מחלה מצטברת */
export const SICK_DAYS_MAX_BALANCE = 90;

/** שיעורי תשלום לפי ימים */
export const SICK_PAY_RATES = {
  day1: 0,     // יום ראשון - ללא תשלום
  days2_3: 0.5, // ימים 2-3 - 50%
  day4plus: 1,  // יום 4 ואילך - 100%
} as const;

/** מכסות מחלת בן משפחה */
export const FAMILY_ILLNESS_ALLOWANCES = {
  /** מחלת ילד עד גיל 16 - ימים לשנה */
  child: 8,
  /** מחלת בן/בת זוג - ימים לשנה */
  spouse: 6,
  /** מחלת הורה (מגיל 65) - ימים לשנה */
  parent: 6,
} as const;

// ============================================================
// Types
// ============================================================

export type FamilyRelation = 'child' | 'spouse' | 'parent';
export type SickPayScenario = 'regular' | 'family';

// ============================================================
// Input / Output Interfaces
// ============================================================

export interface SickPayFullInput {
  /** ימי מחלה בתקופה */
  sickDays: number;
  /** שכר חודשי ברוטו */
  monthlySalary: number;
  /** האם ימי מחלה רצופים (לעומת נפרדים) */
  consecutive: boolean;
}

export interface DayPayment {
  day: number;
  rate: number;
  amount: number;
  label: string;
}

export interface SickPayFullResult {
  /** תשלום שיקבל מהמעסיק */
  totalPayment: number;
  /** הפרש משכר רגיל (הפסד) */
  totalUnpaidLoss: number;
  /** שכר מלא לתקופה */
  totalGrossForPeriod: number;
  /** ערך יום עבודה */
  dailySalary: number;
  /** פירוט תשלום לפי ימים */
  daysPayment: DayPayment[];
  /** הסבר */
  explanation: string;
  /** המלצות */
  recommendations: string[];
}

export interface AccumulationInput {
  /** חודשי עבודה (לחישוב צבירה) */
  monthsWorked: number;
  /** ימי מחלה שנוצלו */
  daysUsed: number;
}

export interface AccumulationResult {
  /** ימים שנצברו (לפי 1.5/חודש) */
  daysAccrued: number;
  /** ימים שנוצלו */
  daysUsed: number;
  /** יתרה נוכחית (מוגבל ב-90) */
  balance: number;
  /** האם הגיע לתקרה */
  atMaximum: boolean;
  /** חודשים עד תקרה */
  monthsToMax: number;
  /** אחוז מהתקרה */
  percentOfMax: number;
}

export interface FamilyIllnessInput {
  /** סוג קרבת משפחה */
  relation: FamilyRelation;
  /** ימי היעדרות */
  absenceDays: number;
  /** שכר חודשי ברוטו */
  monthlySalary: number;
  /** גיל ההורה (רלוונטי ל-relation: 'parent') */
  parentAge?: number;
}

export interface FamilyIllnessResult {
  /** האם זכאי */
  isEligible: boolean;
  /** מקסימום ימים מותרים לסוג זה */
  maxAllowedDays: number;
  /** ימי היעדרות שמכוסים */
  coveredDays: number;
  /** ימי היעדרות שלא מכוסים */
  uncoveredDays: number;
  /** תשלום מלא עבור הימים המכוסים */
  totalPayment: number;
  /** שכר יומי */
  dailySalary: number;
  /** הסבר */
  explanation: string;
  /** סיבת חוסר זכאות */
  ineligibilityReason?: string;
}

export interface LongIllnessScenario {
  /** יום התחלת מחלה */
  startDay: number;
  /** יום סיום מחלה */
  endDay: number;
  /** תשלום בתקופה זו */
  payment: number;
  /** תיאור התקופה */
  description: string;
  /** שיעור תשלום */
  rate: number;
}

export interface LongIllnessResult {
  /** שנות עבודה (לחישוב ימי מחלה צבורים) */
  yearsOfService: number;
  /** ימי מחלה צבורים בתחילת המחלה */
  accruedDaysAtStart: number;
  /** שכר יומי */
  dailySalary: number;
  /** תשלום מהמעסיק לאורך כל תקופת המחלה */
  totalEmployerPayment: number;
  /** ימי מחלה שסוקרו מהמכסה האישית */
  daysFromPersonalBalance: number;
  /** תרחישים לפי שלבים */
  scenarios: LongIllnessScenario[];
  /** מה קורה אחרי מיצוי הימים */
  afterBalance: string;
}

// ============================================================
// חישוב דמי מחלה רגיל
// ============================================================

/**
 * חישוב דמי מחלה לפי חוק
 * יום 1: 0% | ימים 2-3: 50% | יום 4+: 100%
 */
export function calculateSickPayFull(input: SickPayFullInput): SickPayFullResult {
  const sickDays = Math.max(0, Math.floor(input.sickDays));
  const dailySalary = input.monthlySalary > 0
    ? input.monthlySalary / SICK_PAY_WORK_DAYS_PER_MONTH
    : 0;

  const daysPayment: DayPayment[] = [];
  let totalPayment = 0;

  for (let day = 1; day <= sickDays; day++) {
    let rate: number;
    let label: string;

    if (day === 1) {
      rate = SICK_PAY_RATES.day1;
      label = 'ללא תשלום';
    } else if (day <= 3) {
      rate = SICK_PAY_RATES.days2_3;
      label = '50% מהשכר';
    } else {
      rate = SICK_PAY_RATES.day4plus;
      label = '100% מהשכר';
    }

    const amount = dailySalary * rate;
    daysPayment.push({ day, rate, amount, label });
    totalPayment += amount;
  }

  const totalGrossForPeriod = sickDays * dailySalary;
  const totalUnpaidLoss = totalGrossForPeriod - totalPayment;

  // הסבר
  let explanation = '';
  if (sickDays === 0) {
    explanation = 'לא הוזנו ימי מחלה.';
  } else if (sickDays === 1) {
    explanation = 'יום מחלה אחד — ללא תשלום לפי חוק. המעסיק לא מחויב לשלם על היום הראשון.';
  } else if (sickDays <= 3) {
    explanation = `${sickDays} ימי מחלה. יום 1 ללא תשלום, ימים 2-3 ב-50% מהשכר היומי.`;
  } else {
    explanation = `${sickDays} ימי מחלה: יום 1 ללא תשלום, ימים 2-3 ב-50%, יום 4 ואילך ב-100% מהשכר היומי.`;
  }

  // המלצות
  const recommendations: string[] = [];
  if (sickDays === 1) {
    recommendations.push('שקול לבדוק אם יש הסכם קיבוצי שמכסה גם את היום הראשון (יש מעסיקים שמוותרים עליו).');
  }
  if (sickDays > SICK_DAYS_ACCRUAL_PER_YEAR) {
    recommendations.push(`שים לב: צבירת ימי מחלה היא 18 ימים בשנה. מחלה ארוכה (${sickDays} ימים) מצריכה יתרה צבורה קיימת.`);
  }
  if (sickDays >= 7) {
    recommendations.push('מחלה של 7+ ימים בדרך כלל דורשת אישור מומחה (לא רק רופא משפחה).');
  }
  if (input.monthlySalary > 0 && totalUnpaidLoss > 0) {
    recommendations.push(`הפסד שכר: ${Math.round(totalUnpaidLoss).toLocaleString('he-IL')} ₪ — זה עלות ביטוח אובדן כושר עבודה.`);
  }

  return {
    totalPayment,
    totalUnpaidLoss,
    totalGrossForPeriod,
    dailySalary,
    daysPayment,
    explanation,
    recommendations,
  };
}

// ============================================================
// חישוב צבירת ימי מחלה
// ============================================================

/**
 * חישוב יתרת ימי מחלה לפי חודשי עבודה
 * צבירה: 1.5 ימים לחודש, תקרה: 90 ימים
 */
export function calculateSickDayAccumulation(input: AccumulationInput): AccumulationResult {
  const months = Math.max(0, input.monthsWorked);
  const used = Math.max(0, input.daysUsed);

  const daysAccrued = Math.min(months * SICK_DAYS_ACCRUAL_PER_MONTH, SICK_DAYS_MAX_BALANCE);
  const balance = Math.max(0, Math.min(daysAccrued - used, SICK_DAYS_MAX_BALANCE));
  const atMaximum = daysAccrued >= SICK_DAYS_MAX_BALANCE;

  // חודשים עד תקרה (אם עדיין לא הגיע)
  const monthsToMax = atMaximum
    ? 0
    : Math.ceil((SICK_DAYS_MAX_BALANCE - daysAccrued) / SICK_DAYS_ACCRUAL_PER_MONTH);

  const percentOfMax = Math.min(100, (balance / SICK_DAYS_MAX_BALANCE) * 100);

  return {
    daysAccrued,
    daysUsed: used,
    balance,
    atMaximum,
    monthsToMax,
    percentOfMax,
  };
}

// ============================================================
// חישוב מחלת בן משפחה
// ============================================================

/**
 * חוק דמי מחלה (היעדרות בשל מחלת ילד) - היעדרות בגלל מחלה של בן משפחה
 *
 * ילד עד 16: 8 ימים/שנה (ברירת המחדל לבן/בת הזוג הראשי/ה)
 * בן/בת זוג: 6 ימים/שנה
 * הורה מעל 65: 6 ימים/שנה
 *
 * הערה: הימים נחשבים ממכסת ימי המחלה האישיים של העובד
 */
export function calculateFamilyIllnessPay(input: FamilyIllnessInput): FamilyIllnessResult {
  const dailySalary = input.monthlySalary > 0
    ? input.monthlySalary / SICK_PAY_WORK_DAYS_PER_MONTH
    : 0;

  // בדיקת זכאות לפי סוג קרבה
  let isEligible = true;
  let ineligibilityReason: string | undefined;
  let maxAllowedDays: number;

  switch (input.relation) {
    case 'child':
      maxAllowedDays = FAMILY_ILLNESS_ALLOWANCES.child;
      // ילד עד גיל 16 (ואם נכה - ללא הגבלת גיל)
      break;
    case 'spouse':
      maxAllowedDays = FAMILY_ILLNESS_ALLOWANCES.spouse;
      break;
    case 'parent':
      maxAllowedDays = FAMILY_ILLNESS_ALLOWANCES.parent;
      if (input.parentAge !== undefined && input.parentAge < 65) {
        isEligible = false;
        ineligibilityReason = `הורה מתחת לגיל 65 (גיל ${input.parentAge}) — החוק חל רק מגיל 65`;
      }
      break;
  }

  if (!isEligible) {
    return {
      isEligible: false,
      maxAllowedDays: maxAllowedDays!,
      coveredDays: 0,
      uncoveredDays: input.absenceDays,
      totalPayment: 0,
      dailySalary,
      explanation: `אינך זכאי להיעדרות מכוסה — ${ineligibilityReason}`,
      ineligibilityReason,
    };
  }

  const coveredDays = Math.min(input.absenceDays, maxAllowedDays!);
  const uncoveredDays = Math.max(0, input.absenceDays - maxAllowedDays!);

  // ימי מחלה משפחה משולמים כמו ימי מחלה רגילים (0/50%/100%)
  let totalPayment = 0;
  for (let day = 1; day <= coveredDays; day++) {
    if (day === 1) totalPayment += 0;
    else if (day <= 3) totalPayment += dailySalary * 0.5;
    else totalPayment += dailySalary;
  }

  const relationLabel: Record<FamilyRelation, string> = {
    child: 'ילד עד גיל 16',
    spouse: 'בן/בת זוג',
    parent: `הורה (גיל ${input.parentAge ?? '65+'})`,
  };

  const explanation =
    `היעדרות בגלל מחלת ${relationLabel[input.relation]}. ` +
    `מכסה שנתית: ${maxAllowedDays} ימים. ` +
    (coveredDays < input.absenceDays
      ? `מכוסים: ${coveredDays} מתוך ${input.absenceDays} ימים.`
      : `כל ${coveredDays} הימים מכוסים.`);

  return {
    isEligible: true,
    maxAllowedDays: maxAllowedDays!,
    coveredDays,
    uncoveredDays,
    totalPayment,
    dailySalary,
    explanation,
  };
}

// ============================================================
// תרחיש מחלה ממושכת
// ============================================================

/**
 * חישוב תרחיש מחלה ממושכת (כולל מה קורה אחרי 90 ימים)
 * @param yearsOfService שנות עבודה - לחישוב ימי מחלה שנצברו
 * @param monthlySalary שכר חודשי ברוטו
 * @param totalSickDays סך ימי המחלה
 */
export function calculateLongIllness(
  yearsOfService: number,
  monthlySalary: number,
  totalSickDays: number,
): LongIllnessResult {
  const monthsWorked = yearsOfService * 12;
  const accruedDaysAtStart = Math.min(
    monthsWorked * SICK_DAYS_ACCRUAL_PER_MONTH,
    SICK_DAYS_MAX_BALANCE,
  );

  const dailySalary = monthlySalary > 0
    ? monthlySalary / SICK_PAY_WORK_DAYS_PER_MONTH
    : 0;

  const scenarios: LongIllnessScenario[] = [];
  let totalEmployerPayment = 0;
  let daysFromPersonalBalance = 0;

  // שלב 1: ימים 1-3 (0%/50%)
  if (totalSickDays >= 1) {
    const phaseEnd = Math.min(totalSickDays, 3);
    let phasePayment = 0;
    for (let d = 1; d <= phaseEnd; d++) {
      if (d === 1) phasePayment += 0;
      else phasePayment += dailySalary * 0.5;
    }
    scenarios.push({
      startDay: 1,
      endDay: phaseEnd,
      payment: phasePayment,
      description: 'יום 1 ללא תשלום, ימים 2-3 ב-50%',
      rate: 0.3333, // ממוצע
    });
    totalEmployerPayment += phasePayment;
    daysFromPersonalBalance += phaseEnd;
  }

  // שלב 2: ימים 4 עד מיצוי היתרה האישית (100%)
  const endOfPersonalBalance = Math.min(totalSickDays, accruedDaysAtStart);
  if (endOfPersonalBalance >= 4) {
    const phaseDays = endOfPersonalBalance - 3;
    const phasePayment = phaseDays * dailySalary;
    scenarios.push({
      startDay: 4,
      endDay: endOfPersonalBalance,
      payment: phasePayment,
      description: '100% מהשכר (מהיתרה האישית)',
      rate: 1,
    });
    totalEmployerPayment += phasePayment;
    daysFromPersonalBalance += phaseDays;
  }

  // שלב 3: אחרי מיצוי היתרה האישית
  if (totalSickDays > accruedDaysAtStart && totalSickDays > 3) {
    const afterBalanceStart = Math.max(4, accruedDaysAtStart + 1);
    scenarios.push({
      startDay: afterBalanceStart,
      endDay: totalSickDays,
      payment: 0,
      description: 'מעבר לסל הצבור — ללא תשלום מהמעסיק',
      rate: 0,
    });
  }

  let afterBalance = '';
  if (totalSickDays > accruedDaysAtStart) {
    afterBalance =
      'לאחר מיצוי ימי המחלה הצבורים, העובד אינו זכאי לתשלום ממעסיק. ' +
      'ניתן לבחון: ביטוח אובדן כושר עבודה (פרטי/דרך המעסיק), ' +
      'חל"ת (חופשה ללא תשלום), פגישה עם ביטוח לאומי לבדיקת נכות.';
  } else if (totalSickDays >= SICK_DAYS_MAX_BALANCE * 0.9) {
    afterBalance =
      'קרוב לתקרת 90 הימים — לאחר מיצוי הסל יפסק תשלום המעסיק. ' +
      'מומלץ לבדוק ביטוח אובדן כושר עבודה בהקדם.';
  } else {
    afterBalance = `נשארו ${Math.round(accruedDaysAtStart - daysFromPersonalBalance)} ימים ביתרה האישית.`;
  }

  return {
    yearsOfService,
    accruedDaysAtStart,
    dailySalary,
    totalEmployerPayment,
    daysFromPersonalBalance,
    scenarios,
    afterBalance,
  };
}

// ============================================================
// תאימות לאחור - calculateSickPay הישן
// ============================================================

/**
 * @deprecated Use calculateSickPayFull instead
 * שמור לתאימות לאחור עם הקוד הקיים
 */
export function calculateSickPay(input: {
  sickDays: number;
  monthlySalary: number;
  consecutive: boolean;
}): {
  totalUnpaidLoss: number;
  totalPayment: number;
  daysPayment: Array<{ day: number; rate: number; amount: number }>;
  explanation: string;
} {
  const result = calculateSickPayFull(input);
  return {
    totalUnpaidLoss: result.totalUnpaidLoss,
    totalPayment: result.totalPayment,
    daysPayment: result.daysPayment.map(({ day, rate, amount }) => ({ day, rate, amount })),
    explanation: result.explanation,
  };
}
