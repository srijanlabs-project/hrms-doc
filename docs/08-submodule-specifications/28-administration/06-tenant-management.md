---
id: HRMS-SUB-28-06
title: Tenant management Specification
document: 06-tenant-management.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Tenant Management governs provisioning, configuration, isolation, lifecycle, and governance of tenant environments in the enterprise HRMS platform.

In scope:

- Tenant creation and onboarding
- Feature, locale, and module enablement
- Tenant isolation and branding
- Subscription, usage, and operational governance
- Tenant lifecycle actions such as suspend, clone, archive, or decommission
- Provider-side versus customer-side control boundary

# 2. Business

Tenant management is essential for multi-tenant scalability, managed-service operations, and enterprise partitioning. It ensures each tenant can be configured independently without compromising platform control or data isolation.

In the SaaS model, tenant management also establishes the governance line between the provider-operated platform control plane and the customer-operated organization tenant plane.

# 3. Functional

The system shall support:

- Tenant profile including name, code, region, timezone, currency, and supported locales
- Separation of provider-managed tenant record from customer-managed organization administration
- Module enablement, feature flags, and configuration baselines per tenant
- Tenant-specific branding, document templates, and domain mappings
- Environment lifecycle such as create, activate, suspend, clone, archive, and delete
- Tenant-level quotas, usage monitoring, and support metadata
- Data and configuration isolation across tenants
- Controlled support-session access into a tenant with approval and audit where required

Administrative boundary rules:

- Platform admin manages tenant creation, lifecycle, package assignment, quota policy, and platform safeguards
- Org admin is the highest customer-owned role inside a tenant
- Org admin can manage only tenant-scoped settings and organization-owned configuration
- Platform admin does not participate in normal tenant HRMS transactions unless support access is invoked explicitly

Validation rules:

- Tenant code and domain mappings shall be unique
- Module dependencies shall be validated before enablement
- Decommissioning shall enforce archive, retention, and legal-hold checks

# 4. UX

The user experience shall provide:

- Provider-side tenant administration console
- Customer-side organization admin console
- Tenant health and configuration overview
- Module enablement and dependency warnings
- Lifecycle action confirmations for suspend, archive, and decommission
- Clear indication of which controls are provider-only versus org-admin accessible

# 5. API

Representative APIs:

- `POST /api/v1/admin/tenants`
- `PATCH /api/v1/admin/tenants/{tenantId}`
- `POST /api/v1/admin/tenants/{tenantId}/activate`
- `POST /api/v1/admin/tenants/{tenantId}/suspend`
- `POST /api/v1/admin/tenants/{tenantId}/clone`

# 6. Database

Core entities:

- `tenant`
- `tenant_module_enablement`
- `tenant_branding_config`
- `tenant_lifecycle_log`
- `tenant_quota_usage`

# 7. Events

The platform shall publish:

- `tenant.created`
- `tenant.activated`
- `tenant.suspended`
- `tenant.cloned`
- `tenant.decommission-requested`

# 8. Reports

Required reports:

- Tenant inventory report
- Module enablement report
- Tenant usage and quota report
- Tenant lifecycle action report

# 9. Dashboards

Dashboards shall show:

- Provider dashboard:
  Active tenants by region, suspended or at-risk tenants, module adoption by tenant, quota or capacity hotspots
- Organization admin dashboard:
  Tenant-scoped enablement status, identity readiness, branding completeness, quota visibility, and org-specific admin alerts

# 10. Security

Security controls shall include:

- Strong tenant data isolation
- Restricted platform-admin access
- Controlled cloning and cross-tenant movement
- Audit of tenant-level configuration changes
- Governed support-session and impersonation controls
- Masked handling of sensitive data in cloned or non-production environments

# 11. Audit

The audit trail shall capture:

- Tenant creation and update events
- Lifecycle transitions
- Module enablement changes
- Branding, domain, and isolation configuration edits
- Support-session start, end, reason, and privileged actions

# 12. AI

AI capabilities may include:

- Tenant configuration recommendations
- Detection of drift from approved tenant baseline
- Usage anomaly summaries
- Recommendations for org-admin setup completion without exposing provider-only controls

# 13. Test Cases

- New tenant receives baseline configuration correctly
- Module dependency block prevents invalid enablement
- Suspended tenant access is disabled
- Clone operation preserves allowed configuration only
- Decommission flow respects retention constraints

# 14. Workflows

1. Tenant is provisioned.
2. Baseline modules and settings are applied.
3. Initial org-admin access is established.
4. Tenant operates with isolated configuration and data.
5. Lifecycle actions are managed over time.

# 15. State Machine

- `draft`
- `provisioning`
- `active`
- `suspended`
- `archived`
- `decommissioning`
- `deleted`

# 16. Permissions

- Create tenant
- Edit tenant configuration
- Enable modules
- Suspend or reactivate tenant
- Clone or decommission tenant
- Enter governed support session

# 17. Notifications

- Tenant provisioning completion notices
- Quota threshold alerts
- Suspend or decommission confirmations
- Baseline drift warnings

# 18. Configuration

- Region and deployment options
- Baseline module bundles
- Branding and domain rules
- Quota and retention policies
- Support-session approval policy
- Data-residency controls

# 19. Edge Cases

- Tenant migrates region after go-live
- Shared integration endpoint serves multiple tenants
- Tenant on legal hold cannot be decommissioned fully
- Clone needed for training or sandbox use with masked data
- Org admin attempts to access provider-only tenant controls
