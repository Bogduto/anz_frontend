import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-10 font-sans text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50 sm:px-8">
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white/95 p-7 text-sm shadow-xl shadow-black/10 backdrop-blur-sm dark:bg-zinc-900/90">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-red-600 dark:text-red-400">
            Authentication failed
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Something went wrong during sign in. Please try again.
          </p>
        </header>

        <Link
          href="/auth"
          className="flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Back to sign in
        </Link>
      </main>
    </div>
  );
}
