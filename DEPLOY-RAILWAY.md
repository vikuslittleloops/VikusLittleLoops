# Deploying Viku's Little Loops on Railway

Two separate services + one Postgres database, all in one Railway project.

- **Backend** → `vikus-little-loops-backend` (FastAPI)
- **Frontend** → `vikus-little-loops` (Vite/React static build)

Config files (`railway.json`, `Procfile`, `.python-version`) are already in place.

---

## 0. Prerequisites

1. Push both folders to GitHub. Either one repo with both folders, or two repos. One repo is easiest — Railway lets each service point at a subfolder via **Root Directory**.
2. Make sure `.venv/` and `node_modules/` are gitignored (they are).

```bash
cd D:\vll
git init
git add vikus-little-loops vikus-little-loops-backend
git commit -m "Initial commit"
# create a repo on GitHub, then:
git remote add origin https://github.com/<you>/vikus-little-loops.git
git push -u origin main
```

## 1. Create project + Postgres

1. Go to https://railway.app → **New Project** → **Deploy PostgreSQL**.
2. This gives you a `Postgres` service inside the project.

## 2. Backend service

1. In the same project: **+ New** → **GitHub Repo** → pick your repo.
2. Service **Settings** → **Root Directory** = `vikus-little-loops-backend`.
3. **Variables** tab — add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference, autocompletes) |
| `SECRET_KEY` | long random string — `python -c "import secrets; print(secrets.token_hex(32))"` |
| `BACKEND_CORS_ORIGINS` | fill in after step 3 with the frontend URL, e.g. `https://vll-frontend.up.railway.app` |
| `FIRST_ADMIN_EMAIL` | your admin email |
| `FIRST_ADMIN_PASSWORD` | a strong password (change from ChangeMe123!) |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | your Cloudinary creds |
| `GOOGLE_CLIENT_ID` | your Google OAuth client ID (optional) |

4. **Settings** → **Networking** → **Generate Domain**. Note the URL, e.g. `https://vll-backend.up.railway.app`.
5. Deploy runs automatically. Start command (from `railway.json`): `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Verify: open `https://<backend-domain>/api/health` → `{"status":"healthy"}`.

### Seed the database (one time)

From your local machine with the Railway CLI:

```bash
npm i -g @railway/cli
railway login
cd D:\vll\vikus-little-loops-backend
railway link        # pick project + backend service
railway run python -m scripts.seed
```

`railway run` injects the service variables locally. If the injected `DATABASE_URL` uses Railway's private hostname (`postgres.railway.internal`) it won't resolve from your machine — copy `DATABASE_PUBLIC_URL` from the Postgres service and run instead:

```bash
set DATABASE_URL=<public url, prefixed postgresql+psycopg2://>
python -m scripts.seed
```

## 3. Frontend service

1. **+ New** → **GitHub Repo** → same repo.
2. **Settings** → **Root Directory** = `vikus-little-loops`.
3. **Variables** tab:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<backend-domain>.up.railway.app/api` |

   Vite bakes this in at **build** time — if you change it later, redeploy.
4. **Generate Domain** for the frontend too.
5. Build/serve come from `railway.json`: `npm run build`, then `serve -s dist` (SPA-safe — deep links like `/products/x` won't 404).

## 4. Wire CORS

Back in the **backend** Variables, set:

```
BACKEND_CORS_ORIGINS=https://<frontend-domain>.up.railway.app
```

(no trailing slash; comma-separate to also allow localhost). The backend redeploys automatically.

## 5. Smoke test

1. `https://<backend>/docs` — Swagger loads.
2. `https://<frontend>` — site loads, products appear (proves API + CORS + seed all work).
3. Log into the admin panel with `FIRST_ADMIN_EMAIL` / `FIRST_ADMIN_PASSWORD`.

## Troubleshooting

- **CORS error in browser console** → `BACKEND_CORS_ORIGINS` doesn't exactly match the frontend origin (check https, no trailing slash).
- **Frontend calls localhost:8000** → `VITE_API_URL` wasn't set at build time; set it and redeploy.
- **relation does not exist** → DB not seeded/migrated; run the seed step.
- **App crashes on boot** → check Deploy Logs; usually a missing variable (`DATABASE_URL`, `SECRET_KEY`).
- Alembic `versions/` is empty, so `alembic upgrade head` is a no-op; tables come from the seed script. When you later generate migrations, they'll apply automatically on each deploy.
