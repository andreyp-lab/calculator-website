/**
 * הנחה בארנונה לפי הכנסה — פונקציות טהורות. הטבלה ב-`lib/constants/arnona-discount-2026.ts`.
 * התוצאה היא "עד X%": הרשות המקומית קובעת בצו את ההנחה בפועל ואת השטח שעליו היא חלה.
 */

import {
  ARNONA_DISCOUNT_PERCENTS,
  ARNONA_INCOME_BANDS_2026,
  ARNONA_INCOME_PER_EXTRA_PERSON_2026,
} from '@/lib/constants/arnona-discount-2026';

const round2 = (n: number) => Math.round(n * 100) / 100;

/** ספים עליונים לשיעורי ההנחה 90/70/50/30 למשק בית בגודל נתון (1+). */
export function arnonaIncomeThresholds(householdSize: number): number[] | null {
  if (!Number.isInteger(householdSize) || householdSize < 1 || householdSize > 40) return null;
  const table = ARNONA_INCOME_BANDS_2026;
  if (householdSize <= table.length) return [...table[householdSize - 1]];
  const extra = householdSize - table.length;
  const base = table[table.length - 1];
  return base.map((t, i) => t + extra * ARNONA_INCOME_PER_EXTRA_PERSON_2026[i]);
}

export interface ArnonaIncomeDiscountResult {
  /** אחוז ההנחה המרבי, 0 אם ההכנסה מעל הסף העליון */
  percent: number;
  thresholds: number[];
  /** כמה ההכנסה מעל הסף הנוכחי עד הסף הבא (לתכנון), null אם אין */
  nextThresholdGap: number | null;
  /** חיסכון חודשי משוער על `monthlyArnona` (אם הוזן) */
  monthlySaving: number | null;
  annualSaving: number | null;
}

export function arnonaIncomeDiscount(input: {
  householdSize: number;
  avgMonthlyGrossIncome: number;
  monthlyArnona?: number;
}): ArnonaIncomeDiscountResult | null {
  const { householdSize, avgMonthlyGrossIncome } = input;
  if (!Number.isFinite(avgMonthlyGrossIncome) || avgMonthlyGrossIncome < 0) return null;
  const thresholds = arnonaIncomeThresholds(householdSize);
  if (!thresholds) return null;
  let percent = 0;
  let idx = -1;
  for (let i = 0; i < thresholds.length; i++) {
    if (avgMonthlyGrossIncome <= thresholds[i]) {
      percent = ARNONA_DISCOUNT_PERCENTS[i];
      idx = i;
      break;
    }
  }
  const nextIdx = idx === -1 ? null : idx; // הסף הנוכחי הוא העליון של הרצועה
  const gap = nextIdx === null ? null : round2(thresholds[nextIdx] - avgMonthlyGrossIncome);
  const arnona = input.monthlyArnona;
  const has = typeof arnona === 'number' && Number.isFinite(arnona) && arnona >= 0;
  return {
    percent,
    thresholds,
    nextThresholdGap: gap,
    monthlySaving: has ? round2((arnona * percent) / 100) : null,
    annualSaving: has ? round2((arnona * percent * 12) / 100) : null,
  };
}
