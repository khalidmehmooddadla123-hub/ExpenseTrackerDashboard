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

// Renders both % inside slice AND dollar value outside
const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, value,
}: any) => {
  const RADIAN = Math.PI / 180;

  // Percent label inside the slice
  if (percent >= 0.06) {
    const rIn = innerRadius + (outerRadius - innerRadius) * 0.55;
    const xIn = cx + rIn * Math.cos(-midAngle * RADIAN);
    const yIn = cy + rIn * Math.sin(-midAngle * RADIAN);

    // Dollar label outside the slice
    const rOut = outerRadius + 18;
    const xOut = cx + rOut * Math.cos(-midAngle * RADIAN);
    const yOut = cy + rOut * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        {/* % inside */}
        <text
          x={xIn} y={yIn}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fontWeight={700}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        {/* $ value outside */}
        <text
          x={xOut} y={yOut}
          fill="#475569"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fontWeight={600}
        >
          {`$${Number(value).toFixed(0)}`}
        </text>
      </g>
    );
  }
  return null;
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <Card>
      <CardTitle className="mb-4">Spending by Category</CardTitle>
      {data.length === 0 ? (
        <EmptyState icon={<PieIcon size={40} />} title="No data yet" />
      ) : (
        <>
          {/* Extra height to give room for outside labels */}
          <ResponsiveContainer width="100%" height={175}>
            <PieChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={65}
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
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
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
