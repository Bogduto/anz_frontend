import type {
  Session,
  Slice,
  StatsFilters,
  SortBy,
  SortOrder,
  UserStats,
  SessionWithSlices,
  RepositoryStats,
} from "./types";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
}

function parseTimestamp(ts: string): Date {
  return new Date(ts);
}

function countOccurrences<T>(arr: T[]): Map<T, number> {
  const map = new Map<T, number>();
  for (const item of arr) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return map;
}

function topN<K, V>(map: Map<K, V>, n: number): [K, V][] {
  return Array.from(map.entries()).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, n);
}

export function computeRepositoryStats(
  sessions: Session[],
  slices: Slice[],
  users: { id: string; name: string }[],
  projectId: string,
  filters: StatsFilters = {},
  sortBy: SortBy = "duration",
  sortOrder: SortOrder = "desc"
): RepositoryStats {
  const dateFrom = filters.dateFrom ? parseTimestamp(filters.dateFrom) : null;
  const dateTo = filters.dateTo ? parseTimestamp(filters.dateTo) : null;

  const repoUserId = filters.repoUserId ?? null;
  let filtered = sessions.filter((s) => {
    if (s.project_id !== projectId) return false;
    if (repoUserId && s.user_id !== repoUserId) return false;
    if (filters.userId && s.user_id !== filters.userId) return false;
    if (dateFrom && parseTimestamp(s.start) < dateFrom) return false;
    if (dateTo && parseTimestamp(s.finish) > dateTo) return false;
    return true;
  });

  const sliceBySession = new Map<string, Slice[]>();
  for (const sl of slices) {
    if (!sliceBySession.has(sl.session_id)) {
      sliceBySession.set(sl.session_id, []);
    }
    sliceBySession.get(sl.session_id)!.push(sl);
  }

  const userMap = new Map(users.map((u) => [u.id, u.name]));

  const sessionsWithSlices: SessionWithSlices[] = filtered.map((s) => {
    const sessionSlices = sliceBySession.get(s.id) ?? [];
    const start = parseTimestamp(s.start);
    const finish = parseTimestamp(s.finish);
    const durationSeconds = (finish.getTime() - start.getTime()) / 1000;
    return {
      sessionId: s.id,
      userId: s.user_id,
      userName: userMap.get(s.user_id) ?? s.user_id,
      start: s.start,
      finish: s.finish,
      durationSeconds,
      sliceCount: sessionSlices.length,
    };
  });

  if (sortBy === "duration") {
    sessionsWithSlices.sort((a, b) =>
      sortOrder === "desc" ? b.durationSeconds - a.durationSeconds : a.durationSeconds - b.durationSeconds
    );
  } else if (sortBy === "date") {
    sessionsWithSlices.sort((a, b) =>
      sortOrder === "desc"
        ? parseTimestamp(b.start).getTime() - parseTimestamp(a.start).getTime()
        : parseTimestamp(a.start).getTime() - parseTimestamp(b.start).getTime()
    );
  } else {
    sessionsWithSlices.sort((a, b) =>
      sortOrder === "desc" ? b.sliceCount - a.sliceCount : a.sliceCount - b.sliceCount
    );
  }

  const userGroups = new Map<string, Session[]>();
  for (const s of filtered) {
    if (!userGroups.has(s.user_id)) userGroups.set(s.user_id, []);
    userGroups.get(s.user_id)!.push(s);
  }

  const userStats: UserStats[] = [];
  const allLangs = new Map<string, number>();
  const allFiles = new Map<string, number>();
  let totalSessions = 0;
  let totalDurationSeconds = 0;

  for (const [userId, userSessions] of userGroups) {
    let duration = 0;
    let sliceCount = 0;
    const langCount = new Map<string, number>();
    const fileCount = new Map<string, number>();

    for (const sess of userSessions) {
      const start = parseTimestamp(sess.start);
      const finish = parseTimestamp(sess.finish);
      duration += (finish.getTime() - start.getTime()) / 1000;
      totalSessions += 1;
      totalDurationSeconds += (finish.getTime() - start.getTime()) / 1000;

      const sessionSlices = sliceBySession.get(sess.id) ?? [];
      sliceCount += sessionSlices.length;

      for (const sl of sessionSlices) {
        for (const lang of sl.languages) {
          langCount.set(lang, (langCount.get(lang) ?? 0) + 1);
          allLangs.set(lang, (allLangs.get(lang) ?? 0) + 1);
        }
        for (const file of sl.files) {
          fileCount.set(file, (fileCount.get(file) ?? 0) + 1);
          allFiles.set(file, (allFiles.get(file) ?? 0) + 1);
        }
      }
    }

    userStats.push({
      userId,
      userName: userMap.get(userId) ?? userId,
      totalSessions: userSessions.length,
      totalDurationSeconds: duration,
      totalDurationFormatted: formatDuration(duration),
      avgSlicesPerSession: userSessions.length > 0 ? sliceCount / userSessions.length : 0,
      topLanguages: topN(langCount, 5).map(([language, count]) => ({ language, count })),
      topFiles: topN(fileCount, 5).map(([path, count]) => ({ path, count })),
    });
  }

  userStats.sort((a, b) =>
    sortOrder === "desc" ? b.totalDurationSeconds - a.totalDurationSeconds : a.totalDurationSeconds - b.totalDurationSeconds
  );

  return {
    projectId,
    filters,
    sortBy,
    sortOrder,
    userStats,
    aggregate: {
      totalSessions,
      totalDurationSeconds,
      mostUsedLanguages: topN(allLangs, 10).map(([language, count]) => ({ language, count })),
      mostUsedFiles: topN(allFiles, 10).map(([path, count]) => ({ path, count })),
    },
    sessionsWithSlices,
  };
}
