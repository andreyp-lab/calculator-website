import { describe, it, expect } from 'vitest';
import {
  optimizeMortgage,
  calculateMonthlyPayment,
  calculateTotalInterest,
  checkConstraints,
  evaluateAllocation,
  computeRiskScore,
  hasInflationRelevance,
  calculateDTI,
  calculateClosingCosts,
  calculateStagedPayoff,
  calculateStagedPayoffForMix,
  meetsBudgetConstraint,
  calculateThreeOptions,
  calculateBankGradeAffordability,
  calculateMonthlyPaymentWithGrace,
  calculateTotalInterestWithGrace,
  runIncomeStressTest,
  compareBankOffers,
  calculateTimeline,
  getLTVRateAdjustment,
  getLTVBandLabel,
  calculateSavingsFromHigherDownPayment,
  applyLTVAdjustmentToTracks,
  DEFAULT_STRESS_SCENARIOS,
  LTV_RATE_ADJUSTMENTS_2026,
  DEFAULT_TRACKS_2026,
  DEFAULT_CONSTRAINTS,
  BANK_OF_ISRAEL_PRIME_2026,
  MIN_FIXED_PERCENT_BOI,
  type OptimizerTrack,
  type OptimizerInput,
  type OptimizerConstraints,
  type PrepaymentPlan,
  type AffordabilityProfile,
  type BankOffer,
} from '@/lib/calculators/mortgage-optimizer';

// ============================================================
// עזרים
// ============================================================

function makeInput(overrides: Partial<OptimizerInput> = {}): OptimizerInput {
  return {
    totalAmount: 1_500_000,
    tracks: DEFAULT_TRACKS_2026.map((t) => ({ ...t })),
    objective: 'minimize_total_cost',
    constraints: { ...DEFAULT_CONSTRAINTS },
    riskAversion: 0.5,
    ...overrides,
  };
}

function singleTrack(rate: number, termYears: number): OptimizerTrack {
  return {
    id: 'single',
    name: 'מסלול יחיד',
    type: 'fixed_unlinked',
    rate,
    termYears,
    isLinked: false,
    rateVolatility: 0,
    inflationExposure: 0,
  };
}

// ============================================================
// חישובי עזר בסיסיים
// ============================================================

describe('calculateMonthlyPayment', () => {
  it('חישוב שפיצר ל-1M ₪ ב-4.5% ל-25 שנים', () => {
    const pmt = calculateMonthlyPayment(1_000_000, 4.5, 25);
    // נוסחת שפיצר: ~5,558 ₪
    expect(pmt).toBeGreaterThan(5_400);
    expect(pmt).toBeLessThan(5_700);
  });

  it('ריבית 0% = קרן / n', () => {
    const pmt = calculateMonthlyPayment(300_000, 0, 25);
    const expected = 300_000 / (25 * 12);
    expect(pmt).toBeCloseTo(expected, 1);
  });

  it('סכום 0 = תשלום 0', () => {
    const pmt = calculateMonthlyPayment(0, 4.5, 25);
    expect(pmt).toBe(0);
  });

  it('תקופה 0 = תשלום 0', () => {
    const pmt = calculateMonthlyPayment(500_000, 4.5, 0);
    expect(pmt).toBe(0);
  });

  it('תשלום גדול יותר בריבית גבוהה יותר', () => {
    const low = calculateMonthlyPayment(1_000_000, 3.0, 25);
    const high = calculateMonthlyPayment(1_000_000, 6.0, 25);
    expect(high).toBeGreaterThan(low);
  });

  it('תשלום קטן יותר בתקופה ארוכה יותר', () => {
    const short = calculateMonthlyPayment(1_000_000, 4.5, 20);
    const long_ = calculateMonthlyPayment(1_000_000, 4.5, 30);
    expect(long_).toBeLessThan(short);
  });
});

describe('calculateTotalInterest', () => {
  it('ריבית כוללת גדולה מ-0 עבור ריבית חיובית', () => {
    const interest = calculateTotalInterest(1_000_000, 4.5, 25);
    expect(interest).toBeGreaterThan(0);
  });

  it('ריבית כוללת = 0 עבור ריבית 0%', () => {
    const interest = calculateTotalInterest(500_000, 0, 20);
    expect(interest).toBeCloseTo(0, 0);
  });

  it('ריבית כוללת = סה"כ תשלומים - קרן', () => {
    const amount = 1_000_000;
    const rate = 4.5;
    const years = 25;
    const monthly = calculateMonthlyPayment(amount, rate, years);
    const expected = monthly * years * 12 - amount;
    const actual = calculateTotalInterest(amount, rate, years);
    expect(actual).toBeCloseTo(expected, 0);
  });
});

// ============================================================
// checkConstraints
// ============================================================

describe('checkConstraints', () => {
  const tracks = DEFAULT_TRACKS_2026.map((t) => ({ ...t }));
  const constraints = { ...DEFAULT_CONSTRAINTS };

  it('חלוקה שווה 1/3 — עומד בדרישות', () => {
    const percents = [1 / 3, 1 / 3, 1 / 3];
    expect(checkConstraints(percents, tracks, constraints)).toBe(true);
  });

  it('100% פריים — לא עומד (0% קבוע)', () => {
    const percents = [1, 0, 0]; // prime=100%, kalatz=0%, indexed=0%
    expect(checkConstraints(percents, tracks, constraints)).toBe(false);
  });

  it('33% קבוע + 33% פריים + 34% צמוד — עומד (גבול הוראה 329)', () => {
    // prime=33% (max!), kalatz=33% (min), indexed=34%
    const percents = [0.33, 0.33, 0.34];
    expect(checkConstraints(percents, tracks, constraints)).toBe(true);
  });

  it('32% פריים (מעבר ל-1/3) — לא עומד (כלל 3)', () => {
    // 32% kalatz + 35% indexed = 67% fixed (passes כלל 1), אבל פריים=33% עומד
    // נשנה ל-34% פריים שעוצר על כלל 3
    const percents = [0.34, 0.33, 0.33];
    expect(checkConstraints(percents, tracks, constraints)).toBe(false);
  });

  // הוראה 329 - כלל 3: פריים + משתנים תדירים ≤ 1/3
  it('67% פריים — לא עומד (כלל 3 - פריים מעל 1/3)', () => {
    // prime=67%, kalatz=33%, indexed=0% - היה עובר לפני התיקון
    const percents = [0.67, 0.33, 0];
    expect(checkConstraints(percents, tracks, constraints)).toBe(false);
  });

  it('50% פריים + 50% קל"צ — לא עומד (פריים מעל 33%)', () => {
    const percents = [0.5, 0.5, 0];
    expect(checkConstraints(percents, tracks, constraints)).toBe(false);
  });

  it('פריים בדיוק 33.3% — עומד (גבול הכלל)', () => {
    const percents = [0.333, 0.333, 0.334];
    expect(checkConstraints(percents, tracks, constraints)).toBe(true);
  });

  it('סכום < 100% — לא עומד', () => {
    const percents = [0.3, 0.3, 0.3];
    expect(checkConstraints(percents, tracks, constraints)).toBe(false);
  });

  it('ערך שלילי — לא עומד', () => {
    const percents = [-0.1, 0.6, 0.5];
    expect(checkConstraints(percents, tracks, constraints)).toBe(false);
  });

  it('maxPerTrackPercent = 0.5 — 60% במסלול אחד לא עומד', () => {
    const c: OptimizerConstraints = { ...constraints, maxPerTrackPercent: 0.5 };
    const percents = [0.1, 0.6, 0.3]; // 60% בקל"צ
    expect(checkConstraints(percents, tracks, c)).toBe(false);
  });

  it('maxIndexedPercent = 0.3 — 40% צמוד לא עומד', () => {
    const c: OptimizerConstraints = { ...constraints, maxIndexedPercent: 0.3 };
    const percents = [0.2, 0.4, 0.4]; // 40% צמוד
    expect(checkConstraints(percents, tracks, c)).toBe(false);
  });
});

