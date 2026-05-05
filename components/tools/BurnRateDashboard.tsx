'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths } from '@/lib/tools/budget-engine';
import { calculateCashFlow } from '@/lib/tools/cashflow-engine';
import type { BurnRateMetrics, MonthlyCashFlow } from '@/lib/tools/types';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Flame, AlertTriangle, CheckCircle2, TrendingDown, Calendar } from 'lucide-react';

function calculateBurnMetrics(
  monthly: MonthlyCashFlow[],
  cashRunwayThresholdMonths: number = 12,
): BurnRateMetrics {
  if (monthly.length === 0) {
    return {
      currentCash: 0,
      avg3MonthBurn: 0,
      avg6MonthBurn: 0,
      netBurn: 0,
      runwayMonths: Infinity,
      status: 'profitable',
      recommendation: 'הזן נתוני תזרים כדי לראות burn rate',
    };
  }

  const currentCash = monthly[0].closingBalance;

  // ממוצע burn ב-3/6 חודשים אחרונים
  const last3 = monthly.slice(0, Math.min(3, monthly.length));
  const last6 = monthly.slice(0, Math.min(6, monthly.length));
  const avg3MonthBurn =
    last3.reduce((s, m) => s + (m.netCashFlow < 0 ? Math.abs(m.netCashFlow) : 0), 0) / last3.length;
  const avg6MonthBurn =
    last6.reduce((s, m) => s + (m.netCashFlow < 0 ? Math.abs(m.netCashFlow) : 0), 0) / last6.length;

  // Net burn = ממוצע ב-3 חודשים, אם רווחי = שלילי (חיובי לתזרים)
  const avgNetCashFlow3 =
    last3.reduce((s, m) => s + m.netCashFlow, 0) / last3.length;
  const netBurn = avgNetCashFlow3 < 0 ? Math.abs(avgNetCashFlow3) : 0;

  // Runway
  const runwayMonths = netBurn > 0 ? currentCash / netBurn : Infinity;

  let status: BurnRateMetrics['status'];
  let recommendation = '';

  if (avgNetCashFlow3 >= 0) {
    status = 'profitable';
    recommendation = '🎉 רווחי - שקול להגביר השקעה בצמיחה';
  } else if (runwayMonths >= 18) {
    status = 'healthy';
    recommendation = '✓ קצב burn סביר עם runway ארוך. המשך לעקוב.';
  } else if (runwayMonths >= cashRunwayThresholdMonths) {
    status = 'caution';
    recommendation = `⚠️ runway של ${Math.round(runwayMonths)} חודשים — התחל לתכנן גיוס או חיתוכים`;
  } else {
    status = 'critical';
    recommendation = `🚨 runway קריטי (${Math.round(runwayMonths)} חודשים) — נדרש סבב מימון או צמצום מיידי`;
  }

  // Projected zero date
  let projectedZeroDate: string | undefined;
  if (Number.isFinite(runwayMonths) && runwayMonths > 0 && runwayMonths < 60) {
    const d = new Date();
    d.setMonth(d.getMonth() + Math.round(runwayMonths));
    projectedZeroDate = d.toISOString().slice(0, 10);
  }

  return {
    currentCash,
    avg3MonthBurn,
    avg6MonthBurn,
    netBurn,
    runwayMonths,
    status,
    projectedZeroDate,
    recommendation,
  };
}

