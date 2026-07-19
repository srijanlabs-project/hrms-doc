---
id: HRMS-UI-B03
title: Batch 03 People Record And Recruitment Final UI Boards
version: 1.0
status: Rebuilt - Design Ready
---

# Purpose

This batch converts the approved People Record and Recruitment screen-definition mockups into final Staffsy UI design boards.

The source SVG mockups remain the structural truth. These PNG boards add the final visual hierarchy, Staffsy tokens, operational content density, responsive behavior, action emphasis, and design annotation layer needed for designer and frontend handoff.

# Screen Coverage

| Ref | Screen | Desktop | Mobile | Status |
|---|---|---|---|---|
| `PEO-SCR-002` | Employment Details Workspace | Ready | Ready | `Design Ready` |
| `PEO-SCR-003` | Identity and Compliance Panel | Ready | Ready | `Design Ready` |
| `PEO-SCR-004` | Bank and Tax Maintenance | Ready | Ready | `Design Ready` |
| `PEO-SCR-005` | Documents Center | Ready | Ready | `Design Ready` |
| `PEO-SCR-006` | Employee Timeline | Ready | Ready | `Design Ready` |
| `PEO-SCR-007` | Lifecycle Action Wizard | Ready | Ready | `Design Ready` |
| `REC-SCR-001` | Requisition Workbench | Ready | Ready | `Design Ready` |
| `REC-SCR-002` | Candidate Pipeline Board | Ready | Ready | `Design Ready` |
| `REC-SCR-003` | Candidate Profile | Ready | Ready | `Design Ready` |
| `REC-SCR-004` | Interview Scheduler | Ready | Ready | `Design Ready` |

# Generated Assets

Each ref has one desktop presentation board at `1536 x 1024` and one mobile presentation board at `1024 x 1536`. The product viewport inside the board is documented as `1440 x 900` desktop and `390 x 844` mobile.

- `peo-scr-002-employment-details-workspace-desktop-final.png`
- `peo-scr-002-employment-details-workspace-mobile-final.png`
- `peo-scr-003-identity-and-compliance-panel-desktop-final.png`
- `peo-scr-003-identity-and-compliance-panel-mobile-final.png`
- `peo-scr-004-bank-and-tax-maintenance-desktop-final.png`
- `peo-scr-004-bank-and-tax-maintenance-mobile-final.png`
- `peo-scr-005-documents-center-desktop-final.png`
- `peo-scr-005-documents-center-mobile-final.png`
- `peo-scr-006-employee-timeline-desktop-final.png`
- `peo-scr-006-employee-timeline-mobile-final.png`
- `peo-scr-007-lifecycle-action-wizard-desktop-final.png`
- `peo-scr-007-lifecycle-action-wizard-mobile-final.png`
- `rec-scr-001-requisition-workbench-desktop-final.png`
- `rec-scr-001-requisition-workbench-mobile-final.png`
- `rec-scr-002-candidate-pipeline-board-desktop-final.png`
- `rec-scr-002-candidate-pipeline-board-mobile-final.png`
- `rec-scr-003-candidate-profile-desktop-final.png`
- `rec-scr-003-candidate-profile-mobile-final.png`
- `rec-scr-004-interview-scheduler-desktop-final.png`
- `rec-scr-004-interview-scheduler-mobile-final.png`

# Design Rules Applied

- Desktop uses the shared Staffsy global header, dark role navigation, operational workbench grid, KPI strip, detail context, and annotation rail.
- Mobile keeps the title, primary action, search, KPI cards, main work queue, selected record, and bottom navigation in the first viewport.
- Sensitive identity, compliance, compensation, and candidate data is shown with privacy-aware labels and governed actions.
- Workflow impact, approval ownership, effective dates, and audit context remain explicit.
- All screens use the same template-driven rhythm while varying content by People Record or Recruitment responsibility.

# Source References

- Source mockups: `docs/10-ui-ux-architecture/mockups/`
- Design system: `docs/design system/`
- Template model: `docs/10-ui-ux-architecture/20-screen-template-architecture-and-conversion-model.md`
- Batch assignment: `docs/10-ui-ux-architecture/23-screen-ui-template-conversion-batches.md`

# Visual QA Gate

- Primary actions use `primary-600` teal only.
- AI badges and AI actions use the approved orange accent only.
- Purple is not used for buttons; visualization-only purple remains outside the action system.
- Left navigation uses outline-first icons with consistent stroke weight.
- Typography follows the documented Inter hierarchy; the generated PNG renderer uses the documented `Segoe UI` fallback because an Inter font asset is not installed locally.
- Desktop and mobile retain the same hierarchy while reducing density on mobile.
- The board frame, global header, product shell, icon rail, annotation rail, and footer are shared with the approved Batch 01/02 visual masters.
