import { describe, expect, it } from 'vitest';
import {
  getCourseRouting,
  hasExistingCoursePromotion,
  normalizeCoursePath,
} from '@/lib/data/course-routing';

describe('course routing', () => {
  it('applies explicit business overrides before the self-employed prefix', () => {
    expect(getCourseRouting('/self-employed/business-finance')).toEqual({
      courseId: 'cfo',
      placement: 'self-employed',
    });
    expect(getCourseRouting('/self-employed/tax-advances')).toEqual({
      courseId: 'cpa',
      placement: 'self-employed',
    });
  });

  it('routes the exact section roots without matching lookalike prefixes', () => {
    expect(getCourseRouting('/self-employed')?.courseId).toBe('cpa');
    expect(getCourseRouting('/business')?.courseId).toBe('cfo');
    expect(getCourseRouting('/tools')?.courseId).toBe('cfo');
    expect(getCourseRouting('/self-employedness')).toBeNull();
    expect(getCourseRouting('/businesses')).toBeNull();
    expect(getCourseRouting('/toolbox')).toBeNull();
  });

  it('routes business tools to CFO and the VAT exception to CPA', () => {
    expect(getCourseRouting('/tools/cash-flow')).toEqual({
      courseId: 'cfo',
      placement: 'tool',
    });
    expect(getCourseRouting('/tools/vat-extract')).toEqual({
      courseId: 'cpa',
      placement: 'tool',
    });
  });

  it('routes only explicitly relevant blog, guide, and comparison content', () => {
    expect(getCourseRouting('/blog/cash-flow-forecast-business')?.courseId).toBe('cfo');
    expect(getCourseRouting('/blog/year-end-tax-planning-self-employed')?.courseId).toBe('cpa');
    expect(getCourseRouting('/guides/taxes-complete-guide-2026')?.courseId).toBe('cpa');
    expect(getCourseRouting('/compare/employee-vs-self-employed')?.courseId).toBe('cpa');
    expect(getCourseRouting('/compare/osek-patur-vs-murshe')?.courseId).toBe('cpa');
    expect(getCourseRouting('/compare/esek-zeir-vs-osek-patur')?.courseId).toBe('cpa');
    expect(getCourseRouting('/compare/company-vs-osek-murshe')?.courseId).toBe('cfo');
    expect(getCourseRouting('/blog/company-vs-self-employed-ultimate-guide')?.courseId).toBe(
      'cfo',
    );
  });

  it('does not pitch a course on unrelated employee, salary, housing, or investment content', () => {
    expect(getCourseRouting('/blog/salary-net-2026-complete-guide')).toBeNull();
    expect(getCourseRouting('/guides/employee-rights-complete-guide')).toBeNull();
    expect(getCourseRouting('/compare/rent-vs-buy')).toBeNull();
    expect(getCourseRouting('/investments/compound-interest')).toBeNull();
  });

  it('normalizes full URLs, query strings, hashes, and trailing slashes', () => {
    expect(
      normalizeCoursePath(
        'https://cheshbonai.co.il/blog/business-budget-planning-2026/?utm_source=test#cta',
      ),
    ).toBe('/blog/business-budget-planning-2026');
    expect(getCourseRouting('/tools/vat-extract/?source=footer#course')?.courseId).toBe('cpa');
  });

  it('identifies routes that already contain a course promotion', () => {
    expect(hasExistingCoursePromotion('/self-employed/net')).toBe(true);
    expect(hasExistingCoursePromotion('/business/restaurant')).toBe(true);
    expect(hasExistingCoursePromotion('/tools/break-even')).toBe(true);
    expect(hasExistingCoursePromotion('/tools/break-even/?source=test')).toBe(true);
    expect(hasExistingCoursePromotion('/tools/cash-flow')).toBe(false);
    expect(hasExistingCoursePromotion('/blog/cash-flow-forecast-business')).toBe(false);
  });
});
