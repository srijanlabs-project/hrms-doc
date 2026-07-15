---
id: HRMS-SUB-05-01
title: Team dashboard Specification
document: 01-team-dashboard.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Team Dashboard governs the manager-facing summary workspace for team health, actions, workforce visibility, and operational exceptions.

In scope:

- Team roster and structure visibility
- Alerts, approvals, and action queues
- Attendance, leave, performance, and lifecycle summaries
- Drill-through to manager-owned workflows
- Personalized and role-aware dashboard configuration

# 2. Business

Managers need one operational cockpit instead of navigating module by module. The team dashboard improves responsiveness, helps managers act on people issues earlier, and reduces missed approvals or workload blind spots.

# 3. Functional

The system shall support:

- Snapshot of direct and indirect reports with configurable depth
- Tiles for leave, attendance anomalies, pending approvals, probation reviews, performance tasks, hiring actions, and document acknowledgments
- Quick actions to approve, reject, review, or escalate manager-owned items
- Team-level filters by location, grade, employment type, and status
- Alerts for missing data, overdue reviews, attrition risk, and staffing gaps where enabled
- Links to employee profile summaries and key lifecycle events

Validation rules:

- Managers shall see only employees within authorized reporting scope
- Metrics displayed shall respect module-level data visibility policies
- Delegated managers shall see clearly labeled delegated action scope

# 4. UX

The user experience shall provide:

- Customizable dashboard cards with priority ordering
- Clear split between insights, team metrics, and action queue
- Responsive design for desktop and tablet manager usage
- Drill-through from metric tile to filtered employee or transaction list

# 5. API

Representative APIs:

- `GET /api/v1/mss/team-dashboard`
- `GET /api/v1/mss/team-dashboard/cards`
- `POST /api/v1/mss/team-dashboard/preferences`
- `GET /api/v1/mss/team-dashboard/actions`

API requirements:

- Dashboard APIs shall support role-aware aggregation and caching
- Action feeds shall include source module and deadline metadata
- Preferences shall be stored per manager persona and device where needed

# 6. Database

Core entities:

- `manager_dashboard_preference`
- `manager_dashboard_card`
- `manager_action_feed_cache`
- `manager_team_scope_snapshot`

Key data requirements:

- Dashboard preference shall capture card order, hidden cards, and filters
- Scope snapshots shall support consistent aggregation across modules
- Action feed cache shall store freshness timestamp and source lineage

# 7. Events

The platform shall publish:

- `mss.dashboard.viewed`
- `mss.dashboard.preference.updated`
- `mss.dashboard.action-generated`
- `mss.dashboard.scope-changed`

# 8. Reports

Required reports:

- Manager-dashboard adoption report
- Action backlog by manager
- Most-used dashboard card report
- Data-latency or refresh-failure report

# 9. Dashboards

Dashboards shall show:

- Team size and composition
- Pending approvals and overdue tasks
- Attendance or leave exceptions
- Performance-cycle readiness

# 10. Security

Security controls shall include:

- Scope-based employee visibility
- Restricted display of compensation, medical, or disciplinary data
- Strong caching controls to avoid stale sensitive data leakage
- Delegation-aware access boundaries

# 11. Audit

The audit trail shall capture:

- Dashboard preference changes
- Access to restricted drill-through content
- Delegation use in manager actions
- Data-refresh failures affecting operational decisions

# 12. AI

AI capabilities may include:

- Manager summary of urgent team issues
- Suggested prioritization of open actions
- Trend explanations for spikes in leave or attrition signals

AI guardrails:

- AI summaries shall be traceable to source metrics
- Sensitive predictions shall follow policy and explainability rules

# 13. Test Cases

Minimum test coverage shall include:

- Manager sees only authorized team
- Dashboard updates when reporting line changes
- Hidden card preference persists across sessions
- Drill-through filter matches card summary count
- Delegated manager sees delegated tasks only

# 14. Workflows

Primary workflow:

1. Manager opens dashboard.
2. System assembles scope-aware cards and actions.
3. Manager reviews team metrics and pending items.
4. Manager drills into approvals or employee records.
5. Actions update source modules and dashboard refreshes.

# 15. State Machine

Supported states:

- `configured`
- `active`
- `refreshing`
- `degraded`
- `archived`

# 16. Permissions

Permissions shall include:

- View team dashboard
- Customize dashboard
- View indirect-report metrics
- Access delegated action mode
- Export dashboard data

# 17. Notifications

Notifications shall support:

- Daily or weekly summary digests
- Urgent manager action alerts
- Dashboard data-refresh issue notices

# 18. Configuration

Administrators shall configure:

- Available dashboard cards
- Refresh intervals
- Metric definitions
- Manager scope rules and delegation behavior

# 19. Edge Cases

The design shall address:

- Manager has no direct reports but delegated tasks
- Employee belongs to matrix team not line team
- Underlying source module unavailable during refresh
- Executive manager needs aggregated but masked cross-team view
- Reporting line changes during open approval cycle
