'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateSalaryNetGross } from '@/lib/calculators/salary-net-gross';

/** פורמט מטבע: ₪ + מספר עגול עם מפרידי אלפים. */
function formatILS(n: number): string {
  return '₪' + Math.round(n).toLocaleString('en-US');
}

/**
 * מחשבון שכר נטו חי לכותרת דף הבית — סגנון אדיטוריאלי FinSchool.
 * משתמש בפונקציית החישוב האמיתית calculateSalaryNetGross (2026).
 */
export function HeroSalaryCalc() {
  const [grossSalary, setGrossSalary] = useState(18000);
  const [creditPoints, setCreditPoints] = useState(2.25);

  const result = calculateSalaryNetGross({
    grossSalary,
    creditPoints,
    pensionEnabled: false,
    studyFundEnabled: false,
    monthlyWorkHours: 182,
    taxYear: '2026',
  });

  function adjustCredit(delta: number) {
    setCreditPoints((prev) => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.min(8, Math.max(0, next));
    });
  }

  return (
    <div className="bg-paper border border-ink/18">
      {/* כותרת המחשבון */}
      <div className="flex items-start justify-between gap-4 border-b border-ink/12 px-6 py-5">
        <div>
          <h3 className="text-xl font-black text-ink leading-tight">מחשבון שכר נטו</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            GROSS → NET · 2026
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 border border-gold/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
          <span className="h-1.5 w-1.5 bg-gold" aria-hidden="true" />
          LIVE
        </span>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* סליידר ברוטו */}
        <div>
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="hero-gross"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60"
            >
              שכר ברוטו חודשי
            </label>
            <span className="font-serif text-xl font-black text-ink">
              {formatILS(grossSalary)}
            </span>
          </div>
          <input
            id="hero-gross"
            type="range"
            min={6000}
            max={60000}
            step={500}
            value={grossSalary}
            onChange={(e) => setGrossSalary(Number(e.target.value))}
            className="mt-3 w-full cursor-pointer accent-ink"
            aria-label="שכר ברוטו חודשי"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-ink/40">
            <span>₪6,000</span>
            <span>₪60,000</span>
          </div>
        </div>

        {/* סטפר נקודות זיכוי */}
        <div className="flex items-center justify-between">
          <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
            נקודות זיכוי
          </label>
          <div className="flex items-center border border-ink/20">
            <button
              type="button"
              onClick={() => adjustCredit(-0.25)}
              className="flex h-9 w-9 items-center justify-center text-lg text-ink hover:bg-ink/5 transition disabled:opacity-30"
              disabled={creditPoints <= 0}
              aria-label="הפחת נקודת זיכוי"
            >
              −
            </button>
            <span className="w-14 text-center font-serif text-base font-black text-ink tabular-nums">
              {creditPoints.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => adjustCredit(0.25)}
              className="flex h-9 w-9 items-center justify-center text-lg text-ink hover:bg-ink/5 transition disabled:opacity-30"
              disabled={creditPoints >= 8}
              aria-label="הוסף נקודת זיכוי"
            >
              +
            </button>
          </div>
        </div>

        {/* בלוק תוצאה — ירוק כהה */}
        <div className="bg-ink px-6 py-6 text-cream">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/60">
              נטו לתשלום
            </span>
            <span className="font-mono text-xs text-gold-light">
              {result.netPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 font-serif text-4xl font-black text-gold-light">
            {formatILS(result.netSalary)}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-px border-t border-cream/15 pt-px">
            <div className="pt-4 pe-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/50">
                מס הכנסה
              </p>
              <p className="mt-1 text-base font-bold text-cream">
                {formatILS(result.incomeTax)}
              </p>
            </div>
            <div className="border-s border-cream/15 pt-4 ps-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/50">
                ב״ל + בריאות
              </p>
              <p className="mt-1 text-base font-bold text-cream">
                {formatILS(result.socialSecurity)}
              </p>
            </div>
          </div>
        </div>

        {/* קישור למחשבון המלא */}
        <Link
          href="/personal-tax/salary-net-gross"
          className="group flex items-center justify-between border-t border-ink/12 pt-5 text-sm font-medium text-ink hover:text-gold transition"
        >
          <span>חישוב מלא + עוד 29 מחשבונים</span>
          <span className="text-gold transition-transform group-hover:-translate-x-1" aria-hidden="true">
            ←
          </span>
        </Link>
      </div>
    </div>
  );
}
