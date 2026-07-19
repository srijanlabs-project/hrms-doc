---
id: HRMS-UX-015
title: Screen Variant and Conditional State Catalog
document: 15-screen-variant-and-conditional-state-catalog.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the variant packs and condition codes used by the Enterprise HRMS mockup program.

It exists so that mockup coverage is driven by explicit rules instead of ad hoc designer judgment.

# 2. Universal State Minimum

Every screen must define at least these states:

- `STATE-DEFAULT`
- `STATE-LOADING`
- `STATE-EMPTY`
- `STATE-ERROR`
- `STATE-RESTRICTED`
- `STATE-INACTIVE`
- `STATE-SUCCESS`
- `STATE-EXCEPTION`

These do not always require separate mockup files. If the structure changes materially, they do.

# 3. Variant File Naming Standard

The recommended mockup asset naming pattern is:

- `{screen-ref}--desktop--default.svg`
- `{screen-ref}--desktop--{condition-code}.svg`
- `{screen-ref}--mobile--default.svg`
- `{screen-ref}--mobile--{condition-code}.svg`

Example:

- `W0-SCR-004--desktop--compare.svg`
- `EMP-SCR-006--mobile--missing-punch.svg`

# 4. Variant Packs

## 4.1 `PK-DASH-01`

Use for:

- dashboards
- admin homes
- command centers
- readiness and executive views

Mandatory variants:

- default
- loading
- empty
- error
- restricted
- alert-heavy or exception-heavy view

Separate mockups required when:

- the card order changes
- the signal strip changes meaningfully
- a setup or alert panel displaces the default content

## 4.2 `PK-QUEUE-01`

Use for:

- inboxes
- approval queues
- review workbenches
- exception queues

Mandatory variants:

- default list
- selected-detail state
- no results or filtered empty state
- error
- restricted
- success or closed state

Separate mockups required when:

- bulk action controls appear
- the right-side detail pane changes to a full-screen view
- decision controls change because of task state

## 4.3 `PK-CONSOLE-01`

Use for:

- settings consoles
- configuration tools
- metadata and policy workspaces
- dense operational consoles

Mandatory variants:

- default browse state
- selected-detail state
- compare state
- error
- restricted
- draft or approval-pending state

Separate mockups required when:

- the layout changes from two- to three-panel
- read-only scope behavior removes edit controls
- compare mode introduces visual diff treatment

## 4.4 `PK-BUILDER-01`

Use for:

- form builders
- template builders
- report builders
- design canvases

Mandatory variants:

- default canvas
- preview state
- validation failure state
- draft state
- published or locked state
- error

Separate mockups required when:

- canvas and preview are split differently
- locked mode removes editing affordances
- unresolved placeholder or validation warnings reflow the page

## 4.5 `PK-PROFILE-01`

Use for:

- record profiles
- document centers
- profile and summary views
- timelines

Mandatory variants:

- default profile view
- edit state where relevant
- empty or missing-data state
- restricted or masked state
- inactive or archived state
- success state after update

Separate mockups required when:

- edit mode changes the page layout materially
- masked or sensitive sections replace normal content blocks
- inactive status adds chronology or banner patterns

## 4.6 `PK-WIZARD-01`

Use for:

- creation flows
- onboarding or lifecycle flows
- import and migration flows
- signing or acknowledgment flows

Mandatory variants:

- start state
- in-progress step
- validation error step
- review and confirm step
- success completion state
- interrupted or resume state

Separate mockups required when:

- step order or step count changes by condition
- review step introduces major summary blocks
- exception handling inserts a new blocking step

## 4.7 `PK-ANALYTICS-01`

Use for:

- analytics dashboards
- drill-down views
- predictive insight screens

Mandatory variants:

- default dashboard
- filter-applied state
- no-data state
- drill-down state
- export state
- restricted metric state

Separate mockups required when:

- filters open a side configuration drawer
- drill-down transforms the canvas significantly
- confidence or warning banners change chart layout

## 4.8 `PK-MONITOR-01`

Use for:

- runtime monitors
- diagnostic consoles
- backup and DR screens

Mandatory variants:

- healthy state
- degraded state
- critical state
- no telemetry or unavailable state
- replay or recovery action state
- restricted state

Separate mockups required when:

- severe incidents introduce emergency actions
- telemetry failures suppress normal charts or grids
- recovery actions open a guided panel or sheet

# 5. Condition Code Catalog

## 5.1 Cross-Cutting Condition Codes

| Code | Meaning | Separate Mockup Required When |

## 5.2 Innovation And AI Condition Codes

