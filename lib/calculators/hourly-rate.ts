/**
 * מחשבון תמחור שעת עבודה - לפרילנסר/יועץ/עצמאי
 * גרסה 2.0 — מקיפה ומורחבת
 *
 * מודלי תמחור:
 *  - Cost-Plus: עלות + רווח
 *  - Market-Based: מבוסס שוק
 *  - Value-Based: מבוסס ערך ללקוח
 *  - Hybrid: המלצה חכמה
 *
 * תכונות נוספות:
 *  - שעות חיוב ריאליסטיות (חישוב אחרי חגים/חופשה/מחלה)
 *  - פירוט עלויות מלא (קבועות + משתנות)
 *  - פיצוי על חופשה/מחלה (עצמאי לא מקבל!)
 *  - השוואה לשכיר
 *  - מחירון לפי סוגי לקוח (חוזר, חדש, דחוף, רטיינר)
 *  - בנצ'מארק ענפי 2026
 */

// ============================================================
// קבועים
// ============================================================

export const WORKING_DAYS_PER_YEAR = 250;  // ~5 ימי עבודה × 50 שבועות
export const WORKING_HOURS_PER_DAY = 8;

/** עלות נקודת זיכוי 2026 (₪/שנה) */
const CREDIT_POINT_VALUE_ANNUAL = 3_096;

/** מדרגות מס הכנסה 2026 — להכנסה מיגיעה אישית */
const TAX_BRACKETS_2026 = [
  { upTo: 84_120, rate: 0.10 },
  { upTo: 120_720, rate: 0.14 },
  { upTo: 228_000, rate: 0.20 },
  { upTo: 301_200, rate: 0.31 },
  { upTo: 560_280, rate: 0.35 },
  { upTo: 721_560, rate: 0.47 },
  { upTo: Infinity, rate: 0.50 },
];

/** ביטוח לאומי + בריאות לעצמאי 2026 */
const SOCIAL_SECURITY_SELF_EMPLOYED_2026 = {
  reducedThresholdMonthly: 7_522,
  maxThresholdMonthly: 50_136,
  reducedRate: 0.062,    // עד סף מופחת
  fullRateNI: 0.125,     // ביטוח לאומי מלא
  healthRate: 0.05,      // ביטוח בריאות
};

/** שיעורי פנסיה מינימום לעצמאי 2026 */
const PENSION_SELF_EMPLOYED_MIN_RATE = 0.045;  // 4.5% מהכנסה (מינימום)

/** שיעור קרן השתלמות לעצמאי */
const STUDY_FUND_RATE = 0.075;  // 7.5% (עד תקרה)
const STUDY_FUND_CEILING_MONTHLY = 20_520 / 12; // ~1,710 ₪/חודש (שנתי: 20,520)

// ============================================================
// Industry Benchmarks 2026
// ============================================================

export const INDUSTRY_RATES_2026 = {
  juniorDeveloper:      { min: 180, max: 280, mid: 230, label: "מפתח ג'וניור" },
  midDeveloper:         { min: 280, max: 450, mid: 360, label: 'מפתח מתקדם' },
  seniorDeveloper:      { min: 450, max: 700, mid: 560, label: 'מפתח סניור' },
  techLead:             { min: 600, max: 1_000, mid: 750, label: 'Tech Lead / ארכיטקט' },
  designer:             { min: 200, max: 400, mid: 300, label: 'מעצב גרפי / UI/UX' },
  marketingConsultant:  { min: 250, max: 500, mid: 350, label: 'יועץ שיווק' },
  translator:           { min: 100, max: 250, mid: 180, label: 'מתרגם' },
  photographer:         { min: 200, max: 500, mid: 350, label: 'צלם מקצועי' },
  bookkeeper:           { min: 150, max: 300, mid: 220, label: 'מנהל חשבונות' },
  taxConsultant:        { min: 300, max: 600, mid: 450, label: 'יועץ מס' },
  accountant:           { min: 300, max: 700, mid: 480, label: "רואה חשבון" },
  lawyer:               { min: 400, max: 1_200, mid: 700, label: "עורך דין" },
  managementConsultant: { min: 500, max: 1_500, mid: 800, label: 'יועץ ניהולי' },
  copywriter:           { min: 150, max: 350, mid: 250, label: 'קופירייטר' },
  hrConsultant:         { min: 200, max: 450, mid: 300, label: 'יועץ משאבי אנוש' },
} as const;

