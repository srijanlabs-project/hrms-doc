---
id: HRMS-SUB-28-02
title: Dynamic fields Specification
document: 02-dynamic-fields.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Dynamic Fields governs configurable field creation and metadata-driven extension of core data models without hard-coded schema changes in business modules.

In scope:

- Custom field definitions
- Data type, validation, and dependency rules
- Module and object attachment
- Runtime rendering and API exposure
- Governance of custom-data extensions

# 2. Business

Dynamic fields allow enterprises to extend the HRMS for local, industry, or customer-specific needs while preserving a shared product baseline.

# 3. Functional

The system shall support:

- Field types such as text, number, date, lookup, currency, file, boolean, and structured select
- Attachment of fields to supported entities such as employee, requisition, document, or request
- Validation rules, defaults, dependencies, and effective-dated activation
- Searchability, reportability, and API inclusion settings
- Lifecycle states for draft, active, hidden, and retired custom fields

Validation rules:

- Field names and API keys shall be unique within object scope
- Incompatible field-type changes after activation shall be blocked
- Required custom fields shall not break historical records when introduced midstream

# 4. UX

The user experience shall provide:

- Custom-field builder with metadata and validation controls
- Preview within target forms and records
- Visibility controls by role and population
- Warnings for breaking changes

# 5. API

Representative APIs:

- `POST /api/v1/admin/dynamic-fields`
- `PATCH /api/v1/admin/dynamic-fields/{fieldId}`
- `POST /api/v1/admin/dynamic-fields/{fieldId}/activate`
- `GET /api/v1/admin/dynamic-fields/{entityCode}`

# 6. Database

Core entities:

- `dynamic_field_definition`
- `dynamic_field_validation_rule`
- `dynamic_field_entity_binding`
- `dynamic_field_value`

# 7. Events

The platform shall publish:

- `dynamic-field.created`
- `dynamic-field.activated`
- `dynamic-field.retired`
- `dynamic-field.value-updated`

# 8. Reports

Required reports:

- Custom-field inventory
- Unused custom-field report
- Breaking-change risk report
- Custom-field value completeness report

# 9. Dashboards

Dashboards shall show:

- Active custom fields by module
- Fields missing translations or validation
- Fields with high null rate
- Recent field changes

# 10. Security

Security controls shall include:

- Controlled admin rights to create and activate fields
- Field-level permissions and masking inheritance
- Restriction on exposing custom fields in public APIs without approval

# 11. Audit

The audit trail shall capture:

- Definition changes
- Activation and retirement actions
- Field-value mass updates
- Visibility or masking rule changes

# 12. AI

AI capabilities may include:

- Suggestion of field type and validation from business description
- Detection of redundant custom fields
- Mapping assistance to standard fields

# 13. Test Cases

- Duplicate API key is blocked
- Field retirement preserves historical values
- Role-based field visibility applies in UI and API
- Required custom field introduced mid-cycle behaves safely
- Search index updates after field activation

# 14. Workflows

1. Admin defines custom field.
2. Field is validated and bound to entity.
3. Field is activated and rendered at runtime.
4. Values are captured and governed.

# 15. State Machine

- `draft`
- `validated`
- `active`
- `hidden`
- `retired`

# 16. Permissions

- Create custom field
- Activate custom field
- Bind field to entity
- View custom field values
- Manage field visibility

# 17. Notifications

- Activation approval notices
- Breaking-change warnings
- Missing configuration reminders

# 18. Configuration

- Supported field types
- Search and reporting flags
- Field governance policy
- API exposure rules

# 19. Edge Cases

- Same field concept already exists as standard field
- Lookup source is retired after field activation
- Custom field added to very high-volume entity
- Historical records lack required value after activation
