---
id: HRMS-SUB-02-03
title: Employment information Specification
document: 03-employment-information.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Employment Information governs the effective-dated employment relationship data that defines how an employee is engaged by the organization.

In scope:

- Employment status and assignment details
- Job, grade, department, location, and manager mappings
- Employment dates, worker category, and legal-entity assignment
- Changes from lifecycle actions such as transfer and promotion
- Downstream usage by payroll, security, analytics, and statutory processing

# 2. Business

Employment information is the structural core of the employee record. It determines pay eligibility, approval chains, reporting hierarchies, provisioning scope, statutory applicability, and workforce planning accuracy.

Business outcomes:

- Maintain a reliable current and historical employment record
- Support effective-dated organization changes without data loss
- Prevent mismatch between people operations and payroll or access systems
- Enable reporting by true employment structure, not manual spreadsheets

# 3. Functional

The system shall support:

- Primary assignment details including employee number, employment type, worker type, legal employer, business unit, department, cost center, location, and manager
- Job attributes such as designation, job code, job family, grade, band, pay group, and FTE
- Employment dates including hire date, group joining date, confirmation date, seniority date, and service-continuity dates
- Assignment changes from transfer, promotion, demotion, temporary assignment, deputation, and secondment
- Multiple concurrent assignments where organization policy allows
- Effective-dated future-dated changes with conflict detection
- Current, past, and future assignment history views
- Validation against master data such as location, legal entity, grade, and reporting structure

Validation rules:

- No employment segment shall create overlapping primary assignment dates
- Manager assignment shall be validated against reporting and entity rules
- Inactive or closed master data shall not be selectable for future assignment unless allowed by exception flow
- Compensation-affecting fields shall trigger downstream recalculation or pending review markers

# 4. UX

The user experience shall provide:

- Employment profile timeline with current assignment summary and change history
- HR operations forms optimized for effective-date entry and impact review
- Manager and employee views that show only relevant employment attributes
- Visual warnings for future-dated conflicts, reporting gaps, and cross-entity issues

# 5. API

Representative APIs:

- `GET /api/v1/people/employees/{employeeId}/employment-information`
- `POST /api/v1/people/employees/{employeeId}/assignments`
- `PATCH /api/v1/people/assignments/{assignmentId}`
- `GET /api/v1/people/employees/{employeeId}/assignment-history`
- `POST /api/v1/people/assignments/{assignmentId}/validate`

API requirements:

- APIs shall support as-of-date queries
- Assignment updates shall return impacted downstream domains such as payroll or security
- Future-dated changes shall be versioned, not overwritten silently

# 6. Database

Core entities:

- `employee_assignment`
- `employment_status_history`
- `assignment_change_request`
- `assignment_reporting_link`
- `employment_date_marker`

Key data requirements:

- Assignment records shall be effective-dated and sequence-aware
- Employment dates shall distinguish original hire, rehire, and adjusted service dates
- Change-request records shall preserve trigger source, approval outcome, and rollback notes

# 7. Events

The platform shall publish:

- `employee.assignment.created`
- `employee.assignment.updated`
- `employee.assignment.future-dated`
- `employee.manager.changed`
- `employee.employment-status.changed`

# 8. Reports

Required reports:

- Current workforce by assignment structure report
- Future-dated employment changes report
- Reporting-gap and invalid-manager report
- Assignment-history audit report

# 9. Dashboards

Dashboards shall show:

- Workforce by entity, department, and grade
- Upcoming organizational changes
- Data-quality exceptions affecting payroll or reporting
- Span-of-control and manager assignment anomalies

# 10. Security

Security controls shall include:

- Role-based restriction on employment data edits
- Segregation between HR operations, managers, and payroll viewers
- Controlled access to historical assignments and sensitive date changes
- Secure propagation of downstream changes through approved integrations only

# 11. Audit

The audit trail shall capture:

- Assignment creation and all field-level changes
- Effective-date adjustments and backdated corrections
- System-generated changes from approved lifecycle actions
- Downstream impact acknowledgments where applicable

# 12. AI

AI capabilities may include:

- Detection of structurally inconsistent employment records
- Suggestions for impacted downstream tasks when assignment changes occur
- Summaries of organizational movement patterns

AI guardrails:

- AI shall not auto-change employment structure
- Suggestions affecting legal or payroll outcomes shall require human review

# 13. Test Cases

Minimum test coverage shall include:

- Future-dated transfer does not overlap existing assignment
- Manager change updates approval hierarchy dependencies
- Invalid grade-location combination is blocked
- Backdated job change triggers downstream impact marker
- As-of-date query returns correct assignment snapshot

# 14. Workflows

Primary workflow:

1. HR or approved workflow proposes employment change.
2. System validates effective date and master-data compatibility.
3. Change is approved where needed.
4. Employment record updates current and future history.
5. Downstream systems are notified of impacted attributes.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `approved`
- `scheduled`
- `effective`
- `superseded`
- `cancelled`

# 16. Permissions

Permissions shall include:

- View employment profile
- Create or edit assignments
- Approve employment changes
- Backdate assignment corrections
- View historical assignment records

# 17. Notifications

Notifications shall support:

- Change approval tasks
- Future-dated change reminders before effective date
- Manager change notifications to affected stakeholders
- Downstream processing alerts for high-impact changes

# 18. Configuration

Administrators shall configure:

- Assignment types and status values
- Effective-date conflict rules
- Employment-date definitions and default derivation logic
- Approval routing by change type and employee population

# 19. Edge Cases

The design shall address:

- Employee has concurrent assignments across entities
- Future-dated transfer is superseded before effective date
- Rehire requires preserving historical service markers
- Employee temporarily reports to project manager outside line hierarchy
- Backdated entity correction affects prior payroll periods
