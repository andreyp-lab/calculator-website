/**
 * מחשבון שווי שימוש ברכב חברה - 2026
 *
 * כשהמעסיק נותן רכב חברה, יש 'שווי שימוש' שמחויב במס.
 *
 * שיטת החישוב (רכב שנרשם מ-1.1.2010 ואילך — כמעט כל רכב רלוונטי):
 * שיטה ליניארית: שווי שימוש חודשי = 2.48% × מחיר המחירון של הרכב,
 * עד תקרת מחיר של 596,860 ₪ לשנת 2026 (חלק המחיר שמעל התקרה אינו מתווסף).
 *
 * הערה: שיטת קבוצות-המחיר הישנה (2.04%–5.14% לפי 7 קבוצות) רלוונטית
 * אך ורק לרכב שנרשם לפני 1.1.2010, ואינה בשימוש לרכבים מודרניים.
 *
 * הפחתה לרכב ירוק (סכום קבוע בשקלים מהשווי, רצפה 0):
 * - רכב חשמלי: 1,350 ₪/חודש
 * - רכב פלאג-אין (היברידי נטען): 1,130 ₪/חודש
 * - רכב היברידי רגיל: 560 ₪/חודש
 * (זו הפחתה בסכום קבוע — לא הנחה באחוזים.)
 *
 * רכב ישן (5+ שנים): הפחתה על בסיס פחת על מחיר המחירון.
 *
 * מקור: רשות המסים, חוזר מס הכנסה 2026
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CarGroup = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type CarType = 'regular' | 'electric' | 'hybrid' | 'used';

export type ComparisonMode = 'company-car' | 'personal-car' | 'both';

export interface CompanyCarInput {
  /** מחיר קטלוגי של הרכב (₪) */
  catalogPrice: number;
  /** קבוצת רכב (1-8) - אם לא מוגדר, מחושב אוטומטית מהמחיר */
  carGroup?: CarGroup;
  /** סוג הרכב */
  carType: CarType;
  /** מס שולי של העובד (%) */
  marginalTaxRate: number;
  /** שכר ברוטו חודשי (₪) - לחישוב השפעה על מדרגות */
  monthlySalary: number;
  /** גיל הרכב בשנים (לרכב משומש) */
  carAgeYears?: number;
  /** האם המעסיק מכסה תחזוקה? */
  employerCoversMaintenance: boolean;
  /** עלות תחזוקה חודשית ממוצעת שהמעסיק מכסה (₪) */
  maintenanceCoveredByEmployer: number;
  /** ק"מ חודשיים לצורך השוואה לרכב פרטי */
  monthlyKm: number;
  /** עלות דלק ל-100 ק"מ (₪) */
  fuelCostPer100km: number;
}

export interface CarGroupInfo {
  group: CarGroup;
  minPrice: number;
  maxPrice: number | null;
  percentage: number;
  label: string;
}

export interface CompanyCarResult {
  /** קבוצת הרכב שנקבעה */
  carGroup: CarGroup;
  /** אחוז שווי שימוש */
  benefitPercentage: number;
  /** שווי שימוש חודשי לפני הנחות */
  monthlyBenefitRaw: number;
  /** שווי שימוש אחרי הנחת סוג רכב (חשמלי/היברידי) */
  monthlyBenefitAfterDiscount: number;
  /** שווי שימוש חייב במס (אחרי הפחתות) */
  taxableBenefit: number;
  /** מס חודשי שיוצא לעובד מהתלוש */
  monthlyTax: number;
  /** עלות שנתית לעובד */
  annualCostToEmployee: number;
  /** שווי ההטבה מהתחזוקה שהמעסיק מכסה */
  maintenanceBenefit: number;
  /** שווי כולל של ההטבה (שווי שימוש + תחזוקה) */
  totalMonthlyBenefit: number;
  /** "שכר מקביל" - מה שכר ברוטו נוסף היה שווה אותו דבר נטו */
  salaryEquivalent: number;
  /** השוואה לרכב פרטי: עלות נסיעות פרטיות */
  personalCarMonthlyCost: number;
  /** הפרש: כמה חוסך/מפסיד עם רכב חברה */
  monthlySavingsVsPersonalCar: number;
  /** האם רכב החברה משתלם? */
  isCompanyCarWorthIt: boolean;
  /** ניתוח מדרגות מס - האם השווי דוחף מדרגה? */
  pushesToHigherBracket: boolean;
  /** תוספת מס עקב עלייה במדרגה */
  bracketImpactMonthly: number;
  /** רכיבי עלות לגרף */
  costBreakdown: CostBreakdownItem[];
  /** המלצות */
  recommendations: string[];
}

