/**
 * 4 מחשבונים לזכויות עובדים - 2026
 *
 * 1. ימי חופשה (Annual Leave)
 * 2. דמי מחלה (Sick Pay)
 * 3. בונוס שנתי (Annual Bonus)
 * 4. מענק עבודה / NIT (Negative Income Tax)
 *
 * מקור: רשות המסים, ביטוח לאומי, חוק חופשה שנתית
 */

import { TAX_BRACKETS_2026, CREDIT_POINT_2026 } from '@/lib/constants/tax-2026';

// ====================================================================
// 1. ימי חופשה
// ====================================================================

export interface AnnualLeaveInput {
  /** שנות וותק */
  yearsOfService: number;
  /** ימי עבודה בשבוע (5 או 6) */
  workDaysPerWeek: 5 | 6;
}

export interface AnnualLeaveResult {
  /** ימי חופשה זכאיים בשנה */
  daysEntitled: number;
  /** ימי עבודה בפועל (לא כולל סופ"ש) */
  actualWorkDays: number;
  /** ימי חופשה לפדיון (אם פוטר) */
  redemptionDays: number;
  /** מקור החישוב */
  basis: string;
}

export function calculateAnnualLeave(input: AnnualLeaveInput): AnnualLeaveResult {
  const years = Math.max(0, input.yearsOfService);

  // לפי חוק חופשה שנתית - 5 ימי עבודה
  const fiveDayTable: Record<string, number> = {
    '0-4': 12,
    '5': 14,
    '6': 16,
    '7': 18,
    '8': 19,
    '9-10': 20,
    '11': 21,
    '12': 22,
    '13': 23,
    '14+': 24,
  };

  let daysEntitled: number;
  let basis: string;

  if (input.workDaysPerWeek === 5) {
    if (years <= 4) {
      daysEntitled = 12;
      basis = '12 ימים בסיסי';
    } else if (years === 5) daysEntitled = 14;
    else if (years === 6) daysEntitled = 16;
    else if (years === 7) daysEntitled = 18;
    else if (years === 8) daysEntitled = 19;
    else if (years <= 10) daysEntitled = 20;
    else if (years === 11) daysEntitled = 21;
    else if (years === 12) daysEntitled = 22;
    else if (years === 13) daysEntitled = 23;
    else daysEntitled = 24;
    basis = `${years} שנות וותק - 5 ימי עבודה בשבוע`;
  } else {
    // 6 ימי עבודה - 14 ימים בסיסי
    if (years <= 4) daysEntitled = 14;
    else if (years === 5) daysEntitled = 16;
    else if (years === 6) daysEntitled = 18;
    else if (years === 7) daysEntitled = 21;
    else if (years <= 10) daysEntitled = 22;
    else if (years <= 13) daysEntitled = 26;
    else daysEntitled = 28;
    basis = `${years} שנות וותק - 6 ימי עבודה בשבוע`;
  }

  // ימי עבודה בפועל = הימים השנתיים - סופ"שים - חגים
  const yearWorkDays = input.workDaysPerWeek === 5 ? 250 : 290;
  const actualWorkDays = yearWorkDays - daysEntitled;

  return {
    daysEntitled,
    actualWorkDays,
    redemptionDays: daysEntitled, // לרוב ניתן לפדות עד שנת חופשה אחת
    basis,
  };
}

// ====================================================================
// 2. דמי מחלה
// ====================================================================

export interface SickPayInput {
  /** ימי מחלה בתקופה */
  sickDays: number;
  /** שכר חודשי ברוטו */
  monthlySalary: number;
  /** האם זה רצף ימי מחלה אחד */
  consecutive: boolean;
}

export interface SickPayResult {
  /** עלות ימי מחלה לעובד (אם לא משולמים) */
  totalUnpaidLoss: number;
  /** תשלום שיקבל (אם המעסיק משלם) */
  totalPayment: number;
  /** פירוט לפי ימים */
  daysPayment: Array<{ day: number; rate: number; amount: number }>;
  /** הסבר */
  explanation: string;
}

export function calculateSickPay(input: SickPayInput): SickPayResult {
  const sickDays = Math.max(0, input.sickDays);
  const dailySalary = input.monthlySalary / 22; // 22 ימי עבודה בחודש

  const daysPayment: Array<{ day: number; rate: number; amount: number }> = [];
  let totalPayment = 0;

  for (let day = 1; day <= sickDays; day++) {
    let rate: number;
    if (day === 1) rate = 0;
    else if (day === 2 || day === 3) rate = 0.5;
    else rate = 1;

    const amount = dailySalary * rate;
    daysPayment.push({ day, rate, amount });
    totalPayment += amount;
  }

  const totalGross = sickDays * dailySalary;
  const totalUnpaidLoss = totalGross - totalPayment;

  let explanation = `ימי מחלה: ${sickDays}. `;
  if (sickDays >= 4) {
    explanation += 'יום 1 ללא תשלום, ימים 2-3 ב-50%, יום 4+ במלוא השכר.';
  } else if (sickDays === 1) {
    explanation += 'יום 1 לבד - ללא תשלום (אובד שכר).';
  }

  return {
    totalUnpaidLoss,
    totalPayment,
    daysPayment,
    explanation,
  };
}

// ====================================================================
// 3. בונוס שנתי - חישוב נטו
// ====================================================================

export interface AnnualBonusInput {
  /** סכום הבונוס ברוטו (₪) */
  grossBonus: number;
  /** משכורת חודשית רגילה (לחישוב מס שולי) */
  regularMonthlySalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
}

export interface AnnualBonusResult {
  /** מס שולי שיוצא מהבונוס */
  marginalTaxRate: number;
  /** מס בש"ח */
  taxAmount: number;
  /** ב.ל. */
  socialSecurity: number;
  /** נטו לעובד */
  netBonus: number;
  /** אחוז נטו */
  netPercentage: number;
}

