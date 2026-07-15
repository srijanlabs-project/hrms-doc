---
id: HRMS-SUB-01-05
title: Reporting structure Specification
document: 05-reporting-structure.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Reporting Structure governs the formal manager and supervisory relationships used for approvals, workflow routing, visibility, talent decisions, and organizational accountability.

In scope:

- Primary reporting line definition
- Secondary or matrix reporting support
- Effective-dated manager changes
- Manager hierarchy resolution
- Workflow and visibility dependency support

# 2. Business

The reporting structure is one of the most heavily consumed organizational constructs in HRMS. It determines who approves, who sees team data, how talent reviews roll up, and how operational accountability is assigned across the workforce.

Business objectives:

- Maintain accurate and current managerial relationships
- Support workflow routing and team visibility reliably
- Preserve historical manager lineage for audit and analytics
- Accommodate matrix and interim reporting patterns where needed

# 3. Functional

The system shall support:

- Primary manager, dotted-line manager, reviewer, and temporary acting-manager relationships where configured
- Effective-dated manager assignments and future-dated manager changes
- Automatic manager resolution for workflow routing, team dashboards, and delegated approvals
- Vacancy, acting-manager, and interim-lead handling
- Hierarchy traversal for direct reports, indirect reports, and escalation chains
- Validation against self-management loops, cycles, and inactive manager assignment

Detailed rules:

- One active primary reporting manager should exist per employee unless special workforce rules explicitly allow otherwise
- Matrix or dotted-line relationships must remain distinguishable from approval-authority relationships
- Historical approvals and reports should remain attributable to the effective manager at the time of action
- Manager changes may trigger downstream recalculation for approvals, leave queues, and team dashboards
- Interim or vacancy coverage should not silently replace the historical primary manager record
- Reporting-line derivation for analytics should remain explainable when multiple line types exist

# 4. UX

Primary screens:

- Reporting structure explorer
- Employee manager assignment view
- Team hierarchy dashboard
- Manager change impact screen

UX expectations:

- HR and managers should clearly understand current and future reporting relationships
- Hierarchy navigation should support both individual and team-centric views
- Impact screens should expose pending tasks, approvals, and delegations affected by a manager change

# 5. API

Representative APIs:

- `POST /api/v1/org/reporting-lines`
- `PUT /api/v1/org/reporting-lines/{lineId}`
- `GET /api/v1/org/reporting-lines/effective/{employeeId}`
- `POST /api/v1/org/reporting-lines/{lineId}/activate`
- `GET /api/v1/org/managers/{managerId}/teams`
- `POST /api/v1/org/reporting-lines/validate`

# 6. Database

Core entities:

- `reporting_line`
- `reporting_line_history`
- `manager_hierarchy_snapshot`
- `acting_manager_assignment`
- `matrix_reporting_assignment`

Key fields:

- Employee ID, primary manager ID, line type, start date, end date, status
- Acting-manager reason, effective window, approval reference
- Hierarchy level, approval-authority flag, dotted-line flag
- Validation result, cycle flag, inactive-manager flag
- Manager-visibility override flag, reviewer relationship flag, talent-review reporting flag
- Last hierarchy rebuild timestamp and dependency-resolution token

# 7. Events

Published events:

- `reporting_line.created`
- `reporting_line.changed`
- `reporting_line.activated`
- `acting_manager.assigned`
- `manager_hierarchy.rebuilt`

Consumed events:

- `employee.assignment.changed`
- `employee.status.changed`
- `delegation.activated`
- `workflow.task_created`

# 8. Reports

Required reports:

- Reporting structure report
- Manager change history report
- Employees without valid manager report
- Matrix reporting report
- Acting-manager coverage report
- Manager span-of-control report
- Workflow-impact from manager-change report

# 9. Dashboards

Operational dashboards:

- Unmanaged employee population
- Manager load distribution
- Pending future-dated manager changes
- Team-size distribution by level

# 10. Security

Security requirements:

- Reporting-line maintenance should be limited to authorized HR or organization admins
- Team-visibility permissions should rely on governed hierarchy resolution, not ad hoc broad access
- Sensitive matrix or confidential temporary assignments may require restricted visibility

# 11. Audit

Audit coverage shall include:

- Reporting-line creation and edits
- Acting-manager and temporary coverage assignments
- Validation overrides
- Hierarchy rebuild actions
- Team-visibility resolution disputes

# 12. AI

AI-assisted opportunities:

- Detect abnormal manager span or hierarchy bottlenecks
- Predict workflow disruption from manager vacancies
- Suggest interim coverage where manager transitions are planned

AI guardrails:

- AI interim-coverage suggestions must not activate acting-manager authority automatically
- Span-of-control anomalies should be reported with context rather than assumed to be errors

# 13. Test Cases

Core test scenarios:

- Assign valid primary manager
- Prevent self-referential or cyclic manager relationship
- Activate future-dated manager change
- Resolve team hierarchy for direct and indirect reports
- Preserve historical manager for prior approval audit
- Preserve acting-manager distinction during temporary cover period
- Rebuild hierarchy after manager inactivation without losing historical chain

# 14. Workflows

Primary workflow:

1. Manager relationship is created or updated.
2. System validates structural integrity and downstream impact.
3. Effective relationship becomes active.
4. Workflow, dashboards, and visibility features consume the hierarchy.
5. Future changes and acting-manager coverage continue under governed control.

# 15. State Machine

Reporting-line state model:

- `Draft`
- `Scheduled`
- `Active`
- `Superseded`
- `Cancelled`

# 16. Permissions

Representative permissions:

- `reporting_line.create`
- `reporting_line.edit`
- `reporting_line.activate`
- `reporting_line.validate_override`
- `manager_hierarchy.view`
- `reporting_line.audit.view`

# 17. Notifications

Notification scenarios:

- Future-dated manager change approaching
- Employee missing valid manager
- Acting-manager assignment created
- Reporting-cycle validation failure detected

# 18. Configuration

Configurable parameters:

- Allowed line types
- Matrix-reporting support
- Hierarchy depth limits
- Acting-manager rules
- Validation strictness

# 19. Edge Cases

Important edge cases:

- Manager separates before future-dated reassignment becomes active
- Employee belongs to matrix program with multiple operational supervisors
- Acting-manager assignment overlaps with formal manager change
- Reorganization creates temporary orphan employees until hierarchy rebuild completes
