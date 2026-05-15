import { describe, it, expect } from 'vitest';
import {
  calculatePersonalLoan,
  calculateAmortizationSchedulePersonalLoan,
  calculateTrueAPR,
  calculateSnowball,
  calculateAvalanche,
  compareDebtStrategies,
  compareCreditCardVsLoan,
  compareLoanSources,
  calculateAffordabilityPersonalLoan,
  getLoanSourceRecommendation,
  ISRAELI_LOAN_SOURCES_2026,
} from '@/lib/calculators/personal-loan';

// ============================================================
// calculatePersonalLoan - PMT בסיסי (backward compat)
// ============================================================

describe('calculatePersonalLoan - PMT בסיסי', () => {
  it('הלוואה 50,000 ₪ ב-5% ל-36 חודשים', () => {
    const r = calculatePersonalLoan({
      loanAmount: 50_000,
      annualInterestRate: 5,
      termMonths: 36,
      openingFee: 500,
    });
    expect(r.monthlyPayment).toBeCloseTo(1_499, 0);
    expect(r.totalInterest).toBeGreaterThan(3_000);
    expect(r.totalCostWithFees).toBeGreaterThan(r.totalPayments);
    expect(r.totalCostWithFees).toBeCloseTo(r.totalPayments + 500, 0);
  });

  it('ריבית 0% - תשלום = קרן / חודשים', () => {
    const r = calculatePersonalLoan({
      loanAmount: 12_000,
      annualInterestRate: 0,
      termMonths: 12,
    });
    expect(r.monthlyPayment).toBe(1_000);
    expect(r.totalInterest).toBe(0);
    expect(r.effectiveAnnualRate).toBeCloseTo(0, 1);
  });

  it('עמלות מייקרות את ה-APR האפקטיבי', () => {
    const without = calculatePersonalLoan({
      loanAmount: 50_000,
      annualInterestRate: 8,
      termMonths: 36,
    });
    const withFee = calculatePersonalLoan({
      loanAmount: 50_000,
      annualInterestRate: 8,
      termMonths: 36,
      openingFee: 1_000,
    });
    expect(withFee.effectiveAnnualRate).toBeGreaterThan(without.effectiveAnnualRate);
  });

  it('קלט אפס - מחזיר ריבית אפס', () => {
    const r = calculatePersonalLoan({ loanAmount: 0, annualInterestRate: 7, termMonths: 24 });
    expect(r.monthlyPayment).toBe(0);
    expect(r.totalInterest).toBe(0);
  });

  it('שנה ראשונה: ריבית + קרן = תשלום חודשי × 12', () => {
    const r = calculatePersonalLoan({
      loanAmount: 60_000,
      annualInterestRate: 9,
      termMonths: 60,
    });
    const year1Total = r.amortizationSummary.interestFirstYear + r.amortizationSummary.principalFirstYear;
    expect(year1Total).toBeCloseTo(r.monthlyPayment * 12, 0);
  });
});

// ============================================================
// calculateAmortizationSchedulePersonalLoan
// ============================================================

describe('calculateAmortizationSchedulePersonalLoan', () => {
  it('מחזיר מספר שורות נכון', () => {
    const rows = calculateAmortizationSchedulePersonalLoan({
      loanAmount: 40_000,
      annualRate: 7,
      termMonths: 24,
    });
    expect(rows.length).toBe(24);
  });

  it('יתרה בסוף קרובה לאפס', () => {
    const rows = calculateAmortizationSchedulePersonalLoan({
      loanAmount: 80_000,
      annualRate: 6,
      termMonths: 48,
    });
    expect(rows[rows.length - 1].balance).toBeCloseTo(0, 0);
  });

  it('ריבית בחודש ראשון גבוהה יותר מהאחרון (שפיצר)', () => {
    const rows = calculateAmortizationSchedulePersonalLoan({
      loanAmount: 50_000,
      annualRate: 8,
      termMonths: 36,
    });
    expect(rows[0].interest).toBeGreaterThan(rows[rows.length - 1].interest);
    expect(rows[0].principal).toBeLessThan(rows[rows.length - 1].principal);
  });

  it('קרן מצטברת שווה לסכום ההלוואה בסוף', () => {
    const rows = calculateAmortizationSchedulePersonalLoan({
      loanAmount: 30_000,
      annualRate: 5,
      termMonths: 12,
    });
    expect(rows[rows.length - 1].cumulativePrincipal).toBeCloseTo(30_000, 0);
  });

  it('סכום אפס - מחזיר מערך ריק', () => {
    const rows = calculateAmortizationSchedulePersonalLoan({
      loanAmount: 0,
      annualRate: 5,
      termMonths: 12,
    });
    expect(rows.length).toBe(0);
  });
});

