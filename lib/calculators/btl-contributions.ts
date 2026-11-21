/**
 * דמי ביטוח לאומי ודמי ביטוח בריאות לשכיר ולעצמאי — פונקציות טהורות.
 * שיעורים ותקרות מ-`SOCIAL_SECURITY_*_2026` ב-tax-2026.ts. אין כאן שיעורי "לא עובד" או הכנסות מיוחדות.
 */

import { SOCIAL_SECURITY_EMPLOYEE_2026, SOCIAL_SECURITY_SELF_EMPLOYED_2026 } from '@/lib/constants/tax-2026';

const round2 = (n: number) => Math.round(n * 100) / 100;

export type BtlStatus = 'employee' | 'self-employed';

export interface BtlResult {
  /** הכנסה חייבת (עד התקרה) */
  insuredIncome: number;
  atReducedRate: number;
  atFullRate: number;
  nationalInsurance: number;
  healthInsurance: number;
  total: number;
  effectiveRatePct: number;
  /** רק לשכיר: חלק המעסיק */
  employer: number;
}

export function calculateBtlContributions(monthlyIncome: number, status: BtlStatus): BtlResult | null {
  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) return null;
  const c = status === 'employee' ? SOCIAL_SECURITY_EMPLOYEE_2026 : SOCIAL_SECURITY_SELF_EMPLOYED_2026;
  const insured = Math.min(monthlyIncome, c.maxThresholdMonthly);
  const atReduced = Math.min(insured, c.reducedThresholdMonthly);
  const atFull = Math.max(0, insured - c.reducedThresholdMonthly);
  const ni = atReduced * c.reducedRate.nationalInsurance + atFull * c.fullRate.nationalInsurance;
  const health = atReduced * c.reducedRate.healthInsurance + atFull * c.fullRate.healthInsurance;
  const total = ni + health;
  const employer =
    status === 'employee'
      ? atReduced * SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.reducedRate +
        atFull * SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.fullRate
      : 0;
  return {
    insuredIncome: round2(insured),
    atReducedRate: round2(atReduced),
    atFullRate: round2(atFull),
    nationalInsurance: round2(ni),
    healthInsurance: round2(health),
    total: round2(total),
    effectiveRatePct: monthlyIncome > 0 ? round2((total / insured) * 100) : 0,
    employer: round2(employer),
  };
}
