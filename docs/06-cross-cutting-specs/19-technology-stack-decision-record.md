---
id: HRMS-CC-19
title: Technology Stack Decision Record
document: 19-technology-stack-decision-record.md
version: 1.0
status: Accepted
---

# 1. Purpose

This document records the technology stack decisions for building the Staffsy Enterprise HRMS. It is the authoritative reference for implementation choices; changes require an updated version of this record with a stated reason.

# 2. Context

- The specification library defines service boundaries, OpenAPI-first contracts, Postgres-style RLS tenancy, event-driven module interactions, and an AI copilot layer.
- Delivery follows the wave model in `09-product-backlog/02-release-slicing-and-priority-waves.md`.
- Build strategy: desktop-first UI from the Staffsy template boards; mobile follows after desktop with dedicated mobile designs.
- Team profile: small full-stack team with AI-assisted development; one language end-to-end is a priority.

# 3. Decisions

| Layer | Decision | Rationale |
|---|---|---|
| Language | TypeScript end-to-end | One language across API, web, workers, and shared contract types |
| Backend framework | NestJS on Node.js 22+ | Module system maps 1:1 to documented service boundaries; first-class OpenAPI support |
| Database | PostgreSQL 16 | Appendix 29 assumes it: RLS tenant isolation, JSONB, TIMESTAMPTZ, partitioning |
| ORM / migrations | Prisma | Type-safe data layer, disciplined migration history |
| Frontend | React 18 + Vite + TypeScript | Template/component composition model matches the 24 Staffsy template boards |
| Styling | Tailwind CSS (v4) with Staffsy tokens | Board-specified tokens map directly to theme variables |
| UI primitives | shadcn/ui-style headless components restyled to Staffsy | Accessibility without design lock-in |
| Data fetching | TanStack Query + generated OpenAPI client | The authored contract is the frontend SDK |
| Tables / charts | TanStack Table + Recharts | Workbench and dashboard patterns across all boards |
| AuthN/AuthZ | Keycloak (OIDC) for identity; RBAC in-app, ABAC/SoD per doc 17 later | Per-tenant SSO/MFA demands a dedicated IdP; never hand-rolled |
| Queue / jobs | BullMQ + Redis | Payroll runs, imports, notifications, accruals per doc 09 |
| Object storage | S3-compatible (AWS S3 / MinIO) | Doc 13 file platform: signed URLs, scan hooks, tenant-prefixed keys |
| Search | Postgres full-text first; OpenSearch when needed | Doc 15 security-trimmed search can start on Postgres |
| AI | Claude API behind an in-app AI-gateway module | Doc 26/39: prompt versioning, policy checks, evaluation capture |
| Deployment | Docker Compose locally; single cluster (ECS/K8s) in cloud | Two deployables: API + worker |
| CI/CD | GitHub Actions | Repository already on GitHub |

# 4. Architecture Shape

- **Modular monolith, two deployables** (API, worker). NestJS modules mirror documented service boundaries (`org`, `people`, `leave`, `attendance`, `payroll`, `workflow`, `platform`), each owning its own Postgres schema. Microservice extraction stays possible; the distributed-systems tax is not paid up front.
- **Tenancy:** single database, `tenant_id` on every tenant-scoped row, Postgres RLS enforced per connection. Established in migration `#1`; never retrofitted.
- **Contract-first:** OpenAPI YAML is authored and versioned in-repo; it generates server validation and the typed frontend client. Appendix 28 completion rules are enforceable in CI.
- **Events:** in-process domain events first, using the appendix 25 envelope shape, so a later move to a broker changes transport, not payloads.

# 5. Rejected Alternatives

| Alternative | Reason Rejected |
|---|---|
| Microservices from day one | Small team; operational tax exceeds benefit before real scale |
| Java / Spring Boot | Viable equal; rejected only to keep one language end-to-end for current team profile |
| MongoDB / document store | Statutory payroll and effective-dated HR data are relational and audit-bound |
| Kafka at start | No event volume to justify it; BullMQ covers job semantics; envelopes stay broker-ready |
| Hand-rolled auth | Enterprise SSO/MFA/SAML federation is a solved, high-risk domain |

# 6. Known Stress Points and Planned Answers

- **CPU-bound payroll calculation in Node:** runs execute in the worker deployable, batched and parallelized; the calculation engine is isolated behind a queue interface so it can be rewritten in Go/Rust later without architectural change.
- **Single Postgres growth path:** read replicas → partitioning (audit, attendance, payroll results) → Citus/tenant sharding. Requires `tenant_id` discipline from day one, nothing else changes materially.

# 7. Revisit Triggers

This record must be revisited when any of the following occurs:

- A tenant exceeds ~25k employees or payroll runs breach their processing window
- Event fan-out needs exceed in-process + queue semantics (introduce broker)
- Search relevance/scale outgrows Postgres full-text (introduce OpenSearch)
- Team composition shifts decisively toward another ecosystem
