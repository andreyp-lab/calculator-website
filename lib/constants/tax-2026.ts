/**
 * קבועים פיננסיים לשנת המס 2026
 * אומתו: 2026-05-03
 * מקורות ראשיים: רשות המסים, ביטוח לאומי, לוח עזר לחישוב מס הכנסה
 *
 * הערה: ערכים אלו צריכים לעדכן בתחילת כל שנת מס (ינואר)
 */

// מדרגות מס הכנסה 2026 (שכיר)
export const TAX_BRACKETS_2026 = [
  {
    upTo: 84_120,
    rate: 0.10,
    monthlyBase: 7_010,
    label: 'דרגה ראשונה (0%-10%)',
  },
  {
    upTo: 120_720,
    rate: 0.14,
    monthlyBase: 10_060,
    label: 'דרגה שנייה (10%-14%)',
  },
  {
    upTo: 193_800,
    rate: 0.20,
    monthlyBase: 16_150,
    label: 'דרגה שלישית (14%-20%)',
  },
  {
    upTo: 269_280,
    rate: 0.31,
    monthlyBase: 22_440,
    label: 'דרגה רביעית (20%-31%)',
  },
  {
    upTo: 560_280,
    rate: 0.35,
    monthlyBase: 46_690,
    label: 'דרגה חמישית (31%-35%)',
  },
  {
    upTo: 721_560,
    rate: 0.47,
    monthlyBase: 60_130,
    label: 'דרגה שישית (35%-47%)',
  },
  {
    upTo: Infinity,
    rate: 0.50,
    monthlyBase: Infinity,
    label: 'דרגה שביעית (47%-50%)',
  },
] as const;

// שווי נקודת זיכוי 2026
export const CREDIT_POINT_2026 = {
  monthly: 242,
  annual: 2_904,
} as const;

// נקודות זיכוי לפי מצב אישי
export const CREDIT_POINTS_BY_STATUS = {
  resident: 2.25, // תושב בן 65 ומעלה
  woman: 2.75, // אישה
  childAge0to2: 1.5,
  childAge3to5: 2.5,
  childAge6to17: 1,
  singleParent: 1,
  disabledPerson: 2,
  newImmigrant: 1, // לעולים חדשים בשנות החזקה
  releasedSoldier: 1, // חייל משוחרר
} as const;

// ביטוח לאומי - שכיר
export const SOCIAL_SECURITY_EMPLOYEE = {
  reducedRate: 0.0386, // שיעור מופחת (עד התקרה)
  fullRate: 0.07, // שיעור מלא
  reducedThreshold: 7_522, // חודשי - מטבע
  maxThreshold: 50_695, // חודשי - מקסימום תקרה
  deductionPercentage: 0.07, // ניכוי מהשכר
} as const;

// ביטוח לאומי - עצמאי
export const SOCIAL_SECURITY_SELF_EMPLOYED = {
  reducedRate: 0.0447, // שיעור מופחת
  fullRate: 0.1283, // שיעור מלא
  reducedThreshold: 7_522,
  maxThreshold: 50_695,
} as const;

// דמי בריאות
export const HEALTH_INSURANCE = {
  reducedRate: 0.031,
  fullRate: 0.031,
  reducedThreshold: 7_522,
  maxThreshold: 50_695,
} as const;

// פיצויי פיטורין
export const SEVERANCE_COMPENSATION = {
  annualExemptionCeiling: 13_750, // תקרת פטור ממס לשנה
  exemptionMultiplier: 1.5, // 1.5 משכורות לכל שנת עבודה
  yearsRequired: 1, // שנה מינימלית לזכאות
} as const;

// שכר מינימום 2026
export const MINIMUM_WAGE = {
  hourly: 37.20, // שכר מינימום לשעה
  monthlyBasic: 8.8 * 37.2 * 21.81, // בערך 6,800 ש"ח
  monthlyActual: 6_800, // משוער
} as const;

// דמי הבראה
export const RECREATION_PAY = {
  daysPerYear: 10,
  payPerDay: 1.5, // 1.5 ימי שכר ממוצע
} as const;

// חופשה שנתית
export const ANNUAL_LEAVE = {
  daysPerYear: 21,
  minYearsService: 5, // לאחר 5 שנות עבודה
  additionalDays: 1, // יום כל שנה (עד 27 יום)
} as const;

// מס יסף
export const NATIONAL_INSURANCE_TAX = {
  rate: 0.03, // 3%
  threshold: 721_560, // מעבר לסכום זה
} as const;

// מע"מ
export const VAT = {
  standard: 0.17, // 17%
  special: 0.09, // 9%
  reduced: 0, // 0%
  threshold: 85_000, // עבור עצמאיים
} as const;

// מס רכישה
export const PURCHASE_TAX = {
  firstHome: {
    upTo: 2_250_000,
    rate: 0.05,
  },
  firstHomeHigh: {
    above: 2_250_000,
    rate: 0.08,
  },
  secondHome: {
    rate: 0.10,
  },
} as const;

// קרן השתלמות (עצמאי)
export const STUDY_FUND = {
  maxDeduction: 4_350, // מקסימום הפקדה שנתית
  taxExemptionPercentage: 1, // 100% פטור
} as const;

// יוצא ישראל (תושב חוזר)
export const RETURNING_RESIDENT = {
  taxExemptYears: 10, // 10 שנים פטור על הכנסה מחו"ל
  creditPoints: 0.75, // נקודות זיכוי מוגבלות
} as const;

// מס לעולה חדש
export const NEW_IMMIGRANT = {
  taxExemptYears: 10, // 10 שנים בעלות
  creditPoints: 0.75,
  threshold: 500_000, // על הכנסה שנתית עד סכום זה
} as const;

// עזרה ממשלתית
export const GOVERNMENT_BENEFITS = {
  childrenAllowance: {
    oneChild: 135,
    twoChildren: 294,
    threeChildren: 458,
    fourthChildPlus: 163,
  },
} as const;

// סיכומי קבועים
export const CONSTANTS_2026 = {
  TAX_BRACKETS: TAX_BRACKETS_2026,
  CREDIT_POINT: CREDIT_POINT_2026,
  SOCIAL_SECURITY_EMPLOYEE,
  SOCIAL_SECURITY_SELF_EMPLOYED,
  HEALTH_INSURANCE,
  SEVERANCE: SEVERANCE_COMPENSATION,
  MINIMUM_WAGE,
  VAT,
  NEW_IMMIGRANT,
} as const;

// פונקציה עזר לחישוב מס בסיסי
export function calculateBaseTax(grossIncome: number): number {
  let tax = 0;

  for (const bracket of TAX_BRACKETS_2026) {
    if (grossIncome <= bracket.upTo) {
      // הכנסה תחת התקרה של דרגה זו
      const taxableInThisBracket =
        bracket === TAX_BRACKETS_2026[0]
          ? grossIncome
          : grossIncome - TAX_BRACKETS_2026[TAX_BRACKETS_2026.indexOf(bracket) - 1].upTo;

      tax += taxableInThisBracket * bracket.rate;
      break;
    } else {
      // כל הדרגה עד התקרה שלה
      const previousBracketLimit =
        TAX_BRACKETS_2026.indexOf(bracket) === 0
          ? 0
          : TAX_BRACKETS_2026[TAX_BRACKETS_2026.indexOf(bracket) - 1].upTo;

      const taxableInThisBracket = bracket.upTo - previousBracketLimit;
      tax += taxableInThisBracket * bracket.rate;
    }
  }

  return tax;
}
