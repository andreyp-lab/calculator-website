/**
 * חישוב משכנתא 2026 - גרסה מקיפה
 *
 * מקורות:
 * - בנק ישראל: ריביות, הוראות LTV, הוראת ניהול בנקאי תקין 329
 * - חוקי הפיקוח על הבנקים בישראל
 *
 * נתונים מרכזיים 2026:
 * - ריבית פריים (Prim): 5.5% (ריבית בנק ישראל 4.0% + מרווח 1.5%)
 * - LTV דירה ראשונה: עד 75%
 * - LTV מחליפי דירה: עד 70%
 * - LTV משקיעים: עד 50%
 * - תקופה מקסימלית: 30 שנים
 * - לפחות 33% במסלול ריבית קבועה
 * - אינפלציה ממוצעת ישראל 2006-2026: ~2.5%
 *
 * שיטות חישוב:
 * 1. שפיצר (תשלום חודשי קבוע) - הנפוצה ביותר
 * 2. קרן שווה (תשלום יורד) - חוסכת ריבית
 */

// ============================================================
// קבועים
// ============================================================

export const BANK_OF_ISRAEL_PRIME_2026 = 5.5; // ריבית פריים אפריל 2026
export const BOI_BASE_RATE_2026 = 4.0; // ריבית בנק ישראל
export const AVG_INFLATION_ISRAEL = 2.5; // אינפלציה ממוצעת ישראל

// ============================================================
// טיפוסים בסיסיים
// ============================================================

export type AmortizationMethod = 'shpitzer' | 'equal-principal';
export type BuyerType = 'first-home' | 'home-replacement' | 'investor';
export type TrackType = 'prime' | 'fixed-unlinked' | 'fixed-linked' | 'variable-5y' | 'forex';

export interface MortgageInput {
  loanAmount: number; // קרן ההלוואה
  interestRate: number; // ריבית שנתית (אחוזים, למשל 4.5)
  termYears: number; // תקופה בשנים
  method: AmortizationMethod;
}

export interface PaymentScheduleEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number; // לתשלום חודשי קבוע (שפיצר) או ראשון (קרן שווה)
  firstPayment: number;
  lastPayment: number;
  totalPayments: number;
  totalInterest: number;
  schedule: PaymentScheduleEntry[];
  yearlyTotals: { year: number; principal: number; interest: number; balance: number }[];
}

export interface LtvLimits {
  maxPercentage: number;
  description: string;
}

export const LTV_LIMITS_2026: Record<BuyerType, LtvLimits> = {
  'first-home': {
    maxPercentage: 75,
    description: 'דירה ראשונה ויחידה - עד 75% מימון',
  },
  'home-replacement': {
    maxPercentage: 70,
    description: 'מחליפי דירה - עד 70% מימון',
  },
  investor: {
    maxPercentage: 50,
    description: 'דירה להשקעה - עד 50% מימון',
  },
};

// ============================================================
// חישובים בסיסיים (backward compat)
// ============================================================

/**
 * חישוב לוח סילוקין שפיצר (תשלום חודשי קבוע)
 *
 * נוסחת שפיצר:
 * M = P × [r(1+r)^n] / [(1+r)^n - 1]
 *
 * P = קרן (loan amount)
 * r = ריבית חודשית (שנתית/12/100)
 * n = מספר תשלומים (שנים × 12)
 */
function calculateShpitzer(input: MortgageInput): MortgageResult {
  const P = input.loanAmount;
  const r = input.interestRate / 100 / 12;
  const n = input.termYears * 12;

  // חישוב תשלום חודשי קבוע
  const monthlyPayment =
    r === 0 ? P / n : (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

  // בניית לוח סילוקין
  const schedule: PaymentScheduleEntry[] = [];
  let balance = P;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const principal = monthlyPayment - interest;
    balance = Math.max(0, balance - principal);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      remainingBalance: balance,
    });
  }

  const totalPayments = monthlyPayment * n;
  const totalInterest = totalPayments - P;

  return {
    loanAmount: P,
    monthlyPayment,
    firstPayment: monthlyPayment,
    lastPayment: monthlyPayment,
    totalPayments,
    totalInterest,
    schedule,
    yearlyTotals: aggregateByYear(schedule),
  };
}

