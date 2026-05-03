'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTools } from '@/lib/tools/ToolsContext';
import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { calculateCashFlow, generateCashFlowInsights } from '@/lib/tools/cashflow-engine';
import {
  calculateRatios,
  calculateZScore,
  calculateHealthScore,
  calculateCreditRating,
  RatioInputData,
} from '@/lib/tools/financial-analyzer';
import { formatCurrency, formatPercent, formatRatio } from '@/lib/tools/format';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  BarChart3,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Activity,
} from 'lucide-react';

export default function UnifiedDashboard() {
  const { budget, settings, balanceSheet, cashFlow } = useTools();

  const data = useMemo(() => {
    if (!budget || !settings || !cashFlow) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const cashFlowMonthly = calculateCashFlow(budget, cashFlow, settings);
    const cashInsights = generateCashFlowInsights(cashFlowMonthly);

    let analysis = null;
    if (balanceSheet && balanceSheet.totalAssets > 0) {
      const annualDebtPayment = budget.loans.reduce((sum, loan) => {
        const r = loan.annualRate / 100 / 12;
        const n = loan.termMonths;
        const pmt =
          r === 0 ? loan.amount / n : (loan.amount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
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

    return { monthly, totals, cashFlowMonthly, cashInsights, analysis };
  }, [budget, settings, balanceSheet, cashFlow]);

  if (!data || !settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">טוען נתונים...</p>
      </div>
    );
  }

  const { totals, cashFlowMonthly, cashInsights, analysis } = data;
  const fmt = (v: number) => formatCurrency(v, settings.currency);

  // Stage 1: Budget data?
  const hasBudget = budget && (budget.income.length > 0 || budget.expenses.length > 0);
  // Stage 2: Cash flow valid?
  const hasCashFlow = hasBudget && cashFlowMonthly.length > 0;
  // Stage 3: Analysis valid?
  const hasAnalysis = analysis !== null;

  // Calc closing balance trend
  const finalBalance =
    cashFlowMonthly.length > 0 ? cashFlowMonthly[cashFlowMonthly.length - 1].closingBalance : 0;
  const minBalance =
    cashFlowMonthly.length > 0
      ? Math.min(...cashFlowMonthly.map((m) => m.closingBalance))
      : 0;
  const hasNegativeMonths = cashFlowMonthly.some((m) => m.closingBalance < 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-100 p-3 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-purple-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">מערכת מאוחדת</h2>
          <p className="text-sm text-gray-600">
            תקציב + תזרים + ניתוח דוחות במקום אחד - תמונה מלאה של המצב הפיננסי
          </p>
        </div>
      </div>

      <ScenarioBar />
      <SettingsCard />

      {/* Workflow Indicator */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 mt-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">סטטוס המערכת</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <WorkflowStep
            num={1}
            label="תקציב"
            sublabel="הכנסות + הוצאות"
            done={!!hasBudget}
            href="/tools/budget"
          />
          <WorkflowStep
            num={2}
            label="תזרים מזומנים"
            sublabel="יתרות חודשיות"
            done={!!hasCashFlow}
            href="/tools/cash-flow"
          />
          <WorkflowStep
            num={3}
            label="ניתוח דוחות"
            sublabel="יחסים + Z-Score"
            done={hasAnalysis}
            href="/tools/financial-analysis"
          />
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* רווח נקי */}
        <KPICard
          label="רווח נקי"
          value={fmt(totals.netProfit)}
          subValue={formatPercent(totals.netMargin)}
          color={totals.netProfit > 0 ? 'green' : 'red'}
          icon={TrendingUp}
        />

        {/* יתרה צפויה */}
        <KPICard
          label="יתרה בסוף תקופה"
          value={fmt(finalBalance)}
          subValue={hasNegativeMonths ? '⚠️ יתרה שלילית בדרך' : '✓ יציב'}
          color={hasNegativeMonths ? 'red' : finalBalance > 0 ? 'green' : 'gray'}
          icon={Wallet}
        />

        {/* דירוג אשראי */}
        <KPICard
          label="דירוג אשראי"
          value={analysis?.credit.rating ?? 'N/A'}
          subValue={analysis?.credit.outlook ?? 'מלא מאזן לחישוב'}
          color={
            !analysis ? 'gray' : analysis.credit.investmentGrade ? 'green' : 'amber'
          }
          icon={BarChart3}
        />

        {/* DSCR */}
        <KPICard
          label="DSCR"
          value={
            !analysis
              ? 'N/A'
              : analysis.ratios.dscr > 99
                ? '∞'
                : formatRatio(analysis.ratios.dscr)
          }
          subValue="יכולת החזר חוב"
          color={
            !analysis
              ? 'gray'
              : analysis.ratios.dscr >= 1.5
                ? 'green'
                : analysis.ratios.dscr >= 1.0
                  ? 'amber'
                  : 'red'
          }
          icon={Activity}
        />
      </div>

      {/* Insights Panel */}
      {cashInsights.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            תובנות אוטומטיות
          </h3>
          <div className="space-y-2">
            {cashInsights.map((insight, i) => {
              const colors = {
                critical: 'bg-red-50 text-red-900 border-red-300',
                warning: 'bg-amber-50 text-amber-900 border-amber-300',
                success: 'bg-green-50 text-green-900 border-green-300',
                info: 'bg-blue-50 text-blue-900 border-blue-300',
              };
              return (
                <div
                  key={i}
                  className={`border rounded-lg p-3 text-sm ${colors[insight.type]}`}
                >
                  <div className="font-medium">{insight.title}</div>
                  <div className="text-xs opacity-80">{insight.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* תקציב */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              תקציב
            </h4>
            <Link
              href="/tools/budget"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              פתח <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">הכנסות:</span>
              <span className="font-medium">{fmt(totals.income)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">הוצאות:</span>
              <span className="font-medium">{fmt(totals.totalExpenses)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-bold">רווח נקי:</span>
              <span
                className={`font-bold ${
                  totals.netProfit > 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {fmt(totals.netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* תזרים */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              תזרים
            </h4>
            <Link
              href="/tools/cash-flow"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              פתח <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">יתרת פתיחה:</span>
              <span className="font-medium">{fmt(settings.openingBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">יתרה מינימלית:</span>
              <span
                className={`font-medium ${minBalance < 0 ? 'text-red-700' : ''}`}
              >
                {fmt(minBalance)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-bold">יתרת סיום:</span>
              <span
                className={`font-bold ${
                  finalBalance > 0 ? 'text-blue-700' : 'text-red-700'
                }`}
              >
                {fmt(finalBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* ניתוח */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              ניתוח
            </h4>
            <Link
              href="/tools/financial-analysis"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              פתח <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          {analysis ? (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">דירוג:</span>
                <span className="font-bold">{analysis.credit.rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">בריאות:</span>
                <span className="font-bold">{analysis.health.totalScore}/100</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="font-bold">Z-Score:</span>
                <span className="font-bold">{formatRatio(analysis.zScore.score)}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p>מלא נתוני מאזן כדי לקבל ניתוח מלא</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({
  num,
  label,
  sublabel,
  done,
  href,
}: {
  num: number;
  label: string;
  sublabel: string;
  done: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 border-2 rounded-lg transition hover:shadow-md ${
        done
          ? 'bg-green-50 border-green-300'
          : 'bg-gray-50 border-gray-200 opacity-75'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          done ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
        }`}
      >
        {done ? <CheckCircle2 className="w-5 h-5" /> : num}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-600">{sublabel}</div>
      </div>
      <ArrowLeft className="w-4 h-4 text-gray-400" />
    </Link>
  );
}

function KPICard({
  label,
  value,
  subValue,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  subValue: string;
  color: 'green' | 'red' | 'amber' | 'blue' | 'gray';
  icon: typeof TrendingUp;
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-300 text-green-700',
    red: 'bg-red-50 border-red-300 text-red-700',
    amber: 'bg-amber-50 border-amber-300 text-amber-700',
    blue: 'bg-blue-50 border-blue-300 text-blue-700',
    gray: 'bg-gray-50 border-gray-300 text-gray-700',
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs">{label}</span>
        <Icon className="w-4 h-4 opacity-60" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-1 opacity-75">{subValue}</div>
    </div>
  );
}
