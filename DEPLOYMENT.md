# Free-tier deployment guide (no paid APIs required)

## Stack

| Layer | Suggestion | Free tier |
|-------|------------|-----------|
| Frontend | [Vercel](https://vercel.com) | Hobby |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) | Free web service |
| Database | [PlanetScale](https://planetscale.com) (MySQL) or Railway MySQL | Limited free |

> XAMPP MySQL is for **local dev only**. Production needs a hosted MySQL URL.

## Backend (Render example)

1. Push repo to GitHub.
2. New **Web Service** → connect repo → root: `backend`.
3. Build: `npm install`
4. Start: `npm start`
5. Environment variables (minimum):

```env
NODE_ENV=production
PORT=5000
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=ai_career_launchpad
JWT_SECRET=...
REFRESH_TOKEN_SECRET=...
FRONTEND_URLS=https://your-frontend.vercel.app
DEV_BYPASS_AUTH=false
```

6. Run `db/init.sql` against hosted MySQL once (via client or migration job).

## Frontend (Vercel)

1. Import repo → root: `frontend`.
2. Build: `npm run build`
3. Output: `dist`
4. Environment:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Do **not** set `VITE_DEV_LOGIN_*` in production.

## Post-deploy checks

- `GET https://your-backend/api/health`
- Register + full login (no dev bypass)
- `cd backend && API_URL=https://your-backend/api npm run test` (optional)

## Paid APIs (optional later)

- `OPENROUTER_API_KEY` — smarter chatbot
- `RAPIDAPI_KEY` + `RAPIDAPI_HOST` — live job search

The app works without them using fallbacks.
