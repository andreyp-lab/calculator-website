import { describe, it, expect } from 'vitest';
import {
  calculateFireResult,
  calculateCoastFire,
  calculateRequiredSavingsRate,
  FIRE_CONSTANTS_2026,
  type FireInput,
} from '@/lib/calculators/fire';

// ============================================================
// ערכי קלט בסיסיים לבדיקות
// ============================================================

const baseInput: FireInput = {
  currentAge: 32,
  currentSavings: 200_000,
  monthlyContribution: 5_000,
  monthlyGrossIncome: 20_000,
  monthlyExpensesRetirement: 15_000,
  expectedNominalReturn: 8,
  inflationRate: 3,
  swrType: 'four_pct',
  targetRetirementAge: 55,
  includeBituachLeumi: false,
  realEstateIncome: 0,
  baristaWorkIncome: 0,
  retirementDurationYears: 40,
};

// ============================================================
// בדיקות: חישוב FIRE Number
// ============================================================

describe('calculateFireResult - FIRE Number', () => {
  it('חישוב FIRE Number נכון עם 4% SWR', () => {
    const result = calculateFireResult(baseInput);
    // הוצאות שנתיות: 15,000 × 12 = 180,000
    // FIRE Number: 180,000 / 0.04 = 4,500,000
    expect(result.fireNumber).toBeCloseTo(4_500_000, -3);
  });

  it('חישוב FIRE Number עם 3% SWR', () => {
    const result = calculateFireResult({ ...baseInput, swrType: 'three_pct' });
    // 180,000 / 0.03 = 6,000,000
    expect(result.fireNumber).toBeCloseTo(6_000_000, -3);
  });

  it('חישוב FIRE Number עם 3.5% SWR', () => {
    const result = calculateFireResult({ ...baseInput, swrType: 'three_five_pct' });
    // 180,000 / 0.035 ≈ 5,142,857
    expect(result.fireNumber).toBeCloseTo(5_142_857, -3);
  });

  it('הכנסת נדל"ן מקטינה FIRE Number', () => {
    const withRealestate = calculateFireResult({
      ...baseInput,
      realEstateIncome: 5_000,
    });
    // הוצאות נטו: 15,000 - 5,000 = 10,000 → FIRE: 10,000*12/0.04 = 3,000,000
    expect(withRealestate.fireNumber).toBeCloseTo(3_000_000, -3);
    expect(withRealestate.fireNumber).toBeLessThan(4_500_000);
  });

  it('ביטוח לאומי מקטין FIRE Number', () => {
    const withBL = calculateFireResult({
      ...baseInput,
      includeBituachLeumi: true,
    });
    // מקטין ב- 1,754 ₪/חודש
    expect(withBL.fireNumber).toBeLessThan(4_500_000);
  });
});

// ============================================================
// בדיקות: שנים ל-FIRE
// ============================================================

describe('calculateFireResult - שנים ל-FIRE', () => {
  it('אם כבר הגיע ל-FIRE - yearsToFire = 0', () => {
    const result = calculateFireResult({
      ...baseInput,
      currentSavings: 5_000_000, // מעל FIRE Number 4.5M
    });
    expect(result.yearsToFire).toBe(0);
    expect(result.willReachFire).toBe(true);
  });

  it('ייצא תוצאה עם מספר שנים חיובי', () => {
    const result = calculateFireResult(baseInput);
    expect(result.yearsToFire).toBeGreaterThan(0);
    expect(result.yearsToFire).toBeLessThan(100);
    expect(result.willReachFire).toBe(true);
  });

  it('ללא הפקדות - זמן ארוך יותר ל-FIRE', () => {
    const noContrib = calculateFireResult({ ...baseInput, monthlyContribution: 0 });
    const withContrib = calculateFireResult(baseInput);
    // ללא הפקדות צריך יותר זמן
    expect(noContrib.yearsToFire).toBeGreaterThanOrEqual(withContrib.yearsToFire);
  });

  it('הפקדה גבוהה יותר = פחות שנים ל-FIRE', () => {
    const low = calculateFireResult({ ...baseInput, monthlyContribution: 3_000 });
    const high = calculateFireResult({ ...baseInput, monthlyContribution: 10_000 });
    expect(high.yearsToFire).toBeLessThan(low.yearsToFire);
  });

  it('גיל פרישה = גיל נוכחי + שנים ל-FIRE', () => {
    const result = calculateFireResult(baseInput);
    expect(result.fireAge).toBe(Math.min(120, Math.round(32 + result.yearsToFire)));
  });
});

