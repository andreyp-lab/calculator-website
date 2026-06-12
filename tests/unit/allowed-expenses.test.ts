import { describe, it, expect } from 'vitest';
import {
  calculateAllowedExpenses,
  getMarginalTaxRate,
  listExpenseRules,
  EXPENSE_RULES,
  VAT_RATE,
  VAT_MIXED_MAINLY_BUSINESS,
} from '@/lib/calculators/allowed-expenses';

const VAT_FRACTION = VAT_RATE / (1 + VAT_RATE); // ≈ 0.1525 ב-18%

// =====================================================
// getMarginalTaxRate — מדרגה שולית
// =====================================================

describe('getMarginalTaxRate', () => {
  it('הכנסה אפס → מדרגה 0', () => {
    expect(getMarginalTaxRate(0)).toBe(0);
  });

  it('הכנסה שלילית → מדרגה 0', () => {
    expect(getMarginalTaxRate(-5000)).toBe(0);
  });

  it('הכנסה במדרגה הראשונה (50,000) → 10%', () => {
    expect(getMarginalTaxRate(50_000)).toBe(0.1);
  });

  it('הכנסה 150,000 → מדרגת 20%', () => {
    expect(getMarginalTaxRate(150_000)).toBe(0.2);
  });

  it('הכנסה 250,000 → מדרגת 31%', () => {
    expect(getMarginalTaxRate(250_000)).toBe(0.31);
  });

  it('הכנסה גבוהה מאוד → מדרגה עליונה 50%', () => {
    expect(getMarginalTaxRate(2_000_000)).toBe(0.5);
  });
});

// =====================================================
// כללי ההכרה — קבועים מאומתים
// =====================================================

describe('EXPENSE_RULES — קבועי הכרה', () => {
  it('רכב — 45% הכרה במס הכנסה (א.1)', () => {
    expect(EXPENSE_RULES.vehicle.incomeTaxRecognition).toBe(0.45);
  });

  it('רכב — קיזוז מע"מ 2/3 (א.24)', () => {
    expect(EXPENSE_RULES.vehicle.vatRecovery).toBeCloseTo(2 / 3, 6);
    expect(VAT_MIXED_MAINLY_BUSINESS).toBeCloseTo(2 / 3, 6);
  });

  it('כיבוד — 80% הכרה במס הכנסה (א.6)', () => {
    expect(EXPENSE_RULES.refreshments.incomeTaxRecognition).toBe(0.8);
  });

  it('כיבוד — אין קיזוז מע"מ (א.26)', () => {
    expect(EXPENSE_RULES.refreshments.vatRecovery).toBe(0);
  });

  it('סלולר — הכרה לפי יחס (null) וקיזוז מע"מ 2/3 (א.3/א.25)', () => {
    expect(EXPENSE_RULES.cellular.incomeTaxRecognition).toBeNull();
    expect(EXPENSE_RULES.cellular.vatRecovery).toBeCloseTo(2 / 3, 6);
  });

  it('עבודה מהבית — הכרה לפי יחס שטח (null), ללא מע"מ מיוחד (א.5)', () => {
    expect(EXPENSE_RULES.homeOffice.incomeTaxRecognition).toBeNull();
    expect(EXPENSE_RULES.homeOffice.vatRecovery).toBe(0);
  });

  it('רו"ח / ביטוח / השתלמות — 100% הכרה ומע"מ מלא', () => {
    expect(EXPENSE_RULES.accounting.incomeTaxRecognition).toBe(1);
    expect(EXPENSE_RULES.insurance.incomeTaxRecognition).toBe(1);
    expect(EXPENSE_RULES.training.incomeTaxRecognition).toBe(1);
    expect(EXPENSE_RULES.accounting.vatRecovery).toBe(1);
  });

  it('listExpenseRules מחזיר 9 קטגוריות', () => {
    expect(listExpenseRules()).toHaveLength(9);
  });
});

// =====================================================
// calculateAllowedExpenses — חישוב עיקרי
// =====================================================

