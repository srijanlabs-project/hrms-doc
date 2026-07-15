---
id: HRMS-SUB-07-05
title: Timesheets Specification
document: 05-timesheets.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Timesheets governs the capture, validation, approval, and downstream use of employee and contingent worker time entries against dates, projects, tasks, cost objects, or attendance obligations.

In scope:

- Daily and weekly time entry
- Project, client, task, and cost-center allocation
- Validation, approval, and correction workflows
- Integration with attendance, payroll, billing, and analytics
- Exception and late-submission handling

# 2. Business

Timesheets translate effort into operational, payroll, and financial outcomes. They are critical where organizations need project costing, client billing, statutory working-time evidence, or exception-based attendance control.

# 3. Functional

The system shall support:

- Daily, weekly, and period-based time-entry modes
- Hours, units, shifts, or effort percentages depending on worker population
- Time allocation to project, task, client, work order, or internal activity codes
- Pre-fill from schedules, attendance punches, or planned assignments
- Validation for minimum or maximum hours, overlap, mandatory breaks, and non-working days
- Manager, project-manager, or dual approval models
- Locked periods, correction requests, and audit-safe amendments
- Export to payroll, billing, finance, or utilization analytics systems

Validation rules:

- Overlapping entries shall be blocked unless override policy exists
- Non-working day entries shall follow overtime or special-work rules
- Closed timesheet periods shall not allow direct edits
- Timesheet approval shall honor manager and project hierarchy rules

# 4. UX

The user experience shall provide:

- Grid and list time-entry views
- Fast entry, copy previous week, and bulk allocation features
- Visual indicators for missing, invalid, and approved entries
- Mobile entry for field or service workforce populations

# 5. API

Representative APIs:

- `GET /api/v1/workforce/timesheets`
- `POST /api/v1/workforce/timesheets/entries`
- `POST /api/v1/workforce/timesheets/{timesheetId}/submit`
- `POST /api/v1/workforce/timesheets/{timesheetId}/approve`
- `POST /api/v1/workforce/timesheets/{timesheetId}/reopen`

# 6. Database

Core entities:

- `timesheet_header`
- `timesheet_entry`
- `timesheet_approval`
- `timesheet_period`
- `timesheet_exception`

# 7. Events

The platform shall publish:

- `timesheet.created`
- `timesheet.submitted`
- `timesheet.approved`
- `timesheet.rejected`
- `timesheet.period.closed`

# 8. Reports

Required reports:

- Missing timesheet report
- Timesheet approval aging report
- Project effort allocation report
- Correction and late-submission report

# 9. Dashboards

Dashboards shall show:

- Timesheet completion %
- Approval backlog
- Utilization by project or team
- Repeated timesheet exceptions

# 10. Security

Security controls shall include:

- Scope-based visibility for employee, manager, and project approver
- Restricted editing after approval or period close
- Controlled export of project and billing-sensitive data

# 11. Audit

The audit trail shall capture:

- Entry create, edit, delete, and approval actions
- Locked-period corrections
- Auto-fill versus manual-entry source
- Export to payroll or billing systems

# 12. AI

AI capabilities may include:

- Suggested time-entry patterns from calendar or historical work
- Detection of suspicious or incomplete allocations
- Reminders for probable missing entries

# 13. Test Cases

- Overlapping entry is blocked
- Closed period rejects direct edit
- Dual approval works in correct order
- Attendance-derived prefill does not overwrite manual adjustments
- Project export includes approved effort only

# 14. Workflows

1. Worker enters or reviews time.
2. System validates period and allocation rules.
3. Timesheet is submitted for approval.
4. Approved entries feed payroll, costing, or billing.

# 15. State Machine

- `draft`
- `submitted`
- `returned`
- `approved`
- `reopened`
- `closed`

# 16. Permissions

- Enter own time
- Submit timesheet
- Approve team timesheet
- Approve project timesheet
- Reopen approved timesheet

# 17. Notifications

- Missing-entry reminders
- Approval task alerts
- Returned timesheet notices
- Period-close warnings

# 18. Configuration

- Timesheet periods
- Validation rules
- Approval models
- Allocation dimensions and export mappings

# 19. Edge Cases

- Employee belongs to multiple projects with different approvers
- Clock data missing for one day but timesheet still required
- Worker changes manager during open period
- Retro project closure invalidates earlier allocation
