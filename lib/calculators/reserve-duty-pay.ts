/**
 * מחשבון תגמולי מילואים - ביטוח לאומי 2026
 *
 * מחשב תגמולי מילואים בסיסיים + מענקי חרבות ברזל + החזר מעסיק + הגנת הכנסה
 *
 * מקורות:
 * - ביטוח לאומי: https://www.btl.gov.il/benefits/Reserve_Service
 * - אגף המילואים: https://www.miluim.idf.il/
 * - חוק שירות המילואים תשס"ח-2008
 * - תיקון מס' 65 לחוק ביטוח לאומי (חרבות ברזל)
 */

// ============================================================
// Types
// ============================================================

export type EmploymentStatus = 'employee' | 'self-employed' | 'unemployed';
export type SalaryBasisPeriod = '3months' | '12months' | 'prewar';
export type CombatRole = 'none' | 'combat' | 'combat_support' | 'support';

export interface ReserveDutyInput {
  /** סטטוס תעסוקתי */
  employmentStatus: EmploymentStatus;
  /** שכר חודשי ב-3 חודשים שלפני המילואים (₪) */
  recentMonthlySalary: number;
  /** שכר חודשי ממוצע 12 חודשים (₪) - לחישוב אלטרנטיבי */
  salary12Months?: number;
  /** שכר חודשי לפני המלחמה (₪) - לחישוב הגנת הכנסה */
  preWarSalary?: number;
  /** בסיס חישוב השכר */
  salaryBasis?: SalaryBasisPeriod;
  /** ימי מילואים בתקופה */
  reserveDays: number;
  /** תאריך תחילת שירות (YYYY-MM-DD) */
  serviceStartDate?: string;
  /** האם שירות במסגרת חרבות ברזל (אחרי 7.10.2023) */
  isIronSwordsService?: boolean;
  /**
   * @deprecated Use isIronSwordsService instead
   * backward compat with old API
   */
  eligibleForSpecialGrants?: boolean;
  /** תפקיד קרבי */
  combatRole?: CombatRole;
  /** מספר ילדים תלויים */
  dependentChildren?: number;
  /** האם יש בן/בת זוג */
  hasSpouse?: boolean;
  /** האם בן/בת זוג עובד/ת */
  spouseWorks?: boolean;
  /** היקף משרה (%) */
  partTimePercent?: number;
  /** האם עסק עצמאי - עסק קטן (עד 20 עובדים) */
  isSmallBusiness?: boolean;
  /** האם מעסיק ממשיך לשלם שכר רגיל בזמן המילואים */
  employerContinuesPaying?: boolean;
}

export interface WarBonuses {
  /** מענק כללי חרבות ברזל (5,000 ₪ חד-פעמי) */
  generalGrant: number;
  /** מענק יומי חרבות ברזל (280 ₪/יום) */
  dailyGrant: number;
  /** סך מענק יומי כולל */
  totalDailyGrant: number;
  /** מענק חזרה למקום עבודה (5,000 ₪) */
  returnToWorkGrant: number;
  /** מענק תפקיד קרבי */
  combatRoleGrant: number;
  /** סך כל המענקים */
  totalGrants: number;
  /** האם פטורים ממס */
  taxExempt: boolean;
}

export interface EmployerReimbursement {
  /** שכר שהמעסיק ממשיך לשלם בזמן מילואים */
  employerPaidDuringService: number;
  /** החזר שהמעסיק מקבל מב.ל. */
  blReimbursementToEmployer: number;
  /** עלות נטו למעסיק (אחרי החזר) */
  netCostToEmployer: number;
  /** פירוט: שכר ישיר מב.ל. לעובד */
  directBLPaymentToEmployee: number;
}

export interface FamilyAllowances {
  /** קצבת ילדים בתקופת מילואים (מעל 30 יום) */
  childAllowance: number;
  /** פרטי קצבה לבן/בת זוג שאינו עובד */
  spouseAllowance: number;
  /** סך קצבות משפחה */
  totalFamilyAllowances: number;
  /** הערה */
  note: string;
}

