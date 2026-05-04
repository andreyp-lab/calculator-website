import { describe, it, expect } from 'vitest';
import {
  calculateTaxRefund,
  getDefaultInput,
  type TaxRefundInput,
} from '@/lib/calculators/tax-refund';

const baseInput: TaxRefundInput = getDefaultInput();

describe('calculateTaxRefund - בסיסי', () => {
  it('לא נוכה מס - אין החזר', () => {
    const r = calculateTaxRefund({ ...baseInput, taxWithheld: 0 });
    expect(r.estimatedRefund).toBe(0);
    expect(r.isEntitledToRefund).toBe(false);
  });

  it('שכיר רגיל ללא נסיבות - יש החזר', () => {
    const r = calculateTaxRefund({ ...baseInput });
    expect(r.totalCreditPoints).toBe(2.25);
    expect(r.estimatedRefund).toBeGreaterThan(7000);
    expect(r.estimatedRefund).toBeLessThan(8000);
  });

  it('אישה - 2.75 נקודות זיכוי', () => {
    const r = calculateTaxRefund({ ...baseInput, gender: 'female' });
    expect(r.totalCreditPoints).toBe(2.75);
  });
});

describe('calculateTaxRefund - מצבים מיוחדים (קיימים)', () => {
  it('אם עם 2 ילדים בני 1-5', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      gender: 'female',
      childrenAge1to5: 2,
    });
    expect(r.totalCreditPoints).toBe(7.75);
  });

  it('עולה חדש שנה ראשונה - 3 נקודות נוספות', () => {
    const r = calculateTaxRefund({ ...baseInput, monthsSinceImmigration: 12 });
    expect(r.totalCreditPoints).toBe(5.25);
  });

  it('חייל משוחרר - 2 נקודות נוספות', () => {
    const r = calculateTaxRefund({ ...baseInput, yearsSinceRelease: 1 });
    expect(r.totalCreditPoints).toBe(4.25);
  });

  it('הורה יחיד - תוספת נקודה', () => {
    const r = calculateTaxRefund({ ...baseInput, maritalStatus: 'single-parent' });
    expect(r.totalCreditPoints).toBe(3.25);
  });

  it('בן זוג ללא הכנסה - תוספת נקודה (רק אם נשוי)', () => {
    const single = calculateTaxRefund({ ...baseInput, spouseNoIncome: true });
    const married = calculateTaxRefund({
      ...baseInput,
      maritalStatus: 'married',
      spouseNoIncome: true,
    });
    expect(single.totalCreditPoints).toBe(2.25);
    expect(married.totalCreditPoints).toBe(3.25);
  });
});

describe('calculateTaxRefund - תוספות חדשות', () => {
  it('משרת מילואים פעיל - 1 נקודה נוספת', () => {
    const r = calculateTaxRefund({ ...baseInput, activeReservist: true });
    expect(r.totalCreditPoints).toBe(3.25);
  });

  it('מילואים לפי ימים (10+) - גם זוכה', () => {
    const r = calculateTaxRefund({ ...baseInput, reserveDuyDays: 25 });
    expect(r.totalCreditPoints).toBe(3.25);
  });

  it('ילדים בשירות צבאי - 1 נקודה לכל ילד', () => {
    const r = calculateTaxRefund({ ...baseInput, childrenInService: 2 });
    expect(r.totalCreditPoints).toBe(4.25);
  });

  it('בן זוג נכה - 2 נקודות (רק לנשואים)', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      maritalStatus: 'married',
      spouseDisabled: true,
    });
    expect(r.totalCreditPoints).toBe(4.25);
  });
});

describe('calculateTaxRefund - סעיף 9.5 (פטור נכי 100%)', () => {
  it('זכאי לפטור - הכנסה חייבת = 0', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 400_000,
      hasSection95Exemption: true,
    });
    expect(r.section95Exemption).toBe(400_000);
    expect(r.taxableIncome).toBe(0);
    expect(r.grossTax).toBe(0);
  });

  it('הכנסה גבוהה מהתקרה - פטור עד 608,400', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 800_000,
      hasSection95Exemption: true,
    });
    expect(r.section95Exemption).toBe(608_400);
    expect(r.taxableIncome).toBe(800_000 - 608_400);
  });

  it('ללא פטור - הכנסה חייבת מלאה', () => {
    const r = calculateTaxRefund({ ...baseInput });
    expect(r.section95Exemption).toBe(0);
  });
});

