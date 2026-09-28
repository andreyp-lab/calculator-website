import { describe, it, expect } from 'vitest';
import { calculateFire } from '@/lib/calculators/fire-calculator';
import { calculateWorkValue } from '@/lib/calculators/work-value';

// =====================================================
// FIRE
// =====================================================
describe('calculateFire', () => {
  it('הוצאות 10K/חודש - FI Number = 3M', () => {
    const r = calculateFire({
      currentAge: 30,
      currentSavings: 200_000,
      monthlyContribution: 5_000,
      monthlyExpensesInRetirement: 10_000,
      expectedRealReturn: 5,
      withdrawalRate: 4,
    });
    expect(r.fireNumber).toBe(3_000_000); // 120K × 25
  });

  it('כבר הגיע ל-FIRE', () => {
    const r = calculateFire({
      currentAge: 50,
      currentSavings: 5_000_000,
      monthlyContribution: 0,
      monthlyExpensesInRetirement: 10_000,
      expectedRealReturn: 5,
      withdrawalRate: 4,
    });
    expect(r.yearsToFire).toBe(0);
  });

  it('Lean FIRE - הוצאות נמוכות', () => {
    const r = calculateFire({
      currentAge: 25,
      currentSavings: 50_000,
      monthlyContribution: 3_000,
      monthlyExpensesInRetirement: 8_000,
      expectedRealReturn: 5,
      withdrawalRate: 4,
    });
    expect(r.fireType).toBe('lean');
  });
});

// =====================================================
// Work Value
// =====================================================
describe('calculateWorkValue', () => {
  it('עבודה משתלמת', () => {
    const r = calculateWorkValue({
      monthlyNetSalary: 11_000,
      monthlyWorkHours: 180,
      monthlyCommutingHours: 20,
      alternativeBenefit: 5_000,
      commutingCost: 500,
      childcareCost: 0,
      workClothing: 0,
      workMeals: 500,
      otherWorkExpenses: 0,
      employerPensionContribution: 1_000,
      employerStudyFundContribution: 0,
      otherBenefits: 0,
    });
    expect(r.isWorthWorking).toBe(true);
    expect(r.differenceVsAlternative).toBeGreaterThan(0);
  });

  it('עבודה לא משתלמת - הוצאות גבוהות מהשכר', () => {
    const r = calculateWorkValue({
      monthlyNetSalary: 6_000,
      monthlyWorkHours: 180,
      monthlyCommutingHours: 40,
      alternativeBenefit: 7_000,
      commutingCost: 1_000,
      childcareCost: 4_000,
      workClothing: 200,
      workMeals: 500,
      otherWorkExpenses: 0,
      employerPensionContribution: 500,
      employerStudyFundContribution: 0,
      otherBenefits: 0,
    });
    expect(r.isWorthWorking).toBe(false);
  });
});
