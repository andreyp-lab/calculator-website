/**
 * חישוב משכנתא 2026
 *
 * מקור:
 * - בנק ישראל: ריביות, הוראות LTV
 * - חוקי הפיקוח על הבנקים בישראל
 *
 * נתונים מרכזיים 2026:
 * - LTV דירה ראשונה: עד 75%
 * - LTV מחליפי דירה: עד 70%
 * - LTV משקיעים: עד 50%
 * - תקופה מקסימלית: 30 שנים
 * - לפחות 33% במסלול ריבית קבועה
 * - ריבית פריים נכון לאפריל 2026: 5.5%
 *
 * שיטות חישוב:
 * 1. שפיצר (תשלום חודשי קבוע) - הנפוצה ביותר
 * 2. קרן שווה (תשלום יורד) - חוסכת ריבית
 */

export type AmortizationMethod = 'shpitzer' | 'equal-principal';
export type BuyerType = 'first-home' | 'home-replacement' | 'investor';

export interface MortgageInput {
  loanAmount: number; // קרן ההלוואה
  interestRate: number; // ריבית שנתית (אחוזים, למשל 4.5)
  termYears: number; // תקופה בשנים
  method: AmortizationMethod;
}

export interface PaymentScheduleEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number; // לתשלום חודשי קבוע (שפיצר) או ראשון (קרן שווה)
  firstPayment: number;
  lastPayment: number;
  totalPayments: number;
  totalInterest: number;
  schedule: PaymentScheduleEntry[];
  yearlyTotals: { year: number; principal: number; interest: number; balance: number }[];
}

export interface LtvLimits {
  maxPercentage: number;
  description: string;
}

export const LTV_LIMITS_2026: Record<BuyerType, LtvLimits> = {
  'first-home': {
    maxPercentage: 75,
    description: 'דירה ראשונה ויחידה - עד 75% מימון',
  },
  'home-replacement': {
    maxPercentage: 70,
    description: 'מחליפי דירה - עד 70% מימון',
  },
  investor: {
    maxPercentage: 50,
    description: 'דירה להשקעה - עד 50% מימון',
  },
};

/**
 * חישוב לוח סילוקין שפיצר (תשלום חודשי קבוע)
 *
 * נוסחת שפיצר:
 * M = P × [r(1+r)^n] / [(1+r)^n - 1]
 *
 * P = קרן (loan amount)
 * r = ריבית חודשית (שנתית/12/100)
 * n = מספר תשלומים (שנים × 12)
 */
function calculateShpitzer(input: MortgageInput): MortgageResult {
  const P = input.loanAmount;
  const r = input.interestRate / 100 / 12;
  const n = input.termYears * 12;

  // חישוב תשלום חודשי קבוע
  const monthlyPayment =
    r === 0 ? P / n : (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

  // בניית לוח סילוקין
  const schedule: PaymentScheduleEntry[] = [];
  let balance = P;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const principal = monthlyPayment - interest;
    balance = Math.max(0, balance - principal);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      remainingBalance: balance,
    });
  }

  const totalPayments = monthlyPayment * n;
  const totalInterest = totalPayments - P;

  return {
    loanAmount: P,
    monthlyPayment,
    firstPayment: monthlyPayment,
    lastPayment: monthlyPayment,
    totalPayments,
    totalInterest,
    schedule,
    yearlyTotals: aggregateByYear(schedule),
  };
}

/**
 * חישוב לוח סילוקין קרן שווה (תשלום קרן קבוע, ריבית יורדת)
 */
function calculateEqualPrincipal(input: MortgageInput): MortgageResult {
  const P = input.loanAmount;
  const r = input.interestRate / 100 / 12;
  const n = input.termYears * 12;

  const principalPerMonth = P / n;
  const schedule: PaymentScheduleEntry[] = [];
  let balance = P;
  let totalPayments = 0;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const payment = principalPerMonth + interest;
    balance = Math.max(0, balance - principalPerMonth);
    totalPayments += payment;

    schedule.push({
      month,
      payment,
      principal: principalPerMonth,
      interest,
      remainingBalance: balance,
    });
  }

  const totalInterest = totalPayments - P;

  return {
    loanAmount: P,
    monthlyPayment: schedule[0].payment, // הראשון
    firstPayment: schedule[0].payment,
    lastPayment: schedule[schedule.length - 1].payment,
    totalPayments,
    totalInterest,
    schedule,
    yearlyTotals: aggregateByYear(schedule),
  };
}

/**
 * סיכום שנתי של תשלומים
 */
function aggregateByYear(schedule: PaymentScheduleEntry[]) {
  const yearlyTotals: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[] = [];

  for (let year = 1; year <= Math.ceil(schedule.length / 12); year++) {
    const startIdx = (year - 1) * 12;
    const endIdx = Math.min(year * 12, schedule.length);
    const yearMonths = schedule.slice(startIdx, endIdx);

    const yearPrincipal = yearMonths.reduce((sum, m) => sum + m.principal, 0);
    const yearInterest = yearMonths.reduce((sum, m) => sum + m.interest, 0);
    const balance = yearMonths[yearMonths.length - 1]?.remainingBalance ?? 0;

    yearlyTotals.push({
      year,
      principal: yearPrincipal,
      interest: yearInterest,
      balance,
    });
  }

  return yearlyTotals;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  if (input.loanAmount <= 0 || input.termYears <= 0 || input.interestRate < 0) {
    return {
      loanAmount: 0,
      monthlyPayment: 0,
      firstPayment: 0,
      lastPayment: 0,
      totalPayments: 0,
      totalInterest: 0,
      schedule: [],
      yearlyTotals: [],
    };
  }

  return input.method === 'equal-principal'
    ? calculateEqualPrincipal(input)
    : calculateShpitzer(input);
}

/**
 * חישוב הלוואה מקסימלית לפי מחיר דירה ו-LTV
 */
export function getMaxLoanAmount(propertyValue: number, buyerType: BuyerType): number {
  const limit = LTV_LIMITS_2026[buyerType];
  return propertyValue * (limit.maxPercentage / 100);
}

/**
 * חישוב הון עצמי נדרש
 */
export function getRequiredEquity(propertyValue: number, buyerType: BuyerType): number {
  return propertyValue - getMaxLoanAmount(propertyValue, buyerType);
}
