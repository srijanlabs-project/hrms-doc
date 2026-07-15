---
id: HRMS-SUB-03-04
title: Roles Specification
document: 04-roles.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Roles defines the business-facing access constructs used to bundle permissions into understandable, assignable units that reflect workforce responsibilities, support models, and governance boundaries.

In scope:

- Role taxonomy and lifecycle
- System and tenant role design
- Composite and inherited roles
- Role ownership, usage, and review
- Role publication and retirement governance

# 2. Business

Roles are the main bridge between business responsibility and system access. They allow HR, payroll, managers, auditors, and support teams to receive coherent access packages without assigning low-level permissions one by one.

Business objectives:

- Make access assignment understandable to business and security teams
- Reduce permission sprawl and inconsistent entitlement design
- Support scalable onboarding, transfers, and temporary operational access
- Provide clear ownership and reviewability for access bundles

# 3. Functional

The system shall support:

- System-defined, tenant-defined, and delegated-admin-manageable role categories
- Role families by module, business function, geography, or risk tier
- Composite roles that aggregate multiple lower-level roles where policy allows
- Effective dating, draft, publish, deprecate, retire, and replace lifecycle states
- Role ownership metadata and mandatory review or certification cycles
- Usage analytics such as assigned population, recent usage, and orphan-role detection

Detailed rules:

- Role names, descriptions, and purpose statements should be business-readable
- High-risk roles should require stronger approval and periodic certification
- Composite roles must expose inherited content transparently and must not mask risk
- Retiring a role should trigger impact assessment on all active assignments and automation rules
- Role design should integrate with SoD, ABAC, and data-scope models rather than bypass them

# 4. UX

Primary screens:

- Role catalog
- Role designer
- Role-composition and inheritance explorer
- Role usage and impact dashboard
- Role review and retirement console

UX expectations:

- Admin users should understand what a role grants without reading raw permission IDs alone
- High-risk indicators, business owner, and certification status should be visible from the role list
- Impact views should show assigned users, automation dependencies, and conflict flags before edits

# 5. API

Representative APIs:

- `POST /api/v1/access/roles`
- `PUT /api/v1/access/roles/{roleId}`
- `POST /api/v1/access/roles/{roleId}/publish`
- `POST /api/v1/access/roles/{roleId}/retire`
- `GET /api/v1/access/roles/{roleId}/usage`
- `GET /api/v1/access/roles/{roleId}/effective-content`

# 6. Database

Core entities:

- `access_role`
- `access_role_version`
- `access_role_composition`
- `access_role_owner`
- `access_role_usage_snapshot`
- `access_role_retirement_plan`

Key fields:

- Role code, name, category, risk tier, status
- Version number, publish date, approval state, change summary
- Parent role, child role, inheritance type, effective scope
- Owner user or group, review cadence, last certified date
- Assignment count, privileged action count, orphan flag

# 7. Events

Published events:

- `role.created`
- `role.published`
- `role.updated`
- `role.retirement_requested`
- `role.retired`
- `role.review_due`

Consumed events:

- `permission.catalog.updated`
- `sod.conflict_detected`
- `access_review.completed`
- `tenant.scope_changed`

# 8. Reports

Required reports:

- Role inventory report
- Role-to-user assignment report
- High-risk role report
- Role usage and orphan-role report
- Role review and certification report

# 9. Dashboards

Operational dashboards:

- Roles by risk tier
- Roles pending publication or retirement
- High-risk roles without recent certification
- Composite-role dependency hotspots

# 10. Security

Security requirements:

- Role creation and publication should be restricted to trusted administrative populations
- Sensitive or privileged roles should require stronger control and visibility restrictions
- Role definitions must not allow hidden inherited privileges

# 11. Audit

Audit coverage shall include:

- Role creation, edit, publish, and retire actions
- Composition and inheritance changes
- Owner and review-cycle changes
- Impact-analysis and retirement overrides
- Viewing or exporting privileged role definitions

# 12. AI

AI-assisted opportunities:

- Recommend role consolidation where near-duplicate roles exist
- Detect risky role compositions likely to create SoD issues
- Suggest ownerless or stale roles for governance cleanup

# 13. Test Cases

Core test scenarios:

- Create and publish low-risk role
- Build composite role and expose inherited content correctly
- Prevent retirement of role with unresolved assignments
- Flag role with conflict-prone composition
- Run role usage impact view before change

# 14. Workflows

Primary workflow:

1. Security or platform admin drafts role definition.
2. Role composition and risk are validated.
3. Approval and publication occur where required.
4. Role becomes available for assignment and periodic review.
5. Retirement follows impact-assessment and migration path.

# 15. State Machine

Role state model:

- `Draft`
- `Under Review`
- `Published`
- `Deprecated`
- `Retiring`
- `Retired`
- `Rejected`

# 16. Permissions

Representative permissions:

- `role.create`
- `role.publish`
- `role.retire`
- `role.compose`
- `role.usage.view`
- `role.audit.view`

# 17. Notifications

Notification scenarios:

- Role awaiting approval
- Certification due for privileged role
- Role retirement impact detected
- Permission catalog change affects published role

# 18. Configuration

Configurable parameters:

- Role categories
- Certification frequency
- Composite-role limits
- Retirement approval thresholds
- Naming and code standards

# 19. Edge Cases

Important edge cases:

- Same business purpose is represented by multiple legacy roles after merger
- Composite role inherits retired child role
- Role content changes while temporary assignments are active
- Tenant custom role exceeds approved risk tier unexpectedly
