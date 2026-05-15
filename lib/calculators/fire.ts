/**
 * מחשבון FIRE מקיף - Financial Independence, Retire Early
 *
 * כולל:
 * 1. חישוב FIRE Number לפי 5 סוגי FIRE
 * 2. SWR מודלים (4%, 3%, דינמי)
 * 3. שנים ל-FIRE עם מסלול שנה אחר שנה
 * 4. Coast FIRE / Barista FIRE
 * 5. שיעור חיסכון נדרש לפרישה ביעד
 * 6. הקשר ישראלי: ב.ל., פנסיה, נדל"ן
 * 7. Sequence of Returns Risk
 *
 * מקורות:
 * - Trinity Study (Cooley, Hubbard, Walz 1998 + עדכונים)
 * - ERE (Early Retirement Extreme) - Jacob Lund Fisker
 * - ב.ל. - ביטוח לאומי 2026: קצבה בסיסית ~1,754 ₪/חודש
 * - ממוצע אינפלציה ישראל 2020-2026: 3% (בנק ישראל)
 */

// ============================================================
// קבועים ישראלים 2026
// ============================================================

export const FIRE_CONSTANTS_2026 = {
  /** אינפלציה ממוצעת בישראל */
  DEFAULT_INFLATION: 3.0,
  /** מס רווחי הון */
  CAPITAL_GAINS_TAX: 0.25,
  /** קצבת זקנה בסיסית ב.ל. (₪/חודש) גיל 67 */
  BITUACH_LEUMI_BASIC_MONTHLY: 1_754,
  /** תשואה היסטורית S&P 500 נומינלי */
  SP500_NOMINAL_RETURN: 10.0,
  /** תשואה ריאלית S&P 500 */
  SP500_REAL_RETURN: 7.0,
  /** ריבית ריאלית מקובלת להנחת FIRE */
  DEFAULT_REAL_RETURN: 5.0,
  /** מכפיל 4% Rule */
  MULTIPLIER_4PCT: 25,
  /** מכפיל 3% Rule */
  MULTIPLIER_3PCT: 33.3,
  /** מכפיל 3.5% Rule */
  MULTIPLIER_3_5PCT: 28.6,
  /** הוצאות חודשיות Lean FIRE ישראל (זוג) */
  LEAN_FIRE_MONTHLY: 10_000,
  /** הוצאות חודשיות Regular FIRE ישראל (זוג) */
  REGULAR_FIRE_MONTHLY: 20_000,
  /** הוצאות חודשיות Fat FIRE ישראל (זוג) */
  FAT_FIRE_MONTHLY: 40_000,
  /** אחוז עבודה חלקית Barista FIRE */
  BARISTA_WORK_INCOME_RATIO: 0.4,
} as const;

// ============================================================
// Types
// ============================================================

export type FireType = 'lean' | 'regular' | 'fat' | 'coast' | 'barista';
export type SWRType = 'four_pct' | 'three_pct' | 'three_five_pct' | 'dynamic';

export interface FireInput {
  /** גיל נוכחי */
  currentAge: number;
  /** חיסכון נוכחי (₪) */
  currentSavings: number;
  /** הפקדה חודשית נטו (₪) */
  monthlyContribution: number;
  /** הכנסה חודשית ברוטו (₪) - לחישוב שיעור חיסכון */
  monthlyGrossIncome: number;
  /** הוצאות חודשיות מתוכננות בפרישה (₪) */
  monthlyExpensesRetirement: number;
  /** תשואה נומינלית שנתית צפויה (%) */
  expectedNominalReturn: number;
  /** אינפלציה שנתית צפויה (%) */
  inflationRate: number;
  /** שיעור משיכה בטוח */
  swrType: SWRType;
  /** גיל יעד לפרישה (אופציונלי - לחישוב שיעור חיסכון נדרש) */
  targetRetirementAge?: number;
  /** האם לכלול קצבת ב.ל. (מגיל 67) */
  includeBituachLeumi: boolean;
  /** הכנסה מנדל"ן (₪/חודש) */
  realEstateIncome: number;
  /** Barista: הכנסה מעבודה חלקית (₪/חודש) */
  baristaWorkIncome: number;
  /** שנות חיים מתוכננות לאחר פרישה */
  retirementDurationYears: number;
}

export interface FireYearlyRow {
  year: number;
  age: number;
  portfolioValue: number;
  annualContribution: number;
  annualReturn: number;
  progressPct: number; // אחוז מהיעד
  isFireReached: boolean;
}

export interface WithdrawalPhaseRow {
  year: number;
  age: number;
  portfolioValue: number;
  withdrawal: number;
  isPortfolioAlive: boolean;
}

