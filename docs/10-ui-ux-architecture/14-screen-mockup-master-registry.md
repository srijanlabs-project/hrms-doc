---
id: HRMS-UX-014
title: Screen Mockup Master Registry
document: 14-screen-mockup-master-registry.md
version: 1.3
status: Draft
---

# 1. Purpose

This document is the master production registry for mockups across the Enterprise HRMS application.

It exists to answer four questions for every screen:

- does this screen need a desktop mockup
- does this screen need a mobile mockup
- which state or condition variants require separate mockups
- what is the current production status of the mockup pack

# 2. Status Legend

- `Ready` means default desktop and mobile mockups exist in the repository
- `In Progress` means structural definitions exist and the screen is in active mockup production
- `Planned` means the screen is registered and variant scope is defined, but the artboards are not yet produced
- `Desktop Only` means the screen is primarily desktop-oriented, while mobile receives behavior notes or reduced drill-down views only

# 3. Variant Pack Legend

This registry references the standard variant packs from:

- [15-screen-variant-and-conditional-state-catalog.md](D:/HRMS-doc/docs/10-ui-ux-architecture/15-screen-variant-and-conditional-state-catalog.md)

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

- `90` registered screens now have default desktop and mobile mockups
- `180` concrete SVG assets now exist in the repository
- all currently registered baseline rows are now in `Ready` state, while conditional-state variant packs remain the next expansion layer

# 5. Wave 0 Provider, Tenant, Security, and Delivery Screens

