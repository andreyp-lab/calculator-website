/**
 * ייצוא וייבוא לאקסל - תקציב + תזרים מזומנים
 *
 * תומך בייצוא של כל הנתונים לקובץ xlsx עם sheets מרובים,
 * וייבוא חזרה כולל הורדת תבנית ריקה.
 */

import * as XLSX from 'xlsx';
import type {
  BudgetData,
  CashFlowData,
  PeriodSettings,
  BalanceSheetData,
  IncomeItem,
  ExpenseItem,
  Loan,
  Employee,
  BankAccount,
  CashFlowDelay,
  CashFlowExpense,
} from './types';

// ============================================================
// SHEET DEFINITIONS - הגדרת עמודות לכל גיליון
// ============================================================

const SHEET_INCOME = 'הכנסות';
const SHEET_EXPENSES = 'הוצאות';
const SHEET_EMPLOYEES = 'עובדים';
const SHEET_LOANS = 'הלוואות';
const SHEET_BANK_ACCOUNTS = 'חשבונות בנק';
const SHEET_DELAYS = 'עיכובים ודחיות';
const SHEET_CUSTOM_EXPENSES = 'תשלומים חד-פעמיים';
const SHEET_BALANCE_SHEET = 'מאזן';
const SHEET_SETTINGS = 'הגדרות';
const SHEET_INSTRUCTIONS = 'הוראות';

// ============================================================
// EXPORT - ייצוא נתונים לאקסל
// ============================================================

export interface ExportInput {
  settings?: PeriodSettings | null;
  budget?: BudgetData | null;
  cashFlow?: CashFlowData | null;
  balanceSheet?: BalanceSheetData | null;
  scenarioName?: string;
}

