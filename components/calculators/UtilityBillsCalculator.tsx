'use client';

import { useMemo, useState } from 'react';
import { calculateElectricityBill, calculateWaterBill } from '@/lib/calculators/utility-bills';
import { ELECTRICITY_HOUSEHOLD_2026, WATER_HOUSEHOLD_2026 } from '@/lib/constants/utilities-2026';

const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';
const money = (v: number) => `${v.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪`;

type Section = 'electricity' | 'water';

export function UtilityBillsCalculator({ sections = ['electricity', 'water'] }: { sections?: Section[] }) {
  const show = (s: Section) => sections.includes(s);

  const [kwh, setKwh] = useState('600');
  const [eMonths, setEMonths] = useState<'1' | '2'>('2');
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [kva, setKva] = useState('0');
  const [welfare, setWelfare] = useState(false);
  const electricity = useMemo(
    () =>
      calculateElectricityBill({
        kwh: Number(kwh),
        billingMonths: Number(eMonths) as 1 | 2,
        phase,
        kva: Number(kva),
        welfareDiscount: welfare,
      }),
    [kwh, eMonths, phase, kva, welfare],
  );

  const [m3, setM3] = useState('25');
  const [persons, setPersons] = useState('4');
  const [wMonths, setWMonths] = useState<'1' | '2'>('2');
  const water = useMemo(
    () => calculateWaterBill({ m3: Number(m3), persons: Number(persons), billingMonths: Number(wMonths) as 1 | 2 }),
    [m3, persons, wMonths],
  );

  return (
    <div className="my-8 space-y-8 border border-ink/15 bg-paper p-6" dir="rtl">
      {show('electricity') && (
        <section aria-labelledby="ub-electricity">
          <h2 id="ub-electricity" className="mb-4 text-xl font-bold">חשבון חשמל ביתי</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              צריכה בתקופת החיוב (קוט״ש)
              <input className={field} type="number" min="0" inputMode="decimal" value={kwh} onChange={(e) => setKwh(e.target.value)} />
            </label>
            <label className="block">
              תקופת חיוב
              <select className={field} value={eMonths} onChange={(e) => setEMonths(e.target.value as '1' | '2')}>
                <option value="2">חודשיים (חשבון דו־חודשי)</option>
                <option value="1">חודש</option>
              </select>
            </label>
            <label className="block">
              סוג חיבור
              <select className={field} value={phase} onChange={(e) => setPhase(e.target.value as 'single' | 'three')}>
                <option value="single">חד־פאזי</option>
                <option value="three">תלת־פאזי (מתחת ל־3×100A)</option>
              </select>
            </label>
            <label className="block">
              גודל חיבור בקו״א (אופציונלי, מופיע בחשבון)
              <input className={field} type="number" min="0" inputMode="decimal" value={kva} onChange={(e) => setKva(e.target.value)} />
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={welfare} onChange={(e) => setWelfare(e.target.checked)} />
            זכאי להנחת רווחה (50% על {ELECTRICITY_HOUSEHOLD_2026.welfareDiscountKwhPerMonth} קוט״ש ראשונים בחודש)
          </label>
          <div className="mt-4" aria-live="polite">
            {electricity ? (
              <>
                <p className="text-2xl font-bold">{money(electricity.total)}</p>
                <p className="mt-2 text-sm">
                  אנרגיה {money(electricity.energy)} · תשלום קבוע {money(electricity.fixed)}
                  {electricity.capacity > 0 && <> · קיבולת {money(electricity.capacity)}</>} · מע״מ {money(electricity.vat)} ·
                  {' '}כ־{money(electricity.effectivePerKwh)} לקוט״ש
                </p>
                {Number(kva) === 0 && (
                  <p className="mt-2 text-sm text-ink/70">
                    החישוב אינו כולל תשלום קיבולת עד שתזינו גודל חיבור בקו״א; הוא מוסיף כמה שקלים לחשבון.
                  </p>
                )}
              </>
            ) : (
              <p className="font-bold">הזינו צריכה חיובית וגודל חיבור סביר.</p>
            )}
          </div>
        </section>
      )}

      {show('water') && (
        <section aria-labelledby="ub-water">
          <h2 id="ub-water" className="mb-4 text-xl font-bold">חשבון מים וביוב ביתי</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              צריכה בתקופת החיוב (מ״ק)
              <input className={field} type="number" min="0" inputMode="decimal" value={m3} onChange={(e) => setM3(e.target.value)} />
            </label>
            <label className="block">
              נפשות בדירה
              <input className={field} type="number" min="1" max="30" inputMode="numeric" value={persons} onChange={(e) => setPersons(e.target.value)} />
            </label>
            <label className="block">
              תקופת חיוב
              <select className={field} value={wMonths} onChange={(e) => setWMonths(e.target.value as '1' | '2')}>
                <option value="2">חודשיים</option>
                <option value="1">חודש</option>
              </select>
            </label>
          </div>
          <div className="mt-4" aria-live="polite">
            {water ? (
              <>
                <p className="text-2xl font-bold">{money(water.total)}</p>
                <p className="mt-2 text-sm">
                  מכסה לתקופה: {water.quotaM3} מ״ק · במכסה {water.atQuotaM3} מ״ק ({money(water.atQuotaCost)}) · מעל המכסה{' '}
                  {water.aboveQuotaM3} מ״ק ({money(water.aboveQuotaCost)}) · מע״מ {money(water.vat)}
                </p>
              </>
            ) : (
              <p className="font-bold">הזינו צריכה חיובית ומספר נפשות שלם בין 1 ל־30.</p>
            )}
          </div>
        </section>
      )}

      <p className="text-sm leading-relaxed text-ink/70">
        תעריפים: חשמל — ספר התעריפים של רשות החשמל, בתוקף מ־{ELECTRICITY_HOUSEHOLD_2026.validFrom}; מים — ספר התעריפים של
        רשות המים, בתוקף מ־{WATER_HOUSEHOLD_2026.validFrom} (נבדקו ב־20.11.2026). תעריף המים כולל ביוב לצרכני תאגיד מים;
        ברשויות שטרם התאגדו יש תעריף ביוב מקומי נפרד. שינוי באמצע 2026 או תעריפי 2027 לא נבדקו.
      </p>
    </div>
  );
}
