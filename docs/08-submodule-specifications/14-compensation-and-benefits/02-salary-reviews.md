---
id: HRMS-SUB-14-02
title: Salary reviews Specification
document: 02-salary-reviews.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Salary Reviews governs the structured review of employee base pay against internal policy, market benchmarks, role changes, and performance outcomes.

In scope:

- Base salary review cycles and off-cycle reviews
- Market and range positioning analysis
- Manager recommendations and approvals
- Salary change effective dating
- Audit of review rationale and policy adherence

# 2. Business

Salary review is one of the most sensitive people processes because it directly affects retention, employee trust, and cost structure. The system must support consistency and clarity in every adjustment.

Business outcomes:

- Enable equitable and policy-aligned base pay changes
- Improve transparency of pay decisions and approval rationale
- Support retention and promotion-driven salary changes
- Strengthen market competitiveness analysis

# 3. Functional

The system shall support:

- Annual and off-cycle salary reviews
- Recommendations driven by performance, promotion, market correction, retention, or structural adjustment
- Salary range reference, compa ratio, midpoint movement, and penetration analysis
- Current versus proposed salary comparison in local and group currency
- Approval routing based on increase %, employee level, or exception type
- Effective-date management and payroll handoff
- Reason-code capture, notes, and supporting evidence attachments
- Retro correction and withdrawn-review handling

Validation rules:

- Proposed salary shall be validated against range, budget, and policy thresholds
- Off-cycle review shall require an approved reason category
- Multiple pending salary actions for the same employee shall be conflict checked
- Effective dates overlapping another pay change shall trigger review

# 4. UX

The user experience shall provide:

- Salary review worksheet with market, current pay, proposed pay, and range insight
- Highlighting for below-range, above-range, or high-increase exceptions
- Bulk approval and summary views for leaders
- Employee-facing communication preview after approval where supported

# 5. API

Representative APIs:

- `POST /api/v1/compensation/salary-reviews`
- `PATCH /api/v1/compensation/salary-reviews/{reviewId}`
- `POST /api/v1/compensation/salary-reviews/{reviewId}/submit`
- `POST /api/v1/compensation/salary-reviews/{reviewId}/approve`
- `POST /api/v1/compensation/salary-reviews/{reviewId}/publish`

API requirements:

- APIs shall validate policy thresholds and salary-range effective dates
- Publish endpoints shall create downstream pay-change transactions idempotently
- All calculations shall return both local and reference currency where configured

# 6. Database

Core entities:

- `salary_review_cycle`
- `salary_review_record`
- `salary_review_approval`
- `salary_range_reference`
- `salary_change_publish_log`

Key data requirements:

- Review records shall capture current salary, proposed salary, delta, effective date, and rationale
- Range references shall store market or internal range source, midpoint, and validity
- Publish logs shall retain downstream payroll identifiers and status

# 7. Events

The platform shall publish:

- `salary-review.created`
- `salary-review.submitted`
- `salary-review.approved`
- `salary-review.rejected`
- `salary-review.published`

# 8. Reports

Required reports:

- Salary review distribution by increase band
- Range-position improvement report
- Off-cycle reason analysis
- Approval turnaround report
- Salary change reconciliation report

# 9. Dashboards

Dashboards shall show:

- Pending salary reviews by approver
- Total cost impact of proposed changes
- Out-of-range recommendation trend
- Retention or market-correction review volume

# 10. Security

Security controls shall include:

- Fine-grained compensation visibility by planner scope
- Restricted access to executive salary changes
- Controlled access to market data if licensed
- Secure publication of finalized pay changes

# 11. Audit

The audit trail shall capture:

- Recommendation changes
- Range-source updates used during review
- Approval and rejection comments
- Effective-date changes and publish outcomes

# 12. AI

AI capabilities may include:

- Suggested increase bands based on pay position and risk indicators
- Detection of inconsistent salary-review logic across managers
- Explanation support for employee communication drafts

AI guardrails:

- AI shall not determine final base pay without human approval
- Market-data usage must respect licensing and governance constraints

# 13. Test Cases

Minimum test coverage shall include:

- Out-of-range increase triggers exception approval
- Off-cycle review without reason code is blocked
- Published salary review creates correct pay-change effective date
- Conflicting pending salary actions are detected
- Currency conversion recalculates consolidated cost correctly

# 14. Workflows

Primary workflow:

1. Salary review cycle or case is opened.
2. Manager proposes updated salary.
3. Policy, budget, and range validations run.
4. Approval chain reviews exceptions and final decision.
5. Approved salary change is published downstream.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `returned`
- `approved`
- `published`
- `withdrawn`
- `closed`

# 16. Permissions

Permissions shall include:

- Create salary reviews
- Recommend salary changes
- Approve exceptions
- Publish pay changes
- View market and range analytics

# 17. Notifications

Notifications shall support:

- Reviewer assignment and due reminders
- Exception approval alerts
- Publish completion messages
- Employee communication triggers after effective approval

# 18. Configuration

Administrators shall configure:

- Salary review calendars and populations
- Increase thresholds and reason categories
- Range sources and market benchmark mappings
- Approval matrices and payroll export rules

# 19. Edge Cases

The design shall address:

- Promotion and annual review collide in same period
- Employee is on notice but retained with special increase
- Market benchmark updated mid-cycle
- Salary change approved after payroll cut-off
- Employee transfers legal entity before effective date
