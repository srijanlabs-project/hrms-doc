---
id: HRMS-SUB-07-03
title: Shift management Specification
document: 03-shift-management.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Shift Management defines the canonical time-pattern model used by attendance, overtime, rostering, scheduling, leave interaction, and payroll-derived work rules.

In scope:

- Shift template setup
- Shift timing and break rules
- Cross-midnight and split-shift behavior
- Rotation pattern definition
- Effective-dated shift assignment controls

# 2. Business

Shifts are a foundational master-data capability. If shift rules are incomplete or ambiguous, attendance interpretation, lateness, overtime, leave interaction, and staffing decisions become inconsistent.

Business objectives:

- Standardize scheduled work definitions across business units
- Support stores, plants, hospitals, field teams, and corporate offices from one model
- Reduce manual attendance overrides by making shift rules explicit
- Enable downstream payroll and compliance calculations using governed patterns

# 3. Functional

The system shall support:

- Fixed shifts, flexible shifts, rotating shifts, split shifts, and overnight shifts
- Shift effective dating and controlled versioning
- Planned work hours, paid breaks, unpaid breaks, and meal periods
- Grace-in, grace-out, early-out, and lateness thresholds
- Week-pattern definitions such as 5-day, 6-day, alternate Saturday, and custom rotations
- Shift eligibility rules by company, location, union, worker type, or department
- Assignment precedence between default shift, roster shift, and temporary override

Detailed rules:

- One effective shift interpretation source must apply for a workday unless multi-segment logic is explicitly enabled
- Shift changes must not retroactively alter finalized attendance periods without authorized recalculation
- Cross-midnight shifts must define business-day anchoring and punch cut-off windows
- Split shifts must support segment-level attendance interpretation where policy requires

# 4. UX

Primary screens:

- Shift catalog
- Shift editor
- Break-rule editor
- Rotation pattern designer
- Shift assignment history

UX expectations:

- HR and workforce admins should understand a shift without reading technical formulas
- Visual timelines should show start time, breaks, grace windows, and overnight spillover
- Assignment history should make it easy to explain why a shift applied on a specific date

# 5. API

Representative APIs:

- `POST /api/v1/wfm/shifts`
- `PUT /api/v1/wfm/shifts/{shiftId}`
- `POST /api/v1/wfm/shifts/{shiftId}/versions`
- `POST /api/v1/wfm/shift-rotations`
- `POST /api/v1/wfm/shift-assignments`
- `GET /api/v1/wfm/shift-assignments/effective`

API expectations:

- Effective-date overlap validation must be enforced at write time
- Retrieval APIs should expose resolved shift plus source of assignment
- Historical calls must return the version effective on the requested date

# 6. Database

Core entities:

- `shift_definition`
- `shift_version`
- `shift_break_rule`
- `shift_rotation_pattern`
- `shift_rotation_member`
- `shift_assignment`
- `shift_override`

Key fields:

- Shift code, name, worker-category applicability, timezone, planned hours
- Start time, end time, cross-midnight flag, minimum work duration
- Break type, break duration, paid or unpaid indicator, sequence
- Grace rules, half-day thresholds, overtime eligibility linkage
- Assignment source, effective dates, override reason, approval reference

# 7. Events

Published events:

- `shift.created`
- `shift.version_published`
- `shift.assignment_changed`
- `shift.override_applied`
- `shift.rotation_changed`

Consumed events:

- `employee.joined`
- `employee.transferred`
- `roster.published`
- `attendance.recalculation.requested`

# 8. Reports

Required reports:

- Shift master report
- Shift assignment report
- Overnight-shift population report
- Shift-change impact report
- Break-rule variance report

# 9. Dashboards

Operational dashboards:

- Workforce distribution by shift
- Employees without effective shift assignment
- Upcoming shift changes by location
- High-override teams or departments

# 10. Security

Security requirements:

- Only authorized planners or admins may create or revise shifts
- Historical shift versions must not be physically overwritten
- Sensitive worker-group assignments should follow location and entity access policies

# 11. Audit

Audit coverage shall include:

- Shift creation and version publication
- Break-rule changes
- Assignment creation and removal
- Temporary shift overrides with reason and approver
- Recalculation triggers caused by shift changes

# 12. AI

AI-assisted opportunities:

- Recommend shift patterns based on attendance or operational demand history
- Detect configurations likely to create payroll or attendance anomalies
- Suggest cleanup where too many local variants exist for the same business purpose

# 13. Test Cases

Core test scenarios:

- Create standard fixed shift
- Configure overnight shift with correct business-day anchor
- Apply temporary override without corrupting historical assignment
- Prevent overlapping shift assignments for same employee
- Consume roster-based shift precedence correctly
- Recalculate attendance after authorized shift correction

# 14. Workflows

Primary workflow:

1. Admin creates shift template and break rules.
2. Version is reviewed and published.
3. Shift is assigned directly, through default policy, or through roster.
4. Attendance and overtime engines resolve the effective shift.
5. Authorized users apply overrides when exceptional needs arise.

# 15. State Machine

Shift version state model:

- `Draft`
- `Under Review`
- `Published`
- `Superseded`
- `Retired`

Assignment state model:

- `Planned`
- `Active`
- `Expired`
- `Cancelled`

# 16. Permissions

Representative permissions:

- `shift.create`
- `shift.publish`
- `shift.assign`
- `shift.override`
- `shift.view_history`
- `shift.audit.view`

# 17. Notifications

Notification scenarios:

- Shift version published for a population
- Employees without active shift assignment
- Temporary override nearing expiry
- Shift change requiring attendance recalculation

# 18. Configuration

Configurable parameters:

- Default business-day anchor
- Grace-rule thresholds
- Break-rule enforcement behavior
- Assignment precedence model
- Historical correction policy
- Overnight cut-off window

# 19. Edge Cases

Important edge cases:

- Employee moves between locations with different timezone interpretation
- Shift updated after overtime already approved
- Same day contains split shift plus emergency override
- Published roster shift conflicts with long-term employee assignment
- Half-day thresholds differ for paid and unpaid break treatment
