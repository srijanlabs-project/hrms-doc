---
id: HRMS-SUB-00-02
title: Metadata framework Specification
document: 02-metadata-framework.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Metadata Framework governs the structured definitions that describe entities, fields, relationships, rules, and presentation behavior used across the HRMS platform.

In scope:

- Canonical metadata model
- Entity and field descriptors
- Relationship and schema annotations
- Runtime discovery and versioning
- Governance of metadata changes

# 2. Business

The metadata framework is the platform contract that allows dynamic behavior across forms, integrations, analytics, validation, and admin tooling while preserving consistency.

# 3. Functional

The system shall support:

- Metadata for entities, fields, types, validation, labels, privacy class, and searchability
- Relationship descriptors for one-to-one, one-to-many, and hierarchical links
- Enumerations, lookup bindings, and calculated field definitions
- Versioned metadata publication for runtime consumers
- Queryable metadata registry for UI, API, integration, and analytics services
- Extension hooks for tenant or module customization

Validation rules:

- Published metadata shall preserve backward-compatibility rules or declare breaking change explicitly
- Duplicate field identifiers inside entity scope shall be rejected
- Runtime consumers shall receive version-stable metadata contracts
- Sensitive classification shall be mandatory for protected field types

# 4. UX

The user experience shall provide:

- Metadata explorer with entity and field drill-down
- Change-diff view between metadata versions
- Dependency map showing impacted modules and forms
- Search and filter by domain, status, and data class

# 5. API

Representative APIs:

- `GET /api/v1/platform/metadata/entities`
- `GET /api/v1/platform/metadata/entities/{entityCode}`
- `POST /api/v1/platform/metadata/publish`
- `GET /api/v1/platform/metadata/versions/{versionId}`

# 6. Database

Core entities:

- `metadata_entity`
- `metadata_field`
- `metadata_relation`
- `metadata_version`
- `metadata_dependency_map`

# 7. Events

The platform shall publish:

- `metadata.entity.created`
- `metadata.version.published`
- `metadata.breaking-change.detected`
- `metadata.dependency.impacted`

# 8. Reports

Required reports:

- Metadata inventory report
- Breaking-change report
- Sensitive-field classification report
- Metadata dependency report

# 9. Dashboards

Dashboards shall show:

- Entities by status
- Recent metadata publications
- Dependency-risk hotspots
- Classification completeness

# 10. Security

Security controls shall include:

- Restricted metadata edit and publish rights
- Separation between discoverable public metadata and privileged internal metadata
- Protection of internal-only annotations

# 11. Audit

The audit trail shall capture:

- Metadata edits and publication
- Classification changes
- Dependency recalculation results
- Access to restricted metadata domains

# 12. AI

AI capabilities may include:

- Suggestion of field classification and descriptions
- Detection of duplicate semantics across entities
- Impact summaries for proposed metadata changes

# 13. Test Cases

- Duplicate field key is rejected
- Published metadata version remains stable for consumers
- Breaking-change warning appears when field contract changes incompatibly
- Sensitive classification is required for protected types
- Dependency map updates after relation change

# 14. Workflows

1. Metadata is created or updated.
2. Validation and impact analysis run.
3. New version is published.
4. Runtime consumers retrieve stable metadata.

# 15. State Machine

- `draft`
- `validated`
- `published`
- `deprecated`
- `retired`

# 16. Permissions

- Edit metadata
- Publish metadata
- View dependency maps
- View restricted classifications
- Export metadata catalog

# 17. Notifications

- Publish approval alerts
- Breaking-change warnings
- Dependency impact notifications

# 18. Configuration

- Versioning policy
- Naming conventions
- Compatibility rules
- Metadata exposure scopes

# 19. Edge Cases

- Tenant extension conflicts with core entity field
- Published metadata requires rollback after consumer failure
- One field needs different labels but same semantics across modules
- Legacy integration expects retired field name
