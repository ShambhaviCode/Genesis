"use client";

import { AgentOutput } from "@/lib/types";

function Card({
  eyebrow,
  title,
  children,
  delay,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div
      className="animate-rise rounded-xl border border-hairline bg-surface p-5"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-signal">{eyebrow}</span>
      </div>
      <h3 className="mb-3 font-display text-lg font-semibold text-fg">{title}</h3>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-hairline bg-surface2 px-2.5 py-1 font-mono text-[11px] text-fgmuted">
      {children}
    </span>
  );
}

export function AgentResultGrid({ output }: { output: AgentOutput }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card eyebrow="Agent · Research" title={output.research.verdict} delay={0}>
        <p className="mb-3 text-sm text-fgmuted">{output.research.marketSize}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {output.research.competitors.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </div>
        <ul className="space-y-1 text-sm text-fgmuted">
          {output.research.risks.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="text-ember">·</span>
              {r}
            </li>
          ))}
        </ul>
      </Card>

      <Card eyebrow="Agent · Brand" title={output.brand.name} delay={80}>
        <p className="mb-2 font-display text-base italic text-signal">"{output.brand.tagline}"</p>
        <p className="mb-2 text-sm text-fgmuted">{output.brand.positioning}</p>
        <p className="font-mono text-[11px] uppercase tracking-wide text-fgmuted">
          Voice — {output.brand.voice}
        </p>
      </Card>

      <Card eyebrow="Agent · Pricing" title={output.pricing.model} delay={160}>
        <div className="space-y-2">
          {output.pricing.tiers.map((t) => (
            <div
              key={t.name}
              className="flex items-start justify-between gap-3 rounded-lg border border-hairline bg-surface2 px-3 py-2"
            >
              <div>
                <p className="font-medium text-fg">{t.name}</p>
                <p className="text-sm text-fgmuted">{t.includes}</p>
              </div>
              <span className="whitespace-nowrap font-mono text-sm text-ember">{t.price}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card eyebrow="Agent · Website" title={output.website.headline} delay={240}>
        <p className="mb-4 text-sm text-fgmuted">{output.website.subhead}</p>
        <span className="inline-block rounded-full bg-ember px-4 py-2 font-display text-sm font-semibold text-ink">
          {output.website.cta}
        </span>
      </Card>

      <Card eyebrow="Agent · Marketing" title={output.marketing.hook} delay={320}>
        <p className="mb-3 text-sm text-fgmuted">{output.marketing.firstCampaign}</p>
        <div className="flex flex-wrap gap-1.5">
          {output.marketing.channels.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </div>
      </Card>

      <Card eyebrow="Agent · Roadmap" title="Next 30 days" delay={400}>
        <ol className="space-y-1.5 text-sm text-fgmuted">
          {output.roadmap.next30Days.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="font-mono text-signal">{String(i + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
