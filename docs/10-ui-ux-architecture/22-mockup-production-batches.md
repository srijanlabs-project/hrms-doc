---
id: HRMS-UX-022
title: Mockup Production Batches
document: 22-mockup-production-batches.md
version: 1.0
status: Draft
---

# 1. Purpose

This document is the execution backlog for the Enterprise HRMS mockup track.

It exists to keep screen-definition mockup production moving after the current `90`-screen baseline without mixing already-covered baseline work with future screen expansion.

This document should be used to:

- assign pending mockup work by batch
- keep module and sub-module coverage aligned with the screen coverage matrix
- group production by reusable template families where possible
- make the handoff into final UI design predictable and traceable

# 2. Scope Boundary

## 2.1 Already Covered Current Baseline

The current baseline is not the work queue for this document.

| Work Set | Current Position | Status | Action |
|---|---|---|---|
| Current registered baseline | `90` registered screens with `180` concrete SVG assets in the repository | `Mockup Ready` | use as reference input only |
| Current template-classified mockup library | current registered baseline is already classified in the template assignment matrix | `Mockup Ready` | do not rebatch here |
| Variant expansion for already-ready baseline screens | condition and state packs remain the next expansion layer | `Pending` | produce only when a batch explicitly requires a new variant pack |

## 2.2 In Scope For This Document

This document covers:

- planned screens not covered by the current `90` baseline
- module and sub-module rows that are `Mapped` but not mockup-complete in the coverage matrix
- future screen refs introduced for uncovered module families
- screen-definition mockups required before final template conversion can begin for those areas

# 3. Mockup Track Definition

The mockup track is the structural-definition track described in the template architecture model.

Its job is not final visual polish.

Its job is to produce for each pending screen:

- annotated desktop mockup
- annotated mobile mockup or reduced-mobile decision where appropriate
- template family assignment
- state and condition coverage notes
- stable screen ref usage tied to a module and sub-module owner

# 4. Status Model

This document uses the following execution statuses.

| Status | Meaning |
|---|---|
| `Pending` | batch is defined but mockup production has not started |
| `Mockup In Progress` | desktop or mobile structural boards are actively being produced |
| `Mockup Ready` | desktop and mobile definition is complete, template family is confirmed, and the batch is ready for registry and matrix updates |

Practical rule:

- keep batch status in this document as the operational signal for mockup work
- reflect screen-level completion in the master registry and assignment matrix after the mockup is ready

# 5. Execution Rules

Every batch in this document should be executed with the same minimum definition.

Before a batch starts, confirm:

1. the module and sub-module owners
2. the new or planned screen refs in scope
3. the primary template families for reuse
4. the mandatory condition variants from the coverage matrix
5. whether mobile is full, reduced, or note-only

Before a batch is marked `Mockup Ready`, confirm:

1. the desktop mockup is complete
2. the mobile mockup or reduced-mobile behavior note is complete
3. the screen is labeled with the final template ID
4. the key condition variants are called out in annotations
5. the screen can be added to the master registry and template assignment matrix without ambiguity

# 6. Prioritization Rule

Pending mockup production should run in this order:

1. modules with broad downstream dependency
2. modules that establish reusable template families for many later screens
3. workflow-heavy modules that require approvals, review, or exception states
4. migration, compliance, analytics, and governance modules that have high coverage-risk if deferred
5. lower-dependency specialist modules after core control-plane and workforce batches are stable

# 7. Priority Batch Plan

The following batches are the plan of record for future mockup expansion beyond the current baseline.

