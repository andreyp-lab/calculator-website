/**
 * זכויות עובדים — פונקציות טהורות. כל המספרים מ-`lib/constants/labor-2026.ts` ו-`tax-2026.ts`.
 * התוצאות הן אומדן לפי הכללים הכלליים; הסכם קיבוצי, צו הרחבה ענפי או חוזה מיטיב עשויים לתת יותר.
 */

import {
  RECREATION_PAY_2026,
  SEVERANCE_COMPENSATION_2026,
  MINIMUM_WAGE_2026,
} from '@/lib/constants/tax-2026';
import {
  DAY_DIVISORS,
  HOLIDAY_RULES,
  LEAVE_5_DAY_EXTENSION_ORDER,
  LEAVE_5_DAY_STATUTORY,
  LEAVE_6_DAY,
  LEAVE_RULES,
  NOTICE,
  SICK_PAY,
  UNEMPLOYMENT_2026,
  type LeaveRow,
} from '@/lib/constants/labor-2026';

const round2 = (n: number) => Math.round(n * 100) / 100;
const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

// ───────────────────────── חופשה שנתית ─────────────────────────

function rowForYear(table: readonly LeaveRow[], seniorityYear: number): LeaveRow {
  let chosen = table[0];
  for (const row of table) if (seniorityYear >= row[0]) chosen = row;
  return chosen;
}

export interface LeaveEntitlementInput {
  /** שנת הוותק (בשנות לוח): 1 = השנה הקלנדרית הראשונה לעבודה */
  seniorityYear: number;
  workWeekDays: 5 | 6;
  /** צו ההרחבה לשבוע עבודה מקוצר חל במקום העבודה (רק לשבוע של 5 ימים); הגבוה מבין שני הלוחות גובר */
  extensionOrderApplies?: boolean;
  /** ימי עבודה בפועל בשנה; ללא ערך = שנה מלאה */
  workedDaysInYear?: number;
  /** שנה חלקית (התחלה/סיום באמצע שנה) — הסף 240 במקום 200 */
  partialYear?: boolean;
}

export interface LeaveEntitlementResult {
  netDays: number;
  grossDays: number;
  /** האם בוצע חישוב יחסי */
  prorated: boolean;
}

export function calculateLeaveEntitlement(input: LeaveEntitlementInput): LeaveEntitlementResult | null {
  const { seniorityYear, workWeekDays, extensionOrderApplies, workedDaysInYear, partialYear } = input;
  if (!Number.isInteger(seniorityYear) || seniorityYear < 1 || seniorityYear > 60) return null;
  if (workWeekDays !== 5 && workWeekDays !== 6) return null;
  let net: number;
  let gross: number;
  if (workWeekDays === 6) {
    const r = rowForYear(LEAVE_6_DAY, seniorityYear);
    [net, gross] = [r[1], r[2]];
  } else {
    const a = rowForYear(LEAVE_5_DAY_STATUTORY, seniorityYear);
    const b = extensionOrderApplies ? rowForYear(LEAVE_5_DAY_EXTENSION_ORDER, seniorityYear) : a;
    net = Math.max(a[1], b[1]);
    gross = Math.max(a[2], b[2]);
  }
  const threshold = partialYear ? LEAVE_RULES.partialYearMinWorkedDays : LEAVE_RULES.fullYearMinWorkedDays;
  if (workedDaysInYear !== undefined) {
    if (!isNum(workedDaysInYear) || workedDaysInYear < 0) return null;
    if (workedDaysInYear < threshold) {
      const ratio = workedDaysInYear / threshold;
      return { netDays: Math.floor(net * ratio), grossDays: Math.floor(gross * ratio), prorated: true };
    }
  }
  return { netDays: net, grossDays: gross, prorated: false };
}

export interface LeaveRedemptionInput {
  unusedDays: number;
  /** האם הימים נצברו בימי עבודה (נטו) או בימים קלנדריים (ברוטו) */
  accrual: 'net' | 'calendar';
  workWeekDays: 5 | 6;
  payType: 'monthly' | 'hourly';
  /** שכר חודשי (למשכורת חודשית) */
  monthlySalary?: number;
  /** סך השכר ב-3 החודשים הרצופים עם הכי הרבה ימי עבודה מתוך 12 האחרונים (לשכר שעתי) */
  threeMonthTotal?: number;
}

