---
id: HRMS-SUB-00-01
title: Configuration framework Specification
document: 01-configuration-framework.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Configuration Framework governs how configurable platform behavior is defined, stored, validated, promoted, and consumed across the enterprise HRMS.

In scope:

- Hierarchical configuration model
- Scope resolution by tenant, module, locale, and environment
- Versioning, approval, and promotion
- Runtime access and caching
- Safety controls, observability, and rollback

# 2. Business

The configuration framework allows the platform to adapt without frequent code change. It is the operational control layer for safe enterprise variability across customers, countries, and processes.

# 3. Functional

The system shall support:

- Configuration definitions with key, type, description, owner, risk class, and allowed scope
- Scope precedence such as global, tenant, module, country, business unit, and environment
- Runtime resolution returning effective value and lineage
- Draft, approved, scheduled, active, and retired configuration states
- Validation rules, default values, dependencies, and deprecation markers
- Promotion workflows from lower environments to production
- Bulk export and import of configuration packages

Validation rules:

- Invalid type or range values shall be rejected before activation
- High-risk configuration shall require approval and impact acknowledgment
- Circular dependency between configuration values shall be prevented
- Consumers shall receive deterministic fallback behavior when scoped overrides are absent

# 4. UX

The user experience shall provide:

- Searchable configuration catalog
- Side-by-side scope comparison
- Change preview and impact notes before publish
- History and rollback view with actor and timestamp

# 5. API

Representative APIs:

- `GET /api/v1/platform/config/definitions`
- `GET /api/v1/platform/config/effective`
- `POST /api/v1/platform/config/changes`
- `POST /api/v1/platform/config/promotions`
- `POST /api/v1/platform/config/rollback`

# 6. Database

Core entities:

- `config_definition`
- `config_value`
- `config_scope_binding`
- `config_change_request`
- `config_promotion_log`

# 7. Events

The platform shall publish:

- `config.definition.created`
- `config.change.approved`
- `config.change.activated`
- `config.change.rolled-back`
- `config.validation.failed`

# 8. Reports

Required reports:

- Configuration change report
- Scope override inventory
- Failed validation report
- Environment drift report

# 9. Dashboards

Dashboards shall show:

- Recent high-risk changes
- Drift across environments
- Pending approvals
- Rollback frequency and failure rate

# 10. Security

Security controls shall include:

- Fine-grained edit permissions by configuration domain
- Secret-like values protected and masked
- Approval segregation for production changes
- Immutable evidence of critical configuration history

# 11. Audit

The audit trail shall capture:

- Definition and value changes
- Scope changes
- Promotions and rollbacks
- Access to restricted configuration entries

# 12. AI

AI capabilities may include:

- Conflict detection between planned configuration changes
- Suggested defaults from prior tenant patterns
- Risk explanation for high-impact changes

# 13. Test Cases

- Scoped override resolves correctly against global default
- Invalid value fails before activation
- Rollback restores prior effective state
- Secret configuration is masked in UI and API
- Promotion package preserves definition lineage

# 14. Workflows

1. Admin creates or edits configuration.
2. Validation and approval occur.
3. Change is activated or scheduled.
4. Runtime services consume effective configuration.
5. Monitoring and rollback remain available.

# 15. State Machine

- `draft`
- `pending-approval`
- `approved`
- `scheduled`
- `active`
- `retired`
- `rolled-back`

# 16. Permissions

- Create configuration definition
- Edit configuration values
- Approve configuration changes
- Promote configuration
- Roll back configuration

# 17. Notifications

- Approval-task alerts
- Activation confirmations
- Validation failure notices
- Drift and rollback alerts

# 18. Configuration

- Scope hierarchy
- Risk classes
- Promotion paths
- Fallback and cache policies

# 19. Edge Cases

- Tenant override conflicts with country override
- Consumer service reads stale cached value during change window
- Deprecated configuration still used by legacy module
- Emergency rollback needed during payroll close
