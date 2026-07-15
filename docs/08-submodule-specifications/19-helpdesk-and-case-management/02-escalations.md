---
id: HRMS-SUB-19-02
title: Escalations Specification
document: 02-escalations.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Escalations governs the routing of high-risk, blocked, breached, sensitive, or unresolved HR and employee-service cases to higher authority, specialist queues, or leadership attention.

In scope:

- Escalation rule definition
- Auto and manual escalation triggers
- Functional and hierarchical escalation routing
- Breach, risk, and exception-based escalations
- Escalation closure and monitoring

# 2. Business

Escalations protect service quality and risk control when normal case handling is not enough. They ensure sensitive, overdue, or blocked cases are not left unresolved and that the right owners intervene before employee experience or compliance degrades.

Business objectives:

- Prevent stagnation of blocked or overdue cases
- Route sensitive or high-risk issues to authorized decision-makers
- Reduce SLA breach impact through timely intervention
- Provide measurable visibility into operational bottlenecks and risk patterns

# 3. Functional

The system shall support:

- Automatic escalation based on SLA breach, severity change, inactivity, policy risk, or dependency failure
- Manual escalation initiated by agent, employee, manager, or supervisor where permitted
- Escalation to specialist queue, line manager, functional owner, senior leader, or compliance team
- Multi-step escalation ladders with time-based progression
- Escalation acknowledgment, reassignment, de-escalation, and resolution handling
- Parallel escalations for service ownership and compliance ownership where required

Detailed rules:

- Escalation should preserve case ownership history and reason traceability
- Sensitive escalations such as harassment, payroll leakage, or legal complaints must route only to restricted handlers
- De-escalation should require explicit rationale when case risk is reduced
- Escalation loops or duplicate escalations for the same unresolved condition should be prevented
- Escalation policy should distinguish customer-facing urgency from compliance-critical sensitivity
- Escalation acknowledgments should have their own controllable SLA where service model requires it

# 4. UX

Primary screens:

- Escalation rule catalog
- Escalated case queue
- Escalation timeline on case view
- Leadership exception dashboard
- Escalation analytics board

UX expectations:

- Agents should understand why a case escalated and what action is required next
- Supervisors should see priority, risk, and aging in one view
- Leadership dashboards should emphasize actionable risk, not raw ticket volume alone

# 5. API

Representative APIs:

- `POST /api/v1/helpdesk/escalation-rules`
- `POST /api/v1/helpdesk/cases/{caseId}/escalate`
- `POST /api/v1/helpdesk/cases/{caseId}/deescalate`
- `GET /api/v1/helpdesk/cases/{caseId}/escalations`
- `POST /api/v1/helpdesk/escalations/{escalationId}/acknowledge`

# 6. Database

Core entities:

- `escalation_rule`
- `case_escalation`
- `case_escalation_step`
- `case_escalation_acknowledgement`
- `case_escalation_reason`
- `case_escalation_resolution`

Key fields:

- Rule code, trigger type, severity threshold, queue scope, active status
- Case ID, escalation level, current owner, escalation channel, status
- Trigger timestamp, acknowledged timestamp, due action timestamp
- Sensitive-case flag, compliance-route flag, de-escalation reason
- Parent escalation reference, duplicate-prevention token, and escalation source
- Leadership visibility indicator and cross-functional review flag

# 7. Events

Published events:

- `case.escalated`
- `case.escalation_acknowledged`
- `case.escalation_reassigned`
- `case.deescalated`
- `case.escalation_breached`

Consumed events:

- `case.sla_breached`
- `case.severity_changed`
- `case.blocked`
- `case.no_update_detected`

# 8. Reports

Required reports:

- Escalation volume report
- Escalation root-cause report
- Escalation aging report
- Sensitive escalation report
- Escalation-resolution effectiveness report
- Escalation acknowledgment SLA report
- Escalation re-entry and recurrence report

# 9. Dashboards

Operational dashboards:

- Open escalations by queue
- Leadership attention required
- Recurring escalation triggers
- Escalations by service category

# 10. Security

Security requirements:

- Sensitive escalations must be scoped to authorized handlers only
- Manual escalation and de-escalation permissions should be strictly controlled
- Leadership visibility should honor confidentiality for employee-relations and legal cases

# 11. Audit

Audit coverage shall include:

- Rule creation and modification
- Escalation trigger and route history
- Acknowledgment and reassignment actions
- De-escalation decisions
- Restricted escalation access and view history

# 12. AI

AI-assisted opportunities:

- Predict which cases are likely to need escalation before breach
- Recommend best escalation route based on issue type and history
- Summarize escalated-case patterns for service improvement

AI guardrails:

- AI suggestions should not auto-route legally or ethically sensitive cases without approved deterministic rules
- Escalation predictions must remain visible as recommendations rather than hidden automation

# 13. Test Cases

Core test scenarios:

- Auto-escalate case after SLA breach
- Manually escalate case to specialist queue
- Prevent unauthorized de-escalation of sensitive case
- Acknowledge escalation and preserve timeline history
- Avoid duplicate escalation for same active trigger
- Escalate case simultaneously to service and compliance owners when configured
- Track acknowledgment breach separately from case-resolution breach

# 14. Workflows

Primary workflow:

1. Escalation trigger condition is met.
2. System or authorized user creates escalation.
3. Case is routed to next owner or authority level.
4. Escalation is acknowledged and worked.
5. Escalation is resolved or further escalated until closure.

# 15. State Machine

Escalation state model:

- `Triggered`
- `Acknowledged`
- `In Progress`
- `Reassigned`
- `Resolved`
- `De-escalated`
- `Closed`

# 16. Permissions

Representative permissions:

- `escalation_rule.manage`
- `case.escalate`
- `case.deescalate`
- `case.escalation.acknowledge`
- `case.escalation.view_sensitive`
- `case.escalation.audit.view`

# 17. Notifications

Notification scenarios:

- Case escalated
- Escalation awaiting acknowledgment
- Escalation breached
- Escalation reassigned
- Leadership escalation triggered

# 18. Configuration

Configurable parameters:

- Trigger conditions
- Escalation ladders
- Sensitive-case routing
- Acknowledgment SLA
- De-escalation approvals

# 19. Edge Cases

Important edge cases:

- Case severity is downgraded after escalation already triggered
- Same case needs both compliance and service escalations
- Escalated queue is also overloaded and requires tertiary escalation
- Escalation trigger fires during off-hours across timezones
