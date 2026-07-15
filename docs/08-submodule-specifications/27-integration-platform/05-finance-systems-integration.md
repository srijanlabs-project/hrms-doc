---
id: HRMS-SUB-27-05
title: Finance systems integration Specification
document: 05-finance-systems-integration.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Finance Systems Integration governs data exchange between HRMS and finance platforms for payroll journals, accruals, reimbursements, cost allocation, and financial controls.

In scope:

- Payroll and expense postings
- Cost-center and ledger mapping
- Accrual and liability exports
- Reconciliation and exception handling
- Period-close dependency management

# 2. Business

Finance integration ensures people transactions become financially accountable entries. It is essential for payroll close, reimbursement settlement, cost attribution, and auditability.

# 3. Functional

The system shall support:

- Payroll journal export by legal entity, pay group, and ledger structure
- Expense and reimbursement postings
- Accruals for leave, bonus, payroll liability, and provisions where needed
- Chart-of-account, cost-center, project, and dimension mapping
- File, API, or middleware-based exchange patterns
- Reconciliation between HRMS totals and finance postings

Validation rules:

- Period-close exports shall use approved payroll or expense runs only
- Missing account mapping shall block affected financial posting
- Reprocessed posting shall remain idempotent and traceable

# 4. UX

The user experience shall provide:

- Finance integration monitor
- Export run summaries with totals and mismatch flags
- Mapping maintenance and missing-map alerts
- Period-close readiness view

# 5. API

Representative APIs:

- `POST /api/v1/integration/finance/postings/export`
- `GET /api/v1/integration/finance/postings/{postingId}`
- `GET /api/v1/integration/finance/reconciliation`
- `POST /api/v1/integration/finance/reprocess`

# 6. Database

Core entities:

- `finance_posting_batch`
- `finance_mapping_rule`
- `finance_reconciliation_result`
- `finance_export_error`

# 7. Events

The platform shall publish:

- `finance-posting.exported`
- `finance-posting.failed`
- `finance-reconciliation.mismatch-detected`
- `finance-posting.reprocessed`

# 8. Reports

Required reports:

- Payroll-to-finance posting report
- Missing mapping report
- Reconciliation mismatch report
- Period-close finance export report

# 9. Dashboards

Dashboards shall show:

- Posting status by period
- Reconciliation mismatches
- Failed finance exports
- Cost-dimension mapping completeness

# 10. Security

Security controls shall include:

- Restricted access to financial payloads
- Approval before final posting where required
- Segregation between mapping admin and posting operator

# 11. Audit

The audit trail shall capture:

- Mapping changes
- Export and reprocess actions
- Posting approvals
- Reconciliation adjustments

# 12. AI

AI capabilities may include:

- Mapping anomaly detection
- Suggested root-cause for mismatches
- Period-close exception summaries

# 13. Test Cases

- Missing GL mapping blocks posting
- Reprocessed export remains idempotent
- Reconciliation compares by configured dimension set
- Approved payroll run only is exportable
- Liability accrual export matches source totals

# 14. Workflows

1. Source run is finalized.
2. Finance export is generated.
3. Finance system ingests posting.
4. Reconciliation validates totals and dimensions.

# 15. State Machine

- `prepared`
- `exported`
- `posted`
- `mismatch`
- `reprocessed`
- `closed`

# 16. Permissions

- Manage finance mappings
- Export finance postings
- Reprocess failed batches
- View reconciliation
- Approve postings

# 17. Notifications

- Posting failure alerts
- Missing mapping alerts
- Close-readiness notifications

# 18. Configuration

- Ledger mappings
- Dimension mappings
- Export cadence
- Reconciliation tolerances

# 19. Edge Cases

- Finance period closed while HRMS reprocess pending
- Multi-currency posting requires different treatment per entity
- Expense and payroll hit same cost object in separate runs
- Correction after finance posting already booked
