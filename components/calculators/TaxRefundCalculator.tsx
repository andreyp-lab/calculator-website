'use client';

import { useState, useMemo } from 'react';
import {
  calculateTaxRefund,
  type TaxRefundInput,
  type PeripheryZone,
} from '@/lib/calculators/tax-refund';
import { formatCurrency } from '@/lib/utils/formatters';

const initialInput: TaxRefundInput = {
  annualGrossSalary: 200_000,
  taxWithheld: 30_000,
  socialSecurityWithheld: 0,
  monthsWorked: 12,
  gender: 'male',
  maritalStatus: 'single',
  spouseNoIncome: false,
  childrenAge0: 0,
  childrenAge1to5: 0,
  childrenAge6to17: 0,
  childrenAge18: 0,
  disabledChildren: 0,
  monthsSinceImmigration: 0,
  yearsSinceRelease: 0,
  bachelorDegreeThisYear: false,
  masterDegreeThisYear: false,
  privatePensionDeposits: 0,
  privateStudyFundDeposits: 0,
  lifeInsurancePremium: 0,
  disabilityInsurancePremium: 0,
  donations: 0,
  peripheryZone: 'none',
  educationExpenses: 0,
  multipleEmployersNoCoordination: false,
  taxCoordinationPerformed: false,
};

type Section = 'income' | 'personal' | 'special' | 'deductions' | 'extras';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'income', label: 'הכנסות ומס', icon: '💰' },
  { id: 'personal', label: 'מצב אישי', icon: '👨‍👩‍👧' },
  { id: 'special', label: 'מצבים מיוחדים', icon: '⭐' },
  { id: 'deductions', label: 'הפקדות וביטוחים', icon: '🏦' },
  { id: 'extras', label: 'תרומות ופריפריה', icon: '🎁' },
];

