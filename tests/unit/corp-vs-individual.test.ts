/**
 * בדיקות יחידה - חברה בע"מ vs עוסק מורשה
 *
 * 15+ בדיקות המכסות:
 * - חישוב עוסק מורשה
 * - חישוב חברה (דיבידנד, משכורת, מיקס)
 * - נקודת איזון
 * - השוואת רמות הכנסה
 * - תחזית רב-שנתית
 * - קצוות ומקרים מיוחדים
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCorpVsIndividual,
  calculateAsIndividual,
  calculateAsCorporationDividend,
  calculateAsCorporationSalary,
  calculateAsCorporationMix,
  findBreakevenPoint,
  compareAtIncomeLevels,
  calculateMultiYearProjection,
  CORP_TAX_2026,
  DIVIDEND_TAX_CONTROLLING,
  CORP_EFFECTIVE_ALL_DIV,
} from '@/lib/calculators/corporation-vs-individual';

// ====================================================================
// עזרים
// ====================================================================

const DEFAULT_INPUT = {
  annualProfit: 500_000,
  creditPoints: 2.25,
  salaryDividendMix: 0.3,
  corpRunningCosts: 20_000,
  isControllingOwner: true,
  annualGrowthRate: 0.1,
  projectionYears: 5,
  includeStudyFundIndividual: false,
  includeStudyFundCorp: false,
  studyFundRateIndividual: 0.045,
};

// ====================================================================
// קבועים
// ====================================================================

describe('קבועי מס 2026', () => {
  it('מס חברות 23%', () => {
    expect(CORP_TAX_2026).toBe(0.23);
  });

  it('מס דיבידנד מהותי 33%', () => {
    expect(DIVIDEND_TAX_CONTROLLING).toBe(0.33);
  });

  it('שיעור מצרפי חברה+דיב~ 48.41%', () => {
    const expected = 1 - (1 - 0.23) * (1 - 0.33);
    expect(CORP_EFFECTIVE_ALL_DIV).toBeCloseTo(expected, 4);
    expect(CORP_EFFECTIVE_ALL_DIV).toBeGreaterThan(0.48);
    expect(CORP_EFFECTIVE_ALL_DIV).toBeLessThan(0.49);
  });
});

// ====================================================================
// עוסק מורשה
// ====================================================================

describe('calculateAsIndividual', () => {
  it('רווח אפס — ללא מס, נטו 0', () => {
    const r = calculateAsIndividual(0, 2.25);
    expect(r.totalTax).toBe(0);
    expect(r.netToOwner).toBe(0);
    expect(r.effectiveTaxRate).toBe(0);
  });

  it('רווח נמוך 100K — מס הכנסה + ב.ל. נמוכים', () => {
    const r = calculateAsIndividual(100_000, 2.25);
    expect(r.grossProfit).toBe(100_000);
    expect(r.incomeTax).toBeGreaterThan(0);
    expect(r.socialSecurity).toBeGreaterThan(0);
    expect(r.netToOwner).toBeLessThan(100_000);
    expect(r.netToOwner).toBeGreaterThan(0);
    expect(r.effectiveTaxRate).toBeLessThan(0.35);
  });

  it('רווח 500K — שיעור מס אפקטיבי סביר (30%-50%)', () => {
    const r = calculateAsIndividual(500_000, 2.25);
    expect(r.effectiveTaxRate).toBeGreaterThan(0.30);
    expect(r.effectiveTaxRate).toBeLessThan(0.55);
    // נטו + מסים = רווח ברוטו
    expect(r.netToOwner + r.totalTax).toBeCloseTo(500_000, 0);
  });

  it('יותר נקודות זיכוי → פחות מס', () => {
    const low = calculateAsIndividual(500_000, 2.25);
    const high = calculateAsIndividual(500_000, 5.0);
    expect(high.incomeTax).toBeLessThan(low.incomeTax);
    expect(high.netToOwner).toBeGreaterThan(low.netToOwner);
  });

  it('ב.ל. עצמאי: שיעור מופחת 6.1% עד 90,264 ₪', () => {
    const r = calculateAsIndividual(90_264, 2.25);
    const expectedNI = 90_264 * 0.061;
    expect(r.socialSecurity).toBeCloseTo(expectedNI, -1); // ±10 ₪
  });

  it('ב.ל. עצמאי: תקרה מקסימלית — לא גדל מעל 622,920', () => {
    const atCap = calculateAsIndividual(622_920, 2.25);
    const aboveCap = calculateAsIndividual(2_000_000, 2.25);
    expect(aboveCap.socialSecurity).toBeCloseTo(atCap.socialSecurity, -2); // ±100 ₪
  });

  it('קרן השתלמות מפחיתה מס הכנסה', () => {
    const without = calculateAsIndividual(500_000, 2.25, 0);
    const with_sf = calculateAsIndividual(500_000, 2.25, 22_500);
    expect(with_sf.incomeTax).toBeLessThan(without.incomeTax);
    expect(with_sf.netToOwner).toBeLessThan(without.netToOwner); // נכנס לחסכון
  });
});

// ====================================================================
// חברה — דיבידנד
// ====================================================================

describe('calculateAsCorporationDividend', () => {
  it('בעל מניות מהותי — שיעור מצרפי ~48.4%', () => {
    const r = calculateAsCorporationDividend(500_000, 0, true);
    const expectedRate = 1 - (1 - 0.23) * (1 - 0.33);
    expect(r.effectiveTaxRate).toBeCloseTo(expectedRate, 3);
  });

  it('בעל מניות לא מהותי — שיעור נמוך יותר (~42.75%)', () => {
    const controlling = calculateAsCorporationDividend(500_000, 0, true);
    const nonControlling = calculateAsCorporationDividend(500_000, 0, false);
    expect(nonControlling.effectiveTaxRate).toBeLessThan(controlling.effectiveTaxRate);
    const expected = 1 - (1 - 0.23) * (1 - 0.25);
    expect(nonControlling.effectiveTaxRate).toBeCloseTo(expected, 3);
  });

  it('עלויות חברה מפחיתות את הנטו', () => {
    const withoutCosts = calculateAsCorporationDividend(500_000, 0, true);
    const withCosts = calculateAsCorporationDividend(500_000, 20_000, true);
    expect(withCosts.netToOwner).toBeLessThan(withoutCosts.netToOwner);
    // הפחתה: 20K עלויות, אבל עלויות מוכרות → חוסכות 23% מס חברות
    // נטו ירידה = 20K × (1 - 0.23) × (1 - 0.33) ≈ 10.3K
    const diff = withoutCosts.netToOwner - withCosts.netToOwner;
    expect(diff).toBeGreaterThan(5_000);
    expect(diff).toBeLessThan(20_000);
  });

  it('מס חברות מחושב על רווח לאחר הוצאות', () => {
    const r = calculateAsCorporationDividend(500_000, 20_000, true);
    const expectedCorpTax = (500_000 - 20_000) * 0.23;
    expect(r.corporateTax).toBeCloseTo(expectedCorpTax, 0);
  });

  it('נטו + מסים + עלויות = רווח ברוטו', () => {
    const r = calculateAsCorporationDividend(500_000, 20_000, true);
    const total = r.netToOwner + r.totalTax + r.corpRunningCosts;
    expect(total).toBeCloseTo(500_000, -1);
  });
});

// ====================================================================
// חברה — משכורת
// ====================================================================

describe('calculateAsCorporationSalary', () => {
  it('נטו משכורת חיובי', () => {
    const r = calculateAsCorporationSalary(500_000, 2.25, 0);
    expect(r.netToOwner).toBeGreaterThan(0);
    expect(r.incomeTax).toBeGreaterThan(0);
    expect(r.socialSecurity).toBeGreaterThan(0);
  });

  it('עלות מעסיק כלולה בהוצאה', () => {
    // סה"כ הוצאה מהחברה = רווח ברוטו (הכל הולך לשכר + מעסיק)
    const r = calculateAsCorporationSalary(500_000, 2.25, 0);
    expect(r.grossProfit).toBe(500_000);
    expect(r.corporateTax).toBe(0); // אין מס חברות — הכל הוצאות שכר
  });
});

// ====================================================================
// חברה — מיקס
// ====================================================================

describe('calculateAsCorporationMix', () => {
  it('מיקס 50/50 — בין דיבידנד מלא למשכורת מלאה', () => {
    const div = calculateAsCorporationDividend(500_000, 0, true);
    const sal = calculateAsCorporationSalary(500_000, 2.25, 0);
    const mix = calculateAsCorporationMix(500_000, 2.25, 0.5, 0, true);
    // נטו מיקס צריך להיות בין דיבידנד למשכורת (בערך)
    const minNet = Math.min(div.netToOwner, sal.netToOwner);
    const maxNet = Math.max(div.netToOwner, sal.netToOwner);
    // בגלל שמיקס לא בדיוק ממוצע ליניארי, נוודא רק שהוא לא קיצוני
    expect(mix.netToOwner).toBeGreaterThan(minNet * 0.95);
    expect(mix.netToOwner).toBeLessThan(maxNet * 1.05);
  });

  it('מיקס 0% משכורת = דיבידנד מלא', () => {
    const div = calculateAsCorporationDividend(500_000, 0, true);
    const mix0 = calculateAsCorporationMix(500_000, 2.25, 0, 0, true);
    expect(mix0.netToOwner).toBeCloseTo(div.netToOwner, -2);
  });

  it('קרן השתלמות בחברה מפחיתה מס הכנסה', () => {
    const withoutSF = calculateAsCorporationMix(500_000, 2.25, 0.5, 0, true, false);
    const withSF = calculateAsCorporationMix(500_000, 2.25, 0.5, 0, true, true);
    expect(withSF.incomeTax).toBeLessThan(withoutSF.incomeTax);
  });
});

// ====================================================================
// נקודת איזון
// ====================================================================

describe('findBreakevenPoint', () => {
  it('נקודת האיזון חיובית (גבוהה מ-200K)', () => {
    // נקודת האיזון תלויה בעלויות החברה ובנקודות הזיכוי
    // עם 20K עלויות ו-2.25 נקודות זיכוי, הנקודה יכולה להיות גבוהה בגלל תקרת ב.ל.
    const be = findBreakevenPoint(2.25, 20_000, true);
    expect(be).toBeGreaterThan(200_000);
    expect(typeof be).toBe('number');
    expect(isNaN(be)).toBe(false);
  });

  it('עלויות חברה גבוהות → נקודת איזון גבוהה יותר', () => {
    const low = findBreakevenPoint(2.25, 10_000, true);
    const high = findBreakevenPoint(2.25, 40_000, true);
    expect(high).toBeGreaterThan(low);
  });

  it('יותר נקודות זיכוי → נקודת איזון גבוהה יותר', () => {
    const few = findBreakevenPoint(2.25, 20_000, true);
    const many = findBreakevenPoint(6.0, 20_000, true);
    expect(many).toBeGreaterThan(few);
  });

  it('מעל נקודת האיזון — חברה עדיפה', () => {
    const be = findBreakevenPoint(2.25, 20_000, true);
    if (be > 0) {
      const aboveBE = be + 50_000;
      const ind = calculateAsIndividual(aboveBE, 2.25);
      const corp = calculateAsCorporationDividend(aboveBE, 20_000, true);
      expect(corp.netToOwner).toBeGreaterThan(ind.netToOwner);
    }
  });
});

// ====================================================================
// השוואת רמות הכנסה
// ====================================================================

describe('compareAtIncomeLevels', () => {
  it('מחזיר 7 רמות הכנסה', () => {
    const levels = [200_000, 300_000, 500_000, 700_000, 1_000_000, 2_000_000, 5_000_000];
    const result = compareAtIncomeLevels(levels, 2.25, 20_000, true, 0.3);
    expect(result).toHaveLength(7);
  });

  it('ברמת הכנסה גבוהה (2M) — חברה מנצחת', () => {
    const levels = [2_000_000];
    const result = compareAtIncomeLevels(levels, 2.25, 20_000, true, 0.3);
    expect(result[0].winner).toBe('corp');
    expect(result[0].savingsWithCorp).toBeGreaterThan(0);
  });

  it('ברווח 5M — שיעור מס עוסק גבוה יותר מחברה דיבידנד (ב.ל. בתקרה)', () => {
    // ברווחים מעל תקרת ב.ל. (~622K), שיעור המס האפקטיבי של עוסק מורשה עולה
    // (כי ב.ל. כבר לא גדל, אבל מס הכנסה 50% ממשיך לגדול)
    // בעוד שיעור החברה+דיבידנד נשאר ~48.4%
    const levels = [5_000_000];
    const result = compareAtIncomeLevels(levels, 2.25, 0, true, 0.3);
    // ברווח 5M: עוסק שיעור מצרפי ~50%+ב.ל. קבוע → גבוה מ-48.4% של חברה
    expect(result[0].individual.effectiveTaxRate).toBeGreaterThan(
      result[0].corpDividend.effectiveTaxRate,
    );
  });

  it('רמות הכנסה בסדר עולה — נטו גדל', () => {
    const levels = [200_000, 500_000, 1_000_000];
    const result = compareAtIncomeLevels(levels, 2.25, 20_000, true, 0.3);
    expect(result[1].individual.netToOwner).toBeGreaterThan(result[0].individual.netToOwner);
    expect(result[2].individual.netToOwner).toBeGreaterThan(result[1].individual.netToOwner);
  });
});

// ====================================================================
// תחזית רב-שנתית
// ====================================================================

describe('calculateMultiYearProjection', () => {
  it('מחזיר את מספר השנים שביקשנו', () => {
    const proj = calculateMultiYearProjection(500_000, 0.1, 5, 2.25, 20_000, true, 0.3);
    expect(proj).toHaveLength(5);
  });

  it('שנה 1 — רווח = הרווח הראשוני', () => {
    const proj = calculateMultiYearProjection(500_000, 0.1, 5, 2.25, 20_000, true, 0.3);
    expect(proj[0].annualProfit).toBe(500_000);
  });

  it('שנה 2 — רווח גדל לפי קצב הצמיחה', () => {
    const proj = calculateMultiYearProjection(500_000, 0.1, 5, 2.25, 20_000, true, 0.3);
    expect(proj[1].annualProfit).toBeCloseTo(500_000 * 1.1, -1);
  });

  it('חיסכון מצטבר עולה עם הזמן (אם חברה עדיפה)', () => {
    // ברווח גבוה, חברה כנראה תנצח
    const proj = calculateMultiYearProjection(800_000, 0.1, 5, 2.25, 20_000, true, 0.3);
    const positive = proj.filter((p) => p.cumulativeSaving > 0);
    expect(positive.length).toBeGreaterThan(0);
  });

  it('צמיחה 0% — כל השנים אותו רווח', () => {
    const proj = calculateMultiYearProjection(500_000, 0, 3, 2.25, 20_000, true, 0.3);
    expect(proj[0].annualProfit).toBe(500_000);
    expect(proj[1].annualProfit).toBe(500_000);
    expect(proj[2].annualProfit).toBe(500_000);
  });

  it('מגביל ל-15 שנים מקסימום', () => {
    const proj = calculateMultiYearProjection(500_000, 0.1, 20, 2.25, 20_000, true, 0.3);
    expect(proj.length).toBeLessThanOrEqual(15);
  });
});

// ====================================================================
// פונקציה ראשית
// ====================================================================

describe('calculateCorpVsIndividual', () => {
  it('מחזיר את כל ארבעת התרחישים', () => {
    const r = calculateCorpVsIndividual(DEFAULT_INPUT);
    expect(r.individual).toBeDefined();
    expect(r.corporationDividend).toBeDefined();
    expect(r.corporationSalary).toBeDefined();
    expect(r.corporationMix).toBeDefined();
  });

  it('ממליץ על אחת מ-4 אפשרויות', () => {
    const r = calculateCorpVsIndividual(DEFAULT_INPUT);
    expect(['individual', 'corporationDividend', 'corporationSalary', 'corporationMix']).toContain(
      r.recommendation,
    );
  });

  it('נטו הממולץ הוא הגבוה ביותר', () => {
    const r = calculateCorpVsIndividual(DEFAULT_INPUT);
    const recNet = r[r.recommendation].netToOwner;
    expect(recNet).toBeGreaterThanOrEqual(r.individual.netToOwner);
    expect(recNet).toBeGreaterThanOrEqual(r.corporationDividend.netToOwner);
    expect(recNet).toBeGreaterThanOrEqual(r.corporationSalary.netToOwner);
    expect(recNet).toBeGreaterThanOrEqual(r.corporationMix.netToOwner);
  });

  it('מחזיר נקודת איזון', () => {
    const r = calculateCorpVsIndividual(DEFAULT_INPUT);
    expect(typeof r.breakEvenProfit).toBe('number');
  });

  it('מחזיר 7 רמות הכנסה', () => {
    const r = calculateCorpVsIndividual(DEFAULT_INPUT);
    expect(r.incomeLevelComparisons).toHaveLength(7);
  });

  it('מחזיר תחזית 5 שנים', () => {
    const r = calculateCorpVsIndividual(DEFAULT_INPUT);
    expect(r.yearProjections).toHaveLength(5);
  });

  it('רווח 0 — ללא קריסה, נטו 0', () => {
    const r = calculateCorpVsIndividual({ ...DEFAULT_INPUT, annualProfit: 0 });
    expect(r.individual.netToOwner).toBe(0);
    expect(r.corporationDividend.netToOwner).toBe(0);
  });

  it('רווח גבוה מאוד (5M) — חברה בוודאי עדיפה', () => {
    const r = calculateCorpVsIndividual({ ...DEFAULT_INPUT, annualProfit: 5_000_000 });
    expect(r.recommendation).not.toBe('individual');
    expect(r.taxSavingsVsIndividual).toBeGreaterThan(0);
  });

  it('corpCostsPayback מחושב כאשר חסכון חיובי', () => {
    const r = calculateCorpVsIndividual({ ...DEFAULT_INPUT, annualProfit: 1_000_000 });
    if (r.corpCostsPayback.yearlySaving > 0) {
      expect(r.corpCostsPayback.monthsToBreakEven).not.toBeNull();
      expect(r.corpCostsPayback.monthsToBreakEven as number).toBeGreaterThan(0);
    }
  });

  it('קרן השתלמות לעוסק — מפחיתה מס', () => {
    const without = calculateCorpVsIndividual({
      ...DEFAULT_INPUT,
      includeStudyFundIndividual: false,
    });
    const withSF = calculateCorpVsIndividual({
      ...DEFAULT_INPUT,
      includeStudyFundIndividual: true,
    });
    expect(withSF.individual.incomeTax).toBeLessThan(without.individual.incomeTax);
  });
});
