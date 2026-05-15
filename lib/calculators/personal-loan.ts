/**
 * מחשבון הלוואה אישית - 2026
 *
 * כולל:
 * - חישוב PMT (שפיצר)
 * - APR אמיתי עם עמלות
 * - השוואת מקורות הלוואה ישראליים
 * - אסטרטגיית Snowball / Avalanche לסילוק חובות
 * - השוואה: כרטיס אשראי מול הלוואה אישית
 * - בדיקת כושר החזר (DTI)
 * - לוח סילוקין מלא
 */

// ============================================================
// Types
// ============================================================

export interface PersonalLoanInput {
  /** סכום ההלוואה (₪) */
  loanAmount: number;
  /** ריבית שנתית (%) */
  annualInterestRate: number;
  /** מספר חודשי ההלוואה */
  termMonths: number;
  /** עמלת פתיחת תיק (₪) */
  openingFee?: number;
  /** עמלת פירעון מוקדם (₪) - לשימוש עתידי */
  prepaymentFee?: number;
}

export interface PersonalLoanResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalCostWithFees: number;
  effectiveAnnualRate: number;
  amortizationSummary: {
    interestFirstYear: number;
    principalFirstYear: number;
    remainingBalance12Months: number;
  };
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface APRInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  openingFee?: number;
  monthlyServiceFee?: number;
  mandatoryInsurance?: number;
  otherFees?: number;
}

export interface APRResult {
  statedAPR: number;
  trueAPR: number;
  statedMonthlyPayment: number;
  trueMonthlyPayment: number;
  totalFees: number;
  totalCostWithFees: number;
  feeBreakdown: {
    openingFee: number;
    monthlyServiceFeeTotal: number;
    mandatoryInsuranceTotal: number;
    otherFees: number;
  };
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  annualRate: number;
  minimumPayment: number;
}

export interface DebtPayoffResult {
  strategy: 'snowball' | 'avalanche';
  totalMonths: number;
  totalInterest: number;
  payoffOrder: Array<{
    id: string;
    name: string;
    payoffMonth: number;
    interestPaid: number;
  }>;
  monthlySummary: Array<{
    month: number;
    totalBalance: number;
    totalInterestThisMonth: number;
  }>;
}

export interface DebtPayoffComparison {
  snowball: DebtPayoffResult;
  avalanche: DebtPayoffResult;
  avalancheSaves: number; // ₪ avalanche saves vs snowball
  snowballSaves: number; // months (psychological benefit)
}

export interface LoanSourceOption {
  id: string;
  nameHe: string;
  nameEn: string;
  typicalRateMin: number;
  typicalRateMax: number;
  maxAmount: number;
  tipHe: string;
  pros: string[];
  cons: string[];
}

export interface CreditCardVsLoanInput {
  debtAmount: number;
  creditCardRate: number; // % annual
  personalLoanRate: number; // % annual
  termMonths: number;
  personalLoanOpeningFee?: number;
}

export interface CreditCardVsLoanResult {
  creditCard: {
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
  };
  personalLoan: {
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
    totalCostWithFees: number;
  };
  savingsByLoan: number;
  savingsPct: number;
  recommendation: string;
  breakEvenMonths: number;
}

export interface AffordabilityInput {
  monthlyNetIncome: number;
  existingObligations: number;
  requestedMonthlyPayment: number;
}

export interface AffordabilityResult {
  dtiRatio: number;
  totalObligationsWithLoan: number;
  disposableAfterLoan: number;
  maxRecommendedPayment: number;
  status: 'excellent' | 'good' | 'warning' | 'danger';
  statusLabel: string;
  recommendation: string;
}

// ============================================================
// Constants - Israeli Loan Sources 2026
// ============================================================

