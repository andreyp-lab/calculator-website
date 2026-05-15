/**
 * מחשבון מענק עבודה (מס הכנסה שלילי) - 2026
 *
 * מענק עבודה הוא תוכנית ממשלתית שמעניקה כסף לעובדים בשכר נמוך,
 * כתמריץ לעבודה. במקום שתשלם מס — אתה מקבל כסף.
 *
 * מקור: רשות המסים, חוק מס הכנסה (ניכוי, זיכוי והחזר), תיקון 185
 * עדכון: 2026-05-15
 *
 * === טיירים ומדרגות 2026 ===
 *
 * יחיד ללא ילדים (גיל 23+, או 56-62 ללא ילדים):
 *   עלייה: 30,240 → 67,320 ₪
 *   שיא:   67,320 ₪ → מקסימום 5,506 ₪/שנה
 *   ירידה: 67,320 → 83,400 ₪
 *
 * הורה לילד אחד:
 *   עלייה: 30,240 → 67,320 ₪
 *   שיא:   67,320 ₪ → מקסימום 7,056 ₪/שנה
 *   ירידה: 67,320 → 99,960 ₪
 *
 * הורה לשני ילדים:
 *   מקסימום: ~8,618 ₪/שנה
 *
 * הורה ל-3+ ילדים:
 *   מקסימום: ~10,168 ₪/שנה
 *
 * הורה יחיד: תוספת ~3,000 ₪ על הסכום הבסיסי
 *
 * === זכאות עצמאי ===
 * עצמאי עם לפחות 13 שבועות שעבד 50%+ זמן → זכאי
 *
 * מקורות:
 * - https://www.gov.il/he/departments/guides/earned_income_tax_credit
 * - https://www.kolzchut.org.il/he/מענק_עבודה
 * - https://taxes.gov.il
 */

// ====================================================================
// קבועים 2026
// ====================================================================

/** הכנסה מינימלית לזכאות (שכיר / עצמאי) */
export const WORK_GRANT_MIN_INCOME_2026 = 30_240;

/** הכנסה שבה מגיעים לשיא המענק */
export const WORK_GRANT_PEAK_INCOME_2026 = 67_320;

/** הכנסה מקסימלית ליחיד ללא ילדים */
export const WORK_GRANT_MAX_INCOME_SINGLE_2026 = 83_400;

/** הכנסה מקסימלית להורה */
export const WORK_GRANT_MAX_INCOME_PARENT_2026 = 99_960;

/** מענק בסיס מקסימלי ליחיד */
export const WORK_GRANT_BASE_MAX_2026 = 5_506;

/** תוספת בכל ילד */
export const WORK_GRANT_PER_CHILD_2026 = 1_562;

/** תוספת הורה יחיד */
export const WORK_GRANT_SINGLE_PARENT_BONUS_2026 = 2_950;

/** גיל מינימלי ללא ילדים */
export const WORK_GRANT_MIN_AGE_NO_CHILDREN = 23;

/** גיל מינימלי עם ילדים */
export const WORK_GRANT_MIN_AGE_WITH_CHILDREN = 21;

/** גיל מינימלי לגמלאים ללא ילדים */
export const WORK_GRANT_MIN_AGE_SENIORS = 56;

/** גיל מקסימלי לגמלאים ללא ילדים (עד פרישה) */
export const WORK_GRANT_MAX_AGE_SENIORS = 62;

/** חודשי עבודה מינימליים לשכיר */
export const WORK_GRANT_MIN_MONTHS_SALARIED = 6;

/** שבועות עצמאי מינימליים (50%+ ממש) */
export const WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED = 13;

/** שנת מס (לגרף השוואתי) */
export const WORK_GRANT_YEAR = 2026;

// 2024 data (for comparison)
export const WORK_GRANT_2024 = {
  minIncome: 29_208,
  peakIncome: 65_076,
  maxIncomeSingle: 80_604,
  maxIncomeParent: 96_612,
  baseMax: 5_022,
  perChild: 1_424,
  singleParentBonus: 2_792,
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
  /** שנות ניתן להגיש אחורה */
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
  const data = year === 2024 ? WORK_GRANT_2024 : {
    baseMax: WORK_GRANT_BASE_MAX_2026,
    perChild: WORK_GRANT_PER_CHILD_2026,
    singleParentBonus: WORK_GRANT_SINGLE_PARENT_BONUS_2026,
  };

  const children = Math.max(0, Math.min(5, numberOfChildren));
  let max = data.baseMax;
  max += children * data.perChild;
  if (isSingleParent && children > 0) max += data.singleParentBonus;
  return max;
}

/**
 * חישוב סכום מענק בהינתן הכנסה + מצב (ללא בדיקת זכאות)
 */
