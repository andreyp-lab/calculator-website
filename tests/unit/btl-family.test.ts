import { describe, it, expect } from 'vitest';
import {
  calculateBirthGrant,
  calculateChildAllowance,
  calculateMaternityAllowance,
  maternityTrack,
} from '@/lib/calculators/btl-family';
import {
  BIRTH_GRANT_2026,
  CHILDREN_ALLOWANCE_2026,
  MATERNITY_ALLOWANCE_2026,
} from '@/lib/constants/tax-2026';

describe('constants match the BTL pages read on 2026-11-20', () => {
  it('child allowance 173 / 219 / 219 / 219 / 173', () => {
    expect([
      CHILDREN_ALLOWANCE_2026.firstChild,
      CHILDREN_ALLOWANCE_2026.secondChild,
      CHILDREN_ALLOWANCE_2026.thirdChild,
      CHILDREN_ALLOWANCE_2026.fourthChild,
      CHILDREN_ALLOWANCE_2026.fifthAndAbove,
    ]).toEqual([173, 219, 219, 219, 173]);
  });
  it('birth grant and maternity cap', () => {
    expect(BIRTH_GRANT_2026.firstChild).toBe(2103);
    expect(BIRTH_GRANT_2026.twins).toBe(10514);
    expect(MATERNITY_ALLOWANCE_2026.maxDaily).toBe(1752.33);
  });
});

describe('calculateChildAllowance', () => {
  it('no children → 0', () => {
    const r = calculateChildAllowance(0)!;
    expect(r.monthly).toBe(0);
    expect(r.rows).toHaveLength(0);
  });
  it('one child', () => {
    expect(calculateChildAllowance(1)!.monthly).toBe(173);
  });
  it('three children: 173 + 219 + 219', () => {
    const r = calculateChildAllowance(3)!;
    expect(r.monthly).toBe(611);
    expect(r.annual).toBe(7332);
    expect(r.monthlyWithSupplement).toBe(611 + 113);
  });
  it('five children: the fifth drops back to 173; supplement only on 3rd and 4th', () => {
    const r = calculateChildAllowance(5)!;
    expect(r.rows.map((x) => x.amount)).toEqual([173, 219, 219, 219, 173]);
    expect(r.monthly).toBe(1003);
    expect(r.monthlyWithSupplement).toBe(1003 + 226);
  });
  it('rejects invalid input', () => {
    expect(calculateChildAllowance(-1)).toBeNull();
    expect(calculateChildAllowance(1.5)).toBeNull();
    expect(calculateChildAllowance(31)).toBeNull();
  });
});

describe('calculateBirthGrant', () => {
  it('single births by family size', () => {
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 1, newborns: 1 })).toBe(2103);
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 2, newborns: 1 })).toBe(946);
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 3, newborns: 1 })).toBe(631);
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 7, newborns: 1 })).toBe(631);
  });
  it('multiple births', () => {
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 2, newborns: 2 })).toBe(10514);
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 4, newborns: 3 })).toBe(15771);
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 4, newborns: 4 })).toBe(15771 + 5257);
  });
  it('rejects invalid combinations', () => {
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 1, newborns: 2 })).toBeNull();
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 2, newborns: 0 })).toBeNull();
    expect(calculateBirthGrant({ childrenInFamilyAfterBirth: 2.5, newborns: 1 })).toBeNull();
  });
});

describe('maternity allowance', () => {
  it('track by contribution months', () => {
    expect(maternityTrack(10, 10)).toBe('full');
    expect(maternityTrack(9, 15)).toBe('full'); // 15 מתוך 22
    expect(maternityTrack(9, 14)).toBe('partial'); // 9 מתוך 14 < 10, אך ≥ 6
    expect(maternityTrack(6, 6)).toBe('partial');
    expect(maternityTrack(5, 12)).toBe('none');
  });

  it('uses the higher of the 3- and 6-month daily averages', () => {
    const r = calculateMaternityAllowance({
      wages3Months: 27000, // 300/יום
      wages6Months: 36000, // 200/יום
      contributedOf14: 12,
      contributedOf22: 12,
    })!;
    expect(r.dailyBeforeCap).toBe(300);
    expect(r.daily).toBe(300);
    expect(r.capped).toBe(false);
    expect(r.days).toBe(105);
    expect(r.total).toBe(31500);
  });

  it('applies the daily cap', () => {
    const r = calculateMaternityAllowance({
      wages3Months: 270000, // 3,000/יום
      wages6Months: 300000,
      contributedOf14: 14,
      contributedOf22: 22,
    })!;
    expect(r.capped).toBe(true);
    expect(r.daily).toBe(1752.33);
    expect(r.total).toBe(Math.round(1752.33 * 105 * 100) / 100);
  });

  it('partial track pays 56 days; none pays 0', () => {
    const partial = calculateMaternityAllowance({ wages3Months: 9000, wages6Months: 18000, contributedOf14: 7, contributedOf22: 7 })!;
    expect(partial.track).toBe('partial');
    expect(partial.days).toBe(56);
    expect(partial.total).toBe(5600);
    const none = calculateMaternityAllowance({ wages3Months: 9000, wages6Months: 18000, contributedOf14: 3, contributedOf22: 3 })!;
    expect(none.track).toBe('none');
    expect(none.total).toBe(0);
  });

  it('rejects invalid input', () => {
    expect(calculateMaternityAllowance({ wages3Months: -1, wages6Months: 0, contributedOf14: 5, contributedOf22: 5 })).toBeNull();
    expect(calculateMaternityAllowance({ wages3Months: 1, wages6Months: 1, contributedOf14: 15, contributedOf22: 15 })).toBeNull();
    expect(calculateMaternityAllowance({ wages3Months: 1, wages6Months: 1, contributedOf14: 10, contributedOf22: 5 })).toBeNull();
    expect(calculateMaternityAllowance({ wages3Months: NaN, wages6Months: 1, contributedOf14: 5, contributedOf22: 5 })).toBeNull();
  });
});
