import { describe, it, expect } from 'vitest';
import {
  calculateRecreationPay,
  calculateRecreationPayFull,
  calculateRetroactiveClaim,
  calculateSmartAlerts,
  calculatePartTimeRecreation,
  getRecreationPayTable,
  getRecreationDays,
  INDUSTRY_RATES_2026,
} from '@/lib/calculators/recreation-pay';

// ====================================================================
// getRecreationDays — private sector (backward-compatible)
// ====================================================================

describe('getRecreationDays (private sector)', () => {
  it('פחות משנה — 0 ימים', () => {
    expect(getRecreationDays(0)).toBe(0);
    expect(getRecreationDays(0.9)).toBe(0);
  });

  it('שנה 1 — 5 ימים', () => {
    expect(getRecreationDays(1)).toBe(5);
  });

  it('שנים 2-3 — 6 ימים', () => {
    expect(getRecreationDays(2)).toBe(6);
    expect(getRecreationDays(3)).toBe(6);
  });

  it('שנים 4-10 — 7 ימים', () => {
    expect(getRecreationDays(4)).toBe(7);
    expect(getRecreationDays(7)).toBe(7);
    expect(getRecreationDays(10)).toBe(7);
  });

  it('שנים 11-15 — 8 ימים', () => {
    expect(getRecreationDays(11)).toBe(8);
    expect(getRecreationDays(15)).toBe(8);
  });

  it('שנים 16-19 — 9 ימים', () => {
    expect(getRecreationDays(16)).toBe(9);
    expect(getRecreationDays(19)).toBe(9);
  });

  it('20+ שנים — 10 ימים', () => {
    expect(getRecreationDays(20)).toBe(10);
    expect(getRecreationDays(35)).toBe(10);
  });
});

describe('getRecreationDays (public sector)', () => {
  it('שנה 1 — 6 ימים (ציבורי)', () => {
    expect(getRecreationDays(1, 'public')).toBe(6);
  });

  it('שנים 4-10 — 8 ימים (ציבורי)', () => {
    expect(getRecreationDays(5, 'public')).toBe(8);
  });

  it('20+ שנים — 11 ימים (ציבורי)', () => {
    expect(getRecreationDays(25, 'public')).toBe(11);
  });
});

// ====================================================================
// calculateRecreationPay — backward compatibility
// ====================================================================

describe('calculateRecreationPay (basic — backward compat)', () => {
  it('עובד שנה 1 במגזר פרטי, משרה מלאה', () => {
    const result = calculateRecreationPay({
      yearsOfService: 1,
      partTimePercentage: 100,
      sector: 'private',
    });
    expect(result.isEligible).toBe(true);
    expect(result.daysEntitled).toBe(5);
    expect(result.payPerDay).toBe(418);
    expect(result.fullTimeAmount).toBe(2090);
    expect(result.finalAmount).toBe(2090);
  });

  it('עובד 5 שנים במגזר ציבורי, משרה מלאה', () => {
    const result = calculateRecreationPay({
      yearsOfService: 5,
      partTimePercentage: 100,
      sector: 'public',
    });
    expect(result.daysEntitled).toBe(8);
    expect(result.payPerDay).toBe(471.40);
    expect(result.fullTimeAmount).toBeCloseTo(8 * 471.40, 1);
  });

  it('משרת 50% — חצי מהסכום', () => {
    const full = calculateRecreationPay({ yearsOfService: 5, partTimePercentage: 100, sector: 'private' });
    const half = calculateRecreationPay({ yearsOfService: 5, partTimePercentage: 50, sector: 'private' });
    expect(half.finalAmount).toBeCloseTo(full.finalAmount / 2, 0);
  });

  it('פחות משנת עבודה — לא זכאי', () => {
    const result = calculateRecreationPay({ yearsOfService: 0.5, partTimePercentage: 100, sector: 'private' });
    expect(result.isEligible).toBe(false);
    expect(result.finalAmount).toBe(0);
  });

  it('20+ שנים — 10 ימים', () => {
    const result = calculateRecreationPay({ yearsOfService: 25, partTimePercentage: 100, sector: 'private' });
    expect(result.daysEntitled).toBe(10);
    expect(result.finalAmount).toBe(4180);
  });
});

// ====================================================================
// calculateRecreationPayFull — full calculation
// ====================================================================

