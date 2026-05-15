/**
 * מחשבון בעלות רכב מקיף - ליסינג vs הלוואה vs מימון עצמי
 *
 * מבוסס על מתודולוגיית TCO (Total Cost of Ownership) של תעשיית הרכב:
 *
 * עלויות שקלולות:
 *   1. עלות רכישה (מקדמה + הלוואה / מזומן / ליסינג)
 *   2. עלות הזדמנות (Opportunity Cost) - מה היה קורה אם הכסף הושקע
 *   3. דלק (לפי סוג, יעילות, ק"מ חודשיים)
 *   4. ביטוח (חובה + מקיף/צד ג')
 *   5. רישוי שנתי (אגרה)
 *   6. טיפולים (טיפול קטן + טיפול גדול)
 *   7. צמיגים (החלפה כל X ק"מ)
 *   8. תיקונים בלתי צפויים (תקציב שנתי)
 *   9. ירידת ערך (depreciation curve - לא ליניארית)
 *
 * מקורות:
 *   - מחירוני לוי יצחק (ירידת ערך)
 *   - איגוד יבואני הרכב (עלות בעלות שנתית)
 *   - דלק.co.il (מחירי דלק)
 *   - מסלקה ביטוחית (פרמיות ממוצעות)
 */

import { VAT_2026 } from '@/lib/constants/tax-2026';

export type PaymentMethod = 'cash' | 'loan' | 'leasing';
export type FuelType = 'gasoline_95' | 'gasoline_98' | 'diesel' | 'electric' | 'hybrid';
export type CarSegment = 'mini' | 'family' | 'executive' | 'suv' | 'luxury';

// ===========================================================
// קבועים - מחירי שוק 2026
// ===========================================================
export const FUEL_PRICES_2026 = {
  gasoline_95: 7.45, // ₪/ליטר
  gasoline_98: 7.85,
  diesel: 6.95,
  electric: 0.55, // ₪/קוט"ש (תעריף בית)
  hybrid: 7.45, // hybrid uses gasoline 95
} as const;

export const FUEL_LABELS: Record<FuelType, string> = {
  gasoline_95: 'בנזין 95',
  gasoline_98: 'בנזין 98',
  diesel: 'סולר',
  electric: 'חשמלי',
  hybrid: 'היברידי',
};

// יעילות דלק טיפוסית (ליטר/100ק"מ או קוט"ש/100ק"מ)
export const TYPICAL_FUEL_EFFICIENCY: Record<FuelType, Record<CarSegment, number>> = {
  gasoline_95: { mini: 6.5, family: 7.5, executive: 9, suv: 11, luxury: 12 },
  gasoline_98: { mini: 6.8, family: 7.8, executive: 9.2, suv: 11, luxury: 12 },
  diesel: { mini: 5, family: 6, executive: 7, suv: 8, luxury: 9 },
  electric: { mini: 14, family: 16, executive: 18, suv: 22, luxury: 24 },
  hybrid: { mini: 4.5, family: 5.5, executive: 6.5, suv: 7.5, luxury: 8.5 },
};

// ירידת ערך טיפוסית לפי שנה - לא ליניארית!
// שנה 1: 18-25% (החזקה ביותר), שנה 2-3: 12-15%, שנה 4+: 8-10%
export const DEPRECIATION_CURVE_2026 = [
  0.22, // שנה 1 - איבוד הכי גדול
  0.15, // שנה 2
  0.12, // שנה 3
  0.10, // שנה 4
  0.08, // שנה 5
  0.07, // שנה 6
  0.06, // שנה 7
  0.06, // שנה 8
  0.05, // שנה 9
  0.05, // שנה 10+
];

// פרמיות ביטוח טיפוסיות (₪/שנה)
export const INSURANCE_DEFAULTS: Record<CarSegment, { mandatory: number; comprehensive: number }> = {
  mini: { mandatory: 1100, comprehensive: 2800 },
  family: { mandatory: 1300, comprehensive: 3800 },
  executive: { mandatory: 1500, comprehensive: 4800 },
  suv: { mandatory: 1700, comprehensive: 5800 },
  luxury: { mandatory: 2200, comprehensive: 9500 },
};

