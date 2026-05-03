import { describe, it, expect } from 'vitest';
import { calculateHourlyRate } from '@/lib/calculators/hourly-rate';

describe('calculateHourlyRate', () => {
  it('חישוב בסיסי - ערכי ברירת מחדל', () => {
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

    // baseCost = 15,000 / 100 = 150
    // hourlyRate = 150 × 1.20 = 180
    // withVat = 180 × 1.18 = 212.40
    expect(result.hourlyRate).toBeCloseTo(180, 1);
    expect(result.hourlyRateWithVat).toBeCloseTo(212.40, 1);
  });

  it('הכנסה ורווח חודשיים', () => {
    const result = calculateHourlyRate({
      monthlySalary: 10000,
      workingHours: 160,
      billableHours: 100,
      monthlyOverhead: 2000,
      profitMargin: 30,
    });

    // baseCost = 12,000 / 100 = 120
    // hourlyRate = 120 × 1.30 = 156
    // monthlyRevenue = 156 × 100 = 15,600
    // monthlyProfit = 15,600 - 10,000 - 2,000 = 3,600
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
    // 120/160 = 75%
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
