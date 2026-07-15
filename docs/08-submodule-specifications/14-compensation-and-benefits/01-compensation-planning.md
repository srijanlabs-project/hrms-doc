---
id: HRMS-SUB-14-01
title: Compensation planning Specification
document: 01-compensation-planning.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Compensation Planning governs enterprise processes used to model, allocate, review, approve, and track compensation budgets and proposals across cycles, populations, and geographies.

In scope:

- Budget planning and pool allocation
- Compensation planning cycles and populations
- Policy controls for salary, bonus, and equity recommendations
- Manager planning worksheets and approval flows
- Downstream export to payroll and reward systems

# 2. Business

Compensation planning links financial governance, pay philosophy, performance outcomes, and workforce decisions. It must balance market competitiveness, internal equity, affordability, and regulatory obligations.

Business outcomes:

- Enable controlled and transparent reward decisions
- Align compensation actions with budget and strategy
- Provide leaders with planning visibility before commitments are executed
- Reduce manual spreadsheet planning and downstream errors

# 3. Functional

The system shall support:

- Compensation cycles by legal entity, region, grade, function, or employee segment
- Budget pools for merit, promotion, correction, bonus, retention, and discretionary awards
- Allocation of top-down and bottom-up budgets with approval checkpoints
- Planner worksheets showing current pay, compa ratio, range penetration, performance, and recommendations
- Currency conversion, local market handling, and consolidated reporting
- Funding constraints, policy thresholds, and exception routing
- Draft, submit, approve, reject, reopen, and publish actions
- Export of approved actions to payroll, stock administration, or HR master data systems

Validation rules:

- Recommendations shall respect cycle eligibility and budget ownership
- Actions exceeding policy thresholds shall require exception approval
- Published outcomes shall become read-only except for controlled correction workflows
- Currency conversion shall use effective date and source reference policies

# 4. UX

The user experience shall provide:

- Compensation dashboard with budget consumed, pending approvals, and risk indicators
- Manager worksheet optimized for bulk review and recommendation entry
- Side panel showing employee pay history, range position, performance, and talent signals
- Executive view with scenario comparison and consolidated budget exposure
- Responsive design for approvers reviewing summarized actions on mobile devices

# 5. API

Representative APIs:

- `POST /api/v1/compensation/cycles`
- `POST /api/v1/compensation/cycles/{cycleId}/budgets`
- `PATCH /api/v1/compensation/recommendations/{recommendationId}`
- `POST /api/v1/compensation/cycles/{cycleId}/submit`
- `POST /api/v1/compensation/cycles/{cycleId}/publish`
- `GET /api/v1/compensation/cycles/{cycleId}/analytics`

API requirements:

- Recommendation APIs shall validate budget, eligibility, and policy in one response
- Publish APIs shall generate downstream integration payloads with idempotent control
- Analytics APIs shall support consolidated and local-currency views

# 6. Database

Core entities:

- `comp_cycle`
- `comp_budget_pool`
- `comp_planner_scope`
- `comp_recommendation`
- `comp_exception_case`
- `comp_publish_batch`

Key data requirements:

- Recommendation records shall store current pay, proposed values, action type, funding source, and approval status
- Budget pools shall capture original allocation, revisions, consumed amount, and remaining balance
- Publish batches shall store downstream status and rollback metadata

# 7. Events

The platform shall publish:

- `comp-cycle.created`
- `comp-budget.allocated`
- `comp-recommendation.updated`
- `comp-cycle.submitted`
- `comp-cycle.approved`
- `comp-actions.published`

# 8. Reports

Required reports:

- Budget utilization by business unit and cycle
- Recommendation distribution by action type
- Policy exception and approval delay report
- Currency exposure and consolidated spend report
- Publish reconciliation report

# 9. Dashboards

Dashboards shall show:

- Budget consumed versus allocated
- Managers pending submission
- Exception hotspots and over-budget populations
- Executive scenario comparison across cycles

# 10. Security

Security controls shall include:

- Strict access to compensation amounts and analytics
- Planner scope enforcement so managers view only authorized employees
- Controlled download and export privileges
- Sensitive executive compensation handled through enhanced restriction rules

# 11. Audit

The audit trail shall capture:

- Budget creation and revisions
- Recommendation edits and approvals
- Exception justifications
- Publish and downstream correction activities

# 12. AI

AI capabilities may include:

- Budget risk forecasting
- Suggested allocation adjustments based on performance, attrition risk, and market position
- Detection of unusual patterns or potential pay-equity concerns

AI guardrails:

- AI shall not auto-approve compensation actions
- Equity insights shall be reviewed within legal and policy boundaries

# 13. Test Cases

Minimum test coverage shall include:

- Planner cannot exceed budget without approved exception
- Published cycle creates correct downstream export
- Multi-currency recommendation totals reconcile correctly
- Reopened cycle preserves prior approval history
- Executive-restricted population remains hidden from unauthorized managers

# 14. Workflows

Primary workflow:

1. Cycle and budgets are created.
2. Planner scopes and recommendations are prepared.
3. Managers submit proposals.
4. Approvers review policy and budget fit.
5. Approved actions are published downstream.

# 15. State Machine

Supported states:

- `draft`
- `budgeted`
- `planning-open`
- `submitted`
- `in-approval`
- `approved`
- `published`
- `closed`

# 16. Permissions

Permissions shall include:

- Create cycles and budgets
- Enter recommendations
- Approve exceptions
- Publish compensation outcomes
- View sensitive analytics

# 17. Notifications

Notifications shall support:

- Cycle launch and deadline reminders
- Budget revision notifications
- Submission and approval task alerts
- Publish success and failure messages

# 18. Configuration

Administrators shall configure:

- Cycle calendars and eligible populations
- Budget categories and policy thresholds
- Currency rules and market data sources
- Approval matrices and export mappings

# 19. Edge Cases

The design shall address:

- Employee eligible for multiple action types in same cycle
- Budget transferred across business units mid-cycle
- Employee exits before published compensation becomes effective
- Frozen payroll calendar delays downstream execution
- Cross-border manager plans for employees paid in different currencies
