---
id: HRMS-UX-CGPT-TPL-INDEX
title: Staffsy Screen UI Template Registry and Board Index (cgpt/templates)
document: README.md
version: 2.0
status: Draft
---

# 1. Purpose

This document is the working registry for the Staffsy desktop screen-UI templates and the index of design-board assets in this folder. It reconciles three sources:

1. The **canonical template registry** (T-001 to T-024) supplied by the product owner
2. The **board assets** actually present in this folder (`T001.png` … `T024.png`, `T00n.png`, mobile boards)
3. The **abstract template families** (`WS/DB/MD/TX/AD/UT`) defined in [20-screen-template-architecture-and-conversion-model.md](../../../20-screen-template-architecture-and-conversion-model.md)

> **Mapping rule (per product owner):** `T001` and `T-001` are the same identifier, and where the registry and the board assets disagree on a number, **content wins over numbering**. Templates are matched to files by what the board actually is, not by filename. Section 4 gives the content-keyed reconciliation; T-numbers in the range 010–018 are ambiguous between two generations and should not be used alone as references — always pair number with template name.

# 2. Canonical Template Registry (Authoritative)

| Template | Template Name | Primary Purpose | Modules Covered | Doc-20 Family |
|---|---|---|---|---|
| **T-001** | My Staffsy Workspace | Employee landing dashboard | Employee Home, ESS, Personal Dashboard | `WS-01` |
| **T-002** | Operational Command Center | HR & Operations dashboard | HR Dashboard, Operations, Executive Operations | `DB-01` / `WS-03` |
| **T-003** | Enterprise Workbench | Master list + filters + right drawer | Employees, Departments, Assets, Contractors, Organization, Documents | `MD-01` / `MD-02` |
| **T-004** | 360° Workspace | Complete entity profile | Employee 360, Asset 360, Department 360, Candidate 360, Vendor 360 | `MD-04` |
| **T-005** | Smart Form Workspace | Forms & data entry | Leave, Travel, Expense, Recruitment Forms, Employee Forms | `TX-02` / `MD-03` |
| **T-006** | Mass Operations Workspace | Bulk actions & processing | Bulk Upload, Payroll Processing, Imports, Batch Updates | `UT-05` |
| **T-007** | Approval Workspace | Approval workflows | Leave Approval, Expense Approval, Recruitment Approval, Purchase Approval | `TX-01` |
| **T-008** | Calendar & Attendance Workspace | Calendar-centric views | Attendance, Shift Planning, Leave Calendar, Holiday Calendar | `TX-04` / `TX-03` |
| **T-009** | Analytics Workspace | Operational analytics | Workforce Analytics, Attendance Analytics, Recruitment Analytics | `DB-02` |
| **T-010** | Executive Dashboard | Leadership overview | CEO Dashboard, CHRO Dashboard, Business Dashboards | `WS-06` / `DB-04` |
| **T-011** | AI Workspace | AI Copilot & Insights | Ridz AI, AI Recommendations, AI Search, AI Assistant | `DB-03` |
| **T-012** | Repository Workspace | File & document management | Policies, Employee Documents, Knowledge Base | `MD-04` (document profile) |
| **T-013** | Timeline Workspace | Activity history | Audit Logs, Employee Timeline, Workflow History | `MD-05` |
| **T-014** | Configuration Console | Administration & settings | System Configuration, IAM, Workflow Builder, Roles & Permissions | `AD-01` / `AD-02` / `AD-03` |
| **T-015** | Communication Hub | Collaboration | Announcements, Surveys, Recognition, Messaging | `UT-01` + comms surfaces |
| **T-016** | Organization Explorer | Organization structure | Org Chart, Departments, Reporting Hierarchy | `MD-02` (org) |
| **T-017** | Reports & Insights Workspace | Reports & exports | Standard Reports, BI Reports, Scheduled Reports | `DB-02` |
| **T-018** | Help & Support Workspace | User assistance | Help Center, Support, FAQs, Knowledge Articles | `UT-02` |
| **T-019** | Experience Studio | Employee engagement | Journeys, Onboarding, Engagement, Pulse Surveys | `WS-07` (experience) |
| **T-020** | Reports Hub | Central reporting portal | Cross-module Reporting, Dashboards, Report Library | `DB-02` |
| **T-021** | Compensation Planning Workspace | Compensation planning | Salary Planning, Merit Cycles, Bonus Planning, Budget Allocation | `WS-07` / `DB-04` |
| **T-022** | Workforce Planning Workspace | Workforce forecasting | Headcount Planning, Capacity Planning, Scenario Modeling | `WS-07` / `DB-04` |
| **T-023** | Integration Console | Integrations | APIs, Connectors, Sync Status, Integration Monitoring | `AD-04` |
| **T-024** | Health & Safety Workspace | HSE operations | Incident Reporting, Safety Inspections, Compliance, Risk Management | `WS-07` (HSE) |

# 3. Module → Template Mapping (Authoritative)

| Module | Primary Template |
|---|---|
| Dashboard / Home | **T-001** |
| HR Operations | **T-002** |
| Employee Directory | **T-003** |
| Organization | **T-003**, **T-016** |
| Employee 360 | **T-004** |
| Assets | **T-003**, **T-004** |
| Contractors | **T-003**, **T-004** |
| Leave | **T-005**, **T-007**, **T-008** |
| Attendance | **T-008** |
| Payroll | **T-006**, **T-017**, **T-021** |
| Compensation | **T-021** |
| Recruitment | **T-005**, **T-007**, **T-004** |
| Performance | **T-004**, **T-015**, **T-017** |
| Learning | **T-004**, **T-015** |
| Employee Experience | **T-019** |
| Travel | **T-005**, **T-007** |
| Expense | **T-005**, **T-007** |
| Documents | **T-012** |
| Analytics | **T-009**, **T-020** |
| Reports | **T-017**, **T-020** |
| AI | **T-011** |
| Administration | **T-014** |
| IAM | **T-014** |
| Integrations | **T-023** |
| Workforce Planning | **T-022** |
| Health & Safety | **T-024** |
| Help & Support | **T-018** |
| Communications | **T-015** |