export const ISRAELI_LOAN_SOURCES_2026: LoanSourceOption[] = [
  {
    id: 'study-fund',
    nameHe: 'הלוואה מקרן השתלמות',
    nameEn: 'Study Fund Loan',
    typicalRateMin: 1.5,
    typicalRateMax: 4.5,
    maxAmount: 70, // % מהצבירה
    tipHe: 'הזולה ביותר! עד 70% מהצבירה, ריבית פריים מינוס. דרישה: קרן השתלמות נזילה.',
    pros: [
      'ריבית נמוכה מאוד (פריים ±)',
      'אין צורך בביטחונות נוספים',
      'אישור מהיר',
      'לא פוגע בדירוג אשראי',
    ],
    cons: [
      'רק למי שיש קרן השתלמות נזילה',
      'מוגבל ל-70% מהצבירה',
      'מפחית את הצבירה לפנסיה',
    ],
  },
  {
    id: 'bank',
    nameHe: 'הלוואה בנקאית',
    nameEn: 'Bank Loan',
    typicalRateMin: 5,
    typicalRateMax: 10,
    maxAmount: 300000,
    tipHe: 'אופציה בטוחה ומפוקחת. ריבית תלויה בדירוג אשראי. כדאי להשוות 3+ בנקים.',
    pros: ['מפוקח על ידי בנק ישראל', 'ריביות תחרותיות לבעלי דירוג טוב', 'גמישות בתנאים'],
    cons: [
      'דרוש דירוג אשראי טוב',
      'בירוקרטיה ותהליך אישור',
      'עמלת פתיחת תיק 300-800 ₪',
    ],
  },
  {
    id: 'pension-fund',
    nameHe: 'הלוואה מקרן פנסיה',
    nameEn: 'Pension Fund Loan',
    typicalRateMin: 3,
    typicalRateMax: 6,
    maxAmount: 30, // % מהצבירה
    tipHe: 'זול יחסית, אך מוגבל ל-30% מהצבירה. ריבית הצמדה + 2-4%.',
    pros: ['ריבית נמוכה יחסית', 'אין בדיקת אשראי', 'מהיר'],
    cons: ['מוגבל ל-30% מהצבירה', 'פוגע בצבירה הפנסיונית', 'לא כולם זכאים'],
  },
  {
    id: 'online-lender',
    nameHe: 'חברות אשראי חוץ-בנקאיות',
    nameEn: 'Online Lenders (Trigon, KPB etc.)',
    typicalRateMin: 8,
    typicalRateMax: 18,
    maxAmount: 150000,
    tipHe: 'Trigon, KPB, One Zero: מהירות אבל ריבית גבוהה יותר. מתאים לדחיפות בלבד.',
    pros: ['אישור מהיר (שעות)', 'פחות בירוקרטיה', 'גם לדירוג אשראי בינוני'],
    cons: [
      'ריבית גבוהה יחסית לבנקים',
      'פחות גמישות',
      'לא תמיד מפוקחות כמו בנקים',
    ],
  },
  {
    id: 'credit-card-advance',
    nameHe: 'מזומן מכרטיס אשראי',
    nameEn: 'Credit Card Cash Advance',
    typicalRateMin: 14,
    typicalRateMax: 22,
    maxAmount: 50000,
    tipHe: 'האופציה היקרה ביותר! ריבית 14-22%. להשתמש רק בחירום קצר-מועד.',
    pros: ['מיידי ללא אישור נוסף', 'זמין 24/7'],
    cons: ['ריבית גבוהה מאוד', 'עמלת מזומן נוספת', 'גדל המינוס במהירות'],
  },
  {
    id: 'family-loan',
    nameHe: 'הלוואה ממשפחה / חברים',
    nameEn: 'Family / Friends Loan',
    typicalRateMin: 0,
    typicalRateMax: 3,
    maxAmount: 999999,
    tipHe: 'ריבית אפס אפשרית, אך יש לתעד בכתב לפי חוק. שימו לב להשלכות על מערכת היחסים.',
    pros: [
      'ריבית נמוכה מאוד/אפס',
      'גמישות בתנאים',
      'ללא עמלות',
    ],
    cons: [
      'עלול לפגוע במערכת יחסים',
      'חובה לתעד בחוזה',
      'צריך מקור כזה',
    ],
  },
];

// ============================================================
// Core PMT Calculation (backward compat)
// ============================================================

