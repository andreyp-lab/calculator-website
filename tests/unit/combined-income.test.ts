import { describe, it, expect } from 'vitest';
import {
  calculateCombinedIncome,
  calculateBracketTax,
  marginalBracketRate,
  calculateSelfEmployedBituachWithSalary,
} from '@/lib/calculators/combined-income';
import { calculateSelfEmployedNet } from '@/lib/calculators/self-employed-net';

// ============================================================
// קבועי בקרה (מקובץ הנתונים המאומת / tax-2026.ts)
// ============================================================
const BL_CAP_MONTHLY = 51_910;
const BL_REDUCED_THRESHOLD = 7_522;
const BL_REDUCED_RATE = 0.061;
const BL_FULL_RATE = 0.18;

describe('combined-income — מס הכנסה: ההכנסה העצמאית יושבת על השכר', () => {
  it('מס על שכר בלבד מחושב נכון לפי מדרגות 2026', () => {
    // שכר 10,000 ₪/חודש = 120,000 ₪/שנה
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 10_000,
      annualSelfEmployedIncome: 0,
      creditPoints: 2.25,
    });
    // מדרגה 1: 84,120 × 10% = 8,412 ; מדרגה 2: (120,000-84,120) × 14% = 5,023.2
    expect(r.taxOnSalaryOnly).toBeCloseTo(8_412 + 5_023.2, 1);
  });

  it('מס ההכנסה הצדדית = מס(משולב) − מס(שכר) (כשהזיכוי מנוצל על השכר)', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 15_000, // 180,000/שנה — כבר מעל הזיכוי
      annualSelfEmployedIncome: 60_000,
      creditPoints: 2.25,
    });
    const grossDiff = r.taxOnCombinedGross - r.taxOnSalaryOnly;
    // הזיכוי כבר נוצל במלואו על השכר → מס הצד = ההפרש הברוטו
    expect(r.taxOnSideIncome).toBeCloseTo(grossDiff, 1);
  });

  it('ההכנסה הצדדית ממוסה במדרגה השולית שמעל השכר (לא מתחילת הסולם)', () => {
    // שכר 25,000/חודש = 300,000/שנה. סוף מדרגת 31% הוא 301,200 ₪.
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 25_000,
      annualSelfEmployedIncome: 20_000,
      creditPoints: 2.25,
    });
    // הב"ל על הצד: השכר (25,000) מעל 7,522 → כל ה-20,000 בשיעור מלא:
    // 20,000 × 18% = 3,600 ; ניכוי 52% = 1,872.
    // ההכנסה הצדדית החייבת (אחרי ניכוי) = 20,000 − 1,872 = 18,128,
    // יושבת מ-300,000 עד 318,128:
    // 1,200 ₪ ראשונים ב-31% (עד 301,200), היתרה (16,928) ב-35%.
    const expected = 1_200 * 0.31 + 16_928 * 0.35; // 6,296.8
    expect(r.bituachLeumiDeduction).toBeCloseTo(1_872, 2);
    expect(r.taxOnSideIncome).toBeCloseTo(expected, 0);
  });

  it('צד גבוה שחוצה מדרגה — ממוסה בשתי מדרגות שונות', () => {
    // שכר 19,000/חודש = 228,000/שנה (בדיוק סוף מדרגת 20%). צד 100,000.
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 19_000,
      annualSelfEmployedIncome: 100_000,
      creditPoints: 0,
    });
    // ב"ל: השכר מעל 7,522 → 100,000 × 18% = 18,000 ; ניכוי 52% = 9,360.
    // ההכנסה הצדדית החייבת (אחרי ניכוי) = 90,640, יושבת מ-228,000:
    // 228,000 → 301,200 ב-31% (73,200), היתרה (17,440) ב-35%.
    const expected = 73_200 * 0.31 + 17_440 * 0.35; // 28,796
    expect(r.bituachLeumiDeduction).toBeCloseTo(9_360, 2);
    expect(r.taxOnSideIncome).toBeCloseTo(expected, 0);
  });

  it('נקודות זיכוי מנוצלות פעם אחת על כלל ההכנסה', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 8_000,
      annualSelfEmployedIncome: 40_000,
      creditPoints: 2.25,
    });
    expect(r.creditPointsValue).toBeCloseTo(2.25 * 2_904, 2);
    expect(r.totalIncomeTax).toBeCloseTo(
      Math.max(0, r.taxOnCombinedGross - r.creditPointsValue),
      2,
    );
  });

  it('שכר נמוך + צד גבוה: עיקר המס נופל על ההכנסה הצדדית', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 5_000, // 60,000/שנה (מתחת לתקרת מדרגה 1)
      annualSelfEmployedIncome: 200_000,
      creditPoints: 2.25,
    });
    expect(r.taxOnSideIncome).toBeGreaterThan(0);
    expect(r.combinedTaxableIncome).toBe(260_000);
    // ההכנסה הצדדית נכנסת למדרגות גבוהות יותר
    expect(r.marginalIncomeTaxRate).toBeGreaterThanOrEqual(0.2);
  });
});

