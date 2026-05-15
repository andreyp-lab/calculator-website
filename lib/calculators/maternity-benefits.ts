/**
 * מחשבון דמי לידה - ביטוח לאומי 2026
 *
 * חוק עבודת נשים, התשי"ד-1954 + חוק הביטוח הלאומי (דמי לידה)
 *
 * מקור: btl.gov.il, עדכון: 2026-05-15
 */

// ============================================================
// קבועים 2026
// ============================================================

/** תקרת שכר יומית לחישוב דמי לידה (₪/יום) */
export const MATERNITY_DAILY_CAP_2026 = 1_730.33;

/** תקרה חודשית (= 5 × שכר ממוצע במשק) */
export const MATERNITY_MONTHLY_CAP_2026 = 51_910;

/** שכר ממוצע במשק 2026 */
export const AVERAGE_WAGE_2026 = 13_769;

/** שכר מינימום חודשי 2026 */
export const MIN_WAGE_2026 = 6_300;

/** שבועות חופשת לידה בסיסית (עובדת שעבדה 10+ מ-14 חודשים) */
export const FULL_LEAVE_WEEKS = 15;

/** ימי חופשת לידה בסיסית */
export const FULL_LEAVE_DAYS = 105;

/** שבועות חופשה מינימלית (עובדת שעבדה 6-10 מ-14 חודשים) */
export const MIN_LEAVE_WEEKS = 8;

/** ימי חופשה מינימלית */
export const MIN_LEAVE_DAYS = 56;

/** שבועות נוספים לכל ילד מעבר לראשון (תאומים ומעלה) */
export const MULTIPLE_BIRTH_EXTRA_WEEKS = 3;

/** ימים נוספים לכל ילד נוסף */
export const MULTIPLE_BIRTH_EXTRA_DAYS = 21;

/** ימי הארכה מקסימלית לאישפוז (20 שבועות) */
export const HOSPITALIZATION_MAX_EXTRA_DAYS = 140;

/** ימי אישפוז מינימליים להארכה */
export const HOSPITALIZATION_MIN_DAYS_FOR_EXTENSION = 7;

/** ימי הארכה לפגים (משקל מתחת ל-1.5 ק"ג) */
export const PREMATURE_EXTRA_DAYS = 21;

/** ימי הגנה על עבודה לאחר חזרה */
export const JOB_PROTECTION_DAYS_AFTER_RETURN = 60;

/** חודשים להגשת תביעה מיום הלידה */
export const CLAIM_DEADLINE_MONTHS = 12;

/** שעת הנקה — בשעות ביום (4 חודשים ראשונים) */
export const BREASTFEEDING_HOUR_MONTHS = 4;

/** שבועות חופשה לאב בתוך חופשת האם */
export const FATHER_LEAVE_WITHIN_MOTHER_WEEKS = 1; // 7 ימים אחרונים

/** ימים רצופים מינימליים לחופשת אב */
export const FATHER_MIN_CONSECUTIVE_DAYS = 5;

// ============================================================
// Types
// ============================================================

export type LeaveEligibility = 'full' | 'partial' | 'none';
export type EmploymentType = 'employee' | 'self_employed';

// ============================================================
// Interfaces — Input
// ============================================================

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

export interface EligibilityInput {
  /** חודשי עבודה מתוך 14 החודשים האחרונים */
  monthsWorkedInLast14: number;
  /** סוג העסקה */
  employmentType: EmploymentType;
  /** מספר ילדים בלידה */
  numberOfBabies: number;
  /** פג — משקל מתחת ל-1.5 ק"ג */
  isPremature: boolean;
  /** ימי אישפוז ילד (אחרי לידה) */
  hospitalizationDays: number;
}

export interface PayInput {
  /** שכר חודשי ממוצע ב-3 חודשים (₪) */
  avgSalary3Months: number;
  /** שכר חודשי ממוצע ב-6 חודשים (₪) — אופציונלי */
  avgSalary6Months?: number;
  /** מספר ימי חופשה שתוכחשב */
  leaveDays: number;
}

