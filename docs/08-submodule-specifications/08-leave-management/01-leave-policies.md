---
id: HRMS-SUB-08-01
title: Leave policies Specification
document: 01-leave-policies.md
version: 2.3
status: Draft
---

# 1. Purpose and Scope

Leave Policies define the enterprise rule framework for leave entitlement, eligibility, accrual interaction, restriction, carry-forward, encashment, documentation, and operational interpretation.

In scope:

- Policy design, versioning, and publication
- Eligibility and applicability logic
- Balance and accrual interaction
- Restrictions, blackout periods, and documentation requirements
- Employee-facing interpretation and downstream consumption

# 2. Business

Leave policy is one of the most visible HR policy domains because employees interact with it directly and managers rely on it for staffing decisions. Enterprise leave policy must accommodate statutory requirements, union or workforce agreements, location differences, and business-specific rules while remaining understandable and defensible.

Business objectives:

- Provide transparent, consistent, and explainable leave entitlements
- Support complex policy variation without spreadsheet-based manual interpretation
- Reduce disputes around eligibility, balance usage, carry-forward, and encashment
- Ensure downstream attendance, payroll, and compliance outcomes remain consistent

Key stakeholders:

- HR Policy and Leave Administration
- Managers and Workforce Planners
- Employees
- Payroll Operations
- Compliance and Audit

# 3. Functional

The system shall support:

- Applicability by company, legal entity, location, employee type, grade, gender, union, tenure, or custom dimensions
- Leave types such as annual, casual, sick, parental, bereavement, loss of pay, special leave, comp-off, and regional statutory leave
- Waiting periods, service milestones, probation-linked restrictions, and lifecycle conditions
- Accrual-linked, grant-based, and event-triggered entitlements
- Carry-forward caps, expiry windows, encashment rules, negative balance rules, and consumption priorities
- Prefix-suffix holiday treatment, sandwich rules, minimum or maximum duration, supporting documentation rules, and restricted-date logic
- Future-dated revisions with preserved historical interpretation

Detailed rules:

- Policy conflicts for the same employee and leave context must be prevented unless an approved composite-policy model exists
- Leave type behavior should be convertible into employee-facing explanations without exposing admin complexity
- Policy revision must not silently alter already consumed or approved historical outcomes unless governed corrective workflow is used
- Rule execution order must be deterministic where eligibility, restrictions, and override conditions intersect
- Policy should support both statutory hard rules and internal business preference rules with different override behavior

# 4. UX

Primary screens:

- Leave policy catalog
- Applicability and rule editor
- Version comparison screen
- Employee policy assignment and preview
- Employee-facing leave entitlement explanation

UX expectations:

- HR users should understand scope, exclusions, cost or payroll impact, and conflict warnings before publication
- Employees should see a readable entitlement explanation with examples where possible
- Policy comparison should highlight what changed, who is impacted, and from when
- Admin views should surface collision risk when similar applicability dimensions overlap

# 5. API

Representative APIs:

- `POST /api/v1/leave/policies`
- `PUT /api/v1/leave/policies/{policyId}`
- `POST /api/v1/leave/policies/{policyId}/publish`
- `POST /api/v1/leave/policy-assignments`
- `GET /api/v1/leave/policies/{policyId}/preview`
- `GET /api/v1/leave/policies/effective`
- `POST /api/v1/leave/policies/{policyId}/simulate`

API expectations:

- Publish APIs must validate internal consistency, applicability overlap, and downstream compatibility
- Simulation APIs should allow preview against example employees or populations
- Employee-facing APIs should provide simplified interpretation plus derived entitlements, not raw configuration only

# 6. Database

Core entities:

- `leave_policy`
- `leave_policy_version`
- `leave_policy_assignment`
- `leave_type_rule`
- `leave_restriction_rule`
- `leave_policy_explanation_cache`
- `leave_policy_simulation_run`

Key fields:

