---
id: HRMS-UX-003
title: Enterprise HRMS Screen Inventory and Experience Map
document: 03-screen-inventory-and-experience-map.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the baseline screen inventory for the Enterprise HRMS application at a planning and architecture level.

# 2. Screen Families

The application should be decomposed into these screen families:

- `Global shell screens`
- `Dashboard screens`
- `Record profile screens`
- `Creation and wizard screens`
- `Operational workbench screens`
- `Approval and review screens`
- `Admin and configuration screens`
- `Analytics and report screens`

# 3. Core Global Screens

Shared global screens:

- Home dashboard
- Notifications center
- Global search results
- Task and approvals inbox
- Help and support center
- Profile and delegation switch

# 4. Major Persona Screen Sets

## Employee

- Employee home
- My profile
- My documents
- My requests
- My payslips and tax views
- My leave and attendance
- My goals and learning
- My benefits and claims

## Manager

- Team dashboard
- Manager daily briefing workspace
- Team people list
- Manager approvals
- Performance review workspace
- Hiring approval workspace
- Team leave and attendance overview
- Mobility proposal workspace

## HR Operations

- Employee master workbench
- Lifecycle change workbench
- Onboarding and preboarding console
- Document verification queue
- Data correction and exception queue

## Recruiter and Talent

- Requisition workbench
- Candidate pipeline board
- Candidate profile
- Interview scheduler
- Offer workspace
- Talent review workspace

## Payroll and Compliance

- Payroll control center
- Payroll run details
- Validation queue
- Payroll anomaly copilot workspace
- Statutory workbench
- Compliance calendar
- Retro and settlement workspace

## AI and Experience Innovation

- Conversational reporting workspace
- Celebration campaign studio
- Ridz quote and recognition personalization engine

## Admin and Platform

- Workflow admin
- Notification admin
- Form builder
- Field and master admin
- Settings console
- Tenant management
- Organization admin home
- Integration monitoring
- Audit explorer

## Leadership and Analytics

- Executive dashboard
- Workforce analytics
- Attrition analytics
- Custom reporting
- Predictive insight views

# 5. Screen Inventory By Epic

## `E00` Foundation and Platform

- Configuration catalog
- Metadata explorer
- Document template builder
- Audit explorer
- Event bus monitor
- AI platform console
- Localization runtime diagnostics

## `E02` People Management

- Employee profile summary
- Employment details workspace
- Identity and compliance panel
- Bank and tax maintenance screens
- Documents center
- Employee timeline
- Lifecycle action wizard

## `E06` Recruitment and ATS

- Manpower planning board
- Requisition profile and approval view
- Career portal pages
- Candidate portal
- Screening workbench
- Interview scheduling board
- Offer approval and issue workspace

## `E09` Payroll

- Payroll setup screens
- Payroll run dashboard
- Validation workbench
- Payroll anomaly copilot workspace
- Retro and arrears case view
- Full and final settlement screen

## `E15` Employee Experience Innovation

- Celebration campaign studio
- Quote and recognition personalization engine
- Birthday and milestone greeting generation flow

## `E26` AI and Conversational Experience

- Conversational reporting workspace
- Manager daily briefing workspace
- Payroll anomaly explanation and routing workspace

## `E28` Administration

- Dynamic form designer
- Dynamic field catalog
- Dynamic master console
- Localization bundle manager
- System settings console
- Organization admin dashboard

# 6. Experience Density Guidelines

Use these density patterns:

- `High-density`
  payroll, compliance, admin, analytics, scheduling
- `Medium-density`
  HR operations, recruitment, talent, documents
- `Low-density`
  employee self-service, manager approval shortcuts, mobile-first flows

# 7. Mandatory Screen States

Every planned screen should define:

- Default state
- Loading state
- Empty state
- Error state
- Permission-restricted state
- Archived or inactive state
- Success confirmation state
- Exception or escalation state

# 8. Design Handoff Use

This screen inventory should be used to:

- Estimate design effort by epic
- Break feature groups into page-level design work
- Drive wireframe sequencing
- Define frontend routing and navigation structure