// ============================================================
// calculateTrueAPR
// ============================================================

describe('calculateTrueAPR', () => {
  it('ללא עמלות - APR שווה לריבית נומינלית', () => {
    const r = calculateTrueAPR({
      loanAmount: 50_000,
      annualRate: 8,
      termMonths: 36,
    });
    expect(r.trueAPR).toBeCloseTo(8, 1);
    expect(r.totalFees).toBe(0);
    expect(r.trueMonthlyPayment).toBeCloseTo(r.statedMonthlyPayment, 0);
  });

  it('עמלת פתיחת תיק מייקרת את ה-APR', () => {
    const r = calculateTrueAPR({
      loanAmount: 50_000,
      annualRate: 8,
      termMonths: 36,
      openingFee: 1_000,
    });
    expect(r.trueAPR).toBeGreaterThan(8);
    expect(r.totalFees).toBe(1_000);
  });

  it('דמי ניהול חודשי מגדילים תשלום אמיתי', () => {
    const r = calculateTrueAPR({
      loanAmount: 60_000,
      annualRate: 7,
      termMonths: 24,
      monthlyServiceFee: 30,
      mandatoryInsurance: 40,
    });
    expect(r.trueMonthlyPayment).toBeGreaterThan(r.statedMonthlyPayment);
    expect(r.feeBreakdown.monthlyServiceFeeTotal).toBeCloseTo(30 * 24, 0);
    expect(r.feeBreakdown.mandatoryInsuranceTotal).toBeCloseTo(40 * 24, 0);
  });

  it('סך עמלות = פתיחה + ניהול × חודשים + ביטוח × חודשים + אחר', () => {
    const r = calculateTrueAPR({
      loanAmount: 50_000,
      annualRate: 8,
      termMonths: 12,
      openingFee: 500,
      monthlyServiceFee: 20,
      mandatoryInsurance: 30,
      otherFees: 100,
    });
    const expected = 500 + 20 * 12 + 30 * 12 + 100;
    expect(r.totalFees).toBeCloseTo(expected, 0);
  });
});

// ============================================================
// calculateSnowball / calculateAvalanche
// ============================================================

describe('calculateSnowball', () => {
  const debts = [
    { id: '1', name: 'כרטיס קטן', balance: 3_000, annualRate: 18, minimumPayment: 100 },
    { id: '2', name: 'הלוואה גדולה', balance: 20_000, annualRate: 9, minimumPayment: 500 },
    { id: '3', name: 'אוברדרפט', balance: 8_000, annualRate: 13, minimumPayment: 200 },
  ];

  it('Snowball מסיים את החוב הקטן ביותר ראשון', () => {
    const r = calculateSnowball(debts, 300);
    // כרטיס קטן (3,000) אמור להיות ראשון
    expect(r.payoffOrder[0].id).toBe('1');
  });

  it('Snowball מסיים את כל החובות', () => {
    const r = calculateSnowball(debts, 300);
    expect(r.payoffOrder.length).toBe(3);
    expect(r.totalMonths).toBeGreaterThan(0);
    expect(r.totalMonths).toBeLessThan(600);
  });

  it('תשלום נוסף גדול יותר = פחות חודשים', () => {
    const r1 = calculateSnowball(debts, 0);
    const r2 = calculateSnowball(debts, 1_000);
    expect(r2.totalMonths).toBeLessThan(r1.totalMonths);
    expect(r2.totalInterest).toBeLessThan(r1.totalInterest);
  });

  it('חובות ריקים - מחזיר אפסים', () => {
    const r = calculateSnowball([], 500);
    expect(r.totalMonths).toBe(0);
    expect(r.totalInterest).toBe(0);
  });
});

describe('calculateAvalanche', () => {
  const debts = [
    { id: '1', name: 'כרטיס', balance: 5_000, annualRate: 20, minimumPayment: 150 },
    { id: '2', name: 'הלוואה', balance: 30_000, annualRate: 7, minimumPayment: 700 },
    { id: '3', name: 'אוברדרפט', balance: 10_000, annualRate: 13, minimumPayment: 250 },
  ];

  it('Avalanche מסיים את החוב בריבית הגבוהה ביותר ראשון', () => {
    const r = calculateAvalanche(debts, 300);
    // כרטיס 20% אמור להיות ראשון
    expect(r.payoffOrder[0].id).toBe('1');
  });

  it('Avalanche חוסך יותר ריבית מ-Snowball על חובות גדולים בריבית גבוהה', () => {
    const heavyDebts = [
      { id: '1', name: 'קטן, ריבית נמוכה', balance: 2_000, annualRate: 5, minimumPayment: 80 },
      { id: '2', name: 'גדול, ריבית גבוהה', balance: 25_000, annualRate: 18, minimumPayment: 600 },
    ];
    const snow = calculateSnowball(heavyDebts, 200);
    const aval = calculateAvalanche(heavyDebts, 200);
    // Avalanche חייב לחסוך ריבית כשיש הבדל גדול בריביות ובסכומים
    expect(aval.totalInterest).toBeLessThanOrEqual(snow.totalInterest);
  });
});