- Policy code, name, applicability dimensions, status, effective dates, approval state
- Leave type, entitlement unit, accrual mode, waiting period, service threshold
- Carry-forward cap, expiry, encashment eligibility, negative-balance allowance
- Restriction rule type, blackout calendar, document requirement, sandwich behavior
- Employee-facing explanation, simulation status, impact-population metrics

Data design expectations:

- Version history must preserve every payroll- or entitlement-impacting flag
- Policy applicability should support conflict-detection indexing
- Explanation cache should be refreshable when upstream policy or worker context changes

# 7. Events

Published events:

- `leave.policy.created`
- `leave.policy.published`
- `leave.policy.retired`
- `leave.policy.assigned`
- `leave.policy.conflict_detected`
- `leave.policy.simulation_completed`

Consumed events:

- `employee.assignment.changed`
- `employee.tenure_milestone_reached`
- `holiday.calendar.updated`
- `payroll.period.closed`
- `probation.confirmed`

# 8. Reports

Required reports:

- Policy inventory report
- Employee-to-policy mapping report
- Policy conflict report
- Carry-forward and encashment eligibility report
- Documentation-rule exception report
- Statutory leave coverage report

# 9. Dashboards

Operational dashboards:

- Policies by status and entity
- Employees by active leave policy
- Upcoming future-dated policy changes
- High-conflict applicability rules
- Leave types with most override or exception activity
- Policy-simulation outcomes awaiting review

# 10. Security

Security requirements:

- Publish and retire actions should be restricted to authorized leave-policy owners
- Employee-facing services must not expose internal draft notes, simulation data, or admin-only metadata
- Policy changes affecting statutory or union entitlements may require elevated approval and dual control

# 11. Audit

Audit coverage shall include:

- Policy creation and field-level revisions
- Publish, retire, rollback, and reactivation actions
- Assignment changes and conflict overrides
- Simulation evidence used before publication
- Changes to employee-facing explanation text when derived artifacts are stored

# 12. AI

AI-assisted opportunities:

- Convert policy document text into structured draft rules
- Detect conflicting or redundant leave-rule combinations before publication
- Generate employee-readable entitlement explanations and examples
- Highlight populations likely impacted by a proposed policy revision

AI guardrails:

- AI-generated rules must remain draft until reviewed and approved by policy owners
- Statutory or compliance-critical rules must never be auto-published

# 13. Test Cases

Core test scenarios:

- Create valid leave policy with multiple leave types
- Publish future-dated revision without altering historical approvals
- Prevent conflicting policy assignment for same employee context
- Simulate policy for sample employee population
- Apply documentation, blackout, and sandwich rules correctly
- Generate simplified employee-facing entitlement explanation

# 14. Workflows

Primary workflow:

1. Leave admin drafts or revises policy.
2. System validates internal consistency and applicability overlap.
3. Simulation and approval occur where required.
4. Policy is published and assigned to target population.
5. Request, accrual, approval, encashment, and payroll processes consume the effective version.

# 15. State Machine

Policy state model:

- `Draft`
- `Pending Approval`
- `Published`
- `Future Effective`
- `Superseded`
- `Retired`
- `Rejected`

# 16. Permissions

Representative permissions:

- `leave_policy.create`
- `leave_policy.publish`
- `leave_policy.assign`
- `leave_policy.retire`
- `leave_policy.simulate`
- `leave_policy.audit.view`

# 17. Notifications

Notification scenarios:

- Policy awaiting approval
- Policy simulation completed
- High-impact policy revision published
- Conflict detected during assignment
- Future-effective policy approaching activation

# 18. Configuration

Configurable parameters:

- Applicability dimensions
- Publish and simulation approval workflows
- Negative-balance and override behavior
- Carry-forward and encashment logic
- Sandwich, prefix-suffix, and restricted-date models
- Document threshold rules

# 19. Edge Cases

Important edge cases:

- Employee changes location, worker type, or entity mid-cycle
- Policy changes after leave is approved but before absence date occurs
- Emergency statutory leave is introduced mid-period
- Multiple harmonization policies overlap after merger or acquisition
- Employee gains confirmation or tenure milestone during open leave year
