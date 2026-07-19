---
id: HRMS-UX-021
title: Screen Template Assignment Matrix
document: 21-screen-template-assignment-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This document provides the exhaustive screen-level template assignment for the current Enterprise HRMS mockup library.

It exists to remove ambiguity about which template family each registered screen belongs to.

# 2. Assignment Rule

This matrix assigns templates at the `screen ref` level.

That means:

- one screen ref gets one primary experience assignment
- one screen ref gets one primary pattern assignment
- one screen ref gets one primary final-template assignment
- desktop and mobile mockups for the same screen inherit the same assignment
- condition-specific variants remain attached to the same screen ref unless a future structural split creates a new screen ref

# 3. How To Use

Use this matrix when:

- assigning work to the mockup agent
- assigning work to the final UI design agent
- batching screens into template-based design waves
- planning frontend implementation
- checking that no screen is floating outside the template system

# 4. Reference Documents

This document should be used with:

- [14-screen-mockup-master-registry.md](D:/HRMS-doc/docs/10-ui-ux-architecture/14-screen-mockup-master-registry.md)
- [20-screen-template-architecture-and-conversion-model.md](D:/HRMS-doc/docs/10-ui-ux-architecture/20-screen-template-architecture-and-conversion-model.md)

# 5. Full Assignment Matrix

## 5.1 Wave 0 Provider, Tenant, Security, and Delivery Screens

| Screen Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Notes |
|---|---|---|---|---|---|
| `W0-SCR-001` | SaaS platform admin home dashboard | `EXP-05` | `PAT-02` | `WS-05` | platform control-plane landing dashboard |
| `W0-SCR-002` | Global search and command entry | `EXP-05` | `PAT-20` | `UT-06` | universal search, ask, and typed command surface |
| `W0-SCR-003` | Shared task and approvals inbox | `EXP-05` | `PAT-11` | `TX-01` | cross-domain decision and action queue |
| `W0-SCR-004` | Configuration catalog and scope console | `EXP-05` | `PAT-17` | `AD-02` | scoped configuration and resolution workspace |
| `W0-SCR-005` | Metadata explorer and dependency map | `EXP-05` | `PAT-17` | `AD-02` | metadata inspection and dependency tracing |
| `W0-SCR-006` | Workflow administration console | `EXP-05` | `PAT-17` | `AD-02` | workflow governance and route control workspace |
| `W0-SCR-007` | Notification template and channel console | `EXP-05` | `PAT-17` | `AD-02` | template and channel administration console |
| `W0-SCR-008` | Audit explorer and entity timeline | `EXP-05` | `PAT-19` | `AD-04` | audit, evidence, and investigative timeline surface |
| `W0-SCR-009` | Event bus and integration runtime monitor | `EXP-05` | `PAT-19` | `AD-04` | runtime health and event-monitoring console |
| `W0-SCR-010` | Document template builder and generation monitor | `EXP-05` | `PAT-22` | `AD-05` | builder canvas plus generation monitoring |
| `W0-SCR-011` | AI platform policy and evaluation console | `EXP-05` | `PAT-17` | `AD-02` | AI policy, safety, and evaluation administration |
| `W0-SCR-012` | Localization diagnostics and bundle runtime view | `EXP-05` | `PAT-19` | `AD-04` | diagnostics and bundle-runtime monitoring |
| `W0-SCR-013` | Dynamic form designer | `EXP-05` | `PAT-22` | `AD-05` | form-builder canvas and preview surface |
| `W0-SCR-014` | Dynamic field catalog and field editor | `EXP-05` | `PAT-17` | `AD-02` | field catalog and dynamic schema management |
| `W0-SCR-015` | Dynamic master console | `EXP-05` | `PAT-17` | `AD-02` | master-data administration console |
| `W0-SCR-016` | Localization bundle manager | `EXP-05` | `PAT-17` | `AD-02` | translation and bundle management workspace |
| `W0-SCR-017` | System settings console | `EXP-05` | `PAT-16` | `AD-01` | system-level settings and guarded controls |
| `W0-SCR-018` | Organization admin dashboard | `EXP-04` | `PAT-02` | `WS-04` | tenant-plane operating dashboard |
| `W0-SCR-019` | Access governance dashboard | `EXP-04` | `PAT-18` | `AD-03` | access governance dashboard and action surface |
| `W0-SCR-020` | Role and policy matrix workspace | `EXP-04` | `PAT-18` | `AD-03` | role, policy, and delegation matrix |
| `W0-SCR-021` | Data masking policy console | `EXP-05` | `PAT-17` | `AD-02` | masking and reveal-policy control console |
| `W0-SCR-022` | Retention and legal-hold control center | `EXP-05` | `PAT-19` | `AD-04` | retention, legal hold, and purge monitoring |
| `W0-SCR-023` | Access review campaign workspace | `EXP-04` | `PAT-11` | `AD-03` | governed access-review decision workspace |
| `W0-SCR-024` | Backup and restore operations dashboard | `EXP-05` | `PAT-19` | `AD-04` | backup, restore, and recovery operations surface |
| `W0-SCR-025` | Disaster recovery readiness console | `EXP-05` | `PAT-19` | `AD-04` | DR readiness, testing, and failover posture console |
| `W0-SCR-026` | Bulk import wizard and validation workbench | `EXP-04` | `PAT-21` | `UT-05` | guided import, row validation, and commit flow |
| `W0-SCR-027` | Migration mapping and reconciliation workspace | `EXP-04` | `PAT-21` | `UT-05` | mapping, reconciliation, and migration correction surface |
| `W0-SCR-028` | Validation command center | `EXP-05` | `PAT-02` | `DB-01` | operational validation dashboard before cutover |
| `W0-SCR-029` | Cutover command center | `EXP-05` | `PAT-02` | `DB-01` | mission-control style release and cutover dashboard |
| `W0-SCR-030` | Rollback runbook and trigger workspace | `EXP-05` | `PAT-15` | `TX-06` | guided runbook, progress, and controlled rollback flow |

