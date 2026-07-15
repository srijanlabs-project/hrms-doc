---
id: HRMS-SUB-01-02
title: Legal entity Specification
document: 02-legal-entity.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Legal Entity defines the statutory employing or contracting entity used for employment, payroll, taxation, benefits, and compliance obligations.

In scope:

- Legal-entity master setup
- Statutory and financial identity attributes
- Relationship to company, payroll, and compliance structures
- Entity activation, inactivation, and retirement
- Entity-scoped policy and employee applicability

# 2. Business

Legal entity is one of the most critical structural objects in HRMS because it defines who legally employs or contracts the worker, which payroll and tax regime applies, and which statutory rules govern the relationship.

Business objectives:

- Represent statutory employing entities accurately
- Anchor payroll, tax, benefits, and labor-law behavior to the correct entity
- Support multi-country and multi-entity operations in one platform
- Preserve clean statutory and financial reporting boundaries

# 3. Functional

The system shall support:

- Legal-entity code, statutory name, registration identifiers, country, and operational status
- Mapping to parent company, payroll groups, bank relationships, statutory schemes, and work calendars
- Entity-specific defaults such as tax regime, payroll currency, standard working rules, and policy bundles
- Employing-entity and contracting-entity distinctions where required
- Effective-dated activation and retirement controls
- Employee, contractor, and requisition linkage to valid entity context

Detailed rules:

- Legal entity should be the authoritative object for employment and payroll statutory context
- A legal entity must belong to a company but may have distinct policies from sibling entities
- Entity identifiers such as tax registrations must be unique within the tenant where relevant
- Retirement or inactivation must not orphan employees, contractors, or payroll history
- Cross-entity transfers should preserve prior entity history and initiate downstream recalculation where needed
- Local statutory deadlines and filing calendars should be attachable at entity level where country model requires
- Employing and contracting roles should remain explicit for mixed workforce operating models

# 4. UX

Primary screens:

- Legal-entity register
- Legal-entity profile and statutory details
- Entity-to-payroll and policy mapping screen
- Dependency impact and transfer analysis view

UX expectations:

- Admins should clearly distinguish legal entity from company or location
- Statutory identifiers and compliance mappings should be grouped and validated clearly
- Impact views should show active employees, payroll groups, and integrations before any status change

# 5. API

Representative APIs:

- `POST /api/v1/org/legal-entities`
- `GET /api/v1/org/legal-entities/{entityId}`
- `PUT /api/v1/org/legal-entities/{entityId}`
- `POST /api/v1/org/legal-entities/{entityId}/activate`
- `POST /api/v1/org/legal-entities/{entityId}/retire`
- `GET /api/v1/org/legal-entities/{entityId}/dependencies`

# 6. Database

Core entities:

- `legal_entity`
- `legal_entity_registration`
- `legal_entity_policy_mapping`
- `legal_entity_status_history`
- `legal_entity_dependency_snapshot`

Key fields:

- Entity code, legal name, short name, status, effective dates
- Parent company, country, payroll currency, employer-type classification
- Tax registration, labor registration, social-security registration, banking reference
- Default payroll group, standard policy mapping, operational segment
- Filing calendar reference, statutory-contact owner, legal-address and branch indicator
- Contractor-employing eligibility flag, benefits-plan default, finance-approval owner

# 7. Events

Published events:

- `legal_entity.created`
- `legal_entity.activated`
- `legal_entity.updated`
- `legal_entity.retirement_requested`
- `legal_entity.retired`

Consumed events:

- `company.activated`
- `statutory.scheme_updated`
- `payroll.calendar.changed`
- `bank.reference.updated`

# 8. Reports

Required reports:

- Legal-entity master report
- Entity registration report
- Employee population by legal entity report
- Entity dependency and payroll readiness report
- Entity statutory configuration completeness report
- Cross-entity transfer and historical-assignment report

# 9. Dashboards

Operational dashboards:

- Entities by country and status
- Missing statutory registration alerts
- Payroll and compliance readiness by entity
- Active transfer activity across entities

# 10. Security

Security requirements:

- Entity creation and statutory field maintenance should be limited to trusted admin roles
- Sensitive financial and statutory identifiers should be masked where full visibility is not required
- Cross-entity access must follow company, legal, and payroll segregation rules

# 11. Audit

Audit coverage shall include:

- Entity creation and updates
- Statutory identifier changes
- Activation or retirement actions
- Policy and payroll mapping changes
- Dependency checks before inactivation

# 12. AI

AI-assisted opportunities:

- Detect likely configuration gaps for newly created entities
- Compare sibling entities for inconsistent statutory or payroll setup
- Summarize impact of entity changes on downstream workers and payroll

AI guardrails:

- AI should not infer statutory compliance readiness without highlighting missing source evidence
- Comparison outputs must distinguish policy difference from actual configuration defect

# 13. Test Cases

Core test scenarios:

- Create entity with valid registrations
- Prevent duplicate statutory identifier where unique constraint applies
- Map entity to payroll and policy context
- Block retirement when active employees still exist
- Transfer employee across entities and preserve historical context
- Validate entity-level filing calendar linkage before activation where mandatory
- Preserve payroll currency and legal history during intra-company entity transfer

# 14. Workflows

Primary workflow:

1. Admin creates legal entity and statutory profile.
2. Entity is mapped to payroll, policies, and calendars.
3. Entity becomes active for employment or contracting.
4. Workers and business structures use the entity in ongoing operations.
5. Retirement or restructuring follows controlled dependency review.

# 15. State Machine

Legal-entity state model:

- `Draft`
- `Active`
- `Inactive`
- `Retiring`
- `Retired`

# 16. Permissions

Representative permissions:

- `legal_entity.create`
- `legal_entity.edit`
- `legal_entity.activate`
- `legal_entity.retire`
- `legal_entity.dependencies.view`
- `legal_entity.audit.view`

# 17. Notifications

Notification scenarios:

- Entity activation approved
- Statutory registration missing or invalid
- Retirement requested with unresolved population
- Entity configuration drift detected

# 18. Configuration

Configurable parameters:

- Entity code standard
- Registration validation rules
- Payroll and policy default mappings
- Retirement approval workflow
- Cross-entity transfer controls

# 19. Edge Cases

Important edge cases:

- One company contains entities across different countries and currencies
- Entity goes inactive operationally but remains open for historical tax obligations
- Same worker moves across entities in same payroll year
- Entity split requires future and historical reporting separation
