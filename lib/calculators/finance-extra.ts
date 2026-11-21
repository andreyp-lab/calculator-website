/**
 * מחשבונים פיננסיים משלימים — פונקציות טהורות.
 * קבועי מס מגיעים מ-`tax-2026.ts` או מ-`RENTAL_TAX_2026` כאן (נקראו ב-20.11.2026 ממקורות משניים: כל זכות/ביזפורטל).
 * התוצאות אומדן; אינן ייעוץ מס או השקעות.
 */

import {
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
  STUDY_FUND_2026,
  VAT_2026,
  calculateAnnualIncomeTax,
} from '@/lib/constants/tax-2026';

const round2 = (n: number) => Math.round(n * 100) / 100;
const ok = (...ns: number[]) => ns.every((n) => Number.isFinite(n));

/** פטור שכר דירה למגורים 2026: תקרה חודשית; מעליה הפטור נשחק עד 2× התקרה. מסלול 10% קבוע. */
export const RENTAL_TAX_2026 = { exemptMonthlyCeiling: 5_654, flatTrackRate: 0.1 } as const;

// ───────────────────────── 1. הלוואה בשלוש שיטות ─────────────────────────

export type LoanMethod = 'spitzer' | 'equal-principal' | 'balloon';
export interface LoanRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}
export interface LoanScheduleResult {
  firstPayment: number;
  lastPayment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: LoanRow[];
}
/**
 * `balloonPct` (0–100) חל רק על שיטת בלון: אחוז מהקרן שנפרע בתשלום האחרון; על חלקו משלמים ריבית בלבד,
 * והיתרה נפרעת בשפיצר. 100 = ריבית בלבד לכל התקופה.
 */
export function loanSchedule(input: {
  principal: number;
  annualRatePct: number;
  months: number;
  method: LoanMethod;
  balloonPct?: number;
}): LoanScheduleResult | null {
  const { principal, annualRatePct, months, method } = input;
  const balloonPct = input.balloonPct ?? 100;
  if (!ok(principal, annualRatePct, months, balloonPct) || principal <= 0 || annualRatePct < 0 || annualRatePct > 100) return null;
  if (!Number.isInteger(months) || months < 1 || months > 600 || balloonPct < 0 || balloonPct > 100) return null;
  const r = annualRatePct / 100 / 12;
  const rows: LoanRow[] = [];
  let balance = principal;
  const pmt = (p: number, n: number) => (r === 0 ? p / n : (p * r) / (1 - (1 + r) ** -n));
  const balloon = method === 'balloon' ? (principal * balloonPct) / 100 : 0;
  const amortized = principal - balloon;
  const monthlyAmortized = method === 'spitzer' ? pmt(principal, months) : method === 'balloon' && amortized > 0 ? pmt(amortized, months) : 0;
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    let principalPart: number;
    if (method === 'spitzer') principalPart = monthlyAmortized - interest;
    else if (method === 'equal-principal') principalPart = principal / months;
    else {
      const interestOnBalloon = balloon * r;
      const interestOnAmortized = (balance - balloon) * r;
      principalPart = monthlyAmortized - interestOnAmortized;
      if (amortized <= 0) principalPart = 0;
      const payment0 = principalPart + interestOnBalloon + interestOnAmortized;
      if (m === months) {
        const total = payment0 + balloon;
        rows.push({ month: m, payment: round2(total), principal: round2(principalPart + balloon), interest: round2(interestOnBalloon + interestOnAmortized), balance: 0 });
        balance = 0;
        continue;
      }
      balance -= principalPart;
      rows.push({ month: m, payment: round2(payment0), principal: round2(principalPart), interest: round2(interestOnBalloon + interestOnAmortized), balance: round2(balance) });
      continue;
    }
    balance -= principalPart;
    rows.push({ month: m, payment: round2(principalPart + interest), principal: round2(principalPart), interest: round2(interest), balance: round2(Math.max(0, balance)) });
  }
  const totalPaid = rows.reduce((s, x) => s + x.payment, 0);
  return {
    firstPayment: rows[0].payment,
    lastPayment: rows[rows.length - 1].payment,
    totalPaid: round2(totalPaid),
    totalInterest: round2(totalPaid - principal),
    schedule: rows,
  };
}

