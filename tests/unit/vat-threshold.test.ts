import { describe, it, expect } from 'vitest';
import {
  calculateVatThreshold,
  getMonthName,
  VAT_EXEMPT_THRESHOLD_2026,
  VAT_STANDARD_RATE,
  type VatThresholdInput,
} from '@/lib/calculators/vat-threshold';

// ============================================================
// קבועים מאומתים
// ============================================================

describe('קבועים', () => {
  it('תקרת עוסק פטור 2026 = 122,833 ₪', () => {
    expect(VAT_EXEMPT_THRESHOLD_2026).toBe(122_833);
  });

  it('שיעור מע"מ רגיל = 18%', () => {
    expect(VAT_STANDARD_RATE).toBe(0.18);
  });
});

// ============================================================
// מצב בטוח — הרחק מהתקרה
// ============================================================

describe('מצב בטוח', () => {
  const input: VatThresholdInput = {
    cumulativeRevenue: 20_000,
    currentMonth: 3, // עד סוף מרץ
    expectedMonthlyRevenue: 6_000,
  };

  it('סטטוס safe כשהצפי השנתי מתחת לתקרה', () => {
    const r = calculateVatThreshold(input);
    expect(r.status).toBe('safe');
    expect(r.willExceed).toBe(false);
    expect(r.alreadyExceeded).toBe(false);
  });

  it('מחשב מקום שנותר נכון', () => {
    const r = calculateVatThreshold(input);
    expect(r.remainingRoom).toBe(122_833 - 20_000);
  });

  it('מחזור שנתי צפוי = מצטבר + צפי ליתרת החודשים', () => {
    const r = calculateVatThreshold(input);
    // 9 חודשים שנותרו × 6,000 = 54,000 + 20,000 = 74,000
    expect(r.projectedAnnualRevenue).toBe(74_000);
  });

  it('אין חודש חציה כשלא צפוי לחצות', () => {
    const r = calculateVatThreshold(input);
    expect(r.crossingMonth).toBeNull();
    expect(r.crossingMonthName).toBeNull();
  });

  it('אין עודף ואין חבות מע"מ', () => {
    const r = calculateVatThreshold(input);
    expect(r.excessRevenue).toBe(0);
    expect(r.estimatedVatOnExcess).toBe(0);
  });
});

// ============================================================
// מצב חציה צפויה
// ============================================================

describe('חציה צפויה במהלך השנה', () => {
  const input: VatThresholdInput = {
    cumulativeRevenue: 60_000,
    currentMonth: 6, // עד סוף יוני
    expectedMonthlyRevenue: 12_000,
  };

  it('willExceed = true והסטטוס approaching', () => {
    const r = calculateVatThreshold(input);
    // 60,000 + 6×12,000 = 132,000 > 122,833
    expect(r.willExceed).toBe(true);
    expect(r.status).toBe('approaching');
    expect(r.alreadyExceeded).toBe(false);
  });

  it('מזהה את חודש החציה', () => {
    const r = calculateVatThreshold(input);
    // יולי 72k, אוג 84k, ספט 96k, אוק 108k, נוב 120k, דצמ 132k → חציה בדצמבר
    expect(r.crossingMonth).toBe(12);
    expect(r.crossingMonthName).toBe('דצמבר');
  });

  it('מחשב עודף וחבות מע"מ משוערת', () => {
    const r = calculateVatThreshold(input);
    const expectedExcess = 132_000 - 122_833;
    expect(r.excessRevenue).toBeCloseTo(expectedExcess, 2);
    expect(r.estimatedVatOnExcess).toBeCloseTo(expectedExcess * 0.18, 2);
  });

  it('כולל השלכות חריגה', () => {
    const r = calculateVatThreshold(input);
    expect(r.consequences.length).toBeGreaterThan(0);
    expect(r.consequences.some((c) => c.includes('מורשה'))).toBe(true);
    expect(r.consequences.some((c) => c.includes('רטרואקטיבי'))).toBe(true);
  });
});

// ============================================================
// כבר חצה את התקרה
// ============================================================

describe('כבר חצה את התקרה', () => {
  const input: VatThresholdInput = {
    cumulativeRevenue: 130_000,
    currentMonth: 8,
    expectedMonthlyRevenue: 15_000,
  };

  it('alreadyExceeded = true וסטטוס exceeded', () => {
    const r = calculateVatThreshold(input);
    expect(r.alreadyExceeded).toBe(true);
    expect(r.status).toBe('exceeded');
  });

  it('מקום שנותר = 0 כשחצה', () => {
    const r = calculateVatThreshold(input);
    expect(r.remainingRoom).toBe(0);
  });

  it('ניצול התקרה מעל 100%', () => {
    const r = calculateVatThreshold(input);
    expect(r.utilizationRate).toBeGreaterThan(1);
  });

  it('המלצה לפנות לרשות המסים בהקדם', () => {
    const r = calculateVatThreshold(input);
    expect(r.recommendations.some((rec) => rec.includes('רשות המסים'))).toBe(true);
  });
});

// ============================================================
// פירוט חודשי מפורט
// ============================================================

