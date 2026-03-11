# Cyber Hero Academy

> Learn cybersecurity like a superhero.

Comic-style, gamified cybersecurity training for Gen-Z professionals in corporate environments. Built with Next.js 15, Supabase, and Tailwind CSS.

---

## Features

- **Comic storytelling** — Panel-by-panel narrative lessons with character dialogue
- **3 learning modules** — Phish Frenzy, Password Fortress, The Human Hack
- **Interactive quizzes** — Multiple choice with immediate feedback and explanations
- **XP & levelling system** — Earn XP, level up from Recruit to Elite Defender
- **Badge system** — Unlock badges for mission completions and perfect scores
- **Auth** — Supabase email auth with automatic profile creation
- **Mobile-first** — Fully responsive dark UI

---

## Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Frontend     | Next.js 15 (App Router), React 18  |
| Styling      | Tailwind CSS v3                    |
| Backend/Auth | Supabase                           |
| Database     | PostgreSQL (via Supabase)          |
| Language     | TypeScript                         |
| Hosting      | Vercel-ready                       |

---

## Project Structure

```
cyber-hero-academy/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── (dashboard)/
│   │   ├── layout.tsx      # Shared layout with Navbar
│   │   ├── dashboard/      # Main dashboard
│   │   ├── missions/       # Mission list + detail pages
│   │   ├── lesson/[id]/    # Comic lesson viewer
│   │   ├── quiz/[id]/      # Quiz + results
│   │   └── rewards/        # XP, badges, levels
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/
│   ├── ui/                 # Button, Card, ProgressBar, SpeechBubble, BadgeIcon
│   └── layout/             # Navbar
├── lib/
│   ├── supabase/           # Browser + server Supabase clients
│   └── utils.ts            # XP/level helpers, cn(), etc.
├── services/               # Data access (modules, lessons, quizzes, progress)
├── hooks/                  # useAuth, useProgress
├── types/                  # Shared TypeScript types
├── middleware.ts            # Auth route protection
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_seed_data.sql
```

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd cyber-hero-academy
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run, in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
3. Go to **Settings → API** and copy your **Project URL** and **Anon public key**

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js

---

## Adding New Modules

All content is database-driven. To add a new module:

1. Insert a row into `modules`
2. Insert lesson rows into `lessons` with `comic_panels` JSONB
3. Insert quiz questions into `quizzes`

No application code changes required.

**Comic panel JSON structure:**

```json
{
  "id": 1,
  "speaker": "Raja",
  "dialogue": "The dialogue text shown in the speech bubble.",
  "caption": "Optional caption bar text",
  "image_url": null
}
```

Speaker values: `"Raja"` | `"Villain"` | `"Narrator"`

---

## Environment Variables

| Variable                        | Description                      |
|---------------------------------|----------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key    |

Never commit `.env.local`. Use `.env.example` as the template.

---

## XP & Level Thresholds

| Level | XP Required | Title           |
|-------|-------------|-----------------|
| 1     | 0           | Recruit         |
| 2     | 100         | Cadet           |
| 3     | 250         | Agent           |
| 4     | 500         | Specialist      |
| 5     | 900         | Elite Defender  |
