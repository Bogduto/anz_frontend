import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "anz — Трекер активності у воркспейсах",
  description:
    "anz автоматично фіксує скільки часу ти витрачаєш на кожен проєкт, які файли відкриваєш та коли найбільш продуктивний.",
};

const GITHUB_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function LandingPage() {
  const btnPrimary: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 500,
    padding: "10px 20px",
    borderRadius: "var(--border-radius-md)",
    background: "#F5F0E8",
    color: "#1C1917",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        background: "var(--color-background-tertiary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HERO ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "5rem 2rem 3.5rem",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 500,
            padding: "4px 12px",
            borderRadius: "20px",
            background: "rgba(245,158,11,0.12)",
            color: "#F59E0B",
            marginBottom: "1.5rem",
          }}
        >
          <i
            className="ti ti-clock"
            style={{ fontSize: "13px" }}
            aria-hidden="true"
          />
          Трекер активності
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            lineHeight: 1.2,
            marginBottom: "1rem",
            maxWidth: "520px",
          }}
        >
          Відстежуй час роботи у{" "}
          <span style={{ color: "#F59E0B" }}>воркспейсах</span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "16px",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "420px",
            marginBottom: "2rem",
          }}
        >
          anz автоматично фіксує скільки часу ти витрачаєш на кожен проєкт, які
          файли відкриваєш та коли найбільш продуктивний.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/auth" style={btnPrimary}>
            {GITHUB_ICON}
            Почати з GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
