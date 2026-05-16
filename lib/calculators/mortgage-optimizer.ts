/**
 * אופטימייזר תמהיל משכנתא - Solver Style Optimization
 *
 * מוצא את החלוקה האופטימלית בין מסלולי משכנתא למזעור:
 * 1. עלות כוללת (סה"כ ריבית)
 * 2. תשלום חודשי
 * 3. סיכון (שילוב עלות + שונות בתרחישים)
 * 4. Pareto frontier (מאוזן)
 *
 * אלגוריתם: Grid Search עם צמצום אדפטיבי
 * - 3 מסלולים: ~10K iterations (צעד 1%)
 * - 4 מסלולים: ~15K iterations (צעד 2% + צמצום ל-1%)
 * - 5 מסלולים: ~10K iterations (צעד 5% + צמצום ל-1%)
 *
 * מקורות:
 * - בנק ישראל: הוראת ניהול בנקאי תקין 329 (חלוקת מסלולים)
 * - נתוני ריבית: אפריל 2026
 */

// ============================================================
// קבועים
// ============================================================

export const BANK_OF_ISRAEL_PRIME_2026 = 5.5;
export const BOI_BASE_RATE_2026 = 4.0;
export const AVG_INFLATION_ISRAEL = 2.5;

/**
 * הוראת בנק ישראל מס' 329 (תקנת המשכנתאות, 2013)
 *
 * שלושת הכללים:
 *   1. לפחות 33.3% במסלול ריבית קבועה (קל"צ או צמוד מדד קבועה)
 *   2. לכל היותר 66.7% במסלולי ריבית משתנה (כלל המשתנים מצטברים)
 *   3. לכל היותר 33.3% במסלולים שמשתנים בתדירות גבוהה מ-5 שנים
 *      (פריים, משתנה לא צמוד שמשתנה כל שנה/רבעון/חודש)
 *
 * הכלל השלישי הוא הסיבה שאי-אפשר לקחת 50%+ פריים גם אם השאר קל"צ.
 * מקור: הוראה 329 + תיקון מאי 2013.
 */
export const MIN_FIXED_PERCENT_BOI = 1 / 3; // לפחות 1/3 קבוע (33.33%)
export const MAX_VARIABLE_PERCENT_BOI = 2 / 3; // עד 2/3 משתנה (66.67%)
export const MAX_HIGH_FREQUENCY_VARIABLE_BOI = 1 / 3; // עד 1/3 פריים + משתנים תדירים

// ============================================================
// טיפוסים
// ============================================================

export type OptimizerTrackType =
  | 'prime'
  | 'fixed_unlinked'
  | 'fixed_linked'
  | 'variable_5y'
  | 'variable_unlinked';

export type OptimizationObjective =
  | 'minimize_total_cost'
  | 'minimize_monthly_payment'
  | 'minimize_risk'
  | 'balanced';

export interface OptimizerTrack {
  id: string;
  name: string;
  type: OptimizerTrackType;
  rate: number; // ריבית שנתית (%)
  termYears: number;
  isLinked?: boolean; // הצמדה למדד
  rateVolatility?: number; // סטיית תקן של שינויי ריבית (%)
  inflationExposure?: number; // 0-1, עד כמה נחשף לאינפלציה
  gracePeriodMonths?: number; // V3: תקופת גרייס (0-60 חודשים)
}

export interface OptimizerConstraints {
  // רגולציה בנק ישראל (חובה) - הוראה 329
  minFixedPercent: number; // ברירת מחדל: 0.33 - לפחות 1/3 קבוע
  maxVariablePercent: number; // ברירת מחדל: 0.67 - עד 2/3 משתנה
  maxHighFrequencyVariablePercent?: number; // ברירת מחדל: 0.33 - עד 1/3 פריים+משתנים תדירים

  // אילוצי משתמש (אופציונלי)
  maxPerTrackPercent?: number; // מקסימום % למסלול בודד (ברירת מחדל: 1.0)
  maxIndexedPercent?: number; // מקסימום % צמוד מדד (ברירת מחדל: 1.0)
  minPerTrackPercent?: number; // מינימום % למסלול (אם נבחר, ברירת מחדל: 0)

  // תרחישים לחישוב סיכון
  inflationScenarios?: number[]; // % (ברירת מחדל: [1, 2.5, 4])
  primeShockScenarios?: number[]; // שינוי % (ברירת מחדל: [-2, 0, +2])
}

export interface OptimizerInput {
  totalAmount: number; // סה"כ משכנתא (₪)
  tracks: OptimizerTrack[];
  objective: OptimizationObjective;
  constraints: OptimizerConstraints;
  riskAversion?: number; // 0-1, ברירת מחדל: 0.5 (עבור 'balanced')
  // הצעת הבנק (לשוואה)
  bankProposalPercents?: number[]; // % לפי סדר המסלולים
}

export interface TrackAllocation {
  trackId: string;
  trackName: string;
  amount: number;
  percent: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayments: number;
}

export interface AllocationResult {
  allocation: TrackAllocation[];
  totalCost: number; // סה"כ ריבית
  totalPayments: number; // סה"כ תשלומים
  monthlyPayment: number; // תשלום חודשי ראשון
  weightedAvgRate: number; // ריבית ממוצעת משוקללת
  riskScore: number; // 0-100 (גבוה = מסוכן יותר)
  fixedPercent: number; // % מסלולים קבועים
  indexedPercent: number; // % צמוד מדד
  isRegulationCompliant: boolean; // עמידה בדרישות בנק ישראל

  // ביצועים בתרחישים
  scenarios: {
    name: string;
    totalCost: number;
    monthlyPaymentYear1: number;
    deltaFromBase: number; // ₪ שינוי מתרחיש הבסיס
  }[];

  // ציון האופטימיזציה
  objectiveScore: number;
}

export interface OptimizerResult {
  optimal: AllocationResult;
  alternatives: AllocationResult[]; // 4 חלופות טובות
  bankProposal?: AllocationResult; // הצעת הבנק (אם סופקה)
  savingsVsBank?: number; // חיסכון vs. הצעת הבנק
  savingsVsDefault?: number; // חיסכון vs. תמהיל 1/3+1/3+1/3
  paretoFrontier?: AllocationResult[]; // קיצה של פארטו (עבור 'balanced')
  defaultMixResult?: AllocationResult; // תמהיל 1/3+1/3+1/3 לשוואה
  recommendation: string; // המלצה בעברית
  optimizationStats: {
    iterationsChecked: number;
    timeMs: number;
    feasibleSolutions: number;
  };
}

// ============================================================
// מסלולי ברירת מחדל 2026
// ============================================================

export const DEFAULT_TRACKS_2026: OptimizerTrack[] = [
  {
    id: 'prime',
    name: 'פריים',
    type: 'prime',
    rate: BANK_OF_ISRAEL_PRIME_2026 - 0.5, // 5.0%
    termYears: 25,
    isLinked: false,
    rateVolatility: 2.0, // ±2% שינוי אפשרי
    inflationExposure: 0,
  },
  {
    id: 'kalatz',
    name: 'קל"צ',
    type: 'fixed_unlinked',
    rate: 4.2,
    termYears: 25,
    isLinked: false,
    rateVolatility: 0, // קבוע
    inflationExposure: 0,
  },
  {
    id: 'indexed',
    name: 'צמוד מדד',
    type: 'fixed_linked',
    rate: 3.0,
    termYears: 25,
    isLinked: true,
    rateVolatility: 0,
    inflationExposure: 1.0, // חשיפה מלאה לאינפלציה
  },
];

export const PRESET_TRACKS_2026 = {
  standard: DEFAULT_TRACKS_2026,
  conservative: [
    {
      id: 'kalatz_long',
      name: 'קל"צ ארוך',
      type: 'fixed_unlinked' as OptimizerTrackType,
      rate: 4.4,
      termYears: 30,
      isLinked: false,
      rateVolatility: 0,
      inflationExposure: 0,
    },
    {
      id: 'kalatz_short',
      name: 'קל"צ קצר',
      type: 'fixed_unlinked' as OptimizerTrackType,
      rate: 3.9,
      termYears: 15,
      isLinked: false,
      rateVolatility: 0,
      inflationExposure: 0,
    },
    {
      id: 'prime_min',
      name: 'פריים (מינימום)',
      type: 'prime' as OptimizerTrackType,
      rate: BANK_OF_ISRAEL_PRIME_2026 - 0.5,
      termYears: 25,
      isLinked: false,
      rateVolatility: 2.0,
      inflationExposure: 0,
    },
  ],
  aggressive: [
    {
      id: 'prime_main',
      name: 'פריים ראשי',
      type: 'prime' as OptimizerTrackType,
      rate: BANK_OF_ISRAEL_PRIME_2026 - 0.7,
      termYears: 20,
      isLinked: false,
      rateVolatility: 2.5,
      inflationExposure: 0,
    },
    {
      id: 'variable5y',
      name: 'משתנה כל 5 שנים',
      type: 'variable_5y' as OptimizerTrackType,
      rate: 3.8,
      termYears: 25,
      isLinked: false,
      rateVolatility: 1.5,
      inflationExposure: 0,
    },
    {
      id: 'kalatz_min',
      name: 'קל"צ (מינימום)',
      type: 'fixed_unlinked' as OptimizerTrackType,
      rate: 4.0,
      termYears: 25,
      isLinked: false,
      rateVolatility: 0,
      inflationExposure: 0,
    },
  ],
} as const;

// ============================================================
// חישובי עזר
// ============================================================

