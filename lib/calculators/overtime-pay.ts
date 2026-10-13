/**
 * חישוב תשלום שעות נוספות לפי חוק שעות עבודה ומנוחה, תשי"א-1951.
 *
 * אלו שיעורי המינימום שבחוק. הסכם קיבוצי, צו הרחבה או חוזה אישי עשויים לקבוע שיעור גבוה יותר.
 * המנוע אינו מכריע אילו שעות הן "נוספות" (תלוי ביום ובשבוע העבודה החלים על העובד) —
 * הוא רק מחשב את התשלום, לאחר שהמשתמש קבע כמה שעות נוספות היו.
 */

/** מקור: סעיף 16(א) — שתי השעות הנוספות הראשונות ביום; סעיף 17(א)(1) — עבודה במנוחה השבועית. */
export const OVERTIME_RATES = {
  firstTwoHours: 1.25,
  afterTwoHours: 1.5,
  restDay: 1.5,
} as const;

/** מספר שעות העבודה החודשיות למשרה מלאה בחמישה ימים, כפי שמשמש בפרסום שכר המינימום של הביטוח הלאומי. */
export const MONTHLY_HOURS_5_DAY_WEEK = 182;

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** שכר שעתי משכר חודשי. נכון למשרה מלאה; בחוזה אישי המחלק עשוי להיות שונה. */
export function hourlyWageFromMonthly(
  monthlyWage: number,
  monthlyHours: number = MONTHLY_HOURS_5_DAY_WEEK,
): number {
  const hours = positive(monthlyHours);
  return hours === 0 ? 0 : positive(monthlyWage) / hours;
}

export interface OvertimeDayResult {
  /** שעות נוספות ששולמו ב-125% */
  hoursAt125: number;
  /** שעות נוספות ששולמו ב-150% */
  hoursAt150: number;
  /** סך התשלום עבור השעות הנוספות (ברוטו, כולל השכר הרגיל של אותן שעות) */
  totalPay: number;
  /** מה שהשעות היו מניבות בשכר רגיל */
  regularPay: number;
  /** התוספת מעל השכר הרגיל */
  premium: number;
}

/** תשלום שעות נוספות ביום עבודה רגיל: שתי השעות הראשונות ב-125%, כל שעה נוספת אחריהן ב-150%. */
export function calculateOvertimeDay(hourlyWage: number, overtimeHours: number): OvertimeDayResult {
  const wage = positive(hourlyWage);
  const hours = positive(overtimeHours);
  const hoursAt125 = Math.min(hours, 2);
  const hoursAt150 = Math.max(0, hours - 2);
  const totalPay =
    wage * (hoursAt125 * OVERTIME_RATES.firstTwoHours + hoursAt150 * OVERTIME_RATES.afterTwoHours);
  const regularPay = wage * hours;
  return { hoursAt125, hoursAt150, totalPay, regularPay, premium: totalPay - regularPay };
}

/** תשלום עבודה במנוחה השבועית: לפחות 150% מהשכר הרגיל לכל שעה (או מנוחה חלופית — לא מחושבת כאן). */
export function calculateRestDayPay(hourlyWage: number, hours: number): number {
  return positive(hourlyWage) * positive(hours) * OVERTIME_RATES.restDay;
}
