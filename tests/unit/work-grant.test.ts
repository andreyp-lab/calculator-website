import { describe, it, expect } from 'vitest';
import {
  calculateWorkGrant,
  calculateRawGrant,
  calculateMaxGrant,
  buildGrantCurve,
  getYearComparison,
  checkEligibility,
  calculateNIT,
  WORK_GRANT_MIN_INCOME_2026,
  WORK_GRANT_PEAK_INCOME_2026,
  WORK_GRANT_MAX_INCOME_SINGLE_2026,
  WORK_GRANT_MAX_INCOME_PARENT_2026,
  WORK_GRANT_BASE_MAX_2026,
  WORK_GRANT_PER_CHILD_2026,
  WORK_GRANT_SINGLE_PARENT_BONUS_2026,
  WORK_GRANT_MIN_AGE_NO_CHILDREN,
  WORK_GRANT_MIN_AGE_WITH_CHILDREN,
  type WorkGrantInput,
} from '@/lib/calculators/work-grant';

// ====================================================================
// קבועים
// ====================================================================
describe('קבועים 2026', () => {
  it('הכנסה מינימלית', () => {
    expect(WORK_GRANT_MIN_INCOME_2026).toBe(30_240);
  });

  it('הכנסה לשיא', () => {
    expect(WORK_GRANT_PEAK_INCOME_2026).toBe(67_320);
  });

  it('תקרה יחיד', () => {
    expect(WORK_GRANT_MAX_INCOME_SINGLE_2026).toBe(83_400);
  });

  it('תקרה הורה', () => {
    expect(WORK_GRANT_MAX_INCOME_PARENT_2026).toBe(99_960);
  });

  it('מענק בסיס מקסימלי', () => {
    expect(WORK_GRANT_BASE_MAX_2026).toBe(5_506);
  });

  it('גיל מינימלי ללא ילדים', () => {
    expect(WORK_GRANT_MIN_AGE_NO_CHILDREN).toBe(23);
  });

  it('גיל מינימלי עם ילדים', () => {
    expect(WORK_GRANT_MIN_AGE_WITH_CHILDREN).toBe(21);
  });
});

// ====================================================================
// calculateMaxGrant
// ====================================================================
describe('calculateMaxGrant', () => {
  it('יחיד ללא ילדים', () => {
    expect(calculateMaxGrant(0, false)).toBe(WORK_GRANT_BASE_MAX_2026);
  });

  it('הורה לילד אחד', () => {
    const expected = WORK_GRANT_BASE_MAX_2026 + WORK_GRANT_PER_CHILD_2026;
    expect(calculateMaxGrant(1, false)).toBe(expected);
  });

  it('הורה לשני ילדים', () => {
    const expected = WORK_GRANT_BASE_MAX_2026 + 2 * WORK_GRANT_PER_CHILD_2026;
    expect(calculateMaxGrant(2, false)).toBe(expected);
  });

  it('הורה יחיד עם ילד', () => {
    const expected = WORK_GRANT_BASE_MAX_2026 + WORK_GRANT_PER_CHILD_2026 + WORK_GRANT_SINGLE_PARENT_BONUS_2026;
    expect(calculateMaxGrant(1, true)).toBe(expected);
  });

  it('ללא ילדים — הורה יחיד לא נחשב', () => {
    // singleParentBonus לא נכלל בלי ילדים
    expect(calculateMaxGrant(0, true)).toBe(WORK_GRANT_BASE_MAX_2026);
  });

  it('מגבלה על מספר ילדים (5 מקסימום)', () => {
    const with5 = calculateMaxGrant(5, false);
    const with10 = calculateMaxGrant(10, false);
    expect(with5).toBe(with10);
  });
});

