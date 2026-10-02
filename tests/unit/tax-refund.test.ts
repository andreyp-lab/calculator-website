import { describe, expect, it } from 'vitest';
import {
  calculateTaxRefund,
  TAX_REFUND_YEAR_RULES,
  type TaxRefundYear,
} from '@/lib/calculators/tax-refund';

describe('TAX_REFUND_YEAR_RULES', () => {
  it.each([
    ['2020', 75_960, 505_920, 219, 651_600, '2026-12-31'],
    ['2021', 75_480, 502_920, 218, 647_640, '2027-12-31'],
    ['2022', 77_400, 514_920, 223, 663_240, '2028-12-31'],
    ['2023', 81_480, 542_160, 235, 698_280, '2029-12-31'],
    ['2024', 84_120, 560_280, 242, 721_560, '2030-12-31'],
    ['2025', 84_120, 560_280, 242, 721_560, '2031-12-31'],
  ] as const)(
    'כולל את קבועי רשות המסים לשנת %s',
    (year, firstCeiling, fifthCeiling, creditPoint, surtaxThreshold, deadline) => {
      const rule = TAX_REFUND_YEAR_RULES[year];

      expect(rule.brackets[0]).toEqual({ upTo: firstCeiling, rate: 0.1 });
      expect(rule.brackets[4]).toEqual({ upTo: fifthCeiling, rate: 0.35 });
      expect(rule.brackets[5]).toEqual({ upTo: Infinity, rate: 0.47 });
      expect(rule.creditPointMonthly).toBe(creditPoint);
      expect(rule.surtaxThreshold).toBe(surtaxThreshold);
      expect(rule.claimDeadline).toBe(deadline);
      expect(rule.sourceUrl).toContain('gov.il');
    },
  );
});

describe('calculateTaxRefund', () => {
  it('מחשב אומדן החזר לשכיר לפי טופס 106 שנתי', () => {
    const result = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: 180_000, taxWithheld: 20_000 }],
      creditPoints: 2.25,
    });

    expect(result.bracketTax).toBeCloseTo(25_392, 2);
    expect(result.creditPointsAmount).toBe(6_534);
    expect(result.taxAfterCredits).toBeCloseTo(18_858, 2);
    expect(result.estimatedRefund).toBeCloseTo(1_142, 2);
    expect(result.estimatedBalanceDue).toBe(0);
  });

  it('מסכם כמה טופסי 106 לפני חישוב המס השנתי', () => {
    const combined = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: 180_000, taxWithheld: 20_000 }],
      creditPoints: 2.25,
    });
    const split = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [
        { taxableIncome: 75_000, taxWithheld: 7_500 },
        { taxableIncome: 105_000, taxWithheld: 12_500 },
      ],
      creditPoints: 2.25,
    });

    expect(split.totalIncomeBeforeDeductions).toBe(180_000);
    expect(split.totalTaxWithheld).toBe(20_000);
    expect(split.taxAfterCredits).toBe(combined.taxAfterCredits);
    expect(split.estimatedRefund).toBe(combined.estimatedRefund);
  });

  it('מפחית רק ניכוי מוכר שהוזן במפורש', () => {
    const result = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: 180_000, taxWithheld: 20_000 }],
      creditPoints: 2.25,
      recognizedDeductions: 10_000,
    });

    expect(result.taxableIncome).toBe(170_000);
    expect(result.taxAfterCredits).toBeCloseTo(16_858, 2);
    expect(result.estimatedRefund).toBeCloseTo(3_142, 2);
  });

  it('מציג יתרת מס אפשרית ולא מוחק תוצאה שלילית', () => {
    const result = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: 180_000, taxWithheld: 10_000 }],
      creditPoints: 2.25,
    });

    expect(result.estimatedRefund).toBe(0);
    expect(result.estimatedBalanceDue).toBeCloseTo(8_858, 2);
  });

  it('אינו הופך נקודות או זיכויים שלא נוצלו להחזר מזומן', () => {
    const result = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: 40_000, taxWithheld: 700 }],
      creditPoints: 20,
      additionalTaxCredits: 50_000,
    });

    expect(result.taxAfterCredits).toBe(0);
    expect(result.estimatedRefund).toBe(700);
  });

  it('מוסיף מס יסף בנפרד ורציף מעל הסף', () => {
    const threshold = TAX_REFUND_YEAR_RULES['2025'].surtaxThreshold;
    const atThreshold = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: threshold, taxWithheld: 0 }],
      creditPoints: 0,
    });
    const oneShekelAbove = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: threshold + 1, taxWithheld: 0 }],
      creditPoints: 0,
    });

    expect(atThreshold.surtax).toBe(0);
    expect(oneShekelAbove.surtax).toBeCloseTo(0.03, 8);
    expect(oneShekelAbove.taxAfterCredits - atThreshold.taxAfterCredits).toBeCloseTo(0.5, 8);
  });

  it.each(Object.keys(TAX_REFUND_YEAR_RULES) as TaxRefundYear[])(
    'שומר על רציפות בכל גבולות המדרגות בשנת %s',
    (taxYear) => {
      const rule = TAX_REFUND_YEAR_RULES[taxYear];

      for (const bracket of rule.brackets.slice(0, -1)) {
        const below = calculateTaxRefund({
          taxYear,
          incomeSources: [{ taxableIncome: bracket.upTo - 1, taxWithheld: 0 }],
          creditPoints: 0,
        });
        const at = calculateTaxRefund({
          taxYear,
          incomeSources: [{ taxableIncome: bracket.upTo, taxWithheld: 0 }],
          creditPoints: 0,
        });
        const above = calculateTaxRefund({
          taxYear,
          incomeSources: [{ taxableIncome: bracket.upTo + 1, taxWithheld: 0 }],
          creditPoints: 0,
        });

        expect(at.taxAfterCredits).toBeGreaterThan(below.taxAfterCredits);
        expect(above.taxAfterCredits).toBeGreaterThan(at.taxAfterCredits);
        expect(above.taxAfterCredits - at.taxAfterCredits).toBeLessThanOrEqual(0.5);
      }
    },
  );

  it('מנקה ערכים שליליים ולא מאפשר ניכוי גדול מההכנסה', () => {
    const result = calculateTaxRefund({
      taxYear: '2020',
      incomeSources: [
        { taxableIncome: -100, taxWithheld: Number.NaN },
        { taxableIncome: 10_000, taxWithheld: -500 },
      ],
      creditPoints: -2,
      recognizedDeductions: 50_000,
      additionalTaxCredits: -10,
    });

    expect(result.totalIncomeBeforeDeductions).toBe(10_000);
    expect(result.recognizedDeductions).toBe(10_000);
    expect(result.taxableIncome).toBe(0);
    expect(result.totalTaxWithheld).toBe(0);
    expect(result.taxAfterCredits).toBe(0);
    expect(result.estimatedRefund).toBe(0);
    expect(result.estimatedBalanceDue).toBe(0);
  });
});
