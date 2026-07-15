---
id: HRMS-UX-007
title: Enterprise HRMS Wave 0 Screen by Screen Design Backlog
document: 07-wave-0-screen-by-screen-design-backlog.md
version: 1.0
status: Draft
---

# 1. Purpose

This document expands `Wave 0 - Platform and Delivery Foundations` into a screen-by-screen design backlog that can be used by product, UX, UI, frontend engineering, QA, platform, and implementation teams.

# 2. Wave 0 Scope

Wave 0 covers:

- `E00` Foundation and Platform
- `E28` Administration
- `E29` Security and Governance
- `E30` DevOps and Operations
- `E31` Implementation and Migration

# 3. Backlog Model

Each screen backlog item includes:

- `Screen ID`
- `Epic`
- `Feature group`
- `Screen name`
- `Primary persona`
- `Screen type`
- `Priority`
- `Primary objective`
- `Key UX scope`
- `Dependencies`
- `Primary acceptance focus`

Priority scale:

- `P0` - mandatory before Wave 0 release completion
- `P1` - high-value and should land inside Wave 0
- `P2` - can follow after the Wave 0 core experience is stable

# 4. Design Workstream Sequence

Recommended Wave 0 design sequence:

1. Global shell and shared admin patterns
2. Platform core consoles
3. Administration and tenant controls
4. Security and resilience controls
5. Migration and go-live command center

# 5. Screen Backlog

## Workstream A - Global Platform Shell and Shared Admin Patterns

| Screen ID | Epic | Feature Group | Screen Name | Primary Persona | Type | Priority | Primary Objective | Key UX Scope | Dependencies | Primary Acceptance Focus |
|---|---|---|---|---|---|---|---|---|---|---|
| `W0-SCR-001` | `E00` | `FG-E00-01` | SaaS platform admin home dashboard | platform admin, platform ops admin, platform security admin | dashboard | `P0` | give provider-side platform operators a single command view of tenant operations, shared-service issues, security posture, and pending control-plane actions | cross-epic status cards, alerts, task queue, tenant health summary, provider-side operational signals | global shell, task model, alerts model | admin can see critical control-plane actions and system health within one landing page without mixing in customer HRMS transaction queues |
| `W0-SCR-002` | `E00` | `FG-E00-01` | Global search and command entry | platform admin, implementation lead | global utility | `P0` | let users quickly find configs, forms, fields, audits, tenants, and jobs | search categories, command shortcuts, permission-aware results | metadata framework, navigation model | search returns role-safe results with clear object grouping |
| `W0-SCR-003` | `E00` | `FG-E00-02` | Shared task and approvals inbox | admin, security reviewer, implementation lead | queue | `P0` | consolidate approvals, publish requests, reviews, and operational tasks | filterable queue, SLA and status badges, bulk-safe actions | workflow engine, notification engine | action owners can process tasks without losing context |

## Workstream B - Platform Core Consoles

| Screen ID | Epic | Feature Group | Screen Name | Primary Persona | Type | Priority | Primary Objective | Key UX Scope | Dependencies | Primary Acceptance Focus |
|---|---|---|---|---|---|---|---|---|---|---|
| `W0-SCR-004` | `E00` | `FG-E00-01` | Configuration catalog and scope console | platform admin, org admin | admin console | `P0` | manage configuration entries safely across provider and tenant scopes where authorized | searchable catalog, scope compare, impact preview, rollback entry | configuration framework | user can identify effective value, override lineage, and risk before changing config |
| `W0-SCR-005` | `E00` | `FG-E00-01` | Metadata explorer and dependency map | architect, platform admin | explorer | `P0` | inspect entities, fields, classifications, and downstream dependencies | entity tree, field panel, diff view, dependency visualization | metadata framework | metadata consumers can understand entity structure and impact without ambiguity |
| `W0-SCR-006` | `E00` | `FG-E00-02` | Workflow administration console | platform admin, ops lead | admin workbench | `P0` | configure and monitor workflow templates, routes, and queue health | workflow list, version control, stuck-item visibility, route preview | workflow engine | reviewer can trace current workflow state and edit safe future behavior |
| `W0-SCR-007` | `E00` | `FG-E00-02` | Notification template and channel console | platform admin, communications admin | admin console | `P1` | manage notification templates, channels, delivery policies, and retry visibility | template editor, preview, channel toggles, delivery diagnostics | notification engine, localization engine | users can preview channel-specific outputs and understand send constraints |
| `W0-SCR-008` | `E00` | `FG-E00-03` | Audit explorer and entity timeline | compliance admin, support lead, security reviewer | investigative workbench | `P0` | search and inspect auditable events across entities and actors | filters, diff view, event timeline, export request | audit engine, masking policy | investigators can reconstruct history with masked and unmasked logic applied correctly |
| `W0-SCR-009` | `E00` | `FG-E00-03` | Event bus and integration runtime monitor | platform ops, integration admin | monitor | `P1` | view throughput, failures, lag, retries, and dead-letter behavior | topic health, consumer lag, replay actions, failure drill-down | event bus, integration hub | operator can identify failing route and take replay action safely |
| `W0-SCR-010` | `E00` | `FG-E00-04` | Document template builder and generation monitor | HR admin, platform admin | builder plus monitor | `P1` | manage enterprise templates and track generation jobs | template canvas, merge preview, job queue, render errors | document generation engine, localization engine | template publisher can preview final output and detect unresolved placeholders |
| `W0-SCR-011` | `E00` | `FG-E00-04` | AI platform policy and evaluation console | AI admin, platform architect | admin console | `P2` | manage model policies, prompt versions, safety rules, and evaluations | prompt list, evaluation results, cost summary, violation alerts | AI platform | AI settings are understandable, governable, and traceable |
| `W0-SCR-012` | `E00` | `FG-E00-04` | Localization diagnostics and bundle runtime view | localization admin, platform admin | diagnostics console | `P1` | inspect bundle versions, fallback usage, and missing resources | locale matrix, fallback events, cache invalidation action, preview links | localization engine | localization owner can identify missing translation and runtime fallback risk quickly |

