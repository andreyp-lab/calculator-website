import { describe, it, expect } from 'vitest';
import {
  calculateSeverance,
  calculateSection14Detail,
  compareSeveranceTaxOptions,
  getTerminationRights,
  calculateLatePaymentPenalty,
  calculateSalaryBasis,
} from '@/lib/calculators/severance';

// ============================================================
// Original Tests (backward compat)
// ============================================================

describe('calculateSeverance', () => {
  it('עובד 5 שנים, שכר 10,000 - פטור מלא ממס', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.yearsOfService).toBeCloseTo(5, 1);
    expect(result.baseSeverance).toBeCloseTo(50_000, -2);
    // 50,000 פטור מלא (תקרה 13,750 × 5 = 68,750 > 50,000)
    expect(result.taxableAmount).toBe(0);
  });

  it('עובד פחות משנה - לא זכאי', () => {
    const result = calculateSeverance({
      startDate: '2024-06-01',
      endDate: '2025-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReason).toContain('שנה לפחות');
  });

  it('עובד שעתי 50% משרה - שכר מתואם', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 12000,
      employmentType: 'hourly',
      partTimePercentage: 50,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.adjustedSalary).toBeCloseTo(6000, 0);
    expect(result.baseSeverance).toBeCloseTo(30_000, -2); // 6000 × 5
  });

  it('התפטרות רגילה - לא זכאי', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'resigned',
    });

    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReason).toContain('התפטרות');
  });

  it('שכר גבוה - חלק חייב במס', () => {
    // עובד 10 שנים ב-30,000 ₪ = 300,000 ₪ פיצוי
    // תקרת פטור: 13,750 × 10 = 137,500
    // או 30,000 × 1.5 × 10 = 450,000
    // הפטור הוא הנמוך = 137,500
    // חייב במס: 300,000 - 137,500 = 162,500
    const result = calculateSeverance({
      startDate: '2015-01-01',
      endDate: '2025-01-01',
      monthlySalary: 30000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.baseSeverance).toBeCloseTo(300_000, -2);
    expect(result.taxExemptAmount).toBeCloseTo(137_500, -2);
    expect(result.taxableAmount).toBeCloseTo(162_500, -2);
  });

  it('תאריך סיום לפני תחילה - שגוי', () => {
    const result = calculateSeverance({
      startDate: '2025-01-01',
      endDate: '2024-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(false);
  });
});

// ============================================================
// Section 14 Tests
// ============================================================

describe('calculateSection14Detail', () => {
  it('סעיף 14 מלא — קרן גדולה מהזכאות — עודף לעובד', () => {
    const result = calculateSection14Detail(
      70_000, // נצבר בקרן
      60_000, // זכאות חוקית
      100,    // כיסוי מלא
    );

    expect(result.totalReceived).toBe(70_000);
    expect(result.fundSurplus).toBe(10_000);
    expect(result.employerTopUp).toBe(0);
    expect(result.note).toContain('עודף');
  });

  it('סעיף 14 מלא — קרן קטנה מהזכאות — מעסיק לא משלים', () => {
    const result = calculateSection14Detail(
      40_000, // נצבר בקרן
      60_000, // זכאות חוקית
      100,    // כיסוי מלא
    );

    expect(result.employerTopUp).toBe(0);   // סעיף 14 מלא: לא משלים
    expect(result.totalReceived).toBe(40_000); // מקבל רק מהקרן
    expect(result.fundSurplus).toBe(0);
    expect(result.note).toContain('אינו חייב');
  });

  it('סעיף 14 חלקי 72% — מעסיק חייב להשלים', () => {
    const entitlement = 100_000;
    const result = calculateSection14Detail(
      72_000, // נצבר (מכסה 72%)
      entitlement,
      72,     // 72% כיסוי
    );

    // חלק לא מכוסה: 28% = 28,000
    expect(result.employerTopUp).toBeCloseTo(28_000, 0);
    expect(result.totalReceived).toBeCloseTo(100_000, 0); // 72,000 + 28,000
  });

  it('סעיף 14 חלקי 83.3% — חישוב נכון', () => {
    const entitlement = 120_000;
    const result = calculateSection14Detail(
      100_000, // נצבר
      entitlement,
      83.3,    // 83.3% כיסוי
    );

    // מכוסה: 83.3% × 120,000 = 99,960
    // חלק לא מכוסה: ~16.7% = ~20,040
    expect(result.employerTopUp).toBeCloseTo(20_040, -2);
  });

  it('קרן ריקה — סעיף 14 מלא — עובד מקבל אפס', () => {
    const result = calculateSection14Detail(0, 50_000, 100);
    expect(result.totalReceived).toBe(0);
    expect(result.employerTopUp).toBe(0);
  });

  it('fundCoversEntitlement אחוז נכון', () => {
    const result = calculateSection14Detail(50_000, 100_000, 100);
    expect(result.fundCoversEntitlement).toBe(50);
  });
});

// ============================================================
// Tax Comparison Tests
// ============================================================

describe('compareSeveranceTaxOptions', () => {
  it('4 אפשרויות מוחזרות', () => {
    const result = compareSeveranceTaxOptions({
      baseSeverance: 200_000,
      adjustedSalary: 20_000,
      years: 10,
      age: 40,
      currentAnnualIncome: 144_000,
      spreadYears: 6,
    });

    expect(result.options).toHaveLength(4);
    expect(result.options.map((o) => o.option)).toContain('immediate_exemption');
    expect(result.options.map((o) => o.option)).toContain('pension_continuity');
    expect(result.options.map((o) => o.option)).toContain('multi_year_spread');
    expect(result.options.map((o) => o.option)).toContain('combination');
  });

  it('רצף קצבה — אפס מס, כל הסכום לפנסיה', () => {
    const result = compareSeveranceTaxOptions({
      baseSeverance: 300_000,
      adjustedSalary: 30_000,
      years: 10,
      age: 35,
      currentAnnualIncome: 180_000,
      spreadYears: 6,
    });

    const pensionOpt = result.options.find((o) => o.option === 'pension_continuity');
    expect(pensionOpt).toBeDefined();
    expect(pensionOpt!.estimatedTax).toBe(0);
    expect(pensionOpt!.netCash).toBe(0);
    expect(pensionOpt!.pensionTransferAmount).toBe(300_000);
  });

  it('פיצויים בטווח פטור — כל האפשרויות ללא מס', () => {
    // 5 שנים × 10,000 = 50,000 < תקרה (68,750)
    const result = compareSeveranceTaxOptions({
      baseSeverance: 50_000,
      adjustedSalary: 10_000,
      years: 5,
      age: 40,
      currentAnnualIncome: 0,
      spreadYears: 3,
    });

    const immediate = result.options.find((o) => o.option === 'immediate_exemption');
    expect(immediate!.taxableAmount).toBe(0);
    expect(immediate!.estimatedTax).toBe(0);
    expect(immediate!.netCash).toBe(50_000);
  });

  it('פריסה חוסכת מס לעומת פטור מיידי', () => {
    const result = compareSeveranceTaxOptions({
      baseSeverance: 500_000,
      adjustedSalary: 50_000,
      years: 10,
      age: 45,
      currentAnnualIncome: 200_000,
      spreadYears: 6,
    });

    const immediate = result.options.find((o) => o.option === 'immediate_exemption');
    const spread = result.options.find((o) => o.option === 'multi_year_spread');

    // פריסה אמורה לחסוך מס (מס פריסה < מס מיידי)
    expect(spread!.estimatedTax).toBeLessThan(immediate!.estimatedTax);
  });

  it('יש תמיד אפשרות מומלצת אחת בדיוק', () => {
    const result = compareSeveranceTaxOptions({
      baseSeverance: 200_000,
      adjustedSalary: 20_000,
      years: 10,
      age: 40,
      currentAnnualIncome: 144_000,
      spreadYears: 4,
    });

    const recommendedCount = result.options.filter((o) => o.isRecommended).length;
    expect(recommendedCount).toBe(1);
  });

  it('מגיל 50 — פטור מוגדל', () => {
    // שכר 20,000 × 10 שנים = 200,000
    // פטור רגיל: 13,750 × 10 = 137,500
    // פטור מוגדל גיל 50: 137,500 × 1.5 = 206,250 > 200,000 → פטור מלא
    const result50 = compareSeveranceTaxOptions({
      baseSeverance: 200_000,
      adjustedSalary: 20_000,
      years: 10,
      age: 50,
      currentAnnualIncome: 0,
      spreadYears: 6,
    });

    const immediate50 = result50.options.find((o) => o.option === 'immediate_exemption');
    expect(immediate50!.taxableAmount).toBe(0);
  });
});

// ============================================================
// Termination Rights Tests
// ============================================================

describe('getTerminationRights', () => {
  it('פיטורין — זכאי', () => {
    const rights = getTerminationRights('fired');
    expect(rights.isEntitled).toBe(true);
    expect(rights.requiresProof).toBe(false);
  });

  it('התפטרות רגילה — לא זכאי', () => {
    const rights = getTerminationRights('resigned');
    expect(rights.isEntitled).toBe(false);
    expect(rights.label).toContain('התפטרות');
  });

  it('פרישה לגיל פרישה — זכאי', () => {
    const rights = getTerminationRights('retirement');
    expect(rights.isEntitled).toBe(true);
  });

  it('הרעה מוחשית — זכאי, דורש הוכחה', () => {
    const rights = getTerminationRights('deterioration');
    expect(rights.isEntitled).toBe(true);
    expect(rights.requiresProof).toBe(true);
    expect(rights.proofRequired).toBeDefined();
  });

  it('לידה — זכאי תוך 9 חודשים', () => {
    const rights = getTerminationRights('maternity');
    expect(rights.isEntitled).toBe(true);
    expect(rights.entitlementCondition).toContain('9 חודשים');
  });

  it('מות מעסיק — זכאי', () => {
    const rights = getTerminationRights('employer_death');
    expect(rights.isEntitled).toBe(true);
  });

  it('מילואים — זכאי עם תנאי 90 יום', () => {
    const rights = getTerminationRights('reserve_duty');
    expect(rights.isEntitled).toBe(true);
    expect(rights.entitlementCondition).toContain('90');
  });

  it('העברה גיאוגרפית — זכאי, תנאי >50 ק"מ', () => {
    const rights = getTerminationRights('relocation');
    expect(rights.isEntitled).toBe(true);
    expect(rights.entitlementCondition).toContain('50');
  });

  it('סיום חוזה קצוב — זכאי', () => {
    const rights = getTerminationRights('fixed_term_end');
    expect(rights.isEntitled).toBe(true);
  });

  it('כל 13 סיבות מחזירות תוצאה תקינה', () => {
    const allReasons = [
      'fired', 'resigned', 'retirement', 'qualifying', 'deterioration',
      'relocation', 'health', 'maternity', 'disabled_child', 'reserve_duty',
      'employer_death', 'conditions_change', 'fixed_term_end',
    ] as const;

    for (const reason of allReasons) {
      const rights = getTerminationRights(reason);
      expect(rights.reason).toBe(reason);
      expect(rights.label).toBeTruthy();
      expect(rights.legalBasis).toBeTruthy();
      expect(Array.isArray(rights.notes)).toBe(true);
      expect(rights.notes.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// Late Payment Tests
// ============================================================

describe('calculateLatePaymentPenalty', () => {
  it('שולם בזמן — אין עיכוב', () => {
    const result = calculateLatePaymentPenalty(50_000, 0);
    expect(result.totalPenalty).toBe(0);
    expect(result.totalDue).toBe(50_000);
  });

  it('14 ימי עיכוב — בתוך חסד, אין קנס', () => {
    const result = calculateLatePaymentPenalty(50_000, 14);
    expect(result.totalPenalty).toBe(0);
    expect(result.totalDue).toBe(50_000);
  });

  it('30 ימי עיכוב — קנס 8% + חודש אחד', () => {
    const result = calculateLatePaymentPenalty(100_000, 30);
    // 8% ראשוני = 8,000; 1 חודש × 1.5% = 1,500
    expect(result.totalPenalty).toBe(9_500);
    expect(result.totalDue).toBe(109_500);
  });

  it('90 ימי עיכוב — קנס 8% + 3 חודשים', () => {
    const result = calculateLatePaymentPenalty(100_000, 90);
    // 8,000 + (3 × 1,500) = 8,000 + 4,500 = 12,500
    expect(result.totalPenalty).toBe(12_500);
    expect(result.totalDue).toBe(112_500);
  });

  it('365 ימי עיכוב — קנס משמעותי', () => {
    const result = calculateLatePaymentPenalty(50_000, 365);
    expect(result.totalPenalty).toBeGreaterThan(0);
    expect(result.totalDue).toBeGreaterThan(50_000);
    expect(result.legalBasis).toContain('הגנת השכר');
  });

  it('תשלום מאוחר שלא נדרש — דוגמת ערך 0', () => {
    const result = calculateLatePaymentPenalty(0, 30);
    expect(result.totalPenalty).toBe(0);
    expect(result.totalDue).toBe(0);
  });
});

// ============================================================
// Salary Basis Tests
// ============================================================

describe('calculateSalaryBasis', () => {
  it('שכר אחרון גבוה — ממלוץ last_month', () => {
    const result = calculateSalaryBasis(15_000, 14_000, 13_000);
    expect(result.recommended).toBe('last_month');
    expect(result.lastMonth).toBe(15_000);
  });

  it('ממוצע 3 חודשים גבוה — ממלוץ average_3m', () => {
    const result = calculateSalaryBasis(10_000, 15_000, 10_000);
    expect(result.recommended).toBe('average_3m');
  });

  it('ממוצע 12 חודשים גבוה — ממלוץ average_12m', () => {
    const result = calculateSalaryBasis(10_000, 10_000, 15_000);
    expect(result.recommended).toBe('average_12m');
  });

  it('הפרשים קטנים — שכר אחרון (פשטות)', () => {
    // הפרש < 5%
    const result = calculateSalaryBasis(10_000, 9_900, 9_800);
    expect(result.recommended).toBe('last_month');
  });

  it('הפרשים חושבים נכון', () => {
    const result = calculateSalaryBasis(12_000, 11_000, 10_000);
    expect(result.differences.lastVs3m).toBe(1_000);
    expect(result.differences.lastVs12m).toBe(2_000);
  });
});

// ============================================================
// Edge Cases
// ============================================================

describe('edge cases', () => {
  it('וותק ארוך מאוד (30 שנה) — חישוב תקין', () => {
    const result = calculateSeverance({
      startDate: '1995-01-01',
      endDate: '2025-01-01',
      monthlySalary: 20_000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.baseSeverance).toBeCloseTo(600_000, -3);
    expect(result.yearsOfService).toBeCloseTo(30, 0);
  });

  it('שכר גבוה מאוד (100,000 ₪) — חישוב תקין', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 100_000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.baseSeverance).toBeCloseTo(500_000, -3);
    // תקרת פטור: 13,750 × 5 = 68,750 (כי 100,000 × 1.5 × 5 = 750,000 גבוה יותר)
    // חייב במס: 500,000 - 68,750 = 431,250
    expect(result.taxableAmount).toBeCloseTo(431_250, -2);
  });

  it('תאריכים לא תקינים', () => {
    const result = calculateSeverance({
      startDate: 'invalid',
      endDate: '2025-01-01',
      monthlySalary: 10_000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReason).toContain('תאריכים');
  });

  it('פרישה לגיל פרישה — זכאי כמו פיטורין', () => {
    const result = calculateSeverance({
      startDate: '2005-01-01',
      endDate: '2025-01-01',
      monthlySalary: 15_000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'retirement',
    });

    expect(result.isEligible).toBe(true);
    expect(result.baseSeverance).toBeCloseTo(300_000, -3);
  });

  it('חלקיות משרה 25% — שכר מתואם נכון', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 20_000,
      employmentType: 'hourly',
      partTimePercentage: 25,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.adjustedSalary).toBe(5_000); // 25% מ-20,000
    expect(result.baseSeverance).toBeCloseTo(25_000, -2);
  });
});
