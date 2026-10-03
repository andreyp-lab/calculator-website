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
  it('מחשב זיכוי פנסיה כחלק מהחבות השנתית ולא כבונוס להחזר', () => {
    const result = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [{ taxableIncome: 180_000, taxWithheld: 20_000, insuredIncome: 180_000, employeePensionContributions: 10_800 }],
      creditPoints: 2.25,
    });
    expect(result.pensionEligibleContributions).toBeCloseTo(8_148, 6);
    expect(result.pensionTaxCredit).toBeCloseTo(2_851.8, 6);
    expect(result.taxableIncome).toBe(180_000);
    expect(result.taxAfterCredits).toBeCloseTo(16_006.2, 6);
    expect(result.estimatedRefund).toBeCloseTo(3_993.8, 6);
  });

  it('מפעיל תקרת פנסיה אחת גם כששני מעסיקים נתנו זיכוי בנפרד', () => {
    const result = calculateTaxRefund({
      taxYear: '2025',
      incomeSources: [
        { taxableIncome: 120_000, taxWithheld: 0, insuredIncome: 120_000, employeePensionContributions: 8_400 },
        { taxableIncome: 120_000, taxWithheld: 0, insuredIncome: 120_000, employeePensionContributions: 8_400 },
      ],
      creditPoints: 2.25,
    });
    expect(result.pensionContributions).toBe(16_800);
    expect(result.pensionTaxCredit).toBeCloseTo(2_851.8, 6);
  });

  it('מגביל לפי ההפקדה בפועל ומונע חישוב חסר כשחלק מהשכר אינו מבוטח', () => {
    const base = { taxYear: '2025' as const, creditPoints: 0 };
    const lowDeposit = calculateTaxRefund({ ...base, incomeSources: [{ taxableIncome: 100_000, taxWithheld: 0, insuredIncome: 100_000, employeePensionContributions: 2_000 }] });
    expect(lowDeposit.pensionTaxCredit).toBeCloseTo(700, 6);
    expect(() => calculateTaxRefund({ ...base, incomeSources: [{ taxableIncome: 180_000, taxWithheld: 0, insuredIncome: 30_000, employeePensionContributions: 10_000 }] })).toThrow('משכר מבוטח');
    expect(() => calculateTaxRefund({ ...base, recognizedDeductions: 1_000, incomeSources: [{ taxableIncome: 100_000, taxWithheld: 0, insuredIncome: 100_000, employeePensionContributions: 6_000 }] })).toThrow('ללא ניכויים');
  });

  it('הזיכוי הידני מחליף את האוטומטי ואינו מצטבר אליו', () => {
    const result = calculateTaxRefund({
      taxYear: '2025', creditPoints: 2.25,
      incomeSources: [{ taxableIncome: 180_000, taxWithheld: 20_000, insuredIncome: 180_000, employeePensionContributions: 10_800 }],
      pensionCreditMode: 'manual', manualPensionCredit: 3_000,
    });
    expect(result.pensionTaxCredit).toBe(3_000);
    expect(result.estimatedRefund).toBeCloseTo(4_142, 6);
  });

  it('מגביל הפקדת שכיר ל-7% מההכנסה המבוטחת גם בשכר נמוך', () => {
    const result = calculateTaxRefund({ taxYear: '2025', creditPoints: 0,
      incomeSources: [{ taxableIncome: 20_000, taxWithheld: 0, insuredIncome: 20_000, employeePensionContributions: 3_000 }],
    });
    expect(result.pensionEligibleContributions).toBeCloseTo(1_400, 6);
    expect(result.pensionTaxCredit).toBeCloseTo(490, 6);
  });

  it('לא מאפשר למקורות שגויים להתקזז ולהיראות כשכר מבוטח מלא', () => {
    expect(() => calculateTaxRefund({ taxYear: '2025', creditPoints: 0,
      incomeSources: [
        { taxableIncome: 50_000, taxWithheld: 0, insuredIncome: 60_000, employeePensionContributions: 3_000 },
        { taxableIncome: 50_000, taxWithheld: 0, insuredIncome: 40_000, employeePensionContributions: 3_000 },
      ],
    })).toThrow('משכר מבוטח');
  });

  it.each([
    ['2020', 2_587.2], ['2021', 2_557.8], ['2022', 2_616.6],
    ['2023', 2_763.6], ['2024', 2_851.8], ['2025', 2_851.8],
  ] as const)('מחיל תקרת זיכוי הפקדות בשנת %s', (taxYear, expected) => {
    const result = calculateTaxRefund({ taxYear, creditPoints: 0,
      incomeSources: [{ taxableIncome: 300_000, taxWithheld: 0, insuredIncome: 300_000, employeePensionContributions: 21_000 }],
    });
    expect(result.pensionTaxCredit).toBeCloseTo(expected, 6);
  });

  it('זיכוי פנסיה שאינו מנוצל אינו יוצר החזר מעבר למס שנוכה', () => {
    const result = calculateTaxRefund({ taxYear: '2025', creditPoints: 2.75,
      incomeSources: [{ taxableIncome: 30_000, taxWithheld: 100, insuredIncome: 30_000, employeePensionContributions: 2_100 }],
    });
    expect(result.taxAfterCredits).toBe(0);
    expect(result.estimatedRefund).toBe(100);
  });

  it.each([
    ['2020', 190], ['2021', 190], ['2022', 190], ['2023', 200], ['2024', 207], ['2025', 207],
  ] as const)('מחיל את סף התרומות לשנת %s באופן קפדני', (taxYear, threshold) => {
    const base = { taxYear, creditPoints: 0, incomeSources: [{ taxableIncome: 180_000, taxWithheld: 20_000 }] };
    expect(calculateTaxRefund({ ...base, donations: threshold }).donationTaxCredit).toBe(0);
    expect(calculateTaxRefund({ ...base, donations: threshold + 1 }).donationTaxCredit).toBeCloseTo((threshold + 1) * 0.35, 6);
  });

  it('מחשב תרומות עד 30% מההכנסה ומציג את העודף בנפרד', () => {
    const result = calculateTaxRefund({ taxYear: '2025', creditPoints: 0,
      incomeSources: [{ taxableIncome: 100_000, taxWithheld: 10_000 }], donations: 40_000,
    });
    expect(result.donationEligibleAmount).toBe(30_000);
    expect(result.donationTaxCredit).toBe(10_500);
    expect(result.donationExcess).toBe(10_000);
    expect(result.estimatedRefund).toBeLessThanOrEqual(10_000);
  });

  it('תקרת התרומה המוחלטת מגבילה גם כש-30% מההכנסה גבוהים ממנה', () => {
    const result = calculateTaxRefund({ taxYear: '2025', creditPoints: 0,
      incomeSources: [{ taxableIncome: 100_000_000, taxWithheld: 0 }], donations: 20_000_000,
    });
    expect(result.donationEligibleAmount).toBe(10_354_816);
  });

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
