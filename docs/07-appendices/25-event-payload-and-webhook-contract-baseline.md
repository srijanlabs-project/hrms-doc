---
id: HRMS-APP-25
title: Event Payload and Webhook Contract Baseline
document: 25-event-payload-and-webhook-contract-baseline.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix defines the implementation-ready baseline for event payloads, event envelopes, webhook delivery contracts, replay behavior, and consumer expectations across the Enterprise HRMS platform.

# 2. Scope

This baseline covers:

- canonical event envelope structure
- event schema naming and versioning
- minimum payload content rules
- producer and consumer responsibilities
- outbound webhook request contract
- webhook signing, replay, retry, and dead-letter behavior
- sample event payloads for high-value HRMS flows

This document complements the existing event matrix and webhook specifications by turning them into build-facing contract guidance.

# 3. Relationship to Existing References

This appendix should be used together with:

- `05-event-catalog-framework.md`
- `09-event-producer-consumer-matrix.md`
- `16-message-catalog-by-event.md`
- `17-error-payload-schema-and-recovery-patterns.md`
- `23-openapi-ready-contract-starter-pack.md`
- `08-event-bus.md`
- `02-webhooks.md`

# 4. Contract Design Principles

- Every published event must have one canonical producer.
- Every event must be self-describing enough for a consumer to validate tenancy, entity, version, actor lineage, and business timing.
- Payloads should prefer stable identifiers and codes over display labels.
- Consumers must be idempotent and replay-safe for all `Medium` and `High` replay-sensitivity events.
- Webhook contracts should expose only the minimum required data and should prefer follow-up API fetch patterns for large or highly sensitive payloads.
- Breaking changes must not be introduced inside the same major schema version.

# 5. Canonical Event Envelope

## 5.1 Required Envelope Fields

Every event published to the internal bus or delivered through outbound webhook should conform to the following envelope:

| Field | Required | Description | Notes |
|---|---|---|---|
| `eventId` | Yes | globally unique event identifier | UUID or sortable UUID |
| `eventName` | Yes | canonical event name | example `employee.created` |
| `eventVersion` | Yes | event schema version | semantic `major.minor` recommended |
| `eventFamily` | Yes | broader domain grouping | example `workforce_lifecycle` |
| `occurredAt` | Yes | producer-side UTC timestamp | ISO 8601 UTC |
| `publishedAt` | Yes | bus or dispatch publication UTC timestamp | may differ from `occurredAt` |
| `tenantId` | Yes for tenant-scoped events | tenant lineage | absent only for provider-global events |
| `businessDate` | Recommended | interpreted business date | required for leave, attendance, payroll cutoff events |
| `businessTimezone` | Recommended | IANA timezone for business-date logic | required where date boundary matters |
| `producerService` | Yes | owning service name | example `people-core-service` |
| `producerModule` | Yes | business module name | example `People Management` |
| `entityType` | Yes | primary business entity type | example `employee_master` |
| `entityId` | Yes | primary business entity identifier | canonical service-owned ID |
| `entityBusinessKey` | Recommended | human-meaningful reference | example `employee_code` |
| `action` | Yes | business action | example `created`, `approved`, `finalized` |
| `actor` | Yes | user or service principal who triggered action | nested object |
| `correlationId` | Yes | end-to-end trace key | ties API, workflow, jobs, and events |
| `causationId` | Recommended | upstream command or event ID | useful for event chains |
| `idempotencyKey` | Recommended | originating command idempotency token | for replay and dedupe tracing |
| `privacyClassification` | Yes | sensitivity class | `Internal`, `Confidential`, `Restricted`, `Highly Restricted` |
| `data` | Yes | business payload | versioned schema object |
| `meta` | Recommended | transport, replay, and diagnostic metadata | non-business operational context |

## 5.2 Actor Object

The `actor` object should support both human and system identities:

```json
{
  "actorType": "human",
  "globalUserId": "usr_glob_01J...",
  "orgUserId": "ORG-USER-10452",
  "employeeId": "emp_01J...",
  "displayRole": "HR Admin"
}
```

