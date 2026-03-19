# Anilyfe

Anilyfe is a high-performance, modern anime streaming platform built with a focus on user experience, speed, and clean design. It leverages the latest web technologies to provide a seamless viewing experience.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/), [HeroUI](https://heroui.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Video Playback:** [Vidstack](https://www.vidstack.io/), [Artplayer](https://artplayer.org/)
- **Data Source:** [AniLiberty API](https://aniliberty.top/)

## Key Features

- **Dynamic Catalog:** Advanced searching and filtering by genres, years, and seasonal releases.
- **Premium Player:** HLS streaming support with quality selection and playback synchronization.
- **User Ecosystem:** Personalized watchlists (Planned, Watching, Completed) and public user profiles.
- **Real-time Schedule:** Interactive release calendar synchronized with current anime seasons.
- **Responsive Architecture:** Fully optimized for both desktop and mobile viewing.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/quincyqqe/anilyfe.git
cd anilyfe
```

### 2. Install dependencies
```bash
bun install
# or
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_MEDIA_URL=https://aniliberty.top
NEXT_PUBLIC_API_URL=https://aniliberty.top/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

### 4. Run the development server
```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Production

To create an optimized production build:

```bash
bun run build
bun start
```
