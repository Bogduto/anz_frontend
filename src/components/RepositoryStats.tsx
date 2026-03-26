"use client";

import { useMemo, useState } from "react";
import { sessions, slices, users } from "@/lib/data";
import { computeRepositoryStats } from "@/lib/stats";
import { ScheduleChart } from "@/components/ScheduleChart";
import type { StatsFilters, SortBy, SortOrder } from "@/lib/types";

type RepositoryStatsProps = {
  projectId: string;
  userId?: string;
};
// itallo
// hello
function formatDate(d: string) {
  return new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (parts.length === 0) parts.push("<1m");
  return parts.join(" ");
}

export function RepositoryStats({ projectId, userId }: RepositoryStatsProps) {
  const [sortBy, setSortBy] = useState<SortBy>("duration");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const filters: StatsFilters = useMemo(
    () => ({
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      repoUserId: userId || null,
    }),
    [dateFrom, dateTo, userId]
  );

  const stats = useMemo(
    () => computeRepositoryStats(sessions, slices, users, projectId, filters, sortBy, sortOrder),
    [projectId, filters, sortBy, sortOrder]
  );

  return (
    <section className="mt-8 space-y-6 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/70">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Repository statistics
      </h2>

      {/* Twitch-style schedule chart */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Weekly schedule
        </h3>
        <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
          Day of week × time of day. Each block is a session.
        </p>
        <ScheduleChart
          sessions={stats.sessionsWithSlices.map((s) => ({
            id: s.sessionId,
            start: s.start,
            finish: s.finish,
            sliceCount: s.sliceCount,
          }))}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Date from
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Date to</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Sort sessions by</span>
        <div className="inline-flex overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          {(["duration", "date", "frequency"] as SortBy[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 text-xs font-medium transition ${
                sortBy === option
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
          className="rounded border border-zinc-200 px-2 py-1 text-xs font-medium dark:border-zinc-700"
        >
          {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
        </button>
      </div>

      {/* Aggregate stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {stats.aggregate.totalSessions}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Total sessions</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {formatDuration(stats.aggregate.totalDurationSeconds)}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Total duration</div>
        </div>
      </div>

      {/* Most used languages */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Most used programming languages
        </h3>
        <div className="flex flex-wrap gap-2">
          {stats.aggregate.mostUsedLanguages.map(({ language, count }) => (
            <span
              key={language}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {language} <span className="ml-1 text-zinc-500">({count})</span>
            </span>
          ))}
          {stats.aggregate.mostUsedLanguages.length === 0 && (
            <span className="text-sm text-zinc-500">No data</span>
          )}
        </div>
      </div>

      {/* Most used files */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Most used files
        </h3>
        <ul className="space-y-2">
          {stats.aggregate.mostUsedFiles.map(({ path, count }) => (
            <li
              key={path}
              className="flex items-center justify-between rounded border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              <code className="break-all font-mono text-xs">{path}</code>
              <span className="ml-2 shrink-0 text-xs text-zinc-500">{count} edits</span>
            </li>
          ))}
          {stats.aggregate.mostUsedFiles.length === 0 && (
            <li className="text-sm text-zinc-500">No data</li>
          )}
        </ul>
      </div>

      {/* Sessions with slices */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Sessions (with slice count)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Start
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Finish
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Duration
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Slices
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {stats.sessionsWithSlices.map((s) => (
                <tr key={s.sessionId}>
                  <td className="px-4 py-2 text-xs">{formatDate(s.start)}</td>
                  <td className="px-4 py-2 text-xs">{formatDate(s.finish)}</td>
                  <td className="px-4 py-2 text-right">{formatDuration(s.durationSeconds)}</td>
                  <td className="px-4 py-2 text-right">{s.sliceCount}</td>
                </tr>
              ))}
              {stats.sessionsWithSlices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-sm text-zinc-500">
                    No sessions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
