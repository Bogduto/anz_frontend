import { notFound } from "next/navigation";
import WeeklyDatePicker from "@/components/WeeklyDatePicker";
import fetchRepository from "./fetchRepository";
import { Days, Sessions } from "./types";
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
    ? new Date(start as string).toISOString()
    : new Date().toISOString();

  const stats = await fetchRepository({
    id,
    date: day,
  });

  if (!stats) {
    return notFound();
  }

  const total_duration = stats.weekStats.workspace_total_spent;
  const week_count = countTotalDurationWeek(stats.weekStats.days);

  const dayKey = day.substring(0, 10);

  /**
   * 1. Safely resolve sessions WITHOUT dayStats dependency
   */
  const dayActivities = stats.weekStats.days?.[dayKey]?.[0];

  const files =
    dayActivities
      ? stats.weekStats.sessions[dayActivities.id] ?? []
      : [];

  console.log("state:", stats);

  /**
   * 2. Safe duration calculation
   */
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
            <div className="flex flex-col gap-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {stats.workspace.name}
              </h1>

              <h2 className="cursor-pointer text-sm font-light text-black/50 underline">
                {stats.workspace.href}
              </h2>
            </div>

            <div>
              <div className="text-2xl font-semibold">
                {formatTimeDuration(total_duration)}
              </div>
              <div className="text-xs text-zinc-500">
                Total duration
              </div>
            </div>
          </div>
        </section>

        {/* DATE PICKER */}
        <WeeklyDatePicker />

        {/* CHART */}
        <ScheduleChart
          days={stats.weekStats.days}
          sessions={stats.weekStats.sessions}
        />

        {/* STATS */}
        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-3xl bg-white/90 p-6 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/80">
              <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Weekly activities
              </h3>
              <p className="text-3xl font-semibold">
                {formatTimeDuration(week_count)}
              </p>
            </div>

            <div className="rounded-3xl bg-white/90 p-6 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/80">
              <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Today activities
              </h3>
              <p className="text-3xl font-semibold">
                {formatTimeDuration(totalDuration)}
              </p>
            </div>
          </div>
          {/* FILES */}
          <FilesChart
            totalDuration={totalDuration}
            files={files}
          />
        </section>
      </main>
    </div>
  );
}