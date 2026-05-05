'use client';

/**
 * רכיב לעריכת תנאי תשלום - תומך גם במצב "אחיד" (מספר ימים)
 * וגם במצב "מפוצל" (כמה תשלומים באחוזים).
 *
 * דוגמה לפיצול:
 *   30% נטו 30 + 50% נטו 60 + 20% נטו 90
 */

import { useState, useEffect } from 'react';
import {
  type PaymentTerms,
  type PaymentTermInstallment,
} from '@/lib/tools/types';
import {
  validatePaymentTerms,
  describePaymentTerms,
  COMMON_PAYMENT_TERMS,
} from '@/lib/tools/payment-terms';
import { Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  /** ערך נוכחי - יכול להיות number (legacy) או PaymentTerms */
  value: PaymentTerms | number;
  onChange: (terms: PaymentTerms) => void;
  label?: string;
  compact?: boolean;
}

function normalizeValue(v: PaymentTerms | number): PaymentTerms {
  if (typeof v === 'number') {
    return { simpleNet: v };
  }
  return v;
}

export function PaymentTermsEditor({ value, onChange, label, compact }: Props) {
  const [terms, setTerms] = useState<PaymentTerms>(normalizeValue(value));
  const [splitMode, setSplitMode] = useState(
    !!terms.installments && terms.installments.length > 0,
  );

  useEffect(() => {
    setTerms(normalizeValue(value));
  }, [value]);

  const validation = validatePaymentTerms(terms);

  function updateTerms(next: PaymentTerms) {
    setTerms(next);
    if (validatePaymentTerms(next).valid) {
      onChange(next);
    }
  }

  function toggleSplit(enabled: boolean) {
    setSplitMode(enabled);
    if (enabled) {
      const initialSplit: PaymentTermInstallment[] = [
        { percentage: 50, daysOffset: 0, label: 'מקדמה' },
        { percentage: 50, daysOffset: 30, label: 'יתרה' },
      ];
      updateTerms({ ...terms, installments: initialSplit });
    } else {
      const { installments: _, ...rest } = terms;
      updateTerms(rest);
    }
  }

  function updateInstallment(idx: number, patch: Partial<PaymentTermInstallment>) {
    const next = [...(terms.installments ?? [])];
    next[idx] = { ...next[idx], ...patch };
    updateTerms({ ...terms, installments: next });
  }

  function addInstallment() {
    const next = [...(terms.installments ?? [])];
    next.push({ percentage: 0, daysOffset: 60, label: '' });
    updateTerms({ ...terms, installments: next });
  }

  function removeInstallment(idx: number) {
    const next = [...(terms.installments ?? [])];
    next.splice(idx, 1);
    updateTerms({ ...terms, installments: next });
  }

  function applyPreset(presetKey: string) {
    const preset = COMMON_PAYMENT_TERMS[presetKey];
    if (preset) {
      updateTerms(preset);
      setSplitMode(!!preset.installments && preset.installments.length > 0);
    }
  }

  const totalPct =
    terms.installments?.reduce((s, i) => s + i.percentage, 0) ?? 0;

  if (compact) {
    return (
      <div className="space-y-1">
        {label && <label className="block text-xs text-gray-700">{label}</label>}
        <div className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded border">
          {describePaymentTerms(terms)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}

      {/* Toggle split mode */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={splitMode}
            onChange={(e) => toggleSplit(e.target.checked)}
            className="w-3.5 h-3.5"
          />
          <span>פיצול לתשלומים</span>
        </label>
        {!splitMode && (
          <select
            value=""
            onChange={(e) => e.target.value && applyPreset(e.target.value)}
            className="text-xs px-2 py-1 border border-gray-300 rounded"
          >
            <option value="">בחר תבנית מהירה...</option>
            <option value="immediate">מיידי</option>
            <option value="net30">נטו 30</option>
            <option value="net60">נטו 60</option>
            <option value="net90">נטו 90</option>
          </select>
        )}
      </div>

      {/* Simple mode */}
      {!splitMode && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">נטו</span>
          <input
            type="number"
            min={0}
            max={365}
            value={terms.simpleNet}
            onChange={(e) =>
              updateTerms({ ...terms, simpleNet: parseInt(e.target.value) || 0 })
            }
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-xs text-gray-600">ימים</span>
        </div>
      )}

      {/* Split mode */}
      {splitMode && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 mb-1">
            <select
              value=""
              onChange={(e) => e.target.value && applyPreset(e.target.value)}
              className="text-xs px-2 py-1 border border-gray-300 rounded flex-1"
            >
              <option value="">תבניות מוכנות...</option>
              <option value="30-70-30">30% מקדמה + 70% נטו 30</option>
              <option value="50-50-30">50% / 50% נטו 30</option>
              <option value="staged-90">30/30/40 על-פני 90 יום</option>
            </select>
          </div>

          {(terms.installments ?? []).map((inst, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 bg-gray-50 p-1.5 rounded text-xs"
            >
              <input
                type="number"
                min={0}
                max={100}
                value={inst.percentage || ''}
                onChange={(e) =>
                  updateInstallment(idx, { percentage: parseFloat(e.target.value) || 0 })
                }
                className="w-14 px-1 py-0.5 border border-gray-300 rounded text-center"
                placeholder="%"
              />
              <span className="text-gray-500">%</span>
              <span className="text-gray-500">נטו</span>
              <input
                type="number"
                min={0}
                max={365}
                value={inst.daysOffset || 0}
                onChange={(e) =>
                  updateInstallment(idx, { daysOffset: parseInt(e.target.value) || 0 })
                }
                className="w-14 px-1 py-0.5 border border-gray-300 rounded text-center"
              />
              <span className="text-gray-500">ימים</span>
              <input
                type="text"
                value={inst.label ?? ''}
                onChange={(e) => updateInstallment(idx, { label: e.target.value })}
                placeholder="הערה"
                className="flex-1 px-1 py-0.5 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => removeInstallment(idx)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addInstallment}
            className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
          >
            <Plus className="w-3 h-3" />
            הוסף תשלום
          </button>

          {/* Validation indicator */}
          <div
            className={`flex items-center gap-1 text-xs ${
              Math.abs(totalPct - 100) < 0.5
                ? 'text-emerald-700'
                : 'text-red-700'
            }`}
          >
            {Math.abs(totalPct - 100) < 0.5 ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>
              סה"כ: {totalPct.toFixed(1)}% {Math.abs(totalPct - 100) < 0.5 ? '✓' : '(נדרש 100%)'}
            </span>
          </div>
        </div>
      )}

      {/* Validation errors */}
      {!validation.valid && (
        <div className="text-xs text-red-700 bg-red-50 p-1.5 rounded">
          {validation.errors.join(' • ')}
        </div>
      )}

      {/* Description */}
      {validation.valid && (
        <div className="text-xs text-gray-500">
          📋 {describePaymentTerms(terms)}
        </div>
      )}
    </div>
  );
}
