---
id: HRMS-SUB-29-03
title: Data masking Specification
document: 03-data-masking.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Data Masking governs dynamic and static masking controls used to limit exposure of sensitive HRMS data to only what is necessary for a user or system function.

In scope:

- Field-level masking rules
- Role, purpose, and context-aware unmasking
- Dynamic masking in UI, API, report, and export layers
- Audit of masked and unmasked access
- Compliance with privacy and data-minimization policies

# 2. Business

HRMS platforms handle personal, financial, identity, medical, and disciplinary data. Data masking is the control layer that allows broad operational use of the platform without broadly exposing the most sensitive values.

# 3. Functional

The system shall support:

- Masking by field, record type, module, report, and export channel
- Partial masking, token display, full suppression, and conditional reveal patterns
- Unmask rights based on role, approval, context, or just-in-time reason capture
- Policy distinctions between view, download, export, print, and API access
- Masking inheritance into dashboards, custom reports, audit views, and integrations
- Country or jurisdiction-specific masking obligations

Validation rules:

- Masked fields shall remain masked consistently across UI, API, and export surfaces
- Unmask access shall be time-bound or reason-bound where configured
- Derived fields shall not unintentionally reveal masked source values

# 4. UX

The user experience shall provide:

- Clear masked-value rendering conventions
- Explicit reveal actions where permitted
- Reason capture for sensitive reveals where policy requires
- Visual warnings when exports contain masked or suppressed values

# 5. API

Representative APIs:

- `GET /api/v1/security/masking-policies`
- `POST /api/v1/security/masking-policies`
- `POST /api/v1/security/unmask-requests`
- `GET /api/v1/security/masked-field-preview`

# 6. Database

Core entities:

- `masking_policy`
- `masking_field_rule`
- `unmask_request`
- `masked_access_log`

# 7. Events

The platform shall publish:

- `masking-policy.updated`
- `sensitive-field.unmasked`
- `masked-export.generated`
- `unmask-request.denied`

# 8. Reports

Required reports:

- Sensitive-field access report
- Unmask request report
- Masking-policy coverage report
- Export exposure report

# 9. Dashboards

Dashboards shall show:

- Unmask request volume
- Sensitive-access hotspots
- Policy coverage by module
- Failed masking-rule incidents

# 10. Security

Security controls shall include:

- Centralized masking policy enforcement
- Tight logging of full-value exposure
- Suppression of masked data in caches and downstream logs
- Strong controls on privileged support access

# 11. Audit

The audit trail shall capture:

- Policy changes
- Every unmask event
- Export or report generation including masked fields
- Failed policy-enforcement incidents

# 12. AI

AI capabilities may include:

- Detection of fields that likely require masking based on data classification
- Monitoring for suspicious unmask patterns
- Suggestions to tighten inconsistent masking policies

# 13. Test Cases

- Unauthorized role sees masked identifier
- Authorized reveal requires reason capture
- Export keeps masked value when full access absent
- API response does not leak masked source in metadata
- Derived display field does not reveal hidden full value

# 14. Workflows

1. Data classification and role context are evaluated.
2. Masking policy is applied at render or extract time.
3. Unmask request is optionally approved.
4. Access is logged and monitored.

# 15. State Machine

- `configured`
- `active`
- `override-requested`
- `temporarily-unmasked`
- `expired`

# 16. Permissions

- Manage masking policies
- View masked fields
- Request unmask access
- Approve unmask access
- Audit sensitive access

# 17. Notifications

- Unmask approval requests
- Sensitive-access anomaly alerts
- Policy-change notifications

# 18. Configuration

- Field classifications
- Masking patterns
- Unmask approval rules
- Export masking behavior

# 19. Edge Cases

- Small data combination reveals identity despite masked fields
- Full value visible in one module but not another
- Support user needs temporary access during payroll incident
- Masked field used in downstream integration requiring token instead of clear text
