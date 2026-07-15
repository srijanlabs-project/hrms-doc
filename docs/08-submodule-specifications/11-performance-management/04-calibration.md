---
id: HRMS-SUB-11-04
title: Calibration Specification
document: 04-calibration.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Calibration governs the controlled review of proposed performance ratings across managers, functions, and employee populations to improve fairness, consistency, and organizational comparability.

In scope:

- Calibration sessions and cohorts
- Rating distribution review and normalization
- Evidence comparison and override logging
- Committee decisions and final rating confirmation
- Export of calibrated outcomes to downstream processes

# 2. Business

Calibration helps enterprises reduce manager bias, rating inflation, and inconsistent standards across teams. It provides an organizational check before ratings influence rewards, promotions, and talent decisions.

Business outcomes:

- Improve equity and consistency in final ratings
- Provide leadership oversight into performance patterns
- Create defensible final decisions for compensation and succession
- Highlight teams that need manager capability improvement

# 3. Functional

The system shall support:

- Calibration cohorts by function, grade, region, or manager hierarchy
- Session agendas, participant roles, and case sequencing
- Display of proposed ratings, evidence summaries, and peer comparisons
- Distribution targets or guidance bands where policy allows
- Change proposals, approvals, and final rating confirmation
- Comments explaining rationale for every calibration adjustment
- Separate treatment for probationary, new joiner, or on-leave populations
- Export of final ratings to appraisal closure, merit planning, and talent reviews

Validation rules:

- Only eligible finalized appraisal records may enter calibration
- Rating changes shall require rationale and authorized committee action
- Distribution guidance shall never silently auto-edit ratings without explicit decision logging
- Closed sessions shall remain read-only except for approved reopening workflows

# 4. UX

The user experience shall provide:

- Calibration board with cohort distribution, employee list, and supporting evidence panel
- Filters for diversity, tenure, role, performance history, and manager
- Side-by-side comparison of employees within the same cohort
- Session notes and decision capture in one workspace
- Executive summary view for leaders who need trend visibility without record editing

# 5. API

Representative APIs:

- `POST /api/v1/performance/calibration-sessions`
- `POST /api/v1/performance/calibration-sessions/{sessionId}/participants`
- `PATCH /api/v1/performance/calibration-sessions/{sessionId}/employees/{employeeId}`
- `POST /api/v1/performance/calibration-sessions/{sessionId}/close`
- `GET /api/v1/performance/calibration-sessions/{sessionId}/distribution`

API requirements:

- Session APIs shall validate participant authority and employee eligibility
- Rating-adjustment APIs shall store before and after values with rationale
- Distribution endpoints shall support real-time recalculation as changes occur

# 6. Database

Core entities:

- `calibration_session`
- `calibration_cohort`
- `calibration_participant`
- `calibration_employee_case`
- `calibration_adjustment`
- `calibration_distribution_snapshot`

Key data requirements:

- Employee case records shall store original rating, proposed calibrated rating, evidence summary, and decision state
- Adjustment records shall store actor, reason, approval path, and timestamp
- Distribution snapshots shall preserve session-state history for audit and analytics

# 7. Events

The platform shall publish:

- `calibration.session.created`
- `calibration.case.reviewed`
- `calibration.rating.adjusted`
- `calibration.session.closed`
- `calibration.final-ratings.published`

# 8. Reports

Required reports:

- Pre- and post-calibration rating distribution report
- Manager variance report
- Adjustment rationale analysis
- Session completion and aging report
- Population exclusions and exceptions report

# 9. Dashboards

Dashboards shall show:

- Open sessions and completion status
- Rating distribution heatmap by business unit
- Volume of adjusted ratings by manager
- Outlier teams and equity indicators

# 10. Security

Security controls shall include:

- Strict access to calibration content due to sensitive talent decisions
- Confidential handling of comparison views and diversity indicators
- Read-only access for observers without change authority
- Download controls for calibration decks where required

# 11. Audit

The audit trail shall capture:

- Session creation, participant changes, and cohort scoping
- Every proposed and final rating change
- Distribution guidance changes
- Session close and final publish actions

# 12. AI

AI capabilities may include:

- Detection of outlier ratings compared with evidence and historical patterns
- Suggested cases for calibration focus based on variance or risk
- Summaries of cohort themes and potential fairness concerns

AI guardrails:

- AI shall not enforce forced ranking or alter ratings automatically
- Sensitive demographic analysis shall be handled only within approved legal and policy boundaries

# 13. Test Cases

Minimum test coverage shall include:

- Ineligible appraisal record cannot enter calibration
- Rating change without rationale is rejected
- Closed session blocks further edits
- Final publish updates downstream compensation feed correctly
- Distribution snapshots remain consistent after multiple session edits

# 14. Workflows

Primary workflow:

1. Finalized appraisals are grouped into cohorts.
2. Calibration session reviews proposed ratings and evidence.
3. Committee adjusts ratings where justified.
4. Final distribution is reviewed and approved.
5. Calibrated ratings are published downstream.

# 15. State Machine

Supported states:

- `draft`
- `prepared`
- `in-session`
- `review-complete`
- `approved`
- `published`
- `closed`

# 16. Permissions

Permissions shall include:

- Create sessions and define cohorts
- View employee evidence in calibration
- Adjust ratings
- Approve final calibration output
- Reopen or archive sessions

# 17. Notifications

Notifications shall support:

- Session scheduling and participant reminders
- Action required alerts for unresolved cohorts
- Publish confirmation to HR and compensation stakeholders
- Audit alerts for reopened closed sessions

# 18. Configuration

Administrators shall configure:

- Cohort rules and session templates
- Rating labels and comparison views
- Distribution guidance rules
- Session roles and approval requirements
- Export triggers to downstream systems

# 19. Edge Cases

The design shall address:

- Cohort has too few employees for meaningful comparison
- Employee transfers across cohorts mid-cycle
- Legal restriction prevents using certain attributes in comparison analysis
- Final rating already shared with employee before calibration correction
- Cross-border enterprise needs different calibration approaches by country
