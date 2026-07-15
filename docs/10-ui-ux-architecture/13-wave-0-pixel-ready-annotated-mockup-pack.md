---
id: HRMS-UX-013
title: Wave 0 Pixel Ready Annotated Mockup Pack
document: 13-wave-0-pixel-ready-annotated-mockup-pack.md
version: 1.1
status: Draft
---

# 1. Purpose

This document indexes the first pixel-ready and annotated mockup wave for the Enterprise HRMS application.

This pass covers:

- `W0-SCR-001` SaaS platform admin home dashboard
- `W0-SCR-002` global search and command entry
- `W0-SCR-003` shared task and approvals inbox
- `W0-SCR-004` configuration catalog and scope console
- `W0-SCR-005` metadata explorer and dependency map
- `W0-SCR-006` workflow administration console
- `W0-SCR-007` notification template and channel console
- `W0-SCR-008` audit explorer and entity timeline
- `W0-SCR-009` event bus and integration runtime monitor
- `W0-SCR-010` document template builder and generation monitor
- `W0-SCR-011` AI platform policy and evaluation console
- `W0-SCR-018` organization admin dashboard

# 2. Asset Library

Mockup assets are stored in [mockups/README.md](D:/HRMS-doc/docs/10-ui-ux-architecture/mockups/README.md).

# 3. Screen Coverage Matrix

| Screen | Desktop | Mobile | Notes |
|---|---|---|---|
| `W0-SCR-001` | ready | ready | provider control plane home |
| `W0-SCR-002` | ready | ready | search overlay and command entry |
| `W0-SCR-003` | ready | ready | queue and detail action workspace |
| `W0-SCR-004` | ready | ready | three-panel admin console adapted to stepwise mobile flow |
| `W0-SCR-005` | ready | ready | desktop-primary architecture explorer with reduced mobile detail view |
| `W0-SCR-006` | ready | ready | provider workflow routing, versioning, and stuck-item governance workspace |
| `W0-SCR-007` | ready | ready | template editing, channel preview, and delivery diagnostics workspace |
| `W0-SCR-008` | ready | ready | masked audit history and diff-driven investigation workspace |
| `W0-SCR-009` | ready | ready | runtime health, lag, dead-letter, and replay-safe monitor |
| `W0-SCR-010` | ready | ready | document template builder with merge preview and job monitor |
| `W0-SCR-011` | ready | ready | AI policy, evaluation evidence, live alerts, and publish controls |
| `W0-SCR-018` | ready | ready | tenant-side admin home with explicit SaaS boundary |

# 4. Annotation Summary By Screen

## 4.1 W0-SCR-001

Desktop emphasis:

- control-plane shell
- critical signal strip above fold
- action queue plus platform health grid
- risk panel separated from generic shortcuts

Mobile emphasis:

- urgent signals first
- queue and risks before lower-priority shortcuts
- stacked command sections with simplified density

## 4.2 W0-SCR-002

Desktop emphasis:

- large search input with recent searches
- grouped result list with right-side preview
- permission-safe metadata distinctions

Mobile emphasis:

- full-screen search sheet
- horizontal tab pills
- preview replaced with tap-through result card pattern

## 4.3 W0-SCR-003

Desktop emphasis:

- split queue and task-detail workbench
- top urgency chips
- action bar anchored in detail panel

Mobile emphasis:

- list-first task view
- bottom sticky decision bar
- comment and rationale captured in stacked steps

## 4.4 W0-SCR-004

Desktop emphasis:

- catalog tree, results table, and detail panel visible together
- proposal drawer anchored to current selection
- scope lineage readable without opening a new page

Mobile emphasis:

- search-first entry
- selected config shown as stacked detail cards
- change proposal converted into full-screen guided flow

## 4.5 W0-SCR-005

Desktop emphasis:

- entity tree, summary, and dependency context together
- field table preserved as the deepest data plane
- compare and export kept in header

Mobile emphasis:

- entity drill-down only
- dependency summary condensed into expandable sections
- explicit note that deep metadata work remains desktop-preferred

## 4.6 W0-SCR-006

Desktop emphasis:

- workflow catalog, route preview, and health together
- draft versus published separation
- stuck-item visibility without leaving the console

Mobile emphasis:

- workflow list first
- route and version summaries stacked into readable cards
- incident-heavy content prioritized above history

## 4.7 W0-SCR-007

Desktop emphasis:

- editing surface centered
- channel preview beside diagnostics
- publish and failure context visible together

Mobile emphasis:

- template selection first
- editor and preview shown as guided stacked steps
- channel diagnostics reduced to concise cards

## 4.8 W0-SCR-008

Desktop emphasis:

- event grid plus diff detail and entity timeline
- masking and reveal context always explicit
- export path visible but not dominant

Mobile emphasis:

- filter sheet and event cards
- selected event detail replaces split panel
- chronology remains readable in vertical order

## 4.9 W0-SCR-009

Desktop emphasis:

- signal strip for operational triage
- route health grid and failure drill-down side by side
- replay-safe actions clearly separated from passive telemetry

Mobile emphasis:

- incident summary first
- stacked route health cards
- recovery actions moved into concise action sheet pattern

## 4.10 W0-SCR-010

Desktop emphasis:

- template library, canvas, and job monitor together
- preview and unresolved token risk visible in-context
- builder treated as a governed admin workspace, not a free-form editor

Mobile emphasis:

- library-first navigation
- canvas translated into stacked structured sections
- preview and job monitor split into simpler review steps

## 4.11 W0-SCR-011

Desktop emphasis:

- policy catalog, evaluation evidence, and live incidents together
- draft versus live policy comparison before publish
- governance and cost signals visible before release action

Mobile emphasis:

- alert and draft status first
- evaluation summary stacked ahead of publish controls
- incident and approval context kept above lower-priority detail

## 4.12 W0-SCR-018

Desktop emphasis:

- tenant-scoped command center
- setup and governance risks before adoption analytics
- no provider-only control leakage

Mobile emphasis:

- setup blockers and governance alerts first
- health grid collapsed to actionable cards
- tenant identity and health persist at top

# 5. What This Closes

This wave now closes the absence of a pixel-ready baseline for the first `12` highest-priority Wave `0` administration and control-plane screens.

# 6. What Still Remains

The repository still needs later-wave pixel-ready packs for:

- employee profile and lifecycle screens
- recruitment and offer screens
- attendance, leave, and payroll operations
- documents, analytics, and support operations
- state variants beyond the default artboards
