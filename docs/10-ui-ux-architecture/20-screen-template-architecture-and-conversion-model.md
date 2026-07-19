---
id: HRMS-UX-020
title: Screen Template Architecture And Conversion Model
document: 20-screen-template-architecture-and-conversion-model.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines how the Enterprise HRMS screen library should be converted from structural mockups into final screen design boards and later into frontend-ready UI.

It exists to prevent the team from treating every screen as a one-off design exercise.

The operating assumption is:

- the repository already contains nearly `180` mockup assets
- these assets are screen-definition artifacts, not final design outputs
- the final design program must be executed through reusable templates

# 2. What This Document Solves

This model answers five questions:

1. what are the major reusable screen templates
2. how should the existing mockups be grouped for conversion
3. which templates belong to which personas and work contexts
4. how should the mockup agent and final-design agent hand work to each other
5. what is the minimum definition of a screen that is ready for frontend build

# 3. Core Principle

The team should not design `180` separate screens from scratch.

The team should instead:

1. define the template system
2. map every mockup to a template family
3. create master final-design references for each template family
4. derive module-specific screens from those masters
5. maintain consistency through tokens, components, annotations, and pattern rules

# 4. Input Reference

The user-provided starting list is useful and directionally correct:

- Workspace Templates
- Dashboard Templates
- Master Data Templates
- Transaction Templates
- Enterprise Components
- Administration
- Utility Templates

This list is adopted as the conceptual foundation.

It is normalized below into a delivery-ready template architecture that can be used by:

- mockup production
- final UI design
- frontend engineering
- QA
- product planning

# 5. Template Stack

The Enterprise HRMS template system should operate in four layers.

## 5.1 Experience Layer

This layer defines whose world the screen belongs to.

| Experience ID | Experience Template | Primary Users | Typical Modules |
|---|---|---|---|
| `EXP-01` | Employee Workspace | employee | self service, profile, payslips, leave, learning |
| `EXP-02` | Manager Workspace | people manager, approver | approvals, team dashboard, team leave, reviews |
| `EXP-03` | HR Workspace | HR ops, HRBP, recruiter, payroll admin | people operations, recruitment, payroll, compliance |
| `EXP-04` | Org Admin Workspace | org admin, tenant setup admin | org setup, configuration, policies, permissions |
| `EXP-05` | Platform Admin Workspace | SaaS platform admin, provider ops | platform setup, runtime health, policy, audit, support |
| `EXP-06` | Executive Workspace | business head, CHRO, CFO, leadership | workforce analytics, KPI, succession, strategic insights |
| `EXP-07` | Specialist Operations Workspace | scheduler, helpdesk agent, compliance lead, L&D admin | rostering, case management, audit, incident, learning operations |

## 5.2 Screen Pattern Layer

This layer defines the structural pattern of the screen.

| Pattern ID | Pattern Template | Purpose |
|---|---|---|
| `PAT-01` | Workspace Home | role-based landing surface with widgets, actions, and summaries |
| `PAT-02` | Operational Dashboard | action-heavy dashboard for queues, exceptions, and current workload |
| `PAT-03` | Analytics Dashboard | analysis-heavy dashboard with comparisons, trends, and drill-down |
| `PAT-04` | KPI Dashboard | executive summary board centered on scorecards and business metrics |
| `PAT-05` | AI Workspace | governed assistant, copilot, explainability, or AI action surface |
| `PAT-06` | Master List | dense list or registry view for entities and records |
| `PAT-07` | Master Detail | list plus detail pane or side-by-side inspection pattern |
| `PAT-08` | Create Edit Wizard | multi-step guided create, edit, import, or lifecycle flow |
| `PAT-09` | Profile Record | person, entity, or object profile with sections and tabs |
| `PAT-10` | Timeline Activity | chronological event, audit, lifecycle, or change-history surface |
| `PAT-11` | Approval Workspace | routed work queue with decision actions and policy context |
| `PAT-12` | Request Form | request initiation, submission, draft, and validation form pattern |
| `PAT-13` | Scheduler Calendar | shift, event, leave, interview, or schedule planning surface |
| `PAT-14` | Kanban Tracker | board-based work progression pattern |
| `PAT-15` | Workflow Tracker | workflow state, approvals, status, and progress monitoring pattern |
| `PAT-16` | Settings Console | settings, toggles, environment values, and scoped controls |
| `PAT-17` | Configuration Console | structured configuration catalog and value-resolution workbench |
| `PAT-18` | Roles and Permissions Workspace | role matrix, access rules, entitlements, and delegation pattern |
| `PAT-19` | Audit and Monitoring Console | event logs, runtime diagnostics, audit traces, evidence views |
| `PAT-20` | Global Utility Surface | notifications, support, contextual help, profile switch, command entry, and utility surfaces |
| `PAT-21` | Import Export Workbench | upload, preview, row validation, reconciliation, and export control |
| `PAT-22` | Builder Designer Canvas | form builder, document template builder, workflow builder, editor canvas |

## 5.3 Component Layer

