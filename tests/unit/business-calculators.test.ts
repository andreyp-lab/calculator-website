import { describe, it, expect } from 'vitest';
import { calculateCorpVsIndividual } from '@/lib/calculators/corporation-vs-individual';
import { calculateBreakEven } from '@/lib/calculators/break-even';
import { calculateBusinessValuation } from '@/lib/calculators/business-valuation';
import { calculateDividendVsSalary } from '@/lib/calculators/dividend-vs-salary';
import { calculateCLV } from '@/lib/calculators/customer-lifetime-value';

// =====================================================
// Corp vs Individual
// =====================================================
const DEFAULT_CORP_INPUT = {
  salaryDividendMix: 0.3,
  corpRunningCosts: 20_000,
  isControllingOwner: true,
  annualGrowthRate: 0.1,
  projectionYears: 5,
  includeStudyFundIndividual: false,
  includeStudyFundCorp: false,
  studyFundRateIndividual: 0.045,
};

describe('calculateCorpVsIndividual', () => {
  it('רווח 200K - עוסק מורשה עדיף', () => {
    const r = calculateCorpVsIndividual({ ...DEFAULT_CORP_INPUT, annualProfit: 200_000, creditPoints: 2.25 });
    expect(r.recommendation).toBe('individual');
    expect(r.individual.netToOwner).toBeGreaterThan(r.corporationDividend.netToOwner);
  });

  it('רווח 5M - חברה עדיפה', () => {
    const r = calculateCorpVsIndividual({ ...DEFAULT_CORP_INPUT, annualProfit: 5_000_000, creditPoints: 2.25 });
    // ברווח גבוה מאוד, מס אישי שולי 50%+מס יסף, חברה+דיב 48.4%
    expect(r.recommendation).not.toBe('individual');
    expect(r.taxSavingsVsIndividual).toBeGreaterThan(0);
  });

  it('רווח 0 - אין מס', () => {
    const r = calculateCorpVsIndividual({ ...DEFAULT_CORP_INPUT, annualProfit: 0, creditPoints: 2.25 });
    expect(r.individual.totalTax).toBe(0);
    expect(r.corporationDividend.totalTax).toBe(0);
  });

  it('שיעור מס אפקטיבי בחברה ~48.4%', () => {
    const r = calculateCorpVsIndividual({ ...DEFAULT_CORP_INPUT, annualProfit: 1_000_000, creditPoints: 0, corpRunningCosts: 0 });
    expect(r.corporationDividend.effectiveTaxRate).toBeCloseTo(0.484, 2); // 23% + 33%×77% ≈ 48.4%
  });
});

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

// =====================================================
// Business Valuation
// =====================================================
describe('calculateBusinessValuation', () => {
  it('עסק שירותים - מכפיל 4 על EBITDA', () => {
    const r = calculateBusinessValuation({
      annualRevenue: 5_000_000,
      ebitda: 800_000,
      netProfit: 600_000,
      industry: 'services',
      growthRate: 5,
      yearsToProject: 5,
      discountRate: 12,
    });
    expect(r.appliedMultiple).toBe(4);
    expect(r.ebitdaMultipleValue).toBe(3_200_000);
    expect(r.averageValue).toBeGreaterThan(0);
  });

  it('SaaS - מכפיל הכנסות גבוה', () => {
    const r = calculateBusinessValuation({
      annualRevenue: 10_000_000,
      ebitda: 1_500_000,
      netProfit: 1_000_000,
      industry: 'tech-saas',
      growthRate: 30,
      yearsToProject: 5,
      discountRate: 15,
    });
    // tech-saas: ebitda 8x, revenue 4x
    expect(r.ebitdaMultipleValue).toBe(12_000_000);
    expect(r.revenueMultipleValue).toBe(40_000_000);
  });

  it('מכפיל מותאם אישית', () => {
    const r = calculateBusinessValuation({
      annualRevenue: 3_000_000,
      ebitda: 500_000,
      netProfit: 400_000,
      industry: 'services',
      growthRate: 5,
      yearsToProject: 5,
      discountRate: 10,
      customMultiple: 6,
    });
    expect(r.appliedMultiple).toBe(6);
    expect(r.ebitdaMultipleValue).toBe(3_000_000);
  });

  it('טווח השווי הגיוני', () => {
    const r = calculateBusinessValuation({
      annualRevenue: 5_000_000,
      ebitda: 800_000,
      netProfit: 600_000,
      industry: 'services',
      growthRate: 5,
      yearsToProject: 5,
      discountRate: 12,
    });
    expect(r.range.low).toBeLessThan(r.averageValue);
    expect(r.range.high).toBeGreaterThan(r.averageValue);
  });
});

