import { describe, it, expect } from 'vitest';
import { calculateBreakEven } from '@/lib/calculators/break-even';

// =====================================================
// Break-Even
// =====================================================
describe('calculateBreakEven', () => {
  it('עסק רגיל - חישוב נכון', () => {
    const r = calculateBreakEven({
      fixedCosts: 10_000,
      variableCostPerUnit: 30,
      pricePerUnit: 100,
    });
    expect(r.contributionPerUnit).toBe(70);
    expect(r.breakEvenUnits).toBeCloseTo(142.86, 1);
    expect(r.breakEvenRevenue).toBeCloseTo(14_286, 0);
    expect(r.contributionMarginPct).toBe(70);
  });

  it('מחיר נמוך מעלות → לא תקין', () => {
    const r = calculateBreakEven({
      fixedCosts: 5_000,
      variableCostPerUnit: 100,
      pricePerUnit: 80,
    });
    expect(r.isValid).toBe(false);
    expect(r.warning).toBeDefined();
  });

  it('Margin of Safety - חישוב נכון', () => {
    const r = calculateBreakEven({
      fixedCosts: 10_000,
      variableCostPerUnit: 30,
      pricePerUnit: 100,
      expectedUnits: 200,
    });
    // BE = ~143, expected 200 → MoS = 57 units = 28.5%
    expect(r.marginOfSafetyUnits).toBeCloseTo(57.14, 1);
    expect(r.marginOfSafetyPct).toBeCloseTo(28.6, 1);
    expect(r.expectedProfit).toBe(200 * 70 - 10_000);
  });

  it('יחידות לרווח מטרה', () => {
    const r = calculateBreakEven({
      fixedCosts: 10_000,
      variableCostPerUnit: 30,
      pricePerUnit: 100,
      targetProfit: 7_000,
    });
    // (10,000 + 7,000) / 70 = 242.86
    expect(r.unitsForTargetProfit).toBeCloseTo(242.86, 1);
  });
});
