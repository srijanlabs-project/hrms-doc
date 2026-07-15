---
id: HRMS-SUB-08-02
title: Leave accrual Specification
document: 02-leave-accrual.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Leave Accrual is the governed process that credits, adjusts, reverses, and explains leave balances based on policy, service period, lifecycle status, and business-calendar conditions.

In scope:

- Accrual rule execution and frequency
- Pro-rata and service-based entitlement build-up
- Carry-forward, expiry, and adjustment interaction
- Balance-ledger posting and liability visibility
- Correction, reversal, and rerun governance

# 2. Business

Accrual accuracy is critical because leave balance is one of the most visible employee entitlements and often has payroll, liability, and compliance implications. Incorrect accruals create disputes, approval failures, liability misstatement, and operational rework.

Business objectives:

- Ensure policy-consistent leave balance calculation for every employee population
- Reduce manual balance corrections and disputes
- Provide transparent balance build-up and explanatory ledger history
- Support leave-liability and encashment reporting with auditable evidence

Key stakeholders:

- Leave Administration
- HR Operations
- Employees and Managers
- Payroll and Finance
- Audit and Compliance

# 3. Functional

The system shall support:

- Accrual rules by leave type, policy, company, worker group, and geography
- Credit frequencies such as monthly, quarterly, yearly, milestone-based, or event-based
- Pro-rata accrual for joiners, transfers, role changes, leavers, and lifecycle events
- Waiting-period, probation, confirmation, tenure, and service-break effects
- Carry-forward interaction and expiry handling
- Negative-balance policy interaction where configured
- Manual adjustments, reversals, and corrections with full audit trail
- Rerun or recalculation when policy or employee state changes require future-period correction

Detailed rules:

- Accrual may depend on employment status, worker type, location, tenure, confirmation state, and service continuity
- Accrual should consider unpaid leave, suspension, service interruption, or part-period eligibility where policy requires
- Policy changes should affect future accruals unless retro logic is explicitly configured and approved
- Adjustment logic must distinguish system-driven correction, policy-triggered recalculation, and manual override
- Carry-forward and expiry should be processed in the correct order relative to new-period accrual

# 4. UX

Primary screens:

- Accrual policy setup
- Accrual run monitor
- Employee balance ledger
- Adjustment and correction screen
- Liability and exception dashboard

UX expectations:

- HR admins should understand exactly why a credit or reversal was generated
- Employees should see balance history in simple business language with accrual source labels
- Admin users should clearly distinguish standard accrual, carry-forward, encashment impact, expiry, and manual adjustment entries
- Failed or partial accrual runs should surface affected populations and rule causes clearly

# 5. API

Representative APIs:

- `POST /api/v1/leave/accrual/policies`
- `POST /api/v1/leave/accrual/runs`
- `GET /api/v1/leave/accrual/ledger/{employeeId}`
- `POST /api/v1/leave/accrual/adjustments`
- `POST /api/v1/leave/accrual/runs/{runId}/reverse`
- `POST /api/v1/leave/accrual/runs/{runId}/rerun`

API expectations:

- Accrual-run APIs must be idempotent for the same policy-period scope
- Ledger APIs must return ordered, explainable balance history with before-and-after values
- Adjustment and reversal APIs must require reason, actor, and approval evidence where configured
- Rerun APIs should preserve lineage to previous accrual outcomes

# 6. Database

Core entities:

- `leave_accrual_policy`
- `leave_accrual_run`
- `leave_accrual_entry`
- `leave_balance_ledger`
- `leave_adjustment`
- `leave_accrual_exception_case`

Key fields:

- Employee ID, leave type, policy version, accrual basis, eligibility status
- Accrual period, service period, proration factor, credited quantity, unit
- Balance before, balance after, expiry amount, carry-forward amount
- Adjustment type, reversal reference, manual reason, approver
- Run status, partial-failure indicators, rerun parent reference

Data design expectations:

- Ledger must remain append-only with corrective entries rather than destructive overwrite
- Accrual entries should preserve policy-version and employee-state context used for calculation
- Liability-reporting fields should support finance aggregation without losing employee-level detail

# 7. Events

Published events:

- `leave.accrual.run.created`
- `leave.accrual.posted`
- `leave.accrual.reversed`
- `leave.accrual.adjusted`
- `leave.balance.updated`
- `leave.accrual.exception_detected`

Consumed events:

- `employee.joined`
- `employee.transferred`
- `probation.confirmed`
- `leave.policy.published`
- `loss_of_pay.finalized`

# 8. Reports

Required reports:

- Accrual posting report
- Leave liability report
- Adjustment and reversal history report
- Partial-run exception report
- Carry-forward and expiry report

# 9. Dashboards

Operational dashboards:

- Accrual run status
- Failed or partial accrual populations
- Leave-liability movement by entity
- Manual adjustment frequency
- Upcoming expiry exposure

# 10. Security

Security requirements:

- Only authorized leave admins may run accruals or post manual adjustments
- Employees may view but not alter accrual ledger
- Liability and encashment-related views may need restricted finance visibility depending on operating model

# 11. Audit

Audit coverage shall include:

- Accrual run execution and run scope
- Policy version used for each credit posting
- Manual adjustments and approvals
- Reversals, reruns, and corrective actions
- Employee-level balance changes caused by service-event updates

# 12. AI

AI-assisted opportunities:

- Predict likely accrual anomalies before run completion
- Explain unusual balance movements in employee-readable terms
- Highlight employees or groups most likely to require manual correction

AI guardrails:

- AI may explain or flag but must not directly alter balances
- Sensitive leave categories should remain scope-limited in analytics summaries

# 13. Test Cases

Core test scenarios:

- Run monthly accrual for eligible population
- Apply joiner pro-rata accrual correctly
- Defer accrual until confirmation when policy requires
- Carry forward unused balance and apply expiry rules in correct order
- Reverse erroneous accrual run and preserve audit history
- Post approved manual adjustment and reflect correct ledger balances

# 14. Workflows

Primary workflow:

1. Policy identifies eligible employees and leave types.
2. System calculates accrual quantity for the target period.
3. Ledger entries are posted and balances updated.
4. Exceptions and anomalies are reviewed by leave admin.
5. Adjustments, reversals, or reruns are executed under governance.

# 15. State Machine

Accrual run state model:

- `Created`
- `Validated`
- `Processing`
- `Posted`
- `Partially Failed`
- `Reversed`
- `Rerun Completed`

# 16. Permissions

Representative permissions:

- `leave_accrual.policy.manage`
- `leave_accrual.run`
- `leave_accrual.adjust`
- `leave_accrual.reverse`
- `leave_accrual.ledger.view`
- `leave_accrual.audit.view`

# 17. Notifications

Notification scenarios:

- Failed or partial accrual run alert
- Adjustment approval required
- Policy change affecting future accrual
- Balance anomaly detected for a population
- Expiry or carry-forward processing completed

# 18. Configuration

Configurable parameters:

- Accrual frequency and calendar
- Pro-rata formula
- Confirmation and tenure effects
- Carry-forward and expiry logic
- Manual-adjustment approval rules
- Rerun and retro-correction behavior

# 19. Edge Cases

Important edge cases:

- Employee joins and transfers entity within same accrual period
- Unpaid leave interrupts service-based accrual eligibility
- Policy revision becomes effective mid-year
- Carry-forward cap interacts with manual adjustment or encashment in same cycle
- Reversal is required after accrual already fed liability reporting
