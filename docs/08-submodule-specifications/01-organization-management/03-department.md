---
id: HRMS-SUB-01-03
title: Department Specification
document: 03-department.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Department defines the functional or administrative grouping used to organize employees, managers, workflows, and reporting within the enterprise structure.

In scope:

- Department master definition
- Department hierarchy and ownership
- Employee and position association
- Functional reporting and policy applicability support
- Department lifecycle and restructuring control

# 2. Business

Departments are one of the most commonly used organizational dimensions in HRMS. They influence employee assignment, approvals, headcount reporting, budgeting, talent reviews, and internal service ownership.

Business objectives:

- Provide a stable functional grouping for workforce operations
- Support clear ownership and reporting alignment
- Enable cost, headcount, and performance analytics by department
- Accommodate reorganizations without losing historical context

# 3. Functional

The system shall support:

- Department code, department name, short name, department type, and status
- Parent-child department structures where multi-level functional hierarchy exists
- Department owner, business head, HRBP, and support-owner references
- Effective-dated department creation, rename, merge, split, and retirement
- Mapping of employees, positions, roles, and service ownership to departments
- Department-based applicability for workflows, analytics, and selected policies

Detailed rules:

- Department should remain distinct from cost center, location, and legal entity even when names overlap
- Department changes should preserve historical employee assignment context and reporting continuity
- Merges or splits should identify impacted employees, managers, and downstream approvals before activation
- Inactive departments should not be assignable to new employees or positions unless override is approved
- Department ownership should support both business and HR accountable roles where organizations use dual stewardship
- Department-level service ownership should remain available for case routing and communication scoping

# 4. UX

Primary screens:

- Department register
- Department hierarchy view
- Department profile and ownership screen
- Restructuring impact simulator

UX expectations:

- Users should be able to navigate departments as functional groups, not only as codes
- Ownership and leadership information should be clearly visible
- Impact views should show affected population and dependencies before structural changes

# 5. API

Representative APIs:

- `POST /api/v1/org/departments`
- `GET /api/v1/org/departments/{departmentId}`
- `PUT /api/v1/org/departments/{departmentId}`
- `POST /api/v1/org/departments/{departmentId}/merge`
- `POST /api/v1/org/departments/{departmentId}/retire`
- `GET /api/v1/org/departments/{departmentId}/population`

# 6. Database

Core entities:

- `department`
- `department_hierarchy_link`
- `department_owner_assignment`
- `department_status_history`
- `department_restructure_event`

Key fields:

- Department code, name, type, status, effective dates
- Parent department, hierarchy level, business segment tags
- Department head, HRBP, support owner, approval owner
- Population count, open position count, active workflow references
- Confidential reorg flag, budget-owner reference, service-catalog linkage
- Historical alias or renamed-from value for search continuity

# 7. Events

Published events:

- `department.created`
- `department.updated`
- `department.restructured`
- `department.retired`
- `department.owner_changed`

Consumed events:

- `employee.assignment.changed`
- `position.created`
- `org_tree.changed`

# 8. Reports

Required reports:

- Department master report
- Department population report
- Department restructuring impact report
- Department owner report
- Inactive department assignment exception report
- Department leadership vacancy report
- Department-to-service ownership report

# 9. Dashboards

Operational dashboards:

- Department population by function
- Open restructures
- Departments without current owner
- High-turnover or high-vacancy departments

# 10. Security

Security requirements:

- Department maintenance should be limited to trusted organization admins
- Confidential reorganization changes may require restricted visibility
- Department-based access or analytics views must respect hierarchy and scope rules

# 11. Audit

Audit coverage shall include:

- Department creation and edits
- Ownership changes
- Merge, split, and retirement actions
- Population-impact simulations
- Confidential restructure access

# 12. AI

AI-assisted opportunities:

- Suggest duplicate or overlapping departments after reorganization
- Highlight unusually fragmented department structures
- Summarize likely workflow impact of department changes

AI guardrails:

- AI overlap suggestions should not merge departments automatically
- Workflow-impact inference must indicate which dependent systems contributed to the prediction

# 13. Test Cases

Core test scenarios:

- Create department with valid ownership
- Block assignment to retired department
- Merge department and preserve employee history
- Update department owner and publish downstream impact
- Simulate restructure before activation
- Preserve historical alias after department rename
- Route service ownership correctly after department split

# 14. Workflows

Primary workflow:

1. Admin creates or revises department.
2. Ownership and hierarchy relationships are defined.
3. Impact checks run for existing population and workflows.
4. Department becomes active or restructured.
5. Downstream modules consume the updated department context.

# 15. State Machine

Department state model:

- `Draft`
- `Active`
- `Inactive`
- `Restructuring`
- `Retired`

# 16. Permissions

Representative permissions:

- `department.create`
- `department.edit`
- `department.restructure`
- `department.retire`
- `department.population.view`
- `department.audit.view`

# 17. Notifications

Notification scenarios:

- Department owner changed
- Restructure approval required
- Department retirement blocked by active population
- Impact simulation completed

# 18. Configuration

Configurable parameters:

- Department code standard
- Maximum hierarchy depth
- Ownership-role requirements
- Restructure approval workflow
- Inactive-assignment blocking rules

# 19. Edge Cases

Important edge cases:

- Department exists across multiple legal entities with shared functional name
- Confidential future-state department created before public reorg announcement
- Department split affects existing manager hierarchy in conflicting ways
- Department is inactive operationally but retained for historical reporting
