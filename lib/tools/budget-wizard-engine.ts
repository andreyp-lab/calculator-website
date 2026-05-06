/**
 * Budget Wizard Engine
 *
 * מקבל תשובות לשאלות + ענף → מייצר תקציב מלא ומקצועי.
 * משתמש בבנצ'מרק ענפי לערכי ברירת מחדל ובדיקת סבירות.
 */

import type {
  BudgetData,
  IncomeItem,
  ExpenseItem,
  Employee,
  Loan,
  Industry,
  ExpenseCategory,
  Department,
} from './types';
import { INDUSTRY_BENCHMARKS } from './industry-benchmarks';

// ============================================================
// DETAILED ENTRY ITEMS (for individual entry mode)
// ============================================================

export interface IncomeStreamDetail {
  name: string;
  monthlyAmount: number;
  paymentTermsDays: number;
  growthPctMonthly: number;
}

export interface EmployeeDetail {
  name: string;
  position: string;
  department: Department;
  monthlySalary: number;
}

export interface SupplierExpenseDetail {
  name: string;
  category: 'cogs' | 'rnd' | 'marketing' | 'operating' | 'financial';
  monthlyAmount: number;
  isPctOfRevenue: boolean;
  percentageOfRevenue?: number;
}

// ============================================================
// MAIN ANSWERS
// ============================================================

export interface WizardAnswers {
  // Step 1: Industry & Stage
  industry: Industry;
  stage: 'startup' | 'growth' | 'mature';
  companyName: string;

  // Step 2: Revenue
  /** Mode: simple (just total) or detailed (list streams) */
  incomeMode: 'simple' | 'detailed';
  monthlyRevenue: number; // simple mode
  numIncomeStreams: number; // simple mode
  expectedGrowthPct: number;
  incomeStreams: IncomeStreamDetail[]; // detailed mode

  // Step 3: COGS
  cogsPct: number; // % of revenue

  // Step 4: Employees
  /** Mode: simple (count + total) or detailed (list per employee) */
  employeesMode: 'simple' | 'detailed';
  numEmployees: number; // simple
  totalMonthlySalary: number; // simple
  employees: EmployeeDetail[]; // detailed
  /** Distribution by department (used in simple mode) */
  employeeDistribution?: Record<Department, number>;

  // Step 5: Operating - now supports detailed suppliers
  /** Mode: simple (rent + operating total) or detailed (suppliers list) */
  expensesMode: 'simple' | 'detailed';
  monthlyRent: number; // simple
  monthlyOperating: number; // simple
  suppliers: SupplierExpenseDetail[]; // detailed

  // Step 6: Marketing
  marketingPct: number; // % of revenue OR fixed amount
  marketingType: 'pct' | 'fixed';
  marketingAmount: number; // if fixed

  // Step 7: R&D (if relevant)
  rndPct: number;

  // Step 8: Loans
  hasLoans: boolean;
  loanAmount: number;
  loanRatePct: number;
  loanTermMonths: number;

  // Step 9: Settings
  fiscalYear: number;
  taxRatePct: number;
}

// ============================================================
// SUGGESTED DEFAULTS BY INDUSTRY
// ============================================================

export function suggestDefaults(industry: Industry): Partial<WizardAnswers> {
  const bench = INDUSTRY_BENCHMARKS[industry];
  // Use Q2 (median) values
  return {
    cogsPct: 100 - bench.grossMargin.median,
    rndPct: bench.rndPctOfRevenue.median,
    marketingPct: bench.marketingPctOfRevenue.median,
    expectedGrowthPct: bench.revenueGrowthPct.median,
  };
}

// ============================================================
// EMPLOYEE DEFAULT DISTRIBUTION BY INDUSTRY
// ============================================================

