---
id: HRMS-SAAS-001
title: Enterprise HRMS SaaS First Operating Model
document: 01-saas-first-operating-model.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the primary SaaS product stance for the Enterprise HRMS platform. It clarifies that the application should be designed first as a provider-operated multi-tenant product rather than as a single-company HRMS deployed independently for each customer.

# 2. Product Position

The Enterprise HRMS shall be treated as a `SaaS-first`, `multi-tenant`, `configuration-led`, and `security-governed` platform.

This means:

- the platform provider operates the common control plane
- customers operate their own organization inside isolated tenant boundaries
- module behavior is configured and packaged rather than hard-forked by customer
- platform capabilities, industry packs, security controls, and UX layers are designed to scale across many customers

# 3. Core SaaS Design Principles

The product should follow these principles:

- `Control plane separated from tenant business plane`
  Provider-side operations, support, security, packaging, and tenant provisioning must remain separate from day-to-day HRMS business transactions.
- `Tenant isolation by default`
  Every customer must have logically isolated data, configuration, workflow state, documents, events, and audit history.
- `Configurable, not custom-coded`
  Variations across customers, countries, and industries should be handled through configuration, policy, workflow, localization, feature flags, and industry solution packs.
- `Enterprise trust by default`
  Security, privacy, audit, masking, retention, and support-access governance must be built into the operating model, not added later.
- `Regional readiness`
  The platform should support region-aware deployment, time zones, localization, and data residency controls.
- `Lifecycle-aware delivery`
  Prospect, implementation, sandbox, production, suspension, archive, and decommission states must be first-class concepts.

# 4. SaaS Operating Layers

## 4.1 Provider Control Plane

This is the provider-operated layer used by the SaaS company or platform operator.

Typical responsibilities:

- tenant provisioning and lifecycle control
- plan and feature-package management
- shared platform configuration
- release and environment governance
- integration-runtime health
- platform audit and security operations
- backup, restore, and disaster recovery administration
- support and supervised access sessions

## 4.2 Customer Tenant Plane

This is the customer-owned operating space.

Typical responsibilities:

- organization structure and workforce records
- HR, payroll, talent, travel, expense, and service operations
- customer-owned policies, workflows, and approvals
- SSO and identity mappings within the tenant
- branding, forms, templates, and tenant-scoped settings
- internal reporting and dashboards

## 4.3 End-User Experience Layers

Within each tenant, the experience should further separate:

- organization admin
- HR operations
- payroll and compliance
- managers
- employees
- executives and analytics consumers

# 5. Tenant Model

The product shall support a tenant model in which each customer organization is represented as a managed tenant with:

- unique tenant identifier and code
- region and residency profile
- plan and capability entitlements
- enabled modules and industry packs
- org-level configuration baselines
- identity and domain mappings
- quota, usage, and support metadata

The tenant is the customer boundary for:

- business data
- most configuration
- documents and generated artifacts
- workflow instances
- notification history
- analytics context
- audit trails

# 6. Isolation Model

The platform should support a baseline logical isolation model for all customers, with optional stronger isolation tiers where commercially or contractually required.

Isolation expectations:

- no cross-tenant reads in standard application flows
- tenant-aware authorization on every request
- tenant-aware encryption, audit tagging, and event partitioning
- support tooling that requires explicit tenant context
- no customer admin role can access another customer tenant

# 7. Industry Solution Packs

Industry solution packs should be treated as SaaS packaging layers, not separate products.

Supported solution-pack direction includes:

- Retail
- Manufacturing
- Healthcare
- BFSI
- Education
- Government
- Logistics
- Hospitality
- Construction
- IT and ITES

Each industry pack may contribute:

- preconfigured workflows
- compliance templates
- role packs
- reports and dashboards
- policy defaults
- data extensions
- onboarding and implementation accelerators

# 8. Dashboard Ownership Model

The platform shall separate dashboards by operating responsibility.

`Platform Admin` dashboards should focus on:

- tenant health
- provisioning status
- environment posture
- shared-service availability
- integration and event failures
- security and privacy exceptions
- audit ingestion
- backup and disaster recovery readiness

`Org Admin` dashboards should focus on:

- tenant-owned configuration tasks
- identity setup
- workflow and policy setup
- enabled modules and usage
- organization-specific alerts
- customer-side adoption and operational tasks

Business dashboards such as leave approvals, requisition queues, or employee actions belong to customer-side HRMS personas, not to the provider-side platform admin landing page.

# 9. Non-Negotiable SaaS Rules

The following rules should remain stable across the product:

- platform admin is not the same persona as org admin
- provider-side users should not work inside customer HR transactions unless controlled support access is explicitly invoked
- customer hierarchy begins at `Org Admin` as the highest customer-owned role
- all support, impersonation, export, restore, and privacy-sensitive operations must be auditable
- every module must be able to express tenant scope, permission scope, and data-classification impact

# 10. Implementation Consequence

This SaaS-first stance affects all future design and engineering work:

- navigation must separate provider and customer experiences
- APIs must enforce tenant-aware authorization
- databases and events must carry tenant lineage
- reports and dashboards must be role- and scope-specific
- QA must test both provider-plane and tenant-plane boundaries
- UX must avoid mixing platform operations with customer HR operations on the same primary dashboard
