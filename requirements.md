# GeoSaaS — Containerized Mapping Application
## Requirements Document

---

## 1. Overview

A containerized SaaS application that reads geospatial data from a PostgreSQL database, renders it on an interactive map, and allows authenticated users to browse and interact with that data. The stack is .NET (backend API) + React (frontend) with a polished, production-grade UI.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI Library | shadcn/ui + Tailwind CSS |
| Map | Mapbox GL JS or Leaflet + React-Leaflet |
| Backend | .NET 8 — ASP.NET Core Web API |
| ORM | Entity Framework Core 8 |
| Database | PostgreSQL 16 + PostGIS extension |
| Auth | ASP.NET Core Identity + JWT (access + refresh tokens) |
| Containerisation | Docker + Docker Compose |
| API Docs | Swagger / OpenAPI |

---

## 3. Functional Requirements

### 3.1 Authentication

- **FR-AUTH-01** — Users can register with email + password.
- **FR-AUTH-02** — Users can log in and receive a JWT access token and a refresh token stored in an `httpOnly` cookie.
- **FR-AUTH-03** — Protected routes redirect unauthenticated users to `/login`.
- **FR-AUTH-04** — Users can log out; tokens are invalidated server-side.
- **FR-AUTH-05** — Passwords are hashed with BCrypt; plaintext passwords are never stored or logged.

### 3.2 Map & Data

- **FR-MAP-01** — On login, the user lands on a full-screen interactive map.
- **FR-MAP-02** — The map fetches geospatial records from the API and renders them as markers or clustered pins.
- **FR-MAP-03** — Clicking a marker opens a detail popover/panel showing record metadata.
- **FR-MAP-04** — A sidebar lists all records; selecting one flies the map to that location.
- **FR-MAP-05** — Records can be filtered by category/tag via a filter panel.
- **FR-MAP-06** — Users can add a new record by clicking on the map to set coordinates, then filling in a form.
- **FR-MAP-07** — Users can edit or delete their own records.

### 3.3 Data Model (seed data included)

```
Location {
  id           UUID (PK)
  name         VARCHAR(255)
  description  TEXT
  category     VARCHAR(100)
  latitude     DOUBLE PRECISION
  longitude    DOUBLE PRECISION
  created_by   UUID (FK → Users)
  created_at   TIMESTAMPTZ
  updated_at   TIMESTAMPTZ
}
```

---

## 4. Non-Functional Requirements

- **NFR-01 Performance** — Map renders ≤ 500 markers without perceptible lag; API list endpoints paginated (default page size 50).
- **NFR-02 Security** — All API routes (except `/auth/*`) require a valid JWT. CORS restricted to the frontend origin. No secrets committed to Git.
- **NFR-03 Reliability** — Docker Compose health checks on both the API and DB containers; API retries DB connection on startup.
- **NFR-04 Code Quality** — ESLint + Prettier on the frontend; .NET code follows standard C# conventions with nullable reference types enabled.
- **NFR-05 Observability** — Structured JSON logging via Serilog on the backend; console logging in development mode on the frontend.

---

## 5. UI / UX Requirements

### 5.1 Design System

- Use **shadcn/ui** components throughout (Button, Dialog, Card, Input, Select, Badge, Separator, Sheet, etc.).
- Tailwind CSS for all custom styling — no inline styles.
- Dark / light mode toggle persisted to `localStorage`.
- Responsive layout — usable on tablet and desktop (mobile is a nice-to-have).

### 5.2 Loading States

Every async operation must display a skeleton or spinner:

| Component | Loading Treatment |
|---|---|
| Sidebar location list | `<Skeleton>` rows matching final card height |
| Map markers | Spinner overlay until first data fetch resolves |
| Location detail panel | Skeleton for name, description, and metadata fields |
| Auth forms | Button shows spinner + disabled state while submitting |
| Any data mutation | Optimistic UI update or button loading state |

### 5.3 Error States

- API errors surface as shadcn `<Toast>` notifications (top-right).
- Empty states use an illustrated empty-state component with a CTA.
- Form validation errors appear inline beneath each field.

### 5.4 Key Screens

```
/login          — Email + password form, link to /register
/register       — Registration form
/map            — Full-screen map, collapsible sidebar, top nav bar
/map?id={uuid}  — Deep-link that opens the detail panel for a record
```

---

## 6. API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/locations?page=1&pageSize=50&category=
GET    /api/locations/{id}
POST   /api/locations
PUT    /api/locations/{id}
DELETE /api/locations/{id}
```

All responses follow a consistent envelope:

```json
{
  "data": { ... },
  "error": null,
  "meta": { "page": 1, "total": 120 }
}
```

---

## 7. Project Structure

```
/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── GeoSaaS.Api/          # ASP.NET Core Web API project
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── DTOs/
│   │   ├── Services/
│   │   ├── Data/             # EF Core DbContext + Migrations
│   │   └── Dockerfile
│   └── GeoSaaS.sln
└── frontend/
    ├── src/
    │   ├── components/       # shadcn/ui + custom components
    │   │   ├── ui/           # shadcn primitives
    │   │   ├── map/
    │   │   ├── sidebar/
    │   │   └── auth/
    │   ├── hooks/            # useLocations, useAuth, etc.
    │   ├── lib/              # API client (fetch wrapper), utils
    │   ├── pages/
    │   └── store/            # Zustand or React Context state
    ├── public/
    ├── Dockerfile
    └── vite.config.ts
```

---

## 8. Docker Compose Services

```yaml
services:
  db:
    image: postgis/postgis:16-3.4
    environment: [POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck: pg_isready

  api:
    build: ./backend
    depends_on: [db]
    environment: [ConnectionStrings__Default, JWT_SECRET, ASPNETCORE_ENVIRONMENT]
    ports: ["5000:8080"]

  frontend:
    build: ./frontend
    depends_on: [api]
    ports: ["3000:80"]
```

A single `docker compose up --build` should seed the database and serve both apps.

---

## 9. Environment Variables

```
# .env.example
POSTGRES_DB=geosaas
POSTGRES_USER=geosaas
POSTGRES_PASSWORD=changeme

JWT_SECRET=replace_with_32+_char_secret
JWT_EXPIRES_MINUTES=60

VITE_API_BASE_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token   # or leave blank to use Leaflet/OSM
```

---

## 10. Seed Data

The API project includes an `EF Core` migration seeder that populates:

- 2 demo user accounts (`demo@geosaas.io` / `Password1!`)
- 30+ sample locations spread across multiple categories (e.g. Coffee Shops, Parks, Offices) with realistic lat/lng coordinates.

---

## 11. Bonus — Live Deployment

| Target | Approach |
|---|---|
| Frontend | Vercel or Netlify (static build) |
| Backend + DB | Railway, Render, or Fly.io (Docker deploy) |
| CI/CD | GitHub Actions: lint → build → docker push → deploy on merge to `main` |

A `fly.toml` or `railway.json` config should be committed alongside a deployment guide in `DEPLOY.md`.

---

## 12. Acceptance Criteria

- [ ] `git clone` → `docker compose up --build` → app is accessible at `localhost:3000`.
- [ ] New user can register, log in, and see the seeded map data.
- [ ] Markers render on the map; clicking one shows a detail panel.
- [ ] A user can add, edit, and delete their own locations.
- [ ] All loading states use skeleton loaders — no raw spinners on content areas.
- [ ] No secrets are hardcoded; `.env.example` documents every required variable.
- [ ] README includes architecture diagram and local setup instructions.