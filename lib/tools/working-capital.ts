import type { WorkingCapitalScenario } from './types';

/**
 * Calculates a user-selected working-capital scenario. DSO/DPO/DIO must come
 * from the user or verified accounting data; this function does not infer a
 * current state from budget totals.
 */
export function calculateWorkingCapitalScenario(
  revenue: number,
  cogs: number,
  dso: number,
  dpo: number,
  dio: number,
): WorkingCapitalScenario {
  const accountsReceivable = (revenue / 365) * dso;
  const inventory = (cogs / 365) * dio;
  const accountsPayable = (cogs / 365) * dpo;
  return {
    dso,
    dpo,
    dio,
    cashImpact: 0,
    ccc: dso + dio - dpo,
    netWorkingCapital: accountsReceivable + inventory - accountsPayable,
  };
}
