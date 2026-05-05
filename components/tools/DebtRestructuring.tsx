'use client';

import { useState, useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { restructureDebt } from '@/lib/tools/cashflow-engine';
import { calculateLoan } from '@/lib/tools/budget-engine';
import { formatCurrency } from '@/lib/tools/format';
import { RefreshCw, ArrowLeftRight, Calculator } from 'lucide-react';

export function DebtRestructuring() {
  const { budget, settings, updateLoan } = useTools();
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [newTermMonths, setNewTermMonths] = useState(120);
  const [newRate, setNewRate] = useState<number | ''>('');

  if (!budget || !settings) return null;

  const loan = budget.loans.find((l) => l.id === selectedLoanId);

  const result = useMemo(() => {
    if (!loan) return null;
    const calc = calculateLoan(loan);
    const remainingMonths = loan.termMonths;
    return restructureDebt(
      loan.amount,
      loan.annualRate,
      remainingMonths,
      newTermMonths,
      newRate === '' ? loan.annualRate : Number(newRate),
    );
  }, [loan, newTermMonths, newRate]);

  function applyRestructure() {
    if (!loan || !result || !settings) return;
    if (!confirm(`האם להחיל פריסה? התשלום החודשי ישתנה מ-${formatCurrency(result.originalMonthlyPayment, settings.currency)} ל-${formatCurrency(result.newMonthlyPayment, settings.currency)}`)) return;

    updateLoan(loan.id, {
      termMonths: newTermMonths,
      annualRate: newRate === '' ? loan.annualRate : Number(newRate),
    });
    alert('פריסה הוחלה בהצלחה!');
  }

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-base text-gray-900">פריסת חוב</h3>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded p-2 mb-3 text-xs text-purple-900">
        💡 פריסה מחדש של הלוואה (הארכת תקופה / הקלת ריבית) מקטינה את התשלום החודשי
        ומשפרת את התזרים. <strong>אבל</strong> מגדילה את סך הריבית הכוללת.
      </div>

      {budget.loans.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-xs">
          אין הלוואות לפריסה. הוסף הלוואה ב-{`"`}תכנון תקציב{`"`} קודם.
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs text-gray-700 mb-1">בחר הלוואה לפריסה</label>
              <select
                value={selectedLoanId}
                onChange={(e) => {
                  setSelectedLoanId(e.target.value);
                  const l = budget.loans.find((x) => x.id === e.target.value);
                  if (l) {
                    setNewTermMonths(l.termMonths * 1.5);
                    setNewRate('');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="">בחר הלוואה...</option>
                {budget.loans.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} - {fmt(l.amount)} ({l.annualRate}%, {l.termMonths} חודשים)
                  </option>
                ))}
              </select>
            </div>

            {loan && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">תקופה חדשה (חודשים)</label>
                  <input
                    type="number"
                    value={newTermMonths}
                    onChange={(e) => setNewTermMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    ({(newTermMonths / 12).toFixed(1)} שנים)
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    ריבית חדשה (%) - השאר ריק כדי לא לשנות
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`${loan.annualRate}% (נוכחית)`}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {result && loan && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <div className="text-[10px] text-blue-700">תשלום חודשי נוכחי</div>
                  <div className="text-base font-bold text-blue-900">
                    {fmt(result.originalMonthlyPayment)}
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                  <div className="text-[10px] text-emerald-700">תשלום חודשי חדש</div>
                  <div className="text-base font-bold text-emerald-900">
                    {fmt(result.newMonthlyPayment)}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">חיסכון חודשי בתזרים</div>
                      <div
                        className={`font-bold ${result.cashFlowReliefMonthly > 0 ? 'text-emerald-700' : 'text-red-700'}`}
                      >
                        {fmt(result.cashFlowReliefMonthly)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">תוספת ריבית כוללת</div>
                      <div
                        className={`font-bold ${result.additionalInterestCost < 0 ? 'text-emerald-700' : 'text-red-700'}`}
                      >
                        {result.additionalInterestCost > 0 ? '+' : ''}
                        {fmt(result.additionalInterestCost)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900">
                <strong>סיכום:</strong> פריסה ל-{newTermMonths} חודשים תקטין את התשלום החודשי
                ב-{fmt(result.cashFlowReliefMonthly)} (
                {((result.cashFlowReliefMonthly / result.originalMonthlyPayment) * 100).toFixed(0)}
                %), אבל תוסיף {fmt(result.additionalInterestCost)} לסך הריבית.
              </div>

              <button
                onClick={applyRestructure}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                החל פריסה על ההלוואה
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
