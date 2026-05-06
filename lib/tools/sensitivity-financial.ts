/**
 * Financial Sensitivity Analysis Engine
 *
 * בודק את ההשפעה של שינויים במשתנים מרכזיים על:
 * - DSCR
 * - רווח נקי
 * - תזרים מזומנים
 * - יחס שוטף
 *
 * תרחישים מהירים: מיתון, אינפלציה, עליית ריבית, תרחיש קיצוני.
 */

export type SensitivityVariable =
  | 'revenue'
  | 'cogs'
  | 'opex'
  | 'interest'
  | 'principalPayment';

export interface SensitivityInput {
  revenue: number;
  cogs: number;
  opex: number;
  depreciation: number;
  interestExpense: number;
  taxExpense: number;
  principalPayment: number;
}

export interface SensitivityCell {
  changePercent: number;
  newValue: number;
  baseValue: number;
  ebitda: number;
  netProfit: number;
  netProfitChange: number; // %
  dscr: number;
  dscrChange: number; // %
  npm: number; // %
  status: 'excellent' | 'good' | 'fair' | 'critical';
}

export interface SensitivityResult {
  variable: SensitivityVariable;
  variableLabel: string;
  baseValue: number;
  baseDSCR: number;
  baseNetProfit: number;
  results: SensitivityCell[];
  /** % שינוי ב-DSCR=1 (נקודת שבירה) */
  breakEvenChange: number | null;
  insights: string[];
}

const VARIABLE_LABELS: Record<SensitivityVariable, string> = {
  revenue: 'הכנסות',
  cogs: 'עלות מכר',
  opex: 'הוצאות תפעול',
  interest: 'הוצאות ריבית',
  principalPayment: 'החזר חוב שנתי',
};

function calculateMetricsForScenario(
  base: SensitivityInput,
  variable: SensitivityVariable,
  changePercent: number,
): { ebitda: number; netProfit: number; dscr: number } {
  const factor = 1 + changePercent / 100;
  const modified = { ...base };

  switch (variable) {
    case 'revenue':
      modified.revenue *= factor;
      break;
    case 'cogs':
      modified.cogs *= factor;
      break;
    case 'opex':
      modified.opex *= factor;
      break;
    case 'interest':
      modified.interestExpense *= factor;
      break;
    case 'principalPayment':
      modified.principalPayment *= factor;
      break;
  }

  const grossProfit = modified.revenue - modified.cogs;
  const operatingProfit = grossProfit - modified.opex;
  const ebitda = operatingProfit + modified.depreciation;
  const preTaxProfit = operatingProfit - modified.interestExpense;
  // tax stays at same rate (% of pre-tax profit, with minimum of 0)
  const basePreTax = Math.max(0.01, base.revenue - base.cogs - base.opex - base.interestExpense);
  const baseTaxRate = basePreTax > 0 && base.taxExpense > 0 ? base.taxExpense / basePreTax : 0.23;
  const tax = preTaxProfit > 0 ? preTaxProfit * baseTaxRate : 0;
  const netProfit = preTaxProfit - tax;

  const debtService = modified.principalPayment + modified.interestExpense;
  const dscr = debtService > 0 ? ebitda / debtService : ebitda > 0 ? 999 : 0;

  return { ebitda, netProfit, dscr };
}

function classifyDSCR(dscr: number): SensitivityCell['status'] {
  if (dscr >= 1.5) return 'excellent';
  if (dscr >= 1.25) return 'good';
  if (dscr >= 1.0) return 'fair';
  return 'critical';
}

export function calculateSensitivity(
  input: SensitivityInput,
  variable: SensitivityVariable,
  range: number = 30,
  steps: number = 9,
): SensitivityResult {
  const baseMetrics = calculateMetricsForScenario(input, variable, 0);
  const baseValue = (() => {
    switch (variable) {
      case 'revenue': return input.revenue;
      case 'cogs': return input.cogs;
      case 'opex': return input.opex;
      case 'interest': return input.interestExpense;
      case 'principalPayment': return input.principalPayment;
    }
  })();

  const results: SensitivityCell[] = [];
  const stepSize = (range * 2) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const changePercent = -range + i * stepSize;
    const m = calculateMetricsForScenario(input, variable, changePercent);
    const factor = 1 + changePercent / 100;
    const newValue = baseValue * factor;

    const dscrChange = baseMetrics.dscr > 0 ? ((m.dscr - baseMetrics.dscr) / baseMetrics.dscr) * 100 : 0;
    const netProfitChange =
      baseMetrics.netProfit !== 0
        ? ((m.netProfit - baseMetrics.netProfit) / Math.abs(baseMetrics.netProfit)) * 100
        : 0;

    const npm = input.revenue > 0 ? (m.netProfit / (input.revenue * factor)) * 100 : 0;

    results.push({
      changePercent,
      newValue,
      baseValue,
      ebitda: m.ebitda,
      netProfit: m.netProfit,
      netProfitChange,
      dscr: m.dscr,
      dscrChange,
      npm,
      status: classifyDSCR(m.dscr),
    });
  }

  // Find break-even (DSCR = 1)
  let breakEvenChange: number | null = null;
  for (let i = 0; i < results.length - 1; i++) {
    const a = results[i];
    const b = results[i + 1];
    if ((a.dscr >= 1 && b.dscr < 1) || (a.dscr < 1 && b.dscr >= 1)) {
      const ratio = (1 - a.dscr) / (b.dscr - a.dscr);
      breakEvenChange = a.changePercent + ratio * (b.changePercent - a.changePercent);
      break;
    }
  }

  // Insights
  const insights: string[] = [];
  if (breakEvenChange !== null) {
    insights.push(
      `🎯 נקודת שבירה: שינוי של ${breakEvenChange.toFixed(1)}% ב${VARIABLE_LABELS[variable]} מביא ל-DSCR=1`,
    );
  } else {
    insights.push(`✅ יציבות גבוהה - בכל טווח הבדיקה DSCR נשאר ≥1`);
  }

  const worstCase = results[0];
  const bestCase = results[results.length - 1];
  if (worstCase.dscr < 1) {
    insights.push(`⚠️ בתרחיש שלילי קיצוני (-${range}%) DSCR נופל ל-${worstCase.dscr.toFixed(2)}`);
  }
  if (bestCase.dscr > 3) {
    insights.push(`💪 בתרחיש חיובי קיצוני (+${range}%) DSCR מגיע ל-${bestCase.dscr.toFixed(2)}`);
  }

  return {
    variable,
    variableLabel: VARIABLE_LABELS[variable],
    baseValue,
    baseDSCR: baseMetrics.dscr,
    baseNetProfit: baseMetrics.netProfit,
    results,
    breakEvenChange,
    insights,
  };
}

