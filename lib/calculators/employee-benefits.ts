/**
 * 4 מחשבונים לזכויות עובדים - 2026
 *
 * 1. ימי חופשה (Annual Leave)
 * 2. דמי מחלה (Sick Pay)
 * 3. בונוס שנתי (Annual Bonus)
 * 4. מענק עבודה / NIT (Negative Income Tax)
 *
 * מקור: רשות המסים, ביטוח לאומי, חוק חופשה שנתית תשי"א-1951
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
// 1b. ימי חופשה - חישוב מורחב (2026)
// ====================================================================

/**
 * טבלת זכאות ימי חופשה לפי ותק
 * מקור: חוק חופשה שנתית תשי"א-1951, סעיף 3 (נכון 2026)
 *
 * 5 ימי עבודה בשבוע:
 *   שנות 1-4: 12, שנה 5: 15, שנה 6: 16, שנה 7: 17,
 *   שנים 8-9: 18, שנה 10: 19, שנה 11: 20, שנה 12: 21,
 *   שנה 13: 22, שנה 14+: 23
 *
 * 6 ימי עבודה בשבוע:
 *   שנות 1-4: 14, שנה 5: 16, שנה 6: 18, שנה 7: 21,
 *   שנים 8-9: 22, שנה 10: 22, שנה 11: 23, שנה 12: 24,
 *   שנה 13: 26, שנה 14+: 28
 */
export function getVacationDaysByTenure(
  yearsOfService: number,
  workDaysPerWeek: 5 | 6,
): number {
  const y = Math.max(0, yearsOfService);
  if (workDaysPerWeek === 5) {
    if (y <= 4) return 12;
    if (y === 5) return 15;
    if (y === 6) return 16;
    if (y === 7) return 17;
    if (y <= 9) return 18;
    if (y === 10) return 19;
    if (y === 11) return 20;
    if (y === 12) return 21;
    if (y === 13) return 22;
    return 23;
  } else {
    if (y <= 4) return 14;
    if (y === 5) return 16;
    if (y === 6) return 18;
    if (y === 7) return 21;
    if (y <= 9) return 22;
    if (y === 10) return 22;
    if (y === 11) return 23;
    if (y === 12) return 24;
    if (y === 13) return 26;
    return 28;
  }
}

export interface AnnualLeaveFullInput {
  /** שנות וותק שלמות */
  yearsOfService: number;
  /** חודשים נוספים (מעבר לשנים שלמות) */
  additionalMonths: number;
  /** ימי עבודה בשבוע */
  workDaysPerWeek: 5 | 6;
  /** היקף משרה (0-100) */
  partTimePercent: number;
  /** שכר חודשי ברוטו (₪) */
  monthlySalary: number;
  /** ימי חופשה שנוצלו בשנה הנוכחית */
  daysUsedThisYear: number;
  /** ימי חופשה שנוצלו בשנה הקודמת (לצורך צבירה) */
  daysUsedLastYear: number;
  /** האם מחשב עבור "אם אעזוב היום" */
  isTermination: boolean;
}

export interface AccumulationYear {
  year: number;
  entitled: number;
  used: number;
  balance: number;
  forfeitable: number;
}

export interface AnnualLeaveFullResult {
  /** זכאות שנתית (לפי חוק) */
  annualEntitlement: number;
  /** זכאות מותאמת (לפי היקף משרה) */
  adjustedEntitlement: number;
  /** זכאות לשנה הנוכחית (יחסית אם חלקית) */
  proRatedCurrentYear: number;
  /** ימים שנוצלו השנה */
  daysUsedThisYear: number;
  /** יתרה לניצול */
  remainingDays: number;
  /** ימים בסכנת חריגה (מעל שנתיים) */
  forfeitableDays: number;
  /** ערך יום חופשה (₪) */
  dailyWageValue: number;
  /** פדיון חופשה (₪) - בסיום עבודה */
  redemptionValue: number;
  /** ימי חופשה לפדיון */
  redemptionDays: number;
  /** הסבר ותק */
  tenureBasis: string;
  /** המלצות */
  recommendations: string[];
}

