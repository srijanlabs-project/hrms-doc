---
id: HRMS-APP-28
title: Service OpenAPI Contract Master Pack
document: 28-service-openapi-contract-master-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the remaining OpenAPI-ready contract depth gap by mapping every major domain and shared service to its required API contract families, standard schema components, and error-envelope expectations.

# 2. Standard Contract Families

Every service contract should use these common schema families:

- `CommandAcceptedResponse`
- `SingleResourceResponse`
- `PaginatedListResponse`
- `ValidationErrorResponse`
- `StateConflictErrorResponse`
- `AuthorizationErrorResponse`
- `TenantBoundaryErrorResponse`
- `TransientPlatformErrorResponse`

# 3. Service Contract Coverage Matrix

| Service | Core Contract Families | Key Endpoints That Must Exist |
|---|---|---|
| `Tenant and Org Core Service` | tenant create or update, org structure query, legal entity manage, location manage | `/api/v1/admin/tenants`, `/api/v1/org/legal-entities`, `/api/v1/org/departments`, `/api/v1/org/locations` |
| `People Core Service` | employee create, employee patch, lifecycle action, assignment action, identifier update, dependent CRUD | `/api/v1/employees`, `/api/v1/employees/{employeeId}`, `/api/v1/employees/{employeeId}/lifecycle-actions`, `/api/v1/people/employees/{employeeId}/dependents` |
| `Recruitment Service` | requisition create, approve, candidate create, interview schedule, offer issue | `/api/v1/recruitment/requisitions`, `/api/v1/recruitment/candidates`, `/api/v1/recruitment/interviews`, `/api/v1/recruitment/offers` |
| `Workforce Time Service` | attendance import, correction request, shift publish, roster publish, timesheet submit | `/api/v1/time/attendance/imports`, `/api/v1/time/corrections`, `/api/v1/time/shifts`, `/api/v1/time/rosters`, `/api/v1/time/timesheets` |
| `Leave Service` | leave request submit, approve, balance query, policy publish, accrual run | `/api/v1/leave/requests`, `/api/v1/leave/requests/{requestId}/approve`, `/api/v1/leave/balances`, `/api/v1/leave/policies` |
| `Payroll Service` | run create, freeze inputs, process, exception resolve, finalize | `/api/v1/payroll/runs`, `/api/v1/payroll/runs/{runId}/freeze-inputs`, `/api/v1/payroll/runs/{runId}/process`, `/api/v1/payroll/runs/{runId}/finalize` |
| `Workflow and Approval Service` | instance create, task list, task complete, reassign, override | `/api/v1/workflows/instances`, `/api/v1/workflows/tasks`, `/api/v1/workflows/tasks/{taskId}/complete`, `/api/v1/workflows/tasks/{taskId}/override` |
| `Notification Service` | send, status, retry, template CRUD, preference query | `/api/v1/platform/notifications/send`, `/api/v1/platform/notifications/{id}/status`, `/api/v1/platform/notifications/retry/{notificationId}`, `/api/v1/platform/notifications/templates` |
| `Configuration Service` | definitions list, effective resolution, draft create, publish, rollback | `/api/v1/platform/config/definitions`, `/api/v1/platform/config/effective`, `/api/v1/platform/config/changes`, `/api/v1/platform/config/rollback` |
| `File Service` | upload session create, scan callback, signed download link, metadata query | `/api/v1/files/upload-sessions`, `/api/v1/files/{fileId}`, `/api/v1/files/{fileId}/download-link`, `/api/v1/files/{fileId}/scan-callback` |
| `Document Generation Service` | template CRUD, publish, generate, batch generate, output fetch | `/api/v1/platform/documents/templates`, `/api/v1/platform/documents/generate`, `/api/v1/platform/documents/batch-generate`, `/api/v1/platform/documents/jobs/{jobId}` |
| `Audit Service` | ingest, search, entity timeline, evidence export, legal hold | `/api/v1/platform/audit/events`, `/api/v1/platform/audit/events`, `/api/v1/platform/audit/entities/{entityType}/{entityId}`, `/api/v1/platform/audit/evidence-pack` |
| `Integration Hub Service` | connector CRUD, contract publish, run create, trace query, replay | `/api/v1/platform/integrations/connectors`, `/api/v1/platform/integrations/contracts/{contractId}/publish`, `/api/v1/platform/integrations/runs`, `/api/v1/platform/integrations/dead-letter/{deadLetterId}/replay` |
| `Search Service` | query, object reindex, tenant reindex, health | `/api/v1/search`, `/api/v1/search/reindex/object`, `/api/v1/search/reindex/tenant`, `/api/v1/search/health` |
| `Number Series Service` | preview, reserve, issue, cancel reservation | `/api/v1/platform/number-series/preview`, `/api/v1/platform/number-series/reserve`, `/api/v1/platform/number-series/issue`, `/api/v1/platform/number-series/reservations/{reservationId}/cancel` |
| `AI or Copilot Service` | inference, prompt version query, evaluation submission, policy check | `/api/v1/ai/inference`, `/api/v1/ai/prompts/{promptKey}`, `/api/v1/ai/evaluations`, `/api/v1/ai/policy/check` |
| `Job Orchestration Service` | enqueue, run query, retry, cancel, queue health | `/api/v1/platform/jobs/enqueue`, `/api/v1/platform/jobs/runs/{jobRunId}`, `/api/v1/platform/jobs/runs/{jobRunId}/retry`, `/api/v1/platform/jobs/queues/health` |

# 4. Contract Design Requirements

- all command endpoints must declare idempotency behavior
- all list endpoints must declare pagination, filtering, and sort fields
- all state-bearing resources must declare allowed transitions or related command endpoints
- all contracts must use the canonical error payload family
- all high-risk endpoints must declare audit and authorization consequences

# 5. Shared Request Header Requirements

Required where applicable:

- `Authorization`
- `X-Correlation-Id`
- `X-Tenant-Code`
- `Idempotency-Key`
- `If-Match`
- `X-Timezone`

# 6. Service-by-Service Schema Completion Rule

For a service to be considered contract-complete, it must have:

- request schema
- response schema
- error schema family references
- idempotency or concurrency rules
- security and scope note
- event side-effect note where applicable

