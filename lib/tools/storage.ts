/**
 * Storage layer - שמירה ב-localStorage עם תרחישים מרובים
 */

import { Scenario, BudgetData, CashFlowData, PeriodSettings, BalanceSheetData } from './types';
import { createEmptyBudget, createDefaultSettings } from './budget-engine';
import { createEmptyCashFlow } from './cashflow-engine';
import { createEmptyBalanceSheet } from './financial-analyzer';

const STORAGE_KEY = 'fincalc_pro_data';
const STORAGE_VERSION = '1.0';

interface StorageState {
  version: string;
  scenarios: Record<string, Scenario>;
  currentScenarioId: string;
}

// ============================================================
// LOAD
// ============================================================

export function loadFromStorage(): StorageState {
  if (typeof window === 'undefined') {
    return createEmptyState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();

    const parsed = JSON.parse(raw) as StorageState;

    // Validation
    if (!parsed.scenarios || !parsed.currentScenarioId) {
      return createEmptyState();
    }
    if (!parsed.scenarios[parsed.currentScenarioId]) {
      return createEmptyState();
    }

    return parsed;
  } catch (e) {
    console.error('Error loading from storage:', e);
    return createEmptyState();
  }
}

// ============================================================
// SAVE
// ============================================================

export function saveToStorage(state: StorageState): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('Error saving to storage:', e);
    return false;
  }
}

// ============================================================
// EMPTY STATE FACTORY
// ============================================================

export function createEmptyState(): StorageState {
  const defaultScenario = createEmptyScenario('default', 'תרחיש ברירת מחדל');
  return {
    version: STORAGE_VERSION,
    scenarios: { default: defaultScenario },
    currentScenarioId: 'default',
  };
}

export function createEmptyScenario(id: string, name: string, description: string = ''): Scenario {
  const now = new Date().toISOString();
  return {
    id,
    name,
    description,
    createdAt: now,
    updatedAt: now,
    settings: createDefaultSettings(),
    budget: createEmptyBudget(),
    cashFlow: createEmptyCashFlow(),
    balanceSheet: createEmptyBalanceSheet(),
  };
}

// ============================================================
// SCENARIO OPERATIONS
// ============================================================

export function createScenario(
  state: StorageState,
  name: string,
  description: string = '',
  baseId?: string,
): StorageState {
  const newId = `scenario_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();

  let newScenario: Scenario;

  if (baseId && state.scenarios[baseId]) {
    // העתק מתרחיש קיים
    newScenario = {
      ...JSON.parse(JSON.stringify(state.scenarios[baseId])),
      id: newId,
      name,
      description,
      createdAt: now,
      updatedAt: now,
    };
  } else {
    newScenario = createEmptyScenario(newId, name, description);
  }

  return {
    ...state,
    scenarios: { ...state.scenarios, [newId]: newScenario },
    currentScenarioId: newId,
  };
}

export function deleteScenario(state: StorageState, id: string): StorageState {
  if (id === 'default') {
    console.warn('Cannot delete default scenario');
    return state;
  }

  const newScenarios = { ...state.scenarios };
  delete newScenarios[id];

  return {
    ...state,
    scenarios: newScenarios,
    currentScenarioId: state.currentScenarioId === id ? 'default' : state.currentScenarioId,
  };
}

export function updateCurrentScenario(
  state: StorageState,
  updates: Partial<Omit<Scenario, 'id' | 'createdAt'>>,
): StorageState {
  const current = state.scenarios[state.currentScenarioId];
  if (!current) return state;

  const updated: Scenario = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return {
    ...state,
    scenarios: { ...state.scenarios, [state.currentScenarioId]: updated },
  };
}

export function getCurrentScenario(state: StorageState): Scenario | null {
  return state.scenarios[state.currentScenarioId] ?? null;
}
