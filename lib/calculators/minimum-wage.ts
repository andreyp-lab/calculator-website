/**
 * מחשבון שכר מינימום מקיף 2026
 *
 * תעריפים תקפים מ-1.4.2026 (מקור: ביטוח לאומי, משרד העבודה)
 *
 * שכר מינימום חודשי:  6,443.85 ₪ (182 שעות/חודש)
 * שעתי 182 שעות:       35.40 ₪
 * שעתי 186 שעות:       34.64 ₪
 * יומי 5 ימים:         297.40 ₪
 * יומי 6 ימים:         257.75 ₪
 *
 * תעריפי נוער:
 * - מתחת ל-16:  60% → 3,866.31 ₪
 * - 16-17:      70% → 4,510.70 ₪
 * - 17-18:      75% → 4,832.89 ₪
 * - 18+:        100%
 *
 * מקורות: ביטוח לאומי (btl.gov.il), כל-זכות, משרד הכלכלה
 */

import {
  MINIMUM_WAGE_2026,
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_EMPLOYEE_2026,
} from '@/lib/constants/tax-2026';

// ============================================================
// Types
// ============================================================

export type WorkType = 'monthly' | 'hourly-182' | 'hourly-186' | 'daily-5' | 'daily-6';
export type AgeGroup = 'under-16' | 'youth-16-17' | 'youth-17-18' | 'adult';
export type WorkWeek = '5-day' | '6-day';

// ============================================================
// Historical data — 2024 / 2025 / 2026
// ============================================================

export interface HistoricalWageEntry {
  year: number;
  effectiveFrom: string;
  monthly: number;
  hourly182: number;
  hourly186: number;
  daily5DayWeek: number;
  daily6DayWeek: number;
  changePercent: number | null;
}

export const HISTORICAL_MINIMUM_WAGES: HistoricalWageEntry[] = [
  {
    year: 2024,
    effectiveFrom: '2024-04-01',
    monthly: 6_136,
    hourly182: 33.71,
    hourly186: 32.99,
    daily5DayWeek: 292.19,
    daily6DayWeek: 253.79,
    changePercent: null,
  },
  {
    year: 2025,
    effectiveFrom: '2025-04-01',
    monthly: 6_247.67,
    hourly182: 34.32,
    hourly186: 33.59,
    daily5DayWeek: 294.79,
    daily6DayWeek: 256.03,
    changePercent: 1.82,
  },
  {
    year: 2026,
    effectiveFrom: '2026-04-01',
    monthly: MINIMUM_WAGE_2026.monthly,
    hourly182: MINIMUM_WAGE_2026.hourly182,
    hourly186: MINIMUM_WAGE_2026.hourly186,
    daily5DayWeek: MINIMUM_WAGE_2026.daily5DayWeek,
    daily6DayWeek: MINIMUM_WAGE_2026.daily6DayWeek,
    changePercent: 3.14,
  },
];

// ============================================================
// International comparison — OECD countries (monthly, USD PPP)
// ============================================================

export interface OECDCountry {
  country: string;
  flag: string;
  monthlyUSD: number;
  currency: string;
  monthlyLocal: number;
  year: number;
}

export const OECD_MINIMUM_WAGES: OECDCountry[] = [
  { country: 'אוסטרליה', flag: '🇦🇺', monthlyUSD: 2_850, currency: 'AUD', monthlyLocal: 4_392, year: 2025 },
  { country: 'לוקסמבורג', flag: '🇱🇺', monthlyUSD: 2_700, currency: 'EUR', monthlyLocal: 2_571, year: 2025 },
  { country: 'גרמניה', flag: '🇩🇪', monthlyUSD: 2_200, currency: 'EUR', monthlyLocal: 2_096, year: 2025 },
  { country: 'הולנד', flag: '🇳🇱', monthlyUSD: 2_100, currency: 'EUR', monthlyLocal: 2_069, year: 2025 },
  { country: 'בריטניה', flag: '🇬🇧', monthlyUSD: 2_000, currency: 'GBP', monthlyLocal: 1_682, year: 2025 },
  { country: 'ישראל 🇮🇱', flag: '🇮🇱', monthlyUSD: 1_780, currency: 'ILS', monthlyLocal: MINIMUM_WAGE_2026.monthly, year: 2026 },
  { country: 'ספרד', flag: '🇪🇸', monthlyUSD: 1_650, currency: 'EUR', monthlyLocal: 1_323, year: 2025 },
  { country: 'ארה"ב', flag: '🇺🇸', monthlyUSD: 1_256, currency: 'USD', monthlyLocal: 1_256, year: 2025 },
  { country: 'פולין', flag: '🇵🇱', monthlyUSD: 1_100, currency: 'PLN', monthlyLocal: 4_666, year: 2025 },
  { country: 'צ\'כיה', flag: '🇨🇿', monthlyUSD: 950, currency: 'CZK', monthlyLocal: 20_800, year: 2025 },
  { country: 'יוון', flag: '🇬🇷', monthlyUSD: 910, currency: 'EUR', monthlyLocal: 968, year: 2025 },
  { country: 'מקסיקו', flag: '🇲🇽', monthlyUSD: 380, currency: 'MXN', monthlyLocal: 7_468, year: 2025 },
];

