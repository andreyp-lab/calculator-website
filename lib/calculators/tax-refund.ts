/**
 * אומדן הפרש מס שנתי לשכירים — שנות המס 2020–2025.
 *
 * מקור מדרגות המס ושווי נקודת הזיכוי: לוחות העזר השנתיים של רשות המסים.
 * המנוע מיועד להכנסה מיגיעה אישית בלבד ואינו מחשב מס על עסק, שוק ההון,
 * שכירות, הכנסות מחו״ל או זיכויים/ניכויים שלא הוזנו כסכום מאומת.
 */

export type TaxRefundYear = '2020' | '2021' | '2022' | '2023' | '2024' | '2025';

export interface TaxRefundIncomeSource {
  taxableIncome: number;
  taxWithheld: number;
  /** הכנסה מבוטחת: שדה 244/245 בטופס 106. לא הפקדות מעסיק. */
  insuredIncome?: number;
  /** הפקדות עובד לקצבה: שדה 045/086 בטופס 106. */
  employeePensionContributions?: number;
}

export interface TaxRefundInput {
  taxYear: TaxRefundYear;
  incomeSources: TaxRefundIncomeSource[];
  /** ממוצע נקודות הזיכוי השנתי שאומת עבור שנת המס. */
  creditPoints: number;
  /** ניכויים שנתיים מוכרים שכבר חושבו/אומתו, בשקלים. */
  recognizedDeductions?: number;
  /** זיכויי מס נוספים שכבר חושבו/אומתו, בשקלים — לא סכום ההוצאה. */
  additionalTaxCredits?: number;
  pensionCreditMode?: 'automatic' | 'manual';
  /** סך זיכוי פנסיה שנתי מאומת, המחליף את החישוב האוטומטי. */
  manualPensionCredit?: number;
  /** סך תרומות השנה לפי סעיף 46, כולל תרומות דרך השכר פעם אחת בלבד. */
  donations?: number;
}

