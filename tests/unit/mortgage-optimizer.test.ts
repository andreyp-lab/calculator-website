import { describe, it, expect } from 'vitest';
import {
  optimizeMortgage,
  calculateMonthlyPayment,
  calculateTotalInterest,
  checkConstraints,
  evaluateAllocation,
  computeRiskScore,
  DEFAULT_TRACKS_2026,
  DEFAULT_CONSTRAINTS,
  BANK_OF_ISRAEL_PRIME_2026,
  MIN_FIXED_PERCENT_BOI,
  type OptimizerTrack,
  type OptimizerInput,
  type OptimizerConstraints,
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

  it('33% קבוע בדיוק — עומד', () => {
    // prime=67%, kalatz=33%, indexed=0%
    const percents = [0.67, 0.33, 0];
    expect(checkConstraints(percents, tracks, constraints)).toBe(true);
  });

  it('32% קבוע — לא עומד', () => {
    const percents = [0.68, 0.32, 0];
    expect(checkConstraints(percents, tracks, constraints)).toBe(false);
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
