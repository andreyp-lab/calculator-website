/**
 * מחשבון שווי שימוש ברכב חברה - 2026
 *
 * כשהמעסיק נותן רכב חברה, יש "שווי שימוש" שמחויב במס.
 * החישוב: שווי הרכב × אחוז × 12.
 *
 * אחוזי שווי שימוש 2026 (לפי קבוצת רכב):
 * - קבוצה 1: 2.04% מהמחיר הקטלוגי
 * - קבוצה 2: 2.39%
 * - קבוצה 3: 2.74%
 * - קבוצה 4: 3.06%
 * - קבוצה 5: 3.27%
 * - קבוצה 6: 3.46%
 * - קבוצה 7: 3.65%
 *
 * רכבים חשמליים: זיכוי של עד 1,150 ₪/חודש (ב-2026)
 *
 * מקור: רשות המסים, חוזר מס הכנסה
 */

export type CarGroup = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface CompanyCarInput {
  /** מחיר קטלוגי של הרכב (₪) */
  catalogPrice: number;
  /** קבוצת רכב (1-7) */
  carGroup: CarGroup;
  /** האם רכב חשמלי */
  isElectric: boolean;
  /** מס שולי של העובד (%) - לחישוב מס נטו */
  marginalTaxRate: number;
}

export interface CompanyCarResult {
  /** אחוז שווי שימוש */
  benefitPercentage: number;
  /** שווי שימוש חודשי לפני זיכוי */
  monthlyBenefit: number;
  /** זיכוי לרכב חשמלי */
  electricDiscount: number;
  /** שווי שימוש נטו (אחרי זיכוי) */
  taxableBenefit: number;
  /** מס חודשי שיוצא לעובד מהשכר */
  monthlyTax: number;
  /** עלות שנתית לעובד */
  annualCost: number;
  /** המלצה */
  recommendation: string;
}

const GROUP_PERCENTAGES: Record<CarGroup, number> = {
  1: 0.0204,
  2: 0.0239,
  3: 0.0274,
  4: 0.0306,
  5: 0.0327,
  6: 0.0346,
  7: 0.0365,
};

const ELECTRIC_MONTHLY_DISCOUNT_2026 = 1_150;

export function calculateCompanyCarBenefit(input: CompanyCarInput): CompanyCarResult {
  const catalogPrice = Math.max(0, input.catalogPrice);
  const benefitPercentage = GROUP_PERCENTAGES[input.carGroup] || GROUP_PERCENTAGES[3];

  const monthlyBenefit = catalogPrice * benefitPercentage;
  const electricDiscount = input.isElectric ? ELECTRIC_MONTHLY_DISCOUNT_2026 : 0;
  const taxableBenefit = Math.max(0, monthlyBenefit - electricDiscount);

  const marginalRate = Math.max(0, Math.min(50, input.marginalTaxRate)) / 100;
  const monthlyTax = taxableBenefit * marginalRate;
  const annualCost = monthlyTax * 12;

  let recommendation = '';
  if (catalogPrice > 250_000) {
    recommendation = 'רכב יקר → שווי שימוש משמעותי. שקול רכב זול יותר או רכב פרטי + החזר.';
  } else if (input.isElectric) {
    recommendation = 'רכב חשמלי - מקבל זיכוי 1,150 ₪/חודש. משתלם!';
  } else if (catalogPrice < 100_000) {
    recommendation = 'רכב זול - שווי שימוש נמוך. עסקה משתלמת.';
  } else {
    recommendation = 'בדוק האם החזר רכב פרטי משתלם יותר עבורך.';
  }

  return {
    benefitPercentage,
    monthlyBenefit,
    electricDiscount,
    taxableBenefit,
    monthlyTax,
    annualCost,
    recommendation,
  };
}
