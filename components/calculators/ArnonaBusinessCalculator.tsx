'use client';

import { useMemo, useState } from 'react';
import { calculateArnona } from '@/lib/calculators/arnona';
import {
  ARNONA_BUSINESS_CITIES,
  businessRate,
  classesForUse,
  zonesForUse,
} from '@/lib/data/arnona-business-rates';

const money = (value: number) =>
  `${value.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₪`;

export function ArnonaBusinessCalculator({ heading }: { heading?: string }) {
  const first = ARNONA_BUSINESS_CITIES[0];
  const [cityId, setCityId] = useState(first.id);
  const city = ARNONA_BUSINESS_CITIES.find((c) => c.id === cityId) ?? first;
  const [useId, setUseId] = useState(city.uses[0].id);
  const use = city.uses.find((u) => u.id === useId) ?? city.uses[0];
  const zones = zonesForUse(city, use);
  const classes = classesForUse(city, use);
  const [zoneId, setZoneId] = useState(zones[0].id);
  const zone = zones.find((z) => z.id === zoneId) ?? zones[0];
  const [classId, setClassId] = useState(classes?.[0]?.id ?? '');
  const cls = classes?.find((k) => k.id === classId) ?? classes?.[0];
  const [area, setArea] = useState('100');

  const rate = businessRate(use, zone.id, cls?.id);
  const areaNum = Number(area);
  const result = useMemo(
    () => (rate ? calculateArnona({ areaSqm: areaNum, zone: rate }) : null),
    [rate, areaNum],
  );

  function onCityChange(next: string) {
    const c = ARNONA_BUSINESS_CITIES.find((x) => x.id === next) ?? first;
    setCityId(c.id);
    setUseId(c.uses[0].id);
    const u = c.uses[0];
    setZoneId(zonesForUse(c, u)[0].id);
    setClassId(classesForUse(c, u)?.[0]?.id ?? '');
  }

  function onUseChange(next: string) {
    const u = city.uses.find((x) => x.id === next) ?? city.uses[0];
    setUseId(u.id);
    setZoneId(zonesForUse(city, u)[0].id);
    setClassId(classesForUse(city, u)?.[0]?.id ?? '');
  }

  const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';

  return (
    <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
      <h2 className="mb-4 text-xl font-bold">{heading ?? `מחשבון ארנונה לעסק — צו ${city.year}`}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          עיר
          <select className={field} value={city.id} onChange={(e) => onCityChange(e.target.value)}>
            {ARNONA_BUSINESS_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — צו {c.year}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          סוג הנכס / השימוש
          <select className={field} value={use.id} onChange={(e) => onUseChange(e.target.value)}>
            {city.uses.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          אזור
          <select className={field} value={zone.id} onChange={(e) => setZoneId(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </label>
        {classes && cls && (
          <label className="block">
            סימול / סוג בניין
            <select className={field} value={cls.id} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          שטח הנכס במ״ר
          <input
            className={field}
            type="number"
            min="1"
            inputMode="decimal"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </label>
      </div>

      <p className="mt-3 text-sm text-ink/70">{city.zoneHelp}</p>
      {use.description && <p className="mt-2 text-sm text-ink/70">{use.description}</p>}
      {zone.description && <p className="mt-2 text-sm text-ink/70">{zone.description}</p>}

      <div className="mt-6" aria-live="polite">
        {!rate ? (
          <p className="text-lg font-bold">אין תעריף לשילוב הזה בצו. בחרו אזור או סימול אחר.</p>
        ) : result === null ? (
          <p className="text-lg font-bold">
            {areaNum > 0
              ? 'לשטח הזה אין תעריף בטבלה שהמחשבון כולל (ראו את הצו).'
              : 'הזינו שטח חיובי כדי לראות את הארנונה.'}
          </p>
        ) : (
          <>
            <p className="text-2xl font-bold">ארנונה חודשית משוערת: {money(result.monthly)}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="border border-ink/15 bg-cream p-3">
                <div className="text-sm text-ink/70">לשנה</div>
                <div className="text-lg font-bold">{money(result.annual)}</div>
              </div>
              <div className="border border-ink/15 bg-cream p-3">
                <div className="text-sm text-ink/70">לחודשיים</div>
                <div className="text-lg font-bold">{money(result.bimonthly)}</div>
              </div>
              <div className="border border-ink/15 bg-cream p-3">
                <div className="text-sm text-ink/70">למ״ר לשנה (אפקטיבי)</div>
                <div className="text-lg font-bold">{money(result.effectiveRatePerSqm)}</div>
              </div>
            </div>
            {result.breakdown.length > 1 && (
              <table className="mt-4 w-full border-collapse text-sm">
                <caption className="mb-2 text-start font-bold">פירוט לפי מדרגות שטח</caption>
                <thead>
                  <tr className="border-b border-ink/20">
                    <th className="p-2 text-start">מדרגה</th>
                    <th className="p-2 text-start">מ״ר</th>
                    <th className="p-2 text-start">תעריף למ״ר</th>
                    <th className="p-2 text-start">לשנה</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row) => (
                    <tr key={row.fromSqm} className="border-b border-ink/10">
                      <td className="p-2">
                        {row.fromSqm}–{row.toSqm}
                      </td>
                      <td className="p-2">{row.sqm}</td>
                      <td className="p-2">{money(row.ratePerSqm)}</td>
                      <td className="p-2">{money(row.annual)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {result.breakdown.length === 1 && (
              <p className="mt-3 text-sm">
                תעריף: {money(result.breakdown[0].ratePerSqm)} למ״ר לשנה על כל {areaNum} המ״ר.
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink/70">
        האומדן מבוסס על תעריפי צו הארנונה של {city.name} ({city.sourceLabel}), שאומתו בתאריך{' '}
        {city.verifiedAt}. החיוב בפועל נקבע לפי סיווג הנכס, האזור והשטח המחויב שרשומים בעירייה, ועשוי
        לכלול הנחות, שטחים משותפים וכללי מדידה שאינם מחושבים כאן. בדקו את חשבון הארנונה לפני החלטה.
      </p>
      <a
        className="mt-3 inline-block font-bold text-gold underline"
        href={city.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        צו הארנונה של {city.name} ↗
      </a>
    </div>
  );
}
