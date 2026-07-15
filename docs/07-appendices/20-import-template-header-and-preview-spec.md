---
id: HRMS-APP-20
title: Import Template Header and Preview Specification
document: 20-import-template-header-and-preview-spec.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix defines the exact import-template headers, staging rules, preview behavior, and row-level comment standards for workforce imports.

# 2. Non-Negotiable Import Rules

- every import lands in staging first
- every row receives preview status before any production-table write
- every blocking error and warning must be shown back to the user with row number and column reference
- commit is a separate governed action after preview
- import validation must remain tenant-safe and referentially safe

# 3. Common Preview Output Columns

Every preview grid and exported error file shall include:

| Preview Column | Meaning |
|---|---|
| `__row_no` | original source row number |
| `source_record_key` | source-system or source-file key if provided |
| `preview_status` | `clean`, `warning`, `blocked`, `corrected`, or `commit-ready` |
| `error_count` | number of blocking issues on row |
| `warning_count` | number of warnings on row |
| `comment_summary` | short aggregated message for row |
| `field_comment_map` | field-level structured comments returned by API |

# 4. Exact Template Headers

## 4.1 `IMP-EMP-001` Employee Master Import

Exact headers:

`tenant_code`, `global_user_id`, `org_user_id`, `employee_code`, `legal_name`, `preferred_name`, `family_name`, `personal_email`, `primary_mobile_number`, `date_of_birth`, `date_of_joining`, `marital_status`, `marriage_date`, `country_code`, `state_code`, `city_code`, `postal_code`, `manager_employee_code`, `business_timezone`, `login_status`, `source_record_key`

## 4.2 `IMP-ID-001` Employee Identity Import

Exact headers:

`tenant_code`, `employee_code`, `country_code`, `pan_number`, `aadhaar_number`, `passport_number`, `passport_issue_date`, `passport_expiry_date`, `document_status`, `source_record_key`

## 4.3 `IMP-DEP-001` Employee Dependents Import

Exact headers:

`tenant_code`, `employee_code`, `relationship_type`, `dependent_name`, `dependent_date_of_birth`, `birth_context`, `country_code`, `source_record_key`

## 4.4 `IMP-BANK-001` Employee Bank Accounts Import

Exact headers:

`tenant_code`, `employee_code`, `account_holder_name`, `bank_account_number`, `bank_routing_code`, `country_code`, `allocation_percent`, `allocation_amount`, `bank_change_effective_from`, `source_record_key`

## 4.5 `IMP-PF-001` Employee PF Enrollment Import

Exact headers:

`tenant_code`, `employee_code`, `uan_number`, `legal_entity_id`, `effective_from`, `source_record_key`

## 4.6 `IMP-DOC-001` Employee Document Manifest Import

Exact headers:

`tenant_code`, `employee_code`, `document_type`, `file_name_original`, `file_mime_type`, `file_size_bytes`, `document_status`, `source_record_key`

# 5. Error Comment Standard

## 5.1 Comment Shape

Each row-level comment shall contain:

- `severity`: `block` or `warn`
- `field`
- `fieldRef`
- `ruleRef`
- `message`
- `suggestedAction`

## 5.2 Example

```json
{
  "severity": "block",
  "field": "date_of_birth",
  "fieldRef": "FLD-039",
  "ruleRef": "VAL-010",
  "message": "Employee age falls outside configured working-age policy.",
  "suggestedAction": "Correct DOB or route governed exception approval."
}
```

# 6. Commit Gate Rules

- any row with `preview_status = blocked` cannot commit
- warning-only rows may commit only if customer policy allows warning-mode commit
- commits must carry commit batch id plus actor idempotency token
- preview results expire when dependent master data or target record version changes materially

# 7. Immediate Follow-On Use

This appendix should drive:

- downloadable import templates
- import preview UI
- row-level API validation responses
- implementation and migration QA