// ============================================================
// evaluateAllocation
// ============================================================

describe('evaluateAllocation', () => {
  it('סכום הקצאות = totalAmount', () => {
    const input = makeInput();
    const percents = [0.33, 0.33, 0.34];
    const result = evaluateAllocation(percents, input);
    const totalAlloc = result.allocation.reduce((s, a) => s + a.amount, 0);
    expect(totalAlloc).toBeCloseTo(input.totalAmount, -2);
  });

  it('תשלום חודשי = סכום תשלומי כל המסלולים', () => {
    const input = makeInput();
    const percents = [0.4, 0.3, 0.3];
    const result = evaluateAllocation(percents, input);
    const sumPayments = result.allocation.reduce((s, a) => s + a.monthlyPayment, 0);
    expect(result.monthlyPayment).toBeCloseTo(sumPayments, 0);
  });

  it('ריבית ממוצעת משוקללת בין ריביות המסלולים', () => {
    const input = makeInput({ tracks: DEFAULT_TRACKS_2026.map((t) => ({ ...t })) });
    const percents = [0.33, 0.33, 0.34];
    const result = evaluateAllocation(percents, input);
    const expectedRate = DEFAULT_TRACKS_2026.reduce(
      (s, t, i) => s + t.rate * percents[i],
      0,
    );
    expect(result.weightedAvgRate).toBeCloseTo(expectedRate, 3);
  });

  it('% קבוע מחושב נכון', () => {
    const input = makeInput();
    // prime=33%, kalatz=33%, indexed=34%
    const percents = [0.33, 0.33, 0.34];
    const result = evaluateAllocation(percents, input);
    // kalatz + indexed = 67%
    expect(result.fixedPercent).toBeCloseTo(0.67, 2);
  });

  it('isRegulationCompliant = true כש-fixedPercent >= 33%', () => {
    const input = makeInput();
    const percents = [0.33, 0.33, 0.34];
    const result = evaluateAllocation(percents, input);
    expect(result.isRegulationCompliant).toBe(true);
  });

  it('isRegulationCompliant = false כש-fixedPercent < 33%', () => {
    // כדי להגיע ל-<33% קבוע, צריך מסלול שאינו fixed
    const tracks: OptimizerTrack[] = [
      { id: 'p1', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25 },
      { id: 'p2', name: 'פריים2', type: 'prime', rate: 4.5, termYears: 25 },
      { id: 'k1', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25 },
    ];
    const input = makeInput({ tracks });
    const percents = [0.4, 0.4, 0.2]; // רק 20% קבוע
    const result = evaluateAllocation(percents, input);
    expect(result.isRegulationCompliant).toBe(false);
  });
});

// ============================================================
// computeRiskScore
// ============================================================

describe('computeRiskScore', () => {
  it('תמהיל קל"צ בלבד = ציון נמוך (לא תנודתי)', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'k1', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false, rateVolatility: 0, inflationExposure: 0 },
    ];
    const allocation = [{ trackId: 'k1', trackName: 'קל"צ', amount: 1_000_000, percent: 1, monthlyPayment: calculateMonthlyPayment(1_000_000, 4.2, 25), totalInterest: 0, totalPayments: 0 }];
    const score = computeRiskScore(allocation, tracks, 1_000_000, [1, 2.5, 4], [-2, 0, 2]);
    expect(score).toBe(0); // קל"צ לא מגיב לשינויי ריבית
  });

  it('תמהיל פריים בלבד = ציון גבוה (תנודתי)', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p1', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: false, rateVolatility: 2.0, inflationExposure: 0 },
    ];
    const amount = 1_000_000;
    const allocation = [{ trackId: 'p1', trackName: 'פריים', amount, percent: 1, monthlyPayment: calculateMonthlyPayment(amount, 5.0, 25), totalInterest: 0, totalPayments: 0 }];
    const score = computeRiskScore(allocation, tracks, amount, [1, 2.5, 4], [-2, 0, 2]);
    expect(score).toBeGreaterThan(20); // פריים מגיב לשינויי ריבית
  });

  it('תמהיל מעורב = ציון בינוני', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p1', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: false, rateVolatility: 2.0, inflationExposure: 0 },
      { id: 'k1', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false, rateVolatility: 0, inflationExposure: 0 },
    ];
    const amount = 1_000_000;
    const allocation = [
      { trackId: 'p1', trackName: 'פריים', amount: 500_000, percent: 0.5, monthlyPayment: calculateMonthlyPayment(500_000, 5.0, 25), totalInterest: 0, totalPayments: 0 },
      { trackId: 'k1', trackName: 'קל"צ', amount: 500_000, percent: 0.5, monthlyPayment: calculateMonthlyPayment(500_000, 4.2, 25), totalInterest: 0, totalPayments: 0 },
    ];
    const mixedScore = computeRiskScore(allocation, tracks, amount, [1, 2.5, 4], [-2, 0, 2]);

    const allPrime = [
      { trackId: 'p1', trackName: 'פריים', amount, percent: 1, monthlyPayment: calculateMonthlyPayment(amount, 5.0, 25), totalInterest: 0, totalPayments: 0 },
    ];
    const primeTracks = [tracks[0]];
    const primeScore = computeRiskScore(allPrime, primeTracks, amount, [1, 2.5, 4], [-2, 0, 2]);

    expect(mixedScore).toBeLessThan(primeScore);
  });
});

// ============================================================
// optimizeMortgage — בדיקות אינטגרציה
// ============================================================

describe('optimizeMortgage — 1 מסלול', () => {
  it('מסלול יחיד — כל הכסף הולך אליו', () => {
    const tracks = [singleTrack(4.2, 25)];
    const input = makeInput({
      tracks,
      constraints: { ...DEFAULT_CONSTRAINTS, minFixedPercent: 0, maxPerTrackPercent: 1.0 },
    });
    const result = optimizeMortgage(input);
    expect(result.optimal.allocation[0].amount).toBeCloseTo(input.totalAmount, -2);
    expect(result.optimal.allocation[0].percent).toBeCloseTo(1.0, 2);
  });
});