export interface LeaveRedemptionResult {
  dailyValue: number;
  total: number;
}

export function calculateLeaveRedemption(input: LeaveRedemptionInput): LeaveRedemptionResult | null {
  const { unusedDays, accrual, workWeekDays, payType } = input;
  if (!isNum(unusedDays) || unusedDays < 0) return null;
  const divisor =
    accrual === 'calendar' ? DAY_DIVISORS.calendar : workWeekDays === 5 ? DAY_DIVISORS.net5Day : DAY_DIVISORS.net6Day;
  let daily: number;
  if (payType === 'monthly') {
    if (!isNum(input.monthlySalary) || input.monthlySalary < 0) return null;
    daily = input.monthlySalary / divisor;
  } else {
    if (!isNum(input.threeMonthTotal) || input.threeMonthTotal < 0) return null;
    // סך 3 חודשים ÷ 3 = חודש ממוצע; ÷ מחלק = יום. בצבירה קלנדרית: סך ÷ 90
    daily = accrual === 'calendar' ? input.threeMonthTotal / 90 : input.threeMonthTotal / 3 / divisor;
  }
  return { dailyValue: round2(daily), total: round2(daily * unusedDays) };
}

// ───────────────────────── הודעה מוקדמת ─────────────────────────

export interface NoticeInput {
  /** חודשי עבודה מלאים (חלקי חודש לא נספרים) */
  fullMonthsOfService: number;
  payType: 'monthly' | 'hourly';
}

export interface NoticeResult {
  days: number;
  /** ניסוח: "חודש" כשהמגיע הוא חודש שלם */
  isFullMonth: boolean;
}

export function calculateNoticePeriod(input: NoticeInput): NoticeResult | null {
  const { fullMonthsOfService: m, payType } = input;
  if (!Number.isInteger(m) || m < 0 || m > 1200) return null;
  if (payType === 'monthly') {
    if (m >= 12) return { days: NOTICE.hourlyFullMonthDays, isFullMonth: true };
    const days = Math.min(m, NOTICE.monthlyFirstMonthsAtOneDay) + Math.max(0, m - NOTICE.monthlyFirstMonthsAtOneDay) * NOTICE.monthlyAfterMonthsDays;
    return { days, isFullMonth: false };
  }
  if (m >= 36) return { days: NOTICE.hourlyFullMonthDays, isFullMonth: true };
  if (m >= 24) return { days: NOTICE.hourlyThirdYearBaseDays + Math.floor((m - 24) / 2), isFullMonth: false };
  if (m >= 12) return { days: NOTICE.hourlySecondYearBaseDays + Math.floor((m - 12) / 2), isFullMonth: false };
  return { days: m, isFullMonth: false };
}

/** פיצוי חלף הודעה מוקדמת: שכר רגיל לתקופה. מבוסס על שכר חודשי רגיל וחודש של 30 ימים. */
export function noticePayInLieu(days: number, regularMonthlyPay: number): number | null {
  if (!isNum(days) || days < 0 || !isNum(regularMonthlyPay) || regularMonthlyPay < 0) return null;
  return round2((regularMonthlyPay * days) / 30);
}

// ───────────────────────── ימי מחלה ─────────────────────────

/** צבירה לחודש חלקי: ימי עבודה בפועל ÷ 21.67 × 1.5 (חודש מלא = 1.5). */
export function sickAccrualForMonth(daysWorkedInMonth: number): number | null {
  if (!isNum(daysWorkedInMonth) || daysWorkedInMonth < 0) return null;
  const accrued = (daysWorkedInMonth / DAY_DIVISORS.net5Day) * SICK_PAY.accrualPerMonth;
  return round2(Math.min(accrued, SICK_PAY.accrualPerMonth));
}

/** יתרת ימי מחלה אחרי N חודשים מלאים (עם תקרה). */
export function sickBalance(fullMonths: number, usedDays = 0): number | null {
  if (!Number.isInteger(fullMonths) || fullMonths < 0 || !isNum(usedDays) || usedDays < 0) return null;
  return round2(Math.max(0, Math.min(fullMonths * SICK_PAY.accrualPerMonth, SICK_PAY.maxAccrual) - usedDays));
}

