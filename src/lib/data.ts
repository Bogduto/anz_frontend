import sessionsData from "@/data/sessions.json";
import slicesData from "@/data/slices.json";
import filesData from "@/data/files.json";
import repositoriesData from "@/data/repositories.json";
import usersData from "@/data/users.json";
import type { Session, Slice, FileRecord, Repository, User } from "./types";

export const sessions: Session[] = sessionsData as Session[];
export const slices: Slice[] = slicesData as Slice[];
export const files: FileRecord[] = filesData as FileRecord[];
export const repositories: Repository[] = repositoriesData as Repository[];
export const users: User[] = usersData as User[];

export function getRepositoryById(id: string): Repository | undefined {
  return repositories.find((r) => r.id === id);
}

export function getSessionsByProject(projectId: string): Session[] {
  return sessions.filter((s) => s.project_id === projectId);
}