/** לתאימות לאחור */
export const INDUSTRY_BENCHMARKS_2026 = INDUSTRY_RATES_2026;

export type IndustryKey = keyof typeof INDUSTRY_RATES_2026;

// ============================================================
// סוגי תמחור
// ============================================================

export type PricingModel = 'cost-plus' | 'market-based' | 'value-based' | 'hybrid';
export type BusinessType = 'osek-patur' | 'osek-morsheh' | 'company';

// ============================================================
// Input Interfaces
// ============================================================

export interface HourlyRateInput {
  /** שכר חודשי רצוי (לפני מסים — הכנסה ברוטו מהעסק) */
  monthlySalary: number;
  /** סך שעות העבודה החודשיות (כולל פעילות לא חייבת) */
  workingHours: number;
  /** סך שעות שניתן לחייב לקוחות עליהן */
  billableHours: number;
  /** הוצאות חודשיות קבועות של העסק */
  monthlyOverhead: number;
  /** מרווח רווח באחוזים */
  profitMargin: number;
  /** האם להוסיף מע"מ */
  addVat?: boolean;
  /** שיעור מע"מ (ברירת מחדל: 18%) */
  vatRate?: number;
}

export interface BillableHoursInput {
  /** סה"כ שבועות עבודה בשנה (ברירת מחדל: 52) */
  weeksPerYear?: number;
  /** ימי חופשה בשנה */
  vacationDays: number;
  /** ימי מחלה בשנה */
  sickDays: number;
  /** ימי חג בשנה (ברירת מחדל: 9) */
  holidayDays?: number;
  /** אחוז זמן ניהול/שיווק (0–50) */
  adminPercent: number;
  /** שעות עבודה ביום */
  hoursPerDay?: number;
}

export interface DetailedCostInput {
  // הכנסה יעד
  targetMonthlySalary: number;

  // עלויות קבועות חודשיות
  homeOfficeRent: number;        // שכ"ד משרד / חלק מהבית
  internetPhone: number;         // אינטרנט + סלולרי
  softwareSubscriptions: number; // מנויי תוכנה
  hardwareDepreciation: number;  // פחת ציוד (מחשב וכו')
  healthInsurance: number;       // ביטוח בריאות פרטי
  professionalInsurance: number; // ביטוח אחריות מקצועית

  // עלויות משתנות חודשיות
  marketing: number;             // שיווק, פרסום
  meetingExpenses: number;       // נסיעות, אירוח
  training: number;              // קורסים, השתלמויות

  // פנסיה + קרן השתלמות
  pensionRate: number;           // אחוז (ברירת מחדל: 4.5%)
  studyFundEnabled: boolean;

  // בנוגע לסוג העסק
  businessType: BusinessType;
  creditPoints: number;          // נקודות זיכוי (ברירת מחדל: 2.25)

  // חיוב
  billableHoursMonthly: number;
  profitMargin: number;
  vatRate: number;
}

export interface ValueBasedInput {
  /** ערך כספי שנתי שהלקוח מרוויח מהפרויקט */
  clientAnnualValue: number;
  /** אחוז מהערך שאתה גובה (בדרך כלל 10-30%) */
  valueCapturePercent: number;
  /** שעות שאתה מוציא על הפרויקט */
  projectHours: number;
}

// ============================================================
// Result Interfaces
// ============================================================

export interface HourlyRateResult {
  baseCostPerHour: number;
  profitPerHour: number;
  hourlyRate: number;
  hourlyRateWithVat: number;
  dailyRate: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  utilizationRate: number;
  isValid: boolean;
  warning?: string;
}

export interface BillableHoursResult {
  grossWorkingDays: number;          // ימי עבודה גולמיים
  vacationDays: number;
  sickDays: number;
  holidayDays: number;
  nonBillableAdminDays: number;      // ניהול/שיווק
  netBillableDays: number;           // ימי חיוב נטו בשנה
  netBillableHoursPerYear: number;   // שעות חיוב בשנה
  netBillableHoursPerMonth: number;  // שעות חיוב לחודש
  utilizationPercent: number;        // אחוז ניצול מהזמן הכולל
  comparisonToNaive: number;         // כמה פחות מ-160×12?
}

