/**
 * מחשבון פנסיה חובה לעצמאי - 2026
 *
 * מאז 2017, עצמאי חייב להפקיד לפנסיה. הסכומים מבוססים על השכר הממוצע במשק.
 *
 * נוסחת ההפקדה החובה (2026):
 * שלב 1: עד מחצית השכר הממוצע (~6,884 ₪/חודש) → 4.45%
 * שלב 2: מחצית עד שכר ממוצע מלא (~13,769 ₪/חודש) → 12.55%
 * שלב 3: מעל השכר הממוצע - אין חובה (מומלץ)
 *
 * הטבות מס:
 * - ניכוי - הפחתה ישירה מההכנסה החייבת (כל ₪ שמופקד חוסך מס במס השולי)
 * - זיכוי - 35% החזר מס על חלק מההפקדה (עד תקרה ~13,700 ₪/שנה)
 *
 * קנסות אי-הפקדה:
 * - ביטוח לאומי יגבה את הסכום החסר + ריבית
 * - לפי תקנות הפקדה מאז 2017
 *
 * מקור: ביטוח לאומי, רשות המסים
 * עדכון: 2026-05-15
 */

// ====================================================================
// קבועים
// ====================================================================

/** שכר ממוצע במשק 2026 (₪/חודש) */
export const AVERAGE_WAGE_2026 = 13_769;

/** מחצית השכר הממוצע */
export const HALF_AVERAGE_WAGE_2026 = 6_884;

/** שיעור הפקדה שלב 1 */
export const TIER1_RATE = 0.0445;

/** שיעור הפקדה שלב 2 */
export const TIER2_RATE = 0.1255;

/** תקרת הפקדה מוטבת לזיכוי מס (שנתי) */
export const TAX_CREDIT_CEILING_ANNUAL = 13_736;

/** שיעור זיכוי מס */
export const TAX_CREDIT_RATE = 0.35;

/** שנת תחילת חובת פנסיה לעצמאי */
export const MANDATORY_PENSION_YEAR = 2017;

/** ריבית קנס חוסר הפקדה (אומדן, בהתאם לחוק) */
export const PENALTY_INTEREST_RATE = 0.04;

/** תשואה ממוצעת לחישוב קצבה (אחוז שנתי) */
export const DEFAULT_ANNUAL_RETURN = 0.04;

/** מקדם קצבה לחישוב (שנים × 12) / מקדם */
export const ANNUITY_FACTOR = 200;

// ====================================================================
// טיפוסים
// ====================================================================

export type PensionFundType = 'pension_fund' | 'provident_fund' | 'insurance';

export interface SelfEmployedPensionInput {
  /** הכנסה חודשית ממוצעת (₪) */
  monthlyIncome: number;
  /** מס שולי משוער (%) */
  marginalTaxRate: number;
  /** האם להפקיד מעבר לחובה */
  contributeAboveMandatory: boolean;
  /** הפקדה רצונית חודשית נוספת (אם רלוונטי) */
  voluntaryMonthlyContribution: number;
  /** שנות עד פרישה (לחישוב קצבה) */
  yearsToRetirement?: number;
  /** תשואה שנתית צפויה (%) — לחישוב עצמי */
  expectedAnnualReturn?: number;
  /** גיל נוכחי (לחישוב עונשים ולוח זמנים) */
  currentAge?: number;
  /** שנות פעילות כעצמאי (לבדיקת חוסר הפקדה בעבר) */
  yearsAsFreelancer?: number;
}

export interface PensionTierBreakdown {
  /** סכום בסיס לשלב */
  baseIncome: number;
  /** שיעור הפקדה */
  rate: number;
  /** סכום חודשי */
  monthlyAmount: number;
  /** תיאור */
  label: string;
}

