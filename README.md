<div align="center">
  <img src="./public/preview.png" alt="Anilyfe Preview" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
  <br/>
  <h1>Anilyfe</h1>
  <p><strong>A modern streaming platform to watch anime online! 🚀</strong></p>

  <p>
    <a href="https://github.com/quincyqqe/anilyfe/stargazers"><img src="https://img.shields.io/github/stars/quincyqqe/anilyfe?style=for-the-badge&color=facc15&logo=github&logoColor=white" alt="GitHub stars"></a>
    <a href="https://github.com/quincyqqe/anilyfe/network/members"><img src="https://img.shields.io/github/forks/quincyqqe/anilyfe?style=for-the-badge&color=3b82f6&logo=github&logoColor=white" alt="GitHub forks"></a>
    <a href="https://github.com/quincyqqe/anilyfe/issues"><img src="https://img.shields.io/github/issues/quincyqqe/anilyfe?style=for-the-badge&color=ef4444&logo=github&logoColor=white" alt="GitHub issues"></a>
  </p>
</div>

---

## Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

## ✨ Features

-  **Anime Catalog** — Search and filter by genre, format, status, age rating, season, and year.
-  **Advanced Player** — Smooth HLS streaming with quality selection, opening/ending skip, and a robust episode list.
-  **Release Schedule** — Stay up-to-date with episodes sorted by day of the week.
-  **Detailed Title Pages** — Everything you need: posters, descriptions, genres, translation teams, stats, and related titles.
-  **Secure Accounts** — Effortless sign-up/sign-in using Supabase Auth (Email + OAuth).
-  **Personalized Anime List** — Track your journey: Watching / Completed / Dropped / Planned / On Hold.
-  **Public Profiles** — Share your anime taste with a unique public page linked to your username.
-  **Watch Progress** — Never lose your spot! We automatically save your current episode and playback position.

## Project Structure

```text
src/
├── app/                    # Next.js App Router — pages and routes
│   ├── (auth)/             # Sign up and sign in
│   └── (pages)/            # Main pages (home, catalog, schedule, profile, anime)
├── components/             # Reusable UI components (cards, header, footer, effects)
├── features/               # Domain-driven feature modules
│   ├── anime/              # Title page, player, info sections
│   ├── auth/               # Login and registration forms
│   ├── catalog/            # Filters, pagination, catalog utilities
│   ├── home/               # Promo slider, new releases
│   ├── player/             # HLS player, episode list
│   ├── profile/            # User profile, anime list
│   └── schedule/           # Episode release schedule
├── lib/
│   ├── db/
│   │   ├── queries.ts      # All Supabase read queries
│   │   └── actions/        # Server Actions for mutations
│   └── supabase/           # Supabase clients
├── providers/              # React providers
└── shared/                 # Shared types, constants, API client
```

## Getting Started

### Prerequisites

- **Node.js 20+**

### Installation

```bash
# Clone the repository
git clone https://github.com/quincyqqe/anilyfe.git
cd anilyfe

# Install dependencies using bun or npm
bun install
# or
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
NEXT_PUBLIC_API_URL=https://api.aniliberty.top/v1
```

### Development

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
bun run build
bun start
```

## 🗺 Roadmap

- [ ] 📈 **SEO** — Dynamic OpenGraph tags for title pages
- [ ] 💬 **Community** — Comments and ratings system
- [ ] 🔔 **Notifications** — Alerts for new episodes
- [ ] 📱 **Mobile App** — Bringing Anilyfe to iOS and Android

## Data Source

This project uses the public [AniLiberty API](https://aniliberty.top/api/docs/v1#/) to fetch anime metadata, schedules, promo materials, and streaming URLs.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/quincyqqe">quincyqqe</a>
</div>