export interface FatherLeaveInput {
  /** האם האם זכאית לחופשה מלאה (15 שבועות) */
  motherFullLeaveEligible: boolean;
  /** שכר חודשי של האב (₪) */
  fatherMonthlySalary: number;
  /** שכר חודשי של האם (₪) */
  motherMonthlySalary: number;
  /** ימי חופשה שהאם תקח בעצמה (מהסוף יחקה האב) */
  motherLeaveDays: number;
}

export interface JobProtectionInput {
  /** תאריך לידה (ISO string) */
  birthDate: string;
  /** ימי חופשת לידה */
  leaveDays: number;
}

export interface BreastfeedingInput {
  /** שכר חודשי ברוטו (₪) */
  monthlySalary: number;
  /** שעות עבודה ביום */
  workHoursPerDay: number;
}

// ============================================================
// Interfaces — Result
// ============================================================

export interface MaternityBenefitsResult {
  dailyBenefit: number;
  totalDays: number;
  totalBenefit: number;
  effectiveMonthlySalary: number;
  cappedAtMaximum: boolean;
  warning?: string;
}

export interface EligibilityResult {
  /** רמת זכאות */
  eligibility: LeaveEligibility;
  /** ימי חופשה בתשלום */
  paidLeaveDays: number;
  /** שבועות חופשה בתשלום */
  paidLeaveWeeks: number;
  /** ימים נוספים מרובי עוברים */
  multipleBirthExtraDays: number;
  /** ימים נוספים מפגות */
  prematureExtraDays: number;
  /** ימים נוספים מאישפוז */
  hospitalizationExtraDays: number;
  /** סה"כ ימים כולל הארכות */
  totalDays: number;
  /** הסבר על הזכאות */
  explanation: string;
  /** האם זכאית לחופשה ארוכה (15 שב') */
  isFullEligibility: boolean;
  /** המלצות */
  recommendations: string[];
}

export interface PayResult {
  /** שכר קובע (הגבוה מ-3 או 6 חודשים) */
  effectiveMonthlySalary: number;
  /** האם נלקח חישוב 6 חודשים */
  used6MonthCalc: boolean;
  /** תשלום יומי */
  dailyBenefit: number;
  /** האם הגיע לתקרה */
  cappedAtMaximum: boolean;
  /** תשלום חודשי */
  monthlyBenefit: number;
  /** סה"כ תשלום לכל החופשה */
  totalBenefit: number;
  /** מס הכנסה — פטור */
  incomeTaxExempt: boolean;
  /** ביטוח לאומי על דמי לידה */
  nationalInsuranceAmount: number;
  /** נטו משוערך */
  estimatedNetBenefit: number;
  /** אזהרה */
  warning?: string;
  /** ימים מחושבים */
  leaveDays: number;
  /** מה הפסד שכר עודף מעל התקרה */
  excessLoss: number;
}

export interface FatherLeaveResult {
  /** ימי חופשה לאב */
  fatherLeaveDays: number;
  /** שבועות חופשה לאב */
  fatherLeaveWeeks: number;
  /** תשלום יומי לאב */
  fatherDailyBenefit: number;
  /** סה"כ תשלום לאב */
  fatherTotalBenefit: number;
  /** ימי חופשה לאם (הנותרים) */
  motherRemainingDays: number;
  /** חיסכון משפחתי (שניהם מרוויחים) */
  combinedBenefit: number;
  /** הסבר */
  explanation: string;
  /** המלצות */
  recommendations: string[];
}

export interface JobProtectionResult {
  /** תאריך סיום החופשה */
  leaveEndDate: string;
  /** תאריך סיום ההגנה (60 יום אחרי חזרה) */
  protectionEndDate: string;
  /** ימי הגנה מסיום החופשה */
  protectionDays: number;
  /** תקופות ציר הזמן */
  timeline: JobProtectionTimeline[];
  /** הגנה על שעת הנקה */
  breastfeedingProtection: string;
}