export interface CostBreakdownItem {
  label: string;
  value: number;
  color: string;
}

export interface TaxImpactResult {
  /** מס לפני הוספת שווי שימוש */
  taxBeforeBenefit: number;
  /** מס אחרי הוספת שווי שימוש */
  taxAfterBenefit: number;
  /** תוספת מס */
  additionalTax: number;
  /** מדרגה לפני */
  bracketBefore: number;
  /** מדרגה אחרי */
  bracketAfter: number;
}

// ─────────────────────────────────────────────
// Constants – 2026
// ─────────────────────────────────────────────

/**
 * שיעור שווי שימוש ליניארי 2026 — רכב שנרשם מ-1.1.2010 ואילך.
 * שווי שימוש חודשי = LINEAR_USAGE_RATE × מחיר המחירון (עד התקרה).
 */
export const LINEAR_USAGE_RATE_2026 = 0.0248;

/** תקרת מחיר מחירון לחישוב שווי שימוש 2026 (₪). חלק מעל התקרה אינו מתווסף. */
export const USAGE_VALUE_PRICE_CEILING_2026 = 596_860;

/**
 * טבלת קבוצות-המחיר ההיסטורית (רכב טרום-2010 בלבד).
 * אינה בשימוש בחישוב המודרני — נשמרת להסבר/תאימות לאחור בלבד.
 * @deprecated רלוונטי רק לרכב שנרשם לפני 1.1.2010.
 */
export const CAR_GROUPS_2026: CarGroupInfo[] = [
  { group: 1, minPrice: 0,       maxPrice: 162_070,  percentage: 0.0204, label: 'קבוצה 1 – עד 162,070 ₪ (2.04%) [טרום-2010]' },
  { group: 2, minPrice: 162_070, maxPrice: 188_900,  percentage: 0.0248, label: 'קבוצה 2 – 162,070–188,900 ₪ (2.48%) [טרום-2010]' },
  { group: 3, minPrice: 188_900, maxPrice: 250_140,  percentage: 0.0292, label: 'קבוצה 3 – 188,900–250,140 ₪ (2.92%) [טרום-2010]' },
  { group: 4, minPrice: 250_140, maxPrice: 322_210,  percentage: 0.0336, label: 'קבוצה 4 – 250,140–322,210 ₪ (3.36%) [טרום-2010]' },
  { group: 5, minPrice: 322_210, maxPrice: 410_420,  percentage: 0.0381, label: 'קבוצה 5 – 322,210–410,420 ₪ (3.81%) [טרום-2010]' },
  { group: 6, minPrice: 410_420, maxPrice: 506_490,  percentage: 0.0425, label: 'קבוצה 6 – 410,420–506,490 ₪ (4.25%) [טרום-2010]' },
  { group: 7, minPrice: 506_490, maxPrice: 564_250,  percentage: 0.0469, label: 'קבוצה 7 – 506,490–564,250 ₪ (4.69%) [טרום-2010]' },
  { group: 8, minPrice: 564_250, maxPrice: null,     percentage: 0.0514, label: 'קבוצה 8 – 564,250+ ₪ (5.14%) [טרום-2010]' },
];

