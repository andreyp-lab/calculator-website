'use client';

import { useState } from 'react';
import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { IncomeManager } from '@/components/tools/IncomeManager';
import { ExpenseManager } from '@/components/tools/ExpenseManager';
import { LoanManager } from '@/components/tools/LoanManager';
import { EmployeeManager } from '@/components/tools/EmployeeManager';
import { PLSummary } from '@/components/tools/PLSummary';
import { ExportImportBar } from '@/components/tools/ExportImportBar';
import { BudgetCharts } from '@/components/tools/BudgetCharts';
import { EmployeeAnalysis } from '@/components/tools/EmployeeAnalysis';
import { AdvancedAnalytics } from '@/components/tools/AdvancedAnalytics';
import { IndustryBenchmarks } from '@/components/tools/IndustryBenchmarks';
import { TemplatesLibrary } from '@/components/tools/TemplatesLibrary';
import { WorkingCapitalOptimizer } from '@/components/tools/WorkingCapitalOptimizer';
import { GoalsTracker } from '@/components/tools/GoalsTracker';
import {
  TrendingUp,
  ChartBar,
  Users,
  Sparkles,
  Trophy,
  Layout,
  Settings as SettingsIcon,
  Target,
} from 'lucide-react';

type AnalyticsTab =
  | 'templates'
  | 'charts'
  | 'employees'
  | 'advanced'
  | 'benchmarks'
  | 'wc'
  | 'goals';

export default function BudgetPage() {
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('charts');

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">תכנון תקציב</h2>
            <p className="text-sm text-gray-600">
              נהל הכנסות, הוצאות, עובדים והלוואות. קבל P&L מלא בזמן אמת.
            </p>
          </div>
        </div>
        <ExportImportBar />
      </div>

      <ScenarioBar />
      <SettingsCard />

      {/* Top: Inputs + P&L */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          <IncomeManager />
          <ExpenseManager />
          <EmployeeManager />
          <LoanManager />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <PLSummary />
          </div>
        </div>
      </div>

      {/* Bottom: Analytics tabs */}
      <div className="mt-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
          <TabButton
            active={analyticsTab === 'templates'}
            onClick={() => setAnalyticsTab('templates')}
            icon={Layout}
            label="תבניות מוכנות"
            color="violet"
          />
          <TabButton
            active={analyticsTab === 'charts'}
            onClick={() => setAnalyticsTab('charts')}
            icon={ChartBar}
            label="גרפים פיננסיים"
            color="blue"
          />
          <TabButton
            active={analyticsTab === 'employees'}
            onClick={() => setAnalyticsTab('employees')}
            icon={Users}
            label="ניתוח עובדים"
            color="purple"
          />
          <TabButton
            active={analyticsTab === 'advanced'}
            onClick={() => setAnalyticsTab('advanced')}
            icon={Sparkles}
            label="אנליזה מתקדמת"
            color="indigo"
          />
          <TabButton
            active={analyticsTab === 'benchmarks'}
            onClick={() => setAnalyticsTab('benchmarks')}
            icon={Trophy}
            label="בנצ'מרק ענפי"
            color="emerald"
          />
          <TabButton
            active={analyticsTab === 'wc'}
            onClick={() => setAnalyticsTab('wc')}
            icon={SettingsIcon}
            label="הון חוזר"
            color="cyan"
          />
          <TabButton
            active={analyticsTab === 'goals'}
            onClick={() => setAnalyticsTab('goals')}
            icon={Target}
            label="יעדים"
            color="rose"
          />
        </div>

        {analyticsTab === 'templates' && <TemplatesLibrary />}
        {analyticsTab === 'charts' && <BudgetCharts />}
        {analyticsTab === 'employees' && <EmployeeAnalysis />}
        {analyticsTab === 'advanced' && <AdvancedAnalytics />}
        {analyticsTab === 'benchmarks' && <IndustryBenchmarks />}
        {analyticsTab === 'wc' && <WorkingCapitalOptimizer />}
        {analyticsTab === 'goals' && <GoalsTracker />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Layout;
  label: string;
  color: 'blue' | 'purple' | 'indigo' | 'emerald' | 'violet' | 'cyan' | 'rose';
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    violet: 'bg-violet-600',
    cyan: 'bg-cyan-600',
    rose: 'bg-rose-600',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
        active ? `${colorMap[color]} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