export interface JobProtectionTimeline {
  phase: string;
  startDate: string;
  endDate: string;
  description: string;
  isProtected: boolean;
}

export interface BreastfeedingResult {
  /** שווי שעת ההנקה ביום (₪) */
  dailyBreastfeedingValue: number;
  /** שווי חודשי (22 ימי עבודה) */
  monthlyBreastfeedingValue: number;
  /** שווי ל-4 חודשים */
  totalBreastfeedingValue: number;
  /** שכר שעתי */
  hourlyRate: number;
  /** הסבר */
  explanation: string;
}

export interface ComprehensiveResult {
  eligibility: EligibilityResult;
  pay: PayResult;
  fatherLeave: FatherLeaveResult | null;
  jobProtection: JobProtectionResult | null;
  breastfeeding: BreastfeedingResult;
}

// ============================================================
// Core Calculations
// ============================================================

/**
 * בדיקת זכאות לחופשת לידה בתשלום
 * חוק עבודת נשים + חוק הביטוח הלאומי
 */
export function calculateLeaveDuration(input: EligibilityInput): EligibilityResult {
  const { monthsWorkedInLast14, numberOfBabies, isPremature, hospitalizationDays } = input;

  let eligibility: LeaveEligibility;
  let baseDays: number;
  let explanation: string;

  if (monthsWorkedInLast14 >= 10) {
    eligibility = 'full';
    baseDays = FULL_LEAVE_DAYS;
    explanation = `עבדת ${monthsWorkedInLast14} חודשים מתוך 14 — זכאית לחופשה מלאה של ${FULL_LEAVE_WEEKS} שבועות (${FULL_LEAVE_DAYS} ימים).`;
  } else if (monthsWorkedInLast14 >= 6) {
    eligibility = 'partial';
    baseDays = MIN_LEAVE_DAYS;
    explanation = `עבדת ${monthsWorkedInLast14} חודשים מתוך 14 — זכאית לחופשה חלקית של ${MIN_LEAVE_WEEKS} שבועות (${MIN_LEAVE_DAYS} ימים). לחופשה מלאה נדרשים 10+ חודשים.`;
  } else {
    eligibility = 'none';
    baseDays = 0;
    explanation = `עבדת רק ${monthsWorkedInLast14} חודשים מתוך 14 — אינך זכאית לדמי לידה (נדרשים לפחות 6 חודשים).`;
  }

  // הארכות
  const multipleBirthExtraDays = numberOfBabies > 1
    ? (numberOfBabies - 1) * MULTIPLE_BIRTH_EXTRA_DAYS
    : 0;

  const prematureExtraDays = isPremature ? PREMATURE_EXTRA_DAYS : 0;

  const hospitalizationExtraDays = hospitalizationDays >= HOSPITALIZATION_MIN_DAYS_FOR_EXTENSION
    ? Math.min(hospitalizationDays, HOSPITALIZATION_MAX_EXTRA_DAYS)
    : 0;

  const totalDays = baseDays + multipleBirthExtraDays + prematureExtraDays + hospitalizationExtraDays;

  // המלצות
  const recommendations: string[] = [];
  if (eligibility === 'none') {
    recommendations.push('ניתן לבדוק זכאות לקצבת אמהות (שאינה תלויה בוותק) — פנייה לביטוח לאומי.');
  }
  if (eligibility === 'partial') {
    recommendations.push('אם צפויה לידה נוספת, כדאי להצטבר לפחות 10 חודשי עבודה בשנה לפני.');
  }
  if (numberOfBabies > 1) {
    recommendations.push(`תאומים / לידה מרובה: קיבלת +${multipleBirthExtraDays} ימים נוספים (${numberOfBabies - 1} × 3 שבועות).`);
  }
  if (isPremature) {
    recommendations.push(`לידה מוקדמת (פג): +${prematureExtraDays} ימים נוספים מגיעים לך.`);
  }
  if (hospitalizationExtraDays > 0) {
    recommendations.push(`אישפוז יילוד: +${hospitalizationExtraDays} ימים נוספים. הגש/י בקשה לב.ל. עם אישור בית חולים.`);
  }
  if (totalDays > 0) {
    recommendations.push(`הגישי תביעה תוך ${CLAIM_DEADLINE_MONTHS} חודשים מיום הלידה באתר ב.ל.`);
  }

  return {
    eligibility,
    paidLeaveDays: baseDays,
    paidLeaveWeeks: Math.round(baseDays / 7),
    multipleBirthExtraDays,
    prematureExtraDays,
    hospitalizationExtraDays,
    totalDays,
    explanation,
    isFullEligibility: eligibility === 'full',
    recommendations,
  };
}

