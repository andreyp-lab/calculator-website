import { describe, it, expect } from 'vitest';
import {
  calculateVat,
  calculateAddVat,
  calculateExtractVat,
  calculateNetFromTotal,
  calculateBimonthlyReport,
  calculateYearComparison,
  calculateDiscountScenario,
  calculateImportVat,
  getOperatorRules,
  summarizeInvoices,
  INDUSTRY_VAT_RULES,
  EXEMPT_THRESHOLD_2026,
  VAT_RATES,
  type InvoiceItem,
} from '@/lib/calculators/vat';

// ============================================================
// calculateVat — הוספה
// ============================================================

describe('calculateVat - הוספה', () => {
  it('הוספת מע"מ ב-18% ל-1000 ₪', () => {
    const result = calculateVat({ amount: 1000, mode: 'add', rate: 0.18 });
    expect(result.amountWithoutVat).toBe(1000);
    expect(result.vatAmount).toBeCloseTo(180, 2);
    expect(result.amountWithVat).toBeCloseTo(1180, 2);
  });

  it('הוספת מע"מ ל-0', () => {
    const result = calculateVat({ amount: 0, mode: 'add' });
    expect(result.amountWithoutVat).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.amountWithVat).toBe(0);
  });

  it('שיעור ברירת מחדל הוא 18%', () => {
    const result = calculateVat({ amount: 100, mode: 'add' });
    expect(result.vatRate).toBe(0.18);
    expect(result.amountWithVat).toBeCloseTo(118, 2);
  });

  it('שיעור 0%', () => {
    const result = calculateVat({ amount: 100, mode: 'add', rate: 0 });
    expect(result.vatAmount).toBe(0);
    expect(result.amountWithVat).toBe(100);
  });

  it('סכום שלילי מוגבל ל-0', () => {
    const result = calculateVat({ amount: -500, mode: 'add' });
    expect(result.amountWithoutVat).toBe(0);
    expect(result.vatAmount).toBe(0);
  });
});

// ============================================================
// calculateVat — חילוץ
// ============================================================

describe('calculateVat - חילוץ', () => {
  it('חילוץ מע"מ מ-1180 ₪', () => {
    const result = calculateVat({ amount: 1180, mode: 'extract', rate: 0.18 });
    expect(result.amountWithoutVat).toBeCloseTo(1000, 0);
    expect(result.vatAmount).toBeCloseTo(180, 0);
    expect(result.amountWithVat).toBe(1180);
  });

  it('חילוץ מע"מ ב-17%', () => {
    const result = calculateVat({ amount: 1170, mode: 'extract', rate: 0.17 });
    expect(result.amountWithoutVat).toBeCloseTo(1000, 0);
    expect(result.vatAmount).toBeCloseTo(170, 0);
  });

  it('חילוץ ב-0% — מחזיר את הסכום ללא שינוי', () => {
    const result = calculateVat({ amount: 100, mode: 'extract', rate: 0 });
    expect(result.amountWithoutVat).toBe(100);
    expect(result.vatAmount).toBe(0);
  });
});

// ============================================================
// עקביות
// ============================================================

describe('calculateVat - עקביות', () => {
  it('הוספה ואז חילוץ מחזיר את הסכום המקורי', () => {
    const original = 1000;
    const added = calculateVat({ amount: original, mode: 'add', rate: 0.18 });
    const extracted = calculateVat({ amount: added.amountWithVat, mode: 'extract', rate: 0.18 });
    expect(extracted.amountWithoutVat).toBeCloseTo(original, 2);
  });

  it('עקביות ב-17%', () => {
    const original = 850;
    const added = calculateAddVat(original, 0.17);
    const extracted = calculateExtractVat(added.amountWithVat, 0.17);
    expect(extracted.amountWithoutVat).toBeCloseTo(original, 2);
  });
});

// ============================================================
// calculateAddVat / calculateExtractVat (aliases)
// ============================================================

describe('calculateAddVat', () => {
  it('מוסיף מע"מ 18% כברירת מחדל', () => {
    const r = calculateAddVat(500);
    expect(r.vatAmount).toBeCloseTo(90, 2);
    expect(r.amountWithVat).toBeCloseTo(590, 2);
  });

  it('שיעור מותאם', () => {
    const r = calculateAddVat(500, 0.17);
    expect(r.vatAmount).toBeCloseTo(85, 2);
  });
});

