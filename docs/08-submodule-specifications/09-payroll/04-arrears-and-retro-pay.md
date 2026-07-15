---
id: HRMS-SUB-09-04
title: Arrears and retro pay Specification
document: 04-arrears-and-retro-pay.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Arrears and Retro Pay governs recalculation and settlement of past-period compensation impacts caused by late changes, corrections, effective-dated revisions, or policy updates.

In scope:

- Retroactive pay-impact detection
- Arrear computation by component and period
- Payroll-run integration and settlement
- Tax and statutory consequences of retro changes
- Audit, reconciliation, and employee explanation

# 2. Business

Retro pay is one of the most error-prone payroll areas because it crosses historical periods and affects tax, compliance, employee trust, and finance reconciliation. It requires transparent rules and traceable computation.

# 3. Functional

The system shall support:

- Trigger sources such as salary revision, attendance correction, shift allowance change, promotion, statutory rate update, and manual correction
- Period-by-period recomputation of impacted components
- Difference-only and full-rebuild calculation modes
- Adjustment of tax, PF, ESIC, and other statutory contributions where applicable
- Net-pay settlement through future payroll, off-cycle payroll, or recovery model
- Employee-facing explanation of retro adjustments on payslip or statement

Validation rules:

- Retro period shall be limited by payroll-closure and policy rules
- Negative arrears or recovery shall require specific approval if threshold exceeded
- Recalculation shall use original period rule versions unless override policy says otherwise

# 4. UX

The user experience shall provide:

- Payroll analyst retro case view with trigger source and impacted periods
- Component-wise delta comparison
- Preview before posting to payroll
- Clear employee-facing arrear breakdown

# 5. API

Representative APIs:

- `POST /api/v1/payroll/retro-cases`
- `POST /api/v1/payroll/retro-cases/{caseId}/recompute`
- `GET /api/v1/payroll/retro-cases/{caseId}/preview`
- `POST /api/v1/payroll/retro-cases/{caseId}/post`
- `GET /api/v1/payroll/employees/{employeeId}/arrear-history`

# 6. Database

Core entities:

- `retro_pay_case`
- `retro_pay_impacted_period`
- `retro_pay_component_delta`
- `retro_pay_posting_log`
- `retro_pay_statutory_adjustment`

# 7. Events

The platform shall publish:

- `retro-pay.case-created`
- `retro-pay.recomputed`
- `retro-pay.posted`
- `retro-pay.exception-detected`

# 8. Reports

Required reports:

- Retro pay register
- Recovery and negative-arrear report
- Statutory impact report
- Posted versus preview variance report

# 9. Dashboards

Dashboards shall show:

- Open retro cases
- Retro amount by trigger type
- High-risk negative or multi-period cases
- Payroll-close retro trend

# 10. Security

Security controls shall include:

- Restricted access to retro computation and posting
- Controlled ability to override rule version or effective period
- Sensitive visibility for net-pay impact and recoveries

# 11. Audit

The audit trail shall capture:

- Trigger event and recompute version
- Preview and posting actions
- Manual adjustments and approvals
- Statutory recalculation decisions

# 12. AI

AI capabilities may include:

- Detection of unusually large retro cases
- Explanation generation for employee communication
- Suggestion of likely source defect causing repeated retro corrections

# 13. Test Cases

- Promotion effective in prior period creates correct arrear
- Difference-only and rebuild modes produce expected outcomes
- Negative arrear threshold routes for approval
- Statutory recomputation uses correct historical rules
- Posted retro appears correctly in payroll result and payslip explanation

# 14. Workflows

1. Retro trigger is identified.
2. Impacted periods are recomputed.
3. Payroll analyst previews and approves posting.
4. Adjustment is included in payroll or off-cycle settlement.

# 15. State Machine

- `identified`
- `recomputing`
- `previewed`
- `approved`
- `posted`
- `cancelled`

# 16. Permissions

- Create retro case
- Recompute retro case
- Approve retro posting
- Override retro rules
- View arrear history

# 17. Notifications

- Retro exception alerts
- Approval requests
- Posting completion notices
- Employee pay-impact communication triggers

# 18. Configuration

- Retro lookback limits
- Settlement method rules
- Approval thresholds
- Statutory recomputation settings

# 19. Edge Cases

- Employee exited before retro settlement
- Multiple retro triggers affect same closed periods
- Prior period was processed under different statutory regime
- Recovery exceeds current net pay and needs installment logic
