---
id: HRMS-SUB-03-05
title: Permissions Specification
document: 05-permissions.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Permissions defines the atomic authorization primitives used by the HRMS platform to control what actions a user, role, service, or delegated context may perform.

In scope:

- Permission catalog design
- Action and resource semantics
- Permission versioning and deprecation
- Mapping readiness for roles and policy engines
- Permission governance and auditability

# 2. Business

Permissions are the lowest controllable action units in the authorization model. Clear permission design is essential for secure product architecture, precise role composition, audit clarity, and maintainable long-term access governance.

Business objectives:

- Create a stable, consistent, and explainable authorization vocabulary
- Reduce ambiguous access design and hidden privilege escalation
- Support product growth without uncontrolled permission proliferation
- Improve security review, audit, and engineering implementation clarity

# 3. Functional

The system shall support:

- Permission definition by module, resource, action, and risk sensitivity
- CRUD-like, workflow, approval, export, administrative, and privileged operation permissions
- Versioned permission catalog with deprecation and replacement handling
- Permission metadata such as display name, technical identifier, risk tier, owner, and default scope expectations
- Compatibility mapping for roles, ABAC policies, SoD rules, and audit reporting

Detailed rules:

- Permission identifiers should remain stable once published and referenced in code or role models
- New permissions must be assessed for overlap, hidden privilege, and SoD impact before publication
- Deprecated permissions should remain traceable for historical audits even after they stop being assignable
- Permission semantics should distinguish view, edit, approve, export, configure, and override actions explicitly
- Sensitive permissions should carry tagging for special review and certification treatment

# 4. UX

Primary screens:

- Permission catalog
- Permission detail and dependency view
- Permission usage explorer
- Deprecation and migration console

UX expectations:

- Security and product users should understand what a permission does from its definition and examples
- Usage views should expose which roles, services, and policies depend on a permission
- Deprecation flows should show migration targets and impact before changes are finalized

# 5. API

Representative APIs:

- `POST /api/v1/access/permissions`
- `PUT /api/v1/access/permissions/{permissionId}`
- `POST /api/v1/access/permissions/{permissionId}/publish`
- `POST /api/v1/access/permissions/{permissionId}/deprecate`
- `GET /api/v1/access/permissions/{permissionId}/usage`
- `GET /api/v1/access/permissions/catalog`

# 6. Database

Core entities:

- `access_permission`
- `access_permission_version`
- `access_permission_usage`
- `access_permission_dependency`
- `access_permission_deprecation_plan`
- `access_permission_risk_tag`

Key fields:

- Permission code, module, resource, action, display label, status
- Risk tier, privileged flag, export flag, override flag, owner
- Version number, publish date, replacement permission, deprecation date
- Role references, policy references, service references, code-path references
- Scope expectation, audit category, SoD family

# 7. Events

Published events:

- `permission.created`
- `permission.published`
- `permission.deprecated`
- `permission.replaced`
- `permission.risk_changed`

Consumed events:

- `role.published`
- `policy.published`
- `sod.rule_updated`
- `code.access_check_registered`

# 8. Reports

Required reports:

- Permission catalog report
- Privileged permission report
- Unused permission report
- Deprecation impact report
- Permission-to-role mapping report

# 9. Dashboards

Operational dashboards:

- Permissions by module and risk
- Newly introduced privileged permissions
- Permissions lacking owner or usage review
- Deprecated permissions still in active use

# 10. Security

Security requirements:

- Permission creation and publication should be limited to security-authorized roles
- Privileged or override permissions should require stronger governance and documentation
- Permission catalog visibility may need partial restriction for highly sensitive security internals

# 11. Audit

Audit coverage shall include:

- Permission creation and definition changes
- Risk-tag changes
- Deprecation and replacement actions
- Usage exports and privileged permission review actions

# 12. AI

AI-assisted opportunities:

- Detect overlapping or redundant permissions
- Recommend clearer permission naming and risk classification
- Flag permissions that likely violate least-privilege design patterns

# 13. Test Cases

Core test scenarios:

- Create and publish permission with valid metadata
- Prevent duplicate or ambiguous permission definition
- Deprecate permission and map usage to replacement
- Flag privileged permission without owner
- Query all role and policy dependencies for a permission

# 14. Workflows

Primary workflow:

1. Security or platform team proposes new permission.
2. Risk, overlap, and dependency analysis is performed.
3. Permission is approved and published.
4. Roles and policies consume the permission.
5. Deprecation or replacement follows controlled migration.

# 15. State Machine

Permission state model:

- `Draft`
- `Under Review`
- `Published`
- `Deprecated`
- `Retired`
- `Rejected`

# 16. Permissions

Representative permissions:

- `permission.create`
- `permission.publish`
- `permission.deprecate`
- `permission.usage.view`
- `permission.risk.manage`
- `permission.audit.view`

# 17. Notifications

Notification scenarios:

- New privileged permission awaiting review
- Permission deprecated with active usage remaining
- Replacement mapping required for retiring permission
- Risk-tier changed on published permission

# 18. Configuration

Configurable parameters:

- Naming conventions
- Risk-tier taxonomy
- Owner requirements
- Deprecation grace periods
- Module and action taxonomies

# 19. Edge Cases

Important edge cases:

- Two modules define semantically overlapping permissions differently
- Deprecated permission remains hardcoded in legacy path
- Replacement permission has broader scope than the original
- Permission is used by machine principals and human roles differently