const EMPLOYEE_DISTRIBUTION_BY_INDUSTRY: Record<Industry, Record<Department, number>> = {
  technology: { development: 0.5, sales: 0.2, marketing: 0.15, operations: 0.05, administration: 0.1 },
  retail: { sales: 0.4, operations: 0.3, marketing: 0.1, administration: 0.15, development: 0.05 },
  manufacturing: { operations: 0.6, sales: 0.15, administration: 0.1, marketing: 0.05, development: 0.1 },
  food: { operations: 0.7, sales: 0.1, administration: 0.1, marketing: 0.05, development: 0.05 },
  construction: { operations: 0.6, sales: 0.15, administration: 0.15, marketing: 0.05, development: 0.05 },
  services: { operations: 0.5, sales: 0.2, marketing: 0.1, administration: 0.15, development: 0.05 },
  energy: { operations: 0.55, sales: 0.15, administration: 0.15, marketing: 0.05, development: 0.1 },
  healthcare: { operations: 0.6, administration: 0.15, sales: 0.1, marketing: 0.05, development: 0.1 },
  finance: { operations: 0.4, sales: 0.25, administration: 0.2, marketing: 0.1, development: 0.05 },
  realestate: { sales: 0.4, operations: 0.3, administration: 0.2, marketing: 0.1, development: 0 },
};

// ============================================================
// MAIN GENERATOR
// ============================================================

const id = () => Math.random().toString(36).slice(2, 10);

export function generateBudgetFromWizard(answers: WizardAnswers): BudgetData {
  const income = generateIncome(answers);
  const employees = generateEmployees(answers);
  const expenses = generateExpenses(answers);
  const loans = generateLoans(answers);

  return { income, expenses, employees, loans };
}

function generateIncome(answers: WizardAnswers): IncomeItem[] {
  const { incomeMode, expectedGrowthPct, industry } = answers;

  // === DETAILED MODE: use the streams list as-is ===
  if (incomeMode === 'detailed' && answers.incomeStreams.length > 0) {
    return answers.incomeStreams.map((stream) => ({
      id: id(),
      name: stream.name || getDefaultIncomeName(industry, 0),
      amount: stream.monthlyAmount,
      startMonth: 0,
      duration: 12,
      growthPct: stream.growthPctMonthly,
      paymentTerms: stream.paymentTermsDays,
      status: 'expected' as const,
    }));
  }

  // === SIMPLE MODE: split total by weights ===
  const { monthlyRevenue, numIncomeStreams } = answers;
  const items: IncomeItem[] = [];

  if (numIncomeStreams === 1) {
    items.push({
      id: id(),
      name: getDefaultIncomeName(industry, 0),
      amount: monthlyRevenue,
      startMonth: 0,
      duration: 12,
      growthPct: expectedGrowthPct / 12,
      paymentTerms: getDefaultPaymentTerms(industry),
      status: 'expected',
    });
  } else {
    const weights = getIncomeStreamWeights(numIncomeStreams);
    for (let i = 0; i < numIncomeStreams; i++) {
      items.push({
        id: id(),
        name: getDefaultIncomeName(industry, i),
        amount: monthlyRevenue * weights[i],
        startMonth: 0,
        duration: 12,
        growthPct: expectedGrowthPct / 12,
        paymentTerms: getDefaultPaymentTerms(industry),
        status: 'expected',
      });
    }
  }

  return items;
}

function getDefaultIncomeName(industry: Industry, index: number): string {
  const namesByIndustry: Record<Industry, string[]> = {
    technology: ['מנויים חודשיים', 'מנויים שנתיים', 'שירותי מקצוע'],
    retail: ['מכירות חנות', 'מכירות אונליין', 'משלוחים'],
    manufacturing: ['מכירות סיטונאות', 'מכירות B2B', 'יצוא'],
    food: ['מכירות שולחנות', 'משלוחים', 'אירועים'],
    construction: ['פרויקט ראשי', 'שיפוצים פרטיים', 'תחזוקה'],
    services: ['פרויקטים קבועים', 'פרויקטים אד-הוק', 'ייעוץ'],
    energy: ['מכירת אנרגיה', 'שירותים נלווים', 'הסכמים ארוכי טווח'],
    healthcare: ['מטופלים פרטיים', 'הסכמי שב"ן', 'שירותי בריאות'],
    finance: ['עמלות ייעוץ', 'דמי ניהול', 'הצלחה'],
    realestate: ['מכירות', 'שכירות', 'שירותי ניהול'],
  };
  const names = namesByIndustry[industry] ?? ['הכנסה ראשית', 'הכנסה משנית', 'הכנסה נוספת'];
  return names[index] ?? `הכנסה ${index + 1}`;
}

