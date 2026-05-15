import { describe, it, expect } from 'vitest';
import {
  calculatePurchaseTax,
  calculatePurchaseTaxByType,
  calculateImmigrantDiscount,
  compareAllBuyerTypes,
  compareAcrossYears,
  getBracketsForYear,
  getSmartRecommendations,
} from '@/lib/calculators/purchase-tax';

// ============================================================
// API ישן (תאימות לאחור)
// ============================================================

describe('calculatePurchaseTax (backward-compat) — דירה ראשונה', () => {
  it('פטור מלא לדירה ב-1.5 מיליון', () => {
    const result = calculatePurchaseTax({
      propertyValue: 1_500_000,
      buyerType: 'first-home',
      isYoung: false,
    });
    expect(result.totalTax).toBe(0);
    expect(result.fullExemption).toBe(true);
    expect(result.partialExemption).toBe(false);
  });

  it('דירה ראשונה בדיוק בתקרת הפטור (1,978,745) = 0 מס', () => {
    const result = calculatePurchaseTax({
      propertyValue: 1_978_745,
      buyerType: 'first-home',
      isYoung: false,
    });
    expect(result.totalTax).toBe(0);
    expect(result.fullExemption).toBe(true);
  });

  it('דירה ראשונה ב-2.5 מיליון — מס נמוך עם פירוט מדרגות', () => {
    const result = calculatePurchaseTax({
      propertyValue: 2_500_000,
      buyerType: 'first-home',
      isYoung: false,
    });
    // 0 – 1,978,745: 0
    // 1,978,745 – 2,347,040 (368,295 × 3.5%): 12,890.33
    // 2,347,040 – 2,500,000 (152,960 × 5%): 7,648
    // סה"כ ≈ 20,538
    expect(result.totalTax).toBeCloseTo(20_538, -2);
    expect(result.fullExemption).toBe(false);
    expect(result.partialExemption).toBe(true);
    expect(result.breakdown.length).toBeGreaterThanOrEqual(2);
  });
});

// ============================================================
// API חדש: calculatePurchaseTaxByType
// ============================================================

describe('calculatePurchaseTaxByType — דירה ראשונה 2026', () => {
  it('ערך 0 מחזיר מס 0', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 0, buyerType: 'first-home' });
    expect(r.totalTax).toBe(0);
  });

  it('מתחת לתקרת פטור — 0 מס', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 1_000_000, buyerType: 'first-home' });
    expect(r.totalTax).toBe(0);
    expect(r.fullExemption).toBe(true);
  });

  it('דירה ב-3M: פירוט שלוש מדרגות', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 3_000_000, buyerType: 'first-home' });
    // 0–1,978,745: 0
    // 1,978,745–2,347,040 (368,295 × 3.5%): 12,890.33
    // 2,347,040–3,000,000 (652,960 × 5%): 32,648
    // סה"כ ≈ 45,538
    expect(r.totalTax).toBeCloseTo(45_538, -2);
    expect(r.breakdown.length).toBe(3);
    // מדרגה ראשונה = 0%
    expect(r.breakdown[0].rate).toBe(0);
    expect(r.breakdown[0].taxInBracket).toBe(0);
    // מדרגה שנייה = 3.5%
    expect(r.breakdown[1].rate).toBeCloseTo(0.035);
    // מדרגה שלישית = 5%
    expect(r.breakdown[2].rate).toBeCloseTo(0.05);
  });

  it('שיעור אפקטיבי מחושב נכון', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 2_000_000, buyerType: 'first-home' });
    const expected = (r.totalTax / 2_000_000) * 100;
    expect(r.effectiveRate).toBeCloseTo(expected, 5);
  });
});

describe('calculatePurchaseTaxByType — משקיע', () => {
  it('משקיע — 8% מהשקל הראשון, ב-2M', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 2_000_000, buyerType: 'investor' });
    expect(r.totalTax).toBeCloseTo(160_000, -1);
    expect(r.fullExemption).toBe(false);
    expect(r.partialExemption).toBe(false);
  });

  it('משקיע מעל 6.055M — חלק ב-10%', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 7_000_000, buyerType: 'investor' });
    // 6,055,070 × 8% = 484,405.6
    // 944,930 × 10% = 94,493
    // סה"כ ≈ 578,899
    expect(r.totalTax).toBeGreaterThan(570_000);
    expect(r.totalTax).toBeLessThan(590_000);
    expect(r.breakdown.length).toBe(2);
  });

  it('תושב חוץ — אותו חישוב כמו משקיע', () => {
    const investor = calculatePurchaseTaxByType({ propertyValue: 2_000_000, buyerType: 'investor' });
    const foreign  = calculatePurchaseTaxByType({ propertyValue: 2_000_000, buyerType: 'foreign' });
    expect(foreign.totalTax).toBeCloseTo(investor.totalTax, 1);
  });
});

