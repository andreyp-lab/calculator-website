'use client';

import { useState, useMemo } from 'react';
import {
  valuateDCF,
  calculateWACC,
  calculateCostOfEquity,
  buildDCFSensitivityMatrix,
  buildValuationRange,
  extractFCFsFromModel,
} from '@/lib/tools/dcf-engine';
import {
  buildThreeStatementModel,
  defaultAssumptions,
  createEmptyAnnualStatements,
  recomputePnL,
  recomputeBalanceSheet,
  convertBudgetToBaseYear,
  suggestAssumptions,
} from '@/lib/tools/three-statement-model';
import { useTools } from '@/lib/tools/ToolsContext';
import type { DCFInput, ThreeStatementModel } from '@/lib/tools/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Gem, Upload, Calculator, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'dcf-valuation-v1';

interface DCFFormState {
  // FCFs (manual or from model)
  fcfs: number[];
  netDebt: number;
  sharesOutstanding: number;
  // WACC inputs
  riskFreeRate: number;
  beta: number;
  equityRiskPremium: number;
  costOfDebt: number;
  taxRate: number;
  debtWeight: number;
  equityWeight: number;
  // Terminal
  terminalGrowthRate: number;
  terminalMethod: 'gordon' | 'exit_multiple';
  exitMultiple: number;
  finalEbitda: number;
}

const defaultState: DCFFormState = {
  fcfs: [100000, 130000, 165000, 200000, 240000],
  netDebt: 200000,
  sharesOutstanding: 1000000,
  riskFreeRate: 4.5,
  beta: 1.2,
  equityRiskPremium: 6.5,
  costOfDebt: 7.5,
  taxRate: 23,
  debtWeight: 30,
  equityWeight: 70,
  terminalGrowthRate: 2.5,
  terminalMethod: 'gordon',
  exitMultiple: 8,
  finalEbitda: 300000,
};