export interface TaxRefundBracketResult {
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface TaxRefundResult {
  taxYear: TaxRefundYear;
  totalIncomeBeforeDeductions: number;
  recognizedDeductions: number;
  taxableIncome: number;
  totalTaxWithheld: number;
  bracketTax: number;
  surtax: number;
  taxBeforeCredits: number;
  creditPoints: number;
  creditPointValueAnnual: number;
  creditPointsAmount: number;
  additionalTaxCredits: number;
  insuredIncome: number;
  pensionContributions: number;
  pensionEligibleContributions: number;
  pensionTaxCredit: number;
  donationEligibleAmount: number;
  donationTaxCredit: number;
  donationExcess: number;
  taxAfterCredits: number;
  estimatedRefund: number;
  estimatedBalanceDue: number;
  bracketBreakdown: TaxRefundBracketResult[];
  claimDeadline: string;
}

export interface TaxRefundYearRule {
  brackets: readonly { upTo: number; rate: number }[];
  creditPointMonthly: number;
  surtaxThreshold: number;
  claimDeadline: string;
  sourceUrl: string;
  pensionIncomeCeilingAnnual: number;
  pensionMinimumBase: number;
  donationMinimum: number;
  donationMaximum: number;
}

const rates = [0.1, 0.14, 0.2, 0.31, 0.35, 0.47] as const;

function brackets(upTo: readonly number[]): TaxRefundYearRule['brackets'] {
  return upTo.map((limit, index) => ({ upTo: limit, rate: rates[index] }));
}

const BOOKLETS_URL = 'https://www.gov.il/he/pages/pa110123-1';

export const TAX_REFUND_YEAR_RULES: Record<TaxRefundYear, TaxRefundYearRule> = {
  '2020': {
    brackets: brackets([75_960, 108_960, 174_960, 243_120, 505_920, Infinity]),
    creditPointMonthly: 219,
    pensionIncomeCeilingAnnual: 105_600,
    pensionMinimumBase: 2_040,
    donationMinimum: 190,
    donationMaximum: 9_350_000,
    surtaxThreshold: 651_600,
    claimDeadline: '2026-12-31',
    sourceUrl: BOOKLETS_URL,
  },
  '2021': {
    brackets: brackets([75_480, 108_360, 173_880, 241_680, 502_920, Infinity]),
    creditPointMonthly: 218,
    pensionIncomeCeilingAnnual: 104_400,
    pensionMinimumBase: 2_028,
    donationMinimum: 190,
    donationMaximum: 9_294_000,
    surtaxThreshold: 647_640,
    claimDeadline: '2027-12-31',
    sourceUrl: BOOKLETS_URL,
  },
  '2022': {
    brackets: brackets([77_400, 110_880, 178_080, 247_440, 514_920, Infinity]),
    creditPointMonthly: 223,
    pensionIncomeCeilingAnnual: 106_800,
    pensionMinimumBase: 2_076,
    donationMinimum: 190,
    donationMaximum: 9_517_000,
    surtaxThreshold: 663_240,
    claimDeadline: '2028-12-31',
    sourceUrl: BOOKLETS_URL,
  },
  '2023': {
    brackets: brackets([81_480, 116_760, 187_440, 260_520, 542_160, Infinity]),
    creditPointMonthly: 235,
    pensionIncomeCeilingAnnual: 112_800,
    pensionMinimumBase: 2_196,
    donationMinimum: 200,
    donationMaximum: 10_019_808,
    surtaxThreshold: 698_280,
    claimDeadline: '2029-12-31',
    sourceUrl: BOOKLETS_URL,
  },
  '2024': {
    brackets: brackets([84_120, 120_720, 193_800, 269_280, 560_280, Infinity]),
    creditPointMonthly: 242,
    pensionIncomeCeilingAnnual: 116_400,
    pensionMinimumBase: 2_268,
    donationMinimum: 207,
    donationMaximum: 10_354_816,
    surtaxThreshold: 721_560,
    claimDeadline: '2030-12-31',
    sourceUrl: BOOKLETS_URL,
  },
  // הסכומים הוקפאו ב-2025 ולכן מדרגות 2024 ושווי הנקודה נשארו ללא שינוי.
  '2025': {
    brackets: brackets([84_120, 120_720, 193_800, 269_280, 560_280, Infinity]),
    creditPointMonthly: 242,
    pensionIncomeCeilingAnnual: 116_400,
    pensionMinimumBase: 2_268,
    donationMinimum: 207,
    donationMaximum: 10_354_816,
    surtaxThreshold: 721_560,
    claimDeadline: '2031-12-31',
    sourceUrl: BOOKLETS_URL,
  },
};

export function nonNegative(value: number | undefined): number {
  return Number.isFinite(value) ? Math.max(0, value ?? 0) : 0;
}

/**
 * מס על פרוסת הכנסה [from, to) לפי מדרגות השנה. rateFor מאפשר להחליף שיעור מדרגה —
 * למשל רצפה של 31% להכנסה שאינה מיגיעה אישית (סעיף 121(א)) או תקרה לרווח הון (סעיף 91(ב)).
 */
export function taxOnSlice(
  brackets: TaxRefundYearRule['brackets'],
  from: number,
  to: number,
  rateFor: (bracketRate: number) => number = (rate) => rate,
): number {
  if (to <= from) return 0;
  let tax = 0;
  let lower = 0;
  for (const bracket of brackets) {
    const upper = bracket.upTo;
    const start = Math.max(from, lower);
    const end = Math.min(to, upper);
    if (end > start) tax += (end - start) * rateFor(bracket.rate);
    if (upper >= to) break;
    lower = upper;
  }
  return tax;
}

export function calculateTaxRefund(input: TaxRefundInput): TaxRefundResult {
  const rule = TAX_REFUND_YEAR_RULES[input.taxYear];
  const totalIncomeBeforeDeductions = input.incomeSources.reduce(
    (sum, source) => sum + nonNegative(source.taxableIncome),
    0,
  );
  const totalTaxWithheld = input.incomeSources.reduce(
    (sum, source) => sum + nonNegative(source.taxWithheld),
    0,
  );
  const recognizedDeductions = Math.min(
    nonNegative(input.recognizedDeductions),
    totalIncomeBeforeDeductions,
  );
  const taxableIncome = totalIncomeBeforeDeductions - recognizedDeductions;

  let previousLimit = 0;
  let bracketTax = 0;
  const bracketBreakdown: TaxRefundBracketResult[] = [];

  for (const bracket of rule.brackets) {
    if (taxableIncome <= previousLimit) break;

    const taxableAmount =
      bracket.upTo === Infinity
        ? taxableIncome - previousLimit
        : Math.min(taxableIncome, bracket.upTo) - previousLimit;
    const tax = taxableAmount * bracket.rate;

    if (taxableAmount > 0) {
      bracketBreakdown.push({ rate: bracket.rate, taxableAmount, tax });
      bracketTax += tax;
    }

    if (bracket.upTo === Infinity || taxableIncome <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  const surtax = Math.max(0, taxableIncome - rule.surtaxThreshold) * 0.03;
  const taxBeforeCredits = bracketTax + surtax;
  const creditPoints = nonNegative(input.creditPoints);
  const creditPointValueAnnual = rule.creditPointMonthly * 12;
  const creditPointsAmount = creditPoints * creditPointValueAnnual;
  const additionalTaxCredits = nonNegative(input.additionalTaxCredits);
  // סעיף 45א: שכיר עם הפקדות עובד רגילות בלבד. תקרה אחת לכל המעסיקים יחד.
  // אין הפחתה מהברוטו: זוהי הטבת זיכוי. הפקדות פרטיות ושכר לא מבוטח דורשים
  // חישוב משולב אחר (לרבות סעיף 47), וניתנים להזנה במסלול הידני המאומת.
  const insuredIncome = input.incomeSources.reduce(
    (sum, source) => sum + nonNegative(source.insuredIncome), 0,
  );
  const pensionContributions = input.incomeSources.reduce(
    (sum, source) => sum + nonNegative(source.employeePensionContributions), 0,
  );
  // במסלול זה חייבים להגיע לאותה תוצאה גם לעמית מוטב וגם לעמית שאינו מוטב.
  // בהכנסה לא מבוטחת או בניכויים דרוש חישוב סעיפים 45א/47 רחב יותר.
  const hasNonFullyInsuredSource = input.incomeSources.some(
    (source) => Math.abs(nonNegative(source.insuredIncome) - nonNegative(source.taxableIncome)) > 0.01,
  );
  if (input.pensionCreditMode !== 'manual' && pensionContributions > 0 &&
      (hasNonFullyInsuredSource || recognizedDeductions > 0)) {
    throw new Error('חישוב הפנסיה האוטומטי דורש שכל ההכנסה תהיה משכר מבוטח וללא ניכויים נוספים. במצב שהוזן נדרש זיכוי פנסיה שנתי מאומת במסלול הידני.');
  }
  const pensionEligibleContributions = Math.min(
    pensionContributions,
    Math.max(rule.pensionMinimumBase,
      Math.min(insuredIncome, totalIncomeBeforeDeductions, rule.pensionIncomeCeilingAnnual) * 0.07),
  );
  const pensionTaxCredit = input.pensionCreditMode === 'manual'
    ? nonNegative(input.manualPensionCredit)
    : pensionEligibleContributions * 0.35;
  const donations = nonNegative(input.donations);
  const donationEligibleAmount = donations > rule.donationMinimum
    ? Math.min(donations, taxableIncome * 0.3, rule.donationMaximum)
    : 0;
  const donationTaxCredit = donationEligibleAmount * 0.35;
  // רק עודף מעל התקרה עשוי לעבור לשנים הבאות; אין העברה אוטומטית בכלי.
  const donationExcess = donations > rule.donationMinimum
    ? Math.max(0, donations - donationEligibleAmount)
    : 0;
  const taxAfterCredits = Math.max(
    0,
    taxBeforeCredits - creditPointsAmount - pensionTaxCredit - donationTaxCredit - additionalTaxCredits,
  );
  const difference = totalTaxWithheld - taxAfterCredits;

  return {
    taxYear: input.taxYear,
    totalIncomeBeforeDeductions,
    recognizedDeductions,
    taxableIncome,
    totalTaxWithheld,
    bracketTax,
    surtax,
    taxBeforeCredits,
    creditPoints,
    creditPointValueAnnual,
    creditPointsAmount,
    additionalTaxCredits,
    insuredIncome,
    pensionContributions,
    pensionEligibleContributions,
    pensionTaxCredit,
    donationEligibleAmount,
    donationTaxCredit,
    donationExcess,
    taxAfterCredits,
    estimatedRefund: Math.max(0, difference),
    estimatedBalanceDue: Math.max(0, -difference),
    bracketBreakdown,
    claimDeadline: rule.claimDeadline,
  };
}