describe('calculateTaxRefund - דמי טיפול בילד (סעיף 66)', () => {
  it('אישה עם תינוק והוצאות מעון - ניכוי', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      gender: 'female',
      childrenAge1to5: 1,
      childcareExpenses: 8_000,
    });
    expect(r.totalDeductions).toBeGreaterThanOrEqual(8_000);
  });

  it('גבר - אין ניכוי דמי טיפול בילד', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      gender: 'male',
      childrenAge1to5: 1,
      childcareExpenses: 8_000,
    });
    // לגבר לא ניתן ניכוי דמי טיפול בילד לפי סעיף 66
    expect(r.totalDeductions).toBe(0);
  });

  it('אישה ללא ילדים מתחת ל-5 - אין ניכוי', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      gender: 'female',
      childrenAge6to17: 2,
      childcareExpenses: 5_000,
    });
    expect(r.totalDeductions).toBe(0);
  });
});

describe('calculateTaxRefund - הוצאות רפואיות חריגות', () => {
  it('הוצאות מעל 12.5% - ניכוי החריגה', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 100_000,
      medicalExpenses: 20_000, // 20% מההכנסה - 12,500 סף, 7,500 חריגה
    });
    expect(r.totalDeductions).toBeGreaterThanOrEqual(7_500);
  });

  it('הוצאות מתחת לסף - אין ניכוי', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 100_000,
      medicalExpenses: 10_000, // 10% - מתחת לסף 12.5%
    });
    expect(r.totalDeductions).toBe(0);
  });
});

describe('calculateTaxRefund - תרומות פוליטיות', () => {
  it('תרומה פוליטית - זיכוי 35%', () => {
    const r = calculateTaxRefund({ ...baseInput, politicalDonations: 5_000 });
    expect(r.politicalDonationsCredit).toBe(1_750);
  });

  it('תרומה מעל התקרה - מוגבל ל-12,800', () => {
    const r = calculateTaxRefund({ ...baseInput, politicalDonations: 20_000 });
    expect(r.politicalDonationsCredit).toBe(12_800 * 0.35);
  });
});

describe('calculateTaxRefund - שכר טרחה ומזונות', () => {
  it('שכר טרחה רו"ח - הוצאה מותרת', () => {
    const r = calculateTaxRefund({ ...baseInput, accountantFees: 2_500 });
    expect(r.totalDeductions).toBe(2_500);
  });

  it('מזונות לבן/בת זוג - הוצאה מוכרת', () => {
    const r = calculateTaxRefund({ ...baseInput, alimonyPaid: 36_000 });
    expect(r.totalDeductions).toBe(36_000);
  });
});

describe('calculateTaxRefund - הכנסות הון', () => {
  it('הכנסת הון - מס 25%', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      capitalIncome: 50_000,
      capitalTaxWithheld: 15_000, // 30% נוכה - יותר מהנדרש
    });
    expect(r.capitalGainsTax).toBe(12_500); // 50K * 25%
    expect(r.capitalGainsRefund).toBe(2_500); // 15K - 12.5K
  });

  it('מס נוכה כמו שצריך - אין החזר על הון', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      capitalIncome: 100_000,
      capitalTaxWithheld: 25_000, // 25% מדויק
    });
    expect(r.capitalGainsRefund).toBe(0);
  });
});

describe('calculateTaxRefund - תרחיש מקיף עם כל הסעיפים החדשים', () => {
  it('שכירה אם עם הכל - החזר מקסימלי', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 350_000,
      taxWithheld: 75_000,
      gender: 'female',
      maritalStatus: 'married',
      childrenAge1to5: 2,
      childrenInService: 1,
      activeReservist: true,
      donations: 5_000,
      politicalDonations: 3_000,
      privatePensionDeposits: 10_000,
      lifeInsurancePremium: 3_000,
      childcareExpenses: 12_000,
      medicalExpenses: 50_000,
      accountantFees: 2_000,
      peripheryZone: 'tier-a',
    });
    expect(r.estimatedRefund).toBeGreaterThan(30_000);
    expect(r.refundReasons.length).toBeGreaterThan(5);
  });
});

describe('calculateTaxRefund - תרומות (מקוריים)', () => {
  it('תרומה 1,000 ₪ - זיכוי 350 ₪', () => {
    const r = calculateTaxRefund({ ...baseInput, donations: 1_000 });
    expect(r.donationsCredit).toBe(350);
  });

  it('תרומה 100 ₪ - מתחת למינימום', () => {
    const r = calculateTaxRefund({ ...baseInput, donations: 100 });
    expect(r.donationsCredit).toBe(0);
  });
});

describe('calculateTaxRefund - אזורי פריפריה', () => {
  it('אילת - 10% עד תקרה', () => {
    const r = calculateTaxRefund({
      ...baseInput,
      annualGrossSalary: 200_000,
      peripheryZone: 'eilat',
    });
    expect(r.peripheryCredit).toBeGreaterThanOrEqual(20_000);
  });
});
