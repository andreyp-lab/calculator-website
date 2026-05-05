'use client';

import { useTools } from '@/lib/tools/ToolsContext';
import { Currency, Industry } from '@/lib/tools/types';
import { Settings as SettingsIcon } from 'lucide-react';

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'services', label: 'שירותים' },
  { value: 'technology', label: 'טכנולוגיה' },
  { value: 'retail', label: 'קמעונאות' },
  { value: 'manufacturing', label: 'ייצור' },
  { value: 'construction', label: 'בנייה' },
  { value: 'food', label: 'מזון ומשקאות' },
  { value: 'energy', label: 'אנרגיה' },
  { value: 'healthcare', label: 'בריאות' },
  { value: 'finance', label: 'פיננסים' },
  { value: 'realestate', label: 'נדל"ן' },
];

export function SettingsCard() {
  const { settings, updateSettings } = useTools();
  if (!settings) return null;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-900">הגדרות תקופה</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">שם החברה</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => updateSettings({ companyName: e.target.value })}
            placeholder="שם החברה"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">חודש התחלה</label>
          <input
            type="month"
            value={settings.startMonth}
            onChange={(e) => updateSettings({ startMonth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">חודשים להצגה</label>
          <select
            value={settings.monthsToShow}
            onChange={(e) => updateSettings({ monthsToShow: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {[3, 6, 9, 12, 18, 24, 36].map((m) => (
              <option key={m} value={m}>
                {m} חודשים
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">מטבע</label>
          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value as Currency })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="ILS">₪ שקל</option>
            <option value="USD">$ דולר</option>
            <option value="EUR">€ אירו</option>
            <option value="GBP">£ פאונד</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">שיעור מס (%)</label>
          <input
            type="number"
            value={settings.taxRate}
            onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
            min={0}
            max={100}
            step={0.1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">יתרת פתיחה</label>
          <input
            type="number"
            value={settings.openingBalance}
            onChange={(e) => updateSettings({ openingBalance: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">ענף</label>
          <select
            value={settings.industry}
            onChange={(e) => updateSettings({ industry: e.target.value as Industry })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">שנת מס</label>
          <input
            type="number"
            value={settings.fiscalYear}
            onChange={(e) => updateSettings({ fiscalYear: parseInt(e.target.value) || 2026 })}
            min={2020}
            max={2030}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            אינפלציה שנתית (%)
            <span className="text-[10px] text-gray-500 mr-1">
              מוחל רק על הוצאות מסומנות
            </span>
          </label>
          <input
            type="number"
            step={0.1}
            value={settings.annualInflationPct ?? 0}
            onChange={(e) =>
              updateSettings({ annualInflationPct: parseFloat(e.target.value) || 0 })
            }
            min={0}
            max={50}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
}