export interface DetailedCostResult {
  // עלויות
  fixedCostsMonthly: number;
  variableCostsMonthly: number;
  totalOverheadMonthly: number;

  // מסים ובטוחות סוציאליות
  estimatedTaxMonthly: number;
  socialSecurityMonthly: number;
  pensionMonthly: number;
  studyFundMonthly: number;

  // סה"כ
  totalCostMonthly: number;
  requiredRevenueMonthly: number;    // כולל מרווח רווח
  requiredHourlyRate: number;
  requiredHourlyRateWithVat: number;

  // פירוט נוסף
  effectiveTaxRate: number;
  costBreakdown: CostBreakdownItem[];
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
  color: string;
  category: 'fixed' | 'variable' | 'tax' | 'retirement' | 'salary';
}

export interface ValueBasedResult {
  projectValue: number;
  capturedValue: number;
  impliedHourlyRate: number;
  impliedHourlyRateWithVat: number;
  comparison: string;
}

export interface SalaryComparisonResult {
  hourlyRate: number;
  annualRevenue: number;
  equivalentEmployeeSalaryGross: number;   // ברוטו שכיר שווה-ערך
  equivalentEmployeeSalaryNet: number;     // נטו שכיר שווה-ערך
  selfEmployedNetMonthly: number;          // נטו עצמאי לאחר הוצאות ומסים
  advantage: number;                        // עצמאי מול שכיר נטו (+ = לטובת עצמאי)
  breakEvenHourlyRate: number;             // תעריף שבו שקול לשכיר
}

export interface PricingTiersResult {
  baseRate: number;
  repeatClient: number;       // -15%
  newClient: number;          // base
  rushJob: number;            // +25%
  longRetainer: number;       // -10%
  strategicWork: number;      // +50% premium
  withVat: {
    baseRate: number;
    repeatClient: number;
    newClient: number;
    rushJob: number;
    longRetainer: number;
    strategicWork: number;
  };
}

export interface IndustryBenchmarkResult {
  userRate: number;
  industry: IndustryKey;
  benchmarkMin: number;
  benchmarkMax: number;
  benchmarkMid: number;
  percentile: 'below' | 'low' | 'mid' | 'high' | 'premium';
  percentileLabel: string;
  percentilePercent: number;
  recommendation: string;
}

// ============================================================
// Core Functions
// ============================================================

/**
 * חישוב שעות חיוב ריאליסטיות בשנה
 */
export function calculateRealisticBillableHours(input: BillableHoursInput): BillableHoursResult {
  const weeksPerYear = input.weeksPerYear ?? 52;
  const hoursPerDay = input.hoursPerDay ?? 8;
  const holidayDays = input.holidayDays ?? 9;
  const adminPercent = Math.max(0, Math.min(80, input.adminPercent));

  const grossWorkingDays = weeksPerYear * 5;

  // הורדת ימי חופשה, מחלה, חג
  const nonWorkDays = input.vacationDays + input.sickDays + holidayDays;
  const availableDays = Math.max(0, grossWorkingDays - nonWorkDays);

  // הורדת זמן ניהול/שיווק
  const billableDays = availableDays * (1 - adminPercent / 100);
  const netBillableDays = Math.round(billableDays);

  const netBillableHoursPerYear = netBillableDays * hoursPerDay;
  const netBillableHoursPerMonth = netBillableHoursPerYear / 12;

  const totalPossibleHoursYear = grossWorkingDays * hoursPerDay;
  const utilizationPercent = totalPossibleHoursYear > 0
    ? (netBillableHoursPerYear / totalPossibleHoursYear) * 100
    : 0;

  const naiveHours = 160 * 12; // הנחה נאיבית של 160×12
  const comparisonToNaive = naiveHours - netBillableHoursPerYear;

  return {
    grossWorkingDays,
    vacationDays: input.vacationDays,
    sickDays: input.sickDays,
    holidayDays,
    nonBillableAdminDays: Math.round(availableDays * adminPercent / 100),
    netBillableDays,
    netBillableHoursPerYear,
    netBillableHoursPerMonth: Math.round(netBillableHoursPerMonth * 10) / 10,
    utilizationPercent: Math.round(utilizationPercent * 10) / 10,
    comparisonToNaive,
  };
}

