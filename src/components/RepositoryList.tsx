import { Workspace } from "@/app/(private)/repositories/[id]/types";
import { createClient } from "@/lib/supabase/server";
import WorkspaceCard from "./WorkspaceCard";

const ACCENT_COLORS = [
  { accent: "#F59E0B", iconBg: "rgba(245,158,11,0.12)", iconText: "#F59E0B", bar: "#F59E0B" },
  { accent: "#FB7185", iconBg: "rgba(251,113,133,0.12)", iconText: "#FB7185", bar: "#FB7185" },
  { accent: "#F5F0E8", iconBg: "rgba(245,240,232,0.10)", iconText: "#F5F0E8", bar: "#F5F0E8" },
];

const fetchRepositories = async (): Promise<Workspace[] | { error: string; message: string }> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized", message: userError?.message ?? "No user session" };
    }

    const { data: repositories, error: fetchError } = await supabase
      .schema("itallo")
      .from("workspace")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      return { error: "Failed to fetch workspaces", message: fetchError.message };
    }

    return repositories ?? [];
  } catch (error) {
    console.error(error);
    return { error: "Unexpected error", message: "Failed to load repositories" };
  }
};

export async function RepositoryList() {
  const result = await fetchRepositories();

  if ("error" in result) {
    return (
      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "14px", color: "#ef4444" }}>
        {result.message}
      </div>
    );
  }

  if (result.length === 0) {
    return (
      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "14px", color: "var(--color-text-tertiary)" }}>
        Воркспейсів не знайдено.
      </div>
    );
  }

  const maxDuration = Math.max(...result.map((r) => r.total_duration ?? 0), 1);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
        gap: "14px",
      }}
    >
      {result.map((repo, index) => (
        <WorkspaceCard
          key={repo.id}
          id={repo.id}
          name={repo.name}
          href={repo.href}
          total_duration={repo.total_duration}
          created_at={repo.created_at}
          color={ACCENT_COLORS[index % ACCENT_COLORS.length]}
          barWidth={Math.round(((repo.total_duration ?? 0) / maxDuration) * 100)}
        />
      ))}
    </div>
  );
}
