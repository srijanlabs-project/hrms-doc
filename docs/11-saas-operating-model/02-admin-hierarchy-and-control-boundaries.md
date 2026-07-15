---
id: HRMS-SAAS-002
title: Enterprise HRMS Admin Hierarchy and Control Boundaries
document: 02-admin-hierarchy-and-control-boundaries.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the administrative hierarchy for the SaaS edition of Enterprise HRMS and establishes the control boundary between provider-side platform operators and customer-side tenant administrators.

# 2. Naming Standard

To reduce confusion, the documentation should use:

- `Platform Admin` for provider-side administration
- `Org Admin` for the highest customer-owned administrative role
- `Tenant Admin` as the technical or architectural alias for `Org Admin` where a tenant boundary must be described explicitly

User-facing screens should prefer `Org Admin`. Technical architecture, APIs, and data model references may use `tenant` where necessary.

# 3. Administrative Planes

## 3.1 Provider-Side Administrative Plane

Provider-side roles belong to the SaaS operator.

Representative roles:

- `Platform Super Admin`
- `Platform Operations Admin`
- `Platform Security Admin`
- `Platform Support Admin`
- `Platform Billing and Subscription Admin`
- `Implementation or Migration Admin`

These roles manage the platform itself, not the daily HR operations of a customer.

## 3.2 Customer-Side Administrative Plane

Customer-side roles belong to the subscribing organization.

Representative roles:

- `Org Admin`
- `HR Admin`
- `Payroll Admin`
- `Recruitment Admin`
- `Learning Admin`
- `Compliance Admin`
- `Manager`
- `Employee`

These roles manage workforce operations, policy execution, and tenant-owned configuration inside their own organization boundary.

# 4. Boundary Rules

The following boundary rules should apply:

- platform admins can manage tenants, plans, environments, security posture, and shared-service operations
- org admins can manage only their own organization or tenant configuration and business operations
- org admins must not see provider-side controls such as cross-tenant inventory, platform incidents, shared secrets, or global plan catalogs unless explicitly delegated in a controlled partner model
- platform admins must not process normal customer HR tasks such as leave approvals, job requisitions, payroll approvals, or performance reviews as part of their standard landing experience
- support access into a customer tenant must be temporary, approved where required, purpose-bound, and fully audited

# 5. Role Ownership Matrix

| Capability Area | Platform Admin | Org Admin | HR or Functional Admin |
|---|---|---|---|
| Tenant provisioning | Owns | Views status only | No |
| Subscription and packaging | Owns | Views enabled packages | No |
| Shared platform health | Owns | No | No |
| Tenant branding | May set baseline or assist | Owns within tenant | No |
| SSO setup for a tenant | Supports and validates | Owns customer-side mapping and rollout | No |
| Tenant-scoped forms and workflows | No by default | Owns | Supports in domain area |
| Leave approvals | No | No by default | Manager or HR role owns |
| Job requisition approval | No | No by default | Hiring or HR role owns |
| Payroll exception handling | No | No by default | Payroll role owns |
| Security incident response | Owns platform side | Participates for tenant impact | Participates as needed |
| Data subject request orchestration | Provides tooling and guardrails | Owns customer approval and business context | Participates as needed |

# 6. Dashboard Separation

## 6.1 Platform Admin Dashboard

A platform admin home page should show:

- active tenants
- provisioning tasks
- expiring certificates or secrets
- identity federation issues
- platform service degradation
- security and privacy exceptions
- failed jobs, queues, or integration routes
- backup or disaster recovery warnings
- access review or support-session alerts

It should not center around tenant business transactions such as:

- leave requests
- travel approvals
- reimbursement approvals
- job requisitions
- employee document acknowledgments

Those belong to customer-side workflows.

## 6.2 Org Admin Dashboard

An org admin dashboard should show:

- tenant profile and activation health
- identity and SSO setup status
- enabled module and feature-pack status
- branding and policy publish tasks
- workflow and form setup tasks
- quota and usage visibility
- compliance reminders scoped to that organization

# 7. Support and Impersonation Model

Support access shall follow these rules:

- default mode is `no standing business access`
- support session must capture target tenant, reason, actor, start time, and end time
- high-risk access may require customer approval or dual authorization
- masked fields remain masked unless explicit reveal policy is satisfied
- impersonation and assisted troubleshooting events must be auditable and reportable

# 8. UX and Documentation Consequences

All future documentation, wireframes, and backlogs should preserve these distinctions:

- provider-side screens belong to the platform control plane
- customer-side admin screens belong to the organization tenant plane
- module workflows such as leave, payroll, and recruitment should begin under customer personas, not provider personas
- labels, menus, and dashboards should avoid role ambiguity

# 9. Decision Summary

The correct SaaS interpretation is:

- `Platform Admin` is provider-side
- `Org Admin` is the top customer-owned role
- client hierarchy starts at `Org Admin`
- HRMS business dashboards begin below the customer boundary, not at the provider boundary
