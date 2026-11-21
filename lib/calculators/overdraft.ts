/**
 * מנוע מינוס בחשבון (חריגה ממסגרת אשראי) — פונקציות טהורות, ללא קבועים משפטיים.
 *
 * אין כאן שיעור ריבית "רשמי": ריבית החריגה נקבעת בהסכם של כל בנק, והמשתמש מזין אותה.
 * הריבית מחושבת יומית על היתרה השלילית, ולכן העלות החודשית היא:
 *   יתרה ממוצעת × ריבית שנתית × ימי חריגה ÷ 365.
 */

import { calculateLoanRepayment } from '@/lib/calculators/savings';

const round2 = (n: number) => Math.round(n * 100) / 100;

export interface OverdraftCostInput {
  /** יתרה שלילית ממוצעת בימי החריגה (₪, מספר חיובי) */
  averageOverdraft: number;
  /** ריבית שנתית נומינלית, באחוזים */
  annualRatePct: number;
  /** כמה ימים בחודש החשבון במינוס (1–31) */
  daysPerMonth: number;
}

export interface OverdraftCostResult {
  monthlyInterest: number;
  annualInterest: number;
  /** אחוז מהיתרה שמשלמים בחודש */
  monthlyPctOfBalance: number;
}

/** מחזיר null כשהקלט לא תקין. השנה מחושבת כ-12 חודשים בעלי אותו דפוס. */
export function overdraftCost(input: OverdraftCostInput): OverdraftCostResult | null {
  const { averageOverdraft, annualRatePct, daysPerMonth } = input;
  if (!Number.isFinite(averageOverdraft) || averageOverdraft <= 0) return null;
  if (!Number.isFinite(annualRatePct) || annualRatePct < 0 || annualRatePct > 100) return null;
  if (!Number.isFinite(daysPerMonth) || daysPerMonth <= 0 || daysPerMonth > 31) return null;
  const monthlyInterest = averageOverdraft * (annualRatePct / 100) * (daysPerMonth / 365);
  return {
    monthlyInterest: round2(monthlyInterest),
    annualInterest: round2(monthlyInterest * 12),
    monthlyPctOfBalance: round2((monthlyInterest / averageOverdraft) * 100),
  };
}

export interface OverdraftPayoffInput {
  balance: number;
  annualRatePct: number;
  /** כמה כסף מפקידים בחודש מעבר להוצאות השוטפות כדי להקטין את המינוס */
  monthlyPaydown: number;
}

export interface OverdraftPayoffResult {
  months: number;
  totalInterest: number;
  /** סך ששולם: קרן + ריבית */
  totalPaid: number;
}

/**
 * כמה חודשים ייקח לסגור מינוס כשמקטינים אותו בסכום קבוע בחודש, והריבית נצברת חודשית.
 * מחזיר null אם ההפקדה החודשית לא עולה על הריבית החודשית (המינוס לא יקטן לעולם).
 */
export function overdraftPayoff(input: OverdraftPayoffInput): OverdraftPayoffResult | null {
  const { balance, annualRatePct, monthlyPaydown } = input;
  if (![balance, annualRatePct, monthlyPaydown].every(Number.isFinite)) return null;
  if (balance <= 0 || annualRatePct < 0 || annualRatePct > 100 || monthlyPaydown <= 0) return null;
  const r = annualRatePct / 100 / 12;
  if (monthlyPaydown <= balance * r) return null;
  let owed = balance;
  let interest = 0;
  let months = 0;
  while (owed > 0.005 && months < 1200) {
    const i = owed * r;
    interest += i;
    owed = owed + i - monthlyPaydown;
    months++;
  }
  return {
    months,
    totalInterest: round2(interest),
    totalPaid: round2(balance + interest),
  };
}

export interface OverdraftVsLoanInput {
  averageOverdraft: number;
  overdraftRatePct: number;
  daysPerMonth: number;
  loanRatePct: number;
  loanMonths: number;
}

export interface OverdraftVsLoanResult {
  /** תשלום חודשי בהלוואה שמכסה את המינוס */
  loanMonthlyPayment: number;
  /** ריבית כוללת בהלוואה לאורך כל התקופה */
  loanTotalInterest: number;
  /** ריבית כוללת במינוס אם נשארים באותו מינוס אותה תקופה */
  overdraftTotalInterest: number;
  /** חיסכון בריבית של הלוואה לעומת מינוס (שלילי = ההלוואה יקרה יותר) */
  interestSavedByLoan: number;
  /** בסוף התקופה במינוס עדיין חייבים את הקרן; בהלוואה החוב נסגר */
  overdraftRemainingDebt: number;
}

/**
 * משווה להשאיר את המינוס מול לקיחת הלוואה שסוגרת אותו. ההשוואה הוגנת כשמסתכלים גם על
 * החוב שנשאר: במינוס עדיין חייבים את הקרן בסוף התקופה, בהלוואה הקרן מוחזרת.
 */
export function overdraftVsLoan(input: OverdraftVsLoanInput): OverdraftVsLoanResult | null {
  const { averageOverdraft, overdraftRatePct, daysPerMonth, loanRatePct, loanMonths } = input;
  const cost = overdraftCost({ averageOverdraft, annualRatePct: overdraftRatePct, daysPerMonth });
  if (!cost) return null;
  if (!Number.isFinite(loanRatePct) || loanRatePct < 0 || loanRatePct > 100) return null;
  if (!Number.isInteger(loanMonths) || loanMonths <= 0 || loanMonths > 600) return null;
  const loan = calculateLoanRepayment({
    loanAmount: averageOverdraft,
    annualRate: loanRatePct,
    termMonths: loanMonths,
    extraMonthlyPayment: 0,
    oneTimePayment: 0,
  });
  // מחשבים מהערך הלא מעוגל כדי שלא יצטבר שגיאת עיגול על פני התקופה
  const overdraftTotalInterest = round2(
    averageOverdraft * (overdraftRatePct / 100) * (daysPerMonth / 365) * loanMonths,
  );
  const loanTotalInterest = round2(loan.totalInterest);
  return {
    loanMonthlyPayment: round2(loan.monthlyPayment),
    loanTotalInterest,
    overdraftTotalInterest,
    interestSavedByLoan: round2(overdraftTotalInterest - loanTotalInterest),
    overdraftRemainingDebt: round2(averageOverdraft),
  };
}
