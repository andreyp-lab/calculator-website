import { describe, it, expect } from 'vitest';
import {
  calculateLoanRepayment,
  calculateAmortizationSchedule,
  calculateTrueAPR,
  compareLoans,
  calculateDebtConsolidation,
  calculateEarlyPayoffLoan,
  calculateAffordabilityLoan,
  getLoanTypeRecommendation,
  ISRAELI_LOAN_TYPES,
} from '@/lib/calculators/savings';

// ============================================================
// calculateLoanRepayment - בדיקות בסיסיות
// ============================================================

describe('calculateLoanRepayment - PMT בסיסי', () => {
  it('הלוואה 100,000 ₪ ב-6% ל-60 חודשים', () => {
    const result = calculateLoanRepayment({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      extraMonthlyPayment: 0,
      oneTimePayment: 0,
    });

    // PMT = 100000 × 0.005 × (1.005^60) / (1.005^60 - 1) ≈ 1,933
    expect(result.monthlyPayment).toBeGreaterThan(1_900);
    expect(result.monthlyPayment).toBeLessThan(1_970);
    expect(result.totalInterest).toBeGreaterThan(15_000);
    expect(result.totalInterest).toBeLessThan(20_000);
    expect(result.totalPayments).toBeCloseTo(result.monthlyPayment * 60, 0);
  });

  it('ריבית 0% - תשלום שווה לחלוקת הקרן', () => {
    const result = calculateLoanRepayment({
      loanAmount: 60_000,
      annualRate: 0,
      termMonths: 60,
      extraMonthlyPayment: 0,
      oneTimePayment: 0,
    });

    expect(result.monthlyPayment).toBeCloseTo(1_000, 0);
    expect(result.totalInterest).toBeCloseTo(0, 0);
  });

  it('קלט אפס - מחזיר אפסים', () => {
    const result = calculateLoanRepayment({
      loanAmount: 0,
      annualRate: 5,
      termMonths: 60,
      extraMonthlyPayment: 0,
      oneTimePayment: 0,
    });

    expect(result.monthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
  });
});

describe('calculateLoanRepayment - סילוק מואץ', () => {
  it('תשלום נוסף חודשי מקצר את התקופה', () => {
    const base = calculateLoanRepayment({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      extraMonthlyPayment: 0,
      oneTimePayment: 0,
    });

    const accelerated = calculateLoanRepayment({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      extraMonthlyPayment: 300,
      oneTimePayment: 0,
    });

    expect(accelerated.monthsSaved).toBeGreaterThan(0);
    expect(accelerated.interestSaved).toBeGreaterThan(0);
    expect(accelerated.acceleratedTermMonths).toBeLessThan(60);
    expect(accelerated.acceleratedTotalInterest).toBeLessThan(base.totalInterest);
  });

  it('תשלום חד-פעמי מקצר את התקופה', () => {
    const result = calculateLoanRepayment({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      extraMonthlyPayment: 0,
      oneTimePayment: 10_000,
    });

    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.interestSaved).toBeGreaterThan(0);
  });
});

// ============================================================
// calculateAmortizationSchedule - לוח סילוקין
// ============================================================

describe('calculateAmortizationSchedule', () => {
  it('מחזיר מספר שורות נכון', () => {
    const rows = calculateAmortizationSchedule({
      loanAmount: 50_000,
      annualRate: 5,
      termMonths: 36,
    });

    expect(rows.length).toBe(36);
  });

  it('יתרה בסוף קרובה לאפס', () => {
    const rows = calculateAmortizationSchedule({
      loanAmount: 100_000,
      annualRate: 7,
      termMonths: 60,
    });

    expect(rows[rows.length - 1].balance).toBeCloseTo(0, 0);
  });

  it('ריבית מצטברת עולה בכל חודש', () => {
    const rows = calculateAmortizationSchedule({
      loanAmount: 80_000,
      annualRate: 5,
      termMonths: 24,
    });

    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].cumulativeInterest).toBeGreaterThan(rows[i - 1].cumulativeInterest);
    }
  });

  it('קרן חודשית עולה לאורך הזמן (שפיצר)', () => {
    const rows = calculateAmortizationSchedule({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
    });

    // בתשלום הראשון - יותר ריבית מאשר בתשלום האחרון
    expect(rows[0].interest).toBeGreaterThan(rows[rows.length - 1].interest);
    expect(rows[0].principal).toBeLessThan(rows[rows.length - 1].principal);
  });

  it('קלט ריק - מחזיר מערך ריק', () => {
    const rows = calculateAmortizationSchedule({
      loanAmount: 0,
      annualRate: 5,
      termMonths: 12,
    });

    expect(rows.length).toBe(0);
  });
});

