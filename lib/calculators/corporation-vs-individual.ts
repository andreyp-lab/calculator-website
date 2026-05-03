/**
 * השוואה: חברה בע"מ vs עוסק מורשה
 *
 * החלטה אסטרטגית לכל פרילנסר/בעל עסק:
 * האם להישאר עוסק מורשה (אישי) או לפתוח חברה בע"מ?
 *
 * עוסק מורשה (אישי):
 * - מס הכנסה לפי 7 מדרגות (10%-50%)
 * - ביטוח לאומי + בריאות (~16% אפקטיבי על רווח)
 * - נקודות זיכוי: 2.25 בסיס + תוספות
 *
 * חברה בע"מ:
 * - מס חברות: 23% על הרווח
 * - דיבידנד: 33% (30% + 3% מס יסף לבעל מניות מהותי)
 * - חלופה: משיכת משכורת (חייבת במס הכנסה + ב.ל. + מעסיק 7.6%)
 *
 * הנחה: אנחנו משווים על אותו רווח שנתי לפני מס.
 *
 * מקור: רשות המסים, חוק החברות, פקודת מס הכנסה
 * אומת: 2026-05-03
 */

import { TAX_BRACKETS_2026, CREDIT_POINT_2026 } from '@/lib/constants/tax-2026';

export interface CorpVsIndividualInput {
  /** רווח שנתי לפני מס (הכנסות פחות הוצאות מוכרות) */
  annualProfit: number;
  /** נקודות זיכוי - ברירת מחדל 2.25 (גבר רווק תושב) */
  creditPoints: number;
}

export interface ScenarioResult {
  grossProfit: number;
  incomeTax: number;
  socialSecurity: number;
  corporateTax: number;
  dividendTax: number;
  totalTax: number;
  netToOwner: number;
  effectiveTaxRate: number;
}

export interface CorpVsIndividualResult {
  /** עוסק מורשה - מס אישי */
  individual: ScenarioResult;
  /** חברה - מושך הכל כדיבידנד */
  corporationDividend: ScenarioResult;
  /** חברה - מושך הכל כמשכורת */
  corporationSalary: ScenarioResult;
  /** המלצה */
  recommendation: 'individual' | 'corporationDividend' | 'corporationSalary';
  /** חיסכון מס שנתי בהמלצה לעומת עוסק מורשה */
  taxSavingsVsIndividual: number;
  /** סף הרווח שמצדיק חברה (משוער) */
  breakEvenProfit: number;
}

/** חישוב מס הכנסה אישי לפי מדרגות */
function calculatePersonalIncomeTax(annualIncome: number, creditPoints: number): number {
  let remaining = annualIncome;
  let tax = 0;
  let prevLimit = 0;

  for (const bracket of TAX_BRACKETS_2026) {
    const bracketSize = bracket.upTo - prevLimit;
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, bracketSize);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.upTo;
  }

  // הפחתה של נקודות זיכוי
  const creditValue = creditPoints * CREDIT_POINT_2026.annual;
  return Math.max(0, tax - creditValue);
}

/** ב.ל. + בריאות לעצמאי - אפקטיבי שנתי */
function calculateSelfEmployedSocialSecurity(annualIncome: number): number {
  // שיעור מופחת על השכר עד 7,522×12=90,264, מלא מעל
  const reducedThreshold = 90_264;
  const reducedRate = 0.061; // 2.87% + 3.23%
  const fullRate = 0.1783; // 12.6% + 5.17%
  const maxThreshold = 51_910 * 12; // 622,920

  if (annualIncome <= reducedThreshold) {
    return annualIncome * reducedRate;
  }
  if (annualIncome <= maxThreshold) {
    return reducedThreshold * reducedRate + (annualIncome - reducedThreshold) * fullRate;
  }
  return reducedThreshold * reducedRate + (maxThreshold - reducedThreshold) * fullRate;
}

