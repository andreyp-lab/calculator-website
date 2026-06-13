import { MACRO_DATA } from '@/lib/data/macroeconomic-data';
import { MINIMUM_WAGE_2026 } from '@/lib/constants/tax-2026';

/**
 * רצועת טיקר מאקרו עליונה — סגנון FinSchool אדיטוריאלי.
 * רקע ink-deep, טקסט cream, מפרידי ✦ זהב.
 *
 * שער הדולר נמשך **חי** משער היציג של בנק ישראל (PublicApi), עם ISR:
 * Next.js שומר במטמון ומרענן כל 6 שעות. אם ה-API נכשל — fallback ל-API חינמי,
 * ואז לערך ברירת מחדל. שאר הנתונים (פריים/מדד/שכר מינ׳/משכנתא) מנוהלים מרכזית
 * ב-MACRO_DATA ומתעדכנים כשהם משתנים (נתונים איטיים).
 */

const USD_ILS_FALLBACK = 2.93; // אם כל ה-APIs נכשלים
const MORTGAGE_RATE = MACRO_DATA.avgMortgageRate?.value ?? 4.8;

const REVALIDATE_SECONDS = 21600; // 6 שעות

async function fetchUsdIls(): Promise<number> {
  // 1) בנק ישראל — שער יציג רשמי
  try {
    const res = await fetch('https://boi.org.il/PublicApi/GetExchangeRate?key=USD', {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (res.ok) {
      const data = await res.json();
      const rate = Number(data?.currentExchangeRate);
      if (rate > 0 && rate < 100) return rate;
    }
  } catch {
    /* נופל ל-fallback */
  }
  // 2) fallback חינמי ללא מפתח
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (res.ok) {
      const data = await res.json();
      const rate = Number(data?.rates?.ILS);
      if (rate > 0 && rate < 100) return rate;
    }
  } catch {
    /* נופל לברירת מחדל */
  }
  return USD_ILS_FALLBACK;
}

export async function Ticker() {
  const usdIls = await fetchUsdIls();

  const minWage = Math.round(MINIMUM_WAGE_2026.monthly).toLocaleString('he-IL');
  const monthlyCpi = MACRO_DATA.inflation.monthlyRate;
  const cpiLabel = `${monthlyCpi >= 0 ? '+' : ''}${monthlyCpi.toFixed(1)}%`;

  const items: { label: string; value: string }[] = [
    { label: 'דולר', value: `₪${usdIls.toFixed(2)}` },
    { label: 'פריים', value: `${MACRO_DATA.primeRate.value.toFixed(1)}%` },
    { label: 'מדד', value: cpiLabel },
    { label: 'שכר מינ׳', value: `₪${minWage}` },
    { label: 'משכנתא', value: `${MORTGAGE_RATE.toFixed(1)}%` },
  ];

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
