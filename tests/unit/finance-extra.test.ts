import { describe, it, expect } from 'vitest';
import * as F from '@/lib/calculators/finance-extra';

describe('loanSchedule', () => {
  it('spitzer: constant payment, interest total, ends at zero', () => {
    const r = F.loanSchedule({ principal: 100000, annualRatePct: 6, months: 60, method: 'spitzer' })!;
    expect(r.firstPayment).toBe(1933.28);
    expect(r.lastPayment).toBeCloseTo(1933.28, 1);
    expect(r.totalInterest).toBeCloseTo(15996.6, 0);
    expect(r.schedule[59].balance).toBeCloseTo(0, 1);
  });
  it('equal principal: first payment highest, falling; total interest lower than spitzer', () => {
    const e = F.loanSchedule({ principal: 120000, annualRatePct: 6, months: 12, method: 'equal-principal' })!;
    expect(e.firstPayment).toBe(10600); // 10,000 + 120,000×0.5%
    expect(e.lastPayment).toBe(10050);
    const s = F.loanSchedule({ principal: 120000, annualRatePct: 6, months: 12, method: 'spitzer' })!;
    expect(e.totalInterest).toBeLessThan(s.totalInterest);
    expect(e.totalInterest).toBe(3900);
  });
  it('balloon 100%: interest only then principal at the end', () => {
    const r = F.loanSchedule({ principal: 100000, annualRatePct: 6, months: 12, method: 'balloon', balloonPct: 100 })!;
    expect(r.firstPayment).toBe(500);
    expect(r.lastPayment).toBe(100500);
    expect(r.totalInterest).toBe(6000);
  });
  it('balloon 50%: half amortized, half at the end', () => {
    const r = F.loanSchedule({ principal: 100000, annualRatePct: 0, months: 10, method: 'balloon', balloonPct: 50 })!;
    expect(r.firstPayment).toBe(5000);
    expect(r.lastPayment).toBe(55000);
    expect(r.totalInterest).toBe(0);
  });
  it('zero rate and invalid input', () => {
    expect(F.loanSchedule({ principal: 1200, annualRatePct: 0, months: 12, method: 'spitzer' })!.firstPayment).toBe(100);
    expect(F.loanSchedule({ principal: 0, annualRatePct: 5, months: 12, method: 'spitzer' })).toBeNull();
    expect(F.loanSchedule({ principal: 1000, annualRatePct: 5, months: 0, method: 'spitzer' })).toBeNull();
  });
});

describe('debt payoff', () => {
  it('months and interest; null when payment too low', () => {
    const r = F.debtPayoff(12000, 12, 1000)!;
    expect(r.months).toBe(13);
    expect(r.totalPaid).toBeCloseTo(12000 + r.totalInterest, 2);
    expect(F.debtPayoff(12000, 12, 120)).toBeNull();
    expect(F.debtPayoff(6000, 0, 1000)!.months).toBe(6);
  });
  it('payment to clear in N months', () => {
    expect(F.paymentToClearIn(12000, 0, 12)).toBe(1000);
    expect(F.paymentToClearIn(10000, 12, 12)).toBe(888.49);
  });
});

describe('savings', () => {
  it('future value with zero rate', () => {
    const r = F.savingsFutureValue({ initial: 1000, monthly: 100, annualRatePct: 0, years: 2 })!;
    expect(r.futureValue).toBe(3400);
    expect(r.gains).toBe(0);
  });
  it('with return and inflation', () => {
    const r = F.savingsFutureValue({ initial: 0, monthly: 1000, annualRatePct: 6, years: 10, inflationPct: 2 })!;
    expect(r.futureValue).toBeCloseTo(163879.35, 1);
    expect(r.totalDeposited).toBe(120000);
    expect(r.realValue).toBeLessThan(r.futureValue);
  });
  it('monthly deposit to reach a goal is the inverse of future value', () => {
    const m = F.monthlyToReachGoal({ goal: 163879.35, initial: 0, annualRatePct: 6, years: 10 })!;
    expect(m).toBeCloseTo(1000, 1);
    expect(F.monthlyToReachGoal({ goal: 1000, initial: 5000, annualRatePct: 0, years: 1 })).toBe(0);
    expect(F.monthlyToReachGoal({ goal: 12000, initial: 0, annualRatePct: 0, years: 1 })).toBe(1000);
  });
});

