/**
 * מחשבון מקדמות מס לעצמאי - 2026
 *
 * עצמאי משלם מקדמות מס לאורך השנה כל חודש או דו-חודש.
 * המקדמות מבוססות על השכר הצפוי + ביטוח לאומי + מע"מ.
 *
 * רכיבי המקדמה:
 * 1. מס הכנסה לפי מדרגות (10%-50%)
 * 2. ביטוח לאומי + בריאות לעצמאי (~6.1%-18%)
 * 3. מע"מ (אם עוסק מורשה - 18% מההפרש)
 *
 * תיקון מקדמות: בסוף השנה - תיאום סופי (טופס 1301 - עד 31 במרץ)
 *
 * תדירות:
 * - חודשי: עוסקים גדולים
 * - דו-חודשי: עוסקים בינוניים (ברירת מחדל)
 *
 * מקור: רשות המסים, ביטוח לאומי
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
  VAT_2026,
} from '@/lib/constants/tax-2026';

export type AdvanceFrequency = 'monthly' | 'bimonthly';

// ============================================================
// טיפוסי קלט
// ============================================================

export interface TaxAdvancesInput {
  /** הכנסה שנתית צפויה (ברוטו - לאחר הוצאות מוכרות) */
  expectedAnnualIncome: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** האם עוסק מורשה (חייב מע"מ) */
  isVatRegistered: boolean;
  /** תדירות התשלום */
  frequency: AdvanceFrequency;
  /** מע"מ עסקאות שנתי משוער (אם עוסק מורשה) */
  annualVatCollected?: number;
  /** מע"מ תשומות שנתי משוער */
  annualVatDeductible?: number;
  /** הפקדה חודשית לפנסיה (₪) - ניכוי מהכנסה חייבת */
  monthlyPensionDeposit?: number;
  /** הפקדה חודשית לקרן השתלמות (₪) - ניכוי מהכנסה חייבת */
  monthlyStudyFundDeposit?: number;
  /** הכנסה בפועל מתחילת השנה (לחישוב תיאום אמצע שנה) */
  actualIncomeYTD?: number;
  /** מקדמות ששולמו בפועל השנה (לחישוב פערים) */
  advancesPaidYTD?: number;
  /** חודש נוכחי (1-12) - לחישוב תיאום אמצע שנה */
  currentMonth?: number;
}

export interface LatePaymentInput {
  /** סכום המקדמה שלא שולם בזמן */
  unpaidAmount: number;
  /** מספר חודשי איחור */
  monthsLate: number;
  /** ריבית פיגורים חודשית (ברירת מחדל 1.5%) */
  monthlyInterestRate?: number;
}

export interface LatePaymentResult {
  /** קרן */
  principal: number;
  /** ריבית מצטברת */
  interest: number;
  /** סך לתשלום */
  total: number;
  /** שיעור ריבית חודשי */
  monthlyRate: number;
  /** שיעור ריבית שנתי */
  annualRate: number;
}

export interface PaymentScheduleEntry {
  /** מספר תשלום */
  paymentNumber: number;
  /** תאריך תשלום (15 לחודש) */
  dueDate: string;
  /** חודשים מכוסים */
  monthsCovered: string;
  /** מס הכנסה */
  incomeTax: number;
  /** ב.ל. + בריאות */
  socialSecurity: number;
  /** מע"מ */
  vat: number;
  /** סה"כ לתשלום */
  total: number;
  /** מה לסייג לחשבון חיסכון לחודש הקודם */
  monthlySetAside: number;
}

export interface ReconciliationEstimate {
  /** מקדמות ששולמו שנתיות */
  totalAdvancesPaid: number;
  /** חבות מס אמיתית (חישוב מדויק) */
  actualTaxLiability: number;
  /** הפרש: + = עוד לשלם, - = החזר */
  difference: number;
  /** האם צפוי החזר */
  isRefund: boolean;
  /** אחוז ניצול מקדמות */
  utilizationRate: number;
}