// ───────────────────────── 2. סילוק חוב ─────────────────────────

export interface DebtPayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
}
/** כמה חודשים לסגור חוב בהחזר חודשי קבוע. null אם ההחזר אינו מכסה את הריבית החודשית. */
export function debtPayoff(balance: number, annualRatePct: number, monthlyPayment: number): DebtPayoffResult | null {
  if (!ok(balance, annualRatePct, monthlyPayment) || balance <= 0 || annualRatePct < 0 || annualRatePct > 100 || monthlyPayment <= 0) return null;
  const r = annualRatePct / 100 / 12;
  if (monthlyPayment <= balance * r) return null;
  let owed = balance;
  let paid = 0;
  let months = 0;
  while (owed > 0.005 && months < 1200) {
    const pay = Math.min(monthlyPayment, owed * (1 + r));
    owed = owed * (1 + r) - pay;
    paid += pay;
    months++;
  }
  return { months, totalInterest: round2(paid - balance), totalPaid: round2(paid) };
}
/** ההחזר החודשי הנדרש כדי לסגור חוב ב-N חודשים. */
export function paymentToClearIn(balance: number, annualRatePct: number, months: number): number | null {
  if (!ok(balance, annualRatePct, months) || balance <= 0 || annualRatePct < 0 || annualRatePct > 100 || !Number.isInteger(months) || months < 1 || months > 1200) return null;
  const r = annualRatePct / 100 / 12;
  return round2(r === 0 ? balance / months : (balance * r) / (1 - (1 + r) ** -months));
}

// ───────────────────────── 3. יעד חיסכון ─────────────────────────

export interface SavingsGrowth {
  futureValue: number;
  totalDeposited: number;
  gains: number;
  /** ערך אמיתי לפי אינפלציה שנתית (0 אם לא הוזנה) */
  realValue: number;
}
/** ערך עתידי של חיסכון: סכום פתיחה + הפקדה חודשית (בסוף חודש), ריבית שנתית מחושבת חודשית. */
export function savingsFutureValue(input: { initial: number; monthly: number; annualRatePct: number; years: number; inflationPct?: number }): SavingsGrowth | null {
  const { initial, monthly, annualRatePct, years } = input;
  const infl = input.inflationPct ?? 0;
  if (!ok(initial, monthly, annualRatePct, years, infl) || initial < 0 || monthly < 0 || annualRatePct < -50 || annualRatePct > 100 || years <= 0 || years > 80 || infl < -20 || infl > 100) return null;
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const growth = (1 + r) ** n;
  const fv = initial * growth + (r === 0 ? monthly * n : monthly * ((growth - 1) / r));
  const deposited = initial + monthly * n;
  const real = fv / (1 + infl / 100) ** years;
  return { futureValue: round2(fv), totalDeposited: round2(deposited), gains: round2(fv - deposited), realValue: round2(real) };
}
/** ההפקדה החודשית הנדרשת כדי להגיע ליעד. */
export function monthlyToReachGoal(input: { goal: number; initial: number; annualRatePct: number; years: number }): number | null {
  const { goal, initial, annualRatePct, years } = input;
  if (!ok(goal, initial, annualRatePct, years) || goal <= 0 || initial < 0 || annualRatePct < -50 || annualRatePct > 100 || years <= 0 || years > 80) return null;
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const growth = (1 + r) ** n;
  const needed = goal - initial * growth;
  if (needed <= 0) return 0;
  return round2(r === 0 ? needed / n : (needed * r) / (growth - 1));
}

// ───────────────────────── 4. תשואת שכירות ─────────────────────────