// אגרת רישוי שנתית טיפוסית (₪)
export const LICENSE_FEE_DEFAULTS: Record<CarSegment, number> = {
  mini: 1450,
  family: 1850,
  executive: 2350,
  suv: 2950,
  luxury: 4200,
};

// תקציב טיפולים שנתי טיפוסי (₪/שנה)
export const MAINTENANCE_DEFAULTS: Record<CarSegment, { service: number; repairs: number; tires: number }> = {
  mini: { service: 1800, repairs: 1500, tires: 1400 },
  family: { service: 2400, repairs: 2000, tires: 1800 },
  executive: { service: 3200, repairs: 2500, tires: 2400 },
  suv: { service: 3800, repairs: 3000, tires: 3200 },
  luxury: { service: 6500, repairs: 5500, tires: 4500 },
};

// טסט שנתי (₪)
export const ANNUAL_INSPECTION = 230;

// ===========================================================
// קלט מקיף
// ===========================================================
export interface VehicleOwnershipInput {
  // פרטי רכב
  carPrice: number; // מחיר חדש כולל מע"מ
  carSegment: CarSegment;
  yearsOfUse: number;
  fuelType: FuelType;
  fuelEfficiency: number; // ליטר/100ק"מ
  monthlyKm: number;

  // ===== אופציה 1: מימון עצמי (מזומן) =====
  cashPrice: number; // המחיר במזומן (לרוב יש הנחה)
  alternativeInvestmentReturn: number; // % שנתי - מה היית מרוויח אם משקיע

  // ===== אופציה 2: הלוואה =====
  loanDownPayment: number;
  loanAmount: number;
  loanTermMonths: number;
  loanRate: number; // % שנתי
  // האם המקדמה הייתה משקיעה? (אם כן - יש opportunity cost על המקדמה בלבד)
  loanIncludeOpportunityCostOnDP: boolean;

  // ===== אופציה 3: ליסינג =====
  leasingMonthlyPayment: number;
  leasingInitialPayment: number;
  leasingFinalPayment: number; // שווי שיורי (אופציה לקנייה בסוף)
  leasingBuysAtEnd: boolean; // האם תקנה את הרכב בסוף?
  leasingIncludesMaintenance: boolean; // האם הליסינג כולל טיפולים?
  leasingIncludesInsurance: boolean;

  // ===== עלויות תפעול (משותפות לכל האופציות) =====
  insuranceMandatoryYearly: number; // ביטוח חובה
  insuranceComprehensiveYearly: number; // ביטוח מקיף
  licenseFeeYearly: number; // אגרת רישוי
  annualInspection: number; // טסט שנתי
  serviceYearly: number; // טיפולים תקופתיים
  unexpectedRepairsYearly: number; // תיקונים בלתי צפויים
  tiresEveryKm: number; // החלפת צמיגים כל כמה ק"מ
  tiresSetPrice: number; // עלות סט צמיגים
  parkingYearly: number; // חניה (אופציונלי)
  tollsMonthly: number; // כביש 6 וכו'

  // ===== פיננסי =====
  vatRefundable: boolean; // האם זה רכב עסקי (לזיכוי מע"מ)
}

// ===========================================================
// תוצאה
// ===========================================================
export interface PaymentOptionResult {
  method: PaymentMethod;
  label: string;
  /** עלויות כוללות לאורך התקופה */
  totalCost: number;
  /** ממוצע חודשי */
  monthlyAverage: number;
  /** עלות הזדמנות (אם רלוונטי) */
  opportunityCost: number;
  /** הוצאה במזומן בפועל ב-Day 1 */
  upfrontCash: number;
  /** סך תשלומים חודשיים לאורך התקופה */
  totalMonthlyPayments: number;
  /** ערך נכס בסוף התקופה (חיובי = שווי הרכב שיש לי, 0 לליסינג) */
  assetValueAtEnd: number;
  /** סך עלויות תפעול */
  totalOperatingCosts: number;
  /** פירוט מלא */
  breakdown: { label: string; value: number; note?: string }[];
  /** עלות מצטברת לפי שנה */
  cumulativeByYear: number[];
}