function getDefaultPaymentTerms(industry: Industry): number {
  // SaaS/Tech: tend to be paid upfront. B2B: 30-60. Construction: 60-90.
  const terms: Record<Industry, number> = {
    technology: 0,
    retail: 0,
    food: 0,
    services: 30,
    healthcare: 60,
    realestate: 30,
    finance: 30,
    energy: 60,
    manufacturing: 30,
    construction: 60,
  };
  return terms[industry] ?? 30;
}

function getIncomeStreamWeights(count: number): number[] {
  // Pareto-like distribution: first stream is largest
  if (count === 2) return [0.65, 0.35];
  if (count === 3) return [0.5, 0.3, 0.2];
  if (count === 4) return [0.4, 0.25, 0.2, 0.15];
  if (count === 5) return [0.35, 0.25, 0.2, 0.1, 0.1];
  // Default: equal split
  return Array(count).fill(1 / count);
}

function generateEmployees(answers: WizardAnswers): Employee[] {
  // === DETAILED MODE: use the list as-is ===
  if (answers.employeesMode === 'detailed' && answers.employees.length > 0) {
    return answers.employees.map((e) => ({
      id: id(),
      name: e.name,
      position: e.position,
      department: e.department,
      monthlySalary: e.monthlySalary,
      startMonth: 0,
      endMonth: null,
    }));
  }

  // === SIMPLE MODE: distribute by industry ===
  const { numEmployees, totalMonthlySalary, industry } = answers;
  if (numEmployees === 0 || totalMonthlySalary === 0) return [];

  const distribution =
    answers.employeeDistribution ?? EMPLOYEE_DISTRIBUTION_BY_INDUSTRY[industry];

  const employees: Employee[] = [];
  const departments = Object.keys(distribution) as Department[];

  // Step 1: Allocate employees, ensuring total = numEmployees
  const allocations: Array<{ dept: Department; count: number }> = [];
  let allocated = 0;
  for (const dept of departments) {
    const pct = distribution[dept];
    const exactCount = numEmployees * pct;
    const roundedCount = Math.round(exactCount);
    allocations.push({ dept, count: roundedCount });
    allocated += roundedCount;
  }

  // Adjust if rounding caused us to over/under-allocate
  let diff = numEmployees - allocated;
  while (diff !== 0) {
    if (diff > 0) {
      // Add to largest department
      const largest = allocations.reduce((max, a) =>
        a.count > max.count ? a : max,
      );
      largest.count++;
      diff--;
    } else {
      // Remove from smallest non-zero department
      const smallestNonZero = allocations
        .filter((a) => a.count > 0)
        .reduce((min, a) => (a.count < min.count ? a : min));
      smallestNonZero.count--;
      diff++;
    }
  }

  // Step 2: Distribute salary proportionally to actual allocations
  const totalActualEmployees = allocations.reduce((s, a) => s + a.count, 0);
  if (totalActualEmployees === 0) return [];

  // Salary per employee = total / actual count (uniform across all)
  const perEmpSalary = totalMonthlySalary / totalActualEmployees;

  for (const { dept, count } of allocations) {
    if (count === 0) continue;
    if (count === 1) {
      employees.push({
        id: id(),
        name: getDeptHeadTitle(dept),
        department: dept,
        monthlySalary: perEmpSalary,
        startMonth: 0,
        endMonth: null,
      });
    } else {
      for (let i = 0; i < count; i++) {
        employees.push({
          id: id(),
          name: i === 0 ? getDeptHeadTitle(dept) : `${getDeptLabel(dept)} ${i + 1}`,
          department: dept,
          monthlySalary: perEmpSalary,
          startMonth: 0,
          endMonth: null,
        });
      }
    }
  }

  return employees;
}

