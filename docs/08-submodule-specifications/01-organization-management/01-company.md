---
id: HRMS-SUB-01-01
title: Company Specification
document: 01-company.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Company defines the top-level enterprise organization object used to represent a business company, enterprise brand, or operating corporation within the HRMS platform.

In scope:

- Company master-data definition
- Enterprise-level governance and applicability
- Branding, policy, and global settings linkage
- Relationship to legal entities, locations, and business structures
- Company lifecycle and activation control

# 2. Business

Company is one of the highest-level reference structures in the HRMS platform. It provides the enterprise boundary used for policy ownership, analytics, branding, and global operating context, especially in multi-company or multi-brand deployments.

Business objectives:

- Represent top-level business companies cleanly within a single platform
- Support shared and distinct HR policies across companies
- Provide a stable anchor for downstream master data and reporting
- Enable mergers, spin-offs, and multi-brand operating models without redesigning the platform

# 3. Functional

The system shall support:

- Creation of one or more companies within a tenant where operating model permits
- Company code, company name, display name, short name, and business status
- Mapping of company to legal entities, brands, geographies, and global calendars
- Company-level configuration references such as default language, timezone, logo, branding, and primary policy bundle
- Company lifecycle actions such as draft, active, inactive, and retired
- Restriction of downstream objects to valid company context

Detailed rules:

- Company should be distinct from legal entity and not used interchangeably in design
- A company may contain one or many legal entities depending on business structure
- Company retirement should follow downstream dependency review rather than hard delete
- Company code and identity must remain stable once referenced in downstream integrations or analytics
- Multi-company users may require scoped access and reporting filters across company boundaries
- Company-level configuration should distinguish global defaults from inherited downstream overrides
- Branding and communication defaults should remain separately versionable from structural identity where operating model requires

# 4. UX

Primary screens:

- Company master register
- Company setup wizard
- Company profile and branding screen
- Dependency impact viewer

UX expectations:

- Admins should understand where company sits in the enterprise hierarchy relative to legal entities and departments
- Setup screens should clearly separate global branding from statutory or payroll-specific configuration
- Dependency screens should show legal entities, locations, and policies linked to the company before change or retirement

# 5. API

Representative APIs:

- `POST /api/v1/org/companies`
- `GET /api/v1/org/companies/{companyId}`
- `PUT /api/v1/org/companies/{companyId}`
- `POST /api/v1/org/companies/{companyId}/activate`
- `POST /api/v1/org/companies/{companyId}/retire`
- `GET /api/v1/org/companies/{companyId}/dependencies`

# 6. Database

Core entities:

- `company`
- `company_profile`
- `company_status_history`
- `company_branding`
- `company_dependency_snapshot`

Key fields:

- Company code, name, status, effective dates
- Parent enterprise reference, default locale, default timezone
- Primary branding assets, company display name, business segment tags
- Activation date, retirement date, dependency status, owner role
- Global policy pack reference, primary communication profile, document template pack
- Finance or executive owner, support ownership model, region coverage

# 7. Events

Published events:

- `company.created`
- `company.activated`
- `company.updated`
- `company.retirement_requested`
- `company.retired`

Consumed events:

- `legal_entity.created`
- `branding.asset_updated`
- `policy.bundle_changed`

# 8. Reports

Required reports:

- Company master report
- Company dependency report
- Active vs retired company report
- Company policy coverage report
- Company branding and locale configuration report
- Cross-company access-scope report

# 9. Dashboards

Operational dashboards:

- Companies by status
- Companies by geography
- Pending company change approvals
- Company dependency health

# 10. Security

Security requirements:

- Company creation and retirement should be restricted to high-trust administrative roles
- Cross-company visibility should be governed carefully for multi-company tenants
- Branding and business-profile changes should remain auditable and permission-scoped

# 11. Audit

Audit coverage shall include:

- Company creation and edits
- Status transitions
- Branding changes
- Retirement or reactivation actions
- Dependency review before retirement

# 12. AI

AI-assisted opportunities:

- Suggest configuration consistency checks across companies
- Detect duplicate or overlapping company structures after migration or merger
- Summarize downstream impact of company-level changes

AI guardrails:

- AI suggestions must not auto-retire or merge company structures
- Impact summaries should clearly distinguish inferred vs explicit dependencies

# 13. Test Cases

Core test scenarios:

- Create active company with valid core metadata
- Prevent retirement when active legal entities remain unresolved
- Update branding without affecting statutory structures
- Restrict cross-company visibility for scoped admin user
- Retrieve dependency map before company status change
- Apply company-level default locale while preserving entity override behavior
- Validate that company code remains immutable once integration references exist

# 14. Workflows

Primary workflow:

1. Platform admin creates company.
2. Branding, locale, and company-level defaults are configured.
3. Legal entities and other downstream structures are attached.
4. Company becomes active for operational use.
5. Retirement or merger changes follow dependency review and controlled transition.

# 15. State Machine

Company state model:

- `Draft`
- `Active`
- `Inactive`
- `Retiring`
- `Retired`

# 16. Permissions

Representative permissions:

- `company.create`
- `company.edit`
- `company.activate`
- `company.retire`
- `company.dependencies.view`
- `company.audit.view`

# 17. Notifications

Notification scenarios:

- Company activation approved
- Company retirement requested
- Dependency conflict detected before retirement
- Branding update completed

# 18. Configuration

Configurable parameters:

- Company code standard
- Default branding and locale
- Multi-company visibility model
- Retirement approval workflow
- Dependency blocking behavior

# 19. Edge Cases

Important edge cases:

- Company is created before legal entities are finalized
- Merger requires one company to absorb another without losing historical reporting
- Same user operates across multiple companies with different policy bundles
- Company is operationally inactive but still needed for history retention
