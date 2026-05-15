import { describe, it, expect } from 'vitest';
import {
  calculateComprehensivePension,
  getConversionFactor,
  calculatePensionTax,
  futureValue,
  netEffectiveReturn,
  goalSeekMonthlyContribution,
  aggregateMultiSources,
  PENSION_CONSTANTS_2026,
  type ComprehensivePensionInput,
  type PensionSourceInput,
  type PensionSourceResult,
} from '@/lib/calculators/pension';

// ============================================================
// עזרים
// ============================================================

function makeSource(overrides: Partial<PensionSourceInput> = {}): PensionSourceInput {
  return {
    id: 'src_1',
    label: 'קרן פנסיה ראשית',
    fundType: 'comprehensive',
    currentBalance: 200_000,
    monthlySalary: 18_000,
    employeeContrib: 6,
    employerContrib: 6.5,
    severanceContrib: 8.33,
    managementFeeAccum: 0.3,
    managementFeeContrib: 1.5,
    expectedReturn: 5,
    yearsContributing: 32,
    isActive: true,
    ...overrides,
  };
}

function makeInput(overrides: Partial<ComprehensivePensionInput> = {}): ComprehensivePensionInput {
  return {
    currentAge: 35,
    retirementAge: 67,
    gender: 'male',
    maritalStatus: 'married',
    spouseAge: 33,
    inflationRate: 2.5,
    sources: [makeSource()],
    includNationalIns: true,
    nationalInsAmount: 3_465,
    studyFundBalance: 0,
    studyFundReturn: 5,
    studyFundYearsLeft: 32,
    studyFundMonthlySalary: 18_000,
    studyFundEmployerPct: 7.5,
    studyFundEmployeePct: 2.5,
    spouseOption: 'none',
    conversionFactor: 0,
    lumpSumFromSeverance: false,
    targetMonthlyIncome: 14_000,
    ...overrides,
  };
}

// ============================================================
// 1. getConversionFactor
// ============================================================

describe('getConversionFactor', () => {
  it('מחזיר 205 לגיל 67', () => {
    expect(getConversionFactor(67)).toBe(205);
  });

  it('מחזיר 190 לגיל 70', () => {
    expect(getConversionFactor(70)).toBe(190);
  });

  it('קירוב לינארי בגיל ביניים', () => {
    // בין 67 (205) ל-68 (200) - גיל 67.5 ~ 202-203
    const cf = getConversionFactor(67.5);
    expect(cf).toBeGreaterThanOrEqual(200);
    expect(cf).toBeLessThanOrEqual(205);
  });

  it('מקדם עם שאיר גבוה יותר מבלעדיו', () => {
    const withoutSpouse = getConversionFactor(67, false);
    const withSpouse = getConversionFactor(67, true);
    expect(withSpouse).toBeGreaterThan(withoutSpouse);
  });

  it('גיל פרישה נמוך מ-60 מחזיר המקדם הנמוך ביותר', () => {
    const cf55 = getConversionFactor(55);
    const cf60 = getConversionFactor(60);
    expect(cf55).toBe(cf60);
  });
});

// ============================================================
// 2. futureValue
// ============================================================

describe('futureValue', () => {
  it('ריבית אפס: PV + PMT × חודשים', () => {
    const fv = futureValue(100_000, 1_000, 0, 10);
    expect(fv).toBeCloseTo(100_000 + 1_000 * 120, 0);
  });

  it('ריבית 6% שנתי, 10 שנים ל-100K', () => {
    // 100K × (1.005)^120 ≈ 181,940
    const fv = futureValue(100_000, 0, 6, 10);
    expect(fv).toBeCloseTo(181_940, -2);
  });

  it('ללא שנים מחזיר את ה-PV', () => {
    expect(futureValue(50_000, 500, 5, 0)).toBe(50_000);
  });

  it('עם הפקדות ותשואה', () => {
    // 1000/חודש ב-5% שנתי ל-30 שנה
    const fv = futureValue(0, 1_000, 5, 30);
    expect(fv).toBeGreaterThan(800_000);
    expect(fv).toBeLessThan(900_000);
  });
});

// ============================================================
// 3. netEffectiveReturn
// ============================================================

describe('netEffectiveReturn', () => {
  it('5% תשואה, 0.3% דמי ניהול = 4.7%', () => {
    expect(netEffectiveReturn(5, 0.3)).toBeCloseTo(4.7, 5);
  });

  it('לא מחזיר ערך שלילי', () => {
    expect(netEffectiveReturn(2, 5)).toBe(0);
  });
});

