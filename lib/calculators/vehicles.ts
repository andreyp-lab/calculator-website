/**
 * מחשבוני רכב ותחבורה
 *
 * עלות דלק (חודשי/שנתי)
 */

// ============================================================
// 1. FUEL COST CALCULATOR
// ============================================================

import { MACRO_DATA } from '@/lib/data/macroeconomic-data';

export type FuelType = 'gasoline_95' | 'gasoline_98' | 'diesel' | 'electric';

// בנזין 95: מחיר מרבי בפיקוח מ-1.10.2026; היתר הנחות דוגמה להחלפה בקלט המשתמש
export const FUEL_PRICES_2026: Record<FuelType, number> = {
  gasoline_95: MACRO_DATA.fuelPrices.gasoline95,
  gasoline_98: MACRO_DATA.fuelPrices.gasoline98,
  diesel: MACRO_DATA.fuelPrices.diesel,
  electric: MACRO_DATA.fuelPrices.electric,
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
