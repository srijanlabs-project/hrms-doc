---
id: HRMS-BKL-003
title: Enterprise HRMS Epic Register
document: 03-epic-register.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the top-level epic register for the Enterprise HRMS product backlog.

# 2. Epic Register

| Epic ID | Epic Name | Primary Outcome | Suggested Wave | Priority |
|---|---|---|---|---|
| `E00` | Foundation and Platform | Shared workflow, notification, audit, eventing, configuration, metadata, and platform runtime services | Wave 0 | Critical |
| `E01` | Organization Management | Govern the enterprise structural model used by people, payroll, and reporting | Wave 1 | Critical |
| `E02` | People Management | Deliver the employee system of record and lifecycle master data | Wave 1 | Critical |
| `E03` | Identity and Access | Secure authentication, authorization, and delegated access | Wave 1 | Critical |
| `E04` | Employee Self Service | Provide employee-facing request and record interaction layer | Wave 1 | High |
| `E05` | Manager Self Service | Provide manager cockpit, approvals, and team action workflows | Wave 1 | High |
| `E06` | Recruitment and ATS | Manage hiring from demand planning through offer | Wave 3 | High |
| `E07` | Workforce Management | Manage attendance, shifts, rostering, scheduling, and timesheets | Wave 2 | Critical |
| `E08` | Leave Management | Deliver leave policy, accrual, and approval operations | Wave 2 | Critical |
| `E09` | Payroll | Deliver pay design, processing, validation, retro, and settlement | Wave 2 | Critical |
| `E10` | Statutory and Compliance | Manage statutory contribution, tax, and compliance operations | Wave 2 | Critical |
| `E11` | Performance Management | Enable goals, appraisals, feedback, and calibration | Wave 3 | High |
| `E12` | Learning and Development | Deliver learning assignment, certification, and compliance learning | Wave 3 | Medium |
| `E13` | Talent Management | Support succession and talent-review processes | Wave 3 | Medium |
| `E14` | Compensation and Benefits | Manage compensation cycles and benefits administration | Wave 3 | High |
| `E15` | Employee Experience | Deliver surveys and recognition experiences | Wave 4 | Medium |
| `E16` | Travel Management | Govern pre-trip request and approval process | Wave 4 | Medium |
| `E17` | Expense Management | Manage expense claims and reimbursements | Wave 4 | Medium |
| `E18` | Asset Management | Track asset assignment and return | Wave 4 | Medium |
| `E19` | Helpdesk and Case Management | Deliver service management, SLA, and escalation flows | Wave 4 | High |
| `E20` | Contractor and External Workforce | Govern contractor records, compliance, and access | Wave 4 | High |
| `E21` | Visitor and Workplace Management | Deliver workplace visitor registration and access support | Wave 4 | Medium |
| `E22` | Health Safety and Wellness | Manage incidents, risk, and emergency response | Wave 4 | High |
| `E23` | Communication Platform | Manage campaigns and broadcast communication | Wave 4 | Medium |
| `E24` | Document Management | Govern document repository, signatures, and retention | Wave 4 | High |
| `E25` | Analytics and BI | Deliver governed reporting, workforce analytics, and custom reporting | Wave 5 | High |
| `E26` | AI and Copilot | Deliver copilots, predictions, graph intelligence, and NLQ | Wave 5 | Medium |
| `E27` | Integration Platform | Deliver REST, webhook, streaming, ERP, finance, IdP, and biometric integration capability | Wave 2 | Critical |
| `E28` | Administration | Deliver forms, fields, masters, localization, system settings, and tenant controls | Wave 0 | Critical |
| `E29` | Security and Governance | Deliver masking, access reviews, retention, and governance controls | Wave 0 | Critical |
| `E30` | DevOps and Operations | Deliver backup, restore, and disaster recovery operations | Wave 0 | Critical |
| `E31` | Implementation and Migration | Deliver import, migration, validation, cutover, and rollback readiness | Wave 0 | Critical |
| `E32` | Testing and Quality | Deliver test strategy, regression governance, and release quality framework | Wave 0 onward | Critical |

# 3. Priority Interpretation

- `Critical` - required to operate the enterprise product safely
- `High` - core business value or major control area
- `Medium` - important but can follow after core platform and system-of-record stability

# 4. Recommended Epic Exit Criteria

Every epic should reach all of the following before closure:

- Functional scope for planned release wave is delivered
- Required APIs, database changes, events, reports, notifications, security, and audit behavior are implemented
- Cross-cutting dependencies are validated
- Acceptance coverage and regression coverage are complete
- Implementation and support handoff materials exist where needed

# 5. Epic Dependency Themes

Important recurring dependencies:

- `E00`, `E28`, `E29`, `E30`, and `E31` support nearly all other epics
- `E01`, `E02`, and `E03` support nearly all functional business modules
- `E27` is a dependency for payroll, attendance, finance, identity, and analytics readiness
- `E25` and `E26` should consume stabilized business data from earlier waves
