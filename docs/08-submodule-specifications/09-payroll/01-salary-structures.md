---
id: HRMS-SUB-09-01
title: Salary structures Specification
document: 01-salary-structures.md
version: 2.2
status: Draft
---

# 1. Purpose and Scope

Salary Structures define the governed composition of compensation packages by arranging pay components into reusable frameworks for payroll calculation, budgeting, compensation management, and statutory interpretation.

In scope:

- Structure family design and governance
- Component composition and sequencing
- Applicability by population and payroll context
- Employee assignment and reassignment
- Revision, replacement, and historical integrity

# 2. Business

Salary structures convert compensation policy into executable payroll design. They help standardize how pay is assembled for categories of workers while allowing controlled variation across legal entities, countries, job levels, business units, and legacy populations.

Business objectives:

- Standardize compensation frameworks across employee populations
- Reduce duplicate payroll configuration
- Support transparent revision and migration when compensation models change
- Improve alignment between compensation design, payroll execution, and cost analytics

Key stakeholders:

- Compensation and Benefits
- Payroll Operations
- Finance and Cost Planning
- HR Operations
- HRIS Product and Engineering

# 3. Functional

The system shall support:

- Structure families by entity, country, grade, worker type, union, or payroll group
- Mandatory and optional pay components within a structure
- Sequence control for components that affect later calculations
- Default values, percentage links, formula-driven placeholders, and employee-specific overrides where permitted
- One primary structure and optional secondary or supplemental structures if policy allows
- Effective-dated assignment and future-dated reassignment
- Bulk migration from one structure to another with validation controls

Detailed rules:

- Only one effective primary structure should govern a payroll context at a point in time unless composite-structure mode is explicitly enabled
- Revision of a published structure must not rewrite past payroll interpretation
- Structure changes with pay impact may require approval, communication, and downstream recalculation planning
- Structures should validate compatibility with local country compliance and payroll-group rules before publication

# 4. UX

Primary screens:

- Salary structure catalog
- Structure composition designer
- Version comparison workspace
- Employee structure assignment view
- Impact analysis and migration screen

UX expectations:

- Compensation users should understand structure intent, applicability, and differences without manual spreadsheet comparison
- Assignment views should show effective timeline and source reason for each structure change
- Migration tooling should preview affected employees, payroll groups, and downstream risks before execution

# 5. API

Representative APIs:

- `POST /api/v1/payroll/salary-structures`
- `PUT /api/v1/payroll/salary-structures/{structureId}`
- `POST /api/v1/payroll/salary-structures/{structureId}/versions`
- `POST /api/v1/payroll/salary-structures/assignments`
- `POST /api/v1/payroll/salary-structures/migrations`
- `GET /api/v1/payroll/salary-structures/{structureId}/impact`

API expectations:

- Publication APIs must validate component composition, sequencing, and applicability
- Assignment APIs must detect overlapping effective periods and conflicting primary structures
- Impact APIs should show payroll, reporting, and employee-population consequences of a revision

# 6. Database

Core entities:

- `salary_structure`
- `salary_structure_version`
- `salary_structure_component`
- `employee_salary_structure_assignment`
- `salary_structure_migration_batch`
- `salary_structure_change_reason`

Key fields:

- Structure code, name, entity scope, payroll group, status, owner
- Version number, effective date, approval status, publication timestamp
- Component reference, sequence, mandatory flag, defaulting mode, override policy
- Employee ID, start date, end date, assignment source, migration reference
- Change reason, approver, communication flag, rollback eligibility

Data design expectations:

- Structure versions should be immutable once published
- Assignment history should remain intact across transfers, promotions, and harmonization programs
- Migration batches should retain before and after structure references for audit and rollback analysis

# 7. Events

Published events:

- `salary_structure.created`
- `salary_structure.version_published`
- `salary_structure.assignment_changed`
- `salary_structure.migration_completed`
- `salary_structure.retired`

Consumed events:

- `employee.joined`
- `compensation.revision_approved`
- `employee.promoted`
- `entity_harmonization.wave_started`

# 8. Reports

Required reports:

- Structure inventory report
- Employee structure assignment report
- Structure revision history report
- Structure migration impact report
- Component concentration by structure report

# 9. Dashboards

Operational dashboards:

- Employees by active structure
- Future-dated structure changes
- Structures with high exception or override use
- Harmonization migration progress
- Structures pending review or retirement

# 10. Security

Security requirements:

- Structure design and publication must be limited to authorized compensation and payroll roles
- Population impact views may expose sensitive compensation segmentation and must follow access scope rules
- Bulk migration actions should require higher authorization than routine assignment changes

# 11. Audit

Audit coverage shall include:

- Structure creation and revision history
- Component composition changes
- Employee assignment and reassignment
- Bulk migration execution and outcomes
- Retirement, replacement, and rollback actions

# 12. AI

AI-assisted opportunities:

- Suggest structure consolidation opportunities across near-identical variants
- Estimate payroll impact before structure revision goes live
- Identify employee groups likely misassigned to a structure based on population rules

# 13. Test Cases

Core test scenarios:

- Create and publish valid salary structure
- Assign structure to a new employee population
- Prevent overlapping primary structure assignments
- Execute controlled migration from old structure to new structure
- Preserve historical payroll behavior after future-dated revision

# 14. Workflows

Primary workflow:

1. Compensation or payroll team drafts structure.
2. Components, applicability, and sequencing are configured.
3. Impact checks and approvals are completed.
4. Version is published and assigned or migrated to target population.
5. Payroll run resolves the effective structure version per employee.

# 15. State Machine

Structure version state model:

- `Draft`
- `Under Review`
- `Published`
- `Future Effective`
- `Superseded`
- `Retired`
- `Rejected`

Assignment state model:

- `Planned`
- `Active`
- `Expired`
- `Cancelled`

# 16. Permissions

Representative permissions:

- `salary_structure.create`
- `salary_structure.publish`
- `salary_structure.assign`
- `salary_structure.migrate`
- `salary_structure.retire`
- `salary_structure.audit.view`

# 17. Notifications

Notification scenarios:

- Structure revision awaiting approval
- Future-dated structure becoming effective
- Migration batch completed or failed
- Active employees missing valid structure assignment
- High-impact published change for a large population

# 18. Configuration

Configurable parameters:

- Applicability dimensions
- Composite-structure support
- Version approval workflow
- Assignment overlap rules
- Migration rollback policy
- Communication requirements for pay-impacting changes

# 19. Edge Cases

Important edge cases:

- Employee belongs to multiple payroll contexts in the same period
- Promotion changes structure while arrears and retro calculations remain open
- Merger harmonization requires temporary legacy structure bridge
- Structure revision is published after payroll snapshot but before final payment