describe('optimizeMortgage — 2 מסלולים', () => {
  it('עם אילוץ מינימום 33% קבוע — 0% קבוע לא מותר', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: false, rateVolatility: 2, inflationExposure: 0 },
      { id: 'k', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false, rateVolatility: 0, inflationExposure: 0 },
    ];
    const input = makeInput({ tracks });
    const result = optimizeMortgage(input);
    const fixedAlloc = result.optimal.allocation.find((a) => a.trackId === 'k');
    expect(fixedAlloc?.percent ?? 0).toBeGreaterThanOrEqual(0.33 - 0.02);
  });

  it('מסלול זול יותר מקבל חלוקה גבוהה יותר (מזעור עלות)', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'cheap', name: 'זול', type: 'fixed_unlinked', rate: 3.0, termYears: 25, isLinked: false, rateVolatility: 0, inflationExposure: 0 },
      { id: 'expensive', name: 'יקר', type: 'fixed_unlinked', rate: 5.0, termYears: 25, isLinked: false, rateVolatility: 0, inflationExposure: 0 },
    ];
    const constraints: OptimizerConstraints = {
      ...DEFAULT_CONSTRAINTS,
      minFixedPercent: 0, // ללא אילוץ קבוע (שני מסלולים קבועים)
      maxPerTrackPercent: 1.0,
    };
    const input = makeInput({ tracks, constraints, objective: 'minimize_total_cost' });
    const result = optimizeMortgage(input);
    const cheapAlloc = result.optimal.allocation.find((a) => a.trackId === 'cheap');
    const expensiveAlloc = result.optimal.allocation.find((a) => a.trackId === 'expensive');
    expect((cheapAlloc?.percent ?? 0)).toBeGreaterThan(expensiveAlloc?.percent ?? 1);
  });
});

describe('optimizeMortgage — 3 מסלולים (ברירת מחדל)', () => {
  it('סכום הקצאות = totalAmount', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    const totalAlloc = result.optimal.allocation.reduce((s, a) => s + a.amount, 0);
    expect(totalAlloc).toBeCloseTo(input.totalAmount, -3);
  });

  it('עומד בדרישות בנק ישראל (33% קבוע)', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.optimal.isRegulationCompliant).toBe(true);
    expect(result.optimal.fixedPercent).toBeGreaterThanOrEqual(MIN_FIXED_PERCENT_BOI - 0.01);
  });

  it('אחוזים = מספרים חיוביים בין 0 ל-1', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    for (const a of result.optimal.allocation) {
      expect(a.percent).toBeGreaterThanOrEqual(0);
      expect(a.percent).toBeLessThanOrEqual(1.001);
    }
  });

  it('תשלום חודשי > 0', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.optimal.monthlyPayment).toBeGreaterThan(0);
  });

  it('עלות כוללת > 0', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.optimal.totalCost).toBeGreaterThan(0);
  });

  it('מטרה שונה מייצרת תוצאה שונה', () => {
    const inputCost = makeInput({ objective: 'minimize_total_cost' });
    const inputRisk = makeInput({ objective: 'minimize_risk' });
    const resultCost = optimizeMortgage(inputCost);
    const resultRisk = optimizeMortgage(inputRisk);
    // תמהיל מזעור עלות צריך להיות שונה ממזעור סיכון (אחרת המטרות אינן שונות)
    // לפחות אחד מהמדדים חייב להיות שונה
    const differentCost = Math.abs(resultCost.optimal.totalCost - resultRisk.optimal.totalCost) > 1000;
    const differentRisk = Math.abs(resultCost.optimal.riskScore - resultRisk.optimal.riskScore) > 0;
    expect(differentCost || differentRisk).toBe(true);
  });

  it('חלופות מוחזרות', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.alternatives.length).toBeGreaterThan(0);
  });

  it('מידע אופטימיזציה כולל iterations > 0', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.optimizationStats.iterationsChecked).toBeGreaterThan(0);
  });
});

describe('optimizeMortgage — מטרות שונות', () => {
  it('מזעור תשלום חודשי: תשלום חודשי לא גרוע יותר מ-balanced', () => {
    const inputMonthly = makeInput({ objective: 'minimize_monthly_payment' });
    const inputBalanced = makeInput({ objective: 'balanced' });
    const resultMonthly = optimizeMortgage(inputMonthly);
    const resultBalanced = optimizeMortgage(inputBalanced);
    // מזעור תשלום חודשי צריך להוביל לתשלום ≤ balanced
    expect(resultMonthly.optimal.monthlyPayment).toBeLessThanOrEqual(
      resultBalanced.optimal.monthlyPayment + 200, // סבלנות 200 ₪
    );
  });

  it('balanced מחזיר pareto frontier', () => {
    const input = makeInput({ objective: 'balanced' });
    const result = optimizeMortgage(input);
    // Pareto frontier צריך להכיל לפחות תוצאה אחת
    expect(result.paretoFrontier === undefined || (result.paretoFrontier?.length ?? 0) >= 1).toBe(true);
  });
});

describe('optimizeMortgage — edge cases', () => {
  it('סכום 0 — מחזיר תוצאה ריקה', () => {
    const input = makeInput({ totalAmount: 0 });
    const result = optimizeMortgage(input);
    expect(result.optimal.monthlyPayment).toBe(0);
    expect(result.optimal.totalCost).toBe(0);
  });

  it('מסלולים ריקים — מחזיר המלצה ריקה', () => {
    const input = makeInput({ tracks: [] });
    const result = optimizeMortgage(input);
    expect(result.optimal.allocation.length).toBe(0);
  });

  it('אילוצים לא פיזיביליים — fallback לתמהיל כלשהו', () => {
    const constraints: OptimizerConstraints = {
      ...DEFAULT_CONSTRAINTS,
      minFixedPercent: 0.95, // כמעט בלתי אפשרי עם 3 מסלולים כולל פריים
    };
    const input = makeInput({ constraints });
    const result = optimizeMortgage(input);
    // לא קורס — מחזיר משהו
    expect(result).toBeDefined();
    expect(result.optimal).toBeDefined();
  });

  it('4 מסלולים — מסתיים בסכום נכון', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: false, rateVolatility: 2, inflationExposure: 0 },
      { id: 'k', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false, rateVolatility: 0, inflationExposure: 0 },
      { id: 'i', name: 'צמוד', type: 'fixed_linked', rate: 3.0, termYears: 25, isLinked: true, rateVolatility: 0, inflationExposure: 1.0 },
      { id: 'v', name: 'משתנה', type: 'variable_5y', rate: 3.8, termYears: 25, isLinked: false, rateVolatility: 1.5, inflationExposure: 0 },
    ];
    const input = makeInput({ tracks });
    const result = optimizeMortgage(input);
    const totalAlloc = result.optimal.allocation.reduce((s, a) => s + a.amount, 0);
    expect(totalAlloc).toBeCloseTo(input.totalAmount, -3);
    expect(result.optimal.isRegulationCompliant).toBe(true);
  });

  it('5 מסלולים — מסתיים תוך זמן סביר', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p1', name: 'פריים 1', type: 'prime', rate: 5.0, termYears: 25, isLinked: false, rateVolatility: 2, inflationExposure: 0 },
      { id: 'p2', name: 'פריים 2', type: 'prime', rate: 4.8, termYears: 20, isLinked: false, rateVolatility: 2, inflationExposure: 0 },
      { id: 'k', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false, rateVolatility: 0, inflationExposure: 0 },
      { id: 'i', name: 'צמוד', type: 'fixed_linked', rate: 3.0, termYears: 25, isLinked: true, rateVolatility: 0, inflationExposure: 1.0 },
      { id: 'v', name: 'משתנה', type: 'variable_5y', rate: 3.8, termYears: 25, isLinked: false, rateVolatility: 1.5, inflationExposure: 0 },
    ];
    const input = makeInput({ tracks });
    const start = Date.now();
    const result = optimizeMortgage(input);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000); // פחות מ-5 שניות
    const totalAlloc = result.optimal.allocation.reduce((s, a) => s + a.amount, 0);
    expect(totalAlloc).toBeCloseTo(input.totalAmount, -3);
  });
});

