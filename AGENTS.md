# WaterWise

## Repo structure

Two independent packages — **not** a monorepo workspace. Each has its own `package.json`, `package-lock.json`, and `node_modules/`. There is no root `package.json` with scripts.

| Directory | Stack | Entry |
|-----------|-------|-------|
| `frontend/` | React 19, Vite 8, Tailwind CSS 4, PWA (vite-plugin-pwa) | `src/main.jsx` |
| `backend/` | Express 5, Supabase, Google Gemini AI | `app.js` |

`docs/` contains project objective roadmaps (not developer docs). `frontend/DESIGN.md` is the UI design specification.

## Commands

All commands run from their respective package directory (`frontend/` or `backend/`).

### Frontend

```bash
cd frontend
npm run dev          # Vite dev server on :5173, proxies /api → backend :5000
npm run build        # Production build
npm run lint         # ESLint
npm run test:unit    # Vitest single run (excludes e2e/)
npm run test:pwa     # Vitest: PWA-specific tests only
npm run test:e2e     # Playwright (auto-starts both frontend + backend servers)
npm run test:e2e:ui  # Playwright interactive UI mode
```

### Backend

```bash
cd backend
npm start            # Production (node app.js)
npm run dev          # Nodemon (auto-reload)
npm test             # Vitest run with coverage (excludes supabase.test.js)
npm run test:supabase # Vitest: Supabase integration test only (needs real credentials)
```

## Verification order

Frontend changes: `npm run lint` → `npm run test:unit` → `npm run build`

Backend changes: `npm test`

E2E is separate — it starts its own servers (backend on port 5001, frontend on 5173) via `src/test/e2e/serverProcesses.js`. Do not start servers manually before running E2E.

## Architecture notes

### Auth

No real auth backend. The frontend uses a mock role system via `localStorage` key `waterwise:mockRole`. Valid roles: `admin`, `meter-reader`, `consumer`. Routes are guarded by `RoleRouteGuard` in `App.jsx`. Login sets the localStorage value and redirects based on API response role.

### API proxy

Vite dev server proxies `/api` to `http://127.0.0.1:5000` (configurable via `WATERWISE_API_TARGET` env var). Backend CORS allows `http://localhost:5173`.

### Testing

- **Frontend unit tests** use Vitest + jsdom + React Testing Library. The MSW mock server (`src/test/sample-backend/`) is auto-started via `src/test/mockAPI.js` setup file.
- **Backend unit/integration tests** use Vitest + node + supertest. Tests live in `backend/test/unit/` and `backend/test/integration/`.
- **E2E tests** (Playwright) live in `frontend/src/test/e2e/`. They run sequentially (`fullyParallel: false`, `workers: 1`). Global setup/teardown manages server lifecycle. Only Chromium project is configured.
- `backend/test/supabase.test.js` tests against a real Supabase instance. It is excluded from `npm test` and has its own script. Requires `SUPABASE_URL` and `SUPABASE_KEY` in `backend/.env`.

### External services

- **Supabase** — database (configured in `backend/config/db.js` and `backend/config/supabase.js`)
- **Google Gemini AI** — anomaly detection and recommendations (`backend/config/gemini.js`). Gracefully degrades if `GEMINI_API_KEY` is absent.

### PWA

Service worker uses auto-update strategy. Static assets are precached; API responses are cached with NetworkFirst for Supabase endpoints only. Do not commit generated service worker files.

## Gotchas

- Backend uses **Express 5** (`express@^5.2.1`), not Express 4. Some middleware patterns differ.
- `frontend/src/services/reportAPI copy.js` is a stale duplicate file.
- Backend route files mix naming conventions (e.g., `consumption.routes.js` vs `billingRoutes.js`). Follow the pattern of the file you're editing.
- CI runs on all branches (not just main). PRs to main trigger CI on both the PR branch and main.
- Node version: 22 (CI and expected locally).