describe('combined-income — ביטוח לאומי: כללי שכיר-גם-עצמאי', () => {
  it('שכר מתחת לתקרה: ב"ל על הצד מחושב על היתרה עד התקרה', () => {
    // שכר 10,000/חודש, צד 120,000/שנה = 10,000/חודש
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 10_000,
      annualSelfEmployedIncome: 120_000,
      creditPoints: 2.25,
    });
    // השכר (10,000) כבר מעל 7,522 → כל ההכנסה העצמאית בשיעור מלא 18%
    expect(r.bituachLeumiBreakdown.reducedTierIncome).toBe(0);
    expect(r.bituachLeumiBreakdown.fullTierIncome).toBeCloseTo(120_000, 0);
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(120_000 * BL_FULL_RATE, 0);
  });

  it('שכר ≥ תקרה: אין חבות ב"ל נוספת על העצמאות (ה.2)', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: BL_CAP_MONTHLY, // 51,910
      annualSelfEmployedIncome: 100_000,
      creditPoints: 2.25,
    });
    expect(r.capReachedBySalary).toBe(true);
    expect(r.selfEmployedBituachLeumi).toBe(0);
    expect(r.bituachLeumiBreakdown.exemptIncome).toBeCloseTo(100_000, 0);
    expect(r.marginalBituachRate).toBe(0);
  });

  it('שכר מעל התקרה: אין ב"ל על העצמאות', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 60_000, // מעל 51,910
      annualSelfEmployedIncome: 50_000,
      creditPoints: 2.25,
    });
    expect(r.capReachedBySalary).toBe(true);
    expect(r.selfEmployedBituachLeumi).toBe(0);
  });

  it('שכר נמוך מ-7,522: חלק מההכנסה העצמאית בשיעור מופחת', () => {
    // שכר 5,000/חודש, צד 60,000/שנה = 5,000/חודש
    // החדר במדרגה מופחת: 7,522-5,000 = 2,522/חודש
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 5_000,
      annualSelfEmployedIncome: 60_000,
      creditPoints: 2.25,
    });
    // 2,522/חודש בשיעור מופחת, היתרה (2,478/חודש) בשיעור מלא
    const reducedMonthly = BL_REDUCED_THRESHOLD - 5_000; // 2,522
    const fullMonthly = 5_000 - reducedMonthly; // 2,478
    expect(r.bituachLeumiBreakdown.reducedTierIncome).toBeCloseTo(
      reducedMonthly * 12,
      0,
    );
    expect(r.bituachLeumiBreakdown.fullTierIncome).toBeCloseTo(
      fullMonthly * 12,
      0,
    );
    const expectedBL =
      (reducedMonthly * BL_REDUCED_RATE + fullMonthly * BL_FULL_RATE) * 12;
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(expectedBL, 0);
  });

  it('צד שחוצה את התקרה המשותפת: החלק שמעל התקרה פטור', () => {
    // שכר 40,000/חודש, צד 240,000/שנה = 20,000/חודש
    // חדר עד התקרה: 51,910-40,000 = 11,910/חודש חייב, היתרה (8,090) פטורה
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 40_000,
      annualSelfEmployedIncome: 240_000,
      creditPoints: 2.25,
    });
    const roomMonthly = BL_CAP_MONTHLY - 40_000; // 11,910
    const exemptMonthly = 20_000 - roomMonthly; // 8,090
    expect(r.bituachLeumiBreakdown.exemptIncome).toBeCloseTo(
      exemptMonthly * 12,
      0,
    );
    // כל ה-11,910 בשיעור מלא (השכר כבר מעל 7,522)
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(
      roomMonthly * BL_FULL_RATE * 12,
      0,
    );
  });

  it('המדרגה השולית של ב"ל = מלא כשהשכר+צד מעל 7,522 ומתחת לתקרה', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 12_000,
      annualSelfEmployedIncome: 60_000, // 5,000/חודש → סה"כ 17,000 < תקרה
      creditPoints: 2.25,
    });
    expect(r.marginalBituachRate).toBe(BL_FULL_RATE);
  });

  it('המדרגה השולית של ב"ל = מופחת כששכר+צד מתחת ל-7,522', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 3_000,
      annualSelfEmployedIncome: 24_000, // 2,000/חודש → סה"כ 5,000 < 7,522
      creditPoints: 2.25,
    });
    expect(r.marginalBituachRate).toBe(BL_REDUCED_RATE);
  });
});

