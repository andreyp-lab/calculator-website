'use client';

import { useState, useMemo } from 'react';
import { calculateROI, type ROIInput } from '@/lib/calculators/investments';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

const initialInput: ROIInput = {
  initialInvestment: 100000,
  finalValue: 150000,
  years: 3,
  additionalCosts: 0,
  additionalIncome: 0,
};

export function ROICalculator() {
  const [input, setInput] = useState<ROIInput>(initialInput);

  const result = useMemo(() => calculateROI(input), [input]);

  function update<K extends keyof ROIInput>(field: K, value: ROIInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-paper border border-ink/15 rounded-none p-6">
        <h2 className="text-xl font-bold text-ink mb-6">פרטי ההשקעה</h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="roicalculator-89d9e5" className="block text-sm font-medium text-ink/70 mb-2">
              סכום השקעה ראשוני (₪)
            </label>
            <input id="roicalculator-89d9e5"
              type="number"
              min={0}
              step={1000}
              value={input.initialInvestment}
              onChange={(e) => update('initialInvestment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold text-lg"
            />
          </div>

          <div>
            <label htmlFor="roicalculator-44081c" className="block text-sm font-medium text-ink/70 mb-2">
              שווי סופי / סכום שנמכר (₪)
            </label>
            <input id="roicalculator-44081c"
              type="number"
              min={0}
              step={1000}
              value={input.finalValue}
              onChange={(e) => update('finalValue', Number(e.target.value))}
              className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold text-lg"
            />
          </div>

          <div>
            <label htmlFor="roicalculator-4ba53f" className="block text-sm font-medium text-ink/70 mb-2">
              תקופת ההשקעה (שנים)
            </label>
            <input id="roicalculator-4ba53f"
              type="number"
              min={0.1}
              max={50}
              step={0.1}
              value={input.years}
              onChange={(e) => update('years', Number(e.target.value))}
              className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-xs text-ink/70 mt-1">לחישוב תשואה שנתית מנורמלת</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ink/15">
            <div>
              <label htmlFor="roicalculator-3609be" className="block text-sm font-medium text-ink/70 mb-2">
                עלויות נוספות (₪)
              </label>
              <input id="roicalculator-3609be"
                type="number"
                min={0}
                step={100}
                value={input.additionalCosts}
                onChange={(e) => update('additionalCosts', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
              <p className="text-xs text-ink/70 mt-1">הזינו עלויות ששולמו בפועל, לרבות מס אם ידוע</p>
            </div>
            <div>
              <label htmlFor="roicalculator-9f5c63" className="block text-sm font-medium text-ink/70 mb-2">
                הכנסות נוספות (₪)
              </label>
              <input id="roicalculator-9f5c63"
                type="number"
                min={0}
                step={100}
                value={input.additionalIncome}
                onChange={(e) => update('additionalIncome', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
              <p className="text-xs text-ink/70 mt-1">דיבידנדים, שכר דירה ועוד</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="ROI כולל"
          value={formatPercent(result.roi / 100, 1)}
          subtitle={result.isPositive ? 'רווח לפי הנתונים שהוזנו' : 'הפסד לפי הנתונים שהוזנו'}
          variant={result.isPositive ? 'success' : 'warning'}
        />

        <ResultCard
          title="קצב שנתי שקול לתקופה"
          value={formatPercent(result.annualizedROI / 100, 2)}
          subtitle={`לפי ${input.years} שנים`}
          variant="primary"
        />

        <ResultCard
          title="רווח/הפסד לפי הנתונים"
          value={formatCurrency(result.netProfit)}
          subtitle={`מתוך ${formatCurrency(input.initialInvestment)} השקעה`}
          variant={result.isPositive ? 'success' : 'warning'}
        />

        <Breakdown
          title="פירוט החישוב"
          defaultOpen
          items={[
            { label: 'השקעה ראשונית', value: formatCurrency(input.initialInvestment) },
            { label: 'עלויות נוספות', value: formatCurrency(input.additionalCosts) },
            {
              label: 'סך עלות',
              value: formatCurrency(input.initialInvestment + input.additionalCosts),
              bold: true,
            },
            { label: 'שווי סופי', value: formatCurrency(input.finalValue) },
            { label: 'הכנסות נוספות', value: formatCurrency(input.additionalIncome) },
            { label: 'סך תמורה', value: formatCurrency(result.totalReturn), bold: true },
            { label: 'רווח לאחר העלויות שהוזנו', value: formatCurrency(result.netProfit), bold: true },
          ]}
        />

        <div className="bg-cream-2 border border-ink/15 rounded-none p-3 text-xs">
          <p className="font-medium text-ink mb-1">איך לפרש את התוצאה:</p>
          <ul className="text-ink/70 space-y-0.5">
            <li>השיעור השנתי שקול לשינוי בין הסכום הכולל שהושקע לתמורה הסופית.</li>
            <li>אם היו תזרימי כסף במועדים שונים, השיעור אינו IRR ואינו מתאים להשוואה מדויקת.</li>
            <li>בדקו סיכון, אינפלציה, עלויות ומס שלא הוזנו לפני קבלת החלטה.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