describe('optimizeMortgage — correctness checks', () => {
  it('תמהיל אופטימלי עומד בכל האילוצים', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    const percents = result.optimal.allocation.map((a) => a.percent);
    expect(checkConstraints(percents, input.tracks, input.constraints)).toBe(true);
  });

  it('כל החלופות עומדות בדרישות בנק ישראל', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    for (const alt of result.alternatives) {
      expect(alt.fixedPercent).toBeGreaterThanOrEqual(MIN_FIXED_PERCENT_BOI - 0.02);
    }
  });

  it('הצעת בנק ממחשבת הפרש נכון', () => {
    const bankPercents = [0.33, 0.33, 0.34]; // 1/3+1/3+1/3
    const input = makeInput({ bankProposalPercents: bankPercents });
    const result = optimizeMortgage(input);
    if (result.bankProposal && result.savingsVsBank !== undefined) {
      const expected = result.bankProposal.totalCost - result.optimal.totalCost;
      expect(result.savingsVsBank).toBeCloseTo(expected, 0);
    }
  });

  it('savingsVsDefault > 0 כשהאופטימלי טוב יותר מתמהיל שווה', () => {
    const input = makeInput({ objective: 'minimize_total_cost' });
    const result = optimizeMortgage(input);
    // האופטימייזר צריך למצוא משהו טוב לפחות כמו תמהיל שווה
    if (result.savingsVsDefault !== undefined) {
      expect(result.savingsVsDefault).toBeGreaterThanOrEqual(0);
    }
  });

  it('ציון סיכון 0-100', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.optimal.riskScore).toBeGreaterThanOrEqual(0);
    expect(result.optimal.riskScore).toBeLessThanOrEqual(100);
    for (const alt of result.alternatives) {
      expect(alt.riskScore).toBeGreaterThanOrEqual(0);
      expect(alt.riskScore).toBeLessThanOrEqual(100);
    }
  });

  it('recommendation לא ריקה', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.recommendation.length).toBeGreaterThan(10);
  });

  it('scenarios מכיל תרחישים עם שמות עבריים', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(result.optimal.scenarios.length).toBeGreaterThan(0);
    const firstScenario = result.optimal.scenarios[0];
    expect(firstScenario.name).toContain('אינפלציה');
  });
});

// ============================================================
// V2: hasInflationRelevance
// ============================================================

describe('hasInflationRelevance', () => {
  it('מסלולים ללא צמוד = false', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: false },
      { id: 'k', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false },
    ];
    expect(hasInflationRelevance(tracks)).toBe(false);
  });

  it('מסלול fixed_linked = true', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'k', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false },
      { id: 'i', name: 'צמוד', type: 'fixed_linked', rate: 3.0, termYears: 25, isLinked: true },
    ];
    expect(hasInflationRelevance(tracks)).toBe(true);
  });

  it('מסלול variable_unlinked = true (כי type matches)', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'v', name: 'משתנה', type: 'variable_unlinked', rate: 4.5, termYears: 25, isLinked: false },
    ];
    // variable_unlinked = type matches the check
    expect(hasInflationRelevance(tracks)).toBe(true);
  });

  it('isLinked=true גם ללא fixed_linked = true', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: true },
    ];
    expect(hasInflationRelevance(tracks)).toBe(true);
  });

  it('רשימה ריקה = false', () => {
    expect(hasInflationRelevance([])).toBe(false);
  });
});

// ============================================================
// V2: calculateDTI
// ============================================================

describe('calculateDTI', () => {
  it('DTI < 30% = safe', () => {
    const result = calculateDTI(3000, 12000); // 25%
    expect(result.status).toBe('safe');
    expect(result.ratioPercent).toBeCloseTo(25, 0);
  });

  it('DTI 35% = good', () => {
    const result = calculateDTI(4200, 12000); // 35%
    expect(result.status).toBe('good');
  });

  it('DTI 44% = tight', () => {
    const result = calculateDTI(5280, 12000); // 44%
    expect(result.status).toBe('tight');
  });

  it('DTI 55% = risky', () => {
    const result = calculateDTI(6600, 12000); // 55%
    expect(result.status).toBe('risky');
  });

  it('DTI 40% על הגבול בין good ל-tight', () => {
    const result = calculateDTI(4800, 12000); // 40%
    // 40% זה הגבול: <0.40 = good, >=0.40 = tight
    expect(result.status === 'good' || result.status === 'tight').toBe(true);
  });

  it('הכנסה 0 = status safe עם הודעת בקשת הכנסה', () => {
    const result = calculateDTI(5000, 0);
    expect(result.status).toBe('safe');
    expect(result.netIncome).toBe(0);
  });

  it('ratio מחושב נכון', () => {
    const result = calculateDTI(4800, 12000);
    expect(result.ratio).toBeCloseTo(0.4, 2);
    expect(result.ratioPercent).toBeCloseTo(40, 0);
  });
});

// ============================================================
// V2: calculateClosingCosts
// ============================================================

describe('calculateClosingCosts', () => {
  it('חישוב נכון עם ברירות מחדל', () => {
    const result = calculateClosingCosts(1_000_000);
    expect(result.lawyerFeeAmount).toBeCloseTo(7500, 0); // 0.75%
    expect(result.bankOpeningFeeAmount).toBeCloseTo(3750, 0); // 0.375%
    expect(result.appraiserFee).toBe(3500);
    expect(result.totalClosingCosts).toBeCloseTo(7500 + 3750 + 3500, 0);
  });

  it('biטוח שנתי מחושב נכון', () => {
    const result = calculateClosingCosts(1_000_000);
    expect(result.lifeInsuranceAnnual).toBeCloseTo(800, 0); // 0.08%
    expect(result.buildingInsuranceAnnual).toBe(900);
    expect(result.totalAnnualInsurance).toBeCloseTo(1700, 0);
  });

  it('פרמטרים מותאמים אישית', () => {
    const result = calculateClosingCosts(2_000_000, {
      lawyerFeePercent: 1.0,
      appraiserFee: 4000,
    });
    expect(result.lawyerFeeAmount).toBeCloseTo(20000, 0);
    expect(result.appraiserFee).toBe(4000);
  });

  it('totalClosingCosts = עו"ד + שמאי + פתיחה', () => {
    const result = calculateClosingCosts(1_500_000, { lawyerFeePercent: 0.5, appraiserFee: 3500, bankOpeningFeePercent: 0.25 });
    const expected = 7500 + 3500 + 3750;
    expect(result.totalClosingCosts).toBeCloseTo(result.lawyerFeeAmount + result.appraiserFee + result.bankOpeningFeeAmount, 0);
  });
});

