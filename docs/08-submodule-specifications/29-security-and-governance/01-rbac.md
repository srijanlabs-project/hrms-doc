---
id: HRMS-SUB-29-01
title: RBAC Specification
document: 01-rbac.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

RBAC defines the baseline authorization framework for granting business capability access through roles that map to permission bundles across the HRMS platform.

In scope:

- Role model and role taxonomy
- Permission-to-role mapping
- Role assignment, revocation, and temporary access
- Role inheritance, composite roles, and runtime effective access
- Role review, certification, and governance integration

# 2. Business

HRMS platforms serve a wide mix of employees, managers, HR teams, payroll users, auditors, support staff, executives, and system administrators. RBAC provides the first layer of control so every user receives the minimum business access needed before finer data-scope and policy checks are applied.

Business objectives:

- Standardize access administration across modules and tenants
- Reduce accidental over-permissioning and access ambiguity
- Support quick but controlled onboarding of users into business roles
- Provide audit-ready evidence of granted and effective access

# 3. Functional

The system shall support:

- System-defined roles, tenant-defined roles, and derived composite roles where allowed
- Permission families grouped by module, action, and sensitivity
- Direct user assignments, scoped group assignments, and temporary access grants
- Effective dating, suspension, expiry, and automatic revocation
- Role ownership, review, recertification, and attestation workflows
- SoD validation and approval routing for high-risk assignments

Detailed rules:

- System roles may be locked from tenant modification
- Tenant custom roles may be limited to approved permission families
- High-risk roles should require additional approval and periodic certification
- Effective-access calculation must expose direct, inherited, delegated, and temporary grants
- Revocation must propagate within the defined security SLA across UI, API, and background services

# 4. UX

Primary screens:

- Role catalog
- Permission matrix
- User assignment view
- Effective access explorer
- Certification and review workspace

UX expectations:

- Role names and descriptions must be business-readable, not only technical
- Admins should understand risk level, SoD exposure, and privileged scope before assignment
- Review users should be able to certify many assignments efficiently with evidence context

# 5. API

Representative APIs:

- `POST /api/v1/security/rbac/roles`
- `PUT /api/v1/security/rbac/roles/{roleId}`
- `POST /api/v1/security/rbac/role-assignments`
- `DELETE /api/v1/security/rbac/role-assignments/{assignmentId}`
- `GET /api/v1/security/rbac/users/{userId}/effective-roles`
- `POST /api/v1/security/rbac/reviews/{reviewId}/certify`

API expectations:

- Assignment APIs must validate approval requirements, SoD conflicts, and assignment scope
- Effective-role APIs should reveal direct and derived grants with source lineage
- Revocation must invalidate cached runtime access promptly

# 6. Database

Core entities:

- `role`
- `role_permission`
- `role_hierarchy`
- `role_assignment`
- `role_assignment_history`
- `role_review_record`

Key fields:

- Role code, name, category, owner, risk level, tenant scope
- Permission ID, module family, action type, sensitivity tag
- Assignment source, start date, end date, temporary flag, approver, status
- Review cycle, reviewer, certification outcome, remediation action

# 7. Events

Published events:

- `rbac.role.created`
- `rbac.role.published`
- `rbac.assignment.requested`
- `rbac.assignment.activated`
- `rbac.assignment.revoked`
- `rbac.review.completed`

Consumed events:

- `identity.user_created`
- `identity.user_disabled`
- `sod.conflict_detected`
- `delegation.expired`

# 8. Reports

Required reports:

- User-role assignment report
- High-risk role report
- Temporary access expiry report
- Access certification report
- Role usage and orphan-role report

# 9. Dashboards

Operational dashboards:

- Active assignments by risk category
- Pending high-risk approvals
- Roles due for recertification
- Temporary access nearing expiry
- Top assigned privileged roles

# 10. Security

Security requirements:

- Only trusted administrators may create or assign privileged roles
- Step-up authentication may be required for critical access assignment or use
- Role design and assignment must integrate with ABAC, SoD, and audit controls

# 11. Audit

Audit coverage shall include:

- Role definition creation and change history
- Permission bundle changes
- Assignment, suspension, expiry, and revocation
- Approval evidence and reviewer actions
- Effective-access snapshots during review cycles

# 12. AI

AI-assisted opportunities:

- Recommend least-privilege role based on user job context
- Detect over-permissioned or rarely used access
- Suggest role consolidation where custom roles drift from standards

# 13. Test Cases

Core test scenarios:

- Assign low-risk operational role
- Assign high-risk role through approval path
- Reject assignment due to SoD conflict
- Auto-expire temporary access
- Compute effective access with direct and inherited grants

# 14. Workflows

Primary workflow:

1. Authorized requester identifies access need.
2. System validates role eligibility, scope, and risk.
3. Approval and SoD review run where required.
4. Assignment becomes active and effective access is recalculated.
5. Periodic certification or auto-expiry governs continued access.

# 15. State Machine

Assignment state model:

- `Requested`
- `Pending Approval`
- `Active`
- `Suspended`
- `Expired`
- `Revoked`
- `Rejected`

# 16. Permissions

Representative permissions:

- `rbac.role.create`
- `rbac.role.publish`
- `rbac.assignment.manage`
- `rbac.assignment.view_effective`
- `rbac.review.certify`
- `rbac.audit.view`

# 17. Notifications

Notification scenarios:

- High-risk role approval requested
- Temporary role nearing expiry
- Role certification due
- Role revoked or suspended
- New custom role pending publication

# 18. Configuration

Configurable parameters:

- Role review frequency
- Temporary access duration limits
- Approval thresholds by risk level
- Custom-role boundaries
- Access revocation SLA

# 19. Edge Cases

Important edge cases:

- User already has equivalent access through another role
- Role requested while account is suspended or termination is pending
- Custom role becomes invalid when a permission family is retired
- Effective access changes because inherited parent role is modified
