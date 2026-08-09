"use client";

import { Project } from "@/lib/types";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ProjectSidebar({
  projects,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: {
  projects: Project[];
  activeId: string | null;
  onSelect: (p: Project) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <aside className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-fgmuted">Your companies</h2>
        <button
          onClick={onNew}
          className="font-mono text-[11px] text-signal underline-offset-2 hover:underline"
        >
          + New
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-hairline p-4 text-sm text-fgmuted">
          Nothing built yet. Describe an idea to spin up your first founding team.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 overflow-y-auto">
          {projects.map((p) => (
            <li key={p.id}>
              <div
                className={`group flex items-start justify-between gap-2 rounded-lg border px-3 py-2.5 transition-colors cursor-pointer ${
                  activeId === p.id
                    ? "border-signal bg-surface2"
                    : "border-hairline bg-surface hover:border-fgmuted"
                }`}
                onClick={() => onSelect(p)}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm text-fg">{p.output.brand.name}</p>
                  <p className="truncate text-xs text-fgmuted">{p.idea}</p>
                  <p className="mt-1 font-mono text-[10px] text-fgmuted">{timeAgo(p.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.id);
                  }}
                  className="shrink-0 font-mono text-[11px] text-fgmuted opacity-0 transition-opacity hover:text-ember group-hover:opacity-100"
                  aria-label={`Delete ${p.output.brand.name}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