export interface IncomeLossProtection {
  /** שכר רגיל לתקופה */
  regularSalaryForPeriod: number;
  /** תגמולי מילואים (בסיסי בלבד) */
  reservePayForPeriod: number;
  /** הפרש - הפסד/רווח */
  incomeDifference: number;
  /** האם יש פגיעה בהכנסה */
  hasIncomeLoss: boolean;
  /** אחוז פיצוי מהשכר הרגיל */
  compensationPercent: number;
}

export interface MonthlyProjection {
  month: string;
  reserveDays: number;
  basicPay: number;
  warBonus: number;
  total: number;
}

export interface ReserveDutyResult {
  /** תשלום יומי בסיסי (לאחר תקרה/רצפה) */
  dailyPayment: number;
  /** תשלום בסיסי כולל */
  totalBasicPayment: number;
  /** מענקי חרבות ברזל */
  warBonuses: WarBonuses;
  /** החזר מעסיק */
  employerReimbursement: EmployerReimbursement;
  /** קצבות משפחה */
  familyAllowances: FamilyAllowances;
  /** הגנת הכנסה */
  incomeLossProtection: IncomeLossProtection;
  /** תגמול כולל (ללא מענקים חד-פעמיים) */
  totalCompensation: number;
  /** תגמול כולל עם מענקים חד-פעמיים */
  totalWithOneTimeGrants: number;
  /** נקודת זיכוי מס שנתית */
  taxCreditPoints: number;
  /** שווי נקודת זיכוי מס (₪) */
  taxCreditValue: number;
  /** האם עבר תקרה */
  cappedAtMaximum: boolean;
  /** האם קיבל מינימום */
  atMinimum: boolean;
  /** הערות */
  notes: string[];
  /** תחזית חודשית */
  monthlyProjection: MonthlyProjection[];
  /**
   * @deprecated Use warBonuses.totalDailyGrant instead — backward compat
   */
  totalSpecialGrant: number;
  /**
   * @deprecated Use warBonuses.dailyGrant instead — backward compat
   */
  specialGrantPerDay: number;
}

// ============================================================
// Constants 2026
// ============================================================

export const RESERVE_PAY_2026 = {
  /** תקרה יומית ב.ל. 2026 */
  DAILY_CAP: 1_730.33,
  /** תקרה חודשית ב.ל. 2026 */
  MONTHLY_CAP: 51_910,
  /** מינימום יומי (שכר מינימום / 30) */
  MIN_DAILY: 219.0,
  /** שכר מינימום חודשי 2026 */
  MIN_MONTHLY: 6_570,
  /** נקודת זיכוי מס (₪ לשנה) */
  TAX_CREDIT_POINT_VALUE: 2_904,
  /** ימים לחישוב יומי */
  DAYS_IN_MONTH: 30,
} as const;

export const IRON_SWORDS_BONUSES = {
  /** מענק כללי חד-פעמי (חרבות ברזל) */
  GENERAL_GRANT: 5_000,
  /** מענק יומי (₪/יום) */
  DAILY_GRANT: 280,
  /** מענק חזרה למקום עבודה */
  RETURN_TO_WORK_GRANT: 5_000,
  /** מענק תפקיד קרבי (₪/יום נוסף) */
  COMBAT_DAILY_BONUS: 100,
  /** מענק חבילה לעסק קטן */
  SMALL_BUSINESS_GRANT: 10_700,
  /** מינימום ימים לזכאות למענק כללי */
  MIN_DAYS_FOR_GENERAL_GRANT: 1,
  /** מינימום ימים לזכאות למענק חזרה */
  MIN_DAYS_FOR_RETURN_GRANT: 20,
} as const;

export const FAMILY_ALLOWANCES_2026 = {
  /** קצבה לילד בגיל 0-14 (₪/יום) */
  CHILD_PER_DAY: 30,
  /** קצבה לבן/בת זוג שאינו/ה עובד/ת (₪/יום) */
  NON_WORKING_SPOUSE_PER_DAY: 45,
  /** מינימום ימים לזכאות לקצבות משפחה */
  MIN_DAYS_FOR_FAMILY_ALLOWANCE: 30,
} as const;

