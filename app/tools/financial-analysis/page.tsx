'use client';

import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { BalanceSheetForm } from '@/components/tools/BalanceSheetForm';
import { RatiosDisplay } from '@/components/tools/RatiosDisplay';
import { BarChart3 } from 'lucide-react';

export default function FinancialAnalysisPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-100 p-3 rounded-lg">
          <BarChart3 className="w-6 h-6 text-orange-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ניתוח דוחות כספיים</h2>
          <p className="text-sm text-gray-600">
            חישוב 20+ יחסים פיננסיים, Z-Score, דירוג אשראי וציון בריאות פיננסית
          </p>
        </div>
      </div>

      <ScenarioBar />
      <SettingsCard />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <div>
          <BalanceSheetForm />
        </div>
        <div>
          <RatiosDisplay />
        </div>
      </div>
    </div>
  );
}