export interface MidYearAdjustment {
  /** הכנסה מקורית בתכנית */
  originalPlan: number;
  /** הכנסה בפועל YTD */
  actualYTD: number;
  /** הכנסה שנתית מוצפית (מחושב) */
  projectedAnnual: number;
  /** שינוי באחוז */
  changePercent: number;
  /** מקדמה חדשה מומלצת */
  newAdviceAdvance: number;
  /** מקדמה ישנה */
  oldAdvance: number;
  /** שינוי במקדמה */
  advanceDiff: number;
  /** האם מומלץ לדווח על תיאום מקדמות (טופס 1300) */
  shouldAdjust: boolean;
  /** הסבר */
  adjustmentReason: string;
}

export interface CashFlowMonthly {
  month: number;
  monthName: string;
  suggestedSetAside: number;
  cumulativeSetAside: number;
  paymentDue: number | null;
  balanceAfterPayment: number;
}

// ============================================================
// טיפוסי פלט ראשיים
// ============================================================

export interface TaxAdvancesResult {
  /** מס הכנסה שנתי */
  annualIncomeTax: number;
  /** ב.ל. + בריאות שנתי */
  annualSocialSecurity: number;
  /** מע"מ שנתי לתשלום */
  annualVatPayable: number;
  /** ניכויים: פנסיה */
  annualPensionDeduction: number;
  /** ניכויים: קרן השתלמות */
  annualStudyFundDeduction: number;
  /** הכנסה חייבת (אחרי ניכויים) */
  taxableIncome: number;
  /** סך מקדמות שנתי */
  totalAnnual: number;
  /** מקדמה לפי תדירות */
  perPaymentAmount: number;
  /** מספר תשלומים בשנה */
  paymentsPerYear: number;
  /** פירוט פר תשלום */
  perPaymentBreakdown: {
    incomeTax: number;
    socialSecurity: number;
    vat: number;
  };
  /** שיעור מס מצרפי (מס + ב.ל. מהכנסה) */
  effectiveTaxRate: number;
  /** שיעור מס הכנסה בלבד */
  incomeTaxRate: number;
  /** שיעור ביטוח לאומי */
  socialSecurityRate: number;
  /** סכום חודשי להפריש לחשבון חיסכון */
  monthlySetAside: number;
  /** אחוז מומלץ להפריש מהכנסה */
  setAsidePercent: number;
  /** לוח תשלומים שנתי */
  paymentSchedule: PaymentScheduleEntry[];
  /** תזרים מזומנים חודשי */
  cashFlowPlan: CashFlowMonthly[];
  /** תיאום אמצע שנה (אם מסופק actualIncomeYTD) */
  midYearAdjustment: MidYearAdjustment | null;
  /** הערכת גמר שנה (אם מסופק advancesPaidYTD) */
  reconciliationEstimate: ReconciliationEstimate | null;
  /** המלצות */
  recommendations: string[];
}

// ============================================================
// פונקציות חישוב פנימיות
// ============================================================

const MONTH_NAMES = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

function calculateIncomeTax(taxableIncome: number, creditPoints: number): number {
  let remaining = taxableIncome;
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const sz = b.upTo - prev;
    const t = Math.min(remaining, sz);
    tax += t * b.rate;
    remaining -= t;
    prev = b.upTo;
  }
  return Math.max(0, tax - creditPoints * CREDIT_POINT_2026.annual);
}

function calculateSelfEmployedSS(annualIncome: number): number {
  const reducedThreshold = SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedThresholdMonthly * 12;
  const maxThreshold = SOCIAL_SECURITY_SELF_EMPLOYED_2026.maxThresholdMonthly * 12;
  const reducedRate = SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.total;
  const fullRate = SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.total;

  if (annualIncome <= reducedThreshold) return annualIncome * reducedRate;
  if (annualIncome <= maxThreshold)
    return reducedThreshold * reducedRate + (annualIncome - reducedThreshold) * fullRate;
  return reducedThreshold * reducedRate + (maxThreshold - reducedThreshold) * fullRate;
}

