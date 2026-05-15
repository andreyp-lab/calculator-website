/**
 * בדיקות יחידה — מחשבון ביטוח לאומי לעצמאי 2026
 *
 * אומת מול:
 * - ביטוח לאומי: https://www.btl.gov.il
 * - קבועי tax-2026.ts
 * - חישובי ידניים (ראה הערות)
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBLByTier,
  calculateBituachLeumiSelfEmployed,
  calculateEmployeeBL,
  calculateMinimumBL,
  calculateAnnualReconciliation,
  calculateBLWithOtherEmployment,
  projectPensionEntitlement,
  BL_SE_RATES_2026,
} from '@/lib/calculators/bituach-leumi-self-employed';

// ============================================================
// calculateBLByTier - חישוב מדרגות
// ============================================================

describe('calculateBLByTier', () => {
  it('הכנסה 0 — אפס תשלום', () => {
    const r = calculateBLByTier(0);
    expect(r.monthlyTotal).toBe(0);
    expect(r.monthlyBL).toBe(0);
    expect(r.monthlyHealth).toBe(0);
    expect(r.reduced.income).toBe(0);
    expect(r.full.income).toBe(0);
    expect(r.exempt.income).toBe(0);
  });

  it('הכנסה בדיוק על הסף המופחת (7,522 ₪) — רק מדרגה מופחת', () => {
    const threshold = BL_SE_RATES_2026.reducedThreshold; // 7,522
    const r = calculateBLByTier(threshold);

    expect(r.reduced.income).toBe(threshold);
    expect(r.full.income).toBe(0);
    expect(r.exempt.income).toBe(0);

    // 7,522 × 6.10% = 458.842
    expect(r.monthlyTotal).toBeCloseTo(threshold * 0.061, 1);
    expect(r.monthlyBL).toBeCloseTo(threshold * 0.0287, 1);
    expect(r.monthlyHealth).toBeCloseTo(threshold * 0.0323, 1);
  });

  it('הכנסה 8,000 ₪ — מדרגה מופחת + מלאה: 7,522 × 6.10% + 478 × 18%', () => {
    const r = calculateBLByTier(8_000);

    // חלק מופחת: 7,522
    expect(r.reduced.income).toBe(7_522);
    // חלק מלא: 8,000 - 7,522 = 478
    expect(r.full.income).toBe(478);

    const expectedReduced = 7_522 * 0.061;
    const expectedFull = 478 * 0.18;
    const expectedTotal = expectedReduced + expectedFull;

    // 459 + 86 = 545 (לפי הדרישה)
    expect(r.monthlyTotal).toBeCloseTo(expectedTotal, 0);
    expect(r.monthlyTotal).toBeGreaterThan(540);
    expect(r.monthlyTotal).toBeLessThan(550);
  });

  it('הכנסה 20,000 ₪ — 7,522 × 6.10% + 12,478 × 18%', () => {
    const r = calculateBLByTier(20_000);

    expect(r.reduced.income).toBe(7_522);
    expect(r.full.income).toBe(20_000 - 7_522); // 12,478

    const expectedTotal = 7_522 * 0.061 + 12_478 * 0.18;
    // 459 + 2,246 = 2,705 (לפי הדרישה)
    expect(r.monthlyTotal).toBeCloseTo(expectedTotal, 0);
    expect(r.monthlyTotal).toBeGreaterThan(2_700);
    expect(r.monthlyTotal).toBeLessThan(2_720);
  });

  it('הכנסה 60,000 ₪ — מעל תקרה: 7,522 × 6.10% + (51,910-7,522) × 18% + 0%', () => {
    const r = calculateBLByTier(60_000);

    expect(r.reduced.income).toBe(7_522);
    expect(r.full.income).toBe(51_910 - 7_522); // 44,388
    expect(r.exempt.income).toBe(60_000 - 51_910); // 8,090

    const expectedTotal = 7_522 * 0.061 + 44_388 * 0.18;
    // 459 + 7,990 = 8,449 (לפי הדרישה)
    expect(r.monthlyTotal).toBeCloseTo(expectedTotal, 0);
    expect(r.monthlyTotal).toBeGreaterThan(8_440);
    expect(r.monthlyTotal).toBeLessThan(8_460);
  });

  it('הכנסה בדיוק על התקרה המלאה (51,910 ₪) — אין פטור', () => {
    const maxThreshold = BL_SE_RATES_2026.fullThreshold;
    const r = calculateBLByTier(maxThreshold);

    expect(r.reduced.income).toBe(BL_SE_RATES_2026.reducedThreshold);
    expect(r.full.income).toBe(maxThreshold - BL_SE_RATES_2026.reducedThreshold);
    expect(r.exempt.income).toBe(0);
  });

  it('הכנסה שלילית — מטופל כ-0', () => {
    const r = calculateBLByTier(-5_000);
    expect(r.monthlyTotal).toBe(0);
    expect(r.reduced.income).toBe(0);
  });

  it('bl + health = total לכל מדרגה', () => {
    const r = calculateBLByTier(25_000);
    expect(r.reduced.total).toBeCloseTo(r.reduced.bl + r.reduced.health, 6);
    expect(r.full.total).toBeCloseTo(r.full.bl + r.full.health, 6);
    expect(r.monthlyTotal).toBeCloseTo(r.reduced.total + r.full.total, 6);
    expect(r.monthlyTotal).toBeCloseTo(r.monthlyBL + r.monthlyHealth, 6);
  });
});

// ============================================================
// calculateBituachLeumiSelfEmployed - חישוב ראשי
// ============================================================

describe('calculateBituachLeumiSelfEmployed', () => {
  it('שנתי = חודשי × 12', () => {
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: 15_000,
      paymentFrequency: 'quarterly',
      age: 35,
    });
    expect(r.annualTotal).toBeCloseTo(r.monthlyTotal * 12, 0);
    expect(r.annualBL).toBeCloseTo(r.monthlyBL * 12, 0);
    expect(r.annualHealth).toBeCloseTo(r.monthlyHealth * 12, 0);
  });

  it('תשלום רבעוני — 4 תשלומים', () => {
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: 15_000,
      paymentFrequency: 'quarterly',
      age: 35,
    });
    expect(r.installmentsPerYear).toBe(4);
    expect(r.paymentPerInstallment).toBeCloseTo(r.annualTotal / 4, 0);
  });

  it('תשלום חודשי — 12 תשלומים', () => {
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: 15_000,
      paymentFrequency: 'monthly',
      age: 35,
    });
    expect(r.installmentsPerYear).toBe(12);
    expect(r.paymentPerInstallment).toBeCloseTo(r.annualTotal / 12, 0);
  });

  it('הטבת מס — 52% מהסכום השנתי', () => {
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: 20_000,
      paymentFrequency: 'quarterly',
      age: 40,
    });
    expect(r.taxDeductibleAmount).toBeCloseTo(r.annualTotal * 0.52, 0);
  });

  it('חסכון מס בשיעור 31%', () => {
    const marginalRate = 0.31;
    const r = calculateBituachLeumiSelfEmployed(
      { monthlyIncome: 20_000, paymentFrequency: 'quarterly', age: 40 },
      marginalRate,
    );
    expect(r.taxSavingAmount).toBeCloseTo(r.taxDeductibleAmount * marginalRate, 0);
    expect(r.netCostAfterTax).toBeCloseTo(r.annualTotal - r.taxSavingAmount, 0);
  });

  it('עלות נטו < סכום ברוטו', () => {
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: 20_000,
      paymentFrequency: 'quarterly',
      age: 40,
    });
    expect(r.netCostAfterTax).toBeLessThan(r.annualTotal);
  });

  it('שיעור אפקטיבי = סכום חודשי / הכנסה', () => {
    const income = 15_000;
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: income,
      paymentFrequency: 'quarterly',
      age: 35,
    });
    expect(r.effectiveRate).toBeCloseTo(r.monthlyTotal / income, 4);
  });

  it('הכנסה 0 — תשלום מינימום', () => {
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: 0,
      paymentFrequency: 'monthly',
      age: 30,
    });
    expect(r.monthlyTotal).toBe(BL_SE_RATES_2026.minimumMonthlyPayment);
  });

  it('המלצות קיימות לכל חישוב', () => {
    const r = calculateBituachLeumiSelfEmployed({
      monthlyIncome: 10_000,
      paymentFrequency: 'quarterly',
      age: 35,
    });
    expect(r.recommendations.length).toBeGreaterThan(0);
  });
});

// ============================================================
// calculateEmployeeBL - ב.ל. שכיר להשוואה
// ============================================================

describe('calculateEmployeeBL', () => {
  it('הכנסה 0 — אפס', () => {
    expect(calculateEmployeeBL(0)).toBe(0);
  });

  it('הכנסה 5,000 — רק מדרגה מופחת (4.27%)', () => {
    const r = calculateEmployeeBL(5_000);
    expect(r).toBeCloseTo(5_000 * 0.0427, 0);
  });

  it('הכנסה 20,000 — שתי מדרגות', () => {
    const r = calculateEmployeeBL(20_000);
    const expected = 7_522 * 0.0427 + (20_000 - 7_522) * 0.1217;
    expect(r).toBeCloseTo(expected, 0);
  });

  it('עצמאי גבוה משמעותית משכיר', () => {
    const income = 20_000;
    const seBL = calculateBLByTier(income).monthlyTotal;
    const empBL = calculateEmployeeBL(income);
    expect(seBL).toBeGreaterThan(empBL * 1.2); // לפחות 20% יותר
  });
});

// ============================================================
// calculateMinimumBL
// ============================================================

describe('calculateMinimumBL', () => {
  it('מחזיר את סכום המינימום', () => {
    expect(calculateMinimumBL()).toBe(BL_SE_RATES_2026.minimumMonthlyPayment);
    expect(calculateMinimumBL()).toBeGreaterThan(0);
  });
});

// ============================================================
// calculateAnnualReconciliation - תיאום שנתי
// ============================================================

describe('calculateAnnualReconciliation', () => {
  it('הכנסה בפועל גבוהה — תשלום נדרש', () => {
    const r = calculateAnnualReconciliation(10_000, 15_000);
    expect(r.refundOrPayment).toBe('payment');
    expect(r.difference).toBeGreaterThan(0);
    expect(r.actualBL).toBeGreaterThan(r.paidBL);
  });

  it('הכנסה בפועל נמוכה — החזר', () => {
    const r = calculateAnnualReconciliation(15_000, 10_000);
    expect(r.refundOrPayment).toBe('refund');
    expect(r.difference).toBeLessThan(0);
    expect(r.actualBL).toBeLessThan(r.paidBL);
  });

  it('הכנסות זהות — מאוזן', () => {
    const r = calculateAnnualReconciliation(15_000, 15_000);
    expect(r.refundOrPayment).toBe('balanced');
    expect(Math.abs(r.difference)).toBeLessThan(1);
  });

  it('ריבית פיגורים רק בתשלום (לא בהחזר)', () => {
    const payment = calculateAnnualReconciliation(10_000, 15_000);
    expect(payment.interestIfLate3Months).toBeGreaterThan(0);

    const refund = calculateAnnualReconciliation(15_000, 10_000);
    expect(refund.interestIfLate3Months).toBe(0);
  });

  it('b.l. שנתי = חודשי × 12', () => {
    const r = calculateAnnualReconciliation(12_000, 18_000);
    const expectedPaid = calculateBLByTier(12_000).monthlyTotal * 12;
    const expectedActual = calculateBLByTier(18_000).monthlyTotal * 12;
    expect(r.paidBL).toBeCloseTo(expectedPaid, 0);
    expect(r.actualBL).toBeCloseTo(expectedActual, 0);
  });
});

// ============================================================
// calculateBLWithOtherEmployment - כפל עיסוקים
// ============================================================

describe('calculateBLWithOtherEmployment', () => {
  it('מחזיר selfEmployedBL חיובי', () => {
    const r = calculateBLWithOtherEmployment(15_000, 8_000);
    expect(r.selfEmployedBL).toBeGreaterThan(0);
    expect(r.employeePortionAlreadyPaid).toBeGreaterThan(0);
  });

  it('הערה מוצגת', () => {
    const r = calculateBLWithOtherEmployment(15_000, 8_000);
    expect(r.note.length).toBeGreaterThan(10);
  });
});

// ============================================================
// projectPensionEntitlement - תחזית פנסיה
// ============================================================

describe('projectPensionEntitlement', () => {
  it('מתחת ל-5 שנות ביטוח — לא עומד בדרישה', () => {
    const r = projectPensionEntitlement(3, 500);
    expect(r.meetsMinimumYears).toBe(false);
    expect(r.estimatedMonthlyPension).toBe(0);
  });

  it('מעל 5 שנות ביטוח — עומד בדרישה', () => {
    const r = projectPensionEntitlement(10, 1000);
    expect(r.meetsMinimumYears).toBe(true);
    expect(r.estimatedMonthlyPension).toBeGreaterThan(0);
  });

  it('יותר שנות ביטוח = קצבה גבוהה יותר', () => {
    const r5 = projectPensionEntitlement(5, 1000);
    const r20 = projectPensionEntitlement(20, 1000);
    expect(r20.estimatedMonthlyPension).toBeGreaterThan(r5.estimatedMonthlyPension);
  });

  it('גיל פרישה 67', () => {
    const r = projectPensionEntitlement(15, 1500);
    expect(r.retirementAge).toBe(67);
  });

  it('קצבה לא עולה על תקרה סבירה', () => {
    const r = projectPensionEntitlement(45, 5000);
    expect(r.estimatedMonthlyPension).toBeLessThanOrEqual(6_000);
  });
});

// ============================================================
// קבועים
// ============================================================

describe('BL_SE_RATES_2026', () => {
  it('סכום שיעורים מופחתים = total', () => {
    const { reducedRate } = BL_SE_RATES_2026;
    expect(reducedRate.bl + reducedRate.health).toBeCloseTo(reducedRate.total, 6);
  });

  it('סכום שיעורים מלאים = total', () => {
    const { fullRate } = BL_SE_RATES_2026;
    expect(fullRate.bl + fullRate.health).toBeCloseTo(fullRate.total, 6);
  });

  it('שיעור מלא > שיעור מופחת', () => {
    expect(BL_SE_RATES_2026.fullRate.total).toBeGreaterThan(
      BL_SE_RATES_2026.reducedRate.total,
    );
  });

  it('תקרה מלאה > תקרה מופחת', () => {
    expect(BL_SE_RATES_2026.fullThreshold).toBeGreaterThan(
      BL_SE_RATES_2026.reducedThreshold,
    );
  });

  it('52% מוכר כהוצאה', () => {
    expect(BL_SE_RATES_2026.deductiblePercent).toBe(0.52);
  });
});
