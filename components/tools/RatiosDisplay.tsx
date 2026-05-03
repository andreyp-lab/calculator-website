'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  calculateRatios,
  calculateZScore,
  calculateHealthScore,
  calculateCreditRating,
  RatioInputData,
} from '@/lib/tools/financial-analyzer';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { formatCurrency, formatPercent, formatRatio, formatDays } from '@/lib/tools/format';
import { ChartBar, Shield, TrendingUp, AlertTriangle } from 'lucide-react';

export function RatiosDisplay() {
  const { budget, settings, balanceSheet } = useTools();

  const analysis = useMemo(() => {
    if (!budget || !settings || !balanceSheet) return null;
    if (balanceSheet.totalAssets === 0) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);

    const annualDebtPayment = budget.loans.reduce((sum, loan) => {
      const monthlyR = loan.annualRate / 100 / 12;
      const n = loan.termMonths;
      const monthlyPmt = monthlyR === 0 ? loan.amount / n : (loan.amount * (monthlyR * Math.pow(1 + monthlyR, n))) / (Math.pow(1 + monthlyR, n) - 1);
      return sum + monthlyPmt * 12;
    }, 0);

    const input: RatioInputData = {
      revenue: totals.income,
      cogs: totals.cogs,
      grossProfit: totals.grossProfit,
      operatingExpenses: totals.rnd + totals.marketing + totals.operating,
      operatingProfit: totals.operatingProfit,
      ebitda: totals.ebitda,
      netProfit: totals.netProfit,
      interestExpense: totals.financial,
      balance: balanceSheet,
      annualDebtPayment,
    };

    const ratios = calculateRatios(input);
    const health = calculateHealthScore(ratios);
    const credit = calculateCreditRating(ratios, health);
    const zScore = calculateZScore(input, 'private');

    return { ratios, health, credit, zScore };
  }, [budget, settings, balanceSheet]);

  if (!analysis) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-amber-900 mb-1">חסרים נתוני מאזן</h3>
          <p className="text-amber-800 text-sm">
            כדי לחשב יחסים פיננסיים, מלא את שדות המאזן (סך נכסים, התחייבויות, הון).
          </p>
        </div>
      </div>
    );
  }

  const { ratios, health, credit, zScore } = analysis;

  // Helpers for status colors
  const getStatusColor = (status: 'good' | 'warning' | 'bad'): string => {
    return {
      good: 'text-green-700 bg-green-50 border-green-200',
      warning: 'text-amber-700 bg-amber-50 border-amber-200',
      bad: 'text-red-700 bg-red-50 border-red-200',
    }[status];
  };

  const ratioStatus = (val: number, good: number, bad: number, higherBetter: boolean = true) => {
    if (higherBetter) {
      if (val >= good) return 'good';
      if (val <= bad) return 'bad';
    } else {
      if (val <= good) return 'good';
      if (val >= bad) return 'bad';
    }
    return 'warning';
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards - Top */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`border-2 rounded-lg p-4 ${
          credit.investmentGrade ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'
        }`}>
          <div className="text-xs text-gray-600 mb-1">דירוג אשראי</div>
          <div className={`text-3xl font-bold ${credit.investmentGrade ? 'text-green-700' : 'text-amber-700'}`}>
            {credit.rating}
          </div>
          <div className="text-xs text-gray-600">{credit.outlook}</div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">ציון בריאות</div>
          <div className="text-3xl font-bold text-blue-700">{health.totalScore}/100</div>
          <div className="text-xs text-gray-600">{health.grade}</div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${
          zScore.zone === 'safe' ? 'bg-green-50 border-green-300' :
          zScore.zone === 'grey' ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'
        }`}>
          <div className="text-xs text-gray-600 mb-1">Z-Score (Altman)</div>
          <div className={`text-3xl font-bold ${
            zScore.zone === 'safe' ? 'text-green-700' :
            zScore.zone === 'grey' ? 'text-amber-700' : 'text-red-700'
          }`}>
            {formatRatio(zScore.score)}
          </div>
          <div className="text-xs text-gray-600">
            {zScore.zone === 'safe' ? 'אזור בטוח' :
             zScore.zone === 'grey' ? 'אזור אפור' : 'סכנה'}
          </div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${
          ratios.dscr >= 1.5 ? 'bg-green-50 border-green-300' :
          ratios.dscr >= 1.0 ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'
        }`}>
          <div className="text-xs text-gray-600 mb-1">DSCR</div>
          <div className={`text-3xl font-bold ${
            ratios.dscr >= 1.5 ? 'text-green-700' :
            ratios.dscr >= 1.0 ? 'text-amber-700' : 'text-red-700'
          }`}>
            {ratios.dscr > 99 ? '∞' : formatRatio(ratios.dscr)}
          </div>
          <div className="text-xs text-gray-600">יכולת החזר חוב</div>
        </div>
      </div>

      {/* Ratios Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* רווחיות */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            יחסי רווחיות
          </h4>
          <div className="space-y-2 text-sm">
            <RatioRow label="מרווח גולמי" value={formatPercent(ratios.grossProfitMargin)} status={ratioStatus(ratios.grossProfitMargin, 30, 10)} />
            <RatioRow label="מרווח תפעולי" value={formatPercent(ratios.operatingProfitMargin)} status={ratioStatus(ratios.operatingProfitMargin, 15, 5)} />
            <RatioRow label="מרווח נקי" value={formatPercent(ratios.netProfitMargin)} status={ratioStatus(ratios.netProfitMargin, 10, 0)} />
            <RatioRow label="ROE" value={formatPercent(ratios.returnOnEquity)} status={ratioStatus(ratios.returnOnEquity, 15, 5)} />
            <RatioRow label="ROA" value={formatPercent(ratios.returnOnAssets)} status={ratioStatus(ratios.returnOnAssets, 8, 2)} />
          </div>
        </div>

        {/* נזילות */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            יחסי נזילות
          </h4>
          <div className="space-y-2 text-sm">
            <RatioRow label="יחס שוטף" value={formatRatio(ratios.currentRatio)} status={ratioStatus(ratios.currentRatio, 1.5, 1.0)} />
            <RatioRow label="יחס מהיר" value={formatRatio(ratios.quickRatio)} status={ratioStatus(ratios.quickRatio, 1.0, 0.5)} />
            <RatioRow label="יחס מזומן" value={formatRatio(ratios.cashRatio)} status={ratioStatus(ratios.cashRatio, 0.5, 0.2)} />
          </div>
        </div>

        {/* מינוף */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ChartBar className="w-4 h-4 text-purple-600" />
            יחסי מינוף
          </h4>
          <div className="space-y-2 text-sm">
            <RatioRow label="חוב להון" value={formatRatio(ratios.debtToEquity)} status={ratioStatus(ratios.debtToEquity, 1.0, 2.0, false)} />
            <RatioRow label="חוב לנכסים" value={formatRatio(ratios.debtToAssets)} status={ratioStatus(ratios.debtToAssets, 0.4, 0.7, false)} />
            <RatioRow label="כיסוי ריבית" value={ratios.interestCoverage > 99 ? '∞' : formatRatio(ratios.interestCoverage)} status={ratioStatus(ratios.interestCoverage, 5, 1.5)} />
          </div>
        </div>

        {/* הון חוזר */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ChartBar className="w-4 h-4 text-orange-600" />
            הון חוזר (ימים)
          </h4>
          <div className="space-y-2 text-sm">
            <RatioRow label="ימי לקוחות (DSO)" value={formatDays(ratios.dso)} status={ratioStatus(ratios.dso, 30, 90, false)} />
            <RatioRow label="ימי מלאי (DIO)" value={formatDays(ratios.dio)} status={ratioStatus(ratios.dio, 60, 120, false)} />
            <RatioRow label="ימי ספקים (DPO)" value={formatDays(ratios.dpo)} status={ratioStatus(ratios.dpo, 30, 60)} />
            <RatioRow label="מחזור מזומנים (CCC)" value={formatDays(ratios.ccc)} status={ratioStatus(ratios.ccc, 30, 90, false)} />
          </div>
        </div>
      </div>

      {/* Health Score Breakdown */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-3">פירוט ציון בריאות</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(health.breakdown).map(([key, score]) => {
            const labels: Record<string, string> = {
              profitability: 'רווחיות',
              liquidity: 'נזילות',
              leverage: 'מינוף',
              coverage: 'כיסוי',
              efficiency: 'יעילות',
            };
            return (
              <div key={key} className="bg-gray-50 rounded p-3 text-center">
                <div className="text-xs text-gray-600 mb-1">{labels[key]}</div>
                <div className={`text-2xl font-bold ${
                  score >= 70 ? 'text-green-700' : score >= 50 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {Math.round(score)}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-600 mt-3 text-center">
          {health.interpretation}
        </p>
      </div>
    </div>
  );
}

function RatioRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'bad';
}) {
  const colors = {
    good: 'text-green-700 bg-green-50',
    warning: 'text-amber-700 bg-amber-50',
    bad: 'text-red-700 bg-red-50',
  };
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-700">{label}</span>
      <span className={`px-2 py-0.5 rounded font-medium ${colors[status]}`}>{value}</span>
    </div>
  );
}
