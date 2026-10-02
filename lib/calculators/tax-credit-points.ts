import type { TaxRefundYear } from './tax-refund';
import { calculateRefundChildPoints } from './tax-refund-entitlements';

/**
 * ספר נקודות זיכוי שנתי לשכיר תושב ישראל.
 *
 * מקורות:
 * - נקודות בסיס וילדים: לוחות עזר של רשות המסים (2.25 גבר / 2.75 אישה) ו-tax-refund-entitlements.
 * - חייל משוחרר / שירות לאומי (סעיף 39א): כל-זכות, 36 חודשים מהחודש שלאחר השחרור.
 * - תואר אקדמי (סעיפים 40ג/40ד): לוח עזר 2024, פרק 3.
 * - עולה חדש (סעיף 35): כל-זכות, כללי "לפני 2022" ו"2022 ואילך".
 * הכללים מחושבים בחודשים קלנדריים, כי שנת המס היא 1.1–31.12.
 */

export type CreditGender = 'male' | 'female';

export interface SoldierProfile {
  /** שירות סדיר או שירות לאומי-אזרחי. */
  serviceType: 'army' | 'national';
  /** אורך שירות מלא בחודשים. */
  serviceMonths: number;
  dischargeYear: number;
  /** 1–12: החודש שבו השתחרר. הזכאות מתחילה בחודש שלאחריו. */
  dischargeMonth: number;
}

export interface DegreeProfile {
  degree: 'first' | 'second';
  /** שנת סיום הלימודים (לא שנת קבלת התעודה). */
  completionYear: number;
  /** מספר שנות הלימוד האקדמיות של אותו תואר. */
  studyYears: number;
}

export interface ImmigrantProfile {
  aliyahYear: number;
  /** 1–12: חודש קבלת תעודת העולה. החודש עצמו נספר כחודש ראשון. */
  aliyahMonth: number;
}

export interface CreditPointsProfile {
  taxYear: TaxRefundYear;
  gender: CreditGender;
  childBirthYears?: number[];
  /** חישוב הילדים אוטומטי רק להורה שהיה נשוי לאורך כל שנת המס. */
  marriedWholeYear?: boolean;
  soldier?: SoldierProfile;
  degree?: DegreeProfile;
  immigrant?: ImmigrantProfile;
  /** נקודות נוספות שאומתו מחוץ למחשבון (הורה יחיד, נכות, תושב חוזר וכד׳). */
  additionalVerifiedPoints?: number;
}

export interface CreditPointsLine {
  key: 'base' | 'children' | 'soldier' | 'degree' | 'immigrant' | 'additional';
  label: string;
  points: number;
  note: string;
}

export interface CreditPointsLedger {
  lines: CreditPointsLine[];
  total: number;
}

function assertMonth(month: number, label: string) {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`${label}: חודש חייב להיות מספר שלם בין 1 ל-12.`);
  }
}

/** אינדקס חודשים רציף מאז שנת 0, לצורך השוואת חודשים בין שנים. */
function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

/** נקודות שנתיות לחייל משוחרר או לבן/בת שירות לאומי בשנת מס נתונה. */
export function calculateSoldierPoints(taxYear: TaxRefundYear, gender: CreditGender, profile: SoldierProfile): number {
  assertMonth(profile.dischargeMonth, 'חודש השחרור');
  if (!Number.isFinite(profile.serviceMonths) || profile.serviceMonths < 0) {
    throw new Error('אורך השירות חייב להיות מספר חיובי.');
  }
  const months = profile.serviceMonths;
  let pointsPerYear = 0;
  if (profile.serviceType === 'national') {
    // שירות לאומי: 24 חודשים ומעלה = 2; 12–24 = 1.
    pointsPerYear = months >= 24 ? 2 : months >= 12 ? 1 : 0;
  } else if (gender === 'male') {
    pointsPerYear = months >= 23 ? 2 : months >= 12 ? 1 : 0;
  } else {
    pointsPerYear = months >= 22 ? 2 : months >= 12 ? 1 : 0;
  }
  if (pointsPerYear === 0) {
    throw new Error('שירות קצר מ-12 חודשים מזכה רק בנסיבות מיוחדות (למשל שחרור מוקדם מטעמי בריאות). יש להזין את הנקודות כסכום מאומת.');
  }

  const firstEligible = monthIndex(profile.dischargeYear, profile.dischargeMonth) + 1;
  const lastEligible = firstEligible + 35;
  const yearStart = monthIndex(Number(taxYear), 1);
  const yearEnd = yearStart + 11;
  const overlap = Math.max(0, Math.min(lastEligible, yearEnd) - Math.max(firstEligible, yearStart) + 1);
  return (overlap * pointsPerYear) / 12;
}

/**
 * נקודות לתואר אקדמי: תואר ראשון 1 נקודה עד 3 שנות מס, תואר שני חצי נקודה עד 2 שנות מס,
 * החל משנת המס שלאחר סיום הלימודים. נתמך רק למסיימים משנת 2023 (אחרי הוראת השעה).
 */