| Batch | Priority | Modules and Sub-Modules | Planned Screen Refs | Primary Template Families | Execution Notes | Status |
|---|---|---|---|---|---|---|
| `MB-01` | `P1` | `01 Organization Management`: tenant, company, legal entity, org structure, hierarchy, calendars, policies, classifications | `ORG-SCR-001` to `ORG-SCR-004`, `ADM-SCR-007` | `MD-02`, `MD-04`, `AD-02`, `WS-04` | start here because organization structure drives people, access, payroll, and workflow context across later modules | `Mockup Ready` |
| `MB-02` | `P1` | `03 Identity and Access`, `28 Administration`, `29 Security and Governance`, and org-admin governance surfaces: user accounts, SSO, MFA, permissions, delegation, number series, tenant settings, retention and access controls | `ORG-ADM-001` to `ORG-ADM-004`, `ORG-ADM-007`, `ORG-ADM-008`, `IAM-SCR-001` to `IAM-SCR-004`, `ADM-SCR-004` | `AD-02`, `AD-03`, `AD-01`, `UT-07`, `AD-04` | produce these immediately after org-control screens so downstream admin, privacy, and governance flows do not stay abstract | `Mockup Ready` |
| `MB-03` | `P1` | `04 Employee Self Service`, `05 Manager Self Service`, supporting `02 People Management`: employee hubs, manager dashboard, approvals, reviews, mobility, request routing | `ESS-SCR-004`, `ESS-SCR-005`, `ESS-SCR-006`, `MSS-SCR-001` to `MSS-SCR-005` | `WS-01`, `WS-02`, `DB-01`, `TX-01`, `TX-06` | use current employee, manager, and profile-ready screens as structural references, but produce dedicated hub and workbench mockups for the pending surfaces; both the ESS hubs and the full manager workspace family are now ready | `Mockup Ready` |
| `MB-04` | `P2` | `07 Workforce Management`, `10 Statutory and Compliance`, `11 Performance Management`, `12 Learning and Development` | `WRK-SCR-005`, `STA-SCR-001` to `STA-SCR-004`, `PRF-SCR-001` to `PRF-SCR-005`, `LRN-SCR-001` to `LRN-SCR-004` | `TX-01`, `TX-03`, `TX-04`, `DB-01`, `MD-04` | batch these together because they share approval, calendar, dashboard, and profile patterns with condition-heavy policy and exception states; the workforce overtime, statutory, performance, and learning family is now fully ready | `Mockup Ready` |
| `MB-05` | `P2` | `13 Talent Management`, `14 Compensation and Benefits`, `25 Analytics and BI`, `26 AI and Copilot` | `TAL-SCR-001` to `TAL-SCR-003`, `CMP-SCR-001` to `CMP-SCR-004`, `AIC-SCR-001` to `AIC-SCR-005` | `DB-02`, `DB-03`, `WS-06`, `TX-01`, `AD-05` | keep talent, compensation, analytics, and AI together because these areas rely on executive and intelligence-oriented templates rather than core transaction templates; talent, compensation, analytics, and AI screens are now fully ready | `Mockup Ready` |
| `MB-06` | `P3` | `15 Employee Experience`, `16 Travel Management`, `17 Expense Management` | `EXR-SCR-001` to `EXR-SCR-004`, `TRV-SCR-001` to `TRV-SCR-004`, `XPN-SCR-001` to `XPN-SCR-004` | `WS-01`, `TX-01`, `TX-03`, `TX-05`, `TX-06`, `MD-03` | run these as one experience-and-request wave because they share request, scheduler, kanban, and workflow-tracker behavior; this batch is now mockup-ready | `Mockup Ready` |
| `MB-07` | `P3` | `18 Asset Management`, `19 Helpdesk and Case Management`, `20 Contractor and External Workforce`, `21 Visitor and Workplace Management`, `22 Health Safety and Wellness` | `AST-SCR-002` to `AST-SCR-003`, `HLP-SCR-002` to `HLP-SCR-003`, `CTR-SCR-002` to `CTR-SCR-003`, `VWP-SCR-001` to `VWP-SCR-003`, `HSW-SCR-002` to `HSW-SCR-004` | `MD-02`, `MD-03`, `TX-01`, `TX-03`, `WS-07`, `DB-01` | produce this as the specialist-operations wave after the core workforce and governance templates are stable; the full specialist-operations family in this batch is now ready | `Mockup Ready` |
| `MB-08` | `P4` | `23 Communication Platform`, `24 Document Management`, `27 Integration Platform`, `30 DevOps and Operations`, `32 Testing and Quality` | `COMMS-SCR-001` to `COMMS-SCR-003`, `DOC-SCR-002` to `DOC-SCR-004`, `INT-SCR-001` to `INT-SCR-004`, `OPS-SCR-001` to `OPS-SCR-002`, `TST-SCR-001` to `TST-SCR-004` | `UT-01`, `AD-04`, `AD-05`, `UT-05`, `DB-01` | keep technical, runtime, document, integration, ops, and quality surfaces together because they depend on earlier admin, monitor, and builder patterns being stable; this full technical and quality wave is now mockup-ready | `Mockup Ready` |

