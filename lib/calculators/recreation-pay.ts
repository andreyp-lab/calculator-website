/**
 * חישוב דמי הבראה 2026 — מורחב
 *
 * מקורות:
 * - צו ההרחבה הכללי במשק (מגזר פרטי)
 * - הסכמים קיבוציים (מגזר ציבורי)
 * - חוק הגנת השכר תשי"ח-1958 (התיישנות 4 שנים)
 *
 * תעריף 2026: 418 ₪/יום (פרטי) | 471.40 ₪/יום (ציבורי)
 */

import {
  RECREATION_PAY_2026,
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_EMPLOYEE_2026,
} from '@/lib/constants/tax-2026';

// ====================================================================
// Types & Constants
// ====================================================================

export type Sector = 'private' | 'public';

/** מגזרים / הסכמים קיבוציים עם תעריפים שונים */
export type Industry =
  | 'private_general'        // כללי — צו ההרחבה
  | 'public_general'         // ציבורי — הסכם קיבוצי כללי
  | 'histadrut'              // הסתדרות — מטיב קמעונאות
  | 'banking'                // בנקאות
  | 'construction'           // בניין
  | 'cleaning'               // ניקיון
  | 'security'               // שמירה
  | 'healthcare'             // בריאות
  | 'academia';              // אקדמיה

export interface IndustryRate {
  id: Industry;
  label: string;
  ratePerDay: number;        // ₪ ליום
  source: string;
  isCollectiveAgreement: boolean;
}

/** תעריפים ענפיים 2026 — ₪ ליום */
export const INDUSTRY_RATES_2026: Record<Industry, IndustryRate> = {
  private_general: {
    id: 'private_general',
    label: 'מגזר פרטי — צו הרחבה כללי',
    ratePerDay: 418,
    source: 'צו ההרחבה הכללי במשק',
    isCollectiveAgreement: false,
  },
  public_general: {
    id: 'public_general',
    label: 'מגזר ציבורי — הסכם קיבוצי',
    ratePerDay: 471.40,
    source: 'הסכם קיבוצי מגזר ציבורי',
    isCollectiveAgreement: true,
  },
  histadrut: {
    id: 'histadrut',
    label: 'הסתדרות / קמעונאות מטיב',
    ratePerDay: 430,
    source: 'הסכם קיבוצי הסתדרות — קמעונאות',
    isCollectiveAgreement: true,
  },
  banking: {
    id: 'banking',
    label: 'בנקאות ופיננסים',
    ratePerDay: 490,
    source: 'הסכם קיבוצי בנקאים',
    isCollectiveAgreement: true,
  },
  construction: {
    id: 'construction',
    label: 'ענף הבניין',
    ratePerDay: 418,
    source: 'צו הרחבה ענף הבניין',
    isCollectiveAgreement: true,
  },
  cleaning: {
    id: 'cleaning',
    label: 'ענף הניקיון',
    ratePerDay: 418,
    source: 'צו הרחבה ענף הניקיון',
    isCollectiveAgreement: true,
  },
  security: {
    id: 'security',
    label: 'ענף השמירה',
    ratePerDay: 418,
    source: 'צו הרחבה ענף השמירה',
    isCollectiveAgreement: true,
  },
  healthcare: {
    id: 'healthcare',
    label: 'בריאות ורפואה',
    ratePerDay: 471.40,
    source: 'הסכם קיבוצי מגזר הבריאות',
    isCollectiveAgreement: true,
  },
  academia: {
    id: 'academia',
    label: 'אקדמיה ומחקר',
    ratePerDay: 471.40,
    source: 'הסכם קיבוצי מוסדות אקדמיים',
    isCollectiveAgreement: true,
  },
};

/** ימי הבראה לפי וותק — מגזר פרטי (צו הרחבה) */
export const RECREATION_DAYS_BY_TENURE: { fromYear: number; days: number }[] = [
  { fromYear: 1,  days: 5 },
  { fromYear: 2,  days: 6 },
  { fromYear: 4,  days: 7 },
  { fromYear: 11, days: 8 },
  { fromYear: 16, days: 9 },
  { fromYear: 20, days: 10 },
];

