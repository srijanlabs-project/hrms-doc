---
id: HRMS-UI-B04
title: Batch 04 Payroll And Workforce Final UI Boards
version: 1.0
status: Rebuilt - Design Ready
---

# Purpose

This batch converts the approved Payroll and Workforce Operations screen-definition mockups into final Staffsy UI design boards.

The boards preserve the source workflow and compliance intent while adding final visual hierarchy, Staffsy tokens, operational data density, action emphasis, responsive behavior, and design annotation guidance.

# Screen Coverage

| Ref | Screen | Desktop | Mobile | Status |
|---|---|---|---|---|
| `PAY-SCR-002` | Payroll Run Details | Ready | Ready | `Design Ready` |
| `PAY-SCR-003` | Payroll Validation Queue | Ready | Ready | `Design Ready` |
| `PAY-SCR-004` | Statutory Workbench | Ready | Ready | `Design Ready` |
| `PAY-SCR-005` | Compliance Calendar | Ready | Ready | `Design Ready` |
| `PAY-SCR-006` | Retro and Settlement Workspace | Ready | Ready | `Design Ready` |
| `WRK-SCR-001` | Attendance Control Center | Ready | Ready | `Design Ready` |
| `WRK-SCR-002` | Shift Management | Ready | Ready | `Design Ready` |
| `WRK-SCR-003` | Rostering Screen | Ready | Ready | `Design Ready` |
| `WRK-SCR-004` | Timesheet Workbench | Ready | Ready | `Design Ready` |
| `WRK-SCR-005` | Overtime and Comp-off Console | Ready | Ready | `Design Ready` |

# Generated Assets

Each ref has one desktop presentation board at `1536 x 1024` and one mobile presentation board at `1024 x 1536`. The product viewport inside the board is documented as `1440 x 900` desktop and `390 x 844` mobile.

- `pay-scr-002-payroll-run-details-desktop-final.png`
- `pay-scr-002-payroll-run-details-mobile-final.png`
- `pay-scr-003-validation-queue-desktop-final.png`
- `pay-scr-003-validation-queue-mobile-final.png`
- `pay-scr-004-statutory-workbench-desktop-final.png`
- `pay-scr-004-statutory-workbench-mobile-final.png`
- `pay-scr-005-compliance-calendar-desktop-final.png`
- `pay-scr-005-compliance-calendar-mobile-final.png`
- `pay-scr-006-retro-and-settlement-workspace-desktop-final.png`
- `pay-scr-006-retro-and-settlement-workspace-mobile-final.png`
- `wrk-scr-001-attendance-control-center-desktop-final.png`
- `wrk-scr-001-attendance-control-center-mobile-final.png`
- `wrk-scr-002-shift-management-desktop-final.png`
- `wrk-scr-002-shift-management-mobile-final.png`
- `wrk-scr-003-rostering-screen-desktop-final.png`
- `wrk-scr-003-rostering-screen-mobile-final.png`
- `wrk-scr-004-timesheet-workbench-desktop-final.png`
- `wrk-scr-004-timesheet-workbench-mobile-final.png`
- `wrk-scr-005-overtime-and-comp-off-console-desktop-final.png`
- `wrk-scr-005-overtime-and-comp-off-console-mobile-final.png`

# Design Rules Applied

- Payroll screens foreground period locks, exception severity, evidence, filing ownership, and idempotent release controls.
- Workforce screens foreground tenant-local time, attendance integrity, roster coverage, rest rules, overtime thresholds, and delegation.
- Desktop uses the shared operational workbench grid with KPI cards, data queue, selected-record context, downstream impact, and annotation rail.
- Mobile keeps the primary action, alert context, KPI cards, queue, selected record, and bottom navigation visible without shrinking desktop density into unreadable controls.
- Compliance and payroll states distinguish ready, review, pending, blocked, risk, and overdue conditions consistently.

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