Service-originated events may use:

```json
{
  "actorType": "service",
  "servicePrincipal": "payroll-close-job",
  "runId": "job_01J..."
}
```

# 6. Event Naming and Versioning Rules

## 6.1 Naming Rules

- Use lowercase dot-separated names.
- Use business verbs, not technical transport verbs.
- Prefer stable names such as `leave.request-approved` over implementation-specific names.
- One business fact should map to one canonical event name even if multiple delivery channels exist.

## 6.2 Versioning Rules

- `major` changes indicate breaking payload changes.
- `minor` changes indicate backward-compatible additions.
- Producers must not remove or rename required fields inside the same major version.
- Consumers should reject unsupported major versions and record a diagnosable error.
- Webhook subscriptions should declare which event versions they accept.

## 6.3 Deprecation Rules

- old major versions require a published retirement date
- deprecation notices should be surfaced in integration admin screens and operator notifications
- replay of historical events should preserve the original payload version unless explicit transformation is part of the replay contract

# 7. Payload Content Rules

## 7.1 Minimum Business Content

Every event payload must include:

- canonical entity identifier
- canonical business state after the action
- timestamps required to interpret the action
- references to relevant workflow, document, or payroll artifacts where applicable
- only the fields necessary for downstream automation

## 7.2 Minimize Sensitive Data

- avoid embedding full national identifiers, bank account numbers, or large documents in event payloads
- where sensitive details are needed, send masked or tokenized references and require follow-up API retrieval with authorization
- for mobile, email, or address changes, include verification or trust state rather than raw evidence artifacts

## 7.3 Snapshot vs Delta

Use one of these patterns explicitly:

- `delta event`: only changed fields plus final status
- `summary snapshot event`: compact current-state projection sufficient for common consumers
- `reference event`: minimal envelope plus resource URI or API hint for consumers to fetch details

The selected pattern must be documented per event family and not improvised per producer.

# 8. Consumer Responsibilities

Consumers shall:

- validate `eventName`, `eventVersion`, `tenantId`, and required headers or envelope fields
- enforce idempotency using `eventId`, `entityId`, `action`, and if relevant `idempotencyKey`
- record processing outcome with correlation to support replay diagnostics
- reject events outside their supported version range
- not assume delivery order unless the contract explicitly guarantees ordering

Consumers should not:

- derive tenant context from endpoint path alone
- treat duplicate deliveries as errors if the business outcome is already applied
- depend on optional fields as if they are mandatory

# 9. Retry, Replay, and Dead-Letter Rules

## 9.1 Delivery Semantics

- Internal event bus delivery should be treated as at-least-once by default.
- Webhook delivery should also be treated as at-least-once.
- Exactly-once business behavior is achieved through idempotent consumers, not transport promises alone.

## 9.2 Retry Rules

- retry behavior should use bounded exponential backoff with jitter
- retryable failures include `408`, `429`, and `5xx` responses unless connector policy overrides
- non-retryable failures generally include malformed payload rejection, unsupported version, or authorization failure due to consumer misconfiguration

## 9.3 Replay Rules

Replay requests must capture:

- replay reason
- operator or system initiator
- original event IDs or time window
- whether payload transformation is allowed
- whether replay is dry-run, partial, or commit mode

Replay effects:

- `meta.replayed` should be `true`
- `meta.originalEventId` should be preserved
- `meta.replayJobId` should identify the replay batch or manual action
- consumers must not treat replay as a brand-new business fact

## 9.4 Dead-Letter Rules

- permanent delivery failure must create a dead-letter record with exact failure reason
- dead-letter records must preserve original payload, target consumer, retry count, and last error category
- dead-letter reprocessing must remain auditable and operator-controlled

# 10. Canonical Webhook HTTP Contract

## 10.1 Required HTTP Headers

