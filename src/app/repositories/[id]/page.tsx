import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRepositoryById, repositories } from "@/lib/data";
import { RepositoryStats } from "@/components/RepositoryStats";

type RepositoryPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return repositories.map((repo) => ({ id: repo.id }));
}
// repository detail page
export default async function RepositoryDetailPage({ params }: RepositoryPageProps) {
  const { id } = await params;
  const repository = getRepositoryById(id);

  if (!repository) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 sm:px-8">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Link
          href="/"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Back to repositories
        </Link>

        <section className="rounded-3xl bg-white/90 p-7 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {repository.title}
            </h1>
            <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
              {repository.visibility.toUpperCase()}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {repository.description}
          </p>
        </section>

        <Suspense
          fallback={
            <section className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
              Loading statistics…
            </section>
          }
        >
          <RepositoryStats projectId={repository.id} userId={repository.user_id} />
        </Suspense>
      </main>
    </div>
  );
}
