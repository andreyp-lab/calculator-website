/** Fixed-rate amortization scenarios for one mortgage track. */
export type AmortizationMethod = 'shpitzer' | 'equal-principal';
export type BuyerType = 'first-home' | 'home-replacement' | 'investor';

export interface MortgageInput {
  loanAmount: number;
  interestRate: number;
  termYears: number;
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
  monthlyPayment: number;
  firstPayment: number;
  lastPayment: number;
  totalPayments: number;
  totalInterest: number;
  schedule: PaymentScheduleEntry[];
  yearlyTotals: { year: number; principal: number; interest: number; balance: number }[];
}

/** Residential purchase LTV ceilings in Bank of Israel Directive 329. Eligibility is assessed by the lender. */
export const LTV_LIMITS_2026: Record<BuyerType, { maxPercentage: number; description: string }> = {
  'first-home': { maxPercentage: 75, description: 'דירה יחידה — עד 75% מימון' },
  'home-replacement': { maxPercentage: 70, description: 'דירה חליפית — עד 70% מימון' },
  investor: { maxPercentage: 50, description: 'דירה להשקעה — עד 50% מימון' },
};

function aggregateByYear(schedule: PaymentScheduleEntry[]): MortgageResult['yearlyTotals'] {
  const years: MortgageResult['yearlyTotals'] = [];
  for (let start = 0; start < schedule.length; start += 12) {
    const months = schedule.slice(start, start + 12);
    years.push({
      year: years.length + 1,
      principal: months.reduce((sum, entry) => sum + entry.principal, 0),
      interest: months.reduce((sum, entry) => sum + entry.interest, 0),
      balance: months[months.length - 1].remainingBalance,
    });
  }
  return years;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const empty: MortgageResult = {
    loanAmount: 0, monthlyPayment: 0, firstPayment: 0, lastPayment: 0,
    totalPayments: 0, totalInterest: 0, schedule: [], yearlyTotals: [],
  };
  const { loanAmount, interestRate, termYears, method } = input;
  if (!Number.isFinite(loanAmount) || loanAmount <= 0 ||
      !Number.isFinite(interestRate) || interestRate < 0 ||
      !Number.isInteger(termYears) || termYears < 1 || termYears > 30 ||
      (method !== 'shpitzer' && method !== 'equal-principal')) return empty;

  const months = termYears * 12;
  const rate = interestRate / 100 / 12;
  const fixedPayment = rate === 0
    ? loanAmount / months
    : loanAmount * rate / (1 - Math.pow(1 + rate, -months));
  const principalPerMonth = loanAmount / months;
  const schedule: PaymentScheduleEntry[] = [];
  let balance = loanAmount;

  for (let month = 1; month <= months; month++) {
    const interest = balance * rate;
    const principal = month === months
      ? balance
      : method === 'equal-principal'
        ? principalPerMonth
        : fixedPayment - interest;
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);
    schedule.push({ month, payment, principal, interest, remainingBalance: balance });
  }

  const totalPayments = schedule.reduce((sum, entry) => sum + entry.payment, 0);
  return {
    loanAmount,
    monthlyPayment: schedule[0].payment,
    firstPayment: schedule[0].payment,
    lastPayment: schedule[schedule.length - 1].payment,
    totalPayments,
    totalInterest: totalPayments - loanAmount,
    schedule,
    yearlyTotals: aggregateByYear(schedule),
  };
}

export function getMaxLoanAmount(propertyValue: number, buyerType: BuyerType): number {
  if (!Number.isFinite(propertyValue) || propertyValue <= 0) return 0;
  return propertyValue * LTV_LIMITS_2026[buyerType].maxPercentage / 100;
}

export function getRequiredEquity(propertyValue: number, buyerType: BuyerType): number {
  if (!Number.isFinite(propertyValue) || propertyValue <= 0) return 0;
  return propertyValue - getMaxLoanAmount(propertyValue, buyerType);
}