/** ימי הבראה לפי וותק — מגזר ציבורי (מטיב) */
export const RECREATION_DAYS_PUBLIC: { fromYear: number; days: number }[] = [
  { fromYear: 1,  days: 6 },
  { fromYear: 2,  days: 7 },
  { fromYear: 4,  days: 8 },
  { fromYear: 11, days: 9 },
  { fromYear: 16, days: 10 },
  { fromYear: 20, days: 11 },
];

// ====================================================================
// Core helpers
// ====================================================================

/**
 * מספר ימי הבראה לפי וותק ומגזר.
 * מגזר פרטי — צו הרחבה; ציבורי — הסכם קיבוצי מטיב.
 */
export function getRecreationDays(years: number, sector: Sector = 'private'): number {
  if (years < 1) return 0;
  const table = sector === 'public' ? RECREATION_DAYS_PUBLIC : RECREATION_DAYS_BY_TENURE;
  let days = 0;
  for (const row of table) {
    if (years >= row.fromYear) days = row.days;
    else break;
  }
  return days;
}

/**
 * חישוב ביטוח לאומי + בריאות על סכום נתון (עובד שכיר).
 */
function calcSocialSecurity(amount: number): number {
  const cap = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const threshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const capped = Math.min(amount, cap);
  const reduced = Math.min(capped, threshold) * SOCIAL_SECURITY_EMPLOYEE_2026.reducedRate.total;
  const full = Math.max(0, capped - threshold) * SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total;
  return reduced + full;
}

/**
 * חישוב מס הכנסה שנתי לפני זיכויים.
 */
function calcAnnualTax(annualIncome: number): number {
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (annualIncome <= prev) break;
    const chunk = Math.min(annualIncome, b.upTo) - prev;
    tax += chunk * b.rate;
    if (annualIncome <= b.upTo) break;
    prev = b.upTo;
  }
  return tax;
}

// ====================================================================
// Interfaces
// ====================================================================

export interface RecreationPayInput {
  yearsOfService: number;
  partTimePercentage: number;
  sector: Sector;
}

export interface RecreationPayResult {
  isEligible: boolean;
  ineligibilityReason?: string;
  daysEntitled: number;
  payPerDay: number;
  fullTimeAmount: number;
  partTimePercentage: number;
  finalAmount: number;
}

export interface RecreationPayFullInput {
  /** שנות וותק שלמות */
  yearsOfService: number;
  /** חודשים נוספים בשנה הנוכחית (0-11) — לחישוב יחסי בעת עזיבה */
  additionalMonths: number;
  /** היקף משרה 1-100 */
  partTimePercentage: number;
  /** מגזר */
  sector: Sector;
  /** ענף (לתעריף ספציפי) */
  industry: Industry;
  /** שכר חודשי ברוטו (לחישוב נטו) */
  monthlySalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** האם חישוב בעת סיום עבודה (יחסי) */
  isTermination: boolean;
  /** שנים בהן שולמו דמי הבראה (לחישוב פיגורים) */
  yearsPaid: number;
}

export interface RecreationPayFullResult {
  isEligible: boolean;
  ineligibilityReason?: string;

  /** ימים לפי ותק */
  daysEntitled: number;
  /** תעריף יומי */
  payPerDay: number;
  /** סכום ברוטו למשרה מלאה */
  fullTimeAmount: number;
  /** סכום ברוטו אחרי יחס משרה */
  grossAmount: number;

  /** נטו לאחר מס + ב.ל. */
  netAmount: number;
  /** מס הכנסה */
  taxAmount: number;
  /** ב.ל. + בריאות */
  socialSecurityAmount: number;
  /** שיעור מס אפקטיבי */
  effectiveTaxRate: number;

  /** חישוב יחסי בעת עזיבה */
  proRatedMonths: number;
  proRatedGross: number;
  proRatedNet: number;

  /** ענף ותעריף */
  industryRate: IndustryRate;

  /** השוואה פרטי vs ציבורי */
  privateSectorAmount: number;
  publicSectorAmount: number;

  /** המלצות חכמות */
  alerts: string[];
  recommendations: string[];
}

export interface RetroactiveClaimInput {
  /** שנות וותק נוכחיות */
  yearsOfService: number;
  /** היקף משרה */
  partTimePercentage: number;
  /** מגזר */
  sector: Sector;
  /** מספר שנים שלא שולמו (מקסימום 4 לפי התיישנות) */
  unpaidYears: number;
  /** שכר נוכחי */
  monthlySalary: number;
}