/**
 * חישוב בסיסי — כולל תאימות לאחור מלאה
 */
export function calculateHourlyRate(input: HourlyRateInput): HourlyRateResult {
  const monthlySalary = Math.max(0, input.monthlySalary);
  const workingHours = Math.max(0, input.workingHours);
  const billableHours = Math.max(0, input.billableHours);
  const monthlyOverhead = Math.max(0, input.monthlyOverhead);
  const profitMargin = Math.max(0, input.profitMargin);
  const vatRate = input.vatRate ?? 0.18;

  let warning: string | undefined;
  let isValid = true;

  if (billableHours <= 0) {
    return {
      baseCostPerHour: 0,
      profitPerHour: 0,
      hourlyRate: 0,
      hourlyRateWithVat: 0,
      dailyRate: 0,
      monthlyRevenue: 0,
      monthlyProfit: 0,
      utilizationRate: 0,
      isValid: false,
      warning: 'יש להזין מספר חיובי של שעות לחיוב',
    };
  }

  if (billableHours > workingHours) {
    warning = 'שעות לחיוב לא יכולות להיות גבוהות יותר משעות העבודה הכוללות';
    isValid = false;
  }

  const baseCostPerHour = (monthlySalary + monthlyOverhead) / billableHours;
  const profitMultiplier = 1 + profitMargin / 100;
  const hourlyRate = baseCostPerHour * profitMultiplier;
  const profitPerHour = hourlyRate - baseCostPerHour;
  const hourlyRateWithVat = hourlyRate * (1 + vatRate);
  const dailyRate = hourlyRate * 8;
  const monthlyRevenue = hourlyRate * billableHours;
  const monthlyProfit = monthlyRevenue - monthlySalary - monthlyOverhead;
  const utilizationRate = workingHours > 0 ? (billableHours / workingHours) * 100 : 0;

  return {
    baseCostPerHour,
    profitPerHour,
    hourlyRate,
    hourlyRateWithVat,
    dailyRate,
    monthlyRevenue,
    monthlyProfit,
    utilizationRate,
    isValid,
    warning,
  };
}

/**
 * חישוב מפורט מלא — Cost-Plus עם כל ההוצאות, מסים, פנסיה
 */
