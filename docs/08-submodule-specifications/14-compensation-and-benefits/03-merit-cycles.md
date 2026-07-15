---
id: HRMS-SUB-14-03
title: Merit cycles Specification
document: 03-merit-cycles.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Merit Cycles governs the planning and execution of annual or periodic merit increase programs linked to performance outcomes, pay-position strategy, and budget controls.

In scope:

- Merit pool creation and manager distribution
- Guideline matrices and recommendation rules
- Merit worksheets and approvals
- Publish of approved merit actions
- Merit analytics and fairness review

# 2. Business

Merit cycles operationalize reward philosophy at scale. They must balance performance differentiation, market position, affordability, and employee experience in a single coordinated cycle.

Business outcomes:

- Distribute annual salary increases consistently and efficiently
- Align merit outcomes with performance and pay-position strategy
- Give leadership visibility into spend, fairness, and differentiation
- Reduce spreadsheet dependency during annual reward cycles

# 3. Functional

The system shall support:

- Merit cycle creation by population, geography, and pay program
- Budget distribution to planner hierarchies
- Guideline matrices based on performance rating, compa ratio, talent segment, or other factors
- Recommendation worksheets supporting percentage and amount views
- Hard and soft limits with exception routing
- Freeze, submit, approve, reopen, and publish actions
- Merit communication readiness and payroll export
- Merit impact analysis before and after approval

Validation rules:

- Recommendations shall honor guideline matrix rules unless exception approved
- Manager total allocation shall not exceed approved pool unless override is authorized
- Merit action cannot publish for ineligible employees
- Cycle freeze shall lock edits for completed planners

# 4. UX

The user experience shall provide:

- Merit planning worksheet with current pay, compa ratio, rating, recommended %, and budget effect
- Color-coded guidance bands and exception markers
- Leader summary views across manager hierarchies
- Scenario mode for planners to test allocations before submit
- Compact approval interface for senior leaders

# 5. API

Representative APIs:

- `POST /api/v1/compensation/merit-cycles`
- `POST /api/v1/compensation/merit-cycles/{cycleId}/guidelines`
- `PATCH /api/v1/compensation/merit-recommendations/{recommendationId}`
- `POST /api/v1/compensation/merit-cycles/{cycleId}/submit`
- `POST /api/v1/compensation/merit-cycles/{cycleId}/publish`

API requirements:

- Guideline APIs shall preserve rule version and factor inputs
- Scenario calculations shall not affect committed data until saved
- Publish APIs shall support delta-only and full export modes

# 6. Database

Core entities:

- `merit_cycle`
- `merit_budget_pool`
- `merit_guideline_matrix`
- `merit_recommendation`
- `merit_exception_case`
- `merit_publish_batch`

Key data requirements:

- Recommendation records shall store guideline output, manager input, exception flag, and approved value
- Guideline matrix shall store factor bands, target increase values, and effective dates
- Publish batches shall store processed employee count and downstream status

# 7. Events

The platform shall publish:

- `merit-cycle.created`
- `merit-budget.allocated`
- `merit-recommendation.updated`
- `merit-cycle.submitted`
- `merit-cycle.approved`
- `merit-cycle.published`

# 8. Reports

Required reports:

- Merit spend versus budget report
- Guideline adherence report
- Performance-to-increase correlation report
- Exception volume by manager and business unit
- Publish reconciliation report

# 9. Dashboards

Dashboards shall show:

- Merit cycle completion by hierarchy
- Budget consumed and available
- Increase distribution heatmap
- Outlier recommendations and fairness indicators

# 10. Security

Security controls shall include:

- Compensation visibility limited by planner scope
- Segregation between planner, approver, and administrator roles
- Controlled access to fairness analytics if sensitive dimensions are included
- Download restrictions for large compensation extracts

# 11. Audit

The audit trail shall capture:

- Guideline changes
- Recommendation edits and justification
- Budget transfers
- Publish and rollback actions

# 12. AI

AI capabilities may include:

- Suggestions for budget balancing across teams
- Identification of inconsistent merit differentiation
- Early warning of potential equity concerns

AI guardrails:

- AI shall not enforce or change merit outcomes autonomously
- Recommendations shall remain explainable and reviewable by managers

# 13. Test Cases

Minimum test coverage shall include:

- Guideline matrix recommends correct band value
- Over-budget manager submission is blocked
- Approved exception allows out-of-guideline increase
- Publish creates accurate salary changes
- Scenario changes remain isolated until committed

# 14. Workflows

Primary workflow:

1. Merit cycle and budget are defined.
2. Guideline matrices and planner scopes are loaded.
3. Managers allocate merit increases.
4. Approvals resolve exceptions and finalize decisions.
5. Merit outcomes publish to payroll and communications.

# 15. State Machine

Supported states:

- `draft`
- `configured`
- `planning-open`
- `submitted`
- `approved`
- `published`
- `closed`

# 16. Permissions

Permissions shall include:

- Configure merit cycles and guidelines
- Enter recommendations
- Transfer budgets
- Approve exceptions
- Publish finalized increases

# 17. Notifications

Notifications shall support:

- Cycle opening and deadline reminders
- Budget depletion alerts
- Approval pending and exception alerts
- Publish completion notices

# 18. Configuration

Administrators shall configure:

- Merit calendars and eligible populations
- Guideline factors and matrices
- Budget distribution rules
- Approval routing and exception thresholds
- Downstream payroll mappings

# 19. Edge Cases

The design shall address:

- Employee has no performance rating but is merit eligible
- Range corrections overlap merit increase
- Budget is revised after managers already submitted
- Employee promoted mid-cycle with separate pay action
- Local country policy forbids merit for certain worker groups