function getDeptHeadTitle(dept: Department): string {
  const titles: Record<Department, string> = {
    sales: 'VP Sales',
    marketing: 'CMO',
    development: 'CTO',
    operations: 'COO',
    administration: 'CFO',
  };
  return titles[dept];
}

function getDeptLabel(dept: Department): string {
  const labels: Record<Department, string> = {
    sales: 'מכירות',
    marketing: 'שיווק',
    development: 'פיתוח',
    operations: 'תפעול',
    administration: 'אדמין',
  };
  return labels[dept];
}

function generateExpenses(answers: WizardAnswers): ExpenseItem[] {
  const expenses: ExpenseItem[] = [];

  // COGS - always % of revenue
  if (answers.cogsPct > 0) {
    expenses.push({
      id: id(),
      category: 'cogs',
      name: getCogsName(answers.industry),
      amount: 0,
      isPct: true,
      percentage: answers.cogsPct,
      startMonth: 0,
      duration: 12,
      paymentTerms: 30,
    });
  }

  // === DETAILED MODE: add each supplier as separate expense ===
  if (answers.expensesMode === 'detailed' && answers.suppliers.length > 0) {
    for (const sup of answers.suppliers) {
      expenses.push({
        id: id(),
        category: sup.category,
        name: sup.name,
        amount: sup.isPctOfRevenue ? 0 : sup.monthlyAmount,
        isPct: sup.isPctOfRevenue,
        percentage: sup.isPctOfRevenue ? sup.percentageOfRevenue ?? 0 : 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      });
    }
  } else {
    // === SIMPLE MODE: rent + operating as 2 line items ===
    if (answers.monthlyRent > 0) {
      expenses.push({
        id: id(),
        category: 'operating',
        name: 'שכירות',
        amount: answers.monthlyRent,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
        applyInflation: true,
      });
    }

    if (answers.monthlyOperating > 0) {
      expenses.push({
        id: id(),
        category: 'operating',
        name: 'תפעול שוטף',
        amount: answers.monthlyOperating,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      });
    }
  }

  // Marketing
  if (answers.marketingType === 'pct' && answers.marketingPct > 0) {
    expenses.push({
      id: id(),
      category: 'marketing',
      name: 'שיווק (% מהכנסות)',
      amount: 0,
      isPct: true,
      percentage: answers.marketingPct,
      startMonth: 0,
      duration: 12,
      paymentTerms: 30,
    });
  } else if (answers.marketingType === 'fixed' && answers.marketingAmount > 0) {
    expenses.push({
      id: id(),
      category: 'marketing',
      name: 'שיווק',
      amount: answers.marketingAmount,
      isPct: false,
      percentage: 0,
      startMonth: 0,
      duration: 12,
      paymentTerms: 30,
    });
  }

  // R&D (if applicable)
  if (answers.rndPct > 0) {
    expenses.push({
      id: id(),
      category: 'rnd',
      name: 'מחקר ופיתוח',
      amount: 0,
      isPct: true,
      percentage: answers.rndPct,
      startMonth: 0,
      duration: 12,
      paymentTerms: 30,
    });
  }

  return expenses;
}

function getCogsName(industry: Industry): string {
  const names: Record<Industry, string> = {
    technology: 'תשתיות ענן + תמיכה',
    retail: 'עלות מוצרים + משלוחים',
    manufacturing: 'חומרי גלם + ייצור',
    food: 'חומרי גלם + עמלות משלוחים',
    construction: 'חומרי בנייה + קבלני משנה',
    services: 'עלויות ישירות',
    energy: 'דלק + תחזוקה',
    healthcare: 'חומרים + תרופות',
    finance: 'עלויות תפעוליות ישירות',
    realestate: 'עלויות פיתוח',
  };
  return names[industry] ?? 'עלות המכר';
}

function generateLoans(answers: WizardAnswers): Loan[] {
  if (!answers.hasLoans || answers.loanAmount === 0) return [];

  return [
    {
      id: id(),
      name: 'הלוואה ראשית',
      amount: answers.loanAmount,
      termMonths: answers.loanTermMonths,
      annualRate: answers.loanRatePct,
      startMonth: 0,
      type: 'bank',
    },
  ];
}

