'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import {
  calculateRatios,
  calculateZScore,
  RatioInputData,
} from '@/lib/tools/financial-analyzer';
import { identifyRisks, type RiskItem } from '@/lib/tools/risk-identifier';
import { Shield, AlertTriangle, AlertCircle, AlertOctagon, Info } from 'lucide-react';

export function RiskAssessmentDisplay() {
  const { budget, settings, balanceSheet } = useTools();

  const assessment = useMemo(() => {
    if (!budget || !settings || !balanceSheet || balanceSheet.totalAssets === 0) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const annualDebtPayment = budget.loans.reduce((sum, loan) => {
      const monthlyR = loan.annualRate / 100 / 12;
      const n = loan.termMonths;
      const monthlyPmt =
        monthlyR === 0
          ? loan.amount / n
          : (loan.amount * (monthlyR * Math.pow(1 + monthlyR, n))) / (Math.pow(1 + monthlyR, n) - 1);
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
    const zScore = calculateZScore(input, 'private');

    return identifyRisks({
      ratios,
      zScore,
      hasLoss: totals.netProfit < 0,
    });
  }, [budget, settings, balanceSheet]);

  if (!assessment) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתוני מאזן לזיהוי סיכונים</p>
      </div>
    );
  }

  const overallColor = {
    קריטי: 'red',
    גבוה: 'orange',
    'בינוני-גבוה': 'amber',
    בינוני: 'yellow',
    נמוך: 'emerald',
  }[assessment.summary.overallRiskLevel];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            זיהוי סיכונים פיננסיים
          </h3>
          <p className="text-xs text-rose-100">קיטלוג סיכונים לפי חומרה והמלצות פעולה</p>
        </div>
      </div>

      {/* Overall Risk Level */}
      <div
        className={`bg-${overallColor}-50 border-4 border-${overallColor}-300 rounded-xl p-6 text-center`}
      >
        <div className="text-xs text-gray-600 mb-1">רמת סיכון כוללת</div>
        <div className={`text-5xl font-bold text-${overallColor}-700 mb-2`}>
          {assessment.summary.overallRiskLevel}
        </div>
        <div className={`text-${overallColor}-800 font-semibold`}>
          ציון סיכון: {assessment.summary.overallRiskScore}/100
        </div>
      </div>

      {/* Summary Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <RiskCountCard
          icon={AlertOctagon}
          label="קריטי"
          count={assessment.summary.criticalCount}
          color="red"
        />
        <RiskCountCard
          icon={AlertTriangle}
          label="גבוה"
          count={assessment.summary.highCount}
          color="orange"
        />
        <RiskCountCard
          icon={AlertCircle}
          label="בינוני"
          count={assessment.summary.mediumCount}
          color="amber"
        />
        <RiskCountCard
          icon={Info}
          label="נמוך"
          count={assessment.summary.lowCount}
          color="blue"
        />
      </div>

      {/* Risk Lists */}
      {assessment.critical.length > 0 && (
        <RiskSection
          title="🚨 סיכונים קריטיים - דורשים פעולה מיידית"
          risks={assessment.critical}
          color="red"
        />
      )}

      {assessment.high.length > 0 && (
        <RiskSection
          title="⚠️ סיכונים גבוהים - דורשים פעולה בטווח קצר"
          risks={assessment.high}
          color="orange"
        />
      )}

      {assessment.medium.length > 0 && (
        <RiskSection
          title="📋 סיכונים בינוניים - מעקב נדרש"
          risks={assessment.medium}
          color="amber"
        />
      )}

      {assessment.low.length > 0 && (
        <RiskSection title="ℹ️ סיכונים נמוכים" risks={assessment.low} color="blue" />
      )}

      {assessment.summary.criticalCount === 0 &&
        assessment.summary.highCount === 0 &&
        assessment.summary.mediumCount === 0 && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-6 text-center">
            <p className="text-emerald-800 font-semibold">✅ לא זוהו סיכונים מהותיים</p>
            <p className="text-sm text-emerald-700 mt-1">החברה במצב פיננסי בריא</p>
          </div>
        )}
    </div>
  );
}

function RiskCountCard({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: typeof AlertCircle;
  label: string;
  count: number;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-lg p-3 text-center`}>
      <Icon className={`w-6 h-6 ${c.text} mx-auto mb-1`} />
      <div className={`text-2xl font-bold ${c.text}`}>{count}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function RiskSection({
  title,
  risks,
  color,
}: {
  title: string;
  risks: RiskItem[];
  color: string;
}) {
  const colorMap: Record<string, { bg: string; border: string; head: string }> = {
    red: { bg: 'bg-red-50', border: 'border-red-200', head: 'bg-red-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', head: 'bg-orange-600' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', head: 'bg-amber-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', head: 'bg-blue-600' },
  };
  const c = colorMap[color];

  return (
    <div className={`bg-white border-2 ${c.border} rounded-lg overflow-hidden shadow-sm`}>
      <div className={`${c.head} text-white p-3 font-bold text-sm`}>{title}</div>
      <div className="divide-y divide-gray-100">
        {risks.map((r, idx) => (
          <div key={idx} className={`p-3 ${idx % 2 === 1 ? c.bg : ''}`}>
            <div className="flex items-start justify-between mb-1">
              <h5 className="font-semibold text-gray-900">{r.title}</h5>
              {r.metric && (
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {r.metric.name}: {r.metric.value.toFixed(2)} (סף {r.metric.threshold})
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-1">{r.description}</p>
            <p className="text-xs text-gray-600 italic">💡 {r.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
