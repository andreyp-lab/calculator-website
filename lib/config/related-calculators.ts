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
  { path: '/salaried/salary-negotiation-total-compensation', label: 'השוואת הצעות שכר', group: 'tax' },
  { path: '/personal-tax/salary-net-gross', label: 'שכר נטו / ברוטו', group: 'tax' },
  { path: '/personal-tax/income-tax', label: 'מס הכנסה', group: 'tax' },
  { path: '/personal-tax/tax-refund', label: 'החזר מס', group: 'tax' },
  { path: '/personal-tax/tax-return-full', label: 'תחשיב מס מורחב', group: 'tax' },
  { path: '/personal-tax/tax-credits', label: 'נקודות זיכוי', group: 'tax' },
  { path: '/personal-tax/work-value', label: 'כמה שווה לעבוד', group: 'tax' },
  // זכויות עובדים
  { path: '/employee-rights/severance', label: 'פיצויי פיטורין', group: 'employee' },
  { path: '/employee-rights/maternity-benefits', label: 'דמי לידה', group: 'employee' },
  { path: '/employee-rights/notice-period', label: 'הודעה מוקדמת', group: 'employee' },
  { path: '/employee-rights/holiday-pay', label: 'דמי חגים', group: 'employee' },
  { path: '/employee-rights/seniority', label: 'ותק תעסוקתי', group: 'employee' },
  { path: '/employee-rights/work-hours', label: 'שעות עבודה', group: 'employee' },
  { path: '/employee-rights/child-allowance', label: 'קצבת ילדים ומענק לידה', group: 'employee' },
  { path: '/employee-rights/unemployment-benefits', label: 'דמי אבטלה', group: 'employee' },
  { path: '/employee-rights/reserve-duty-pay', label: 'תגמול מילואים', group: 'employee' },
  { path: '/employee-rights/minimum-wage', label: 'שכר מינימום', group: 'employee' },
  { path: '/employee-rights/recreation-pay', label: 'דמי הבראה', group: 'employee' },
  { path: '/employee-rights/annual-leave', label: 'חופשה שנתית', group: 'employee' },
  { path: '/employee-rights/annual-bonus', label: 'בונוס שנתי', group: 'employee' },
  { path: '/employee-rights/sick-pay', label: 'דמי מחלה', group: 'employee' },
  { path: '/employee-rights/overtime', label: 'שעות נוספות', group: 'employee' },
  { path: '/employee-rights/work-grant', label: 'מענק עבודה', group: 'employee' },
  { path: '/employee-rights/salary-deductions', label: 'ניכויים ממשכורת', group: 'employee' },
  // עצמאיים
  { path: '/self-employed/opening-business', label: 'פתיחת עסק — רישום ומסמכים', group: 'self-employed' },
  { path: '/self-employed/business-setup-cost', label: 'תקציב פתיחת עסק', group: 'self-employed' },
  { path: '/compare/esek-zeir-vs-osek-patur', label: 'בעל עסק זעיר מול עוסק פטור', group: 'self-employed' },
  { path: '/self-employed/invoices', label: 'חשבוניות וקבלות', group: 'self-employed' },
  { path: '/self-employed/withholding-tax', label: 'ניכוי מס במקור וניהול ספרים', group: 'self-employed' },
  { path: '/self-employed/net', label: 'נטו לעצמאי', group: 'self-employed' },
  { path: '/self-employed/social-security', label: 'ביטוח לאומי עצמאי', group: 'self-employed' },
  { path: '/self-employed/vat', label: 'מע"מ', group: 'self-employed' },
  { path: '/self-employed/tax-advances', label: 'מקדמות מס', group: 'self-employed' },
  { path: '/self-employed/hourly-rate', label: 'תעריף שעתי', group: 'self-employed' },
  { path: '/self-employed/employer-cost', label: 'עלות מעסיק', group: 'self-employed' },
  { path: '/self-employed/mandatory-pension', label: 'פנסיה חובה לעצמאי', group: 'self-employed' },
  { path: '/self-employed/corporation-vs-individual', label: 'חברה מול עוסק', group: 'self-employed' },
  { path: '/self-employed/dividend-vs-salary', label: 'דיבידנד מול שכר', group: 'self-employed' },
  { path: '/self-employed/year-end-tax-simulator', label: 'בדיקת סוף שנת מס', group: 'self-employed' },
  { path: '/self-employed/allowed-expenses', label: 'הוצאות מוכרות לעצמאי', group: 'self-employed' },
  { path: '/self-employed/vat-threshold', label: 'תקרת עוסק פטור', group: 'self-employed' },
  { path: '/self-employed/employee-and-self-employed', label: 'שכיר + עצמאי', group: 'self-employed' },
  { path: '/compare/osek-patur-vs-murshe', label: 'עוסק פטור מול עוסק מורשה', group: 'self-employed' },
  // נדל"ן ומשכנתאות
  { path: '/real-estate/first-home-budget', label: 'תקציב לדירה ראשונה', group: 'real-estate' },
  { path: '/real-estate/mortgage', label: 'מחשבון משכנתא', group: 'real-estate' },
  { path: '/real-estate/mortgage-optimizer', label: 'מדריך השוואת תמהילים', group: 'real-estate' },
  { path: '/real-estate/purchase-tax', label: 'מס רכישה', group: 'real-estate' },
  { path: '/real-estate/arnona', label: 'מחשבון ארנונה', group: 'real-estate' },
  { path: '/real-estate/arnona-business', label: 'ארנונה לעסקים', group: 'real-estate' },
  { path: '/real-estate/capital-gains-tax', label: 'מס שבח', group: 'real-estate' },
  // השקעות וחיסכון
  { path: '/investments/compound-interest', label: 'ריבית דריבית', group: 'investments' },
  { path: '/investments/retirement', label: 'תכנון פרישה', group: 'investments' },
  { path: '/investments/fire', label: 'FIRE – עצמאות כלכלית', group: 'investments' },
  { path: '/investments/roi', label: 'תשואה על השקעה (ROI)', group: 'investments' },
  { path: '/investments/currency-converter', label: 'ממיר מטבעות', group: 'investments' },
  { path: '/insurance/pension', label: 'מדריך בדיקת פנסיה', group: 'investments' },
  { path: '/compare/keren-hishtalmut-vs-pikadon', label: 'קרן השתלמות מול פיקדון', group: 'investments' },
  // הלוואות וחיסכון
  { path: '/savings/family-budget', label: 'תקציב משפחתי', group: 'loans' },
  { path: '/savings/loan-repayment', label: 'החזרי הלוואה', group: 'loans' },
  { path: '/savings/personal-loan', label: 'הלוואה אישית', group: 'loans' },
  { path: '/savings/overdraft', label: 'מינוס בחשבון', group: 'loans' },
  { path: '/savings/cpi-linkage', label: 'הצמדה למדד', group: 'loans' },
  { path: '/savings/utility-bills', label: 'חשבון חשמל ומים', group: 'loans' },
  // רכב
  { path: '/vehicles/leasing-vs-buying', label: 'ליסינג מול קנייה', group: 'vehicles' },
  { path: '/vehicles/fuel-cost', label: 'עלות דלק', group: 'vehicles' },
  { path: '/vehicles/company-car-benefit', label: 'שווי שימוש ברכב', group: 'vehicles' },
  { path: '/compare/leasing-mimuni-vs-tifuli', label: 'ליסינג מימוני מול תפעולי', group: 'vehicles' },
  // הקמת עסק ומימון (group ייעודי — מופיעים רק דרך CURATED, לא כ-fallback)
  { path: '/business', label: 'כמה עולה להקים עסק?', group: 'business-setup' },
  { path: '/tools/loan-eligibility', label: 'זכאות להלוואה בערבות המדינה', group: 'business-setup' },
];

