import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Activity Insights – Landing",
  description:
    "Landing page for a code activity analytics system that captures developer activity in VS Code, stores it in Supabase, and visualizes productivity with a modern Next.js web UI.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 sm:px-8">
      <main
        className="mx-auto flex w-full max-w-5xl flex-col gap-10"
        aria-label="Product landing page"
      >
        {/* Hero / Title */}
        <section
          className="space-y-4 rounded-3xl bg-white/90 p-8 shadow-lg shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/80"
          aria-labelledby="landing-title"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <h1
              id="landing-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Code Activity Insights / Аналітика активності розробника
            </h1>
            <p
              className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              aria-label="Key technologies"
            >
              VS Code Plugin · Supabase · React · Next.js
            </p>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            A research‑driven information system that automatically tracks
            developer activity inside Visual Studio Code, stores the collected
            events in a Supabase backend, and provides a modern web interface
            for exploring productivity patterns. The solution combines a
            lightweight editor plugin, a scalable server component, and an
            interactive React/Next.js UI to turn raw edits, runs, and compile
            actions into actionable insights.
          </p>
        </section>

        {/* Short description */}
        <section
          className="space-y-3 rounded-3xl bg-white/95 p-7 text-sm leading-6 text-zinc-700 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/85 dark:text-zinc-200"
          aria-labelledby="landing-description"
        >
          <h2
            id="landing-description"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Short description / Короткий опис
          </h2>
          <p>
            The information system is designed to help engineering teams and
            individual developers better understand how time is spent while
            working on software projects. A Visual Studio Code plugin quietly
            captures non‑intrusive activity signals, such as opened files,
            editing sessions, and run or compile actions. These events are
            securely streamed to a Supabase backend, where they are normalized,
            aggregated, and stored for further analysis. On top of this data
            layer, a web interface built with React and Next.js provides
            secure authentication and fast server‑side rendering for key views.
          </p>
          <p>
            Within the web UI, users can explore their own history through
            interactive charts, timelines, and repository dashboards. Time
            usage is grouped by project, file, programming language, and
            session, making it easier to identify deep‑work intervals, frequent
            context switches, and potential bottlenecks in the development
            process. The goal is not to measure people, but to give
            developers transparent access to their own data so they can adjust
            workflows, plan realistic estimates, and reflect on long‑term
            productivity trends. Thanks to the modular architecture, the system
            can be extended with new visualizations, custom metrics, or
            integrations with existing analytics platforms.
          </p>
        </section>

        {/* Keywords */}
        <section
          className="space-y-3 rounded-3xl bg-white/95 p-7 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/85"
          aria-labelledby="landing-keywords"
        >
          <h2
            id="landing-keywords"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Keywords / Ключові слова
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-200">
            VS Code plugin, developer productivity analytics, time tracking,
            software engineering metrics, Supabase backend, Next.js dashboard,
            activity visualization, code statistics, repository insights,
            session analysis.
          </p>
        </section>

        {/* Purpose */}
        <section
          className="space-y-3 rounded-3xl bg-white/95 p-7 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/85"
          aria-labelledby="landing-purpose"
        >
          <h2
            id="landing-purpose"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Purpose of the study / Мета дослідження
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-200">
            To design and evaluate an integrated information system that
            automatically collects fine‑grained development activity in Visual
            Studio Code, persists it in a cloud‑based Supabase backend, and
            presents clear visual analytics in a web interface, enabling
            evidence‑based decisions about personal and team productivity.
          </p>
        </section>

        {/* Main tasks */}
        <section
          className="space-y-3 rounded-3xl bg-white/95 p-7 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/85"
          aria-labelledby="landing-tasks"
        >
          <h2
            id="landing-tasks"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Main tasks / Основні завдання
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
            <li>
              Develop a Visual Studio Code plugin that records user activity and
              sends structured events to the backend in real time.
            </li>
            <li>
              Implement a Supabase‑based server component for secure storage,
              aggregation, and querying of activity data.
            </li>
            <li>
              Build a responsive React/Next.js web interface for
              authentication, visualization of statistics, and repository
              dashboards.
            </li>
            <li>
              Design intuitive charts, timelines, and reports that highlight
              time usage, context switching, and deep‑work sessions.
            </li>
            <li>
              Evaluate performance, usability, and the usefulness of insights
              for developers and teams.
            </li>
          </ul>
        </section>

        {/* Expected result */}
        <section
          className="space-y-3 rounded-3xl bg-white/95 p-7 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/85"
          aria-labelledby="landing-result"
        >
          <h2
            id="landing-result"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Expected result / Очікуваний результат
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-200">
            A working prototype of an information system that connects a VS Code
            plugin, a Supabase backend, and a Next.js web dashboard, delivering
            fast, SEO‑friendly, and accessible views of development activity
            across projects. Users should be able to authenticate, review their
            own sessions, explore statistics per repository, and discover
            patterns that support more focused and predictable software
            development.
          </p>
        </section>

        {/* Contact information */}
        <section
          className="space-y-3 rounded-3xl bg-white/95 p-7 shadow-md shadow-black/5 backdrop-blur-sm dark:bg-zinc-900/85"
          aria-labelledby="landing-contact"
        >
          <h2
            id="landing-contact"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Contact information / Контактна інформація
          </h2>
          <dl className="grid gap-2 text-sm text-zinc-700 dark:text-zinc-200 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Email
              </dt>
              <dd>
                <a
                  href="mailto:bogdanbogdanvakulenka@gmail.com"
                  className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  bogdanbogdanvakulenka@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                GitHub
              </dt>
              <dd>
                <a
                  href="https://github.com/Bogduto"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  github.com/Bogduto
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Telegram
              </dt>
              <dd>
                <a
                  href="https://t.me/bogduto"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  @bogduto
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}

