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
        <div className="bg-cream-2 p-3">
          <DollarSign className="w-6 h-6 text-ink-mid" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ink">הון, שווי והשקעות</h2>
          <p className="text-sm text-ink/70">
            DCF Valuation, Cap Table ודילול, סבבי גיוס ויציאות
          </p>
        </div>
      </div>

      <div className="bg-paper border-2 border-ink/15 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => setTab('dcf')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm transition ${
            tab === 'dcf'
              ? 'bg-ink text-cream'
              : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
          }`}
        >
          <Gem className="w-4 h-4" />
          הערכת שווי DCF
        </button>
        <button
          onClick={() => setTab('captable')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm transition ${
            tab === 'captable'
              ? 'bg-ink text-cream'
              : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
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
