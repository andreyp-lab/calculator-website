/**
 * מחשבוני חיסכון וחובות
 *
 * 1. תקציב משפחתי
 * 2. החזרי הלוואה
 */

// ============================================================
// 1. FAMILY BUDGET CALCULATOR
// ============================================================

export interface FamilyBudgetInput {
  // הכנסות
  primaryIncome: number; // הכנסה ראשונית נטו (אחד מבני הזוג)
  secondaryIncome: number; // הכנסה משנית נטו
  additionalIncome: number; // הכנסות נוספות (שכ"ד, אחר)

  // הוצאות קבועות
  housing: number; // משכנתא/שכ"ד
  utilities: number; // חשמל, מים, גז, אינטרנט
  insurance: number; // ביטוחים (חיים, רכב, דירה)

  // הוצאות משתנות
  food: number; // אוכל וקניות
  transportation: number; // דלק/תחבורה
  education: number; // חינוך, חוגים
  healthcare: number; // בריאות, רופאים
  entertainment: number; // בילויים, חופשות
  other: number; // אחר

  // חיסכון והשקעות
  savings: number; // חיסכון חודשי
  pension: number; // הפרשה לפנסיה
}

export interface FamilyBudgetResult {
  totalIncome: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  totalSavings: number;
  totalExpenses: number;
  netCashFlow: number; // הכנסות - הוצאות
  savingsRate: number; // % מהכנסות שנחסך
  status: 'excellent' | 'good' | 'warning' | 'danger';
  // חלוקה ל-50/30/20 rule
  rule503020: {
    needs: { actual: number; recommended: number; pct: number };
    wants: { actual: number; recommended: number; pct: number };
    savings: { actual: number; recommended: number; pct: number };
  };
}

export function calculateFamilyBudget(input: FamilyBudgetInput): FamilyBudgetResult {
  const totalIncome =
    (input.primaryIncome || 0) + (input.secondaryIncome || 0) + (input.additionalIncome || 0);

  const totalFixedExpenses =
    (input.housing || 0) + (input.utilities || 0) + (input.insurance || 0);

  const totalVariableExpenses =
    (input.food || 0) +
    (input.transportation || 0) +
    (input.education || 0) +
    (input.healthcare || 0) +
    (input.entertainment || 0) +
    (input.other || 0);

  const totalSavings = (input.savings || 0) + (input.pension || 0);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses + totalSavings;
  const netCashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  // 50/30/20 rule analysis
  // 50% needs (housing, utilities, food, transportation, healthcare, insurance)
  // 30% wants (entertainment, education, other)
  // 20% savings
  const needs =
    input.housing + input.utilities + input.insurance + input.food + input.transportation + input.healthcare;
  const wants = input.entertainment + input.education + input.other;
  const savings = totalSavings;

  let status: FamilyBudgetResult['status'];
  if (netCashFlow < 0) {
    status = 'danger';
  } else if (savingsRate < 10) {
    status = 'warning';
  } else if (savingsRate < 20) {
    status = 'good';
  } else {
    status = 'excellent';
  }

  return {
    totalIncome,
    totalFixedExpenses,
    totalVariableExpenses,
    totalSavings,
    totalExpenses,
    netCashFlow,
    savingsRate,
    status,
    rule503020: {
      needs: {
        actual: needs,
        recommended: totalIncome * 0.5,
        pct: totalIncome > 0 ? (needs / totalIncome) * 100 : 0,
      },
      wants: {
        actual: wants,
        recommended: totalIncome * 0.3,
        pct: totalIncome > 0 ? (wants / totalIncome) * 100 : 0,
      },
      savings: {
        actual: savings,
        recommended: totalIncome * 0.2,
        pct: totalIncome > 0 ? (savings / totalIncome) * 100 : 0,
      },
    },
  };
}

// ============================================================
// 2. LOAN REPAYMENT CALCULATOR
// ============================================================

export interface LoanRepaymentInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  extraMonthlyPayment: number; // תשלום נוסף חודשי
  oneTimePayment: number; // תשלום חד-פעמי בתחילה
}

