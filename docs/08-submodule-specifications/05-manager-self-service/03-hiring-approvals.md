---
id: HRMS-SUB-05-03
title: Hiring approvals Specification
document: 03-hiring-approvals.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Hiring Approvals governs the manager-facing experience for reviewing and approving manpower requests, requisitions, interview decisions, and hiring offers where managerial authority is required.

In scope:

- Approval inbox for recruitment actions
- Review context for requisitions and candidate decisions
- Approve, reject, return, delegate, and escalate actions
- SLA and aging visibility
- Decision audit and downstream routing

# 2. Business

Hiring decisions often bottleneck at the manager layer. A focused approval experience reduces delays, improves accountability, and gives managers enough context to decide without relying on offline email threads.

# 3. Functional

The system shall support:

- Approval tasks for manpower plans, requisitions, shortlist decisions, interview outcomes, and offers
- Context cards showing position need, budget, candidate fit, compensation, and risks
- Approve, reject, request changes, delegate, and comment actions
- Queue prioritization by aging, urgency, confidentiality, and requisition criticality
- SLA visibility and escalation indicators
- Linkage to candidate profile and requisition history where allowed

Validation rules:

- Manager can act only within approval authority and delegated scope
- Confidential requisitions shall limit candidate detail until authorized
- Approval action shall enforce mandatory comment rules for rejection or return

# 4. UX

The user experience shall provide:

- Focused approval queue with quick-action shortcuts
- Side-by-side business justification and approval form
- Mobile-friendly approve or return actions for time-sensitive hiring
- Clear confidentiality badges and budget-impact indicators

# 5. API

Representative APIs:

- `GET /api/v1/mss/hiring-approvals`
- `GET /api/v1/mss/hiring-approvals/{approvalId}`
- `POST /api/v1/mss/hiring-approvals/{approvalId}/approve`
- `POST /api/v1/mss/hiring-approvals/{approvalId}/reject`
- `POST /api/v1/mss/hiring-approvals/{approvalId}/delegate`

# 6. Database

Core entities:

- `manager_hiring_approval_task`
- `manager_hiring_approval_comment`
- `manager_hiring_approval_delegation`
- `manager_hiring_approval_context_cache`

# 7. Events

The platform shall publish:

- `mss.hiring-approval.assigned`
- `mss.hiring-approval.approved`
- `mss.hiring-approval.rejected`
- `mss.hiring-approval.delegated`
- `mss.hiring-approval.overdue`

# 8. Reports

Required reports:

- Hiring approval turnaround report
- Rejection reason report
- Delegated approval report
- Overdue approval backlog report

# 9. Dashboards

Dashboards shall show:

- Pending hiring approvals
- Aging by recruitment stage
- Approval bottlenecks by manager
- Critical requisitions awaiting action

# 10. Security

Security controls shall include:

- Confidential candidate data restrictions
- Delegation controls and expiry
- Approval authority validation against policy matrix
- Audit-safe viewing of compensation and budget context

# 11. Audit

The audit trail shall capture:

- Approval decision and comments
- Delegation chain
- Context viewed before decision
- Escalation or override actions

# 12. AI

AI capabilities may include:

- Summaries of candidate and requisition context
- Prioritization suggestions based on SLA risk
- Detection of incomplete approval evidence

# 13. Test Cases

- Manager cannot approve outside authority
- Confidential requisition hides restricted details
- Delegated task expires correctly
- Rejection requires mandatory rationale
- Approval updates recruitment workflow state

# 14. Workflows

1. Hiring approval task is assigned.
2. Manager reviews business and candidate context.
3. Manager approves, rejects, returns, or delegates.
4. Recruitment workflow proceeds accordingly.

# 15. State Machine

- `assigned`
- `opened`
- `delegated`
- `approved`
- `rejected`
- `returned`
- `overdue`

# 16. Permissions

- View hiring approvals
- Approve or reject hiring approvals
- Delegate approval
- View candidate context
- View compensation context

# 17. Notifications

- New approval alerts
- SLA reminder alerts
- Escalation notices
- Delegation and completion confirmations

# 18. Configuration

- Approval authority thresholds
- Confidentiality rules
- Reminder and escalation settings
- Mandatory-comment rules

# 19. Edge Cases

- Manager changes during open approval
- Approval required after payroll or budget freeze
- Candidate withdrawn while offer approval pending
- Delegate rejects after primary manager already reviewed context
