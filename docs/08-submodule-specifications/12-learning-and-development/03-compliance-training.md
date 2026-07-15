---
id: HRMS-SUB-12-03
title: Compliance training Specification
document: 03-compliance-training.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Compliance Training governs the assignment, completion, attestation, reminder, escalation, and evidence tracking of mandatory training required by law, policy, customer obligation, safety standards, or risk controls.

In scope:

- Mandatory training requirement assignment
- Learner completion and attestation tracking
- Expiry, recurrence, and reassignment logic
- Escalation for overdue or failed completion
- Reporting and audit evidence for compliance readiness

# 2. Business

Mandatory training is often a legal and control requirement rather than a discretionary learning activity. Weak governance around it creates regulatory exposure, site risk, customer audit findings, and inconsistent policy adherence.

Business objectives:

- Ensure required learners complete mandatory training on time
- Provide reliable evidence of assignment, completion, and attestation
- Support recurring training cycles and role-change reassignment
- Reduce manual audit preparation for mandatory training compliance

# 3. Functional

The system shall support:

- Training requirement assignment by role, location, country, workforce type, risk exposure, or project
- One-time, recurring, annual, biennial, and event-triggered compliance training models
- Completion via LMS integration, internal course completion, quiz pass, attestation, or external evidence
- Due date, recurrence, grace period, reminder, escalation, and overdue logic
- Exemption, waiver, extension, and alternate-equivalency handling
- Integration to site readiness, contractor compliance, or role-eligibility checks where required

Detailed rules:

- Training recurrence should be based on completion date, due date, or policy cycle as configured
- Failed assessments may require reassignment, cooldown period, or manual intervention
- Mandatory overdue status may trigger access restriction, manager escalation, or compliance case creation
- Exemptions and waivers must be explicit, time-bound, and auditable
- Equivalent course completions should satisfy requirements only through approved equivalency mapping
- Attestation-only courses should preserve versioned policy text accepted by the learner

# 4. UX

Primary screens:

- Compliance training catalog
- Learner mandatory training dashboard
- Manager overdue completion view
- Admin escalation and exception queue
- Audit evidence export view

UX expectations:

- Learners should clearly understand what is mandatory, why, and by when
- Managers should see team-level overdue and risk indicators without searching across learning records
- Admins should quickly identify blockers such as failed LMS sync, exemption misuse, or overdue spikes

# 5. API

Representative APIs:

- `POST /api/v1/learning/compliance-training/assignments`
- `GET /api/v1/learning/compliance-training/assignments/{assignmentId}`
- `POST /api/v1/learning/compliance-training/assignments/{assignmentId}/complete`
- `POST /api/v1/learning/compliance-training/assignments/{assignmentId}/waive`
- `POST /api/v1/learning/compliance-training/assignments/{assignmentId}/reassign`
- `GET /api/v1/learning/compliance-training/status`

# 6. Database

Core entities:

- `compliance_training_requirement`
- `compliance_training_assignment`
- `compliance_training_completion`
- `compliance_training_attestation`
- `compliance_training_exception`
- `compliance_training_recurrence_rule`

Key fields:

- Requirement code, training type, applicability, recurrence model, severity
- Learner ID, assigned date, due date, overdue date, status
- Completion source, score, pass or fail status, attestation indicator
- Waiver reason, exemption type, approver, expiry
- Escalation level, manager notified, access-impact flag
- Policy version accepted, attestation timestamp, locale
- LMS source batch, duplicate-event token, equivalency reference

# 7. Events

Published events:

- `compliance_training.assigned`
- `compliance_training.completed`
- `compliance_training.overdue`
- `compliance_training.waived`
- `compliance_training.failed`
- `compliance_training.reassigned`

Consumed events:

- `employee.joined`
- `employee.role_changed`
- `contractor.activated`
- `lms.course_completed`
- `site.rule_changed`

# 8. Reports

Required reports:

- Mandatory completion report
- Overdue training report
- Exemption and waiver report
- Role-readiness training report
- Audit evidence completion report
- Assessment failure trend report
- Recurring training renewal report

# 9. Dashboards

Operational dashboards:

- Compliance completion by business unit
- Overdue learners by manager
- High-risk training gaps
- LMS sync and completion exceptions

# 10. Security

Security requirements:

- Training records may affect regulatory eligibility and should not be editable by unauthorized users
- Exemption and waiver actions must be tightly controlled
- Audit exports should include only the minimum personally identifiable data needed

# 11. Audit

Audit coverage shall include:

- Assignment generation and due-date changes
- Completion and attestation capture
- Waiver, exemption, and extension actions
- Overdue escalation events
- Evidence export and audit-access views

# 12. AI

AI-assisted opportunities:

- Predict populations at risk of missing due dates
- Recommend targeted nudges or learning support based on completion behavior
- Summarize recurring failure patterns for course design improvement

AI guardrails:

- AI nudges should respect quiet hours and employee communication preferences where applicable
- Failure-prediction outputs should not be used as punitive evidence without human review

# 13. Test Cases

Core test scenarios:

- Assign mandatory training to eligible learner set
- Mark completion through LMS integration
- Trigger overdue escalation after due date passes
- Apply approved waiver with expiry
- Reassign recurring training after completion cycle ends
- Preserve attestation text version accepted by learner
- Ignore duplicate LMS completion event without creating duplicate completion history

# 14. Workflows

Primary workflow:

1. Training requirement is defined and assigned.
2. Learners complete course or attestation.
3. System records completion and recalculates recurrence.
4. Overdue or failed learners enter escalation or exception flow.
5. Reports and compliance consumers use current completion status.

# 15. State Machine

Training assignment state model:

- `Assigned`
- `In Progress`
- `Completed`
- `Overdue`
- `Waived`
- `Expired`
- `Reassigned`

# 16. Permissions

Representative permissions:

- `compliance_training.requirement.manage`
- `compliance_training.assignment.manage`
- `compliance_training.waive`
- `compliance_training.status.view`
- `compliance_training.audit.export`
- `compliance_training_audit.view`

# 17. Notifications

Notification scenarios:

- New mandatory training assigned
- Reminder before due date
- Overdue escalation to learner and manager
- Completion recorded
- Waiver approved or expiring

# 18. Configuration

Configurable parameters:

- Recurrence model
- Reminder cadence
- Escalation workflow
- Pass or fail thresholds
- Waiver and exemption rules

# 19. Edge Cases

Important edge cases:

- Learner changes role while training is in progress
- Course provider changes but requirement remains the same
- LMS sends duplicate completion events
- Training is mandatory for contractor access at one site but not enterprise-wide