# 8. Batch Detail By Template Family

The batch list above should be executed with the following template-family bias so mockup reuse stays high.

| Template Family Group | Use It For | Primary Batches |
|---|---|---|
| `AD-02`, `AD-03`, `AD-01` | configuration, policy, settings, permissions, governance consoles | `MB-01`, `MB-02`, `MB-08` |
| `WS-01`, `WS-02`, `WS-04`, `WS-06`, `WS-07` | role-led hubs, executive workspaces, specialist operations homes | `MB-01`, `MB-03`, `MB-05`, `MB-07` |
| `MD-02`, `MD-03`, `MD-04` | master-detail, wizard, and profile-driven records | `MB-01`, `MB-04`, `MB-06`, `MB-07` |
| `TX-01`, `TX-03`, `TX-04`, `TX-05`, `TX-06` | approvals, scheduling, calendar, kanban, and workflow tracking | `MB-03`, `MB-04`, `MB-06`, `MB-07` |
| `DB-01`, `DB-02`, `DB-03` | operational dashboards, analytics, and AI workspaces | `MB-03`, `MB-04`, `MB-05`, `MB-07` |
| `AD-04`, `AD-05`, `UT-01`, `UT-05`, `UT-07` | monitoring, builders, notifications, import-export, delegation utilities | `MB-02`, `MB-05`, `MB-08` |

# 9. Recommended Next Mockup Waves

The next production waves should run as follows.

## 9.1 Wave 1

Include:

- `MB-01` Organization and tenant structure screens
- `MB-02` Identity, administration, and governance screens

Reason:

- these screens define the control-plane structure used by many downstream modules
- they remove ambiguity around org context, access context, and tenant context before later workforce screens are expanded

Target result:

- stable org, access, settings, and governance mockup foundations
- reusable admin-console and org-workbench template references

## 9.2 Wave 2

Include:

- `MB-03` Employee and manager hubs
- `MB-04` Workforce, statutory, performance, and learning operations

Reason:

- these are the first large functional batches that employees, managers, HR operations, and compliance teams depend on
- they also exercise the widest set of queue, dashboard, profile, calendar, and workflow states

Target result:

- operational workforce surfaces are no longer only matrix-mapped
- the mockup library can support more direct implementation planning for core HR workflows

## 9.3 Wave 3

Include:

- `MB-05` Talent, compensation, analytics, and AI
- `MB-06` Employee experience, travel, and expense

Reason:

- these modules depend on prior workforce and admin patterns
- they benefit from having executive, AI, request, and workflow patterns already stabilized

Target result:

- intelligence-heavy and experience-heavy module families become mockup-executable without creating one-off screen patterns

## 9.4 Wave 4

Include:

- `MB-07` Specialist operations
- `MB-08` Communication, document, integration, ops, and quality surfaces

Reason:

- these areas are important but have lower dependency on the first organization and workforce waves
- they can reuse the strongest established monitor, builder, queue, and specialist-operation patterns

Target result:

- the remaining technical and specialist modules are covered by explicit screen-definition batches
- pending mockup work is reduced to targeted variant expansion instead of missing primary screens

# 10. Mockup Specialist Checklist

For each screen in an active batch, the mockup specialist should complete the following:

1. confirm the planned screen ref and screen name
2. confirm the owning module and sub-module
3. select the primary template family before drawing
4. produce desktop structure first
5. produce mobile or reduced-mobile structure second
6. annotate the mandatory condition variants from the coverage matrix
7. note any dependency on current baseline screens used as structural reference
8. mark the batch `Mockup Ready` only when the screen can move cleanly into registry and template assignment updates

# 11. Practical Conclusion

The current `90`-screen baseline is the foundation, not the remaining backlog.

This document now records the completed production plan for the full primary layer of screen-definition mockups across uncovered modules and planned screen expansion.

Use it to keep mockup work focused on:

- new screen refs
- mapped-but-not-complete module families
- reusable template-family batches
- unambiguous handoff into final UI conversion
- future optional variant overlays and dense-state refinement
