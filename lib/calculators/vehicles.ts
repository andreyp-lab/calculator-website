/**
 * מחשבוני רכב ותחבורה
 *
 * 1. עלות דלק (חודשי/שנתי)
 * 2. ליסינג vs קנייה
 */

// ============================================================
// 1. FUEL COST CALCULATOR
// ============================================================

export type FuelType = 'gasoline_95' | 'gasoline_98' | 'diesel' | 'electric';

// מחירי דלק ממוצעים בישראל 2026 (ש"ח לליטר/קוט"ש)
export const FUEL_PRICES_2026: Record<FuelType, number> = {
  gasoline_95: 7.45, // בנזין 95
  gasoline_98: 7.85, // בנזין 98
  diesel: 6.95, // סולר
  electric: 0.55, // חשמל לקוט"ש
};

export const FUEL_LABELS: Record<FuelType, string> = {
  gasoline_95: 'בנזין 95',
  gasoline_98: 'בנזין 98',
  diesel: 'סולר',
  electric: 'חשמל',
};

export interface FuelCostInput {
  monthlyKm: number; // ק"מ בחודש
  fuelEfficiency: number; // ליטר/100ק"מ או קוט"ש/100ק"מ
  fuelType: FuelType;
  customPrice: number; // אם המשתמש רוצה להזין מחיר אחר
  useCustomPrice: boolean;
}

export interface FuelCostResult {
  monthlyCost: number;
  yearlyCost: number;
  costPerKm: number;
  fuelPerMonth: number; // ליטרים/קוט"ש בחודש
  pricePerUnit: number;
}

export function calculateFuelCost(input: FuelCostInput): FuelCostResult {
  const { monthlyKm, fuelEfficiency, fuelType, customPrice, useCustomPrice } = input;

  if (monthlyKm <= 0 || fuelEfficiency <= 0) {
    return {
      monthlyCost: 0,
      yearlyCost: 0,
      costPerKm: 0,
      fuelPerMonth: 0,
      pricePerUnit: 0,
    };
  }

  const pricePerUnit = useCustomPrice ? customPrice : FUEL_PRICES_2026[fuelType];

  // צריכת דלק חודשית = (ק"מ × יעילות) / 100
  const fuelPerMonth = (monthlyKm * fuelEfficiency) / 100;
  const monthlyCost = fuelPerMonth * pricePerUnit;
  const yearlyCost = monthlyCost * 12;
  const costPerKm = monthlyCost / monthlyKm;

  return {
    monthlyCost,
    yearlyCost,
    costPerKm,
    fuelPerMonth,
    pricePerUnit,
  };
}

// ============================================================
// 2. LEASING vs BUYING
// ============================================================

export interface LeasingInput {
  carPrice: number; // מחיר הרכב
  yearsOfUse: number; // כמה שנים תשתמש
  // ליסינג:
  leasingMonthlyPayment: number;
  leasingDownPayment: number;
  leasingFinalPayment: number; // שווי שיורי
  // קנייה:
  loanAmount: number;
  loanTermMonths: number;
  loanRate: number;
  buyingDownPayment: number;
  carDepreciationRate: number; // % שנתי (בד"כ 15-20%)
  // משותף:
  monthlyKm: number;
  fuelMonthlyCost: number;
  insuranceYearly: number;
  maintenanceYearly: number;
}

export interface LeasingComparisonResult {
  leasing: {
    totalCost: number;
    monthlyAvg: number;
    breakdown: { label: string; value: number }[];
  };
  buying: {
    totalCost: number;
    monthlyAvg: number;
    finalCarValue: number;
    breakdown: { label: string; value: number; note?: string }[];
  };
  recommendation: 'leasing' | 'buying' | 'similar';
  difference: number; // הפרש בשח (חיובי = ליסינג זול יותר)
}

