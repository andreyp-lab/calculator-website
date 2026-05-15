import { describe, it, expect } from 'vitest';
import {
  calculateTaxAdvances,
  calculateLatePayment,
  estimateReconciliation,
  calculatePaymentSchedule,
} from '@/lib/calculators/tax-advances';

// =====================================================
// calculateTaxAdvances - חישוב מקדמות עיקרי
// =====================================================

describe('calculateTaxAdvances', () => {
  it('הכנסה ממוצעת - עוסק מורשה דו-חודשי', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: true,
      frequency: 'bimonthly',
      annualVatCollected: 36_000,
      annualVatDeductible: 12_000,
    });

    // 6 תשלומים בשנה
    expect(r.paymentsPerYear).toBe(6);
    // מס הכנסה חיובי
    expect(r.annualIncomeTax).toBeGreaterThan(0);
    // ב.ל. חיובי
    expect(r.annualSocialSecurity).toBeGreaterThan(0);
    // מע"מ נטו: 36,000 - 12,000 = 24,000
    expect(r.annualVatPayable).toBeCloseTo(24_000, 0);
    // סך שנתי = מס + ב.ל. + מע"מ
    expect(r.totalAnnual).toBeCloseTo(
      r.annualIncomeTax + r.annualSocialSecurity + r.annualVatPayable,
      0,
    );
    // פר תשלום = סך / 6
    expect(r.perPaymentAmount).toBeCloseTo(r.totalAnnual / 6, 0);
    // שיעור מס מצרפי סביר (מס + ב.ל. / הכנסה)
    expect(r.effectiveTaxRate).toBeGreaterThan(0.1);
    expect(r.effectiveTaxRate).toBeLessThan(0.6);
  });

  it('עוסק פטור - ללא מע"מ', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 100_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });

    expect(r.annualVatPayable).toBe(0);
    expect(r.perPaymentBreakdown.vat).toBe(0);
  });

  it('תדירות חודשית - 12 תשלומים', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 150_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'monthly',
    });

    expect(r.paymentsPerYear).toBe(12);
    expect(r.perPaymentAmount).toBeCloseTo(r.totalAnnual / 12, 0);
  });

  it('הכנסה אפס - אין מס', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 0,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });

    expect(r.annualIncomeTax).toBe(0);
    expect(r.annualSocialSecurity).toBe(0);
    expect(r.totalAnnual).toBe(0);
    expect(r.effectiveTaxRate).toBe(0);
  });

  it('ניכוי פנסיה מקטין מס', () => {
    const withoutPension = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });

    const withPension = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      monthlyPensionDeposit: 1_500, // 18,000 שנתי
    });

    expect(withPension.annualIncomeTax).toBeLessThan(withoutPension.annualIncomeTax);
    expect(withPension.annualPensionDeduction).toBeGreaterThan(0);
    expect(withPension.taxableIncome).toBeLessThan(withoutPension.taxableIncome);
  });

  it('ניכוי קרן השתלמות מקטין מס', () => {
    const withoutSF = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });

    const withSF = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      monthlyStudyFundDeposit: 800, // 9,600 שנתי
    });

    expect(withSF.annualIncomeTax).toBeLessThan(withoutSF.annualIncomeTax);
    expect(withSF.annualStudyFundDeduction).toBeGreaterThan(0);
  });

  it('פירוט פר תשלום מסתכם לסכום השנתי', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 300_000,
      creditPoints: 2.25,
      isVatRegistered: true,
      frequency: 'bimonthly',
      annualVatCollected: 50_000,
      annualVatDeductible: 10_000,
    });

    const sumViaBreakdown =
      (r.perPaymentBreakdown.incomeTax +
        r.perPaymentBreakdown.socialSecurity +
        r.perPaymentBreakdown.vat) *
      r.paymentsPerYear;

    expect(sumViaBreakdown).toBeCloseTo(r.totalAnnual, 0);
  });

  it('הכנסה גבוהה - שיעור מס גבוה יותר', () => {
    const low = calculateTaxAdvances({
      expectedAnnualIncome: 100_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });

    const high = calculateTaxAdvances({
      expectedAnnualIncome: 600_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });

    expect(high.effectiveTaxRate).toBeGreaterThan(low.effectiveTaxRate);
    expect(high.incomeTaxRate).toBeGreaterThan(low.incomeTaxRate);
  });

  it('לוח תשלומים - דו-חודשי - 6 רשומות', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
    });

    expect(r.paymentSchedule).toHaveLength(6);
    r.paymentSchedule.forEach((entry) => {
      expect(entry.total).toBeGreaterThan(0);
      expect(entry.monthsCovered).toBeTruthy();
    });
  });

  it('לוח תשלומים - חודשי - 12 רשומות', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'monthly',
    });

    expect(r.paymentSchedule).toHaveLength(12);
    const totalFromSchedule = r.paymentSchedule.reduce((s, e) => s + e.total, 0);
    expect(totalFromSchedule).toBeCloseTo(r.totalAnnual, 0);
  });

  it('תזרים חודשי - 12 חודשים', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: true,
      frequency: 'bimonthly',
      annualVatCollected: 20_000,
      annualVatDeductible: 5_000,
    });

    expect(r.cashFlowPlan).toHaveLength(12);
    // סכום הפרשות חודשיות = סה"כ שנתי
    const totalSetAside = r.cashFlowPlan.reduce((s, m) => s + m.suggestedSetAside, 0);
    expect(totalSetAside).toBeCloseTo(r.totalAnnual, 0);
  });

  it('תיאום אמצע שנה - הכנסה גבוהה ב-20%', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      actualIncomeYTD: 110_000, // 6 חודשים - 183,333 שנתי צפוי (91.7%)... wait
      currentMonth: 6,
    });

    // actualYTD = 110,000 in 6 months -> projected = 220,000 (+10%)
    expect(r.midYearAdjustment).not.toBeNull();
    expect(r.midYearAdjustment!.projectedAnnual).toBeCloseTo(220_000, 0);
    // שינוי 10% - לא עובר 15%, לא נדרש תיאום
  });

  it('תיאום אמצע שנה - מומלץ לדווח כשהפרש > 15%', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      actualIncomeYTD: 70_000, // 6 חודשים → 140,000 צפוי (-30%)
      currentMonth: 6,
    });

    expect(r.midYearAdjustment).not.toBeNull();
    expect(r.midYearAdjustment!.shouldAdjust).toBe(true);
    expect(r.midYearAdjustment!.changePercent).toBeCloseTo(-0.3, 1);
  });

  it('הערכת גמר שנה - שולם יותר = החזר', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      advancesPaidYTD: 100_000, // שולם הרבה
    });

    expect(r.reconciliationEstimate).not.toBeNull();
    expect(r.reconciliationEstimate!.isRefund).toBe(true);
    expect(r.reconciliationEstimate!.difference).toBeLessThan(0);
  });

  it('הערכת גמר שנה - שולם פחות = תשלום נוסף', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 200_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      advancesPaidYTD: 5_000, // שולם מעט
    });

    expect(r.reconciliationEstimate).not.toBeNull();
    expect(r.reconciliationEstimate!.isRefund).toBe(false);
    expect(r.reconciliationEstimate!.difference).toBeGreaterThan(0);
  });

  it('הפרשה חודשית = סה"כ שנתי / 12', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 240_000,
      creditPoints: 2.25,
      isVatRegistered: true,
      frequency: 'bimonthly',
      annualVatCollected: 30_000,
      annualVatDeductible: 10_000,
    });

    expect(r.monthlySetAside).toBeCloseTo(r.totalAnnual / 12, 0);
  });

  it('ניכוי פנסיה מוגבל ל-11% מהכנסה', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 100_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      monthlyPensionDeposit: 2_000, // 24,000 שנתי > 11% = 11,000
    });

    // ניכוי פנסיה לא יעלה על 11% × 100,000 = 11,000
    expect(r.annualPensionDeduction).toBeLessThanOrEqual(11_000 + 1); // +1 floating
  });

  it('ניכוי קרן השתלמות מוגבל ל-20,520 ₪', () => {
    const r = calculateTaxAdvances({
      expectedAnnualIncome: 500_000,
      creditPoints: 2.25,
      isVatRegistered: false,
      frequency: 'bimonthly',
      monthlyStudyFundDeposit: 5_000, // 60,000 שנתי > מקסימום
    });

    expect(r.annualStudyFundDeduction).toBeLessThanOrEqual(20_520 + 1);
  });
});

