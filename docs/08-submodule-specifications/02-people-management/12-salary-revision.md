---
id: HRMS-SUB-02-12
title: Salary revision Specification
document: 12-salary-revision.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Salary Revision governs employee-specific base-pay and recurring compensation changes outside or alongside broader compensation cycles.

In scope:

- Individual salary-change requests
- Effective-dated base-pay updates
- Payroll and letter-generation handoff
- Approval and budget-governance controls
- Historical salary lineage and correction handling

# 2. Business

Salary revisions occur through promotion, retention action, market correction, contract revision, annual review, or error correction. Because they affect employee trust and payroll accuracy, each change must be justified, approved, traceable, and timely.

Business outcomes:

- Support controlled employee-level pay updates
- Prevent unauthorized or poorly timed salary changes
- Preserve a clean historical compensation trail
- Ensure payroll receives correct effective-date values

# 3. Functional

The system shall support:

- Revision reasons such as promotion, annual increment, retention, market alignment, statutory change, and correction
- Current versus proposed salary comparison with fixed and percentage delta
- Effective-date control and payroll-cutoff validation
- Approval routing based on employee grade, change percentage, and budget owner
- Attachments such as recommendation letters, market data, or approval memos
- Generation of revised compensation letters or contract addenda
- Future-dated revisions, cancellation, and superseding revisions
- Integration to payroll, employee master, and compensation history

Validation rules:

- Multiple overlapping active salary revisions shall be prevented
- Retroactive salary changes shall trigger payroll-impact review
- Proposed salary shall comply with range or policy checks where configured
- Correction-type revision shall require explicit audit reason and privilege

# 4. UX

The user experience shall provide:

- Salary-revision form with current pay snapshot and impact summary
- Approval trail visibility for HR, managers, and compensation teams
- Effective-date and payroll-cutoff warnings
- Employee-facing communication or acknowledgment view where policy requires

# 5. API

Representative APIs:

- `POST /api/v1/people/salary-revisions`
- `PATCH /api/v1/people/salary-revisions/{revisionId}`
- `POST /api/v1/people/salary-revisions/{revisionId}/submit`
- `POST /api/v1/people/salary-revisions/{revisionId}/publish`
- `GET /api/v1/people/employees/{employeeId}/salary-history`

API requirements:

- Publish endpoint shall create downstream payroll change transaction idempotently
- APIs shall expose both business reason and payroll-effective outcome
- Historical salary retrieval shall support as-of-date access

# 6. Database

Core entities:

- `salary_revision_case`
- `salary_revision_component`
- `salary_revision_approval`
- `salary_revision_publish_log`
- `employee_salary_history`

Key data requirements:

- Revision case shall store current pay, proposed pay, reason, effective date, and payroll status
- Salary history shall preserve authoritative effective-date lineage
- Publish logs shall capture payroll batch reference and execution result

# 7. Events

The platform shall publish:

- `employee.salary-revision.requested`
- `employee.salary-revision.approved`
- `employee.salary-revision.published`
- `employee.salary-revision.payroll-impact-detected`

# 8. Reports

Required reports:

- Salary revision register
- Pending approvals by aging
- Retro salary change report
- Salary revision to payroll reconciliation report

# 9. Dashboards

Dashboards shall show:

- Revision volume by reason and business unit
- Pending and overdue approval cases
- Cost impact of approved but unpublished revisions
- Retro or correction-heavy trends

# 10. Security

Security controls shall include:

- Restricted visibility of current and proposed salary
- Maker-checker separation for revision entry and approval
- Controlled publish rights into payroll
- Sensitive download restrictions for salary documents

# 11. Audit

The audit trail shall capture:

- Salary values before and after change
- Reason and justification edits
- Approval and rejection decisions
- Publish, rollback, and payroll-correction outcomes

# 12. AI

AI capabilities may include:

- Detection of unusual revision patterns
- Suggested impact checklist for retro changes
- Drafting assistance for employee communication summaries

AI guardrails:

- AI shall not determine pay outcomes
- Recommendations shall remain advisory and reviewable

# 13. Test Cases

Minimum test coverage shall include:

- Overlapping salary revision is blocked
- Retroactive revision triggers payroll review flag
- Approved revision publishes correct effective pay value
- Unauthorized user cannot view proposed salary
- Superseding future-dated revision archives prior scheduled one correctly

# 14. Workflows

Primary workflow:

1. Salary revision is proposed.
2. System validates policy, timing, and overlap.
3. Approval chain reviews request.
4. Approved revision is published to employee and payroll records.
5. History and audit logs are preserved.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `under-approval`
- `approved`
- `scheduled`
- `published`
- `rejected`
- `cancelled`

# 16. Permissions

Permissions shall include:

- Create salary revision
- Approve salary revision
- Publish salary revision
- View salary history
- Correct or cancel future-dated revision

# 17. Notifications

Notifications shall support:

- Approval-task alerts
- Effective-date reminders
- Payroll publish confirmation or failure alerts
- Employee communication trigger after approval

# 18. Configuration

Administrators shall configure:

- Salary revision reason codes
- Approval thresholds and routes
- Payroll-cutoff validation rules
- Document templates and employee-notification behavior

# 19. Edge Cases

The design shall address:

- Salary revision tied to transfer but approved later than movement
- Correction to already-paid prior period
- Multiple salary components revised with different effective dates
- Revision approved after employee has entered exit process
- Currency change due to international transfer
