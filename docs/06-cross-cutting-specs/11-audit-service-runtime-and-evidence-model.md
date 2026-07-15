---
id: HRMS-XCUT-11
title: Audit Service Runtime and Evidence Model
document: 11-audit-service-runtime-and-evidence-model.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the shared runtime contract for the Enterprise HRMS Audit Service, including audit event ingestion, immutable evidence storage, masking, export, retention, legal hold, and privileged investigation workflows.

# 2. Scope

This standard applies to:

- business action auditing
- technical and administrative control auditing
- provider-plane and tenant-plane privileged actions
- workflow, API, event, job, and support-session correlation
- evidence retrieval and export
- retention, archival, and legal hold
- tamper evidence and integrity verification

It does not replace module-specific audit expectations. It defines the centralized service model every module should write to and investigate through.

# 3. Why This Matters

In an enterprise SaaS HRMS, audit is not just logging. It is the defensible evidence layer for:

- payroll and financial controls
- identity and access governance
- support-session trust
- sensitive field access and masking reveal
- policy and configuration change history
- employee disputes and investigations
- compliance, legal, and customer audits

If audit is left as module-local logging, the platform will struggle to prove cross-service timelines, support safe exports, or explain privileged activity.

# 4. Audit Service Position

The `Audit Service` should be treated as a shared deployable platform service that:

- accepts structured audit events from all services
- stores immutable evidence records
- indexes searchable metadata
- applies masking and export controls
- correlates actor, object, workflow, job, event, and support-session lineage
- serves authorized investigation and evidence export use cases

Source services remain responsible for emitting accurate audit facts, but not for owning long-term evidence storage or export policy.

# 5. Design Principles

- every material action should be attributable to a human or service actor
- audit evidence must be append-only after capture
- masked and privileged views must be intentionally separated
- audit search must be tenant-safe by default
- support-session and break-glass access must be prominently traceable
- audit exports must preserve chain-of-custody metadata
- capture failure must never disappear silently

# 6. What Must Be Audited

## 6.1 Mandatory Event Families

At minimum, the platform shall audit:

- create, update, approve, reject, cancel, close, reopen, and delete-like actions
- role, permission, masking, reveal, and delegated-access changes
- payroll, leave, workflow, and document finalization decisions
- identity verification and sensitive profile changes
- support session start, scoped activity, and session end
- configuration publish, rollback, and high-risk override actions
- replay, retry, skip, or force-complete operator actions on jobs or integrations
- privileged export, download, or evidence-pack generation

## 6.2 High-Risk Read Auditing

The platform should also audit privileged reads such as:

- reveal of masked values
- privileged audit searches
- audit evidence exports
- viewing restricted documents or evidence packages
- provider support access to tenant-restricted operational data

# 7. Canonical Audit Event Model

## 7.1 Required Event Fields

Every audit event should include:

| Field | Required | Description |
|---|---|---|
| `auditEventId` | Yes | immutable audit event identifier |
| `eventAt` | Yes | authoritative capture timestamp in UTC |
| `tenantId` | Yes for tenant-scoped actions | tenant lineage |
| `plane` | Yes | `provider` or `tenant` |
| `actor` | Yes | human or service principal details |
| `actorSessionId` | Recommended | interactive session trace |
| `supportSessionId` | Conditional | required when action occurs under provider support context |
| `sourceService` | Yes | producer service |
| `sourceModule` | Yes | business or platform module |
| `sourceChannel` | Yes | `ui`, `api`, `job`, `event-consumer`, `integration`, `support-tool` |
| `actionType` | Yes | business verb such as `approve`, `export`, `reveal`, `rollback` |
| `objectType` | Yes | primary target type |
| `objectId` | Yes | primary target identifier |
| `objectBusinessKey` | Recommended | human-readable business key |
| `correlationId` | Yes | end-to-end trace key |
| `causationId` | Recommended | preceding command or event |
| `workflowInstanceId` | Conditional | if action is workflow-bound |
| `jobRunId` | Conditional | if action originates from background execution |
| `eventId` | Conditional | if action originates from event processing |
| `outcome` | Yes | `success`, `failure`, `partial`, `blocked` |
| `sensitivity` | Yes | data sensitivity classification |
| `details` | Yes | structured details block |

## 7.2 Before and After Representation

For material updates, the `details` block should support:

- changed fields
- before value
- after value
- masking policy per field
- reason code
- approval or override references where applicable

Sensitive values may be:

- masked
- hashed
- tokenized
- replaced with redaction marker plus retrievable secured evidence reference

# 8. Actor and Access Context

## 8.1 Actor Types

The audit model should support:

- employee actor
- org admin actor
- platform admin actor
- platform support actor
- delegated actor
- service principal
- background-job actor

## 8.2 Delegation and Proxy Rules

Where delegation or proxy action exists, audit must preserve:

- original subject actor
- acting delegate or proxy actor
- basis of delegation
- delegation validity window

## 8.3 Support-Session Rules

If an action occurs during provider support access:

- `supportSessionId` is mandatory
- target tenant context is mandatory
- support reason or ticket reference should be linkable
- the audit explorer should visually distinguish support-originated actions from normal customer actions

# 9. Ingestion Model

## 9.1 Supported Ingestion Patterns

The Audit Service should accept:

- synchronous API capture for critical control actions
- asynchronous event-based capture for high-volume operational activity
- batch ingestion for controlled import or historical migration evidence

## 9.2 Reliability Rules

- critical control actions should prefer capture before final response completion or a provably durable outbox equivalent
- high-volume services may publish through an outbox or event bus, but delivery must remain durable and replay-safe
- if capture fails, the source service must emit an operational failure signal and avoid silent success

