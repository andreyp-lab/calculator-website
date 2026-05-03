'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  calculateMortgage,
  getMaxLoanAmount,
  type MortgageInput,
  type AmortizationMethod,
  type BuyerType,
  LTV_LIMITS_2026,
} from '@/lib/calculators/mortgage';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

interface CalculatorState {
  propertyValue: number;
  buyerType: BuyerType;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  method: AmortizationMethod;
}

const initial: CalculatorState = {
  propertyValue: 2_000_000,
  buyerType: 'first-home',
  loanAmount: 1_500_000,
  interestRate: 4.5,
  termYears: 25,
  method: 'shpitzer',
};

export function MortgageCalculator() {
  const [state, setState] = useState<CalculatorState>(initial);

  function update<K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) {
    setState((prev) => ({ ...prev, [field]: value }));
  }

  const maxLoan = getMaxLoanAmount(state.propertyValue, state.buyerType);
  const ltvPercentage = (state.loanAmount / state.propertyValue) * 100;
  const isLtvExceeded = state.loanAmount > maxLoan;

  const mortgageInput: MortgageInput = {
    loanAmount: state.loanAmount,
    interestRate: state.interestRate,
    termYears: state.termYears,
    method: state.method,
  };

  const result = useMemo(() => calculateMortgage(mortgageInput), [
    state.loanAmount,
    state.interestRate,
    state.termYears,
    state.method,
  ]);

  // נתוני גרף שנתיים
  const chartData = result.yearlyTotals.map((y) => ({
    year: `שנה ${y.year}`,
    קרן: Math.round(y.principal),
    ריבית: Math.round(y.interest),
    יתרה: Math.round(y.balance),
  }));

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי המשכנתא</h2>

          <div className="space-y-5">
            {/* Property Value */}
            <div>
              <label htmlFor="propertyValue" className="block text-sm font-medium text-gray-700 mb-2">
                שווי הדירה (ש"ח)
              </label>
              <input
                id="propertyValue"
                type="number"
                min={0}
                step={50_000}
                value={state.propertyValue}
                onChange={(e) => update('propertyValue', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buyer Type */}
            <div>
              <label htmlFor="buyerType" className="block text-sm font-medium text-gray-700 mb-2">
                סוג הרוכש
              </label>
              <select
                id="buyerType"
                value={state.buyerType}
                onChange={(e) => update('buyerType', e.target.value as BuyerType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="first-home">דירה ראשונה ויחידה (LTV עד 75%)</option>
                <option value="home-replacement">מחליף דירה (LTV עד 70%)</option>
                <option value="investor">משקיע / דירה נוספת (LTV עד 50%)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {LTV_LIMITS_2026[state.buyerType].description}. הלוואה מקסימלית:{' '}
                {formatCurrency(maxLoan)}
              </p>
            </div>

            {/* Loan Amount */}
            <div>
              <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
                סכום ההלוואה (ש"ח)
              </label>
              <input
                id="loanAmount"
                type="number"
                min={0}
                step={50_000}
                value={state.loanAmount}
                onChange={(e) => update('loanAmount', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  isLtvExceeded
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              <p
                className={`text-xs mt-1 ${
                  isLtvExceeded ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}
              >
                LTV: {ltvPercentage.toFixed(1)}%
                {isLtvExceeded && ' - חורג מהמגבלה!'}
              </p>
            </div>

            {/* Interest Rate */}
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
                ריבית שנתית (%)
              </label>
              <input
                id="rate"
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={state.interestRate}
                onChange={(e) => update('interestRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">ריבית ממוצעת ב-2026: 3.3%-5.5% (משתנה)</p>
            </div>

            {/* Term */}
            <div>
              <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
                תקופת ההלוואה (שנים)
              </label>
              <input
                id="term"
                type="number"
                min={1}
                max={30}
                step={1}
                value={state.termYears}
                onChange={(e) => update('termYears', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">מקסימום על פי החוק: 30 שנים</p>
            </div>

            {/* Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">שיטת חישוב</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => update('method', 'shpitzer')}
                  className={`px-4 py-3 rounded-lg border-2 transition text-right ${
                    state.method === 'shpitzer'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold mb-1">שפיצר</div>
                  <div className="text-xs">תשלום חודשי קבוע</div>
                </button>
                <button
                  type="button"
                  onClick={() => update('method', 'equal-principal')}
                  className={`px-4 py-3 rounded-lg border-2 transition text-right ${
                    state.method === 'equal-principal'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold mb-1">קרן שווה</div>
                  <div className="text-xs">תשלום יורד לאורך הזמן</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title={state.method === 'shpitzer' ? 'תשלום חודשי' : 'תשלום ראשון'}
            value={formatCurrency(result.firstPayment)}
            subtitle={
              state.method === 'equal-principal'
                ? `יורד ל-${formatCurrency(result.lastPayment)} בסוף`
                : 'קבוע לאורך התקופה'
            }
            variant="primary"
          />

          <ResultCard
            title="סך הריבית שתשולם"
            value={formatCurrency(result.totalInterest)}
            subtitle={`${((result.totalInterest / result.loanAmount) * 100).toFixed(1)}% מהקרן`}
            variant="warning"
          />

          <Breakdown
            title="פירוט המשכנתא"
            defaultOpen
            items={[
              { label: 'סכום ההלוואה', value: formatCurrency(result.loanAmount) },
              { label: 'תקופה', value: `${state.termYears} שנים (${state.termYears * 12} חודשים)` },
              { label: 'ריבית שנתית', value: `${state.interestRate}%` },
              { label: 'תשלום ראשון', value: formatCurrency(result.firstPayment) },
              { label: 'תשלום אחרון', value: formatCurrency(result.lastPayment) },
              {
                label: 'סך התשלומים',
                value: formatCurrency(result.totalPayments),
                bold: true,
              },
              { label: 'מתוכם ריבית', value: formatCurrency(result.totalInterest) },
            ]}
          />
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">תשלומים שנתיים - קרן וריבית</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelStyle={{ direction: 'rtl' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="קרן"
                  stackId="1"
                  stroke="#2563eb"
                  fill="url(#colorPrincipal)"
                />
                <Area
                  type="monotone"
                  dataKey="ריבית"
                  stackId="1"
                  stroke="#dc2626"
                  fill="url(#colorInterest)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
