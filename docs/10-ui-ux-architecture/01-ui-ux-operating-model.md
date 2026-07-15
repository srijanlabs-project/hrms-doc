---
id: HRMS-UX-001
title: Enterprise HRMS UI UX Operating Model
document: 01-ui-ux-operating-model.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines how UI and UX should be organized, governed, and delivered across the Enterprise HRMS platform.

# 2. Design Objective

The HRMS UI and UX architecture should:

- Support multiple personas without fragmenting the product experience
- Preserve consistency across modules while allowing domain-specific workflows
- Handle high-density enterprise data without becoming visually overwhelming
- Support desktop-first operational workflows and mobile-friendly employee actions
- Remain configurable, accessible, global-ready, and audit-friendly

# 3. UX Principles

Core experience principles:

- `Role clarity` - every persona should immediately understand what they can act on
- `Action first` - dashboards and pages should prioritize next actions over passive information
- `Context before form` - users should see why they are doing something before entering data
- `State visibility` - request, workflow, and transaction state should always be visible
- `Progressive disclosure` - advanced details should appear when needed, not by default
- `Operational trust` - users should be able to trace who changed what, when, and why
- `No dead ends` - every exception state should show the next possible action

# 4. Persona Experience Layers

The product should be designed around six major experience layers:

- `Employee layer`
  Focus: self-service, visibility, submissions, acknowledgments
- `Manager layer`
  Focus: team actions, approvals, reviews, staffing, escalations
- `HR operations layer`
  Focus: record management, lifecycle changes, exceptions, policy execution
- `Payroll and compliance layer`
  Focus: validation, reconciliation, statutory processing, audit trace
- `Admin and platform layer`
  Focus: setup, configuration, tenant controls, integration monitoring
- `Executive and analytics layer`
  Focus: summarized signals, trends, decisions, drill-downs

## 4.1 Provider and Customer Boundary

For the SaaS edition, the experience model must also separate two operating planes:

- `Provider control plane`
  Used by platform admin, platform ops, platform security, and controlled support roles
- `Customer tenant plane`
  Used by org admin, HR, payroll, managers, employees, and leadership within a single customer tenant

Provider-plane dashboards should focus on tenant lifecycle, platform operations, security, reliability, and governed support access. Customer-plane dashboards should focus on HRMS business operations and tenant-owned configuration.

# 5. Experience Pattern Types

The platform should standardize around these page and interaction patterns:

- `Workspace pages`
  Used for high-volume operational functions such as payroll validation, onboarding, or requisition management
- `Record profile pages`
  Used for employee, contractor, candidate, and asset records
- `Dashboard pages`
  Used for role-based summaries and action queues
- `Wizard flows`
  Used for complex creation steps such as travel requests, onboarding, or promotion flows
- `Review and approval pages`
  Used for decision workflows with context, evidence, and outcomes
- `Configuration consoles`
  Used for admin setup, mappings, forms, masters, settings, and policies
- `Analytics canvases`
  Used for reports, dashboards, drill-down, and comparisons

# 6. Common Screen Anatomy

Recommended base screen anatomy:

- `Global shell`
  Includes tenant branding, global search, notifications, help, and user identity
- `Primary navigation`
  Persona-aware entry to major domains
- `Secondary navigation`
  Module-level sections or tabs
- `Page header`
  Title, status, key identifiers, breadcrumbs, primary actions
- `Context panel`
  Summary, health, approvals, related entities, or progress
- `Main workspace`
  Task grid, form, record details, report, or comparison canvas
- `Activity and audit area`
  Timeline, comments, approvals, events, or history

# 7. State Design Rules

Every important screen should explicitly design for:

- `Loading`
- `Empty`
- `First-use`
- `Success`
- `Validation error`
- `Business rule exception`
- `Permission restricted`
- `System degraded`
- `Archived or inactive`

# 8. UI Governance Model

Recommended governance:

- Shared design patterns and components owned centrally
- Domain-specific screens owned by module product and design owners
- Accessibility and responsive standards enforced across all releases
- Cross-cutting review required for navigation, shell, reporting, workflow, and admin patterns

# 9. Backlog Relationship

This UI and UX section maps directly to:

- `docs/05-stakeholder-journeys`
- `docs/09-product-backlog/03-epic-register.md`
- `docs/09-product-backlog/04-module-feature-breakdown.md`

Recommended design delivery flow:

1. Choose epic and feature group
2. Map journey steps to screens
3. Define screen states and actions
4. Bind components and responsiveness rules
5. Add accessibility and QA acceptance criteria

# 10. Exit Criteria For UX Architecture Readiness

The UI and UX architecture should be considered ready when:

- All major personas have clear navigation model
- Every epic has a screen family and interaction pattern
- Shared components and behaviors are standardized
- Accessibility and responsive rules are defined
- UX acceptance criteria can be attached to engineering stories
