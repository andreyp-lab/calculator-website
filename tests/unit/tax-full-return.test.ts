import { describe, expect, it } from 'vitest';
import { calculateFullReturn, residentialExemptTaxable, type FullReturnInput } from '@/lib/calculators/tax-full-return';
import { calculateTaxRefund } from '@/lib/calculators/tax-refund';

const wage = (income: number, withheld = 0) => ({ taxableIncome: income, taxWithheld: withheld, insuredIncome: income, employeePensionContributions: 0 });
const base = (overrides: Partial<FullReturnInput>): FullReturnInput => ({
  taxYear: '2024',
  wageSources: [wage(100_000)],
  credits: { gender: 'male' },
  ...overrides,
});
const line = (r: ReturnType<typeof calculateFullReturn>, label: string) => r.lines.find((l) => l.label === label)?.value;

describe('עקביות מול מנוע ההחזר הבסיסי', () => {
  it('שכיר בלבד — אותה תוצאה כמו דוגמת עמוד ההחזר (3,993.80)', () => {
    const sources = [{ taxableIncome: 180_000, taxWithheld: 20_000, insuredIncome: 180_000, employeePensionContributions: 10_800 }];
    const simple = calculateTaxRefund({ taxYear: '2025', incomeSources: sources, creditPoints: 2.25 });
    const full = calculateFullReturn({ taxYear: '2025', wageSources: sources, credits: { gender: 'male' } });
    expect(full.estimatedRefund).toBeCloseTo(simple.estimatedRefund, 2);
    expect(full.estimatedRefund).toBeCloseTo(3_993.8, 2);
  });
});

describe('שכר דירה למגורים', () => {
  it('מסלול פטור: 7,000 בחודש ב-2024 → 2,692 חייב בחודש', () => {
    expect(residentialExemptTaxable(7_000, 5_654)).toBe(2_692);
    expect(residentialExemptTaxable(5_000, 5_654)).toBe(0);
    expect(residentialExemptTaxable(11_308, 5_654)).toBe(11_308);
  });
  it('עד גיל 60 החלק החייב ממוסה ב-31% לפחות', () => {
    const r = calculateFullReturn(base({ residentialRental: { track: 'exempt', monthlyRent: 7_000, months: 12 } }));
    expect(line(r, 'מס לפי מדרגות על השכר')).toBeCloseTo(10_635.2, 2);
    expect(line(r, 'מס על הכנסה שאינה מיגיעה אישית')).toBeCloseTo(32_304 * 0.31, 2);
  });
  it('מגיל 60 — מדרגות מופחתות', () => {
    const r = calculateFullReturn(base({ age60OrOver: true, residentialRental: { track: 'exempt', monthlyRent: 7_000, months: 12 } }));
    expect(line(r, 'מס על הכנסה שאינה מיגיעה אישית')).toBeCloseTo(20_720 * 0.14 + 11_584 * 0.2, 2);
  });
  it('מסלול 10% עם ניכוי שכירות למגורי המשכיר', () => {
    const r = calculateFullReturn(base({ residentialRental: { track: 'ten-percent', monthlyRent: 6_000, months: 12, rentPaidForOwnHome: 30_000 } }));
    expect(line(r, 'מס 10% על שכירות למגורים (סעיף 122)')).toBe(4_200);
  });
  it('נקודות זיכוי אינן מקוזזות מול מס 10%', () => {
    const r = calculateFullReturn(base({ wageSources: [], residentialRental: { track: 'ten-percent', monthlyRent: 6_000, months: 12 } }));
    expect(r.finalTax).toBe(7_200);
  });
});

