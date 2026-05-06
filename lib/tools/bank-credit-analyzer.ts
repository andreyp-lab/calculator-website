/**
 * Bank Credit Analyzer - Full Module
 *
 * מנוע מקיף להערכת אשראי בנקאי כולל:
 * - חישוב קיבולת אשראי לפי 4 שיטות
 * - המלצה על מוצרי אשראי מתאימים
 * - חישוב LTV מקסימלי
 * - דרישות בטחונות
 * - תמחור (פריים + מרווח)
 * - תכנית קובננטים
 * - המלצת אישור (ועדה)
 */

import type { CreditRating, FinancialRatios } from './types';

// ============================================================
// PRODUCT CONFIGURATIONS
// ============================================================

export interface CreditProduct {
  key: string;
  name: string;
  nameEn: string;
  minRating: string;
  maxTermMonths: number;
  typicalUse: string;
}

export const CREDIT_PRODUCTS: Record<string, CreditProduct> = {
  revolvingCredit: {
    key: 'revolvingCredit',
    name: 'מסגרת אשראי מתחדשת',
    nameEn: 'Revolving Credit',
    minRating: 'CCC',
    maxTermMonths: 12,
    typicalUse: 'הון חוזר, גישור תזרימי',
  },
  termLoan: {
    key: 'termLoan',
    name: 'הלוואה לטווח ארוך',
    nameEn: 'Term Loan',
    minRating: 'B',
    maxTermMonths: 84,
    typicalUse: 'השקעות, רכישות, מחזור חוב',
  },
  workingCapital: {
    key: 'workingCapital',
    name: 'מימון הון חוזר',
    nameEn: 'Working Capital',
    minRating: 'CCC',
    maxTermMonths: 12,
    typicalUse: 'מימון לקוחות ומלאי',
  },
  assetFinancing: {
    key: 'assetFinancing',
    name: 'מימון נכסים',
    nameEn: 'Asset-Based',
    minRating: 'CC',
    maxTermMonths: 60,
    typicalUse: 'רכישת ציוד ורכבים',
  },
  factoring: {
    key: 'factoring',
    name: 'פקטורינג',
    nameEn: 'Factoring',
    minRating: 'D',
    maxTermMonths: 3,
    typicalUse: 'מימון חשבוניות לקוחות',
  },
  bankGuarantee: {
    key: 'bankGuarantee',
    name: 'ערבות בנקאית',
    nameEn: 'Bank Guarantee',
    minRating: 'BB',
    maxTermMonths: 36,
    typicalUse: 'מכרזים, ביצוע, שכירות',
  },
};

// ============================================================
// PRICING TABLES
// ============================================================

export const INTEREST_SPREADS: Record<string, { short: number; medium: number; long: number }> = {
  AAA: { short: 0.25, medium: 0.5, long: 0.75 },
  AA: { short: 0.5, medium: 0.75, long: 1.0 },
  A: { short: 0.75, medium: 1.0, long: 1.5 },
  BBB: { short: 1.25, medium: 1.75, long: 2.25 },
  BB: { short: 1.75, medium: 2.5, long: 3.0 },
  B: { short: 2.5, medium: 3.25, long: 4.0 },
  CCC: { short: 3.5, medium: 4.5, long: 5.5 },
  CC: { short: 5.0, medium: 6.0, long: 7.0 },
  C: { short: 7.0, medium: 8.0, long: 9.0 },
};

export const LTV_LIMITS: Record<
  string,
  { realEstate: number; equipment: number; receivables: number; inventory: number }
> = {
  AAA: { realEstate: 85, equipment: 80, receivables: 90, inventory: 75 },
  AA: { realEstate: 80, equipment: 75, receivables: 85, inventory: 70 },
  A: { realEstate: 75, equipment: 70, receivables: 80, inventory: 65 },
  BBB: { realEstate: 70, equipment: 65, receivables: 75, inventory: 60 },
  BB: { realEstate: 65, equipment: 60, receivables: 70, inventory: 55 },
  B: { realEstate: 60, equipment: 55, receivables: 65, inventory: 50 },
  CCC: { realEstate: 50, equipment: 45, receivables: 55, inventory: 40 },
  CC: { realEstate: 40, equipment: 35, receivables: 45, inventory: 30 },
  C: { realEstate: 30, equipment: 25, receivables: 35, inventory: 20 },
};