/**
 * חישוב דמי לידה — שכר קובע, תשלום יומי, נטו
 * ב.ל. לוקח את הגבוה: ממוצע 3 חודשים OR ממוצע 6 חודשים
 */
export function calculateMaternityPay(input: PayInput): PayResult {
  const { avgSalary3Months, avgSalary6Months, leaveDays } = input;

  // שכר קובע — הגבוה מבין שני החישובים
  const salary3 = avgSalary3Months;
  const salary6 = avgSalary6Months ?? 0;
  const effectiveMonthlySalary = Math.max(salary3, salary6);
  const used6MonthCalc = salary6 > salary3;

  // תקרה חודשית
  const cappedMonthlySalary = Math.min(effectiveMonthlySalary, MATERNITY_MONTHLY_CAP_2026);
  const cappedAtMaximum = effectiveMonthlySalary >= MATERNITY_MONTHLY_CAP_2026;

  // תשלום יומי = שכר חודשי / 30
  const dailyBenefit = Math.min(cappedMonthlySalary / 30, MATERNITY_DAILY_CAP_2026);

  // תשלום חודשי (30 ימים)
  const monthlyBenefit = dailyBenefit * 30;

  // סה"כ תשלום לכל החופשה
  const totalBenefit = dailyBenefit * leaveDays;

  // מס הכנסה — דמי לידה פטורים לפי פקודת מס הכנסה סעיף 9(5)
  const incomeTaxExempt = true;

  // ביטוח לאומי — דמי לידה חייבים בדמי ביטוח לאומי (12%)
  // שיעור עובד: 3.5% עד פעם וחצי שכר ממוצע + 5% על יתרה
  // לצורך הערכה מהירה — 5% מקוצר
  const niRate = totalBenefit <= AVERAGE_WAGE_2026 * 1.5 * (leaveDays / 30) ? 0.035 : 0.05;
  const nationalInsuranceAmount = totalBenefit * niRate;

  // נטו משוערך (ללא מס הכנסה, עם ב.ל.)
  const estimatedNetBenefit = totalBenefit - nationalInsuranceAmount;

  // הפסד מעל התקרה
  const excessLoss = effectiveMonthlySalary > MATERNITY_MONTHLY_CAP_2026
    ? ((effectiveMonthlySalary - MATERNITY_MONTHLY_CAP_2026) / 30) * leaveDays
    : 0;

  let warning: string | undefined;
  if (cappedAtMaximum) {
    warning = `שכרך עולה על התקרה החודשית (${MATERNITY_MONTHLY_CAP_2026.toLocaleString('he-IL')} ₪). החישוב לפי התקרה. הפסד: ${Math.round(excessLoss).toLocaleString('he-IL')} ₪.`;
  }
  if (effectiveMonthlySalary < MIN_WAGE_2026 && effectiveMonthlySalary > 0) {
    warning = (warning ? warning + ' ' : '') + `שכרך נמוך משכר מינימום — בדקי עם ב.ל. אם יש תיקון.`;
  }

  return {
    effectiveMonthlySalary,
    used6MonthCalc,
    dailyBenefit,
    cappedAtMaximum,
    monthlyBenefit,
    totalBenefit,
    incomeTaxExempt,
    nationalInsuranceAmount,
    estimatedNetBenefit,
    warning,
    leaveDays,
    excessLoss,
  };
}

