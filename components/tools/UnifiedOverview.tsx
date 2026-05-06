'use client';

/**
 * Unified Overview - Dashboard with cross-section insights and quick actions.
 * Shows workflow status, top KPIs from each pillar, and cross-section alerts.
 */

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { calculateCashFlow, generateCashFlowInsights } from '@/lib/tools/cashflow-engine';
import {
  calculateRatios,
  calculateZScore,
  calculateHealthScore,
  calculateCreditRating,
  type RatioInputData,
} from '@/lib/tools/financial-analyzer';
import { formatCurrency, formatPercent } from '@/lib/tools/format';
import {
  TrendingUp,
  Wallet,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
  Target,
  Sparkles,
  Activity,
} from 'lucide-react';

interface NavTarget {
  master: 'overview' | 'budget' | 'cashflow' | 'analysis' | 'forecast';
  budget?:
    | 'inputs'
    | 'templates'
    | 'charts'
    | 'employees'
    | 'advanced'
    | 'benchmarks'
    | 'wc'
    | 'goals';
  cashflow?: 'dashboard' | 'manage' | 'restructure' | 'compare' | 'burn';
  analysis?:
    | 'data'
    | 'dupont'
    | 'dscr'
    | 'breakeven'
    | 'risk'
    | 'bank'
    | 'cashflow'
    | 'sensitivity'
    | 'forecast'
    | 'comparison'
    | 'benchmark';
  forecast?: 'three-statement' | 'monte-carlo' | 'cohort' | 'dcf' | 'captable';
}

interface Props {
  onNavigate: (target: NavTarget) => void;
}