| Header | Required | Description |
|---|---|---|
| `Content-Type` | Yes | `application/json` |
| `User-Agent` | Yes | provider dispatch identifier |
| `X-HRMS-Event-Id` | Yes | event identifier |
| `X-HRMS-Event-Name` | Yes | canonical event name |
| `X-HRMS-Event-Version` | Yes | payload version |
| `X-HRMS-Tenant-Id` | Yes for tenant events | tenant lineage |
| `X-HRMS-Correlation-Id` | Yes | request lineage |
| `X-HRMS-Delivery-Id` | Yes | unique webhook delivery attempt identifier |
| `X-HRMS-Delivered-At` | Yes | dispatch UTC timestamp |
| `X-HRMS-Signature` | Yes | HMAC or configured signature |
| `X-HRMS-Signature-Alg` | Yes | algorithm identifier |
| `X-HRMS-Signature-Timestamp` | Yes | signing timestamp |
| `X-HRMS-Replayed` | Recommended | `true` or `false` |
| `X-HRMS-Original-Event-Id` | Conditional | original event ID for replayed deliveries |

## 10.2 Webhook Body Shape

```json
{
  "eventId": "evt_01J...",
  "eventName": "employee.created",
  "eventVersion": "1.0",
  "tenantId": "ten_01J...",
  "occurredAt": "2026-07-15T05:10:11Z",
  "correlationId": "cor_01J...",
  "entityType": "employee_master",
  "entityId": "emp_01J...",
  "action": "created",
  "privacyClassification": "Restricted",
  "actor": {
    "actorType": "human",
    "globalUserId": "usr_glob_01J...",
    "orgUserId": "ORG-USER-10452"
  },
  "data": {},
  "meta": {
    "deliveryId": "whd_01J...",
    "replayed": false
  }
}
```

## 10.3 Success and Failure Expectations

- `2xx` means the consumer accepted delivery
- `202` is valid when consumer-side async processing is used
- `4xx` generally indicates configuration or contract errors and should not be retried indefinitely
- `5xx` indicates temporary failure and should enter retry policy

# 11. Webhook Signing and Verification

## 11.1 Signature Method

Recommended baseline:

- HMAC SHA-256 over canonical request body plus signature timestamp
- secret stored per subscription and versioned through secret rotation

## 11.2 Verification Rules

Consumers should:

- verify signature timestamp is within allowed replay window
- verify signature against the active secret version
- reject unsigned or stale requests
- return a clear `401` or `403` reason code where safe to do so

## 11.3 Secret Rotation Rules

- rotation should support overlap between current and previous secret for a configurable transition window
- signature validation must record which secret version matched
- expired secret versions must no longer validate after the overlap window closes

# 12. Canonical Event Schemas

## 12.1 `employee.created` Version `1.0`

Event intent:

- signals that a new employee master record has been created and is ready for downstream initialization

Payload baseline:

```json
{
  "data": {
    "employeeId": "emp_01J...",
    "employeeCode": "EMP-2026-00142",
    "personId": "prs_01J...",
    "employmentStatus": "Pre-Active",
    "workerType": "Employee",
    "dateOfJoining": "2026-08-01",
    "legalEntityId": "le_01J...",
    "departmentId": "dep_01J...",
    "locationId": "loc_01J...",
    "managerEmployeeId": "emp_01MGR...",
    "sourceSystemCode": "onboarding"
  }
}
```

Consumer notes:

- access provisioning should not assume the employee is already login-enabled
- payroll should only act when additional eligibility conditions are met

## 12.2 `employee.transferred` Version `1.0`

Payload baseline:

```json
{
  "data": {
    "employeeId": "emp_01J...",
    "transferEffectiveFrom": "2026-09-01",
    "previousAssignment": {
      "legalEntityId": "le_old",
      "departmentId": "dep_old",
      "locationId": "loc_old",
      "managerEmployeeId": "mgr_old"
    },
    "newAssignment": {
      "legalEntityId": "le_new",
      "departmentId": "dep_new",
      "locationId": "loc_new",
      "managerEmployeeId": "mgr_new"
    },
    "changeReasonCode": "INTERNAL_TRANSFER"
  }
}
```

Consumer notes:

- payroll and leave consumers must use effective date, not delivery timestamp, to apply rule impact