export function calculateDetailedHourlyRate(input: DetailedCostInput): DetailedCostResult {
  const vatRate = input.vatRate ?? 0.18;
  const pensionRate = input.pensionRate > 0 ? input.pensionRate : PENSION_SELF_EMPLOYED_MIN_RATE;
  const creditPoints = input.creditPoints > 0 ? input.creditPoints : 2.25;
  const billableHours = Math.max(1, input.billableHoursMonthly);
  const profitMargin = Math.max(0, input.profitMargin);

  // ---- 1. הוצאות קבועות ----
  const fixedCostsMonthly =
    input.homeOfficeRent +
    input.internetPhone +
    input.softwareSubscriptions +
    input.hardwareDepreciation +
    input.healthInsurance +
    input.professionalInsurance;

  // ---- 2. הוצאות משתנות ----
  const variableCostsMonthly =
    input.marketing +
    input.meetingExpenses +
    input.training;

  const totalOverheadMonthly = fixedCostsMonthly + variableCostsMonthly;

  // ---- 3. הכנסה כוללת נדרשת (לפני מסים) לכיסוי שכר + הוצאות ----
  // נחשב איטרטיבית כי המסים תלויים בהכנסה
  const targetSalary = input.targetMonthlySalary;
  const annualIncome = (targetSalary + totalOverheadMonthly) * 12;

  // ---- 4. מסים (הכנסה שנתית) ----
  const estimatedTaxAnnual = _calcIncomeTax(annualIncome, creditPoints);
  const estimatedTaxMonthly = estimatedTaxAnnual / 12;
  const effectiveTaxRate = annualIncome > 0 ? estimatedTaxAnnual / annualIncome : 0;

  // ---- 5. ביטוח לאומי לעצמאי ----
  const socialSecurityMonthly = _calcSelfEmployedSocialSecurity(targetSalary);

  // ---- 6. פנסיה + קרן השתלמות ----
  const pensionMonthly = targetSalary * pensionRate;
  const studyFundMonthly = input.studyFundEnabled
    ? Math.min(targetSalary, STUDY_FUND_CEILING_MONTHLY) * STUDY_FUND_RATE
    : 0;

  // ---- 7. סה"כ עלות חודשית ----
  const totalCostMonthly =
    targetSalary +
    totalOverheadMonthly +
    estimatedTaxMonthly +
    socialSecurityMonthly +
    pensionMonthly +
    studyFundMonthly;

  // ---- 8. הכנסה נדרשת כולל מרווח ----
  const requiredRevenueMonthly = totalCostMonthly * (1 + profitMargin / 100);
  const requiredHourlyRate = requiredRevenueMonthly / billableHours;
  const requiredHourlyRateWithVat = requiredHourlyRate * (1 + vatRate);

  // ---- 9. Cost Breakdown לגרף ----
  const rawBreakdown: CostBreakdownItem[] = [
    { label: 'שכר לעצמי', amount: targetSalary, color: '#10b981', category: 'salary' as const },
    { label: 'הוצאות קבועות', amount: fixedCostsMonthly, color: '#3b82f6', category: 'fixed' as const },
    { label: 'הוצאות משתנות', amount: variableCostsMonthly, color: '#60a5fa', category: 'variable' as const },
    { label: 'מס הכנסה', amount: estimatedTaxMonthly, color: '#ef4444', category: 'tax' as const },
    { label: 'ביטוח לאומי', amount: socialSecurityMonthly, color: '#f59e0b', category: 'tax' as const },
    { label: 'פנסיה', amount: pensionMonthly, color: '#8b5cf6', category: 'retirement' as const },
    ...(studyFundMonthly > 0
      ? [{ label: 'קרן השתלמות', amount: studyFundMonthly, color: '#a78bfa', category: 'retirement' as const }]
      : []),
  ];
  const costBreakdown = rawBreakdown.filter((item) => item.amount > 0);

  return {
    fixedCostsMonthly,
    variableCostsMonthly,
    totalOverheadMonthly,
    estimatedTaxMonthly,
    socialSecurityMonthly,
    pensionMonthly,
    studyFundMonthly,
    totalCostMonthly,
    requiredRevenueMonthly,
    requiredHourlyRate,
    requiredHourlyRateWithVat,
    effectiveTaxRate,
    costBreakdown,
  };
}

/**
 * חישוב תמחור מבוסס ערך ללקוח (Value-Based)
 */
export function calculateValueBasedRate(input: ValueBasedInput): ValueBasedResult {
  const capturedValue = input.clientAnnualValue * (input.valueCapturePercent / 100);
  const impliedHourlyRate = input.projectHours > 0 ? capturedValue / input.projectHours : 0;
  const impliedHourlyRateWithVat = impliedHourlyRate * 1.18;

  let comparison: string;
  if (impliedHourlyRate > 1_000) {
    comparison = 'פרימיום גבוה — מצוין למומחים עם ניסיון מוכח';
  } else if (impliedHourlyRate > 600) {
    comparison = 'תעריף סניור גבוה — ריאלי ליועצים ומומחים';
  } else if (impliedHourlyRate > 300) {
    comparison = 'תעריף בינוני-גבוה — תחרותי לשוק';
  } else if (impliedHourlyRate > 150) {
    comparison = 'תעריף בינוני — שקול להעלות אחוז הלכידה';
  } else {
    comparison = 'תעריף נמוך — שקול להגדיל אחוז הלכידה או להסביר ללקוח ערך גבוה יותר';
  }

  return {
    projectValue: capturedValue,
    capturedValue,
    impliedHourlyRate,
    impliedHourlyRateWithVat,
    comparison,
  };
}

/**
 * השוואת עצמאי לשכיר — כמה שווה X ₪/שעה כשכיר?
 * @param hourlyRate תעריף שעתי (לפני מע"מ)
 * @param billableHoursMonthly שעות חיוב לחודש
 * @param monthlyOverhead הוצאות חודשיות
 * @param creditPoints נקודות זיכוי
 */