/**
 * חישוב תשלום חודשי (שפיצר)
 * M = P × [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  amount: number,
  annualRate: number,
  termYears: number,
): number {
  if (amount <= 0 || termYears <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return amount / n;
  return (amount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

/**
 * חישוב סה"כ ריבית לאורך חיי המסלול
 */
export function calculateTotalInterest(
  amount: number,
  annualRate: number,
  termYears: number,
): number {
  if (amount <= 0) return 0;
  const monthly = calculateMonthlyPayment(amount, annualRate, termYears);
  const totalPayments = monthly * termYears * 12;
  return totalPayments - amount;
}

/**
 * בדיקת ציות לאילוצים
 */
export function checkConstraints(
  percents: number[],
  tracks: OptimizerTrack[],
  constraints: OptimizerConstraints,
): boolean {
  if (percents.length !== tracks.length) return false;
  // בדיקת ערכים שליליים
  if (percents.some((p) => p < -0.001)) return false;
  const total = percents.reduce((s, p) => s + p, 0);
  if (Math.abs(total - 1.0) > 0.001) return false;

  // אחוז מינימלי קבוע (בנק ישראל)
  const fixedTypes: OptimizerTrackType[] = ['fixed_unlinked', 'fixed_linked'];
  const fixedPercent = percents
    .filter((_, i) => fixedTypes.includes(tracks[i].type))
    .reduce((s, p) => s + p, 0);

  if (fixedPercent < constraints.minFixedPercent - 0.001) return false;

  // אחוז מקסימלי משתנה (כלל 2 של הוראה 329)
  const variableTypes: OptimizerTrackType[] = ['prime', 'variable_5y', 'variable_unlinked'];
  const variablePercent = percents
    .filter((_, i) => variableTypes.includes(tracks[i].type))
    .reduce((s, p) => s + p, 0);

  if (variablePercent > constraints.maxVariablePercent + 0.001) return false;

  // אחוז מקסימלי למשתנים בתדירות גבוהה (כלל 3 של הוראה 329)
  // פריים + משתנה לא צמוד שמשתנה תכופות. משתנה 5y לא נכלל.
  const highFreqVariableTypes: OptimizerTrackType[] = ['prime', 'variable_unlinked'];
  const highFreqVariablePercent = percents
    .filter((_, i) => highFreqVariableTypes.includes(tracks[i].type))
    .reduce((s, p) => s + p, 0);

  const maxHighFreq = constraints.maxHighFrequencyVariablePercent ?? MAX_HIGH_FREQUENCY_VARIABLE_BOI;
  if (highFreqVariablePercent > maxHighFreq + 0.001) return false;

  // אחוז מקסימלי למסלול בודד
  const maxPerTrack = constraints.maxPerTrackPercent ?? 1.0;
  if (percents.some((p) => p > maxPerTrack + 0.001)) return false;

  // אחוז מקסימלי צמוד מדד
  if (constraints.maxIndexedPercent !== undefined) {
    const indexedPercent = percents
      .filter((_, i) => tracks[i].isLinked)
      .reduce((s, p) => s + p, 0);
    if (indexedPercent > constraints.maxIndexedPercent + 0.001) return false;
  }

  // אחוז מינימלי למסלול
  const minPerTrack = constraints.minPerTrackPercent ?? 0;
  if (percents.some((p) => p > 0.001 && p < minPerTrack - 0.001)) return false;

  return true;
}

/**
 * חישוב ציון סיכון (0-100)
 * מבוסס על שונות תשלומים בתרחישים שונים
 */
export function computeRiskScore(
  allocation: TrackAllocation[],
  tracks: OptimizerTrack[],
  totalAmount: number,
  inflationScenarios: number[],
  primeShockScenarios: number[],
): number {
  if (totalAmount <= 0) return 0;

  const baseMonthly = allocation.reduce((s, a) => s + a.monthlyPayment, 0);
  let maxDeviation = 0;
  let totalVariance = 0;

  for (const inflation of inflationScenarios) {
    for (const primeShock of primeShockScenarios) {
      let scenarioMonthly = 0;

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const alloc = allocation[i];
        if (!alloc || alloc.amount <= 0) continue;

        let effectiveRate = track.rate;

        // שוק ריביות: פריים מגיב לשוק
        if (track.type === 'prime' || track.type === 'variable_unlinked') {
          effectiveRate += primeShock;
        } else if (track.type === 'variable_5y') {
          // משתנה כל 5 שנים: חשוף לחצי מהשוק
          effectiveRate += primeShock * 0.5;
        }

        // הצמדה: מסלולים צמודים מגיבים לאינפלציה
        // הריבית נומינלית עולה כדי לשמר ריאלי
        if (track.isLinked && track.inflationExposure) {
          effectiveRate += inflation * track.inflationExposure;
        }

        effectiveRate = Math.max(0.5, effectiveRate); // ריבית מינימלית
        scenarioMonthly += calculateMonthlyPayment(alloc.amount, effectiveRate, track.termYears);
      }

      const deviation = Math.abs(scenarioMonthly - baseMonthly);
      maxDeviation = Math.max(maxDeviation, deviation);
      totalVariance += deviation * deviation;
    }
  }

  // נרמול: 0-100 על בסיס % שינוי מהתשלום הבסיסי
  // 0% שינוי = 0 סיכון, 50%+ שינוי = 100 סיכון
  const avgVariance = Math.sqrt(totalVariance / (inflationScenarios.length * primeShockScenarios.length));
  const relativeVariance = baseMonthly > 0 ? avgVariance / baseMonthly : 0;
  return Math.min(100, Math.round(relativeVariance * 200));
}

/**
 * חישוב AllocationResult מלא מאחוזים
 */
export function evaluateAllocation(
  percents: number[],
  input: OptimizerInput,
): AllocationResult {
  const { totalAmount, tracks } = input;
  const inflationScenarios = input.constraints.inflationScenarios ?? [1.0, 2.5, 4.0];
  const primeShockScenarios = input.constraints.primeShockScenarios ?? [-2.0, 0, 2.0];

  const allocation: TrackAllocation[] = tracks.map((track, i) => {
    const percent = percents[i] ?? 0;
    const amount = percent * totalAmount;
    const monthlyPayment = calculateMonthlyPayment(amount, track.rate, track.termYears);
    const totalInterest = calculateTotalInterest(amount, track.rate, track.termYears);
    const totalPay = monthlyPayment * track.termYears * 12;

    return {
      trackId: track.id,
      trackName: track.name,
      amount,
      percent,
      monthlyPayment,
      totalInterest,
      totalPayments: totalPay,
    };
  });

  const totalCost = allocation.reduce((s, a) => s + a.totalInterest, 0);
  const totalPayments = allocation.reduce((s, a) => s + a.totalPayments, 0);
  const monthlyPayment = allocation.reduce((s, a) => s + a.monthlyPayment, 0);

  // ריבית ממוצעת משוקללת
  const weightedAvgRate =
    totalAmount > 0
      ? tracks.reduce((s, t, i) => s + t.rate * (percents[i] ?? 0), 0)
      : 0;

  // בדיקת ציות
  const fixedTypes: OptimizerTrackType[] = ['fixed_unlinked', 'fixed_linked'];
  const fixedPercent = percents
    .filter((_, i) => fixedTypes.includes(tracks[i].type))
    .reduce((s, p) => s + p, 0);

  const indexedPercent = percents
    .filter((_, i) => tracks[i].isLinked)
    .reduce((s, p) => s + p, 0);

  const isRegulationCompliant = fixedPercent >= MIN_FIXED_PERCENT_BOI - 0.001;

  // ציון סיכון
  const riskScore = computeRiskScore(
    allocation,
    tracks,
    totalAmount,
    inflationScenarios,
    primeShockScenarios,
  );

  // תרחישים
  const baseMonthly = monthlyPayment;
  const scenarios: AllocationResult['scenarios'] = [];

  for (const inflation of inflationScenarios) {
    for (const primeShock of primeShockScenarios) {
      let scenarioMonthly = 0;
      let scenarioCost = 0;

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const alloc = allocation[i];
        if (!alloc || alloc.amount <= 0) continue;

        let effectiveRate = track.rate;
        if (track.type === 'prime' || track.type === 'variable_unlinked') {
          effectiveRate += primeShock;
        } else if (track.type === 'variable_5y') {
          effectiveRate += primeShock * 0.5;
        }
        if (track.isLinked && track.inflationExposure) {
          effectiveRate += inflation * (track.inflationExposure ?? 0);
        }
        effectiveRate = Math.max(0.5, effectiveRate);

        const sMonthly = calculateMonthlyPayment(alloc.amount, effectiveRate, track.termYears);
        scenarioMonthly += sMonthly;
        scenarioCost += sMonthly * track.termYears * 12 - alloc.amount;
      }

      const primeLabel = primeShock === 0 ? '' : primeShock > 0 ? ` + פריים +${primeShock}%` : ` + פריים ${primeShock}%`;
      const name = `אינפלציה ${inflation}%${primeLabel}`;

      scenarios.push({
        name,
        totalCost: scenarioCost,
        monthlyPaymentYear1: scenarioMonthly,
        deltaFromBase: scenarioMonthly - baseMonthly,
      });
    }
  }

  // ציון האופטימיזציה (נמוך יותר = טוב יותר)
  let objectiveScore: number;
  const riskAversion = input.riskAversion ?? 0.5;
  switch (input.objective) {
    case 'minimize_total_cost':
      objectiveScore = totalCost;
      break;
    case 'minimize_monthly_payment':
      objectiveScore = monthlyPayment;
      break;
    case 'minimize_risk':
      objectiveScore = riskScore * totalAmount * 0.01 + totalCost * 0.1;
      break;
    case 'balanced':
      // שילוב עלות + סיכון לפי risk aversion
      objectiveScore =
        totalCost * (1 - riskAversion) + riskScore * totalAmount * 0.01 * riskAversion;
      break;
  }

  return {
    allocation,
    totalCost,
    totalPayments,
    monthlyPayment,
    weightedAvgRate,
    riskScore,
    fixedPercent,
    indexedPercent,
    isRegulationCompliant,
    scenarios,
    objectiveScore,
  };
}