// ============================================================
// Core Calculation Functions
// ============================================================

/**
 * חישוב שכר יומי בסיסי
 */
export function calculateDailyPay(
  employmentStatus: EmploymentStatus,
  monthlySalary: number,
  partTimePercent = 100,
): { dailyPay: number; cappedAtMaximum: boolean; atMinimum: boolean } {
  let rawDaily: number;

  if (employmentStatus === 'unemployed') {
    rawDaily = RESERVE_PAY_2026.MIN_DAILY;
  } else {
    const adjustedSalary = monthlySalary * (partTimePercent / 100);
    rawDaily = adjustedSalary / RESERVE_PAY_2026.DAYS_IN_MONTH;
  }

  const atMinimum = rawDaily < RESERVE_PAY_2026.MIN_DAILY;
  const cappedAtMaximum = rawDaily > RESERVE_PAY_2026.DAILY_CAP;

  const dailyPay = Math.min(
    Math.max(rawDaily, RESERVE_PAY_2026.MIN_DAILY),
    RESERVE_PAY_2026.DAILY_CAP,
  );

  return { dailyPay, cappedAtMaximum, atMinimum };
}

/**
 * חישוב מענקי חרבות ברזל
 */
export function calculateWarBonuses(
  reserveDays: number,
  isIronSwordsService: boolean,
  combatRole: CombatRole,
  employmentStatus: EmploymentStatus,
  isSmallBusiness: boolean,
): WarBonuses {
  if (!isIronSwordsService) {
    return {
      generalGrant: 0,
      dailyGrant: 0,
      totalDailyGrant: 0,
      returnToWorkGrant: 0,
      combatRoleGrant: 0,
      totalGrants: 0,
      taxExempt: true,
    };
  }

  // מענק כללי - חד פעמי לכל מי ששירת מאז 7.10.2023
  const generalGrant =
    reserveDays >= IRON_SWORDS_BONUSES.MIN_DAYS_FOR_GENERAL_GRANT
      ? IRON_SWORDS_BONUSES.GENERAL_GRANT
      : 0;

  // מענק יומי - 280 ₪/יום
  const totalDailyGrant = IRON_SWORDS_BONUSES.DAILY_GRANT * reserveDays;

  // מענק חזרה למקום עבודה - רק לשכירים שחזרו לעבוד (לפחות 20 ימי מילואים)
  const returnToWorkGrant =
    employmentStatus === 'employee' &&
    reserveDays >= IRON_SWORDS_BONUSES.MIN_DAYS_FOR_RETURN_GRANT
      ? IRON_SWORDS_BONUSES.RETURN_TO_WORK_GRANT
      : 0;

  // מענק תפקיד קרבי
  let combatRoleGrant = 0;
  if (combatRole === 'combat') {
    combatRoleGrant = IRON_SWORDS_BONUSES.COMBAT_DAILY_BONUS * reserveDays;
  } else if (combatRole === 'combat_support') {
    combatRoleGrant = Math.round(IRON_SWORDS_BONUSES.COMBAT_DAILY_BONUS * 0.5 * reserveDays);
  }

  const totalGrants =
    generalGrant + totalDailyGrant + returnToWorkGrant + combatRoleGrant;

  return {
    generalGrant,
    dailyGrant: IRON_SWORDS_BONUSES.DAILY_GRANT,
    totalDailyGrant,
    returnToWorkGrant,
    combatRoleGrant,
    totalGrants,
    taxExempt: true, // מענקי חרבות ברזל פטורים ממס
  };
}

/**
 * חישוב החזר מעסיק מב.ל.
 */
