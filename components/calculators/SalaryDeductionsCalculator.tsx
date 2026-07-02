'use client';

import { useMemo, useState } from 'react';
import {
  calculateSalaryNetGross,
  PENSION_RATES,
} from '@/lib/calculators/salary-net-gross';
import { SOCIAL_SECURITY_EMPLOYEE_2026 } from '@/lib/constants/tax-2026';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * מחשבון ניכויים ממשכורת 2026 — פירוט שורה-שורה של כל ניכוי מהברוטו.
 *
 * כל החישובים מבוצעים במנוע הקיים calculateSalaryNetGross.
 * הפיצול בין "ביטוח לאומי" ל"דמי בריאות" נעשה לפי שיעורי הבריאות
 * הרשמיים מהקבועים (SOCIAL_SECURITY_EMPLOYEE_2026), כאשר סכום שני
 * הרכיבים תמיד שווה בדיוק לסכום שהמנוע מחזיר.
 */

/** חלק דמי הבריאות מתוך סך ביטוח לאומי+בריאות (לפי שיעורי הקבועים בלבד). */
function healthPortion(monthlyGross: number): number {
  const { reducedThresholdMonthly, maxThresholdMonthly, reducedRate, fullRate } =
    SOCIAL_SECURITY_EMPLOYEE_2026;
  const capped = Math.min(Math.max(0, monthlyGross), maxThresholdMonthly);
  const reducedPart = Math.min(capped, reducedThresholdMonthly);
  const fullPart = Math.max(0, capped - reducedThresholdMonthly);
  return reducedPart * reducedRate.healthInsurance + fullPart * fullRate.healthInsurance;
}

interface Row {
  label: string;
  note?: string;
  amount: number;
  isDeduction: boolean;
  highlight?: 'gross' | 'net' | 'total';
}

