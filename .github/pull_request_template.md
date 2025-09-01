# Pull Request

## Summary
- What does this change do and why?

## Linked Issue
- Closes #

## Type of Change
- [ ] feat (new feature)
- [ ] fix (bug fix)
- [ ] refactor (no behavior change)
- [ ] chore/docs/build
- [ ] perf

## Screenshots / Demos
- If UI changes, add before/after or a short clip.

## How to Test
1. `npm install` (if needed)
2. `npm test` (lint → types → build)
3. `npm run dev` and verify:
   - Pages: …
   - API routes: …

## DB / Env Changes
- [ ] Prisma schema changed
  - Commands run: `npm run db:generate` and `npm run db:push`
  - Verified in: `npm run db:studio`
- [ ] Env changes (document updates to `.env.example`)

## Checklist
- [ ] I ran `npm test` locally and it passed.
- [ ] I updated docs (README/AGENTS.md/CONTRIBUTING) when needed.
- [ ] I added types or validation where appropriate (Zod/TS).
- [ ] I removed debugging output and unused code.
