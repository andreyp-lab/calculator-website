/**
 * בדיקת זכאות ראשונית למענק עבודה (שנת המס 2025) — פונקציות טהורות.
 * מחשב רק אם ההכנסה החודשית הממוצעת בטווח המזכה ואם מתקיימים תנאי הסף הידועים.
 * סכום המענק עצמו תלוי בנוסחה, בהכנסות נוספות ובהכנסות בן/בת הזוג, ונקבע בסימולטור הרשמי.
 */

import { WORK_GRANT_2025, type GrantBand } from '@/lib/constants/benefits-2026';

export interface WorkGrantInput {
  age: number;
  sex: 'male' | 'female';
  /** שנת לידה — לבדיקת מסלול נשים 60–65 (נולדו מ-1960) */
  birthYear: number;
  /** ילדים שטרם מלאו להם 19 */
  children: number;
  /** מתוכם פעוטות (נולדו בשנת המס או בשנתיים שלפניה) */
  toddlers: number;
  singleParent: boolean;
  /** סך הכנסת העבודה / הרווח מעסק בשנת המס */
  annualWorkIncome: number;
  /** חודשי עבודה בפועל (עד 12) */
  workMonths: number;
  /** בבעלותך או בעלות בן/בת הזוג/הילד התלוי זכות במקרקעין מעבר לדירת מגורים יחידה, מעל 50% */
  ownsOtherProperty: boolean;
  /** כל ההכנסה מעבודה התקבלה ממעסיק קרוב (בן זוג, אח, הורה, צאצא…) */
  allIncomeFromRelative: boolean;
}

export interface GrantTrack {
  eligible: boolean;
  band: GrantBand | null;
}
export interface WorkGrantResult {
  avgMonthlyIncome: number;
  blockers: string[];
  general: GrantTrack;
  women60to65: GrantTrack;
  toddler: GrantTrack & { maxSupplement: number };
  /** האם נראה זכאי לפחות לאחד המסלולים */
  likelyEligible: boolean;
  enlarged150: boolean;
}

const inBand = (v: number, b: GrantBand) => v > b.above && v < b.below;

export function checkWorkGrant(i: WorkGrantInput): WorkGrantResult | null {
  const nums = [i.age, i.birthYear, i.children, i.toddlers, i.annualWorkIncome, i.workMonths];
  if (!nums.every(Number.isFinite)) return null;
  if (i.age < 0 || i.age > 120 || i.children < 0 || !Number.isInteger(i.children) || !Number.isInteger(i.toddlers) || i.toddlers < 0 || i.toddlers > i.children) return null;
  if (i.annualWorkIncome < 0 || i.workMonths < 1 || i.workMonths > 12 || !Number.isInteger(i.workMonths)) return null;
  const g = WORK_GRANT_2025;
  const avg = i.annualWorkIncome / i.workMonths;
  const blockers: string[] = [];
  if (i.ownsOtherProperty) blockers.push('בעלות על זכות במקרקעין מעבר לדירת מגורים יחידה (מעל 50%) שוללת זכאות');
  if (i.allIncomeFromRelative) blockers.push('הכנסה מעבודה שכולה ממעסיק קרוב אינה זכאית');
  const hasKids = i.children >= 1;
  const many = i.children >= 3;

  let generalBand: GrantBand | null = null;
  if (i.age >= g.minAge && hasKids) {
    generalBand = i.singleParent ? (many ? g.general.singleParent3plus : g.general.singleParent1or2) : many ? g.general.parents3plus : g.general.parents1or2;
  } else if (i.age >= g.seniorAge) {
    generalBand = g.general.seniors;
  }
  const general: GrantTrack = { eligible: false, band: generalBand };
  if (generalBand) general.eligible = blockers.length === 0 && inBand(avg, generalBand);

  const womanTrack = i.sex === 'female' && i.age >= 60 && i.age <= 65 && i.birthYear >= 1960;
  const women: GrantTrack = { eligible: false, band: womanTrack ? g.general.women60to65 : null };
  if (womanTrack) women.eligible = blockers.length === 0 && inBand(avg, g.general.women60to65);

  let toddlerBand: GrantBand | null = null;
  if (i.age >= g.minAge && i.toddlers >= 1) {
    toddlerBand = i.singleParent ? (many ? g.toddler.singleParent3plus : g.toddler.singleParent1or2) : many ? g.toddler.parents3plus : g.toddler.parents1or2;
  }
  const toddler = { eligible: false, band: toddlerBand, maxSupplement: 0 };
  if (toddlerBand && blockers.length === 0 && inBand(avg, toddlerBand)) {
    toddler.eligible = true;
    toddler.maxSupplement = i.toddlers * g.toddlerSupplementPerChild;
  }
  return {
    avgMonthlyIncome: Math.round(avg * 100) / 100,
    blockers,
    general,
    women60to65: women,
    toddler,
    likelyEligible: general.eligible || women.eligible || toddler.eligible,
    enlarged150: (general.eligible || toddler.eligible) && hasKids,
  };
}