describe('calculateExtractVat', () => {
  it('מחלץ מע"מ 18%', () => {
    const r = calculateExtractVat(590);
    expect(r.amountWithoutVat).toBeCloseTo(500, 0);
  });
});

// ============================================================
// calculateNetFromTotal
// ============================================================

describe('calculateNetFromTotal', () => {
  it('מחשב נטו נכון מ-1180 ₪', () => {
    const r = calculateNetFromTotal(1180, 0.18);
    expect(r.net).toBeCloseTo(1000, 0);
    expect(r.vatAmount).toBeCloseTo(180, 0);
  });

  it('אחוז מע"מ אפקטיבי נכון', () => {
    const r = calculateNetFromTotal(1180, 0.18);
    expect(r.effectiveVatPercent).toBeCloseTo(0.18 / 1.18, 5);
  });

  it('שיעור 0% — נטו = סכום', () => {
    const r = calculateNetFromTotal(1000, 0);
    expect(r.net).toBe(1000);
    expect(r.vatAmount).toBe(0);
    expect(r.effectiveVatPercent).toBe(0);
  });
});

// ============================================================
// calculateBimonthlyReport
// ============================================================

describe('calculateBimonthlyReport', () => {
  const baseInvoices: InvoiceItem[] = [
    { id: '1', description: 'מכירה', amount: 10000, vatRate: 0.18, type: 'output' },
    { id: '2', description: 'ציוד', amount: 5000, vatRate: 0.18, type: 'input' },
  ];

  it('מחשב Output VAT נכון', () => {
    const r = calculateBimonthlyReport({ invoices: baseInvoices });
    expect(r.outputVat).toBeCloseTo(1800, 2);
    expect(r.outputBase).toBe(10000);
  });

  it('מחשב Input VAT נכון', () => {
    const r = calculateBimonthlyReport({ invoices: baseInvoices });
    expect(r.inputVat).toBeCloseTo(900, 2);
    expect(r.inputBase).toBe(5000);
  });

  it('מחשב netVatDue נכון (לתשלום)', () => {
    const r = calculateBimonthlyReport({ invoices: baseInvoices });
    expect(r.netVatDue).toBeCloseTo(900, 2);
    expect(r.isRefund).toBe(false);
  });

  it('מזהה החזר כשתשומות גבוהות מעסקאות', () => {
    const refundInvoices: InvoiceItem[] = [
      { id: '1', description: 'מכירה', amount: 1000, vatRate: 0.18, type: 'output' },
      { id: '2', description: 'רכישה גדולה', amount: 5000, vatRate: 0.18, type: 'input' },
    ];
    const r = calculateBimonthlyReport({ invoices: refundInvoices });
    expect(r.isRefund).toBe(true);
    expect(r.netVatDue).toBeLessThan(0);
  });

  it('מזהה חריגה מתקרת עוסק פטור', () => {
    const r = calculateBimonthlyReport({
      invoices: baseInvoices,
      annualRevenueToDate: 115_000,
    });
    expect(r.exemptThresholdWarning).toBe(true);
    expect(r.projectedAnnualRevenue).toBe(125_000);
  });

  it('אין אזהרה מתחת לתקרה', () => {
    const r = calculateBimonthlyReport({
      invoices: baseInvoices,
      annualRevenueToDate: 50_000,
    });
    expect(r.exemptThresholdWarning).toBe(false);
  });

  it('עסקאות ריקות — אפסים', () => {
    const r = calculateBimonthlyReport({ invoices: [] });
    expect(r.outputVat).toBe(0);
    expect(r.inputVat).toBe(0);
    expect(r.netVatDue).toBe(0);
  });

  it('ריכוז לפי שיעור — מחשב נכון', () => {
    const mixed: InvoiceItem[] = [
      { id: '1', description: 'מכירה רגילה', amount: 1000, vatRate: 0.18, type: 'output' },
      { id: '2', description: 'יצוא', amount: 2000, vatRate: 0, type: 'output' },
    ];
    const r = calculateBimonthlyReport({ invoices: mixed });
    const zeroRate = r.byRate.find((b) => b.rate === 0);
    const stdRate = r.byRate.find((b) => b.rate === 0.18);
    expect(zeroRate?.outputBase).toBe(2000);
    expect(stdRate?.outputVat).toBeCloseTo(180, 2);
  });
});

