---
id: HRMS-UI-B04-V2
title: Batch 04 Payroll And Workforce Replacement UI Boards
version: 2.0
status: Pilot - Batch 2 master alignment review
---

# Purpose

This is the replacement design series for Batch 04. It is intentionally separate from the deprecated Batch 04 assets so the old boards can be removed without affecting the new source of truth.

The replacement series uses `HRO-SCR-001 Employee Master Workbench` as the desktop workbench master. Module-specific content remains statutory, payroll, attendance, rostering, or workforce content; the global shell and workbench anatomy are shared.

# Pilot Screen

| Ref | Screen | Desktop | Mobile | Status |
|---|---|---|---|---|
| `PAY-SCR-004` | Statutory Workbench | Ready for review | Ready for review | `Pilot` |

# Canonical Structure

- HRO-style global header with role, alerts, tasks, and design-system controls
- Dark-teal enterprise navigation rail with module-specific links
- Inner search/action toolbar with primary action, review action, notification, message, and help controls
- Operational action band
- Five KPI cards
- Dense workbench grid and selected-record profile split
- Lower operational queues and audit timeline
- Lens strip and right-side annotations/principles
- Batch 2 desktop presentation-board dimensions: `1536 x 1024`

# Source References

- Canonical master: `../batch-02-master-data-workbenches/hro-scr-001-employee-master-workbench-desktop-final.png`
- Source mockup pair: `docs/10-ui-ux-architecture/mockups/pay-scr-004-statutory-workbench-desktop.svg` and `...-mobile.svg`
- Replacement renderer: `tools/generate_batch2_replacement_pilot.py`