export interface SickPayInput {
  /** ימי מחלה ברצף */
  consecutiveDays: number;
  /** שכר ליום עבודה */
  dailyWage: number;
  /** מקום עבודה ששילם מהיום הראשון (הסכם/נוהג) */
  paidFromDayOne?: boolean;
}

export interface SickPayResult {
  paidDays: number; // ימי תשלום מלא-שקולים
  total: number;
  lines: { day: number; pct: number; pay: number }[];
}

export function calculateSickPay(input: SickPayInput): SickPayResult | null {
  const { consecutiveDays, dailyWage } = input;
  if (!Number.isInteger(consecutiveDays) || consecutiveDays < 0 || consecutiveDays > 365) return null;
  if (!isNum(dailyWage) || dailyWage < 0) return null;
  const lines: SickPayResult['lines'] = [];
  let total = 0;
  for (let day = 1; day <= consecutiveDays; day++) {
    const pct = input.paidFromDayOne
      ? 1
      : day === 1
        ? SICK_PAY.payPctDay1
        : day <= 3
          ? SICK_PAY.payPctDays2to3
          : SICK_PAY.payPctDay4Plus;
    const pay = dailyWage * pct;
    total += pay;
    lines.push({ day, pct, pay: round2(pay) });
  }
  return { paidDays: round2(lines.reduce((s, l) => s + l.pct, 0)), total: round2(total), lines };
}

/** שכר יום מחלה למשכורת חודשית — שתי קריאות מקובלות, בלי הכרעה: ÷30 או ÷21.67 / ÷25. */
export function monthlySickDailyWage(monthlySalary: number, method: '30' | '5day' | '6day'): number | null {
  if (!isNum(monthlySalary) || monthlySalary < 0) return null;
  const div = method === '30' ? DAY_DIVISORS.calendar : method === '5day' ? DAY_DIVISORS.net5Day : DAY_DIVISORS.net6Day;
  return round2(monthlySalary / div);
}

// ───────────────────────── דמי חגים ─────────────────────────

export interface HolidayPayInput {
  hourlyWage: number;
  /** סך שעות העבודה בתקופת הממוצע (ברירת מחדל מקובלת: 3 חודשים) */
  totalHours: number;
  /** ימי עבודה בפועל באותה תקופה */
  workdays: number;
  monthsAtWorkplace: number;
  scheduledToWork: boolean;
  workedDayBeforeAndAfter: boolean;
}

export interface HolidayPayResult {
  eligible: boolean;
  avgDailyHours: number;
  amount: number;
  reasons: string[];
}

export function calculateHolidayPay(input: HolidayPayInput): HolidayPayResult | null {
  const { hourlyWage, totalHours, workdays, monthsAtWorkplace } = input;
  if (![hourlyWage, totalHours, workdays, monthsAtWorkplace].every(isNum)) return null;
  if (hourlyWage < 0 || totalHours < 0 || workdays <= 0 || monthsAtWorkplace < 0) return null;
  const reasons: string[] = [];
  if (monthsAtWorkplace < HOLIDAY_RULES.minMonthsAtWorkplace) reasons.push('ותק קצר מ־3 חודשים במקום העבודה');
  if (!input.scheduledToWork) reasons.push('לא היית אמור לעבוד ביום החג');
  if (!input.workedDayBeforeAndAfter) reasons.push('לא עבדת ביום שלפני או שאחרי החג ללא הסכמת המעסיק');
  const avgDailyHours = totalHours / workdays;
  const eligible = reasons.length === 0;
  return { eligible, avgDailyHours: round2(avgDailyHours), amount: eligible ? round2(avgDailyHours * hourlyWage) : 0, reasons };
}

// ───────────────────────── פיצויי פיטורים ─────────────────────────

export interface SeveranceInput {
  lastMonthlySalary: number;
  /** שנות עבודה (עשרוני: 3.5 = שלוש שנים וחצי) */
  yearsOfService: number;
}

export interface SeveranceResult {
  severance: number;
  exemptionCeiling: number;
  exempt: number;
  taxable: number;
}