export function calculateCorpVsIndividual(
  input: CorpVsIndividualInput,
): CorpVsIndividualResult {
  const profit = Math.max(0, input.annualProfit);
  const creditPoints = Math.max(0, input.creditPoints);

  // 1. עוסק מורשה
  const indIncomeTax = calculatePersonalIncomeTax(profit, creditPoints);
  const indSocialSec = calculateSelfEmployedSocialSecurity(profit);
  const indTotalTax = indIncomeTax + indSocialSec;
  const individual: ScenarioResult = {
    grossProfit: profit,
    incomeTax: indIncomeTax,
    socialSecurity: indSocialSec,
    corporateTax: 0,
    dividendTax: 0,
    totalTax: indTotalTax,
    netToOwner: profit - indTotalTax,
    effectiveTaxRate: profit > 0 ? indTotalTax / profit : 0,
  };

  // 2. חברה - הכל כדיבידנד
  // מס חברות 23% → רווח אחרי מס × 33% מס דיבידנד
  const corpTaxRate = 0.23;
  const dividendTaxRate = 0.33; // 30% + 3% מס יסף לבעל מניות מהותי
  const profitAfterCorpTax = profit * (1 - corpTaxRate);
  const dividendTaxAmount = profitAfterCorpTax * dividendTaxRate;
  const divTotalTax = profit * corpTaxRate + dividendTaxAmount;
  const corporationDividend: ScenarioResult = {
    grossProfit: profit,
    incomeTax: 0,
    socialSecurity: 0,
    corporateTax: profit * corpTaxRate,
    dividendTax: dividendTaxAmount,
    totalTax: divTotalTax,
    netToOwner: profit - divTotalTax,
    effectiveTaxRate: profit > 0 ? divTotalTax / profit : 0,
  };

  // 3. חברה - הכל כמשכורת
  // הרווח לפני מס משמש לתשלום משכורת + מס מעסיק (ב.ל. 7.6%)
  // משכורת ברוטו = רווח / (1 + 0.076) באופן משוער (מתעלם מסף 7,522)
  // ואז המשכורת חייבת במס הכנסה + ב.ל. עובד
  // הקופה: משכורת ברוטו = X, עלות מעסיק = X × (1 + 0.076 בערך)
  // אז X = profit / 1.076
  const employerSSrate = 0.076; // ביטוח לאומי מעסיק (פשטות - שיעור הגבוה)
  const grossSalary = profit / (1 + employerSSrate);
  const employerCost = grossSalary * employerSSrate;

  // מס הכנסה על המשכורת
  const salaryIncomeTax = calculatePersonalIncomeTax(grossSalary, creditPoints);
  // ב.ל. עובד - שיעור אפקטיבי ~10%
  const employeeSSrate = 0.10;
  const employeeSS = grossSalary * employeeSSrate;

  const salTotalTax = salaryIncomeTax + employeeSS + employerCost;
  const corporationSalary: ScenarioResult = {
    grossProfit: profit,
    incomeTax: salaryIncomeTax,
    socialSecurity: employeeSS + employerCost,
    corporateTax: 0,
    dividendTax: 0,
    totalTax: salTotalTax,
    netToOwner: profit - salTotalTax,
    effectiveTaxRate: profit > 0 ? salTotalTax / profit : 0,
  };

  // 4. בחירת המלצה - הנט הגבוה ביותר לבעלים
  const scenarios = [
    { key: 'individual' as const, net: individual.netToOwner },
    { key: 'corporationDividend' as const, net: corporationDividend.netToOwner },
    { key: 'corporationSalary' as const, net: corporationSalary.netToOwner },
  ];
  const best = scenarios.reduce((max, s) => (s.net > max.net ? s : max));
  const taxSavings = best.net - individual.netToOwner;

  // נקודת איזון - הערכה: בערך 350K-450K לרוב התרחישים
  const breakEvenProfit = creditPoints >= 2.25 ? 380_000 : 320_000;

  return {
    individual,
    corporationDividend,
    corporationSalary,
    recommendation: best.key,
    taxSavingsVsIndividual: taxSavings,
    breakEvenProfit,
  };
}
