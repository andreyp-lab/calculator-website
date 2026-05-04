/**
 * מחשבון "מה שווה לי לעבוד?" - השוואת שכר לקצבאות אלטרנטיביות
 *
 * רלוונטי במצבים:
 * - אישה בחופשת לידה (שכר vs דמי לידה)
 * - אדם מובטל (שכר vs דמי אבטלה)
 * - חולה (שכר vs דמי מחלה)
 * - בעל עסק שוקל לסגור (שכר vs קצבת זקנה)
 *
 * ההשוואה לוקחת בחשבון:
 * - הכנסה ברוטו vs נטו אחרי מס
 * - חיסכון פנסיוני (אובד אם לא עובד)
 * - הוצאות עבודה: נסיעות, ביגוד, אוכל, מעון
 * - שעות זמן (לא רק כסף)
 *
 * נוסחה:
 * שווי שעת עבודה אמיתי =
 * (נטו - הוצאות עבודה - אובדן הטבות) / שעות עבודה (כולל זמני נסיעה)
 */

export interface WorkValueInput {
  /** שכר ברוטו חודשי (₪) */
  monthlyGrossSalary: number;
  /** שעות עבודה חודשיות (לא כולל נסיעה) */
  monthlyWorkHours: number;
  /** שעות נסיעה חודשיות */
  monthlyCommutingHours: number;
  /** קצבה / הכנסה אלטרנטיבית (אם לא יעבוד) - ₪/חודש */
  alternativeBenefit: number;

  // הוצאות עבודה
  /** הוצאות נסיעה לעבודה (₪/חודש) */
  commutingCost: number;
  /** מעון/פעוטון (₪/חודש) */
  childcareCost: number;
  /** ביגוד מקצועי / כביסות / מספרה (₪/חודש) */
  workClothing: number;
  /** ארוחות בעבודה (₪/חודש) */
  workMeals: number;
  /** הוצאות נוספות (₪/חודש) */
  otherWorkExpenses: number;

  // הטבות עבודה
  /** הפקדות מעסיק לפנסיה (₪/חודש) */
  employerPensionContribution: number;
  /** קרן השתלמות מעסיק (₪/חודש) */
  employerStudyFundContribution: number;
  /** הטבות נוספות (ארוחות, רכב, וכו' - ₪/חודש) */
  otherBenefits: number;
}

export interface WorkValueResult {
  /** נטו מהשכר (משוער) */
  estimatedNetSalary: number;
  /** ערך הטבות מעסיק (פנסיה + ק.ה. + הטבות) */
  totalEmployerBenefits: number;
  /** הוצאות עבודה כוללות */
  totalWorkExpenses: number;
  /** הכנסה פנויה מעבודה */
  effectiveTakeHome: number;
  /** הפרש מול האלטרנטיבה */
  differenceVsAlternative: number;
  /** סך שעות מקבילות (עבודה + נסיעה) */
  totalEffectiveHours: number;
  /** שווי שעת עבודה אמיתי (₪) */
  effectiveHourlyWage: number;
  /** האם משתלם לעבוד */
  isWorthWorking: boolean;
  /** המלצה */
  recommendation: string;
}

export function calculateWorkValue(input: WorkValueInput): WorkValueResult {
  // אומדן נטו (פשטני - 65% מהברוטו)
  // למעשה לפי מדרגות, אבל זו הערכה מהירה
  const estimatedTaxRate = input.monthlyGrossSalary > 25_000 ? 0.45 : 0.30;
  const estimatedNetSalary = input.monthlyGrossSalary * (1 - estimatedTaxRate);

  // הטבות מעסיק
  const totalEmployerBenefits =
    input.employerPensionContribution +
    input.employerStudyFundContribution +
    input.otherBenefits;

  // הוצאות עבודה
  const totalWorkExpenses =
    input.commutingCost +
    input.childcareCost +
    input.workClothing +
    input.workMeals +
    input.otherWorkExpenses;

  // הכנסה אפקטיבית מעבודה (נטו + הטבות - הוצאות)
  const effectiveTakeHome = estimatedNetSalary + totalEmployerBenefits - totalWorkExpenses;

  // הפרש מול האלטרנטיבה
  const differenceVsAlternative = effectiveTakeHome - input.alternativeBenefit;

  // שעות אפקטיביות
  const totalEffectiveHours = input.monthlyWorkHours + input.monthlyCommutingHours;

  // שווי שעה
  const effectiveHourlyWage =
    totalEffectiveHours > 0 ? effectiveTakeHome / totalEffectiveHours : 0;

  // ההמלצה
  let recommendation = '';
  let isWorthWorking = differenceVsAlternative > 0;

  if (differenceVsAlternative <= 0) {
    isWorthWorking = false;
    recommendation = `העבודה לא משתלמת - האלטרנטיבה מניבה ${Math.abs(differenceVsAlternative).toFixed(0)} ₪ יותר. שקול לוותר על העבודה או לדרוש שכר גבוה יותר.`;
  } else if (effectiveHourlyWage < 30) {
    recommendation = `שווי שעה אפקטיבי נמוך מאוד (${effectiveHourlyWage.toFixed(0)} ₪/שעה). העבודה משתלמת מעט מהאלטרנטיבה.`;
  } else if (effectiveHourlyWage < 60) {
    recommendation = `שווי שעה סביר (${effectiveHourlyWage.toFixed(0)} ₪/שעה). העבודה משתלמת מעבר לקצבה.`;
  } else {
    recommendation = `שווי שעה טוב (${effectiveHourlyWage.toFixed(0)} ₪/שעה). העבודה משתלמת בבירור.`;
  }

  return {
    estimatedNetSalary,
    totalEmployerBenefits,
    totalWorkExpenses,
    effectiveTakeHome,
    differenceVsAlternative,
    totalEffectiveHours,
    effectiveHourlyWage,
    isWorthWorking,
    recommendation,
  };
}
