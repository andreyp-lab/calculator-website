/**
 * תחשיב מס שנתי מלא ליחיד תושב ישראל שהוא שכיר — שנות המס 2020–2025.
 *
 * מעבר למנוע ההחזר הבסיסי (tax-refund.ts), המנוע מחשב:
 * - שכר דירה למגורים בישראל: פטור (חוק הפטור, התש״ן–1990), 10% (סעיף 122), או מסלול רגיל.
 * - שכר דירה מחו״ל: 15% (סעיף 122א) או מסלול רגיל עם זיכוי מס זר (סעיף 204(א)).
 * - הכנסה אחרת שאינה מיגיעה אישית: 31% לפחות עד גיל 60 (סעיף 121(א)), מדרגות מופחתות מגיל 60 (סעיף 121(ב)).
 * - ריבית (סעיף 125ג), דיבידנד (סעיף 125ב), רווח הון ריאלי (סעיף 91(ב)), כולל בעל מניות מהותי.
 * - קיזוז הפסד הון שוטף ומועבר (סעיף 92), ניכוי מריבית (סעיף 125ד), זיכוי מסי חוץ (סעיף 204).
 * - מס יסף 3% (סעיף 121ב(א)) ומ-2025 מס נוסף 2% על הכנסה ממקור הוני (סעיף 121ב(א1)).
 *
 * מקורות: נוסח פקודת מס הכנסה (ויקיטקסט), לוחות העזר השנתיים של רשות המסים, כל-זכות.
 * הנחות עבודה שלא נקבעו במפורש בחוק מתועדות ליד הקוד ובקובץ docs.
 */

import {
  calculateTaxRefund,
  nonNegative,
  taxOnSlice,
  TAX_REFUND_YEAR_RULES,
  type TaxRefundIncomeSource,
  type TaxRefundYear,
} from './tax-refund';
import { buildCreditPointsLedger, type CreditPointsLedger, type CreditPointsProfile } from './tax-credit-points';

interface FullReturnYearRule {
  /** תקרת הפטור החודשית לשכר דירה למגורים (חוק הפטור, סעיף 2). */
  rentalExemptionMonthly: number;
  /** סעיף 125ד: התקרה המוטבת, ניכוי למעוטי הכנסה, ניכוי גיל ליחיד ולזוג. */
  interestPreferredCeiling: number;
  interestLowIncomeDeduction: number;
  interestAgeDeductionSingle: number;
  interestAgeDeductionCouple: number;
  /** סעיף 121ב(א1): מס נוסף על הכנסה ממקור הוני, בתוקף מ-2025. */
  capitalSurtaxRate: number;
}

/**
 * מקור: לוחות העזר של רשות המסים לכל שנה. תקרת שכר הדירה ל-2020–2021 לפי הטבלה המעודכנת
 * שפורסמה בלוח 2021 בעקבות ת״צ 55766-07-21. ל-2023 הלוח מציין 5,471 (בוויקיטקסט 5,470).
 */
export const FULL_RETURN_YEAR_RULES: Record<TaxRefundYear, FullReturnYearRule> = {
  '2020': { rentalExemptionMonthly: 5_105, interestPreferredCeiling: 63_000, interestLowIncomeDeduction: 9_840, interestAgeDeductionSingle: 13_560, interestAgeDeductionCouple: 16_680, capitalSurtaxRate: 0 },
  '2021': { rentalExemptionMonthly: 5_074, interestPreferredCeiling: 62_640, interestLowIncomeDeduction: 9_840, interestAgeDeductionSingle: 13_440, interestAgeDeductionCouple: 16_560, capitalSurtaxRate: 0 },
  '2022': { rentalExemptionMonthly: 5_196, interestPreferredCeiling: 64_200, interestLowIncomeDeduction: 10_080, interestAgeDeductionSingle: 13_800, interestAgeDeductionCouple: 16_920, capitalSurtaxRate: 0 },
  '2023': { rentalExemptionMonthly: 5_471, interestPreferredCeiling: 67_560, interestLowIncomeDeduction: 10_560, interestAgeDeductionSingle: 14_520, interestAgeDeductionCouple: 17_760, capitalSurtaxRate: 0 },
  '2024': { rentalExemptionMonthly: 5_654, interestPreferredCeiling: 69_840, interestLowIncomeDeduction: 10_920, interestAgeDeductionSingle: 15_000, interestAgeDeductionCouple: 18_360, capitalSurtaxRate: 0 },
  '2025': { rentalExemptionMonthly: 5_654, interestPreferredCeiling: 69_840, interestLowIncomeDeduction: 10_920, interestAgeDeductionSingle: 15_000, interestAgeDeductionCouple: 18_360, capitalSurtaxRate: 0.02 },
};

