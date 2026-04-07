# GeoSaaS — Enterprise Geospatial Data Platform

A production-grade SaaS application that reads geospatial data from a PostGIS database, renders it on an interactive WebGL map, and allows authenticated users to browse, add, edit, and delete location records. The architecture is designed to handle **up to 20 million location points** without degradation in map responsiveness through a multi-layer rendering and caching strategy.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│  React 19 · MapLibre GL (WebGL) · TanStack Query · Zustand      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTP/JSON (JWT Bearer)
┌───────────────────────────▼──────────────────────────────────────┐
│                        Nginx (Alpine)                            │
│  Reverse proxy · Vector tile cache (1 h, 1 GB on-disk)          │
└───────────────────────────┬──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                  ASP.NET Core 8 Web API                          │
│  Auth (Identity + JWT) · Locations CRUD · Cluster service        │
└──────────┬────────────────────────────────────┬──────────────────┘
           │ EF Core 8                          │ IDistributedCache
┌──────────▼──────────────┐         ┌───────────▼──────────────────┐
│  PostgreSQL 16 + PostGIS│         │  Redis 7 (Alpine)            │
│  GIST spatial index     │         │  Cluster result cache (5 min)│
│  Geohash aggregation    │         │  Instance prefix: geosaas:   │
└─────────────────────────┘         └──────────────────────────────┘
```

---

## How It Handles 20 Million Location Points

The system uses a **three-tier rendering strategy** driven by the current map zoom level, ensuring the database never returns millions of raw rows to the browser.

### Tier 1 — Server-Side Geohash Clustering (zoom < 14)

At low zoom levels (world view through city view), the frontend calls the `/api/locations/clusters` endpoint instead of fetching raw points. The `ClusterService` executes a raw PostGIS SQL query that:

1. Converts each row's `(Longitude, Latitude)` pair into a **PostGIS geometry** using `ST_SetSRID(ST_Point(...), 4326)`
2. Generates a **geohash** for that geometry with `ST_GeoHash()`
3. **Truncates the hash to a zoom-adaptive prefix length** — fewer characters at low zoom produces larger grid cells, aggregating more points per cluster
4. Groups by the prefix, returning `COUNT(*)`, `AVG(lat)`, `AVG(lng)`, and the cell key

**Geohash precision mapping:**

| Zoom level | Precision | Approx. cell size |
|---|---|---|
| ≤ 4 | 2 chars | ~2,500 km |
| ≤ 7 | 3 chars | ~156 km |
| ≤ 10 | 4 chars | ~20 km |
| ≤ 13 | 5 chars | ~2.4 km |
| ≥ 14 | — | Individual points rendered |

This means that regardless of how many rows are in the database, a world-view query returns only a few hundred cluster bubbles.

### Tier 2 — GIST Spatial Index

All clustering and bounding-box queries are accelerated by a **PostGIS GIST index** created by the `AddSpatialIndex` migration:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE INDEX IF NOT EXISTS locations_spatial_idx
ON "Locations"
USING GIST (ST_SetSRID(ST_Point("Longitude", "Latitude"), 4326));
```

The GIST index enables the database to evaluate both the geohash clustering SQL and the bbox `WHERE` clause using spatial index lookups rather than full-table scans — critical for 20M+ rows.

### Tier 3 — Viewport-Bounded Point Loading (zoom ≥ 14)

When the user zooms in past level 14, the map switches from clusters to individual location markers. The frontend sends the current map viewport as a bounding box (`minLat`, `maxLat`, `minLng`, `maxLng`), and the API returns **only the points visible on screen** — capped at **500 per request**. Non-viewport queries (sidebar, fallback) are capped at **200**.

### Redis Cluster Cache

Cluster query results are cached in **Redis** for **5 minutes** using a composite cache key that encodes the zoom level, geohash precision, and bounding box (rounded to 2 decimal places):

```
clusters:z{zoom}:p{precision}:{minLat:F2}:{maxLat:F2}:{minLng:F2}:{maxLng:F2}
```

Repeated pan/zoom interactions within the same region are served from memory in microseconds, eliminating redundant PostGIS aggregation queries.

### Nginx Vector Tile Cache

The Nginx reverse proxy caches responses from the `/api/tiles/` endpoint (MVT vector tiles) on disk for **1 hour**, with a maximum cache size of **1 GB**. Stale entries are served during backend timeouts using `proxy_cache_use_stale`. Cache status is exposed via the `X-Cache-Status` response header (`HIT`/`MISS`).

### Frontend Rendering with MapLibre GL

The map renderer uses **MapLibre GL** (WebGL-based), which renders all geometry on the GPU as GeoJSON layers. The rendering pipeline has three modes that switch automatically by zoom:

| Mode | Zoom | Data source | Max features rendered |
|---|---|---|---|
| Vector tile fallback | < 14, no clusters yet | `/api/tiles/{z}/{x}/{y}.mvt` | GPU-accelerated tiles |
| GeoJSON cluster bubbles | < 14, clusters loaded | Redis-cached cluster API | ~few hundred circles |
| GeoJSON point markers | ≥ 14 | Viewport bbox API | 500 per viewport |

TanStack Query stale times are tuned to the rendering tier:
- Viewport point queries: **30 second** stale time
- Cluster queries: **60 second** stale time (slower-changing aggregates)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + TypeScript + Vite | React 19, Vite 8 |
| Map renderer | MapLibre GL + react-map-gl | maplibre-gl 5, react-map-gl 8 |
| Animations | Framer Motion | 12 |
| UI components | Radix UI primitives + shadcn/ui pattern | — |
| Styling | Tailwind CSS v4 | 4 |
| Forms | React Hook Form + Zod | 7 / 4 |
| Data fetching | TanStack Query | v5 |
| State management | Zustand | v5 |
| HTTP client | Axios | 1 |
| Virtualisation | TanStack Virtual | v3 |
| Backend | ASP.NET Core Web API | .NET 8 |
| ORM | Entity Framework Core | 8 |
| Database | PostgreSQL 16 + PostGIS 3.4 | — |
| Spatial index | GIST on `ST_Point(lng, lat)` | PostGIS |
| Cluster engine | PostGIS `ST_GeoHash` aggregation | — |
| Auth | ASP.NET Core Identity + JWT | — |
| Password hashing | BCrypt | — |
| Distributed cache | Redis (StackExchange.Redis) | Redis 7 |
| Reverse proxy | Nginx (Alpine) | — |
| Structured logging | Serilog (compact JSON) | — |
| Containers | Docker + Docker Compose | — |

---

## Local Setup

### Prerequisites

- Docker Desktop
- Node 20+ (frontend development only)

### 1. Clone & configure

```bash
git clone <repo-url>
cd nimbus
cp .env.example .env
# Edit .env — set a strong JWT_SECRET (32+ characters)
```

### 2. Run with Docker Compose

```bash
docker compose up --build
```

All five services start with health-checked dependencies:

| Service | URL | Notes |
|---|---|---|
| Frontend | http://localhost:3000 | React SPA (Nginx) |
| API | http://localhost:5000 | ASP.NET Core |
| API docs | http://localhost:5000/scalar | Scalar UI (dev only) |
| Nginx proxy | http://localhost:8080 | Tile cache + reverse proxy |
| Database | localhost:5432 | PostgreSQL + PostGIS |
| Redis | localhost:6379 | Cluster result cache |

On first start the API will automatically:
1. Run pending EF Core migrations (with a 10-retry boot loop until the DB is healthy)
2. Seed **200 locations** across 7 categories and 30+ cities worldwide

### 3. Demo credentials

```
Email:    demo@geosaas.io
Password: Password1!
```

---

## Frontend Development

```bash
cd frontend
npm install
npm run dev     # Vite dev server → http://localhost:5173
npm run lint    # ESLint
npm run build   # tsc + Vite production build
```

---

## Project Structure

```
/
├── docker-compose.yml
├── .env.example
├── nginx/
│   └── nginx.conf              # Reverse proxy + vector tile cache
├── backend/
│   └── GeoSaaS.Api/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── LocationsController.cs   # CRUD + bbox pagination
│       │   └── ClustersController.cs    # Geohash cluster endpoint
│       ├── Services/
│       │   ├── LocationService.cs       # EF Core queries + bbox filter
│       │   ├── ClusterService.cs        # Raw PostGIS SQL + Redis cache
│       │   └── AuthService.cs           # JWT issuance + refresh tokens
│       ├── Models/
│       │   ├── Location.cs
│       │   ├── ApplicationUser.cs
│       │   └── RefreshToken.cs
│       ├── DTOs/
│       │   ├── ApiResponse.cs           # Envelope + PagedMeta
│       │   ├── Locations/
│       │   │   ├── LocationRequest.cs
│       │   │   ├── LocationResponse.cs
│       │   │   └── ClusterResponse.cs
│       │   └── Auth/
│       │       ├── LoginRequest.cs
│       │       ├── RegisterRequest.cs
│       │       └── AuthResponse.cs
│       ├── Data/
│       │   ├── AppDbContext.cs
│       │   └── SeedData.cs              # 200 global locations
│       ├── Migrations/
│       │   ├── 20260406164932_InitialCreate.cs
│       │   └── 20260407000001_AddSpatialIndex.cs  # GIST index + PostGIS ext
│       ├── Middleware/
│       │   └── ErrorHandlingMiddleware.cs
│       ├── Program.cs                   # DI, JWT, Redis, CORS, Serilog
│       └── Dockerfile
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/              # Radix UI / shadcn-style primitives
    │   │   ├── auth/            # ProtectedRoute
    │   │   ├── layout/          # Navbar
    │   │   ├── map/             # MapView, LocationPanel, LocationForm
    │   │   └── sidebar/         # LocationList (TanStack Virtual)
    │   ├── hooks/
    │   │   ├── useLocations.ts  # useLocations, useViewportLocations, useClusters
    │   │   └── useAuth.ts
    │   ├── lib/
    │   │   ├── api.ts           # Axios instance + interceptors
    │   │   └── utils.ts
    │   ├── pages/
    │   │   ├── Landing.tsx      # Framer Motion animated landing
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── Map.tsx          # Full-screen map shell
    │   └── store/
    │       ├── authStore.ts     # Zustand auth state
    │       └── locationStore.ts # Selected location + sidebar + filter
    ├── Dockerfile
    └── nginx.conf               # SPA fallback (try_files)
```

