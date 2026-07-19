---
id: HRMS-UX-025
title: AI Innovation Feature Backlog
document: 25-ai-innovation-feature-backlog.md
version: 1.0
status: Draft
---

# 1. Purpose

This document records approved innovation additions that extend the Enterprise HRMS baseline with governed AI, contextual personalization, and next-generation operational assistance.

# 2. Approved Additions

The following items are now part of the product backlog:

1. Payroll anomaly copilot with explanation and approval routing
2. Manager daily briefing with risk, birthdays, absences, and pending actions
3. AI-generated celebration campaigns for birthdays, anniversaries, and join-date milestones
4. Employee and manager conversational reporting
5. Recognition and quote personalization engine using the Staffsy bot persona `Ridz`

# 3. Feature Mapping

| Feature | Primary Module | Supporting Module(s) | Primary Persona(s) | Scope Type |
|---|---|---|---|---|
| Payroll anomaly copilot with explanation and approval routing | `09 Payroll` | `26 AI and Copilot`, `25 Analytics and BI` | payroll admin, finance approver | new workbench plus dashboard enhancement |
| Manager daily briefing | `05 Manager Self Service` | `15 Employee Experience`, `26 AI and Copilot`, `07 Workforce Management` | manager | dashboard enhancement plus focused workspace |
| AI-generated celebration campaigns | `15 Employee Experience` | `26 AI and Copilot`, `23 Communication Platform` | HRBP, communications admin, manager | new campaign workspace |
| Employee and manager conversational reporting | `26 AI and Copilot` | `25 Analytics and BI`, `05 Manager Self Service`, `04 Employee Self Service` | employee, manager | new AI reporting workspace |
| Recognition and quote personalization engine via `Ridz` | `15 Employee Experience` | `26 AI and Copilot`, `23 Communication Platform` | employee, HR engagement admin | new personalization workspace plus dashboard widgets |

# 4. New Screen Refs

| Screen Ref | Screen Name | Template Bias | Notes |
|---|---|---|---|
| `PAY-SCR-007` | Payroll Anomaly Copilot Workspace | `TX-01`, `DB-03` | queue plus AI explanation and routing |
| `MGR-SCR-008` | Manager Daily Briefing Workspace | `WS-02` | morning control surface for managers |
| `EXR-SCR-005` | Celebration Campaign Studio | `AD-05` | campaign builder plus asset generation |
| `EXR-SCR-006` | Ridz Quote and Recognition Personalization Engine | `AD-02` | quote library, targeting, approval, and publishing |
| `AIC-SCR-006` | Conversational Reporting Workspace | `DB-03` | narrative analytics and governed query results |

# 5. Existing Screen Enhancements

| Existing Screen Ref | Enhancement |
|---|---|
| `EMP-SCR-001` | birthday card widget, quote widget, milestone spotlight |
| `MGR-SCR-001` | daily briefing panel, birthdays, absences, risk summary, pending actions |
| `PAY-SCR-001` | anomaly summary widgets and route backlog indicators |
| `PAY-SCR-003` | anomaly launch point from validation queue |
| `EXR-SCR-002` | celebration trigger and recognition-linked milestone actions |
| `EXR-SCR-003` | festival and occasion content distribution |
| `AIC-SCR-001` | launch point for conversational reporting and guided commands |

# 6. Recommended Condition Codes

- `COND-AI-BRIEFING`
- `COND-ANOMALY-EXPLAINED`
- `COND-ROUTE-PENDING`
- `COND-CELEBRATION-DUE`
- `COND-QUOTE-PERSONALIZED`
- `COND-FESTIVAL-CAMPAIGN`
- `COND-CONVERSATIONAL-RESULT`

# 7. Guardrails

1. AI must never bypass approval workflows, permissions, or audit controls.
2. Photo-based generation must respect consent, geography, and opt-out rules.
3. Morale content should be personalized but must not become noisy or manipulative.
4. Manager briefings must prioritize actionability over decorative information.
5. Payroll anomaly explanations must remain explainable and human-reviewable.
6. Conversational reporting must cite source scope and respect data visibility boundaries.

# 8. Delivery Priority

## `P1`

- Payroll anomaly copilot with explanation and routing
- Manager daily briefing
- Conversational reporting

## `P2`

- Celebration campaign studio
- Ridz quote and recognition personalization engine
