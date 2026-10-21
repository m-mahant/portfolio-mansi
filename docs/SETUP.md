# Setup

Mansi Mahant’s portfolio is a **dynamic multi-work portfolio CMS**: **Next.js** (`frontend/`) and **Express** (`backend/`). There is no root `package.json`. Copy env files from each app’s `.env.example`. Never commit real secrets.

How the stack is wired: [architecture.md](./architecture.md). HTTP routes and request flow: [api.md](./api.md).

## What you need

- Node.js 18+ and npm
- A [Firebase](https://console.firebase.google.com/) project with **Authentication** (Email/Password) and **Cloud Firestore**
- An [ImageKit](https://imagekit.io/) account (media uploads and CDN URLs)
- One Firebase Auth user who will become the first admin

Firebase Storage holds nothing app-facing; it is only used as the optional destination for scheduled Firestore backups (see Security). The browser never writes Firestore; the API uses the Admin SDK.

## Local development

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill FIREBASE_* and IMAGEKIT_*
npm install
npm run dev
# http://localhost:4000
```

Create a Firebase Auth user in the console, then allow-list them:

```bash
# in backend/.env
BOOTSTRAP_ADMIN_EMAIL=you@example.com

npm run bootstrap:admin
```

That upserts `admins/{uid}` with `isActive: true`. Admin routes require a Firebase ID token **and** that document.

Optional sample content (overwrites seed document IDs; deletes catalog docs that are not in the seed list):

```bash
npm run seed:firebase-content
```

Sample media URLs point at placeholders. Upload real files through Admin → Media (ImageKit) and replace URLs in the CMS.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# plus Firebase web app keys (Project settings → Your apps)
npm install
npm run dev
# http://localhost:3000
```

Public site: `/`. Admin: `/admin/login`. API docs: `http://localhost:4000/api-docs` (development only, not mounted when `NODE_ENV=production`).

## Environment

**Frontend** (`frontend/.env.local`) — all `NEXT_PUBLIC_*` values are visible in the browser. Do not put Admin SDK or ImageKit private keys here.

| Variable | Local example |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` (no `/api/v1` suffix) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | usually `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | from Firebase |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | from Firebase |

**Backend** (`backend/.env`)

| Variable | Notes |
| --- | --- |
| `PORT` | `4000` locally. Do **not** set this on Render; the platform injects `PORT`. |
| `FRONTEND_URL` | Public origin of the Next app, no trailing slash. Used for CORS. |
| `NODE_ENV` | `development` or `production` |
| `FIREBASE_PROJECT_ID` | Must match the frontend project |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Full private key; keep `\n` escaping as in the downloaded JSON |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit (server only) |
| `IMAGEKIT_URL_ENDPOINT` | e.g. `https://ik.imagekit.io/your_id` |
| `BOOTSTRAP_ADMIN_EMAIL` | Only needed for `npm run bootstrap:admin` |
| `RESEND_API_KEY` | Optional. Enables an email notification on contact form submissions (via [Resend](https://resend.com)). Form still saves to Firestore if unset. |
| `CONTACT_NOTIFICATION_EMAIL` | Optional. Where the contact notification is sent. |
| `CONTACT_FROM_EMAIL` | Optional. Verified Resend sender; defaults to `onboarding@resend.dev`. |
| `FIREBASE_STORAGE_BUCKET` | Optional. Defaults to `${FIREBASE_PROJECT_ID}.appspot.com`. Only read by the scheduled Firestore backup. |

## Firestore rules

Lock client SDK access. The API uses the Admin SDK and bypasses rules, so authorization must stay in Express (`admins/{uid}`).

Example (adjust to your project):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Deploy (optional)

This is not a hosted SaaS. You can run your own instance.

1. **API** — Render Web Service via the root `render.yaml` Blueprint (New → Blueprint, connect the repo). Builds `backend/`, start command `npm start` (`tsx src/server.ts`), health check `/api/v1/health`. Fill in `FRONTEND_URL` and the Firebase Admin + ImageKit env vars in the Render dashboard (left blank in the Blueprint on purpose — never commit real secrets). Do not set `PORT` on Render.
2. **Web** — Next.js (for example Vercel) from `frontend/`. Set every `NEXT_PUBLIC_*` as **plain config** (not secret) so they are inlined at build time. `NEXT_PUBLIC_API_URL` is the API origin without `/api/v1`. `NEXT_PUBLIC_SITE_URL` is the live site origin, not localhost.
3. Firebase Auth → **Authorized domains**: add your production host (for example `your-app.vercel.app`).
4. Redeploy the frontend after changing `NEXT_PUBLIC_*` values.
5. Render's free plan spins the API down after 15 minutes of no inbound traffic. `.github/workflows/keep-backend-awake.yml` pings `/api/v1/health` every 10 minutes to keep it warm — after the first deploy, add a repository variable `BACKEND_HEALTH_URL` (Settings → Secrets and variables → Actions → Variables) set to `https://<your-render-service>.onrender.com/api/v1/health`.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: backend lint + typecheck, frontend lint + typecheck + unit tests + build. It does not run `backend`'s `npm test` — those integration tests hit the real Firestore project and send a real email through Resend on every contact-form test case, which would spam production data on each push. Run `npm test` manually in `backend/` before merging instead.

## Security

- ImageKit private key and Firebase service-account key stay on the API only.
- Admin login is Firebase Auth + `admins/{uid}`. Do not skip that check.
- Swagger UI documents the API; it does not bypass auth on admin routes.
- `npm run backup:firestore` (from `backend/`) exports every collection to timestamped JSON under `backend/backups/` (gitignored — contains visitor PII from `contactMessages`). `.github/workflows/backup-firestore.yml` also runs this weekly (Sundays) and, since GitHub Actions artifacts are publicly downloadable on a public repo, uploads the JSON to the project's private Firebase Storage bucket instead (`BACKUP_UPLOAD_TO_STORAGE=true`, under `firestore-backups/<timestamp>/`) — never as a workflow artifact. Requires repository secrets `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET`.

## After clone: make it yours

1. Change site name, about copy, and socials in Admin (or edit `backend/scripts/seed-firebase-content.ts` and re-seed).
2. Brand fallbacks live in `frontend/src/lib/brand.ts` and `backend/src/lib/brand.ts`.
3. GitHub repository: **`portfolio-mansi`**.
4. If you use the Firebase CLI, set `.firebaserc` `projects.default` to your real Firebase project id (the committed value is a placeholder).