describe('combined-income — נטו מההכנסה הצדדית ומדרגה אפקטיבית', () => {
  it('נטו צדדי = הכנסה עצמאית − מס צד − ב"ל צד', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 12_000,
      annualSelfEmployedIncome: 80_000,
      creditPoints: 2.25,
    });
    expect(r.netSideIncomeAnnual).toBeCloseTo(
      80_000 - r.taxOnSideIncome - r.selfEmployedBituachLeumi,
      2,
    );
    expect(r.netSideIncomeMonthly).toBeCloseTo(r.netSideIncomeAnnual / 12, 2);
  });

  it('מדרגה אפקטיבית = (מס צד + ב"ל צד) ÷ הכנסה עצמאית', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 12_000,
      annualSelfEmployedIncome: 80_000,
      creditPoints: 2.25,
    });
    expect(r.effectiveMarginalRate).toBeCloseTo(
      (r.taxOnSideIncome + r.selfEmployedBituachLeumi) / 80_000,
      4,
    );
  });

  it('מדרגה אפקטיבית גבוהה לשכר גבוה אך מתחת לתקרת ב"ל', () => {
    // שכר 30,000/חודש (מדרגת 35%), צד 50,000 — עדיין חייב ב"ל (18%)
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 30_000,
      annualSelfEmployedIncome: 50_000,
      creditPoints: 2.25,
    });
    // 35% מס + 18% ב"ל ≈ 53%
    expect(r.effectiveMarginalRate).toBeGreaterThan(0.45);
  });

  it('מעל תקרת ב"ל: המדרגה האפקטיבית נמוכה יותר (אין ב"ל)', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: BL_CAP_MONTHLY + 1_000,
      annualSelfEmployedIncome: 50_000,
      creditPoints: 2.25,
    });
    expect(r.selfEmployedBituachLeumi).toBe(0);
    // רק מס שולי, בלי ב"ל
    expect(r.effectiveMarginalRate).toBeCloseTo(r.taxOnSideIncome / 50_000, 4);
  });

  it('נטו צדדי תמיד נמוך מההכנסה הצדדית הברוטו', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 15_000,
      annualSelfEmployedIncome: 90_000,
      creditPoints: 2.25,
    });
    expect(r.netSideIncomeAnnual).toBeLessThan(90_000);
    expect(r.netSideIncomeAnnual).toBeGreaterThan(0);
  });
});