// ============================================================
// אלגוריתם Grid Search אדפטיבי
// ============================================================

/**
 * מחולל כל הצירופים של percents עבור T מסלולים
 * עם צעד נתון
 */
function* generateCombinations(
  numTracks: number,
  step: number,
): Generator<number[]> {
  const steps = Math.round(1 / step);

  if (numTracks === 1) {
    yield [1.0];
    return;
  }

  if (numTracks === 2) {
    for (let i = 0; i <= steps; i++) {
      const p1 = i * step;
      const p2 = 1 - p1;
      if (p2 >= -0.001) yield [p1, Math.max(0, p2)];
    }
    return;
  }

  if (numTracks === 3) {
    for (let i = 0; i <= steps; i++) {
      const p1 = i * step;
      for (let j = 0; j <= steps - i; j++) {
        const p2 = j * step;
        const p3 = 1 - p1 - p2;
        if (p3 >= -0.001) yield [p1, p2, Math.max(0, p3)];
      }
    }
    return;
  }

  if (numTracks === 4) {
    for (let i = 0; i <= steps; i++) {
      const p1 = i * step;
      for (let j = 0; j <= steps - i; j++) {
        const p2 = j * step;
        for (let k = 0; k <= steps - i - j; k++) {
          const p3 = k * step;
          const p4 = 1 - p1 - p2 - p3;
          if (p4 >= -0.001) yield [p1, p2, p3, Math.max(0, p4)];
        }
      }
    }
    return;
  }

  // 5 מסלולים
  for (let i = 0; i <= steps; i++) {
    const p1 = i * step;
    for (let j = 0; j <= steps - i; j++) {
      const p2 = j * step;
      for (let k = 0; k <= steps - i - j; k++) {
        const p3 = k * step;
        for (let l = 0; l <= steps - i - j - k; l++) {
          const p4 = l * step;
          const p5 = 1 - p1 - p2 - p3 - p4;
          if (p5 >= -0.001) yield [p1, p2, p3, p4, Math.max(0, p5)];
        }
      }
    }
  }
}

/**
 * חיפוש Grid ראשוני עם צעד גס
 * מחזיר topN אחוזות הטובות ביותר
 */
function gridSearchCoarse(
  input: OptimizerInput,
  step: number,
  topN: number,
): { percents: number[]; score: number }[] {
  const { tracks, constraints } = input;
  const candidates: { percents: number[]; score: number }[] = [];

  for (const percents of generateCombinations(tracks.length, step)) {
    if (!checkConstraints(percents, tracks, constraints)) continue;

    const result = evaluateAllocation(percents, input);
    candidates.push({ percents: [...percents], score: result.objectiveScore });
  }

  // מיין לפי ציון (נמוך = טוב) ואחזר topN
  candidates.sort((a, b) => a.score - b.score);
  return candidates.slice(0, topN);
}

/**
 * צמצום סביב נקודה: חיפוש 1% בתוך ±5% מכל ערך
 */
function gridSearchRefine(
  input: OptimizerInput,
  coarsePercents: number[],
  fineStep: number,
): { percents: number[]; score: number } | null {
  const { tracks, constraints } = input;
  const window = 0.10; // חלון חיפוש ±10%

  let bestScore = Infinity;
  let bestPercents: number[] | null = null;

  // יצירת טווח לכל מסלול
  const ranges = coarsePercents.map((p) => ({
    min: Math.max(0, p - window),
    max: Math.min(1, p + window),
  }));

  const steps = Math.round(window * 2 / fineStep) + 1;

  // 3 מסלולים: חיפוש מלא בחלון
  if (tracks.length <= 3) {
    const r0 = ranges[0];
    for (let i = 0; i <= steps; i++) {
      const p1 = Math.round((r0.min + i * fineStep) * 100) / 100;
      if (p1 > r0.max + 0.001) break;
      const r1 = ranges[1];
      const maxP2 = Math.min(r1.max, 1 - p1);
      for (let j = 0; j <= steps; j++) {
        const p2 = Math.round((r1.min + j * fineStep) * 100) / 100;
        if (p2 > maxP2 + 0.001) break;
        const p3 = 1 - p1 - p2;
        if (p3 < -0.001 || p3 > 1 + 0.001) continue;

        const percents = [p1, p2, Math.max(0, p3)];
        if (!checkConstraints(percents, tracks, constraints)) continue;
        const result = evaluateAllocation(percents, input);
        if (result.objectiveScore < bestScore) {
          bestScore = result.objectiveScore;
          bestPercents = percents;
        }
      }
    }
  } else {
    // 4+ מסלולים: שימוש ב-generateCombinations עם fineStep
    for (const percents of generateCombinations(tracks.length, fineStep)) {
      // בדוק שהאחוזות בתוך החלון
      const inWindow = percents.every(
        (p, i) => p >= ranges[i].min - 0.001 && p <= ranges[i].max + 0.001,
      );
      if (!inWindow) continue;
      if (!checkConstraints(percents, tracks, constraints)) continue;
      const result = evaluateAllocation(percents, input);
      if (result.objectiveScore < bestScore) {
        bestScore = result.objectiveScore;
        bestPercents = [...percents];
      }
    }
  }

  return bestPercents ? { percents: bestPercents, score: bestScore } : null;
}

// ============================================================
// פונקציה ראשית: אופטימיזציה
// ============================================================

export function optimizeMortgage(input: OptimizerInput): OptimizerResult {
  const startTime = Date.now();
  const { tracks, totalAmount } = input;

  if (!tracks || tracks.length === 0 || totalAmount <= 0) {
    return createEmptyResult(input);
  }

  const numTracks = tracks.length;

  // שלב 1: חיפוש גס
  let coarseStep: number;
  let topN: number;

  if (numTracks <= 3) {
    coarseStep = 0.01; // 1% - מדויק
    topN = 20;
  } else if (numTracks === 4) {
    coarseStep = 0.02; // 2%
    topN = 15;
  } else {
    coarseStep = 0.05; // 5%
    topN = 10;
  }

  const coarseCandidates = gridSearchCoarse(input, coarseStep, topN);
  let iterationsChecked = 0;

  // ספירת iterations
  const stepsCount = Math.round(1 / coarseStep);
  if (numTracks === 3) iterationsChecked = (stepsCount + 1) * (stepsCount + 2) / 2;
  else if (numTracks === 4) iterationsChecked = Math.pow(stepsCount + 1, 3) / 6;
  else if (numTracks === 5) iterationsChecked = Math.pow(stepsCount + 1, 4) / 24;
  else iterationsChecked = stepsCount + 1;

  // שלב 2: צמצום אדפטיבי (רק אם הצעד הגס לא היה 1%)
  let allCandidates = coarseCandidates;

  if (coarseStep > 0.01 && coarseCandidates.length > 0) {
    const refinedCandidates: { percents: number[]; score: number }[] = [];
    for (const coarse of coarseCandidates.slice(0, 5)) {
      const refined = gridSearchRefine(input, coarse.percents, 0.01);
      if (refined) refinedCandidates.push(refined);
    }
    allCandidates = [...coarseCandidates, ...refinedCandidates];
    allCandidates.sort((a, b) => a.score - b.score);
    iterationsChecked += refinedCandidates.length * 400;
  }

  const feasibleSolutions = coarseCandidates.length;

  if (allCandidates.length === 0) {
    // אין פתרון פיזיבלי — השתמש בברירת מחדל
    return createFallbackResult(input, startTime, iterationsChecked);
  }

  // שלב 3: חישוב תוצאות מלאות
  const optimalPercents = allCandidates[0].percents;
  const optimal = evaluateAllocation(optimalPercents, input);

  // 4 חלופות - אחוזות שונות מבין המובילות
  const alternativePercents = selectDiverseAlternatives(allCandidates.slice(1), 4, tracks.length);
  const alternatives = alternativePercents.map((a) => evaluateAllocation(a.percents, input));

  // Pareto Frontier (עבור 'balanced')
  let paretoFrontier: AllocationResult[] | undefined;
  if (input.objective === 'balanced' && allCandidates.length >= 5) {
    paretoFrontier = buildParetoFrontier(allCandidates.slice(0, 20), input);
  }

  // הצעת הבנק (אם סופקה)
  let bankProposal: AllocationResult | undefined;
  let savingsVsBank: number | undefined;
  if (input.bankProposalPercents && input.bankProposalPercents.length === tracks.length) {
    const bankPercentsNorm = normalizePercents(input.bankProposalPercents);
    if (checkConstraints(bankPercentsNorm, tracks, input.constraints)) {
      bankProposal = evaluateAllocation(bankPercentsNorm, input);
      savingsVsBank = bankProposal.totalCost - optimal.totalCost;
    }
  }

  // תמהיל 1/3+1/3+1/3 לשוואה
  let defaultMixResult: AllocationResult | undefined;
  let savingsVsDefault: number | undefined;
  if (tracks.length >= 3) {
    const defaultPercents = tracks.map((_, i) => (i < tracks.length ? 1 / tracks.length : 0));
    if (checkConstraints(defaultPercents, tracks, input.constraints)) {
      defaultMixResult = evaluateAllocation(defaultPercents, input);
      savingsVsDefault = defaultMixResult.totalCost - optimal.totalCost;
    }
  }

  // המלצה בעברית
  const recommendation = buildRecommendation(optimal, input, savingsVsDefault);

  const timeMs = Date.now() - startTime;

  return {
    optimal,
    alternatives,
    bankProposal,
    savingsVsBank,
    savingsVsDefault,
    defaultMixResult,
    paretoFrontier,
    recommendation,
    optimizationStats: {
      iterationsChecked,
      timeMs,
      feasibleSolutions,
    },
  };
}

