'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import {
  calculateRatios,
  calculateZScore,
  calculateHealthScore,
  calculateCreditRating,
  RatioInputData,
} from '@/lib/tools/financial-analyzer';
import { calculateAdvancedDSCR } from '@/lib/tools/dscr-advanced';
import { analyzeBankCredit } from '@/lib/tools/bank-credit-analyzer';
import { formatCurrency } from '@/lib/tools/format';
import { University, AlertCircle, CheckCircle2 } from 'lucide-react';

export function BankCreditAdvice() {
  const { budget, settings, balanceSheet } = useTools();

  const advice = useMemo(() => {
    if (!budget || !settings || !balanceSheet || balanceSheet.totalAssets === 0) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const annualPrincipal = budget.loans.reduce((sum, loan) => {
      const monthlyR = loan.annualRate / 100 / 12;
      const n = loan.termMonths;
      const monthlyPmt =
        monthlyR === 0
          ? loan.amount / n
          : (loan.amount * (monthlyR * Math.pow(1 + monthlyR, n))) / (Math.pow(1 + monthlyR, n) - 1);
      const totalPaid = monthlyPmt * 12;
      const interestPortion = loan.amount * (loan.annualRate / 100);
      return sum + Math.max(0, totalPaid - interestPortion);
    }, 0);

    const ratiosInput: RatioInputData = {
      revenue: totals.income,
      cogs: totals.cogs,
      grossProfit: totals.grossProfit,
      operatingExpenses: totals.rnd + totals.marketing + totals.operating,
      operatingProfit: totals.operatingProfit,
      ebitda: totals.ebitda,
      netProfit: totals.netProfit,
      interestExpense: totals.financial,
      balance: balanceSheet,
      annualDebtPayment: annualPrincipal + totals.financial,
    };

    const ratios = calculateRatios(ratiosInput);
    const zScore = calculateZScore(ratiosInput, 'private');
    const health = calculateHealthScore(ratios);
    const creditRating = calculateCreditRating(ratios, health);

    const dscr = calculateAdvancedDSCR({
      ebitda: totals.ebitda,
      operatingCashFlow: totals.ebitda * 0.85,
      netProfit: totals.netProfit,
      depreciation: 0,
      interestExpense: totals.financial,
      principalPayment: annualPrincipal,
      capitalExpenditure: totals.income * 0.05,
      taxRate: settings.taxRate,
    });

    const totalDebt = budget.loans.reduce((s, l) => s + l.amount, 0);

    return analyzeBankCredit({
      companyName: settings.companyName || 'החברה',
      revenue: totals.income,
      ebitda: totals.ebitda,
      netProfit: totals.netProfit,
      totalAssets: balanceSheet.totalAssets,
      totalEquity: balanceSheet.totalEquity,
      fixedAssets: balanceSheet.fixedAssets,
      accountsReceivable: balanceSheet.accountsReceivable,
      inventory: balanceSheet.inventory,
      realEstateValue: 0, // user can set
      currentDebt: totalDebt,
      ratios,
      creditRating,
      primaryDSCR: dscr.primary.value,
      fcfDSCR: dscr.freeCashFlow.value,
    });
  }, [budget, settings, balanceSheet]);

  if (!advice) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתוני מאזן ל-Bank Credit Analysis</p>
      </div>
    );
  }

  const fmt = (v: number) => formatCurrency(v, settings?.currency ?? 'ILS');
  const approvalColor = advice.approvalRecommendation.recommendation.includes('מומלץ')
    ? 'emerald'
    : advice.approvalRecommendation.recommendation.includes('בתנאים')
      ? 'blue'
      : advice.approvalRecommendation.recommendation.includes('בכפוף')
        ? 'amber'
        : 'red';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <University className="w-5 h-5" />
            הערכת אשראי בנקאי מלאה
          </h3>
          <p className="text-xs text-blue-100">
            סימולציה של ניתוח בנק - קיבולת אשראי, מוצרים, תמחור, וקובננטים
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <div
        className={`bg-${approvalColor}-50 border-4 border-${approvalColor}-300 rounded-xl p-6`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-2xl font-bold text-${approvalColor}-800`}>
            {advice.approvalRecommendation.recommendation}
          </h4>
          <div className="text-left">
            <div className="text-xs text-gray-600">ועדה</div>
            <div className="font-bold">{advice.approvalRecommendation.committeeLevel}</div>
          </div>
        </div>
        <div className="text-sm text-gray-700 mb-2">
          רמת ביטחון: <strong>{advice.approvalRecommendation.confidence}</strong>
        </div>
        <p className="text-sm text-gray-700">{advice.executiveSummary.overallAssessment}</p>

        {advice.approvalRecommendation.warnings.length > 0 && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
            <div className="text-xs font-semibold text-red-800 mb-1">⚠️ אזהרות:</div>
            {advice.approvalRecommendation.warnings.map((w, i) => (
              <div key={i} className="text-xs text-red-700">
                • {w}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strengths & Risks */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <h5 className="font-semibold text-emerald-800 mb-2">💪 חוזקות עיקריות</h5>
          <ul className="text-sm text-emerald-900 space-y-1">
            {advice.executiveSummary.keyStrengths.length > 0 ? (
              advice.executiveSummary.keyStrengths.map((s, i) => <li key={i}>• {s}</li>)
            ) : (
              <li className="text-gray-500">לא זוהו</li>
            )}
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h5 className="font-semibold text-red-800 mb-2">⚠️ סיכונים עיקריים</h5>
          <ul className="text-sm text-red-900 space-y-1">
            {advice.executiveSummary.keyRisks.length > 0 ? (
              advice.executiveSummary.keyRisks.map((r, i) => <li key={i}>• {r}</li>)
            ) : (
              <li className="text-gray-500">לא זוהו</li>
            )}
          </ul>
        </div>
      </div>

      {/* Credit Capacity */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-purple-600 text-white p-3">
          <h4 className="font-bold">קיבולת אשראי - 4 שיטות חישוב</h4>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-3">
          <CapacityCard
            label="לפי EBITDA"
            value={fmt(advice.creditCapacity.ebitdaBased.value)}
            subtitle={`EBITDA × ${advice.creditCapacity.ebitdaBased.multiplier.toFixed(1)}`}
          />
          <CapacityCard
            label="לפי הון עצמי"
            value={fmt(advice.creditCapacity.equityBased.value)}
            subtitle={`הון × ${advice.creditCapacity.equityBased.multiplier.toFixed(1)}`}
          />
          <CapacityCard
            label="לפי DSCR"
            value={fmt(advice.creditCapacity.dscrBased.value)}
            subtitle="EBITDA / 1.5 × 5 שנים"
          />
          <CapacityCard
            label="לפי נכסים (LTV)"
            value={fmt(advice.creditCapacity.assetBased.value)}
            subtitle="שווי בטחונות × LTV"
          />
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-gray-600">קיבולת מקסימלית</div>
              <div className="font-bold text-blue-700">{fmt(advice.creditCapacity.grossCapacity)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">קיבולת זמינה</div>
              <div className="font-bold text-emerald-700">
                {fmt(advice.creditCapacity.availableCapacity)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            ניצול נוכחי: {advice.creditCapacity.utilizationRate.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-indigo-600 text-white p-3">
          <h4 className="font-bold">מוצרי אשראי מומלצים</h4>
        </div>
        <div className="p-4 space-y-3">
          {advice.recommendedProducts.map((p, i) => (
            <div
              key={i}
              className={`border-2 rounded-lg p-3 ${
                p.recommended ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-semibold text-gray-900">{p.product.name}</h5>
                  <div className="text-xs text-gray-500">{p.product.nameEn}</div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-600">סכום מומלץ</div>
                  <div className="font-bold text-blue-700">{fmt(p.suggestedAmount)}</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 text-xs">
                <div className="bg-white rounded p-2">
                  <strong>תקופה:</strong> {p.terms.tenor}
                </div>
                <div className="bg-white rounded p-2">
                  <strong>ריבית:</strong> {p.terms.interestRate}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <strong>בטחונות:</strong> {p.collateral.join(' • ')}
              </div>
              <div className="text-xs text-gray-600">
                <strong>תנאים:</strong> {p.conditions.join(' • ')}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border-t border-blue-200 p-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-900">סה"כ אשראי מומלץ:</span>
            <span className="text-xl font-bold text-blue-700">
              {fmt(advice.totalRecommendedCredit)}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-amber-600 text-white p-3">
          <h4 className="font-bold">תמחור מומלץ</h4>
        </div>
        <div className="p-4 grid md:grid-cols-3 gap-3 text-sm">
          <div className="bg-amber-50 rounded p-3">
            <div className="text-xs text-gray-600">קצר טווח (עד 12 חודשים)</div>
            <div className="font-bold text-amber-800">{advice.pricing.shortTermRate}</div>
          </div>
          <div className="bg-amber-50 rounded p-3">
            <div className="text-xs text-gray-600">בינוני (12-36 חודשים)</div>
            <div className="font-bold text-amber-800">{advice.pricing.mediumTermRate}</div>
          </div>
          <div className="bg-amber-50 rounded p-3">
            <div className="text-xs text-gray-600">ארוך טווח (36+ חודשים)</div>
            <div className="font-bold text-amber-800">{advice.pricing.longTermRate}</div>
          </div>
        </div>
        <div className="bg-gray-50 border-t p-3 text-xs text-gray-700">
          עמלת הקצאה צפויה: {advice.pricing.arrangementFee} | פריים נוכחי: {advice.pricing.primeRate}%
        </div>
      </div>

      {/* Covenants */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-rose-600 text-white p-3">
          <h4 className="font-bold">תכנית קובננטים</h4>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-2">קובננט</th>
              <th className="text-center p-2">סוג</th>
              <th className="text-center p-2">דרישה</th>
              <th className="text-center p-2">ערך נוכחי</th>
              <th className="text-center p-2">תדירות</th>
            </tr>
          </thead>
          <tbody>
            {advice.covenants.map((c, i) => {
              const isCompliant =
                (c.type === 'מינימום' && c.current >= parseFloat(c.requirement)) ||
                (c.type === 'מקסימום' && c.current <= parseFloat(c.requirement));
              return (
                <tr key={i} className="border-t border-gray-100">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2 text-center">{c.type}</td>
                  <td className="p-2 text-center font-semibold">{c.requirement}</td>
                  <td
                    className={`p-2 text-center font-bold ${
                      isCompliant ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {c.current.toFixed(2)} {isCompliant ? '✓' : '⚠️'}
                  </td>
                  <td className="p-2 text-center text-xs">{c.frequency}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* LTV Analysis */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-cyan-600 text-white p-3">
          <h4 className="font-bold">ניתוח LTV - יחס הלוואה לבטחונות</h4>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-2">סוג נכס</th>
              <th className="text-center p-2">שווי</th>
              <th className="text-center p-2">LTV מקס'</th>
              <th className="text-center p-2">הלוואה מקסימלית</th>
            </tr>
          </thead>
          <tbody>
            <LTVRow label="נדל״ן" data={advice.ltvAnalysis.realEstate} fmt={fmt} />
            <LTVRow label="ציוד ומכונות" data={advice.ltvAnalysis.equipment} fmt={fmt} />
            <LTVRow label="לקוחות" data={advice.ltvAnalysis.receivables} fmt={fmt} />
            <LTVRow label="מלאי" data={advice.ltvAnalysis.inventory} fmt={fmt} />
            <tr className="border-t-2 bg-cyan-50 font-bold">
              <td className="p-2">סה״כ</td>
              <td className="p-2 text-center">{fmt(advice.ltvAnalysis.totalCollateralValue)}</td>
              <td className="p-2"></td>
              <td className="p-2 text-center text-cyan-700">
                {fmt(advice.ltvAnalysis.totalMaxLoan)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CapacityCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded p-3">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-xl font-bold text-purple-700">{value}</div>
      <div className="text-[10px] text-gray-500 mt-1">{subtitle}</div>
    </div>
  );
}

function LTVRow({
  label,
  data,
  fmt,
}: {
  label: string;
  data: { value: number; maxLTV: number; maxLoan: number };
  fmt: (v: number) => string;
}) {
  return (
    <tr className="border-t border-gray-100">
      <td className="p-2">{label}</td>
      <td className="p-2 text-center">{fmt(data.value)}</td>
      <td className="p-2 text-center">{data.maxLTV}%</td>
      <td className="p-2 text-center font-semibold">{fmt(data.maxLoan)}</td>
    </tr>
  );
}
