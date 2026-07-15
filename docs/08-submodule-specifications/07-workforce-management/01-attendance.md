---
id: HRMS-SUB-07-01
title: Attendance Specification
document: 01-attendance.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Attendance captures and interprets work-presence signals into governed daily attendance outcomes that can be used by employees, managers, operations, payroll, and compliance teams.

In scope:

- Raw punch and attendance event capture
- Shift-aware day interpretation
- Present, absent, late, early-out, half-day, and exception outcomes
- Manual correction and regularization
- Payroll and compliance handoff

# 2. Business Context

Attendance is operationally critical because it directly affects payroll, compliance, discipline, workforce visibility, and employee trust.

Business outcomes:

- Standardize presence calculation across devices and locations
- Reduce disputes and manual attendance corrections
- Produce payroll-ready attendance summaries
- Surface exceptions quickly for operational closure

# 3. Actors and Responsibilities

Primary roles:

- Employee
- Manager
- Attendance Admin
- Workforce Planner
- Payroll Viewer

Responsibilities:

- Employee records attendance and submits regularization where permitted
- Manager reviews exceptions or approvals for team members
- Attendance Admin monitors device issues, attendance rules, and unresolved cases
- Payroll consumes finalized attendance outputs

# 4. Functional Behavior

The system shall support:

- Multiple capture modes such as biometric, mobile, web, GPS, QR, AI selfie, AI attendance kiosk, and face-based capture
- Shift-aware interpretation of in-time, out-time, breaks, and work duration
- Attendance status derivation per day
- Late mark, early exit, missed punch, and no-show exception tracking
- Regularization and correction workflow
- Confidence scoring and anti-spoof review for selfie or kiosk-assisted attendance capture where configured
- Period finalization for payroll input

Detailed rules to support:

- Minimum work duration and grace periods
- Shift start and end windows
- Cross-midnight shifts
- Holiday and weekly-off interaction
- Location-based validation where required
- Duplicate punch suppression and source prioritization

# 5. Data and Field Design

Core entities:

- `attendance_event`
- `attendance_day_record`
- `attendance_exception`
- `attendance_regularization`
- `attendance_policy_rule`
- `attendance_finalization_batch`

Important field groups:

- Employee, device, and capture source identifiers
- Event timestamp, geo data, and source metadata
- Shift reference and day-bucket logic
- Derived attendance status and work duration
- Exception type and correction state
- Payroll finalization marker

# 6. UX and Interaction Model

Primary screens:

- My attendance calendar
- Team attendance overview
- Attendance exception queue
- Regularization request form
- Admin diagnostics and correction screen

UX expectations:

- Employees should understand what was captured and what still needs action
- Managers should see team exceptions in a review-friendly way
- Admin users should be able to diagnose device or source conflicts quickly

# 7. API and Service Contracts

Representative APIs:

- `POST /api/v1/wfm/attendance/events`
- `GET /api/v1/wfm/attendance/days/{employeeId}`
- `POST /api/v1/wfm/attendance/regularizations`
- `POST /api/v1/wfm/attendance/finalize-period`

API expectations:

- Event ingestion should be idempotent where repeated source messages are possible
- Day-level retrieval must expose both raw capture and interpreted result where authorized
- Finalization APIs must lock or snapshot payroll-relevant attendance outcomes

# 8. Workflow and Business Rules

Typical workflow:

1. Attendance event is captured from approved source.
2. Engine maps event to employee, shift, and business day.
3. System derives attendance result and flags exception if needed.
4. Employee or admin submits correction if policy allows.
5. Manager or admin approves exception where required.
6. Period is finalized for payroll.

Critical business rules:

- Source priority rules if multiple attendance channels report the same person
- Grace periods for late mark and early exit
- Auto-absence rules for no-punch scenarios
- Locking rules after period finalization

# 9. State Machine

Day record states:

- Captured
- Interpreted
- Exception Open
- Regularization Pending
- Corrected
- Finalized

# 10. Events and Notifications

Published events:

- `attendance.event.captured`
- `attendance.day.interpreted`
- `attendance.exception.opened`
- `attendance.regularization.submitted`
- `attendance.period.finalized`

Notifications:

- Missed punch detected
- Regularization approval required
- Correction approved or rejected
- Period about to close with unresolved exceptions

# 11. Reports and Dashboards

Reports:

- Daily attendance summary
- Missed punch report
- Late mark report
- Finalized attendance export

Dashboards:

- Present vs absent trend
- Open exceptions by location or team
- Finalization readiness for payroll

# 12. Security, Permissions, and Audit

Security requirements:

- Employees may view only their own detailed day-level data
- Managers may view team data within scope
- Admin overrides must be tightly permissioned

Audit requirements:

- Raw event ingestion source and timestamp
- Derived result changes
- Manual edits and regularization approvals
- Finalization and reopen actions

# 13. Configuration

Configurable items:

- Shift mapping logic
- Grace periods
- Source priority
- Geo-validation settings
- Regularization policy
- Finalization window

# 14. Edge Cases and Exception Handling

- Cross-midnight shift with missing out punch
- Same employee punches on two devices within seconds
- Mobile check-in outside permitted geofence
- Period finalized before regularization is resolved
- Employee transferred mid-period across locations

# 15. Test Scenarios

- Capture valid biometric event
- Derive correct day status for standard shift
- Handle missing punch and regularization
- Suppress duplicate source events
- Finalize period and block further edits without reopen
- Verify payroll export accuracy

# 16. Dependencies and Integrations

Dependencies:

- People Management
- Shift Management
- Workflow engine
- Payroll

Integrations:

- Biometric devices
- Mobile attendance services
- Payroll engine
- Reporting and analytics

# 17. Assumptions

- Employee-to-shift mapping is available when attendance is interpreted
- Capture sources are pre-authorized and identifiable
- Finalized attendance is treated as payroll-impacting truth unless reopened