export interface FireTypeBreakdown {
  type: FireType;
  label: string;
  monthlyExpenses: number;
  fireNumber: number;
  yearsToFire: number;
  retirementAge: number;
}

export interface SWRScenario {
  type: SWRType;
  label: string;
  rate: number;
  multiplier: number;
  fireNumber: number;
  successRate: string; // הסבר על שיעור הצלחה
}

export interface CoastFireResult {
  /** הסכום הנדרש היום כדי שיצמח ל-FIRE Number בגיל הפרישה */
  coastNumber: number;
  /** האם כבר הגעת ל-Coast FIRE */
  hasReachedCoast: boolean;
  /** כמה חסר ל-Coast FIRE */
  coastShortfall: number;
  /** שנים עד Coast FIRE (אם לא הגעת) */
  yearsToCoast: number;
}

export interface FireResult {
  /** FIRE Number - סכום המטרה */
  fireNumber: number;
  /** שיעור משיכה בטוח */
  swr: number;
  /** שנים עד FIRE */
  yearsToFire: number;
  /** גיל פרישה */
  fireAge: number;
  /** האם יגיע ל-FIRE */
  willReachFire: boolean;
  /** חיסכון צפוי בגיל FIRE */
  projectedSavings: number;
  /** הכנסה פסיבית חודשית (מתיק) */
  monthlyPassiveIncome: number;
  /** הכנסה פסיבית כוללת (כולל ב.ל. + נדל"ן) */
  totalMonthlyPassiveIncome: number;
  /** אחוז FIRE מושג (progress) */
  fireProgress: number;
  /** תוספת חודשית נדרשת (אם חסר) */
  monthlyShortfall: number;
  /** שיעור חיסכון נוכחי */
  currentSavingsRate: number;
  /** שיעור חיסכון נדרש לפרישה ביעד */
  requiredSavingsRate: number | null;
  /** הוצאות שנתיות */
  annualExpenses: number;
  /** סוג FIRE */
  fireType: FireType;
  /** 5 סוגי FIRE לפי הוצאות */
  fireTypeBreakdown: FireTypeBreakdown[];
  /** תרחישי SWR */
  swrScenarios: SWRScenario[];
  /** Coast FIRE */
  coastFire: CoastFireResult;
  /** Barista FIRE Number (מותאם להכנסה חלקית) */
  baristaFireNumber: number;
  /** שנות FIRE - מסלול שנה אחר שנה */
  yearlyPath: FireYearlyRow[];
  /** שלב המשיכה - פרויקציה */
  withdrawalPhase: WithdrawalPhaseRow[];
  /** הכנסה מנדל"ן ב.ל. */
  passiveIncomeBreakdown: {
    portfolio: number;
    realEstate: number;
    bituachLeumi: number;
    barista: number;
  };
  /** שנים עד FIRE אם יגדיל חיסכון ב-10% */
  sensitivityPlusSavings: number;
  /** שנים עד FIRE אם תשואה גבוהה ב-1% */
  sensitivityPlusReturn: number;
  /** שנים עד FIRE אם הוצאות נמוכות ב-10% */
  sensitivityLowerExpenses: number;
}

// ============================================================
// פונקציות עזר
// ============================================================

function getSWRRate(swrType: SWRType): number {
  switch (swrType) {
    case 'four_pct':
      return 4.0;
    case 'three_pct':
      return 3.0;
    case 'three_five_pct':
      return 3.5;
    case 'dynamic':
      return 3.5; // ממוצע דינמי
    default:
      return 4.0;
  }
}

function getSWRMultiplier(swrType: SWRType): number {
  const rate = getSWRRate(swrType);
  return 100 / rate;
}

/**
 * חישוב שנים ל-FIRE ופרויקציה שנה אחר שנה
 * גם מחזיר את הנתיב לגרף
 */
