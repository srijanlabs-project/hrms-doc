---
id: HRMS-UX-019
title: Screen Surface Decomposition Standard
document: 19-screen-surface-decomposition-standard.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the final UI-surface decomposition rule for the Enterprise HRMS application.

Its purpose is to stop teams from saying a screen is "covered" when only the main page is known but the real development surfaces are still missing.

This standard forces every mapped screen to declare:

- main page
- list or workbench surface
- detail surface
- create or edit surface
- modal and confirmation surfaces
- drawers and side panels
- row actions and bulk actions
- empty, error, restricted, inactive, success, and exception states

# 2. Why This Exists

A large enterprise HRMS usually misses screens not at the module level, but at the `surface` level.

Common misses:

- approval detail drawer not designed
- row-action confirmation modal not defined
- bulk action bar missing
- compare view missing
- import error correction panel missing
- mobile detail drill-down not defined
- permission-restricted state not designed

This standard is the layer that closes that gap.

# 3. Surface Vocabulary

Use the following terms consistently.

## 3.1 Core Surfaces

- `Primary page`
  main route-level screen
- `Workbench`
  dense operational page with table, filters, actions, and detail review
- `Profile`
  record-centric page focused on a person, candidate, contractor, or object
- `Wizard`
  stepwise flow with progression and validation
- `Dashboard`
  KPI, signal, and action summary page
- `Builder`
  authoring or configuration canvas

## 3.2 Secondary Surfaces

- `Drawer`
  slide-in contextual panel for details or edits
- `Side panel`
  persistent split-pane detail or preview area
- `Modal`
  focused interruption for confirmation, small edit, or warning
- `Sheet`
  mobile bottom or full-height action surface
- `Popover`
  compact contextual utility surface
- `Inline section`
  in-page editable or expandable block

## 3.3 Table and Action Surfaces

- `Row action`
  action launched from one row or card
- `Bulk action bar`
  action zone shown after multi-select
- `Filter panel`
  advanced filter surface
- `Compare view`
  dual-state or version-diff surface
- `Preview surface`
  read-only rendered output area

# 4. Mandatory Decomposition Rule

Every screen in the coverage matrix must be decomposed into these categories.

| Category | Required? | Notes |
|---|---|---|
| Primary page | always | the main route-level surface |
| Detail surface | usually | side panel, drawer, or full detail page |
| Create or edit surface | when the user can author or change data | modal, page, drawer, or wizard |
| Review or approval surface | when workflow or decisions exist | may be a panel or dedicated page |
| Bulk or row action surface | when lists support actions | include confirmation behavior |
| State surfaces | always | default, loading, empty, error, restricted, inactive, success, exception |
| Mobile transformation | always | even if desktop-primary |

# 5. Surface IDs

Every screen should eventually carry surface identifiers using this pattern:

- `{screen-ref}-PG-01`
- `{screen-ref}-DR-01`
- `{screen-ref}-MD-01`
- `{screen-ref}-PN-01`
- `{screen-ref}-WZ-01`
- `{screen-ref}-ST-EMPTY`

Examples:

- `W0-SCR-003-PG-01` main task inbox page
- `W0-SCR-003-PN-01` right-side task detail panel
- `W0-SCR-003-MD-01` reject confirmation modal
- `W0-SCR-026-WZ-01` import upload and validate wizard
- `EMP-SCR-006-ST-ERROR` leave and attendance error state

# 6. Required Surface Types By Screen Family

## 6.1 Dashboards

Must define:

- primary page
- card drill-down destination behavior
- alert detail surface
- empty state
- degraded or exception-heavy state
- mobile stacked transformation

## 6.2 Queues and Workbenches

Must define:

- primary page
- row detail panel or detail page
- row action surface
- bulk action bar
- filter panel
- no-results state
- permission-restricted row behavior
- mobile list-to-detail behavior

## 6.3 Profiles

Must define:

- primary page
- edit surface
- sensitive-data restricted view
- history or timeline surface
- inactive or archived state
- success state after update

## 6.4 Wizards

Must define:

- start surface
- step surfaces
- validation error surface
- review and confirm surface
- completion surface
- interrupted or resume state
- mobile step behavior

## 6.5 Admin Consoles

Must define:

- primary console page
- selected-detail panel
- compare view
- create or edit surface
- approval-pending state
- read-only state
- warning or breaking-change modal
- mobile reduced behavior

## 6.6 Builders

Must define:

- canvas page
- preview surface
- validation warning surface
- publish confirmation surface
- locked or published state
- unresolved token or dependency-warning state
- mobile simplified authoring behavior

## 6.7 Analytics Screens

Must define:

- primary dashboard or analysis page
- filter surface
- drill-down surface
- export surface
- no-data state
- restricted metric state
- mobile summary behavior

# 7. State Surface Minimum

Every mapped screen must explicitly state whether each of these is:

- a separate mockup
- an annotation on the primary mockup
- not applicable with reason

Mandatory state list:

- default
- loading
- empty
- error
- restricted
- inactive or archived
- success
- exception

# 8. Surface Decomposition Template

Use this template whenever breaking down a screen.

## 8.1 Screen Ref

- screen ref
- screen name
- family
- primary persona

## 8.2 Primary Surfaces

- primary page
- detail page or panel
- create or edit surface
- review or approval surface

## 8.3 Secondary Surfaces

- modal list
- drawer list
- side panel list
- filter surface
- preview surface

## 8.4 Action Surfaces

- row actions
- bulk actions
- destructive actions
- export actions

## 8.5 State Surfaces

- default
- loading
- empty
- error
- restricted
- inactive
- success
- exception

## 8.6 Mobile Behavior

- full parity
- reduced
- desktop only
- mobile primary

# 9. Example Decomposition

## `W0-SCR-003` Shared Task and Approvals Inbox

Primary surfaces:

- `W0-SCR-003-PG-01`
  queue page
- `W0-SCR-003-PN-01`
  task detail side panel

Secondary surfaces:

- `W0-SCR-003-FL-01`
  advanced filter panel
- `W0-SCR-003-MD-01`
  reject confirmation modal
- `W0-SCR-003-MD-02`
  bulk approve confirmation modal

Action surfaces:

- row open
- approve
- reject
- return for correction
- bulk approve low-risk items

State surfaces:

- `ST-EMPTY`
- `ST-ERROR`
- `ST-RESTRICTED`
- `ST-OVERDUE`

Mobile behavior:

- queue list as primary
- task detail opens as full page or sheet
- action bar becomes bottom sticky bar

# 10. Signoff Rule

A screen should not be marked development-ready unless:

1. it exists in the module-to-screen coverage matrix
2. it exists in the mockup registry
3. it has a surface decomposition
4. its state handling is declared
5. its mobile behavior is declared

# 11. Recommended Next Usage

From this point onward, new mockup work should follow this order:

1. pick the next screen from the mockup registry
2. decompose it using this surface standard
3. create primary desktop and mobile mockups
4. create separate condition or state mockups where structure changes materially
5. update the registry and checklist
