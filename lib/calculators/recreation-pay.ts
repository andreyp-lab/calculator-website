/**
 * חישוב דמי הבראה 2026
 *
 * מקור: צו ההרחבה הכללי במשק (מגזר פרטי)
 * תעריף 2026: 418 ₪/יום במגזר הפרטי, 471.40 ₪/יום במגזר הציבורי
 *
 * זכאות: עובד שהשלים שנה ראשונה במקום העבודה
 * חישוב: ימי הבראה לפי וותק × תעריף יומי × אחוז משרה
 */

import { RECREATION_PAY_2026 } from '@/lib/constants/tax-2026';

export type Sector = 'private' | 'public';

export interface RecreationPayInput {
  yearsOfService: number; // שנות וותק במקום העבודה
  partTimePercentage: number; // אחוז משרה (0-100)
  sector: Sector;
}

export interface RecreationPayResult {
  isEligible: boolean;
  ineligibilityReason?: string;
  daysEntitled: number;
  payPerDay: number;
  fullTimeAmount: number;
  partTimePercentage: number;
  finalAmount: number;
}

/**
 * חישוב מספר ימי הבראה לפי וותק (מגזר פרטי)
 * שנה 1: 5 ימים
 * שנים 2-3: 6 ימים
 * שנים 4-10: 7 ימים
 * שנים 11-15: 8 ימים
 * שנים 16-19: 9 ימים
 * שנים 20+: 10 ימים
 */
export function getRecreationDays(years: number): number {
  if (years < 1) return 0;
  if (years === 1) return 5;
  if (years <= 3) return 6;
  if (years <= 10) return 7;
  if (years <= 15) return 8;
  if (years <= 19) return 9;
  return 10;
}

export function calculateRecreationPay(input: RecreationPayInput): RecreationPayResult {
  const years = Math.floor(input.yearsOfService);
  const partTime = Math.max(0, Math.min(100, input.partTimePercentage));

  // בדיקת זכאות
  if (years < 1) {
    return {
      isEligible: false,
      ineligibilityReason: 'נדרש לפחות שנת עבודה אחת מלאה לזכאות לדמי הבראה',
      daysEntitled: 0,
      payPerDay: 0,
      fullTimeAmount: 0,
      partTimePercentage: partTime,
      finalAmount: 0,
    };
  }

  const daysEntitled = getRecreationDays(years);
  const payPerDay =
    input.sector === 'public'
      ? RECREATION_PAY_2026.publicSectorPerDay
      : RECREATION_PAY_2026.privateSectorPerDay;

  const fullTimeAmount = daysEntitled * payPerDay;
  const finalAmount = fullTimeAmount * (partTime / 100);

  return {
    isEligible: true,
    daysEntitled,
    payPerDay,
    fullTimeAmount,
    partTimePercentage: partTime,
    finalAmount,
  };
}