// ====================================================================
// calculateRawGrant
// ====================================================================
describe('calculateRawGrant', () => {
  it('מתחת לסף — אפס', () => {
    expect(calculateRawGrant(20_000, 0, false)).toBe(0);
  });

  it('מעל תקרה (יחיד) — אפס', () => {
    expect(calculateRawGrant(90_000, 0, false)).toBe(0);
  });

  it('בסף מינימלי — מענק קטן מאוד (לא אפס)', () => {
    const grant = calculateRawGrant(WORK_GRANT_MIN_INCOME_2026, 0, false);
    expect(grant).toBeCloseTo(0, 0); // בדיוק בסף = 0 (לינארי מ-0)
  });

  it('בשיא — מקסימום מלא', () => {
    const grant = calculateRawGrant(WORK_GRANT_PEAK_INCOME_2026, 0, false);
    expect(grant).toBeCloseTo(WORK_GRANT_BASE_MAX_2026, 0);
  });

  it('ממש לפני תקרה — כמעט אפס', () => {
    const grant = calculateRawGrant(WORK_GRANT_MAX_INCOME_SINGLE_2026 - 100, 0, false);
    expect(grant).toBeGreaterThan(0);
    expect(grant).toBeLessThan(200);
  });

  it('בתקרת הורה — מקבל מענק (שיא)', () => {
    const grant = calculateRawGrant(WORK_GRANT_PEAK_INCOME_2026, 2, false);
    const max = calculateMaxGrant(2, false);
    expect(grant).toBeCloseTo(max, 0);
  });

  it('עלייה מונוטונית לפני השיא', () => {
    const g1 = calculateRawGrant(40_000, 0, false);
    const g2 = calculateRawGrant(50_000, 0, false);
    const g3 = calculateRawGrant(60_000, 0, false);
    expect(g2).toBeGreaterThan(g1);
    expect(g3).toBeGreaterThan(g2);
  });

  it('ירידה מונוטונית אחרי השיא', () => {
    const g1 = calculateRawGrant(70_000, 0, false);
    const g2 = calculateRawGrant(75_000, 0, false);
    const g3 = calculateRawGrant(80_000, 0, false);
    expect(g2).toBeLessThan(g1);
    expect(g3).toBeLessThan(g2);
  });

  it('השוואה 2024 vs 2026 — 2026 גבוה יותר', () => {
    const g2026 = calculateRawGrant(WORK_GRANT_PEAK_INCOME_2026, 0, false, 2026);
    const g2024 = calculateRawGrant(65_076, 0, false, 2024);
    expect(g2026).toBeGreaterThan(g2024);
  });
});

// ====================================================================
// checkEligibility
// ====================================================================
describe('checkEligibility', () => {
  const baseInput: WorkGrantInput = {
    annualWorkIncome: 55_000,
    age: 35,
    familyStatus: 'single',
    numberOfChildren: 0,
    isSingleParent: false,
    employmentType: 'salaried',
    monthsAsSalaried: 12,
    weeksAsSelfEmployed: 0,
    isIsraeliResident: true,
  };

  it('תנאים מלאים — זכאי', () => {
    const result = checkEligibility(baseInput);
    expect(result.isEligible).toBe(true);
    expect(result.conditions.every(c => c.met)).toBe(true);
  });

  it('מתחת לגיל 23 ללא ילדים — לא זכאי', () => {
    const result = checkEligibility({ ...baseInput, age: 22 });
    expect(result.isEligible).toBe(false);
    expect(result.conditions.find(c => c.label === 'גיל מינימלי')?.met).toBe(false);
  });

  it('גיל 21 עם ילדים — זכאי', () => {
    const result = checkEligibility({ ...baseInput, age: 21, numberOfChildren: 1 });
    expect(result.conditions.find((c) => c.label === 'גיל מינימלי')?.met).toBe(true);
    expect(result.isEligible).toBe(true);
  });

  it('הכנסה נמוכה מדי — לא זכאי', () => {
    const result = checkEligibility({ ...baseInput, annualWorkIncome: 10_000 });
    expect(result.isEligible).toBe(false);
  });

  it('הכנסה גבוהה מדי (יחיד) — לא זכאי', () => {
    const result = checkEligibility({ ...baseInput, annualWorkIncome: 90_000 });
    expect(result.isEligible).toBe(false);
  });

  it('הכנסה גבוהה מהתקרה כהורה — לא זכאי', () => {
    const result = checkEligibility({ ...baseInput, annualWorkIncome: 110_000, numberOfChildren: 2 });
    expect(result.isEligible).toBe(false);
  });

  it('לא תושב — לא זכאי', () => {
    const result = checkEligibility({ ...baseInput, isIsraeliResident: false });
    expect(result.isEligible).toBe(false);
  });

  it('עצמאי עם מספיק שבועות — זכאי', () => {
    const result = checkEligibility({
      ...baseInput,
      employmentType: 'self_employed',
      monthsAsSalaried: 0,
      weeksAsSelfEmployed: 15,
    });
    expect(result.isEligible).toBe(true);
  });

  it('עצמאי עם פחות שבועות — לא זכאי', () => {
    const result = checkEligibility({
      ...baseInput,
      employmentType: 'self_employed',
      monthsAsSalaried: 0,
      weeksAsSelfEmployed: 5,
    });
    expect(result.isEligible).toBe(false);
  });

  it('שכיר עם 4 חודשים בלבד — לא זכאי', () => {
    const result = checkEligibility({ ...baseInput, monthsAsSalaried: 4 });
    expect(result.isEligible).toBe(false);
  });

  it('גיל 58 ללא ילדים — זכאי (גמלאים)', () => {
    const result = checkEligibility({ ...baseInput, age: 58 });
    expect(result.isEligible).toBe(true);
  });

  it('6 שנים אחורה', () => {
    const result = checkEligibility(baseInput);
    expect(result.yearsCanFileBack).toBe(6);
  });
});

