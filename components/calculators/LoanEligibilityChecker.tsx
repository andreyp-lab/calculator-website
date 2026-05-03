'use client';

import { useState, useMemo } from 'react';
import {
  calculateLoanEligibility,
  type LoanEligibilityInput,
  type BusinessAge,
  type AnnualRevenueBand,
  type LegalStatus,
  type LoanPurpose,
} from '@/lib/calculators/loan-eligibility';
import { formatCurrency } from '@/lib/utils/formatters';

const STEPS = [
  { id: 1, label: 'פרטי העסק' },
  { id: 2, label: 'תנאי סף' },
  { id: 3, label: 'פרטים נוספים' },
  { id: 4, label: 'תוצאות' },
] as const;

const initialInput: LoanEligibilityInput = {
  businessAge: 'over3',
  annualRevenue: '625to25m',
  legalStatus: 'company',
  hasLegalProceedings: false,
  hasTaxDebt: false,
  hasAccountLimitations: false,
  loanPurpose: 'workingCapital',
  isInNorth: false,
  isExporter: false,
  isIndustry: false,
  reserveService: false,
};

export function LoanEligibilityChecker() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<LoanEligibilityInput>(initialInput);
  const [businessType, setBusinessType] = useState('');

  const result = useMemo(() => calculateLoanEligibility(input), [input]);

  function update<K extends keyof LoanEligibilityInput>(
    key: K,
    value: LoanEligibilityInput[K],
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInput(initialInput);
    setBusinessType('');
    setStep(1);
  }

  const isStep1Valid =
    businessType !== '' &&
    input.businessAge !== undefined &&
    input.annualRevenue !== undefined &&
    input.legalStatus !== undefined;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                  step >= s.id
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s.id ? '✓' : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition ${
                    step > s.id ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          {STEPS.map((s) => (
            <span key={s.id} className={step >= s.id ? 'font-medium text-gray-900' : ''}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step 1: Business details */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">פרטי העסק</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג העסק</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">בחר/י...</option>
              <option value="service">שירותים</option>
              <option value="trade">מסחר</option>
              <option value="manufacture">תעשייה</option>
              <option value="tech">היי-טק</option>
              <option value="agriculture">חקלאות</option>
              <option value="tourism">תיירות</option>
              <option value="other">אחר</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ותק העסק</label>
            <select
              value={input.businessAge}
              onChange={(e) => update('businessAge', e.target.value as BusinessAge)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="new">עסק בהקמה</option>
              <option value="under3">עד 3 שנים</option>
              <option value="over3">מעל 3 שנים</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מחזור שנתי</label>
            <select
              value={input.annualRevenue}
              onChange={(e) => update('annualRevenue', e.target.value as AnnualRevenueBand)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="under625">עד 6.25 מיליון ₪</option>
              <option value="625to25m">6.25 - 25 מיליון ₪</option>
              <option value="25to100m">25 - 100 מיליון ₪</option>
              <option value="over100m">מעל 100 מיליון ₪</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס משפטי</label>
            <select
              value={input.legalStatus}
              onChange={(e) => update('legalStatus', e.target.value as LegalStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="individual">עוסק מורשה / פטור</option>
              <option value="company">חברה בע"מ</option>
              <option value="partnership">שותפות</option>
              <option value="ngo">עמותה</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              הבא
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Threshold */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">תנאי סף</h3>
          <p className="text-sm text-gray-600 mb-4">
            תנאים אלה מבטלים זכאות לכל מסלולי הקרן. סמן רק אם רלוונטי.
          </p>

          {[
            {
              key: 'hasLegalProceedings' as const,
              label: 'מתנהלים הליכים משפטיים נגד העסק',
            },
            { key: 'hasTaxDebt' as const, label: 'קיימים חובות לרשויות המס' },
            {
              key: 'hasAccountLimitations' as const,
              label: 'החשבון מוגבל או קיימים עיקולים',
            },
          ].map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                input[key] ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={input[key]}
                onChange={(e) => update(key, e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm text-gray-900 font-medium">{label}</span>
            </label>
          ))}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              חזור
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              הבא
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Additional details */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">פרטים נוספים</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מטרת ההלוואה</label>
            <select
              value={input.loanPurpose}
              onChange={(e) => update('loanPurpose', e.target.value as LoanPurpose)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="workingCapital">הון חוזר</option>
              <option value="expansion">הרחבת עסק קיים</option>
              <option value="newBusiness">הקמת עסק חדש</option>
              <option value="equipment">רכישת ציוד</option>
              <option value="industry">השקעה בתעשייה</option>
            </select>
          </div>

          {[
            {
              key: 'isInNorth' as const,
              label: 'העסק פועל בצפון',
              hint: 'מקנה הקלות במסלול חרבות ברזל',
            },
            {
              key: 'isExporter' as const,
              label: 'העסק הוא יצואן',
              hint: 'היקף יצוא מינימלי 250K$/שנה',
            },
            {
              key: 'isIndustry' as const,
              label: 'העסק בתחום התעשייה',
              hint: 'מסלול תעשייה - תקופת החזר עד 12 שנים',
            },
            {
              key: 'reserveService' as const,
              label: 'בעל העסק משרת במילואים',
              hint: 'הקלת ביטחונות במסגרת חרבות ברזל',
            },
          ].map(({ key, label, hint }) => (
            <label
              key={key}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                input[key] ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={input[key]}
                onChange={(e) => update(key, e.target.checked)}
                className="w-5 h-5 mt-0.5"
              />
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{label}</div>
                <div className="text-xs text-gray-500">{hint}</div>
              </div>
            </label>
          ))}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              חזור
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              בדוק זכאות
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div>
          {result.eligible ? (
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">נמצאת זכאי להלוואה בערבות המדינה!</h3>
              <p className="opacity-90 mb-6">{result.message}</p>

              <div className="bg-white text-gray-900 rounded-lg p-6 text-right space-y-3">
                <ResultRow label="מסלול ההלוואה" value={result.route} />
                <ResultRow
                  label="סכום מקסימלי"
                  value={formatCurrency(result.maxLoanAmount)}
                  highlight
                />
                <ResultRow
                  label="ביטחונות נדרשים"
                  value={`${result.securityRequiredPct}% (${formatCurrency(
                    result.securityRequiredAmount,
                  )})`}
                />
                <ResultRow label="תנאי החזר" value={result.termsLabel} />
                {result.applicableRoutes.length > 1 && (
                  <ResultRow
                    label="מסלולים חלים"
                    value={result.applicableRoutes.join(' • ')}
                  />
                )}
              </div>

              <p className="text-xs opacity-80 mt-6">
                * אישור ההלוואה כפוף לבדיקת הגוף המממן ולעמידה בכל תנאי הקרן. המידע להערכה בלבד.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-red-900 mb-3">
                לא נמצאה זכאות להלוואה בערבות המדינה
              </h3>
              <p className="text-red-800 mb-4">{result.message}</p>

              {result.disqualifiers.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">סיבות:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {result.disqualifiers.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-600 mt-4">
                * צור קשר עם יועץ פיננסי לבחינת חלופות מימון.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              בדיקה חדשה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 font-medium">{label}:</span>
      <span className={`text-sm ${highlight ? 'font-bold text-emerald-700 text-lg' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}
