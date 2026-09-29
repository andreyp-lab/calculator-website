import { describe, it, expect } from 'vitest';
import { calculateSalaryNetGross } from '@/lib/calculators/salary-net-gross';

describe('Salary Net/Gross', () => {
  it('שכר 15K עם פנסיה - חישוב נטו תקין', () => {
    const r = calculateSalaryNetGross({
      grossSalary: 15_000,
      creditPoints: 2.25,
      pensionEnabled: true,
      studyFundEnabled: false,
      monthlyWorkHours: 182,
    });
    expect(r.grossSalary).toBe(15_000);
    expect(r.netSalary).toBeGreaterThan(10_000);
    expect(r.netSalary).toBeLessThan(13_000);
    expect(r.pensionDeduction).toBe(900); // 6%
  });

  it('עלות מעסיק כוללת', () => {
    const r = calculateSalaryNetGross({
      grossSalary: 10_000,
      creditPoints: 2.25,
      pensionEnabled: true,
      studyFundEnabled: false,
      monthlyWorkHours: 182,
    });
    // עלות = שכר + 4.51% ב.ל. + 6.5% פנסיה + 8.33% פיצויים
    expect(r.totalEmployerCost).toBeGreaterThan(11_500);
    expect(r.totalEmployerCost).toBeLessThan(13_000);
  });
});