/** פיצויים: משכורת חודש אחרון × שנות עבודה. פטור: הנמוך מ-1.5×משכורת×שנים ו-13,750×שנים (סעיף 9(7א)). */
export function calculateSeverance(input: SeveranceInput): SeveranceResult | null {
  const { lastMonthlySalary, yearsOfService } = input;
  if (!isNum(lastMonthlySalary) || lastMonthlySalary < 0 || !isNum(yearsOfService) || yearsOfService < 0) return null;
  if (yearsOfService > 70) return null;
  const severance = lastMonthlySalary * yearsOfService;
  const ceiling = Math.min(
    lastMonthlySalary * 1.5 * yearsOfService,
    SEVERANCE_COMPENSATION_2026.annualExemptionCeiling * yearsOfService,
  );
  const exempt = Math.min(severance, ceiling);
  return {
    severance: round2(severance),
    exemptionCeiling: round2(ceiling),
    exempt: round2(exempt),
    taxable: round2(severance - exempt),
  };
}

// ───────────────────────── ותק ─────────────────────────

export interface TenureResult {
  years: number;
  months: number;
  days: number;
  totalFullMonths: number;
  totalDays: number;
  decimalYears: number;
}

/** ותק בין שני תאריכים (YYYY-MM-DD): שנים, חודשים וימים מלאים. null אם הסדר שגוי. */
export function calculateTenure(startIso: string, endIso: string): TenureResult | null {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(startIso) || !re.test(endIso)) return null;
  const s = new Date(`${startIso}T00:00:00Z`);
  const e = new Date(`${endIso}T00:00:00Z`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) return null;
  // חודשים מלאים: המקסימום m כך ש"התחלה + m חודשים" (עם קיצוץ לסוף החודש) אינו אחרי הסיום
  const addMonthsClamped = (m: number): Date => {
    const y = s.getUTCFullYear() + Math.floor((s.getUTCMonth() + m) / 12);
    const mo = (s.getUTCMonth() + m) % 12;
    const lastDay = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
    return new Date(Date.UTC(y, mo, Math.min(s.getUTCDate(), lastDay)));
  };
  let totalMonths = (e.getUTCFullYear() - s.getUTCFullYear()) * 12 + (e.getUTCMonth() - s.getUTCMonth());
  while (totalMonths > 0 && addMonthsClamped(totalMonths) > e) totalMonths -= 1;
  const days = Math.round((e.getTime() - addMonthsClamped(totalMonths).getTime()) / 86400000);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const totalDays = Math.round((e.getTime() - s.getTime()) / 86400000);
  return {
    years,
    months,
    days,
    totalFullMonths: years * 12 + months,
    totalDays,
    decimalYears: round2(totalDays / 365.25),
  };
}

/** ימי הבראה לפי שנות ותק מלאות (מגזר פרטי); 0 אם עוד לא מלאה שנה. */
export function recreationDaysForYears(fullYears: number): number {
  let days = 0;
  for (const row of RECREATION_PAY_2026.daysByYearsOfService) if (fullYears >= row.years) days = row.days;
  return days;
}

// ───────────────────────── דמי אבטלה ─────────────────────────

export interface UnemploymentInput {
  /** שכר חודשי ברוטו ממוצע ב-6 החודשים האחרונים המלאים */
  avgMonthlyGross: number;
  age: number;
  /** מספר תלויים (ילדים, בן/בת זוג שעומד בתנאים) */
  dependents: number;
  /** חודשי עבודה כשכיר מתוך 18 החודשים האחרונים */
  workedMonthsOf18: number;
}

export interface UnemploymentResult {
  eligibleByBasics: boolean;
  reasons: string[];
  dailyAverageWage: number;
  /** קצבה יומית לפי הטבלה לפני התקרה */
  dailyBeforeCap: number;
  /** קצבה יומית ב-125 הימים הראשונים (אחרי תקרה) */
  dailyFirst125: number;
  /** קצבה יומית מיום 126 */
  dailyAfter125: number;
  maxDays: number;
  /** סכום כולל משוער אם מנצלים את כל הימים (ברוטו, לפני ניכויים) */
  totalGross: number;
  monthlyAt25Days: number;
}