export function compareToSalary(
  hourlyRate: number,
  billableHoursMonthly: number,
  monthlyOverhead: number,
  creditPoints = 2.25,
): SalaryComparisonResult {
  const annualRevenue = hourlyRate * billableHoursMonthly * 12;
  const annualProfit = annualRevenue - monthlyOverhead * 12;

  // מסים + ב.ל. לעצמאי
  const taxAnnual = _calcIncomeTax(annualProfit, creditPoints);
  const ssMonthly = _calcSelfEmployedSocialSecurity(annualProfit / 12);
  const ssAnnual = ssMonthly * 12;
  const pensionAnnual = annualProfit * PENSION_SELF_EMPLOYED_MIN_RATE;

  const selfEmployedNetAnnual = annualProfit - taxAnnual - ssAnnual - pensionAnnual;
  const selfEmployedNetMonthly = selfEmployedNetAnnual / 12;

  // חישוב שכיר שווה-ערך — חשב כמה ברוטו יביא אותו נטו
  // שכיר: ביטוח לאומי ~11.5%, מס הכנסה, פנסיה 6%
  // פשטנו ל-rough estimate
  const employerCostAnnual = annualRevenue;  // גס — עלות מעסיק שקולה להכנסה
  const grossFromEmployer = employerCostAnnual / 1.155; // ~15.5% עלות מעסיק
  const equivalentEmployeeSalaryGross = grossFromEmployer / 12;

  // נטו לשכיר ב-grossFromEmployer (אומדן 72% מהברוטו ברמה זו)
  const employeeNetMonthly = equivalentEmployeeSalaryGross * 0.72;

  // שווה ערך לעצמאי
  const breakEvenHourlyRate = billableHoursMonthly > 0
    ? (employeeNetMonthly + monthlyOverhead + taxAnnual / 12 + ssMonthly + pensionAnnual / 12) / billableHoursMonthly
    : 0;

  return {
    hourlyRate,
    annualRevenue,
    equivalentEmployeeSalaryGross: Math.round(equivalentEmployeeSalaryGross),
    equivalentEmployeeSalaryNet: Math.round(employeeNetMonthly),
    selfEmployedNetMonthly: Math.round(selfEmployedNetMonthly),
    advantage: Math.round(selfEmployedNetMonthly - employeeNetMonthly),
    breakEvenHourlyRate: Math.round(breakEvenHourlyRate),
  };
}

/**
 * מחיר לפי סוג לקוח
 */
export function calculatePricingTiers(baseRate: number, vatRate = 0.18): PricingTiersResult {
  const tiers = {
    baseRate,
    repeatClient: Math.round(baseRate * 0.85),    // -15%
    newClient: baseRate,
    rushJob: Math.round(baseRate * 1.25),          // +25%
    longRetainer: Math.round(baseRate * 0.90),     // -10%
    strategicWork: Math.round(baseRate * 1.50),    // +50%
  };

  return {
    ...tiers,
    withVat: {
      baseRate: Math.round(tiers.baseRate * (1 + vatRate)),
      repeatClient: Math.round(tiers.repeatClient * (1 + vatRate)),
      newClient: Math.round(tiers.newClient * (1 + vatRate)),
      rushJob: Math.round(tiers.rushJob * (1 + vatRate)),
      longRetainer: Math.round(tiers.longRetainer * (1 + vatRate)),
      strategicWork: Math.round(tiers.strategicWork * (1 + vatRate)),
    },
  };
}

/**
 * השוואת תעריף משתמש לבנצ'מארק ענפי
 */
