/**
 * מחשבון שווי שימוש ברכב חברה - 2026
 *
 * כשהמעסיק נותן רכב חברה, יש "שווי שימוש" שמחויב במס.
 * החישוב: מחיר רכב × אחוז קבוצת הרכב = שווי חודשי
 *
 * קבוצות רכב 2026 (לפי מחיר קטלוגי):
 * - קבוצה 1: עד 162,070 ₪   → 2.04%
 * - קבוצה 2: 162,070–188,900 → 2.48%
 * - קבוצה 3: 188,900–250,140 → 2.92%
 * - קבוצה 4: 250,140–322,210 → 3.36%
 * - קבוצה 5: 322,210–410,420 → 3.81%
 * - קבוצה 6: 410,420–506,490 → 4.25%
 * - קבוצה 7: 506,490–564,250 → 4.69%
 * - קבוצה 8: 564,250+         → 5.14%
 *
 * רכב חשמלי: 50% הנחה על שווי השימוש
 * רכב היברידי: 70% מהשווי הרגיל
 * רכב ישן (5+ שנים): הפחתה על בסיס פחת
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

export const CAR_GROUPS_2026: CarGroupInfo[] = [
  { group: 1, minPrice: 0,       maxPrice: 162_070,  percentage: 0.0204, label: 'קבוצה 1 – עד 162,070 ₪ (2.04%)' },
  { group: 2, minPrice: 162_070, maxPrice: 188_900,  percentage: 0.0248, label: 'קבוצה 2 – 162,070–188,900 ₪ (2.48%)' },
  { group: 3, minPrice: 188_900, maxPrice: 250_140,  percentage: 0.0292, label: 'קבוצה 3 – 188,900–250,140 ₪ (2.92%)' },
  { group: 4, minPrice: 250_140, maxPrice: 322_210,  percentage: 0.0336, label: 'קבוצה 4 – 250,140–322,210 ₪ (3.36%)' },
  { group: 5, minPrice: 322_210, maxPrice: 410_420,  percentage: 0.0381, label: 'קבוצה 5 – 322,210–410,420 ₪ (3.81%)' },
  { group: 6, minPrice: 410_420, maxPrice: 506_490,  percentage: 0.0425, label: 'קבוצה 6 – 410,420–506,490 ₪ (4.25%)' },
  { group: 7, minPrice: 506_490, maxPrice: 564_250,  percentage: 0.0469, label: 'קבוצה 7 – 506,490–564,250 ₪ (4.69%)' },
  { group: 8, minPrice: 564_250, maxPrice: null,     percentage: 0.0514, label: 'קבוצה 8 – 564,250+ ₪ (5.14%)' },
];

/** מדרגות מס הכנסה 2026 (שנתי, ₪) */
const INCOME_TAX_BRACKETS_2026 = [
  { upTo: 84_120,  rate: 0.10 },
  { upTo: 120_720, rate: 0.14 },
  { upTo: 193_800, rate: 0.20 },
  { upTo: 269_280, rate: 0.31 },
  { upTo: 558_240, rate: 0.35 },
  { upTo: 721_560, rate: 0.47 },
  { upTo: Infinity, rate: 0.50 },
];

/** עלות ק"מ לרכב פרטי ממוצע (₪/ק"מ) - כולל הכל פחת, ביטוח, דלק */
const PERSONAL_CAR_COST_PER_KM = 1.71; // תקרת החזר נסיעות 2026

/** מקדם הנחה לרכב חשמלי */
const ELECTRIC_DISCOUNT_FACTOR = 0.5;

/** מקדם הנחה לרכב היברידי */
const HYBRID_DISCOUNT_FACTOR = 0.7;

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
 * מחשב שווי שימוש חודשי
 */
export function calculateUsageValue(
  catalogPrice: number,
  carType: CarType,
  carGroup: CarGroup,
  carAgeYears = 0,
): { raw: number; afterDiscount: number; effectivePrice: number } {
  const effectivePrice =
    carType === 'used'
      ? calculateEffectivePriceForUsed(catalogPrice, carAgeYears)
      : catalogPrice;

  const groupInfo = getCarGroupInfo(carGroup);
  const raw = effectivePrice * groupInfo.percentage;

  let discountFactor = 1;
  if (carType === 'electric') discountFactor = ELECTRIC_DISCOUNT_FACTOR;
  else if (carType === 'hybrid') discountFactor = HYBRID_DISCOUNT_FACTOR;

  return {
    raw,
    afterDiscount: raw * discountFactor,
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

  // מדרגה שולית לפני ואחרי
  const effectiveBracket = (annual: number) => {
    for (const b of INCOME_TAX_BRACKETS_2026) {
      if (annual < b.upTo) return b.rate;
    }
    return 0.5;
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
 * מחשב "שכר מקביל" - כמה שכר ברוטו נוסף היה שווה את אותה הטבה נטו
 */
export function calculateSalaryEquivalent(
  monthlyBenefit: number,
  marginalTaxRate: number,
): number {
  const rate = Math.max(0, Math.min(50, marginalTaxRate)) / 100;
  if (rate >= 1) return 0;
  // הטבה נטו = ערך הטבה × (1 - שיעור מס)
  // שכר ברוטו שווה = הטבה נטו / (1 - שיעור מס) — אבל זה אותו הדבר
  // הכוונה: כמה שכר ברוטו נוסף יתן לי אותה הטבה נטו
  const benefitNetValue = monthlyBenefit; // הרכב שווה את מחירו, גם אם משלמים עליו מס
  return benefitNetValue / (1 - rate);
}

/**
 * חישוב עלות רכב פרטי חודשית לפי ק"מ
 */
export function calculatePersonalCarCost(monthlyKm: number, fuelCostPer100km: number): number {
  const fuelMonthly = (monthlyKm / 100) * fuelCostPer100km;
  const depreciationInsurance = monthlyKm * 0.5; // פחת + ביטוח בערך 0.5 ₪/ק"מ
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
      `רכב חשמלי מקבל 50% הנחה על שווי שימוש – חיסכון של ${formatNum(Math.round(raw - afterDiscount))} ₪/חודש.`,
    );
  }
  if (input.carType === 'hybrid') {
    recommendations.push(
      `רכב היברידי משלם 70% משווי שימוש רגיל – חיסכון של ${formatNum(Math.round(raw - afterDiscount))} ₪/חודש.`,
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
      'אתה נוסע פחות מ-1,000 ק"מ בחודש – ייתכן שהחזר נסיעות (1.71 ₪/ק"מ) משתלם לך יותר מרכב חברה.',
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
    benefitPercentage: getCarGroupInfo(carGroup).percentage,
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