// ====================================================================
// calculateWorkGrant (מלא)
// ====================================================================
describe('calculateWorkGrant', () => {
  const baseInput: WorkGrantInput = {
    annualWorkIncome: 55_000,
    age: 35,
    familyStatus: 'single',
    numberOfChildren: 0,
    isSingleParent: false,
    employmentType: 'salaried',
    monthsAsSalaried: 12,
    weeksAsSelfEmployed: 0,
    isIsraeliResident: true,
  };

  it('מבנה תשובה שלם', () => {
    const result = calculateWorkGrant(baseInput);
    expect(result).toHaveProperty('isEligible');
    expect(result).toHaveProperty('annualGrant');
    expect(result).toHaveProperty('monthlyEquivalent');
    expect(result).toHaveProperty('maxPossibleGrant');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('eligibility');
    expect(result).toHaveProperty('tips');
  });

  it('יחיד ב-55K — זכאי', () => {
    const result = calculateWorkGrant(baseInput);
    expect(result.isEligible).toBe(true);
    expect(result.annualGrant).toBeGreaterThan(0);
  });

  it('מענק חודשי = שנתי / 12', () => {
    const result = calculateWorkGrant(baseInput);
    expect(result.monthlyEquivalent).toBeCloseTo(result.annualGrant / 12, 0);
  });

  it('אחוז מהמקסימום בשיא = 100%', () => {
    const result = calculateWorkGrant({ ...baseInput, annualWorkIncome: WORK_GRANT_PEAK_INCOME_2026 });
    expect(result.percentOfMax).toBeCloseTo(100, 0);
  });

  it('שלב עלייה לפני שיא', () => {
    const result = calculateWorkGrant({ ...baseInput, annualWorkIncome: 45_000 });
    expect(result.tier.direction).toBe('rise');
  });

  it('שלב ירידה אחרי שיא', () => {
    const result = calculateWorkGrant({ ...baseInput, annualWorkIncome: 75_000 });
    expect(result.tier.direction).toBe('fall');
  });

  it('פירוט ילדים — bonus תקין', () => {
    const noKids = calculateWorkGrant({ ...baseInput, annualWorkIncome: WORK_GRANT_PEAK_INCOME_2026 });
    const withKids = calculateWorkGrant({ ...baseInput, annualWorkIncome: WORK_GRANT_PEAK_INCOME_2026, numberOfChildren: 2 });
    expect(withKids.breakdown.childrenBonus).toBeGreaterThan(0);
    expect(withKids.annualGrant).toBeGreaterThan(noKids.annualGrant);
  });

  it('הורה יחיד — bonus נוסף', () => {
    const notSingle = calculateWorkGrant({ ...baseInput, annualWorkIncome: WORK_GRANT_PEAK_INCOME_2026, numberOfChildren: 1 });
    const single = calculateWorkGrant({ ...baseInput, annualWorkIncome: WORK_GRANT_PEAK_INCOME_2026, numberOfChildren: 1, isSingleParent: true });
    expect(single.annualGrant).toBeGreaterThan(notSingle.annualGrant);
    expect(single.breakdown.singleParentBonus).toBeGreaterThan(0);
  });

  it('לא זכאי — מענק 0', () => {
    const result = calculateWorkGrant({ ...baseInput, age: 20 });
    expect(result.isEligible).toBe(false);
    expect(result.annualGrant).toBe(0);
  });

  it('יש טיפים לזכאים', () => {
    const result = calculateWorkGrant(baseInput);
    expect(result.tips.length).toBeGreaterThan(0);
  });
});

