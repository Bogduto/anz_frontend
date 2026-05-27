"use client";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

const STORE_FORMAT = "YYYY-MM-DD";
const DISPLAY_FORMAT = "DD.MM.YYYY";
const MONTH_NAMES_UK = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень",
];
const DOW_LABELS = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"];

function buildMonthDays(month: dayjs.Dayjs) {
  const start = month.startOf("month");
  const end = month.endOf("month");
  const startDow = start.isoWeekday(); // 1=Mon … 7=Sun
  const days: Array<{ date: dayjs.Dayjs; isCurrentMonth: boolean }> = [];

  for (let i = startDow - 1; i > 0; i--)
    days.push({ date: start.subtract(i, "day"), isCurrentMonth: false });

  for (let d = 1; d <= end.date(); d++)
    days.push({ date: month.date(d), isCurrentMonth: true });

  const rem = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= rem; i++)
    days.push({ date: end.add(i, "day"), isCurrentMonth: false });

  return days;
}

function MonthCalendar({
  month,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  showPrev,
  showNext,
}: {
  month: dayjs.Dayjs;
  selectedDay: dayjs.Dayjs;
  onSelectDay: (d: dayjs.Dayjs) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  showPrev: boolean;
  showNext: boolean;
}) {
  const weekStart = selectedDay.startOf("isoWeek");
  const weekEnd = selectedDay.endOf("isoWeek");
  const todayStr = dayjs().format(STORE_FORMAT);
  const days = buildMonthDays(month);

  const navBtn: React.CSSProperties = {
    width: "26px",
    height: "26px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-tertiary)",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--color-text-secondary)",
    fontSize: "15px",
    padding: 0,
    flexShrink: 0,
  };

  return (
    <div style={{ width: "210px" }}>
      {/* Month header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        {showPrev ? (
          <button style={navBtn} onClick={onPrevMonth} aria-label="Попередній місяць">
            <i className="ti ti-chevron-left" aria-hidden="true" />
          </button>
        ) : <div style={{ width: "26px" }} />}

        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)" }}>
          {MONTH_NAMES_UK[month.month()]} {month.year()}
        </span>

        {showNext ? (
          <button style={navBtn} onClick={onNextMonth} aria-label="Наступний місяць">
            <i className="ti ti-chevron-right" aria-hidden="true" />
          </button>
        ) : <div style={{ width: "26px" }} />}
      </div>

      {/* Day-of-week labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {DOW_LABELS.map((d) => (
          <div key={d} style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textAlign: "center", padding: "4px 0" }}>
            {d}
          </div>
        ))}

        {/* Days */}
        {days.map(({ date, isCurrentMonth }, idx) => {
          const dateStr = date.format(STORE_FORMAT);
          const isToday = dateStr === todayStr;
          const isStart = dateStr === weekStart.format(STORE_FORMAT);
          const isEnd = dateStr === weekEnd.format(STORE_FORMAT);
          const isInRange =
            (date.isAfter(weekStart) || dateStr === weekStart.format(STORE_FORMAT)) &&
            (date.isBefore(weekEnd) || dateStr === weekEnd.format(STORE_FORMAT));

          let bg = "transparent";
          let color = isCurrentMonth ? "var(--color-text-primary)" : "var(--color-text-tertiary)";
          let borderRadius = "var(--border-radius-md)";

          if (isStart && isEnd) {
            bg = "#F5F0E8"; color = "#1C1917"; borderRadius = "var(--border-radius-md)";
          } else if (isStart) {
            bg = "#F5F0E8"; color = "#1C1917"; borderRadius = "var(--border-radius-md) 0 0 var(--border-radius-md)";
          } else if (isEnd) {
            bg = "#F5F0E8"; color = "#1C1917"; borderRadius = "0 var(--border-radius-md) var(--border-radius-md) 0";
          } else if (isInRange) {
            bg = "rgba(245,240,232,0.12)"; color = "rgba(245,240,232,0.9)"; borderRadius = "0";
          }

          return (
            <div
              key={idx}
              onClick={() => onSelectDay(date)}
              style={{
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                color,
                background: bg,
                borderRadius,
                cursor: "pointer",
                position: "relative",
                fontWeight: isToday ? 500 : "normal",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isStart && !isEnd && !isInRange)
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                if (!isStart && !isEnd && !isInRange)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {date.date()}
              {isToday && !isInRange && (
                <span style={{
                  position: "absolute",
                  bottom: "3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#F5F0E8",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const WeeklyDatePicker = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const startParam = searchParams.get("start");
  const currentDay = startParam ? dayjs(startParam, STORE_FORMAT) : dayjs();
  const [viewMonth, setViewMonth] = useState(() => currentDay.startOf("month"));

  const weekStart = currentDay.startOf("isoWeek");
  const weekEnd = weekStart.add(6, "day");

  const navigate = useCallback(
    (date: dayjs.Dayjs) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("start", date.format(STORE_FORMAT));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handlePrevWeek = () => navigate(currentDay.subtract(7, "day"));
  const handleNextWeek = () => navigate(currentDay.add(7, "day"));

  const handleSelectDay = (date: dayjs.Dayjs) => {
    navigate(date);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btnStyle: React.CSSProperties = {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-tertiary)",
    background: "var(--color-background-primary)",
    cursor: "pointer",
    color: "var(--color-text-secondary)",
    fontSize: "16px",
    flexShrink: 0,
  };

  return (
    <div ref={wrapRef} style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
      {/* Prev week */}
      <button style={btnStyle} onClick={handlePrevWeek} aria-label="Попередній тиждень">
        <i className="ti ti-chevron-left" aria-hidden="true" />
      </button>

      {/* Trigger field */}
      <div
        onClick={() => setIsOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 14px",
          borderRadius: "var(--border-radius-md)",
          border: `0.5px solid ${isOpen ? "var(--color-border-secondary)" : "var(--color-border-tertiary)"}`,
          background: "var(--color-background-primary)",
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          cursor: "pointer",
          minWidth: "320px",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = "var(--color-border-secondary)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = "var(--color-border-tertiary)";
        }}
      >
        <i className="ti ti-calendar-range" style={{ fontSize: "16px", color: "var(--color-text-tertiary)", flexShrink: 0 }} aria-hidden="true" />
        <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>range</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{weekStart.format(DISPLAY_FORMAT)}</span>
        <span style={{ color: "var(--color-text-tertiary)", margin: "0 2px" }}>—</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{weekEnd.format(DISPLAY_FORMAT)}</span>
        <span style={{ margin: "0 6px", color: "var(--color-border-tertiary)" }}>|</span>
        <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>chosen</span>
        <span style={{ marginLeft: "6px", color: "var(--color-text-primary)", fontWeight: 500 }}>{currentDay.format(STORE_FORMAT)}</span>
        <i className="ti ti-calendar" style={{ color: "var(--color-text-tertiary)", marginLeft: "auto", fontSize: "16px", flexShrink: 0 }} aria-hidden="true" />
      </div>

      {/* Calendar popup */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "38px",
            zIndex: 100,
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1.25rem",
            display: "inline-flex",
            gap: "1.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <MonthCalendar
            month={viewMonth}
            selectedDay={currentDay}
            onSelectDay={handleSelectDay}
            onPrevMonth={() => setViewMonth((m) => m.subtract(1, "month"))}
            showPrev
            showNext={false}
          />
          <div style={{ width: "0.5px", background: "var(--color-border-tertiary)" }} />
          <MonthCalendar
            month={viewMonth.add(1, "month")}
            selectedDay={currentDay}
            onSelectDay={handleSelectDay}
            onNextMonth={() => setViewMonth((m) => m.add(1, "month"))}
            showPrev={false}
            showNext
          />
        </div>
      )}

      {/* Next week */}
      <button style={btnStyle} onClick={handleNextWeek} aria-label="Наступний тиждень">
        <i className="ti ti-chevron-right" aria-hidden="true" />
      </button>

      {/* Reset to current week */}
      <button
        onClick={() => navigate(dayjs())}
        aria-label="Поточний тиждень"
        style={{
          height: "30px",
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          borderRadius: "var(--border-radius-md)",
          border: "0.5px solid var(--color-border-tertiary)",
          background: "var(--color-background-primary)",
          cursor: "pointer",
          color: "var(--color-text-secondary)",
          fontSize: "12px",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F5F0E8"; e.currentTarget.style.color = "#F5F0E8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
      >
        <i className="ti ti-rotate" style={{ fontSize: "13px" }} aria-hidden="true" />
        Сьогодні
      </button>
    </div>
  );
};

export default WeeklyDatePicker;