describe('הכנסות הוניות', () => {
  it('עד גיל 60: רווח הון 25%, דיבידנד 25%, ריבית פיקדון 15%', () => {
    const r = calculateFullReturn(base({ capital: { gainsRegular: 50_000, dividends: 10_000, depositInterestUnlinked: 20_000 } }));
    expect(line(r, 'מס על רווח הון ריאלי')).toBeCloseTo(12_500, 2);
    expect(line(r, 'מס על דיבידנד')).toBeCloseTo(2_500, 2);
    expect(line(r, 'מס על ריבית מפיקדון / תכנית חיסכון')).toBeCloseTo(3_000, 2);
  });
  it('מגיל 60: רווח הון במדרגות המופחתות (סעיף 91(ב) + 121(ב))', () => {
    const r = calculateFullReturn(base({ wageSources: [], age60OrOver: true, capital: { gainsRegular: 100_000 } }));
    expect(line(r, 'מס על רווח הון ריאלי')).toBeCloseTo(8_412 + 15_880 * 0.14, 2);
  });
  it('ניכוי למעוטי הכנסה מריבית פיקדון (סעיף 125ד(ב))', () => {
    const r = calculateFullReturn(base({ wageSources: [wage(40_000)], capital: { depositInterestUnlinked: 15_000 } }));
    // 55,000 ≤ 69,840 → ניכוי מלא 10,920
    expect(line(r, 'ניכוי מריבית (סעיף 125ד)')).toBe(10_920);
    expect(line(r, 'מס על ריבית מפיקדון / תכנית חיסכון')).toBeCloseTo((15_000 - 10_920) * 0.15, 2);
  });
  it('קיזוז הפסדים: רווח → דיבידנד רגיל; לא מול דיבידנד מהותי או ריבית פיקדון', () => {
    const r = calculateFullReturn(base({
      wageSources: [wage(200_000)],
      capital: { gainsRegular: 30_000, currentYearLoss: 50_000, dividends: 10_000, dividendsSubstantial: 10_000, depositInterestUnlinked: 5_000 },
    }));
    expect(r.lossCarryForward).toBe(10_000);
    expect(line(r, 'מס על דיבידנד — בעל מניות מהותי')).toBe(3_000);
    expect(line(r, 'מס על ריבית מפיקדון / תכנית חיסכון')).toBe(750);
    expect(line(r, 'מס על רווח הון ריאלי')).toBeUndefined();
  });
  it('הפסד מועבר מקוזז מול רווח הון בלבד', () => {
    const r = calculateFullReturn(base({ capital: { dividends: 10_000, carriedForwardLoss: 5_000 } }));
    expect(line(r, 'מס על דיבידנד')).toBe(2_500);
    expect(r.lossCarryForward).toBe(5_000);
  });
});

describe('מס יסף', () => {
  it('2025: 3% על סך ההכנסה מעל 721,560', () => {
    const r = calculateFullReturn(base({ taxYear: '2025', wageSources: [wage(600_000)], capital: { gainsRegular: 400_000 } }));
    expect(line(r, 'מס יסף 3% (סעיף 121ב(א))')).toBeCloseTo((1_000_000 - 721_560) * 0.03, 2);
    expect(line(r, 'מס נוסף 2% על הכנסה ממקור הוני (סעיף 121ב(א1))')).toBeUndefined();
  });
  it('2025: 2% נוספים כשההכנסה ההונית לבדה עולה על התקרה', () => {
    const r = calculateFullReturn(base({ taxYear: '2025', wageSources: [], capital: { gainsRegular: 800_000 } }));
    expect(line(r, 'מס נוסף 2% על הכנסה ממקור הוני (סעיף 121ב(א1))')).toBeCloseTo(78_440 * 0.02, 2);
  });
  it('2024: אין מס הוני נוסף', () => {
    const r = calculateFullReturn(base({ wageSources: [], capital: { gainsRegular: 800_000 } }));
    expect(line(r, 'מס נוסף 2% על הכנסה ממקור הוני (סעיף 121ב(א1))')).toBeUndefined();
  });
});

describe('זיכוי מס זר (סעיף 204)', () => {
  it('דיבידנד מחו״ל: זיכוי עד המס הישראלי, העודף מדווח', () => {
    const r = calculateFullReturn(base({ capital: { foreignDividends: 10_000, foreignDividendsTax: 3_000 } }));
    expect(line(r, 'זיכוי מס זר — דיבידנד מחו״ל')).toBe(2_500);
    expect(r.foreignCreditExcess).toBe(500);
  });
});

