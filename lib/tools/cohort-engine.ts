/**
 * Cohort Analysis + LTV/CAC Engine
 *
 * ניתוח קוהורט (cohort): קיבוץ לקוחות לפי חודש רכישה ובחינת התנהגותם לאורך זמן.
 * המודל השכיח ב-SaaS, e-commerce, שירותים מבוססי-מנוי.
 *
 * מדדים מרכזיים:
 * - LTV (Lifetime Value): סך הכנסות צפוי מלקוח לאורך חייו
 * - CAC (Customer Acquisition Cost): עלות רכישת לקוח
 * - LTV/CAC ratio: יעד 3+ ב-SaaS
 * - Payback Period: תוך כמה חודשים מחזירים את ה-CAC
 * - NRR (Net Revenue Retention): שימור הכנסות (אידיאלי 100%+)
 */

import type { CustomerCohort, CohortAnalysisResult } from './types';

/**
 * חשב LTV של קוהורט בודד.
 * LTV = ARPU / monthlyChurn (גיאומטרית).
 * אם churn = 0%, LTV אינסופי - מחזירים אופק 60 חודשים.
 */
export function calculateCohortLTV(cohort: CustomerCohort, horizonMonths: number = 60): number {
  if (cohort.monthlyChurnPct <= 0) {
    return cohort.arpu * horizonMonths;
  }
  // נוסחה: LTV = ARPU * (1 - churn) / churn (סדרה גיאומטרית)
  const churn = cohort.monthlyChurnPct / 100;
  return cohort.arpu / churn;
}

/**
 * חשב Payback Period (חודשים) - תוך כמה זמן מחזירים את ה-CAC.
 * הנחה: ARPU דטרמיניסטי, churn מוסיף נטילה.
 */
export function calculatePaybackPeriod(cohort: CustomerCohort): number {
  if (cohort.arpu <= 0) return Infinity;
  const churn = cohort.monthlyChurnPct / 100;
  let cumulativeRevenue = 0;
  let retention = 1;
  for (let m = 1; m <= 120; m++) {
    cumulativeRevenue += cohort.arpu * retention;
    retention *= 1 - churn;
    if (cumulativeRevenue >= cohort.cac) {
      return m;
    }
  }
  return Infinity;
}

/**
 * בנה מטריצת קוהורט: שורה = קוהורט, עמודה = חודש מאז רכישה
 * ערך = הכנסות בחודש זה.
 */
export function buildCohortMatrix(
  cohorts: CustomerCohort[],
  horizonMonths: number = 24,
): number[][] {
  const matrix: number[][] = [];

  for (const cohort of cohorts) {
    const row: number[] = [];
    let retainedCustomers = cohort.newCustomers;
    const churnRate = cohort.monthlyChurnPct / 100;

    for (let m = 0; m < horizonMonths; m++) {
      const monthRevenue = retainedCustomers * cohort.arpu;
      row.push(monthRevenue);
      retainedCustomers *= 1 - churnRate;
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * מחשב Net Revenue Retention (NRR).
 * NRR = Revenue from existing cohort 12 months later / Initial revenue × 100
 * אידיאלי: > 100% (לקוחות מרחיבים את ההוצאה דרך upsell)
 * מצוין ב-SaaS: 110-120%+
 *
 * ההנחה הפשוטה: רק churn (אין upsell), אז NRR = (1 - churn)^12.
 */
export function calculateNRR(cohort: CustomerCohort): number {
  const churn = cohort.monthlyChurnPct / 100;
  return Math.pow(1 - churn, 12) * 100;
}

/**
 * אנליזה כוללת.
 */
export function analyzeCohorts(
  cohorts: CustomerCohort[],
  horizonMonths: number = 24,
): CohortAnalysisResult {
  if (cohorts.length === 0) {
    return {
      cohorts: [],
      cohortMatrix: [],
      totals: {
        avgLtv: 0,
        avgCac: 0,
        ltvToCacRatio: 0,
        paybackMonths: 0,
        netRevenueRetention: 0,
      },
    };
  }

  const matrix = buildCohortMatrix(cohorts, horizonMonths);

  // ממוצעים משוקללים לפי גודל הקוהורט
  const totalCustomers = cohorts.reduce((s, c) => s + c.newCustomers, 0);

  let weightedLtv = 0;
  let weightedCac = 0;
  let weightedPayback = 0;
  let weightedNrr = 0;

  for (const c of cohorts) {
    const ltv = calculateCohortLTV(c, 60);
    const payback = calculatePaybackPeriod(c);
    const nrr = calculateNRR(c);
    const weight = c.newCustomers / (totalCustomers || 1);

    weightedLtv += ltv * weight;
    weightedCac += c.cac * weight;
    weightedPayback += (Number.isFinite(payback) ? payback : 60) * weight;
    weightedNrr += nrr * weight;
  }

  const avgLtv = weightedLtv;
  const avgCac = weightedCac;
  const ltvToCacRatio = avgCac > 0 ? avgLtv / avgCac : 0;
  const paybackMonths = weightedPayback;
  const netRevenueRetention = weightedNrr;

  return {
    cohorts,
    cohortMatrix: matrix,
    totals: {
      avgLtv,
      avgCac,
      ltvToCacRatio,
      paybackMonths,
      netRevenueRetention,
    },
  };
}

/**
 * דירוג בריאות LTV/CAC.
 */
export function rateLtvCac(ratio: number): {
  rating: 'excellent' | 'good' | 'acceptable' | 'poor' | 'unsustainable';
  message: string;
  color: string;
} {
  if (ratio >= 5) {
    return {
      rating: 'excellent',
      message: 'מצוין — שקול להגדיל השקעה ברכישת לקוחות',
      color: '#10b981',
    };
  }
  if (ratio >= 3) {
    return {
      rating: 'good',
      message: 'טוב — בנצ\'מרק SaaS מקובל',
      color: '#22c55e',
    };
  }
  if (ratio >= 1.5) {
    return {
      rating: 'acceptable',
      message: 'בסדר אבל יש מקום לשיפור — בדוק churn או ARPU',
      color: '#f59e0b',
    };
  }
  if (ratio >= 1) {
    return {
      rating: 'poor',
      message: 'לא מספיק — עלות רכישה גבוהה מדי',
      color: '#f97316',
    };
  }
  return {
    rating: 'unsustainable',
    message: 'לא בר-קיימא — הפסד על כל לקוח',
    color: '#ef4444',
  };
}

/**
 * דירוג Payback Period.
 */
export function ratePayback(months: number): {
  rating: 'excellent' | 'good' | 'acceptable' | 'poor';
  message: string;
} {
  if (months <= 6) return { rating: 'excellent', message: 'החזר מהיר — דגם מצוין' };
  if (months <= 12) return { rating: 'good', message: 'החזר סביר ל-SaaS' };
  if (months <= 18) return { rating: 'acceptable', message: 'מקובל אבל גוזל cash' };
  return { rating: 'poor', message: 'ארוך מדי — סיכון cash flow' };
}
