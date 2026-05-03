import { describe, it, expect } from 'vitest';
import {
  calculateEmployerCost,
  getRecoveryDaysByYears,
  getVacationDaysByYears,
} from '@/lib/calculators/employer-cost';

describe('getRecoveryDaysByYears', () => {
  it('פחות משנה - 0', () => {
    expect(getRecoveryDaysByYears(0.5)).toBe(0);
  });
  it('1-3 שנים - 6 ימים', () => {
    expect(getRecoveryDaysByYears(2)).toBe(6);
  });
  it('11 שנים - 8 ימים', () => {
    expect(getRecoveryDaysByYears(12)).toBe(8);
  });
  it('20+ שנים - 10 ימים', () => {
    expect(getRecoveryDaysByYears(25)).toBe(10);
  });
});

describe('getVacationDaysByYears', () => {
  it('עד 4 שנים - 12 ימים', () => {
    expect(getVacationDaysByYears(2)).toBe(12);
  });
  it('5 שנים - 14 ימים', () => {
    expect(getVacationDaysByYears(5)).toBe(14);
  });
  it('14+ שנים - 26 ימים', () => {
    expect(getVacationDaysByYears(20)).toBe(26);
  });
});

describe('calculateEmployerCost - שכר 10,000 ₪', () => {
  const baseInput = {
    grossSalary: 10_000,
    employmentType: 'regular' as const,
    yearsOfService: 1,
    pensionEmployerRate: 6.5,
    compensationRate: 6,
    hasEducationFund: false,
    transportationType: 'none' as const,
  };

  it('שכר בסיס תקין', () => {
    const result = calculateEmployerCost(baseInput);
    expect(result.baseSalary).toBe(10_000);
  });

  it('ביטוח לאומי מעסיק - מדורג', () => {
    const result = calculateEmployerCost(baseInput);
    // 7,522 × 4.51% = 339.24
    // 2,478 × 7.6% = 188.33
    // סה"כ ~527.57
    expect(result.nationalInsurance).toBeCloseTo(527.6, 0);
  });

  it('פנסיה 6.5%', () => {
    const result = calculateEmployerCost(baseInput);
    expect(result.pensionEmployer).toBe(650);
  });

  it('פיצויים 6%', () => {
    const result = calculateEmployerCost(baseInput);
    expect(result.compensation).toBe(600);
  });

  it('קרן השתלמות = 0 (לא פעיל)', () => {
    const result = calculateEmployerCost(baseInput);
    expect(result.educationFundEmployer).toBe(0);
  });

  it('סה"כ עלות חודשית - בערך 12,500-13,500', () => {
    const result = calculateEmployerCost(baseInput);
    expect(result.totalMonthlyCost).toBeGreaterThan(12_000);
    expect(result.totalMonthlyCost).toBeLessThan(13_500);
  });

  it('יחס עלות/שכר - בערך 1.25-1.35', () => {
    const result = calculateEmployerCost(baseInput);
    expect(result.costToSalaryRatio).toBeGreaterThan(1.2);
    expect(result.costToSalaryRatio).toBeLessThan(1.4);
  });

  it('עלות שנתית = חודשית × 12', () => {
    const result = calculateEmployerCost(baseInput);
    expect(result.totalYearlyCost).toBeCloseTo(result.totalMonthlyCost * 12, 0);
  });
});

describe('calculateEmployerCost - שכר נמוך וגבוה', () => {
  it('שכר נמוך מהמינימום - אזהרה', () => {
    const result = calculateEmployerCost({
      grossSalary: 5_000,
      employmentType: 'regular',
      yearsOfService: 1,
      pensionEmployerRate: 6.5,
      compensationRate: 6,
      hasEducationFund: false,
      transportationType: 'none',
    });
    expect(result.warning).toBeDefined();
  });

  it('שכר גבוה - ביטוח לאומי מוגבל לתקרה', () => {
    const result = calculateEmployerCost({
      grossSalary: 100_000, // מעל לתקרת BL
      employmentType: 'regular',
      yearsOfService: 5,
      pensionEmployerRate: 6.5,
      compensationRate: 6,
      hasEducationFund: false,
      transportationType: 'none',
    });
    // 7,522 × 4.51% + (51,910 - 7,522) × 7.6% = 339.24 + 3,373.49 = 3,712.73
    expect(result.nationalInsurance).toBeCloseTo(3_712.7, 0);
  });
});

describe('calculateEmployerCost - הטבות נוספות', () => {
  it('עם קרן השתלמות 7.5%', () => {
    const result = calculateEmployerCost({
      grossSalary: 20_000,
      employmentType: 'regular',
      yearsOfService: 3,
      pensionEmployerRate: 6.5,
      compensationRate: 6,
      hasEducationFund: true,
      educationFundEmployerRate: 7.5,
      transportationType: 'none',
    });
    expect(result.educationFundEmployer).toBe(1_500);
  });

  it('עם נסיעות והטבות חודשיות', () => {
    const noBenefits = calculateEmployerCost({
      grossSalary: 15_000,
      employmentType: 'regular',
      yearsOfService: 2,
      pensionEmployerRate: 6.5,
      compensationRate: 6,
      hasEducationFund: false,
      transportationType: 'none',
    });
    const withBenefits = calculateEmployerCost({
      grossSalary: 15_000,
      employmentType: 'regular',
      yearsOfService: 2,
      pensionEmployerRate: 6.5,
      compensationRate: 6,
      hasEducationFund: false,
      transportationType: 'public',
      transportationCost: 300,
      monthlyBenefits: 800, // ארוחות
    });
    expect(withBenefits.totalMonthlyCost).toBeCloseTo(noBenefits.totalMonthlyCost + 1_100, 0);
  });
});

describe('calculateEmployerCost - סוגי העסקה', () => {
  it('משרה חלקית - 50%', () => {
    const result = calculateEmployerCost({
      grossSalary: 12_000,
      employmentType: 'part-time',
      partTimePercentage: 50,
      yearsOfService: 1,
      pensionEmployerRate: 6.5,
      compensationRate: 6,
      hasEducationFund: false,
      transportationType: 'none',
    });
    expect(result.baseSalary).toBe(6_000);
  });

  it('שכר שעתי - 60 ₪ × 182 שעות', () => {
    const result = calculateEmployerCost({
      grossSalary: 0,
      employmentType: 'hourly',
      hourlyRate: 60,
      hoursPerMonth: 182,
      yearsOfService: 0,
      pensionEmployerRate: 6.5,
      compensationRate: 6,
      hasEducationFund: false,
      transportationType: 'none',
    });
    expect(result.baseSalary).toBe(10_920);
  });
});
