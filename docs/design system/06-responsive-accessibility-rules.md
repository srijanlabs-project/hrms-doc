# 06. Responsive and Accessibility Rules

## 1. Responsive Breakpoints

- `mobile-sm` `0-374px`
- `mobile` `375-767px`
- `tablet` `768-1023px`
- `laptop` `1024-1439px`
- `desktop` `1440px+`

## 2. Responsive Principles

- desktop is the primary baseline for admin and operational surfaces
- mobile is first-class for employee and manager actions
- tablet is a responsive adaptation layer, not a separate product

## 3. Responsive Transformation Rules

### 3.1 Desktop to Mobile

- multi-column dashboards become stacked content zones
- dense tables convert to prioritized row cards
- right rails move into drawers, accordions, or secondary sheets
- bulk actions become overflow actions
- persistent sidebars collapse into menu plus bottom nav patterns

### 3.2 Do Not Collapse

The following information must remain visible even on small screens:

- primary page title
- current workflow status
- due-date or SLA risk
- high-severity error state
- primary action
- permissions or restrictions that affect the current action

## 4. Accessibility Baseline

Target baseline:

- WCAG `2.2 AA`

## 5. Accessibility Rules

### 5.1 Color and Contrast

- normal text contrast minimum:
  `4.5:1`
- large text contrast minimum:
  `3:1`
- controls and focus indicators must remain visible without relying only on hue

### 5.2 Keyboard Access

- every actionable control must be keyboard reachable
- drawers, modals, and menus must trap focus correctly
- tables must support practical keyboard movement where row action is required

### 5.3 Screen Reader Rules

- every icon-only action needs an accessible name
- form validation must be announced clearly
- badges with meaning must expose text equivalents
- charts require summary text or data table fallback

### 5.4 Focus Treatment

Focus style:

- visible `2px` primary ring
- minimum contrast against both white and teal surfaces
- never remove focus indicators for visual polish

### 5.5 Touch Targets

- minimum target size:
  `44x44px`

Use especially for:

- mobile quick actions
- icon-only buttons
- chips and segmented controls
- bottom nav items

### 5.6 Motion

- respect reduced-motion preferences
- loading shimmer and chart animation must degrade cleanly
- avoid motion that blocks task completion

## 6. Accessibility for HRMS-Specific Scenarios

### 6.1 Dense Tables

- preserve row identification through text, not color only
- maintain sort state visibility
- provide row summary alternatives on mobile

### 6.2 Stepper and Workflow

- current step must be announced in text
- completed, active, and blocked states need textual distinction

### 6.3 Validation

- invalid field should include inline message plus summary where the form is long
- message should state what is wrong and how to fix it

### 6.4 AI Components

- AI-generated content must be announced as AI-generated
- confidence and caution states must be accessible in text
- response panels need clear heading structure

## 7. QA Acceptance Rules

Each released screen should be checked for:

- contrast
- keyboard navigation
- screen-reader naming
- focus visibility
- reduced-motion behavior
- responsive behavior across breakpoint set
- readable data density on both desktop and mobile