// =====================================================
// calculateLatePayment - ריבית פיגורים
// =====================================================

describe('calculateLatePayment', () => {
  it('חישוב ריבית בסיסי - 5,000 ₪ × 3 חודשים', () => {
    const r = calculateLatePayment({
      unpaidAmount: 5_000,
      monthsLate: 3,
    });

    // 5,000 × 1.5% × 3 = 225
    expect(r.interest).toBeCloseTo(225, 0);
    expect(r.total).toBeCloseTo(5_225, 0);
    expect(r.principal).toBe(5_000);
    expect(r.monthlyRate).toBe(0.015);
  });

  it('ריבית לפי ברירת מחדל 1.5%', () => {
    const r = calculateLatePayment({ unpaidAmount: 10_000, monthsLate: 12 });
    // 10,000 × 1.5% × 12 = 1,800
    expect(r.interest).toBeCloseTo(1_800, 0);
  });

  it('ריבית מותאמת אישית', () => {
    const r = calculateLatePayment({
      unpaidAmount: 10_000,
      monthsLate: 6,
      monthlyInterestRate: 0.02, // 2%/חודש
    });
    // 10,000 × 2% × 6 = 1,200
    expect(r.interest).toBeCloseTo(1_200, 0);
    expect(r.monthlyRate).toBe(0.02);
  });

  it('ריבית שנתית מחושבת נכון', () => {
    const r = calculateLatePayment({ unpaidAmount: 1_000, monthsLate: 1 });
    // שנתי: (1.015)^12 - 1 ≈ 19.56%
    expect(r.annualRate).toBeCloseTo(0.1956, 2);
  });

  it('תשלום גדול - 50,000 ₪ × 6 חודשים', () => {
    const r = calculateLatePayment({ unpaidAmount: 50_000, monthsLate: 6 });
    expect(r.interest).toBeCloseTo(4_500, 0);
    expect(r.total).toBeCloseTo(54_500, 0);
  });
});

