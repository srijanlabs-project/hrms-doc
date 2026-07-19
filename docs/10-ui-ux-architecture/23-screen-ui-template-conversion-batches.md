---
id: HRMS-UX-023
title: Screen UI Template Conversion Batches
document: 23-screen-ui-template-conversion-batches.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the execution batches for the final Screen UI track.

It exists to convert approved screen-definition mockups into final design boards through the established Enterprise HRMS template system.

The Screen UI track should not redesign screens as isolated one-off layouts.

It should:

- use the normalized template library
- preserve the information architecture already defined in the mockup set
- create reusable desktop and mobile master boards
- give frontend teams template-consistent visual handoff

# 2. Scope Of The Final Screen UI Track

The final Screen UI track begins after a screen is already structurally defined in the mockup library and assigned to a final template family.

Its job is to convert:

- approved structural mockups
- template assignments
- state and condition coverage

into:

- final desktop design boards
- final mobile design boards
- component-aligned screen variants
- frontend-ready visual references

This document should be used with:

- [20-screen-template-architecture-and-conversion-model.md](D:/HRMS-doc/docs/10-ui-ux-architecture/20-screen-template-architecture-and-conversion-model.md)
- [21-screen-template-assignment-matrix.md](D:/HRMS-doc/docs/10-ui-ux-architecture/21-screen-template-assignment-matrix.md)
- [14-screen-mockup-master-registry.md](D:/HRMS-doc/docs/10-ui-ux-architecture/14-screen-mockup-master-registry.md)
- [05-screen-templates.md](D:/HRMS-doc/docs/design%20system/05-screen-templates.md)
- [24-dual-track-mockup-and-screen-ui-production-plan.md](D:/HRMS-doc/docs/10-ui-ux-architecture/24-dual-track-mockup-and-screen-ui-production-plan.md)

# 3. Screen UI Status Model

The Screen UI batch status model should be:

| Status | Meaning |
|---|---|
| `Pending` | template batch item is registered but design conversion has not started |
| `Design In Progress` | master board creation is actively underway |
| `Design Ready` | desktop, mobile, and required variant boards are complete and ready for review |
| `Ready for Frontend` | reviewed final design is approved for engineering handoff |

# 4. Batch 01: First Major Final-Design Conversion Batch

## 4.1 Batch Purpose

The first major Screen UI batch should convert the first `5` high-impact template families already named in the plan of record:

1. `WS-01` My Staffsy
2. `WS-02` Manager Workspace
3. `WS-03` HR Workspace
4. `WS-04` Org Admin Workspace
5. `WS-05` Platform Admin Workspace

This batch should be executed first because:

- it establishes the role-based visual language for the product
- it gives design and frontend teams reusable workspace masters early
- it covers the most visible entry screens across employee, manager, tenant-admin, and platform-admin contexts
- it reduces drift before downstream template families are converted

## 4.2 Recommended Conversion Order Inside The Batch

The practical order of work inside this batch should be:

1. `WS-01` My Staffsy
2. `WS-02` Manager Workspace
3. `WS-03` HR Workspace
4. `WS-04` Org Admin Workspace
5. `WS-05` Platform Admin Workspace

This sequence is recommended because:

- `WS-01` defines the baseline self-service workspace pattern
- `WS-02` reuses the same workspace-home structure with manager decision density
- `WS-03` should lock the HR role-home master before deeper HR operational surfaces are styled
- `WS-04` should then adapt the workspace system to tenant-governance needs
- `WS-05` should finish the batch with the highest-control platform surface after admin hierarchy is already stabilized

## 4.3 Batch Summary

| Order | Template ID | Template Name | Target Screens | Current Batch Status | Conversion Priority |
|---|---|---|---|---|---|
| `1` | `WS-01` | My Staffsy | `EMP-SCR-001` Employee home | `Pending` | `Highest` |
| `2` | `WS-02` | Manager Workspace | `MGR-SCR-001` Team dashboard | `Pending` | `High` |
| `3` | `WS-03` | HR Workspace | planned `EXP-03` role-home master board; no current screen ref assigned in the matrix | `Pending` | `High` |
| `4` | `WS-04` | Org Admin Workspace | `W0-SCR-018` Organization admin dashboard | `Pending` | `High` |
| `5` | `WS-05` | Platform Admin Workspace | `W0-SCR-001` SaaS platform admin home dashboard | `Pending` | `High` |

# 5. Template Conversion Briefs

## 5.1 `WS-01` My Staffsy

Target screens:

- `EMP-SCR-001` Employee home

Design intent:

- establish the employee-facing workspace home for self-service, awareness, and next-action execution
- keep the screen action-first, lightweight, and personally relevant
- translate the `T-001` Employee Home pattern into a production-grade Staffsy board

Shared components:

- global header and role-aware navigation
- welcome or context banner
- quick action cluster
- KPI and balance cards
- pending tasks, requests, and update widgets
- `CMP-AI`, `CMP-STATE`, and `CMP-UTILITY` support elements

Responsive notes:

