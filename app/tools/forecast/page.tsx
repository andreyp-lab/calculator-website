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
        <div className="bg-indigo-100 p-3 rounded-lg">
          <LineChart className="w-6 h-6 text-indigo-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">חיזוי רב-שנתי</h2>
          <p className="text-sm text-gray-600">
            מודל פיננסי מקצועי: היסטוריה → תחזית 3-5 שנים, סימולציות, ו-LTV/CAC
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => setTab('three-statement')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
            tab === 'three-statement'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          מודל תלת-דוחות (P&L + מאזן + תזרים)
        </button>
        <button
          onClick={() => setTab('monte-carlo')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
            tab === 'monte-carlo'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          סימולציית מונטה קרלו
        </button>
        <button
          onClick={() => setTab('cohort')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
            tab === 'cohort'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
