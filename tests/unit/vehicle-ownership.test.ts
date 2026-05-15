import { describe, it, expect } from 'vitest';
import {
  compareVehicleOwnership,
  calculateRemainingValue,
  getDefaultsForSegment,
  type VehicleOwnershipInput,
} from '@/lib/calculators/vehicle-ownership';

const baseInput: VehicleOwnershipInput = {
  carPrice: 180_000,
  carSegment: 'family',
  yearsOfUse: 5,
  fuelType: 'gasoline_95',
  fuelEfficiency: 7.5,
  monthlyKm: 1500,
  cashPrice: 175_000,
  alternativeInvestmentReturn: 6,
  loanDownPayment: 50_000,
  loanAmount: 130_000,
  loanTermMonths: 60,
  loanRate: 6.5,
  loanIncludeOpportunityCostOnDP: true,
  leasingMonthlyPayment: 2400,
  leasingInitialPayment: 8000,
  leasingFinalPayment: 0,
  leasingBuysAtEnd: false,
  leasingIncludesMaintenance: true,
  leasingIncludesInsurance: false,
  insuranceMandatoryYearly: 1300,
  insuranceComprehensiveYearly: 3800,
  licenseFeeYearly: 1850,
  annualInspection: 230,
  serviceYearly: 2400,
  unexpectedRepairsYearly: 2000,
  tiresEveryKm: 50_000,
  tiresSetPrice: 1800,
  parkingYearly: 0,
  tollsMonthly: 0,
  vatRefundable: false,
};

describe('calculateRemainingValue', () => {
  it('שנה 1 - איבוד כ-22%', () => {
    const v = calculateRemainingValue(100_000, 1);
    expect(v).toBeCloseTo(78_000, -2); // ~22% depreciation
  });

  it('5 שנים - איבוד מצטבר ~55%', () => {
    const v = calculateRemainingValue(100_000, 5);
    // 0.78 * 0.85 * 0.88 * 0.90 * 0.92 ≈ 0.483
    expect(v).toBeGreaterThan(40_000);
    expect(v).toBeLessThan(55_000);
  });

  it('10 שנים - איבוד עמוק', () => {
    const v = calculateRemainingValue(100_000, 10);
    expect(v).toBeLessThan(40_000);
    expect(v).toBeGreaterThan(25_000);
  });

  it('0 שנים - הערך המקורי', () => {
    expect(calculateRemainingValue(180_000, 0)).toBe(180_000);
  });
});

