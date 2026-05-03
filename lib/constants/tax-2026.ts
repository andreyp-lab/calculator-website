/**
 * קבועים פיננסיים לשנת המס 2026 - מאומתים ממקורות רשמיים
 *
 * תאריך אימות אחרון: 2026-05-03
 *
 * מקורות עיקריים:
 * - רשות המסים: https://www.gov.il/he/departments/israel_tax_authority
 * - ביטוח לאומי: https://www.btl.gov.il
 * - כל-זכות: https://www.kolzchut.org.il
 * - לוח עזר לחישוב מס הכנסה ממשכורת ושכר עבודה
 *
 * הערה: ערכים אלה צריכים להיות מעודכנים בתחילת כל שנת מס.
 * שכר המינימום מתעדכן לרוב באפריל.
 */

// ============================================================
// מדרגות מס הכנסה 2026 - הכנסה מיגיעה אישית
// מקור: כל-זכות, רשות המסים
// הערה: בעקבות "ריווח מדרגות המס" 2026 - מדרגות 20% ו-31% הורחבו
// ============================================================
export const TAX_BRACKETS_2026 = [
  {
    upTo: 84_120, // שנתי
    monthlyUpTo: 7_010,
    rate: 0.10,
    label: 'מדרגה 1 (10%) - עד 7,010 ₪/חודש',
  },
  {
    upTo: 120_720,
    monthlyUpTo: 10_060,
    rate: 0.14,
    label: 'מדרגה 2 (14%) - 7,011-10,060 ₪/חודש',
  },
  {
    upTo: 228_000, // הורחב מ-193,800 ב-2026
    monthlyUpTo: 19_000,
    rate: 0.20,
    label: 'מדרגה 3 (20%) - 10,061-19,000 ₪/חודש',
  },
  {
    upTo: 301_200, // הורחב מ-269,280 ב-2026
    monthlyUpTo: 25_100,
    rate: 0.31,
    label: 'מדרגה 4 (31%) - 19,001-25,100 ₪/חודש',
  },
  {
    upTo: 560_280,
    monthlyUpTo: 46_690,
    rate: 0.35,
    label: 'מדרגה 5 (35%) - 25,101-46,690 ₪/חודש',
  },
  {
    upTo: 721_560,
    monthlyUpTo: 60_130,
    rate: 0.47,
    label: 'מדרגה 6 (47%) - 46,691-60,130 ₪/חודש',
  },
  {
    upTo: Infinity,
    monthlyUpTo: Infinity,
    rate: 0.50, // 47% + 3% מס יסף
    label: 'מדרגה 7 (50%) - מעל 60,130 ₪/חודש (47% + 3% מס יסף)',
  },
] as const;

// ============================================================
// מס יסף (Surtax)
// מקור: רשות המסים, חוק מס יסף
// ============================================================
export const SURTAX_2026 = {
  rate: 0.03, // 3% נוסף על הכנסה גבוהה
  annualThreshold: 721_560,
  monthlyThreshold: 60_130,
  // על הכנסה הוניית (לא מיגיעה אישית) - 5% (3% + 2%)
  capitalGainsExtraRate: 0.02,
} as const;

// ============================================================
// נקודות זיכוי 2026
// מקור: כל-זכות, רשות המסים
// אומת: 2026-05-03
// ============================================================
export const CREDIT_POINT_2026 = {
  monthly: 242, // ₪
  annual: 2_904, // ₪ (242 × 12)
} as const;

