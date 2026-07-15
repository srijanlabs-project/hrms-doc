---
id: HRMS-UX-012
title: Pixel Ready Mockup System and Annotation Standard
document: 12-pixel-ready-mockup-system-and-annotation-standard.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines how pixel-ready desktop and mobile mockups should be prepared for the Enterprise HRMS repository so that design, frontend, QA, implementation, and stakeholder review can work from one consistent visual contract.

# 2. Scope

This mockup system is intended for:

- Wave `0` priority screens
- admin and control-plane workspaces
- employee and manager high-traffic screens in later waves
- responsive review before coded UI starts

It is not a replacement for:

- coded component libraries
- live design-tool libraries
- motion prototypes for advanced interactions

# 3. Deliverable Standard

Every pixel-ready screen pack should include:

- desktop artboard
- mobile artboard where the screen is relevant on mobile
- numbered annotations
- state notes
- responsive adaptation notes
- permission or boundary notes where scope differs by role

# 4. Canonical Artboard Sizes

Desktop baseline:

- `1440 x 1280`

Mobile baseline:

- `390 x 844`

Optional future sizes:

- tablet `1024 x 1366`
- wide desktop `1600 x 1400`

# 5. Layout Grid and Spacing

Desktop layout rules:

- outer canvas padding `24`
- shell header height `64`
- app sidebar width `248`
- standard content gap `16`
- card radius `14`
- card padding `16`
- section gap `20`

Mobile layout rules:

- outer canvas padding `16`
- top bar height `56`
- bottom action or utility bar height `64` where required
- card radius `14`
- card padding `14`
- section gap `14`

# 6. Visual Token Baseline

Recommended token palette for mockups:

- background `#F4F7FB`
- shell navy `#10324A`
- panel white `#FFFFFF`
- border `#D9E2EC`
- text primary `#102A43`
- text secondary `#486581`
- action teal `#0F766E`
- warning amber `#D97706`
- critical red `#B42318`
- info blue `#2563EB`
- success green `#15803D`

Typography baseline:

- page titles `28 / 36 / 700`
- section titles `16 / 22 / 600`
- card metrics `24 / 30 / 700`
- body text `13 / 20 / 500`
- helper text `12 / 18 / 400`

# 7. Annotation Rules

Annotation rules:

- use numbered callouts directly on the mockup
- keep callout numbers stable between desktop and mobile for the same screen where possible
- each annotation should describe intent, behavior, and risk if misused
- distinguish `provider`, `tenant`, and `shared` boundaries in text where relevant
- annotate not only layout but also decision-critical interaction areas

Recommended annotation categories:

- shell and navigation
- primary action area
- data density and reading order
- risk or governance emphasis
- permission boundary behavior
- responsive transformation

# 8. State Rules

Every screen pack should define these states even if only the default state is rendered visually:

- default
- empty
- loading or partial-data
- permission-restricted
- validation or exception
- degraded integration or service state where applicable

# 9. Desktop to Mobile Adaptation Rule

The mobile version should not merely shrink the desktop layout. It should reorganize the page around mobile intent:

- urgent actions first
- stacked cards instead of dense side-by-side grids
- fewer simultaneous columns
- higher use of drawers, sheets, and step flows
- shorter tables replaced by summary cards or drill-down lists

# 10. Asset Format Rules

Mockups in this repository should be stored as:

- `svg` for versionable source-controlled review artifacts
- optional `png` exports later for slide decks or approvals

Naming pattern:

- `{screen-id}-{slug}-desktop.svg`
- `{screen-id}-{slug}-mobile.svg`

# 11. Wave 0 Coverage Rule

Wave `0` pixel-ready completion for the first pass means:

- desktop and mobile mockups exist for `W0-SCR-001` to `W0-SCR-005`
- desktop and mobile mockups exist for `W0-SCR-018`
- annotations explain layout, hierarchy, role boundary, and responsive behavior
- asset links are indexed in the UI or UX repository

# 12. Review Checklist

Before a mockup pack is accepted:

- business and product confirm layout supports the process goal
- UX confirms reading order and responsive strategy
- frontend confirms the screen can be componentized without hidden ambiguity
- QA confirms states, permissions, and action paths are testable
- implementation confirms tenant or provider boundary is explicit where needed