/**
 * חישוב לוח סילוקין קרן שווה (תשלום קרן קבוע, ריבית יורדת)
 */
function calculateEqualPrincipal(input: MortgageInput): MortgageResult {
  const P = input.loanAmount;
  const r = input.interestRate / 100 / 12;
  const n = input.termYears * 12;

  const principalPerMonth = P / n;
  const schedule: PaymentScheduleEntry[] = [];
  let balance = P;
  let totalPayments = 0;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const payment = principalPerMonth + interest;
    balance = Math.max(0, balance - principalPerMonth);
    totalPayments += payment;

    schedule.push({
      month,
      payment,
      principal: principalPerMonth,
      interest,
      remainingBalance: balance,
    });
  }

  const totalInterest = totalPayments - P;

  return {
    loanAmount: P,
    monthlyPayment: schedule[0].payment, // הראשון
    firstPayment: schedule[0].payment,
    lastPayment: schedule[schedule.length - 1].payment,
    totalPayments,
    totalInterest,
    schedule,
    yearlyTotals: aggregateByYear(schedule),
  };
}

/**
 * סיכום שנתי של תשלומים
 */
function aggregateByYear(schedule: PaymentScheduleEntry[]) {
  const yearlyTotals: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[] = [];

  for (let year = 1; year <= Math.ceil(schedule.length / 12); year++) {
    const startIdx = (year - 1) * 12;
    const endIdx = Math.min(year * 12, schedule.length);
    const yearMonths = schedule.slice(startIdx, endIdx);

    const yearPrincipal = yearMonths.reduce((sum, m) => sum + m.principal, 0);
    const yearInterest = yearMonths.reduce((sum, m) => sum + m.interest, 0);
    const balance = yearMonths[yearMonths.length - 1]?.remainingBalance ?? 0;

    yearlyTotals.push({
      year,
      principal: yearPrincipal,
      interest: yearInterest,
      balance,
    });
  }

  return yearlyTotals;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  if (input.loanAmount <= 0 || input.termYears <= 0 || input.interestRate < 0) {
    return {
      loanAmount: 0,
      monthlyPayment: 0,
      firstPayment: 0,
      lastPayment: 0,
      totalPayments: 0,
      totalInterest: 0,
      schedule: [],
      yearlyTotals: [],
    };
  }

  return input.method === 'equal-principal'
    ? calculateEqualPrincipal(input)
    : calculateShpitzer(input);
}

/**
 * חישוב הלוואה מקסימלית לפי מחיר דירה ו-LTV
 */
export function getMaxLoanAmount(propertyValue: number, buyerType: BuyerType): number {
  const limit = LTV_LIMITS_2026[buyerType];
  return propertyValue * (limit.maxPercentage / 100);
}

/**
 * חישוב הון עצמי נדרש
 */
export function getRequiredEquity(propertyValue: number, buyerType: BuyerType): number {
  return propertyValue - getMaxLoanAmount(propertyValue, buyerType);
}

// ============================================================
// משכנתא מעורבת - Multi-Track (חדש!)
// ============================================================

export interface MortgageTrack {
  id: string;
  name: string; // שם המסלול (למשל "פריים", "קל\"צ")
  trackType: TrackType;
  amount: number; // סכום בש"ח
  interestRate: number; // ריבית שנתית (%)
  termYears: number; // תקופה בשנים
  method: AmortizationMethod;
  gracePeriodMonths?: number; // תקופת גרייס (חודשים) - רק ריבית
  inflationRate?: number; // אחוז הצמדה שנתי (לצמוד מדד)
}

export interface MultiTrackMortgageInput {
  tracks: MortgageTrack[];
  propertyValue?: number;
  buyerType?: BuyerType;
}

export interface TrackResult {
  track: MortgageTrack;
  result: MortgageResult;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  shareOfTotal: number; // אחוז מסך ההלוואה
}

export interface MultiTrackMortgageResult {
  tracks: TrackResult[];
  totalLoanAmount: number;
  combinedMonthlyPayment: number; // סכום תשלומי כל המסלולים
  totalPayments: number;
  totalInterest: number;
  longestTermYears: number;
  yearlyTotals: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
    byTrack: { trackName: string; principal: number; interest: number }[];
  }[];
  fixedTrackPercentage: number; // % מסלולים קבועים (בנק ישראל מחייב >= 33%)
  isRegulationCompliant: boolean; // עמידה בדרישות בנק ישראל
}

