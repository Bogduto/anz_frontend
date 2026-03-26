import { RepositoryList } from "@/components/RepositoryList";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 sm:px-8">
      <main className="mx-auto flex w-full max-w-5xl flex-col">
        <header className="pb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Repositories
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Browse repositories. Click a card to view details and statistics.
          </p>
        </header>

        <RepositoryList />
      </main>
    </div>
  );
}
