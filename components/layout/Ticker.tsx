import { MACRO_DATA } from '@/lib/data/macroeconomic-data';
import { MINIMUM_WAGE_2026 } from '@/lib/constants/tax-2026';
import { getExchangeRates } from '@/lib/data/exchange-rates';

/**
 * רצועת טיקר מאקרו עליונה — סגנון FinSchool אדיטוריאלי.
 * רקע ink-deep, טקסט cream, מפרידי ✦ זהב.
 *
 * שער הדולר נמשך **חי** דרך `getExchangeRates` (שער יציג של בנק ישראל, גיבוי open.er-api), עם ISR של 6 שעות.
 * אם שני המקורות נכשלים הדולר מושמט. שאר הנתונים מנוהלים מרכזית ומתעדכנים ידנית.
 */

export async function Ticker() {
  // שער חי משותף (בנק ישראל, גיבוי open.er-api). אם שני המקורות נכשלים — הדולר לא מוצג במקום להציג שער ישן.
  const rates = await getExchangeRates();
  const usdIls = rates?.ilsPerUnit.USD ?? null;

  const minWage = Math.round(MINIMUM_WAGE_2026.monthly).toLocaleString('he-IL');

  const items: { label: string; value: string }[] = [
    ...(usdIls ? [{ label: 'דולר', value: `₪${usdIls.toFixed(2)}` }] : []),
    { label: 'פריים', value: `${MACRO_DATA.primeRate.value.toFixed(2)}%` },
    { label: 'אינפלציה שנתית', value: `${MACRO_DATA.inflation.annualRate.toFixed(1)}%` },
    { label: 'שכר מינ׳', value: `₪${minWage}` },
  ];

  return (
    <div className="site-ticker bg-ink-deep text-cream border-b border-cream/15">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 py-2 font-mono text-[11.5px] tracking-[0.02em] overflow-x-auto whitespace-nowrap">
          {/* Some figures are verified manually; dates appear on the linked detail pages. */}
          <span className="flex items-center gap-1.5 flex-shrink-0 text-gold-light uppercase tracking-[0.14em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-gold-light opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-gold-light" />
            </span>
            {'//'} נתוני שוק
          </span>

          {items.map((item, i) => (
            <span key={item.label} className="flex items-center gap-3 flex-shrink-0">
              <span className="text-gold" aria-hidden="true">
                ✦
              </span>
              <span className="text-cream/55">{item.label}</span>
              <span className="text-cream">{item.value}</span>
              {i === items.length - 1 && (
                <span className="text-gold" aria-hidden="true">
                  ✦
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
