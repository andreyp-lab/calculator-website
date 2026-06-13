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
        <div className="bg-cream-2 p-3">
          <BarChart3 className="w-6 h-6 text-ink-mid" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink">ניתוח דוחות כספיים מלא</h1>
          <p className="text-sm text-ink/70">
            11 כלי ניתוח: יחסים, DuPont, DSCR מתקדם, Break-Even, סיכונים, אשראי בנקאי, ועוד
          </p>
        </div>
      </div>

      <ScenarioBar />
      <SettingsCard />

      {/* Tabs */}
      <div className="bg-paper border-2 border-ink/15 p-2 shadow-sm flex flex-wrap gap-1 my-4">
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
    orange: 'bg-ink',
    blue: 'bg-ink',
    indigo: 'bg-ink',
    cyan: 'bg-ink',
    teal: 'bg-ink-mid',
    rose: 'bg-ink',
    purple: 'bg-ink',
    amber: 'bg-ink',
    violet: 'bg-ink',
    emerald: 'bg-ink-mid',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-sm transition ${
        active ? `${colorMap[color]} text-cream` : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
