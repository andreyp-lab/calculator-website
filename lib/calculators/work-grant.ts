/**
 * מחשבון מענק עבודה (מס הכנסה שלילי) - 2026
 *
 * מענק עבודה הוא תוכנית ממשלתית שמעניקה כסף לעובדים בשכר נמוך,
 * כתמריץ לעבודה. במקום שתשלם מס — אתה מקבל כסף.
 *
 * מקור: רשות המסים, חוק מס הכנסה (ניכוי, זיכוי והחזר), תיקון 185
 * עדכון: 2026-05-15
 *
 * === נוסחת 2026 (חודשית, לפי רשות המסים) ===
 *
 * החישוב נעשה על ההכנסה החודשית הממוצעת (הכנסה שנתית מעבודה ÷ חודשי עבודה):
 *
 * הורה ל-1-2 ילדים, וכן בני 55+ (גם ללא ילדים):
 *   עד 2,450 ₪ — אין מענק
 *   2,450–4,260 ₪ — 150 ₪ + 24.15% מההכנסה שמעל 2,450
 *   4,260–5,680 ₪ — שיא: 585 ₪/חודש
 *   מעל 5,680 ₪ — ירידה של 34.5% מהעודף, עד אפס (~7,380 ₪)
 *
 * הורה ל-3+ ילדים:
 *   2,450–4,260 ₪ — 210 ₪ + 35.25% מההכנסה שמעל 2,450
 *   4,260–5,680 ₪ — שיא: 855 ₪/חודש
 *   מעל 5,680 ₪ — ירידה של 35.25% מהעודף, עד אפס (~8,100 ₪)
 *
 * הורה יחיד — מענק מוגדל 150% וטווח הכנסה רחב:
 *   1,510–11,190 ₪ (1-2 ילדים) / 1,510–13,660 ₪ (3+ ילדים).
 *   שלב הביניים ממומש כאינטרפולציה ליניארית בין נקודות העיגון
 *   המפורסמות (התחלה, רמת השיא ×1.5, נקודת האפס) — קירוב.
 *
 * הערה: "מענק עבודה נוסף" להורה לפעוט מתחת לגיל 3 (מענק פעוטות) והשפעת
 * הכנסת בן/בת הזוג אינם כלולים במחשבון — מצוין למשתמש כהערה.
 *
 * מקורות:
 * - https://www.gov.il/he/departments/guides/earned_income_tax_credit
 * - https://www.kolzchut.org.il/he/מענק_עבודה
 * - https://taxes.gov.il
 */

// ====================================================================
// קבועים 2026
// ====================================================================

/**
 * פרמטרי הנוסחה החודשית 2026 (רשות המסים).
 * standard — הורה ל-1-2 ילדים וכן בני 55+ (גם ללא ילדים).
 * large — הורה ל-3+ ילדים.
 */
export const WORK_GRANT_MONTHLY_2026 = {
  minIncome: 2_450,
  riseEnd: 4_260,
  plateauEnd: 5_680,
  standard: { base: 150, riseRate: 0.2415, peak: 585, phaseOutRate: 0.345 },
  large: { base: 210, riseRate: 0.3525, peak: 855, phaseOutRate: 0.3525 },
  singleParent: {
    minIncome: 1_510,
    multiplier: 1.5,
    maxIncomeUpTo2Children: 11_190,
    maxIncome3Plus: 13_660,
  },
} as const;

/** הכנסה שנתית מינימלית לזכאות (2,450 ₪ × 12) */
export const WORK_GRANT_MIN_INCOME_2026 = 29_400;

/** הכנסה שנתית שבה מתחיל טווח השיא (4,260 ₪ × 12) */
export const WORK_GRANT_PEAK_INCOME_2026 = 51_120;

/** הכנסה שנתית מקסימלית להורה ל-1-2 ילדים ולבני 55+ ללא ילדים (~7,380 ₪ × 12) */
export const WORK_GRANT_MAX_INCOME_SINGLE_2026 = 88_560;

/** הכנסה שנתית מקסימלית להורה ל-3+ ילדים (8,100 ₪ × 12) */
export const WORK_GRANT_MAX_INCOME_PARENT_2026 = 97_200;

