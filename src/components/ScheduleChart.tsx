"use client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";
import formatTimeDuration from "@/utils/formatTimeDuration";
import isSameUTCDate from "./ScheduleChart/todayHightling";
import useSyncScroll from "./ScheduleChart/useSyncScroll";
import useZoom from "./ScheduleChart/useZoom";
import getColor from "./ScheduleChart/getColor";
import { Activity, Session } from "@/app/(private)/repositories/[id]/types";
dayjs.extend(duration);

type TooltipInfo = {
  x: number;
  y: number;
  name: string;
  lang: string;
  start: string;
  end: string;
  duration: string;
};

function formatTs(ts: number): string {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

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
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

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
    <div style={{ width: "100%", position: "relative" }}>
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 14,
            left: tooltip.x + 14,
            zIndex: 1000,
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)",
            padding: "10px 14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            pointerEvents: "none",
            minWidth: "160px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "8px", fontFamily: "var(--font-mono)" }}>
            {tooltip.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px" }}>
              <span style={{ color: "var(--color-text-tertiary)" }}>Початок</span>
              <span style={{ color: "var(--color-text-primary)" }}>{tooltip.start}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px" }}>
              <span style={{ color: "var(--color-text-tertiary)" }}>Кінець</span>
              <span style={{ color: "var(--color-text-primary)" }}>{tooltip.end}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px", marginTop: "4px", paddingTop: "6px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
              <span style={{ color: "var(--color-text-tertiary)" }}>Час</span>
              <span style={{ color: "var(--color-brand)", fontWeight: 500 }}>{tooltip.duration}</span>
            </div>
          </div>
        </div>
      )}
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
                          top: "6px",
                          height: "88px",
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
                              onMouseEnter={(e) =>
                                setTooltip({
                                  x: e.clientX,
                                  y: e.clientY,
                                  name: session.file?.name ?? "—",
                                  lang: session.file?.language ?? "—",
                                  start: formatTs(session.enter_time),
                                  end: formatTs(session.close_time),
                                  duration: formatTimeDuration(session.close_time - session.enter_time),
                                })
                              }
                              onMouseMove={(e) =>
                                setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)
                              }
                              onMouseLeave={() => setTooltip(null)}
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