describe('compareVehicleOwnership', () => {
  it('מחזיר 3 אופציות', () => {
    const r = compareVehicleOwnership(baseInput);
    expect(r.options.cash).toBeDefined();
    expect(r.options.loan).toBeDefined();
    expect(r.options.leasing).toBeDefined();
  });

  it('מציאת הזולה ביותר', () => {
    const r = compareVehicleOwnership(baseInput);
    const minCost = Math.min(
      r.options.cash.totalCost,
      r.options.loan.totalCost,
      r.options.leasing.totalCost,
    );
    expect(r.options[r.cheapest].totalCost).toBe(minCost);
  });

  it('עלות הזדמנות נכללת במזומן', () => {
    const r = compareVehicleOwnership(baseInput);
    expect(r.options.cash.opportunityCost).toBeGreaterThan(0);
    // 175K @ 6% × 5y - 175K ≈ 59K
    expect(r.options.cash.opportunityCost).toBeGreaterThan(50_000);
    expect(r.options.cash.opportunityCost).toBeLessThan(80_000);
  });

  it('עלות הזדמנות 0% = אין השפעה על מזומן', () => {
    const r = compareVehicleOwnership({ ...baseInput, alternativeInvestmentReturn: 0 });
    expect(r.options.cash.opportunityCost).toBe(0);
  });

  it('עלויות תפעול שנתיות נכונות', () => {
    const r = compareVehicleOwnership(baseInput);
    // fuel: 1500*12*7.5/100*7.45 ≈ 10,058
    // tires: 1500*12/50000*1800 = 648
    // insurance: 1300+3800 = 5100
    // service+repairs: 2400+2000 = 4400
    // license: 1850
    // inspection: 230
    // total ≈ 22,286
    expect(r.yearlyOperatingCost).toBeGreaterThan(20_000);
    expect(r.yearlyOperatingCost).toBeLessThan(25_000);
  });

  it('יותר שנים = יותר עלות תפעול', () => {
    const r5 = compareVehicleOwnership(baseInput);
    const r10 = compareVehicleOwnership({ ...baseInput, yearsOfUse: 10 });
    expect(r10.options.cash.totalOperatingCosts).toBeGreaterThan(
      r5.options.cash.totalOperatingCosts,
    );
  });

  it('ליסינג בלי קנייה בסוף = אין asset value', () => {
    const r = compareVehicleOwnership(baseInput);
    expect(r.options.leasing.assetValueAtEnd).toBe(0);
  });

  it('ליסינג עם קנייה בסוף = יש asset value', () => {
    const r = compareVehicleOwnership({
      ...baseInput,
      leasingBuysAtEnd: true,
      leasingFinalPayment: 50_000,
    });
    expect(r.options.leasing.assetValueAtEnd).toBeGreaterThan(0);
  });

  it('הלוואה: עלות הזדמנות רק על המקדמה', () => {
    const r = compareVehicleOwnership(baseInput);
    // 50K @ 6% × 5y ≈ 16,920
    expect(r.options.loan.opportunityCost).toBeGreaterThan(10_000);
    expect(r.options.loan.opportunityCost).toBeLessThan(25_000);
  });

  it('הלוואה ללא opportunity cost flag = 0', () => {
    const r = compareVehicleOwnership({
      ...baseInput,
      loanIncludeOpportunityCostOnDP: false,
    });
    expect(r.options.loan.opportunityCost).toBe(0);
  });

  it('עלות לק"מ חיובית', () => {
    const r = compareVehicleOwnership(baseInput);
    expect(r.costPerKm.cash).toBeGreaterThan(0);
    expect(r.costPerKm.loan).toBeGreaterThan(0);
    expect(r.costPerKm.leasing).toBeGreaterThan(0);
  });

  it('cumulativeByYear אורכו = yearsOfUse', () => {
    const r = compareVehicleOwnership(baseInput);
    expect(r.options.cash.cumulativeByYear).toHaveLength(5);
    expect(r.options.loan.cumulativeByYear).toHaveLength(5);
    expect(r.options.leasing.cumulativeByYear).toHaveLength(5);
  });

  it('המלצות לפי 1+', () => {
    const r = compareVehicleOwnership(baseInput);
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  it('SUV יקר יותר מ-mini בעלויות תפעול', () => {
    const mini = compareVehicleOwnership({
      ...baseInput,
      carSegment: 'mini',
      ...getDefaultsForSegment('mini'),
    });
    const suv = compareVehicleOwnership({
      ...baseInput,
      carSegment: 'suv',
      ...getDefaultsForSegment('suv'),
    });
    expect(suv.yearlyOperatingCost).toBeGreaterThan(mini.yearlyOperatingCost);
  });
});

describe('getDefaultsForSegment', () => {
  it('מחזיר ערכים תקינים לכל סגמנט', () => {
    const segs = ['mini', 'family', 'executive', 'suv', 'luxury'] as const;
    for (const seg of segs) {
      const d = getDefaultsForSegment(seg);
      expect(d.insuranceMandatoryYearly).toBeGreaterThan(0);
      expect(d.licenseFeeYearly).toBeGreaterThan(0);
      expect(d.serviceYearly).toBeGreaterThan(0);
    }
  });

  it('luxury גבוה ממיני בכל קטגוריה', () => {
    const mini = getDefaultsForSegment('mini');
    const lux = getDefaultsForSegment('luxury');
    expect(lux.insuranceMandatoryYearly!).toBeGreaterThan(mini.insuranceMandatoryYearly!);
    expect(lux.licenseFeeYearly!).toBeGreaterThan(mini.licenseFeeYearly!);
    expect(lux.serviceYearly!).toBeGreaterThan(mini.serviceYearly!);
  });
});