export interface RentalYieldResult {
  annualRentGross: number;
  annualRentCollected: number;
  netAnnualIncome: number;
  grossYieldPct: number;
  netYieldPct: number;
  paybackYears: number | null;
}
export function rentalYield(input: { purchasePrice: number; purchaseCosts: number; monthlyRent: number; vacancyMonths: number; annualExpenses: number }): RentalYieldResult | null {
  const { purchasePrice, purchaseCosts, monthlyRent, vacancyMonths, annualExpenses } = input;
  if (!ok(purchasePrice, purchaseCosts, monthlyRent, vacancyMonths, annualExpenses) || purchasePrice <= 0 || purchaseCosts < 0 || monthlyRent < 0 || vacancyMonths < 0 || vacancyMonths > 12 || annualExpenses < 0) return null;
  const gross = monthlyRent * 12;
  const collected = monthlyRent * (12 - vacancyMonths);
  const net = collected - annualExpenses;
  const invested = purchasePrice + purchaseCosts;
  return {
    annualRentGross: round2(gross),
    annualRentCollected: round2(collected),
    netAnnualIncome: round2(net),
    grossYieldPct: round2((gross / purchasePrice) * 100),
    netYieldPct: round2((net / invested) * 100),
    paybackYears: net > 0 ? round2(invested / net) : null,
  };
}

// ───────────────────────── 5. עוסק פטור מול מורשה ─────────────────────────

export interface OsekInput {
  /** הכנסה שנתית לפני מע"מ (מחיר לפני מע"מ) */
  annualRevenueExVat: number;
  /** הוצאות שנתיות לפני מע"מ */
  annualExpensesExVat: number;
  /** האם הלקוחות הם עסקים שמקזזים מע"מ. אם לא (צרכנים), עוסק מורשה מפסיד 18/118 מהמחיר המוצג כשהמחיר סופי */
  customersRecoverVat: boolean;
  /** נקודות זיכוי (ברירת מחדל 2.25 לתושב) */
  creditPoints?: number;
}
export interface OsekSideResult {
  revenueKept: number;
  expensesBorne: number;
  profit: number;
  incomeTax: number;
  nationalInsurance: number;
  netInHand: number;
  vatPaidToState: number;
}
export interface OsekResult {
  exempt: OsekSideResult;
  licensed: OsekSideResult;
  /** הפרש נטו שנתי: חיובי = מורשה משתלם יותר */
  licensedAdvantage: number;
  exemptAllowed: boolean;
}
function selfEmployedTaxes(profit: number, creditPoints: number) {
  const tax = Math.max(0, calculateAnnualIncomeTax(profit) - creditPoints * 2_904);
  const btl = profit > 0 ? btlSelfEmployed(profit / 12) * 12 : 0;
  return { tax: round2(tax), btl: round2(btl) };
}
function btlSelfEmployed(monthly: number): number {
  const c = SOCIAL_SECURITY_SELF_EMPLOYED_2026;
  const insured = Math.min(monthly, c.maxThresholdMonthly);
  const red = Math.min(insured, c.reducedThresholdMonthly);
  const full = Math.max(0, insured - c.reducedThresholdMonthly);
  return red * c.reducedRate.total + full * c.fullRate.total;
}
/** הנחות: מע"מ 18%; עוסק פטור אינו גובה מע"מ ואינו מקזז מע"מ תשומות (ההוצאות נושאות את המע"מ). */
export function compareOsek(input: OsekInput): OsekResult | null {
  const { annualRevenueExVat: rev, annualExpensesExVat: exp, customersRecoverVat } = input;
  const cp = input.creditPoints ?? 2.25;
  if (!ok(rev, exp, cp) || rev < 0 || exp < 0 || cp < 0 || cp > 20) return null;
  const vat = VAT_2026.standard;
  // מורשה: הכנסה נטו ללא מע"מ, הוצאות ללא מע"מ. המע"מ בעסקאות עובר למדינה ואינו הכנסה.
  const licensedProfit = rev - exp;
  const licensedTaxes = selfEmployedTaxes(licensedProfit, cp);
  const licensed: OsekSideResult = {
    revenueKept: round2(rev), expensesBorne: round2(exp), profit: round2(licensedProfit),
    incomeTax: licensedTaxes.tax, nationalInsurance: licensedTaxes.btl,
    netInHand: round2(licensedProfit - licensedTaxes.tax - licensedTaxes.btl),
    vatPaidToState: round2(Math.max(0, rev * vat - exp * vat)),
  };
  // פטור: אינו מוסיף מע"מ למחיר; אם הלקוחות צרכנים והמחיר שלהם קבוע (כולל מע"מ) הוא שומר את כל המחיר,
  // אחרת נטען שהמחיר שמוצג לעסקים זהה (הם אינם מקזזים, ולכן אין הפסד מבחינתם). ההוצאות כוללות מע"מ.
  const exemptRevenue = rev; // מחיר ללא מע"מ שמתקבל בפועל
  const exemptExpenses = exp * (1 + vat);
  const exemptProfit = exemptRevenue - exemptExpenses;
  const exemptTaxes = selfEmployedTaxes(exemptProfit, cp);
  const exempt: OsekSideResult = {
    revenueKept: round2(exemptRevenue), expensesBorne: round2(exemptExpenses), profit: round2(exemptProfit),
    incomeTax: exemptTaxes.tax, nationalInsurance: exemptTaxes.btl,
    netInHand: round2(exemptProfit - exemptTaxes.tax - exemptTaxes.btl), vatPaidToState: 0,
  };
  // לקוחות צרכנים במחיר סופי קבוע: מורשה חייב להפחית מהמחיר 18/118 (המע"מ כלול), כלומר מקבל rev/1.18
  if (!customersRecoverVat) {
    const lic = rev / (1 + vat);
    const p = lic - exp;
    const t = selfEmployedTaxes(p, cp);
    licensed.revenueKept = round2(lic);
    licensed.profit = round2(p);
    licensed.incomeTax = t.tax;
    licensed.nationalInsurance = t.btl;
    licensed.netInHand = round2(p - t.tax - t.btl);
    licensed.vatPaidToState = round2(Math.max(0, lic * vat - exp * vat));
  }
  return {
    exempt, licensed,
    licensedAdvantage: round2(licensed.netInHand - exempt.netInHand),
    exemptAllowed: rev <= VAT_2026.smallBusinessThreshold,
  };
}

