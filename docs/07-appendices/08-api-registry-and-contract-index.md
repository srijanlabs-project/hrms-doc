---
id: HRMS-APP-08
title: API Registry and Contract Index
document: 08-api-registry-and-contract-index.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a cross-module API registry with stable contract identifiers so engineering teams can route ownership, auth scope, idempotency expectations, and downstream dependency analysis without re-reading each module specification.

# 2. Scope Note

This is a prioritized `v1` registry covering:

- platform and tenancy administration
- people and workforce master flows
- recruitment, leave, payroll, and document flows
- profile-maintenance, identity-update, and employee import flows
- workflow, event, and integration controls

Schema documents are not yet broken out into separate files. Until that layer exists, the `Contract Ref` values below should be treated as the stable placeholders for request and response families.

# 3. API Registry

| API Ref | Domain | Method | Endpoint | Primary Owner | Primary Auth Scope | Idempotency Rule | Contract Ref | Key Notes |
|---|---|---|---|---|---|---|---|---|
| `API-001` | Tenant Management | `POST` | `/api/v1/admin/tenants` | platform core | Platform Admin | client-supplied idempotency key recommended | `CTR-TENANT-POST-001` | provider-side tenant creation only |
| `API-002` | Tenant Management | `PATCH` | `/api/v1/admin/tenants/{tenantId}` | platform core | Platform Admin | patch must be optimistic-lock aware | `CTR-TENANT-PATCH-001` | supports lifecycle-safe edits only |
| `API-003` | Tenant Management | `POST` | `/api/v1/admin/tenants/{tenantId}/activate` | platform core | Platform Admin | command-style endpoint; one active transition only | `CTR-TENANT-CMD-001` | audit mandatory |
| `API-004` | Org Admin | `GET` | `/api/v1/org-admin/tenant-profile` | tenant admin service | Org Admin | read only | `CTR-ORGADMIN-GET-001` | tenant-scoped visibility only |
| `API-005` | Configuration | `GET` | `/api/v1/config/entries` | config service | Platform Admin, Org Admin | read only | `CTR-CONFIG-GET-001` | returns scope-aware effective values |
| `API-006` | Configuration | `POST` | `/api/v1/config/entries/proposals` | config service | Platform Admin, Org Admin | idempotency key required for create | `CTR-CONFIG-POST-001` | org admin cannot modify provider-only scopes |
| `API-007` | People Management | `POST` | `/api/v1/employees` | people core | HR Admin | idempotency key required for create | `CTR-EMP-POST-001` | onboarding and migration source paths share contract family |
| `API-008` | People Management | `GET` | `/api/v1/employees/{employeeId}` | people core | HR Admin, Manager, Employee scoped | read only | `CTR-EMP-GET-001` | response masking depends on role and scope |
| `API-009` | People Actions | `POST` | `/api/v1/employees/{employeeId}/lifecycle-actions` | people core | HR Admin | command idempotency by action token | `CTR-EMPLIFE-POST-001` | promotion, transfer, confirmation, exit-triggered actions |
| `API-010` | External Workforce | `POST` | `/api/v1/external-workforce/contractors` | external workforce core | HR Admin, Workforce Admin | idempotency key required | `CTR-CONTRACTOR-POST-001` | vendor and sponsor validation required |
| `API-011` | Recruitment | `POST` | `/api/v1/recruitment/requisitions` | talent acquisition core | Recruiter, HR Admin | idempotency key recommended | `CTR-REQ-POST-001` | must validate org and budget context |
| `API-012` | Recruitment | `POST` | `/api/v1/recruitment/requisitions/{requisitionId}/submit` | talent acquisition core | Recruiter, Hiring Manager | single-submit command | `CTR-REQ-CMD-001` | approval workflow kickoff |
| `API-013` | Recruitment | `POST` | `/api/v1/recruitment/candidates/{candidateId}/offer` | talent acquisition core | Recruiter, HR Admin | one draft offer per version | `CTR-OFFER-POST-001` | links to document generation and approvals |
| `API-014` | Leave Management | `POST` | `/api/v1/leave/requests` | leave service | Employee | idempotency key required | `CTR-LEAVE-POST-001` | duplicate mobile resubmits must be safe |
| `API-015` | Leave Management | `POST` | `/api/v1/leave/requests/{requestId}/approve` | leave service | Manager, HR Admin | command idempotency by action token | `CTR-LEAVE-CMD-001` | decision requires current-state validation |
| `API-016` | Workforce Time | `POST` | `/api/v1/time/attendance/imports` | time service | HR Admin, Time Admin | import batch idempotency required | `CTR-TIME-POST-001` | row-level reconciliation feedback expected |
| `API-017` | Payroll | `POST` | `/api/v1/payroll/runs` | payroll core | Payroll Admin | idempotency key required | `CTR-PAYRUN-POST-001` | creates run shell only, not final results |
| `API-018` | Payroll | `POST` | `/api/v1/payroll/runs/{runId}/validate` | payroll core | Payroll Admin | rerunnable command with new attempt record | `CTR-PAYRUN-CMD-001` | validation outputs exception set |
| `API-019` | Payroll | `POST` | `/api/v1/payroll/runs/{runId}/finalize` | payroll core | Payroll Admin, Finance Approver | single finalization command | `CTR-PAYRUN-CMD-002` | high-risk dual control candidate |
| `API-020` | Documents | `POST` | `/api/v1/documents/generate` | document engine | HR Admin, Recruiter, Payroll Admin | idempotency by merge request hash | `CTR-DOC-POST-001` | template plus merge context required |
| `API-021` | Documents | `POST` | `/api/v1/documents/{documentId}/signatures/request` | signature service | HR Admin, Org Admin scoped | command idempotency by signer set | `CTR-SIGN-POST-001` | legal evidence retention required |
| `API-022` | Workflow | `GET` | `/api/v1/workflows/tasks` | workflow engine | all authenticated role-scoped users | read only | `CTR-TASK-GET-001` | permission filters mandatory |
| `API-023` | Workflow | `POST` | `/api/v1/workflows/tasks/{taskId}/complete` | workflow engine | task assignee or delegate | command idempotency by decision token | `CTR-TASK-CMD-001` | supports decision and rationale payload |
| `API-024` | Audit | `GET` | `/api/v1/audit/events` | audit engine | Platform Admin, Security Admin, Org Admin scoped | read only | `CTR-AUDIT-GET-001` | masking and export restrictions apply |
| `API-025` | Event Bus | `POST` | `/api/v1/platform/events/publish` | event bus | Service Identity, Platform Admin | event id must be unique per producer | `CTR-EVT-POST-001` | internal administrative publish surface only |
| `API-026` | Event Bus | `POST` | `/api/v1/platform/events/replay` | event bus | Platform Admin, Support Ops | replay job idempotency required | `CTR-EVT-CMD-001` | replay cannot bypass consumer safety rules |
| `API-027` | Integration Platform | `POST` | `/api/v1/integrations/webhooks/subscriptions` | integration hub | Platform Admin, Org Admin scoped | idempotency key required | `CTR-WEBHOOK-POST-001` | scope differs by connector ownership |
| `API-028` | Integration Platform | `GET` | `/api/v1/integrations/contracts` | integration hub | Platform Admin, Integration Admin | read only | `CTR-CONTRACT-GET-001` | version and owner metadata mandatory |
| `API-029` | Access Governance | `POST` | `/api/v1/security/access-reviews/campaigns` | security governance | Security Admin | idempotency key required | `CTR-ACCESSREV-POST-001` | provider-side campaign creation |
| `API-030` | Support Access | `POST` | `/api/v1/platform/support-sessions` | platform support control | Platform Support Admin | idempotency key required | `CTR-SUPPORT-POST-001` | target tenant, reason, approval context required |
| `API-031` | People Management | `PATCH` | `/api/v1/people/employees/{employeeId}/personal-information` | people core | Employee scoped, HR Admin | optimistic-lock aware patch required | `CTR-EMP-PER-PATCH-001` | primary contract for personal-information validation and correction flows |
| `API-032` | People Management | `PATCH` | `/api/v1/people/employees/{employeeId}/contact-information` | people core | Employee scoped, HR Admin | optimistic-lock aware patch required | `CTR-EMP-CON-PATCH-001` | contact details, emergency contacts, and address maintenance |
| `API-033` | Identity and Access | `POST` | `/api/v1/people/employees/{employeeId}/contact-information/mobile-otp/request` | identity and access | Employee scoped, HR Admin | request-level rate limit and anti-replay controls required | `CTR-EMP-MOB-OTP-POST-001` | requests OTP for pending mobile number verification |
| `API-034` | Identity and Access | `POST` | `/api/v1/people/employees/{employeeId}/contact-information/mobile-otp/verify` | identity and access | Employee scoped, HR Admin | verification token idempotency required | `CTR-EMP-MOB-OTP-CMD-001` | activates pending mobile only after successful verification |
| `API-035` | People Management | `PATCH` | `/api/v1/people/employees/{employeeId}/national-identities/{identityId}` | compliance and identity operations | Employee scoped, HR Admin, Compliance Admin | optimistic-lock aware patch required | `CTR-EMP-ID-PATCH-001` | PAN, Aadhaar, passport, visa, and work authorization maintenance |
| `API-036` | People Management | `POST` | `/api/v1/people/employees/{employeeId}/dependents` | people core | Employee scoped, HR Admin | idempotency key required for create | `CTR-EMP-DEP-POST-001` | dependent create and governed family-data update entry point |
| `API-037` | People Management | `POST` | `/api/v1/people/employees/{employeeId}/bank-accounts` | payroll operations | Employee scoped, HR Admin, Payroll Admin | idempotency key required for create or change request | `CTR-EMP-BANK-POST-001` | bank-account creation and change-request initiation |
| `API-038` | Statutory and Compliance | `POST` | `/api/v1/people/employees/{employeeId}/pf-enrollments` | payroll compliance | HR Admin, Payroll Admin, Compliance Admin | idempotency key required | `CTR-EMP-PF-POST-001` | PF and UAN enrollment or correction entry point |
| `API-039` | Documents | `POST` | `/api/v1/people/employees/{employeeId}/documents` | document repository | Employee scoped, HR Admin, Compliance Admin | idempotency by content hash recommended | `CTR-EMP-DOC-POST-001` | employee evidence and identity-document upload surface |
| `API-040` | Implementation and Migration | `POST` | `/api/v1/imports/employees/validate` | implementation tooling | HR Admin, Implementation Lead | import batch idempotency required | `CTR-IMP-EMP-POST-001` | multi-template employee, identity, dependent, bank, and PF validation entry point |
| `API-041` | Implementation and Migration | `POST` | `/api/v1/imports/employees/commit` | implementation tooling | HR Admin, Implementation Lead | commit command idempotency required | `CTR-IMP-EMP-CMD-001` | commits previously validated staging batches under governed controls |

# 4. Engineering Rules

- every new API should receive a stable `API Ref` and `Contract Ref` before implementation starts
- contract breaking changes must issue a new contract reference or governed version increment
- auth scope must be explicit and testable, not inferred from UI placement
- command endpoints should prefer idempotency tokens for user-triggered or integration-triggered writes

# 5. Immediate Follow-On Use

This registry should be used to drive:

- OpenAPI breakdown and service ownership
- endpoint authorization tests
- integration mapping and webhook design
- event and audit traceability
