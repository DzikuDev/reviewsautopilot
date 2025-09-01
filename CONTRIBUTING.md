# Contributing Guide

Thank you for helping improve Reviews Autopilot. This guide keeps contributions fast, consistent, and safe.

## Getting Started
- Requirements: Node 18+, npm, a local Postgres (or use the provided setup scripts).
- Setup: `cp env.example .env` then configure values. Initialize DB with `npm run setup` (or `setup:local`).
- Run: `npm run dev` at `http://localhost:3000`.
- Validate: `npm test` (runs lint → types → build).

## Branching & Commits
- Branches: `feature/<short-scope>`, `fix/<short-scope>`, `chore/<short-scope>`.
- Commits: Conventional Commits, e.g. `feat: add tone profiles list`, `fix: handle null org id`.
- Keep subjects imperative; add context in the body and reference issues (e.g., `Closes #123`).

## Code Style
- TypeScript strict mode; prefer explicit types on exports and public APIs.
- Components in PascalCase; app routes in kebab-case folders.
- Lint: `npm run lint` (auto-fix with `-- --fix`). Keep Core Web Vitals rules green.
- Imports: prefer `@/*` alias for local modules.

## Tests & Validation
- Primary checks: `npm test` must pass before opening a PR.
- Manual flows: follow `TESTING_CHECKLIST.md`; verify key pages and API routes.
- Prisma changes: run `npm run db:generate` → `npm run db:push`; validate in `npm run db:studio` and note changes in the PR.

## Pull Requests
- Open against `main`. Fill out the PR template.
- Include: description, linked issue, screenshots (UI), test steps, and any DB/env changes.
- CI parity: locally run `npm test` before requesting review.
