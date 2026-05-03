import { describe, it, expect } from 'vitest';
import {
  calculateLoanEligibility,
  type LoanEligibilityInput,
} from '@/lib/calculators/loan-eligibility';

const baseInput: LoanEligibilityInput = {
  businessAge: 'over3',
  annualRevenue: '625to25m',
  legalStatus: 'company',
  hasLegalProceedings: false,
  hasTaxDebt: false,
  hasAccountLimitations: false,
  loanPurpose: 'workingCapital',
  isInNorth: false,
  isExporter: false,
  isIndustry: false,
  reserveService: false,
};

describe('calculateLoanEligibility - תנאי סף', () => {
  it('הליכים משפטיים → לא זכאי', () => {
    const result = calculateLoanEligibility({ ...baseInput, hasLegalProceedings: true });
    expect(result.eligible).toBe(false);
    expect(result.disqualifiers).toContain('הליכים משפטיים תלויים ועומדים נגד העסק');
  });

  it('חובות מס → לא זכאי', () => {
    const result = calculateLoanEligibility({ ...baseInput, hasTaxDebt: true });
    expect(result.eligible).toBe(false);
  });

  it('הגבלות חשבון → לא זכאי', () => {
    const result = calculateLoanEligibility({ ...baseInput, hasAccountLimitations: true });
    expect(result.eligible).toBe(false);
  });

  it('מחזור מעל 100M → לא זכאי', () => {
    const result = calculateLoanEligibility({ ...baseInput, annualRevenue: 'over100m' });
    expect(result.eligible).toBe(false);
    expect(result.disqualifiers.some((d) => d.includes('100 מיליון'))).toBe(true);
  });

  it('מספר בעיות סף - מציג את כולן', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      hasTaxDebt: true,
      hasLegalProceedings: true,
    });
    expect(result.disqualifiers).toHaveLength(2);
  });
});

describe('calculateLoanEligibility - עסק בהקמה', () => {
  it('עסק בהקמה - 500K ב-5% ביטחונות', () => {
    const result = calculateLoanEligibility({ ...baseInput, businessAge: 'new' });
    expect(result.eligible).toBe(true);
    expect(result.maxLoanAmount).toBe(500_000);
    expect(result.securityRequiredPct).toBe(5);
    expect(result.route).toBe('עסק בהקמה');
  });

  it('עסק בהקמה + צפון', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      businessAge: 'new',
      isInNorth: true,
    });
    expect(result.route).toContain('חרבות ברזל');
  });
});

describe('calculateLoanEligibility - עסק קטן (מחזור < 6.25M)', () => {
  it('זכאי ל-500K ב-15% ביטחונות', () => {
    const result = calculateLoanEligibility({ ...baseInput, annualRevenue: 'under625' });
    expect(result.eligible).toBe(true);
    expect(result.maxLoanAmount).toBe(500_000);
    expect(result.securityRequiredPct).toBe(15);
  });

  it('עסק קטן + מילואים → 5% ביטחונות', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      annualRevenue: 'under625',
      reserveService: true,
    });
    expect(result.securityRequiredPct).toBe(5);
  });
});

describe('calculateLoanEligibility - עסק בינוני', () => {
  it('מחזור 25M → 8% מהמחזור = 2M', () => {
    const result = calculateLoanEligibility({ ...baseInput, annualRevenue: '625to25m' });
    expect(result.maxLoanAmount).toBe(2_000_000); // 25M * 8%
  });

  it('מחזור 100M → 8% = 8M (מתקרה)', () => {
    const result = calculateLoanEligibility({ ...baseInput, annualRevenue: '25to100m' });
    expect(result.maxLoanAmount).toBe(8_000_000);
  });

  it('יצואן - 12% מהמחזור', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      annualRevenue: '625to25m',
      isExporter: true,
    });
    // 25M * 12% = 3M (יותר מ-2M הבסיסי)
    expect(result.maxLoanAmount).toBe(3_000_000);
    expect(result.route).toContain('יצואן');
  });

  it('תעשייה - 15% + 12 שנים', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      annualRevenue: '25to100m',
      isIndustry: true,
    });
    // 100M * 15% = 15M (מתקרה)
    expect(result.maxLoanAmount).toBe(15_000_000);
    expect(result.route).toContain('תעשייה');
    expect(result.termsLabel).toContain('12 שנים');
  });

  it('יצואן + תעשייה - בוחר הגבוה (תעשייה)', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      annualRevenue: '25to100m',
      isExporter: true,
      isIndustry: true,
    });
    // יצואן: 100M*12%=12M, תעשייה: 100M*15%=15M
    expect(result.maxLoanAmount).toBe(15_000_000);
    expect(result.route).toContain('תעשייה');
    expect(result.applicableRoutes).toContain('יצואן');
    expect(result.applicableRoutes).toContain('תעשייה');
  });
});

describe('calculateLoanEligibility - חרבות ברזל', () => {
  it('עסק בצפון - הקלת ביטחונות מ-15% ל-5%', () => {
    const noNorth = calculateLoanEligibility({ ...baseInput, annualRevenue: '625to25m' });
    const inNorth = calculateLoanEligibility({
      ...baseInput,
      annualRevenue: '625to25m',
      isInNorth: true,
    });
    expect(noNorth.securityRequiredPct).toBe(15);
    expect(inNorth.securityRequiredPct).toBe(5);
  });

  it('חרבות ברזל מופיע במסלולים החלים', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      annualRevenue: '625to25m',
      reserveService: true,
    });
    expect(result.applicableRoutes.some((r) => r.includes('חרבות ברזל'))).toBe(true);
  });
});

describe('calculateLoanEligibility - חישובי ביטחונות', () => {
  it('סכום ביטחונות = הלוואה × אחוז', () => {
    const result = calculateLoanEligibility({
      ...baseInput,
      annualRevenue: '25to100m',
      isIndustry: true,
    });
    // 15M * 5% (אם יש חרבות ברזל) או 15M * 15%
    expect(result.securityRequiredAmount).toBe(
      result.maxLoanAmount * (result.securityRequiredPct / 100),
    );
  });
});
