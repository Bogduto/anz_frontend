import { Workspace } from "@/app/(private)/repositories/[id]/types";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const fetchRepositories = async () => {
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

    const { data: repositories, error: fetchError } = await supabase
      .schema("itallo")
      .from("workspace")
      .select("*")
      .eq("user_id", user.id);

    if (fetchError) {
      return {
        error: "Failed to fetch workspaces",
        message: fetchError.message,
      };
    }

    // make request to github api and get repository logo if exist and some description 

    return repositories
  } catch (error) {
    console.log(error);
  }
};

export async function RepositoryList() {
  const repositories = await fetchRepositories() as Workspace[];

  if (!repositories) return <div>something went wrong</div>;
  
  if (repositories.length === 0) {
    return <div className="mt-8 text-center text-sm text-zinc-500">No repositories found.</div>;
  }

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {repositories.map((repo) => (
        <Link
          key={repo.id}
          href={`/repositories/${repo.id}`}
          className="group flex flex-col rounded-xl border border-zinc-200 bg-white/70 p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-950 dark:text-zinc-50">
              {repo.name}
            </h2>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {/* {repo.status} */}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
