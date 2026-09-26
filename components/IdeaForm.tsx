"use client";

import { useState } from "react";

export function IdeaForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (idea: string) => void;
  disabled: boolean;
}) {
  const [idea, setIdea] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (idea.trim().length < 8) return;
        onSubmit(idea.trim());
      }}
      className="flex flex-col gap-3"
    >
      <label htmlFor="idea" className="font-mono text-xs uppercase tracking-widest text-fgmuted">
        Describe your idea
      </label>
      <textarea
        id="idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        disabled={disabled}
        maxLength={4000}
        rows={4}
        placeholder="A subscription box that sends home baristas fresh single-origin beans from a different micro-roaster every month..."
        className="w-full resize-none rounded-lg border border-hairline bg-surface px-4 py-3 text-fg placeholder:text-fgmuted/70 outline-none focus:border-signal transition-colors disabled:opacity-50"
      />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-fgmuted">
          {idea.trim().length < 8 ? "At least a sentence helps every agent" : `${idea.trim().length} characters`}
        </span>
        <button
          type="submit"
          disabled={disabled || idea.trim().length < 8}
          className="rounded-full bg-ember px-6 py-2.5 font-display text-sm font-semibold text-ink transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? "Igniting…" : "Ignite"}
        </button>
      </div>
    </form>
  );
}
