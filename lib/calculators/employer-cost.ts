/**
 * מחשבון עלות מעסיק - ישראל 2026
 *
 * חישוב מקיף של עלות העסקת עובד:
 * - שכר ברוטו
 * - ביטוח לאומי מעסיק (שיעורים מדורגים: 4.51% עד 7,522 ₪, 7.6% מעל)
 * - הפרשות פנסיה ופיצויים (6.5% פנסיה + 6%-8.33% פיצויים)
 * - קרן השתלמות (אופציונלי, 7.5% מעסיק)
 * - דמי הבראה (418 ₪/יום מגזר פרטי, ימים לפי וותק)
 * - ימי חופשה (16 בסיס + 1 לכל שנה אחרי 5)
 * - ימי מחלה (חישוב לפי 25% ניצול ממוצע)
 * - הוצאות נסיעה
 * - הטבות נוספות
 *
 * מקורות (אומת 2026-05-03):
 * - ביטוח לאומי: btl.gov.il
 * - חוק פנסיה חובה: צו הרחבה
 * - חוק חופשה שנתית התשי"א-1951
 * - צו ההרחבה לדמי הבראה
 */

import {
  SOCIAL_SECURITY_EMPLOYEE_2026,
  RECREATION_PAY_2026,
  ANNUAL_LEAVE,
  MINIMUM_WAGE_2026,
} from '@/lib/constants/tax-2026';

export type EmploymentType = 'regular' | 'part-time' | 'hourly';
export type TransportationType = 'none' | 'public' | 'car' | 'company';

export interface EmployerCostInput {
  // שכר
  grossSalary: number;
  employmentType: EmploymentType;
  partTimePercentage?: number; // אם part-time
  hourlyRate?: number; // אם hourly
  hoursPerMonth?: number; // אם hourly

  // וותק
  yearsOfService: number;

  // פנסיה
  pensionEmployerRate: number; // % - ברירת מחדל 6.5
  compensationRate: number; // % - ברירת מחדל 6 או 8.33
  hasEducationFund: boolean;
  educationFundEmployerRate?: number; // % - ברירת מחדל 7.5

  // הבראה / חופשה / מחלה
  recoveryDays?: number; // ניתן לדריסה, אחרת לפי וותק
  vacationDays?: number; // ניתן לדריסה, אחרת לפי וותק
  sickDays?: number; // ברירת מחדל 18
  recoveryRatePerDay?: number; // ברירת מחדל 418 ₪

  // נסיעות
  transportationType: TransportationType;
  transportationCost?: number; // ₪/חודש

  // הטבות נוספות (חודשיות)
  monthlyBenefits?: number;
  // הטבות שנתיות (יחולקו ל-12)
  yearlyBenefits?: number;
}

export interface EmployerCostResult {
  // בסיס
  baseSalary: number;
  // מרכיבי עלות חודשיים
  nationalInsurance: number;
  pensionEmployer: number;
  compensation: number;
  educationFundEmployer: number;
  recoveryPay: number;
  vacationCost: number;
  sickDaysCost: number;
  transportationCost: number;
  benefitsCost: number;
  // סיכום
  totalMonthlyCost: number;
  totalYearlyCost: number;
  costToSalaryRatio: number; // עלות / שכר (1.30 = 30% מעל לשכר)
  premiumPercentage: number; // % תוספת מעל לשכר
  // פירוט הימים שחושבו
  effectiveRecoveryDays: number;
  effectiveVacationDays: number;
  effectiveSickDays: number;
  // ולידציה
  warning?: string;
}

/** מחזיר ימי הבראה לפי וותק (מגזר פרטי) */
export function getRecoveryDaysByYears(years: number): number {
  if (years < 1) return 0; // לא זכאי בשנה הראשונה
  if (years < 4) return 6;
  if (years < 11) return 7;
  if (years < 16) return 8;
  if (years < 20) return 9;
  return 10;
}

/** מחזיר ימי חופשה שנתיים לפי וותק (5 ימי עבודה בשבוע) */
export function getVacationDaysByYears(years: number): number {
  // 12 ימים עד 4 שנים, ואז עולה
  if (years <= 4) return 12;
  if (years === 5) return 14;
  if (years === 6) return 16;
  if (years === 7) return 18;
  if (years === 8) return 19;
  if (years >= 9 && years <= 10) return 20;
  if (years === 11) return 21;
  if (years === 12) return 22;
  if (years === 13) return 23;
  if (years === 14) return 24;
  return 26; // 14+
}

