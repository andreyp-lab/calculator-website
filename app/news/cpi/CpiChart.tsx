'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface DataPoint {
  month: string;
  annualRate: number;
  monthlyRate: number;
}

interface Props {
  data: DataPoint[];
}

const MONTH_LABELS: Record<string, string> = {
  '2025-06': 'יוני 25',
  '2025-07': 'יולי 25',
  '2025-08': 'אוג 25',
  '2025-09': 'ספט 25',
  '2025-10': 'אוק 25',
  '2025-11': 'נוב 25',
  '2025-12': 'דצמ 25',
  '2026-01': 'ינו 26',
  '2026-02': 'פבר 26',
  '2026-03': 'מרץ 26',
  '2026-04': 'אפר 26',
  '2026-05': 'מאי 26',
};

export function CpiChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: MONTH_LABELS[d.month] ?? d.month,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          reversed
        />
        <YAxis
          yAxisId="annual"
          domain={[2, 4]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: '#f97316' }}
          orientation="right"
        />
        <YAxis
          yAxisId="monthly"
          domain={[-0.5, 0.7]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
        />
        <Tooltip
          formatter={(val, name) => [
            `${val}%`,
            name === 'annualRate' ? 'שנתי (12 חודש)' : 'שינוי חודשי',
          ]}
          contentStyle={{ fontFamily: 'Heebo, sans-serif', direction: 'rtl' }}
        />
        <Legend
          formatter={(val) => (val === 'annualRate' ? 'אינפלציה שנתית' : 'שינוי חודשי')}
        />
        <Bar
          yAxisId="monthly"
          dataKey="monthlyRate"
          fill="#fed7aa"
          radius={[3, 3, 0, 0]}
          name="monthlyRate"
        />
        <Line
          yAxisId="annual"
          type="monotone"
          dataKey="annualRate"
          stroke="#f97316"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#f97316' }}
          name="annualRate"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
