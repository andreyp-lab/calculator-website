/**
 * הצמדה למדד המחירים לצרכן — פונקציות טהורות.
 *
 * כלל "מדד ידוע" כפי שמחשבון ההצמדה של הלמ"ס מתנהג: תאריך בחודש M משתמש במדד של החודש M-2
 * (המדד האחרון שפורסם עד ה-15 בחודש M-1). הכלל נגזר מהתנהגות המחשבון הרשמי; מדד "בגין" אינו נתמך.
 * על פני החלפת בסיס מכפילים במקדמי השרשור הרשמיים (`BASE_CHAIN`) — כך מתקבל אותו סכום כמו בלמ"ס.
 */

import {
  BASE_CHAIN,
  CPI_FIRST_MONTH,
  CPI_LAST_MONTH,
  CPI_VALUES,
  baseOfMonth,
  type CpiBaseId,
} from '@/lib/data/cpi-series';

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function addMonths(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const idx = y * 12 + (m - 1) + delta;
  const ny = Math.floor(idx / 12);
  const nm = (idx % 12) + 1;
  return `${ny}-${String(nm).padStart(2, '0')}`;
}

/** חודש המדד הידוע לתאריך בחודש M: M-2. */
export function knownIndexMonth(dateMonth: string): string {
  return addMonths(dateMonth, -2);
}

/** מקדם המרה מערך בבסיס נתון לערך בבסיס 2018 (מכפלת מקדמי השרשור). */
export function factorTo2018(base: CpiBaseId): number {
  let factor = 1;
  let current: CpiBaseId = base;
  while (current !== '2018') {
    const step: { to: CpiBaseId; factor: number } = BASE_CHAIN[current];
    factor *= step.factor;
    current = step.to;
  }
  return factor;
}

/** ערך מדד חודש מסוים בבסיס 2018 (לא מעוגל), או null אם אין נתון. */
export function indexIn2018Terms(month: string): number | null {
  const v = CPI_VALUES[month];
  if (v === undefined) return null;
  return v * factorTo2018(baseOfMonth(month));
}

/** טווח התאריכים הנתמך: כל תאריך שיש מדד ידוע שלו. */
export function supportedDateRange(): { min: string; max: string } {
  return { min: addMonths(CPI_FIRST_MONTH, 2), max: addMonths(CPI_LAST_MONTH, 2) };
}

export interface LinkageInput {
  amount: number;
  /** חודש התאריך הבסיסי, YYYY-MM */
  fromMonth: string;
  /** חודש תאריך החישוב, YYYY-MM */
  toMonth: string;
}

export interface LinkageResult {
  fromIndexMonth: string;
  toIndexMonth: string;
  /** ערכי המדד כפי שמפורסמים (בבסיס של כל חודש) */
  fromIndexPublished: number;
  toIndexPublished: number;
  fromBase: CpiBaseId;
  toBase: CpiBaseId;
  /** יחס ההצמדה: מדד היעד ÷ מדד המקור, אחרי שרשור בסיסים */
  ratio: number;
  linkedAmount: number;
  /** שינוי באחוזים, מעוגל לספרה אחת (כמו הלמ"ס) */
  changePct: number;
  /** האם נדרש שרשור בין בסיסים שונים */
  crossedBase: boolean;
}

/** מחזיר null כשהקלט לא תקין או כשחסר מדד ידוע לאחד התאריכים. */
export function linkToCpi(input: LinkageInput): LinkageResult | null {
  const { amount, fromMonth, toMonth } = input;
  if (!Number.isFinite(amount) || amount < 0) return null;
  if (!MONTH_RE.test(fromMonth) || !MONTH_RE.test(toMonth)) return null;
  const fromIndexMonth = knownIndexMonth(fromMonth);
  const toIndexMonth = knownIndexMonth(toMonth);
  const from = indexIn2018Terms(fromIndexMonth);
  const to = indexIn2018Terms(toIndexMonth);
  if (from === null || to === null) return null;
  const ratio = to / from;
  const fromBase = baseOfMonth(fromIndexMonth);
  const toBase = baseOfMonth(toIndexMonth);
  return {
    fromIndexMonth,
    toIndexMonth,
    fromIndexPublished: CPI_VALUES[fromIndexMonth],
    toIndexPublished: CPI_VALUES[toIndexMonth],
    fromBase,
    toBase,
    ratio,
    linkedAmount: Math.round(amount * ratio * 100) / 100,
    changePct: Math.round((ratio - 1) * 1000) / 10,
    crossedBase: fromBase !== toBase,
  };
}
