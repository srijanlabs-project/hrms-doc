---
id: HRMS-APP-17
title: Error Payload Schema and Recovery Patterns
document: 17-error-payload-schema-and-recovery-patterns.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix defines the standard API and operator-facing error payload patterns for the Enterprise HRMS platform. It converts the seeded error catalog into implementation-ready response structures that backend, frontend, QA, support, and integration teams can use consistently.

# 2. Relationship To Existing References

This document should be used together with:

- [14-error-and-exception-catalog.md](D:/HRMS-doc/docs/07-appendices/14-error-and-exception-catalog.md)
- [08-api-registry-and-contract-index.md](D:/HRMS-doc/docs/07-appendices/08-api-registry-and-contract-index.md)
- [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md)
- [12-canonical-field-dictionary-seed.md](D:/HRMS-doc/docs/07-appendices/12-canonical-field-dictionary-seed.md)

# 3. Error Response Design Goals

The standard error shape should:

- be stable across services
- separate human-facing message intent from machine-actionable fields
- preserve tenant-safe and privacy-safe behavior
- support UI recovery guidance
- support retryability and support diagnostics
- support QA assertions against stable codes and categories

# 4. Canonical Error Payload Shape

## 4.1 Standard JSON Shape

```json
{
  "error": {
    "errorRef": "ERR-001",
    "code": "AUTH-001",
    "category": "authorization",
    "severity": "high",
    "httpStatus": 403,
    "message": "You do not have access to perform this action in the current scope.",
    "userAction": "Request the required role or switch to an allowed scope.",
    "retryable": false,
    "tenantSafe": true,
    "correlationId": "cor-7f2e3f91",
    "contractRef": "CTR-CONFIG-POST-001",
    "objectRef": "OBJ-TENANT",
    "fieldErrors": [],
    "details": {
      "scopeType": "tenant",
      "scopeId": "tenant-acme-india",
      "requiredPermission": "config.propose",
      "currentRole": "Org Admin"
    }
  }
}
```

## 4.2 Required Fields

| Field | Meaning | Required |
|---|---|---|
| `error.errorRef` | stable documentation reference such as `ERR-001` | Yes |
| `error.code` | stable product error code such as `AUTH-001` | Yes |
| `error.category` | normalized failure category | Yes |
| `error.severity` | normalized severity for support and UI treatment | Yes |
| `error.httpStatus` | HTTP response status | Yes for API responses |
| `error.message` | safe human-readable summary | Yes |
| `error.userAction` | concise recovery guidance | Recommended |
| `error.retryable` | whether immediate retry is meaningful | Yes |
| `error.tenantSafe` | whether message content is safe for tenant-scoped exposure | Yes |
| `error.correlationId` | trace key for debugging and support | Yes |

## 4.3 Optional Fields

| Field | Meaning |
|---|---|
| `error.contractRef` | related request or response contract family |
| `error.objectRef` | related state-bearing object |
| `error.fieldErrors` | validation-level field issues |
| `error.details` | machine-readable diagnostic context |
| `error.supportHint` | operator hint not shown to end user in all channels |
| `error.nextAllowedStates` | valid transitions when a state conflict occurs |

# 5. Normalized Categories

| Category | Typical Meaning | Typical HTTP Status |
|---|---|---|
| `authorization` | actor lacks required access or permission | `403` |
| `authentication` | actor is not authenticated or token invalid | `401` |
| `tenant-boundary` | request crosses tenant boundary illegally | `403` or `404` depending on exposure policy |
| `validation` | request input invalid or incomplete | `400` or `422` |
| `business-rule` | policy or domain rule prevents action | `409` or `422` |
| `state-conflict` | object is not in a valid state for the action | `409` |
| `dependency-failure` | prerequisite object, route, or config missing | `409` or `424` |
| `rate-limit` | caller exceeded quota or throttle | `429` |
| `transient-platform` | retry may succeed after temporary service issue | `503` |
| `integration-contract` | producer or consumer contract mismatch | `400`, `409`, or `422` |
| `integration-delivery` | downstream transport or delivery failure | `502`, `503`, or async operator error |

# 6. Severity Scale