// נקודות זיכוי לפי מצב אישי (לחישוב סופי הכנס סכום הזיכוי)
export const CREDIT_POINTS_BY_STATUS = {
  // בסיסי
  resident: 2.25, // תושב ישראל
  woman: 0.5, // אישה - תוספת לנקודות הבסיס
  // ילדים (לפי גיל)
  childAge0: 1.5, // ילד בשנת לידתו
  childAge1to5: 2.5, // ילד בני 1-5
  childAge6to17: 1, // ילד בני 6-17
  childAge18: 0.5, // ילד בן 18
  // מצבים מיוחדים
  singleParent: 1, // הורה יחיד
  disabledChild: 1, // ילד נכה
  newImmigrant: {
    year1to1_5: 3, // 18 חודשים ראשונים
    year1_5to3: 2, // משם עד 30 חודשים
    year3to4_5: 1, // משם עד 54 חודשים
  },
  releasedSoldier: 2, // חייל משוחרר (3 שנים אחרי שחרור)
  bachelorDegree: 1, // תואר ראשון (עד שנה אחת)
  masterDegree: 0.5, // תואר שני (עד שנה אחת)
} as const;

// ============================================================
// ביטוח לאומי + דמי בריאות 2026 - שכיר
// מקור: ביטוח לאומי
// תקרה מקסימלית: 51,910 ₪/חודש
// ============================================================
export const SOCIAL_SECURITY_EMPLOYEE_2026 = {
  // שיעור מופחת - על חלק השכר עד 7,522 ₪/חודש
  reducedRate: {
    nationalInsurance: 0.0104, // 1.04%
    healthInsurance: 0.0323, // 3.23%
    total: 0.0427, // 4.27%
  },
  // שיעור מלא - על חלק השכר מ-7,523 ₪ ועד התקרה
  fullRate: {
    nationalInsurance: 0.07, // 7%
    healthInsurance: 0.0517, // 5.17%
    total: 0.1217, // 12.17%
  },
  // ספים ותקרות
  reducedThresholdMonthly: 7_522, // ₪/חודש
  maxThresholdMonthly: 51_910, // ₪/חודש - הכנסה מקסימלית חייבת
  // מעסיק
  employerRates: {
    reducedRate: 0.0451, // 4.51%
    fullRate: 0.076, // 7.6%
  },
} as const;

// ============================================================
// ביטוח לאומי + דמי בריאות 2026 - עצמאי
// מקור: ביטוח לאומי
// ============================================================
export const SOCIAL_SECURITY_SELF_EMPLOYED_2026 = {
  // שיעור מופחת - על חלק ההכנסה עד 7,522 ₪/חודש (60% השכר הממוצע)
  reducedRate: {
    nationalInsurance: 0.0287, // 2.87%
    healthInsurance: 0.0323, // 3.23%
    total: 0.061, // 6.10%
  },
  // שיעור מלא - על חלק ההכנסה מ-7,523 ₪ ועד התקרה
  fullRate: {
    nationalInsurance: 0.1283, // 12.83%
    healthInsurance: 0.0517, // 5.17%
    total: 0.18, // 18%
  },
  reducedThresholdMonthly: 7_522,
  maxThresholdMonthly: 51_910,
} as const;

// ============================================================
// פיצויי פיטורין 2026
// מקור: רשות המסים, חוק פיצויי פיטורים התשכ"ג-1963
// אומת: 2026-05-03
// ============================================================
export const SEVERANCE_COMPENSATION_2026 = {
  annualExemptionCeiling: 13_750, // ₪ - תקרת פטור לכל שנת עבודה
  exemptionMultiplier: 1.5, // משכורות × 1.5 לכל שנת ותק
  yearsRequired: 1, // שנה מינימלית לזכאות
} as const;

// ============================================================
// שכר מינימום 2026 (תקף מ-1.4.2026)
// מקור: ביטוח לאומי
// ============================================================
export const MINIMUM_WAGE_2026 = {
  monthly: 6_443.85, // ₪
  hourly182: 35.40, // ₪ - 182 שעות/חודש
  hourly186: 34.64, // ₪ - 186 שעות/חודש
  daily5DayWeek: 297.40, // ₪
  daily6DayWeek: 257.75, // ₪
  effectiveFrom: '2026-04-01',
} as const;

