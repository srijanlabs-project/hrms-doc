---
id: HRMS-APP-30
title: Service Governance Release and Ownership Pack
document: 30-service-governance-release-and-ownership-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the remaining service-governance depth work by defining exhaustive ownership rules, release workflow, service SLO tiers, library-release policy, and feature-level dependency governance.

# 2. Exhaustive Ownership Rule

Ownership rule:

- every sub-module inherits its parent module's primary service unless explicitly reassigned below
- shared platform capabilities remain outside parent domain ownership where their runtime is centrally governed

# 3. Parent Module to Primary Service Ownership

| Parent Module | Primary Owner |
|---|---|
| Foundation and Platform | shared platform services plus tenant and org core |
| Organization Management | Tenant and Org Core Service |
| People Management | People Core Service |
| Identity and Access | identity and access plus workflow support |
| Employee Self Service | People Core Service with shared service dependencies |
| Manager Self Service | People Core plus Workflow |
| Recruitment and ATS | Recruitment Service |
| Workforce Management | Workforce Time Service |
| Leave Management | Leave Service |
| Payroll | Payroll Service |
| Statutory and Compliance | Payroll Service plus Security and Governance where relevant |
| Performance Management | Performance and Talent Service |
| Learning and Development | Learning Service |
| Compensation and Benefits | Rewards and Claims Service |
| Talent Management | Performance and Talent Service |
| Employee Experience | Case and Experience Service |
| Travel Management | Rewards and Claims Service |
| Expense Management | Rewards and Claims Service |
| Asset Management | Asset and Workplace Service |
| Helpdesk and Case Management | Case and Experience Service |
| Contractor and External Workforce | People Core plus external workforce domain branch |
| Visitor and Workplace Management | Asset and Workplace Service |
| Health Safety and Wellness | Asset and Workplace Service plus governance integrations |
| Communication Platform | Case and Experience Service plus Notification Service |
| Document Management | File Service plus Document Generation Service plus domain-specific policy owner |
| Analytics and BI | Analytics Delivery Service |
| AI and Copilot | AI or Copilot Service |
| Integration Platform | Integration Hub Service |
| Administration | Tenant and Org Core plus Configuration Service |
| Security and Governance | Audit Service plus identity and governance domains |
| DevOps and Operations | platform ops plus Job Orchestration, Config, Audit |
| Implementation and Migration | implementation tooling plus Job Orchestration |
| Testing and Quality | QA tooling domain plus Audit and Job Orchestration |

# 4. Explicit Shared-Service Reassignments

Shared-service ownership overrides parent-domain ownership for:

- approvals, delegation, escalations, inbox tasks
- notifications and communication dispatch
- audit capture and evidence export
- queue, replay, and schedules
- file upload and signed retrieval
- template rendering
- configuration resolution
- connector runtime
- search indexing
- number issuance

# 5. Shared Library Release Workflow

Every shared library release must include:

- owner approval
- compatibility statement
- changed consumers list
- regression checklist
- rollback path

# 6. Service SLO Tiers

| Tier | Applies To | Availability Expectation | Recovery Expectation |
|---|---|---|---|
| `Tier 0` | payroll, workflow, auth-critical services | highest | fastest restoration, no silent degradation |
| `Tier 1` | people core, integration hub, file, audit, config | high | controlled degradation allowed |
| `Tier 2` | search, analytics, AI, non-critical ops | important but degradable | restore without blocking core transactions |

# 7. Deployment Governance Checklist

Every production release should answer:

- is the API or event contract backward-compatible
- is migration expand-safe
- are downstream consumers known
- is rollback or forward-fix path documented
- are observability thresholds defined
- does support know new failure modes

# 8. Feature-Level Dependency Rule

Every feature group should identify:

- primary service owner
- synchronous dependencies
- asynchronous dependencies
- shared service calls
- data ownership boundary
- operator or support owner

# 9. Migration Sequencing Rule

When splitting a shared schema into service ownership:

1. declare owner
2. block new cross-service writes
3. create service-local API
4. move reads to API or projection
5. isolate schema or database boundary

