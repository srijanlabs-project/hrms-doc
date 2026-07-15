---
id: HRMS-XCUT-08
title: Service Topology and Deployment Architecture
document: 08-service-topology-and-deployment-architecture.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the target service topology, deployment philosophy, and ownership boundaries for the Enterprise HRMS platform.

It exists to answer four architecture-critical questions:

- which capabilities are shared code libraries rather than network services
- which capabilities are independently deployable runtime services
- which services own which data and contracts
- when one service can be built and deployed without shipping the full platform

# 2. Architecture Stance

The target architecture should be `hybrid service-oriented`, not `everything is a microservice`.

The platform should distinguish clearly between:

- `shared libraries`
  reusable code packages compiled into multiple services
- `domain services`
  deployable business services that own a bounded functional area
- `shared platform services`
  deployable cross-domain runtime capabilities used by many domain services
- `managed infrastructure`
  externally operated or platform-operated infrastructure such as object storage, queue brokers, search clusters, and email providers

This avoids two common mistakes:

- turning internal code helpers into unnecessary network services
- keeping every business module tightly coupled inside one giant deployment unit

# 3. Decision Principles

- business ownership must align to service ownership
- write ownership for core data should be explicit and singular
- cross-service interaction should prefer events for decoupling where strict synchronous consistency is not required
- high-scale, high-risk, or high-reuse capabilities should become dedicated deployable services
- low-complexity shared code should remain libraries rather than distributed services
- one service should be deployable independently only when its contracts are backward-compatible and its runtime dependencies remain stable

# 4. Runtime Classification Model

| Runtime Type | Definition | Independently Deployed | Typical Examples |
|---|---|---|---|
| `Shared library` | compiled package reused by services | No | auth helpers, tenant context, error models |
| `Domain service` | business capability with owned write model | Yes | people core, recruitment, leave, payroll |
| `Shared platform service` | reusable runtime capability serving many domains | Yes | workflow, notification, audit, configuration |
| `Managed infrastructure` | platform or vendor runtime used by services | Not as application deployment unit | Kafka, Redis, S3 or R2, OpenSearch, SMTP gateway |

# 5. Shared Library Catalog

The following items should be treated as `shared libraries`, not standalone deployable services.

| Library | Responsibility | Why It Should Remain a Library |
|---|---|---|
| `common/prisma` | DB access helpers, tenant-scoping helpers such as `withTenant`, transaction wrapper, RLS context utilities | it is an internal persistence adapter, not a business capability |
| `common/auth` | JWT validation, role guard, current-user extraction, service identity support | low-latency internal authorization helper best reused as code |
| `common/entitlements` | module subscription and entitlement checks | policy helper reused across services, not a separate business workflow |
| `common/errors` | standardized error shapes and code model | shared contract package, not runtime capability |
| `common/filters` | global exception handling and transport-level response shaping | transport and framework concern rather than business service |

Library rules:

- libraries may be versioned independently
- changing a shared library may require rebuilding only the dependent services, not the full platform
- shared libraries must not hide network calls or cross-service business side effects unexpectedly

# 6. Recommended Deployable Service Catalog

## 6.1 Domain Services

These should be independently deployable domain-aligned services.

| Service | Primary Responsibility | Major Modules Primarily Served |
|---|---|---|
| `Tenant and Org Core Service` | tenant profile, org structures, legal entities, locations, defaults | foundation, organization management, administration |
| `People Core Service` | employee master, personal data, employment data, lifecycle actions | people management, ESS, MSS, onboarding, exit |
| `Recruitment Service` | requisitions, candidates, screening, interviews, offers | recruitment and ATS |
| `Workforce Time Service` | attendance, punches, shifts, rosters, regularization | workforce management |
| `Leave Service` | leave policies, balances, requests, approvals, accruals | leave management |
| `Payroll Service` | payroll inputs, validation, runs, outputs, statutory dependencies | payroll, statutory compliance |
| `Performance and Talent Service` | goals, reviews, calibration, succession, talent workflows | performance management, talent management |
| `Learning Service` | catalog, assignments, certifications, completion tracking | learning and development |
| `Rewards and Claims Service` | compensation cycles, benefits, travel, expense, reimbursement flows | compensation and benefits, travel, expense |
| `Case and Experience Service` | helpdesk, communication cases, employee engagement workflows | employee experience, helpdesk and case management |
| `Asset and Workplace Service` | assets, visitor, workplace and supportable operational allocations | asset management, visitor and workplace management |
| `Analytics Delivery Service` | curated reporting APIs, dashboard serving, governed extracts | analytics and BI |

