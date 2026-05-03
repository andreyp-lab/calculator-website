'use client';

import { useState, useMemo } from 'react';
import { calculateFamilyBudget, type FamilyBudgetInput } from '@/lib/calculators/savings';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

const initialInput: FamilyBudgetInput = {
  primaryIncome: 18000,
  secondaryIncome: 12000,
  additionalIncome: 0,
  housing: 7000,
  utilities: 1200,
  insurance: 1500,
  food: 4000,
  transportation: 2000,
  education: 2500,
  healthcare: 800,
  entertainment: 1500,
  other: 1000,
  savings: 3000,
  pension: 2500,
};

export function FamilyBudgetCalculator() {
  const [input, setInput] = useState<FamilyBudgetInput>(initialInput);

  const result = useMemo(() => calculateFamilyBudget(input), [input]);

  function update<K extends keyof FamilyBudgetInput>(field: K, value: FamilyBudgetInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  const StatusIcon =
    result.status === 'excellent'
      ? CheckCircle2
      : result.status === 'good'
        ? TrendingUp
        : result.status === 'warning'
          ? AlertTriangle
          : AlertCircle;

  const statusColors = {
    excellent: 'bg-green-50 border-green-300 text-green-800',
    good: 'bg-blue-50 border-blue-300 text-blue-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    danger: 'bg-red-50 border-red-300 text-red-800',
  };

  const statusText = {
    excellent: 'מעולה! חיסכון מעל 20%',
    good: 'טוב - חיסכון 10-20%',
    warning: 'זהירות - חיסכון נמוך',
    danger: 'אזהרה! יוצאים בלי לחסוך',
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Income */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
          <h3 className="font-bold text-green-900 mb-4">💰 הכנסות (נטו)</h3>
          <div className="space-y-3">
            <InputField
              label="הכנסה ראשונית (אחד מבני הזוג)"
              value={input.primaryIncome}
              onChange={(v) => update('primaryIncome', v)}
            />
            <InputField
              label="הכנסה משנית (בן/בת זוג)"
              value={input.secondaryIncome}
              onChange={(v) => update('secondaryIncome', v)}
            />
            <InputField
              label="הכנסות נוספות (שכ&quot;ד, אחר)"
              value={input.additionalIncome}
              onChange={(v) => update('additionalIncome', v)}
            />
            <div className="bg-white rounded p-3 mt-3 border-2 border-green-300">
              <div className="flex justify-between font-bold text-green-900">
                <span>סה&quot;כ הכנסות</span>
                <span>{formatCurrency(result.totalIncome)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Expenses */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
          <h3 className="font-bold text-red-900 mb-4">🏠 הוצאות קבועות</h3>
          <div className="space-y-3">
            <InputField
              label="משכנתא / שכר דירה"
              value={input.housing}
              onChange={(v) => update('housing', v)}
            />
            <InputField
              label="חשבונות (חשמל, מים, אינטרנט)"
              value={input.utilities}
              onChange={(v) => update('utilities', v)}
            />
            <InputField
              label="ביטוחים (חיים, רכב, דירה)"
              value={input.insurance}
              onChange={(v) => update('insurance', v)}
            />
            <div className="bg-white rounded p-3 mt-3 border-2 border-red-300">
              <div className="flex justify-between font-bold text-red-900">
                <span>סה&quot;כ הוצאות קבועות</span>
                <span>{formatCurrency(result.totalFixedExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Variable Expenses */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-900 mb-4">🛒 הוצאות משתנות</h3>
          <div className="space-y-3">
            <InputField
              label="אוכל וקניות"
              value={input.food}
              onChange={(v) => update('food', v)}
            />
            <InputField
              label="תחבורה ודלק"
              value={input.transportation}
              onChange={(v) => update('transportation', v)}
            />
            <InputField
              label="חינוך וחוגים"
              value={input.education}
              onChange={(v) => update('education', v)}
            />
            <InputField
              label="בריאות ורופאים"
              value={input.healthcare}
              onChange={(v) => update('healthcare', v)}
            />
            <InputField
              label="בילויים וחופשות"
              value={input.entertainment}
              onChange={(v) => update('entertainment', v)}
            />
            <InputField
              label="אחר"
              value={input.other}
              onChange={(v) => update('other', v)}
            />
            <div className="bg-white rounded p-3 mt-3 border-2 border-amber-300">
              <div className="flex justify-between font-bold text-amber-900">
                <span>סה&quot;כ הוצאות משתנות</span>
                <span>{formatCurrency(result.totalVariableExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 mb-4">💎 חיסכון והשקעות</h3>
          <div className="space-y-3">
            <InputField
              label="חיסכון חודשי"
              value={input.savings}
              onChange={(v) => update('savings', v)}
            />
            <InputField
              label="הפרשה לפנסיה"
              value={input.pension}
              onChange={(v) => update('pension', v)}
            />
            <div className="bg-white rounded p-3 mt-3 border-2 border-blue-300">
              <div className="flex justify-between font-bold text-blue-900">
                <span>סה&quot;כ חיסכון</span>
                <span>{formatCurrency(result.totalSavings)}</span>
              </div>
              <div className="text-xs text-blue-700 mt-1">
                שיעור חיסכון: {formatPercent(result.savingsRate / 100, 1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={`border-2 rounded-xl p-5 ${statusColors[result.status]}`}>
        <div className="flex items-start gap-3">
          <StatusIcon className="w-8 h-8 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1">{statusText[result.status]}</h3>
            <p className="text-sm">
              נשאר במאזן: <strong>{formatCurrency(result.netCashFlow)}/חודש</strong>
              {result.netCashFlow < 0 && ' - אתה יוצא במינוס!'}
              {result.netCashFlow > 0 && result.totalSavings === 0 && ' - יש כסף שלא חוסך!'}
            </p>
          </div>
        </div>
      </div>

      {/* 50/30/20 Rule */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">📊 ניתוח לפי כלל 50/30/20</h3>
        <p className="text-sm text-gray-600 mb-4">
          הכלל מומלץ: 50% צרכים, 30% רצונות, 20% חיסכון
        </p>
        <div className="space-y-3">
          <RuleBar
            label="צרכים (דיור, חשבונות, אוכל)"
            actual={result.rule503020.needs.actual}
            recommended={result.rule503020.needs.recommended}
            pct={result.rule503020.needs.pct}
            target={50}
            color="red"
          />
          <RuleBar
            label="רצונות (בילויים, חינוך, אחר)"
            actual={result.rule503020.wants.actual}
            recommended={result.rule503020.wants.recommended}
            pct={result.rule503020.wants.pct}
            target={30}
            color="amber"
          />
          <RuleBar
            label="חיסכון והשקעות"
            actual={result.rule503020.savings.actual}
            recommended={result.rule503020.savings.recommended}
            pct={result.rule503020.savings.pct}
            target={20}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
      />
    </div>
  );
}

function RuleBar({
  label,
  actual,
  recommended,
  pct,
  target,
  color,
}: {
  label: string;
  actual: number;
  recommended: number;
  pct: number;
  target: number;
  color: 'red' | 'amber' | 'green';
}) {
  const isOverBy = pct - target;
  const isOver = color === 'green' ? isOverBy < -2 : isOverBy > 2; // negative for "needs" if higher is bad
  const colorClasses = {
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs">
          {formatCurrency(actual)} ({pct.toFixed(1)}%) | יעד: {target}%
        </span>
      </div>
      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