export function exportToExcel(input: ExportInput, filename?: string): void {
  const wb = XLSX.utils.book_new();

  // 1. הוראות
  const instructionsData = [
    ['מערכת ייצוא וייבוא - FinCalc Pro'],
    [''],
    ['הוראות:'],
    ['1. כל גיליון מייצג סוג אחד של נתונים'],
    ['2. השאר את שורת הכותרת (שורה 1) כפי שהיא'],
    ['3. הזן את הנתונים בשורות הבאות'],
    ['4. ניתן להוסיף כמה שורות שצריך'],
    ['5. לייבוא חזרה - העלה את הקובץ במערכת'],
    [''],
    ['גיליונות:'],
    [SHEET_SETTINGS, 'הגדרות שנתיות (תאריך התחלה, תקופה, יתרת פתיחה)'],
    [SHEET_INCOME, 'הכנסות חודשיות עם תאריכי התחלה ותקופה'],
    [SHEET_EXPENSES, 'הוצאות לפי קטגוריה'],
    [SHEET_EMPLOYEES, 'עובדים עם שכר ותפקיד'],
    [SHEET_LOANS, 'הלוואות (קרן, ריבית, תקופה)'],
    [SHEET_BANK_ACCOUNTS, 'חשבונות בנק נוכחיים'],
    [SHEET_DELAYS, 'עיכובי גביה ודחיות תשלום'],
    [SHEET_CUSTOM_EXPENSES, 'תשלומים חד-פעמיים'],
    [SHEET_BALANCE_SHEET, 'נתוני מאזן'],
    [''],
    ['📅 מועד ייצוא:', new Date().toLocaleString('he-IL')],
    ['🏢 שם תרחיש:', input.scenarioName || 'תרחיש'],
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
  wsInstructions['!cols'] = [{ wch: 25 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, SHEET_INSTRUCTIONS);

  // 2. הגדרות
  if (input.settings) {
    const settingsData = [
      ['פרמטר', 'ערך', 'הסבר'],
      ['חודש התחלה (YYYY-MM)', input.settings.startMonth, 'תאריך תחילת התקופה'],
      ['מספר חודשים להציג', input.settings.monthsToShow, 'מ-12 ועד 36'],
      ['שנת מס', input.settings.fiscalYear, 'לשנת המס'],
      ['מטבע', input.settings.currency, 'ILS / USD / EUR'],
      ['יתרת פתיחה', input.settings.openingBalance, 'יתרת מזומנים בתחילת התקופה'],
      ['שיעור מס (%)', input.settings.taxRate, 'מס חברות / יחיד'],
      ['ענף', input.settings.industry, 'ענף הפעילות'],
      ['שם חברה', input.settings.companyName, 'לזיהוי בדוחות'],
    ];
    const wsSettings = XLSX.utils.aoa_to_sheet(settingsData);
    wsSettings['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, wsSettings, SHEET_SETTINGS);
  }

  // 3. הכנסות
  const incomeRows = [
    ['שם', 'סכום חודשי', 'חודש התחלה (0-11)', 'תקופה (חודשים)', 'גידול שנתי %', 'תנאי תשלום (ימים)', 'סטטוס'],
  ];
  if (input.budget?.income) {
    for (const inc of input.budget.income) {
      incomeRows.push([
        inc.name,
        String(inc.amount),
        String(inc.startMonth),
        String(inc.duration),
        String(inc.growthPct ?? 0),
        String(inc.paymentTerms ?? 0),
        inc.status ?? 'expected',
      ]);
    }
  }
  const wsIncome = XLSX.utils.aoa_to_sheet(incomeRows);
  wsIncome['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsIncome, SHEET_INCOME);

  // 4. הוצאות
  const expenseRows = [
    ['שם', 'סכום חודשי', 'קטגוריה', 'חודש התחלה', 'תקופה', 'תנאי תשלום (ימים)'],
  ];
  if (input.budget?.expenses) {
    for (const exp of input.budget.expenses) {
      expenseRows.push([
        exp.name,
        String(exp.amount),
        exp.category,
        String(exp.startMonth),
        String(exp.duration),
        String(exp.paymentTerms ?? 0),
      ]);
    }
  }
  const wsExpenses = XLSX.utils.aoa_to_sheet(expenseRows);
  wsExpenses['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsExpenses, SHEET_EXPENSES);

  // 5. עובדים
  const empRows = [['שם', 'מחלקה', 'שכר חודשי', 'חודש התחלה', 'חודש סיום (-1=ממשיך)', 'תפקיד']];
  if (input.budget?.employees) {
    for (const e of input.budget.employees) {
      empRows.push([
        e.name,
        e.department,
        String(e.monthlySalary),
        String(e.startMonth),
        String(e.endMonth ?? -1),
        e.position ?? '',
      ]);
    }
  }
  const wsEmp = XLSX.utils.aoa_to_sheet(empRows);
  wsEmp['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsEmp, SHEET_EMPLOYEES);

  // 6. הלוואות
  const loanRows = [
    ['שם', 'סכום קרן', 'תקופה (חודשים)', 'ריבית שנתית %', 'חודש התחלה', 'סוג'],
  ];
  if (input.budget?.loans) {
    for (const l of input.budget.loans) {
      loanRows.push([
        l.name,
        String(l.amount),
        String(l.termMonths),
        String(l.annualRate),
        String(l.startMonth),
        l.type ?? 'bank',
      ]);
    }
  }
  const wsLoans = XLSX.utils.aoa_to_sheet(loanRows);
  wsLoans['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsLoans, SHEET_LOANS);

  // 7. חשבונות בנק
  const bankRows = [['שם / בנק', 'יתרה', 'לתאריך']];
  if (input.cashFlow?.accounts) {
    for (const a of input.cashFlow.accounts) {
      bankRows.push([a.name, String(a.balance), a.asOfDate]);
    }
  }
  const wsBank = XLSX.utils.aoa_to_sheet(bankRows);
  wsBank['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsBank, SHEET_BANK_ACCOUNTS);

  // 8. עיכובים
  const delayRows = [
    ['סוג (collection_delay/payment_delay)', 'מזהה פריט', 'ימי עיכוב', 'השפעה על סכום %', 'פיצול תשלום (כן/לא)', 'מספר תשלומים', 'סיבה'],
  ];
  if (input.cashFlow?.delays) {
    for (const d of input.cashFlow.delays) {
      delayRows.push([
        d.type,
        d.itemId,
        String(d.delayDays),
        String(d.amountImpact ?? 0),
        d.splitPayment ? 'כן' : 'לא',
        String(d.splitCount ?? 1),
        d.reason ?? '',
      ]);
    }
  }
  const wsDelays = XLSX.utils.aoa_to_sheet(delayRows);
  wsDelays['!cols'] = [{ wch: 25 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsDelays, SHEET_DELAYS);

  // 9. תשלומים חד-פעמיים
  const customRows = [
    ['שם', 'קטגוריה', 'סכום', 'תאריך', 'ימי תשלום', 'סטטוס'],
  ];
  if (input.cashFlow?.customExpenses) {
    for (const e of input.cashFlow.customExpenses) {
      customRows.push([
        e.name,
        e.category,
        String(e.amount),
        e.date,
        String(e.paymentTerms),
        e.status,
      ]);
    }
  }
  const wsCustom = XLSX.utils.aoa_to_sheet(customRows);
  wsCustom['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsCustom, SHEET_CUSTOM_EXPENSES);

  // 10. מאזן
  if (input.balanceSheet) {
    const bs = input.balanceSheet;
    const bsRows = [
      ['סעיף', 'סכום', 'הסבר'],
      ['נכסים שוטפים:', '', ''],
      ['מזומנים ושווי מזומנים', String(bs.cashAndEquivalents ?? 0), 'יתרות בנק נוזלות'],
      ['חייבים', String(bs.accountsReceivable ?? 0), 'חובות לקוחות'],
      ['מלאי', String(bs.inventory ?? 0), ''],
      ['סך נכסים שוטפים', String(bs.currentAssets ?? 0), ''],
      ['', '', ''],
      ['נכסים קבועים:', '', ''],
      ['נכסים קבועים', String(bs.fixedAssets ?? 0), 'ציוד, נדל"ן, וכו'],
      ['', '', ''],
      ['סך הכל נכסים', String(bs.totalAssets ?? 0), ''],
      ['', '', ''],
      ['התחייבויות שוטפות:', '', ''],
      ['ספקים', String(bs.accountsPayable ?? 0), 'חובות לספקים'],
      ['הלוואות לטווח קצר', String(bs.shortTermDebt ?? 0), ''],
      ['סך התחייבויות שוטפות', String(bs.currentLiabilities ?? 0), ''],
      ['', '', ''],
      ['התחייבויות לטווח ארוך:', '', ''],
      ['הלוואות לטווח ארוך', String(bs.longTermDebt ?? 0), ''],
      ['סך התחייבויות', String(bs.totalLiabilities ?? 0), ''],
      ['', '', ''],
      ['הון עצמי:', '', ''],
      ['סך הון עצמי', String(bs.totalEquity ?? 0), ''],
      ['רווחים נצברים', String(bs.retainedEarnings ?? 0), ''],
    ];
    const wsBS = XLSX.utils.aoa_to_sheet(bsRows);
    wsBS['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsBS, SHEET_BALANCE_SHEET);
  }

  // יצירת שם קובץ
  const date = new Date().toISOString().slice(0, 10);
  const finalName = filename ?? `FinCalc_${input.scenarioName || 'export'}_${date}.xlsx`;

  // הורדת הקובץ
  XLSX.writeFile(wb, finalName);
}

// ============================================================
// IMPORT - ייבוא נתונים מאקסל
// ============================================================

export interface ImportResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  imported: {
    settings?: Partial<PeriodSettings>;
    income?: Omit<IncomeItem, 'id'>[];
    expenses?: Omit<ExpenseItem, 'id'>[];
    employees?: Omit<Employee, 'id'>[];
    loans?: Omit<Loan, 'id'>[];
    bankAccounts?: Omit<BankAccount, 'id'>[];
    delays?: Omit<CashFlowDelay, 'id'>[];
    customExpenses?: Omit<CashFlowExpense, 'id'>[];
    balanceSheet?: Partial<BalanceSheetData>;
  };
}

export async function importFromExcel(file: File): Promise<ImportResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const imported: ImportResult['imported'] = {};

  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });

    // הגדרות
    if (wb.SheetNames.includes(SHEET_SETTINGS)) {
      const ws = wb.Sheets[SHEET_SETTINGS];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const settings: Partial<PeriodSettings> = {};
      for (const row of rows.slice(1)) {
        const r = row as unknown[];
        const key = String(r[0] ?? '');
        const value = r[1];
        if (key.includes('חודש התחלה') && typeof value === 'string') settings.startMonth = value;
        else if (key.includes('מספר חודשים')) settings.monthsToShow = Number(value);
        else if (key.includes('שנת מס')) settings.fiscalYear = Number(value);
        else if (key.includes('מטבע') && typeof value === 'string')
          settings.currency = value as PeriodSettings['currency'];
        else if (key.includes('יתרת פתיחה')) settings.openingBalance = Number(value);
        else if (key.includes('שיעור מס')) settings.taxRate = Number(value);
      }
      if (Object.keys(settings).length > 0) imported.settings = settings;
    }

    // הכנסות
    if (wb.SheetNames.includes(SHEET_INCOME)) {
      const ws = wb.Sheets[SHEET_INCOME];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const income: Omit<IncomeItem, 'id'>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue;
        income.push({
          name: String(r[0]),
          amount: Number(r[1]) || 0,
          startMonth: Number(r[2]) || 0,
          duration: Number(r[3]) || 12,
          growthPct: Number(r[4]) || 0,
          paymentTerms: Number(r[5]) || 0,
          status: (String(r[6] ?? 'expected') as IncomeItem['status']) || 'expected',
        });
      }
      if (income.length > 0) imported.income = income;
    }

    // הוצאות
    if (wb.SheetNames.includes(SHEET_EXPENSES)) {
      const ws = wb.Sheets[SHEET_EXPENSES];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const expenses: Omit<ExpenseItem, 'id'>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue;
        expenses.push({
          name: String(r[0]),
          amount: Number(r[1]) || 0,
          isPct: false,
          percentage: 0,
          category: (String(r[2] ?? 'operating') as ExpenseItem['category']) || 'operating',
          startMonth: Number(r[3]) || 0,
          duration: Number(r[4]) || 12,
          paymentTerms: Number(r[5]) || 0,
        });
      }
      if (expenses.length > 0) imported.expenses = expenses;
    }

    // עובדים
    if (wb.SheetNames.includes(SHEET_EMPLOYEES)) {
      const ws = wb.Sheets[SHEET_EMPLOYEES];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const employees: Omit<Employee, 'id'>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue;
        const endMonthVal = Number(r[4]);
        employees.push({
          name: String(r[0]),
          department: (String(r[1] ?? 'operations') as Employee['department']),
          monthlySalary: Number(r[2]) || 0,
          startMonth: Number(r[3]) || 0,
          endMonth: endMonthVal === -1 ? null : endMonthVal,
          position: r[5] ? String(r[5]) : undefined,
        });
      }
      if (employees.length > 0) imported.employees = employees;
    }

    // הלוואות
    if (wb.SheetNames.includes(SHEET_LOANS)) {
      const ws = wb.Sheets[SHEET_LOANS];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const loans: Omit<Loan, 'id'>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue;
        loans.push({
          name: String(r[0]),
          amount: Number(r[1]) || 0,
          termMonths: Number(r[2]) || 60,
          annualRate: Number(r[3]) || 0,
          startMonth: Number(r[4]) || 0,
          type: (String(r[5] ?? 'bank') as Loan['type']) || 'bank',
        });
      }
      if (loans.length > 0) imported.loans = loans;
    }

    // חשבונות בנק
    if (wb.SheetNames.includes(SHEET_BANK_ACCOUNTS)) {
      const ws = wb.Sheets[SHEET_BANK_ACCOUNTS];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const accounts: Omit<BankAccount, 'id'>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue;
        accounts.push({
          name: String(r[0]),
          balance: Number(r[1]) || 0,
          asOfDate: String(r[2] ?? new Date().toISOString().slice(0, 10)),
        });
      }
      if (accounts.length > 0) imported.bankAccounts = accounts;
    }

    // עיכובים
    if (wb.SheetNames.includes(SHEET_DELAYS)) {
      const ws = wb.Sheets[SHEET_DELAYS];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const delays: Omit<CashFlowDelay, 'id'>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue;
        delays.push({
          type: (String(r[0]) as CashFlowDelay['type']) || 'collection_delay',
          itemId: String(r[1] ?? ''),
          delayDays: Number(r[2]) || 0,
          amountImpact: Number(r[3]) || 0,
          splitPayment: String(r[4] ?? '') === 'כן',
          splitCount: Number(r[5]) || 1,
          reason: r[6] ? String(r[6]) : undefined,
        });
      }
      if (delays.length > 0) imported.delays = delays;
    }

    // תשלומים חד-פעמיים
    if (wb.SheetNames.includes(SHEET_CUSTOM_EXPENSES)) {
      const ws = wb.Sheets[SHEET_CUSTOM_EXPENSES];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const customExpenses: Omit<CashFlowExpense, 'id'>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[0]) continue;
        customExpenses.push({
          name: String(r[0]),
          category: (String(r[1] ?? 'other') as CashFlowExpense['category']) || 'other',
          amount: Number(r[2]) || 0,
          date: String(r[3] ?? new Date().toISOString().slice(0, 10)),
          paymentTerms: Number(r[4]) || 0,
          status: (String(r[5] ?? 'pending') as CashFlowExpense['status']) || 'pending',
        });
      }
      if (customExpenses.length > 0) imported.customExpenses = customExpenses;
    }

    // מאזן
    if (wb.SheetNames.includes(SHEET_BALANCE_SHEET)) {
      const ws = wb.Sheets[SHEET_BALANCE_SHEET];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
      const bs: Partial<BalanceSheetData> = {};
      for (const row of rows.slice(1)) {
        const r = row as unknown[];
        const key = String(r[0] ?? '');
        const value = Number(r[1]);
        if (isNaN(value)) continue;
        if (key.includes('מזומנים')) bs.cashAndEquivalents = value;
        else if (key.includes('חייבים')) bs.accountsReceivable = value;
        else if (key.includes('מלאי')) bs.inventory = value;
        else if (key.includes('סך נכסים שוטפים')) bs.currentAssets = value;
        else if (key.includes('נכסים קבועים')) bs.fixedAssets = value;
        else if (key.includes('סך הכל נכסים') || key === 'סה"כ נכסים') bs.totalAssets = value;
        else if (key.includes('ספקים')) bs.accountsPayable = value;
        else if (key.includes('הלוואות לטווח קצר')) bs.shortTermDebt = value;
        else if (key.includes('סך התחייבויות שוטפות')) bs.currentLiabilities = value;
        else if (key.includes('הלוואות לטווח ארוך')) bs.longTermDebt = value;
        else if (key.includes('סך התחייבויות')) bs.totalLiabilities = value;
        else if (key.includes('סך הון')) bs.totalEquity = value;
        else if (key.includes('רווחים נצברים')) bs.retainedEarnings = value;
      }
      if (Object.keys(bs).length > 0) imported.balanceSheet = bs;
    }

    return { success: true, errors, warnings, imported };
  } catch (e) {
    errors.push(`שגיאה בקריאת הקובץ: ${(e as Error).message}`);
    return { success: false, errors, warnings, imported };
  }
}

