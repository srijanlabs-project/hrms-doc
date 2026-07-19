---
id: HRMS-UX-014
title: Screen Mockup Master Registry
document: 14-screen-mockup-master-registry.md
version: 1.4
status: Draft
---

# 1. Purpose

This document is the master production registry for mockups across the Enterprise HRMS application.

It exists to answer five questions for every screen:

- does this screen need a desktop mockup
- does this screen need a mobile mockup
- which state or condition variants require separate mockups
- which experience and screen pattern does the screen belong to
- which final design template should be used for conversion
- what is the current production status of the mockup pack

# 2. Status Legend

- `Ready` means default desktop and mobile mockups exist in the repository
- `In Progress` means structural definitions exist and the screen is in active mockup production
- `Planned` means the screen is registered and variant scope is defined, but the artboards are not yet produced
- `Desktop Only` means the screen is primarily desktop-oriented, while mobile receives behavior notes or reduced drill-down views only

# 3. Variant Pack Legend

This registry references the standard variant packs from:

- [15-screen-variant-and-conditional-state-catalog.md](D:/HRMS-doc/docs/10-ui-ux-architecture/15-screen-variant-and-conditional-state-catalog.md)
- [20-screen-template-architecture-and-conversion-model.md](D:/HRMS-doc/docs/10-ui-ux-architecture/20-screen-template-architecture-and-conversion-model.md)
- [21-screen-template-assignment-matrix.md](D:/HRMS-doc/docs/10-ui-ux-architecture/21-screen-template-assignment-matrix.md)

Primary packs:

- `PK-DASH-01` dashboard and home screens
- `PK-QUEUE-01` queue, inbox, and approval workbenches
- `PK-CONSOLE-01` dense admin console and settings workspaces
- `PK-BUILDER-01` builder and designer canvases
- `PK-PROFILE-01` record and profile screens
- `PK-WIZARD-01` multi-step creation and migration flows
- `PK-ANALYTICS-01` analytics and reporting exploration screens
- `PK-MONITOR-01` runtime monitors and operational diagnostics

# 4. Current Coverage Snapshot

Current mockup-library coverage:

- `184` registered screens now have default desktop and mobile mockups
- `368` concrete SVG assets now exist in the repository
- the full primary mockup library is now complete across the original `90`-screen baseline and all planned expansion waves, including workforce overtime, statutory compliance, AI-copilot, integration-platform, and testing-quality families, while future conditional-state variant packs remain an optional refinement layer

# 5. Wave 0 Provider, Tenant, Security, and Delivery Screens

| Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `W0-SCR-001` | SaaS platform admin home dashboard | `EXP-05` | `PAT-02` | `WS-05` | dashboard | required | required | `PK-DASH-01` | `COND-DEGRADED`, `COND-HIGH-RISK`, `COND-SUPPORT-CONTEXT` | `Ready` |
| `W0-SCR-002` | Global search and command entry | `EXP-05` | `PAT-20` | `UT-06` | global utility | required | required | `PK-QUEUE-01` | `COND-SEARCH-SUGGEST`, `COND-NO-RESULT`, `COND-RESTRICTED-RESULT` | `Ready` |
| `W0-SCR-003` | Shared task and approvals inbox | `EXP-05` | `PAT-11` | `TX-01` | queue | required | required | `PK-QUEUE-01` | `COND-BULK-ACTION`, `COND-OVERDUE`, `COND-DETAIL-LOCKED` | `Ready` |
| `W0-SCR-004` | Configuration catalog and scope console | `EXP-05` | `PAT-17` | `AD-02` | admin console | required | required | `PK-CONSOLE-01` | `COND-COMPARE`, `COND-READ-ONLY-PROVIDER`, `COND-APPROVAL-PENDING` | `Ready` |
| `W0-SCR-005` | Metadata explorer and dependency map | `EXP-05` | `PAT-17` | `AD-02` | admin explorer | required | reduced mobile | `PK-CONSOLE-01` | `COND-VERSION-COMPARE`, `COND-RESTRICTED-FIELD`, `COND-DEPENDENCY-MISSING` | `Ready` |
| `W0-SCR-006` | Workflow administration console | `EXP-05` | `PAT-17` | `AD-02` | admin workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-DRAFT-PUBLISHED`, `COND-STUCK-ITEM`, `COND-ROUTE-PREVIEW` | `Ready` |
| `W0-SCR-007` | Notification template and channel console | `EXP-05` | `PAT-17` | `AD-02` | admin console | required | required | `PK-CONSOLE-01` | `COND-CHANNEL-PREVIEW`, `COND-DRAFT-PUBLISHED`, `COND-DELIVERY-FAILURE` | `Ready` |
| `W0-SCR-008` | Audit explorer and entity timeline | `EXP-05` | `PAT-19` | `AD-04` | investigative workbench | required | reduced mobile | `PK-QUEUE-01` | `COND-MASKED`, `COND-REVEALED`, `COND-EXPORT-REQUEST` | `Ready` |
| `W0-SCR-009` | Event bus and integration runtime monitor | `EXP-05` | `PAT-19` | `AD-04` | monitor | required | required | `PK-MONITOR-01` | `COND-REPLAY`, `COND-DEAD-LETTER`, `COND-LAG-SPIKE` | `Ready` |
| `W0-SCR-010` | Document template builder and generation monitor | `EXP-05` | `PAT-22` | `AD-05` | builder plus monitor | required | reduced mobile | `PK-BUILDER-01` | `COND-TEMPLATE-ERROR`, `COND-MERGE-PREVIEW`, `COND-GENERATION-FAILURE` | `Ready` |
| `W0-SCR-011` | AI platform policy and evaluation console | `EXP-05` | `PAT-17` | `AD-02` | admin console | required | reduced mobile | `PK-CONSOLE-01` | `COND-VIOLATION-ALERT`, `COND-COST-SPIKE`, `COND-POLICY-COMPARE` | `Ready` |
| `W0-SCR-012` | Localization diagnostics and bundle runtime view | `EXP-05` | `PAT-19` | `AD-04` | diagnostics console | required | reduced mobile | `PK-MONITOR-01` | `COND-MISSING-BUNDLE`, `COND-FALLBACK-IN-USE`, `COND-PUBLISH-PENDING` | `Ready` |
| `W0-SCR-013` | Dynamic form designer | `EXP-05` | `PAT-22` | `AD-05` | builder | required | reduced mobile | `PK-BUILDER-01` | `COND-DRAFT-PUBLISHED`, `COND-FIELD-CONFLICT`, `COND-PREVIEW-MODE` | `Ready` |
| `W0-SCR-014` | Dynamic field catalog and field editor | `EXP-05` | `PAT-17` | `AD-02` | admin console | required | required | `PK-CONSOLE-01` | `COND-BREAKING-CHANGE`, `COND-IN-USE`, `COND-VALIDATION-ERROR` | `Ready` |
| `W0-SCR-015` | Dynamic master console | `EXP-05` | `PAT-17` | `AD-02` | admin console | required | required | `PK-CONSOLE-01` | `COND-TREE-VIEW`, `COND-IMPORT-PREVIEW`, `COND-USAGE-BLOCKER` | `Ready` |
| `W0-SCR-016` | Localization bundle manager | `EXP-05` | `PAT-17` | `AD-02` | admin console | required | reduced mobile | `PK-CONSOLE-01` | `COND-MISSING-TRANSLATION`, `COND-DRAFT-PUBLISHED`, `COND-COMPLETE-READY` | `Ready` |
| `W0-SCR-017` | System settings console | `EXP-05` | `PAT-16` | `AD-01` | settings console | required | required | `PK-CONSOLE-01` | `COND-HIGH-RISK-CHANGE`, `COND-ROLLBACK`, `COND-APPROVAL-PENDING` | `Ready` |
| `W0-SCR-018` | Organization admin dashboard | `EXP-04` | `PAT-02` | `WS-04` | tenant dashboard | required | required | `PK-DASH-01` | `COND-FIRST-TIME-SETUP`, `COND-QUOTA-WARNING`, `COND-SUSPENDED-TENANT` | `Ready` |
| `W0-SCR-019` | Access governance dashboard | `EXP-04` | `PAT-18` | `AD-03` | dashboard | required | required | `PK-DASH-01` | `COND-CAMPAIGN-RISK`, `COND-SOD-BREACH`, `COND-PRIVILEGED-ALERT` | `Ready` |
| `W0-SCR-020` | Role and policy matrix workspace | `EXP-04` | `PAT-18` | `AD-03` | policy workspace | required | reduced mobile | `PK-CONSOLE-01` | `COND-COMPARE`, `COND-CONFLICT-WARNING`, `COND-DRAFT-PUBLISHED` | `Ready` |
| `W0-SCR-021` | Data masking policy console | `EXP-05` | `PAT-17` | `AD-02` | admin console | required | reduced mobile | `PK-CONSOLE-01` | `COND-MASK-PREVIEW`, `COND-REVEAL-POLICY`, `COND-EXPORT-POLICY` | `Ready` |
| `W0-SCR-022` | Retention and legal-hold control center | `EXP-05` | `PAT-19` | `AD-04` | operations console | required | reduced mobile | `PK-CONSOLE-01` | `COND-HOLD-ACTIVE`, `COND-PURGE-READY`, `COND-LEGAL-BLOCK` | `Ready` |
| `W0-SCR-023` | Access review campaign workspace | `EXP-04` | `PAT-11` | `AD-03` | review workbench | required | required | `PK-QUEUE-01` | `COND-BULK-LOW-RISK`, `COND-REMEDIATION`, `COND-CERTIFICATION-CLOSED` | `Ready` |
| `W0-SCR-024` | Backup and restore operations dashboard | `EXP-05` | `PAT-19` | `AD-04` | operations dashboard | required | reduced mobile | `PK-MONITOR-01` | `COND-RESTORE-REQUEST`, `COND-BACKUP-FAILED`, `COND-RECOVERY-POINT-SELECT` | `Ready` |
| `W0-SCR-025` | Disaster recovery readiness console | `EXP-05` | `PAT-19` | `AD-04` | readiness dashboard | required | reduced mobile | `PK-DASH-01` | `COND-DR-TEST-FAILED`, `COND-RTO-BREACH`, `COND-EXECUTIVE-SUMMARY` | `Ready` |
| `W0-SCR-026` | Bulk import wizard and validation workbench | `EXP-04` | `PAT-21` | `UT-05` | wizard plus workbench | required | required | `PK-WIZARD-01` | `COND-IMPORT-PREVIEW`, `COND-ROW-ERROR`, `COND-COMMIT-CONFIRM` | `Ready` |
| `W0-SCR-027` | Migration mapping and reconciliation workspace | `EXP-04` | `PAT-21` | `UT-05` | workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-MISMATCH`, `COND-TRIAL-LOAD`, `COND-SIGNOFF-PENDING` | `Ready` |
| `W0-SCR-028` | Validation command center | `EXP-05` | `PAT-02` | `DB-01` | readiness console | required | required | `PK-DASH-01` | `COND-BLOCKER-OPEN`, `COND-EVIDENCE-MISSING`, `COND-SIGNOFF-COMPLETE` | `Ready` |
| `W0-SCR-029` | Cutover command center | `EXP-05` | `PAT-02` | `DB-01` | mission control dashboard | required | reduced mobile | `PK-DASH-01` | `COND-FREEZE-ACTIVE`, `COND-CHECKPOINT-HOLD`, `COND-ROLLBACK-TRIGGERED` | `Ready` |
| `W0-SCR-030` | Rollback runbook and trigger workspace | `EXP-05` | `PAT-15` | `TX-06` | runbook workspace | required | reduced mobile | `PK-WIZARD-01` | `COND-IRREVERSIBLE-STEP`, `COND-EXEC-APPROVAL`, `COND-ROLLBACK-COMPLETE` | `Ready` |