/**
 * מחשב ניכוי פנסיה לעצמאי:
 * - עד 11% מהכנסה ניתן לנכות (מקסימום 6,776 ₪/חודש / ~81,312 ₪/שנה)
 * - זיכוי 35% על חלק נוסף
 */
function calculatePensionDeduction(annualIncome: number, annualPension: number): number {
  const maxDeductionPct = 0.11;
  const maxDeduction = annualIncome * maxDeductionPct;
  return Math.min(annualPension, maxDeduction);
}

/**
 * מחשב ניכוי קרן השתלמות לעצמאי:
 * - עד 4.5% מהכנסה (מקסימום ~20,520 ₪/שנה)
 */
function calculateStudyFundDeduction(annualIncome: number, annualStudyFund: number): number {
  const maxDeductionPct = 0.045;
  const maxDeduction = Math.min(annualIncome * maxDeductionPct, 20_520);
  return Math.min(annualStudyFund, maxDeduction);
}

function buildPaymentSchedule(
  annualIncomeTax: number,
  annualSocialSecurity: number,
  annualVatPayable: number,
  frequency: AdvanceFrequency,
  startYear = 2026,
): PaymentScheduleEntry[] {
  const paymentsPerYear = frequency === 'monthly' ? 12 : 6;
  const schedule: PaymentScheduleEntry[] = [];

  for (let i = 0; i < paymentsPerYear; i++) {
    let monthsCovered: string;
    let dueDateMonth: number; // 1-indexed

    if (frequency === 'monthly') {
      // תשלום ב-15 לחודש הבא (למשל: ינואר → 15 בפברואר)
      dueDateMonth = (i + 2) <= 12 ? i + 2 : i + 2 - 12;
      const dueYear = (i + 2) > 12 ? startYear + 1 : startYear;
      monthsCovered = MONTH_NAMES[i];
      schedule.push({
        paymentNumber: i + 1,
        dueDate: `${String(dueDateMonth).padStart(2, '0')}/15/${dueYear}`,
        monthsCovered,
        incomeTax: annualIncomeTax / 12,
        socialSecurity: annualSocialSecurity / 12,
        vat: annualVatPayable / 12,
        total: (annualIncomeTax + annualSocialSecurity + annualVatPayable) / 12,
        monthlySetAside: (annualIncomeTax + annualSocialSecurity + annualVatPayable) / 12,
      });
    } else {
      // דו-חודשי: ינואר-פברואר, מרץ-אפריל, ...
      const firstMonth = i * 2; // 0-indexed
      const secondMonth = firstMonth + 1;
      dueDateMonth = secondMonth + 2; // 1-indexed, 15 לחודש שאחרי
      const dueYear = dueDateMonth > 12 ? startYear + 1 : startYear;
      if (dueDateMonth > 12) dueDateMonth -= 12;
      monthsCovered = `${MONTH_NAMES[firstMonth]}-${MONTH_NAMES[secondMonth]}`;
      schedule.push({
        paymentNumber: i + 1,
        dueDate: `${String(dueDateMonth).padStart(2, '0')}/15/${dueYear}`,
        monthsCovered,
        incomeTax: annualIncomeTax / 6,
        socialSecurity: annualSocialSecurity / 6,
        vat: annualVatPayable / 6,
        total: (annualIncomeTax + annualSocialSecurity + annualVatPayable) / 6,
        monthlySetAside: (annualIncomeTax + annualSocialSecurity + annualVatPayable) / 12,
      });
    }
  }

  return schedule;
}