describe('פירוט חודשי (monthlyBreakdown)', () => {
  it('מזהה חודש חציה לפי המערך החודשי', () => {
    // 12 חודשים × 12,000 = 144,000. חציה כשהמצטבר עובר 122,833.
    const monthly = Array(12).fill(12_000);
    const r = calculateVatThreshold({
      cumulativeRevenue: 0,
      currentMonth: 1,
      expectedMonthlyRevenue: 0,
      monthlyBreakdown: monthly,
    });
    // currentMonth=1, cumulative=0 → מתחילים מחודש 2 ומוסיפים 12k כל חודש.
    // חודש 11 = 10×12k = 120k (עדיין מתחת), חודש 12 = 132k → חציה בדצמבר.
    expect(r.crossingMonth).toBe(12);
    expect(r.crossingMonthName).toBe('דצמבר');
  });

  it('פירוט חודשי גובר על הממוצע בחישוב הצפי השנתי', () => {
    const monthly = Array(12).fill(5_000);
    const r = calculateVatThreshold({
      cumulativeRevenue: 5_000,
      currentMonth: 1,
      expectedMonthlyRevenue: 99_999, // צריך להתעלם
      monthlyBreakdown: monthly,
    });
    // 5,000 (מצטבר) + 11×5,000 = 60,000
    expect(r.projectedAnnualRevenue).toBe(60_000);
    expect(r.willExceed).toBe(false);
  });

  it('מתעלם ממערך באורך שגוי ונופל לממוצע', () => {
    const r = calculateVatThreshold({
      cumulativeRevenue: 10_000,
      currentMonth: 2,
      expectedMonthlyRevenue: 5_000,
      monthlyBreakdown: [1, 2, 3], // אורך שגוי
    });
    // 10,000 + 10×5,000 = 60,000
    expect(r.projectedAnnualRevenue).toBe(60_000);
  });
});

// ============================================================
// חציה מדויקת על הסף
// ============================================================

describe('סף מדויק', () => {
  it('מחזור בדיוק על התקרה נחשב חצייה (>=)', () => {
    const r = calculateVatThreshold({
      cumulativeRevenue: VAT_EXEMPT_THRESHOLD_2026,
      currentMonth: 12,
      expectedMonthlyRevenue: 0,
    });
    expect(r.alreadyExceeded).toBe(true);
    expect(r.remainingRoom).toBe(0);
  });

  it('שקל מתחת לתקרה — עדיין לא חצה', () => {
    const r = calculateVatThreshold({
      cumulativeRevenue: VAT_EXEMPT_THRESHOLD_2026 - 1,
      currentMonth: 12,
      expectedMonthlyRevenue: 0,
    });
    expect(r.alreadyExceeded).toBe(false);
    expect(r.remainingRoom).toBe(1);
  });
});

// ============================================================
// קלט לא תקין / קצה
// ============================================================

describe('קלט קצה', () => {
  it('מחזור שלילי מתאפס', () => {
    const r = calculateVatThreshold({
      cumulativeRevenue: -5_000,
      currentMonth: 3,
      expectedMonthlyRevenue: 1_000,
    });
    expect(r.cumulativeRevenue).toBe(0);
    expect(r.alreadyExceeded).toBe(false);
  });

  it('חודש מחוץ לטווח עובר clamp ל-1..12', () => {
    const r1 = calculateVatThreshold({
      cumulativeRevenue: 10_000,
      currentMonth: 99,
      expectedMonthlyRevenue: 1_000,
    });
    // currentMonth=12 → אין חודשים שנותרו
    expect(r1.projectedAnnualRevenue).toBe(10_000);

    const r0 = calculateVatThreshold({
      cumulativeRevenue: 0,
      currentMonth: 0,
      expectedMonthlyRevenue: 10_000,
    });
    // currentMonth=1 → 11 חודשים נותרו
    expect(r0.projectedAnnualRevenue).toBe(110_000);
  });

  it('תקרה מותאמת מתקבלת', () => {
    const r = calculateVatThreshold({
      cumulativeRevenue: 50_000,
      currentMonth: 6,
      expectedMonthlyRevenue: 0,
      threshold: 100_000,
    });
    expect(r.threshold).toBe(100_000);
    expect(r.remainingRoom).toBe(50_000);
  });

  it('המלצה כללית על עוסק פטור מופיעה תמיד', () => {
    const r = calculateVatThreshold({
      cumulativeRevenue: 1_000,
      currentMonth: 1,
      expectedMonthlyRevenue: 1_000,
    });
    expect(
      r.recommendations.some((rec) => rec.includes('ביטוח לאומי') || rec.includes('הצהרת עוסק פטור')),
    ).toBe(true);
  });
});

// ============================================================
// getMonthName
// ============================================================

describe('getMonthName', () => {
  it('מחזיר שם חודש נכון', () => {
    expect(getMonthName(1)).toBe('ינואר');
    expect(getMonthName(12)).toBe('דצמבר');
    expect(getMonthName(6)).toBe('יוני');
  });

  it('עושה clamp לערכים מחוץ לטווח', () => {
    expect(getMonthName(0)).toBe('ינואר');
    expect(getMonthName(13)).toBe('דצמבר');
  });
});
