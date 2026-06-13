'use client';

import { useState, useMemo } from 'react';
import {
  calculateCombinedIncome,
  type CombinedIncomeInput,
} from '@/lib/calculators/combined-income';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: CombinedIncomeInput = {
  monthlyGrossSalary: 15_000,
  annualSelfEmployedIncome: 60_000,
  creditPoints: 2.25,
};

export function CombinedIncomeCalculator() {
  const [input, setInput] = useState<CombinedIncomeInput>(initial);
  const result = useMemo(() => calculateCombinedIncome(input), [input]);

  function update<K extends keyof CombinedIncomeInput>(
    k: K,
    v: CombinedIncomeInput[K],
  ) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* קלט */}
      <div className="lg:col-span-2 bg-paper border border-ink/15 rounded-none p-6 space-y-5">
        <h2 className="text-xl font-bold text-ink">פרטים</h2>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            שכר חודשי ברוטו כשכיר (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.monthlyGrossSalary}
            onChange={(e) => update('monthlyGrossSalary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg"
          />
          <p className="text-xs text-ink/60 mt-1">
            הברוטו מתלוש המשכורת — לפני ניכויי מס וב.ל.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            הכנסה שנתית חייבת כעצמאי (₪)
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={input.annualSelfEmployedIncome}
            onChange={(e) =>
              update('annualSelfEmployedIncome', Number(e.target.value))
            }
            className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg"
          />
          <p className="text-xs text-ink/60 mt-1">
            המחזור מהעסק בשנה, פחות הוצאות מוכרות (ללא מע&quot;מ)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            נקודות זיכוי
          </label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.25}
            value={input.creditPoints}
            onChange={(e) => update('creditPoints', Number(e.target.value))}
            className="w-full px-3 py-2 border border-ink/15 rounded-none"
          />
          <p className="text-xs text-ink/60 mt-1">
            תושב/ת = 2.25; הנקודות מנוצלות פעם אחת על כלל ההכנסה
          </p>
        </div>

        <div className="bg-cream-2 border border-ink/15 rounded-none p-3 text-xs text-ink/70 leading-relaxed">
          המחשבון מציג את ההשפעה של ההכנסה הצדדית{' '}
          <strong>מעל</strong> השכר: מדרגות המס &quot;יושבות&quot; על השכר,
          וב.ל. מחושב על היתרה עד התקרה המשותפת.
        </div>
      </div>

      {/* תוצאות */}
      <div className="lg:col-span-3 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <ResultCard
            title="💰 נטו מההכנסה הצדדית — שנתי"
            value={formatCurrency(result.netSideIncomeAnnual)}
            subtitle={`${formatCurrency(result.netSideIncomeMonthly)} בחודש בממוצע`}
            variant="success"
          />
          <ResultCard
            title="📊 מדרגה שולית אפקטיבית"
            value={formatPercent(result.effectiveMarginalRate, 1)}
            subtitle="מס + ב.ל. על ההכנסה הצדדית"
            variant="primary"
          />
        </div>

        {/* פירוט */}
        <div className="bg-paper border border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-3">
            פירוט שנתי — ההכנסה הצדדית
          </h3>
          <div className="space-y-1.5 text-sm">
            <Row
              label="הכנסה חייבת כעצמאי"
              value={formatCurrency(result.annualSelfEmployedIncome)}
              positive
            />
            <Row
              label="(-) מס הכנסה (במדרגה שמעל השכר)"
              value={`- ${formatCurrency(result.taxOnSideIncome)}`}
              negative
            />
            <Row
              label="(-) ביטוח לאומי + בריאות"
              value={`- ${formatCurrency(result.selfEmployedBituachLeumi)}`}
              negative
            />
            <Row
              label="נטו ביד מההכנסה הצדדית"
              value={formatCurrency(result.netSideIncomeAnnual)}
              bold
              line
              highlight
            />
          </div>
        </div>

        {/* פירוט מס הכנסה משולב */}
        <div className="bg-paper border border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-3">מס הכנסה — תמונה משולבת</h3>
          <div className="space-y-1.5 text-sm">
            <Row
              label="שכר שנתי (שכיר)"
              value={formatCurrency(result.annualSalary)}
            />
            <Row
              label="הכנסה שנתית (עצמאי)"
              value={formatCurrency(result.annualSelfEmployedIncome)}
            />
            <Row
              label="סך הכנסה חייבת משולבת"
              value={formatCurrency(result.combinedTaxableIncome)}
              bold
              line
            />
            <Row
              label="מס משולב (אחרי נקודות זיכוי)"
              value={formatCurrency(result.totalIncomeTax)}
              negative
            />
            <Row
              label="מתוכו: מס המיוחס להכנסה הצדדית"
              value={formatCurrency(result.taxOnSideIncome)}
              mute
            />
            <Row
              label="מדרגת מס הכנסה שולית"
              value={formatPercent(result.marginalIncomeTaxRate, 0)}
              mute
            />
          </div>
        </div>

        {/* פירוט ב"ל */}
        <div className="bg-paper border border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-3">
            ביטוח לאומי — כללי &quot;שכיר וגם עצמאי&quot;
          </h3>
          {result.capReachedBySalary ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-none p-3 text-sm text-emerald-900">
              ✓ השכר שלך מיצה את תקרת הב.ל. (51,910 ₪/חודש) — אין חבות ב.ל.
              נוספת על ההכנסה העצמאית.
            </div>
          ) : (
            <div className="space-y-1.5 text-sm">
              {result.bituachLeumiBreakdown.reducedTierIncome > 0 && (
                <Row
                  label="חלק בשיעור מופחת (6.1%)"
                  value={`${formatCurrency(
                    result.bituachLeumiBreakdown.reducedTierIncome,
                  )} → ${formatCurrency(
                    result.bituachLeumiBreakdown.reducedTierAmount,
                  )}`}
                  mute
                />
              )}
              {result.bituachLeumiBreakdown.fullTierIncome > 0 && (
                <Row
                  label='חלק בשיעור מלא (18%)'
                  value={`${formatCurrency(
                    result.bituachLeumiBreakdown.fullTierIncome,
                  )} → ${formatCurrency(
                    result.bituachLeumiBreakdown.fullTierAmount,
                  )}`}
                  mute
                />
              )}
              {result.bituachLeumiBreakdown.exemptIncome > 0 && (
                <Row
                  label="חלק מעל התקרה (פטור)"
                  value={formatCurrency(
                    result.bituachLeumiBreakdown.exemptIncome,
                  )}
                  mute
                />
              )}
              <Row
                label="סה״כ ב.ל. + בריאות שנתי"
                value={formatCurrency(result.selfEmployedBituachLeumi)}
                bold
                line
              />
            </div>
          )}
        </div>

        {/* גרף ויזואלי */}
        <div className="bg-paper border border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-3">
            לאן הולך כל ₪ מההכנסה הצדדית
          </h3>
          <SideIncomeBar result={result} />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-none p-3 text-sm text-amber-900 leading-relaxed">
          ⚠️ בלי תיאום מס — המעסיק או המשלם המשני עלול לנכות במקור עד 47%.
          חשוב לבצע תיאום מס בתחילת כל שנה ולשלם מקדמות על ההכנסה העצמאית.
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  mute,
  line,
  highlight,
  positive,
  negative,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mute?: boolean;
  line?: boolean;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 ${
        line ? 'border-t border-ink/15 pt-2.5 mt-1' : ''
      } ${highlight ? 'bg-emerald-50 -mx-2 px-2 rounded-none' : ''}`}
    >
      <span
        className={`${mute ? 'text-ink/60' : 'text-ink'} ${
          bold ? 'font-bold' : ''
        }`}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? 'font-bold text-ink' : ''} ${
          mute ? 'text-ink/60' : ''
        } ${positive ? 'text-emerald-700' : ''} ${
          negative ? 'text-red-700' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SideIncomeBar({
  result,
}: {
  result: ReturnType<typeof calculateCombinedIncome>;
}) {
  const base = result.annualSelfEmployedIncome;
  if (base <= 0) {
    return (
      <p className="text-sm text-ink/60">
        הזן הכנסה כעצמאי כדי לראות את החלוקה
      </p>
    );
  }

  const items = [
    {
      label: 'מס הכנסה',
      value: result.taxOnSideIncome,
      color: 'bg-red-500',
      textColor: 'text-red-700',
    },
    {
      label: 'ביטוח לאומי + בריאות',
      value: result.selfEmployedBituachLeumi,
      color: 'bg-ink-mid',
      textColor: 'text-ink-mid',
    },
    {
      label: 'נטו ביד',
      value: Math.max(0, result.netSideIncomeAnnual),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
    },
  ].filter((i) => i.value > 0);

  const total = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="space-y-3">
      <div className="flex h-8 rounded-none overflow-hidden border border-ink/15">
        {items.map((i) => {
          const pct = total > 0 ? (i.value / total) * 100 : 0;
          return (
            <div
              key={i.label}
              className={`${i.color} flex items-center justify-center text-white text-xs font-bold`}
              style={{ width: `${pct}%` }}
              title={`${i.label}: ${pct.toFixed(1)}%`}
            >
              {pct >= 8 ? `${pct.toFixed(0)}%` : ''}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        {items.map((i) => {
          const pct = total > 0 ? (i.value / total) * 100 : 0;
          return (
            <div key={i.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-none ${i.color} flex-shrink-0`} />
              <span className={`${i.textColor} font-medium`}>
                {i.label}: {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