export function UnifiedOverview({ onNavigate }: Props) {
  const { budget, settings, balanceSheet, cashFlow } = useTools();

  const data = useMemo(() => {
    if (!budget || !settings) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const cashMonthly = cashFlow ? calculateCashFlow(budget, cashFlow, settings) : [];
    const cashInsights = cashFlow ? generateCashFlowInsights(cashMonthly) : [];

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

    const finalBalance =
      cashMonthly.length > 0 ? cashMonthly[cashMonthly.length - 1].closingBalance : settings.openingBalance;
    const minBalance =
      cashMonthly.length > 0 ? Math.min(...cashMonthly.map((m) => m.closingBalance)) : settings.openingBalance;
    const hasNegativeMonths = cashMonthly.some((m) => m.closingBalance < 0);

    return { monthly, totals, cashMonthly, cashInsights, analysis, finalBalance, minBalance, hasNegativeMonths };
  }, [budget, settings, balanceSheet, cashFlow]);

  if (!data || !settings || !budget) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  // Status indicators
  const hasBudget = budget.income.length > 0 || budget.expenses.length > 0;
  const hasCashFlow = data.cashMonthly.length > 0;
  const hasAnalysis = data.analysis !== null;

  // Cross-section alerts
  const crossInsights: Array<{
    type: 'critical' | 'warning' | 'success' | 'info';
    title: string;
    description: string;
    action?: { label: string; target: NavTarget };
  }> = [];

  // Budget → Cash Flow disconnects
  if (data.totals.netProfit > 0 && data.hasNegativeMonths) {
    crossInsights.push({
      type: 'critical',
      title: '⚠️ רווח חיובי אבל תזרים שלילי!',
      description:
        'החברה רווחית על הנייר אבל יש חודשים עם יתרה שלילית - בעיה בעיתוי תקבולים/תשלומים',
      action: {
        label: 'בדוק תזרים',
        target: { master: 'cashflow', cashflow: 'dashboard' },
      },
    });
  }

  // Budget → Analysis disconnects
  if (data.analysis && data.analysis.ratios.dscr < 1.2 && data.totals.netProfit > 0) {
    crossInsights.push({
      type: 'warning',
      title: '⚠️ DSCR נמוך למרות רווחיות',
      description: `DSCR של ${data.analysis.ratios.dscr.toFixed(2)} - יכולת החזר חוב על הגבול`,
      action: {
        label: 'נתח DSCR',
        target: { master: 'analysis', analysis: 'dscr' },
      },
    });
  }

  // Cash Flow + Burn Rate
  if (data.totals.netProfit < 0 && data.minBalance < data.finalBalance * 0.3) {
    crossInsights.push({
      type: 'critical',
      title: '🔥 קצב שריפת מזומן מסכן את הפעילות',
      description: 'החברה מפסידה ויש סיכון לאזילת מזומן - בדוק runway',
      action: {
        label: 'בדוק Runway',
        target: { master: 'cashflow', cashflow: 'burn' },
      },
    });
  }

  // Working capital opportunity
  if (data.analysis && data.analysis.ratios.ccc > 90) {
    crossInsights.push({
      type: 'info',
      title: '💡 הזדמנות: שיפור הון חוזר',
      description: `CCC של ${data.analysis.ratios.ccc.toFixed(0)} ימים - יש פוטנציאל לשחרר מזומן`,
      action: {
        label: 'אופטימיזציית הון חוזר',
        target: { master: 'budget', budget: 'wc' },
      },
    });
  }

  // Z-Score critical
  if (data.analysis && data.analysis.zScore.zone === 'distress') {
    crossInsights.push({
      type: 'critical',
      title: '🚨 Z-Score באזור סכנה',
      description: 'מודל Altman מצביע על סיכון פשיטת רגל - דורש פעולה דחופה',
      action: {
        label: 'נתח סיכונים',
        target: { master: 'analysis', analysis: 'risk' },
      },
    });
  }

  // Investment grade success
  if (data.analysis && data.analysis.credit.investmentGrade && !data.hasNegativeMonths) {
    crossInsights.push({
      type: 'success',
      title: '✅ חברה במצב Investment Grade',
      description: `דירוג ${data.analysis.credit.rating} - יכולת גיוס מימון בתנאים טובים`,
      action: {
        label: 'בדוק קיבולת אשראי',
        target: { master: 'analysis', analysis: 'bank' },
      },
    });
  }

  // Combine cash insights
  for (const insight of data.cashInsights.slice(0, 3)) {
    crossInsights.push({
      type: insight.type as 'critical' | 'warning' | 'success' | 'info',
      title: insight.title,
      description: insight.description,
    });
  }

  return (
    <div className="space-y-4">
      {/* Workflow Status */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          סטטוס מערכת
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <WorkflowStep
            num={1}
            label="תקציב"
            sublabel={`${budget.income.length} הכנסות, ${budget.expenses.length} הוצאות`}
            done={hasBudget}
            onClick={() => onNavigate({ master: 'budget', budget: 'inputs' })}
          />
          <WorkflowStep
            num={2}
            label="תזרים מזומנים"
            sublabel={hasCashFlow ? `${data.cashMonthly.length} חודשים מחושבים` : 'דורש תקציב'}
            done={hasCashFlow}
            onClick={() => onNavigate({ master: 'cashflow', cashflow: 'dashboard' })}
          />
          <WorkflowStep
            num={3}
            label="ניתוח דוחות"
            sublabel={hasAnalysis ? `דירוג ${data.analysis!.credit.rating}` : 'מלא נתוני מאזן'}
            done={hasAnalysis}
            onClick={() => onNavigate({ master: 'analysis', analysis: 'data' })}
          />
        </div>
      </div>

      {/* Cross-Section Insights */}
      {crossInsights.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-3">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              תובנות חוצות-מערכת
            </h3>
            <p className="text-xs text-amber-100">
              ניתוח אוטומטי שמחבר נתונים מתקציב + תזרים + ניתוח
            </p>
          </div>
          <div className="p-3 space-y-2">
            {crossInsights.map((insight, i) => (
              <InsightCard key={i} insight={insight} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {/* Three Pillars Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Budget */}
        <PillarCard
          title="תקציב"
          icon={TrendingUp}
          color="emerald"
          onOpen={() => onNavigate({ master: 'budget', budget: 'inputs' })}
        >
          <PillarRow label="הכנסות" value={fmt(data.totals.income)} />
          <PillarRow label="הוצאות" value={fmt(data.totals.totalExpenses)} />
          <PillarRow
            label="רווח גולמי"
            value={`${data.totals.grossMargin.toFixed(1)}%`}
            highlight
          />
          <PillarRow
            label="רווח נקי"
            value={fmt(data.totals.netProfit)}
            highlight
            color={data.totals.netProfit > 0 ? 'emerald' : 'red'}
          />
          <PillarRow
            label="EBITDA"
            value={fmt(data.totals.ebitda)}
            color={data.totals.ebitda > 0 ? 'emerald' : 'red'}
          />
        </PillarCard>

        {/* Cash Flow */}
        <PillarCard
          title="תזרים"
          icon={Wallet}
          color="blue"
          onOpen={() => onNavigate({ master: 'cashflow', cashflow: 'dashboard' })}
        >
          <PillarRow label="פתיחה" value={fmt(settings.openingBalance)} />
          <PillarRow
            label="יתרה מינימלית"
            value={fmt(data.minBalance)}
            color={data.minBalance < 0 ? 'red' : 'emerald'}
          />
          <PillarRow
            label="יתרת סיום"
            value={fmt(data.finalBalance)}
            highlight
            color={data.finalBalance > 0 ? 'blue' : 'red'}
          />
          <PillarRow
            label="חודשים שליליים"
            value={data.cashMonthly.filter((m) => m.closingBalance < 0).length.toString()}
            color={data.hasNegativeMonths ? 'red' : 'emerald'}
          />
          <PillarRow
            label="עיכובים מוגדרים"
            value={cashFlow?.delays.length.toString() ?? '0'}
          />
        </PillarCard>

        {/* Analysis */}
        <PillarCard
          title="ניתוח"
          icon={BarChart3}
          color="orange"
          onOpen={() => onNavigate({ master: 'analysis', analysis: 'data' })}
        >
          {data.analysis ? (
            <>
              <PillarRow
                label="דירוג אשראי"
                value={data.analysis.credit.rating}
                highlight
                color={data.analysis.credit.investmentGrade ? 'emerald' : 'amber'}
              />
              <PillarRow
                label="ציון בריאות"
                value={`${data.analysis.health.totalScore}/100`}
              />
              <PillarRow
                label="Z-Score"
                value={data.analysis.zScore.score.toFixed(2)}
                color={
                  data.analysis.zScore.zone === 'safe'
                    ? 'emerald'
                    : data.analysis.zScore.zone === 'grey'
                      ? 'amber'
                      : 'red'
                }
              />
              <PillarRow
                label="DSCR"
                value={
                  data.analysis.ratios.dscr > 99
                    ? '∞'
                    : data.analysis.ratios.dscr.toFixed(2)
                }
                highlight
                color={
                  data.analysis.ratios.dscr >= 1.5
                    ? 'emerald'
                    : data.analysis.ratios.dscr >= 1
                      ? 'amber'
                      : 'red'
                }
              />
              <PillarRow
                label="ROE"
                value={`${data.analysis.ratios.returnOnEquity.toFixed(1)}%`}
              />
            </>
          ) : (
            <div className="text-sm text-gray-600 py-2">
              <p className="mb-2">מלא נתוני מאזן כדי לראות ניתוח מלא:</p>
              <ul className="text-xs space-y-1 text-gray-500">
                <li>• דירוג אשראי AAA-D</li>
                <li>• ציון בריאות 0-100</li>
                <li>• Altman Z-Score</li>
                <li>• 20+ יחסים פיננסיים</li>
              </ul>
            </div>
          )}
        </PillarCard>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          פעולות מהירות
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <QuickAction
            label="התחל מתבנית"
            description="6 ענפים מוכנים"
            onClick={() => onNavigate({ master: 'budget', budget: 'templates' })}
            color="violet"
          />
          <QuickAction
            label="ניתוח רגישות"
            description="בדוק תרחישים"
            onClick={() => onNavigate({ master: 'analysis', analysis: 'sensitivity' })}
            color="purple"
          />
          <QuickAction
            label="חיזוי 5 שנים"
            description="3-Statement Model"
            onClick={() => onNavigate({ master: 'forecast', forecast: 'three-statement' })}
            color="indigo"
          />
          <QuickAction
            label="הערכת שווי"
            description="DCF Valuation"
            onClick={() => onNavigate({ master: 'forecast', forecast: 'dcf' })}
            color="rose"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function WorkflowStep({
  num,
  label,
  sublabel,
  done,
  onClick,
}: {
  num: number;
  label: string;
  sublabel: string;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 border-2 rounded-lg transition hover:shadow-md text-right ${
        done
          ? 'bg-emerald-50 border-emerald-300'
          : 'bg-gray-50 border-gray-200 opacity-75'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
          done ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'
        }`}
      >
        {done ? <CheckCircle2 className="w-5 h-5" /> : num}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-600">{sublabel}</div>
      </div>
      <ArrowLeft className="w-4 h-4 text-gray-400 shrink-0" />
    </button>
  );
}

function PillarCard({
  title,
  icon: Icon,
  color,
  onOpen,
  children,
}: {
  title: string;
  icon: typeof TrendingUp;
  color: string;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  };
  const c = colorMap[color];
  return (
    <div className={`bg-white border-2 ${c.border} rounded-lg shadow-sm overflow-hidden`}>
      <div className={`${c.bg} p-3 flex items-center justify-between`}>
        <h4 className={`font-bold ${c.text} flex items-center gap-2`}>
          <Icon className="w-5 h-5" />
          {title}
        </h4>
        <button
          onClick={onOpen}
          className={`text-xs ${c.text} hover:underline flex items-center gap-1`}
        >
          פתח
          <ArrowLeft className="w-3 h-3" />
        </button>
      </div>
      <div className="p-4 space-y-1">{children}</div>
    </div>
  );
}

function PillarRow({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-700',
    red: 'text-red-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
  };
  const valueClass = color ? colorMap[color] : 'text-gray-900';
  return (
    <div
      className={`flex justify-between items-center py-1 ${
        highlight ? 'border-t pt-2 mt-2 font-semibold' : ''
      }`}
    >
      <span className="text-sm text-gray-600">{label}:</span>
      <span className={`text-sm ${highlight ? 'font-bold' : 'font-medium'} ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

function InsightCard({
  insight,
  onNavigate,
}: {
  insight: {
    type: 'critical' | 'warning' | 'success' | 'info';
    title: string;
    description: string;
    action?: { label: string; target: NavTarget };
  };
  onNavigate: (target: NavTarget) => void;
}) {
  const colorMap = {
    critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900' },
    info: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900' },
  };
  const c = colorMap[insight.type];
  return (
    <div className={`${c.bg} ${c.border} border rounded p-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className={`font-semibold ${c.text} mb-0.5`}>{insight.title}</div>
          <div className={`text-xs ${c.text} opacity-80`}>{insight.description}</div>
        </div>
        {insight.action && (
          <button
            onClick={() => onNavigate(insight.action!.target)}
            className={`shrink-0 text-xs font-medium ${c.text} hover:underline flex items-center gap-1`}
          >
            {insight.action.label}
            <ArrowLeft className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function QuickAction({
  label,
  description,
  onClick,
  color,
}: {
  label: string;
  description: string;
  onClick: () => void;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    violet: 'bg-violet-50 border-violet-200 hover:bg-violet-100 text-violet-900',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-900',
    indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-900',
    rose: 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-900',
  };
  return (
    <button
      onClick={onClick}
      className={`text-right p-3 border-2 rounded-lg transition ${colorMap[color]}`}
    >
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs opacity-75 mt-0.5">{description}</div>
    </button>
  );
}