export function calculateMultiTrackMortgage(
  input: MultiTrackMortgageInput,
): MultiTrackMortgageResult {
  const { tracks } = input;

  if (!tracks || tracks.length === 0) {
    return {
      tracks: [],
      totalLoanAmount: 0,
      combinedMonthlyPayment: 0,
      totalPayments: 0,
      totalInterest: 0,
      longestTermYears: 0,
      yearlyTotals: [],
      fixedTrackPercentage: 0,
      isRegulationCompliant: false,
    };
  }

  const totalLoanAmount = tracks.reduce((sum, t) => sum + t.amount, 0);

  const trackResults: TrackResult[] = tracks.map((track) => {
    const mortgageInput: MortgageInput = {
      loanAmount: track.amount,
      interestRate: track.interestRate,
      termYears: track.termYears,
      method: track.method,
    };

    const result = calculateMortgage(mortgageInput);

    // אם יש גרייס - רק ריבית בחודשים הראשונים
    let adjustedResult = result;
    if (track.gracePeriodMonths && track.gracePeriodMonths > 0 && result.schedule.length > 0) {
      adjustedResult = applyGracePeriod(track, result);
    }

    return {
      track,
      result: adjustedResult,
      monthlyPayment: adjustedResult.firstPayment,
      totalPayments: adjustedResult.totalPayments,
      totalInterest: adjustedResult.totalInterest,
      shareOfTotal: totalLoanAmount > 0 ? (track.amount / totalLoanAmount) * 100 : 0,
    };
  });

  const combinedMonthlyPayment = trackResults.reduce((sum, tr) => sum + tr.monthlyPayment, 0);
  const totalPayments = trackResults.reduce((sum, tr) => sum + tr.totalPayments, 0);
  const totalInterest = trackResults.reduce((sum, tr) => sum + tr.totalInterest, 0);
  const longestTermYears = Math.max(...tracks.map((t) => t.termYears));

  // חישוב yearly totals מאוחד
  const yearlyTotals: MultiTrackMortgageResult['yearlyTotals'] = [];
  for (let year = 1; year <= longestTermYears; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    let yearBalance = 0;
    const byTrack: { trackName: string; principal: number; interest: number }[] = [];

    for (const tr of trackResults) {
      const yearData = tr.result.yearlyTotals.find((y) => y.year === year);
      if (yearData) {
        yearPrincipal += yearData.principal;
        yearInterest += yearData.interest;
        yearBalance += yearData.balance;
        byTrack.push({
          trackName: tr.track.name,
          principal: yearData.principal,
          interest: yearData.interest,
        });
      }
    }

    yearlyTotals.push({ year, principal: yearPrincipal, interest: yearInterest, balance: yearBalance, byTrack });
  }

  // בדיקת ציות לתקנות בנק ישראל: לפחות 33% קבועה
  const fixedTrackTypes: TrackType[] = ['fixed-unlinked', 'fixed-linked'];
  const fixedAmount = tracks
    .filter((t) => fixedTrackTypes.includes(t.trackType))
    .reduce((sum, t) => sum + t.amount, 0);
  const fixedTrackPercentage = totalLoanAmount > 0 ? (fixedAmount / totalLoanAmount) * 100 : 0;
  const isRegulationCompliant = fixedTrackPercentage >= 33;

  return {
    tracks: trackResults,
    totalLoanAmount,
    combinedMonthlyPayment,
    totalPayments,
    totalInterest,
    longestTermYears,
    yearlyTotals,
    fixedTrackPercentage,
    isRegulationCompliant,
  };
}

/**
 * החלת תקופת גרייס על תוצאת מסלול
 * בתקופת גרייס: משלמים רק ריבית, לא מחזירים קרן
 */