export interface TaxBenefitDetail {
  /** חיסכון מניכוי (₪) */
  deductionSaving: number;
  /** חיסכון מזיכוי (₪) */
  creditSaving: number;
  /** סה"כ חיסכון מס */
  totalSaving: number;
  /** שיעור החזר אפקטיבי */
  effectiveReturnRate: number;
  /** תקרת הפקדה מוטבת */
  taxBenefitCeiling: number;
  /** האם ניצל מלוא ההטבה */
  maxBenefitReached: boolean;
}

export interface PenaltyResult {
  /** האם יש חשש לקנס */
  hasPenaltyRisk: boolean;
  /** שנות חוסר הפקדה */
  yearsWithoutPension: number;
  /** סכום חוסר הפקדה (אומדן) */
  estimatedMissingDeposits: number;
  /** ריבית צבורה */
  estimatedInterest: number;
  /** סה"כ חשיפה */
  totalExposure: number;
  /** המלצה */
  recommendation: string;
}

export interface FundProjection {
  year: number;
  ageAtYear: number;
  totalDeposited: number;
  fundValue: number;
  monthlyPension: number;
}

export interface SelfEmployedPensionResult {
  /** הפקדה חובה חודשית */
  mandatoryMonthly: number;
  /** הפקדה חובה שנתית */
  mandatoryAnnual: number;
  /** הפקדה רצונית */
  voluntaryAnnual: number;
  /** סך ההפקדה */
  totalAnnualContribution: number;
  /** חיסכון מס (זיכוי + ניכוי) */
  taxSavings: number;
  /** עלות נטו (אחרי הטבת מס) */
  netCost: number;
  /** עלות נטו חודשית */
  netCostMonthly: number;
  /** אחוז עלות נטו מהכנסה */
  netCostAsPercentOfIncome: number;
  /** קצבה חודשית צפויה לפרישה (משוער 30 שנות הפקדה) */
  expectedMonthlyPension30Years: number;
  /** קצבה משוערת לפי שנות הפקדה בפועל */
  expectedMonthlyPensionActual: number;
  /** פירוט מס מפורט */
  taxBenefit: TaxBenefitDetail;
  /** הסבר מפורט שלבי חיוב */
  tierBreakdown: PensionTierBreakdown[];
  /** פירוט ישן (תאימות לאחור) */
  breakdown: {
    tier1Amount: number;
    tier1Rate: number;
    tier2Amount: number;
    tier2Rate: number;
  };
  /** הקרנה לאורך שנים */
  projection: FundProjection[];
  /** ניתוח קנסות אפשריים */
  penaltyAnalysis: PenaltyResult;
  /** המלצות מותאמות */
  recommendations: string[];
  /** הערות (תאימות לאחור) */
  notes: string[];
  /** האם מעל השכר הממוצע */
  isAboveAverageWage: boolean;
  /** האם ניצל את מלוא ההפקדה החובה */
  isAtMandatoryMax: boolean;
  /** הפקדה אופטימלית מומלצת */
  optimalMonthlyContribution: number;
}

// ====================================================================
// פונקציות עזר
// ====================================================================

/**
 * חישוב הפקדה חובה חודשית לפי שכר
 */
export function calculateMandatoryDeposit(monthlyIncome: number): {
  tier1: number;
  tier2: number;
  total: number;
} {
  const income = Math.max(0, monthlyIncome);
  const tier1Income = Math.min(income, HALF_AVERAGE_WAGE_2026);
  const tier1 = tier1Income * TIER1_RATE;

  let tier2 = 0;
  if (income > HALF_AVERAGE_WAGE_2026) {
    const tier2Income = Math.min(
      income - HALF_AVERAGE_WAGE_2026,
      AVERAGE_WAGE_2026 - HALF_AVERAGE_WAGE_2026,
    );
    tier2 = tier2Income * TIER2_RATE;
  }

  return { tier1, tier2, total: tier1 + tier2 };
}

/**
 * חישוב הטבת מס מלאה
 */