export function calculateEmployerCost(input: EmployerCostInput): EmployerCostResult {
  // 1. חישוב שכר בסיס לפי סוג העסקה
  let baseSalary = Math.max(0, input.grossSalary);

  if (input.employmentType === 'hourly') {
    const rate = input.hourlyRate ?? 0;
    const hours = input.hoursPerMonth ?? 182;
    baseSalary = rate * hours;
  } else if (input.employmentType === 'part-time') {
    const pct = input.partTimePercentage ?? 100;
    baseSalary = input.grossSalary * (pct / 100);
  }

  let warning: string | undefined;
  if (baseSalary > 0 && baseSalary < MINIMUM_WAGE_2026.monthly) {
    warning = `השכר נמוך משכר המינימום (${MINIMUM_WAGE_2026.monthly} ₪/חודש)`;
  }

  // 2. ביטוח לאומי מעסיק - מדורג
  const blThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly; // 7,522
  const blMaxThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly; // 51,910
  const reducedRate = SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.reducedRate; // 4.51%
  const fullRate = SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.fullRate; // 7.6%

  let nationalInsurance = 0;
  if (baseSalary <= blThreshold) {
    nationalInsurance = baseSalary * reducedRate;
  } else if (baseSalary <= blMaxThreshold) {
    nationalInsurance = blThreshold * reducedRate + (baseSalary - blThreshold) * fullRate;
  } else {
    nationalInsurance =
      blThreshold * reducedRate + (blMaxThreshold - blThreshold) * fullRate;
  }

  // 3. פנסיה ופיצויים
  const pensionEmployer = baseSalary * (input.pensionEmployerRate / 100);
  const compensation = baseSalary * (input.compensationRate / 100);

  // 4. קרן השתלמות
  const eduFundRate = input.hasEducationFund
    ? (input.educationFundEmployerRate ?? 7.5) / 100
    : 0;
  const educationFundEmployer = baseSalary * eduFundRate;

  // 5. דמי הבראה (חודשי = שנתי / 12)
  const effectiveRecoveryDays =
    input.recoveryDays ?? getRecoveryDaysByYears(input.yearsOfService);
  const recoveryRate = input.recoveryRatePerDay ?? RECREATION_PAY_2026.privateSectorPerDay;
  const recoveryPay = (effectiveRecoveryDays * recoveryRate) / 12;

  // 6. ימי חופשה ומחלה (חישוב יחסי)
  const effectiveVacationDays =
    input.vacationDays ?? getVacationDaysByYears(input.yearsOfService);
  const effectiveSickDays = input.sickDays ?? 18;

  // עלות יומית (לפי 22 ימי עבודה בחודש)
  const dailySalary = baseSalary / 22;

  // ימי חופשה - עלות מלאה של היום
  const vacationCost = (effectiveVacationDays * dailySalary) / 12;
  // ימי מחלה - מניחים ניצול 25% בממוצע
  const sickDaysCost = (effectiveSickDays * 0.25 * dailySalary) / 12;

  // 7. נסיעות
  let transportationCost = 0;
  if (input.transportationType !== 'none') {
    transportationCost = input.transportationCost ?? 0;
  }

  // 8. הטבות
  const benefitsCost =
    (input.monthlyBenefits ?? 0) + (input.yearlyBenefits ?? 0) / 12;

  // 9. סה"כ
  const totalMonthlyCost =
    baseSalary +
    nationalInsurance +
    pensionEmployer +
    compensation +
    educationFundEmployer +
    recoveryPay +
    vacationCost +
    sickDaysCost +
    transportationCost +
    benefitsCost;

  const totalYearlyCost = totalMonthlyCost * 12;
  const costToSalaryRatio = baseSalary > 0 ? totalMonthlyCost / baseSalary : 0;
  const premiumPercentage = (costToSalaryRatio - 1) * 100;

  return {
    baseSalary,
    nationalInsurance,
    pensionEmployer,
    compensation,
    educationFundEmployer,
    recoveryPay,
    vacationCost,
    sickDaysCost,
    transportationCost,
    benefitsCost,
    totalMonthlyCost,
    totalYearlyCost,
    costToSalaryRatio,
    premiumPercentage,
    effectiveRecoveryDays,
    effectiveVacationDays,
    effectiveSickDays,
    warning,
  };
}

/** פרופילי תפקידים (לשימוש מהיר ב-UI) */
export const JOB_PROFILES_2026 = {
  custom: { label: 'התאמה אישית', salary: 12_000, eduFund: false, transportation: 'none' as const },
  developer: { label: 'מפתח תוכנה', salary: 25_000, eduFund: true, transportation: 'public' as const },
  manager: { label: 'מנהל/ת', salary: 35_000, eduFund: true, transportation: 'company' as const },
  sales: { label: 'איש/אשת מכירות', salary: 15_000, eduFund: false, transportation: 'car' as const },
  admin: { label: 'מנהל/ת משרד', salary: 12_000, eduFund: false, transportation: 'public' as const },
  tech: { label: 'טכנאי/ת', salary: 14_000, eduFund: false, transportation: 'car' as const },
  designer: { label: 'מעצב/ת', salary: 17_000, eduFund: false, transportation: 'public' as const },
} as const;

export type JobProfile = keyof typeof JOB_PROFILES_2026;