function unemploymentDays(age: number, dependents: number): number {
  for (const [untilAge, upTo2, from3] of UNEMPLOYMENT_2026.daysByAge) {
    if (age < untilAge) return dependents >= 3 ? from3 : upTo2;
  }
  return 175;
}

export function calculateUnemployment(input: UnemploymentInput): UnemploymentResult | null {
  const { avgMonthlyGross, age, dependents, workedMonthsOf18 } = input;
  if (![avgMonthlyGross, age, dependents, workedMonthsOf18].every(isNum)) return null;
  if (avgMonthlyGross < 0 || age < 0 || age > 120) return null;
  if (!Number.isInteger(dependents) || dependents < 0 || !Number.isInteger(workedMonthsOf18) || workedMonthsOf18 < 0 || workedMonthsOf18 > 18) return null;
  const u = UNEMPLOYMENT_2026;
  const reasons: string[] = [];
  if (age < u.minAge || age >= u.maxAge) reasons.push('הגיל מחוץ לטווח הזכאות (20 עד לפני 67)');
  if (workedMonthsOf18 < u.qualifyingMonths.required) reasons.push('פחות מ־12 חודשי עבודה מתוך 18 החודשים האחרונים');
  const dailyWage = avgMonthlyGross / u.daysPerMonthForAverage;
  const base = u.baseDailyAmount;
  const young = age < u.ageSplit;
  let prev = 0;
  let benefit = 0;
  for (const [mult, pctOld, pctYoung] of u.bands) {
    const ceiling = mult * base;
    const slice = Math.max(0, Math.min(dailyWage, ceiling) - prev);
    benefit += slice * (young ? pctYoung : pctOld);
    prev = ceiling;
  }
  const dailyFirst125 = Math.min(benefit, u.maxDailyFirst125Days);
  const dailyAfter125 = Math.min(benefit, u.maxDailyAfter125Days);
  const maxDays = unemploymentDays(age, dependents);
  const firstDays = Math.min(maxDays, u.capSwitchDay);
  const laterDays = Math.max(0, maxDays - u.capSwitchDay);
  const totalGross = dailyFirst125 * firstDays + dailyAfter125 * laterDays;
  return {
    eligibleByBasics: reasons.length === 0,
    reasons,
    dailyAverageWage: round2(dailyWage),
    dailyBeforeCap: round2(benefit),
    dailyFirst125: round2(dailyFirst125),
    dailyAfter125: round2(dailyAfter125),
    maxDays,
    totalGross: round2(totalGross),
    monthlyAt25Days: round2(dailyFirst125 * 25),
  };
}

// ───────────────────────── שכר מינימום ─────────────────────────

export interface MinimumWageCheckInput {
  amount: number;
  basis: 'monthly' | 'hourly' | 'daily5' | 'daily6';
  /** שעות חודשיות במשרה מלאה אצלך (ברירת מחדל 182); משמש רק לבסיס שעתי */
  monthlyHours?: number;
}

export interface MinimumWageCheckResult {
  minimum: number;
  meets: boolean;
  /** הפער (שלילי = מתחת למינימום) */
  difference: number;
  effectiveFrom: string;
}

export function checkMinimumWage(input: MinimumWageCheckInput): MinimumWageCheckResult | null {
  const { amount, basis } = input;
  if (!isNum(amount) || amount < 0) return null;
  let minimum: number;
  if (basis === 'monthly') minimum = MINIMUM_WAGE_2026.monthly;
  else if (basis === 'daily5') minimum = MINIMUM_WAGE_2026.daily5DayWeek;
  else if (basis === 'daily6') minimum = MINIMUM_WAGE_2026.daily6DayWeek;
  else {
    const hours = input.monthlyHours ?? 182;
    if (!isNum(hours) || hours <= 0 || hours > 400) return null;
    // שכר המינימום השעתי מתפרסם בקיצוץ לאגורה (35.40 ל-182 שעות), לכן קוצצים ולא מעגלים
    minimum = Math.floor((MINIMUM_WAGE_2026.monthly / hours) * 100) / 100;
  }
  minimum = round2(minimum);
  return {
    minimum,
    meets: amount + 1e-9 >= minimum,
    difference: round2(amount - minimum),
    effectiveFrom: MINIMUM_WAGE_2026.effectiveFrom,
  };
}
