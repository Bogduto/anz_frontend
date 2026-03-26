"use client";

import Link from "next/link";
import { repositories } from "@/lib/data";

export function RepositoryList() {
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
              {repo.title}
            </h2>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {repo.visibility}
            </span>
          </div>
          <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
            {repo.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