describe('compareDebtStrategies', () => {
  it('מחזיר שתי אסטרטגיות עם חיסכון', () => {
    const debts = [
      { id: '1', name: 'כרטיס', balance: 8_000, annualRate: 18, minimumPayment: 200 },
      { id: '2', name: 'הלוואה', balance: 25_000, annualRate: 9, minimumPayment: 600 },
    ];
    const cmp = compareDebtStrategies(debts, 500);
    expect(cmp.snowball.strategy).toBe('snowball');
    expect(cmp.avalanche.strategy).toBe('avalanche');
    expect(cmp.avalancheSaves).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================
// compareCreditCardVsLoan
// ============================================================

describe('compareCreditCardVsLoan', () => {
  it('הלוואה זולה יותר מכרטיס אשראי', () => {
    const r = compareCreditCardVsLoan({
      debtAmount: 20_000,
      creditCardRate: 16,
      personalLoanRate: 8,
      termMonths: 36,
    });
    expect(r.savingsByLoan).toBeGreaterThan(0);
    expect(r.personalLoan.totalInterest).toBeLessThan(r.creditCard.totalInterest);
  });

  it('ריביות שוות - חיסכון אפס (למעט עמלה)', () => {
    const r = compareCreditCardVsLoan({
      debtAmount: 10_000,
      creditCardRate: 10,
      personalLoanRate: 10,
      termMonths: 24,
      personalLoanOpeningFee: 0,
    });
    expect(r.savingsByLoan).toBeCloseTo(0, 0);
    expect(r.personalLoan.totalInterest).toBeCloseTo(r.creditCard.totalInterest, 0);
  });

  it('עמלת פתיחה נלקחת בחשבון בעלות כוללת', () => {
    const noFee = compareCreditCardVsLoan({
      debtAmount: 20_000,
      creditCardRate: 16,
      personalLoanRate: 8,
      termMonths: 36,
      personalLoanOpeningFee: 0,
    });
    const withFee = compareCreditCardVsLoan({
      debtAmount: 20_000,
      creditCardRate: 16,
      personalLoanRate: 8,
      termMonths: 36,
      personalLoanOpeningFee: 1_000,
    });
    expect(withFee.personalLoan.totalCostWithFees).toBeGreaterThan(
      noFee.personalLoan.totalCostWithFees,
    );
    expect(withFee.savingsByLoan).toBeLessThan(noFee.savingsByLoan);
  });

  it('חוב אפס - מחזיר אפסים', () => {
    const r = compareCreditCardVsLoan({
      debtAmount: 0,
      creditCardRate: 16,
      personalLoanRate: 8,
      termMonths: 24,
    });
    expect(r.creditCard.totalPayments).toBe(0);
    expect(r.personalLoan.totalPayments).toBe(0);
  });

  it('נקודת איזון חיובית כשיש עמלה', () => {
    const r = compareCreditCardVsLoan({
      debtAmount: 30_000,
      creditCardRate: 16,
      personalLoanRate: 7,
      termMonths: 48,
      personalLoanOpeningFee: 600,
    });
    expect(r.breakEvenMonths).toBeGreaterThan(0);
  });
});

// ============================================================
// compareLoanSources
// ============================================================

describe('compareLoanSources', () => {
  it('מחזיר 6 מקורות', () => {
    const results = compareLoanSources(50_000, 36);
    expect(results.length).toBe(6);
  });

  it('ממוין מהזול ליקר', () => {
    const results = compareLoanSources(50_000, 36);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].totalInterest).toBeGreaterThanOrEqual(results[i - 1].totalInterest);
    }
  });

  it('קרן השתלמות / משפחה הם הזולים ביותר (ריבית ממוצעת נמוכה)', () => {
    const results = compareLoanSources(50_000, 36);
    // Family loan (0-3% avg=1.5) and study-fund (1.5-4.5% avg=3) are the cheapest
    const top2ids = results.slice(0, 2).map((r) => r.source.id);
    expect(top2ids).toContain('study-fund');
    expect(results[0].totalInterest).toBeLessThan(results[2].totalInterest);
  });

  it('כרטיס אשראי הוא היקר ביותר', () => {
    const results = compareLoanSources(50_000, 36);
    const last = results[results.length - 1];
    expect(last.source.id).toBe('credit-card-advance');
  });

  it('תשלום חודשי חיובי', () => {
    const results = compareLoanSources(30_000, 24);
    for (const r of results) {
      expect(r.monthlyPayment).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// calculateAffordabilityPersonalLoan
// ============================================================

describe('calculateAffordabilityPersonalLoan', () => {
  it('DTI מתחת ל-25% = מצוין', () => {
    const r = calculateAffordabilityPersonalLoan({
      monthlyNetIncome: 20_000,
      existingObligations: 1_000,
      requestedMonthlyPayment: 2_000, // סך = 3000 = 15%
    });
    expect(r.status).toBe('excellent');
    expect(r.dtiRatio).toBeLessThan(25);
  });

  it('DTI 25-35% = טוב', () => {
    const r = calculateAffordabilityPersonalLoan({
      monthlyNetIncome: 15_000,
      existingObligations: 2_000,
      requestedMonthlyPayment: 2_500, // סך = 4500 = 30%
    });
    expect(r.status).toBe('good');
    expect(r.dtiRatio).toBeGreaterThanOrEqual(25);
    expect(r.dtiRatio).toBeLessThan(35);
  });

  it('DTI 35-50% = אזהרה', () => {
    const r = calculateAffordabilityPersonalLoan({
      monthlyNetIncome: 12_000,
      existingObligations: 2_000,
      requestedMonthlyPayment: 3_000, // סך = 5000 = 41.7%
    });
    expect(r.status).toBe('warning');
    expect(r.dtiRatio).toBeGreaterThanOrEqual(35);
    expect(r.dtiRatio).toBeLessThan(50);
  });

  it('DTI מעל 50% = סכנה', () => {
    const r = calculateAffordabilityPersonalLoan({
      monthlyNetIncome: 10_000,
      existingObligations: 3_000,
      requestedMonthlyPayment: 4_000, // סך = 7000 = 70%
    });
    expect(r.status).toBe('danger');
    expect(r.dtiRatio).toBeGreaterThan(50);
  });

  it('תשלום מקסימלי מומלץ = 35% מהכנסה פחות התחייבויות קיימות', () => {
    const r = calculateAffordabilityPersonalLoan({
      monthlyNetIncome: 16_000,
      existingObligations: 2_000,
      requestedMonthlyPayment: 500,
    });
    // 16000 × 0.35 - 2000 = 3600
    expect(r.maxRecommendedPayment).toBeCloseTo(3_600, 0);
  });

  it('פנוי לאחר הכל מחושב נכון', () => {
    const r = calculateAffordabilityPersonalLoan({
      monthlyNetIncome: 18_000,
      existingObligations: 3_000,
      requestedMonthlyPayment: 2_000,
    });
    expect(r.disposableAfterLoan).toBeCloseTo(18_000 - 3_000 - 2_000, 0);
  });
});

// ============================================================
// ISRAELI_LOAN_SOURCES_2026 & getLoanSourceRecommendation
// ============================================================

describe('ISRAELI_LOAN_SOURCES_2026', () => {
  it('מכיל 6 מקורות הלוואה', () => {
    expect(ISRAELI_LOAN_SOURCES_2026.length).toBe(6);
  });

  it('קרן השתלמות - ריבית מינימלית נמוכה מ-5%', () => {
    const sf = ISRAELI_LOAN_SOURCES_2026.find((s) => s.id === 'study-fund');
    expect(sf).toBeDefined();
    expect(sf!.typicalRateMin).toBeLessThan(5);
  });

  it('כרטיס אשראי - ריבית מקסימלית מעל 18%', () => {
    const cc = ISRAELI_LOAN_SOURCES_2026.find((s) => s.id === 'credit-card-advance');
    expect(cc).toBeDefined();
    expect(cc!.typicalRateMax).toBeGreaterThanOrEqual(18);
  });

  it('לכל מקור יש יתרונות וחסרונות', () => {
    for (const source of ISRAELI_LOAN_SOURCES_2026) {
      expect(source.pros.length).toBeGreaterThan(0);
      expect(source.cons.length).toBeGreaterThan(0);
    }
  });
});

describe('getLoanSourceRecommendation', () => {
  it('ריבית מעל 14% - ממליץ לבדוק קרן השתלמות', () => {
    const rec = getLoanSourceRecommendation(15);
    expect(rec).toContain('קרן השתלמות');
  });

  it('ריבית 10-14% - ממליץ לפנות לבנק', () => {
    const rec = getLoanSourceRecommendation(11);
    expect(rec.length).toBeGreaterThan(0);
  });

  it('ריבית מתחת ל-7% - ממליץ לבדוק APR', () => {
    const rec = getLoanSourceRecommendation(5);
    expect(rec).toContain('APR');
  });

  it('ריבית 7-10% - מחזיר המלצה כלשהי', () => {
    const rec = getLoanSourceRecommendation(8);
    expect(rec.length).toBeGreaterThan(0);
  });
});
