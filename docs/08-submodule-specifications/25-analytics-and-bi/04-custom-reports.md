---
id: HRMS-SUB-25-04
title: Custom reports Specification
document: 04-custom-reports.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Custom Reports governs user-driven report design, execution, scheduling, and distribution beyond the standard analytics library.

In scope:

- Ad hoc report building
- Dataset, field, and filter selection
- Scheduling, export, and sharing
- Row-level security and governance controls
- Reusable saved report definitions

# 2. Business

Even with rich standard dashboards, enterprises need flexible reporting for audits, local operations, and one-time analysis. Custom reporting must stay powerful without becoming a governance or performance risk.

# 3. Functional

The system shall support:

- Selection of approved subject areas and fields
- Filters, sorts, calculated columns, grouping, and aggregation
- Saved report definitions and report templates
- Scheduled output delivery in approved formats
- Share, clone, and personal versus public report ownership
- Runtime validation against row-level security and data-governance policies

Validation rules:

- Users shall only access subject areas and fields granted to their role
- Performance limits shall apply to row volume, joins, and schedule frequency
- Sensitive fields shall be masked or unavailable in export according to policy

# 4. UX

The user experience shall provide:

- Drag-and-drop or wizard-based report builder
- Preview mode with row count and performance hints
- Schedule and distribution setup
- Saved-report library with ownership and sharing state

# 5. API

Representative APIs:

- `POST /api/v1/analytics/custom-reports`
- `PATCH /api/v1/analytics/custom-reports/{reportId}`
- `POST /api/v1/analytics/custom-reports/{reportId}/run`
- `POST /api/v1/analytics/custom-reports/{reportId}/schedule`
- `GET /api/v1/analytics/custom-reports/{reportId}/results`

# 6. Database

Core entities:

- `custom_report_definition`
- `custom_report_field_selection`
- `custom_report_schedule`
- `custom_report_run_log`
- `custom_report_share`

# 7. Events

The platform shall publish:

- `custom-report.created`
- `custom-report.run-completed`
- `custom-report.schedule-triggered`
- `custom-report.access-denied`

# 8. Reports

Required reports:

- Custom-report usage report
- Failed report run report
- Shared-report inventory report
- High-cost query report

# 9. Dashboards

Dashboards shall show:

- Most-used saved reports
- Failed or slow report runs
- Export volume by report owner
- Schedule backlog and completion

# 10. Security

Security controls shall include:

- Subject-area and field-level permissions
- Row-level security applied at query time
- Export restrictions and watermarking for sensitive outputs
- Schedule delivery controls for email or file distribution

# 11. Audit

The audit trail shall capture:

- Report creation and definition changes
- Query execution and export actions
- Sharing and access changes
- Scheduled-delivery history

# 12. AI

AI capabilities may include:

- Natural-language-to-report drafting
- Suggested fields and filters based on user intent
- Performance optimization recommendations

# 13. Test Cases

- User cannot select restricted field
- Shared report honors recipient row-level security
- Scheduled report runs at configured cadence
- Large report triggers performance guardrail
- Export masking applies to sensitive column

# 14. Workflows

1. User builds or selects report definition.
2. System validates access and query complexity.
3. Report is previewed, saved, run, or scheduled.
4. Output is delivered or viewed under governance controls.

# 15. State Machine

- `draft`
- `saved`
- `scheduled`
- `running`
- `completed`
- `failed`
- `archived`

# 16. Permissions

- Create custom report
- Share custom report
- Run custom report
- Schedule custom report
- Access sensitive fields

# 17. Notifications

- Scheduled-run completion alerts
- Failed-run alerts
- Shared-report access notifications
- Query guardrail warnings

# 18. Configuration

- Subject areas and field catalog
- Query limits
- Export formats
- Schedule delivery rules

# 19. Edge Cases

- Shared report owner leaves organization
- Saved report references retired field
- Large population export exceeds allowed threshold
- Query returns zero rows due to row-level security intersection
