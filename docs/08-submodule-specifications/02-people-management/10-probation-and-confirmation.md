---
id: HRMS-SUB-02-10
title: Probation and confirmation Specification
document: 10-probation-and-confirmation.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Probation and Confirmation manages the governed assessment period between employee joining and regular employment confirmation, including review scheduling, extension, early confirmation, and unsuccessful-outcome handling.

In scope:

- Probation plan setup and tracking
- Review workflow and evidence capture
- Extension, early confirmation, and failed-probation paths
- Downstream eligibility and status effects after decision

# 2. Business

Probation is a business and risk-control stage used to confirm fit, performance, conduct, and policy compliance before an employee transitions into regular employment status. It affects benefits, leave, notice rules, and sometimes pay or employment continuity.

Business objectives:

- Ensure every applicable employee follows a controlled confirmation journey
- Reduce missed confirmation deadlines and ad hoc extension decisions
- Preserve defensible review evidence and decision rationale
- Trigger downstream policy and benefit changes accurately at confirmation

Key stakeholders:

- HR Operations
- Reporting Managers
- Business HR
- Compliance and Employee Relations
- Payroll and Benefits Administration

# 3. Functional

The system shall support:

- Probation plans by worker type, level, geography, contract type, or legal entity
- Start date, target end date, review cadence, reminder schedule, and probation milestones
- Review input from manager, HR, mentor, or secondary reviewer where required
- Decision outcomes such as confirm, extend, early confirm, transfer to alternate review, or separate
- Multiple extension cycles subject to policy maximums
- Effective-dated confirmation status update to employee master and downstream eligibility models

Detailed rules:

- Confirmation should not complete without mandatory review evidence where configured
- Extension must capture duration, reason, and approval reference
- Failed-probation outcomes should invoke employee-relations or exit path controls rather than silent status closure
- Early confirmation should be policy-controlled and may require higher approval for protected populations
- Confirmation may unlock benefits, leave eligibility, training mandates, or notice-period rules

# 4. UX

Primary screens:

- Probation case tracker
- Manager review form
- HR decision console
- Extension approval queue
- Upcoming due-case dashboard

UX expectations:

- Managers should know exactly what evidence is required and by when
- HR should see overdue, extended, and high-risk cases in one control surface
- Employees may see limited status visibility depending on policy, but not confidential reviewer notes

# 5. API

Representative APIs:

- `POST /api/v1/people/probation/cases`
- `GET /api/v1/people/probation/cases/{caseId}`
- `POST /api/v1/people/probation/cases/{caseId}/reviews`
- `POST /api/v1/people/probation/cases/{caseId}/extend`
- `POST /api/v1/people/probation/cases/{caseId}/confirm`
- `POST /api/v1/people/probation/cases/{caseId}/close-with-separation`

API expectations:

- Decision APIs must validate active case state, effective dates, and required evidence completeness
- Review APIs should support multi-reviewer workflows without overwriting prior input
- Extension and confirmation APIs must publish downstream-impacting lifecycle events

# 6. Database

Core entities:

- `probation_case`
- `probation_review`
- `probation_extension`
- `probation_decision`
- `probation_reminder_log`
- `probation_policy_assignment`

Key fields:

- Employee ID, policy plan, start date, target end date, case status
- Reviewer role, review score, competency outcome, recommendation, evidence reference
- Extension length, new end date, reason code, approver, sequence number
- Confirmation effective date, failure outcome type, downstream eligibility flags

# 7. Events

Published events:

- `probation.case_started`
- `probation.review_due`
- `probation.extended`
- `probation.confirmed`
- `probation.failed`
- `probation.case_closed`

Consumed events:

- `employee.joined`
- `employee.manager.changed`
- `employee.transfer.completed`
- `benefit.eligibility_rule.updated`

# 8. Reports

Required reports:

- Probation due report
- Overdue review report
- Confirmation outcome report
- Extension trend report
- Failed probation analysis report

# 9. Dashboards

Operational dashboards:

- Upcoming confirmations in 7, 15, and 30 days
- Overdue manager reviews
- Extension hotspots by department
- Confirmation vs failure distribution
- Cases at employee-relations risk

# 10. Security

Security requirements:

- Review comments may contain sensitive performance or conduct information
- Decision notes and failure rationales should be visible only to authorized HR and leadership roles
- Separation-related outcomes during probation may require restricted confidentiality

# 11. Audit

Audit coverage shall include:

- Policy assignment and case creation
- Review submission and later edits
- Extension approval and duration changes
- Confirmation effective-date updates
- Failed-probation outcomes and downstream initiation

# 12. AI

AI-assisted opportunities:

- Summarize reviewer inputs into decision-ready briefs
- Detect missing evidence or unusual extension patterns
- Flag organizational units with abnormal failure or delay rates

# 13. Test Cases

Core test scenarios:

- Auto-create probation case on employee join
- Confirm employee after required reviews complete
- Block confirmation when mandatory evidence is missing
- Extend probation within policy limits
- Initiate failure path and downstream actions for unsuccessful outcome

# 14. Workflows

Primary workflow:

1. Employee joins and probation case starts.
2. System schedules reminders and review checkpoints.
3. Manager and HR capture review evidence.
4. Decision is recorded as confirm, extend, or fail.
5. Employee status and dependent eligibility rules are updated.

# 15. State Machine

Case state model:

- `Active`
- `Review Due`
- `Under Review`
- `Extended`
- `Confirmed`
- `Failed`
- `Closed`

# 16. Permissions

Representative permissions:

- `probation.case.view`
- `probation.review.submit`
- `probation.extend`
- `probation.confirm`
- `probation.close_with_separation`
- `probation.audit.view`

# 17. Notifications

Notification scenarios:

- Review due reminder
- Overdue review escalation
- Extension approval requested
- Confirmation completed
- Failed-probation case routed to HR leadership

# 18. Configuration

Configurable parameters:

- Probation duration by policy
- Reminder cadence
- Mandatory review stages
- Maximum extension count
- Early-confirmation rules
- Failure-path approval requirements

# 19. Edge Cases

Important edge cases:

- Manager unavailable near the due date
- Employee changes department or manager during probation
- Multiple reviewers disagree materially on outcome
- Confirmation effective date crosses payroll or benefits cut-off
