---
id: HRMS-APP-23
title: OpenAPI-ready Contract Starter Pack
document: 23-openapi-ready-contract-starter-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix converts the API registry, DTO catalog, error schema, and validation mappings into an OpenAPI-ready contract starter pack.

It is intended to remove ambiguity for backend engineering, frontend engineering, QA, and architecture teams before full service-by-service OpenAPI files are generated.

# 2. Scope Note

This `v1` starter pack does not yet cover every endpoint in the full platform.

It prioritizes:

- common request and response conventions
- security, tenant, idempotency, and concurrency headers
- canonical pagination and filtering patterns
- high-risk people and import endpoints that are likely to be implemented early

# 3. Required Contract Building Blocks

This appendix should be used together with:

- [08-api-registry-and-contract-index.md](D:/HRMS-doc/docs/07-appendices/08-api-registry-and-contract-index.md)
- [17-error-payload-schema-and-recovery-patterns.md](D:/HRMS-doc/docs/07-appendices/17-error-payload-schema-and-recovery-patterns.md)
- [21-dto-field-schema-catalog.md](D:/HRMS-doc/docs/07-appendices/21-dto-field-schema-catalog.md)
- [19-validation-rule-implementation-traceability-matrix.md](D:/HRMS-doc/docs/07-appendices/19-validation-rule-implementation-traceability-matrix.md)

# 4. Standard Request Headers

| Header | Required | Applies To | Meaning |
|---|---|---|---|
| `Authorization` | Yes | all authenticated APIs | bearer token carrying user or service identity |
| `X-Correlation-Id` | Yes | all APIs | end-to-end trace identifier |
| `X-Tenant-Code` | Yes except provider-only endpoints | tenant-scoped APIs | resolved tenant context for routing and safety checks |
| `Idempotency-Key` | Required on command-style create or action APIs | create, submit, approve, commit, replay-safe actions | protects against duplicate submit or retry |
| `If-Match` | Required on optimistic-lock aware patch APIs | patch and stateful mutations | resource version or ETag expected by caller |
| `X-Timezone` | Recommended where date-boundary logic matters | leave, attendance, cutoffs, imports | explicit business timezone hint from caller channel |

# 5. Standard Query Parameters

| Parameter | Type | Applies To | Notes |
|---|---|---|---|
| `page` | integer | list APIs | default `1` |
| `pageSize` | integer | list APIs | default `25`, max should be governed |
| `sortBy` | string | list APIs | canonical field or sort token |
| `sortOrder` | enum | list APIs | `asc` or `desc` |
| `q` | string | searchable lists | free-text query where supported |
| `status` | string or enum | list APIs | may be repeated or comma-separated by team convention |
| `updatedAfter` | ISO datetime | delta and sync APIs | for incremental refresh and integration |
| `includeArchived` | boolean | historical lists | permission-gated for soft-deleted or archived data |

# 6. Standard Success Payload Shapes

## 6.1 Single Resource Response

```json
{
  "data": {
    "id": "emp_01J2ZKQ7F7",
    "employeeCode": "EMP-100245",
    "status": "Active"
  },
  "meta": {
    "contractRef": "CTR-EMP-GET-001",
    "correlationId": "cor-7f2e3f91",
    "version": 7
  }
}
```

## 6.2 List Response

```json
{
  "data": [],
  "meta": {
    "contractRef": "CTR-TASK-GET-001",
    "correlationId": "cor-7f2e3f91",
    "page": 1,
    "pageSize": 25,
    "totalRecords": 240,
    "totalPages": 10
  }
}
```

## 6.3 Command Acceptance Response

```json
{
  "data": {
    "commandStatus": "accepted",
    "resourceId": "wrk_01J2ZRTEA1",
    "workflowInstanceId": "wfi_01J2ZRYJ3N"
  },
  "meta": {
    "contractRef": "CTR-EMP-BANK-POST-001",
    "correlationId": "cor-7f2e3f91"
  }
}
```

# 7. Standard Response Status Guidance

| Scenario | Recommended Status |
|---|---|
| synchronous successful create | `201` |
| synchronous patch success | `200` |
| accepted async command | `202` |
| successful read | `200` |
| validation failure | `422` |
| state conflict or stale update | `409` |
| forbidden | `403` |
| hidden foreign tenant resource | `404` or `403` by anti-enumeration policy |

# 8. OpenAPI Schema Naming Conventions

Use these schema families when generating actual OpenAPI specs:

| Schema Type | Naming Convention | Example |
|---|---|---|
| request payload | `<DtoRef>Request` | `DTO-EMP-PER-001Request` |
| single success response | `<ContractRef>Response` | `CTR-EMP-PER-PATCH-001Response` |
| list response | `<ContractRef>ListResponse` | `CTR-TASK-GET-001ListResponse` |
| command acceptance response | `<ContractRef>CommandResponse` | `CTR-IMP-EMP-CMD-001CommandResponse` |
| error response | `StandardErrorResponse` | shared |

# 9. Priority Contract Starters

## 9.1 `CTR-EMP-POST-001` EmployeeCreate

- `API Ref`: `API-007`
- `Method and Path`: `POST /api/v1/employees`
- `Owner Service`: `People Core Service`
- `Auth Scope`: `HR Admin`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `Idempotency-Key`
- `Request Schema`: `DTO-EMP-001Request`
- `Success Status`: `201`
- `Error Shape`: `StandardErrorResponse`

Required request body starter:

```json
{
  "global_user_id": "usr_01J2ZABC9Q",
  "org_user_id": "ORGUSR-000245",
  "employee_code": "EMP-100245",
  "legal_name": "Ananya Rao",
  "date_of_birth": "1994-02-28",
  "date_of_joining": "2026-08-01",
  "country_code": "IN",
  "business_timezone": "Asia/Kolkata"
}
```

Success response starter:

```json
{
  "data": {
    "employeeId": "emp_01J2ZKQ7F7",
    "employeeCode": "EMP-100245",
    "status": "Pre-Active"
  },
  "meta": {
    "contractRef": "CTR-EMP-POST-001",
    "correlationId": "cor-7f2e3f91",
    "version": 1
  }
}
```

## 9.2 `CTR-EMP-PER-PATCH-001` Personal Information Update

- `API Ref`: `API-031`
- `Method and Path`: `PATCH /api/v1/people/employees/{employeeId}/personal-information`
- `Owner Service`: `People Core Service`
- `Auth Scope`: `Employee scoped`, `HR Admin`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `If-Match`
- `Request Schema`: `DTO-EMP-PER-001Request`
- `Success Status`: `200`

Request body starter:

```json
{
  "legal_name": "Ananya Rao",
  "preferred_name": "Ananya",
  "date_of_birth": "1994-02-28",
  "marital_status": "Married",
  "marriage_date": "2021-12-04",
  "notes": "Name correction approved by HR."
}
```

## 9.3 `CTR-EMP-CON-PATCH-001` Contact Information Update

- `API Ref`: `API-032`
- `Method and Path`: `PATCH /api/v1/people/employees/{employeeId}/contact-information`
- `Owner Service`: `People Core Service`
- `Auth Scope`: `Employee scoped`, `HR Admin`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `If-Match`
- `Request Schema`: `DTO-EMP-CON-001Request`
- `Success Status`: `200`

Request body starter:

```json
{
  "primary_mobile_number": "+919812345678",
  "personal_email": "ananya.rao@example.com",
  "country_code": "IN",
  "state_code": "KA",
  "city_code": "BLR",
  "postal_code": "560001",
  "business_timezone": "Asia/Kolkata",
  "emergency_contact_phone": "+919876543210"
}
```

## 9.4 `CTR-EMP-MOB-OTP-POST-001` Mobile OTP Request

- `API Ref`: `API-033`
- `Method and Path`: `POST /api/v1/people/employees/{employeeId}/contact-information/mobile-otp/request`
- `Owner Service`: `Identity and Access`
- `Auth Scope`: `Employee scoped`, `HR Admin`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `Idempotency-Key`
- `Request Schema`: `DTO-EMP-MOB-OTP-001Request`
- `Success Status`: `202`

Request body starter:

```json
{
  "pending_mobile_number": "+919812345678",
  "action_idempotency_token": "cmd-otp-request-0001"
}
```

## 9.5 `CTR-EMP-MOB-OTP-CMD-001` Mobile OTP Verify

- `API Ref`: `API-034`
- `Method and Path`: `POST /api/v1/people/employees/{employeeId}/contact-information/mobile-otp/verify`
- `Owner Service`: `Identity and Access`
- `Auth Scope`: `Employee scoped`, `HR Admin`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `Idempotency-Key`
- `Request Schema`: `DTO-EMP-MOB-OTP-002Request`
- `Success Status`: `200`

Request body starter:

```json
{
  "pending_mobile_number": "+919812345678",
  "otp_code": "483921",
  "mobile_otp_verification_status": "verified",
  "action_idempotency_token": "cmd-otp-verify-0001"
}
```

## 9.6 `CTR-EMP-BANK-POST-001` Employee Bank Account Create or Change

- `API Ref`: `API-037`
- `Method and Path`: `POST /api/v1/people/employees/{employeeId}/bank-accounts`
- `Owner Service`: `People Core Service` plus `Payroll Operations` boundary
- `Auth Scope`: `Employee scoped`, `HR Admin`, `Payroll Admin`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `Idempotency-Key`
- `Request Schema`: `DTO-EMP-BANK-001Request`
- `Success Status`: `202`

Request body starter:

```json
{
  "account_holder_name": "Ananya Rao",
  "bank_account_number": "XXXXXX1234",
  "bank_routing_code": "HDFC0001234",
  "country_code": "IN",
  "allocation_percent": 100,
  "bank_change_effective_from": "2026-08-01"
}
```

## 9.7 `CTR-EMP-DOC-POST-001` Employee Document Upload

- `API Ref`: `API-039`
- `Method and Path`: `POST /api/v1/people/employees/{employeeId}/documents`
- `Owner Service`: `File Service` plus `Document Repository`
- `Auth Scope`: `Employee scoped`, `HR Admin`, `Compliance Admin`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `Idempotency-Key`
- `Request Schema`: `DTO-DOC-UPL-001Request`
- `Success Status`: `201`

Request body starter:

```json
{
  "file_name_original": "passport.pdf",
  "file_mime_type": "application/pdf",
  "file_size_bytes": 348221,
  "document_status": "pending-review"
}
```

## 9.8 `CTR-IMP-EMP-POST-001` Employee Import Validate

- `API Ref`: `API-040`
- `Method and Path`: `POST /api/v1/imports/employees/validate`
- `Owner Service`: `Implementation Tooling`
- `Auth Scope`: `HR Admin`, `Implementation Lead`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `Idempotency-Key`
- `Request Schema`: import batch wrapper around `DTO-IMP-*` rows
- `Success Status`: `202`

Request body starter:

```json
{
  "importType": "IMP-EMP-001",
  "fileName": "employee-master.xlsx",
  "rows": [
    {
      "tenant_code": "acme-india",
      "global_user_id": "usr_01J2ZABC9Q",
      "org_user_id": "ORGUSR-000245",
      "employee_code": "EMP-100245",
      "legal_name": "Ananya Rao",
      "date_of_birth": "1994-02-28",
      "date_of_joining": "2026-08-01"
    }
  ]
}
```

Preview response starter:

```json
{
  "data": {
    "batchId": "imp_01J2ZZN8VK",
    "previewStatus": "blocked",
    "rows": [
      {
        "rowNo": 2,
        "previewStatus": "blocked",
        "errorCount": 1,
        "warningCount": 0
      }
    ]
  },
  "meta": {
    "contractRef": "CTR-IMP-EMP-POST-001",
    "correlationId": "cor-7f2e3f91"
  }
}
```

## 9.9 `CTR-IMP-EMP-CMD-001` Employee Import Commit

- `API Ref`: `API-041`
- `Method and Path`: `POST /api/v1/imports/employees/commit`
- `Owner Service`: `Implementation Tooling`
- `Auth Scope`: `HR Admin`, `Implementation Lead`
- `Headers`: `Authorization`, `X-Correlation-Id`, `X-Tenant-Code`, `Idempotency-Key`
- `Request Schema`: commit command wrapper
- `Success Status`: `202`

Request body starter:

```json
{
  "batchId": "imp_01J2ZZN8VK",
  "action_idempotency_token": "imp-commit-0001",
  "overrideWarnings": false
}
```

# 10. Required OpenAPI Components

Every generated OpenAPI document for a service should include:

- `securitySchemes` for bearer auth
- shared header parameter components
- standard pagination parameter components
- `StandardErrorResponse`
- `ValidationFieldError`
- common `meta` object schema
- example payloads for success and failure

# 11. Service-by-Service Follow-On Conversion

The next OpenAPI generation waves should proceed in this order:

1. `People Core Service`
2. `Workflow and Approval Service`
3. `Configuration Service`
4. `File and Document Generation Services`
5. `Integration Hub and Event Bus`
6. remaining business domain services

# 12. Immediate Follow-On Use

This appendix should now drive:

- actual OpenAPI YAML or JSON generation by service
- request and response DTO implementation
- frontend API client generation
- QA contract assertions
