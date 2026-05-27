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

// getUTCDay() returns 0=Sun, 1=Mon, ... 6=Sat
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TOTAL_MINUTES = 1440;

// Convert Unix ms timestamp → minutes from midnight (UTC)
// function tsToMinutes(ts: number) {
//   const d = new Date(ts);
//   return d.getUTCHours() * 60 + d.getUTCMinutes();
// }

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
  sessions: Record<number, Session[]>;
}) {
  const { headerRef, bodyRef, syncScroll } = useSyncScroll();
  const { zoom, handleWheel } = useZoom({ bodyRef });

  const pxPerMinute = zoom;
  const totalWidth = TOTAL_MINUTES * pxPerMinute;

  const step = getStep(zoom);

  // Ordered list of [dateKey, activities[]]
  const dayEntries = Object.entries(days) as [string, Activity[]][]; // add total for day

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      {/* HEADER */}
      <div className="flex bg-white border-b border-gray-100">
        <div className="w-24 flex-shrink-0 border-r border-gray-100 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
            Time
          </span>
        </div>
        <div
          ref={headerRef}
          className="relative h-10 overflow-x-hidden flex-1"
          onScroll={() => syncScroll("header")}
        >
          <div
            style={{ width: totalWidth, position: "relative", height: "100%" }}
          >
            {Array.from({ length: TOTAL_MINUTES / step }).map((_, i) => {
              const minutes = i * step;
              const h = Math.floor(minutes / 60);
              const m = minutes % 60;
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-start top-0"
                  style={{ left: `${Math.round(minutes * zoom)}px` }}
                >
                  <div className="w-px h-2 bg-gray-200" />
                  <span className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap select-none">
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
        {/* DAY LABELS — driven by actual dates from response */}
        <div className="w-24 flex-shrink-0 border-r border-gray-100 bg-white">
          {dayEntries.map(([dateKey, dateValue]) => {
            const date = new Date(dateKey + "T00:00:00Z");
            const dayNum = date.getUTCDate();
            const dayName = DAY_NAMES[date.getUTCDay()];

            const total = dateValue.reduce(
              (prev, cur) => prev + cur.total_duration,
              0,
            );

            const day_activity_total =
              total === 0 ? "No activities" : formatTimeDuration(total);

            const now = new Date();

            const isToday = isSameUTCDate(date, now);

            return (
              <div
                key={dateKey}
                className={cn(
                  "h-[100px] flex flex-col items-center justify-center gap-0.5 border-b border-gray-100 last:border-b-0",
                  isToday ? "bg-[hsl(242,93%,76%,0.3)]" : null,
                )}
              >
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  {dayName}
                </span>
                <span className="text-base font-normal text-gray-500">
                  {dayNum}
                </span>

                <span className="text-[12px] font-normal text-gray-500">
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
            {/* One row per day */}
            {dayEntries.map(([dateKey, activities], i) => (
              <div
                key={dateKey}
                className={`h-[100px] border-b border-gray-100 last:border-b-0 relative ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                }`}
              >
                {/* Hour gridlines */}
                {Array.from({ length: 25 }).map((_, h) => (
                  <div
                    key={h}
                    className="absolute top-0 bottom-0 bg-gray-100"
                    style={{
                      left: `${Math.round(h * 60 * zoom)}px`,
                      width: "0.5px",
                    }}
                  />
                ))}

                {/* Activities for THIS day */}
                {activities.map((activity) => {
                  const startMin = tsToMinutes(activity.start);
                  let endMin = tsToMinutes(activity.end);

                  if (endMin < startMin) {
                    endMin += 1440; // перенос на следующий день
                  }

                  const widthMin = Math.max(endMin - startMin, 2); // at least 2min wide
                  const color = getColor(activity.workspace_id);

                  // Sessions belonging to this activity
                  const actSessions: Session[] = sessions[activity.id] ?? [];

                  return (
                    <div
                      key={activity.id}
                      className="absolute top-3 bottom-3 rounded-lg flex items-center overflow-hidden"
                      style={{
                        left: `${Math.round(startMin * zoom)}px`,
                        width: `${Math.round(widthMin * zoom)}px`,
                        background: color.bg,
                        border: `0.5px solid ${color.border}`,
                      }}
                    >
                      {/* Sessions inside the activity bar */}
                      {actSessions.map((session) => {
                        const sStart = tsToMinutes(session.enter_time);
                        const sEnd = tsToMinutes(session.close_time);
                        const sWidth = Math.max(sEnd - sStart, 1);
                        const relLeft = sStart - startMin;

                        return (
                          <div
                            key={session.id}
                            className={`absolute top-0 bottom-0 rounded-md flex justify-center items-center overflow-hidden cursor-pointer`}
                            style={{
                              left: `${Math.round(relLeft * zoom)}px`,
                              width: `${Math.round(sWidth * zoom)}px`,
                              background: color.bg.replace("0.10", "0.30"),
                              border: `0.5px solid ${color.border}`,
                            }}
                            title={`${session.file?.name} (${session.file?.language})`}
                          >
                            <span
                              className={`text-[11px] font-medium ${color.text} px-1 truncate`}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleChart;
