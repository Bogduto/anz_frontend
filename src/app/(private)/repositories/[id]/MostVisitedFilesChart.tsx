"use client";
import { Cell, Pie, PieChart } from "recharts";
import { ColorResult } from "./FilesChart";

function MostVisitedFilesChart({
  chartData,
}: {
  chartData: { name: string; value: number, color: ColorResult }[];
}) {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={_.color.backgroundColor} stroke="none" />
        ))}
      </Pie>
    </PieChart>
  );
}

export default MostVisitedFilesChart;