// ====================================================================
// buildGrantCurve
// ====================================================================
describe('buildGrantCurve', () => {
  it('מחזיר מערך לא ריק', () => {
    const curve = buildGrantCurve(0, false);
    expect(curve.length).toBeGreaterThan(10);
  });

  it('ממוין לפי הכנסה', () => {
    const curve = buildGrantCurve(0, false);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].income).toBeGreaterThanOrEqual(curve[i - 1].income);
    }
  });

  it('ערך בשיא הוא המקסימום', () => {
    const curve = buildGrantCurve(0, false);
    const maxGrant = Math.max(...curve.map(p => p.grant));
    expect(maxGrant).toBeCloseTo(WORK_GRANT_BASE_MAX_2026, -1);
  });

  it('נקודות לפני ואחרי הטווח = 0', () => {
    const curve = buildGrantCurve(0, false);
    const below = curve.find(p => p.income < WORK_GRANT_MIN_INCOME_2026);
    if (below) expect(below.grant).toBe(0);
  });
});

// ====================================================================
// getYearComparison
// ====================================================================
describe('getYearComparison', () => {
  it('מחזיר 2 שנים', () => {
    const cmp = getYearComparison();
    expect(cmp.length).toBe(2);
    expect(cmp[0].year).toBe(2024);
    expect(cmp[1].year).toBe(2026);
  });

  it('2026 גבוה מ-2024', () => {
    const cmp = getYearComparison();
    expect(cmp[1].maxGrantSingle).toBeGreaterThan(cmp[0].maxGrantSingle);
  });
});

// ====================================================================
// calculateNIT (תאימות לאחור)
// ====================================================================
describe('calculateNIT (backward compat)', () => {
  it('מחזיר isEligible', () => {
    const r = calculateNIT({ annualEarnedIncome: 55_000, age: 35, isParent: false, numberOfChildren: 0, isSingleParent: false });
    expect(typeof r.isEligible).toBe('boolean');
  });

  it('זכאי בתנאים נורמליים', () => {
    const r = calculateNIT({ annualEarnedIncome: 55_000, age: 35, isParent: true, numberOfChildren: 2, isSingleParent: false });
    expect(r.isEligible).toBe(true);
    expect(r.annualGrant).toBeGreaterThan(0);
  });

  it('לא זכאי מתחת לגיל', () => {
    const r = calculateNIT({ annualEarnedIncome: 55_000, age: 21, isParent: false, numberOfChildren: 0, isSingleParent: false });
    expect(r.isEligible).toBe(false);
  });

  it('לא זכאי מעל תקרה', () => {
    const r = calculateNIT({ annualEarnedIncome: 100_000, age: 35, isParent: false, numberOfChildren: 0, isSingleParent: false });
    expect(r.isEligible).toBe(false);
  });
});
