# GeoSaaS — Containerized Mapping Application

A production-grade SaaS application that reads geospatial data from a PostgreSQL database, renders it on an interactive map, and allows authenticated users to browse, add, edit, and delete records.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  React 18 + Leaflet + Tailwind + shadcn/ui         │
└─────────────┬───────────────────────────────────────┘
              │ HTTP/JSON (JWT)
┌─────────────▼───────────────────────────────────────┐
│           ASP.NET Core 8 Web API                    │
│  Auth (Identity + JWT)  ·  Locations CRUD           │
└─────────────┬───────────────────────────────────────┘
              │ EF Core 8
┌─────────────▼───────────────────────────────────────┐
│        PostgreSQL 16 + PostGIS                      │
│  Users  ·  Locations  ·  Seed Data                 │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 8 |
| UI Library | shadcn/ui + Tailwind CSS v4 |
| Map | React-Leaflet (OSM dark tiles) |
| State | Zustand + TanStack Query v5 |
| Backend | .NET 8 — ASP.NET Core Web API |
| ORM | Entity Framework Core 8 |
| Database | PostgreSQL 16 + PostGIS |
| Auth | ASP.NET Core Identity + JWT |
| Containers | Docker + Docker Compose |

## Local Setup

### Prerequisites
- Docker Desktop
- Node 20+ (for frontend dev only)

### 1. Clone & configure

```bash
git clone <repo-url>
cd geosaas
cp .env.example .env
# Edit .env — set JWT_SECRET and optionally VITE_MAPBOX_TOKEN
```

### 2. Run with Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

### 3. Demo credentials

```
Email:    demo@geosaas.io
Password: Password1!
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
npm run lint    # ESLint
npm run build   # Production build
```

## Project Structure

```
/
├── docker-compose.yml
├── .env.example
├── backend/
│   └── GeoSaaS.Api/
│       ├── Controllers/
│       ├── Models/
│       ├── DTOs/
│       ├── Services/
│       ├── Data/
│       └── Dockerfile
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/          # shadcn/ui primitives
    │   │   ├── auth/        # ProtectedRoute
    │   │   ├── layout/      # Navbar
    │   │   ├── map/         # MapView, LocationPanel, LocationForm
    │   │   └── sidebar/     # LocationList
    │   ├── hooks/           # useAuth, useLocations, useToast
    │   ├── lib/             # api.ts (Axios), utils.ts
    │   ├── pages/           # Landing, Login, Register, Map
    │   └── store/           # authStore, locationStore (Zustand)
    ├── Dockerfile
    └── nginx.conf
```

## Screens

| Route | Description |
|---|---|
| `/` | Landing page with hero, features, testimonials |
| `/login` | Email + password login with remember-me |
| `/register` | Registration form |
| `/map` | Full-screen map with collapsible sidebar |
| `/map?id={uuid}` | Deep-link opens location detail panel |

## API Endpoints

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

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | DB user |
| `POSTGRES_PASSWORD` | DB password |
| `JWT_SECRET` | 32+ char secret for JWT signing |
| `VITE_API_BASE_URL` | Backend URL (default: `http://localhost:5000`) |
| `VITE_MAPBOX_TOKEN` | Optional — leave blank for free OSM tiles |
