# Anilyfe Agent Instructions

This repository is a modern anime streaming web app built with Next.js App Router with a VideoJS-based player.
Follow these rules to keep changes aligned with the current architecture and safe for production.

## 1. Project Stack

- **Next.js**: 16 App Router with Turbopack, React 19, TypeScript 7.0 strict mode.
- **Runtime/deployment**: Vercel.
- **Styling/UI**: Tailwind CSS 4 (via CSS `@import`), shadcn/ui components, custom CSS tokens in `src/app/globals.css`, Framer Motion for animations.
- **Auth/backend**: Supabase with `@supabase/ssr`, server/client split (`src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`).
- **Video/player**: VideoJS React (`@videojs/react` ^10.0.0-beta.31) with HLS.js support via `HlsJsVideo`, Google Cast, AirPlay, PiP.
- **Data source**: AniLiberty API through feature-scoped and shared API helpers with `safeFetch` wrapper.
- **Icons**: `lucide-react` for UI icons, `@videojs/react/icons` for player controls.
- **Utilities**: Embla Carousel for carousels, `class-variance-authority`, `tailwind-merge`, Base UI for low-level components.

## 2. Next.js 16 and Version-Matched Rules

- Use Next.js 16 App Router exclusively—**no Pages Router** patterns.
- **Session refresh**: Handled through `src/proxy.ts` (Next.js 16 proxy, not middleware). Do not rename or restructure this file without verifying current Next.js behavior.
- **Async `params`, `searchParams`, `headers`, `cookies`**: In Server Components and Route Handlers, these are no longer synchronous—**always await** them.
- **Import local docs** from `node_modules/next/dist/docs/` when available; infer from the installed version (16.3.1) and existing patterns if unavailable.
- Use native App Router conventions: route groups, `layout.tsx`, `page.tsx`, route handlers, metadata exports, `generateStaticParams`, and Server Components by default.
- No `getServerSideProps`, `getStaticProps`, or `revalidate` functions outside of Next.js native APIs.

## 3. Repository Structure

The app is source-rooted under `src/`. Do not create top-level `app/`, `components/`, `lib/`, or `server/` folders.

- `src/app/`: routes, layouts, metadata, global styles, route handlers, Next.js app files.
- `src/app/(pages)/`: user-facing page routes grouped by area.
- `src/app/(api)/`: route handlers for backend endpoints that must exist as HTTP routes.
- `src/features/<feature>/`: feature-specific UI, hooks, API helpers, types, constants, and utilities.
- `src/components/`: reusable cross-feature UI and layout components.
- `src/shared/`: shared API clients, constants, and domain types used by multiple features.
- `src/lib/`: low-level utilities, Supabase clients, database actions, metadata helpers.
- `src/providers/`: app-level client providers mounted from the root layout.
- `src/config/`: site/application configuration.
- `public/`: static assets.

Create new files near the feature that owns the behavior. Promote code to `src/shared`, `src/components`, or `src/lib` only when it is genuinely reused.

## 4. Server and Client Components

- Prefer Server Components for pages, data loading, metadata, and non-interactive UI.
- Add `"use client"` only for components that need state, effects, event handlers, browser APIs, refs tied to DOM behavior, media player control, or client-only libraries.
- Keep client providers centralized in `src/providers`.
- Do not import server-only modules into client components, especially `src/lib/supabase/server`, `next/headers`, `next/navigation` server APIs, or database actions.
- Keep server/client boundaries explicit. If a feature needs both, split it into server data loading plus a small client component.

## 5. Data Fetching and API Rules

- **Prefer server-side fetching**: Use Server Components or feature API helpers (`src/features/<feature>/api/`) over adding new route handlers.
- **Route handlers**: Use only for OAuth callbacks (`src/app/(api)/auth/callback/route.ts`), browser-called endpoints (`POST /anime-progress`), webhooks, or integrations requiring HTTP boundaries.
- **Thin route handlers**: Keep route handlers lean; promote reusable logic to `src/features`, `src/shared/api/`, or `src/lib`.
- **External API calls**: Use `safeFetch` from `src/shared/api/client.ts` for AniLiberty API and similar external sources. It handles errors gracefully and returns typed data.
- **Caching strategy**:
  - Use `cache: 'no-store'` for personalized data (user lists), frequently changing data, and search/filter results.
  - Use `next: { revalidate: 3600 }` (or similar) **only** when stale data is acceptable (e.g., catalog data).
  - Do not globally disable caching without a reason.
- **Error handling**: Always handle failed API calls explicitly. Preserve fallback UI, log errors server-side, and return sensible error objects to the client.

## 6. Supabase and Auth

- Browser Supabase client lives in `src/lib/supabase/client.ts`.
- Server Supabase client lives in `src/lib/supabase/server.ts`.
- Session refresh/proxy logic lives in `src/lib/supabase/proxy.ts` and `src/proxy.ts`.
- Never expose service-role keys or server secrets to client code.
- Only `NEXT_PUBLIC_*` variables may be read in client modules.
- Validate auth-dependent operations on the server. Do not trust user identity sent from the client.

## 7. UI, Styling, and Design System