// ============================================================
// calculateYearComparison
// ============================================================

describe('calculateYearComparison', () => {
  it('השוואה ל-1000 ₪ — הפרש 10 ₪ מע"מ', () => {
    const r = calculateYearComparison(1000);
    expect(r.year2024.vatAmount).toBeCloseTo(170, 2);
    expect(r.year2025plus.vatAmount).toBeCloseTo(180, 2);
    expect(r.difference.vatAmountDiff).toBeCloseTo(10, 2);
  });

  it('גרוסו 2024 נמוך מ-2025', () => {
    const r = calculateYearComparison(1000);
    expect(r.year2024.grossAmount).toBeLessThan(r.year2025plus.grossAmount);
  });

  it('השפעה שנתית על מחזור 200,000 ₪', () => {
    const r = calculateYearComparison(1000, 200_000);
    expect(r.annualImpact.extraVatAnnual).toBeCloseTo(2000, 0); // 1% × 200,000
  });

  it('אחוז עלייה במחיר לצרכן', () => {
    const r = calculateYearComparison(1000);
    // (1180 - 1170) / 1170 = 10/1170 ≈ 0.855%
    expect(r.difference.percentIncrease).toBeCloseTo(0.855, 1);
  });
});

// ============================================================
// calculateDiscountScenario
// ============================================================

describe('calculateDiscountScenario', () => {
  it('הנחה לפני מע"מ — 10% הנחה על 1000 ₪ נטו', () => {
    const r = calculateDiscountScenario(1000, 10);
    expect(r.discountBeforeVat.priceAfterDiscount).toBeCloseTo(900, 2);
    expect(r.discountBeforeVat.finalGross).toBeCloseTo(900 * 1.18, 2);
    expect(r.discountBeforeVat.totalSaving).toBeCloseTo(1000 * 1.18 - 900 * 1.18, 2);
  });

  it('הנחה אחרי מע"מ — 10% הנחה על ברוטו', () => {
    const r = calculateDiscountScenario(1000, 10);
    const gross = 1000 * 1.18;
    expect(r.discountAfterVat.finalGross).toBeCloseTo(gross * 0.9, 2);
    expect(r.discountAfterVat.totalSaving).toBeCloseTo(gross * 0.1, 2);
  });

  it('הנחה 0% — ללא שינוי', () => {
    const r = calculateDiscountScenario(1000, 0);
    expect(r.discountBeforeVat.finalGross).toBeCloseTo(1180, 2);
    expect(r.discountAfterVat.finalGross).toBeCloseTo(1180, 2);
  });

  it('הנחה 100% — מחיר אפס', () => {
    const r = calculateDiscountScenario(1000, 100);
    expect(r.discountBeforeVat.finalGross).toBeCloseTo(0, 2);
  });
});

// ============================================================
// calculateImportVat
// ============================================================

describe('calculateImportVat', () => {
  it('יבוא $500 בשער 3.7 עם 12% מכס', () => {
    const r = calculateImportVat({
      goodsValueUSD: 500,
      exchangeRateILS: 3.7,
      customsDutyPercent: 12,
    });
    expect(r.goodsValueILS).toBeCloseTo(1850, 0);
    expect(r.customsDuty).toBeCloseTo(222, 0); // 1850 × 0.12
    expect(r.vatBase).toBeCloseTo(2072, 0);
    expect(r.vatAmount).toBeCloseTo(2072 * 0.18, 0);
    expect(r.totalLandedCost).toBeCloseTo(2072 + 2072 * 0.18, 0);
  });

  it('ללא מכס ומס קנייה — מע"מ ישיר', () => {
    const r = calculateImportVat({
      goodsValueUSD: 100,
      exchangeRateILS: 3.7,
      customsDutyPercent: 0,
    });
    expect(r.customsDuty).toBe(0);
    expect(r.vatAmount).toBeCloseTo(370 * 0.18, 2);
  });

  it('מחשב אחוז מס אפקטיבי', () => {
    const r = calculateImportVat({
      goodsValueUSD: 100,
      exchangeRateILS: 3.7,
      customsDutyPercent: 0,
    });
    expect(r.effectiveTaxRate).toBeCloseTo(0.18, 3);
  });

  it('breakdown לא כולל אפסים', () => {
    const r = calculateImportVat({
      goodsValueUSD: 100,
      exchangeRateILS: 3.7,
      customsDutyPercent: 0,
      purchaseTaxPercent: 0,
    });
    const labels = r.breakdown.map((b) => b.label);
    expect(labels).not.toContain('מכס');
    expect(labels).not.toContain('מס קנייה');
  });
});

