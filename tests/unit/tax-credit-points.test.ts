import { describe, expect, it } from 'vitest';
import {
  buildCreditPointsLedger,
  calculateDegreePoints,
  calculateImmigrantPoints,
  calculateSoldierPoints,
} from '@/lib/calculators/tax-credit-points';

describe('עולה חדש — דוגמת כל-זכות (עלייה 1.9.2020)', () => {
  const profile = { aliyahYear: 2020, aliyahMonth: 9 };
  it('2020: ארבעה חודשים × 1/4 = 1', () => expect(calculateImmigrantPoints('2020', profile)).toBeCloseTo(1, 6));
  it('2021: 12 חודשים × 1/4 = 3', () => expect(calculateImmigrantPoints('2021', profile)).toBeCloseTo(3, 6));
  it('2022: 2/4 + 10/6 ≈ 2.167', () => expect(calculateImmigrantPoints('2022', profile)).toBeCloseTo(2.1667, 3));
  it('2023: 2/6 + 10/12', () => expect(calculateImmigrantPoints('2023', profile)).toBeCloseTo(2 / 6 + 10 / 12, 6));
  it('2024: 2/12 ואז פוקעת הזכאות (42 חודשים)', () => expect(calculateImmigrantPoints('2024', profile)).toBeCloseTo(2 / 12, 6));
  it('2025: אין זכאות', () => expect(calculateImmigrantPoints('2025', profile)).toBe(0));
  it('לפני חודש העלייה אין זכאות', () => expect(calculateImmigrantPoints('2020', { aliyahYear: 2021, aliyahMonth: 1 })).toBe(0));
  it('עלייה מ-2022: 12 חודשים ראשונים × 1/12 = 1', () =>
    expect(calculateImmigrantPoints('2022', { aliyahYear: 2022, aliyahMonth: 1 })).toBeCloseTo(1, 6));
  it('עלייה מ-2022: 2023 = 12 חודשי 1/4 = 3', () =>
    expect(calculateImmigrantPoints('2023', { aliyahYear: 2022, aliyahMonth: 1 })).toBeCloseTo(1.5 + 1.5, 6));
});

describe('חייל משוחרר — דוגמת כל-זכות', () => {
  it('חיילת, 20 חודשי שירות, שחרור בפברואר 2025: נקודה אחת מ-3/2025 (10 חודשים)', () => {
    const points = calculateSoldierPoints('2025', 'female', { serviceType: 'army', serviceMonths: 20, dischargeYear: 2025, dischargeMonth: 2 });
    expect(points).toBeCloseTo(10 / 12, 6);
  });
  it('חייל 23+ חודשים מקבל 2 נקודות שנתיות', () => {
    const points = calculateSoldierPoints('2026' as never, 'male', { serviceType: 'army', serviceMonths: 32, dischargeYear: 2024, dischargeMonth: 12 });
    expect(points).toBeCloseTo(2, 6);
  });
  it('הזכאות פוקעת אחרי 36 חודשים', () => {
    expect(calculateSoldierPoints('2025', 'male', { serviceType: 'army', serviceMonths: 32, dischargeYear: 2021, dischargeMonth: 6 })).toBe(0);
  });
  it('חיילת 22 חודשים = 2 נקודות; 21 חודשים = 1', () => {
    const a = calculateSoldierPoints('2025', 'female', { serviceType: 'army', serviceMonths: 22, dischargeYear: 2024, dischargeMonth: 12 });
    const b = calculateSoldierPoints('2025', 'female', { serviceType: 'army', serviceMonths: 21, dischargeYear: 2024, dischargeMonth: 12 });
    expect([a, b]).toEqual([2, 1]);
  });
  it('שירות לאומי 24 חודשים = 2', () =>
    expect(calculateSoldierPoints('2025', 'male', { serviceType: 'national', serviceMonths: 24, dischargeYear: 2024, dischargeMonth: 12 })).toBe(2));
  it('שירות קצר מ-12 חודשים נדחה', () =>
    expect(() => calculateSoldierPoints('2025', 'male', { serviceType: 'army', serviceMonths: 8, dischargeYear: 2024, dischargeMonth: 12 })).toThrow());
});

describe('תואר אקדמי — לוח עזר 2024', () => {
  it('ראשון: נקודה מהשנה שאחרי הסיום עד 3 שנות מס', () => {
    const p = { degree: 'first' as const, completionYear: 2023, studyYears: 3 };
    expect(calculateDegreePoints('2023', p)).toBe(0);
    expect(calculateDegreePoints('2024', p)).toBe(1);
    expect(calculateDegreePoints('2025', p)).toBe(1);
  });
  it('שנות הלימוד מגבילות: שנת לימוד אחת = שנת זיכוי אחת', () => {
    const p = { degree: 'first' as const, completionYear: 2023, studyYears: 1 };
    expect(calculateDegreePoints('2024', p)).toBe(1);
    expect(calculateDegreePoints('2025', p)).toBe(0);
  });
  it('שני: חצי נקודה', () => expect(calculateDegreePoints('2024', { degree: 'second', completionYear: 2023, studyYears: 2 })).toBe(0.5));
  it('מסיימי 2022 ומטה נדחים', () =>
    expect(() => calculateDegreePoints('2024', { degree: 'first', completionYear: 2022, studyYears: 3 })).toThrow());
});

describe('ספר נקודות מלא', () => {
  it('אישה נשואה עם ילד בן 4 ב-2025 וחיילת משוחררת', () => {
    const ledger = buildCreditPointsLedger({
      taxYear: '2025',
      gender: 'female',
      childBirthYears: [2021],
      marriedWholeYear: true,
      soldier: { serviceType: 'army', serviceMonths: 24, dischargeYear: 2024, dischargeMonth: 12 },
    });
    // 2.75 בסיס + 4.5? ילד בן 4 ב-2025 => 2.5; חיילת 2 נקודות
    expect(ledger.total).toBeCloseTo(2.75 + 2.5 + 2, 6);
  });
  it('ילדים דורשים אישור נישואין', () =>
    expect(() => buildCreditPointsLedger({ taxYear: '2025', gender: 'male', childBirthYears: [2020] })).toThrow());
});
