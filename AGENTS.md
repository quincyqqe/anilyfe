# Anilyfe Agent Instructions

This is an anime streaming web app built on Next.js 16.4 App Router, deployed to Vercel.
Follow these rules to keep changes safe, correct, and aligned with the current architecture.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

Use **Bun** for all package management and script execution (`bun.lock` is authoritative):

```bash
bun run dev          # Next.js dev server (Turbopack, port 3000)
bun run build        # Production build (Turbopack)
bun run start        # Production server
bun x tsc --noEmit   # TypeScript type check
bun run format       # Prettier — run before committing
bun run knip         # Unused exports / dead code check
```

> `next lint` was removed in Next.js 16. Run `eslint` directly if a lint step is needed.
> `--turbopack` is no longer required; Turbopack is the default in Next.js 16.

**Verification order** — run the narrowest check first:

1. File-level change → `bun x tsc --noEmit`
2. Shared/routing change → `bun x tsc --noEmit && bun run build`
3. Before committing → `bun run format`

## Repository Structure

Source is rooted under `src/`. Do not create top-level `app/`, `components/`, `lib/`, or `server/` folders.

| Directory                 | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `src/app/`                | Routes, layouts, metadata, globals, route handlers              |
| `src/app/(pages)/`        | User-facing page routes                                         |
| `src/app/(api)/`          | HTTP-boundary route handlers (auth callback, `/anime-progress`) |
| `src/features/<feature>/` | Feature-scoped UI, hooks, API helpers, types                    |
| `src/components/`         | Reusable cross-feature UI and layout components                 |
| `src/shared/`             | Shared API clients (`safeFetch`), domain types, constants       |
| `src/lib/`                | Supabase clients, DB actions, low-level utilities               |
| `src/providers/`          | App-level client providers (mounted from root layout)           |
| `src/config/`             | Site/app configuration                                          |

Place new code near the feature that owns it. Promote to `src/shared` or `src/components` only when genuinely reused.

## Server / Client Boundaries

- Server Components by default. Add `"use client"` only for state, effects, event handlers, DOM refs, browser APIs, or client-only libraries (VideoJS, Framer Motion interactions).
- **Never** import `src/lib/supabase/server`, `next/headers`, or DB actions into client components.
- Keep client providers in `src/providers`. Split into server data-loading + small client component when a feature needs both.
- Use native App Router conventions: route groups, `layout.tsx`, `page.tsx`, route handlers, metadata exports, `generateStaticParams`. No Pages Router patterns.

## Data Fetching and Caching

- **Prefer server-side fetching** via Server Components or `src/features/<feature>/api/`.
- Use `safeFetch` from `src/shared/api/client.ts` for all AniLiberty API calls (handles errors, 10 s timeout).
- Route handlers only for: OAuth callback (`src/app/(api)/auth/callback/route.ts`), browser-POST endpoints (`/anime-progress`), webhooks.
- **Async request APIs**: `params`, `searchParams`, `headers()`, `cookies()`, `draftMode()` are async-only in Next.js 16 — always `await` them.
- **Cache strategy**:
  - `cache: 'no-store'` — user-specific data, search results, frequently changing content.
  - `next: { revalidate: 3600 }` — catalog data where staleness is acceptable.
- **Next.js 16 cache API changes**:
  - `revalidateTag('tag', 'max')` now requires a second `cacheLife` argument. The single-arg form is deprecated (TypeScript error). Use when stale-while-revalidate is acceptable.
  - `updateTag('tag')` (Server Actions only) — immediate invalidation with read-your-writes semantics.
  - `refresh()` from `next/cache` — refreshes the client router from a Server Action.
  - `cacheLife` / `cacheTag` no longer need the `unstable_` prefix.
- Always handle upstream API failures explicitly: typed error objects, server-side logs, fallback UI on the client.

## Supabase and Auth

- Browser client: `src/lib/supabase/client.ts`
- Server client: `src/lib/supabase/server.ts`
- Session refresh: `src/proxy.ts` → `src/lib/supabase/proxy.ts` (Next.js 16 `proxy` convention — do not rename back to `middleware`).
- Only `NEXT_PUBLIC_*` variables may be read in client modules. Never expose service-role keys or server secrets.
- Validate auth server-side. Do not trust user identity sent from the client.

## UI and Styling

- **Design language**: Dark anime glass UI. CSS tokens in `src/app/globals.css` (OKLch color space, glass effects, player tokens).
- **Utility classes**: `cn` from `src/lib/utils/cn.ts` (`clsx` + `tailwind-merge`).
- **Tailwind CSS 4**: Configured via `@import 'tailwindcss'` in CSS. Do **not** add `tailwind.config.js` or v3 `theme/extend` patterns.
- **Components**: Prefer shadcn/ui (`@import 'shadcn/tailwind.css'`); use `@base-ui/react` for lower-level primitives.
- **Images**: `next/image` with `unoptimized: true`, `qualities: [75, 85]`. Remote patterns: `aniliberty.top`, `cdn.aniliberty.top`.
- **Responsive**: Always preserve mobile-first behavior. Check headers, cards, filters, modals, and player UI.
- Avoid visual refactors unless the task is explicitly design-focused.

## TypeScript and Code Style

- `strict: true` — no `any`, no weakened settings.
- Import alias: `@/*` → `src/*`.
- Prettier config in `.prettierrc`: single quotes, semicolons, `printWidth: 100`.
- Keep components small and composable; inline simple one-off logic.
- Do not rename/move files or reorganize folders unless required for the change.
- Explain non-obvious behavior only; avoid redundant comments.

## Security

- Sanitize all URL/search params before building API requests (`URLSearchParams`).
- Validate all server action and route handler inputs on the server.
- Never log secrets, tokens, cookies, or auth payloads.
- Use environment variables for secrets; document newly added ones.

## Player Architecture

Watch interface is built around **AnimeWatchSection** (`src/features/player/anime-watch-section.tsx`):

- Manages episode selection, player persistence (progress tracking), and episode lifecycle.
- **HlsVideoPlayer** (`src/features/player/hls-video-player.tsx`) handles VideoJS playback with HLS.js, Google Cast, AirPlay, PiP.
- Controls: `PlayButton`, `VolumeSlider`, `FullscreenButton`, `PipControl`, `CastControl`, `AirplayControl`, `SettingsMenu` from `@videojs/react`.
- Fragment markers (opening/ending) rendered via `usePlayer()` hook, positioned on the timeline.
- Progress saved to Supabase via `usePlayerPersistence` on episode select.
- HLS sources: `hls_1080`, `hls_720`, `hls_480`.
- VideoJS components are isolated in `src/features/player/` — do not import them into unrelated routes.

## Agent Behavior

- **Read context first** — read nearby code and patterns before editing.
- **Minimal diffs** — focused changes only; no unrelated refactors.
- **Check git history** when debugging: `git log --oneline -10`, `git diff HEAD~1`.
- **Root cause fixes** — fix the underlying issue, not the symptom.
- **Preserve lockfile** — do not modify `bun.lock` unless dependencies actually changed.
- **Ask before wide changes** — if a change has a wide blast radius or the architecture is unclear, ask first.
- **Simplest solution** — pick the approach that best fits the existing codebase style.
- Correctness over cleverness. Server-first. Feature-local ownership. Clear server/client boundaries.