| Ref | Screen Name | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|
| `W0-SCR-001` | SaaS platform admin home dashboard | dashboard | required | required | `PK-DASH-01` | `COND-DEGRADED`, `COND-HIGH-RISK`, `COND-SUPPORT-CONTEXT` | `Ready` |
| `W0-SCR-002` | Global search and command entry | global utility | required | required | `PK-QUEUE-01` | `COND-SEARCH-SUGGEST`, `COND-NO-RESULT`, `COND-RESTRICTED-RESULT` | `Ready` |
| `W0-SCR-003` | Shared task and approvals inbox | queue | required | required | `PK-QUEUE-01` | `COND-BULK-ACTION`, `COND-OVERDUE`, `COND-DETAIL-LOCKED` | `Ready` |
| `W0-SCR-004` | Configuration catalog and scope console | admin console | required | required | `PK-CONSOLE-01` | `COND-COMPARE`, `COND-READ-ONLY-PROVIDER`, `COND-APPROVAL-PENDING` | `Ready` |
| `W0-SCR-005` | Metadata explorer and dependency map | admin explorer | required | reduced mobile | `PK-CONSOLE-01` | `COND-VERSION-COMPARE`, `COND-RESTRICTED-FIELD`, `COND-DEPENDENCY-MISSING` | `Ready` |
| `W0-SCR-006` | Workflow administration console | admin workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-DRAFT-PUBLISHED`, `COND-STUCK-ITEM`, `COND-ROUTE-PREVIEW` | `Ready` |
| `W0-SCR-007` | Notification template and channel console | admin console | required | required | `PK-CONSOLE-01` | `COND-CHANNEL-PREVIEW`, `COND-DRAFT-PUBLISHED`, `COND-DELIVERY-FAILURE` | `Ready` |
| `W0-SCR-008` | Audit explorer and entity timeline | investigative workbench | required | reduced mobile | `PK-QUEUE-01` | `COND-MASKED`, `COND-REVEALED`, `COND-EXPORT-REQUEST` | `Ready` |
| `W0-SCR-009` | Event bus and integration runtime monitor | monitor | required | required | `PK-MONITOR-01` | `COND-REPLAY`, `COND-DEAD-LETTER`, `COND-LAG-SPIKE` | `Ready` |
| `W0-SCR-010` | Document template builder and generation monitor | builder plus monitor | required | reduced mobile | `PK-BUILDER-01` | `COND-TEMPLATE-ERROR`, `COND-MERGE-PREVIEW`, `COND-GENERATION-FAILURE` | `Ready` |
| `W0-SCR-011` | AI platform policy and evaluation console | admin console | required | reduced mobile | `PK-CONSOLE-01` | `COND-VIOLATION-ALERT`, `COND-COST-SPIKE`, `COND-POLICY-COMPARE` | `Ready` |
| `W0-SCR-012` | Localization diagnostics and bundle runtime view | diagnostics console | required | reduced mobile | `PK-MONITOR-01` | `COND-MISSING-BUNDLE`, `COND-FALLBACK-IN-USE`, `COND-PUBLISH-PENDING` | `Ready` |
| `W0-SCR-013` | Dynamic form designer | builder | required | reduced mobile | `PK-BUILDER-01` | `COND-DRAFT-PUBLISHED`, `COND-FIELD-CONFLICT`, `COND-PREVIEW-MODE` | `Ready` |
| `W0-SCR-014` | Dynamic field catalog and field editor | admin console | required | required | `PK-CONSOLE-01` | `COND-BREAKING-CHANGE`, `COND-IN-USE`, `COND-VALIDATION-ERROR` | `Ready` |
| `W0-SCR-015` | Dynamic master console | admin console | required | required | `PK-CONSOLE-01` | `COND-TREE-VIEW`, `COND-IMPORT-PREVIEW`, `COND-USAGE-BLOCKER` | `Ready` |
| `W0-SCR-016` | Localization bundle manager | admin console | required | reduced mobile | `PK-CONSOLE-01` | `COND-MISSING-TRANSLATION`, `COND-DRAFT-PUBLISHED`, `COND-COMPLETE-READY` | `Ready` |
| `W0-SCR-017` | System settings console | settings console | required | required | `PK-CONSOLE-01` | `COND-HIGH-RISK-CHANGE`, `COND-ROLLBACK`, `COND-APPROVAL-PENDING` | `Ready` |
| `W0-SCR-018` | Organization admin dashboard | tenant dashboard | required | required | `PK-DASH-01` | `COND-FIRST-TIME-SETUP`, `COND-QUOTA-WARNING`, `COND-SUSPENDED-TENANT` | `Ready` |
| `W0-SCR-019` | Access governance dashboard | dashboard | required | required | `PK-DASH-01` | `COND-CAMPAIGN-RISK`, `COND-SOD-BREACH`, `COND-PRIVILEGED-ALERT` | `Ready` |
| `W0-SCR-020` | Role and policy matrix workspace | policy workspace | required | reduced mobile | `PK-CONSOLE-01` | `COND-COMPARE`, `COND-CONFLICT-WARNING`, `COND-DRAFT-PUBLISHED` | `Ready` |
| `W0-SCR-021` | Data masking policy console | admin console | required | reduced mobile | `PK-CONSOLE-01` | `COND-MASK-PREVIEW`, `COND-REVEAL-POLICY`, `COND-EXPORT-POLICY` | `Ready` |
| `W0-SCR-022` | Retention and legal-hold control center | operations console | required | reduced mobile | `PK-CONSOLE-01` | `COND-HOLD-ACTIVE`, `COND-PURGE-READY`, `COND-LEGAL-BLOCK` | `Ready` |
| `W0-SCR-023` | Access review campaign workspace | review workbench | required | required | `PK-QUEUE-01` | `COND-BULK-LOW-RISK`, `COND-REMEDIATION`, `COND-CERTIFICATION-CLOSED` | `Ready` |
| `W0-SCR-024` | Backup and restore operations dashboard | operations dashboard | required | reduced mobile | `PK-MONITOR-01` | `COND-RESTORE-REQUEST`, `COND-BACKUP-FAILED`, `COND-RECOVERY-POINT-SELECT` | `Ready` |
| `W0-SCR-025` | Disaster recovery readiness console | readiness dashboard | required | reduced mobile | `PK-DASH-01` | `COND-DR-TEST-FAILED`, `COND-RTO-BREACH`, `COND-EXECUTIVE-SUMMARY` | `Ready` |
| `W0-SCR-026` | Bulk import wizard and validation workbench | wizard plus workbench | required | required | `PK-WIZARD-01` | `COND-IMPORT-PREVIEW`, `COND-ROW-ERROR`, `COND-COMMIT-CONFIRM` | `Ready` |
| `W0-SCR-027` | Migration mapping and reconciliation workspace | workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-MISMATCH`, `COND-TRIAL-LOAD`, `COND-SIGNOFF-PENDING` | `Ready` |
| `W0-SCR-028` | Validation command center | readiness console | required | required | `PK-DASH-01` | `COND-BLOCKER-OPEN`, `COND-EVIDENCE-MISSING`, `COND-SIGNOFF-COMPLETE` | `Ready` |
| `W0-SCR-029` | Cutover command center | mission control dashboard | required | reduced mobile | `PK-DASH-01` | `COND-FREEZE-ACTIVE`, `COND-CHECKPOINT-HOLD`, `COND-ROLLBACK-TRIGGERED` | `Ready` |
| `W0-SCR-030` | Rollback runbook and trigger workspace | runbook workspace | required | reduced mobile | `PK-WIZARD-01` | `COND-IRREVERSIBLE-STEP`, `COND-EXEC-APPROVAL`, `COND-ROLLBACK-COMPLETE` | `Ready` |

