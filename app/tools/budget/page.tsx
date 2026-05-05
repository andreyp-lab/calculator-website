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
import {
  TrendingUp,
  ChartBar,
  Users,
  Sparkles,
} from 'lucide-react';

type AnalyticsTab = 'charts' | 'employees' | 'advanced';

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
          <button
            onClick={() => setAnalyticsTab('charts')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
              analyticsTab === 'charts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChartBar className="w-4 h-4" />
            גרפים פיננסיים
          </button>
          <button
            onClick={() => setAnalyticsTab('employees')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
              analyticsTab === 'employees'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            ניתוח עובדים
          </button>
          <button
            onClick={() => setAnalyticsTab('advanced')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
              analyticsTab === 'advanced'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            אנליזה מתקדמת
          </button>
        </div>

        {analyticsTab === 'charts' && <BudgetCharts />}
        {analyticsTab === 'employees' && <EmployeeAnalysis />}
        {analyticsTab === 'advanced' && <AdvancedAnalytics />}
      </div>
    </div>
  );
}
