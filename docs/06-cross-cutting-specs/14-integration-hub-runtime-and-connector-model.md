---
id: HRMS-XCUT-14
title: Integration Hub Runtime and Connector Model
document: 14-integration-hub-runtime-and-connector-model.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the runtime contract for the Integration Hub Service, including inbound connectors, outbound delivery, credentials handling, sync orchestration, contract lifecycle, and operational recovery.

# 2. Scope

This standard applies to:

- REST and webhook connectors
- file and SFTP connectors
- batch sync jobs
- inbound callbacks
- mapping and transformation runtime
- replay and dead-letter recovery

# 3. Connector Model

Every connector should declare:

- connector type
- source system
- target system
- system of record
- data direction
- contract version
- credential reference
- schedule or trigger type
- retry and replay policy

# 4. Inbound Framework

Inbound processing should support:

- endpoint verification or file-source trust verification
- schema validation
- mapping and reference translation
- idempotency and duplicate suppression
- quarantine or dead-letter on invalid payload
- operator traceability to source message

# 5. Outbound Framework

Outbound processing should support:

- routing by subscription or connector
- payload transformation by contract version
- retry and backoff by connector policy
- delivery receipt capture
- dead-letter and replay

# 6. Credential and Secret Controls

- all connector credentials must use secret references, not raw table values
- rotation must support overlap where remote system requires cutover window
- connector diagnostics must never expose raw secret material

# 7. Sync Orchestration

Sync jobs should declare:

- full or delta mode
- business watermark
- dependency order
- replay-safe key
- partial-failure policy

Rules:

- one failed record should not always fail full batch unless contract says atomicity is required
- same source record must not create duplicate target business outcomes on replay

# 8. Contract Lifecycle

- every contract version should be effective-dated
- breaking changes require new version
- test or sandbox certification should precede production activation
- drift between source payload and contract should be surfaced operationally

# 9. Runtime APIs

Representative APIs:

- `POST /api/v1/platform/integrations/connectors`
- `POST /api/v1/platform/integrations/contracts/{contractId}/publish`
- `POST /api/v1/platform/integrations/runs`
- `GET /api/v1/platform/integrations/runs/{runId}/trace`
- `POST /api/v1/platform/integrations/dead-letter/{deadLetterId}/replay`

# 10. Failure Isolation and Recovery

- connector failure must be isolated by connector and contract
- repeated remote `429` or `5xx` should back off and protect shared worker pools
- replay requires reason code and idempotency posture confirmation
- contract-mismatch failures should route to blocked or dead-letter state, not infinite retry

# 11. Observability

Track:

- success rate by connector
- latency
- replay count
- dead-letter backlog
- credential expiry risk
- schema-drift incidents

# 12. Test Expectations

- inbound invalid payload to dead-letter
- outbound retry after transient failure
- rotation without downtime
- replay without duplicate target object
- delta sync watermark resumes correctly

