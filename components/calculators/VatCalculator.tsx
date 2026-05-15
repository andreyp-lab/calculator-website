'use client';

import { useState, useMemo, useId } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

import {
  calculateVat,
  calculateAddVat,
  calculateExtractVat,
  calculateNetFromTotal,
  calculateBimonthlyReport,
  calculateYearComparison,
  calculateDiscountScenario,
  calculateImportVat,
  getOperatorRules,
  summarizeInvoices,
  INDUSTRY_VAT_RULES,
  EXEMPT_THRESHOLD_2026,
  VAT_RATES,
  type VatMode,
  type OperatorType,
  type InvoiceItem,
  type IndustryVatKey,
} from '@/lib/calculators/vat';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

// ============================================================
// Types
// ============================================================

type MainTab = 'basic' | 'bimonthly' | 'tracker' | 'scenarios' | 'operator' | 'compare';

// ============================================================
// Helpers
// ============================================================

const TAB_LABELS: Record<MainTab, string> = {
  basic: 'חישוב מע"מ',
  bimonthly: 'דוח דו-חודשי',
  tracker: 'מעקב חשבוניות',
  scenarios: 'תרחישים',
  operator: 'סוג עוסק',
  compare: 'השוואת שנים',
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// ============================================================
// Basic VAT tab
// ============================================================

type BasicMode = 'add' | 'extract' | 'net-from-total';

function BasicVatTab() {
  const [mode, setMode] = useState<BasicMode>('add');
  const [amount, setAmount] = useState(1000);
  const [ratePercent, setRatePercent] = useState(18);
  const rate = ratePercent / 100;

  const result = useMemo(() => {
    if (mode === 'add') return calculateAddVat(amount, rate);
    if (mode === 'extract') return calculateExtractVat(amount, rate);
    return null;
  }, [mode, amount, rate]);

  const netResult = useMemo(() => {
    if (mode !== 'net-from-total') return null;
    return calculateNetFromTotal(amount, rate);
  }, [mode, amount, rate]);

  const pieData = useMemo(() => {
    if (result) {
      return [
        { name: 'סכום ללא מע"מ', value: Math.round(result.amountWithoutVat) },
        { name: 'מע"מ', value: Math.round(result.vatAmount) },
      ];
    }
    if (netResult) {
      return [
        { name: 'נטו', value: Math.round(netResult.net) },
        { name: 'מע"מ', value: Math.round(netResult.vatAmount) },
      ];
    }
    return [];
  }, [result, netResult]);

  const modes: { key: BasicMode; label: string; sub: string }[] = [
    { key: 'add', label: 'הוספת מע"מ', sub: 'נטו → ברוטו' },
    { key: 'extract', label: 'חילוץ מע"מ', sub: 'ברוטו → נטו' },
    { key: 'net-from-total', label: 'נטו מסכום כולל', sub: 'כמה מע"מ מסתתר?' },
  ];

  const amountLabel =
    mode === 'add'
      ? 'סכום ללא מע"מ (₪)'
      : mode === 'extract'
      ? 'סכום כולל מע"מ (₪)'
      : 'סכום כולל מע"מ (₪)';

  const mainValue = result
    ? mode === 'add'
      ? result.amountWithVat
      : result.amountWithoutVat
    : netResult?.net ?? 0;

  const mainLabel = result
    ? mode === 'add'
      ? 'סכום סופי כולל מע"מ'
      : 'סכום ללא מע"מ'
    : 'נטו (ללא מע"מ)';

  const vatAmountDisplay = result?.vatAmount ?? netResult?.vatAmount ?? 0;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Inputs */}
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי החישוב</h2>

        {/* Mode selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">סוג חישוב</label>
          <div className="grid grid-cols-3 gap-2">
            {modes.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`px-3 py-3 rounded-lg border-2 transition text-right text-sm ${
                  mode === m.key
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-bold text-sm mb-0.5">{m.label}</div>
                <div className="text-xs text-gray-500">{m.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">{amountLabel}</label>
          <input
            type="number"
            min={0}
            step={100}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg text-right"
          />
        </div>

        {/* Rate */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">שיעור מע&quot;מ (%)</label>
          <div className="flex gap-2 mb-2">
            {[0, 17, 18].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRatePercent(r)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                  ratePercent === r
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
          <input
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={ratePercent}
            onChange={(e) => setRatePercent(Math.max(0, Math.min(50, Number(e.target.value))))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">שיעור רגיל ב-2026: 18% | 0% ליצוא ותיירות</p>
        </div>

        {/* Formula explanation */}
        <div className="bg-blue-50 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-900 mb-1">נוסחה</p>
          {mode === 'add' && (
            <p className="text-blue-800 font-mono">
              {formatCurrency(amount)} × 1.{ratePercent} ={' '}
              {formatCurrency(amount * (1 + rate))}
            </p>
          )}
          {(mode === 'extract' || mode === 'net-from-total') && (
            <p className="text-blue-800 font-mono">
              {formatCurrency(amount)} ÷ 1.{ratePercent} ={' '}
              {formatCurrency(rate === 0 ? amount : amount / (1 + rate))}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title={mainLabel}
          value={formatCurrency(mainValue)}
          subtitle={`מע"מ ${ratePercent}%`}
          variant="success"
        />

        <ResultCard
          title='סכום המע"מ'
          value={formatCurrency(vatAmountDisplay)}
          subtitle={`${formatPercent(rate / (1 + rate))} מהסכום הכולל`}
          variant="primary"
        />

        {/* Breakdown */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">פירוט</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">סכום ללא מע&quot;מ:</dt>
              <dd className="font-medium">
                {formatCurrency(result?.amountWithoutVat ?? netResult?.net ?? 0)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">מע&quot;מ ({ratePercent}%):</dt>
              <dd className="font-medium">{formatCurrency(vatAmountDisplay)}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
              <dt className="text-gray-900">סה&quot;כ עם מע&quot;מ:</dt>
              <dd className="text-gray-900">
                {formatCurrency(
                  result?.amountWithVat ??
                    (netResult ? netResult.net + netResult.vatAmount : 0),
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Pie chart */}
        {vatAmountDisplay > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">חלוקת הסכום</h4>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Bimonthly Report tab
// ============================================================

type InvoiceRow = {
  id: string;
  description: string;
  amount: string;
  vatRatePercent: string;
  type: 'output' | 'input';
};

function BimonthlyTab() {
  const [invoiceRows, setInvoiceRows] = useState<InvoiceRow[]>([
    { id: '1', description: 'פרויקט לקוח', amount: '5000', vatRatePercent: '18', type: 'output' },
    { id: '2', description: 'שירותי ייעוץ', amount: '3000', vatRatePercent: '18', type: 'output' },
    { id: '3', description: 'רכישת ציוד', amount: '2000', vatRatePercent: '18', type: 'input' },
    { id: '4', description: 'שכירות משרד', amount: '1500', vatRatePercent: '18', type: 'input' },
  ]);
  const [annualRevenue, setAnnualRevenue] = useState(0);

  const invoices: InvoiceItem[] = useMemo(
    () =>
      invoiceRows
        .filter((r) => Number(r.amount) > 0)
        .map((r) => ({
          id: r.id,
          description: r.description,
          amount: Number(r.amount),
          vatRate: Number(r.vatRatePercent) / 100,
          type: r.type,
        })),
    [invoiceRows],
  );

  const report = useMemo(
    () => calculateBimonthlyReport({ invoices, annualRevenueToDate: annualRevenue }),
    [invoices, annualRevenue],
  );

  function addRow(type: 'output' | 'input') {
    setInvoiceRows((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: '',
        amount: '',
        vatRatePercent: '18',
        type,
      },
    ]);
  }

  function updateRow(id: string, field: keyof InvoiceRow, value: string) {
    setInvoiceRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function removeRow(id: string) {
    setInvoiceRows((prev) => prev.filter((r) => r.id !== id));
  }

  const outputRows = invoiceRows.filter((r) => r.type === 'output');
  const inputRows = invoiceRows.filter((r) => r.type === 'input');

  return (
    <div className="space-y-6">
      {report.exemptThresholdWarning && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
          <p className="font-semibold text-amber-800">
            ⚠ אזהרה: מחזור שנתי משוער ({formatCurrency(report.projectedAnnualRevenue)}) חורג מתקרת
            עוסק פטור ({formatCurrency(EXEMPT_THRESHOLD_2026)})
          </p>
          <p className="text-amber-700 text-sm mt-1">
            אם אינך עוסק מורשה — עליך להירשם כעוסק מורשה בתוך 90 יום מהחריגה.
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-xs text-green-700 font-medium mb-1">מע&quot;מ עסקאות (Output)</p>
          <p className="text-2xl font-bold text-green-800">{formatCurrency(report.outputVat)}</p>
          <p className="text-xs text-green-600 mt-0.5">בסיס: {formatCurrency(report.outputBase)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-700 font-medium mb-1">מע&quot;מ תשומות (Input)</p>
          <p className="text-2xl font-bold text-blue-800">{formatCurrency(report.inputVat)}</p>
          <p className="text-xs text-blue-600 mt-0.5">בסיס: {formatCurrency(report.inputBase)}</p>
        </div>
        <div
          className={`border rounded-lg p-4 text-center ${
            report.isRefund
              ? 'bg-purple-50 border-purple-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p
            className={`text-xs font-medium mb-1 ${
              report.isRefund ? 'text-purple-700' : 'text-red-700'
            }`}
          >
            {report.isRefund ? 'החזר מע"מ' : 'לתשלום'}
          </p>
          <p
            className={`text-2xl font-bold ${
              report.isRefund ? 'text-purple-800' : 'text-red-800'
            }`}
          >
            {formatCurrency(Math.abs(report.netVatDue))}
          </p>
          <p className={`text-xs mt-0.5 ${report.isRefund ? 'text-purple-600' : 'text-red-600'}`}>
            {report.isRefund ? 'זכות להחזר' : 'חיוב לרשות המסים'}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-700 font-medium mb-1">מחזור תקופה</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(report.outputBase)}</p>
          <p className="text-xs text-gray-600 mt-0.5">כולל מע&quot;מ: {formatCurrency(report.outputGross)}</p>
        </div>
      </div>

      {/* Input invoices (output VAT) */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">עסקאות (מע&quot;מ עסקאות — Output)</h3>
          <button
            type="button"
            onClick={() => addRow('output')}
            className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
          >
            + הוסף עסקה
          </button>
        </div>
        <InvoiceTable rows={outputRows} onUpdate={updateRow} onRemove={removeRow} />
      </div>

      {/* Input invoices (input VAT) */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">תשומות (מע&quot;מ תשומות — Input)</h3>
          <button
            type="button"
            onClick={() => addRow('input')}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            + הוסף תשומה
          </button>
        </div>
        <InvoiceTable rows={inputRows} onUpdate={updateRow} onRemove={removeRow} />
      </div>

      {/* Annual revenue */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          מחזור שנתי עד כה (₪) — לבדיקת תקרת עוסק פטור
        </label>
        <input
          type="number"
          min={0}
          step={1000}
          value={annualRevenue}
          onChange={(e) => setAnnualRevenue(Math.max(0, Number(e.target.value)))}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-right"
        />
        <p className="text-xs text-gray-500 mt-1">
          תקרת עוסק פטור: {formatCurrency(EXEMPT_THRESHOLD_2026)} לשנה
        </p>
      </div>

      {/* Chart */}
      {(report.outputVat > 0 || report.inputVat > 0) && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">תרשים: עסקאות מול תשומות</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { name: 'בסיס (ללא מע"מ)', output: Math.round(report.outputBase), input: Math.round(report.inputBase) },
                { name: 'מע"מ', output: Math.round(report.outputVat), input: Math.round(report.inputVat) },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => formatCurrency(Number(v))} width={90} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Bar dataKey="output" name='עסקאות' fill="#10b981" />
              <Bar dataKey="input" name='תשומות' fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function InvoiceTable({
  rows,
  onUpdate,
  onRemove,
}: {
  rows: InvoiceRow[];
  onUpdate: (id: string, field: keyof InvoiceRow, value: string) => void;
  onRemove: (id: string) => void;
}) {
  if (rows.length === 0) {
    return <p className="text-gray-400 text-sm py-2">אין פריטים. לחץ &quot;הוסף&quot; להוספה.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-right text-gray-600 border-b border-gray-200">
            <th className="pb-2 font-medium">תיאור</th>
            <th className="pb-2 font-medium w-28">סכום ₪</th>
            <th className="pb-2 font-medium w-20">מע&quot;מ %</th>
            <th className="pb-2 font-medium w-20">סה&quot;כ</th>
            <th className="pb-2 w-8"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="py-1.5 pl-2">
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => onUpdate(row.id, 'description', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-right text-xs"
                  placeholder="תיאור"
                />
              </td>
              <td className="py-1.5 px-1">
                <input
                  type="number"
                  min={0}
                  value={row.amount}
                  onChange={(e) => onUpdate(row.id, 'amount', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-right text-xs"
                />
              </td>
              <td className="py-1.5 px-1">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={row.vatRatePercent}
                  onChange={(e) => onUpdate(row.id, 'vatRatePercent', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-right text-xs"
                />
              </td>
              <td className="py-1.5 px-1 text-right font-medium">
                {Number(row.amount) > 0
                  ? formatCurrency(
                      Number(row.amount) * (1 + Number(row.vatRatePercent) / 100),
                    )
                  : '—'}
              </td>
              <td className="py-1.5">
                <button
                  type="button"
                  onClick={() => onRemove(row.id)}
                  className="text-red-400 hover:text-red-600 text-lg leading-none"
                  title="מחק שורה"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// Invoice Tracker tab
// ============================================================

function TrackerTab() {
  const [invoiceRows, setInvoiceRows] = useState<InvoiceRow[]>([]);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickType, setQuickType] = useState<'output' | 'input'>('output');

  const invoices: InvoiceItem[] = useMemo(
    () =>
      invoiceRows
        .filter((r) => Number(r.amount) > 0)
        .map((r) => ({
          id: r.id,
          description: r.description,
          amount: Number(r.amount),
          vatRate: Number(r.vatRatePercent) / 100,
          type: r.type,
        })),
    [invoiceRows],
  );

  const summary = useMemo(() => summarizeInvoices(invoices), [invoices]);

  function addQuick() {
    const val = Number(quickAmount);
    if (val <= 0) return;
    setInvoiceRows((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: quickType === 'output' ? 'עסקה' : 'תשומה',
        amount: quickAmount,
        vatRatePercent: '18',
        type: quickType,
      },
    ]);
    setQuickAmount('');
  }

  function removeRow(id: string) {
    setInvoiceRows((prev) => prev.filter((r) => r.id !== id));
  }

  const pieData = [
    { name: 'עסקאות (נטו)', value: Math.round(summary.byType.output.netAmount) },
    { name: 'מע"מ עסקאות', value: Math.round(summary.byType.output.vatAmount) },
    { name: 'תשומות (נטו)', value: Math.round(summary.byType.input.netAmount) },
    { name: 'מע"מ תשומות', value: Math.round(summary.byType.input.vatAmount) },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">הוספה מהירה</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQuickType('output')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                quickType === 'output'
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              עסקה
            </button>
            <button
              type="button"
              onClick={() => setQuickType('input')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                quickType === 'input'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              תשומה
            </button>
          </div>
          <input
            type="number"
            min={0}
            placeholder="סכום ₪"
            value={quickAmount}
            onChange={(e) => setQuickAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addQuick()}
            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg text-right"
          />
          <button
            type="button"
            onClick={addQuick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            הוסף
          </button>
        </div>
      </div>

      {invoiceRows.length > 0 ? (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-xs text-green-700 mb-1">עסקאות (כולל מע&quot;מ)</p>
              <p className="text-xl font-bold text-green-800">
                {formatCurrency(summary.byType.output.grossAmount)}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-700 mb-1">תשומות (כולל מע&quot;מ)</p>
              <p className="text-xl font-bold text-blue-800">
                {formatCurrency(summary.byType.input.grossAmount)}
              </p>
            </div>
            <div className={`border rounded-lg p-3 text-center ${summary.netVatPosition >= 0 ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200'}`}>
              <p className={`text-xs mb-1 ${summary.netVatPosition >= 0 ? 'text-red-700' : 'text-purple-700'}`}>
                {summary.netVatPosition >= 0 ? 'לתשלום' : 'להחזר'}
              </p>
              <p className={`text-xl font-bold ${summary.netVatPosition >= 0 ? 'text-red-800' : 'text-purple-800'}`}>
                {formatCurrency(Math.abs(summary.netVatPosition))}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-700 mb-1">חשבוניות</p>
              <p className="text-xl font-bold text-gray-800">{summary.totalInvoices}</p>
            </div>
          </div>

          {/* List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-right text-gray-600">
                  <th className="px-4 py-2 font-medium">סוג</th>
                  <th className="px-4 py-2 font-medium">תיאור</th>
                  <th className="px-4 py-2 font-medium">נטו</th>
                  <th className="px-4 py-2 font-medium">מע&quot;מ</th>
                  <th className="px-4 py-2 font-medium">ברוטו</th>
                  <th className="px-4 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoiceRows.map((row) => {
                  const net = Number(row.amount);
                  const vat = net * (Number(row.vatRatePercent) / 100);
                  return (
                    <tr key={row.id}>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.type === 'output'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {row.type === 'output' ? 'עסקה' : 'תשומה'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{row.description || '—'}</td>
                      <td className="px-4 py-2 text-right">{net > 0 ? formatCurrency(net) : '—'}</td>
                      <td className="px-4 py-2 text-right">{net > 0 ? formatCurrency(vat) : '—'}</td>
                      <td className="px-4 py-2 text-right font-medium">
                        {net > 0 ? formatCurrency(net + vat) : '—'}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="text-red-400 hover:text-red-600 text-lg"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pieData.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">אין חשבוניות עדיין</p>
          <p className="text-sm mt-1">הוסף עסקאות ותשומות למעקב</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Scenarios tab
// ============================================================

type ScenarioKey = 'discount' | 'import' | 'industry';

function ScenariosTab() {
  const [scenario, setScenario] = useState<ScenarioKey>('discount');

  // Discount
  const [discountNet, setDiscountNet] = useState(1000);
  const [discountPercent, setDiscountPercent] = useState(10);
  const discountResult = useMemo(
    () => calculateDiscountScenario(discountNet, discountPercent),
    [discountNet, discountPercent],
  );

  // Import
  const [importUSD, setImportUSD] = useState(500);
  const [exchangeRate, setExchangeRate] = useState(3.7);
  const [customsDuty, setCustomsDuty] = useState(12);
  const [purchaseTax, setPurchaseTax] = useState(0);
  const importResult = useMemo(
    () =>
      calculateImportVat({
        goodsValueUSD: importUSD,
        exchangeRateILS: exchangeRate,
        customsDutyPercent: customsDuty,
        purchaseTaxPercent: purchaseTax,
      }),
    [importUSD, exchangeRate, customsDuty, purchaseTax],
  );

  // Industry
  const [industry, setIndustry] = useState<IndustryVatKey>('standard');
  const [industryAmount, setIndustryAmount] = useState(10000);
  const industryRule = INDUSTRY_VAT_RULES[industry];
  const industryVat = useMemo(
    () => calculateAddVat(industryAmount, industryRule.vatRate),
    [industryAmount, industryRule.vatRate],
  );

  const scenarioButtons: { key: ScenarioKey; label: string }[] = [
    { key: 'discount', label: 'הנחה לפני / אחרי מע"מ' },
    { key: 'import', label: 'יבוא + מכס + מע"מ' },
    { key: 'industry', label: 'כללי ענף' },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <div className="grid grid-cols-3 gap-2">
        {scenarioButtons.map((b) => (
          <button
            key={b.key}
            type="button"
            onClick={() => setScenario(b.key)}
            className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition ${
              scenario === b.key
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Discount scenario */}
      {scenario === 'discount' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">הנחה — פרטים</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מחיר מקורי (ללא מע&quot;מ, ₪)
                </label>
                <input
                  type="number"
                  min={0}
                  value={discountNet}
                  onChange={(e) => setDiscountNet(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  אחוז הנחה (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(e) =>
                    setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">הנחה לפני מע&quot;מ (מחיר הבסיס יורד)</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">הנחה ₪:</dt>
                  <dd className="font-medium">{formatCurrency(discountResult.discountBeforeVat.discountAmount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">מחיר אחרי הנחה (נטו):</dt>
                  <dd className="font-medium">{formatCurrency(discountResult.discountBeforeVat.priceAfterDiscount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">מע&quot;מ על הנחה:</dt>
                  <dd className="font-medium">{formatCurrency(discountResult.discountBeforeVat.vatOnDiscounted)}</dd>
                </div>
                <div className="flex justify-between pt-1 border-t font-bold">
                  <dt>מחיר סופי לצרכן:</dt>
                  <dd className="text-green-700">{formatCurrency(discountResult.discountBeforeVat.finalGross)}</dd>
                </div>
                <div className="flex justify-between text-green-700">
                  <dt>חיסכון כולל:</dt>
                  <dd className="font-bold">{formatCurrency(discountResult.discountBeforeVat.totalSaving)}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">הנחה אחרי מע&quot;מ (על המחיר הסופי)</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">מחיר מקורי (כולל מע&quot;מ):</dt>
                  <dd className="font-medium">{formatCurrency(discountResult.originalGross)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">הנחה ₪:</dt>
                  <dd className="font-medium">{formatCurrency(discountResult.discountAfterVat.discountAmount)}</dd>
                </div>
                <div className="flex justify-between pt-1 border-t font-bold">
                  <dt>מחיר סופי לצרכן:</dt>
                  <dd className="text-blue-700">{formatCurrency(discountResult.discountAfterVat.finalGross)}</dd>
                </div>
                <div className="flex justify-between text-blue-700">
                  <dt>חיסכון כולל:</dt>
                  <dd className="font-bold">{formatCurrency(discountResult.discountAfterVat.totalSaving)}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
              <p className="text-amber-800 font-medium">
                הפרש בין שתי שיטות:{' '}
                {formatCurrency(
                  Math.abs(
                    discountResult.discountBeforeVat.finalGross -
                      discountResult.discountAfterVat.finalGross,
                  ),
                )}{' '}
                {discountResult.discountBeforeVat.finalGross < discountResult.discountAfterVat.finalGross
                  ? '(הנחה לפני מע"מ זולה יותר)'
                  : '(הנחה אחרי מע"מ זולה יותר)'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Import scenario */}
      {scenario === 'import' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">יבוא בינלאומי</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שווי סחורה ($)</label>
                <input
                  type="number"
                  min={0}
                  value={importUSD}
                  onChange={(e) => setImportUSD(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שער חליפין (₪ לדולר)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מכס (%)</label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={customsDuty}
                  onChange={(e) => setCustomsDuty(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מס קנייה (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={purchaseTax}
                  onChange={(e) => setPurchaseTax(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ResultCard
              title="עלות סופית (כולל כל המסים)"
              value={formatCurrency(importResult.totalLandedCost)}
              subtitle={`מס אפקטיבי: ${formatPercent(importResult.effectiveTaxRate)}`}
              variant="warning"
            />
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">פירוט עלויות</h4>
              <dl className="space-y-2 text-sm">
                {importResult.breakdown.map((b) => (
                  <div key={b.label} className="flex justify-between">
                    <dt className="text-gray-600">
                      {b.label} ({b.percent.toFixed(1)}%):
                    </dt>
                    <dd className="font-medium">{formatCurrency(b.amount)}</dd>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t font-bold">
                  <dt>עלות כוללת:</dt>
                  <dd>{formatCurrency(importResult.totalLandedCost)}</dd>
                </div>
              </dl>
            </div>
            {importResult.breakdown.length > 1 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={importResult.breakdown.map((b) => ({
                        name: b.label,
                        value: Math.round(b.amount),
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {importResult.breakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Industry rules */}
      {scenario === 'industry' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">כללי מע&quot;מ לפי ענף</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">בחר ענף</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as IndustryVatKey)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right bg-white"
                >
                  {Object.values(INDUSTRY_VAT_RULES).map((rule) => (
                    <option key={rule.key} value={rule.key}>
                      {rule.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סכום עסקה (₪)</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={industryAmount}
                  onChange={(e) => setIndustryAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div
              className={`border-2 rounded-xl p-4 ${
                industryRule.category === 'standard'
                  ? 'border-blue-200 bg-blue-50'
                  : industryRule.category === 'zero'
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    industryRule.category === 'standard'
                      ? 'bg-blue-200 text-blue-800'
                      : industryRule.category === 'zero'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {industryRule.category === 'standard'
                    ? 'חייב'
                    : industryRule.category === 'zero'
                    ? 'אפס'
                    : 'פטור'}
                </span>
                <span className="font-bold text-gray-900">{industryRule.label}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{industryRule.description}</p>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">שיעור מע&quot;מ:</dt>
                  <dd className="font-bold">{(industryRule.vatRate * 100).toFixed(0)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">מע&quot;מ על הסכום:</dt>
                  <dd className="font-medium">{formatCurrency(industryVat.vatAmount)}</dd>
                </div>
                <div className="flex justify-between pt-1 border-t font-bold">
                  <dt>סכום כולל מע&quot;מ:</dt>
                  <dd>{formatCurrency(industryVat.amountWithVat)}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">דוגמאות לענף זה</h4>
              <ul className="text-sm space-y-1">
                {industryRule.examples.map((ex, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
            {industryRule.notes.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2 text-sm">הערות חשובות</h4>
                <ul className="text-sm space-y-1">
                  {industryRule.notes.map((note, i) => (
                    <li key={i} className="flex gap-2 text-amber-800">
                      <span className="flex-shrink-0">!</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Operator type tab
// ============================================================

function OperatorTab() {
  const [selected, setSelected] = useState<OperatorType>('osek-murshe');
  const [revenue, setRevenue] = useState(150_000);
  const rules = getOperatorRules(selected);

  const operatorTypes: { key: OperatorType; label: string }[] = [
    { key: 'osek-murshe', label: 'עוסק מורשה' },
    { key: 'osek-patur', label: 'עוסק פטור' },
    { key: 'company', label: 'חברה בע"מ' },
    { key: 'amuta', label: 'עמותה' },
    { key: 'osek-zair', label: 'עוסק זעיר' },
  ];

  const vatCost = rules.collectsVat
    ? revenue * VAT_RATES.standard2025
    : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Selector + revenue */}
      <div className="space-y-5">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">בחר סוג עוסק</h3>
          <div className="space-y-2">
            {operatorTypes.map((op) => (
              <button
                key={op.key}
                type="button"
                onClick={() => setSelected(op.key)}
                className={`w-full px-4 py-3 rounded-lg border-2 text-right text-sm font-medium transition ${
                  selected === op.key
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מחזור שנתי (₪)
          </label>
          <input
            type="number"
            min={0}
            step={10000}
            value={revenue}
            onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
          />
          {rules.threshold !== null && revenue > rules.threshold && (
            <p className="text-amber-600 text-xs mt-2">
              מחזור חורג מתקרת {rules.label} ({formatCurrency(rules.threshold)})
            </p>
          )}
        </div>
      </div>

      {/* Rules details */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-1">{rules.label}</h3>
          <p className="text-gray-600 text-sm mb-4">{rules.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`rounded-lg p-3 text-center ${rules.collectsVat ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="text-xs font-medium mb-0.5 text-gray-600">גביית מע&quot;מ</p>
              <p className={`font-bold ${rules.collectsVat ? 'text-red-700' : 'text-green-700'}`}>
                {rules.collectsVat ? 'כן — גובה 18%' : 'לא'}
              </p>
            </div>
            <div className={`rounded-lg p-3 text-center ${rules.canDeductInputVat ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <p className="text-xs font-medium mb-0.5 text-gray-600">קיזוז תשומות</p>
              <p className={`font-bold ${rules.canDeductInputVat ? 'text-green-700' : 'text-gray-600'}`}>
                {rules.canDeductInputVat ? 'כן' : 'לא'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-0.5">דיווח</p>
              <p className="font-medium text-sm">{rules.reportingFrequency}</p>
            </div>
            {rules.collectsVat && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700 mb-0.5">מע&quot;מ שנתי על מחזור</p>
                <p className="font-bold text-blue-800 text-sm">{formatCurrency(vatCost)}</p>
              </div>
            )}
          </div>

          <h4 className="font-semibold text-gray-900 mb-2 text-sm">נקודות מפתח</h4>
          <ul className="space-y-1 mb-4">
            {rules.keyPoints.map((kp, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
                {kp}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-4">
            {rules.advantages.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-2 text-sm">יתרונות</h4>
                <ul className="space-y-1">
                  {rules.advantages.map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-500 flex-shrink-0">+</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {rules.disadvantages.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-2 text-sm">חסרונות</h4>
                <ul className="space-y-1">
                  {rules.disadvantages.map((d, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-red-500 flex-shrink-0">−</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Year Comparison tab
// ============================================================

function CompareTab() {
  const [amount, setAmount] = useState(1000);
  const [annualRevenue, setAnnualRevenue] = useState(200_000);

  const comparison = useMemo(
    () => calculateYearComparison(amount, annualRevenue),
    [amount, annualRevenue],
  );

  const chartData = [
    {
      name: '2024 (17%)',
      'ללא מע"מ': Math.round(comparison.netAmount),
      'מע"מ': Math.round(comparison.year2024.vatAmount),
    },
    {
      name: '2025+ (18%)',
      'ללא מע"מ': Math.round(comparison.netAmount),
      'מע"מ': Math.round(comparison.year2025plus.vatAmount),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">פרמטרים להשוואה</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סכום עסקה (ללא מע&quot;מ, ₪)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מחזור שנתי (ללא מע&quot;מ, ₪) — לחישוב השפעה שנתית
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right"
              />
            </div>
          </div>
        </div>

        {/* Per-transaction comparison */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 mb-1">2024 — מע&quot;מ 17%</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(comparison.year2024.vatAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                ברוטו: {formatCurrency(comparison.year2024.grossAmount)}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-medium text-blue-700 mb-1">2025+ — מע&quot;מ 18%</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatCurrency(comparison.year2025plus.vatAmount)}
              </p>
              <p className="text-xs text-blue-500 mt-0.5">
                ברוטו: {formatCurrency(comparison.year2025plus.grossAmount)}
              </p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-800 mb-2">הפרש לעסקה</p>
            <p className="text-xl font-bold text-amber-900">
              +{formatCurrency(comparison.difference.vatAmountDiff)}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              עלייה של {formatNumber(comparison.difference.percentIncrease, 2)}% במחיר לצרכן
            </p>
          </div>
        </div>
      </div>

      {/* Annual impact */}
      {annualRevenue > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">
            השפעה שנתית על מחזור של {formatCurrency(annualRevenue)}
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">מע&quot;מ שנתי 2024 (17%)</p>
              <p className="text-lg font-bold text-gray-800">
                {formatCurrency(annualRevenue * 0.17)}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-700 mb-1">מע&quot;מ שנתי 2025+ (18%)</p>
              <p className="text-lg font-bold text-blue-800">
                {formatCurrency(annualRevenue * 0.18)}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-xs text-red-700 mb-1">תוספת מע&quot;מ שנתית</p>
              <p className="text-lg font-bold text-red-800">
                +{formatCurrency(comparison.annualImpact.extraVatAnnual)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            * לצרכן — עלות נוספת שנתית: {formatCurrency(comparison.annualImpact.extraCostToConsumer)}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">השוואה גרפית</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => formatCurrency(Number(v))} width={90} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey='ללא מע"מ' fill="#94a3b8" stackId="a" />
            <Bar dataKey='מע"מ' fill="#ef4444" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transition note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold mb-1">מתי חל השינוי?</p>
        <p>
          שיעור המע&quot;מ עלה מ-17% ל-18% ב-<strong>1 בינואר 2025</strong> (תקציב המלחמה).
          עסקאות שסוכמו לפני 1.1.2025 — לפי 17%; עסקאות מ-1.1.2025 ואילך — 18%.
          ב-2026 אין שינוי נוסף.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Main component
// ============================================================

export function VatCalculator() {
  const [tab, setTab] = useState<MainTab>('basic');

  const tabs: MainTab[] = ['basic', 'bimonthly', 'tracker', 'scenarios', 'operator', 'compare'];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 min-w-[calc(33%-4px)] px-3 py-2 rounded-lg text-sm font-medium transition ${
              tab === t
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'basic' && <BasicVatTab />}
      {tab === 'bimonthly' && <BimonthlyTab />}
      {tab === 'tracker' && <TrackerTab />}
      {tab === 'scenarios' && <ScenariosTab />}
      {tab === 'operator' && <OperatorTab />}
      {tab === 'compare' && <CompareTab />}
    </div>
  );
}
