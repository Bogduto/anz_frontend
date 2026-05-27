import { RepositoryList } from "@/components/RepositoryList";

export default function Home() {
  return (
    <div
      style={{
        background: "var(--color-background-tertiary)",
        minHeight: "calc(100vh - 56px)",
        padding: "2.5rem 2rem",
      }}
    >
      <main style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "4px" }}>
              Workspaces
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
              Перегляд проектів та статистика часу
            </p>
          </div>
        </div>

        <RepositoryList />
      </main>
    </div>
  );
}