/** מענק שנתי מקסימלי — הורה ל-1-2 ילדים / בני 55+ (585 ₪ × 12) */
export const WORK_GRANT_BASE_MAX_2026 = 7_020;

/** מענק שנתי מקסימלי — הורה ל-3+ ילדים (855 ₪ × 12) */
export const WORK_GRANT_LARGE_FAMILY_MAX_2026 = 10_260;

/** גיל מינימלי ללא ילדים — זכאות ללא ילדים קיימת רק מגיל 55 */
export const WORK_GRANT_MIN_AGE_NO_CHILDREN = 55;

/** גיל מינימלי להורה עם ילדים */
export const WORK_GRANT_MIN_AGE_WITH_CHILDREN = 23;

/** גיל מינימלי להורה יחיד */
export const WORK_GRANT_MIN_AGE_SINGLE_PARENT = 21;

/** חודשי עבודה מינימליים לשכיר */
export const WORK_GRANT_MIN_MONTHS_SALARIED = 6;

/** שבועות עצמאי מינימליים (50%+ ממש) */
export const WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED = 13;

/** שנת מס (לגרף השוואתי) */
export const WORK_GRANT_YEAR = 2026;

/**
 * נתוני 2024 להשוואה גרפית בלבד — קירוב: פרמטרי 2026 בהפחתת ~4%
 * (עדכון המדד בין השנים). אינם משמשים לחישוב המענק בפועל.
 */
export const WORK_GRANT_2024 = {
  minIncome: 28_224,
  peakIncome: 49_075,
  maxIncomeSingle: 85_018,
  maxIncomeParent: 93_312,
  standardPeakMonthly: 562,
  largePeakMonthly: 821,
};

// ====================================================================
// טיפוסים
// ====================================================================

export type EmploymentType = 'salaried' | 'self_employed' | 'both';
export type FamilyStatus = 'single' | 'married' | 'divorced' | 'widowed';

export interface WorkGrantInput {
  /** הכנסה שנתית מעבודה (ברוטו, ₪) */
  annualWorkIncome: number;
  /** גיל */
  age: number;
  /** מצב משפחתי */
  familyStatus: FamilyStatus;
  /** מספר ילדים מתחת לגיל 18 */
  numberOfChildren: number;
  /** האם הורה יחיד */
  isSingleParent: boolean;
  /** סוג תעסוקה */
  employmentType: EmploymentType;
  /** חודשי עבודה כשכיר (0-12) */
  monthsAsSalaried: number;
  /** שבועות עבודה כעצמאי (50%+ ממש) */
  weeksAsSelfEmployed: number;
  /** האם תושב ישראל */
  isIsraeliResident: boolean;
  /** הכנסה כוללת של בני הזוג (₪ שנתי) - לבדיקת תקרת משק בית */
  householdIncome?: number;
}

export interface EligibilityCondition {
  /** תיאור התנאי */
  label: string;
  /** עובר / לא עובר */
  met: boolean;
  /** הסבר קצר */
  note: string;
}

export interface WorkGrantEligibility {
  /** זכאי? */
  isEligible: boolean;
  /** רשימת תנאים */
  conditions: EligibilityCondition[];
  /** סיבת חוסר זכאות ראשית */
  primaryReason?: string;
  /** שנים שניתן להגיש אחורה (סעיף 7(א)(1) לחוק מענק עבודה — עד שנתיים מתום שנת המס) */
  yearsCanFileBack: number;
  /** האם כדאי להגיש */
  shouldFile: boolean;
}

export interface WorkGrantTier {
  /** שם השלב */
  name: string;
  /** הכנסה מינימלית בשלב */
  incomeFrom: number;
  /** הכנסה מקסימלית בשלב */
  incomeTo: number;
  /** כיוון (עלייה / שיא / ירידה) */
  direction: 'rise' | 'peak' | 'fall' | 'zero';
  /** האם ההכנסה נמצאת בטווח הזה */
  active: boolean;
}

