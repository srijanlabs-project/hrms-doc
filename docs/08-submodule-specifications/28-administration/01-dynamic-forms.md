---
id: HRMS-SUB-28-01
title: Dynamic forms Specification
document: 01-dynamic-forms.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Dynamic Forms governs the configuration-driven creation, rendering, validation, and lifecycle management of business forms without code changes.

In scope:

- Form designer and schema definition
- Section, field, layout, and behavior configuration
- Rule-driven visibility and validation
- Versioning, deployment, and reuse
- Runtime rendering across employee, manager, HR, and admin experiences

# 2. Business

Dynamic forms reduce product dependency on engineering for every data-capture change and make the platform adaptable to local process, regulatory, and customer-specific needs.

# 3. Functional

The system shall support:

- Form templates with sections, subsections, repeaters, and embedded instructions
- Role and workflow-specific form variants
- Conditional visibility, mandatory logic, calculations, and derived displays
- Reusable field groups and shared components
- Draft, published, retired, and superseded form versions
- Linkage to workflow, document, and approval engines

Validation rules:

- Published forms shall be immutable except through new version creation
- Form logic shall validate before deployment
- Runtime data shall honor field-level permission and masking rules

# 4. UX

The user experience shall provide:

- Form builder with drag-and-drop and property editor
- Preview mode across desktop and mobile
- Runtime forms with clear progress and inline validation
- Localization-aware labels and help text

# 5. API

Representative APIs:

- `POST /api/v1/admin/forms`
- `PATCH /api/v1/admin/forms/{formId}`
- `POST /api/v1/admin/forms/{formId}/publish`
- `GET /api/v1/forms/{formCode}/render`
- `POST /api/v1/forms/{formCode}/submissions`

# 6. Database

Core entities:

- `dynamic_form_definition`
- `dynamic_form_version`
- `dynamic_form_section`
- `dynamic_form_behavior_rule`
- `dynamic_form_submission`

# 7. Events

The platform shall publish:

- `dynamic-form.created`
- `dynamic-form.published`
- `dynamic-form.submitted`
- `dynamic-form.validation-failed`

# 8. Reports

Required reports:

- Form usage report
- Submission completion report
- Form version deployment report
- Validation failure trend report

# 9. Dashboards

Dashboards shall show:

- Active forms by module
- Submission volume and drop-off
- Top validation failures
- Unused or stale forms

# 10. Security

Security controls shall include:

- Admin-only form design access
- Controlled publication approval
- Submission data protected by field security and masking
- Runtime script or unsafe expression prevention

# 11. Audit

The audit trail shall capture:

- Form definition and rule changes
- Version publishing and rollback
- Submission and edit history
- Access to restricted form schemas

# 12. AI

AI capabilities may include:

- Draft form generation from business requirement prompts
- Validation-rule suggestion
- Detection of inconsistent field logic

# 13. Test Cases

- Published form renders correct conditional fields
- Invalid logic blocks publish
- New version does not alter old submission rendering
- Field-level permissions apply at runtime
- Mobile preview matches layout rules

# 14. Workflows

1. Admin designs form.
2. Form is validated and published.
3. Runtime users submit data through workflow.
4. Version history and analytics are maintained.

# 15. State Machine

- `draft`
- `validated`
- `published`
- `retired`
- `superseded`

# 16. Permissions

- Design forms
- Publish forms
- View form submissions
- Manage form versions
- Preview forms

# 17. Notifications

- Publish approval alerts
- Submission-failure notices
- Version deployment confirmations

# 18. Configuration

- Layout components
- Rule engine bindings
- Submission endpoints
- Versioning and approval policy

# 19. Edge Cases

- Field removed in new version but old submissions still require display
- Form used in multiple modules with different workflows
- Localization incomplete at publish time
- Conditional logic creates circular dependency
