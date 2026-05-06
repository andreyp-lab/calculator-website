'use client';

import { useState } from 'react';
import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { ExportImportBar } from '@/components/tools/ExportImportBar';
import { UnifiedKPIBar } from '@/components/tools/UnifiedKPIBar';
import { UnifiedOverview } from '@/components/tools/UnifiedOverview';

// Budget components
import { IncomeManager } from '@/components/tools/IncomeManager';
import { ExpenseManager } from '@/components/tools/ExpenseManager';
import { LoanManager } from '@/components/tools/LoanManager';
import { EmployeeManager } from '@/components/tools/EmployeeManager';
import { PLSummary } from '@/components/tools/PLSummary';
import { BudgetCharts } from '@/components/tools/BudgetCharts';
import { EmployeeAnalysis } from '@/components/tools/EmployeeAnalysis';
import { AdvancedAnalytics } from '@/components/tools/AdvancedAnalytics';
import { TemplatesLibrary } from '@/components/tools/TemplatesLibrary';
import { WorkingCapitalOptimizer } from '@/components/tools/WorkingCapitalOptimizer';
import { GoalsTracker } from '@/components/tools/GoalsTracker';

// Cash Flow components
import { CashFlowDashboard } from '@/components/tools/CashFlowDashboard';
import { CashFlowChart } from '@/components/tools/CashFlowChart';
import { CashFlowTable } from '@/components/tools/CashFlowTable';
import { CashFlowDistributionCharts } from '@/components/tools/CashFlowDistributionCharts';
import { BankAccountsManager } from '@/components/tools/BankAccountsManager';
import { DelaysManager } from '@/components/tools/DelaysManager';
import { CustomExpensesManager } from '@/components/tools/CustomExpensesManager';
import { DebtRestructuring } from '@/components/tools/DebtRestructuring';
import { ScenarioCompare } from '@/components/tools/ScenarioCompare';
import { BurnRateDashboard } from '@/components/tools/BurnRateDashboard';

// Analysis components
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

// Forecast & Capital
import { ThreeStatementModelUI } from '@/components/tools/ThreeStatementModel';
import { MonteCarloAnalysis } from '@/components/tools/MonteCarloAnalysis';
import { CohortAnalysis } from '@/components/tools/CohortAnalysis';
import { DCFValuation } from '@/components/tools/DCFValuation';
import { CapTable } from '@/components/tools/CapTable';

import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  BarChart3,
  Sparkles,
  Briefcase,
  // Budget sub-icons
  Layout,
  Users,
  Trophy,
  Target,
  Settings as SettingsIcon,
  // Cashflow sub-icons
  Activity,
  RefreshCw,
  GitCompare,
  Flame,
  // Analysis sub-icons
  Banknote,
  Scale,
  Shield,
  University,
  Droplets,
  Gem,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

type MasterTab = 'overview' | 'budget' | 'cashflow' | 'analysis' | 'forecast';

type BudgetSubTab =
  | 'inputs'
  | 'templates'
  | 'charts'
  | 'employees'
  | 'advanced'
  | 'benchmarks'
  | 'wc'
  | 'goals';

type CashFlowSubTab = 'dashboard' | 'manage' | 'restructure' | 'compare' | 'burn';

type AnalysisSubTab =
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

type ForecastSubTab = 'three-statement' | 'monte-carlo' | 'cohort' | 'dcf' | 'captable';

// ============================================================
// MAIN PAGE
// ============================================================

