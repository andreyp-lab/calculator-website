'use client';

import { useState, useMemo } from 'react';
import {
  calculateTaxRefund,
  getDefaultInput,
  type TaxRefundInput,
  type PeripheryZone,
  type TaxYear,
} from '@/lib/calculators/tax-refund';
import { formatCurrency } from '@/lib/utils/formatters';

type Section = 'income' | 'personal' | 'special' | 'reserves' | 'deductions' | 'medical' | 'extras' | 'capital';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'income', label: 'הכנסות ומס', icon: '💰' },
  { id: 'personal', label: 'מצב אישי', icon: '👨‍👩‍👧' },
  { id: 'special', label: 'מצבים מיוחדים', icon: '⭐' },
  { id: 'reserves', label: 'מילואים ושירות', icon: '🪖' },
  { id: 'deductions', label: 'הפקדות', icon: '🏦' },
  { id: 'medical', label: 'דמי טיפול ורפואה', icon: '🏥' },
  { id: 'extras', label: 'תרומות ופריפריה', icon: '🎁' },
  { id: 'capital', label: 'הכנסות הון', icon: '📈' },
];

export function TaxRefundCalculator() {
  const [input, setInput] = useState<TaxRefundInput>(getDefaultInput());
  const [activeSection, setActiveSection] = useState<Section>('income');
  const result = useMemo(() => calculateTaxRefund(input), [input]);

  function update<K extends keyof TaxRefundInput>(k: K, v: TaxRefundInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  function reset() {
    setInput(getDefaultInput());
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
              className={`px-3 py-2 rounded-t-lg text-xs whitespace-nowrap transition ${
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
            <p className="text-sm text-gray-600">הזן את הנתונים מטופס 106</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שנת מס</label>
              <select
                value={input.taxYear}
                onChange={(e) => update('taxYear', Number(e.target.value) as TaxYear)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={2026}>2026 (השנה הנוכחית)</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
                <option value={2020}>2020 (אחרון לתביעה)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">ניתן להגיש החזר עד 6 שנים אחורה</p>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">סך כל השכר הברוטו מכל המעסיקים</p>
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
              <p className="text-xs text-gray-500 mt-1">שורת "מס הכנסה" בטופס 106</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                חודשים עבדת בשנה
              </label>
              <input
                type="number"
                min={0}
                max={12}
                value={input.monthsWorked}
                onChange={(e) => update('monthsWorked', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">פחות מ-12 = פוטנציאל החזר משמעותי</p>
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
                <span className="text-gray-900 font-medium">עבדתי אצל יותר ממעסיק אחד</span>
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
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={input.spouseNoIncome}
                    onChange={(e) => update('spouseNoIncome', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">בן/בת זוג ללא הכנסה (+1 נקודה)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-emerald-50 border border-emerald-300 rounded-lg">
                  <input
                    type="checkbox"
                    checked={input.spouseDisabled}
                    onChange={(e) => update('spouseDisabled', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-emerald-900 font-medium">
                    בן/בת זוג נכה (+2 נקודות - סעיף 45)
                  </span>
                </label>
              </div>
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
                  hint="+1 נק' נוספת"
                  value={input.disabledChildren}
                  onChange={(v) => update('disabledChildren', v)}
                />
                <NumField
                  label="ילדים בני 18-21 בשירות 🆕"
                  hint="1 נק' לכל ילד בצבא/ש.ל."
                  value={input.childrenInService}
                  onChange={(v) => update('childrenInService', v)}
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
                1-18 = 3 נקודות, 19-30 = 2, 31-54 = 1
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
              <p className="text-xs text-gray-500 mt-1">+2 נקודות ב-3 שנים מהשחרור</p>
            </div>

            <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.bachelorDegreeThisYear}
                  onChange={(e) => update('bachelorDegreeThisYear', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-900">סיימתי תואר ראשון (+1 נקודה)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.masterDegreeThisYear}
                  onChange={(e) => update('masterDegreeThisYear', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-900">סיימתי תואר שני (+0.5 נקודה)</span>
              </label>
            </div>

            {/* סעיף 9.5 - חדש! */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-4">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.hasSection95Exemption}
                  onChange={(e) => update('hasSection95Exemption', e.target.checked)}
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <span className="text-sm text-rose-900 font-bold">
                    🆕 סעיף 9(5) - פטור על נכות / עיוורון / מחלה קשה
                  </span>
                  <p className="text-xs text-rose-800 mt-1">
                    נכה 100% / עיוור / חולה במחלה קשה - פטור על הכנסה עד{' '}
                    <strong>608,400 ₪/שנה</strong>! דרוש אישור רפואי / נכות מטעם ב.ל. או
                    רשות המסים.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* מילואים ושירות */}
        {activeSection === 'reserves' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">🪖 מילואים ושירות</h3>
            <p className="text-sm text-gray-600">
              נקודות זיכוי לפי חוק - גם שוויונן הולך וגדל
            </p>

            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.activeReservist}
                  onChange={(e) => update('activeReservist', e.target.checked)}
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <span className="text-sm text-emerald-900 font-bold">
                    🆕 משרת/ת במילואים פעיל
                  </span>
                  <p className="text-xs text-emerald-800 mt-1">
                    +1 נקודת זיכוי = ~2,904 ₪/שנה
                  </p>
                </div>
              </label>

              <div className="mr-6">
                <label className="block text-xs text-gray-700 mb-1">
                  ימי מילואים בשנה (לתיעוד)
                </label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  value={input.reserveDuyDays}
                  onChange={(e) => update('reserveDuyDays', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  10+ ימים = זכאי אוטומטית לנקודה (גם אם לא סימנת מעל)
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
              💡 מספר ילדים בשירות צבאי/לאומי - הוזן בסקציה "מצב אישי" (ילדים בני 18-21
              בשירות).
            </div>
          </div>
        )}

        {/* Deductions */}
        {activeSection === 'deductions' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">🏦 הפקדות וביטוחים</h3>
            <p className="text-sm text-gray-600">הפקדות עצמאיות שלא נוכו במקור</p>

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
              <p className="text-xs text-gray-500 mt-1">תקרה: 13,700 ₪/שנה</p>
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
              <p className="text-xs text-gray-500 mt-1">תקרה: 18,840 ₪/שנה</p>
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
              <p className="text-xs text-gray-500 mt-1">זיכוי 25%, תקרה 12,000 ₪</p>
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
              <p className="text-xs text-gray-500 mt-1">ניכוי עד 5% מההכנסה</p>
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
              <p className="text-xs text-gray-500 mt-1">לימודים הקשורים לעיסוק</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שכר טרחה רו"ח / יועץ מס (₪/שנה) 🆕
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={input.accountantFees}
                onChange={(e) => update('accountantFees', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">הוצאה מותרת בחישוב המס</p>
            </div>
          </div>
        )}

        {/* רפואי ודמי טיפול */}
        {activeSection === 'medical' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">🏥 דמי טיפול ורפואה</h3>
            <p className="text-sm text-gray-600">סעיפים שלרוב לא מנצלים - יכולים להיות שווים</p>

            <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4">
              <h4 className="font-semibold text-pink-900 mb-2 text-sm">
                🆕 סעיף 66 - דמי טיפול בילד (אישה עובדת)
              </h4>
              <p className="text-xs text-pink-800 mb-2">
                לאישה עובדת עם ילדים מתחת לגיל 5 - ניכוי דמי מעון/פעוטון
              </p>
              <input
                type="number"
                min={0}
                step={500}
                value={input.childcareExpenses}
                onChange={(e) => update('childcareExpenses', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="הוצאות מעון שנתיות (₪)"
              />
              <p className="text-[10px] text-pink-700 mt-1">
                תקרה ~8,400 ₪ לכל ילד מתחת ל-5
              </p>
            </div>

            <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-4">
              <h4 className="font-semibold text-rose-900 mb-2 text-sm">
                🆕 הוצאות רפואיות חריגות
              </h4>
              <p className="text-xs text-rose-800 mb-2">
                הוצאות מעל <strong>12.5% מההכנסה השנתית</strong> ניתנות לניכוי
              </p>
              <input
                type="number"
                min={0}
                step={500}
                value={input.medicalExpenses}
                onChange={(e) => update('medicalExpenses', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="סך הוצאות רפואיות שנתיות (₪)"
              />
              <p className="text-[10px] text-rose-700 mt-1">
                סף לניכוי בהכנסתך: ~
                {(input.annualGrossSalary * 0.125).toLocaleString()} ₪
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מזונות לבן/בת זוג גרוש (₪/שנה) 🆕
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={input.alimonyPaid}
                onChange={(e) => update('alimonyPaid', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">הוצאה מוכרת רק למשלם</p>
            </div>
          </div>
        )}

        {/* Extras */}
        {activeSection === 'extras' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">🎁 תרומות ופריפריה</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תרומות לעמותות (סעיף 46) - ₪/שנה
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
                זיכוי 35%. מינימום 207 ₪/שנה. דרוש אישור 46.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תרומות פוליטיות (סעיף 46א) - ₪/שנה 🆕
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={input.politicalDonations}
                onChange={(e) => update('politicalDonations', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                זיכוי 35% עד תקרה של 12,800 ₪/שנה
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
                דרוש 12 חודשי תושבות רצופים
              </p>
            </div>
          </div>
        )}

        {/* הכנסות הון */}
        {activeSection === 'capital' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">📈 הכנסות הון 🆕</h3>
            <p className="text-sm text-gray-600">
              דיב' / ריבית / רווחי הון - מס נפרד 25%. אם נוכה יותר - יש החזר.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סך הכנסות הון שנתיות (₪)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={input.capitalIncome}
                onChange={(e) => update('capitalIncome', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                דיב' מניות, ריבית פיקדונות, רווחי הון משוק ההון
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מס שנוכה על הכנסות הון (₪)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.capitalTaxWithheld}
                onChange={(e) => update('capitalTaxWithheld', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                לרוב הבנק/ברוקר ניכה אוטומטית 25% - אם פחות, אתה חייב; אם יותר - מגיע החזר
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
              💡 מקרה נפוץ: ניכו לך 30% או 35% מהדיב' (כי המערכת לא ידעה את שיעור המס שלך) →
              מגיע לך החזר על ההפרש ל-25%.
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
            {result.isEntitledToRefund ? 'מומלץ להגיש בקשה!' : 'אין החזר בחישוב הראשוני'}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
          <h4 className="font-bold text-gray-900 mb-2">פירוט החישוב</h4>
          <Row label="הכנסה ברוטו" value={formatCurrency(input.annualGrossSalary)} />
          {result.section95Exemption > 0 && (
            <Row
              label="פטור סעיף 9(5)"
              value={`-${formatCurrency(result.section95Exemption)}`}
              className="text-rose-700"
            />
          )}
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
          {result.politicalDonationsCredit > 0 && (
            <Row
              label="זיכוי תרומות פוליטיות"
              value={`-${formatCurrency(result.politicalDonationsCredit)}`}
            />
          )}
          {result.lifeInsuranceCredit > 0 && (
            <Row
              label="זיכוי ביטוח חיים"
              value={`-${formatCurrency(result.lifeInsuranceCredit)}`}
            />
          )}
          {result.peripheryCredit > 0 && (
            <Row label="זיכוי פריפריה" value={`-${formatCurrency(result.peripheryCredit)}`} />
          )}
          <Row label="מס שצריך לשלם" value={formatCurrency(result.finalTax)} bold />
          <Row label="מס שנוכה" value={formatCurrency(input.taxWithheld)} />
          {result.capitalGainsRefund > 0 && (
            <Row
              label="החזר מס הון"
              value={`+${formatCurrency(result.capitalGainsRefund)}`}
              className="text-emerald-700"
            />
          )}
          <div className="pt-2 mt-2 border-t-2 border-emerald-400 flex justify-between font-bold text-emerald-700">
            <span>החזר משוער:</span>
            <span>{formatCurrency(result.estimatedRefund)}</span>
          </div>
        </div>

        {result.refundReasons.length > 0 && (
          <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">
              למה מגיע לך החזר? ({result.refundReasons.length} סיבות)
            </h4>
            <ul className="space-y-2 text-xs max-h-72 overflow-y-auto">
              {result.refundReasons.map((reason, i) => (
                <li key={i} className="border-r-2 border-emerald-400 pr-2">
                  <div className="font-semibold text-gray-900">{reason.category}</div>
                  <div className="text-gray-600">{reason.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
          <p className="font-semibold mb-1">ℹ️ הערכה בלבד</p>
          <p>
            המחשבון מכסה את הסעיפים העיקריים. למקרים מורכבים מומלץ ייעוץ מרו"ח. ההגשה דרך
            אתר רשות המסים.
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

function Row({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? 'font-semibold text-gray-900' : 'text-gray-700'} ${className ?? ''}`}
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}
