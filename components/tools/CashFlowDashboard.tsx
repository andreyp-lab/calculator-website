'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateCashFlow, calculateCashFlowKPIs } from '@/lib/tools/cashflow-engine';
import { formatCurrency } from '@/lib/tools/format';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Zap,
  Target,
  Clock,
} from 'lucide-react';

export function CashFlowDashboard() {
  const { budget, cashFlow, settings } = useTools();

  const kpis = useMemo(() => {
    if (!budget || !cashFlow || !settings) return null;
    const monthly = calculateCashFlow(budget, cashFlow, settings);
    return calculateCashFlowKPIs(monthly);
  }, [budget, cashFlow, settings]);

  if (!kpis || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  const cards = [
    {
      title: 'יתרת מזומנים נוכחית',
      value: fmt(kpis.currentCash),
      icon: Wallet,
      color: kpis.currentCash >= 0 ? 'blue' : 'red',
      sub: `יתרת פתיחה`,
    },
    {
      title: 'תקבולים בתקופה',
      value: fmt(kpis.totalInflow),
      icon: TrendingUp,
      color: 'emerald',
      sub: `${settings.monthsToShow} חודשים`,
    },
    {
      title: 'תשלומים בתקופה',
      value: fmt(kpis.totalOutflow),
      icon: TrendingDown,
      color: 'red',
      sub: `${settings.monthsToShow} חודשים`,
    },
    {
      title: 'תזרים נטו',
      value: fmt(kpis.netCashFlow),
      icon: Activity,
      color: kpis.netCashFlow >= 0 ? 'emerald' : 'red',
      sub: kpis.netCashFlow >= 0 ? 'חיובי ✓' : 'שלילי ⚠️',
    },
    {
      title: 'יתרת סיום',
      value: fmt(kpis.closingBalance),
      icon: Target,
      color: kpis.closingBalance >= 0 ? 'blue' : 'red',
      sub: `סוף תקופה`,
    },
    {
      title: 'יתרה מינימלית',
      value: fmt(kpis.minBalance),
      icon: AlertTriangle,
      color: kpis.minBalance >= 0 ? 'amber' : 'red',
      sub: kpis.cashAtRiskMonth !== null ? `חודש ${kpis.cashAtRiskMonth + 1}` : 'תקין',
    },
    {
      title: kpis.burnRate > 0 ? 'Burn Rate חודשי' : 'תזרים חיובי',
      value: kpis.burnRate > 0 ? fmt(kpis.burnRate) : '0 ₪',
      icon: Zap,
      color: kpis.burnRate > 0 ? 'amber' : 'emerald',
      sub: kpis.burnRate > 0 ? 'שחיקת מזומן' : 'אין שחיקה',
    },
    {
      title: 'Cash Runway',
      value:
        Number.isFinite(kpis.runwayMonths) && kpis.runwayMonths > 0
          ? `${kpis.runwayMonths.toFixed(1)} חודשים`
          : '∞',
      icon: Clock,
      color: kpis.runwayMonths < 6 ? 'red' : kpis.runwayMonths < 12 ? 'amber' : 'emerald',
      sub: 'עד אזילת מזומן',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-900', icon: 'text-blue-600' },
    emerald: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-900',
      icon: 'text-emerald-600',
    },
    red: { bg: 'bg-red-50 border-red-200', text: 'text-red-900', icon: 'text-red-600' },
    amber: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-900', icon: 'text-amber-600' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-gray-900">דשבורד תזרים</h3>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const cls = colorClasses[card.color];
          return (
            <div
              key={i}
              className={`border-2 rounded-xl p-3 ${cls.bg} hover:shadow-md transition`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs text-gray-600">{card.title}</div>
                <Icon className={`w-4 h-4 ${cls.icon}`} />
              </div>
              <div className={`text-base font-bold ${cls.text} mb-1`}>{card.value}</div>
              <div className="text-[10px] text-gray-500">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">חודשים שליליים</div>
          <div className="text-xl font-bold text-red-700">
            {kpis.negativeMonths} / {settings.monthsToShow}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">חודשים עם תזרים +</div>
          <div className="text-xl font-bold text-emerald-700">
            {kpis.positiveMonths} / {settings.monthsToShow}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">יתרה ממוצעת</div>
          <div className="text-xl font-bold text-blue-700">{fmt(kpis.avgBalance)}</div>
        </div>
      </div>
    </div>
  );
}