/** קשרים ידניים חוצי-קבוצה ברמת רלוונטיות גבוהה. */
const CURATED: Record<string, string[]> = {
  '/employee-rights/salary-deductions': ['/personal-tax/salary-net-gross', '/personal-tax/tax-credits', '/personal-tax/income-tax', '/insurance/pension'],
  '/personal-tax/salary-net-gross': ['/personal-tax/income-tax', '/personal-tax/tax-refund', '/salaried/salary-negotiation-total-compensation', '/employee-rights/severance'],
  '/personal-tax/income-tax': ['/personal-tax/salary-net-gross', '/personal-tax/tax-credits', '/personal-tax/tax-refund', '/self-employed/net'],
  '/self-employed/net': ['/self-employed/social-security', '/self-employed/vat', '/self-employed/tax-advances', '/self-employed/employee-and-self-employed'],
  '/self-employed/allowed-expenses': ['/self-employed/invoices', '/self-employed/year-end-tax-simulator', '/self-employed/net', '/self-employed/vat'],
  '/self-employed/opening-business': ['/compare/osek-patur-vs-murshe', '/self-employed/invoices', '/self-employed/withholding-tax', '/self-employed/allowed-expenses'],
  '/self-employed/invoices': ['/self-employed/withholding-tax', '/self-employed/allowed-expenses', '/self-employed/vat', '/self-employed/vat-threshold'],
  '/self-employed/withholding-tax': ['/self-employed/invoices', '/self-employed/tax-advances', '/self-employed/year-end-tax-simulator', '/self-employed/opening-business'],
  '/self-employed/tax-advances': ['/self-employed/allowed-expenses', '/self-employed/year-end-tax-simulator', '/self-employed/social-security', '/self-employed/withholding-tax'],
  '/self-employed/vat-threshold': ['/self-employed/vat', '/self-employed/allowed-expenses', '/self-employed/net', '/self-employed/social-security'],
  '/self-employed/vat': ['/self-employed/vat-threshold', '/self-employed/tax-advances', '/self-employed/net', '/self-employed/social-security'],
  '/self-employed/employee-and-self-employed': ['/personal-tax/salary-net-gross', '/self-employed/net', '/self-employed/social-security', '/self-employed/tax-advances'],
  '/real-estate/mortgage': ['/real-estate/mortgage-optimizer', '/real-estate/purchase-tax', '/savings/loan-repayment', '/real-estate/first-home-budget'],
  '/real-estate/purchase-tax': ['/real-estate/mortgage', '/real-estate/capital-gains-tax', '/real-estate/mortgage-optimizer', '/real-estate/first-home-budget'],
  '/real-estate/arnona': ['/real-estate/arnona-business', '/real-estate/first-home-budget', '/real-estate/mortgage', '/real-estate/purchase-tax'],
  '/investments/currency-converter': ['/personal-tax/foreign-income', '/personal-tax/crypto-tax', '/investments/compound-interest', '/investments/roi'],
  '/real-estate/arnona-business': ['/real-estate/arnona', '/self-employed/business-setup-cost', '/self-employed/allowed-expenses', '/business'],
  '/salaried/salary-negotiation-total-compensation': ['/personal-tax/salary-net-gross', '/personal-tax/income-tax', '/employee-rights/annual-bonus', '/insurance/pension'],
  '/real-estate/first-home-budget': ['/real-estate/mortgage', '/real-estate/purchase-tax', '/savings/family-budget', '/real-estate/mortgage-optimizer'],
  '/employee-rights/severance': ['/employee-rights/recreation-pay', '/employee-rights/annual-leave', '/personal-tax/salary-net-gross', '/insurance/pension'],
  '/vehicles/leasing-vs-buying': ['/compare/leasing-mimuni-vs-tifuli', '/vehicles/fuel-cost', '/vehicles/company-car-benefit', '/self-employed/employer-cost'],
  // קישור אשכול הקמת-עסק מהדפים הנסרקים ביותר (GSC, יולי 2026) — פתרון לבעיית ה-discovery
  '/self-employed/hourly-rate': ['/self-employed/business-setup-cost', '/self-employed/net', '/self-employed/employer-cost', '/compare/esek-zeir-vs-osek-patur'],
  '/self-employed/business-setup-cost': ['/self-employed/opening-business', '/compare/osek-patur-vs-murshe', '/compare/esek-zeir-vs-osek-patur', '/self-employed/hourly-rate'],
  '/compare/esek-zeir-vs-osek-patur': ['/compare/osek-patur-vs-murshe', '/self-employed/vat-threshold', '/self-employed/allowed-expenses', '/self-employed/opening-business'],
  '/self-employed/employer-cost': ['/business', '/self-employed/hourly-rate', '/self-employed/corporation-vs-individual', '/employee-rights/severance'],
  '/employee-rights/unemployment-benefits': ['/employee-rights/work-grant', '/business', '/personal-tax/salary-net-gross', '/savings/family-budget'],
  '/savings/loan-repayment': ['/savings/overdraft', '/tools/loan-eligibility', '/real-estate/mortgage', '/savings/personal-loan'],
  '/employee-rights/child-allowance': ['/employee-rights/maternity-benefits', '/savings/child-savings', '/savings/family-budget', '/personal-tax/salary-net-gross'],
  '/employee-rights/sick-pay': ['/employee-rights/annual-leave', '/employee-rights/seniority', '/personal-tax/salary-net-gross', '/employee-rights/holiday-pay'],
  '/employee-rights/annual-leave': ['/employee-rights/seniority', '/employee-rights/sick-pay', '/employee-rights/recreation-pay', '/employee-rights/notice-period'],
  '/employee-rights/notice-period': ['/employee-rights/severance', '/employee-rights/annual-leave', '/employee-rights/seniority', '/employee-rights/unemployment-benefits'],
  '/employee-rights/holiday-pay': ['/employee-rights/overtime', '/employee-rights/work-hours', '/employee-rights/seniority', '/employee-rights/minimum-wage'],
  '/employee-rights/seniority': ['/employee-rights/annual-leave', '/employee-rights/recreation-pay', '/employee-rights/notice-period', '/employee-rights/severance'],
  '/employee-rights/work-hours': ['/employee-rights/overtime', '/employee-rights/minimum-wage', '/employee-rights/holiday-pay', '/personal-tax/salary-net-gross'],
  '/employee-rights/minimum-wage': ['/personal-tax/salary-net-gross', '/employee-rights/work-hours', '/employee-rights/overtime', '/employee-rights/recreation-pay'],
  '/personal-tax/national-insurance': ['/personal-tax/salary-net-gross', '/self-employed/social-security', '/self-employed/net', '/personal-tax/income-tax'],
  '/savings/loan-methods': ['/savings/loan-repayment', '/savings/debt-payoff', '/savings/overdraft', '/real-estate/mortgage'],
  '/savings/debt-payoff': ['/savings/loan-methods', '/savings/overdraft', '/savings/loan-repayment', '/savings/family-budget'],
  '/savings/savings-goal': ['/investments/compound-interest', '/savings/cpi-linkage', '/savings/emergency-fund', '/investments/study-fund-calculator'],
  '/real-estate/rental-yield': ['/real-estate/rental-tax-calculator', '/real-estate/arnona', '/real-estate/purchase-tax', '/real-estate/rent-vs-buy-calculator'],
  '/real-estate/rental-tax-calculator': ['/real-estate/rental-income-tax', '/real-estate/rental-yield', '/personal-tax/income-tax', '/real-estate/capital-gains-tax'],
  '/real-estate/rent-vs-buy-calculator': ['/compare/rent-vs-buy', '/real-estate/mortgage', '/real-estate/purchase-tax', '/real-estate/refinance-calculator'],
  '/real-estate/refinance-calculator': ['/real-estate/mortgage', '/real-estate/mortgage-optimizer', '/savings/loan-methods', '/real-estate/rent-vs-buy-calculator'],
  '/investments/study-fund-calculator': ['/compare/keren-hishtalmut-vs-pikadon', '/savings/education-fund-employee', '/investments/compound-interest', '/personal-tax/income-tax'],
  '/self-employed/osek-comparison': ['/compare/osek-patur-vs-murshe', '/self-employed/vat-threshold', '/self-employed/net', '/self-employed/vat'],
  '/investments/securities-tax': ['/investments/capital-gains-tax', '/savings/cpi-linkage', '/investments/roi', '/personal-tax/crypto-tax'],
  '/real-estate/arnona-discount': ['/real-estate/arnona', '/real-estate/arnona-business', '/savings/family-budget', '/real-estate/first-home-budget'],
  '/savings/utility-bills': ['/savings/family-budget', '/real-estate/arnona', '/real-estate/first-home-budget', '/savings/emergency-fund'],
  '/savings/cpi-linkage': ['/real-estate/mortgage/guide/index-linked', '/savings/loan-repayment', '/investments/compound-interest', '/compare/rent-vs-buy'],
  '/savings/overdraft': ['/savings/loan-repayment', '/savings/personal-loan', '/savings/family-budget', '/savings/emergency-fund'],
  '/investments/compound-interest': ['/compare/keren-hishtalmut-vs-pikadon', '/investments/retirement', '/investments/fire', '/insurance/pension'],
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