export type ResidentialRentalTrack = 'exempt' | 'ten-percent' | 'regular';

export interface ResidentialRentalInput {
  track: ResidentialRentalTrack;
  /** דמי שכירות חודשיים כוללים מכל דירות המגורים (כולל בן/בת זוג וילדים עד 18). */
  monthlyRent: number;
  /** מספר חודשי השכרה בשנה (1–12). */
  months: number;
  /** מסלול רגיל: הכנסה חייבת נטו לאחר הוצאות ופחת. */
  regularNetIncome?: number;
  /** מסלול 10% בדירה יחידה: דמי שכירות ששולמו למגורי המשכיר (סעיף 122(ו), עד 90,000 ₪). */
  rentPaidForOwnHome?: number;
  /** מס ששולם כבר במסלול 10% או כמקדמות על השכירות. */
  taxPaid?: number;
}

export interface ForeignRentalInput {
  track: 'fifteen-percent' | 'regular';
  grossRent: number;
  /** מסלול 15%: פחת בלבד מותר בניכוי (סעיף 122א(ב)). */
  depreciation?: number;
  /** מסלול רגיל: הכנסה נטו לאחר הוצאות. */
  regularNetIncome?: number;
  /** מס זר ששולם — מזכה רק במסלול הרגיל. */
  foreignTaxPaid?: number;
  /** מס ששולם בישראל על השכירות (מקדמות). */
  taxPaid?: number;
}

export interface CapitalIncomeInput {
  /** ריבית על פיקדון בנקאי או תכנית חיסכון שאינם צמודים (15%, זכאית לניכוי סעיף 125ד). */
  depositInterestUnlinked?: number;
  /** ריבית אחרת שאינה צמודה, כגון אג״ח שקליות (15%). */
  otherInterestUnlinked?: number;
  /** ריבית צמודה למדד או למטבע חוץ (עד 25%). */
  interestLinked?: number;
  dividends?: number;
  dividendsSubstantial?: number;
  /** רווח הון ריאלי (עד 25%). */
  gainsRegular?: number;
  /** רווח הון ריאלי של בעל מניות מהותי (עד 30%). */
  gainsSubstantial?: number;
  /** רווח הון באג״ח/מילווה לא צמודים (עד 15%). */
  gainsUnlinkedBonds?: number;
  /** רווחים שחילקה קרן נאמנות פטורה (סעיף 125ב1(ב), 25%). */
  mutualFundDistributions?: number;
  /** הפסד הון שוטף ממכירת ניירות ערך בשנת המס (בישראל). */
  currentYearLoss?: number;
  /** הפסד הון מועבר משנים קודמות (מקוזז רק מול רווח הון). */
  carriedForwardLoss?: number;
  foreignDividends?: number;
  foreignDividendsTax?: number;
  foreignInterest?: number;
  foreignInterestTax?: number;
  foreignGains?: number;
  foreignGainsTax?: number;
  /** מס שנוכה במקור מהכנסות הוניות (טופס 867 ואישורי ברוקר). */
  taxWithheld?: number;
}

export interface FullReturnInput {
  taxYear: TaxRefundYear;
  wageSources: TaxRefundIncomeSource[];
  credits: Omit<CreditPointsProfile, 'taxYear'>;
  /** האם מלאו לנישום 60 שנה עד תום שנת המס (סעיף 121(ב)). */
  age60OrOver?: boolean;
  recognizedDeductions?: number;
  pensionCreditMode?: 'automatic' | 'manual';
  manualPensionCredit?: number;
  donations?: number;
  additionalTaxCredits?: number;
  settlement?: { ratePercent: number; ceiling: number };
  residentialRental?: ResidentialRentalInput;
  foreignRental?: ForeignRentalInput;
  /** הכנסה אחרת נטו שאינה מיגיעה אישית ואינה הונית מיוחדת (תמלוגים, שכירות מסחרית וכד׳). */
  otherPassiveIncome?: number;
  capital?: CapitalIncomeInput;
  /** סעיף 125ד(ב): הכנסת בן/בת הזוג החייבת, לבדיקת התקרה המוטבת. */
  spouseTaxableIncome?: number;
  /** סעיף 125ד(ג): גיל פרישת חובה ו-55 שנים ביום 1.1.2003. */
  interestAgeDeduction?: 'none' | 'single' | 'couple';
}

