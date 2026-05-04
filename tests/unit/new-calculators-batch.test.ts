import { describe, it, expect } from 'vitest';
import { calculateCapitalGainsTax } from '@/lib/calculators/capital-gains-tax';
import { calculateMaternityBenefits } from '@/lib/calculators/maternity-benefits';
import { calculateUnemploymentBenefits } from '@/lib/calculators/unemployment-benefits';
import { calculateReserveDutyPay } from '@/lib/calculators/reserve-duty-pay';
import { calculateFire } from '@/lib/calculators/fire-calculator';
import { calculateWorkValue } from '@/lib/calculators/work-value';

// =====================================================
// Capital Gains Tax (מס שבח)
// =====================================================
describe('calculateCapitalGainsTax', () => {
  it('דירה יחידה תחת התקרה - פטור מלא', () => {
    const r = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 1_500_000,
      recognizedExpenses: 100_000,
      purchaseYear: 2018,
      saleYear: 2026,
      scenario: 'first-home',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 15,
    });
    expect(r.fullExemption).toBe(true);
    expect(r.taxAmount).toBe(0);
  });

  it('דירת השקעה - 25% מהשבח הריאלי', () => {
    const r = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 1_500_000,
      recognizedExpenses: 100_000,
      purchaseYear: 2018,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 15,
    });
    // gross = 3M - 1.5M - 100K = 1.4M
    // inflation = 1.5M × 15% = 225K
    // real = 1.175M, tax = 25% = 293,750
    expect(r.grossGain).toBe(1_400_000);
    expect(r.realGain).toBe(1_175_000);
    expect(r.taxAmount).toBeCloseTo(293_750, 0);
  });

  it('חישוב לינארי מוטב - דירה לפני 2014', () => {
    const r = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 1_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2004,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 30,
    });
    expect(r.appliedLinearMethod).toBe(true);
    // 22 שנים, 12 חייבות → 12/22 = 54.5%
    expect(r.taxablePct).toBeCloseTo(0.545, 2);
  });

  it('מס יסף לבעל הכנסות גבוהות - 30%', () => {
    const r = calculateCapitalGainsTax({
      salePrice: 5_000_000,
      purchasePrice: 2_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2018,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: true,
      inflationCumulativePct: 0,
    });
    expect(r.taxRate).toBe(0.30);
  });
});

// =====================================================
// Maternity Benefits (דמי לידה)
// =====================================================
describe('calculateMaternityBenefits', () => {
  it('שכר 12,000 ₪ - חישוב יומי', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 12_000,
      leaveDays: 105,
      multipleBabies: 1,
      hospitalizationDays: 0,
    });
    expect(r.dailyBenefit).toBeCloseTo(400, 0); // 12000/30
    expect(r.totalBenefit).toBeCloseTo(42_000, 0);
  });

  it('שכר מעל התקרה - מוגבל', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 80_000,
      leaveDays: 105,
      multipleBabies: 1,
      hospitalizationDays: 0,
    });
    expect(r.dailyBenefit).toBeCloseTo(1_730.33, 1);
    expect(r.cappedAtMaximum).toBe(true);
  });

  it('תאומים - +3 שבועות', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 10_000,
      leaveDays: 105,
      multipleBabies: 2,
      hospitalizationDays: 0,
    });
    expect(r.totalDays).toBe(126); // 105 + 21
  });
});

// =====================================================
// Unemployment Benefits (דמי אבטלה)
// =====================================================
describe('calculateUnemploymentBenefits', () => {
  it('עומד בזכאות - חישוב 80% (שכר נמוך)', () => {
    const r = calculateUnemploymentBenefits({
      averageMonthlySalary: 6_000,
      age: 30,
      hasChildren: false,
      workDaysIn18Months: 400,
    });
    expect(r.isEligible).toBe(true);
    expect(r.benefitRate).toBe(0.8);
  });

  it('שכר גבוה - 50% משכר', () => {
    const r = calculateUnemploymentBenefits({
      averageMonthlySalary: 25_000,
      age: 35,
      hasChildren: false,
      workDaysIn18Months: 500,
    });
    expect(r.benefitRate).toBe(0.5);
  });

  it('לא צבר ימים - לא זכאי', () => {
    const r = calculateUnemploymentBenefits({
      averageMonthlySalary: 10_000,
      age: 30,
      hasChildren: false,
      workDaysIn18Months: 100,
    });
    expect(r.isEligible).toBe(false);
  });

  it('בן 45+ - 175 ימי זכאות', () => {
    const r = calculateUnemploymentBenefits({
      averageMonthlySalary: 10_000,
      age: 50,
      hasChildren: false,
      workDaysIn18Months: 500,
    });
    expect(r.maxDays).toBe(175);
  });
});

// =====================================================
// Reserve Duty Pay
// =====================================================
describe('calculateReserveDutyPay', () => {
  it('שכיר 10,000 ₪ × 30 ימים', () => {
    const r = calculateReserveDutyPay({
      recentMonthlySalary: 10_000,
      reserveDays: 30,
      employmentStatus: 'employee',
      eligibleForSpecialGrants: false,
    });
    expect(r.dailyPayment).toBeCloseTo(333.33, 1);
    expect(r.totalBasicPayment).toBeCloseTo(10_000, 0);
  });

  it('עם מענק חרבות ברזל - 280 ₪/יום נוספים', () => {
    const r = calculateReserveDutyPay({
      recentMonthlySalary: 10_000,
      reserveDays: 30,
      employmentStatus: 'employee',
      eligibleForSpecialGrants: true,
    });
    expect(r.totalSpecialGrant).toBe(8_400); // 280 × 30
    expect(r.totalCompensation).toBeGreaterThan(r.totalBasicPayment);
  });

  it('שכר מעל תקרה - מוגבל', () => {
    const r = calculateReserveDutyPay({
      recentMonthlySalary: 100_000,
      reserveDays: 10,
      employmentStatus: 'employee',
      eligibleForSpecialGrants: false,
    });
    expect(r.cappedAtMaximum).toBe(true);
    expect(r.dailyPayment).toBeCloseTo(1_730.33, 1);
  });
});

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
      monthlyGrossSalary: 15_000,
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
      monthlyGrossSalary: 8_000,
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
