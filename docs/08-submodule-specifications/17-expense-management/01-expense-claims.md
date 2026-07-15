---
id: HRMS-SUB-17-01
title: Expense claims Specification
document: 01-expense-claims.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Expense Claims governs the capture, validation, approval, compliance review, and settlement preparation of employee-initiated business expense requests.

In scope:

- Expense report creation and line-item entry
- Receipt capture, OCR, and documentary validation
- Policy, budget, duplicate, and fraud-risk checks
- Approval and finance review workflow
- Handoff to reimbursement, accounts payable, or payroll settlement channels

# 2. Business

Expense claims are a financial-control process as much as an employee self-service feature. The platform must allow legitimate employee recovery of business spend while enforcing company policy, tax treatment, cost allocation, and fraud controls.

Business objectives:

- Standardize the claim process across entities and employee populations
- Reduce reimbursement delay through guided, policy-aware submission
- Improve finance control over category, budget, tax, and documentary compliance
- Produce reliable spend visibility by project, cost center, trip, and policy category

Key stakeholders:

- Employees and Managers
- Finance and Shared Services
- Travel and Procurement Teams
- Payroll or AP Operations
- Audit and Compliance

# 3. Functional

The system shall support:

- Manual, web, and mobile expense entry with receipt attachment
- Single-item claims and multi-line expense report groupings
- Categories such as travel, lodging, meals, mileage, entertainment, office supplies, telecom, and misc spend
- Policy checks for claim limits, per diem, receipt thresholds, project linkage, cost-center rules, attendee count, merchant restrictions, and business-purpose completeness
- Currency handling with claim currency, policy currency, base currency, exchange rate source, and exchange date
- Approval routing by amount, category, cost center, hierarchy, project, country, or risk level
- Finance review, correction request, hold, rejection, or approval outcomes
- Conversion of approved claim into reimbursement payable or AP-style settlement item

Detailed rules:

- Receipt requirement should vary by expense category, jurisdiction, and claim amount
- Same spend event should not be claimable repeatedly through duplicates, split-line abuse, or replayed drafts
- Certain expense categories may require itinerary linkage, tax invoice details, attendee lists, policy exception reason, or trip authorization reference
- Policy violations may be blocking, warning-only, or allowed with justification and higher approval
- Corporate-card and out-of-pocket expenses should remain distinguishable for settlement handling

# 4. UX

Primary screens:

- My expense claims
- Expense report builder
- Receipt capture and OCR correction screen
- Approval inbox
- Finance audit and exception workbench
- Policy and budget insight panel

UX expectations:

- Employees should receive real-time guidance while entering claims, not only post-submission rejection
- Receipt capture should allow OCR correction with clear confidence feedback
- Approvers and finance users should see line-level exceptions, receipts, budgets, and policy rationale together
- Mobile flows should support offline capture and later sync where field operations require it

# 5. API

Representative APIs:

- `POST /api/v1/expense-management/expense-claims`
- `POST /api/v1/expense-management/expense-claims/{claimId}/lines`
- `POST /api/v1/expense-management/expense-claims/{claimId}/submit`
- `GET /api/v1/expense-management/expense-claims/{claimId}`
- `POST /api/v1/expense-management/expense-claims/{claimId}/approve`
- `POST /api/v1/expense-management/expense-claims/{claimId}/finance-review`
- `POST /api/v1/expense-management/expense-claims/{claimId}/resubmit`

API expectations:

- Submit APIs must validate policy, amount totals, documentary completeness, and duplicate-risk checks
- Approval APIs should expose approver context, financial impact, and exception counts
- Finance-review APIs should allow granular line-level outcomes without corrupting claim history
- OCR and attachment APIs should support asynchronous processing and retry-safe ingestion

# 6. Database

Core entities:

- `expense_claim`
- `expense_claim_line`
- `expense_receipt`
- `expense_policy_result`
- `expense_claim_approval`
- `expense_duplicate_check_result`
- `expense_claim_exception_case`

Key fields:

- Claim number, employee ID, entity, status, claim currency, base currency, total amount
- Expense date, category, merchant, trip reference, project, cost center, tax amount, business purpose
- Receipt file reference, OCR result, confidence score, validation status, invoice metadata
- Policy result code, severity, justification, override indicator, reviewer
- Approval chain, finance reviewer, reimbursement route, final settlement channel