## 12.3 `leave.request-approved` Version `1.0`

Payload baseline:

```json
{
  "data": {
    "leaveRequestId": "lrq_01J...",
    "employeeId": "emp_01J...",
    "leaveTypeCode": "ANNUAL",
    "approvalStatus": "Approved",
    "businessDateRange": {
      "from": "2026-07-20",
      "to": "2026-07-22"
    },
    "approvedDays": 3,
    "policyVersionId": "lpv_01J...",
    "workflowInstanceId": "wfi_01J..."
  }
}
```

Consumer notes:

- team calendars may consume summary only
- payroll should use business dates and leave day expansion rows, not assume full-day uniformity

## 12.4 `payroll.run-finalized` Version `1.0`

Payload baseline:

```json
{
  "data": {
    "payrollRunId": "prn_01J...",
    "periodCode": "2026-07",
    "runType": "NORMAL",
    "scope": {
      "legalEntityIds": ["le_01A", "le_01B"]
    },
    "employeeCount": 1824,
    "finalizedAt": "2026-07-30T18:45:00Z",
    "payslipBatchId": "psb_01J...",
    "resultVersion": 3
  }
}
```

Consumer notes:

- finance, banking, and compliance consumers must not regenerate artifacts blindly on replay
- downstream consumers should key off `payrollRunId` plus `resultVersion`

## 12.5 `document.signed` Version `1.0`

Payload baseline:

```json
{
  "data": {
    "documentId": "doc_01J...",
    "documentType": "offer_letter",
    "signatureRequestId": "sig_01J...",
    "signatureStatus": "Completed",
    "signedAt": "2026-07-15T09:40:25Z",
    "signedArtifactId": "dver_01J...",
    "workflowInstanceId": "wfi_01J..."
  }
}
```

Consumer notes:

- payload should not embed raw legal evidence package
- authorized consumers may fetch evidence through document APIs

# 13. Canonical Webhook Subscription Contract

## 13.1 Subscription Request Baseline

Related API:

- `API-027`

Recommended request shape:

```json
{
  "name": "Payroll downstream listener",
  "endpointUrl": "https://consumer.example.com/hrms/webhooks",
  "eventNames": [
    "employee.created",
    "leave.request-approved",
    "payroll.run-finalized"
  ],
  "acceptedVersions": {
    "employee.created": ["1.x"],
    "leave.request-approved": ["1.x"],
    "payroll.run-finalized": ["1.x"]
  },
  "tenantScope": "single-tenant",
  "deliveryPolicy": {
    "timeoutSeconds": 10,
    "maxAttempts": 8
  }
}
```

## 13.2 Subscription Validation Rules

- endpoint ownership must be verified before activation
- HTTPS required unless explicitly whitelisted for non-production
- secret issuance and test handshake required
- event selection must be permission-scoped and tenant-safe

# 14. Consumer Test Expectations

Every consumer integration should be tested for:

- valid payload acceptance
- duplicate delivery handling
- unsupported version rejection
- stale signature rejection
- replay handling with original event preservation
- masked-field expectations for restricted events
- retry after `5xx`
- no retry for non-retryable contract rejection

# 15. Operational Observability Rules

Dispatch and consumption telemetry should capture:

- `eventId`
- `eventName`
- `eventVersion`
- `deliveryId`
- `tenantId`
- `endpointUrl` or consumer name
- response code
- latency
- retry count
- dead-letter reason
- replay job reference if applicable

# 16. Anti-Patterns to Avoid

- sending entire employee or payroll records when only a few downstream fields are needed
- embedding unmasked sensitive identifiers in webhook payloads
- changing required field names without version change
- using delivery timestamp as business-effective date
- replaying historic events as if they were new facts
- building consumers that depend on implicit ordering without contract guarantee

# 17. Immediate Follow-On Deliverables

This baseline should next be expanded into:

- per-event JSON schema artifacts
- signed webhook example library by module
- provider callback handling specs
- consumer contract test packs
- event compatibility matrix by service and release wave
