---
id: HRMS-UX-017
title: Module Sub-Module To Screen Coverage Matrix
document: 17-module-submodule-to-screen-coverage-matrix.md
version: 1.1
status: Draft
---

# 1. Purpose

This document is the screen-completeness audit layer for the Enterprise HRMS application.

It exists to prevent missing screens during design and development by mapping:

- top-level module
- sub-module
- primary persona
- primary screens
- supporting screens
- target screen templates
- condition or variant expectations
- mobile expectation
- current mockup or design status

# 2. How To Use

Use this matrix when:

- planning design backlog
- estimating frontend scope
- reviewing whether a module is really UI-complete
- deciding mockup priority waves
- validating that `L2` and `L3` sub-modules are not missing screens

# 3. Coverage Rules

This matrix follows these rules:

1. every sub-module in the sub-module catalog must map to at least one primary screen
2. any sub-module that changes workflow or user action meaningfully must also map to a supporting screen, wizard, review workspace, or console
3. if a sub-module changes behavior materially by condition, the row must reference its condition pack or explicit condition variants
4. if a screen is desktop-primary, mobile still needs a documented behavior decision

# 4. Status Legend

- `Ready` means screen refs and mockups exist at least for the current targeted wave
- `Planned` means screen refs are defined but design or mockup work is not yet complete
- `Mapped` means the sub-module is now screen-traceable even if the visual asset is not yet produced

# 5. Reference Documents

This matrix should be used with:

- [01-submodule-catalog.md](D:/HRMS-doc/docs/04-submodule-catalog/01-submodule-catalog.md)
- [14-screen-mockup-master-registry.md](D:/HRMS-doc/docs/10-ui-ux-architecture/14-screen-mockup-master-registry.md)
- [15-screen-variant-and-conditional-state-catalog.md](D:/HRMS-doc/docs/10-ui-ux-architecture/15-screen-variant-and-conditional-state-catalog.md)
- [20-screen-template-architecture-and-conversion-model.md](D:/HRMS-doc/docs/10-ui-ux-architecture/20-screen-template-architecture-and-conversion-model.md)
- [21-screen-template-assignment-matrix.md](D:/HRMS-doc/docs/10-ui-ux-architecture/21-screen-template-assignment-matrix.md)

# 6. Coverage Matrix