// ============================================================
// Sector-specific minimums
// ============================================================

export interface SectorMinimum {
  sector: string;
  minimumMonthly: number;
  source: string;
  notes: string;
}

export const SECTOR_MINIMUMS: SectorMinimum[] = [
  {
    sector: 'ניקיון',
    minimumMonthly: 6_600,
    source: 'צו הרחבה בענף הניקיון',
    notes: 'כולל תוספת ותק',
  },
  {
    sector: 'אבטחה ושמירה',
    minimumMonthly: 7_200,
    source: 'צו הרחבה בענף האבטחה',
    notes: 'דרגה 1 (שמירה בסיסית)',
  },
  {
    sector: 'מלונאות ואירוח',
    minimumMonthly: 6_600,
    source: 'ההסכם הקיבוצי בענף המלונות',
    notes: 'שכיר בסיסי',
  },
  {
    sector: 'בנייה ועבודות עפר',
    minimumMonthly: 6_800,
    source: 'ההסכם הקיבוצי בענף הבנייה',
    notes: 'עובד לא מקצועי',
  },
  {
    sector: 'מסחר קמעונאי',
    minimumMonthly: 6_443.85,
    source: 'שכר מינימום חוקי',
    notes: 'אין צו הרחבה מיוחד',
  },
  {
    sector: 'מזון ומסעדנות',
    minimumMonthly: 6_500,
    source: 'ההסכם הקיבוצי',
    notes: 'כולל תוספת אחריות',
  },
  {
    sector: 'חינוך פרטי',
    minimumMonthly: 7_000,
    source: 'הסכם קיבוצי מסגרת',
    notes: 'מורה שעתי - חישוב שונה',
  },
  {
    sector: 'שירות ציבורי (מדינה)',
    minimumMonthly: 6_600,
    source: 'הסכם קיבוצי במגזר הציבורי',
    notes: 'דרגת כניסה',
  },
];

// ============================================================
// Age multipliers
// ============================================================

export const AGE_MULTIPLIERS: Record<AgeGroup, { rate: number; label: string; description: string }> = {
  'under-16': {
    rate: 0.60,
    label: 'מתחת ל-16',
    description: '60% משכר המינימום – חוק עבודת נוער, סעיף 2',
  },
  'youth-16-17': {
    rate: 0.70,
    label: '16-17',
    description: '70% משכר המינימום',
  },
  'youth-17-18': {
    rate: 0.75,
    label: '17-18',
    description: '75% משכר המינימום',
  },
  adult: {
    rate: 1.0,
    label: '18+',
    description: 'שכר מינימום מלא',
  },
};

// ============================================================
// Main input / result interfaces
// ============================================================

export interface MinimumWageInput {
  workType: WorkType;
  ageGroup: AgeGroup;
  partTimePercentage: number;
  actualWage?: number;
}

export interface MinimumWageResult {
  minimumWageFullTime: number;
  adjustedMinimumWage: number;
  ageMultiplier: number;
  isAboveMinimum: boolean;
  shortfall: number;
  wageTypeLabel: string;
  notes: string[];
}

// ============================================================
// Net minimum wage calculation
// ============================================================

export interface NetMinimumWageResult {
  grossMonthly: number;
  incomeTax: number;
  nationalInsurance: number;
  pensionDeduction: number;
  totalDeductions: number;
  netMonthly: number;
  netPercent: number;
  hourlyNet: number;
  effectiveTaxRate: number;
  breakdown: { label: string; amount: number; percent: number }[];
}

