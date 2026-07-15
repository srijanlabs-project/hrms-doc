---
id: HRMS-SUB-07-04
title: Rostering Specification
document: 04-rostering.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Rostering is the forward-planning capability used to assign shifts, coverage, and staffing responsibilities to individuals or teams across a defined planning horizon.

In scope:

- Roster planning cycles
- Shift allocation to employees or positions
- Coverage visibility and gap identification
- Publish, republish, and swap controls
- Downstream consumption by attendance and employee self-service

# 2. Business

Rostering translates workforce demand into executable schedules. It is especially critical for operations with fluctuating customer volume, regulatory staffing ratios, or round-the-clock service obligations.

Business objectives:

- Publish schedules early enough for workforce planning and employee readiness
- Maintain coverage across peak and mandatory staffing periods
- Reduce ad hoc spreadsheet-based scheduling
- Provide clear traceability for roster changes, swaps, and overrides

# 3. Functional

The system shall support:

- Weekly, bi-weekly, monthly, and rolling roster windows
- Employee-based and position-based roster planning
- Coverage rules by skill, grade, certification, headcount, or gender where lawful and required
- Draft, review, publish, and republish lifecycle
- Shift swaps, manager reassignments, and emergency coverage adjustments
- Conflict checks for leave, holiday, training, travel, rest rules, and overlapping shifts
- Bulk planning through templates or copied historical rosters

Detailed rules:

- Draft rosters must not affect payroll-facing attendance interpretation
- Published rosters become the effective schedule input unless a higher-precedence operational override exists
- Republish must preserve prior version history and communicate deltas
- Swap requests must validate both employees for eligibility, skill, and policy constraints

# 4. UX

Primary screens:

- Roster calendar planner
- Team staffing grid
- Coverage heatmap
- Swap request inbox
- Publish summary screen

UX expectations:

- Planners need dense calendar and staffing views with quick drag-and-assign actions
- Employees need a simple schedule view with change highlights
- Managers should see understaffing and overstaffing risks before publish
- Version differences should be understandable without comparing spreadsheets manually

# 5. API

Representative APIs:

- `POST /api/v1/wfm/rosters`
- `POST /api/v1/wfm/rosters/{rosterId}/entries`
- `POST /api/v1/wfm/rosters/{rosterId}/publish`
- `POST /api/v1/wfm/rosters/{rosterId}/republish`
- `POST /api/v1/wfm/roster-swaps`
- `GET /api/v1/wfm/rosters/effective`

API expectations:

- Publish APIs must snapshot the published version
- Effective roster retrieval should support employee, team, site, and date filters
- Swap APIs must validate policy, rest, and skill constraints synchronously or via workflow

# 6. Database

Core entities:

- `roster_plan`
- `roster_version`
- `roster_entry`
- `roster_coverage_rule`
- `roster_swap_request`
- `roster_publish_event`

Key fields:

- Planning horizon, location, team, roster owner, status
- Employee or position reference, shift reference, date, role or skill tag
- Coverage minimum, target, and max thresholds
- Swap initiator, proposed counterpart, reason, approval outcome
- Publish version number, published by, published timestamp

# 7. Events

Published events:

- `roster.draft_created`
- `roster.published`
- `roster.republished`
- `roster.swap_requested`
- `roster.swap_approved`
- `roster.coverage_breach_detected`

Consumed events:

- `leave.approved`
- `shift.assignment_changed`
- `employee.skill.updated`
- `employee.transfer.completed`

# 8. Reports

Required reports:

- Published roster report
- Coverage gap report
- Roster adherence report
- Swap and change history report
- Skill coverage report

# 9. Dashboards

Operational dashboards:

- Coverage by site and date
- Open swap requests
- Unpublished roster windows
- Understaffed critical shifts
- Overtime risk created by current roster

# 10. Security

Security requirements:

- Planners may view and edit only authorized populations
- Employees may view their own schedules and policy-permitted team visibility
- Roster changes for protected or restricted roles should require elevated controls

# 11. Audit

Audit coverage shall include:

- Roster creation, modification, and publish actions
- Version comparisons and republish reason
- Swap request submission, approval, rejection, and cancellation
- Coverage-rule overrides

# 12. AI

AI-assisted opportunities:

- Recommend shift allocation based on demand, skills, availability, and overtime risk
- Detect likely coverage problems before publish
- Suggest fairer rotation patterns to reduce manager bias or burnout concentration

AI guardrails:

- AI suggestions must remain explainable and policy-aware
- Final publish authority remains with authorized human users

# 13. Test Cases

Core test scenarios:

- Create draft roster and publish successfully
- Prevent publish with unresolved hard coverage breach where configured
- Process shift swap with policy validation
- Republish roster and notify affected employees
- Block roster entry for employee on approved leave

# 14. Workflows

Primary workflow:

1. Planner creates draft roster for the horizon.
2. System validates leave, skills, shifts, and coverage rules.
3. Planner resolves gaps and publishes roster.
4. Employees review schedules and raise swap requests if allowed.
5. Managers or admins approve and republish changes when needed.

# 15. State Machine

Roster state model:

- `Draft`
- `Under Review`
- `Published`
- `Republished`
- `Closed`
- `Cancelled`

Swap request state model:

- `Draft`
- `Submitted`
- `Approved`
- `Rejected`
- `Withdrawn`
- `Applied`

# 16. Permissions

Representative permissions:

- `roster.create`
- `roster.edit`
- `roster.publish`
- `roster.view_coverage`
- `roster.swap.request`
- `roster.swap.approve`
- `roster.audit.view`

# 17. Notifications

Notification scenarios:

- Roster published or changed
- Coverage breach requires planner attention
- Swap request submitted, approved, or rejected
- Employee assigned to a newly added shift

# 18. Configuration

Configurable parameters:

- Planning horizon defaults
- Publish lead-time requirements
- Swap eligibility rules
- Coverage hard-stop vs warning behavior
- Version-retention policy
- Team-visibility rules

# 19. Edge Cases

Important edge cases:

- Two swap requests compete for the same shift slot
- Published roster is changed after work already started
- Employee skill certification expires between planning and execution date
- Emergency staffing requires breach of standard rest rules with approval
- Position-based roster must be converted to named employees late in the cycle
