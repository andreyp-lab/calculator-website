/**
 * מחשבון דמי לידה - ביטוח לאומי 2026
 *
 * דמי לידה משולמים לאם עובדת על תקופת חופשת לידה (15 שבועות חופשת לידה
 * + הארכות אפשריות).
 *
 * חישוב:
 * - שכר ממוצע ב-3 חודשים שלפני הלידה (או 6 חודשים אם זה גבוה יותר)
 * - מחולק ב-90 → תשלום יומי
 * - תקרה יומית: 1,730.33 ₪/יום (2026)
 * - תקרה חודשית מקסימלית: 51,910 ₪
 *
 * חופשת לידה רגילה: 15 שבועות (105 ימים)
 * - 7 שבועות לפני הלידה (אופציונלי)
 * - 8 שבועות אחרי הלידה (חובה)
 *
 * הארכות:
 * - לידה מרובת עוברים: +3 שבועות לכל ילד נוסף
 * - אישפוז יילוד: +עד 20 שבועות
 *
 * מקור: ביטוח לאומי, btl.gov.il
 */

export interface MaternityBenefitsInput {
  /** שכר חודשי ב-3 חודשים שלפני הלידה (₪) */
  recentMonthlySalary: number;
  /** שכר חודשי ב-6 חודשים שלפני הלידה (₪) - אופציונלי */
  sixMonthsAvgSalary?: number;
  /** מספר ימי חופשת לידה (ברירת מחדל 105) */
  leaveDays: number;
  /** האם תאומים/שלישיה */
  multipleBabies: number;
  /** האם הילד אושפז (חודשים נוספים אם כן) */
  hospitalizationDays: number;
}

export interface MaternityBenefitsResult {
  dailyBenefit: number;
  totalDays: number;
  totalBenefit: number;
  effectiveMonthlySalary: number;
  cappedAtMaximum: boolean;
  warning?: string;
}

const DAILY_CAP_2026 = 1_730.33;
const MONTHLY_CAP_2026 = 51_910;

export function calculateMaternityBenefits(input: MaternityBenefitsInput): MaternityBenefitsResult {
  // השכר הקובע - הגבוה מבין שני החישובים
  const monthlyBase = Math.max(
    input.recentMonthlySalary,
    input.sixMonthsAvgSalary ?? input.recentMonthlySalary,
  );

  let warning: string | undefined;

  // תקרה חודשית
  let effective = Math.min(monthlyBase, MONTHLY_CAP_2026);
  if (monthlyBase > MONTHLY_CAP_2026) {
    warning = `שכר מעל התקרה החודשית - חישוב לפי ${MONTHLY_CAP_2026.toLocaleString()} ₪`;
  }

  // תשלום יומי = שכר / 30 (לא 90 - 30 ימי חודש)
  const dailyBenefit = Math.min(effective / 30, DAILY_CAP_2026);
  const cappedAtMaximum = dailyBenefit >= DAILY_CAP_2026;

  // ימי חופשה כוללים
  let totalDays = input.leaveDays;
  if (input.multipleBabies > 1) {
    totalDays += (input.multipleBabies - 1) * 21; // +3 שבועות לכל ילד נוסף
  }
  if (input.hospitalizationDays > 0) {
    totalDays += Math.min(input.hospitalizationDays, 140); // עד 20 שבועות נוספים
  }

  const totalBenefit = dailyBenefit * totalDays;

  return {
    dailyBenefit,
    totalDays,
    totalBenefit,
    effectiveMonthlySalary: effective,
    cappedAtMaximum,
    warning,
  };
}