export function calculateAnnualLeaveFull(input: AnnualLeaveFullInput): AnnualLeaveFullResult {
  const yearsTotal = Math.max(0, input.yearsOfService);
  const additionalMonths = Math.max(0, Math.min(11, input.additionalMonths));
  const partTime = Math.max(1, Math.min(100, input.partTimePercent)) / 100;
  const monthlySalary = Math.max(0, input.monthlySalary);
  const workDays = input.workDaysPerWeek;

  // זכאות שנתית לפי ותק (משרה מלאה)
  const annualEntitlement = getVacationDaysByTenure(yearsTotal, workDays);

  // זכאות מותאמת לאחר היקף משרה
  const adjustedEntitlement = Math.round(annualEntitlement * partTime * 10) / 10;

  // חישוב יחסי לשנה הנוכחית (אם יש חודשים חלקיים)
  const totalMonthsWorked = yearsTotal * 12 + additionalMonths;
  const monthsInCurrentYear = additionalMonths > 0 ? additionalMonths : 12;
  const proRatedCurrentYear =
    Math.round((adjustedEntitlement * (monthsInCurrentYear / 12)) * 10) / 10;

  // ערך יום חופשה
  // לפי חוק: שכר חודשי / מספר ימי עבודה ממוצע בחודש
  const avgWorkDaysPerMonth = workDays === 5 ? 21.67 : 25;
  const dailyWageValue = monthlySalary > 0 ? monthlySalary / avgWorkDaysPerMonth : 0;

  const daysUsedThisYear = Math.max(0, input.daysUsedThisYear);

  // יתרה לניצול (שנה נוכחית)
  const remainingDays = Math.max(0, proRatedCurrentYear - daysUsedThisYear);

  // ימים בסכנת חריגה (מעבר לשנתיים - לפי חוק ניתן לצבור עד שנתיים)
  const daysUsedLastYear = Math.max(0, input.daysUsedLastYear);
  const lastYearEntitlement = getVacationDaysByTenure(
    Math.max(0, yearsTotal - 1),
    workDays,
  ) * partTime;
  const lastYearBalance = Math.max(0, lastYearEntitlement - daysUsedLastYear);
  const forfeitableDays = lastYearBalance; // מה שנשאר מהשנה שעברה בסכנה

  // פדיון חופשה בסיום עבודה
  // בסיום עבודה: ניתן לפדות כל הימים הצבורים
  const redemptionDays = input.isTermination ? remainingDays + forfeitableDays : 0;
  const redemptionValue = redemptionDays * dailyWageValue;

  // תיאור ותק
  const tenureBasis = (() => {
    if (totalMonthsWorked < 12) return `${additionalMonths} חודשים - עדיין בשנה הראשונה`;
    if (additionalMonths > 0) {
      return `${yearsTotal} שנים ו-${additionalMonths} חודשים - ${workDays} ימי עבודה בשבוע`;
    }
    return `${yearsTotal} שנות וותק - ${workDays} ימי עבודה בשבוע`;
  })();

  // המלצות
  const recommendations: string[] = [];
  if (forfeitableDays > 0) {
    recommendations.push(
      `יש לך ${forfeitableDays.toFixed(1)} ימים מהשנה הקודמת שעלולים להתיישן — נסה לנצל אותם בהקדם.`,
    );
  }
  if (remainingDays > 10 && !input.isTermination) {
    recommendations.push('שקול לתכנן חופשה מראש — החוק מחייב לקחת לפחות 7 ימים רצופים בשנה.');
  }
  if (partTime < 1 && input.isTermination) {
    recommendations.push(`עבדת ב-${Math.round(partTime * 100)}% משרה — הפדיון מחושב לפי ערך יום במשרה חלקית.`);
  }
  if (monthlySalary > 0 && redemptionDays > 0) {
    recommendations.push(
      `פדיון החופשה המשוער: ${Math.round(redemptionValue).toLocaleString('he-IL')} ₪ (${redemptionDays.toFixed(1)} ימים × ${Math.round(dailyWageValue).toLocaleString('he-IL')} ₪/יום).`,
    );
  }
  if (totalMonthsWorked < 75 / 25) {
    recommendations.push('שים לב: החוק חל רק לאחר 75 ימי עבודה בפועל אצל אותו מעסיק.');
  }

  return {
    annualEntitlement,
    adjustedEntitlement,
    proRatedCurrentYear,
    daysUsedThisYear,
    remainingDays,
    forfeitableDays,
    dailyWageValue,
    redemptionValue,
    redemptionDays,
    tenureBasis,
    recommendations,
  };
}

export interface RedemptionInput {
  /** ימי חופשה צבורים לפדיון */
  accumulatedDays: number;
  /** שכר חודשי ברוטו */
  monthlySalary: number;
  /** ימי עבודה בשבוע */
  workDaysPerWeek: 5 | 6;
}

export interface RedemptionResult {
  /** ימים לפדיון */
  daysToRedeem: number;
  /** ערך יום עבודה */
  dailyWage: number;
  /** סכום פדיון כולל */
  totalRedemption: number;
  /** הסבר */
  explanation: string;
}

/**
 * חישוב פדיון חופשה (בעת סיום עבודה)
 * מקור: חוק חופשה שנתית, סעיף 13 - פדיון בעת סיום עבודה
 */
export function calculateRedemption(input: RedemptionInput): RedemptionResult {
  const avgWorkDaysPerMonth = input.workDaysPerWeek === 5 ? 21.67 : 25;
  const dailyWage = input.monthlySalary > 0 ? input.monthlySalary / avgWorkDaysPerMonth : 0;
  const daysToRedeem = Math.max(0, input.accumulatedDays);
  const totalRedemption = daysToRedeem * dailyWage;

  const explanation =
    `${daysToRedeem.toFixed(1)} ימים × ${Math.round(dailyWage).toLocaleString('he-IL')} ₪ ` +
    `(שכר ${input.monthlySalary.toLocaleString('he-IL')} ₪ / ${avgWorkDaysPerMonth} ימי עבודה ממוצע)`;

  return { daysToRedeem, dailyWage, totalRedemption, explanation };
}

