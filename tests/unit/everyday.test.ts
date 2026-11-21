import { describe, it, expect } from 'vitest';
import * as E from '@/lib/calculators/everyday';

describe('percentages and discounts', () => {
  it('basics', () => {
    expect(E.percentOf(15, 200)).toBe(30);
    expect(E.whatPercent(30, 200)).toBe(15);
    expect(E.whatPercent(1, 0)).toBeNull();
    expect(E.percentChange(80, 100)).toBe(25);
    expect(E.percentChange(100, 80)).toBe(-20);
    expect(E.percentChange(0, 5)).toBeNull();
    expect(E.applyPercent(200, 18)).toBe(236);
    expect(E.applyPercent(200, -25)).toBe(150);
    expect(E.originalBeforePercent(236, 18)).toBe(200);
  });
  it('two 20% discounts are 36%, not 40%', () => {
    const r = E.successiveDiscounts(1000, [20, 20])!;
    expect(r.finalPrice).toBe(640);
    expect(r.combinedPct).toBe(36);
    expect(r.saved).toBe(360);
    expect(E.successiveDiscounts(100, [101])).toBeNull();
  });
});

describe('tip and split', () => {
  it('tip per person', () => {
    const r = E.calculateTip(400, 12, 4)!;
    expect(r.tip).toBe(48);
    expect(r.total).toBe(448);
    expect(r.perPerson).toBe(112);
    expect(E.calculateTip(100, 10, 0)).toBeNull();
  });
  it('settle with minimal transfers', () => {
    const r = E.splitExpenses([{ name: 'א', paid: 300 }, { name: 'ב', paid: 0 }, { name: 'ג', paid: 0 }])!;
    expect(r.share).toBe(100);
    expect(r.settlements).toEqual([{ from: 'ב', to: 'א', amount: 100 }, { from: 'ג', to: 'א', amount: 100 }]);
    const even = E.splitExpenses([{ name: 'א', paid: 50 }, { name: 'ב', paid: 50 }])!;
    expect(even.settlements).toHaveLength(0);
    expect(E.splitExpenses([{ name: 'א', paid: 5 }])).toBeNull();
  });
});

describe('averages', () => {
  it('simple and weighted', () => {
    expect(E.simpleAverage([80, 90, 100])).toBe(90);
    expect(E.weightedAverage([{ value: 90, weight: 5 }, { value: 70, weight: 3 }, { value: 100, weight: 2 }])).toBe(86);
    expect(E.weightedAverage([])).toBeNull();
    expect(E.weightedAverage([{ value: 90, weight: -1 }])).toBeNull();
  });
});

describe('speed, geometry, units', () => {
  it('speed/time/distance', () => {
    expect(E.speedTimeDistance({ speed: 90, time: 2 })).toEqual({ distance: 180 });
    expect(E.speedTimeDistance({ speed: 60, distance: 150 })).toEqual({ time: 2.5 });
    expect(E.speedTimeDistance({ time: 2, distance: 150 })).toEqual({ speed: 75 });
    expect(E.speedTimeDistance({ speed: 60 })).toBeNull();
    expect(E.speedTimeDistance({ speed: 0, distance: 10 })).toBeNull();
  });
  it('area and volume', () => {
    expect(E.area('rectangle', 4, 5)).toBe(20);
    expect(E.area('circle', 2)).toBe(12.5664);
    expect(E.area('triangle', 6, 4)).toBe(12);
    expect(E.area('trapezoid', 3, 5, 2)).toBe(8);
    expect(E.volume('box', 2, 3, 4)).toBe(24);
    expect(E.volume('sphere', 3)).toBe(113.0973);
    expect(E.volume('cylinder', 2, 5)).toBe(62.8319);
    expect(E.area('rectangle', -1, 2)).toBeNull();
  });
  it('unit conversions', () => {
    expect(E.convertUnit('length', 'mile', 'km', 1)).toBe(1.609344);
    expect(E.convertUnit('weight', 'lb', 'kg', 10)).toBe(4.535924);
    expect(E.convertUnit('area', 'dunam', 'm2', 2)).toBe(2000);
    expect(E.convertUnit('cooking', 'cup', 'ml', 1)).toBe(236.588237);
    expect(E.convertUnit('cooking', 'tbsp', 'tsp', 1)).toBe(3);
    expect(E.convertUnit('length', 'x', 'km', 1)).toBeNull();
    expect(E.convertTemperature(100, 'C', 'F')).toBe(212);
    expect(E.convertTemperature(32, 'F', 'C')).toBe(0);
    expect(E.convertTemperature(0, 'C', 'K')).toBe(273.15);
    expect(E.convertTemperature(-300, 'C', 'K')).toBeNull();
  });
});

