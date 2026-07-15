---
id: HRMS-SUB-01-09
title: Work calendar Specification
document: 09-work-calendar.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Work Calendar defines the enterprise calendar structures that govern working days, holidays, weekends, shutdowns, and special operating dates for use across attendance, leave, payroll, scheduling, and service delivery.

In scope:

- Calendar definition and assignment
- Working-day and holiday logic
- Regional and entity-specific calendar variants
- Special closures and exceptions
- Downstream consumption by scheduling and policy engines

# 2. Business

Work calendars are a foundational time-and-policy object. They influence attendance interpretation, leave eligibility, holiday pay, scheduling, SLA calculation, and payroll processing. Incorrect calendar design can create large-scale calculation and compliance errors.

Business objectives:

- Standardize working-day and holiday treatment across populations
- Support regional and entity-specific calendar variation
- Provide one consistent source for downstream time-based processing
- Preserve historical calendar context when holiday rules change

# 3. Functional

The system shall support:

- Calendar definitions by company, legal entity, location, site, country, or workforce group
- Weekly working pattern, weekend rules, regional holidays, optional holidays, and declared shutdowns
- One-time holiday additions, removals, and emergency-closure exceptions
- Calendar assignment to employees, locations, shifts, policies, and service models
- Future-dated calendar updates with preserved historical interpretation
- Calendar versioning and conflict detection when multiple calendars could apply

Detailed rules:

- Holiday and working-day logic should be consumable consistently by leave, attendance, payroll, SLA, and scheduling engines
- Optional or floating holidays should be distinguishable from mandatory public holidays
- Mid-year calendar changes must not silently rewrite historical outcomes unless explicit recalculation is approved
- Multiple candidate calendars should resolve using deterministic precedence rules
- Calendar derivation should support both entity-default and person-specific override models where business requires
- Government or external holiday feeds should remain reviewable before automatically changing critical payroll or attendance dates

# 4. UX

Primary screens:

- Work calendar catalog
- Calendar year view
- Holiday and shutdown editor
- Calendar assignment view
- Impact analysis preview

UX expectations:

- HR and operations users should understand calendar effects visually
- Users should see differences between mandatory holidays, optional holidays, and closures
- Impact analysis should show which employees and modules are affected by a change before activation

# 5. API

Representative APIs:

- `POST /api/v1/org/work-calendars`
- `PUT /api/v1/org/work-calendars/{calendarId}`
- `POST /api/v1/org/work-calendars/{calendarId}/publish`
- `POST /api/v1/org/work-calendars/assignments`
- `GET /api/v1/org/work-calendars/{calendarId}/preview`
- `GET /api/v1/org/work-calendars/effective`

# 6. Database

Core entities:

- `work_calendar`
- `work_calendar_version`
- `calendar_day_rule`
- `work_calendar_assignment`
- `calendar_exception_event`

Key fields:

- Calendar code, name, scope, status, effective dates
- Day date, day type, holiday category, working indicator, shutdown indicator
- Optional-holiday flag, location-specific flag, override source
- Assignment target type, precedence rule, impact snapshot
- Feed source, feed-trust status, approval-of-import indicator
- Attendance-impact flag, payroll-impact flag, SLA-impact flag

# 7. Events

Published events:

- `work_calendar.created`
- `work_calendar.published`
- `work_calendar.assignment_changed`
- `work_calendar.exception_added`
- `work_calendar.retired`

Consumed events:

- `government_holiday_feed.updated`
- `location.created`
- `shift.definition.updated`
- `leave.policy.published`

# 8. Reports

Required reports:

- Work calendar master report
- Holiday calendar report
- Calendar assignment report
- Calendar exception report
- Impacted population report
- External-holiday-feed variance report
- Downstream payroll or attendance recalculation candidate report

# 9. Dashboards

Operational dashboards:

- Upcoming holidays and shutdowns
- Calendar changes pending activation
- Populations without valid calendar assignment
- Exception-heavy calendars

# 10. Security

Security requirements:

- Calendar maintenance should be restricted to trusted HR and operations administrators
- Large-scale calendar changes that impact payroll or attendance may require elevated approval
- Government-feed and external holiday source integrations should be validated and monitored

# 11. Audit

Audit coverage shall include:

- Calendar creation and edits
- Holiday additions, deletions, and exception changes
- Assignment changes
- Publish, retire, and recalculation-trigger decisions
- External holiday-feed overrides

# 12. AI

AI-assisted opportunities:

- Detect conflicting or duplicate holiday rules across calendars
- Predict downstream impact of proposed calendar changes
- Suggest missing regional holidays from external reference patterns

AI guardrails:

- AI-suggested holidays should remain uncommitted until reviewed by calendar owners
- Impact predictions should expose which downstream engines are expected to be affected

# 13. Test Cases

Core test scenarios:

- Create calendar with standard weekend and holiday pattern
- Assign calendar to employee population
- Add future-dated shutdown exception
- Prevent conflicting effective-calendar assignment
- Retrieve effective day type for attendance and leave consumers
- Review external holiday-feed change before activation
- Mark calendar event as payroll-impacting and validate downstream consumers

# 14. Workflows

Primary workflow:

1. Admin defines or updates calendar.
2. Holiday and working-day rules are reviewed.
3. Calendar is published and assigned.
4. Downstream modules consume effective calendar behavior.
5. Exceptions and future changes follow governed impact review.

# 15. State Machine

Calendar state model:

- `Draft`
- `Published`
- `Future Effective`
- `Superseded`
- `Retired`

# 16. Permissions

Representative permissions:

- `work_calendar.create`
- `work_calendar.publish`
- `work_calendar.assign`
- `work_calendar.override_external_feed`
- `work_calendar.preview`
- `work_calendar.audit.view`

# 17. Notifications

Notification scenarios:

- Calendar awaiting approval
- Holiday-feed mismatch detected
- Calendar change impacts payroll or attendance consumers
- Upcoming shutdown or special closure

# 18. Configuration

Configurable parameters:

- Calendar scope dimensions
- Optional-holiday model
- Publish approval workflow
- Precedence and conflict rules
- External holiday-feed behavior

# 19. Edge Cases

Important edge cases:

- Same employee changes location mid-year to a different holiday calendar
- Government declares emergency holiday after payroll lock
- Optional holiday is taken from pool rather than treated as public holiday
- Shared global calendar and local exceptions overlap in conflicting ways