// =====================================================
// Dividend vs Salary
// =====================================================
describe('calculateDividendVsSalary', () => {
  it('רווח 500K - בעל מניות מהותי', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 500_000,
      withdrawalNeeds: 300_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    expect(r.optimal.netToOwner).toBeGreaterThanOrEqual(r.allSalary.netToOwner);
    expect(r.optimal.netToOwner).toBeGreaterThanOrEqual(r.allDividend.netToOwner);
  });

  it('רווח גבוה מאוד - דיב\' מנצח', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 2_000_000,
      withdrawalNeeds: 1_500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    // ברווחים מאוד גבוהים, אופטימום בד"כ עם הרבה דיב'
    expect(r.optimal.dividend).toBeGreaterThan(0);
  });

  it('שיעור מס אפקטיבי דיב\' לבעל מניות מהותי = ~46% (23% מס חברות + 30% מס דיב\' + מס יסף)', () => {
    const r = calculateDividendVsSalary({
      companyAnnualProfit: 1_000_000,
      withdrawalNeeds: 1_000_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    // 23% + 0.77×30% = 46.1% + מס יסף על ~48.44K ₪ ≈ 0.46%
    // שיעור מס אפקטיבי ~46.2%
    expect(r.allDividend.effectiveTaxRate).toBeGreaterThan(0.46);
    expect(r.allDividend.effectiveTaxRate).toBeLessThan(0.50);
  });

  it('בעל מניות לא מהותי - מס דיב\' רק 25%', () => {
    const material = calculateDividendVsSalary({
      companyAnnualProfit: 500_000,
      withdrawalNeeds: 500_000,
      creditPoints: 2.25,
      isMaterialShareholder: true,
    });
    const regular = calculateDividendVsSalary({
      companyAnnualProfit: 500_000,
      withdrawalNeeds: 500_000,
      creditPoints: 2.25,
      isMaterialShareholder: false,
    });
    expect(regular.allDividend.netToOwner).toBeGreaterThan(material.allDividend.netToOwner);
  });
});

// =====================================================
// CLV
// =====================================================
describe('calculateCLV', () => {
  it('SaaS בריא - LTV/CAC > 3', () => {
    const r = calculateCLV({
      averageOrderValue: 200,
      purchasesPerYear: 12,
      customerLifespanYears: 3,
      grossMargin: 80,
      customerAcquisitionCost: 1_000,
    });
    // Total revenue = 200 × 12 × 3 = 7,200
    // Gross profit = 7,200 × 80% = 5,760
    // CLV = 5,760 - 1,000 = 4,760
    // LTV/CAC = 5,760/1,000 = 5.76
    expect(r.totalRevenuePerCustomer).toBe(7_200);
    expect(r.grossProfitPerCustomer).toBeCloseTo(5_760, 0);
    expect(r.clv).toBeCloseTo(4_760, 0);
    expect(r.ltvCacRatio).toBeCloseTo(5.76, 2);
    expect(r.rating).toBe('excellent');
  });

  it('עסק מפסיד - CAC גבוה מ-LTV', () => {
    const r = calculateCLV({
      averageOrderValue: 100,
      purchasesPerYear: 4,
      customerLifespanYears: 1,
      grossMargin: 30,
      customerAcquisitionCost: 200,
    });
    // Total = 400, GP = 120, CLV = -80
    expect(r.clv).toBe(-80);
    expect(r.rating).toBe('poor');
  });

  it('Churn rate חודשי - מתורגם ל-lifespan', () => {
    const r = calculateCLV({
      averageOrderValue: 100,
      purchasesPerYear: 12,
      customerLifespanYears: 5, // יודחה
      grossMargin: 70,
      customerAcquisitionCost: 500,
      monthlyChurnRate: 5, // 5%/חודש = 1/0.05 = 20 חודש = 1.67 שנים
    });
    expect(r.effectiveLifespan).toBeCloseTo(1.667, 2);
  });

  it('Payback - חישוב נכון', () => {
    const r = calculateCLV({
      averageOrderValue: 100,
      purchasesPerYear: 12,
      customerLifespanYears: 2,
      grossMargin: 50,
      customerAcquisitionCost: 600,
    });
    // Monthly GP = 100 × 12 / 12 × 50% = 50
    // Payback = 600 / 50 = 12 months
    expect(r.paybackMonths).toBe(12);
  });
});