describe('combined-income — מקרי קצה', () => {
  it('אפס עצמאי: אין מס צד, אין ב"ל, נטו צד = 0', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 18_000,
      annualSelfEmployedIncome: 0,
      creditPoints: 2.25,
    });
    expect(r.taxOnSideIncome).toBe(0);
    expect(r.selfEmployedBituachLeumi).toBe(0);
    expect(r.netSideIncomeAnnual).toBe(0);
    expect(r.effectiveMarginalRate).toBe(0);
  });

  it('אפס שכיר + אפס עצמאי: הכל אפס', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 0,
      annualSelfEmployedIncome: 0,
      creditPoints: 2.25,
    });
    expect(r.totalIncomeTax).toBe(0);
    expect(r.selfEmployedBituachLeumi).toBe(0);
    expect(r.netSideIncomeAnnual).toBe(0);
  });

  it('קלט שלילי מטופל כאפס', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: -5_000,
      annualSelfEmployedIncome: -10_000,
      creditPoints: -1,
    });
    expect(r.annualSalary).toBe(0);
    expect(r.annualSelfEmployedIncome).toBe(0);
    expect(r.creditPointsValue).toBe(0);
    expect(r.totalIncomeTax).toBe(0);
  });

  it('שכר גבוה מאוד שמאפס את הזיכוי ועדיין מחזיר מס צד תקין', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 50_000,
      annualSelfEmployedIncome: 30_000,
      creditPoints: 2.25,
    });
    // השכר השנתי (600,000) כבר מעל הזיכוי → מס הצד שווה להפרש הברוטו
    expect(r.taxOnSideIncome).toBeCloseTo(
      r.taxOnCombinedGross - r.taxOnSalaryOnly,
      1,
    );
  });
});

describe('combined-income — אפס שכיר = עצמאי טהור (הצלבה למחשבון net)', () => {
  it('מס הכנסה תואם את calculateBracketTax על ההכנסה העצמאית פחות ניכוי ה-52%', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 0,
      annualSelfEmployedIncome: 150_000,
      creditPoints: 2.25,
    });
    // עצמאי טהור: ב"ל על 150,000 (12,500/חודש):
    //   7,522 × 6.1% + (12,500−7,522) × 18% = 458.842 + 896.04 = 1,354.882/חודש
    //   × 12 = 16,258.584 ; ניכוי 52% = 8,454.4637
    const monthlyBL = 7_522 * 0.061 + (150_000 / 12 - 7_522) * 0.18;
    const expectedBL = monthlyBL * 12;
    const expectedDeduction = expectedBL * 0.52;
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(expectedBL, 2);
    expect(r.bituachLeumiDeduction).toBeCloseTo(expectedDeduction, 2);
    // מס הצד = מס על (ההכנסה העצמאית − ניכוי הב"ל) פחות זיכוי
    const expectedTax = Math.max(
      0,
      calculateBracketTax(150_000 - expectedDeduction) - 2.25 * 2_904,
    );
    expect(r.totalIncomeTax).toBeCloseTo(expectedTax, 2);
    expect(r.taxOnSideIncome).toBeCloseTo(expectedTax, 2);
  });

  it('ב"ל בעצמאי טהור: מדרגות מופחת/מלא רגילות (השכר=0)', () => {
    // צד 90,000/שנה = 7,500/חודש (כמעט כל הסכום במדרגה המופחת)
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 0,
      annualSelfEmployedIncome: 90_000,
      creditPoints: 2.25,
    });
    const monthlySE = 90_000 / 12; // 7,500 < 7,522
    expect(r.bituachLeumiBreakdown.reducedTierIncome).toBeCloseTo(90_000, 0);
    expect(r.bituachLeumiBreakdown.fullTierIncome).toBe(0);
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(
      monthlySE * BL_REDUCED_RATE * 12,
      0,
    );
  });

  it('ב"ל בעצמאי טהור גבוה: שתי המדרגות (מופחת+מלא)', () => {
    // צד 240,000/שנה = 20,000/חודש
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 0,
      annualSelfEmployedIncome: 240_000,
      creditPoints: 2.25,
    });
    const reduced = BL_REDUCED_THRESHOLD; // 7,522
    const full = 20_000 - reduced; // 12,478
    const expectedBL =
      (reduced * BL_REDUCED_RATE + full * BL_FULL_RATE) * 12;
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(expectedBL, 0);
  });

  it('עצמאי טהור — מס הכנסה משולב תואם מחשבון net (כולל ניכוי 52% מהב"ל)', () => {
    // כעת combined מנכה גם הוא 52% מהב"ל לפני חישוב המס, בדיוק כמו
    // מחשבון self-employed-net. ללא פנסיה/קה"ש, ההכנסה החייבת בשני
    // המחשבונים זהה: income − 52% × ב"ל. לכן מס המדרגות הברוטו חייב להיות
    // שווה, ובהיעדר שכר גם המס נטו (אותו זיכוי) חייב להיות שווה.
    const income = 180_000;
    const combined = calculateCombinedIncome({
      monthlyGrossSalary: 0,
      annualSelfEmployedIncome: income,
      creditPoints: 2.25,
    });
    const taxableAfterBL = income - combined.bituachLeumiDeduction;
    expect(combined.taxOnCombinedGross).toBeCloseTo(
      calculateBracketTax(taxableAfterBL),
      2,
    );
    const net = calculateSelfEmployedNet({
      businessType: 'exempt',
      inputPeriod: 'annual',
      revenue: income,
      recognizedExpenses: 0,
      creditPoints: 2.25,
      monthlyPensionDeposit: 0,
      monthlyStudyFundDeposit: 0,
    });
    // אותה הכנסה חייבת ואותו זיכוי → אותו מס נטו
    expect(net.netIncomeTax).toBeCloseTo(combined.totalIncomeTax, 1);
  });
});