function computeYearsToFire(
  currentSavings: number,
  monthlyContribution: number,
  fireNumber: number,
  realReturn: number, // %
  maxYears = 100,
): { yearsToFire: number; projectedSavings: number; yearlyPath: FireYearlyRow[]; currentAge: number } {
  const r = realReturn / 100;
  const monthlyR = r / 12;
  let savings = currentSavings;
  const yearlyPath: FireYearlyRow[] = [];
  let projectedSavings = savings;

  // כבר הגיע ל-FIRE עם החיסכון הנוכחי
  if (currentSavings >= fireNumber) {
    return {
      yearsToFire: 0,
      projectedSavings: currentSavings,
      yearlyPath: [],
      currentAge: 0,
    };
  }

  let yearsToFire = maxYears;

  for (let year = 1; year <= maxYears; year++) {
    const startSavings = savings;
    // חישוב חודש-חודש
    for (let m = 0; m < 12; m++) {
      savings = savings * (1 + monthlyR) + monthlyContribution;
    }
    const annualReturn = savings - startSavings - monthlyContribution * 12;
    const progressPct = Math.min(100, (savings / fireNumber) * 100);
    const isFireReached = savings >= fireNumber;

    yearlyPath.push({
      year,
      age: 0, // יתמלא בחוץ
      portfolioValue: savings,
      annualContribution: monthlyContribution * 12,
      annualReturn: Math.max(0, annualReturn),
      progressPct,
      isFireReached,
    });

    if (isFireReached && yearsToFire === maxYears) {
      yearsToFire = year;
      projectedSavings = savings;
    }
  }

  if (yearsToFire === maxYears) {
    projectedSavings = savings;
  }

  return { yearsToFire, projectedSavings, yearlyPath, currentAge: 0 };
}

/**
 * חישוב שלב המשיכה - כמה זמן תחזיק התיק
 */
function computeWithdrawalPhase(
  initialPortfolio: number,
  annualWithdrawal: number,
  nominalReturn: number,
  inflationRate: number,
  years: number,
  startAge: number,
): WithdrawalPhaseRow[] {
  const rows: WithdrawalPhaseRow[] = [];
  let portfolio = initialPortfolio;
  const monthlyNominalR = nominalReturn / 100 / 12;
  let currentWithdrawal = annualWithdrawal;

  for (let year = 1; year <= years; year++) {
    if (portfolio <= 0) {
      rows.push({
        year,
        age: startAge + year - 1,
        portfolioValue: 0,
        withdrawal: currentWithdrawal,
        isPortfolioAlive: false,
      });
      continue;
    }

    // תשואה שנתית
    let newPortfolio = portfolio;
    for (let m = 0; m < 12; m++) {
      newPortfolio = newPortfolio * (1 + monthlyNominalR);
    }
    // משיכה שנתית
    newPortfolio -= currentWithdrawal;

    rows.push({
      year,
      age: startAge + year - 1,
      portfolioValue: Math.max(0, newPortfolio),
      withdrawal: currentWithdrawal,
      isPortfolioAlive: newPortfolio > 0,
    });

    portfolio = Math.max(0, newPortfolio);
    // התאמה לאינפלציה
    currentWithdrawal *= 1 + inflationRate / 100;
  }

  return rows;
}

/**
 * חישוב Coast FIRE
 * Coast Number = FI Number / (1+r)^years_until_retirement
 */
export function calculateCoastFire(
  currentSavings: number,
  fireNumber: number,
  realReturn: number, // %
  yearsUntilRetirement: number,
  monthlyContribution: number,
): CoastFireResult {
  const r = realReturn / 100;
  const coastNumber = fireNumber / Math.pow(1 + r, yearsUntilRetirement);

  if (currentSavings >= coastNumber) {
    return {
      coastNumber,
      hasReachedCoast: true,
      coastShortfall: 0,
      yearsToCoast: 0,
    };
  }

  // כמה שנים עד Coast FIRE?
  // currentSavings * (1+r)^n + PMT*12*((1+r)^n-1)/r = coastNumber
  // מחפשים n באיטרציה
  const monthlyR = r / 12;
  let savings = currentSavings;
  let yearsToCoast = 0;
  for (let year = 1; year <= 50; year++) {
    for (let m = 0; m < 12; m++) {
      savings = savings * (1 + monthlyR) + monthlyContribution;
    }
    if (savings >= coastNumber) {
      yearsToCoast = year;
      break;
    }
    if (year === 50) yearsToCoast = 50;
  }

  return {
    coastNumber,
    hasReachedCoast: false,
    coastShortfall: coastNumber - currentSavings,
    yearsToCoast,
  };
}

/**
 * חישוב שיעור חיסכון נדרש לפרישה ביעד
 */
export function calculateRequiredSavingsRate(
  currentSavings: number,
  monthlyGrossIncome: number,
  fireNumber: number,
  realReturn: number,
  yearsToTargetRetirement: number,
): number {
  // Binary search: מחפשים את שיעור החיסכון הנדרש
  const r = realReturn / 100;
  const monthlyR = r / 12;
  const months = yearsToTargetRetirement * 12;

  // FV = PV*(1+r)^n + PMT*((1+r)^n - 1)/r
  const futurePV = currentSavings * Math.pow(1 + monthlyR, months);
  const remainingGoal = fireNumber - futurePV;

  if (remainingGoal <= 0) return 0;

  const fvFactor =
    monthlyR === 0 ? months : (Math.pow(1 + monthlyR, months) - 1) / monthlyR;

  const requiredMonthly = remainingGoal / fvFactor;
  const savingsRate = (requiredMonthly / monthlyGrossIncome) * 100;

  return Math.max(0, Math.min(100, savingsRate));
}

