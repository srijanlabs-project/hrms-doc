---
id: HRMS-SUB-02-06
title: Bank accounts Specification
document: 06-bank-accounts.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Bank Accounts governs the secure maintenance and controlled use of employee payment and reimbursement banking details.

In scope:

- Salary disbursement account capture
- Reimbursement and travel payout accounts
- Account verification, effective dating, and change control
- Payment-priority and split-payment rules where supported
- Downstream payroll and finance integration

# 2. Business

Bank-account management is operationally sensitive because errors directly affect employee pay, fraud exposure, and finance exceptions. The process must balance self-service convenience with strong verification and approval controls.

Business outcomes:

- Ensure accurate and timely salary or reimbursement payouts
- Reduce fraud and misdirection risk during account changes
- Support multiple banking arrangements where policy allows
- Preserve an auditable chain of account ownership and change approval

# 3. Functional

The system shall support:

- Primary and secondary bank accounts by payout purpose
- Bank name, branch, routing code, account number, account type, beneficiary name, and currency
- Employee self-service bank-change requests with maker-checker approval
- Account verification through penny drop, file upload, manual verification, or external service integration
- Effective-dated activation and deactivation of account records
- Split payout by fixed amount or percentage where payroll policy permits
- Country-specific banking formats such as IBAN, IFSC, SWIFT, sort code, or ABA
- Freeze or blackout periods near payroll cut-off to prevent late changes from affecting current run unexpectedly

Validation rules:

- One active primary salary account shall exist where payroll requires a single default account
- Account format validation shall depend on country and bank-routing schema
- Self-service bank change after payroll freeze shall route to next-cycle effective date unless approved by exception
- Bank account owner name mismatch shall trigger review or rejection based on policy

# 4. UX

The user experience shall provide:

- Secure masked display of stored account identifiers
- Guided bank-account setup with country-aware field labels and examples
- Clear notice of payroll cut-off impacts during account changes
- HR and payroll review workbench showing pending verification, risk flags, and effective dates

# 5. API

Representative APIs:

- `GET /api/v1/people/employees/{employeeId}/bank-accounts`
- `POST /api/v1/people/employees/{employeeId}/bank-accounts`
- `POST /api/v1/people/bank-accounts/{accountId}/verify`
- `POST /api/v1/people/bank-accounts/{accountId}/activate`
- `POST /api/v1/people/bank-accounts/change-requests`

API requirements:

- Account numbers shall be masked in non-privileged responses
- Verification endpoints shall capture method and provider response
- Change-request APIs shall return payroll-cutoff impact warnings

# 6. Database

Core entities:

- `employee_bank_account`
- `bank_account_verification`
- `bank_account_change_request`
- `bank_payout_allocation`
- `bank_country_format_rule`

Key data requirements:

- Bank accounts shall store purpose, currency, priority, and active window
- Verification records shall capture provider, confidence, and reviewed outcome
- Change requests shall preserve previous active account linkage

# 7. Events

The platform shall publish:

- `employee.bank-account.created`
- `employee.bank-account.updated`
- `employee.bank-account.verified`
- `employee.bank-account.change-approved`
- `employee.bank-account.payout-impact-detected`

# 8. Reports

Required reports:

- Unverified bank-account report
- Bank-account change audit report
- Payroll cut-off change exception report
- Multi-account payout configuration report

# 9. Dashboards

Dashboards shall show:

- Pending account verification workload
- High-risk bank-change requests
- Employees without valid payout accounts
- Change volume near payroll cut-off

# 10. Security

Security controls shall include:

- Strong encryption and masking of banking data
- Segregation of duties between request, approval, and payout processing
- Download restrictions for bank-detail exports
- High-risk change alerts for unusual account updates

# 11. Audit

The audit trail shall capture:

- All bank-detail changes with before and after values
- Verification attempts and results
- Approvals, rejections, and cut-off exceptions
- Access to unmasked banking information

# 12. AI

AI capabilities may include:

- Risk scoring for suspicious bank-detail changes
- Detection of inconsistent beneficiary or routing combinations
- Guidance assistant for employees entering country-specific bank fields

AI guardrails:

- AI shall not approve bank changes
- Fraud-risk scoring shall remain advisory and reviewable

# 13. Test Cases

Minimum test coverage shall include:

- Invalid routing format is blocked for configured country
- Payroll-cutoff bank change is deferred or escalated correctly
- Unauthorized user cannot view full account number
- Split-payment configuration totals validate correctly
- Verification failure prevents account activation

# 14. Workflows

Primary workflow:

1. Employee or HR adds or changes bank account.
2. System validates format and checks cut-off policy.
3. Verification and approval steps run.
4. Approved account becomes effective on eligible date.
5. Payroll consumes active payout account for next valid cycle.

# 15. State Machine

Supported states:

- `draft`
- `pending-verification`
- `pending-approval`
- `approved`
- `active`
- `rejected`
- `inactive`
- `superseded`

# 16. Permissions

Permissions shall include:

- View masked bank details
- View full bank details
- Add or edit bank accounts
- Approve bank changes
- Export payroll payout details

# 17. Notifications

Notifications shall support:

- Employee submission confirmations
- Approver task alerts
- Verification-failure notices
- Payroll-impact notifications for late changes

# 18. Configuration

Administrators shall configure:

- Country-specific bank formats
- Approval rules for account changes
- Payroll cut-off handling
- Allowed payout purposes and split-payment policies

# 19. Edge Cases

The design shall address:

- Employee has no bank account and requires cash or manual payment exception
- Same bank account used by spouses or family members in payroll population
- International payout requires foreign currency and intermediary bank data
- Bank account becomes invalid after payroll pre-processing
- Urgent fraud case requires immediate deactivation of active account