// ============================================================
// עזרים פנימיים
// ============================================================

function normalizePercents(percents: number[]): number[] {
  const total = percents.reduce((s, p) => s + p, 0);
  if (total <= 0) return percents;
  return percents.map((p) => p / total);
}

/**
 * בחירת חלופות מגוונות (מרוחקות אחת מהשנייה)
 */
function selectDiverseAlternatives(
  candidates: { percents: number[]; score: number }[],
  n: number,
  numTracks: number,
): { percents: number[]; score: number }[] {
  if (candidates.length <= n) return candidates;

  const selected: { percents: number[]; score: number }[] = [];
  const remaining = [...candidates];

  // בחר את הטוב ביותר
  selected.push(remaining.shift()!);

  while (selected.length < n && remaining.length > 0) {
    // מצא את המרוחק ביותר מהנבחרים
    let maxMinDist = -1;
    let maxIdx = 0;

    for (let i = 0; i < remaining.length; i++) {
      let minDist = Infinity;
      for (const sel of selected) {
        let dist = 0;
        for (let j = 0; j < numTracks; j++) {
          dist += Math.pow((remaining[i].percents[j] ?? 0) - (sel.percents[j] ?? 0), 2);
        }
        minDist = Math.min(minDist, dist);
      }
      if (minDist > maxMinDist) {
        maxMinDist = minDist;
        maxIdx = i;
      }
    }

    selected.push(remaining[maxIdx]);
    remaining.splice(maxIdx, 1);
  }

  return selected;
}

/**
 * בניית קיצה Pareto: עלות vs. סיכון
 */
function buildParetoFrontier(
  candidates: { percents: number[]; score: number }[],
  input: OptimizerInput,
): AllocationResult[] {
  const results = candidates.map((c) => evaluateAllocation(c.percents, input));

  // מיין לפי עלות
  results.sort((a, b) => a.totalCost - b.totalCost);

  // פארטו: רק פתרונות שאינם "dominated" (עלות נמוכה + סיכון נמוך)
  const pareto: AllocationResult[] = [];
  let minRisk = Infinity;

  for (const r of results) {
    if (r.riskScore <= minRisk) {
      pareto.push(r);
      minRisk = r.riskScore;
    }
  }

  // החזר עד 5 נקודות מגוונות
  return pareto.slice(0, 5);
}

/**
 * בניית המלצה בעברית
 */
function buildRecommendation(
  optimal: AllocationResult,
  input: OptimizerInput,
  savingsVsDefault?: number,
): string {
  const { tracks, objective, totalAmount } = input;

  // מצא את המסלול הדומיננטי
  const dominantAlloc = [...optimal.allocation].sort((a, b) => b.percent - a.percent)[0];
  const dominantTrack = tracks.find((t) => t.id === dominantAlloc?.trackId);

  const objectiveLabels: Record<OptimizationObjective, string> = {
    minimize_total_cost: 'מזעור עלות כוללת',
    minimize_monthly_payment: 'מזעור תשלום חודשי',
    minimize_risk: 'מזעור סיכון',
    balanced: 'איזון עלות-סיכון',
  };

  let rec = `לפי מטרת ${objectiveLabels[objective]}, `;

  if (dominantTrack) {
    const pct = Math.round((dominantAlloc.percent ?? 0) * 100);
    rec += `התמהיל האופטימלי כולל ${pct}% ב${dominantTrack.name}. `;
  }

  if (savingsVsDefault && savingsVsDefault > 0) {
    const savings = Math.round(savingsVsDefault).toLocaleString('he-IL');
    rec += `תמהיל זה חוסך ₪${savings} לעומת חלוקה שווה (1/3+1/3+1/3). `;
  }

  if (optimal.riskScore > 60) {
    rec += 'שים לב: הסיכון גבוה יחסית — וודא שיש לך רזרבה לעלייה בתשלומים. ';
  } else if (optimal.riskScore < 30) {
    rec += 'התמהיל שמרני עם חשיפה מינימלית לשינויי ריבית ואינפלציה. ';
  }

  if (!optimal.isRegulationCompliant) {
    rec += '⚠️ שים לב: התמהיל אינו עומד בדרישות בנק ישראל (33% קבוע). ';
  }

  const avgRate = optimal.weightedAvgRate.toFixed(2);
  rec += `ריבית ממוצעת משוקללת: ${avgRate}%.`;

  return rec;
}

/**
 * תוצאה ריקה כשאין קלט
 */
function createEmptyResult(input: OptimizerInput): OptimizerResult {
  const emptyAlloc: AllocationResult = {
    allocation: [],
    totalCost: 0,
    totalPayments: 0,
    monthlyPayment: 0,
    weightedAvgRate: 0,
    riskScore: 0,
    fixedPercent: 0,
    indexedPercent: 0,
    isRegulationCompliant: false,
    scenarios: [],
    objectiveScore: 0,
  };
  return {
    optimal: emptyAlloc,
    alternatives: [],
    recommendation: 'אנא הזן נתוני משכנתא לאופטימיזציה.',
    optimizationStats: { iterationsChecked: 0, timeMs: 0, feasibleSolutions: 0 },
  };
}

/**
 * תוצאה fallback כשאין פתרון פיזיבלי
 */
function createFallbackResult(
  input: OptimizerInput,
  startTime: number,
  iterations: number,
): OptimizerResult {
  // נסה חלוקה שווה
  const { tracks, constraints } = input;
  const equalPercents = tracks.map(() => 1 / tracks.length);

  // אם גם שווה לא עובד — חלוקה עם 33% קבוע
  let percents = equalPercents;
  if (!checkConstraints(equalPercents, tracks, constraints)) {
    percents = buildFallbackPercents(tracks, constraints);
  }

  const fallback = evaluateAllocation(percents, input);
  return {
    optimal: fallback,
    alternatives: [],
    recommendation: 'לא נמצא תמהיל הממלא את כל האילוצים. מוצג תמהיל ברירת מחדל.',
    optimizationStats: {
      iterationsChecked: iterations,
      timeMs: Date.now() - startTime,
      feasibleSolutions: 0,
    },
  };
}

/**
 * בניית אחוזות fallback שעומדות באילוצים בסיסיים
 */
function buildFallbackPercents(
  tracks: OptimizerTrack[],
  constraints: OptimizerConstraints,
): number[] {
  const fixedTypes: OptimizerTrackType[] = ['fixed_unlinked', 'fixed_linked'];
  const fixedIndices = tracks.map((t, i) => (fixedTypes.includes(t.type) ? i : -1)).filter((i) => i >= 0);
  const variableIndices = tracks.map((t, i) => (!fixedTypes.includes(t.type) ? i : -1)).filter((i) => i >= 0);

  const percents = new Array(tracks.length).fill(0);
  const minFixed = constraints.minFixedPercent;

  if (fixedIndices.length === 0) {
    // אין מסלולים קבועים - חלוקה שווה
    return tracks.map(() => 1 / tracks.length);
  }

  // חלק שווה בין קבועים ל-minFixed%, השאר לרשות משתנים
  const fixedPerTrack = minFixed / fixedIndices.length;
  const varPerTrack = variableIndices.length > 0 ? (1 - minFixed) / variableIndices.length : 0;

  for (const i of fixedIndices) percents[i] = fixedPerTrack;
  for (const i of variableIndices) percents[i] = varPerTrack;

  return percents;
}

// ============================================================
// חישוב תמהיל ברירת מחדל (1/3+1/3+1/3) לשוואה
// ============================================================

export function calculateDefaultMix(input: OptimizerInput): AllocationResult {
  const percents = input.tracks.map(() => 1 / input.tracks.length);
  return evaluateAllocation(percents, input);
}

// ============================================================
// V2: טיפוסים חדשים
// ============================================================

/** פירעון מוקדם מתוכנן */
export interface PrepaymentPlan {
  id: string;
  yearNumber: number; // בשנה כמה (1-30)
  amount: number; // סכום (₪)
  trackId: string | 'auto'; // 'auto' = החל על המסלול עם הריבית הגבוהה ביותר
  description: string; // "קרן השתלמות", "ירושה", וכו'
}

/** אילוצי תקציב משתמש */
export interface MaxConstraints {
  maxMonthlyPayment?: number; // תשלום חודשי מקסימלי (₪)
  maxTermYears?: number; // תקופה מקסימלית (שנים)
}

/** מידע DTI (יחס חוב-הכנסה) */
export interface DTIInfo {
  ratio: number; // 0-1
  ratioPercent: number; // 0-100
  status: 'safe' | 'good' | 'tight' | 'risky';
  statusLabel: string;
  statusColor: string; // tailwind color class
  message: string;
  netIncome: number;
  monthlyPayment: number;
}

