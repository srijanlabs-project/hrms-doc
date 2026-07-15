---
id: HRMS-APP-21
title: DTO Field Schema Catalog
document: 21-dto-field-schema-catalog.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix defines canonical field-level DTO schemas for the highest-risk people, identity, bank, document, and import payloads.

# 2. Schema Conventions

- required means required in the canonical payload family, subject to lifecycle or country conditions
- validation references point to authoritative `Rule Ref` values
- field names should be preserved across backend DTOs and frontend typed request models where feasible

# 3. DTO Schemas

## 3.1 `DTO-EMP-PER-001` EmployeePersonalInfoUpsertPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `legal_name` | `FLD-031` | string | Yes | `VAL-001`, `VAL-002`, `VAL-003`, `VAL-040` | normalized before persistence |
| `preferred_name` | `FLD-032` | string | No | `VAL-001`, `VAL-002` | optional display name |
| `family_name` | `FLD-033` | string | No | `VAL-001`, `VAL-002` | naming-model dependent |
| `date_of_birth` | `FLD-039` | date | Yes by policy | `VAL-009`, `VAL-010`, `VAL-013`, `VAL-014` | true date retained |
| `marital_status` | `FLD-042` | enum | No | `VAL-016`, `VAL-034` | closed enum only |
| `marriage_date` | `FLD-041` | date | No | `VAL-015`, `VAL-016` | legal-age and consistency checks |
| `notes` | `FLD-034` | string | No | `VAL-004` | sanitized long text |

## 3.2 `DTO-EMP-CON-001` EmployeeContactInfoUpsertPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `primary_mobile_number` | `FLD-035` | string | No | `VAL-005`, `VAL-006`, `VAL-040` | pending until OTP success |
| `personal_email` | `FLD-038` | string | No | `VAL-008` | uniqueness policy may vary |
| `country_code` | `FLD-069` | string | Yes where address exists | `VAL-027`, `VAL-028` | selects validation profile |
| `state_code` | `FLD-053` | string | No | `VAL-028` | master-data assisted |
| `city_code` | `FLD-054` | string | No | `VAL-028` | master-data assisted |
| `postal_code` | `FLD-052` | string | No | `VAL-027`, `VAL-028` | country-aware format |
| `business_timezone` | `FLD-076` | string | No | `VAL-042` | boundary-sensitive flows |
| `emergency_contact_phone` | `FLD-055` | string | No | `VAL-029` | same phone normalization model |

## 3.3 `DTO-EMP-MOB-OTP-001` EmployeeMobileOtpRequestPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `pending_mobile_number` | `FLD-070` | string | Yes | `VAL-005`, `VAL-006` | staged untrusted mobile |
| `action_idempotency_token` | `FLD-077` | string | Yes | `VAL-043` | protects request replay |

## 3.4 `DTO-EMP-MOB-OTP-002` EmployeeMobileOtpVerifyPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `pending_mobile_number` | `FLD-070` | string | Yes | `VAL-006` | must match staged value |
| `otp_code` | n/a | string | Yes | `VAL-007` | masked in logs |
| `mobile_otp_verification_status` | `FLD-036` | enum | Yes | `VAL-006`, `VAL-007`, `VAL-034` | set to trusted only on success |
| `mobile_otp_verified_at` | `FLD-037` | datetime | No | `VAL-007` | server assigned on success |
| `action_idempotency_token` | `FLD-077` | string | Yes | `VAL-043` | replay-safe verify command |

## 3.5 `DTO-EMP-ID-001` EmployeeNationalIdentityUpsertPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `country_code` | `FLD-069` | string | Yes | `VAL-023`, `VAL-027` | drives identity profile |
| `pan_number` | `FLD-046` | string | No | `VAL-020` | uppercase normalized |
| `aadhaar_number` | `FLD-047` | string | No | `VAL-021`, `VAL-022` | masking and storage policy apply |
| `passport_number` | `FLD-048` | string | No | `VAL-023` | issuing-country format |
| `passport_issue_date` | `FLD-049` | date | No | `VAL-024` | paired with expiry |
| `passport_expiry_date` | `FLD-050` | date | No | `VAL-024` | cannot be active when expired |
| `document_status` | `FLD-067` | enum | Yes where document exists | `VAL-024`, `VAL-034` | state-bound document handling |

