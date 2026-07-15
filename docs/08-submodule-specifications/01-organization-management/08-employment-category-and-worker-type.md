---
id: HRMS-SUB-01-08
title: Employment category and worker type Specification
document: 08-employment-category-and-worker-type.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Employment Category and Worker Type defines the classification framework used to distinguish permanent employees, fixed-term workers, interns, trainees, contractors, contingent workers, and other workforce populations for policy, payroll, benefits, and compliance purposes.

In scope:

- Classification taxonomy
- Worker-type and employment-category rules
- Policy, payroll, and compliance linkage
- Effective-dated worker classification changes
- Reporting and segmentation support

# 2. Business

Workforce classification is a foundational control because many HRMS decisions depend on it, including leave, payroll treatment, benefits eligibility, notice rules, onboarding, offboarding, and statutory compliance. Poor classification leads to policy leakage and compliance risk.

Business objectives:

- Standardize worker segmentation across the enterprise
- Drive correct policy, payroll, and compliance behavior by workforce type
- Support reporting and analytics across employee and non-employee populations
- Preserve clear history when worker classification changes over time

# 3. Functional

The system shall support:

- Employment categories such as permanent, probationary, contract, temporary, fixed-term, trainee, apprentice, consultant, and intern
- Worker types such as employee, contractor, gig worker, external workforce, or partner workforce
- Entity-, country-, or business-specific classification variants where needed
- Mapping of classification to policy bundles, payroll rules, benefits, notice rules, and access models
- Effective-dated worker classification changes and conversion paths such as intern-to-employee or contractor-to-employee
- Validation against incompatible classification combinations

Detailed rules:

- Worker type should not be treated as interchangeable with legal employment status
- Classification changes should preserve prior policy and payroll history
- Certain combinations may be invalid by country or employment-law rules and should be blocked or flagged
- Conversion workflows may need to preserve identity continuity while changing downstream treatments
- Category and worker-type definitions should support both enterprise-standard and country-specific extensions
- Conversion should explicitly classify whether payroll continuity, benefit reset, or service continuity rules apply

# 4. UX

Primary screens:

- Worker classification catalog
- Classification mapping and rule screen
- Employee classification history view
- Conversion impact simulator

UX expectations:

- HR users should clearly understand the policy and payroll implications of each classification
- Conversion screens should preview downstream effects such as benefits, leave, payroll, and access
- Employee history should show classification evolution without overwriting prior context

# 5. API

Representative APIs:

- `POST /api/v1/org/worker-classifications`
- `PUT /api/v1/org/worker-classifications/{classificationId}`
- `POST /api/v1/org/worker-classifications/{classificationId}/rules`
- `POST /api/v1/org/workers/{workerId}/classification-change`
- `GET /api/v1/org/worker-classifications/{classificationId}/dependencies`
- `POST /api/v1/org/worker-classification-conversions/simulate`

# 6. Database

Core entities:

- `worker_classification`
- `worker_classification_rule`
- `worker_classification_assignment`
- `worker_classification_history`
- `worker_conversion_event`

Key fields:

- Classification code, category, worker type, active status
- Country applicability, legal basis, policy bundle, payroll regime
- Worker ID, effective dates, source event, conversion reason
- Benefits eligibility, notice rule, leave bundle, access model
- Conversion path, previous classification, target classification, impact status
- Service-continuity flag, legal-seniority carry-forward flag, compliance-risk tag
- Time-tracking regime, overtime eligibility, onboarding-template reference

# 7. Events

Published events:

- `worker_classification.created`
- `worker_classification.updated`
- `worker_classification.assigned`
- `worker_classification.changed`
- `worker_conversion.completed`

Consumed events:

- `employee.joined`
- `contractor.activated`
- `offer.accepted`
- `benefits.rule_changed`
- `payroll.group.updated`

# 8. Reports

Required reports:

- Workforce classification report
- Classification history report
- Conversion event report
- Invalid classification combination report
- Policy eligibility by classification report
- Payroll-treatment by classification report
- Service-continuity and conversion-risk report

# 9. Dashboards

Operational dashboards:

- Population by worker type
- Recent classification conversions
- Classification dependency exceptions
- Country-specific classification distribution

# 10. Security

Security requirements:

- Classification maintenance should be limited to authorized HR and compliance administrators
- Conversion actions that impact payroll or benefits should require stronger authorization
- Cross-population analytics should respect employee vs contractor visibility rules

# 11. Audit

Audit coverage shall include:

- Classification definition changes
- Assignment and conversion events
- Effective-date corrections
- Invalid-combination overrides
- Downstream-impact simulations before conversion

# 12. AI

AI-assisted opportunities:

- Detect likely misclassified populations based on data patterns
- Suggest conversion readiness checks
- Highlight country-specific classification anomalies

AI guardrails:

- AI anomaly flags should not change employment status or worker type automatically
- Country-specific recommendations must remain tagged as advisory when legal interpretation is involved

# 13. Test Cases

Core test scenarios:

- Create worker classification with valid rules
- Assign classification to new employee
- Convert worker from intern to employee and preserve history
- Block invalid classification combination
- Preview downstream policy changes before conversion
- Distinguish service continuity from benefits reset during conversion
- Validate overtime or time-tracking regime after classification change

# 14. Workflows

Primary workflow:

1. Classification taxonomy is defined.
2. Workers are assigned categories and worker types.
3. Downstream modules consume classification rules.
4. Classification changes or conversions are simulated and approved.
5. Historical context and downstream recalculations are preserved.

# 15. State Machine

Classification assignment state model:

- `Draft`
- `Active`
- `Superseded`
- `Cancelled`

# 16. Permissions

Representative permissions:

- `worker_classification.create`
- `worker_classification.edit`
- `worker_classification.assign`
- `worker_classification.convert`
- `worker_classification.dependencies.view`
- `worker_classification.audit.view`

# 17. Notifications

Notification scenarios:

- Classification conversion approval required
- Invalid classification detected
- Downstream impact simulation completed
- Conversion activated

# 18. Configuration

Configurable parameters:

- Classification taxonomy
- Country-specific validation rules
- Conversion approval workflow
- Policy-bundle mapping model
- Incompatible-combination rules

# 19. Edge Cases

Important edge cases:

- Same person transitions from contractor to employee within same fiscal period
- Worker type differs by country for same global program
- Legacy migrated records have ambiguous categories
- Conversion occurs after payroll snapshot but before effective date is operationally applied