describe('calculatePurchaseTaxByType — עולה חדש', () => {
  it('עולה חדש מתחת ל-5M — 0.5% מלא', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 3_000_000, buyerType: 'oleh' });
    expect(r.totalTax).toBeCloseTo(15_000, 0);
  });

  it('עולה חדש מעל 5M — 5% על החלק העודף', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 6_000_000, buyerType: 'oleh' });
    // 5,000,000 × 0.5% = 25,000
    // 1,000,000 × 5% = 50,000
    // סה"כ = 75,000
    expect(r.totalTax).toBeCloseTo(75_000, 0);
  });
});

describe('calculatePurchaseTaxByType — נכה', () => {
  it('נכה עד 2.5M — פטור מלא', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 2_000_000, buyerType: 'disabled' });
    expect(r.totalTax).toBe(0);
    expect(r.fullExemption).toBe(true);
  });

  it('נכה מעל 2.5M — מדרגות דירה ראשונה', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 3_000_000, buyerType: 'disabled' });
    const firstHome = calculatePurchaseTaxByType({ propertyValue: 3_000_000, buyerType: 'first-home' });
    expect(r.totalTax).toBeCloseTo(firstHome.totalTax, 0);
  });
});

describe('calculatePurchaseTaxByType — רכישה משותפת', () => {
  it('50% בעלות — מחושב על חצי השווי', () => {
    const full = calculatePurchaseTaxByType({ propertyValue: 4_000_000, buyerType: 'investor' });
    const half = calculatePurchaseTaxByType({ propertyValue: 4_000_000, buyerType: 'investor', ownershipPercent: 50 });
    // 4M × 8% = 320K; 2M × 8% = 160K
    expect(half.totalTax).toBeCloseTo(full.totalTax / 2, -2);
    expect(half.proportionalValue).toBeCloseTo(2_000_000, 0);
  });
});

describe('calculatePurchaseTaxByType — מתנה (gift)', () => {
  it('מתנה — ⅓ ממס הדירה הראשונה', () => {
    const firstHome = calculatePurchaseTaxByType({ propertyValue: 3_000_000, buyerType: 'first-home' });
    const gift      = calculatePurchaseTaxByType({ propertyValue: 3_000_000, buyerType: 'gift' });
    expect(gift.totalTax).toBeCloseTo(firstHome.totalTax / 3, -1);
  });
});

// ============================================================
// חישובי שנים
// ============================================================

describe('getBracketsForYear', () => {
  it('2024 דירה ראשונה — תקרת פטור נמוכה יותר', () => {
    const brackets = getBracketsForYear(2024, 'first-home');
    expect(brackets[0].upTo).toBeLessThan(1_978_745);
    expect(brackets[0].upTo).toBeCloseTo(1_919_155, -2);
  });

  it('2026 דירה ראשונה — תקרת פטור 1,978,745', () => {
    const brackets = getBracketsForYear(2026, 'first-home');
    expect(brackets[0].upTo).toBe(1_978_745);
  });

  it('מחזיר מדרגות משקיע לסוג foreign', () => {
    const investorB = getBracketsForYear(2026, 'investor');
    const foreignB  = getBracketsForYear(2026, 'foreign');
    expect(foreignB).toEqual(investorB);
  });
});

describe('compareAcrossYears', () => {
  it('מחזיר 3 שנים לדירה ראשונה', () => {
    const years = compareAcrossYears(2_500_000, 'first-home');
    expect(years.length).toBe(3);
    expect(years.map((y) => y.year)).toEqual([2024, 2025, 2026]);
  });

  it('2026 חייב יותר מ-2024 (שווי הפטור גדל = מס נמוך יותר)', () => {
    // בשנת 2026 תקרת הפטור גדולה יותר => מס נמוך יותר לדירה ראשונה
    const years = compareAcrossYears(2_500_000, 'first-home');
    const tax2024 = years.find((y) => y.year === 2024)!.totalTax;
    const tax2026 = years.find((y) => y.year === 2026)!.totalTax;
    expect(tax2026).toBeLessThanOrEqual(tax2024);
  });
});

