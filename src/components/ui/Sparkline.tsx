import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
}

export function Sparkline({ 
  data, 
  width = 60, 
  height = 20, 
  color = '#3b82f6',
  showDots = false 
}: SparklineProps) {
  const chartData = data.map((value, index) => ({
    index,
    value
  }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={showDots ? { r: 2, fill: color } : false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