function calcMonthlyIncomeTax(monthlyGross: number, creditPoints: number): number {
  const annual = monthlyGross * 12;
  let remaining = annual;
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const ceiling = b.upTo === Infinity ? remaining + prev : b.upTo;
    const sz = ceiling - prev;
    const slice = Math.min(remaining, sz);
    tax += slice * b.rate;
    remaining -= slice;
    if (b.upTo !== Infinity) prev = b.upTo;
  }
  const creditAmount = creditPoints * CREDIT_POINT_2026.annual;
  return Math.max(0, tax - creditAmount) / 12;
}

function calcMonthlyNI(monthlyGross: number): number {
  const { reducedThresholdMonthly, maxThresholdMonthly, reducedRate, fullRate } =
    SOCIAL_SECURITY_EMPLOYEE_2026;
  if (monthlyGross <= reducedThresholdMonthly) return monthlyGross * reducedRate.total;
  if (monthlyGross <= maxThresholdMonthly) {
    return (
      reducedThresholdMonthly * reducedRate.total +
      (monthlyGross - reducedThresholdMonthly) * fullRate.total
    );
  }
  return (
    reducedThresholdMonthly * reducedRate.total +
    (maxThresholdMonthly - reducedThresholdMonthly) * fullRate.total
  );
}

export function calculateNetMinimumWage(
  ageGroup: AgeGroup = 'adult',
  pensionEnabled = true,
  creditPoints = 2.25,
): NetMinimumWageResult {
  const rate = AGE_MULTIPLIERS[ageGroup].rate;
  const grossMonthly = Math.round(MINIMUM_WAGE_2026.monthly * rate * 100) / 100;

  const incomeTax = calcMonthlyIncomeTax(grossMonthly, creditPoints);
  const nationalInsurance = calcMonthlyNI(grossMonthly);
  const pensionDeduction = pensionEnabled ? grossMonthly * 0.06 : 0;
  const totalDeductions = incomeTax + nationalInsurance + pensionDeduction;
  const netMonthly = grossMonthly - totalDeductions;
  const netPercent = (netMonthly / grossMonthly) * 100;
  const hourlyNet = netMonthly / 182;
  const effectiveTaxRate = ((incomeTax + nationalInsurance) / grossMonthly) * 100;

  const breakdown = [
    {
      label: 'שכר ברוטו',
      amount: grossMonthly,
      percent: 100,
    },
    {
      label: 'מס הכנסה',
      amount: incomeTax,
      percent: (incomeTax / grossMonthly) * 100,
    },
    {
      label: 'ביטוח לאומי + בריאות',
      amount: nationalInsurance,
      percent: (nationalInsurance / grossMonthly) * 100,
    },
    ...(pensionEnabled
      ? [{ label: 'פנסיה (6%)', amount: pensionDeduction, percent: 6 }]
      : []),
    {
      label: 'שכר נטו',
      amount: netMonthly,
      percent: netPercent,
    },
  ];

  return {
    grossMonthly,
    incomeTax,
    nationalInsurance,
    pensionDeduction,
    totalDeductions,
    netMonthly,
    netPercent,
    hourlyNet,
    effectiveTaxRate,
    breakdown,
  };
}

// ============================================================
// Youth wage calculator
// ============================================================

export interface YouthWageResult {
  ageGroup: AgeGroup;
  multiplier: number;
  monthlyGross: number;
  hourly182: number;
  daily5Day: number;
  label: string;
  description: string;
}

export function calculateYouthWage(ageGroup: AgeGroup): YouthWageResult {
  const info = AGE_MULTIPLIERS[ageGroup];
  return {
    ageGroup,
    multiplier: info.rate,
    monthlyGross: Math.round(MINIMUM_WAGE_2026.monthly * info.rate * 100) / 100,
    hourly182: Math.round(MINIMUM_WAGE_2026.hourly182 * info.rate * 100) / 100,
    daily5Day: Math.round(MINIMUM_WAGE_2026.daily5DayWeek * info.rate * 100) / 100,
    label: info.label,
    description: info.description,
  };
}

// ============================================================
// Compliance checker
// ============================================================

export interface ComplianceInput {
  actualMonthlyWage: number;
  hoursPerMonth: number;
  ageGroup: AgeGroup;
  workType: WorkType;
  partTimePercentage: number;
}

export interface ComplianceResult {
  isCompliant: boolean;
  legalMinimum: number;
  shortfall: number;
  annualShortfall: number;
  percentageOfMinimum: number;
  severity: 'ok' | 'warning' | 'violation';
  recommendation: string;
}

