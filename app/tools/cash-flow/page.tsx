'use client';

import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { CashFlowDashboard } from '@/components/tools/CashFlowDashboard';
import { CashFlowChart } from '@/components/tools/CashFlowChart';
import { CashFlowTable } from '@/components/tools/CashFlowTable';
import { CashFlowDistributionCharts } from '@/components/tools/CashFlowDistributionCharts';
import { BankAccountsManager } from '@/components/tools/BankAccountsManager';
import { DelaysManager } from '@/components/tools/DelaysManager';
import { CustomExpensesManager } from '@/components/tools/CustomExpensesManager';
import { DebtRestructuring } from '@/components/tools/DebtRestructuring';
import { ScenarioCompare } from '@/components/tools/ScenarioCompare';
import { ExportImportBar } from '@/components/tools/ExportImportBar';
import { Wallet, Info } from 'lucide-react';
import Link from 'next/link';
import { useTools } from '@/lib/tools/ToolsContext';
import { useState } from 'react';

type Tab = 'dashboard' | 'manage' | 'restructure' | 'compare';

export default function CashFlowPage() {
  const { budget, cashFlow } = useTools();
  const [tab, setTab] = useState<Tab>('dashboard');

  const hasBudgetData =
    budget && (budget.income.length > 0 || budget.expenses.length > 0 || budget.loans.length > 0);
  const hasCashFlowData =
    cashFlow &&
    (cashFlow.accounts.length > 0 ||
      cashFlow.delays.length > 0 ||
      cashFlow.customExpenses.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">תזרים מזומנים מקצועי</h2>
            <p className="text-sm text-gray-600">
              דשבורד KPI, גרפים, חשבונות בנק, עיכובי גביה, פריסת חוב ותשלומים חד-פעמיים
            </p>
          </div>
        </div>
        <ExportImportBar />
      </div>

      <ScenarioBar />
      <SettingsCard />

      {!hasBudgetData && !hasCashFlowData ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mt-4 flex items-start gap-3">
          <Info className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900 mb-1">אין נתונים עדיין</h3>
            <p className="text-amber-800 text-sm mb-3">
              התזרים מבוסס על נתוני התקציב שלך. עבור לדף התקציב והזן הכנסות והוצאות, או הוסף
              חשבונות בנק כאן.
            </p>
            <Link
              href="/tools/budget"
              className="inline-block px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 text-sm"
            >
              עבור לתכנון תקציב →
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b-2 border-gray-200">
            <button
              onClick={() => setTab('dashboard')}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === 'dashboard'
                  ? 'border-b-2 border-blue-600 text-blue-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 דשבורד וגרפים
            </button>
            <button
              onClick={() => setTab('manage')}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === 'manage'
                  ? 'border-b-2 border-blue-600 text-blue-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚙️ ניהול תזרים
            </button>
            <button
              onClick={() => setTab('restructure')}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === 'restructure'
                  ? 'border-b-2 border-blue-600 text-blue-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔄 פריסת חוב
            </button>
            <button
              onClick={() => setTab('compare')}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === 'compare'
                  ? 'border-b-2 border-blue-600 text-blue-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔀 השוואת תרחישים
            </button>
          </div>

          <div className="mt-4">
            {tab === 'dashboard' && (
              <div className="space-y-4" id="cashflow-dashboard-content">
                <CashFlowDashboard />
                <CashFlowChart />
                <CashFlowDistributionCharts />
                <CashFlowTable />
              </div>
            )}

            {tab === 'manage' && (
              <div className="space-y-4">
                <BankAccountsManager />
                <DelaysManager />
                <CustomExpensesManager />
              </div>
            )}

            {tab === 'restructure' && (
              <div className="space-y-4">
                <DebtRestructuring />
              </div>
            )}

            {tab === 'compare' && (
              <div className="space-y-4">
                <ScenarioCompare />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
