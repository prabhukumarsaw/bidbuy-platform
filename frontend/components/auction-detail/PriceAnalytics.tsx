'use client';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { time: '12:00', price: 100 },
  { time: '13:00', price: 105 },
  { time: '14:00', price: 110 },
  { time: '15:00', price: 115 },
  { time: '16:00', price: 120 },
  { time: '17:00', price: 125 },
];

export function PriceAnalytics() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Price Trend</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
