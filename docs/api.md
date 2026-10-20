# API

Base: `http://localhost:4000/api/v1`.
Set `NEXT_PUBLIC_API_URL` to the **origin** (`http://localhost:4000`), not `/api/v1`. The public client appends `/api/v1`.

Interactive spec: `/api-docs` (development only, not mounted in production). Envelope: `{ success, data }` or `{ success, error }`.

## Request flow

### Public page

```text
Public page (RSC)
  → public-api.ts GET /api/v1/...
  → public route → controller → service → repository
  → Firestore (published/visible only)
  → JSON → render
```

### Admin save

```text
Admin form
  → Firebase getIdToken()
  → admin-api.ts  Authorization: Bearer
  → authenticate (verify token)
  → authorizeAdmin (admins/{uid}.isActive)
  → Zod validate
  → repository set/patch
  → Firestore
```

### Login

```text
/admin/login  → Firebase Auth
  → GET /api/v1/admin/auth-check
  → 200 if admins/{uid} is active
```

### Contact form

```text
POST /api/v1/contact  (rate limited)
  → contactMessages/{id}
  → best-effort email notification via Resend (if RESEND_API_KEY is set)
```

### Media upload

```text
POST /api/v1/admin/media/upload  (multipart, admin)
  → ImageKit
  → media/{id} (url, fileId, alt, …)
```

## Public (`/api/v1`)

No auth except the contact POST.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | Process health |
| GET | `/site` | Global branding / SEO defaults |
| GET | `/intro` | Intro page config |
| GET | `/home` | Home config |
| GET | `/work` | Work overview config |
| GET | `/development` | Development listing chrome |
| GET | `/art` | Art listing chrome |
| GET | `/blog-page` | Blog listing chrome |
| GET | `/experience-page` | Experience page chrome |
| GET | `/about` | About profile |
| GET | `/social`, `/social-links` | Visible socials |
| GET | `/contact` | Contact page config |
| POST | `/contact` | Message submit |
| GET | `/projects` | Published projects (query: pagination) |
| GET | `/projects/:slug` | Project by slug |
| GET | `/artworks` | Published artworks |
| GET | `/artworks/:slug` | Artwork by slug |
| GET | `/blogs` | Published posts |
| GET | `/blogs/:slug` | Post by slug |
| GET | `/experience` | Visible experience |
| GET | `/education` | Visible education |
| GET | `/theme` | Theme tokens |

## Admin (`/api/v1/admin`)

All routes: Firebase Bearer + active `admins/{uid}`.

Page configs are GET + PATCH on a single resource:

| Path | |
| --- | --- |
| `/intro`, `/home`, `/work` | |
| `/development`, `/art`, `/blog-page`, `/experience-page` | |
| `/contact` | |
| `/site`, `/about`, `/theme` | GET + PATCH |

Catalogs (list / get / create / patch / delete):

| Path | Id param |
| --- | --- |
| `/projects` | `:projectId` |
| `/artworks` | `:artworkId` |
| `/blogs` | `:id` |
| `/experience` | `:id` |
| `/education` | `:id` |
| `/social-links` | `:socialId` (no GET-by-id) |

Media:

| Method | Path |
| --- | --- |
| GET | `/media` |
| GET | `/media/:mediaId` |
| POST | `/media/upload` |
| PATCH | `/media/:mediaId` |
| DELETE | `/media/:mediaId` |

Auth check: `GET /auth-check`.

## Clients in this repo

- Public: `frontend/src/services/api/public-api.ts`
- Admin: `frontend/src/lib/api/admin-api.ts`
- Routes: `backend/src/routes/public.routes.ts`, `backend/src/routes/admin.routes.ts`
