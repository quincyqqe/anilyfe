# AniLyfe

A streaming platform for watching anime online. Data is provided by the [AniLiberty API](https://aniliberty.top/api/docs/v1#/).

## Features

- **Anime catalog** — search and filter by genre, format, status, age rating, season, and year
- **Player** — HLS streaming with quality selection, opening/ending skip, and episode list
- **Schedule** — up-to-date episode release schedule by day of the week
- **Title pages** — poster, description, genres, translation team, stats, franchise, and related titles
- **Accounts** — sign up and sign in via Supabase Auth (email + OAuth)
- **Anime list** — save titles with a watch status (watching / completed / dropped / planned / on hold)
- **Profile** — public user page with the anime list, accessible by username
- **Watch progress** — automatic saving of current episode and playback position


## Project Structure

```
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

- Node.js 20+ or Bun
- A Supabase project with `profiles` and `user_anime_list` tables

### Installation

```bash
# Clone the repository
git clone https://github.com/quincyqqe/anilibertytest.git
cd anilibertytest

# Install dependencies
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

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
bun run build
bun start
```

## Roadmap

- [ ] **SEO** — dynamic OpenGraph tags for title pages
- [ ] Comments and ratings
- [ ] New episode notifications
- [ ] Mobile app

## Data Source

This project uses the public [AniLiberty API](https://aniliberty.top/api/docs/v1#/) to fetch anime metadata, schedules, promo materials, and streaming URLs.
