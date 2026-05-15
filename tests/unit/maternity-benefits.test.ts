import { describe, it, expect } from 'vitest';
import {
  calculateLeaveDuration,
  calculateMaternityPay,
  calculateFatherLeave,
  calculateBreastfeedingValue,
  calculateHospitalVsHome,
  calculateMaternityBenefits,
  MATERNITY_DAILY_CAP_2026,
  MATERNITY_MONTHLY_CAP_2026,
  FULL_LEAVE_DAYS,
  MIN_LEAVE_DAYS,
  MULTIPLE_BIRTH_EXTRA_DAYS,
  PREMATURE_EXTRA_DAYS,
  HOSPITALIZATION_MAX_EXTRA_DAYS,
  JOB_PROTECTION_DAYS_AFTER_RETURN,
  BREASTFEEDING_HOUR_MONTHS,
  AVERAGE_WAGE_2026,
} from '@/lib/calculators/maternity-benefits';

// ====================================================================
// קבועים
// ====================================================================
describe('קבועים 2026', () => {
  it('תקרה יומית = 1730.33', () => {
    expect(MATERNITY_DAILY_CAP_2026).toBe(1_730.33);
  });

  it('תקרה חודשית = 51910', () => {
    expect(MATERNITY_MONTHLY_CAP_2026).toBe(51_910);
  });

  it('חופשה מלאה = 105 ימים', () => {
    expect(FULL_LEAVE_DAYS).toBe(105);
  });

  it('חופשה חלקית = 56 ימים', () => {
    expect(MIN_LEAVE_DAYS).toBe(56);
  });

  it('הארכה תאומים = 21 ימים', () => {
    expect(MULTIPLE_BIRTH_EXTRA_DAYS).toBe(21);
  });

  it('הגנת משרה אחרי חזרה = 60 ימים', () => {
    expect(JOB_PROTECTION_DAYS_AFTER_RETURN).toBe(60);
  });

  it('שעת הנקה = 4 חודשים', () => {
    expect(BREASTFEEDING_HOUR_MONTHS).toBe(4);
  });

  it('שכר ממוצע 2026 חיובי', () => {
    expect(AVERAGE_WAGE_2026).toBeGreaterThan(10_000);
  });
});

// ====================================================================
// calculateLeaveDuration — זכאות ואורך
// ====================================================================
describe('calculateLeaveDuration', () => {
  it('10+ חודשים → חופשה מלאה', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 0,
    });
    expect(r.eligibility).toBe('full');
    expect(r.paidLeaveDays).toBe(FULL_LEAVE_DAYS);
    expect(r.isFullEligibility).toBe(true);
  });

  it('6-9 חודשים → חופשה חלקית', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 8,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 0,
    });
    expect(r.eligibility).toBe('partial');
    expect(r.paidLeaveDays).toBe(MIN_LEAVE_DAYS);
    expect(r.isFullEligibility).toBe(false);
  });

  it('פחות מ-6 חודשים → לא זכאית', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 4,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 0,
    });
    expect(r.eligibility).toBe('none');
    expect(r.paidLeaveDays).toBe(0);
    expect(r.totalDays).toBe(0);
  });

  it('תאומים — הארכה של 21 ימים', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 2,
      isPremature: false,
      hospitalizationDays: 0,
    });
    expect(r.multipleBirthExtraDays).toBe(MULTIPLE_BIRTH_EXTRA_DAYS);
    expect(r.totalDays).toBe(FULL_LEAVE_DAYS + MULTIPLE_BIRTH_EXTRA_DAYS);
  });

  it('שלישיה — הארכה של 42 ימים', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 3,
      isPremature: false,
      hospitalizationDays: 0,
    });
    expect(r.multipleBirthExtraDays).toBe(MULTIPLE_BIRTH_EXTRA_DAYS * 2);
    expect(r.totalDays).toBe(FULL_LEAVE_DAYS + MULTIPLE_BIRTH_EXTRA_DAYS * 2);
  });

  it('פג — הארכה של 21 ימים', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: true,
      hospitalizationDays: 0,
    });
    expect(r.prematureExtraDays).toBe(PREMATURE_EXTRA_DAYS);
    expect(r.totalDays).toBe(FULL_LEAVE_DAYS + PREMATURE_EXTRA_DAYS);
  });

  it('אישפוז 7+ ימים → הארכה', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 30,
    });
    expect(r.hospitalizationExtraDays).toBe(30);
    expect(r.totalDays).toBe(FULL_LEAVE_DAYS + 30);
  });

  it('אישפוז 6 ימים — אין הארכה', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 6,
    });
    expect(r.hospitalizationExtraDays).toBe(0);
  });

  it('אישפוז מקסימלי — מוגבל ל-140 ימים', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 200,
    });
    expect(r.hospitalizationExtraDays).toBe(HOSPITALIZATION_MAX_EXTRA_DAYS);
  });

  it('הסבר לא ריק', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 10,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 0,
    });
    expect(r.explanation).toBeTruthy();
    expect(r.explanation.length).toBeGreaterThan(10);
  });

  it('המלצות מכילות מידע לאישפוז', () => {
    const r = calculateLeaveDuration({
      monthsWorkedInLast14: 12,
      employmentType: 'employee',
      numberOfBabies: 1,
      isPremature: false,
      hospitalizationDays: 20,
    });
    expect(r.recommendations.length).toBeGreaterThan(0);
    expect(r.recommendations.some((rec) => rec.includes('אישפוז'))).toBe(true);
  });
});

