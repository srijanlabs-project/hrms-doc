---
id: HRMS-SUB-04-01
title: Requests Specification
document: 01-requests.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Requests governs the unified employee self-service request layer used to initiate, track, and manage employee-originated service transactions across HR, payroll, workplace, and support domains.

In scope:

- Employee request catalog
- Request submission, routing, and tracking
- Attachment, comment, and approval handling
- Cross-module request orchestration
- Employee-facing visibility and SLA transparency

# 2. Business

Employees need a simple, trustworthy front door for routine HR transactions. A common request framework reduces confusion, supports standard SLA handling, and prevents fragmented ticketing across email, chat, and spreadsheets.

Business outcomes:

- Improve employee experience for common service actions
- Standardize request intake across modules
- Provide status transparency and reduce support follow-up
- Enable measurable service performance for HR operations

# 3. Functional

The system shall support:

- Request types such as personal-data updates, document requests, bank changes, tax declarations, letters, travel, reimbursements, and HR help requests
- Contextual forms that adapt by request type and employee eligibility
- Attachments, comments, reason capture, and evidence submission
- Workflow routing to manager, HR, payroll, IT, finance, or support queues
- Status tracking from draft through closure
- Ability to withdraw, resubmit, reopen, or escalate selected request types
- Display of expected SLA and current owner where policy allows
- Linkage from request to underlying source transaction or case

Validation rules:

- Employee can only initiate request types enabled for their population and country
- Mandatory attachments and fields shall vary by request type
- Duplicate open requests for same subject may be blocked or merged
- Requests with downstream payroll impact shall observe cut-off rules

# 4. UX

The user experience shall provide:

- Single request center with search, filters, and request templates
- Guided request forms with contextual help
- Status timeline showing submitted, in progress, pending approval, and closed milestones
- Mobile-ready experience for quick submissions and status checks
- Employee dashboard cards for pending actions and SLA-risk cases

# 5. API

Representative APIs:

- `GET /api/v1/ess/requests`
- `POST /api/v1/ess/requests`
- `GET /api/v1/ess/requests/{requestId}`
- `POST /api/v1/ess/requests/{requestId}/withdraw`
- `POST /api/v1/ess/requests/{requestId}/comments`

API requirements:

- Request APIs shall expose request-type metadata and eligibility rules
- Status payloads shall include workflow and SLA summary
- Linked source transaction identifiers shall be available only to authorized roles

# 6. Database

Core entities:

- `employee_request`
- `employee_request_type`
- `employee_request_attachment`
- `employee_request_comment`
- `employee_request_status_log`
- `employee_request_source_link`

Key data requirements:

- Requests shall store type, employee, current status, target module, and priority
- Status logs shall preserve workflow transitions and ownership changes
- Source links shall connect the request to generated case or transaction records

# 7. Events

The platform shall publish:

- `ess.request.created`
- `ess.request.submitted`
- `ess.request.approved`
- `ess.request.rejected`
- `ess.request.closed`
- `ess.request.sla-risk`

# 8. Reports

Required reports:

- Request volume by type and location
- SLA attainment report
- Reopen and withdrawal report
- Request backlog by owner group

# 9. Dashboards

Dashboards shall show:

- Open requests by status and priority
- SLA risk by request type
- Employee self-service adoption trend
- Most common request categories

# 10. Security

Security controls shall include:

- Access limited to own requests for employees unless delegated access exists
- Attachment scanning and secure storage
- Role-based visibility into request comments and internal notes
- Protection against unauthorized exposure of linked payroll or medical cases

# 11. Audit

The audit trail shall capture:

- Request creation, edits, withdrawal, and closure
- Workflow routing and approval actions
- Attachment upload or deletion
- Internal-note visibility changes

# 12. AI

AI capabilities may include:

- Smart request-type suggestion from employee intent
- Draft completion help for common requests
- Deflection guidance when self-service action can replace request submission

AI guardrails:

- AI shall not submit requests without user confirmation
- AI shall not expose internal routing or restricted data unnecessarily

# 13. Test Cases

Minimum test coverage shall include:

- Employee submits request with mandatory attachment
- Duplicate open request is blocked or merged correctly
- Withdrawn request no longer progresses in workflow
- Restricted internal note remains hidden from employee
- SLA-risk event fires for overdue case

# 14. Workflows

Primary workflow:

1. Employee selects request type.
2. System renders eligible form and validates inputs.
3. Request is submitted and routed.
4. Approvals or operational handling occur.
5. Employee tracks progress until closure.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `under-review`
- `pending-approval`
- `in-progress`
- `resolved`
- `closed`
- `withdrawn`

# 16. Permissions

Permissions shall include:

- Create own requests
- View own requests
- Withdraw own request
- View internal processing details
- Manage request catalog

# 17. Notifications

Notifications shall support:

- Submission confirmation
- Approval or action required alerts
- Status-change notices
- Closure and resolution messages

# 18. Configuration

Administrators shall configure:

- Request types and eligibility
- SLA rules and routing
- Required fields and attachments
- Status labels and reopen policy

# 19. Edge Cases

The design shall address:

- Employee loses eligibility after submitting request
- Request spawns multiple downstream cases
- Payroll-impact request misses cut-off mid-process
- Delegate submits request on behalf of employee
- Source transaction fails after request approval