export function checkCompliance(input: ComplianceInput): ComplianceResult {
  const legalMinimum = calculateMinimumWage({
    workType: input.workType,
    ageGroup: input.ageGroup,
    partTimePercentage: input.partTimePercentage,
    actualWage: input.actualMonthlyWage,
  }).adjustedMinimumWage;

  const shortfall = Math.max(0, legalMinimum - input.actualMonthlyWage);
  const isCompliant = shortfall === 0;
  const percentageOfMinimum = (input.actualMonthlyWage / legalMinimum) * 100;
  const annualShortfall = shortfall * 12;

  let severity: ComplianceResult['severity'] = 'ok';
  let recommendation = '';

  if (!isCompliant) {
    severity = percentageOfMinimum < 90 ? 'violation' : 'warning';
    recommendation =
      severity === 'violation'
        ? `חסר ${shortfall.toFixed(2)} ₪/חודש (${annualShortfall.toFixed(0)} ₪/שנה). זו עבירה פלילית! פנה למשרד הכלכלה 1-700-707-100 או בית הדין לעבודה.`
        : `חסר ${shortfall.toFixed(2)} ₪/חודש. יש לבדוק עם המעסיק – ייתכן שגיאה בחישוב.`;
  } else {
    recommendation =
      percentageOfMinimum > 110
        ? 'השכר גבוה בהרבה משכר המינימום. מצויין!'
        : 'השכר תואם את שכר המינימום החוקי.';
  }

  return { isCompliant, legalMinimum, shortfall, annualShortfall, percentageOfMinimum, severity, recommendation };
}

// ============================================================
// Living wage comparison
// ============================================================

export interface LivingWageResult {
  minimumWage: number;
  estimatedLivingWage: number;
  gap: number;
  gapPercent: number;
  breakdown: { category: string; monthlyEstimate: number }[];
  coveragePercent: number;
}

/** עלות מחיה מינימלית מוערכת (2026, ממוצע ארצי) */
export function calculateLivingWageGap(
  familySize: 1 | 2 | 3 | 4,
  ageGroup: AgeGroup = 'adult',
): LivingWageResult {
  const minWage =
    Math.round(MINIMUM_WAGE_2026.monthly * AGE_MULTIPLIERS[ageGroup].rate * 100) / 100;

  // עלות מחיה מוערכת לפי גודל משפחה (ממוצע ארצי 2026)
  const LIVING_COSTS: Record<
    number,
    { category: string; monthlyEstimate: number }[]
  > = {
    1: [
      { category: 'שכר דירה (ממוצע ארצי)', monthlyEstimate: 3_800 },
      { category: 'מזון', monthlyEstimate: 1_800 },
      { category: 'תחבורה', monthlyEstimate: 800 },
      { category: 'חשמל / מים / ארנונה', monthlyEstimate: 700 },
      { category: 'תקשורת', monthlyEstimate: 250 },
      { category: 'ביגוד ומוצרי צריכה', monthlyEstimate: 500 },
      { category: 'בריאות', monthlyEstimate: 350 },
      { category: 'חינוך / תרבות', monthlyEstimate: 300 },
    ],
    2: [
      { category: 'שכר דירה (ממוצע ארצי)', monthlyEstimate: 4_400 },
      { category: 'מזון', monthlyEstimate: 3_200 },
      { category: 'תחבורה', monthlyEstimate: 1_200 },
      { category: 'חשמל / מים / ארנונה', monthlyEstimate: 900 },
      { category: 'תקשורת', monthlyEstimate: 400 },
      { category: 'ביגוד ומוצרי צריכה', monthlyEstimate: 800 },
      { category: 'בריאות', monthlyEstimate: 500 },
      { category: 'חינוך / תרבות', monthlyEstimate: 600 },
    ],
    3: [
      { category: 'שכר דירה (ממוצע ארצי)', monthlyEstimate: 5_000 },
      { category: 'מזון', monthlyEstimate: 4_000 },
      { category: 'תחבורה', monthlyEstimate: 1_400 },
      { category: 'חשמל / מים / ארנונה', monthlyEstimate: 1_100 },
      { category: 'תקשורת', monthlyEstimate: 500 },
      { category: 'ביגוד ומוצרי צריכה', monthlyEstimate: 1_000 },
      { category: 'בריאות', monthlyEstimate: 600 },
      { category: 'חינוך / ילדים', monthlyEstimate: 1_500 },
    ],
    4: [
      { category: 'שכר דירה (ממוצע ארצי)', monthlyEstimate: 5_500 },
      { category: 'מזון', monthlyEstimate: 5_000 },
      { category: 'תחבורה', monthlyEstimate: 1_600 },
      { category: 'חשמל / מים / ארנונה', monthlyEstimate: 1_300 },
      { category: 'תקשורת', monthlyEstimate: 600 },
      { category: 'ביגוד ומוצרי צריכה', monthlyEstimate: 1_200 },
      { category: 'בריאות', monthlyEstimate: 700 },
      { category: 'חינוך / ילדים', monthlyEstimate: 2_500 },
    ],
  };

  const breakdown = LIVING_COSTS[familySize];
  const estimatedLivingWage = breakdown.reduce((s, c) => s + c.monthlyEstimate, 0);
  const gap = Math.max(0, estimatedLivingWage - minWage);
  const gapPercent = (gap / estimatedLivingWage) * 100;
  const coveragePercent = Math.min(100, (minWage / estimatedLivingWage) * 100);

  return { minimumWage: minWage, estimatedLivingWage, gap, gapPercent, breakdown, coveragePercent };
}