describe('dates', () => {
  it('difference', () => {
    const d = E.dateDifference('2026-01-01', '2026-03-01')!;
    expect(d.totalDays).toBe(59);
    expect(d.months).toBe(2);
    expect(d.weeks).toBe(8);
    expect(E.dateDifference('2026-03-01', '2026-01-01')!.totalDays).toBe(59);
    expect(E.dateDifference('x', '2026-01-01')).toBeNull();
  });
  it('weekdays exclude Friday and Saturday (Sunday–Thursday work week)', () => {
    // 2026-11-15 (ראשון) עד 2026-11-22 (ראשון הבא): 7 ימים, 5 ימי עבודה
    expect(E.dateDifference('2026-11-15', '2026-11-22')!.weekdays).toBe(5);
  });
  it('add days', () => {
    expect(E.addDays('2026-02-27', 3)).toBe('2026-03-02');
    expect(E.addDays('2026-01-01', -1)).toBe('2025-12-31');
  });
  it('age and next birthday', () => {
    const a = E.calculateAge('1990-05-20', '2026-11-20')!;
    expect([a.years, a.months, a.days]).toEqual([36, 6, 0]);
    expect(a.nextBirthday).toBe('2027-05-20');
    expect(a.daysToNextBirthday).toBe(181);
    expect(E.calculateAge('2030-01-01', '2026-01-01')).toBeNull();
  });
  it('hebrew date resolves through Intl', () => {
    const h = E.hebrewDate('2026-09-12');
    expect(h).toBeTruthy();
    expect(h).toBe('1 בתשרי 5787'); // ראש השנה תשפ"ז
  });
});

describe('health estimates', () => {
  it('BMI by WHO categories', () => {
    expect(E.calculateBmi(180, 81)).toMatchObject({ bmi: 25, category: 'overweight' });
    expect(E.calculateBmi(170, 60)!.category).toBe('normal');
    expect(E.calculateBmi(170, 50)!.category).toBe('underweight');
    expect(E.calculateBmi(170, 95)!.category).toBe('obese');
    expect(E.calculateBmi(10, 60)).toBeNull();
  });
  it('Mifflin–St Jeor', () => {
    // גבר 30, 180 ס"מ, 80 ק"ג: 10×80 + 6.25×180 − 5×30 + 5 = 1780
    const r = E.calculateCalories('male', 30, 180, 80, 'moderate')!;
    expect(r.bmr).toBe(1780);
    expect(r.tdee).toBe(Math.round(1780 * 1.55));
    // אישה 30, 165 ס"מ, 60 ק"ג: 600 + 1031.25 − 150 − 161 = 1320.25
    expect(E.calculateCalories('female', 30, 165, 60, 'sedentary')!.bmr).toBe(1320);
  });
  it('macros', () => {
    expect(E.macroSplit(2000, 'balanced')).toEqual({ proteinG: 125, carbsG: 250, fatG: 56 });
  });
  it('ideal weight', () => {
    // גבר 180 ס"מ = 70.87 אינץ' → 10.87 מעל 60: Devine 50 + 2.3×10.87 = 75.0
    const r = E.idealWeight('male', 180)!;
    expect(r.devine).toBe(75);
    expect(r.robinson).toBe(72.6);
  });
  it('US Navy body fat', () => {
    const m = E.bodyFatNavy('male', 180, 38, 90)!;
    expect(m).toBeGreaterThan(15);
    expect(m).toBeLessThan(25);
    expect(E.bodyFatNavy('female', 165, 32, 75, 98)!).toBeGreaterThan(20);
    expect(E.bodyFatNavy('male', 180, 38, 30)).toBeNull();
    expect(E.bodyFatNavy('female', 165, 32, 75)).toBeNull();
  });
  it('heart rate zones (Tanaka + Karvonen)', () => {
    const r = E.heartRateZones(40, 60)!;
    expect(r.max).toBe(180);
    expect(r.zones[0]).toEqual({ from: 120, to: 132 });
    expect(r.zones[4].to).toBe(180);
    expect(E.heartRateZones(40, 200)).toBeNull();
  });
  it('sleep cycles', () => {
    const wake = E.sleepTimes('07:00', 'wake')!;
    // 6 מחזורים = 9 שעות + 15 דקות: ללכת לישון ב-21:45
    expect(wake[0]).toEqual({ cycles: 6, sleepHours: 9, time: '21:45' });
    const bed = E.sleepTimes('23:00', 'bed')!;
    expect(bed[3]).toEqual({ cycles: 3, sleepHours: 4.5, time: '03:45' });
    expect(E.sleepTimes('25:00', 'bed')).toBeNull();
  });
  it('pregnancy: Naegele (+280 days) and ovulation (cycle − 14)', () => {
    const p = E.pregnancy('2026-01-01', '2026-03-12')!;
    expect(p.dueDate).toBe('2026-10-08');
    expect(p.weeks).toBe(10);
    expect(p.days).toBe(0);
    expect(p.trimester).toBe(1);
    const o = E.ovulation('2026-11-01', 28)!;
    expect(o.ovulationDay).toBe('2026-11-15');
    expect(o.fertileStart).toBe('2026-11-10');
    expect(o.nextPeriod).toBe('2026-11-29');
    expect(E.ovulation('2026-11-01', 10)).toBeNull();
  });
});
