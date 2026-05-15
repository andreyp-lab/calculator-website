import { describe, it, expect } from 'vitest';
import {
  calculateHourlyRate,
  calculateRealisticBillableHours,
  calculateDetailedHourlyRate,
  calculateValueBasedRate,
  compareToSalary,
  calculatePricingTiers,
  compareToIndustryBenchmark,
  calculateVacationSickCompensation,
  INDUSTRY_RATES_2026,
  type DetailedCostInput,
} from '@/lib/calculators/hourly-rate';

// ============================================================
// calculateHourlyRate — תאימות לאחור + בסיסי
// ============================================================

describe('calculateHourlyRate — בסיסי (Cost-Plus)', () => {
  it('חישוב בסיסי — ערכי ברירת מחדל', () => {
    const result = calculateHourlyRate({
      monthlySalary: 15000,
      workingHours: 160,
      billableHours: 120,
      monthlyOverhead: 5000,
      profitMargin: 25,
    });

    // baseCost = (15,000 + 5,000) / 120 = 166.67
    // hourlyRate = 166.67 × 1.25 = 208.33
    expect(result.baseCostPerHour).toBeCloseTo(166.67, 1);
    expect(result.hourlyRate).toBeCloseTo(208.33, 1);
    expect(result.profitPerHour).toBeCloseTo(41.67, 1);
    expect(result.isValid).toBe(true);
  });

  it('תעריף עם מע"מ 18%', () => {
    const result = calculateHourlyRate({
      monthlySalary: 12000,
      workingHours: 160,
      billableHours: 100,
      monthlyOverhead: 3000,
      profitMargin: 20,
    });

    // baseCost = 15,000 / 100 = 150, rate = 150 × 1.20 = 180
    expect(result.hourlyRate).toBeCloseTo(180, 1);
    expect(result.hourlyRateWithVat).toBeCloseTo(212.4, 1);
  });

  it('הכנסה ורווח חודשיים', () => {
    const result = calculateHourlyRate({
      monthlySalary: 10000,
      workingHours: 160,
      billableHours: 100,
      monthlyOverhead: 2000,
      profitMargin: 30,
    });

    // baseCost = 12,000 / 100 = 120, rate = 120 × 1.30 = 156
    expect(result.monthlyRevenue).toBeCloseTo(15600, 0);
    expect(result.monthlyProfit).toBeCloseTo(3600, 0);
  });

  it('אחוז ניצול שעות', () => {
    const result = calculateHourlyRate({
      monthlySalary: 15000,
      workingHours: 160,
      billableHours: 120,
      monthlyOverhead: 5000,
      profitMargin: 25,
    });
    expect(result.utilizationRate).toBe(75);
  });

  it('תעריף יומי = שעתי × 8', () => {
    const result = calculateHourlyRate({
      monthlySalary: 15000,
      workingHours: 160,
      billableHours: 120,
      monthlyOverhead: 5000,
      profitMargin: 25,
    });
    expect(result.dailyRate).toBeCloseTo(result.hourlyRate * 8, 2);
  });

  it('שעות לחיוב = 0 → תוצאה לא תקינה', () => {
    const result = calculateHourlyRate({
      monthlySalary: 15000,
      workingHours: 160,
      billableHours: 0,
      monthlyOverhead: 5000,
      profitMargin: 25,
    });
    expect(result.isValid).toBe(false);
    expect(result.warning).toBeDefined();
  });

  it('שעות חיוב גדולות משעות עבודה → אזהרה', () => {
    const result = calculateHourlyRate({
      monthlySalary: 15000,
      workingHours: 100,
      billableHours: 150,
      monthlyOverhead: 5000,
      profitMargin: 25,
    });
    expect(result.isValid).toBe(false);
    expect(result.warning).toContain('שעות לחיוב');
  });

  it('ללא רווח → תעריף שווה לעלות', () => {
    const result = calculateHourlyRate({
      monthlySalary: 10000,
      workingHours: 160,
      billableHours: 100,
      monthlyOverhead: 2000,
      profitMargin: 0,
    });
    expect(result.hourlyRate).toBeCloseTo(result.baseCostPerHour, 2);
    expect(result.profitPerHour).toBeCloseTo(0, 2);
  });

  it('שיעור מע"מ מותאם אישית', () => {
    const result = calculateHourlyRate({
      monthlySalary: 10000,
      workingHours: 160,
      billableHours: 100,
      monthlyOverhead: 0,
      profitMargin: 0,
      vatRate: 0,
    });
    expect(result.hourlyRateWithVat).toBeCloseTo(result.hourlyRate, 2);
  });
});