// ───────────────────────── 6. מס על שכר דירה ─────────────────────────

export interface RentalTaxInput {
  monthlyRent: number;
  /** הכנסה חייבת אחרת בשנה (לקביעת המדרגה השולית) */
  otherAnnualIncome: number;
  /** הוצאות שנתיות מוכרות במסלול הרגיל (ריבית, פחת, תיקונים, שכ"ט) */
  annualExpenses: number;
}
export interface RentalTaxResult {
  exemptTrack: { taxableAnnual: number; tax: number; applicable: boolean };
  flatTrack: { tax: number };
  regularTrack: { taxableAnnual: number; tax: number };
  best: 'exempt' | 'flat' | 'regular';
}
export function rentalIncomeTax(input: RentalTaxInput): RentalTaxResult | null {
  const { monthlyRent, otherAnnualIncome, annualExpenses } = input;
  if (!ok(monthlyRent, otherAnnualIncome, annualExpenses) || monthlyRent < 0 || otherAnnualIncome < 0 || annualExpenses < 0) return null;
  const ceiling = RENTAL_TAX_2026.exemptMonthlyCeiling;
  const annualRent = monthlyRent * 12;
  // פטור: עד תקרה כולו פטור; בין תקרה ל-2×תקרה: פטור = 2×תקרה − שכר הדירה; מעל — אין פטור
  const taxableMonthly = monthlyRent <= ceiling ? 0 : monthlyRent < 2 * ceiling ? 2 * monthlyRent - 2 * ceiling : monthlyRent;
  const exemptTaxable = taxableMonthly * 12;
  const incremental = (extra: number) => calculateAnnualIncomeTax(otherAnnualIncome + extra) - calculateAnnualIncomeTax(otherAnnualIncome);
  const exemptTax = incremental(exemptTaxable);
  const flatTax = annualRent * RENTAL_TAX_2026.flatTrackRate;
  const regularTaxable = Math.max(0, annualRent - annualExpenses);
  const regularTax = incremental(regularTaxable);
  const entries: [RentalTaxResult['best'], number][] = [['exempt', exemptTax], ['flat', flatTax], ['regular', regularTax]];
  entries.sort((a, b) => a[1] - b[1]);
  return {
    exemptTrack: { taxableAnnual: round2(exemptTaxable), tax: round2(exemptTax), applicable: true },
    flatTrack: { tax: round2(flatTax) },
    regularTrack: { taxableAnnual: round2(regularTaxable), tax: round2(regularTax) },
    best: entries[0][0],
  };
}