// ============================================================
// בדיקות: Coast FIRE
// ============================================================

describe('calculateCoastFire', () => {
  it('חישוב Coast Number נכון', () => {
    // FIRE Number: 4,500,000, 25 שנה, 5% תשואה ריאלית
    const coastResult = calculateCoastFire(
      200_000, // current savings
      4_500_000, // fire number
      5, // real return %
      25, // years until retirement
      5_000, // monthly contribution
    );
    // Coast = 4,500,000 / 1.05^25 ≈ 1,329,614
    expect(coastResult.coastNumber).toBeCloseTo(1_329_614, -4);
    expect(coastResult.hasReachedCoast).toBe(false);
    expect(coastResult.coastShortfall).toBeGreaterThan(0);
  });

  it('הגיע ל-Coast FIRE', () => {
    const result = calculateCoastFire(
      2_000_000, // הרבה כסף
      4_500_000,
      5,
      25,
      5_000,
    );
    expect(result.hasReachedCoast).toBe(true);
    expect(result.coastShortfall).toBe(0);
    expect(result.yearsToCoast).toBe(0);
  });

  it('Coast Number גדל עם FIRE Number גדול יותר', () => {
    const small = calculateCoastFire(0, 3_000_000, 5, 20, 0);
    const large = calculateCoastFire(0, 6_000_000, 5, 20, 0);
    expect(large.coastNumber).toBeGreaterThan(small.coastNumber);
  });
});

// ============================================================
// בדיקות: שיעור חיסכון נדרש
// ============================================================

describe('calculateRequiredSavingsRate', () => {
  it('שיעור חיסכון תקין - בין 0 ל-100', () => {
    const rate = calculateRequiredSavingsRate(
      200_000, // current savings
      20_000, // monthly income
      4_500_000, // fire number
      5, // real return
      23, // years
    );
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(100);
  });

  it('כשיש כבר מספיק - שיעור חיסכון קרוב לאפס', () => {
    const rate = calculateRequiredSavingsRate(
      5_000_000, // כבר הגיע ל-FIRE
      20_000,
      4_500_000,
      5,
      10,
    );
    expect(rate).toBe(0);
  });

  it('יותר שנים = שיעור חיסכון נמוך יותר', () => {
    const rate20 = calculateRequiredSavingsRate(100_000, 20_000, 4_500_000, 5, 20);
    const rate30 = calculateRequiredSavingsRate(100_000, 20_000, 4_500_000, 5, 30);
    expect(rate30).toBeLessThan(rate20);
  });
});

// ============================================================
// בדיקות: FIRE Types Breakdown
// ============================================================

describe('calculateFireResult - fireTypeBreakdown', () => {
  it('מחזיר 5 סוגי FIRE', () => {
    const result = calculateFireResult(baseInput);
    expect(result.fireTypeBreakdown).toHaveLength(5);
  });

  it('Lean FIRE Number קטן מ-Regular FIRE Number', () => {
    const result = calculateFireResult(baseInput);
    const lean = result.fireTypeBreakdown.find((f) => f.type === 'lean')!;
    const regular = result.fireTypeBreakdown.find((f) => f.type === 'regular')!;
    expect(lean.fireNumber).toBeLessThan(regular.fireNumber);
  });

  it('Fat FIRE Number גדול מ-Regular FIRE Number', () => {
    const result = calculateFireResult(baseInput);
    const fat = result.fireTypeBreakdown.find((f) => f.type === 'fat')!;
    const regular = result.fireTypeBreakdown.find((f) => f.type === 'regular')!;
    expect(fat.fireNumber).toBeGreaterThan(regular.fireNumber);
  });
});

// ============================================================
// בדיקות: SWR תרחישים
// ============================================================

describe('calculateFireResult - swrScenarios', () => {
  it('מחזיר 4 תרחישי SWR', () => {
    const result = calculateFireResult(baseInput);
    expect(result.swrScenarios).toHaveLength(4);
  });

  it('SWR 3% = FIRE Number גדול יותר מ-4%', () => {
    const result = calculateFireResult(baseInput);
    const pct3 = result.swrScenarios.find((s) => s.type === 'three_pct')!;
    const pct4 = result.swrScenarios.find((s) => s.type === 'four_pct')!;
    expect(pct3.fireNumber).toBeGreaterThan(pct4.fireNumber);
  });
});