// =====================================================
// estimateReconciliation - הערכת גמר שנה
// =====================================================

describe('estimateReconciliation', () => {
  it('שולם יותר מהחבות - החזר מס', () => {
    const r = estimateReconciliation(50_000, 40_000);

    expect(r.isRefund).toBe(true);
    expect(r.difference).toBeCloseTo(-10_000, 0);
    expect(r.totalAdvancesPaid).toBe(50_000);
    expect(r.actualTaxLiability).toBe(40_000);
    expect(r.utilizationRate).toBeGreaterThan(1); // שולם יותר מ-100%
  });

  it('שולם פחות מהחבות - תשלום נוסף', () => {
    const r = estimateReconciliation(20_000, 35_000);

    expect(r.isRefund).toBe(false);
    expect(r.difference).toBeCloseTo(15_000, 0);
    expect(r.utilizationRate).toBeCloseTo(20_000 / 35_000, 2);
  });

  it('שולם בדיוק - הפרש אפס', () => {
    const r = estimateReconciliation(30_000, 30_000);

    expect(r.difference).toBe(0);
    expect(r.utilizationRate).toBe(1);
  });
});

// =====================================================
// calculatePaymentSchedule - לוח תשלומים
// =====================================================

describe('calculatePaymentSchedule', () => {
  it('דו-חודשי - 6 רשומות', () => {
    const schedule = calculatePaymentSchedule(12_000, 8_000, 4_000, 'bimonthly');
    expect(schedule).toHaveLength(6);
  });

  it('חודשי - 12 רשומות', () => {
    const schedule = calculatePaymentSchedule(12_000, 8_000, 0, 'monthly');
    expect(schedule).toHaveLength(12);
  });

  it('סה"כ תשלומים = סכום שנתי', () => {
    const annualIT = 24_000;
    const annualSS = 18_000;
    const annualVat = 12_000;

    const schedule = calculatePaymentSchedule(annualIT, annualSS, annualVat, 'bimonthly');
    const totalFromSchedule = schedule.reduce((sum, e) => sum + e.total, 0);
    const expectedTotal = annualIT + annualSS + annualVat;
    expect(totalFromSchedule).toBeCloseTo(expectedTotal, 0);
  });

  it('פירוט בכל תשלום מסתכם לסכום התשלום', () => {
    const schedule = calculatePaymentSchedule(12_000, 8_000, 4_000, 'bimonthly');
    schedule.forEach((entry) => {
      const sumBreakdown = entry.incomeTax + entry.socialSecurity + entry.vat;
      expect(sumBreakdown).toBeCloseTo(entry.total, 0);
    });
  });

  it('ללא מע"מ - vat = 0 בכל תשלום', () => {
    const schedule = calculatePaymentSchedule(12_000, 8_000, 0, 'bimonthly');
    schedule.forEach((entry) => {
      expect(entry.vat).toBe(0);
    });
  });
});