export interface WorkGrantResult {
  /** זכאי? */
  isEligible: boolean;
  /** סכום מענק שנתי (₪) */
  annualGrant: number;
  /** סכום מענק חודשי משוער */
  monthlyEquivalent: number;
  /** מקסימום אפשרי לפי מצב */
  maxPossibleGrant: number;
  /** אחוז מהמקסימום שמקבלים */
  percentOfMax: number;
  /** שלב מחזור המענק */
  tier: WorkGrantTier;
  /** פירוט חישוב */
  breakdown: {
    baseGrant: number;
    childrenBonus: number;
    singleParentBonus: number;
    totalGrant: number;
  };
  /** תנאי זכאות */
  eligibility: WorkGrantEligibility;
  /** טיפ / המלצה */
  tips: string[];
  /** מספר ילדים שהוכנסו */
  numberOfChildren: number;
  /** סף הכנסה תחתון */
  lowerThreshold: number;
  /** סף הכנסה עליון */
  upperThreshold: number;
  /** מועד הגשה מומלץ */
  filingDeadline: string;
}

export interface GrantCurvePoint {
  income: number;
  grant: number;
  label?: string;
}

export interface YearComparison {
  year: number;
  maxGrantSingle: number;
  maxGrantOneChild: number;
  maxGrantTwoChildren: number;
  maxGrantThreeChildren: number;
  minIncome: number;
  maxIncomeSingle: number;
  maxIncomeParent: number;
}

// ====================================================================
// פונקציות עזר
// ====================================================================

/**
 * חישוב מקסימום מענק לפי ילדים ומצב משפחתי
 */
export function calculateMaxGrant(
  numberOfChildren: number,
  isSingleParent: boolean,
  year: 2024 | 2026 = 2026,
): number {
  const children = Math.max(0, numberOfChildren);
  const peakMonthly =
    year === 2024
      ? children >= 3
        ? WORK_GRANT_2024.largePeakMonthly
        : WORK_GRANT_2024.standardPeakMonthly
      : children >= 3
        ? WORK_GRANT_MONTHLY_2026.large.peak
        : WORK_GRANT_MONTHLY_2026.standard.peak;

  const multiplier =
    isSingleParent && children > 0 ? WORK_GRANT_MONTHLY_2026.singleParent.multiplier : 1;

  return Math.round(peakMonthly * multiplier * 12);
}

/**
 * מענק חודשי לפי ההכנסה החודשית הממוצעת — הנוסחה הרשמית של רשות המסים 2026.
 */
export function calculateMonthlyGrant2026(
  monthlyIncome: number,
  numberOfChildren: number,
  isSingleParent: boolean,
): number {
  const cfg = WORK_GRANT_MONTHLY_2026;
  const isLarge = numberOfChildren >= 3;
  const scale = isLarge ? cfg.large : cfg.standard;

  if (isSingleParent && numberOfChildren > 0) {
    // הורה יחיד: מענק מוגדל 150% וטווח רחב — אינטרפולציה בין נקודות העיגון
    // המפורסמות: תחילת זכאות 1,510 ₪, רמת שיא 4,260–5,680 ₪ בגובה ×1.5,
    // ואפס בתקרה (11,190 / 13,660 ₪).
    const sp = cfg.singleParent;
    const peak = scale.peak * sp.multiplier;
    const maxIncome = isLarge ? sp.maxIncome3Plus : sp.maxIncomeUpTo2Children;

    if (monthlyIncome <= sp.minIncome || monthlyIncome >= maxIncome) return 0;
    if (monthlyIncome < cfg.riseEnd) {
      return (peak * (monthlyIncome - sp.minIncome)) / (cfg.riseEnd - sp.minIncome);
    }
    if (monthlyIncome <= cfg.plateauEnd) return peak;
    return Math.max(
      0,
      (peak * (maxIncome - monthlyIncome)) / (maxIncome - cfg.plateauEnd),
    );
  }

  if (monthlyIncome <= cfg.minIncome) return 0;
  if (monthlyIncome < cfg.riseEnd) {
    return Math.min(
      scale.peak,
      scale.base + scale.riseRate * (monthlyIncome - cfg.minIncome),
    );
  }
  if (monthlyIncome <= cfg.plateauEnd) return scale.peak;
  return Math.max(0, scale.peak - scale.phaseOutRate * (monthlyIncome - cfg.plateauEnd));
}

