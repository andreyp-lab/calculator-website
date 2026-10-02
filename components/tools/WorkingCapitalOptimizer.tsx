'use client';

import { useState, useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { calculateWorkingCapitalScenario } from '@/lib/tools/working-capital';
import { Settings, AlertCircle, Sparkles } from 'lucide-react';

export function WorkingCapitalOptimizer() {
  const { budget, settings } = useTools();

  const baseline = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    return {
      revenue: totals.income,
      cogs: totals.cogs,
    };
  }, [budget, settings]);

  const [baseDso, setBaseDso] = useState(45);
  const [baseDpo, setBaseDpo] = useState(30);
  const [baseDio, setBaseDio] = useState(30);
  const [dso, setDso] = useState(45);
  const [dpo, setDpo] = useState(30);
  const [dio, setDio] = useState(30);

  if (!baseline || !settings) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 p-6 text-center text-amber-900">
        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
        הזן נתוני תקציב כדי לראות אופטימיזציה של הון חוזר
      </div>
    );
  }

  const baseScenario = calculateWorkingCapitalScenario(
    baseline.revenue,
    baseline.cogs,
    baseDso,
    baseDpo,
    baseDio,
  );
  const optimized = calculateWorkingCapitalScenario(baseline.revenue, baseline.cogs, dso, dpo, dio);
  const cashImpact = baseScenario.netWorkingCapital - optimized.netWorkingCapital;

  const fmt = (v: number) =>
    Math.abs(v) > 1000000
      ? `${(v / 1000000).toFixed(2)}M`
      : Math.abs(v) > 1000
        ? `${(v / 1000).toFixed(0)}K`
        : v.toFixed(0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-paper border-2 border-ink/15 overflow-hidden">
        <div className="bg-ink text-cream p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            אופטימיזציית הון חוזר
          </h3>
          <p className="text-xs text-cream/60">
            השוואה בין שני תרחישים שבחרתם — ללא הנחה שזהו המצב בפועל
          </p>
        </div>
      </div>

      {/* Big Cash Impact KPI */}
      <div
        className={`border-4 p-5 text-center ${
          cashImpact >= 0
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-red-50 border-red-300'
        }`}
      >
        <div className="text-sm text-ink/70 mb-1">הפרש מזומן בין התרחישים</div>
        <div
          className={`text-4xl font-bold ${
            cashImpact >= 0 ? 'text-emerald-800' : 'text-red-700'
          }`}
        >
          {cashImpact >= 0 ? '+' : ''}
          ₪{fmt(cashImpact)}
        </div>
        <div className="text-xs text-ink/70 mt-2">
          {cashImpact > 0
            ? `🎉 משתחרר ${fmt(cashImpact)} מזומן בהון חוזר`
            : cashImpact < 0
              ? `⚠️ דרוש מימון נוסף של ${fmt(Math.abs(cashImpact))}`
              : 'ללא שינוי'}
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-paper border-2 border-ink/15 p-5 space-y-4">
        <h4 className="font-semibold text-ink mb-2">תרחיש בסיס לבחירתכם</h4>
        <p className="text-xs text-ink/70">
          ערכי 45/30/30 הם דוגמה התחלתית בלבד. החליפו אותם בנתוני הנהלת החשבונות שלכם.
        </p>
        <SliderRow
          label="DSO בסיס"
          description="ימי גבייה בתרחיש הבסיס"
          value={baseDso}
          baseline={baseDso}
          onChange={setBaseDso}
          min={0}
          max={180}
          color="gold"
          impactDirection="lower-better"
        />
        <SliderRow
          label="DPO בסיס"
          description="ימי תשלום בתרחיש הבסיס"
          value={baseDpo}
          baseline={baseDpo}
          onChange={setBaseDpo}
          min={0}
          max={180}
          color="amber"
          impactDirection="higher-better"
        />
        <SliderRow
          label="DIO בסיס"
          description="ימי מלאי בתרחיש הבסיס"
          value={baseDio}
          baseline={baseDio}
          onChange={setBaseDio}
          min={0}
          max={180}
          color="amber"
          impactDirection="lower-better"
        />
      </div>

      <div className="bg-paper border-2 border-ink/15 p-5 space-y-4">
        <h4 className="font-semibold text-ink mb-2">תרחיש יעד</h4>

        <SliderRow
          label="DSO - ימי גבייה"
          description="כמה זמן עד שהלקוחות משלמים"
          value={dso}
          baseline={baseDso}
          onChange={setDso}
          min={0}
          max={180}
          color="gold"
          impactDirection="lower-better"
        />
        <SliderRow
          label="DPO - ימי תשלום לספקים"
          description="כמה זמן אנחנו לוקחים לשלם"
          value={dpo}
          baseline={baseDpo}
          onChange={setDpo}
          min={0}
          max={180}
          color="amber"
          impactDirection="higher-better"
        />
        <SliderRow
          label="DIO - ימי מלאי"
          description="כמה זמן המלאי יושב"
          value={dio}
          baseline={baseDio}
          onChange={setDio}
          min={0}
          max={180}
          color="amber"
          impactDirection="lower-better"
        />
      </div>

      {/* Side-by-side comparison */}
      <div className="bg-paper border-2 border-ink/15 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-2">
            <tr>
              <th className="text-right p-3">מדד</th>
              <th className="text-center p-3">תרחיש בסיס</th>
              <th className="text-center p-3">תרחיש יעד</th>
              <th className="text-center p-3">שינוי</th>
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="DSO (ימי גבייה)"
              base={baseDso}
              optimized={dso}
              unit="ימים"
              lowerBetter
            />
            <ComparisonRow
              label="DPO (ימי תשלום)"
              base={baseDpo}
              optimized={dpo}
              unit="ימים"
              lowerBetter={false}
            />
            <ComparisonRow
              label="DIO (ימי מלאי)"
              base={baseDio}
              optimized={dio}
              unit="ימים"
              lowerBetter
            />
            <ComparisonRow
              label="CCC (מחזור מזומן)"
              base={baseScenario.ccc}
              optimized={optimized.ccc}
              unit="ימים"
              lowerBetter
              highlight
            />
            <ComparisonRow
              label="הון חוזר נטו"
              base={baseScenario.netWorkingCapital}
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
      <div className="bg-cream-2 border border-ink/15 p-4">
        <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          טיפים אופרטיביים
        </h4>
        <ul className="text-sm text-ink space-y-1">
          {dso < baseDso && (
            <li>✓ קצר את DSO ב-{baseDso - dso} ימים: בקש מקדמות, תן הנחה לתשלום מהיר</li>
          )}
          {dpo > baseDpo && (
            <li>✓ הארך DPO ב-{dpo - baseDpo} ימים: משא ומתן עם ספקים ל-נטו 60+</li>
          )}
          {dio < baseDio && (
            <li>✓ הקטן מלאי ב-{baseDio - dio} ימים: JIT, טייט מנעולי הזמנה</li>
          )}
          {cashImpact > baseline.revenue * 0.05 && (
            <li className="font-bold text-emerald-800">
              💡 שיפור משמעותי: {fmt(cashImpact)} ש&quot;ח מזומן משתחרר — שווה השקעה בתהליכים
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
  color: 'gold' | 'amber';
  impactDirection: 'lower-better' | 'higher-better';
}) {
  const delta = value - baseline;
  const better =
    impactDirection === 'lower-better' ? delta < 0 : delta > 0;

  const colorMap: Record<string, string> = {
    gold: 'accent-amber-600',
    amber: 'accent-amber-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-ink/70">{description}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`text-xs ${better ? 'text-emerald-800' : delta === 0 ? 'text-ink/70' : 'text-amber-800'}`}>
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
      <div className="flex justify-between text-[10px] text-ink/70 mt-0.5">
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
    <tr className={`border-t ${highlight ? 'bg-cream-2 font-bold' : ''}`}>
      <td className="p-3">{label}</td>
      <td className="p-3 text-center text-ink/70">{fmt(base)} {unit}</td>
      <td className="p-3 text-center">{fmt(optimized)} {unit}</td>
      <td
        className={`p-3 text-center ${
          delta === 0 ? 'text-ink/70' : better ? 'text-emerald-800' : 'text-red-700'
        }`}
      >
        {delta === 0 ? '—' : `${delta > 0 ? '+' : ''}${fmt(delta)} ${unit}`}
      </td>
    </tr>
  );
}
