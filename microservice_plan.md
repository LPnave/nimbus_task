# Microservices Migration Plan

## Current Monolith Boundaries

The existing API already has natural internal seams:

```
GeoSaaS.Api/
├── AuthController      → identity, JWT, refresh tokens
├── LocationsController → CRUD, bbox pagination
└── ClustersController  → geohash aggregation, Redis cache
```

These are the three candidate services.

---

## Proposed Service Split

### 1. Identity Service
**Owns:** Users, passwords, JWT issuance, refresh tokens, ASP.NET Core Identity, `RefreshTokens` table

**Exposes:**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

**Dependencies:** PostgreSQL (users schema), Redis (optional token blocklist)

**Isolation benefit:** Auth logic changes (adding OAuth, MFA, SSO) don't require redeploying the geo stack.

---

### 2. Location Service
**Owns:** `Locations` table, CRUD operations, bbox filtering, pagination

**Exposes:**
- `GET /locations` (with bbox + category filters)
- `GET /locations/{id}`
- `POST /locations`
- `PUT /locations/{id}`
- `DELETE /locations/{id}`

**Dependencies:** PostgreSQL (locations schema), publishes events on create/update/delete

---

### 3. Cluster Service
**Owns:** Read-only geohash aggregation queries, Redis cache

**Exposes:**
- `GET /locations/clusters`

**Dependencies:** PostgreSQL (read replica ideally), Redis

**Key point:** This service is **purely read** and the most performance-sensitive one. Isolating it means you can scale it independently during high-traffic map usage without scaling the write-heavy Location Service.

---

### 4. Tile Service *(already partially there)*
The nginx config already proxies `/api/tiles/` separately. This is a natural fourth service — a read-only MVT vector tile generator sitting directly on a PostGIS read replica.

---

## What Needs to Change

### Authentication / Authorization
Currently the API uses `[Authorize]` with a shared `JWT_SECRET` baked into `Program.cs`. In microservices:
- Every service that needs auth must **validate the JWT** using the same public key
- Switch from HS256 (symmetric secret) to **RS256 (asymmetric keypair)** — the Identity Service holds the private key, all other services only need the public key to verify tokens
- Or introduce an **API Gateway** (Kong, YARP, AWS API Gateway) that handles JWT validation centrally before forwarding to downstream services

### Database
The biggest decision. Currently one `AppDbContext` owns everything. Options:

| Strategy | Tradeoff |
|---|---|
| **Shared database** (short term) | Easiest migration, but services are still coupled at DB level |
| **Schema-per-service** | `auth` schema + `geo` schema in same Postgres instance — logical separation, operationally simple |
| **Database-per-service** | True isolation, independent scaling, but requires eventual consistency + distributed queries |

For this app, **schema-per-service on a single PostGIS instance** is the pragmatic starting point.

### Inter-service Communication
The Cluster Service needs to read location data. Since it queries PostGIS directly with raw SQL, it can simply point at the same DB (or a read replica) — no synchronous service-to-service calls needed. This is an advantage of the current design.

If you add features that need cross-service data (e.g. "show locations created by this user"), you'd choose between:
- **Synchronous REST/gRPC calls** between services
- **Event-driven** (publish `LocationCreated` to a message bus like Kafka/RabbitMQ, Identity Service subscribes to cache user metadata)

### Infrastructure Changes

```
Current:                          Microservices:
docker-compose (5 services)  →   API Gateway (YARP/Kong)
                                  ├── identity-service
                                  ├── location-service
                                  ├── cluster-service
                                  └── tile-service

                                  Shared: PostgreSQL, Redis
                                  Optional: Message bus, service mesh
```

---

## Honest Assessment

| Factor | Current Monolith | Microservices |
|---|---|---|
| Operational complexity | Low | High |
| Independent deployability | No | Yes |
| Independent scaling | No | Yes (cluster/tile service) |
| Team size suitability | 1–3 devs | 3+ teams |
| Latency | None (in-process) | Network hops between services |
| Distributed tracing needed | No | Yes (OpenTelemetry) |
| Data consistency | Trivial (single DB tx) | Complex (eventual consistency) |

**The cluster service is the strongest microservices candidate right now** — it's already stateless, read-only, and independently cacheable. The auth and location services could stay merged longer without causing real pain.

---

## Recommended Migration Path

1. **Extract Cluster + Tile as a single read service first** — stateless, read-only, no write coupling, already isolated behind nginx
2. **Add an API Gateway** (YARP is native .NET, low overhead) to route traffic and centralise JWT validation
3. **Switch JWT signing from HS256 → RS256** so downstream services verify tokens without sharing the secret
4. **Split Location and Identity** only when team size or deployment cadence demands it
5. **Introduce a message bus** (RabbitMQ or Kafka) only if cross-service data needs become unavoidable
