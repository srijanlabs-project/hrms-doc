---
id: HRMS-SUB-00-09
title: Integration hub Specification
document: 09-integration-hub.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Integration Hub is the enterprise service layer that governs inbound, outbound, batch, and event-driven integrations between HRMS and surrounding systems.

In scope:

- Connector registration and lifecycle
- API, file, queue, webhook, and scheduled integration patterns
- Collaboration-platform connectors for Slack and Microsoft Teams
- Mapping, transformation, and validation rules
- Retry, replay, dead-letter, and observability controls
- Source-of-truth and ownership governance

# 2. Business

Enterprise HRMS rarely operates in isolation. It exchanges data with identity systems, ERP, payroll banks, tax services, attendance devices, recruitment platforms, learning tools, CRM, ticketing tools, and government interfaces. Integration failure can stop payroll, onboarding, access provisioning, compliance filings, and analytics.

Business objectives:

- Standardize enterprise integration patterns
- Reduce point-to-point fragility
- Provide traceability and supportability for all interfaces
- Support scale, replay safety, and governed ownership

# 3. Functional

The system shall support:

- Connector definitions for REST, SOAP, SFTP, file drop, database bridge, message queue, webhook, and middleware adapter patterns
- Connector definitions for Slack bot, Slack webhook, Microsoft Teams bot, and Microsoft Graph notification delivery patterns
- Effective-dated interface contracts with source and target ownership metadata
- Field mapping, transformation, validation, and reference-data translation
- Inbound ingestion, outbound publishing, and bidirectional sync models
- Retry, replay, dead-letter, throttling, and partial-failure handling
- Schedule management, dependency sequencing, and support diagnostics

Detailed rules:

- Every interface must declare system of record, system of use, and conflict-resolution behavior
- Replay must be safe and idempotent for downstream business outcomes
- Interface changes must be versioned and testable before production promotion
- High-risk integrations should support circuit-breaker or fail-safe modes

# 4. UX

Primary screens:

- Connector catalog
- Interface contract editor
- Run monitor
- Error and dead-letter queue console
- Payload trace viewer

UX expectations:

- Support teams should move from alert to failed payload in one flow
- Business admins should understand ownership, schedule, and dependency without needing deep technical knowledge
- Technical users should be able to inspect request, response, transform, and retry history

# 5. API

Representative APIs:

- `POST /api/v1/platform/integrations/connectors`
- `PUT /api/v1/platform/integrations/connectors/{connectorId}`
- `POST /api/v1/platform/integrations/runs`
- `POST /api/v1/platform/integrations/runs/{runId}/replay`
- `GET /api/v1/platform/integrations/runs/{runId}/trace`
- `POST /api/v1/platform/integrations/webhooks/{connectorKey}`
- `POST /api/v1/platform/integrations/collaboration/test-delivery`

API expectations:

- Connector APIs must protect credentials and support secret rotation
- Replay and reprocess APIs must require explicit operator intent and reason
- Trace APIs should redact protected data based on role

# 6. Database

Core entities:

- `integration_connector`
- `integration_contract_version`
- `integration_mapping_rule`
- `integration_run`
- `integration_message`
- `integration_error`
- `integration_dead_letter`

Key fields:

- Connector code, pattern, source system, target system, schedule, owner team
- Mapping expression, validation rule, default behavior, schema version
- Run status, correlation ID, payload hash, retry count, latency metrics
- Error category, reason code, business object reference, recovery state

# 7. Events

Published events:

- `integration.connector_activated`
- `integration.run_started`
- `integration.run_failed`
- `integration.message_replayed`
- `integration.schema_changed`

Consumed events:

- Domain events from employee, payroll, leave, attendance, learning, and security modules
- External webhooks and file-arrival signals

# 8. Reports

Required reports:

- Interface inventory report
- Failed integration report
- SLA breach report
- Replay activity report
- Source-of-truth ownership report

# 9. Dashboards

Operational dashboards:

- Integration success rate
- Interfaces failing by connector and business domain
- Dead-letter backlog
- Average latency by interface
- Upcoming certificate or credential expiry

# 10. Security

Security requirements:

- All connector credentials must be encrypted and rotatable
- Data-in-transit must use approved transport security standards
- Payload traces must honor field-level masking and tenant isolation
- Production replay and endpoint edits require elevated privileges

# 11. Audit

Audit coverage shall include:

- Connector creation, update, activation, and retirement
- Contract version publication
- Credential rotation metadata
- Replay, skip, and manual correction actions
- Ownership changes and schedule changes

# 12. AI

AI-assisted opportunities:

- Classify integration failures by probable root cause
- Recommend field mappings or schema alignments during connector setup
- Detect unusual latency or failure patterns before SLA breach

# 13. Test Cases

Core test scenarios:

- Successful outbound API delivery
- Inbound payload validation failure with dead-letter routing
- Safe replay after corrected mapping
- Credential rotation without downtime
- Partial batch failure with no duplicate business outcome on retry

# 14. Workflows

Primary workflow:

1. Connector and contract are defined.
2. Mapping, validation, and schedule are configured.
3. Runtime processes inbound or outbound messages.
4. Monitoring detects failures and routes them for recovery.
5. Replay or correction completes and downstream status is updated.

# 15. State Machine

Connector state model:

- `Draft`
- `Configured`
- `Test Ready`
- `Active`
- `Suspended`
- `Retired`

Run state model:

- `Queued`
- `Running`
- `Partially Failed`
- `Failed`
- `Completed`
- `Replayed`

# 16. Permissions

Representative permissions:

- `integration.connector.create`
- `integration.connector.manage`
- `integration.run.view`
- `integration.run.replay`
- `integration.contract.publish`
- `integration.audit.view`

# 17. Notifications

Notification scenarios:

- Critical interface failure
- SLA breach or repeated retry exhaustion
- Credential or certificate nearing expiry
- Schema mismatch detected after source change
- Replay completed with unresolved residual errors

# 18. Configuration

Configurable parameters:

- Connector pattern
- Retry and backoff policy
- Replay retention period
- Payload archival rules
- Secret rotation schedule
- Field masking policy

# 19. Edge Cases

Important edge cases:

- Source system changes schema without notice
- Replay occurs after downstream partial success
- Integration ownership changes during live incident handling
- Same business event arrives through both batch and real-time channels
- Large file inbound succeeds technically but violates business validation rules
