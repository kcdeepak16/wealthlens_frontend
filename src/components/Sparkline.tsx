import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

export default function Sparkline({
  data,
  positive = true,
  width = 60,
  height = 24,
}: SparklineProps) {
  const chartData = data.map((v, i) => ({ v, i }));
  const color = positive ? "#22c55e" : "#ef4444";

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}