export function calculateTaxBenefit(
  annualContribution: number,
  marginalTaxRate: number,
): TaxBenefitDetail {
  const marginalRate = marginalTaxRate / 100;

  // ניכוי - כל ₪ שמופקד חוסך מס במלוא המס השולי
  const deductionSaving = annualContribution * marginalRate;

  // זיכוי - 35% מחלק מההפקדה, מוגבל לתקרה
  const creditBase = Math.min(annualContribution, TAX_CREDIT_CEILING_ANNUAL);
  // זיכוי על 35% מהבסיס, בשיעור 35%
  const creditAmount = creditBase * TAX_CREDIT_RATE;
  const creditSaving = creditAmount * TAX_CREDIT_RATE;

  const totalSaving = deductionSaving + creditSaving;
  const effectiveReturnRate = annualContribution > 0 ? totalSaving / annualContribution : 0;

  return {
    deductionSaving,
    creditSaving,
    totalSaving,
    effectiveReturnRate,
    taxBenefitCeiling: TAX_CREDIT_CEILING_ANNUAL,
    maxBenefitReached: annualContribution >= TAX_CREDIT_CEILING_ANNUAL,
  };
}

/**
 * חישוב צבירה עתידית (FV)
 */
export function calculateFutureValue(
  annualContribution: number,
  years: number,
  annualReturn: number,
): number {
  if (annualReturn === 0) return annualContribution * years;
  return annualContribution * ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
}

/**
 * חישוב קצבה חודשית מסכום צבור
 */
export function calculateMonthlyPension(fundValue: number): number {
  return fundValue / ANNUITY_FACTOR;
}

/**
 * בניית הקרנה לפי שנים
 */
export function buildProjection(
  annualContribution: number,
  yearsToRetirement: number,
  annualReturn: number,
  currentAge: number,
): FundProjection[] {
  const projections: FundProjection[] = [];
  let fundValue = 0;
  let totalDeposited = 0;

  for (let year = 1; year <= yearsToRetirement; year++) {
    totalDeposited += annualContribution;
    fundValue = fundValue * (1 + annualReturn) + annualContribution;
    const monthlyPension = calculateMonthlyPension(fundValue);

    projections.push({
      year,
      ageAtYear: currentAge + year,
      totalDeposited: Math.round(totalDeposited),
      fundValue: Math.round(fundValue),
      monthlyPension: Math.round(monthlyPension),
    });
  }

  return projections;
}

/**
 * ניתוח קנסות עבור חוסר הפקדה
 */
export function analyzePenalty(
  monthlyIncome: number,
  yearsWithoutPension: number,
): PenaltyResult {
  if (yearsWithoutPension <= 0) {
    return {
      hasPenaltyRisk: false,
      yearsWithoutPension: 0,
      estimatedMissingDeposits: 0,
      estimatedInterest: 0,
      totalExposure: 0,
      recommendation: 'אין חשיפה לקנסות — ההפקדות מסודרות.',
    };
  }

  const { total: monthlyMandatory } = calculateMandatoryDeposit(monthlyIncome);
  const annualMandatory = monthlyMandatory * 12;
  const estimatedMissingDeposits = annualMandatory * yearsWithoutPension;

  // חישוב ריבית מצטברת (פשוט)
  let estimatedInterest = 0;
  for (let y = 1; y <= yearsWithoutPension; y++) {
    estimatedInterest += annualMandatory * Math.pow(1 + PENALTY_INTEREST_RATE, yearsWithoutPension - y + 1) - annualMandatory;
  }

  const totalExposure = estimatedMissingDeposits + estimatedInterest;

  let recommendation = '';
  if (yearsWithoutPension >= 5) {
    recommendation = `חשיפה גבוהה! ${yearsWithoutPension} שנות חוסר הפקדה. פנה מיד לביטוח לאומי ולרואה חשבון לסידור הנושא.`;
  } else if (yearsWithoutPension >= 2) {
    recommendation = `חשיפה בינונית. ${yearsWithoutPension} שנות חוסר הפקדה — כדאי לפנות לביטוח לאומי.`;
  } else {
    recommendation = `חשיפה נמוכה. כדאי להסדיר ולהתחיל להפקיד מיד כדי למנוע הצטברות.`;
  }

  return {
    hasPenaltyRisk: true,
    yearsWithoutPension,
    estimatedMissingDeposits,
    estimatedInterest,
    totalExposure,
    recommendation,
  };
}