// ====================================================================
// calculateMaternityPay — חישוב תשלום
// ====================================================================
describe('calculateMaternityPay', () => {
  it('שכר 12,000 — תשלום יומי נכון', () => {
    const r = calculateMaternityPay({
      avgSalary3Months: 12_000,
      leaveDays: 105,
    });
    expect(r.dailyBenefit).toBeCloseTo(12_000 / 30, 2);
    expect(r.effectiveMonthlySalary).toBe(12_000);
    expect(r.cappedAtMaximum).toBe(false);
  });

  it('שכר 12,000 — סה"כ תשלום 105 ימים', () => {
    const r = calculateMaternityPay({
      avgSalary3Months: 12_000,
      leaveDays: 105,
    });
    expect(r.totalBenefit).toBeCloseTo((12_000 / 30) * 105, 0);
  });

  it('שכר גבוה מהתקרה — מוגבל לתקרה', () => {
    const r = calculateMaternityPay({
      avgSalary3Months: 100_000,
      leaveDays: 105,
    });
    expect(r.cappedAtMaximum).toBe(true);
    expect(r.dailyBenefit).toBeLessThanOrEqual(MATERNITY_DAILY_CAP_2026 + 0.01);
    expect(r.warning).toBeTruthy();
  });

  it('ממוצע 6 חודשים גבוה יותר — נלקח', () => {
    const r = calculateMaternityPay({
      avgSalary3Months: 10_000,
      avgSalary6Months: 15_000,
      leaveDays: 105,
    });
    expect(r.effectiveMonthlySalary).toBe(15_000);
    expect(r.used6MonthCalc).toBe(true);
  });

  it('ממוצע 3 חודשים גבוה יותר — נלקח', () => {
    const r = calculateMaternityPay({
      avgSalary3Months: 15_000,
      avgSalary6Months: 10_000,
      leaveDays: 105,
    });
    expect(r.effectiveMonthlySalary).toBe(15_000);
    expect(r.used6MonthCalc).toBe(false);
  });

  it('פטור ממס הכנסה — תמיד true', () => {
    const r = calculateMaternityPay({ avgSalary3Months: 20_000, leaveDays: 105 });
    expect(r.incomeTaxExempt).toBe(true);
  });

  it('ביטוח לאומי חיובי', () => {
    const r = calculateMaternityPay({ avgSalary3Months: 15_000, leaveDays: 105 });
    expect(r.nationalInsuranceAmount).toBeGreaterThan(0);
  });

  it('נטו נמוך מברוטו', () => {
    const r = calculateMaternityPay({ avgSalary3Months: 15_000, leaveDays: 105 });
    expect(r.estimatedNetBenefit).toBeLessThan(r.totalBenefit);
  });

  it('הפסד מעל תקרה חיובי כשיש שכר גבוה', () => {
    const r = calculateMaternityPay({ avgSalary3Months: 100_000, leaveDays: 105 });
    expect(r.excessLoss).toBeGreaterThan(0);
  });

  it('הפסד מעל תקרה = 0 כשמתחת לתקרה', () => {
    const r = calculateMaternityPay({ avgSalary3Months: 10_000, leaveDays: 105 });
    expect(r.excessLoss).toBe(0);
  });

  it('0 ימים — סה"כ תשלום אפס', () => {
    const r = calculateMaternityPay({ avgSalary3Months: 12_000, leaveDays: 0 });
    expect(r.totalBenefit).toBe(0);
  });
});

