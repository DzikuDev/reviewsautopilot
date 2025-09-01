# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with Next.js App Router in `src/app/` (pages, API routes under `src/app/api/*`).
- UI: Reusable components in `src/components/*` (PascalCase files, colocated styles where needed).
- Libraries: Shared server/client utilities in `src/lib/*` (auth, db, providers, modelRouter, utils).
- Types: Global augmentations in `src/types/*`.
- Assets: `public/` for static files.
- Database: Prisma schema and migrations in `prisma/`. Docs and checklists in `docs/` and root `*.md` files.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server (Turbopack) on `http://localhost:3000`.
- `npm run build`: Production build via Next.js.
- `npm start`: Start built app.
- `npm run lint`: ESLint (Next core-web-vitals + TS) check.
- `npm test`: Runs `scripts/test-app.js` (lint → typecheck → build, with optional dev prompt).
- DB utilities: `npm run setup`, `npm run setup:local`, `npm run verify:db`, `npm run db:generate`, `npm run db:push`, `npm run db:studio`.

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true`). Prefer explicit types on exports and public APIs.
- Components: PascalCase file and export names (e.g., `RecentReviews.tsx`).
- Variables/functions: camelCase; constants UPPER_SNAKE_CASE when global.
- Routing: Next App Router folders in kebab-case (e.g., `src/app/tone-profiles/page.tsx`).
- Linting: Fix issues locally with `npm run lint -- --fix`. Tailwind utility-first styles; avoid unused classes.

## Testing Guidelines
- Primary checks: `npm test` (ESLint, `tsc --noEmit`, Next build). Keep this green before PRs.
- Manual flows: Use `TESTING_CHECKLIST.md` and `TESTING_FAQ.md`. Start dev with `npm run dev` to verify pages and API routes.
- No unit test framework is configured yet; prefer adding types, schema validation (Zod), and isolated lib functions for future tests.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat:`, `fix:`, `chore:`, `refactor:`). Imperative, ≤ 72-char subject; include context in body and reference issues (`#123`).
- PRs: Clear title and description, linked issue, screenshots for UI changes, notes on DB/schema changes, and testing steps. Ensure lint/types/build pass (`npm test`).

## Security & Configuration Tips
- Env: Copy `env.example` to `.env`/`.env.local`. Do not commit secrets. Use `npm run verify:db` after updates.
- Data: When changing Prisma schema, run `npm run db:generate` and `npm run db:push` and verify in `db:studio`.
