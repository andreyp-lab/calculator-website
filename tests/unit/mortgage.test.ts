import { describe, it, expect } from 'vitest';
import {
  calculateMortgage,
  calculateMultiTrackMortgage,
  calculateRefinancing,
  calculateEarlyPayoff,
  calculateAffordability,
  calculateWithInflation,
  getMaxLoanAmount,
  getRequiredEquity,
  BANK_OF_ISRAEL_PRIME_2026,
  AVG_INFLATION_ISRAEL,
} from '@/lib/calculators/mortgage';

// ============================================================
// calculateMortgage - שפיצר (בדיקות רגרסיה)
// ============================================================

describe('calculateMortgage - שפיצר', () => {
  it('משכנתא 1 מיליון ב-4.5% ל-25 שנים', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 4.5,
      termYears: 25,
      method: 'shpitzer',
    });

    // תשלום חודשי משוער ~5,558 ₪
    expect(result.monthlyPayment).toBeGreaterThan(5_400);
    expect(result.monthlyPayment).toBeLessThan(5_700);

    // 25 שנים × 12 = 300 תשלומים
    expect(result.schedule.length).toBe(300);

    // סך הריבית גדול מהקרן בריבית 4.5%
    expect(result.totalInterest).toBeGreaterThan(600_000);
    expect(result.totalInterest).toBeLessThan(700_000);
  });

  it('שפיצר - תשלום חודשי קבוע', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 4,
      termYears: 20,
      method: 'shpitzer',
    });

    expect(result.firstPayment).toBeCloseTo(result.lastPayment, 2);
  });

  it('ריבית 0% - תשלום שווה לחלוקת הקרן', () => {
    const result = calculateMortgage({
      loanAmount: 240_000,
      interestRate: 0,
      termYears: 20,
      method: 'shpitzer',
    });

    expect(result.monthlyPayment).toBeCloseTo(1000, 0); // 240,000 / 240
    expect(result.totalInterest).toBeCloseTo(0, 0);
  });

  it('סכום הקרן בלוח שווה לקרן המקורית', () => {
    const result = calculateMortgage({
      loanAmount: 500_000,
      interestRate: 5,
      termYears: 15,
      method: 'shpitzer',
    });

    const totalPrincipal = result.schedule.reduce((sum, m) => sum + m.principal, 0);
    expect(totalPrincipal).toBeCloseTo(500_000, -2);
  });

  it('yearly totals מכיל את מספר השנים הנכון', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 4,
      termYears: 20,
      method: 'shpitzer',
    });
    expect(result.yearlyTotals.length).toBe(20);
  });
});

// ============================================================
// calculateMortgage - קרן שווה
// ============================================================

describe('calculateMortgage - קרן שווה', () => {
  it('קרן שווה - תשלום קרן זהה כל חודש', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'equal-principal',
    });

    // קרן חודשית = 1,000,000 / 240 ≈ 4,166.67
    const expectedPrincipal = 1_000_000 / 240;
    result.schedule.forEach((entry) => {
      expect(entry.principal).toBeCloseTo(expectedPrincipal, 1);
    });
  });

  it('קרן שווה - תשלום ראשון > תשלום אחרון', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'equal-principal',
    });

    expect(result.firstPayment).toBeGreaterThan(result.lastPayment);
  });

  it('קרן שווה - סך ריבית קטן משפיצר', () => {
    const shpitzer = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'shpitzer',
    });
    const equalPrincipal = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'equal-principal',
    });

    expect(equalPrincipal.totalInterest).toBeLessThan(shpitzer.totalInterest);
  });
});

// ============================================================
// getMaxLoanAmount / getRequiredEquity
// ============================================================

describe('getMaxLoanAmount', () => {
  it('דירה ראשונה: 75% LTV', () => {
    expect(getMaxLoanAmount(2_000_000, 'first-home')).toBe(1_500_000);
  });

  it('מחליף דירה: 70% LTV', () => {
    expect(getMaxLoanAmount(2_000_000, 'home-replacement')).toBe(1_400_000);
  });

  it('משקיע: 50% LTV', () => {
    expect(getMaxLoanAmount(2_000_000, 'investor')).toBe(1_000_000);
  });
});

describe('getRequiredEquity', () => {
  it('דירה ראשונה: הון עצמי 25%', () => {
    expect(getRequiredEquity(2_000_000, 'first-home')).toBe(500_000);
  });

  it('משקיע: הון עצמי 50%', () => {
    expect(getRequiredEquity(2_000_000, 'investor')).toBe(1_000_000);
  });
});

