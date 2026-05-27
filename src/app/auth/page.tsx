"use client";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const handleGitHubSignIn = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  return (
    <div
      style={{
        background: "var(--color-background-tertiary)",
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "2rem",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--border-radius-md)",
              background: "var(--color-brand-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--color-brand)",
            }}
          >
            a
          </div>
          <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-text-primary)" }}>
            anz
          </span>
        </div>

        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "6px" }}>
          Увійти в акаунт
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "1.75rem" }}>
          Використай свій GitHub акаунт для доступу до воркспейсів та статистики активності.
        </p>

        {/* GitHub button */}
        <button
          type="button"
          onClick={handleGitHubSignIn}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "11px 16px",
            borderRadius: "var(--border-radius-md)",
            background: "#F5F0E8",
            color: "#1C1917",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "1.5rem",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1C1917" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          Continue with GitHub
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1, height: "0.5px", background: "var(--color-border-tertiary)" }} />
          <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>що ти отримаєш</span>
          <div style={{ flex: 1, height: "0.5px", background: "var(--color-border-tertiary)" }} />
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.75rem" }}>
          {[
            { icon: "ti-clock", text: "Трекінг часу по воркспейсах" },
            { icon: "ti-chart-bar", text: "Детальна статистика активності" },
            { icon: "ti-file-analytics", text: "Аналіз використання файлів" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--border-radius-md)",
                  background: "var(--color-brand-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "var(--color-brand)",
                  flexShrink: 0,
                }}
              >
                <i className={`ti ${icon}`} aria-hidden="true" />
              </div>
              {text}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", textAlign: "center", lineHeight: 1.6 }}>
          Продовжуючи, ти погоджуєшся з{" "}
          <a href="#" style={{ color: "var(--color-brand)", textDecoration: "none" }}>умовами використання</a>
          {" "}та{" "}
          <a href="#" style={{ color: "var(--color-brand)", textDecoration: "none" }}>політикою конфіденційності</a>.
        </p>
      </div>
    </div>
  );
}