describe('calculateRecreationPayFull', () => {
  const baseInput = {
    yearsOfService: 5,
    additionalMonths: 0,
    partTimePercentage: 100,
    sector: 'private' as const,
    industry: 'private_general' as const,
    monthlySalary: 12000,
    creditPoints: 2.25,
    isTermination: false,
    yearsPaid: 0,
  };

  it('זכאות בסיסית — 5 שנים פרטי', () => {
    const r = calculateRecreationPayFull(baseInput);
    expect(r.isEligible).toBe(true);
    expect(r.daysEntitled).toBe(7);
    expect(r.payPerDay).toBe(418);
    expect(r.grossAmount).toBe(7 * 418);
  });

  it('לא זכאי — פחות משנה', () => {
    const r = calculateRecreationPayFull({ ...baseInput, yearsOfService: 0 });
    expect(r.isEligible).toBe(false);
    expect(r.grossAmount).toBe(0);
  });

  it('נטו קטן מברוטו', () => {
    const r = calculateRecreationPayFull({ ...baseInput, monthlySalary: 15000 });
    expect(r.netAmount).toBeGreaterThan(0);
    expect(r.netAmount).toBeLessThan(r.grossAmount);
  });

  it('מס + ב.ל. מסביר את ההפרש ברוטו-נטו', () => {
    const r = calculateRecreationPayFull(baseInput);
    expect(r.grossAmount - r.taxAmount - r.socialSecurityAmount).toBeCloseTo(r.netAmount, 0);
  });

  it('ענף בנקאות — תעריף 490', () => {
    const r = calculateRecreationPayFull({ ...baseInput, sector: 'public', industry: 'banking' });
    expect(r.payPerDay).toBe(490);
  });

  it('חלקי — 50% משרה מוריד ברוטו בחצי', () => {
    const full = calculateRecreationPayFull(baseInput);
    const half = calculateRecreationPayFull({ ...baseInput, partTimePercentage: 50 });
    expect(half.grossAmount).toBeCloseTo(full.grossAmount / 2, 0);
  });

  it('ציבורי > פרטי בהשוואה', () => {
    const r = calculateRecreationPayFull(baseInput);
    expect(r.publicSectorAmount).toBeGreaterThan(r.privateSectorAmount);
  });

  it('חישוב יחסי עזיבה — additionalMonths = 6', () => {
    const r = calculateRecreationPayFull({ ...baseInput, additionalMonths: 6 });
    expect(r.proRatedGross).toBeCloseTo(r.grossAmount * (6 / 12), 0);
  });
});

// ====================================================================
// calculateRetroactiveClaim
// ====================================================================

describe('calculateRetroactiveClaim', () => {
  const baseInput = {
    yearsOfService: 10,
    partTimePercentage: 100,
    sector: 'private' as const,
    unpaidYears: 3,
    monthlySalary: 12000,
  };

  it('תביעה ל-3 שנים', () => {
    const r = calculateRetroactiveClaim(baseInput);
    expect(r.isEligible).toBe(true);
    expect(r.claimYears).toBe(3);
    expect(r.yearlyBreakdown.length).toBe(3);
  });

  it('סכום עם ריבית > סכום בסיס', () => {
    const r = calculateRetroactiveClaim(baseInput);
    expect(r.totalWithInterest).toBeGreaterThan(r.totalGrossClaim);
  });

  it('מעל 4 שנים — נחתך ל-4', () => {
    const r = calculateRetroactiveClaim({ ...baseInput, unpaidYears: 10 });
    expect(r.claimYears).toBe(4);
    expect(r.yearlyBreakdown.length).toBe(4);
    expect(r.statuteNote).toContain('התיישנו');
  });

  it('לא זכאי — פחות משנה', () => {
    const r = calculateRetroactiveClaim({ ...baseInput, yearsOfService: 0 });
    expect(r.isEligible).toBe(false);
  });

  it('פירוט שנתי — yearBack=1 מוסף 5% ריבית', () => {
    const r = calculateRetroactiveClaim(baseInput);
    const year1 = r.yearlyBreakdown[0];
    expect(year1.withInterest).toBeCloseTo(year1.grossAmount * 1.05, 1);
  });

  it('פירוט שנתי — yearBack=2 מוסף 5%^2 ריבית', () => {
    const r = calculateRetroactiveClaim(baseInput);
    const year2 = r.yearlyBreakdown[1];
    expect(year2.withInterest).toBeCloseTo(year2.grossAmount * Math.pow(1.05, 2), 1);
  });
});

