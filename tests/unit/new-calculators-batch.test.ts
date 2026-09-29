import { describe, it, expect } from 'vitest';
import { calculateWorkValue } from '@/lib/calculators/work-value';

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
