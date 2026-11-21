/**
 * קצבאות משפחה של הביטוח הלאומי — פונקציות טהורות. כל הסכומים מגיעים מ-`lib/constants/tax-2026.ts`.
 *
 * מכסה: קצבת ילדים לפי סדר הילד, מענק לידה, ודמי לידה (שכר ממוצע ליום, תקרה, ימי זכאות).
 * אכשרה ותנאים מיוחדים (אשפוז, לידה מרובה, עצמאית) לא מחושבים — יש לבדוק בביטוח הלאומי.
 */

import {
  BIRTH_GRANT_2026,
  CHILDREN_ALLOWANCE_2026,
  CHILDREN_ALLOWANCE_SUPPLEMENT_2026,
  MATERNITY_ALLOWANCE_2026,
} from '@/lib/constants/tax-2026';

const round2 = (n: number) => Math.round(n * 100) / 100;

// ───────────────────────── קצבת ילדים ─────────────────────────

export interface ChildAllowanceRow {
  /** מקום הילד במשפחה (1 = הבכור מבין הילדים הזכאים) */
  position: number;
  amount: number;
  /** תוספת להורה המקבל הבטחת הכנסה וכד' — רק לילד 3 ו-4 */
  supplement: number;
}

export interface ChildAllowanceResult {
  rows: ChildAllowanceRow[];
  monthly: number;
  annual: number;
  /** סכום תוספת אפשרית לכלל הילדים אם ההורה זכאי לה */
  monthlyWithSupplement: number;
}

function allowanceForPosition(position: number): number {
  if (position === 1) return CHILDREN_ALLOWANCE_2026.firstChild;
  if (position === 2) return CHILDREN_ALLOWANCE_2026.secondChild;
  if (position === 3) return CHILDREN_ALLOWANCE_2026.thirdChild;
  if (position === 4) return CHILDREN_ALLOWANCE_2026.fourthChild;
  return CHILDREN_ALLOWANCE_2026.fifthAndAbove;
}

/** `eligibleChildren` = מספר הילדים הזכאים (עד גיל 18, לא נשואים). מחזיר null אם אינו מספר שלם 0–30. */
export function calculateChildAllowance(eligibleChildren: number): ChildAllowanceResult | null {
  if (!Number.isInteger(eligibleChildren) || eligibleChildren < 0 || eligibleChildren > 30) return null;
  const rows: ChildAllowanceRow[] = [];
  for (let position = 1; position <= eligibleChildren; position++) {
    rows.push({
      position,
      amount: allowanceForPosition(position),
      supplement:
        position === 3 || position === 4 ? CHILDREN_ALLOWANCE_SUPPLEMENT_2026.thirdAndFourthChild : 0,
    });
  }
  const monthly = rows.reduce((sum, r) => sum + r.amount, 0);
  const supplements = rows.reduce((sum, r) => sum + r.supplement, 0);
  return { rows, monthly, annual: monthly * 12, monthlyWithSupplement: monthly + supplements };
}

// ───────────────────────── מענק לידה ─────────────────────────

export interface BirthGrantInput {
  /** כמה ילדים יהיו במשפחה אחרי הלידה, כולל הנולדים (מספר שלם 1+) */
  childrenInFamilyAfterBirth: number;
  /** מספר הנולדים בלידה: 1 יחיד, 2 תאומים, 3 שלישייה, 4+ */
  newborns: number;
}

/** סכום מענק הלידה (חד־פעמי). מחזיר null כשהקלט לא תקין. */
export function calculateBirthGrant(input: BirthGrantInput): number | null {
  const { childrenInFamilyAfterBirth, newborns } = input;
  if (!Number.isInteger(newborns) || newborns < 1 || newborns > 8) return null;
  if (!Number.isInteger(childrenInFamilyAfterBirth) || childrenInFamilyAfterBirth < newborns) return null;
  if (newborns === 1) {
    if (childrenInFamilyAfterBirth === 1) return BIRTH_GRANT_2026.firstChild;
    if (childrenInFamilyAfterBirth === 2) return BIRTH_GRANT_2026.secondChild;
    return BIRTH_GRANT_2026.thirdChildAndAbove;
  }
  if (newborns === 2) return BIRTH_GRANT_2026.twins;
  if (newborns === 3) return BIRTH_GRANT_2026.triplets;
  return BIRTH_GRANT_2026.triplets + (newborns - 3) * BIRTH_GRANT_2026.eachAdditionalBeyondTriplets;
}

// ───────────────────────── דמי לידה ─────────────────────────

export type MaternityTrack = 'full' | 'partial' | 'none';

export interface MaternityInput {
  /** סך השכר ב-3 החודשים המלאים שלפני הפסקת העבודה */
  wages3Months: number;
  /** סך השכר ב-6 החודשים המלאים שלפני הפסקת העבודה */
  wages6Months: number;
  /** כמה מ-14 החודשים שלפני הפסקת העבודה שולמו בהם דמי ביטוח */
  contributedOf14: number;
  /** כמה מ-22 החודשים שלפני הפסקת העבודה שולמו בהם דמי ביטוח */
  contributedOf22: number;
}

export interface MaternityResult {
  track: MaternityTrack;
  /** ימי זכאות (105 / 56 / 0) */
  days: number;
  /** ממוצע יומי לפני תקרה: הגבוה מבין ממוצע 3 ו-6 החודשים */
  dailyBeforeCap: number;
  daily: number;
  capped: boolean;
  total: number;
}

/** קובע מסלול לפי אכשרה: מלא (10/14 או 15/22), חלקי (6/14), אחרת אין. */
export function maternityTrack(contributedOf14: number, contributedOf22: number): MaternityTrack {
  const q = MATERNITY_ALLOWANCE_2026;
  const full = q.fullQualifying.some(({ monthsRequired, withinMonths }) =>
    withinMonths === 14 ? contributedOf14 >= monthsRequired : contributedOf22 >= monthsRequired,
  );
  if (full) return 'full';
  if (contributedOf14 >= q.partialQualifying.monthsRequired) return 'partial';
  return 'none';
}

/** מחזיר null כשהקלט לא תקין. התוצאה אומדן בלבד: מינימום, לידה מרובה, אשפוז ועצמאית לא נכללים. */
export function calculateMaternityAllowance(input: MaternityInput): MaternityResult | null {
  const { wages3Months, wages6Months, contributedOf14, contributedOf22 } = input;
  if (![wages3Months, wages6Months, contributedOf14, contributedOf22].every(Number.isFinite)) return null;
  if (wages3Months < 0 || wages6Months < 0) return null;
  if (!Number.isInteger(contributedOf14) || contributedOf14 < 0 || contributedOf14 > 14) return null;
  if (!Number.isInteger(contributedOf22) || contributedOf22 < 0 || contributedOf22 > 22) return null;
  if (contributedOf22 < contributedOf14) return null;
  const q = MATERNITY_ALLOWANCE_2026;
  const track = maternityTrack(contributedOf14, contributedOf22);
  const dailyBeforeCap = Math.max(
    wages3Months / q.averagingDays3Months,
    wages6Months / q.averagingDays6Months,
  );
  const capped = dailyBeforeCap > q.maxDaily;
  const daily = Math.min(dailyBeforeCap, q.maxDaily);
  const days = track === 'full' ? q.fullEntitlementDays : track === 'partial' ? q.partialEntitlementDays : 0;
  return {
    track,
    days,
    dailyBeforeCap: round2(dailyBeforeCap),
    daily: round2(daily),
    capped,
    total: round2(daily * days),
  };
}