export function calculatePersonalLoan(input: PersonalLoanInput): PersonalLoanResult {
  const P = Math.max(0, input.loanAmount);
  const r = input.annualInterestRate / 100 / 12;
  const n = Math.max(1, input.termMonths);
  const openingFee = input.openingFee ?? 0;
  const prepaymentFee = input.prepaymentFee ?? 0;

  let monthlyPayment: number;
  if (r === 0) {
    monthlyPayment = P / n;
  } else {
    monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayments = monthlyPayment * n;
  const totalInterest = totalPayments - P;
  const totalCostWithFees = totalPayments + openingFee + prepaymentFee;

  // First year amortization summary
  let balance = P;
  let interestYear1 = 0;
  let principalYear1 = 0;
  for (let m = 1; m <= Math.min(12, n); m++) {
    const interestThisMonth = balance * r;
    const principalThisMonth = monthlyPayment - interestThisMonth;
    interestYear1 += interestThisMonth;
    principalYear1 += principalThisMonth;
    balance -= principalThisMonth;
  }

  // Effective annual rate including fees
  const effectiveAnnualRate =
    P > 0 ? (Math.pow(totalCostWithFees / P, 12 / n) - 1) * 100 : 0;

  return {
    monthlyPayment,
    totalPayments,
    totalInterest,
    totalCostWithFees,
    effectiveAnnualRate,
    amortizationSummary: {
      interestFirstYear: interestYear1,
      principalFirstYear: principalYear1,
      remainingBalance12Months: Math.max(0, balance),
    },
  };
}

// ============================================================
// Amortization Schedule
// ============================================================

export function calculateAmortizationSchedulePersonalLoan(params: {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
}): AmortizationRow[] {
  const { loanAmount, annualRate, termMonths } = params;
  if (loanAmount <= 0 || termMonths <= 0) return [];

  const r = annualRate / 100 / 12;
  const n = termMonths;

  const monthlyPayment =
    r === 0 ? loanAmount / n : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const rows: AmortizationRow[] = [];
  let balance = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const principal = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(0, balance - principal);
    cumulativeInterest += interest;
    cumulativePrincipal += principal;

    rows.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      balance,
      cumulativeInterest,
      cumulativePrincipal,
    });
  }

  return rows;
}

// ============================================================
// True APR Calculation
// ============================================================

export function calculateTrueAPR(input: APRInput): APRResult {
  const { loanAmount, annualRate, termMonths } = input;
  const openingFee = input.openingFee ?? 0;
  const monthlyServiceFee = input.monthlyServiceFee ?? 0;
  const mandatoryInsurance = input.mandatoryInsurance ?? 0;
  const otherFees = input.otherFees ?? 0;

  const r = annualRate / 100 / 12;
  const n = termMonths;

  const statedMonthlyPayment =
    r === 0
      ? loanAmount / n
      : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const monthlyFees = monthlyServiceFee + mandatoryInsurance;
  const totalMonthlyFees = monthlyFees * n;
  const totalFees = openingFee + totalMonthlyFees + otherFees;

  const trueMonthlyPayment = statedMonthlyPayment + monthlyFees;
  const totalCostWithFees = statedMonthlyPayment * n + totalFees;

  // True APR via Newton-Raphson on the effective loan amount
  // effectiveLoan = loanAmount - openingFee - otherFees (fees paid upfront)
  // monthly cash flow = trueMonthlyPayment
  const effectivePrincipal = loanAmount - openingFee - otherFees;

  // Solve for monthly rate that discounts trueMonthlyPayment stream to effectivePrincipal
  let trueAPR = annualRate;
  if (effectivePrincipal > 0 && trueMonthlyPayment > 0) {
    let rGuess = annualRate / 100 / 12;
    for (let iter = 0; iter < 100; iter++) {
      const factor = Math.pow(1 + rGuess, n);
      const pv = (trueMonthlyPayment * (factor - 1)) / (rGuess * factor);
      const pvDeriv =
        (trueMonthlyPayment / rGuess) *
        ((n * Math.pow(1 + rGuess, n - 1) * rGuess * factor -
          (factor - 1) * (factor + n * rGuess * Math.pow(1 + rGuess, n - 1))) /
          (rGuess * factor * factor));
      const diff = pv - effectivePrincipal;
      if (Math.abs(diff) < 0.01) break;
      rGuess = rGuess - diff / (pvDeriv || 1);
      rGuess = Math.max(0.00001, Math.min(rGuess, 1)); // clamp
    }
    trueAPR = rGuess * 12 * 100;
  }

  return {
    statedAPR: annualRate,
    trueAPR,
    statedMonthlyPayment,
    trueMonthlyPayment,
    totalFees,
    totalCostWithFees,
    feeBreakdown: {
      openingFee,
      monthlyServiceFeeTotal: monthlyServiceFee * n,
      mandatoryInsuranceTotal: mandatoryInsurance * n,
      otherFees,
    },
  };
}

