---
id: HRMS-SUB-09-02
title: Pay components Specification
document: 02-pay-components.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Pay Components are the governed payroll atoms used to build salary structures, recurring and one-time payouts, deductions, employer costs, accounting postings, statutory outputs, and employee-facing pay presentation.

In scope:

- Component taxonomy and master-data control
- Calculation behavior and dependency rules
- Tax, statutory, reporting, and accounting flags
- Employee input, system input, and external input compatibility
- Effective dating, retirement, and downstream impact governance

# 2. Business

Every payroll design decision eventually resolves to pay components. A mature component model allows the enterprise to support local compliance, compensation diversity, cost reporting, and reusable payroll design without hardcoding every earning or deduction separately.

Business objectives:

- Establish a reusable payroll vocabulary across companies and countries
- Prevent inconsistent treatment of similar earnings and deductions
- Improve traceability from compensation policy to payroll result and payslip
- Enable finance, payroll, audit, and analytics teams to interpret pay elements consistently

Key stakeholders:

- Payroll Operations
- Compensation and Benefits
- Finance and Accounting
- Tax and Compliance
- HRIS and Product Engineering

# 3. Functional

The system shall support:

- Component types such as earning, deduction, reimbursement, employer contribution, accrual, recovery, adjustment, and informational element
- Calculation methods such as fixed amount, percentage, slab, lookup, formula, source-fed, and rule-engine-driven models
- Recurring, one-time, periodic, and event-triggered component behavior
- Applicability by entity, country, payroll group, worker type, grade, or structure family
- Rounding, cap, floor, sequence, and dependency rules
- Flags for taxable amount, contribution wage, employer cost, net-pay impact, arrears eligibility, and payslip visibility
- Activation, future-dated revision, deactivation, retirement, and replacement lifecycle

Detailed rules:

- Component codes must be unique within configured scope and stable once used in payroll history
- Historical payroll runs must continue to reference the effective component version used at calculation time
- Protected statutory or tax-sensitive components may require stronger approval than local allowance components
- A component may be active centrally but unavailable to selected payroll groups based on applicability restrictions
- Formula and dependency cycles must be prevented at publish time

# 4. UX

Primary screens:

- Pay component catalog
- Component definition editor
- Formula and dependency visualizer
- Usage impact explorer
- Reporting and payslip mapping view

UX expectations:

- Payroll users should understand business meaning, not just technical metadata
- Dependency visualization should reveal all structures, rules, and reports affected by a component change
- Sensitive mappings such as tax or statutory flags should be visible and reviewable before publication
- Draft vs published behavior should be clearly separated to avoid unintended payroll impact

# 5. API

Representative APIs:

- `POST /api/v1/payroll/pay-components`
- `PUT /api/v1/payroll/pay-components/{componentId}`
- `POST /api/v1/payroll/pay-components/{componentId}/versions`
- `GET /api/v1/payroll/pay-components/{componentId}/usage`
- `POST /api/v1/payroll/pay-components/{componentId}/publish`
- `POST /api/v1/payroll/pay-components/{componentId}/retire`

API expectations:

- Write APIs must validate dependency integrity, applicability, and approval requirements
- Usage APIs should enumerate salary structures, formulas, reports, and posting mappings that depend on the component
- Publish and retire APIs must be idempotent and fully auditable

# 6. Database

Core entities:

- `pay_component`
- `pay_component_version`
- `pay_component_formula`
- `pay_component_mapping`
- `pay_component_usage_reference`
- `pay_component_publish_request`

Key fields:

- Component code, name, category, type, scope, risk class, status
- Effective from, effective to, publish status, approval reference
- Calculation method, formula expression, dependency references, lookup table
- Tax flags, statutory flags, payslip label, GL mapping, report bucket
- Arrears eligibility, override eligibility, rounding mode, cap, floor

Data design expectations:

- Version records should preserve all payroll-impacting flags, not only label changes
- Mapping changes should retain prior effective values for historical report reproducibility
- Formula artifacts should support parse validation and dependency traversal

# 7. Events

Published events:

- `pay_component.created`
- `pay_component.version_drafted`
- `pay_component.published`
- `pay_component.retirement_requested`
- `pay_component.retired`
- `pay_component.mapping_changed`

Consumed events:

- `chart_of_accounts.updated`
- `statutory.mapping.changed`
- `salary_structure.version_published`
- `country_compliance_pack.updated`

# 8. Reports

Required reports:

- Component inventory report
- Tax and statutory component mapping report
- Payslip component presentation report
- Active dependency report
- Retired and replacement component report

# 9. Dashboards

Operational dashboards:

- Components by category and status
- Components awaiting approval
- Components with broken mapping or dependency issues
- High-risk component changes this period
- Components nearing retirement with active usage

# 10. Security

Security requirements:

- Only authorized payroll or compensation admins may create or publish components
- Tax, statutory, and employer-cost mappings should be protected from casual editing
- Sensitive component categories such as garnishment, disciplinary recovery, or executive compensation may require scoped visibility

# 11. Audit

Audit coverage shall include:

- Component creation and master-data changes
- Formula and dependency edits
- Mapping changes to GL, tax, statutory, and reporting outputs
- Publish, retire, and replacement actions
- Manual override enablement changes

# 12. AI

AI-assisted opportunities:

- Suggest probable category, flags, and mappings for a newly proposed component
- Detect overlap or near-duplicate components across payroll groups
- Flag risky formula changes likely to affect payroll volatility

AI guardrails:

- AI may recommend but must not auto-publish payroll-impacting component definitions
- Every suggested change should expose confidence and business rationale

# 13. Test Cases

Core test scenarios:

- Create earning component with correct tax and reporting flags
- Create deduction component with statutory mapping
- Prevent publish when formula cycle exists
- Prevent retirement of component still used in active structure
- Publish future-dated version and preserve historical payroll behavior

# 14. Workflows

Primary workflow:

1. Payroll or compensation admin defines component draft.
2. Applicability, formulas, and downstream mappings are configured.
3. System validates dependencies and usage impact.
4. Approval and publication occur where required.
5. Structures and payroll runs consume the effective version.
6. Retirement or replacement follows governed dependency checks.

# 15. State Machine

Component version state model:

- `Draft`
- `Under Review`
- `Published`
- `Superseded`
- `Retired`
- `Rejected`

# 16. Permissions

Representative permissions:

- `pay_component.create`
- `pay_component.edit`
- `pay_component.publish`
- `pay_component.retire`
- `pay_component.view_usage`
- `pay_component.audit.view`

# 17. Notifications

Notification scenarios:

- Component awaiting review or approval
- Component dependency blocks publication or retirement
- Tax or statutory mapping changed for a published component
- Future-dated component version becoming effective soon

# 18. Configuration

Configurable parameters:

- Component taxonomy
- Scope of code uniqueness
- Approval workflow by component risk class
- Formula validation rules
- Retirement policy and replacement requirements
- Payslip display defaults

# 19. Edge Cases

Important edge cases:

- Same legacy component code exists across acquired entities with different meaning
- Component is technically valid but missing required local statutory mapping
- Future-dated retirement collides with already-scheduled off-cycle payroll
- Formula references a component that is later superseded but not semantically equivalent
