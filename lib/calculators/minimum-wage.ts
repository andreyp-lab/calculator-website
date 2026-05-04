/**
 * מחשבון שכר מינימום 2026
 *
 * שכר מינימום ב-2026 (תקף מ-1.4.2026):
 * - חודשי: 6,443.85 ₪ (משרה מלאה)
 * - שעתי 182 שעות: 35.40 ₪
 * - שעתי 186 שעות: 34.64 ₪
 * - יומי 5 ימים בשבוע: 297.40 ₪
 * - יומי 6 ימים: 257.75 ₪
 *
 * שכר מינימום לנוער (לפי גיל):
 * - 16-17: 70% משכר המינימום
 * - 17-18: 75%
 * - 18+: 100%
 *
 * מקור: ביטוח לאומי, משרד העבודה
 */

import { MINIMUM_WAGE_2026 } from '@/lib/constants/tax-2026';

export type WorkType = 'monthly' | 'hourly-182' | 'hourly-186' | 'daily-5' | 'daily-6';
export type AgeGroup = 'youth-16-17' | 'youth-17-18' | 'adult';

export interface MinimumWageInput {
  /** סוג העסקה - חודשי/שעתי/יומי */
  workType: WorkType;
  /** גיל העובד */
  ageGroup: AgeGroup;
  /** אחוז משרה (1-100) */
  partTimePercentage: number;
  /** השכר שמקבלים בפועל (לבדיקה) */
  actualWage?: number;
}

export interface MinimumWageResult {
  /** שכר מינימום מלא */
  minimumWageFullTime: number;
  /** שכר מינימום מותאם לאחוז משרה */
  adjustedMinimumWage: number;
  /** מקדם הגיל */
  ageMultiplier: number;
  /** האם השכר בפועל מספק */
  isAboveMinimum: boolean;
  /** הפרש (אם יש) */
  shortfall: number;
  /** סוג השכר (חודשי/שעתי/יומי) */
  wageTypeLabel: string;
  /** הערות */
  notes: string[];
}

const AGE_MULTIPLIERS: Record<AgeGroup, number> = {
  'youth-16-17': 0.70,
  'youth-17-18': 0.75,
  adult: 1.0,
};

export function calculateMinimumWage(input: MinimumWageInput): MinimumWageResult {
  const ageMultiplier = AGE_MULTIPLIERS[input.ageGroup];
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

  const adjusted = baseMinimum * ageMultiplier * (input.workType === 'monthly' ? partTime : 1);

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

  if (input.ageGroup === 'youth-16-17') {
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
