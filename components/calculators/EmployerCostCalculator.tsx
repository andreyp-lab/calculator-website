'use client';

import { useState, useMemo } from 'react';
import {
  calculateEmployerCost,
  JOB_PROFILES_2026,
  type EmployerCostInput,
  type JobProfile,
  type TransportationType,
} from '@/lib/calculators/employer-cost';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initialInput: EmployerCostInput = {
  grossSalary: 12_000,
  employmentType: 'regular',
  yearsOfService: 1,
  pensionEmployerRate: 6.5,
  compensationRate: 6,
  hasEducationFund: false,
  educationFundEmployerRate: 7.5,
  transportationType: 'none',
  transportationCost: 0,
  monthlyBenefits: 0,
  yearlyBenefits: 0,
};

export function EmployerCostCalculator() {
  const [input, setInput] = useState<EmployerCostInput>(initialInput);
  const [activeTab, setActiveTab] = useState<'basic' | 'benefits'>('basic');
  const [jobProfile, setJobProfile] = useState<JobProfile>('custom');

  // הטבות בודדות (toggleable)
  const [benefits, setBenefits] = useState({
    food: { active: false, amount: 800 },
    phone: { active: false, amount: 100 },
    welfare: { active: false, amount: 200 },
    gym: { active: false, amount: 300 },
    insurance: { active: false, amount: 400 },
    bonus: { active: false, amount: 10_000 }, // שנתי
    gifts: { active: false, amount: 1_000 }, // שנתי
    training: { active: false, amount: 5_000 }, // שנתי
  });

  // חישוב הטבות חודשיות ושנתיות לפי הסטייט
  const benefitsTotal = useMemo(() => {
    let monthly = 0;
    let yearly = 0;
    if (benefits.food.active) monthly += benefits.food.amount;
    if (benefits.phone.active) monthly += benefits.phone.amount;
    if (benefits.welfare.active) monthly += benefits.welfare.amount;
    if (benefits.gym.active) monthly += benefits.gym.amount;
    if (benefits.insurance.active) monthly += benefits.insurance.amount;
    if (benefits.bonus.active) yearly += benefits.bonus.amount;
    if (benefits.gifts.active) yearly += benefits.gifts.amount;
    if (benefits.training.active) yearly += benefits.training.amount;
    return { monthly, yearly };
  }, [benefits]);

  const result = useMemo(
    () =>
      calculateEmployerCost({
        ...input,
        monthlyBenefits: benefitsTotal.monthly,
        yearlyBenefits: benefitsTotal.yearly,
      }),
    [input, benefitsTotal],
  );

  function updateField<K extends keyof EmployerCostInput>(
    field: K,
    value: EmployerCostInput[K],
  ) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  function applyJobProfile(profile: JobProfile) {
    setJobProfile(profile);
    if (profile === 'custom') return;
    const p = JOB_PROFILES_2026[profile];
    setInput((prev) => ({
      ...prev,
      grossSalary: p.salary,
      hasEducationFund: p.eduFund,
      transportationType: p.transportation as TransportationType,
      transportationCost:
        p.transportation === 'public'
          ? 300
          : p.transportation === 'car'
            ? 1_000
            : p.transportation === 'company'
              ? 3_500
              : 0,
    }));
  }

  function toggleBenefit(key: keyof typeof benefits) {
    setBenefits((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }));
  }

  function updateBenefitAmount(key: keyof typeof benefits, amount: number) {
    setBenefits((prev) => ({
      ...prev,
      [key]: { ...prev[key], amount },
    }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* קלט */}
      <div className="lg:col-span-3 bg-paper border border-ink/15 rounded-none p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-ink/15">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 border-b-2 transition ${
              activeTab === 'basic'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-ink/60 hover:text-ink'
            }`}
          >
            פרטי העובד
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2 border-b-2 transition ${
              activeTab === 'benefits'
                ? 'border-gold text-ink font-semibold'
                : 'border-transparent text-ink/60 hover:text-ink'
            }`}
          >
            הטבות נוספות
          </button>
        </div>

        {activeTab === 'basic' && (
          <div className="space-y-5">
            {/* פרופיל תפקיד */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                בחר תפקיד (טעינה מהירה)
              </label>
              <select
                value={jobProfile}
                onChange={(e) => applyJobProfile(e.target.value as JobProfile)}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              >
                {Object.entries(JOB_PROFILES_2026).map(([key, p]) => (
                  <option key={key} value={key}>
                    {p.label}
                    {key !== 'custom' && ` (${p.salary.toLocaleString()} ₪)`}
                  </option>
                ))}
              </select>
            </div>

            {/* שכר ברוטו */}
            <div>
              <label
                htmlFor="grossSalary"
                className="block text-sm font-medium text-ink/70 mb-2"
              >
                שכר ברוטו חודשי (₪)
              </label>
              <input
                id="grossSalary"
                type="number"
                min={0}
                step={500}
                value={input.grossSalary}
                onChange={(e) => updateField('grossSalary', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold text-lg"
              />
            </div>

            {/* סוג העסקה + ותק */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="employmentType"
                  className="block text-sm font-medium text-ink/70 mb-2"
                >
                  סוג העסקה
                </label>
                <select
                  id="employmentType"
                  value={input.employmentType}
                  onChange={(e) =>
                    updateField('employmentType', e.target.value as EmployerCostInput['employmentType'])
                  }
                  className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
                >
                  <option value="regular">משרה מלאה</option>
                  <option value="part-time">משרה חלקית</option>
                  <option value="hourly">שעתי</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="yearsOfService"
                  className="block text-sm font-medium text-ink/70 mb-2"
                >
                  וותק (שנים)
                </label>
                <input
                  id="yearsOfService"
                  type="number"
                  min={0}
                  step={0.5}
                  value={input.yearsOfService}
                  onChange={(e) => updateField('yearsOfService', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            {/* משרה חלקית */}
            {input.employmentType === 'part-time' && (
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  אחוז משרה (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={input.partTimePercentage ?? 100}
                  onChange={(e) => updateField('partTimePercentage', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
                />
              </div>
            )}

            {/* שעתי */}
            {input.employmentType === 'hourly' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-2">
                    תעריף לשעה (₪)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={input.hourlyRate ?? 60}
                    onChange={(e) => updateField('hourlyRate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-2">
                    שעות בחודש
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={input.hoursPerMonth ?? 182}
                    onChange={(e) => updateField('hoursPerMonth', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            )}

            {/* פנסיה ופיצויים */}
            <div className="bg-cream-2 border border-ink/15 rounded-none p-4">
              <h4 className="font-semibold text-ink mb-3 text-sm">פנסיה ופיצויים</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ink/70 mb-1">פנסיה מעסיק (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={20}
                    value={input.pensionEmployerRate}
                    onChange={(e) =>
                      updateField('pensionEmployerRate', Number(e.target.value))
                    }
                    className="w-full px-2 py-1.5 border border-ink/15 rounded-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-ink/70 mb-1">פיצויים (%)</label>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    max={20}
                    value={input.compensationRate}
                    onChange={(e) => updateField('compensationRate', Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-ink/15 rounded-none text-sm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.hasEducationFund}
                  onChange={(e) => updateField('hasEducationFund', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-ink/70">קרן השתלמות (7.5% מעסיק)</span>
              </label>
            </div>

            {/* נסיעות */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                נסיעות
              </label>
              <select
                value={input.transportationType}
                onChange={(e) => {
                  const t = e.target.value as TransportationType;
                  updateField('transportationType', t);
                  if (t === 'public') updateField('transportationCost', 300);
                  else if (t === 'car') updateField('transportationCost', 1_000);
                  else if (t === 'company') updateField('transportationCost', 3_500);
                  else updateField('transportationCost', 0);
                }}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              >
                <option value="none">ללא</option>
                <option value="public">תחבורה ציבורית</option>
                <option value="car">החזר רכב פרטי</option>
                <option value="company">רכב חברה</option>
              </select>
              {input.transportationType !== 'none' && (
                <input
                  type="number"
                  min={0}
                  value={input.transportationCost ?? 0}
                  onChange={(e) => updateField('transportationCost', Number(e.target.value))}
                  className="w-full mt-2 px-3 py-2 border border-ink/15 rounded-none text-sm"
                  placeholder="עלות חודשית (₪)"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-3">
            <p className="text-sm text-ink/70 mb-3">
              סמן את ההטבות שאתה מעניק לעובד והגדר את הסכום
            </p>
            {(
              [
                { key: 'food' as const, label: 'ארוחות', period: 'חודשי' },
                { key: 'phone' as const, label: 'טלפון נייד', period: 'חודשי' },
                { key: 'welfare' as const, label: 'תקציב רווחה', period: 'חודשי' },
                { key: 'gym' as const, label: 'חדר כושר/ספורט', period: 'חודשי' },
                { key: 'insurance' as const, label: 'ביטוח בריאות', period: 'חודשי' },
                { key: 'bonus' as const, label: 'בונוס שנתי', period: 'שנתי' },
                { key: 'gifts' as const, label: 'מתנות חג', period: 'שנתי' },
                { key: 'training' as const, label: 'הכשרות', period: 'שנתי' },
              ] as const
            ).map(({ key, label, period }) => (
              <div
                key={key}
                className={`p-3 rounded-none border-2 transition ${
                  benefits[key].active
                    ? 'border-gold bg-cream-2'
                    : 'border-ink/15 bg-cream-2'
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={benefits[key].active}
                    onChange={() => toggleBenefit(key)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-ink flex-1">{label}</span>
                  <span className="text-xs text-ink/60">({period})</span>
                </label>
                {benefits[key].active && (
                  <input
                    type="number"
                    min={0}
                    value={benefits[key].amount}
                    onChange={(e) => updateBenefitAmount(key, Number(e.target.value))}
                    className="w-full mt-2 px-3 py-1.5 border border-ink/15 rounded-none text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* תוצאה */}
      <div className="lg:col-span-2 space-y-4">
        {result.warning && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-none p-3 text-xs text-amber-900">
            ⚠️ {result.warning}
          </div>
        )}

        <ResultCard
          title="עלות מעסיק חודשית"
          value={formatCurrency(result.totalMonthlyCost)}
          subtitle={`+${result.premiumPercentage.toFixed(1)}% מעל לשכר`}
          variant="success"
        />

        <ResultCard
          title="עלות שנתית"
          value={formatCurrency(result.totalYearlyCost)}
          variant="primary"
        />

        <div className="bg-cream-2 border border-ink/15 rounded-none p-4">
          <h4 className="font-semibold text-ink mb-3 text-sm">פירוט חודשי</h4>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/70">שכר ברוטו:</dt>
              <dd className="font-medium">{formatCurrency(result.baseSalary)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">ביטוח לאומי:</dt>
              <dd className="font-medium">{formatCurrency(result.nationalInsurance)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">פנסיה מעסיק:</dt>
              <dd className="font-medium">{formatCurrency(result.pensionEmployer)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">פיצויים:</dt>
              <dd className="font-medium">{formatCurrency(result.compensation)}</dd>
            </div>
            {result.educationFundEmployer > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink/70">קרן השתלמות:</dt>
                <dd className="font-medium">
                  {formatCurrency(result.educationFundEmployer)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/70">
                דמי הבראה ({result.effectiveRecoveryDays} ימים):
              </dt>
              <dd className="font-medium">{formatCurrency(result.recoveryPay)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">
                חופשה ({result.effectiveVacationDays} ימים):
              </dt>
              <dd className="font-medium">{formatCurrency(result.vacationCost)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">
                מחלה ({result.effectiveSickDays} ימים, 25%):
              </dt>
              <dd className="font-medium">{formatCurrency(result.sickDaysCost)}</dd>
            </div>
            {result.transportationCost > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink/70">נסיעות:</dt>
                <dd className="font-medium">{formatCurrency(result.transportationCost)}</dd>
              </div>
            )}
            {result.benefitsCost > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink/70">הטבות:</dt>
                <dd className="font-medium">{formatCurrency(result.benefitsCost)}</dd>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-ink/15 font-bold">
              <dt className="text-ink">סה"כ:</dt>
              <dd className="text-ink">{formatCurrency(result.totalMonthlyCost)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-cream-2 border border-ink/15 rounded-none p-4 text-xs text-ink">
          <p className="font-semibold mb-1">יחס עלות/שכר: {result.costToSalaryRatio.toFixed(2)}</p>
          <p>
            על כל ₪1 ברוטו לעובד, אתה משלם {formatCurrency(result.costToSalaryRatio)} בפועל.
          </p>
        </div>
      </div>
    </div>
  );
}