// ============================================================
// calculateRealisticBillableHours
// ============================================================

describe('calculateRealisticBillableHours', () => {
  it('חישוב ריאליסטי — ברירת מחדל', () => {
    const result = calculateRealisticBillableHours({
      vacationDays: 15,
      sickDays: 7,
      holidayDays: 9,
      adminPercent: 25,
      hoursPerDay: 8,
    });

    // 52 × 5 = 260 ימי עבודה גולמי
    // 260 - 15 - 7 - 9 = 229 ימים זמינים
    // 229 × 0.75 = 171.75 ≈ 172 ימי חיוב
    expect(result.grossWorkingDays).toBe(260);
    expect(result.netBillableDays).toBeGreaterThan(160);
    expect(result.netBillableDays).toBeLessThan(180);
    expect(result.netBillableHoursPerMonth).toBeGreaterThan(100);
    expect(result.netBillableHoursPerMonth).toBeLessThan(120);
  });

  it('מינימום — הרבה חופשה + ניהול גבוה', () => {
    const result = calculateRealisticBillableHours({
      vacationDays: 20,
      sickDays: 10,
      holidayDays: 9,
      adminPercent: 35,
      hoursPerDay: 8,
    });
    // 260 - 39 = 221 × 0.65 ≈ 144 ימים
    expect(result.netBillableDays).toBeLessThan(150);
    expect(result.netBillableHoursPerMonth).toBeLessThan(100);
  });

  it('הנחת 160×12 גדולה מהריאלי', () => {
    const result = calculateRealisticBillableHours({
      vacationDays: 15,
      sickDays: 7,
      holidayDays: 9,
      adminPercent: 25,
    });
    expect(result.comparisonToNaive).toBeGreaterThan(0);
  });

  it('ניצול לא עולה על 100%', () => {
    const result = calculateRealisticBillableHours({
      vacationDays: 0,
      sickDays: 0,
      holidayDays: 0,
      adminPercent: 0,
    });
    expect(result.utilizationPercent).toBeLessThanOrEqual(100);
  });

  it('adminPercent נחסם ל-80 — ולכן שעות חיוב לא 0', () => {
    // הפונקציה מגבילה adminPercent ל-80 מקסימום
    const result = calculateRealisticBillableHours({
      vacationDays: 0,
      sickDays: 0,
      holidayDays: 0,
      adminPercent: 100,  // ייחסם ל-80
    });
    // עם adminPercent=80: billableDays = 260 * 0.20 = 52
    expect(result.netBillableDays).toBe(52);
    expect(result.netBillableHoursPerMonth).toBeGreaterThan(0);
  });
});

// ============================================================
// calculateDetailedHourlyRate
// ============================================================