export function BurnRateDashboard() {
  const { budget, settings, cashFlow } = useTools();

  const data = useMemo(() => {
    if (!budget || !settings || !cashFlow) return null;
    const monthly = calculateCashFlow(budget, cashFlow, settings);
    const metrics = calculateBurnMetrics(monthly);
    return { monthly, metrics };
  }, [budget, settings, cashFlow]);

  if (!data) return null;
  const { monthly, metrics } = data;

  const statusColors = {
    profitable: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', icon: CheckCircle2 },
    healthy: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', icon: CheckCircle2 },
    caution: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', icon: AlertTriangle },
    critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: AlertTriangle },
  };
  const sc = statusColors[metrics.status];
  const StatusIcon = sc.icon;

  const fmt = (v: number) =>
    Math.abs(v) > 1000000
      ? `${(v / 1000000).toFixed(2)}M`
      : Math.abs(v) > 1000
        ? `${(v / 1000).toFixed(0)}K`
        : v.toFixed(0);

  const chartData = monthly.map((m) => ({
    month: m.monthName,
    'יתרת מזומן': Math.round(m.closingBalance),
    'תזרים נטו': Math.round(m.netCashFlow),
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Burn Rate / Cash Runway
          </h3>
          <p className="text-xs text-orange-100">קצב שריפת מזומן + תאריך אזילה צפוי</p>
        </div>
      </div>

      {/* Big Status Card */}
      <div className={`rounded-xl border-4 p-6 text-center ${sc.bg} ${sc.border}`}>
        <StatusIcon className={`w-12 h-12 ${sc.text} mx-auto mb-2`} />
        <div className={`text-4xl font-bold ${sc.text} mb-2`}>
          {Number.isFinite(metrics.runwayMonths)
            ? `${metrics.runwayMonths.toFixed(1)} חודשים`
            : '∞'}
        </div>
        <div className="text-sm text-gray-700 mb-3">Cash Runway</div>
        <div className={`text-base ${sc.text} font-medium`}>{metrics.recommendation}</div>
        {metrics.projectedZeroDate && (
          <div className="mt-3 text-xs text-gray-600 flex items-center justify-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            תאריך אזילה צפוי: {metrics.projectedZeroDate}
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid md:grid-cols-4 gap-3">
        <KpiCard
          label="מזומן נוכחי"
          value={`₪${fmt(metrics.currentCash)}`}
          color="blue"
          icon={CheckCircle2}
        />
        <KpiCard
          label="Net Burn (ממוצע 3 חודשים)"
          value={`₪${fmt(metrics.netBurn)}`}
          color="red"
          icon={TrendingDown}
        />
        <KpiCard
          label="Burn 3 חודשים"
          value={`₪${fmt(metrics.avg3MonthBurn)}`}
          color="orange"
          icon={Flame}
        />
        <KpiCard
          label="Burn 6 חודשים"
          value={`₪${fmt(metrics.avg6MonthBurn)}`}
          color="amber"
          icon={Flame}
        />
      </div>

      {/* Cash trajectory */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3">
          <h3 className="font-bold">מסלול מזומן צפוי</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} reversed />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} orientation="right" />
              <Tooltip formatter={(v) => `₪${Number(v).toLocaleString('he-IL')}`} />
              <ReferenceLine y={0} stroke="#dc2626" strokeWidth={2} />
              <Area
                type="monotone"
                dataKey="יתרת מזומן"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cuts Calculator */}
      {metrics.status !== 'profitable' && metrics.netBurn > 0 && (
        <CutsCalculator currentCash={metrics.currentCash} netBurn={metrics.netBurn} />
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  color: 'blue' | 'red' | 'orange' | 'amber';
  icon: typeof Flame;
}) {
  const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    red: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', iconBg: 'bg-red-100' },
    orange: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', iconBg: 'bg-orange-100' },
    amber: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} border-2 rounded-lg p-3 flex items-center gap-2`}>
      <div className={`${c.iconBg} p-2 rounded`}>
        <Icon className={`w-4 h-4 ${c.text}`} />
      </div>
      <div>
        <div className="text-[10px] text-gray-600">{label}</div>
        <div className={`text-lg font-bold ${c.text}`}>{value}</div>
      </div>
    </div>
  );
}

function CutsCalculator({ currentCash, netBurn }: { currentCash: number; netBurn: number }) {
  const targets = [12, 18, 24];
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-amber-600 text-white p-3">
        <h3 className="font-bold">כמה לחתוך כדי להאריך runway?</h3>
      </div>
      <div className="p-4">
        <div className="grid md:grid-cols-3 gap-3">
          {targets.map((targetMonths) => {
            const requiredBurn = currentCash / targetMonths;
            const cutNeeded = netBurn - requiredBurn;
            const cutPct = netBurn > 0 ? (cutNeeded / netBurn) * 100 : 0;
            const possible = cutNeeded > 0;
            return (
              <div
                key={targetMonths}
                className={`rounded-lg p-3 border-2 ${
                  possible ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'
                }`}
              >
                <div className="text-xs text-gray-700">להגיע ל-runway של</div>
                <div className="text-2xl font-bold mb-2">{targetMonths} חודשים</div>
                {possible ? (
                  <>
                    <div className="text-sm">צריך לחתוך:</div>
                    <div className="text-xl font-bold text-amber-700">
                      ₪{Math.round(cutNeeded / 1000)}K/חודש
                    </div>
                    <div className="text-xs text-gray-500">({cutPct.toFixed(0)}% מ-burn)</div>
                  </>
                ) : (
                  <div className="text-sm text-emerald-700">✓ כבר מספיק!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
