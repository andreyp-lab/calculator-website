'use client';

import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { CashFlowTable } from '@/components/tools/CashFlowTable';
import { Wallet, Info } from 'lucide-react';
import Link from 'next/link';
import { useTools } from '@/lib/tools/ToolsContext';

export default function CashFlowPage() {
  const { budget } = useTools();
  const hasBudgetData =
    budget && (budget.income.length > 0 || budget.expenses.length > 0 || budget.loans.length > 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Wallet className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">תזרים מזומנים</h2>
          <p className="text-sm text-gray-600">
            ניתוח יתרות בנק ותחזיות תזרים על בסיס נתוני התקציב
          </p>
        </div>
      </div>

      <ScenarioBar />
      <SettingsCard />

      {!hasBudgetData ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mt-4 flex items-start gap-3">
          <Info className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900 mb-1">אין נתוני תקציב עדיין</h3>
            <p className="text-amber-800 text-sm mb-3">
              התזרים מבוסס על נתוני התקציב שלך. עבור תחילה לדף התקציב והזן הכנסות והוצאות.
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
        <div className="mt-4">
          <CashFlowTable />
        </div>
      )}
    </div>
  );
}
