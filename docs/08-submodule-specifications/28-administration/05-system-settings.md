---
id: HRMS-SUB-28-05
title: System settings Specification
document: 05-system-settings.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

System Settings governs centrally managed platform configuration values that affect behavior, thresholds, feature availability, and operational defaults.

In scope:

- Global and scoped settings
- Feature toggles and behavior flags
- Default values and thresholds
- Change approval and rollout
- Impact tracking and auditability

# 2. Business

System settings allow controlled platform behavior changes without code deployment. They are powerful and risky, so they must be structured, reviewable, and safe for enterprise operations.

# 3. Functional

The system shall support:

- Global, tenant, module, country, and environment-scoped settings
- Setting types such as boolean, numeric, string, JSON, enum, and reference key
- Effective-dated and immediate settings
- Feature toggles, thresholds, cut-off times, and operational defaults
- Setting dependency and validation rules
- Approval workflow for high-impact changes

Validation rules:

- Setting values shall be validated by type and allowed range
- High-risk settings shall require review before activation
- Runtime consumers shall handle missing or deprecated settings safely

# 4. UX

The user experience shall provide:

- Settings catalog with search and classification
- Safe edit experience with impact notes and preview
- Environment and scope comparison views
- Change-history and rollback view

# 5. API

Representative APIs:

- `GET /api/v1/admin/system-settings`
- `PATCH /api/v1/admin/system-settings/{settingKey}`
- `POST /api/v1/admin/system-settings/{settingKey}/promote`
- `GET /api/v1/runtime/system-settings/{settingKey}`

# 6. Database

Core entities:

- `system_setting_definition`
- `system_setting_value`
- `system_setting_change_request`
- `system_setting_audit_log`

# 7. Events

The platform shall publish:

- `system-setting.updated`
- `system-setting.change-approved`
- `system-setting.rollback-executed`
- `system-setting.validation-failed`

# 8. Reports

Required reports:

- Setting change report
- Feature-toggle inventory report
- Environment drift report
- Failed setting update report

# 9. Dashboards

Dashboards shall show:

- Recent high-risk setting changes
- Toggle adoption and usage
- Environment consistency status
- Pending approvals

# 10. Security

Security controls shall include:

- Restricted admin rights for setting categories
- Approval and segregation for high-risk changes
- Protection against secret values leaking through UI or logs

# 11. Audit

The audit trail shall capture:

- Setting changes and prior values
- Approval decisions
- Runtime scope overrides
- Rollback execution history

# 12. AI

AI capabilities may include:

- Detection of conflicting settings
- Impact explanation for proposed changes
- Drift-risk prioritization

# 13. Test Cases

- Invalid setting value is rejected
- Scoped setting overrides global correctly
- Rollback restores prior setting state
- Secret setting is never exposed in plain text
- High-risk setting requires approval

# 14. Workflows

1. Admin proposes setting change.
2. Validation and approval run.
3. Setting is activated in target scope.
4. Monitoring and rollback remain available.

# 15. State Machine

- `draft`
- `pending-approval`
- `active`
- `superseded`
- `rolled-back`
- `retired`

# 16. Permissions

- View system settings
- Edit low-risk settings
- Approve high-risk settings
- Roll back setting changes
- View hidden or secret settings

# 17. Notifications

- Approval task alerts
- High-risk change confirmations
- Rollback and failure alerts

# 18. Configuration

- Setting catalog
- Risk classifications
- Scope hierarchy
- Promotion and rollback rules

# 19. Edge Cases

- Setting changed during payroll run
- Tenant override conflicts with global default
- Deprecated setting still consumed by legacy integration
- Runtime cache delay causes temporary inconsistency
