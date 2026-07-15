---
id: HRMS-SUB-07-06
title: Overtime Specification
document: 06-overtime.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Overtime governs how extra work time is qualified, approved, calculated, and transferred to payroll or compensatory-off outcomes.

In scope:

- Overtime eligibility policies
- Source overtime from attendance, roster variance, or manual request
- Thresholds, rounding, and caps
- Approval and exception handling
- Payroll and comp-off handoff

# 2. Business

Overtime is a high-sensitivity capability because it affects labor cost, employee fairness, statutory exposure, and manager control. Different industries may treat overtime as mandatory pay, compensatory leave, or disallowed excess time depending on worker category and law.

Business objectives:

- Ensure payable overtime is calculated consistently and defensibly
- Prevent unauthorized or non-compliant overtime settlement
- Provide managers visibility into overtime drivers and cost exposure
- Support policy variations by population, day type, and location

# 3. Functional

The system shall support:

- Eligibility rules by worker type, grade, site, union, role, or legal entity
- Overtime identification from approved attendance outcomes or manual claims
- Pre-approval, post-facto approval, and auto-qualified models
- Daily, weekly, rest-day, holiday, and special-event overtime treatment
- Thresholds, minimum qualifying blocks, and rounding rules
- Payable overtime, compensatory-off overtime, or non-payable logged excess time
- Recalculation when attendance, shift, or payroll inputs change

Detailed rules:

- Not all worked excess time qualifies as payable overtime
- Overtime multipliers may vary by day type and time band
- Hard policy caps should trigger blocking or escalation behavior
- Once payroll consumes overtime, changes should follow governed recalculation controls

# 4. UX

Primary screens:

- Overtime policy catalog
- Overtime approval inbox
- Overtime result workbench
- Employee overtime history
- Cost impact summary

UX expectations:

- Managers should understand why a claim qualified or failed
- Payroll should see payable values separately from informational time
- Employees should see status, payable basis, and next action clearly

# 5. API

Representative APIs:

- `POST /api/v1/wfm/overtime/requests`
- `GET /api/v1/wfm/overtime/results`
- `POST /api/v1/wfm/overtime/results/{resultId}/approve`
- `POST /api/v1/wfm/overtime/recalculate`
- `POST /api/v1/wfm/overtime/export-to-payroll`

API expectations:

- Calculation APIs should expose source attendance references and rule IDs
- Payroll export must be idempotent at result-line level
- Approval APIs should support delegated or escalated approval flow

# 6. Database

Core entities:

- `overtime_policy`
- `overtime_request`
- `overtime_result`
- `overtime_approval`
- `overtime_export_batch`

Key fields:

- Eligibility population, multiplier set, threshold, cap, payout mode
- Source day, source attendance record, approved minutes, rejected minutes
- Rate basis, payable amount, comp-off quantity, payroll export status
- Request reason, approver, approval timestamp, override note

# 7. Events

Published events:

- `overtime.requested`
- `overtime.qualified`
- `overtime.rejected`
- `overtime.approved`
- `overtime.recalculated`
- `overtime.exported`

Consumed events:

- `attendance.day_finalized`
- `shift.assignment_changed`
- `holiday.calendar.updated`
- `payroll.period.opened`

# 8. Reports

Required reports:

- Overtime payable report
- Overtime by team and location
- Overtime rejection reason report
- Overtime cap breach report
- Comp-off conversion report

# 9. Dashboards

Operational dashboards:

- Current-period overtime cost
- Pending overtime approvals
- Top overtime-consuming teams
- Overtime on holidays or rest days
- Cap-breach and compliance alerts

# 10. Security

Security requirements:

- Only authorized managers or payroll users may approve payable overtime
- Sensitive cost views should be restricted by organizational scope
- Override of calculated overtime must require justification and audit

# 11. Audit

Audit coverage shall include:

- Policy creation and revision
- Approval and rejection decisions
- Manual claim edits
- Recalculation triggers and results
- Payroll export actions and reversals

# 12. AI

AI-assisted opportunities:

- Predict overtime hotspots based on roster and historical demand
- Flag suspicious overtime patterns such as repeated claims near threshold boundaries
- Recommend whether workload balancing could reduce overtime spend

# 13. Test Cases

Core test scenarios:

- Qualify standard payable overtime after threshold
- Reject overtime for ineligible worker category
- Calculate holiday overtime with alternate multiplier
- Recalculate overtime after corrected attendance
- Export approved overtime to payroll once only
- Convert eligible overtime to comp-off balance

# 14. Workflows

Primary workflow:

1. Overtime source data is identified from attendance or manual claim.
2. Policy engine evaluates eligibility and rate logic.
3. Approval workflow executes where required.
4. Qualified overtime is posted to payroll or comp-off.
5. Exceptions and changes follow recalculation controls.

# 15. State Machine

Request state model:

- `Draft`
- `Submitted`
- `Under Review`
- `Approved`
- `Rejected`
- `Cancelled`

Result state model:

- `Calculated`
- `Pending Approval`
- `Approved`
- `Exported`
- `Reversed`

# 16. Permissions

Representative permissions:

- `overtime.policy.manage`
- `overtime.request.create`
- `overtime.request.approve`
- `overtime.result.override`
- `overtime.export.payroll`
- `overtime.audit.view`

# 17. Notifications

Notification scenarios:

- Overtime request submitted
- Approval pending beyond SLA
- Cap breach or compliance breach detected
- Overtime exported to payroll
- Recalculation changes previously approved result

# 18. Configuration

Configurable parameters:

- Eligibility populations
- Threshold minutes and rounding increments
- Multiplier by day type and time band
- Approval rules
- Cap and escalation policies
- Payout vs comp-off logic

# 19. Edge Cases

Important edge cases:

- Employee works beyond shift but policy disallows overtime due to no pre-approval
- Attendance correction reduces already approved overtime
- Overnight shift creates overtime across two calendar dates
- Overtime qualifies for both statutory premium and local allowance logic
- Payroll cut-off reached before pending overtime approval is completed
