---
id: HRMS-SUB-00-04
title: Business rules engine Specification
document: 04-business-rules-engine.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Business Rules Engine is the configurable policy execution layer that evaluates structured rule logic outside hardcoded module flows. It allows HRMS behavior to vary by company, geography, worker type, threshold, or operating model without requiring repeated code customization.

In scope:

- Rule definition and versioning
- Condition and expression modeling
- Rule evaluation at runtime
- Rule conflict and priority handling
- Rule simulation and traceability
- Rule change governance

# 2. Business Context

Enterprise HRMS products contain hundreds of policy decisions such as eligibility, threshold handling, approval routing, accrual logic, payroll exceptions, and compliance conditions. Hardcoding these rules makes implementations slower, riskier, and harder to maintain.

Business outcomes:

- Accelerate policy changes
- Reduce implementation-specific code branching
- Improve consistency of rule execution across modules
- Allow safe simulation before activation
- Improve explainability of automated decisions

# 3. Actors and Responsibilities

Primary roles:

- Platform Admin
- Policy Author
- HR or Payroll Policy Owner
- Reviewer or Approver
- Auditor

Responsibilities:

- Platform Admin manages the engine, runtime controls, and access boundaries
- Policy Author creates or updates rules within allowed domains
- Policy Owner validates whether rule intent matches business policy
- Reviewer or Approver authorizes publish where governance requires it
- Auditor reviews rule history, simulations, and material runtime decisions

# 4. Functional Behavior

The engine shall support:

- Rule templates and reusable rule sets
- Condition groups with AND/OR logic
- Threshold, comparison, lookup, and derived-value rules
- Effective-dated rule publication
- Rule scoping by tenant, module, geography, company, worker type, or transaction type
- Runtime evaluation via API or internal service call
- Simulation against sample or historical payloads
- Rule execution logging and traceability

Typical rule families:

- Leave eligibility
- Approval threshold routing
- Attendance exception qualification
- Payroll blocking exception thresholds
- Compensation recommendation boundaries
- Statutory inclusion or exclusion rules
- Notification audience selection

# 5. Data and Field Design

Core entities:

- `rule_definition`
- `rule_version`
- `rule_condition_group`
- `rule_condition`
- `rule_action`
- `rule_scope_mapping`
- `rule_execution_log`
- `rule_simulation_result`

Important field groups:

- Rule identifier, name, and category
- Module or transaction binding
- Effective start and end dates
- Priority and conflict strategy
- Input field references
- Expected action or outcome
- Runtime execution result and explanation

Data expectations:

- Published rule versions must be immutable
- Simulations must not mutate runtime state
- Runtime logs must preserve enough data to explain why a rule produced a given outcome

# 6. UX and Interaction Model

Primary screens:

- Rule catalog
- Rule designer
- Version compare view
- Rule simulation console
- Runtime trace viewer

UX expectations:

- Rule authors should be able to understand the business meaning of each rule
- Designers for rule authoring screens should reduce the need for raw expression editing where visual builders are feasible
- Simulations should clearly show matched conditions and resulting actions

# 7. API and Service Contracts

Representative APIs:

- `POST /api/v1/platform/rules`
- `PUT /api/v1/platform/rules/{ruleId}`
- `POST /api/v1/platform/rules/{ruleId}/publish`
- `POST /api/v1/platform/rules/evaluate`
- `POST /api/v1/platform/rules/simulate`
- `GET /api/v1/platform/rules/{ruleId}/versions`

API expectations:

- Create and update APIs must validate syntax and referenced attributes
- Evaluate APIs must return rule result plus diagnostic context where authorized
- Simulation APIs must support side-by-side comparison across rule versions
- Publish APIs must prevent activation of incomplete or invalid rules

# 8. Workflow and Business Rules

Typical workflow:

1. Policy author drafts a rule or updates a future version.
2. System validates expression structure and field references.
3. Author simulates rule on sample scenarios.
4. Reviewer or approver publishes rule if required.
5. Runtime services invoke the active version.

Critical governance rules:

- No rule publish without validation success
- Contradictory active rules must be prevented or explicitly prioritized
- High-impact rule changes should require approval and deployment evidence

# 9. State Machine

Rule version states:

- Draft
- Validated
- Pending Approval
- Published
- Superseded
- Retired

# 10. Events and Notifications

Published events:

- `rules.definition.created`
- `rules.version.validated`
- `rules.version.published`
- `rules.evaluation.failed`

Notifications:

- Rule validation failed
- Rule publish approval required
- High-impact rule published

# 11. Reports and Dashboards

Reports:

- Rule inventory report
- Runtime rule execution exception report
- Published rule change history report

Dashboards:

- Rule versions by status
- Failed evaluations by rule family
- High-risk rule changes awaiting approval

# 12. Security, Permissions, and Audit

Security requirements:

- Rule design rights must be permission-controlled by rule family or module scope
- High-risk rule categories should require stronger governance than low-risk informational rules

Audit requirements:

- Rule create, edit, validate, publish, retire
- Simulation records where business decisions relied on them
- Runtime evaluation trace for critical decisions where feasible

# 13. Configuration

Configurable items:

- Allowed rule families
- Expression operators by module
- Approval requirements by risk level
- Runtime trace verbosity
- Conflict resolution strategy

# 14. Edge Cases and Exception Handling

- Circular rule dependency
- Missing reference field at evaluation time
- Two active rules produce contradictory outcomes
- Rule valid syntactically but invalid semantically for real business scenario
- Field dictionary changes break existing rule references

# 15. Test Scenarios

- Create valid threshold rule
- Reject invalid field reference
- Simulate rule with matching and non-matching cases
- Publish approved rule and verify runtime activation
- Detect conflicting rules at publish time

# 16. Dependencies and Integrations

Dependencies:

- Metadata framework
- Workflow engine
- Audit engine
- Permission and role model

Integrations:

- Transaction modules invoking policy logic
- Analytics for rule outcome review
- Simulation and support tooling

# 17. Assumptions

- Modules call the rule engine through supported contracts instead of embedding local-only policy logic
- A controlled field dictionary exists for rule references
