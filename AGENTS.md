# Anilyfe Agent Instructions

This repository is a modern anime streaming web app built with Next.js App Router.
Follow these rules to keep changes aligned with the current architecture and safe for production.

## 1. Project Stack

- Next.js 16 App Router, React 19, TypeScript strict mode.
- Runtime/deployment target: Vercel.
- Styling/UI: Tailwind CSS 4, HeroUI, custom CSS tokens in `src/app/globals.css`, Framer Motion where animation already exists.
- Auth/backend: Supabase with `@supabase/ssr`.
- Video/player: Vidstack, Artplayer, HLS.js.
- Data source: AniLiberty API through feature/shared API helpers.
- Icons: prefer `lucide-react` when an icon is needed and it fits.

## 2. Version-Matched Next.js Rule

Before writing or modifying Next.js-specific code, check local version-matched docs if they exist:

- Look for `node_modules/next/dist/docs/`.
- If local docs are unavailable, infer from the installed package version and existing code patterns.
- Do not introduce Pages Router patterns (`pages/`, `getServerSideProps`, `getStaticProps`) unless explicitly requested.
- Use App Router conventions: route groups, `layout.tsx`, `page.tsx`, route handlers, metadata exports, and Server Components by default.
- In this project, request/session refresh is handled through `src/proxy.ts`; do not rename it to old middleware conventions without verifying current Next.js behavior.

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

- Prefer direct server-side data fetching in Server Components or feature API helpers over adding new route handlers.
- Use route handlers only for OAuth callbacks, browser-called endpoints, webhooks, or integrations that require an HTTP boundary.
- Keep route handlers thin; put reusable logic in `src/features`, `src/shared`, or `src/lib`.
- Use `safeFetch` from `src/shared/api/client.ts` or match its behavior when calling external APIs.
- Be deliberate with caching:
  - Use `cache: 'no-store'` for personalized, frequently changing, or filter/search data.
  - Use `next: { revalidate: ... }` only when stale data is acceptable.
  - Do not disable caching globally without a reason.
- Always handle failed external API calls explicitly and preserve sensible fallback UI.

## 6. Supabase and Auth

- Browser Supabase client lives in `src/lib/supabase/client.ts`.
- Server Supabase client lives in `src/lib/supabase/server.ts`.
- Session refresh/proxy logic lives in `src/lib/supabase/proxy.ts` and `src/proxy.ts`.
- Never expose service-role keys or server secrets to client code.
- Only `NEXT_PUBLIC_*` variables may be read in client modules.
- Validate auth-dependent operations on the server. Do not trust user identity sent from the client.

## 7. UI, Styling, and Design System

- Use the existing dark anime/glass visual language and CSS tokens from `src/app/globals.css`.
- Prefer HeroUI components when they are already used for the same kind of control.
- Use the local `Button` in `src/components/ui/button.tsx` where the surrounding code uses local UI primitives.
- Use `cn` from `src/lib/utils/cn.ts` for conditional class names.
- Tailwind CSS 4 is configured through CSS (`@import`, `@plugin`, `@theme`, `@source`), not a Tailwind 3-style setup. Do not add old Tailwind config patterns unless required.
- Preserve responsive behavior for mobile and desktop; check compact layouts when changing headers, cards, filters, modals, or player UI.
- Avoid broad visual rewrites unless the task is explicitly design-focused.

## 8. TypeScript and Code Style

- Keep TypeScript strict-safe. Avoid `any`; prefer existing domain types from `src/shared/types` or feature `types` folders.
- Use the `@/*` path alias for imports from `src` when it improves readability.
- Follow existing formatting: single quotes, semicolons, Prettier-managed layout.
- Keep components small and composable, but do not add abstractions for one-off code.
- Do not rename files, move features, or reorganize folders unless necessary for the requested change.
- Comments should explain non-obvious behavior only.

## 9. Forms, Input, and Security

- Validate all server action, route handler, and external input on the server.
- Sanitize URL/search params before using them to build API requests.
- Do not interpolate untrusted input into URLs without `URLSearchParams` or equivalent structured handling.
- Never log secrets, tokens, cookies, or full auth payloads.
- Do not hardcode secrets. Use environment variables and document newly required variables.

## 10. Performance

- Keep server-rendered pages server-first.
- Avoid unnecessary client state, effects, and client-only wrappers.
- Use `next/image` or the local image wrapper consistently with existing code.
- Respect `next.config.ts` image `remotePatterns` and qualities. Update the config only when adding a real external image source.
- Be careful with heavy animation, canvas, video, and player libraries; load them only where needed.
- Avoid over-fetching large AniLiberty responses; request only the data and page size needed by the UI.

## 11. Commands and Verification

Use the project scripts:

- `npm run dev`: start Next.js with Turbopack.
- `npm run build`: production build with Turbopack.
- `npm run lint`: ESLint.
- `npm run format`: Prettier write.
- `npm run knip`: unused files/exports check.

When making code changes, run the narrowest useful verification first. For shared or routing changes, prefer at least `npm run lint` and `npm run build` when feasible.

## 12. Agent Behavior

- Prefer minimal, production-safe diffs.
- Read the nearby code before editing.
- Check recent changes first when debugging.
- Fix the root cause, not only the symptom.
- Do not refactor unrelated code.
- Do not change lockfiles unless dependencies actually changed.
- If architecture is unclear and a change would have a wide blast radius, ask before changing.
- If several solutions are possible, choose the simplest one that matches the current codebase.

## Project Priorities

- Correctness over cleverness.
- Server-first architecture.
- Feature-local ownership.
- Clear server/client boundaries.
- Safe auth and environment handling.
- Smooth, responsive anime-streaming UX.