export interface RetroactiveClaimResult {
  /** האם זכאי לתביעה */
  isEligible: boolean;
  ineligibilityReason?: string;

  /** שנות תביעה רלוונטיות (עד 4) */
  claimYears: number;

  /** פירוט לפי שנה */
  yearlyBreakdown: RetroactiveYear[];

  /** סכום כולל ברוטו */
  totalGrossClaim: number;
  /** סכום עם ריבית (הלנה) */
  totalWithInterest: number;
  /** אזהרת התיישנות */
  statuteNote: string;
}

export interface RetroactiveYear {
  yearBack: number;           // 1 = שנה שעברה, 2 = לפני שנתיים וכו'
  label: string;
  yearsOfServiceThatYear: number;
  daysEntitled: number;
  ratePerDay: number;
  grossAmount: number;
  withInterest: number;       // +5% לכל שנת עיכוב (הלנת שכר)
}

export interface PaymentHistoryEntry {
  year: number;
  amountPaid: number;
  wasPaid: boolean;
}

export interface SmartAlertInput {
  yearsOfService: number;
  partTimePercentage: number;
  sector: Sector;
  yearsActuallyPaid: number;  // כמה שנים בפועל שולם
  monthlySalary: number;
}

export interface SmartAlertResult {
  expectedTotal4Years: number;
  actuallyPaidEstimate: number;
  potentialGap: number;
  alerts: string[];
  shouldClaim: boolean;
}

// ====================================================================
// Main calculation functions
// ====================================================================

/**
 * חישוב בסיסי — backward-compatible (שומר על API הקיים)
 */
export function calculateRecreationPay(input: RecreationPayInput): RecreationPayResult {
  const years = Math.floor(input.yearsOfService);
  const partTime = Math.max(0, Math.min(100, input.partTimePercentage));

  if (years < 1) {
    return {
      isEligible: false,
      ineligibilityReason: 'נדרש לפחות שנת עבודה אחת מלאה לזכאות לדמי הבראה',
      daysEntitled: 0,
      payPerDay: 0,
      fullTimeAmount: 0,
      partTimePercentage: partTime,
      finalAmount: 0,
    };
  }

  const daysEntitled = getRecreationDays(years, input.sector);
  const payPerDay =
    input.sector === 'public'
      ? RECREATION_PAY_2026.publicSectorPerDay
      : RECREATION_PAY_2026.privateSectorPerDay;

  const fullTimeAmount = daysEntitled * payPerDay;
  const finalAmount = fullTimeAmount * (partTime / 100);

  return {
    isEligible: true,
    daysEntitled,
    payPerDay,
    fullTimeAmount,
    partTimePercentage: partTime,
    finalAmount,
  };
}

/**
 * חישוב מלא — עם נטו, ענף, יחסי עזיבה, השוואות והמלצות
 */