/**
 * חישוב סכום מענק בהינתן הכנסה + מצב (ללא בדיקת זכאות)
 */
export function calculateRawGrant(
  annualIncome: number,
  numberOfChildren: number,
  isSingleParent: boolean,
  year: 2024 | 2026 = 2026,
  workMonths = 12,
): number {
  const months = Math.min(12, Math.max(1, Math.round(workMonths)));
  const monthlyIncome = annualIncome / months;

  let monthlyGrant = calculateMonthlyGrant2026(
    monthlyIncome,
    numberOfChildren,
    isSingleParent,
  );

  // 2024 — קירוב להשוואה גרפית בלבד: הפחתת ~4% מערכי 2026
  if (year === 2024) monthlyGrant *= 0.96;

  return Math.round(monthlyGrant * months);
}

/**
 * בניית נקודות לגרף עקומת המענק
 */
export function buildGrantCurve(
  numberOfChildren: number,
  isSingleParent: boolean,
  year: 2024 | 2026 = 2026,
  steps = 60,
): GrantCurvePoint[] {
  const maxIncome = numberOfChildren > 0
    ? (year === 2026 ? WORK_GRANT_MAX_INCOME_PARENT_2026 : WORK_GRANT_2024.maxIncomeParent)
    : (year === 2026 ? WORK_GRANT_MAX_INCOME_SINGLE_2026 : WORK_GRANT_2024.maxIncomeSingle);

  const minIncome = year === 2026 ? WORK_GRANT_MIN_INCOME_2026 : WORK_GRANT_2024.minIncome;

  // צעדים מ-0 עד maxIncome + 10%
  const totalRange = maxIncome * 1.1;
  const step = Math.round(totalRange / steps / 1000) * 1000 || 1000;

  const points: GrantCurvePoint[] = [];
  for (let income = 0; income <= totalRange; income += step) {
    points.push({
      income,
      grant: calculateRawGrant(income, numberOfChildren, isSingleParent, year),
    });
  }

  // הוסף נקודות מפתח בדיוק
  const keyPoints = [
    minIncome,
    year === 2026 ? WORK_GRANT_PEAK_INCOME_2026 : WORK_GRANT_2024.peakIncome,
    maxIncome,
  ];
  for (const kp of keyPoints) {
    const existing = points.find(p => p.income === kp);
    if (!existing) {
      points.push({
        income: kp,
        grant: calculateRawGrant(kp, numberOfChildren, isSingleParent, year),
      });
    }
  }

  return points.sort((a, b) => a.income - b.income);
}

/**
 * השוואה בין שנים
 */
export function getYearComparison(): YearComparison[] {
  return [2024, 2026].map(year => {
    const y = year as 2024 | 2026;
    return {
      year,
      maxGrantSingle: calculateMaxGrant(0, false, y),
      maxGrantOneChild: calculateMaxGrant(1, false, y),
      maxGrantTwoChildren: calculateMaxGrant(2, false, y),
      maxGrantThreeChildren: calculateMaxGrant(3, false, y),
      minIncome: y === 2026 ? WORK_GRANT_MIN_INCOME_2026 : WORK_GRANT_2024.minIncome,
      maxIncomeSingle: y === 2026 ? WORK_GRANT_MAX_INCOME_SINGLE_2026 : WORK_GRANT_2024.maxIncomeSingle,
      maxIncomeParent: y === 2026 ? WORK_GRANT_MAX_INCOME_PARENT_2026 : WORK_GRANT_2024.maxIncomeParent,
    };
  });
}

/**
 * טווח ההכנסה השנתית המזכה לפי הקטגוריה (ילדים / הורה יחיד).
 */
export function getAnnualIncomeWindow(
  numberOfChildren: number,
  isSingleParent: boolean,
): { lower: number; upper: number } {
  const cfg = WORK_GRANT_MONTHLY_2026;
  if (isSingleParent && numberOfChildren > 0) {
    const upperMonthly =
      numberOfChildren >= 3
        ? cfg.singleParent.maxIncome3Plus
        : cfg.singleParent.maxIncomeUpTo2Children;
    return { lower: cfg.singleParent.minIncome * 12, upper: upperMonthly * 12 };
  }
  return {
    lower: WORK_GRANT_MIN_INCOME_2026,
    upper:
      numberOfChildren >= 3
        ? WORK_GRANT_MAX_INCOME_PARENT_2026
        : WORK_GRANT_MAX_INCOME_SINGLE_2026,
  };
}

