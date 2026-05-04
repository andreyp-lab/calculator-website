import { describe, it, expect } from 'vitest';
import { calculateSalaryNetGross } from '@/lib/calculators/salary-net-gross';
import { calculateCompanyCarBenefit } from '@/lib/calculators/company-car-benefit';
import { calculateMinimumWage } from '@/lib/calculators/minimum-wage';
import { calculateTaxAdvances } from '@/lib/calculators/tax-advances';
import {
  calculateAnnualLeave,
  calculateSickPay,
  calculateAnnualBonus,
  calculateNIT,
} from '@/lib/calculators/employee-benefits';
import { calculatePersonalLoan } from '@/lib/calculators/personal-loan';
import { calculateSelfEmployedPension } from '@/lib/calculators/self-employed-pension';

describe('Salary Net/Gross', () => {
  it('שכר 15K עם פנסיה - חישוב נטו תקין', () => {
    const r = calculateSalaryNetGross({
      grossSalary: 15_000,
      creditPoints: 2.25,
      pensionEnabled: true,
      studyFundEnabled: false,
      monthlyWorkHours: 182,
    });
    expect(r.grossSalary).toBe(15_000);
    expect(r.netSalary).toBeGreaterThan(10_000);
    expect(r.netSalary).toBeLessThan(13_000);
    expect(r.pensionDeduction).toBe(900); // 6%
  });

  it('עלות מעסיק כוללת', () => {
    const r = calculateSalaryNetGross({
      grossSalary: 10_000,
      creditPoints: 2.25,
      pensionEnabled: true,
      studyFundEnabled: false,
      monthlyWorkHours: 182,
    });
    // עלות = שכר + 4.51% ב.ל. + 6.5% פנסיה + 8.33% פיצויים
    expect(r.totalEmployerCost).toBeGreaterThan(11_500);
    expect(r.totalEmployerCost).toBeLessThan(13_000);
  });
});

describe('Company Car Benefit', () => {
  it('רכב 200K, קבוצה 4 - שווי שימוש', () => {
    const r = calculateCompanyCarBenefit({
      catalogPrice: 200_000,
      carGroup: 4,
      isElectric: false,
      marginalTaxRate: 35,
    });
    // 200K × 3.06% = 6,120
    expect(r.monthlyBenefit).toBeCloseTo(6_120, 0);
    expect(r.taxableBenefit).toBe(r.monthlyBenefit);
  });

  it('רכב חשמלי - מקבל זיכוי 1,150', () => {
    const r = calculateCompanyCarBenefit({
      catalogPrice: 200_000,
      carGroup: 4,
      isElectric: true,
      marginalTaxRate: 35,
    });
    expect(r.electricDiscount).toBe(1_150);
    expect(r.taxableBenefit).toBe(r.monthlyBenefit - 1_150);
  });
});

describe('Minimum Wage', () => {
  it('שכר חודשי בוגר - 6,443.85', () => {
    const r = calculateMinimumWage({
      workType: 'monthly',
      ageGroup: 'adult',
      partTimePercentage: 100,
    });
    expect(r.minimumWageFullTime).toBe(6_443.85);
    expect(r.adjustedMinimumWage).toBe(6_443.85);
  });

  it('שכר נער 16-17 - 70%', () => {
    const r = calculateMinimumWage({
      workType: 'monthly',
      ageGroup: 'youth-16-17',
      partTimePercentage: 100,
    });
    expect(r.adjustedMinimumWage).toBeCloseTo(6_443.85 * 0.7, 2);
  });

  it('בדיקה אם שכר מספק', () => {
    const r = calculateMinimumWage({
      workType: 'monthly',
      ageGroup: 'adult',
      partTimePercentage: 100,
      actualWage: 5_000,
    });
    expect(r.isAboveMinimum).toBe(false);
    expect(r.shortfall).toBeGreaterThan(0);
  });
});

describe('Tax Advances', () => {
  it('עצמאי 200K - מקדמה דו-חודשית', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });
    expect(r.totalAnnual).toBeGreaterThan(40_000);
    expect(r.paymentsPerYear).toBe(6);
  });

  it('עצמאי עם מע"מ', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 300_000,
      creditPoints: 2.25,
      isVatRegistered: true,
      frequency: 'monthly',
      annualVatCollected: 50_000,
      annualVatDeductible: 20_000,
    });
    expect(r.annualVatPayable).toBe(30_000);
  });
});

