---
id: HRMS-UX-004
title: Enterprise HRMS Design System and Component Matrix
document: 04-design-system-and-component-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the recommended component and pattern system for the Enterprise HRMS UI.

# 2. Design System Goals

The design system should:

- Support high-volume enterprise workflows
- Preserve consistency across many domains
- Be configurable and localization-friendly
- Support accessibility and responsive behavior by default
- Reduce custom one-off UI patterns

# 3. Core Component Categories

Recommended component groups:

- `Shell and navigation`
- `Data display`
- `Forms and inputs`
- `Workflow and status`
- `Communication and feedback`
- `Analytics and visualization`
- `Admin and configuration`

# 4. Shell and Navigation Components

Core components:

- App shell
- Left navigation
- Top navigation
- Breadcrumbs
- Global search
- Notification center
- Task tray
- Record tab navigation

# 5. Data Display Components

Core components:

- Data table
- Tree table
- Profile summary card
- Timeline
- Comparison panel
- KPI card
- Expandable detail drawer
- Audit diff viewer

# 6. Form and Input Components

Core components:

- Text and number inputs
- Date and time controls
- Searchable lookup
- Multi-select and tag selector
- Repeater group
- Dynamic section renderer
- File uploader
- Inline validation helper

# 7. Workflow and Status Components

Core components:

- Approval ribbon
- Status badge
- SLA timer
- Progress tracker
- Assignment indicator
- Exception banner
- Risk flag
- Checklist block

# 8. Communication and Feedback Components

Core components:

- Toast and inline alert
- Comment thread
- Activity panel
- Confirmation modal
- Escalation prompt
- Notification card

# 9. Analytics and Visualization Components

Core components:

- Trend chart
- Comparison chart
- Heatmap
- Funnel chart
- Pivot table
- Drill-down drawer
- Filter chip bar

# 10. Component Matrix By Experience Type

Recommended primary components by screen family:

- `Dashboard screens`
  KPI cards, task lists, trend charts, alerts, approval ribbons
- `Profile screens`
  summary card, tab navigation, timeline, documents panel, audit panel
- `Operational workbenches`
  dense tables, filter bars, split panes, side drawers, bulk actions
- `Approval screens`
  context panel, decision buttons, rationale form, history timeline
- `Admin screens`
  tree tables, schema editors, version history, configuration diff views
- `Analytics screens`
  charts, filters, saved views, drill-down panes, exports

# 11. Component Rules

Rules:

- Use the same approval action layout across all approval screens
- Use the same table behavior for sorting, filtering, and export
- Use the same timeline structure for employee, candidate, workflow, and audit history where possible
- Use the same empty-state and error-state language patterns across modules

# 12. Responsive Guidance

Desktop-first components:

- Data tables
- Workbenches
- Multi-panel approvals
- Admin consoles

Mobile-priority components:

- Requests
- Approvals
- Notifications
- Profile updates
- Learning and acknowledgment flows

# 13. Design System Outcome

This matrix should be used as the shared UI contract for design and frontend engineering, and later expanded into actual component documentation or a coded design system.

# 14. Detailed Design System Pack

The detailed `Staffsy` design-system documentation pack now exists in:

- [README.md](<D:/HRMS-doc/docs/design system/README.md>)
- [01-brand-identity.md](<D:/HRMS-doc/docs/design system/01-brand-identity.md>)
- [02-foundations-color-type-layout.md](<D:/HRMS-doc/docs/design system/02-foundations-color-type-layout.md>)
- [03-components-core-ui.md](<D:/HRMS-doc/docs/design system/03-components-core-ui.md>)
- [04-dashboard-ai-and-data-patterns.md](<D:/HRMS-doc/docs/design system/04-dashboard-ai-and-data-patterns.md>)
- [05-screen-templates.md](<D:/HRMS-doc/docs/design system/05-screen-templates.md>)
- [06-responsive-accessibility-rules.md](<D:/HRMS-doc/docs/design system/06-responsive-accessibility-rules.md>)
- [07-design-tokens.md](<D:/HRMS-doc/docs/design system/07-design-tokens.md>)
- [staffsy-design-tokens.json](<D:/HRMS-doc/docs/design system/staffsy-design-tokens.json>)

This UI UX matrix should remain the summary contract, while the dedicated pack becomes the implementation-depth visual standard.