export interface LoanRepaymentResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  // עם תשלומים נוספים:
  acceleratedTermMonths: number;
  acceleratedTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export function calculateLoanRepayment(input: LoanRepaymentInput): LoanRepaymentResult {
  const { loanAmount, annualRate, termMonths, extraMonthlyPayment, oneTimePayment } = input;

  if (loanAmount <= 0 || termMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalPayments: 0,
      totalInterest: 0,
      acceleratedTermMonths: 0,
      acceleratedTotalInterest: 0,
      interestSaved: 0,
      monthsSaved: 0,
      schedule: [],
    };
  }

  const r = annualRate / 100 / 12;

  // PMT formula
  const monthlyPayment =
    r === 0 ? loanAmount / termMonths : (loanAmount * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);

  // לוח סילוקין רגיל
  let balance = loanAmount;
  let totalInterest = 0;
  for (let i = 0; i < termMonths; i++) {
    const interest = balance * r;
    const principal = monthlyPayment - interest;
    totalInterest += interest;
    balance -= principal;
  }

  // לוח סילוקין מואץ (עם תשלומים נוספים)
  let accBalance = loanAmount - oneTimePayment;
  let accTotalInterest = 0;
  let accMonth = 0;
  const schedule: LoanRepaymentResult['schedule'] = [];

  while (accBalance > 0.01 && accMonth < termMonths * 2) {
    const interest = accBalance * r;
    const principal = Math.min(monthlyPayment - interest + extraMonthlyPayment, accBalance);
    const totalPayment = principal + interest;

    accTotalInterest += interest;
    accBalance -= principal;
    accMonth++;

    if (accMonth <= 24 || accMonth % 12 === 0 || accBalance < 1000) {
      schedule.push({
        month: accMonth,
        payment: totalPayment,
        principal,
        interest,
        balance: Math.max(0, accBalance),
      });
    }
  }

  return {
    monthlyPayment,
    totalPayments: monthlyPayment * termMonths,
    totalInterest,
    acceleratedTermMonths: accMonth,
    acceleratedTotalInterest: accTotalInterest,
    interestSaved: totalInterest - accTotalInterest,
    monthsSaved: termMonths - accMonth,
    schedule,
  };
}

// ============================================================
// 3. AMORTIZATION SCHEDULE (לוח סילוקין מלא)
// ============================================================

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface AmortizationScheduleInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
}

