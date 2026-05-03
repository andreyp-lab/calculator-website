/**
 * מחשבון פנסיה צפויה (קצבה חודשית בפרישה)
 *
 * מבוסס על:
 * - חוק פנסיה חובה (6.5% עובד + 6.5% מעסיק + 6% פיצויים)
 * - מקדם המרה לפנסיה ב-2026: ~205 (גיל 67)
 */

export interface PensionInput {
  currentAge: number;
  retirementAge: number;
  monthlySalary: number; // שכר נטו
  currentPensionSavings: number; // חיסכון נוכחי
  employeeContribution: number; // % הפקדת עובד (6-7)
  employerContribution: number; // % הפרשת מעסיק (6.5-7.5)
  severanceContribution: number; // % הפרשת פיצויים (6-8.33)
  expectedReturn: number; // % שנתי
  conversionRate: number; // מקדם המרה (~205 ב-67)
}

export interface PensionResult {
  yearsUntilRetirement: number;
  monthlyContribution: number; // הפרשה חודשית כוללת
  finalSavings: number; // חיסכון בפרישה
  monthlyPension: number; // קצבה חודשית צפויה
  pensionAsPercentOfSalary: number; // אחוז משכר אחרון
  yearlyPension: number;
  totalContributionsPaid: number; // סך הפרשות שתשלם
  totalEarnings: number; // סך תשואה
}

export function calculatePension(input: PensionInput): PensionResult {
  const {
    currentAge,
    retirementAge,
    monthlySalary,
    currentPensionSavings,
    employeeContribution,
    employerContribution,
    severanceContribution,
    expectedReturn,
    conversionRate,
  } = input;

  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);
  const totalContributionPct =
    (employeeContribution + employerContribution + severanceContribution) / 100;
  const monthlyContribution = monthlySalary * totalContributionPct;

  if (yearsUntilRetirement === 0) {
    const monthlyPension = currentPensionSavings / conversionRate;
    return {
      yearsUntilRetirement: 0,
      monthlyContribution,
      finalSavings: currentPensionSavings,
      monthlyPension,
      pensionAsPercentOfSalary: monthlySalary > 0 ? (monthlyPension / monthlySalary) * 100 : 0,
      yearlyPension: monthlyPension * 12,
      totalContributionsPaid: 0,
      totalEarnings: 0,
    };
  }

  // חישוב חיסכון בפרישה (FV עם הפקדות חודשיות)
  const monthlyR = expectedReturn / 100 / 12;
  const months = yearsUntilRetirement * 12;

  // FV of current savings: PV * (1+r)^n
  const fvCurrent = currentPensionSavings * Math.pow(1 + monthlyR, months);

  // FV of monthly contributions: PMT × [((1+r)^n - 1) / r]
  const fvContributions =
    monthlyR === 0
      ? monthlyContribution * months
      : monthlyContribution * ((Math.pow(1 + monthlyR, months) - 1) / monthlyR);

  const finalSavings = fvCurrent + fvContributions;

  // חישוב הקצבה: חיסכון / מקדם המרה
  const monthlyPension = finalSavings / conversionRate;

  const totalContributionsPaid = monthlyContribution * months;
  const totalEarnings = finalSavings - currentPensionSavings - totalContributionsPaid;

  return {
    yearsUntilRetirement,
    monthlyContribution,
    finalSavings,
    monthlyPension,
    pensionAsPercentOfSalary: monthlySalary > 0 ? (monthlyPension / monthlySalary) * 100 : 0,
    yearlyPension: monthlyPension * 12,
    totalContributionsPaid,
    totalEarnings,
  };
}
