---
id: HRMS-SUB-08-03
title: Leave approval Specification
document: 03-leave-approval.md
version: 2.2
status: Draft
---

# 1. Purpose and Scope

Leave Approval governs the decisioning workflow for leave requests, including validation, approval routing, team-impact visibility, delegation, escalation, and final balance consumption.

In scope:

- Leave request routing and decision flow
- Approval and delegation rules
- Team conflict and coverage visibility
- Change, cancellation, and withdrawal handling
- Balance, policy, and attendance interaction at decision time

# 2. Business

Leave approval is where policy, employee experience, and operational continuity meet. Approvers need enough context to make fair and timely decisions without exposing unnecessary private information or creating planning disruption.

Business objectives:

- Improve speed and consistency of leave decisions
- Ensure every approval is based on valid balance and policy state
- Surface team and business continuity context before decision
- Maintain complete traceability of approver actions and overrides

# 3. Functional

The system shall support:

- Single-level, multi-level, sequential, and conditional approval chains
- Manager, delegated approver, backup approver, and HR-admin resolution paths
- Real-time balance revalidation and blackout-date enforcement
- Team overlap, staffing threshold, and critical-role absence visibility
- Change request, withdrawal, cancellation, and recall behavior
- Approval SLA monitoring, reminders, escalation, and auto-routing rules where configured

Detailed rules:

- Final approval must revalidate balance, policy, and employment status before commit
- If the primary approver is on approved leave, inactive, or explicitly out of office, routing should move to a valid delegate, backup approver, or escalation target according to configured delegation policy
- Team conflict may be informational, warning, approval-condition, or blocking based on policy
- Delegated approval must remain bounded to authorized scope and validity period
- Approved leave must update the downstream leave ledger and attendance-facing absence view consistently
- Retroactive cancellation or modification must follow controlled recalculation rules

# 4. UX

Primary screens:

- Apply leave screen
- Approval inbox
- Team leave calendar
- Coverage and overlap panel
- Leave exception admin monitor

UX expectations:

- Employees should understand decision status and reason without contacting HR
- Approvers should see dates, balance, history, overlap, and notes in one decision surface
- Team calendars should balance privacy with operational clarity
- Escalated items should be visually distinct from normal approvals

# 5. API

Representative APIs:

- `POST /api/v1/leave/requests`
- `GET /api/v1/leave/requests/{requestId}`
- `POST /api/v1/leave/requests/{requestId}/approve`
- `POST /api/v1/leave/requests/{requestId}/reject`
- `POST /api/v1/leave/requests/{requestId}/send-back`
- `POST /api/v1/leave/requests/{requestId}/cancel`
- `GET /api/v1/leave/requests/{requestId}/context`

# 6. Database

Core entities:

- `leave_request`
- `leave_approval_task`
- `leave_decision_log`
- `leave_team_conflict_snapshot`
- `leave_request_change`
- `leave_request_balance_snapshot`

Key fields:

- Requested dates, duration, leave type, reason, supporting document status
- Requestor, approver chain, delegation reference, escalation level
- Balance snapshot at submission and decision time
- Team overlap count, critical-role flag, staffing threshold status
- Decision code, comment, override reason, cancellation reason

# 7. Events

Published events:

- `leave.request.submitted`
- `leave.request.sent_back`
- `leave.request.approved`
- `leave.request.rejected`
- `leave.request.cancelled`
- `leave.request.escalated`

Consumed events:

- `leave.policy.assigned`
- `leave.balance.changed`
- `employee.manager.changed`
- `delegation.activated`
- `attendance.period.finalized`

# 8. Reports

Required reports:

- Pending leave approvals report
- Approval turnaround report
- Leave rejection reason report
- Escalated approval report
- Team-overlap exception report

# 9. Dashboards

Operational dashboards:

- Pending approvals by approver
- Team absence risk heatmap
- Requests nearing SLA breach
- HR-admin overrides and exceptions
- Cancellation and change-request backlog

# 10. Security

Security requirements:

- Approvers may act only within authorized team, hierarchy, and delegation scope
- HR admin override should be tightly permissioned and justification-based
- Medical or sensitive leave reasons should be masked where full visibility is not required

# 11. Audit

Audit coverage shall include:

- Submission timestamp and initial balance snapshot
- Every approval, rejection, send-back, cancellation, and override action
- Delegation use, escalation flow, and reassignment
- Balance and overlap context used at final decision

# 12. AI

AI-assisted opportunities:

- Predict likely approval delays and recommend escalation
- Summarize team coverage context for approvers
- Detect inconsistent decision patterns across similar requests

# 13. Test Cases

Core test scenarios:

- Approve valid leave within single-level chain
- Reject request due to blackout or restricted-date rule
- Escalate delayed approval after SLA breach
- Approve through valid delegated manager
- Cancel approved future leave and recalculate balance correctly

# 14. Workflows

Primary workflow:

1. Employee submits leave request.
2. System validates policy, balance, overlap, and supporting conditions.
3. Approval task is routed to configured approver chain.
4. Decision is taken, escalated, or sent back.
5. Final outcome updates leave ledger, calendar, and downstream consumers.

# 15. State Machine

Request state model:

- `Draft`
- `Submitted`
- `Pending Approval`
- `Sent Back`
- `Approved`
- `Rejected`
- `Cancelled`
- `Partially Cancelled`

# 16. Permissions

Representative permissions:

- `leave_request.create`
- `leave_request.approve`
- `leave_request.reject`
- `leave_request.cancel`
- `leave_request.override`
- `leave_request.team_calendar.view`
- `leave_request.audit.view`

# 17. Notifications

Notification scenarios:

- Approval task assigned
- Leave request approved or rejected
- Send-back requiring employee correction
- Escalation due to delay
- Approved leave later changed or cancelled

# 18. Configuration

Configurable parameters:

- Approval chain logic
- Escalation timing
- Team-overlap handling
- Cancellation cut-off
- Sensitive-reason masking behavior
- Auto-approval eligibility for selected leave types

# 19. Edge Cases

Important edge cases:

- Manager is on leave during decision window
- Employee balance changes after submission but before final approval
- Public holiday calendar changes after approval
- Delegation starts midway through an approval chain
