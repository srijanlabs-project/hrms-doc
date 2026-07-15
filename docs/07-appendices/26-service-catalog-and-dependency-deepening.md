---
id: HRMS-APP-26
title: Service Catalog and Dependency Deepening
document: 26-service-catalog-and-dependency-deepening.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix deepens the platform service topology into implementation-facing catalogs and matrices that engineering, architecture, DevOps, QA, support, and implementation teams can directly use during build planning and service decomposition.

# 2. Scope

This appendix covers:

- shared library ownership and compatibility expectations
- domain-service and shared-service catalog deepening
- sub-module to service ownership mapping
- synchronous versus asynchronous dependency patterns
- release and deployment standards by service type
- service data ownership and write-boundary rules

# 3. Shared Library Catalog Deepening

| Library | Primary Owner | Used By | Versioning Rule | Compatibility Rule | Rollout Rule |
|---|---|---|---|---|---|
| `common/prisma` | platform architecture | all write-owning services | semantic versioning | no breaking persistence helper changes without release note and migration guidance | update dependent services selectively, not platform-wide lockstep |
| `common/auth` | identity and access | all APIs and workers | semantic versioning | token claims and auth context contracts must be backward-compatible across active service versions | rollout with compatibility test against old and new tokens |
| `common/entitlements` | tenant and org core | tenant-aware business services | semantic versioning | contract must preserve entitlement evaluation shape | dependent services rebuild only when consumed feature changes |
| `common/errors` | platform architecture | all services | semantic versioning | error shape fields cannot break active clients inside same major version | update alongside contract and QA negative suites |
| `common/filters` | platform architecture | HTTP services | semantic versioning | transport behavior must remain compatible with standard error payload schema | deploy service-by-service after regression checks |

Library rules:

- shared libraries may not contain hidden network calls
- every library must publish compatibility notes for the previous supported version
- deprecations should include target removal release wave

# 4. Shared Platform Service Catalog

| Service | Core Scope | Primary APIs or Interfaces | Primary Data Owned | Scaling Focus | Failure Isolation Rule |
|---|---|---|---|---|---|
| `Workflow and Approval Service` | task routing, approvals, delegation, escalations | task APIs, workflow definition APIs, callback events | workflow definitions, instances, tasks, decisions, delegations | task throughput and SLA timers | workflow backlog must not block payroll or notifications directly |
| `Notification Service` | channel dispatch, retries, templates, preferences | send API, template APIs, provider callbacks | templates, dispatches, attempts, preferences | outbound fan-out and provider latency | provider outage should not cascade into business write failure without explicit policy |
| `Audit Service` | evidence capture, search, export, retention, legal hold | event ingestion API, search API, evidence export API | audit events, export packages, integrity records | append-only ingest and investigation search | audit read latency must not block source transactions beyond defined critical-control rules |
| `Configuration Service` | effective-value resolution, publish, rollback, cache invalidation | definitions API, effective-value API, publish APIs | config definitions, values, versions, publish batches | high-cache-read performance | config outage posture must be risk-aware and key-aware |
| `Document Generation Service` | merge, render, output lifecycle | template APIs, generate APIs, batch job triggers | templates, generation jobs, merge snapshots, output metadata | render concurrency and batch throughput | template or render failures must not corrupt repository metadata |
| `File Service` | upload, scan, signed retrieval, metadata, retention handoff | upload API, signed URL API, scan callbacks | file metadata, scan results, access grants | large-file IO and scan orchestration | scan backlog should quarantine files rather than expose unverified content |
| `Search Service` | indexing, security trimming, query relevance | index events, search API, reindex controls | search documents, index state, relevance config | query latency and reindex throughput | search degradation must not affect source-of-truth transactions |
| `Number Series Service` | business identifier generation and reservation | reserve API, preview API, release or cancel API | series definitions, counters, reservations, issued values | contention on popular sequences | sequence contention must not create duplicate business keys |
| `AI or Copilot Service` | model routing, prompt policy, evaluation, response governance | inference API, policy APIs, evaluation APIs | prompt versions, policy records, evaluation runs | inference latency and policy enforcement | AI outage must degrade gracefully without blocking mandatory workflows unless explicitly required |
| `Integration Hub Service` | connector runtime, mapping, sync, replay, webhook delivery | connector APIs, run APIs, inbound adapters, outbound dispatch | connectors, contract versions, runs, messages, dead letters | external dependency throughput and recovery | connector failure should be bounded to affected interface and queue |
| `Job Orchestration Service` | schedules, durable jobs, retries, worker leases, DLQ | enqueue APIs, run APIs, replay APIs, queue health | job definitions, schedules, runs, attempts, dead letters | queue depth and worker throughput | low-priority job saturation must not starve critical workloads |

# 5. Domain Service Catalog and Sub-Module Placement