# 6. Shared Global and Wave 1 Core Workforce Screens

| Ref | Screen Name | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|
| `GLB-SCR-001` | Notifications center | global tray plus list | required | required | `PK-QUEUE-01` | `COND-UNREAD-ONLY`, `COND-ACTIONABLE`, `COND-ARCHIVED` | `Ready` |
| `GLB-SCR-002` | Help and support center | support hub | required | required | `PK-DASH-01` | `COND-SEARCH-NO-RESULT`, `COND-LIVE-SUPPORT`, `COND-CASE-CREATED` | `Ready` |
| `GLB-SCR-003` | Profile and delegation switch | profile plus settings | required | required | `PK-PROFILE-01` | `COND-DELEGATION-ACTIVE`, `COND-MFA-REQUIRED`, `COND-SESSION-REVIEW` | `Ready` |
| `EMP-SCR-001` | Employee home | dashboard | required | required | `PK-DASH-01` | `COND-ACTION-DUE`, `COND-PAYDAY`, `COND-ANNOUNCEMENT-HEAVY` | `Ready` |
| `EMP-SCR-002` | My profile | profile | required | required | `PK-PROFILE-01` | `COND-INCOMPLETE-PROFILE`, `COND-READ-ONLY-FIELD`, `COND-EDIT-SAVED` | `Ready` |
| `EMP-SCR-003` | My documents | document center | required | required | `PK-PROFILE-01` | `COND-UPLOAD-PENDING`, `COND-VERIFICATION-FAILED`, `COND-EXPIRED` | `Ready` |
| `EMP-SCR-004` | My requests | request list | required | required | `PK-QUEUE-01` | `COND-DRAFT`, `COND-RETURNED`, `COND-CLOSED` | `Ready` |
| `EMP-SCR-005` | My payslips and tax views | financial self-service | required | required | `PK-PROFILE-01` | `COND-PAYSLIP-NOT-PUBLISHED`, `COND-TAX-DECLARATION-WINDOW`, `COND-YEAR-END` | `Ready` |
| `EMP-SCR-006` | My leave and attendance | self-service workbench | required | required | `PK-QUEUE-01` | `COND-BALANCE-LOW`, `COND-MISSING-PUNCH`, `COND-HOLIDAY-OVERLAY` | `Ready` |
| `EMP-SCR-007` | My goals and learning | dashboard plus list | required | required | `PK-DASH-01` | `COND-REVIEW-DUE`, `COND-LEARNING-OVERDUE`, `COND-NO-GOALS` | `Ready` |
| `EMP-SCR-008` | My benefits and claims | benefits self-service | required | required | `PK-QUEUE-01` | `COND-ENROLLMENT-WINDOW`, `COND-CLAIM-RETURNED`, `COND-POLICY-LOCKED` | `Ready` |
| `MGR-SCR-001` | Team dashboard | dashboard | required | required | `PK-DASH-01` | `COND-ABSENCE-SPIKE`, `COND-APPROVAL-HEAVY`, `COND-PERFORMANCE-CYCLE` | `Ready` |
| `MGR-SCR-002` | Team people list | list plus profile launch | required | required | `PK-QUEUE-01` | `COND-FILTERED-TEAM`, `COND-DELEGATED-TEAM`, `COND-RESTRICTED-DATA` | `Ready` |
| `MGR-SCR-003` | Manager approvals | queue | required | required | `PK-QUEUE-01` | `COND-BULK-APPROVE`, `COND-RETURN-FOR-CORRECTION`, `COND-SLA-BREACH` | `Ready` |
| `MGR-SCR-004` | Performance review workspace | review workspace | required | required | `PK-QUEUE-01` | `COND-SELF-REVIEW-PENDING`, `COND-CALIBRATION`, `COND-FINALIZED` | `Ready` |
| `MGR-SCR-005` | Hiring approval workspace | review workspace | required | required | `PK-QUEUE-01` | `COND-BUDGET-BLOCK`, `COND-MULTI-APPROVER`, `COND-OFFER-EXPIRY` | `Ready` |
| `MGR-SCR-006` | Team leave and attendance overview | operational dashboard | required | required | `PK-DASH-01` | `COND-UNDER-STAFFED`, `COND-LATE-MARK-TREND`, `COND-HOLIDAY-CONFLICT` | `Ready` |
| `MGR-SCR-007` | Mobility proposal workspace | workflow workspace | required | reduced mobile | `PK-WIZARD-01` | `COND-BUDGET-IMPACT`, `COND-POSITION-NOT-AVAILABLE`, `COND-APPROVAL-ROUTE` | `Ready` |
| `HRO-SCR-001` | Employee master workbench | operational workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-DUPLICATE-MATCH`, `COND-BULK-EDIT`, `COND-SENSITIVE-FIELD-MASKED` | `Ready` |
| `HRO-SCR-002` | Lifecycle change workbench | workbench | required | reduced mobile | `PK-QUEUE-01` | `COND-EFFECTIVE-DATED`, `COND-APPROVAL-PENDING`, `COND-BLOCKED-DEPENDENCY` | `Ready` |
| `HRO-SCR-003` | Onboarding and preboarding console | operations console | required | required | `PK-DASH-01` | `COND-DOCS-MISSING`, `COND-JOINING-DELAYED`, `COND-TASK-COMPLETE` | `Ready` |
| `HRO-SCR-004` | Document verification queue | review queue | required | required | `PK-QUEUE-01` | `COND-REJECTED-DOC`, `COND-EXPIRED-DOC`, `COND-REUPLOAD-REQUESTED` | `Ready` |
| `HRO-SCR-005` | Data correction and exception queue | exception queue | required | reduced mobile | `PK-QUEUE-01` | `COND-HIGH-RISK-FIELD`, `COND-CONFLICTING-VALUES`, `COND-CLOSED-WITH-AUDIT` | `Ready` |
| `PEO-SCR-001` | Employee profile summary | profile | required | required | `PK-PROFILE-01` | `COND-SENSITIVE-VIEW`, `COND-INACTIVE-EMPLOYEE`, `COND-SUPPORT-CONTEXT` | `Ready` |
| `PEO-SCR-002` | Employment details workspace | record workspace | required | required | `PK-PROFILE-01` | `COND-EFFECTIVE-DATED`, `COND-PENDING-CHANGE`, `COND-READ-ONLY-HISTORY` | `Ready` |
| `PEO-SCR-003` | Identity and compliance panel | compliance panel | required | required | `PK-PROFILE-01` | `COND-ID-EXPIRED`, `COND-OTP-REQUIRED`, `COND-COMPLIANCE-HOLD` | `Ready` |
| `PEO-SCR-004` | Bank and tax maintenance screens | maintenance form | required | required | `PK-WIZARD-01` | `COND-VERIFICATION-PENDING`, `COND-DUPLICATE-ACCOUNT`, `COND-PAYROLL-LOCK` | `Ready` |
| `PEO-SCR-005` | Documents center | document center | required | required | `PK-PROFILE-01` | `COND-UPLOAD-FAILED`, `COND-VERIFICATION-PENDING`, `COND-RESTRICTED-DOC` | `Ready` |
| `PEO-SCR-006` | Employee timeline | timeline | required | reduced mobile | `PK-PROFILE-01` | `COND-DENSE-HISTORY`, `COND-MASKED-EVENT`, `COND-INVESTIGATION-VIEW` | `Ready` |
| `PEO-SCR-007` | Lifecycle action wizard | wizard | required | required | `PK-WIZARD-01` | `COND-PROMOTION`, `COND-TRANSFER`, `COND-EXIT`, `COND-RETRO-EFFECTIVE` | `Ready` |

# 7. Wave 2, Wave 3, and Wave 4 Operational Screens

| Ref | Screen Name | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|
| `REC-SCR-001` | Requisition workbench | workbench | required | required | `PK-QUEUE-01` | `COND-DRAFT`, `COND-APPROVAL-PENDING`, `COND-ON-HOLD` | `Ready` |
| `REC-SCR-002` | Candidate pipeline board | board | required | required | `PK-QUEUE-01` | `COND-STAGE-BLOCK`, `COND-OFFER-READY`, `COND-REJECTED` | `Ready` |
| `REC-SCR-003` | Candidate profile | profile | required | required | `PK-PROFILE-01` | `COND-DUPLICATE-CANDIDATE`, `COND-BGV-PENDING`, `COND-SENSITIVE-NOTES` | `Ready` |
| `REC-SCR-004` | Interview scheduler | scheduling workspace | required | required | `PK-WIZARD-01` | `COND-PANEL-CONFLICT`, `COND-RESCHEDULE`, `COND-FEEDBACK-MISSING` | `Ready` |
| `REC-SCR-005` | Offer workspace | approval workspace | required | required | `PK-QUEUE-01` | `COND-COMPENSATION-HOLD`, `COND-OFFER-SENT`, `COND-OFFER-EXPIRED` | `Ready` |
| `REC-SCR-006` | Talent review workspace | review workspace | required | reduced mobile | `PK-QUEUE-01` | `COND-CALIBRATION`, `COND-SUCCESSION-VIEW`, `COND-CONFIDENTIAL-TALENT` | `Ready` |
| `PAY-SCR-001` | Payroll control center | control dashboard | required | reduced mobile | `PK-DASH-01` | `COND-RUN-OPEN`, `COND-BLOCKER-COUNT`, `COND-CLOSE-READY` | `Ready` |
| `PAY-SCR-002` | Payroll run details | run workspace | required | reduced mobile | `PK-CONSOLE-01` | `COND-CALC-IN-PROGRESS`, `COND-VALIDATION-FAILED`, `COND-BANK-ADVICE-READY` | `Ready` |
| `PAY-SCR-003` | Validation queue | validation workbench | required | reduced mobile | `PK-QUEUE-01` | `COND-ERROR-HEAVY`, `COND-WARNING-ONLY`, `COND-RESOLVED` | `Ready` |
| `PAY-SCR-004` | Statutory workbench | compliance workbench | required | reduced mobile | `PK-CONSOLE-01` | `COND-PERIOD-LOCKED`, `COND-FILING-DUE`, `COND-AMENDMENT` | `Ready` |
| `PAY-SCR-005` | Compliance calendar | calendar dashboard | required | required | `PK-DASH-01` | `COND-OVERDUE`, `COND-UPCOMING`, `COND-FILED` | `Ready` |
| `PAY-SCR-006` | Retro and settlement workspace | financial workspace | required | reduced mobile | `PK-QUEUE-01` | `COND-RETRO-IMPACT`, `COND-FNF`, `COND-APPROVAL-HOLD` | `Ready` |
| `WRK-SCR-001` | Attendance workbench | operational workbench | required | required | `PK-QUEUE-01` | `COND-MISSING-PUNCH`, `COND-REGULARIZATION`, `COND-DEVICE-MISMATCH` | `Ready` |
| `WRK-SCR-002` | Shift management screen | scheduling screen | required | required | `PK-WIZARD-01` | `COND-ROTATION`, `COND-CONFLICT`, `COND-OVERRIDE` | `Ready` |
| `WRK-SCR-003` | Rostering screen | planner | required | required | `PK-CONSOLE-01` | `COND-UNDER-STAFFED`, `COND-OVERTIME-RISK`, `COND-HOLIDAY-COVERAGE` | `Ready` |
| `WRK-SCR-004` | Timesheet workbench | workbench | required | required | `PK-QUEUE-01` | `COND-SUBMITTED`, `COND-RETURNED`, `COND-BILLABLE-CONFLICT` | `Ready` |
| `LEV-SCR-001` | Leave policy workspace | policy console | required | reduced mobile | `PK-CONSOLE-01` | `COND-ACCRUAL-RULE`, `COND-CARRY-FORWARD`, `COND-SANDWICH-RULE` | `Ready` |
| `LEV-SCR-002` | Leave approval queue | queue | required | required | `PK-QUEUE-01` | `COND-BLACKOUT-PERIOD`, `COND-BALANCE-EXCEPTION`, `COND-TEAM-CONFLICT` | `Ready` |
| `LEV-SCR-003` | Team leave planning view | planning dashboard | required | required | `PK-DASH-01` | `COND-CAPACITY-RISK`, `COND-FESTIVE-SEASON`, `COND-PROJECT-BLACKOUT` | `Ready` |
| `DOC-SCR-001` | Document repository and profile view | repository | required | required | `PK-PROFILE-01` | `COND-VERSION-COMPARE`, `COND-SIGNATURE-PENDING`, `COND-RESTRICTED-DOWNLOAD` | `Ready` |
| `DOC-SCR-002` | Document signing and acknowledgment flow | flow | required | required | `PK-WIZARD-01` | `COND-OTP-VERIFY`, `COND-SIGNATURE-FAILED`, `COND-EXPIRED-LINK` | `Ready` |
| `AST-SCR-001` | Asset assignment and return view | operational workspace | required | required | `PK-QUEUE-01` | `COND-RETURN-OVERDUE`, `COND-DAMAGE-REPORTED`, `COND-EXIT-CLEARANCE` | `Ready` |
| `HLP-SCR-001` | Helpdesk and case management workbench | case workbench | required | required | `PK-QUEUE-01` | `COND-SLA-BREACH`, `COND-ESCALATED`, `COND-CONFIDENTIAL-CASE` | `Ready` |
| `CTR-SCR-001` | Contractor workforce workbench | workforce workbench | required | required | `PK-QUEUE-01` | `COND-DOC-EXPIRED`, `COND-ACCESS-BLOCKED`, `COND-VENDOR-HOLD` | `Ready` |
| `HSW-SCR-001` | Health, safety, and incident workspace | incident workspace | required | required | `PK-QUEUE-01` | `COND-INCIDENT-OPEN`, `COND-MEDICAL-HOLD`, `COND-INVESTIGATION` | `Ready` |

# 8. Wave 5 Leadership, Analytics, and Intelligence Screens

| Ref | Screen Name | Family | Desktop | Mobile | Variant Pack | Extra Condition Variants | Current Status |
|---|---|---|---|---|---|---|---|
| `ANL-SCR-001` | Executive dashboard | analytics dashboard | required | required | `PK-ANALYTICS-01` | `COND-CROSS-FILTER`, `COND-NO-DATA`, `COND-EXPORT` | `Ready` |
| `ANL-SCR-002` | Workforce analytics | analytics workspace | required | reduced mobile | `PK-ANALYTICS-01` | `COND-SEGMENT-COMPARE`, `COND-DRILL-DOWN`, `COND-SAVED-VIEW` | `Ready` |
| `ANL-SCR-003` | Attrition analytics | analytics workspace | required | reduced mobile | `PK-ANALYTICS-01` | `COND-PREDICTIVE-RISK`, `COND-SEGMENT-OUTLIER`, `COND-LOW-CONFIDENCE` | `Ready` |
| `ANL-SCR-004` | Custom reporting | report builder | required | reduced mobile | `PK-BUILDER-01` | `COND-SCHEDULED-REPORT`, `COND-ACCESS-RESTRICTED-FIELD`, `COND-EMPTY-DATASET` | `Ready` |
| `ANL-SCR-005` | Predictive insight views | insight dashboard | required | required | `PK-ANALYTICS-01` | `COND-MODEL-LOW-CONFIDENCE`, `COND-RECOMMENDATION`, `COND-POLICY-WARNING` | `Ready` |

# 9. Production Rule

No screen should be considered mockup-complete until:

1. default desktop view exists
2. default mobile view exists or a documented desktop-only exception is accepted
3. all required family-level variants are covered
4. all listed condition-specific variants are covered either as separate mockups or as approved annotation overlays
