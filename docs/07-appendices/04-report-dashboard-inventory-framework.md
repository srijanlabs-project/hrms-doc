---
id: HRMS-APP-04
title: Report Dashboard and KPI Index
document: 04-report-dashboard-inventory-framework.md
version: 2.0
status: Draft
---

# 1. Purpose

This appendix acts as the master index for reports, dashboards, and KPI formulas across the Enterprise HRMS platform.

# 2. Primary Detailed Reference

- [15-report-and-kpi-formula-catalog.md](D:/HRMS-doc/docs/07-appendices/15-report-and-kpi-formula-catalog.md)

# 3. Seed Reporting Domains

| Domain Ref | Reporting Domain | Typical Consumers | Typical Output Types |
|---|---|---|---|
| `RPT-DOM-001` | Platform and tenancy | platform admin, ops, support | health dashboard, provisioning report, quota report |
| `RPT-DOM-002` | Organization and workforce master | HR admin, org admin, implementation | workforce register, joiners and leavers, completeness reports |
| `RPT-DOM-003` | Recruitment and talent | recruiter, hiring manager, leadership | pipeline dashboard, requisition aging, offer conversion |
| `RPT-DOM-004` | Time and leave | manager, HR, payroll | leave approval aging, absenteeism, balance reports |
| `RPT-DOM-005` | Payroll and compliance | payroll admin, finance, auditors | payroll status dashboard, exception reports, statutory outputs |
| `RPT-DOM-006` | Security and governance | security admin, privacy lead, auditors | access review dashboard, audit exports, retention views |

# 4. Usage Rules

- every KPI used on a dashboard should reference a named formula entry
- report labels should not be treated as the source of truth for metric logic
- dashboard widgets and downloadable reports should share the same KPI definition where the metric is intended to match