## 5.2 Shared Global and Wave 1 Core Workforce Screens

| Screen Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Notes |
|---|---|---|---|---|---|
| `GLB-SCR-001` | Notifications center | `EXP-01` | `PAT-20` | `UT-01` | shared notification center across roles |
| `GLB-SCR-002` | Help and support center | `EXP-01` | `PAT-20` | `UT-02` | help, support, and assisted navigation hub |
| `GLB-SCR-003` | Profile and delegation switch | `EXP-01` | `PAT-20` | `UT-07` | user context, profile, and delegation switch |
| `EMP-SCR-001` | Employee home | `EXP-01` | `PAT-01` | `WS-01` | employee landing workspace |
| `EMP-SCR-002` | My profile | `EXP-01` | `PAT-09` | `MD-04` | employee self-profile and tabbed record |
| `EMP-SCR-003` | My documents | `EXP-01` | `PAT-09` | `MD-04` | employee-facing document profile and repository |
| `EMP-SCR-004` | My requests | `EXP-01` | `PAT-15` | `TX-06` | employee request status and workflow tracker |
| `EMP-SCR-005` | My payslips and tax views | `EXP-01` | `PAT-09` | `MD-04` | financial self-service profile surface |
| `EMP-SCR-006` | My leave and attendance | `EXP-01` | `PAT-02` | `DB-01` | self-service operational workbench |
| `EMP-SCR-007` | My goals and learning | `EXP-01` | `PAT-02` | `DB-01` | growth, goal, and learning workbench |
| `EMP-SCR-008` | My benefits and claims | `EXP-01` | `PAT-02` | `DB-01` | benefits, claims, and enrollment operations surface |
| `MGR-SCR-001` | Team dashboard | `EXP-02` | `PAT-01` | `WS-02` | manager landing workspace |
| `MGR-SCR-002` | Team people list | `EXP-02` | `PAT-07` | `MD-02` | team list plus employee detail launch |
| `MGR-SCR-003` | Manager approvals | `EXP-02` | `PAT-11` | `TX-01` | primary manager decision queue |
| `MGR-SCR-004` | Performance review workspace | `EXP-02` | `PAT-11` | `TX-01` | review action, calibration, and completion surface |
| `MGR-SCR-005` | Hiring approval workspace | `EXP-02` | `PAT-11` | `TX-01` | requisition and offer approval queue |
| `MGR-SCR-006` | Team leave and attendance overview | `EXP-02` | `PAT-02` | `DB-01` | team operations and attendance dashboard |
| `MGR-SCR-007` | Mobility proposal workspace | `EXP-02` | `PAT-08` | `MD-03` | guided proposal and approval setup flow |
| `HRO-SCR-001` | Employee master workbench | `EXP-03` | `PAT-07` | `MD-02` | master list plus detailed employee workbench |
| `HRO-SCR-002` | Lifecycle change workbench | `EXP-03` | `PAT-15` | `TX-06` | lifecycle progression and change-tracking workspace |
| `HRO-SCR-003` | Onboarding and preboarding console | `EXP-03` | `PAT-02` | `DB-01` | HR operations dashboard for onboarding execution |
| `HRO-SCR-004` | Document verification queue | `EXP-03` | `PAT-11` | `TX-01` | verification and decision queue |
| `HRO-SCR-005` | Data correction and exception queue | `EXP-03` | `PAT-11` | `TX-01` | data-fix queue with review and closure actions |
| `PEO-SCR-001` | Employee profile summary | `EXP-03` | `PAT-09` | `MD-04` | HR-facing employee profile |
| `PEO-SCR-002` | Employment details workspace | `EXP-03` | `PAT-07` | `MD-02` | effective-dated employment record workspace |
| `PEO-SCR-003` | Identity and compliance panel | `EXP-03` | `PAT-09` | `MD-04` | identity, KYC, and compliance profile surface |
| `PEO-SCR-004` | Bank and tax maintenance screens | `EXP-03` | `PAT-08` | `MD-03` | guided financial-data maintenance flow |
| `PEO-SCR-005` | Documents center | `EXP-03` | `PAT-09` | `MD-04` | HR document-center profile surface |
| `PEO-SCR-006` | Employee timeline | `EXP-03` | `PAT-10` | `MD-05` | event, change, and audit timeline |
| `PEO-SCR-007` | Lifecycle action wizard | `EXP-03` | `PAT-08` | `MD-03` | structured HR lifecycle wizard |

