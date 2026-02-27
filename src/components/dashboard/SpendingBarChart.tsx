import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';

interface BarData {
  label: string;
  total: number;
  date: string;
}

interface SpendingBarChartProps {
  data: BarData[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-slate-700">{label}</p>
        <p className="text-primary-600 font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function SpendingBarChart({ data }: SpendingBarChartProps) {
  const max = Math.max(...data.map((d) => d.total));

  return (
    <Card>
      <CardTitle className="mb-4">Last 7 Days Spending</CardTitle>
      <ResponsiveContainer width="100%" height={185}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.total === max && max > 0 ? '#10b981' : '#a7f3d0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
