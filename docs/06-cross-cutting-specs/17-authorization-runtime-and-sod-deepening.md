---
id: HRMS-XCUT-17
title: Authorization Runtime and SoD Deepening
document: 17-authorization-runtime-and-sod-deepening.md
version: 1.0
status: Draft
---

# 1. Purpose

This document deepens the platform authorization model into runtime enforcement rules for row-level access, delegated access, support-session access, segregation of duties, and state-aware authorization.

# 2. Scope

This standard applies to:

- API authorization
- UI capability checks
- row-level data filtering
- delegated and proxy actions
- support-session and provider-plane access
- SoD evaluation
- state-aware action authorization

# 3. Row-Level Authorization Rules

Every significant read or write path must evaluate:

- tenant scope
- role or permission
- data scope such as legal entity, department, manager hierarchy, or worker population
- object state
- deny rules and SoD conflicts

Baseline row-level scope patterns:

- self only
- direct reports
- indirect reports
- legal-entity scoped
- location scoped
- module-admin scoped
- provider support scoped

# 4. State-Aware Authorization

Authorization must not stop at role plus scope.

The platform should also validate:

- object current state
- workflow ownership
- task assignment or delegation status
- approval stage
- lock or finalization status

Examples:

- payroll run finalize requires both payroll authority and correct run state
- leave approval requires authorized team scope and open approvable state
- document evidence export requires export permission and allowed document lifecycle state

# 5. Delegated Access Rules

- delegation must be active at decision time
- delegated scope cannot exceed delegator scope
- non-delegable actions must hard-block
- delegated actions must preserve both original and acting actor in audit
- delegation expiration must invalidate cached access immediately or near-immediately

# 6. Support-Session Access Rules

- support access must remain outside normal Org Admin and HR permissions
- support-session access should be explicitly targeted to tenant and time window
- support sessions must not silently inherit provider-global visibility into unrestricted tenant content
- sensitive reveals inside support sessions may require additional approval based on data class

# 7. Segregation of Duties Rules

SoD evaluation should support:

- preventive block on risky combinations
- detective alerting where soft enforcement is chosen
- temporary exception with approval and expiry

High-risk combinations include:

- payroll processing plus payroll approval
- security policy edit plus security audit closure
- role assignment plus access review closure
- configuration publish plus production rollback approval

# 8. Runtime Enforcement Points

Enforce authorization at:

- route or endpoint entry
- service command handler
- row filter or query builder
- workflow action handler
- export or reveal pipeline
- job replay and operator action APIs

UI-only hiding is never sufficient.

# 9. Test Expectations

- tenant leakage denial
- delegated approval allowed only in valid window
- support-session scoped visibility
- SoD block on risky combo
- stale state blocks action even with permission