// ============================================================
// SUMMARY / VALIDATION
// ============================================================

export interface WizardSummary {
  totalAnnualRevenue: number;
  totalAnnualCOGS: number;
  totalAnnualOpEx: number;
  totalAnnualSalaries: number;
  totalAnnualMarketing: number;
  totalAnnualRnD: number;
  estimatedAnnualProfit: number;
  estimatedNetMargin: number;
  warnings: string[];
}

export function summarizeWizard(answers: WizardAnswers): WizardSummary {
  const annualRevenue = answers.monthlyRevenue * 12;
  const annualCOGS = (annualRevenue * answers.cogsPct) / 100;
  const annualSalaries = answers.totalMonthlySalary * 12;
  const annualRent = answers.monthlyRent * 12;
  const annualOperating = answers.monthlyOperating * 12;
  const annualOpEx = annualRent + annualOperating + annualSalaries;
  const annualMarketing =
    answers.marketingType === 'pct'
      ? (annualRevenue * answers.marketingPct) / 100
      : answers.marketingAmount * 12;
  const annualRnD = (annualRevenue * answers.rndPct) / 100;

  const totalCosts = annualCOGS + annualOpEx + annualMarketing + annualRnD;
  const profitBeforeTax = annualRevenue - totalCosts;
  const tax = profitBeforeTax > 0 ? (profitBeforeTax * answers.taxRatePct) / 100 : 0;
  const profit = profitBeforeTax - tax;
  const netMargin = annualRevenue > 0 ? (profit / annualRevenue) * 100 : 0;

  const warnings: string[] = [];

  // Sanity checks against industry benchmarks
  const bench = INDUSTRY_BENCHMARKS[answers.industry];
  const grossMargin = 100 - answers.cogsPct;
  if (grossMargin < bench.grossMargin.low) {
    warnings.push(
      `מרווח גולמי (${grossMargin.toFixed(0)}%) נמוך מהאחוזון התחתון בענף (${bench.grossMargin.low.toFixed(0)}%)`,
    );
  }
  if (annualSalaries / annualRevenue > 0.6) {
    warnings.push(`עלות שכר ${((annualSalaries / annualRevenue) * 100).toFixed(0)}% מההכנסות - גבוה`);
  }
  if (profit < 0) {
    warnings.push('התקציב מפסיד - שקול הוצאות נמוכות יותר או הכנסות גבוהות יותר');
  }
  if (netMargin > 50) {
    warnings.push(`מרווח נקי (${netMargin.toFixed(0)}%) גבוה מאוד - בדוק שלא חסר הוצאות`);
  }

  return {
    totalAnnualRevenue: annualRevenue,
    totalAnnualCOGS: annualCOGS,
    totalAnnualOpEx: annualOpEx,
    totalAnnualSalaries: annualSalaries,
    totalAnnualMarketing: annualMarketing,
    totalAnnualRnD: annualRnD,
    estimatedAnnualProfit: profit,
    estimatedNetMargin: netMargin,
    warnings,
  };
}

// ============================================================
// EMPTY DEFAULTS
// ============================================================

export function createDefaultAnswers(): WizardAnswers {
  return {
    industry: 'services',
    stage: 'growth',
    companyName: '',
    // Income
    incomeMode: 'simple',
    monthlyRevenue: 100000,
    numIncomeStreams: 1,
    expectedGrowthPct: 5,
    incomeStreams: [],
    // COGS
    cogsPct: 35,
    // Employees
    employeesMode: 'simple',
    numEmployees: 3,
    totalMonthlySalary: 45000,
    employees: [],
    // Operating
    expensesMode: 'simple',
    monthlyRent: 8000,
    monthlyOperating: 5000,
    suppliers: [],
    // Marketing
    marketingPct: 5,
    marketingType: 'pct',
    marketingAmount: 5000,
    // R&D
    rndPct: 0,
    // Loans
    hasLoans: false,
    loanAmount: 0,
    loanRatePct: 7,
    loanTermMonths: 60,
    // Settings
    fiscalYear: new Date().getFullYear(),
    taxRatePct: 23,
  };
}
