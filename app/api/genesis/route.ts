import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    research: {
      type: "object",
      properties: {
        verdict: { type: "string", description: "One-sentence go/no-go style verdict on the idea" },
        marketSize: { type: "string", description: "Rough market size or opportunity framing, one sentence" },
        competitors: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
        risks: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
      },
      required: ["verdict", "marketSize", "competitors", "risks"],
    },
    brand: {
      type: "object",
      properties: {
        name: { type: "string", description: "A proposed company/product name" },
        tagline: { type: "string", description: "Under 10 words" },
        positioning: { type: "string", description: "One or two sentences" },
        voice: { type: "string", description: "3-5 adjectives describing brand voice" },
      },
      required: ["name", "tagline", "positioning", "voice"],
    },
    pricing: {
      type: "object",
      properties: {
        model: { type: "string", description: "e.g. Freemium, Usage-based, Tiered SaaS" },
        tiers: {
          type: "array",
          minItems: 2,
          maxItems: 3,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "string" },
              includes: { type: "string" },
            },
            required: ["name", "price", "includes"],
          },
        },
      },
      required: ["model", "tiers"],
    },
    website: {
      type: "object",
      properties: {
        headline: { type: "string" },
        subhead: { type: "string" },
        cta: { type: "string", description: "Button text, 2-4 words" },
      },
      required: ["headline", "subhead", "cta"],
    },
    marketing: {
      type: "object",
      properties: {
        channels: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
        firstCampaign: { type: "string", description: "One concrete first campaign idea" },
        hook: { type: "string", description: "A scroll-stopping hook line" },
      },
      required: ["channels", "firstCampaign", "hook"],
    },
    roadmap: {
      type: "object",
      properties: {
        next30Days: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
      },
      required: ["next30Days"],
    },
  },
  required: ["research", "brand", "pricing", "website", "marketing", "roadmap"],
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let idea: string;
  try {
    const body = await req.json();
    idea = String(body.idea ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!idea || idea.length < 8) {
    return NextResponse.json(
      { error: "Describe your idea in a bit more detail." },
      { status: 400 }
    );
  }

  const prompt = `You are Genesis, a founding team of specialized AI agents (Research, Brand, Pricing, Website, Marketing, Roadmap) that turn a raw startup idea into a launch-ready plan.

A founder describes their idea below. Produce the coordinated output of all six agents working together, staying consistent with each other (same company name and positioning throughout, pricing that matches the brand tier, marketing that matches the audience).

Founder's idea:
"""
${idea}
"""

Be specific and concrete. Avoid generic filler like "innovative solution" or "cutting-edge platform". Ground every field in the actual idea described.`;

  try {
    const resp = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.8,
        },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: `Gemini API error (${resp.status}): ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. Try rephrasing your idea." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(text);
    return NextResponse.json({ output: parsed });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error calling Gemini." },
      { status: 500 }
    );
  }
}