describe('rental yield', () => {
  it('gross and net', () => {
    const r = F.rentalYield({ purchasePrice: 2000000, purchaseCosts: 100000, monthlyRent: 6000, vacancyMonths: 1, annualExpenses: 6000 })!;
    expect(r.grossYieldPct).toBe(3.6);
    expect(r.annualRentCollected).toBe(66000);
    expect(r.netAnnualIncome).toBe(60000);
    expect(r.netYieldPct).toBe(2.86);
    expect(r.paybackYears).toBe(35);
    expect(F.rentalYield({ purchasePrice: 0, purchaseCosts: 0, monthlyRent: 1, vacancyMonths: 0, annualExpenses: 0 })).toBeNull();
  });
});

describe('osek compare', () => {
  it('business customers: licensed keeps input VAT and wins when expenses are high', () => {
    const r = F.compareOsek({ annualRevenueExVat: 100000, annualExpensesExVat: 60000, customersRecoverVat: true })!;
    expect(r.exempt.expensesBorne).toBe(70800);
    expect(r.licensed.expensesBorne).toBe(60000);
    expect(r.licensedAdvantage).toBeGreaterThan(0);
    expect(r.exemptAllowed).toBe(true);
    expect(r.licensed.vatPaidToState).toBe(7200);
  });
  it('consumer customers at fixed prices: licensed gives up 18/118 of the price', () => {
    const r = F.compareOsek({ annualRevenueExVat: 100000, annualExpensesExVat: 10000, customersRecoverVat: false })!;
    expect(r.licensed.revenueKept).toBe(84745.76);
    expect(r.licensedAdvantage).toBeLessThan(0);
  });
  it('threshold flag', () => {
    expect(F.compareOsek({ annualRevenueExVat: 200000, annualExpensesExVat: 0, customersRecoverVat: true })!.exemptAllowed).toBe(false);
    expect(F.compareOsek({ annualRevenueExVat: -1, annualExpensesExVat: 0, customersRecoverVat: true })).toBeNull();
  });
});

describe('rental income tax', () => {
  it('rent under the monthly ceiling is exempt', () => {
    const r = F.rentalIncomeTax({ monthlyRent: 5000, otherAnnualIncome: 150000, annualExpenses: 0 })!;
    expect(r.exemptTrack.taxableAnnual).toBe(0);
    expect(r.exemptTrack.tax).toBe(0);
    expect(r.best).toBe('exempt');
    expect(r.flatTrack.tax).toBe(6000);
  });
  it('partial exemption between the ceiling and double the ceiling', () => {
    // 7,000: מס על 2×7,000 − 2×5,654 = 2,692 לחודש (דוגמת הפרסומים: חלק חייב 2,692)
    const r = F.rentalIncomeTax({ monthlyRent: 7000, otherAnnualIncome: 0, annualExpenses: 0 })!;
    expect(r.exemptTrack.taxableAnnual).toBe(2692 * 12);
  });
  it('no exemption at or above double the ceiling', () => {
    const r = F.rentalIncomeTax({ monthlyRent: 12000, otherAnnualIncome: 300000, annualExpenses: 0 })!;
    expect(r.exemptTrack.taxableAnnual).toBe(144000);
    expect(r.best).toBe('flat'); // 10% מול מס שולי גבוה
  });
  it('regular track benefits from expenses', () => {
    const a = F.rentalIncomeTax({ monthlyRent: 12000, otherAnnualIncome: 0, annualExpenses: 0 })!;
    const b = F.rentalIncomeTax({ monthlyRent: 12000, otherAnnualIncome: 0, annualExpenses: 100000 })!;
    expect(b.regularTrack.tax).toBeLessThan(a.regularTrack.tax);
  });
});