# 4. Content-Keyed Board Reconciliation (Template Name → File)

Registry templates matched to board files **by content**:

| Registry Template | File With That Content | Status |
|---|---|---|
| My Staffsy Workspace | `T001.png` | ✅ Done |
| Operational Command Center | `T002.png` | ✅ Done |
| Enterprise Workbench | `T003.png` | ✅ Done |
| 360° Workspace | `T004.png` | ✅ Done |
| Smart Form Workspace | `T005.png` | ✅ Done |
| Mass Operations Workspace | `T006.png` | ✅ Done |
| Approval Workspace | `T007.png` | ✅ Done |
| Calendar & Attendance Workspace | `T008.png` | ✅ Done |
| Analytics Workspace | `T009.png` | ✅ Done |
| Executive Dashboard | `T00n.png` (composite panel only) | ⚠️ Needs standalone export |
| AI Workspace | `T00n.png` (composite panel only) | ⚠️ Needs standalone export |
| Repository Workspace | — | ❌ Not designed yet |
| Timeline Workspace | — | ❌ Not designed yet |
| Configuration Console | — | ❌ Not designed yet |
| Communication Hub | — | ❌ Not designed yet |
| Organization Explorer | — | ❌ Not designed yet |
| Reports & Insights Workspace | — (seed from `T020.png`) | ❌ Not designed yet |
| Help & Support Workspace | — | ❌ Not designed yet |
| Experience Studio | `T019.png` | ✅ Done |
| Reports Hub | `T020.png` | ✅ Done |
| Compensation Planning Workspace | `T021.png` | ✅ Done |
| Workforce Planning Workspace | `T022.png` | ✅ Done |
| Integration Console | `T023.png` | ✅ Done |
| Health & Safety Workspace | `T024.png` | ✅ Done |

Boards on disk that are **not in the 24-template registry** — finished module-workspace compositions (a canonical template applied to one module). They keep their files as-is and serve as per-module reference designs:

| File | Board Title on Asset | Composition Of (Registry Templates) |
|---|---|---|
| `T010.png` | Employee Profile Workspace | 360° Workspace (Employee 360 instance) |
| `T011.png` | Leave Management Workspace | Calendar & Attendance + Approval Workspace (Leave module) |
| `T012.png` | Staff Management Workspace | Enterprise Workbench (Employee Directory instance) |
| `T013.png` | Dashboard Workspace | Operational Command Center (HR dashboard variant) |
| `T014.png` | Recruitment Workspace | Command Center + Workbench + Approval (Recruitment module) |
| `T015.png` | Performance Workspace | Command Center + Analytics (Performance module) |
| `T016.png` | Payroll Workspace | Command Center + Mass Operations (Payroll module) |
| `T017.png` | Attendance Workspace | Calendar & Attendance + Analytics (Attendance module) |
| `T018.png` | Leave Workspace | Calendar & Attendance (Leave module, variant of `T011.png`) |

Composite and mobile assets:

| File | Contents | Status |
|---|---|---|
| `T00n.png` | 4-up composite: T-008 Calendar & Attendance, T-009 Analytics, **T-010 Executive & Leadership Dashboard**, **T-011 AI Workspace** — canonical numbering | Only existing renders of canonical T-010 and T-011; standalone exports needed |
| `m01.png` | T-022 Workforce Planning (Mobile), variant 1 | Mobile board |
| `m-A.png` | T-022 Workforce Planning (Mobile), variant 2 | Mobile board |
| `mobile-1.png` | 4-up mobile composite: T-021, T-022, T-023, T-024 | Mobile boards |

# 5. Production Status Summary

**15 of 24 registry templates have finished standalone desktop boards; 2 (Executive Dashboard, AI Workspace) exist only inside the `T00n.png` composite; 7 are not yet designed.** In addition, 9 finished module-workspace boards exist beyond the registry set.

Recommended production order for the missing seven, driven by the delivery-wave plan:

1. **Configuration Console** — blocks Wave 0 admin, IAM, and workflow-builder screens
2. **Organization Explorer** — blocks Wave 1 organization management (org-chart pattern exists in no current board)
3. **Timeline Workspace** — pattern partially derivable from the 360°/Employee Profile boards
4. **Repository Workspace**
5. **Reports & Insights Workspace** — seed from the Reports Hub board
6. **Help & Support Workspace**
7. **Communication Hub**

Plus two quick wins: standalone exports of **Executive Dashboard** and **AI Workspace** from the composite.

# 6. Shared Board Specifications (extracted from the assets)

All boards consistently declare the following, usable directly as design tokens:

- Container width `1440px` max, 12-column grid, 24px gutter, fluid content area
- Sidebar `240px` fixed; right panel `320–420px` where present
- Spacing scale 8px base; card radius `12px`; soft shadow elevations (0, 2, 8) / (0, 4, 12)
- Font family Inter; heading SemiBold/Bold; base/body size `14px`
- Colors: primary `#0F766E` (some newer boards `#0F6B55`/`#0F6B68` — normalize before build), text `#1F2937`, accent `#F97316`, border `#E5E7EB`, background `#F8FAFC`, surface `#FFFFFF`
- Responsive: desktop 1440px+ full layout; laptop/tablet collapse right panel then sidebar; mobile (<768–1024px per board) single column with top nav / bottom tab bar