// ============================================================
// Core calculateMinimumWage — backward compatible
// ============================================================

export function calculateMinimumWage(input: MinimumWageInput): MinimumWageResult {
  const ageInfo = AGE_MULTIPLIERS[input.ageGroup];
  const ageMultiplier = ageInfo.rate;
  const partTime = Math.max(1, Math.min(100, input.partTimePercentage)) / 100;

  let baseMinimum: number;
  let wageTypeLabel: string;

  switch (input.workType) {
    case 'monthly':
      baseMinimum = MINIMUM_WAGE_2026.monthly;
      wageTypeLabel = 'חודשי';
      break;
    case 'hourly-182':
      baseMinimum = MINIMUM_WAGE_2026.hourly182;
      wageTypeLabel = 'שעתי (182 שעות/חודש)';
      break;
    case 'hourly-186':
      baseMinimum = MINIMUM_WAGE_2026.hourly186;
      wageTypeLabel = 'שעתי (186 שעות/חודש)';
      break;
    case 'daily-5':
      baseMinimum = MINIMUM_WAGE_2026.daily5DayWeek;
      wageTypeLabel = 'יומי (5 ימים/שבוע)';
      break;
    case 'daily-6':
      baseMinimum = MINIMUM_WAGE_2026.daily6DayWeek;
      wageTypeLabel = 'יומי (6 ימים/שבוע)';
      break;
  }

  const adjusted =
    baseMinimum * ageMultiplier * (input.workType === 'monthly' ? partTime : 1);

  const notes: string[] = [];
  let isAboveMinimum = true;
  let shortfall = 0;

  if (input.actualWage !== undefined && input.actualWage > 0) {
    isAboveMinimum = input.actualWage >= adjusted;
    shortfall = isAboveMinimum ? 0 : adjusted - input.actualWage;

    if (!isAboveMinimum) {
      notes.push(
        `⚠️ השכר נמוך משכר המינימום ב-${shortfall.toFixed(2)} ₪. זו עבירה על החוק!`,
      );
      notes.push('פנה לקו ההסברה של ב.ל. (1-700-707-100) או למשרד העבודה');
    } else {
      notes.push('✓ השכר תואם לפחות לשכר המינימום');
    }
  }

  if (input.ageGroup === 'under-16') {
    notes.push('מתחת ל-16 – 60% משכר המינימום (חוק עבודת נוער)');
  } else if (input.ageGroup === 'youth-16-17') {
    notes.push('בני 16-17 זכאים ל-70% משכר המינימום');
  } else if (input.ageGroup === 'youth-17-18') {
    notes.push('בני 17-18 זכאים ל-75% משכר המינימום');
  }

  if (input.workType === 'monthly' && partTime < 1) {
    notes.push(`חישוב משרה חלקית: ${(partTime * 100).toFixed(0)}% × שכר מינימום מלא`);
  }

  return {
    minimumWageFullTime: baseMinimum,
    adjustedMinimumWage: adjusted,
    ageMultiplier,
    isAboveMinimum,
    shortfall,
    wageTypeLabel,
    notes,
  };
}
