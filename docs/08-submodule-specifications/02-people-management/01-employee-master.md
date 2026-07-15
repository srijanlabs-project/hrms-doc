---
id: HRMS-SUB-02-01
title: Employee master Specification
document: 01-employee-master.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Employee Master is the canonical workforce identity and employment record used across the HRMS platform to anchor people, organization, lifecycle, statutory, and operational context.

In scope:

- Person and employment master record
- Organization assignment and reporting structure
- Employment status and lifecycle state
- Enterprise identifiers and source-of-truth governance
- Downstream publish model for dependent modules

# 2. Business

Employee Master is the single most central data domain in the HRMS application. If this record is incomplete, duplicated, stale, or inconsistent, downstream processes such as onboarding, attendance, leave, payroll, performance, learning, access provisioning, compliance, and analytics become unreliable.

Business objectives:

- Provide a governed source of truth for each worker
- Prevent duplicate or conflicting workforce identities
- Preserve historical employment and assignment change history
- Support controlled updates to payroll-impacting and compliance-sensitive data

# 3. Functional

The system shall support:

- Creation of employee records from recruitment, onboarding, migration, API import, or manual entry
- Support for employee code, person ID, employment ID, and cross-system identifiers
- Primary employment relationship and effective-dated assignment history
- Company, legal entity, location, department, cost center, designation, grade, and manager mapping
- Employment statuses such as pre-join, active, suspended, separated, and rehired
- Duplicate detection using configurable identity and employment heuristics
- Controlled changes to payroll-impacting or compliance-sensitive master fields
- Rehire handling without destroying prior employment history

Detailed rules:

- One active primary employment relationship must exist for a worker in a given employing entity context unless concurrent-employment policy is enabled
- Master data changes with downstream impact must create effective-dated history rather than destructive overwrite
- Sensitive fields may be self-service editable, HR-only editable, or fully locked by policy
- Source system ownership must be explicit for each master attribute
- Legal-entity transfer and rehire must preserve traceability across old and new assignments

# 4. UX

Primary screens:

- Employee master summary
- Employment and assignment history
- Reporting structure and organization mapping
- Sensitive identifiers panel
- Cross-system identity linkage view

UX expectations:

- HR users should clearly distinguish authoritative, editable, derived, and synchronized fields
- Critical change impact should be visible before save where downstream modules may be affected
- Sensitive identifiers should be masked by default and reveal only under authorization
- Assignment history should be easy to explain during audits and employee disputes

# 5. API

Representative APIs:

- `POST /api/v1/employees/master`
- `GET /api/v1/employees/master/{employeeId}`
- `PUT /api/v1/employees/master/{employeeId}`
- `POST /api/v1/employees/master/{employeeId}/status-change`
- `POST /api/v1/employees/master/{employeeId}/assignment-change`
- `GET /api/v1/employees/master/{employeeId}/history`

API expectations:

- Write APIs must validate field-level edit rights and source ownership
- History APIs should expose effective-dated change lineage
- Status and assignment change APIs must publish downstream-impacting events with correlation IDs

# 6. Database

Core entities:

- `employee_master`
- `employee_employment`
- `employee_assignment`
- `employee_identifier`
- `employee_status_history`
- `employee_source_mapping`

Key fields:

- Employee code, person key, employment key, source-system IDs
- Employment status, joining date, separation date, worker category
- Company, entity, location, department, role, cost center, manager
- Identity verification status, statutory validation status, rehire indicator
- Effective from, effective to, change reason, source event, approver reference

# 7. Events

Published events:

- `employee.master.created`
- `employee.master.updated`
- `employee.assignment.changed`
- `employee.status.changed`
- `employee.rehired`

Consumed events:

- `recruitment.offer_accepted`
- `onboarding.activated`
- `organization.unit_changed`
- `identity.user_linked`

# 8. Reports

Required reports:

- Employee master register
- Missing mandatory field report
- Duplicate employee report
- Assignment history report
- Rehire and transfer report

# 9. Dashboards

Operational dashboards:

- Active headcount by assignment dimension
- Records with missing critical master data
- Duplicate-detection queue
- Pending sensitive master changes
- Recent organization changes

# 10. Security

Security requirements:

- Sensitive identity, banking-adjacent, and statutory fields must be access-controlled and masked
- Master changes with pay, compliance, or legal impact should require elevated controls where configured
- Source-system integrations must not overwrite protected fields without explicit ownership rules

# 11. Audit

Audit coverage shall include:

- Record creation and merge prevention outcomes
- Sensitive field changes
- Employment status transitions
- Assignment and manager changes
- Source ownership override or manual correction actions

# 12. AI

AI-assisted opportunities:

- Suggest duplicate matches before record creation
- Highlight likely downstream impacts of a proposed master-data change
- Summarize employee-history changes for HR review

# 13. Test Cases

Core test scenarios:

- Create employee record with valid mandatory data
- Reject duplicate identity based on configured rules
- Change manager and assignment with historical preservation
- Rehire separated employee while linking prior employment history
- Block unauthorized edit to payroll-impacting field

# 14. Workflows

Primary workflow:

1. Employee record is created from source process or migration.
2. Mandatory identity and assignment fields are completed.
3. Sensitive fields are verified and governed by source rules.
4. Downstream modules subscribe to authoritative master changes.
5. Lifecycle updates continue through status and assignment change workflows.

# 15. State Machine

Master lifecycle state model:

- `Draft`
- `Pre-Active`
- `Active`
- `Suspended`
- `Separated`
- `Archived`

# 16. Permissions

Representative permissions:

- `employee_master.create`
- `employee_master.edit`
- `employee_master.view_sensitive`
- `employee_master.change_status`
- `employee_master.change_assignment`
- `employee_master.audit.view`

# 17. Notifications

Notification scenarios:

- Employee record created
- Sensitive field validation failed
- Duplicate candidate detected
- Manager or assignment change published
- Separation or rehire completed

# 18. Configuration

Configurable parameters:

- Employee code format
- Duplicate-detection rules
- Concurrent-employment policy
- Field ownership model
- Sensitive-change approval rules

# 19. Edge Cases

Important edge cases:

- Parallel onboarding and migration create duplicate records for same person
- Legal-entity transfer needs continuity without reusing restricted identifiers incorrectly
- Manager becomes inactive while still referenced by active employees
- Rehire occurs before all downstream separation cleanup is complete
