---
id: HRMS-APP-11
title: Configuration Key Catalog
document: 11-configuration-key-catalog.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix provides a seed catalog of high-value configuration keys that engineering and implementation teams can use as the shared reference for scope, owner, defaulting, and risk classification.

# 2. Scope Note

This `v1` catalog is intentionally limited to high-impact keys that influence:

- tenancy and identity
- workflow and notifications
- privacy and support access
- payroll, documents, localization, AI, and resilience

# 3. Configuration Catalog

| Config Ref | Key | Module Owner | Allowed Scope | Value Type | Defaulting Rule | Risk Level | Notes |
|---|---|---|---|---|---|---|---|
| `CFG-001` | `platform.auth.sso.enforced` | identity and access | provider, tenant | boolean | provider default with tenant override if allowed | High | tenant override may be disabled for regulated customers |
| `CFG-002` | `tenant.locale.default` | localization | tenant | string | required at tenant provisioning | Medium | drives shell and template fallback |
| `CFG-003` | `tenant.timezone.default` | tenant management | tenant | string | required at tenant provisioning | Medium | used by scheduling, cutoffs, and dashboards |
| `CFG-004` | `workflow.approval.maxDelegationDays` | workflow engine | provider, tenant | integer | provider default, tenant tighter override allowed | High | affects approval continuity and risk |
| `CFG-005` | `workflow.task.sla.warningHours` | workflow engine | provider, tenant | integer | provider default with tenant override | Medium | drives reminder and escalation timing |
| `CFG-006` | `notification.email.defaultSender` | notification framework | provider, tenant | string | provider baseline, tenant-branded override allowed | High | domain verification required |
| `CFG-007` | `notification.retry.maxAttempts` | notification framework | provider | integer | provider only | High | operational reliability setting |
| `CFG-008` | `security.masking.revealApprovalRequired` | security governance | provider, tenant | boolean | provider default true for restricted data | Critical | should align with privacy policy |
| `CFG-009` | `security.support.session.approvalRequired` | support access control | provider, tenant | boolean | provider default true | Critical | high-trust SaaS control |
| `CFG-010` | `security.audit.export.maxRows` | audit | provider | integer | provider only | High | prevents uncontrolled high-volume export |
| `CFG-011` | `payroll.period.reopen.allowed` | payroll | tenant | boolean | tenant default false | Critical | reopen is highly controlled |
| `CFG-012` | `payroll.validation.blockOnCriticalExceptions` | payroll | tenant | boolean | tenant default true | Critical | affects finalization safety |
| `CFG-013` | `leave.balance.allowNegative` | leave | tenant, leave policy | boolean | tenant default false | High | policy-specific override may apply |
| `CFG-014` | `documents.signature.provider` | document management | provider, tenant | enum | provider default, tenant allowed if connector enabled | High | affects legal signature routing |
| `CFG-015` | `documents.template.approvalRequired` | document engine | provider, tenant | boolean | provider default true | High | controls publish flow for templates |
| `CFG-016` | `integration.webhooks.replayWindowHours` | integration platform | provider, tenant connector | integer | provider default with connector override | High | interacts with event retention policy |
| `CFG-017` | `integration.sync.maxRetryAttempts` | integration platform | provider | integer | provider only | High | operational stability and queue pressure |
| `CFG-018` | `localization.fallback.locale` | localization | provider, tenant | string | provider default `en-IN` or chosen base locale | Medium | tenant fallback may differ by deployment |
| `CFG-019` | `analytics.snapshot.retentionDays` | analytics and BI | provider, tenant | integer | provider default with tenant override if contract allows | Medium | interacts with privacy and storage |
| `CFG-020` | `ai.assist.enabled` | AI and copilot | provider, tenant | boolean | provider default false until approved | High | can be disabled by region or tenant policy |
| `CFG-021` | `ai.assist.restrictedDataAllowed` | AI and copilot | provider, tenant | boolean | provider default false | Critical | depends on masking and governance policy |
| `CFG-022` | `tenant.quota.documentStorageGb` | tenant management | tenant | integer | assigned from package entitlement | Medium | commercial entitlement-driven |
| `CFG-023` | `tenant.quota.apiCallsPerMinute` | tenant management | tenant | integer | assigned from package entitlement | Medium | throttling and contract alignment required |
| `CFG-024` | `backup.restore.customerInitiatedEnabled` | devops and operations | provider, tenant | boolean | provider default false | Critical | org visibility may exist without self-service execution |
| `CFG-025` | `config.cache.defaultTtlSeconds` | configuration service | provider | integer | provider default only | High | baseline cache freshness for non-critical config reads |
| `CFG-026` | `config.publish.dualApprovalRequiredForCritical` | configuration service | provider | boolean | provider default true | Critical | governs publish approval depth for critical keys |
| `CFG-027` | `config.rollback.maxWindowHours` | configuration service | provider, tenant | integer | provider default with tenant tightening allowed | High | limits rollback to governed recent history unless break-glass mode is used |
| `CFG-028` | `jobs.retry.defaultMaxAttempts` | job orchestration | provider | integer | provider default only | High | shared fallback retry ceiling for jobs without queue-specific override |
| `CFG-029` | `jobs.lease.defaultTimeoutSeconds` | job orchestration | provider | integer | provider default only | High | default worker lease duration before stale recovery logic applies |
| `CFG-030` | `jobs.deadLetter.replayApprovalRequired` | job orchestration | provider, tenant | boolean | provider default true with tenant stricter override allowed | Critical | controls whether operator replay of DLQ jobs requires approval |

# 4. Engineering Rules

- every new config key should be assigned a stable `Config Ref`
- risk levels should drive approval, audit, and testing depth
- tenant-visible keys must document whether the provider scope is editable, inherited, or read-only
- runtime services should consume effective values, not raw unresolved scope rows

# 5. Immediate Follow-On Use

This catalog should be referenced by:

- configuration UI design
- runtime configuration service contracts
- implementation playbooks
- release and rollback runbooks
