# Intervue AI

AI Interview Simulator & Career Coach built as a small full-stack project:

- `frontend` — Next.js, TypeScript, Tailwind CSS, TanStack Query
- `backend` — Go, Gin, PostgreSQL, Redis
- `infra/postgres` — database bootstrap migrations

## Quick start

### Frontend only

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

### Full stack with Docker

```powershell
Copy-Item .env.example .env
docker compose up --build
```

The web app runs at `http://localhost:3000` and the API at
`http://localhost:8080`.

If either port is already in use:

```powershell
$env:API_HOST_PORT="18080"
$env:WEB_HOST_PORT="13000"
$env:NEXT_PUBLIC_API_URL="http://localhost:18080/api/v1"
docker compose up --build
```

## MVP API

- `GET /healthz`
- `GET /readyz`
- `GET /api/v1/dashboard`
- `POST /api/v1/resumes/analyze`
- `POST /api/v1/interviews`
- `GET /api/v1/interviews/:id`
- `POST /api/v1/interviews/:id/answers`

The backend supports Gemini through the AI provider interface and can fall back
to a deterministic mock provider for local development.