export function calculateAmortizationSchedule(input: AmortizationScheduleInput): AmortizationRow[] {
  const { loanAmount, annualRate, termMonths } = input;
  if (loanAmount <= 0 || termMonths <= 0) return [];

  const r = annualRate / 100 / 12;
  const monthlyPayment =
    r === 0
      ? loanAmount / termMonths
      : (loanAmount * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);

  const rows: AmortizationRow[] = [];
  let balance = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * r;
    const principal = Math.min(monthlyPayment - interest, balance);
    const payment = principal + interest;
    cumulativeInterest += interest;
    cumulativePrincipal += principal;
    balance = Math.max(0, balance - principal);

    rows.push({
      month: m,
      payment,
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
// 4. TRUE APR CALCULATOR (APR אמיתי כולל עמלות)
// ============================================================

export interface TrueAPRInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  openingFee: number;       // עמלת פתיחת תיק (₪)
  monthlyServiceFee: number; // דמי ניהול חודשיים (₪)
  mandatoryInsurance: number; // ביטוח חובה חודשי (₪)
  otherFees: number;         // עמלות אחרות חד-פעמיות (₪)
}

export interface TrueAPRResult {
  statedMonthlyPayment: number;
  trueMonthlyPayment: number;
  statedAnnualRate: number;
  trueAPR: number;
  totalFees: number;
  totalCost: number; // קרן + ריבית + עמלות
  extraCostFromFees: number;
}

export function calculateTrueAPR(input: TrueAPRInput): TrueAPRResult {
  const { loanAmount, annualRate, termMonths, openingFee, monthlyServiceFee, mandatoryInsurance, otherFees } = input;

  const r = annualRate / 100 / 12;
  const statedMonthlyPayment =
    r === 0
      ? loanAmount / termMonths
      : (loanAmount * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);

  const totalStatedInterest = statedMonthlyPayment * termMonths - loanAmount;
  const totalFees =
    openingFee + otherFees + (monthlyServiceFee + mandatoryInsurance) * termMonths;
  const totalCost = loanAmount + totalStatedInterest + totalFees;
  const trueMonthlyPayment = statedMonthlyPayment + monthlyServiceFee + mandatoryInsurance;

  // חישוב APR אמיתי: מצא r' כך ש-NPV = 0
  // נקודת ההתחלה: קיבלת loanAmount - openingFee - otherFees (עלויות ראשוניות)
  const netReceivedAmount = loanAmount - openingFee - otherFees;
  let trueAPR = annualRate; // נקודת התחלה

  if (netReceivedAmount > 0) {
    // Newton-Raphson לאיתור APR
    let rM = annualRate / 100 / 12;
    for (let iter = 0; iter < 100; iter++) {
      let pv = 0;
      let dpv = 0;
      for (let m = 1; m <= termMonths; m++) {
        const disc = Math.pow(1 + rM, m);
        pv += trueMonthlyPayment / disc;
        dpv -= (m * trueMonthlyPayment) / (disc * (1 + rM));
      }
      const f = pv - netReceivedAmount;
      if (Math.abs(f) < 0.001) break;
      rM = rM - f / dpv;
      if (rM <= 0) { rM = 0.0001; break; }
    }
    trueAPR = rM * 12 * 100;
  }

  return {
    statedMonthlyPayment,
    trueMonthlyPayment,
    statedAnnualRate: annualRate,
    trueAPR,
    totalFees,
    totalCost,
    extraCostFromFees: totalFees,
  };
}

// ============================================================
// 5. LOAN COMPARISON (השוואת הצעות)
// ============================================================

export interface LoanOffer {
  id: string;
  name: string;
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  openingFee?: number;
  monthlyServiceFee?: number;
}

export interface LoanOfferResult {
  id: string;
  name: string;
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalCost: number;
  trueAPR: number;
  rank: number;
}

export function compareLoans(offers: LoanOffer[]): LoanOfferResult[] {
  const results: LoanOfferResult[] = offers.map((offer) => {
    const r = offer.annualRate / 100 / 12;
    const n = offer.termMonths;
    const P = offer.loanAmount;
    const openingFee = offer.openingFee ?? 0;
    const monthlyServiceFee = offer.monthlyServiceFee ?? 0;

    const monthlyPayment =
      r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalInterest = monthlyPayment * n - P;
    const totalFees = openingFee + monthlyServiceFee * n;
    const totalCost = P + totalInterest + totalFees;

    // True APR
    const trueMonthlyPayment = monthlyPayment + monthlyServiceFee;
    const netReceived = P - openingFee;
    let trueAPR = offer.annualRate;
    if (netReceived > 0 && (openingFee > 0 || monthlyServiceFee > 0)) {
      let rM = r;
      for (let iter = 0; iter < 100; iter++) {
        let pv = 0;
        let dpv = 0;
        for (let m = 1; m <= n; m++) {
          const disc = Math.pow(1 + rM, m);
          pv += trueMonthlyPayment / disc;
          dpv -= (m * trueMonthlyPayment) / (disc * (1 + rM));
        }
        const f = pv - netReceived;
        if (Math.abs(f) < 0.001) break;
        rM = rM - f / dpv;
        if (rM <= 0) { rM = 0.0001; break; }
      }
      trueAPR = rM * 12 * 100;
    }

    return {
      id: offer.id,
      name: offer.name,
      loanAmount: P,
      annualRate: offer.annualRate,
      termMonths: n,
      monthlyPayment,
      totalPayments: monthlyPayment * n,
      totalInterest,
      totalCost,
      trueAPR,
      rank: 0,
    };
  });

  // דרג לפי סך עלות כוללת (כולל עמלות)
  results.sort((a, b) => a.totalCost - b.totalCost);
  results.forEach((r, i) => { r.rank = i + 1; });

  return results;
}

// ============================================================
// 6. DEBT CONSOLIDATION (איחוד הלוואות)
// ============================================================

export interface ExistingLoan {
  id: string;
  name: string;
  remainingBalance: number;
  annualRate: number;
  remainingMonths: number;
}

export interface DebtConsolidationInput {
  existingLoans: ExistingLoan[];
  consolidationRate: number;   // ריבית הלוואה מאחדת (%)
  consolidationTermMonths: number; // תקופה חדשה
  consolidationFee?: number;   // עמלת פתיחת תיק לאחוד (₪)
}

export interface DebtConsolidationResult {
  totalBalance: number;
  weightedAverageRate: number;
  currentMonthlyTotal: number;
  currentTotalInterestRemaining: number;
  consolidatedMonthlyPayment: number;
  consolidatedTotalInterest: number;
  consolidatedTotalCost: number;
  monthlySavings: number;
  totalSavings: number;
  breakEvenMonths: number; // כמה חודשים עד שהאיחוד משתלם (בגלל עמלה)
  recommended: boolean;
  recommendation: string;
}

export function calculateDebtConsolidation(input: DebtConsolidationInput): DebtConsolidationResult {
  const { existingLoans, consolidationRate, consolidationTermMonths, consolidationFee = 0 } = input;

  if (existingLoans.length === 0) {
    return {
      totalBalance: 0,
      weightedAverageRate: 0,
      currentMonthlyTotal: 0,
      currentTotalInterestRemaining: 0,
      consolidatedMonthlyPayment: 0,
      consolidatedTotalInterest: 0,
      consolidatedTotalCost: 0,
      monthlySavings: 0,
      totalSavings: 0,
      breakEvenMonths: 0,
      recommended: false,
      recommendation: 'אין הלוואות להשוואה',
    };
  }

  // חישוב כל הלוואה קיימת
  let totalBalance = 0;
  let currentMonthlyTotal = 0;
  let currentTotalInterestRemaining = 0;
  let weightedRateSum = 0;

  for (const loan of existingLoans) {
    const r = loan.annualRate / 100 / 12;
    const n = loan.remainingMonths;
    const P = loan.remainingBalance;
    const monthly =
      r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalInterest = monthly * n - P;

    totalBalance += P;
    currentMonthlyTotal += monthly;
    currentTotalInterestRemaining += totalInterest;
    weightedRateSum += loan.annualRate * P;
  }

  const weightedAverageRate = totalBalance > 0 ? weightedRateSum / totalBalance : 0;

  // הלוואה מאחדת
  const rConsolidated = consolidationRate / 100 / 12;
  const nConsolidated = consolidationTermMonths;
  const consolidatedMonthlyPayment =
    rConsolidated === 0
      ? totalBalance / nConsolidated
      : (totalBalance * rConsolidated * Math.pow(1 + rConsolidated, nConsolidated)) /
        (Math.pow(1 + rConsolidated, nConsolidated) - 1);

  const consolidatedTotalInterest = consolidatedMonthlyPayment * nConsolidated - totalBalance;
  const consolidatedTotalCost = totalBalance + consolidatedTotalInterest + consolidationFee;

  const monthlySavings = currentMonthlyTotal - consolidatedMonthlyPayment;
  const currentTotalCost = totalBalance + currentTotalInterestRemaining;
  const totalSavings = currentTotalCost - consolidatedTotalCost;

  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(consolidationFee / monthlySavings) : 999;

  const recommended = totalSavings > 0 && consolidationRate < weightedAverageRate;
  let recommendation: string;
  if (recommended) {
    recommendation = `האיחוד משתלם: חיסכון כולל של ${Math.round(totalSavings).toLocaleString()} ₪. ריבית ממוצעת נוכחית ${weightedAverageRate.toFixed(1)}% → ${consolidationRate}%`;
  } else if (consolidationRate >= weightedAverageRate) {
    recommendation = `לא מומלץ: ריבית האיחוד (${consolidationRate}%) גבוהה מהממוצע הנוכחי (${weightedAverageRate.toFixed(1)}%)`;
  } else {
    recommendation = 'בדוק שוב את התנאים - החיסכון הכולל שלילי';
  }

  return {
    totalBalance,
    weightedAverageRate,
    currentMonthlyTotal,
    currentTotalInterestRemaining,
    consolidatedMonthlyPayment,
    consolidatedTotalInterest,
    consolidatedTotalCost,
    monthlySavings,
    totalSavings,
    breakEvenMonths,
    recommended,
    recommendation,
  };
}

// ============================================================
// 7. EARLY PAYOFF LOAN (פירעון מוקדם מפורט)
// ============================================================

export interface EarlyPayoffLoanInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  monthsElapsed: number;      // כמה חודשים כבר שילמנו
  lumpSumPayment?: number;    // תשלום חד-פעמי נוסף (₪)
  extraMonthlyPayment?: number; // תשלום חודשי נוסף (₪)
  earlyPayoffPenaltyPct?: number; // קנס פירעון מוקדם (%, ברירת מחדל 0)
}

export interface EarlyPayoffLoanResult {
  originalMonthlyPayment: number;
  currentBalance: number;         // יתרה לאחר החודשים שעברו
  remainingMonthsOriginal: number;
  originalRemainingInterest: number;

  // עם פירעון מוקדם:
  newRemainingMonths: number;
  newTotalInterest: number;
  monthsSaved: number;
  interestSaved: number;
  penaltyAmount: number;
  netSavings: number; // חיסכון בניכוי קנס
  newPayoffDate: string; // תאריך סיום חדש (YYYY-MM)
}

export function calculateEarlyPayoffLoan(input: EarlyPayoffLoanInput): EarlyPayoffLoanResult {
  const {
    loanAmount,
    annualRate,
    termMonths,
    monthsElapsed,
    lumpSumPayment = 0,
    extraMonthlyPayment = 0,
    earlyPayoffPenaltyPct = 0,
  } = input;

  const r = annualRate / 100 / 12;

  // תשלום חודשי מקורי
  const originalMonthlyPayment =
    r === 0
      ? loanAmount / termMonths
      : (loanAmount * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);

  // חישוב יתרה לאחר monthsElapsed חודשים
  let balance = loanAmount;
  for (let m = 0; m < Math.min(monthsElapsed, termMonths); m++) {
    const interest = balance * r;
    const principal = originalMonthlyPayment - interest;
    balance -= principal;
  }
  const currentBalance = Math.max(0, balance);
  const remainingMonthsOriginal = termMonths - monthsElapsed;

  // ריבית שנותרת ללא פירעון מוקדם
  let originalRemainingInterest = 0;
  let tempBalance = currentBalance;
  for (let m = 0; m < remainingMonthsOriginal; m++) {
    const interest = tempBalance * r;
    const principal = originalMonthlyPayment - interest;
    originalRemainingInterest += interest;
    tempBalance -= principal;
  }

  // קנס פירעון מוקדם על הסכום שמשולם מוקדם
  const earlyAmount = lumpSumPayment;
  const penaltyAmount = (earlyAmount * earlyPayoffPenaltyPct) / 100;

  // יתרה לאחר תשלום חד-פעמי
  const balanceAfterLump = Math.max(0, currentBalance - lumpSumPayment);

  // חישוב חודשים נותרים עם תשלום מוגבר
  let newBalance = balanceAfterLump;
  let newRemainingMonths = 0;
  let newTotalInterest = 0;
  const effectiveMonthlyPayment = originalMonthlyPayment + extraMonthlyPayment;

  while (newBalance > 0.01 && newRemainingMonths < remainingMonthsOriginal * 2) {
    const interest = newBalance * r;
    const principal = Math.min(effectiveMonthlyPayment - interest, newBalance);
    newTotalInterest += interest;
    newBalance -= principal;
    newRemainingMonths++;
    if (principal <= 0) break;
  }

  const monthsSaved = remainingMonthsOriginal - newRemainingMonths;
  const interestSaved = originalRemainingInterest - newTotalInterest;
  const netSavings = interestSaved - penaltyAmount;

  // חישוב תאריך סיום חדש
  const now = new Date();
  const payoffDate = new Date(now.getFullYear(), now.getMonth() + newRemainingMonths, 1);
  const newPayoffDate = `${payoffDate.getFullYear()}-${String(payoffDate.getMonth() + 1).padStart(2, '0')}`;

  return {
    originalMonthlyPayment,
    currentBalance,
    remainingMonthsOriginal,
    originalRemainingInterest,
    newRemainingMonths,
    newTotalInterest,
    monthsSaved,
    interestSaved,
    penaltyAmount,
    netSavings,
    newPayoffDate,
  };
}
