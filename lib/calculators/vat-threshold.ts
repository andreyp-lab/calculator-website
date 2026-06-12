/**
 * מחשבון תקרת עוסק פטור — 2026
 *
 * עוסק פטור פטור מ*גביית* מע"מ (לא מנפיק חשבונית מס, לא גובה מע"מ מלקוחות,
 * לא מקזז תשומות) — אך ורק כל עוד המחזור השנתי אינו עובר את התקרה.
 *
 * תקרת 2026: 122,833 ₪ לשנה (VAT_2026.smallBusinessThreshold).
 * מ-2026 התקרה מוצמדת למדד.
 *
 * חריגה מהתקרה → חובת מעבר לעוסק מורשה. המעבר אינו רטרואקטיבי לכל השנה אלא
 * ממועד חציית התקרה; על המחזור שמעבר לתקרה חלה חבות מע"מ (18%).
 *
 * המחשבון מקבל מחזור מצטבר עד כה + צפי חודשי, ומחזיר את חודש החציה הצפוי,
 * כמה "מקום" נותר עד התקרה, ואת השלכות החריגה.
 *
 * מקור: רשות המסים; כל-זכות "עוסק פטור"; lib/constants/tax-2026.ts
 */

import { VAT_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// קבועים
// ============================================================

/** תקרת מחזור עוסק פטור 2026 (₪/שנה) — מקור: רשות המסים, VAT_2026 */
export const VAT_EXEMPT_THRESHOLD_2026 = VAT_2026.smallBusinessThreshold; // 122,833 ₪

/** שיעור מע"מ רגיל 2026 */
export const VAT_STANDARD_RATE = VAT_2026.standard; // 18%

const MONTH_NAMES = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
] as const;

// ============================================================
// טיפוסי קלט
// ============================================================

export interface VatThresholdInput {
  /** מחזור מצטבר מתחילת השנה עד החודש הנוכחי (₪, ללא מע"מ) */
  cumulativeRevenue: number;
  /**
   * החודש האחרון שכבר נכלל ב-cumulativeRevenue (1-12).
   * לדוגמה: אם המחזור המצטבר הוא עד סוף מאי — currentMonth = 5.
   */
  currentMonth: number;
  /**
   * צפי מחזור חודשי ממוצע להמשך השנה (₪, ללא מע"מ).
   * משמש להערכת חודש החציה אם לא הוזן מערך חודשי מפורט.
   */
  expectedMonthlyRevenue: number;
  /**
   * חלופה ל-expectedMonthlyRevenue: מחזור צפוי לכל אחד מ-12 חודשי השנה.
   * אם מוזן — משתמשים בו במקום בממוצע. אורך 12 (ינואר=index 0).
   */
  monthlyBreakdown?: number[];
  /** תקרה מותאמת (ברירת מחדל: תקרת 2026). לחישוב שנים אחרות. */
  threshold?: number;
}

// ============================================================
// טיפוסי פלט
// ============================================================

export interface VatThresholdResult {
  /** התקרה ששימשה בחישוב (₪) */
  threshold: number;
  /** מחזור מצטבר שהוזן (₪) */
  cumulativeRevenue: number;
  /** מחזור שנתי צפוי (מצטבר + יתרת השנה לפי הצפי) */
  projectedAnnualRevenue: number;
  /** כמה מקום נותר עד התקרה במחזור המצטבר הנוכחי (₪). 0 אם כבר חצה. */
  remainingRoom: number;
  /** אחוז ניצול התקרה לפי המחזור המצטבר (0-1+, יכול לעבור 1) */
  utilizationRate: number;
  /** אחוז ניצול לפי המחזור השנתי הצפוי (0-1+) */
  projectedUtilizationRate: number;
  /** האם המחזור המצטבר כבר חצה את התקרה */
  alreadyExceeded: boolean;
  /** האם הצפי השנתי חוצה את התקרה */
  willExceed: boolean;
  /** מספר חודש החציה הצפוי (1-12), או null אם לא צפוי לחצות השנה */
  crossingMonth: number | null;
  /** שם חודש החציה בעברית, או null */
  crossingMonthName: string | null;
  /** סכום המחזור הצפוי מעבר לתקרה בסוף השנה (₪) */
  excessRevenue: number;
  /**
   * אומדן חבות מע"מ על העודף (18% × סכום שמעבר לתקרה).
   * הערה: בפועל החבות חלה מ*מועד* החציה והמעבר לעוסק מורשה — אומדן בלבד.
   */
  estimatedVatOnExcess: number;
  /** סטטוס כללי */
  status: 'safe' | 'approaching' | 'exceeded';
  /** השלכות החריגה (טקסט) — מוצג כשהצפי חוצה */
  consequences: string[];
  /** המלצות לפי המצב */
  recommendations: string[];
}