// ============================================================
// MAIN ANALYZER
// ============================================================

export interface BankCreditInput {
  companyName: string;
  revenue: number;
  ebitda: number;
  netProfit: number;
  totalAssets: number;
  totalEquity: number;
  fixedAssets: number;
  accountsReceivable: number;
  inventory: number;
  realEstateValue: number;
  currentDebt: number; // existing total debt
  ratios: FinancialRatios;
  creditRating: CreditRating;
  /** מ-DSCR engine */
  primaryDSCR: number;
  fcfDSCR: number;
}

export interface CreditCapacity {
  ebitdaBased: { value: number; multiplier: number };
  equityBased: { value: number; multiplier: number };
  dscrBased: { value: number };
  assetBased: { value: number };
  grossCapacity: number;
  availableCapacity: number;
  utilizationRate: number; // %
}

export interface ProductRecommendation {
  product: CreditProduct;
  recommended: boolean;
  priority: number;
  maxAmount: number;
  suggestedAmount: number;
  terms: {
    tenor: string;
    interestRate: string;
    fees: string;
  };
  collateral: string[];
  conditions: string[];
}

export interface Covenant {
  name: string;
  type: 'מינימום' | 'מקסימום';
  requirement: string;
  current: number;
  frequency: string;
  curePeriod: string;
}

export interface BankCreditResult {
  executiveSummary: {
    companyName: string;
    rating: string;
    investmentGrade: boolean;
    overallAssessment: string;
    keyStrengths: string[];
    keyRisks: string[];
  };
  creditCapacity: CreditCapacity;
  recommendedProducts: ProductRecommendation[];
  totalRecommendedCredit: number;
  pricing: {
    primeRate: number;
    shortTermRate: string;
    mediumTermRate: string;
    longTermRate: string;
    arrangementFee: string;
  };
  ltvAnalysis: {
    realEstate: { value: number; maxLTV: number; maxLoan: number };
    equipment: { value: number; maxLTV: number; maxLoan: number };
    receivables: { value: number; maxLTV: number; maxLoan: number };
    inventory: { value: number; maxLTV: number; maxLoan: number };
    totalCollateralValue: number;
    totalMaxLoan: number;
  };
  covenants: Covenant[];
  approvalRecommendation: {
    recommendation: string;
    confidence: 'גבוהה' | 'בינונית-גבוהה' | 'בינונית' | 'נמוכה' | 'ללא';
    committeeLevel: 'סניף' | 'אזור' | 'מטה' | 'עליונה';
    conditions: string[];
    warnings: string[];
  };
}

function isProductAvailable(productKey: string, rating: string): boolean {
  const product = CREDIT_PRODUCTS[productKey];
  if (!product) return false;
  const order = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'];
  return order.indexOf(rating) <= order.indexOf(product.minRating);
}

function getInterestRate(rating: string, term: 'short' | 'medium' | 'long'): string {
  const spreads = INTEREST_SPREADS[rating];
  if (!spreads) return 'לא זמין';
  const primeRate = 6.0; // הנחה
  return `פריים + ${spreads[term]}% (${(primeRate + spreads[term]).toFixed(2)}%)`;
}

function getTargetDebtToEbitda(rating: string): number {
  const targets: Record<string, number> = {
    AAA: 2.0, AA: 2.5, A: 3.0, BBB: 3.5, BB: 4.0, B: 4.5, CCC: 5.0, CC: 5.5, C: 6.0, D: 0,
  };
  return targets[rating] ?? 3.0;
}

function getTargetDebtToEquity(rating: string): number {
  const targets: Record<string, number> = {
    AAA: 0.5, AA: 0.75, A: 1.0, BBB: 1.5, BB: 2.0, B: 2.5, CCC: 3.0, CC: 3.5, C: 4.0, D: 0,
  };
  return targets[rating] ?? 1.5;
}

function getCommitteeLevel(rating: string): BankCreditResult['approvalRecommendation']['committeeLevel'] {
  if (['AAA', 'AA', 'A'].includes(rating)) return 'סניף';
  if (['BBB', 'BB'].includes(rating)) return 'אזור';
  if (['B', 'CCC'].includes(rating)) return 'מטה';
  return 'עליונה';
}

