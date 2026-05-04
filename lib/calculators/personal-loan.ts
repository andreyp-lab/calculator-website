/**
 * מחשבון הלוואה לכל מטרה - 2026
 *
 * חישוב הלוואה צרכנית רגילה (לא משכנתא):
 * - תשלום חודשי לפי PMT (שפיצר)
 * - סך עלות הלוואה
 * - השוואת מסלולים (ריבית קבועה / משתנה)
 *
 * נוסחת PMT:
 * PMT = P × r × (1+r)^n / ((1+r)^n - 1)
 */

export interface PersonalLoanInput {
  /** סכום ההלוואה (₪) */
  loanAmount: number;
  /** ריבית שנתית (%) */
  annualInterestRate: number;
  /** מספר חודשי ההלוואה */
  termMonths: number;
  /** עמלת פתיחת תיק (₪) */
  openingFee?: number;
  /** עמלת פירעון מוקדם משוערת (₪) */
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

  // חישוב לוח סילוקין שנה ראשונה
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

  // ריבית אפקטיבית - כולל עמלות
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
