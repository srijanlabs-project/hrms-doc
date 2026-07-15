---
id: HRMS-SUB-19-01
title: SLA management Specification
document: 01-sla-management.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

SLA Management defines the response, resolution, breach, escalation, pause, and measurement rules that govern service commitments for HR cases, employee tickets, and shared-service requests.

In scope:

- SLA policy definition and applicability
- Response and resolution timer behavior
- Pause, hold, and exception handling
- Escalation and breach management
- Operational measurement and auditability

# 2. Business

Shared HR and service-delivery teams need measurable commitments to ensure employee requests are handled consistently and leadership can detect bottlenecks. Without governed SLAs, service quality becomes inconsistent and hard to improve.

Business objectives:

- Standardize service commitments across case types and support channels
- Improve accountability for response and resolution performance
- Enable proactive escalation before employee experience degrades
- Produce measurable service operations insights for leadership

# 3. Functional

The system shall support:

- SLA definition by case type, severity, channel, geography, employee group, or support queue
- Separate first-response, next-action, resolution, and closure targets
- Business-hours, calendar-hours, holiday-aware, and timezone-aware timers
- Pause, hold, and waiting-on-customer or waiting-on-third-party states
- Breach-warning, partial-breach, and full-breach escalation logic
- Retroactive SLA recalculation where case categorization changes under governed rules

Detailed rules:

- Each case should resolve against the SLA policy effective at creation unless reclassification policy allows remapping
- Pause states must be explicit and auditable so SLA is not artificially stopped
- Escalation should support queue, manager, and leadership routing based on severity and breach depth
- Metrics should distinguish controllable internal delay from external dependency delay

# 4. UX

Primary screens:

- SLA policy catalog
- Case timer and countdown view
- Breach risk queue
- Escalation dashboard
- Service-performance analytics board

UX expectations:

- Case handlers should always know how much time remains and what timer is active
- Supervisors should see at-risk cases before they breach
- SLA setup screens should allow policy owners to understand calendar and exception behavior without technical interpretation

# 5. API

Representative APIs:

- `POST /api/v1/helpdesk/sla-policies`
- `GET /api/v1/helpdesk/cases/{caseId}/sla`
- `POST /api/v1/helpdesk/cases/{caseId}/sla/pause`
- `POST /api/v1/helpdesk/cases/{caseId}/sla/resume`
- `POST /api/v1/helpdesk/cases/{caseId}/sla/recalculate`
- `GET /api/v1/helpdesk/sla/metrics`

# 6. Database

Core entities:

- `sla_policy`
- `sla_policy_version`
- `case_sla_instance`
- `case_sla_timer`
- `case_sla_breach_event`
- `case_sla_pause_reason`

Key fields:

- Policy code, case applicability, severity mapping, calendar rule, effective dates
- Case ID, start time, response target, resolution target, current status
- Pause start, pause end, reason, external dependency flag
- Breach level, escalated to, notified at, resolved after breach indicator

Additional design fields:

- First-response-achieved timestamp and actor
- Customer-wait aggregate duration
- Queue-transfer count and inherited-SLA flag
- Manual override reason and override approver

# 7. Events

Published events:

- `sla.policy_published`
- `case.sla_started`
- `case.sla_paused`
- `case.sla_breach_warning`
- `case.sla_breached`
- `case.sla_recovered`

Consumed events:

- `case.created`
- `case.reclassified`
- `case.waiting_on_customer`
- `case.closed`

# 8. Reports

Required reports:

- SLA attainment report
- Breach trend report
- Pause-reason report
- Queue performance report
- Severity and channel comparison report
- First-response vs resolution gap report
- Reopened-case SLA impact report

# 9. Dashboards

Operational dashboards:

- Cases nearing response breach
- Cases nearing resolution breach
- Breach volume by queue and category
- SLA attainment by period
- External dependency delay distribution

# 10. Security

Security requirements:

- Only authorized service owners should define or revise SLA policies
- Timer overrides and manual pause controls should require explicit justification
- Queue-level performance data may need scoped visibility by service domain

# 11. Audit

Audit coverage shall include:

- SLA policy creation and revision
- Timer start, pause, resume, and recalculation actions
- Manual overrides and breach acknowledgments
- Escalation notifications and routing changes

# 12. AI

AI-assisted opportunities:

- Predict likely breach risk from case attributes and queue backlog
- Recommend rerouting or prioritization to avoid breach
- Summarize recurring breach causes for operational improvement

AI guardrails:

- AI recommendations must not change timer state or override breach outcome automatically
- Operational suggestions should identify confidence and underlying queue signals

# 13. Test Cases

Core test scenarios:

- Start SLA on new case creation
- Pause timer on waiting-for-customer status
- Trigger breach warning and escalation
- Recalculate SLA after approved case reclassification
- Report attainment correctly across business calendar boundaries
- Prevent unauthorized manual pause from hiding active breach risk
- Preserve timer continuity across queue reassignment

# 14. Workflows

Primary workflow:

1. Case is created and matched to SLA policy.
2. Response and resolution timers start.
3. Timers pause or escalate based on case state changes.
4. Breach events trigger operational action.
5. Closure stops the SLA and records service metrics.

# 15. State Machine

SLA instance state model:

- `Started`
- `Paused`
- `Warning`
- `Breached`
- `Recovered`
- `Stopped`

# 16. Permissions

Representative permissions:

- `sla_policy.manage`
- `case_sla.view`
- `case_sla.pause`
- `case_sla.override`
- `case_sla.metrics.view`
- `case_sla.audit.view`

# 17. Notifications

Notification scenarios:

- SLA breach warning
- SLA breached
- Escalation reassigned
- Policy change published
- Manual override performed

# 18. Configuration

Configurable parameters:

- Business calendars
- Severity thresholds
- Pause-eligible states
- Escalation hierarchy
- Reclassification policy
- Reopen-case timer behavior
- External dependency classification rules

# 19. Edge Cases

Important edge cases:

- Case moves across queues in different timezones
- Ticket is put on hold repeatedly by different teams
- Reclassification happens after breach warning but before actual breach
- Customer replies after long pause and SLA restarts with different severity