export function SalaryDeductionsCalculator() {
  const [grossInput, setGrossInput] = useState<string>('12000');
  const [creditPointsInput, setCreditPointsInput] = useState<string>('2.25');
  const [pensionEnabled, setPensionEnabled] = useState<boolean>(true);

  const gross = Math.max(0, Number(grossInput) || 0);
  const creditPoints = Math.max(0, Number(creditPointsInput) || 0);

  const result = useMemo(
    () =>
      calculateSalaryNetGross({
        grossSalary: gross,
        creditPoints,
        pensionEnabled,
        pensionLevel: 'minimum',
        studyFundEnabled: false,
        monthlyWorkHours: 182,
      }),
    [gross, creditPoints, pensionEnabled],
  );

  // פיצול ביטוח לאומי / דמי בריאות — הסכום הכולל נשאר בדיוק זה שהמנוע החזיר
  const health = Math.min(healthPortion(gross), result.socialSecurity);
  const nationalInsurance = result.socialSecurity - health;

  const pensionEmployeeRate = PENSION_RATES.minimum.employee; // 6% עובד (מינימום חוק)

  const rows: Row[] = [
    { label: 'שכר ברוטו', amount: result.grossSalary, isDeduction: false, highlight: 'gross' },
    { label: 'מס הכנסה', note: 'לפי מדרגות, אחרי נקודות זיכוי', amount: result.incomeTax, isDeduction: true },
    { label: 'ביטוח לאומי', note: 'דמי ביטוח לאומי (חלק עובד)', amount: nationalInsurance, isDeduction: true },
    { label: 'דמי בריאות', note: 'ביטוח בריאות ממלכתי', amount: health, isDeduction: true },
    ...(pensionEnabled
      ? [{
          label: 'פנסיה — חלק עובד',
          note: `${(pensionEmployeeRate * 100).toFixed(0)}% מהברוטו (מינימום לפי צו ההרחבה)`,
          amount: result.pensionDeduction,
          isDeduction: true,
        } satisfies Row]
      : []),
    { label: 'סה"כ ניכויים', amount: result.totalDeductions, isDeduction: true, highlight: 'total' },
    { label: 'שכר נטו', amount: result.netSalary, isDeduction: false, highlight: 'net' },
  ];

  const pctOfGross = (amount: number) =>
    gross > 0 ? `${((amount / gross) * 100).toFixed(1)}%` : '—';

  return (
    <div className="bg-paper border border-ink/15 p-5 md:p-6" dir="rtl">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-4">
        מחשבון ניכויים ✦ 2026
      </p>

      {/* קלטים */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="sd-gross" className="block text-sm font-medium text-ink mb-1.5">
            שכר ברוטו חודשי (₪)
          </label>
          <input
            id="sd-gross"
            type="number"
            inputMode="numeric"
            min={0}
            step={500}
            value={grossInput}
            onChange={(e) => setGrossInput(e.target.value)}
            className="w-full border border-ink/25 bg-cream px-3 py-2 text-ink focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label htmlFor="sd-credit" className="block text-sm font-medium text-ink mb-1.5">
            נקודות זיכוי
          </label>
          <input
            id="sd-credit"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.25}
            value={creditPointsInput}
            onChange={(e) => setCreditPointsInput(e.target.value)}
            className="w-full border border-ink/25 bg-cream px-3 py-2 text-ink focus:outline-none focus:border-gold"
          />
          <p className="text-xs text-ink/60 mt-1">ברירת מחדל: 2.25 (תושב ישראל)</p>
        </div>
        <div className="flex items-end pb-2">
          <label htmlFor="sd-pension" className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input
              id="sd-pension"
              type="checkbox"
              checked={pensionEnabled}
              onChange={(e) => setPensionEnabled(e.target.checked)}
              className="w-4 h-4 accent-current"
            />
            הפרשה לפנסיה (חלק עובד)
          </label>
        </div>
      </div>

      {/* טבלת פירוט */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-cream-2">
              <th className="border border-ink/15 p-2.5 text-right font-semibold text-ink">רכיב</th>
              <th className="border border-ink/15 p-2.5 text-center font-semibold text-ink">סכום (₪)</th>
              <th className="border border-ink/15 p-2.5 text-center font-semibold text-ink">% מהברוטו</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isGross = row.highlight === 'gross';
              const isNet = row.highlight === 'net';
              const isTotal = row.highlight === 'total';
              return (
                <tr
                  key={row.label}
                  className={
                    isNet
                      ? 'bg-ink text-cream font-bold'
                      : isTotal
                        ? 'bg-cream-2 font-semibold'
                        : isGross
                          ? 'bg-cream-2 font-semibold'
                          : 'bg-paper'
                  }
                >
                  <td className={`border border-ink/15 p-2.5 ${isNet ? '' : 'text-ink'}`}>
                    {row.label}
                    {row.note && (
                      <span className={`block text-xs font-normal ${isNet ? 'text-cream/70' : 'text-ink/55'}`}>
                        {row.note}
                      </span>
                    )}
                  </td>
                  <td className="border border-ink/15 p-2.5 text-center whitespace-nowrap" dir="ltr">
                    {row.isDeduction ? '−' : ''}
                    {formatCurrency(row.amount, { decimals: 0 })}
                  </td>
                  <td className="border border-ink/15 p-2.5 text-center" dir="ltr">
                    {pctOfGross(row.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* שורת סיכום */}
      <p className="mt-4 text-sm text-ink/70">
        מהברוטו נשארים בידך{' '}
        <strong className="text-ink">{result.netPercentage.toFixed(1)}%</strong> נטו. מדרגת המס
        השולית שלך: <strong className="text-ink">{result.marginalTaxRate.toFixed(0)}%</strong>.
      </p>
      <p className="mt-2 text-xs text-ink/55">
        החישוב לפי מדרגות מס 2026, נקודת זיכוי בשווי 242 ₪ לחודש, ושיעורי ביטוח לאומי ודמי
        בריאות לשכיר. ללא קרן השתלמות וניכויים וולונטריים נוספים.
      </p>
    </div>
  );
}
