'use client';

import { useState } from 'react';
import { calculatePrivateRecreationEstimate, PRIVATE_DAY_RATE } from '@/lib/calculators/recreation-pay-verified';

export function VerifiedRecreationPayCalculator() {
  const [years, setYears] = useState(5);
  const [positionPercent, setPositionPercent] = useState(100);
  const [dayRate, setDayRate] = useState<number>(PRIVATE_DAY_RATE);
  const result = calculatePrivateRecreationEstimate(years, positionPercent, dayRate);

  return (
    <section className="border border-ink/20 bg-cream-2 p-6" aria-label="אומדן דמי הבראה במגזר הפרטי">
      <h2 className="mb-2 text-xl font-bold">אומדן ברוטו לפי הצו הכללי למגזר הפרטי</h2>
      <p className="mb-5 text-sm leading-relaxed">התעריף ההתחלתי הוא 418 ₪ ליום. אם חל עליכם הסכם ענפי או קיבוצי, בדקו את התעריף והימים הרלוונטיים והזינו תעריף יום בהתאם. האומדן אינו מחשב נטו, זכאות רטרואקטיבית, חל״ת או הסדרים מיוחדים.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">שנות ותק שהושלמו אצל המעסיק<input className="mt-1 w-full border border-ink/25 bg-paper p-2" type="number" min="0" step="1" value={years} onChange={e => setYears(Number(e.target.value))} /></label>
        <label className="block text-sm">היקף משרה באחוזים<input className="mt-1 w-full border border-ink/25 bg-paper p-2" type="number" min="0" max="100" value={positionPercent} onChange={e => setPositionPercent(Number(e.target.value))} /></label>
        <label className="block text-sm">תעריף יום לפי ההסכם החל עליכם<input className="mt-1 w-full border border-ink/25 bg-paper p-2" type="number" min="0" value={dayRate} onChange={e => setDayRate(Number(e.target.value))} /></label>
      </div>
      <p className="mt-6 text-lg">{result.daysEntitled} ימים × {result.dayRate.toLocaleString('he-IL')} ₪ × {Math.min(100, Math.max(0, positionPercent))}% = <strong>{result.grossEstimate.toLocaleString('he-IL')} ₪ ברוטו</strong></p>
    </section>
  );
}
