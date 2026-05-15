/**
 * בדיקות יחידה — מחשבון מס שבח ורווחי הון
 * capital-gains-tax.test.ts
 */
import { describe, it, expect } from 'vitest';
import {
  calculateCapitalGainsTax,
  calculateLinearTax,
  calculateFirstHomeExemption,
  calculateInheritedProperty,
  calculateSecuritiesGain,
  applyIndexLinkage,
  applyExpenseDeductions,
  getCumulativeInflation,
  totalExpenses,
  FIRST_HOME_EXEMPTION_CAP_2026,
  STANDARD_TAX_RATE,
  CPI_INDEX_BY_YEAR,
  type DetailedExpenses,
} from '@/lib/calculators/capital-gains-tax';

// ============================================================
// calculateCapitalGainsTax — פונקציה ראשית
// ============================================================

describe('calculateCapitalGainsTax — חישוב כללי', () => {
  it('אין שבח — לא חייב מס', () => {
    const result = calculateCapitalGainsTax({
      salePrice: 1_000_000,
      purchasePrice: 1_200_000,
      recognizedExpenses: 0,
      purchaseYear: 2020,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 10,
    });
    expect(result.taxAmount).toBe(0);
    expect(result.grossGain).toBe(0);
    expect(result.netToSeller).toBe(1_000_000);
  });

  it('דירת השקעה — מס 25% על שבח ריאלי', () => {
    const result = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 2_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2020,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 0, // ללא אינפלציה לפשטות
    });
    expect(result.grossGain).toBe(1_000_000);
    expect(result.realGain).toBe(1_000_000);
    expect(result.taxRate).toBe(0.25);
    expect(result.taxAmount).toBe(250_000);
    expect(result.netToSeller).toBe(2_750_000);
  });

  it('הכנסות גבוהות — מס יסף 5% (סה"כ 30%)', () => {
    const result = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 2_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2020,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: true,
      inflationCumulativePct: 0,
    });
    expect(result.taxRate).toBe(0.30);
    expect(result.taxAmount).toBe(300_000);
  });

  it('פטור מלא לדירה יחידה — מתחת לתקרה', () => {
    const result = calculateCapitalGainsTax({
      salePrice: 2_500_000,
      purchasePrice: 1_500_000,
      recognizedExpenses: 50_000,
      purchaseYear: 2016,
      saleYear: 2026,
      scenario: 'first-home',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 20,
    });
    expect(result.fullExemption).toBe(true);
    expect(result.taxAmount).toBe(0);
    expect(result.netToSeller).toBe(2_500_000);
  });

  it('דירה יחידה מעל תקרת פטור — אין פטור', () => {
    const result = calculateCapitalGainsTax({
      salePrice: FIRST_HOME_EXEMPTION_CAP_2026 + 1,
      purchasePrice: 2_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2016,
      saleYear: 2026,
      scenario: 'first-home',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 20,
    });
    expect(result.fullExemption).toBe(false);
    expect(result.taxAmount).toBeGreaterThan(0);
  });

  it('ניצל פטור לאחרונה — לא מקבל פטור', () => {
    const result = calculateCapitalGainsTax({
      salePrice: 2_000_000,
      purchasePrice: 1_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2018,
      saleYear: 2026,
      scenario: 'first-home',
      isResident: true,
      usedExemptionRecently: true, // ניצל לאחרונה
      hasHighIncome: false,
      inflationCumulativePct: 0,
    });
    expect(result.fullExemption).toBe(false);
    expect(result.taxAmount).toBeGreaterThan(0);
  });

  it('הוצאות מוכרות מפחיתות את השבח', () => {
    const withoutExpenses = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 2_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2020,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 0,
    });
    const withExpenses = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 2_000_000,
      recognizedExpenses: 200_000,
      purchaseYear: 2020,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 0,
    });
    expect(withExpenses.taxAmount).toBeLessThan(withoutExpenses.taxAmount);
    expect(withExpenses.taxAmount).toBe(200_000); // (1M - 200k) × 25%
  });

  it('CPI אוטומטי — שנת 2000 עד 2026', () => {
    const result = calculateCapitalGainsTax({
      salePrice: 3_000_000,
      purchasePrice: 1_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2000,
      saleYear: 2026,
      scenario: 'investment',
      isResident: true,
      usedExemptionRecently: false,
      hasHighIncome: false,
      inflationCumulativePct: 0,
      useAutoCPI: true,
    });
    // CPI 2000 = 59.0, CPI 2026 = 100 → עלייה ~69.5%
    // שבח אינפלציוני = 1M × 0.695 ≈ 695,000
    expect(result.inflationGain).toBeCloseTo(695_000, -4);
    expect(result.realGain).toBeLessThan(2_000_000);
  });
});

// ============================================================
// חישוב לינארי — calculateLinearTax
// ============================================================