describe('Annual Leave', () => {
  it('5 ימי עבודה, וותק 5 - 14 ימים', () => {
    const r = calculateAnnualLeave({ yearsOfService: 5, workDaysPerWeek: 5 });
    expect(r.daysEntitled).toBe(14);
  });

  it('וותק 14+ - 24 ימים', () => {
    const r = calculateAnnualLeave({ yearsOfService: 20, workDaysPerWeek: 5 });
    expect(r.daysEntitled).toBe(24);
  });
});

describe('Sick Pay', () => {
  it('יום אחד מחלה - לא משלמים', () => {
    const r = calculateSickPay({ sickDays: 1, monthlySalary: 11_000, consecutive: true });
    expect(r.totalPayment).toBe(0);
  });

  it('5 ימי מחלה', () => {
    const r = calculateSickPay({ sickDays: 5, monthlySalary: 22_000, consecutive: true });
    // יום 1: 0, ימים 2-3: 50%, ימים 4-5: 100%
    // dailySalary = 1000
    // = 0 + 500 + 500 + 1000 + 1000 = 3000
    expect(r.totalPayment).toBe(3_000);
  });
});

describe('Annual Bonus', () => {
  it('בונוס 50K לשכיר 15K - מס שולי גבוה', () => {
    const r = calculateAnnualBonus({
      grossBonus: 50_000,
      regularMonthlySalary: 15_000,
      creditPoints: 2.25,
    });
    expect(r.netBonus).toBeGreaterThan(20_000);
    expect(r.netBonus).toBeLessThan(40_000);
    expect(r.marginalTaxRate).toBeGreaterThan(0.2);
  });
});

describe('NIT (Negative Income Tax)', () => {
  it('הכנסה נמוכה עם ילדים - זכאי', () => {
    const r = calculateNIT({
      annualEarnedIncome: 60_000,
      isParent: true,
      numberOfChildren: 2,
      isSingleParent: false,
      age: 35,
    });
    expect(r.isEligible).toBe(true);
    expect(r.annualGrant).toBeGreaterThan(0);
  });

  it('הכנסה גבוהה - לא זכאי', () => {
    const r = calculateNIT({
      annualEarnedIncome: 200_000,
      isParent: false,
      numberOfChildren: 0,
      isSingleParent: false,
      age: 35,
    });
    expect(r.isEligible).toBe(false);
  });
});

describe('Personal Loan', () => {
  it('הלוואה 50K, 5%, 36 חודשים', () => {
    const r = calculatePersonalLoan({
      loanAmount: 50_000,
      annualInterestRate: 5,
      termMonths: 36,
      openingFee: 500,
    });
    expect(r.monthlyPayment).toBeCloseTo(1_499, 0);
    expect(r.totalInterest).toBeGreaterThan(3_000);
    expect(r.totalCostWithFees).toBeGreaterThan(r.totalPayments);
  });

  it('ריבית 0 - אין ריבית', () => {
    const r = calculatePersonalLoan({
      loanAmount: 12_000,
      annualInterestRate: 0,
      termMonths: 12,
    });
    expect(r.monthlyPayment).toBe(1_000);
    expect(r.totalInterest).toBe(0);
  });
});

describe('Self-Employed Pension', () => {
  it('הכנסה 10K - הפקדה חובה', () => {
    const r = calculateSelfEmployedPension({
      monthlyIncome: 10_000,
      marginalTaxRate: 30,
      contributeAboveMandatory: false,
      voluntaryMonthlyContribution: 0,
    });
    // tier1: 6,884 × 4.45% = 306.34
    // tier2: 3,116 × 12.55% = 391.06
    // total: ~697
    expect(r.mandatoryMonthly).toBeCloseTo(697, 0);
  });

  it('הכנסה מעל הממוצע - לא תקרה גבוהה יותר', () => {
    const r = calculateSelfEmployedPension({
      monthlyIncome: 30_000,
      marginalTaxRate: 35,
      contributeAboveMandatory: false,
      voluntaryMonthlyContribution: 0,
    });
    // אותה הפקדה כמו 13,769 - לא חייבים מעבר
    const r2 = calculateSelfEmployedPension({
      monthlyIncome: 13_769,
      marginalTaxRate: 35,
      contributeAboveMandatory: false,
      voluntaryMonthlyContribution: 0,
    });
    expect(r.mandatoryMonthly).toBe(r2.mandatoryMonthly);
  });
});
