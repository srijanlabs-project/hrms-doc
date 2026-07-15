---
id: HRMS-SUB-17-02
title: Reimbursements Specification
document: 02-reimbursements.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Reimbursements governs the settlement of approved employee payables arising from expense claims, eligible benefits, travel advances, payroll-paid claims, and other organization-approved employee recoverables.

In scope:

- Reimbursement payable creation and validation
- Payment channel routing and batching
- Netting with advances and recoveries
- Payroll, AP, bank, or wallet settlement
- Payment confirmation, exception handling, and reconciliation

# 2. Business

Reimbursements are the moment when approved employee obligations become money movement. This makes the capability operationally sensitive across payroll timing, banking data, finance controls, employee trust, tax treatment, and reconciliation accuracy.

Business objectives:

- Pay employees accurately and on time for approved reimbursable amounts
- Prevent duplicate, failed, or misrouted payments
- Support different settlement channels without losing end-to-end traceability
- Reconcile approval, payable, payment, and accounting outcomes cleanly

Key stakeholders:

- Finance and Shared Services
- Payroll Operations
- Employees and Managers
- Treasury or Banking Operations
- Audit and Compliance

# 3. Functional

The system shall support:

- Creation of reimbursement payables from approved upstream sources such as expense claims, travel settlement, benefit reimbursement, or manual approved adjustment
- Settlement channels such as payroll, AP, bank transfer, wallet, or local payment network
- Batch creation by payment date, entity, currency, settlement channel, or urgency
- Netting with travel advances, card recoveries, or other employee liabilities
- Bank-detail validation, payee readiness checks, and payment-file generation
- Payment success, rejection, return, partial failure, and reversal handling
- Reconciliation with bank confirmations, AP vouchers, or payroll payment outcomes

Detailed rules:

- A reimbursement must not be paid twice even if upstream approval is replayed or re-exported
- Settlement channel may depend on country, employee type, amount, currency, tax treatment, or legal-entity policy
- Reimbursement payable should preserve original claim or source-line traceability for audit and employee inquiry
- Failed payment must route into explicit exception handling rather than silent infinite retry
- Netting order and recoveries must follow defined financial-priority rules

# 4. UX

Primary screens:

- Reimbursement payable queue
- Settlement batch cockpit
- Payment exception workbench
- Reconciliation dashboard
- Employee reimbursement history
- Bank-readiness validation view

UX expectations:

- Finance users should see payable amount, source, employee, bank readiness, netting, and channel in one view
- Employees should be able to track payment state without needing support intervention
- Exception queues should distinguish master-data issues, bank rejects, payment returns, and reconciliation breaks
- Batch screens should allow controlled bulk actions with strong confirmation messaging

# 5. API

Representative APIs:

- `POST /api/v1/expense-management/reimbursements`
- `GET /api/v1/expense-management/reimbursements/{reimbursementId}`
- `POST /api/v1/expense-management/reimbursements/batches`
- `POST /api/v1/expense-management/reimbursements/batches/{batchId}/release`
- `POST /api/v1/expense-management/reimbursements/{reimbursementId}/reverse`
- `POST /api/v1/expense-management/reimbursements/reconcile`
- `POST /api/v1/expense-management/reimbursements/{reimbursementId}/reroute`

API expectations:

- Payable-creation APIs must enforce idempotency across upstream approvals and export attempts
- Batch-release APIs should preserve the exact payment instruction snapshot released
- Reversal and reroute APIs must require reason, approver, and downstream reconciliation behavior
- Reconciliation APIs should support file-based and event-based confirmation ingestion

# 6. Database

Core entities:

- `reimbursement_payable`
- `reimbursement_batch`
- `reimbursement_payment_instruction`
- `reimbursement_reconciliation_result`
- `reimbursement_failure_case`
- `reimbursement_netting_entry`
- `reimbursement_channel_rule`

Key fields:

- Payable reference, employee ID, source module, source record, amount, currency, status
- Payment channel, bank account reference, payroll run reference, AP voucher reference, tax treatment
- Batch ID, payment date, released by, release timestamp, settlement file reference
- Failure reason, retry eligibility, return amount, reversal state, reroute flag
- Advance adjustment amount, net payable amount, residual balance, netting priority
- Channel rule, legal entity, threshold, urgency behavior