// ============================================================
// FIRE Type Breakdown - חישוב 5 סוגי FIRE
// ============================================================

function buildFireTypeBreakdown(
  currentSavings: number,
  monthlyContribution: number,
  realReturn: number,
  currentAge: number,
  swrRate: number,
): FireTypeBreakdown[] {
  const types: Array<{
    type: FireType;
    label: string;
    monthlyExpenses: number;
  }> = [
    { type: 'lean', label: 'Lean FIRE - חיסכון מקסימלי', monthlyExpenses: 10_000 },
    { type: 'regular', label: 'Regular FIRE - רמת חיים נורמלית', monthlyExpenses: 20_000 },
    { type: 'fat', label: 'Fat FIRE - רמת חיים גבוהה', monthlyExpenses: 40_000 },
    { type: 'coast', label: 'Coast FIRE - צמיחה ללא הפקדות', monthlyExpenses: 20_000 },
    { type: 'barista', label: 'Barista FIRE - עבודה חלקית', monthlyExpenses: 15_000 },
  ];

  return types.map(({ type, label, monthlyExpenses }) => {
    const annualExpenses = monthlyExpenses * 12;
    const fireNumber = annualExpenses / (swrRate / 100);
    const { yearsToFire } = computeYearsToFire(
      currentSavings,
      monthlyContribution,
      fireNumber,
      realReturn,
    );
    return {
      type,
      label,
      monthlyExpenses,
      fireNumber,
      yearsToFire,
      retirementAge: Math.round(currentAge + yearsToFire),
    };
  });
}

// ============================================================
// SWR תרחישים
// ============================================================

function buildSWRScenarios(annualExpenses: number): SWRScenario[] {
  return [
    {
      type: 'four_pct',
      label: 'כלל ה-4% (Trinity Study)',
      rate: 4.0,
      multiplier: 25,
      fireNumber: annualExpenses * 25,
      successRate: '96% הצלחה ל-30 שנה (S&P 500 היסטורי)',
    },
    {
      type: 'three_five_pct',
      label: '3.5% - שמרני לישראל',
      rate: 3.5,
      multiplier: 28.6,
      fireNumber: annualExpenses * 28.6,
      successRate: '~99% הצלחה, מתאים לפרישה ל-40+ שנה',
    },
    {
      type: 'three_pct',
      label: '3% - שמרן מאוד',
      rate: 3.0,
      multiplier: 33.3,
      fireNumber: annualExpenses * 33.3,
      successRate: '>99% הצלחה, מתאים לפרישה בגיל 40 ומטה',
    },
    {
      type: 'dynamic',
      label: 'משיכה דינמית (3-5%)',
      rate: 3.5,
      multiplier: 28.6,
      fireNumber: annualExpenses * 28.6,
      successRate: 'מתאים לשוק: יותר כשהשוק עולה, פחות כשיורד',
    },
  ];
}

// ============================================================
// פונקציה ראשית - calculateFireResult
// ============================================================