export default function UnifiedToolPage() {
  const [masterTab, setMasterTab] = useState<MasterTab>('overview');
  const [budgetTab, setBudgetTab] = useState<BudgetSubTab>('inputs');
  const [cashflowTab, setCashflowTab] = useState<CashFlowSubTab>('dashboard');
  const [analysisTab, setAnalysisTab] = useState<AnalysisSubTab>('data');
  const [forecastTab, setForecastTab] = useState<ForecastSubTab>('three-statement');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">מערכת פיננסית מאוחדת</h2>
            <p className="text-sm text-gray-600">
              תקציב + תזרים + ניתוח דוחות + חיזוי - הכל במקום אחד, מסונכרן בזמן אמת
            </p>
          </div>
        </div>
        <ExportImportBar />
      </div>

      {/* Sticky Top: Settings + Scenario + KPIs */}
      <div className="space-y-3 mb-4">
        <ScenarioBar />
        <SettingsCard />
        <UnifiedKPIBar />
      </div>

      {/* Master Tabs */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
        <MasterTabButton
          active={masterTab === 'overview'}
          onClick={() => setMasterTab('overview')}
          icon={LayoutDashboard}
          label="סקירה כללית"
          color="purple"
        />
        <MasterTabButton
          active={masterTab === 'budget'}
          onClick={() => setMasterTab('budget')}
          icon={TrendingUp}
          label="תקציב"
          color="green"
        />
        <MasterTabButton
          active={masterTab === 'cashflow'}
          onClick={() => setMasterTab('cashflow')}
          icon={Wallet}
          label="תזרים מזומנים"
          color="blue"
        />
        <MasterTabButton
          active={masterTab === 'analysis'}
          onClick={() => setMasterTab('analysis')}
          icon={BarChart3}
          label="ניתוח דוחות"
          color="orange"
        />
        <MasterTabButton
          active={masterTab === 'forecast'}
          onClick={() => setMasterTab('forecast')}
          icon={Sparkles}
          label="חיזוי + הון"
          color="indigo"
        />
      </div>

      {/* === OVERVIEW === */}
      {masterTab === 'overview' && (
        <UnifiedOverview
          onNavigate={(target) => {
            setMasterTab(target.master);
            if (target.budget) setBudgetTab(target.budget);
            if (target.cashflow) setCashflowTab(target.cashflow);
            if (target.analysis) setAnalysisTab(target.analysis);
            if (target.forecast) setForecastTab(target.forecast);
          }}
        />
      )}

      {/* === BUDGET === */}
      {masterTab === 'budget' && (
        <div>
          <SubTabNav>
            <SubTab active={budgetTab === 'inputs'} onClick={() => setBudgetTab('inputs')} icon={TrendingUp} label="הכנסות / הוצאות / הלוואות / עובדים" color="green" />
            <SubTab active={budgetTab === 'templates'} onClick={() => setBudgetTab('templates')} icon={Layout} label="תבניות" color="violet" />
            <SubTab active={budgetTab === 'charts'} onClick={() => setBudgetTab('charts')} icon={BarChart3} label="גרפים" color="blue" />
            <SubTab active={budgetTab === 'employees'} onClick={() => setBudgetTab('employees')} icon={Users} label="ניתוח עובדים" color="purple" />
            <SubTab active={budgetTab === 'advanced'} onClick={() => setBudgetTab('advanced')} icon={Sparkles} label="אנליזה מתקדמת" color="indigo" />
            <SubTab active={budgetTab === 'benchmarks'} onClick={() => setBudgetTab('benchmarks')} icon={Trophy} label="בנצ'מרק" color="emerald" />
            <SubTab active={budgetTab === 'wc'} onClick={() => setBudgetTab('wc')} icon={SettingsIcon} label="הון חוזר" color="cyan" />
            <SubTab active={budgetTab === 'goals'} onClick={() => setBudgetTab('goals')} icon={Target} label="יעדים" color="rose" />
          </SubTabNav>

          {budgetTab === 'inputs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          )}
          {budgetTab === 'templates' && <TemplatesLibrary />}
          {budgetTab === 'charts' && <BudgetCharts />}
          {budgetTab === 'employees' && <EmployeeAnalysis />}
          {budgetTab === 'advanced' && <AdvancedAnalytics />}
          {budgetTab === 'benchmarks' && <IndustryBenchmarks />}
          {budgetTab === 'wc' && <WorkingCapitalOptimizer />}
          {budgetTab === 'goals' && <GoalsTracker />}
        </div>
      )}

      {/* === CASH FLOW === */}
      {masterTab === 'cashflow' && (
        <div>
          <SubTabNav>
            <SubTab active={cashflowTab === 'dashboard'} onClick={() => setCashflowTab('dashboard')} icon={LayoutDashboard} label="דשבורד וגרפים" color="blue" />
            <SubTab active={cashflowTab === 'manage'} onClick={() => setCashflowTab('manage')} icon={Activity} label="ניהול תזרים" color="cyan" />
            <SubTab active={cashflowTab === 'restructure'} onClick={() => setCashflowTab('restructure')} icon={RefreshCw} label="פריסת חוב" color="purple" />
            <SubTab active={cashflowTab === 'compare'} onClick={() => setCashflowTab('compare')} icon={GitCompare} label="השוואת תרחישים" color="violet" />
            <SubTab active={cashflowTab === 'burn'} onClick={() => setCashflowTab('burn')} icon={Flame} label="Burn Rate" color="orange" />
          </SubTabNav>

          {cashflowTab === 'dashboard' && (
            <div className="space-y-4">
              <CashFlowDashboard />
              <CashFlowChart />
              <CashFlowDistributionCharts />
              <CashFlowTable />
            </div>
          )}
          {cashflowTab === 'manage' && (
            <div className="space-y-4">
              <BankAccountsManager />
              <DelaysManager />
              <CustomExpensesManager />
            </div>
          )}
          {cashflowTab === 'restructure' && <DebtRestructuring />}
          {cashflowTab === 'compare' && <ScenarioCompare />}
          {cashflowTab === 'burn' && <BurnRateDashboard />}
        </div>
      )}

      {/* === ANALYSIS === */}
      {masterTab === 'analysis' && (
        <div>
          <SubTabNav>
            <SubTab active={analysisTab === 'data'} onClick={() => setAnalysisTab('data')} icon={BarChart3} label="מאזן + יחסים" color="orange" />
            <SubTab active={analysisTab === 'dupont'} onClick={() => setAnalysisTab('dupont')} icon={Sparkles} label="DuPont" color="indigo" />
            <SubTab active={analysisTab === 'dscr'} onClick={() => setAnalysisTab('dscr')} icon={Banknote} label="DSCR מתקדם" color="cyan" />
            <SubTab active={analysisTab === 'breakeven'} onClick={() => setAnalysisTab('breakeven')} icon={Scale} label="נקודת איזון" color="teal" />
            <SubTab active={analysisTab === 'risk'} onClick={() => setAnalysisTab('risk')} icon={Shield} label="סיכונים" color="rose" />
            <SubTab active={analysisTab === 'bank'} onClick={() => setAnalysisTab('bank')} icon={University} label="אשראי בנקאי" color="blue" />
            <SubTab active={analysisTab === 'cashflow'} onClick={() => setAnalysisTab('cashflow')} icon={Droplets} label="איכות תזרים" color="cyan" />
            <SubTab active={analysisTab === 'sensitivity'} onClick={() => setAnalysisTab('sensitivity')} icon={Activity} label="רגישות" color="purple" />
            <SubTab active={analysisTab === 'forecast'} onClick={() => setAnalysisTab('forecast')} icon={Sparkles} label="חיזוי" color="amber" />
            <SubTab active={analysisTab === 'comparison'} onClick={() => setAnalysisTab('comparison')} icon={GitCompare} label="השוואת תקופות" color="violet" />
            <SubTab active={analysisTab === 'benchmark'} onClick={() => setAnalysisTab('benchmark')} icon={Trophy} label="בנצ'מרק ענפי" color="emerald" />
          </SubTabNav>

          {analysisTab === 'data' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <BalanceSheetForm />
              <RatiosDisplay />
            </div>
          )}
          {analysisTab === 'dupont' && <DuPontDisplay />}
          {analysisTab === 'dscr' && <AdvancedDSCRDisplay />}
          {analysisTab === 'breakeven' && <BreakEvenDisplay />}
          {analysisTab === 'risk' && <RiskAssessmentDisplay />}
          {analysisTab === 'bank' && <BankCreditAdvice />}
          {analysisTab === 'cashflow' && <CashFlowQualityDisplay />}
          {analysisTab === 'sensitivity' && <FinancialSensitivity />}
          {analysisTab === 'forecast' && <MultiMethodForecastDisplay />}
          {analysisTab === 'comparison' && <PeriodComparisonDisplay />}
          {analysisTab === 'benchmark' && <IndustryBenchmarks />}
        </div>
      )}

      {/* === FORECAST + CAPITAL === */}
      {masterTab === 'forecast' && (
        <div>
          <SubTabNav>
            <SubTab active={forecastTab === 'three-statement'} onClick={() => setForecastTab('three-statement')} icon={Sparkles} label="מודל 3-דוחות" color="indigo" />
            <SubTab active={forecastTab === 'monte-carlo'} onClick={() => setForecastTab('monte-carlo')} icon={Activity} label="מונטה קרלו" color="purple" />
            <SubTab active={forecastTab === 'cohort'} onClick={() => setForecastTab('cohort')} icon={Users} label="קוהורט (LTV/CAC)" color="pink" />
            <SubTab active={forecastTab === 'dcf'} onClick={() => setForecastTab('dcf')} icon={Gem} label="הערכת שווי DCF" color="rose" />
            <SubTab active={forecastTab === 'captable'} onClick={() => setForecastTab('captable')} icon={Briefcase} label="Cap Table" color="violet" />
          </SubTabNav>

          {forecastTab === 'three-statement' && <ThreeStatementModelUI />}
          {forecastTab === 'monte-carlo' && <MonteCarloAnalysis />}
          {forecastTab === 'cohort' && <CohortAnalysis />}
          {forecastTab === 'dcf' && <DCFValuation />}
          {forecastTab === 'captable' && <CapTable />}
        </div>
      )}
    </div>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function MasterTabButton({
  active,
  onClick,
  icon: Icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutDashboard;
  label: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-600',
    green: 'bg-emerald-600',
    blue: 'bg-blue-600',
    orange: 'bg-orange-600',
    indigo: 'bg-indigo-600',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded text-sm font-semibold transition ${
        active
          ? `${colorMap[color]} text-white shadow-md`
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function SubTabNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
      {children}
    </div>
  );
}

function SubTab({
  active,
  onClick,
  icon: Icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutDashboard;
  label: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    cyan: 'bg-cyan-600',
    teal: 'bg-teal-600',
    rose: 'bg-rose-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    orange: 'bg-orange-600',
    green: 'bg-emerald-600',
    pink: 'bg-pink-600',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition ${
        active ? `${colorMap[color]} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
