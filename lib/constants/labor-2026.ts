/**
 * קבועי דיני עבודה ודמי אבטלה 2026 — נתונים ידניים ממקור ציבורי, עם מקור ותאריך קריאה.
 *
 * חופשה, הודעה מוקדמת, ימי מחלה, דמי חגים: כל זכות (kolzchut.org.il), נקראו ב-20.11.2026. זה סיכום של החוק,
 * לא נוסח החוק עצמו. דמי אבטלה: ביטוח לאומי, btl.gov.il/benefits/Unemployment, בתוקף מ-1.1.2026.
 * סכומי כסף אחרים (שכר מינימום, פטור פיצויים, הבראה) נמצאים ב-tax-2026.ts.
 */

// ───────────────────────── חופשה שנתית ─────────────────────────
// מספר ימי חופשה לפי שנת ותק (שנות לוח). כל שורה: [שנת ותק מ-, נטו, ברוטו]. הערך האחרון חל גם על כל שנה אחריו.
// מקור: kolzchut.org.il/he/חישוב_מספר_ימי_החופשה_השנתית_לעובדים_במקומות_עבודה_שבהם_מונהג_שבוע_עבודה_בן_5_ימים (ו-6_ימים)
export type LeaveRow = readonly [fromYear: number, net: number, gross: number];

/** שבוע עבודה של 5 ימים — חוק (טבלה ב'). */
export const LEAVE_5_DAY_STATUTORY: readonly LeaveRow[] = [
  [1, 12, 16], [5, 12, 16], [6, 14, 18], [7, 15, 21], [8, 16, 22], [9, 17, 23],
  [10, 18, 24], [11, 19, 25], [12, 20, 26], [13, 20, 27], [14, 20, 28],
];
/** שבוע עבודה של 5 ימים — צו הרחבה (טבלה א'); חל היכן שהצו חל, והגבוה מהשניים גובר. */
export const LEAVE_5_DAY_EXTENSION_ORDER: readonly LeaveRow[] = [
  [1, 12, 16], [5, 12, 16], [6, 17, 23], [9, 23, 31],
];
/** שבוע עבודה של 6 ימים. */
export const LEAVE_6_DAY: readonly LeaveRow[] = [
  [1, 14, 16], [5, 14, 16], [6, 16, 18], [7, 18, 21], [8, 19, 22], [9, 20, 23],
  [10, 21, 24], [11, 22, 25], [12, 23, 26], [13, 24, 27], [14, 24, 28],
];
export const LEAVE_RULES = {
  fullYearMinWorkedDays: 200, // שנה מלאה: לפחות 200 ימי עבודה, פחות — יחסי
  partialYearMinWorkedDays: 240, // שנה חלקית (תחילת/סיום באמצע שנה): לפחות 240
  hourlyDailyWaitingDays: 75,
} as const;
/** מחלק לשווי יום לפדיון/ניכוי, למשכורת חודשית. */
/** 21.67 כפי שמופיע בפרסומים הוא 260/12 = 21.6667; הדוגמאות של כל זכות (למשל 9,000 ל-3 חודשים → 138.46) מתאימות רק למחלק המדויק. */
export const DAY_DIVISORS = { net5Day: 260 / 12, net6Day: 25, calendar: 30 } as const;

// ───────────────────────── ימי מחלה ─────────────────────────
export const SICK_PAY = {
  accrualPerMonth: 1.5,
  maxAccrual: 90,
  /** אחוז השכר לפי מספר היום בהיעדרות רציפה: יום 1 — 0; ימים 2–3 — 50%; יום 4 ואילך — 100% */
  payPctDay1: 0,
  payPctDays2to3: 0.5,
  payPctDay4Plus: 1,
} as const;

// ───────────────────────── הודעה מוקדמת ─────────────────────────
export const NOTICE = {
  monthlyFirstMonthsAtOneDay: 6, // 6 החודשים הראשונים: יום לכל חודש
  monthlyAfterMonthsDays: 2.5, // כל חודש מלא נוסף עד שנה: 2.5 ימים
  /** מדורג לשעתי/יומי */
  hourlySecondYearBaseDays: 14,
  hourlyThirdYearBaseDays: 21,
  hourlyFullMonthDays: 30,
} as const;

// ───────────────────────── דמי חגים ─────────────────────────
/** תשעת ימי החג של עובד שעתי/יומי (ללא תאריכים — משתנים כל שנה). */
export const HOLIDAY_DAYS = [
  { label: 'ראש השנה', days: 2 },
  { label: 'יום כיפור', days: 1 },
  { label: 'סוכות (יום ראשון ושמיני עצרת)', days: 2 },
  { label: 'פסח (יום ראשון ושביעי)', days: 2 },
  { label: 'יום העצמאות', days: 1 },
  { label: 'שבועות', days: 1 },
] as const;
export const HOLIDAY_RULES = { minMonthsAtWorkplace: 3, totalDays: 9 } as const;

// ───────────────────────── דמי אבטלה ─────────────────────────
// מקור: btl.gov.il/benefits/Unemployment/Pages/sum.aspx, hisuv.aspx, tkufat_zakaut.aspx, zakaut.aspx — בתוקף מ-1.1.2026
export const UNEMPLOYMENT_2026 = {
  /** "סכום יומי בסיסי לחישוב קצבאות" */
  baseDailyAmount: 415,
  /** שכר יומי ממוצע = הכנסה ב-6 החודשים האחרונים ÷ 150 (כלומר שכר חודשי ממוצע ÷ 25) */
  daysPerMonthForAverage: 25,
  /** מדרגות: [עד כפולה של הסכום הבסיסי, % בני 28+, % מתחת ל-28] */
  bands: [
    [0.5, 0.8, 0.6],
    [0.75, 0.5, 0.4],
    [1, 0.45, 0.35],
    [5, 0.3, 0.25],
  ] as const,
  /** תקרה יומית ב-125 ימי התשלום הראשונים, ומיום 126 שני שלישים ממנה */
  maxDailyFirst125Days: 550.76,
  maxDailyAfter125Days: 367.17,
  capSwitchDay: 125,
  minAge: 20,
  maxAge: 67,
  ageSplit: 28,
  qualifyingMonths: { required: 12, withinMonths: 18 },
  /** ימי זכאות מרביים: [עד גיל (לא כולל), עד 2 תלויים, 3 תלויים ומעלה] */
  daysByAge: [
    [25, 50, 138],
    [28, 67, 138],
    [35, 100, 138],
    [45, 138, 175],
    [200, 175, 175],
  ] as const,
} as const;