export function DCFValuation() {
  const { budget, settings, balanceSheet } = useTools();
  const [state, setState] = useState<DCFFormState>(() => {
    if (typeof window === 'undefined') return defaultState;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultState, ...JSON.parse(raw) };
    } catch {}
    return defaultState;
  });

  function update(patch: Partial<DCFFormState>) {
    setState((prev) => {
      const next = { ...prev, ...patch };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

  function loadFCFsFromBudget() {
    if (!budget || !settings) return;
    try {
      const baseYear = convertBudgetToBaseYear(budget, settings, balanceSheet);
      const assumptions = suggestAssumptions([baseYear], 5);
      const model = buildThreeStatementModel([baseYear], assumptions);
      const fcfs = extractFCFsFromModel(model, state.taxRate);
      const totalDebt = (model.projected[0]?.balanceSheet.shortTermDebt ?? 0) +
        (model.projected[0]?.balanceSheet.longTermDebt ?? 0);
      const cash = model.projected[0]?.balanceSheet.cash ?? 0;
      const netDebt = totalDebt - cash;
      update({
        fcfs,
        netDebt,
        finalEbitda: model.projected[model.projected.length - 1].pnl.ebitda,
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Derived
  const wacc = useMemo(() => calculateWACC(state), [state]);
  const ce = useMemo(() => calculateCostOfEquity(state), [state]);

  const dcfInput: DCFInput = {
    freeCashFlows: state.fcfs,
    wacc,
    terminalGrowthRate: state.terminalGrowthRate,
    terminalMethod: state.terminalMethod,
    netDebt: state.netDebt,
    sharesOutstanding: state.sharesOutstanding,
    exitMultiple: state.exitMultiple,
    finalEbitda: state.finalEbitda,
  };

  let result: ReturnType<typeof valuateDCF> | null = null;
  let valuationRange: ReturnType<typeof buildValuationRange> | null = null;
  let sensitivity: ReturnType<typeof buildDCFSensitivityMatrix> | null = null;
  let error: string | null = null;
  try {
    result = valuateDCF(dcfInput);
    valuationRange = buildValuationRange(dcfInput, 1, 0.5);
    sensitivity = buildDCFSensitivityMatrix(dcfInput);
  } catch (e: any) {
    error = e.message;
  }

  function updateFCF(idx: number, value: number) {
    const next = [...state.fcfs];
    next[idx] = value;
    update({ fcfs: next });
  }

  function addFCFYear() {
    update({ fcfs: [...state.fcfs, 0] });
  }

  function removeFCFYear() {
    if (state.fcfs.length > 1) {
      update({ fcfs: state.fcfs.slice(0, -1) });
    }
  }

  const fmt = (v: number) =>
    Math.abs(v) > 1000000
      ? `${(v / 1000000).toFixed(2)}M`
      : Math.abs(v) > 1000
        ? `${(v / 1000).toFixed(0)}K`
        : v.toFixed(0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            הערכת שווי DCF (Discounted Cash Flow)
          </h3>
          <p className="text-xs text-rose-100">
            נכוס תזרימי מזומנים חופשיים → Enterprise Value → Equity Value
          </p>
        </div>
      </div>

      {/* Top: Result Summary */}
      {result && valuationRange && (
        <div className="grid md:grid-cols-3 gap-3">
          <SummaryCard
            label="Enterprise Value (EV)"
            value={fmt(result.enterpriseValue)}
            color="indigo"
            sub={`${(result.terminalValueShare * 100).toFixed(0)}% מ-Terminal`}
          />
          <SummaryCard
            label="Equity Value"
            value={fmt(result.equityValue)}
            color="emerald"
            sub={`טווח: ${fmt(valuationRange.lowEquity)} – ${fmt(valuationRange.highEquity)}`}
          />
          {result.pricePerShare !== undefined && (
            <SummaryCard
              label="Price per Share"
              value={`₪${result.pricePerShare.toFixed(2)}`}
              color="rose"
              sub={`${state.sharesOutstanding.toLocaleString()} מניות`}
            />
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded p-3 text-red-900 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Inputs grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* WACC */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-blue-600 text-white p-2 text-sm font-bold">
            WACC Calculator (CAPM)
          </div>
          <div className="p-3 space-y-2 text-sm">
            <Field label="Risk-Free Rate (%) - אג״ח 10 שנים" value={state.riskFreeRate} onChange={(v) => update({ riskFreeRate: v })} step={0.1} />
            <Field label="Beta (β)" value={state.beta} onChange={(v) => update({ beta: v })} step={0.05} />
            <Field label="Equity Risk Premium (%)" value={state.equityRiskPremium} onChange={(v) => update({ equityRiskPremium: v })} step={0.1} />
            <div className="bg-blue-50 rounded p-2 text-xs">
              <div className="flex justify-between">
                <span>Cost of Equity (Re):</span>
                <strong>{ce.toFixed(2)}%</strong>
              </div>
            </div>
            <Field label="Cost of Debt (%) - לפני מס" value={state.costOfDebt} onChange={(v) => update({ costOfDebt: v })} step={0.1} />
            <Field label="Tax Rate (%)" value={state.taxRate} onChange={(v) => update({ taxRate: v })} step={1} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Equity Weight (%)" value={state.equityWeight} onChange={(v) => update({ equityWeight: v })} />
              <Field label="Debt Weight (%)" value={state.debtWeight} onChange={(v) => update({ debtWeight: v })} />
            </div>
            <div className="bg-blue-100 border-2 border-blue-300 rounded p-2 text-center">
              <div className="text-xs text-blue-700">WACC</div>
              <div className="text-2xl font-bold text-blue-900">{wacc.toFixed(2)}%</div>
            </div>
          </div>
        </div>

        {/* FCFs */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-600 text-white p-2 text-sm font-bold flex items-center justify-between">
            <span>Free Cash Flows (לפי שנה)</span>
            {budget && settings && (
              <button
                onClick={loadFCFsFromBudget}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                טען מהתקציב
              </button>
            )}
          </div>
          <div className="p-3 space-y-2 text-sm">
            {state.fcfs.map((fcf, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-16">שנה {i + 1}:</span>
                <input
                  type="number"
                  value={fcf}
                  onChange={(e) => updateFCF(i, parseFloat(e.target.value) || 0)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
            <div className="flex gap-1">
              <button
                onClick={addFCFYear}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                + שנה
              </button>
              <button
                onClick={removeFCFYear}
                className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
              >
                − שנה
              </button>
            </div>
            <Field label="Net Debt (חוב − מזומן)" value={state.netDebt} onChange={(v) => update({ netDebt: v })} />
            <Field label="מספר מניות" value={state.sharesOutstanding} onChange={(v) => update({ sharesOutstanding: v })} />
          </div>
        </div>
      </div>

      {/* Terminal Value */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-purple-600 text-white p-2 text-sm font-bold">
          Terminal Value (חישוב שווי שייר)
        </div>
        <div className="p-3 grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-700 mb-1">שיטה</label>
            <select
              value={state.terminalMethod}
              onChange={(e) => update({ terminalMethod: e.target.value as 'gordon' | 'exit_multiple' })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="gordon">Gordon Growth (FCF × (1+g) / (r-g))</option>
              <option value="exit_multiple">Exit Multiple (EBITDA × Multiple)</option>
            </select>
          </div>
          {state.terminalMethod === 'gordon' ? (
            <Field label="Terminal Growth Rate (%)" value={state.terminalGrowthRate} onChange={(v) => update({ terminalGrowthRate: v })} step={0.1} />
          ) : (
            <>
              <Field label="Exit EBITDA Multiple" value={state.exitMultiple} onChange={(v) => update({ exitMultiple: v })} step={0.5} />
              <Field label="EBITDA שנה אחרונה" value={state.finalEbitda} onChange={(v) => update({ finalEbitda: v })} />
            </>
          )}
        </div>
      </div>

      {/* Result Breakdown */}
      {result && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-indigo-600 text-white p-2 text-sm font-bold">
            פירוט החישוב
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold mb-1">PV של FCFs מפורשים</h5>
                <div className="space-y-1">
                  {result.pvOfExplicitCashFlows.map((pv, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>שנה {i + 1}: {fmt(state.fcfs[i])} → PV</span>
                      <span className="font-semibold">{fmt(pv)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 border-t font-bold">
                    <span>סה"כ PV מפורש:</span>
                    <span>{fmt(result.sumOfExplicitPV)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-1">Terminal Value</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>TV (גולמי):</span>
                    <span className="font-semibold">{fmt(result.terminalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PV של TV:</span>
                    <span className="font-semibold">{fmt(result.pvOfTerminalValue)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t font-bold">
                    <span>אחוז מ-EV:</span>
                    <span>{(result.terminalValueShare * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="mt-2 bg-indigo-50 rounded p-2 space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Enterprise Value:</span>
                    <span>{fmt(result.enterpriseValue)}</span>
                  </div>
                  <div className="flex justify-between text-red-700">
                    <span>− Net Debt:</span>
                    <span>{fmt(state.netDebt)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1 text-emerald-700">
                    <span>= Equity Value:</span>
                    <span>{fmt(result.equityValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sensitivity Matrix */}
      {sensitivity && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-amber-600 text-white p-2 text-sm font-bold">
            מטריצת רגישות: WACC × Terminal Growth
          </div>
          <div className="p-3 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border p-1 bg-gray-100">WACC \ g</th>
                  {sensitivity[0].map((cell, i) => (
                    <th key={i} className="border p-1 bg-gray-100">
                      {cell.growth.toFixed(1)}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sensitivity.map((row, i) => (
                  <tr key={i}>
                    <td className="border p-1 bg-gray-100 font-bold text-center">
                      {row[0].wacc.toFixed(1)}%
                    </td>
                    {row.map((cell, j) => {
                      const isBaseRow = i === 2 && j === 2;
                      return (
                        <td
                          key={j}
                          className={`border p-1 text-center ${
                            isBaseRow
                              ? 'bg-amber-200 font-bold'
                              : Number.isNaN(cell.equityValue)
                                ? 'bg-red-50 text-red-600'
                                : ''
                          }`}
                        >
                          {Number.isNaN(cell.equityValue) ? '—' : fmt(cell.equityValue)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-700 mb-0.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step ?? 1}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: 'indigo' | 'emerald' | 'rose';
  sub?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    indigo: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
    emerald: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    rose: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} border-2 rounded-lg p-3`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      {sub && <div className="text-[10px] text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}