This layer defines the reusable design system building blocks used inside templates.

| Component Group | Included Elements |
|---|---|
| `CMP-TABLE` | advanced table, inline filters, saved views, row actions, density modes |
| `CMP-SEARCH` | global search, contextual search, typed command, governed suggestions |
| `CMP-REPORT` | report layouts, drilldowns, export panels, saved reports |
| `CMP-CHART` | trend charts, distribution charts, cohort views, heatmaps |
| `CMP-ORG` | org chart, reporting line, hierarchy explorer |
| `CMP-AI` | assistant panel, recommendation card, explainability tray, command bar |
| `CMP-STATE` | empty state, error state, skeleton state, access denied, offline/degraded |
| `CMP-IMPORT` | template guidance, preview grid, row comments, error summary, commit confirm |
| `CMP-UTILITY` | notification tray, help drawer, side annotations, activity timeline |

## 5.4 Variant Layer

This layer defines state and condition changes.

It must remain aligned with:

- [14-screen-mockup-master-registry.md](D:/HRMS-doc/docs/10-ui-ux-architecture/14-screen-mockup-master-registry.md)
- [15-screen-variant-and-conditional-state-catalog.md](D:/HRMS-doc/docs/10-ui-ux-architecture/15-screen-variant-and-conditional-state-catalog.md)

Examples:

- overloaded approval queue
- read-only or masked data
- empty dashboard
- import row-error preview
- AI recommendation blocked by policy
- workflow draft versus published

# 6. Normalized Template Library

The final design program should use the following master template library.

## 6.1 Workspace Templates

These are the top-level role templates.

| Template ID | Template Name | Base Pattern |
|---|---|---|
| `WS-01` | My Staffsy | `PAT-01` |
| `WS-02` | Manager Workspace | `PAT-01` |
| `WS-03` | HR Workspace | `PAT-01` |
| `WS-04` | Org Admin Workspace | `PAT-02` |
| `WS-05` | Platform Admin Workspace | `PAT-02` |
| `WS-06` | Executive Workspace | `PAT-04` |
| `WS-07` | Specialist Operations Workspace | `PAT-02` |

## 6.2 Dashboard Templates

| Template ID | Template Name | Typical Use |
|---|---|---|
| `DB-01` | Operational Dashboard | approvals, queues, case handling, payroll run, attendance exceptions |
| `DB-02` | Analytics Dashboard | workforce analytics, talent analytics, compliance analytics |
| `DB-03` | AI Dashboard | copilot center, explainability center, AI recommendation board |
| `DB-04` | KPI Dashboard | leadership overview, strategic command center, cost and attrition scorecards |

## 6.3 Master Data Templates

| Template ID | Template Name | Typical Use |
|---|---|---|
| `MD-01` | Master List | org entities, policies, grades, leave types, banks, vendors |
| `MD-02` | Master Detail | employee master, requisition detail, asset assignment detail |
| `MD-03` | Create Edit Wizard | lifecycle change, import, requisition create, offer issue, policy setup |
| `MD-04` | Profile | employee, candidate, contractor, org unit, document profile |
| `MD-05` | Timeline | employee timeline, audit timeline, workflow journey, incident history |

## 6.4 Transaction Templates

| Template ID | Template Name | Typical Use |
|---|---|---|
| `TX-01` | Approval Workspace | manager approvals, HR approvals, access review decisions |
| `TX-02` | Request Form | leave, expense, travel, helpdesk, transfer, correction request |
| `TX-03` | Scheduler | interviews, shifts, meetings, onboarding plan |
| `TX-04` | Calendar | leave calendar, holiday calendar, learning calendar |
| `TX-05` | Kanban | hiring stages, case movement, onboarding tasks |
| `TX-06` | Workflow Tracker | application status, offer journey, approval route, case journey |

## 6.5 Administration Templates

| Template ID | Template Name | Typical Use |
|---|---|---|
| `AD-01` | Settings | system settings, user settings, policy settings |
| `AD-02` | Configuration | scoped config catalog, metadata, dynamic masters |
| `AD-03` | Roles and Permissions | access matrix, role designer, delegation rules |
| `AD-04` | Audit and Monitoring | audit explorer, runtime monitor, integration logs |
| `AD-05` | Builder and Designer Canvas | document template builder, form designer, report builder, advanced editor canvas |

## 6.6 Utility Templates

| Template ID | Template Name | Typical Use |
|---|---|---|
| `UT-01` | Notifications | notification center, alert center, inbox tray |
| `UT-02` | Help Center | helpdesk, knowledge support, case intake |
| `UT-03` | Empty State | no data, not configured, first-time setup |
| `UT-04` | Error State | permission error, failed load, degraded runtime, retry state |
| `UT-05` | Import Export | import preview, row validation, export queue |
| `UT-06` | Search and Command | global search, governed query entry, universal results, typed command execution |
| `UT-07` | Profile and Delegation Utility | user switch, delegation switch, session review, quick account context |

## 6.7 Enterprise Components