| Service | Primary Parent Modules | Key Deep Sub-Modules or Capabilities |
|---|---|---|
| `Tenant and Org Core Service` | Foundation and Platform, Organization Management, Administration | tenant management, legal entity, business unit, department, location, work calendar, tenant settings |
| `People Core Service` | People Management, ESS, MSS | employee master, personal information, employment information, national identity, bank accounts, probation, exit, employee documents |
| `Recruitment Service` | Recruitment and ATS | requisitions, screening, interview scheduling, offer management, candidate records |
| `Workforce Time Service` | Workforce Management | biometric integration, shift management, rostering, attendance processing, timesheets |
| `Leave Service` | Leave Management | leave policies, leave accrual, leave approval, encashment, holiday interaction |
| `Payroll Service` | Payroll, Statutory Compliance | payroll processing, validations, statutory outputs, banking outputs, arrears and adjustments |
| `Performance and Talent Service` | Performance Management, Talent Management | goal management, review cycles, calibration, succession, talent pools |
| `Learning Service` | Learning and Development | catalog, assignments, learning paths, certifications |
| `Rewards and Claims Service` | Compensation and Benefits, Expense Management, Travel Management | salary revision, benefits administration, claims, reimbursements, travel expense lifecycle |
| `Case and Experience Service` | Employee Experience, Helpdesk and Case Management, Communication Platform | surveys, cases, announcements, employee queries, communication campaigns |
| `Asset and Workplace Service` | Asset Management, Visitor and Workplace Management, Health Safety and Wellness | asset assignment, workplace allocation, visitor management, safety evidence handling |
| `Analytics Delivery Service` | Analytics and BI | dashboard serving, governed reports, extracts, KPI APIs |

# 6. Service-to-Submodule Dependency Matrix

| Sub-Module or Capability | Primary Owner | Sync Dependencies | Async Dependencies |
|---|---|---|---|
| employee master | People Core Service | Tenant and Org Core, Configuration | Workflow, Notification, Audit, Search, Integration Hub |
| leave approval | Leave Service | Workflow, People Core | Notification, Audit, Payroll, Calendar projections |
| payroll processing | Payroll Service | People Core, Leave Service, Workforce Time | Job Orchestration, Document Generation, Audit, Integration Hub |
| document repository | File Service plus document domain | Configuration, Audit, Identity and Access | Search, Integration Hub, retention jobs |
| digital signatures | document domain plus Integration Hub | File Service, Workflow, Configuration | Audit, Notification, Job Orchestration |
| audit explorer | Audit Service | Identity and Access, Configuration | Job Orchestration for exports |
| webhook subscriptions | Integration Hub Service | Configuration, Identity and Access | Job Orchestration, Audit |
| search results | Search Service | Identity and Access, Configuration | event-fed projections from source services |
| number series issuance | Number Series Service | Configuration, Tenant and Org Core | Audit, event notification if required |
| delegated approvals | Workflow and Approval Service | Identity and Access, Configuration | Audit, Notification |

# 7. Interaction Pattern Rules

## 7.1 Preferred Sync Use Cases

Use synchronous APIs for:

- immediate validation
- entitlement and permission checks
- small reference-data lookups
- task completion and status refresh
- signed retrieval-token generation

## 7.2 Preferred Async Use Cases

Use asynchronous events or jobs for:

- notifications
- search indexing
- analytics projections
- large document generation
- outbound integrations
- bulk imports
- payroll batches

## 7.3 Cross-Service Rule

- no service may synchronously chain more than two downstream business services in a user-critical path without explicit architecture approval

# 8. Deployment and Release Standards

## 8.1 Pipeline Expectations

Every deployable service should have:

- independent build pipeline
- unit and integration test gates
- contract test stage for APIs or events
- migration stage for owned schema
- health-check and smoke-test stage
- rollback or forward-fix runbook

## 8.2 Release Compatibility Rules

- service APIs must remain backward-compatible within active client release window
- event changes require versioned rollout and consumer compatibility checks
- library upgrades with breaking changes require coordinated dependent-service release plan
- schema changes must follow expand then migrate then contract pattern where rolling deploys are expected

## 8.3 Environment Promotion Rules

- provider-plane shared services should not promote untested runtime contract changes directly to production
- production promotion for workflow, config, audit, integration, and number series changes should include explicit regression evidence

# 9. Failure Isolation Standards

| Service Type | Isolation Expectation |
|---|---|
| shared platform service | failure should degrade dependent behaviors predictably and observably, not corrupt domain data |
| domain service | failure should be bounded to its owned business area and its pending async side effects |
| managed infrastructure dependency | retry and circuit-breaker posture should be defined at consuming shared service layer |

Examples:

- search outage should not block employee master update
- notification outage should not prevent leave request creation unless mandatory compliance communication is part of the transaction
- integration connector failure should not block unrelated connectors

# 10. Data Ownership and Write Boundaries

## 10.1 Write Rules

- each canonical table family has one write owner
- shared platform services own their own operational tables
- source domain services emit facts; shared services store derived operational control records for their own runtimes

## 10.2 Read Rules

- UI list views may use read models or search projections
- analytics should use governed extracts or marts
- direct cross-service write-schema joins are prohibited as a target-state pattern

## 10.3 Migration Rule

- if a monolithic or shared schema exists initially, ownership must still be modeled explicitly so migration to stronger service boundaries is feasible later

# 11. Operational Ownership Matrix

| Concern | Primary Owner | Secondary Stakeholders |
|---|---|---|
| shared library compatibility | platform architecture | all service teams |
| service deployment health | owning service team | platform ops, SRE |
| contract test governance | architecture plus QA automation | owning service team |
| schema migration approval | owning service team | DBA or platform architecture |
| tenant-impacting incident response | owning service team | support, security, customer operations |

# 12. Immediate Follow-On Use

This appendix should now drive:

- service-by-service OpenAPI expansion
- service-owned DDL packs
- CI/CD standards and release checklists
- support routing and incident ownership maps
