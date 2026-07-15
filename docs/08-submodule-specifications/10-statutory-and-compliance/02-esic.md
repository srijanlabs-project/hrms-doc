---
id: HRMS-SUB-10-02
title: ESIC Specification
document: 02-esic.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

ESIC governs employee state insurance applicability, contribution processing, employee registration, statutory reporting, and reconciliation for covered populations.

In scope:

- ESIC eligibility determination
- IP registration and insurance number tracking
- Contribution calculation and wage-threshold handling
- Return and remittance support
- Joiner, leaver, and wage fluctuation scenarios

# 2. Business

ESIC compliance protects both statutory posture and employee welfare coverage. Because eligibility changes with wages and category rules, the system must manage transitions carefully across payroll periods.

Business outcomes:

- Ensure accurate coverage and contributions for eligible employees
- Track insurable population changes with minimal manual follow-up
- Support period-end reporting and evidence retention
- Reduce penalties from missed or incorrect submissions

# 3. Functional

The system shall support:

- Eligibility rules based on wage thresholds, location, establishment applicability, and worker category
- Insurance number registration data and dependent details where required
- Employee and employer contribution calculation with statutory rate versioning
- Continuity of coverage rules across contribution periods as applicable
- Handling of arrears, retro payroll, unpaid leave, and mid-period status changes
- Reconciliation of payroll deductions and statutory payable
- Returns, contribution statement extracts, and payment tracking
- Exception workflows for invalid insurance numbers or ineligible deductions

Validation rules:

- ESIC coverage shall be evaluated at defined statutory checkpoints and not only on current-month gross
- Invalid registration identifiers shall block final statutory submission
- Employer and employee share changes shall trace to rate-effective dates

# 4. UX

The user experience shall provide:

- Compliance roster showing covered, excluded, and exception employees
- Payroll review panel with ESIC wage basis and contribution values
- Registration workspace for missing insurance details and correction flows
- Employee view for ESIC enrollment status where policy permits

# 5. API

Representative APIs:

- `POST /api/v1/compliance/esic/registrations`
- `GET /api/v1/compliance/esic/coverage`
- `GET /api/v1/compliance/esic/contributions`
- `POST /api/v1/compliance/esic/returns`
- `POST /api/v1/compliance/esic/reconciliation`

API requirements:

- Coverage APIs shall return eligibility reasoning and threshold version used
- Return-generation APIs shall link to source payroll run identifiers
- Correction APIs shall preserve prior statutory values for audit

# 6. Database

Core entities:

- `esic_registration`
- `esic_coverage_period`
- `esic_contribution_result`
- `esic_rate_version`
- `esic_return_batch`
- `esic_reconciliation_record`

Key data requirements:

- Coverage records shall store start and end basis, reason codes, and continuity flags
- Contribution results shall capture wage basis, employee share, employer share, and adjustments
- Return batches shall store filing status, payment reference, and extracted totals

# 7. Events

The platform shall publish:

- `esic.registration.created`
- `esic.coverage.activated`
- `esic.contribution.calculated`
- `esic.return.generated`
- `esic.reconciliation.completed`

# 8. Reports

Required reports:

- ESIC-covered employee register
- Contribution statement by payroll period
- Employees crossing threshold report
- Registration and identifier exception report
- Return versus payroll reconciliation report

# 9. Dashboards

Dashboards shall show:

- Active ESIC population and trend
- Period liability and remittance status
- Employees pending registration completion
- Compliance exception aging

# 10. Security

Security controls shall include:

- Restricted access to employee identifiers and dependent data
- Controlled correction rights for statutory master data
- Encryption for return files and payment records
- Role-based access to establishment-specific data

# 11. Audit

The audit trail shall capture:

- Coverage status changes
- Registration edits and identifier corrections
- Manual contribution adjustments
- Return generation, cancellation, and resubmission actions

# 12. AI

AI capabilities may include:

- Detection of employees likely misclassified for ESIC
- Forecasting of liability changes due to wage movement
- Reconciliation anomaly detection

AI guardrails:

- AI insights shall not replace statutory threshold logic
- Suggested corrections shall remain pending until reviewed by compliance owners

# 13. Test Cases

Minimum test coverage shall include:

- Employee becomes ESIC-covered based on configured threshold rule
- Wage fluctuation after initial coverage follows continuity policy correctly
- Invalid insurance identifier blocks return generation
- Retro adjustment updates statutory liability and reconciliation
- Excluded location never enters ESIC coverage set

# 14. Workflows

Primary workflow:

1. Population eligibility is evaluated.
2. Covered employees are registered or validated.
3. Payroll calculates ESIC each period.
4. Return and payment artifacts are generated.
5. Reconciliation and compliance closure are completed.

# 15. State Machine

Supported states:

- `not-applicable`
- `pending-registration`
- `covered`
- `exception-review`
- `return-pending`
- `remitted`
- `inactive`

# 16. Permissions

Permissions shall include:

- Manage ESIC registrations
- Review and correct coverage status
- Generate returns
- Approve manual statutory adjustments
- Access compliance reports

# 17. Notifications

Notifications shall support:

- Registration missing-data alerts
- Threshold-change review alerts
- Return due-date reminders
- Reconciliation mismatch notifications

# 18. Configuration

Administrators shall configure:

- Thresholds and rates by effective date
- Applicable establishments and worker categories
- Wage components included in ESIC basis
- Filing schedules and reconciliation rules

# 19. Edge Cases

The design shall address:

- Employee moves between ESIC-applicable and non-applicable locations
- Backdated wage correction crosses threshold
- Rehire within the same contribution period
- Employee has multiple assignment components affecting wage basis
- Statutory rate changes mid-financial year
