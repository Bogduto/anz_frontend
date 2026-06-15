"use client";

import { useMemo } from "react";
import MostVisitedFilesChart from "./MostVisitedFilesChart";
import formatTimeDuration from "@/utils/formatTimeDuration";

export type ColorResult = {
  backgroundColor: string;
  textColor: string;
};

type FileSession = {
  file: { name: string };
  enter_time: number;
  close_time: number;
};

type ChartData = {
  name: string;
  value: number;
  percent: number;
  color: ColorResult;
};

const FILE_COLORS = ["#F59E0B", "#FB7185", "#60A5FA", "#34D399", "#F5F0E8"];

function FilesChart({
  files,
  totalDuration,
}: {
  files: FileSession[];
  totalDuration: number;
}) {
  const chartData: ChartData[] = useMemo(() => {
    const grouped = new Map<string, number>();
    files.forEach((f) => {
      const name = f.file.name;
      grouped.set(name, (grouped.get(name) ?? 0) + (f.close_time - f.enter_time));
    });

    return Array.from(grouped.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value], i) => ({
        name,
        value,
        percent: totalDuration === 0 ? 0 : (value / totalDuration) * 100,
        color: {
          backgroundColor: FILE_COLORS[i % FILE_COLORS.length],
          textColor: "#fff",
        },
      }));
  }, [files, totalDuration]);

  if (chartData.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80px",
          borderRadius: "var(--border-radius-lg)",
          border: "0.5px dashed var(--color-border-secondary)",
          background: "var(--color-background-primary)",
          fontSize: "13px",
          color: "var(--color-text-tertiary)",
        }}
      >
        Немає даних про файли за цей день.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "14px" }}>
      {/* PIE CHART */}
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)", alignSelf: "flex-start" }}>
          Розподіл файлів
        </div>
        <MostVisitedFilesChart chartData={chartData} />
        <div style={{ width: "100%" }}>
          {chartData.map((item) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color.backgroundColor, flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
              <span style={{ marginLeft: "auto", fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>
                {formatTimeDuration(item.value)} · {item.percent.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FILES LIST */}
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "1rem" }}>
          Найбільш використовувані файли
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {chartData.map((item, index) => (
            <div key={`${item.name}-${index}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>
                  {item.name}
                </span>
                <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>
                  {formatTimeDuration(item.value)} · {item.percent.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: "6px", background: "var(--color-background-secondary)", borderRadius: "3px" }}>
                <div
                  style={{
                    height: "6px",
                    borderRadius: "3px",
                    background: item.color.backgroundColor,
                    width: `${item.percent}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilesChart;
