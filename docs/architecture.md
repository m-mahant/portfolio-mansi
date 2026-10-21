# Architecture

Mansi Mahant's portfolio is one CMS-backed portfolio, not a SaaS. Two apps, one API, one Firestore project, ImageKit for files.

```text
Browser (public /admin)
        │
        ▼
   Next.js 16 (frontend/)
        │  fetch  NEXT_PUBLIC_API_URL
        ▼
   Express (backend/)  /api/v1
        │
        ├── Firebase Admin → Cloud Firestore
        └── ImageKit SDK  → CDN URLs stored in Firestore
```

The Next.js app does **not** read or write Firestore. Firebase JS SDK is Auth only (Admin login).

## Layers (backend)

`routes` → `controllers` → `services` → `repositories` → Firestore.

Validators (Zod) sit on admin writes. Errors go through `AppError` and the global error middleware. Response shape:

```json
{ "success": true, "data": {} }
```

or `{ "success": false, "error": { "code", "message", "details?" } }`.

## Layers (frontend)

- Public pages: `frontend/src/app/(public)/` fetch via `frontend/src/services/api/public-api.ts`.
- Admin pages: `frontend/src/app/admin/` call `frontend/src/lib/api/admin-api.ts` with a Firebase ID token.
- Brand fallbacks (if the API is down): `frontend/src/lib/brand.ts`.

## What lives where

| Kind | Firestore | Example |
| --- | --- | --- |
| Page chrome | One config doc per page | `introPage/config`, `homePage/config`, `workPage/config`, `developmentPage/config`, `artPage/config`, `blogPage/config`, `experiencePage/config`, `contactPage/config`, `privacyPage/config` |
| Profile | Single doc | `about/profile` |
| Global | Single docs | `siteSettings/general`, `themeSettings/active` |
| Catalogs | Collections | `projects`, `artworks`, `blogs`, `experiences`, `education`, `socialLinks` |
| Media metadata | `media/{id}` | URL + ImageKit file id; bytes are on ImageKit |
| Authz | `admins/{uid}` | `isActive` + role. Created by `npm run bootstrap:admin` |
| Inbox | `contactMessages/{id}` | Public `POST /contact` |

Public catalog GETs return **published / visible** rows only. Admin lists return everything.

## Auth

1. Admin signs in with Firebase Auth (email/password) in the browser.
2. Client sends `Authorization: Bearer <ID token>` to `/api/v1/admin/*`.
3. `authenticate` verifies the token with Firebase Admin.
4. `authorizeAdmin` loads `admins/{uid}` and requires `isActive`.

Missing token → 401. Valid user, not admin → 403.

CORS allows `FRONTEND_URL` only.

## Media

Uploads go to `POST /api/v1/admin/media/upload` (multipart). The API writes the file to ImageKit, then stores metadata in `media`. Public pages only ever receive CDN URLs from content documents.

## Live docs

OpenAPI UI: `http://localhost:4000/api-docs` (also `/api/v1/docs`). JSON: `/api-docs/json`. Mounted only when `NODE_ENV !== 'production'`.

If this file and the code disagree, **code wins**.
