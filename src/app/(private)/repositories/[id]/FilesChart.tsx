"use client";

import { useMemo } from "react";
import MostVisitedFilesChart from "./MostVisitedFilesChart";

export type ColorResult = {
  backgroundColor: string;
  textColor: string;
};

type FileSession = {
  file: {
    name: string;
  };
  enter_time: number;
  close_time: number;
};

type MostUsedFile = {
  file: FileSession["file"];
  totalDuration: number;
};

type ChartData = {
  name: string;
  value: number;
  percent: number;
  color: ColorResult;
};

function stringToColor(str: string): ColorResult {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const lightness = 55;
  return {
    backgroundColor: `hsl(${hue}, 55%, ${lightness}%)`,
    textColor: lightness > 65 ? "hsl(0, 0%, 10%)" : "hsl(0, 0%, 98%)",
  };
}

function FilesChart({
  files,
  totalDuration,
}: {
  files: FileSession[];
  totalDuration: number;
}) {
  const mostUsed: MostUsedFile[] = useMemo(() => {
    // Aggregate durations by file name (handles multiple index.ts etc.)
    const grouped = new Map<string, number>();
    files.forEach((f) => {
      const name = f.file.name;
      const duration = f.close_time - f.enter_time;
      grouped.set(name, (grouped.get(name) ?? 0) + duration);
    });

    return Array.from(grouped.entries())
      .map(([name, totalDuration]) => ({ file: { name }, totalDuration }))
      .sort((a, b) => b.totalDuration - a.totalDuration)
      .slice(0, 5);
  }, [files]);

  const chartData: ChartData[] = useMemo(() => {
    return mostUsed.map((item) => {
      const color = stringToColor(item.file.name);
      return {
        name: item.file.name,
        value: item.totalDuration,
        percent:
          totalDuration === 0 ? 0 : (item.totalDuration / totalDuration) * 100,
        color,
      };
    });
  }, [mostUsed, totalDuration]);

  if (chartData.length === 0) {
    return (
      <div className="mt-4 flex h-32 items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/90 text-sm text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        No file usage data available for this day.
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col items-start gap-4 lg:flex-row">
      {/* PIE CHART */}
      <div className="w-full lg:w-auto">
        <MostVisitedFilesChart chartData={chartData} />
      </div>

      {/* LIST */}
      <div className="w-full rounded-3xl border border-zinc-200 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Most Used Files
        </h3>

        <div className="flex flex-col gap-3">
          {chartData.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm shadow-sm dark:border-zinc-800"
              style={{
                background: `linear-gradient(to right, ${item.color.backgroundColor} ${item.percent}%, transparent ${item.percent}%)`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  style={{ color: item.color.textColor }}
                  className="font-medium"
                >
                  {item.name}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilesChart;