describe('study fund', () => {
  it('self-employed deduction is 4.5% up to the income ceiling', () => {
    const r = F.studyFund({ annualIncome: 400000, annualDeposit: 20000, annualReturnPct: 5, years: 6, selfEmployed: true })!;
    expect(r.deductibleDeposit).toBe(13202.87); // 4.5% × 293,397
    expect(r.taxSaving).toBeGreaterThan(0);
    expect(r.depositWithinCeiling).toBe(true);
    expect(r.accumulated).toBeGreaterThan(r.totalDeposited);
  });
  it('employee has no personal deduction; ceiling flag', () => {
    const r = F.studyFund({ annualIncome: 200000, annualDeposit: 25000, annualReturnPct: 4, years: 5, selfEmployed: false })!;
    expect(r.deductibleDeposit).toBe(0);
    expect(r.depositWithinCeiling).toBe(false);
  });
});

describe('rent vs buy', () => {
  const base = { price: 2000000, equity: 800000, mortgageRatePct: 4.5, mortgageYears: 25, purchaseCostsPct: 2, maintenancePct: 0.5, monthlyRent: 6000, rentGrowthPct: 2, appreciationPct: 3, investmentReturnPct: 4, sellingCostsPct: 2, horizonYears: 10 };
  it('computes a sensible comparison', () => {
    const r = F.rentVsBuy(base)!;
    expect(r.monthlyMortgage).toBeGreaterThan(6000);
    expect(r.propertyValueAtHorizon).toBeCloseTo(2000000 * 1.03 ** 10, 0);
    expect(r.mortgageBalanceAtHorizon).toBeLessThan(1200000);
    expect(r.buyAdvantage).toBeCloseTo(r.buyNetWorth - r.rentNetWorth, 2);
  });
  it('higher appreciation favors buying; high investment return favors renting', () => {
    const a = F.rentVsBuy({ ...base, appreciationPct: 6 })!;
    const b = F.rentVsBuy({ ...base, appreciationPct: 0 })!;
    expect(a.buyAdvantage).toBeGreaterThan(b.buyAdvantage);
    const c = F.rentVsBuy({ ...base, investmentReturnPct: 9 })!;
    expect(c.buyAdvantage).toBeLessThan(F.rentVsBuy(base)!.buyAdvantage);
  });
  it('invalid', () => {
    expect(F.rentVsBuy({ ...base, equity: 3000000 })).toBeNull();
    expect(F.rentVsBuy({ ...base, horizonYears: 0 })).toBeNull();
  });
});

describe('refinance', () => {
  it('savings and break-even', () => {
    const r = F.refinance({ balance: 800000, currentRatePct: 5.5, remainingMonths: 240, newRatePct: 4.2, newMonths: 240, totalFees: 12000 })!;
    expect(r.monthlySaving).toBeGreaterThan(0);
    expect(r.breakEvenMonths).toBe(Math.ceil(12000 / r.monthlySaving));
    expect(r.totalSaving).toBeGreaterThan(0);
  });
  it('no saving when rate is higher', () => {
    const r = F.refinance({ balance: 500000, currentRatePct: 3, remainingMonths: 200, newRatePct: 4, newMonths: 200, totalFees: 5000 })!;
    expect(r.breakEvenMonths).toBeNull();
    expect(r.totalSaving).toBeLessThan(0);
  });
  it('invalid', () => {
    expect(F.refinance({ balance: 0, currentRatePct: 3, remainingMonths: 12, newRatePct: 3, newMonths: 12, totalFees: 0 })).toBeNull();
  });
});
