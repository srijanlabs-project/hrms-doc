---
id: HRMS-SUB-31-01
title: Bulk import Specification
document: 01-bulk-import.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Bulk Import governs high-volume structured data loading into HRMS entities through governed templates, APIs, or staged files.

In scope:

- Import template design
- Staging, validation, and commit flow
- Error handling and partial success policy
- Audit and rollback support
- Security and operational guardrails

# 2. Business

Bulk import is essential for implementation, mass updates, acquisitions, and operational corrections. It must be fast enough for enterprise volume and safe enough to avoid widespread data corruption.

# 3. Functional

The system shall support:

- Imports for employee, org, master, compensation, and transactional data where allowed
- Template-based and API-based ingestion
- Staging area with row-level validation, preview, and correction
- Full-load, delta-load, and upsert behavior by object type
- Batch tracking, resumability, and result download

Validation rules:

- Referential integrity shall be checked before commit
- Duplicate or conflicting rows shall follow configured resolution policy
- Sensitive fields shall obey import authorization and masking rules

# 4. UX

The user experience shall provide:

- Import wizard and template download
- Row-level validation feedback
- Progress tracking and commit confirmation
- Error export for correction and rerun

# 5. API

Representative APIs:

- `POST /api/v1/implementation/imports`
- `GET /api/v1/implementation/imports/{importId}`
- `POST /api/v1/implementation/imports/{importId}/validate`
- `POST /api/v1/implementation/imports/{importId}/commit`

# 6. Database

Core entities:

- `bulk_import_job`
- `bulk_import_row`
- `bulk_import_error`
- `bulk_import_commit_log`

# 7. Events

The platform shall publish:

- `bulk-import.uploaded`
- `bulk-import.validated`
- `bulk-import.committed`
- `bulk-import.failed`

# 8. Reports

Required reports:

- Import success report
- Validation error report
- Commit audit report
- High-volume import performance report

# 9. Dashboards

Dashboards shall show:

- Open import jobs
- Validation failure trends
- Commit throughput
- Import volume by entity

# 10. Security

Security controls shall include:

- Restricted import permissions by entity type
- Secure file storage and malware scanning
- Sensitive-column masking in preview where applicable
- Controlled commit authority

# 11. Audit

The audit trail shall capture:

- Import file upload
- Validation and commit actions
- Row-level correction and retry
- Result-download access

# 12. AI

AI capabilities may include:

- Template mapping suggestions
- Error clustering
- Data-quality remediation hints

# 13. Test Cases

- Referential integrity failure blocks commit
- Duplicate-row policy behaves correctly
- Partial validation errors export accurately
- Commit audit captures imported row counts
- Unauthorized user cannot import sensitive entity

# 14. Workflows

1. User prepares import template.
2. File is uploaded and validated.
3. Errors are corrected or accepted per policy.
4. Data is committed and audited.

# 15. State Machine

- `uploaded`
- `validating`
- `validated`
- `committed`
- `failed`
- `archived`

# 16. Permissions

- Upload import file
- Validate import
- Commit import
- View import results
- Download error report

# 17. Notifications

- Validation complete notices
- Commit completion notices
- Failure alerts

# 18. Configuration

- Import templates
- Duplicate handling rules
- Commit thresholds
- Entity-specific validations

# 19. Edge Cases

- Import spans dependent entities with partial ordering issues
- Same employee appears in multiple rows with conflicting updates
- Very large file exceeds synchronous validation window
- Commit interrupted mid-run
