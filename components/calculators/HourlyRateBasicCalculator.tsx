'use client';

import { useState } from 'react';

const currency = new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2 });

export function HourlyRateBasicCalculator() {
  const [targetRevenue, setTargetRevenue] = useState(24000);
  const [hours, setHours] = useState(120);
  const validRevenue = Number.isFinite(targetRevenue) && targetRevenue >= 0 ? targetRevenue : 0;
  const validHours = Number.isFinite(hours) && hours > 0 ? hours : 0;

  return <section className="border border-ink/15 bg-paper p-6">
    <h2 className="mb-4 text-xl font-bold">חישוב יעד הכנסה לשעת חיוב</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      <label>יעד הכנסות חודשי מהלקוחות, לפני מע״מ (₪)<input type="number" min="0" step="100" value={targetRevenue} onChange={(event) => setTargetRevenue(Number(event.target.value))} className="mt-2 block w-full border border-ink/30 px-3 py-2" /></label>
      <label>שעות שתוכלו לחייב בפועל בחודש<input type="number" min="1" step="1" value={hours} onChange={(event) => setHours(Number(event.target.value))} className="mt-2 block w-full border border-ink/30 px-3 py-2" /></label>
    </div>
    <p className="mt-5 text-xl font-bold" aria-live="polite">{validHours ? `${currency.format(validRevenue / validHours)} לשעת חיוב` : 'יש להזין מספר שעות גדול מאפס'}</p>
    <p className="mt-3 text-sm text-ink/70">היעד החודשי צריך לכלול הוצאות, עתודות, מסים ורווח רצוי על סמך הנתונים שלכם. התוצאה אינה אומדן נטו, תעריף שוק או חבות מס.</p>
  </section>;
}