function applyGracePeriod(track: MortgageTrack, originalResult: MortgageResult): MortgageResult {
  const grace = track.gracePeriodMonths ?? 0;
  const r = track.interestRate / 100 / 12;
  const P = track.amount;

  const graceSchedule: PaymentScheduleEntry[] = [];
  for (let m = 1; m <= grace; m++) {
    graceSchedule.push({
      month: m,
      payment: P * r,
      principal: 0,
      interest: P * r,
      remainingBalance: P,
    });
  }

  // לאחר גרייס - חישוב שפיצר על יתרת הקרן בתקופה הנותרת
  const remainingMonths = track.termYears * 12 - grace;
  if (remainingMonths <= 0) {
    const totalGracePayments = graceSchedule.reduce((s, e) => s + e.payment, 0);
    return {
      ...originalResult,
      schedule: graceSchedule,
      firstPayment: graceSchedule[0]?.payment ?? 0,
      lastPayment: graceSchedule[graceSchedule.length - 1]?.payment ?? 0,
      totalPayments: totalGracePayments,
      totalInterest: totalGracePayments,
      yearlyTotals: aggregateByYear(graceSchedule),
    };
  }

  const remainingPayment =
    r === 0
      ? P / remainingMonths
      : (P * (r * Math.pow(1 + r, remainingMonths))) / (Math.pow(1 + r, remainingMonths) - 1);

  const postGraceSchedule: PaymentScheduleEntry[] = [];
  let balance = P;
  for (let m = 1; m <= remainingMonths; m++) {
    const interest = balance * r;
    const principal = remainingPayment - interest;
    balance = Math.max(0, balance - principal);
    postGraceSchedule.push({
      month: grace + m,
      payment: remainingPayment,
      principal,
      interest,
      remainingBalance: balance,
    });
  }

  const fullSchedule = [...graceSchedule, ...postGraceSchedule];
  const totalPayments = fullSchedule.reduce((s, e) => s + e.payment, 0);
  const totalInterest = totalPayments - P;

  return {
    loanAmount: P,
    monthlyPayment: graceSchedule[0]?.payment ?? 0,
    firstPayment: graceSchedule[0]?.payment ?? 0,
    lastPayment: postGraceSchedule[postGraceSchedule.length - 1]?.payment ?? 0,
    totalPayments,
    totalInterest,
    schedule: fullSchedule,
    yearlyTotals: aggregateByYear(fullSchedule),
  };
}

// ============================================================
// מחזור משכנתא (Refinancing)
// ============================================================

export interface RefinanceInput {
  currentBalance: number; // יתרת קרן נוכחית
  currentRate: number; // ריבית נוכחית (%)
  currentMonthlyPayment: number; // תשלום חודשי נוכחי
  monthsRemaining: number; // חודשים שנותרו
  newRate: number; // ריבית מוצעת (%)
  refinancingFees: number; // עמלות מחזור (₪)
  newTermMonths?: number; // תקופה חדשה (ברירת מחדל = monthsRemaining)
  newMethod?: AmortizationMethod;
}

export interface RefinanceResult {
  currentTotalRemaining: number; // כמה נשאר לשלם בתכנית הנוכחית
  newTotalPayments: number; // כמה תשלם בתכנית החדשה + עמלות
  monthlySavings: number; // חיסכון חודשי בתשלום
  newMonthlyPayment: number;
  totalInterestSavings: number; // חיסכון ריבית כולל
  totalSavingsAfterFees: number; // חיסכון נטו אחרי עמלות
  breakevenMonths: number; // כמה חודשים עד שהחיסכון מכסה את העמלות
  breakevenYears: number;
  recommendation: string;
  worthRefinancing: boolean;
}

