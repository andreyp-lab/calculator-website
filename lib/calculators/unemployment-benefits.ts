/**
 * מחשבון דמי אבטלה - ביטוח לאומי 2026
 *
 * זכאות:
 * - חבר אגודה: 12 חודשי תשלומי ב.ל. ב-18 חודשים אחרונים
 * - בני 20-67
 * - לא מעבד עצמאי
 *
 * חישוב:
 * - שכר ממוצע יומי ב-6 חודשים אחרונים
 * - תקרה יומית: 550.76 ₪ (2026) ל-125 ימי תשלום ראשונים
 * - מהיום ה-126 ואילך: 367.17 ₪ (2/3)
 *
 * שיעורים מדורגים:
 * - שכר עד 60% מהשכר הממוצע: 80% מהשכר
 * - שכר 60-80% מהשכר הממוצע: 60%
 * - שכר 80%+ מהשכר הממוצע: 50%
 *
 * תקופת זכאות:
 * - בני 20-25 ללא ילדים: 67 ימים
 * - בני 25-28: 100 ימים
 * - 28-35: 138 ימים
 * - 35+ עם ילדים: 175 ימים
 * - 45+: 175 ימים
 *
 * מקור: ביטוח לאומי, btl.gov.il
 */

export interface UnemploymentBenefitsInput {
  /** שכר ברוטו ממוצע 6 חודשים אחרונים (₪/חודש) */
  averageMonthlySalary: number;
  /** גיל */
  age: number;
  /** האם יש ילדים מתחת לגיל 18 */
  hasChildren: boolean;
  /** מספר ימי עבודה ב-18 חודשים אחרונים (לזכאות) */
  workDaysIn18Months: number;
}

export interface UnemploymentBenefitsResult {
  isEligible: boolean;
  dailyBenefit: number;
  reducedDailyBenefit: number; // מהיום ה-126
  maxDays: number;
  totalEstimate: number;
  averageWageBracket: string;
  benefitRate: number;
  notes: string[];
}

const AVERAGE_WAGE_2026 = 13_769; // שכר ממוצע במשק
const DAILY_CAP_FIRST_125 = 550.76;
const DAILY_CAP_AFTER_125 = 367.17;
const MIN_WORK_DAYS_FOR_ELIGIBILITY = 360; // 12 חודשי × 30

export function calculateUnemploymentBenefits(
  input: UnemploymentBenefitsInput,
): UnemploymentBenefitsResult {
  const notes: string[] = [];

  // 1. בדיקת זכאות
  if (input.workDaysIn18Months < MIN_WORK_DAYS_FOR_ELIGIBILITY) {
    notes.push('לא צבר מספיק ימי עבודה (נדרש 360 לפחות)');
  }
  if (input.age < 20 || input.age > 67) {
    notes.push('הגיל אינו בטווח הזכאות (20-67)');
  }

  const isEligible =
    input.workDaysIn18Months >= MIN_WORK_DAYS_FOR_ELIGIBILITY &&
    input.age >= 20 &&
    input.age <= 67;

  if (!isEligible) {
    return {
      isEligible: false,
      dailyBenefit: 0,
      reducedDailyBenefit: 0,
      maxDays: 0,
      totalEstimate: 0,
      averageWageBracket: '',
      benefitRate: 0,
      notes,
    };
  }

  // 2. חישוב שיעור (לפי מדרגת השכר ביחס לשכר הממוצע)
  const wageRatio = input.averageMonthlySalary / AVERAGE_WAGE_2026;
  let benefitRate = 0.5;
  let bracket = 'מעל 80% מהשכר הממוצע';

  if (wageRatio <= 0.6) {
    benefitRate = 0.8;
    bracket = 'עד 60% מהשכר הממוצע';
  } else if (wageRatio <= 0.8) {
    benefitRate = 0.6;
    bracket = '60-80% מהשכר הממוצע';
  }

  // 3. תשלום יומי
  const dailySalary = input.averageMonthlySalary / 30;
  const computedDaily = dailySalary * benefitRate;
  const dailyBenefit = Math.min(computedDaily, DAILY_CAP_FIRST_125);
  const reducedDailyBenefit = Math.min(computedDaily * (2 / 3), DAILY_CAP_AFTER_125);

  // 4. תקופת זכאות
  let maxDays = 67;
  if (input.age >= 45) maxDays = 175;
  else if (input.age >= 35 && input.hasChildren) maxDays = 175;
  else if (input.age >= 28) maxDays = 138;
  else if (input.age >= 25) maxDays = 100;

  // 5. סה"כ משוער
  const first125 = Math.min(maxDays, 125);
  const after125 = Math.max(0, maxDays - 125);
  const totalEstimate = first125 * dailyBenefit + after125 * reducedDailyBenefit;

  if (input.averageMonthlySalary * (DAILY_CAP_FIRST_125 / dailySalary) >= DAILY_CAP_FIRST_125) {
    notes.push(`התשלום מוגבל לתקרה יומית: ${DAILY_CAP_FIRST_125} ₪`);
  }

  notes.push(`תקופת הזכאות: ${maxDays} ימים בהתאם לגיל ולמצב משפחתי`);

  return {
    isEligible: true,
    dailyBenefit,
    reducedDailyBenefit,
    maxDays,
    totalEstimate,
    averageWageBracket: bracket,
    benefitRate,
    notes,
  };
}
