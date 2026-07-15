---
id: HRMS-XCUT-10
title: Configuration Runtime Resolution and Governance
document: 10-configuration-runtime-resolution-and-governance.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the runtime behavior of the Enterprise HRMS configuration system, including precedence resolution, cache strategy, publish and activation semantics, rollback, secret handling, and operational governance.

# 2. Scope

This standard applies to:

- provider defaults
- tenant overrides
- module and feature configuration
- country, legal-entity, business-unit, and policy-scoped overrides
- user-segment or role-sensitive resolution where explicitly supported
- configuration publish, schedule, activation, and rollback
- runtime cache and invalidation behavior
- secret-like and high-risk configuration entries

It complements the configuration framework specification and the configuration key catalog by defining how configuration actually behaves at runtime.

# 3. Why This Matters

The HRMS platform depends on configuration for:

- tenant setup and branding
- workflow SLAs and approvals
- payroll controls
- leave behavior
- support-access restrictions
- localization fallback
- notification delivery rules
- integration replay limits
- AI enablement and data-governance controls
- queue and job orchestration defaults

If resolution rules are ambiguous, teams will get inconsistent behavior between UI, API, jobs, reports, and background workers.

# 4. Configuration Runtime Position

The `Configuration Service` should be treated as a shared platform service that:

- owns configuration definitions and resolved effective values
- enforces precedence and scope rules
- publishes activation events
- exposes runtime resolution APIs and caches
- protects secret and critical configuration values
- preserves rollback-safe version lineage

Domain services may cache effective values, but they must not become alternate systems of record for configuration state.

# 5. Configuration Object Model

## 5.1 Required Configuration Artifacts

Every configuration key should have:

- stable config reference
- canonical key name
- value type
- allowed scope list
- defaulting rules
- risk classification
- owner module or service
- validation rules
- publish policy
- rollback policy

## 5.2 Runtime Entities

Recommended runtime entities:

- `config_definition`
- `config_scope`
- `config_value_entry`
- `config_value_version`
- `config_publish_batch`
- `config_resolution_cache`
- `config_secret_reference`
- `config_change_audit_link`

# 6. Scope Hierarchy and Resolution

## 6.1 Supported Scopes

The platform should support these scope types where relevant:

- `Provider`
- `Tenant`
- `Environment`
- `Country`
- `Legal Entity`
- `Business Unit`
- `Location`
- `Module`
- `Policy`
- `User Segment`

Not every key should allow every scope.

## 6.2 Baseline Resolution Order

Default resolution order should be:

1. Provider default
2. Tenant
3. Country
4. Legal Entity
5. Business Unit or Location
6. Module
7. Policy or business-object-specific scope
8. User Segment

Rules:

- resolution order must be explicit per key if it differs from the baseline
- lower scopes may override higher scopes only when definition rules allow it
- secret and provider-only keys must ignore unauthorized lower-scope entries
- effective resolution must return both final value and lineage

## 6.3 Context-Aware Resolution

Runtime resolution requests should support context inputs such as:

- `tenant_id`
- `legal_entity_id`
- `country_code`
- `location_id`
- `module_code`
- `policy_id`
- `user_segment`
- `business_timezone`

If required context is missing:

- the service should apply defined fallback behavior
- the response should surface that fallback path rather than silently guessing

# 7. Value Types and Validation

Supported value classes should include:

- boolean
- integer
- decimal
- string
- enum
- list
- map or structured JSON
- secret reference

Validation rules:

- type mismatch must block publish
- range and regex constraints must be validated before activation
- enum values must align with governed code lists
- JSON structures must validate against a schema version where used
- cross-key dependency conflicts must be detected before activation

# 8. Effective Value Response Contract

Every runtime resolution response should include:

- key
- effective value
- effective value type
- resolved scope
- source version ID
- fallback path used
- risk level
- secret-mask indicator
- resolved at timestamp

Recommended shape:

```json
{
  "key": "workflow.task.sla.warningHours",
  "value": 24,
  "valueType": "integer",
  "resolvedScope": "tenant",
  "lineage": [
    "provider",
    "tenant"
  ],
  "sourceVersionId": "cfgv_01J...",
  "riskLevel": "Medium",
  "secretMasked": false,
  "resolvedAt": "2026-07-15T12:00:00Z"
}
```

# 9. Publish and Activation Model

## 9.1 Draft to Active Flow

Recommended flow:

1. configuration change is drafted
2. validation runs
3. approval occurs if required
4. publish batch is created
5. activation happens immediately or on schedule
6. activation event is emitted
7. caches are invalidated or refreshed

## 9.2 Activation Types

Supported activation modes:

- immediate
- scheduled at UTC timestamp
- scheduled at tenant-local business time
- staged rollout by tenant cohort or environment

## 9.3 Publish Safety Rules

- high-risk changes should require explicit impact acknowledgment
- critical payroll, security, support-access, and AI governance keys may require dual approval
- scheduled activation must define timezone interpretation
- publish should be atomic within a batch or fail clearly with no partial active state for the targeted batch