Data design expectations:

- Claim and line-level statuses should remain separately traceable
- Receipt evidence should preserve original file, extracted fields, and reviewer correction history
- Duplicate-detection results should store both signal details and final operational decision

# 7. Events

Published events:

- `expense_claim.created`
- `expense_claim.submitted`
- `expense_claim.sent_back`
- `expense_claim.approved`
- `expense_claim.rejected`
- `expense_claim.sent_for_reimbursement`
- `expense_claim.flagged_for_review`

Consumed events:

- `travel.request.approved`
- `project.budget.updated`
- `currency.rate.updated`
- `employee.cost_center.changed`
- `corporate_card.statement_loaded`

# 8. Reports

Required reports:

- Expense claims aging report
- Policy violation report
- Spend by category and cost center report
- Duplicate or suspected fraud report
- Claims pending finance review report
- Out-of-pocket vs corporate-card report

# 9. Dashboards

Operational dashboards:

- Open claims by stage and SLA bucket
- Average claim turnaround time
- Top expense categories by amount
- Policy violation hotspots by business unit
- Claims at fraud-review or finance-review risk
- Receipt-quality and OCR confidence trends

# 10. Security

Security requirements:

- Expense data may reveal travel, client, disciplinary, or compensation-adjacent information and must follow scope controls
- Receipt documents must follow retention, masking, and privacy standards
- Finance override and policy-bypass rights should be tightly restricted and justification-based
- Corporate-card or executive-spend cases may require more limited visibility than standard claims

# 11. Audit

Audit coverage shall include:

- Claim creation, edit, and submission history
- Policy check results and override actions
- Approval, send-back, and finance-review decisions
- Receipt replacement, deletion, or correction actions
- Settlement-route change, duplicate-risk disposition, and fraud-review outcomes

# 12. AI

AI-assisted opportunities:

- OCR and structured extraction from receipts and invoices
- Duplicate or suspicious claim detection
- Auto-classify expense category and suggest missing metadata
- Summarize finance-review issues and likely resolution path

AI guardrails:

- AI may recommend risk flags but must not auto-reject or auto-approve claims without policy authorization
- Sensitive travel or client information must remain masked in broad analytics views

# 13. Test Cases

Core test scenarios:

- Submit multi-line claim with valid receipts
- Block submission when mandatory receipt is missing
- Detect duplicate expense date and amount pattern
- Route high-value claim to escalated approval
- Return claim for finance correction and resubmission
- Approve claim and hand off to reimbursement process

# 14. Workflows

Primary workflow:

1. Employee creates expense claim and uploads supporting documents.
2. System validates category, policy, receipts, budget context, and duplicate signals.
3. Approval workflow routes to manager or configured approver chain.
4. Finance reviews line-level compliance and settlement route.
5. Approved claim moves to reimbursement or payable processing.

# 15. State Machine

Claim state model:

- `Draft`
- `Submitted`
- `Under Approval`
- `Sent Back`
- `Finance Review`
- `Approved`
- `Rejected`
- `Paid`
- `Closed`

# 16. Permissions

Representative permissions:

- `expense_claim.create`
- `expense_claim.submit`
- `expense_claim.approve`
- `expense_claim.finance_review`
- `expense_claim.override_policy`
- `expense_claim.audit.view`

# 17. Notifications

Notification scenarios:

- Claim submitted
- Approval pending
- Claim returned for correction
- Finance review completed
- Claim flagged for duplicate or fraud review
- Reimbursement released

# 18. Configuration

Configurable parameters:

- Expense categories and policy limits
- Receipt thresholds
- Approval and finance-review matrix
- Duplicate-detection rules
- Currency-conversion source and policy
- Tax and corporate-card handling rules

# 19. Edge Cases

Important edge cases:

- Employee submits expense after policy cut-off date
- Expense is incurred in one currency and reimbursed in another
- Claim references a project closed between expense date and approval date
- Receipt image is unreadable but claim may still be legitimate with exception approval
- Corporate-card import arrives after employee already claimed same spend out-of-pocket
