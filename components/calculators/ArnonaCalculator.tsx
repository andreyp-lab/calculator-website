'use client';

import { useMemo, useState } from 'react';
import { calculateArnona } from '@/lib/calculators/arnona';
import { ARNONA_CITIES, type ArnonaCity } from '@/lib/data/arnona-rates';

const money = (value: number) =>
  `${value.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₪`;

export function ArnonaCalculator({
  initialCityId,
  heading,
}: {
  initialCityId?: string;
  heading?: string;
}) {
  const firstCity =
    ARNONA_CITIES.find((c) => c.id === initialCityId) ??
    ARNONA_CITIES.find((c) => c.status !== 'pending-approval') ??
    ARNONA_CITIES[0];
  const [cityId, setCityId] = useState(firstCity.id);
  // ברירת מחדל: רק צווים בתוקף (2026). צווי 2027 שעדיין ממתינים לאישור מוצגים רק לפי בקשה.
  const [showFuture, setShowFuture] = useState(firstCity.status === 'pending-approval');
  const city: ArnonaCity = ARNONA_CITIES.find((c) => c.id === cityId) ?? firstCity;
  const visibleCities = ARNONA_CITIES.filter(
    (c) => showFuture || c.status !== 'pending-approval' || c.id === city.id,
  );
  const hasFuture = ARNONA_CITIES.some((c) => c.status === 'pending-approval');
  const [zoneId, setZoneId] = useState(city.zones[0].id);
  const [area, setArea] = useState('80');
  const [discountId, setDiscountId] = useState('none');

  const zone = city.zones.find((z) => z.id === zoneId) ?? city.zones[0];
  const discountDef = city.discounts?.find((d) => d.id === discountId);
  const [classId, setClassId] = useState(city.classes?.[0]?.id ?? '');
  const zoneRate = zone.rateByClass ? zone.rateByClass[classId] : zone.rate;

  const result = useMemo(
    () =>
      zoneRate
        ? calculateArnona({
            areaSqm: Number(area),
            zone: zoneRate,
            discount: discountDef
              ? { percent: discountDef.percent, maxSqm: discountDef.maxSqm }
              : undefined,
          })
        : null,
    [area, zoneRate, discountDef],
  );

  function onCityChange(next: string) {
    const nextCity = ARNONA_CITIES.find((c) => c.id === next) ?? firstCity;
    setCityId(nextCity.id);
    setZoneId(nextCity.zones[0].id);
    setClassId(nextCity.classes?.[0]?.id ?? '');
    setDiscountId('none');
  }

  const fieldClass = 'mt-2 block w-full border border-ink/20 bg-cream p-3';

  return (
    <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
      <h2 className="mb-4 text-xl font-bold">{heading ?? `מחשבון ארנונה למגורים — שנת ${city.year}`}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          עיר
          <select className={fieldClass} value={city.id} onChange={(e) => onCityChange(e.target.value)}>
            {visibleCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — צו {c.year}
                {c.status === 'pending-approval' ? ' (ממתין לאישור השרים)' : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          אזור / איזור תעריף
          <select
            className={fieldClass}
            value={zone.id}
            onChange={(e) => setZoneId(e.target.value)}
          >
            {city.zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </label>
        {city.classes && city.classes.length > 0 && (
          <label className="block">
            סוג בניין
            <select
              className={fieldClass}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              {city.classes.map((k) => (
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
            className={fieldClass}
            type="number"
            min="1"
            inputMode="decimal"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </label>
        {city.discounts && city.discounts.length > 0 && (
          <label className="block">
            הנחה
            <select
              className={fieldClass}
              value={discountId}
              onChange={(e) => setDiscountId(e.target.value)}
            >
              <option value="none">ללא הנחה</option>
              {city.discounts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} ({d.percent}%)
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {hasFuture && (
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showFuture}
            onChange={(e) => {
              setShowFuture(e.target.checked);
              if (!e.target.checked && city.status === 'pending-approval') {
                const fallback = ARNONA_CITIES.find(
                  (c) => c.name === city.name && c.status !== 'pending-approval',
                );
                if (fallback) onCityChange(fallback.id);
              }
            }}
          />
          הצג גם צווי 2027 שטרם אושרו סופית
        </label>
      )}
      {city.classHelp && <p className="mt-3 text-sm text-ink/70">{city.classHelp}</p>}
      {city.status === 'pending-approval' && (
        <p className="mt-3 border border-gold/40 bg-cream p-3 text-sm">
          צו {city.year} אושר במועצת העירייה אך כפוף לאישור השרים. התעריפים עשויים להשתנות עד לאישור הסופי.
        </p>
      )}
      {zone.description && (
        <p className="mt-3 text-sm text-ink/70">{zone.description}</p>
      )}
      {discountDef && (
        <p className="mt-2 text-sm text-ink/70">
          תנאי ההנחה: {discountDef.conditions}
          {discountDef.maxSqm ? ` ההנחה חלה על עד ${discountDef.maxSqm} מ״ר.` : ''}
        </p>
      )}

      <div className="mt-6" aria-live="polite">
        {!zoneRate ? (
          <p className="text-lg font-bold">אין תעריף לשילוב הזה של אזור וסוג בניין בצו. בחרו אזור או סוג בניין אחר.</p>
        ) : result === null ? (
          <p className="text-lg font-bold">הזינו שטח חיובי כדי לראות את הארנונה.</p>
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
            {result.discountAnnual > 0 && (
              <p className="mt-3 text-sm">
                לפני הנחה: {money(result.grossAnnual)} לשנה · ההנחה: {money(result.discountAnnual)} לשנה
              </p>
            )}
            {result.breakdown.length > 1 && (
              <table className="mt-4 w-full border-collapse text-sm">
                <caption className="mb-2 text-start font-bold">פירוט לפי מדרגות שטח</caption>
                <thead>
                  <tr className="border-b border-ink/20 text-start">
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
          </>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink/70">
        האומדן מבוסס על תעריפי צו הארנונה של {city.name} ({city.sourceLabel}), שאומת בתאריך{' '}
        {city.verifiedAt}. החיוב בפועל נקבע לפי סיווג הנכס, האזור המדויק ושטחו המחויב בעירייה.
        בדקו את החשבון או את אתר העירייה לפני החלטה.
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