export function calculateRefinancing(input: RefinanceInput): RefinanceResult {
  const {
    currentBalance,
    currentRate,
    currentMonthlyPayment,
    monthsRemaining,
    newRate,
    refinancingFees,
    newMethod = 'shpitzer',
  } = input;

  const newTermMonths = input.newTermMonths ?? monthsRemaining;
  const newTermYears = newTermMonths / 12;

  // חישוב מה נשאר לשלם בתכנית הנוכחית
  const currentTotalRemaining = currentMonthlyPayment * monthsRemaining;
  const currentRemainingInterest = currentTotalRemaining - currentBalance;

  // חישוב תכנית חדשה
  const newResult = calculateMortgage({
    loanAmount: currentBalance,
    interestRate: newRate,
    termYears: newTermYears,
    method: newMethod,
  });

  const newMonthlyPayment = newResult.firstPayment;
  const newTotalPayments = newResult.totalPayments + refinancingFees;
  const newInterest = newResult.totalInterest;

  // חיסכון
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const totalInterestSavings = currentRemainingInterest - newInterest;
  const totalSavingsAfterFees = totalInterestSavings - refinancingFees;

  // נקודת איזון
  const breakevenMonths = monthlySavings > 0 ? Math.ceil(refinancingFees / monthlySavings) : Infinity;
  const breakevenYears = breakevenMonths / 12;

  // המלצה
  let recommendation = '';
  const worthRefinancing = totalSavingsAfterFees > 0 && breakevenMonths < monthsRemaining;

  if (newRate >= currentRate) {
    recommendation = 'הריבית החדשה אינה נמוכה מהנוכחית - מחזור אינו כדאי.';
  } else if (!worthRefinancing) {
    recommendation = `החיסכון (${Math.round(totalSavingsAfterFees).toLocaleString()} ₪) אינו מכסה את עלויות המחזור. לא מומלץ.`;
  } else if (breakevenMonths > 36) {
    recommendation = `נקודת האיזון היא בעוד ${Math.round(breakevenYears * 10) / 10} שנים. כדאי רק אם אתם מתכננים להישאר בנכס לפחות עד אז.`;
  } else {
    recommendation = `מחזור כדאי! תוך ${breakevenMonths} חודשים תחזרו על ההשקעה, וסה"כ תחסכו ${Math.round(totalSavingsAfterFees).toLocaleString()} ₪.`;
  }

  return {
    currentTotalRemaining,
    newTotalPayments,
    monthlySavings,
    newMonthlyPayment,
    totalInterestSavings,
    totalSavingsAfterFees,
    breakevenMonths: isFinite(breakevenMonths) ? breakevenMonths : 9999,
    breakevenYears: isFinite(breakevenYears) ? breakevenYears : 9999,
    recommendation,
    worthRefinancing,
  };
}

// ============================================================
// פירעון מוקדם (Early Payoff)
// ============================================================

export interface EarlyPayoffInput {
  currentBalance: number; // יתרת קרן
  currentRate: number; // ריבית שנתית (%)
  monthsRemaining: number; // חודשים שנותרו
  method: AmortizationMethod;
  lumpSum?: number; // תשלום חד-פעמי עכשיו (₪)
  extraMonthlyPayment?: number; // תוספת חודשית (₪)
  lumpSumInMonths?: number; // אחרי כמה חודשים לשלם את הסכום החד-פעמי
}

export interface EarlyPayoffResult {
  originalTotalPayments: number;
  originalTotalInterest: number;
  originalMonthlyPayment: number;

  newTotalPayments: number;
  newTotalInterest: number;
  newMonthsRemaining: number;
  newMonthlyPayment: number;

  interestSaved: number;
  monthsSaved: number;
  yearsSaved: number;

  // עמלת פירעון מוקדם (הערכה)
  estimatedPenalty: number;
  netSavings: number;

  payoffMonth: number; // באיזה חודש מסתיים?
}