// ============================================================
// בדיקות: שיעור חיסכון נוכחי
// ============================================================

describe('calculateFireResult - currentSavingsRate', () => {
  it('שיעור חיסכון = הפקדה / הכנסה ברוטו', () => {
    const result = calculateFireResult(baseInput);
    // 5,000 / 20,000 = 25%
    expect(result.currentSavingsRate).toBeCloseTo(25, 1);
  });

  it('שיעור חיסכון 0 אם הכנסה 0', () => {
    const result = calculateFireResult({ ...baseInput, monthlyGrossIncome: 0 });
    expect(result.currentSavingsRate).toBe(0);
  });
});

// ============================================================
// בדיקות: ניתוח רגישות
// ============================================================

describe('calculateFireResult - sensitivity', () => {
  it('חיסכון +10% מוביל לפחות שנים ל-FIRE', () => {
    const result = calculateFireResult(baseInput);
    expect(result.sensitivityPlusSavings).toBeLessThanOrEqual(result.yearsToFire);
  });

  it('תשואה +1% מוביל לפחות שנים ל-FIRE', () => {
    const result = calculateFireResult(baseInput);
    expect(result.sensitivityPlusReturn).toBeLessThanOrEqual(result.yearsToFire);
  });

  it('הוצאות -10% מוביל לפחות שנים ל-FIRE', () => {
    const result = calculateFireResult(baseInput);
    expect(result.sensitivityLowerExpenses).toBeLessThanOrEqual(result.yearsToFire);
  });
});

// ============================================================
// בדיקות: Barista FIRE
// ============================================================

describe('calculateFireResult - Barista FIRE', () => {
  it('Barista FIRE Number קטן יותר ממסלול רגיל', () => {
    const withBarista = calculateFireResult({
      ...baseInput,
      baristaWorkIncome: 5_000,
    });
    const regular = calculateFireResult(baseInput);
    expect(withBarista.baristaFireNumber).toBeLessThan(regular.fireNumber);
  });

  it('Barista = 0 אם אין עבודה חלקית', () => {
    const result = calculateFireResult({ ...baseInput, baristaWorkIncome: 0 });
    // Barista FIRE Number = FIRE Number כשאין הפחתת הכנסה
    expect(result.baristaFireNumber).toBe(result.fireNumber);
  });
});

// ============================================================
// בדיקות: FIRE progress
// ============================================================

describe('calculateFireResult - fireProgress', () => {
  it('progress נמוך כשחיסכון קטן', () => {
    const result = calculateFireResult({ ...baseInput, currentSavings: 100_000 });
    expect(result.fireProgress).toBeLessThan(10);
  });

  it('progress 100 כשכבר הגיע ל-FIRE', () => {
    const result = calculateFireResult({
      ...baseInput,
      currentSavings: 5_000_000,
    });
    expect(result.fireProgress).toBe(100);
  });
});

// ============================================================
// בדיקות: קבועים ישראלים
// ============================================================

describe('FIRE_CONSTANTS_2026', () => {
  it('SWR 4% = מכפיל 25', () => {
    expect(FIRE_CONSTANTS_2026.MULTIPLIER_4PCT).toBe(25);
  });

  it('קצבת ב.ל. חיובית', () => {
    expect(FIRE_CONSTANTS_2026.BITUACH_LEUMI_BASIC_MONTHLY).toBeGreaterThan(0);
  });

  it('מס רווחי הון 25%', () => {
    expect(FIRE_CONSTANTS_2026.CAPITAL_GAINS_TAX).toBe(0.25);
  });
});

// ============================================================
// בדיקות: Withdrawal Phase
// ============================================================

describe('calculateFireResult - withdrawalPhase', () => {
  it('שלב המשיכה מחזיר שורות', () => {
    const result = calculateFireResult(baseInput);
    expect(result.withdrawalPhase.length).toBeGreaterThan(0);
    expect(result.withdrawalPhase.length).toBeLessThanOrEqual(
      baseInput.retirementDurationYears,
    );
  });

  it('שנה ראשונה בשלב המשיכה - תיק חיובי', () => {
    const result = calculateFireResult({
      ...baseInput,
      currentSavings: 5_000_000, // כדי להיות ב-FIRE כבר
    });
    expect(result.withdrawalPhase[0]?.portfolioValue).toBeGreaterThan(0);
    expect(result.withdrawalPhase[0]?.isPortfolioAlive).toBe(true);
  });
});
