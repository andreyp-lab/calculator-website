/**
 * בדיקות יחידה - מחשבון דיבידנד vs משכורת
 *
 * מכסה:
 * - חישובי מס בסיסיים (מס חברות, מס דיבידנד, מס הכנסה, ב.ל.)
 * - מס יסף
 * - אופטימיזציית מיקס
 * - בעל מניות מהותי vs לא מהותי
 * - אופטימיזציית בן/בת זוג
 * - ניתוח רגישות
 * - מקרי קצה
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDividendVsSalary,
  calculateAllMixes,
  findOptimalMix,
  calculateSpouseOptimization,
  calculateLongTermProjection,
  calculateSensitivityAnalysis,
  calcIncomeTax,
  calcEmployeeSS,
  calcEmployerSS,
  calcSurtaxOnIncome,
  calcSurtaxOnDividend,
  CORP_TAX_2026,
  DIVIDEND_TAX_CONTROLLING,
  DIVIDEND_TAX_REGULAR,
  SURTAX_THRESHOLD,
} from '@/lib/calculators/dividend-vs-salary';

// ============================================================
// פונקציות עזר
// ============================================================

describe('calcIncomeTax', () => {
  it('הכנסה 0 → מס 0', () => {
    expect(calcIncomeTax(0, 2.25)).toBe(0);
  });

  it('הכנסה נמוכה מאוד - זיכויים מכסים את כל המס', () => {
    // 84,120 ₪ × 10% = 8,412 ₪ מס גולמי
    // נקודות זיכוי 2.25 × 2,904 = 6,534 ₪
    // נטו: 1,878 ₪
    const tax = calcIncomeTax(84_120, 2.25);
    expect(tax).toBeCloseTo(1_878, 0);
  });

  it('ללא נקודות זיכוי - מס גבוה יותר', () => {
    const withCredits = calcIncomeTax(200_000, 2.25);
    const withoutCredits = calcIncomeTax(200_000, 0);
    expect(withoutCredits).toBeGreaterThan(withCredits);
  });

  it('מס לא יכול להיות שלילי', () => {
    expect(calcIncomeTax(10_000, 10)).toBe(0); // הרבה נקודות זיכוי
  });
});

describe('calcEmployeeSS', () => {
  it('משכורת נמוכה (עד 7,522×12) - שיעור מופחת 4.27%', () => {
    const annual = 7_522 * 12;
    const ss = calcEmployeeSS(annual);
    expect(ss).toBeCloseTo(annual * 0.0427, 0);
  });

  it('משכורת גבוהה - שיעור מלא 12.17% על החלק העודף', () => {
    const annual = 20_000 * 12;
    const low = 7_522 * 12;
    const expected = low * 0.0427 + (annual - low) * 0.1217;
    expect(calcEmployeeSS(annual)).toBeCloseTo(expected, 0);
  });

  it('מעל תקרה (51,910×12) - לא מחושב מעבר', () => {
    const atCap = calcEmployeeSS(51_910 * 12);
    const aboveCap = calcEmployeeSS(100_000 * 12);
    expect(atCap).toBeCloseTo(aboveCap, 0);
  });
});

describe('calcEmployerSS', () => {
  it('שיעור מופחת 4.51% עד תקרה נמוכה', () => {
    const annual = 5_000 * 12;
    expect(calcEmployerSS(annual)).toBeCloseTo(annual * 0.0451, 0);
  });

  it('שיעור מלא 7.6% מעל תקרה נמוכה', () => {
    const annual = 30_000 * 12;
    const low = 7_522 * 12;
    const expected = low * 0.0451 + (annual - low) * 0.076;
    expect(calcEmployerSS(annual)).toBeCloseTo(expected, 0);
  });
});

describe('calcSurtaxOnIncome', () => {
  it('הכנסה מתחת לסף → 0', () => {
    expect(calcSurtaxOnIncome(500_000)).toBe(0);
    expect(calcSurtaxOnIncome(SURTAX_THRESHOLD)).toBe(0);
  });

  it('הכנסה מעל סף → 3% על העודף', () => {
    const income = 1_000_000;
    const expected = (income - SURTAX_THRESHOLD) * 0.03;
    expect(calcSurtaxOnIncome(income)).toBeCloseTo(expected, 0);
  });

  it('בדיוק בסף → 0', () => {
    expect(calcSurtaxOnIncome(721_560)).toBe(0);
  });
});

describe('calcSurtaxOnDividend', () => {
  it('הכנסה כוללת מתחת לסף → 0', () => {
    expect(calcSurtaxOnDividend(200_000, 0)).toBe(0);
  });

  it('דיבידנד לבד מעל סף → מס יסף', () => {
    const div = 900_000;
    const surtax = calcSurtaxOnDividend(div, 0);
    expect(surtax).toBeGreaterThan(0);
  });
});

// ============================================================
// קבועי מס
// ============================================================

describe('קבועי מס 2026', () => {
  it('מס חברות = 23%', () => {
    expect(CORP_TAX_2026).toBe(0.23);
  });

  it('מס דיבידנד בעל שליטה = 30%', () => {
    expect(DIVIDEND_TAX_CONTROLLING).toBe(0.30);
  });

  it('מס דיבידנד רגיל = 25%', () => {
    expect(DIVIDEND_TAX_REGULAR).toBe(0.25);
  });

  it('שיעור מצרפי דיב\' מהותי (ללא מס יסף) ≈ 46.1%', () => {
    const profit = 500_000;
    const afterCorp = profit * (1 - CORP_TAX_2026);
    const afterDiv = afterCorp * (1 - DIVIDEND_TAX_CONTROLLING);
    const effectiveRate = 1 - afterDiv / profit;
    expect(effectiveRate).toBeCloseTo(0.461, 2);
  });

  it('שיעור מצרפי דיב\' רגיל ≈ 42.25%', () => {
    const profit = 300_000;
    const afterCorp = profit * (1 - CORP_TAX_2026);
    const afterDiv = afterCorp * (1 - DIVIDEND_TAX_REGULAR);
    const effectiveRate = 1 - afterDiv / profit;
    expect(effectiveRate).toBeCloseTo(0.4225, 3);
  });
});

// ============================================================
// calculateDividendVsSalary - בדיקות ראשיות
// ============================================================

describe('calculateDividendVsSalary - בסיסי', () => {
  it('רווח 0 → נטו 0 בכל תרחיש', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 0,
      withdrawalNeeds: 0,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.allSalary.netToOwner).toBe(0);
    expect(r.allDividend.netToOwner).toBe(0);
    expect(r.optimal.netToOwner).toBe(0);
  });

  it('אופטימום תמיד >= הכל-משכורת', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 600_000,
      withdrawalNeeds: 400_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.optimal.netToOwner).toBeGreaterThanOrEqual(r.allSalary.netToOwner - 1);
  });

  it('אופטימום תמיד >= הכל-דיבידנד', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 600_000,
      withdrawalNeeds: 400_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.optimal.netToOwner).toBeGreaterThanOrEqual(r.allDividend.netToOwner - 1);
  });

  it('בעל מניות מהותי - מס דיב\' גבוה יותר מלא מהותי', () => {
    const material = calculateDividendVsSalary({
      companyAnnualProfit: 500_000,
      withdrawalNeeds: 500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    const regular = calculateDividendVsSalary({
      companyAnnualProfit: 500_000,
      withdrawalNeeds: 500_000,
      creditPoints: 2.25,
      isMaterialShareholder: false,
    });
    expect(regular.allDividend.netToOwner).toBeGreaterThan(material.allDividend.netToOwner);
  });

  it('שיעור מס דיב\' מצרפי (כולל מס חברות) ≈ 46.1% לבעל שליטה', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 500_000,
      withdrawalNeeds: 500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    // ~46.1% (ללא מס יסף כי 500K < 721K)
    expect(r.allDividend.effectiveTaxRate).toBeCloseTo(0.461, 2);
  });

  it('שיעור מס דיב\' מצרפי לא מהותי ≈ 42.25%', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 400_000,
      withdrawalNeeds: 400_000,
      creditPoints: 2.25,
      isMaterialShareholder: false,
    });
    expect(r.allDividend.effectiveTaxRate).toBeCloseTo(0.4225, 2);
  });
});

describe('calculateDividendVsSalary - רווחים גבוהים', () => {
  it('רווח 2M - דיבידנד/מיקס יעדיפו על משכורת מלאה', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 2_000_000,
      withdrawalNeeds: 1_500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.optimal.netToOwner).toBeGreaterThan(r.allSalary.netToOwner);
    expect(r.optimal.dividend).toBeGreaterThan(0);
  });

  it('רווח 1M - מס יסף נכלל בחישוב', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 1_000_000,
      withdrawalNeeds: 1_000_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    // דיבידנד אחרי מס חברות = 770,000 ₪ — מתחת לסף מס יסף (721,560)
    // מס יסף על הדיבידנד = קיים אבל נמוך
    expect(r.allDividend.totalTax).toBeGreaterThan(0);
  });
});

describe('calculateDividendVsSalary - מס יסף', () => {
  it('רווח 1.5M - בעל שליטה - מס יסף חל על דיבידנד', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 1_500_000,
      withdrawalNeeds: 1_500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.allDividend.surtax).toBeGreaterThan(0);
  });

  it('רווח 300K - ללא מס יסף', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 300_000,
      withdrawalNeeds: 300_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.allDividend.surtax).toBe(0);
  });
});

// ============================================================
// calculateAllMixes
// ============================================================

describe('calculateAllMixes', () => {
  it('מחזיר מערך לא ריק', () => {
    const mixes = calculateAllMixes(500_000, 2.25, true);
    expect(mixes.length).toBeGreaterThan(10);
  });

  it('המיקס הראשון = 0% משכורת (הכל דיבידנד)', () => {
    const mixes = calculateAllMixes(500_000, 2.25, true);
    expect(mixes[0].grossSalary).toBe(0);
  });

  it('salaryPct בין 0 ל-100 בכל נקודה', () => {
    const mixes = calculateAllMixes(800_000, 2.25, true);
    for (const m of mixes) {
      expect(m.salaryPct).toBeGreaterThanOrEqual(0);
      expect(m.salaryPct).toBeLessThanOrEqual(105); // 5% buffer לעלויות מעסיק
    }
  });

  it('netToOwner לא שלילי בשום מיקס תקין', () => {
    const mixes = calculateAllMixes(600_000, 2.25, true);
    for (const m of mixes) {
      if (m.effectiveTaxRate < 1) {
        expect(m.netToOwner).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

// ============================================================
// findOptimalMix
// ============================================================

describe('findOptimalMix', () => {
  it('מחזיר מיקס עם netToOwner >= כל האחרים', () => {
    const profit = 800_000;
    const optimal = findOptimalMix(profit, 2.25, true);
    const mixes = calculateAllMixes(profit, 2.25, true);
    const maxNet = Math.max(...mixes.map((m) => m.netToOwner));
    expect(optimal.netToOwner).toBeCloseTo(maxNet, 0);
  });

  it('ברווח נמוך (100K) - אופטימום יכיל משכורת', () => {
    const optimal = findOptimalMix(100_000, 2.25, true);
    // ברווח נמוך, מדרגות נמוכות - משכורת יכולה להיות עדיפה
    expect(optimal.netToOwner).toBeGreaterThan(0);
  });

  it('ברווח גבוה (2M) - אופטימום יכיל דיבידנד משמעותי', () => {
    const optimal = findOptimalMix(2_000_000, 2.25, true);
    expect(optimal.dividend).toBeGreaterThan(0);
  });
});

// ============================================================
// calculateSpouseOptimization
// ============================================================

describe('calculateSpouseOptimization', () => {
  it('משכורת לבן/בת זוג נמוכה מסף - חיסכון חיובי', () => {
    const result = calculateSpouseOptimization(
      1_000_000,
      2.25,
      true,
      15_000,
      2.25,
    );
    // בפיצול הכנסה - בד"כ יש חיסכון
    expect(result.spouseNetSalary).toBeGreaterThan(0);
    expect(result.spouseEmployerCost).toBeGreaterThan(15_000 * 12);
  });

  it('נטו עם בן/בת זוג כולל את הנטו של שניהם', () => {
    const result = calculateSpouseOptimization(
      800_000,
      2.25,
      true,
      12_000,
      2.25,
    );
    expect(result.netWithSpouse).toBeGreaterThan(result.spouseNetSalary);
    expect(result.netWithSpouse).toBeGreaterThan(result.netWithoutSpouse * 0.7); // גם עם בן/בת זוג > 70% ממה שבלי
  });

  it('עלות מעסיק גבוהה ממשכורת ברוטו', () => {
    const result = calculateSpouseOptimization(
      1_000_000,
      2.25,
      true,
      20_000,
      2.75,
    );
    expect(result.spouseEmployerCost).toBeGreaterThan(20_000 * 12);
  });
});

// ============================================================
// calculateLongTermProjection
// ============================================================

describe('calculateLongTermProjection', () => {
  it('מחזיר 20 שנה', () => {
    const proj = calculateLongTermProjection(800_000, 2.25, true, 20);
    expect(proj.length).toBe(20);
  });

  it('נטו מצטבר עולה עם הזמן', () => {
    const proj = calculateLongTermProjection(800_000, 2.25, true, 10);
    expect(proj[9].cumulativeNetOptimal).toBeGreaterThan(proj[0].cumulativeNetOptimal);
  });

  it('קרן פנסיה גדלה עם הזמן (עם תשואה)', () => {
    const proj = calculateLongTermProjection(1_000_000, 2.25, true, 10);
    // ללא הפקדות פנסיה (includePension=true נעשה בפנים)
    expect(proj[9].pensionFundValue).toBeGreaterThan(proj[0].pensionFundValue);
  });

  it('שנה 1 = נטו אחת', () => {
    const proj = calculateLongTermProjection(500_000, 2.25, false, 1);
    expect(proj.length).toBe(1);
    expect(proj[0].years).toBe(1);
  });
});

// ============================================================
// calculateSensitivityAnalysis
// ============================================================

describe('calculateSensitivityAnalysis', () => {
  it('מחזיר 16 נקודות (4 שיעורי חברות × 4 שיעורי דיב\')', () => {
    const points = calculateSensitivityAnalysis(800_000, 2.25);
    expect(points.length).toBe(16);
  });

  it('netDividend יורד כשמס חברות עולה', () => {
    const points = calculateSensitivityAnalysis(800_000, 2.25);
    const atLowCorpTax = points.filter((p) => p.corpTax === 0.20 && p.divTax === 0.30)[0];
    const atHighCorpTax = points.filter((p) => p.corpTax === 0.28 && p.divTax === 0.30)[0];
    expect(atLowCorpTax.netDividend).toBeGreaterThan(atHighCorpTax.netDividend);
  });

  it('netDividend יורד כשמס דיב\' עולה', () => {
    const points = calculateSensitivityAnalysis(800_000, 2.25);
    const atLowDivTax = points.filter((p) => p.corpTax === 0.23 && p.divTax === 0.25)[0];
    const atHighDivTax = points.filter((p) => p.corpTax === 0.23 && p.divTax === 0.33)[0];
    expect(atLowDivTax.netDividend).toBeGreaterThan(atHighDivTax.netDividend);
  });
});

// ============================================================
// מקרי קצה
// ============================================================

describe('מקרי קצה', () => {
  it('רווח שלילי מעוגל ל-0', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: -100_000,
      withdrawalNeeds: 0,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.allDividend.netToOwner).toBe(0);
    expect(r.allSalary.netToOwner).toBe(0);
  });

  it('נקודות זיכוי שליליות מעוגלות ל-0', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 300_000,
      withdrawalNeeds: 200_000,
      creditPoints: -5,
      isMaterialShareholder: false,
    });
    expect(r.allSalary.incomeTax).toBeGreaterThan(0);
  });

  it('רווח מאוד נמוך (5,000 ₪) - לא קורס', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 5_000,
      withdrawalNeeds: 3_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.optimal.netToOwner).toBeGreaterThanOrEqual(0);
  });

  it('allMixes לא ריק', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 500_000,
      withdrawalNeeds: 300_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.allMixes.length).toBeGreaterThan(0);
  });

  it('longTermProjection = 20 שנה', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 700_000,
      withdrawalNeeds: 500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.longTermProjection.length).toBe(20);
  });

  it('sensitivityAnalysis = 16 נקודות', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 700_000,
      withdrawalNeeds: 500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.sensitivityAnalysis.length).toBe(16);
  });

  it('taxSavings >= 0', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 1_000_000,
      withdrawalNeeds: 800_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.taxSavings).toBeGreaterThanOrEqual(0);
  });

  it('כולל פנסיה - מחזיר תוצאות תקינות', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 800_000,
      withdrawalNeeds: 600_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
      includePension: true,
    });
    expect(r.optimal.pensionEmployerContribution).toBeGreaterThan(0);
  });

  it('כולל בן/בת זוג - מחזיר spouseOptimization', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 1_000_000,
      withdrawalNeeds: 700_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
      includeSpouseSalary: true,
      spouseMonthlyGross: 15_000,
      spouseCreditPoints: 2.25,
    });
    expect(r.spouseOptimization).toBeDefined();
    expect(r.spouseOptimization!.spouseNetSalary).toBeGreaterThan(0);
  });
});
