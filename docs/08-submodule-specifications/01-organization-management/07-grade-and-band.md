---
id: HRMS-SUB-01-07
title: Grade and band Specification
document: 07-grade-and-band.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Grade and Band defines the enterprise job-level framework used to group roles by seniority, compensation range, benefits eligibility, progression rules, and talent segmentation.

In scope:

- Grade and band master definition
- Leveling and hierarchy relationships
- Compensation and policy linkage
- Role and employee assignment support
- Revision and harmonization governance

# 2. Business

Grades and bands help organizations standardize job levels, progression frameworks, internal equity, leadership segmentation, and compensation architecture. They are widely consumed by payroll, compensation, talent, mobility, and reporting processes.

Business objectives:

- Create consistent job-level structures across the enterprise
- Support compensation planning and benefits eligibility alignment
- Enable workforce analytics and internal equity visibility by level
- Preserve governance during re-leveling, merger harmonization, or policy changes

# 3. Functional

The system shall support:

- Grade and band codes, names, level ordering, and active status
- Grade families, band groups, and optional pay-range references
- Mapping of positions, employees, and roles to grade and band
- Effective-dated grade or band changes for employees and positions
- Country-, entity-, or workforce-type-specific grade frameworks where required
- Harmonization or migration from legacy leveling structures

Detailed rules:

- Grade should remain distinguishable from designation, job title, and compensation amount
- Band progression rules may affect approvals, benefits, talent reviews, and compensation plans
- Changes to grade frameworks must preserve historical workforce and payroll context
- Duplicate or overlapping level semantics should be flagged during harmonization
- Market or region overlays should be attachable without redefining the core grade identity where policy requires
- Grade frameworks should support controlled coexistence during phased harmonization programs

# 4. UX

Primary screens:

- Grade and band catalog
- Level ordering and framework editor
- Employee and position mapping view
- Harmonization impact simulator

UX expectations:

- HR and compensation users should understand level relationships visually and textually
- Mapping screens should expose which policies or compensation rules depend on a grade
- Harmonization views should show legacy-to-target mapping before activation

# 5. API

Representative APIs:

- `POST /api/v1/org/grades`
- `PUT /api/v1/org/grades/{gradeId}`
- `POST /api/v1/org/grades/{gradeId}/retire`
- `POST /api/v1/org/grade-mappings`
- `GET /api/v1/org/grades/{gradeId}/dependencies`
- `POST /api/v1/org/grade-harmonization/simulate`

# 6. Database

Core entities:

- `grade`
- `band`
- `grade_band_mapping`
- `grade_assignment_history`
- `grade_harmonization_map`

Key fields:

- Grade code, name, level order, status
- Band code, family, market segment, active status
- Position reference, employee reference, effective dates
- Legacy grade, target grade, mapping confidence, migration status
- Compensation-range reference, benefits tier, approval tier
- Promotion eligibility flag, succession-tier marker, workforce-plan tier
- Market-overlay reference and local-variance indicator

# 7. Events

Published events:

- `grade.created`
- `grade.updated`
- `grade.retired`
- `grade.assignment_changed`
- `grade.harmonization_approved`

Consumed events:

- `position.created`
- `compensation_cycle.started`
- `employee.promoted`
- `benefits.rule_changed`

# 8. Reports

Required reports:

- Grade and band master report
- Employee population by grade report
- Legacy-to-target harmonization report
- Grade dependency report
- Internal mobility by grade report
- Promotion and movement by grade-band report
- Grade-to-benefits eligibility consistency report

# 9. Dashboards

Operational dashboards:

- Population by level
- Grade framework changes pending
- Harmonization progress
- High-concentration levels or vacant levels

# 10. Security

Security requirements:

- Grade framework maintenance should be restricted to authorized HR and compensation roles
- Some analytics by level may be compensation-sensitive and need scoped access
- Harmonization changes should require stronger governance in large enterprises

# 11. Audit

Audit coverage shall include:

- Grade and band creation and edits
- Assignment changes
- Framework retirement or replacement
- Harmonization mapping approval
- Dependency analysis before structural changes

# 12. AI

AI-assisted opportunities:

- Suggest equivalency mapping between legacy and target grades
- Detect inconsistent leveling usage across functions
- Summarize impact of level-structure changes on compensation and talent processes

AI guardrails:

- AI level-mapping suggestions must remain advisory and explainable to compensation owners
- Market overlay recommendations should not overwrite global framework without approval

# 13. Test Cases

Core test scenarios:

- Create new grade and band
- Assign employee and position to level
- Harmonize legacy grade to new framework
- Prevent retirement of grade with unresolved active usage
- Retrieve dependent compensation or policy mappings
- Preserve local market overlay while changing global band family
- Validate succession-tier dependency after grade change

# 14. Workflows

Primary workflow:

1. Grade framework is defined or updated.
2. Dependencies on compensation, benefits, and talent are validated.
3. Positions and employees are mapped or migrated.
4. Downstream processes consume the updated level model.
5. Retirement or harmonization follows impact-governed workflow.

# 15. State Machine

Grade state model:

- `Draft`
- `Active`
- `Inactive`
- `Harmonizing`
- `Retired`

# 16. Permissions

Representative permissions:

- `grade.create`
- `grade.edit`
- `grade.retire`
- `grade.harmonization.manage`
- `grade.dependencies.view`
- `grade.audit.view`

# 17. Notifications

Notification scenarios:

- Grade framework approval required
- Harmonization simulation completed
- Retired grade still assigned
- Grade dependency changed by compensation rule update

# 18. Configuration

Configurable parameters:

- Level-code standards
- Multi-framework support
- Harmonization approval workflow
- Dependency blocking rules
- Band-family taxonomy

# 19. Edge Cases

Important edge cases:

- Same grade label has different market meaning across countries
- Harmonization affects active merit cycle mid-year
- Position upgraded but employee remains at legacy level temporarily
- Benefits and compensation tiers diverge from nominal band mapping