export function analyzeBankCredit(input: BankCreditInput): BankCreditResult {
  const {
    companyName,
    revenue,
    ebitda,
    totalAssets,
    totalEquity,
    fixedAssets,
    accountsReceivable,
    inventory,
    realEstateValue,
    currentDebt,
    ratios,
    creditRating,
    primaryDSCR,
    fcfDSCR,
  } = input;

  const rating = creditRating.rating;

  // ============= CREDIT CAPACITY =============
  const targetDebtEbitda = getTargetDebtToEbitda(rating);
  const targetDebtEquity = getTargetDebtToEquity(rating);

  const ebitdaBased = ebitda * targetDebtEbitda;
  const equityBased = totalEquity * targetDebtEquity;

  // DSCR-based: EBITDA / 1.5 × 5 years
  const dscrBased = ebitda > 0 ? (ebitda / 1.5) * 5 : 0;

  // Asset-based
  const limits = LTV_LIMITS[rating] ?? LTV_LIMITS.CCC;
  const assetBased =
    realEstateValue * (limits.realEstate / 100) +
    accountsReceivable * (limits.receivables / 100) +
    inventory * (limits.inventory / 100) +
    fixedAssets * (limits.equipment / 100);

  const grossCapacity = Math.min(ebitdaBased, equityBased, dscrBased);
  const availableCapacity = Math.max(0, grossCapacity - currentDebt);
  const utilizationRate = grossCapacity > 0 ? (currentDebt / grossCapacity) * 100 : 0;

  const creditCapacity: CreditCapacity = {
    ebitdaBased: { value: ebitdaBased, multiplier: targetDebtEbitda },
    equityBased: { value: equityBased, multiplier: targetDebtEquity },
    dscrBased: { value: dscrBased },
    assetBased: { value: assetBased },
    grossCapacity,
    availableCapacity,
    utilizationRate,
  };

  // ============= PRODUCT RECOMMENDATIONS =============
  const recommendedProducts: ProductRecommendation[] = [];

  // 1. Revolving Credit
  if (isProductAvailable('revolvingCredit', rating)) {
    const maxAmount = Math.min(revenue * 0.15, accountsReceivable * 0.8);
    recommendedProducts.push({
      product: CREDIT_PRODUCTS.revolvingCredit,
      recommended: true,
      priority: 1,
      maxAmount,
      suggestedAmount: maxAmount * 0.7,
      terms: {
        tenor: '12 חודשים, חידוש שנתי',
        interestRate: getInterestRate(rating, 'short'),
        fees: 'עמלת הקצאה 0.5%, עמלת אי-ניצול 0.25%',
      },
      collateral: ['שעבוד שוטף על לקוחות'],
      conditions: ['דיווח חודשי', 'עמידה בקובננטים רבעונית'],
    });
  }

  // 2. Working Capital
  if (isProductAvailable('workingCapital', rating) && ratios.ccc > 30) {
    const dailyRevenue = revenue / 365;
    const wcNeed = dailyRevenue * Math.max(0, ratios.ccc);
    if (wcNeed > 0) {
      recommendedProducts.push({
        product: CREDIT_PRODUCTS.workingCapital,
        recommended: true,
        priority: 2,
        maxAmount: wcNeed * 1.2,
        suggestedAmount: wcNeed,
        terms: {
          tenor: 'מתחדש, עד 12 חודשים',
          interestRate: getInterestRate(rating, 'short'),
          fees: 'עמלת ניהול 0.5%',
        },
        collateral: ['שעבוד לקוחות', 'שעבוד מלאי'],
        conditions: ['דיווח גילאי לקוחות', 'ביקורת מלאי תקופתית'],
      });
    }
  }

  // 3. Term Loan
  if (primaryDSCR >= 1.3 && isProductAvailable('termLoan', rating)) {
    const maxTermLoan = ebitda > 0 ? (ebitda / 1.35) * 5 : 0;
    recommendedProducts.push({
      product: CREDIT_PRODUCTS.termLoan,
      recommended: primaryDSCR >= 1.5,
      priority: 3,
      maxAmount: maxTermLoan,
      suggestedAmount: maxTermLoan * 0.6,
      terms: {
        tenor: '36-60 חודשים',
        interestRate: getInterestRate(rating, 'long'),
        fees: 'עמלת הקצאה 1.0%',
      },
      collateral: realEstateValue > 0 ? ['שעבוד נדל"ן', 'שעבוד צף'] : ['שעבוד צף', 'ערבות אישית'],
      conditions: ['DSCR מינימלי 1.25', 'יחס חוב/הון מקסימלי'],
    });
  }

  // 4. Asset Financing
  if (fixedAssets > 0 && isProductAvailable('assetFinancing', rating)) {
    const maxAmount = fixedAssets * (limits.equipment / 100);
    recommendedProducts.push({
      product: CREDIT_PRODUCTS.assetFinancing,
      recommended: true,
      priority: 4,
      maxAmount,
      suggestedAmount: maxAmount * 0.7,
      terms: {
        tenor: '36-60 חודשים',
        interestRate: getInterestRate(rating, 'medium'),
        fees: 'עמלת הקצאה 0.75%',
      },
      collateral: ['שעבוד ספציפי על הנכס'],
      conditions: ['ביטוח מלא', 'תחזוקה שוטפת'],
    });
  }

  // 5. Factoring (always available if there are receivables)
  if (accountsReceivable > 0 && ratios.dso > 60) {
    recommendedProducts.push({
      product: CREDIT_PRODUCTS.factoring,
      recommended: ratios.dso > 75,
      priority: 5,
      maxAmount: accountsReceivable * 0.85,
      suggestedAmount: accountsReceivable * 0.5,
      terms: {
        tenor: 'שוטף',
        interestRate: 'פריים + 3-5%',
        fees: 'עמלת פקטורינג 1-3%',
      },
      collateral: ['המחאת חשבוניות'],
      conditions: ['לקוחות מאושרים', 'ביטוח אשראי'],
    });
  }

  // ============= LTV ANALYSIS =============
  const ltvAnalysis = {
    realEstate: {
      value: realEstateValue,
      maxLTV: limits.realEstate,
      maxLoan: realEstateValue * (limits.realEstate / 100),
    },
    equipment: {
      value: fixedAssets,
      maxLTV: limits.equipment,
      maxLoan: fixedAssets * (limits.equipment / 100),
    },
    receivables: {
      value: accountsReceivable,
      maxLTV: limits.receivables,
      maxLoan: accountsReceivable * (limits.receivables / 100),
    },
    inventory: {
      value: inventory,
      maxLTV: limits.inventory,
      maxLoan: inventory * (limits.inventory / 100),
    },
    totalCollateralValue: realEstateValue + fixedAssets + accountsReceivable + inventory,
    totalMaxLoan: 0,
  };
  ltvAnalysis.totalMaxLoan =
    ltvAnalysis.realEstate.maxLoan +
    ltvAnalysis.equipment.maxLoan +
    ltvAnalysis.receivables.maxLoan +
    ltvAnalysis.inventory.maxLoan;

  // ============= COVENANTS =============
  const covenants: Covenant[] = [
    {
      name: 'יחס כיסוי שירות חוב (DSCR)',
      type: 'מינימום',
      requirement: rating.startsWith('A') ? '1.25' : rating.startsWith('B') ? '1.15' : '1.10',
      current: ratios.dscr,
      frequency: 'רבעוני',
      curePeriod: '30 ימים',
    },
    {
      name: 'יחס שוטף',
      type: 'מינימום',
      requirement: rating.startsWith('A') ? '1.5' : '1.2',
      current: ratios.currentRatio,
      frequency: 'רבעוני',
      curePeriod: '30 ימים',
    },
    {
      name: 'יחס חוב להון',
      type: 'מקסימום',
      requirement: rating.startsWith('A') ? '1.5' : rating.startsWith('B') ? '2.5' : '3.5',
      current: ratios.debtToEquity,
      frequency: 'רבעוני',
      curePeriod: '30 ימים',
    },
    {
      name: 'EBITDA / חוב',
      type: 'מקסימום',
      requirement: rating.startsWith('A') ? '3.0' : '4.5',
      current: ebitda > 0 ? currentDebt / ebitda : 0,
      frequency: 'רבעוני',
      curePeriod: '60 ימים',
    },
  ];

  // ============= EXECUTIVE SUMMARY =============
  const keyStrengths: string[] = [];
  const keyRisks: string[] = [];

  if (ratios.netProfitMargin > 10) keyStrengths.push('רווחיות גבוהה');
  if (ratios.currentRatio > 1.5) keyStrengths.push('נזילות בריאה');
  if (ratios.debtToEquity < 1) keyStrengths.push('מינוף נמוך');
  if (primaryDSCR > 2) keyStrengths.push('יכולת החזר חוב חזקה');
  if (ratios.ccc < 45) keyStrengths.push('ניהול הון חוזר יעיל');

  if (ratios.netProfitMargin < 3) keyRisks.push('רווחיות נמוכה');
  if (ratios.currentRatio < 1.2) keyRisks.push('נזילות מוגבלת');
  if (ratios.debtToEquity > 2) keyRisks.push('מינוף גבוה');
  if (primaryDSCR < 1.3) keyRisks.push('יכולת החזר חוב מוגבלת');
  if (ratios.ccc > 90) keyRisks.push('הון חוזר כלוא');

  let overallAssessment: string;
  if (creditRating.investmentGrade && primaryDSCR >= 1.5) {
    overallAssessment = 'חברה יציבה פיננסית עם יכולת החזר טובה - מתאימה למימון';
  } else if (primaryDSCR >= 1.25) {
    overallAssessment = 'חברה עם פוטנציאל - נדרשים בטחונות ותנאים מותאמים';
  } else if (primaryDSCR >= 1.0) {
    overallAssessment = 'חברה עם סיכון מוגבר - מימון בכפוף לבטחונות משמעותיים';
  } else {
    overallAssessment = 'חברה בסיכון גבוה - לא מומלץ למימון בנקאי סטנדרטי';
  }

  // ============= APPROVAL RECOMMENDATION =============
  let recommendation: string;
  let confidence: BankCreditResult['approvalRecommendation']['confidence'];
  const conditions: string[] = [];
  const warnings: string[] = [];

  if (creditRating.investmentGrade && primaryDSCR >= 1.5) {
    recommendation = 'מומלץ לאישור';
    confidence = 'גבוהה';
    conditions.push('תנאים סטנדרטיים', 'בטחונות רגילים');
  } else if (rating.startsWith('B') && primaryDSCR >= 1.25) {
    recommendation = 'ניתן לאישור בתנאים';
    confidence = 'בינונית-גבוהה';
    conditions.push('בטחונות מוגברים', 'קובננטים הדוקים', 'ניטור צמוד');
  } else if (primaryDSCR >= 1.0) {
    recommendation = 'אישור בכפוף לבטחונות משמעותיים';
    confidence = 'בינונית';
    conditions.push('בטחונות מלאים', 'ערבויות אישיות', 'ניטור חודשי');
    warnings.push('סיכון מוגבר', 'נדרש אישור ועדה בכירה');
  } else {
    recommendation = 'לא מומלץ לאישור';
    confidence = 'ללא';
    warnings.push('יכולת שירות חוב לא מספקת', 'סיכון גבוה לחדלות פירעון');
  }

  if (fcfDSCR < 1 && primaryDSCR > 1.5) {
    warnings.push('FCF DSCR נמוך - CapEx גבוה מנטרל יתרונות EBITDA');
  }

  const totalRecommendedCredit = recommendedProducts.reduce(
    (sum, p) => sum + p.suggestedAmount,
    0,
  );

  return {
    executiveSummary: {
      companyName,
      rating,
      investmentGrade: creditRating.investmentGrade,
      overallAssessment,
      keyStrengths,
      keyRisks,
    },
    creditCapacity,
    recommendedProducts: recommendedProducts.sort((a, b) => a.priority - b.priority),
    totalRecommendedCredit,
    pricing: {
      primeRate: 6.0,
      shortTermRate: getInterestRate(rating, 'short'),
      mediumTermRate: getInterestRate(rating, 'medium'),
      longTermRate: getInterestRate(rating, 'long'),
      arrangementFee: rating.startsWith('A') ? '0.5-0.75%' : rating.startsWith('B') ? '0.75-1.25%' : '1.25-2.0%',
    },
    ltvAnalysis,
    covenants,
    approvalRecommendation: {
      recommendation,
      confidence,
      committeeLevel: getCommitteeLevel(rating),
      conditions,
      warnings,
    },
  };
}