// ============================================================
// Edge cases
// ============================================================

describe('Edge cases - calculateMortgage', () => {
  it('סכום שלילי מחזיר 0', () => {
    const result = calculateMortgage({
      loanAmount: -1000,
      interestRate: 5,
      termYears: 20,
      method: 'shpitzer',
    });
    expect(result.monthlyPayment).toBe(0);
  });

  it('תקופה 0 מחזיר 0', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 0,
      method: 'shpitzer',
    });
    expect(result.monthlyPayment).toBe(0);
  });

  it('ריבית 0 ותקופה 0 - אפס', () => {
    const result = calculateMortgage({
      loanAmount: 0,
      interestRate: 0,
      termYears: 0,
      method: 'shpitzer',
    });
    expect(result.monthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
  });
});

// ============================================================
// calculateMultiTrackMortgage - משכנתא מעורבת
// ============================================================

describe('calculateMultiTrackMortgage', () => {
  it('שלושה מסלולים - סכום חודשי = סכום כל מסלול בנפרד', () => {
    const prime = calculateMortgage({ loanAmount: 500_000, interestRate: 5.0, termYears: 25, method: 'shpitzer' });
    const kalatz = calculateMortgage({ loanAmount: 500_000, interestRate: 4.2, termYears: 25, method: 'shpitzer' });
    const linked = calculateMortgage({ loanAmount: 500_000, interestRate: 3.0, termYears: 25, method: 'shpitzer' });

    const expectedCombined = prime.firstPayment + kalatz.firstPayment + linked.firstPayment;

    const multiResult = calculateMultiTrackMortgage({
      tracks: [
        { id: '1', name: 'פריים', trackType: 'prime', amount: 500_000, interestRate: 5.0, termYears: 25, method: 'shpitzer' },
        { id: '2', name: 'קל"צ', trackType: 'fixed-unlinked', amount: 500_000, interestRate: 4.2, termYears: 25, method: 'shpitzer' },
        { id: '3', name: 'צמוד', trackType: 'fixed-linked', amount: 500_000, interestRate: 3.0, termYears: 25, method: 'shpitzer' },
      ],
    });

    expect(multiResult.combinedMonthlyPayment).toBeCloseTo(expectedCombined, 0);
  });

  it('סכום ההלוואות הכולל נכון', () => {
    const result = calculateMultiTrackMortgage({
      tracks: [
        { id: '1', name: 'א', trackType: 'prime', amount: 300_000, interestRate: 5.0, termYears: 20, method: 'shpitzer' },
        { id: '2', name: 'ב', trackType: 'fixed-unlinked', amount: 700_000, interestRate: 4.0, termYears: 20, method: 'shpitzer' },
      ],
    });
    expect(result.totalLoanAmount).toBe(1_000_000);
  });

  it('% מסלולים קבועים מחושב נכון', () => {
    const result = calculateMultiTrackMortgage({
      tracks: [
        { id: '1', name: 'פריים', trackType: 'prime', amount: 500_000, interestRate: 5.0, termYears: 20, method: 'shpitzer' },
        { id: '2', name: 'קל"צ', trackType: 'fixed-unlinked', amount: 500_000, interestRate: 4.0, termYears: 20, method: 'shpitzer' },
      ],
    });
    // 500K קבוע מתוך 1M = 50%
    expect(result.fixedTrackPercentage).toBeCloseTo(50, 1);
    expect(result.isRegulationCompliant).toBe(true);
  });

  it('לא עומד בתקנות בנק ישראל (פחות מ-33% קבוע)', () => {
    const result = calculateMultiTrackMortgage({
      tracks: [
        { id: '1', name: 'פריים', trackType: 'prime', amount: 800_000, interestRate: 5.0, termYears: 20, method: 'shpitzer' },
        { id: '2', name: 'קל"צ', trackType: 'fixed-unlinked', amount: 200_000, interestRate: 4.0, termYears: 20, method: 'shpitzer' },
      ],
    });
    expect(result.fixedTrackPercentage).toBeCloseTo(20, 1);
    expect(result.isRegulationCompliant).toBe(false);
  });

  it('מסלול יחיד - תוצאה זהה לחישוב בודד', () => {
    const single = calculateMortgage({ loanAmount: 1_000_000, interestRate: 4.5, termYears: 25, method: 'shpitzer' });
    const multi = calculateMultiTrackMortgage({
      tracks: [
        { id: '1', name: 'מסלול', trackType: 'prime', amount: 1_000_000, interestRate: 4.5, termYears: 25, method: 'shpitzer' },
      ],
    });
    expect(multi.combinedMonthlyPayment).toBeCloseTo(single.firstPayment, 0);
    expect(multi.totalInterest).toBeCloseTo(single.totalInterest, 0);
  });

  it('רשימת מסלולים ריקה מחזירה ערכי אפס', () => {
    const result = calculateMultiTrackMortgage({ tracks: [] });
    expect(result.totalLoanAmount).toBe(0);
    expect(result.combinedMonthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
  });

  it('shareOfTotal מסתכם ל-100%', () => {
    const result = calculateMultiTrackMortgage({
      tracks: [
        { id: '1', name: 'א', trackType: 'prime', amount: 400_000, interestRate: 5.0, termYears: 20, method: 'shpitzer' },
        { id: '2', name: 'ב', trackType: 'fixed-unlinked', amount: 600_000, interestRate: 4.0, termYears: 20, method: 'shpitzer' },
      ],
    });
    const total = result.tracks.reduce((s, t) => s + t.shareOfTotal, 0);
    expect(total).toBeCloseTo(100, 1);
  });
});

// ============================================================
// calculateRefinancing - מחזור
// ============================================================

describe('calculateRefinancing', () => {
  it('מחזור עם ריבית נמוכה יותר - חיסכון חיובי', () => {
    const result = calculateRefinancing({
      currentBalance: 800_000,
      currentRate: 5.5,
      currentMonthlyPayment: 6_500,
      monthsRemaining: 240,
      newRate: 4.0,
      refinancingFees: 8_000,
    });

    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.totalInterestSavings).toBeGreaterThan(0);
    expect(result.worthRefinancing).toBe(true);
  });

  it('מחזור עם ריבית גבוהה יותר - לא כדאי', () => {
    // ריבית חדשה גבוהה יותר מהנוכחית -> worthRefinancing = false
    const result = calculateRefinancing({
      currentBalance: 500_000,
      currentRate: 3.0,
      currentMonthlyPayment: 3_500,
      monthsRemaining: 180,
      newRate: 5.5,
      refinancingFees: 5_000,
    });

    expect(result.worthRefinancing).toBe(false);
  });

  it('נקודת האיזון גדולה מאפס', () => {
    const result = calculateRefinancing({
      currentBalance: 600_000,
      currentRate: 5.0,
      currentMonthlyPayment: 5_500,
      monthsRemaining: 200,
      newRate: 3.8,
      refinancingFees: 10_000,
    });

    expect(result.breakevenMonths).toBeGreaterThan(0);
    expect(result.breakevenMonths).toBeLessThan(200);
  });

  it('תשלום חדש קטן מהנוכחי כשריבית יורדת', () => {
    const result = calculateRefinancing({
      currentBalance: 1_000_000,
      currentRate: 6.0,
      currentMonthlyPayment: 8_000,
      monthsRemaining: 300,
      newRate: 4.0,
      refinancingFees: 12_000,
    });

    expect(result.newMonthlyPayment).toBeLessThan(8_000);
  });
});

