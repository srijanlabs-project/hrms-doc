---
id: HRMS-SUB-02-09
title: Onboarding Specification
document: 09-onboarding.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Onboarding governs the transition from accepted hire to productive employee. It coordinates employee data completion, document capture, approvals, provisioning, induction, and day-one readiness.

In scope:

- Pre-joining and joining tasks
- Document and compliance checklist management
- Employee, manager, HR, IT, admin, and payroll onboarding actions
- Provisioning dependencies
- Join-date activation readiness
- Digital onboarding workflows with e-signature-enabled documents, acknowledgements, and consent capture where required

# 2. Business Context

Poor onboarding leads to delayed productivity, compliance gaps, missing documents, payroll delays, and negative employee experience.

Business outcomes:

- Standardize new-joiner readiness across entities and geographies
- Reduce manual follow-up by HR
- Ensure employee, payroll, IT, and compliance readiness before activation
- Provide clear accountability for every onboarding task

# 3. Actors and Responsibilities

Primary roles:

- Candidate or joining employee
- HR Operations
- Reporting Manager
- IT Support
- Admin or Facilities Team
- Payroll Team

Responsibilities:

- Employee completes personal, statutory, banking, and document requirements
- HR validates identity, employment data, and checklist completion
- Manager confirms team readiness, role context, and induction support
- IT and admin teams complete access, asset, and workplace provisioning
- Payroll verifies pay-impacting onboarding data before cut-off

# 4. Functional Behavior

The system shall support:

- Onboarding checklist templates by worker type, geography, and company
- Task ownership across employee, HR, manager, IT, admin, and payroll actors
- Document upload, review, rejection, and resubmission
- Join-date readiness tracking
- Dependency management between tasks
- Joiner conversion from onboarding to active employee state

Detailed requirements:

- Checklist items may be mandatory, optional, informational, or conditional
- Certain tasks must block activation until completed
- Join-date readiness must be visible through a consolidated status
- Provisioning actions may trigger downstream systems or service tickets
- HR should be able to reopen incomplete or rejected onboarding steps

# 5. Data and Field Design

Core entities:

- `onboarding_case`
- `onboarding_checklist_template`
- `onboarding_task`
- `onboarding_document`
- `onboarding_validation_result`
- `onboarding_provisioning_request`

Important field groups:

- Candidate or employee identifiers
- Proposed join date and employing entity context
- Checklist task type, owner, due date, and status
- Required document type and validation result
- Provisioning request identifiers and completion state
- Final readiness score and blocking issues

# 6. UX and Interaction Model

Primary screens:

- Joiner onboarding home
- HR onboarding control center
- Checklist tracker
- Document upload and review screen
- Provisioning and dependency tracker

UX expectations:

- The joiner should see a simple task-driven experience, not complex HR terminology
- HR should see blocker-focused readiness views
- Managers should see only tasks and data relevant to their role
- Rejected or incomplete tasks should clearly explain next action

# 7. API and Service Contracts

Representative APIs:

- `POST /api/v1/people/onboarding/cases`
- `GET /api/v1/people/onboarding/cases/{caseId}`
- `POST /api/v1/people/onboarding/cases/{caseId}/tasks/{taskId}/complete`
- `POST /api/v1/people/onboarding/cases/{caseId}/documents`
- `POST /api/v1/people/onboarding/cases/{caseId}/activate`

API expectations:

- Activation API must reject incomplete blocking items
- Document APIs must support validation and resubmission paths
- Provisioning-related actions must carry correlation IDs to downstream systems

# 8. Workflow and Business Rules

Rules to support:

- Mandatory tasks by worker type
- Document requirements by country and company
- Payroll cut-off dependency for bank and tax completion
- IT provisioning dependency before join-date readiness
- Join-date reschedule behavior

Typical workflow:

1. Candidate is converted to onboarding case after offer acceptance.
2. System creates checklist based on policy template.
3. Employee and internal teams complete tasks.
4. HR validates mandatory items and unresolved exceptions.
5. On join date, system activates employee when blockers are clear.

# 9. State Machine

Case states:

- Created
- In Progress
- Ready for Join Date
- Blocked
- Activated
- Cancelled

Task states:

- Not Started
- In Progress
- Submitted
- Approved
- Rejected
- Waived
- Completed

# 10. Events and Notifications

Published events:

- `onboarding.case.created`
- `onboarding.task.assigned`
- `onboarding.document.rejected`
- `onboarding.ready-for-activation`
- `onboarding.employee.activated`

Notifications:

- New onboarding task assignment
- Reminder before due date
- Document rejected or resubmission required
- Join date approaching with blockers
- Employee activated successfully

# 11. Reports and Dashboards

Reports:

- Upcoming joiners report
- Onboarding completion report
- Blocked onboarding cases report
- Provisioning readiness report

Dashboards:

- Joiners by readiness state
- Task backlog by owner group
- Missing document trend
- Join-date risk panel

# 12. Security, Permissions, and Audit

Security requirements:

- Joiners should only access their own onboarding case
- HR should see onboarding cases within assigned organizational scope
- Sensitive documents must be protected with role-based access

Audit requirements:

- Task status changes
- Document uploads, rejections, and approvals
- Readiness overrides and activation actions

# 13. Configuration

Configurable items:

- Checklist templates
- Blocking vs non-blocking tasks
- Reminder and escalation timing
- Join-date activation rules
- Provisioning task categories

# 14. Edge Cases and Exception Handling

- Candidate join date postponed after provisioning started
- Employee joins without bank details before payroll cut-off
- Mandatory document unavailable due to local regulatory timing
- Manager not assigned before onboarding begins
- Candidate withdraws after most tasks are complete

# 15. Test Scenarios

- Create onboarding case from accepted offer
- Complete joiner and internal tasks
- Reject invalid document and resubmit
- Block activation because of missing mandatory tasks
- Reschedule join date and verify task timelines
- Activate employee and verify downstream status change

# 16. Dependencies and Integrations

Dependencies:

- Recruitment and ATS
- People Management
- Document Management
- Workflow engine
- Notification framework

Integrations:

- Identity provisioning
- IT ticketing or asset systems
- Payroll setup
- Communication channels

# 17. Assumptions

- Recruitment delivers sufficient hire data to create onboarding case
- Checklist policy ownership is defined by HR operations
- Join-date activation rules may vary by worker type and geography