/** עלויות נלוות */
export interface ClosingCosts {
  lawyerFeePercent: number; // % עו"ד
  lawyerFeeAmount: number;
  appraiserFee: number; // שמאי (₪)
  bankOpeningFeePercent: number; // % אגרת פתיחה
  bankOpeningFeeAmount: number;
  lifeInsurancePercent: number; // % מהיתרה/שנה
  lifeInsuranceAnnual: number;
  buildingInsuranceAnnual: number; // ₪/שנה
  totalClosingCosts: number;
  totalAnnualInsurance: number;
}

/** תוצאת סימולציה עם פירעונות מוקדמים */
export interface StagedPayoffResult {
  trackId: string;
  trackName: string;
  originalAmount: number;
  originalTotalInterest: number;
  originalTermMonths: number;
  newTotalInterest: number;
  newTermMonths: number;
  interestSaved: number;
  monthsSaved: number;
  prepaymentEvents: {
    month: number;
    year: number;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    newMonthlyPayment: number;
  }[];
  monthlyBalanceSeries: { month: number; balance: number; payment: number }[];
}

/** 3 אפשרויות מוצגות */
export interface ThreeOptionsResult {
  lowestMonthly: AllocationResult & { label: string; description: string };
  balanced: AllocationResult & { label: string; description: string };
  lowestCost: AllocationResult & { label: string; description: string };
}

// ============================================================
// V2: פונקציות חדשות
// ============================================================

/**
 * בדיקה האם קיימים מסלולים צמודים בתמהיל
 */
export function hasInflationRelevance(tracks: OptimizerTrack[]): boolean {
  return tracks.some((t) => t.type === 'fixed_linked' || t.type === 'variable_unlinked' || t.isLinked);
}

/**
 * חישוב DTI (Debt-to-Income ratio)
 */
export function calculateDTI(monthlyPayment: number, netIncome: number): DTIInfo {
  if (netIncome <= 0) {
    return {
      ratio: 0,
      ratioPercent: 0,
      status: 'safe',
      statusLabel: 'לא הוזנה הכנסה',
      statusColor: 'gray',
      message: 'הזן הכנסה משפחתית נטו לחישוב יחס ההחזר',
      netIncome,
      monthlyPayment,
    };
  }
  const ratio = monthlyPayment / netIncome;
  const ratioPercent = ratio * 100;

  if (ratio < 0.30) {
    return {
      ratio, ratioPercent, status: 'safe',
      statusLabel: 'תזרים בטוח',
      statusColor: 'green',
      message: `החזר חודשי ${ratioPercent.toFixed(0)}% מההכנסה — תזרים בטוח ונוח. נשאר לך ${((1 - ratio) * 100).toFixed(0)}% להוצאות חיים.`,
      netIncome, monthlyPayment,
    };
  } else if (ratio < 0.40) {
    return {
      ratio, ratioPercent, status: 'good',
      statusLabel: 'שמרני',
      statusColor: 'amber',
      message: `החזר חודשי ${ratioPercent.toFixed(0)}% מההכנסה — בטווח המקובל. רצוי לשמור רזרבה חודשית.`,
      netIncome, monthlyPayment,
    };
  } else if (ratio < 0.50) {
    return {
      ratio, ratioPercent, status: 'tight',
      statusLabel: 'מתוח',
      statusColor: 'orange',
      message: `החזר חודשי ${ratioPercent.toFixed(0)}% מההכנסה — מתוח. שקול תקופה ארוכה יותר, סכום קטן יותר, או הכנסה נוספת.`,
      netIncome, monthlyPayment,
    };
  } else {
    return {
      ratio, ratioPercent, status: 'risky',
      statusLabel: 'לא מומלץ',
      statusColor: 'red',
      message: `החזר חודשי ${ratioPercent.toFixed(0)}% מההכנסה — גבוה מאוד. הבנקים בדרך כלל לא יאשרו מעל 50%. מומלץ לשקול מחדש.`,
      netIncome, monthlyPayment,
    };
  }
}

/**
 * חישוב עלויות נלוות
 */
export function calculateClosingCosts(
  loanAmount: number,
  params: {
    lawyerFeePercent?: number; // ברירת מחדל: 0.75%
    appraiserFee?: number; // ברירת מחדל: 3500
    bankOpeningFeePercent?: number; // ברירת מחדל: 0.375%
    lifeInsurancePercent?: number; // ברירת מחדל: 0.08%
    buildingInsuranceAnnual?: number; // ברירת מחדל: 900
  } = {},
): ClosingCosts {
  const lawyerFeePercent = params.lawyerFeePercent ?? 0.75;
  const appraiserFee = params.appraiserFee ?? 3500;
  const bankOpeningFeePercent = params.bankOpeningFeePercent ?? 0.375;
  const lifeInsurancePercent = params.lifeInsurancePercent ?? 0.08;
  const buildingInsuranceAnnual = params.buildingInsuranceAnnual ?? 900;

  const lawyerFeeAmount = (lawyerFeePercent / 100) * loanAmount;
  const bankOpeningFeeAmount = (bankOpeningFeePercent / 100) * loanAmount;
  const lifeInsuranceAnnual = (lifeInsurancePercent / 100) * loanAmount;

  return {
    lawyerFeePercent,
    lawyerFeeAmount,
    appraiserFee,
    bankOpeningFeePercent,
    bankOpeningFeeAmount,
    lifeInsurancePercent,
    lifeInsuranceAnnual,
    buildingInsuranceAnnual,
    totalClosingCosts: lawyerFeeAmount + appraiserFee + bankOpeningFeeAmount,
    totalAnnualInsurance: lifeInsuranceAnnual + buildingInsuranceAnnual,
  };
}

/**
 * סימולציית פירעון מוקדם לתמהיל אחד
 * ברירת מחדל: שמור תשלום חודשי, קצר תקופה
 */
export function calculateStagedPayoff(
  amount: number,
  annualRate: number,
  termYears: number,
  prepayments: { year: number; amount: number }[],
  keepPaymentConstant = true, // true = קצר תקופה, false = הפחת תשלום
): StagedPayoffResult {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  const originalMonthly = calculateMonthlyPayment(amount, annualRate, termYears);
  const originalTotalInterest = originalMonthly * n - amount;

  // מיין פירעונות לפי שנה
  const sortedPrepayments = [...prepayments].sort((a, b) => a.year - b.year);

  let balance = amount;
  let currentMonthly = originalMonthly;
  let totalInterestPaid = 0;
  const monthlyBalanceSeries: { month: number; balance: number; payment: number }[] = [];
  const prepaymentEvents: StagedPayoffResult['prepaymentEvents'] = [];

  let month = 0;
  let maxMonths = n + 12; // מרווח בטיחות

  while (balance > 1 && month < maxMonths) {
    month++;
    const currentYear = Math.ceil(month / 12);

    // בדוק פירעונות מוקדמים בתחילת שנה זו
    const yearPrepayments = sortedPrepayments.filter((p) => p.year === currentYear && month === (currentYear - 1) * 12 + 1);
    for (const pp of yearPrepayments) {
      const payAmt = Math.min(pp.amount, balance);
      const balanceBefore = balance;
      balance -= payAmt;
      const remainingMonths = maxMonths - month;
      const newMonthly = keepPaymentConstant
        ? currentMonthly // שמור תשלום, קצר תקופה
        : (balance > 0 && r > 0 ? calculateMonthlyPayment(balance, annualRate, Math.max(1, Math.ceil(remainingMonths / 12))) : 0);

      if (!keepPaymentConstant) currentMonthly = newMonthly;

      prepaymentEvents.push({
        month,
        year: currentYear,
        amount: payAmt,
        balanceBefore,
        balanceAfter: balance,
        newMonthlyPayment: currentMonthly,
      });
    }

    if (balance <= 1) break;

    // חישוב ריבית חודשית
    const interestThisMonth = balance * r;
    const principalThisMonth = Math.min(currentMonthly - interestThisMonth, balance);
    totalInterestPaid += interestThisMonth;
    balance -= principalThisMonth;
    if (balance < 0) balance = 0;

    monthlyBalanceSeries.push({ month, balance: Math.round(balance), payment: Math.round(currentMonthly) });
  }

  return {
    trackId: '',
    trackName: '',
    originalAmount: amount,
    originalTotalInterest: Math.round(originalTotalInterest),
    originalTermMonths: n,
    newTotalInterest: Math.round(totalInterestPaid),
    newTermMonths: month,
    interestSaved: Math.round(originalTotalInterest - totalInterestPaid),
    monthsSaved: n - month,
    prepaymentEvents,
    monthlyBalanceSeries,
  };
}

/**
 * סימולציית פירעונות לכלל התמהיל
 */
