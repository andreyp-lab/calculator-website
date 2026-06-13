import { MACRO_DATA } from '@/lib/data/macroeconomic-data';
import { MINIMUM_WAGE_2026 } from '@/lib/constants/tax-2026';

/**
 * רצועת טיקר מאקרו עליונה — סגנון FinSchool אדיטוריאלי.
 * רקע ink-deep, טקסט cream, מפרידי ✦ זהב.
 *
 * נתונים אמיתיים מהאתר:
 *  - פריים: MACRO_DATA.primeRate.value
 *  - מדד (חודשי): MACRO_DATA.inflation.monthlyRate
 *  - שכר מינ׳: MINIMUM_WAGE_2026.monthly
 * נתונים שאינם מנוהלים בנתוני המאקרו (דולר, ריבית משכנתא) — ערכי ברירת מחדל סבירים.
 */

const USD_ILS = 3.71; // ₪ לדולר — ערך ברירת מחדל סביר (לא מנוהל בנתוני המאקרו)
const MORTGAGE_RATE = 4.8; // % ריבית משכנתא ממוצעת — ערך ברירת מחדל סביר

const minWage = Math.round(MINIMUM_WAGE_2026.monthly).toLocaleString('he-IL');
const monthlyCpi = MACRO_DATA.inflation.monthlyRate;
const cpiLabel = `${monthlyCpi >= 0 ? '+' : ''}${monthlyCpi.toFixed(1)}%`;

const items: { label: string; value: string }[] = [
  { label: 'דולר', value: `₪${USD_ILS.toFixed(2)}` },
  { label: 'פריים', value: `${MACRO_DATA.primeRate.value.toFixed(1)}%` },
  { label: 'מדד', value: cpiLabel },
  { label: 'שכר מינ׳', value: `₪${minWage}` },
  { label: 'משכנתא', value: `${MORTGAGE_RATE.toFixed(1)}%` },
];

export function Ticker() {
  return (
    <div className="bg-ink-deep text-cream border-b border-cream/15">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 py-2 font-mono text-[11.5px] tracking-[0.02em] overflow-x-auto whitespace-nowrap">
          {/* LIVE_DATA label with blinking gold dot */}
          <span className="flex items-center gap-1.5 flex-shrink-0 text-gold-light uppercase tracking-[0.14em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-gold-light opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-gold-light" />
            </span>
            // LIVE_DATA
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