// ============================================================
// calculateTrueAPR - APR אמיתי
// ============================================================

describe('calculateTrueAPR', () => {
  it('ללא עמלות - APR שווה לריבית נומינלית', () => {
    const result = calculateTrueAPR({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      openingFee: 0,
      monthlyServiceFee: 0,
      mandatoryInsurance: 0,
      otherFees: 0,
    });

    expect(result.trueAPR).toBeCloseTo(6, 1);
    expect(result.totalFees).toBe(0);
  });

  it('עם עמלת פתיחה - APR גבוה יותר', () => {
    const result = calculateTrueAPR({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      openingFee: 1_500,
      monthlyServiceFee: 0,
      mandatoryInsurance: 0,
      otherFees: 0,
    });

    expect(result.trueAPR).toBeGreaterThan(6);
    expect(result.totalFees).toBe(1_500);
  });

  it('עם דמי ניהול חודשיים - APR גבוה יותר', () => {
    const result = calculateTrueAPR({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      openingFee: 0,
      monthlyServiceFee: 30,
      mandatoryInsurance: 20,
      otherFees: 0,
    });

    expect(result.trueAPR).toBeGreaterThan(6);
    expect(result.trueMonthlyPayment).toBeGreaterThan(result.statedMonthlyPayment);
    expect(result.totalFees).toBeCloseTo(50 * 60, 0); // 50 ₪/חודש × 60
  });
});

// ============================================================
// compareLoans - השוואת הצעות
// ============================================================

describe('compareLoans', () => {
  it('דירוג נכון לפי עלות כוללת', () => {
    const results = compareLoans([
      { id: '1', name: 'הצעה יקרה', loanAmount: 50_000, annualRate: 8, termMonths: 36 },
      { id: '2', name: 'הצעה זולה', loanAmount: 50_000, annualRate: 5, termMonths: 36 },
      { id: '3', name: 'הצעה בינונית', loanAmount: 50_000, annualRate: 6.5, termMonths: 36 },
    ]);

    // הראשון ברשימה אמור להיות הזול ביותר
    expect(results[0].name).toBe('הצעה זולה');
    expect(results[0].rank).toBe(1);
    expect(results[results.length - 1].rank).toBe(results.length);
  });

  it('תשלום חודשי נמוך יותר עם ריבית נמוכה', () => {
    const results = compareLoans([
      { id: 'a', name: 'A', loanAmount: 50_000, annualRate: 5, termMonths: 60 },
      { id: 'b', name: 'B', loanAmount: 50_000, annualRate: 10, termMonths: 60 },
    ]);

    const a = results.find((r) => r.id === 'a')!;
    const b = results.find((r) => r.id === 'b')!;
    expect(a.monthlyPayment).toBeLessThan(b.monthlyPayment);
    expect(a.totalInterest).toBeLessThan(b.totalInterest);
  });

  it('עמלת פתיחה נלקחת בחשבון בעלות הכוללת', () => {
    const results = compareLoans([
      { id: '1', name: 'ריבית נמוכה, עמלה גבוהה', loanAmount: 50_000, annualRate: 4, termMonths: 24, openingFee: 5_000 },
      { id: '2', name: 'ריבית גבוהה, ללא עמלה', loanAmount: 50_000, annualRate: 6, termMonths: 24, openingFee: 0 },
    ]);

    // עם עמלה גבוהה של 5000 ₪, ריבית נמוכה לא בהכרח עדיפה
    expect(results[0].totalCost).toBeLessThanOrEqual(results[1].totalCost);
  });

  it('מחזיר מערך ריק אם אין הצעות', () => {
    const results = compareLoans([]);
    expect(results.length).toBe(0);
  });
});

// ============================================================
// calculateDebtConsolidation - איחוד הלוואות
// ============================================================