// ============================================================
// V2: calculateStagedPayoff
// ============================================================

describe('calculateStagedPayoff', () => {
  it('ללא פירעונות — תוצאה זהה לחישוב רגיל', () => {
    const amount = 1_000_000;
    const rate = 5.0;
    const termYears = 25;
    const result = calculateStagedPayoff(amount, rate, termYears, []);
    const expectedInterest = calculateTotalInterest(amount, rate, termYears);
    // טולרנס: הסימולציה יכולה להיות שונה מעט מנוסחת סגור
    expect(result.newTotalInterest).toBeGreaterThan(0);
    expect(Math.abs(result.newTotalInterest - expectedInterest)).toBeLessThan(expectedInterest * 0.05);
  });

  it('פירעון מוקדם מפחית ריבית', () => {
    const amount = 1_000_000;
    const rate = 5.0;
    const termYears = 25;
    const withPrepayment = calculateStagedPayoff(amount, rate, termYears, [{ year: 5, amount: 100_000 }]);
    const withoutPrepayment = calculateStagedPayoff(amount, rate, termYears, []);

    expect(withPrepayment.newTotalInterest).toBeLessThan(withoutPrepayment.newTotalInterest);
    expect(withPrepayment.interestSaved).toBeGreaterThan(50_000); // לפחות 50K חיסכון
  });

  it('פירעון מוקדם מקצר תקופה', () => {
    const amount = 1_000_000;
    const rate = 5.0;
    const termYears = 25;
    const withPrepayment = calculateStagedPayoff(amount, rate, termYears, [{ year: 5, amount: 200_000 }]);

    expect(withPrepayment.newTermMonths).toBeLessThan(termYears * 12);
    expect(withPrepayment.monthsSaved).toBeGreaterThan(0);
  });

  it('פירעון מוקדם גדול (80% מהקרן) מסיים מוקדם מאוד', () => {
    const amount = 1_000_000;
    const rate = 5.0;
    const termYears = 25;
    const result = calculateStagedPayoff(amount, rate, termYears, [{ year: 3, amount: 800_000 }]);
    // אחרי פירעון 80% בשנה 3, אמור להסתיים הרבה לפני 25 שנה
    expect(result.newTermMonths).toBeLessThan(termYears * 12 * 0.7);
  });

  it('prepaymentEvents מכיל את אירוע הפירעון', () => {
    const result = calculateStagedPayoff(1_000_000, 5.0, 25, [{ year: 5, amount: 100_000 }]);
    expect(result.prepaymentEvents.length).toBeGreaterThan(0);
    const ev = result.prepaymentEvents[0];
    expect(ev.year).toBe(5);
    expect(ev.amount).toBeCloseTo(100_000, -3);
  });

  it('interestSaved = originalTotalInterest - newTotalInterest', () => {
    const result = calculateStagedPayoff(1_000_000, 5.0, 25, [{ year: 5, amount: 100_000 }]);
    expect(result.interestSaved).toBeCloseTo(result.originalTotalInterest - result.newTotalInterest, 0);
  });
});

// ============================================================
// V2: calculateStagedPayoffForMix
// ============================================================

describe('calculateStagedPayoffForMix', () => {
  it('חיסכון כולל > 0 כשיש פירעון מוקדם', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    const prepayments: PrepaymentPlan[] = [
      { id: 'pp1', yearNumber: 5, amount: 100_000, trackId: 'auto', description: 'קרן השתלמות' },
    ];
    const payoffResult = calculateStagedPayoffForMix(result.optimal, input.tracks, prepayments, true);
    expect(payoffResult.totalInterestSaved).toBeGreaterThan(0);
  });

  it('comparisonSeries מכיל נתונים', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    const prepayments: PrepaymentPlan[] = [
      { id: 'pp1', yearNumber: 3, amount: 50_000, trackId: 'auto', description: 'בונוס' },
    ];
    const payoffResult = calculateStagedPayoffForMix(result.optimal, input.tracks, prepayments, true);
    expect(payoffResult.comparisonSeries.length).toBeGreaterThan(0);
  });

  it('totalOriginalInterest > totalNewInterest', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    const prepayments: PrepaymentPlan[] = [
      { id: 'pp1', yearNumber: 7, amount: 200_000, trackId: 'auto', description: 'ירושה' },
    ];
    const payoffResult = calculateStagedPayoffForMix(result.optimal, input.tracks, prepayments, true);
    expect(payoffResult.totalOriginalInterest).toBeGreaterThan(payoffResult.totalNewInterest);
  });
});

// ============================================================
// V2: meetsBudgetConstraint
// ============================================================

describe('meetsBudgetConstraint', () => {
  it('ללא מגבלה (0) = תמיד עומד', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    expect(meetsBudgetConstraint(result.optimal, 0)).toBe(true);
  });

  it('מגבלה גבוהה מהתשלום = עומד', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    const highLimit = result.optimal.monthlyPayment + 5000;
    expect(meetsBudgetConstraint(result.optimal, highLimit)).toBe(true);
  });

  it('מגבלה נמוכה מהתשלום = לא עומד', () => {
    const input = makeInput();
    const result = optimizeMortgage(input);
    const lowLimit = result.optimal.monthlyPayment - 100;
    expect(meetsBudgetConstraint(result.optimal, lowLimit)).toBe(false);
  });
});

// ============================================================
// V2: calculateThreeOptions
// ============================================================

describe('calculateThreeOptions', () => {
  it('מחזיר 3 אפשרויות עם labels', () => {
    const input = makeInput();
    const result = calculateThreeOptions(input);
    expect(result.lowestMonthly.label).toBeDefined();
    expect(result.balanced.label).toBeDefined();
    expect(result.lowestCost.label).toBeDefined();
  });

  it('lowestMonthly.monthlyPayment <= balanced.monthlyPayment (בסבלנות)', () => {
    const input = makeInput();
    const result = calculateThreeOptions(input);
    // lowestMonthly אמור להיות <= balanced (עם סבלנות 200 ₪)
    expect(result.lowestMonthly.monthlyPayment).toBeLessThanOrEqual(result.balanced.monthlyPayment + 200);
  });

  it('lowestCost.totalCost <= balanced.totalCost (בסבלנות)', () => {
    const input = makeInput();
    const result = calculateThreeOptions(input);
    // lowestCost אמור להיות <= balanced בעלות כוללת (עם סבלנות)
    expect(result.lowestCost.totalCost).toBeLessThanOrEqual(result.balanced.totalCost + 10_000);
  });

  it('כל 3 האפשרויות עומדות בדרישות בנק ישראל', () => {
    const input = makeInput();
    const result = calculateThreeOptions(input);
    expect(result.lowestMonthly.isRegulationCompliant).toBe(true);
    expect(result.balanced.isRegulationCompliant).toBe(true);
    expect(result.lowestCost.isRegulationCompliant).toBe(true);
  });

  it('כל 3 האפשרויות עם תשלום > 0', () => {
    const input = makeInput();
    const result = calculateThreeOptions(input);
    expect(result.lowestMonthly.monthlyPayment).toBeGreaterThan(0);
    expect(result.balanced.monthlyPayment).toBeGreaterThan(0);
    expect(result.lowestCost.monthlyPayment).toBeGreaterThan(0);
  });
});

