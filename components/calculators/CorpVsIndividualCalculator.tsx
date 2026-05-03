'use client';

import { useState, useMemo } from 'react';
import { calculateCorpVsIndividual } from '@/lib/calculators/corporation-vs-individual';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

export function CorpVsIndividualCalculator() {
  const [annualProfit, setAnnualProfit] = useState(500_000);
  const [creditPoints, setCreditPoints] = useState(2.25);

  const result = useMemo(
    () => calculateCorpVsIndividual({ annualProfit, creditPoints }),
    [annualProfit, creditPoints],
  );

  const labels = {
    individual: 'עוסק מורשה',
    corporationDividend: 'חברה - דיבידנד',
    corporationSalary: 'חברה - משכורת',
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי החישוב</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              רווח שנתי לפני מס (₪)
            </label>
            <input
              type="number"
              min={0}
              step={10_000}
              value={annualProfit}
              onChange={(e) => setAnnualProfit(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">הכנסות פחות הוצאות מוכרות</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נקודות זיכוי
            </label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.25}
              value={creditPoints}
              onChange={(e) => setCreditPoints(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">2.25 = גבר רווק / 2.75 = אישה רווקה</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <ResultCard
          title={`המלצה: ${labels[result.recommendation]}`}
          value={formatCurrency(
            result[result.recommendation === 'individual' ? 'individual' : result.recommendation]
              .netToOwner,
          )}
          subtitle={
            result.recommendation === 'individual'
              ? 'במצב הנוכחי - עוסק מורשה עדיף'
              : `חיסכון של ${formatCurrency(result.taxSavingsVsIndividual)} מול עוסק מורשה`
          }
          variant="success"
        />

        <div className="grid md:grid-cols-3 gap-3">
          {(['individual', 'corporationDividend', 'corporationSalary'] as const).map((key) => {
            const s = result[key];
            const isRecommended = result.recommendation === key;
            return (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  isRecommended ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'
                }`}
              >
                <h4 className="font-bold text-sm text-gray-900 mb-2">{labels[key]}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">סה"כ מס:</span>
                    <span className="font-medium">{formatCurrency(s.totalTax)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">נטו לבעלים:</span>
                    <span className={`font-bold ${isRecommended ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {formatCurrency(s.netToOwner)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>שיעור מס:</span>
                    <span>{formatPercent(s.effectiveTaxRate, 1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-semibold mb-1">💡 כלל אצבע</p>
          <p>
            לרוב, חברה בע"מ משתלמת יותר ברווחים שנתיים מעל ~{formatCurrency(result.breakEvenProfit)}.
            המספר המדויק תלוי באיך מושכים את הכסף, נקודות זיכוי, וצבירת רווחים בחברה לעתיד.
          </p>
        </div>
      </div>
    </div>
  );
}
