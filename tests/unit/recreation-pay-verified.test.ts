import { describe, it, expect } from 'vitest';
import { calculatePrivateRecreationEstimate, privateDaysForCompletedYears } from '@/lib/calculators/recreation-pay-verified';

describe('private-sector recreation pay baseline', () => {
  it('does not show entitlement before a completed year', () => {
    expect(privateDaysForCompletedYears(0.99)).toBe(0);
  });
  it('uses the private-sector tenure table and part-time proportion', () => {
    expect(calculatePrivateRecreationEstimate(5, 60)).toEqual({ daysEntitled: 7, dayRate: 418, grossEstimate: 1755.6 });
  });
  it('lets users enter their applicable collective-agreement day rate', () => {
    expect(calculatePrivateRecreationEstimate(5, 100, 500).grossEstimate).toBe(3500);
  });
});
