/**
 * מחשבון שכר נטו/ברוטו מקיף - 2026
 *
 * המחשבון הכי פופולרי בישראל. כולל:
 * - מס הכנסה לפי מדרגות
 * - ביטוח לאומי + בריאות (שכיר)
 * - ניכוי פנסיה (חובה 6%)
 * - ניכוי קרן השתלמות (אופציונלי 2.5%)
 * - נקודות זיכוי
 * - עלות מעסיק כוללת
 * - שכר שעתי משוער
 *
 * מקור: רשות המסים, ביטוח לאומי 2026
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_EMPLOYEE_2026,
} from '@/lib/constants/tax-2026';

export interface SalaryNetGrossInput {
  /** שכר ברוטו חודשי */
  grossSalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** האם להפריש לפנסיה (6% עובד) */
  pensionEnabled: boolean;
  /** האם להפריש לקרן השתלמות (2.5% עובד) */
  studyFundEnabled: boolean;
  /** שעות עבודה חודשיות (לחישוב שכר שעתי) */
  monthlyWorkHours: number;
}

export interface SalaryNetGrossResult {
  grossSalary: number;
  // ניכויים
  incomeTax: number;
  socialSecurity: number; // ב.ל. + בריאות
  pensionDeduction: number;
  studyFundDeduction: number;
  totalDeductions: number;
  // נטו
  netSalary: number;
  netPercentage: number;
  // לעובד
  hourlyRate: number;
  // עלויות מעסיק
  employerSocialSecurity: number;
  employerPension: number;
  employerStudyFund: number;
  totalEmployerCost: number;
  costToNetRatio: number;
}

function calculateIncomeTax(annualIncome: number, creditPoints: number): number {
  let remaining = annualIncome;
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const sz = b.upTo - prev;
    const t = Math.min(remaining, sz);
    tax += t * b.rate;
    remaining -= t;
    prev = b.upTo;
  }
  return Math.max(0, tax - creditPoints * CREDIT_POINT_2026.annual);
}

function calculateEmployeeSS(monthlyGross: number): number {
  const reducedThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const maxThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const reducedRate = SOCIAL_SECURITY_EMPLOYEE_2026.reducedRate.total;
  const fullRate = SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total;

  if (monthlyGross <= reducedThreshold) return monthlyGross * reducedRate;
  if (monthlyGross <= maxThreshold)
    return reducedThreshold * reducedRate + (monthlyGross - reducedThreshold) * fullRate;
  return reducedThreshold * reducedRate + (maxThreshold - reducedThreshold) * fullRate;
}

function calculateEmployerSS(monthlyGross: number): number {
  const reducedThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const maxThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const reducedRate = SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.reducedRate;
  const fullRate = SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.fullRate;

  if (monthlyGross <= reducedThreshold) return monthlyGross * reducedRate;
  if (monthlyGross <= maxThreshold)
    return reducedThreshold * reducedRate + (monthlyGross - reducedThreshold) * fullRate;
  return reducedThreshold * reducedRate + (maxThreshold - reducedThreshold) * fullRate;
}

export function calculateSalaryNetGross(input: SalaryNetGrossInput): SalaryNetGrossResult {
  const gross = Math.max(0, input.grossSalary);
  const annual = gross * 12;

  // מס הכנסה (חודשי = שנתי / 12)
  const incomeTax = calculateIncomeTax(annual, input.creditPoints) / 12;

  // ב.ל. + בריאות
  const socialSecurity = calculateEmployeeSS(gross);

  // פנסיה - 6% עובד
  const pensionDeduction = input.pensionEnabled ? gross * 0.06 : 0;

  // קרן השתלמות - 2.5% עובד
  const studyFundDeduction = input.studyFundEnabled ? gross * 0.025 : 0;

  const totalDeductions = incomeTax + socialSecurity + pensionDeduction + studyFundDeduction;
  const netSalary = gross - totalDeductions;
  const netPercentage = gross > 0 ? (netSalary / gross) * 100 : 0;

  // שכר שעתי
  const hourlyRate = input.monthlyWorkHours > 0 ? gross / input.monthlyWorkHours : 0;

  // עלויות מעסיק
  const employerSS = calculateEmployerSS(gross);
  const employerPension = input.pensionEnabled ? gross * 0.065 : 0;
  const employerStudyFund = input.studyFundEnabled ? gross * 0.075 : 0;
  const employerCompensation = gross * 0.0833; // פיצויים
  const totalEmployerCost = gross + employerSS + employerPension + employerStudyFund + employerCompensation;

  return {
    grossSalary: gross,
    incomeTax,
    socialSecurity,
    pensionDeduction,
    studyFundDeduction,
    totalDeductions,
    netSalary,
    netPercentage,
    hourlyRate,
    employerSocialSecurity: employerSS,
    employerPension,
    employerStudyFund,
    totalEmployerCost,
    costToNetRatio: netSalary > 0 ? totalEmployerCost / netSalary : 0,
  };
}