export function compareToIndustryBenchmark(
  userRate: number,
  industry: IndustryKey,
): IndustryBenchmarkResult {
  const bench = INDUSTRY_RATES_2026[industry];
  const range = bench.max - bench.min;
  const positionInRange = range > 0 ? (userRate - bench.min) / range : 0.5;

  let percentile: IndustryBenchmarkResult['percentile'];
  let percentileLabel: string;

  if (userRate < bench.min * 0.8) {
    percentile = 'below';
    percentileLabel = 'מתחת לשוק — סיכון לתדמית נמוכה';
  } else if (userRate < bench.min) {
    percentile = 'low';
    percentileLabel = 'מתחת לממוצע השוק';
  } else if (userRate <= bench.mid) {
    percentile = 'mid';
    percentileLabel = 'טווח שוק תחתון–בינוני';
  } else if (userRate <= bench.max) {
    percentile = 'high';
    percentileLabel = 'טווח שוק גבוה';
  } else {
    percentile = 'premium';
    percentileLabel = 'פרימיום — מעל השוק';
  }

  const recommendations: Record<IndustryBenchmarkResult['percentile'], string> = {
    below: 'התעריף שלך נמוך מאוד. שקול להעלות מיד — תעריף נמוך מדי פוגע בתדמית ומושך לקוחות קשים.',
    low: 'יש מקום להעלות 15-25% מבלי לאבד לקוחות. נסה להעלות בפרויקטים חדשים.',
    mid: 'תעריף תחרותי. עם ניסיון נוסף ובידול, תוכל לעלות לטווח העליון.',
    high: 'תעריף טוב. הדגש את הערך הייחודי שלך ותוצאות מוכחות.',
    premium: 'תעריף פרימיום — וודא שיש לך ביסוס ברור (מוניטין, תוצאות, מומחיות נדירה).',
  };

  return {
    userRate,
    industry,
    benchmarkMin: bench.min,
    benchmarkMax: bench.max,
    benchmarkMid: bench.mid,
    percentile,
    percentileLabel,
    percentilePercent: Math.max(0, Math.min(100, Math.round(positionInRange * 100))),
    recommendation: recommendations[percentile],
  };
}

/**
 * פיצוי חופשה/מחלה — כמה עוד צריך לגבות כדי לכסות ימי היעדרות?
 * @param baseDailyRate תעריף יומי בסיסי (שעות×תעריף)
 * @param vacationDays ימי חופשה בשנה
 * @param sickDays ימי מחלה בשנה
 * @param workingDaysYear ימי עבודה בשנה
 * @returns תוספת לתעריף שעתי לכיסוי ימי היעדרות
 */
export function calculateVacationSickCompensation(
  baseHourlyRate: number,
  vacationDays: number,
  sickDays: number,
  workingDaysYear = 250,
  hoursPerDay = 8,
): { dailyCompensationRate: number; hourlyAddition: number; annualLostRevenue: number } {
  const lostDays = vacationDays + sickDays;
  const annualBillableDays = workingDaysYear - lostDays;

  const annualLostRevenue = lostDays * hoursPerDay * baseHourlyRate;
  const hourlyAddition = annualBillableDays > 0
    ? annualLostRevenue / (annualBillableDays * hoursPerDay)
    : 0;

  return {
    dailyCompensationRate: hourlyAddition * hoursPerDay,
    hourlyAddition,
    annualLostRevenue,
  };
}

// ============================================================
// Private helpers
// ============================================================

function _calcIncomeTax(annualIncome: number, creditPoints: number): number {
  let tax = 0;
  let prev = 0;
  for (const bracket of TAX_BRACKETS_2026) {
    if (annualIncome <= prev) break;
    const inBracket = Math.min(annualIncome, bracket.upTo === Infinity ? annualIncome : bracket.upTo) - prev;
    tax += inBracket * bracket.rate;
    if (bracket.upTo === Infinity || annualIncome <= bracket.upTo) break;
    prev = bracket.upTo;
  }
  const creditValue = creditPoints * CREDIT_POINT_VALUE_ANNUAL;
  return Math.max(0, tax - creditValue);
}

function _calcSelfEmployedSocialSecurity(monthlyIncome: number): number {
  const ss = SOCIAL_SECURITY_SELF_EMPLOYED_2026;
  const reducedThresh = ss.reducedThresholdMonthly;
  const maxThresh = ss.maxThresholdMonthly;

  if (monthlyIncome <= 0) return 0;

  const belowReduced = Math.min(monthlyIncome, reducedThresh);
  const aboveReduced = Math.max(0, Math.min(monthlyIncome, maxThresh) - reducedThresh);

  const reducedPortionNI = belowReduced * ss.reducedRate;
  const fullPortionNI = aboveReduced * ss.fullRateNI;
  const health = Math.min(monthlyIncome, maxThresh) * ss.healthRate;

  return reducedPortionNI + fullPortionNI + health;
}
