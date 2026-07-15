---
id: HRMS-SUB-10-05
title: Compliance calendar Specification
document: 05-compliance-calendar.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Compliance Calendar governs the planning, assignment, tracking, and evidence management of recurring statutory, regulatory, contractual, and internal compliance obligations across HR and payroll operations.

In scope:

- Obligation master and due-date planning
- Task assignment and escalation
- Filing, payment, and evidence capture
- Dependency tracking and completion certification
- Periodic control monitoring and exception handling

# 2. Business

A compliance calendar is the operational command center for regulatory discipline. It turns legal obligations into trackable tasks so nothing depends on memory, spreadsheets, or individual heroics.

Business outcomes:

- Reduce missed filings and late payments
- Improve visibility across distributed HR, payroll, and finance teams
- Centralize proof of compliance completion
- Support internal audit and regulator readiness

# 3. Functional

The system shall support:

- Obligation definition by jurisdiction, legal entity, module, frequency, and owner
- One-time, monthly, quarterly, annual, event-driven, and ad hoc obligations
- Due dates, reminder offsets, escalation paths, and dependency chains
- Attachment of generated reports, challans, acknowledgments, and payment proofs
- Task completion certification with maker-checker support
- Recurring schedule generation using business-calendar awareness
- Exception logging for delayed, waived, or disputed obligations
- Dashboard filters by owner, risk level, jurisdiction, and overdue status

Validation rules:

- Obligations cannot be marked complete without required evidence where configured
- Frequency changes shall preserve historical obligation instances
- Closed periods shall prevent silent deletion of missed compliance tasks
- Escalation thresholds shall respect business holidays and approved extensions

# 4. UX

The user experience shall provide:

- Calendar and list views of obligations
- Color-coded risk indicators for upcoming, due, overdue, and blocked tasks
- Owner inbox with sortable workload and dependency status
- Compliance case view showing task details, evidence, comments, and approval trail
- Executive view summarizing enterprise risk posture

# 5. API

Representative APIs:

- `POST /api/v1/compliance/obligations`
- `POST /api/v1/compliance/calendar/generate`
- `PATCH /api/v1/compliance/tasks/{taskId}`
- `POST /api/v1/compliance/tasks/{taskId}/complete`
- `POST /api/v1/compliance/tasks/{taskId}/evidence`
- `GET /api/v1/compliance/calendar/dashboard`

API requirements:

- Generation APIs shall be idempotent for period and obligation scope
- Completion APIs shall enforce maker-checker and evidence policy
- Dashboard APIs shall support risk-based filtering and pagination

# 6. Database

Core entities:

- `compliance_obligation`
- `compliance_task_instance`
- `compliance_task_dependency`
- `compliance_evidence`
- `compliance_escalation_rule`
- `compliance_exception_case`

Key data requirements:

- Obligation records shall store jurisdiction, owner role, frequency, due-date rule, and evidence requirements
- Task instances shall capture status, due date, completion actor, and risk severity
- Exception cases shall retain reason, extension approval, and resolution status

# 7. Events

The platform shall publish:

- `compliance.task.generated`
- `compliance.task.due-soon`
- `compliance.task.overdue`
- `compliance.task.completed`
- `compliance.exception.opened`
- `compliance.exception.closed`

# 8. Reports

Required reports:

- Obligation completion report by period and jurisdiction
- Overdue and exception aging report
- Evidence completeness report
- Owner workload and SLA report
- Repeat non-compliance trend report

# 9. Dashboards

Dashboards shall show:

- Upcoming obligations by next 7, 15, and 30 days
- High-risk overdue tasks
- Completion rate by owner and legal entity
- Exception concentration by compliance domain

# 10. Security

Security controls shall include:

- Role-based access to obligation content and evidence artifacts
- Tamper-resistant completion certification
- Restricted deletion of obligations and evidence
- Secure storage of regulator acknowledgments and payment proofs

# 11. Audit

The audit trail shall capture:

- Obligation creation and schedule changes
- Task status updates and completion certification
- Evidence upload, replacement, and removal
- Extensions, waivers, and escalations

# 12. AI

AI capabilities may include:

- Prediction of likely overdue obligations based on historic behavior
- Suggested owner assignment based on task type and org structure
- Summaries of enterprise compliance risk posture

AI guardrails:

- AI shall not mark obligations complete or waive statutory tasks
- Predictions shall be clearly separated from confirmed compliance status

# 13. Test Cases

Minimum test coverage shall include:

- Recurring generation creates correct future tasks without duplicates
- Evidence-required obligation cannot close without attachment
- Overdue task triggers escalation at configured threshold
- Extension approval updates due date and audit history
- Dependency-blocked task remains non-completable until prerequisite is closed

# 14. Workflows

Primary workflow:

1. Obligations are defined and scheduled.
2. Periodic task instances are generated.
3. Owners complete filings or payments and attach evidence.
4. Checker verifies and closes task where required.
5. Exceptions and overdue items escalate until resolved.

# 15. State Machine

Supported states:

- `scheduled`
- `open`
- `in-progress`
- `awaiting-checker`
- `completed`
- `overdue`
- `waived`
- `cancelled`

# 16. Permissions

Permissions shall include:

- Create and edit obligations
- Complete compliance tasks
- Approve or reject completion
- Upload and manage evidence
- Waive or extend obligations
- View enterprise risk dashboards

# 17. Notifications

Notifications shall support:

- Advance reminders by configurable offsets
- Same-day due alerts
- Overdue escalations to managers and control owners
- Completion and checker pending notifications

# 18. Configuration

Administrators shall configure:

- Obligation libraries and categories
- Frequency and due-date logic
- Reminder and escalation rules
- Evidence requirements and maker-checker controls
- Risk ratings and dashboard thresholds

# 19. Edge Cases

The design shall address:

- Regulator portal outage near deadline
- Obligation due on weekend or public holiday
- One filing satisfies multiple internal obligations
- Ownership changes after task generation
- Emergency compliance task inserted mid-cycle outside standard schedule
