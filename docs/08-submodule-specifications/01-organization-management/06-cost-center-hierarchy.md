---
id: HRMS-SUB-01-06
title: Cost center hierarchy Specification
document: 06-cost-center-hierarchy.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Cost Center Hierarchy defines the financial reporting and allocation structure used to assign payroll cost, workforce spend, budgeting responsibility, and management reporting across the organization.

In scope:

- Cost center master setup
- Parent-child financial hierarchy
- Workforce and payroll allocation linkage
- Effective-dated changes and reorganizations
- Reporting and integration support

# 2. Business

Cost center hierarchy is essential for payroll costing, budgeting, workforce analytics, finance reporting, project charging, and managerial accountability. It must remain aligned with enterprise finance structures while supporting HR operational needs.

Business objectives:

- Provide a stable financial allocation structure for workforce cost reporting
- Support payroll cost distribution and downstream finance integration
- Enable budget ownership and headcount visibility by financial hierarchy
- Preserve historical costing context during reorganizations and re-mapping

# 3. Functional

The system shall support:

- Cost center code, name, type, status, and parent-child hierarchy
- Mapping to company, legal entity, department, location, project, or payroll group where relevant
- Effective-dated cost center activation, reparenting, split, merge, and retirement
- Employee, position, allowance, and payroll result linkage to cost centers
- Primary and secondary allocation or split-cost models where approved
- Rollup reporting by cost center family or hierarchy level

Detailed rules:

- Cost center hierarchy should align with finance master data and approved ERP mappings
- Historical payroll and allocation records must retain the cost center effective at processing time
- Invalid or retired cost centers should not accept new assignments without approved exception path
- Split-cost allocation must preserve percentages, effective dates, and approval lineage
- HR-facing labels may differ from ERP labels, but mapping integrity must remain exact
- Allocation rules should distinguish payroll costing, budgeting visibility, and reporting-only assignment where operating model differs
- Cross-entity or project-funded allocations must retain finance-approved ownership and audit lineage

# 4. UX

Primary screens:

- Cost center hierarchy explorer
- Cost center profile and mapping screen
- Allocation assignment view
- Financial impact and reparenting simulator

UX expectations:

- HR and finance admins should see both business-readable labels and official cost center codes
- Allocation views should make split-cost and effective-dating rules obvious
- Hierarchy changes should expose payroll and budgeting impact before activation

# 5. API

Representative APIs:

- `POST /api/v1/org/cost-centers`
- `PUT /api/v1/org/cost-centers/{costCenterId}`
- `POST /api/v1/org/cost-centers/{costCenterId}/reparent`
- `POST /api/v1/org/cost-center-allocations`
- `GET /api/v1/org/cost-centers/{costCenterId}/usage`
- `GET /api/v1/org/cost-centers/hierarchy`

# 6. Database

Core entities:

- `cost_center`
- `cost_center_hierarchy_link`
- `cost_center_allocation`
- `cost_center_erp_mapping`
- `cost_center_status_history`
- `cost_center_change_event`

Key fields:

- Cost center code, name, hierarchy level, status, effective dates
- Parent cost center, child cost center, sort order
- Allocation percentage, employee or position reference, start date, end date
- ERP code, finance owner, budget owner, active mapping status
- Change reason, impacted payroll groups, restructure approval reference
- Reporting label, reporting segment, project-charge indicator
- Retro-cost adjustment flag, open-payroll-impact indicator, allocation validation status

# 7. Events

Published events:

- `cost_center.created`
- `cost_center.updated`
- `cost_center.reparented`
- `cost_center.retired`
- `cost_allocation.changed`

Consumed events:

- `erp.master_synced`
- `employee.assignment.changed`
- `payroll.run.closed`
- `budget.owner_changed`

# 8. Reports

Required reports:

- Cost center hierarchy report
- Employee and position allocation report
- Split-allocation report
- Retired cost center usage exception report
- ERP mapping integrity report
- Payroll costing variance by cost center report
- Retro-cost correction impact report

# 9. Dashboards

Operational dashboards:

- Active cost centers by entity
- Split-allocation population
- Unmapped or invalid finance links
- Upcoming cost center restructures

# 10. Security

Security requirements:

- Cost center maintenance should be jointly governed by authorized HR and finance administrative roles
- Sensitive costing views may require restricted access by function or entity
- ERP mapping edits must be tightly controlled and auditable

# 11. Audit

Audit coverage shall include:

- Cost center creation and edits
- Hierarchy and reparenting changes
- Allocation assignment and percentage changes
- ERP mapping changes
- Retirement and exception assignment actions

# 12. AI

AI-assisted opportunities:

- Detect inconsistent allocations or unused cost centers
- Predict downstream payroll impact of hierarchy or mapping change
- Highlight suspicious split-cost assignments that deviate from norms

AI guardrails:

- AI should not auto-correct allocations without finance-approved workflow
- Payroll-impact predictions must expose which cost dimensions were used in estimation

# 13. Test Cases

Core test scenarios:

- Create cost center and link to hierarchy
- Assign employee to valid cost center
- Apply split-cost allocation with effective dates
- Prevent new assignment to retired cost center
- Reparent cost center and preserve historical payroll costing
- Validate payroll costing when allocation changes mid-period
- Preserve ERP mapping during reporting-label change only

# 14. Workflows

Primary workflow:

1. Finance or HR admin creates cost center.
2. Hierarchy and ERP mapping are configured.
3. Workforce and payroll allocations are assigned.
4. Reporting and payroll processes consume the active hierarchy.
5. Reorganizations or mapping changes proceed through impact-controlled workflow.

# 15. State Machine

Cost-center state model:

- `Draft`
- `Active`
- `Inactive`
- `Reorganizing`
- `Retired`

# 16. Permissions

Representative permissions:

- `cost_center.create`
- `cost_center.edit`
- `cost_center.reparent`
- `cost_allocation.manage`
- `cost_center.erp_mapping.manage`
- `cost_center.audit.view`

# 17. Notifications

Notification scenarios:

- Cost center restructure approval required
- Invalid ERP mapping detected
- Retired cost center still assigned
- Split-allocation change activated

# 18. Configuration

Configurable parameters:

- Cost center code standards
- Hierarchy depth
- Split-allocation rules
- ERP sync ownership
- Retirement approval workflow

# 19. Edge Cases

Important edge cases:

- ERP changes parent cost center before HR restructure is approved
- Employee allocation changes mid-pay period
- One position is funded by multiple cost centers across entities
- Historical cost center remains required for open retro-pay calculations
