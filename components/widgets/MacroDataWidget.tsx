import Link from 'next/link';
import { TrendingUp, DollarSign, Users, ArrowLeft } from 'lucide-react';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

/**
 * וידג'ט נתוני מקרו — מוצג בדף הבית.
 * ערכים נלקחים ישירות מ-lib/data/macroeconomic-data.ts
 */
export function MacroDataWidget() {
  const items = [
    {
      label: 'ריבית פריים',
      value: `${MACRO_DATA.primeRate.value}%`,
      subLabel: `ב"י: ${MACRO_DATA.primeRate.boiBaseRate}%`,
      updatedDate: MACRO_DATA.primeRate.lastUpdated,
      href: '/news/prime-rate',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'אינפלציה שנתית',
      value: `${MACRO_DATA.inflation.annualRate}%`,
      subLabel: `חודשי: ${MACRO_DATA.inflation.monthlyRate >= 0 ? '+' : ''}${MACRO_DATA.inflation.monthlyRate}%`,
      updatedDate: MACRO_DATA.inflation.lastUpdated,
      href: '/news/cpi',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      label: 'שכר ממוצע',
      value: `₪${MACRO_DATA.averageWage.monthly.toLocaleString('he-IL')}`,
      subLabel: MACRO_DATA.averageWage.reportPeriod,
      updatedDate: MACRO_DATA.averageWage.lastUpdated,
      href: '/news/average-wage',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">נתוני שוק עדכניים</h2>
          <Link
            href="/news"
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
          >
            כל הנתונים
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {/* Items */}
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-gray-100">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className={`w-9 h-9 rounded-lg ${item.bgColor} border ${item.borderColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-gray-400">{item.subLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 leading-tight">עודכן</p>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    {formatHebrewDate(item.updatedDate).replace(' 2026', '').replace(' 2025', '')}
                  </p>
                  <ArrowLeft className="w-3 h-3 text-gray-300 group-hover:text-blue-500 mt-1 transition mr-auto" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
