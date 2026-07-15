---
id: HRMS-SUB-06-02
title: Requisitions Specification
document: 02-requisitions.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Requisitions governs the controlled creation, approval, publication, and lifecycle management of hiring requests used to open and manage recruitment demand.

In scope:

- Requisition creation and approvals
- Hiring requirements and position metadata
- Internal and external posting readiness
- Requisition status control and amendments
- Handoff to sourcing, screening, and hiring pipeline

# 2. Business

Requisitions are the operational contract between hiring managers, HR, finance, and recruiting. They formalize who is being hired, why, under what budget and timeline, and how the role should be sourced.

# 3. Functional

The system shall support:

- Requisition creation from manpower plan, vacancy, or direct approved request
- Fields for role, location, level, department, legal entity, worker type, compensation range, hiring justification, and target join date
- New, replacement, pooled, evergreen, and confidential requisition types
- Approval routing, amendment workflow, hold, cancel, and reopen actions
- Posting controls for internal-only, external-only, hybrid, or referral-enabled sourcing
- Position count tracking, pipeline summary, and closure rules

Detailed rules:

- Requisition count must not exceed approved demand without authorized override
- Confidential requisitions should restrict visibility of business context and candidates
- Role definition changes after posting should preserve amendment history and candidate communication controls
- One requisition may support multiple hires only if configured as pooled or volume hiring

# 4. UX

Primary screens:

- Requisition workspace
- Requisition creation form
- Approval and amendment timeline
- Posting readiness checklist
- Hiring pipeline summary panel

# 5. API

- `POST /api/v1/recruitment/requisitions`
- `GET /api/v1/recruitment/requisitions/{requisitionId}`
- `POST /api/v1/recruitment/requisitions/{requisitionId}/approve`
- `POST /api/v1/recruitment/requisitions/{requisitionId}/publish`
- `POST /api/v1/recruitment/requisitions/{requisitionId}/close`

# 6. Database

Core entities:

- `requisition`
- `requisition_approval`
- `requisition_amendment`
- `requisition_posting_rule`
- `requisition_hire_counter`

Key fields:

- Requisition code, type, status, headcount quantity
- Hiring manager, recruiter, department, location, target join date
- Compensation band, budget reference, business case
- Internal posting flag, external posting flag, confidentiality class

# 7. Events

- `requisition.created`
- `requisition.approved`
- `requisition.published`
- `requisition.amended`
- `requisition.closed`

# 8. Reports

- Requisition pipeline report
- Aging requisition report
- Approved vs closed requisition report
- Confidential requisition control report

# 9. Dashboards

- Open requisitions by recruiter
- Hiring-manager demand summary
- Requisition approval backlog
- Requisition aging and fill velocity

# 10. Security

- Confidential requisitions require restricted visibility
- Requisition approval and budget fields must follow scope and sensitivity rules
- Recruiter assignment changes should be auditable

# 11. Audit

- Requisition creation and edits
- Approval decisions
- Posting and amendment actions
- Close, cancel, hold, and reopen actions

# 12. AI

- Suggest posting strategy and sourcing channel mix
- Predict requisition fill difficulty
- Flag vague or biased requisition descriptions

# 13. Test Cases

- Create requisition from approved demand
- Approve and publish requisition
- Amend compensation range after approval
- Close requisition after final fill
- Block unauthorized quantity increase

# 14. Workflows

1. Hiring need is converted into requisition.
2. Approvals and checks run.
3. Requisition is published internally or externally.
4. Candidate pipeline progresses until hire count is met.
5. Requisition is closed or cancelled.

# 15. State Machine

- `Draft`
- `Submitted`
- `Approved`
- `Published`
- `On Hold`
- `Closed`
- `Cancelled`
- `Reopened`

# 16. Permissions

- `requisition.create`
- `requisition.approve`
- `requisition.publish`
- `requisition.amend`
- `requisition.close`
- `requisition.audit.view`

# 17. Notifications

- Requisition awaiting approval
- Requisition published
- Amendment submitted
- Requisition aging threshold breached

# 18. Configuration

- Requisition types
- Approval matrix
- Posting rules
- Quantity override policy
- Confidentiality classes

# 19. Edge Cases

- Manager changes after requisition approval
- Approved requisition paused due to budget freeze
- Requisition reopened after failed final offer
- Multiple hires completed faster than planned and count needs freeze
