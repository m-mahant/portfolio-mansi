# AGENTS.md — Mansi Mahant Portfolio

Instructions for coding agents working in this repository.

## Workflow

Read `README.md`, `docs/SETUP.md`, `docs/architecture.md`, and `docs/api.md`, then inspect the code that already exists. Plan non-trivial work before editing. Prefer small, typed, single-purpose modules. Do not invent a second CMS or a second data store.

Source code is authoritative. Do not treat old completion reports as truth.

## Layout

- `frontend/` — Next.js 16 App Router (public + admin). Public fetchers: `frontend/src/services/api/public-api.ts`. Admin client: `frontend/src/lib/api/admin-api.ts`. Brand fallbacks: `frontend/src/lib/brand.ts`.
- `backend/` — Express, Zod validators, Firestore repositories, ImageKit uploads. Brand fallbacks: `backend/src/lib/brand.ts`.
- Docs that must stay current: `README.md`, `docs/SETUP.md`, `docs/architecture.md`, `docs/api.md`, this file. Do not add task lists, “current state”, or duplicate frontend/backend context files.

## Implementation plan (non-trivial tasks)

Include: task, goal, current state, affected files, steps, risks, tests, docs, commit plan. Do not start coding until that is clear.

## Code

- TypeScript everywhere; avoid `any`.
- Separate routes, controllers, services, repositories.
- camelCase / PascalCase / kebab-case as already used in the tree.
- One-line comment above meaningful functions explaining purpose, not restating the name.
- Env vars for URLs, Firebase, ImageKit. Never commit `.env` or `.env.local`. Keep `.env.example` placeholders only.

## Git

Feature branches: `<type>/<scope>/<short-description>`. Conventional Commits. Before commit: `git status`, `git diff`, `git diff --check`. No secrets, no leftover debug logs.

## Checklist

- [ ] Inspected existing patterns
- [ ] Types, errors, and env handled
- [ ] Tests or equivalent verification for the change
- [ ] README / SETUP / architecture / API updated if setup, env, layers, or routes changed
