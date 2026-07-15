---
id: HRMS-SUB-10-03
title: TDS Specification
document: 03-tds.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

TDS governs tax deduction at source for employee payroll income, including tax regime selection, declarations, exemptions, monthly deduction, annual projection, and statutory reporting support.

In scope:

- Tax profile and regime capture
- Income projection and deduction logic
- Investment declaration and proof verification support
- Periodic TDS calculation and adjustment
- Statutory reporting, forms, and reconciliation

# 2. Business

Payroll tax compliance is highly visible to employees and regulators. Accurate TDS processing reduces year-end shocks, legal risk, and payroll escalations while supporting employee trust in payroll accuracy.

Business outcomes:

- Deduct tax accurately across payroll periods
- Support compliant treatment of declarations and proofs
- Provide transparency to employees on tax basis and projected liability
- Enable payroll and finance reconciliation with statutory submissions

# 3. Functional

The system shall support:

- Employee tax profile capture including PAN, tax regime choice, prior-employer income, and declarations
- Annual taxable income projection using earnings, exemptions, deductions, perquisites, and arrears
- Monthly tax deduction using projected-liability methods and year-to-date balancing
- Investment declaration windows, proof-submission campaigns, and verification workflows
- Tax override controls with approval and reasoning
- Support for resignations, final settlement, bonus runs, retro corrections, and multiple payrolls
- Tax worksheets, payslip tax breakup, and end-of-year statement readiness
- Reconciliation between payroll deductions, tax payable, remittance, and statutory filings

Validation rules:

- Missing or invalid statutory identifiers shall trigger exception handling before final filing output
- Tax regime changes shall follow allowed effective-date rules
- Manual tax override shall require approval and full audit trace
- Proof-verified amounts shall supersede declarations only within configured windows

# 4. UX

The user experience shall provide:

- Employee tax console for declarations, regime choice, proofs, and projection view
- Payroll review screen with taxable earnings, exemptions, and deduction trend
- Verifier workbench for proof validation and exception handling
- Finance reconciliation workspace for payroll-tax versus remittance comparison

# 5. API

Representative APIs:

- `POST /api/v1/compliance/tax-profiles`
- `POST /api/v1/compliance/tds/declarations`
- `POST /api/v1/compliance/tds/proofs`
- `GET /api/v1/compliance/tds/projections`
- `POST /api/v1/compliance/tds/recompute`
- `POST /api/v1/compliance/tds/reconciliation`

API requirements:

- Projection APIs shall return the rule version and regime used
- Proof-upload APIs shall support secure document handling and verification status
- Recompute APIs shall be idempotent by payroll period and employee population

# 6. Database

Core entities:

- `tax_profile`
- `tax_regime_selection`
- `tax_declaration`
- `tax_proof_submission`
- `tds_projection`
- `tds_deduction_result`
- `tds_reconciliation_record`

Key data requirements:

- Tax profiles shall store identifiers, residency assumptions, regime, and effective dates
- Projection records shall capture projected taxable income, deductions, tax liability, and YTD adjustment basis
- Proof records shall retain verifier outcome, document reference, and allowable amount

# 7. Events

The platform shall publish:

- `tds.profile.created`
- `tds.declaration.submitted`
- `tds.proof.verified`
- `tds.projection.calculated`
- `tds.deduction.posted`
- `tds.reconciliation.completed`

# 8. Reports

Required reports:

- Monthly TDS deduction register
- Declaration versus proof variance report
- Employees with missing PAN or tax exceptions
- Final-settlement tax adjustment report
- Payroll-tax reconciliation report

# 9. Dashboards

Dashboards shall show:

- TDS payable versus deducted trend
- Proof submission completion rate
- High-variance employees and exception cases
- Financial-year closing readiness

# 10. Security

Security controls shall include:

- Restricted access to tax identifiers and proofs
- Segregation between employee self-service, verifier, payroll, and finance roles
- Encryption of tax documents and downloadable statements
- Masking of identifiers in non-privileged views

# 11. Audit

The audit trail shall capture:

- Regime selections and changes
- Declaration edits and proof-verification actions
- Manual override of tax values
- Periodic recomputation and reconciliation results

# 12. AI

AI capabilities may include:

- Employee-facing explanation of tax projection drivers
- Detection of unusual declaration patterns or proof mismatches
- Forecast of year-end tax spikes based on current earning trend

AI guardrails:

- AI shall explain but not determine statutory rules
- Suggested tax insights shall clearly state they are informational, not legal advice

# 13. Test Cases

Minimum test coverage shall include:

- Tax regime choice updates projection correctly
- Proof verification changes allowable deduction used in payroll
- Invalid PAN triggers filing exception
- Final settlement recomputes annual tax accurately
- Retro bonus changes TDS in subsequent payroll run

# 14. Workflows

Primary workflow:

1. Employee tax profile and declarations are captured.
2. Payroll projects annual tax liability.
3. Monthly deduction runs consume updated projections.
4. Proof verification updates eligible deductions.
5. Finance reconciles deduction and remittance positions.

# 15. State Machine

Supported states:

- `profile-pending`
- `declaration-open`
- `projection-active`
- `proof-review`
- `deduction-posted`
- `exception-review`
- `closed`

# 16. Permissions

Permissions shall include:

- Maintain tax profiles
- Verify proofs
- Override tax values
- Recompute projections
- Access reconciliation and statutory outputs

# 17. Notifications

Notifications shall support:

- Declaration-window open and close reminders
- Proof submission and verifier pending alerts
- Payroll exception alerts for tax-profile defects
- Year-end readiness and closing communications

# 18. Configuration

Administrators shall configure:

- Tax slabs, cess, surcharge, and regime parameters by effective date
- Declaration categories and proof requirements
- Recompute rules for arrears and final settlement
- Filing schedules and reconciliation thresholds

# 19. Edge Cases

The design shall address:

- Employee joins mid-year with prior-employer income
- Employee changes tax regime within allowed statutory window
- Multiple payroll runs in one month alter YTD balancing
- Negative taxable income after reversals or excess recovery
- Cross-border assignee with different payroll tax treatment
