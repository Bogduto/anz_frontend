import { createClient } from "@/lib/supabase/server";
import { WeekStats } from "./types";

export interface FetchRepositoryParams {
  id: string;
  date?: string;
}

export interface RepositoryResponse {
  workspace: Workspace;
  weekStats: WeekStats;
}

export interface RepositoryErrorResponse {
  error: string;
  message: string;
}

export type Response = Promise<RepositoryResponse | RepositoryErrorResponse>;

const fetchRepository = async ({
  id,
  date,
}: FetchRepositoryParams): Response => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "Unauthorized",
        message: userError?.message ?? "No user session",
      };
    }

    const workspaceId = Number(id);
    if (isNaN(workspaceId)) {
      return { error: "Invalid workspace ID", message: "ID must be a number" };
    }

    const { data: workspace, error: workspaceError } = await supabase
      .schema("itallo")
      .from("workspace")
      .select("*")
      .eq("id", workspaceId)
      .eq("user_id", user.id)
      .single();

    if (workspaceError) {
      return {
        error: "Failed to fetch workspace",
        message: workspaceError.message,
      };
    }

    const { data: weekStats, error } = await supabase
      .schema("itallo")
      .rpc("get_workspace_week_stats", {
        p_workspace_id: workspaceId,
        p_date: date,
      });

    if (error) {
      return {
        error: "Failed to fetch repository stats",
        message: error.message,
      };
    }

    return {
      workspace,
      weekStats,
    };
  } catch (error) {
    console.log(error);
    return { error: "Invalid workspace ID", message: "ID must be a number" };
  }
};

export default fetchRepository;

