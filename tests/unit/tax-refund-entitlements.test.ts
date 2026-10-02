import { describe, expect, it } from 'vitest';
import { calculateRefundChildPoints } from '@/lib/calculators/tax-refund-entitlements';

describe('נקודות לילדים לפי שנת המס, בהורות נשואה רגילה', () => {
  it('מבדיל בין הוראת השעה לגיל 6–12 לבין ההרחבה לגיל 17', () => {
    expect(calculateRefundChildPoints('2021', 2010, 'father')).toBe(0);
    expect(calculateRefundChildPoints('2022', 2010, 'father')).toBe(1);
    expect(calculateRefundChildPoints('2023', 2010, 'father')).toBe(0);
    expect(calculateRefundChildPoints('2024', 2010, 'father')).toBe(1);
    expect(calculateRefundChildPoints('2024', 2010, 'mother')).toBe(2);
  });

  it('מחיל את ההגדלה לפעוטות משנת 2024 בלבד', () => {
    expect(calculateRefundChildPoints('2023', 2023, 'mother')).toBe(1.5);
    expect(calculateRefundChildPoints('2024', 2024, 'mother')).toBe(2.5);
    expect(calculateRefundChildPoints('2024', 2023, 'father')).toBe(4.5);
    expect(calculateRefundChildPoints('2025', 2023, 'father')).toBe(4.5);
    expect(calculateRefundChildPoints('2025', 2022, 'father')).toBe(3.5);
    expect(calculateRefundChildPoints('2025', 2021, 'mother')).toBe(2.5);
  });

  it('משתמש בגיל בשנת המס ומבדיל בין ההורים בגיל 18', () => {
    expect(calculateRefundChildPoints('2025', 2007, 'mother')).toBe(0.5);
    expect(calculateRefundChildPoints('2025', 2007, 'father')).toBe(0);
    expect(() => calculateRefundChildPoints('2025', 2026, 'mother')).toThrow();
    expect(() => calculateRefundChildPoints('2025', 2006, 'mother')).toThrow();
    expect(() => calculateRefundChildPoints('2025', 2020.5, 'mother')).toThrow();
  });
});
