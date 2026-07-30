'use client';

import { useMemo, useState } from 'react';
import {
  extractVat,
  addVat,
  VAT_EXTRACT_RATE,
} from '@/lib/calculators/vat-extract';
import { formatCurrency } from '@/lib/utils/formatters';

type Mode = 'extract' | 'add';

const RATE_PERCENT = VAT_EXTRACT_RATE * 100; // 18
const DIVISOR = 1 + VAT_EXTRACT_RATE; // 1.18

export function VatExtractCalculator() {
  const [mode, setMode] = useState<Mode>('extract');
  const [amount, setAmount] = useState<number>(1180);

  const extract = useMemo(() => extractVat(amount), [amount]);
  const add = useMemo(() => addVat(amount), [amount]);

  const modes: { key: Mode; label: string; sub: string }[] = [
    { key: 'extract', label: 'חילוץ מע"מ', sub: 'יש לי סכום כולל מע"מ' },
    { key: 'add', label: 'הוספת מע"מ', sub: 'יש לי סכום לפני מע"מ' },
  ];

  const result =
    mode === 'extract'
      ? {
          inputLabel: `סכום כולל מע"מ (₪)`,
          mainLabel: `סכום ללא מע"מ`,
          mainValue: extract.base,
          vat: extract.vat,
          otherLabel: `סכום כולל מע"מ`,
          otherValue: extract.gross,
          formula: `${formatCurrency(extract.gross)} ÷ ${DIVISOR.toFixed(2)} = ${formatCurrency(extract.base)}`,
          baseShare: extract.gross > 0 ? extract.base / extract.gross : 0,
        }
      : {
          inputLabel: `סכום ללא מע"מ (₪)`,
          mainLabel: `סכום כולל מע"מ`,
          mainValue: add.gross,
          vat: add.vat,
          otherLabel: `סכום ללא מע"מ`,
          otherValue: add.net,
          formula: `${formatCurrency(add.net)} × ${DIVISOR.toFixed(2)} = ${formatCurrency(add.gross)}`,
          baseShare: add.gross > 0 ? add.net / add.gross : 0,
        };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="bg-paper border border-ink/15 rounded-none p-6">
        <h2 className="text-xl font-bold text-ink mb-5">פרטי החישוב</h2>

        <div className="mb-5">
          <div className="text-sm font-medium text-ink/70 mb-3">סוג חישוב</div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="בחירת כיוון החישוב">
            {modes.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                aria-pressed={mode === m.key}
                className={`px-3 py-3 rounded-none border-2 transition text-right ${
                  mode === m.key
                    ? 'border-ink bg-cream-2 text-ink'
                    : 'border-ink/15 bg-paper text-ink/70 hover:border-ink/30'
                }`}
              >
                <div className="font-bold text-sm mb-0.5">{m.label}</div>
                <div className="text-xs text-ink/70">{m.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <label className="block mb-5">
          <span className="block text-sm font-medium text-ink/70 mb-2">{result.inputLabel}</span>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={Number.isFinite(amount) ? amount : ''}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-none border-2 border-ink/15 bg-paper text-ink text-lg focus:border-gold focus:outline-none"
          />
        </label>

        <p className="text-sm text-ink/70 leading-relaxed">
          שיעור המע&quot;מ בחישוב: <strong className="text-ink">{RATE_PERCENT.toFixed(0)}%</strong>{' '}
          (השיעור הרגיל בישראל, רשות המסים). החישוב מתעדכן מיידית בשני הכיוונים — חילוץ מסכום
          כולל או הוספה לסכום נטו.
        </p>
      </div>

      {/* Results */}
      <div className="bg-paper border border-ink/15 rounded-none p-6">
        <h2 className="text-xl font-bold text-ink mb-5">תוצאה</h2>

        <div className="bg-cream-2 border-2 border-ink rounded-none p-5 mb-4">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-ink/70 mb-1">
            {result.mainLabel}
          </div>
          <div className="text-3xl font-bold text-ink" aria-live="polite">
            {formatCurrency(result.mainValue)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="border border-ink/15 rounded-none p-4">
            <div className="text-xs text-ink/70 mb-1">רכיב המע&quot;מ ({RATE_PERCENT.toFixed(0)}%)</div>
            <div className="text-xl font-bold text-red-800">{formatCurrency(result.vat)}</div>
          </div>
          <div className="border border-ink/15 rounded-none p-4">
            <div className="text-xs text-ink/70 mb-1">{result.otherLabel}</div>
            <div className="text-xl font-bold text-ink">{formatCurrency(result.otherValue)}</div>
          </div>
        </div>

        {/* Proportion bar */}
        <div className="mb-4" aria-hidden="true">
          <div className="flex h-3 w-full overflow-hidden border border-ink/15">
            <div className="bg-ink" style={{ width: `${result.baseShare * 100}%` }} />
            <div className="bg-gold" style={{ width: `${(1 - result.baseShare) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-ink/70 mt-1">
            <span>ללא מע&quot;מ</span>
            <span>מע&quot;מ</span>
          </div>
        </div>

        <p className="font-mono text-sm text-ink/70 border-t border-ink/15 pt-4">
          {result.formula}
        </p>
      </div>
    </div>
  );
}
