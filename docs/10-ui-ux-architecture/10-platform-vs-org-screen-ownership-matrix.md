---
id: HRMS-UX-010
title: Enterprise HRMS Platform Versus Organization Screen Ownership Matrix
document: 10-platform-vs-org-screen-ownership-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This document separates the Enterprise HRMS screen backlog into `Platform side` and `Org side` ownership so UX, product, engineering, QA, and implementation teams can prepare the correct screens for the correct operating plane.

# 2. Ownership Rules

Use these rules before preparing any screen:

- `Platform side`
  Provider-operated SaaS control-plane screens
- `Org side`
  Customer-operated tenant-plane screens
- `Shared but scope-aware`
  Screens that may exist in both planes or expose multiple scopes, but must behave differently depending on role and authorization

Business transaction screens such as leave, requisitions, travel, payroll operations, and employee services are never provider-side home screens. They belong to customer-side personas.

# 3. Platform-Side Screens To Prepare

These screens belong to the SaaS provider control plane.

| Screen ID or Ref | Screen Name | Primary Users | Why It Is Platform Side | Current UX Status |
|---|---|---|---|---|
| `W0-SCR-001` | SaaS platform admin home dashboard | platform admin, platform ops admin, platform security admin | provider-wide control-plane landing page | wireframe-ready |
| `W0-SCR-002` | Global search and command entry | platform admin, implementation lead | admin search across platform objects, tenants, jobs, and controls | structural backlog defined |
| `W0-SCR-003` | Shared task and approvals inbox | platform admin, security reviewer, implementation lead | platform approvals, publish tasks, support reviews, control-plane work items | structural backlog defined |
| `W0-SCR-005` | Metadata explorer and dependency map | architect, platform admin | shared architecture and metadata inspection | structural backlog defined |
| `W0-SCR-006` | Workflow administration console | platform admin, ops lead | provider-governed workflow framework administration | structural backlog defined |
| `W0-SCR-007` | Notification template and channel console | platform admin, communications admin | shared notification framework control | structural backlog defined |
| `W0-SCR-008` | Audit explorer and entity timeline | compliance admin, support lead, security reviewer | cross-entity audit and investigation tooling | structural backlog defined |
| `W0-SCR-009` | Event bus and integration runtime monitor | platform ops, integration admin | runtime monitoring and replay control | structural backlog defined |
| `W0-SCR-011` | AI platform policy and evaluation console | AI admin, platform architect | provider-level AI guardrails and policy controls | structural backlog defined |
| `W0-SCR-012` | Localization diagnostics and bundle runtime view | localization admin, platform admin | shared platform localization diagnostics | structural backlog defined |
| `W0-SCR-014` | Dynamic field catalog and field editor | platform admin, implementation consultant | schema and extensibility governance | structural backlog defined |
| `W0-SCR-015` | Dynamic master console | platform admin, implementation consultant | provider-managed reference-data framework | structural backlog defined |
| `W0-SCR-017` | System settings console | platform admin | provider-wide runtime and feature settings | structural backlog defined |
| `W0-SCR-019` | Access governance dashboard | security admin, compliance officer | privileged access and SoD governance | structural backlog defined |
| `W0-SCR-020` | Role and policy matrix workspace | security admin | provider-level role and policy governance | structural backlog defined |
| `W0-SCR-021` | Data masking policy console | security admin, privacy lead | privacy-rule and reveal-policy administration | structural backlog defined |
| `W0-SCR-022` | Retention and legal-hold control center | governance admin, legal ops | retention and purge governance | structural backlog defined |
| `W0-SCR-023` | Access review campaign workspace | security reviewer, manager reviewer | privileged certification and remediation tooling | structural backlog defined |
| `W0-SCR-024` | Backup and restore operations dashboard | ops lead, platform admin | provider-side resilience operations | structural backlog defined |
| `W0-SCR-025` | Disaster recovery readiness console | ops lead, platform architect, leadership | provider-side DR posture and testing | structural backlog defined |
| `W0-SCR-026` | Bulk import wizard and validation workbench | implementation consultant, HR data lead | implementation tooling operated under governed onboarding context | structural backlog defined |
| `W0-SCR-027` | Migration mapping and reconciliation workspace | data migration lead, architect | onboarding and migration control tooling | structural backlog defined |
| `W0-SCR-028` | Validation command center | QA lead, business owner, implementation lead | provider-led implementation and readiness tracking | structural backlog defined |
| `W0-SCR-029` | Cutover command center | program manager, implementation lead, ops lead | go-live orchestration across implementation environments | structural backlog defined |
| `W0-SCR-030` | Rollback runbook and trigger workspace | program lead, ops lead, executive approver | go-live recovery governance | structural backlog defined |

# 4. Org-Side Screens To Prepare

These screens belong to the customer tenant plane.

## 4.1 Organization Admin Core