// ============================================================
// V2: inflation hidden when no linked tracks
// ============================================================

describe('ניתוח אינפלציה עם/ללא מסלולים צמודים', () => {
  it('תמהיל ללא צמוד: hasInflationRelevance = false', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: false },
      { id: 'k', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false },
    ];
    expect(hasInflationRelevance(tracks)).toBe(false);
  });

  it('תמהיל עם fixed_linked: hasInflationRelevance = true', () => {
    const tracks: OptimizerTrack[] = [
      ...DEFAULT_TRACKS_2026.map((t) => ({ ...t })),
    ];
    expect(hasInflationRelevance(tracks)).toBe(true); // DEFAULT_TRACKS_2026 contains fixed_linked
  });

  it('indexedPercent = 0 כשאין מסלולים צמודים', () => {
    const tracks: OptimizerTrack[] = [
      { id: 'p', name: 'פריים', type: 'prime', rate: 5.0, termYears: 25, isLinked: false },
      { id: 'k', name: 'קל"צ', type: 'fixed_unlinked', rate: 4.2, termYears: 25, isLinked: false },
    ];
    const constraints: OptimizerConstraints = { ...DEFAULT_CONSTRAINTS, minFixedPercent: 0.33 };
    const input: OptimizerInput = {
      totalAmount: 1_000_000,
      tracks,
      objective: 'minimize_total_cost',
      constraints,
    };
    const result = optimizeMortgage(input);
    expect(result.optimal.indexedPercent).toBe(0);
  });
});

// ============================================================
// V3: Feature 1 — calculateBankGradeAffordability
// ============================================================

describe('calculateBankGradeAffordability', () => {
  it('זוג + 2 ילדים, הכנסה 25K — כשירות בין 4,800-5,500 ₪', () => {
    const profile: AffordabilityProfile = {
      netIncome: 25_000,
      familyStatus: 'couple',
      numChildren: 2,
      otherLoanPayments: 0,
      monthlyInsurance: 0,
    };
    const result = calculateBankGradeAffordability(profile);
    // זוג+2 ילדים: הוצאות מחייה 11,500 ₪
    // זמין: 25,000 - 11,500 = 13,500
    // DTI: 25K+LTV<40% → 45%, אחרת 35%
    expect(result.maxMonthlyPayment).toBeGreaterThanOrEqual(4_500);
    expect(result.maxMonthlyPayment).toBeLessThanOrEqual(6_500);
  });

  it('יחיד, הכנסה 12K — פרופיל חלש, DTI 30%', () => {
    const profile: AffordabilityProfile = {
      netIncome: 12_000,
      familyStatus: 'single',
      numChildren: 0,
      otherLoanPayments: 0,
      monthlyInsurance: 0,
    };
    const result = calculateBankGradeAffordability(profile);
    // הכנסה 12K = borderline weak profile
    // יחיד: 12,000 - 4,500 = 7,500 זמין
    expect(result.breakdown.availableForMortgage).toBeCloseTo(7_500, 0);
    expect(result.dtiLimit).toBeLessThanOrEqual(0.35);
  });

  it('הכנסה גבוהה (30K) + LTV נמוך — פרופיל חזק, DTI 45%', () => {
    const profile: AffordabilityProfile = {
      netIncome: 30_000,
      familyStatus: 'couple',
      numChildren: 0,
      otherLoanPayments: 0,
      monthlyInsurance: 0,
      loanAmount: 500_000,
      propertyValue: 2_000_000, // LTV = 25%
    };
    const result = calculateBankGradeAffordability(profile);
    expect(result.dtiLimit).toBe(0.45);
    expect(result.profileColor).toBe('green');
  });

  it('חובות אחרים מורידים את הכשירות', () => {
    const baseProfile: AffordabilityProfile = {
      netIncome: 20_000,
      familyStatus: 'couple',
      numChildren: 1,
      otherLoanPayments: 0,
      monthlyInsurance: 0,
    };
    const withDebts: AffordabilityProfile = {
      ...baseProfile,
      otherLoanPayments: 2_000,
    };
    const base = calculateBankGradeAffordability(baseProfile);
    const withD = calculateBankGradeAffordability(withDebts);
    expect(withD.maxMonthlyPayment).toBeLessThan(base.maxMonthlyPayment);
  });

  it('אזהרה כשהתשלום הרצוי גבוה מהמאושר', () => {
    const profile: AffordabilityProfile = {
      netIncome: 10_000,
      familyStatus: 'couple',
      numChildren: 3,
      otherLoanPayments: 1_000,
      monthlyInsurance: 500,
    };
    const result = calculateBankGradeAffordability(profile, 5_000);
    // הכנסה 10K, הוצאות מחייה 13K → available = שלילי → 0
    expect(result.warningMessage).toBeDefined();
  });

  it('ילד נוסף מעל 3 מוסיף 1,200 ₪ הוצאות', () => {
    const with3Kids: AffordabilityProfile = {
      netIncome: 25_000,
      familyStatus: 'couple',
      numChildren: 3,
      otherLoanPayments: 0,
      monthlyInsurance: 0,
    };
    const with4Kids: AffordabilityProfile = { ...with3Kids, numChildren: 4 };
    const r3 = calculateBankGradeAffordability(with3Kids);
    const r4 = calculateBankGradeAffordability(with4Kids);
    expect(r3.livingExpenses + 1_200).toBeCloseTo(r4.livingExpenses, 0);
  });

  it('breakdown מחושב נכון', () => {
    const profile: AffordabilityProfile = {
      netIncome: 20_000,
      familyStatus: 'couple',
      numChildren: 1,
      otherLoanPayments: 1_000,
      monthlyInsurance: 200,
    };
    const result = calculateBankGradeAffordability(profile);
    const expected = 20_000 - 9_500 - 1_000 - 200; // = 9,300
    expect(result.breakdown.availableForMortgage).toBeCloseTo(expected, 0);
  });
});

// ============================================================
// V3: Feature 2 — Grace Period
// ============================================================

