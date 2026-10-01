export type CourseId = 'cpa' | 'cfo';

export type CoursePlacement =
  | 'blog'
  | 'business'
  | 'calculator'
  | 'comparison'
  | 'guide'
  | 'self-employed'
  | 'tool';

export interface CourseRoutingMatch {
  courseId: CourseId;
  placement: CoursePlacement;
}

export const COURSE_DESTINATIONS: Record<CourseId, string> = {
  cpa: '/course/self-employed',
  cfo: '/course/business',
};

type ExactRule = CourseRoutingMatch & {
  paths: readonly string[];
};

type PrefixRule = CourseRoutingMatch & {
  prefix: string;
};

/**
 * Explicit topic rules are evaluated before broad section rules. This is
 * important for business-management pages that live below /self-employed.
 */
const EXACT_RULES: readonly ExactRule[] = [
  {
    courseId: 'cfo',
    placement: 'self-employed',
    paths: [
      '/self-employed/business-finance',
      '/self-employed/corporation-vs-individual',
      '/self-employed/dividend-vs-salary',
      '/self-employed/employer-cost',
    ],
  },
  {
    courseId: 'cpa',
    placement: 'tool',
    paths: ['/tools/vat-extract'],
  },
  {
    courseId: 'cfo',
    placement: 'comparison',
    paths: ['/compare/company-vs-osek-murshe'],
  },
  {
    courseId: 'cpa',
    placement: 'comparison',
    paths: ['/compare/employee-vs-self-employed', '/compare/osek-patur-vs-murshe'],
  },
  {
    courseId: 'cpa',
    placement: 'guide',
    paths: ['/guides/taxes-complete-guide-2026'],
  },
  {
    courseId: 'cfo',
    placement: 'blog',
    paths: [
      '/blog/business-budget-planning-2026',
      '/blog/business-valuation-methods',
      '/blog/cash-flow-forecast-business',
      '/blog/company-vs-self-employed-ultimate-guide',
    ],
  },
  {
    courseId: 'cpa',
    placement: 'blog',
    paths: [
      '/blog/annual-tax-report-1301',
      '/blog/bituach-leumi-self-employed-deep-dive',
      '/blog/net-self-employed-explained',
      '/blog/pension-deduction-self-employed-2026',
      '/blog/pension-self-employed-11-percent',
      '/blog/study-fund-self-employed-strategy',
      '/blog/tax-advances-self-employed-survival',
      '/blog/vat-complete-guide-israel',
      '/blog/year-end-tax-planning-self-employed',
    ],
  },
];

const PREFIX_RULES: readonly PrefixRule[] = [
  { courseId: 'cpa', placement: 'self-employed', prefix: '/self-employed' },
  { courseId: 'cfo', placement: 'business', prefix: '/business' },
  { courseId: 'cfo', placement: 'tool', prefix: '/tools' },
];

/**
 * Routes already rendering a CourseCTA, CalculatorLayout CTA, or a dedicated
 * course pitch. Shared layouts use this list to avoid a second promotion.
 */
const EXISTING_PROMOTION_EXACT_PATHS = new Set([
  '/compare/employee-vs-self-employed',
  '/tools/break-even',
  '/tools/business-valuation',
  '/tools/customer-lifetime-value',
  '/tools/loan-eligibility',
  '/tools/vat-extract',
]);

const EXISTING_PROMOTION_PREFIXES = ['/business/', '/self-employed/'] as const;

export function normalizeCoursePath(path: string): string {
  const withoutOrigin = path.replace(/^https?:\/\/[^/]+/i, '');
  const pathname = withoutOrigin.split(/[?#]/, 1)[0] || '/';
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return withLeadingSlash.length > 1
    ? withLeadingSlash.replace(/\/+$/, '')
    : withLeadingSlash;
}

function matchesPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function getCourseRouting(path: string | null | undefined): CourseRoutingMatch | null {
  if (!path) return null;

  const normalizedPath = normalizeCoursePath(path);

  for (const rule of EXACT_RULES) {
    if (rule.paths.includes(normalizedPath)) {
      return { courseId: rule.courseId, placement: rule.placement };
    }
  }

  for (const rule of PREFIX_RULES) {
    if (matchesPrefix(normalizedPath, rule.prefix)) {
      return { courseId: rule.courseId, placement: rule.placement };
    }
  }

  return null;
}

export function hasExistingCoursePromotion(path: string | null | undefined): boolean {
  if (!path) return false;

  const normalizedPath = normalizeCoursePath(path);

  return (
    EXISTING_PROMOTION_EXACT_PATHS.has(normalizedPath) ||
    EXISTING_PROMOTION_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  );
}
