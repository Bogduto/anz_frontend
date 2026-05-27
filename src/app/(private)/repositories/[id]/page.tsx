import { notFound } from "next/navigation";
import { Suspense } from "react";
import WeeklyDatePicker from "@/components/WeeklyDatePicker";
import fetchRepository from "./fetchRepository";
import { Days } from "./types";
import formatTimeDuration from "@/utils/formatTimeDuration";
import ScheduleChart from "@/components/ScheduleChart";
import FilesChart from "./FilesChart";

type RepositoryPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const countTotalDurationWeek = (days: Days): number => {
  return Object.values(days)
    .flatMap((day) => day)
    .reduce((acc, activity) => acc + activity.total_duration, 0);
};

export default async function RepositoryDetailPage({
  params,
  searchParams,
}: RepositoryPageProps) {
  const { id } = await params;
  const { start } = await searchParams;

  const day = start
    ? (start as string).substring(0, 10)
    : new Date().toISOString().substring(0, 10);

  const stats = await fetchRepository({ id, date: day });

  if (!stats || "error" in stats) {
    return notFound();
  }

  const total_duration = stats.weekStats.workspace_total_spent;
  const week_count = countTotalDurationWeek(stats.weekStats.days);

  const dayActivityList = stats.weekStats.days?.[day] ?? [];
  const files = dayActivityList.flatMap(
    (activity) => stats.weekStats.sessions[String(activity.id)] ?? []
  );

  const totalDuration = files.reduce(
    (acc, f) => acc + (f.close_time - f.enter_time),
    0
  );

  const dayLabel = new Date(day + "T00:00:00").toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "var(--color-background-tertiary)",
        minHeight: "calc(100vh - 56px)",
        padding: "2rem",
      }}
    >
      <main style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* HEADER */}
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--border-radius-md)",
                background: "var(--color-brand-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                color: "var(--color-brand)",
              }}
            >
              <i className="ti ti-clock" aria-hidden="true" />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "3px" }}>
                {stats.workspace.name}
              </div>
              <div style={{ fontSize: "12px", color: "var(--color-brand)", fontFamily: "var(--font-mono)" }}>
                /{stats.workspace.href}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "22px", fontWeight: 500, color: "var(--color-text-primary)" }}>
              {formatTimeDuration(total_duration)}
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
              Загальна тривалість
            </div>
          </div>
        </div>

        {/* DATE PICKER */}
        <Suspense
          fallback={
            <div style={{ height: "30px", width: "320px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)" }} />
          }
        >
          <WeeklyDatePicker />
        </Suspense>

        {/* SCHEDULE CHART */}
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            overflow: "hidden",
          }}
        >
          <ScheduleChart
            days={stats.weekStats.days}
            sessions={stats.weekStats.sessions}
          />
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div
            style={{
              background: "var(--color-background-primary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-lg)",
              padding: "1.25rem",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="ti ti-chart-bar" style={{ fontSize: "15px" }} aria-hidden="true" />
              Активність за тиждень
            </div>
            <div style={{ fontSize: "26px", fontWeight: 500, color: "var(--color-text-primary)" }}>
              {formatTimeDuration(week_count)}
            </div>
          </div>

          <div
            style={{
              background: "var(--color-background-primary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-lg)",
              padding: "1.25rem",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="ti ti-sun" style={{ fontSize: "15px" }} aria-hidden="true" />
              Активність сьогодні
            </div>
            <div style={{ fontSize: "26px", fontWeight: 500, color: "var(--color-text-primary)" }}>
              {formatTimeDuration(totalDuration)}
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "4px" }}>
              {dayLabel}
            </div>
          </div>
        </div>

        {/* FILES */}
        <FilesChart totalDuration={totalDuration} files={files} />

      </main>
    </div>
  );
}
