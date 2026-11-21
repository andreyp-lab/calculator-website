import { describe, it, expect } from 'vitest';
import { checkWorkGrant, type WorkGrantInput } from '@/lib/calculators/work-grant';
import { calculateCompanyCarBenefit, carPayslipImpact } from '@/lib/calculators/company-car-benefit';
import { WORK_GRANT_2025 } from '@/lib/constants/benefits-2026';

const base: WorkGrantInput = { age: 35, sex: 'male', birthYear: 1990, children: 2, toddlers: 0, singleParent: false, annualWorkIncome: 60000, workMonths: 12, ownsOtherProperty: false, allIncomeFromRelative: false };

describe('work grant eligibility (Tax Authority guide, tax year 2025)', () => {
  it('2 children, 5,000 avg monthly → eligible for the general grant', () => {
    const r = checkWorkGrant(base)!;
    expect(r.avgMonthlyIncome).toBe(5000);
    expect(r.general.eligible).toBe(true);
    expect(r.enlarged150).toBe(true);
  });
  it('band edges are exclusive', () => {
    expect(checkWorkGrant({ ...base, annualWorkIncome: 2450 * 12 })!.general.eligible).toBe(false);
    expect(checkWorkGrant({ ...base, annualWorkIncome: 2451 * 12 })!.general.eligible).toBe(true);
    expect(checkWorkGrant({ ...base, annualWorkIncome: 7289 * 12 })!.general.eligible).toBe(false);
    expect(checkWorkGrant({ ...base, annualWorkIncome: 7288 * 12 })!.general.eligible).toBe(true);
  });
  it('3+ children raise the ceiling to 8,020; single parent to 11,190 / 13,660', () => {
    expect(checkWorkGrant({ ...base, children: 3, annualWorkIncome: 8000 * 12 })!.general.eligible).toBe(true);
    expect(checkWorkGrant({ ...base, children: 2, annualWorkIncome: 8000 * 12 })!.general.eligible).toBe(false);
    expect(checkWorkGrant({ ...base, singleParent: true, annualWorkIncome: 11000 * 12 })!.general.eligible).toBe(true);
    expect(checkWorkGrant({ ...base, singleParent: true, children: 3, annualWorkIncome: 13000 * 12 })!.general.eligible).toBe(true);
    expect(checkWorkGrant({ ...base, singleParent: true, annualWorkIncome: 1500 * 12 })!.general.eligible).toBe(false);
    expect(checkWorkGrant({ ...base, singleParent: true, annualWorkIncome: 1511 * 12 })!.general.eligible).toBe(true);
  });
  it('no children: only age 55+ qualifies for the general grant', () => {
    expect(checkWorkGrant({ ...base, children: 0 })!.general.band).toBeNull();
    expect(checkWorkGrant({ ...base, children: 0, age: 56 })!.general.eligible).toBe(true);
    expect(checkWorkGrant({ ...base, children: 0, age: 56 })!.enlarged150).toBe(false);
  });
  it('women 60–65 born 1960+: 920–8,930', () => {
    const w = checkWorkGrant({ ...base, sex: 'female', children: 0, age: 62, birthYear: 1963, annualWorkIncome: 8500 * 12 })!;
    expect(w.women60to65.eligible).toBe(true);
    expect(w.general.eligible).toBe(false);
    expect(checkWorkGrant({ ...base, sex: 'female', children: 0, age: 62, birthYear: 1959, annualWorkIncome: 8500 * 12 })!.women60to65.band).toBeNull();
  });
  it('toddler supplement: up to 500 per toddler, even when over the general ceiling', () => {
    const r = checkWorkGrant({ ...base, toddlers: 2, annualWorkIncome: 8500 * 12 })!;
    expect(r.general.eligible).toBe(false);
    expect(r.toddler.eligible).toBe(true);
    expect(r.toddler.maxSupplement).toBe(1000);
    expect(WORK_GRANT_2025.toddlerSupplementPerChild).toBe(500);
  });
  it('blockers: extra property or income from a relative', () => {
    const r = checkWorkGrant({ ...base, ownsOtherProperty: true })!;
    expect(r.likelyEligible).toBe(false);
    expect(r.blockers).toHaveLength(1);
    expect(checkWorkGrant({ ...base, allIncomeFromRelative: true })!.likelyEligible).toBe(false);
  });
  it('average uses work months', () => {
    expect(checkWorkGrant({ ...base, annualWorkIncome: 30000, workMonths: 6 })!.avgMonthlyIncome).toBe(5000);
  });
  it('invalid', () => {
    expect(checkWorkGrant({ ...base, toddlers: 3 })).toBeNull();
    expect(checkWorkGrant({ ...base, workMonths: 0 })).toBeNull();
    expect(checkWorkGrant({ ...base, age: NaN })).toBeNull();
  });
});

describe('company car benefit (2026 booklet)', () => {
  it('car from 2010: 2.48% of the price, capped at 596,860', () => {
    const r = calculateCompanyCarBenefit({ kind: 'car-2010', price: 200000 })!;
    expect(r.monthlyBenefit).toBe(4960);
    expect(r.annualBenefit).toBe(59520);
    expect(r.cappedByCeiling).toBe(false);
    const cap = calculateCompanyCarBenefit({ kind: 'car-2010', price: 800000 })!;
    expect(cap.cappedByCeiling).toBe(true);
    expect(cap.priceUsed).toBe(596860);
    expect(cap.monthlyBenefit).toBe(14802.13);
  });
  it('advanced propulsion reductions (hybrid 580, plug-in 1,150, EV 1,380), never below zero', () => {
    expect(calculateCompanyCarBenefit({ kind: 'car-2010', price: 200000, tech: 'hybrid' })!.monthlyBenefit).toBe(4380);
    expect(calculateCompanyCarBenefit({ kind: 'car-2010', price: 200000, tech: 'plugin' })!.monthlyBenefit).toBe(3810);
    expect(calculateCompanyCarBenefit({ kind: 'car-2010', price: 200000, tech: 'electric' })!.monthlyBenefit).toBe(3580);
    expect(calculateCompanyCarBenefit({ kind: 'car-2010', price: 40000, tech: 'electric' })!.monthlyBenefit).toBe(0);
  });
  it('cars before 2010 by price group; motorcycle', () => {
    expect(calculateCompanyCarBenefit({ kind: 'car-pre-2010', priceGroup: 1 })!.monthlyBenefit).toBe(3220);
    expect(calculateCompanyCarBenefit({ kind: 'car-pre-2010', priceGroup: 7 })!.annualBenefit).toBe(149160);
    expect(calculateCompanyCarBenefit({ kind: 'car-pre-2010', priceGroup: 8 })).toBeNull();
    expect(calculateCompanyCarBenefit({ kind: 'motorcycle' })!.monthlyBenefit).toBe(1070);
  });
  it('invalid price', () => {
    expect(calculateCompanyCarBenefit({ kind: 'car-2010', price: 0 })).toBeNull();
    expect(calculateCompanyCarBenefit({ kind: 'car-2010' })).toBeNull();
  });
  it('payslip impact: the benefit adds tax and contributions, so net drops by less than the benefit', () => {
    const r = carPayslipImpact(15000, 4960)!;
    expect(r.monthlyNetCost).toBeGreaterThan(1000);
    expect(r.monthlyNetCost).toBeLessThan(4960);
    expect(r.costPctOfBenefit).toBeGreaterThan(20);
    expect(carPayslipImpact(0, 100)).toBeNull();
  });
});
