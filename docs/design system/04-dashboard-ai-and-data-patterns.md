# 04. Dashboard, AI, and Data Patterns

## 1. Dashboard Widgets

### 1.1 Widget Families

- KPI metric card
- trend widget
- approval queue widget
- task list widget
- meeting or calendar widget
- company updates widget
- recommendations widget
- birthdays or people widget
- holiday widget
- service health widget

### 1.2 Widget Rules

- each widget must answer one question clearly
- widgets should be reorderable only where personalization is enabled
- dashboard density should vary by persona
- employee dashboards should optimize task clarity and self-service
- admin dashboards should optimize exceptions, approvals, and workload

## 2. KPI Card Standard

KPI cards should include:

- label
- current value
- context period
- optional trend or benchmark
- optional action link

Examples:

- leave balance
- attendance status
- payroll ready count
- pending approvals
- attrition risk count

## 3. Queue and Workbench Pattern

High-volume operations screens should follow a standard pattern:

- search plus filter row
- metric strip
- main results plane
- contextual detail panel or drawer
- bulk action capability
- visible permissions and workflow state

This pattern applies to:

- approvals
- payroll exceptions
- recruitment reviews
- contractor compliance
- document verification
- incident management

## 4. AI Components

### 4.1 AI Component Types

- AI copilot launcher
- AI action button
- AI recommendation card
- AI explanation panel
- AI confidence badge
- AI draft assistant
- AI conversation drawer
- AI anomaly alert
- AI summary banner

### 4.2 AI Design Rules

- AI output must be visually distinct from system facts
- every AI recommendation needs:
  recommendation, rationale, confidence, and next action
- AI should never visually imply automatic approval of payroll, compliance, or identity actions
- AI confidence must use labels plus numeric or graded value where relevant
- AI feedback actions should include:
  accept, reject, edit, ask why, or assign owner

### 4.3 AI Safety Cues

Use visible cues for:

- `Recommended by AI`
- `Needs human review`
- `Low confidence`
- `Sensitive data hidden`
- `Draft only`

## 5. Charts and Analytics Patterns

### 5.1 Chart Types

- line chart
- bar chart
- donut chart
- area trend
- distribution chart
- heatmap
- funnel

### 5.2 Chart Rules

- use charts for pattern recognition, not raw row inspection
- every chart needs a comparable time or segment context
- never rely on color alone for series identity
- charts with high business risk should include drill-down or explanation path
- executive charts should show insight before technical complexity

## 6. Insight Pattern

Insight block anatomy:

- title
- short diagnosis
- driver explanation
- business implication
- recommended next action
- owner or reviewer action

## 7. Badge and Avatar Patterns

Badge types:

- neutral
- info
- success
- warning
- error
- new
- pending
- blocked

Avatar rules:

- use person image when available
- fallback to initials in role-safe neutral colors
- avatar groups should cap visible items and show overflow count

## 8. Data-Dense Content Rules

When the surface is operationally dense:

- preserve whitespace through grouping, not oversized spacing
- keep filters and summary metrics above the fold
- use fixed row actions and status placement
- keep the right rail for explanation, audit, or detail context