// ============================================================
// דמי הבראה 2026
// מקור: כל-זכות, צו ההרחבה
// ============================================================
export const RECREATION_PAY_2026 = {
  privateSectorPerDay: 418, // ₪
  publicSectorPerDay: 471.40, // ₪
  // ימי הבראה לפי ותק (מגזר פרטי)
  daysByYearsOfService: [
    { years: 1, days: 5 },
    { years: 2, days: 6 }, // 2-3 שנים
    { years: 4, days: 7 }, // 4-10 שנים
    { years: 11, days: 8 }, // 11-15 שנים
    { years: 16, days: 9 }, // 16-19 שנים
    { years: 20, days: 10 }, // 20+ שנים
  ],
} as const;

// ============================================================
// חופשה שנתית
// מקור: חוק חופשה שנתית התשי"א-1951
// ============================================================
export const ANNUAL_LEAVE = {
  daysPerYear: 16, // 16 ימי חופשה בסיסיים בשנה (כולל ש"ק)
  netDaysPerYear: 14, // 14 ימי חופשה נטו (לא כולל ש"ק)
  minYearsService: 5,
  additionalDayPerYearAfter5: 1, // יום נוסף לכל שנה אחרי 5 שנים
  maxDays: 28, // מקסימום ימי חופשה
} as const;

// ============================================================
// מע"מ 2026 (עלה מ-17% ל-18% ב-1.1.2025)
// מקור: רשות המסים
// ============================================================
export const VAT_2026 = {
  standard: 0.18, // 18% - שיעור רגיל
  zero: 0, // 0% - יצוא ושירותים מסויימים
  // תקרת עוסק פטור (מעודכן 2026)
  smallBusinessThreshold: 120_000, // ₪/שנה - עוסק פטור
} as const;

// ============================================================
// מס רכישה 2026 - דירה ראשונה (תושב ישראל)
// מקור: רשות המסים, מיסוי מקרקעין
// תקרות מתעדכנות ב-15.1 לפי מדד המחירים לצרכן
// ============================================================
export const PURCHASE_TAX_2026 = {
  firstHome: [
    { upTo: 1_978_745, rate: 0 }, // פטור מלא
    { upTo: 2_347_040, rate: 0.035 },
    { upTo: 6_055_070, rate: 0.05 },
    { upTo: 20_183_565, rate: 0.08 },
    { upTo: Infinity, rate: 0.10 },
  ],
  // דירה נוספת (משקיעים) - מדרגות גבוהות יותר
  additionalHome: [
    { upTo: 6_055_070, rate: 0.08 },
    { upTo: Infinity, rate: 0.10 },
  ],
} as const;

// ============================================================
// קרן השתלמות לעצמאי 2026
// מקור: רשות המסים
// ============================================================
export const STUDY_FUND_2026 = {
  maxAnnualDeposit: 20_520, // ₪ הפקדה מקסימלית עם הטבה (אומדן)
  taxDeductionPercentage: 0.045, // 4.5% מההכנסה
  exemptDepositPercentage: 0.025, // 2.5% פטור ממס
} as const;

// ============================================================
// קצבאות ילדים 2026 (חודשי)
// מקור: ביטוח לאומי
// ============================================================
export const CHILDREN_ALLOWANCE_2026 = {
  firstChild: 152,
  secondChild: 192,
  thirdChild: 192,
  fourthChild: 339,
  fifthAndAbove: 192,
} as const;

// ============================================================
// סיכום קבועים מרכזיים
// ============================================================
export const CONSTANTS_2026 = {
  TAX_BRACKETS: TAX_BRACKETS_2026,
  SURTAX: SURTAX_2026,
  CREDIT_POINT: CREDIT_POINT_2026,
  CREDIT_POINTS_BY_STATUS,
  SOCIAL_SECURITY_EMPLOYEE: SOCIAL_SECURITY_EMPLOYEE_2026,
  SOCIAL_SECURITY_SELF_EMPLOYED: SOCIAL_SECURITY_SELF_EMPLOYED_2026,
  SEVERANCE: SEVERANCE_COMPENSATION_2026,
  MINIMUM_WAGE: MINIMUM_WAGE_2026,
  RECREATION_PAY: RECREATION_PAY_2026,
  ANNUAL_LEAVE,
  VAT: VAT_2026,
  PURCHASE_TAX: PURCHASE_TAX_2026,
  STUDY_FUND: STUDY_FUND_2026,
  CHILDREN_ALLOWANCE: CHILDREN_ALLOWANCE_2026,
} as const;