// ============================================================
// getOperatorRules
// ============================================================

describe('getOperatorRules', () => {
  it('עוסק מורשה — גובה מע"מ ומקזז תשומות', () => {
    const r = getOperatorRules('osek-murshe');
    expect(r.collectsVat).toBe(true);
    expect(r.canDeductInputVat).toBe(true);
    expect(r.mustReport).toBe(true);
  });

  it('עוסק פטור — לא גובה ולא מקזז', () => {
    const r = getOperatorRules('osek-patur');
    expect(r.collectsVat).toBe(false);
    expect(r.canDeductInputVat).toBe(false);
    expect(r.threshold).toBe(EXEMPT_THRESHOLD_2026);
  });

  it('חברה — תמיד עוסק מורשה', () => {
    const r = getOperatorRules('company');
    expect(r.collectsVat).toBe(true);
    expect(r.threshold).toBeNull();
  });

  it('עמותה — פטורה', () => {
    const r = getOperatorRules('amuta');
    expect(r.collectsVat).toBe(false);
    expect(r.canDeductInputVat).toBe(false);
  });
});

// ============================================================
// summarizeInvoices
// ============================================================

describe('summarizeInvoices', () => {
  const invoices: InvoiceItem[] = [
    { id: '1', description: 'מכירה 1', amount: 5000, vatRate: 0.18, type: 'output' },
    { id: '2', description: 'מכירה 2', amount: 3000, vatRate: 0.18, type: 'output' },
    { id: '3', description: 'ציוד', amount: 2000, vatRate: 0.18, type: 'input' },
  ];

  it('סה"כ חשבוניות', () => {
    const s = summarizeInvoices(invoices);
    expect(s.totalInvoices).toBe(3);
  });

  it('סיכום עסקאות נכון', () => {
    const s = summarizeInvoices(invoices);
    expect(s.byType.output.netAmount).toBe(8000);
    expect(s.byType.output.vatAmount).toBeCloseTo(1440, 2);
    expect(s.byType.output.count).toBe(2);
  });

  it('יתרת מע"מ חיובית (לתשלום)', () => {
    const s = summarizeInvoices(invoices);
    // output 1440 - input 360 = 1080
    expect(s.netVatPosition).toBeCloseTo(1080, 1);
  });

  it('רשימה ריקה — אפסים', () => {
    const s = summarizeInvoices([]);
    expect(s.totalInvoices).toBe(0);
    expect(s.netVatPosition).toBe(0);
  });
});

// ============================================================
// INDUSTRY_VAT_RULES
// ============================================================

describe('INDUSTRY_VAT_RULES', () => {
  it('ענף רגיל — 18%', () => {
    expect(INDUSTRY_VAT_RULES.standard.vatRate).toBe(0.18);
  });

  it('יצוא — 0%', () => {
    expect(INDUSTRY_VAT_RULES.export.vatRate).toBe(0);
    expect(INDUSTRY_VAT_RULES.export.category).toBe('zero');
  });

  it('אילת — 0%', () => {
    expect(INDUSTRY_VAT_RULES.eilat.vatRate).toBe(0);
  });

  it('שירותים פיננסיים — פטור', () => {
    expect(INDUSTRY_VAT_RULES.financial.category).toBe('exempt');
  });

  it('נדל"ן מגורים — פטור', () => {
    expect(INDUSTRY_VAT_RULES['real-estate-residential'].category).toBe('exempt');
  });

  it('נדל"ן מסחרי — 18%', () => {
    expect(INDUSTRY_VAT_RULES['real-estate-commercial'].vatRate).toBe(0.18);
  });
});

// ============================================================
// VAT_RATES קבועים
// ============================================================

describe('VAT_RATES', () => {
  it('שיעור רגיל 2025 = 18%', () => {
    expect(VAT_RATES.standard2025).toBe(0.18);
  });

  it('שיעור רגיל 2024 = 17%', () => {
    expect(VAT_RATES.standard2024).toBe(0.17);
  });

  it('תקרת עוסק פטור 2026', () => {
    expect(EXEMPT_THRESHOLD_2026).toBe(120_000);
  });
});
