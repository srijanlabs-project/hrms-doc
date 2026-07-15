---
id: HRMS-SUB-09-03
title: Earnings and deductions Specification
document: 03-earnings-and-deductions.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Earnings and Deductions governs the runtime behavior of payroll component calculation, sequencing, override, recovery, and result presentation so the platform can produce consistent gross-to-net outcomes.

In scope:

- Recurring and one-time earning calculation
- Deduction, recovery, and offset behavior
- Input sourcing and calculation sequencing
- Override, exception, and retro interaction
- Result traceability for payroll, payslips, and reporting

# 2. Business

Even with strong component design, payroll quality depends on how earnings and deductions actually behave during processing. This sub-module operationalizes pay elements into employee-specific results, bringing together inputs from attendance, leave, compensation, loans, expenses, compliance, and manual adjustments.

Business objectives:

- Produce accurate employee-level earning and deduction outcomes
- Support consistent calculation logic across companies and payroll groups
- Ensure every amount can be traced to source input and rule basis
- Reduce manual corrections, overrides, and post-pay adjustments

Key stakeholders:

- Payroll Processors and Reviewers
- Compensation and Benefits
- Finance and Tax
- Employees consuming payslip outputs
- QA and Audit Teams

# 3. Functional

The system shall support:

- Earnings such as base pay, allowances, incentives, overtime, bonuses, arrears, and reimbursements where payroll-paid
- Deductions such as tax, statutory contributions, loans, advances, penalties where lawful, benefit recoveries, and other approved recoveries
- Formula-based, fixed-value, slab-based, prorated, lookup-based, and source-driven calculations
- Component sequencing with dependency awareness
- Caps, floors, minimum payout, maximum deduction, and carry-forward logic
- Manual override or input adjustment where authorized
- Retroactive recalculation and arrears interaction

Detailed rules:

- Sequence must be deterministic and visible in trace output
- Components may affect gross, taxable gross, contribution wage, employer cost, posted cost, or net pay differently
- Negative component outcomes must be explicitly governed, not silently accepted
- One-time inputs must respect payroll period, employee, batch, and approval scope
- Deductions should support partial recovery, priority-based recovery, and remainder carry-forward where policy allows
- Manual overrides should preserve original system-calculated values alongside approved final values

# 4. UX

Primary screens:

- Payroll component result view
- Employee payroll trace workspace
- Input and override workbench
- Payslip preview and explanation panel
- Recovery and deduction monitor

UX expectations:

- Payroll users should be able to explain any amount at employee level without external spreadsheets
- Calculation trace should show source values, rule steps, sequence order, and final outputs
- Overrides should highlight before, after, approver, reason, and downstream impact
- Payslip views should distinguish informational components from pay-affecting components

# 5. API

Representative APIs:

- `POST /api/v1/payroll/components`
- `PUT /api/v1/payroll/components/{componentId}`
- `POST /api/v1/payroll/components/{componentId}/rules`
- `POST /api/v1/payroll/component-inputs`
- `GET /api/v1/payroll/components/{componentId}/trace`
- `POST /api/v1/payroll/component-results/{resultId}/override`

API expectations:

- Input APIs must validate source scope, duplicate submission risk, and period alignment
- Trace APIs should return human-auditable calculation lineage
- Override APIs must require permission, reason, and approval context where configured

# 6. Database

Core entities:

- `pay_component`
- `pay_component_version`
- `pay_component_rule`
- `pay_component_input`
- `pay_component_result`
- `pay_component_override`
- `pay_component_recovery_balance`

Key fields:

- Component code, type, category, frequency, payroll-group applicability
- Formula expression, reference component, rounding mode, cap, floor, priority
- Employee input value, source batch, source module, effective period, approval status
- Calculated amount, sequence position, gross impact, tax impact, net impact, trace token
- Override value, system value, reason, approver, timestamp
- Recovery balance carried forward, recovered amount, residual amount

Data design expectations:

- Result data must preserve both pre-override and final values
- Recovery balances should support cross-period persistence
- Trace tokens should link to frozen rule and input snapshots used for the calculation

# 7. Events

Published events:

- `pay.component.input_loaded`
- `pay.component.calculated`
- `pay.component.override_requested`
- `pay.component.override_applied`
- `pay.component.recovery_carried_forward`

Consumed events:

- `salary.structure.changed`
- `attendance.overtime.exported`
- `loan.installment.due`
- `expense.claim.approved`
- `leave.encashment_computed`

# 8. Reports

Required reports:

- Component master report
- Component-wise payroll amount report
- Override report
- Deduction recovery report
- Taxable and non-taxable component split report
- Negative-result and anomaly report

# 9. Dashboards

Operational dashboards:

- High-value component movements
- Missing source input exceptions by component
- Override frequency by payroll processor
- Component cost distribution by entity
- Recoveries carried forward across periods

# 10. Security

Security requirements:

- Sensitive compensation components should be visible only to authorized payroll and compensation roles
- Override and recovery-waiver rights must be tightly permissioned
- Formula, trace, and result views may expose salary-sensitive detail and should follow organizational scope rules

# 11. Audit

Audit coverage shall include:

- Input load and manual input changes
- Calculation-rule version consumed
- Overrides and approval rationale
- Recovery adjustments and carry-forward behavior
- Result correction and rerun lineage

# 12. AI

AI-assisted opportunities:

- Detect anomalous results relative to employee history or peer cohorts
- Recommend likely cause of a calculation failure or abnormal variance
- Highlight components most likely to require payroll review before approval

AI guardrails:

- AI may recommend review but must not auto-override payroll results
- Sensitive salary data should be masked or scope-controlled in analytical summaries

# 13. Test Cases

Core test scenarios:

- Calculate recurring earning with deterministic trace
- Apply capped deduction with partial carry-forward
- Reject invalid negative amount where policy disallows
- Recalculate after dependent source input change
- Preserve audit trail when manual override is applied
- Compute recovery priority when multiple deductions compete

# 14. Workflows

Primary workflow:

1. Inputs are loaded from source systems or manual entry.
2. Payroll engine resolves applicable components and sequence.
3. Earnings and deductions are calculated with traceable results.
4. Exceptions and overrides are reviewed where required.
5. Final results flow to payroll run, payslip, accounting, and statutory outputs.

# 15. State Machine

Result state model:

- `Loaded`
- `Calculated`
- `Pending Review`
- `Overridden`
- `Approved`
- `Reversed`

# 16. Permissions

Representative permissions:

- `pay_component_result.view`
- `pay_component_input.manage`
- `pay_component_override.request`
- `pay_component_override.approve`
- `pay_component_trace.view`
- `pay_component_audit.view`

# 17. Notifications

Notification scenarios:

- Missing or invalid source input
- Override approval required
- High-value or high-variance result detected
- Recovery carry-forward created
- Rerun changed previously reviewed result

# 18. Configuration

Configurable parameters:

- Sequence rules
- Override approval thresholds
- Recovery priority and carry-forward rules
- Rounding and precision behavior
- Negative-result handling
- Payslip display mappings

# 19. Edge Cases

Important edge cases:

- Same employee has overlapping one-time and recurring component inputs
- Deduction exceeds available net pay and must be split across periods
- Retro correction changes a component already posted to finance
- Currency-based input requires conversion before calculation
- Multiple source systems submit conflicting values for the same earning
