"use client";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import formatTimeDuration from "@/utils/formatTimeDuration";
import isSameUTCDate from "./ScheduleChart/todayHightling";
import useSyncScroll from "./ScheduleChart/useSyncScroll";
import useZoom from "./ScheduleChart/useZoom";
import getColor from "./ScheduleChart/getColor";
import { Activity, Session } from "@/app/(private)/repositories/[id]/types";
dayjs.extend(duration);

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TOTAL_MINUTES = 1440;

function tsToMinutes(ts: number) {
  const d = new Date(ts);
  return d.getHours() * 60 + d.getMinutes();
}

function getStep(zoom: number) {
  if (zoom < 1) return 60;
  if (zoom < 3) return 30;
  if (zoom < 6) return 15;
  return 5;
}

function ScheduleChart({
  days,
  sessions,
}: {
  days: Record<string, Activity[]>;
  sessions: Record<string, Session[]>;
}) {
  const { headerRef, bodyRef, syncScroll } = useSyncScroll();
  const { zoom, handleWheel } = useZoom({ bodyRef });

  const pxPerMinute = zoom;
  const totalWidth = TOTAL_MINUTES * pxPerMinute;
  const step = getStep(zoom);

  const dayEntries = Object.entries(days) as [string, Activity[]][];

  const hasActivities = dayEntries.some(([, acts]) => acts.length > 0);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-zinc-800">
      {/* HEADER */}
      <div className="flex border-b border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex w-24 flex-shrink-0 items-center justify-center border-r border-gray-100 dark:border-zinc-800">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 dark:text-zinc-600">
            Time
          </span>
        </div>
        <div
          ref={headerRef}
          className="relative h-10 flex-1 overflow-x-hidden"
          onScroll={() => syncScroll("header")}
        >
          <div style={{ width: totalWidth, position: "relative", height: "100%" }}>
            {Array.from({ length: TOTAL_MINUTES / step }).map((_, i) => {
              const minutes = i * step;
              const h = Math.floor(minutes / 60);
              const m = minutes % 60;
              return (
                <div
                  key={i}
                  className="absolute top-0 flex flex-col items-start"
                  style={{ left: `${Math.round(minutes * zoom)}px` }}
                >
                  <div className="h-2 w-px bg-gray-200 dark:bg-zinc-700" />
                  <span className="mt-0.5 select-none whitespace-nowrap text-[10px] text-gray-400 dark:text-zinc-500">
                    {h}:{m.toString().padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex">
        {/* DAY LABELS */}
        <div className="w-24 flex-shrink-0 border-r border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {dayEntries.map(([dateKey, dateValue]) => {
            const date = new Date(dateKey + "T00:00:00Z");
            const dayNum = date.getUTCDate();
            const dayName = DAY_NAMES[date.getUTCDay()];

            const total = dateValue.reduce(
              (prev, cur) => prev + cur.total_duration,
              0,
            );

            const day_activity_total =
              total === 0 ? "—" : formatTimeDuration(total);

            const isToday = isSameUTCDate(date, new Date());

            return (
              <div
                key={dateKey}
                className={cn(
                  "flex h-[100px] flex-col items-center justify-center gap-0.5 border-b border-gray-100 last:border-b-0 dark:border-zinc-800",
                  isToday ? "bg-[hsl(242,93%,76%,0.3)]" : null,
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                  {dayName}
                </span>
                <span className="text-base font-normal text-gray-500 dark:text-zinc-400">
                  {dayNum}
                </span>
                <span className="text-[12px] font-normal text-gray-500 dark:text-zinc-400">
                  {day_activity_total}
                </span>
              </div>
            );
          })}
        </div>

        {/* TIMELINE */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-x-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e5e7eb transparent",
          }}
          onScroll={() => syncScroll("body")}
          onWheel={handleWheel}
        >
          <div style={{ width: totalWidth, position: "relative" }}>
            {dayEntries.map(([dateKey, activities], i) => (
              <div
                key={dateKey}
                className={cn(
                  "relative h-[100px] border-b border-gray-100 last:border-b-0 dark:border-zinc-800",
                  i % 2 === 0
                    ? "bg-white dark:bg-zinc-900"
                    : "bg-gray-50/60 dark:bg-zinc-800/40",
                )}
              >
                {/* Hour gridlines */}
                {Array.from({ length: 25 }).map((_, h) => (
                  <div
                    key={h}
                    className="absolute bottom-0 top-0 bg-gray-100 dark:bg-zinc-800"
                    style={{
                      left: `${Math.round(h * 60 * zoom)}px`,
                      width: "0.5px",
                    }}
                  />
                ))}

                {/* Activities */}
                {activities.map((activity) => {
                  const startMin = tsToMinutes(activity.start);
                  let endMin = tsToMinutes(activity.end);

                  if (endMin < startMin) endMin += 1440;

                  const widthMin = Math.max(endMin - startMin, 2);
                  const color = getColor(activity.workspace_id);
                  const actSessions: Session[] = sessions[String(activity.id)] ?? [];

                  return (
                    <div
                      key={activity.id}
                      className="absolute bottom-3 top-3 flex items-center overflow-hidden rounded-lg"
                      style={{
                        left: `${Math.round(startMin * zoom)}px`,
                        width: `${Math.round(widthMin * zoom)}px`,
                        background: color.bg,
                        border: `0.5px solid ${color.border}`,
                      }}
                    >
                      {actSessions.map((session) => {
                        const sStart = tsToMinutes(session.enter_time);
                        const sEnd = tsToMinutes(session.close_time);
                        const sWidth = Math.max(sEnd - sStart, 1);
                        const relLeft = sStart - startMin;

                        return (
                          <div
                            key={session.id}
                            className="absolute bottom-0 top-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-md"
                            style={{
                              left: `${Math.round(relLeft * zoom)}px`,
                              width: `${Math.round(sWidth * zoom)}px`,
                              background: color.bg.replace("0.10", "0.30"),
                              border: `0.5px solid ${color.border}`,
                            }}
                            title={`${session.file?.name ?? "—"} (${session.file?.language ?? "—"})`}
                          >
                            <span
                              className={`truncate px-1 text-[11px] font-medium ${color.text}`}
                            >
                              {session.file?.name ?? "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Empty state overlay */}
            {!hasActivities && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-gray-400 dark:text-zinc-500">
                  No activities this week
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleChart;
