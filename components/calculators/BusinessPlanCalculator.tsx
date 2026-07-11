'use client';

import { useMemo, useState } from 'react';
import { calculateBusinessPlan } from '@/lib/calculators/business-plan';
import { RENT_BY_CITY } from '@/lib/data/business-setup/rent-by-city';
import { getBusinessType } from '@/lib/data/business-setup/business-types';
import { formatCurrency } from '@/lib/utils/formatters';

interface Props {
  /** slug של סוג העסק (מ-BUSINESS_TYPES) */
  businessSlug: string;
}

export function BusinessPlanCalculator({ businessSlug }: Props) {
  const bt = getBusinessType(businessSlug);
  const [city, setCity] = useState('תל אביב');
  const [areaSqm, setAreaSqm] = useState(bt?.typicalAreaSqm ?? 60);
  const [isExistingPlace, setIsExistingPlace] = useState(false);
  const [includeOptional, setIncludeOptional] = useState(false);
  const [units, setUnits] = useState<number | ''>('');

  const result = useMemo(
    () =>
      calculateBusinessPlan({
        businessSlug,
        city,
        areaSqm,
        isExistingPlace,
        includeOptional,
        monthlyUnitsSold: units === '' ? undefined : Number(units),
      }),
    [businessSlug, city, areaSqm, isExistingPlace, includeOptional, units],
  );

  if (!bt || !result) return null;

  const profitPositive = result.projectedProfitAfterReserve >= 0;

  return (
    <div className="bg-paper border border-ink/15">
      {/* Inputs */}
      <div className="p-5 sm:p-6 border-b border-ink/15 grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="block text-sm font-medium text-ink/70 mb-2">עיר</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2.5 border border-ink/15 bg-cream focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            {RENT_BY_CITY.map((c) => (
              <option key={c.city} value={c.city}>
                {c.city} ({c.tier})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-ink/70 mb-2">
            שטח: <strong className="text-ink">{result.areaSqm} מ"ר</strong>
          </span>
          <input
            type="range"
            min={bt.minAreaSqm}
            max={bt.maxAreaSqm}
            step={5}
            value={areaSqm}
            onChange={(e) => setAreaSqm(Number(e.target.value))}
            className="w-full accent-gold"
          />
          <span className="flex justify-between text-xs text-ink/50 mt-1">
            <span>{bt.minAreaSqm} מ"ר</span>
            <span>{bt.maxAreaSqm} מ"ר</span>
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isExistingPlace}
            onChange={(e) => setIsExistingPlace(e.target.checked)}
            className="w-5 h-5 accent-gold"
          />
          <span className="text-sm text-ink/80">מקום קיים ומאובזר (שיפוץ קל)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeOptional}
            onChange={(e) => setIncludeOptional(e.target.checked)}
            className="w-5 h-5 accent-gold"
          />
          <span className="text-sm text-ink/80">כלול פריטים אופציונליים</span>
        </label>

        <label className="block sm:col-span-2">
          <span className="block text-sm font-medium text-ink/70 mb-2">
            {bt.revenue.unitLabel} בחודש (לתחזית רווח) — ברירת מחדל: נקודת איזון
          </span>
          <input
            type="number"
            min={0}
            value={units}
            onChange={(e) => setUnits(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={`למשל ${result.breakEvenUnits + 20}`}
            className="w-full px-4 py-2.5 border border-ink/15 bg-cream focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </label>
      </div>

      {/* Headline result */}
      <div className="p-5 sm:p-6 bg-ink text-cream grid sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-light mb-1">עלות הקמה</p>
          <p className="text-2xl font-bold">{formatCurrency(result.setupTotal)}</p>
          <p className="text-xs text-cream/55 mt-1">
            טווח {formatCurrency(result.setupRange.min)}–{formatCurrency(result.setupRange.max)}
          </p>
        </div>
        <div className="sm:border-x border-cream/15">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-light mb-1">הוצאה חודשית</p>
          <p className="text-2xl font-bold">{formatCurrency(result.monthlyFixedTotal)}</p>
          <p className="text-xs text-cream/55 mt-1">+ {formatCurrency(result.recommendedRenewalReserve)} רזרבת חידוש</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-light mb-1">נקודת איזון</p>
          <p className="text-2xl font-bold">{result.breakEvenUnits}</p>
          <p className="text-xs text-cream/55 mt-1">{bt.revenue.unitLabel} / חודש</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-5 sm:p-6 grid md:grid-cols-2 gap-6">
        {/* Setup */}
        <div>
          <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
            <span className="text-gold">✦</span> עלות הקמה חד-פעמית
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {result.setupLines.map((l) => (
                <tr key={l.name} className="border-b border-ink/10">
                  <td className="py-2 text-ink/70">{l.name}</td>
                  <td className="py-2 text-left font-medium text-ink">{formatCurrency(l.amount)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-ink/20">
                <td className="py-2 font-bold text-ink">סה"כ הקמה</td>
                <td className="py-2 text-left font-bold text-ink">{formatCurrency(result.setupTotal)}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-ink/55 mt-3">
            הציוד והשיפוץ ({formatCurrency(result.depreciableBase)}) הם תזרים יוצא במעמד ההקמה. מומלץ להחזיק
            <strong className="text-ink"> הון חוזר של {formatCurrency(result.recommendedWorkingCapital)}</strong> (≈4 חודשי הוצאות) לתקופת ההרצה.
          </p>
        </div>

        {/* Monthly */}
        <div>
          <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
            <span className="text-gold">✦</span> הוצאות חודשיות
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {result.monthlyLines.map((l) => (
                <tr key={l.name} className="border-b border-ink/10">
                  <td className="py-2 text-ink/70">{l.name}</td>
                  <td className="py-2 text-left font-medium text-ink">{formatCurrency(l.amount)}</td>
                </tr>
              ))}
              <tr className="border-b border-ink/10 bg-cream-2/50">
                <td className="py-2 text-ink/70">
                  רזרבת חידוש / פחת
                  <span className="block text-xs text-ink/45">ציוד מתבלה — הפרשה חודשית ({result.equipmentUsefulLifeYears} שנות חיים)</span>
                </td>
                <td className="py-2 text-left font-medium text-gold">{formatCurrency(result.recommendedRenewalReserve)}</td>
              </tr>
              <tr className="border-t-2 border-ink/20">
                <td className="py-2 font-bold text-ink">סה"כ חודשי (כולל רזרבה)</td>
                <td className="py-2 text-left font-bold text-ink">
                  {formatCurrency(result.monthlyFixedTotal + result.recommendedRenewalReserve)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit projection */}
      <div className="p-5 sm:p-6 border-t border-ink/15 bg-cream-2/40">
        <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
          <span className="text-gold">✦</span> תחזית רווחיות — ב-{result.projectedUnits} {bt.revenue.unitLabel} בחודש
        </h3>
        <div className="grid sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-ink/55">הכנסה חודשית</p>
            <p className="text-lg font-bold text-ink">{formatCurrency(result.projectedRevenue)}</p>
          </div>
          <div>
            <p className="text-ink/55">רווח תזרימי</p>
            <p className="text-lg font-bold text-ink">{formatCurrency(result.projectedMonthlyProfit)}</p>
          </div>
          <div>
            <p className="text-ink/55">רווח אחרי רזרבה</p>
            <p className={`text-lg font-bold ${profitPositive ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(result.projectedProfitAfterReserve)}
            </p>
          </div>
          <div>
            <p className="text-ink/55">החזר השקעה</p>
            <p className="text-lg font-bold text-ink">
              {result.monthsToRecoup ? `${result.monthsToRecoup} חודשים` : '—'}
            </p>
          </div>
        </div>
        {!profitPositive && (
          <p className="text-xs text-red-700 mt-3">
            בהיקף הזה העסק עדיין לא מכסה את עלות הבלאי של הציוד. צריך יותר {bt.revenue.unitLabel} כדי להיות בר-קיימא לטווח ארוך.
          </p>
        )}
      </div>

      <p className="px-5 sm:px-6 py-3 text-xs text-ink/50 border-t border-ink/15">
        ⚠️ אומדן בקירוב בלבד לפי טווחי שוק 2026 — לא תחליף לתוכנית עסקית מקצועית או להצעות מחיר.
      </p>
    </div>
  );
}
