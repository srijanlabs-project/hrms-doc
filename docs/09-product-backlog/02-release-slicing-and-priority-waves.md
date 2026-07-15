---
id: HRMS-BKL-002
title: Enterprise HRMS Release Slicing and Priority Waves
document: 02-release-slicing-and-priority-waves.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines a practical product-delivery sequence for the Enterprise HRMS application based on the completed specification repository.

# 2. Delivery Strategy

The recommended strategy is to build the platform in waves that produce usable business capability while progressively introducing more advanced intelligence, reporting, and optimization.

# 3. Wave Model

## Wave 0 - Platform and Delivery Foundations

Objective:

- Create the shared platform, security, operational, and delivery scaffolding required for all functional modules

Primary epics:

- `E00` Foundation and Platform
- `E28` Administration
- `E29` Security and Governance
- `E30` DevOps and Operations
- `E31` Implementation and Migration

Mandatory outcomes:

- Configuration, metadata, workflow, notification, audit, document generation, eventing, and localization
- RBAC, ABAC, data masking, retention, and access reviews
- Backup, restore, disaster recovery
- Dynamic forms, dynamic fields, dynamic masters, system settings, tenant controls
- Import, migration, validation, cutover, rollback

## Wave 1 - Core HCM and Employee System of Record

Objective:

- Establish the employee master and organization backbone used by all downstream modules

Primary epics:

- `E01` Organization Management
- `E02` People Management
- `E03` Identity and Access
- `E04` Employee Self Service
- `E05` Manager Self Service

Mandatory outcomes:

- Company, legal entity, org tree, department, grade, reporting, calendar
- Employee master, personal, employment, identity, tax, bank, documents, timeline
- Authentication, SSO, MFA, roles, permissions, delegation
- Employee requests and manager cockpit

## Wave 2 - Time, Leave, and Payroll Control

Objective:

- Enable attendance-to-pay execution with statutory and operational accuracy

Primary epics:

- `E07` Workforce Management
- `E08` Leave Management
- `E09` Payroll
- `E10` Statutory and Compliance
- `E27` Integration Platform

Mandatory outcomes:

- Attendance, biometric capture, shift planning, scheduling, timesheets, overtime
- Leave policy, accrual, approval
- Salary structures, components, processing, validation, retro pay, full and final settlement
- PF, ESIC, TDS, compliance calendar, country-specific compliance
- ERP, finance, IdP, biometric, REST, webhook, streaming integration contracts

## Wave 3 - Recruitment and Talent Lifecycle

Objective:

- Support talent acquisition, onboarding, performance, learning, and internal growth

Primary epics:

- `E06` Recruitment and ATS
- `E11` Performance Management
- `E12` Learning and Development
- `E13` Talent Management
- `E14` Compensation and Benefits

Mandatory outcomes:

- Demand planning through offer management
- Goal, appraisal, feedback, calibration
- LMS, certifications, compliance learning
- Succession and talent reviews
- Compensation planning, salary review, merit, benefits, flex benefits

## Wave 4 - Employee Operations and Enterprise Services

Objective:

- Complete the daily enterprise HR operating model and workforce support surfaces

Primary epics:

- `E15` Employee Experience
- `E16` Travel Management
- `E17` Expense Management
- `E18` Asset Management
- `E19` Helpdesk and Case Management
- `E20` Contractor and External Workforce
- `E21` Visitor and Workplace Management
- `E22` Health Safety and Wellness
- `E23` Communication Platform
- `E24` Document Management

## Wave 5 - Intelligence, Analytics, and Optimization

Objective:

- Add advanced reporting, predictions, copilots, and planning intelligence once core process fidelity is stable

Primary epics:

- `E25` Analytics and BI
- `E26` AI and Copilot

Mandatory outcomes:

- Workforce and attrition analytics
- Predictive and custom reporting
- HR copilot and policy assistant
- Attrition and flight-risk prediction
- Skills graph, AI workforce planning, natural-language querying

# 4. Recommended MVP Boundary

If a phased MVP is required, recommended MVP boundary is:

- Full Wave 0
- Full Wave 1
- Core portions of Wave 2:
  - attendance
  - leave
  - payroll processing and validation
  - statutory compliance
  - core integrations
- Core portions of Wave 3:
  - requisitions
  - candidate pipeline
  - onboarding
  - appraisals
  - compensation basics

# 5. Release Governance Gates

Each wave should clear:

- Product readiness
- Architecture readiness
- Data readiness
- Security readiness
- QA readiness
- Implementation readiness
- Support readiness

# 6. Suggested Team Topology

Recommended parallel delivery streams:

- `Platform Core`
- `Core HCM`
- `Time and Payroll`
- `Talent`
- `Employee Operations`
- `Analytics and AI`
- `Implementation and Migration`

# 7. Dependency Logic

Critical dependency rules:

- Wave 0 is prerequisite to all other waves
- Wave 1 must stabilize before full Wave 2 and Wave 3 scale-out
- Integration Platform must progress alongside Wave 2 and Wave 3
- AI and advanced analytics should not outpace source data quality and permissions maturity

# 8. Release Outcome

This wave model allows the HRMS to be delivered as a controlled enterprise program instead of a flat undifferentiated feature list.
