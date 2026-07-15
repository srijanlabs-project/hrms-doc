---
id: HRMS-SUB-28-03
title: Dynamic masters Specification
document: 03-dynamic-masters.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Dynamic Masters governs configurable reference lists, taxonomies, and lookup datasets used across HRMS modules.

In scope:

- Lookup and reference-data definition
- Hierarchical and flat master datasets
- Effective dating, status, and translations
- Controlled consumption by forms, rules, and APIs
- Governance and change impact management

# 2. Business

Dynamic masters reduce hard-coded lists and allow enterprises to manage country-, customer-, or process-specific reference data centrally.

# 3. Functional

The system shall support:

- Flat and hierarchical master types
- Code, label, description, locale, status, and effective-date metadata
- Relationships between master values
- Use in forms, rules, reports, and integrations
- Version-safe retirement and replacement of values

Validation rules:

- Code uniqueness shall be enforced within master scope
- In-use value retirement shall require replacement or controlled exception
- Hierarchy loops shall be prevented

# 4. UX

The user experience shall provide:

- Master-data management console
- Table and tree management views
- Bulk import and export
- Usage-impact preview before changes

# 5. API

Representative APIs:

- `POST /api/v1/admin/masters`
- `POST /api/v1/admin/masters/{masterId}/values`
- `PATCH /api/v1/admin/master-values/{valueId}`
- `GET /api/v1/reference/masters/{masterCode}`

# 6. Database

Core entities:

- `dynamic_master_definition`
- `dynamic_master_value`
- `dynamic_master_relation`
- `dynamic_master_usage_map`

# 7. Events

The platform shall publish:

- `dynamic-master.created`
- `dynamic-master.value-added`
- `dynamic-master.value-retired`
- `dynamic-master.import-completed`

# 8. Reports

Required reports:

- Master-data inventory report
- Retired-but-in-use value report
- Translation completeness report
- Master change audit report

# 9. Dashboards

Dashboards shall show:

- Active masters by module
- Pending master changes
- High-usage reference sets
- Data-quality issues in master catalog

# 10. Security

Security controls shall include:

- Restricted admin rights for master changes
- Controlled bulk-import execution
- Separation between production and lower-environment master governance

# 11. Audit

The audit trail shall capture:

- Value add, edit, retire, and replace actions
- Bulk import lineage
- Usage-impact reviews
- Translation and locale changes

# 12. AI

AI capabilities may include:

- Suggestion of duplicate or overlapping master values
- Mapping recommendations during bulk import cleanup
- Usage anomaly detection

# 13. Test Cases

- Duplicate code is blocked
- Retiring in-use master value requires replacement path
- Hierarchy loop is rejected
- API returns locale-appropriate label
- Bulk import preserves audit lineage

# 14. Workflows

1. Admin defines master set.
2. Values are added and validated.
3. Master is consumed across modules.
4. Changes are monitored for downstream impact.

# 15. State Machine

- `draft`
- `active`
- `deprecated`
- `retired`
- `archived`

# 16. Permissions

- Manage master definitions
- Manage master values
- Bulk import master values
- View usage impact
- Export master data

# 17. Notifications

- Pending change approval alerts
- In-use retirement warnings
- Bulk import completion notices

# 18. Configuration

- Master types
- Locale support
- Effective-date behavior
- Usage enforcement rules

# 19. Edge Cases

- Master value merged with another code
- Same label exists across locales with different semantics
- Hierarchical master consumed by external integration requiring flat export
- Master change during active workflow transaction