# 6. Shared Global and Wave 1 Core Workforce Screens

| Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `GLB-SCR-001` | Notifications center | `EXP-01` | `PAT-20` | `UT-01` | global tray plus list | required | required | `PK-QUEUE-01` | `COND-UNREAD-ONLY`, `COND-ACTIONABLE`, `COND-ARCHIVED` | `Ready` |
| `GLB-SCR-002` | Help and support center | `EXP-01` | `PAT-20` | `UT-02` | support hub | required | required | `PK-DASH-01` | `COND-SEARCH-NO-RESULT`, `COND-LIVE-SUPPORT`, `COND-CASE-CREATED` | `Ready` |
| `GLB-SCR-003` | Profile and delegation switch | `EXP-01` | `PAT-20` | `UT-07` | profile plus settings | required | required | `PK-PROFILE-01` | `COND-DELEGATION-ACTIVE`, `COND-MFA-REQUIRED`, `COND-SESSION-REVIEW` | `Ready` |
| `EMP-SCR-001` | Employee home | `EXP-01` | `PAT-01` | `WS-01` | dashboard | required | required | `PK-DASH-01` | `COND-ACTION-DUE`, `COND-PAYDAY`, `COND-ANNOUNCEMENT-HEAVY` | `Ready` |
| `EMP-SCR-002` | My profile | `EXP-01` | `PAT-09` | `MD-04` | profile | required | required | `PK-PROFILE-01` | `COND-INCOMPLETE-PROFILE`, `COND-READ-ONLY-FIELD`, `COND-EDIT-SAVED` | `Ready` |
| `EMP-SCR-003` | My documents | `EXP-01` | `PAT-09` | `MD-04` | document center | required | required | `PK-PROFILE-01` | `COND-UPLOAD-PENDING`, `COND-VERIFICATION-FAILED`, `COND-EXPIRED` | `Ready` |
| `EMP-SCR-004` | My requests | `EXP-01` | `PAT-15` | `TX-06` | request list | required | required | `PK-QUEUE-01` | `COND-DRAFT`, `COND-RETURNED`, `COND-CLOSED` | `Ready` |
| `EMP-SCR-005` | My payslips and tax views | `EXP-01` | `PAT-09` | `MD-04` | financial self-service | required | required | `PK-PROFILE-01` | `COND-PAYSLIP-NOT-PUBLISHED`, `COND-TAX-DECLARATION-WINDOW`, `COND-YEAR-END` | `Ready` |
| `EMP-SCR-006` | My leave and attendance | `EXP-01` | `PAT-02` | `DB-01` | self-service workbench | required | required | `PK-QUEUE-01` | `COND-BALANCE-LOW`, `COND-MISSING-PUNCH`, `COND-HOLIDAY-OVERLAY` | `Ready` |
| `EMP-SCR-007` | My goals and learning | `EXP-01` | `PAT-02` | `DB-01` | dashboard plus list | required | required | `PK-DASH-01` | `COND-REVIEW-DUE`, `COND-LEARNING-OVERDUE`, `COND-NO-GOALS` | `Ready` |
| `EMP-SCR-008` | My benefits and claims | `EXP-01` | `PAT-02` | `DB-01` | benefits self-service | required | required | `PK-QUEUE-01` | `COND-ENROLLMENT-WINDOW`, `COND-CLAIM-RETURNED`, `COND-POLICY-LOCKED` | `Ready` |
| `MGR-SCR-001` | Team dashboard | `EXP-02` | `PAT-01` | `WS-02` | dashboard | required | required | `PK-DASH-01` | `COND-ABSENCE-SPIKE`, `COND-APPROVAL-HEAVY`, `COND-PERFORMANCE-CYCLE` | `Ready` |
| `MGR-SCR-002` | Team people list | `EXP-02` | `PAT-07` | `MD-02` | list plus profile launch | required | required | `PK-QUEUE-01` | `COND-FILTERED-TEAM`, `COND-DELEGATED-TEAM`, `COND-RESTRICTED-DATA` | `Ready` |
| `MGR-SCR-003` | Manager approvals | `EXP-02` | `PAT-11` | `TX-01` | queue | required | required | `PK-QUEUE-01` | `COND-BULK-APPROVE`, `COND-RETURN-FOR-CORRECTION`, `COND-SLA-BREACH` | `Ready` |
| `MGR-SCR-004` | Performance review workspace | `EXP-02` | `PAT-11` | `TX-01` | review workspace | required | required | `PK-QUEUE-01` | `COND-SELF-REVIEW-PENDING`, `COND-CALIBRATION`, `COND-FINALIZED` | `Ready` |
| `MGR-SCR-005` | Hiring approval workspace | `EXP-02` | `PAT-11` | `TX-01` | review workspace | required | required | `PK-QUEUE-01` | `COND-BUDGET-BLOCK`, `COND-MULTI-APPROVER`, `COND-OFFER-EXPIRY` | `Ready` |
| `MGR-SCR-008` | Manager daily briefing workspace | `EXP-02` | `PAT-01` | `WS-02` | manager briefing workspace | required | required | `PK-DASH-01` | `COND-AI-BRIEFING`, `COND-CELEBRATION-DUE`, `COND-ABSENCE-SPIKE` | `Ready` |
| `MGR-SCR-006` | Team leave and attendance overview | `EXP-02` | `PAT-02` | `DB-01` | operational dashboard | required | required | `PK-DASH-01` | `COND-UNDER-STAFFED`, `COND-LATE-MARK-TREND`, `COND-HOLIDAY-CONFLICT` | `Ready` |
| `MGR-SCR-007` | Mobility proposal workspace | `EXP-02` | `PAT-08` | `MD-03` | workflow workspace | required | reduced mobile | `PK-WIZARD-01` | `COND-BUDGET-IMPACT`, `COND-POSITION-NOT-AVAILABLE`, `COND-APPROVAL-ROUTE` | `Ready` |
| `HRO-SCR-001` | Employee master workbench | `EXP-03` | `PAT-07` | `MD-02` | operational workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-DUPLICATE-MATCH`, `COND-BULK-EDIT`, `COND-SENSITIVE-FIELD-MASKED` | `Ready` |
| `HRO-SCR-002` | Lifecycle change workbench | `EXP-03` | `PAT-15` | `TX-06` | workbench | required | reduced mobile | `PK-QUEUE-01` | `COND-EFFECTIVE-DATED`, `COND-APPROVAL-PENDING`, `COND-BLOCKED-DEPENDENCY` | `Ready` |
| `HRO-SCR-003` | Onboarding and preboarding console | `EXP-03` | `PAT-02` | `DB-01` | operations console | required | required | `PK-DASH-01` | `COND-DOCS-MISSING`, `COND-JOINING-DELAYED`, `COND-TASK-COMPLETE` | `Ready` |
| `HRO-SCR-004` | Document verification queue | `EXP-03` | `PAT-11` | `TX-01` | review queue | required | required | `PK-QUEUE-01` | `COND-REJECTED-DOC`, `COND-EXPIRED-DOC`, `COND-REUPLOAD-REQUESTED` | `Ready` |
| `HRO-SCR-005` | Data correction and exception queue | `EXP-03` | `PAT-11` | `TX-01` | exception queue | required | reduced mobile | `PK-QUEUE-01` | `COND-HIGH-RISK-FIELD`, `COND-CONFLICTING-VALUES`, `COND-CLOSED-WITH-AUDIT` | `Ready` |
| `PEO-SCR-001` | Employee profile summary | `EXP-03` | `PAT-09` | `MD-04` | profile | required | required | `PK-PROFILE-01` | `COND-SENSITIVE-VIEW`, `COND-INACTIVE-EMPLOYEE`, `COND-SUPPORT-CONTEXT` | `Ready` |
| `PEO-SCR-002` | Employment details workspace | `EXP-03` | `PAT-07` | `MD-02` | record workspace | required | required | `PK-PROFILE-01` | `COND-EFFECTIVE-DATED`, `COND-PENDING-CHANGE`, `COND-READ-ONLY-HISTORY` | `Ready` |
| `PEO-SCR-003` | Identity and compliance panel | `EXP-03` | `PAT-09` | `MD-04` | compliance panel | required | required | `PK-PROFILE-01` | `COND-ID-EXPIRED`, `COND-OTP-REQUIRED`, `COND-COMPLIANCE-HOLD` | `Ready` |
| `PEO-SCR-004` | Bank and tax maintenance screens | `EXP-03` | `PAT-08` | `MD-03` | maintenance form | required | required | `PK-WIZARD-01` | `COND-VERIFICATION-PENDING`, `COND-DUPLICATE-ACCOUNT`, `COND-PAYROLL-LOCK` | `Ready` |
| `PEO-SCR-005` | Documents center | `EXP-03` | `PAT-09` | `MD-04` | document center | required | required | `PK-PROFILE-01` | `COND-UPLOAD-FAILED`, `COND-VERIFICATION-PENDING`, `COND-RESTRICTED-DOC` | `Ready` |
| `PEO-SCR-006` | Employee timeline | `EXP-03` | `PAT-10` | `MD-05` | timeline | required | reduced mobile | `PK-PROFILE-01` | `COND-DENSE-HISTORY`, `COND-MASKED-EVENT`, `COND-INVESTIGATION-VIEW` | `Ready` |
| `PEO-SCR-007` | Lifecycle action wizard | `EXP-03` | `PAT-08` | `MD-03` | wizard | required | required | `PK-WIZARD-01` | `COND-PROMOTION`, `COND-TRANSFER`, `COND-EXIT`, `COND-RETRO-EFFECTIVE` | `Ready` |

# 7. Wave 2, Wave 3, and Wave 4 Operational Screens

| Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REC-SCR-001` | Requisition workbench | `EXP-03` | `PAT-07` | `MD-02` | workbench | required | required | `PK-QUEUE-01` | `COND-DRAFT`, `COND-APPROVAL-PENDING`, `COND-ON-HOLD` | `Ready` |
| `REC-SCR-002` | Candidate pipeline board | `EXP-03` | `PAT-14` | `TX-05` | board | required | required | `PK-QUEUE-01` | `COND-STAGE-BLOCK`, `COND-OFFER-READY`, `COND-REJECTED` | `Ready` |
| `REC-SCR-003` | Candidate profile | `EXP-03` | `PAT-09` | `MD-04` | profile | required | required | `PK-PROFILE-01` | `COND-DUPLICATE-CANDIDATE`, `COND-BGV-PENDING`, `COND-SENSITIVE-NOTES` | `Ready` |
| `REC-SCR-004` | Interview scheduler | `EXP-03` | `PAT-13` | `TX-03` | scheduling workspace | required | required | `PK-WIZARD-01` | `COND-PANEL-CONFLICT`, `COND-RESCHEDULE`, `COND-FEEDBACK-MISSING` | `Ready` |
| `REC-SCR-005` | Offer workspace | `EXP-03` | `PAT-11` | `TX-01` | approval workspace | required | required | `PK-QUEUE-01` | `COND-COMPENSATION-HOLD`, `COND-OFFER-SENT`, `COND-OFFER-EXPIRED` | `Ready` |
| `REC-SCR-006` | Talent review workspace | `EXP-03` | `PAT-11` | `TX-01` | review workspace | required | reduced mobile | `PK-QUEUE-01` | `COND-CALIBRATION`, `COND-SUCCESSION-VIEW`, `COND-CONFIDENTIAL-TALENT` | `Ready` |
| `PAY-SCR-001` | Payroll control center | `EXP-03` | `PAT-02` | `DB-01` | control dashboard | required | reduced mobile | `PK-DASH-01` | `COND-RUN-OPEN`, `COND-BLOCKER-COUNT`, `COND-CLOSE-READY` | `Ready` |
| `PAY-SCR-002` | Payroll run details | `EXP-03` | `PAT-07` | `MD-02` | run workspace | required | reduced mobile | `PK-CONSOLE-01` | `COND-CALC-IN-PROGRESS`, `COND-VALIDATION-FAILED`, `COND-BANK-ADVICE-READY` | `Ready` |
| `PAY-SCR-003` | Validation queue | `EXP-03` | `PAT-11` | `TX-01` | validation workbench | required | reduced mobile | `PK-QUEUE-01` | `COND-ERROR-HEAVY`, `COND-WARNING-ONLY`, `COND-RESOLVED` | `Ready` |
| `PAY-SCR-004` | Statutory workbench | `EXP-03` | `PAT-07` | `MD-02` | compliance workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-PERIOD-LOCKED`, `COND-FILING-DUE`, `COND-AMENDMENT` | `Ready` |
| `PAY-SCR-005` | Compliance calendar | `EXP-03` | `PAT-13` | `TX-04` | calendar dashboard | required | required | `PK-DASH-01` | `COND-OVERDUE`, `COND-UPCOMING`, `COND-FILED` | `Ready` |
| `PAY-SCR-006` | Retro and settlement workspace | `EXP-03` | `PAT-11` | `TX-01` | financial workspace | required | reduced mobile | `PK-QUEUE-01` | `COND-RETRO-IMPACT`, `COND-FNF`, `COND-APPROVAL-HOLD` | `Ready` |
| `PAY-SCR-007` | Payroll anomaly copilot workspace | `EXP-03` | `PAT-11` | `TX-01` | anomaly review workspace | required | required | `PK-QUEUE-01` | `COND-ANOMALY-EXPLAINED`, `COND-ROUTE-PENDING`, `COND-HIGH-RISK` | `Ready` |
| `WRK-SCR-001` | Attendance workbench | `EXP-07` | `PAT-07` | `MD-02` | operational workbench | required | required | `PK-QUEUE-01` | `COND-MISSING-PUNCH`, `COND-REGULARIZATION`, `COND-DEVICE-MISMATCH` | `Ready` |
| `WRK-SCR-002` | Shift management screen | `EXP-07` | `PAT-13` | `TX-03` | scheduling screen | required | required | `PK-WIZARD-01` | `COND-ROTATION`, `COND-CONFLICT`, `COND-OVERRIDE` | `Ready` |
| `WRK-SCR-003` | Rostering screen | `EXP-07` | `PAT-13` | `TX-03` | planner | required | required | `PK-CONSOLE-01` | `COND-UNDER-STAFFED`, `COND-OVERTIME-RISK`, `COND-HOLIDAY-COVERAGE` | `Ready` |
| `WRK-SCR-004` | Timesheet workbench | `EXP-07` | `PAT-07` | `MD-02` | workbench | required | required | `PK-QUEUE-01` | `COND-SUBMITTED`, `COND-RETURNED`, `COND-BILLABLE-CONFLICT` | `Ready` |
| `LEV-SCR-001` | Leave policy workspace | `EXP-03` | `PAT-17` | `AD-02` | policy console | required | reduced mobile | `PK-CONSOLE-01` | `COND-ACCRUAL-RULE`, `COND-CARRY-FORWARD`, `COND-SANDWICH-RULE` | `Ready` |
| `LEV-SCR-002` | Leave approval queue | `EXP-02` | `PAT-11` | `TX-01` | queue | required | required | `PK-QUEUE-01` | `COND-BLACKOUT-PERIOD`, `COND-BALANCE-EXCEPTION`, `COND-TEAM-CONFLICT` | `Ready` |
| `LEV-SCR-003` | Team leave planning view | `EXP-02` | `PAT-13` | `TX-04` | planning dashboard | required | required | `PK-DASH-01` | `COND-CAPACITY-RISK`, `COND-FESTIVE-SEASON`, `COND-PROJECT-BLACKOUT` | `Ready` |
| `DOC-SCR-001` | Document repository and profile view | `EXP-03` | `PAT-07` | `MD-02` | repository | required | required | `PK-PROFILE-01` | `COND-VERSION-COMPARE`, `COND-SIGNATURE-PENDING`, `COND-RESTRICTED-DOWNLOAD` | `Ready` |
| `DOC-SCR-002` | Document signing and acknowledgment flow | `EXP-01` | `PAT-08` | `MD-03` | flow | required | required | `PK-WIZARD-01` | `COND-OTP-VERIFY`, `COND-SIGNATURE-FAILED`, `COND-EXPIRED-LINK` | `Ready` |
| `AST-SCR-001` | Asset assignment and return view | `EXP-07` | `PAT-07` | `MD-02` | operational workspace | required | required | `PK-QUEUE-01` | `COND-RETURN-OVERDUE`, `COND-DAMAGE-REPORTED`, `COND-EXIT-CLEARANCE` | `Ready` |
| `HLP-SCR-001` | Helpdesk and case management workbench | `EXP-07` | `PAT-07` | `MD-02` | case workbench | required | required | `PK-QUEUE-01` | `COND-SLA-BREACH`, `COND-ESCALATED`, `COND-CONFIDENTIAL-CASE` | `Ready` |
| `CTR-SCR-001` | Contractor workforce workbench | `EXP-07` | `PAT-07` | `MD-02` | workforce workbench | required | required | `PK-QUEUE-01` | `COND-DOC-EXPIRED`, `COND-ACCESS-BLOCKED`, `COND-VENDOR-HOLD` | `Ready` |
| `HSW-SCR-001` | Health, safety, and incident workspace | `EXP-07` | `PAT-07` | `MD-02` | incident workspace | required | required | `PK-QUEUE-01` | `COND-INCIDENT-OPEN`, `COND-MEDICAL-HOLD`, `COND-INVESTIGATION` | `Ready` |

# 8. Wave 5 Leadership, Analytics, and Intelligence Screens

| Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `ANL-SCR-001` | Executive dashboard | `EXP-06` | `PAT-04` | `WS-06` | analytics dashboard | required | required | `PK-ANALYTICS-01` | `COND-CROSS-FILTER`, `COND-NO-DATA`, `COND-EXPORT` | `Ready` |
| `ANL-SCR-002` | Workforce analytics | `EXP-06` | `PAT-03` | `DB-02` | analytics workspace | required | reduced mobile | `PK-ANALYTICS-01` | `COND-SEGMENT-COMPARE`, `COND-DRILL-DOWN`, `COND-SAVED-VIEW` | `Ready` |
| `ANL-SCR-003` | Attrition analytics | `EXP-06` | `PAT-03` | `DB-02` | analytics workspace | required | reduced mobile | `PK-ANALYTICS-01` | `COND-PREDICTIVE-RISK`, `COND-SEGMENT-OUTLIER`, `COND-LOW-CONFIDENCE` | `Ready` |
| `ANL-SCR-004` | Custom reporting | `EXP-06` | `PAT-22` | `AD-05` | report builder | required | reduced mobile | `PK-BUILDER-01` | `COND-SCHEDULED-REPORT`, `COND-ACCESS-RESTRICTED-FIELD`, `COND-EMPTY-DATASET` | `Ready` |
| `ANL-SCR-005` | Predictive insight views | `EXP-06` | `PAT-05` | `DB-03` | insight dashboard | required | required | `PK-ANALYTICS-01` | `COND-MODEL-LOW-CONFIDENCE`, `COND-RECOMMENDATION`, `COND-POLICY-WARNING` | `Ready` |

# 9. Expansion Screens

| Ref | Screen Name | Experience ID | Pattern ID | Final Template ID | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `ORG-SCR-001` | Organization structure workbench | `EXP-04` | `PAT-07` | `MD-02` | organization workbench | required | required | `PK-CONSOLE-01` | `COND-TREE-VIEW`, `COND-PENDING-PUBLISH`, `COND-GEO-STRUCTURE` | `Ready` |
| `ORG-SCR-002` | Entity and company profile console | `EXP-04` | `PAT-09` | `MD-04` | entity profile console | required | required | `PK-PROFILE-01` | `COND-APPROVAL-PENDING`, `COND-COMPLIANCE-ID-MISSING`, `COND-READ-ONLY-SYSTEM-FIELD` | `Ready` |
| `ORG-SCR-003` | Hierarchy explorer and reporting map | `EXP-04` | `PAT-07` | `MD-02` | hierarchy explorer | required | reduced mobile | `PK-CONSOLE-01` | `COND-COMPARE`, `COND-ROLLUP-MISMATCH`, `COND-REPORTING-BLOCK` | `Ready` |
| `ORG-SCR-004` | Calendar, policy, and classification console | `EXP-04` | `PAT-17` | `AD-02` | configuration console | required | required | `PK-CONSOLE-01` | `COND-COMPARE`, `COND-IN-USE`, `COND-PUBLISH-PENDING` | `Ready` |
| `ORG-ADM-001` | Access and roles console | `EXP-04` | `PAT-18` | `AD-03` | tenant access governance console | required | required | `PK-CONSOLE-01` | `COND-CONFLICT-WARNING`, `COND-DELEGATION-ACTIVE`, `COND-HIGH-RISK-ROLE` | `Ready` |
| `ORG-ADM-002` | Tenant settings | `EXP-04` | `PAT-16` | `AD-01` | tenant settings console | required | required | `PK-CONSOLE-01` | `COND-HIGH-RISK-CHANGE`, `COND-ROLLBACK`, `COND-APPROVAL-PENDING` | `Ready` |
| `ORG-ADM-003` | Branding and communication setup | `EXP-04` | `PAT-17` | `AD-02` | tenant branding and communication console | required | required | `PK-CONSOLE-01` | `COND-CHANNEL-PREVIEW`, `COND-DRAFT-PUBLISHED`, `COND-INHERITED-BRAND` | `Ready` |
| `ORG-ADM-004` | Identity and SSO readiness view | `EXP-04` | `PAT-17` | `AD-02` | tenant identity readiness console | required | required | `PK-CONSOLE-01` | `COND-MFA-REQUIRED`, `COND-CERTIFICATE-EXPIRING`, `COND-DEGRADED` | `Ready` |
| `ORG-ADM-007` | Tenant audit and admin activity view | `EXP-04` | `PAT-19` | `AD-04` | tenant audit console | required | required | `PK-QUEUE-01` | `COND-MASKED`, `COND-EXPORT-REQUEST`, `COND-PRIVILEGED-ALERT` | `Ready` |
| `ORG-ADM-008` | Export and privacy request review | `EXP-04` | `PAT-19` | `AD-04` | privacy review console | required | required | `PK-CONSOLE-01` | `COND-MASK-PREVIEW`, `COND-EXPORT-REQUEST`, `COND-LEGAL-BLOCK` | `Ready` |
| `IAM-SCR-001` | Identity and user account workbench | `EXP-04` | `PAT-17` | `AD-02` | identity admin workbench | required | required | `PK-CONSOLE-01` | `COND-INVITE-PENDING`, `COND-AUTH-RISK`, `COND-LOCKED-ACCOUNT` | `Ready` |
| `IAM-SCR-002` | Role and permission matrix | `EXP-04` | `PAT-18` | `AD-03` | access governance workspace | required | required | `PK-CONSOLE-01` | `COND-CONFLICT-WARNING`, `COND-DELEGATION-ACTIVE`, `COND-HIGH-RISK-ROLE` | `Ready` |
| `IAM-SCR-003` | SSO MFA and federation console | `EXP-04` | `PAT-17` | `AD-02` | federation console | required | required | `PK-CONSOLE-01` | `COND-MFA-REQUIRED`, `COND-CERTIFICATE-EXPIRING`, `COND-SYNC-DEGRADED` | `Ready` |
| `IAM-SCR-004` | Delegation session and device control | `EXP-04` | `PAT-20` | `UT-07` | delegation and session utility | required | required | `PK-PROFILE-01` | `COND-DELEGATION-ACTIVE`, `COND-SUPPORT-CONTEXT`, `COND-DEVICE-RISK` | `Ready` |
| `ADM-SCR-004` | Number series and template console | `EXP-04` | `PAT-17` | `AD-02` | numbering and template configuration console | required | required | `PK-CONSOLE-01` | `COND-COLLISION-WARNING`, `COND-RESERVATION-HELD`, `COND-SCOPE-CONFLICT` | `Ready` |
| `ADM-SCR-007` | Tenant lifecycle console | `EXP-05` | `PAT-16` | `AD-01` | tenant lifecycle console | required | required | `PK-CONSOLE-01` | `COND-PROVISIONING-STAGE`, `COND-SUSPENDED-TENANT`, `COND-READINESS-BLOCKER` | `Ready` |
| `OPS-SCR-001` | Monitoring console | `EXP-05` | `PAT-19` | `AD-04` | runtime monitoring console | required | required | `PK-MONITOR-01` | `COND-DEGRADED`, `COND-DEAD-LETTER`, `COND-LAG-SPIKE` | `Ready` |
| `OPS-SCR-002` | Release and feature-toggle console | `EXP-05` | `PAT-16` | `AD-01` | release governance console | required | required | `PK-CONSOLE-01` | `COND-APPROVAL-PENDING`, `COND-ROLLBACK`, `COND-FREEZE-ACTIVE` | `Ready` |
| `PRF-SCR-001` | Goal, OKR, and check-in workspace | `EXP-02` | `PAT-02` | `DB-01` | performance growth workspace | required | required | `PK-DASH-01` | `COND-REVIEW-DUE`, `COND-NO-GOALS`, `COND-FINALIZED` | `Ready` |
| `PRF-SCR-002` | Appraisal and review workspace | `EXP-02` | `PAT-11` | `TX-01` | performance review workspace | required | required | `PK-QUEUE-01` | `COND-CALIBRATION`, `COND-SELF-REVIEW-PENDING`, `COND-FINALIZED` | `Ready` |
| `PRF-SCR-003` | 360 feedback and calibration workspace | `EXP-02` | `PAT-11` | `TX-01` | calibration decision workspace | required | required | `PK-QUEUE-01` | `COND-CALIBRATION`, `COND-CONFIDENTIAL-TALENT`, `COND-FINALIZED` | `Ready` |
| `PRF-SCR-004` | Bell curve and rating distribution console | `EXP-06` | `PAT-03` | `DB-02` | rating distribution analytics console | required | required | `PK-ANALYTICS-01` | `COND-SEGMENT-COMPARE`, `COND-CALIBRATION`, `COND-FINALIZED` | `Ready` |
| `PRF-SCR-005` | Performance improvement plan workspace | `EXP-03` | `PAT-11` | `TX-01` | performance improvement workspace | required | required | `PK-QUEUE-01` | `COND-FINALIZED`, `COND-APPROVAL-PENDING`, `COND-RISK-STATE` | `Ready` |
| `LRN-SCR-001` | Learning management dashboard | `EXP-01` | `PAT-02` | `DB-01` | learning dashboard | required | required | `PK-DASH-01` | `COND-LEARNING-OVERDUE`, `COND-NO-DATA`, `COND-RECOMMENDATION` | `Ready` |
| `LRN-SCR-002` | Learning path and course catalog workspace | `EXP-01` | `PAT-07` | `MD-02` | learning catalog workspace | required | required | `PK-PROFILE-01` | `COND-APPROVAL-PENDING`, `COND-SAVED-VIEW`, `COND-PREREQUISITE-BLOCK` | `Ready` |
| `LRN-SCR-003` | Certification and compliance training queue | `EXP-03` | `PAT-11` | `TX-01` | certification queue | required | required | `PK-QUEUE-01` | `COND-LEARNING-OVERDUE`, `COND-ESCALATED`, `COND-EXPIRED` | `Ready` |
| `LRN-SCR-004` | Assessment and external content workspace | `EXP-03` | `PAT-09` | `MD-04` | assessment and evidence workspace | required | required | `PK-PROFILE-01` | `COND-OVERDUE`, `COND-EXTERNAL-CONTENT`, `COND-SYNC-DEGRADED` | `Ready` |
| `TAL-SCR-001` | Succession planning dashboard | `EXP-06` | `PAT-04` | `WS-06` | succession dashboard | required | required | `PK-ANALYTICS-01` | `COND-NO-DATA`, `COND-RISK-POSITION`, `COND-RECOMMENDATION` | `Ready` |
| `TAL-SCR-002` | Talent review and HiPo matrix workspace | `EXP-06` | `PAT-11` | `TX-01` | talent review workspace | required | required | `PK-QUEUE-01` | `COND-CONFIDENTIAL-TALENT`, `COND-CALIBRATION`, `COND-FINALIZED` | `Ready` |
| `TAL-SCR-003` | Career planning and bench strength workspace | `EXP-06` | `PAT-03` | `DB-02` | career and bench analytics workspace | required | required | `PK-ANALYTICS-01` | `COND-SEGMENT-COMPARE`, `COND-NO-DATA`, `COND-RECOMMENDATION` | `Ready` |
| `CMP-SCR-001` | Compensation planning workspace | `EXP-03` | `PAT-07` | `MD-02` | compensation planning workspace | required | required | `PK-CONSOLE-01` | `COND-COMPARE`, `COND-BUDGET-IMPACT`, `COND-APPROVAL-PENDING` | `Ready` |
| `CMP-SCR-002` | Salary review and merit cycle workspace | `EXP-03` | `PAT-11` | `TX-01` | merit cycle workspace | required | required | `PK-QUEUE-01` | `COND-RETRO-EFFECTIVE`, `COND-APPROVAL-PENDING`, `COND-FINALIZED` | `Ready` |
| `CMP-SCR-003` | Bonus, incentive, and ESOP planning workspace | `EXP-06` | `PAT-03` | `DB-02` | variable pay planning workspace | required | required | `PK-ANALYTICS-01` | `COND-COMPARE`, `COND-SCENARIO`, `COND-APPROVAL-PENDING` | `Ready` |
| `CMP-SCR-004` | Benefits enrollment and flexible benefits workspace | `EXP-01` | `PAT-02` | `DB-01` | benefits enrollment workspace | required | required | `PK-QUEUE-01` | `COND-ENROLLMENT-WINDOW`, `COND-PENDING`, `COND-LOCKED` | `Ready` |
| `ESS-SCR-006` | Employee goals, learning, and helpdesk hub | `EXP-01` | `PAT-01` | `WS-01` | self-service growth and support hub | required | required | `PK-DASH-01` | `COND-ACTION-DUE`, `COND-LEARNING-OVERDUE`, `COND-CASE-CREATED` | `Ready` |
| `ESS-SCR-004` | Employee leave, attendance, and travel hub | `EXP-01` | `PAT-01` | `WS-01` | self-service operations hub | required | required | `PK-DASH-01` | `COND-MISSING-PUNCH`, `COND-BALANCE-LOW`, `COND-APPROVAL-PENDING` | `Ready` |
| `ESS-SCR-005` | Employee claims, benefits, and assets hub | `EXP-01` | `PAT-01` | `WS-01` | self-service claims and benefits hub | required | required | `PK-DASH-01` | `COND-RETURNED`, `COND-PENDING`, `COND-CASE-CREATED` | `Ready` |
| `TRV-SCR-001` | Travel request wizard | `EXP-01` | `PAT-08` | `MD-03` | travel request wizard | required | required | `PK-WIZARD-01` | `COND-APPROVAL-PENDING`, `COND-DRAFT`, `COND-POLICY-VIOLATION` | `Ready` |
| `TRV-SCR-002` | Trip planning workspace | `EXP-01` | `PAT-13` | `TX-03` | trip planning workspace | required | required | `PK-WIZARD-01` | `COND-CONFLICT`, `COND-TASK-COMPLETE`, `COND-VENDOR-DELAY` | `Ready` |
| `TRV-SCR-003` | Itinerary and booking coordination screen | `EXP-01` | `PAT-13` | `TX-03` | itinerary coordination screen | required | required | `PK-QUEUE-01` | `COND-RESCHEDULE`, `COND-DISRUPTION`, `COND-DOCUMENT-MISSING` | `Ready` |
| `TRV-SCR-004` | Travel advance and settlement workspace | `EXP-01` | `PAT-15` | `TX-06` | travel settlement workspace | required | required | `PK-QUEUE-01` | `COND-RETURNED`, `COND-DUE`, `COND-APPROVAL-PENDING` | `Ready` |
| `XPN-SCR-001` | Expense claim and receipt workspace | `EXP-01` | `PAT-15` | `TX-06` | expense claim workspace | required | required | `PK-QUEUE-01` | `COND-RETURNED`, `COND-DRAFT`, `COND-RECEIPT-MISSING` | `Ready` |
| `XPN-SCR-002` | Per diem and OCR review workspace | `EXP-01` | `PAT-08` | `MD-03` | OCR and per diem workspace | required | required | `PK-QUEUE-01` | `COND-OCR-LOW-CONFIDENCE`, `COND-MISMATCH`, `COND-RULE-BLOCK` | `Ready` |
| `XPN-SCR-003` | Expense approval and reimbursement queue | `EXP-03` | `PAT-11` | `TX-01` | expense approval queue | required | required | `PK-QUEUE-01` | `COND-SLA-BREACH`, `COND-APPROVAL-PENDING`, `COND-REIMBURSEMENT-HOLD` | `Ready` |
| `XPN-SCR-004` | Corporate card reconciliation workspace | `EXP-03` | `PAT-07` | `MD-02` | card reconciliation workspace | required | required | `PK-QUEUE-01` | `COND-MISMATCH`, `COND-POLICY-BREACH`, `COND-MANUAL-MATCH` | `Ready` |
| `EXR-SCR-001` | Surveys and pulse feedback workspace | `EXP-01` | `PAT-02` | `DB-01` | survey workspace | required | required | `PK-DASH-01` | `COND-NO-DATA`, `COND-DUE`, `COND-CONFIDENTIAL` | `Ready` |
| `EXR-SCR-002` | Recognition and rewards workspace | `EXP-01` | `PAT-11` | `TX-01` | recognition workspace | required | required | `PK-QUEUE-01` | `COND-PENDING`, `COND-REDEEM`, `COND-APPROVAL-PENDING` | `Ready` |
| `EXR-SCR-003` | Social feed, communities, and events hub | `EXP-01` | `PAT-01` | `WS-01` | community engagement hub | required | required | `PK-DASH-01` | `COND-ANNOUNCEMENT-HEAVY`, `COND-EVENT-DUE`, `COND-NO-DATA` | `Ready` |
| `EXR-SCR-004` | Wellness programs workspace | `EXP-01` | `PAT-09` | `MD-04` | wellness workspace | required | required | `PK-DASH-01` | `COND-COMPLIANCE-HOLD`, `COND-UPCOMING`, `COND-NO-DATA` | `Ready` |
| `EXR-SCR-005` | Celebration campaign studio | `EXP-03` | `PAT-22` | `AD-05` | celebration builder workspace | required | required | `PK-BUILDER-01` | `COND-CELEBRATION-DUE`, `COND-FESTIVAL-CAMPAIGN`, `COND-PREVIEW-MODE` | `Ready` |
| `EXR-SCR-006` | Ridz quote and recognition personalization engine | `EXP-03` | `PAT-17` | `AD-02` | personalization console | required | required | `PK-CONSOLE-01` | `COND-QUOTE-PERSONALIZED`, `COND-FESTIVAL-CAMPAIGN`, `COND-AUDIENCE-TARGETED` | `Ready` |
| `AST-SCR-002` | Asset catalog and software license console | `EXP-07` | `PAT-17` | `AD-02` | asset catalog console | required | required | `PK-CONSOLE-01` | `COND-LOW-STOCK`, `COND-IN-USE`, `COND-COMPARE` | `Ready` |
| `AST-SCR-003` | Asset maintenance and audit workspace | `EXP-07` | `PAT-11` | `TX-01` | asset maintenance workspace | required | required | `PK-QUEUE-01` | `COND-OVERDUE`, `COND-ESCALATED`, `COND-FINDING-OPEN` | `Ready` |
| `MSS-SCR-001` | Manager workspace home | `EXP-02` | `PAT-01` | `WS-02` | manager home workspace | required | required | `PK-DASH-01` | `COND-ACTION-DUE`, `COND-APPROVAL-HEAVY`, `COND-ABSENCE-SPIKE` | `Ready` |
| `MSS-SCR-002` | Manager people and actions workspace | `EXP-02` | `PAT-07` | `MD-02` | manager people workspace | required | required | `PK-QUEUE-01` | `COND-SENSITIVE-VIEW`, `COND-PENDING-CHANGE`, `COND-DELEGATED-TEAM` | `Ready` |
| `MSS-SCR-003` | Manager approvals and routing workspace | `EXP-02` | `PAT-11` | `TX-01` | manager routing workspace | required | required | `PK-QUEUE-01` | `COND-RETURNED`, `COND-SLA-BREACH`, `COND-ROUTE-PREVIEW` | `Ready` |
| `MSS-SCR-004` | Manager reviews and team performance hub | `EXP-02` | `PAT-02` | `DB-01` | manager performance hub | required | required | `PK-DASH-01` | `COND-REVIEW-DUE`, `COND-CALIBRATION`, `COND-RISK-STATE` | `Ready` |
| `MSS-SCR-005` | Manager mobility and hiring actions workspace | `EXP-02` | `PAT-15` | `TX-06` | manager mobility workspace | required | required | `PK-QUEUE-01` | `COND-APPROVAL-PENDING`, `COND-BUDGET-IMPACT`, `COND-BLOCKED-DEPENDENCY` | `Ready` |
| `HLP-SCR-002` | Case detail and SLA workspace | `EXP-07` | `PAT-07` | `MD-02` | case detail workspace | required | required | `PK-QUEUE-01` | `COND-SLA-BREACH`, `COND-ESCALATED`, `COND-CONFIDENTIAL-CASE` | `Ready` |
| `HLP-SCR-003` | Knowledge base and escalation console | `EXP-07` | `PAT-20` | `UT-02` | escalation and knowledge console | required | required | `PK-QUEUE-01` | `COND-ESCALATED`, `COND-NO-RESULT`, `COND-CASE-CREATED` | `Ready` |
| `CTR-SCR-002` | Contractor contract and compliance workspace | `EXP-07` | `PAT-09` | `MD-04` | contractor compliance workspace | required | required | `PK-QUEUE-01` | `COND-DOC-EXPIRED`, `COND-COMPLIANCE-HOLD`, `COND-VENDOR-HOLD` | `Ready` |
| `CTR-SCR-003` | Contractor access control and risk workspace | `EXP-07` | `PAT-18` | `AD-03` | contractor access-risk workspace | required | required | `PK-QUEUE-01` | `COND-ACCESS-BLOCKED`, `COND-HIGH-RISK`, `COND-REMEDIATION` | `Ready` |
| `VWP-SCR-001` | Visitor registration and gate pass workspace | `EXP-07` | `PAT-08` | `MD-03` | visitor registration workspace | required | required | `PK-WIZARD-01` | `COND-ID-VERIFY`, `COND-WALK-IN`, `COND-BLOCKED-VISITOR` | `Ready` |
| `VWP-SCR-002` | Meeting and room booking workspace | `EXP-07` | `PAT-13` | `TX-03` | booking workspace | required | required | `PK-WIZARD-01` | `COND-CONFLICT`, `COND-RESCHEDULE`, `COND-CAPACITY-WARNING` | `Ready` |
| `VWP-SCR-003` | Desk, shuttle, parking, and workplace services hub | `EXP-07` | `PAT-13` | `TX-04` | workplace services hub | required | required | `PK-QUEUE-01` | `COND-UNAVAILABLE`, `COND-WAITLIST`, `COND-SERVICE-OUTAGE` | `Ready` |
| `HSW-SCR-002` | Safety audit and risk assessment workspace | `EXP-07` | `PAT-07` | `MD-02` | safety audit workspace | required | required | `PK-QUEUE-01` | `COND-FINDING-OPEN`, `COND-HIGH-RISK`, `COND-OVERDUE` | `Ready` |
| `HSW-SCR-003` | Occupational health and medical compliance workspace | `EXP-07` | `PAT-09` | `MD-04` | occupational health workspace | required | required | `PK-PROFILE-01` | `COND-COMPLIANCE-HOLD`, `COND-EXPIRED`, `COND-DUE` | `Ready` |
| `HSW-SCR-004` | Emergency response command workspace | `EXP-07` | `PAT-19` | `AD-04` | emergency command workspace | required | required | `PK-MONITOR-01` | `COND-CRITICAL`, `COND-ACTIVE-INCIDENT`, `COND-READINESS-GAP` | `Ready` |
| `COMMS-SCR-001` | Channel console and delivery workspace | `EXP-07` | `PAT-17` | `AD-02` | communications channel console | required | required | `PK-CONSOLE-01` | `COND-DELIVERY-FAILURE`, `COND-PAUSED`, `COND-DEGRADED` | `Ready` |
| `COMMS-SCR-002` | Announcements and bulletin hub | `EXP-01` | `PAT-20` | `UT-01` | announcement hub | required | required | `PK-DASH-01` | `COND-PINNED`, `COND-SCHEDULED`, `COND-AUDIENCE-TARGETED` | `Ready` |
| `COMMS-SCR-003` | Campaign composer and audience scheduler | `EXP-07` | `PAT-22` | `AD-05` | campaign builder workspace | required | required | `PK-BUILDER-01` | `COND-SCHEDULE-HOLD`, `COND-AUDIENCE-EXCLUSION`, `COND-PREVIEW-MODE` | `Ready` |
| `DOC-SCR-003` | Digital signature and document action workspace | `EXP-03` | `PAT-08` | `MD-03` | document action workspace | required | required | `PK-WIZARD-01` | `COND-EXPIRED-LINK`, `COND-SIGNATURE-FAILED`, `COND-REMINDER-SENT` | `Ready` |
| `DOC-SCR-004` | OCR and retention policy console | `EXP-03` | `PAT-17` | `AD-02` | retention policy console | required | required | `PK-CONSOLE-01` | `COND-OCR-LOW-CONFIDENCE`, `COND-LEGAL-HOLD`, `COND-EXPIRY-WARNING` | `Ready` |
| `WRK-SCR-005` | Overtime and comp-off console | `EXP-07` | `PAT-11` | `TX-01` | overtime control workspace | required | required | `PK-QUEUE-01` | `COND-OVERTIME-RISK`, `COND-PENDING`, `COND-CAPACITY-CONFLICT` | `Ready` |
| `STA-SCR-001` | Statutory compliance operations workbench | `EXP-03` | `PAT-07` | `MD-02` | statutory operations workbench | required | required | `PK-CONSOLE-01` | `COND-FILING-DUE`, `COND-BLOCKED`, `COND-EVIDENCE-MISSING` | `Ready` |
| `STA-SCR-002` | TDS and tax filing workspace | `EXP-03` | `PAT-07` | `MD-02` | tax filing workspace | required | required | `PK-CONSOLE-01` | `COND-MISMATCH`, `COND-CORRECTION-REQUIRED`, `COND-OVERDUE` | `Ready` |
| `STA-SCR-003` | Compliance calendar and filing tracker | `EXP-03` | `PAT-13` | `TX-04` | compliance calendar tracker | required | required | `PK-DASH-01` | `COND-OVERDUE`, `COND-REMINDER-DUE`, `COND-OWNER-BLOCKED` | `Ready` |
| `STA-SCR-004` | Country compliance and regulatory dashboard | `EXP-06` | `PAT-04` | `WS-06` | country compliance dashboard | required | required | `PK-ANALYTICS-01` | `COND-AMENDMENT-ALERT`, `COND-READINESS-GAP`, `COND-EXECUTIVE-SUMMARY` | `Ready` |
| `AIC-SCR-001` | Copilot command workspace | `EXP-01` | `PAT-05` | `DB-03` | AI command workspace | required | required | `PK-DASH-01` | `COND-HUMAN-REVIEW`, `COND-GUARDRAIL-WARNING`, `COND-SAVED-COMMAND` | `Ready` |
| `AIC-SCR-002` | Role-based copilot workspace | `EXP-02` | `PAT-01` | `WS-02` | role-aware AI workspace | required | required | `PK-DASH-01` | `COND-ESCALATED`, `COND-DELEGATED-ACTION`, `COND-ROLE-SWITCH` | `Ready` |
| `AIC-SCR-003` | Policy assistant and natural language query console | `EXP-01` | `PAT-20` | `UT-02` | policy assistant console | required | required | `PK-CONSOLE-01` | `COND-LOW-CONFIDENCE`, `COND-SOURCE-REVIEW`, `COND-ESCALATION-OPEN` | `Ready` |
| `AIC-SCR-004` | Skills graph and talent intelligence workspace | `EXP-06` | `PAT-14` | `TX-05` | talent intelligence workspace | required | required | `PK-ANALYTICS-01` | `COND-MATCH-LOW`, `COND-GAP-HIGH`, `COND-RECOMMENDATION` | `Ready` |
| `AIC-SCR-005` | Predictive workforce insights and explainability dashboard | `EXP-06` | `PAT-05` | `DB-03` | predictive insight dashboard | required | required | `PK-ANALYTICS-01` | `COND-LOW-CONFIDENCE`, `COND-ACTION-RECOMMENDED`, `COND-COHORT-OUTLIER` | `Ready` |
| `AIC-SCR-006` | Conversational reporting workspace | `EXP-06` | `PAT-05` | `DB-03` | AI reporting workspace | required | required | `PK-ANALYTICS-01` | `COND-CONVERSATIONAL-RESULT`, `COND-LOW-CONFIDENCE`, `COND-SOURCE-REVIEW` | `Ready` |
| `INT-SCR-001` | API and webhook console | `EXP-05` | `PAT-17` | `AD-02` | API administration console | required | required | `PK-CONSOLE-01` | `COND-WEBHOOK-FAILED`, `COND-SCHEMA-RISK`, `COND-TOKEN-EXPIRING` | `Ready` |
| `INT-SCR-002` | Event streaming and delivery monitor | `EXP-05` | `PAT-19` | `AD-04` | event delivery monitor | required | required | `PK-MONITOR-01` | `COND-LAG-SPIKE`, `COND-DEAD-LETTER`, `COND-REPLAY-REQUEST` | `Ready` |
| `INT-SCR-003` | ERP, CRM, and finance connector workspace | `EXP-05` | `PAT-21` | `UT-05` | connector mapping workspace | required | required | `PK-CONSOLE-01` | `COND-SYNC-FAILED`, `COND-MAPPING-CONFLICT`, `COND-CREDENTIAL-BLOCK` | `Ready` |
| `INT-SCR-004` | Identity, bank, and biometric integration console | `EXP-05` | `PAT-17` | `AD-02` | critical integration console | required | required | `PK-CONSOLE-01` | `COND-DEGRADED`, `COND-CERT-EXPIRING`, `COND-DEVICE-OFFLINE` | `Ready` |
| `TST-SCR-001` | Test data management console | `EXP-05` | `PAT-17` | `AD-04` | test data control console | required | required | `PK-CONSOLE-01` | `COND-MASKING-RISK`, `COND-REFRESH-REQUEST`, `COND-APPROVAL-PENDING` | `Ready` |
| `TST-SCR-002` | Regression and release validation workspace | `EXP-05` | `PAT-21` | `UT-05` | regression validation workspace | required | required | `PK-CONSOLE-01` | `COND-BLOCKER-OPEN`, `COND-RERUN-REQUESTED`, `COND-WAIVER-PENDING` | `Ready` |
| `TST-SCR-003` | Non-functional quality dashboard | `EXP-05` | `PAT-02` | `DB-01` | quality signal dashboard | required | required | `PK-DASH-01` | `COND-CRITICAL-SIGNAL`, `COND-ENVIRONMENT-DRIFT`, `COND-TREND-DEGRADING` | `Ready` |
| `TST-SCR-004` | UAT command center and sign-off workspace | `EXP-05` | `PAT-18` | `AD-03` | UAT sign-off workspace | required | required | `PK-QUEUE-01` | `COND-BLOCKER-OPEN`, `COND-WAIVER-PENDING`, `COND-SIGNOFF-COMPLETE` | `Ready` |

# 10. Production Rule

No screen should be considered mockup-complete until:

1. default desktop view exists
2. default mobile view exists or a documented desktop-only exception is accepted
3. all required family-level variants are covered
4. all listed condition-specific variants are covered either as separate mockups or as approved annotation overlays