export function calculateRecreationPayFull(input: RecreationPayFullInput): RecreationPayFullResult {
  const years = Math.floor(Math.max(0, input.yearsOfService));
  const addMonths = Math.max(0, Math.min(11, input.additionalMonths));
  const partTime = Math.max(1, Math.min(100, input.partTimePercentage)) / 100;
  const industryRate = INDUSTRY_RATES_2026[input.industry];
  const monthlySalary = Math.max(0, input.monthlySalary);
  const creditPoints = Math.max(0, input.creditPoints);

  // ---- Eligibility ----
  if (years < 1) {
    return {
      isEligible: false,
      ineligibilityReason: 'נדרשת שנת עבודה מלאה אחת לפחות לזכאות לדמי הבראה',
      daysEntitled: 0,
      payPerDay: industryRate.ratePerDay,
      fullTimeAmount: 0,
      grossAmount: 0,
      netAmount: 0,
      taxAmount: 0,
      socialSecurityAmount: 0,
      effectiveTaxRate: 0,
      proRatedMonths: addMonths,
      proRatedGross: 0,
      proRatedNet: 0,
      industryRate,
      privateSectorAmount: 0,
      publicSectorAmount: 0,
      alerts: ['עדיין לא השלמת שנת עבודה ראשונה — הזכאות מתחילה בשנה הראשונה המלאה.'],
      recommendations: [],
    };
  }

  // ---- Days by tenure ----
  const daysEntitled = getRecreationDays(years, input.sector);
  const payPerDay = industryRate.ratePerDay;
  const fullTimeAmount = daysEntitled * payPerDay;
  const grossAmount = fullTimeAmount * partTime;

  // ---- Net calculation ----
  // דמי הבראה ממוסים כשכר רגיל: מחשבים מס על בסיס שנתי + ב.ל.
  const annualSalary = monthlySalary * 12;
  const annualSalaryWithBonus = annualSalary + grossAmount;
  const creditAmount = creditPoints * CREDIT_POINT_2026.annual;

  const taxBefore = Math.max(0, calcAnnualTax(annualSalary) - creditAmount);
  const taxAfter = Math.max(0, calcAnnualTax(annualSalaryWithBonus) - creditAmount);
  const taxAmount = monthlySalary > 0 ? taxAfter - taxBefore : grossAmount * 0.22; // אומדן אם אין שכר

  const socialSecurityAmount = calcSocialSecurity(grossAmount);

  const netAmount = Math.max(0, grossAmount - taxAmount - socialSecurityAmount);
  const effectiveTaxRate = grossAmount > 0 ? (taxAmount + socialSecurityAmount) / grossAmount : 0;

  // ---- Pro-rated (termination) ----
  const proRatedMonths = addMonths;
  const proRatedGross = addMonths > 0 ? grossAmount * (addMonths / 12) : grossAmount;
  const proRatedTaxFraction = grossAmount > 0 ? taxAmount / grossAmount : 0;
  const proRatedSSFraction = grossAmount > 0 ? socialSecurityAmount / grossAmount : 0;
  const proRatedNet = proRatedGross * (1 - proRatedTaxFraction - proRatedSSFraction);

  // ---- Sector comparison ----
  const privateDays = getRecreationDays(years, 'private');
  const publicDays = getRecreationDays(years, 'public');
  const privateSectorAmount = privateDays * INDUSTRY_RATES_2026.private_general.ratePerDay * partTime;
  const publicSectorAmount = publicDays * INDUSTRY_RATES_2026.public_general.ratePerDay * partTime;

  // ---- Alerts & recommendations ----
  const alerts: string[] = [];
  const recommendations: string[] = [];

  if (netAmount < grossAmount * 0.7) {
    alerts.push(
      `שים לב: מס הכנסה + ביטוח לאומי מפחיתים כ-${Math.round(effectiveTaxRate * 100)}% מדמי ההבראה.`,
    );
  }

  if (industryRate.isCollectiveAgreement && industryRate.ratePerDay > RECREATION_PAY_2026.privateSectorPerDay) {
    const diff = (industryRate.ratePerDay - RECREATION_PAY_2026.privateSectorPerDay) * daysEntitled * partTime;
    recommendations.push(
      `ההסכם הקיבוצי שלך מיטיב: מקבל ${Math.round(diff).toLocaleString('he-IL')} ₪ יותר מהמינימום הקבוע בחוק.`,
    );
  }

  if (partTime < 1) {
    recommendations.push(
      `כעובד.ת ב-${Math.round(partTime * 100)}% משרה, דמי ההבראה מחושבים יחסית: ${Math.round(grossAmount).toLocaleString('he-IL')} ₪ (במקום ${Math.round(fullTimeAmount).toLocaleString('he-IL')} ₪ למשרה מלאה).`,
    );
  }

  if (years >= 1 && years < 2) {
    recommendations.push('לאחר שנתיים ותק, מספר ימי ההבראה יעלה ל-6 ימים (+418 ₪/+471.40 ₪).');
  } else if (years >= 3 && years < 4) {
    recommendations.push('בשנה הרביעית, מספר ימי ההבראה יעלה ל-7 ימים — עלייה משמעותית בזכאות.');
  } else if (years === 10) {
    recommendations.push('בשנה ה-11 תעבור ל-8 ימי הבראה — שתכנן את מועד השינוי.');
  }

  if (input.isTermination && addMonths > 0) {
    recommendations.push(
      `בעת עזיבה, מגיעים לך דמי הבראה יחסיים: ${addMonths}/12 × ${Math.round(grossAmount).toLocaleString('he-IL')} ₪ = ${Math.round(proRatedGross).toLocaleString('he-IL')} ₪ ברוטו.`,
    );
  }

  return {
    isEligible: true,
    daysEntitled,
    payPerDay,
    fullTimeAmount,
    grossAmount,
    netAmount,
    taxAmount,
    socialSecurityAmount,
    effectiveTaxRate,
    proRatedMonths,
    proRatedGross,
    proRatedNet,
    industryRate,
    privateSectorAmount,
    publicSectorAmount,
    alerts,
    recommendations,
  };
}

