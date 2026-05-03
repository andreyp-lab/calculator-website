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
    acceleratedTotalInterest: accTotalInterest + (oneTimePayment > 0 ? 0 : 0),
    interestSaved: totalInterest - accTotalInterest,
    monthsSaved: termMonths - accMonth,
    schedule,
  };
}
