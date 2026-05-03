'use client';

import { useState, useMemo } from 'react';
import { calculateTaxCredits, type TaxCreditsInput } from '@/lib/calculators/tax-credits';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initialInput: TaxCreditsInput = {
  isResident: true,
  gender: 'female',
  age: 35,
  isMarried: true,
  isSingleParent: false,
  childrenAge0: 0,
  childrenAge1to5: 1,
  childrenAge6to17: 1,
  childrenAge18: 0,
  disabledChildren: 0,
  isReleasedSoldier: false,
  yearsSinceRelease: 0,
  isNewImmigrant: false,
  monthsSinceImmigration: 0,
  hasBachelorDegree: false,
  hasMasterDegree: false,
};

export function TaxCreditsCalculator() {
  const [input, setInput] = useState<TaxCreditsInput>(initialInput);

  const result = useMemo(() => calculateTaxCredits(input), [input]);

  function update<K extends keyof TaxCreditsInput>(field: K, value: TaxCreditsInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-4">
        {/* בסיס */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">👤 פרטים בסיסיים</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={input.isResident}
                onChange={(e) => update('isResident', e.target.checked)}
              />
              <span className="text-sm">תושב/ת ישראל</span>
            </label>

            <div>
              <label className="block text-xs text-gray-700 mb-1">מין</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={input.gender === 'male'}
                    onChange={() => update('gender', 'male')}
                  />
                  <span className="text-sm">גבר</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={input.gender === 'female'}
                    onChange={() => update('gender', 'female')}
                  />
                  <span className="text-sm">אישה (+0.5 נקודות)</span>
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={input.isSingleParent}
                onChange={(e) => update('isSingleParent', e.target.checked)}
              />
              <span className="text-sm">הורה יחיד (+1 נקודה)</span>
            </label>
          </div>
        </div>

        {/* ילדים */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">👶 ילדים</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="בני שנה (0-1)"
              hint="1.5 נקודות לילד"
              value={input.childrenAge0}
              onChange={(v) => update('childrenAge0', v)}
            />
            <NumberField
              label="גילאי 1-5"
              hint="2.5 נקודות לילד"
              value={input.childrenAge1to5}
              onChange={(v) => update('childrenAge1to5', v)}
            />
            <NumberField
              label="גילאי 6-17"
              hint="1 נקודה לילד"
              value={input.childrenAge6to17}
              onChange={(v) => update('childrenAge6to17', v)}
            />
            <NumberField
              label="בני 18"
              hint="0.5 נקודות לילד"
              value={input.childrenAge18}
              onChange={(v) => update('childrenAge18', v)}
            />
            <NumberField
              label="ילדים נכים"
              hint="1 נקודה נוספת לילד"
              value={input.disabledChildren}
              onChange={(v) => update('disabledChildren', v)}
            />
          </div>
        </div>

        {/* מצבים מיוחדים */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">⭐ מצבים מיוחדים</h3>
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={input.isReleasedSoldier}
                  onChange={(e) => update('isReleasedSoldier', e.target.checked)}
                />
                <span className="text-sm">חייל משוחרר (3 שנים אחרי שחרור) - +2 נקודות</span>
              </label>
              {input.isReleasedSoldier && (
                <input
                  type="number"
                  min={0}
                  max={5}
                  placeholder="שנים מאז שחרור"
                  value={input.yearsSinceRelease}
                  onChange={(e) => update('yearsSinceRelease', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={input.isNewImmigrant}
                  onChange={(e) => update('isNewImmigrant', e.target.checked)}
                />
                <span className="text-sm">עולה חדש - עד +3 נקודות</span>
              </label>
              {input.isNewImmigrant && (
                <input
                  type="number"
                  min={0}
                  max={120}
                  placeholder="חודשים מהעלייה"
                  value={input.monthsSinceImmigration}
                  onChange={(e) => update('monthsSinceImmigration', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              )}
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={input.hasBachelorDegree}
                onChange={(e) => update('hasBachelorDegree', e.target.checked)}
              />
              <span className="text-sm">תואר ראשון (שנה אחת בלבד) - +1 נקודה</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={input.hasMasterDegree}
                onChange={(e) => update('hasMasterDegree', e.target.checked)}
              />
              <span className="text-sm">תואר שני (שנה אחת בלבד) - +0.5 נקודות</span>
            </label>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="סך נקודות זיכוי"
          value={result.totalPoints.toFixed(2)}
          subtitle={`× 242 ₪/חודש = ${formatCurrency(result.monthlyValue)}/חודש`}
          variant="success"
        />

        <ResultCard
          title="חיסכון חודשי במס"
          value={formatCurrency(result.monthlyValue)}
          subtitle="הנחה ישירה ממס הכנסה"
          variant="primary"
        />

        <ResultCard
          title="חיסכון שנתי"
          value={formatCurrency(result.yearlyValue)}
          subtitle="× 12 חודשים"
          variant="warning"
        />

        {result.breakdown.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900 text-sm">פירוט נקודות</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {result.breakdown.map((b, i) => (
                <div key={i} className="px-4 py-2 flex justify-between items-center">
                  <div className="text-sm text-gray-700">{b.category}</div>
                  <div className="text-sm">
                    <span className="font-bold text-blue-700">{b.points}</span>
                    <span className="text-xs text-gray-500"> נק'</span>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 px-4 py-2 flex justify-between items-center font-bold">
                <span>סה"כ</span>
                <span className="text-blue-700">{result.totalPoints.toFixed(2)} נק'</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
          <p className="font-medium text-gray-800 mb-1">💡 מה זה אומר?</p>
          <p className="text-gray-700">
            אם ההכנסה שלך חייבת במס - תקבל הנחה ישירה ב-{formatCurrency(result.monthlyValue)} מהמס
            החודשי. אם לא חייב במס (הכנסה נמוכה) - הנקודות לא רלוונטיות.
          </p>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        max={20}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
