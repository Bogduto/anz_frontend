"use client";
import { Cell, Pie, PieChart, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ColorResult } from "./FilesChart";

function MostVisitedFilesChart({
  chartData,
}: {
  chartData: { name: string; value: number; color: ColorResult }[];
}) {
  return (
    <ResponsiveContainer width={340} height={340}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color.backgroundColor}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => {
            const ms = value;
            const minutes = Math.floor(ms / 60000);
            return [`${minutes} min`, "Time"];
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default MostVisitedFilesChart;
