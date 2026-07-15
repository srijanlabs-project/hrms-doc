---
id: HRMS-JRN-011
title: Enterprise HRMS Persona Boundary Matrix
document: 11-persona-boundary-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This document clarifies the boundary between the major Enterprise HRMS personas so product, UX, engineering, QA, implementation, and business teams do not mix:

- provider-side SaaS administration
- customer-side tenant administration
- customer-side HR business operations
- people-manager workflows
- employee self-service

The most important boundary is:

- `Platform Admin` is not `Org Admin`
- `Org Admin` is not `Head HR`
- `Head HR` is not the same as `HR Operations`

# 2. Primary Boundary Rule

The application should be interpreted in three layers:

1. `Provider control plane`
   operated by the SaaS provider
2. `Customer tenant administration plane`
   operated by the customer's system or tenant administrators
3. `Customer HRMS business plane`
   operated by HR, payroll, managers, employees, and leadership

# 3. Persona Matrix

| Persona | Plane | Core Responsibility | Owns Configuration | Owns HR Business Operations | Typical Dashboard Focus | Should Not Be Centered On |
|---|---|---|---|---|---|---|
| `Platform Admin` | provider control plane | manage the SaaS platform across tenants | yes, provider scope | no | tenant health, runtime, security, privacy, jobs, audit, resilience | employee leave, requisitions, payroll transactions inside a customer tenant |
| `Platform Ops Admin` | provider control plane | monitor service health, incidents, queues, backup, DR | limited platform runtime config | no | incidents, failures, throughput, recovery readiness | customer HR operations |
| `Platform Security Admin` | provider control plane | manage privileged access, SoD, retention, masking, reviews | yes, provider security scope | no | access governance, review campaigns, privacy exceptions | tenant business approvals |
| `Org Admin` | customer tenant administration plane | configure and govern the customer tenant safely | yes, tenant scope | no, except delegated admin tasks | setup gaps, SSO readiness, module enablement, workflow setup, branding, connector status, usage, quota | day-to-day HR operations dashboards as the primary home |
| `Head HR` | customer HRMS business plane | own HR policy, workforce outcomes, and HR operating decisions | limited business-policy ownership, usually not technical platform setup | yes, at business-owner level | workforce health, attrition, hiring, performance, compliance, org capability | provider controls, tenant runtime diagnostics, platform infrastructure health |
| `HR Operations` | customer HRMS business plane | execute employee lifecycle and daily HR processes | limited, only where process config is delegated | yes, daily execution | employee master, onboarding, lifecycle cases, documents, correction queues | provider operations and deep technical tenant governance |
| `Payroll Admin` | customer HRMS business plane | run payroll, validate inputs, manage compliance outputs | limited payroll-specific setup | yes, payroll and statutory operations | payroll runs, validations, retro, settlement, filings, cutoffs | platform runtime health and general tenant setup |
| `Recruiter` | customer HRMS business plane | run hiring workflows | limited requisition or stage config if delegated | yes, recruitment operations | requisition pipeline, candidates, interviews, offers | platform admin and tenant setup |
| `Manager` | customer HRMS business plane | manage team approvals and people actions | no, except lightweight preferences | yes, team-scoped operational decisions | team dashboard, approvals, leave, attendance, performance, hiring approvals | tenant configuration and provider controls |
| `Employee` | customer HRMS business plane | self-service interactions and personal record actions | no | no, except own transactions | profile, documents, requests, leave, attendance, pay, learning, benefits | admin setup, governance, platform operations |
| `Leadership` | customer HRMS business plane | consume strategic workforce insight | no | indirect, through business decisions | executive metrics, attrition, talent, productivity, cost, compliance posture | transactional administration and setup consoles |
| `Implementation Lead` | shared, controlled program role | deliver onboarding, migration, validation, cutover | yes, within governed project scope | no, except implementation support | migration progress, cutover readiness, data quality, signoff blockers | BAU HR operations after go-live |
| `Support Agent` | provider control plane with controlled tenant context | troubleshoot customer issues under audited access | no persistent ownership | no | support sessions, error triage, case evidence, guided investigations | normal customer admin or HR operations outside approved support context |

# 4. Org Admin Versus Head HR

This is the most commonly confused boundary on customer side.

## 4.1 `Org Admin`

`Org Admin` is usually:

- HRIS admin
- system administrator for the HRMS tenant
- implementation admin
- IT or HR tech administrator
- delegated tenant configuration owner

The role is primarily about:

- application setup
- identity and SSO readiness
- module enablement
- branding and templates
- tenant workflow and policy publishing
- role and access assignment within tenant scope
- connector readiness
- quota and usage monitoring
- admin audit visibility

This role is not primarily about:

- processing leave requests as a business function
- handling day-to-day employee cases
- owning recruitment pipeline execution
- running payroll cycles
- reviewing workforce KPIs as the HR business leader

## 4.2 `Head HR`

`Head HR` is usually:

- CHRO
- HR Director
- VP HR
- Head of People
- senior HR business owner

The role is primarily about:

- people strategy
- policy decisions
- hiring and retention outcomes
- leadership and talent decisions
- workforce planning
- business compliance ownership
- organization capability and culture outcomes

This role is not primarily about:

- managing SSO setup
- checking connector failures
- configuring branding
- publishing tenant-level metadata
- monitoring platform or tenant runtime health

## 4.3 Simple Test

If the question is:

- `Is the system configured, connected, and safe to operate?`
  that is mostly `Org Admin`

- `Are our people processes and workforce outcomes working well?`
  that is mostly `Head HR`

# 5. Platform Admin Versus Org Admin

| Area | Platform Admin | Org Admin |
|---|---|---|
| Scope | all tenants under provider governance | one customer tenant only |
| Health view | platform-wide | tenant-specific |
| Configuration rights | provider and shared platform scope | tenant scope only |
| User access | provider users and controlled support flows | customer users inside the tenant |
| Audit view | platform-wide and support-bound | tenant-scoped admin and business audit |
| Runtime actions | jobs, event bus, backup, DR, control-plane settings | tenant settings, branding, workflow setup, identity readiness |
| HR business operations | no | generally no as the primary role |

# 6. Head HR Versus HR Operations

| Area | Head HR | HR Operations |
|---|---|---|
| Focus | strategy, policy, outcomes, leadership decisions | execution, cases, transactions, compliance follow-through |
| Typical screens | executive dashboard, workforce analytics, talent reviews, approval escalations | employee workbench, onboarding, lifecycle changes, verification queues, corrections |
| Time horizon | medium to long term | daily to periodic |
| Main success measure | HR outcomes and business impact | operational accuracy and turnaround |

# 7. Dashboard Ownership Guide

## 7.1 `Platform Admin` Dashboard Should Show

- tenant provisioning and lifecycle
- runtime failures
- queue backlogs
- integration and event failures
- security and privacy exceptions
- backup and disaster recovery posture
- provider audit and support-session signals

## 7.2 `Org Admin` Dashboard Should Show

- tenant setup progress
- identity and SSO readiness
- module enablement
- tenant workflow and policy publish tasks
- branding and template setup
- quota, storage, and usage signals
- tenant connector health
- tenant-scoped admin audit visibility

## 7.3 `Head HR` Dashboard Should Show

- headcount and movement
- attrition and retention
- recruitment progress
- performance and talent signals
- workforce productivity
- policy and people-risk metrics
- compliance posture from a business perspective

## 7.4 `HR Operations` Dashboard Should Show

- onboarding and lifecycle queue
- pending approvals
- document verification
- exception handling
- employee corrections
- operational SLA and backlog

# 8. Common Mistakes To Avoid

- showing leave requests, requisitions, or payroll transactions on the `Platform Admin` home
- treating `Org Admin` as the same persona as `Head HR`
- giving `Head HR` technical setup dashboards as the default landing page
- mixing provider-wide control-plane actions into tenant-owned admin screens
- assuming one real-world person wearing two hats means the product should merge the two personas

# 9. Design and Engineering Rule

Even if one individual in a smaller company performs multiple roles, the product should still model the personas separately.

Why:

- permissions stay cleaner
- dashboards remain understandable
- audit expectations remain clear
- implementation and support teams can reason about role boundaries correctly
- growth from small customer to enterprise customer does not require redesigning the persona model

# 10. Recommended Usage

This document should be used together with:

- [01-saas-first-operating-model.md](D:/HRMS-doc/docs/11-saas-operating-model/01-saas-first-operating-model.md)
- [02-stakeholder-coverage-map.md](D:/HRMS-doc/docs/00-master-index/02-stakeholder-coverage-map.md)
- [10-platform-vs-org-screen-ownership-matrix.md](D:/HRMS-doc/docs/10-ui-ux-architecture/10-platform-vs-org-screen-ownership-matrix.md)

When in doubt about a new screen, workflow, widget, or report:

1. identify the plane first
2. identify the persona second
3. verify whether the screen is configuration-led, operational, or strategic
4. only then decide the dashboard or navigation placement