| Module | Sub-Module(s) | Depth | Primary Persona | Primary Screen Ref(s) | Supporting Screen Ref(s) | Template Target(s) | Variant Pack / Conditions | Mobile | Status |
|---|---|---|---|---|---|---|---|---|---|
| `00 Foundation and Platform` | Product principles and personas | `L1` | platform admin, product | `W0-SCR-001`, `W0-SCR-002` | `GLB-SCR-002` | `WS-05`, `UT-06`, `UT-02` | `PK-DASH-01` | reduced | `Mapped` |
| `00 Foundation and Platform` | Feature flag framework, scheduler, search engine, template engine, number series engine | `L2` | platform admin | `W0-SCR-017`, `W0-SCR-002`, `W0-SCR-010` | `ADM-SCR-004`, `OPS-SCR-002` | `AD-01`, `UT-06`, `AD-05` | `PK-CONSOLE-01`, `COND-COMPARE` | required | `Mapped` |
| `00 Foundation and Platform` | Configuration framework | `L3` | platform admin, org admin | `W0-SCR-004` | `W0-SCR-017`, `ORG-ADM-002` | `AD-02`, `AD-01` | `PK-CONSOLE-01`, `COND-READ-ONLY-PROVIDER`, `COND-APPROVAL-PENDING` | required | `Ready` |
| `00 Foundation and Platform` | Metadata framework | `L3` | architect, platform admin | `W0-SCR-005` | `W0-SCR-014`, `W0-SCR-013` | `AD-02`, `AD-05` | `PK-CONSOLE-01`, `COND-VERSION-COMPARE` | reduced | `Ready` |
| `00 Foundation and Platform` | Workflow engine, business rules engine | `L3` | platform admin | `W0-SCR-006` | `W0-SCR-003`, `MSS-SCR-003`, `REC-SCR-005` | `AD-02`, `TX-01` | `PK-CONSOLE-01`, `COND-DRAFT-PUBLISHED`, `COND-STUCK-ITEM` | reduced | `Ready` |
| `00 Foundation and Platform` | Notification engine | `L3` | platform admin, communications admin | `W0-SCR-007` | `COMMS-SCR-001` | `AD-02`, `UT-01` | `PK-CONSOLE-01`, `COND-CHANNEL-PREVIEW`, `COND-DELIVERY-FAILURE` | required | `Ready` |
| `00 Foundation and Platform` | Document generation engine | `L3` | HR admin, platform admin | `W0-SCR-010` | `DOC-SCR-002`, `DOC-SCR-003` | `AD-05`, `MD-03` | `PK-BUILDER-01`, `COND-MERGE-PREVIEW`, `COND-TEMPLATE-ERROR` | reduced | `Ready` |
| `00 Foundation and Platform` | Audit engine | `L3` | compliance admin, support lead | `W0-SCR-008` | `W0-SCR-019`, `ORG-ADM-007` | `AD-04`, `AD-03` | `PK-QUEUE-01`, `COND-MASKED`, `COND-EXPORT-REQUEST` | reduced | `Ready` |
| `00 Foundation and Platform` | Event bus, integration hub | `L3` | ops lead, integration admin | `W0-SCR-009` | `INT-SCR-001`, `INT-SCR-002` | `AD-04` | `PK-MONITOR-01`, `COND-REPLAY`, `COND-DEAD-LETTER` | required | `Ready` |
| `00 Foundation and Platform` | AI platform | `L3` | AI admin, platform architect | `W0-SCR-011` | `AIC-SCR-001`, `AIC-SCR-005` | `AD-02`, `DB-03` | `PK-CONSOLE-01`, `COND-VIOLATION-ALERT` | reduced | `Ready` |
| `00 Foundation and Platform` | Localization engine | `L3` | localization admin | `W0-SCR-012`, `W0-SCR-016` | `W0-SCR-007` | `AD-04`, `AD-02` | `PK-MONITOR-01`, `COND-MISSING-BUNDLE` | reduced | `Mapped` |
| `01 Organization Management` | Tenant, company, legal entity, holding company and group company | `L2/L3` | org admin, implementation lead | `ORG-SCR-001`, `ORG-SCR-002` | `W0-SCR-018`, `ADM-SCR-007` | `MD-02`, `MD-04`, `WS-04` | `PK-CONSOLE-01`, `COND-APPROVAL-PENDING` | required | `Mapped` |
| `01 Organization Management` | Business unit, division, department, section and team, branch and office, region, zone and territory | `L2/L3` | org admin, HR operations | `ORG-SCR-001`, `ORG-SCR-003` | `PEO-SCR-002`, `MGR-SCR-002` | `MD-02` | `PK-CONSOLE-01`, `COND-TREE-VIEW` | required | `Mapped` |
| `01 Organization Management` | Country, state, district, city, location, campus, building, floor, work area | `L2` | org admin | `ORG-SCR-001`, `ORG-SCR-003` | `VWP-SCR-001`, `VWP-SCR-003` | `MD-02` | `PK-CONSOLE-01` | required | `Mapped` |
| `01 Organization Management` | Organization tree, reporting structure | `L3` | org admin, manager | `ORG-SCR-003` | `PEO-SCR-006`, `MGR-SCR-001` | `MD-02` | `PK-CONSOLE-01`, `COND-COMPARE` | reduced | `Mapped` |
| `01 Organization Management` | Cost center hierarchy, profit center hierarchy, project hierarchy | `L2/L3` | finance admin, HR admin | `ORG-SCR-003`, `ORG-SCR-004` | `PAY-SCR-002`, `REC-SCR-001` | `MD-02`, `AD-02` | `PK-CONSOLE-01` | reduced | `Mapped` |
| `01 Organization Management` | Job family, job function, grade and band, designation, career track, employment category and worker type | `L2/L3` | HR operations | `ORG-SCR-004`, `PEO-SCR-002` | `REC-SCR-001`, `TAL-SCR-003` | `AD-02`, `MD-02` | `PK-CONSOLE-01`, `COND-IN-USE` | required | `Mapped` |
| `01 Organization Management` | Work calendar, holiday calendar, fiscal calendar, organization policies, organization branding | `L2/L3/L1` | org admin | `ORG-SCR-004` | `LEV-SCR-001`, `W0-SCR-018`, `ORG-ADM-003` | `AD-02`, `TX-04`, `WS-04` | `PK-CONSOLE-01`, `COND-COMPARE` | required | `Mapped` |
| `02 People Management` | Employee master, personal information, employment information | `L3` | HR operations | `PEO-SCR-001`, `PEO-SCR-002` | `HRO-SCR-001`, `EMP-SCR-002` | `MD-04`, `MD-02` | `PK-PROFILE-01`, `COND-EFFECTIVE-DATED` | required | `Mapped` |
| `02 People Management` | Contact details and address, passport/visa/driving license, education and experience, certifications/skills/languages | `L2` | employee, HR operations | `PEO-SCR-001`, `PEO-SCR-002` | `EMP-SCR-002`, `LRN-SCR-003` | `MD-04` | `PK-PROFILE-01`, `COND-INCOMPLETE-PROFILE` | required | `Mapped` |
| `02 People Management` | National identity, medical information, bank accounts, tax information | `L3` | HR operations, employee | `PEO-SCR-003`, `PEO-SCR-004` | `EMP-SCR-005`, `PAY-SCR-002` | `MD-04`, `MD-03` | `PK-PROFILE-01`, `COND-SENSITIVE-VIEW`, `COND-OTP-REQUIRED` | required | `Mapped` |
| `02 People Management` | Family details, dependents, nominees, emergency contacts, digital signature | `L2` | employee, HR operations | `PEO-SCR-001`, `PEO-SCR-004` | `EMP-SCR-002`, `DOC-SCR-002` | `MD-04`, `MD-03` | `PK-PROFILE-01` | required | `Mapped` |
| `02 People Management` | Preboarding, onboarding | `L3` | HR operations, employee | `HRO-SCR-003`, `PEO-SCR-007` | `EMP-SCR-001`, `DOC-SCR-001` | `DB-01`, `MD-03`, `WS-01` | `PK-DASH-01`, `PK-WIZARD-01`, `COND-DOCS-MISSING` | required | `Mapped` |
| `02 People Management` | Probation and confirmation, promotion/demotion/transfer, deputation/secondment, salary revision, contract renewal | `L2/L3` | HR operations, manager | `PEO-SCR-007`, `HRO-SCR-002` | `MGR-SCR-007`, `CMP-SCR-002` | `MD-03`, `TX-06` | `PK-WIZARD-01`, `COND-APPROVAL-PENDING`, `COND-RETRO-EFFECTIVE` | required | `Mapped` |
| `02 People Management` | Exit, retirement, alumni, employee documents, employee timeline | `L3/L2/L1` | HR operations, employee | `PEO-SCR-005`, `PEO-SCR-006`, `PEO-SCR-007` | `EMP-SCR-003`, `PAY-SCR-006`, `AST-SCR-001` | `MD-04`, `MD-05`, `MD-03` | `PK-PROFILE-01`, `PK-WIZARD-01`, `COND-INACTIVE` | required | `Mapped` |
| `03 Identity and Access` | User accounts, authentication, OAuth and federation, SSO, MFA | `L2/L3` | org admin, IT admin | `IAM-SCR-001`, `IAM-SCR-003` | `ORG-ADM-004`, `GLB-SCR-003` | `AD-02`, `UT-07` | `PK-CONSOLE-01`, `COND-MFA-REQUIRED` | required | `Mapped` |
| `03 Identity and Access` | Roles, permissions, delegation | `L3` | org admin, security admin | `IAM-SCR-002`, `IAM-SCR-004` | `W0-SCR-020`, `ORG-ADM-001` | `AD-03`, `UT-07` | `PK-CONSOLE-01`, `COND-CONFLICT-WARNING`, `COND-DELEGATION-ACTIVE` | required | `Mapped` |
| `03 Identity and Access` | Proxy login, session management, device management | `L2` | security admin, support lead | `IAM-SCR-004` | `GLB-SCR-003`, `W0-SCR-008` | `UT-07`, `AD-04` | `PK-PROFILE-01`, `COND-SUPPORT-CONTEXT` | reduced | `Mapped` |
| `04 Employee Self Service` | Personal profile, documents | `L2` | employee | `EMP-SCR-002`, `EMP-SCR-003` | `PEO-SCR-001`, `PEO-SCR-005` | `MD-04` | `PK-PROFILE-01`, `COND-UPLOAD-PENDING` | required | `Mapped` |
| `04 Employee Self Service` | Leave, attendance, travel | `L2` | employee | `EMP-SCR-006`, `ESS-SCR-004` | `WRK-SCR-001`, `TRV-SCR-001` | `DB-01`, `TX-03` | `PK-QUEUE-01`, `COND-MISSING-PUNCH`, `COND-BALANCE-LOW` | required | `Mapped` |
| `04 Employee Self Service` | Claims, payslips, benefits, assets, helpdesk | `L2` | employee | `EMP-SCR-005`, `EMP-SCR-008`, `ESS-SCR-006` | `XPN-SCR-001`, `AST-SCR-001`, `HLP-SCR-001` | `MD-04`, `DB-01`, `MD-02`, `UT-02` | `PK-QUEUE-01` | required | `Mapped` |
| `04 Employee Self Service` | Requests | `L3` | employee | `EMP-SCR-004` | `MGR-SCR-003`, `HRO-SCR-005` | `TX-06`, `TX-01` | `PK-QUEUE-01`, `COND-DRAFT`, `COND-RETURNED` | required | `Mapped` |
| `04 Employee Self Service` | Goals, learning | `L1` | employee | `EMP-SCR-007` | `PRF-SCR-001`, `LRN-SCR-001` | `DB-01` | `PK-DASH-01` | required | `Mapped` |
| `05 Manager Self Service` | Team dashboard, team analytics | `L3/L2` | manager | `MGR-SCR-001`, `MGR-SCR-006` | `ANL-SCR-001` | `WS-02`, `DB-01`, `WS-06` | `PK-DASH-01`, `COND-ABSENCE-SPIKE` | required | `Mapped` |
| `05 Manager Self Service` | Daily manager briefing, team risk, birthdays, absences, pending actions | `L3/L2` | manager | `MGR-SCR-008` | `MGR-SCR-001`, `MGR-SCR-003`, `EXR-SCR-005` | `WS-02` | `PK-DASH-01`, `COND-AI-BRIEFING`, `COND-CELEBRATION-DUE`, `COND-ABSENCE-SPIKE` | required | `Ready` |
| `05 Manager Self Service` | Team attendance, team leave, budget approvals | `L2` | manager | `MGR-SCR-006`, `MGR-SCR-003` | `WRK-SCR-001`, `LEV-SCR-002`, `CMP-SCR-001` | `DB-01`, `TX-01`, `TX-04` | `PK-QUEUE-01` | required | `Mapped` |
| `05 Manager Self Service` | Performance reviews, hiring approvals, transfers and promotions | `L3` | manager | `MGR-SCR-004`, `MGR-SCR-005`, `MGR-SCR-007` | `PRF-SCR-002`, `REC-SCR-005`, `PEO-SCR-007` | `TX-01`, `MD-03` | `PK-QUEUE-01`, `PK-WIZARD-01` | required | `Mapped` |
| `06 Recruitment and ATS` | Manpower planning, requisitions, internal mobility | `L3/L2` | recruiter, hiring manager | `REC-SCR-001` | `MGR-SCR-005`, `MGR-SCR-007` | `MD-02`, `MD-03` | `PK-QUEUE-01`, `COND-DRAFT`, `COND-ON-HOLD` | required | `Mapped` |
| `06 Recruitment and ATS` | Career portal, candidate portal | `L3` | candidate, recruiter | `REC-SCR-002`, `REC-SCR-003` | `REC-SCR-004` | `TX-05`, `MD-04` | `PK-PROFILE-01`, `PK-QUEUE-01`, `COND-STAGE-BLOCK` | required | `Mapped` |
| `06 Recruitment and ATS` | Resume parsing, talent pool, screening, assessments | `L2/L3` | recruiter | `REC-SCR-002`, `REC-SCR-003` | `REC-SCR-006` | `TX-05`, `MD-04`, `TX-01` | `PK-QUEUE-01`, `COND-BGV-PENDING` | required | `Mapped` |
| `06 Recruitment and ATS` | Interview scheduling, interview feedback | `L3` | recruiter, interviewer | `REC-SCR-004` | `REC-SCR-003`, `REC-SCR-005` | `TX-03`, `MD-04`, `TX-01` | `PK-WIZARD-01`, `COND-PANEL-CONFLICT`, `COND-FEEDBACK-MISSING` | required | `Mapped` |
| `06 Recruitment and ATS` | Offer management, background verification, joining handoff | `L3/L2` | recruiter, HR operations | `REC-SCR-005` | `HRO-SCR-003`, `PEO-SCR-007` | `TX-01`, `DB-01`, `MD-03` | `PK-QUEUE-01`, `COND-OFFER-EXPIRED`, `COND-COMPENSATION-HOLD` | required | `Mapped` |
| `07 Workforce Management` | Attendance, biometric integration, GPS attendance, face recognition, QR attendance | `L3/L2` | HR operations, employee | `WRK-SCR-001`, `EMP-SCR-006` | `MGR-SCR-006`, `W0-SCR-009` | `MD-02`, `DB-01`, `AD-04` | `PK-QUEUE-01`, `COND-DEVICE-MISMATCH`, `COND-MISSING-PUNCH` | required | `Mapped` |
| `07 Workforce Management` | Shift management, shift rotation, workforce scheduling | `L3/L2` | workforce admin, manager | `WRK-SCR-002`, `WRK-SCR-003` | `MGR-SCR-006` | `TX-03`, `DB-01` | `PK-WIZARD-01`, `PK-CONSOLE-01`, `COND-ROTATION`, `COND-UNDER-STAFFED` | required | `Mapped` |
| `07 Workforce Management` | Rostering, timesheets, overtime, comp-off, flexible hours | `L3/L2` | workforce admin, employee | `WRK-SCR-003`, `WRK-SCR-004`, `WRK-SCR-005` | `EMP-SCR-006`, `PAY-SCR-003` | `TX-03`, `MD-02`, `TX-01` | `PK-CONSOLE-01`, `PK-QUEUE-01`, `COND-OVERTIME-RISK` | required | `Ready` |
| `08 Leave Management` | Leave policies, leave types, sandwich rules, holiday integration | `L3/L2` | HR admin | `LEV-SCR-001` | `ORG-SCR-004` | `AD-02` | `PK-CONSOLE-01`, `COND-SANDWICH-RULE` | reduced | `Mapped` |
| `08 Leave Management` | Leave accrual, carry forward, encashment | `L3/L2` | HR admin, payroll admin | `LEV-SCR-003` | `PAY-SCR-006`, `EMP-SCR-006` | `TX-04`, `DB-01` | `PK-DASH-01`, `COND-CARRY-FORWARD` | required | `Mapped` |
| `08 Leave Management` | Leave calendar, leave approval, team leave planning | `L2/L3` | manager, employee | `LEV-SCR-002`, `LEV-SCR-003` | `EMP-SCR-006`, `MGR-SCR-006` | `TX-01`, `TX-04`, `DB-01` | `PK-QUEUE-01`, `COND-BLACKOUT-PERIOD`, `COND-TEAM-CONFLICT` | required | `Mapped` |
| `09 Payroll` | Salary structures, pay components, earnings and deductions | `L3` | payroll admin | `PAY-SCR-002`, `CMP-SCR-001` | `PAY-SCR-001` | `MD-02`, `DB-01` | `PK-CONSOLE-01` | reduced | `Mapped` |
| `09 Payroll` | Loans and advances, variable pay, incentives and bonus | `L2` | payroll admin, finance approver | `PAY-SCR-002`, `CMP-SCR-003` | `XPN-SCR-003` | `MD-02` | `PK-CONSOLE-01` | reduced | `Mapped` |
| `09 Payroll` | Arrears and retro pay, payroll processing, payroll validation | `L3` | payroll admin | `PAY-SCR-003`, `PAY-SCR-002`, `PAY-SCR-001` | `PAY-SCR-006` | `TX-01`, `MD-02`, `DB-01` | `PK-QUEUE-01`, `COND-ERROR-HEAVY`, `COND-CALC-IN-PROGRESS` | reduced | `Mapped` |
| `09 Payroll` | Payroll anomaly detection, explanation, approval routing | `L3` | payroll admin, finance approver | `PAY-SCR-007` | `PAY-SCR-003`, `PAY-SCR-001`, `AIC-SCR-006` | `TX-01`, `DB-03` | `PK-QUEUE-01`, `COND-ANOMALY-EXPLAINED`, `COND-ROUTE-PENDING` | required | `Ready` |
| `09 Payroll` | Payslips, bank advice, full and final settlement | `L2/L3` | payroll admin, employee | `PAY-SCR-005`, `PAY-SCR-006` | `EMP-SCR-005`, `PEO-SCR-007` | `TX-01`, `MD-04`, `MD-03` | `PK-QUEUE-01`, `COND-FNF` | required | `Mapped` |
| `10 Statutory and Compliance` | PF, ESIC, professional tax, labour welfare fund, gratuity, bonus compliance, minimum wages, shops and establishment, factory compliance | `L2/L3` | payroll admin, compliance officer | `STA-SCR-001`, `STA-SCR-003` | `PAY-SCR-004`, `PAY-SCR-005` | `MD-02`, `TX-04` | `PK-CONSOLE-01`, `COND-FILING-DUE` | reduced | `Ready` |
| `10 Statutory and Compliance` | TDS, country-specific compliance, compliance calendar | `L3` | payroll admin, compliance officer | `STA-SCR-002`, `STA-SCR-004`, `STA-SCR-003` | `PAY-SCR-005`, `ANL-SCR-001` | `TX-04`, `WS-06`, `MD-02` | `PK-CONSOLE-01`, `PK-DASH-01`, `COND-OVERDUE` | reduced | `Ready` |
| `11 Performance Management` | Goal management, OKRs and KPIs, competencies, check-ins, 1:1 meetings | `L2/L3` | employee, manager | `PRF-SCR-001` | `EMP-SCR-007`, `MGR-SCR-004` | `DB-01`, `TX-01` | `PK-DASH-01`, `COND-REVIEW-DUE` | required | `Mapped` |
| `11 Performance Management` | Appraisals, 360 feedback, calibration, bell curve | `L3/L2` | manager, HRBP | `PRF-SCR-002`, `PRF-SCR-003`, `PRF-SCR-004` | `TAL-SCR-002` | `TX-01` | `PK-QUEUE-01`, `COND-CALIBRATION` | required | `Mapped` |
| `11 Performance Management` | Promotions linkage, performance improvement plans | `L2` | manager, HR operations | `PRF-SCR-005` | `PEO-SCR-007`, `MGR-SCR-007` | `TX-01`, `MD-03` | `PK-QUEUE-01`, `COND-FINALIZED` | required | `Mapped` |
| `12 Learning and Development` | Learning management system, course catalog, learning paths, skill development | `L3/L2` | employee, L&D admin | `LRN-SCR-001`, `LRN-SCR-002` | `EMP-SCR-007`, `AIC-SCR-004` | `DB-01`, `MD-02` | `PK-DASH-01` | required | `Mapped` |
| `12 Learning and Development` | Certifications, compliance training, assessments, external content integration | `L3/L2` | employee, L&D admin | `LRN-SCR-003`, `LRN-SCR-004` | `PEO-SCR-003`, `HSW-SCR-003` | `TX-01`, `MD-04` | `PK-QUEUE-01`, `COND-LEARNING-OVERDUE` | required | `Mapped` |
| `13 Talent Management` | Succession planning, career planning, workforce planning linkage | `L3/L2` | leadership, HRBP | `TAL-SCR-001`, `TAL-SCR-003` | `ANL-SCR-001`, `MGR-SCR-007` | `WS-06`, `DB-02` | `PK-DASH-01` | reduced | `Mapped` |
| `13 Talent Management` | Talent reviews, HiPo identification, talent matrix, bench strength | `L3/L2` | leadership, HRBP | `TAL-SCR-002` | `REC-SCR-006`, `ANL-SCR-002` | `TX-01`, `DB-02` | `PK-QUEUE-01`, `COND-CONFIDENTIAL-TALENT` | reduced | `Mapped` |
| `14 Compensation and Benefits` | Compensation planning, salary reviews, merit cycles | `L3` | compensation admin, HRBP | `CMP-SCR-001`, `CMP-SCR-002` | `PAY-SCR-002`, `MGR-SCR-005` | `MD-02`, `TX-01` | `PK-CONSOLE-01`, `COND-COMPARE` | reduced | `Mapped` |
| `14 Compensation and Benefits` | Bonus planning, incentives, ESOPs | `L2` | compensation admin | `CMP-SCR-003` | `PAY-SCR-002`, `ANL-SCR-001` | `MD-02`, `WS-06` | `PK-CONSOLE-01` | reduced | `Mapped` |
| `14 Compensation and Benefits` | Insurance, benefits administration, flexible benefits | `L2/L3` | employee, benefits admin | `CMP-SCR-004`, `EMP-SCR-008` | `PAY-SCR-005` | `DB-01`, `TX-01` | `PK-QUEUE-01`, `COND-ENROLLMENT-WINDOW` | required | `Mapped` |
| `15 Employee Experience` | Surveys, pulse surveys | `L3/L2` | employee, HRBP | `EXR-SCR-001` | `EMP-SCR-001`, `ANL-SCR-001` | `WS-01`, `WS-06` | `PK-DASH-01`, `COND-NO-DATA` | required | `Mapped` |
| `15 Employee Experience` | Recognition, rewards | `L3/L2` | employee, manager | `EXR-SCR-002` | `EMP-SCR-001`, `MGR-SCR-001` | `TX-01`, `WS-01`, `WS-02` | `PK-QUEUE-01` | required | `Mapped` |
| `15 Employee Experience` | Celebration campaigns, milestone cards, join-date and anniversary moments | `L3/L2` | HRBP, communications admin, manager | `EXR-SCR-005` | `EMP-SCR-001`, `EXR-SCR-002`, `COMMS-SCR-003` | `AD-05`, `WS-01` | `PK-BUILDER-01`, `COND-CELEBRATION-DUE`, `COND-FESTIVAL-CAMPAIGN` | required | `Ready` |
| `15 Employee Experience` | Quotes, nudges, recognition and festival personalization through Ridz | `L3/L2` | employee, HR engagement admin | `EXR-SCR-006` | `EMP-SCR-001`, `EXR-SCR-003` | `AD-02`, `WS-01` | `PK-CONSOLE-01`, `COND-QUOTE-PERSONALIZED`, `COND-FESTIVAL-CAMPAIGN` | required | `Ready` |
| `15 Employee Experience` | Social feed, communities, events, employee communications | `L1/L2` | employee | `EXR-SCR-003`, `COMMS-SCR-002` | `GLB-SCR-001` | `WS-01`, `UT-01` | `PK-DASH-01` | required | `Mapped` |
| `15 Employee Experience` | Wellness programs | `L2` | employee, HRBP | `EXR-SCR-004` | `HSW-SCR-003` | `WS-01`, `MD-04` | `PK-DASH-01` | required | `Mapped` |
| `16 Travel Management` | Travel requests, trip planning, itinerary, booking integration | `L3/L2` | employee, travel desk | `TRV-SCR-001`, `TRV-SCR-002`, `TRV-SCR-003` | `ESS-SCR-004`, `MGR-SCR-003` | `MD-03`, `TX-03`, `TX-06` | `PK-WIZARD-01`, `COND-APPROVAL-PENDING` | required | `Mapped` |
| `16 Travel Management` | Travel advances, travel expense settlement | `L2` | employee, finance approver | `TRV-SCR-004` | `XPN-SCR-001`, `XPN-SCR-003` | `TX-01`, `TX-06` | `PK-QUEUE-01` | required | `Mapped` |
| `17 Expense Management` | Expense claims, per diem, receipts, OCR | `L3/L2` | employee | `XPN-SCR-001`, `XPN-SCR-002` | `ESS-SCR-005` | `TX-06`, `MD-03` | `PK-QUEUE-01`, `COND-RETURNED` | required | `Mapped` |
| `17 Expense Management` | Approvals, reimbursements, corporate card reconciliation | `L2/L3` | finance approver, employee | `XPN-SCR-003`, `XPN-SCR-004` | `MGR-SCR-003`, `PAY-SCR-002` | `TX-01`, `MD-02` | `PK-QUEUE-01`, `COND-SLA-BREACH` | required | `Mapped` |
| `18 Asset Management` | Asset catalog, software licenses | `L2` | IT admin | `AST-SCR-002` | `AST-SCR-001` | `AD-02`, `MD-02` | `PK-CONSOLE-01` | reduced | `Mapped` |
| `18 Asset Management` | Asset assignment, asset return | `L3` | IT admin, employee | `AST-SCR-001` | `PEO-SCR-007`, `EMP-SCR-008` | `MD-02`, `TX-01` | `PK-QUEUE-01`, `COND-EXIT-CLEARANCE`, `COND-RETURN-OVERDUE` | required | `Mapped` |
| `18 Asset Management` | Asset maintenance, asset audits | `L2` | IT admin, audit team | `AST-SCR-003` | `W0-SCR-008` | `MD-02`, `AD-04` | `PK-QUEUE-01` | reduced | `Mapped` |
| `19 Helpdesk and Case Management` | HR helpdesk, IT helpdesk, admin helpdesk, finance helpdesk | `L2` | employee, support agent | `HLP-SCR-001` | `GLB-SCR-002`, `EMP-SCR-004` | `MD-02`, `UT-02`, `TX-06` | `PK-QUEUE-01` | required | `Mapped` |
| `19 Helpdesk and Case Management` | SLA management, knowledge base, escalations | `L3/L2` | support lead | `HLP-SCR-002`, `HLP-SCR-003` | `GLB-SCR-002` | `MD-02`, `UT-02`, `TX-01` | `PK-QUEUE-01`, `COND-ESCALATED` | required | `Mapped` |
| `20 Contractor and External Workforce` | Contractor master, vendor employees, agency management, contracts | `L3/L2` | contractor admin | `CTR-SCR-001`, `CTR-SCR-002` | `ORG-SCR-001`, `HRO-SCR-003` | `MD-02`, `MD-04` | `PK-QUEUE-01` | required | `Mapped` |
| `20 Contractor and External Workforce` | Compliance, access control | `L3` | contractor admin, security admin | `CTR-SCR-003` | `IAM-SCR-002`, `W0-SCR-019` | `MD-02`, `AD-03` | `PK-QUEUE-01`, `COND-ACCESS-BLOCKED`, `COND-DOC-EXPIRED` | required | `Mapped` |
| `21 Visitor and Workplace Management` | Visitor registration, gate pass | `L3/L2` | front desk, admin | `VWP-SCR-001`, `VWP-SCR-002` | `IAM-SCR-004` | `MD-03` | `PK-WIZARD-01` | required | `Mapped` |
| `21 Visitor and Workplace Management` | Meeting management, desk booking, room booking, shuttle management, parking, cafeteria | `L2/L1` | employee, admin | `VWP-SCR-002`, `VWP-SCR-003` | `EXR-SCR-003` | `TX-03`, `TX-04` | `PK-QUEUE-01` | required | `Mapped` |
| `22 Health Safety and Wellness` | Incident reporting, safety audits, risk assessments | `L3/L2` | employee, safety officer | `HSW-SCR-001`, `HSW-SCR-002` | `ANL-SCR-001` | `MD-02`, `DB-01` | `PK-QUEUE-01`, `COND-INCIDENT-OPEN` | required | `Mapped` |
| `22 Health Safety and Wellness` | PPE management, occupational health, medical checkups, vaccination | `L2` | safety officer, employee | `HSW-SCR-003` | `PEO-SCR-003`, `EXR-SCR-004` | `MD-04` | `PK-PROFILE-01`, `COND-COMPLIANCE-HOLD` | required | `Mapped` |
| `22 Health Safety and Wellness` | Emergency response | `L3` | safety officer | `HSW-SCR-004` | `W0-SCR-001`, `W0-SCR-024` | `MD-02`, `AD-04` | `PK-QUEUE-01`, `COND-INVESTIGATION` | required | `Mapped` |
| `23 Communication Platform` | Email, SMS, push notifications, WhatsApp | `L2` | communications admin | `COMMS-SCR-001`, `W0-SCR-007` | `GLB-SCR-001` | `AD-02`, `UT-01` | `PK-CONSOLE-01` | required | `Mapped` |
| `23 Communication Platform` | Announcements, news, bulletin board | `L2/L1` | employee, communications admin | `COMMS-SCR-002` | `EMP-SCR-001`, `EXR-SCR-003` | `WS-01`, `UT-01` | `PK-DASH-01` | required | `Mapped` |
| `23 Communication Platform` | Campaigns | `L3` | communications admin | `COMMS-SCR-003` | `W0-SCR-007`, `ANL-SCR-004` | `AD-05` | `PK-BUILDER-01`, `COND-SCHEDULED-REPORT` | required | `Mapped` |
| `24 Document Management` | Document repository, versioning, templates | `L3/L2` | employee, HR admin | `DOC-SCR-001`, `DOC-SCR-002` | `W0-SCR-010`, `PEO-SCR-005` | `MD-02`, `MD-03`, `AD-05` | `PK-PROFILE-01`, `COND-VERSION-COMPARE` | required | `Mapped` |
| `24 Document Management` | Digital signatures, OCR, retention policies | `L3/L2` | HR admin, compliance officer | `DOC-SCR-003`, `DOC-SCR-004` | `W0-SCR-022`, `W0-SCR-010` | `MD-03`, `AD-02` | `PK-WIZARD-01`, `PK-CONSOLE-01`, `COND-EXPIRED-LINK` | required | `Mapped` |
| `25 Analytics and BI` | Operational dashboards, executive dashboards, data export | `L2` | leadership, HRBP | `ANL-SCR-001`, `ANL-SCR-004` | `W0-SCR-001`, `W0-SCR-018` | `WS-06`, `AD-05` | `PK-ANALYTICS-01` | required | `Mapped` |
| `25 Analytics and BI` | Workforce analytics, diversity analytics, recruitment analytics, payroll analytics | `L3/L2` | analytics user, CHRO | `ANL-SCR-002`, `ANL-SCR-004` | `REC-SCR-006`, `PAY-SCR-001` | `DB-02`, `AD-05` | `PK-ANALYTICS-01`, `COND-DRILL-DOWN` | reduced | `Mapped` |
| `25 Analytics and BI` | Attrition analytics, predictive analytics, custom reports | `L3` | leadership, analytics user | `ANL-SCR-003`, `ANL-SCR-005`, `ANL-SCR-004` | `AIC-SCR-005` | `DB-02`, `DB-03`, `AD-05` | `PK-ANALYTICS-01`, `COND-LOW-CONFIDENCE` | reduced | `Mapped` |
| `26 AI and Copilot` | HR copilot, employee copilot, manager copilot, recruiter copilot, payroll copilot | `L3/L2` | HR user, employee, manager | `AIC-SCR-001`, `AIC-SCR-002` | `EMP-SCR-001`, `MGR-SCR-001`, `REC-SCR-001`, `PAY-SCR-001` | `DB-03`, `WS-01`, `WS-02`, `DB-01` | `PK-DASH-01` | required | `Ready` |
| `26 AI and Copilot` | Policy assistant, organization insights, natural language querying | `L3/L2` | employee, leadership | `AIC-SCR-003`, `AIC-SCR-005` | `ANL-SCR-001`, `GLB-SCR-002` | `DB-03`, `DB-02`, `UT-02` | `PK-CONSOLE-01`, `PK-ANALYTICS-01` | required | `Ready` |
| `26 AI and Copilot` | Conversational reporting, narrative analytics, governed reporting answers | `L3/L2` | employee, manager, leadership | `AIC-SCR-006` | `AIC-SCR-001`, `ANL-SCR-004`, `EMP-SCR-001`, `MGR-SCR-001` | `DB-03`, `AD-05` | `PK-ANALYTICS-01`, `COND-CONVERSATIONAL-RESULT`, `COND-LOW-CONFIDENCE` | required | `Ready` |
| `26 AI and Copilot` | Attrition prediction, flight risk prediction, skills graph, AI resume matching, AI interview summaries, AI workforce planning | `L3/L2` | recruiter, CHRO, manager | `AIC-SCR-004`, `AIC-SCR-005` | `REC-SCR-002`, `ANL-SCR-003`, `TAL-SCR-003` | `DB-03`, `DB-02`, `TX-05` | `PK-ANALYTICS-01`, `COND-MODEL-LOW-CONFIDENCE` | reduced | `Ready` |
| `27 Integration Platform` | REST APIs, GraphQL optional layer, webhooks | `L3/L1` | integration admin, backend team | `INT-SCR-001` | `W0-SCR-009`, `W0-SCR-008` | `AD-02`, `AD-04` | `PK-CONSOLE-01` | reduced | `Ready` |
| `27 Integration Platform` | Event streaming, ERP integration, CRM integration, finance systems integration | `L3/L1` | integration admin | `INT-SCR-002`, `INT-SCR-003` | `W0-SCR-009`, `W0-SCR-027` | `AD-04`, `UT-05` | `PK-MONITOR-01` | reduced | `Ready` |
| `27 Integration Platform` | Identity provider integration, payroll banks integration, biometric devices integration | `L3/L2` | org admin, integration admin | `INT-SCR-004` | `ORG-ADM-004`, `WRK-SCR-001`, `PAY-SCR-005` | `AD-02`, `DB-01` | `PK-CONSOLE-01`, `COND-DEGRADED` | required | `Ready` |
| `28 Administration` | Dynamic forms, dynamic fields, dynamic masters | `L3` | system admin | `W0-SCR-013`, `W0-SCR-014`, `W0-SCR-015` | `W0-SCR-005`, `W0-SCR-004` | `AD-05`, `AD-02` | `PK-BUILDER-01`, `PK-CONSOLE-01`, `COND-BREAKING-CHANGE` | required | `Mapped` |
| `28 Administration` | Templates, number series, branding | `L2` | org admin, platform admin | `W0-SCR-010`, `ADM-SCR-004`, `ORG-ADM-003` | `W0-SCR-018` | `AD-05`, `AD-02`, `WS-04` | `PK-CONSOLE-01` | required | `Mapped` |
| `28 Administration` | Localization, system settings, tenant management | `L3` | platform admin, org admin | `W0-SCR-016`, `W0-SCR-017`, `ADM-SCR-007`, `W0-SCR-018` | `ORG-ADM-002` | `AD-02`, `AD-01`, `WS-04`, `WS-05` | `PK-CONSOLE-01`, `COND-HIGH-RISK-CHANGE` | required | `Mapped` |
| `29 Security and Governance` | RBAC, ABAC, access reviews, segregation of duties | `L3` | security admin | `W0-SCR-019`, `W0-SCR-020`, `W0-SCR-023` | `IAM-SCR-002` | `AD-03`, `AD-04` | `PK-CONSOLE-01`, `COND-CONFLICT-WARNING` | reduced | `Mapped` |
| `29 Security and Governance` | Data masking, encryption, consent management, audit logs | `L3/L2` | privacy lead, compliance admin | `W0-SCR-021`, `W0-SCR-008` | `DOC-SCR-004`, `ORG-ADM-008` | `AD-02`, `AD-04` | `PK-CONSOLE-01`, `COND-MASK-PREVIEW` | reduced | `Mapped` |
| `29 Security and Governance` | Data retention, compliance monitoring | `L3/L2` | governance admin | `W0-SCR-022`, `W0-SCR-019` | `STA-SCR-003`, `DOC-SCR-004` | `AD-04`, `AD-02` | `PK-CONSOLE-01`, `COND-LEGAL-BLOCK` | reduced | `Mapped` |
| `30 DevOps and Operations` | Monitoring, health checks, logging, background jobs, feature toggles, release management | `L2` | ops lead | `W0-SCR-009`, `OPS-SCR-001`, `OPS-SCR-002` | `W0-SCR-001` | `AD-04`, `AD-01` | `PK-MONITOR-01`, `COND-DEGRADED` | reduced | `Mapped` |
| `30 DevOps and Operations` | Backup, restore, disaster recovery | `L3` | ops lead, platform architect | `W0-SCR-024`, `W0-SCR-025` | `W0-SCR-030` | `AD-04`, `TX-06` | `PK-MONITOR-01`, `COND-RECOVERY-POINT-SELECT`, `COND-RTO-BREACH` | reduced | `Mapped` |
| `31 Implementation and Migration` | Bulk import, bulk export | `L3/L2` | implementation lead | `W0-SCR-026` | `W0-SCR-027`, `HRO-SCR-001` | `UT-05`, `MD-02` | `PK-WIZARD-01`, `COND-IMPORT-PREVIEW`, `COND-ROW-ERROR` | required | `Mapped` |
| `31 Implementation and Migration` | Data migration, validation | `L3` | implementation lead, QA lead | `W0-SCR-027`, `W0-SCR-028` | `W0-SCR-026` | `UT-05`, `DB-01` | `PK-CONSOLE-01`, `PK-DASH-01`, `COND-MISMATCH` | reduced | `Mapped` |
| `31 Implementation and Migration` | Cutover, rollback, go-live checklist | `L3/L2` | program lead, ops lead | `W0-SCR-029`, `W0-SCR-030` | `W0-SCR-028` | `DB-01`, `TX-06` | `PK-DASH-01`, `PK-WIZARD-01`, `COND-CHECKPOINT-HOLD`, `COND-ROLLBACK-TRIGGERED` | reduced | `Mapped` |
| `32 Testing and Quality` | Test data management, regression testing | `L2` | QA lead | `TST-SCR-001`, `TST-SCR-002` | `W0-SCR-028`, `W0-SCR-026` | `AD-04`, `UT-05` | `PK-CONSOLE-01` | reduced | `Ready` |
| `32 Testing and Quality` | Performance testing, security testing, accessibility testing, UAT support | `L2` | QA lead, security tester, business owner | `TST-SCR-003`, `TST-SCR-004` | `W0-SCR-028`, `W0-SCR-019` | `DB-01`, `AD-03` | `PK-DASH-01`, `COND-BLOCKER-OPEN` | reduced | `Ready` |

