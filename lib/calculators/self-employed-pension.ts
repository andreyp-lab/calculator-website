/**
 * מחשבון פנסיה חובה לעצמאי - 2026
 *
 * מאז 2017, עצמאי חייב להפקיד לפנסיה. הסכומים מבוססים על השכר הממוצע במשק.
 *
 * נוסחת ההפקדה החובה (2026):
 * שלב 1: עד מחצית השכר הממוצע (~6,884 ₪/חודש) → 4.45%
 * שלב 2: מחצית עד שכר ממוצע מלא (~13,769 ₪/חודש) → 12.55%
 * שלב 3: מעל השכר הממוצע - אין חובה
 *
 * הטבות מס:
 * - ניכוי - הפחתה ישירה מההכנסה החייבת
 * - זיכוי - 35% החזר מס על חלק מההפקדה
 * - תקרת הפקדה מוטבת: ~13,700 ₪/שנה
 *
 * מקור: ביטוח לאומי, רשות המסים
 */

const AVERAGE_WAGE_2026 = 13_769;
const HALF_AVERAGE_WAGE = 6_884;

export interface SelfEmployedPensionInput {
  /** הכנסה חודשית ממוצעת (₪) */
  monthlyIncome: number;
  /** מס שולי משוער (%) */
  marginalTaxRate: number;
  /** האם להפקיד מעבר לחובה */
  contributeAboveMandatory: boolean;
  /** הפקדה רצונית חודשית נוספת (אם רלוונטי) */
  voluntaryMonthlyContribution: number;
}

export interface SelfEmployedPensionResult {
  /** הפקדה חובה חודשית */
  mandatoryMonthly: number;
  /** הפקדה חובה שנתית */
  mandatoryAnnual: number;
  /** הפקדה רצונית */
  voluntaryAnnual: number;
  /** סך ההפקדה */
  totalAnnualContribution: number;
  /** חיסכון מס (זיכוי + ניכוי) */
  taxSavings: number;
  /** עלות נטו (אחרי הטבת מס) */
  netCost: number;
  /** קצבה חודשית צפויה לפרישה (משוער 30 שנות הפקדה) */
  expectedMonthlyPension30Years: number;
  /** הסבר מפורט */
  breakdown: {
    tier1Amount: number;
    tier1Rate: number;
    tier2Amount: number;
    tier2Rate: number;
  };
  /** הערות */
  notes: string[];
}

export function calculateSelfEmployedPension(
  input: SelfEmployedPensionInput,
): SelfEmployedPensionResult {
  const monthlyIncome = Math.max(0, input.monthlyIncome);

  // חישוב הפקדה חובה
  let mandatoryMonthly = 0;
  let tier1Amount = 0;
  let tier2Amount = 0;

  if (monthlyIncome > 0) {
    // שלב 1
    const tier1Income = Math.min(monthlyIncome, HALF_AVERAGE_WAGE);
    tier1Amount = tier1Income * 0.0445;

    // שלב 2
    if (monthlyIncome > HALF_AVERAGE_WAGE) {
      const tier2Income = Math.min(
        monthlyIncome - HALF_AVERAGE_WAGE,
        AVERAGE_WAGE_2026 - HALF_AVERAGE_WAGE,
      );
      tier2Amount = tier2Income * 0.1255;
    }

    mandatoryMonthly = tier1Amount + tier2Amount;
  }

  const mandatoryAnnual = mandatoryMonthly * 12;
  const voluntaryAnnual = input.contributeAboveMandatory
    ? input.voluntaryMonthlyContribution * 12
    : 0;
  const totalAnnualContribution = mandatoryAnnual + voluntaryAnnual;

  // הטבת מס
  const marginalRate = input.marginalTaxRate / 100;
  // ניכוי - חוסך מס במלוא השיעור השולי
  const deductionSaving = totalAnnualContribution * marginalRate;
  // זיכוי - 35% מחלק מההפקדה (מוגבל לתקרה)
  const creditEligibleAmount = Math.min(totalAnnualContribution * 0.35, 4_795);
  const creditSaving = creditEligibleAmount * 0.35;
  const taxSavings = deductionSaving + creditSaving;
  const netCost = totalAnnualContribution - taxSavings;

  // קצבה צפויה (30 שנות הפקדה, תשואה 4%, מקדם 200)
  const annualReturn = 0.04;
  const years = 30;
  const fv =
    totalAnnualContribution *
    ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
  const expectedMonthlyPension30Years = fv / 200;

  const notes: string[] = [];

  if (monthlyIncome > AVERAGE_WAGE_2026) {
    notes.push(
      `עצמאי שמרוויח מעל השכר הממוצע (${AVERAGE_WAGE_2026.toLocaleString()} ₪) - אין חובה להפקיד מעבר לתקרה הזו, אבל מומלץ.`,
    );
  }

  if (mandatoryMonthly > 0 && voluntaryAnnual === 0) {
    notes.push(
      'הפקדה רצונית מעבר לחובה מקבלת הטבת מס ניכרת. שקול להגדיל לתקרה הפטורה (~13,700 ₪/שנה).',
    );
  }

  notes.push(
    `חיסכון מס שנתי משוער: ${taxSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} ₪`,
  );

  return {
    mandatoryMonthly,
    mandatoryAnnual,
    voluntaryAnnual,
    totalAnnualContribution,
    taxSavings,
    netCost,
    expectedMonthlyPension30Years,
    breakdown: {
      tier1Amount,
      tier1Rate: 4.45,
      tier2Amount,
      tier2Rate: 12.55,
    },
    notes,
  };
}
