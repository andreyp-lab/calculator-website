'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface DataPoint {
  month: string;
  boiRate: number;
  primeRate: number;
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

export function PrimeRateChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: MONTH_LABELS[d.month] ?? d.month,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          reversed
        />
        <YAxis
          domain={[3.5, 6.5]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <Tooltip
          formatter={(val, name) => [
            `${val}%`,
            name === 'primeRate' ? 'ריבית פריים' : 'ריבית בנק ישראל',
          ]}
          labelFormatter={(label) => label}
          contentStyle={{ fontFamily: 'Heebo, sans-serif', direction: 'rtl' }}
        />
        <Legend
          formatter={(val) => (val === 'primeRate' ? 'ריבית פריים' : 'ריבית בנק ישראל')}
        />
        <Line
          type="stepAfter"
          dataKey="primeRate"
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#2563eb' }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="stepAfter"
          dataKey="boiRate"
          stroke="#93c5fd"
          strokeWidth={2}
          dot={{ r: 3, fill: '#93c5fd' }}
          strokeDasharray="4 2"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
