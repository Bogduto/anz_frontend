import React from "react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-10 font-sans text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50 sm:px-8">
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white/95 p-7 text-sm shadow-xl shadow-black/10 backdrop-blur-sm dark:bg-zinc-900/90">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Sign in with GitHub
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Use your GitHub account to access repository dashboards and activity.
          </p>
        </header>

        <div className="space-y-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-white text-[10px] font-bold text-zinc-900">
              GH
            </span>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-2 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <p>
            This is a mock GitHub authentication screen. Wire this button up to your
            real GitHub OAuth / NextAuth configuration when you are ready.
          </p>
        </div>
      </main>
    </div>
  );
}

