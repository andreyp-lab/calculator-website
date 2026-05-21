'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface DataPoint {
  quarter: string;
  wage: number;
}

interface Props {
  data: DataPoint[];
  currentWage: number;
}

export function WageChart({ data, currentWage }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis
          domain={[11000, 14000]}
          tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`}
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <Tooltip
          formatter={(val) => [`₪${Number(val).toLocaleString('he-IL')}`, 'שכר ממוצע']}
          contentStyle={{ fontFamily: 'Heebo, sans-serif', direction: 'rtl' }}
        />
        <Bar dataKey="wage" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.quarter}
              fill={entry.wage === currentWage ? '#059669' : '#a7f3d0'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
