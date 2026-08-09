import { Project } from "./types";

const KEY = "genesis.projects.v1";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.createdAt - a.createdAt) : [];
  } catch {
    return [];
  }
}

export function saveProject(project: Project): Project[] {
  const current = loadProjects();
  const next = [project, ...current.filter((p) => p.id !== project.id)];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function deleteProject(id: string): Project[] {
  const next = loadProjects().filter((p) => p.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