function buildCashFlowPlan(
  totalAnnual: number,
  annualVatPayable: number,
  frequency: AdvanceFrequency,
): CashFlowMonthly[] {
  const monthlySave = totalAnnual / 12;
  const paymentsPerYear = frequency === 'monthly' ? 12 : 6;
  const paymentAmount = totalAnnual / paymentsPerYear;

  // חישוב תשלומים לפי חודשים (0-indexed)
  const paymentMonths = new Set<number>();
  if (frequency === 'monthly') {
    for (let m = 1; m < 13; m++) paymentMonths.add(m); // חודש 1-12 (תשלום ב-15)
  } else {
    // דו-חודשי: תשלום ב-15 לחודש 3, 5, 7, 9, 11, 13 (ינואר)
    // כלומר: 15 למרץ, מאי, יולי, ספטמבר, נובמבר, ינואר (שנה הבאה)
    [3, 5, 7, 9, 11, 13].forEach((m) => paymentMonths.add(m > 12 ? 1 : m));
  }

  const plan: CashFlowMonthly[] = [];
  let cumulative = 0;

  for (let m = 1; m <= 12; m++) {
    cumulative += monthlySave;
    const paymentDue = paymentMonths.has(m) ? paymentAmount : null;
    const balanceAfterPayment = paymentDue !== null ? cumulative - paymentDue : cumulative;

    plan.push({
      month: m,
      monthName: MONTH_NAMES[m - 1],
      suggestedSetAside: monthlySave,
      cumulativeSetAside: cumulative,
      paymentDue,
      balanceAfterPayment,
    });
  }

  return plan;
}

// ============================================================
// פונקציות ציבוריות
// ============================================================

/**
 * חישוב ריבית פיגורים על מקדמה שלא שולמה בזמן
 * שיעור ריבית: ~1.5%/חודש (ריבית עוגן + 2%)
 */
export function calculateLatePayment(input: LatePaymentInput): LatePaymentResult {
  const rate = input.monthlyInterestRate ?? 0.015;
  const interest = input.unpaidAmount * rate * input.monthsLate;
  return {
    principal: input.unpaidAmount,
    interest,
    total: input.unpaidAmount + interest,
    monthlyRate: rate,
    annualRate: (1 + rate) ** 12 - 1,
  };
}

/**
 * הגדרת לוח תשלומים לשנה
 */
export function calculatePaymentSchedule(
  annualIncomeTax: number,
  annualSocialSecurity: number,
  annualVatPayable: number,
  frequency: AdvanceFrequency,
): PaymentScheduleEntry[] {
  return buildPaymentSchedule(annualIncomeTax, annualSocialSecurity, annualVatPayable, frequency);
}

/**
 * הערכת גמר שנה: כמה יש להחזיר / לקבל
 */
export function estimateReconciliation(
  advancesPaid: number,
  actualTaxLiability: number,
): ReconciliationEstimate {
  const difference = actualTaxLiability - advancesPaid;
  const utilizationRate = advancesPaid > 0 ? advancesPaid / actualTaxLiability : 0;
  return {
    totalAdvancesPaid: advancesPaid,
    actualTaxLiability,
    difference,
    isRefund: difference < 0,
    utilizationRate,
  };
}

/**
 * חישוב עיקרי - כל רכיבי המקדמה + תכנון תזרים
 */
