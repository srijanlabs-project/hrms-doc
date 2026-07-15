---
id: HRMS-UX-README
title: Enterprise HRMS UI UX Architecture
document: README.md
version: 1.1
status: Draft
---

# UI UX Architecture

This section converts the completed Enterprise HRMS specification library into a structured UI and UX architecture repository for design, frontend engineering, product, QA, and implementation teams.

Documents:

- `01-ui-ux-operating-model.md`
- `02-information-architecture-and-navigation.md`
- `03-screen-inventory-and-experience-map.md`
- `04-design-system-and-component-matrix.md`
- `05-journey-to-screen-mapping.md`
- `06-ux-acceptance-accessibility-and-responsive-checklist.md`
- `07-wave-0-screen-by-screen-design-backlog.md`
- `08-wave-0-wireframe-ready-page-definitions-001-005.md`
- `09-wave-0-wireframe-ready-page-definition-018-organization-admin-dashboard.md`
- `10-platform-vs-org-screen-ownership-matrix.md`
- `11-full-wireframe-ready-screen-pack.md`
- `12-pixel-ready-mockup-system-and-annotation-standard.md`
- `13-wave-0-pixel-ready-annotated-mockup-pack.md`
- `14-screen-mockup-master-registry.md`
- `15-screen-variant-and-conditional-state-catalog.md`
- `16-wave-0-wireframe-ready-page-definitions-006-010.md`
- `17-module-submodule-to-screen-coverage-matrix.md`
- `18-screen-coverage-gap-checklist.md`
- `19-screen-surface-decomposition-standard.md`

Important boundary note:

- provider-side `Platform Admin` experiences belong to the SaaS control plane
- customer-side `Org Admin` experiences belong to the tenant plane
- HRMS business workflows such as leave, requisition, payroll, or employee actions should not be centered on the provider-side platform admin home

Recommended usage:

- Product and design leads: start with `01-ui-ux-operating-model.md` and `02-information-architecture-and-navigation.md`
- UX and UI designers: use `02-information-architecture-and-navigation.md`, `03-screen-inventory-and-experience-map.md`, and `04-design-system-and-component-matrix.md`
- Frontend engineering: start with `03-screen-inventory-and-experience-map.md`, `04-design-system-and-component-matrix.md`, and `06-ux-acceptance-accessibility-and-responsive-checklist.md`
- QA teams: use `05-journey-to-screen-mapping.md` and `06-ux-acceptance-accessibility-and-responsive-checklist.md`
- Implementation teams: use `03-screen-inventory-and-experience-map.md` to understand admin, setup, and operational surfaces

UI UX architecture hierarchy:

- Experience model
- Information architecture
- Navigation structure
- Screen inventory
- Component system
- Journey mapping
- UX acceptance and quality gates

Scope note:

- This section is derived from the completed module specifications, deep sub-module specifications, stakeholder journeys, and product backlog
- It is intentionally architecture- and delivery-oriented, not a substitute for pixel-perfect visual design files
- Screen-level wireframes and mockups now exist for the first Wave `0` priority admin screens and can be extended from the same structural baseline
- Later operational families still need additional mockup waves beyond the current Wave `0` pack