// ====================================================================
// פונקציית בדיקת זכאות
// ====================================================================

export function checkEligibility(input: WorkGrantInput): WorkGrantEligibility {
  const hasChildren = input.numberOfChildren > 0;
  const minAge = hasChildren
    ? input.isSingleParent
      ? WORK_GRANT_MIN_AGE_SINGLE_PARENT
      : WORK_GRANT_MIN_AGE_WITH_CHILDREN
    : WORK_GRANT_MIN_AGE_NO_CHILDREN;

  const ageOk = input.age >= minAge;
  const residentOk = input.isIsraeliResident;

  const window = getAnnualIncomeWindow(input.numberOfChildren, input.isSingleParent);
  const upperThreshold = window.upper;

  const incomeRangeOk =
    input.annualWorkIncome >= window.lower &&
    input.annualWorkIncome <= upperThreshold;

  // תנאי עבודה — אינפורמטיבי בלבד: אין בחוק דרישת מינימום חודשי עבודה לשכיר;
  // מספר החודשים משמש לחישוב ההכנסה החודשית הממוצעת.
  let workConditionOk = false;
  let workNote = '';
  if (input.employmentType === 'salaried' || input.employmentType === 'both') {
    if (input.monthsAsSalaried >= 1) {
      workConditionOk = true;
      workNote = `עבדת ${input.monthsAsSalaried} חודשים כשכיר — ההכנסה הממוצעת מחושבת לפי חודשי העבודה בפועל`;
    }
  }
  if (input.employmentType === 'self_employed' || input.employmentType === 'both') {
    if (input.weeksAsSelfEmployed >= WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED) {
      workConditionOk = true;
      workNote = `עבדת ${input.weeksAsSelfEmployed} שבועות כעצמאי (נדרש: ${WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED}+)`;
    }
  }
  if (!workConditionOk && workNote === '') {
    workNote = `עבדת ${input.monthsAsSalaried} חודשים (נדרש: 6+ חודשים כשכיר, או 13+ שבועות כעצמאי)`;
  }

  // תנאי הכנסה
  const incomeNote = incomeRangeOk
    ? `הכנסה ${input.annualWorkIncome.toLocaleString('he-IL')} ₪ — בתוך טווח הזכאות`
    : input.annualWorkIncome < window.lower
      ? `הכנסה נמוכה מהסף (${window.lower.toLocaleString('he-IL')} ₪)`
      : `הכנסה גבוהה מהתקרה (${upperThreshold.toLocaleString('he-IL')} ₪)`;

  const ageNote = ageOk
    ? `גיל ${input.age} — עומד בתנאי (${minAge}+)`
    : hasChildren
      ? `גיל ${input.age} — נדרש: ${minAge}+ להורה`
      : `גיל ${input.age} — ללא ילדים הזכאות מתחילה בגיל ${WORK_GRANT_MIN_AGE_NO_CHILDREN}`;

  const conditions: EligibilityCondition[] = [
    {
      label: 'תושב ישראל',
      met: residentOk,
      note: residentOk ? 'תושב ישראל — עומד בתנאי' : 'נדרש רישום במרשם האוכלוסין',
    },
    {
      label: 'גיל מינימלי',
      met: ageOk,
      note: ageNote,
    },
    {
      label: 'הכנסה מעבודה בטווח',
      met: incomeRangeOk,
      note: incomeNote,
    },
    {
      label: 'ותק עבודה מספיק',
      met: workConditionOk,
      note: workNote,
    },
    {
      label: 'הכנסה ממקור עבודה',
      met: input.annualWorkIncome > 0,
      note: input.annualWorkIncome > 0
        ? 'הכנסה נרשמה כהכנסה מעבודה (שכיר/עצמאי)'
        : 'נדרש שהכנסה תהיה מעבודה (לא קצבאות/שכירות)',
    },
    {
      label: 'אין חריגה בהכנסה זוגית',
      met: !input.householdIncome || input.householdIncome <= upperThreshold * 1.5,
      note: !input.householdIncome
        ? 'לא הוכנסה הכנסה משקית — אנא בדוק'
        : `הכנסה משקית: ${(input.householdIncome || 0).toLocaleString('he-IL')} ₪`,
    },
    {
      label: 'זכות לפי חוק',
      met: true,
      note: 'מענק עבודה הוא זכות לפי חוק — ניתן לתבוע עד שנתיים מתום שנת המס',
    },
  ];

  const failedConditions = conditions.filter(c => !c.met);
  const isEligible = failedConditions.length === 0;

  let primaryReason: string | undefined;
  if (!isEligible) {
    const firstFail = failedConditions[0];
    primaryReason = firstFail?.note;
  }

  const grant = calculateRawGrant(
    input.annualWorkIncome,
    input.numberOfChildren,
    input.isSingleParent,
  );

  return {
    isEligible,
    conditions,
    primaryReason,
    yearsCanFileBack: 2,
    shouldFile: isEligible && grant > 200,
  };
}