// ============================================================
// calculateEarlyPayoff - פירעון מוקדם
// ============================================================

describe('calculateEarlyPayoff', () => {
  it('תשלום חד-פעמי מקצר את תקופת ההלוואה', () => {
    const result = calculateEarlyPayoff({
      currentBalance: 600_000,
      currentRate: 4.5,
      monthsRemaining: 240,
      method: 'shpitzer',
      lumpSum: 100_000,
      lumpSumInMonths: 0,
    });

    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.newMonthsRemaining).toBeLessThan(240);
  });

  it('תשלום נוסף חודשי חוסך ריבית', () => {
    const result = calculateEarlyPayoff({
      currentBalance: 500_000,
      currentRate: 4.0,
      monthsRemaining: 200,
      method: 'shpitzer',
      extraMonthlyPayment: 1_000,
    });

    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.newMonthsRemaining).toBeLessThan(200);
  });

  it('ללא תשלומים נוספים - אין חיסכון', () => {
    const result = calculateEarlyPayoff({
      currentBalance: 500_000,
      currentRate: 4.0,
      monthsRemaining: 200,
      method: 'shpitzer',
      lumpSum: 0,
      extraMonthlyPayment: 0,
    });

    expect(result.monthsSaved).toBe(0);
  });

  it('יתרת 0 מחזיר ערכי אפס', () => {
    const result = calculateEarlyPayoff({
      currentBalance: 0,
      currentRate: 4.0,
      monthsRemaining: 100,
      method: 'shpitzer',
    });
    expect(result.originalMonthlyPayment).toBe(0);
    expect(result.interestSaved).toBe(0);
  });
});