/** מדרגות מס הכנסה 2026 (שנתי, ₪). הרצועה העליונה היא 47%; מס יסף (3%) מטופל בנפרד. */
const INCOME_TAX_BRACKETS_2026 = [
  { upTo: 84_120,  rate: 0.10 },
  { upTo: 120_720, rate: 0.14 },
  { upTo: 228_000, rate: 0.20 },
  { upTo: 301_200, rate: 0.31 },
  { upTo: 560_280, rate: 0.35 },
  { upTo: 721_560, rate: 0.47 },
  { upTo: Infinity, rate: 0.47 },
];

/** סף מס יסף שנתי (₪) ושיעורו — תוספת מעל הרצועה העליונה. */
const SURTAX_THRESHOLD_2026 = 721_560;
const SURTAX_RATE = 0.03;

/**
 * הפחתת שווי שימוש לרכב ירוק — סכום קבוע חודשי בשקלים (לא אחוז), רצפה 0.
 * 2026: חשמלי 1,350 ₪, פלאג-אין 1,130 ₪, היברידי רגיל 560 ₪.
 */
export const ELECTRIC_USAGE_REDUCTION = 1_350;
export const PLUGIN_USAGE_REDUCTION = 1_130;
export const HYBRID_USAGE_REDUCTION = 560;

/** עלות פחת+ביטוח לרכב פרטי (₪/ק"מ) — אומדן להשוואה בלבד. */
const PERSONAL_CAR_DEPRECIATION_INSURANCE_PER_KM = 0.5;

/** שיעור פחת שנתי לרכב בשימוש (לחישוב מחיר מקורי אפקטיבי) */
const ANNUAL_DEPRECIATION_RATE = 0.12;

// ─────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────

/**
 * קובע את קבוצת הרכב לפי המחיר הקטלוגי
 */
export function detectCarGroup(catalogPrice: number): CarGroup {
  const price = Math.max(0, catalogPrice);
  for (const g of CAR_GROUPS_2026) {
    if (g.maxPrice === null || price < g.maxPrice) {
      return g.group;
    }
  }
  return 8;
}

/**
 * מחזיר מידע על קבוצת רכב ספציפית
 */
export function getCarGroupInfo(group: CarGroup): CarGroupInfo {
  return CAR_GROUPS_2026.find((g) => g.group === group) ?? CAR_GROUPS_2026[7];
}

/**
 * מחשב את מחיר הרכב האפקטיבי לצורך שווי שימוש (לרכב משומש)
 * רכב ישן: המחיר הקטלוגי המקורי מופחת פחת
 */
export function calculateEffectivePriceForUsed(
  catalogPrice: number,
  ageYears: number,
): number {
  if (ageYears <= 0) return catalogPrice;
  // פחת: שנה 1 – 22%, שנים הבאות – 12% מהשאר
  let price = catalogPrice;
  for (let y = 0; y < ageYears; y++) {
    const rate = y === 0 ? 0.22 : ANNUAL_DEPRECIATION_RATE;
    price = price * (1 - rate);
  }
  return Math.max(price, catalogPrice * 0.2); // מינימום 20% מהמחיר המקורי
}

/**
 * מחזיר את ההפחתה החודשית הקבועה (₪) לפי סוג הרכב הירוק.
 */
export function getGreenReduction(carType: CarType): number {
  if (carType === 'electric') return ELECTRIC_USAGE_REDUCTION;
  // ('plugin' אינו מודל קלט נפרד כיום; פלאג-אין = PLUGIN_USAGE_REDUCTION)
  if (carType === 'hybrid') return HYBRID_USAGE_REDUCTION;
  return 0;
}

/**
 * מחשב שווי שימוש חודשי בשיטה הליניארית (רכב מ-2010 ואילך).
 * raw = 2.48% × min(מחיר, תקרה). afterDiscount = raw פחות הפחתה קבועה (רצפה 0).
 */