// ============================================================
// Snowball / Avalanche Debt Payoff
// ============================================================

function runDebtPayoff(
  debts: DebtItem[],
  strategy: 'snowball' | 'avalanche',
  extraMonthlyPayment: number,
): DebtPayoffResult {
  if (debts.length === 0) {
    return {
      strategy,
      totalMonths: 0,
      totalInterest: 0,
      payoffOrder: [],
      monthlySummary: [],
    };
  }

  // Deep copy
  const remaining = debts.map((d) => ({
    ...d,
    balance: d.balance,
    paid: 0,
    interestPaid: 0,
    payoffMonth: 0,
  }));

  let month = 0;
  const payoffOrder: DebtPayoffResult['payoffOrder'] = [];
  const monthlySummary: DebtPayoffResult['monthlySummary'] = [];
  const MAX_MONTHS = 600;
  let totalInterest = 0;
  let extra = extraMonthlyPayment;

  while (remaining.some((d) => d.balance > 0.01) && month < MAX_MONTHS) {
    month++;

    // Accrue interest on all active debts
    for (const d of remaining) {
      if (d.balance > 0) {
        const monthlyInterest = d.balance * (d.annualRate / 100 / 12);
        d.balance += monthlyInterest;
        d.interestPaid += monthlyInterest;
        totalInterest += monthlyInterest;
      }
    }

    // Apply minimum payments
    let availableExtra = extra;
    for (const d of remaining) {
      if (d.balance > 0) {
        const payment = Math.min(d.minimumPayment, d.balance);
        d.balance = Math.max(0, d.balance - payment);
      }
    }

    // Determine focus debt (snowball = smallest balance, avalanche = highest rate)
    const active = remaining.filter((d) => d.balance > 0.01);
    if (active.length > 0) {
      const focus =
        strategy === 'snowball'
          ? active.reduce((min, d) => (d.balance < min.balance ? d : min))
          : active.reduce((max, d) => (d.annualRate > max.annualRate ? d : max));

      const extraPayment = Math.min(availableExtra, focus.balance);
      focus.balance = Math.max(0, focus.balance - extraPayment);
    }

    // Check for payoffs
    for (const d of remaining) {
      if (d.balance <= 0.01 && d.payoffMonth === 0) {
        d.balance = 0;
        d.payoffMonth = month;
        payoffOrder.push({
          id: d.id,
          name: d.name,
          payoffMonth: month,
          interestPaid: Math.round(d.interestPaid * 100) / 100,
        });
        // Freed minimum payment goes to next focus
        extra += d.minimumPayment;
      }
    }

    const totalBalance = remaining.reduce((sum, d) => sum + d.balance, 0);
    const totalInterestThisMonth = remaining.reduce(
      (sum, d) => sum + d.balance * (d.annualRate / 100 / 12),
      0,
    );

    monthlySummary.push({
      month,
      totalBalance: Math.round(totalBalance),
      totalInterestThisMonth: Math.round(totalInterestThisMonth),
    });

    if (totalBalance < 0.01) break;
  }

  return {
    strategy,
    totalMonths: month,
    totalInterest: Math.round(totalInterest),
    payoffOrder,
    monthlySummary,
  };
}

export function calculateSnowball(
  debts: DebtItem[],
  extraMonthlyPayment: number = 0,
): DebtPayoffResult {
  return runDebtPayoff(debts, 'snowball', extraMonthlyPayment);
}