---

## API Reference

### Auth

```
POST   /api/auth/register        Register a new user
POST   /api/auth/login           Obtain access + refresh tokens
POST   /api/auth/refresh         Rotate access token using refresh token
POST   /api/auth/logout          Revoke refresh token
```

All subsequent requests require `Authorization: Bearer <access_token>`.

### Locations

```
GET    /api/locations
       ?page=1
       &pageSize=50            (max 200 without bbox, max 500 with bbox)
       &category=Parks
       &minLat=&maxLat=&minLng=&maxLng=    (viewport bbox filter)

GET    /api/locations/{id}
POST   /api/locations
PUT    /api/locations/{id}
DELETE /api/locations/{id}
```

**Response envelope:**
```json
{
  "data": [ ... ],
  "error": null,
  "meta": { "page": 1, "pageSize": 50, "total": 200 }
}
```

### Clusters

```
GET    /api/locations/clusters
       ?minLat=&maxLat=&minLng=&maxLng=   (required bbox)
       &zoom=5                             (drives geohash precision)
```

**Response:**
```json
{
  "data": [
    { "lat": 51.5, "lng": -0.09, "count": 1842, "cell": "gc" },
    ...
  ]
}
```

### Health

```
GET    /health                   Returns { "status": "healthy", "timestamp": "..." }
```

---

## Screens & Routes

| Route | Description |
|---|---|
| `/` | Animated landing page (hero, features, testimonials, CTA) |
| `/login` | Email + password login with remember-me |
| `/register` | Registration form with password strength rules |
| `/map` | Full-screen WebGL map with collapsible sidebar |
| `/map?id={uuid}` | Deep-link — opens location detail panel and flies to marker |

---

## Environment Variables

Copy `.env.example` and set values before running.

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_DB` | `geosaas` | PostgreSQL database name |
| `POSTGRES_USER` | `geosaas` | PostgreSQL user |
| `POSTGRES_PASSWORD` | `changeme` | PostgreSQL password — **change in production** |
| `JWT_SECRET` | *(required)* | HS256 signing key — minimum 32 characters |
| `JWT_EXPIRES_MINUTES` | `60` | Access token lifetime in minutes |
| `VITE_API_BASE_URL` | `http://localhost:5000` | Backend URL seen by the browser |

Redis and internal service URLs are wired through Docker Compose service names (`redis:6379`, `db:5432`) and do not require manual configuration for local development.

---

## Seed Data

The application seeds **200 locations** on first boot, spread across **7 categories** and **30+ cities** on 6 continents:

| Category | Count | Example cities |
|---|---|---|
| Coffee Shops | 28 | London, Oslo, Melbourne, Seoul, São Paulo |
| Parks | 29 | Vancouver, Amsterdam, Cape Town, Bangkok |
| Offices | 29 | San Francisco, Dubai, Bengaluru, Stockholm |
| Restaurants | 29 | Copenhagen, Lima, Osaka, San Sebastián |
| Hotels | 29 | Venice, Tokyo, Rio de Janeiro, Abu Dhabi |
| Landmarks | 29 | Athens, Agra, Siem Reap, Kraków |
| Transit | 27 | Heathrow, Changi, Grand Central, CSMT Mumbai |

To reset and re-seed:
```bash
# 1. Clear existing rows
echo 'DELETE FROM "Locations";' | docker exec -i nimbus-db-1 psql -U geosaas -d geosaas

# 2. Restart the API to trigger the seeder
docker compose restart api
```