export function calculateUsageValue(
  catalogPrice: number,
  carType: CarType,
  _carGroup: CarGroup,
  carAgeYears = 0,
): { raw: number; afterDiscount: number; effectivePrice: number } {
  const effectivePrice =
    carType === 'used'
      ? calculateEffectivePriceForUsed(catalogPrice, carAgeYears)
      : catalogPrice;

  // תקרת מחיר: חלק המחיר שמעל התקרה אינו מתווסף לשווי השימוש.
  const cappedPrice = Math.min(effectivePrice, USAGE_VALUE_PRICE_CEILING_2026);
  const raw = cappedPrice * LINEAR_USAGE_RATE_2026;

  // הפחתה לרכב ירוק: סכום קבוע בשקלים (לא אחוז), רצפה 0.
  const reduction = getGreenReduction(carType);
  const afterDiscount = Math.max(0, raw - reduction);

  return {
    raw,
    afterDiscount,
    effectivePrice,
  };
}

/**
 * מחשב מס הכנסה שנתי בשיטת מדרגות
 */
export function calculateAnnualTax(annualGross: number): number {
  let tax = 0;
  let prev = 0;
  for (const bracket of INCOME_TAX_BRACKETS_2026) {
    const taxable = Math.min(annualGross, bracket.upTo) - prev;
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    prev = bracket.upTo;
  }
  // מס יסף: 3% נוספים על חלק ההכנסה שמעל הסף (מתווסף ל-47% הבסיסי).
  if (annualGross > SURTAX_THRESHOLD_2026) {
    tax += (annualGross - SURTAX_THRESHOLD_2026) * SURTAX_RATE;
  }
  return tax;
}

/**
 * מחשב את ההשפעה על מדרגות המס
 */
export function calculateTaxImpact(
  monthlySalary: number,
  monthlyBenefit: number,
): TaxImpactResult {
  const annualSalary = monthlySalary * 12;
  const annualBenefit = monthlyBenefit * 12;

  const taxBefore = calculateAnnualTax(annualSalary);
  const taxAfter = calculateAnnualTax(annualSalary + annualBenefit);

  // מדרגה שולית לפני ואחרי (כולל מס יסף מעל הסף: 47% + 3% = 50%)
  const effectiveBracket = (annual: number) => {
    const base = annual >= SURTAX_THRESHOLD_2026 ? SURTAX_RATE : 0;
    for (const b of INCOME_TAX_BRACKETS_2026) {
      if (annual < b.upTo) return b.rate + base;
    }
    return 0.47 + base;
  };

  return {
    taxBeforeBenefit: taxBefore,
    taxAfterBenefit: taxAfter,
    additionalTax: taxAfter - taxBefore,
    bracketBefore: effectiveBracket(annualSalary),
    bracketAfter: effectiveBracket(annualSalary + annualBenefit),
  };
}

/**
 * מחשב 'שכר מקביל' - כמה שכר ברוטו נוסף נותן את אותה הטבה נטו.
 *
 * שווי השימוש ברכב הוא הטבה חייבת במס (ממוסה בדיוק כמו שכר ברוטו),
 * ולכן 'השכר הברוטו המקביל' שווה בדיוק לערך ההטבה עצמו —
 * אין צורך בגריסת-אפ של 1/(1-מס) (זו תקפה רק להטבה פטורה ממס).
 */
export function calculateSalaryEquivalent(
  monthlyBenefit: number,
  _marginalTaxRate: number,
): number {
  return Math.max(0, monthlyBenefit);
}

/**
 * חישוב עלות רכב פרטי חודשית לפי ק"מ
 */
export function calculatePersonalCarCost(monthlyKm: number, fuelCostPer100km: number): number {
  const fuelMonthly = (monthlyKm / 100) * fuelCostPer100km;
  const depreciationInsurance = monthlyKm * PERSONAL_CAR_DEPRECIATION_INSURANCE_PER_KM;
  return fuelMonthly + depreciationInsurance;
}

/**
 * החישוב הראשי - המחשבון המלא
 */