// ============================================================
// פונקציות עזר
// ============================================================

function clampMonth(m: number): number {
  if (!Number.isFinite(m)) return 1;
  return Math.min(12, Math.max(1, Math.round(m)));
}

function safeNumber(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// ============================================================
// חישוב ראשי
// ============================================================

export function calculateVatThreshold(input: VatThresholdInput): VatThresholdResult {
  const threshold = safeNumber(input.threshold ?? VAT_EXEMPT_THRESHOLD_2026) || VAT_EXEMPT_THRESHOLD_2026;
  const cumulativeRevenue = safeNumber(input.cumulativeRevenue);
  const currentMonth = clampMonth(input.currentMonth);
  const monthlyAvg = safeNumber(input.expectedMonthlyRevenue);

  // האם הוזן פירוט חודשי תקין (12 ערכים)
  const hasBreakdown =
    Array.isArray(input.monthlyBreakdown) && input.monthlyBreakdown.length === 12;
  const breakdown = hasBreakdown
    ? input.monthlyBreakdown!.map((v) => safeNumber(v))
    : null;

  // ----- מחזור שנתי צפוי -----
  // מחזור מצטבר (עד currentMonth) + צפי ליתרת החודשים (currentMonth+1 .. 12)
  const remainingMonths = 12 - currentMonth;
  let projectedRemainder = 0;
  if (breakdown) {
    for (let m = currentMonth + 1; m <= 12; m++) {
      projectedRemainder += breakdown[m - 1];
    }
  } else {
    projectedRemainder = monthlyAvg * remainingMonths;
  }
  const projectedAnnualRevenue = cumulativeRevenue + projectedRemainder;

  // ----- מקום שנותר וניצול -----
  const remainingRoom = Math.max(0, threshold - cumulativeRevenue);
  const utilizationRate = threshold > 0 ? cumulativeRevenue / threshold : 0;
  const projectedUtilizationRate = threshold > 0 ? projectedAnnualRevenue / threshold : 0;
  const alreadyExceeded = cumulativeRevenue >= threshold;
  const willExceed = projectedAnnualRevenue >= threshold;

  // ----- חודש חציית התקרה -----
  // בונים מחזור מצטבר לאורך כל 12 החודשים ומוצאים את החודש הראשון שעובר את התקרה.
  let crossingMonth: number | null = null;
  if (alreadyExceeded) {
    // כבר חצה — נזהה את החודש שבו זה קרה אם יש פירוט חודשי; אחרת currentMonth
    if (breakdown) {
      let running = 0;
      for (let m = 1; m <= currentMonth; m++) {
        running += breakdown[m - 1];
        if (running >= threshold) {
          crossingMonth = m;
          break;
        }
      }
    }
    if (crossingMonth === null) crossingMonth = currentMonth;
  } else if (willExceed) {
    // מתחילים מהמחזור המצטבר הקיים ומוסיפים חודש-חודש קדימה
    let running = cumulativeRevenue;
    for (let m = currentMonth + 1; m <= 12; m++) {
      const add = breakdown ? breakdown[m - 1] : monthlyAvg;
      running += add;
      if (running >= threshold) {
        crossingMonth = m;
        break;
      }
    }
  }
  const crossingMonthName = crossingMonth ? MONTH_NAMES[crossingMonth - 1] : null;

  // ----- עודף מעבר לתקרה וחבות מע"מ משוערת -----
  const excessRevenue = Math.max(0, projectedAnnualRevenue - threshold);
  const estimatedVatOnExcess = excessRevenue * VAT_STANDARD_RATE;

  // ----- סטטוס -----
  let status: VatThresholdResult['status'];
  if (alreadyExceeded) {
    status = 'exceeded';
  } else if (projectedUtilizationRate >= 0.85 || willExceed) {
    status = 'approaching';
  } else {
    status = 'safe';
  }

  // ----- השלכות חריגה (מבוססות קובץ נתונים מאומת) -----
  const consequences: string[] = [];
  if (willExceed || alreadyExceeded) {
    consequences.push(
      'חובת מעבר לעוסק מורשה — יש לדווח לרשות המסים על שינוי הסיווג ממועד חציית התקרה.',
    );
    consequences.push(
      'המעבר אינו רטרואקטיבי לכל השנה — חבות המע"מ חלה ממועד החציה ואילך, על המחזור שמעבר לתקרה.',
    );
    consequences.push(
      `על המחזור שמעבר לתקרה חלה חבות מע"מ בשיעור ${Math.round(
        VAT_STANDARD_RATE * 100,
      )}% — יש להוציא חשבוניות מס מרגע המעבר.`,
    );
    consequences.push(
      'כעוסק מורשה: דיווח מע"מ דו-חודשי, הנפקת חשבונית מס (במקום חשבונית עסקה/קבלה), אך גם זכאות לקזז מע"מ תשומות.',
    );
  }

  // ----- המלצות -----
  const recommendations: string[] = [];
  if (status === 'exceeded') {
    recommendations.push(
      'פנה לרשות המסים בהקדם לעדכון הסיווג לעוסק מורשה — איחור בדיווח עלול לגרור חבות מע"מ רטרואקטיבית וקנסות.',
    );
    recommendations.push(
      'התחל להנפיק חשבוניות מס ולגבות מע"מ 18% מהלקוחות. אם הלקוחות עסקים (B2B) — הם יקזזו את המע"מ, כך שההשפעה עליהם מינורית.',
    );
  } else if (status === 'approaching') {
    if (crossingMonthName) {
      recommendations.push(
        `לפי הצפי, המחזור יחצה את התקרה בחודש ${crossingMonthName}. היערך מראש למעבר לעוסק מורשה.`,
      );
    }
    recommendations.push(
      'בדוק האם כדאי לפרוס הכנסות/לדחות עבודות לשנה הבאה, או לעבור יזום לעוסק מורשה ולהתחיל לקזז מע"מ תשומות.',
    );
  } else {
    recommendations.push(
      `נותר מרווח של ${Math.round(remainingRoom).toLocaleString(
        'he-IL',
      )} ₪ עד התקרה. המשך לעקוב אחר המחזור המצטבר לאורך השנה.`,
    );
  }
  recommendations.push(
    'זכור: עוסק פטור פטור רק מ*גביית מע"מ* — לא ממס הכנסה ולא מדמי ביטוח לאומי. חובת הגשת הצהרת עוסק פטור עד 31 בינואר על מחזור השנה הקודמת.',
  );

  return {
    threshold,
    cumulativeRevenue,
    projectedAnnualRevenue,
    remainingRoom,
    utilizationRate,
    projectedUtilizationRate,
    alreadyExceeded,
    willExceed,
    crossingMonth,
    crossingMonthName,
    excessRevenue,
    estimatedVatOnExcess,
    status,
    consequences,
    recommendations,
  };
}

/**
 * שם חודש בעברית לפי מספר (1-12). ריק אם מחוץ לטווח.
 */
export function getMonthName(month: number): string {
  const m = clampMonth(month);
  return MONTH_NAMES[m - 1];
}