export function calculateFireResult(input: FireInput): FireResult {
  const {
    currentAge,
    currentSavings,
    monthlyContribution,
    monthlyGrossIncome,
    monthlyExpensesRetirement,
    expectedNominalReturn,
    inflationRate,
    swrType,
    targetRetirementAge,
    includeBituachLeumi,
    realEstateIncome,
    baristaWorkIncome,
    retirementDurationYears,
  } = input;

  // תשואה ריאלית
  const realReturn = expectedNominalReturn - inflationRate;
  const swrRate = getSWRRate(swrType);
  const annualExpenses = monthlyExpensesRetirement * 12;

  // התאמה: הכנסות פסיביות נוספות מקטינות את ה-FIRE Number הנדרש
  const bituachLeumiMonthly = includeBituachLeumi ? FIRE_CONSTANTS_2026.BITUACH_LEUMI_BASIC_MONTHLY : 0;
  const totalPassiveNonPortfolio = bituachLeumiMonthly + realEstateIncome;
  // ה-FIRE Number מותאם להכנסות נוספות
  const adjustedMonthlyExpenses = Math.max(0, monthlyExpensesRetirement - totalPassiveNonPortfolio);
  const adjustedAnnualExpenses = adjustedMonthlyExpenses * 12;
  const fireNumber = adjustedAnnualExpenses / (swrRate / 100);

  // Barista FIRE: ה-FIRE Number קטן יותר כי יש הכנסה מעבודה חלקית
  const baristaAdjustedMonthly = Math.max(0, adjustedMonthlyExpenses - baristaWorkIncome);
  const baristaFireNumber = (baristaAdjustedMonthly * 12) / (swrRate / 100);

  // חישוב שנים ל-FIRE
  const { yearsToFire, projectedSavings, yearlyPath } = computeYearsToFire(
    currentSavings,
    monthlyContribution,
    fireNumber,
    realReturn,
  );

  // הוסף גיל לנתיב
  const enrichedPath: FireYearlyRow[] = yearlyPath.map((row) => ({
    ...row,
    age: currentAge + row.year,
  }));

  const fireAge = Math.min(120, Math.round(currentAge + yearsToFire));
  const willReachFire = yearsToFire < 100;

  // הכנסות פסיביות
  const portfolioIncome = (projectedSavings * (swrRate / 100)) / 12;
  const totalMonthlyPassive = portfolioIncome + bituachLeumiMonthly + realEstateIncome;

  // פרוגרס
  const fireProgress = Math.min(100, (currentSavings / fireNumber) * 100);

  // שיעור חיסכון נוכחי
  const currentSavingsRate =
    monthlyGrossIncome > 0 ? (monthlyContribution / monthlyGrossIncome) * 100 : 0;

  // שיעור חיסכון נדרש (אם יש גיל יעד)
  let requiredSavingsRate: number | null = null;
  if (targetRetirementAge && targetRetirementAge > currentAge) {
    requiredSavingsRate = calculateRequiredSavingsRate(
      currentSavings,
      monthlyGrossIncome,
      fireNumber,
      realReturn,
      targetRetirementAge - currentAge,
    );
  }

  // פער חודשי (אם לא מגיע ב-30 שנה)
  const monthlyShortfall =
    yearsToFire > 30 && monthlyGrossIncome > 0
      ? Math.max(0, (fireNumber - currentSavings) / (30 * 12) - monthlyContribution)
      : 0;

  // Coast FIRE
  const coastRetirementAge = targetRetirementAge ?? 65;
  const coastFire = calculateCoastFire(
    currentSavings,
    fireNumber,
    realReturn,
    Math.max(1, coastRetirementAge - currentAge),
    monthlyContribution,
  );

  // סוג FIRE לפי הוצאות
  let fireType: FireType = 'regular';
  if (monthlyExpensesRetirement <= 12_000) fireType = 'lean';
  else if (monthlyExpensesRetirement >= 35_000) fireType = 'fat';

  // 5 סוגי FIRE breakdown
  const fireTypeBreakdown = buildFireTypeBreakdown(
    currentSavings,
    monthlyContribution,
    realReturn,
    currentAge,
    swrRate,
  );

  // SWR תרחישים
  const swrScenarios = buildSWRScenarios(annualExpenses);

  // שלב המשיכה
  const withdrawalPhase = computeWithdrawalPhase(
    projectedSavings,
    adjustedAnnualExpenses,
    expectedNominalReturn,
    inflationRate,
    retirementDurationYears,
    fireAge,
  );

  // ניתוח רגישות
  const sens1 = computeYearsToFire(
    currentSavings,
    monthlyContribution * 1.1,
    fireNumber,
    realReturn,
  ).yearsToFire;

  const sens2 = computeYearsToFire(
    currentSavings,
    monthlyContribution,
    fireNumber,
    realReturn + 1,
  ).yearsToFire;

  const sens3 = computeYearsToFire(
    currentSavings,
    monthlyContribution,
    fireNumber * 0.9,
    realReturn,
  ).yearsToFire;

  return {
    fireNumber,
    swr: swrRate,
    yearsToFire,
    fireAge,
    willReachFire,
    projectedSavings,
    monthlyPassiveIncome: portfolioIncome,
    totalMonthlyPassiveIncome: totalMonthlyPassive,
    fireProgress,
    monthlyShortfall,
    currentSavingsRate,
    requiredSavingsRate,
    annualExpenses,
    fireType,
    fireTypeBreakdown,
    swrScenarios,
    coastFire,
    baristaFireNumber,
    yearlyPath: enrichedPath,
    withdrawalPhase,
    passiveIncomeBreakdown: {
      portfolio: portfolioIncome,
      realEstate: realEstateIncome,
      bituachLeumi: bituachLeumiMonthly,
      barista: baristaWorkIncome,
    },
    sensitivityPlusSavings: sens1,
    sensitivityPlusReturn: sens2,
    sensitivityLowerExpenses: sens3,
  };
}