## 5.2A Expansion Screens

| Screen Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Notes |
|---|---|---|---|---|---|
| `ORG-SCR-001` | Organization structure workbench | `EXP-04` | `PAT-07` | `MD-02` | tenant-owned organization structure and node-governance workbench |
| `ORG-SCR-002` | Entity and company profile console | `EXP-04` | `PAT-09` | `MD-04` | tenant/company/legal-entity profile and compliance detail surface |
| `ORG-SCR-003` | Hierarchy explorer and reporting map | `EXP-04` | `PAT-07` | `MD-02` | reporting, rollup, and hierarchy-compare workbench |
| `ORG-SCR-004` | Calendar, policy, and classification console | `EXP-04` | `PAT-17` | `AD-02` | tenant calendar, policy, branding, and classification configuration console |
| `ORG-ADM-001` | Access and roles console | `EXP-04` | `PAT-18` | `AD-03` | tenant-owned role assignment, risk warning, and access-governance console |
| `ORG-ADM-002` | Tenant settings | `EXP-04` | `PAT-16` | `AD-01` | tenant-safe defaults, scoped settings, approval, and rollback workspace |
| `ORG-ADM-003` | Branding and communication setup | `EXP-04` | `PAT-17` | `AD-02` | tenant brand, sender identity, and communication-preview configuration console |
| `ORG-ADM-004` | Identity and SSO readiness view | `EXP-04` | `PAT-17` | `AD-02` | tenant-side federation, provisioning, certificate, and MFA readiness console |
| `ORG-ADM-007` | Tenant audit and admin activity view | `EXP-04` | `PAT-19` | `AD-04` | tenant audit timeline, privileged activity review, and masked evidence surface |
| `ORG-ADM-008` | Export and privacy request review | `EXP-04` | `PAT-19` | `AD-04` | privacy-case review, redaction preview, and governed export-decision surface |
| `IAM-SCR-001` | Identity and user account workbench | `EXP-04` | `PAT-17` | `AD-02` | tenant-owned user account, invite, and authentication posture workbench |
| `IAM-SCR-002` | Role and permission matrix | `EXP-04` | `PAT-18` | `AD-03` | tenant role, permission, delegation, and SoD governance matrix |
| `IAM-SCR-003` | SSO MFA and federation console | `EXP-04` | `PAT-17` | `AD-02` | federation readiness, MFA posture, and provisioning health console |
| `IAM-SCR-004` | Delegation session and device control | `EXP-04` | `PAT-20` | `UT-07` | delegated access, session review, proxy safeguards, and device trust surface |
| `ADM-SCR-004` | Number series and template console | `EXP-04` | `PAT-17` | `AD-02` | scoped number series, template identity, and reservation-governance console |
| `ADM-SCR-007` | Tenant lifecycle console | `EXP-05` | `PAT-16` | `AD-01` | provider-side tenant lifecycle, readiness, and activation console |
| `OPS-SCR-001` | Monitoring console | `EXP-05` | `PAT-19` | `AD-04` | runtime health, queue lag, failed jobs, and operational recovery console |
| `OPS-SCR-002` | Release and feature-toggle console | `EXP-05` | `PAT-16` | `AD-01` | phased release, feature-flag, approval, and rollback governance console |
| `PRF-SCR-001` | Goal, OKR, and check-in workspace | `EXP-02` | `PAT-02` | `DB-01` | shared employee-manager performance planning, progress, and check-in workspace |
| `PRF-SCR-002` | Appraisal and review workspace | `EXP-02` | `PAT-11` | `TX-01` | staged appraisal, calibration, feedback, and finalization queue workspace |
| `PRF-SCR-003` | 360 feedback and calibration workspace | `EXP-02` | `PAT-11` | `TX-01` | reviewer coverage, calibration notes, and protected feedback-decision workspace |
| `PRF-SCR-004` | Bell curve and rating distribution console | `EXP-06` | `PAT-03` | `DB-02` | rating-band comparison, outlier review, and curve-governance analytics console |
| `PRF-SCR-005` | Performance improvement plan workspace | `EXP-03` | `PAT-11` | `TX-01` | PIP timeline, checkpoint review, risk tracking, and outcome-governance workspace |
| `LRN-SCR-001` | Learning management dashboard | `EXP-01` | `PAT-02` | `DB-01` | assigned learning, recommendations, badge progress, and overdue compliance dashboard |
| `LRN-SCR-002` | Learning path and course catalog workspace | `EXP-01` | `PAT-07` | `MD-02` | searchable learning catalog, path sequencing, and course-comparison workspace |
| `LRN-SCR-003` | Certification and compliance training queue | `EXP-03` | `PAT-11` | `TX-01` | expiry-led certification queue with proof review, reminders, and escalations |
| `LRN-SCR-004` | Assessment and external content workspace | `EXP-03` | `PAT-09` | `MD-04` | assessment attempts, vendor-content trust, evidence review, and retake workspace |
| `TAL-SCR-001` | Succession planning dashboard | `EXP-06` | `PAT-04` | `WS-06` | critical-role depth, successor readiness, and succession-risk dashboard |
| `TAL-SCR-002` | Talent review and HiPo matrix workspace | `EXP-06` | `PAT-11` | `TX-01` | 9-box review, confidential talent discussion, and HiPo-action workspace |
| `TAL-SCR-003` | Career planning and bench strength workspace | `EXP-06` | `PAT-03` | `DB-02` | career-path exploration, bench-depth analysis, and internal-mobility planning workspace |
| `CMP-SCR-001` | Compensation planning workspace | `EXP-03` | `PAT-07` | `MD-02` | compensation planning, range visibility, and budget-led recommendation workspace |
| `CMP-SCR-002` | Salary review and merit cycle workspace | `EXP-03` | `PAT-11` | `TX-01` | merit-cycle review queue with retro-effective visibility and finalization controls |
| `CMP-SCR-003` | Bonus, incentive, and ESOP planning workspace | `EXP-06` | `PAT-03` | `DB-02` | variable-pay planning, pool comparison, and grant-scenario workspace |
| `CMP-SCR-004` | Benefits enrollment and flexible benefits workspace | `EXP-01` | `PAT-02` | `DB-01` | plan enrollment, dependent coverage, and flexible-benefit allocation workspace |
| `ESS-SCR-006` | Employee goals, learning, and helpdesk hub | `EXP-01` | `PAT-01` | `WS-01` | self-service hub for growth, reminders, cases, and quick support actions |
| `ESS-SCR-004` | Employee leave, attendance, and travel hub | `EXP-01` | `PAT-01` | `WS-01` | self-service hub for leave balance, attendance action, travel status, and daily operations |
| `ESS-SCR-005` | Employee claims, benefits, and assets hub | `EXP-01` | `PAT-01` | `WS-01` | self-service hub for claims, reimbursements, benefits, and asset visibility |
| `TRV-SCR-001` | Travel request wizard | `EXP-01` | `PAT-08` | `MD-03` | guided travel-request creation with policy checks, cost estimate, and approval routing |
| `TRV-SCR-002` | Trip planning workspace | `EXP-01` | `PAT-13` | `TX-03` | trip-task planning, booking coordination, and readiness workspace |
| `TRV-SCR-003` | Itinerary and booking coordination screen | `EXP-01` | `PAT-13` | `TX-03` | itinerary leg, document, disruption, and booking-status coordination screen |
| `TRV-SCR-004` | Travel advance and settlement workspace | `EXP-01` | `PAT-15` | `TX-06` | travel advance, proof collection, finance review, and settlement status workspace |
| `XPN-SCR-001` | Expense claim and receipt workspace | `EXP-01` | `PAT-15` | `TX-06` | employee expense-claim and receipt-driven submission workspace |
| `XPN-SCR-002` | Per diem and OCR review workspace | `EXP-01` | `PAT-08` | `MD-03` | OCR extraction, per-diem rule review, and mismatch-correction workspace |
| `XPN-SCR-003` | Expense approval and reimbursement queue | `EXP-03` | `PAT-11` | `TX-01` | approver queue with reimbursement visibility, SLA cues, and held-claim resolution |
| `XPN-SCR-004` | Corporate card reconciliation workspace | `EXP-03` | `PAT-07` | `MD-02` | card transaction matching, evidence review, and reconciliation exception workspace |
| `EXR-SCR-001` | Surveys and pulse feedback workspace | `EXP-01` | `PAT-02` | `DB-01` | pulse participation, survey trends, and follow-through workspace |
| `EXR-SCR-002` | Recognition and rewards workspace | `EXP-01` | `PAT-11` | `TX-01` | recognition activity, nomination, and reward redemption workspace |
| `EXR-SCR-003` | Social feed, communities, and events hub | `EXP-01` | `PAT-01` | `WS-01` | employee engagement hub for feed, communities, events, and announcements |
| `EXR-SCR-004` | Wellness programs workspace | `EXP-01` | `PAT-09` | `MD-04` | wellness program, challenge participation, and benefit-linked health workspace |
| `AST-SCR-002` | Asset catalog and software license console | `EXP-07` | `PAT-17` | `AD-02` | IT asset and license inventory console with stock and pool visibility |
| `AST-SCR-003` | Asset maintenance and audit workspace | `EXP-07` | `PAT-11` | `TX-01` | maintenance task, audit finding, and corrective-action workspace |
| `MSS-SCR-001` | Manager workspace home | `EXP-02` | `PAT-01` | `WS-02` | role-led manager landing workspace for approvals, team health, and coaching priorities |
| `MSS-SCR-002` | Manager people and actions workspace | `EXP-02` | `PAT-07` | `MD-02` | people-facing manager workspace with role-safe employee context and pending actions |
| `MSS-SCR-003` | Manager approvals and routing workspace | `EXP-02` | `PAT-11` | `TX-01` | manager approval queue with route visibility, returned items, and escalation context |
| `MSS-SCR-004` | Manager reviews and team performance hub | `EXP-02` | `PAT-02` | `DB-01` | manager hub for review timing, team performance signals, and coaching follow-through |
| `MSS-SCR-005` | Manager mobility and hiring actions workspace | `EXP-02` | `PAT-15` | `TX-06` | guided manager workspace for hiring, mobility, and people-change actions |
| `HLP-SCR-002` | Case detail and SLA workspace | `EXP-07` | `PAT-07` | `MD-02` | service-case detail surface with SLA posture, ownership, and resolution history |
| `HLP-SCR-003` | Knowledge base and escalation console | `EXP-07` | `PAT-20` | `UT-02` | support knowledge and escalation console for reuse, triage, and guided handoff |
| `CTR-SCR-002` | Contractor contract and compliance workspace | `EXP-07` | `PAT-09` | `MD-04` | contractor contract, expiry, and compliance-detail workspace |
| `CTR-SCR-003` | Contractor access control and risk workspace | `EXP-07` | `PAT-18` | `AD-03` | contractor access-governance and risk-remediation workspace |
| `VWP-SCR-001` | Visitor registration and gate pass workspace | `EXP-07` | `PAT-08` | `MD-03` | guided visitor-registration and gate-pass issuance flow |
| `VWP-SCR-002` | Meeting and room booking workspace | `EXP-07` | `PAT-13` | `TX-03` | room-booking and schedule-coordination workspace |
| `VWP-SCR-003` | Desk, shuttle, parking, and workplace services hub | `EXP-07` | `PAT-13` | `TX-04` | workplace-operations hub for desk, shuttle, parking, and shared-service bookings |
| `HSW-SCR-002` | Safety audit and risk assessment workspace | `EXP-07` | `PAT-07` | `MD-02` | safety audit execution workspace with risk scoring and corrective-action ownership |
| `HSW-SCR-003` | Occupational health and medical compliance workspace | `EXP-07` | `PAT-09` | `MD-04` | medical-compliance workspace for checks, vaccinations, holds, and role-safe follow-up |
| `HSW-SCR-004` | Emergency response command workspace | `EXP-07` | `PAT-19` | `AD-04` | emergency command and readiness monitor for incidents, checkpoints, and critical contacts |
| `COMMS-SCR-001` | Channel console and delivery workspace | `EXP-07` | `PAT-17` | `AD-02` | channel-health and delivery-reliability administration console |
| `COMMS-SCR-002` | Announcements and bulletin hub | `EXP-01` | `PAT-20` | `UT-01` | employee-facing bulletin and announcement hub with audience and pin-state context |
| `COMMS-SCR-003` | Campaign composer and audience scheduler | `EXP-07` | `PAT-22` | `AD-05` | campaign-composition builder with audience logic, preview, and scheduled send control |
| `DOC-SCR-003` | Digital signature and document action workspace | `EXP-03` | `PAT-08` | `MD-03` | document action workspace for signature routing, expiry management, and resend or revoke flows |
| `DOC-SCR-004` | OCR and retention policy console | `EXP-03` | `PAT-17` | `AD-02` | OCR exception and retention-governance console with hold and expiry oversight |
| `WRK-SCR-005` | Overtime and comp-off console | `EXP-07` | `PAT-11` | `TX-01` | overtime approval, comp-off credit, and risk-led workforce control workspace |
| `STA-SCR-001` | Statutory compliance operations workbench | `EXP-03` | `PAT-07` | `MD-02` | recurring statutory-filing workbench with head-level status, evidence, and blockers |
| `STA-SCR-002` | TDS and tax filing workspace | `EXP-03` | `PAT-07` | `MD-02` | tax-return preparation, mismatch correction, and resubmission workspace |
| `STA-SCR-003` | Compliance calendar and filing tracker | `EXP-03` | `PAT-13` | `TX-04` | time-led statutory tracker for due filings, owners, reminders, and overdue items |
| `STA-SCR-004` | Country compliance and regulatory dashboard | `EXP-06` | `PAT-04` | `WS-06` | cross-country readiness and regulatory-impact dashboard for leadership and compliance |
| `AIC-SCR-001` | Copilot command workspace | `EXP-01` | `PAT-05` | `DB-03` | typed-command AI workspace for answers, drafts, and governed actions |
| `AIC-SCR-002` | Role-based copilot workspace | `EXP-02` | `PAT-01` | `WS-02` | role-aware AI workspace for manager, recruiter, payroll, and HR productivity flows |
| `AIC-SCR-003` | Policy assistant and natural language query console | `EXP-01` | `PAT-20` | `UT-02` | cited policy-answer and NLQ console with escalation and confidence review |
| `AIC-SCR-004` | Skills graph and talent intelligence workspace | `EXP-06` | `PAT-14` | `TX-05` | skills-intelligence workspace for matching, gaps, learning linkage, and talent movement |
| `AIC-SCR-005` | Predictive workforce insights and explainability dashboard | `EXP-06` | `PAT-05` | `DB-03` | predictive and explainable AI dashboard for workforce risk, actions, and governance |
| `INT-SCR-001` | API and webhook console | `EXP-05` | `PAT-17` | `AD-02` | interface-management console for endpoints, subscribers, schemas, and token posture |
| `INT-SCR-002` | Event streaming and delivery monitor | `EXP-05` | `PAT-19` | `AD-04` | topic-health monitor for lag, dead-letter recovery, replay, and consumer operations |
| `INT-SCR-003` | ERP, CRM, and finance connector workspace | `EXP-05` | `PAT-21` | `UT-05` | connector mapping and sync workspace for enterprise-system integrations |
| `INT-SCR-004` | Identity, bank, and biometric integration console | `EXP-05` | `PAT-17` | `AD-02` | critical dependency console for SSO, banks, and device integrations |
| `TST-SCR-001` | Test data management console | `EXP-05` | `PAT-17` | `AD-04` | test-data setup console for dataset packs, masking, refresh, and governed requests |
| `TST-SCR-002` | Regression and release validation workspace | `EXP-05` | `PAT-21` | `UT-05` | regression and release-validation workspace for builds, suites, reruns, and waivers |
| `TST-SCR-003` | Non-functional quality dashboard | `EXP-05` | `PAT-02` | `DB-01` | cross-quality dashboard for performance, security, accessibility, and risk trends |
| `TST-SCR-004` | UAT command center and sign-off workspace | `EXP-05` | `PAT-18` | `AD-03` | governed UAT sign-off workspace for business ownership, blockers, waivers, and readiness |

