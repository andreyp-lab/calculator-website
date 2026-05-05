'use client';

import { useState, useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import type { WorkingCapitalScenario } from '@/lib/tools/types';
import { Settings, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

/**
 * חישוב הון חוזר נטו ו-CCC לפי DSO/DPO/DIO.
 * נכסים שוטפים = AR + Inventory; התחייבויות שוטפות = AP.
 * NWC = AR + Inv − AP
 * CCC = DSO + DIO − DPO
 */
function calcScenario(
  revenue: number,
  cogs: number,
  dso: number,
  dpo: number,
  dio: number,
): WorkingCapitalScenario {
  const ar = (revenue / 365) * dso;
  const inv = (cogs / 365) * dio;
  const ap = (cogs / 365) * dpo;
  return {
    dso,
    dpo,
    dio,
    cashImpact: 0, // נחשב חיצונית
    ccc: dso + dio - dpo,
    netWorkingCapital: ar + inv - ap,
  };
}

export function WorkingCapitalOptimizer() {
  const { budget, settings } = useTools();

  const baseline = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    // הערכת DSO/DPO/DIO על בסיס יחסים סטנדרטיים מהתקציב
    const dso = 45; // ברירת מחדל
    const dpo = 30;
    const dio = totals.cogs > 0 ? 30 : 0;
    return {
      revenue: totals.income,
      cogs: totals.cogs,
      baseDSO: dso,
      baseDPO: dpo,
      baseDIO: dio,
      baseScenario: calcScenario(totals.income, totals.cogs, dso, dpo, dio),
    };
  }, [budget, settings]);

  const [dso, setDso] = useState(45);
  const [dpo, setDpo] = useState(30);
  const [dio, setDio] = useState(30);

  if (!baseline || !settings) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center text-amber-900">
        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
        הזן נתוני תקציב כדי לראות אופטימיזציה של הון חוזר
      </div>
    );
  }

  const optimized = calcScenario(baseline.revenue, baseline.cogs, dso, dpo, dio);
  const cashImpact = baseline.baseScenario.netWorkingCapital - optimized.netWorkingCapital;

  const fmt = (v: number) =>
    Math.abs(v) > 1000000
      ? `${(v / 1000000).toFixed(2)}M`
      : Math.abs(v) > 1000
        ? `${(v / 1000).toFixed(0)}K`
        : v.toFixed(0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            אופטימיזציית הון חוזר
          </h3>
          <p className="text-xs text-cyan-100">
            "מה יקרה אם DSO ירד מ-60 ל-45?" — חישוב מזומן שמשתחרר
          </p>
        </div>
      </div>

      {/* Big Cash Impact KPI */}
      <div
        className={`rounded-lg border-4 p-5 text-center ${
          cashImpact >= 0
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-red-50 border-red-300'
        }`}
      >
        <div className="text-sm text-gray-700 mb-1">השפעה על מזומן (vs מצב נוכחי)</div>
        <div
          className={`text-4xl font-bold ${
            cashImpact >= 0 ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {cashImpact >= 0 ? '+' : ''}
          ₪{fmt(cashImpact)}
        </div>
        <div className="text-xs text-gray-600 mt-2">
          {cashImpact > 0
            ? `🎉 משתחרר ${fmt(cashImpact)} מזומן בהון חוזר`
            : cashImpact < 0
              ? `⚠️ דרוש מימון נוסף של ${fmt(Math.abs(cashImpact))}`
              : 'ללא שינוי'}
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-5 space-y-4">
        <h4 className="font-semibold text-gray-900 mb-2">פרמטרים</h4>

        <SliderRow
          label="DSO - ימי גבייה"
          description="כמה זמן עד שהלקוחות משלמים"
          value={dso}
          baseline={baseline.baseDSO}
          onChange={setDso}
          min={0}
          max={180}
          color="blue"
          impactDirection="lower-better"
        />
        <SliderRow
          label="DPO - ימי תשלום לספקים"
          description="כמה זמן אנחנו לוקחים לשלם"
          value={dpo}
          baseline={baseline.baseDPO}
          onChange={setDpo}
          min={0}
          max={180}
          color="purple"
          impactDirection="higher-better"
        />
        <SliderRow
          label="DIO - ימי מלאי"
          description="כמה זמן המלאי יושב"
          value={dio}
          baseline={baseline.baseDIO}
          onChange={setDio}
          min={0}
          max={180}
          color="amber"
          impactDirection="lower-better"
        />
      </div>

      {/* Side-by-side comparison */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-3">מדד</th>
              <th className="text-center p-3">מצב נוכחי</th>
              <th className="text-center p-3">תרחיש מותאם</th>
              <th className="text-center p-3">שינוי</th>
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="DSO (ימי גבייה)"
              base={baseline.baseDSO}
              optimized={dso}
              unit="ימים"
              lowerBetter
            />
            <ComparisonRow
              label="DPO (ימי תשלום)"
              base={baseline.baseDPO}
              optimized={dpo}
              unit="ימים"
              lowerBetter={false}
            />
            <ComparisonRow
              label="DIO (ימי מלאי)"
              base={baseline.baseDIO}
              optimized={dio}
              unit="ימים"
              lowerBetter
            />
            <ComparisonRow
              label="CCC (מחזור מזומן)"
              base={baseline.baseScenario.ccc}
              optimized={optimized.ccc}
              unit="ימים"
              lowerBetter
              highlight
            />
            <ComparisonRow
              label="הון חוזר נטו"
              base={baseline.baseScenario.netWorkingCapital}
              optimized={optimized.netWorkingCapital}
              unit="₪"
              lowerBetter
              highlight
              isCurrency
            />
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          טיפים אופרטיביים
        </h4>
        <ul className="text-sm text-blue-900 space-y-1">
          {dso < baseline.baseDSO && (
            <li>✓ קצר את DSO ב-{baseline.baseDSO - dso} ימים: בקש מקדמות, תן הנחה לתשלום מהיר</li>
          )}
          {dpo > baseline.baseDPO && (
            <li>✓ הארך DPO ב-{dpo - baseline.baseDPO} ימים: משא ומתן עם ספקים ל-נטו 60+</li>
          )}
          {dio < baseline.baseDIO && (
            <li>✓ הקטן מלאי ב-{baseline.baseDIO - dio} ימים: JIT, טייט מנעולי הזמנה</li>
          )}
          {cashImpact > baseline.revenue * 0.05 && (
            <li className="font-bold text-emerald-800">
              💡 שיפור משמעותי: {fmt(cashImpact)} ש"ח מזומן משתחרר — שווה השקעה בתהליכים
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  description,
  value,
  baseline,
  onChange,
  min,
  max,
  color,
  impactDirection,
}: {
  label: string;
  description: string;
  value: number;
  baseline: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  color: 'blue' | 'purple' | 'amber';
  impactDirection: 'lower-better' | 'higher-better';
}) {
  const delta = value - baseline;
  const better =
    impactDirection === 'lower-better' ? delta < 0 : delta > 0;

  const colorMap: Record<string, string> = {
    blue: 'accent-blue-600',
    purple: 'accent-purple-600',
    amber: 'accent-amber-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`text-xs ${better ? 'text-emerald-700' : delta === 0 ? 'text-gray-500' : 'text-amber-700'}`}>
            {delta === 0 ? 'ללא שינוי' : `${delta > 0 ? '+' : ''}${delta} ימים`}
          </div>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full ${colorMap[color]}`}
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{min}</span>
        <span className="font-bold">בסיס: {baseline}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  base,
  optimized,
  unit,
  lowerBetter,
  highlight,
  isCurrency,
}: {
  label: string;
  base: number;
  optimized: number;
  unit: string;
  lowerBetter: boolean;
  highlight?: boolean;
  isCurrency?: boolean;
}) {
  const delta = optimized - base;
  const better = lowerBetter ? delta < 0 : delta > 0;
  const fmt = (v: number) => {
    if (isCurrency) {
      return Math.abs(v) > 1000000
        ? `${(v / 1000000).toFixed(2)}M`
        : Math.abs(v) > 1000
          ? `${(v / 1000).toFixed(0)}K`
          : v.toFixed(0);
    }
    return Math.round(v).toString();
  };

  return (
    <tr className={`border-t ${highlight ? 'bg-blue-50 font-bold' : ''}`}>
      <td className="p-3">{label}</td>
      <td className="p-3 text-center text-gray-700">{fmt(base)} {unit}</td>
      <td className="p-3 text-center">{fmt(optimized)} {unit}</td>
      <td
        className={`p-3 text-center ${
          delta === 0 ? 'text-gray-500' : better ? 'text-emerald-700' : 'text-red-700'
        }`}
      >
        {delta === 0 ? '—' : `${delta > 0 ? '+' : ''}${fmt(delta)} ${unit}`}
      </td>
    </tr>
  );
}
