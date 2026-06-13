'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  type WizardAnswers,
  type IncomeStreamDetail,
  type EmployeeDetail,
  type SupplierExpenseDetail,
  createDefaultAnswers,
  generateBudgetFromWizard,
  summarizeWizard,
  suggestDefaults,
} from '@/lib/tools/budget-wizard-engine';
import { INDUSTRY_BENCHMARKS } from '@/lib/tools/industry-benchmarks';
import { formatCurrency } from '@/lib/tools/format';
import type { Industry, Department } from '@/lib/tools/types';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
  Package,
  Users,
  Building,
  Megaphone,
  Lightbulb,
  Banknote,
  ClipboardCheck,
  Rocket,
  Plus,
  Trash2,
} from 'lucide-react';

const STORAGE_KEY = 'wizard-progress-v1';

const STEPS = [
  { id: 'industry', label: 'ענף וחברה', icon: Building2 },
  { id: 'revenue', label: 'הכנסות', icon: TrendingUp },
  { id: 'cogs', label: 'עלות מכר', icon: Package },
  { id: 'employees', label: 'עובדים', icon: Users },
  { id: 'operating', label: 'שכירות ותפעול', icon: Building },
  { id: 'marketing', label: 'שיווק', icon: Megaphone },
  { id: 'rnd', label: 'מחקר ופיתוח', icon: Lightbulb },
  { id: 'loans', label: 'הלוואות', icon: Banknote },
  { id: 'review', label: 'סקירה', icon: ClipboardCheck },
] as const;

const INDUSTRY_LABELS: Record<Industry, string> = {
  technology: 'טכנולוגיה / SaaS',
  retail: 'קמעונאות / מסחר',
  manufacturing: 'תעשייה / ייצור',
  food: 'מזון / מסעדנות',
  construction: 'בנייה / תשתיות',
  services: 'שירותים / ייעוץ',
  energy: 'אנרגיה',
  healthcare: 'בריאות / רפואה',
  finance: 'פיננסים',
  realestate: 'נדל"ן',
};

export default function BudgetWizardPage() {
  const { replaceBudget, updateSettings } = useTools();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(() => {
    if (typeof window === 'undefined') return createDefaultAnswers();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return createDefaultAnswers();
  });

  // Auto-save progress
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const summary = useMemo(() => summarizeWizard(answers), [answers]);
  const benchmark = INDUSTRY_BENCHMARKS[answers.industry];
  const fmt = (v: number) => formatCurrency(v, 'ILS');

  const update = (updates: Partial<WizardAnswers>) => setAnswers((a) => ({ ...a, ...updates }));

  // When industry changes, suggest defaults
  function handleIndustryChange(industry: Industry) {
    const defaults = suggestDefaults(industry);
    update({ industry, ...defaults });
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function applyAndContinue() {
    const budget = generateBudgetFromWizard(answers);
    replaceBudget(budget);
    updateSettings({
      industry: answers.industry,
      companyName: answers.companyName || 'החברה שלי',
      fiscalYear: answers.fiscalYear,
      taxRate: answers.taxRatePct,
    });
    // Clear wizard progress
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    router.push('/tools/unified');
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-gold" />
          <h1 className="text-3xl font-bold text-ink">אשף תקציב חכם</h1>
        </div>
        <p className="text-ink/70">10 שאלות פשוטות → תקציב מקצועי מלא + תזרים + ניתוח</p>
      </div>

      {/* Progress */}
      <div className="bg-paper border-2 border-ink/15 p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-ink/70">
            שלב {step + 1} מתוך {STEPS.length}
          </span>
          <span className="text-xs text-ink/60">
            {Math.round(((step + 1) / STEPS.length) * 100)}% הושלם
          </span>
        </div>
        <div className="bg-cream-2 rounded-full h-2 overflow-hidden">
          <div
            className="bg-ink h-full rounded-full transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isCurrent = i === step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className={`flex flex-col items-center gap-1 min-w-[60px] text-xs ${
                  isCurrent
                    ? 'text-gold font-bold'
                    : isDone
                      ? 'text-emerald-600'
                      : 'text-ink/45'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrent
                      ? 'bg-ink text-cream ring-4 ring-ink/20'
                      : isDone
                        ? 'bg-emerald-100'
                        : 'bg-cream-2'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="truncate max-w-[80px]">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-paper border-2 border-ink/15 shadow-sm overflow-hidden mb-4">
        <div className="bg-ink text-cream p-4">
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = STEPS[step].icon;
              return <Icon className="w-6 h-6" />;
            })()}
            <h2 className="text-xl font-bold">{STEPS[step].label}</h2>
          </div>
        </div>
        <div className="p-6">
          {step === 0 && <IndustryStep answers={answers} onUpdate={update} onIndustryChange={handleIndustryChange} />}
          {step === 1 && <RevenueStep answers={answers} onUpdate={update} benchmark={benchmark} />}
          {step === 2 && <CogsStep answers={answers} onUpdate={update} benchmark={benchmark} />}
          {step === 3 && <EmployeesStep answers={answers} onUpdate={update} />}
          {step === 4 && <OperatingStep answers={answers} onUpdate={update} />}
          {step === 5 && <MarketingStep answers={answers} onUpdate={update} benchmark={benchmark} />}
          {step === 6 && <RndStep answers={answers} onUpdate={update} benchmark={benchmark} />}
          {step === 7 && <LoansStep answers={answers} onUpdate={update} />}
          {step === 8 && <ReviewStep answers={answers} summary={summary} onApply={applyAndContinue} />}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={back}
          disabled={step === 0}
          className="px-4 py-2 bg-cream-2 text-ink hover:bg-paper-hover disabled:opacity-30 flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4" />
          הקודם
        </button>

        <Link href="/tools/start" className="text-sm text-ink/60 hover:text-ink">
          ביטול
        </Link>

        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            className="px-6 py-2 bg-ink text-cream hover:bg-ink-deep flex items-center gap-1 font-semibold"
          >
            הבא
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={applyAndContinue}
            className="px-6 py-2 bg-ink text-cream hover:bg-ink-deep flex items-center gap-2 font-semibold shadow-lg"
          >
            <Rocket className="w-4 h-4" />
            צור תקציב והמשך
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// STEPS
// ============================================================

