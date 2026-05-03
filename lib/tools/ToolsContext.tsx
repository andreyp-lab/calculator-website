'use client';

/**
 * React Context למערכת תקציב + תזרים + ניתוח
 *
 * מנהל את כל ה-state של הכלים ומספק actions לעדכון
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  Scenario,
  BudgetData,
  CashFlowData,
  PeriodSettings,
  BalanceSheetData,
  IncomeItem,
  ExpenseItem,
  Loan,
  Employee,
} from './types';
import {
  loadFromStorage,
  saveToStorage,
  createScenario,
  deleteScenario,
  updateCurrentScenario,
  getCurrentScenario,
} from './storage';

// ============================================================
// CONTEXT TYPE
// ============================================================

interface ToolsContextValue {
  // Current scenario
  scenario: Scenario | null;
  scenarioId: string;
  scenariosList: Array<{ id: string; name: string }>;

  // Quick access
  settings: PeriodSettings | null;
  budget: BudgetData | null;
  cashFlow: CashFlowData | null;
  balanceSheet: BalanceSheetData | null;

  // Settings
  updateSettings: (updates: Partial<PeriodSettings>) => void;

  // Budget actions
  addIncome: (income: Omit<IncomeItem, 'id'>) => void;
  updateIncome: (id: string, updates: Partial<IncomeItem>) => void;
  deleteIncome: (id: string) => void;

  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;

  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;

  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Balance Sheet
  updateBalanceSheet: (updates: Partial<BalanceSheetData>) => void;

  // Scenario management
  switchScenario: (id: string) => void;
  createNewScenario: (name: string, description?: string, baseId?: string) => void;
  deleteCurrentScenario: () => void;

  // Reset
  resetAll: () => void;
}

const ToolsContext = createContext<ToolsContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => loadFromStorage());
  const [hydrated, setHydrated] = useState(false);

  // Hydration: load from localStorage on client
  useEffect(() => {
    setState(loadFromStorage());
    setHydrated(true);
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (hydrated) {
      saveToStorage(state);
    }
  }, [state, hydrated]);

  const scenario = getCurrentScenario(state);
  const scenariosList = Object.values(state.scenarios).map((s) => ({
    id: s.id,
    name: s.name,
  }));

  // Generic ID generator
  const newId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // ============================================================
  // SETTINGS
  // ============================================================

  const updateSettings = useCallback((updates: Partial<PeriodSettings>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        settings: { ...current.settings, ...updates },
      });
    });
  }, []);

  // ============================================================
  // INCOME
  // ============================================================

  const addIncome = useCallback((income: Omit<IncomeItem, 'id'>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      const newItem: IncomeItem = { ...income, id: newId() };
      return updateCurrentScenario(prev, {
        budget: { ...current.budget, income: [...current.budget.income, newItem] },
      });
    });
  }, []);

  const updateIncome = useCallback((id: string, updates: Partial<IncomeItem>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          income: current.budget.income.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        },
      });
    });
  }, []);

  const deleteIncome = useCallback((id: string) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          income: current.budget.income.filter((i) => i.id !== id),
          // הסר גם הוצאות מקושרות
          expenses: current.budget.expenses.filter((e) => e.linkedIncomeId !== id),
        },
      });
    });
  }, []);

  // ============================================================
  // EXPENSES
  // ============================================================

  const addExpense = useCallback((expense: Omit<ExpenseItem, 'id'>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      const newItem: ExpenseItem = { ...expense, id: newId() };
      return updateCurrentScenario(prev, {
        budget: { ...current.budget, expenses: [...current.budget.expenses, newItem] },
      });
    });
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<ExpenseItem>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          expenses: current.budget.expenses.map((e) =>
            e.id === id ? { ...e, ...updates } : e,
          ),
        },
      });
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          expenses: current.budget.expenses.filter((e) => e.id !== id),
        },
      });
    });
  }, []);

  // ============================================================
  // LOANS
  // ============================================================

  const addLoan = useCallback((loan: Omit<Loan, 'id'>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      const newItem: Loan = { ...loan, id: newId() };
      return updateCurrentScenario(prev, {
        budget: { ...current.budget, loans: [...current.budget.loans, newItem] },
      });
    });
  }, []);

  const updateLoan = useCallback((id: string, updates: Partial<Loan>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          loans: current.budget.loans.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        },
      });
    });
  }, []);

  const deleteLoan = useCallback((id: string) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          loans: current.budget.loans.filter((l) => l.id !== id),
        },
      });
    });
  }, []);

  // ============================================================
  // EMPLOYEES
  // ============================================================

  const addEmployee = useCallback((employee: Omit<Employee, 'id'>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      const newItem: Employee = { ...employee, id: newId() };
      return updateCurrentScenario(prev, {
        budget: { ...current.budget, employees: [...current.budget.employees, newItem] },
      });
    });
  }, []);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          employees: current.budget.employees.map((e) =>
            e.id === id ? { ...e, ...updates } : e,
          ),
        },
      });
    });
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        budget: {
          ...current.budget,
          employees: current.budget.employees.filter((e) => e.id !== id),
        },
      });
    });
  }, []);

  // ============================================================
  // BALANCE SHEET
  // ============================================================

  const updateBalanceSheet = useCallback((updates: Partial<BalanceSheetData>) => {
    setState((prev) => {
      const current = getCurrentScenario(prev);
      if (!current) return prev;
      return updateCurrentScenario(prev, {
        balanceSheet: { ...(current.balanceSheet ?? createEmptyBS()), ...updates },
      });
    });
  }, []);

  // ============================================================
  // SCENARIO MANAGEMENT
  // ============================================================

  const switchScenario = useCallback((id: string) => {
    setState((prev) => {
      if (!prev.scenarios[id]) return prev;
      return { ...prev, currentScenarioId: id };
    });
  }, []);

  const createNewScenario = useCallback(
    (name: string, description: string = '', baseId?: string) => {
      setState((prev) => createScenario(prev, name, description, baseId));
    },
    [],
  );

  const deleteCurrentScenario = useCallback(() => {
    setState((prev) => deleteScenario(prev, prev.currentScenarioId));
  }, []);

  const resetAll = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fincalc_pro_data');
    }
    setState(loadFromStorage());
  }, []);

  // ============================================================
  // BUILD VALUE
  // ============================================================

  const value: ToolsContextValue = {
    scenario,
    scenarioId: state.currentScenarioId,
    scenariosList,
    settings: scenario?.settings ?? null,
    budget: scenario?.budget ?? null,
    cashFlow: scenario?.cashFlow ?? null,
    balanceSheet: scenario?.balanceSheet ?? null,
    updateSettings,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    addLoan,
    updateLoan,
    deleteLoan,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    updateBalanceSheet,
    switchScenario,
    createNewScenario,
    deleteCurrentScenario,
    resetAll,
  };

  return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
}

function createEmptyBS(): BalanceSheetData {
  return {
    cashAndEquivalents: 0,
    accountsReceivable: 0,
    inventory: 0,
    currentAssets: 0,
    fixedAssets: 0,
    totalAssets: 0,
    accountsPayable: 0,
    shortTermDebt: 0,
    currentLiabilities: 0,
    longTermDebt: 0,
    totalLiabilities: 0,
    totalEquity: 0,
  };
}

// ============================================================
// HOOK
// ============================================================

export function useTools() {
  const ctx = useContext(ToolsContext);
  if (!ctx) {
    throw new Error('useTools must be used within ToolsProvider');
  }
  return ctx;
}