// ============================================================
// 4. calculatePensionTax
// ============================================================

describe('calculatePensionTax', () => {
  it('קצבה 10,000 ₪ בגיל 67: פטור 52% עד תקרה', () => {
    const r = calculatePensionTax(10_000, 67);
    // 52% × 10,000 = 5,200 ≤ 9,430 → פטור 5,200
    expect(r.taxExemptAmount).toBeCloseTo(5_200, 0);
    expect(r.taxableAmount).toBeCloseTo(4_800, 0);
    // קצבה נטו ≤ קצבה ברוטו (יכולה להיות שווה אם אין מס בפועל)
    expect(r.netMonthlyPension).toBeLessThanOrEqual(10_000);
  });

  it('לפני גיל 67: אין פטור', () => {
    const r = calculatePensionTax(10_000, 62);
    expect(r.taxExemptAmount).toBe(0);
    expect(r.taxableAmount).toBe(10_000);
  });

  it('קצבה גדולה מהתקרה: הפטור תחום', () => {
    // 52% × 20,000 = 10,400 > תקרה 9,430 → פטור מוגבל ל-9,430
    const r = calculatePensionTax(20_000, 67);
    expect(r.taxExemptAmount).toBeLessThanOrEqual(PENSION_CONSTANTS_2026.pensionTaxExemptionCeiling);
  });

  it('מס אפקטיבי נמוך מ-10% לקצבה 10,000 ₪', () => {
    const r = calculatePensionTax(10_000, 67);
    expect(r.effectiveTaxRate).toBeLessThan(10);
  });

  it('קצבה נטו חיובית', () => {
    const r = calculatePensionTax(8_000, 67);
    expect(r.netMonthlyPension).toBeGreaterThan(0);
  });
});

// ============================================================
// 5. calculateComprehensivePension — בסיסי
// ============================================================

describe('calculateComprehensivePension — בסיסי', () => {
  it('מחזיר 32 שנים עד פרישה', () => {
    const r = calculateComprehensivePension(makeInput());
    expect(r.yearsUntilRetirement).toBe(32);
  });

  it('צבירה גדולה מהחיסכון הנוכחי', () => {
    const r = calculateComprehensivePension(makeInput());
    expect(r.totalFinalBalance).toBeGreaterThan(200_000);
  });

  it('קצבה חיובית', () => {
    const r = calculateComprehensivePension(makeInput());
    expect(r.totalMonthlyPension).toBeGreaterThan(0);
  });

  it('כולל ב.ל.ל בסה"כ הכנסה', () => {
    const r = calculateComprehensivePension(makeInput({ includNationalIns: true, nationalInsAmount: 3_465 }));
    expect(r.totalWithNationalIns).toBe(r.totalMonthlyPension + 3_465);
  });

  it('שיעור החלפת שכר סביר (40%+)', () => {
    // כולל פיצויים (8.33%) שיעור ההחלפה יכול לעלות על 100% - זה נכון
    const r = calculateComprehensivePension(makeInput());
    expect(r.replacementRate).toBeGreaterThan(40);
    expect(r.replacementRate).toBeGreaterThan(0);
  });
});

// ============================================================
// 6. מקדם המרה מותאם אישית
// ============================================================

describe('מקדם המרה מותאם אישית', () => {
  it('מקדם ידני 230 נותן קצבה נמוכה יותר ממקדם 200', () => {
    const r200 = calculateComprehensivePension(makeInput({ conversionFactor: 200 }));
    const r230 = calculateComprehensivePension(makeInput({ conversionFactor: 230 }));
    expect(r200.totalMonthlyPension).toBeGreaterThan(r230.totalMonthlyPension);
  });

  it('מקדם 0 = אוטומטי (205 לגיל 67)', () => {
    const rAuto = calculateComprehensivePension(makeInput({ conversionFactor: 0 }));
    const rManual = calculateComprehensivePension(makeInput({ conversionFactor: 205 }));
    expect(rAuto.conversionFactor).toBe(205);
    expect(rAuto.totalMonthlyPension).toBeCloseTo(rManual.totalMonthlyPension, 0);
  });
});

// ============================================================
// 7. קצבת שאיר
// ============================================================

