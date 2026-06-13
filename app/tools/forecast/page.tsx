'use client';

import { useState } from 'react';
import { ThreeStatementModelUI } from '@/components/tools/ThreeStatementModel';
import { MonteCarloAnalysis } from '@/components/tools/MonteCarloAnalysis';
import { CohortAnalysis } from '@/components/tools/CohortAnalysis';
import {
  Sparkles,
  Activity,
  Users,
  LineChart,
} from 'lucide-react';

type Tab = 'three-statement' | 'monte-carlo' | 'cohort';

export default function ForecastPage() {
  const [tab, setTab] = useState<Tab>('three-statement');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-cream-2 p-3">
          <LineChart className="w-6 h-6 text-ink-mid" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink">חיזוי רב-שנתי</h1>
          <p className="text-sm text-ink/70">
            מודל פיננסי מקצועי: היסטוריה → תחזית 3-5 שנים, סימולציות, ו-LTV/CAC
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-paper border-2 border-ink/15 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => setTab('three-statement')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm transition ${
            tab === 'three-statement'
              ? 'bg-ink text-cream'
              : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          מודל תלת-דוחות (P&L + מאזן + תזרים)
        </button>
        <button
          onClick={() => setTab('monte-carlo')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm transition ${
            tab === 'monte-carlo'
              ? 'bg-ink text-cream'
              : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
          }`}
        >
          <Activity className="w-4 h-4" />
          סימולציית מונטה קרלו
        </button>
        <button
          onClick={() => setTab('cohort')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm transition ${
            tab === 'cohort'
              ? 'bg-ink text-cream'
              : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
          }`}
        >
          <Users className="w-4 h-4" />
          ניתוח קוהורט (LTV/CAC)
        </button>
      </div>

      {tab === 'three-statement' && <ThreeStatementModelUI />}
      {tab === 'monte-carlo' && <MonteCarloAnalysis />}
      {tab === 'cohort' && <CohortAnalysis />}
    </div>
  );
}