export function calculateStagedPayoffForMix(
  allocation: AllocationResult,
  tracks: OptimizerTrack[],
  prepayments: PrepaymentPlan[],
  keepPaymentConstant = true,
): {
  trackResults: (StagedPayoffResult & { trackId: string; trackName: string })[];
  totalInterestSaved: number;
  totalOriginalInterest: number;
  totalNewInterest: number;
  newPayoffDateMonths: number; // החודש המקסימלי בו מסלול מסתיים
  comparisonSeries: { year: number; withPrepayment: number; withoutPrepayment: number }[];
} {
  const trackResults = tracks.map((track, idx) => {
    const alloc = allocation.allocation[idx];
    if (!alloc || alloc.amount <= 0) {
      const empty: StagedPayoffResult & { trackId: string; trackName: string } = {
        trackId: track.id, trackName: track.name,
        originalAmount: 0, originalTotalInterest: 0, originalTermMonths: 0,
        newTotalInterest: 0, newTermMonths: 0, interestSaved: 0, monthsSaved: 0,
        prepaymentEvents: [], monthlyBalanceSeries: [],
      };
      return empty;
    }

    // פירעונות למסלול זה: auto → לך למסלול עם הריבית הגבוהה ביותר
    const highestRateTrackId = tracks.reduce((best, t, i) => {
      const a = allocation.allocation[i];
      if (!a || a.amount <= 0) return best;
      if (!best || t.rate > tracks.find((x) => x.id === best)!.rate) return t.id;
      return best;
    }, '');

    const trackPrepayments = prepayments
      .filter((p) => p.trackId === track.id || (p.trackId === 'auto' && track.id === highestRateTrackId))
      .map((p) => ({ year: p.yearNumber, amount: p.amount }));

    const res = calculateStagedPayoff(alloc.amount, track.rate, track.termYears, trackPrepayments, keepPaymentConstant);
    return { ...res, trackId: track.id, trackName: track.name };
  });

  const totalOriginalInterest = trackResults.reduce((s, r) => s + r.originalTotalInterest, 0);
  const totalNewInterest = trackResults.reduce((s, r) => s + r.newTotalInterest, 0);
  const newPayoffDateMonths = Math.max(...trackResults.map((r) => r.newTermMonths));

  // סדרת השוואה שנתית
  const maxYears = Math.ceil(Math.max(...trackResults.map((r) => r.originalTermMonths)) / 12);
  const comparisonSeries: { year: number; withPrepayment: number; withoutPrepayment: number }[] = [];

  for (let year = 1; year <= maxYears; year++) {
    const month = year * 12;
    let withPrepayment = 0;
    let withoutPrepayment = 0;
    for (let i = 0; i < tracks.length; i++) {
      const res = trackResults[i];
      const alloc = allocation.allocation[i];
      if (!alloc || alloc.amount <= 0) continue;
      const monthly = calculateMonthlyPayment(alloc.amount, tracks[i].rate, tracks[i].termYears);
      // ללא פירעון: תשלום חודשי × חודש
      if (month <= res.originalTermMonths) withoutPrepayment += monthly;
      // עם פירעון: מתוך הסדרה
      const entry = res.monthlyBalanceSeries.find((e) => e.month === month);
      if (entry) withPrepayment += entry.payment;
    }
    comparisonSeries.push({ year, withPrepayment: Math.round(withPrepayment), withoutPrepayment: Math.round(withoutPrepayment) });
  }

  return {
    trackResults,
    totalInterestSaved: totalOriginalInterest - totalNewInterest,
    totalOriginalInterest,
    totalNewInterest,
    newPayoffDateMonths,
    comparisonSeries,
  };
}

/**
 * בדיקת אם הקצאה עומדת באילוץ תשלום מקסימלי
 */
export function meetsBudgetConstraint(result: AllocationResult, maxMonthlyPayment: number): boolean {
  if (!maxMonthlyPayment || maxMonthlyPayment <= 0) return true;
  return result.monthlyPayment <= maxMonthlyPayment;
}

/**
 * ייצור 3 אפשרויות: lowest monthly / balanced / lowest cost
 */
export function calculateThreeOptions(input: OptimizerInput): ThreeOptionsResult {
  const lowestMonthlyInput: OptimizerInput = { ...input, objective: 'minimize_monthly_payment' };
  const balancedInput: OptimizerInput = { ...input, objective: 'balanced' };
  const lowestCostInput: OptimizerInput = { ...input, objective: 'minimize_total_cost' };

  const lowestMonthlyRes = optimizeMortgage(lowestMonthlyInput).optimal;
  const balancedRes = optimizeMortgage(balancedInput).optimal;
  const lowestCostRes = optimizeMortgage(lowestCostInput).optimal;

  return {
    lowestMonthly: {
      ...lowestMonthlyRes,
      label: 'תשלום חודשי מינימלי',
      description: 'תקופה ארוכה, תשלום נמוך — מתאים לתזרים מצומצם',
    },
    balanced: {
      ...balancedRes,
      label: 'מאוזן',
      description: 'איזון בין תשלום חודשי לעלות כוללת',
    },
    lowestCost: {
      ...lowestCostRes,
      label: 'עלות כוללת מינימלית',
      description: 'פחות ריבית סה"כ — מתאים למי שמסוגל לשלם יותר כל חודש',
    },
  };
}

// ============================================================
// ייצוא נוסף
// ============================================================

export const DEFAULT_CONSTRAINTS: OptimizerConstraints = {
  minFixedPercent: MIN_FIXED_PERCENT_BOI,
  maxVariablePercent: MAX_VARIABLE_PERCENT_BOI,
  maxHighFrequencyVariablePercent: MAX_HIGH_FREQUENCY_VARIABLE_BOI,
  maxPerTrackPercent: 0.80,
  maxIndexedPercent: 0.60,
  inflationScenarios: [1.0, 2.5, 4.0],
  primeShockScenarios: [-2.0, 0, 2.0],
};

export const TRACK_TYPE_LABELS: Record<OptimizerTrackType, string> = {
  prime: 'פריים',
  fixed_unlinked: 'קבועה לא צמודה (קל"צ)',
  fixed_linked: 'קבועה צמודה (צמ"ק)',
  variable_5y: 'משתנה כל 5 שנים',
  variable_unlinked: 'משתנה לא צמודה',
};

export const TRACK_DEFAULT_RATES: Record<OptimizerTrackType, number> = {
  prime: BANK_OF_ISRAEL_PRIME_2026 - 0.5,
  fixed_unlinked: 4.2,
  fixed_linked: 3.0,
  variable_5y: 3.8,
  variable_unlinked: 4.5,
};

export const TRACK_DEFAULT_VOLATILITY: Record<OptimizerTrackType, number> = {
  prime: 2.0,
  fixed_unlinked: 0,
  fixed_linked: 0,
  variable_5y: 1.5,
  variable_unlinked: 1.8,
};

export const TRACK_COLORS: Record<OptimizerTrackType, string> = {
  prime: '#f97316', // כתום (משתנה, מסוכן)
  fixed_unlinked: '#2563eb', // כחול (יציב)
  fixed_linked: '#f59e0b', // ענבר (צמוד מדד)
  variable_5y: '#8b5cf6', // סגול (משתנה)
  variable_unlinked: '#ec4899', // ורוד
};

export const TRACK_RISK_LABELS: Record<OptimizerTrackType, string> = {
  prime: 'גבוה',
  fixed_unlinked: 'נמוך',
  fixed_linked: 'בינוני',
  variable_5y: 'בינוני',
  variable_unlinked: 'בינוני-גבוה',
};

// ============================================================
// V3: Feature 1 — Bank-Grade Affordability
// ============================================================

/**
 * טבלת הוצאות מחייה לפי הרכב משפחתי (2026, נחיית בנק ישראל)
 * יחיד / זוג + מספר ילדים
 */
export const LIVING_EXPENSES_BY_FAMILY_2026: Record<string, number> = {
  'single_0': 4_500,
  'couple_0': 7_500,
  'couple_1': 9_500,
  'couple_2': 11_500,
  'couple_3': 13_000,
};
export const LIVING_EXPENSES_EXTRA_CHILD_2026 = 1_200;

export type FamilyStatus = 'single' | 'couple';

export interface AffordabilityProfile {
  netIncome: number;           // הכנסה נטו משפחתית (₪/חודש)
  familyStatus: FamilyStatus;  // מצב משפחתי
  numChildren: number;         // מספר ילדים (0-10)
  otherLoanPayments: number;   // חובות אחרים (₪/חודש), ברירת מחדל: 0
  monthlyInsurance: number;    // ביטוחים חודשיים (₪/חודש), ברירת מחדל: 0
  loanAmount?: number;         // סכום המשכנתא (לחישוב LTV)
  propertyValue?: number;      // שווי הנכס (לחישוב LTV)
}

export interface BankAffordabilityResult {
  livingExpenses: number;          // הוצאות מחייה לפי הרכב משפחה
  availableBeforeDTI: number;      // זמין לפני החלת גבול DTI
  dtiLimit: number;                // גבול DTI שנקבע לפרופיל (35/40/45%)
  maxMonthlyPayment: number;       // תשלום חודשי מקסימלי שהבנק יאשר
  breakdown: {
    netIncome: number;
    minusLivingExpenses: number;
    minusOtherLoans: number;
    minusInsurance: number;
    availableForMortgage: number;
    dtiLimitPercent: number;
    maxPayment: number;
  };
  profileLabel: string;            // תיאור הפרופיל (חזק/רגיל/חלש)
  profileColor: 'green' | 'amber' | 'red';
  warningMessage?: string;         // אזהרה אם התשלום הרצוי גבוה מהמאושר
}

/**
 * חישוב כשירות בנק-גרייד
 * מחשב את התשלום החודשי המקסימלי שהבנק יאשר לפי פרופיל הלווה
 */
