'use client';

import { useState } from 'react';
import { DCFValuation } from '@/components/tools/DCFValuation';
import { CapTable } from '@/components/tools/CapTable';
import { Briefcase, Gem, DollarSign } from 'lucide-react';

type Tab = 'dcf' | 'captable';

export default function CapitalPage() {
  const [tab, setTab] = useState<Tab>('dcf');

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-rose-100 p-3 rounded-lg">
          <DollarSign className="w-6 h-6 text-rose-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">הון, שווי והשקעות</h2>
          <p className="text-sm text-gray-600">
            DCF Valuation, Cap Table ודילול, סבבי גיוס ויציאות
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => setTab('dcf')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
            tab === 'dcf'
              ? 'bg-rose-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Gem className="w-4 h-4" />
          הערכת שווי DCF
        </button>
        <button
          onClick={() => setTab('captable')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
            tab === 'captable'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Cap Table & דילול
        </button>
      </div>

      {tab === 'dcf' && <DCFValuation />}
      {tab === 'captable' && <CapTable />}
    </div>
  );
}
