---
id: HRMS-APP-10
title: Screen Action Permission Matrix
document: 10-screen-action-permission-matrix.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a screen-and-action permission matrix that can be used directly by frontend engineering, backend authorization design, QA, and product teams when implementing role-bound experiences.

# 2. Scope Note

This `v1` matrix prioritizes:

- provider-side control-plane screens
- org-admin and high-risk admin screens
- representative business-operational screens across people, recruitment, leave, and payroll

It should be expanded over time into a screen inventory-wide authorization register.

# 3. Role Legend

- `PA` = Platform Admin
- `PSA` = Platform Security Admin
- `OSA` = Org Admin
- `HRA` = HR Admin
- `MGR` = Manager
- `EMP` = Employee
- `PAY` = Payroll Admin
- `REC` = Recruiter

# 4. Screen Action Matrix

| Permission Ref | Screen or Surface | Action | Allowed Roles | Scope Rule | Risk Level | Notes |
|---|---|---|---|---|---|---|
| `PERM-001` | `W0-SCR-001` Platform Admin Home | view dashboard | `PA`, `PSA` | provider control plane only | High | no customer HR transaction widgets |
| `PERM-002` | `W0-SCR-001` Platform Admin Home | enter tenant support context | `PA` with support privilege | approved target tenant only | Critical | requires support-session governance |
| `PERM-003` | `W0-SCR-002` Global Search | search platform objects | `PA`, `PSA` | provider-wide, permission-filtered | High | results must be object- and scope-aware |
| `PERM-004` | `W0-SCR-003` Shared Inbox | complete provider task | `PA`, `PSA` | assigned task only | High | action token and audit required |
| `PERM-005` | `W0-SCR-004` Config Catalog | edit provider scope value | `PA` | provider scope only | Critical | org users must never write provider scope |
| `PERM-006` | `W0-SCR-004` Config Catalog | propose tenant scope override | `OSA`, `HRA` where delegated | own tenant only | High | may route to approval |
| `PERM-007` | `W0-SCR-008` Audit Explorer | view tenant audit | `OSA`, `PSA`, `PA` | own tenant for org roles | High | masking still applies |
| `PERM-008` | `W0-SCR-008` Audit Explorer | export privileged audit evidence | `PSA`, `PA` | provider scope only unless approved tenant export | Critical | export logging mandatory |
| `PERM-009` | `W0-SCR-017` System Settings | edit platform setting | `PA` | provider scope only | Critical | approval for high-risk keys recommended |
| `PERM-010` | `W0-SCR-018` Organization Admin Home | view dashboard | `OSA` | own tenant only | High | must exclude provider-only controls |
| `PERM-011` | `ORG-ADM-001` Access and Roles | assign tenant role | `OSA` | own tenant only | Critical | SoD and high-risk role checks required |
| `PERM-012` | `ORG-ADM-002` Tenant Settings | update tenant defaults | `OSA` | own tenant only | High | writes limited to tenant-safe keys |
| `PERM-013` | `ORG-ADM-004` Identity and SSO Readiness | view IdP status | `OSA` | own tenant only | High | provider-managed failures may be read-only |
| `PERM-014` | `ORG-ADM-005` Workflow and Policy Setup | publish tenant workflow | `OSA`, `HRA` where delegated | own tenant only | High | publish history required |
| `PERM-015` | Employee Profile | view own profile | `EMP` | self only | Medium | masked fields by policy |
| `PERM-016` | Employee Profile | edit employee record | `HRA` | scoped worker population only | High | effective-date and audit required |
| `PERM-017` | Team Dashboard | approve team action | `MGR` | direct and delegated team only | High | proxy and matrix rules apply |
| `PERM-018` | Requisition Workbench | create requisition | `REC`, `HRA`, `MGR` where allowed | own org scope | High | budget and org validation required |
| `PERM-019` | Requisition Workbench | approve requisition | `MGR`, `HRA`, finance approver equivalent | approval route scope only | High | authority matrix enforced |
| `PERM-020` | Leave Request | submit leave | `EMP` | self only | Medium | duplicate submission protection required |
| `PERM-021` | Leave Approval | approve leave | `MGR`, `HRA` | team or delegated queue only | High | must validate current state and balance implications |
| `PERM-022` | Payroll Control Center | launch payroll run | `PAY` | legal entity or payroll group scope only | Critical | dual control candidate |
| `PERM-023` | Payroll Control Center | finalize payroll run | `PAY` with approver authority | payroll group and period scope | Critical | must be audit-heavy and lock-sensitive |
| `PERM-024` | Document Center | generate document | `HRA`, `REC`, `PAY`, `OSA` as applicable | domain-specific scope | High | template and merge authorization both apply |
| `PERM-025` | Document Center | request digital signature | `HRA`, `OSA`, `REC` | document and signer scope only | High | legal-evidence rules apply |

# 5. Engineering Rules

- UI visibility must not be treated as the only authorization layer
- every action above requires backend enforcement against role plus scope
- delegated actions must preserve original actor and delegate actor in audit
- critical actions should return explicit authorization failure reasons for QA and support diagnosability

# 6. Immediate Follow-On Use

Use this matrix for:

- route guards and UI capability maps
- backend authorization policy implementation
- QA role-matrix testing
- SoD and delegated-access reviews