// ───────────────────────── 7. קרן השתלמות ─────────────────────────

export interface StudyFundResult {
  /** עצמאי: סכום הניכוי המותר */
  deductibleDeposit: number;
  taxSaving: number;
  /** תקרת הפקדה פטורה ממס רווחי הון */
  annualExemptCeiling: number;
  depositWithinCeiling: boolean;
  accumulated: number;
  totalDeposited: number;
  gains: number;
}
export function studyFund(input: { annualIncome: number; annualDeposit: number; annualReturnPct: number; years: number; selfEmployed: boolean }): StudyFundResult | null {
  const { annualIncome, annualDeposit, annualReturnPct, years, selfEmployed } = input;
  if (!ok(annualIncome, annualDeposit, annualReturnPct, years) || annualIncome < 0 || annualDeposit < 0 || annualReturnPct < -50 || annualReturnPct > 50 || years < 0.5 || years > 60) return null;
  const f = STUDY_FUND_2026;
  const deductible = selfEmployed ? Math.min(annualDeposit, f.taxDeductionPercentage * Math.min(annualIncome, f.incomeCeilingSelfEmployed)) : 0;
  const marginalTax = calculateAnnualIncomeTax(annualIncome) - calculateAnnualIncomeTax(Math.max(0, annualIncome - deductible));
  const growth = savingsFutureValue({ initial: 0, monthly: annualDeposit / 12, annualRatePct: annualReturnPct, years });
  if (!growth) return null;
  return {
    deductibleDeposit: round2(deductible),
    taxSaving: round2(marginalTax),
    annualExemptCeiling: f.maxAnnualDeposit,
    depositWithinCeiling: annualDeposit <= f.maxAnnualDeposit,
    accumulated: growth.futureValue,
    totalDeposited: growth.totalDeposited,
    gains: growth.gains,
  };
}

// ───────────────────────── 8. שכירות מול קנייה ─────────────────────────

