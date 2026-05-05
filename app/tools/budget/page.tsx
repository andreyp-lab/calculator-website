'use client';

import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { IncomeManager } from '@/components/tools/IncomeManager';
import { ExpenseManager } from '@/components/tools/ExpenseManager';
import { LoanManager } from '@/components/tools/LoanManager';
import { PLSummary } from '@/components/tools/PLSummary';
import { TrendingUp } from 'lucide-react';

export default function BudgetPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
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

      <ScenarioBar />
      <SettingsCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          <IncomeManager />
          <ExpenseManager />
          <LoanManager />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <PLSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