describe('calculateDetailedHourlyRate', () => {
  const baseInput: DetailedCostInput = {
    targetMonthlySalary: 20_000,
    homeOfficeRent: 1_000,
    internetPhone: 400,
    softwareSubscriptions: 500,
    hardwareDepreciation: 300,
    healthInsurance: 400,
    professionalInsurance: 300,
    marketing: 800,
    meetingExpenses: 300,
    training: 300,
    pensionRate: 4.5,
    studyFundEnabled: false,
    businessType: 'osek-morsheh',
    creditPoints: 2.25,
    billableHoursMonthly: 120,
    profitMargin: 20,
    vatRate: 0.18,
  };

  it('תעריף שעתי מפורט חיובי', () => {
    const result = calculateDetailedHourlyRate(baseInput);
    expect(result.requiredHourlyRate).toBeGreaterThan(0);
    expect(result.requiredHourlyRateWithVat).toBeGreaterThan(result.requiredHourlyRate);
  });

  it('הוצאות קבועות מחושבות נכון', () => {
    const result = calculateDetailedHourlyRate(baseInput);
    const expectedFixed = 1000 + 400 + 500 + 300 + 400 + 300;
    expect(result.fixedCostsMonthly).toBe(expectedFixed);
  });

  it('הוצאות משתנות מחושבות נכון', () => {
    const result = calculateDetailedHourlyRate(baseInput);
    const expectedVariable = 800 + 300 + 300;
    expect(result.variableCostsMonthly).toBe(expectedVariable);
  });

  it('תעריף מפורט גבוה מ-Cost-Plus בסיסי', () => {
    const simple = calculateHourlyRate({
      monthlySalary: 20_000,
      workingHours: 160,
      billableHours: 120,
      monthlyOverhead: 3_300,
      profitMargin: 20,
    });
    const detailed = calculateDetailedHourlyRate(baseInput);
    // המפורט כולל מסים וב.ל. — חייב להיות גבוה יותר
    expect(detailed.requiredHourlyRate).toBeGreaterThan(simple.hourlyRate);
  });

  it('קרן השתלמות מוסיפה לעלות', () => {
    const without = calculateDetailedHourlyRate({ ...baseInput, studyFundEnabled: false });
    const withFund = calculateDetailedHourlyRate({ ...baseInput, studyFundEnabled: true });
    expect(withFund.totalCostMonthly).toBeGreaterThan(without.totalCostMonthly);
  });

  it('מרווח רווח 0 → הכנסה נדרשת = עלות', () => {
    const result = calculateDetailedHourlyRate({ ...baseInput, profitMargin: 0 });
    expect(result.requiredRevenueMonthly).toBeCloseTo(result.totalCostMonthly, 0);
  });

  it('פירוט עלויות לא ריק', () => {
    const result = calculateDetailedHourlyRate(baseInput);
    expect(result.costBreakdown.length).toBeGreaterThan(3);
  });

  it('שיעור מס אפקטיבי בין 0 ל-50%', () => {
    const result = calculateDetailedHourlyRate(baseInput);
    expect(result.effectiveTaxRate).toBeGreaterThanOrEqual(0);
    expect(result.effectiveTaxRate).toBeLessThanOrEqual(0.5);
  });
});

// ============================================================
// calculateValueBasedRate
// ============================================================

describe('calculateValueBasedRate', () => {
  it('חישוב ערך ללקוח בסיסי', () => {
    const result = calculateValueBasedRate({
      clientAnnualValue: 1_000_000,
      valueCapturePercent: 20,
      projectHours: 100,
    });
    expect(result.capturedValue).toBe(200_000);
    expect(result.impliedHourlyRate).toBe(2000);
    expect(result.impliedHourlyRateWithVat).toBeCloseTo(2360, 0);
  });

  it('10% מ-500K = 50K; 50 שעות = 1000₪/ש׳', () => {
    const result = calculateValueBasedRate({
      clientAnnualValue: 500_000,
      valueCapturePercent: 10,
      projectHours: 50,
    });
    expect(result.capturedValue).toBe(50_000);
    expect(result.impliedHourlyRate).toBe(1000);
  });

  it('0 שעות → 0 תעריף', () => {
    const result = calculateValueBasedRate({
      clientAnnualValue: 100_000,
      valueCapturePercent: 20,
      projectHours: 0,
    });
    expect(result.impliedHourlyRate).toBe(0);
  });

  it('השוואה — תעריף נמוך מ-150 → הוספת אזהרה', () => {
    const result = calculateValueBasedRate({
      clientAnnualValue: 50_000,
      valueCapturePercent: 5,
      projectHours: 200,
    });
    expect(result.comparison).toContain('נמוך');
  });
});

// ============================================================
// compareToSalary
// ============================================================

describe('compareToSalary', () => {
  it('תעריף גבוה → עצמאי מרוויח יותר מהשכיר', () => {
    const result = compareToSalary(400, 120, 5000, 2.25);
    // הכנסה שנתית: 400 × 120 × 12 = 576,000
    expect(result.annualRevenue).toBe(576_000);
    expect(result.selfEmployedNetMonthly).toBeGreaterThan(0);
  });

  it('breakEvenHourlyRate חיובי', () => {
    const result = compareToSalary(300, 120, 4000, 2.25);
    expect(result.breakEvenHourlyRate).toBeGreaterThan(0);
  });

  it('equivalentEmployeeSalaryGross חיובי', () => {
    const result = compareToSalary(250, 100, 3000, 2.25);
    expect(result.equivalentEmployeeSalaryGross).toBeGreaterThan(0);
  });
});

// ============================================================
// calculatePricingTiers
// ============================================================