/**
 * חישוב תביעה רטרואקטיבית — עד 4 שנים אחורה (התיישנות לפי חוק הגנת השכר)
 */
export function calculateRetroactiveClaim(input: RetroactiveClaimInput): RetroactiveClaimResult {
  const years = Math.floor(Math.max(0, input.yearsOfService));
  const partTime = Math.max(1, Math.min(100, input.partTimePercentage)) / 100;
  const claimYears = Math.min(4, Math.max(0, Math.floor(input.unpaidYears)));

  if (years < 1) {
    return {
      isEligible: false,
      ineligibilityReason: 'נדרשת שנת עבודה מלאה לפחות לזכאות',
      claimYears: 0,
      yearlyBreakdown: [],
      totalGrossClaim: 0,
      totalWithInterest: 0,
      statuteNote: '',
    };
  }

  if (claimYears === 0) {
    return {
      isEligible: false,
      ineligibilityReason: 'לא צוינו שנים שלא שולמו',
      claimYears: 0,
      yearlyBreakdown: [],
      totalGrossClaim: 0,
      totalWithInterest: 0,
      statuteNote: '',
    };
  }

  const ratePerDay =
    input.sector === 'public'
      ? RECREATION_PAY_2026.publicSectorPerDay
      : RECREATION_PAY_2026.privateSectorPerDay;

  const yearlyBreakdown: RetroactiveYear[] = [];
  let totalGrossClaim = 0;
  let totalWithInterest = 0;

  for (let i = 1; i <= claimYears; i++) {
    const yearsOfServiceThatYear = Math.max(1, years - i + 1);
    const daysEntitled = getRecreationDays(yearsOfServiceThatYear, input.sector);
    const grossAmount = daysEntitled * ratePerDay * partTime;

    // ריבית הלנת שכר: 5% לשנה (לפי חוק הגנת השכר, הלנה מחויבת בריבית בנק ישראל + 20%)
    // אומדן שמרני: 5% לשנה לכל שנת עיכוב
    const interestFactor = Math.pow(1.05, i);
    const withInterest = grossAmount * interestFactor;

    const currentYear = new Date().getFullYear();
    yearlyBreakdown.push({
      yearBack: i,
      label: `${currentYear - i} (לפני ${i} שנ${i === 1 ? 'ה' : 'ים'})`,
      yearsOfServiceThatYear,
      daysEntitled,
      ratePerDay,
      grossAmount,
      withInterest,
    });

    totalGrossClaim += grossAmount;
    totalWithInterest += withInterest;
  }

  const statuteNote =
    claimYears < input.unpaidYears
      ? `שים לב: תביעה אפשרית לכל היותר ל-4 שנים אחורה לפי חוק הגנת השכר. ${input.unpaidYears - claimYears} שנה/ות התיישנו.`
      : 'ניתן לתבוע את כל השנים שצוינו (בגדר תקופת ההתיישנות של 4 שנים).';

  return {
    isEligible: true,
    claimYears,
    yearlyBreakdown,
    totalGrossClaim,
    totalWithInterest,
    statuteNote,
  };
}

/**
 * חישוב תשלום יחסי בעת סיום עבודה (פיטורים / התפטרות) לשנה החלקית
 */
export function calculatePartTimeRecreation(input: {
  yearsOfService: number;
  additionalMonths: number;
  partTimePercentage: number;
  sector: Sector;
}): {
  annualDays: number;
  proRatedDays: number;
  ratePerDay: number;
  grossAmount: number;
  breakdown: string;
} {
  const years = Math.floor(Math.max(0, input.yearsOfService));
  const months = Math.max(0, Math.min(11, input.additionalMonths));
  const partTime = Math.max(1, Math.min(100, input.partTimePercentage)) / 100;
  const annualDays = getRecreationDays(Math.max(1, years), input.sector);
  const proRatedDays = months > 0 ? Math.round((annualDays * (months / 12)) * 100) / 100 : annualDays;
  const ratePerDay =
    input.sector === 'public'
      ? RECREATION_PAY_2026.publicSectorPerDay
      : RECREATION_PAY_2026.privateSectorPerDay;
  const grossAmount = proRatedDays * ratePerDay * partTime;

  const breakdown =
    months > 0
      ? `${annualDays} ימים × ${months}/12 × ${Math.round(partTime * 100)}% = ${proRatedDays.toFixed(2)} ימים`
      : `${annualDays} ימים × ${Math.round(partTime * 100)}% = ${proRatedDays} ימים`;

  return { annualDays, proRatedDays, ratePerDay, grossAmount, breakdown };
}