| Severity | Meaning | Typical Use |
|---|---|---|
| `low` | minor recoverable issue with limited operational impact | non-blocking UI correction |
| `medium` | user or operator action required but localized impact | validation or non-critical conflicts |
| `high` | important business or operational block | authorization, workflow, template, or delivery failures |
| `critical` | high-risk control failure or major business block | tenant boundary, payroll close, support-session approval, privacy risk |

# 7. Validation Error Pattern

Use `fieldErrors` when a request has multiple input issues.

```json
{
  "error": {
    "errorRef": "ERR-003",
    "code": "CFG-001",
    "category": "validation",
    "severity": "medium",
    "httpStatus": 422,
    "message": "One or more configuration values are invalid.",
    "userAction": "Correct the highlighted fields and resubmit.",
    "retryable": false,
    "tenantSafe": true,
    "correlationId": "cor-a42fcd10",
    "contractRef": "CTR-CONFIG-POST-001",
    "fieldErrors": [
      {
        "field": "value",
        "code": "VALUE_OUT_OF_RANGE",
        "message": "Value must be between 1 and 365."
      },
      {
        "field": "effectiveDate",
        "code": "PAST_DATE_NOT_ALLOWED",
        "message": "Effective date cannot be earlier than today."
      }
    ]
  }
}
```

# 8. State Conflict Pattern

Use `objectRef`, current state, and next allowed states when the action is blocked by lifecycle state.

```json
{
  "error": {
    "errorRef": "ERR-008",
    "code": "REC-002",
    "category": "state-conflict",
    "severity": "high",
    "httpStatus": 409,
    "message": "The requisition cannot be published before approval is complete.",
    "userAction": "Complete the approval workflow before publishing.",
    "retryable": false,
    "tenantSafe": true,
    "correlationId": "cor-8ce1132d",
    "objectRef": "OBJ-REQUISITION",
    "details": {
      "currentState": "Submitted",
      "attemptedAction": "publish"
    },
    "nextAllowedStates": ["Approved"]
  }
}
```

# 9. Authorization and Tenant-Boundary Pattern

Authorization and tenant-boundary failures must avoid leaking hidden objects or cross-tenant existence.

Rules:

- do not reveal foreign tenant identifiers unless policy explicitly allows it
- prefer generic safe wording for cross-tenant denials
- include full diagnostic detail only in internal logs or support-safe channels

# 10. Retryability Rules

| Condition | `retryable` |
|---|---|
| validation failure | `false` |
| authorization failure | `false` |
| tenant-boundary failure | `false` |
| state conflict | `false` unless state may change asynchronously and UX wants controlled retry |
| transient platform failure | `true` |
| integration delivery failure | usually `true` for operator rerun, not always for end users |
| rate limit | `true` with backoff guidance |

# 11. HTTP Status Mapping Guidance

| Scenario | Recommended Status |
|---|---|
| unauthenticated | `401` |
| authenticated but forbidden | `403` |
| hidden foreign tenant object | `404` or `403` based on anti-enumeration policy |
| validation failure | `422` preferred, `400` acceptable if team standard requires |
| illegal state transition | `409` |
| duplicate or idempotency conflict | `409` |
| quota or throttle breach | `429` |
| temporary dependency or service outage | `503` |

# 12. Operator-Facing Recovery Patterns

Support consoles, admin dashboards, and job monitors should map errors into a small set of operator actions:

- `Fix data`
- `Fix permission or scope`
- `Complete prerequisite`
- `Retry later`
- `Replay safely`
- `Escalate to platform support`
- `Escalate to security or privacy owner`

# 13. API Contract Requirements

Each API contract should eventually define:

- success payload family
- standard error payload family
- field-level validation error shape if applicable
- idempotency-conflict behavior if applicable
- retry semantics if applicable

Until full schema documents exist, APIs should at minimum reference:

- `Error Ref`
- `Error Code`
- `Contract Ref`
- `Object Ref` where lifecycle state matters

# 14. QA Expectations

QA should validate:

- stable `code` and `category`
- correct HTTP status
- presence of `correlationId`
- absence of disallowed sensitive details
- correct `retryable` flag
- consistent field-level validation structure

# 15. Immediate Follow-On Use

This appendix should now drive:

- API error schema implementation
- frontend error handling patterns
- QA negative scenario assertions
- support troubleshooting views