describe('calculatePricingTiers', () => {
  it('לקוח חוזר = -15%', () => {
    const result = calculatePricingTiers(200, 0.18);
    expect(result.repeatClient).toBe(Math.round(200 * 0.85));
  });

  it('דחוף = +25%', () => {
    const result = calculatePricingTiers(200, 0.18);
    expect(result.rushJob).toBe(Math.round(200 * 1.25));
  });

  it('רטיינר = -10%', () => {
    const result = calculatePricingTiers(200, 0.18);
    expect(result.longRetainer).toBe(Math.round(200 * 0.9));
  });

  it('אסטרטגי = +50%', () => {
    const result = calculatePricingTiers(200, 0.18);
    expect(result.strategicWork).toBe(Math.round(200 * 1.5));
  });

  it('withVat.newClient = base × 1.18', () => {
    const result = calculatePricingTiers(300, 0.18);
    expect(result.withVat.newClient).toBe(Math.round(300 * 1.18));
  });

  it('newClient = base rate', () => {
    const result = calculatePricingTiers(350, 0.18);
    expect(result.newClient).toBe(350);
  });
});

// ============================================================
// compareToIndustryBenchmark
// ============================================================

describe('compareToIndustryBenchmark', () => {
  it('תעריף מתחת מינימום → below', () => {
    const bench = INDUSTRY_RATES_2026.juniorDeveloper; // min: 180
    const result = compareToIndustryBenchmark(100, 'juniorDeveloper');
    expect(result.percentile).toBe('below');
  });

  it('תעריף מעל מקסימום → premium', () => {
    const bench = INDUSTRY_RATES_2026.juniorDeveloper; // max: 280
    const result = compareToIndustryBenchmark(400, 'juniorDeveloper');
    expect(result.percentile).toBe('premium');
  });

  it('תעריף בטווח → mid או high', () => {
    const result = compareToIndustryBenchmark(350, 'midDeveloper'); // min:280, max:450
    expect(['mid', 'high']).toContain(result.percentile);
  });

  it('benchmarkMin ו-Max נכונים', () => {
    const result = compareToIndustryBenchmark(300, 'seniorDeveloper');
    expect(result.benchmarkMin).toBe(INDUSTRY_RATES_2026.seniorDeveloper.min);
    expect(result.benchmarkMax).toBe(INDUSTRY_RATES_2026.seniorDeveloper.max);
  });

  it('recommendation לא ריק', () => {
    const result = compareToIndustryBenchmark(250, 'designer');
    expect(result.recommendation.length).toBeGreaterThan(5);
  });
});

// ============================================================
// calculateVacationSickCompensation
// ============================================================

describe('calculateVacationSickCompensation', () => {
  it('פיצוי חיובי לימי חופשה + מחלה', () => {
    const result = calculateVacationSickCompensation(300, 15, 7);
    expect(result.hourlyAddition).toBeGreaterThan(0);
    expect(result.annualLostRevenue).toBeGreaterThan(0);
  });

  it('ללא ימי היעדרות → 0 פיצוי', () => {
    const result = calculateVacationSickCompensation(300, 0, 0);
    expect(result.hourlyAddition).toBe(0);
    expect(result.annualLostRevenue).toBe(0);
  });

  it('הכנסה שנתית אבודה = ימים × 8 × תעריף', () => {
    const result = calculateVacationSickCompensation(200, 10, 5);
    // 15 ימים × 8 שעות × 200 ₪ = 24,000
    expect(result.annualLostRevenue).toBeCloseTo(24_000, 0);
  });
});

// ============================================================
// INDUSTRY_RATES_2026 — בדיקת קבועים
// ============================================================

describe('INDUSTRY_RATES_2026', () => {
  it('יש לפחות 10 תחומים', () => {
    expect(Object.keys(INDUSTRY_RATES_2026).length).toBeGreaterThanOrEqual(10);
  });

  it('כל תחום יש min < max', () => {
    for (const [key, val] of Object.entries(INDUSTRY_RATES_2026)) {
      expect(val.min).toBeLessThan(val.max);
    }
  });

  it('כל תחום יש mid בין min ל-max', () => {
    for (const [key, val] of Object.entries(INDUSTRY_RATES_2026)) {
      expect(val.mid).toBeGreaterThanOrEqual(val.min);
      expect(val.mid).toBeLessThanOrEqual(val.max);
    }
  });

  it('מפתח סניור מינימום ≥ ג׳וניור מקסימום', () => {
    expect(INDUSTRY_RATES_2026.seniorDeveloper.min).toBeGreaterThanOrEqual(
      INDUSTRY_RATES_2026.juniorDeveloper.max,
    );
  });
});