# 10. Cache Strategy

## 10.1 Cache Layers

Configuration may be cached at:

- configuration service resolver cache
- service-local memory cache
- edge or API gateway cache for low-risk reads
- client cache for low-risk public metadata only where allowed

## 10.2 Cache Rules

- high-risk and secret-like values should favor shorter TTLs or event-driven invalidation
- domain services should never rely only on indefinite local cache for critical configuration
- caches must be namespace-aware by environment and tenant
- cache keys must include enough context to avoid scope leakage

## 10.3 Invalidation Rules

Cache invalidation should support:

- publish-batch-triggered invalidation
- targeted key invalidation
- tenant-specific invalidation
- emergency global flush for critical incidents

Invalidation events should be auditable for critical keys.

# 11. Rollback Model

## 11.1 Rollback Requirements

Rollback must preserve:

- original value version
- replacement value version
- actor and approval lineage
- reason code
- rollback timestamp
- impacted scopes

## 11.2 Rollback Rules

- rollback should restore last known valid active version, not an arbitrary stale value
- rollback of provider-scope values must evaluate effect on tenant overrides
- rollback during high-risk windows such as payroll close should require explicit impact review unless emergency break-glass policy is invoked
- rollback must emit its own activation event and cache invalidation

# 12. Secret and Restricted Configuration

## 12.1 Secret Handling

Secret-like configuration should not store raw values in general config tables when avoidable.

Use:

- secret reference IDs
- provider vault integration
- masked retrieval
- rotation metadata

Examples:

- SMTP credentials
- webhook signing secrets
- SSO client secrets
- connector tokens

## 12.2 Access Rules

- only privileged service principals should resolve raw secret values
- UI and audit views should display masked values or reference metadata only
- support access must not reveal secrets by default even with tenant support approval

# 13. Runtime Failure and Fallback Rules

## 13.1 Resolver Failure Behavior

If the configuration service is temporarily unavailable:

- low-risk reads may use last-known-good cache if freshness rules allow
- critical writes or critical read-before-action flows may need to fail closed
- failure posture should be key-class aware, not globally uniform

## 13.2 Fallback Posture by Risk

| Risk Level | Preferred Failure Posture |
|---|---|
| `Critical` | fail closed or use explicitly approved last-known-good value only |
| `High` | use bounded last-known-good value if freshness is acceptable, otherwise fail |
| `Medium` | use cached value and raise diagnostic event |
| `Low` | use cached or defaulted value with observability note |

# 14. Audit and Observability

## 14.1 Required Audit Coverage

Audit should capture:

- definition creation and updates
- scope changes
- approvals
- publishes and rollbacks
- cache invalidation for high-risk changes
- raw-secret access attempts and approvals

## 14.2 Required Telemetry

Resolver telemetry should include:

- key
- tenant context
- resolved scope
- fallback used
- cache hit or miss
- resolution latency
- error category

## 14.3 Dashboards and Alerts

Dashboards should show:

- high-risk config changes
- recent rollbacks
- cache invalidation lag
- resolver latency
- fallback frequency by key
- failed publish or validation batches

Alerts should exist for:

- repeated resolution failures
- cache inconsistency spike
- emergency rollback
- provider-scope critical configuration change

# 15. Multi-Tenant and SaaS Rules

- provider-only keys must not be editable by Org Admin users
- tenant-visible effective values must only expose keys allowed for tenant plane visibility
- platform-side support tools may inspect configuration lineage, but customer HR data configuration must remain tenant-scoped
- configuration used by provider platform operations must stay separate from customer HR operational data

# 16. Relationship to Localization

Localization should reuse the configuration runtime for:

- tenant default locale
- fallback locale chain
- content variant toggles
- locale-sensitive feature rollout flags

Localization bundles remain a separate domain, but locale resolution policy should not be reimplemented independently.

# 17. Relationship to Job Orchestration

The queue and job orchestration runtime should consume governed configuration for:

- retry attempts
- lease timeout
- replay approval requirement
- queue-specific throttles
- maintenance retention windows

These values should resolve through the configuration service rather than hardcoded worker defaults.

# 18. Anti-Patterns to Avoid

- hardcoding tenant behavior in service code when configuration already exists
- resolving raw scope rows in domain services instead of effective values
- hiding fallback or default behavior from diagnostics
- storing secrets as plain config strings in general tables
- publishing partial config batches with mixed active state
- letting client-side caches determine security-critical behavior

# 19. Test Expectations

Every high-risk configuration domain should have tests for:

- provider default resolution
- tenant override resolution
- conflict between overlapping scopes
- publish and immediate activation
- scheduled activation in tenant-local timezone
- rollback restoration
- cache invalidation after publish
- secret masking and restricted access
- resolver behavior during configuration service outage

# 20. Immediate Follow-On Work

This standard should next drive:

- configuration service OpenAPI contracts
- ERD and DDL for configuration entities
- admin console screen definitions for publish, compare, and rollback
- environment promotion and drift runbooks
- localization and job-runtime config implementation packs
