# Mansi Mahant

**Personal portfolio and CMS.**

[![CI](https://github.com/m-mahant/portfolio-mansi/actions/workflows/ci.yml/badge.svg)](https://github.com/m-mahant/portfolio-mansi/actions/workflows/ci.yml)

Mansi Mahant's personal site — software projects, artwork, writing, and experience, all on one public site, edited in Admin, served live.

Stack: Next.js + Express + Cloud Firestore + ImageKit.

**GitHub About:** `Personal multi-work portfolio CMS — software, art, writing, and experience. Public site + Admin.`

```text
Admin UI  →  /api/v1/admin  →  Firestore / ImageKit
Public UI →  /api/v1        →  Firestore (ImageKit URLs)
```

License: [Proprietary — all rights reserved, not open source](./LICENSE). Setup: [docs/SETUP.md](./docs/SETUP.md). Architecture: [docs/architecture.md](./docs/architecture.md). API: [docs/api.md](./docs/api.md).

---

## What you get

**Public** (`http://localhost:3000`)

| Route | Purpose |
| --- | --- |
| `/intro` | Entry experience |
| `/` | Home |
| `/about` | Profile |
| `/work` | Development vs art overview |
| `/work/development`, `/work/development/[slug]` | Projects |
| `/work/art-crafts`, `/work/art-crafts/[slug]` | Artwork |
| `/experience` | Work + education |
| `/blog`, `/blog/[slug]` | Posts |
| `/contact` | Contact form and details |

**Admin** (`/admin`) — Firebase Auth. Access requires `admins/{uid}` (`isActive`). Page configs, catalogs (projects, artworks, blogs, experience, education), site, socials, media, SEO, theme.

---

## Layout

```text
portfolio-mansi/
├── frontend/          # Next.js (public + admin)
├── backend/           # Express API
│   ├── src/
│   └── scripts/       # bootstrap-admin, seed-firebase-content
├── firebase/          # Firestore/Storage security rules + indexes (optional, Firebase CLI)
├── docs/
│   ├── SETUP.md
│   ├── architecture.md
│   └── api.md
├── firebase.json      # Firebase CLI config — must stay at repo root
├── .firebaserc        # Firebase CLI project alias — must stay at repo root
├── AGENTS.md
├── LICENSE
└── README.md
```

Use **`frontend/.env.example`** and **`backend/.env.example`**. The root `.env.example` only points at those files.

---

## Quick start

```bash
cd backend && cp .env.example .env && npm install && npm run dev
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

Fill Firebase and ImageKit keys, bootstrap an admin, optionally seed sample content. Full steps: [docs/SETUP.md](./docs/SETUP.md).

| App | Command | Notes |
| --- | --- | --- |
| frontend | `npm run dev` | port 3000 |
| backend | `npm run dev` | port 4000 |
| backend | `npm run bootstrap:admin` | writes `admins/{uid}` |
| backend | `npm run seed:firebase-content` | sample Firestore data |

API: `http://localhost:4000/api/v1`. Swagger: `/api-docs` (development only). Inventory and request flow: [docs/api.md](./docs/api.md).

---

## CMS in one paragraph

Each public page has a Firestore config document. Catalogs are separate collections. Global site settings, theme tokens, social links, and the media library are shared. Edit in Admin; the public app reads through the API. Diagrams: [docs/architecture.md](./docs/architecture.md).

---

## GitHub

GitHub repository: **`portfolio-mansi`**.