// ====================================================================
// פונקציית חישוב מלאה
// ====================================================================

export function calculateWorkGrant(input: WorkGrantInput): WorkGrantResult {
  const eligibility = checkEligibility(input);
  const hasChildren = input.numberOfChildren > 0;

  const window = getAnnualIncomeWindow(input.numberOfChildren, input.isSingleParent);
  const lowerThreshold = window.lower;
  const upperThreshold = window.upper;

  // חישוב מקסימום
  const maxPossibleGrant = calculateMaxGrant(
    input.numberOfChildren,
    input.isSingleParent,
  );

  // חישוב מענק בסיסי
  const baseGrant = calculateRawGrant(input.annualWorkIncome, 0, false);
  const grantWithChildren = calculateRawGrant(
    input.annualWorkIncome,
    input.numberOfChildren,
    false,
  );
  const childrenBonus = grantWithChildren - baseGrant;
  const singleParentBonus = input.isSingleParent && hasChildren
    ? calculateRawGrant(input.annualWorkIncome, input.numberOfChildren, true) - grantWithChildren
    : 0;
  const totalGrant = grantWithChildren + singleParentBonus;

  const annualGrant = eligibility.isEligible ? totalGrant : 0;
  const monthlyEquivalent = annualGrant / 12;
  const percentOfMax = maxPossibleGrant > 0 ? (totalGrant / maxPossibleGrant) * 100 : 0;

  // קביעת שלב
  const inRange = input.annualWorkIncome >= lowerThreshold && input.annualWorkIncome <= upperThreshold;
  let tier: WorkGrantTier;

  if (!inRange || input.annualWorkIncome < lowerThreshold) {
    tier = {
      name: 'מחוץ לטווח',
      incomeFrom: 0,
      incomeTo: lowerThreshold,
      direction: 'zero',
      active: true,
    };
  } else if (input.annualWorkIncome <= WORK_GRANT_PEAK_INCOME_2026) {
    tier = {
      name: 'שלב עלייה — המענק גדל',
      incomeFrom: lowerThreshold,
      incomeTo: WORK_GRANT_PEAK_INCOME_2026,
      direction: 'rise',
      active: true,
    };
  } else if (input.annualWorkIncome <= upperThreshold) {
    tier = {
      name: 'שלב ירידה — המענק קטן',
      incomeFrom: WORK_GRANT_PEAK_INCOME_2026,
      incomeTo: upperThreshold,
      direction: 'fall',
      active: true,
    };
  } else {
    tier = {
      name: 'מעל תקרה — ללא מענק',
      incomeFrom: upperThreshold,
      incomeTo: Infinity,
      direction: 'zero',
      active: true,
    };
  }

  // טיפים
  const tips: string[] = [];

  if (!eligibility.isEligible) {
    if (input.annualWorkIncome < lowerThreshold) {
      const diff = lowerThreshold - input.annualWorkIncome;
      tips.push(`הכנסה נמוכה ב-${Math.round(diff).toLocaleString('he-IL')} ₪ מהסף. אם תגדיל שעות — תיכנס לטווח הזכאות.`);
    } else if (input.annualWorkIncome > upperThreshold) {
      tips.push(`הכנסה גבוהה מהתקרה (${upperThreshold.toLocaleString('he-IL')} ₪). בדוק אם שנת המס הקודמת מתאימה — ניתן להגיש עד שנתיים מתום שנת המס.`);
    }
  } else {
    if (tier.direction === 'rise') {
      const distToPeak = WORK_GRANT_PEAK_INCOME_2026 - input.annualWorkIncome;
      const grantAtPeak = calculateRawGrant(WORK_GRANT_PEAK_INCOME_2026, input.numberOfChildren, input.isSingleParent);
      tips.push(`אתה בשלב העלייה. אם תרוויח עוד ${Math.round(distToPeak).toLocaleString('he-IL')} ₪/שנה, תגיע למענק מקסימלי: ${Math.round(grantAtPeak).toLocaleString('he-IL')} ₪.`);
    }
    if (tier.direction === 'fall') {
      tips.push(`אתה בשלב הירידה — ככל שהרווחת יותר, המענק קטן. בדוק עם יועץ מס אם יש אסטרטגיה לחלוקת הכנסה.`);
    }
    if (annualGrant > 1_000) {
      tips.push('ניתן להגיש גם על שנת המס הקודמת (עד שנתיים מתום שנת המס) — אם היית זכאי גם בה, מדובר בשתי תביעות במקביל.');
    }
    tips.push('הגשה: אתר רשות המסים → "מענק עבודה" → "הגשת בקשה". התביעה מוגשת אחרי תום שנת המס; הגשה עד 30.6 מזכה בתשלום ראשון ב-15.7.');
  }

  if (input.numberOfChildren === 0 && input.age < WORK_GRANT_MIN_AGE_NO_CHILDREN) {
    tips.push('ללא ילדים הזכאות מתחילה רק בגיל 55. הורה לילד זכאי מגיל 23 (הורה יחיד — מגיל 21).');
  }
  tips.push('שימו לב: "מענק עבודה נוסף" להורה לפעוט מתחת לגיל 3 (מענק פעוטות) והשפעת הכנסת בן/בת הזוג אינם כלולים בחישוב — בדקו בסימולטור רשות המסים.');

  return {
    isEligible: eligibility.isEligible,
    annualGrant,
    monthlyEquivalent,
    maxPossibleGrant,
    percentOfMax,
    tier,
    breakdown: {
      baseGrant,
      childrenBonus,
      singleParentBonus,
      totalGrant,
    },
    eligibility,
    tips,
    numberOfChildren: input.numberOfChildren,
    lowerThreshold,
    upperThreshold,
    filingDeadline: 'לשנת המס 2025: מומלץ עד 30.6.2026 (תשלום ראשון 15.7.2026); מקוון עד סוף דצמבר 2027',
  };
}

// ====================================================================
// פונקציה לתאימות לאחור (ממשק ישן)
// ====================================================================

/**
 * @deprecated השתמש ב-calculateWorkGrant במקום
 */
export function calculateNIT(input: {
  annualEarnedIncome: number;
  age: number;
  isParent: boolean;
  numberOfChildren: number;
  isSingleParent: boolean;
}): {
  isEligible: boolean;
  annualGrant: number;
  monthlyEquivalent: number;
  lowerThreshold: number;
  upperThreshold: number;
  ineligibilityReason?: string;
} {
  const result = calculateWorkGrant({
    annualWorkIncome: input.annualEarnedIncome,
    age: input.age,
    familyStatus: 'single',
    numberOfChildren: input.numberOfChildren,
    isSingleParent: input.isSingleParent,
    employmentType: 'salaried',
    monthsAsSalaried: 12,
    weeksAsSelfEmployed: 0,
    isIsraeliResident: true,
  });

  return {
    isEligible: result.isEligible,
    annualGrant: result.annualGrant,
    monthlyEquivalent: result.monthlyEquivalent,
    lowerThreshold: result.lowerThreshold,
    upperThreshold: result.upperThreshold,
    ineligibilityReason: result.eligibility.primaryReason,
  };
}