describe('קצבת שאיר', () => {
  it('ללא שאיר — מקדם 205 בגיל 67', () => {
    const r = calculateComprehensivePension(makeInput({ spouseOption: 'none' }));
    expect(r.conversionFactor).toBe(205);
    expect(r.monthlyPensionWithSpouse).toBe(r.totalMonthlyPension);
  });

  it('עם שאיר 60% — מקדם גבוה יותר → קצבה נמוכה', () => {
    const r = calculateComprehensivePension(makeInput({ spouseOption: '60pct' }));
    expect(r.conversionFactorWithSpouse).toBeGreaterThan(r.conversionFactor);
    expect(r.monthlyPensionWithSpouse).toBeLessThan(r.totalMonthlyPension);
  });
});

// ============================================================
// 8. ריבוי מקורות
// ============================================================

describe('ריבוי מקורות', () => {
  it('שני מקורות = צבירה כפולה (כשהם זהים)', () => {
    const src1 = makeSource({ id: 'src_1', currentBalance: 100_000 });
    const src2 = makeSource({ id: 'src_2', currentBalance: 100_000 });
    const single = calculateComprehensivePension(makeInput({ sources: [src1] }));
    const double = calculateComprehensivePension(makeInput({ sources: [src1, src2] }));
    expect(double.totalFinalBalance).toBeCloseTo(single.totalFinalBalance * 2, -3);
  });

  it('מקורות שונים מסוכמים נכון', () => {
    const r = calculateComprehensivePension(
      makeInput({
        sources: [
          makeSource({ id: 's1', fundType: 'comprehensive', currentBalance: 100_000 }),
          makeSource({ id: 's2', fundType: 'managers', currentBalance: 50_000 }),
        ],
      }),
    );
    expect(r.sources).toHaveLength(2);
    expect(r.sources[0].fundType).toBe('comprehensive');
    expect(r.sources[1].fundType).toBe('managers');
    expect(r.totalMonthlyPension).toBe(
      r.sources[0].monthlyPension + r.sources[1].monthlyPension,
    );
  });
});

// ============================================================
// 9. goalSeekMonthlyContribution
// ============================================================

describe('goalSeekMonthlyContribution', () => {
  it('יעד פנסיה 10,000 ₪ עם מקדם 205', () => {
    const pmt = goalSeekMonthlyContribution({
      targetMonthlyPension: 10_000,
      conversionFactor: 205,
      currentBalance: 0,
      annualReturn: 5,
      yearsUntilRetirement: 30,
    });
    // PMT חיובי וסביר
    expect(pmt).toBeGreaterThan(0);
    expect(pmt).toBeLessThan(20_000);
  });

  it('עם צבירה קיימת גדולה, PMT קטן יותר', () => {
    const noBalance = goalSeekMonthlyContribution({
      targetMonthlyPension: 10_000,
      conversionFactor: 205,
      currentBalance: 0,
      annualReturn: 5,
      yearsUntilRetirement: 30,
    });
    const withBalance = goalSeekMonthlyContribution({
      targetMonthlyPension: 10_000,
      conversionFactor: 205,
      currentBalance: 1_000_000,
      annualReturn: 5,
      yearsUntilRetirement: 30,
    });
    expect(withBalance).toBeLessThan(noBalance);
  });

  it('פנסיה שכבר מכוסה → PMT = 0', () => {
    const pmt = goalSeekMonthlyContribution({
      targetMonthlyPension: 5_000,
      conversionFactor: 200,
      currentBalance: 5_000_000,
      annualReturn: 5,
      yearsUntilRetirement: 30,
    });
    expect(pmt).toBe(0);
  });
});

// ============================================================
// 10. aggregateMultiSources
// ============================================================

describe('aggregateMultiSources', () => {
  it('מסכם נכון לפי סוג קרן', () => {
    const sourceResults: PensionSourceResult[] = [
      {
        id: 's1',
        label: 'קרן א',
        fundType: 'comprehensive',
        finalBalance: 1_000_000,
        monthlyPension: 5_000,
        totalContributions: 500_000,
        totalGrowth: 300_000,
        effectiveReturn: 4.7,
        monthlyContribution: 3_000,
        yearsContributing: 30,
        realMonthlyPension: 3_500,
      },
      {
        id: 's2',
        label: 'קרן ב',
        fundType: 'managers',
        finalBalance: 500_000,
        monthlyPension: 2_500,
        totalContributions: 200_000,
        totalGrowth: 100_000,
        effectiveReturn: 4.5,
        monthlyContribution: 1_500,
        yearsContributing: 25,
        realMonthlyPension: 1_800,
      },
    ];
    const agg = aggregateMultiSources(sourceResults);
    expect(agg.totalBalance).toBe(1_500_000);
    expect(agg.totalMonthlyPension).toBe(7_500);
    expect(agg.byFundType.comprehensive).toBe(5_000);
    expect(agg.byFundType.managers).toBe(2_500);
  });
});

