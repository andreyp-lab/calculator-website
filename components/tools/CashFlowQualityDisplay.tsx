'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { analyzeCashFlowQuality } from '@/lib/tools/cash-flow-quality';
import { formatCurrency } from '@/lib/tools/format';
import { Droplets, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export function CashFlowQualityDisplay() {
  const { budget, settings, balanceSheet } = useTools();

  const analysis = useMemo(() => {
    if (!budget || !settings || !balanceSheet) return null;
    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);

    // Estimate WC changes (simplified - based on revenue growth)
    const wcEstimateRate = 0.05; // 5% of revenue change
    const changeInReceivables = totals.income * wcEstimateRate;
    const changeInInventory = totals.cogs * wcEstimateRate;
    const changeInPayables = totals.cogs * wcEstimateRate * 0.8;

    return analyzeCashFlowQuality(
      {
        revenue: totals.income,
        netProfit: totals.netProfit,
        ebit: totals.operatingProfit,
        ebitda: totals.ebitda,
        depreciation: 0, // not tracked
        amortization: 0,
        interestExpense: totals.financial,
        taxExpense: totals.tax,
        changeInReceivables,
        changeInInventory,
        changeInPayables,
        changeInOtherWC: 0,
        capex: totals.income * 0.05,
        assetSales: 0,
        debtIssuance: 0,
        debtRepayment: budget.loans.reduce((s, l) => s + l.amount * 0.1, 0),
        dividendsPaid: 0,
        equityIssuance: 0,
        openingCash: settings.openingBalance,
      },
      balanceSheet.totalAssets || 1,
      (balanceSheet.shortTermDebt || 0) + (balanceSheet.longTermDebt || 0),
    );
  }, [budget, settings, balanceSheet]);

  if (!analysis) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתונים לניתוח איכות תזרים</p>
      </div>
    );
  }

  const fmt = (v: number) => formatCurrency(v, settings?.currency ?? 'ILS');
  const qualityColor = {
    excellent: 'emerald',
    good: 'blue',
    fair: 'amber',
    poor: 'orange',
    red_flag: 'red',
  }[analysis.qualityMetrics.earningsQuality];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            איכות תזרים מזומנים
          </h3>
          <p className="text-xs text-cyan-100">
            ניתוח לפי שיטה אינדירקטית + Free Cash Flow + מדדי איכות
          </p>
        </div>
      </div>

      {/* Quality Score */}
      <div
        className={`bg-${qualityColor}-50 border-4 border-${qualityColor}-300 rounded-xl p-6 text-center`}
      >
        <div className="text-xs text-gray-600 mb-1">ציון איכות תזרים</div>
        <div className={`text-6xl font-bold text-${qualityColor}-700 mb-2`}>
          {analysis.qualityMetrics.qualityScore}/100
        </div>
        <div className={`text-lg font-semibold text-${qualityColor}-800`}>
          {analysis.qualityMetrics.earningsQuality === 'excellent' && '🌟 מצוין'}
          {analysis.qualityMetrics.earningsQuality === 'good' && '✅ טוב'}
          {analysis.qualityMetrics.earningsQuality === 'fair' && '⚖️ סביר'}
          {analysis.qualityMetrics.earningsQuality === 'poor' && '⚠️ חלש'}
          {analysis.qualityMetrics.earningsQuality === 'red_flag' && '🚩 דגל אדום'}
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid md:grid-cols-3 gap-3">
        <QualityMetric
          label="תזרים / רווח"
          value={
            analysis.qualityMetrics.cashFlowToNetIncome > 99
              ? '∞'
              : analysis.qualityMetrics.cashFlowToNetIncome.toFixed(2)
          }
          target=">1.0"
          color={
            analysis.qualityMetrics.cashFlowToNetIncome >= 1
              ? 'emerald'
              : analysis.qualityMetrics.cashFlowToNetIncome >= 0.7
                ? 'amber'
                : 'red'
          }
        />
        <QualityMetric
          label="מרווח תזרים"
          value={`${(analysis.qualityMetrics.cashFlowMargin * 100).toFixed(1)}%`}
          target=">10%"
          color={
            analysis.qualityMetrics.cashFlowMargin >= 0.10
              ? 'emerald'
              : analysis.qualityMetrics.cashFlowMargin >= 0.05
                ? 'amber'
                : 'red'
          }
        />
        <QualityMetric
          label="יחס צבירה"
          value={`${(analysis.qualityMetrics.accrualRatio * 100).toFixed(1)}%`}
          target="<5%"
          color={
            Math.abs(analysis.qualityMetrics.accrualRatio) <= 0.05
              ? 'emerald'
              : Math.abs(analysis.qualityMetrics.accrualRatio) <= 0.1
                ? 'amber'
                : 'red'
          }
        />
      </div>

      {/* Cash Flow Decomposition */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-blue-600 text-white p-3">
          <h4 className="font-bold">פירוק תזרים (שיטה אינדירקטית)</h4>
        </div>
        <div className="p-4 space-y-1 text-sm">
          <CashFlowRow label="רווח נקי" value={analysis.decomposition.netIncome} fmt={fmt} bold />
          <CashFlowRow label="+ פחת" value={analysis.decomposition.depreciation} fmt={fmt} indent />
          <CashFlowRow
            label="+ הפחתות"
            value={analysis.decomposition.amortization}
            fmt={fmt}
            indent
          />
          <div className="bg-gray-50 p-2 rounded my-2">
            <div className="font-semibold text-xs text-gray-700 mb-1">שינויים בהון חוזר:</div>
            <CashFlowRow
              label="לקוחות"
              value={analysis.decomposition.changeInWC.receivables}
              fmt={fmt}
              indent
              small
            />
            <CashFlowRow
              label="מלאי"
              value={analysis.decomposition.changeInWC.inventory}
              fmt={fmt}
              indent
              small
            />
            <CashFlowRow
              label="ספקים"
              value={analysis.decomposition.changeInWC.payables}
              fmt={fmt}
              indent
              small
            />
            <CashFlowRow
              label="סה״כ Δ הון חוזר"
              value={analysis.decomposition.changeInWC.total}
              fmt={fmt}
              indent
              small
              bold
            />
          </div>
          <CashFlowRow
            label="= תזרים תפעולי"
            value={analysis.decomposition.cashFromOperations}
            fmt={fmt}
            highlight="emerald"
          />
          <div className="border-t-2 my-2"></div>
          <CashFlowRow label="− CapEx" value={analysis.decomposition.capex} fmt={fmt} indent />
          <CashFlowRow
            label="+ מכירת נכסים"
            value={analysis.decomposition.assetSales}
            fmt={fmt}
            indent
          />
          <CashFlowRow
            label="= תזרים השקעה"
            value={analysis.decomposition.cashFromInvesting}
            fmt={fmt}
            highlight="amber"
          />
          <div className="border-t-2 my-2"></div>
          <CashFlowRow
            label="+ הנפקת חוב"
            value={analysis.decomposition.debtIssuance}
            fmt={fmt}
            indent
          />
          <CashFlowRow
            label="− החזר חוב"
            value={analysis.decomposition.debtRepayment}
            fmt={fmt}
            indent
          />
          <CashFlowRow
            label="− דיבידנד"
            value={analysis.decomposition.dividends}
            fmt={fmt}
            indent
          />
          <CashFlowRow
            label="= תזרים מימון"
            value={analysis.decomposition.cashFromFinancing}
            fmt={fmt}
            highlight="purple"
          />
          <div className="border-t-2 my-2"></div>
          <CashFlowRow
            label="שינוי נטו במזומן"
            value={analysis.decomposition.netChangeInCash}
            fmt={fmt}
            bold
            highlight={analysis.decomposition.netChangeInCash >= 0 ? 'emerald' : 'red'}
          />
          <CashFlowRow
            label="יתרת מזומן סוף תקופה"
            value={analysis.decomposition.endingCash}
            fmt={fmt}
            bold
            highlight="blue"
          />
        </div>
      </div>

      {/* Free Cash Flow */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-600 text-white p-3">
          <h4 className="font-bold">Free Cash Flow</h4>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-3 text-sm">
          <FCFCard
            label="FCFF (לפירמה)"
            value={fmt(analysis.freeCashFlow.fcff)}
            color={analysis.freeCashFlow.fcff > 0 ? 'emerald' : 'red'}
          />
          <FCFCard
            label="FCFE (להון)"
            value={fmt(analysis.freeCashFlow.fcfe)}
            color={analysis.freeCashFlow.fcfe > 0 ? 'emerald' : 'red'}
          />
          <FCFCard
            label="Unlevered FCF"
            value={fmt(analysis.freeCashFlow.unleveredFCF)}
            color={analysis.freeCashFlow.unleveredFCF > 0 ? 'emerald' : 'red'}
          />
          <FCFCard
            label="Levered FCF"
            value={fmt(analysis.freeCashFlow.leveredFCF)}
            color={analysis.freeCashFlow.leveredFCF > 0 ? 'emerald' : 'red'}
          />
        </div>
        <div className="bg-gray-50 border-t p-3 text-xs text-gray-700">
          מרווח FCF: {(analysis.freeCashFlow.fcfMargin * 100).toFixed(1)}% מהכנסות
        </div>
      </div>

      {/* Coverage Ratios */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-purple-600 text-white p-3">
          <h4 className="font-bold">יחסי כיסוי תזרימיים</h4>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-3 text-sm">
          <CoverageRow label="תזרים / חוב" value={analysis.coverageRatios.cashFlowToDebt} target={0.20} />
          <CoverageRow
            label="תזרים / ריבית"
            value={analysis.coverageRatios.cashFlowToInterest}
            target={3.0}
          />
          <CoverageRow label="תזרים / CapEx" value={analysis.coverageRatios.cashFlowToCapex} target={1.5} />
          <CoverageRow
            label="שיעור השקעה מחדש"
            value={analysis.coverageRatios.reinvestmentRatio}
            target={0.5}
            inverse
          />
        </div>
      </div>

      {/* Insights & Warnings */}
      {(analysis.insights.length > 0 || analysis.warnings.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3">
          {analysis.warnings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                אזהרות
              </h4>
              <ul className="text-xs text-red-900 space-y-1">
                {analysis.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.insights.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                תובנות
              </h4>
              <ul className="text-xs text-emerald-900 space-y-1">
                {analysis.insights.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QualityMetric({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: string;
  target: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-lg p-3 text-center`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-1">יעד: {target}</div>
    </div>
  );
}

function CashFlowRow({
  label,
  value,
  fmt,
  bold,
  indent,
  small,
  highlight,
}: {
  label: string;
  value: number;
  fmt: (v: number) => string;
  bold?: boolean;
  indent?: boolean;
  small?: boolean;
  highlight?: string;
}) {
  const highlightClass = highlight
    ? `bg-${highlight}-100 text-${highlight}-900 px-2 py-1 rounded font-bold`
    : '';
  return (
    <div
      className={`flex justify-between ${indent ? 'pr-4' : ''} ${small ? 'text-xs' : ''} ${highlightClass}`}
    >
      <span className={bold ? 'font-bold' : ''}>{label}</span>
      <span className={bold ? 'font-bold' : ''}>{fmt(value)}</span>
    </div>
  );
}

function FCFCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    red: { bg: 'bg-red-50', text: 'text-red-700' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} rounded p-3`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}

function CoverageRow({
  label,
  value,
  target,
  inverse,
}: {
  label: string;
  value: number;
  target: number;
  inverse?: boolean;
}) {
  const isGood = inverse ? value <= target : value >= target;
  const color = isGood ? 'text-emerald-700' : 'text-amber-700';
  return (
    <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <div className="text-left">
        <span className={`font-bold ${color}`}>
          {value > 99 ? '∞' : value.toFixed(2)}
        </span>
        <span className="text-[10px] text-gray-500 mr-2">
          ({inverse ? '<' : '>'}{target})
        </span>
      </div>
    </div>
  );
}