## 3.6 `DTO-EMP-DEP-001` EmployeeDependentUpsertPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `relationship_type` | `FLD-043` | enum | Yes | `VAL-019`, `VAL-034` | closed list only |
| `dependent_date_of_birth` | `FLD-044` | date | Yes | `VAL-017`, `VAL-018`, `VAL-019` | family plausibility checks |
| `birth_context` | `FLD-045` | enum | No | `VAL-018` | supports exception paths |

## 3.7 `DTO-EMP-BANK-001` EmployeeBankAccountUpsertPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `account_holder_name` | `FLD-068` | string | Yes | `VAL-001`, `VAL-002` | owner mismatch may escalate |
| `bank_account_number` | `FLD-056` | string | Yes | `VAL-030` | masked in non-privileged responses |
| `bank_routing_code` | `FLD-057` | string | Yes | `VAL-031` | rail-specific validation |
| `country_code` | `FLD-069` | string | Yes | `VAL-031` | selects banking profile |
| `allocation_percent` | `FLD-059` | decimal | No | `VAL-033` | grouped total rules apply |
| `currency_amount` | `FLD-058` | decimal | No | `VAL-032` | non-negative and sane range |
| `bank_change_effective_from` | `FLD-061` | date | No | `VAL-042` | payroll cutoff aware |

## 3.8 `DTO-EMP-PF-001` EmployeePfEnrollmentPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `uan_number` | `FLD-051` | string | Yes by applicability | `VAL-025`, `VAL-026` | exact 12 digits |
| `legal_entity_id` | `FLD-006` | string | Yes | `VAL-037` | statutory context required |
| `effective_from` | `FLD-013` | date | Yes | `VAL-037` | mandatory before approval |

## 3.9 `DTO-DOC-UPL-001` DocumentUploadPayload

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `file_name_original` | `FLD-064` | string | Yes | `VAL-038` | sanitized before storage |
| `file_mime_type` | `FLD-062` | string | Yes | `VAL-038` | allowlist only |
| `file_size_bytes` | `FLD-063` | integer | Yes | `VAL-038`, `VAL-048` | size enforced server-side |
| `document_status` | `FLD-067` | enum | No | `VAL-034` | initial lifecycle status |

## 3.10 `DTO-IMP-EMP-001` EmployeeMasterImportRow

| Field | Field Ref | Type | Required | Validation Refs | Notes |
|---|---|---|---|---|---|
| `tenant_code` | `FLD-002` | string | Yes | `VAL-046` | boundary anchor |
| `global_user_id` | `FLD-071` | string | No | `VAL-047` | provider identity if pre-seeded |
| `org_user_id` | `FLD-072` | string | No | `VAL-047` | tenant-local identity |
| `employee_code` | `FLD-060` | string | Yes | `VAL-035` | tenant-scoped uniqueness |
| `legal_name` | `FLD-031` | string | Yes | `VAL-001`, `VAL-002`, `VAL-003` | |
| `date_of_birth` | `FLD-039` | date | Yes by policy | `VAL-009`, `VAL-010`, `VAL-013`, `VAL-014` | |
| `date_of_joining` | `FLD-040` | date | Yes | `VAL-011`, `VAL-012` | |
| `preview_status` | `FLD-080` | enum | server-generated | `VAL-049` | preview only, not source-authored |

# 4. Immediate Follow-On Use

This appendix should drive:

- backend DTO implementation
- OpenAPI request schema generation
- frontend typed form models
- QA request-payload validation tests