## Workstream C - Administration and Tenant Controls

| Screen ID | Epic | Feature Group | Screen Name | Primary Persona | Type | Priority | Primary Objective | Key UX Scope | Dependencies | Primary Acceptance Focus |
|---|---|---|---|---|---|---|---|---|---|---|
| `W0-SCR-013` | `E28` | `FG-E28-01` | Dynamic form designer | system admin, implementation consultant | builder | `P0` | create and publish configurable forms without engineering intervention | section layout, field binding, conditional logic, preview | dynamic forms, dynamic fields | designer can assemble valid forms with clear draft versus published state |
| `W0-SCR-014` | `E28` | `FG-E28-01` | Dynamic field catalog and field editor | platform admin, implementation consultant | admin console | `P0` | define custom fields and bind them safely to entities | field type config, validation, visibility, search flags | dynamic fields, metadata framework | admin understands which field changes are safe and which are breaking |
| `W0-SCR-015` | `E28` | `FG-E28-01` | Dynamic master console | platform admin, implementation consultant | admin console | `P1` | manage configurable reference data and hierarchies | list or tree mode, code management, usage preview, import | dynamic masters | master values can be updated with downstream impact visible |
| `W0-SCR-016` | `E28` | `FG-E28-02` | Localization bundle manager | localization admin | admin console | `P1` | manage localized labels, messages, and bundle publish flow | translation grid, completeness status, preview, publish state | localization admin data, localization engine | bundle owner can distinguish draft, missing, and publish-ready resources |
| `W0-SCR-017` | `E28` | `FG-E28-02` | System settings console | platform admin | settings console | `P0` | safely change feature flags, defaults, and runtime settings | scope compare, risk labels, change history, rollback entry | system settings, configuration framework | high-risk changes are obvious and guarded by approval flows |
| `W0-SCR-018` | `E28` | `FG-E28-02` | Organization admin dashboard | org admin, platform admin | dashboard plus profile | `P0` | let the top customer-owned admin manage organization profile, tenant-scoped enablement, branding, identity readiness, and quotas without exposing provider-only controls | organization summary, module toggles, identity status, branding, usage, lifecycle visibility | tenant management, system settings | org admin can understand tenant-owned health and setup actions without seeing provider-only control-plane functions |

## Workstream D - Security and Resilience Controls

| Screen ID | Epic | Feature Group | Screen Name | Primary Persona | Type | Priority | Primary Objective | Key UX Scope | Dependencies | Primary Acceptance Focus |
|---|---|---|---|---|---|---|---|---|---|---|
| `W0-SCR-019` | `E29` | `FG-E29-01` | Access governance dashboard | security admin, compliance officer | dashboard | `P0` | summarize access model health, review campaigns, SoD conflicts, and privileged risk | KPI cards, campaign status, risk alerts, review shortcuts | RBAC, ABAC, access reviews, segregation of duties | risk owners can understand access risk posture in one place |
| `W0-SCR-020` | `E29` | `FG-E29-01` | Role and policy matrix workspace | security admin | policy workspace | `P0` | manage role entitlements and policy-driven restrictions | role matrix, policy bindings, conflict warnings, compare mode | RBAC, ABAC | admin can edit safely without losing model clarity |
| `W0-SCR-021` | `E29` | `FG-E29-02` | Data masking policy console | security admin, privacy lead | admin console | `P1` | define masked fields, reveal rules, and export behavior | field classification, mask pattern preview, reveal workflow | data masking, metadata framework | sensitive exposure rules are easy to review and test before publish |
| `W0-SCR-022` | `E29` | `FG-E29-02` | Retention and legal-hold control center | governance admin, legal ops | operations console | `P1` | manage retention policies, legal holds, and purge readiness | policy inventory, hold list, job status, impacted record preview | data retention, audit engine | operators can distinguish archive, anonymize, purge, and hold outcomes clearly |
| `W0-SCR-023` | `E29` | `FG-E29-01` | Access review campaign workspace | security reviewer, manager reviewer | review workbench | `P1` | run access certification campaigns with evidence and remediation flow | review queue, risk cues, bulk low-risk action, revocation tracking | access reviews, task inbox | reviewers can certify or revoke access with sufficient context and low friction |
| `W0-SCR-024` | `E30` | `FG-E30-01` | Backup and restore operations dashboard | ops lead, platform admin | operations dashboard | `P0` | view backup health, verify artifacts, and launch restore workflows safely | backup status, artifact catalog, validation, restore request entry | backup, restore | operator can identify last known good recovery point and next action quickly |
| `W0-SCR-025` | `E30` | `FG-E30-01` | Disaster recovery readiness console | ops lead, platform architect, leadership | readiness dashboard | `P0` | assess DR posture, dependencies, test history, and failover readiness | service map, test evidence, RTO or RPO view, issue log | disaster recovery, backup, restore | DR state is understandable for both technical and executive audiences |

