---
id: HRMS-UX-009
title: Enterprise HRMS Wave 0 Wireframe Ready Page Definition 018 Organization Admin Dashboard
document: 09-wave-0-wireframe-ready-page-definition-018-organization-admin-dashboard.md
version: 1.0
status: Draft
---

# 1. Purpose

This document expands `W0-SCR-018` from the Wave 0 screen backlog into a wireframe-ready page definition for the customer-side `Org Admin` landing experience.

# 2. How To Use

This page definition should be used by:

- product to validate customer-admin scope
- UX and UI teams to prepare wireframes and annotated screens
- frontend engineering to plan page zones, components, states, and permissions
- QA to derive scenario coverage and role-boundary acceptance checks

# 3. Control-Boundary Note

This screen belongs to the `customer tenant plane`, not the provider control plane.

Therefore:

- it should expose only tenant-scoped controls
- it may show provider-managed status signals when relevant to the customer
- it should not expose cross-tenant platform operations, global package controls, or provider-only administration actions

# 4. W0-SCR-018 Organization Admin Dashboard

## 4.1 Screen Intent

Provide the top customer-owned administrator with a tenant-scoped command view for organization setup, identity readiness, module enablement, branding, quota awareness, compliance reminders, and recent admin activity.

## 4.2 Primary Users

- org admin
- tenant implementation lead
- delegated HR or IT admin with scoped access

## 4.3 Entry Points

- default landing page after org-admin sign-in
- navigation item: `Admin Home`
- redirect from setup or compliance reminder
- deep link from notification, approval, or failed publish event

## 4.4 Page Layout Zones

### Zone A - Tenant Global Shell

- tenant branding and logo
- current organization or tenant name
- environment or tenant-state badge
- global search
- notifications
- task inbox
- help and support entry
- user profile and delegation switch

### Zone B - Header and Control Strip

- page title: `Organization Admin Home`
- legal entity or primary company summary
- tenant health badge
- last configuration publish timestamp
- quick actions:
  - `Review setup gaps`
  - `Open access and roles`
  - `Open tenant settings`

### Zone C - Critical Admin Signals

- identity and SSO readiness
- pending admin approvals count
- publish or sync failure count
- quota or usage warning count
- compliance reminder count

### Zone D - Setup Progress and Open Actions

- implementation or readiness checklist
- incomplete mandatory setup items
- expiring certificates or connectors affecting this tenant
- policy or workflow publish tasks awaiting action

### Zone E - Tenant Configuration Health Grid

- org structure and location setup card
- access and role governance card
- workflow and approval configuration card
- forms and data-extension card
- branding and communication templates card
- integrations and identity sync card

### Zone F - Usage and Adoption Panel

- active users and last-login trend
- module enablement and adoption overview
- storage, document, or quota consumption
- high-friction or low-adoption admin features

### Zone G - Governance and Trust Panel

- recent access changes
- export or privacy-sensitive actions awaiting review
- retention or document-policy reminders
- audit or support-session visibility for the tenant

### Zone H - Recent Admin Activity Timeline

- recent config publishes
- role assignment changes
- identity sync outcomes
- import or migration actions
- notable admin comments or escalations

## 4.5 Wireframe Skeleton

```text
+--------------------------------------------------------------------------------------+
| Tenant Shell: Brand | Search | Notifications | Tasks | Help | Profile               |
+--------------------------------------------------------------------------------------+
| Organization Admin Home        Tenant: Acme India   Status: Active   10:42 AM       |
| [Review Setup Gaps] [Open Access and Roles] [Open Tenant Settings]                  |
+--------------------------------------------------------------------------------------+
| Signals: SSO Ready | Pending Approvals | Publish Failures | Quota Warnings          |
+--------------------------------------------------------------------------------------+
| Setup Progress and Open Actions   | Tenant Configuration Health                      |
| - Incomplete setup items          | [Org Structure] [Access] [Workflow]             |
| - Expiring connector or cert      | [Forms] [Branding] [Integrations]               |
| - Publish tasks awaiting action   |                                                  |
+-----------------------------------+--------------------------------------------------+
| Usage and Adoption                | Governance and Trust                             |
| - Active users                    | - Recent access changes                          |
| - Module adoption                 | - Export or privacy review                       |
| - Quota consumption               | - Retention reminder                             |
+-----------------------------------+--------------------------------------------------+
| Recent Admin Activity Timeline                                                      |
+--------------------------------------------------------------------------------------+
```

## 4.6 Component Inventory

- tenant-aware app shell
- KPI or signal cards
- readiness checklist panel
- action queue list
- configuration-health cards
- adoption summary cards
- governance alert list
- timeline component
- contextual empty-state banners

## 4.7 Key Interactions

- open an incomplete setup item and return without losing dashboard context
- drill from a signal card into filtered records or settings
- open a configuration area in tenant scope directly from a health card
- review a governance alert with reason, owner, due date, and next action
- switch delegated role where permitted and refresh widgets accordingly
- view provider-managed status messages in read-only mode when they affect the tenant

## 4.8 Required States

- default healthy configuration view
- first-time setup view with checklist emphasis
- approval-heavy view
- degraded connector or identity-sync view
- quota-warning view
- permission-restricted widget view
- archived or suspended tenant view
- partial data unavailable view

## 4.9 Responsive Behavior

Desktop:

- two-column dashboard with health grid visible above fold
- setup checklist and governance panel both visible without deep scrolling

Tablet:

- stack setup panel above health grid
- convert activity timeline into condensed list

Mobile:

- prioritize critical signals, setup tasks, and governance alerts
- convert health grid into vertical card list
- move secondary adoption analytics below primary action content

## 4.10 Accessibility Focus

- setup status and risk must not rely on color alone
- each health card requires clear title, status text, and next-action label
- signal cards, alerts, and timeline items must be keyboard reachable
- delegated role or restricted-scope mode must be explicit in text
- provider-managed informational banners must be distinguishable from tenant-actionable alerts

## 4.11 Acceptance Checklist

- org admin can identify the top setup or risk actions in one screen view
- no provider-only controls are shown on the page
- each signal card leads to a role-safe filtered destination
- tenant health, tenant status, and current scope are always visible
- permission restrictions degrade gracefully without making the page look broken
- adoption signals do not overshadow urgent compliance, access, or setup actions

# 5. UX Notes For Wireframing

Recommended emphasis for visual hierarchy:

- show setup or compliance blockers before informational analytics
- use distinct card groups for `Act now`, `Configuration health`, and `Observe`
- keep tenant identity and status persistently visible
- treat governance and privacy alerts as high-trust content with stronger emphasis than generic usage metrics

# 6. Boundary Acceptance Rules

The final wireframe should make these boundaries obvious:

- this page is owned by the customer-side org admin
- platform-wide health is visible only when it directly affects this tenant
- leave requests, requisitions, payroll queues, and other business transactions should route to their own persona dashboards or workbenches
- provider-side actions such as tenant creation, cross-tenant inventory, global package management, or privileged support tooling must not appear here
