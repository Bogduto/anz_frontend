"use client";
import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import { ColorResult } from "./FilesChart";

function MostVisitedFilesChart({
  chartData,
}: {
  chartData: { name: string; value: number; color: ColorResult }[];
}) {
  return (
    <ResponsiveContainer width={140} height={140}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          innerRadius={28}
          strokeWidth={0}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color.backgroundColor} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${Math.floor(value / 60000)} min`, "Час"]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default MostVisitedFilesChart;