// ====================================================================
// calculateFatherLeave — חופשת אב
// ====================================================================
describe('calculateFatherLeave', () => {
  it('אם זכאית ולקחת 105 ימים — אב זכאי ל-7 ימים', () => {
    const r = calculateFatherLeave({
      motherFullLeaveEligible: true,
      fatherMonthlySalary: 15_000,
      motherMonthlySalary: 12_000,
      motherLeaveDays: 105,
    });
    expect(r.fatherLeaveDays).toBe(7);
  });

  it('אם לא זכאית — אב לא זכאי', () => {
    const r = calculateFatherLeave({
      motherFullLeaveEligible: false,
      fatherMonthlySalary: 15_000,
      motherMonthlySalary: 12_000,
      motherLeaveDays: 56,
    });
    expect(r.fatherLeaveDays).toBe(0);
    expect(r.fatherTotalBenefit).toBe(0);
  });

  it('אם לוקחת פחות מ-21 ימים — אב לא זכאי', () => {
    const r = calculateFatherLeave({
      motherFullLeaveEligible: true,
      fatherMonthlySalary: 15_000,
      motherMonthlySalary: 12_000,
      motherLeaveDays: 14, // פחות מ-21
    });
    expect(r.fatherLeaveDays).toBe(0);
  });

  it('תשלום לאב לפי שכר האב', () => {
    const r = calculateFatherLeave({
      motherFullLeaveEligible: true,
      fatherMonthlySalary: 15_000,
      motherMonthlySalary: 12_000,
      motherLeaveDays: 105,
    });
    expect(r.fatherDailyBenefit).toBeCloseTo(15_000 / 30, 2);
    expect(r.fatherTotalBenefit).toBeCloseTo((15_000 / 30) * 7, 0);
  });

  it('שכר אב מעל תקרה — מוגבל', () => {
    const r = calculateFatherLeave({
      motherFullLeaveEligible: true,
      fatherMonthlySalary: 200_000,
      motherMonthlySalary: 12_000,
      motherLeaveDays: 105,
    });
    expect(r.fatherDailyBenefit).toBeLessThanOrEqual(MATERNITY_DAILY_CAP_2026 + 0.01);
  });

  it('הסבר לא ריק', () => {
    const r = calculateFatherLeave({
      motherFullLeaveEligible: true,
      fatherMonthlySalary: 15_000,
      motherMonthlySalary: 12_000,
      motherLeaveDays: 105,
    });
    expect(r.explanation).toBeTruthy();
  });

  it('תועלת משפחתית גבוהה יותר עם חופשת אב', () => {
    const withFather = calculateFatherLeave({
      motherFullLeaveEligible: true,
      fatherMonthlySalary: 15_000,
      motherMonthlySalary: 12_000,
      motherLeaveDays: 105,
    });
    // הסכום המשפחתי צריך להיות חיובי
    expect(withFather.combinedBenefit).toBeGreaterThan(0);
  });
});

