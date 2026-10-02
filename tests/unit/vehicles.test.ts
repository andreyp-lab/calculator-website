import { describe, expect, it } from 'vitest';
import { calculateFuelCost, FUEL_PRICES_2026 } from '@/lib/calculators/vehicles';

describe('fuel cost calculator', () => {
  it('uses the October 2026 regulated gasoline-95 ceiling as the default', () => {
    expect(FUEL_PRICES_2026.gasoline_95).toBe(8.27);

    const result = calculateFuelCost({
      monthlyKm: 1_500,
      fuelEfficiency: 7,
      fuelType: 'gasoline_95',
      customPrice: 0,
      useCustomPrice: false,
    });

    expect(result.fuelPerMonth).toBe(105);
    expect(result.monthlyCost).toBeCloseTo(868.35, 8);
    expect(result.pricePerUnit).toBe(8.27);
  });

  it('keeps an explicitly entered current price separate from the default', () => {
    const result = calculateFuelCost({
      monthlyKm: 1_000,
      fuelEfficiency: 6,
      fuelType: 'gasoline_95',
      customPrice: 8.1,
      useCustomPrice: true,
    });

    expect(result.monthlyCost).toBeCloseTo(486, 8);
    expect(result.pricePerUnit).toBe(8.1);
  });
});
