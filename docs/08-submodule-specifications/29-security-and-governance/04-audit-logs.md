---
id: HRMS-SUB-29-04
title: Audit logs Specification
document: 04-audit-logs.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Audit Logs preserve a tamper-evident, searchable, and policy-governed record of material actions across the HRMS platform.

In scope:

- Business transaction audit
- Security and access audit
- Configuration and administrative audit
- Sensitive read, export, print, and disclosure audit
- Search, retention, archival, and evidence retrieval

# 2. Business

Enterprise HRMS must be able to prove who changed what, when, why, and under what authority. Audit evidence is essential for payroll verification, employee-data investigations, privacy response, security incidents, financial controls, and legal defensibility.

Business objectives:

- Produce reliable evidence for audit, compliance, and investigations
- Improve traceability for high-risk business actions
- Support forensic reconstruction of user and system behavior
- Strengthen trust across payroll, HR, security, and management stakeholders

# 3. Functional

The system shall support:

- Event capture from all critical modules and privileged services
- Structured event models with actor, action, target, before and after summary, timestamp, channel, and correlation ID
- Append-only or tamper-evident storage design
- Entity history drill-down and cross-transaction search
- Retention, archival, legal hold, and export controls
- Separate treatment for business events, technical events, and security events

Mandatory audit categories:

- Create, update, approve, reject, deactivate, retire, and restore actions
- Role, permission, and policy changes
- Payroll-impacting master-data changes
- Sensitive document view, download, print, and export actions
- API token, integration credential, and privileged support actions
- Authentication and authorization failures for protected areas

Detailed rules:

- Privileged actions must not bypass audit capture
- Sensitive reads should be audited where required by privacy policy
- High-volume operational noise may be summarized only for approved low-risk event families
- Audit pipeline failure should trigger alerting and compensating controls

# 4. UX

Primary screens:

- Audit event search
- Entity history timeline
- Correlation trace explorer
- Export request approval queue
- Retention and archive status panel

UX expectations:

- Auditors should be able to move from a person or business object to full event history quickly
- Search should support entity, actor, date, action, module, and correlation filters
- Sensitive values should be masked unless viewer entitlement allows visibility

# 5. API

Representative APIs:

- `POST /api/v1/audit/events`
- `GET /api/v1/audit/events`
- `GET /api/v1/audit/entities/{entityType}/{entityId}`
- `POST /api/v1/audit/exports`
- `GET /api/v1/audit/exports/{exportId}`

API expectations:

- Ingestion APIs must support reliable asynchronous ingestion for high-volume producers
- Query APIs should support pagination, structured filters, and evidence-grade metadata
- Export APIs must enforce approval and watermarking rules where configured

# 6. Database

Core entities:

- `audit_event`
- `audit_event_detail`
- `audit_actor_context`
- `audit_export_request`
- `audit_archive_batch`

Key fields:

- Event ID, event category, action, module, timestamp, correlation ID
- Actor ID, actor type, session ID, impersonation flag, source IP, channel
- Target entity type, target ID, before summary, after summary, risk level
- Export requester, approver, scope, purpose, expiry link
- Archive batch reference, retention class, legal-hold flag

# 7. Events

Published events:

- `audit.event_captured`
- `audit.pipeline_failed`
- `audit.export_requested`
- `audit.export_approved`
- `audit.sensitive_access_detected`

Consumed events:

- Domain module events from employee, payroll, leave, attendance, benefits, security, and integrations
- Authentication and authorization events
- Report export and document delivery signals

# 8. Reports

Required reports:

- Sensitive action report
- Payroll audit report
- Privileged access activity report
- Audit export history report
- Audit pipeline health report

# 9. Dashboards

Operational dashboards:

- High-risk actions by module
- Audit volume by category
- Failed audit ingestion alerts
- Sensitive-read spikes
- Pending export approvals

# 10. Security

Security requirements:

- Audit viewers must not be able to alter audit history
- Storage must support immutability or tamper-evidence controls
- Access to sensitive audit payloads should be restricted and monitored
- Exported audit packages should be encrypted and optionally watermarked

# 11. Audit

Governance requirements:

- Audit itself must be auditable, including searches and exports of restricted logs
- Separation between operational support access and formal audit access should be supported
- Retention and deletion must comply with legal and privacy obligations

# 12. AI

AI-assisted opportunities:

- Cluster audit events into likely incidents or suspicious narratives
- Summarize entity history for investigators
- Detect abnormal privileged actions or unusual export behavior

AI guardrails:

- AI must not suppress or rewrite raw audit evidence
- AI summaries must link back to underlying immutable records

# 13. Test Cases

Core test scenarios:

- Capture employee master-data update with before and after summary
- Capture payroll approval with approver context
- Search events by correlation ID
- Restrict unauthorized audit export
- Raise alert when audit write path fails

# 14. Workflows

Primary workflow:

1. Business or system action occurs.
2. Audit event is generated and sent to audit pipeline.
3. Event is normalized, stored, indexed, and retained by policy.
4. Authorized users search or export evidence when required.
5. Archive and retention policies execute on schedule.

# 15. State Machine

Export request state model:

- `Requested`
- `Pending Approval`
- `Approved`
- `Generated`
- `Delivered`
- `Archived`
- `Rejected`

Archive batch state model:

- `Queued`
- `Running`
- `Completed`
- `Failed`

# 16. Permissions

Representative permissions:

- `audit.event.ingest`
- `audit.search`
- `audit.entity_history.view`
- `audit.export.request`
- `audit.export.approve`
- `audit.retention.manage`

# 17. Notifications

Notification scenarios:

- Audit pipeline failure
- Sensitive export requested
- Export approval pending
- Retention job failure
- Sensitive-read anomaly detected

# 18. Configuration

Configurable parameters:

- Retention duration by event category
- Search-index retention and archive policy
- Masking policy for query results
- Export approval thresholds
- Legal-hold behavior

# 19. Edge Cases

Important edge cases:

- Business transaction succeeds but audit persistence fails
- Distributed services produce out-of-order timestamps
- Before and after payload is too large for inline storage
- Impersonated support session performs change on behalf of another user