function IndustryStep({
  answers,
  onUpdate,
  onIndustryChange,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
  onIndustryChange: (i: Industry) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">
        בחר את הענף ומאפייני החברה. זה ייקבע את ערכי ברירת המחדל בכל השלבים.
      </p>

      <div>
        <label className="block text-sm font-medium text-ink/70 mb-2">שם החברה</label>
        <input
          type="text"
          value={answers.companyName}
          onChange={(e) => onUpdate({ companyName: e.target.value })}
          placeholder="לדוגמה: חברת ABC בע״מ"
          className="w-full px-3 py-2 border border-ink/15 bg-paper"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink/70 mb-2">ענף</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(Object.keys(INDUSTRY_LABELS) as Industry[]).map((ind) => (
            <button
              key={ind}
              onClick={() => onIndustryChange(ind)}
              className={`p-3 border-2 text-sm transition ${
                answers.industry === ind
                  ? 'border-gold bg-cream-2 text-ink font-semibold'
                  : 'border-ink/15 bg-paper hover:border-gold'
              }`}
            >
              {INDUSTRY_LABELS[ind]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink/70 mb-2">שלב העסק</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'startup', label: 'התחלה (פחות משנה)' },
            { value: 'growth', label: 'צמיחה (1-5 שנים)' },
            { value: 'mature', label: 'בוגר (5+ שנים)' },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => onUpdate({ stage: s.value as WizardAnswers['stage'] })}
              className={`p-3 border-2 text-sm transition ${
                answers.stage === s.value
                  ? 'border-gold bg-cream-2 text-ink font-semibold'
                  : 'border-ink/15 bg-paper hover:border-gold'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">שנת מס</label>
          <input
            type="number"
            value={answers.fiscalYear}
            onChange={(e) => onUpdate({ fiscalYear: parseInt(e.target.value) || 2026 })}
            className="w-full px-3 py-2 border border-ink/15 bg-paper"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">שיעור מס (%)</label>
          <input
            type="number"
            value={answers.taxRatePct}
            onChange={(e) => onUpdate({ taxRatePct: parseFloat(e.target.value) || 23 })}
            className="w-full px-3 py-2 border border-ink/15 bg-paper"
          />
        </div>
      </div>
    </div>
  );
}

function RevenueStep({
  answers,
  onUpdate,
  benchmark,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
  benchmark: { revenueGrowthPct: { median: number; low: number; high: number } };
}) {
  function addStream() {
    onUpdate({
      incomeStreams: [
        ...answers.incomeStreams,
        {
          name: `מקור הכנסה ${answers.incomeStreams.length + 1}`,
          monthlyAmount: 0,
          paymentTermsDays: 30,
          growthPctMonthly: 0,
        },
      ],
    });
  }

  function updateStream(idx: number, patch: Partial<IncomeStreamDetail>) {
    const streams = [...answers.incomeStreams];
    streams[idx] = { ...streams[idx], ...patch };
    onUpdate({ incomeStreams: streams });
  }

  function removeStream(idx: number) {
    onUpdate({ incomeStreams: answers.incomeStreams.filter((_, i) => i !== idx) });
  }

  const detailedTotal = answers.incomeStreams.reduce((s, x) => s + x.monthlyAmount, 0);

  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">איך תרצה להזין את ההכנסות?</p>

      <ModeToggle
        mode={answers.incomeMode}
        onChange={(m) => onUpdate({ incomeMode: m })}
        simpleLabel="פשוט - סכום כולל"
        detailedLabel="מפורט - מקור-מקור"
      />

      {answers.incomeMode === 'simple' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              הכנסה חודשית ממוצעת (₪)
            </label>
            <input
              type="number"
              value={answers.monthlyRevenue || ''}
              onChange={(e) => onUpdate({ monthlyRevenue: parseFloat(e.target.value) || 0 })}
              placeholder="100000"
              className="w-full px-3 py-2 border border-ink/15 bg-paper text-lg"
            />
            <p className="text-xs text-ink/60 mt-1">
              שנתית: ₪{(answers.monthlyRevenue * 12).toLocaleString('he-IL')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              מספר מקורות הכנסה
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => onUpdate({ numIncomeStreams: n })}
                  className={`p-3 border-2 transition ${
                    answers.numIncomeStreams === n
                      ? 'border-gold bg-cream-2 text-ink font-bold'
                      : 'border-ink/15 bg-paper hover:border-gold'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink/60 mt-1">
              נחלק את הסכום בין המקורות אוטומטית. לחלוקה מדויקת השתמש ב"מפורט".
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">מקורות הכנסה ({answers.incomeStreams.length})</span>
            <span className="text-sm text-ink/60">
              סה"כ חודשי: ₪{detailedTotal.toLocaleString('he-IL')}
            </span>
          </div>

          {answers.incomeStreams.length === 0 ? (
            <div className="text-center py-6 bg-cream-2 border-2 border-dashed border-ink/15">
              <p className="text-sm text-ink/60 mb-2">עוד לא הוספת מקור הכנסה</p>
              <button
                onClick={addStream}
                className="px-3 py-1.5 bg-ink text-cream text-sm flex items-center gap-1 mx-auto"
              >
                <Plus className="w-4 h-4" />
                הוסף מקור ראשון
              </button>
            </div>
          ) : (
            <>
              {answers.incomeStreams.map((stream, idx) => (
                <div key={idx} className="bg-cream-2 border border-ink/15 p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-1">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-ink/60 mb-0.5">שם המקור</label>
                      <input
                        type="text"
                        value={stream.name}
                        onChange={(e) => updateStream(idx, { name: e.target.value })}
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink/60 mb-0.5">סכום חודשי</label>
                      <input
                        type="number"
                        value={stream.monthlyAmount || ''}
                        onChange={(e) =>
                          updateStream(idx, { monthlyAmount: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink/60 mb-0.5">ימי תשלום</label>
                      <select
                        value={stream.paymentTermsDays}
                        onChange={(e) =>
                          updateStream(idx, { paymentTermsDays: parseInt(e.target.value) })
                        }
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      >
                        <option value={0}>מיידי</option>
                        <option value={30}>נטו 30</option>
                        <option value={45}>נטו 45</option>
                        <option value={60}>נטו 60</option>
                        <option value={90}>נטו 90</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-ink/60">צמיחה חודשית:</span>
                      <input
                        type="number"
                        step="0.1"
                        value={stream.growthPctMonthly}
                        onChange={(e) =>
                          updateStream(idx, { growthPctMonthly: parseFloat(e.target.value) || 0 })
                        }
                        className="w-16 px-1 py-0.5 border border-ink/15 bg-paper text-center"
                      />
                      <span className="text-ink/60">%</span>
                    </div>
                    <button
                      onClick={() => removeStream(idx)}
                      className="p-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addStream}
                className="w-full p-2 border-2 border-dashed border-ink/15 text-sm text-ink/70 hover:bg-cream-2 flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                הוסף מקור הכנסה
              </button>
            </>
          )}
        </div>
      )}

      {/* Growth */}
      {answers.incomeMode === 'simple' && (
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            צמיחה צפויה (% שנתי)
          </label>
          <input
            type="number"
            step="0.5"
            value={answers.expectedGrowthPct}
            onChange={(e) => onUpdate({ expectedGrowthPct: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-ink/15 bg-paper"
          />
          <BenchmarkHint
            label="צמיחה ענפית"
            low={benchmark.revenueGrowthPct.low}
            median={benchmark.revenueGrowthPct.median}
            high={benchmark.revenueGrowthPct.high}
            unit="%"
            value={answers.expectedGrowthPct}
          />
        </div>
      )}
    </div>
  );
}

function CogsStep({
  answers,
  onUpdate,
  benchmark,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
  benchmark: { grossMargin: { median: number; low: number; high: number } };
}) {
  const grossMargin = 100 - answers.cogsPct;

  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">
        עלות המכר היא העלויות הישירות של ייצור המוצר/שירות (חומרי גלם, תשלומים לספקים, עמלות וכו').
      </p>

      <div>
        <label className="block text-sm font-medium text-ink/70 mb-2">
          עלות מכר (% מההכנסות)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={answers.cogsPct}
            onChange={(e) => onUpdate({ cogsPct: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <input
            type="number"
            value={answers.cogsPct}
            onChange={(e) => onUpdate({ cogsPct: parseFloat(e.target.value) || 0 })}
            className="w-20 px-2 py-1 border border-ink/15 bg-paper text-center"
          />
          <span className="text-ink/60">%</span>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-3 text-center">
        <div className="text-xs text-emerald-700 mb-1">מרווח גולמי שלך</div>
        <div className="text-3xl font-bold text-emerald-700">{grossMargin.toFixed(1)}%</div>
        <BenchmarkHint
          label="מרווח גולמי ענפי"
          low={benchmark.grossMargin.low}
          median={benchmark.grossMargin.median}
          high={benchmark.grossMargin.high}
          unit="%"
          value={grossMargin}
        />
      </div>
    </div>
  );
}

const DEPARTMENT_LABELS: Record<Department, string> = {
  sales: 'מכירות',
  marketing: 'שיווק',
  development: 'פיתוח (R&D)',
  operations: 'תפעול',
  administration: 'אדמין',
};

function EmployeesStep({
  answers,
  onUpdate,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
}) {
  function addEmployee() {
    onUpdate({
      employees: [
        ...answers.employees,
        {
          name: `עובד ${answers.employees.length + 1}`,
          position: '',
          department: 'operations',
          monthlySalary: 10000,
        },
      ],
    });
  }

  function updateEmployee(idx: number, patch: Partial<EmployeeDetail>) {
    const list = [...answers.employees];
    list[idx] = { ...list[idx], ...patch };
    onUpdate({ employees: list });
  }

  function removeEmployee(idx: number) {
    onUpdate({ employees: answers.employees.filter((_, i) => i !== idx) });
  }

  const detailedTotal = answers.employees.reduce((s, e) => s + e.monthlySalary, 0);
  const avgSalary =
    answers.numEmployees > 0 ? answers.totalMonthlySalary / answers.numEmployees : 0;

  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">איך תרצה להזין את העובדים?</p>

      <ModeToggle
        mode={answers.employeesMode}
        onChange={(m) => onUpdate({ employeesMode: m })}
        simpleLabel="פשוט - מספר וסכום כולל"
        detailedLabel="מפורט - עובד-עובד"
      />

      {answers.employeesMode === 'simple' ? (
        <>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">מספר עובדים</label>
              <input
                type="number"
                value={answers.numEmployees || ''}
                onChange={(e) => onUpdate({ numEmployees: parseInt(e.target.value) || 0 })}
                placeholder="0 אם אין"
                className="w-full px-3 py-2 border border-ink/15 bg-paper"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                סך כל השכר החודשי (₪)
              </label>
              <input
                type="number"
                value={answers.totalMonthlySalary || ''}
                onChange={(e) =>
                  onUpdate({ totalMonthlySalary: parseFloat(e.target.value) || 0 })
                }
                placeholder="לדוגמה: 60000"
                className="w-full px-3 py-2 border border-ink/15 bg-paper"
              />
            </div>
          </div>

          {answers.numEmployees > 0 && (
            <div className="bg-cream-2 border border-ink/15 p-3">
              <div className="text-sm text-ink">
                שכר ממוצע לעובד: ₪{avgSalary.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-ink/70 mt-1">
                נחלק את העובדים אוטומטית למחלקות לפי הענף. עבור למצב מפורט לשליטה מדויקת.
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">עובדים ({answers.employees.length})</span>
            <span className="text-sm text-ink/60">
              סה"כ שכר חודשי: ₪{detailedTotal.toLocaleString('he-IL')}
            </span>
          </div>

          {answers.employees.length === 0 ? (
            <div className="text-center py-6 bg-cream-2 border-2 border-dashed border-ink/15">
              <p className="text-sm text-ink/60 mb-2">עוד לא הוספת עובדים</p>
              <button
                onClick={addEmployee}
                className="px-3 py-1.5 bg-ink text-cream text-sm flex items-center gap-1 mx-auto"
              >
                <Plus className="w-4 h-4" />
                הוסף עובד ראשון
              </button>
            </div>
          ) : (
            <>
              {answers.employees.map((emp, idx) => (
                <div key={idx} className="bg-cream-2 border border-ink/15 p-3">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div>
                      <label className="block text-xs text-ink/60 mb-0.5">שם</label>
                      <input
                        type="text"
                        value={emp.name}
                        onChange={(e) => updateEmployee(idx, { name: e.target.value })}
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink/60 mb-0.5">תפקיד</label>
                      <input
                        type="text"
                        value={emp.position}
                        onChange={(e) => updateEmployee(idx, { position: e.target.value })}
                        placeholder="מנהל פרויקטים"
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink/60 mb-0.5">מחלקה</label>
                      <select
                        value={emp.department}
                        onChange={(e) =>
                          updateEmployee(idx, { department: e.target.value as Department })
                        }
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      >
                        {(Object.keys(DEPARTMENT_LABELS) as Department[]).map((d) => (
                          <option key={d} value={d}>
                            {DEPARTMENT_LABELS[d]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-ink/60 mb-0.5">שכר חודשי</label>
                      <input
                        type="number"
                        value={emp.monthlySalary || ''}
                        onChange={(e) =>
                          updateEmployee(idx, { monthlySalary: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeEmployee(idx)}
                        className="p-1.5 text-red-600 hover:bg-red-50 w-full flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addEmployee}
                className="w-full p-2 border-2 border-dashed border-ink/15 text-sm text-ink/70 hover:bg-cream-2 flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                הוסף עובד
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const SUPPLIER_CATEGORY_LABELS: Record<SupplierExpenseDetail['category'], string> = {
  cogs: 'עלות מכר (COGS)',
  rnd: 'מחקר ופיתוח',
  marketing: 'שיווק',
  operating: 'תפעול',
  financial: 'מימון',
};

function OperatingStep({
  answers,
  onUpdate,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
}) {
  function addSupplier() {
    onUpdate({
      suppliers: [
        ...answers.suppliers,
        {
          name: `ספק ${answers.suppliers.length + 1}`,
          category: 'operating',
          monthlyAmount: 1000,
          isPctOfRevenue: false,
          percentageOfRevenue: 0,
        },
      ],
    });
  }

  function updateSupplier(idx: number, patch: Partial<SupplierExpenseDetail>) {
    const list = [...answers.suppliers];
    list[idx] = { ...list[idx], ...patch };
    onUpdate({ suppliers: list });
  }

  function removeSupplier(idx: number) {
    onUpdate({ suppliers: answers.suppliers.filter((_, i) => i !== idx) });
  }

  const detailedTotal = answers.suppliers.reduce((s, x) => {
    if (x.isPctOfRevenue) {
      return s + ((x.percentageOfRevenue ?? 0) / 100) * answers.monthlyRevenue;
    }
    return s + x.monthlyAmount;
  }, 0);

  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">איך תרצה להזין הוצאות תפעול?</p>

      <ModeToggle
        mode={answers.expensesMode}
        onChange={(m) => onUpdate({ expensesMode: m })}
        simpleLabel="פשוט - שכירות + תפעול כולל"
        detailedLabel="מפורט - ספק/הוצאה ספציפית"
      />

      {answers.expensesMode === 'simple' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">שכירות חודשית (₪)</label>
            <input
              type="number"
              value={answers.monthlyRent || ''}
              onChange={(e) => onUpdate({ monthlyRent: parseFloat(e.target.value) || 0 })}
              placeholder="0 אם אין"
              className="w-full px-3 py-2 border border-ink/15 bg-paper"
            />
            <p className="text-xs text-ink/60 mt-1">
              ✨ סומן אוטומטית להחלת אינפלציה (חוזה שכ״ד מתעדכן)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              הוצאות תפעול אחרות (₪/חודש)
            </label>
            <input
              type="number"
              value={answers.monthlyOperating || ''}
              onChange={(e) => onUpdate({ monthlyOperating: parseFloat(e.target.value) || 0 })}
              placeholder="לדוגמה: 5000"
              className="w-full px-3 py-2 border border-ink/15 bg-paper"
            />
            <p className="text-xs text-ink/60 mt-1">
              חשמל, תקשורת, תוכנות SaaS, רואה חשבון, ביטוחים, וכו'
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">ספקים והוצאות ({answers.suppliers.length})</span>
            <span className="text-sm text-ink/60">
              סה"כ חודשי: ₪{detailedTotal.toLocaleString('he-IL', { maximumFractionDigits: 0 })}
            </span>
          </div>

          {answers.suppliers.length === 0 ? (
            <div className="text-center py-6 bg-cream-2 border-2 border-dashed border-ink/15">
              <p className="text-sm text-ink/60 mb-2">עוד לא הוספת ספק/הוצאה</p>
              <button
                onClick={addSupplier}
                className="px-3 py-1.5 bg-ink text-cream text-sm flex items-center gap-1 mx-auto"
              >
                <Plus className="w-4 h-4" />
                הוסף ספק/הוצאה
              </button>
            </div>
          ) : (
            <>
              {answers.suppliers.map((sup, idx) => (
                <div key={idx} className="bg-cream-2 border border-ink/15 p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-ink/60 mb-0.5">שם הספק/הוצאה</label>
                      <input
                        type="text"
                        value={sup.name}
                        onChange={(e) => updateSupplier(idx, { name: e.target.value })}
                        placeholder="שכירות / חשמל / תוכנת CRM"
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink/60 mb-0.5">קטגוריה</label>
                      <select
                        value={sup.category}
                        onChange={(e) =>
                          updateSupplier(idx, {
                            category: e.target.value as SupplierExpenseDetail['category'],
                          })
                        }
                        className="w-full px-2 py-1.5 border border-ink/15 bg-paper text-sm"
                      >
                        {(Object.keys(SUPPLIER_CATEGORY_LABELS) as Array<
                          SupplierExpenseDetail['category']
                        >).map((c) => (
                          <option key={c} value={c}>
                            {SUPPLIER_CATEGORY_LABELS[c]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeSupplier(idx)}
                        className="p-1.5 text-red-600 hover:bg-red-50 w-full flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-ink/70">
                      <input
                        type="checkbox"
                        checked={sup.isPctOfRevenue}
                        onChange={(e) =>
                          updateSupplier(idx, { isPctOfRevenue: e.target.checked })
                        }
                        className="w-3.5 h-3.5"
                      />
                      <span>אחוז מהכנסות</span>
                    </label>
                    {sup.isPctOfRevenue ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="number"
                          step="0.5"
                          value={sup.percentageOfRevenue ?? 0}
                          onChange={(e) =>
                            updateSupplier(idx, {
                              percentageOfRevenue: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-20 px-2 py-1 border border-ink/15 bg-paper text-sm"
                        />
                        <span className="text-xs text-ink/60">%</span>
                        <span className="text-xs text-ink/60 mr-2">
                          (≈ ₪
                          {Math.round(
                            ((sup.percentageOfRevenue ?? 0) / 100) * answers.monthlyRevenue,
                          ).toLocaleString('he-IL')}
                          /חודש)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-xs text-ink/60">סכום חודשי:</span>
                        <input
                          type="number"
                          value={sup.monthlyAmount || ''}
                          onChange={(e) =>
                            updateSupplier(idx, {
                              monthlyAmount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-32 px-2 py-1 border border-ink/15 bg-paper text-sm"
                        />
                        <span className="text-xs text-ink/60">₪</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={addSupplier}
                className="w-full p-2 border-2 border-dashed border-ink/15 text-sm text-ink/70 hover:bg-cream-2 flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                הוסף ספק/הוצאה
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SHARED HELPER: Mode Toggle
// ============================================================

function ModeToggle({
  mode,
  onChange,
  simpleLabel,
  detailedLabel,
}: {
  mode: 'simple' | 'detailed';
  onChange: (mode: 'simple' | 'detailed') => void;
  simpleLabel: string;
  detailedLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 bg-cream-2">
      <button
        onClick={() => onChange('simple')}
        className={`p-2 transition text-sm ${
          mode === 'simple'
            ? 'bg-paper shadow text-gold font-bold'
            : 'text-ink/60 hover:text-ink'
        }`}
      >
        ⚡ {simpleLabel}
      </button>
      <button
        onClick={() => onChange('detailed')}
        className={`p-2 transition text-sm ${
          mode === 'detailed'
            ? 'bg-paper shadow text-gold font-bold'
            : 'text-ink/60 hover:text-ink'
        }`}
      >
        📋 {detailedLabel}
      </button>
    </div>
  );
}

function MarketingStep({
  answers,
  onUpdate,
  benchmark,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
  benchmark: { marketingPctOfRevenue: { median: number; low: number; high: number } };
}) {
  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">איך אתה מתכנן את תקציב השיווק?</p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onUpdate({ marketingType: 'pct' })}
          className={`p-3 border-2 transition ${
            answers.marketingType === 'pct'
              ? 'border-gold bg-cream-2 text-ink font-bold'
              : 'border-ink/15 bg-paper hover:border-gold'
          }`}
        >
          📊 אחוז מהכנסות
        </button>
        <button
          onClick={() => onUpdate({ marketingType: 'fixed' })}
          className={`p-3 border-2 transition ${
            answers.marketingType === 'fixed'
              ? 'border-gold bg-cream-2 text-ink font-bold'
              : 'border-ink/15 bg-paper hover:border-gold'
          }`}
        >
          💰 סכום קבוע
        </button>
      </div>

      {answers.marketingType === 'pct' ? (
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            תקציב שיווק (% מהכנסות)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="40"
              step="0.5"
              value={answers.marketingPct}
              onChange={(e) => onUpdate({ marketingPct: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <input
              type="number"
              value={answers.marketingPct}
              onChange={(e) => onUpdate({ marketingPct: parseFloat(e.target.value) || 0 })}
              className="w-20 px-2 py-1 border border-ink/15 bg-paper text-center"
            />
            <span className="text-ink/60">%</span>
          </div>
          <BenchmarkHint
            label="שיווק ענפי"
            low={benchmark.marketingPctOfRevenue.low}
            median={benchmark.marketingPctOfRevenue.median}
            high={benchmark.marketingPctOfRevenue.high}
            unit="%"
            value={answers.marketingPct}
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            תקציב שיווק חודשי (₪)
          </label>
          <input
            type="number"
            value={answers.marketingAmount || ''}
            onChange={(e) => onUpdate({ marketingAmount: parseFloat(e.target.value) || 0 })}
            placeholder="לדוגמה: 5000"
            className="w-full px-3 py-2 border border-ink/15 bg-paper"
          />
        </div>
      )}
    </div>
  );
}

function RndStep({
  answers,
  onUpdate,
  benchmark,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
  benchmark: { rndPctOfRevenue: { median: number; low: number; high: number } };
}) {
  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">
        אם אתה חברת טכנולוגיה או משקיע במחקר ופיתוח, הזן את ה-% מההכנסות.
      </p>

      <div>
        <label className="block text-sm font-medium text-ink/70 mb-2">
          R&D (% מהכנסות) - אופציונלי
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="40"
            step="0.5"
            value={answers.rndPct}
            onChange={(e) => onUpdate({ rndPct: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <input
            type="number"
            value={answers.rndPct}
            onChange={(e) => onUpdate({ rndPct: parseFloat(e.target.value) || 0 })}
            className="w-20 px-2 py-1 border border-ink/15 bg-paper text-center"
          />
          <span className="text-ink/60">%</span>
        </div>
        <BenchmarkHint
          label="R&D ענפי"
          low={benchmark.rndPctOfRevenue.low}
          median={benchmark.rndPctOfRevenue.median}
          high={benchmark.rndPctOfRevenue.high}
          unit="%"
          value={answers.rndPct}
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900">
        💡 הערה: מחקר ופיתוח רלוונטי בעיקר לחברות טכנולוגיה, פארמה, ותעשייה. אם אתה לא בענפים האלה — השאר 0.
      </div>
    </div>
  );
}

function LoansStep({
  answers,
  onUpdate,
}: {
  answers: WizardAnswers;
  onUpdate: (u: Partial<WizardAnswers>) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">האם יש הלוואות פעילות?</p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onUpdate({ hasLoans: false })}
          className={`p-3 border-2 transition ${
            !answers.hasLoans
              ? 'border-gold bg-cream-2 text-ink font-bold'
              : 'border-ink/15 bg-paper hover:border-gold'
          }`}
        >
          ❌ אין הלוואות
        </button>
        <button
          onClick={() => onUpdate({ hasLoans: true })}
          className={`p-3 border-2 transition ${
            answers.hasLoans
              ? 'border-gold bg-cream-2 text-ink font-bold'
              : 'border-ink/15 bg-paper hover:border-gold'
          }`}
        >
          ✓ יש הלוואות
        </button>
      </div>

      {answers.hasLoans && (
        <div className="space-y-3 bg-cream-2 p-4 border border-ink/15">
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">סכום הלוואה (₪)</label>
            <input
              type="number"
              value={answers.loanAmount || ''}
              onChange={(e) => onUpdate({ loanAmount: parseFloat(e.target.value) || 0 })}
              placeholder="לדוגמה: 200000"
              className="w-full px-3 py-2 border border-ink/15 bg-paper"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">
                ריבית שנתית (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={answers.loanRatePct}
                onChange={(e) => onUpdate({ loanRatePct: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-ink/15 bg-paper"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">תקופה (חודשים)</label>
              <input
                type="number"
                value={answers.loanTermMonths}
                onChange={(e) => onUpdate({ loanTermMonths: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 border border-ink/15 bg-paper"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewStep({
  answers,
  summary,
  onApply,
}: {
  answers: WizardAnswers;
  summary: ReturnType<typeof summarizeWizard>;
  onApply: () => void;
}) {
  const fmt = (v: number) => formatCurrency(v, 'ILS');

  return (
    <div className="space-y-4">
      <p className="text-ink/70 text-sm">הנה מה שיצרנו עבורך. בדוק לפני שניצור את התקציב.</p>

      <div className="grid md:grid-cols-2 gap-3">
        <SummaryRow label="חברה" value={answers.companyName || '—'} />
        <SummaryRow label="ענף" value={INDUSTRY_LABELS[answers.industry]} />
        <SummaryRow label="הכנסה חודשית" value={fmt(answers.monthlyRevenue)} />
        <SummaryRow label="הכנסה שנתית" value={fmt(summary.totalAnnualRevenue)} highlight />
        <SummaryRow label="מספר מקורות הכנסה" value={String(answers.numIncomeStreams)} />
        <SummaryRow label="עלות מכר" value={`${answers.cogsPct}% (${fmt(summary.totalAnnualCOGS)})`} />
        <SummaryRow label="מספר עובדים" value={String(answers.numEmployees)} />
        <SummaryRow label="שכר שנתי" value={fmt(summary.totalAnnualSalaries)} />
        <SummaryRow label="שכירות שנתית" value={fmt(answers.monthlyRent * 12)} />
        <SummaryRow
          label="שיווק"
          value={
            answers.marketingType === 'pct'
              ? `${answers.marketingPct}% (${fmt(summary.totalAnnualMarketing)})`
              : fmt(summary.totalAnnualMarketing)
          }
        />
        {answers.rndPct > 0 && (
          <SummaryRow label="R&D" value={`${answers.rndPct}% (${fmt(summary.totalAnnualRnD)})`} />
        )}
        {answers.hasLoans && (
          <SummaryRow
            label="הלוואה"
            value={`${fmt(answers.loanAmount)} ב-${answers.loanRatePct}% למשך ${answers.loanTermMonths} חודשים`}
          />
        )}
      </div>

      {/* Bottom Line */}
      <div
        className={`border-2 p-4 ${
          summary.estimatedAnnualProfit >= 0
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-red-50 border-red-300'
        }`}
      >
        <div className="grid md:grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-xs text-ink/60">רווח שנתי משוער</div>
            <div
              className={`text-3xl font-bold ${
                summary.estimatedAnnualProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {fmt(summary.estimatedAnnualProfit)}
            </div>
          </div>
          <div>
            <div className="text-xs text-ink/60">מרווח נקי משוער</div>
            <div
              className={`text-3xl font-bold ${
                summary.estimatedNetMargin >= 0 ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {summary.estimatedNetMargin.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {summary.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded p-3">
          <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            התראות
          </h4>
          <ul className="text-sm text-amber-900 space-y-1">
            {summary.warnings.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-cream-2 border border-ink/15 p-3 text-sm text-ink">
        💡 לאחר יצירת התקציב, תוכל לערוך כל פריט בנפרד במערכת המאוחדת. זוהי רק נקודת התחלה.
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-2 px-3 ${
        highlight ? 'bg-cream-2 border border-gold font-bold' : 'bg-cream-2'
      }`}
    >
      <span className="text-sm text-ink/70">{label}:</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function BenchmarkHint({
  label,
  low,
  median,
  high,
  unit,
  value,
}: {
  label: string;
  low: number;
  median: number;
  high: number;
  unit: string;
  value: number;
}) {
  let position = 'median';
  let color = 'emerald';
  if (value < low) {
    position = 'מתחת לטווח';
    color = 'red';
  } else if (value < median) {
    position = 'מתחת לחציון';
    color = 'amber';
  } else if (value < high) {
    position = 'מעל החציון';
    color = 'emerald';
  } else {
    position = 'מעל אחוזון 75';
    color = 'emerald';
  }

  return (
    <div className={`mt-2 text-xs text-${color}-700`}>
      📊 {label}: Q1 {low.toFixed(0)}{unit} | חציון {median.toFixed(0)}{unit} | Q3 {high.toFixed(0)}
      {unit} → אתה: <strong>{position}</strong>
    </div>
  );
}