describe('combined-income — ניכוי 52% מדמי הב"ל (סעיף 47א)', () => {
  it('הניכוי מקטין את מס ההכנסה על ההכנסה הצדדית מול תרחיש זהה ללא ניכוי', () => {
    // שכר 12,000/חודש (144,000/שנה, מדרגת 20%), צד 80,000.
    // ב"ל על הצד: השכר מעל 7,522 → 80,000 × 18% = 14,400 ; ניכוי 52% = 7,488.
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 12_000,
      annualSelfEmployedIncome: 80_000,
      creditPoints: 2.25,
    });
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(14_400, 2);
    expect(r.bituachLeumiDeduction).toBeCloseTo(7_488, 2);

    // מס צד ללא הניכוי = מס(144,000+80,000) − מס(144,000):
    // כל ה-80,000 במדרגת 20% (144,000→224,000) = 16,000.
    const sideTaxNoDeduction = 80_000 * 0.2; // 16,000

    // מס צד עם הניכוי = מס(144,000 + (80,000−7,488)) − מס(144,000):
    // 72,512 במדרגת 20% = 14,502.40.
    const sideTaxWithDeduction = (80_000 - 7_488) * 0.2; // 14,502.40

    expect(r.taxOnSideIncome).toBeCloseTo(sideTaxWithDeduction, 2);
    // החיסכון מהניכוי = הניכוי × המדרגה השולית (20%)
    expect(sideTaxNoDeduction - r.taxOnSideIncome).toBeCloseTo(
      7_488 * 0.2,
      2,
    );
    // ובהכרח קטן מהמס ללא הניכוי
    expect(r.taxOnSideIncome).toBeLessThan(sideTaxNoDeduction);
  });

  it('ללא ב"ל (שכר ≥ תקרה) אין ניכוי — המס זהה לחישוב הברוטו', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: BL_CAP_MONTHLY, // אין ב"ל על הצד
      annualSelfEmployedIncome: 40_000,
      creditPoints: 2.25,
    });
    expect(r.selfEmployedBituachLeumi).toBe(0);
    expect(r.bituachLeumiDeduction).toBe(0);
    // ללא ניכוי: מס הצד = מס(ברוטו משולב) − מס(שכר)
    expect(r.taxOnSideIncome).toBeCloseTo(
      r.taxOnCombinedGross - r.taxOnSalaryOnly,
      1,
    );
  });
});

