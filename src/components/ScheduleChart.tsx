"use client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import formatTimeDuration from "@/utils/formatTimeDuration";
import isSameUTCDate from "./ScheduleChart/todayHightling";
import useSyncScroll from "./ScheduleChart/useSyncScroll";
import useZoom from "./ScheduleChart/useZoom";
import getColor from "./ScheduleChart/getColor";
import { Activity, Session } from "@/app/(private)/repositories/[id]/types";
dayjs.extend(duration);

const DAY_NAMES = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
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

  const totalWidth = TOTAL_MINUTES * zoom;
  const step = getStep(zoom);
  const dayEntries = Object.entries(days) as [string, Activity[]][];
  const hasActivities = dayEntries.some(([, acts]) => acts.length > 0);

  const cellStyle = (isToday: boolean, isEven: boolean): React.CSSProperties => ({
    height: "100px",
    borderBottom: "0.5px solid var(--color-border-tertiary)",
    background: isToday
      ? "rgba(245,158,11,0.07)"
      : isEven
      ? "var(--color-background-primary)"
      : "var(--color-background-secondary)",
    position: "relative",
  });

  return (
    <div style={{ width: "100%" }}>
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          minWidth: 0,
        }}
      >
        <div
          style={{
            padding: "10px 12px",
            fontSize: "11px",
            color: "var(--color-text-tertiary)",
            borderRight: "0.5px solid var(--color-border-tertiary)",
          }}
        >
          Час
        </div>
        <div
          ref={headerRef}
          style={{ overflow: "hidden", position: "relative", height: "32px", minWidth: 0 }}
          onScroll={() => syncScroll("header")}
        >
          <div style={{ width: totalWidth, position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
            {Array.from({ length: TOTAL_MINUTES / step }).map((_, i) => {
              const minutes = i * step;
              const h = Math.floor(minutes / 60);
              const m = minutes % 60;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${Math.round(minutes * zoom)}px`,
                    fontSize: "10px",
                    color: "var(--color-text-tertiary)",
                    flexShrink: 0,
                    paddingLeft: "4px",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  {h}:{m.toString().padStart(2, "0")}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", minWidth: 0 }}>
        {/* DAY LABELS */}
        <div style={{ borderRight: "0.5px solid var(--color-border-tertiary)", flexShrink: 0 }}>
          {dayEntries.map(([dateKey, dateValue]) => {
            const date = new Date(dateKey + "T00:00:00Z");
            const dayNum = date.getUTCDate();
            const dayName = DAY_NAMES[date.getUTCDay()];
            const isToday = isSameUTCDate(date, new Date());

            const total = dateValue.reduce((p, c) => p + c.total_duration, 0);
            const totalLabel = total === 0 ? "—" : formatTimeDuration(total);

            return (
              <div
                key={dateKey}
                style={{
                  padding: "10px 12px",
                  height: "100px",
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                  background: isToday ? "rgba(245,158,11,0.07)" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: "11px", color: isToday ? "#F59E0B" : "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                  {dayName}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: isToday ? "#F59E0B" : "var(--color-text-primary)", margin: "2px 0" }}>
                  {dayNum}
                </div>
                <div style={{ fontSize: "10px", color: "var(--color-text-tertiary)" }}>
                  {isToday ? "Сьогодні" : totalLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* TIMELINE */}
        <div
          ref={bodyRef}
          style={{ overflow: "auto", scrollbarWidth: "thin", minWidth: 0 }}
          onScroll={() => syncScroll("body")}
          onWheel={handleWheel}
        >
          <div style={{ width: totalWidth, position: "relative" }}>
            {dayEntries.map(([dateKey, activities], i) => {
              const date = new Date(dateKey + "T00:00:00Z");
              const isToday = isSameUTCDate(date, new Date());

              return (
                <div key={dateKey} style={cellStyle(isToday, i % 2 === 0)}>
                  {/* Hour gridlines */}
                  {Array.from({ length: 25 }).map((_, h) => (
                    <div
                      key={h}
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: `${Math.round(h * 60 * zoom)}px`,
                        width: "0.5px",
                        background: "var(--color-border-tertiary)",
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
                        style={{
                          position: "absolute",
                          top: "10px",
                          height: "32px",
                          left: `${Math.round(startMin * zoom)}px`,
                          width: `${Math.round(widthMin * zoom)}px`,
                          borderRadius: "4px",
                          background: color.bg,
                          border: `0.5px solid ${color.border}`,
                          display: "flex",
                          alignItems: "center",
                          overflow: "hidden",
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
                              title={`${session.file?.name ?? "—"} (${session.file?.language ?? "—"})`}
                              style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: `${Math.round(relLeft * zoom)}px`,
                                width: `${Math.round(sWidth * zoom)}px`,
                                background: color.bg.replace("0.10", "0.30"),
                                border: `0.5px solid ${color.border}`,
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ fontSize: "11px", padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-text-primary)" }}>
                                {session.file?.name ?? "—"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {!hasActivities && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  color: "var(--color-text-tertiary)",
                  pointerEvents: "none",
                }}
              >
                Немає активностей цього тижня
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleChart;