// ============================================================
// QUICK SCENARIOS
// ============================================================

export type QuickScenarioType = 'recession' | 'inflation' | 'interest_rise' | 'extreme';

export interface QuickScenarioResult {
  name: string;
  description: string;
  changes: Partial<Record<SensitivityVariable, number>>;
  base: { ebitda: number; netProfit: number; dscr: number };
  scenario: { ebitda: number; netProfit: number; dscr: number };
  changes_metrics: { ebitdaChange: number; netProfitChange: number; dscrChange: number };
  canRepay: boolean;
  status: 'safe' | 'tight' | 'critical';
  recommendation: string;
}

const SCENARIO_DEFINITIONS: Record<
  QuickScenarioType,
  {
    name: string;
    description: string;
    changes: Partial<Record<SensitivityVariable, number>>;
  }
> = {
  recession: {
    name: 'מיתון כלכלי',
    description: 'ירידה של 20% בהכנסות עקב מיתון',
    changes: { revenue: -20 },
  },
  inflation: {
    name: 'אינפלציה גבוהה',
    description: 'עלייה של 15% בעלויות תפעול ו-10% בעלות מכר',
    changes: { opex: 15, cogs: 10 },
  },
  interest_rise: {
    name: 'עליית ריבית',
    description: 'עלייה של 50% בהוצאות הריבית',
    changes: { interest: 50 },
  },
  extreme: {
    name: 'תרחיש קיצוני משולב',
    description: 'מיתון + אינפלציה + עליית ריבית בו-זמנית',
    changes: { revenue: -15, opex: 10, cogs: 8, interest: 30 },
  },
};

export function calculateQuickScenario(
  input: SensitivityInput,
  scenario: QuickScenarioType,
): QuickScenarioResult {
  const def = SCENARIO_DEFINITIONS[scenario];
  const base = calculateMetricsForScenario(input, 'revenue', 0);

  // Apply all changes
  const modified = { ...input };
  for (const [variable, change] of Object.entries(def.changes)) {
    const factor = 1 + (change as number) / 100;
    switch (variable as SensitivityVariable) {
      case 'revenue':
        modified.revenue *= factor;
        break;
      case 'cogs':
        modified.cogs *= factor;
        break;
      case 'opex':
        modified.opex *= factor;
        break;
      case 'interest':
        modified.interestExpense *= factor;
        break;
    }
  }

  const grossProfit = modified.revenue - modified.cogs;
  const operatingProfit = grossProfit - modified.opex;
  const ebitda = operatingProfit + modified.depreciation;
  const preTaxProfit = operatingProfit - modified.interestExpense;
  const inputPreTax = Math.max(0.01, input.revenue - input.cogs - input.opex - input.interestExpense);
  const baseTaxRate = inputPreTax > 0 && input.taxExpense > 0 ? input.taxExpense / inputPreTax : 0.23;
  const tax = preTaxProfit > 0 ? preTaxProfit * baseTaxRate : 0;
  const netProfit = preTaxProfit - tax;

  const debtService = modified.principalPayment + modified.interestExpense;
  const dscr = debtService > 0 ? ebitda / debtService : ebitda > 0 ? 999 : 0;

  const canRepay = dscr >= 1;
  let status: QuickScenarioResult['status'];
  if (dscr >= 1.5) status = 'safe';
  else if (dscr >= 1.0) status = 'tight';
  else status = 'critical';

  let recommendation: string;
  if (status === 'safe') {
    recommendation = '✅ החברה עמידה בתרחיש זה - יכולת החזר חוב נשמרת';
  } else if (status === 'tight') {
    recommendation = '⚠️ יכולת החזר על הגבול - מומלץ לבנות רזרבה';
  } else {
    recommendation = '🚨 בתרחיש זה החברה לא תוכל לעמוד בהחזרי החוב - דרושה תוכנית גיבוי';
  }

  return {
    name: def.name,
    description: def.description,
    changes: def.changes,
    base,
    scenario: { ebitda, netProfit, dscr },
    changes_metrics: {
      ebitdaChange: base.ebitda !== 0 ? ((ebitda - base.ebitda) / Math.abs(base.ebitda)) * 100 : 0,
      netProfitChange:
        base.netProfit !== 0 ? ((netProfit - base.netProfit) / Math.abs(base.netProfit)) * 100 : 0,
      dscrChange: base.dscr > 0 ? ((dscr - base.dscr) / base.dscr) * 100 : 0,
    },
    canRepay,
    status,
    recommendation,
  };
}

export function calculateAllQuickScenarios(input: SensitivityInput): QuickScenarioResult[] {
  return ['recession', 'inflation', 'interest_rise', 'extreme'].map((s) =>
    calculateQuickScenario(input, s as QuickScenarioType),
  );
}
