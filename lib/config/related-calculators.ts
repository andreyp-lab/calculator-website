/**
 * related-calculators.ts — מפת מחשבונים קשורים לחיזוק קישוריות פנימית (internal PageRank).
 *
 * getRelated(path) מחזיר עד 4 מחשבונים קשורים:
 *   1. אם יש רשימה ידנית (CURATED) לנתיב — משתמש בה.
 *   2. אחרת — מחזיר "אחים" מאותה קבוצה.
 */

export interface CalcLink {
  path: string;
  label: string;
  group: string;
}

/** רשימת כל המחשבונים העיקריים, מקובצים לפי תחום. */
export const CALCULATORS: CalcLink[] = [
  // מסים אישיים / שכירים
  { path: '/personal-tax/salary-net-gross', label: 'שכר נטו / ברוטו', group: 'tax' },
  { path: '/personal-tax/income-tax', label: 'מס הכנסה', group: 'tax' },
  { path: '/personal-tax/tax-refund', label: 'החזר מס', group: 'tax' },
  { path: '/personal-tax/tax-credits', label: 'נקודות זיכוי', group: 'tax' },
  { path: '/personal-tax/work-value', label: 'כמה שווה לעבוד', group: 'tax' },
  // זכויות עובדים
  { path: '/employee-rights/severance', label: 'פיצויי פיטורין', group: 'employee' },
  { path: '/employee-rights/maternity-benefits', label: 'דמי לידה', group: 'employee' },
  { path: '/employee-rights/unemployment-benefits', label: 'דמי אבטלה', group: 'employee' },
  { path: '/employee-rights/reserve-duty-pay', label: 'תגמול מילואים', group: 'employee' },
  { path: '/employee-rights/minimum-wage', label: 'שכר מינימום', group: 'employee' },
  { path: '/employee-rights/recreation-pay', label: 'דמי הבראה', group: 'employee' },
  { path: '/employee-rights/annual-leave', label: 'חופשה שנתית', group: 'employee' },
  { path: '/employee-rights/annual-bonus', label: 'בונוס שנתי', group: 'employee' },
  { path: '/employee-rights/sick-pay', label: 'דמי מחלה', group: 'employee' },
  { path: '/employee-rights/work-grant', label: 'מענק עבודה', group: 'employee' },
  // עצמאיים
  { path: '/self-employed/net', label: 'נטו לעצמאי', group: 'self-employed' },
  { path: '/self-employed/social-security', label: 'ביטוח לאומי עצמאי', group: 'self-employed' },
  { path: '/self-employed/vat', label: 'מע"מ', group: 'self-employed' },
  { path: '/self-employed/tax-advances', label: 'מקדמות מס', group: 'self-employed' },
  { path: '/self-employed/hourly-rate', label: 'תעריף שעתי', group: 'self-employed' },
  { path: '/self-employed/employer-cost', label: 'עלות מעסיק', group: 'self-employed' },
  { path: '/self-employed/mandatory-pension', label: 'פנסיה חובה לעצמאי', group: 'self-employed' },
  { path: '/self-employed/corporation-vs-individual', label: 'חברה מול עוסק', group: 'self-employed' },
  { path: '/self-employed/dividend-vs-salary', label: 'דיבידנד מול שכר', group: 'self-employed' },
  { path: '/self-employed/year-end-tax-simulator', label: 'סימולטור מס סוף שנה', group: 'self-employed' },
  // נדל"ן ומשכנתאות
  { path: '/real-estate/mortgage', label: 'מחשבון משכנתא', group: 'real-estate' },
  { path: '/real-estate/mortgage-optimizer', label: 'אופטימייזר תמהיל', group: 'real-estate' },
  { path: '/real-estate/purchase-tax', label: 'מס רכישה', group: 'real-estate' },
  { path: '/real-estate/capital-gains-tax', label: 'מס שבח', group: 'real-estate' },
  // השקעות וחיסכון
  { path: '/investments/compound-interest', label: 'ריבית דריבית', group: 'investments' },
  { path: '/investments/retirement', label: 'תכנון פרישה', group: 'investments' },
  { path: '/investments/fire', label: 'FIRE – עצמאות כלכלית', group: 'investments' },
  { path: '/investments/roi', label: 'תשואה על השקעה (ROI)', group: 'investments' },
  { path: '/insurance/pension', label: 'מחשבון פנסיה', group: 'investments' },
  // הלוואות וחיסכון
  { path: '/savings/family-budget', label: 'תקציב משפחתי', group: 'loans' },
  { path: '/savings/loan-repayment', label: 'החזרי הלוואה', group: 'loans' },
  { path: '/savings/personal-loan', label: 'הלוואה אישית', group: 'loans' },
  // רכב
  { path: '/vehicles/leasing-vs-buying', label: 'ליסינג מול קנייה', group: 'vehicles' },
  { path: '/vehicles/fuel-cost', label: 'עלות דלק', group: 'vehicles' },
  { path: '/vehicles/company-car-benefit', label: 'שווי שימוש ברכב', group: 'vehicles' },
];

/** קשרים ידניים חוצי-קבוצה ברמת רלוונטיות גבוהה. */
const CURATED: Record<string, string[]> = {
  '/personal-tax/salary-net-gross': ['/personal-tax/income-tax', '/personal-tax/tax-refund', '/personal-tax/tax-credits', '/employee-rights/severance'],
  '/personal-tax/income-tax': ['/personal-tax/salary-net-gross', '/personal-tax/tax-credits', '/personal-tax/tax-refund', '/self-employed/net'],
  '/self-employed/net': ['/self-employed/social-security', '/self-employed/vat', '/self-employed/tax-advances', '/self-employed/corporation-vs-individual'],
  '/real-estate/mortgage': ['/real-estate/mortgage-optimizer', '/real-estate/purchase-tax', '/savings/loan-repayment', '/real-estate/capital-gains-tax'],
  '/real-estate/purchase-tax': ['/real-estate/mortgage', '/real-estate/capital-gains-tax', '/real-estate/mortgage-optimizer'],
  '/employee-rights/severance': ['/employee-rights/recreation-pay', '/employee-rights/annual-leave', '/personal-tax/salary-net-gross', '/insurance/pension'],
  '/vehicles/leasing-vs-buying': ['/vehicles/fuel-cost', '/vehicles/company-car-benefit', '/self-employed/employer-cost'],
  '/investments/compound-interest': ['/investments/retirement', '/investments/fire', '/insurance/pension', '/investments/roi'],
};

const BY_PATH = new Map(CALCULATORS.map((c) => [c.path, c]));

/** מחזיר עד `limit` מחשבונים קשורים לנתיב הנוכחי. */
export function getRelatedCalculators(path: string | undefined, limit = 4): CalcLink[] {
  if (!path) return [];
  const clean = path.replace(/\/$/, '');

  // 1. רשימה ידנית
  const curated = CURATED[clean];
  if (curated) {
    return curated.map((p) => BY_PATH.get(p)).filter((c): c is CalcLink => !!c).slice(0, limit);
  }

  // 2. אחים מאותה קבוצה
  const current = BY_PATH.get(clean);
  if (!current) return [];
  return CALCULATORS.filter((c) => c.group === current.group && c.path !== clean).slice(0, limit);
}