describe('calculateAllowedExpenses', () => {
  it('הוצאות אפס — הכל אפס', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      expenses: {},
    });
    expect(r.totalGrossExpense).toBe(0);
    expect(r.totalRecognizedForIncomeTax).toBe(0);
    expect(r.totalVatRecoverable).toBe(0);
    expect(r.estimatedIncomeTaxSaving).toBe(0);
    expect(r.categories).toHaveLength(0);
  });

  it('רכב 10,000 ₪ — לעוסק מורשה ההכרה על הסכום בניכוי המע"מ שקוזז, מע"מ 2/3', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { vehicle: 10_000 },
    });
    // מע"מ גלום = 10,000 × 0.1525 ; קיזוז 2/3
    const embedded = 10_000 * VAT_FRACTION;
    const recoverable = embedded * (2 / 3);
    expect(r.totalVatRecoverable).toBeCloseTo(recoverable, 0);
    // הכרה: (10,000 − מע"מ מקוזז) × 45%
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo((10_000 - recoverable) * 0.45, 0);
  });

  it('רכב 10,000 ₪ — לעוסק פטור ההכרה על הסכום המלא (כולל מע"מ)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { vehicle: 10_000 },
    });
    // עוסק פטור אינו מקזז מע"מ — בסיס ההכרה הוא הסכום המלא
    expect(r.totalVatRecoverable).toBe(0);
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(4_500, 0);
  });

  it('כיבוד 5,000 ₪ — 80% מוכר, אפס קיזוז מע"מ', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { refreshments: 5_000 },
    });
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(4_000, 0);
    expect(r.totalVatRecoverable).toBe(0);
  });

  it('עבודה מהבית — יחס שטח 25%', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { homeOffice: 20_000 },
      homeOfficeAreaRatio: 0.25,
    });
    // 25% × 20,000 = 5,000
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(5_000, 0);
  });

  it('עבודה מהבית — יחס שטח 100% (קצה)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { homeOffice: 20_000 },
      homeOfficeAreaRatio: 1,
    });
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(20_000, 0);
  });

  it('עבודה מהבית — יחס שטח 0% → אפס מוכר', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { homeOffice: 20_000 },
      homeOfficeAreaRatio: 0,
    });
    expect(r.totalRecognizedForIncomeTax).toBe(0);
  });

  it('סלולר — יחס שימוש עסקי 50% (עוסק פטור, הכרה על הסכום המלא)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { cellular: 4_000 },
    });
    // 50% × 4,000 = 2,000 (עוסק פטור — ללא קיזוז מע"מ)
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(2_000, 0);
  });

  it('סלולר — עוסק מורשה: ההכרה על הסכום בניכוי המע"מ שקוזז', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { cellular: 4_000 },
    });
    const recoverable = 4_000 * VAT_FRACTION * (2 / 3);
    // (4,000 − מע"מ מקוזז) × 50%
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo((4_000 - recoverable) * 0.5, 0);
  });

  it('סלולר — יחס שימוש מותאם 80% (עוסק פטור)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { cellular: 4_000 },
      cellularBusinessRatio: 0.8,
    });
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(3_200, 0);
  });

  it('עוסק פטור — אין קיזוז מע"מ כלל', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { vehicle: 10_000, accounting: 6_000, equipment: 5_000 },
    });
    expect(r.totalVatRecoverable).toBe(0);
    // הערה על עוסק פטור קיימת
    expect(r.notes.some((n) => n.includes('עוסק פטור'))).toBe(true);
  });

  it('עוסק מורשה — רו"ח 11,800 ₪: קיזוז מע"מ מלא, הכרה על הסכום ללא מע"מ (10,000)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { accounting: 11_800 },
    });
    // מע"מ גלום = 11,800 × 0.1525 ≈ 1,800 ; קיזוז מלא
    expect(r.totalVatRecoverable).toBeCloseTo(11_800 * VAT_FRACTION, 0);
    // ההכרה במס הכנסה היא על הסכום בניכוי המע"מ שקוזז ≈ 10,000
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(10_000, 0);
  });

  it('עוסק פטור — רו"ח 11,800 ₪: אין קיזוז, הכרה על הסכום המלא (11,800)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { accounting: 11_800 },
    });
    expect(r.totalVatRecoverable).toBe(0);
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(11_800, 0);
  });

  it('חיסכון מס = הוצאה מוכרת × מדרגה שולית', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 250_000, // מדרגת 31%
      expenses: { accounting: 10_000 },
    });
    expect(r.marginalTaxRate).toBe(0.31);
    expect(r.estimatedIncomeTaxSaving).toBeCloseTo(10_000 * 0.31, 0);
  });

  it('ללא הכנסה — חיסכון מס אפס + הערה', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      expenses: { accounting: 10_000 },
    });
    expect(r.marginalTaxRate).toBe(0);
    expect(r.estimatedIncomeTaxSaving).toBe(0);
    expect(r.notes.some((n) => n.includes('לא הוזנה הכנסה'))).toBe(true);
  });

  it('סך ההטבה = חיסכון מס הכנסה + קיזוז מע"מ', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { accounting: 10_000 },
    });
    expect(r.totalBenefit).toBeCloseTo(
      r.estimatedIncomeTaxSaving + r.totalVatRecoverable,
      6,
    );
  });

  it('מספר קטגוריות מסתכם נכון', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 200_000,
      expenses: {
        vehicle: 10_000,
        refreshments: 2_000,
        accounting: 6_000,
        equipment: 4_000,
      },
    });
    expect(r.categories).toHaveLength(4);
    const sumGross = r.categories.reduce((s, c) => s + c.grossExpense, 0);
    expect(sumGross).toBeCloseTo(r.totalGrossExpense, 6);
    const sumRecognized = r.categories.reduce((s, c) => s + c.recognizedForIncomeTax, 0);
    expect(sumRecognized).toBeCloseTo(r.totalRecognizedForIncomeTax, 6);
  });

  it('קטגוריות עם סכום אפס אינן נכללות', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { vehicle: 10_000, cellular: 0, refreshments: 0 },
    });
    expect(r.categories).toHaveLength(1);
    expect(r.categories[0].key).toBe('vehicle');
  });

  it('מס תשומות גלום מחושב מתוך סכום כולל מע"מ', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { equipment: 11_800 },
    });
    const cat = r.categories[0];
    // 11,800 כולל מע"מ → מע"מ גלום ≈ 1,800
    expect(cat.embeddedVat).toBeCloseTo(11_800 * VAT_FRACTION, 1);
  });

  it('יחס שימוש עסקי גדול מ-1 נחתך ל-1', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { cellular: 4_000 },
      cellularBusinessRatio: 1.5,
    });
    // עוסק פטור — אין קיזוז מע"מ, ולכן ההכרה על הסכום המלא לאחר חיתוך היחס ל-1
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(4_000, 0);
  });

  it('יחס שטח שלילי נחתך ל-0', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: false,
      annualIncome: 150_000,
      expenses: { homeOffice: 20_000 },
      homeOfficeAreaRatio: -0.3,
    });
    expect(r.totalRecognizedForIncomeTax).toBe(0);
  });

  it('הערות כוללות אזהרת רכב כשמוזנת הוצאת רכב', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { vehicle: 10_000 },
    });
    expect(r.notes.some((n) => n.includes('רכב'))).toBe(true);
  });

  it('סכום שלילי בקטגוריה אינו מקטין הכרה (נחתך ל-0)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 150_000,
      expenses: { accounting: -5_000 },
    });
    // -5,000 ≤ 0 → לא נכלל
    expect(r.categories).toHaveLength(0);
    expect(r.totalGrossExpense).toBe(0);
  });

  it('תרחיש משולב מלא — עוסק מורשה במדרגת 31% (הכרה על בסיס נטו-ממע"מ-מקוזז)', () => {
    const r = calculateAllowedExpenses({
      isVatRegistered: true,
      annualIncome: 250_000,
      expenses: {
        vehicle: 12_000,
        cellular: 3_000,
        homeOffice: 16_000,
        refreshments: 2_000,
        equipment: 6_000,
        accounting: 8_000,
      },
      cellularBusinessRatio: 0.6,
      homeOfficeAreaRatio: 0.2,
    });
    // לעוסק מורשה, בסיס ההכרה לכל קטגוריה = (הוצאה − מע"מ מקוזז) × שיעור הכרה.
    // מוודאים עקביות פנימית: סך ההכרה = הסכום על-פני הקטגוריות, וכל ערך < הוצאה×שיעור.
    const expectedTotal = r.categories.reduce(
      (s, c) => s + (c.grossExpense - c.vatRecoverable) * c.incomeTaxRecognitionApplied,
      0,
    );
    expect(r.totalRecognizedForIncomeTax).toBeCloseTo(expectedTotal, 4);
    // עם קיזוז מע"מ, ההכרה הכוללת נמוכה מ-26,000 (הערך לפני התיקון)
    expect(r.totalRecognizedForIncomeTax).toBeLessThan(26_000);
    expect(r.marginalTaxRate).toBe(0.31);
    expect(r.estimatedIncomeTaxSaving).toBeCloseTo(r.totalRecognizedForIncomeTax * 0.31, 4);
    expect(r.totalVatRecoverable).toBeGreaterThan(0);
    expect(r.totalBenefit).toBeGreaterThan(r.estimatedIncomeTaxSaving);
  });
});
