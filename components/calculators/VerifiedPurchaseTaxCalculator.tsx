'use client';

import { useState } from 'react';
import { estimatePurchaseTax2026, type PurchaseCategory } from '@/lib/calculators/purchase-tax-verified';

export function VerifiedPurchaseTaxCalculator() {
  const [value, setValue] = useState('2500000');
  const [category, setCategory] = useState<PurchaseCategory>('only-home');
  const estimate = estimatePurchaseTax2026(Number(value), category);
  return <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
    <h2 className="mb-4 text-xl font-bold">אומדן מס רכישה לשנת 2026</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">שווי הדירה בש״ח<input className="mt-2 block w-full border border-ink/20 p-3" type="number" min="0" value={value} onChange={(event) => setValue(event.target.value)} /></label>
      <label className="block">סוג רכישה<select className="mt-2 block w-full border border-ink/20 p-3" value={category} onChange={(event) => setCategory(event.target.value as PurchaseCategory)}>
        <option value="only-home">דירה יחידה לתושב ישראל</option>
        <option value="additional-home">דירה נוספת</option>
        <option value="new-immigrant-only-home">עולה זכאי, דירת מגורים יחידה (תקנה 12א)</option>
      </select></label>
    </div>
    <p className="mt-6 text-2xl font-bold" aria-live="polite">{estimate === null ? 'לא ניתן לחשב אומדן למקרה זה' : `מס משוער: ${estimate.toLocaleString('he-IL')} ₪`}</p>
    <p className="mt-3 text-sm leading-relaxed text-ink/70">החישוב לפי הוראת ביצוע 1/2026 של רשות המסים. זכאות למדרגות של דירה יחידה או עולה תלויה בנסיבות ובמועד העסקה; לעולה יש גם מסלול אחר במקרים מסוימים. בדקו את העסקה בסימולטור הרשמי לפני חתימה.</p>
    <a className="mt-4 inline-block font-bold text-gold underline" href="https://www.gov.il/he/service/real_eatate_taxsimulator" target="_blank" rel="noopener noreferrer">סימולטור רשות המסים ↗</a>
  </div>;
}