export function calculateEmployerReimbursement(
  dailyPayment: number,
  reserveDays: number,
  monthlySalary: number,
  employerContinuesPaying: boolean,
  employmentStatus: EmploymentStatus,
): EmployerReimbursement {
  const regularDailySalary = monthlySalary / RESERVE_PAY_2026.DAYS_IN_MONTH;
  const blPayment = dailyPayment * reserveDays;

  if (!employerContinuesPaying || employmentStatus !== 'employee') {
    return {
      employerPaidDuringService: 0,
      blReimbursementToEmployer: 0,
      netCostToEmployer: 0,
      directBLPaymentToEmployee: blPayment,
    };
  }

  // המעסיק ממשיך לשלם שכר רגיל ומקבל החזר מב.ל.
  const employerPaidDuringService = regularDailySalary * reserveDays;
  const blReimbursementToEmployer = blPayment; // ב.ל. מחזיר עד גובה תגמול המילואים
  const netCostToEmployer = Math.max(0, employerPaidDuringService - blReimbursementToEmployer);

  return {
    employerPaidDuringService,
    blReimbursementToEmployer,
    netCostToEmployer,
    directBLPaymentToEmployee: 0, // מקבל מהמעסיק ישירות
  };
}

/**
 * חישוב קצבות משפחה במילואים
 */
export function calculateFamilyAllowances(
  reserveDays: number,
  dependentChildren: number,
  hasSpouse: boolean,
  spouseWorks: boolean,
): FamilyAllowances {
  if (reserveDays < FAMILY_ALLOWANCES_2026.MIN_DAYS_FOR_FAMILY_ALLOWANCE) {
    return {
      childAllowance: 0,
      spouseAllowance: 0,
      totalFamilyAllowances: 0,
      note: `קצבות משפחה מחייבות מינימום ${FAMILY_ALLOWANCES_2026.MIN_DAYS_FOR_FAMILY_ALLOWANCE} ימי שירות`,
    };
  }

  // קצבת ילדים (עד גיל 14)
  const childAllowance =
    FAMILY_ALLOWANCES_2026.CHILD_PER_DAY * Math.min(dependentChildren, 6) * reserveDays;

  // קצבה לבן/בת זוג שאינו/ה עובד/ת
  const spouseAllowance =
    hasSpouse && !spouseWorks
      ? FAMILY_ALLOWANCES_2026.NON_WORKING_SPOUSE_PER_DAY * reserveDays
      : 0;

  const totalFamilyAllowances = childAllowance + spouseAllowance;

  return {
    childAllowance,
    spouseAllowance,
    totalFamilyAllowances,
    note:
      totalFamilyAllowances > 0
        ? 'קצבות משפחה משולמות על ידי ב.ל. בנוסף לתגמול המילואים'
        : 'אין קצבות משפחה נוספות',
  };
}

/**
 * חישוב הגנת הכנסה - האם מילואים פוגע בהכנסה?
 */
export function calculateIncomeLossProtection(
  dailyPayment: number,
  reserveDays: number,
  monthlySalary: number,
): IncomeLossProtection {
  const regularDailySalary = monthlySalary / RESERVE_PAY_2026.DAYS_IN_MONTH;
  const regularSalaryForPeriod = regularDailySalary * reserveDays;
  const reservePayForPeriod = dailyPayment * reserveDays;
  const incomeDifference = reservePayForPeriod - regularSalaryForPeriod;
  const hasIncomeLoss = incomeDifference < 0;
  const compensationPercent =
    regularSalaryForPeriod > 0 ? (reservePayForPeriod / regularSalaryForPeriod) * 100 : 100;

  return {
    regularSalaryForPeriod,
    reservePayForPeriod,
    incomeDifference,
    hasIncomeLoss,
    compensationPercent,
  };
}

/**
 * חישוב תחזית חודשית (לגרף)
 */