describe('calculateDebtConsolidation', () => {
  it('איחוד עם ריבית נמוכה משתלם', () => {
    const result = calculateDebtConsolidation({
      existingLoans: [
        { id: '1', name: 'כרטיס אשראי', remainingBalance: 20_000, annualRate: 16, remainingMonths: 24 },
        { id: '2', name: 'אוברדרפט', remainingBalance: 10_000, annualRate: 12, remainingMonths: 12 },
      ],
      consolidationRate: 6,
      consolidationTermMonths: 36,
    });

    expect(result.recommended).toBe(true);
    expect(result.totalSavings).toBeGreaterThan(0);
    expect(result.weightedAverageRate).toBeGreaterThan(6); // ממוצע גבוה מריבית האיחוד
  });

  it('איחוד עם ריבית גבוהה לא משתלם', () => {
    const result = calculateDebtConsolidation({
      existingLoans: [
        { id: '1', name: 'הלוואה זולה', remainingBalance: 50_000, annualRate: 4, remainingMonths: 36 },
      ],
      consolidationRate: 8,
      consolidationTermMonths: 36,
    });

    expect(result.recommended).toBe(false);
  });

  it('חישוב ריבית ממוצעת משוקללת', () => {
    const result = calculateDebtConsolidation({
      existingLoans: [
        { id: '1', name: 'הלוואה גדולה', remainingBalance: 80_000, annualRate: 6, remainingMonths: 36 },
        { id: '2', name: 'הלוואה קטנה', remainingBalance: 20_000, annualRate: 10, remainingMonths: 36 },
      ],
      consolidationRate: 5,
      consolidationTermMonths: 36,
    });

    // ממוצע משוקלל: (80000×6 + 20000×10) / 100000 = 6.8%
    expect(result.weightedAverageRate).toBeCloseTo(6.8, 1);
    expect(result.totalBalance).toBe(100_000);
  });

  it('רשימה ריקה - מחזיר ערכי אפס', () => {
    const result = calculateDebtConsolidation({
      existingLoans: [],
      consolidationRate: 6,
      consolidationTermMonths: 36,
    });

    expect(result.totalBalance).toBe(0);
    expect(result.recommended).toBe(false);
  });
});

// ============================================================
// calculateEarlyPayoffLoan - פירעון מוקדם
// ============================================================

describe('calculateEarlyPayoffLoan', () => {
  it('תשלום חד-פעמי מקצר תקופה וחוסך ריבית', () => {
    const result = calculateEarlyPayoffLoan({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      monthsElapsed: 12,
      lumpSumPayment: 15_000,
      extraMonthlyPayment: 0,
    });

    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.newRemainingMonths).toBeLessThan(result.remainingMonthsOriginal);
  });

  it('תשלום חודשי נוסף מקצר תקופה', () => {
    const result = calculateEarlyPayoffLoan({
      loanAmount: 80_000,
      annualRate: 7,
      termMonths: 48,
      monthsElapsed: 6,
      lumpSumPayment: 0,
      extraMonthlyPayment: 400,
    });

    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.netSavings).toBeGreaterThan(0);
  });

  it('קנס פירעון מוקדם מפחית את החיסכון הנטו', () => {
    const withoutPenalty = calculateEarlyPayoffLoan({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      monthsElapsed: 12,
      lumpSumPayment: 20_000,
      earlyPayoffPenaltyPct: 0,
    });

    const withPenalty = calculateEarlyPayoffLoan({
      loanAmount: 100_000,
      annualRate: 6,
      termMonths: 60,
      monthsElapsed: 12,
      lumpSumPayment: 20_000,
      earlyPayoffPenaltyPct: 2,
    });

    expect(withPenalty.penaltyAmount).toBeGreaterThan(0);
    expect(withPenalty.netSavings).toBeLessThan(withoutPenalty.netSavings);
  });

  it('יתרה מחושבת נכון לאחר חודשים ששולמו', () => {
    // הלוואה של 60,000 ₪ ב-0% ל-60 חודשים: תשלום 1,000 ₪/חודש
    // לאחר 12 חודשים: יתרה 48,000 ₪
    const result = calculateEarlyPayoffLoan({
      loanAmount: 60_000,
      annualRate: 0,
      termMonths: 60,
      monthsElapsed: 12,
      lumpSumPayment: 0,
    });

    expect(result.currentBalance).toBeCloseTo(48_000, 0);
  });

  it('מחזיר תאריך סיום בפורמט YYYY-MM', () => {
    const result = calculateEarlyPayoffLoan({
      loanAmount: 50_000,
      annualRate: 5,
      termMonths: 36,
      monthsElapsed: 6,
      lumpSumPayment: 5_000,
    });

    expect(result.newPayoffDate).toMatch(/^\d{4}-\d{2}$/);
  });
});