export function calculateBankGradeAffordability(
  profile: AffordabilityProfile,
  wantedMonthlyPayment?: number,
): BankAffordabilityResult {
  const { netIncome, familyStatus, numChildren, otherLoanPayments, monthlyInsurance } = profile;

  // הוצאות מחייה לפי הרכב משפחה
  const key = numChildren <= 3
    ? `${familyStatus}_${numChildren}`
    : `${familyStatus}_3`;
  const baseLivingExpenses = LIVING_EXPENSES_BY_FAMILY_2026[key] ?? LIVING_EXPENSES_BY_FAMILY_2026['couple_3'];
  const extraKidsExpenses = numChildren > 3 ? (numChildren - 3) * LIVING_EXPENSES_EXTRA_CHILD_2026 : 0;
  const livingExpenses = baseLivingExpenses + extraKidsExpenses;

  // כסף זמין לפני DTI
  const availableForMortgage = Math.max(0, netIncome - livingExpenses - otherLoanPayments - monthlyInsurance);

  // קביעת גבול DTI לפי פרופיל
  let dtiLimit = 0.35; // רגיל
  let profileLabel = 'פרופיל רגיל';
  let profileColor: 'green' | 'amber' | 'red' = 'amber';

  // חישוב LTV אם יש
  const ltv = profile.loanAmount && profile.propertyValue && profile.propertyValue > 0
    ? profile.loanAmount / profile.propertyValue
    : undefined;

  if (netIncome > 25_000 && (!ltv || ltv < 0.40)) {
    dtiLimit = 0.45;
    profileLabel = 'פרופיל חזק';
    profileColor = 'green';
  } else if (netIncome < 12_000 || (ltv !== undefined && ltv > 0.70)) {
    dtiLimit = 0.30;
    profileLabel = 'פרופיל חלש';
    profileColor = 'red';
  }

  const maxMonthlyPayment = Math.floor(availableForMortgage * dtiLimit);

  const result: BankAffordabilityResult = {
    livingExpenses,
    availableBeforeDTI: availableForMortgage,
    dtiLimit,
    maxMonthlyPayment,
    breakdown: {
      netIncome,
      minusLivingExpenses: livingExpenses,
      minusOtherLoans: otherLoanPayments,
      minusInsurance: monthlyInsurance,
      availableForMortgage,
      dtiLimitPercent: dtiLimit * 100,
      maxPayment: maxMonthlyPayment,
    },
    profileLabel,
    profileColor,
  };

  if (wantedMonthlyPayment !== undefined && wantedMonthlyPayment > maxMonthlyPayment) {
    const gap = wantedMonthlyPayment - maxMonthlyPayment;
    result.warningMessage = `התשלום הרצוי (${Math.round(wantedMonthlyPayment).toLocaleString('he-IL')} ₪) גבוה ב-${Math.round(gap).toLocaleString('he-IL')} ₪ ממה שהבנק יאשר.`;
  }

  return result;
}

// ============================================================
// V3: Feature 2 — Grace Period (גרייס)
// ============================================================

/**
 * חישוב תשלום עם תקופת גרייס
 * בתקופת גרייס: ריבית בלבד על הקרן הקיימת
 * לאחר גרייס: שפיצר על הקרן המלאה לתקופה שנשארה
 */
export function calculateMonthlyPaymentWithGrace(
  amount: number,
  annualRate: number,
  termYears: number,
  gracePeriodMonths: number,
): { duringGrace: number; afterGrace: number } {
  if (amount <= 0 || termYears <= 0) return { duringGrace: 0, afterGrace: 0 };

  const r = annualRate / 100 / 12;
  const graceDuringMonths = Math.max(0, Math.min(gracePeriodMonths, termYears * 12 - 1));

  // במהלך גרייס: ריבית בלבד
  const duringGrace = amount * r;

  // לאחר גרייס: שפיצר על הקרן המלאה לתקופה שנשארה
  const remainingMonths = termYears * 12 - graceDuringMonths;
  let afterGrace = 0;
  if (remainingMonths > 0) {
    if (r === 0) {
      afterGrace = amount / remainingMonths;
    } else {
      afterGrace = (amount * (r * Math.pow(1 + r, remainingMonths))) / (Math.pow(1 + r, remainingMonths) - 1);
    }
  }

  return { duringGrace, afterGrace };
}

/**
 * חישוב סה"כ ריבית עם תקופת גרייס
 */
export function calculateTotalInterestWithGrace(
  amount: number,
  annualRate: number,
  termYears: number,
  gracePeriodMonths: number,
): number {
  if (amount <= 0) return 0;
  const { duringGrace, afterGrace } = calculateMonthlyPaymentWithGrace(amount, annualRate, termYears, gracePeriodMonths);
  const grace = Math.max(0, Math.min(gracePeriodMonths, termYears * 12 - 1));
  const remainingMonths = termYears * 12 - grace;
  const totalPaid = duringGrace * grace + afterGrace * remainingMonths;
  return totalPaid - amount;
}

// ============================================================
// V3: Feature 3 — Income Stress Test
// ============================================================

export interface StressScenario {
  id: string;
  label: string;
  description: string;
  incomeMultiplier: number;  // 0-1, כמה מהכנסה נשאר
  durationYears?: number;    // כמה שנים (אם רלוונטי)
}

export const DEFAULT_STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'salary_drop_20',
    label: 'ירידה בשכר 20%',
    description: 'תרחיש ריאליסטי — פיטורים חלקיים, מעבר תפקיד',
    incomeMultiplier: 0.80,
  },
  {
    id: 'salary_drop_35',
    label: 'ירידה בשכר 35%',
    description: 'מיתון קשה — ירידה משמעותית בהכנסה',
    incomeMultiplier: 0.65,
  },
  {
    id: 'one_earner_5y',
    label: 'מפרנס אחד 5 שנים',
    description: 'חופשת לידה, מחלה, פרישה של אחד מבני הזוג',
    incomeMultiplier: 0.50,
    durationYears: 5,
  },
  {
    id: 'retirement_year20',
    label: 'פרישה בשנה 20',
    description: 'מה קורה כשממשיכים למשכנתא אחרי הפרישה',
    incomeMultiplier: 0.60,
    durationYears: undefined,
  },
];

export interface StressTestResult {
  scenarioId: string;
  label: string;
  description: string;
  newMonthlyIncome: number;
  monthlyPayment: number;
  newDTIRatio: number;
  newDTIPercent: number;
  status: 'green' | 'amber' | 'red';
  statusLabel: string;
  recommendation: string;
  incomeMultiplier: number;
}

/**
 * הרצת מבחן עמידות להכנסה
 */
export function runIncomeStressTest(
  monthlyIncome: number,
  monthlyPayment: number,
  scenarios: StressScenario[] = DEFAULT_STRESS_SCENARIOS,
): StressTestResult[] {
  return scenarios.map((sc) => {
    const newIncome = monthlyIncome * sc.incomeMultiplier;
    const dtiRatio = newIncome > 0 ? monthlyPayment / newIncome : 1;
    const dtiPercent = dtiRatio * 100;

    let status: 'green' | 'amber' | 'red';
    let statusLabel: string;
    let recommendation: string;

    if (dtiRatio < 0.40) {
      status = 'green';
      statusLabel = 'עומד בנוחות';
      recommendation = 'התשלום בר-השגה גם בתרחיש זה.';
    } else if (dtiRatio < 0.55) {
      status = 'amber';
      statusLabel = 'מאתגר';
      recommendation = 'רצוי לשמור רזרבה של 3-6 חודשי תשלומים.';
    } else {
      status = 'red';
      statusLabel = 'בעייתי';
      recommendation = 'שקול ביטוח חיים, רזרבה מוגדלת, או הקטנת ההלוואה.';
    }

    return {
      scenarioId: sc.id,
      label: sc.label,
      description: sc.description,
      newMonthlyIncome: Math.round(newIncome),
      monthlyPayment,
      newDTIRatio: dtiRatio,
      newDTIPercent: dtiPercent,
      status,
      statusLabel,
      recommendation,
      incomeMultiplier: sc.incomeMultiplier,
    };
  });
}

// ============================================================
// V3: Feature 4 — Bank Comparison Mode
// ============================================================

export type TrackType = OptimizerTrackType;

export interface BankOffer {
  bankName: string;
  rates: { trackType: TrackType; rate: number }[];
  openingFee: number;  // ₪ (סכום קבוע) או % אם < 5
  openingFeeIsPercent?: boolean; // true = % מהקרן
  notes?: string;
}

export interface RankedOffer {
  rank: number;
  offer: BankOffer;
  totalInterest: number;
  openingFeeAmount: number;
  totalAllInCost: number;  // ריבית + אגרת פתיחה
  monthlyPayment: number;
  weightedRate: number;
  savingsVsBest?: number;  // כמה יקר יותר מהטוב ביותר
  isBest: boolean;
}

/**
 * השוואת הצעות בנקים
 * לכל הצעה מריץ אופטימייזר עם הריביות של אותו בנק
 * ומחשב עלות ALL-IN
 */
export function compareBankOffers(
  offers: BankOffer[],
  loanAmount: number,
  baseTracks: OptimizerTrack[],
  termYears: number,
  constraints: OptimizerConstraints,
): RankedOffer[] {
  const results: Omit<RankedOffer, 'rank' | 'savingsVsBest' | 'isBest'>[] = [];

  for (const offer of offers) {
    // עדכן ריביות לפי ההצעה
    const offerTracks: OptimizerTrack[] = baseTracks.map((track) => {
      const offerRate = offer.rates.find((r) => r.trackType === track.type);
      return { ...track, rate: offerRate ? offerRate.rate : track.rate, termYears };
    });

    // הרץ אופטימייזר למציאת התמהיל האופטימלי עם ריביות אלו
    const input: OptimizerInput = {
      totalAmount: loanAmount,
      tracks: offerTracks,
      objective: 'minimize_total_cost',
      constraints,
    };
    const optimized = optimizeMortgage(input);

    const openingFeeAmount = offer.openingFeeIsPercent
      ? (offer.openingFee / 100) * loanAmount
      : offer.openingFee;

    results.push({
      offer,
      totalInterest: optimized.optimal.totalCost,
      openingFeeAmount,
      totalAllInCost: optimized.optimal.totalCost + openingFeeAmount,
      monthlyPayment: optimized.optimal.monthlyPayment,
      weightedRate: optimized.optimal.weightedAvgRate,
    });
  }

  // מיין לפי עלות ALL-IN
  results.sort((a, b) => a.totalAllInCost - b.totalAllInCost);

  const bestCost = results[0]?.totalAllInCost ?? 0;

  return results.map((r, idx) => ({
    ...r,
    rank: idx + 1,
    savingsVsBest: idx === 0 ? 0 : r.totalAllInCost - bestCost,
    isBest: idx === 0,
  }));
}