- **Design language**: Use the existing dark anime glass UI language and CSS tokens from `src/app/globals.css` (OKLch color space, glass effects, custom player tokens).
- **Component library**: Prefer shadcn/ui components (via `@import 'shadcn/tailwind.css'`) when available. Use Base UI (`@base-ui/react`) for lower-level primitives when shadcn doesn't provide what's needed.
- **Utility function**: Use `cn` from `src/lib/utils/cn.ts` for conditional class names (combines `clsx` and `tailwind-merge`).
- **Tailwind CSS 4**: Configured via CSS (`@import 'tailwindcss'`), theme variables mapped in `@theme inline { ... }`. **Do not** add old Tailwind 3-style config patterns (`tailwind.config.js` theme/extend).
- **Responsive design**: Always preserve mobile-first responsive behavior. Check compact layouts for headers, cards, filters, modals, and player UI.
- **Player UI**: Player controls use VideoJS React components (`PlayButton`, `VolumeSlider`, `FullscreenButton`, etc.) with custom styling in `src/features/player/player.css`.
- **Avoid broad rewrites**: Skip visual refactors unless the task is explicitly design-focused.

## 8. TypeScript and Code Style

- **Strict TypeScript**: Keep `strict: true`. Avoid `any`; prefer domain types from `src/shared/types` or feature-local `types` folders.
- **Import aliases**: Use `@/*` for imports from `src` (e.g., `import { Anime } from '@/shared/types/anime'`).
- **Code formatting**: Single quotes, semicolons, printWidth 100, managed by Prettier (`.prettierrc` configured). Run `npm run format` to apply.
- **Component design**: Keep components small and composable. Avoid abstractions for one-off code—inline simple logic.
- **File organization**: Do not rename files, move features, or reorganize folders unless necessary for the change. Prefer placing new code near the feature that owns it.
- **Comments**: Explain non-obvious behavior only; avoid redundant comments. Keep the codebase self-documenting through clear naming.

## 9. Forms, Input, and Security

- Validate all server action, route handler, and external input on the server.
- Sanitize URL/search params before using them to build API requests.
- Do not interpolate untrusted input into URLs without `URLSearchParams` or equivalent structured handling.
- Never log secrets, tokens, cookies, or full auth payloads.
- Do not hardcode secrets. Use environment variables and document newly required variables.

## 10. Performance and Player Guidelines

- **Server-first rendering**: Keep routes server-rendered whenever possible. Use `"use client"` only for state, effects, event handlers, DOM refs, and browser APIs.
- **Client state**: Avoid unnecessary client state and effects. Prefer Server Components for data loading and static UI.
- **Images**: Use `next/image` (configured with `unoptimized: true`, `qualities: [75, 85]`). Images are served from `aniliberty.top` and `cdn.aniliberty.top` (see `remotePatterns`).
- **Heavy libraries**: Load video player, canvas, animation, and similar libraries only where needed. VideoJS components are isolated in `src/features/player/` and should not leak into unrelated routes.
- **API efficiency**: Avoid over-fetching large AniLiberty responses. Request only the data and page size needed by the UI (e.g., paginate catalog results, limit list sizes).
- **Player optimization**: VideoJS React player is configured with HLS.js, Google Cast, AirPlay, and PiP. Use player fragments (opening/ending markers) sparingly; they should load only when the episode loads.

## 11. Commands and Verification

**Project scripts:**
- `npm run dev`: Start Next.js dev server with Turbopack (default `--turbopack` flag in `package.json`).
- `npm run build`: Production build with Turbopack.
- `npm start`: Start production server.
- `npm run lint`: Run ESLint checks.
- `npm run format`: Format all files with Prettier.
- `npm run knip`: Check for unused files and exports.

**Verification workflow**: After code changes, run the narrowest useful verification first:
1. Single file/component changes: `npm run lint` (fast ESLint check).
2. Shared or routing changes: `npm run lint && npm run build` (ESLint + full build to catch cross-file issues).
3. Before committing: `npm run format` to auto-format code.
4. Always verify the preview works when UI/behavior changes are made.

## 12. Player Architecture Notes

The anime watch interface is built around **AnimeWatchSection** (`src/features/player/anime-watch-section.tsx`):
- Manages episode selection, player persistence (progress tracking), and episode lifecycle.
- Uses **HlsVideoPlayer** (`src/features/player/hls-video-player.tsx`) for actual video playback with VideoJS.
- Player controls use VideoJS React components (`Button`, `VolumeSlider`, `FullscreenButton`, `PipControl`, `CastControl`, `AirplayControl`, `SettingsMenu`).
- Fragment markers (opening/ending segments) are rendered via `usePlayer()` hook and positioned on the timeline.
- Episode list sidebar shows all episodes; clicking an episode triggers `handleEpisodeSelect`, which saves progress to Supabase via `usePlayerPersistence`.
- Video sources are resolved from the episode's HLS streams (`hls_1080`, `hls_720`, `hls_480`).

## 13. Agent Behavior

- **Minimal, safe diffs**: Prefer focused changes; avoid unnecessary refactors.
- **Read context first**: Always read nearby code and existing patterns before editing.
- **Check recent changes**: When debugging, check git history first (`git log`, `git diff`).
- **Root cause fixes**: Fix the underlying issue, not just the symptom.
- **No unrelated refactoring**: Do not refactor code outside the scope of the requested change.
- **Preserve dependencies**: Do not change lockfiles unless dependencies actually changed. Check version consistency with `package.json`.
- **Ask before wide changes**: If architecture is unclear or a change has a wide blast radius, ask before proceeding.
- **Choose simplicity**: When multiple solutions exist, pick the simplest one that matches the current codebase style.

## 14. Project Priorities

- **Correctness** over cleverness.
- **Server-first** architecture and data fetching.
- **Feature-local** ownership and component colocation.
- **Clear server/client** boundaries; no cross-boundary imports.
- **Safe auth and environment** handling (Supabase session refresh via proxy, no hardcoded secrets).
- **Smooth, responsive** anime-streaming UX with fast player controls and smooth page transitions.