## 5.3 Wave 2, Wave 3, and Wave 4 Operational Screens

| Screen Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Notes |
|---|---|---|---|---|---|
| `REC-SCR-001` | Requisition workbench | `EXP-03` | `PAT-07` | `MD-02` | requisition list plus detail workbench |
| `REC-SCR-002` | Candidate pipeline board | `EXP-03` | `PAT-14` | `TX-05` | stage-based hiring board |
| `REC-SCR-003` | Candidate profile | `EXP-03` | `PAT-09` | `MD-04` | candidate record and review profile |
| `REC-SCR-004` | Interview scheduler | `EXP-03` | `PAT-13` | `TX-03` | interview planning and slot coordination |
| `REC-SCR-005` | Offer workspace | `EXP-03` | `PAT-11` | `TX-01` | offer decision, approval, and release workspace |
| `REC-SCR-006` | Talent review workspace | `EXP-03` | `PAT-11` | `TX-01` | structured review and confidential decision surface |
| `PAY-SCR-001` | Payroll control center | `EXP-03` | `PAT-02` | `DB-01` | payroll operations landing dashboard |
| `PAY-SCR-002` | Payroll run details | `EXP-03` | `PAT-07` | `MD-02` | payroll-run detail workbench |
| `PAY-SCR-003` | Validation queue | `EXP-03` | `PAT-11` | `TX-01` | payroll validation and issue-clearing queue |
| `PAY-SCR-004` | Statutory workbench | `EXP-03` | `PAT-07` | `MD-02` | compliance detail workbench |
| `PAY-SCR-005` | Compliance calendar | `EXP-03` | `PAT-13` | `TX-04` | statutory and filing calendar surface |
| `PAY-SCR-006` | Retro and settlement workspace | `EXP-03` | `PAT-11` | `TX-01` | settlement, retro, and exception approval workspace |
| `WRK-SCR-001` | Attendance workbench | `EXP-07` | `PAT-07` | `MD-02` | attendance detail workbench and exception resolution |
| `WRK-SCR-002` | Shift management screen | `EXP-07` | `PAT-13` | `TX-03` | shift configuration and scheduling surface |
| `WRK-SCR-003` | Rostering screen | `EXP-07` | `PAT-13` | `TX-03` | roster planning and publish surface |
| `WRK-SCR-004` | Timesheet workbench | `EXP-07` | `PAT-07` | `MD-02` | timesheet detail and correction workbench |
| `LEV-SCR-001` | Leave policy workspace | `EXP-03` | `PAT-17` | `AD-02` | leave-rule and accrual configuration console |
| `LEV-SCR-002` | Leave approval queue | `EXP-02` | `PAT-11` | `TX-01` | leave decision queue |
| `LEV-SCR-003` | Team leave planning view | `EXP-02` | `PAT-13` | `TX-04` | leave planning and capacity calendar |
| `DOC-SCR-001` | Document repository and profile view | `EXP-03` | `PAT-07` | `MD-02` | repository list plus document profile detail |
| `DOC-SCR-002` | Document signing and acknowledgment flow | `EXP-01` | `PAT-08` | `MD-03` | guided signing and acknowledgment flow |
| `AST-SCR-001` | Asset assignment and return view | `EXP-07` | `PAT-07` | `MD-02` | asset detail, assignment, and return workbench |
| `HLP-SCR-001` | Helpdesk and case management workbench | `EXP-07` | `PAT-07` | `MD-02` | case list plus service-detail workbench |
| `CTR-SCR-001` | Contractor workforce workbench | `EXP-07` | `PAT-07` | `MD-02` | contractor roster and compliance workbench |
| `HSW-SCR-001` | Health, safety, and incident workspace | `EXP-07` | `PAT-07` | `MD-02` | incident case and safety action workbench |

## 5.4 Wave 5 Leadership, Analytics, and Intelligence Screens

| Screen Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Notes |
|---|---|---|---|---|---|
| `ANL-SCR-001` | Executive dashboard | `EXP-06` | `PAT-04` | `WS-06` | executive landing and strategic KPI surface |
| `ANL-SCR-002` | Workforce analytics | `EXP-06` | `PAT-03` | `DB-02` | workforce exploration and drill-down analytics |
| `ANL-SCR-003` | Attrition analytics | `EXP-06` | `PAT-03` | `DB-02` | predictive attrition and segment analytics |
| `ANL-SCR-004` | Custom reporting | `EXP-06` | `PAT-22` | `AD-05` | report builder, column logic, and schedule setup |
| `ANL-SCR-005` | Predictive insight views | `EXP-06` | `PAT-05` | `DB-03` | AI insight and recommendation dashboard |

# 6. Coverage Statement

This matrix covers the current registered library of:

- `179` screen refs
- approximately `358` default desktop and mobile mockup assets

If a new screen ref is added to the mockup registry, it must also be added here before it is considered template-classified.
