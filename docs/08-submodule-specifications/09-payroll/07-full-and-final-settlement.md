---
id: HRMS-SUB-09-07
title: Full and final settlement Specification
document: 07-full-and-final-settlement.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Full and Final Settlement governs the final financial closure of an employee separation by consolidating earnings, deductions, recoveries, benefits impact, leave encashment, notice treatment, and payment outcomes.

In scope:

- Settlement trigger from exit lifecycle
- Final pay component calculation and consolidation
- Recoveries, offsets, and outstanding obligations
- Approval, release, and payment readiness
- Settlement statement, payout, and reconciliation

# 2. Business

Full and final settlement is a high-risk payroll and employee-relations process because it touches final wages, unpaid dues, statutory compliance, asset recoveries, leave encashment, notice pay, gratuity or local equivalents, and legal exposure. Errors can result in disputes, delayed exits, financial leakage, and compliance issues.

Business objectives:

- Ensure separated employees receive accurate and timely final settlement
- Consolidate all final pay and recovery items in one governed process
- Preserve traceability between exit events and payroll settlement outcomes
- Reduce manual off-system settlement calculations

Key stakeholders:

- Payroll Operations
- HR Operations and Exit Administration
- Finance and Accounting
- Compliance and Labor Relations
- Employee and Manager

# 3. Functional

The system shall support:

- Automatic creation of settlement case from eligible exit case
- Consolidation of unpaid earnings, prorated salary, arrears, incentives, reimbursements, leave encashment, notice pay, and severance-like payouts where applicable
- Recovery of loans, advances, asset damage, overpayment, notice shortfall, or other organization dues
- Approval and exception handling for disputed or incomplete settlement items
- Settlement through payroll run, off-cycle run, or alternate payment channel based on policy
- Settlement statement generation and acknowledgment tracking where required

Detailed rules:

- Settlement must use a governed cutoff date for source data intake
- Outstanding recoveries should be netted according to policy-defined priority order
- Negative net settlement must follow approval and recovery-handling rules
- Exit case must remain linked to settlement so date changes, rescinds, or clearance delays can trigger recalculation
- Jurisdiction-specific statutory items must be supported through local compliance configuration

# 4. UX

Primary screens:

- Full-and-final case cockpit
- Component and recovery breakdown view
- Settlement approval console
- Payment readiness and release panel
- Employee settlement statement view

UX expectations:

- Payroll users should see every included and excluded item with source reference
- HR should understand blockers coming from clearance, dates, or recoveries
- Employees should receive a readable settlement statement and payment status visibility where policy allows

# 5. API

Representative APIs:

- `POST /api/v1/payroll/fnf/cases`
- `GET /api/v1/payroll/fnf/cases/{caseId}`
- `POST /api/v1/payroll/fnf/cases/{caseId}/calculate`
- `POST /api/v1/payroll/fnf/cases/{caseId}/approve`
- `POST /api/v1/payroll/fnf/cases/{caseId}/release`
- `POST /api/v1/payroll/fnf/cases/{caseId}/recalculate`

API expectations:

- Calculation APIs must preserve snapshot references to source data used for settlement
- Recalculation APIs should declare trigger reason such as exit-date change, recovery update, or clearance completion
- Release APIs must enforce approval, bank readiness, and downstream payment-channel checks

# 6. Database

Core entities:

- `fnf_case`
- `fnf_component_result`
- `fnf_recovery_item`
- `fnf_approval`
- `fnf_payment_instruction`
- `fnf_recalculation_event`

Key fields:

- Employee ID, exit case ID, final working day, separation date, cutoff date, status
- Component category, amount, source module, source reference, inclusion flag
- Recovery type, priority, amount due, waived amount, remaining balance
- Approval status, approver, exception note, release timestamp
- Payment channel, bank readiness, payroll run reference, reconciliation status

Data design expectations:

- Component results should be snapshot-based for audit reproducibility
- Recoveries and waivers must retain original, adjusted, and approved values
- Recalculation events should maintain full before and after settlement totals

# 7. Events

Published events:

- `fnf.case_created`
- `fnf.calculated`
- `fnf.recalculated`
- `fnf.approved`
- `fnf.released`
- `fnf.paid`

Consumed events:

- `exit.closed`
- `leave.encashment_computed`
- `loan.balance_finalized`
- `asset.recovery_completed`
- `employee.bank.updated`

# 8. Reports

Required reports:

- Full-and-final pending cases report
- Recovery and waiver report
- Settlement aging report
- Negative-net settlement report
- Released but unpaid settlement report

# 9. Dashboards

Operational dashboards:

- FNF cases by stage
- Settlements blocked by clearance or missing data
- High-value recoveries and waivers
- Settlement SLA performance
- Payment release and reconciliation status

# 10. Security

Security requirements:

- Final settlement contains highly sensitive compensation and recovery data and must be tightly access-controlled
- Waiver and override rights should be limited to specific senior roles
- Employee-facing access should expose only their own finalized or approved settlement views

# 11. Audit

Audit coverage shall include:

- Case creation and source exit linkage
- Included and excluded component changes
- Recovery edits, waivers, and approvals
- Recalculation triggers and outcomes
- Payment release, reversal, and reconciliation actions

# 12. AI

AI-assisted opportunities:

- Highlight missing upstream data likely to block settlement
- Detect abnormal settlement patterns or unusually large recoveries
- Summarize settlement case readiness for payroll and HR review

# 13. Test Cases

Core test scenarios:

- Create FNF case from closed exit
- Calculate final dues with leave encashment and recoveries
- Recalculate after final working day change
- Approve and release positive net settlement
- Handle negative net outcome through governed recovery process

# 14. Workflows

Primary workflow:

1. Exit process triggers settlement case creation.
2. Payroll consolidates earnings, deductions, encashments, and recoveries.
3. Exceptions and unresolved dependencies are reviewed.
4. Authorized approvers approve the settlement.
5. Payment is released through payroll or alternate channel and reconciled.

# 15. State Machine

Case state model:

- `Created`
- `Calculating`
- `Pending Review`
- `Approved`
- `Released`
- `Paid`
- `Recalculation Required`
- `Closed`

# 16. Permissions

Representative permissions:

- `fnf.case.view`
- `fnf.case.calculate`
- `fnf.case.approve`
- `fnf.case.release`
- `fnf.case.waive_recovery`
- `fnf.audit.view`

# 17. Notifications

Notification scenarios:

- FNF case created
- Missing dependency blocks settlement
- Settlement approval requested
- Recalculation required due to exit change
- Settlement released or paid

# 18. Configuration

Configurable parameters:

- Settlement cutoff rules
- Recovery priority order
- Waiver approval requirements
- Payment channel routing
- Negative-net handling policy
- Jurisdiction-specific FNF components

# 19. Edge Cases

Important edge cases:

- Exit rescinded after settlement calculation has started
- Employee bank account changes after release approval but before payment
- Final settlement is negative because recoveries exceed dues
- Cross-border assignee requires settlement across more than one payroll context
