'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { calculateAdvancedDSCR } from '@/lib/tools/dscr-advanced';
import { formatCurrency } from '@/lib/tools/format';
import { Banknote, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export function AdvancedDSCRDisplay() {
  const { budget, settings, balanceSheet } = useTools();

  const dscr = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);

    // Calculate annual debt payment from loans
    const annualPrincipal = budget.loans.reduce((sum, loan) => {
      const monthlyR = loan.annualRate / 100 / 12;
      const n = loan.termMonths;
      const monthlyPmt =
        monthlyR === 0
          ? loan.amount / n
          : (loan.amount * (monthlyR * Math.pow(1 + monthlyR, n))) / (Math.pow(1 + monthlyR, n) - 1);
      // Annual payment = total minus interest portion
      const totalPaid = monthlyPmt * 12;
      const interestPortion = loan.amount * (loan.annualRate / 100); // approximation
      return sum + Math.max(0, totalPaid - interestPortion);
    }, 0);

    // Operating cash flow estimate (EBITDA + WC changes; simplified = EBITDA × 0.85)
    const operatingCashFlow = totals.ebitda * 0.85;
    // CapEx estimate (5% of revenue if not provided)
    const capex = totals.income * 0.05;

    return calculateAdvancedDSCR({
      ebitda: totals.ebitda,
      operatingCashFlow,
      netProfit: totals.netProfit,
      depreciation: 0, // already excluded from operating
      interestExpense: totals.financial,
      principalPayment: annualPrincipal,
      capitalExpenditure: capex,
      taxRate: settings.taxRate,
    });
  }, [budget, settings, balanceSheet]);

  if (!dscr) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתונים לחישוב DSCR</p>
      </div>
    );
  }

  const fmt = (v: number) => formatCurrency(v, settings?.currency ?? 'ILS');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            DSCR מתקדם - 5 שיטות מדידה
          </h3>
          <p className="text-xs text-cyan-100">
            הערכת יכולת החזר חוב מ-5 זוויות שונות + הערכת בנק
          </p>
        </div>
      </div>

      {/* Primary DSCR */}
      <PrimaryDSCRCard dscr={dscr.primary} />

      {/* All Methods */}
      <div className="grid md:grid-cols-2 gap-3">
        <DSCRMethodCard method={dscr.ebitda} />
        <DSCRMethodCard method={dscr.cashFlow} />
        <DSCRMethodCard method={dscr.afterTax} />
        <DSCRMethodCard method={dscr.freeCashFlow} />
        <DSCRMethodCard method={dscr.netIncome} />
      </div>

      {/* Bank Assessment */}
      <BankAssessmentCard
        approval={dscr.bankAssessment.approval}
        confidence={dscr.bankAssessment.confidence}
        maxLTV={dscr.bankAssessment.maxLTV}
        comments={dscr.bankAssessment.comments}
      />

      {/* Max Debt Capacity */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-purple-600 text-white p-2 text-sm font-bold">
          יכולת חוב מקסימלית - 3 רמות שמרנות
        </div>
        <div className="p-4 grid md:grid-cols-3 gap-3">
          <CapacityBox
            label="שמרני (DSCR 1.5)"
            value={fmt(dscr.maxDebtCapacity.conservative)}
            color="emerald"
          />
          <CapacityBox
            label="מתון (DSCR 1.35)"
            value={fmt(dscr.maxDebtCapacity.moderate)}
            color="blue"
          />
          <CapacityBox
            label="אגרסיבי (DSCR 1.0)"
            value={fmt(dscr.maxDebtCapacity.aggressive)}
            color="amber"
          />
        </div>
      </div>

      {/* Components */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">נתוני בסיס</h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between p-2 bg-white rounded">
            <span>EBITDA:</span>
            <span className="font-bold">{fmt(dscr.components.ebitda)}</span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>תזרים תפעולי:</span>
            <span className="font-bold">{fmt(dscr.components.operatingCashFlow)}</span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>תזרים חופשי:</span>
            <span className="font-bold">{fmt(dscr.components.freeCashFlow)}</span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>סך שירות חוב:</span>
            <span className="font-bold text-red-700">
              {fmt(dscr.components.totalDebtService)}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>קרן:</span>
            <span>{fmt(dscr.components.principalPayment)}</span>
          </div>
          <div className="flex justify-between p-2 bg-white rounded">
            <span>ריבית:</span>
            <span>{fmt(dscr.components.interestExpense)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryDSCRCard({ dscr }: { dscr: { value: number; interpretation: { status: string; text: string } } }) {
  const statusColor = {
    excellent: 'emerald',
    good: 'blue',
    fair: 'amber',
    weak: 'orange',
    critical: 'red',
  }[dscr.interpretation.status] as string;

  return (
    <div
      className={`bg-${statusColor}-50 border-4 border-${statusColor}-300 rounded-xl p-6 text-center`}
    >
      <div className="text-sm text-gray-700 mb-2">DSCR משוקלל (5 שיטות)</div>
      <div className={`text-6xl font-bold text-${statusColor}-700 mb-3`}>
        {dscr.value > 99 ? '∞' : dscr.value.toFixed(2)}
      </div>
      <div className={`inline-flex items-center gap-2 text-${statusColor}-800 font-semibold`}>
        {dscr.interpretation.status === 'excellent' || dscr.interpretation.status === 'good' ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <AlertTriangle className="w-5 h-5" />
        )}
        <span>{dscr.interpretation.text}</span>
      </div>
    </div>
  );
}

function DSCRMethodCard({
  method,
}: {
  method: { value: number; label: string; formula: string; interpretation: { status: string; text: string } };
}) {
  const statusColor = {
    excellent: 'emerald',
    good: 'blue',
    fair: 'amber',
    weak: 'orange',
    critical: 'red',
  }[method.interpretation.status] as string;

  return (
    <div className={`bg-white border-2 border-${statusColor}-200 rounded-lg p-3 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-semibold text-sm text-gray-900">{method.label}</h5>
        <span className={`text-xl font-bold text-${statusColor}-700`}>
          {method.value > 99 ? '∞' : method.value.toFixed(2)}
        </span>
      </div>
      <div className="text-[10px] text-gray-500 mb-1">{method.formula}</div>
      <div className={`text-xs text-${statusColor}-700`}>{method.interpretation.text}</div>
    </div>
  );
}

function BankAssessmentCard({
  approval,
  confidence,
  maxLTV,
  comments,
}: {
  approval: string;
  confidence: string;
  maxLTV: number;
  comments: string[];
}) {
  const approvalColor = approval.includes('מומלץ לאישור')
    ? 'emerald'
    : approval.includes('בתנאים')
      ? 'blue'
      : approval.includes('בכפוף')
        ? 'amber'
        : 'red';

  return (
    <div className={`bg-${approvalColor}-50 border-2 border-${approvalColor}-300 rounded-lg p-4`}>
      <h4 className={`font-bold text-${approvalColor}-900 mb-3`}>הערכת בנק</h4>
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <div>
          <div className="text-xs text-gray-600">המלצת אישור</div>
          <div className={`font-bold text-${approvalColor}-800`}>{approval}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600">רמת ביטחון</div>
          <div className="font-bold">{confidence}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600">LTV מקסימלי</div>
          <div className="font-bold">{maxLTV}%</div>
        </div>
      </div>
      {comments.length > 0 && (
        <ul className="text-sm text-gray-700 space-y-1">
          {comments.map((c, i) => (
            <li key={i}>• {c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CapacityBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} rounded-lg p-3 text-center border border-gray-200`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}