/**
 * חישוב ישן — שמור לתאימות לאחור
 * @deprecated Use calculateMaternityPay instead
 */
export function calculateMaternityBenefits(input: MaternityBenefitsInput): MaternityBenefitsResult {
  const monthlyBase = Math.max(
    input.recentMonthlySalary,
    input.sixMonthsAvgSalary ?? input.recentMonthlySalary,
  );

  let warning: string | undefined;
  let effective = Math.min(monthlyBase, MATERNITY_MONTHLY_CAP_2026);
  if (monthlyBase > MATERNITY_MONTHLY_CAP_2026) {
    warning = `שכר מעל התקרה החודשית - חישוב לפי ${MATERNITY_MONTHLY_CAP_2026.toLocaleString()} ₪`;
  }

  const dailyBenefit = Math.min(effective / 30, MATERNITY_DAILY_CAP_2026);
  const cappedAtMaximum = dailyBenefit >= MATERNITY_DAILY_CAP_2026;

  let totalDays = input.leaveDays;
  if (input.multipleBabies > 1) {
    totalDays += (input.multipleBabies - 1) * MULTIPLE_BIRTH_EXTRA_DAYS;
  }
  if (input.hospitalizationDays > 0) {
    totalDays += Math.min(input.hospitalizationDays, HOSPITALIZATION_MAX_EXTRA_DAYS);
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

/**
 * חישוב חופשת לידה לאב
 * האב רשאי לקחת את 7 הימים האחרונים של חופשת האם (אם האם זכאית ל-15 שבועות)
 * או 5 ימים רצופים מינימום
 */
export function calculateFatherLeave(input: FatherLeaveInput): FatherLeaveResult {
  const { motherFullLeaveEligible, fatherMonthlySalary, motherMonthlySalary, motherLeaveDays } = input;

  // האב יכול לקחת עד 7 ימים אחרונים של חופשת האם (אם היא זכאית לחופשה מלאה)
  const fatherMaxDays = motherFullLeaveEligible ? 7 : 0;

  // האם האב זכאי? צריך שהאם תיקח לפחות 3 שבועות (21 ימים) בעצמה
  const motherMinDaysRequired = 21;
  const motherActuallyTaking = Math.max(0, motherLeaveDays - fatherMaxDays);
  const fatherEligible = motherFullLeaveEligible && motherActuallyTaking >= motherMinDaysRequired;

  const fatherLeaveDays = fatherEligible ? fatherMaxDays : 0;
  const fatherLeaveWeeks = Math.floor(fatherLeaveDays / 7);

  // תשלום לאב — לפי שכר האב (אחד מהם מקבל, לא שניהם על אותם ימים)
  const fatherEffectiveSalary = Math.min(fatherMonthlySalary, MATERNITY_MONTHLY_CAP_2026);
  const fatherDailyBenefit = Math.min(fatherEffectiveSalary / 30, MATERNITY_DAILY_CAP_2026);
  const fatherTotalBenefit = fatherDailyBenefit * fatherLeaveDays;

  // האם נשארת עם כמה ימים?
  const motherRemainingDays = motherLeaveDays - fatherLeaveDays;

  // תועלת משפחתית — מה שהאב מקבל זה נוסף (כי האם לא הייתה מקבלת על הימים האלה)
  const motherDailyBenefit = Math.min(
    Math.min(motherMonthlySalary, MATERNITY_MONTHLY_CAP_2026) / 30,
    MATERNITY_DAILY_CAP_2026,
  );
  const combinedBenefit = fatherTotalBenefit + motherDailyBenefit * motherRemainingDays;

  const recommendations: string[] = [];
  if (!motherFullLeaveEligible) {
    recommendations.push('האב זכאי לחופשה רק אם האם זכאית לחופשה מלאה (15 שבועות).');
  }
  if (fatherEligible) {
    recommendations.push(`האב יכול לקחת ${fatherLeaveDays} ימים — כדאי לנצל! מביא ${Math.round(fatherTotalBenefit).toLocaleString('he-IL')} ₪ נוספים למשפחה.`);
    recommendations.push('חופשת האב חייבת להיות בתוך 7 הימים האחרונים של חופשת האם.');
    recommendations.push('האם חייבת לחזור לעבודה כשהאב בחופשה (אי אפשר שניהם ביחד על אותם ימים).');
  }
  if (fatherMonthlySalary > MATERNITY_MONTHLY_CAP_2026) {
    recommendations.push(`שכר האב עולה על התקרה (${MATERNITY_MONTHLY_CAP_2026.toLocaleString('he-IL')} ₪) — תשלום יוגבל לתקרה.`);
  }

  const explanation = fatherEligible
    ? `האב זכאי לקחת את ${fatherLeaveDays} הימים האחרונים של חופשת האם. בתקופה זו האם חוזרת לעבודה והאב מקבל דמי לידה לפי שכרו.`
    : motherFullLeaveEligible
      ? `כדי שהאב יוכל לקחת חופשה, האם חייבת לקחת לפחות ${motherMinDaysRequired} ימים בעצמה.`
      : 'האב אינו זכאי לחופשת לידה כי האם אינה זכאית לחופשה מלאה.';

  return {
    fatherLeaveDays,
    fatherLeaveWeeks,
    fatherDailyBenefit,
    fatherTotalBenefit,
    motherRemainingDays,
    combinedBenefit,
    explanation,
    recommendations,
  };
}

/**
 * חישוב ציר זמן הגנת המשרה
 * לא ניתן לפטר אם עובדת במהלך חופשת לידה + 60 יום אחרי חזרה
 */
export function calculateJobProtection(input: JobProtectionInput): JobProtectionResult {
  const birth = new Date(input.birthDate);

  const leaveEnd = new Date(birth);
  leaveEnd.setDate(leaveEnd.getDate() + input.leaveDays);

  const protectionEnd = new Date(leaveEnd);
  protectionEnd.setDate(protectionEnd.getDate() + JOB_PROTECTION_DAYS_AFTER_RETURN);

  const fmt = (d: Date) => d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // שעת הנקה — 4 חודשים אחרי חזרה
  const breastfeedingEnd = new Date(leaveEnd);
  breastfeedingEnd.setMonth(breastfeedingEnd.getMonth() + BREASTFEEDING_HOUR_MONTHS);

  const timeline: JobProtectionTimeline[] = [
    {
      phase: 'חופשת לידה',
      startDate: fmt(birth),
      endDate: fmt(leaveEnd),
      description: `${input.leaveDays} ימי חופשה — אסור לפטר, אסור לשנות תנאים`,
      isProtected: true,
    },
    {
      phase: 'הגנה אחרי חזרה',
      startDate: fmt(leaveEnd),
      endDate: fmt(protectionEnd),
      description: `${JOB_PROTECTION_DAYS_AFTER_RETURN} ימים — אסור לפטר ללא אישור שר העבודה`,
      isProtected: true,
    },
    {
      phase: 'שעת הנקה',
      startDate: fmt(leaveEnd),
      endDate: fmt(breastfeedingEnd),
      description: `${BREASTFEEDING_HOUR_MONTHS} חודשים — שעה ביום ללא ניכוי שכר`,
      isProtected: true,
    },
  ];

  return {
    leaveEndDate: fmt(leaveEnd),
    protectionEndDate: fmt(protectionEnd),
    protectionDays: JOB_PROTECTION_DAYS_AFTER_RETURN,
    timeline,
    breastfeedingProtection: `שעת הנקה מגיעה לך עד ${fmt(breastfeedingEnd)} (${BREASTFEEDING_HOUR_MONTHS} חודשים אחרי החזרה)`,
  };
}

/**
 * חישוב ערך שעת ההנקה
 * עובדת זכאית לשעה אחת בתשלום ביום לצורך הנקה — 4 חודשים ראשונים אחרי חזרה
 */
export function calculateBreastfeedingValue(input: BreastfeedingInput): BreastfeedingResult {
  const { monthlySalary, workHoursPerDay } = input;

  // שכר שעתי = שכר חודשי / (22 ימים × שעות ביום)
  const workDaysPerMonth = 22;
  const hourlyRate = monthlySalary / (workDaysPerMonth * workHoursPerDay);

  // שווי שעה ביום
  const dailyBreastfeedingValue = hourlyRate;

  // שווי חודשי (22 ימי עבודה)
  const monthlyBreastfeedingValue = hourlyRate * workDaysPerMonth;

  // שווי ל-4 חודשים
  const totalBreastfeedingValue = monthlyBreastfeedingValue * BREASTFEEDING_HOUR_MONTHS;

  const explanation =
    `שכר שעתי: ${Math.round(hourlyRate).toLocaleString('he-IL')} ₪. ` +
    `שעת הנקה ביום שווה ${Math.round(monthlyBreastfeedingValue).toLocaleString('he-IL')} ₪/חודש — ` +
    `סה"כ ${Math.round(totalBreastfeedingValue).toLocaleString('he-IL')} ₪ ל-${BREASTFEEDING_HOUR_MONTHS} חודשים.`;

  return {
    dailyBreastfeedingValue,
    monthlyBreastfeedingValue,
    totalBreastfeedingValue,
    hourlyRate,
    explanation,
  };
}

/**
 * חישוב השוואה: אישפוז בבית חולים vs. חזרה מוקדמת הביתה
 * (כשהיילוד מאושפז)
 */
export interface HospitalVsHomeResult {
  /** תרחיש 1: נשארת בבית חולים ומרחיבה חופשה */
  hospitalScenario: {
    totalLeaveDays: number;
    totalBenefit: number;
    description: string;
  };
  /** תרחיש 2: יוצאת לחופשה רגילה ועובדת אחר כך */
  homeScenario: {
    totalLeaveDays: number;
    totalBenefit: number;
    description: string;
  };
  /** הפרש */
  difference: number;
  /** המלצה */
  recommendation: string;
}

export function calculateHospitalVsHome(
  dailyBenefit: number,
  regularLeaveDays: number,
  hospitalizationDays: number,
  monthlySalaryForReturn: number,
): HospitalVsHomeResult {
  // תרחיש אישפוז: ממשיכה בחופשה + ימי אישפוז
  const extraDays = Math.min(hospitalizationDays, HOSPITALIZATION_MAX_EXTRA_DAYS);
  const hospitalTotalDays = regularLeaveDays + extraDays;
  const hospitalBenefit = dailyBenefit * hospitalTotalDays;

  // תרחיש ביתי: לוקחת חופשה רגילה, עובדת בזמן שהילד מאושפז
  const homeReturnSalary = monthlySalaryForReturn;
  const homeBenefit = dailyBenefit * regularLeaveDays + (homeReturnSalary / 30) * hospitalizationDays;

  const difference = hospitalBenefit - homeBenefit;

  return {
    hospitalScenario: {
      totalLeaveDays: hospitalTotalDays,
      totalBenefit: hospitalBenefit,
      description: `ממשיכה בחופשת לידה ${regularLeaveDays} ימים + ${extraDays} ימי הארכה לאישפוז = ${hospitalTotalDays} ימים`,
    },
    homeScenario: {
      totalLeaveDays: regularLeaveDays,
      totalBenefit: homeBenefit,
      description: `חופשה ${regularLeaveDays} ימים + חזרה לעבודה בזמן אישפוז (${hospitalizationDays} ימים × שכר)`,
    },
    difference,
    recommendation:
      difference > 0
        ? `עדיף להרחיב את החופשה — רווח של ${Math.round(difference).toLocaleString('he-IL')} ₪ לעומת חזרה לעבודה.`
        : difference < 0
          ? `עדיף לחזור לעבודה — שכרך גבוה מדמי הלידה. חיסכון: ${Math.round(Math.abs(difference)).toLocaleString('he-IL')} ₪.`
          : 'אין הבדל — בחרי לפי הנוחות שלך.',
  };
}
