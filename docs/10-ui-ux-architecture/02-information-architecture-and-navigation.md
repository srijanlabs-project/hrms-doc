---
id: HRMS-UX-002
title: Enterprise HRMS Information Architecture and Navigation
document: 02-information-architecture-and-navigation.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the information architecture and navigation model for the Enterprise HRMS application.

# 2. Navigation Model

The recommended navigation model is:

- `Global shell`
- `Persona-aware primary navigation`
- `Module-level secondary navigation`
- `Record-level local navigation`
- `Contextual actions and shortcuts`

# 3. Global Shell

The global shell should contain:

- Tenant and product identity
- Global search
- Universal create or request entry where appropriate
- Notifications inbox
- Pending approvals or tasks
- Help and support entry
- User profile, role switch, and delegated mode indicator

# 4. Persona-Aware Primary Navigation

Recommended primary navigation groups:

- `Home`
- `People`
- `Organization`
- `Time and Leave`
- `Payroll and Compliance`
- `Talent`
- `Employee Services`
- `Analytics`
- `Platform and Admin`

Persona behavior:

- Employees see a simplified task-oriented version
- Managers see team and approval oriented entry points
- HR operations see domain-driven functional navigation
- Payroll and compliance users see execution and validation flows
- Admins see platform setup, controls, and monitoring sections

# 5. Secondary Navigation By Domain

Recommended secondary patterns:

- `People`
  Employee profile, lifecycle actions, documents, timeline
- `Recruitment`
  demand, requisitions, sourcing, screening, interviews, offers
- `Workforce`
  attendance, shifts, rosters, schedules, overtime, timesheets
- `Payroll`
  setup, runs, validation, arrears, settlement, statutory
- `Performance`
  cycles, goals, reviews, feedback, calibration
- `Administration`
  forms, fields, masters, settings, localization, tenants
- `Platform`
  workflows, notifications, audit, events, integrations, AI

# 6. Record-Level Navigation

Record profiles should use predictable tab patterns:

- `Summary`
- `Details`
- `History`
- `Documents`
- `Approvals or Activity`
- `Related Records`
- `Audit`

Examples:

- Employee profile
  summary, employment, compensation, documents, timeline, audit
- Candidate profile
  summary, applications, interviews, documents, offer, activity
- Requisition profile
  summary, approvals, candidates, interviews, analytics, history

# 7. Navigation Rules

Rules for navigation consistency:

- Every major domain should be reachable in at most two primary navigation steps
- Primary actions should appear in the same location across comparable screen families
- Breadcrumbs should exist for admin, configuration, and deep record views
- Cross-module navigation should preserve business context when possible
- Delegated mode and role-switched mode must always be visually obvious

# 8. Recommended Search Model

Global search should support:

- Employee
- Candidate
- Requisition
- Ticket or case
- Document
- Policy
- Report or dashboard
- Admin artifact such as form, field, or master

Search result behavior:

- Result grouping by object type
- Role-aware filtering
- Recent and pinned results
- Safe masking for sensitive objects

# 9. Navigation By Device Type

Desktop:

- Persistent left navigation with expandable module groups
- Dense workspace layouts and split views

Tablet:

- Collapsible primary navigation
- Simplified multi-column views

Mobile:

- Task-first home
- Limited primary tabs
- Deep actions via progressive flows instead of dense tables

# 10. High-Risk Navigation Areas

Special design attention is required for:

- Payroll execution and validation
- Employee lifecycle changes
- Recruitment pipeline movement
- Configuration and tenant administration
- Analytics drill-down and sensitive data views
- Incident and emergency response flows

# 11. IA Outcome

This information architecture should be used as the baseline for screen inventory, wireframes, component selection, and design backlog decomposition.
