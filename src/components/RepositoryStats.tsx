import { createClient } from "@/lib/supabase/server";
import ScheduleChart from "./ScheduleChart";

// type RepositoryStatsProps = {
//   workspace_id: string;
//   date?: Date;
// };

// function getWeekRange(date) {
//   const start = new Date(date);

//   const day = start.getUTCDay(); // UTC!!!
//   const diffToMonday = day === 0 ? -6 : 1 - day;

//   start.setUTCDate(start.getUTCDate() + diffToMonday);
//   start.setUTCHours(0, 0, 0, 0);

//   const end = new Date(start);
//   end.setUTCDate(start.getUTCDate() + 6);
//   end.setUTCHours(23, 59, 59, 999);

//   return { start, end };
// }

// const getDayKey = (date) => {
//   const d = new Date(date);

//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// function getDatesInRange(start, end) {
//   const dates = [];
//   const current = new Date(start);

//   current.setUTCHours(0, 0, 0, 0);
//   const endNorm = new Date(end);
//   endNorm.setUTCHours(0, 0, 0, 0);

//   while (current <= endNorm) {
//     dates.push(new Date(current));
//     current.setUTCDate(current.getUTCDate() + 1);
//   }

//   return dates;
// }

// // optimize it with https://chatgpt.com/c/69e0a4b9-9bc0-832c-98dc-0cac344524bc
// const fetchWeekStatistic = async (workspace_id, date) => {
//   const supabase = await createClient();

//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     return {
//       error: "Unauthorized",
//       message: userError?.message ?? "No user session",
//     };
//   }

//   // const { start, end } = getWeekRange(new Date(2026, 3, 7));
//   // const days = getDatesInRange(start, end);

//   const { start, end } = getWeekRange(date);
//   const days = getDatesInRange(start, end);

//   const { data: activities } = await supabase
//     .schema("itallo")
//     .from("activity")
//     .select("*")
//     .eq("workspace_id", workspace_id)
//     .gte("created_at", start.toISOString())
//     .lt("created_at", end.toISOString());

//   const { data: sessions } = await supabase
//     .schema("itallo")
//     .from("session")
//     .select(
//       `
//       id,
//       enter_time,
//       close_time,
//       activity_id,
//       file:file_id (
//         id,
//         name,
//         pathname,
//         language
//       )`,
//     )
//     .gte("created_at", start.toISOString())
//     .lt("created_at", end.toISOString());

//   const a: Record<string, any[]> = {};

//   days.forEach((day) => {
//     const key = getDayKey(day);
//     a[key] = [];
//   });

//   activities?.forEach((activity) => {
//     const key = getDayKey(activity.created_at);

//     if (!days.some((day) => getDayKey(day) === key)) return;
//     if (!a[key]) a[key] = [];

//     a[key].push(activity);
//   });

//   const s: Record<string, any[]> = {};

//   activities?.forEach((activity) => {
//     const child_sessions =
//       sessions?.filter((session) => session.activity_id === activity.id) ?? [];
//     s[activity.id] = child_sessions;
//   });

//   return {
//     days: a,
//     sessions: s,
//   };
// };

export async function RepositoryStats(
  {
    // workspace_id,
    // date,
  },
) {
  // const start = date || new Date();

  // const response = await fetchWeekStatistic(workspace_id, start);

  // if (response?.error) {
  //   return <div>something went wrong</div>;
  // }

  return (
    <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/70">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Repository statistics
      </h2>
      {/* today */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Today
        </h3>

        <div></div>
      </div>

      {/* schedule chart */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Weekly schedule
        </h3>
        <ScheduleChart response={response} />
      </div>
    </section>
  );
}