export function calculateMonthlyProjection(
  dailyPayment: number,
  warDailyBonus: number,
  totalReserveDays: number,
  startDate?: string,
): MonthlyProjection[] {
  const months: MonthlyProjection[] = [];
  const remainingDays = totalReserveDays;

  // אם אין תאריך התחלה - מחלקים שווה על 3 חודשים
  if (!startDate || remainingDays <= 0) {
    const daysPerMonth = Math.round(remainingDays / 3);
    for (let i = 0; i < 3; i++) {
      const days = i === 2 ? remainingDays - daysPerMonth * 2 : daysPerMonth;
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() + i);
      const monthLabel = monthDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
      months.push({
        month: monthLabel,
        reserveDays: Math.max(0, days),
        basicPay: Math.max(0, days) * dailyPayment,
        warBonus: Math.max(0, days) * warDailyBonus,
        total: Math.max(0, days) * (dailyPayment + warDailyBonus),
      });
    }
    return months;
  }

  // עם תאריך התחלה - חישוב לפי חודשים אמיתיים
  const start = new Date(startDate);
  let daysLeft = totalReserveDays;
  let currentDate = new Date(start);

  while (daysLeft > 0 && months.length < 12) {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const daysThisMonth = Math.min(daysLeft, daysInMonth);
    const monthLabel = currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });

    months.push({
      month: monthLabel,
      reserveDays: daysThisMonth,
      basicPay: daysThisMonth * dailyPayment,
      warBonus: daysThisMonth * warDailyBonus,
      total: daysThisMonth * (dailyPayment + warDailyBonus),
    });

    daysLeft -= daysThisMonth;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}

/**
 * בחירת שכר לחישוב לפי בסיס שנבחר
 */
export function resolveEffectiveSalary(
  salaryBasis: SalaryBasisPeriod,
  recentMonthlySalary: number,
  salary12Months?: number,
  preWarSalary?: number,
): number {
  switch (salaryBasis) {
    case '12months':
      return salary12Months ?? recentMonthlySalary;
    case 'prewar':
      return preWarSalary ?? recentMonthlySalary;
    case '3months':
    default:
      return recentMonthlySalary;
  }
}

// ============================================================
// Main Calculation Function
// ============================================================

