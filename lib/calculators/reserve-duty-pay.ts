/**
 * מחשבון תגמולי מילואים - ביטוח לאומי 2026
 *
 * תגמול מילואים משולם למי שמשרת במילואים (פעיל) ומחליף את הכנסתו.
 *
 * חישוב:
 * - שכר יומי ממוצע ב-3 חודשים שלפני המילואים
 * - תקרה יומית 2026: 1,730.33 ₪
 * - תקרה חודשית: 51,910 ₪
 * - מינימום: לפי שכר מינימום (~213.20 ₪/יום)
 *
 * הגדרות:
 * - לעצמאי: שכר מינימום + תוספות לפי הצהרת רואה חשבון
 * - לסטודנט / חסר עבודה: שכר מינימום
 *
 * מענקים נוספים (חרבות ברזל 2024-2026):
 * - מענק יום מילואים מיוחד: 280 ₪/יום
 * - מענק לפי ימי שירות: עד 5,300 ₪/חודש
 * - מענק חבילה לעסק קטן עד 10,700 ₪
 *
 * מקור: ביטוח לאומי, miluim.idf.il
 */

export type EmploymentStatus = 'employee' | 'self-employed' | 'unemployed';

export interface ReserveDutyInput {
  /** שכר חודשי ב-3 חודשים שלפני המילואים (₪) */
  recentMonthlySalary: number;
  /** ימי מילואים בתקופה */
  reserveDays: number;
  /** סטטוס תעסוקתי */
  employmentStatus: EmploymentStatus;
  /** האם זכאי למענקי חרבות ברזל */
  eligibleForSpecialGrants: boolean;
}

export interface ReserveDutyResult {
  dailyPayment: number;
  totalBasicPayment: number;
  specialGrantPerDay: number;
  totalSpecialGrant: number;
  totalCompensation: number;
  cappedAtMaximum: boolean;
  notes: string[];
}

const DAILY_CAP_2026 = 1_730.33;
const MONTHLY_CAP_2026 = 51_910;
const MIN_DAILY_2026 = 213.20; // שכר מינימום יומי
const SPECIAL_GRANT_PER_DAY = 280; // מענק יום מילואים מיוחד (חרבות ברזל)

export function calculateReserveDutyPay(input: ReserveDutyInput): ReserveDutyResult {
  const notes: string[] = [];

  // 1. חישוב שכר יומי בסיסי
  let dailyPayment: number;

  if (input.employmentStatus === 'unemployed') {
    dailyPayment = MIN_DAILY_2026;
    notes.push('חסר תעסוקה - תשלום לפי שכר מינימום יומי');
  } else if (input.employmentStatus === 'self-employed') {
    // לעצמאי - חישוב יומי משכר חודשי
    const dailyFromSalary = input.recentMonthlySalary / 30;
    dailyPayment = Math.max(MIN_DAILY_2026, dailyFromSalary);
    notes.push('עצמאי - חישוב לפי הצהרת רואה חשבון או שכר מינימום (גבוה מבין השניים)');
  } else {
    // שכיר
    dailyPayment = input.recentMonthlySalary / 30;
  }

  // 2. תקרה
  const cappedAtMaximum = dailyPayment > DAILY_CAP_2026;
  if (cappedAtMaximum) {
    dailyPayment = DAILY_CAP_2026;
    notes.push(`תשלום יומי מוגבל לתקרה: ${DAILY_CAP_2026} ₪`);
  }

  // 3. תשלום בסיסי
  const totalBasicPayment = dailyPayment * input.reserveDays;

  // 4. מענקים מיוחדים (חרבות ברזל)
  const specialGrantPerDay = input.eligibleForSpecialGrants ? SPECIAL_GRANT_PER_DAY : 0;
  const totalSpecialGrant = specialGrantPerDay * input.reserveDays;

  if (input.eligibleForSpecialGrants) {
    notes.push(
      `מענק חרבות ברזל: ${SPECIAL_GRANT_PER_DAY} ₪/יום × ${input.reserveDays} = ${totalSpecialGrant.toLocaleString()} ₪`,
    );
  }

  // 5. סה"כ
  const totalCompensation = totalBasicPayment + totalSpecialGrant;

  if (input.reserveDays >= 30) {
    notes.push('שירות ארוך - יתכנו מענקים נוספים מטעם משרד הבטחון לפי הוראות');
  }

  return {
    dailyPayment,
    totalBasicPayment,
    specialGrantPerDay,
    totalSpecialGrant,
    totalCompensation,
    cappedAtMaximum,
    notes,
  };
}