/**
 * חישוב הפקדה אופטימלית (מקסום הטבת מס)
 */
export function calculateOptimalContribution(
  monthlyIncome: number,
  marginalTaxRate: number,
): number {
  const mandatory = calculateMandatoryDeposit(monthlyIncome).total;
  const monthlyOptimal = TAX_CREDIT_CEILING_ANNUAL / 12;
  // ההפקדה האופטימלית היא עד תקרת ההטבה, לא פחות מהחובה
  return Math.max(mandatory, Math.min(monthlyOptimal, monthlyIncome * 0.15));
}

// ====================================================================
// פונקציה ראשית
// ====================================================================

export function calculateSelfEmployedPension(
  input: SelfEmployedPensionInput,
): SelfEmployedPensionResult {
  const monthlyIncome = Math.max(0, input.monthlyIncome);
  const yearsToRetirement = Math.max(1, input.yearsToRetirement ?? 30);
  const annualReturn = (input.expectedAnnualReturn ?? DEFAULT_ANNUAL_RETURN * 100) / 100;
  const currentAge = Math.max(20, input.currentAge ?? 40);
  const yearsAsFreelancer = Math.max(0, input.yearsAsFreelancer ?? 0);

  // חישוב הפקדה חובה
  const { tier1: tier1Amount, tier2: tier2Amount, total: mandatoryMonthly } = calculateMandatoryDeposit(monthlyIncome);

  const mandatoryAnnual = mandatoryMonthly * 12;
  const voluntaryAnnual = input.contributeAboveMandatory
    ? input.voluntaryMonthlyContribution * 12
    : 0;
  const totalAnnualContribution = mandatoryAnnual + voluntaryAnnual;

  // הטבת מס
  const taxBenefit = calculateTaxBenefit(totalAnnualContribution, input.marginalTaxRate);
  const taxSavings = taxBenefit.totalSaving;
  const netCost = totalAnnualContribution - taxSavings;
  const netCostMonthly = netCost / 12;
  const netCostAsPercentOfIncome = monthlyIncome > 0 ? (netCostMonthly / monthlyIncome) * 100 : 0;

  // קצבה צפויה (30 שנה)
  const fv30 = calculateFutureValue(totalAnnualContribution, 30, DEFAULT_ANNUAL_RETURN);
  const expectedMonthlyPension30Years = calculateMonthlyPension(fv30);

  // קצבה לפי שנות הפקדה בפועל
  const fvActual = calculateFutureValue(totalAnnualContribution, yearsToRetirement, annualReturn);
  const expectedMonthlyPensionActual = calculateMonthlyPension(fvActual);

  // פירוט שלבים
  const tierBreakdown: PensionTierBreakdown[] = [
    {
      baseIncome: Math.min(monthlyIncome, HALF_AVERAGE_WAGE_2026),
      rate: TIER1_RATE * 100,
      monthlyAmount: tier1Amount,
      label: `שלב 1: עד ${HALF_AVERAGE_WAGE_2026.toLocaleString('he-IL')} ₪ × 4.45%`,
    },
  ];

  if (tier2Amount > 0) {
    tierBreakdown.push({
      baseIncome: Math.min(monthlyIncome - HALF_AVERAGE_WAGE_2026, AVERAGE_WAGE_2026 - HALF_AVERAGE_WAGE_2026),
      rate: TIER2_RATE * 100,
      monthlyAmount: tier2Amount,
      label: `שלב 2: ${HALF_AVERAGE_WAGE_2026.toLocaleString('he-IL')}–${AVERAGE_WAGE_2026.toLocaleString('he-IL')} ₪ × 12.55%`,
    });
  }

  // הקרנה
  const projection = buildProjection(
    totalAnnualContribution,
    Math.min(yearsToRetirement, 40),
    annualReturn,
    currentAge,
  );

  // ניתוח קנסות
  const penaltyAnalysis = analyzePenalty(monthlyIncome, yearsAsFreelancer > 0 ? Math.max(0, yearsAsFreelancer - (2026 - MANDATORY_PENSION_YEAR)) : 0);

  // המלצות
  const recommendations: string[] = [];
  const notes: string[] = [];

  if (monthlyIncome > AVERAGE_WAGE_2026) {
    recommendations.push(
      `הכנסתך מעל השכר הממוצע (${AVERAGE_WAGE_2026.toLocaleString('he-IL')} ₪). מעל לסף זה אין חובה חוקית, אך הפקדה נוספת מקבלת הטבת מס ניכרת — כ-${Math.round(taxBenefit.effectiveReturnRate * 100)}% החזר.`,
    );
    notes.push(`הכנסה מעל השכר הממוצע — אין חובה מעבר לחישוב הנ"ל.`);
  }

  if (!taxBenefit.maxBenefitReached) {
    const additionalForMax = TAX_CREDIT_CEILING_ANNUAL - totalAnnualContribution;
    if (additionalForMax > 0) {
      recommendations.push(
        `הגדלת ההפקדה ב-${Math.round(additionalForMax / 12).toLocaleString('he-IL')} ₪/חודש תמקסם את הטבת הזיכוי (עד ${TAX_CREDIT_CEILING_ANNUAL.toLocaleString('he-IL')} ₪/שנה).`,
      );
    }
  } else {
    recommendations.push('מנצל את מלוא הטבת הזיכוי — מצוין!');
  }

  if (marginalTaxIsHigh(input.marginalTaxRate)) {
    recommendations.push(
      `במס שולי ${input.marginalTaxRate}% — כל ₪ שמופקד חוסך ${(input.marginalTaxRate / 100 * 100).toFixed(0)} אג׳ מס. הפקדה לפנסיה היא אחת ההשקעות הכדאיות ביותר.`,
    );
  }

  if (yearsToRetirement < 10) {
    recommendations.push(
      `${yearsToRetirement} שנים עד פרישה — מומלץ להגדיל הפקדה ולשקול ביטוח מנהלים לתשואה מובטחת.`,
    );
  }

  notes.push(
    `חיסכון מס שנתי משוער: ${Math.round(taxSavings).toLocaleString('he-IL')} ₪`,
  );

  if (mandatoryMonthly > 0 && voluntaryAnnual === 0) {
    notes.push(
      'הפקדה רצונית מעבר לחובה מקבלת הטבת מס ניכרת. שקול להגדיל לתקרה הפטורה (~13,736 ₪/שנה).',
    );
  }

  const optimalMonthlyContribution = calculateOptimalContribution(monthlyIncome, input.marginalTaxRate);

  return {
    mandatoryMonthly,
    mandatoryAnnual,
    voluntaryAnnual,
    totalAnnualContribution,
    taxSavings,
    netCost,
    netCostMonthly,
    netCostAsPercentOfIncome,
    expectedMonthlyPension30Years,
    expectedMonthlyPensionActual,
    taxBenefit,
    tierBreakdown,
    breakdown: {
      tier1Amount,
      tier1Rate: TIER1_RATE * 100,
      tier2Amount,
      tier2Rate: TIER2_RATE * 100,
    },
    projection,
    penaltyAnalysis,
    recommendations,
    notes,
    isAboveAverageWage: monthlyIncome > AVERAGE_WAGE_2026,
    isAtMandatoryMax: monthlyIncome >= AVERAGE_WAGE_2026,
    optimalMonthlyContribution,
  };
}

// ====================================================================
// פונקציה עזר פרטית
// ====================================================================

function marginalTaxIsHigh(rate: number): boolean {
  return rate >= 31;
}
