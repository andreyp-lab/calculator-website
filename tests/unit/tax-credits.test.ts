import { describe, it, expect } from 'vitest';
import { calculateTaxCredits } from '@/lib/calculators/tax-credits';

describe('calculateTaxCredits', () => {
  const baseInput = {
    isResident: true,
    gender: 'male' as const,
    age: 30,
    isMarried: false,
    isSingleParent: false,
    childrenAge0: 0,
    childrenAge1to5: 0,
    childrenAge6to17: 0,
    childrenAge18: 0,
    disabledChildren: 0,
    isReleasedSoldier: false,
    yearsSinceRelease: 0,
    isNewImmigrant: false,
    monthsSinceImmigration: 0,
    hasBachelorDegree: false,
    hasMasterDegree: false,
  };

  it('תושב גבר רווק - 2.25 נקודות', () => {
    const result = calculateTaxCredits(baseInput);
    expect(result.totalPoints).toBe(2.25);
    expect(result.monthlyValue).toBeCloseTo(2.25 * 242, 0);
    expect(result.yearlyValue).toBeCloseTo(2.25 * 242 * 12, 0);
  });

  it('אישה - 2.75 נקודות', () => {
    const result = calculateTaxCredits({ ...baseInput, gender: 'female' });
    expect(result.totalPoints).toBe(2.75);
  });

  it('אישה עם 2 ילדים בני 1-5', () => {
    const result = calculateTaxCredits({
      ...baseInput,
      gender: 'female',
      childrenAge1to5: 2,
    });
    // 2.25 + 0.5 + (2.5 × 2) = 7.75
    expect(result.totalPoints).toBe(7.75);
    expect(result.monthlyValue).toBeCloseTo(7.75 * 242, 0);
  });

  it('הורה יחיד - +1 נקודה', () => {
    const result = calculateTaxCredits({ ...baseInput, isSingleParent: true });
    expect(result.totalPoints).toBe(3.25);
  });

  it('חייל משוחרר עם תואר ראשון', () => {
    const result = calculateTaxCredits({
      ...baseInput,
      isReleasedSoldier: true,
      yearsSinceRelease: 1,
      hasBachelorDegree: true,
    });
    // 2.25 + 2 + 1 = 5.25
    expect(result.totalPoints).toBe(5.25);
  });

  it('עולה חדש - 18 חודשים ראשונים', () => {
    const result = calculateTaxCredits({
      ...baseInput,
      isNewImmigrant: true,
      monthsSinceImmigration: 12,
    });
    // 2.25 + 3 = 5.25
    expect(result.totalPoints).toBe(5.25);
  });

  it('עולה חדש - חודשים 19-30', () => {
    const result = calculateTaxCredits({
      ...baseInput,
      isNewImmigrant: true,
      monthsSinceImmigration: 24,
    });
    // 2.25 + 2 = 4.25
    expect(result.totalPoints).toBe(4.25);
  });

  it('לא תושב - 0 נקודות', () => {
    const result = calculateTaxCredits({ ...baseInput, isResident: false });
    expect(result.totalPoints).toBe(0);
  });
});