export function calculateCompanyCarBenefit(input: CompanyCarInput): CompanyCarResult {
  const catalogPrice = Math.max(0, input.catalogPrice);
  const carGroup = input.carGroup ?? detectCarGroup(catalogPrice);
  const ageYears = input.carAgeYears ?? 0;

  // שווי שימוש
  const { raw, afterDiscount, effectivePrice } =
    calculateUsageValue(catalogPrice, input.carType, carGroup, ageYears);

  const taxableBenefit = afterDiscount;
  const marginalRate = Math.max(0, Math.min(50, input.marginalTaxRate)) / 100;
  const monthlyTax = taxableBenefit * marginalRate;

  // תחזוקה שמעסיק מכסה
  const maintenanceBenefit = input.employerCoversMaintenance
    ? input.maintenanceCoveredByEmployer
    : 0;

  const totalMonthlyBenefit = taxableBenefit + maintenanceBenefit;

  // שווי שכר מקביל
  const salaryEquivalent = calculateSalaryEquivalent(totalMonthlyBenefit, input.marginalTaxRate);

  // עלות רכב פרטי
  const personalCarMonthlyCost = calculatePersonalCarCost(
    input.monthlyKm,
    input.fuelCostPer100km,
  );

  // השוואה: חוסך/מפסיד עם רכב חברה
  // עם רכב חברה: משלם מס (monthlyTax) אבל חוסך עלות רכב פרטי + תחזוקה
  const monthlySavingsVsPersonalCar =
    personalCarMonthlyCost + maintenanceBenefit - monthlyTax;

  const isCompanyCarWorthIt = monthlySavingsVsPersonalCar > 0;

  // השפעה על מדרגות מס
  const taxImpact = calculateTaxImpact(input.monthlySalary, taxableBenefit);
  const pushesToHigherBracket = taxImpact.bracketAfter > taxImpact.bracketBefore;
  const bracketImpactMonthly = pushesToHigherBracket
    ? (taxImpact.additionalTax / 12 - monthlyTax)
    : 0;

  // רכיבי עלות לגרף
  const costBreakdown: CostBreakdownItem[] = [
    { label: 'מס הכנסה על שווי שימוש', value: Math.round(monthlyTax), color: '#ef4444' },
    { label: 'שווי שימוש נטו (הטבה)', value: Math.round(taxableBenefit - monthlyTax), color: '#10b981' },
  ];
  if (maintenanceBenefit > 0) {
    costBreakdown.push({
      label: 'תחזוקה שמעסיק מכסה',
      value: Math.round(maintenanceBenefit),
      color: '#3b82f6',
    });
  }

  // המלצות
  const recommendations: string[] = [];

  if (input.carType === 'electric') {
    recommendations.push(
      `רכב חשמלי מקבל הפחתה קבועה של ${formatNum(ELECTRIC_USAGE_REDUCTION)} ₪/חודש משווי השימוש (חיסכון של ${formatNum(Math.round(raw - afterDiscount))} ₪/חודש).`,
    );
  }
  if (input.carType === 'hybrid') {
    recommendations.push(
      `רכב היברידי מקבל הפחתה קבועה של ${formatNum(HYBRID_USAGE_REDUCTION)} ₪/חודש משווי השימוש (חיסכון של ${formatNum(Math.round(raw - afterDiscount))} ₪/חודש).`,
    );
  }
  if (pushesToHigherBracket) {
    recommendations.push(
      `שווי השימוש דוחף אותך למדרגת מס גבוהה יותר (${Math.round(taxImpact.bracketBefore * 100)}% → ${Math.round(taxImpact.bracketAfter * 100)}%). שקול לבחור רכב זול יותר.`,
    );
  }
  if (catalogPrice > 400_000) {
    recommendations.push(
      'רכב יקר מאוד → שווי שימוש גבוה מאוד. שקול האם רכב ב-250,000 ₪ + אקסטרות לא משתלם יותר.',
    );
  }
  if (!isCompanyCarWorthIt && input.monthlyKm < 1000) {
    recommendations.push(
      'אתה נוסע פחות מ-1,000 ק"מ בחודש – ייתכן שהחזר נסיעות/החזר רכב פרטי משתלם לך יותר מרכב חברה.',
    );
  }
  if (isCompanyCarWorthIt) {
    recommendations.push(
      `רכב החברה חוסך לך כ-${formatNum(Math.round(monthlySavingsVsPersonalCar))} ₪/חודש לעומת רכב פרטי + החזר.`,
    );
  }
  if (input.employerCoversMaintenance && maintenanceBenefit > 0) {
    recommendations.push(
      `המעסיק מכסה ${formatNum(Math.round(maintenanceBenefit))} ₪/חודש תחזוקה – הטבה נוספת שאינה חייבת במס שווי שימוש.`,
    );
  }
  if (ageYears >= 5) {
    recommendations.push(
      `רכב ישן (${ageYears} שנים) – שווי השימוש מחושב לפי מחיר אפקטיבי של ${formatNum(Math.round(effectivePrice))} ₪ (לא המחיר המקורי).`,
    );
  }

  return {
    carGroup,
    benefitPercentage: LINEAR_USAGE_RATE_2026,
    monthlyBenefitRaw: raw,
    monthlyBenefitAfterDiscount: afterDiscount,
    taxableBenefit,
    monthlyTax,
    annualCostToEmployee: monthlyTax * 12,
    maintenanceBenefit,
    totalMonthlyBenefit,
    salaryEquivalent,
    personalCarMonthlyCost,
    monthlySavingsVsPersonalCar,
    isCompanyCarWorthIt,
    pushesToHigherBracket,
    bracketImpactMonthly: Math.max(0, bracketImpactMonthly),
    costBreakdown,
    recommendations,
  };
}