# 7. Proposed Screen Ref Expansion For Planned Areas

The following planned screen refs are introduced here so development and design can work from stable identifiers even before every mockup exists.

| Screen Ref | Screen Name |
|---|---|
| `ORG-SCR-001` | Organization Structure Workbench |
| `ORG-SCR-002` | Entity and Company Profile Console |
| `ORG-SCR-003` | Hierarchy Explorer and Reporting Map |
| `ORG-SCR-004` | Calendar, Policy, and Classification Console |
| `IAM-SCR-001` | Identity and User Account Workbench |
| `IAM-SCR-002` | Role and Permission Matrix |
| `IAM-SCR-003` | SSO MFA and Federation Console |
| `IAM-SCR-004` | Delegation Session and Device Control |
| `ESS-SCR-004` | Employee Leave Attendance and Travel Hub |
| `ESS-SCR-005` | Employee Claims Benefits and Assets Hub |
| `ESS-SCR-006` | Employee Goals Learning and Helpdesk Hub |
| `MSS-SCR-001` to `MSS-SCR-005` | Manager dashboard, people, approvals, reviews, and mobility surfaces |
| `WRK-SCR-005` | Overtime and Comp-Off Console |
| `STA-SCR-001` to `STA-SCR-004` | Statutory operations, tax, calendar, and country compliance screens |
| `PRF-SCR-001` to `PRF-SCR-005` | Goals, appraisals, feedback, calibration, and PIP screens |
| `LRN-SCR-001` to `LRN-SCR-004` | Learning, paths, certifications, and assessment screens |
| `TAL-SCR-001` to `TAL-SCR-003` | Succession, talent review, and career or bench screens |
| `CMP-SCR-001` to `CMP-SCR-004` | Compensation planning, reviews, incentives, and benefits screens |
| `EXR-SCR-001` to `EXR-SCR-004` | Surveys, recognition, communities, and wellness screens |
| `TRV-SCR-001` to `TRV-SCR-004` | Travel request, plan, itinerary, and settlement screens |
| `XPN-SCR-001` to `XPN-SCR-004` | Expense, OCR, approval, and card-reconciliation screens |
| `AST-SCR-002` to `AST-SCR-003` | Asset catalog, licenses, maintenance, and audit screens |
| `HLP-SCR-002` to `HLP-SCR-003` | Case detail, SLA, knowledge base, and escalation screens |
| `CTR-SCR-002` to `CTR-SCR-003` | Contractor contract, compliance, and access-control screens |
| `VWP-SCR-001` to `VWP-SCR-003` | Visitor, meeting, gate pass, and workplace booking screens |
| `HSW-SCR-002` to `HSW-SCR-004` | Risk, health, medical, and emergency screens |
| `COMMS-SCR-001` to `COMMS-SCR-003` | Channel console, announcements, and campaigns screens |
| `DOC-SCR-002` to `DOC-SCR-004` | Template, signature, OCR, and retention screens |
| `AIC-SCR-001` to `AIC-SCR-005` | Copilot, policy assistant, skills, prediction, and NLQ screens |
| `PAY-SCR-007`, `MGR-SCR-008`, `EXR-SCR-005`, `EXR-SCR-006`, `AIC-SCR-006` | innovation extension screens for anomaly copilot, manager briefing, celebrations, Ridz personalization, and conversational reporting |
| `INT-SCR-001` to `INT-SCR-004` | API, event, ERP, IdP, bank, and biometric integration screens |
| `ADM-SCR-004`, `ADM-SCR-007` | Number series or template console and tenant-lifecycle console |
| `OPS-SCR-001`, `OPS-SCR-002` | Monitoring console and release or feature-toggle console |
| `TST-SCR-001` to `TST-SCR-004` | Test data, regression, non-functional quality, and UAT screens |

# 8. Completion Rule

This matrix should be considered trustworthy only if future screen work follows this discipline:

1. when a new screen is added, update this matrix
2. when a new sub-module is introduced, add a screen mapping before development starts
3. when a row contains condition variants, those variants must be reflected either in the mockup registry or in a state-pack note
