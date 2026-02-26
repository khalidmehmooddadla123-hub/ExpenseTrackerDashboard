/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';
import { EmptyState } from '@/components/ui/Spinner';
import { PieChart as PieIcon } from 'lucide-react';

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: PieData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-slate-700">{payload[0].name}</p>
        <p className="text-primary-600 font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <Card>
      <CardTitle className="mb-4">Spending by Category</CardTitle>
      {data.length === 0 ? (
        <EmptyState icon={<PieIcon size={40} />} title="No data yet" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={72}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