export function calculateReserveDutyPay(input: ReserveDutyInput): ReserveDutyResult {
  const notes: string[] = [];

  // Normalize backward-compat fields
  const isIronSwordsService = input.isIronSwordsService ?? input.eligibleForSpecialGrants ?? false;
  const combatRole = input.combatRole ?? 'none';
  const dependentChildren = input.dependentChildren ?? 0;
  const hasSpouse = input.hasSpouse ?? false;
  const spouseWorks = input.spouseWorks ?? true;
  const partTimePercent = input.partTimePercent ?? 100;
  const isSmallBusiness = input.isSmallBusiness ?? false;
  const employerContinuesPaying = input.employerContinuesPaying ?? true;
  const salaryBasis = input.salaryBasis ?? '3months';

  // 1. בחירת שכר בסיס
  const effectiveSalary = resolveEffectiveSalary(
    salaryBasis,
    input.recentMonthlySalary,
    input.salary12Months,
    input.preWarSalary,
  );

  // 2. חישוב שכר יומי בסיסי
  const { dailyPay: dailyPayment, cappedAtMaximum, atMinimum } = calculateDailyPay(
    input.employmentStatus,
    effectiveSalary,
    partTimePercent,
  );

  if (cappedAtMaximum) {
    notes.push(`שכר יומי מוגבל לתקרת ב.ל.: ${RESERVE_PAY_2026.DAILY_CAP.toLocaleString('he-IL')} ₪`);
  }
  if (atMinimum) {
    notes.push(`שכר יומי עלה לרצפת שכר מינימום: ${RESERVE_PAY_2026.MIN_DAILY} ₪`);
  }
  if (input.employmentStatus === 'unemployed') {
    notes.push('חסר תעסוקה / סטודנט — תגמול לפי שכר מינימום יומי');
  }
  if (input.employmentStatus === 'self-employed') {
    notes.push('עצמאי — חישוב לפי הצהרת הכנסות (רו"ח) או שכר מינימום, הגבוה מביניהם');
  }

  // 3. תשלום בסיסי כולל
  const totalBasicPayment = dailyPayment * input.reserveDays;

  // 4. מענקי חרבות ברזל
  const warBonuses = calculateWarBonuses(
    input.reserveDays,
    isIronSwordsService,
    combatRole,
    input.employmentStatus,
    isSmallBusiness,
  );

  if (isIronSwordsService) {
    if (warBonuses.generalGrant > 0) {
      notes.push(`מענק כללי חרבות ברזל: ${warBonuses.generalGrant.toLocaleString('he-IL')} ₪ (חד-פעמי, פטור ממס)`);
    }
    if (warBonuses.returnToWorkGrant > 0) {
      notes.push(`מענק חזרה למקום עבודה: ${warBonuses.returnToWorkGrant.toLocaleString('he-IL')} ₪ (פטור ממס)`);
    }
    if (warBonuses.combatRoleGrant > 0) {
      notes.push(`מענק תפקיד קרבי: ${warBonuses.combatRoleGrant.toLocaleString('he-IL')} ₪`);
    }
    if (isSmallBusiness && input.employmentStatus === 'self-employed') {
      notes.push(`עסק קטן — בדוק זכאות למענק עסק קטן: עד ${IRON_SWORDS_BONUSES.SMALL_BUSINESS_GRANT.toLocaleString('he-IL')} ₪`);
    }
  }

  // 5. החזר מעסיק
  const employerReimbursement = calculateEmployerReimbursement(
    dailyPayment,
    input.reserveDays,
    effectiveSalary,
    employerContinuesPaying,
    input.employmentStatus,
  );

  // 6. קצבות משפחה
  const familyAllowances = calculateFamilyAllowances(
    input.reserveDays,
    dependentChildren,
    hasSpouse,
    spouseWorks,
  );

  if (familyAllowances.totalFamilyAllowances > 0) {
    notes.push(`קצבות משפחה: ${familyAllowances.totalFamilyAllowances.toLocaleString('he-IL')} ₪ (ילדים + בן/בת זוג)`);
  }

  // 7. הגנת הכנסה
  const incomeLossProtection = calculateIncomeLossProtection(
    dailyPayment,
    input.reserveDays,
    effectiveSalary,
  );

  if (incomeLossProtection.hasIncomeLoss && !employerContinuesPaying) {
    notes.push(
      `שים לב: תגמול המילואים מפצה ${incomeLossProtection.compensationPercent.toFixed(0)}% מהשכר הרגיל`,
    );
  }

  // 8. נקודת זיכוי מס
  const taxCreditPoints = 1; // נקודת זיכוי אחת לכל שנה
  const taxCreditValue = RESERVE_PAY_2026.TAX_CREDIT_POINT_VALUE;
  notes.push(`נקודת זיכוי מס שנתית: ${taxCreditValue.toLocaleString('he-IL')} ₪ — בדוק החזר מס`);

  // 9. תגמול כולל
  const totalCompensation = totalBasicPayment + warBonuses.totalDailyGrant;
  const totalWithOneTimeGrants =
    totalCompensation + warBonuses.generalGrant + warBonuses.returnToWorkGrant + warBonuses.combatRoleGrant;

  // 10. תחזית חודשית
  const monthlyProjection = calculateMonthlyProjection(
    dailyPayment,
    isIronSwordsService ? IRON_SWORDS_BONUSES.DAILY_GRANT : 0,
    input.reserveDays,
    input.serviceStartDate,
  );

  if (input.reserveDays >= 90) {
    notes.push('שירות ממושך (90+ ימים) — בדוק זכאות לסיוע משרד הביטחון ופטורים נוספים');
  }

  return {
    dailyPayment,
    totalBasicPayment,
    warBonuses,
    employerReimbursement,
    familyAllowances,
    incomeLossProtection,
    totalCompensation,
    totalWithOneTimeGrants,
    taxCreditPoints,
    taxCreditValue,
    cappedAtMaximum,
    atMinimum,
    notes,
    monthlyProjection,
    // Backward compat fields
    totalSpecialGrant: warBonuses.totalDailyGrant,
    specialGrantPerDay: warBonuses.dailyGrant,
  };
}