These are not standalone primary templates. They are embedded pattern accelerators.

| Component Template ID | Template Name |
|---|---|
| `EC-01` | Advanced Table |
| `EC-02` | Search Workspace |
| `EC-03` | Reports |
| `EC-04` | Charts |
| `EC-05` | Organization Chart |
| `EC-06` | AI Workspace |

# 7. Mapping the Existing Mockup Library

The current mockup repository should now be mapped in this way:

1. assign every mockup a primary `Experience ID`
2. assign every mockup a primary `Pattern ID`
3. assign every mockup a final-design `Template ID`
4. retain screen-specific condition packs from the mockup registry

Examples:

| Screen Ref | Experience | Pattern | Final Template |
|---|---|---|---|
| `EMP-SCR-001` | `EXP-01` | `PAT-01` | `WS-01` |
| `MGR-SCR-001` | `EXP-02` | `PAT-01` | `WS-02` |
| `HRO-SCR-001` | `EXP-03` | `PAT-07` | `MD-02` |
| `W0-SCR-018` | `EXP-04` | `PAT-02` | `WS-04` |
| `W0-SCR-001` | `EXP-05` | `PAT-02` | `WS-05` |
| `ANL-SCR-001` | `EXP-06` | `PAT-03` | `DB-02` |
| `HLP-SCR-001` | `EXP-07` | `PAT-02` | `WS-07` |
| `W0-SCR-026` | `EXP-04` or `EXP-05` | `PAT-21` | `UT-05` |
| `PEO-SCR-001` | `EXP-03` | `PAT-09` | `MD-04` |
| `PEO-SCR-006` | `EXP-03` | `PAT-10` | `MD-05` |

The exhaustive assignment matrix now lives in:

- [21-screen-template-assignment-matrix.md](D:/HRMS-doc/docs/10-ui-ux-architecture/21-screen-template-assignment-matrix.md)

# 8. Conversion Workflow

The team should execute the screen program in two linked tracks.

## 8.1 Track A: Mockup Definition Track

Owner:

- mockup agent

Responsibilities:

- finish pending module and sub-module mockups
- ensure structural screen coverage
- ensure state and condition coverage
- ensure mobile behavior decisions
- label each screen with experience, pattern, and template IDs

Output:

- screen-definition mockup
- annotation notes
- state pack references
- template classification

## 8.2 Track B: Final UI Design Track

Owner:

- UI and visual design agent

Responsibilities:

- take only template-classified mockups
- convert them into final design boards in Staffsy language
- apply design tokens, spacing, typography, iconography, elevation, and interaction emphasis
- keep visual consistency across all screens within the same template family

Output:

- final design board
- desktop version
- mobile version where applicable
- template compliance notes
- frontend handoff cues

# 9. Handoff Gates

No screen should move to the final-design track unless it has:

1. a stable screen ref
2. a mapped module and sub-module
3. a desktop mockup definition
4. a mobile decision
5. a primary experience ID
6. a primary pattern ID
7. a final template ID
8. listed condition variants

No screen should be marked frontend-ready unless it has:

1. final visual design board
2. state and exception coverage
3. responsive behavior note
4. component references
5. data and action zones identified
6. accessibility notes

# 10. Template Production Order

The recommended final-design order is:

1. `WS-01` My Staffsy
2. `WS-02` Manager Workspace
3. `WS-03` HR Workspace
4. `WS-04` Org Admin Workspace
5. `WS-05` Platform Admin Workspace
6. `DB-01` Operational Dashboard
7. `MD-04` Profile
8. `TX-01` Approval Workspace
9. `MD-03` Create Edit Wizard
10. `AD-02` Configuration
11. `AD-03` Roles and Permissions
12. `AD-04` Audit and Monitoring
13. `DB-02` Analytics Dashboard
14. `UT-05` Import Export
15. `PAT-22` Builder Designer Canvas

This order is recommended because it covers the highest number of downstream screens earliest.

# 11. Design Governance Rules

The template system should follow these rules:

1. one master visual direction per template family
2. one component behavior model per component family
3. one responsive rule set per template family
4. one annotation standard for all final design boards
5. no isolated screen styling outside the design system unless formally approved
6. role context must change information hierarchy, not just menu labels
7. platform and org-admin screens must remain clearly distinct from HR business workflow screens

# 12. Immediate Next Actions

The immediate repository actions should be:

1. add template IDs to the mockup registry rows
2. add template IDs to the module-to-screen coverage matrix
3. define master final design boards for `WS-01`, `WS-02`, `WS-03`, `WS-04`, and `WS-05`
4. start batch conversion of already completed mockups by template family
5. keep pending mockup production running only for uncovered modules and sub-modules

# 13. Practical Conclusion

Yes, the project should use a template method.

The `180` mockups are not the final screens themselves. They are the structural definition library.

The design program should now proceed as:

`mockup definition -> template classification -> final design board -> frontend build`

That is the scalable model for completing the Enterprise HRMS screen system without visual drift, coverage gaps, or duplicated design effort.