// ============================================================
// V3: Feature 5 — Timeline Tool
// ============================================================

export interface TimelineStage {
  stageNumber: number;
  weekRange: string;      // למשל: "שבועות 1-2"
  title: string;
  tasks: string[];
  daysFromStart: number;  // ימים מתחילת תהליך
  daysFromEnd: number;    // ימים לפני קבלת מפתח
}

export const MORTGAGE_TIMELINE_STAGES: TimelineStage[] = [
  {
    stageNumber: 1,
    weekRange: 'שבועות 1-2',
    title: 'איסוף מסמכים',
    tasks: [
      'תלושי שכר 3 חודשים אחרונים',
      'דפי בנק 3 חודשים',
      'אישור יתרת חסכונות',
      'תעודות זהות + חוזה נישואין',
      'שומת מס אחרונה (עצמאי)',
    ],
    daysFromStart: 0,
    daysFromEnd: 70,
  },
  {
    stageNumber: 2,
    weekRange: 'שבועות 3-4',
    title: 'שמאות + 3 הצעות בנקים',
    tasks: [
      'הזמנת שמאי מוסמך לנכס',
      'פנייה לפחות ל-3 בנקים להצעות',
      'הגשת בקשות אישור עקרוני',
      'בדיקת דוח BDI / נסח טאבו',
    ],
    daysFromStart: 14,
    daysFromEnd: 56,
  },
  {
    stageNumber: 3,
    weekRange: 'שבועות 5-6',
    title: 'מכרז ריבית בין בנקים',
    tasks: [
      'קבלת הצעות רשמיות מהבנקים',
      'הצגת הצעת בנק א\' לבנק ב\' לשיפור',
      'שימוש באופטימייזר להשוואת הצעות',
      'ייעוץ עם יועץ משכנתאות עצמאי',
    ],
    daysFromStart: 28,
    daysFromEnd: 42,
  },
  {
    stageNumber: 4,
    weekRange: 'שבוע 7',
    title: 'בחירה + אישור עקרוני',
    tasks: [
      'בחירת הבנק הזוכה',
      'קבלת אישור עקרוני (כפוף לשמאות)',
      'חתימה על מסמכי הבנק הראשוניים',
    ],
    daysFromStart: 42,
    daysFromEnd: 28,
  },
  {
    stageNumber: 5,
    weekRange: 'שבועות 8-10',
    title: 'חתימה + עורך דין',
    tasks: [
      'בחירת עורך דין לענייני נדל"ן',
      'חתימה על חוזה רכישה עם עו"ד',
      'תשלום מקדמה (בדרך כלל 10%)',
      'הגשת מסמכים מלאים לבנק',
    ],
    daysFromStart: 49,
    daysFromEnd: 21,
  },
  {
    stageNumber: 6,
    weekRange: 'שבוע 11',
    title: 'רישום בטאבו',
    tasks: [
      'רישום הערת אזהרה בטאבו',
      'ביטוח חיים + ביטוח מבנה',
      'אישור הבנק הסופי',
    ],
    daysFromStart: 70,
    daysFromEnd: 14,
  },
  {
    stageNumber: 7,
    weekRange: 'שבוע 12',
    title: 'העברת כסף → קבלת מפתח',
    tasks: [
      'העברת יתרת הסכום לקבלן/מוכר',
      'רישום בעלות בטאבו',
      'קבלת מפתח לדירה',
      'ביצוע תשלום ראשון לבנק',
    ],
    daysFromStart: 77,
    daysFromEnd: 0,
  },
];

export interface TimelineWithDates {
  stages: (TimelineStage & { startDate: Date; endDate: Date; formattedStart: string; formattedEnd: string })[];
  keysDate: Date;
  startDate: Date;
  totalDays: number;
}

/**
 * חישוב ציר זמן עם תאריכים
 * @param keysDate - תאריך קבלת המפתח המתוכנן
 */
export function calculateTimeline(keysDate: Date): TimelineWithDates {
  const totalDays = 84; // 12 שבועות
  const startDate = new Date(keysDate);
  startDate.setDate(startDate.getDate() - totalDays);

  const stages = MORTGAGE_TIMELINE_STAGES.map((stage) => {
    const stageStart = new Date(startDate);
    stageStart.setDate(stageStart.getDate() + stage.daysFromStart);

    const stageEnd = new Date(keysDate);
    stageEnd.setDate(stageEnd.getDate() - stage.daysFromEnd);

    const formatDate = (d: Date) =>
      d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });

    return {
      ...stage,
      startDate: stageStart,
      endDate: stageEnd,
      formattedStart: formatDate(stageStart),
      formattedEnd: formatDate(stageEnd),
    };
  });

  return { stages, keysDate, startDate, totalDays };
}

// ============================================================
// V3: Feature 6 — LTV-Adjusted Rates
// ============================================================

/**
 * התאמת ריבית לפי LTV (Loan-to-Value)
 * מבוסס על מדיניות בנקים ישראלית טיפוסית 2026
 *
 * LTV ≤ 30%: -0.4% הנחה
 * LTV 30-45%: -0.3%
 * LTV 45-60%: -0.15%
 * LTV 60-70%: 0% (בסיס)
 * LTV 70-75%: +0.1% פרמיה
 */
export const LTV_RATE_ADJUSTMENTS_2026: { maxLtv: number; adjustment: number; label: string }[] = [
  { maxLtv: 0.30, adjustment: -0.40, label: 'עד 30% — הנחה מקסימלית' },
  { maxLtv: 0.45, adjustment: -0.30, label: '30%-45% — הנחה גבוהה' },
  { maxLtv: 0.60, adjustment: -0.15, label: '45%-60% — הנחה בינונית' },
  { maxLtv: 0.70, adjustment: 0.00,  label: '60%-70% — ריבית בסיס' },
  { maxLtv: 0.75, adjustment: 0.10,  label: '70%-75% — פרמיה' },
];

/**
 * מחזיר את התאמת הריבית לפי LTV
 */
export function getLTVRateAdjustment(ltv: number): number {
  if (ltv <= 0) return -0.40; // LTV 0% = הנחה מקסימלית
  for (const band of LTV_RATE_ADJUSTMENTS_2026) {
    if (ltv <= band.maxLtv) return band.adjustment;
  }
  return 0.10; // מעל 75% LTV = פרמיה (בדרך כלל לא מאושר)
}

/**
 * מחזיר תיאור של רצועת ה-LTV
 */
export function getLTVBandLabel(ltv: number): string {
  if (ltv <= 0) return 'LTV 0% — הון עצמי מלא';
  for (const band of LTV_RATE_ADJUSTMENTS_2026) {
    if (ltv <= band.maxLtv) return band.label;
  }
  return 'מעל 75% LTV — קרוב למקסימום';
}

/**
 * חישוב חיסכון מהגדלת הון עצמי
 * מחשב כמה ₪ נחסך לאורך חיי המשכנתא אם LTV יורד לרצועה נמוכה יותר
 */
export function calculateSavingsFromHigherDownPayment(
  currentLoanAmount: number,
  propertyValue: number,
  additionalDownPayment: number,
  baseTracks: OptimizerTrack[],
  termYears: number,
): {
  currentLtv: number;
  newLtv: number;
  currentAdjustment: number;
  newAdjustment: number;
  rateReduction: number;
  estimatedSavings: number;
  newLoanAmount: number;
} {
  const currentLtv = propertyValue > 0 ? currentLoanAmount / propertyValue : 0;
  const newLoanAmount = Math.max(0, currentLoanAmount - additionalDownPayment);
  const newLtv = propertyValue > 0 ? newLoanAmount / propertyValue : 0;

  const currentAdjustment = getLTVRateAdjustment(currentLtv);
  const newAdjustment = getLTVRateAdjustment(newLtv);
  const rateReduction = currentAdjustment - newAdjustment; // positive = saves money

  // הערכת חיסכון: נחשב ריבית ממוצעת משוקללת ואז ממשמים לחיסכון
  const avgRate = baseTracks.length > 0
    ? baseTracks.reduce((s, t) => s + t.rate, 0) / baseTracks.length
    : 4.5;

  const currentInterest = calculateTotalInterest(currentLoanAmount, avgRate + currentAdjustment, termYears);
  const newInterest = calculateTotalInterest(newLoanAmount, avgRate + newAdjustment, termYears);
  const estimatedSavings = currentInterest - newInterest;

  return {
    currentLtv,
    newLtv,
    currentAdjustment,
    newAdjustment,
    rateReduction,
    estimatedSavings,
    newLoanAmount,
  };
}

/**
 * החלת התאמת LTV על מסלולים
 * מוסיף/מוריד ריבית לפי ה-LTV
 */
export function applyLTVAdjustmentToTracks(
  tracks: OptimizerTrack[],
  ltv: number,
): OptimizerTrack[] {
  const adjustment = getLTVRateAdjustment(ltv);
  return tracks.map((t) => ({
    ...t,
    rate: Math.max(0.5, t.rate + adjustment),
  }));
}