// ============================================================
// TEMPLATE - הורדת תבנית ריקה
// ============================================================

export function downloadTemplate(): void {
  exportToExcel(
    {
      settings: {
        startMonth: '2026-01',
        monthsToShow: 12,
        fiscalYear: 2026,
        currency: 'ILS',
        openingBalance: 0,
        taxRate: 23,
        industry: 'services',
        companyName: 'תבנית',
      },
      budget: {
        income: [
          {
            id: 'sample',
            name: 'דוגמה: מכירות חודשיות',
            amount: 50000,
            startMonth: 0,
            duration: 12,
            growthPct: 5,
            paymentTerms: 30,
            status: 'expected',
          },
        ],
        expenses: [
          {
            id: 'sample',
            name: 'דוגמה: שכר דירה משרד',
            amount: 5000,
            isPct: false,
            percentage: 0,
            category: 'operating',
            startMonth: 0,
            duration: 12,
            paymentTerms: 0,
          },
        ],
        loans: [],
        employees: [],
      },
      cashFlow: {
        accounts: [
          {
            id: 'sample',
            name: 'דוגמה: בנק לאומי',
            balance: 100000,
            asOfDate: new Date().toISOString().slice(0, 10),
          },
        ],
        delays: [],
        customExpenses: [],
      },
    },
    'FinCalc_Template.xlsx',
  );
}
