---
id: HRMS-SUB-07-07
title: Workforce scheduling Specification
document: 07-workforce-scheduling.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Workforce Scheduling governs the planning and publication of who is scheduled to work, where, when, and in what capacity across operational teams.

In scope:

- Shift demand planning and assignment
- Skills, availability, and compliance-aware scheduling
- Schedule publication and change management
- Coverage balancing and exception handling
- Integration with attendance, leave, and payroll

# 2. Business

Workforce scheduling is central to service delivery in shift-based or operational environments. It affects labor cost, customer coverage, fatigue risk, and employee experience.

# 3. Functional

The system shall support:

- Demand-based scheduling by location, role, skill, volume, or forecast
- Assignment of employees to shifts, posts, or work zones
- Constraints such as leave, availability, rest rules, certifications, union rules, and labor limits
- Open shifts, swap requests, coverage gaps, and last-minute reassignment
- Publication of schedules to employees and supervisors
- Forecast versus actual comparison and schedule adherence tracking

Validation rules:

- Scheduling shall prevent assignment violating rest or compliance rules
- Required skill or certification shall be enforced for eligible roles
- Published schedules shall maintain version history when revised

# 4. UX

The user experience shall provide:

- Scheduler board with drag-and-drop assignment
- Coverage heatmaps and understaffing alerts
- Employee view of assigned shifts and open-shift options
- Mobile-ready swap and acknowledgment experience

# 5. API

Representative APIs:

- `GET /api/v1/workforce/schedules`
- `POST /api/v1/workforce/schedules`
- `PATCH /api/v1/workforce/schedule-assignments/{assignmentId}`
- `POST /api/v1/workforce/schedules/{scheduleId}/publish`
- `POST /api/v1/workforce/shifts/{shiftId}/swap-request`

# 6. Database

Core entities:

- `workforce_schedule`
- `schedule_shift`
- `schedule_assignment`
- `schedule_constraint_result`
- `shift_swap_request`

# 7. Events

The platform shall publish:

- `schedule.created`
- `schedule.published`
- `schedule.coverage-gap.detected`
- `schedule.shift-swapped`
- `schedule.assignment.changed`

# 8. Reports

Required reports:

- Coverage and understaffing report
- Schedule adherence report
- Shift-swap trend report
- Compliance-rule violation report

# 9. Dashboards

Dashboards shall show:

- Open coverage gaps
- Forecast versus scheduled coverage
- Swap and last-minute change volume
- Labor-risk hotspots

# 10. Security

Security controls shall include:

- Scheduler versus supervisor role separation
- Restricted visibility for sensitive staffing plans
- Controlled employee ability to accept open shifts or swaps

# 11. Audit

The audit trail shall capture:

- Schedule creation and publication versions
- Assignment changes and overrides
- Swap approvals and rejections
- Compliance-rule override actions

# 12. AI

AI capabilities may include:

- Suggested schedule optimization based on demand and skills
- Fatigue or understaffing risk prediction
- Recommended replacement workers for absent staff

# 13. Test Cases

- Schedule blocks assignment without required certification
- Published version remains intact after revision
- Swap request follows approval rules
- Leave-approved employee is not schedulable
- Coverage-gap event fires when minimum staffing not met

# 14. Workflows

1. Demand and constraints are loaded.
2. Scheduler assigns workforce.
3. Schedule is validated and published.
4. Changes, swaps, and exceptions are managed until execution.

# 15. State Machine

- `draft`
- `validated`
- `published`
- `revised`
- `locked`
- `archived`

# 16. Permissions

- Create schedule
- Publish schedule
- Approve swaps
- Override schedule constraints
- View coverage analytics

# 17. Notifications

- New schedule published
- Shift change alerts
- Swap approval notices
- Coverage emergency alerts

# 18. Configuration

- Scheduling rules
- Staffing thresholds
- Skill and compliance constraints
- Publication windows and swap policies

# 19. Edge Cases

- Mass absence event creates sudden coverage shortage
- Cross-location scheduling for floating employees
- Schedule changes after payroll cut-off
- Employee unavailable due to expired certification mid-week
