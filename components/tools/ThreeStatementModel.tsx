'use client';

/**
 * Three-Statement Financial Model UI
 *
 * 4 טאבים:
 * 1. נתוני עבר (1-3 שנים)
 * 2. הנחות חיזוי
 * 3. דוח רווח והפסד מלא (עבר + תחזית)
 * 4. מאזן ותזרים
 */

import { useState, useMemo, useEffect } from 'react';
import {
  buildThreeStatementModel,
  createEmptyAnnualStatements,
  recomputePnL,
  recomputeBalanceSheet,
  suggestAssumptions,
  defaultAssumptions,
  validateBalanceSheet,
  convertBudgetToBaseYear,
} from '@/lib/tools/three-statement-model';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  INDUSTRY_BENCHMARKS,
} from '@/lib/tools/industry-benchmarks';
import { exportForecastPDF, exportForecastExcel } from '@/lib/tools/forecast-export';
import type {
  AnnualStatements,
  ForecastAssumptions,
  ThreeStatementModel as Model,
  AnnualPnL,
  AnnualBalanceSheet,
  Industry,
} from '@/lib/tools/types';
import { formatCurrency } from '@/lib/tools/format';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import {
  History,
  Settings as SettingsIcon,
  FileText,
  Building2,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Download,
  Upload,
} from 'lucide-react';

type Tab = 'historical' | 'assumptions' | 'pnl' | 'balance';

const STORAGE_KEY = 'three-statement-model-v1';