// ============================================================
// 11. גרף שנתי
// ============================================================

describe('גרף שנתי', () => {
  it('מחזיר נקודות מגיל נוכחי עד פרישה', () => {
    const r = calculateComprehensivePension(makeInput({ currentAge: 35, retirementAge: 67 }));
    expect(r.yearlyData.length).toBe(33); // 0..32
    expect(r.yearlyData[0].age).toBe(35);
    expect(r.yearlyData[32].age).toBe(67);
  });

  it('הצבירה גדלה לאורך השנים', () => {
    const r = calculateComprehensivePension(makeInput());
    const balances = r.yearlyData.map((d) => d.totalBalance);
    for (let i = 1; i < balances.length; i++) {
      expect(balances[i]).toBeGreaterThanOrEqual(balances[i - 1]);
    }
  });
});

// ============================================================
// 12. PENSION_CONSTANTS_2026 — שלמות נתונים
// ============================================================

describe('PENSION_CONSTANTS_2026', () => {
  it('תקרת שכר חיובית', () => {
    expect(PENSION_CONSTANTS_2026.pensionCeiling).toBeGreaterThan(0);
  });

  it('מקדמי המרה קיימים לגיל 67', () => {
    expect(PENSION_CONSTANTS_2026.conversionFactors[67]).toBe(205);
  });

  it('מקדמי שאיר גדולים מרגיל', () => {
    const ages = Object.keys(PENSION_CONSTANTS_2026.conversionFactors).map(Number);
    ages.forEach((age) => {
      const regular = PENSION_CONSTANTS_2026.conversionFactors[age];
      const withSpouse = PENSION_CONSTANTS_2026.conversionFactorsWithSpouse[age];
      if (withSpouse) {
        expect(withSpouse).toBeGreaterThan(regular);
      }
    });
  });

  it('שיעורי הפרשה מינימום = 18.5%', () => {
    const { employee, employer, severance } = PENSION_CONSTANTS_2026.minContribRates;
    expect(employee + employer + severance).toBeCloseTo(18.5, 1);
  });
});

// ============================================================
// 13. פרישה מיידית (0 שנים עד פרישה)
// ============================================================

describe('פרישה מיידית', () => {
  it('צבירה שווה לחיסכון הנוכחי', () => {
    const r = calculateComprehensivePension(
      makeInput({ currentAge: 67, retirementAge: 67, sources: [makeSource({ currentBalance: 500_000 })] }),
    );
    expect(r.yearsUntilRetirement).toBe(0);
    // הצבירה שווה לחיסכון הנוכחי (אין שנים לצמיחה)
    expect(r.totalFinalBalance).toBeCloseTo(500_000, -2);
  });
});

// ============================================================
// 14. ריאלי — אינפלציה
// ============================================================

describe('ריאלי לאחר אינפלציה', () => {
  it('קצבה ריאלית נמוכה מהנומינלית', () => {
    const r = calculateComprehensivePension(makeInput({ inflationRate: 3 }));
    expect(r.realMonthlyPension).toBeLessThan(r.totalMonthlyPension);
  });

  it('אינפלציה 0% → ריאלי = נומינלי', () => {
    const r = calculateComprehensivePension(makeInput({ inflationRate: 0 }));
    expect(r.realMonthlyPension).toBeCloseTo(r.totalMonthlyPension, 0);
  });
});

// ============================================================
// 15. ניתוח יעד
// ============================================================

describe('ניתוח יעד', () => {
  it('כשהקצבה מעל היעד: gap = 0', () => {
    const r = calculateComprehensivePension(makeInput({ targetMonthlyIncome: 1_000 }));
    expect(r.goalAnalysis.gap).toBe(0);
  });

  it('כשהקצבה מתחת ליעד: gap חיובי', () => {
    const r = calculateComprehensivePension(makeInput({ targetMonthlyIncome: 50_000 }));
    expect(r.goalAnalysis.gap).toBeGreaterThan(0);
    expect(r.goalAnalysis.requiredAdditionalMonthly).toBeGreaterThan(0);
  });
});
