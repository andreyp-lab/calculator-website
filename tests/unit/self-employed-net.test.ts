import { describe, it, expect } from 'vitest';
import { calculateSelfEmployedNet } from '@/lib/calculators/self-employed-net';

describe('calculateSelfEmployedNet', () => {
  it('עוסק מורשה ממוצע - 20K חודשי + 3K הוצאות', () => {
    const r = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'monthly',
      revenue: 20_000,
      recognizedExpenses: 3_000,
      creditPoints: 2.25,
      monthlyPensionDeposit: 1_000,
      monthlyStudyFundDeposit: 500,
    });

    expect(r.annualRevenue).toBe(240_000);
    expect(r.annualExpenses).toBe(36_000);
    expect(r.initialTaxableIncome).toBe(204_000);
    expect(r.annualVat).toBeCloseTo(43_200, 0); // 18%
    expect(r.monthlyNet).toBeGreaterThan(0);
    expect(r.monthlyNet).toBeLessThan(20_000); // נטו תמיד פחות מהמחזור
  });

  it('עוסק פטור ללא מע"מ', () => {
    const r = calculateSelfEmployedNet({
      businessType: 'exempt',
      inputPeriod: 'monthly',
      revenue: 8_000,
      recognizedExpenses: 1_000,
      creditPoints: 2.25,
      monthlyPensionDeposit: 0,
      monthlyStudyFundDeposit: 0,
    });

    expect(r.annualVat).toBe(0); // עוסק פטור = אין מע"מ
    expect(r.annualRevenue).toBe(96_000);
  });

  it('הזנה שנתית שווה להזנה חודשית × 12', () => {
    const monthly = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'monthly',
      revenue: 15_000,
      recognizedExpenses: 2_000,
      creditPoints: 2.25,
      monthlyPensionDeposit: 500,
      monthlyStudyFundDeposit: 0,
    });

    const annual = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'annual',
      revenue: 180_000,
      recognizedExpenses: 24_000,
      creditPoints: 2.25,
      monthlyPensionDeposit: 500,
      monthlyStudyFundDeposit: 0,
    });

    expect(annual.annualNet).toBeCloseTo(monthly.annualNet, 0);
    expect(annual.netIncomeTax).toBeCloseTo(monthly.netIncomeTax, 0);
  });

  it('הכנסה גבוהה - מדרגות מס גבוהות', () => {
    const r = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'annual',
      revenue: 600_000,
      recognizedExpenses: 100_000,
      creditPoints: 2.25,
      monthlyPensionDeposit: 0,
      monthlyStudyFundDeposit: 0,
    });

    // הכנסה חייבת ראשונית: 500,000 - מגיע למדרגה 35%
    expect(r.initialTaxableIncome).toBe(500_000);
    expect(r.effectiveTaxRate).toBeGreaterThan(0.25);
    expect(r.effectiveTaxRate).toBeLessThan(0.5);
  });

  it('הפקדה לפנסיה מקטינה מס', () => {
    const without = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'annual',
      revenue: 200_000,
      recognizedExpenses: 0,
      creditPoints: 2.25,
      monthlyPensionDeposit: 0,
      monthlyStudyFundDeposit: 0,
    });

    const withPension = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'annual',
      revenue: 200_000,
      recognizedExpenses: 0,
      creditPoints: 2.25,
      monthlyPensionDeposit: 1_500, // 18,000 שנתי
      monthlyStudyFundDeposit: 0,
    });

    expect(withPension.netIncomeTax).toBeLessThan(without.netIncomeTax);
    expect(withPension.pensionDeduction).toBeGreaterThan(0);
  });

  it('הכנסה אפס - הכל אפס', () => {
    const r = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'monthly',
      revenue: 0,
      recognizedExpenses: 0,
      creditPoints: 2.25,
      monthlyPensionDeposit: 0,
      monthlyStudyFundDeposit: 0,
    });

    expect(r.annualRevenue).toBe(0);
    expect(r.netIncomeTax).toBe(0);
    expect(r.bituachLeumi).toBe(0);
    expect(r.annualNet).toBe(0);
  });

  it('breakdown מכיל את כל המרכיבים', () => {
    const r = calculateSelfEmployedNet({
      businessType: 'authorized',
      inputPeriod: 'monthly',
      revenue: 20_000,
      recognizedExpenses: 3_000,
      creditPoints: 2.25,
      monthlyPensionDeposit: 500,
      monthlyStudyFundDeposit: 500,
    });

    expect(r.breakdown).toHaveLength(7);
    expect(r.breakdown[0].label).toBe('מחזור');
    expect(r.breakdown[r.breakdown.length - 1].label).toBe('נטו שנתי ביד');
    expect(r.breakdown[r.breakdown.length - 1].value).toBe(r.annualNet);
  });
});
