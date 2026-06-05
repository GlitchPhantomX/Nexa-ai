# Nexa AI

## Overview

Nexa AI is a Next.js‑based platform that combines real‑time video conferencing with an AI voice assistant. Users can create custom AI "agents", schedule meetings, and interact with the assistant via speech‑to‑text and text‑to‑speech in the browser. The backend is provider‑agnostic – it can route requests to OpenRouter, Google Gemini, or Groq – and stores data in a Neon PostgreSQL database through Drizzle ORM.

## Key Features

- **Custom AI agents** – define name & instruction, stored per user.
- **Video calls** – powered by Stream Video SDK with automatic token generation.
- **Voice interaction** – browser native SpeechRecognition + SpeechSynthesis.
- **Provider‑agnostic LLM** – switch between OpenRouter, Gemini, Groq without code changes.
- **Secure authentication** – Better‑Auth with email/password + GitHub & Google OAuth.
- **Dashboard** – manage agents, schedule meetings, view meeting status, recordings, transcriptions.
- **Database** – Drizzle ORM + Neon (PostgreSQL) with migrations.
- **TypeScript + TailwindCSS** – fully typed, modern UI via shadcn/ui components.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui |
| API / RPC | tRPC, Next.js API routes |
| Auth | Better‑Auth, GitHub/Google OAuth |
| AI backend | OpenRouter, Gemini, Groq (configurable via env) |
| Video | Stream Video React SDK |
| Database | Neon PostgreSQL, Drizzle‑ORM (postgresql dialect) |
| Migrations | drizzle‑kit |
| CI / Dev | ESLint, TypeScript, npm scripts |

## Getting Started

### Prerequisites

- **Node.js** ≥ 20 (LTS) and **npm** (or yarn/pnpm/bun)
- A **Neon** project with a PostgreSQL connection string
- **Stream Video** API keys (`NEXT_PUBLIC_STREAM_VIDEO_API_KEY` & `STREAM_VIDEO_SECRET_KEY`)
- (Optional) API keys for the AI provider you plan to use:
  - OpenRouter → `OPENROUTER_API_KEY`
  - Gemini → `GEMINI_API_KEY`
  - Groq → `GROQ_API_KEY`
- GitHub/Google OAuth credentials if you want social login (see `.env` section)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/nexa-ai.git
cd nexa-ai

# Install dependencies
npm install   # or yarn / pnpm / bun

# Copy the example env file (create one if missing)
cp .env.example .env
```

### Environment variables

Create a `.env` file at the project root and fill the values according to the table below.

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon Postgres connection string | `postgresql://user:pass@us-east-2.aws.neon.tech/neondb` |
| `AI_PROVIDER` | Provider name (`"openrouter"`, `"gemini"`, or `"groq"`) | `"openrouter"` |
| `MODEL_NAME` | Model to use for the selected provider | `deepseek/deepseek-r1:free` |
| `OPENROUTER_API_KEY` | OpenRouter API key (if `AI_PROVIDER=openrouter`) | `sk-…` |
| `GEMINI_API_KEY` | Gemini API key (if `AI_PROVIDER=gemini`) | `AIza…` |
| `GROQ_API_KEY` | Groq API key (if `AI_PROVIDER=groq`) | `gsk_…` |
| `NEXT_PUBLIC_STREAM_VIDEO_API_KEY` | Stream Video public API key | `xxxxx` |
| `STREAM_VIDEO_SECRET_KEY` | Stream Video secret key | `xxxxx` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth (optional) | `Iv…` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) | `…` |

#### `.env.example` (for reference)

```env
# --- Database ----------------------------------------------------
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>

# --- AI Provider -------------------------------------------------
AI_PROVIDER=openrouter
MODEL_NAME=deepseek/deepseek-r1:free

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_key

# Gemini
GEMINI_API_KEY=your_gemini_key

# Groq
GROQ_API_KEY=your_groq_key

# --- Stream Video ------------------------------------------------
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your_stream_video_api_key
STREAM_VIDEO_SECRET_KEY=your_stream_video_secret_key

# --- OAuth (optional) --------------------------------------------
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Database setup

The project uses **Drizzle ORM** with the **drizzle‑kit** CLI.

```bash
# Push the current schema to Neon
npm run db:push

# Or open the DB studio UI
npm run db:studio
```

For future schema changes you can generate migrations:

```bash
npx drizzle-kit generate:pg --out migrations
```

### Development

```bash
npm run dev
```

The app will be available at <http://localhost:3000>. You can create an account (email/password or social login), add AI agents, schedule a meeting, and start a video call.

### Build & Deploy

```bash
npm run build   # Next.js production build
npm start       # Run the built app
```

Deploy to **Vercel** (or any Node.js host). Set all `process.env` variables in the Vercel dashboard. The Neon connection string should be stored as a secret.

## Project Structure (high‑level)

```
src/
 ├─ app/                 – Next.js app router pages (auth, dashboard, call)
 ├─ components/          – UI primitives (buttons, dialogs, avatar)
 ├─ lib/                 – helpers (auth, stream‑video, env)
 ├─ db/                  – Drizzle schema & db client
 ├─ modules/
 │   ├─ agents/          – CRUD UI & tRPC router for AI agents
 │   ├─ meetings/        – CRUD UI & tRPC router for meetings
 │   └─ auth/            – Sign‑in / sign‑up views
 ├─ trpc/                – tRPC initialization & router export
 └─ constants.ts        – pagination defaults
```

## API Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | Forward user prompt to the configured LLM using the selected provider and return the assistant response. |
| `/api/webhooks/stream` | POST | Receive Stream Video webhook events (session start/end) and update meeting status. |
| `/api/*` (tRPC) | – | All tRPC procedures under `/api/trpc` – agents, meetings, auth, etc. |

## Voice Interaction Flow

1. User clicks **“Push to Talk”** in the call UI.
2. Browser `SpeechRecognition` captures audio → transcribes to text.
3. Text sent to `/api/chat`.
4. LLM response returned, fed to `speechSynthesis` → spoken back to the user.

All processing happens in the browser; only the text payload travels to the backend.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/my-feature`).
3. Install dependencies (`npm ci`).
4. Run lint and type‑checking: `npm run lint`.
5. Open a PR – please ensure the CI passes.

> **Note:** This project uses the **Next.js 16** app‑router APIs, which differ from older Next.js versions. Review the official docs in `node_modules/next/dist/docs/` if you need to adjust routing or API conventions.

## License

MIT © 2026 Nexa AI contributors.

## Acknowledgments

- **Stream Video** – real‑time video SDK.
- **Better‑Auth** – authentication framework.
- **OpenRouter**, **Google Gemini**, **Groq** – LLM providers.
- **Neon** – serverless Postgres.
- **shadcn/ui**, **lucide-react**, **TailwindCSS** – UI building blocks.

---

Feel free to explore the `AI_SETUP.md` file for details on the provider‑agnostic voice‑assistant architecture. Happy hacking!