## 9.3 Capture Failure Handling

Capture failure posture should depend on action criticality:

- for critical security, payroll-close, support-session, and export actions, fail closed or require durable outbox write before success response
- for lower-risk bulk activity, accept via outbox and retry pattern if the audit store is temporarily unavailable

# 10. Storage and Integrity Model

## 10.1 Storage Rules

- audit records must be append-only
- updates to existing audit rows should be prohibited except for strictly separate indexing or archival markers
- evidence packages should reference immutable source event IDs and export package IDs

## 10.2 Tamper Evidence

Recommended controls:

- immutable storage mode where feasible
- hash or digest chain across capture batches
- signed export manifests
- integrity verification jobs with alerting on mismatch

## 10.3 Indexing Strategy

Indexes should support:

- tenant plus date
- actor plus date
- object type plus object ID
- correlation ID
- support session ID
- job run ID
- workflow instance ID
- action type plus outcome

# 11. Search, Timeline, and Investigation Model

## 11.1 Search Expectations

Authorized investigators should be able to search by:

- tenant
- actor
- object type and object ID
- action type
- date range
- support session
- correlation ID
- job run
- export package reference

## 11.2 Entity Timeline Expectations

The audit explorer should support entity-centric timelines that combine:

- API actions
- workflow decisions
- document evidence
- background job side effects
- configuration changes
- support-session interventions

## 11.3 Search Safety

- search results must be masked by default for restricted values
- cross-tenant searches are provider-only and must be auditable themselves
- Org Admin investigators should not infer hidden objects outside their authorized scope

# 12. Masking, Reveal, and Export Controls

## 12.1 Masked View

Default audit search should show:

- event metadata
- object references
- safe summaries
- masked changed values where data is restricted

## 12.2 Privileged Reveal

Where reveal is allowed:

- reveal action must itself be audited
- reveal may require approval depending on data class
- reveal should be time-bound in UI and not silently cached

## 12.3 Export Rules

Audit export or evidence-pack generation must capture:

- requestor identity
- requested scope
- reason or case reference
- masking mode
- approval references if required
- generated file identifiers
- access or download events after export creation

# 13. Retention, Archival, and Legal Hold

## 13.1 Retention Rules

- retention must be policy-driven and may vary by event family and jurisdiction
- archive must preserve searchability or at least retrievability for allowed investigation windows
- purge should never violate active legal hold or statutory retention obligations

## 13.2 Legal Hold Behavior

Legal hold should:

- suspend purge for matching records
- preserve scope and reason metadata
- remain traceable to initiating legal or governance authority

## 13.3 Post-Deletion Evidence

If source business data is deleted or anonymized:

- audit evidence may still remain under lawful retention
- the explorer should indicate when source records no longer exist but audit evidence remains valid

# 14. APIs and Operator Controls

Representative service APIs:

- `POST /api/v1/platform/audit/events`
- `GET /api/v1/platform/audit/events`
- `GET /api/v1/platform/audit/entities/{entityType}/{entityId}`
- `POST /api/v1/platform/audit/evidence-pack`
- `POST /api/v1/platform/audit/integrity/verify`
- `POST /api/v1/platform/audit/legal-holds`

Rules:

- ingestion APIs should validate required audit envelope fields
- search and export APIs must enforce masking and scope rules independently from caller UI
- evidence-pack generation should be asynchronous for large requests and should integrate with the job orchestration service

# 15. Events and Cross-Service Correlation

The audit model should be able to correlate:

- originating API request
- workflow task action
- background job execution
- downstream event publication
- notification or integration dispatch
- support session

This means audit records should consistently carry:

- `correlationId`
- `workflowInstanceId` when relevant
- `jobRunId` when relevant
- `eventId` when relevant
- `supportSessionId` when relevant

# 16. Observability and Alerting

## 16.1 Required Telemetry

The platform should monitor:

- capture throughput
- capture failure rate
- indexing lag
- search latency
- export volume
- integrity verification outcomes
- masked versus revealed access patterns

## 16.2 Alerts

Alerts should exist for:

- audit capture failure spike
- integrity verification mismatch
- unusual export surge
- repeated masked-value reveals by same actor
- support-session activity without expected closure
- abnormal cross-service correlation gaps

# 17. Multi-Tenant and SaaS Rules

- every tenant-scoped audit event must carry `tenant_id`
- provider-plane audit must remain distinguishable from tenant-plane audit
- platform admin dashboards may show platform operations and cross-tenant health, but not unrestricted tenant evidence content unless authorized by role and support-session governance
- org-side audit consoles should begin at tenant boundary, not provider boundary

# 18. Anti-Patterns to Avoid

- treating application logs as the audit system of record
- overwriting audit records during reprocessing or correction
- exporting unrestricted raw audit payloads without masking policy
- omitting support-session context from provider actions inside tenant space
- capturing high-risk actions without correlation ID
- auditing only writes and ignoring privileged reads

# 19. Test Expectations

High-risk audit tests should verify:

- critical action capture success
- fail-closed behavior where required
- masked versus privileged reveal behavior
- support-session traceability
- entity timeline reconstruction across services
- evidence export chain-of-custody metadata
- legal hold blocking purge
- integrity verification and alert generation

# 20. Immediate Follow-On Work

This standard should next drive:

- audit service OpenAPI contracts
- per-event audit payload schemas
- audit explorer and evidence-pack screen definitions
- retention and legal-hold runbooks
- SIEM and governance export integration contracts
