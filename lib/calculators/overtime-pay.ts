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

/** עיגול לאגורה, כפי שמוצג בשורות תלוש. */
export function roundAgorot(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface Shift {
  /** סך שעות העבודה במשמרת */
  hours: number;
  /** משמרת שנעשתה במנוחה השבועית (שבת): כל השעות ב-150% */
  restDay?: boolean;
}

export interface ShiftBreakdown {
  regularHours: number;
  hoursAt125: number;
  hoursAt150: number;
  restDayHours: number;
}

/**
 * פירוק משמרת בודדת לפי שעות רגילות / 125% / 150% / מנוחה שבועית.
 * שעה נוספת = שעה מעל יום העבודה הרגיל (ברירת מחדל 8 שעות). נבדק לפי יום בלבד — לא לפי שבוע.
 */
export function splitShift(shift: Shift, regularDayHours: number = 8): ShiftBreakdown {
  const hours = positive(shift.hours);
  if (shift.restDay) {
    return { regularHours: 0, hoursAt125: 0, hoursAt150: 0, restDayHours: hours };
  }
  const regularHours = Math.min(hours, positive(regularDayHours));
  const overtime = hours - regularHours;
  return {
    regularHours,
    hoursAt125: Math.min(overtime, 2),
    hoursAt150: Math.max(0, overtime - 2),
    restDayHours: 0,
  };
}

export interface MonthlyPayLine {
  label: string;
  hours: number;
  /** מקדם מהשכר הרגיל (1.25 / 1.5) */
  rate: number;
  /** סכום ברוטו מעוגל לאגורה */
  amount: number;
}

export interface MonthlyShiftsResult {
  hourlyWage: number;
  baseSalary: number;
  lines: MonthlyPayLine[];
  /** סך התוספת מהשעות הנוספות ומעבודה במנוחה, כסכום שורות התלוש המעוגלות */
  extraPay: number;
  /** שכר חודשי ברוטו: שכר בסיס + תוספות */
  totalGross: number;
}

/**
 * שכר חודשי ברוטו לעובד בשכר חודשי עם משמרות.
 * שכר הבסיס מכסה את השעות הרגילות; כל שעה נוספת או שעת מנוחה שבועית משולמת בנוסף, בשיעורה המלא
 * (125% / 150% מהשכר השעתי — לא רק התוספת). השורות מחושבות לפי שיעור, כמו בתלוש, ומעוגלות לאגורה.
 */
export function calculateMonthlyShifts(input: {
  monthlyWage: number;
  shifts: Shift[];
  regularDayHours?: number;
  monthlyHours?: number;
}): MonthlyShiftsResult {
  const baseSalary = positive(input.monthlyWage);
  const hourlyWage = hourlyWageFromMonthly(baseSalary, input.monthlyHours);

  let hours125 = 0;
  let hours150 = 0;
  let hoursRest = 0;
  for (const shift of input.shifts) {
    const split = splitShift(shift, input.regularDayHours);
    hours125 += split.hoursAt125;
    hours150 += split.hoursAt150;
    hoursRest += split.restDayHours;
  }

  const candidates: MonthlyPayLine[] = [
    { label: 'שעות נוספות 125%', hours: hours125, rate: OVERTIME_RATES.firstTwoHours, amount: 0 },
    { label: 'שעות נוספות 150%', hours: hours150, rate: OVERTIME_RATES.afterTwoHours, amount: 0 },
    { label: 'עבודה במנוחה שבועית 150%', hours: hoursRest, rate: OVERTIME_RATES.restDay, amount: 0 },
  ];
  const lines = candidates
    .filter((line) => line.hours > 0)
    .map((line) => ({ ...line, amount: roundAgorot(hourlyWage * line.hours * line.rate) }));

  const extraPay = roundAgorot(lines.reduce((sum, line) => sum + line.amount, 0));
  return { hourlyWage, baseSalary, lines, extraPay, totalGross: roundAgorot(baseSalary + extraPay) };
}