// ====================================================================
// calculateBreastfeedingValue — שעת הנקה
// ====================================================================
describe('calculateBreastfeedingValue', () => {
  it('שכר 12,000 ו-8 שעות — שכר שעתי נכון', () => {
    const r = calculateBreastfeedingValue({ monthlySalary: 12_000, workHoursPerDay: 8 });
    // שכר שעתי = 12000 / (22 × 8) ≈ 68.18
    expect(r.hourlyRate).toBeCloseTo(12_000 / (22 * 8), 2);
  });

  it('שווי חודשי = שכר שעתי × 22 ימים', () => {
    const r = calculateBreastfeedingValue({ monthlySalary: 12_000, workHoursPerDay: 8 });
    expect(r.monthlyBreastfeedingValue).toBeCloseTo(r.hourlyRate * 22, 2);
  });

  it('שווי 4 חודשים = שווי חודשי × 4', () => {
    const r = calculateBreastfeedingValue({ monthlySalary: 12_000, workHoursPerDay: 8 });
    expect(r.totalBreastfeedingValue).toBeCloseTo(r.monthlyBreastfeedingValue * 4, 2);
  });

  it('שעות עבודה פחות → שכר שעתי גבוה יותר', () => {
    const r7 = calculateBreastfeedingValue({ monthlySalary: 12_000, workHoursPerDay: 7 });
    const r8 = calculateBreastfeedingValue({ monthlySalary: 12_000, workHoursPerDay: 8 });
    expect(r7.hourlyRate).toBeGreaterThan(r8.hourlyRate);
  });

  it('הסבר מכיל מידע', () => {
    const r = calculateBreastfeedingValue({ monthlySalary: 12_000, workHoursPerDay: 8 });
    expect(r.explanation).toBeTruthy();
    expect(r.explanation.length).toBeGreaterThan(20);
  });
});

// ====================================================================
// calculateHospitalVsHome — השוואת תרחישים
// ====================================================================
describe('calculateHospitalVsHome', () => {
  it('תרחיש אישפוז מכיל ימים נוספים', () => {
    const r = calculateHospitalVsHome(400, 105, 30, 12_000);
    expect(r.hospitalScenario.totalLeaveDays).toBe(135);
  });

  it('תרחיש בית מכיל ימי חופשה רגילים', () => {
    const r = calculateHospitalVsHome(400, 105, 30, 12_000);
    expect(r.homeScenario.totalLeaveDays).toBe(105);
  });

  it('המלצה לא ריקה', () => {
    const r = calculateHospitalVsHome(400, 105, 30, 12_000);
    expect(r.recommendation).toBeTruthy();
  });

  it('אישפוז מוגבל ל-140 ימים', () => {
    const r = calculateHospitalVsHome(400, 105, 200, 12_000);
    expect(r.hospitalScenario.totalLeaveDays).toBe(105 + 140);
  });
});

// ====================================================================
// calculateMaternityBenefits — תאימות לאחור
// ====================================================================
describe('calculateMaternityBenefits (backward compat)', () => {
  it('מחזיר תשלום יומי נכון', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 12_000,
      leaveDays: 105,
      multipleBabies: 1,
      hospitalizationDays: 0,
    });
    expect(r.dailyBenefit).toBeCloseTo(12_000 / 30, 2);
  });

  it('מחזיר סה"כ ימים נכון עם תאומים', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 10_000,
      leaveDays: 105,
      multipleBabies: 2,
      hospitalizationDays: 0,
    });
    expect(r.totalDays).toBe(126); // 105 + 21
  });

  it('מחזיר שכר קובע כגבוה מבין שני החישובים', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 10_000,
      sixMonthsAvgSalary: 15_000,
      leaveDays: 105,
      multipleBabies: 1,
      hospitalizationDays: 0,
    });
    expect(r.effectiveMonthlySalary).toBe(15_000);
  });

  it('שכר מעל תקרה — avertissement ו-cappedAtMaximum', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 100_000,
      leaveDays: 105,
      multipleBabies: 1,
      hospitalizationDays: 0,
    });
    expect(r.cappedAtMaximum).toBe(true);
    expect(r.warning).toBeTruthy();
  });

  it('אישפוז מוסיף ימים', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 10_000,
      leaveDays: 105,
      multipleBabies: 1,
      hospitalizationDays: 20,
    });
    expect(r.totalDays).toBe(125); // 105 + 20
  });

  it('תשלום כולל = יומי × ימים', () => {
    const r = calculateMaternityBenefits({
      recentMonthlySalary: 9_000,
      leaveDays: 105,
      multipleBabies: 1,
      hospitalizationDays: 0,
    });
    expect(r.totalBenefit).toBeCloseTo(r.dailyBenefit * r.totalDays, 1);
  });
});