// ====================================================================
// calculatePartTimeRecreation
// ====================================================================

describe('calculatePartTimeRecreation', () => {
  it('שנה מלאה — אין pro-rating', () => {
    const r = calculatePartTimeRecreation({
      yearsOfService: 5,
      additionalMonths: 0,
      partTimePercentage: 100,
      sector: 'private',
    });
    expect(r.proRatedDays).toBe(r.annualDays);
  });

  it('6 חודשים — חצי מהשנתי', () => {
    const r = calculatePartTimeRecreation({
      yearsOfService: 5,
      additionalMonths: 6,
      partTimePercentage: 100,
      sector: 'private',
    });
    expect(r.proRatedDays).toBeCloseTo(r.annualDays / 2, 1);
  });

  it('50% משרה + 6 חודשים — רבע מהשנתי', () => {
    const full = calculatePartTimeRecreation({
      yearsOfService: 5,
      additionalMonths: 0,
      partTimePercentage: 100,
      sector: 'private',
    });
    const partial = calculatePartTimeRecreation({
      yearsOfService: 5,
      additionalMonths: 6,
      partTimePercentage: 50,
      sector: 'private',
    });
    expect(partial.grossAmount).toBeCloseTo(full.grossAmount * 0.5 * 0.5, 0);
  });
});

// ====================================================================
// calculateSmartAlerts
// ====================================================================

describe('calculateSmartAlerts', () => {
  it('לא שולם דבר — פער גדול ו-shouldClaim = true', () => {
    const r = calculateSmartAlerts({
      yearsOfService: 8,
      partTimePercentage: 100,
      sector: 'private',
      yearsActuallyPaid: 0,
      monthlySalary: 10000,
    });
    expect(r.shouldClaim).toBe(true);
    expect(r.potentialGap).toBeGreaterThan(0);
    expect(r.alerts.length).toBeGreaterThan(0);
  });

  it('שולם הכל — אין פער', () => {
    const r = calculateSmartAlerts({
      yearsOfService: 4,
      partTimePercentage: 100,
      sector: 'private',
      yearsActuallyPaid: 4,
      monthlySalary: 10000,
    });
    expect(r.shouldClaim).toBe(false);
  });
});

// ====================================================================
// getRecreationPayTable
// ====================================================================

describe('getRecreationPayTable', () => {
  it('מחזיר 6 שורות לפרטי', () => {
    const rows = getRecreationPayTable('private', 100);
    expect(rows.length).toBe(6);
  });

  it('כל שורה מכילה סכום שנתי', () => {
    const rows = getRecreationPayTable('private', 100);
    rows.forEach((row) => {
      expect(row.annualGross).toBeGreaterThan(0);
      expect(row.days).toBeGreaterThan(0);
    });
  });

  it('50% משרה — חצי מהשנתי', () => {
    const full = getRecreationPayTable('private', 100);
    const half = getRecreationPayTable('private', 50);
    full.forEach((row, i) => {
      expect(half[i].annualGross).toBeCloseTo(row.annualGross / 2, 0);
    });
  });
});

// ====================================================================
// INDUSTRY_RATES_2026 — constants sanity
// ====================================================================

describe('INDUSTRY_RATES_2026', () => {
  it('מגזר פרטי — 418 ₪', () => {
    expect(INDUSTRY_RATES_2026.private_general.ratePerDay).toBe(418);
  });

  it('מגזר ציבורי — 471.40 ₪', () => {
    expect(INDUSTRY_RATES_2026.public_general.ratePerDay).toBe(471.40);
  });

  it('בנקאות — גבוה מפרטי', () => {
    expect(INDUSTRY_RATES_2026.banking.ratePerDay).toBeGreaterThan(
      INDUSTRY_RATES_2026.private_general.ratePerDay,
    );
  });

  it('לכל ענף יש label, source ו-ratePerDay > 0', () => {
    Object.values(INDUSTRY_RATES_2026).forEach((r) => {
      expect(r.label).toBeTruthy();
      expect(r.source).toBeTruthy();
      expect(r.ratePerDay).toBeGreaterThan(0);
    });
  });
});