// ============================================================
// calculateAffordability - כושר החזר
// ============================================================

describe('calculateAffordability', () => {
  it('כושר החזר סביר - המלצה חיובית', () => {
    const result = calculateAffordability({
      monthlyNetIncome: 25_000,
      otherObligations: 2_000,
      propertyValue: 2_000_000,
      buyerType: 'first-home',
      termYears: 25,
      interestRate: 4.5,
    });

    expect(result.recommendedLoan).toBeGreaterThan(0);
    expect(result.maxComfortablePayment).toBeCloseTo(25_000 * 0.3, 0);
    expect(result.maxBankPayment).toBeCloseTo(25_000 * 0.4, 0);
  });

  it('30% מהכנסה = תשלום נוח מקסימלי', () => {
    const income = 20_000;
    const result = calculateAffordability({
      monthlyNetIncome: income,
      otherObligations: 0,
      propertyValue: 1_500_000,
      buyerType: 'first-home',
      termYears: 25,
      interestRate: 4.0,
    });

    expect(result.maxComfortablePayment).toBeCloseTo(income * 0.3, 0);
  });

  it('ריבית LTV מוגבלת לפי סוג רוכש', () => {
    const resultFirstHome = calculateAffordability({
      monthlyNetIncome: 20_000,
      otherObligations: 0,
      propertyValue: 2_000_000,
      buyerType: 'first-home',
      termYears: 25,
      interestRate: 4.5,
    });
    const resultInvestor = calculateAffordability({
      monthlyNetIncome: 20_000,
      otherObligations: 0,
      propertyValue: 2_000_000,
      buyerType: 'investor',
      termYears: 25,
      interestRate: 4.5,
    });

    // LTV משקיע (50%) < LTV דירה ראשונה (75%)
    expect(resultInvestor.maxAllowedByLtv).toBeLessThan(resultFirstHome.maxAllowedByLtv);
  });
});

// ============================================================
// calculateWithInflation - הצמדה למדד
// ============================================================

describe('calculateWithInflation', () => {
  it('עם אינפלציה - עלות כוללת גבוהה יותר מבלי הצמדה', () => {
    const result = calculateWithInflation({
      loanAmount: 500_000,
      nominalRate: 3.0,
      termYears: 25,
      inflationRate: AVG_INFLATION_ISRAEL,
    });

    expect(result.additionalCostFromInflation).toBeGreaterThan(0);
  });

  it('עם אינפלציה 0 - ללא עלות הצמדה נוספת', () => {
    const result = calculateWithInflation({
      loanAmount: 500_000,
      nominalRate: 3.0,
      termYears: 25,
      inflationRate: 0,
    });

    expect(result.additionalCostFromInflation).toBeCloseTo(0, -2);
  });

  it('מספר שנות breakdown שווה לתקופה', () => {
    const termYears = 20;
    const result = calculateWithInflation({
      loanAmount: 500_000,
      nominalRate: 3.0,
      termYears,
      inflationRate: 2.0,
    });

    expect(result.yearlyBreakdown.length).toBe(termYears);
  });

  it('CPI index גדל לאורך הזמן', () => {
    const result = calculateWithInflation({
      loanAmount: 500_000,
      nominalRate: 3.0,
      termYears: 10,
      inflationRate: 2.5,
    });

    const firstYear = result.yearlyBreakdown[0].cpiIndex;
    const lastYear = result.yearlyBreakdown[result.yearlyBreakdown.length - 1].cpiIndex;
    expect(lastYear).toBeGreaterThan(firstYear);
  });
});

// ============================================================
// קבועים
// ============================================================

describe('קבועים', () => {
  it('BANK_OF_ISRAEL_PRIME_2026 נכון', () => {
    expect(BANK_OF_ISRAEL_PRIME_2026).toBe(5.5);
  });

  it('AVG_INFLATION_ISRAEL נכון', () => {
    expect(AVG_INFLATION_ISRAEL).toBe(2.5);
  });
});