## 6.2 Shared Platform Services

These should be deployable shared services because multiple domains depend on them at runtime.

| Service | Responsibility | Notes |
|---|---|---|
| `Notification Service` | central dispatch for email, SMS, push, WhatsApp, template rendering, delivery tracking | common runtime, not per-module implementation |
| `Workflow and Approval Service` | generic multi-step approval routing, tasking, escalation, delegation, SLA clocks | shared across leave, payroll, bank changes, offers, exits, and admin flows |
| `Audit Service` | centralized append-only action audit, evidence lookup, export-safe retrieval | should be callable from all services |
| `Configuration Service` | scope-aware configuration resolution, publish, rollback, precedence handling | provider default to tenant override to scoped override model |
| `Document Generation Service` | template rendering, merge, PDF generation, versioned outputs | shared for offers, letters, payslips, certificates, notices |
| `File Service` | upload, retrieval, malware scanning, MIME validation, signed URLs, metadata tracking | should front object storage |
| `Search Service` | cross-entity search API with tenant-safe security trimming | should index from events, not direct DB scraping by UI |
| `Number Series Service` | tenant-scoped sequential business identifiers and reservation rules | employee code, requisition number, case number, etc. |
| `AI or Copilot Service` | centralized gateway for LLM access, prompt policies, model routing, safety enforcement | avoids model sprawl across modules |
| `Integration Hub Service` | outbound webhooks, inbound connectors, external credentials, contract lifecycle, replay | shared enterprise integration layer |
| `Job Orchestration Service` | durable background jobs, retries, schedules, DLQ, batch coordination | replaces scattered inline cron behavior |

## 6.3 Special Classification Notes

The following deserve explicit treatment:

| Capability | Recommended Classification | Why |
|---|---|---|
| `Event bus transport` | managed infrastructure plus thin governance layer | the broker itself is infrastructure; schema governance and replay controls may be an app service |
| `Localization` | start inside configuration or metadata service, split later if scale demands | usually not worth a separate service on day 1 unless translation operations are large |
| `Object storage` | managed infrastructure behind File Service | bucket or object store should not be treated as direct business API for product teams |

# 7. Independent Build and Deployment Rules

Yes, it should be possible to build and deploy only one service instead of the full application, but only for `deployable services`, not for shared libraries.

Independent deployment is allowed when:

- the service owns its deployable artifact
- its API and event contracts are backward-compatible
- required shared library versions are already published and compatible
- database changes are isolated to the service-owned schema or migration scope
- dependent consumers do not require lockstep deployment
- monitoring, rollback, and release validation exist for that service

Independent deployment is not truly achieved when:

- multiple services share undocumented write access to the same tables
- cross-service synchronous calls are tightly chained with no compatibility strategy
- a common package change forces all services to redeploy together every time
- event schemas change in a breaking way without versioned rollout

# 8. Module to Service Dependency Baseline

