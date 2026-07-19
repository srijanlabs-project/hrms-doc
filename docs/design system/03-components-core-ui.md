# 03. Core UI Components

## 1. Icons

Icon style:

- outline-first
- rounded stroke geometry
- low visual noise
- consistent `1.75px` to `2px` stroke weight

Sizes:

- `16px` dense utility
- `20px` standard control
- `24px` navigation and cards
- `32px` feature tiles

Rules:

- do not mix filled and outline icons in the same control group unless state requires it
- use semantic color only when the icon carries status meaning
- decorative icons should inherit current text color or neutral tone

## 2. Buttons

### 2.1 Button Types

- `Primary`
- `Secondary`
- `Ghost`
- `Text`
- `Danger`
- `Success`
- `AI`

### 2.2 Button States

- default
- hover
- pressed
- focus
- disabled
- loading

### 2.3 Button Sizes

- `sm` height `32px`
- `md` height `40px`
- `lg` height `44px`
- `xl` height `48px`

### 2.4 Usage Rules

- one primary action per local action group
- use `AI` buttons only when they trigger assistant behavior, recommendation, explanation, or draft generation
- dangerous irreversible actions must use `Danger` plus confirm flow
- icon-only buttons require tooltip or accessible name

## 3. Forms

### 3.1 Input Family

- text input
- number input
- phone input with country prefix
- email input
- password input
- textarea
- search field
- date picker
- date range picker
- time picker
- date-time picker
- select
- searchable lookup
- multi-select
- tag selector
- radio group
- checkbox
- toggle switch
- segmented control
- file upload

### 3.2 Field Anatomy

- label
- optional helper text
- input surface
- prefix or suffix affordance where relevant
- validation message
- success or error state

### 3.3 Form Rules

- labels remain visible above the field for enterprise forms
- placeholders must never act as the only label
- required state should be indicated consistently
- error messages should explain the fix, not just the problem
- long forms must be sectioned with visible grouping titles
- high-risk changes should use review and compare states before submit

## 4. Cards

Card families:

- default content card
- stat card
- activity card
- AI insight card
- profile summary card
- approval summary card
- compact list card

Card anatomy:

- optional icon or badge
- title
- optional subtitle
- main content
- optional action row

Rules:

- avoid stacking too many nested cards inside cards
- KPI cards must prioritize number, label, and trend in that order
- AI cards must always distinguish advice from system truth

## 5. Tables

### 5.1 Table Types

- standard data table
- dense operational table
- tree table
- comparison table
- payroll result table
- audit table

### 5.2 Table Features

- sticky header
- column sort
- filters
- search
- pagination
- row selection
- bulk action
- expandable detail
- export state

### 5.3 Table Rules

- row actions should remain stable across modules
- destructive bulk actions require confirmation
- dense workbench tables should support saved views
- mobile must convert dense tables into stacked row cards or prioritized summaries

## 6. Navigation

### 6.1 Navigation Layers

- top global header
- sidebar navigation
- breadcrumb
- tab navigation
- bottom mobile navigation
- contextual sub-navigation

### 6.2 Navigation Rules

- platform and org navigation must remain visibly different
- left nav should use grouping labels for dense systems
- current location must be visually obvious without relying on color alone
- badge counts must remain purposeful and not become noise

## 7. Status Components

- status badge
- progress chip
- SLA timer
- risk flag
- due-date marker
- approval stepper
- lifecycle ribbon

Rules:

- do not use only red/green for meaning
- every status must include a text label
- time-sensitive states should show both label and date or duration

## 8. Feedback Components

- toast
- inline alert
- banner
- modal confirmation
- success strip
- validation summary
- empty state

Rules:

- success feedback should be compact
- warnings and errors should be actionable
- empty states should explain what to do next

## 9. File and Document Components

- upload dropzone
- upload queue row
- verification state chip
- file preview card
- version history list
- restricted download notice

Rules:

- sensitive-file restrictions should be explicit
- file virus or format issues should appear before final submit
- version lineage should remain human-readable
