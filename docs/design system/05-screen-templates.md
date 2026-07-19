# 05. Screen Templates

## 1. Purpose

These templates define the standard structural frames to be reused across the HRMS application.

They are not pixel-perfect Figma frames. They are reusable screen archetypes for design and development consistency.

## 2. Template Index

- `T-001` Employee home
- `T-002` Manager dashboard
- `T-003` HR operations workbench
- `T-004` Employee profile and record workspace
- `T-005` Multi-step wizard
- `T-006` Approval and decision screen
- `T-007` Admin console
- `T-008` Analytics dashboard
- `T-009` Mobile self-service home
- `T-010` AI assistant drawer and explainability view

## 3. `T-001` Employee Home

Purpose:

- personalized landing page for employees after login

Core zones:

- global header
- role-aware sidebar
- welcome banner
- quick actions
- KPI cards
- priorities
- pending approvals or requests
- meetings or updates
- AI recommendations

Primary behavior:

- action-first
- light personalization
- clear self-service shortcuts

## 4. `T-002` Manager Dashboard

Purpose:

- single control surface for team oversight and action

Core zones:

- team KPIs
- approvals
- attendance and leave watch
- hiring or mobility actions
- talent or performance follow-ups

Primary behavior:

- prioritize decisions over passive reporting

## 5. `T-003` HR Operations Workbench

Purpose:

- high-density operational processing screen

Core zones:

- search and filters
- metric strip
- main queue or table
- selected detail pane
- action rail
- audit or activity context

Used for:

- document verification
- lifecycle changes
- exception management
- onboarding workbench
- payroll exception handling

## 6. `T-004` Employee Profile and Record Workspace

Purpose:

- trusted system of record with history and governance

Core zones:

- identity header
- section tabs
- record summary
- detail panel
- related documents
- timeline
- change or reveal actions

## 7. `T-005` Multi-Step Wizard

Purpose:

- structured creation or change flows

Core zones:

- stepper
- current step content
- side summary
- validation summary
- action footer

Used for:

- onboarding
- lifecycle changes
- imports
- travel
- setup flows

## 8. `T-006` Approval and Decision Screen

Purpose:

- make decisions with enough context and audit confidence

Core zones:

- request summary
- risk or impact panel
- supporting evidence
- approval route
- rationale form
- action footer

## 9. `T-007` Admin Console

Purpose:

- manage configuration, governance, and runtime controls

Core zones:

- console header
- object list or tree
- edit pane
- compare or version area
- dependency or risk panel

## 10. `T-008` Analytics Dashboard

Purpose:

- convert people data into action-ready insight

Core zones:

- filters
- KPI strip
- trend charts
- exception or recommendation list
- drill-down panel

## 11. `T-009` Mobile Self-Service Home

Purpose:

- compress the employee home into a fast action stack

Core zones:

- top app bar
- greeting
- KPI tiles
- quick action row
- top tasks
- approvals
- AI recommendation card
- bottom navigation

## 12. `T-010` AI Assistant Drawer and Explainability View

Purpose:

- support AI interaction without replacing application navigation

Core zones:

- prompt entry
- response panel
- source context
- confidence and caution
- next actions
- feedback controls

## 13. Template Governance

Rules:

- do not create one-off layouts when an existing template can be extended
- template changes should update this document
- module-specific styling must not break system spacing, typography, or interaction rules
