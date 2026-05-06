/**
 * Advanced DSCR Engine - 5 methods of measuring debt service capacity
 *
 * 1. EBITDA-based DSCR (קלאסי, נפוץ אצל בנקים)
 * 2. Operating Cash Flow DSCR (יותר שמרני - תזרים אמיתי)
 * 3. Net Income + Depreciation + Interest DSCR (חלופה לכאשר אין נתוני תזרים)
 * 4. Free Cash Flow DSCR (FCF / Debt Service - אחרי CapEx)
 * 5. After-Tax DSCR (תזרים אחרי מס - הסטנדרט הבנקאי)
 *
 * הפלט כולל:
 * - DSCR משוקלל (ממוצע של כל השיטות עם משקלים)
 * - הערכת בנק (האם מומלץ לאישור)
 * - יכולת חוב מקסימלית
 */

export interface DSCRInput {
  ebitda: number;
  operatingCashFlow: number;
  netProfit: number;
  depreciation: number;
  interestExpense: number;
  /** קרן בלבד (לא כולל ריבית) */
  principalPayment: number;
  capitalExpenditure: number;
  taxRate: number; // 0-100
}

export interface DSCRMethodResult {
  value: number;
  label: string;
  formula: string;
  interpretation: { status: 'excellent' | 'good' | 'fair' | 'weak' | 'critical'; text: string };
}

export interface AdvancedDSCRResult {
  primary: DSCRMethodResult;
  ebitda: DSCRMethodResult;
  cashFlow: DSCRMethodResult;
  netIncome: DSCRMethodResult;
  freeCashFlow: DSCRMethodResult;
  afterTax: DSCRMethodResult;
  components: {
    ebitda: number;
    operatingCashFlow: number;
    freeCashFlow: number;
    totalDebtService: number;
    principalPayment: number;
    interestExpense: number;
  };
  bankAssessment: {
    approval: string;
    confidence: 'גבוהה' | 'בינונית-גבוהה' | 'בינונית' | 'נמוכה' | 'ללא';
    maxLTV: number; // %
    comments: string[];
  };
  maxDebtCapacity: {
    aggressive: number; // DSCR 1.0
    moderate: number; // DSCR 1.35
    conservative: number; // DSCR 1.5
  };
}

function interpretDSCR(value: number): DSCRMethodResult['interpretation'] {
  if (value >= 2.5) return { status: 'excellent', text: 'מעולה - יכולת החזר חוב גבוהה מאוד' };
  if (value >= 1.5) return { status: 'good', text: 'טוב - יכולת החזר חזקה' };
  if (value >= 1.25) return { status: 'fair', text: 'סביר - יכולת החזר מספקת' };
  if (value >= 1.0) return { status: 'weak', text: 'גבולי - מרווח ביטחון דק' };
  return { status: 'critical', text: 'קריטי - לא מסוגל לשרת את החוב!' };
}

