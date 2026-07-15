---
id: HRMS-APP-14
title: Error and Exception Catalog
document: 14-error-and-exception-catalog.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a seeded cross-module error and exception catalog for engineering, QA, support, implementation, and product teams.

Primary payload and schema standard:

- [17-error-payload-schema-and-recovery-patterns.md](D:/HRMS-doc/docs/07-appendices/17-error-payload-schema-and-recovery-patterns.md)

# 2. Scope Note

This `v1` catalog focuses on:

- authorization and tenancy boundaries
- validation and business-rule failures
- workflow and state-transition failures
- payroll, document, integration, and support-session exceptions

# 3. Error and Exception Catalog

| Error Ref | Error Code | Domain | Category | Typical Trigger | Default Severity | User or Operator Message Intent | Recommended Recovery | Related References |
|---|---|---|---|---|---|---|---|---|
| `ERR-001` | `AUTH-001` | identity and access | authorization | actor lacks required role or scope | High | explain that access is restricted for the current role or data scope | re-evaluate role, delegation, or target scope | [10-screen-action-permission-matrix.md](D:/HRMS-doc/docs/07-appendices/10-screen-action-permission-matrix.md) |
| `ERR-002` | `AUTH-002` | identity and access | tenant boundary | request attempts cross-tenant access | Critical | deny action and avoid data leakage | verify tenant context and actor scope | [11-saas-operating-model/04-data-security-privacy-and-trust-model.md](D:/HRMS-doc/docs/11-saas-operating-model/04-data-security-privacy-and-trust-model.md) |
| `ERR-003` | `CFG-001` | configuration | validation | config key value invalid for type or allowed range | Medium | identify invalid configuration input | correct value and resubmit | [11-configuration-key-catalog.md](D:/HRMS-doc/docs/07-appendices/11-configuration-key-catalog.md) |
| `ERR-004` | `CFG-002` | configuration | scope violation | org admin attempts provider-only key edit | High | explain that the selected scope is read-only | switch to tenant-safe scope or escalate to platform admin | [10-screen-action-permission-matrix.md](D:/HRMS-doc/docs/07-appendices/10-screen-action-permission-matrix.md) |
| `ERR-005` | `PPL-001` | people management | mandatory data missing | employee or contractor lacks required identity or assignment fields | High | indicate missing required workforce master data | complete required fields before activation or submission | [07-entity-ownership-and-module-reference-matrix.md](D:/HRMS-doc/docs/07-appendices/07-entity-ownership-and-module-reference-matrix.md) |
| `ERR-006` | `PPL-002` | people management | illegal transition | employee lifecycle action attempted from invalid current state | High | explain current state does not allow this action | refresh record and use valid next action | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-007` | `REC-001` | recruitment | business rule | requisition submission fails due to missing budget or org context | High | explain requisition cannot proceed until mandatory context is resolved | fix org or budget data | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-008` | `REC-002` | recruitment | state conflict | requisition publish attempted before approval | High | show that approval is required first | complete approval flow | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-009` | `LV-001` | leave | balance violation | leave request exceeds allowed balance or policy | Medium | explain policy or balance breach | revise request or seek approved override if allowed | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-010` | `LV-002` | leave | overlap conflict | overlapping or duplicate leave request detected | Medium | indicate conflicting dates | adjust leave dates and retry | [08-api-registry-and-contract-index.md](D:/HRMS-doc/docs/07-appendices/08-api-registry-and-contract-index.md) |
| `ERR-011` | `WF-001` | workflow | route resolution | no approver or invalid route found | High | indicate routing could not be resolved | correct org data, approver config, or workflow setup | [07-entity-ownership-and-module-reference-matrix.md](D:/HRMS-doc/docs/07-appendices/07-entity-ownership-and-module-reference-matrix.md) |
| `ERR-012` | `WF-002` | workflow | stale action | task completion attempted after state changed or task closed | Medium | explain the task is no longer actionable | refresh inbox and open current active task if any | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-013` | `PAY-001` | payroll | input readiness | payroll run started before inputs or prerequisites are complete | Critical | show that payroll inputs are incomplete | complete inputs and rerun readiness checks | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-014` | `PAY-002` | payroll | exception threshold | payroll finalization blocked by critical validation exceptions | Critical | indicate unresolved blocking exceptions remain | resolve or formally waive exceptions per policy | [11-configuration-key-catalog.md](D:/HRMS-doc/docs/07-appendices/11-configuration-key-catalog.md) |
| `ERR-015` | `DOC-001` | documents | template failure | document generation fails because merge fields or template version are invalid | High | identify template or merge-data issue | fix template, field mapping, or source data | [12-canonical-field-dictionary-seed.md](D:/HRMS-doc/docs/07-appendices/12-canonical-field-dictionary-seed.md) |
| `ERR-016` | `DOC-002` | signatures | signer state conflict | signature request cannot be sent or completed in the current state | High | explain invalid signature lifecycle action | use valid lifecycle action or restart request | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-017` | `INT-001` | integrations | contract mismatch | payload does not match published contract version | High | indicate schema or version mismatch | align producer or consumer to contract ref | [08-api-registry-and-contract-index.md](D:/HRMS-doc/docs/07-appendices/08-api-registry-and-contract-index.md) |
| `ERR-018` | `INT-002` | integrations | delivery failure | webhook or sync delivery failed after retry limit | High | operator-facing failure summary | inspect logs, dead-letter queue, and replay conditions | [09-event-producer-consumer-matrix.md](D:/HRMS-doc/docs/07-appendices/09-event-producer-consumer-matrix.md) |
| `ERR-019` | `SUP-001` | support access | approval failure | support session requested without required approval | Critical | explain that customer or policy approval is required | collect required approval and retry | [11-saas-operating-model/04-data-security-privacy-and-trust-model.md](D:/HRMS-doc/docs/11-saas-operating-model/04-data-security-privacy-and-trust-model.md) |
| `ERR-020` | `OPS-001` | platform operations | replay protection | replay request rejected due to missing idempotency or unresolved root cause | High | warn that replay is unsafe in current state | resolve root cause, validate idempotency, and rerun | [09-event-producer-consumer-matrix.md](D:/HRMS-doc/docs/07-appendices/09-event-producer-consumer-matrix.md) |
| `ERR-021` | `DATA-001` | shared data layer | soft-delete consistency | soft-deleted row appears in active flow, selector, or uniqueness check unexpectedly | High | explain that the record is inactive or logically removed | refresh active data set or use governed restore path | [18-field-validation-standards-and-rule-matrix.md](D:/HRMS-doc/docs/07-appendices/18-field-validation-standards-and-rule-matrix.md) |
| `ERR-022` | `TIME-001` | time semantics | business-date ambiguity | cutoff or `today` computed from wrong timezone or missing business timezone | High | identify timezone or business-date mismatch | resolve timezone source and recompute boundary-sensitive action | [18-field-validation-standards-and-rule-matrix.md](D:/HRMS-doc/docs/07-appendices/18-field-validation-standards-and-rule-matrix.md) |
| `ERR-023` | `CMD-001` | shared command layer | duplicate submit | same approve or submit command arrives twice from double-click or retry | Medium | explain that the action was already accepted or is already in progress | refresh object state instead of resubmitting blindly | [17-error-payload-schema-and-recovery-patterns.md](D:/HRMS-doc/docs/07-appendices/17-error-payload-schema-and-recovery-patterns.md) |
| `ERR-024` | `WF-003` | workflow | concurrent decision conflict | another approver completed the action first | High | indicate task is stale and no longer actionable | refresh the inbox and open current record status | [13-state-transition-matrix.md](D:/HRMS-doc/docs/07-appendices/13-state-transition-matrix.md) |
| `ERR-025` | `IAM-001` | identity and access | inactive login | separated, suspended, expired, or deprovisioned actor attempts login or uses old session | Critical | deny access and explain identity is inactive | contact admin if status is unexpected | [11-saas-operating-model/04-data-security-privacy-and-trust-model.md](D:/HRMS-doc/docs/11-saas-operating-model/04-data-security-privacy-and-trust-model.md) |
| `ERR-026` | `TEN-001` | tenancy | boundary breach | request resolves object by global key but fails tenant ownership check | Critical | deny access without exposing target data | verify tenant context, scope, and object ownership | [11-saas-operating-model/04-data-security-privacy-and-trust-model.md](D:/HRMS-doc/docs/11-saas-operating-model/04-data-security-privacy-and-trust-model.md) |
| `ERR-027` | `IMP-001` | implementation and migration | preview required | import commit attempted before preview, validation, or governed signoff | High | explain that preview and validation must complete first | return to preview workbench, resolve comments, then commit | [19-validation-rule-implementation-traceability-matrix.md](D:/HRMS-doc/docs/07-appendices/19-validation-rule-implementation-traceability-matrix.md) |

# 4. Engineering Rules

- every externally visible or operator-visible error should map to a stable error code
- distinguish validation failures, authorization failures, state conflicts, dependency failures, and transient platform issues
- error responses should be safe for multi-tenant and privacy-sensitive environments
- QA negative tests should reference stable `Error Ref` values where possible

# 5. Immediate Follow-On Use

This catalog should feed:

- API error response design
- support runbooks
- negative QA matrices
- message-template catalog for system errors and alerts