// ============================================================
// calculateImmigrantDiscount
// ============================================================

describe('calculateImmigrantDiscount', () => {
  it('חיסכון עולה חדש חיובי לדירה מעל הפטור', () => {
    const d = calculateImmigrantDiscount(3_000_000, 2026);
    expect(d.savings).toBeGreaterThan(0);
    expect(d.olehTax).toBeLessThan(d.baseTax);
    expect(d.olehTax).toBeCloseTo(15_000, 0);
  });

  it('אחוז חיסכון בין 0 ל-100', () => {
    const d = calculateImmigrantDiscount(2_500_000, 2026);
    expect(d.savingsPercent).toBeGreaterThan(0);
    expect(d.savingsPercent).toBeLessThanOrEqual(100);
  });
});

// ============================================================
// compareAllBuyerTypes
// ============================================================

describe('compareAllBuyerTypes', () => {
  it('מחזיר 5 סוגי רוכשים', () => {
    const comparisons = compareAllBuyerTypes(2_500_000, 2026);
    expect(comparisons.length).toBe(5);
  });

  it('משקיע משלם יותר מדירה ראשונה', () => {
    const comparisons = compareAllBuyerTypes(2_500_000, 2026);
    const firstHome = comparisons.find((c) => c.buyerType === 'first-home')!;
    const investor  = comparisons.find((c) => c.buyerType === 'investor')!;
    expect(investor.totalTax).toBeGreaterThan(firstHome.totalTax);
  });

  it('עולה חדש משלם פחות מדירה ראשונה', () => {
    const comparisons = compareAllBuyerTypes(3_000_000, 2026);
    const firstHome = comparisons.find((c) => c.buyerType === 'first-home')!;
    const oleh      = comparisons.find((c) => c.buyerType === 'oleh')!;
    expect(oleh.totalTax).toBeLessThan(firstHome.totalTax);
  });
});

// ============================================================
// getSmartRecommendations
// ============================================================

describe('getSmartRecommendations', () => {
  it('למשקיע — מחזיר המלצת דירה ראשונה', () => {
    const recs = getSmartRecommendations(3_000_000, 'investor', 2026);
    expect(recs.length).toBeGreaterThan(0);
    const rec = recs[0];
    expect(rec.savings).toBeGreaterThan(0);
    expect(rec.currentTax).toBeGreaterThan(rec.alternativeTax);
  });

  it('לדירה ראשונה — המלצת עולה חדש עם חיסכון', () => {
    const recs = getSmartRecommendations(3_000_000, 'first-home', 2026);
    const olehRec = recs.find((r) => r.scenario.includes('עולה'));
    expect(olehRec).toBeDefined();
    expect(olehRec!.savings).toBeGreaterThan(0);
  });
});

// ============================================================
// אימות מתמטי של המדרגות (benchmark)
// ============================================================

describe('אימות מדרגות — ערכים ידועים', () => {
  it('דירה ראשונה ב-6,055,070 — בדיוק בתפר 5%/8%', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 6_055_070, buyerType: 'first-home' });
    // 0 – 1,978,745: 0
    // 1,978,745 – 2,347,040 (368,295 × 3.5%): 12,890.33
    // 2,347,040 – 6,055,070 (3,708,030 × 5%): 185,401.5
    // סה"כ: 198,291.8
    expect(r.totalTax).toBeCloseTo(198_292, -1);
  });

  it('משקיע ב-6,055,070 — בדיוק בתפר 8%/10%', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 6_055_070, buyerType: 'investor' });
    // 6,055,070 × 8% = 484,405.6
    expect(r.totalTax).toBeCloseTo(484_406, -1);
  });

  it('שיעור אפקטיבי תמיד קטן מהשיעור המרבי', () => {
    const r = calculatePurchaseTaxByType({ propertyValue: 10_000_000, buyerType: 'investor' });
    // מקסימום 10% — שיעור אפקטיבי < 10% תמיד (כי 8% על חלק)
    expect(r.effectiveRate).toBeLessThan(10);
    expect(r.effectiveRate).toBeGreaterThan(8);
  });
});