export interface FullReturnLine {
  label: string;
  value: number;
  /** sign=-1 מוצג כהפחתה. */
  sign?: 1 | -1;
  note?: string;
  bold?: boolean;
  group: 'income' | 'tax' | 'credit' | 'summary';
}

export interface FullReturnResult {
  taxYear: TaxRefundYear;
  ledger: CreditPointsLedger;
  lines: FullReturnLine[];
  totalTaxableIncome: number;
  taxBeforeCredits: number;
  totalCredits: number;
  finalTax: number;
  totalPaid: number;
  estimatedRefund: number;
  estimatedBalanceDue: number;
  /** הפסד הון שלא קוזז ועובר לשנים הבאות (מול רווח הון בלבד). */
  lossCarryForward: number;
  /** עודף מס זר שלא זוכה (סעיף 205א — ניתן להעברה 5 שנים מאותו מקור). */
  foreignCreditExcess: number;
  claimDeadline: string;
}

type CapitalKind = 'gain' | 'interest' | 'dividend';

interface CapitalItem {
  key: string;
  label: string;
  amount: number;
  kind: CapitalKind;
  /** שיעור המס הקבוע או התקרה. */
  rate: number;
  /** true: "בשיעור שלא יעלה על" — לפי סעיף 121 עד התקרה. false: שיעור קבוע. */
  capped: boolean;
  /** האם ניתן לקזז מולו הפסד הון שוטף מניירות ערך (סעיף 92(א)(4)). */
  securityOffsetEligible: boolean;
  foreignTax: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

/** הכנסה חייבת חודשית מדמי שכירות במסלול הפטור: הכנסה פחות "התקרה המתואמת". */
export function residentialExemptTaxable(monthlyRent: number, ceiling: number): number {
  const rent = nonNegative(monthlyRent);
  if (rent <= ceiling) return 0;
  const adjustedCeiling = Math.max(0, ceiling - (rent - ceiling));
  return rent - adjustedCeiling;
}

export function calculateFullReturn(input: FullReturnInput): FullReturnResult {
  const year = input.taxYear;
  const rule = TAX_REFUND_YEAR_RULES[year];
  const fullRule = FULL_RETURN_YEAR_RULES[year];
  const age60 = Boolean(input.age60OrOver);
  const lines: FullReturnLine[] = [];

  // ── 1. הכנסה מיגיעה אישית (שכר) ─────────────────────────────────────
  const wageGross = input.wageSources.reduce((sum, s) => sum + nonNegative(s.taxableIncome), 0);
  const wageWithheld = input.wageSources.reduce((sum, s) => sum + nonNegative(s.taxWithheld), 0);
  const deductions = Math.min(nonNegative(input.recognizedDeductions), wageGross);
  const personal = wageGross - deductions;

  lines.push({ group: 'income', label: 'הכנסה מיגיעה אישית (שכר מכל טופסי 106)', value: wageGross });
  if (deductions > 0) lines.push({ group: 'income', label: 'ניכויים מוכרים', value: deductions, sign: -1 });

  // ── 2. שכר דירה למגורים בישראל ──────────────────────────────────────
  let rentalOrdinary = 0;
  let rentalTenPercentBase = 0;
  let rentalTaxPaid = 0;
  const rr = input.residentialRental;
  if (rr && nonNegative(rr.monthlyRent) > 0) {
    const months = Math.round(nonNegative(rr.months));
    if (months < 1 || months > 12) throw new Error('מספר חודשי ההשכרה חייב להיות בין 1 ל-12.');
    const gross = nonNegative(rr.monthlyRent) * months;
    rentalTaxPaid = nonNegative(rr.taxPaid);
    lines.push({ group: 'income', label: 'דמי שכירות למגורים בישראל', value: gross, note: `${months} חודשים` });
    if (rr.track === 'exempt') {
      const ceiling = fullRule.rentalExemptionMonthly;
      rentalOrdinary = residentialExemptTaxable(rr.monthlyRent, ceiling) * months;
      lines.push({
        group: 'income',
        label: 'החלק החייב במסלול הפטור',
        value: rentalOrdinary,
        note: `תקרה חודשית ${ceiling.toLocaleString('he-IL')} ₪; מעליה התקרה מופחתת בסכום החריגה`,
      });
    } else if (rr.track === 'ten-percent') {
      const ownRent = Math.min(nonNegative(rr.rentPaidForOwnHome), 90_000, gross);
      rentalTenPercentBase = gross - ownRent;
      if (ownRent > 0) lines.push({ group: 'income', label: 'דמי שכירות ששולמו למגורי המשכיר (סעיף 122(ו))', value: ownRent, sign: -1 });
    } else {
      rentalOrdinary = nonNegative(rr.regularNetIncome);
      lines.push({ group: 'income', label: 'שכירות במסלול רגיל — הכנסה נטו לאחר הוצאות', value: rentalOrdinary });
    }
  }

  // ── 3. שכר דירה מחו״ל ───────────────────────────────────────────────
  let foreignRentalOrdinary = 0;
  let foreignRentalFifteenBase = 0;
  let foreignRentalOrdinaryForeignTax = 0;
  const fr = input.foreignRental;
  if (fr && nonNegative(fr.grossRent) > 0) {
    rentalTaxPaid += nonNegative(fr.taxPaid);
    lines.push({ group: 'income', label: 'דמי שכירות מחו״ל', value: nonNegative(fr.grossRent) });
    if (fr.track === 'fifteen-percent') {
      foreignRentalFifteenBase = Math.max(0, nonNegative(fr.grossRent) - nonNegative(fr.depreciation));
    } else {
      foreignRentalOrdinary = nonNegative(fr.regularNetIncome);
      foreignRentalOrdinaryForeignTax = nonNegative(fr.foreignTaxPaid);
      lines.push({ group: 'income', label: 'שכירות מחו״ל במסלול רגיל — נטו', value: foreignRentalOrdinary });
    }
  }

  const otherPassive = nonNegative(input.otherPassiveIncome);
  if (otherPassive > 0) lines.push({ group: 'income', label: 'הכנסה אחרת שאינה מיגיעה אישית', value: otherPassive });

  const nonPersonal = rentalOrdinary + foreignRentalOrdinary + otherPassive;
  const ordinaryIncome = personal + nonPersonal;

  // ── 4. הכנסות הוניות, קיזוז הפסדים וניכוי מריבית ─────────────────────
  const cap = input.capital ?? {};
  const items: CapitalItem[] = [
    { key: 'gainsSubstantial', label: 'רווח הון — בעל מניות מהותי', amount: nonNegative(cap.gainsSubstantial), kind: 'gain', rate: 0.3, capped: true, securityOffsetEligible: true, foreignTax: 0 },
    { key: 'gainsRegular', label: 'רווח הון ריאלי', amount: nonNegative(cap.gainsRegular), kind: 'gain', rate: 0.25, capped: true, securityOffsetEligible: true, foreignTax: 0 },
    { key: 'foreignGains', label: 'רווח הון מחו״ל', amount: nonNegative(cap.foreignGains), kind: 'gain', rate: 0.25, capped: true, securityOffsetEligible: true, foreignTax: nonNegative(cap.foreignGainsTax) },
    { key: 'gainsUnlinkedBonds', label: 'רווח הון באג״ח לא צמודות', amount: nonNegative(cap.gainsUnlinkedBonds), kind: 'gain', rate: 0.15, capped: true, securityOffsetEligible: true, foreignTax: 0 },
    { key: 'dividends', label: 'דיבידנד', amount: nonNegative(cap.dividends), kind: 'dividend', rate: 0.25, capped: false, securityOffsetEligible: true, foreignTax: 0 },
    { key: 'foreignDividends', label: 'דיבידנד מחו״ל', amount: nonNegative(cap.foreignDividends), kind: 'dividend', rate: 0.25, capped: false, securityOffsetEligible: true, foreignTax: nonNegative(cap.foreignDividendsTax) },
    // סעיף 92(א)(4)(ב): קיזוז מול דיבידנד רק אם שיעורו אינו עולה על 25% — לא דיבידנד מהותי.
    { key: 'dividendsSubstantial', label: 'דיבידנד — בעל מניות מהותי', amount: nonNegative(cap.dividendsSubstantial), kind: 'dividend', rate: 0.3, capped: false, securityOffsetEligible: false, foreignTax: 0 },
    { key: 'interestLinked', label: 'ריבית צמודה', amount: nonNegative(cap.interestLinked), kind: 'interest', rate: 0.25, capped: true, securityOffsetEligible: true, foreignTax: 0 },
    { key: 'foreignInterest', label: 'ריבית מחו״ל', amount: nonNegative(cap.foreignInterest), kind: 'interest', rate: 0.25, capped: true, securityOffsetEligible: true, foreignTax: nonNegative(cap.foreignInterestTax) },
    // ריבית לא צמודה — "בשיעור שלא יעלה על 15%" (מדריך רשות המסים, דע זכויותיך 2024), ולכן גם מגיל 60 לפי המדרגות.
    { key: 'otherInterestUnlinked', label: 'ריבית לא צמודה מניירות ערך (אג״ח)', amount: nonNegative(cap.otherInterestUnlinked), kind: 'interest', rate: 0.15, capped: true, securityOffsetEligible: true, foreignTax: 0 },
    // חוזר מס הכנסה 10/2025 סעיף 3.7: אין קיזוז הפסד מניירות ערך מול ריבית פיקדון/תכנית חיסכון או מול רווחי קרן נאמנות.
    { key: 'depositInterestUnlinked', label: 'ריבית מפיקדון / תכנית חיסכון', amount: nonNegative(cap.depositInterestUnlinked), kind: 'interest', rate: 0.15, capped: true, securityOffsetEligible: false, foreignTax: 0 },
    { key: 'mutualFundDistributions', label: 'רווחים שחילקה קרן נאמנות פטורה', amount: nonNegative(cap.mutualFundDistributions), kind: 'dividend', rate: 0.25, capped: false, securityOffsetEligible: false, foreignTax: 0 },
  ];

  for (const item of items) {
    if (item.amount > 0) lines.push({ group: 'income', label: item.label, value: item.amount });
  }

  // קיזוז: הפסד שוטף — תחילה מול רווחי הון, ואז מול ריבית/דיבידנד מניירות ערך (סעיף 92(א)(4)).
  // סדר הקיזוז בתוך כל קבוצה: מהשיעור הגבוה לנמוך (הנחת עבודה המיטיבה עם הנישום; סעיף 92(ג) מסמיך את השר לקבוע סדר).
  const byRateDesc = (a: CapitalItem, b: CapitalItem) => b.rate - a.rate;
  let currentLoss = nonNegative(cap.currentYearLoss);
  let carriedLoss = nonNegative(cap.carriedForwardLoss);
  const offset = (pool: CapitalItem[], loss: number) => {
    let remaining = loss;
    for (const item of [...pool].sort(byRateDesc)) {
      if (remaining <= 0) break;
      const used = Math.min(item.amount, remaining);
      if (used > 0) {
        // מס זר מיוחס לחלק שנותר מההכנסה; אין התאמה יחסית — הזיכוי ממילא מוגבל למס הישראלי.
        item.amount -= used;
        remaining -= used;
      }
    }
    return loss - remaining;
  };
  const gains = items.filter((i) => i.kind === 'gain');
  const usedCurrentVsGains = offset(gains, currentLoss);
  currentLoss -= usedCurrentVsGains;
  const usedCurrentVsIncome = offset(items.filter((i) => i.kind !== 'gain' && i.securityOffsetEligible), currentLoss);
  currentLoss -= usedCurrentVsIncome;
  const usedCarried = offset(gains, carriedLoss);
  carriedLoss -= usedCarried;
  const lossCarryForward = currentLoss + carriedLoss;
  if (usedCurrentVsGains + usedCurrentVsIncome > 0) {
    lines.push({ group: 'income', label: 'קיזוז הפסד הון שוטף', value: usedCurrentVsGains + usedCurrentVsIncome, sign: -1, note: 'מול רווחי הון, ואז מול ריבית ודיבידנד מניירות ערך' });
  }
  if (usedCarried > 0) lines.push({ group: 'income', label: 'קיזוז הפסד הון מועבר', value: usedCarried, sign: -1, note: 'מול רווחי הון בלבד' });

  // ניכוי מריבית — סעיף 125ד, רק על ריבית מפיקדון/תכנית חיסכון.
  const deposit = items.find((i) => i.key === 'depositInterestUnlinked')!;
  if (deposit.amount > 0) {
    const preliminaryTotal = ordinaryIncome + items.reduce((sum, i) => sum + i.amount, 0) + rentalTenPercentBase + foreignRentalFifteenBase;
    const combined = preliminaryTotal + nonNegative(input.spouseTaxableIncome);
    const lowIncome = Math.max(0, fullRule.interestLowIncomeDeduction - Math.max(0, combined - fullRule.interestPreferredCeiling));
    const age = input.interestAgeDeduction === 'couple'
      ? fullRule.interestAgeDeductionCouple
      : input.interestAgeDeduction === 'single'
        ? fullRule.interestAgeDeductionSingle
        : 0;
    // הנחת עבודה: החוק אינו קובע צירוף של שני הניכויים; נלקח הגבוה מביניהם.
    const interestDeduction = Math.min(deposit.amount, Math.max(lowIncome, age));
    if (interestDeduction > 0) {
      deposit.amount -= interestDeduction;
      lines.push({ group: 'income', label: 'ניכוי מריבית (סעיף 125ד)', value: interestDeduction, sign: -1 });
    }
  }

  const capitalTotal = items.reduce((sum, i) => sum + i.amount, 0);
  const totalTaxableIncome = ordinaryIncome + capitalTotal + rentalTenPercentBase + foreignRentalFifteenBase;
  lines.push({ group: 'income', label: 'סך ההכנסה החייבת', value: totalTaxableIncome, bold: true });

  // ── 5. חישוב המס ───────────────────────────────────────────────────
  const brackets = rule.brackets;
  const taxPersonal = taxOnSlice(brackets, 0, personal);
  // הכנסה שאינה מיגיעה אישית נערמת מעל השכר; עד גיל 60 — לפחות 31% (סעיף 121(א)).
  const nonPersonalRate = (r: number) => (age60 ? r : Math.max(r, 0.31));
  const taxNonPersonal = taxOnSlice(brackets, personal, ordinaryIncome, nonPersonalRate);
  lines.push({ group: 'tax', label: 'מס לפי מדרגות על השכר', value: taxPersonal });
  if (nonPersonal > 0) {
    lines.push({
      group: 'tax',
      label: 'מס על הכנסה שאינה מיגיעה אישית',
      value: taxNonPersonal,
      note: age60 ? 'מגיל 60 — מדרגות מופחתות (סעיף 121(ב))' : 'שיעור מזערי 31% (סעיף 121(א))',
    });
  }

  // הכנסות הוניות — "השלב הגבוה ביותר בסולם". פריטי "שלא יעלה על" ממוסים לפי סעיף 121 עד התקרה;
  // פריטים בתקרה גבוהה נערמים ראשונים (הנחת עבודה המיטיבה לבני 60+; מתחת לגיל 60 אין השפעה).
  let cursor = ordinaryIncome;
  const cappedItems = items.filter((i) => i.capped && i.amount > 0).sort(byRateDesc);
  const flatItems = items.filter((i) => !i.capped && i.amount > 0);
  const capitalTaxByItem = new Map<string, number>();
  for (const item of cappedItems) {
    const tax = taxOnSlice(brackets, cursor, cursor + item.amount, (r) => Math.min(nonPersonalRate(r), item.rate));
    capitalTaxByItem.set(item.key, tax);
    cursor += item.amount;
  }
  for (const item of flatItems) {
    capitalTaxByItem.set(item.key, item.amount * item.rate);
    cursor += item.amount;
  }
  let capitalTax = 0;
  for (const item of [...cappedItems, ...flatItems]) {
    const tax = capitalTaxByItem.get(item.key) ?? 0;
    capitalTax += tax;
    lines.push({
      group: 'tax',
      label: `מס על ${item.label}`,
      value: tax,
      note: item.capped ? `לפי סעיף 121, עד ${Math.round(item.rate * 100)}%` : `${Math.round(item.rate * 100)}%`,
    });
  }

  const tenPercentTax = rentalTenPercentBase * 0.1;
  if (rentalTenPercentBase > 0) lines.push({ group: 'tax', label: 'מס 10% על שכירות למגורים (סעיף 122)', value: tenPercentTax, note: 'ללא הוצאות, קיזוז, זיכוי או פטור' });
  const fifteenPercentTax = foreignRentalFifteenBase * 0.15;
  if (foreignRentalFifteenBase > 0) lines.push({ group: 'tax', label: 'מס 15% על שכירות מחו״ל (סעיף 122א)', value: fifteenPercentTax, note: 'פחת בלבד מותר בניכוי; ללא זיכוי מס זר' });

  const surtax = Math.max(0, totalTaxableIncome - rule.surtaxThreshold) * 0.03;
  const capitalSourceIncome = nonPersonal + capitalTotal + rentalTenPercentBase + foreignRentalFifteenBase;
  const capitalSurtax = Math.max(0, capitalSourceIncome - rule.surtaxThreshold) * fullRule.capitalSurtaxRate;
  if (surtax > 0) lines.push({ group: 'tax', label: 'מס יסף 3% (סעיף 121ב(א))', value: surtax });
  if (capitalSurtax > 0) lines.push({ group: 'tax', label: 'מס נוסף 2% על הכנסה ממקור הוני (סעיף 121ב(א1))', value: capitalSurtax });

  const taxBeforeCredits = taxPersonal + taxNonPersonal + capitalTax + tenPercentTax + fifteenPercentTax + surtax + capitalSurtax;
  lines.push({ group: 'tax', label: 'מס לפני זיכויים', value: taxBeforeCredits, bold: true });

  // ── 6. זיכויים — לפי סוג ההכנסה שמולה הם מותרים ─────────────────────
  const ledger = buildCreditPointsLedger({ ...input.credits, taxYear: year });
  const pointValue = rule.creditPointMonthly * 12;
  const pointsOf = (key: string) => ledger.lines.filter((l) => l.key === key).reduce((s, l) => s + l.points, 0);
  // מוגבלות למס על הכנסה מיגיעה אישית: ילדים (סעיף 66(ג)(4)-(5)), חייל משוחרר (סעיף 39א),
  // ונקודות נוספות שאומתו (לרוב הורה יחיד/ילדים — הנחה שמרנית).
  const personalOnlyPoints = pointsOf('children') + pointsOf('soldier') + pointsOf('additional');
  // ללא הגבלה בחוק — מול כל המס, למעט מסלולי 10%/15%: תושב, נסיעה ואישה (סעיפים 34, 36, 36א), תואר (40ג), עולה (35).
  const generalPoints = ledger.total - personalOnlyPoints;

  // מאגרי מס שמולם ניתן לזכות. מסלולי 10%/15% אינם מאגר — החוק אוסר זיכוי מולם.
  let personalPool = taxPersonal;
  let ordinaryPool = taxPersonal + taxNonPersonal + surtax + capitalSurtax;
  let capitalPool = capitalTax;
  const take = (amount: number, pools: ('personal' | 'ordinary' | 'capital')[]) => {
    let remaining = Math.max(0, amount);
    let used = 0;
    for (const pool of pools) {
      if (remaining <= 0) break;
      if (pool === 'personal') {
        const u = Math.min(remaining, personalPool, ordinaryPool);
        personalPool -= u; ordinaryPool -= u; remaining -= u; used += u;
      } else if (pool === 'ordinary') {
        const u = Math.min(remaining, ordinaryPool);
        ordinaryPool -= u; personalPool = Math.min(personalPool, ordinaryPool); remaining -= u; used += u;
      } else {
        const u = Math.min(remaining, capitalPool);
        capitalPool -= u; remaining -= u; used += u;
      }
    }
    return used;
  };

  let totalCredits = 0;
  const ordinaryRegularTax = taxPersonal + taxNonPersonal;
  const creditLine = (label: string, requested: number, used: number, note?: string) => {
    if (requested <= 0) return;
    totalCredits += used;
    lines.push({
      group: 'credit',
      label,
      value: used,
      sign: -1,
      note: used + 0.005 < requested ? `${note ? `${note}. ` : ''}נוצל ${Math.round(used).toLocaleString('he-IL')} ₪ מתוך ${Math.round(requested).toLocaleString('he-IL')} ₪ — אין מס מספיק לקיזוז` : note,
    });
  };

  // הנחת יישוב: מהכנסה מיגיעה אישית בלבד.
  let settlementDiscount = 0;
  if (input.settlement) {
    const { ratePercent, ceiling } = input.settlement;
    if (!(ratePercent > 0 && ratePercent <= 20) || !(ceiling > 0 && ceiling <= 300_000)) {
      throw new Error('הנחת יישוב: יש להזין שיעור עד 20% ותקרה מהרשימה הרשמית.');
    }
    settlementDiscount = Math.min(personal, ceiling) * (ratePercent / 100);
  }
  creditLine('הנחת יישוב מוטב', settlementDiscount, take(settlementDiscount, ['personal']), 'מהכנסה מיגיעה אישית עד התקרה');

  // נקודות ילדים, חייל ונוספות — מול מס על הכנסה מיגיעה אישית בלבד.
  const personalPointsAmount = personalOnlyPoints * pointValue;
  creditLine('נקודות זיכוי — ילדים, חייל משוחרר ונוספות', personalPointsAmount, take(personalPointsAmount, ['personal']), `${round2(personalOnlyPoints)} נקודות; כנגד מס על הכנסה מיגיעה אישית בלבד`);

  // נקודות תושב, תואר ועולה — מול כל המס (רגיל ואחר כך הוני). הן מופעלות אחרי המוגבלות.
  const generalAmount = generalPoints * pointValue;
  creditLine('נקודות זיכוי — תושב, תואר ועולה', generalAmount, take(generalAmount, ['ordinary', 'capital']), `${round2(generalPoints)} נקודות × ${pointValue.toLocaleString('he-IL')} ₪`);

  // פנסיה (סעיף 45א) — אותו חישוב ואותם מגנים כמו במנוע ההחזר.
  const pensionBase = calculateTaxRefund({
    taxYear: year,
    incomeSources: input.wageSources,
    creditPoints: 0,
    recognizedDeductions: input.recognizedDeductions,
    pensionCreditMode: input.pensionCreditMode,
    manualPensionCredit: input.manualPensionCredit,
  });
  creditLine('זיכוי פנסיה (סעיף 45א)', pensionBase.pensionTaxCredit, take(pensionBase.pensionTaxCredit, ['ordinary', 'capital']));

  // תרומות (סעיף 46) — עד 30% מההכנסה החייבת ועד התקרה השנתית.
  const donations = nonNegative(input.donations);
  const donationEligible = donations > rule.donationMinimum
    ? Math.min(donations, totalTaxableIncome * 0.3, rule.donationMaximum)
    : 0;
  const donationCredit = donationEligible * 0.35;
  creditLine('זיכוי תרומות (סעיף 46)', donationCredit, take(donationCredit, ['ordinary', 'capital']), `35% מ-${Math.round(donationEligible).toLocaleString('he-IL')} ₪`);

  const extra = nonNegative(input.additionalTaxCredits);
  creditLine('זיכויי מס נוספים שהוזנו', extra, take(extra, ['ordinary', 'capital']));

  // זיכוי מסי חוץ — סעיף 204. הכנסה בשיעור מיוחד: עד המס הישראלי על אותה הכנסה.
  let foreignCreditExcess = 0;
  for (const item of items) {
    if (item.foreignTax <= 0) continue;
    const israeliTax = capitalTaxByItem.get(item.key) ?? 0;
    const allowed = Math.min(item.foreignTax, israeliTax);
    foreignCreditExcess += item.foreignTax - allowed;
    creditLine(`זיכוי מס זר — ${item.label}`, item.foreignTax, take(allowed, ['capital']), 'עד גובה המס בישראל על אותה הכנסה (סעיף 204(ב))');
  }
  // הכנסה רגילה מחו״ל: עד יחס ההכנסה × המס על ההכנסה הרגילה (סעיף 204(א)).
  if (foreignRentalOrdinaryForeignTax > 0 && ordinaryIncome > 0) {
    // דע זכויותיך 2024: המס על ההכנסה בשיעורים רגילים "לאחר הזיכויים האישיים ולפני זיכוי בגין מס זר".
    const ordinaryTaxAfterPersonalCredits = Math.max(0, Math.min(ordinaryRegularTax, ordinaryPool));
    const ceilingCredit = (foreignRentalOrdinary / ordinaryIncome) * ordinaryTaxAfterPersonalCredits;
    const allowed = Math.min(foreignRentalOrdinaryForeignTax, ceilingCredit);
    foreignCreditExcess += foreignRentalOrdinaryForeignTax - allowed;
    creditLine('זיכוי מס זר — שכירות מחו״ל', foreignRentalOrdinaryForeignTax, take(allowed, ['ordinary']), 'עד חלקה היחסי של ההכנסה במס על ההכנסה הרגילה (סעיף 204(א))');
  }

  const finalTax = Math.max(0, taxBeforeCredits - totalCredits);
  lines.push({ group: 'summary', label: 'חבות מס שנתית', value: finalTax, bold: true });

  const capitalWithheld = nonNegative(cap.taxWithheld);
  const totalPaid = wageWithheld + capitalWithheld + rentalTaxPaid;
  lines.push({ group: 'summary', label: 'מס שנוכה משכר', value: wageWithheld });
  if (capitalWithheld > 0) lines.push({ group: 'summary', label: 'מס שנוכה במקור מהכנסות הוניות', value: capitalWithheld });
  if (rentalTaxPaid > 0) lines.push({ group: 'summary', label: 'מס ששולם על שכירות', value: rentalTaxPaid });
  lines.push({ group: 'summary', label: 'סך המס ששולם', value: totalPaid, bold: true });

  const difference = totalPaid - finalTax;
  return {
    taxYear: year,
    ledger,
    lines: lines.map((line) => ({ ...line, value: round2(line.value) })),
    totalTaxableIncome,
    taxBeforeCredits,
    totalCredits,
    finalTax,
    totalPaid,
    estimatedRefund: Math.max(0, difference),
    estimatedBalanceDue: Math.max(0, -difference),
    lossCarryForward,
    foreignCreditExcess,
    claimDeadline: rule.claimDeadline,
  };
}
