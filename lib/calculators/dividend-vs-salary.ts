/**
 * דיבידנד vs משכורת - אופטימיזציית מס לבעל חברה בע"מ
 *
 * הבעיה: בעל חברה בע"מ צריך להחליט איך למשוך כסף מהחברה.
 *
 * אפשרות 1: משכורת
 *   - מס הכנסה לפי מדרגות (10%-50%)
 *   - ב.ל. עובד (~10% עד תקרה)
 *   - ב.ל. מעסיק (4.51% / 7.6%)
 *   - הוצאה מוכרת לחברה (חוסך מס חברות 23%)
 *
 * אפשרות 2: דיבידנד
 *   - מס חברות 23% על הרווח לפני
 *   - מס דיב' 33% (בעל מניות מהותי 10%+)
 *   - אין הוצאה מוכרת
 *   - אין ב.ל. (חיסכון משמעותי)
 *
 * נטו אפקטיבי לבעלים:
 *   - דיב': 1 - 0.23 - 0.77×0.33 = ~50%
 *   - משכורת: תלוי במדרגה - בערך 60-70% נטו במדרגות נמוכות, 50% במדרגות גבוהות
 *
 * המסקנה: דיב' בד"כ יותר יעיל בכמויות גדולות, משכורת במדרגות נמוכות.
 */

import { TAX_BRACKETS_2026, CREDIT_POINT_2026 } from '@/lib/constants/tax-2026';

export interface DividendVsSalaryInput {
  /** רווח שנתי של החברה (לפני משיכת בעלים) */
  companyAnnualProfit: number;
  /** סכום שצריך לבעלים לחיות עליו (אחרי מסים) - שנתי */
  withdrawalNeeds: number;
  /** נקודות זיכוי (ברירת מחדל 2.25) */
  creditPoints: number;
  /** האם בעל מניות מהותי (10%+) - משפיע על מס דיב' */
  isMaterialShareholder: boolean;
}

export interface ScenarioBreakdown {
  /** משכורת ברוטו ששולמה */
  grossSalary: number;
  /** דיבידנד שחולק */
  dividend: number;
  /** מס הכנסה */
  incomeTax: number;
  /** ב.ל. עובד + מעסיק */
  socialSecurity: number;
  /** מס חברות */
  corporateTax: number;
  /** מס דיב' */
  dividendTax: number;
  /** סה"כ מס שולם */
  totalTax: number;
  /** נטו לבעלים */
  netToOwner: number;
  /** רווח נצבר בחברה (לא חולק) */
  retainedEarnings: number;
  /** שיעור מס אפקטיבי */
  effectiveTaxRate: number;
}

export interface DividendVsSalaryResult {
  /** משיכת הכל כמשכורת */
  allSalary: ScenarioBreakdown;
  /** משיכת הכל כדיבידנד */
  allDividend: ScenarioBreakdown;
  /** משיכה מעורבת אופטימלית */
  optimal: ScenarioBreakdown & { salaryPct: number };
  /** המלצה */
  recommendation: 'allSalary' | 'allDividend' | 'optimal';
  /** חיסכון מס שנתי לעומת אסטרטגיית הכל-משכורת */
  taxSavings: number;
}

