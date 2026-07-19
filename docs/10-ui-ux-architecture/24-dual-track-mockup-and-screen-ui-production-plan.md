---
id: HRMS-UX-024
title: Dual Track Mockup And Screen UI Production Plan
document: 24-dual-track-mockup-and-screen-ui-production-plan.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the parallel production model for the Enterprise HRMS screen program.

It exists so that the team can progress on both:

- pending screen-definition mockups
- final screen UI design conversion

without waiting for one stream to fully finish before the other begins.

# 2. Two-Track Operating Model

The program now runs in two coordinated tracks.

## 2.1 Track A: Mockup Track

Goal:

- finish pending structural screen-definition mockups for uncovered or future module and sub-module areas

Output:

- annotated desktop mockups
- annotated mobile mockups
- state and condition coverage notes
- coverage updates for newly introduced screen refs

Primary artifact:

- [22-mockup-production-batches.md](D:/HRMS-doc/docs/10-ui-ux-architecture/22-mockup-production-batches.md)

## 2.2 Track B: Screen UI Track

Goal:

- convert existing mockup definitions into final design boards using the Staffsy design system and template method

Output:

- final desktop design boards
- final mobile design boards
- template-consistent visual references
- frontend-ready visual handoff

Primary artifact:

- [23-screen-ui-template-conversion-batches.md](D:/HRMS-doc/docs/10-ui-ux-architecture/23-screen-ui-template-conversion-batches.md)

# 3. Shared Reference Layer

Both tracks must stay aligned to:

- [20-screen-template-architecture-and-conversion-model.md](D:/HRMS-doc/docs/10-ui-ux-architecture/20-screen-template-architecture-and-conversion-model.md)
- [21-screen-template-assignment-matrix.md](D:/HRMS-doc/docs/10-ui-ux-architecture/21-screen-template-assignment-matrix.md)
- [14-screen-mockup-master-registry.md](D:/HRMS-doc/docs/10-ui-ux-architecture/14-screen-mockup-master-registry.md)
- [17-module-submodule-to-screen-coverage-matrix.md](D:/HRMS-doc/docs/10-ui-ux-architecture/17-module-submodule-to-screen-coverage-matrix.md)

# 4. Common Status Model

The status system should be identical across both tracks.

| Status | Meaning |
|---|---|
| `Pending` | registered but not started |
| `In Progress` | actively being produced |
| `Ready` | completed for the current stage |
| `Ready for Frontend` | final screen UI completed and suitable for engineering handoff |

# 5. Current Production Direction

The program should work in this order:

1. keep the Screen UI track moving immediately on the first `5` templates
2. keep the Mockup track moving on uncovered and future-expansion screens
3. never let final-design work block on all future mockups
4. never let pending mockup coverage drift away from the approved template system

# 6. Immediate Batch Direction

## 6.1 Screen UI Batch

The first major Screen UI batch should cover the first `5` high-impact templates:

1. `WS-01` My Staffsy
2. `WS-02` Manager Workspace
3. `WS-03` HR Workspace
4. `WS-04` Org Admin Workspace
5. `WS-05` Platform Admin Workspace

Reason:

- these templates influence the largest number of downstream role-based screens
- they establish the strongest visual language for the rest of the product
- they give design and frontend teams reusable masters quickly

## 6.2 Mockup Batch Direction

The Mockup track should prioritize:

1. planned screens not covered by the current `90` baseline
2. modules with broad downstream dependency
3. modules that still have `Mapped` but not current-screen-complete status
4. module families required by implementation planning beyond Wave `0`

# 7. Execution Rule

Each new design or mockup batch should answer four questions before work begins:

1. which template family does it belong to
2. which role or experience owns it
3. which states or condition variants are mandatory
4. whether the batch produces a new screen ref or only a new visual/state variant

# 8. Plan Of Record

This document is the coordination layer.

The detailed execution lists belong in:

- [22-mockup-production-batches.md](D:/HRMS-doc/docs/10-ui-ux-architecture/22-mockup-production-batches.md)
- [23-screen-ui-template-conversion-batches.md](D:/HRMS-doc/docs/10-ui-ux-architecture/23-screen-ui-template-conversion-batches.md)
