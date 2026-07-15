---
id: HRMS-APP-07
title: Entity Ownership and Module Reference Matrix
document: 07-entity-ownership-and-module-reference-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a populated cross-module entity ownership matrix for the Enterprise HRMS platform. It is intended to be used by solution architects, backend engineers, data engineers, integration teams, QA, and implementation teams as a direct build-reference layer.

# 2. Scope Note

This is `v1` of the implementation-facing entity matrix. It prioritizes:

- platform and tenant foundation entities
- workforce and organization master entities
- high-risk transactional entities
- cross-module workflow, audit, document, and integration entities

It should be extended over time into a fuller enterprise canonical data register.

# 3. Entity Ownership Matrix

| Entity Ref | Canonical Entity | Primary Owning Module | System of Record | Key Upstream Inputs | Key Downstream Consumers | Sensitivity Class | Engineering Notes |
|---|---|---|---|---|---|---|---|
| `ENT-001` | `tenant` | Foundation and Platform / Tenant Management | platform core | provider provisioning workflow | org admin, auth, config, audit, billing, integrations | Confidential | every business record must carry `tenant_id` lineage |
| `ENT-002` | `legal_entity` | Organization Management | org structure service | implementation setup, org admin maintenance | people, payroll, recruitment, compliance, documents | Confidential | effective-dated and cannot orphan workers |
| `ENT-003` | `business_unit` | Organization Management | org structure service | implementation setup, org admin maintenance | workforce analytics, approvals, reporting | Internal | hierarchical entity with tenant scope |
| `ENT-004` | `department` | Organization Management | org structure service | org maintenance, migration | people, requisitions, analytics, approvals | Internal | supports parent-child hierarchy |
| `ENT-005` | `location` | Organization Management | org structure service | implementation setup, geo master data | attendance, payroll, travel, safety, compliance | Internal | may carry country and timezone dependencies |
| `ENT-006` | `person` | People Management | people core | onboarding, migration, integration | employee, contractor, documents, identity, travel | Restricted | canonical human identity anchor across worker types |
| `ENT-007` | `employee_master` | People Management | people core | onboarding, HR operations, migration | payroll, leave, performance, learning, assets, analytics | Restricted | customer-side source of truth for employee lifecycle |
| `ENT-008` | `employment_assignment` | People Management | people core | employee action workflows | payroll, org reporting, manager hierarchy, compliance | Restricted | effective-dated employment context per worker |
| `ENT-009` | `reporting_assignment` | Organization Management | org structure plus people core | manager mapping, transfers | approvals, manager dashboard, talent, analytics | Confidential | supports primary and matrix reporting |
| `ENT-010` | `contractor_master` | Contractor and External Workforce | external workforce core | vendor onboarding, sponsor request, migration | access, compliance training, assets, site readiness | Restricted | must remain distinct from employee record while sharing person lineage where applicable |
| `ENT-011` | `requisition` | Recruitment and ATS | talent acquisition core | manpower planning, budget approval | candidate pipeline, offers, onboarding, analytics | Confidential | links to org, role, cost center, headcount plan |
| `ENT-012` | `candidate` | Recruitment and ATS | talent acquisition core | career portal, recruiter import, referral | interview, offer, onboarding, analytics | Restricted | privacy retention and consent rules apply |
| `ENT-013` | `leave_request` | Leave Management | time and leave service | employee submission, manager action | balances, payroll, team calendar, notifications | Confidential | approval and balance consumption must stay consistent |
| `ENT-014` | `attendance_record` | Workforce Management | time service | biometric devices, self-service, integrations | payroll, manager dashboards, compliance | Confidential | high-volume transactional entity with correction flow |
| `ENT-015` | `payroll_run` | Payroll | payroll core | period calendar, pay inputs, validation | payroll results, statutory outputs, GL integration | Restricted | immutable once finalized except governed reopen flow |
| `ENT-016` | `payroll_result` | Payroll | payroll core | payroll run processing | payslips, accounting, compliance, analytics | Restricted | versioned by payroll run and recalculation context |
| `ENT-017` | `performance_cycle` | Performance Management | performance core | HR planning, configuration | goals, reviews, compensation, talent review | Confidential | cycle metadata should remain immutable after launch except governed edits |
| `ENT-018` | `learning_assignment` | Learning and Development | learning core | compliance training rules, manager nomination | learner views, completion events, compliance | Confidential | worker eligibility may depend on role, location, or contractor status |
| `ENT-019` | `asset_assignment` | Asset Management | asset service | onboarding, transfers, contractor access, exit | return flow, finance, support, audit | Confidential | links people, contractors, devices, and status history |
| `ENT-020` | `case_record` | Helpdesk and Case Management | case service | employee or HR request intake | SLA, escalations, audit, analytics | Confidential | generalized service case entity with subtype taxonomy |
| `ENT-021` | `document_record` | Document Management | document repository | uploads, template generation, integrations | signatures, employee profile, compliance, audit | Restricted | storage metadata separate from binary object lifecycle |
| `ENT-022` | `workflow_instance` | Foundation and Platform / Workflow Engine | workflow engine | module business actions | tasks, notifications, audit, escalations | Internal | shared engine object, not a business domain record |
| `ENT-023` | `workflow_task` | Foundation and Platform / Workflow Engine | workflow engine | workflow routing | inbox, approvals, reminders, dashboards | Internal | actor, SLA, delegation, and decision history required |
| `ENT-024` | `notification_dispatch` | Foundation and Platform / Notification Framework | notification engine | workflow, events, scheduler, business actions | user channels, delivery metrics, audit | Internal | channel-specific status must be retained |
| `ENT-025` | `audit_event` | Security and Governance / Audit | audit engine | all high-risk writes and privileged reads | audit explorer, investigations, compliance exports | Restricted | immutable append-only event store |
| `ENT-026` | `integration_contract` | Integration Platform | integration hub | connector design, API governance | sync jobs, webhooks, ERP integration, support | Internal | versioned and linked to owning source domain |
| `ENT-027` | `event_definition` | Foundation and Platform / Event Bus | event bus | event governance, schema publication | producers, consumers, monitoring, replay | Internal | schema and version lifecycle must be governed centrally |
| `ENT-028` | `config_entry` | Administration / Configuration Framework | config service | provider admin, org admin, release management | runtime feature flags, workflows, integrations, UI | Internal | scope-aware by platform, tenant, country, legal entity, or user segment |

# 4. Engineering Usage Rules

- do not create duplicate systems of record for any entity above without explicit architecture approval
- module-specific tables may extend these entities, but should not replace the canonical ownership listed here
- API design, event design, and screen permissions should reference these entity IDs where applicable
- cross-module joins should prefer canonical identifiers rather than name-based matching

# 5. Immediate Follow-On Use

This matrix should now be used as the reference anchor for:

- API registry ownership fields
- event producer-consumer mappings
- field dictionary population
- integration mapping specifications
- analytics model lineage