export interface VehicleOwnershipResult {
  options: {
    cash: PaymentOptionResult;
    loan: PaymentOptionResult;
    leasing: PaymentOptionResult;
  };
  /** הזולה ביותר */
  cheapest: PaymentMethod;
  /** הפרשים יחסית לזולה */
  differences: Record<PaymentMethod, number>;
  /** עלויות תפעול שנתיות (משותף לכל) */
  yearlyOperatingCost: number;
  /** עלות לק"מ - השוואה */
  costPerKm: Record<PaymentMethod, number>;
  /** המלצות חכמות */
  recommendations: string[];
}

// ===========================================================
// פונקציות עזר
// ===========================================================

/** מחשב את הירידת ערך המצטברת אחרי N שנים (לא ליניארית) */
export function calculateRemainingValue(carPrice: number, years: number): number {
  let remaining = carPrice;
  for (let y = 0; y < years; y++) {
    const rate = DEPRECIATION_CURVE_2026[Math.min(y, DEPRECIATION_CURVE_2026.length - 1)];
    remaining *= 1 - rate;
  }
  return Math.max(0, remaining);
}

/** PMT - חישוב תשלום חודשי על הלוואה */
function calculateMonthlyLoanPayment(amount: number, annualRate: number, months: number): number {
  if (amount <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return amount / months;
  return (
    (amount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

/** Future value של השקעה בריבית דריבית */
function futureValue(principal: number, annualRate: number, years: number): number {
  return principal * Math.pow(1 + annualRate / 100, years);
}

/** עלות הזדמנות = מה הסכום היה צובר אם הושקע */
function opportunityCost(principal: number, annualRate: number, years: number): number {
  return futureValue(principal, annualRate, years) - principal;
}

/** חישוב עלות דלק שנתית */
function calculateAnnualFuelCost(input: VehicleOwnershipInput): number {
  const yearlyKm = input.monthlyKm * 12;
  const fuelPerYear = (yearlyKm * input.fuelEfficiency) / 100;
  const pricePerUnit = FUEL_PRICES_2026[input.fuelType];
  return fuelPerYear * pricePerUnit;
}

/** חישוב עלות צמיגים שנתית (בהתאם לק"מ) */
function calculateAnnualTiresCost(input: VehicleOwnershipInput): number {
  if (input.tiresEveryKm <= 0) return 0;
  const yearlyKm = input.monthlyKm * 12;
  return (yearlyKm / input.tiresEveryKm) * input.tiresSetPrice;
}

/** עלויות תפעול שנתיות מצטברות (משותפות) */
function calculateYearlyOperatingCost(
  input: VehicleOwnershipInput,
  options: { includeInsurance?: boolean; includeMaintenance?: boolean } = {},
): number {
  const includeInsurance = options.includeInsurance ?? true;
  const includeMaintenance = options.includeMaintenance ?? true;

  const fuel = calculateAnnualFuelCost(input);
  const tires = calculateAnnualTiresCost(input);
  const insurance = includeInsurance
    ? input.insuranceMandatoryYearly + input.insuranceComprehensiveYearly
    : 0;
  const maintenance = includeMaintenance
    ? input.serviceYearly + input.unexpectedRepairsYearly
    : 0;
  const license = input.licenseFeeYearly;
  const inspection = input.annualInspection;
  const tolls = input.tollsMonthly * 12;
  const parking = input.parkingYearly;

  return fuel + tires + insurance + maintenance + license + inspection + tolls + parking;
}

// ===========================================================
// אופציה 1: מימון עצמי (מזומן)
// ===========================================================
function calculateCashOption(input: VehicleOwnershipInput): PaymentOptionResult {
  const { cashPrice, yearsOfUse, alternativeInvestmentReturn } = input;

  // עלות הזדמנות - מה הכסף היה מרוויח בהשקעה אלטרנטיבית
  const oppCost = opportunityCost(cashPrice, alternativeInvestmentReturn, yearsOfUse);

  // עלויות תפעול
  const yearlyOperating = calculateYearlyOperatingCost(input);
  const totalOperating = yearlyOperating * yearsOfUse;

  // ערך הרכב בסוף
  const remainingValue = calculateRemainingValue(cashPrice, yearsOfUse);

  // עלות כוללת = מחיר + עלות הזדמנות + תפעול - ערך נותר
  const totalCost = cashPrice + oppCost + totalOperating - remainingValue;
  const monthsOfUse = yearsOfUse * 12;

  // עלות מצטברת לפי שנה
  const cumulative: number[] = [];
  for (let y = 1; y <= yearsOfUse; y++) {
    const cumOpp = opportunityCost(cashPrice, alternativeInvestmentReturn, y);
    const cumOp = yearlyOperating * y;
    const remVal = calculateRemainingValue(cashPrice, y);
    cumulative.push(cashPrice + cumOpp + cumOp - remVal);
  }

  return {
    method: 'cash',
    label: 'מימון עצמי (מזומן)',
    totalCost,
    monthlyAverage: totalCost / monthsOfUse,
    opportunityCost: oppCost,
    upfrontCash: cashPrice,
    totalMonthlyPayments: 0,
    assetValueAtEnd: remainingValue,
    totalOperatingCosts: totalOperating,
    breakdown: [
      { label: 'מחיר רכישה במזומן', value: cashPrice },
      {
        label: `עלות הזדמנות (${alternativeInvestmentReturn}% תשואה אלטרנטיבית)`,
        value: oppCost,
        note: 'מה הכסף היה צובר בהשקעה',
      },
      { label: 'עלויות תפעול מצטברות', value: totalOperating, note: `${yearsOfUse} שנים` },
      { label: 'ערך הרכב בסוף', value: -remainingValue, note: 'מקבל חזרה במכירה' },
    ],
    cumulativeByYear: cumulative,
  };
}

// ===========================================================
// אופציה 2: הלוואה
// ===========================================================
function calculateLoanOption(input: VehicleOwnershipInput): PaymentOptionResult {
  const {
    carPrice,
    yearsOfUse,
    loanDownPayment,
    loanAmount,
    loanTermMonths,
    loanRate,
    loanIncludeOpportunityCostOnDP,
    alternativeInvestmentReturn,
  } = input;

  const monthsOfUse = yearsOfUse * 12;
  const monthlyPayment = calculateMonthlyLoanPayment(loanAmount, loanRate, loanTermMonths);

  // כמה תשלומים בפועל (אם תקופת השימוש קצרה מהמשך ההלוואה - תצטרך לסלק יתרה)
  const actualPaymentsCount = Math.min(monthsOfUse, loanTermMonths);
  const totalMonthlyPayments = monthlyPayment * actualPaymentsCount;

  // יתרת חוב אם המשתמש מוכר את הרכב לפני סוף ההלוואה
  let remainingLoanBalance = 0;
  if (monthsOfUse < loanTermMonths) {
    // חישוב מסולק לפי לוח סילוקין
    const monthlyR = loanRate / 100 / 12;
    if (monthlyR === 0) {
      remainingLoanBalance = loanAmount - monthlyPayment * monthsOfUse;
    } else {
      remainingLoanBalance =
        loanAmount * Math.pow(1 + monthlyR, monthsOfUse) -
        monthlyPayment * ((Math.pow(1 + monthlyR, monthsOfUse) - 1) / monthlyR);
    }
    remainingLoanBalance = Math.max(0, remainingLoanBalance);
  }

  // ריבית כוללת ששולמה
  const totalInterest = totalMonthlyPayments - (loanAmount - remainingLoanBalance);

  // עלות הזדמנות על המקדמה (אם נבחר)
  const oppCostOnDP = loanIncludeOpportunityCostOnDP
    ? opportunityCost(loanDownPayment, alternativeInvestmentReturn, yearsOfUse)
    : 0;

  // עלויות תפעול
  const yearlyOperating = calculateYearlyOperatingCost(input);
  const totalOperating = yearlyOperating * yearsOfUse;

  // ערך הרכב בסוף - יתרת חוב = איך אני באמת יוצא
  const remainingValue = calculateRemainingValue(carPrice, yearsOfUse);
  const netAssetValue = remainingValue - remainingLoanBalance;

  const totalCost =
    loanDownPayment +
    totalMonthlyPayments +
    remainingLoanBalance + // אם הרכב נמכר לפני סוף ההלוואה
    oppCostOnDP +
    totalOperating -
    remainingValue;

  // עלות מצטברת לפי שנה
  const cumulative: number[] = [];
  for (let y = 1; y <= yearsOfUse; y++) {
    const monthsAtYear = y * 12;
    const paymentsAtYear = monthlyPayment * Math.min(monthsAtYear, loanTermMonths);
    const cumOpp = loanIncludeOpportunityCostOnDP
      ? opportunityCost(loanDownPayment, alternativeInvestmentReturn, y)
      : 0;
    const cumOp = yearlyOperating * y;
    const remVal = calculateRemainingValue(carPrice, y);
    cumulative.push(loanDownPayment + paymentsAtYear + cumOpp + cumOp - remVal);
  }

  const breakdown: { label: string; value: number; note?: string }[] = [
    { label: 'מקדמה', value: loanDownPayment },
    {
      label: `תשלומי הלוואה (${actualPaymentsCount} תשלומים × ${Math.round(monthlyPayment)} ₪)`,
      value: totalMonthlyPayments,
      note: `מתוכם ריבית: ${Math.round(totalInterest).toLocaleString('he-IL')} ₪`,
    },
  ];

  if (remainingLoanBalance > 0) {
    breakdown.push({
      label: 'יתרת חוב לסילוק',
      value: remainingLoanBalance,
      note: 'אם תמכור את הרכב לפני סיום ההלוואה',
    });
  }

  if (loanIncludeOpportunityCostOnDP && oppCostOnDP > 0) {
    breakdown.push({
      label: `עלות הזדמנות על המקדמה (${alternativeInvestmentReturn}%)`,
      value: oppCostOnDP,
      note: 'מה המקדמה הייתה צוברת בהשקעה',
    });
  }

  breakdown.push({ label: 'עלויות תפעול מצטברות', value: totalOperating });
  breakdown.push({ label: 'ערך הרכב בסוף', value: -remainingValue, note: 'מקבל חזרה במכירה' });

  return {
    method: 'loan',
    label: 'הלוואה מהבנק',
    totalCost,
    monthlyAverage: totalCost / monthsOfUse,
    opportunityCost: oppCostOnDP,
    upfrontCash: loanDownPayment,
    totalMonthlyPayments,
    assetValueAtEnd: netAssetValue,
    totalOperatingCosts: totalOperating,
    breakdown,
    cumulativeByYear: cumulative,
  };
}

// ===========================================================
// אופציה 3: ליסינג
// ===========================================================
function calculateLeasingOption(input: VehicleOwnershipInput): PaymentOptionResult {
  const {
    yearsOfUse,
    leasingMonthlyPayment,
    leasingInitialPayment,
    leasingFinalPayment,
    leasingBuysAtEnd,
    leasingIncludesMaintenance,
    leasingIncludesInsurance,
    alternativeInvestmentReturn,
  } = input;

  const monthsOfUse = yearsOfUse * 12;
  const totalMonthlyPayments = leasingMonthlyPayment * monthsOfUse;

  // עלות הזדמנות על המקדמה הראשונית
  const oppCostInitial = opportunityCost(
    leasingInitialPayment,
    alternativeInvestmentReturn,
    yearsOfUse,
  );

  // עלויות תפעול - ליסינג לרוב כולל ביטוח+תחזוקה
  const yearlyOperating = calculateYearlyOperatingCost(input, {
    includeInsurance: !leasingIncludesInsurance,
    includeMaintenance: !leasingIncludesMaintenance,
  });
  const totalOperating = yearlyOperating * yearsOfUse;

  // אם רוכש בסוף - מקבל את הרכב, ירידת ערך עליו
  let assetValueAtEnd = 0;
  let finalCost = 0;
  if (leasingBuysAtEnd) {
    finalCost = leasingFinalPayment;
    // ערך הרכב בסוף (תיקני - כי כבר היה בשימוש)
    assetValueAtEnd = calculateRemainingValue(input.carPrice, yearsOfUse);
  }

  const totalCost =
    leasingInitialPayment +
    totalMonthlyPayments +
    finalCost +
    oppCostInitial +
    totalOperating -
    assetValueAtEnd;

  // עלות מצטברת לפי שנה
  const cumulative: number[] = [];
  for (let y = 1; y <= yearsOfUse; y++) {
    const monthsAtYear = y * 12;
    const paymentsAtYear = leasingMonthlyPayment * monthsAtYear;
    const cumOpp = opportunityCost(leasingInitialPayment, alternativeInvestmentReturn, y);
    const cumOp = yearlyOperating * y;
    cumulative.push(leasingInitialPayment + paymentsAtYear + cumOpp + cumOp);
  }
  // הוסף את הקנייה הסופית בשנה האחרונה
  if (leasingBuysAtEnd && cumulative.length > 0) {
    cumulative[cumulative.length - 1] +=
      finalCost - calculateRemainingValue(input.carPrice, yearsOfUse);
  }

  const breakdown: { label: string; value: number; note?: string }[] = [
    { label: 'תשלום ראשוני', value: leasingInitialPayment },
    {
      label: `תשלומים חודשיים (${monthsOfUse} × ${leasingMonthlyPayment} ₪)`,
      value: totalMonthlyPayments,
    },
  ];

  if (leasingBuysAtEnd && leasingFinalPayment > 0) {
    breakdown.push({
      label: 'תשלום סופי (רכישת הרכב)',
      value: leasingFinalPayment,
    });
  }

  if (oppCostInitial > 0) {
    breakdown.push({
      label: `עלות הזדמנות על תשלום ראשוני (${alternativeInvestmentReturn}%)`,
      value: oppCostInitial,
    });
  }

  breakdown.push({
    label: 'עלויות תפעול מצטברות',
    value: totalOperating,
    note:
      leasingIncludesMaintenance && leasingIncludesInsurance
        ? 'ביטוח+תחזוקה כלולים בליסינג'
        : leasingIncludesInsurance
          ? 'ביטוח כלול בליסינג'
          : leasingIncludesMaintenance
            ? 'תחזוקה כלולה בליסינג'
            : 'לא כלול',
  });

  if (assetValueAtEnd > 0) {
    breakdown.push({
      label: 'ערך הרכב בסוף',
      value: -assetValueAtEnd,
      note: 'אם קנית את הרכב',
    });
  }

  return {
    method: 'leasing',
    label: 'ליסינג',
    totalCost,
    monthlyAverage: totalCost / monthsOfUse,
    opportunityCost: oppCostInitial,
    upfrontCash: leasingInitialPayment,
    totalMonthlyPayments,
    assetValueAtEnd,
    totalOperatingCosts: totalOperating,
    breakdown,
    cumulativeByYear: cumulative,
  };
}

// ===========================================================
// הפונקציה הראשית
// ===========================================================
export function compareVehicleOwnership(input: VehicleOwnershipInput): VehicleOwnershipResult {
  const cash = calculateCashOption(input);
  const loan = calculateLoanOption(input);
  const leasing = calculateLeasingOption(input);

  // מציאת הזולה ביותר
  const all: [PaymentMethod, number][] = [
    ['cash', cash.totalCost],
    ['loan', loan.totalCost],
    ['leasing', leasing.totalCost],
  ];
  all.sort((a, b) => a[1] - b[1]);
  const cheapest = all[0][0];
  const cheapestCost = all[0][1];

  // הפרשים יחסית לזולה
  const differences: Record<PaymentMethod, number> = {
    cash: cash.totalCost - cheapestCost,
    loan: loan.totalCost - cheapestCost,
    leasing: leasing.totalCost - cheapestCost,
  };

  const yearlyOperating = calculateYearlyOperatingCost(input);
  const totalKm = input.monthlyKm * 12 * input.yearsOfUse;
  const costPerKm: Record<PaymentMethod, number> = {
    cash: totalKm > 0 ? cash.totalCost / totalKm : 0,
    loan: totalKm > 0 ? loan.totalCost / totalKm : 0,
    leasing: totalKm > 0 ? leasing.totalCost / totalKm : 0,
  };

  // המלצות חכמות
  const recommendations: string[] = [];

  if (cheapest === 'cash') {
    if (input.alternativeInvestmentReturn < 5) {
      recommendations.push(
        `מימון עצמי הזול ביותר. עם זאת - אם תוכל להשקיע ב-${input.alternativeInvestmentReturn}%+ ריבית גבוהה יותר (ני"ע, נדל"ן), הלוואה יכולה להיות עדיפה.`,
      );
    } else {
      recommendations.push('מימון עצמי הזול ביותר גם אחרי עלות הזדמנות. רכישה במזומן מומלצת.');
    }
  } else if (cheapest === 'loan') {
    recommendations.push(
      `הלוואה הזולה ביותר - בהנחה שתשקיע את המקדמה ב-${input.alternativeInvestmentReturn}% תשואה. וודא שזה ריאלי.`,
    );
  } else if (cheapest === 'leasing') {
    recommendations.push('ליסינג הזול ביותר - כנראה כי כולל ביטוח/תחזוקה ואין מכירה בסוף.');
  }

  // המלצה לפי ק"מ
  if (input.monthlyKm > 2500) {
    recommendations.push(
      `אתה נוסע הרבה (${input.monthlyKm.toLocaleString('he-IL')} ק"מ/חודש). בליסינג בד"כ יש הגבלה ל-1,500-2,000 ק"מ/חודש - חריגה תעלה לך תוספת.`,
    );
  }

  // ירידת ערך
  const totalDepreciation = input.carPrice - calculateRemainingValue(input.carPrice, input.yearsOfUse);
  if (totalDepreciation / input.carPrice > 0.5) {
    recommendations.push(
      `הרכב יאבד ${Math.round((totalDepreciation / input.carPrice) * 100)}% מערכו ב-${input.yearsOfUse} שנים. אם אתה מתכנן להחליף בעוד 2-3 שנים, ליסינג עשוי להתאים.`,
    );
  }

  // עלות תפעול
  if (yearlyOperating > input.carPrice * 0.25) {
    recommendations.push(
      `עלויות התפעול גבוהות (>${Math.round((yearlyOperating / input.carPrice) * 100)}% מהמחיר בשנה). בדוק אם רכב חסכוני יותר משתלם.`,
    );
  }

  // עוסק מורשה
  if (input.vatRefundable) {
    recommendations.push(
      `כעוסק מורשה - תזכה ב-18% מע"מ חזרה על תשלומי הליסינג (בליסינג: ~${Math.round((input.leasingMonthlyPayment * 12 * 0.18) / 100) * 100} ₪/שנה).`,
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('הבחירה תלויה בהעדפותיך - תזרים מזומנים יציב (ליסינג/הלוואה) או חיסכון לטווח ארוך (מזומן).');
  }

  return {
    options: { cash, loan, leasing },
    cheapest,
    differences,
    yearlyOperatingCost: yearlyOperating,
    costPerKm,
    recommendations,
  };
}

// פונקציה רגרסיבית למילוי ברירות מחדל לפי סגמנט
export function getDefaultsForSegment(segment: CarSegment): Partial<VehicleOwnershipInput> {
  const insurance = INSURANCE_DEFAULTS[segment];
  const maintenance = MAINTENANCE_DEFAULTS[segment];
  return {
    insuranceMandatoryYearly: insurance.mandatory,
    insuranceComprehensiveYearly: insurance.comprehensive,
    licenseFeeYearly: LICENSE_FEE_DEFAULTS[segment],
    serviceYearly: maintenance.service,
    unexpectedRepairsYearly: maintenance.repairs,
    tiresSetPrice: maintenance.tires,
    annualInspection: ANNUAL_INSPECTION,
  };
}