describe('הקצאת זיכויים', () => {
  it('נקודות חייל מוגבלות למס על השכר בלבד', () => {
    const r = calculateFullReturn(base({
      taxYear: '2025',
      wageSources: [wage(30_000)],
      credits: { gender: 'male', soldier: { serviceType: 'army', serviceMonths: 32, dischargeYear: 2024, dischargeMonth: 12 } },
      capital: { dividends: 100_000 },
    }));
    // נקודות חייל (סעיף 39א) — עד מס השכר (3,000); נקודות תושב 2.25 — גם מול מס הדיבידנד.
    expect(line(r, 'נקודות זיכוי — ילדים, חייל משוחרר ונוספות')).toBe(3_000);
    expect(line(r, 'נקודות זיכוי — תושב, תואר ועולה')).toBeCloseTo(2.25 * 2_904, 2);
    expect(r.finalTax).toBeCloseTo(28_000 - 3_000 - 6_534, 2);
  });
  it('נקודות עולה מקוזזות גם מול מס על הכנסה הונית', () => {
    const r = calculateFullReturn(base({
      wageSources: [],
      credits: { gender: 'male', immigrant: { aliyahYear: 2023, aliyahMonth: 1 } },
      capital: { dividends: 100_000 },
    }));
    // 2024: 12 חודשים × 1/4 = 3 נקודות עולה + 2.25 תושב
    expect(line(r, 'נקודות זיכוי — תושב, תואר ועולה')).toBeCloseTo(5.25 * 2_904, 2);
  });
});

describe('אימות מול רשות המסים — סבב 2', () => {
  it('נקודות ילדים להורה נשוי — רק מול מס על הכנסה מיגיעה אישית (סעיף 66(ג))', () => {
    const r = calculateFullReturn(base({
      wageSources: [],
      credits: { gender: 'female', childBirthYears: [2020], marriedWholeYear: true },
      capital: { dividends: 100_000 },
    }));
    expect(line(r, 'נקודות זיכוי — ילדים, חייל משוחרר ונוספות')).toBe(0);
    expect(line(r, 'נקודות זיכוי — תושב, תואר ועולה')).toBeCloseTo(2.75 * 2_904, 2);
  });
  it('ריבית פיקדון לבן 60+: לפי המדרגות, עד 15%, אחרי ניכוי סעיף 125ד', () => {
    const r = calculateFullReturn(base({ wageSources: [], age60OrOver: true, capital: { depositInterestUnlinked: 50_000 } }));
    expect(line(r, 'ניכוי מריבית (סעיף 125ד)')).toBe(10_920);
    expect(line(r, 'מס על ריבית מפיקדון / תכנית חיסכון')).toBeCloseTo(39_080 * 0.1, 2);
  });
  it('הפסד מניירות ערך אינו מקוזז מול רווחי קרן נאמנות (חוזר 10/2025 סעיף 3.7)', () => {
    const r = calculateFullReturn(base({ capital: { mutualFundDistributions: 10_000, currentYearLoss: 10_000 } }));
    expect(line(r, 'מס על רווחים שחילקה קרן נאמנות פטורה')).toBe(2_500);
    expect(r.lossCarryForward).toBe(10_000);
  });
  it('תקרת זיכוי מס זר על הכנסה רגילה — אחרי זיכויים אישיים', () => {
    const r = calculateFullReturn(base({
      wageSources: [],
      foreignRental: { track: 'regular', grossRent: 120_000, regularNetIncome: 100_000, foreignTaxPaid: 30_000 },
    }));
    expect(line(r, 'זיכוי מס זר — שכירות מחו״ל')).toBeCloseTo(31_000 - 6_534, 2);
    expect(r.finalTax).toBe(0);
    expect(r.foreignCreditExcess).toBeCloseTo(30_000 - 24_466, 2);
  });
});
