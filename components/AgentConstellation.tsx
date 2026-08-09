"use client";

import { AGENT_META } from "@/lib/types";

const CX = 320;
const CY = 190;
const R = 132;
// One angle per agent in AGENT_META order, evenly spaced around the hub.
const ANGLES = [-90, -30, 30, 90, 150, 210];

function pos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

export type ConstellationPhase = "idle" | "working" | "done";

export function AgentConstellation({
  phase,
  revealedCount,
}: {
  phase: ConstellationPhase;
  revealedCount: number;
}) {
  return (
    <svg
      viewBox="0 0 640 380"
      className="w-full h-auto"
      role="img"
      aria-label="Genesis agent constellation, showing each agent's progress"
    >
      {AGENT_META.map((agent, i) => {
        const { x, y } = pos(ANGLES[i]);
        const active = i < revealedCount;
        return (
          <line
            key={`line-${agent.key}`}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke={active ? "#5EEAD4" : "#2A303C"}
            strokeWidth={active ? 1.5 : 1}
            strokeDasharray={!active && phase === "working" ? "3 5" : undefined}
            style={{ transition: "stroke 0.6s ease" }}
          />
        );
      })}

      <circle
        cx={CX}
        cy={CY}
        r={34}
        fill="#161B22"
        stroke="#FF8A3D"
        strokeWidth={1.5}
        className={phase !== "idle" ? "animate-pulseglow" : ""}
        style={{ color: "#FF8A3D" }}
      />
      <text
        x={CX}
        y={CY + 4}
        textAnchor="middle"
        fontSize={11}
        letterSpacing={1}
        className="fill-fg font-display font-semibold"
      >
        GENESIS
      </text>

      {AGENT_META.map((agent, i) => {
        const { x, y } = pos(ANGLES[i]);
        const active = i < revealedCount;
        const working = phase === "working" && i === revealedCount;
        return (
          <g
            key={agent.key}
            className={active ? "animate-rise" : ""}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <circle
              cx={x}
              cy={y}
              r={26}
              fill={active ? "#161B22" : "#0E1116"}
              stroke={active ? "#5EEAD4" : working ? "#FF8A3D" : "#2A303C"}
              strokeWidth={1.5}
              className={working ? "animate-pulseglow" : ""}
              style={{ color: working ? "#FF8A3D" : undefined, transition: "stroke 0.6s ease" }}
            />
            <text
              x={x}
              y={y - 2}
              textAnchor="middle"
              fontSize={9}
              letterSpacing={0.5}
              className={`font-mono uppercase ${active ? "fill-signal" : "fill-fgmuted"}`}
            >
              {agent.label}
            </text>
            <text x={x} y={y + 10} textAnchor="middle" fontSize={7} className="fill-fgmuted font-mono">
              {active ? "done" : working ? "working" : "queued"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