export function calculateEarlyPayoff(input: EarlyPayoffInput): EarlyPayoffResult {
  const {
    currentBalance,
    currentRate,
    monthsRemaining,
    method,
    lumpSum = 0,
    extraMonthlyPayment = 0,
    lumpSumInMonths = 0,
  } = input;

  if (currentBalance <= 0 || monthsRemaining <= 0) {
    const zero: EarlyPayoffResult = {
      originalTotalPayments: 0, originalTotalInterest: 0, originalMonthlyPayment: 0,
      newTotalPayments: 0, newTotalInterest: 0, newMonthsRemaining: 0, newMonthlyPayment: 0,
      interestSaved: 0, monthsSaved: 0, yearsSaved: 0,
      estimatedPenalty: 0, netSavings: 0, payoffMonth: 0,
    };
    return zero;
  }

  const termYears = monthsRemaining / 12;

  // מצב מקורי
  const originalResult = calculateMortgage({
    loanAmount: currentBalance,
    interestRate: currentRate,
    termYears,
    method,
  });

  const originalMonthlyPayment = originalResult.firstPayment;

  // מצב עם פירעון מוקדם - סימולציה חודשית
  const r = currentRate / 100 / 12;
  let balance = currentBalance;
  let month = 0;
  let newTotalPayments = 0;
  let newTotalInterest = 0;

  while (balance > 0 && month < 600) {
    month++;
    const interest = balance * r;
    newTotalInterest += interest;

    let payment = originalMonthlyPayment + extraMonthlyPayment;
    // תשלום חד-פעמי
    if (month === lumpSumInMonths + 1 && lumpSum > 0) {
      payment += lumpSum;
    }

    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    newTotalPayments += interest + principalPaid;

    if (balance < 1) break;
  }

  const newMonthsRemaining = month;
  const monthsSaved = monthsRemaining - newMonthsRemaining;
  const yearsSaved = monthsSaved / 12;

  // עמלת פירעון מוקדם - הערכה לפי כללי בנק ישראל
  // הנוסחה הרשמית מורכבת; הערכה: ~0.5%-1.5% מסכום הפירעון המוקדם
  // בפועל תלויה בהפרש הריביות. נשתמש בהערכה של 1%
  const totalEarlyPayoff = lumpSum + extraMonthlyPayment * newMonthsRemaining;
  const estimatedPenalty = lumpSum > 0 ? lumpSum * 0.01 : 0; // ~1% על הסכום החד-פעמי

  const interestSaved = originalResult.totalInterest - newTotalInterest;
  const netSavings = interestSaved - estimatedPenalty;

  return {
    originalTotalPayments: originalResult.totalPayments,
    originalTotalInterest: originalResult.totalInterest,
    originalMonthlyPayment,
    newTotalPayments,
    newTotalInterest,
    newMonthsRemaining,
    newMonthlyPayment: originalMonthlyPayment + extraMonthlyPayment,
    interestSaved,
    monthsSaved: Math.max(0, monthsSaved),
    yearsSaved: Math.max(0, yearsSaved),
    estimatedPenalty,
    netSavings,
    payoffMonth: newMonthsRemaining,
  };
}

// ============================================================
// כושר החזר (Affordability)
// ============================================================

export interface AffordabilityInput {
  monthlyNetIncome: number; // הכנסה נטו משפחתית
  otherObligations: number; // התחייבויות חודשיות אחרות (הלוואות, ליסינג וכו')
  propertyValue: number; // שווי הדירה
  buyerType: BuyerType;
  termYears: number;
  interestRate: number;
  method?: AmortizationMethod;
}

export interface AffordabilityResult {
  maxComfortablePayment: number; // 30% מהכנסה נטו
  maxBankPayment: number; // 40% מהכנסה נטו (קצה המותר)
  availableForMortgage: number; // לאחר הורדת התחייבויות אחרות
  maxLoanAtComfort: number; // הלוואה מקסימלית בנוחות
  maxLoanAtBank: number; // הלוואה מקסימלית לפי בנק
  maxAllowedByLtv: number; // הגבלת LTV
  recommendedLoan: number; // המלצה
  isAffordable: boolean;
  recommendation: string;
  monthlyPaymentForFullLoan: number; // תשלום חודשי על מלוא ה-LTV
  debtToIncomeRatio: number; // יחס חוב-הכנסה
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const {
    monthlyNetIncome,
    otherObligations,
    propertyValue,
    buyerType,
    termYears,
    interestRate,
    method = 'shpitzer',
  } = input;

  const maxComfortablePayment = monthlyNetIncome * 0.30;
  const maxBankPayment = monthlyNetIncome * 0.40;
  const availableForMortgage = Math.max(0, maxBankPayment - otherObligations);
  const comfortableForMortgage = Math.max(0, maxComfortablePayment - otherObligations);

  const maxAllowedByLtv = getMaxLoanAmount(propertyValue, buyerType);

  // חישוב הלוואה מקסימלית לפי תשלום חודשי
  // מ-M = P × r(1+r)^n / ((1+r)^n - 1) נגזור P
  const r = interestRate / 100 / 12;
  const n = termYears * 12;
  const factor = r === 0 ? n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const maxLoanAtComfort = factor > 0 ? comfortableForMortgage / factor : 0;
  const maxLoanAtBank = factor > 0 ? availableForMortgage / factor : 0;

  const recommendedLoan = Math.min(maxLoanAtComfort, maxAllowedByLtv);
  const isAffordable = recommendedLoan > 0;

