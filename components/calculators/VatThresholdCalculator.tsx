'use client';

import { useState, useMemo } from 'react';
import {
  calculateVatThreshold,
  getMonthName,
  VAT_EXEMPT_THRESHOLD_2026,
  type VatThresholdInput,
} from '@/lib/calculators/vat-threshold';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

// ============================================================
// ברירות מחדל
// ============================================================

const initial: VatThresholdInput = {
  cumulativeRevenue: 60_000,
  currentMonth: 6,
  expectedMonthlyRevenue: 12_000,
};

// ============================================================
// רכיב ראשי
// ============================================================

export function VatThresholdCalculator() {
  const [input, setInput] = useState<VatThresholdInput>(initial);

  const result = useMemo(() => calculateVatThreshold(input), [input]);

  function update<K extends keyof VatThresholdInput>(k: K, v: VatThresholdInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  // צבעים לפי סטטוס
  const statusStyle = {
    safe: {
      cardVariant: 'success' as const,
      barColor: 'bg-emerald-500',
      label: 'מתחת לתקרה',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    approaching: {
      cardVariant: 'warning' as const,
      barColor: 'bg-amber-500',
      label: 'מתקרב לתקרה',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    exceeded: {
      cardVariant: 'warning' as const,
      barColor: 'bg-red-500',
      label: 'חרגת מהתקרה',
      badge: 'bg-red-100 text-red-800 border-red-300',
    },
  }[result.status];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* ===== קלט ===== */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-paper border border-ink/15 rounded-none p-6 space-y-5">
            <h2 className="text-xl font-bold text-ink">נתוני המחזור שלך</h2>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                מחזור מצטבר מתחילת השנה (₪, ללא מע&quot;מ)
              </label>
              <input
                type="number"
                min={0}
                step={1_000}
                value={input.cumulativeRevenue}
                onChange={(e) => update('cumulativeRevenue', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg"
              />
              <p className="text-xs text-ink/60 mt-1">
                סך כל ההכנסות מתחילת השנה ועד החודש שבחרת מטה.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  עד איזה חודש?
                </label>
                <select
                  value={input.currentMonth}
                  onChange={(e) => update('currentMonth', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {getMonthName(m)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-ink/60 mt-1">
                  החודש האחרון שכבר נכלל במחזור.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  צפי חודשי להמשך (₪)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={input.expectedMonthlyRevenue}
                  onChange={(e) => update('expectedMonthlyRevenue', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none"
                />
                <p className="text-xs text-ink/60 mt-1">
                  ממוצע מחזור צפוי לכל חודש שנותר.
                </p>
              </div>
            </div>

            <div className="bg-cream-2 border border-ink/15 rounded-none p-3 text-xs text-ink/70">
              תקרת עוסק פטור 2026:{' '}
              <strong className="text-ink">
                {formatCurrency(VAT_EXEMPT_THRESHOLD_2026)}
              </strong>{' '}
              לשנה. מחזור שעובר את התקרה מחייב מעבר לעוסק מורשה.
            </div>
          </div>

          {/* מד-התקדמות ויזואלי */}
          <div className="bg-paper border border-ink/15 rounded-none p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink">ניצול התקרה</h3>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle.badge}`}
              >
                {statusStyle.label}
              </span>
            </div>

            <ThresholdMeter
              cumulative={result.cumulativeRevenue}
              projected={result.projectedAnnualRevenue}
              threshold={result.threshold}
              barColor={statusStyle.barColor}
            />

            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div>
                <div className="text-xs text-ink/60">ניצול נוכחי</div>
                <div className="text-lg font-bold text-ink">
                  {formatPercent(Math.min(result.utilizationRate, 9.99), 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-ink/60">ניצול לפי צפי שנתי</div>
                <div className="text-lg font-bold text-ink">
                  {formatPercent(Math.min(result.projectedUtilizationRate, 9.99), 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-ink/60">נותר עד התקרה</div>
                <div
                  className={`text-lg font-bold ${
                    result.remainingRoom > 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {result.remainingRoom > 0 ? formatCurrency(result.remainingRoom) : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== תוצאות ===== */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title="מחזור שנתי צפוי"
            value={formatCurrency(result.projectedAnnualRevenue)}
            subtitle={
              result.willExceed
                ? `חורג ב-${formatCurrency(result.excessRevenue)} מהתקרה`
                : 'מתחת לתקרת עוסק פטור'
            }
            variant={statusStyle.cardVariant}
          />

          {result.crossingMonthName ? (
            <ResultCard
              title="חודש חציית התקרה (צפי)"
              value={result.crossingMonthName}
              subtitle="ממועד זה — חובת מעבר לעוסק מורשה"
              variant="warning"
            />
          ) : (
            <ResultCard
              title="חציית התקרה השנה"
              value="לא צפויה"
              subtitle={`נותר מרווח של ${formatCurrency(result.remainingRoom)}`}
              variant="success"
            />
          )}

          {result.estimatedVatOnExcess > 0 && (
            <ResultCard
              title='אומדן מע"מ על העודף'
              value={formatCurrency(result.estimatedVatOnExcess)}
              subtitle="18% על המחזור שמעבר לתקרה (אומדן בלבד)"
              variant="primary"
            />
          )}

          {/* השלכות חריגה */}
          {result.consequences.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-none p-4 space-y-2">
              <h4 className="text-sm font-bold text-red-900">מה קורה כשחורגים</h4>
              {result.consequences.map((c, i) => (
                <p key={i} className="text-xs text-red-900 flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{c}</span>
                </p>
              ))}
            </div>
          )}

          {/* המלצות */}
          {result.recommendations.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-none p-4 space-y-2">
              <h4 className="text-sm font-bold text-amber-900">המלצות</h4>
              {result.recommendations.map((r, i) => (
                <p key={i} className="text-xs text-amber-900 flex gap-2">
                  <span className="flex-shrink-0">💡</span>
                  <span>{r}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-ink/45">
        * אומדן בלבד. חבות המע"מ בפועל חלה ממועד חציית התקרה והמעבר לעוסק מורשה — לא על
        כל המחזור השנתי. להתאמה מדויקת התייעץ עם רואה חשבון.
      </p>
    </div>
  );
}

// ============================================================
// מד-התקדמות ויזואלי
// ============================================================

function ThresholdMeter({
  cumulative,
  projected,
  threshold,
  barColor,
}: {
  cumulative: number;
  projected: number;
  threshold: number;
  barColor: string;
}) {
  // הסקאלה: עד התקרה, או עד הצפי אם הוא גדול יותר (כדי להראות חריגה)
  const scaleMax = Math.max(threshold * 1.15, projected);
  const cumulativePct = Math.min(100, (cumulative / scaleMax) * 100);
  const projectedPct = Math.min(100, (projected / scaleMax) * 100);
  const thresholdPct = Math.min(100, (threshold / scaleMax) * 100);

  return (
    <div className="space-y-3">
      <div className="relative h-8 bg-cream-2 rounded-none overflow-hidden border border-ink/15">
        {/* צפי שנתי (רקע בהיר) */}
        <div
          className="absolute inset-y-0 right-0 bg-ink/20"
          style={{ width: `${projectedPct}%` }}
          title={`צפי שנתי: ${projected.toLocaleString('he-IL')} ₪`}
        />
        {/* מחזור מצטבר נוכחי */}
        <div
          className={`absolute inset-y-0 right-0 ${barColor} transition-all`}
          style={{ width: `${cumulativePct}%` }}
          title={`מצטבר: ${cumulative.toLocaleString('he-IL')} ₪`}
        />
        {/* קו התקרה */}
        <div
          className="absolute inset-y-0 w-0.5 bg-ink"
          style={{ right: `${thresholdPct}%` }}
          title={`תקרה: ${threshold.toLocaleString('he-IL')} ₪`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded ${barColor}`} />
          <span className="text-ink/70">
            מחזור מצטבר: {formatCurrency(cumulative)}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-ink/20" />
          <span className="text-ink/70">צפי שנתי: {formatCurrency(projected)}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-3 bg-ink" />
          <span className="text-ink/70">תקרה: {formatCurrency(threshold)}</span>
        </span>
      </div>
    </div>
  );
}