export interface RentVsBuyInput {
  price: number;
  equity: number;
  mortgageRatePct: number;
  mortgageYears: number;
  /** עלויות רכישה (מס רכישה, עו"ד, תיווך) כאחוז מהמחיר */
  purchaseCostsPct: number;
  /** תחזוקה וביטוח שנתיים כאחוז מערך הדירה */
  maintenancePct: number;
  monthlyRent: number;
  rentGrowthPct: number;
  appreciationPct: number;
  /** תשואה שנתית על הכסף שאינו מושקע בדירה */
  investmentReturnPct: number;
  /** עלויות מכירה כאחוז מהשווי בסוף התקופה */
  sellingCostsPct: number;
  horizonYears: number;
}
export interface RentVsBuyResult {
  buyNetWorth: number;
  rentNetWorth: number;
  /** חיובי = קנייה עדיפה */
  buyAdvantage: number;
  monthlyMortgage: number;
  propertyValueAtHorizon: number;
  mortgageBalanceAtHorizon: number;
}
export function rentVsBuy(i: RentVsBuyInput): RentVsBuyResult | null {
  if (!ok(i.price, i.equity, i.mortgageRatePct, i.mortgageYears, i.purchaseCostsPct, i.maintenancePct, i.monthlyRent, i.rentGrowthPct, i.appreciationPct, i.investmentReturnPct, i.sellingCostsPct, i.horizonYears)) return null;
  if (i.price <= 0 || i.equity < 0 || i.equity > i.price || i.horizonYears < 1 || i.horizonYears > 50 || !Number.isInteger(i.horizonYears) || i.mortgageYears < 1 || i.mortgageYears > 40 || i.monthlyRent < 0) return null;
  const loan = i.price - i.equity;
  const nMort = i.mortgageYears * 12;
  const rm = i.mortgageRatePct / 100 / 12;
  const pmt = loan <= 0 ? 0 : rm === 0 ? loan / nMort : (loan * rm) / (1 - (1 + rm) ** -nMort);
  const ri = i.investmentReturnPct / 100 / 12;
  const upfrontCosts = (i.price * i.purchaseCostsPct) / 100;
  // שכירות: משקיע את ההון העצמי ועלויות הרכישה, ואת ההפרש החודשי כשהשכירות זולה מהקנייה
  let rentPortfolio = i.equity + upfrontCosts;
  let balance = loan;
  let rent = i.monthlyRent;
  let buyPortfolio = 0; // כשהקנייה זולה מהשכירות ההפרש מושקע
  const months = i.horizonYears * 12;
  for (let m = 1; m <= months; m++) {
    const interest = balance * rm;
    const mortgagePayment = m <= nMort && balance > 0 ? Math.min(pmt, balance + interest) : 0;
    balance = Math.max(0, balance + interest - mortgagePayment);
    const valueNow = i.price * (1 + i.appreciationPct / 100) ** (m / 12);
    const buyCost = mortgagePayment + (valueNow * i.maintenancePct) / 100 / 12;
    const diff = buyCost - rent; // חיובי: הקנייה יקרה יותר החודש, השוכר משקיע את ההפרש
    rentPortfolio = rentPortfolio * (1 + ri) + Math.max(0, diff);
    buyPortfolio = buyPortfolio * (1 + ri) + Math.max(0, -diff);
    if (m % 12 === 0) rent *= 1 + i.rentGrowthPct / 100;
  }
  const value = i.price * (1 + i.appreciationPct / 100) ** i.horizonYears;
  const buyNetWorth = value * (1 - i.sellingCostsPct / 100) - balance + buyPortfolio;
  return {
    buyNetWorth: round2(buyNetWorth),
    rentNetWorth: round2(rentPortfolio),
    buyAdvantage: round2(buyNetWorth - rentPortfolio),
    monthlyMortgage: round2(pmt),
    propertyValueAtHorizon: round2(value),
    mortgageBalanceAtHorizon: round2(balance),
  };
}

// ───────────────────────── 9. מחזור משכנתא ─────────────────────────

export interface RefinanceInput {
  balance: number;
  currentRatePct: number;
  remainingMonths: number;
  newRatePct: number;
  newMonths: number;
  /** עמלת פירעון מוקדם ועלויות המחזור (שמאות, עו"ד, פתיחת תיק) */
  totalFees: number;
}
export interface RefinanceResult {
  currentMonthly: number;
  newMonthly: number;
  monthlySaving: number;
  currentRemainingTotal: number;
  newTotalWithFees: number;
  totalSaving: number;
  breakEvenMonths: number | null;
}
export function refinance(i: RefinanceInput): RefinanceResult | null {
  if (!ok(i.balance, i.currentRatePct, i.remainingMonths, i.newRatePct, i.newMonths, i.totalFees)) return null;
  if (i.balance <= 0 || i.totalFees < 0 || !Number.isInteger(i.remainingMonths) || !Number.isInteger(i.newMonths) || i.remainingMonths < 1 || i.newMonths < 1 || i.remainingMonths > 480 || i.newMonths > 480 || i.currentRatePct < 0 || i.newRatePct < 0 || i.currentRatePct > 50 || i.newRatePct > 50) return null;
  const pmt = (rate: number, n: number) => {
    const r = rate / 100 / 12;
    return r === 0 ? i.balance / n : (i.balance * r) / (1 - (1 + r) ** -n);
  };
  const cur = pmt(i.currentRatePct, i.remainingMonths);
  const nw = pmt(i.newRatePct, i.newMonths);
  const curTotal = cur * i.remainingMonths;
  const newTotal = nw * i.newMonths + i.totalFees;
  const saving = cur - nw;
  return {
    currentMonthly: round2(cur),
    newMonthly: round2(nw),
    monthlySaving: round2(saving),
    currentRemainingTotal: round2(curTotal),
    newTotalWithFees: round2(newTotal),
    totalSaving: round2(curTotal - newTotal),
    breakEvenMonths: saving > 0 ? Math.ceil(i.totalFees / saving) : null,
  };
}
