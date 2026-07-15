---
id: HRMS-SUB-02-07
title: Tax information Specification
document: 07-tax-information.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Tax Information governs employee-specific tax master data needed to calculate payroll withholding, exemptions, declarations, and year-end reporting.

In scope:

- Tax identifiers and residency attributes
- Tax regime selections and declarations
- Employee-specific withholding settings
- Effective-dated corrections and compliance review
- Hand-off to statutory tax-calculation engines

# 2. Business

Employee tax data sits at the boundary between HR master data and payroll compliance. Weak control here creates inaccurate deductions, filing defects, employee grievances, and audit risk.

Business outcomes:

- Maintain accurate tax master data for each employee
- Support lawful payroll withholding and statutory reporting
- Reduce downstream exceptions in TDS or local tax processing
- Give employees transparency into data driving their payroll tax treatment

# 3. Functional

The system shall support:

- Storage of tax identifiers such as PAN, SSN, SIN, tax file number, or local equivalent
- Residency, tax location, social-tax category, and special withholding markers
- Regime election or filing status options where supported by country
- Prior-employer tax carry-forward details for mid-year hires
- Tax declaration and proof windows linked to payroll tax computation
- Change workflows for identifier correction, regime selection, or exceptional withholding treatment
- Country-specific data models and validations
- Masked employee self-view and detailed payroll or compliance view

Validation rules:

- Tax identifier format and uniqueness shall be configurable by country
- Missing mandatory tax data shall block selected payroll or compliance outputs as configured
- Effective-date changes to tax location or residency shall trigger recomputation review
- Manual withholding overrides shall require explicit authorization and reason

# 4. UX

The user experience shall provide:

- Employee-friendly tax profile page with masked identifiers and status indicators
- HR or payroll workbench for correcting master tax details and reviewing exceptions
- Clear warnings about missing or invalid tax data before payroll cut-off
- Guided declaration flow with help text and proof requirements

# 5. API

Representative APIs:

- `GET /api/v1/people/employees/{employeeId}/tax-information`
- `PATCH /api/v1/people/employees/{employeeId}/tax-information`
- `POST /api/v1/people/employees/{employeeId}/tax-declarations`
- `POST /api/v1/people/employees/{employeeId}/tax-regime-selection`
- `POST /api/v1/people/tax-information/{recordId}/validate`

API requirements:

- APIs shall distinguish tax master data from payroll result data
- Identifier values shall be masked except for authorized payroll or compliance roles
- Validation responses shall include country-specific rule codes

# 6. Database

Core entities:

- `employee_tax_profile`
- `tax_identifier_record`
- `tax_regime_election`
- `tax_declaration_header`
- `tax_residency_history`
- `tax_exception_case`

Key data requirements:

- Tax profile shall store effective tax location, status, and country schema version
- Identifier records shall preserve correction history and masked display values
- Exception cases shall capture blocking issue, payroll impact, and resolution owner

# 7. Events

The platform shall publish:

- `employee.tax-profile.updated`
- `employee.tax-regime.selected`
- `employee.tax-identifier.invalid`
- `employee.tax-declaration.submitted`
- `employee.tax-recompute-review-required`

# 8. Reports

Required reports:

- Missing or invalid tax-identifier report
- Tax-regime election report
- Prior-employer tax import report
- Payroll tax-master exception report

# 9. Dashboards

Dashboards shall show:

- Tax-profile completeness by population
- Payroll-blocking tax issues
- Declaration campaign completion
- Cross-country tax-data readiness for payroll close

# 10. Security

Security controls shall include:

- Field-level masking for tax identifiers
- Restricted access to declaration documents and proof attachments
- Strict segregation between employee self-service and payroll-admin capabilities
- Logging of any unmasked access to tax identifiers

# 11. Audit

The audit trail shall capture:

- Tax master edits and effective-date changes
- Identifier corrections
- Regime-selection changes
- Access to unmasked tax fields and documents

# 12. AI

AI capabilities may include:

- Validation assistance for likely identifier-entry errors
- Employee guidance on incomplete declaration forms
- Pattern detection on tax-data defects before payroll processing

AI guardrails:

- AI shall not give legal tax advice
- Tax determination shall remain rules-driven and human-governed

# 13. Test Cases

Minimum test coverage shall include:

- Invalid tax identifier is rejected per country rule
- Mid-year hire tax import updates withholding basis correctly
- Unauthorized user sees masked tax identifier
- Residency change triggers recomputation review flag
- Missing mandatory tax field blocks configured filing output

# 14. Workflows

Primary workflow:

1. Employee or HR maintains tax profile.
2. System validates jurisdiction rules and completeness.
3. Tax elections or declarations route through configured process.
4. Payroll tax engine consumes approved master data.
5. Exceptions are monitored until resolved.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `validated`
- `exception-review`
- `approved`
- `effective`
- `superseded`

# 16. Permissions

Permissions shall include:

- View own tax profile
- Edit own declarations
- Edit employee tax master
- Validate or approve tax changes
- View unmasked identifiers

# 17. Notifications

Notifications shall support:

- Missing tax-profile reminders
- Declaration and proof deadlines
- Payroll exception alerts
- Approval outcomes for submitted tax changes

# 18. Configuration

Administrators shall configure:

- Country tax schemas and identifier formats
- Regime or filing-status options
- Mandatory fields by employee population
- Approval and recomputation rules for tax changes

# 19. Edge Cases

The design shall address:

- Employee works in one tax location and resides in another
- Rehire within same tax year
- Tax identifier unavailable at hire and supplied later
- Cross-border assignee requires multiple active tax references
- Retro correction after year-end filing period begins