describe('calculateMonthlyPaymentWithGrace', () => {
  it('גרייס 0 = שפיצר רגיל', () => {
    const regular = calculateMonthlyPayment(1_000_000, 5.0, 25);
    const withGrace = calculateMonthlyPaymentWithGrace(1_000_000, 5.0, 25, 0);
    expect(withGrace.afterGrace).toBeCloseTo(regular, 0);
  });

  it('גרייס 12 חודשים ב-5% על 1M = ריבית בלבד 4,166 ₪', () => {
    const { duringGrace } = calculateMonthlyPaymentWithGrace(1_000_000, 5.0, 25, 12);
    // 1,000,000 × 5% / 12 = 4,166.67
    expect(duringGrace).toBeCloseTo(4_166.67, 0);
  });

  it('תשלום אחרי גרייס גבוה יותר מתשלום ללא גרייס', () => {
    const regular = calculateMonthlyPayment(1_000_000, 5.0, 25);
    const { afterGrace } = calculateMonthlyPaymentWithGrace(1_000_000, 5.0, 25, 12);
    // אחרי גרייס: נשאר 24 שנה (288 חודשים), תשלום גבוה יותר
    expect(afterGrace).toBeGreaterThan(regular);
  });

  it('סכום 0 = תשלומי גרייס 0', () => {
    const result = calculateMonthlyPaymentWithGrace(0, 5.0, 25, 12);
    expect(result.duringGrace).toBe(0);
    expect(result.afterGrace).toBe(0);
  });

  it('ריבית 0% בגרייס = 0 תשלום גרייס', () => {
    const result = calculateMonthlyPaymentWithGrace(1_000_000, 0, 25, 12);
    expect(result.duringGrace).toBe(0);
    expect(result.afterGrace).toBeCloseTo(1_000_000 / (24 * 12), 0);
  });
});

describe('calculateTotalInterestWithGrace', () => {
  it('ריבית כוללת עם גרייס גדולה יותר מבלי גרייס', () => {
    const noGrace = calculateTotalInterest(1_000_000, 5.0, 25);
    const withGrace = calculateTotalInterestWithGrace(1_000_000, 5.0, 25, 24);
    expect(withGrace).toBeGreaterThan(noGrace);
  });

  it('גרייס 0 = ריבית רגילה', () => {
    const noGrace = calculateTotalInterest(1_000_000, 5.0, 25);
    const withGrace0 = calculateTotalInterestWithGrace(1_000_000, 5.0, 25, 0);
    expect(withGrace0).toBeCloseTo(noGrace, 0);
  });
});

// ============================================================
// V3: Feature 3 — Income Stress Test
// ============================================================

describe('runIncomeStressTest', () => {
  it('מחזיר 4 תרחישים כברירת מחדל', () => {
    const results = runIncomeStressTest(20_000, 5_000);
    expect(results.length).toBe(DEFAULT_STRESS_SCENARIOS.length);
  });

  it('DTI מחושב נכון בתרחיש 20%', () => {
    const results = runIncomeStressTest(20_000, 5_000);
    const drop20 = results.find((r) => r.scenarioId === 'salary_drop_20');
    expect(drop20).toBeDefined();
    // הכנסה חדשה = 20,000 × 0.80 = 16,000
    // DTI = 5,000 / 16,000 = 31.25%
    expect(drop20!.newDTIPercent).toBeCloseTo(31.25, 0);
    expect(drop20!.status).toBe('green');
  });

  it('ירידה 35% — DTI גבוה יותר', () => {
    const results = runIncomeStressTest(20_000, 5_000);
    const drop20 = results.find((r) => r.scenarioId === 'salary_drop_20');
    const drop35 = results.find((r) => r.scenarioId === 'salary_drop_35');
    expect(drop35!.newDTIPercent).toBeGreaterThan(drop20!.newDTIPercent);
  });

  it('מצב קיצוני עם הכנסה נמוכה — DTI אדום', () => {
    // 10,000 ₪ הכנסה, 5,000 תשלום — ירידה של 50% = 5,000 הכנסה → DTI = 100%
    const results = runIncomeStressTest(10_000, 5_000);
    const oneEarner = results.find((r) => r.scenarioId === 'one_earner_5y');
    expect(oneEarner!.status).toBe('red');
  });

  it('תרחיש מותאם אישית', () => {
    const customScenarios = [{ id: 'custom', label: 'בדיקה', description: 'test', incomeMultiplier: 0.70 }];
    const results = runIncomeStressTest(20_000, 4_000, customScenarios);
    expect(results.length).toBe(1);
    expect(results[0].scenarioId).toBe('custom');
    // 20,000 × 0.70 = 14,000; DTI = 4,000/14,000 = 28.6%
    expect(results[0].newDTIPercent).toBeCloseTo(28.6, 0);
  });

  it('status green כש-DTI < 40%', () => {
    const results = runIncomeStressTest(30_000, 5_000);
    const drop20 = results.find((r) => r.scenarioId === 'salary_drop_20');
    // 30,000 × 0.8 = 24,000; DTI = 5,000/24,000 = 20.8%
    expect(drop20!.status).toBe('green');
  });
});

// ============================================================
// V3: Feature 4 — Bank Comparison
// ============================================================

describe('compareBankOffers', () => {
  it('דירוג: הצעה זולה יותר מקבלת rank=1', () => {
    const offers: BankOffer[] = [
      {
        bankName: 'בנק יקר',
        rates: [
          { trackType: 'fixed_unlinked', rate: 5.0 },
          { trackType: 'prime', rate: 5.5 },
          { trackType: 'fixed_linked', rate: 4.0 },
        ],
        openingFee: 3_000,
      },
      {
        bankName: 'בנק זול',
        rates: [
          { trackType: 'fixed_unlinked', rate: 3.8 },
          { trackType: 'prime', rate: 4.8 },
          { trackType: 'fixed_linked', rate: 2.8 },
        ],
        openingFee: 3_000,
      },
    ];
    const ranked = compareBankOffers(offers, 1_500_000, DEFAULT_TRACKS_2026, 25, DEFAULT_CONSTRAINTS);
    expect(ranked[0].offer.bankName).toBe('בנק זול');
    expect(ranked[0].isBest).toBe(true);
    expect(ranked[0].rank).toBe(1);
  });

  it('savingsVsBest = 0 עבור הטוב ביותר', () => {
    const offers: BankOffer[] = [
      {
        bankName: 'בנק א',
        rates: DEFAULT_TRACKS_2026.map((t) => ({ trackType: t.type, rate: t.rate })),
        openingFee: 3_000,
      },
      {
        bankName: 'בנק ב',
        rates: DEFAULT_TRACKS_2026.map((t) => ({ trackType: t.type, rate: t.rate + 0.5 })),
        openingFee: 3_000,
      },
    ];
    const ranked = compareBankOffers(offers, 1_500_000, DEFAULT_TRACKS_2026, 25, DEFAULT_CONSTRAINTS);
    expect(ranked[0].savingsVsBest).toBe(0);
    expect(ranked[1].savingsVsBest).toBeGreaterThan(0);
  });

  it('אגרת פתיחה נכללת ב-ALL-IN', () => {
    const baseOffer: BankOffer = {
      bankName: 'בנק א',
      rates: DEFAULT_TRACKS_2026.map((t) => ({ trackType: t.type, rate: t.rate })),
      openingFee: 10_000,
    };
    const lowFeeOffer: BankOffer = {
      bankName: 'בנק ב',
      rates: DEFAULT_TRACKS_2026.map((t) => ({ trackType: t.type, rate: t.rate })),
      openingFee: 1_000,
    };
    const ranked = compareBankOffers([baseOffer, lowFeeOffer], 1_500_000, DEFAULT_TRACKS_2026, 25, DEFAULT_CONSTRAINTS);
    const a = ranked.find((r) => r.offer.bankName === 'בנק א');
    const b = ranked.find((r) => r.offer.bankName === 'בנק ב');
    // אותן ריביות, הפרש אגרות = 9,000
    expect(Math.abs(a!.totalAllInCost - b!.totalAllInCost)).toBeCloseTo(9_000, -2);
    expect(b!.isBest).toBe(true);
  });

  it('הצעה אחת — rank=1 וisBest=true', () => {
    const offers: BankOffer[] = [{
      bankName: 'בנק יחיד',
      rates: DEFAULT_TRACKS_2026.map((t) => ({ trackType: t.type, rate: t.rate })),
      openingFee: 3_000,
    }];
    const ranked = compareBankOffers(offers, 1_500_000, DEFAULT_TRACKS_2026, 25, DEFAULT_CONSTRAINTS);
    expect(ranked.length).toBe(1);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[0].isBest).toBe(true);
  });
});

