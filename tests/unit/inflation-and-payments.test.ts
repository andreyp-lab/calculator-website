import { describe, it, expect } from 'vitest';
import { getExpenseForMonth, calculateExpenseTotal } from '@/lib/tools/budget-engine';
import { calculatePaymentSchedule } from '@/lib/tools/payment-terms';
import type { ExpenseItem, IncomeItem } from '@/lib/tools/types';

describe('Inflation in budget engine', () => {
  const baseExpense: ExpenseItem = {
    id: 'e1',
    category: 'operating',
    name: 'Rent',
    amount: 10000,
    isPct: false,
    percentage: 0,
    startMonth: 0,
    duration: 36,
    paymentTerms: 0,
    applyInflation: true,
  };

  it('applies inflation in year 2', () => {
    // 5% inflation, year 1 = 10000, year 2 = 10500
    const month12 = getExpenseForMonth(baseExpense, 12, [], 5);
    expect(month12).toBeCloseTo(10500, 0);
  });

  it('applies cumulatively in year 3', () => {
    // year 3 = 10000 × 1.05^2 = 11025
    const month24 = getExpenseForMonth(baseExpense, 24, [], 5);
    expect(month24).toBeCloseTo(11025, 0);
  });

  it('does not inflate when applyInflation=false', () => {
    const noInflation = { ...baseExpense, applyInflation: false };
    const month12 = getExpenseForMonth(noInflation, 12, [], 10);
    expect(month12).toBe(10000);
  });

  it('does not inflate within first year', () => {
    const month11 = getExpenseForMonth(baseExpense, 11, [], 5);
    expect(month11).toBe(10000);
  });
});

describe('Payment Splits in calculatePaymentSchedule', () => {
  it('splits 30/70 correctly', () => {
    const sched = calculatePaymentSchedule(
      100000,
      {
        simpleNet: 0,
        installments: [
          { percentage: 30, daysOffset: 0 },
          { percentage: 70, daysOffset: 60 },
        ],
      },
      0,
    );
    expect(sched).toHaveLength(2);
    expect(sched[0].amount).toBe(30000);
    expect(sched[0].monthOffset).toBe(0);
    expect(sched[1].amount).toBe(70000);
    expect(sched[1].monthOffset).toBe(2);
  });

  it('handles 4-stage payment', () => {
    const sched = calculatePaymentSchedule(
      400000,
      {
        simpleNet: 0,
        installments: [
          { percentage: 25, daysOffset: 0 },
          { percentage: 25, daysOffset: 30 },
          { percentage: 25, daysOffset: 60 },
          { percentage: 25, daysOffset: 90 },
        ],
      },
      5, // start at month 5
    );
    expect(sched).toHaveLength(4);
    expect(sched[0].monthOffset).toBe(5);
    expect(sched[3].monthOffset).toBe(8);
    expect(sched.reduce((s, p) => s + p.amount, 0)).toBe(400000);
  });
});
