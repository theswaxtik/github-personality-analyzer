# GitHub Personality Analyzer

Discover what kind of developer you are based on your GitHub activity. Enter any username and get an instant breakdown — personality type, language stats, skill radar, contribution graph, repo highlights, and a roast.

---

## Features

- **Profile Overview** — avatar, bio, stats, account age
- **Contribution Graph** — 12-month activity heatmap
- **Developer Personality** — 9 distinct types with strengths, weaknesses, and career path
- **Roast Mode** — context-aware roast with refresh
- **Language Usage** — donut chart + animated progress bars
- **Skill Radar** — Frontend, Backend, Mobile, AI, Open Source, DevOps
- **Repo Highlights** — sortable by stars or recent activity
- **Search History** — last 5 searches stored in localStorage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Charts | Chart.js 4 + react-chartjs-2 |
| HTTP | Axios |
| Icons | Lucide React |
| API | GitHub REST API v3 |

---

## Folder Structure

```
src/
├── components/
│   ├── SearchBar.tsx
│   ├── ProfileCard.tsx
│   ├── RepoCard.tsx
│   ├── RepoList.tsx
│   ├── PersonalityCard.tsx
│   ├── RoastCard.tsx
│   ├── LanguageChart.tsx
│   ├── SkillChart.tsx
│   ├── ContributionGraph.tsx
│   ├── RecentSearches.tsx
│   ├── LoadingScreen.tsx
│   └── ErrorState.tsx
│
├── services/
│   └── githubApi.ts
│
├── utils/
│   ├── calculateLanguageStats.ts
│   ├── generatePersonality.ts
│   ├── roastGenerator.ts
│   ├── calculateSkills.ts
│   └── formatDate.ts
│
├── types/
│   └── github.ts
│
├── pages/
│   └── Home.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Installation

### Prerequisites

- Node.js 20 LTS
- npm 9+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/github-personality-analyzer.git
cd github-personality-analyzer

# 2. Install dependencies
npm install

# 3. (Optional) Add a GitHub token for higher rate limits
cp .env.example .env
# Edit .env and add your token

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GITHUB_TOKEN` | No | GitHub PAT for 5,000 req/hr (vs 60 without) |

Generate a token at [github.com/settings/tokens](https://github.com/settings/tokens). No special scopes required for public data.

---

## Build

```bash
npm run build
```

Output is in `dist/`. Preview the production build:

```bash
npm run preview
```

---

## Deployment (Vercel)

1. Push your project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — no config needed
5. Add `VITE_GITHUB_TOKEN` in **Project Settings → Environment Variables** (optional but recommended)
6. Click **Deploy**

---

## Running on Termux (Android)

```bash
# Install Node.js
pkg install nodejs

# Clone and install
git clone https://github.com/YOUR_USERNAME/github-personality-analyzer.git
cd github-personality-analyzer
npm install

# Start dev server
npm run dev
```

> **Note:** Use Node.js 20 LTS. Avoid experimental versions. All dependencies in this project are ARM-compatible.

---

## Roadmap (V1.5)

- [ ] Compare two developers side-by-side
- [ ] Export analysis as PDF
- [ ] Dark/light theme toggle
- [ ] Shareable result card (image)
- [ ] AI-generated resume summary
- [ ] Repo timeline chart
- [ ] GitHub addiction meter

---

## License

MIT © 2024
