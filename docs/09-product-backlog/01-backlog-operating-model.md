---
id: HRMS-BKL-001
title: Enterprise HRMS Backlog Operating Model
document: 01-backlog-operating-model.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines how the Enterprise HRMS specification library should be translated into a product backlog that can be owned, prioritized, estimated, built, tested, and released.

# 2. Backlog Hierarchy

The recommended backlog hierarchy is:

- `Initiative` - major business outcome or release program such as Core HCM, Time and Payroll, Talent, Intelligence, or Platform
- `Epic` - module-scale deliverable or major platform capability
- `Feature Group` - a coherent slice of business capability, usually aligned to one or more deep sub-modules
- `User Story` - an implementable behavior slice with clear persona, action, and outcome
- `Task` - engineering, design, QA, data, documentation, or release work item needed to complete a story

# 3. Mapping Rules

Backlog conversion should follow these rules:

- Each top-level module in `docs/03-module-specifications` becomes at least one backlog epic
- Each deep sub-module in `docs/08-submodule-specifications` maps to either:
  - a dedicated feature group, or
  - part of a larger tightly coupled feature group if the delivery unit would otherwise be too fragmented
- Cross-cutting standards from `docs/06-cross-cutting-specs` must create explicit enabler work in relevant epics
- Stakeholder journeys from `docs/05-stakeholder-journeys` should be used to shape story flow and acceptance criteria

# 4. Delivery Principles

The backlog should be built around these delivery principles:

- Deliver end-to-end workflows, not isolated screens
- Prefer system-of-record stability before advanced intelligence
- Build control layers early: permissions, workflow, audit, notifications, reporting, and configuration
- Slice stories by usable business outcome, not technical layer alone
- Track every module against business readiness, engineering readiness, QA readiness, and implementation readiness

# 5. Epic Template

Every epic should include:

- Epic ID
- Epic name
- Business objective
- Primary personas
- In-scope feature groups
- Major dependencies
- Data and integration dependencies
- Security and compliance considerations
- Exit criteria
- Suggested release wave

# 6. Feature Group Template

Every feature group should include:

- Feature group ID
- Parent epic
- Outcome statement
- Source module or deep-spec references
- Major workflows covered
- Primary API and data impact
- Test focus
- Dependencies

# 7. User Story Template

Recommended user story pattern:

- As a `<persona>`
- I want `<goal or action>`
- So that `<business outcome>`

Each story should also include:

- Acceptance criteria
- Non-functional expectations where relevant
- Security and permission expectations
- Analytics or event requirements where relevant
- Definition of done references

# 8. Definition of Ready

A story is ready when:

- Persona and outcome are clear
- Source specification references are attached
- Dependencies are identified
- UX approach is known or intentionally deferred
- Acceptance criteria are testable
- Data, API, and permission impact are understood

# 9. Definition of Done

A story is done when:

- Functional behavior is complete
- Required API, database, event, notification, and audit behavior is implemented
- Permission and security behavior is validated
- Unit, integration, and acceptance tests pass
- Documentation and release notes are updated as needed

# 10. Estimation Guidance

Use relative estimation at story level, not epic level.

Suggested estimation anchors:

- `XS` - isolated validation, configuration, or display behavior
- `S` - single workflow step or small data/API change
- `M` - multi-step feature or two-layer change
- `L` - cross-service workflow or significant UI plus backend work
- `XL` - break down further before sprint commitment

# 11. Backlog Ownership

Recommended ownership model:

- Product: epic and feature-group prioritization
- Engineering: technical decomposition and dependency sequencing
- Design: UX flow and interaction readiness
- QA: acceptance coverage and regression strategy
- HR or business SMEs: policy and operational validation
- Implementation: migration, rollout, and tenant readiness

# 12. Suggested Delivery Lanes

Use separate but linked delivery lanes:

- `Business Product Lane`
- `Platform and Shared Services Lane`
- `Data and Integration Lane`
- `Security and Compliance Lane`
- `Implementation and Migration Lane`
- `AI and Intelligence Lane`

# 13. How To Use This Backlog Set

Recommended sequence:

1. Select release wave from `02-release-slicing-and-priority-waves.md`
2. Pull relevant epics from `03-epic-register.md`
3. Expand the module feature groups from `04-module-feature-breakdown.md`
4. Break feature groups into sprint-ready user stories
5. Validate against the detailed module and sub-module specs before build starts