export function calculateDegreePoints(taxYear: TaxRefundYear, profile: DegreeProfile): number {
  if (!Number.isInteger(profile.completionYear) || !Number.isInteger(profile.studyYears) || profile.studyYears < 1) {
    throw new Error('יש להזין שנת סיום ומספר שנות לימוד שלם.');
  }
  if (profile.completionYear < 2023) {
    throw new Error('מסיימי לימודים עד 2022 חלה עליהם הוראת שעה עם אפשרות דחייה. יש להזין את נקודות התואר כסכום מאומת.');
  }
  const first = profile.completionYear + 1;
  const perYear = profile.degree === 'first' ? 1 : 0.5;
  const yearsCap = profile.degree === 'first' ? 3 : 2;
  const years = Math.min(profile.studyYears, yearsCap);
  const year = Number(taxYear);
  return year >= first && year < first + years ? perYear : 0;
}

/** נקודות שנתיות לעולה חדש, מחושבות לכל חודש קלנדרי בשנת המס. */
export function calculateImmigrantPoints(taxYear: TaxRefundYear, profile: ImmigrantProfile): number {
  assertMonth(profile.aliyahMonth, 'חודש העלייה');
  if (!Number.isInteger(profile.aliyahYear)) throw new Error('יש להזין שנת עלייה שלמה.');
  // [מספר חודשים, חלק נקודה שנתית לחודש]
  const schedule: readonly (readonly [number, number])[] =
    profile.aliyahYear >= 2022
      ? [[12, 1 / 12], [18, 1 / 4], [12, 1 / 6], [12, 1 / 12]]
      : [[18, 1 / 4], [12, 1 / 6], [12, 1 / 12]];
  const start = monthIndex(profile.aliyahYear, profile.aliyahMonth);
  let total = 0;
  for (let m = 1; m <= 12; m++) {
    let seniority = monthIndex(Number(taxYear), m) - start;
    if (seniority < 0) continue;
    for (const [length, perMonth] of schedule) {
      if (seniority < length) {
        total += perMonth;
        break;
      }
      seniority -= length;
    }
  }
  return total;
}

export function buildCreditPointsLedger(profile: CreditPointsProfile): CreditPointsLedger {
  const lines: CreditPointsLine[] = [];
  const base = profile.gender === 'female' ? 2.75 : 2.25;
  lines.push({
    key: 'base',
    label: 'נקודות בסיס לתושב ישראל',
    points: base,
    note: profile.gender === 'female' ? 'אישה: 2.75' : 'גבר: 2.25',
  });

  const births = profile.childBirthYears ?? [];
  if (births.length > 0) {
    if (!profile.marriedWholeYear) {
      throw new Error('חישוב ילדים אוטומטי דורש אישור שההורה היה נשוי לאורך כל שנת המס.');
    }
    const parent = profile.gender === 'female' ? 'mother' : 'father';
    const childPoints = births.reduce(
      (sum, birthYear) => sum + calculateRefundChildPoints(profile.taxYear, birthYear, parent),
      0,
    );
    lines.push({
      key: 'children',
      label: `נקודות ילדים (${births.length})`,
      points: childPoints,
      note: 'לפי שנת הלידה ושנת המס, להורה נשוי לאורך כל השנה',
    });
  }

  if (profile.soldier) {
    lines.push({
      key: 'soldier',
      label: profile.soldier.serviceType === 'national' ? 'שירות לאומי-אזרחי (סעיף 39א)' : 'חייל משוחרר (סעיף 39א)',
      points: calculateSoldierPoints(profile.taxYear, profile.gender, profile.soldier),
      note: '36 חודשים מהחודש שלאחר השחרור, מחושב לפי חודשי הזכאות בשנה',
    });
  }

  if (profile.degree) {
    lines.push({
      key: 'degree',
      label: profile.degree.degree === 'first' ? 'תואר ראשון (סעיף 40ג)' : 'תואר שני (סעיף 40ג)',
      points: calculateDegreePoints(profile.taxYear, profile.degree),
      note: 'מהשנה שלאחר סיום הלימודים, למשך שנות הלימוד עד התקרה בחוק',
    });
  }

  if (profile.immigrant) {
    lines.push({
      key: 'immigrant',
      label: 'עולה חדש (סעיף 35)',
      points: calculateImmigrantPoints(profile.taxYear, profile.immigrant),
      note: 'מחושב לפי חודשי הוותק בכל חודש בשנה',
    });
  }

  const additional = Number(profile.additionalVerifiedPoints ?? 0);
  if (additional < 0 || !Number.isFinite(additional)) throw new Error('נקודות נוספות חייבות להיות מספר חיובי.');
  if (additional > 0) {
    lines.push({
      key: 'additional',
      label: 'נקודות נוספות שאומתו',
      points: additional,
      note: 'הורה יחיד, נכות וכד׳ — כפי שאומתו על ידי המשתמש',
    });
  }

  const total = lines.reduce((sum, line) => sum + line.points, 0);
  return { lines, total };
}