export function calculateAdvancedDSCR(input: DSCRInput): AdvancedDSCRResult {
  const {
    ebitda,
    operatingCashFlow,
    netProfit,
    depreciation,
    interestExpense,
    principalPayment,
    capitalExpenditure,
    taxRate,
  } = input;

  const totalDebtService = principalPayment + interestExpense;
  const freeCashFlow = operatingCashFlow - capitalExpenditure;

  // 1. EBITDA-based
  const dscrEbitda = totalDebtService > 0 ? ebitda / totalDebtService : ebitda > 0 ? 999 : 0;

  // 2. Operating Cash Flow
  const dscrCashFlow =
    totalDebtService > 0 ? operatingCashFlow / totalDebtService : operatingCashFlow > 0 ? 999 : 0;

  // 3. Net Income + Depreciation + Interest
  const niPlusAdjustments = netProfit + depreciation + interestExpense;
  const dscrNetIncome =
    totalDebtService > 0 ? niPlusAdjustments / totalDebtService : niPlusAdjustments > 0 ? 999 : 0;

  // 4. Free Cash Flow
  const dscrFCF =
    totalDebtService > 0 ? freeCashFlow / totalDebtService : freeCashFlow > 0 ? 999 : 0;

  // 5. After-Tax DSCR (Bank standard)
  // נטל מס מוחל רק על EBIT (לא על depreciation)
  const ebit = ebitda - depreciation;
  const afterTaxIncome = ebit * (1 - taxRate / 100) + depreciation;
  const dscrAfterTax =
    totalDebtService > 0 ? afterTaxIncome / totalDebtService : afterTaxIncome > 0 ? 999 : 0;

  // Primary DSCR - ממוצע משוקלל
  // משקלים: EBITDA 30%, OCF 30%, After-Tax 25%, NI+Adj 10%, FCF 5%
  const primaryDSCR =
    dscrEbitda * 0.3 +
    dscrCashFlow * 0.3 +
    dscrAfterTax * 0.25 +
    dscrNetIncome * 0.1 +
    dscrFCF * 0.05;

  // Bank Assessment
  let approval: string;
  let confidence: AdvancedDSCRResult['bankAssessment']['confidence'];
  let maxLTV: number;
  const comments: string[] = [];

  if (primaryDSCR >= 2.0 && dscrFCF >= 1.5) {
    approval = 'מומלץ לאישור';
    confidence = 'גבוהה';
    maxLTV = 80;
    comments.push('יכולת החזר חוב מעולה במספר שיטות מדידה');
  } else if (primaryDSCR >= 1.5 && dscrFCF >= 1.2) {
    approval = 'ניתן לאישור בתנאים';
    confidence = 'בינונית-גבוהה';
    maxLTV = 70;
    comments.push('יכולת החזר טובה - נדרשים בטחונות סטנדרטיים');
  } else if (primaryDSCR >= 1.25 && dscrFCF >= 1.0) {
    approval = 'אישור בכפוף לבטחונות מוגברים';
    confidence = 'בינונית';
    maxLTV = 60;
    comments.push('יכולת החזר מספקת - נדרשים בטחונות מוגברים');
    if (dscrCashFlow < dscrEbitda * 0.8) {
      comments.push('פער בין EBITDA לתזרים תפעולי - בדוק איכות רווחים');
    }
  } else if (primaryDSCR >= 1.0) {
    approval = 'בעייתי - נדרשת בחינה מעמיקה';
    confidence = 'נמוכה';
    maxLTV = 50;
    comments.push('יכולת החזר מוגבלת');
    comments.push('סיכון לחוסר עמידה בקובננטים');
  } else {
    approval = 'לא מומלץ לאישור';
    confidence = 'ללא';
    maxLTV = 0;
    comments.push('חוסר יכולת לשרת חוב נוסף');
    if (primaryDSCR < 0.5) {
      comments.push('🚨 סיכון משמעותי לחדלות פירעון');
    }
  }

  if (dscrFCF < 1 && dscrEbitda > 1.5) {
    comments.push('⚠️ FCF DSCR נמוך - CapEx גבוה מנטרל את היתרון מ-EBITDA');
  }

  // Max debt capacity
  // מבוסס EBITDA × multiple, כשה-multiple = years_of_amortization / target_DSCR
  const yearsAmortization = 5; // הנחה סטנדרטית
  const maxDebtCapacity = {
    aggressive: ebitda > 0 ? (ebitda / 1.0) * yearsAmortization : 0,
    moderate: ebitda > 0 ? (ebitda / 1.35) * yearsAmortization : 0,
    conservative: ebitda > 0 ? (ebitda / 1.5) * yearsAmortization : 0,
  };

  return {
    primary: {
      value: primaryDSCR,
      label: 'DSCR משוקלל',
      formula: 'ממוצע משוקלל של 5 שיטות',
      interpretation: interpretDSCR(primaryDSCR),
    },
    ebitda: {
      value: dscrEbitda,
      label: 'DSCR (EBITDA)',
      formula: 'EBITDA / (קרן + ריבית)',
      interpretation: interpretDSCR(dscrEbitda),
    },
    cashFlow: {
      value: dscrCashFlow,
      label: 'DSCR (תזרים תפעולי)',
      formula: 'תזרים תפעולי / (קרן + ריבית)',
      interpretation: interpretDSCR(dscrCashFlow),
    },
    netIncome: {
      value: dscrNetIncome,
      label: 'DSCR (רווח נקי + פחת + ריבית)',
      formula: '(NI + פחת + ריבית) / (קרן + ריבית)',
      interpretation: interpretDSCR(dscrNetIncome),
    },
    freeCashFlow: {
      value: dscrFCF,
      label: 'DSCR (תזרים חופשי)',
      formula: '(תזרים תפעולי - CapEx) / (קרן + ריבית)',
      interpretation: interpretDSCR(dscrFCF),
    },
    afterTax: {
      value: dscrAfterTax,
      label: 'DSCR (אחרי מס)',
      formula: '[EBIT × (1-T) + פחת] / (קרן + ריבית)',
      interpretation: interpretDSCR(dscrAfterTax),
    },
    components: {
      ebitda,
      operatingCashFlow,
      freeCashFlow,
      totalDebtService,
      principalPayment,
      interestExpense,
    },
    bankAssessment: {
      approval,
      confidence,
      maxLTV,
      comments,
    },
    maxDebtCapacity,
  };
}