| Screen ID or Ref | Screen Name | Primary Users | Why It Is Org Side | Current UX Status |
|---|---|---|---|---|
| `W0-SCR-018` | Organization admin dashboard | org admin, delegated HR or IT admin | customer-owned admin landing page | wireframe-ready |
| `ORG-ADM-001` | Access and roles console | org admin, security admin | tenant-owned role assignment and access administration | to be defined |
| `ORG-ADM-002` | Tenant settings | org admin | tenant-scoped settings, defaults, and policy switches | to be defined |
| `ORG-ADM-003` | Branding and communication setup | org admin, communications admin | tenant brand, email, and document identity controls | to be defined |
| `ORG-ADM-004` | Identity and SSO readiness view | org admin, IT admin | customer-side federation and provisioning readiness | to be defined |
| `ORG-ADM-005` | Workflow and policy setup | org admin, HR admin | tenant-owned routing, approvals, and publish controls | to be defined |
| `ORG-ADM-006` | Module enablement and quota view | org admin | enabled-package visibility, usage, and quota awareness | to be defined |
| `ORG-ADM-007` | Tenant audit and admin activity view | org admin, compliance admin | tenant-scoped audit and admin traceability | to be defined |
| `ORG-ADM-008` | Export and privacy request review | org admin, privacy officer | tenant review of sensitive exports and privacy actions | to be defined |
| `ORG-ADM-009` | Integration status for tenant connectors | org admin, IT admin | customer-facing view of tenant-specific connector health | to be defined |

## 4.2 HRMS Business and Functional Screens

These are also `Org side`, but they should usually sit under domain personas rather than under the org-admin home.

| Persona Group | Example Screens To Prepare |
|---|---|
| Employee | Employee home, my profile, my documents, my requests, my leave and attendance, my pay and tax, my learning and goals, my benefits and claims |
| Manager | Team dashboard, team people list, manager approvals, performance review workspace, hiring approval workspace, team leave and attendance overview, mobility proposal workspace |
| HR Operations | Employee master workbench, lifecycle change workbench, onboarding and preboarding console, document verification queue, data correction and exception queue |
| Recruiter and Talent | Requisition workbench, candidate pipeline board, candidate profile, interview scheduler, offer workspace, talent review workspace |
| Payroll and Compliance | Payroll control center, payroll run details, validation queue, statutory workbench, compliance calendar, retro and settlement workspace |
| Leadership and Analytics | Executive dashboard, workforce analytics, attrition analytics, custom reporting, predictive insight views |

# 5. Shared But Scope-Aware Screens

These screens must be designed with strong role and scope differentiation.

| Screen ID or Ref | Screen Name | Shared Behavior Rule |
|---|---|---|
| `W0-SCR-004` | Configuration catalog and scope console | same core pattern, but provider can edit broader scopes while org admin must see tenant-safe scope and read-only provider values where applicable |
| `W0-SCR-010` | Document template builder and generation monitor | provider may manage shared baseline templates, while customer roles manage tenant-scoped templates and generated output visibility |
| `W0-SCR-013` | Dynamic form designer | platform may define framework and protected forms, while customer-side admins may configure tenant-safe form variants where allowed |
| `W0-SCR-016` | Localization bundle manager | platform may own global bundles; org side may only view or override tenant-safe localization assets if permitted |
| `Tenant management` | tenant lifecycle and profile views | provider owns creation and lifecycle actions; org side sees only tenant-owned profile, readiness, and visibility states |
| `Audit explorer` | audit and timeline views | provider sees broader investigative coverage; org side sees tenant-scoped audit only |
| `Integration monitoring` | runtime and connector views | provider sees shared runtime, org side sees only tenant connector health and action items |

# 6. Recommended Screen Preparation Sequence

To avoid confusion between the two planes, prepare screens in this order:

1. Platform home and Org home
2. Shared shell, search, and inbox patterns
3. Org-side core admin screens
4. Platform-side governance and operations screens
5. Domain business screens for employee, manager, HR, recruiter, payroll, and leadership personas
6. Shared scope-aware consoles with explicit permission and boundary states

# 7. Immediate Backlog For Wireframe Expansion

Recommended next wireframe-ready candidates:

## Platform Side

- `W0-SCR-002` Global search and command entry
- `W0-SCR-003` Shared task and approvals inbox
- `W0-SCR-004` Configuration catalog and scope console
- `W0-SCR-008` Audit explorer and entity timeline

## Org Side

- `ORG-ADM-001` Access and roles console
- `ORG-ADM-002` Tenant settings
- `ORG-ADM-004` Identity and SSO readiness view
- `ORG-ADM-005` Workflow and policy setup

# 8. Decision Summary

The screen-preparation split should now be treated as:

- `Platform side` for SaaS provider operations
- `Org side` for customer tenant administration and business usage
- `Shared but scope-aware` for screens that reuse patterns across both planes but must enforce different visibility and edit rules