describe('combined-income — גבול התקרה המדויק של הב"ל', () => {
  it('הכנסה משולבת חודשית בדיוק על התקרה (51,910): השקל הבא ב-0%', () => {
    // שכר 40,000/חודש, צד 142,920/שנה = 11,910/חודש.
    // 40,000 + 11,910 = 51,910 בדיוק == התקרה.
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 40_000,
      annualSelfEmployedIncome: 142_920,
      creditPoints: 2.25,
    });
    // בדיוק על התקרה → השקל הבא פטור מב"ל (>= ולא >)
    expect(r.marginalBituachRate).toBe(0);
    // כל ההכנסה הצדדית עדיין חייבת (היא בתוך התקרה, לא מעליה)
    expect(r.bituachLeumiBreakdown.exemptIncome).toBeCloseTo(0, 0);
    // השכר (40,000) מעל 7,522 → כל ה-142,920 בשיעור מלא
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(142_920 * BL_FULL_RATE, 0);
  });

  it('שקל אחד מעל התקרה: עדיין 0% שולי, והחלק שמעל התקרה פטור', () => {
    // צד 142,932/שנה = 11,911/חודש → 51,911 > 51,910
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 40_000,
      annualSelfEmployedIncome: 142_932,
      creditPoints: 2.25,
    });
    expect(r.marginalBituachRate).toBe(0);
    expect(r.bituachLeumiBreakdown.exemptIncome).toBeCloseTo(12, 0); // 1 ₪/חודש × 12
  });
});

describe('combined-income — פונקציות עזר', () => {
  it('calculateBracketTax: אפס ושלילי = 0', () => {
    expect(calculateBracketTax(0)).toBe(0);
    expect(calculateBracketTax(-100)).toBe(0);
  });

  it('calculateBracketTax: בדיוק תקרת מדרגה 1', () => {
    expect(calculateBracketTax(84_120)).toBeCloseTo(8_412, 2);
  });

  it('marginalBracketRate: עולה עם ההכנסה', () => {
    expect(marginalBracketRate(50_000)).toBe(0.1);
    expect(marginalBracketRate(100_000)).toBe(0.14);
    expect(marginalBracketRate(200_000)).toBe(0.2);
    expect(marginalBracketRate(800_000)).toBe(0.5);
  });

  it('calculateSelfEmployedBituachWithSalary: שכר=0 → מדרגות רגילות', () => {
    const bl = calculateSelfEmployedBituachWithSalary(0, 60_000); // 5,000/חודש
    expect(bl.reducedTierIncome).toBeCloseTo(60_000, 0);
    expect(bl.fullTierIncome).toBe(0);
    expect(bl.capReached).toBe(false);
  });

  it('calculateSelfEmployedBituachWithSalary: שכר בתקרה → capReached', () => {
    const bl = calculateSelfEmployedBituachWithSalary(BL_CAP_MONTHLY, 50_000);
    expect(bl.capReached).toBe(true);
    expect(bl.total).toBe(0);
  });

  it('סכום מדרגות הב"ל שווה ל-selfEmployedBituachLeumi', () => {
    const r = calculateCombinedIncome({
      monthlyGrossSalary: 6_000,
      annualSelfEmployedIncome: 100_000,
      creditPoints: 2.25,
    });
    expect(r.selfEmployedBituachLeumi).toBeCloseTo(
      r.bituachLeumiBreakdown.reducedTierAmount +
        r.bituachLeumiBreakdown.fullTierAmount,
      2,
    );
  });
});