export function ThreeStatementModelUI() {
  const { budget, settings, balanceSheet } = useTools();
  const [historical, setHistorical] = useState<AnnualStatements[]>(() => {
    if (typeof window === 'undefined') return [createEmptyAnnualStatements(new Date().getFullYear() - 1)];
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '-historical');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [createEmptyAnnualStatements(new Date().getFullYear() - 1)];
  });

  const [assumptions, setAssumptions] = useState<ForecastAssumptions>(() => {
    if (typeof window === 'undefined') return defaultAssumptions(5);
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '-assumptions');
      if (raw) return JSON.parse(raw);
    } catch {}
    return defaultAssumptions(5);
  });

  const [tab, setTab] = useState<Tab>('historical');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY + '-historical', JSON.stringify(historical));
  }, [historical]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY + '-assumptions', JSON.stringify(assumptions));
  }, [assumptions]);

  const model = useMemo<Model | null>(() => {
    try {
      if (historical.length === 0 || historical[0].pnl.revenue === 0) return null;
      return buildThreeStatementModel(historical, assumptions);
    } catch (e) {
      return null;
    }
  }, [historical, assumptions]);

  function autoSuggest() {
    if (historical.length > 0 && historical[0].pnl.revenue > 0) {
      setAssumptions(suggestAssumptions(historical, assumptions.yearsToProject));
    }
  }

  function loadFromBudget() {
    if (!budget || !settings) return;
    const baseYear = convertBudgetToBaseYear(budget, settings, balanceSheet);
    setHistorical([baseYear]);
    setAssumptions(suggestAssumptions([baseYear], assumptions.yearsToProject));
    setTab('pnl');
  }

  function addHistoricalYear() {
    const earliestYear = Math.min(...historical.map((h) => h.year));
    setHistorical([createEmptyAnnualStatements(earliestYear - 1), ...historical]);
  }

  function removeHistoricalYear(year: number) {
    setHistorical(historical.filter((h) => h.year !== year));
  }

  function updateHistorical(year: number, updater: (s: AnnualStatements) => AnnualStatements) {
    setHistorical(historical.map((h) => (h.year === year ? updater(h) : h)));
  }

  return (
    <div className="space-y-4">
      {/* Header + tabs */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            מודל תלת-דוחות (P&L + מאזן + תזרים)
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {budget && settings && (
              <button
                onClick={loadFromBudget}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
              >
                <Upload className="w-3.5 h-3.5" />
                טען מהתקציב הנוכחי
              </button>
            )}
            {model && (
              <>
                <button
                  onClick={() => exportForecastPDF(model, settings?.companyName ?? 'Forecast')}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => exportForecastExcel(model, settings?.companyName ?? 'Forecast')}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Excel
                </button>
              </>
            )}
            <div className="text-xs text-gray-500">
              {historical.length} שנות היסטוריה ← {assumptions.yearsToProject} שנות חיזוי
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {[
            { id: 'historical' as Tab, label: 'נתוני עבר', icon: History },
            { id: 'assumptions' as Tab, label: 'הנחות חיזוי', icon: SettingsIcon },
            { id: 'pnl' as Tab, label: 'רווח והפסד', icon: FileText },
            { id: 'balance' as Tab, label: 'מאזן + תזרים', icon: Building2 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
                  tab === t.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Historical Data Tab */}
      {tab === 'historical' && (
        <HistoricalDataTab
          historical={historical}
          onAddYear={addHistoricalYear}
          onRemoveYear={removeHistoricalYear}
          onUpdate={updateHistorical}
        />
      )}

      {/* Assumptions Tab */}
      {tab === 'assumptions' && (
        <AssumptionsTab
          assumptions={assumptions}
          onChange={setAssumptions}
          onAutoSuggest={autoSuggest}
          hasHistorical={historical.length > 0 && historical[0].pnl.revenue > 0}
          industry={settings?.industry ?? 'services'}
        />
      )}

      {/* P&L Tab */}
      {tab === 'pnl' && (
        <PnLTab model={model} />
      )}

      {/* Balance + Cash Flow Tab */}
      {tab === 'balance' && (
        <BalanceTab model={model} />
      )}
    </div>
  );
}

// ============================================================
// HISTORICAL DATA TAB
// ============================================================

interface HistoricalProps {
  historical: AnnualStatements[];
  onAddYear: () => void;
  onRemoveYear: (year: number) => void;
  onUpdate: (year: number, updater: (s: AnnualStatements) => AnnualStatements) => void;
}

function HistoricalDataTab({ historical, onAddYear, onRemoveYear, onUpdate }: HistoricalProps) {
  const sorted = [...historical].sort((a, b) => a.year - b.year);

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-900">
        💡 הזן 1-3 שנים של נתוני עבר. ככל שיש יותר שנים, החיזוי יהיה מדויק יותר.
        ערכים נגזרים (רווח גולמי, EBITDA, סה"כ נכסים) מחושבים אוטומטית.
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAddYear}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          + הוסף שנה אחורה
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((year) => (
          <YearEditor
            key={year.year}
            statements={year}
            canRemove={historical.length > 1}
            onRemove={() => onRemoveYear(year.year)}
            onUpdate={(updater) => onUpdate(year.year, updater)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// YEAR EDITOR
// ============================================================

interface YearEditorProps {
  statements: AnnualStatements;
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (updater: (s: AnnualStatements) => AnnualStatements) => void;
}

function YearEditor({ statements, canRemove, onRemove, onUpdate }: YearEditorProps) {
  const [section, setSection] = useState<'pnl' | 'bs'>('pnl');

  function updatePnL(field: keyof AnnualPnL, value: number) {
    onUpdate((s) => {
      const newPnl = recomputePnL({ ...s.pnl, [field]: value });
      return { ...s, pnl: newPnl };
    });
  }

  function updateBS(field: keyof AnnualBalanceSheet, value: number) {
    onUpdate((s) => {
      const newBS = recomputeBalanceSheet({ ...s.balanceSheet, [field]: value });
      return { ...s, balanceSheet: newBS };
    });
  }

  const bsValid = validateBalanceSheet(statements.balanceSheet, 1000);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex items-center gap-3">
          <h4 className="font-bold text-gray-900">שנת {statements.year}</h4>
          <div className="flex gap-1">
            <button
              onClick={() => setSection('pnl')}
              className={`px-2 py-1 text-xs rounded ${
                section === 'pnl' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
              }`}
            >
              רווח והפסד
            </button>
            <button
              onClick={() => setSection('bs')}
              className={`px-2 py-1 text-xs rounded ${
                section === 'bs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
              }`}
            >
              מאזן
            </button>
          </div>
          {!bsValid && (
            <span className="flex items-center gap-1 text-xs text-amber-700">
              <AlertCircle className="w-3.5 h-3.5" />
              מאזן לא מאוזן
            </span>
          )}
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
          >
            הסר שנה
          </button>
        )}
      </div>

      <div className="p-4">
        {section === 'pnl' && (
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <NumberField label="הכנסות" value={statements.pnl.revenue} onChange={(v) => updatePnL('revenue', v)} />
            <NumberField label="עלות המכר (COGS)" value={statements.pnl.cogs} onChange={(v) => updatePnL('cogs', v)} />
            <ReadOnlyField label="רווח גולמי" value={statements.pnl.grossProfit} highlight />
            <NumberField label="R&D" value={statements.pnl.rnd} onChange={(v) => updatePnL('rnd', v)} />
            <NumberField label="שיווק ומכירות" value={statements.pnl.marketing} onChange={(v) => updatePnL('marketing', v)} />
            <NumberField label="הוצאות תפעול" value={statements.pnl.operating} onChange={(v) => updatePnL('operating', v)} />
            <ReadOnlyField label="EBITDA" value={statements.pnl.ebitda} highlight />
            <NumberField label="פחת" value={statements.pnl.depreciation} onChange={(v) => updatePnL('depreciation', v)} />
            <ReadOnlyField label="EBIT" value={statements.pnl.ebit} />
            <NumberField label="הוצאות ריבית" value={statements.pnl.interest} onChange={(v) => updatePnL('interest', v)} />
            <NumberField label="מס" value={statements.pnl.tax} onChange={(v) => updatePnL('tax', v)} />
            <ReadOnlyField label="רווח נקי" value={statements.pnl.netProfit} highlight />
          </div>
        )}

        {section === 'bs' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2 text-sm">נכסים</h5>
              <div className="space-y-2 text-sm">
                <NumberField label="מזומן ושווי מזומן" value={statements.balanceSheet.cash} onChange={(v) => updateBS('cash', v)} />
                <NumberField label="לקוחות (AR)" value={statements.balanceSheet.accountsReceivable} onChange={(v) => updateBS('accountsReceivable', v)} />
                <NumberField label="מלאי" value={statements.balanceSheet.inventory} onChange={(v) => updateBS('inventory', v)} />
                <NumberField label="נכסים שוטפים אחרים" value={statements.balanceSheet.otherCurrentAssets} onChange={(v) => updateBS('otherCurrentAssets', v)} />
                <ReadOnlyField label="סה״כ נכסים שוטפים" value={statements.balanceSheet.totalCurrentAssets} />
                <NumberField label="רכוש קבוע (נטו)" value={statements.balanceSheet.fixedAssets} onChange={(v) => updateBS('fixedAssets', v)} />
                <NumberField label="נכסים בלתי מוחשיים" value={statements.balanceSheet.intangibleAssets} onChange={(v) => updateBS('intangibleAssets', v)} />
                <ReadOnlyField label="סה״כ נכסים" value={statements.balanceSheet.totalAssets} highlight />
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2 text-sm">התחייבויות + הון</h5>
              <div className="space-y-2 text-sm">
                <NumberField label="ספקים (AP)" value={statements.balanceSheet.accountsPayable} onChange={(v) => updateBS('accountsPayable', v)} />
                <NumberField label="חוב לזמן קצר" value={statements.balanceSheet.shortTermDebt} onChange={(v) => updateBS('shortTermDebt', v)} />
                <NumberField label="התחייבויות שוטפות אחרות" value={statements.balanceSheet.otherCurrentLiabilities} onChange={(v) => updateBS('otherCurrentLiabilities', v)} />
                <ReadOnlyField label="סה״כ התחייבויות שוטפות" value={statements.balanceSheet.totalCurrentLiabilities} />
                <NumberField label="חוב לזמן ארוך" value={statements.balanceSheet.longTermDebt} onChange={(v) => updateBS('longTermDebt', v)} />
                <ReadOnlyField label="סה״כ התחייבויות" value={statements.balanceSheet.totalLiabilities} />
                <NumberField label="הון מניות" value={statements.balanceSheet.shareCapital} onChange={(v) => updateBS('shareCapital', v)} />
                <NumberField label="עודפים (Retained Earnings)" value={statements.balanceSheet.retainedEarnings} onChange={(v) => updateBS('retainedEarnings', v)} />
                <ReadOnlyField label="סה״כ הון" value={statements.balanceSheet.totalEquity} highlight />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex-1 text-xs text-gray-700">{label}</label>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm text-left"
      />
    </div>
  );
}

function ReadOnlyField({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${highlight ? 'bg-blue-50 px-2 py-1 rounded' : ''}`}>
      <label className={`flex-1 text-xs ${highlight ? 'font-bold text-blue-900' : 'text-gray-600'}`}>{label}</label>
      <span className={`w-32 text-sm text-left ${highlight ? 'font-bold text-blue-900' : 'text-gray-700'}`}>
        {Math.round(value).toLocaleString('he-IL')}
      </span>
    </div>
  );
}

// ============================================================
// ASSUMPTIONS TAB
// ============================================================

interface AssumptionsProps {
  assumptions: ForecastAssumptions;
  onChange: (a: ForecastAssumptions) => void;
  onAutoSuggest: () => void;
  hasHistorical: boolean;
  industry: Industry;
}

function AssumptionsTab({
  assumptions,
  onChange,
  onAutoSuggest,
  hasHistorical,
  industry,
}: AssumptionsProps) {
  const bench = INDUSTRY_BENCHMARKS[industry];
  function update(patch: Partial<ForecastAssumptions>) {
    onChange({ ...assumptions, ...patch });
  }

  function updateArr(key: keyof ForecastAssumptions, idx: number, value: number) {
    const arr = (assumptions[key] as number[] | null) ?? [];
    const next = [...arr];
    while (next.length <= idx) next.push(value);
    next[idx] = value;
    onChange({ ...assumptions, [key]: next });
  }

  return (
    <div className="space-y-3">
      <div className="bg-purple-50 border border-purple-200 rounded p-3 flex items-center justify-between">
        <div className="text-sm text-purple-900">
          💡 הגדר הנחות לחיזוי. ניתן לשנות ערך לכל שנה (1-5) או להשתמש באוטו-חיזוי.
        </div>
        {hasHistorical && (
          <button
            onClick={onAutoSuggest}
            className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            הצע אוטומטית מההיסטוריה
          </button>
        )}
      </div>

      {/* Years to project */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          שנות חיזוי
        </label>
        <select
          value={assumptions.yearsToProject}
          onChange={(e) => update({ yearsToProject: parseInt(e.target.value) })}
          className="w-32 px-3 py-1.5 border border-gray-300 rounded text-sm"
        >
          <option value={3}>3 שנים</option>
          <option value={4}>4 שנים</option>
          <option value={5}>5 שנים</option>
        </select>
      </div>

      {/* Growth & Margins */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">צמיחה ומרווחים (% לשנה)</h4>
          <span className="text-xs text-gray-500">
            השוואה לענף: {bench.industryLabel}
          </span>
        </div>
        <div className="space-y-3">
          <ArrayField
            label="צמיחת הכנסות"
            values={assumptions.revenueGrowthPct}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('revenueGrowthPct', idx, v)}
            benchmark={bench.revenueGrowthPct}
          />
          <ArrayField
            label="מרווח גולמי"
            values={assumptions.grossMarginPct ?? []}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('grossMarginPct', idx, v)}
            benchmark={bench.grossMargin}
          />
          <ArrayField
            label="R&D מהכנסות"
            values={assumptions.rndPctOfRevenue ?? []}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('rndPctOfRevenue', idx, v)}
            benchmark={bench.rndPctOfRevenue}
          />
          <ArrayField
            label="שיווק מהכנסות"
            values={assumptions.marketingPctOfRevenue ?? []}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('marketingPctOfRevenue', idx, v)}
            benchmark={bench.marketingPctOfRevenue}
          />
          <ArrayField
            label="תפעול מהכנסות"
            values={assumptions.operatingPctOfRevenue ?? []}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('operatingPctOfRevenue', idx, v)}
            benchmark={bench.operatingPctOfRevenue}
          />
        </div>
      </div>

      {/* Working Capital */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">הון חוזר (ימים)</h4>
        <div className="grid md:grid-cols-3 gap-3">
          <SimpleField
            label="DSO - ימי גבייה"
            value={assumptions.dso}
            onChange={(v) => update({ dso: v })}
            benchHint={`ענף: ${Math.round(bench.dso.median)} ימים (Q1-Q3: ${Math.round(bench.dso.low)}-${Math.round(bench.dso.high)})`}
          />
          <SimpleField
            label="DPO - ימי תשלום"
            value={assumptions.dpo}
            onChange={(v) => update({ dpo: v })}
            benchHint={`ענף: ${Math.round(bench.dpo.median)} ימים`}
          />
          <SimpleField
            label="DIO - ימי מלאי"
            value={assumptions.dio}
            onChange={(v) => update({ dio: v })}
            benchHint={`ענף: ${Math.round(bench.dio.median)} ימים`}
          />
        </div>
      </div>

      {/* Capital & Tax */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">הון, מס וריבית</h4>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <SimpleField label="ריבית אפקטיבית %" value={assumptions.effectiveInterestRate} onChange={(v) => update({ effectiveInterestRate: v })} />
          <SimpleField label="שיעור מס אפקטיבי %" value={assumptions.effectiveTaxRate} onChange={(v) => update({ effectiveTaxRate: v })} />
        </div>
        <div className="space-y-3">
          <ArrayField
            label="CapEx (השקעה ברכוש קבוע)"
            values={assumptions.capexPerYear}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('capexPerYear', idx, v)}
            isCurrency
          />
          <ArrayField
            label="פחת"
            values={assumptions.depreciationPerYear}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('depreciationPerYear', idx, v)}
            isCurrency
          />
          <ArrayField
            label="הנפקת חוב"
            values={assumptions.debtIssuancePerYear}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('debtIssuancePerYear', idx, v)}
            isCurrency
          />
          <ArrayField
            label="החזר חוב"
            values={assumptions.debtRepaymentPerYear}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('debtRepaymentPerYear', idx, v)}
            isCurrency
          />
          <ArrayField
            label="דיבידנד"
            values={assumptions.dividendsPerYear}
            years={assumptions.yearsToProject}
            onChange={(idx, v) => updateArr('dividendsPerYear', idx, v)}
            isCurrency
          />
        </div>
      </div>
    </div>
  );
}

function SimpleField({
  label,
  value,
  onChange,
  benchHint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  benchHint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />
      {benchHint && <div className="text-[10px] text-emerald-700 mt-0.5">📊 {benchHint}</div>}
    </div>
  );
}

function ArrayField({
  label,
  values,
  years,
  onChange,
  isCurrency,
  benchmark,
}: {
  label: string;
  values: number[];
  years: number;
  onChange: (idx: number, v: number) => void;
  isCurrency?: boolean;
  benchmark?: { low: number; median: number; high: number };
}) {
  // הצג הערכת מיקום ביחס ל-benchmark
  const firstValue = values[0];
  let positionLabel = '';
  if (benchmark && firstValue !== undefined && !isCurrency) {
    if (firstValue < benchmark.low) positionLabel = '⚠️ מתחת לטווח הענפי';
    else if (firstValue < benchmark.median) positionLabel = '🟡 מתחת לחציון';
    else if (firstValue < benchmark.high) positionLabel = '🟢 מעל החציון';
    else positionLabel = '✨ מעל אחוזון 75';
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-xs text-gray-700">{label}</label>
        {benchmark && !isCurrency && (
          <span className="text-[10px] text-emerald-700">
            ענף: {benchmark.low.toFixed(0)}–{benchmark.high.toFixed(0)}% (חציון{' '}
            {benchmark.median.toFixed(0)}%) {positionLabel}
          </span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: years }, (_, i) => (
          <div key={i}>
            <div className="text-[10px] text-gray-500 mb-0.5">שנה {i + 1}</div>
            <input
              type="number"
              value={values[i] ?? ''}
              onChange={(e) => onChange(i, parseFloat(e.target.value) || 0)}
              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs"
              placeholder={isCurrency ? '0' : '%'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// P&L TAB
// ============================================================

function PnLTab({ model }: { model: Model | null }) {
  if (!model) {
    return <NoDataNotice message="הזן נתוני שנת בסיס בלשונית 'נתוני עבר' כדי לראות תחזית רווח והפסד" />;
  }

  const allYears = [...model.historical, ...model.projected];
  const chartData = allYears.map((y) => ({
    year: y.year,
    הכנסות: Math.round(y.pnl.revenue),
    'רווח גולמי': Math.round(y.pnl.grossProfit),
    'EBITDA': Math.round(y.pnl.ebitda),
    'רווח נקי': Math.round(y.pnl.netProfit),
    isProjection: y.isProjection,
  }));

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3">
          <h3 className="font-bold">רווח והפסד לאורך זמן</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} orientation="right" />
              <Tooltip formatter={(v) => Number(v).toLocaleString('he-IL') + ' ₪'} />
              <Legend wrapperStyle={{ direction: 'rtl', fontSize: 11 }} />
              <Bar dataKey="הכנסות" fill="#3b82f6" />
              <Line type="monotone" dataKey="רווח גולמי" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="EBITDA" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="רווח נקי" stroke="#ec4899" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <PnLTable years={allYears} />
    </div>
  );
}

function PnLTable({ years }: { years: AnnualStatements[] }) {
  const fmt = (v: number) => Math.round(v).toLocaleString('he-IL');
  const pct = (n: number, d: number) => (d > 0 ? `${((n / d) * 100).toFixed(1)}%` : '—');

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-right p-2 sticky right-0 bg-gray-100 z-10">פריט</th>
            {years.map((y) => (
              <th key={y.year} className={`text-center p-2 ${y.isProjection ? 'bg-amber-50' : ''}`}>
                {y.year} {y.isProjection && <span className="text-amber-700 text-xs">(תחזית)</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {([
            { key: 'revenue' as const, label: 'הכנסות', bold: true },
            { key: 'cogs' as const, label: 'עלות המכר' },
            { key: 'grossProfit' as const, label: 'רווח גולמי', highlight: 'green' },
            { key: 'rnd' as const, label: 'R&D' },
            { key: 'marketing' as const, label: 'שיווק' },
            { key: 'operating' as const, label: 'תפעול' },
            { key: 'ebitda' as const, label: 'EBITDA', highlight: 'amber' },
            { key: 'depreciation' as const, label: 'פחת' },
            { key: 'ebit' as const, label: 'EBIT' },
            { key: 'interest' as const, label: 'ריבית' },
            { key: 'tax' as const, label: 'מס' },
            { key: 'netProfit' as const, label: 'רווח נקי', highlight: 'blue' },
          ]).map((row) => (
            <tr key={row.key} className="border-t border-gray-100">
              <td className={`p-2 sticky right-0 bg-white z-10 ${row.bold ? 'font-bold' : ''}`}>
                {row.label}
              </td>
              {years.map((y) => (
                <td
                  key={y.year}
                  className={`p-2 text-center ${
                    y.isProjection ? 'bg-amber-50/50' : ''
                  } ${row.highlight === 'green' ? 'text-emerald-700 font-semibold' : ''} ${
                    row.highlight === 'amber' ? 'text-amber-700 font-semibold' : ''
                  } ${row.highlight === 'blue' ? 'text-blue-700 font-bold' : ''}`}
                >
                  {fmt(y.pnl[row.key])}
                </td>
              ))}
            </tr>
          ))}
          {/* Margins row */}
          <tr className="border-t-2 border-gray-300 bg-gray-50">
            <td className="p-2 sticky right-0 bg-gray-50 z-10 text-xs">מרווח גולמי %</td>
            {years.map((y) => (
              <td key={y.year} className="p-2 text-center text-xs">
                {pct(y.pnl.grossProfit, y.pnl.revenue)}
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <td className="p-2 sticky right-0 bg-gray-50 z-10 text-xs">מרווח EBITDA %</td>
            {years.map((y) => (
              <td key={y.year} className="p-2 text-center text-xs">
                {pct(y.pnl.ebitda, y.pnl.revenue)}
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <td className="p-2 sticky right-0 bg-gray-50 z-10 text-xs">מרווח נקי %</td>
            {years.map((y) => (
              <td key={y.year} className="p-2 text-center text-xs font-semibold">
                {pct(y.pnl.netProfit, y.pnl.revenue)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// BALANCE SHEET + CASH FLOW TAB
// ============================================================

function BalanceTab({ model }: { model: Model | null }) {
  if (!model) {
    return <NoDataNotice message="הזן נתוני שנת בסיס כדי לראות מאזן ותזרים" />;
  }

  const allYears = [...model.historical, ...model.projected];
  const fmt = (v: number) => Math.round(v).toLocaleString('he-IL');

  const cashChartData = allYears.map((y) => ({
    year: y.year,
    'יתרת מזומן': Math.round(y.balanceSheet.cash),
    'תזרים תפעולי': Math.round(y.cashFlow.cashFromOperations),
    'תזרים השקעה': Math.round(y.cashFlow.cashFromInvesting),
    'תזרים מימון': Math.round(y.cashFlow.cashFromFinancing),
  }));

  return (
    <div className="space-y-4">
      {/* Cash chart */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            תזרים מזומן ויתרה
          </h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={cashChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} orientation="right" />
              <Tooltip formatter={(v) => Number(v).toLocaleString('he-IL') + ' ₪'} />
              <Legend wrapperStyle={{ direction: 'rtl', fontSize: 11 }} />
              <Bar dataKey="תזרים תפעולי" fill="#10b981" />
              <Bar dataKey="תזרים השקעה" fill="#f59e0b" />
              <Bar dataKey="תזרים מימון" fill="#8b5cf6" />
              <Line type="monotone" dataKey="יתרת מזומן" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Balance Sheet table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-x-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3">
          <h3 className="font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            מאזן (Balance Sheet)
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-2 sticky right-0 bg-gray-100 z-10">פריט</th>
              {allYears.map((y) => (
                <th key={y.year} className={`text-center p-2 ${y.isProjection ? 'bg-amber-50' : ''}`}>
                  {y.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50">
              <td colSpan={allYears.length + 1} className="p-2 font-bold text-blue-900 text-xs">
                נכסים
              </td>
            </tr>
            {(['cash', 'accountsReceivable', 'inventory', 'fixedAssets', 'totalAssets'] as const).map((k) => (
              <tr key={k} className="border-t border-gray-100">
                <td className="p-2 sticky right-0 bg-white z-10 text-xs">
                  {k === 'cash' && 'מזומן'}
                  {k === 'accountsReceivable' && 'לקוחות (AR)'}
                  {k === 'inventory' && 'מלאי'}
                  {k === 'fixedAssets' && 'רכוש קבוע'}
                  {k === 'totalAssets' && <strong>סה״כ נכסים</strong>}
                </td>
                {allYears.map((y) => (
                  <td
                    key={y.year}
                    className={`p-2 text-center text-xs ${y.isProjection ? 'bg-amber-50/50' : ''} ${
                      k === 'totalAssets' ? 'font-bold' : ''
                    }`}
                  >
                    {fmt(y.balanceSheet[k])}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-red-50">
              <td colSpan={allYears.length + 1} className="p-2 font-bold text-red-900 text-xs">
                התחייבויות + הון
              </td>
            </tr>
            {(['accountsPayable', 'longTermDebt', 'totalLiabilities', 'totalEquity'] as const).map((k) => (
              <tr key={k} className="border-t border-gray-100">
                <td className="p-2 sticky right-0 bg-white z-10 text-xs">
                  {k === 'accountsPayable' && 'ספקים (AP)'}
                  {k === 'longTermDebt' && 'חוב לזמן ארוך'}
                  {k === 'totalLiabilities' && <strong>סה״כ התחייבויות</strong>}
                  {k === 'totalEquity' && <strong>סה״כ הון</strong>}
                </td>
                {allYears.map((y) => (
                  <td
                    key={y.year}
                    className={`p-2 text-center text-xs ${y.isProjection ? 'bg-amber-50/50' : ''} ${
                      k === 'totalLiabilities' || k === 'totalEquity' ? 'font-bold' : ''
                    }`}
                  >
                    {fmt(y.balanceSheet[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cash Flow table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-x-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-3">
          <h3 className="font-bold">דוח תזרים מזומנים</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-2 sticky right-0 bg-gray-100 z-10">פריט</th>
              {allYears.map((y) => (
                <th key={y.year} className="text-center p-2">{y.year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([
              { k: 'cashFromOperations' as const, label: 'תזרים תפעולי', bold: true },
              { k: 'cashFromInvesting' as const, label: 'תזרים השקעה' },
              { k: 'cashFromFinancing' as const, label: 'תזרים מימון' },
              { k: 'netChangeInCash' as const, label: 'שינוי נטו במזומן', bold: true, highlight: true },
              { k: 'closingCash' as const, label: 'יתרת סגירה', bold: true, highlight: true },
            ]).map((row) => (
              <tr key={row.k} className="border-t border-gray-100">
                <td className={`p-2 sticky right-0 bg-white z-10 text-xs ${row.bold ? 'font-bold' : ''}`}>
                  {row.label}
                </td>
                {allYears.map((y) => (
                  <td
                    key={y.year}
                    className={`p-2 text-center text-xs ${y.isProjection ? 'bg-amber-50/50' : ''} ${
                      row.highlight ? 'text-emerald-700 font-bold' : ''
                    }`}
                  >
                    {fmt(y.cashFlow[row.k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NoDataNotice({ message }: { message: string }) {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
      <p className="text-amber-900">{message}</p>
    </div>
  );
}
