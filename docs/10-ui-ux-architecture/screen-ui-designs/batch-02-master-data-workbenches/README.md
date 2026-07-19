---
id: HRMS-UI-B02
title: Batch 02 Master Data Workbench Designs
document: screen-ui-designs/batch-02-master-data-workbenches/README.md
version: 1.1
status: In Progress
---

# 1. Purpose

This folder stores the second final Screen UI design batch for the Enterprise HRMS application.

Batch `02` focuses on the `MD-02` family because it is the highest-reuse screen template group after the role-based workspace masters.

# 2. Why This Batch Is Next

`MD-02` is the strongest downstream leverage point in the current screen system.

It is used by:

- HR core operations
- people administration
- recruitment
- payroll
- workforce operations
- shared repository-style operational screens

This makes it the right next family to convert after the workspace-home templates are locked.

# 3. Batch Scope

This batch establishes the final visual language for list-plus-detail operational workbenches.

Primary screens selected for the first conversion wave in this family:

1. `HRO-SCR-001` Employee master workbench
2. `PEO-SCR-002` Employment details workspace
3. `REC-SCR-001` Requisition workbench
4. `PAY-SCR-002` Payroll run details
5. `WRK-SCR-001` Attendance workbench

These five screens were chosen because together they define the main `MD-02` usage modes:

- employee and workforce master records
- effective-dated detail maintenance
- recruitment operations workbench
- payroll-run operational drill-down
- attendance exception and review workbench

# 4. Asset Naming

Use this naming format for generated boards:

- `hro-scr-001-employee-master-workbench-desktop-final.png`
- `hro-scr-001-employee-master-workbench-mobile-final.png`
- `peo-scr-002-employment-details-workspace-desktop-final.png`
- `peo-scr-002-employment-details-workspace-mobile-final.png`
- `rec-scr-001-requisition-workbench-desktop-final.png`
- `rec-scr-001-requisition-workbench-mobile-final.png`
- `pay-scr-002-payroll-run-details-desktop-final.png`
- `pay-scr-002-payroll-run-details-mobile-final.png`
- `wrk-scr-001-attendance-workbench-desktop-final.png`
- `wrk-scr-001-attendance-workbench-mobile-final.png`

# 5. Design Rules For This Family

Every `MD-02` board should preserve the same structural model:

- search, filter, and command header
- KPI or status summary strip
- left list or queue zone
- main detail workspace
- right action or insight rail when needed
- timeline, audit, or recent activity context

The final UI pass should differentiate the workbench by domain without breaking the shared pattern.

Domain-specific variation should happen through:

- data density
- card emphasis
- action labels
- risk indicators
- contextual right-rail content

# 6. Generated Assets

Current boards in this batch:

- [hro-scr-001-employee-master-workbench-desktop-final.png](D:/HRMS-doc/docs/10-ui-ux-architecture/screen-ui-designs/batch-02-master-data-workbenches/hro-scr-001-employee-master-workbench-desktop-final.png)
- [hro-scr-001-employee-master-workbench-mobile-final.png](D:/HRMS-doc/docs/10-ui-ux-architecture/screen-ui-designs/batch-02-master-data-workbenches/hro-scr-001-employee-master-workbench-mobile-final.png)

# 7. Status

| Screen | Status |
|---|---|
| `HRO-SCR-001` | `Master Board Ready` |
| `PEO-SCR-002` | `Pending` |
| `REC-SCR-001` | `Pending` |
| `PAY-SCR-002` | `Pending` |
| `WRK-SCR-001` | `Pending` |

# 8. Notes

This batch should create both desktop and mobile final boards for each selected screen.

Once these five screens are complete, the remaining `MD-02` screens can be converted faster by reusing the stabilized workbench language.