// ============================================================
// calculateAffordabilityLoan - כושר החזר
// ============================================================

describe('calculateAffordabilityLoan', () => {
  it('DTI מתחת ל-30% = מצוין', () => {
    const result = calculateAffordabilityLoan({
      monthlyNetIncome: 20_000,
      existingObligations: 1_000,
      requestedMonthlyPayment: 2_000, // = 15% מההכנסה
    });

    expect(result.status).toBe('excellent');
    expect(result.dtiRatio).toBeLessThan(30);
  });

  it('DTI 30-40% = טוב', () => {
    const result = calculateAffordabilityLoan({
      monthlyNetIncome: 15_000,
      existingObligations: 2_000,
      requestedMonthlyPayment: 3_500, // סך = 5500 = 36.7%
    });

    expect(result.status).toBe('good');
    expect(result.dtiRatio).toBeGreaterThanOrEqual(30);
    expect(result.dtiRatio).toBeLessThan(40);
  });

  it('DTI 40-50% = אזהרה', () => {
    const result = calculateAffordabilityLoan({
      monthlyNetIncome: 12_000,
      existingObligations: 2_000,
      requestedMonthlyPayment: 4_000, // סך = 6000 = 50%
    });

    expect(result.status).toBe('warning');
    expect(result.dtiRatio).toBeGreaterThanOrEqual(40);
  });

  it('DTI מעל 50% = סכנה', () => {
    const result = calculateAffordabilityLoan({
      monthlyNetIncome: 10_000,
      existingObligations: 3_000,
      requestedMonthlyPayment: 4_000, // סך = 7000 = 70%
    });

    expect(result.status).toBe('danger');
    expect(result.dtiRatio).toBeGreaterThan(50);
  });

  it('תשלום מקסימלי מומלץ = 40% מהכנסה פחות התחייבויות קיימות', () => {
    const result = calculateAffordabilityLoan({
      monthlyNetIncome: 15_000,
      existingObligations: 2_000,
      requestedMonthlyPayment: 1_000,
    });

    // maxRecommended = 15000 × 0.4 - 2000 = 4000
    expect(result.maxRecommendedPayment).toBeCloseTo(4_000, 0);
  });

  it('מפנה חודשי מחושב נכון', () => {
    const result = calculateAffordabilityLoan({
      monthlyNetIncome: 18_000,
      existingObligations: 3_000,
      requestedMonthlyPayment: 2_500,
    });

    expect(result.disposableAfterLoan).toBeCloseTo(18_000 - 3_000 - 2_500, 0);
  });
});

// ============================================================
// ISRAELI_LOAN_TYPES ו-getLoanTypeRecommendation
// ============================================================

describe('ISRAELI_LOAN_TYPES', () => {
  it('מכיל 6 סוגי הלוואות', () => {
    expect(ISRAELI_LOAN_TYPES.length).toBe(6);
  });

  it('הלוואת קרן השתלמות היא הכי זולה', () => {
    const kerenH = ISRAELI_LOAN_TYPES.find((t) => t.id === 'keren-hishtalmut');
    expect(kerenH).toBeDefined();
    expect(kerenH!.typicalRateMin).toBeLessThanOrEqual(4);
  });

  it('כרטיס אשראי הוא הכי יקר', () => {
    const creditCard = ISRAELI_LOAN_TYPES.find((t) => t.id === 'credit-card');
    expect(creditCard).toBeDefined();
    expect(creditCard!.typicalRateMax).toBeGreaterThanOrEqual(16);
  });
});

describe('getLoanTypeRecommendation', () => {
  it('ריבית מעל 14% - ממליץ על מעבר', () => {
    const rec = getLoanTypeRecommendation(16);
    expect(rec).toContain('קרן השתלמות');
  });

  it('ריבית 10-14% - ממליץ לשקול אלטרנטיבה', () => {
    const rec = getLoanTypeRecommendation(11);
    expect(rec).toContain('קרן השתלמות');
  });

  it('ריבית נמוכה מ-6% - ממליץ לבדוק עמלות', () => {
    const rec = getLoanTypeRecommendation(4);
    expect(rec).toContain('APR');
  });
});