export function calculateRawGrant(
  annualIncome: number,
  numberOfChildren: number,
  isSingleParent: boolean,
  year: 2024 | 2026 = 2026,
): number {
  const data = year === 2026 ? {
    minIncome: WORK_GRANT_MIN_INCOME_2026,
    peakIncome: WORK_GRANT_PEAK_INCOME_2026,
    maxIncomeSingle: WORK_GRANT_MAX_INCOME_SINGLE_2026,
    maxIncomeParent: WORK_GRANT_MAX_INCOME_PARENT_2026,
  } : {
    minIncome: WORK_GRANT_2024.minIncome,
    peakIncome: WORK_GRANT_2024.peakIncome,
    maxIncomeSingle: WORK_GRANT_2024.maxIncomeSingle,
    maxIncomeParent: WORK_GRANT_2024.maxIncomeParent,
  };

  const maxIncome = numberOfChildren > 0 ? data.maxIncomeParent : data.maxIncomeSingle;
  const maxGrant = calculateMaxGrant(numberOfChildren, isSingleParent, year);

  if (annualIncome < data.minIncome || annualIncome > maxIncome) return 0;

  let grant: number;

  if (annualIncome <= data.peakIncome) {
    // שלב עלייה לינארי
    const ratio = (annualIncome - data.minIncome) / (data.peakIncome - data.minIncome);
    grant = maxGrant * ratio;
  } else {
    // שלב ירידה לינארי
    const ratio = (maxIncome - annualIncome) / (maxIncome - data.peakIncome);
    grant = maxGrant * ratio;
  }

  return Math.max(0, Math.min(maxGrant, grant));
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

// ====================================================================
// פונקציית בדיקת זכאות
// ====================================================================

export function checkEligibility(input: WorkGrantInput): WorkGrantEligibility {
  const hasChildren = input.numberOfChildren > 0;
  const minAge = hasChildren ? WORK_GRANT_MIN_AGE_WITH_CHILDREN : WORK_GRANT_MIN_AGE_NO_CHILDREN;
  const isSenior = input.age >= WORK_GRANT_MIN_AGE_SENIORS && input.age <= WORK_GRANT_MAX_AGE_SENIORS;

  const ageOk = input.age >= minAge || isSenior;
  const residentOk = input.isIsraeliResident;

  const upperThreshold = hasChildren
    ? WORK_GRANT_MAX_INCOME_PARENT_2026
    : WORK_GRANT_MAX_INCOME_SINGLE_2026;

  const incomeRangeOk =
    input.annualWorkIncome >= WORK_GRANT_MIN_INCOME_2026 &&
    input.annualWorkIncome <= upperThreshold;

  // תנאי עבודה
  let workConditionOk = false;
  let workNote = '';
  if (input.employmentType === 'salaried' || input.employmentType === 'both') {
    if (input.monthsAsSalaried >= WORK_GRANT_MIN_MONTHS_SALARIED) {
      workConditionOk = true;
      workNote = `עבדת ${input.monthsAsSalaried} חודשים כשכיר (נדרש: ${WORK_GRANT_MIN_MONTHS_SALARIED}+)`;
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
    : input.annualWorkIncome < WORK_GRANT_MIN_INCOME_2026
      ? `הכנסה נמוכה מהסף (${WORK_GRANT_MIN_INCOME_2026.toLocaleString('he-IL')} ₪)`
      : `הכנסה גבוהה מהתקרה (${upperThreshold.toLocaleString('he-IL')} ₪)`;

  const ageNote = ageOk
    ? `גיל ${input.age} — עומד בתנאי (${minAge}+${isSenior ? ' או 56-62' : ''})`
    : `גיל ${input.age} — נדרש: ${minAge}+${!hasChildren ? ' ללא ילדים, או 56-62' : ''}`;

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
      note: 'מענק עבודה הוא זכות לפי חוק מס הכנסה — ניתן להגיש 6 שנים אחורה',
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
    yearsCanFileBack: 6,
    shouldFile: isEligible && grant > 200,
  };
}

// ====================================================================
// פונקציית חישוב מלאה
// ====================================================================

export function calculateWorkGrant(input: WorkGrantInput): WorkGrantResult {
  const eligibility = checkEligibility(input);
  const hasChildren = input.numberOfChildren > 0;

  const lowerThreshold = WORK_GRANT_MIN_INCOME_2026;
  const upperThreshold = hasChildren
    ? WORK_GRANT_MAX_INCOME_PARENT_2026
    : WORK_GRANT_MAX_INCOME_SINGLE_2026;

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
      tips.push(`הכנסה גבוהה מהתקרה (${upperThreshold.toLocaleString('he-IL')} ₪). בדוק אם שנים קודמות מתאימות — ניתן להגיש 6 שנים אחורה.`);
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
      tips.push(`ניתן להגיש 6 שנים אחורה — בדוק שנים קודמות! מענק מצטבר אפשרי: ${Math.round(annualGrant * 5).toLocaleString('he-IL')} ₪.`);
    }
    tips.push('הגשה: אתר רשות המסים → "מענק עבודה" → "הגשת בקשה". חלון ההגשה: אוגוסט-ספטמבר לשנה הנוכחית.');
  }

  if (input.numberOfChildren === 0 && input.age >= 21 && input.age < 23) {
    tips.push('עם ילד אחד, הזכאות מתחילה מגיל 21. שקול זאת אם רלוונטי.');
  }

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
    filingDeadline: 'אוגוסט-ספטמבר 2026 (לשנת המס 2025)',
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