export function compareLeasingVsBuying(input: LeasingInput): LeasingComparisonResult {
  const {
    carPrice,
    yearsOfUse,
    leasingMonthlyPayment,
    leasingDownPayment,
    leasingFinalPayment,
    loanAmount,
    loanTermMonths,
    loanRate,
    buyingDownPayment,
    carDepreciationRate,
    insuranceYearly,
    maintenanceYearly,
    fuelMonthlyCost,
  } = input;

  const monthsOfUse = yearsOfUse * 12;

  // ============= ליסינג =============
  const leasingTotalPayments = leasingMonthlyPayment * monthsOfUse;
  const leasingFuel = fuelMonthlyCost * monthsOfUse;
  const leasingInsurance = insuranceYearly * yearsOfUse;
  // ליסינג בד"כ כולל תחזוקה - אבל נחשב על פי הקלט
  const leasingTotal =
    leasingDownPayment +
    leasingTotalPayments +
    leasingFinalPayment +
    leasingFuel +
    leasingInsurance;

  // ============= קנייה =============
  // חישוב הלוואה (PMT formula)
  const monthlyR = loanRate / 100 / 12;
  const monthlyLoanPayment =
    loanAmount > 0 && loanTermMonths > 0
      ? monthlyR === 0
        ? loanAmount / loanTermMonths
        : (loanAmount * (monthlyR * Math.pow(1 + monthlyR, loanTermMonths))) /
          (Math.pow(1 + monthlyR, loanTermMonths) - 1)
      : 0;

  // כמה תשלומים תשלם בפועל
  const actualLoanPayments = Math.min(monthsOfUse, loanTermMonths);
  const totalLoanPayment = monthlyLoanPayment * actualLoanPayments;

  // עלות תחזוקה (גבוהה יותר ברכב פרטי)
  const buyingMaintenance = maintenanceYearly * yearsOfUse;
  const buyingInsurance = insuranceYearly * yearsOfUse;
  const buyingFuel = fuelMonthlyCost * monthsOfUse;

  // שווי שיורי של הרכב (ירידת ערך)
  const finalCarValue = carPrice * Math.pow(1 - carDepreciationRate / 100, yearsOfUse);

  // העלות נטו = כל מה ששילמת - שווי הרכב הנותר
  const buyingTotal =
    buyingDownPayment +
    totalLoanPayment +
    buyingFuel +
    buyingInsurance +
    buyingMaintenance -
    finalCarValue; // נמכרת אותו ומקבלת חזרה

  // המלצה
  const difference = buyingTotal - leasingTotal; // חיובי = ליסינג זול יותר
  let recommendation: LeasingComparisonResult['recommendation'];
  if (Math.abs(difference) < carPrice * 0.05) {
    recommendation = 'similar';
  } else if (difference > 0) {
    recommendation = 'leasing';
  } else {
    recommendation = 'buying';
  }

  return {
    leasing: {
      totalCost: leasingTotal,
      monthlyAvg: leasingTotal / monthsOfUse,
      breakdown: [
        { label: 'מקדמה', value: leasingDownPayment },
        { label: 'תשלומים חודשיים', value: leasingTotalPayments },
        { label: 'תשלום סופי', value: leasingFinalPayment },
        { label: 'דלק', value: leasingFuel },
        { label: 'ביטוח', value: leasingInsurance },
      ],
    },
    buying: {
      totalCost: buyingTotal,
      monthlyAvg: buyingTotal / monthsOfUse,
      finalCarValue,
      breakdown: [
        { label: 'מקדמה', value: buyingDownPayment },
        { label: 'תשלומי הלוואה', value: totalLoanPayment },
        { label: 'דלק', value: buyingFuel },
        { label: 'ביטוח', value: buyingInsurance },
        { label: 'תחזוקה', value: buyingMaintenance },
        { label: 'שווי רכב נותר', value: -finalCarValue, note: 'תקבל חזרה במכירה' },
      ],
    },
    recommendation,
    difference: Math.abs(difference),
  };
}
