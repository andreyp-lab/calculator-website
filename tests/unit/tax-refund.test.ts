import { describe, it, expect } from 'vitest';
import { calculateTaxRefund, type TaxRefundInput } from '@/lib/calculators/tax-refund';

const baseInput: TaxRefundInput = {
  annualGrossSalary: 200_000,
  taxWithheld: 30_000,
  socialSecurityWithheld: 0,
  monthsWorked: 12,
  gender: 'male',
  maritalStatus: 'single',
  spouseNoIncome: false,
  childrenAge0: 0,
  childrenAge1to5: 0,
  childrenAge6to17: 0,
  childrenAge18: 0,
  disabledChildren: 0,
  monthsSinceImmigration: 0,
  yearsSinceRelease: 0,
  bachelorDegreeThisYear: false,
  masterDegreeThisYear: false,
  privatePensionDeposits: 0,
  privateStudyFundDeposits: 0,
  lifeInsurancePremium: 0,
  disabilityInsurancePremium: 0,
  donations: 0,
  peripheryZone: 'none',
  educationExpenses: 0,
  multipleEmployersNoCoordination: false,
  taxCoordinationPerformed: false,
};

describe('calculateTaxRefund - בסיסי', () => {
  it('לא נוכה מס - אין החזר', () => {
    const r = calculateTaxRefund({ ...baseInput, taxWithheld: 0 });
    expect(r.estimatedRefund).toBe(0);
    expect(r.isEntitledToRefund).toBe(false);
  });

  it('שכיר רגיל ללא נסיבות - אין החזר משמעותי', () => {
    // 200K שנתי = 16,667/חודש = מדרגה 3 (20%)
    // מס: 84,120×10% + 36,600×14% + 79,280×20% = 8,412 + 5,124 + 15,856 = 29,392
    // נקודות זיכוי: 2.25 × 2,904 = 6,534
    // מס סופי: 29,392 - 6,534 = 22,858
    // אם נוכה 30K - החזר ~7,142
    const r = calculateTaxRefund({ ...baseInput });
    expect(r.totalCreditPoints).toBe(2.25);
    expect(r.estimatedRefund).toBeGreaterThan(7000);
    expect(r.estimatedRefund).toBeLessThan(8000);
  });

  it('אישה - 2.75 נקודות זיכוי', () => {
    const r = calculateTaxRefund({ ...baseInput, gender: 'female' });
    expect(r.totalCreditPoints).toBe(2.75);
    expect(r.creditPointsValue).toBeCloseTo(2.75 * 2_904, 0);
  });
});

describe('calculateTaxRefund - מצבים מיוחדים', () => {
  it('אם עם 2 ילדים בני 1-5', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      gender: 'female',
      childrenAge1to5: 2,
    });
    // 2.25 + 0.5 + 2×2.5 = 7.75 נקודות
    expect(r.totalCreditPoints).toBe(7.75);
  });

  it('עולה חדש שנה ראשונה - 3 נקודות נוספות', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      monthsSinceImmigration: 12,
    });
    // 2.25 + 3 = 5.25
    expect(r.totalCreditPoints).toBe(5.25);
  });

  it('חייל משוחרר - 2 נקודות נוספות', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      yearsSinceRelease: 1,
    });
    expect(r.totalCreditPoints).toBe(4.25);
  });

  it('הורה יחיד - תוספת נקודה', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      maritalStatus: 'single-parent',
    });
    expect(r.totalCreditPoints).toBe(3.25);
  });

  it('בן זוג ללא הכנסה - תוספת נקודה (רק אם נשוי)', () => {
    const single = calculateTaxRefund({ ...baseInput, spouseNoIncome: true });
    const married = calculateTaxRefund({
      ...baseInput,
      maritalStatus: 'married',
      spouseNoIncome: true,
    });
    expect(single.totalCreditPoints).toBe(2.25); // רווק - לא תקף
    expect(married.totalCreditPoints).toBe(3.25); // נשוי - מקבל
  });
});

describe('calculateTaxRefund - תרומות', () => {
  it('תרומה 1,000 ₪ - זיכוי 350 ₪', () => {
    const r = calculateTaxRefund({ ...baseInput, donations: 1_000 });
    expect(r.donationsCredit).toBe(350);
  });

  it('תרומה 100 ₪ - מתחת למינימום, אין זיכוי', () => {
    const r = calculateTaxRefund({ ...baseInput, donations: 100 });
    expect(r.donationsCredit).toBe(0);
  });

  it('תרומה גבוהה מ-30% מההכנסה - מוגבל', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 100_000,
      donations: 50_000, // 50%, אבל יוגבל ל-30%
    });
    // מקסימום 30,000 × 35% = 10,500
    expect(r.donationsCredit).toBe(10_500);
  });
});

describe('calculateTaxRefund - הפקדות', () => {
  it('הפקדה עצמאית לפנסיה מורידה הכנסה חייבת', () => {
    const noDeposit = calculateTaxRefund({ ...baseInput });
    const withDeposit = calculateTaxRefund({
      ...baseInput,
      privatePensionDeposits: 10_000,
    });
    expect(withDeposit.taxableIncome).toBe(noDeposit.taxableIncome - 10_000);
    expect(withDeposit.estimatedRefund).toBeGreaterThan(noDeposit.estimatedRefund);
  });

  it('הפקדה לקרן השתלמות מורידה הכנסה חייבת', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      privateStudyFundDeposits: 15_000,
    });
    expect(r.totalDeductions).toBeGreaterThanOrEqual(15_000);
  });
});

describe('calculateTaxRefund - אזורי פריפריה', () => {
  it('אילת - 10% עד תקרת 268,560', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 200_000,
      peripheryZone: 'eilat',
    });
    expect(r.peripheryCredit).toBeGreaterThanOrEqual(20_000);
  });

  it('ללא פריפריה - אין זיכוי', () => {
    const r = calculateTaxRefund({ ...baseInput });
    expect(r.peripheryCredit).toBe(0);
  });
});

describe('calculateTaxRefund - סיבות להחזר', () => {
  it('עבודה חלקית - מופיע ברשימת סיבות', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      monthsWorked: 6,
      taxWithheld: 15_000,
    });
    expect(r.refundReasons.some((reason) => reason.category.includes('חלקית'))).toBe(true);
  });

  it('מספר מעסיקים ללא תיאום - מופיע', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      multipleEmployersNoCoordination: true,
    });
    expect(r.refundReasons.some((reason) => reason.category.includes('מעסיקים'))).toBe(true);
  });

  it('תרומות מעל המינימום - מופיע', () => {
    const r = calculateTaxRefund({ ...baseInput, donations: 5_000 });
    expect(r.refundReasons.some((reason) => reason.category.includes('תרומות'))).toBe(true);
  });
});

describe('calculateTaxRefund - תרחיש מקיף', () => {
  it('שכירה אם 2 ילדים, תרומות, פנסיה - החזר משמעותי', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 350_000,
      taxWithheld: 75_000,
      gender: 'female',
      childrenAge1to5: 2,
      donations: 5_000,
      privatePensionDeposits: 10_000,
      lifeInsurancePremium: 3_000,
    });
    expect(r.estimatedRefund).toBeGreaterThan(15_000);
    expect(r.refundReasons.length).toBeGreaterThanOrEqual(2);
  });
});
