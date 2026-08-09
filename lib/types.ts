export type AgentKey =
  | "research"
  | "brand"
  | "pricing"
  | "website"
  | "marketing"
  | "roadmap";

export interface AgentOutput {
  research: {
    verdict: string;
    marketSize: string;
    competitors: string[];
    risks: string[];
  };
  brand: {
    name: string;
    tagline: string;
    positioning: string;
    voice: string;
  };
  pricing: {
    model: string;
    tiers: { name: string; price: string; includes: string }[];
  };
  website: {
    headline: string;
    subhead: string;
    cta: string;
  };
  marketing: {
    channels: string[];
    firstCampaign: string;
    hook: string;
  };
  roadmap: {
    next30Days: string[];
  };
}

export interface Project {
  id: string;
  idea: string;
  createdAt: number;
  output: AgentOutput;
}

export const AGENT_META: {
  key: AgentKey;
  label: string;
  role: string;
}[] = [
  { key: "research", label: "Research", role: "Validates the idea" },
  { key: "brand", label: "Brand", role: "Defines positioning" },
  { key: "pricing", label: "Pricing", role: "Builds the model" },
  { key: "website", label: "Website", role: "Writes the launch copy" },
  { key: "marketing", label: "Marketing", role: "Plans acquisition" },
  { key: "roadmap", label: "Roadmap", role: "Sets next steps" },
];