| Code | Meaning | Separate Mockup Required When |
|---|---|---|
| `COND-AI-BRIEFING` | AI-generated morning brief, prioritization strip, or guided task summary is visible | the dashboard or workspace adds a new briefing rail, reordered card stack, or AI-prioritized action block |
| `COND-ANOMALY-EXPLAINED` | the system shows anomaly explanation, confidence, and likely root cause | explanation content materially changes the normal validation or review layout |
| `COND-ROUTE-PENDING` | AI or rule-driven routing recommendation is waiting for human confirmation | route preview, approver chain, or decision controls appear that are not present in the default state |
| `COND-CELEBRATION-DUE` | milestone, birthday, anniversary, or join-date celebration becomes active | celebration cards, greeting assets, or approval actions displace the default content blocks |
| `COND-QUOTE-PERSONALIZED` | dashboard or feed content is personalized for role, audience, location, or recent context | the personalized quote, nudge, or recommendation area changes message hierarchy or content placement |
| `COND-FESTIVAL-CAMPAIGN` | a festival, national occasion, or enterprise campaign theme becomes active | themed visuals, targeted message packs, or celebration modules materially alter the default composition |
| `COND-CONVERSATIONAL-RESULT` | AI reporting returns a narrative answer, chart-ready summary, or drill-down result | the reporting surface switches from prompt-entry mode to a structured result, citation, or follow-up state |
|---|---|---|
| `COND-APPROVAL-PENDING` | item cannot be edited until approval completes | approval ribbon or action bar changes materially |
| `COND-COMPARE` | user is comparing two versions or scopes | diff layout introduces new columns, panels, or highlights |
| `COND-DRAFT-PUBLISHED` | draft and published mode differ | draft editing affordances or publish banners shift layout |
| `COND-RESTRICTED-RESULT` | some objects are visible only as limited entries | results preview or table rows mask or remove detail |
| `COND-DEGRADED` | service is partially available | main content is replaced or compressed by incident banners |
| `COND-HIGH-RISK` | elevated security, privacy, or operational risk | risk panels move above normal content |
| `COND-SUPPORT-CONTEXT` | support or delegated access is active | extra boundary banners and scope markers appear |
| `COND-EXECUTIVE-SUMMARY` | same screen must also work for executive readers | layout simplifies operational detail into summary cards |

## 5.2 Workflow and Queue Conditions

| Code | Meaning | Separate Mockup Required When |
|---|---|---|
| `COND-BULK-ACTION` | bulk action controls become visible | header, sticky action bar, or selection states materially change |
| `COND-DETAIL-LOCKED` | detail content is visible but actions are disabled | disabled or alternate action section changes the panel |
| `COND-OVERDUE` | urgency or SLA breach dominates the layout | warning strip or urgency stack changes reading order |
| `COND-RETURNED` | item is sent back for correction | correction reason and response controls reflow the page |
| `COND-CLOSED` | item is completed or archived | decision area is replaced by chronology or evidence summary |

## 5.3 Configuration and Policy Conditions

| Code | Meaning | Separate Mockup Required When |
|---|---|---|
| `COND-READ-ONLY-PROVIDER` | tenant can see but not edit provider-owned settings | action areas and lineage presentation change |
| `COND-BREAKING-CHANGE` | a field or policy change has downstream impact | blocking warnings or impact panels become primary |
| `COND-USAGE-BLOCKER` | master data or policy cannot change because it is in use | page displays hard-stop warnings and alternative actions |
| `COND-ROLLBACK` | rollback view or history-driven recovery is active | rollback actions and evidence sections appear |

## 5.4 People and Workforce Conditions

| Code | Meaning | Separate Mockup Required When |
|---|---|---|
| `COND-INCOMPLETE-PROFILE` | employee or candidate profile is missing required data | completion checklist changes top-of-page structure |
| `COND-SENSITIVE-VIEW` | sensitive data requires masking or reveal path | content blocks change from normal display to protected view |
| `COND-EFFECTIVE-DATED` | current and future-dated records coexist | date-rail, comparison, or chronology changes structure |
| `COND-MISSING-PUNCH` | attendance exception is active | exception prompt or correction controls alter content order |
| `COND-BALANCE-LOW` | leave or benefit balance is at risk | warning strip or next-action block becomes dominant |

## 5.5 Recruitment and Review Conditions

| Code | Meaning | Separate Mockup Required When |
|---|---|---|
| `COND-STAGE-BLOCK` | candidate or requisition cannot progress | blocker status and remediation controls alter the workbench |
| `COND-OFFER-EXPIRED` | offer or approval has lapsed | action set changes from progress to reopen or close |
| `COND-CALIBRATION` | review enters talent or performance calibration | summary blocks or matrix views change materially |
| `COND-BGV-PENDING` | background verification blocks movement | evidence and pending check panels become primary |

## 5.6 Migration and Operations Conditions

| Code | Meaning | Separate Mockup Required When |
|---|---|---|
| `COND-IMPORT-PREVIEW` | staged data is previewed before commit | row-level validation grid becomes the primary plane |
| `COND-ROW-ERROR` | import or migration row issues exist | defect and correction panels materially reshape the page |
| `COND-SIGNOFF-PENDING` | business signoff blocks progression | signoff panel changes the workspace structure |
| `COND-CHECKPOINT-HOLD` | cutover pauses at a checkpoint | hold-state actions and decision banners dominate the page |
| `COND-ROLLBACK-TRIGGERED` | rollback path is activated | forward actions disappear and recovery sequence becomes primary |

# 6. Mockup Production Rule

A condition should get its own mockup file when any of these are true:

- the layout grid changes
- the main action bar changes
- the navigation path changes
- the page prioritization changes
- a warning or blocker becomes the primary focus
- role or scope changes remove major sections

If none of those are true, the condition may be handled as:

- annotated overlay notes
- callout annotations on the default mockup
- state thumbnails in the companion spec

# 7. Recommended Production Order

The recommended order for creating the full mockup program is:

1. finish all remaining Wave `0` screens
2. complete Wave `1` employee, manager, and people-core screens
3. complete Wave `2` workforce, leave, payroll, and compliance screens
4. complete Wave `3` recruitment and talent screens
5. complete Wave `4` enterprise service screens
6. complete Wave `5` analytics and intelligence screens