export function calculateAnnualBonus(input: AnnualBonusInput): AnnualBonusResult {
  const annualSalary = input.regularMonthlySalary * 12;
  const annualWithBonus = annualSalary + input.grossBonus;

  // חישוב המס לפני ואחרי הבונוס - ההפרש = מס על הבונוס
  function tax(amt: number): number {
    let r = amt;
    let t = 0;
    let p = 0;
    for (const b of TAX_BRACKETS_2026) {
      if (r <= 0) break;
      const sz = b.upTo - p;
      const taxable = Math.min(r, sz);
      t += taxable * b.rate;
      r -= taxable;
      p = b.upTo;
    }
    return Math.max(0, t - input.creditPoints * CREDIT_POINT_2026.annual);
  }

  const taxBefore = tax(annualSalary);
  const taxAfter = tax(annualWithBonus);
  const taxOnBonus = taxAfter - taxBefore;

  const marginalRate = input.grossBonus > 0 ? taxOnBonus / input.grossBonus : 0;

  // ב.ל. - אם הבונוס מעל התקרה, חלקו לא חייב
  const annualMaxBL = 51_910 * 12;
  const blRate = input.grossBonus + annualSalary <= annualMaxBL ? 0.1217 : 0.05;
  const socialSecurity = input.grossBonus * blRate;

  const netBonus = input.grossBonus - taxOnBonus - socialSecurity;
  const netPercentage = input.grossBonus > 0 ? (netBonus / input.grossBonus) * 100 : 0;

  return {
    marginalTaxRate: marginalRate,
    taxAmount: taxOnBonus,
    socialSecurity,
    netBonus,
    netPercentage,
  };
}

// ====================================================================
// 4. מענק עבודה - Negative Income Tax (NIT)
// ====================================================================

export interface NITInput {
  /** הכנסה שנתית מעבודה (₪) */
  annualEarnedIncome: number;
  /** האם הורה */
  isParent: boolean;
  /** מספר ילדים מתחת ל-18 */
  numberOfChildren: number;
  /** האם הורה יחיד */
  isSingleParent: boolean;
  /** גיל */
  age: number;
}

export interface NITResult {
  /** האם זכאי */
  isEligible: boolean;
  /** סכום מענק שנתי */
  annualGrant: number;
  /** סכום חודשי משוער */
  monthlyEquivalent: number;
  /** סף הכנסה תחתון */
  lowerThreshold: number;
  /** סף הכנסה עליון */
  upperThreshold: number;
  /** סיבה לחוסר זכאות (אם רלוונטי) */
  ineligibilityReason?: string;
}

export function calculateNIT(input: NITInput): NITResult {
  // נתוני 2026 - מענק עבודה
  const minIncomeForGrant = 24_960; // הכנסה מינימלית
  const maxIncomeForFullGrant = 67_320;
  const maxIncomeForAnyGrant = input.isParent ? 99_960 : 78_360;

  // סכומי המענק (משוערים 2026)
  const baseMaxGrant = 5_500;
  const parentBonus = 1_500;
  const singleParentBonus = 3_000;

  // בדיקות זכאות
  if (input.age < 23 && !input.isParent) {
    return {
      isEligible: false,
      annualGrant: 0,
      monthlyEquivalent: 0,
      lowerThreshold: minIncomeForGrant,
      upperThreshold: maxIncomeForAnyGrant,
      ineligibilityReason: 'מתחת לגיל 23 וללא ילדים',
    };
  }

  if (input.age >= 56 && input.age <= 60 && !input.isParent) {
    // אנשים בני 56-60 ללא ילדים זכאים גם
  }

  if (input.annualEarnedIncome < minIncomeForGrant) {
    return {
      isEligible: false,
      annualGrant: 0,
      monthlyEquivalent: 0,
      lowerThreshold: minIncomeForGrant,
      upperThreshold: maxIncomeForAnyGrant,
      ineligibilityReason: `הכנסה נמוכה מדי - מינימום ${minIncomeForGrant.toLocaleString()} ₪`,
    };
  }

  if (input.annualEarnedIncome > maxIncomeForAnyGrant) {
    return {
      isEligible: false,
      annualGrant: 0,
      monthlyEquivalent: 0,
      lowerThreshold: minIncomeForGrant,
      upperThreshold: maxIncomeForAnyGrant,
      ineligibilityReason: `הכנסה גבוהה מהתקרה (${maxIncomeForAnyGrant.toLocaleString()} ₪)`,
    };
  }

  // חישוב המענק
  let maxGrant = baseMaxGrant;
  if (input.isParent) maxGrant += parentBonus * input.numberOfChildren;
  if (input.isSingleParent) maxGrant += singleParentBonus;

  let annualGrant: number;
  if (input.annualEarnedIncome <= maxIncomeForFullGrant) {
    // עליה לינארית
    annualGrant =
      maxGrant *
      ((input.annualEarnedIncome - minIncomeForGrant) /
        (maxIncomeForFullGrant - minIncomeForGrant));
  } else {
    // ירידה לינארית
    annualGrant =
      maxGrant *
      ((maxIncomeForAnyGrant - input.annualEarnedIncome) /
        (maxIncomeForAnyGrant - maxIncomeForFullGrant));
  }

  annualGrant = Math.max(0, Math.min(maxGrant, annualGrant));
  const monthlyEquivalent = annualGrant / 12;

  return {
    isEligible: true,
    annualGrant,
    monthlyEquivalent,
    lowerThreshold: minIncomeForGrant,
    upperThreshold: maxIncomeForAnyGrant,
  };
}
