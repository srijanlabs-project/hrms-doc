# Deploying Staffsy to Railway (UAT)

This repo builds to a single Docker image: the NestJS API serves the built React
SPA from the same origin (see `app/apps/api/src/main.ts`), so there's no CORS or
cross-origin cookie setup to worry about — one Railway service, one URL.

## What's already in the repo

- `Dockerfile` (repo root) — multi-stage build, produces the runtime image.
- `railway.json` — tells Railway to build with the Dockerfile and where the
  health check lives (`/api/v1/health`).
- `.dockerignore` — keeps the build context small.

## Steps (all in the Railway dashboard — I can't do these for you)

1. **New Project → Deploy from GitHub repo** → select `srijanlabs-project/hrms-doc`.
   Railway will detect `railway.json` and build with the root `Dockerfile`
   automatically — no need to set a Root Directory.

2. **Add a PostgreSQL database** to the same Railway project (`+ New` →
   `Database` → `PostgreSQL`). Railway provisions it and exposes its own
   `DATABASE_URL` variable on that Postgres service.

3. **On the API service's Variables tab**, add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` — Railway's variable-reference syntax, pick the Postgres service from the picker in their UI |
   | `JWT_SECRET` | a random secret, e.g. generate one with `openssl rand -hex 32` |
   | `NODE_ENV` | `production` (the Dockerfile already sets this, but Railway can override — set it explicitly to be safe) |

   `PORT` is injected automatically by Railway — the app already reads
   `process.env.PORT`, nothing to do there.

4. **Deploy.** Railway builds the Dockerfile and starts the container. The
   start command (`npx prisma migrate deploy && node dist/main.js`) applies
   every migration — including the hand-appended Postgres RLS policies
   already committed in each migration's `migration.sql` — before the app
   starts serving traffic.

5. **Seed demo data once**, after the first successful deploy. Open a shell
   against the API service (Railway dashboard → service → the `...` menu →
   "Shell", or via `railway run` locally if you have the CLI installed and
   linked to this project):

   ```bash
   npm run db:seed --workspace @staffsy/api
   ```

   This is a one-time step — re-running it isn't idempotent (some rows use
   plain `create`, not `upsert`), so only run it once against a fresh database.

6. **Open the app.** Railway gives the service a `*.up.railway.app` URL —
   that's both the web app and the API (`/api/v1/*`, docs at `/api/docs`).

## Known limitations of this UAT build

- **OTP is hardcoded.** `StaticDevOtpProvider` always returns the code
  `123456` for every login — there's no real email/SMS gateway wired up yet
  (the code comment for this literally says "BEFORE UAT: replace with a real
  integration"). Anyone who knows a valid tenant code + email can sign in
  with that fixed code. Fine for a small trusted group testing internally;
  not fine for anything wider. Say the word if you want a real email-based
  OTP provider added before you open this up further — that needs its own
  service (e.g. Resend, SES) and an API key I can't provision myself.
- **Uploaded files don't persist across deploys.** The File Storage engine
  writes to local disk (`uploads/` under the API's working directory).
  Railway's filesystem is ephemeral per deploy unless you attach a Volume
  to the service (Settings → Volumes, mount it at `/app/apps/api/uploads`).
  Not needed to get UAT running, worth doing if document uploads matter to
  what you're testing.
- **Demo credentials** (after seeding): tenant code `srijanlabs`, admin
  `priya.sharma@srijanlabs.example`, employee `ananya.kapoor@example.com`,
  OTP always `123456`. A second tenant `globex` / `alex.carter@globex.example`
  exists to demo cross-tenant isolation.
