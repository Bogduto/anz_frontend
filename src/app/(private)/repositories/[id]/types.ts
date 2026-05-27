export interface Workspace {
  id: number;
  name: string;
  href: string;
}


export interface Activity {
  id: number;
  total_duration: number;
  start: number;
  end: number;
  workspace_id: number;
  created_at: string;
}

export type Days = Record<string, Activity[]>;

export interface Session {
  id: number;
  activity_id: number;
  close_time: number;
  enter_time: number;
  created_at: string;
  file: File;
  file_id: number;
}

export interface File {
  id: number;
  language: string;
  name: string;
  pathname: string | null; // remove null
}

export type Sessions = Record<number, Session[]>;

export interface WeekStats {
  workspace_total_spent: number;
  days: Days;
  sessions: Sessions;
}