- desktop and mobile are both required in the registry
- mobile should preserve fast self-service actions, top tasks, and priority cards before secondary content
- avoid carrying a desktop multi-column density model directly into mobile; convert to stacked action sections

Conversion priority:

- `Highest`
- use this template to lock spacing, card hierarchy, widget rhythm, and workspace-home interaction rules for the rest of the batch

Recommended status path:

- `Pending` -> `Design In Progress` -> `Design Ready` -> `Ready for Frontend`

## 5.2 `WS-02` Manager Workspace

Target screens:

- `MGR-SCR-001` Team dashboard

Design intent:

- convert the manager home into a decision-oriented workspace rather than a passive dashboard
- preserve the shared workspace-home frame from `WS-01` but increase team oversight, approval pressure, and exception visibility
- turn the `T-002` Manager Dashboard pattern into the manager master board for future derivative screens

Shared components:

- global header and role-aware navigation
- KPI strip for team health, attendance, and approvals
- team alerts and action cards
- approval queue summary
- performance, hiring, and leave follow-up widgets
- `CMP-STATE`, `CMP-UTILITY`, and optional `CMP-AI` support panels

Responsive notes:

- desktop and mobile are both required in the registry
- mobile should keep decision actions, approvals, and urgent team exceptions above trend and summary content
- use collapsible modules on mobile rather than shrinking dense desktop widgets

Conversion priority:

- `High`
- convert immediately after `WS-01` so the shared workspace frame can be reused while role-specific hierarchy is still fresh

Recommended status path:

- `Pending` -> `Design In Progress` -> `Design Ready` -> `Ready for Frontend`

## 5.3 `WS-03` HR Workspace

Target screens:

- planned `EXP-03` HR role-home master board
- no current screen ref is explicitly assigned to `WS-03` in the assignment matrix or current registry baseline

Design intent:

- define the HR role-home master that will anchor later HR operations surfaces without waiting for every downstream screen to be converted
- create the bridge between role-home workspace behavior and the denser `MD`, `TX`, and `DB` HR templates that follow
- establish the visual and information hierarchy for HR ownership, workload, exceptions, and workforce operations visibility

Shared components:

- global header and role-aware navigation
- operational KPI strip
- workload and queue summary cards
- onboarding, lifecycle, data-quality, and compliance spotlight widgets
- launch points into employee master, verification queues, and operational dashboards
- `CMP-SEARCH`, `CMP-STATE`, and `CMP-UTILITY` support elements

Responsive notes:

- create both desktop and mobile master directions even though no current screen ref is registered yet
- mobile should prioritize urgent work queues, employee-impact alerts, and direct launch actions into HR operational surfaces
- keep the board intentionally modular so a future registered HR home screen ref can be mapped without redesigning the template

Conversion priority:

- `High`
- keep this third in sequence because it should inherit the settled workspace-home rules from `WS-01` and `WS-02` while still shaping later HR-focused template families

Recommended status path:

- `Pending` until an active design pass starts
- move to `Design Ready` only when the board is reviewable as a reusable master despite the current lack of a direct registered screen ref

## 5.4 `WS-04` Org Admin Workspace

Target screens:

- `W0-SCR-018` Organization admin dashboard

Design intent:

- define the tenant-admin workspace for governance, readiness, scoped configuration awareness, and administrative action
- keep the visual language clearly distinct from employee and manager workspaces even when shared dashboard mechanics are reused
- translate tenant control-plane responsibility into an accessible workspace rather than a dense console-only experience

Shared components:

- governance header and scoped context switch
- KPI cards for tenant health, setup posture, and administrative workload
- quota, compliance, and access alerts
- setup progress or first-time guidance blocks
- admin quick actions into configuration, access, imports, and review surfaces
- `CMP-SEARCH`, `CMP-STATE`, and `CMP-UTILITY` support elements

Responsive notes:

- desktop and mobile are both required in the registry
- mobile should favor alerts, setup blockers, and top administrative actions before broad summary content
- first-time setup, suspended tenant, and quota-warning states should all remain legible in compact layouts

Conversion priority:

- `High`
- place after the three workspace-home boards so the admin surface can deliberately diverge only where governance needs demand it

Recommended status path:

- `Pending` -> `Design In Progress` -> `Design Ready` -> `Ready for Frontend`

## 5.5 `WS-05` Platform Admin Workspace

Target screens:

- `W0-SCR-001` SaaS platform admin home dashboard

Design intent:

- define the highest-control workspace in the system for platform health, support context, risk visibility, and immediate operational intervention
- keep the board authoritative and signal-dense without collapsing into a monitoring console pattern that belongs to `AD-04`
- establish the control-plane master that later platform governance screens can inherit from

Shared components:

- platform command header
- critical KPI and runtime status cards
- degraded-state, high-risk, and support-context alert modules
- quick launch actions into audits, workflows, integrations, templates, and runtime operations
- cross-system summary widgets for incidents, queue pressure, and platform posture
- `CMP-SEARCH`, `CMP-STATE`, `CMP-UTILITY`, and optional `CMP-AI` support elements

Responsive notes:

- desktop and mobile are both required in the registry
- mobile should prioritize service health, critical alerts, and command actions before broad operational summaries
- degraded and high-risk states must remain visually dominant in both breakpoints

Conversion priority:

- `High`
- convert last in this batch so the admin language from `WS-04` is already stable before the platform layer adds greater system-risk emphasis

Recommended status path:

- `Pending` -> `Design In Progress` -> `Design Ready` -> `Ready for Frontend`

# 6. Designer Execution Notes For Batch 01

Each template conversion in this batch should produce:

- one desktop master board
- one mobile master board when the registry requires mobile coverage
- the mandatory condition variants already listed in the mockup registry
- component references aligned to the shared template system
- annotation notes for hierarchy, behavior, and state handling

The UI designer should treat the source mockups as structural truth for:

- navigation intent
- content grouping
- workflow emphasis
- role context

The UI designer should use the final design pass to improve:

- visual hierarchy
- spacing and grid discipline
- card and widget consistency
- responsive behavior
- state visibility
- action prominence

# 7. Batch Exit Rule

Batch 01 should be treated as complete only when:

- all `5` template masters are defined
- all registered target screens in this batch have desktop coverage
- all registered target screens in this batch have required mobile coverage
- required condition variants from the registry are reflected in the final boards
- each template has reached `Design Ready` or `Ready for Frontend`

# 8. Practical Conclusion

The first major Screen UI conversion batch should move immediately on `WS-01`, `WS-02`, `WS-03`, `WS-04`, and `WS-05`.

This gives the Enterprise HRMS program its first stable role-based final-design layer and creates the template masters that later screen families can reuse without visual drift.

# 9. Next Batch Direction

After Batch `01`, the next Screen UI batch should move to `MD-02`.

Reason:

- `MD-02` has the highest downstream reuse count in the current assignment matrix
- it powers operational workbenches across HR, recruitment, payroll, attendance, documents, assets, cases, contractors, and safety
- it is the most important family to normalize before deeper module-by-module visual conversion continues

Recommended Batch `02` starter screens:

1. `HRO-SCR-001` Employee master workbench
2. `PEO-SCR-002` Employment details workspace
3. `REC-SCR-001` Requisition workbench
4. `PAY-SCR-002` Payroll run details
5. `WRK-SCR-001` Attendance workbench

These screens should establish the reusable final-design language for the `MD-02` list-plus-detail workbench family before the remaining `MD-02` screens are converted.

# 10. Active Parallel Conversion Wave

The next conversion wave is being executed in two disjoint batches. Each batch keeps the desktop and mobile boards for a screen ref with the same designer/agent, which prevents responsive design drift.

## 10.1 Batch 03: People Record And Recruitment

Output folder:

- `screen-ui-designs/batch-03-people-and-recruitment/`

Assigned screen refs:

1. `PEO-SCR-002` Employment details workspace
2. `PEO-SCR-003` Identity and compliance panel
3. `PEO-SCR-004` Bank and tax maintenance
4. `PEO-SCR-005` Documents center
5. `PEO-SCR-006` Employee timeline
6. `PEO-SCR-007` Lifecycle action wizard
7. `REC-SCR-001` Requisition workbench
8. `REC-SCR-002` Candidate pipeline board
9. `REC-SCR-003` Candidate profile
10. `REC-SCR-004` Interview scheduler

Required output:

- `10` desktop final boards
- `10` mobile final boards
- `20` final PNG assets in total

## 10.2 Batch 04: Payroll And Workforce Operations

Output folder:

- `screen-ui-designs/batch-04-payroll-and-workforce/`

Assigned screen refs:

1. `PAY-SCR-002` Payroll run details
2. `PAY-SCR-003` Validation queue
3. `PAY-SCR-004` Statutory workbench
4. `PAY-SCR-005` Compliance calendar
5. `PAY-SCR-006` Retro and settlement workspace
6. `WRK-SCR-001` Attendance control center
7. `WRK-SCR-002` Shift management
8. `WRK-SCR-003` Rostering screen
9. `WRK-SCR-004` Timesheet workbench
10. `WRK-SCR-005` Overtime and comp-off console

Required output:

- `10` desktop final boards
- `10` mobile final boards
- `20` final PNG assets in total

## 10.3 Wave Exit Rule

The parallel wave is complete only when:

- all `20` assigned screen refs have a desktop final board
- all `20` assigned screen refs have a mobile final board
- both variants preserve the source mockup information architecture
- the Staffsy design-system language is applied consistently
- each batch README records the asset list and status
- no output is confused with a raw SVG mockup; final boards are polished visual handoff artifacts

## 10.4 Current Wave Status

`Rebuilt - Design Ready`.

The wave now contains:

- `20` screen refs converted
- `20` desktop final UI boards
- `20` mobile final UI boards
- `40` PNG assets in total
- `2` batch READMEs with asset inventories and design rules
- all desktop boards use the canonical `1536 x 1024` presentation-board format
- all mobile boards use the canonical `1024 x 1536` presentation-board format with an embedded `390 x 844` viewport
- Batch 03/04 no longer use the rejected raw-screen renderer as their final visual reference
