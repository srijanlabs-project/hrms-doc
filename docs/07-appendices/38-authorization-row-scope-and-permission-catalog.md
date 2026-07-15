---
id: HRMS-APP-38
title: Authorization Row Scope and Permission Catalog
document: 38-authorization-row-scope-and-permission-catalog.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the authorization depth gap by defining module-level row-scope rules, permission-domain detail, and enforcement test coverage expectations.

# 2. Module-Level Row Scope Matrix

| Module | Primary Row Filters |
|---|---|
| People | tenant, worker population, self or HR scope |
| Recruitment | tenant, requisition org scope, recruiter assignment |
| Leave | tenant, employee self, manager team, HR override scope |
| Payroll | tenant, payroll group, legal entity, approver role |
| Documents | tenant, document owner scope, restricted class rules |
| Audit | tenant, privileged investigator scope, support-session context |
| Config | provider or tenant scope plus edit right |

# 3. Permission Domain Catalog

Required permission families:

- `view`
- `search`
- `create`
- `edit`
- `approve`
- `reject`
- `override`
- `export`
- `reveal`
- `configure`
- `replay`

# 4. Delegation and Support Rules

- delegated actions must carry delegated scope and expiry
- support-session actor must be treated as separate actor class
- reveal and export permissions must be separate from normal view

# 5. Enforcement Test Matrix

Minimum test families:

- authorized role valid scope
- authorized role invalid scope
- support-session without approval
- delegated action after expiry
- SoD conflict