// ============================================================
// תאימות לאחור (deprecated aliases)
// ============================================================
export const SEVERANCE_COMPENSATION = SEVERANCE_COMPENSATION_2026;
export const SOCIAL_SECURITY_EMPLOYEE = {
  reducedRate: SOCIAL_SECURITY_EMPLOYEE_2026.reducedRate.total,
  fullRate: SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total,
  reducedThreshold: SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly,
  maxThreshold: SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly,
} as const;
export const VAT = VAT_2026;

// ============================================================
// פונקציות עזר לחישוב מס
// ============================================================

/**
 * חישוב מס הכנסה לפני זיכויים על הכנסה שנתית
 */
export function calculateAnnualIncomeTax(annualIncome: number): number {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of TAX_BRACKETS_2026) {
    if (annualIncome <= previousLimit) break;

    const taxableInBracket = Math.min(annualIncome, bracket.upTo) - previousLimit;
    tax += taxableInBracket * bracket.rate;

    if (annualIncome <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  return tax;
}

/**
 * חישוב מס הכנסה חודשי - על שכר חודשי
 */
export function calculateMonthlyIncomeTax(monthlySalary: number): number {
  const annualIncome = monthlySalary * 12;
  return calculateAnnualIncomeTax(annualIncome) / 12;
}

/**
 * חישוב סכום זיכוי שנתי לפי מספר נקודות זיכוי
 */
export function calculateCreditAmount(creditPoints: number): number {
  return creditPoints * CREDIT_POINT_2026.annual;
}

/**
 * חישוב ביטוח לאומי + בריאות לשכיר על שכר חודשי
 */
export function calculateEmployeeSocialSecurity(monthlySalary: number): {
  reduced: number;
  full: number;
  total: number;
} {
  const cap = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const threshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const cappedSalary = Math.min(monthlySalary, cap);

  const reducedPart = Math.min(cappedSalary, threshold);
  const fullPart = Math.max(0, cappedSalary - threshold);

  const reducedAmount = reducedPart * SOCIAL_SECURITY_EMPLOYEE_2026.reducedRate.total;
  const fullAmount = fullPart * SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total;

  return {
    reduced: reducedAmount,
    full: fullAmount,
    total: reducedAmount + fullAmount,
  };
}

/**
 * חישוב מס רכישה לדירה ראשונה
 */
export function calculatePurchaseTaxFirstHome(propertyValue: number): number {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of PURCHASE_TAX_2026.firstHome) {
    if (propertyValue <= previousLimit) break;

    const taxableInBracket = Math.min(propertyValue, bracket.upTo) - previousLimit;
    tax += taxableInBracket * bracket.rate;

    if (propertyValue <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  return tax;
}

/**
 * חישוב נטו לעובד שכיר (פשוט - רק מס הכנסה + ב.ל.)
 */
export function calculateNetSalary(grossMonthlySalary: number, creditPoints: number = 2.25): {
  gross: number;
  incomeTax: number;
  creditAmount: number;
  socialSecurity: number;
  net: number;
} {
  const monthlyTax = calculateMonthlyIncomeTax(grossMonthlySalary);
  const monthlyCreditAmount = (creditPoints * CREDIT_POINT_2026.annual) / 12;
  const adjustedTax = Math.max(0, monthlyTax - monthlyCreditAmount);
  const socialSecurity = calculateEmployeeSocialSecurity(grossMonthlySalary).total;
  const net = grossMonthlySalary - adjustedTax - socialSecurity;

  return {
    gross: grossMonthlySalary,
    incomeTax: adjustedTax,
    creditAmount: monthlyCreditAmount,
    socialSecurity,
    net,
  };
}