  // חישוב תשלום חודשי על מלוא ה-LTV
  const fullLtvResult = calculateMortgage({
    loanAmount: maxAllowedByLtv,
    interestRate,
    termYears,
    method,
  });

  const monthlyPaymentForFullLoan = fullLtvResult.firstPayment;
  const debtToIncomeRatio = ((monthlyPaymentForFullLoan + otherObligations) / monthlyNetIncome) * 100;

  let recommendation = '';
  if (!isAffordable) {
    recommendation = 'ההכנסה אינה מאפשרת לקיחת משכנתא מהותית בתנאים אלה. שקול הגדלת הכנסה, הפחתת התחייבויות, או דירה בשווי נמוך יותר.';
  } else if (debtToIncomeRatio > 40) {
    recommendation = `יחס ההחזר (${debtToIncomeRatio.toFixed(1)}%) גבוה מ-40%. בנקים עלולים לסרב. מומלץ להגדיל הון עצמי או להפחית את ההלוואה ל-${Math.round(maxLoanAtBank).toLocaleString()} ₪.`;
  } else if (debtToIncomeRatio > 30) {
    recommendation = `יחס ההחזר (${debtToIncomeRatio.toFixed(1)}%) סביר אך בצד הגבוה. מומלץ לשמור על רזרבה חודשית למקרי חירום.`;
  } else {
    recommendation = `יחס ההחזר (${debtToIncomeRatio.toFixed(1)}%) מצוין. ההלוואה בטווח נוח. מומלץ לשמור על 3-6 משכורות כרזרבה נזילה.`;
  }

  return {
    maxComfortablePayment,
    maxBankPayment,
    availableForMortgage,
    maxLoanAtComfort,
    maxLoanAtBank,
    maxAllowedByLtv,
    recommendedLoan,
    isAffordable,
    recommendation,
    monthlyPaymentForFullLoan,
    debtToIncomeRatio,
  };
}

// ============================================================
// השפעת אינפלציה על מסלול צמוד מדד
// ============================================================

export interface InflationTrackInput {
  loanAmount: number;
  nominalRate: number; // ריבית נומינלית (%)
  termYears: number;
  inflationRate: number; // אינפלציה שנתית (%)
  method?: AmortizationMethod;
}

export interface InflationTrackYearlyRow {
  year: number;
  nominalBalance: number; // יתרת קרן נומינלית (₪ שוטפים)
  realBalance: number; // יתרת קרן ריאלית (₪ היום)
  nominalPayment: number; // תשלום חודשי נומינלי (גדל עם אינפלציה)
  realPayment: number; // תשלום ריאלי (בש"ח היום)
  cpiIndex: number; // מדד מחירים (100 = שנת התחלה)
}

export interface InflationTrackResult {
  nominalResult: MortgageResult; // ללא הצמדה (כבסיס)
  effectiveLoanAmount: number; // ה"קרן" שבפועל תחזיר (נומינלי, אחרי כל האינפלציה)
  additionalCostFromInflation: number; // עלות נוספת בגלל ההצמדה
  realTotalCost: number; // עלות כוללת ריאלית
  yearlyBreakdown: InflationTrackYearlyRow[];
}