export function calculateTaxAdvances(input: TaxAdvancesInput): TaxAdvancesResult {
  const income = Math.max(0, input.expectedAnnualIncome);
  const annualPension = (input.monthlyPensionDeposit ?? 0) * 12;
  const annualStudyFund = (input.monthlyStudyFundDeposit ?? 0) * 12;

  // ניכויים
  const pensionDeduction = calculatePensionDeduction(income, annualPension);
  const studyFundDeduction = calculateStudyFundDeduction(income, annualStudyFund);

  // ניכוי 52% מביטוח לאומי (ישירות מהכנסה החייבת)
  // נחשב תחילה ב.ל. על ההכנסה הגולמית, ואז מנכים 52% ממנו
  const ssOnFullIncome = calculateSelfEmployedSS(income);
  const bituachLeumiDeduction = ssOnFullIncome * 0.52;

  const taxableIncome = Math.max(
    0,
    income - pensionDeduction - studyFundDeduction - bituachLeumiDeduction,
  );

  // 1. מס הכנסה (על הכנסה חייבת אחרי ניכויים)
  const annualIncomeTax = calculateIncomeTax(taxableIncome, input.creditPoints);

  // 2. ביטוח לאומי (על הכנסה הגולמית)
  const annualSocialSecurity = ssOnFullIncome;

  // 3. מע"מ
  let annualVatPayable = 0;
  if (input.isVatRegistered) {
    const vatCollected = input.annualVatCollected ?? 0;
    const vatDeductible = input.annualVatDeductible ?? 0;
    annualVatPayable = Math.max(0, vatCollected - vatDeductible);
  }

  const totalAnnual = annualIncomeTax + annualSocialSecurity + annualVatPayable;
  const totalWithoutVat = annualIncomeTax + annualSocialSecurity;

  // תשלום לפי תדירות
  const paymentsPerYear = input.frequency === 'monthly' ? 12 : 6;
  const perPaymentAmount = totalAnnual / paymentsPerYear;

  const perPaymentBreakdown = {
    incomeTax: annualIncomeTax / paymentsPerYear,
    socialSecurity: annualSocialSecurity / paymentsPerYear,
    vat: annualVatPayable / paymentsPerYear,
  };

  const effectiveTaxRate = income > 0 ? totalWithoutVat / income : 0;
  const incomeTaxRate = income > 0 ? annualIncomeTax / income : 0;
  const socialSecurityRate = income > 0 ? annualSocialSecurity / income : 0;

  // סכום חודשי להפריש
  const monthlySetAside = totalAnnual / 12;
  const setAsidePercent = income > 0 ? monthlySetAside / (income / 12) : 0;

  // לוח תשלומים
  const paymentSchedule = buildPaymentSchedule(
    annualIncomeTax,
    annualSocialSecurity,
    annualVatPayable,
    input.frequency,
  );

  // תזרים חודשי
  const cashFlowPlan = buildCashFlowPlan(totalAnnual, annualVatPayable, input.frequency);

  // תיאום אמצע שנה
  let midYearAdjustment: MidYearAdjustment | null = null;
  if (
    input.actualIncomeYTD !== undefined &&
    input.actualIncomeYTD > 0 &&
    input.currentMonth &&
    input.currentMonth >= 1 &&
    input.currentMonth <= 12
  ) {
    const monthsElapsed = input.currentMonth;
    const projectedAnnual = (input.actualIncomeYTD / monthsElapsed) * 12;
    const changePercent = income > 0 ? (projectedAnnual - income) / income : 0;

    // חישוב מקדמה חדשה
    const newPensionDeduction = calculatePensionDeduction(projectedAnnual, annualPension);
    const newStudyFundDeduction = calculateStudyFundDeduction(projectedAnnual, annualStudyFund);
    const newSS = calculateSelfEmployedSS(projectedAnnual);
    const newBituachLeumiDed = newSS * 0.52;
    const newTaxable = Math.max(
      0,
      projectedAnnual - newPensionDeduction - newStudyFundDeduction - newBituachLeumiDed,
    );
    const newIncomeTax = calculateIncomeTax(newTaxable, input.creditPoints);
    const newTotal = newIncomeTax + newSS + annualVatPayable;
    const newAdviceAdvance = newTotal / paymentsPerYear;
    const advanceDiff = newAdviceAdvance - perPaymentAmount;

    // מומלץ לדווח אם הפרש > 15% או > 5,000 ₪
    const shouldAdjust = Math.abs(changePercent) > 0.15 || Math.abs(advanceDiff) * paymentsPerYear > 5_000;

    let adjustmentReason = '';
    if (changePercent > 0.15) {
      adjustmentReason = `ההכנסה גבוהה ב-${(changePercent * 100).toFixed(0)}% מהתכנית - הגדל מקדמות למניעת חיוב גדול בגמר שנה`;
    } else if (changePercent < -0.15) {
      adjustmentReason = `ההכנסה נמוכה ב-${(Math.abs(changePercent) * 100).toFixed(0)}% מהתכנית - הקטן מקדמות לשיפור תזרים`;
    } else {
      adjustmentReason = 'ההכנסה קרובה לתכנית - אין צורך בתיאום דחוף';
    }

    midYearAdjustment = {
      originalPlan: income,
      actualYTD: input.actualIncomeYTD,
      projectedAnnual,
      changePercent,
      newAdviceAdvance,
      oldAdvance: perPaymentAmount,
      advanceDiff,
      shouldAdjust,
      adjustmentReason,
    };
  }

  // הערכת גמר שנה
  let reconciliationEstimate: ReconciliationEstimate | null = null;
  if (input.advancesPaidYTD !== undefined && input.advancesPaidYTD > 0) {
    reconciliationEstimate = estimateReconciliation(
      input.advancesPaidYTD,
      totalWithoutVat, // גמר שנה = מס + ב.ל. (לא מע"מ - נסגר בנפרד)
    );
  }

  // המלצות
  const recommendations: string[] = [];

  if (effectiveTaxRate > 0.40) {
    recommendations.push(
      'שיעור מס גבוה מ-40% - שקול הקמת חברה בע"מ. ראה את המחשבון "חברה vs עוסק".',
    );
  }

  if (income > 0 && setAsidePercent < 0.25) {
    recommendations.push(
      `הפרש ${(setAsidePercent * 100).toFixed(0)}% בלבד - כדאי להפריש לפחות 30% מכל הכנסה לחשבון נפרד`,
    );
  }

  if (annualPension === 0 && income > 50_000) {
    recommendations.push(
      'אין הפקדה לפנסיה - הפקד לפחות 11% מהכנסה לחיסכון פנסיוני + ניכוי מס',
    );
  }

  if (annualStudyFund === 0 && income > 80_000) {
    recommendations.push(
      'אין קרן השתלמות - הפקד עד 20,520 ₪/שנה לניכוי מס + פטור עתידי',
    );
  }

  if (input.isVatRegistered && annualVatPayable > 50_000) {
    recommendations.push(
      'מע"מ גבוה - בדוק שכל מע"מ התשומות מתועד ומקוזז (הוצאות עסקיות)',
    );
  }

  if (input.frequency === 'bimonthly' && totalAnnual > 60_000) {
    recommendations.push(
      'מקדמה דו-חודשית גבוהה - שקול לעבור לחודשי כדי לפזר את התזרים',
    );
  }

  if (income > VAT_2026.smallBusinessThreshold && !input.isVatRegistered) {
    recommendations.push(
      `מחזור מעל ${VAT_2026.smallBusinessThreshold.toLocaleString('he-IL')} ₪ - חובה להיות עוסק מורשה ולגבות מע"מ`,
    );
  }

  recommendations.push(
    `הפרש ${(setAsidePercent * 100).toFixed(0)}% מחודשי להפרשה: ${Math.round(monthlySetAside).toLocaleString('he-IL')} ₪/חודש`,
  );

  return {
    annualIncomeTax,
    annualSocialSecurity,
    annualVatPayable,
    annualPensionDeduction: pensionDeduction,
    annualStudyFundDeduction: studyFundDeduction,
    taxableIncome,
    totalAnnual,
    perPaymentAmount,
    paymentsPerYear,
    perPaymentBreakdown,
    effectiveTaxRate,
    incomeTaxRate,
    socialSecurityRate,
    monthlySetAside,
    setAsidePercent,
    paymentSchedule,
    cashFlowPlan,
    midYearAdjustment,
    reconciliationEstimate,
    recommendations,
  };
}
