'use client';

/**
 * KPI Bar - shows real-time cross-section KPIs from Budget + Cash Flow + Analysis.
 * Sticky at top of unified tool to provide constant context.
 */

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { calculateCashFlow } from '@/lib/tools/cashflow-engine';
import {
  calculateRatios,
  calculateZScore,
  calculateHealthScore,
  calculateCreditRating,
  type RatioInputData,
} from '@/lib/tools/financial-analyzer';
import { formatCurrency } from '@/lib/tools/format';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  Trophy,
  Shield,
  Activity,
} from 'lucide-react';

export function UnifiedKPIBar() {
  const { budget, settings, balanceSheet, cashFlow } = useTools();

  const data = useMemo(() => {
    if (!budget || !settings) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const cashMonthly = cashFlow ? calculateCashFlow(budget, cashFlow, settings) : [];
    const finalBalance = cashMonthly.length > 0 ? cashMonthly[cashMonthly.length - 1].closingBalance : settings.openingBalance;
    const minBalance = cashMonthly.length > 0 ? Math.min(...cashMonthly.map((m) => m.closingBalance)) : settings.openingBalance;

    let analysis = null;
    if (balanceSheet && balanceSheet.totalAssets > 0) {
      const annualDebtPayment = budget.loans.reduce((sum, loan) => {
        const r = loan.annualRate / 100 / 12;
        const n = loan.termMonths;
        const pmt =
          r === 0
            ? loan.amount / n
            : (loan.amount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
        return sum + pmt * 12;
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
      analysis = { ratios, health, credit, zScore };
    }

    return {
      revenue: totals.income,
      netProfit: totals.netProfit,
      netMargin: totals.netMargin,
      ebitda: totals.ebitda,
      finalBalance,
      minBalance,
      hasNegativeMonths: cashMonthly.some((m) => m.closingBalance < 0),
      analysis,
    };
  }, [budget, settings, balanceSheet, cashFlow]);

  if (!data || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);
  const fmtCompact = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toFixed(0);
  };

  const profitColor = data.netProfit > 0 ? 'emerald' : 'red';
  const cashColor = data.hasNegativeMonths
    ? 'red'
    : data.finalBalance > 0
      ? 'emerald'
      : 'gray';

  const dscrValue = data.analysis?.ratios.dscr ?? 0;
  const dscrColor = !data.analysis
    ? 'gray'
    : dscrValue >= 1.5
      ? 'emerald'
      : dscrValue >= 1
        ? 'amber'
        : 'red';

  const ratingColor = !data.analysis
    ? 'gray'
    : data.analysis.credit.investmentGrade
      ? 'emerald'
      : 'amber';

  const zScoreColor = !data.analysis
    ? 'gray'
    : data.analysis.zScore.zone === 'safe'
      ? 'emerald'
      : data.analysis.zScore.zone === 'grey'
        ? 'amber'
        : 'red';

  return (
    <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-200">📊 KPI חי - מתעדכן בזמן אמת</span>
        <span className="text-[10px] text-slate-400">
          {settings.companyName || 'החברה'} • {settings.fiscalYear}
        </span>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-0 divide-x divide-white/10">
        <KPI
          icon={TrendingUp}
          label="הכנסות"
          value={fmtCompact(data.revenue)}
          color="blue"
        />
        <KPI
          icon={data.netProfit >= 0 ? TrendingUp : TrendingDown}
          label="רווח נקי"
          value={fmtCompact(data.netProfit)}
          subValue={`${(data.netMargin || 0).toFixed(1)}%`}
          color={profitColor}
        />
        <KPI
          icon={Wallet}
          label="מזומן בסוף תקופה"
          value={fmtCompact(data.finalBalance)}
          subValue={data.hasNegativeMonths ? '⚠️ סיכון' : '✓ יציב'}
          color={cashColor}
        />
        <KPI
          icon={Banknote}
          label="DSCR"
          value={
            !data.analysis ? '-' : dscrValue > 99 ? '∞' : dscrValue.toFixed(2)
          }
          subValue="כיסוי חוב"
          color={dscrColor}
        />
        <KPI
          icon={Trophy}
          label="דירוג אשראי"
          value={data.analysis?.credit.rating ?? '-'}
          subValue={data.analysis?.credit.outlook ?? 'מלא מאזן'}
          color={ratingColor}
        />
        <KPI
          icon={Shield}
          label="Z-Score"
          value={data.analysis?.zScore.score.toFixed(2) ?? '-'}
          subValue={
            data.analysis?.zScore.zone === 'safe'
              ? 'בטוח'
              : data.analysis?.zScore.zone === 'grey'
                ? 'אפור'
                : data.analysis?.zScore.zone === 'distress'
                  ? 'סכנה'
                  : 'מלא מאזן'
          }
          color={zScoreColor}
        />
      </div>
    </div>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  subValue?: string;
  color: 'emerald' | 'red' | 'amber' | 'blue' | 'gray';
}) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-300',
    red: 'text-red-300',
    amber: 'text-amber-300',
    blue: 'text-blue-300',
    gray: 'text-slate-400',
  };
  const valueColor = colorMap[color];
  return (
    <div className="px-3 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-300 mb-0.5">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>
      <div className={`text-lg font-bold ${valueColor}`}>{value}</div>
      {subValue && <div className="text-[10px] text-slate-400">{subValue}</div>}
    </div>
  );
}