export function calculateWithInflation(input: InflationTrackInput): InflationTrackResult {
  const { loanAmount, nominalRate, termYears, inflationRate, method = 'shpitzer' } = input;

  // בסיס - בלי הצמדה
  const nominalResult = calculateMortgage({
    loanAmount,
    interestRate: nominalRate,
    termYears,
    method,
  });

  // חישוב עם הצמדה - הקרן גדלה עם מדד
  const monthlyInflation = inflationRate / 100 / 12;
  const r = nominalRate / 100 / 12;
  const n = termYears * 12;

  let balance = loanAmount; // יתרה נומינלית (גדלה עם מדד)
  let cpiIndex = 100;
  let totalNominalPayments = 0;
  const yearlyRows: InflationTrackYearlyRow[] = [];

  // בשפיצר עם הצמדה: כל חודש הקרן גדלה במדד, ואז מחשבים ריבית ותשלום
  // התשלום מחושב מחדש כל שנה על יתרת הקרן המצומדת
  for (let year = 1; year <= termYears; year++) {
    let yearlyNominalBalance = balance;
    let yearPayments = 0;

    // חישוב תשלום על פי יתרה מצומדת בתחילת שנה
    const remainingMonths = (termYears - year + 1) * 12;
    const yearlyPayment =
      r === 0
        ? balance / remainingMonths
        : (balance * (r * Math.pow(1 + r, remainingMonths))) / (Math.pow(1 + r, remainingMonths) - 1);

    for (let m = 1; m <= 12; m++) {
      // הצמדה חודשית
      balance *= 1 + monthlyInflation;
      cpiIndex *= 1 + monthlyInflation;

      const interest = balance * r;
      let principal = yearlyPayment - interest;
      if (principal < 0) principal = 0;
      balance = Math.max(0, balance - principal);
      yearPayments += yearlyPayment;
    }

    totalNominalPayments += yearPayments;

    yearlyRows.push({
      year,
      nominalBalance: balance,
      realBalance: balance / (cpiIndex / 100),
      nominalPayment: yearlyPayment,
      realPayment: yearlyPayment / (cpiIndex / 100),
      cpiIndex,
    });
  }

  const effectiveLoanAmount = totalNominalPayments;
  const additionalCostFromInflation = totalNominalPayments - nominalResult.totalPayments;

  return {
    nominalResult,
    effectiveLoanAmount,
    additionalCostFromInflation,
    realTotalCost: nominalResult.totalPayments, // בש"ח היום
    yearlyBreakdown: yearlyRows,
  };
}

// ============================================================
// תמהיל מוצע (Preset Compositions)
// ============================================================

export interface PresetComposition {
  name: string;
  description: string;
  tracks: Omit<MortgageTrack, 'id' | 'amount'>[];
  distributions: number[]; // אחוזים (חייבים להסתכם ל-100)
  riskLevel: 'low' | 'medium' | 'high';
  suitable: string;
}

export const PRESET_COMPOSITIONS: PresetComposition[] = [
  {
    name: 'תמהיל סטנדרטי (1/3 + 1/3 + 1/3)',
    description: 'שליש פריים, שליש קל"צ, שליש צמוד מדד - התמהיל הנפוץ ביותר בישראל',
    tracks: [
      { name: 'פריים', trackType: 'prime', interestRate: BANK_OF_ISRAEL_PRIME_2026 - 0.5, termYears: 25, method: 'shpitzer' },
      { name: 'קל"צ', trackType: 'fixed-unlinked', interestRate: 4.2, termYears: 25, method: 'shpitzer' },
      { name: 'צמוד מדד', trackType: 'fixed-linked', interestRate: 3.0, termYears: 25, method: 'shpitzer', inflationRate: AVG_INFLATION_ISRAEL },
    ],
    distributions: [33, 33, 34],
    riskLevel: 'medium',
    suitable: 'רוכשים ראשונים, צפי לירידת ריבית',
  },
  {
    name: 'תמהיל שמרני (קל"צ דומיננטי)',
    description: 'רוב ההלוואה בריבית קבועה לא צמודה - ביטחון מלא, ללא הפתעות',
    tracks: [
      { name: 'קל"צ ארוך', trackType: 'fixed-unlinked', interestRate: 4.4, termYears: 30, method: 'shpitzer' },
      { name: 'קל"צ קצר', trackType: 'fixed-unlinked', interestRate: 3.9, termYears: 15, method: 'shpitzer' },
    ],
    distributions: [67, 33],
    riskLevel: 'low',
    suitable: 'רוכשים שמרנים, הכנסה יציבה, לא צופים מכירה מוקדמת',
  },
  {
    name: 'תמהיל אגרסיבי (פריים דומיננטי)',
    description: 'רוב ההלוואה בפריים - ריבית נמוכה עכשיו, סיכון בעלייה עתידית',
    tracks: [
      { name: 'פריים', trackType: 'prime', interestRate: BANK_OF_ISRAEL_PRIME_2026 - 0.7, termYears: 20, method: 'shpitzer' },
      { name: 'קל"צ (מינימום)', trackType: 'fixed-unlinked', interestRate: 4.0, termYears: 20, method: 'shpitzer' },
    ],
    distributions: [67, 33],
    riskLevel: 'high',
    suitable: 'בעלי הכנסה גמישה, צופים ירידת ריבית, מתכננים מכירה/מחזור מוקדם',
  },
];
