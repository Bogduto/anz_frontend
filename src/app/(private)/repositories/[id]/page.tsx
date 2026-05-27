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

  // All activities for the selected day (not just the first one)
  const dayActivityList = stats.weekStats.days?.[day] ?? [];
  const files = dayActivityList.flatMap(
    (activity) => stats.weekStats.sessions[String(activity.id)] ?? []
  );

  const totalDuration = files.reduce(
    (acc, f) => acc + (f.close_time - f.enter_time),
    0
  );

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-4 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 sm:px-8">
      <main className="flex w-full flex-col gap-6">

        {/* HEADER */}
        <section className="rounded-3xl bg-white/90 p-7 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {stats.workspace.name}
              </h1>
              <span className="text-sm font-light text-zinc-500">
                {stats.workspace.href}
              </span>
            </div>

            <div>
              <div className="text-2xl font-semibold">
                {formatTimeDuration(total_duration)}
              </div>
              <div className="text-xs text-zinc-500">Total duration</div>
            </div>
          </div>
        </section>

        {/* DATE PICKER */}
        <Suspense fallback={<div className="h-10 w-[400px] animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />}>
          <WeeklyDatePicker />
        </Suspense>

        {/* CHART */}
        <ScheduleChart
          days={stats.weekStats.days}
          sessions={stats.weekStats.sessions}
        />

        {/* STATS */}
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white/90 p-6 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/80">
              <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Weekly total
              </h3>
              <p className="text-3xl font-semibold">
                {formatTimeDuration(week_count)}
              </p>
            </div>

            <div className="rounded-3xl bg-white/90 p-6 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/80">
              <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {day}
              </h3>
              <p className="text-3xl font-semibold">
                {formatTimeDuration(totalDuration)}
              </p>
            </div>
          </div>

          {/* FILES */}
          <FilesChart totalDuration={totalDuration} files={files} />
        </section>
      </main>
    </div>
  );
}
