"use client";

import Link from "next/link";
import formatTimeDuration from "@/utils/formatTimeDuration";

type AccentColor = {
  accent: string;
  iconBg: string;
  iconText: string;
  bar: string;
};

type WorkspaceCardProps = {
  id: number;
  name: string;
  href: string;
  total_duration: number | null;
  created_at: string;
  color: AccentColor;
  barWidth: number;
};

export default function WorkspaceCard({
  id,
  name,
  href,
  total_duration,
  created_at,
  color,
  barWidth,
}: WorkspaceCardProps) {
  const duration = total_duration ?? 0;
  const createdAt = new Date(created_at).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/repositories/${id}`} style={{ textDecoration: "none" }}>
      <div
        className="ws-card"
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.15s, transform 0.1s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color.accent;
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border-tertiary)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color.accent }} />

        {/* Icon */}
        <div style={{ marginBottom: "12px", marginTop: "6px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "var(--border-radius-md)",
              background: color.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: color.iconText,
            }}
          >
            <i className="ti ti-clock" aria-hidden="true" />
          </div>
        </div>

        {/* Name + href */}
        <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          {name}
        </div>
        <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginBottom: "14px", fontFamily: "var(--font-mono)" }}>
          /{href}
        </div>

        <div style={{ height: "0.5px", background: "var(--color-border-tertiary)", marginBottom: "14px" }} />

        {/* Duration */}
        <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
          Загальний час
        </div>
        <div style={{ fontSize: "22px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "14px" }}>
          {duration > 0 ? formatTimeDuration(duration) : "—"}
        </div>

        {/* Progress bar */}
        <div style={{ height: "4px", background: "var(--color-background-secondary)", borderRadius: "2px", marginBottom: "14px" }}>
          <div style={{ height: "4px", borderRadius: "2px", background: color.bar, width: `${barWidth}%` }} />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <i className="ti ti-calendar" style={{ fontSize: "13px" }} aria-hidden="true" />
            {createdAt}
          </span>
          <span style={{ fontSize: "12px", color: "var(--color-brand)", display: "flex", alignItems: "center", gap: "3px" }}>
            Відкрити <i className="ti ti-arrow-right" style={{ fontSize: "13px" }} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