export interface AccumulationInput {
  /** שנות וותק */
  yearsOfService: number;
  /** ימי עבודה בשבוע */
  workDaysPerWeek: 5 | 6;
  /** ימי חופשה שנוצלו בסה"כ (כל הצבירה) */
  totalDaysUsed: number;
  /** היקף משרה (0-100) */
  partTimePercent: number;
}

export interface AccumulationResult {
  /** סך ימי חופשה שנצברו (לפי ותק) */
  totalAccumulated: number;
  /** ימים שנוצלו */
  totalUsed: number;
  /** יתרה */
  balance: number;
  /** ימים שעלולים לאבד (מעל שנתיים) */
  atRisk: number;
  /** פירוט לפי שנה */
  yearlyBreakdown: AccumulationYear[];
}

/**
 * חישוב צבירת חופשה לאורך שנים
 * לפי חוק ניתן לצבור עד 2 שנות חופשה - שאר נאבד (בתנאים מסויימים)
 */
export function calculateAccumulation(input: AccumulationInput): AccumulationResult {
  const partTimeFactor = Math.max(1, Math.min(100, input.partTimePercent)) / 100;
  const years = Math.max(1, Math.ceil(input.yearsOfService));
  let runningBalance = 0;
  let totalAccumulated = 0;
  const yearlyBreakdown: AccumulationYear[] = [];
  let remainingUsed = Math.max(0, input.totalDaysUsed);

  for (let y = 1; y <= years; y++) {
    const entitled = getVacationDaysByTenure(y, input.workDaysPerWeek) * partTimeFactor;
    totalAccumulated += entitled;

    // ניצול: מחלקים את הניצול הכולל שווה בשווה (אמדן)
    const usedThisYear = Math.min(remainingUsed, entitled);
    remainingUsed -= usedThisYear;
    runningBalance = runningBalance + entitled - usedThisYear;

    // ימים שנצברו יותר מ-2 שנות חופשה (יאבדו)
    const twoYearsCap =
      getVacationDaysByTenure(y, input.workDaysPerWeek) *
      partTimeFactor *
      2;
    const forfeitable = Math.max(0, runningBalance - twoYearsCap);

    yearlyBreakdown.push({
      year: y,
      entitled: Math.round(entitled * 10) / 10,
      used: Math.round(usedThisYear * 10) / 10,
      balance: Math.round(runningBalance * 10) / 10,
      forfeitable: Math.round(forfeitable * 10) / 10,
    });
  }

  const totalUsed = Math.max(0, input.totalDaysUsed) - remainingUsed;
  const balance = Math.max(0, totalAccumulated - totalUsed);
  const lastYear = yearlyBreakdown[yearlyBreakdown.length - 1];
  const atRisk = lastYear ? lastYear.forfeitable : 0;

  return {
    totalAccumulated: Math.round(totalAccumulated * 10) / 10,
    totalUsed: Math.round(totalUsed * 10) / 10,
    balance: Math.round(balance * 10) / 10,
    atRisk: Math.round(atRisk * 10) / 10,
    yearlyBreakdown,
  };
}

export interface PartialYearInput {
  /** חודשים שעבד בשנה הנוכחית (1-12) */
  monthsWorked: number;
  /** שנות וותק (כולל השנה הנוכחית) */
  yearsOfService: number;
  /** ימי עבודה בשבוע */
  workDaysPerWeek: 5 | 6;
  /** היקף משרה (0-100) */
  partTimePercent: number;
}

export interface PartialYearResult {
  /** זכאות שנתית מלאה */
  fullYearEntitlement: number;
  /** זכאות יחסית לחודשים שעבד */
  proRatedEntitlement: number;
  /** חישוב מפורט */
  breakdown: string;
}

/**
 * חישוב ימי חופשה יחסיים לשנה חלקית
 * רלוונטי לעובד שעזב באמצע שנה
 */
export function calculatePartialYear(input: PartialYearInput): PartialYearResult {
  const months = Math.max(1, Math.min(12, input.monthsWorked));
  const partTime = Math.max(1, Math.min(100, input.partTimePercent)) / 100;
  const fullYearEntitlement = getVacationDaysByTenure(input.yearsOfService, input.workDaysPerWeek);
  const proRatedEntitlement = Math.round((fullYearEntitlement * partTime * (months / 12)) * 10) / 10;

  const breakdown =
    `${fullYearEntitlement} ימים × ${months}/12 חודשים` +
    (partTime < 1 ? ` × ${Math.round(partTime * 100)}% משרה` : '') +
    ` = ${proRatedEntitlement} ימים`;

  return { fullYearEntitlement, proRatedEntitlement, breakdown };
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
