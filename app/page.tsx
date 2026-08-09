"use client";

import { useEffect, useRef, useState } from "react";
import { AgentConstellation, ConstellationPhase } from "@/components/AgentConstellation";
import { IdeaForm } from "@/components/IdeaForm";
import { AgentResultGrid } from "@/components/AgentResultGrid";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { loadProjects, saveProject, deleteProject } from "@/lib/storage";
import { AgentOutput, Project } from "@/lib/types";

export default function HomePage() {
  const [phase, setPhase] = useState<ConstellationPhase>("idle");
  const [revealedCount, setRevealedCount] = useState(0);
  const [idea, setIdea] = useState("");
  const [output, setOutput] = useState<AgentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  async function handleSubmit(ideaText: string) {
    setError(null);
    setOutput(null);
    setActiveId(null);
    setIdea(ideaText);
    setPhase("working");
    setRevealedCount(0);

    tickRef.current = setInterval(() => {
      setRevealedCount((c) => (c < 5 ? c + 1 : c));
    }, 850);

    try {
      const res = await fetch("/api/genesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: ideaText }),
      });
      const data = await res.json();

      if (tickRef.current) clearInterval(tickRef.current);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setPhase("idle");
        setRevealedCount(0);
        return;
      }

      const project: Project = {
        id: crypto.randomUUID(),
        idea: ideaText,
        createdAt: Date.now(),
        output: data.output,
      };

      setOutput(data.output);
      setRevealedCount(6);
      setPhase("done");
      setActiveId(project.id);
      setProjects(saveProject(project));
    } catch (err) {
      if (tickRef.current) clearInterval(tickRef.current);
      setError(err instanceof Error ? err.message : "Network error.");
      setPhase("idle");
      setRevealedCount(0);
    }
  }

  function handleSelect(p: Project) {
    setIdea(p.idea);
    setOutput(p.output);
    setActiveId(p.id);
    setPhase("done");
    setRevealedCount(6);
    setError(null);
  }

  function handleDelete(id: string) {
    const next = deleteProject(id);
    setProjects(next);
    if (activeId === id) {
      setActiveId(null);
      setOutput(null);
      setPhase("idle");
      setRevealedCount(0);
    }
  }

  function handleNew() {
    setActiveId(null);
    setOutput(null);
    setIdea("");
    setPhase("idle");
    setRevealedCount(0);
    setError(null);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 md:py-16">
      <header className="mb-10 flex items-baseline justify-between">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-ember">
            AI-native company builder
          </p>
          <h1 className="font-display text-3xl font-semibold text-fg md:text-4xl">Genesis</h1>
        </div>
        <p className="hidden max-w-xs text-right text-sm text-fgmuted md:block">
          Describe an idea. Meet the AI founding team that researches, brands, prices, and
          launches it.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <ProjectSidebar
          projects={projects}
          activeId={activeId}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onNew={handleNew}
        />

        <div className="flex flex-col gap-8">
          <section className="rounded-2xl border border-hairline bg-surface/60 p-6">
            <IdeaForm onSubmit={handleSubmit} disabled={phase === "working"} />
            {error && (
              <p className="mt-3 rounded-lg border border-emberdim/50 bg-emberdim/10 px-3 py-2 text-sm text-ember">
                {error}
              </p>
            )}
          </section>

          {phase !== "idle" && (
            <section className="rounded-2xl border border-hairline bg-surface/40 p-4">
              <AgentConstellation phase={phase} revealedCount={revealedCount} />
            </section>
          )}

          {output && phase === "done" && (
            <section>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-fgmuted">
                Founding team output — "{idea}"
              </p>
              <AgentResultGrid output={output} />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
