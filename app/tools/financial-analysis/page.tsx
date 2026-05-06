'use client';

import { useState } from 'react';
import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { BalanceSheetForm } from '@/components/tools/BalanceSheetForm';
import { RatiosDisplay } from '@/components/tools/RatiosDisplay';
import { DuPontDisplay } from '@/components/tools/DuPontDisplay';
import { AdvancedDSCRDisplay } from '@/components/tools/AdvancedDSCRDisplay';
import { BreakEvenDisplay } from '@/components/tools/BreakEvenDisplay';
import { RiskAssessmentDisplay } from '@/components/tools/RiskAssessmentDisplay';
import { BankCreditAdvice } from '@/components/tools/BankCreditAdvice';
import { CashFlowQualityDisplay } from '@/components/tools/CashFlowQualityDisplay';
import { FinancialSensitivity } from '@/components/tools/FinancialSensitivity';
import { MultiMethodForecastDisplay } from '@/components/tools/MultiMethodForecastDisplay';
import { PeriodComparisonDisplay } from '@/components/tools/PeriodComparisonDisplay';
import { IndustryBenchmarks } from '@/components/tools/IndustryBenchmarks';
import {
  BarChart3,
  Sparkles,
  Banknote,
  Scale,
  Shield,
  University,
  Droplets,
  Activity,
  GitCompare,
  Trophy,
  ChartBar,
} from 'lucide-react';

type Tab =
  | 'data'
  | 'dupont'
  | 'dscr'
  | 'breakeven'
  | 'risk'
  | 'bank'
  | 'cashflow'
  | 'sensitivity'
  | 'forecast'
  | 'comparison'
  | 'benchmark';

export default function FinancialAnalysisPage() {
  const [tab, setTab] = useState<Tab>('data');

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-100 p-3 rounded-lg">
          <BarChart3 className="w-6 h-6 text-orange-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ניתוח דוחות כספיים מלא</h2>
          <p className="text-sm text-gray-600">
            11 כלי ניתוח: יחסים, DuPont, DSCR מתקדם, Break-Even, סיכונים, אשראי בנקאי, ועוד
          </p>
        </div>
      </div>

      <ScenarioBar />
      <SettingsCard />

      {/* Tabs */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 my-4">
        <TabButton
          active={tab === 'data'}
          onClick={() => setTab('data')}
          icon={BarChart3}
          label="נתונים ויחסים"
          color="orange"
        />
        <TabButton
          active={tab === 'dupont'}
          onClick={() => setTab('dupont')}
          icon={Sparkles}
          label="DuPont"
          color="indigo"
        />
        <TabButton
          active={tab === 'dscr'}
          onClick={() => setTab('dscr')}
          icon={Banknote}
          label="DSCR מתקדם"
          color="cyan"
        />
        <TabButton
          active={tab === 'breakeven'}
          onClick={() => setTab('breakeven')}
          icon={Scale}
          label="נקודת איזון"
          color="teal"
        />
        <TabButton
          active={tab === 'risk'}
          onClick={() => setTab('risk')}
          icon={Shield}
          label="סיכונים"
          color="rose"
        />
        <TabButton
          active={tab === 'bank'}
          onClick={() => setTab('bank')}
          icon={University}
          label="אשראי בנקאי"
          color="blue"
        />
        <TabButton
          active={tab === 'cashflow'}
          onClick={() => setTab('cashflow')}
          icon={Droplets}
          label="איכות תזרים"
          color="cyan"
        />
        <TabButton
          active={tab === 'sensitivity'}
          onClick={() => setTab('sensitivity')}
          icon={Activity}
          label="רגישות"
          color="purple"
        />
        <TabButton
          active={tab === 'forecast'}
          onClick={() => setTab('forecast')}
          icon={Sparkles}
          label="חיזוי"
          color="amber"
        />
        <TabButton
          active={tab === 'comparison'}
          onClick={() => setTab('comparison')}
          icon={GitCompare}
          label="השוואת תקופות"
          color="violet"
        />
        <TabButton
          active={tab === 'benchmark'}
          onClick={() => setTab('benchmark')}
          icon={Trophy}
          label="בנצ'מרק ענפי"
          color="emerald"
        />
      </div>

      {/* Tab Content */}
      {tab === 'data' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <BalanceSheetForm />
          </div>
          <div>
            <RatiosDisplay />
          </div>
        </div>
      )}

      {tab === 'dupont' && <DuPontDisplay />}
      {tab === 'dscr' && <AdvancedDSCRDisplay />}
      {tab === 'breakeven' && <BreakEvenDisplay />}
      {tab === 'risk' && <RiskAssessmentDisplay />}
      {tab === 'bank' && <BankCreditAdvice />}
      {tab === 'cashflow' && <CashFlowQualityDisplay />}
      {tab === 'sensitivity' && <FinancialSensitivity />}
      {tab === 'forecast' && <MultiMethodForecastDisplay />}
      {tab === 'comparison' && <PeriodComparisonDisplay />}
      {tab === 'benchmark' && <IndustryBenchmarks />}
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
  icon: typeof BarChart3;
  label: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-600',
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    cyan: 'bg-cyan-600',
    teal: 'bg-teal-600',
    rose: 'bg-rose-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-600',
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