Data design expectations:

- Payment instructions should be immutable once released, with corrections producing new instruction lineage
- Reconciliation results should link both to external confirmation source and internal payment instruction
- Netting records must preserve original gross, adjusted, and final payable values

# 7. Events

Published events:

- `reimbursement.created`
- `reimbursement.validated`
- `reimbursement.batched`
- `reimbursement.released`
- `reimbursement.failed`
- `reimbursement.paid`
- `reimbursement.reversed`

Consumed events:

- `expense_claim.approved`
- `travel_advance.issued`
- `employee.bank.updated`
- `payment.confirmation.received`
- `payroll.offcycle_completed`

# 8. Reports

Required reports:

- Reimbursement pending report
- Payment failure and return report
- Reimbursement channel report
- Advance-netting report
- Reconciliation mismatch report
- Duplicate-payment prevention report

# 9. Dashboards

Operational dashboards:

- Reimbursements awaiting release
- Failed or returned payments
- Average settlement cycle time
- Netting impact by entity
- Reconciliation completion rate
- Bank-readiness defects by employee population

# 10. Security

Security requirements:

- Payment, bank, and tax-sensitive data must follow masking, encryption, and least-privilege controls
- Batch release, reversal, and reroute rights should require elevated authorization
- Employees should see only their own reimbursement status and details
- Payment-file and bank-confirmation ingestion should be tightly controlled and auditable

# 11. Audit

Audit coverage shall include:

- Payable creation and settlement-channel assignment
- Batch release, reroute, and reversal actions
- Manual bank-detail overrides
- Netting calculations and exception decisions
- Reconciliation adjustments and payment returns

# 12. AI

AI-assisted opportunities:

- Predict likely payment failures from bank, employee, or channel history
- Cluster reconciliation breaks by root-cause type
- Recommend optimal settlement channel for low-risk populations
- Flag unusual payment timing or repeated reroute patterns

AI guardrails:

- AI must not auto-release or auto-reverse financial transactions
- Payment recommendations should always expose source evidence and confidence

# 13. Test Cases

Core test scenarios:

- Generate reimbursement from approved expense claim
- Batch and release payment through configured channel
- Net approved amount against outstanding advance
- Handle bank rejection and route for correction
- Prevent duplicate payout on replayed upstream approval
- Reverse already released but unpaid instruction through governed process

# 14. Workflows

Primary workflow:

1. Approved source transaction creates reimbursement payable.
2. System validates bank, channel, netting, and tax handling conditions.
3. Finance groups payables into settlement batch.
4. Batch is released to payroll, AP, bank, or wallet channel.
5. Confirmation and reconciliation close the payable or open an exception case.

# 15. State Machine

Reimbursement state model:

- `Created`
- `Validated`
- `Batched`
- `Released`
- `Paid`
- `Failed`
- `Returned`
- `Reversed`
- `Closed`

# 16. Permissions

Representative permissions:

- `reimbursement.view`
- `reimbursement.batch.create`
- `reimbursement.release`
- `reimbursement.reverse`
- `reimbursement.reroute`
- `reimbursement.reconcile`
- `reimbursement.audit.view`

# 17. Notifications

Notification scenarios:

- Reimbursement approved and awaiting payment
- Batch release completed
- Payment failed or returned
- Employee reimbursement paid
- Reconciliation mismatch requires finance review
- Bank-readiness issue blocks settlement

# 18. Configuration

Configurable parameters:

- Settlement channels
- Batch grouping and cut-off rules
- Netting priorities
- Retry policy for failed payments
- Reversal approval requirements
- Employee-status eligibility for payment

# 19. Edge Cases

Important edge cases:

- Employee exits after approval but before reimbursement payment
- Bank account changes after batch creation but before release
- Reimbursement is partly netted and partly paid
- Replayed payment confirmation arrives after manual reversal
- Currency control regulation requires payment through a specific local channel