/**
 * התראות חכמות — "לפי הוותק שלך, היית אמור לקבל X ב-4 השנים האחרונות"
 */
export function calculateSmartAlerts(input: SmartAlertInput): SmartAlertResult {
  const years = Math.floor(Math.max(0, input.yearsOfService));
  const partTime = Math.max(1, Math.min(100, input.partTimePercentage)) / 100;
  const ratePerDay =
    input.sector === 'public'
      ? RECREATION_PAY_2026.publicSectorPerDay
      : RECREATION_PAY_2026.privateSectorPerDay;

  // מחשב סכום צפוי ב-4 השנים האחרונות
  let expectedTotal4Years = 0;
  const checkYears = Math.min(4, years);
  for (let i = 0; i < checkYears; i++) {
    const yearsBack = Math.max(1, years - i);
    const days = getRecreationDays(yearsBack, input.sector);
    expectedTotal4Years += days * ratePerDay * partTime;
  }

  // אומדן מה שולם (לפי מה שהמשתמש דיווח)
  const currentYearAmount = getRecreationDays(years, input.sector) * ratePerDay * partTime;
  const actuallyPaidEstimate = input.yearsActuallyPaid * currentYearAmount;

  const potentialGap = Math.max(0, expectedTotal4Years - actuallyPaidEstimate);

  const alerts: string[] = [];
  const shouldClaim = potentialGap > 500;

  if (shouldClaim) {
    alerts.push(
      `לפי הוותק שלך (${years} שנים), היית אמור לקבל כ-${Math.round(expectedTotal4Years).toLocaleString('he-IL')} ₪ ב-4 השנים האחרונות.`,
    );
    alerts.push(
      `פער אפשרי של כ-${Math.round(potentialGap).toLocaleString('he-IL')} ₪ — כדאי לבדוק תלושי שכר ולשקול תביעה.`,
    );
    alerts.push('חוק הגנת השכר מאפשר תביעה לכל היותר 4 שנים אחורה — אל תחכה!');
  } else if (potentialGap > 0) {
    alerts.push(
      `ייתכן פער קטן של כ-${Math.round(potentialGap).toLocaleString('he-IL')} ₪ — בדוק תלושי שכר לאימות.`,
    );
  } else {
    alerts.push('לפי הנתונים שהזנת, דמי ההבראה שולמו כראוי.');
  }

  return {
    expectedTotal4Years,
    actuallyPaidEstimate,
    potentialGap,
    alerts,
    shouldClaim,
  };
}

/**
 * טבלת הבראה מלאה לפי וותק — לתצוגה
 */
export function getRecreationPayTable(
  sector: Sector,
  partTimePercentage: number,
): {
  tenure: string;
  fromYear: number;
  toYear: number | null;
  days: number;
  ratePerDay: number;
  annualGross: number;
  highlighted?: boolean;
}[] {
  const partTime = partTimePercentage / 100;
  const ratePerDay =
    sector === 'public'
      ? RECREATION_PAY_2026.publicSectorPerDay
      : RECREATION_PAY_2026.privateSectorPerDay;

  const table = sector === 'public' ? RECREATION_DAYS_PUBLIC : RECREATION_DAYS_BY_TENURE;

  return table.map((row, idx) => {
    const nextRow = table[idx + 1];
    const toYear = nextRow ? nextRow.fromYear - 1 : null;
    const tenure =
      toYear === null
        ? `${row.fromYear}+ שנים`
        : row.fromYear === toYear
        ? `שנה ${row.fromYear}`
        : `שנים ${row.fromYear}–${toYear}`;

    return {
      tenure,
      fromYear: row.fromYear,
      toYear,
      days: row.days,
      ratePerDay,
      annualGross: row.days * ratePerDay * partTime,
    };
  });
}
