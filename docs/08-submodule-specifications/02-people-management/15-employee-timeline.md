---
id: HRMS-SUB-02-15
title: Employee timeline Specification
document: 15-employee-timeline.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Employee Timeline governs the consolidated chronological view of important employee lifecycle events, changes, approvals, and generated system actions.

In scope:

- Lifecycle event aggregation across modules
- Human-readable timeline rendering
- Drill-through to source transaction or document
- Filtering, visibility, and audit-aware event display
- Use in employee service, HR operations, manager oversight, and investigations

# 2. Business

The employee timeline provides operational observability for the employee record. It reduces time spent piecing together history from multiple modules and improves confidence in support, audit, and case-resolution work.

Business outcomes:

- Present a unified history of employee-relevant activity
- Accelerate HR support, manager review, and compliance investigations
- Improve transparency of who changed what and when
- Support employee trust through visible lifecycle continuity where appropriate

# 3. Functional

The system shall support:

- Aggregation of events from onboarding, employment changes, payroll, leave, performance, documents, helpdesk, and exit modules
- Configurable event types such as hire, manager change, bank update, leave approval, salary revision, document verification, and policy acknowledgment
- Source-aware drill-through to transaction, workflow case, or attachment
- Timeline views tailored for employee self-service, manager self-service, HR, and audit users
- Filtering by date range, event type, source module, actor, and confidentiality level
- Support for both business events and selected system events where operationally useful
- Event grouping for related multi-step workflows

Validation rules:

- Timeline shall not display events the viewer is not authorized to see
- Events shall preserve original timestamps and actor identity from source systems
- Deleted or purged source records shall leave compliant tombstones where policy requires traceability
- Duplicate inbound events shall be merged or suppressed based on source idempotency rules

# 4. UX

The user experience shall provide:

- Scrollable chronological timeline with icons, summaries, and drill-through actions
- Compact and detailed display modes
- Search and filter controls for investigators and HR operations
- Employee-facing timeline that omits confidential internal notes or restricted events

# 5. API

Representative APIs:

- `GET /api/v1/people/employees/{employeeId}/timeline`
- `GET /api/v1/people/employees/{employeeId}/timeline/events/{eventId}`
- `POST /api/v1/people/timeline/events/rebuild`
- `GET /api/v1/people/employees/{employeeId}/timeline/filters`

API requirements:

- Timeline APIs shall support pagination, cursor-based retrieval, and as-of-date filters
- Rebuild endpoints shall be admin-protected and audit logged
- Event payloads shall include redaction metadata for front-end rendering

# 6. Database

Core entities:

- `employee_timeline_event`
- `employee_timeline_source_link`
- `employee_timeline_visibility_rule`
- `employee_timeline_rebuild_log`

Key data requirements:

- Timeline events shall store source module, event type, actor, timestamp, and display summary
- Source links shall preserve original transaction identifiers and deep-link metadata
- Visibility rules shall control audience segmentation by event type

# 7. Events

The platform shall publish:

- `employee.timeline.event-created`
- `employee.timeline.event-redacted`
- `employee.timeline.rebuild-completed`

# 8. Reports

Required reports:

- Timeline rebuild and failure report
- Cross-module event-ingestion lag report
- Restricted-event access report
- Employee-history completeness report

# 9. Dashboards

Dashboards shall show:

- Timeline ingestion health by source module
- Event volume trend by lifecycle type
- Source systems with delayed or failed publishing
- Employee populations with incomplete history

# 10. Security

Security controls shall include:

- Event-level visibility enforcement
- Redaction of sensitive details for lower-privilege audiences
- Controlled admin access for rebuild or correction operations
- Audit of timeline-event viewing for sensitive categories

# 11. Audit

The audit trail shall capture:

- Timeline-event creation and suppression
- Rebuild and correction operations
- Visibility-rule changes
- Sensitive-event access where required

# 12. AI

AI capabilities may include:

- Summarization of important employee history for support users
- Detection of unusual event sequences
- Smart filtering suggestions during case investigation

AI guardrails:

- AI summaries shall respect event-level access restrictions
- AI shall not fabricate missing lifecycle events

# 13. Test Cases

Minimum test coverage shall include:

- Employee view excludes restricted HR-only events
- Event ingestion preserves source timestamp and actor
- Duplicate source event is not rendered twice
- Rebuild recreates missing event set correctly
- Deleted source record leaves compliant trace marker where configured

# 14. Workflows

Primary workflow:

1. Source module publishes employee event.
2. Timeline service validates, enriches, and stores it.
3. Authorized users view filtered timeline experience.
4. Support or audit users drill into the originating transaction.
5. Rebuild or correction routines repair gaps if needed.

# 15. State Machine

Supported states:

- `ingested`
- `enriched`
- `published`
- `redacted`
- `suppressed`
- `archived`

# 16. Permissions

Permissions shall include:

- View own employee timeline
- View team employee timeline
- View restricted HR timeline events
- Rebuild timeline events
- Export timeline history

# 17. Notifications

Notifications shall support:

- Event-ingestion failure alerts
- High-priority lifecycle-event notifications where enabled
- Rebuild completion notices for admins

# 18. Configuration

Administrators shall configure:

- Event-source subscriptions
- Visibility rules by event type
- Retention and archival behavior
- Grouping and summarization preferences

# 19. Edge Cases

The design shall address:

- Source module publishes late historical event
- Same event arrives from workflow engine and source module
- Sensitive investigation note should never appear to employee
- Employee record merges after duplicate person resolution
- Purged source data requires summary-only timeline retention