export function TaxRefundCalculator() {
  const [input, setInput] = useState<TaxRefundInput>(initialInput);
  const [activeSection, setActiveSection] = useState<Section>('income');
  const result = useMemo(() => calculateTaxRefund(input), [input]);

  function update<K extends keyof TaxRefundInput>(k: K, v: TaxRefundInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  function reset() {
    setInput(initialInput);
    setActiveSection('income');
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* טופס */}
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 border-b">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-2 rounded-t-lg text-sm whitespace-nowrap transition ${
                activeSection === s.id
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Income & Tax */}
        {activeSection === 'income' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">💰 הכנסות ומס שנוכה</h3>
            <p className="text-sm text-gray-600">הזן את הנתונים מטופס 106 שהמעסיק נתן לך</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שכר ברוטו שנתי (₪)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={input.annualGrossSalary}
                onChange={(e) => update('annualGrossSalary', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">סך כל השכר הברוטו מכל המעסיקים בשנה</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מס הכנסה שנוכה במקור (₪)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.taxWithheld}
                onChange={(e) => update('taxWithheld', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                שורת "מס הכנסה" בטופס 106 - סה"כ מנוכה במהלך השנה
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                חודשים עבדת בשנה
              </label>
              <input
                type="number"
                min={0}
                max={12}
                step={1}
                value={input.monthsWorked}
                onChange={(e) => update('monthsWorked', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                12 = שנה מלאה. פחות = יש פוטנציאל החזר משמעותי
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.multipleEmployersNoCoordination}
                  onChange={(e) =>
                    update('multipleEmployersNoCoordination', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span className="text-gray-900 font-medium">
                  עבדתי אצל יותר ממעסיק אחד השנה
                </span>
              </label>
              {input.multipleEmployersNoCoordination && (
                <label className="flex items-center gap-2 cursor-pointer mr-6">
                  <input
                    type="checkbox"
                    checked={input.taxCoordinationPerformed}
                    onChange={(e) => update('taxCoordinationPerformed', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 text-xs">בוצע תיאום מס במהלך השנה</span>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Personal */}
        {activeSection === 'personal' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">👨‍👩‍👧 מצב משפחתי</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">מין</label>
                <select
                  value={input.gender}
                  onChange={(e) => update('gender', e.target.value as 'male' | 'female')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="male">גבר</option>
                  <option value="female">אישה (+0.5 נקודות)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מצב משפחתי
                </label>
                <select
                  value={input.maritalStatus}
                  onChange={(e) =>
                    update(
                      'maritalStatus',
                      e.target.value as 'single' | 'married' | 'single-parent',
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="single">רווק/ה</option>
                  <option value="married">נשוי/אה</option>
                  <option value="single-parent">הורה יחיד (+1 נקודה)</option>
                </select>
              </div>
            </div>

            {input.maritalStatus === 'married' && (
              <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={input.spouseNoIncome}
                  onChange={(e) => update('spouseNoIncome', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">בן/בת זוג ללא הכנסה (+1 נקודה)</span>
              </label>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">ילדים (לפי גיל)</h4>
              <div className="grid grid-cols-2 gap-3">
                <NumField
                  label="בני 0 (שנת לידה)"
                  hint="1.5 נק' לכל ילד"
                  value={input.childrenAge0}
                  onChange={(v) => update('childrenAge0', v)}
                />
                <NumField
                  label="בני 1-5"
                  hint="2.5 נק' לכל ילד"
                  value={input.childrenAge1to5}
                  onChange={(v) => update('childrenAge1to5', v)}
                />
                <NumField
                  label="בני 6-17"
                  hint="1 נק' לכל ילד"
                  value={input.childrenAge6to17}
                  onChange={(v) => update('childrenAge6to17', v)}
                />
                <NumField
                  label="בני 18"
                  hint="0.5 נק' לכל ילד"
                  value={input.childrenAge18}
                  onChange={(v) => update('childrenAge18', v)}
                />
                <NumField
                  label="ילדים נכים"
                  hint="+1 נק' נוספת לכל ילד"
                  value={input.disabledChildren}
                  onChange={(v) => update('disabledChildren', v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Special situations */}
        {activeSection === 'special' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">⭐ מצבים מיוחדים</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                עולה חדש - חודשים מאז העלייה
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={input.monthsSinceImmigration}
                onChange={(e) => update('monthsSinceImmigration', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                0 = לא רלוונטי. 1-18 = 3 נקודות, 19-30 = 2 נקודות, 31-54 = 1 נקודה
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                חייל משוחרר - שנים מהשחרור
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={input.yearsSinceRelease}
                onChange={(e) => update('yearsSinceRelease', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                +2 נקודות ב-3 שנים הראשונות אחרי השחרור
              </p>
            </div>

            <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.bachelorDegreeThisYear}
                  onChange={(e) => update('bachelorDegreeThisYear', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-900">
                  סיימתי תואר ראשון בשנת המס (+1 נקודה)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.masterDegreeThisYear}
                  onChange={(e) => update('masterDegreeThisYear', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-900">
                  סיימתי תואר שני בשנת המס (+0.5 נקודה)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Deductions */}
        {activeSection === 'deductions' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">🏦 הפקדות וביטוחים</h3>
            <p className="text-sm text-gray-600">
              הפקדות עצמאיות (לא דרך המעסיק) שלא נוכו במקור - מזכות בהחזר מס
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הפקדה עצמאית לפנסיה / קופ"ג (₪/שנה)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.privatePensionDeposits}
                onChange={(e) => update('privatePensionDeposits', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                ניכוי מההכנסה - חוסך ~30%-50% מס. תקרה ~13,700 ₪/שנה
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קרן השתלמות עצמאית (₪/שנה)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.privateStudyFundDeposits}
                onChange={(e) => update('privateStudyFundDeposits', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                תקרה: 18,840 ₪/שנה. עצמאיים בעיקר
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ביטוח חיים - פרמיה שנתית (₪)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={input.lifeInsurancePremium}
                onChange={(e) => update('lifeInsurancePremium', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">זיכוי 25% מהפרמיה (תקרה ~12,000 ₪)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ביטוח אובדן כושר עבודה (₪/שנה)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={input.disabilityInsurancePremium}
                onChange={(e) => update('disabilityInsurancePremium', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">ניכוי עד 5% מההכנסה השנתית</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הוצאות לימודים מקצועיים (₪/שנה)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.educationExpenses}
                onChange={(e) => update('educationExpenses', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                לימודים הקשורים לעיסוק - ניכוי מההכנסה
              </p>
            </div>
          </div>
        )}

        {/* Extras */}
        {activeSection === 'extras' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">🎁 תרומות ופריפריה</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תרומות לעמותות מוכרות (סעיף 46) - ₪/שנה
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={input.donations}
                onChange={(e) => update('donations', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                זיכוי 35% מהתרומות. מינימום 207 ₪/שנה. דרושות קבלות עם אישור 46.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                אזור מגורים
              </label>
              <select
                value={input.peripheryZone}
                onChange={(e) => update('peripheryZone', e.target.value as PeripheryZone)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="none">לא באזור פריפריה מוטב</option>
                <option value="eilat">אילת (10% עד 268,560 ₪)</option>
                <option value="tier-a">צפת / קרית שמונה / וכו' (7%)</option>
                <option value="tier-b">קו עימות חלקי (11%)</option>
                <option value="tier-c">קו עימות מלא (13%)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                דרוש 12 חודשי תושבות רצופים. בדוק רשימת יישובים מעודכנת ברשות המסים.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            איפוס
          </button>
          <div className="flex gap-2">
            {SECTIONS.findIndex((s) => s.id === activeSection) > 0 && (
              <button
                type="button"
                onClick={() => {
                  const i = SECTIONS.findIndex((s) => s.id === activeSection);
                  setActiveSection(SECTIONS[i - 1].id);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
              >
                הקודם
              </button>
            )}
            {SECTIONS.findIndex((s) => s.id === activeSection) < SECTIONS.length - 1 && (
              <button
                type="button"
                onClick={() => {
                  const i = SECTIONS.findIndex((s) => s.id === activeSection);
                  setActiveSection(SECTIONS[i + 1].id);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
              >
                הבא
              </button>
            )}
          </div>
        </div>
      </div>

      {/* תוצאות */}
      <div className="lg:col-span-2 space-y-4">
        {/* Result hero */}
        <div
          className={`rounded-xl p-6 text-center text-white ${
            result.isEntitledToRefund
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
              : 'bg-gradient-to-br from-gray-500 to-gray-700'
          }`}
        >
          <div className="text-sm opacity-90 mb-1">החזר מס משוער</div>
          <div className="text-4xl font-bold mb-1">{formatCurrency(result.estimatedRefund)}</div>
          <div className="text-xs opacity-80">
            {result.isEntitledToRefund
              ? 'מומלץ להגיש בקשה להחזר!'
              : 'בחישוב הראשוני - אין החזר'}
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
          <h4 className="font-bold text-gray-900 mb-2">פירוט החישוב</h4>
          <Row label="הכנסה ברוטו" value={formatCurrency(input.annualGrossSalary)} />
          <Row label="ניכויים" value={`-${formatCurrency(result.totalDeductions)}`} />
          <Row label="הכנסה חייבת" value={formatCurrency(result.taxableIncome)} bold />
          <Row label="מס לפי מדרגות" value={formatCurrency(result.grossTax)} />
          <Row
            label={`נקודות זיכוי (${result.totalCreditPoints})`}
            value={`-${formatCurrency(result.creditPointsValue)}`}
          />
          {result.donationsCredit > 0 && (
            <Row label="זיכוי תרומות" value={`-${formatCurrency(result.donationsCredit)}`} />
          )}
          {result.peripheryCredit > 0 && (
            <Row
              label="זיכוי פריפריה / ביטוח"
              value={`-${formatCurrency(result.peripheryCredit)}`}
            />
          )}
          <Row label="מס שצריך לשלם" value={formatCurrency(result.finalTax)} bold />
          <Row label="מס שנוכה" value={formatCurrency(input.taxWithheld)} />
          <div className="pt-2 mt-2 border-t-2 border-emerald-400 flex justify-between font-bold text-emerald-700">
            <span>החזר משוער:</span>
            <span>{formatCurrency(result.estimatedRefund)}</span>
          </div>
        </div>

        {/* Reasons */}
        {result.refundReasons.length > 0 && (
          <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">למה מגיע לך החזר?</h4>
            <ul className="space-y-2 text-xs">
              {result.refundReasons.map((reason, i) => (
                <li key={i} className="border-r-2 border-emerald-400 pr-2">
                  <div className="font-semibold text-gray-900">{reason.category}</div>
                  <div className="text-gray-600">{reason.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {result.notes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs space-y-1">
            {result.notes.map((note, i) => (
              <p key={i} className="text-amber-900">
                💡 {note}
              </p>
            ))}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          <p className="font-semibold mb-1">ℹ️ זוהי הערכה בלבד</p>
          <p>
            החישוב המדויק תלוי בפרטים נוספים ובשינויי חקיקה. להגשה רשמית - מומלץ לעבוד עם רואה
            חשבון או יועץ מס. ניתן להגיש דוח באתר רשות המסים.
          </p>
        </div>
      </div>
    </div>
  );
}

function NumField({
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
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        max={20}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
      />
      {hint && <p className="text-[10px] text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}
