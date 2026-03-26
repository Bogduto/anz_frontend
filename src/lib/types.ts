export type Session = {
  id: string;
  user_id: string;
  project_id: string;
  start: string;
  finish: string;
  splices: string[];
};

export type Slice = {
  id: string;
  session_id: string;
  languages: string[];
  files: string[];
  start: string;
  finish: string;
  actions: string[];
};

export type FileRecord = {
  id: string;
  slice_id: string;
  filename: string;
  path: string;
  size: number;
};

export type Repository = {
  id: string;
  title: string;
  description: string;
  visibility: string;
  user_id?: string;
};

export type User = {
  id: string;
  name: string;
};

export type SortBy = "duration" | "date" | "frequency";
export type SortOrder = "asc" | "desc";

export type StatsFilters = {
  dateFrom?: string | null;
  dateTo?: string | null;
  userId?: string | null;
  projectId?: string | null;
  repoUserId?: string | null;
};

export type UserStats = {
  userId: string;
  userName: string;
  totalSessions: number;
  totalDurationSeconds: number;
  totalDurationFormatted: string;
  avgSlicesPerSession: number;
  topLanguages: { language: string; count: number }[];
  topFiles: { path: string; count: number }[];
};

export type SessionWithSlices = {
  sessionId: string;
  userId: string;
  userName: string;
  start: string;
  finish: string;
  durationSeconds: number;
  sliceCount: number;
};

export type RepositoryStats = {
  projectId: string;
  filters: StatsFilters;
  sortBy: SortBy;
  sortOrder: SortOrder;
  userStats: UserStats[];
  aggregate: {
    totalSessions: number;
    totalDurationSeconds: number;
    mostUsedLanguages: { language: string; count: number }[];
    mostUsedFiles: { path: string; count: number }[];
  };
  sessionsWithSlices: SessionWithSlices[];
};
