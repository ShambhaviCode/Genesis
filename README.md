# Genesis

Describe a startup idea. Genesis runs it through a coordinated team of AI
agents — Research, Brand, Pricing, Website, Marketing, Roadmap — and returns
a launch-ready plan. Projects are saved in your browser so you can revisit
past ideas.

Built with Next.js 15, React 19, Tailwind CSS, and the Gemini API
(`gemini-flash-latest`, structured JSON output).

## Run locally

```bash
npm install
cp .env.example .env.local   # then paste your Gemini API key into .env.local
npm run dev
```

Visit http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project** → import that repo. Framework preset
   (Next.js) is auto-detected — no other config needed.
3. Before the first deploy (or right after, then redeploy), open
   **Settings → Environment Variables** and add:
   - Key: `GEMINI_API_KEY`
   - Value: your key from https://aistudio.google.com/apikey
   - Environments: Production, Preview, Development (all three)
4. Deploy. That's it — the app is fully self-contained, no other services
   required.

## How it works

- `app/api/genesis/route.ts` — server-side route that calls the Gemini API
  with a JSON schema, so the model returns structured output for all six
  agents in one coordinated call (keeps it fast and keeps the agents
  consistent with each other — same company name, matching tone, etc.).
- `components/AgentConstellation.tsx` — the signature visual: agent nodes
  orbit a central "Genesis" hub and light up as work completes.
- `lib/storage.ts` — saves/loads projects to the browser's `localStorage`,
  so history persists across visits without needing a database.

## Notes for next steps

- Swap `localStorage` for a real database (e.g. Firestore, as in the
  original concept) if you want projects to sync across devices.
- The Gemini free tier has rate limits — fine for a demo/hackathon, but
  add retry/backoff or a paid tier for real traffic.