/** Backward-compatible alias: קלט ישן עם 7 קבוצות */
export interface CompanyCarInputLegacy {
  catalogPrice: number;
  carGroup: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  isElectric: boolean;
  marginalTaxRate: number;
}

export interface CompanyCarResultLegacy {
  benefitPercentage: number;
  monthlyBenefit: number;
  electricDiscount: number;
  taxableBenefit: number;
  monthlyTax: number;
  annualCost: number;
  recommendation: string;
}

/**
 * @deprecated Use calculateCompanyCarBenefit instead.
 * Kept for backward compatibility with existing pages.
 */
export function calculateCompanyCarBenefitLegacy(
  input: CompanyCarInputLegacy,
): CompanyCarResultLegacy {
  // Map old 7-group to new 8-group (group 7 is now split into 7 and 8)
  const carGroup = input.carGroup as CarGroup;
  const newInput: CompanyCarInput = {
    catalogPrice: input.catalogPrice,
    carGroup,
    carType: input.isElectric ? 'electric' : 'regular',
    marginalTaxRate: input.marginalTaxRate,
    monthlySalary: 15_000,
    employerCoversMaintenance: false,
    maintenanceCoveredByEmployer: 0,
    monthlyKm: 1_500,
    fuelCostPer100km: 50,
  };
  const r = calculateCompanyCarBenefit(newInput);
  const electricDiscount = input.isElectric ? r.monthlyBenefitRaw - r.monthlyBenefitAfterDiscount : 0;

  const recommendation =
    r.recommendations.length > 0 ? r.recommendations[0] : 'בדוק האם החזר רכב פרטי משתלם יותר.';

  return {
    benefitPercentage: r.benefitPercentage,
    monthlyBenefit: r.monthlyBenefitRaw,
    electricDiscount,
    taxableBenefit: r.taxableBenefit,
    monthlyTax: r.monthlyTax,
    annualCost: r.annualCostToEmployee,
    recommendation,
  };
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatNum(n: number): string {
  return new Intl.NumberFormat('he-IL').format(n);
}
