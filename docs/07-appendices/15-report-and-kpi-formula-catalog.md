---
id: HRMS-APP-15
title: Report and KPI Formula Catalog
document: 15-report-and-kpi-formula-catalog.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a seeded report and KPI formula catalog so product, analytics, engineering, QA, and business teams can align on metric meaning before dashboard and report implementation.

# 2. Scope Note

This `v1` catalog focuses on high-value platform and HRMS metrics that are frequently reused across dashboards and operational reports.

# 3. KPI and Formula Catalog

| KPI Ref | KPI Name | Domain | Formula Definition | Grain | Typical Filters | Primary Consumers | Notes |
|---|---|---|---|---|---|---|---|
| `KPI-001` | Active Tenants | platform and tenancy | count of tenants where lifecycle state = `active` | point-in-time | region, package, environment | platform admin, leadership | excludes suspended and archived tenants |
| `KPI-002` | Tenant Provisioning Cycle Time | platform and tenancy | average activation timestamp minus tenant creation timestamp | per tenant, averaged | region, implementation partner | platform ops, implementation lead | use business-hour variant if agreed later |
| `KPI-003` | Config Publish Failure Rate | platform operations | failed config publish attempts / total config publish attempts | period | tenant, environment, module | platform admin, support | high-risk indicator for control-plane stability |
| `KPI-004` | Employee Master Completeness | people management | employees with all mandatory master fields complete / total active employees | point-in-time | legal entity, location, worker type | HR admin, implementation | mandatory field set must be version-controlled |
| `KPI-005` | Joiners Count | people management | count of employees with start date in selected period | period | legal entity, department, location | HR, leadership | define timezone and effective-date rules consistently |
| `KPI-006` | Leavers Count | people management | count of employees with separation effective date in selected period | period | exit type, legal entity, department | HR, leadership | align with attrition denominator rules |
| `KPI-007` | Requisition Approval Turnaround | recruitment | average approved timestamp minus submitted timestamp for requisitions | per requisition, averaged | business unit, recruiter, location | recruiter, HR, leadership | paused `On Hold` time may need separate treatment |
| `KPI-008` | Open Requisition Aging | recruitment | current date minus requisition published date for open requisitions | per requisition | department, recruiter, role family | recruiter, hiring manager | report as buckets and average |
| `KPI-009` | Offer Acceptance Rate | recruitment | accepted offers / total offers issued in period | period | recruiter, location, role level | recruiting leadership | define withdrawn offers treatment explicitly |
| `KPI-010` | Leave Approval Turnaround | leave | average approval timestamp minus leave submission timestamp | per leave request, averaged | leave type, department, manager | manager, HR admin | sent-back cycles may be measured separately |
| `KPI-011` | Leave Rejection Rate | leave | rejected leave requests / total submitted leave requests | period | leave type, location, manager | HR, managers | can indicate policy or capacity issues |
| `KPI-012` | Attendance Exception Rate | workforce time | attendance records flagged for correction or exception / total attendance records | period | location, shift, manager | workforce admin, payroll | define what counts as exception in policy |
| `KPI-013` | Payroll Validation Exception Rate | payroll | payroll validation exceptions / total payroll subjects processed | payroll run or period | legal entity, payroll group | payroll admin, finance | high-severity variant may need separate KPI |
| `KPI-014` | Payroll Finalization Cycle Time | payroll | payroll finalization timestamp minus payroll run creation timestamp | per run | payroll group, legal entity | payroll admin, finance | useful for close planning |
| `KPI-015` | Digital Signature Completion Rate | documents | completed signature requests / total sent signature requests | period | document type, tenant, signer group | HR admin, legal ops | expired and declined requests should remain in denominator unless policy differs |
| `KPI-016` | Workflow SLA Breach Rate | workflow | workflow tasks breached SLA / total workflow tasks created | period | workflow type, module, approver group | platform admin, org admin, operations | depends on normalized SLA definitions |
| `KPI-017` | Notification Delivery Failure Rate | notifications | failed notification dispatches / total dispatch attempts | period | channel, template, tenant | platform ops, comms admin | retries should be counted consistently |
| `KPI-018` | Audit Export Requests | security and governance | count of audit export requests raised in period | period | tenant, actor role, reason | security admin, auditors | pair with approval and completion rates |
| `KPI-019` | Support Session Count | support governance | count of support sessions opened in selected period | period | tenant, reason, support team | security admin, customer success | privacy-sensitive operational metric |
| `KPI-020` | Support Session Approval Lead Time | support governance | average support session approval timestamp minus request timestamp | period | tenant, severity, support reason | security admin, support lead | useful for balancing trust and responsiveness |

# 4. Seed Report Inventory

| Report Ref | Report Name | Primary KPI or Output | Domain | Typical Consumers |
|---|---|---|---|---|
| `RPT-001` | Tenant Inventory Report | tenant lifecycle counts and statuses | platform and tenancy | platform admin, leadership |
| `RPT-002` | Workforce Master Register | employee and contractor population details | people management | HR admin, implementation |
| `RPT-003` | Joiners and Leavers Report | joiner and leaver counts plus detail rows | people management | HR, leadership |
| `RPT-004` | Requisition Aging Report | open requisition aging buckets | recruitment | recruiter, HR leadership |
| `RPT-005` | Leave Approval Aging Report | leave request turnaround and backlog | leave | managers, HR admin |
| `RPT-006` | Payroll Validation Exceptions Report | payroll exception summary and details | payroll | payroll admin, finance |
| `RPT-007` | Document Signature Status Report | signature lifecycle by document type | document management | HR admin, legal ops |
| `RPT-008` | Access Review and Audit Export Report | privileged governance activity | security and governance | security admin, auditors |

# 5. Engineering Rules

- every dashboard widget should reference a `KPI Ref` or `Report Ref`
- numerator, denominator, excluded states, and date logic should be explicit before implementation
- the same KPI should not have multiple formulas across reports unless intentionally versioned

# 6. Immediate Follow-On Use

This catalog should feed:

- dashboard story breakdown
- semantic-layer design
- QA metric validation
- executive-report definition
