---
id: HRMS-APP-09
title: Event Producer Consumer Matrix
document: 09-event-producer-consumer-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a populated event producer-consumer matrix so engineering teams can trace event ownership, downstream impact, replay sensitivity, and audit expectations across modules.

# 2. Scope Note

This `v1` matrix focuses on events that drive the highest cross-module dependency:

- tenant lifecycle
- employee lifecycle
- contractor lifecycle
- requisition and offer flow
- leave, payroll, and document flow
- workflow, audit, and support governance

# 3. Event Matrix

| Event Ref | Event Name | Primary Producer | Primary Consumers | Business Trigger | Replay Sensitivity | Audit Requirement | Notes |
|---|---|---|---|---|---|---|---|
| `EVT-001` | `tenant.created` | tenant management | identity setup, configuration baseline, audit, implementation tooling | provider creates tenant | Medium | High | downstream consumers must not duplicate baseline provisioning |
| `EVT-002` | `tenant.activated` | tenant management | org admin onboarding, integrations, notifications, analytics | tenant moves to active | Medium | High | activation should be once-per-tenant-state transition |
| `EVT-003` | `tenant.suspended` | tenant management | auth, integrations, support, audit | tenant suspended | High | High | replay must not re-trigger duplicate shutdown actions without idempotency |
| `EVT-004` | `employee.created` | people core | workflow, documents, analytics, audit | employee master created | Medium | High | initial onboarding chain often starts here |
| `EVT-005` | `employee.confirmed` | people core | payroll, documents, analytics | probation confirmation | Low | High | often triggers compensation or letter generation |
| `EVT-006` | `employee.transferred` | people core | org reporting, payroll, access reviews, analytics | transfer action completed | Medium | High | effective-date handling is critical |
| `EVT-007` | `employee.exit-initiated` | people core | workflow, payroll, assets, access, documents | exit flow begins | High | High | major cross-module offboarding orchestrator |
| `EVT-008` | `employee.offboarded` | people core | analytics, audit, document retention, integrations | exit completed | High | High | terminal business transition with downstream closure actions |
| `EVT-009` | `contractor.created` | external workforce core | compliance, access, documents, analytics | contractor record created | Medium | High | links vendor and sponsor context |
| `EVT-010` | `contractor.activated` | external workforce core | access, learning, assets, site readiness | contractor becomes active | High | High | must not bypass prerequisite validations |
| `EVT-011` | `contractor.suspended` | external workforce core | access, site control, assets, notifications | contractor suspended | High | High | may trigger emergency revocation chains |
| `EVT-012` | `requisition.submitted` | recruitment core | workflow, notifications, audit | requisition enters approval flow | Low | High | used by hiring approvals and analytics |
| `EVT-013` | `requisition.approved` | recruitment core | recruiting ops, sourcing, analytics | requisition approved | Medium | High | downstream job-post creation may be async |
| `EVT-014` | `offer.accepted` | recruitment core | onboarding, documents, analytics | candidate accepts offer | Medium | High | onboarding start event |
| `EVT-015` | `leave.request-submitted` | leave service | workflow, manager inbox, notifications, audit | employee submits leave | Low | High | manager and balance visibility consume this |
| `EVT-016` | `leave.request-approved` | leave service | balances, payroll, team calendar, notifications | leave approved | Medium | High | payroll and attendance side effects must be idempotent |
| `EVT-017` | `attendance.corrected` | time service | payroll, audit, manager views | attendance adjustment posted | Medium | High | recalculation scope must be traceable |
| `EVT-018` | `payroll.run-validated` | payroll core | payroll dashboard, notifications, audit | validation completes | Low | High | exception counts and summaries usually derived |
| `EVT-019` | `payroll.run-finalized` | payroll core | payslips, finance integration, compliance, analytics | payroll finalized | High | High | replay must not regenerate statutory or payment outputs blindly |
| `EVT-020` | `document.generated` | document engine | employee profile, case management, audit | document render succeeds | Low | Medium | storage and metadata sync consumers |
| `EVT-021` | `document.signed` | signature service | documents, workflow, audit, case management | signature completed | Medium | High | legal evidence chain must be preserved |
| `EVT-022` | `workflow.task-created` | workflow engine | inbox, notifications, dashboards | workflow routes a task | Low | Medium | high-volume shared event |
| `EVT-023` | `workflow.task-completed` | workflow engine | business module callback handlers, audit, analytics | task decision captured | Medium | High | state callback order matters |
| `EVT-024` | `notification.dispatch-failed` | notification engine | ops dashboard, retry scheduler, audit | channel delivery failed | Low | Medium | operational event for visibility and retries |
| `EVT-025` | `event-bus.dead-letter.created` | event bus | platform ops, support, audit | event delivery permanently failed | Medium | High | replay control depends on root-cause resolution |
| `EVT-026` | `integration.contract.publish` | integration hub | sync runtime, audit, implementation tooling | connector contract version published | Low | High | version lineage required |
| `EVT-027` | `support.session-started` | support access control | audit, privacy monitoring, org visibility, SIEM | provider support enters tenant context | Medium | High | one of the highest-risk SaaS operational events |
| `EVT-028` | `support.session-ended` | support access control | audit, privacy monitoring, org visibility, SIEM | support session closes | Low | High | session closure evidence required |

# 4. Engineering Rules

- each event must have one primary producer even if multiple modules can originate similar business outcomes
- event payloads must carry tenant, entity, actor, timestamp, and correlation identifiers
- consumers must be idempotent and replay-safe where the replay sensitivity is `Medium` or `High`
- high-audit events must be queryable from the audit explorer and correlatable to APIs or workflow actions

# 5. Immediate Follow-On Use

Use this matrix to drive:

- event schema design
- consumer contract testing
- replay and dead-letter runbooks
- analytics lineage
- incident-response playbooks