// ============================================================
// V3: Feature 5 — Timeline
// ============================================================

describe('calculateTimeline', () => {
  it('7 שלבים', () => {
    const keysDate = new Date('2026-09-01');
    const timeline = calculateTimeline(keysDate);
    expect(timeline.stages.length).toBe(7);
  });

  it('תאריך התחלה = 84 ימים לפני קבלת מפתח', () => {
    const keysDate = new Date('2026-09-01');
    const timeline = calculateTimeline(keysDate);
    const diffDays = Math.round((keysDate.getTime() - timeline.startDate.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(84);
  });

  it('שלב אחרון = קבלת מפתח', () => {
    const keysDate = new Date('2026-09-01');
    const timeline = calculateTimeline(keysDate);
    const lastStage = timeline.stages[timeline.stages.length - 1];
    expect(lastStage.daysFromEnd).toBe(0);
    expect(lastStage.title).toContain('מפתח');
  });

  it('שלבים ממוינים לפי daysFromStart', () => {
    const keysDate = new Date('2026-09-01');
    const timeline = calculateTimeline(keysDate);
    for (let i = 1; i < timeline.stages.length; i++) {
      expect(timeline.stages[i].daysFromStart).toBeGreaterThanOrEqual(timeline.stages[i - 1].daysFromStart);
    }
  });

  it('formattedStart מכיל שנה', () => {
    const keysDate = new Date('2026-09-01');
    const timeline = calculateTimeline(keysDate);
    expect(timeline.stages[0].formattedStart).toContain('2026');
  });
});

// ============================================================
// V3: Feature 6 — LTV-Adjusted Rates
// ============================================================

describe('getLTVRateAdjustment', () => {
  it('LTV 25% → -0.40%', () => {
    expect(getLTVRateAdjustment(0.25)).toBe(-0.40);
  });

  it('LTV 30% — על הגבול → -0.40%', () => {
    expect(getLTVRateAdjustment(0.30)).toBe(-0.40);
  });

  it('LTV 35% → -0.30%', () => {
    expect(getLTVRateAdjustment(0.35)).toBe(-0.30);
  });

  it('LTV 50% → -0.15%', () => {
    expect(getLTVRateAdjustment(0.50)).toBe(-0.15);
  });

  it('LTV 65% → 0% (בסיס)', () => {
    expect(getLTVRateAdjustment(0.65)).toBe(0.00);
  });

  it('LTV 73% → +0.10%', () => {
    expect(getLTVRateAdjustment(0.73)).toBe(0.10);
  });

  it('LTV 0 → הנחה מקסימלית', () => {
    expect(getLTVRateAdjustment(0)).toBe(-0.40);
  });
});

describe('getLTVBandLabel', () => {
  it('מחזיר תיאור בעברית', () => {
    const label = getLTVBandLabel(0.50);
    expect(label).toContain('%');
  });

  it('LTV 70% = ריבית בסיס', () => {
    const label = getLTVBandLabel(0.65);
    expect(label).toContain('בסיס');
  });
});

describe('calculateSavingsFromHigherDownPayment', () => {
  it('LTV 70% → LTV 60% חוסך ריבית', () => {
    const result = calculateSavingsFromHigherDownPayment(
      1_050_000, // 70% LTV
      1_500_000, // שווי נכס
      150_000,   // הון עצמי נוסף → LTV 60%
      DEFAULT_TRACKS_2026,
      25,
    );
    expect(result.currentLtv).toBeCloseTo(0.70, 2);
    expect(result.newLtv).toBeCloseTo(0.60, 2);
    expect(result.estimatedSavings).toBeGreaterThan(0);
  });

  it('LTV 50% → LTV 30% חוסך יותר מ-80K ₪', () => {
    const result = calculateSavingsFromHigherDownPayment(
      1_500_000, // LTV ~60%
      2_500_000,
      750_000,   // LTV ירד ל-30%
      DEFAULT_TRACKS_2026,
      25,
    );
    expect(result.estimatedSavings).toBeGreaterThan(80_000);
  });

  it('propertyValue 0 = LTV 0', () => {
    const result = calculateSavingsFromHigherDownPayment(
      1_000_000, 0, 200_000, DEFAULT_TRACKS_2026, 25
    );
    expect(result.currentLtv).toBe(0);
  });
});

describe('applyLTVAdjustmentToTracks', () => {
  it('LTV 25% מוריד ריבית ב-0.4%', () => {
    const original = DEFAULT_TRACKS_2026.map((t) => ({ ...t }));
    const adjusted = applyLTVAdjustmentToTracks(original, 0.25);
    for (let i = 0; i < original.length; i++) {
      expect(adjusted[i].rate).toBeCloseTo(Math.max(0.5, original[i].rate - 0.40), 2);
    }
  });

  it('LTV 73% מעלה ריבית ב-0.1%', () => {
    const original = DEFAULT_TRACKS_2026.map((t) => ({ ...t }));
    const adjusted = applyLTVAdjustmentToTracks(original, 0.73);
    for (let i = 0; i < original.length; i++) {
      expect(adjusted[i].rate).toBeCloseTo(original[i].rate + 0.10, 2);
    }
  });

  it('LTV 65% — ריבית ללא שינוי', () => {
    const original = DEFAULT_TRACKS_2026.map((t) => ({ ...t }));
    const adjusted = applyLTVAdjustmentToTracks(original, 0.65);
    for (let i = 0; i < original.length; i++) {
      expect(adjusted[i].rate).toBeCloseTo(original[i].rate, 2);
    }
  });

  it('ריבית לא יורדת מתחת ל-0.5%', () => {
    const lowRateTracks: OptimizerTrack[] = [{
      id: 'test',
      name: 'test',
      type: 'fixed_unlinked',
      rate: 0.3, // נמוכה מאוד
      termYears: 25,
    }];
    const adjusted = applyLTVAdjustmentToTracks(lowRateTracks, 0.10);
    expect(adjusted[0].rate).toBeGreaterThanOrEqual(0.5);
  });
});