export function calculateAvalanche(
  debts: DebtItem[],
  extraMonthlyPayment: number = 0,
): DebtPayoffResult {
  return runDebtPayoff(debts, 'avalanche', extraMonthlyPayment);
}

export function compareDebtStrategies(
  debts: DebtItem[],
  extraMonthlyPayment: number = 0,
): DebtPayoffComparison {
  const snowball = calculateSnowball(debts, extraMonthlyPayment);
  const avalanche = calculateAvalanche(debts, extraMonthlyPayment);

  const avalancheSaves = Math.max(0, snowball.totalInterest - avalanche.totalInterest);
  const snowballSaves = Math.max(0, avalanche.totalMonths - snowball.totalMonths);

  return { snowball, avalanche, avalancheSaves, snowballSaves };
}

// ============================================================
// Credit Card vs Personal Loan
// ============================================================

export function compareCreditCardVsLoan(input: CreditCardVsLoanInput): CreditCardVsLoanResult {
  const { debtAmount, creditCardRate, personalLoanRate, termMonths } = input;
  const openingFee = input.personalLoanOpeningFee ?? 0;

  if (debtAmount <= 0) {
    return {
      creditCard: { monthlyPayment: 0, totalPayments: 0, totalInterest: 0 },
      personalLoan: { monthlyPayment: 0, totalPayments: 0, totalInterest: 0, totalCostWithFees: 0 },
      savingsByLoan: 0,
      savingsPct: 0,
      recommendation: 'הכנס סכום חוב תקין',
      breakEvenMonths: 0,
    };
  }

  // Credit card as installment loan at card rate
  const rCC = creditCardRate / 100 / 12;
  const n = termMonths;
  const ccMonthlyPayment =
    rCC === 0 ? debtAmount / n : (debtAmount * rCC * Math.pow(1 + rCC, n)) / (Math.pow(1 + rCC, n) - 1);
  const ccTotalPayments = ccMonthlyPayment * n;
  const ccTotalInterest = ccTotalPayments - debtAmount;

  // Personal loan
  const rPL = personalLoanRate / 100 / 12;
  const plMonthlyPayment =
    rPL === 0 ? debtAmount / n : (debtAmount * rPL * Math.pow(1 + rPL, n)) / (Math.pow(1 + rPL, n) - 1);
  const plTotalPayments = plMonthlyPayment * n;
  const plTotalInterest = plTotalPayments - debtAmount;
  const plTotalCostWithFees = plTotalPayments + openingFee;

  const savingsByLoan = Math.max(0, ccTotalPayments - plTotalCostWithFees);
  const savingsPct = ccTotalPayments > 0 ? (savingsByLoan / ccTotalPayments) * 100 : 0;

  // Break-even: how many months to recover the opening fee through monthly savings
  const monthlySaving = ccMonthlyPayment - plMonthlyPayment;
  const breakEvenMonths =
    monthlySaving > 0 && openingFee > 0 ? Math.ceil(openingFee / monthlySaving) : 0;

  let recommendation: string;
  if (savingsByLoan > 0) {
    recommendation = `ההלוואה האישית חוסכת לך ${Math.round(savingsByLoan).toLocaleString('he-IL')} ₪ לעומת כרטיס האשראי. מומלץ לבצע מחזור חוב.`;
    if (openingFee > 0 && breakEvenMonths > 0) {
      recommendation += ` נקודת האיזון על העמלה: חודש ${breakEvenMonths}.`;
    }
  } else {
    recommendation = `במקרה זה, כרטיס האשראי זול יותר - אולי הריבית על ההלוואה גבוהה מדי.`;
  }

  return {
    creditCard: {
      monthlyPayment: ccMonthlyPayment,
      totalPayments: ccTotalPayments,
      totalInterest: ccTotalInterest,
    },
    personalLoan: {
      monthlyPayment: plMonthlyPayment,
      totalPayments: plTotalPayments,
      totalInterest: plTotalInterest,
      totalCostWithFees: plTotalCostWithFees,
    },
    savingsByLoan,
    savingsPct,
    recommendation,
    breakEvenMonths,
  };
}

// ============================================================
// Loan Sources Comparison
// ============================================================

