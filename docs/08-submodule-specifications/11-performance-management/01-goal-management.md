---
id: HRMS-SUB-11-01
title: Goal management Specification
document: 01-goal-management.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Goal Management governs how enterprise, business-unit, team, and individual goals are defined, aligned, tracked, reviewed, and closed across performance cycles.

In scope:

- Goal planning and cascading
- KRAs, KPIs, OKRs, and competency-linked goals
- Weightage, milestones, check-ins, and evidence capture
- Mid-cycle updates and recalibration
- Goal closure and carry-forward handling

# 2. Business

Goal management translates strategy into accountable execution. It gives leadership visibility into delivery priorities while helping managers and employees understand what success looks like in measurable terms.

Business outcomes:

- Align employee effort with business strategy
- Increase transparency of commitments and progress
- Reduce ambiguity in appraisal conversations
- Support differentiated measurement across roles and levels

# 3. Functional

The system shall support:

- Annual, quarterly, project-based, and ad hoc goal plans
- Goal types such as strategic, operational, development, compliance, and behavior goals
- Cascading from enterprise to department, manager to team member, and project lead to contributor
- Shared goals, individual goals, and team goals with contribution percentages
- Weight assignment, milestone dates, numeric targets, and qualitative success criteria
- Employee self-created goals subject to manager review where policy allows
- Goal edits, freeze periods, reopening, and carry-forward to new cycle
- Check-ins, comments, progress percentage, evidence attachments, and blocker logging
- Cross-functional alignment links to projects, cost centers, or business initiatives

Validation rules:

- Total goal weight shall meet cycle rules before final submission
- Frozen goals shall not be edited without override permission
- Archived cycles shall remain read-only except for approved audit correction flows
- Shared goal progress shall distinguish group result from individual contribution

# 4. UX

The user experience shall provide:

- Goal workspace with hierarchy map, weights, progress bars, and milestone timeline
- Distinct entry modes for OKRs, KPI scorecards, and narrative goals
- Manager view that shows team alignment, missing goals, and overloaded employees
- Employee check-in experience with guided reflection and evidence upload
- Mobile-friendly progress updates and reminder nudges

# 5. API

Representative APIs:

- `POST /api/v1/performance/goals`
- `PATCH /api/v1/performance/goals/{goalId}`
- `POST /api/v1/performance/goals/{goalId}/check-ins`
- `POST /api/v1/performance/cycles/{cycleId}/goal-submission`
- `GET /api/v1/performance/employees/{employeeId}/goals`
- `POST /api/v1/performance/goals/{goalId}/reopen`

API requirements:

- Goal APIs shall validate cycle timing, ownership, and weight limits
- Progress updates shall support structured metrics and narrative notes
- Integration endpoints shall preserve source references when goals are synced from strategy tools

# 6. Database

Core entities:

- `performance_cycle`
- `goal_plan`
- `goal`
- `goal_alignment_link`
- `goal_milestone`
- `goal_check_in`
- `goal_evidence`

Key data requirements:

- Goal records shall capture owner, period, type, weight, target metric, baseline, current value, and status
- Alignment links shall capture parent-child or shared-goal relationships
- Check-in records shall store progress value, narrative, blockers, and timestamp

# 7. Events

The platform shall publish:

- `goal.created`
- `goal.submitted`
- `goal.approved`
- `goal.updated`
- `goal.check-in.recorded`
- `goal.overdue`
- `goal.closed`

# 8. Reports

Required reports:

- Goal completion rate by function, level, and location
- Alignment coverage report
- Goal weight distribution and compliance report
- Check-in frequency and overdue update report
- Development goal adoption report

# 9. Dashboards

Dashboards shall show:

- Strategic goal progress by business unit
- Team goal health and at-risk goals
- Employee goal completion and update discipline
- Cycle readiness such as drafted, submitted, approved, and missing plans

# 10. Security

Security controls shall include:

- Manager-only visibility to confidential business goals where applicable
- Controlled exposure of peer or cross-team goals
- Restricted edit rights after plan sign-off
- Evidence attachment scanning and secure storage

# 11. Audit

The audit trail shall capture:

- Goal creation, edits, freezes, reopens, and deletions
- Weight changes and target changes after approval
- Progress updates and evidence changes
- Alignment relationship changes affecting roll-up metrics

# 12. AI

AI capabilities may include:

- Draft goal suggestions from role, department strategy, or prior cycle outcomes
- Detection of vague, overlapping, or non-measurable goals
- Nudges for check-ins based on stalled progress or upcoming milestones

AI guardrails:

- AI-generated goals shall require human review before activation
- Suggested progress insights shall cite underlying check-ins or metrics

# 13. Test Cases

Minimum test coverage shall include:

- Goal plan blocked when total weight is outside configured threshold
- Shared goal updates do not incorrectly overwrite individual contributions
- Frozen goals reject edits for unauthorized users
- Reopened goal version history remains intact
- Goal roll-up metrics update after milestone completion

# 14. Workflows

Primary workflow:

1. Cycle opens and templates become available.
2. Goals are drafted, aligned, and submitted.
3. Manager reviews and approves or sends back.
4. Employees and managers record periodic check-ins.
5. Goals are finalized for appraisal and closed at cycle end.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `returned`
- `approved`
- `in-progress`
- `on-hold`
- `completed`
- `closed`

# 16. Permissions

Permissions shall include:

- Create goal plans
- Submit and approve goals
- Edit frozen goals
- View team and cross-functional goals
- Reopen closed goals
- Configure goal templates and weight rules

# 17. Notifications

Notifications shall support:

- Cycle open and submission reminders
- Manager approval tasks
- Upcoming milestone and overdue check-in alerts
- Goal return comments and closure notices

# 18. Configuration

Administrators shall configure:

- Goal methodologies and templates
- Weight thresholds and mandatory categories
- Alignment rules and sharing behavior
- Cycle dates, freeze windows, and reminder cadence
- Role-based visibility and evidence policies

# 19. Edge Cases

The design shall address:

- Employee changes manager mid-cycle
- Goal ownership transfer due to internal movement
- Shared goal continues after one participant exits
- Quantitative target becomes irrelevant due to business change and needs re-baselining
- Employee goes on leave during the planning or check-in period
