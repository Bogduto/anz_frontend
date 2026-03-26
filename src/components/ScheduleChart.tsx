"use client";

import { useMemo } from "react";

type SessionBlock = {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  startHour: number;
  endHour: number;
  start: string;
  finish: string;
  durationMinutes: number;
  sliceCount?: number;
};

type ScheduleChartProps = {
  sessions: { id: string; start: string; finish: string; sliceCount?: number }[];
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseSession(session: {
  id: string;
  start: string;
  finish: string;
  sliceCount?: number;
}): SessionBlock | null {
  const start = new Date(session.start);
  const finish = new Date(session.finish);
  const dayOfWeek = start.getDay();
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = finish.getHours() + finish.getMinutes() / 60;
  const durationMinutes = (finish.getTime() - start.getTime()) / 60000;

  if (start.toDateString() !== finish.toDateString()) {
    const endOfDay = 24;
    return {
      id: session.id,
      dayOfWeek,
      startHour,
      endHour: endOfDay,
      start: session.start,
      finish: session.finish,
      durationMinutes,
      sliceCount: session.sliceCount,
    };
  }

  return {
    id: session.id,
    dayOfWeek,
    startHour,
    endHour,
    start: session.start,
    finish: session.finish,
    durationMinutes,
    sliceCount: session.sliceCount,
  };
}

function formatTime(h: number) {
  const hour = Math.floor(h);
  const ampm = hour >= 12 ? "pm" : "am";
  const h12 = hour % 12 || 12;
  return `${h12}${ampm}`;
}

function formatSessionTime(ts: string) {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSessionDate(ts: string) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ScheduleChart({ sessions }: ScheduleChartProps) {
  const blocks = useMemo(() => {
    return sessions
      .map(parseSession)
      .filter((b): b is SessionBlock => b !== null);
  }, [sessions]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const days = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);

  return (
    <div>
      <div className="min-w-[640px]">
        {/* Hour labels */}
        <div className="mb-1 grid grid-cols-[72px_repeat(24,1fr)] gap-px text-[10px] text-zinc-500 dark:text-zinc-400">
          <div />
          {hours.map((h) => (
            <div key={h} className="truncate px-0.5 text-center">
              {formatTime(h)}
            </div>
          ))}
        </div>

        {/* Day rows with session blocks */}
        <div className="space-y-2">
          {days.map((dayIndex) => {
            const dayBlocks = blocks.filter((b) => b.dayOfWeek === dayIndex);
            return (
              <div
                key={dayIndex}
                className="grid min-h-[56px] grid-cols-[72px_repeat(24,1fr)] gap-px rounded-lg border border-zinc-200 bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-800/30"
              >
                <div className="flex items-center px-2 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  {DAY_NAMES[dayIndex]}
                </div>
                <div className="relative col-span-24">
                  {dayBlocks.map((block) => {
                    const left = (block.startHour / 24) * 100;
                    const width = ((block.endHour - block.startHour) / 24) * 100;
                    const duration = Math.round(block.durationMinutes);
                    return (
                      <div
                        key={block.id}
                        className="absolute inset-y-1 z-100"
                        style={{
                          left: `${left}%`,
                          width: `${Math.max(width, 4)}%`,
                          minWidth: "32px",
                        }}
                      >
                        <div className="group relative h-full rounded-md bg-violet-500/90 px-2 py-1 text-[10px] font-medium text-white shadow-sm transition hover:bg-violet-600 dark:bg-violet-600/90 dark:hover:bg-violet-500">
                          <span className="block truncate">{duration}m</span>

                          <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden w-[260px] -translate-x-1/2 -translate-y-[110%] rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-zinc-900 shadow-lg ring-1 ring-black/5 group-hover:block dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold">Session</span>
                              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                {formatSessionDate(block.start)}
                              </span>
                            </div>
                            <div className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                              {formatSessionTime(block.start)} – {formatSessionTime(block.finish)}
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                  Duration
                                </div>
                                <div className="font-medium">{duration}m</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                  Slices
                                </div>
                                <div className="font-medium">
                                  {block.sliceCount ?? "—"}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                              {block.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