export interface LoanSourceComparison {
  source: LoanSourceOption;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  isAvailable: boolean; // for display purposes
}

export function compareLoanSources(
  loanAmount: number,
  termMonths: number,
): LoanSourceComparison[] {
  return ISRAELI_LOAN_SOURCES_2026.map((source) => {
    const avgRate = (source.typicalRateMin + source.typicalRateMax) / 2;
    const r = avgRate / 100 / 12;
    const n = termMonths;
    const monthly =
      r === 0
        ? loanAmount / n
        : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayments = monthly * n;
    const totalInterest = totalPayments - loanAmount;
    const isAvailable = source.maxAmount >= loanAmount || source.id === 'family-loan';

    return {
      source,
      monthlyPayment: monthly,
      totalInterest,
      totalCost: totalPayments,
      isAvailable,
    };
  }).sort((a, b) => a.totalInterest - b.totalInterest);
}

// ============================================================
// Affordability Check
// ============================================================

export function calculateAffordabilityPersonalLoan(input: AffordabilityInput): AffordabilityResult {
  const { monthlyNetIncome, existingObligations, requestedMonthlyPayment } = input;

  const totalObligationsWithLoan = existingObligations + requestedMonthlyPayment;
  const dtiRatio =
    monthlyNetIncome > 0 ? (totalObligationsWithLoan / monthlyNetIncome) * 100 : 0;
  const disposableAfterLoan = monthlyNetIncome - totalObligationsWithLoan;
  const maxRecommendedPayment = Math.max(
    0,
    monthlyNetIncome * 0.35 - existingObligations,
  );

  let status: AffordabilityResult['status'];
  let statusLabel: string;
  let recommendation: string;

  if (dtiRatio <= 25) {
    status = 'excellent';
    statusLabel = 'מצוין - כושר החזר טוב מאוד';
    recommendation = `יחס החוב להכנסה שלך הוא ${dtiRatio.toFixed(1)}% - נמוך מאוד. ההלוואה בהחלט מתאימה.`;
  } else if (dtiRatio <= 35) {
    status = 'good';
    statusLabel = 'טוב - כושר החזר סביר';
    recommendation = `יחס החוב להכנסה שלך הוא ${dtiRatio.toFixed(1)}%. ההלוואה אפשרית, אך שמור על מרווח לחירום.`;
  } else if (dtiRatio <= 50) {
    status = 'warning';
    statusLabel = 'אזהרה - עומס פיננסי גבוה';
    recommendation = `יחס החוב להכנסה שלך הוא ${dtiRatio.toFixed(1)}%. שקול לקצר את ההלוואה, להגדיל הכנסה, או לצמצם התחייבויות. תשלום מקסימלי מומלץ: ${Math.round(maxRecommendedPayment).toLocaleString('he-IL')} ₪.`;
  } else {
    status = 'danger';
    statusLabel = 'סכנה - עומס חוב קריטי';
    recommendation = `יחס החוב להכנסה שלך הוא ${dtiRatio.toFixed(1)}% - גבוה מדי! בנקים דוחים בד"כ מעל 50%. שקול ייעוץ פיננסי.`;
  }

  return {
    dtiRatio,
    totalObligationsWithLoan,
    disposableAfterLoan,
    maxRecommendedPayment,
    status,
    statusLabel,
    recommendation,
  };
}

// ============================================================
// Helper: getLoanSourceRecommendation
// ============================================================

export function getLoanSourceRecommendation(rate: number): string {
  if (rate >= 14) {
    return 'ריבית גבוהה מאוד! בדוק האם יש לך קרן השתלמות נזילה - הלוואה ממנה תחסוך לך אלפי שקלים.';
  }
  if (rate >= 10) {
    return 'שקול לפנות לבנק לקבל הצעה. הלוואת קרן השתלמות תהיה בד"כ 50-70% זולה יותר.';
  }
  if (rate >= 7) {
    return 'ריבית סבירה. השווה 2-3 בנקים נוספים לפני חתימה.';
  }
  return 'ריבית תחרותית. וודא ריבית אפקטיבית (APR) כולל כל העמלות לפני חתימה.';
}