| Functional Area | Primary Owning Service | Common Shared Service Dependencies |
|---|---|---|
| tenant setup and org structure | Tenant and Org Core Service | Configuration, Audit, Workflow, Number Series |
| employee master and lifecycle | People Core Service | Workflow, Notification, Audit, File, Search, Number Series, Integration Hub |
| recruitment | Recruitment Service | Workflow, Notification, Audit, Document Generation, Search, Number Series, Integration Hub |
| attendance and shifts | Workforce Time Service | Workflow, Notification, Audit, Job Orchestration, Integration Hub |
| leave | Leave Service | Workflow, Notification, Audit, Job Orchestration, Integration Hub |
| payroll | Payroll Service | Workflow, Notification, Audit, Document Generation, File, Job Orchestration, Integration Hub |
| performance and talent | Performance and Talent Service | Workflow, Notification, Audit, Search, AI or Copilot |
| learning | Learning Service | Workflow, Notification, Audit, File, Integration Hub |
| expenses and reimbursements | Rewards and Claims Service | Workflow, Notification, Audit, File, Job Orchestration, Integration Hub |
| helpdesk and employee experience | Case and Experience Service | Workflow, Notification, Audit, Search, AI or Copilot |
| platform administration | Tenant and Org Core Service plus Configuration Service | Audit, Workflow, Search, Integration Hub |

# 9. Data Ownership and Database Boundary Rules

## 9.1 Write Ownership

Every business record should have one primary write-owning service.

Examples:

- employee master writes belong to `People Core Service`
- leave balance and request writes belong to `Leave Service`
- payroll run and result writes belong to `Payroll Service`
- notification instance writes belong to `Notification Service`
- workflow task writes belong to `Workflow and Approval Service`

No secondary service should mutate another service's operational tables directly.

## 9.2 Recommended Boundary Model

Recommended phased approach:

| Phase | Database Boundary Approach | Why |
|---|---|---|
| `Phase 1` | service-owned schemas in a shared cluster where needed | faster start without losing ownership clarity |
| `Phase 2` | database-per-service for high-scale or highly regulated services | stronger isolation and release independence |
| `Phase 3` | read models, search projections, analytics marts, and event-fed replicas | supports cross-service reads without violating write ownership |

## 9.3 Cross-Service Reads

Cross-service data access should prefer:

- synchronous API reads for real-time small-scope lookups
- event-fed projections for list views, reporting, and search
- analytical replicas or warehouse pipelines for BI and dashboard workloads

Cross-service direct table joins should be avoided as a long-term pattern.

## 9.4 Tenant and Security Rules

- tenant scope must be enforced at service boundary and persistence boundary
- global identifiers must never bypass tenant authorization
- soft-delete, audit, and masking rules must remain consistent even if services use separate storage
- privileged support access must remain explicit and auditable across service boundaries

# 10. Service Interaction Rules

Preferred interaction model:

- `sync API`
  use for command validation, low-latency reference checks, and immediate user actions
- `async events`
  use for downstream side effects, notifications, analytics feeds, integration propagation, and non-blocking updates
- `jobs`
  use for retries, scheduled tasks, long-running batch processes, and high-volume imports

Rules:

- do not call another domain service synchronously for every downstream side effect
- do not make UI flows depend on long synchronous chains across many services
- every async consumer must be idempotent
- every high-risk command must carry idempotency or optimistic version control

# 11. Release and Deployment Guidance

Each deployable service should have:

- its own CI pipeline
- its own test suite gates
- its own versioning
- its own migration strategy
- its own health checks and dashboards
- its own rollback or forward-fix policy

Shared library changes should trigger rebuilds only for dependent services, not a forced full-platform deployment.

# 12. Immediate Architecture Decisions

The platform should adopt these baseline decisions now:

1. `common/prisma`, `common/auth`, `common/entitlements`, `common/errors`, and `common/filters` are shared libraries.
2. Workflow, Notification, Audit, Configuration, File, Document Generation, Search, Job Orchestration, AI or Copilot, and Integration Hub are candidate shared deployable services.
3. Business capabilities should be grouped into bounded domain services rather than one service per screen or one service per tiny module.
4. Independent service deployment is a target capability and should be designed into contracts, migrations, and observability from the beginning.

# 13. Follow-On Work

This document should be followed immediately by:

- OpenAPI-ready contract breakdown by service
- database ownership and ERD by service
- service-to-service event contract catalog
- service dependency matrix at module and sub-module level
- deployment pipeline and release governance standards