function calcIncomeTax(income: number, creditPoints: number): number {
  let remaining = income;
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

/** ב.ל. עובד שנתי (אומדן עם תקרה) */
function calcEmployeeSS(grossSalary: number): number {
  const lowAnnual = 7_522 * 12; // 90,264
  const highAnnual = 51_910 * 12; // 622,920
  if (grossSalary <= lowAnnual) return grossSalary * 0.0427;
  if (grossSalary <= highAnnual)
    return lowAnnual * 0.0427 + (grossSalary - lowAnnual) * 0.1217;
  return lowAnnual * 0.0427 + (highAnnual - lowAnnual) * 0.1217;
}

/** ב.ל. מעסיק שנתי */
function calcEmployerSS(grossSalary: number): number {
  const lowAnnual = 7_522 * 12;
  const highAnnual = 51_910 * 12;
  if (grossSalary <= lowAnnual) return grossSalary * 0.0451;
  if (grossSalary <= highAnnual)
    return lowAnnual * 0.0451 + (grossSalary - lowAnnual) * 0.076;
  return lowAnnual * 0.0451 + (highAnnual - lowAnnual) * 0.076;
}

const CORP_TAX = 0.23;
const DIV_TAX_MATERIAL = 0.33; // 30% + 3% מס יסף
const DIV_TAX_REGULAR = 0.25;

/** מחשב תרחיש "כל-משכורת" - כל הרווח עובר כמשכורת */
function scenarioAllSalary(
  profit: number,
  creditPoints: number,
): ScenarioBreakdown {
  // הרווח חייב לכסות גם את עלות המעסיק. עלות מעסיק ~ 7.6% מהמשכורת.
  // נחפש grossSalary כך ש: grossSalary + employerSS(grossSalary) = profit
  // איטרציה פשוטה
  let gross = profit / 1.076; // קירוב ראשון
  for (let i = 0; i < 5; i++) {
    const empSS = calcEmployerSS(gross);
    gross = profit - empSS;
  }
  gross = Math.max(0, gross);

  const empSS = calcEmployerSS(gross);
  const eeSS = calcEmployeeSS(gross);
  const incTax = calcIncomeTax(gross, creditPoints);
  const totalTax = empSS + eeSS + incTax;
  const net = gross - eeSS - incTax;

  return {
    grossSalary: gross,
    dividend: 0,
    incomeTax: incTax,
    socialSecurity: empSS + eeSS,
    corporateTax: 0,
    dividendTax: 0,
    totalTax,
    netToOwner: net,
    retainedEarnings: 0,
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
  };
}

/** מחשב תרחיש "כל-דיב'" - הכל עובר דרך מס חברות → דיב' */
function scenarioAllDividend(
  profit: number,
  isMaterial: boolean,
): ScenarioBreakdown {
  const corpTax = profit * CORP_TAX;
  const afterCorpTax = profit - corpTax;
  const divRate = isMaterial ? DIV_TAX_MATERIAL : DIV_TAX_REGULAR;
  const divTax = afterCorpTax * divRate;
  const net = afterCorpTax - divTax;

  return {
    grossSalary: 0,
    dividend: afterCorpTax,
    incomeTax: 0,
    socialSecurity: 0,
    corporateTax: corpTax,
    dividendTax: divTax,
    totalTax: corpTax + divTax,
    netToOwner: net,
    retainedEarnings: 0,
    effectiveTaxRate: profit > 0 ? (corpTax + divTax) / profit : 0,
  };
}

/** מחשב תרחיש מעורב - משכורת X + יתרה כדיב' */
function scenarioMixed(
  profit: number,
  salaryAmount: number,
  creditPoints: number,
  isMaterial: boolean,
): ScenarioBreakdown {
  const empSS = calcEmployerSS(salaryAmount);
  const eeSS = calcEmployeeSS(salaryAmount);
  const incTax = calcIncomeTax(salaryAmount, creditPoints);
  const totalSalaryCost = salaryAmount + empSS;

  if (totalSalaryCost > profit) {
    // משכורת גדולה מדי - לא מעשי
    return {
      grossSalary: 0,
      dividend: 0,
      incomeTax: 0,
      socialSecurity: 0,
      corporateTax: 0,
      dividendTax: 0,
      totalTax: profit,
      netToOwner: 0,
      retainedEarnings: 0,
      effectiveTaxRate: 1,
    };
  }

  const remainingForDiv = profit - totalSalaryCost;
  const corpTax = remainingForDiv * CORP_TAX;
  const afterCorpTax = remainingForDiv - corpTax;
  const divRate = isMaterial ? DIV_TAX_MATERIAL : DIV_TAX_REGULAR;
  const divTax = afterCorpTax * divRate;

  const totalTax = empSS + eeSS + incTax + corpTax + divTax;
  const net = salaryAmount - eeSS - incTax + afterCorpTax - divTax;

  return {
    grossSalary: salaryAmount,
    dividend: afterCorpTax,
    incomeTax: incTax,
    socialSecurity: empSS + eeSS,
    corporateTax: corpTax,
    dividendTax: divTax,
    totalTax,
    netToOwner: net,
    retainedEarnings: 0,
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
  };
}

export function calculateDividendVsSalary(
  input: DividendVsSalaryInput,
): DividendVsSalaryResult {
  const profit = Math.max(0, input.companyAnnualProfit);
  const cp = Math.max(0, input.creditPoints);
  const isMaterial = input.isMaterialShareholder;

  const allSalary = scenarioAllSalary(profit, cp);
  const allDividend = scenarioAllDividend(profit, isMaterial);

  // חיפוש האופטימום: מנסה משכורות מ-0 עד הרווח, צעדים של 5%
  let bestNet = -Infinity;
  let bestSalary = 0;
  let bestPct = 0;

  // נסה משכורות בעלות גבולית (עד מדרגת 14% / 20%)
  const candidateSalaries = [
    0,
    7_010 * 12, // סוף מדרגה 10% = 84,120
    10_060 * 12, // סוף מדרגה 14% = 120,720
    19_000 * 12, // סוף מדרגה 20% = 228,000
    25_100 * 12, // סוף מדרגה 31%
    profit * 0.3,
    profit * 0.5,
    profit * 0.7,
    profit / 1.076, // הכל משכורת
  ];

  for (const salary of candidateSalaries) {
    if (salary < 0 || salary * 1.076 > profit + 1) continue;
    const sc = scenarioMixed(profit, salary, cp, isMaterial);
    if (sc.netToOwner > bestNet) {
      bestNet = sc.netToOwner;
      bestSalary = salary;
      bestPct = profit > 0 ? (salary / profit) * 100 : 0;
    }
  }

  const optimalScenario = scenarioMixed(profit, bestSalary, cp, isMaterial);
  const optimal = { ...optimalScenario, salaryPct: bestPct };

  // המלצה - בוחר את התרחיש הטוב ביותר
  const scenarios = [
    { key: 'allSalary' as const, net: allSalary.netToOwner },
    { key: 'allDividend' as const, net: allDividend.netToOwner },
    { key: 'optimal' as const, net: optimal.netToOwner },
  ];
  const best = scenarios.reduce((max, s) => (s.net > max.net ? s : max));

  return {
    allSalary,
    allDividend,
    optimal,
    recommendation: best.key,
    taxSavings: best.net - allSalary.netToOwner,
  };
}
