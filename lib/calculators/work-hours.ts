/**
 * שעות עבודה — פונקציות טהורות: זמן נטו ממשמרת (כולל חציית חצות) ופיצול לשעות רגילות ונוספות.
 * התשלום על שעות נוספות מחושב ב-`overtime-pay.ts` לפי שיעורי החוק.
 */

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseTime(hhmm: string): number | null {
  const m = TIME_RE.exec(hhmm);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export interface ShiftInput {
  start: string; // HH:MM
  end: string; // HH:MM; אם קטן מההתחלה — המשמרת חוצה חצות
  breakMinutes: number;
}

export interface ShiftResult {
  grossMinutes: number;
  netMinutes: number;
  netHours: number;
  crossesMidnight: boolean;
}

/** משמרת של 24 שעות בדיוק (התחלה = סיום) נחשבת ל-0: הזינו סיום שונה מההתחלה. */
export function calculateShift(input: ShiftInput): ShiftResult | null {
  const s = parseTime(input.start);
  const e = parseTime(input.end);
  const brk = input.breakMinutes;
  if (s === null || e === null || !Number.isFinite(brk) || brk < 0) return null;
  const crossesMidnight = e < s;
  const gross = (crossesMidnight ? e + 1440 : e) - s;
  const net = gross - brk;
  if (net < 0) return null;
  return { grossMinutes: gross, netMinutes: net, netHours: Math.round((net / 60) * 100) / 100, crossesMidnight };
}

export function formatHoursMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

/** מפצל שעות נטו לרגילות ונוספות לפי אורך יום העבודה הרגיל. */
export function splitRegularOvertime(netHours: number, regularDayHours: number): { regular: number; overtime: number } | null {
  if (!Number.isFinite(netHours) || netHours < 0 || !Number.isFinite(regularDayHours) || regularDayHours <= 0) return null;
  const regular = Math.min(netHours, regularDayHours);
  return { regular: Math.round(regular * 100) / 100, overtime: Math.round(Math.max(0, netHours - regularDayHours) * 100) / 100 };
}