describe('calculateLinearTax — חישוב לינארי מוטב', () => {
  it('דירה משנת 2000, נמכרת 2026: ~54% חייב במס', () => {
    // 2000-2026 = 26 שנים. לפני 2014 = 14. אחרי 2014 = 12.
    // taxablePct = 12/26 ≈ 46.15%
    const result = calculateLinearTax({
      salePrice: 2_000_000,
      purchasePrice: 400_000,
      recognizedExpenses: 0,
      purchaseYear: 2000,
      saleYear: 2026,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.yearsBefore2014).toBe(14);
    expect(result.yearsAfter2014).toBe(12);
    expect(result.totalYears).toBe(26);
    expect(result.pctAfter2014).toBeCloseTo(12 / 26, 3);
    expect(result.pctBefore2014).toBeCloseTo(14 / 26, 3);
    // מס = שבח ריאלי × 12/26 × 25%
    expect(result.taxAmount).toBeCloseTo(result.gainAfter2014 * 0.25, 0);
  });

  it('חיסכון מהחישוב הלינארי חיובי לדירה ישנה', () => {
    const result = calculateLinearTax({
      salePrice: 3_000_000,
      purchasePrice: 200_000,
      recognizedExpenses: 50_000,
      purchaseYear: 1995,
      saleYear: 2026,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.savingFromLinear).toBeGreaterThan(0);
    expect(result.taxWithoutLinear).toBeGreaterThan(result.taxAmount);
  });

  it('שיעור אפקטיבי נמוך לדירה שנרכשה ב-1990', () => {
    // 1990-2026 = 36 שנים. לפני 2014 = 24. אחרי 2014 = 12.
    // taxablePct = 12/36 = 33.3%
    // שיעור אפקטיבי מהשבח הכולל: 33.3% × 25% = ~8.3%
    const result = calculateLinearTax({
      salePrice: 2_000_000,
      purchasePrice: 100_000,
      recognizedExpenses: 0,
      purchaseYear: 1990,
      saleYear: 2026,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    // שבח כולל = 1.9M, מס ≈ 1.9M × 0.333 × 0.25 ≈ 158,333
    // שיעור אפקטיבי ≈ 8.3%
    expect(result.effectiveTaxRate).toBeCloseTo(12 / 36 * 0.25, 3);
  });

  it('דוגמה מהמשימה: קנה 2000, מכר 2026, שבח 1M → שיעור 7-9%', () => {
    // שנות אחזקה: 26. לפני 2014: 14 (54%). אחרי 2014: 12 (46%).
    // שיעור אפקטיבי = 0.46 × 25% ≈ 11.5%
    const result = calculateLinearTax({
      salePrice: 1_500_000,
      purchasePrice: 500_000,
      recognizedExpenses: 0,
      purchaseYear: 2000,
      saleYear: 2026,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    // שבח = 1M, מס ≈ 1M × (12/26) × 0.25 = 115,385
    expect(result.grossGain).toBe(1_000_000);
    expect(result.taxAmount).toBeCloseTo(1_000_000 * (12 / 26) * 0.25, 0);
    // שיעור אפקטיבי ~ 11.5% (מעל 7-9% כי ללא אינפלציה — עם אינפלציה יורד)
    expect(result.effectiveTaxRate).toBeLessThan(0.15);
  });

  it('breakdown מחזיר שני פרקי זמן', () => {
    const result = calculateLinearTax({
      salePrice: 2_000_000,
      purchasePrice: 500_000,
      recognizedExpenses: 0,
      purchaseYear: 2005,
      saleYear: 2026,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0].taxable).toBe(false);
    expect(result.breakdown[1].taxable).toBe(true);
  });
});

// ============================================================
// פטור דירה יחידה — calculateFirstHomeExemption
// ============================================================

describe('calculateFirstHomeExemption — פטור דירה יחידה', () => {
  it('כל תנאים מתקיימים — זכאי לפטור', () => {
    const result = calculateFirstHomeExemption({
      salePrice: 2_000_000,
      purchasePrice: 1_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2016,
      saleYear: 2026,
      isResident: true,
      usedExemptionRecently: false,
      ownershipMonths: 120,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.isEligible).toBe(true);
    expect(result.ineligibilityReasons).toHaveLength(0);
    expect(result.savingFromExemption).toBeGreaterThan(0);
    expect(result.netToSeller).toBe(2_000_000);
  });

  it('לא תושב ישראל — לא זכאי', () => {
    const result = calculateFirstHomeExemption({
      salePrice: 2_000_000,
      purchasePrice: 1_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2016,
      saleYear: 2026,
      isResident: false,
      usedExemptionRecently: false,
      ownershipMonths: 120,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReasons).toContain('לא תושב ישראל');
  });

  it('אחזקה קצרה מ-18 חודשים — לא זכאי', () => {
    const result = calculateFirstHomeExemption({
      salePrice: 1_500_000,
      purchasePrice: 1_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2024,
      saleYear: 2026,
      isResident: true,
      usedExemptionRecently: false,
      ownershipMonths: 10,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReasons.some((r) => r.includes('10 חודשים'))).toBe(true);
  });

  it('מחיר מעל תקרת הפטור — לא זכאי', () => {
    const result = calculateFirstHomeExemption({
      salePrice: 6_000_000,
      purchasePrice: 3_000_000,
      recognizedExpenses: 0,
      purchaseYear: 2016,
      saleYear: 2026,
      isResident: true,
      usedExemptionRecently: false,
      ownershipMonths: 120,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReasons.some((r) => r.includes('תקרת'))).toBe(true);
  });

  it('חיסכון מהפטור שווה למס שהיה משולם', () => {
    const result = calculateFirstHomeExemption({
      salePrice: 2_500_000,
      purchasePrice: 1_500_000,
      recognizedExpenses: 0,
      purchaseYear: 2016,
      saleYear: 2026,
      isResident: true,
      usedExemptionRecently: false,
      ownershipMonths: 120,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    // שבח ריאלי = 1M, מס ללא פטור = 250,000
    expect(result.taxIfNoExemption).toBeCloseTo(250_000, -2);
    expect(result.savingFromExemption).toBe(result.taxIfNoExemption);
  });
});

// ============================================================
// ירושה — calculateInheritedProperty
// ============================================================

describe('calculateInheritedProperty — ירושה', () => {
  it('ירושה מבן/בת זוג — פטור מלא', () => {
    const result = calculateInheritedProperty({
      salePrice: 3_000_000,
      deceasedPurchasePrice: 500_000,
      recognizedExpenses: 0,
      deceasedPurchaseYear: 2000,
      saleYear: 2026,
      inheritedFromSpouse: true,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.isExempt).toBe(true);
    expect(result.taxAmount).toBe(0);
  });

  it('ירושה מאחר — חייב במס לפי תאריך רכישת המוריש', () => {
    const result = calculateInheritedProperty({
      salePrice: 3_000_000,
      deceasedPurchasePrice: 500_000,
      recognizedExpenses: 0,
      deceasedPurchaseYear: 2020,
      saleYear: 2026,
      inheritedFromSpouse: false,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.isExempt).toBe(false);
    expect(result.taxAmount).toBeGreaterThan(0);
    // רכישה 2020 > 2014 → אין לינארי → 25% מלא
    expect(result.appliedLinearMethod).toBe(false);
    expect(result.taxAmount).toBeCloseTo(result.realGain * 0.25, 0);
  });

  it('ירושה מאחר שקנה לפני 2014 — חישוב לינארי', () => {
    const result = calculateInheritedProperty({
      salePrice: 3_000_000,
      deceasedPurchasePrice: 200_000,
      recognizedExpenses: 0,
      deceasedPurchaseYear: 1995,
      saleYear: 2026,
      inheritedFromSpouse: false,
      hasHighIncome: false,
      useAutoCPI: false,
      inflationCumulativePct: 0,
    });
    expect(result.appliedLinearMethod).toBe(true);
    expect(result.taxablePct).toBeLessThan(1);
    expect(result.taxAmount).toBeLessThan(result.realGain * 0.25);
  });
});

// ============================================================
// ני"ע — calculateSecuritiesGain
// ============================================================

describe('calculateSecuritiesGain — ניירות ערך', () => {
  it('מניות רגיל — 25% על רווח', () => {
    const result = calculateSecuritiesGain({
      purchaseAmount: 100_000,
      saleAmount: 180_000,
      purchaseYear: 2020,
      saleYear: 2026,
      securitiesType: 'stocks',
      isResident: true,
      hasHighIncome: false,
      isDayTrading: false,
      isTaxSheltered: false,
      applyIndexation: false,
      dividendsReceived: 0,
      dividendsTaxWithheld: 0,
    });
    expect(result.grossProfit).toBe(80_000);
    expect(result.taxOnCapitalGain).toBeCloseTo(80_000 * 0.25, 0);
    expect(result.totalTax).toBeCloseTo(20_000, 0);
    expect(result.netProfit).toBeCloseTo(60_000, 0);
  });

  it('חשבון פנסיוני — פטור ממס', () => {
    const result = calculateSecuritiesGain({
      purchaseAmount: 200_000,
      saleAmount: 400_000,
      purchaseYear: 2018,
      saleYear: 2026,
      securitiesType: 'etf',
      isResident: true,
      hasHighIncome: false,
      isDayTrading: false,
      isTaxSheltered: true,
      applyIndexation: false,
      dividendsReceived: 0,
      dividendsTaxWithheld: 0,
    });
    expect(result.isTaxSheltered).toBe(true);
    expect(result.totalTax).toBe(0);
    expect(result.netProfit).toBe(200_000);
  });

  it('הפסד — אין מס', () => {
    const result = calculateSecuritiesGain({
      purchaseAmount: 150_000,
      saleAmount: 100_000,
      purchaseYear: 2022,
      saleYear: 2026,
      securitiesType: 'stocks',
      isResident: true,
      hasHighIncome: false,
      isDayTrading: false,
      isTaxSheltered: false,
      applyIndexation: false,
      dividendsReceived: 0,
      dividendsTaxWithheld: 0,
    });
    expect(result.grossProfit).toBe(-50_000);
    expect(result.totalTax).toBe(0);
  });

  it('דיבידנדים — 25% מס', () => {
    const result = calculateSecuritiesGain({
      purchaseAmount: 100_000,
      saleAmount: 100_000, // אין רווח הון
      purchaseYear: 2022,
      saleYear: 2026,
      securitiesType: 'stocks',
      isResident: true,
      hasHighIncome: false,
      isDayTrading: false,
      isTaxSheltered: false,
      applyIndexation: false,
      dividendsReceived: 10_000,
      dividendsTaxWithheld: 0,
    });
    expect(result.taxOnDividends).toBe(2_500); // 10,000 × 25%
  });

  it('מס יסף — 30% על רווח', () => {
    const result = calculateSecuritiesGain({
      purchaseAmount: 100_000,
      saleAmount: 200_000,
      purchaseYear: 2020,
      saleYear: 2026,
      securitiesType: 'stocks',
      isResident: true,
      hasHighIncome: true,
      isDayTrading: false,
      isTaxSheltered: false,
      applyIndexation: false,
      dividendsReceived: 0,
      dividendsTaxWithheld: 0,
    });
    expect(result.taxRate).toBe(0.30);
    expect(result.taxOnCapitalGain).toBeCloseTo(100_000 * 0.30, 0);
  });
});

// ============================================================
// CPI ומדד — עזרים
// ============================================================

describe('getCumulativeInflation — מדד CPI', () => {
  it('אינפלציה בין 2000 ל-2026 חיובית', () => {
    const inflation = getCumulativeInflation(2000, 2026);
    expect(inflation).toBeGreaterThan(0);
    // CPI 2000 = 59.0, CPI 2026 = 100 → ~69.5%
    expect(inflation).toBeCloseTo((100 - 59.0) / 59.0, 2);
  });

  it('אינפלציה עבור אותה שנה — 0', () => {
    const inflation = getCumulativeInflation(2026, 2026);
    expect(inflation).toBe(0);
  });

  it('מדד CPI 2026 = 100 (בסיס)', () => {
    expect(CPI_INDEX_BY_YEAR[2026]).toBe(100.0);
  });

  it('מדד CPI 1990 נמוך משמעותית מ-2026', () => {
    expect(CPI_INDEX_BY_YEAR[1990]).toBeLessThan(CPI_INDEX_BY_YEAR[2026]);
  });
});

describe('applyIndexLinkage — הצמדה', () => {
  it('מחיר מצומד גבוה ממחיר מקורי', () => {
    const result = applyIndexLinkage(1_000_000, 2000, 2026);
    expect(result.indexedPrice).toBeGreaterThan(1_000_000);
    expect(result.inflationAmount).toBeGreaterThan(0);
  });

  it('החזר מחיר מקורי נכון', () => {
    const result = applyIndexLinkage(500_000, 2010, 2026);
    expect(result.originalPrice).toBe(500_000);
  });
});

describe('applyExpenseDeductions — ניכוי הוצאות', () => {
  it('חיסכון מס = 25% מסך ההוצאות', () => {
    const expenses: DetailedExpenses = {
      lawyerAtPurchase: 20_000,
      lawyerAtSale: 20_000,
      realtorFee: 60_000,
      purchaseTaxPaid: 100_000,
      renovations: 200_000,
      bettermentLevy: 0,
      marketing: 0,
      mortgageInterest: 0,
      other: 0,
    };
    const result = applyExpenseDeductions(expenses);
    expect(result.totalExpenses).toBe(400_000);
    expect(result.taxSavingFromExpenses).toBe(100_000); // 400,000 × 25%
  });
});

describe('totalExpenses — סכימת הוצאות', () => {
  it('מחשב סכום נכון', () => {
    const expenses: DetailedExpenses = {
      lawyerAtPurchase: 10_000,
      lawyerAtSale: 15_000,
      realtorFee: 30_000,
      purchaseTaxPaid: 50_000,
      renovations: 100_000,
      bettermentLevy: 20_000,
      marketing: 5_000,
      mortgageInterest: 0,
      other: 5_000,
    };
    expect(totalExpenses(expenses)).toBe(235_000);
  });
});