## Workstream E - Migration and Go-Live Command Center

| Screen ID | Epic | Feature Group | Screen Name | Primary Persona | Type | Priority | Primary Objective | Key UX Scope | Dependencies | Primary Acceptance Focus |
|---|---|---|---|---|---|---|---|---|---|---|
| `W0-SCR-026` | `E31` | `FG-E31-01` | Bulk import wizard and validation workbench | implementation consultant, HR data lead | wizard plus workbench | `P0` | upload, validate, correct, and commit enterprise data loads | template guidance, row errors, staged results, commit summary | bulk import | users can move from file upload to safe commit with row-level confidence |
| `W0-SCR-027` | `E31` | `FG-E31-01` | Migration mapping and reconciliation workspace | data migration lead, architect | workbench | `P0` | manage mapping logic, trial-load results, and reconciliation outcomes | source-target mapping, trial comparison, defect links, signoff panel | data migration, metadata framework | migration team can trace mismatches to source rule or target rule quickly |
| `W0-SCR-028` | `E31` | `FG-E31-02` | Validation command center | QA lead, business owner, implementation lead | readiness console | `P0` | track validation scenarios, evidence, blockers, and signoffs | checklist board, evidence panel, blocker view, signoff routing | validation, task inbox | teams can clearly see what still blocks go-live readiness |
| `W0-SCR-029` | `E31` | `FG-E31-02` | Cutover command center | program manager, implementation lead, ops lead | mission control dashboard | `P0` | coordinate freeze, final load, task sequencing, and checkpoint decisions | timeline, dependency graph, owner statuses, checkpoint approval | cutover, migration, validation | cutover teams can act on one synchronized source of truth under time pressure |
| `W0-SCR-030` | `E31` | `FG-E31-02` | Rollback runbook and trigger workspace | program lead, ops lead, executive approver | runbook workspace | `P1` | assess rollback triggers, execute steps, and track reconciliation | trigger matrix, irreversible-step warnings, step tracking, final status | rollback, cutover, restore | rollback decisions are explicit, auditable, and operationally clear |

# 6. Design Output Expectations By Screen

Each `P0` screen should produce:

- information architecture view
- wireframe-ready layout
- primary action map
- component mapping
- default, empty, error, permission, and success states
- desktop and tablet layouts
- mobile behavior decision, even if mobile is intentionally limited
- acceptance notes for engineering and QA

Each `P1` screen should produce:

- wireframe-ready layout
- state coverage
- component mapping
- responsive intent
- acceptance notes

Each `P2` screen should produce:

- structural screen definition
- navigation placement
- primary interaction model
- state list

# 7. Suggested Design Sprint Sequence

Recommended sequence for Wave 0 design execution:

1. `Sprint D0`
   `W0-SCR-001` to `W0-SCR-005`
2. `Sprint D1`
   `W0-SCR-006` to `W0-SCR-010`
3. `Sprint D2`
   `W0-SCR-013` to `W0-SCR-018`
4. `Sprint D3`
   `W0-SCR-019` to `W0-SCR-025`
5. `Sprint D4`
   `W0-SCR-026` to `W0-SCR-030`
6. `Sprint D5`
   Cross-screen polish, accessibility review, responsive review, and design QA handoff

# 8. Dependencies and Design Risks

Major dependencies:

- final navigation shell decisions
- approved admin component patterns
- data table and tree table behavior standards
- audit and permission visibility rules
- workflow and task status vocabulary

Major design risks:

- over-dense admin screens without action clarity
- inconsistent state language across platform and implementation consoles
- security-sensitive screens exposing too much context by default
- migration and cutover screens becoming too technical for business approvers

# 9. Handoff Outcome

This backlog should now be used as the planning source for:

- Wave 0 screen-level wireframes
- design story creation
- frontend route planning
- UX QA coverage
- release-readiness design reviews
