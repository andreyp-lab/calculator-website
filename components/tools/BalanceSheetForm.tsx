'use client';

import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { FileText, AlertTriangle } from 'lucide-react';

const FIELDS: Array<{
  key: keyof import('@/lib/tools/types').BalanceSheetData;
  label: string;
  group: 'current_assets' | 'fixed_assets' | 'current_liab' | 'long_liab' | 'equity';
  derived?: boolean;
}> = [
  // Current Assets
  { key: 'cashAndEquivalents', label: 'מזומנים ושווי מזומנים', group: 'current_assets' },
  { key: 'accountsReceivable', label: 'לקוחות', group: 'current_assets' },
  { key: 'inventory', label: 'מלאי', group: 'current_assets' },
  { key: 'currentAssets', label: 'סה"כ נכסים שוטפים', group: 'current_assets', derived: true },

  // Fixed Assets
  { key: 'fixedAssets', label: 'רכוש קבוע (נטו)', group: 'fixed_assets' },
  { key: 'totalAssets', label: 'סה"כ נכסים', group: 'fixed_assets', derived: true },

  // Current Liabilities
  { key: 'accountsPayable', label: 'ספקים', group: 'current_liab' },
  { key: 'shortTermDebt', label: 'חוב לזמן קצר', group: 'current_liab' },
  { key: 'currentLiabilities', label: 'סה"כ התחייבויות שוטפות', group: 'current_liab', derived: true },

  // Long-term Liabilities
  { key: 'longTermDebt', label: 'חוב לזמן ארוך', group: 'long_liab' },
  { key: 'totalLiabilities', label: 'סה"כ התחייבויות', group: 'long_liab', derived: true },

  // Equity
  { key: 'totalEquity', label: 'הון עצמי', group: 'equity' },
  { key: 'retainedEarnings', label: 'עודפים (אופציונלי)', group: 'equity' },
];

const GROUP_LABELS = {
  current_assets: '🟢 נכסים שוטפים',
  fixed_assets: '🟢 נכסים קבועים',
  current_liab: '🔴 התחייבויות שוטפות',
  long_liab: '🔴 התחייבויות ארוכות',
  equity: '🔵 הון עצמי',
};

export function BalanceSheetForm() {
  const { balanceSheet, settings, updateBalanceSheet } = useTools();
  if (!balanceSheet || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  // בדיקת איזון: נכסים = התחייבויות + הון
  const balanced = Math.abs(
    balanceSheet.totalAssets - (balanceSheet.totalLiabilities + balanceSheet.totalEquity),
  );
  const isBalanced = balanced < 1;

  // Group fields
  const groups: Record<string, typeof FIELDS> = {
    current_assets: [],
    fixed_assets: [],
    current_liab: [],
    long_liab: [],
    equity: [],
  };
  for (const field of FIELDS) {
    groups[field.group].push(field);
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-orange-600" />
        <h3 className="font-bold text-lg text-gray-900">מאזן (Balance Sheet)</h3>
      </div>

      {!isBalanced && balanceSheet.totalAssets > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900">המאזן לא מאוזן!</p>
            <p className="text-amber-800">
              הפרש: {fmt(balanced)} - נכסים חייבים להיות שווים להתחייבויות + הון.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groups).map(([groupKey, fields]) => (
          <div key={groupKey} className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
              {GROUP_LABELS[groupKey as keyof typeof GROUP_LABELS]}
            </h4>
            {fields.map((field) => (
              <div key={field.key} className="flex items-center gap-2">
                <label
                  className={`flex-1 text-sm ${field.derived ? 'font-bold' : 'text-gray-700'}`}
                >
                  {field.label}
                </label>
                <input
                  type="number"
                  value={balanceSheet[field.key] || 0}
                  onChange={(e) =>
                    updateBalanceSheet({ [field.key]: parseFloat(e.target.value) || 0 })
                  }
                  className={`w-32 px-2 py-1 border rounded text-sm text-left ${
                    field.derived ? 'bg-gray-50 font-bold' : 'border-gray-300'
                  }`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
