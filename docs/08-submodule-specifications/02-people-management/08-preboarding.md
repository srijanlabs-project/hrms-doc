---
id: HRMS-SUB-02-08
title: Preboarding Specification
document: 08-preboarding.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Preboarding governs the controlled period between offer acceptance and formal onboarding activation so the organization can prepare the joiner, validate prerequisites, and coordinate all day-one readiness dependencies.

In scope:

- Accepted-offer conversion into joiner case
- Pre-join checklist, communication, and document flows
- Background dependencies and readiness tracking
- Provisioning initiation before join date
- Deferment, withdrawal, no-show, and exception handling

# 2. Business

Preboarding is the conversion layer between recruitment success and actual employee joining. A weak preboarding experience increases candidate drop-off, incomplete compliance setup, delayed asset or access readiness, and poor first impressions.

Business objectives:

- Improve accepted-offer to joined-employee conversion
- Reduce manual HR follow-up and fragmented coordination
- Expose day-one blockers before they become onboarding failures
- Provide a measurable readiness model across HR, manager, IT, admin, and payroll teams

Key stakeholders:

- Recruitment and Talent Acquisition
- HR Operations
- Hiring Managers
- IT and Workplace Administration
- Payroll and Compliance Teams

# 3. Functional

The system shall support:

- Creation of a preboarding case from accepted offer, campus drive, lateral hire, or direct workforce plan event
- Carry-forward of approved offer details such as role, entity, location, joining date, salary basis, and manager
- Pre-join checklist templates by worker type, country, hiring channel, or business program
- Document collection for identity, tax, bank, education, background verification, and contract artifacts
- Readiness tracking across employee, HR, payroll, IT, security, and facilities actions
- Join-date change, hold, deferment, withdrawal, and no-show outcomes
- Promotion from preboarding to onboarding or direct activation where operating model permits

Detailed rules:

- Preboarding must not automatically create a fully active employee record before policy-approved activation point
- Sensitive candidate data should move into employee master only through explicit approved mappings
- Tasks that initiate downstream provisioning must support cancellation or reversal if the candidate withdraws
- Readiness should distinguish informational tasks from activation blockers
- Multiple accepted offers for the same person must be handled without accidental duplicate joiner cases

# 4. UX

Primary screens:

- Joiner preboarding home
- HR preboarding control center
- Pre-join checklist tracker
- Document review workspace
- Day-one readiness dashboard

UX expectations:

- Joiners should experience a guided task flow with minimal HR jargon
- HR should see blocker-driven queues ordered by upcoming join date and risk
- Hiring managers should see only role-relevant tasks, not all HR compliance detail
- Rejected items should explain what is wrong and what action is needed next

# 5. API

Representative APIs:

- `POST /api/v1/people/preboarding/cases`
- `GET /api/v1/people/preboarding/cases/{caseId}`
- `POST /api/v1/people/preboarding/cases/{caseId}/tasks/{taskId}/complete`
- `POST /api/v1/people/preboarding/cases/{caseId}/documents`
- `POST /api/v1/people/preboarding/cases/{caseId}/defer`
- `POST /api/v1/people/preboarding/cases/{caseId}/withdraw`
- `POST /api/v1/people/preboarding/cases/{caseId}/promote`

API expectations:

- Case APIs must preserve source-offer references and prevent duplicate promotion
- Document APIs should support review, rejection, resubmission, and classification
- Promotion APIs must validate blocker completion and target workflow readiness

# 6. Database

Core entities:

- `preboarding_case`
- `preboarding_task`
- `preboarding_document`
- `preboarding_communication_log`
- `preboarding_status_history`
- `preboarding_readiness_snapshot`

Key fields:

- Candidate ID, offer ID, hiring source, entity, location, target join date
- Task owner, due date, mandatory flag, blocker flag, completion status
- Document type, validation result, reviewer, expiry relevance, resubmission count
- Readiness score, risk code, deferment reason, withdrawal reason, promoter reference
- Provisioning-precheck status and downstream dependency markers

# 7. Events

Published events:

- `preboarding.case_created`
- `preboarding.document_submitted`
- `preboarding.readiness_changed`
- `preboarding.join_date_changed`
- `preboarding.withdrawn`
- `preboarding.promoted`
- `preboarding.no_show_recorded`

Consumed events:

- `recruitment.offer_accepted`
- `background_check.completed`
- `manager.assignment_changed`
- `asset.provisioning_started`

# 8. Reports

Required reports:

- Preboarding pipeline report
- Join-date readiness report
- Missing blocker item report
- Offer-to-join conversion report
- Withdrawal and no-show analysis report

# 9. Dashboards

Operational dashboards:

- Upcoming joiners by date and location
- At-risk preboarding cases
- Document review backlog
- Provisioning blockers by function
- Conversion trend by recruiter or hiring program

# 10. Security

Security requirements:

- Candidate and joiner data must follow strict need-to-know access boundaries
- Offer and compensation details should be masked for non-authorized roles
- Document access must be governed by document sensitivity and retention rules

# 11. Audit

Audit coverage shall include:

- Case creation and source-offer linkage
- Join-date changes and deferment decisions
- Withdrawal and no-show classification
- Field carry-forward overrides
- Promotion to onboarding or employee activation

# 12. AI

AI-assisted opportunities:

- Predict no-show or withdrawal risk from engagement and checklist behavior
- Recommend missing actions most likely to delay day one
- Summarize readiness for HR and manager review

# 13. Test Cases

Core test scenarios:

- Create preboarding case from accepted offer
- Delay join date and rebaseline due tasks
- Withdraw candidate after provisioning started and trigger cleanup path
- Promote only when activation blockers are cleared
- Prevent duplicate preboarding case for the same accepted offer

# 14. Workflows

Primary workflow:

1. Accepted offer creates preboarding case.
2. Joiner receives communications and completes assigned tasks.
3. HR validates documents and readiness dependencies.
4. Join date is confirmed, deferred, or withdrawn.
5. Case is promoted to onboarding or direct activation when criteria are met.

# 15. State Machine

Case state model:

- `Created`
- `In Progress`
- `Ready for Joining`
- `Deferred`
- `Withdrawn`
- `No Show`
- `Promoted`
- `Closed`

# 16. Permissions

Representative permissions:

- `preboarding.case.create`
- `preboarding.case.manage`
- `preboarding.document.review`
- `preboarding.case.withdraw`
- `preboarding.case.promote`
- `preboarding.audit.view`

# 17. Notifications

Notification scenarios:

- Welcome and reminder messages to joiner
- HR alert for unresolved blocker tasks
- Hiring manager alert for at-risk joiner
- Join-date change notification to dependent functions
- Promotion to onboarding completed

# 18. Configuration

Configurable parameters:

- Case templates by worker type and geography
- Reminder cadence
- Blocker task definitions
- Auto-promotion eligibility
- No-show classification rules
- Provisioning trigger timing

# 19. Edge Cases

Important edge cases:

- Candidate holds multiple accepted offers within the enterprise
- Join date changes after asset or account provisioning is complete
- Background check fails late in the cycle
- Candidate joins in a different entity or location than original offer
